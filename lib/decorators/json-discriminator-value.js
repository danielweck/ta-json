"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonDiscriminatorValue(value) {
    return function (constructor) {
        object_definition_1.getDefinition(constructor).discriminatorValue = value;
    };
}
exports.JsonDiscriminatorValue = JsonDiscriminatorValue;
//# sourceMappingURL=json-discriminator-value.js.map