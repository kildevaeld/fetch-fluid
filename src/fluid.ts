import { isObject, isString, extend } from './helpers';

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

export enum HttpMethod {
    GET = "get", PUT = "put", POST = "post",
    DELETE = "delete", HEAD = "head", PATCH = "patch"
};

export type RequestMode = "cors" | "no-cors" | "same-origin";

export type RequestCredentials = "omit" | "same-origin" | "include";

const jsonReg = /application\/json/i;
function checkStatus(response: Response): Promise<Response> {
    if (response.status >= 200 && response.status < 300) {
        return response as any;
    } else {
        if ((response.status >= 400 && response.status < 500) && jsonReg.test(response.headers.get('content-type') || "")) {
            return response.json()
                .then(json => {
                    throw new HttpJSONError(response, json);
                }) as any;
        }

        var error = new HttpError(response);
        throw error;
    }
}


export class HttpError extends Error {
    status: number;
    statusText: string;
    constructor(public response: Response) {
        super();
        // Error breaks prototype chain
        Object.setPrototypeOf(this, HttpError.prototype);

        this.status = response.status;
        this.statusText = response.statusText;
    }
}

export class HttpJSONError extends Error {
    status: number;
    statusText: string;
    constructor(public response: Response, public json: any) {
        super();
        // Error breaks prototype chain
        Object.setPrototypeOf(this, HttpError.prototype);

        this.status = response.status;
        this.statusText = response.statusText;
    }
}

export class Request {
    private _headers = new Headers();
    private _params: { [key: string]: string } = {};
    private _method: HttpMethod;
    private _url: string;
    private _request: RequestInit = {};

    constructor(url: string, method: HttpMethod = HttpMethod.GET) {
        this._request.method = method;
        this._url = url;
    }

    header(field: string | { [key: string]: string }, value?: string) {
        if (isString(field) && isString(value)) {
            this._headers.append(field, value)
        } else if (isObject(field)) {
            for (let key in (<any>field)) {
                this._headers.append(key, (<any>field)[key]);
            }
        }
        return this;
    }

    params(key: string | { [key: string]: any }, value?: any) {
        if (arguments.length === 1 && isObject(key)) {
            extend(this._params, key);
        } else if (arguments.length === 2) {
            this._params[<string>key] = value;
        }
        return this;
    }

    mode(mode: RequestMode) {
        this._request.mode = mode;
        return this;
    }

    credentials(creds: RequestCredentials) {
        this._request.credentials = creds;
        return this;
    }


    json<T>(data?: any, throwOnInvalid: boolean = true): Promise<T> {
        this.header('content-type', 'application/json; charset=utf-8');
        if (!isString(data)) {
            data = JSON.stringify(data);
        }
        return this.end(data, throwOnInvalid)
            .then((res) => {
                return res.json()
            });
    }

    text(data?: any, throwOnInvalid: boolean = true): Promise<string> {
        return this.end(data, throwOnInvalid).then(r => r.text());
    }

    end(data?: any, throwOnInvalid: boolean = true): Promise<Response> {

        let url = this._url;
        if (data && data === Object(data) && this._method == HttpMethod.GET /* && check for content-type */) {
            var sep = (url.indexOf('?') === -1) ? '?' : '&';
            let d = sep + queryParam(data)
            url += d
            data = null;
        } else {
            this._request.body = data;
        }

        url = this._apply_params(url);

        this._request.headers = this._headers

        return fetch(url, this._request)
            .then(res => {
                if (throwOnInvalid) {
                    return checkStatus(res);
                }
                return res;
            });

    }

    then<U>(onFulfilled?: (value: Response) => U | PromiseLike<U>, onRejected?: (error: any) => U | PromiseLike<U>): PromiseLike<U> {
        return this.end().then(onFulfilled, onRejected);
    }


    private _apply_params(url: string): string {
        let params = {};
        let idx = url.indexOf('?');
        if (idx > -1) {
            params = extend(params, queryStringToParams(url.substr(idx + 1)));
            url = url.substr(0, idx);
        }

        extend(params, this._params);

        if (Object.keys(params).length) {
            var sep = (url.indexOf('?') === -1) ? '?' : '&';
            url += sep + queryParam(params);
        }

        return url;
    }

}

export module request {
    export function get(url: string): Request {
        return new Request(url, HttpMethod.GET);
    }
    export function post(url: string): Request {
        return new Request(url, HttpMethod.POST);
    }
    export function put(url: string): Request {
        return new Request(url, HttpMethod.PUT);
    }
    export function del(url: string): Request {
        return new Request(url, HttpMethod.DELETE);
    }
    export function patch(url: string): Request {
        return new Request(url, HttpMethod.PATCH);
    }
    export function head(url: string): Request {
        return new Request(url, HttpMethod.HEAD);
    }
}