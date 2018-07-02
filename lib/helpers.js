"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isString(a) {
    return typeof a === 'string';
}
exports.isString = isString;
function isObject(obj) {
    return obj === Object(obj);
}
exports.isObject = isObject;
const _has = Object.prototype.hasOwnProperty;
function has(obj, prop) {
    return _has.call(obj, prop);
}
exports.has = has;
function extend(obj, ...args) {
    if (!isObject(obj))
        return obj;
    for (let i = 0, ii = args.length; i < ii; i++) {
        const o = args[i];
        if (!isObject(o))
            continue;
        for (const k in o) {
            if (has(o, k))
                obj[k] = o[k];
        }
    }
    return obj;
}
exports.extend = extend;
function queryStringToParams(qs) {
    var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
    var kvps = qs.split('&');
    for (var i = 0, l = kvps.length; i < l; i++) {
        var param = kvps[i];
        kvp = param.split('='), k = kvp[0], v = kvp[1];
        if (v == null)
            v = true;
        k = decode(k), v = decode(v), ls = params[k];
        if (Array.isArray(ls))
            ls.push(v);
        else if (ls)
            params[k] = [ls, v];
        else
            params[k] = v;
    }
    return params;
}
exports.queryStringToParams = queryStringToParams;
function queryParam(obj) {
    return Object.keys(obj).reduce(function (a, k) { a.push(k + '=' + encodeURIComponent(obj[k])); return a; }, []).join('&');
}
exports.queryParam = queryParam;
