"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["POST"] = "POST";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
;
const jsonReg = /application\/json/i;
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    else {
        if ((response.status >= 400 && response.status < 500) && jsonReg.test(response.headers.get('content-type') || "")) {
            return response.json()
                .then(json => Promise.reject(new HttpJSONError(response, json)));
        }
        return Promise.reject(new HttpError(response));
    }
}
class HttpError extends Error {
    constructor(response) {
        super();
        this.response = response;
        // Error breaks prototype chain
        Object.setPrototypeOf(this, HttpError.prototype);
        this.status = response.status;
        this.statusText = response.statusText;
    }
}
exports.HttpError = HttpError;
class HttpJSONError extends HttpError {
    constructor(response, json) {
        super(response);
        this.json = json;
        Object.setPrototypeOf(this, HttpJSONError.prototype);
    }
}
exports.HttpJSONError = HttpJSONError;
class Request {
    constructor(url, method = HttpMethod.GET) {
        this._headers = new Headers();
        this._params = {};
        this._request = {};
        this._request.method = method;
        this._url = url;
    }
    header(field, value) {
        if (helpers_1.isString(field) && helpers_1.isString(value)) {
            this._headers.append(field, value);
        }
        else if (helpers_1.isObject(field)) {
            for (let key in field) {
                this._headers.append(key, field[key]);
            }
        }
        return this;
    }
    params(key, value) {
        if (arguments.length === 1 && helpers_1.isObject(key)) {
            helpers_1.extend(this._params, key);
        }
        else if (arguments.length === 2) {
            this._params[key] = value;
        }
        return this;
    }
    mode(mode) {
        this._request.mode = mode;
        return this;
    }
    credentials(creds) {
        this._request.credentials = creds;
        return this;
    }
    json(data, throwOnInvalid = true) {
        this.header('content-type', 'application/json; charset=utf-8');
        if (!helpers_1.isString(data)) {
            data = JSON.stringify(data);
        }
        return this.end(data, throwOnInvalid)
            .then((res) => {
            return res.json();
        });
    }
    text(data, throwOnInvalid = true) {
        return this.end(data, throwOnInvalid).then(r => r.text());
    }
    end(data, throwOnInvalid = true) {
        let url = this._url;
        if (data && data === Object(data) && this._request.method == HttpMethod.GET /* && check for content-type */) {
            var sep = (url.indexOf('?') === -1) ? '?' : '&';
            let d = sep + helpers_1.queryParam(data);
            url += d;
            data = null;
        }
        else {
            this._request.body = data;
        }
        if (Object.keys(this._params || {}).length)
            url = this._apply_params(url);
        this._request.headers = this._headers;
        return fetch(url, this._request)
            .then(res => {
            if (throwOnInvalid) {
                return checkStatus(res);
            }
            return res;
        });
    }
    then(onFulfilled, onRejected) {
        return this.end().then(onFulfilled, onRejected);
    }
    _apply_params(url) {
        let params = {};
        let idx = url.indexOf('?');
        if (idx > -1) {
            params = helpers_1.extend(params, helpers_1.queryStringToParams(url.substr(idx + 1)));
            url = url.substr(0, idx);
        }
        helpers_1.extend(params, this._params);
        if (Object.keys(params).length) {
            var sep = (url.indexOf('?') === -1) ? '?' : '&';
            url += sep + helpers_1.queryParam(params);
        }
        return url;
    }
}
exports.Request = Request;
var request;
(function (request) {
    function get(url) {
        return new Request(url, HttpMethod.GET);
    }
    request.get = get;
    function post(url) {
        return new Request(url, HttpMethod.POST);
    }
    request.post = post;
    function put(url) {
        return new Request(url, HttpMethod.PUT);
    }
    request.put = put;
    function del(url) {
        return new Request(url, HttpMethod.DELETE);
    }
    request.del = del;
    function patch(url) {
        return new Request(url, HttpMethod.PATCH);
    }
    request.patch = patch;
    function head(url) {
        return new Request(url, HttpMethod.HEAD);
    }
    request.head = head;
})(request = exports.request || (exports.request = {}));
