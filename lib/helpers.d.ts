export declare function isString(a: any): a is string;
export declare function isObject(obj: any): obj is Object;
export declare function has(obj: Object, prop: string): boolean;
export declare function extend<T extends Object, U extends Object>(obj: T, ...args: U[]): T & U;
