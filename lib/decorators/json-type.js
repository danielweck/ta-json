"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonType(type) {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.type = type;
    };
}
exports.JsonType = JsonType;
//# sourceMappingURL=json-type.js.map