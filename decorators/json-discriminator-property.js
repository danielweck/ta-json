"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
// tslint:disable:ext-variable-name only-arrow-functions
function JsonDiscriminatorProperty(property) {
    return function (constructor) {
        object_definition_1.getDefinition(constructor).discriminatorProperty = property;
    };
}
exports.JsonDiscriminatorProperty = JsonDiscriminatorProperty;
