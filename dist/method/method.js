"use strict";
exports.__esModule = true;
var util_1 = require("../util");
function dbMethod(parentObj, modelName, keyPath) {
    var _this = this;
    var tryToCB = function (model, method, params, cb) {
        try {
            util_1.toCB(model, method, params, cb);
        }
        catch (err) {
            try {
                model.__proto__ = parentObj.db.transaction(modelName, 'readwrite').objectStore(modelName);
                util_1.toCB(model, method, params, cb);
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    this.removeAll = function (cb) { return tryToCB(_this, 'clear', null, cb); };
    this.size = function (cb) { return tryToCB(_this, 'count', null, cb); };
    this.insert = function (params, cb) { return tryToCB(_this, 'add', params, cb); };
    this.remove = function (key, cb) { return tryToCB(_this, 'delete', key, cb); };
    this.findOne = function (key, cb) { return tryToCB(_this, 'get', key, cb); };
    this.upsert = function (key, params, cb) {
        _this.findOne(key, function (err, data) {
            if (!data)
                data = {};
            params[keyPath] = key;
            Object.assign(data, params);
            tryToCB(_this, 'put', data, cb);
        });
    };
    this.purePut = function (params, cb) {
        tryToCB(_this, 'put', params, cb);
    };
    this.useCursor = function (opts, cb) {
        /* opts:{index: query: direction: }*/
        var method = function (model) {
            var cursorI = model.index(opts.index);
            var req = cursorI.openCursor(opts.query, opts.direction);
            req.onsuccess = function (e) { return cb(null, e.target.result); };
            req.onerror = function (e) { return cb(e.target.result, null); };
        };
        try {
            method(_this);
        }
        catch (e) {
            var objStore = parentObj.db.transaction(modelName, 'readwrite').objectStore(modelName);
            method(objStore);
        }
    };
    this.findMany = function (keys, cb) {
        var results = [];
        util_1.asyncForEach(keys, function (val, next) {
            _this.findOne(val, function (err, data) {
                if (err) {
                    cb(err, null);
                    next('out');
                }
                results.push(data);
                next();
            });
        }, function () {
            cb(null, results);
        });
    };
    this.genKey = function (obj) {
        var key = '';
        for (var i in obj) {
            key += i + '_' + obj[i] + ',';
        }
        return key.slice(0, -1);
    };
}
exports.dbMethod = dbMethod;
function inheritMethod(modelOut, parentObj, modelName, opts) {
    dbMethod.call(modelOut, parentObj, modelName, opts.keyPath);
}
exports.inheritMethod = inheritMethod;
