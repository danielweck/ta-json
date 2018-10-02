"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./decorators"));
__export(require("./converters"));
// Export both as JSON name but also local name.
var ta_json_1 = require("./ta-json");
exports.JSON = ta_json_1.TaJson;
exports.TaJson = ta_json_1.TaJson;
