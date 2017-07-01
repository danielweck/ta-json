"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonReadonly() {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.readonly = true;
    };
}
exports.JsonReadonly = JsonReadonly;
//# sourceMappingURL=json-readonly.js.map