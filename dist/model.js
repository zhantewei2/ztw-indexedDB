"use strict";
exports.__esModule = true;
var config_1 = require("./config");
var indexMethod_1 = require("./method/indexMethod");
function initTypeDB(model, opts) {
    if (!opts.type)
        return model;
    indexMethod_1.indexMethod.call(model);
    if (opts.type == 'capped') {
        var model2_1 = {};
        model2_1.__proto__ = model;
        model2_1.cappedLimit = opts.limit;
        model2_1['insert'] = function (params, cb) {
            params[config_1.cappedKey] = new Date().getTime();
            model.size(function (err, size) {
                (function (next) {
                    if (size >= model2_1.cappedLimit) {
                        model.useCursor(config_1.cappedKey, function (err, cursor) {
                            model.remove(cursor['value'][model.keyPath], function (err, data) { return next(); });
                        });
                    }
                    else {
                        next();
                    }
                })(function () { return model.insert(params, cb); });
            });
        };
        return model2_1;
    }
    return model;
}
exports.initTypeDB = initTypeDB;
function filterModel(objectStore, opts) {
    if (!opts.type)
        return;
    if (opts.type == 'capped' && opts.limit) {
        objectStore.createIndex(config_1.cappedKey, config_1.cappedKey, { unique: true });
    }
    else if (opts.type == 'index' && opts.index) {
        objectStore.createIndex(opts.index, opts.index, { unique: true });
    }
}
exports.filterModel = filterModel;
