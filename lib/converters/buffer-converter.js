"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BufferConverter {
    serialize(property) {
        if (this._encoding == "json") {
            return property.toJSON();
        }
        return property.toString(this._encoding);
    }
    deserialize(value) {
        if (this._encoding == "json") {
            return Buffer.from(value.data);
        }
        return Buffer.from(value, this._encoding);
    }
    constructor(encoding = "json") {
        this._encoding = encoding;
    }
}
exports.BufferConverter = BufferConverter;
//# sourceMappingURL=buffer-converter.js.map