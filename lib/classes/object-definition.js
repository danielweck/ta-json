"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_definition_1 = require("./property-definition");
class ObjectDefinition {
    getProperty(key) {
        let property = this.properties.get(key);
        if (!property) {
            property = new property_definition_1.PropertyDefinition();
            this.properties.set(key, property);
        }
        return property;
    }
    constructor() {
        this.ctr = () => { };
        this.beforeDeserialized = () => { };
        this.onDeserialized = () => { };
        this.properties = new Map();
    }
}
exports.ObjectDefinition = ObjectDefinition;
exports.objectDefinitions = new Map();
function getDefinition(target) {
    let definition = exports.objectDefinitions.get(target);
    if (!definition) {
        definition = new ObjectDefinition();
        exports.objectDefinitions.set(target, definition);
    }
    return definition;
}
exports.getDefinition = getDefinition;
function getInheritanceChain(type) {
    if (!type) {
        return [];
    }
    const parent = Object.getPrototypeOf(type);
    return [type.constructor].concat(getInheritanceChain(parent));
}
exports.getInheritanceChain = getInheritanceChain;
function getChildClassDefinitions(parentType) {
    const childDefs = [];
    exports.objectDefinitions.forEach((def, type) => {
        const superClass = Object.getPrototypeOf(type.prototype).constructor;
        if (superClass == parentType) {
            childDefs.push([type, def]);
        }
    });
    return childDefs;
}
function getTypedInheritanceChain(type, object) {
    const parentDef = exports.objectDefinitions.get(type);
    let childDefs = [];
    if (object && parentDef.discriminatorProperty) {
        childDefs = childDefs.concat(getChildClassDefinitions(type));
    }
    let actualType;
    while (childDefs.length != 0 && !actualType) {
        const [type, def] = childDefs.shift();
        if (def.hasOwnProperty("discriminatorValue")) {
            if (def.discriminatorValue == object[parentDef.discriminatorProperty]) {
                if (def.hasOwnProperty("discriminatorProperty")) {
                    return getTypedInheritanceChain(type, object);
                }
                actualType = type;
            }
        }
        else {
            childDefs = childDefs.concat(getChildClassDefinitions(type));
        }
    }
    if (!actualType) {
        actualType = type;
    }
    let inheritanceChain = new Set(getInheritanceChain(Object.create(actualType.prototype)));
    return Array.from(inheritanceChain).filter(t => exports.objectDefinitions.has(t));
}
exports.getTypedInheritanceChain = getTypedInheritanceChain;
//# sourceMappingURL=object-definition.js.map