
export function isString(a: any): a is string {
    return typeof a === 'string';
}

export function isObject(obj: any): obj is Object {
    return obj === Object(obj);
}

const _has = Object.prototype.hasOwnProperty;
export function has(obj: Object, prop: string): boolean {
    return _has.call(obj, prop)
}

export function extend<T extends Object, U extends Object>(obj: T, ...args: U[]): T & U {
    if (!isObject(obj)) return obj

    for (let i = 0, ii = args.length; i < ii; i++) {
        const o = args[i];
        if (!isObject(o)) continue
        for (const k in o) {
            if (has(o, k)) (<any>obj)[k] = o[k] as any
        }
    }
    return obj as T & U;
}

export function queryStringToParams(qs: string): Object {
    var kvp, k, v, ls, params: { [key: string]: any } = {}, decode = decodeURIComponent;
    var kvps = qs.split('&');
    for (var i = 0, l = kvps.length; i < l; i++) {
        var param = kvps[i];
        kvp = param.split('='), k = kvp[0], v = kvp[1];
        if (v == null) v = true;
        k = decode(k), v = decode(v as string), ls = params[k];
        if (Array.isArray(ls)) ls.push(v);
        else if (ls) params[k] = [ls, v];
        else params[k] = v;
    }
    return params;
}

export function queryParam(obj: any): string {
    return Object.keys(obj).reduce(function (a, k) { a.push(k + '=' + encodeURIComponent(obj[k])); return a }, [] as string[]).join('&')
}