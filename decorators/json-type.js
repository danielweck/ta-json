"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
// tslint:disable:ext-variable-name only-arrow-functions
function JsonType(type) {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key.toString());
        property.type = type;
    };
}
exports.JsonType = JsonType;
