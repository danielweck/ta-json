"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateConverter {
    serialize(property) {
        return property.toString();
    }
    deserialize(value) {
        return new Date(value);
    }
    collapseArrayWithSingleItem() {
        return false;
    }
}
exports.DateConverter = DateConverter;
