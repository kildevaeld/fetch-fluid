export declare enum HttpMethod {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE",
    HEAD = "HEAD",
    PATCH = "PATCH"
}
export declare type RequestMode = "cors" | "no-cors" | "same-origin";
export declare type RequestCredentials = "omit" | "same-origin" | "include";
export declare class HttpError extends Error {
    response: Response;
    status: number;
    statusText: string;
    constructor(response: Response);
}
export declare class HttpJSONError extends HttpError {
    json: any;
    constructor(response: Response, json: any);
}
export declare class Request {
    private _headers;
    private _params;
    private _url;
    private _request;
    constructor(url: string, method?: HttpMethod);
    header(field: string | {
        [key: string]: string;
    }, value?: string): this;
    params(key: string | {
        [key: string]: any;
    }, value?: any): this;
    mode(mode: RequestMode): this;
    credentials(creds: RequestCredentials): this;
    json<T>(data?: any, throwOnInvalid?: boolean): Promise<T>;
    text(data?: any, throwOnInvalid?: boolean): Promise<string>;
    end(data?: any, throwOnInvalid?: boolean): Promise<Response>;
    then<U>(onFulfilled?: (value: Response) => U | PromiseLike<U>, onRejected?: (error: any) => U | PromiseLike<U>): PromiseLike<U>;
    private _apply_params;
}
export declare module request {
    function get(url: string): Request;
    function post(url: string): Request;
    function put(url: string): Request;
    function del(url: string): Request;
    function patch(url: string): Request;
    function head(url: string): Request;
}
