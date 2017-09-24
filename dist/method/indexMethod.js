"use strict";
exports.__esModule = true;
var config_1 = require("../config");
var indexMethod = (function () {
    function indexMethod() {
        var _this = this;
        this.getList = function (size, select, index, direction, query) {
            if (index === void 0) { index = config_1.cappedKey; }
            if (direction === void 0) { direction = 'next'; }
            if (query === void 0) { query = null; }
            return new Promise(function (resolve) {
                var results = [];
                _this.useCursor({ index: index, direction: direction, query: query }, function (err, cursor) {
                    if (cursor && size--) {
                        if (select && select.length) {
                            var obj_1 = {};
                            select.forEach(function (v) {
                                obj_1[v] = cursor.value[v];
                            });
                            results.push(obj_1);
                        }
                        else {
                            results.push(cursor.value);
                        }
                        cursor["continue"]();
                    }
                    else {
                        resolve(results);
                    }
                });
            });
        };
    }
    return indexMethod;
}());
exports.indexMethod = indexMethod;
