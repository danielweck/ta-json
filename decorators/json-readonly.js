"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
// tslint:disable:ext-variable-name only-arrow-functions
function JsonReadonly() {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.readonly = true;
    };
}
exports.JsonReadonly = JsonReadonly;
