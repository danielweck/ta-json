"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonElementType(type) {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.type = type;
    };
}
exports.JsonElementType = JsonElementType;
//# sourceMappingURL=json-element-type.js.map