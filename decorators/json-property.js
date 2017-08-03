"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const object_definition_1 = require("../classes/object-definition");
// tslint:disable:ext-variable-name only-arrow-functions
function JsonProperty(propertyName) {
    return function (target, key) {
        const type = Reflect.getMetadata("design:type", target, key);
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.serializedName = propertyName || key;
        property.array = type === Array;
        property.set = type === Set;
        if (!property.array && !property.set && !property.type) {
            property.type = type;
        }
    };
}
exports.JsonProperty = JsonProperty;
//# sourceMappingURL=json-property.js.map