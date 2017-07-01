"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonConstructor() {
    return function (target, key) {
        const definition = object_definition_1.getDefinition(target.constructor);
        definition.ctr = target[key];
    };
}
exports.JsonConstructor = JsonConstructor;
//# sourceMappingURL=json-constructor.js.map