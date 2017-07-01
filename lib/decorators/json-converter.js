"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_definition_1 = require("../classes/object-definition");
function JsonConverter(converter) {
    return function (target, key) {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        if (typeof converter === "function") {
            property.converter = new converter();
        }
        else {
            property.converter = converter;
        }
    };
}
exports.JsonConverter = JsonConverter;
//# sourceMappingURL=json-converter.js.map