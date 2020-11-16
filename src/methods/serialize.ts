import * as util from "util";

import { propertyConverters } from "./../converters/converter";
import { PropertyDefinition } from "../classes/property-definition";
import { JsonValue, IDynamicObject, IGenerateOptions } from "../types";
import { objectDefinitions, getInheritanceChain, getTypedInheritanceChain, ObjectDefinition } from "../classes/object-definition";

export function serialize(
    value:IDynamicObject | IDynamicObject[],
    type?:Function,
    options:IGenerateOptions = { keyToPreserveUnknownJSON: undefined }):JsonValue {

    if (value.constructor === Array) {
        return (value as IDynamicObject[]).map(o => serializeRootObject(o, type, options));
    }

    return serializeRootObject(value as IDynamicObject, type, options);
}

function serializeRootObject(
    object:IDynamicObject,
    type:Function = Object.getPrototypeOf(object).constructor,
    options:IGenerateOptions):JsonValue {

    const inheritanceChain = getTypedInheritanceChain(type);

    if (inheritanceChain.length === 0) {
        return object;
    }

    const definitions = inheritanceChain
        .map(t => objectDefinitions.get(t))
        .filter(t => !!t) as ObjectDefinition[]; // Typescript doesn't yet support the undefined filter

    const output:IDynamicObject = {};

    definitions.forEach(d => {
        d.properties.forEach((p, key) => {
            if (!p.type) {
                throw new Error(`Cannot serialize property '${key}' without type!`);
            }

            const value = object[key];

            if (value == undefined || p.writeonly) {
                return;
            }

            if (p.map) {
                output[p.serializedName] = serializeMap(value, p, options);
                return;
            }

            if (p.set) {
                output[p.serializedName] = serializeArray(Array.from(value || []), p, options);
                return;
            }

            if (p.array) {
                output[p.serializedName] = serializeArray(value, p, options);
                return;
            }

            output[p.serializedName] = serializeObject(value, p, options);
        });
    });

    if (options.keyToPreserveUnknownJSON) {
        const anchor = options.keyToPreserveUnknownJSON;
        if (object[anchor]) {
            const jsonProps = Object.keys(object[anchor]);
            for (const jsonProp of jsonProps) {
                if (object[anchor].hasOwnProperty(jsonProp)) {
                    let property:PropertyDefinition | undefined;
                    definitions.forEach(d => {
                        d.properties.forEach((p, key) => {
                            if (!property && jsonProp === p.serializedName) {
                                property = p;
                                // break
                            }
                        });
                    });
                    if (!property) {
                        if (typeof output[jsonProp] !== "undefined") {
                            console.log(`???!!! TAJSON keyToPreserveUnknownJSON already serialized?! ${anchor}.${jsonProp}`);
                            // breakLength: 100  maxArrayLength: undefined
                            // tslint:disable-next-line: max-line-length
                            console.log(util.inspect(output[jsonProp], { showHidden: false, depth: 1000, colors: true, customInspect: false }));

                            if (output[jsonProp] !== object[anchor][jsonProp]) {
                                console.log(`???!!! TAJSON keyToPreserveUnknownJSON already serialized DIFF?! ${anchor}.${jsonProp}`);
                                // breakLength: 100  maxArrayLength: undefined
                                // tslint:disable-next-line: max-line-length
                                console.log(util.inspect(object[anchor][jsonProp], { showHidden: false, depth: 1000, colors: true, customInspect: false }));
                            }
                        }
                        // warning: reference copy, not deep clone!
                        output[jsonProp] = object[anchor][jsonProp];
                    }
                }
            }
        }
    }
    return output;
}

function serializeArray(array:IDynamicObject[], definition:PropertyDefinition, options:IGenerateOptions):JsonValue {
    const arr = array.map(v => serializeObject(v, definition, options));
    if (arr.length === 1) {
        const converter = definition.converter || propertyConverters.get(definition.type);
        if (converter && converter.collapseArrayWithSingleItem()) {
            return arr[0];
        }
    }
    return arr;
}

function serializeMap(map:Map<string, IDynamicObject>, definition:PropertyDefinition, options:IGenerateOptions):JsonValue {
    const object:Record<string, JsonValue> = {};

    map.forEach((v, k) =>
        object[k] = serializeObject(v, definition, options)
    );

    return object;
}

function serializeObject(object:IDynamicObject, definition:PropertyDefinition, options:IGenerateOptions):JsonValue {
    const primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    const value:any = object;

    const converter = definition.converter || propertyConverters.get(definition.type);
    if (converter) {
        return converter.serialize(value);
    }

    if (!primitive) {
        const objDefinition = objectDefinitions.get(definition.type);

        if (objDefinition) {
            if (value instanceof definition.type) {
                return serialize(value, undefined, options);
            }
            return serialize(value, definition.type, options);
        }
    }

    return value;
}
