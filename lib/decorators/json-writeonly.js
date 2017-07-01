"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonWriteonly() {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.writeonly = true;
    };
}
exports.JsonWriteonly = JsonWriteonly;
//# sourceMappingURL=json-writeonly.js.map