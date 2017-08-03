export declare function queryStringToParams(qs: string): Object;
export declare function queryParam(obj: any): string;
export declare enum HttpMethod {
    GET = "get",
    PUT = "put",
    POST = "post",
    DELETE = "delete",
    HEAD = "head",
    PATCH = "patch",
}
export declare class HttpError extends Error {
    response: Response;
    status: number;
    statusText: string;
    constructor(response: Response);
}
export declare class HttpJSONError extends Error {
    response: Response;
    json: any;
    status: number;
    statusText: string;
    constructor(response: Response, json: any);
}
export declare class Request {
    private _headers;
    private _params;
    private _method;
    private _url;
    private _request;
    constructor(url: string, method?: HttpMethod);
    header(field: string | {
        [key: string]: string;
    }, value?: string): this;
    params(key: string | {
        [key: string]: any;
    }, value?: any): this;
    json<T>(data?: any, throwOnInvalid?: boolean): Promise<T>;
    text(data?: any, throwOnInvalid?: boolean): Promise<string>;
    end(data?: any, throwOnInvalid?: boolean): Promise<Response>;
    then<U>(onFulfilled?: (value: Response) => U | PromiseLike<U>, onRejected?: (error: any) => U | PromiseLike<U>): PromiseLike<U>;
    private _apply_params(url);
}
export declare module request {
    function get(url: string): Request;
    function post(url: string): Request;
    function put(url: string): Request;
    function del(url: string): Request;
    function patch(url: string): Request;
    function head(url: string): Request;
}
