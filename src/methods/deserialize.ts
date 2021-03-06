import * as util from "util";

import { JsonValue, IDynamicObject, JsonValueObject, JsonValueArray, IParseOptions } from "../types";
import { objectDefinitions, getTypedInheritanceChain, ObjectDefinition } from "../classes/object-definition";
import { PropertyDefinition } from "../classes/property-definition";
import { propertyConverters } from "../converters/converter";

export function deserialize(
    object:JsonValue,
    type?:Function,
    options:IParseOptions = { runConstructor: false, keyToPreserveUnknownJSON: undefined }):any {

    if (object && object.constructor === Array) {
        return (object as JsonValueArray).map(o => deserializeRootObject(o, type, options));
    }

    return deserializeRootObject(object, type, options);
}

function deserializeRootObject(object:JsonValue, objectType:Function = Object, options:IParseOptions):any {
    if (!objectDefinitions.has(objectType)) {
        return object;
    }

    const values = object as JsonValueObject;

    const [type, ...superTypes] = getTypedInheritanceChain(objectType, values);

    const output = Object.create(type.prototype);

    const definitions = [...superTypes.reverse(), type].map(t => objectDefinitions.get(t)).filter(t => !!t) as ObjectDefinition[];

    definitions.forEach(d => {
        if (options.runConstructor) {
            d.ctr.call(output);
        }

        d.beforeDeserialized.call(output);

        d.properties.forEach((p, key) => {
            if (!p.type) {
                throw new Error(`Cannot deserialize property '${key}' without type!`);
            }

            const value = values[p.serializedName];

            if (value == undefined || p.readonly) {
                return;
            }

            if (p.array || p.set) {
                output[key] = deserializeArray(value, p, options);
                if (p.set) {
                    output[key] = new Set<any>(output[key]);
                }
                return;
            }

            output[key] = deserializeObject(value, p, options);
        });

        d.onDeserialized.call(output);
    });

    if (options.keyToPreserveUnknownJSON) {
        const anchor = options.keyToPreserveUnknownJSON;
        Object.keys(values).forEach(jsonProp => {
            if (values.hasOwnProperty(jsonProp)) {
                let property:PropertyDefinition | undefined;
                definitions.forEach(d => {
                    d.properties.forEach((p, key) => {
                        if (!property && jsonProp === p.serializedName) {
                            property = p;
                            // break
                        }
                    });
                    if (!property) {
                        if (!output[anchor]) {
                            output[anchor] = {};
                        }
                        if (typeof output[anchor][jsonProp] !== "undefined") {
                            // console.log(`???!!! TAJSON keyToPreserveUnknownJSON already deserialized?! ${anchor}.${jsonProp}`);
                            // // breakLength: 100  maxArrayLength: undefined
                            // tslint:disable-next-line: max-line-length
                            // console.log(util.inspect(output[anchor][jsonProp], { showHidden: false, depth: 1000, colors: true, customInspect: false }));

                            if (output[anchor][jsonProp] !== values[jsonProp]) {
                                console.log(`???!!! TAJSON keyToPreserveUnknownJSON already deserialized DIFF?! ${anchor}.${jsonProp}`);
                                // breakLength: 100  maxArrayLength: undefined
                                // tslint:disable-next-line: max-line-length
                                console.log(util.inspect(values[jsonProp], { showHidden: false, depth: 1000, colors: true, customInspect: false }));
                            }
                        }
                        // warning: reference copy, not deep clone!
                        output[anchor][jsonProp] = values[jsonProp];
                    } else if (output[anchor] && typeof output[anchor][jsonProp] !== "undefined") {
                        // note: jsonProp === property.serializedName

                        // output[anchor][jsonProp] = undefined;
                        delete output[anchor][jsonProp];
                    }
                });
            }
        });
        if (output[anchor] && !Object.keys(output[anchor]).length) {
            delete output[anchor];
        }
    }

    return output;
}

function deserializeArray(array:JsonValue, definition:PropertyDefinition, options:IParseOptions):IDynamicObject {

    const converter = definition.converter || propertyConverters.get(definition.type);
    const arr = (array instanceof Array) ?
        array :
        (converter && converter.collapseArrayWithSingleItem() ?
            [array] :
            array);
    return (arr as JsonValueArray).map(v => deserializeObject(v, definition, options));
}

function deserializeObject(object:JsonValue, definition:PropertyDefinition, options:IParseOptions):IDynamicObject {
    const primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    const value:any = object;

    const converter = definition.converter || propertyConverters.get(definition.type);
    if (converter) {
        return converter.deserialize(value);
    }

    if (!primitive) {
        const objDefinition = objectDefinitions.get(definition.type);

        if (objDefinition) {
            return deserialize(value, definition.type, options);
        }
    }

    return value;
}
