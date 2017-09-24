"use strict";
exports.__esModule = true;
function toCB(colle, method, val, cb) {
    var req = colle['__proto__'][method].call(colle['__proto__'], val);
    req.onsuccess = function (e) { cb(null, e.target.result); };
    req.onerror = function (e) { cb(e.target.result, null); };
}
exports.toCB = toCB;
;
function asyncForEach(arr, every, end) {
    arr.length ? every(arr[0], function (out) { if (!out)
        asyncForEach(arr.slice(1), every, end); }) : end();
}
exports.asyncForEach = asyncForEach;
