"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
// tslint:disable:ext-variable-name only-arrow-functions
function JsonElementType(type) {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.type = type;
    };
}
exports.JsonElementType = JsonElementType;
