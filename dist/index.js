"use strict";
exports.__esModule = true;
var method_1 = require("./method/method");
var model_1 = require("./model");
var IndexDB = (function () {
    function IndexDB(dataName, opts) {
        var _this = this;
        this.storeModels = {};
        this.models = {};
        var version = opts.version, indexDB = window.indexedDB, getModel = function (modelName) { return _this.db.transaction(modelName, 'readwrite').objectStore(modelName); }, newModel = function (modelName, opts) {
            var objectStore = _this.db.createObjectStore(modelName, { keyPath: opts.keyPath });
            model_1.filterModel(objectStore, opts);
        }, initModel = function (modelName, opts) {
            var model_ztw = {};
            model_ztw.__proto__ = getModel(modelName);
            method_1.inheritMethod(model_ztw, _this, modelName, opts);
            return model_1.initTypeDB(model_ztw, opts);
        };
        this.destroy = function () { return indexDB.deleteDatabase(dataName); };
        this.init = function (initItemsOpts) {
            return new Promise(function (resolve) {
                var req = indexDB.open(dataName, version);
                //define modelObj:
                initItemsOpts.forEach(function (i) {
                    Object.defineProperty(_this.models, i.name, {
                        get: function () { return _this.storeModels[i.name] || (_this.storeModels[i.name] = initModel(i.name, i.opts)); }
                    });
                });
                req.onupgradeneeded = function (e) {
                    _this.db = req.result;
                    initItemsOpts.forEach(function (i) {
                        newModel(i.name, i.opts);
                    });
                };
                req.onsuccess = function (e) {
                    _this.db = req.result;
                    resolve(_this.models);
                };
            });
        };
    }
    return IndexDB;
}());
exports.IndexDB = IndexDB;
