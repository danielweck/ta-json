"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
const converter_1 = require("../converters/converter");
function deserialize(object, type, options = { runConstructor: false }) {
    if (object && object.constructor === Array) {
        return object.map(o => deserializeRootObject(o, type, options));
    }
    return deserializeRootObject(object, type, options);
}
exports.deserialize = deserialize;
function deserializeRootObject(object, objectType = Object, options) {
    if (!object_definition_1.objectDefinitions.has(objectType)) {
        return object;
    }
    const values = object;
    const [type, ...superTypes] = object_definition_1.getTypedInheritanceChain(objectType, values);
    const output = Object.create(type.prototype);
    const definitions = [...superTypes.reverse(), type].map(t => object_definition_1.objectDefinitions.get(t)).filter(t => !!t);
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
                    output[key] = new Set(output[key]);
                }
                return;
            }
            output[key] = deserializeObject(value, p, options);
        });
        d.onDeserialized.call(output);
    });
    return output;
}
function deserializeArray(array, definition, options) {
    const converter = definition.converter || converter_1.propertyConverters.get(definition.type);
    const arr = (array instanceof Array) ?
        array :
        (converter && converter.collapseArrayWithSingleItem() ?
            [array] :
            array);
    return arr.map(v => deserializeObject(v, definition, options));
}
function deserializeObject(object, definition, options) {
    const primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    const value = object;
    const converter = definition.converter || converter_1.propertyConverters.get(definition.type);
    if (converter) {
        return converter.deserialize(value);
    }
    if (!primitive) {
        const objDefinition = object_definition_1.objectDefinitions.get(definition.type);
        if (objDefinition) {
            return deserialize(value, definition.type);
        }
    }
    return value;
}
