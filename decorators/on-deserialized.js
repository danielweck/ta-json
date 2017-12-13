"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
// tslint:disable:ext-variable-name only-arrow-functions
function OnDeserialized() {
    return function (target, key) {
        const definition = object_definition_1.getDefinition(target.constructor);
        definition.onDeserialized = target[key];
    };
}
exports.OnDeserialized = OnDeserialized;
