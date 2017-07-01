"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonDiscriminatorProperty(property) {
    return function (constructor) {
        object_definition_1.getDefinition(constructor).discriminatorProperty = property;
    };
}
exports.JsonDiscriminatorProperty = JsonDiscriminatorProperty;
//# sourceMappingURL=json-discriminator-property.js.map