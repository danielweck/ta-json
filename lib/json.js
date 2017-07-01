"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_1 = require("./methods/serialize");
const deserialize_1 = require("./methods/deserialize");
class JSON {
    static deserialize(object, type, options) {
        return deserialize_1.deserialize(object, type, options);
    }
    static parse(json, type, options) {
        return this.deserialize(global.JSON.parse(json), type, options);
    }
    static serialize(value) {
        return serialize_1.serialize(value);
    }
    static stringify(object) {
        return global.JSON.stringify(this.serialize(object));
    }
}
exports.JSON = JSON;
//# sourceMappingURL=json.js.map