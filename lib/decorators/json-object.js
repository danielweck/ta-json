"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonObject() {
    return function (constructor) {
        object_definition_1.getDefinition(constructor);
    };
}
exports.JsonObject = JsonObject;
//# sourceMappingURL=json-object.js.map