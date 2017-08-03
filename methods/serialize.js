"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./../converters/converter");
const object_definition_1 = require("../classes/object-definition");
function serialize(value, type) {
    if (value.constructor === Array) {
        return value.map(o => serializeRootObject(o, type));
    }
    return serializeRootObject(value, type);
}
exports.serialize = serialize;
function serializeRootObject(object, type = Object.getPrototypeOf(object).constructor) {
    const inheritanceChain = object_definition_1.getTypedInheritanceChain(type);
    if (inheritanceChain.length === 0) {
        return object;
    }
    const definitions = inheritanceChain
        .map(t => object_definition_1.objectDefinitions.get(t))
        .filter(t => !!t); // Typescript doesn't yet support the undefined filter
    const output = {};
    definitions.forEach(d => {
        d.properties.forEach((p, key) => {
            if (!p.type) {
                throw new Error(`Cannot serialize property '${key}' without type!`);
            }
            const value = object[key];
            if (value == undefined || p.writeonly) {
                return;
            }
            if (p.set) {
                output[p.serializedName] = serializeArray(Array.from(value || []), p);
                return;
            }
            if (p.array) {
                output[p.serializedName] = serializeArray(value, p);
                return;
            }
            output[p.serializedName] = serializeObject(value, p);
        });
    });
    return output;
}
function serializeArray(array, definition) {
    const arr = array.map(v => serializeObject(v, definition));
    if (arr.length === 1) {
        const converter = definition.converter || converter_1.propertyConverters.get(definition.type);
        if (converter && converter.collapseArrayWithSingleItem()) {
            return arr[0];
        }
    }
    return arr;
}
function serializeObject(object, definition) {
    const primitive = definition.type === String || definition.type === Boolean || definition.type === Number;
    const value = object;
    const converter = definition.converter || converter_1.propertyConverters.get(definition.type);
    if (converter) {
        return converter.serialize(value);
    }
    if (!primitive) {
        const objDefinition = object_definition_1.objectDefinitions.get(definition.type);
        if (objDefinition) {
            if (value instanceof definition.type) {
                return serialize(value);
            }
            return serialize(value, definition.type);
        }
    }
    return value;
}
//# sourceMappingURL=serialize.js.map