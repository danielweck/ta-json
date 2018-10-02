"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_1 = require("./methods/serialize");
const deserialize_1 = require("./methods/deserialize");
class TaJson {
    static deserialize(object, type, options) {
        return deserialize_1.deserialize(object, type, options);
    }
    static parse(json, type, options) {
        return this.deserialize(JSON.parse(json), type, options);
    }
    static serialize(value) {
        return serialize_1.serialize(value);
    }
    static stringify(object) {
        return JSON.stringify(this.serialize(object));
    }
}
exports.TaJson = TaJson;
