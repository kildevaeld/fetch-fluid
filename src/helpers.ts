
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