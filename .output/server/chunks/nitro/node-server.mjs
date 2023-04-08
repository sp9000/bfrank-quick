globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { eventHandler, setHeaders, sendRedirect, defineEventHandler, handleCacheHeaders, createEvent, getRequestHeader, getRequestHeaders, setResponseHeader, createError, lazyEventHandler, createApp, createRouter as createRouter$1, toNodeListener } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, joinURL, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import { createIPX, createIPXMiddleware } from 'ipx';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routeRules":{"/__nuxt_error":{"cache":false}},"envPrefix":"NUXT_"},"public":{},"ipx":{"dir":"","domains":[],"sharp":{},"alias":{}}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
const timingMiddleware = eventHandler((event) => {
  const start = globalTiming.start();
  const _end = event.res.end;
  event.res.end = function(chunk, encoding, cb) {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!event.res.headersSent) {
      event.res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(event.res, chunk, encoding, cb);
    return this;
  }.bind(event.res);
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(createRouter({ routes: config.nitro.routeRules }));
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(event, routeRules.redirect.to, routeRules.redirect.statusCode);
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(path);
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      if (validate(entry)) {
        useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    let _resSendBody;
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      },
      end(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      write(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      writeHead(statusCode, headers2) {
        this.statusCode = statusCode;
        if (headers2) {
          for (const header in headers2) {
            this.setHeader(header, headers2[header]);
          }
        }
        return this;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event) || _resSendBody;
    const headers = event.res.getHeaders();
    headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
    headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["cache-control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/_nuxt/2.25ea6962.js": {
    "type": "application/javascript",
    "etag": "\"52-yIBQpXYdVIXYW8a9jiHTd3+mxi8\"",
    "mtime": "2023-04-08T00:16:32.105Z",
    "size": 82,
    "path": "../public/_nuxt/2.25ea6962.js"
  },
  "/_nuxt/404.f482a682.js": {
    "type": "application/javascript",
    "etag": "\"28a-f53gchMe9nDnplPa9es0wasShy4\"",
    "mtime": "2023-04-08T00:16:32.105Z",
    "size": 650,
    "path": "../public/_nuxt/404.f482a682.js"
  },
  "/_nuxt/6.eeb7c80f.js": {
    "type": "application/javascript",
    "etag": "\"107-KqsefVYqKjpxwC9ezvRzN2cIxxc\"",
    "mtime": "2023-04-08T00:16:32.105Z",
    "size": 263,
    "path": "../public/_nuxt/6.eeb7c80f.js"
  },
  "/_nuxt/Icon.25c891a9.js": {
    "type": "application/javascript",
    "etag": "\"680e-p2IYHshYZxdSD+zRpC7rKexlbAc\"",
    "mtime": "2023-04-08T00:16:32.105Z",
    "size": 26638,
    "path": "../public/_nuxt/Icon.25c891a9.js"
  },
  "/_nuxt/Icon.294af607.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"43-5Uom3aokUJYiRMTfQx0OPoBaxqs\"",
    "mtime": "2023-04-08T00:16:32.105Z",
    "size": 67,
    "path": "../public/_nuxt/Icon.294af607.css"
  },
  "/_nuxt/_id_.5797ca68.js": {
    "type": "application/javascript",
    "etag": "\"24c3-6kttknrbbqPGyY0QfxBuZEOlHhg\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 9411,
    "path": "../public/_nuxt/_id_.5797ca68.js"
  },
  "/_nuxt/about.4100ecd2.js": {
    "type": "application/javascript",
    "etag": "\"12d1-qIDuV4uKrl/8l+KHLzHHlihxnZQ\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 4817,
    "path": "../public/_nuxt/about.4100ecd2.js"
  },
  "/_nuxt/auth.0752957e.js": {
    "type": "application/javascript",
    "etag": "\"1be-4gZ2rOKLgmg83TvZfvF9M7ASmSE\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 446,
    "path": "../public/_nuxt/auth.0752957e.js"
  },
  "/_nuxt/auth.52cf7e4b.js": {
    "type": "application/javascript",
    "etag": "\"1-rcg7GeeTSRscbqD9i0bNnzLlkvw\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 1,
    "path": "../public/_nuxt/auth.52cf7e4b.js"
  },
  "/_nuxt/banner.e9a9f4ea.js": {
    "type": "application/javascript",
    "etag": "\"598-evd1N4OX8uQW1uZgsbIdRdOEIXk\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 1432,
    "path": "../public/_nuxt/banner.e9a9f4ea.js"
  },
  "/_nuxt/blog-detail.ca5b07a1.js": {
    "type": "application/javascript",
    "etag": "\"1fe4-zksr9KuyPv5REW22Gf2qOVLLRrE\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 8164,
    "path": "../public/_nuxt/blog-detail.ca5b07a1.js"
  },
  "/_nuxt/blog-nosidebar.ed5c604f.js": {
    "type": "application/javascript",
    "etag": "\"bb3-xiY/e+0HSZ+hJiJhNjmfqruvwLk\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 2995,
    "path": "../public/_nuxt/blog-nosidebar.ed5c604f.js"
  },
  "/_nuxt/blog.ce11faaa.js": {
    "type": "application/javascript",
    "etag": "\"3686-dyva4VknW+HRiYDVAK9Mrbxwstc\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 13958,
    "path": "../public/_nuxt/blog.ce11faaa.js"
  },
  "/_nuxt/breadcrumbs.94e06462.js": {
    "type": "application/javascript",
    "etag": "\"2f4-JrsF6v9kvuusSOVfRaw0MOmKVf8\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 756,
    "path": "../public/_nuxt/breadcrumbs.94e06462.js"
  },
  "/_nuxt/bundle-product.37e68806.js": {
    "type": "application/javascript",
    "etag": "\"3eb9-g93dSoDkr0YT+gsrWeNVprcgpuE\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 16057,
    "path": "../public/_nuxt/bundle-product.37e68806.js"
  },
  "/_nuxt/cart-modal-popup.4e8787b0.js": {
    "type": "application/javascript",
    "etag": "\"d7c-h4pm+bnlvc6O1NvMeiBY8C66poI\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 3452,
    "path": "../public/_nuxt/cart-modal-popup.4e8787b0.js"
  },
  "/_nuxt/cart.852ebd2b.js": {
    "type": "application/javascript",
    "etag": "\"12ed-k9JlUAQBeHoG7oCmYAI9vnHWMHQ\"",
    "mtime": "2023-04-08T00:16:32.102Z",
    "size": 4845,
    "path": "../public/_nuxt/cart.852ebd2b.js"
  },
  "/_nuxt/category.5ed4c1d7.js": {
    "type": "application/javascript",
    "etag": "\"1d3b-9v1LcHQ+tpBLaO1ygu2UPVPCh+k\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 7483,
    "path": "../public/_nuxt/category.5ed4c1d7.js"
  },
  "/_nuxt/checkout.c2b299b4.js": {
    "type": "application/javascript",
    "etag": "\"2558-9xyhbRxV6WmCjD7E0UeYEtHUP+k\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 9560,
    "path": "../public/_nuxt/checkout.c2b299b4.js"
  },
  "/_nuxt/client-only.4d6f5b93.js": {
    "type": "application/javascript",
    "etag": "\"8677-OKtdGYmSUNLz6styPo3GxKSKD00\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 34423,
    "path": "../public/_nuxt/client-only.4d6f5b93.js"
  },
  "/_nuxt/collection-banner.4a593668.js": {
    "type": "application/javascript",
    "etag": "\"8b9-HjPBPyk8WsDXc/S0r9PwyRTqu9w\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 2233,
    "path": "../public/_nuxt/collection-banner.4a593668.js"
  },
  "/_nuxt/collection-sidebar.2257d6d6.js": {
    "type": "application/javascript",
    "etag": "\"271b-IUgcB3tv2fzvic/f+PGemC7RrTo\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 10011,
    "path": "../public/_nuxt/collection-sidebar.2257d6d6.js"
  },
  "/_nuxt/collection.cad62004.js": {
    "type": "application/javascript",
    "etag": "\"cbe-h1y7meT57I3BTvjp3r1TCJDVnP4\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 3262,
    "path": "../public/_nuxt/collection.cad62004.js"
  },
  "/_nuxt/coming-soon.020c9969.js": {
    "type": "application/javascript",
    "etag": "\"5c4-tghN7aEXCyX0Aug0FEYMWD4xlww\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 1476,
    "path": "../public/_nuxt/coming-soon.020c9969.js"
  },
  "/_nuxt/compare-1.30463282.js": {
    "type": "application/javascript",
    "etag": "\"b72-LphE8OnRQ9G7dgsN2zuGSHBZDbs\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 2930,
    "path": "../public/_nuxt/compare-1.30463282.js"
  },
  "/_nuxt/compare-popup.53877319.js": {
    "type": "application/javascript",
    "etag": "\"138f-zImL1v/NCFXWafuPuX3Xzq/slEM\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 5007,
    "path": "../public/_nuxt/compare-popup.53877319.js"
  },
  "/_nuxt/contact.d51e1be9.js": {
    "type": "application/javascript",
    "etag": "\"11b7-MlnQ6e1iHSqdw0F7Xf0CwZbAtik\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 4535,
    "path": "../public/_nuxt/contact.d51e1be9.js"
  },
  "/_nuxt/cookie.2942493e.js": {
    "type": "application/javascript",
    "etag": "\"82f-DZlnmlQ9TJ448WWJZsPjiyQk2UE\"",
    "mtime": "2023-04-08T00:16:32.099Z",
    "size": 2095,
    "path": "../public/_nuxt/cookie.2942493e.js"
  },
  "/_nuxt/custom.4ac995b7.js": {
    "type": "application/javascript",
    "etag": "\"267-/6MbQzObkix1himefiqqwxtgF/o\"",
    "mtime": "2023-04-08T00:16:32.095Z",
    "size": 615,
    "path": "../public/_nuxt/custom.4ac995b7.js"
  },
  "/_nuxt/dashboard.49920ed9.js": {
    "type": "application/javascript",
    "etag": "\"2bd6-xAsySnc2Ru1/LGlUcBYAjR+wsFY\"",
    "mtime": "2023-04-08T00:16:32.095Z",
    "size": 11222,
    "path": "../public/_nuxt/dashboard.49920ed9.js"
  },
  "/_nuxt/default.6ddffaa6.js": {
    "type": "application/javascript",
    "etag": "\"6504-1ln4R4tvCA/JJC+ZPGsf7sY1tSw\"",
    "mtime": "2023-04-08T00:16:32.095Z",
    "size": 25860,
    "path": "../public/_nuxt/default.6ddffaa6.js"
  },
  "/_nuxt/default.86187520.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"36-dlNF0V3fdKMZsvLv0XiEEl0x9wk\"",
    "mtime": "2023-04-08T00:16:32.095Z",
    "size": 54,
    "path": "../public/_nuxt/default.86187520.css"
  },
  "/_nuxt/empty-search.1c1cc13c.js": {
    "type": "application/javascript",
    "etag": "\"53-30c/AwAYPo5pYaavDlMOv7e3OFw\"",
    "mtime": "2023-04-08T00:16:32.095Z",
    "size": 83,
    "path": "../public/_nuxt/empty-search.1c1cc13c.js"
  },
  "/_nuxt/entry.1273dc3f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a7534-diXpUkGhFNxLR3+0bUbGQUAN6bA\"",
    "mtime": "2023-04-08T00:16:32.095Z",
    "size": 685364,
    "path": "../public/_nuxt/entry.1273dc3f.css"
  },
  "/_nuxt/entry.2451ccf6.js": {
    "type": "application/javascript",
    "etag": "\"17ce44-BPP5igkKLXg98hIQgb7R2LK6KCQ\"",
    "mtime": "2023-04-08T00:16:32.092Z",
    "size": 1560132,
    "path": "../public/_nuxt/entry.2451ccf6.js"
  },
  "/_nuxt/error-404.23f2309d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-ivsbEmi48+s9HDOqtrSdWFvddYQ\"",
    "mtime": "2023-04-08T00:16:32.092Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.23f2309d.css"
  },
  "/_nuxt/error-404.fad4c8eb.js": {
    "type": "application/javascript",
    "etag": "\"8ab-bNUY02jeegZ5BBTKgGFkmCRoOG4\"",
    "mtime": "2023-04-08T00:16:32.092Z",
    "size": 2219,
    "path": "../public/_nuxt/error-404.fad4c8eb.js"
  },
  "/_nuxt/error-500.aa16ed4d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-7j4Tsx89siDo85YoIs0XqsPWmPI\"",
    "mtime": "2023-04-08T00:16:32.092Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.aa16ed4d.css"
  },
  "/_nuxt/error-500.e791c7af.js": {
    "type": "application/javascript",
    "etag": "\"759-+CR2IOBMNyjh3Bmz4nKqJde1PI8\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 1881,
    "path": "../public/_nuxt/error-500.e791c7af.js"
  },
  "/_nuxt/error-component.44b2bd1b.js": {
    "type": "application/javascript",
    "etag": "\"475-Nkvk+ewLKJ7QFFPyGE+9CQiWZMw\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 1141,
    "path": "../public/_nuxt/error-component.44b2bd1b.js"
  },
  "/_nuxt/faq.b39a4bda.js": {
    "type": "application/javascript",
    "etag": "\"2640-ss6UyK7z8fK0v4DckqPJiRbJ9TE\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 9792,
    "path": "../public/_nuxt/faq.b39a4bda.js"
  },
  "/_nuxt/fontawesome-webfont.2adefcbc.woff2": {
    "type": "font/woff2",
    "etag": "\"12d68-1vSMun0Hb7by/Wupk6dbncHsvww\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 77160,
    "path": "../public/_nuxt/fontawesome-webfont.2adefcbc.woff2"
  },
  "/_nuxt/fontawesome-webfont.7bfcab6d.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"2876e-2YDCzoc9xDr0YNTVctRBMESZ9AA\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 165742,
    "path": "../public/_nuxt/fontawesome-webfont.7bfcab6d.eot"
  },
  "/_nuxt/fontawesome-webfont.aa58f33f.ttf": {
    "type": "font/ttf",
    "etag": "\"286ac-E7HqtlqYPHpzvHmXxHnWaUP3xss\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 165548,
    "path": "../public/_nuxt/fontawesome-webfont.aa58f33f.ttf"
  },
  "/_nuxt/fontawesome-webfont.ad615792.svg": {
    "type": "image/svg+xml",
    "etag": "\"6c7db-mKiqXPfWLC7/Xwft6NhEuHTvBu0\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 444379,
    "path": "../public/_nuxt/fontawesome-webfont.ad615792.svg"
  },
  "/_nuxt/fontawesome-webfont.ba0c59de.woff": {
    "type": "font/woff",
    "etag": "\"17ee8-KLeCJAs+dtuCThLAJ1SpcxoWdSc\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 98024,
    "path": "../public/_nuxt/fontawesome-webfont.ba0c59de.woff"
  },
  "/_nuxt/forget-password.496bd906.js": {
    "type": "application/javascript",
    "etag": "\"673-kKbmZsY0CGGyErRqUw+Yr6euK40\"",
    "mtime": "2023-04-08T00:16:32.089Z",
    "size": 1651,
    "path": "../public/_nuxt/forget-password.496bd906.js"
  },
  "/_nuxt/full-width.a7666141.js": {
    "type": "application/javascript",
    "etag": "\"a11-8V1XWCSkXDyOX0/c61q7nU6oBAI\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 2577,
    "path": "../public/_nuxt/full-width.a7666141.js"
  },
  "/_nuxt/home-slider.c7d9d4d4.js": {
    "type": "application/javascript",
    "etag": "\"7c9-7Njs9cs6m2M/X2wLqLUltbo8coI\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 1993,
    "path": "../public/_nuxt/home-slider.c7d9d4d4.js"
  },
  "/_nuxt/index.7b503b56.js": {
    "type": "application/javascript",
    "etag": "\"595a-JDIgDAr/CTqCEZ5QklR4sT1xZQQ\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 22874,
    "path": "../public/_nuxt/index.7b503b56.js"
  },
  "/_nuxt/index.8bcc038f.js": {
    "type": "application/javascript",
    "etag": "\"805-cOq1KLnTYbI9oM9n9wIzL29hYNI\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 2053,
    "path": "../public/_nuxt/index.8bcc038f.js"
  },
  "/_nuxt/index.b957580e.js": {
    "type": "application/javascript",
    "etag": "\"1d4-ysyPzNrDnUvlJ1aU9M6rSlkNFY4\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 468,
    "path": "../public/_nuxt/index.b957580e.js"
  },
  "/_nuxt/index.f4634d8c.js": {
    "type": "application/javascript",
    "etag": "\"1132-dnT3s3TGw/AvN+qm9T5JwaC/Lt0\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 4402,
    "path": "../public/_nuxt/index.f4634d8c.js"
  },
  "/_nuxt/list-view.bc39fe27.js": {
    "type": "application/javascript",
    "etag": "\"24b8-5enZG+wEI5N/Sn/CJ5Z4okEI114\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 9400,
    "path": "../public/_nuxt/list-view.bc39fe27.js"
  },
  "/_nuxt/login.99fd55e9.js": {
    "type": "application/javascript",
    "etag": "\"d80-E8wPXT1BlsC4JGrtCQUaumHimMM\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 3456,
    "path": "../public/_nuxt/login.99fd55e9.js"
  },
  "/_nuxt/logo-slider.13bb3217.js": {
    "type": "application/javascript",
    "etag": "\"595-J2ugRQkPX8rRdQVsgJdTf+Izq2c\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 1429,
    "path": "../public/_nuxt/logo-slider.13bb3217.js"
  },
  "/_nuxt/lookbook.7cdf62de.js": {
    "type": "application/javascript",
    "etag": "\"6cb-ifmjNdouMCqODuF61LmPd+UnPs8\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 1739,
    "path": "../public/_nuxt/lookbook.7cdf62de.js"
  },
  "/_nuxt/masonary-fullwidth.65f46411.js": {
    "type": "application/javascript",
    "etag": "\"c48-5RCzZRH2H4FKuLp1d9A6jkEj7Qw\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 3144,
    "path": "../public/_nuxt/masonary-fullwidth.65f46411.js"
  },
  "/_nuxt/metro.7d4219c4.js": {
    "type": "application/javascript",
    "etag": "\"ee3-WaCECV/Yyr/lSLdhV81hSShn2kk\"",
    "mtime": "2023-04-08T00:16:32.085Z",
    "size": 3811,
    "path": "../public/_nuxt/metro.7d4219c4.js"
  },
  "/_nuxt/multi-slider.217585c6.js": {
    "type": "application/javascript",
    "etag": "\"2878-LD1/h2dgvpMa5CYPba84AWw+IVA\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 10360,
    "path": "../public/_nuxt/multi-slider.217585c6.js"
  },
  "/_nuxt/navigation.079e38c4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"50f-WJHhQ2fORg2FU9Cf5JWmYCjSUgQ\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 1295,
    "path": "../public/_nuxt/navigation.079e38c4.css"
  },
  "/_nuxt/navigation.min.bc300a5d.js": {
    "type": "application/javascript",
    "etag": "\"c42-Wi/bHA7lOH4FOSXZyMhFAfNmRc8\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 3138,
    "path": "../public/_nuxt/navigation.min.bc300a5d.js"
  },
  "/_nuxt/no-sidebar.6011f54b.js": {
    "type": "application/javascript",
    "etag": "\"2137-H4M+SNfm4a3hBZ8L/ec5ffY2lr4\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 8503,
    "path": "../public/_nuxt/no-sidebar.6011f54b.js"
  },
  "/_nuxt/order-success.5e408a55.js": {
    "type": "application/javascript",
    "etag": "\"c63-N8HHXdE9MM0egz/MJHGqV5Z0VOU\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 3171,
    "path": "../public/_nuxt/order-success.5e408a55.js"
  },
  "/_nuxt/product-box1.9119f0d8.js": {
    "type": "application/javascript",
    "etag": "\"1207-GWjoxsX55DWw5mI39SWRdb1zN8Q\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 4615,
    "path": "../public/_nuxt/product-box1.9119f0d8.js"
  },
  "/_nuxt/product-slider.c4916a1f.js": {
    "type": "application/javascript",
    "etag": "\"b3c-aLV2Rgc+GMbefUfzo0EHLTrkapc\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 2876,
    "path": "../public/_nuxt/product-slider.c4916a1f.js"
  },
  "/_nuxt/product-tabs.37b33e47.js": {
    "type": "application/javascript",
    "etag": "\"1532-DqleHvZWXUQKzSDIqrc91vpZjdM\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 5426,
    "path": "../public/_nuxt/product-tabs.37b33e47.js"
  },
  "/_nuxt/profile.c590f158.js": {
    "type": "application/javascript",
    "etag": "\"117e-n+nCkBMlSDJqFl1kpbZRrzeT5iE\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 4478,
    "path": "../public/_nuxt/profile.c590f158.js"
  },
  "/_nuxt/register.4b36c014.js": {
    "type": "application/javascript",
    "etag": "\"7fc-THnsnaLSlsA8zMUmQSrqDHeP1es\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 2044,
    "path": "../public/_nuxt/register.4b36c014.js"
  },
  "/_nuxt/review.5fdbb76b.js": {
    "type": "application/javascript",
    "etag": "\"b79-QYVLc0guMNDxAw30ip2XFEe7Gmw\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 2937,
    "path": "../public/_nuxt/review.5fdbb76b.js"
  },
  "/_nuxt/right-sidebar.8fa38114.js": {
    "type": "application/javascript",
    "etag": "\"2513-HTlv4KTTKCu277bTgLyUF7prHg4\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 9491,
    "path": "../public/_nuxt/right-sidebar.8fa38114.js"
  },
  "/_nuxt/search.41704dc1.js": {
    "type": "application/javascript",
    "etag": "\"647-SoY2epkONeHpVHYLOLYjvfgTIXQ\"",
    "mtime": "2023-04-08T00:16:32.082Z",
    "size": 1607,
    "path": "../public/_nuxt/search.41704dc1.js"
  },
  "/_nuxt/service.b4d9c344.js": {
    "type": "application/javascript",
    "etag": "\"589f-bDzoYTB+PSbvdPDuUirr60Bz+tk\"",
    "mtime": "2023-04-08T00:16:32.079Z",
    "size": 22687,
    "path": "../public/_nuxt/service.b4d9c344.js"
  },
  "/_nuxt/sidebar-popup.625168f9.js": {
    "type": "application/javascript",
    "etag": "\"254e-IUO5M0kH1dYAgUsCTGMcIo0hASo\"",
    "mtime": "2023-04-08T00:16:32.079Z",
    "size": 9550,
    "path": "../public/_nuxt/sidebar-popup.625168f9.js"
  },
  "/_nuxt/sitemap.48816bf7.js": {
    "type": "application/javascript",
    "etag": "\"1e67-qoT74GPWb7Sp+rKEop2Unn6HaQ4\"",
    "mtime": "2023-04-08T00:16:32.079Z",
    "size": 7783,
    "path": "../public/_nuxt/sitemap.48816bf7.js"
  },
  "/_nuxt/six-grid.9855dcea.js": {
    "type": "application/javascript",
    "etag": "\"2596-cQ+SHMCuitbWZ6xIdznmX9N0lcI\"",
    "mtime": "2023-04-08T00:16:32.079Z",
    "size": 9622,
    "path": "../public/_nuxt/six-grid.9855dcea.js"
  },
  "/_nuxt/swiper.41606de1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1593-prVLr+ptPvhK6GsYksGsmbByIDU\"",
    "mtime": "2023-04-08T00:16:32.079Z",
    "size": 5523,
    "path": "../public/_nuxt/swiper.41606de1.css"
  },
  "/_nuxt/swiper.min.fed330f3.js": {
    "type": "application/javascript",
    "etag": "\"14236-cWA0s5UHhbwyw8GDkFRjtW/i9MI\"",
    "mtime": "2023-04-08T00:16:32.079Z",
    "size": 82486,
    "path": "../public/_nuxt/swiper.min.fed330f3.js"
  },
  "/_nuxt/themify.0db5c5a1.woff": {
    "type": "font/woff",
    "etag": "\"db2c-k5TzW9Kt3SRma3m/w21PnSR8sB0\"",
    "mtime": "2023-04-08T00:16:32.075Z",
    "size": 56108,
    "path": "../public/_nuxt/themify.0db5c5a1.woff"
  },
  "/_nuxt/themify.350663a4.ttf": {
    "type": "font/ttf",
    "etag": "\"132f8-W7H+aUUqSEVmqBB2r3Vnco/n5Ds\"",
    "mtime": "2023-04-08T00:16:32.075Z",
    "size": 78584,
    "path": "../public/_nuxt/themify.350663a4.ttf"
  },
  "/_nuxt/themify.dff415da.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"1339c-3xKglCzxkz8JFf49kQ+iN58JLYM\"",
    "mtime": "2023-04-08T00:16:32.075Z",
    "size": 78748,
    "path": "../public/_nuxt/themify.dff415da.eot"
  },
  "/_nuxt/themify.f7af2e09.svg": {
    "type": "image/svg+xml",
    "etag": "\"3931d-9a8RL7WqfE9mWswho4sDW7tiMnw\"",
    "mtime": "2023-04-08T00:16:32.075Z",
    "size": 234269,
    "path": "../public/_nuxt/themify.f7af2e09.svg"
  },
  "/_nuxt/three-grid.6e4727eb.js": {
    "type": "application/javascript",
    "etag": "\"3a00-TECHD6YWNri4MsFtPaO8PP8Z2IA\"",
    "mtime": "2023-04-08T00:16:32.075Z",
    "size": 14848,
    "path": "../public/_nuxt/three-grid.6e4727eb.js"
  },
  "/_nuxt/timer.a272c1e7.js": {
    "type": "application/javascript",
    "etag": "\"4db-iOiiVlfcPH8lBLLQEOQfN7L8x3I\"",
    "mtime": "2023-04-08T00:16:32.075Z",
    "size": 1243,
    "path": "../public/_nuxt/timer.a272c1e7.js"
  },
  "/_nuxt/typography.995ba636.js": {
    "type": "application/javascript",
    "etag": "\"2459-HpOMbY/VHpzDhtmTJAyho2LnK9A\"",
    "mtime": "2023-04-08T00:16:32.072Z",
    "size": 9305,
    "path": "../public/_nuxt/typography.995ba636.js"
  },
  "/_nuxt/wishlist.88f96b09.js": {
    "type": "application/javascript",
    "etag": "\"c5e-gkqrNYw6BfgZT26eekab5LiXc0s\"",
    "mtime": "2023-04-08T00:16:32.072Z",
    "size": 3166,
    "path": "../public/_nuxt/wishlist.88f96b09.js"
  },
  "/images/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-QBh9qmye+o3tRfXuMMvwaHlbMOI\"",
    "mtime": "2023-04-08T00:16:33.312Z",
    "size": 13716,
    "path": "../public/images/1.jpg"
  },
  "/images/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.312Z",
    "size": 16688,
    "path": "../public/images/10.jpg"
  },
  "/images/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:33.309Z",
    "size": 2865,
    "path": "../public/images/2.jpg"
  },
  "/images/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"ac2-p656oJeMFDC5GPHGIDsVqszZxQg\"",
    "mtime": "2023-04-08T00:16:33.309Z",
    "size": 2754,
    "path": "../public/images/20.jpg"
  },
  "/images/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"ac2-p656oJeMFDC5GPHGIDsVqszZxQg\"",
    "mtime": "2023-04-08T00:16:33.309Z",
    "size": 2754,
    "path": "../public/images/21.jpg"
  },
  "/images/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-Ub237vDkAFrV8cIG4lJB2Hi3AC4\"",
    "mtime": "2023-04-08T00:16:33.309Z",
    "size": 16208,
    "path": "../public/images/3.jpg"
  },
  "/images/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a82-5LOt9p4DuTFqR3BWMsuB4gNsFVs\"",
    "mtime": "2023-04-08T00:16:33.309Z",
    "size": 6786,
    "path": "../public/images/4.jpg"
  },
  "/images/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.305Z",
    "size": 17960,
    "path": "../public/images/5.jpg"
  },
  "/images/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-HnagUB4oC8ongTh7q/+wH+2VxbM\"",
    "mtime": "2023-04-08T00:16:33.305Z",
    "size": 10746,
    "path": "../public/images/6.jpg"
  },
  "/images/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:33.305Z",
    "size": 4011,
    "path": "../public/images/7.jpg"
  },
  "/images/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:33.305Z",
    "size": 6631,
    "path": "../public/images/8.jpg"
  },
  "/images/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-0+zqF5W6Hta5NqInITqfBe9YDzE\"",
    "mtime": "2023-04-08T00:16:33.305Z",
    "size": 12996,
    "path": "../public/images/9.jpg"
  },
  "/images/Offer-banner.png": {
    "type": "image/png",
    "etag": "\"5961-1vWY6Jqe70fmKUBgyd8PxLQ5p9Q\"",
    "mtime": "2023-04-08T00:16:33.305Z",
    "size": 22881,
    "path": "../public/images/Offer-banner.png"
  },
  "/images/ajax-loader.gif": {
    "type": "image/gif",
    "etag": "\"33f0-kIBrB+tUCa6SFz1N1EKLoNmKdW4\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 13296,
    "path": "../public/images/ajax-loader.gif"
  },
  "/images/avtar.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 2865,
    "path": "../public/images/avtar.jpg"
  },
  "/images/banner-game.jpg": {
    "type": "image/jpeg",
    "etag": "\"47c8-dnKRVUPqx28KuslT6Sft+uesb6I\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 18376,
    "path": "../public/images/banner-game.jpg"
  },
  "/images/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 7454,
    "path": "../public/images/banner.jpg"
  },
  "/images/banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 7454,
    "path": "../public/images/banner1.jpg"
  },
  "/images/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 7454,
    "path": "../public/images/banner2.jpg"
  },
  "/images/bg-image.jpg": {
    "type": "image/jpeg",
    "etag": "\"3c23-n+lqHAWGS9RXKJn5qVLOTqEdei4\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 15395,
    "path": "../public/images/bg-image.jpg"
  },
  "/images/cat1.jpg": {
    "type": "image/jpeg",
    "etag": "\"193f-dt8/KK2ir2sd8yh1O3c6IHOOIPE\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 6463,
    "path": "../public/images/cat1.jpg"
  },
  "/images/cat1.png": {
    "type": "image/png",
    "etag": "\"79f-uI14En5VuvPokZmFB6MjuvPF56Q\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 1951,
    "path": "../public/images/cat1.png"
  },
  "/images/cat2.jpg": {
    "type": "image/jpeg",
    "etag": "\"193f-dt8/KK2ir2sd8yh1O3c6IHOOIPE\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 6463,
    "path": "../public/images/cat2.jpg"
  },
  "/images/cat2.png": {
    "type": "image/png",
    "etag": "\"79f-uI14En5VuvPokZmFB6MjuvPF56Q\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 1951,
    "path": "../public/images/cat2.png"
  },
  "/images/cat3.jpg": {
    "type": "image/jpeg",
    "etag": "\"193f-dt8/KK2ir2sd8yh1O3c6IHOOIPE\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 6463,
    "path": "../public/images/cat3.jpg"
  },
  "/images/cat3.png": {
    "type": "image/png",
    "etag": "\"79f-uI14En5VuvPokZmFB6MjuvPF56Q\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 1951,
    "path": "../public/images/cat3.png"
  },
  "/images/coming-soon.jpg": {
    "type": "image/jpeg",
    "etag": "\"c541-0S9BezaDnqzEMGNxP3QBJBksKbs\"",
    "mtime": "2023-04-08T00:16:33.295Z",
    "size": 50497,
    "path": "../public/images/coming-soon.jpg"
  },
  "/images/demo.jpg": {
    "type": "image/jpeg",
    "etag": "\"548-ke8aWnfBoHEZjyG9iPupDS48n+s\"",
    "mtime": "2023-04-08T00:16:33.295Z",
    "size": 1352,
    "path": "../public/images/demo.jpg"
  },
  "/images/dog.png": {
    "type": "image/png",
    "etag": "\"373-xARVrx/aC101UfuOqJUdyqgEJ2U\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 883,
    "path": "../public/images/dog.png"
  },
  "/images/dropdown.png": {
    "type": "image/png",
    "etag": "\"de-f42I0GrsXBPFC2U5UsBrAmAXjBw\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 222,
    "path": "../public/images/dropdown.png"
  },
  "/images/empty-cart.png": {
    "type": "image/png",
    "etag": "\"7d75-YXLYxP74HTr1SBERP4IYCKNDQik\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 32117,
    "path": "../public/images/empty-cart.png"
  },
  "/images/empty-compare.png": {
    "type": "image/png",
    "etag": "\"f36-UITz01teDuToWV+fbhflDY3ZykI\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 3894,
    "path": "../public/images/empty-compare.png"
  },
  "/images/empty-search.jpg": {
    "type": "image/jpeg",
    "etag": "\"1374-zPelwnyarLPw0fAOsjRGbdctOHw\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 4980,
    "path": "../public/images/empty-search.jpg"
  },
  "/images/empty-wishlist.png": {
    "type": "image/png",
    "etag": "\"12c1-4Woq1hnuKdjk9CiNog1g9ZjieCY\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 4801,
    "path": "../public/images/empty-wishlist.png"
  },
  "/images/exit-popup.jpg": {
    "type": "image/jpeg",
    "etag": "\"9fe-PVeaUyuooU+rjWZrE6pzWtXRt54\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 2558,
    "path": "../public/images/exit-popup.jpg"
  },
  "/images/favicon.png": {
    "type": "image/png",
    "etag": "\"187-FQrveRuGxM12q+00NpO7R7Nv+IQ\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 391,
    "path": "../public/images/favicon.png"
  },
  "/images/icon-empty-cart.png": {
    "type": "image/png",
    "etag": "\"6cf-3U1fkBr8C/30JEFCKt0ckdZf46Q\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 1743,
    "path": "../public/images/icon-empty-cart.png"
  },
  "/images/loader.gif": {
    "type": "image/gif",
    "etag": "\"6f2d-4t9HVyQokiFWbwKslhAIQGBVzqA\"",
    "mtime": "2023-04-08T00:16:33.175Z",
    "size": 28461,
    "path": "../public/images/loader.gif"
  },
  "/images/loading.gif": {
    "type": "image/gif",
    "etag": "\"c88-LrP59DD7KmJn4NJSEp72Rz0HTzc\"",
    "mtime": "2023-04-08T00:16:33.175Z",
    "size": 3208,
    "path": "../public/images/loading.gif"
  },
  "/images/lookbook.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a98-x3MSIMbFXNmPNHOj1KGJGtkxvUw\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 10904,
    "path": "../public/images/lookbook.jpg"
  },
  "/images/lookbook2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a98-x3MSIMbFXNmPNHOj1KGJGtkxvUw\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 10904,
    "path": "../public/images/lookbook2.jpg"
  },
  "/images/main-banner-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"1904e-n0ELcKqrvBRVYYxbkZxdpc1Q23M\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 102478,
    "path": "../public/images/main-banner-bg.jpg"
  },
  "/images/mega-menu-image.png": {
    "type": "image/png",
    "etag": "\"540-69jAHahxnv//FEZvJpSLtFzdh40\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 1344,
    "path": "../public/images/mega-menu-image.png"
  },
  "/images/mega.jpg": {
    "type": "image/jpeg",
    "etag": "\"19886-Bb7/0+VzPVDa1kgzw1XlQmz51ps\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 104582,
    "path": "../public/images/mega.jpg"
  },
  "/images/metro.jpg": {
    "type": "image/jpeg",
    "etag": "\"86001-g6gs18lRoOdUq4mp+i0ueMGLoeI\"",
    "mtime": "2023-04-08T00:16:33.162Z",
    "size": 548865,
    "path": "../public/images/metro.jpg"
  },
  "/images/offer-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"f6ff-T3fXshae1t5HjEiABOdDAfE8rK8\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 63231,
    "path": "../public/images/offer-banner.jpg"
  },
  "/images/offer.jpg": {
    "type": "image/jpeg",
    "etag": "\"e1e3-JC9AQ/b5k11Wk/r+LNJBtzqrCs8\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 57827,
    "path": "../public/images/offer.jpg"
  },
  "/images/payment_cart.png": {
    "type": "image/png",
    "etag": "\"4d2c-9mbp4ec7gzjju8yDdB3qVuznqQ8\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 19756,
    "path": "../public/images/payment_cart.png"
  },
  "/images/paypal.png": {
    "type": "image/png",
    "etag": "\"1bc4-sY0P/AxUQ4byNBBHNaoZszH7Ykg\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 7108,
    "path": "../public/images/paypal.png"
  },
  "/images/side-banner.png": {
    "type": "image/png",
    "etag": "\"3d6-LBURfzQ0c1Mse7QK1sRcRKFby2g\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 982,
    "path": "../public/images/side-banner.png"
  },
  "/images/size-chart.jpg": {
    "type": "image/jpeg",
    "etag": "\"f41d-EdsNBToq5y3jIKF86JEzb/yt8cU\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 62493,
    "path": "../public/images/size-chart.jpg"
  },
  "/images/sort_asc.png": {
    "type": "image/png",
    "etag": "\"5f-ZAzDWEt0ONgpOn78ETtW8sP8YyM\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 95,
    "path": "../public/images/sort_asc.png"
  },
  "/images/sort_both.png": {
    "type": "image/png",
    "etag": "\"5f-ZAzDWEt0ONgpOn78ETtW8sP8YyM\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 95,
    "path": "../public/images/sort_both.png"
  },
  "/images/stop.png": {
    "type": "image/png",
    "etag": "\"16d9-HD56hFbmW01US/ZyYHppl98X2b4\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 5849,
    "path": "../public/images/stop.png"
  },
  "/images/sub-banner.png": {
    "type": "image/png",
    "etag": "\"841-EhXwq1CoM9PPDaLjqfmxhRquf30\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 2113,
    "path": "../public/images/sub-banner.png"
  },
  "/images/sub-banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 7454,
    "path": "../public/images/sub-banner1.jpg"
  },
  "/images/sub-banner1.png": {
    "type": "image/png",
    "etag": "\"841-EhXwq1CoM9PPDaLjqfmxhRquf30\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 2113,
    "path": "../public/images/sub-banner1.png"
  },
  "/images/sub-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 7454,
    "path": "../public/images/sub-banner2.jpg"
  },
  "/images/sub-banner2.png": {
    "type": "image/png",
    "etag": "\"7f7-0CB/0Hwj0Vv0rmZ6/vKJmzJu2Ks\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 2039,
    "path": "../public/images/sub-banner2.png"
  },
  "/images2/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 2865,
    "path": "../public/images2/2.jpg"
  },
  "/images2/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"ac2-p656oJeMFDC5GPHGIDsVqszZxQg\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 2754,
    "path": "../public/images2/20.jpg"
  },
  "/images2/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"ac2-p656oJeMFDC5GPHGIDsVqszZxQg\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 2754,
    "path": "../public/images2/21.jpg"
  },
  "/images2/Footer payment icons.png": {
    "type": "image/png",
    "etag": "\"1452f-PVl/Syg9Q7n5S+7EkZiH/ZYcDhg\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 83247,
    "path": "../public/images2/Footer payment icons.png"
  },
  "/images2/Offer-banner.png": {
    "type": "image/png",
    "etag": "\"5961-1vWY6Jqe70fmKUBgyd8PxLQ5p9Q\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 22881,
    "path": "../public/images2/Offer-banner.png"
  },
  "/images2/ajax-loader.gif": {
    "type": "image/gif",
    "etag": "\"33f0-kIBrB+tUCa6SFz1N1EKLoNmKdW4\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 13296,
    "path": "../public/images2/ajax-loader.gif"
  },
  "/images2/arrow.png": {
    "type": "image/png",
    "etag": "\"1102-gDpQppFsIYGeARHLrcIjc7la79s\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 4354,
    "path": "../public/images2/arrow.png"
  },
  "/images2/avtar.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 2865,
    "path": "../public/images2/avtar.jpg"
  },
  "/images2/banner-game.jpg": {
    "type": "image/jpeg",
    "etag": "\"2237-NWkUMKYHyoANceHZVSQMal0gYjA\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 8759,
    "path": "../public/images2/banner-game.jpg"
  },
  "/images2/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 7454,
    "path": "../public/images2/banner.jpg"
  },
  "/images2/banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 7454,
    "path": "../public/images2/banner1.jpg"
  },
  "/images2/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 7454,
    "path": "../public/images2/banner2.jpg"
  },
  "/images2/bg-image.jpg": {
    "type": "image/jpeg",
    "etag": "\"3c23-n+lqHAWGS9RXKJn5qVLOTqEdei4\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 15395,
    "path": "../public/images2/bg-image.jpg"
  },
  "/images2/cat1.jpg": {
    "type": "image/jpeg",
    "etag": "\"193f-dt8/KK2ir2sd8yh1O3c6IHOOIPE\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 6463,
    "path": "../public/images2/cat1.jpg"
  },
  "/images2/cat1.png": {
    "type": "image/png",
    "etag": "\"79f-uI14En5VuvPokZmFB6MjuvPF56Q\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 1951,
    "path": "../public/images2/cat1.png"
  },
  "/images2/cat2.jpg": {
    "type": "image/jpeg",
    "etag": "\"193f-dt8/KK2ir2sd8yh1O3c6IHOOIPE\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 6463,
    "path": "../public/images2/cat2.jpg"
  },
  "/images2/cat2.png": {
    "type": "image/png",
    "etag": "\"79f-uI14En5VuvPokZmFB6MjuvPF56Q\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 1951,
    "path": "../public/images2/cat2.png"
  },
  "/images2/cat3.jpg": {
    "type": "image/jpeg",
    "etag": "\"193f-dt8/KK2ir2sd8yh1O3c6IHOOIPE\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 6463,
    "path": "../public/images2/cat3.jpg"
  },
  "/images2/cat3.png": {
    "type": "image/png",
    "etag": "\"79f-uI14En5VuvPokZmFB6MjuvPF56Q\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 1951,
    "path": "../public/images2/cat3.png"
  },
  "/images2/coming-soon.jpg": {
    "type": "image/jpeg",
    "etag": "\"c541-0S9BezaDnqzEMGNxP3QBJBksKbs\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 50497,
    "path": "../public/images2/coming-soon.jpg"
  },
  "/images2/dark-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"8ff-K770liHihYmQkaXNUEFI/eBoykE\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 2303,
    "path": "../public/images2/dark-bg.jpg"
  },
  "/images2/dog.png": {
    "type": "image/png",
    "etag": "\"373-xARVrx/aC101UfuOqJUdyqgEJ2U\"",
    "mtime": "2023-04-08T00:16:32.989Z",
    "size": 883,
    "path": "../public/images2/dog.png"
  },
  "/images2/download.png": {
    "type": "image/png",
    "etag": "\"2c394-aI7hyMUelVZ3GCTur1Sjqet8xBw\"",
    "mtime": "2023-04-08T00:16:32.989Z",
    "size": 181140,
    "path": "../public/images2/download.png"
  },
  "/images2/dropdown.png": {
    "type": "image/png",
    "etag": "\"de-f42I0GrsXBPFC2U5UsBrAmAXjBw\"",
    "mtime": "2023-04-08T00:16:32.989Z",
    "size": 222,
    "path": "../public/images2/dropdown.png"
  },
  "/images2/fire.gif": {
    "type": "image/gif",
    "etag": "\"2633-InirrClLt0lxXQ5cVov8tyG4yls\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 9779,
    "path": "../public/images2/fire.gif"
  },
  "/images2/img.jpg": {
    "type": "image/jpeg",
    "etag": "\"14189-NGUKRWKDpJKCAMUrUMNnGxYuaHY\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 82313,
    "path": "../public/images2/img.jpg"
  },
  "/images2/js-grid.png": {
    "type": "image/png",
    "etag": "\"5047-IsspLBq7ob8uMvtcC2rSOttmvis\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 20551,
    "path": "../public/images2/js-grid.png"
  },
  "/images2/loading.gif": {
    "type": "image/gif",
    "etag": "\"c88-LrP59DD7KmJn4NJSEp72Rz0HTzc\"",
    "mtime": "2023-04-08T00:16:32.449Z",
    "size": 3208,
    "path": "../public/images2/loading.gif"
  },
  "/images2/lookbook.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a98-x3MSIMbFXNmPNHOj1KGJGtkxvUw\"",
    "mtime": "2023-04-08T00:16:32.435Z",
    "size": 10904,
    "path": "../public/images2/lookbook.jpg"
  },
  "/images2/lookbook2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a98-x3MSIMbFXNmPNHOj1KGJGtkxvUw\"",
    "mtime": "2023-04-08T00:16:32.435Z",
    "size": 10904,
    "path": "../public/images2/lookbook2.jpg"
  },
  "/images2/main-banner-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"1904e-n0ELcKqrvBRVYYxbkZxdpc1Q23M\"",
    "mtime": "2023-04-08T00:16:32.432Z",
    "size": 102478,
    "path": "../public/images2/main-banner-bg.jpg"
  },
  "/images2/mega-menu-image.png": {
    "type": "image/png",
    "etag": "\"540-69jAHahxnv//FEZvJpSLtFzdh40\"",
    "mtime": "2023-04-08T00:16:32.345Z",
    "size": 1344,
    "path": "../public/images2/mega-menu-image.png"
  },
  "/images2/mega.jpg": {
    "type": "image/jpeg",
    "etag": "\"19886-Bb7/0+VzPVDa1kgzw1XlQmz51ps\"",
    "mtime": "2023-04-08T00:16:32.345Z",
    "size": 104582,
    "path": "../public/images2/mega.jpg"
  },
  "/images2/menu-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f985-CkGrjPW3YJ5EoNpFuy6Gv5kDsGw\"",
    "mtime": "2023-04-08T00:16:32.345Z",
    "size": 129413,
    "path": "../public/images2/menu-banner.jpg"
  },
  "/images2/menu-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"5ad0-H9X061j6FD+KzHvsQPeWbaqcozg\"",
    "mtime": "2023-04-08T00:16:32.345Z",
    "size": 23248,
    "path": "../public/images2/menu-banner2.jpg"
  },
  "/images2/metro.jpg": {
    "type": "image/jpeg",
    "etag": "\"86001-g6gs18lRoOdUq4mp+i0ueMGLoeI\"",
    "mtime": "2023-04-08T00:16:32.342Z",
    "size": 548865,
    "path": "../public/images2/metro.jpg"
  },
  "/images2/offer-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"1917-wiIndz/PzYWJ6wsP/OHfRSktjTg\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 6423,
    "path": "../public/images2/offer-banner.jpg"
  },
  "/images2/offer-banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2658-PAptsyYujKcQQvMN95XrGS3Qezw\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 9816,
    "path": "../public/images2/offer-banner1.jpg"
  },
  "/images2/offer.jpg": {
    "type": "image/jpeg",
    "etag": "\"e1e3-JC9AQ/b5k11Wk/r+LNJBtzqrCs8\"",
    "mtime": "2023-04-08T00:16:32.319Z",
    "size": 57827,
    "path": "../public/images2/offer.jpg"
  },
  "/images2/payment.png": {
    "type": "image/png",
    "etag": "\"255a-Y2lsLOO6QWV8DqrFh5qJ0fRwdxQ\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 9562,
    "path": "../public/images2/payment.png"
  },
  "/images2/payment_cart.png": {
    "type": "image/png",
    "etag": "\"4d2c-9mbp4ec7gzjju8yDdB3qVuznqQ8\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 19756,
    "path": "../public/images2/payment_cart.png"
  },
  "/images2/paypal.png": {
    "type": "image/png",
    "etag": "\"1bc4-sY0P/AxUQ4byNBBHNaoZszH7Ykg\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 7108,
    "path": "../public/images2/paypal.png"
  },
  "/images2/person.gif": {
    "type": "image/gif",
    "etag": "\"c24-Egu0zhWQZmkjjs2xv2tPC4hRE4c\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 3108,
    "path": "../public/images2/person.gif"
  },
  "/images2/side-banner.png": {
    "type": "image/png",
    "etag": "\"3d6-LBURfzQ0c1Mse7QK1sRcRKFby2g\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 982,
    "path": "../public/images2/side-banner.png"
  },
  "/images2/size-chart.jpg": {
    "type": "image/jpeg",
    "etag": "\"f41d-EdsNBToq5y3jIKF86JEzb/yt8cU\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 62493,
    "path": "../public/images2/size-chart.jpg"
  },
  "/images2/sort_asc.png": {
    "type": "image/png",
    "etag": "\"5f-ZAzDWEt0ONgpOn78ETtW8sP8YyM\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 95,
    "path": "../public/images2/sort_asc.png"
  },
  "/images2/sort_both.png": {
    "type": "image/png",
    "etag": "\"5f-ZAzDWEt0ONgpOn78ETtW8sP8YyM\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 95,
    "path": "../public/images2/sort_both.png"
  },
  "/images2/stop.png": {
    "type": "image/png",
    "etag": "\"16d9-HD56hFbmW01US/ZyYHppl98X2b4\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 5849,
    "path": "../public/images2/stop.png"
  },
  "/images2/sub-banner.png": {
    "type": "image/png",
    "etag": "\"841-EhXwq1CoM9PPDaLjqfmxhRquf30\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 2113,
    "path": "../public/images2/sub-banner.png"
  },
  "/images2/sub-banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 7454,
    "path": "../public/images2/sub-banner1.jpg"
  },
  "/images2/sub-banner1.png": {
    "type": "image/png",
    "etag": "\"841-EhXwq1CoM9PPDaLjqfmxhRquf30\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 2113,
    "path": "../public/images2/sub-banner1.png"
  },
  "/images2/sub-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d1e-yfzx+/dJPVvZ9zDsSrsPSflM/u4\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 7454,
    "path": "../public/images2/sub-banner2.jpg"
  },
  "/images2/sub-banner2.png": {
    "type": "image/png",
    "etag": "\"7f7-0CB/0Hwj0Vv0rmZ6/vKJmzJu2Ks\"",
    "mtime": "2023-04-08T00:16:32.162Z",
    "size": 2039,
    "path": "../public/images2/sub-banner2.png"
  },
  "/images2/wave-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"14481-3ju2maB05006whsGCTdS8gJ+3uU\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 83073,
    "path": "../public/images2/wave-bg.jpg"
  },
  "/images/about/about-us.jpg": {
    "type": "image/jpeg",
    "etag": "\"4870-98I+jwwWrQI5e19Kb+UYDqTOqC4\"",
    "mtime": "2023-04-08T00:16:33.305Z",
    "size": 18544,
    "path": "../public/images/about/about-us.jpg"
  },
  "/images/beauty/about-us.jpg": {
    "type": "image/jpeg",
    "etag": "\"1195-bZ5A7fZiYFpeqbz/GcQABs1WRKI\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 4501,
    "path": "../public/images/beauty/about-us.jpg"
  },
  "/images/beauty/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:33.302Z",
    "size": 38037,
    "path": "../public/images/beauty/banner2.jpg"
  },
  "/images/beauty/video_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9c-yPMRKb23BHViwaNm73lWB3rlaZY\"",
    "mtime": "2023-04-08T00:16:33.299Z",
    "size": 15260,
    "path": "../public/images/beauty/video_1.jpg"
  },
  "/images/collection/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.295Z",
    "size": 5000,
    "path": "../public/images/collection/1.jpg"
  },
  "/images/demo/background.jpg": {
    "type": "image/jpeg",
    "etag": "\"12e4f-f8FXjpqTN/WhNvp8gsrFOC7vX2c\"",
    "mtime": "2023-04-08T00:16:33.295Z",
    "size": 77391,
    "path": "../public/images/demo/background.jpg"
  },
  "/images/demo/layout.png": {
    "type": "image/png",
    "etag": "\"54438-y0xRuXXJ428C0NFgRi+jmDBiZsk\"",
    "mtime": "2023-04-08T00:16:33.295Z",
    "size": 345144,
    "path": "../public/images/demo/layout.png"
  },
  "/images/demo/logo.png": {
    "type": "image/png",
    "etag": "\"65e-xQ+NVNN0F1dR1NMBKvy07o6e6RI\"",
    "mtime": "2023-04-08T00:16:33.295Z",
    "size": 1630,
    "path": "../public/images/demo/logo.png"
  },
  "/images/electronics/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3d71-zB/iI5GbyKixG3uz3L3Bt7IITQw\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 15729,
    "path": "../public/images/electronics/1.jpg"
  },
  "/images/electronics/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"14b1-Yo6iNd0R0uxD4dK/yNsmroi/Ty4\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 5297,
    "path": "../public/images/electronics/2.jpg"
  },
  "/images/electronics/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"14b1-Yo6iNd0R0uxD4dK/yNsmroi/Ty4\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 5297,
    "path": "../public/images/electronics/4.jpg"
  },
  "/images/electronics/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 7688,
    "path": "../public/images/electronics/5.jpg"
  },
  "/images/electronics/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 7688,
    "path": "../public/images/electronics/6.jpg"
  },
  "/images/electronics/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 7688,
    "path": "../public/images/electronics/7.jpg"
  },
  "/images/electronics/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"df82-Mxm4tyccsKBkdf93AllboI4htM8\"",
    "mtime": "2023-04-08T00:16:33.292Z",
    "size": 57218,
    "path": "../public/images/electronics/bg.jpg"
  },
  "/images/electronics/logo.png": {
    "type": "image/png",
    "etag": "\"30a-wMy7JLnbXaoWbnj269Ki9Rk4Eto\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 778,
    "path": "../public/images/electronics/logo.png"
  },
  "/images/electronics/sub1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1927-asYiX9X5oIwiBOgIhuzM+mhcuKo\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 6439,
    "path": "../public/images/electronics/sub1.jpg"
  },
  "/images/electronics/sub2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1927-asYiX9X5oIwiBOgIhuzM+mhcuKo\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 6439,
    "path": "../public/images/electronics/sub2.jpg"
  },
  "/images/electronics/sub3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1927-asYiX9X5oIwiBOgIhuzM+mhcuKo\"",
    "mtime": "2023-04-08T00:16:33.289Z",
    "size": 6439,
    "path": "../public/images/electronics/sub3.jpg"
  },
  "/images/fashion/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 7688,
    "path": "../public/images/fashion/1.jpg"
  },
  "/images/fashion/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 7688,
    "path": "../public/images/fashion/2.jpg"
  },
  "/images/fashion/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 7688,
    "path": "../public/images/fashion/3.jpg"
  },
  "/images/fashion/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 7688,
    "path": "../public/images/fashion/4.jpg"
  },
  "/images/fashion/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"42d4-6ajmovmlAPVD+pkJ1albgSZkpu0\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 17108,
    "path": "../public/images/fashion/banner.jpg"
  },
  "/images/fashion/sub-banner-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 7688,
    "path": "../public/images/fashion/sub-banner-1.jpg"
  },
  "/images/fashion/sub-banner-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 7688,
    "path": "../public/images/fashion/sub-banner-4.jpg"
  },
  "/images/favicon/1.png": {
    "type": "image/png",
    "etag": "\"4e1-w+FRYRZroq30om1nvk4hGcHkeGU\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 1249,
    "path": "../public/images/favicon/1.png"
  },
  "/images/favicon/10.png": {
    "type": "image/png",
    "etag": "\"1c7-xuo4mvftoH9Xd9ancEI57OOnE2k\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 455,
    "path": "../public/images/favicon/10.png"
  },
  "/images/favicon/11.png": {
    "type": "image/png",
    "etag": "\"1c6-tdTb1aDtbp8a6em60iFOT7ouEfU\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 454,
    "path": "../public/images/favicon/11.png"
  },
  "/images/favicon/12.png": {
    "type": "image/png",
    "etag": "\"4d8-JsCWYMqucen7WMpoYM9hdvvoyY8\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1240,
    "path": "../public/images/favicon/12.png"
  },
  "/images/favicon/13.png": {
    "type": "image/png",
    "etag": "\"4e5-wwdw909uT9QsipTI+A7A0rRzFdk\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1253,
    "path": "../public/images/favicon/13.png"
  },
  "/images/favicon/14.png": {
    "type": "image/png",
    "etag": "\"4d8-Zu4E8AxMv4l8pVvyG8YNWZH3T8I\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1240,
    "path": "../public/images/favicon/14.png"
  },
  "/images/favicon/15.png": {
    "type": "image/png",
    "etag": "\"4d8-9s0hIQ1Jjfup5IG8WQ6/PjsoHic\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1240,
    "path": "../public/images/favicon/15.png"
  },
  "/images/favicon/16.png": {
    "type": "image/png",
    "etag": "\"4d8-/5B81ufL047x8wc3Jk+O6ZbfMrk\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1240,
    "path": "../public/images/favicon/16.png"
  },
  "/images/favicon/17.png": {
    "type": "image/png",
    "etag": "\"4d8-vs0BHQUlCAkKBPn5eFjhlY0Fig4\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1240,
    "path": "../public/images/favicon/17.png"
  },
  "/images/favicon/18.png": {
    "type": "image/png",
    "etag": "\"491-xbfP2eeom1dcCTDf/nfHyFQXJqY\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1169,
    "path": "../public/images/favicon/18.png"
  },
  "/images/favicon/2.png": {
    "type": "image/png",
    "etag": "\"4d3-VpZCloCxV1zGpGCIwjKDmj0g7Uc\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1235,
    "path": "../public/images/favicon/2.png"
  },
  "/images/favicon/3.png": {
    "type": "image/png",
    "etag": "\"4d3-1Zsyj4qMBu5LlUvlWspdQ25253M\"",
    "mtime": "2023-04-08T00:16:33.272Z",
    "size": 1235,
    "path": "../public/images/favicon/3.png"
  },
  "/images/favicon/4.png": {
    "type": "image/png",
    "etag": "\"4d3-xoZeMMk7r7DoiKpfI9c/Yl4aAR8\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 1235,
    "path": "../public/images/favicon/4.png"
  },
  "/images/favicon/5.png": {
    "type": "image/png",
    "etag": "\"1c8-Z75x4sL4j6VYajdNfkuqy/3Kc8Y\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 456,
    "path": "../public/images/favicon/5.png"
  },
  "/images/favicon/6.png": {
    "type": "image/png",
    "etag": "\"1c6-bL6eGLDTilRvgz8u/0GQ6MBRpao\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 454,
    "path": "../public/images/favicon/6.png"
  },
  "/images/favicon/7.png": {
    "type": "image/png",
    "etag": "\"1c2-xnSlz7IDl4I8wMnhYg465JYqU7w\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 450,
    "path": "../public/images/favicon/7.png"
  },
  "/images/favicon/8.png": {
    "type": "image/png",
    "etag": "\"4d8-wf1YFh4tbItAK2MrNxhZ7+i1gx4\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 1240,
    "path": "../public/images/favicon/8.png"
  },
  "/images/favicon/9.png": {
    "type": "image/png",
    "etag": "\"1c6-KkMpavxq9esnp+SyxEPNLGQd6lc\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 454,
    "path": "../public/images/favicon/9.png"
  },
  "/images/feature/blog(right-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"112a-CdNZJFpIl9tn5VukVPlgLia2Mcs\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 4394,
    "path": "../public/images/feature/blog(right-sidebar).jpg"
  },
  "/images/feature/blog-detail.jpg": {
    "type": "image/jpeg",
    "etag": "\"acb-0Q2c/OHnhs3hKw9a0vqhJePVRsI\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 2763,
    "path": "../public/images/feature/blog-detail.jpg"
  },
  "/images/feature/blog-page.jpg": {
    "type": "image/jpeg",
    "etag": "\"1185-S2uiy2LARmPO00R+j0PvUVUAJXY\"",
    "mtime": "2023-04-08T00:16:33.269Z",
    "size": 4485,
    "path": "../public/images/feature/blog-page.jpg"
  },
  "/images/feature/category-page(infinite-scroll).jpg": {
    "type": "image/jpeg",
    "etag": "\"11e8-f2XdsZkBFYWGWX0nw6dPVIbM22s\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 4584,
    "path": "../public/images/feature/category-page(infinite-scroll).jpg"
  },
  "/images/feature/category-page(no-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"d83-2o4Jw5DF2+fh3pDoO0dKUXrdLD0\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 3459,
    "path": "../public/images/feature/category-page(no-sidebar).jpg"
  },
  "/images/feature/category-page(right).jpg": {
    "type": "image/jpeg",
    "etag": "\"1213-gP21QGVLvf1tTmjBptgWIBFwWOM\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 4627,
    "path": "../public/images/feature/category-page(right).jpg"
  },
  "/images/feature/category-page(sidebar-popup).jpg": {
    "type": "image/jpeg",
    "etag": "\"e16-j3lduD6Y2qvmPVa3e3cQA08DoUU\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 3606,
    "path": "../public/images/feature/category-page(sidebar-popup).jpg"
  },
  "/images/feature/category-page.jpg": {
    "type": "image/jpeg",
    "etag": "\"11f7-VwBdBM3ikR1OjHQGuH9JVUSWLk0\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 4599,
    "path": "../public/images/feature/category-page.jpg"
  },
  "/images/feature/product-page(3-col-left).jpg": {
    "type": "image/jpeg",
    "etag": "\"f3c-2mf1gMGxDBnt2mUAT7OTwK1GQOg\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 3900,
    "path": "../public/images/feature/product-page(3-col-left).jpg"
  },
  "/images/feature/product-page(3-col-right).jpg": {
    "type": "image/jpeg",
    "etag": "\"ef7-s0lZefpoIvmIEjEpm5vYdDyAK5g\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 3831,
    "path": "../public/images/feature/product-page(3-col-right).jpg"
  },
  "/images/feature/product-page(3-column).jpg": {
    "type": "image/jpeg",
    "etag": "\"ec7-pYZdWuAS+rHJ5MRQHjjaDZnlEIE\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 3783,
    "path": "../public/images/feature/product-page(3-column).jpg"
  },
  "/images/feature/product-page(accordian).jpg": {
    "type": "image/jpeg",
    "etag": "\"d0b-Bh0Cp7RUVHSbMCTMh5tl0nBR1oQ\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 3339,
    "path": "../public/images/feature/product-page(accordian).jpg"
  },
  "/images/feature/product-page(full-page).jpg": {
    "type": "image/jpeg",
    "etag": "\"1008-AjJhUndaNIV6a3pWQQaCgOzQ1iQ\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 4104,
    "path": "../public/images/feature/product-page(full-page).jpg"
  },
  "/images/feature/product-page(left-image).jpg": {
    "type": "image/jpeg",
    "etag": "\"c06-FqvcgMf1HLerQfU3wNz5TyEPSRA\"",
    "mtime": "2023-04-08T00:16:33.265Z",
    "size": 3078,
    "path": "../public/images/feature/product-page(left-image).jpg"
  },
  "/images/feature/product-page(left-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"cbb-tDv6DjstVfXGnX6fE+BsX2Ojcus\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 3259,
    "path": "../public/images/feature/product-page(left-sidebar).jpg"
  },
  "/images/feature/product-page(no-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"c24-/mRMwXWp/9mWPEwCvq9mkZ3E23g\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 3108,
    "path": "../public/images/feature/product-page(no-sidebar).jpg"
  },
  "/images/feature/product-page(right-image).jpg": {
    "type": "image/jpeg",
    "etag": "\"bd4-EXbYpr0LZSiBFC68UdaiMGZ0kWM\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 3028,
    "path": "../public/images/feature/product-page(right-image).jpg"
  },
  "/images/feature/product-page(right-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"d45-2rd1FVIkE9KEbkUS5VrvPjMazog\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 3397,
    "path": "../public/images/feature/product-page(right-sidebar).jpg"
  },
  "/images/feature/product-page(sticky).jpg": {
    "type": "image/jpeg",
    "etag": "\"99b-HfDxTF4vdoqJ7HhKHvGTNT5/tSM\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 2459,
    "path": "../public/images/feature/product-page(sticky).jpg"
  },
  "/images/feature/product-page(vertical-tab).jpg": {
    "type": "image/jpeg",
    "etag": "\"ec2-TqlFikcYm54NM3hOSAxlevsqcZw\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 3778,
    "path": "../public/images/feature/product-page(vertical-tab).jpg"
  },
  "/images/flower/banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3849-yrKSruMYKGjYeAbEyQHeBCbf3Lw\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 14409,
    "path": "../public/images/flower/banner1.jpg"
  },
  "/images/flower/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"b02f-/sFnWHnNZpibA7A2m0HPMEv3VDc\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 45103,
    "path": "../public/images/flower/bg.jpg"
  },
  "/images/flower/flower-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:33.262Z",
    "size": 55509,
    "path": "../public/images/flower/flower-bg.jpg"
  },
  "/images/flower/service1.png": {
    "type": "image/png",
    "etag": "\"47e-J3mfHf7K5NcMl66nA+NQ1/0Ba1w\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 1150,
    "path": "../public/images/flower/service1.png"
  },
  "/images/flower/service2.png": {
    "type": "image/png",
    "etag": "\"5cd-4gx6LI+LYnRQ55+misJaoPrZwVM\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 1485,
    "path": "../public/images/flower/service2.png"
  },
  "/images/flower/service3.png": {
    "type": "image/png",
    "etag": "\"628-aNw78qDnhg/PPW0CEdjQjZVkKr8\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 1576,
    "path": "../public/images/flower/service3.png"
  },
  "/images/flower/service4.png": {
    "type": "image/png",
    "etag": "\"2e5-DaNKqt+eK0Vk/N0SewZLcgRzGRw\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 741,
    "path": "../public/images/flower/service4.png"
  },
  "/images/flower/sub-banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3849-yrKSruMYKGjYeAbEyQHeBCbf3Lw\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 14409,
    "path": "../public/images/flower/sub-banner1.jpg"
  },
  "/images/flower/sub-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"19b4-sLqA//WSFC/0lpgViLopGpopUZ4\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 6580,
    "path": "../public/images/flower/sub-banner2.jpg"
  },
  "/images/furniture/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 1863,
    "path": "../public/images/furniture/1.jpg"
  },
  "/images/furniture/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 1863,
    "path": "../public/images/furniture/2.jpg"
  },
  "/images/furniture/2banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 7688,
    "path": "../public/images/furniture/2banner1.jpg"
  },
  "/images/furniture/2banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.259Z",
    "size": 7688,
    "path": "../public/images/furniture/2banner2.jpg"
  },
  "/images/furniture/2banner3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 7688,
    "path": "../public/images/furniture/2banner3.jpg"
  },
  "/images/furniture/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"afd-nKCT10b9FZoE/f4tGGX1NddzkmM\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 2813,
    "path": "../public/images/furniture/3.jpg"
  },
  "/images/furniture/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"146a-X+pJlNG2tUzGPGr/PVzHyaZMfHo\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 5226,
    "path": "../public/images/furniture/4.jpg"
  },
  "/images/furniture/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"146a-X+pJlNG2tUzGPGr/PVzHyaZMfHo\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 5226,
    "path": "../public/images/furniture/5.jpg"
  },
  "/images/furniture/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 1863,
    "path": "../public/images/furniture/6.jpg"
  },
  "/images/furniture/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 1863,
    "path": "../public/images/furniture/7.jpg"
  },
  "/images/furniture/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 1863,
    "path": "../public/images/furniture/8.jpg"
  },
  "/images/furniture/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 1863,
    "path": "../public/images/furniture/9.jpg"
  },
  "/images/furniture/banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"9028-cYLqFLsWgCdg3DdOy3kwRPpdxA4\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 36904,
    "path": "../public/images/furniture/banner1.jpg"
  },
  "/images/furniture/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"9028-cYLqFLsWgCdg3DdOy3kwRPpdxA4\"",
    "mtime": "2023-04-08T00:16:33.255Z",
    "size": 36904,
    "path": "../public/images/furniture/banner2.jpg"
  },
  "/images/furniture/banner4.jpg": {
    "type": "image/jpeg",
    "etag": "\"9028-cYLqFLsWgCdg3DdOy3kwRPpdxA4\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 36904,
    "path": "../public/images/furniture/banner4.jpg"
  },
  "/images/furniture/blog1.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 55509,
    "path": "../public/images/furniture/blog1.jpg"
  },
  "/images/furniture/blog2.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 55509,
    "path": "../public/images/furniture/blog2.jpg"
  },
  "/images/furniture/blog3.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 55509,
    "path": "../public/images/furniture/blog3.jpg"
  },
  "/images/furniture/selk.jpg": {
    "type": "image/jpeg",
    "etag": "\"d696-vO60XgXHXv51I+8JuU1EURX1SrI\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 54934,
    "path": "../public/images/furniture/selk.jpg"
  },
  "/images/game/back.png": {
    "type": "image/png",
    "etag": "\"17af7-94hNQ3Crb9TPB7lYFR6D8xBfMwQ\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 97015,
    "path": "../public/images/game/back.png"
  },
  "/images/game/footer.jpg": {
    "type": "image/jpeg",
    "etag": "\"9daa-U8w/MfI+rbXcE6od46ZWebbz8kg\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 40362,
    "path": "../public/images/game/footer.jpg"
  },
  "/images/game/top.png": {
    "type": "image/png",
    "etag": "\"edc5-7Ntn57lefGnOGlu2n3jAGh/Ibf4\"",
    "mtime": "2023-04-08T00:16:33.252Z",
    "size": 60869,
    "path": "../public/images/game/top.png"
  },
  "/images/gym/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 13653,
    "path": "../public/images/gym/1.jpg"
  },
  "/images/gym/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f05-3Hwjz4Ql063S9sDGCv1RWb4rS5Y\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 12037,
    "path": "../public/images/gym/banner2.jpg"
  },
  "/images/gym/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"c541-0S9BezaDnqzEMGNxP3QBJBksKbs\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 50497,
    "path": "../public/images/gym/bg.jpg"
  },
  "/images/gym/logo.png": {
    "type": "image/png",
    "etag": "\"a22-Y2nMmUwicwtEtKSUZH0nfKHwsr0\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 2594,
    "path": "../public/images/gym/logo.png"
  },
  "/images/home-banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 36472,
    "path": "../public/images/home-banner/1.jpg"
  },
  "/images/home-banner/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 49386,
    "path": "../public/images/home-banner/23.jpg"
  },
  "/images/home-banner/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 49386,
    "path": "../public/images/home-banner/24.jpg"
  },
  "/images/home-banner/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 49386,
    "path": "../public/images/home-banner/25.jpg"
  },
  "/images/home-banner/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"b8ac-MSKv/itjqp02Q9BRNZu0VP5Lt+Q\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 47276,
    "path": "../public/images/home-banner/26.jpg"
  },
  "/images/home-banner/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 54473,
    "path": "../public/images/home-banner/27.jpg"
  },
  "/images/home-banner/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"a40e-tq1L5Kcc0xUTzAa3eJUqCRf6KN0\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 41998,
    "path": "../public/images/home-banner/30.jpg"
  },
  "/images/home-banner/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"9235-daZxpYZN+cI8SrN/kae5vjUPLdU\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 37429,
    "path": "../public/images/home-banner/31.jpg"
  },
  "/images/home-banner/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"9826-EU+J+K3eziMpULjKo+0sXCVDek8\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 38950,
    "path": "../public/images/home-banner/32.jpg"
  },
  "/images/home-banner/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"9826-EU+J+K3eziMpULjKo+0sXCVDek8\"",
    "mtime": "2023-04-08T00:16:33.245Z",
    "size": 38950,
    "path": "../public/images/home-banner/33.jpg"
  },
  "/images/home-banner/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 38037,
    "path": "../public/images/home-banner/34.jpg"
  },
  "/images/home-banner/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 38037,
    "path": "../public/images/home-banner/35.jpg"
  },
  "/images/home-banner/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 38037,
    "path": "../public/images/home-banner/36.jpg"
  },
  "/images/home-banner/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 36472,
    "path": "../public/images/home-banner/37.jpg"
  },
  "/images/home-banner/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c02-9zn4ZYCI47zfMH01MauoAi15Rto\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 39938,
    "path": "../public/images/home-banner/38.jpg"
  },
  "/images/home-banner/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c02-9zn4ZYCI47zfMH01MauoAi15Rto\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 39938,
    "path": "../public/images/home-banner/39.jpg"
  },
  "/images/home-banner/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"9221-fnMOnl3XwvwnT/dv7mPDv3/coIw\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 37409,
    "path": "../public/images/home-banner/40.jpg"
  },
  "/images/home-banner/41.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 49386,
    "path": "../public/images/home-banner/41.jpg"
  },
  "/images/home-banner/42.jpg": {
    "type": "image/jpeg",
    "etag": "\"6396-W1QWczlbE7dJg5ITk/1EsO5WbCo\"",
    "mtime": "2023-04-08T00:16:33.242Z",
    "size": 25494,
    "path": "../public/images/home-banner/42.jpg"
  },
  "/images/home-banner/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 49386,
    "path": "../public/images/home-banner/43.jpg"
  },
  "/images/home-banner/44.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 49386,
    "path": "../public/images/home-banner/44.jpg"
  },
  "/images/home-banner/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"8776-pyZMi9yDm6CpA7JrBAA98hyaOhU\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 34678,
    "path": "../public/images/home-banner/45.jpg"
  },
  "/images/home-banner/46.jpg": {
    "type": "image/jpeg",
    "etag": "\"8776-pyZMi9yDm6CpA7JrBAA98hyaOhU\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 34678,
    "path": "../public/images/home-banner/46.jpg"
  },
  "/images/home-banner/47.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 49386,
    "path": "../public/images/home-banner/47.jpg"
  },
  "/images/home-banner/48.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 49386,
    "path": "../public/images/home-banner/48.jpg"
  },
  "/images/home-banner/49.jpg": {
    "type": "image/jpeg",
    "etag": "\"9056-fwfdhhk+Nd6dBVks43CwmF4Otm4\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 36950,
    "path": "../public/images/home-banner/49.jpg"
  },
  "/images/home-banner/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 49386,
    "path": "../public/images/home-banner/50.jpg"
  },
  "/images/home-banner/51.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.239Z",
    "size": 49386,
    "path": "../public/images/home-banner/51.jpg"
  },
  "/images/home-banner/52.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 49386,
    "path": "../public/images/home-banner/52.jpg"
  },
  "/images/home-banner/53.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 54473,
    "path": "../public/images/home-banner/53.jpg"
  },
  "/images/home-banner/54.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 54473,
    "path": "../public/images/home-banner/54.jpg"
  },
  "/images/home-banner/55.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 54473,
    "path": "../public/images/home-banner/55.jpg"
  },
  "/images/home-banner/56.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 54473,
    "path": "../public/images/home-banner/56.jpg"
  },
  "/images/icon/-icon.png": {
    "type": "image/png",
    "etag": "\"53e-TJpa6Az2xSg1wn7wsbycqTMpKoM\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 1342,
    "path": "../public/images/icon/-icon.png"
  },
  "/images/icon/2.png": {
    "type": "image/png",
    "etag": "\"3b3-tWBQuYRLapW54QzGItTTKtuFSzk\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 947,
    "path": "../public/images/icon/2.png"
  },
  "/images/icon/3.png": {
    "type": "image/png",
    "etag": "\"3b7-cdVq5tFC9XlCk1chAPhYq1YTglY\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 951,
    "path": "../public/images/icon/3.png"
  },
  "/images/icon/4.png": {
    "type": "image/png",
    "etag": "\"3b6-rqx2u9gKFSO6goiEeLohGjyu0Wg\"",
    "mtime": "2023-04-08T00:16:33.235Z",
    "size": 950,
    "path": "../public/images/icon/4.png"
  },
  "/images/icon/6.png": {
    "type": "image/png",
    "etag": "\"3b9-1nqXNLZ/VBaEiWvRi1YWzmD3WoA\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 953,
    "path": "../public/images/icon/6.png"
  },
  "/images/icon/Add-to-cart.png": {
    "type": "image/png",
    "etag": "\"57b-0LQ1xcPCHTO/abrsg+jkwzVQMcI\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 1403,
    "path": "../public/images/icon/Add-to-cart.png"
  },
  "/images/icon/american-express.png": {
    "type": "image/png",
    "etag": "\"497-9cklPxJIf8kIie84z3p52G3LY8I\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 1175,
    "path": "../public/images/icon/american-express.png"
  },
  "/images/icon/angular.png": {
    "type": "image/png",
    "etag": "\"9c1-G+i0QOnWC3eEi2gUvwqwmwzGBkc\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 2497,
    "path": "../public/images/icon/angular.png"
  },
  "/images/icon/avatar.png": {
    "type": "image/png",
    "etag": "\"2b3-iPZorMpAMrFiFIKdBgkmDuavvtM\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 691,
    "path": "../public/images/icon/avatar.png"
  },
  "/images/icon/bar.png": {
    "type": "image/png",
    "etag": "\"424-UqyM+ZOeSdl7U72KNlgxrmlferc\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 1060,
    "path": "../public/images/icon/bar.png"
  },
  "/images/icon/cart-old.png": {
    "type": "image/png",
    "etag": "\"58a-aCYaFugDMLoKxRy3SY/qPJEdCnA\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 1418,
    "path": "../public/images/icon/cart-old.png"
  },
  "/images/icon/cart.png": {
    "type": "image/png",
    "etag": "\"58a-aCYaFugDMLoKxRy3SY/qPJEdCnA\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 1418,
    "path": "../public/images/icon/cart.png"
  },
  "/images/icon/cat1.png": {
    "type": "image/png",
    "etag": "\"6d4-bQHhj+CMMWu9D8KCpV6oREWyU8I\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 1748,
    "path": "../public/images/icon/cat1.png"
  },
  "/images/icon/cat2.png": {
    "type": "image/png",
    "etag": "\"6ac-H6sSfFu/kJps4JgMBPSKAabtt4w\"",
    "mtime": "2023-04-08T00:16:33.232Z",
    "size": 1708,
    "path": "../public/images/icon/cat2.png"
  },
  "/images/icon/cat3.png": {
    "type": "image/png",
    "etag": "\"6d8-Cz+3YiXik48ii9OiLnI7RXJXRTk\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1752,
    "path": "../public/images/icon/cat3.png"
  },
  "/images/icon/cat4.png": {
    "type": "image/png",
    "etag": "\"6cf-1PINfXD6Gjd1G46LczKAqFR7pbs\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1743,
    "path": "../public/images/icon/cat4.png"
  },
  "/images/icon/cat5.png": {
    "type": "image/png",
    "etag": "\"6c0-yApsBrL5KThxMqiGlXlf+ekLdgY\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1728,
    "path": "../public/images/icon/cat5.png"
  },
  "/images/icon/cat6.png": {
    "type": "image/png",
    "etag": "\"65d-5dAj2rrLlIEfQoFIBq44lInoRR0\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1629,
    "path": "../public/images/icon/cat6.png"
  },
  "/images/icon/discover.png": {
    "type": "image/png",
    "etag": "\"52c-ow0c+IvEeynnhpnfWzthUQqyyeY\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 1324,
    "path": "../public/images/icon/discover.png"
  },
  "/images/icon/email.png": {
    "type": "image/png",
    "etag": "\"549-muQAv1+rAla6JhoQhO9DM4p56Nc\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 1353,
    "path": "../public/images/icon/email.png"
  },
  "/images/icon/footerlogo.png": {
    "type": "image/png",
    "etag": "\"8cc-CXcMCpWjMXvOhyygBaaA4cXGWZA\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 2252,
    "path": "../public/images/icon/footerlogo.png"
  },
  "/images/icon/heart.png": {
    "type": "image/png",
    "etag": "\"27f-/0Bd8wPXCf55R6Tn9jRpHl2Z7vs\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 639,
    "path": "../public/images/icon/heart.png"
  },
  "/images/icon/instagrma.png": {
    "type": "image/png",
    "etag": "\"a7e-824Sh9cqvRAErzYLVyykg2uzhq8\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 2686,
    "path": "../public/images/icon/instagrma.png"
  },
  "/images/icon/like.png": {
    "type": "image/png",
    "etag": "\"29d-qFp+iCTnN+SJtZTVjHEWsUA27To\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 669,
    "path": "../public/images/icon/like.png"
  },
  "/images/icon/logo-2.png": {
    "type": "image/png",
    "etag": "\"a22-Y2nMmUwicwtEtKSUZH0nfKHwsr0\"",
    "mtime": "2023-04-08T00:16:33.199Z",
    "size": 2594,
    "path": "../public/images/icon/logo-2.png"
  },
  "/images/icon/logo-3.png": {
    "type": "image/png",
    "etag": "\"ccc-tXeROWRxMYZJO7aC8a6g2kwGKWo\"",
    "mtime": "2023-04-08T00:16:33.199Z",
    "size": 3276,
    "path": "../public/images/icon/logo-3.png"
  },
  "/images/icon/logo-4.png": {
    "type": "image/png",
    "etag": "\"97b-8MqNLDFUfoUWA1AUV0L00VyZ6vE\"",
    "mtime": "2023-04-08T00:16:33.199Z",
    "size": 2427,
    "path": "../public/images/icon/logo-4.png"
  },
  "/images/icon/logo-game.png": {
    "type": "image/png",
    "etag": "\"a22-bTvBXg7yC63eSgRLdMqJOc9newA\"",
    "mtime": "2023-04-08T00:16:33.199Z",
    "size": 2594,
    "path": "../public/images/icon/logo-game.png"
  },
  "/images/icon/logo-layout-6.png": {
    "type": "image/png",
    "etag": "\"30a-ksYQkpMDeCbcUoXM2GD6NKX5d34\"",
    "mtime": "2023-04-08T00:16:33.199Z",
    "size": 778,
    "path": "../public/images/icon/logo-layout-6.png"
  },
  "/images/icon/logo.png": {
    "type": "image/png",
    "etag": "\"8c9-T1nHqdhobcZ6zquEiltkxSF48Sg\"",
    "mtime": "2023-04-08T00:16:33.189Z",
    "size": 2249,
    "path": "../public/images/icon/logo.png"
  },
  "/images/icon/magnifying-glass.png": {
    "type": "image/png",
    "etag": "\"273-dELreXSCXFU7lPetdAZSIn43+3E\"",
    "mtime": "2023-04-08T00:16:33.189Z",
    "size": 627,
    "path": "../public/images/icon/magnifying-glass.png"
  },
  "/images/icon/mastercard.png": {
    "type": "image/png",
    "etag": "\"5c7-wubdLouvvgDW8F4vOLx4S1InD2g\"",
    "mtime": "2023-04-08T00:16:33.189Z",
    "size": 1479,
    "path": "../public/images/icon/mastercard.png"
  },
  "/images/icon/paypal.png": {
    "type": "image/png",
    "etag": "\"3fa-RLyUNMYHcM6+06hdoqro03b8c14\"",
    "mtime": "2023-04-08T00:16:33.189Z",
    "size": 1018,
    "path": "../public/images/icon/paypal.png"
  },
  "/images/icon/phone.png": {
    "type": "image/png",
    "etag": "\"447-mxE+PCr+n323CxZQmcF0pAr5F/0\"",
    "mtime": "2023-04-08T00:16:33.189Z",
    "size": 1095,
    "path": "../public/images/icon/phone.png"
  },
  "/images/icon/quick-view.png": {
    "type": "image/png",
    "etag": "\"510-/1y85hFxvAj1J0MrbnUQcgGBosc\"",
    "mtime": "2023-04-08T00:16:33.189Z",
    "size": 1296,
    "path": "../public/images/icon/quick-view.png"
  },
  "/images/icon/react.jpg": {
    "type": "image/jpeg",
    "etag": "\"11233-ARPZWM6n8AajhjEUICi5QH2FOJU\"",
    "mtime": "2023-04-08T00:16:33.189Z",
    "size": 70195,
    "path": "../public/images/icon/react.jpg"
  },
  "/images/icon/react.png": {
    "type": "image/png",
    "etag": "\"a5c-/kl6iC5BodEYpgPrFT7/GeUV4/k\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 2652,
    "path": "../public/images/icon/react.png"
  },
  "/images/icon/search.png": {
    "type": "image/png",
    "etag": "\"53e-TJpa6Az2xSg1wn7wsbycqTMpKoM\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 1342,
    "path": "../public/images/icon/search.png"
  },
  "/images/icon/service1.png": {
    "type": "image/png",
    "etag": "\"7d0-RgMZRTab6tlKFKX9EnHz1ANZ6ec\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 2000,
    "path": "../public/images/icon/service1.png"
  },
  "/images/icon/service1.svg": {
    "type": "image/svg+xml",
    "etag": "\"5c9-OALaXKLyZUV4BKr9EYFJjYWqTbU\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 1481,
    "path": "../public/images/icon/service1.svg"
  },
  "/images/icon/service2.png": {
    "type": "image/png",
    "etag": "\"924-72Z5q4zjj+5dBV92f+dBjdVCZHE\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 2340,
    "path": "../public/images/icon/service2.png"
  },
  "/images/icon/service2.svg": {
    "type": "image/svg+xml",
    "etag": "\"6b0-J6eJCT/pFzPwjipdM6mvKO0Yfaw\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 1712,
    "path": "../public/images/icon/service2.svg"
  },
  "/images/icon/service3.png": {
    "type": "image/png",
    "etag": "\"961-1bgCaztXE6mGLZVx2PHw8mqsScc\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 2401,
    "path": "../public/images/icon/service3.png"
  },
  "/images/icon/service3.svg": {
    "type": "image/svg+xml",
    "etag": "\"954-zoY5ZZPJXl6Ds/+uvaVVMOxciJ4\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 2388,
    "path": "../public/images/icon/service3.svg"
  },
  "/images/icon/service4.png": {
    "type": "image/png",
    "etag": "\"468-CQfk6js835pCdCbVeANYz8VPzbQ\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 1128,
    "path": "../public/images/icon/service4.png"
  },
  "/images/icon/service4.svg": {
    "type": "image/svg+xml",
    "etag": "\"8f8-yIuYJ9pIV8sgdU280qwa2Md0C4g\"",
    "mtime": "2023-04-08T00:16:33.185Z",
    "size": 2296,
    "path": "../public/images/icon/service4.svg"
  },
  "/images/icon/setting.png": {
    "type": "image/png",
    "etag": "\"689-NKrp5i98D+DWAdZKQqlDW6Gq4to\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 1673,
    "path": "../public/images/icon/setting.png"
  },
  "/images/icon/settings.png": {
    "type": "image/png",
    "etag": "\"2af-7KFd3hJ2U/G/5AOHQcrQffK9W8Y\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 687,
    "path": "../public/images/icon/settings.png"
  },
  "/images/icon/shopify.png": {
    "type": "image/png",
    "etag": "\"a07-DTPRvYBf4lNy+UuO7xnvqn2n1dA\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 2567,
    "path": "../public/images/icon/shopify.png"
  },
  "/images/icon/shopping-cart.png": {
    "type": "image/png",
    "etag": "\"264-lhLKkYyxrBsxNOzVZt5UjTgOyc0\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 612,
    "path": "../public/images/icon/shopping-cart.png"
  },
  "/images/icon/users.png": {
    "type": "image/png",
    "etag": "\"276-JK5qFMoORu3lXdOO6qQorling34\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 630,
    "path": "../public/images/icon/users.png"
  },
  "/images/icon/visa.png": {
    "type": "image/png",
    "etag": "\"63b-NnpCDHTVN/3HB2WVh12y2PRDR9A\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 1595,
    "path": "../public/images/icon/visa.png"
  },
  "/images/icon/wishlist.png": {
    "type": "image/png",
    "etag": "\"445-mJ7hBBKS3kHgbdfxz8KFLoZ6/sQ\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 1093,
    "path": "../public/images/icon/wishlist.png"
  },
  "/images/kids/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3287-tVXWlZ/XFhKzvSfmkmTJgwRLQ5A\"",
    "mtime": "2023-04-08T00:16:33.175Z",
    "size": 12935,
    "path": "../public/images/kids/1.jpg"
  },
  "/images/kids/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3287-tVXWlZ/XFhKzvSfmkmTJgwRLQ5A\"",
    "mtime": "2023-04-08T00:16:33.175Z",
    "size": 12935,
    "path": "../public/images/kids/2.jpg"
  },
  "/images/logos/1.png": {
    "type": "image/png",
    "etag": "\"17f2-B1Ej3pRUewscAGS/MlrYjnSXL5o\"",
    "mtime": "2023-04-08T00:16:33.175Z",
    "size": 6130,
    "path": "../public/images/logos/1.png"
  },
  "/images/logos/10.png": {
    "type": "image/png",
    "etag": "\"5cd3-dThEEZ7sSlc/YdM0RVbMpJQeFtI\"",
    "mtime": "2023-04-08T00:16:33.175Z",
    "size": 23763,
    "path": "../public/images/logos/10.png"
  },
  "/images/logos/11.png": {
    "type": "image/png",
    "etag": "\"58d5-4t50D8Fb0LHeVN4Ky37A0djr0pU\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 22741,
    "path": "../public/images/logos/11.png"
  },
  "/images/logos/12.png": {
    "type": "image/png",
    "etag": "\"4bc9-4x7Fe4i55PHaWq5x8yFZ6BCG4/M\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 19401,
    "path": "../public/images/logos/12.png"
  },
  "/images/logos/13.png": {
    "type": "image/png",
    "etag": "\"4102-E0wdIOr84n1P8CdiukWbSugnLpU\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 16642,
    "path": "../public/images/logos/13.png"
  },
  "/images/logos/14.png": {
    "type": "image/png",
    "etag": "\"4cb3-tQ5m9diq/x7OnsvVFwv0i7FieLo\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 19635,
    "path": "../public/images/logos/14.png"
  },
  "/images/logos/15.png": {
    "type": "image/png",
    "etag": "\"46b9-sQGYZQg02Wm32U9Qyj0KuW+LLzE\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 18105,
    "path": "../public/images/logos/15.png"
  },
  "/images/logos/16.png": {
    "type": "image/png",
    "etag": "\"58e4-1j6fhgGNK7Xsm7zFojjJgW77C+U\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 22756,
    "path": "../public/images/logos/16.png"
  },
  "/images/logos/17.png": {
    "type": "image/png",
    "etag": "\"4d5b-vM+tPONwolDTDJI4kJWiBoAaKcc\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 19803,
    "path": "../public/images/logos/17.png"
  },
  "/images/logos/2.png": {
    "type": "image/png",
    "etag": "\"563c-qi0YdCF3If0RUoGjm9PP1JWS9No\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 22076,
    "path": "../public/images/logos/2.png"
  },
  "/images/logos/3.png": {
    "type": "image/png",
    "etag": "\"176d-2eCibUMRSfj98+9Pdges87NOIr8\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 5997,
    "path": "../public/images/logos/3.png"
  },
  "/images/logos/4.png": {
    "type": "image/png",
    "etag": "\"f45-67E5Sll9ctf4kpkig5WpawHFy0s\"",
    "mtime": "2023-04-08T00:16:33.172Z",
    "size": 3909,
    "path": "../public/images/logos/4.png"
  },
  "/images/logos/5.png": {
    "type": "image/png",
    "etag": "\"1b0a-bOTyOMe9/XLXZ1N+iykTH4TQzl4\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 6922,
    "path": "../public/images/logos/5.png"
  },
  "/images/logos/6.png": {
    "type": "image/png",
    "etag": "\"19c6-PKfhV3W0gi2/8cYtO+mNZDIr2pA\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 6598,
    "path": "../public/images/logos/6.png"
  },
  "/images/logos/7.png": {
    "type": "image/png",
    "etag": "\"184b-6WUwPmpGMrRKLUFHPUo609eNh/s\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 6219,
    "path": "../public/images/logos/7.png"
  },
  "/images/logos/8.png": {
    "type": "image/png",
    "etag": "\"1910-bTpYIVlb8fvAF7I+O3QHn1t9j/A\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 6416,
    "path": "../public/images/logos/8.png"
  },
  "/images/logos/9.png": {
    "type": "image/png",
    "etag": "\"5220-n9MWd5q8316g7zQ2uQv2SGMGau0\"",
    "mtime": "2023-04-08T00:16:33.169Z",
    "size": 21024,
    "path": "../public/images/logos/9.png"
  },
  "/images/marijuana/leaf-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d92-m+HfIybaMKbKFeiMpMDKXwT8lwY\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 19858,
    "path": "../public/images/marijuana/leaf-bg.jpg"
  },
  "/images/mega-menu/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4bbb-Q7ICHzZsjR+JO8csJkQrOGtTMAY\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 19387,
    "path": "../public/images/mega-menu/2.jpg"
  },
  "/images/mega-menu/fashion.jpg": {
    "type": "image/jpeg",
    "etag": "\"1305-2yMjTdRqs3qNbtHlWyFQQDQyBZ4\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 4869,
    "path": "../public/images/mega-menu/fashion.jpg"
  },
  "/images/menu-icon/1.png": {
    "type": "image/png",
    "etag": "\"f06-K0WJP4x+Mooivi9SV9pHjh6Vud0\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 3846,
    "path": "../public/images/menu-icon/1.png"
  },
  "/images/menu-icon/2.png": {
    "type": "image/png",
    "etag": "\"dae-u7nwT666Q4E+qBhQovXNqAx3Ovo\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 3502,
    "path": "../public/images/menu-icon/2.png"
  },
  "/images/menu-icon/3.png": {
    "type": "image/png",
    "etag": "\"906-Yi8C8BS1hVsp3h3vHZxXiWTYnds\"",
    "mtime": "2023-04-08T00:16:33.165Z",
    "size": 2310,
    "path": "../public/images/menu-icon/3.png"
  },
  "/images/menu-icon/4.png": {
    "type": "image/png",
    "etag": "\"d8c-zvcjpLW7WTq5S3TkGrLMdPKKj6c\"",
    "mtime": "2023-04-08T00:16:33.162Z",
    "size": 3468,
    "path": "../public/images/menu-icon/4.png"
  },
  "/images/menu-icon/5.png": {
    "type": "image/png",
    "etag": "\"f7a-SznBORtmjp17qUDipg4EmVOlmeg\"",
    "mtime": "2023-04-08T00:16:33.162Z",
    "size": 3962,
    "path": "../public/images/menu-icon/5.png"
  },
  "/images/menu-icon/6.png": {
    "type": "image/png",
    "etag": "\"921-TFa0MZByF2Zm4huLdVecrlfzd9Y\"",
    "mtime": "2023-04-08T00:16:33.162Z",
    "size": 2337,
    "path": "../public/images/menu-icon/6.png"
  },
  "/images/nursery/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"b02f-/sFnWHnNZpibA7A2m0HPMEv3VDc\"",
    "mtime": "2023-04-08T00:16:33.162Z",
    "size": 45103,
    "path": "../public/images/nursery/bg.jpg"
  },
  "/images/parallax/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 49386,
    "path": "../public/images/parallax/1.jpg"
  },
  "/images/parallax/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"7f6a-PotLHk737ad7qt/ARvxK3ZC7lfU\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 32618,
    "path": "../public/images/parallax/11.jpg"
  },
  "/images/parallax/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"83de-eI6uWmDYGhlSWpFANhUBWbKh7ZI\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 33758,
    "path": "../public/images/parallax/13.jpg"
  },
  "/images/parallax/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 54473,
    "path": "../public/images/parallax/15.jpg"
  },
  "/images/parallax/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 49386,
    "path": "../public/images/parallax/16.jpg"
  },
  "/images/parallax/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 49386,
    "path": "../public/images/parallax/17.jpg"
  },
  "/images/parallax/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"ccbb-t2aQ0hEzY7nns5VcEyOFO/Jg6hI\"",
    "mtime": "2023-04-08T00:16:33.159Z",
    "size": 52411,
    "path": "../public/images/parallax/18.jpg"
  },
  "/images/parallax/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"8776-pyZMi9yDm6CpA7JrBAA98hyaOhU\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 34678,
    "path": "../public/images/parallax/19.jpg"
  },
  "/images/parallax/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 49386,
    "path": "../public/images/parallax/2.jpg"
  },
  "/images/parallax/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 49386,
    "path": "../public/images/parallax/21.jpg"
  },
  "/images/parallax/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"51ee-LPET+Tp+SQG19JH7wwzK44W10kI\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 20974,
    "path": "../public/images/parallax/24.jpg"
  },
  "/images/parallax/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 49386,
    "path": "../public/images/parallax/25.jpg"
  },
  "/images/parallax/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:33.155Z",
    "size": 49386,
    "path": "../public/images/parallax/3.jpg"
  },
  "/images/slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 3293,
    "path": "../public/images/slider/1.jpg"
  },
  "/images/slider/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 3293,
    "path": "../public/images/slider/10.jpg"
  },
  "/images/slider/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/11.jpg"
  },
  "/images/slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/2.jpg"
  },
  "/images/slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/3.jpg"
  },
  "/images/slider/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/4.jpg"
  },
  "/images/slider/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/5.jpg"
  },
  "/images/slider/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/6.jpg"
  },
  "/images/slider/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/7.jpg"
  },
  "/images/slider/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/8.jpg"
  },
  "/images/slider/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:33.139Z",
    "size": 3293,
    "path": "../public/images/slider/9.jpg"
  },
  "/images/team/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:33.135Z",
    "size": 5579,
    "path": "../public/images/team/1.jpg"
  },
  "/images/team/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:33.132Z",
    "size": 5579,
    "path": "../public/images/team/2.jpg"
  },
  "/images/team/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:33.132Z",
    "size": 5579,
    "path": "../public/images/team/3.jpg"
  },
  "/images/team/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:33.132Z",
    "size": 5579,
    "path": "../public/images/team/4.jpg"
  },
  "/images/tools/1.png": {
    "type": "image/png",
    "etag": "\"503-/Dh3iKk0W4lep/n0pxNnBaiaX5Y\"",
    "mtime": "2023-04-08T00:16:33.132Z",
    "size": 1283,
    "path": "../public/images/tools/1.png"
  },
  "/images/tools/3.png": {
    "type": "image/png",
    "etag": "\"482-GYv5xMb8Xuj8kECcjAYdHz524RQ\"",
    "mtime": "2023-04-08T00:16:33.132Z",
    "size": 1154,
    "path": "../public/images/tools/3.png"
  },
  "/images/tools/4.png": {
    "type": "image/png",
    "etag": "\"482-GYv5xMb8Xuj8kECcjAYdHz524RQ\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 1154,
    "path": "../public/images/tools/4.png"
  },
  "/images/tools/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"301a-+8I4fbyR4q+UOfv579sRT1lK6JA\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 12314,
    "path": "../public/images/tools/banner.jpg"
  },
  "/images/tools/footer.jpg": {
    "type": "image/jpeg",
    "etag": "\"76fc-PH5X0Q+IiqxtiDTdM1X4IKLu/Bw\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 30460,
    "path": "../public/images/tools/footer.jpg"
  },
  "/images/watch/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 17960,
    "path": "../public/images/watch/1.jpg"
  },
  "/images/watch/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 17960,
    "path": "../public/images/watch/10.jpg"
  },
  "/images/watch/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 17960,
    "path": "../public/images/watch/11.jpg"
  },
  "/images/watch/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 17960,
    "path": "../public/images/watch/12.jpg"
  },
  "/images/watch/13.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 316,
    "path": "../public/images/watch/13.png"
  },
  "/images/watch/14.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 316,
    "path": "../public/images/watch/14.png"
  },
  "/images/watch/15.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 316,
    "path": "../public/images/watch/15.png"
  },
  "/images/watch/16.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 316,
    "path": "../public/images/watch/16.png"
  },
  "/images/watch/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.125Z",
    "size": 17960,
    "path": "../public/images/watch/2.jpg"
  },
  "/images/watch/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 17960,
    "path": "../public/images/watch/3.jpg"
  },
  "/images/watch/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 17960,
    "path": "../public/images/watch/4.jpg"
  },
  "/images/watch/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 17960,
    "path": "../public/images/watch/5.jpg"
  },
  "/images/watch/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 17960,
    "path": "../public/images/watch/6.jpg"
  },
  "/images/watch/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 17960,
    "path": "../public/images/watch/7.jpg"
  },
  "/images/watch/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 17960,
    "path": "../public/images/watch/8.jpg"
  },
  "/images/watch/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 17960,
    "path": "../public/images/watch/9.jpg"
  },
  "/images/watch/cat1.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 316,
    "path": "../public/images/watch/cat1.png"
  },
  "/images/watch/cat2.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 316,
    "path": "../public/images/watch/cat2.png"
  },
  "/images/watch/cat3.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.122Z",
    "size": 316,
    "path": "../public/images/watch/cat3.png"
  },
  "/images/watch/cat4.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 316,
    "path": "../public/images/watch/cat4.png"
  },
  "/images2/about/about us.jpg": {
    "type": "image/jpeg",
    "etag": "\"4870-98I+jwwWrQI5e19Kb+UYDqTOqC4\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 18544,
    "path": "../public/images2/about/about us.jpg"
  },
  "/images2/about/vendor.jpg": {
    "type": "image/jpeg",
    "etag": "\"4870-98I+jwwWrQI5e19Kb+UYDqTOqC4\"",
    "mtime": "2023-04-08T00:16:33.119Z",
    "size": 18544,
    "path": "../public/images2/about/vendor.jpg"
  },
  "/images2/bags/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-wWB7Q8YDBtc8kRIeAt19NVOqcqw\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 14804,
    "path": "../public/images2/bags/1.jpg"
  },
  "/images2/bags/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-geR6NQ2m03GnvwssGFGibraabqI\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 14804,
    "path": "../public/images2/bags/19.jpg"
  },
  "/images2/bags/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-H8LrW8DUxagqb1rl7U9/uCg7EQY\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 14804,
    "path": "../public/images2/bags/20.jpg"
  },
  "/images2/bags/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-GON+RgwkWS0/eTwCAcbVdUYQA6Q\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 14804,
    "path": "../public/images2/bags/23.jpg"
  },
  "/images2/bags/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-A5q9wl+WJGwOiQONGFKKq3lgpSA\"",
    "mtime": "2023-04-08T00:16:33.115Z",
    "size": 14804,
    "path": "../public/images2/bags/24.jpg"
  },
  "/images2/bags/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-dpQqUyzZyEwuQR4zyky5kQhYLL4\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 14804,
    "path": "../public/images2/bags/6.jpg"
  },
  "/images2/bags/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-/5L0BX4S/bajdDTaqVuG/bSZJlM\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 14804,
    "path": "../public/images2/bags/7.jpg"
  },
  "/images2/bags/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"39d4-LAilOIIdj5dNzNeArYOg4EFFaAw\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 14804,
    "path": "../public/images2/bags/9.jpg"
  },
  "/images2/beauty/about-us.jpg": {
    "type": "image/jpeg",
    "etag": "\"1195-bZ5A7fZiYFpeqbz/GcQABs1WRKI\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 4501,
    "path": "../public/images2/beauty/about-us.jpg"
  },
  "/images2/beauty/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 38037,
    "path": "../public/images2/beauty/banner2.jpg"
  },
  "/images2/beauty/video_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9c-yPMRKb23BHViwaNm73lWB3rlaZY\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 15260,
    "path": "../public/images2/beauty/video_1.jpg"
  },
  "/images2/bicycle/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 953,
    "path": "../public/images2/bicycle/1.jpg"
  },
  "/images2/bicycle/1.png": {
    "type": "image/png",
    "etag": "\"34b-TfGQ9+yEqzY9wXIUohZY6BcDfXk\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 843,
    "path": "../public/images2/bicycle/1.png"
  },
  "/images2/bicycle/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 953,
    "path": "../public/images2/bicycle/2.jpg"
  },
  "/images2/bicycle/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 953,
    "path": "../public/images2/bicycle/3.jpg"
  },
  "/images2/bicycle/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 953,
    "path": "../public/images2/bicycle/4.jpg"
  },
  "/images2/bicycle/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 953,
    "path": "../public/images2/bicycle/5.jpg"
  },
  "/images2/bicycle/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 953,
    "path": "../public/images2/bicycle/6.jpg"
  },
  "/images2/bicycle/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 953,
    "path": "../public/images2/bicycle/7.jpg"
  },
  "/images2/bicycle/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b9-jqi9MF+fvqC3smLqDHU1bLw6uLw\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 953,
    "path": "../public/images2/bicycle/8.jpg"
  },
  "/images2/bicycle/cycle.png": {
    "type": "image/png",
    "etag": "\"971-i0PizIN3RnnSzXf6c4n8nCaCYkc\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 2417,
    "path": "../public/images2/bicycle/cycle.png"
  },
  "/images2/bicycle/trending-product.jpg": {
    "type": "image/jpeg",
    "etag": "\"40319-744xf3IhFtSejWTAtJ3nULPvplM\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 262937,
    "path": "../public/images2/bicycle/trending-product.jpg"
  },
  "/images2/bicycle/wheel.png": {
    "type": "image/png",
    "etag": "\"15919-loE3ZqUZJihU/7mTCQH2rEBMg9s\"",
    "mtime": "2023-04-08T00:16:33.092Z",
    "size": 88345,
    "path": "../public/images2/bicycle/wheel.png"
  },
  "/images2/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.092Z",
    "size": 16688,
    "path": "../public/images2/blog/1.jpg"
  },
  "/images2/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.092Z",
    "size": 16688,
    "path": "../public/images2/blog/2.jpg"
  },
  "/images2/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.092Z",
    "size": 16688,
    "path": "../public/images2/blog/3.jpg"
  },
  "/images2/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.092Z",
    "size": 16688,
    "path": "../public/images2/blog/4.jpg"
  },
  "/images2/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.092Z",
    "size": 16688,
    "path": "../public/images2/blog/5.jpg"
  },
  "/images2/books/product-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"728f-oKTD/CsHt7aL1JSgmyMnNOMG56g\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 29327,
    "path": "../public/images2/books/product-bg.jpg"
  },
  "/images2/christmas/1.gif": {
    "type": "image/gif",
    "etag": "\"186832-HYNvTIWVPiGJ5GDAKZ0lo3g0dJc\"",
    "mtime": "2023-04-08T00:16:33.069Z",
    "size": 1599538,
    "path": "../public/images2/christmas/1.gif"
  },
  "/images2/christmas/bg1.png": {
    "type": "image/png",
    "etag": "\"a8070-MSR2hzY0e1qiS7HLpFsDsJMspzk\"",
    "mtime": "2023-04-08T00:16:33.065Z",
    "size": 688240,
    "path": "../public/images2/christmas/bg1.png"
  },
  "/images2/christmas/blog.png": {
    "type": "image/png",
    "etag": "\"e3ee-+4XgS6Z5dgsMGdlJ4j9vQu7wUpU\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 58350,
    "path": "../public/images2/christmas/blog.png"
  },
  "/images2/christmas/decor.png": {
    "type": "image/png",
    "etag": "\"1c23-2pPiu2rletSTzCqoVXnNkMHaF/A\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 7203,
    "path": "../public/images2/christmas/decor.png"
  },
  "/images2/christmas/dropdown.png": {
    "type": "image/png",
    "etag": "\"de-f42I0GrsXBPFC2U5UsBrAmAXjBw\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 222,
    "path": "../public/images2/christmas/dropdown.png"
  },
  "/images2/christmas/footer-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"754f-YXNn24m2wStg+se0n5JFNQyGb9g\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 30031,
    "path": "../public/images2/christmas/footer-bg.jpg"
  },
  "/images2/christmas/footer-decor.png": {
    "type": "image/png",
    "etag": "\"dbe8-l75MVLG6E6Cd7h4viDPFd1GrLno\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 56296,
    "path": "../public/images2/christmas/footer-decor.png"
  },
  "/images2/christmas/insta.png": {
    "type": "image/png",
    "etag": "\"e3ee-+4XgS6Z5dgsMGdlJ4j9vQu7wUpU\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 58350,
    "path": "../public/images2/christmas/insta.png"
  },
  "/images2/christmas/loading.gif": {
    "type": "image/gif",
    "etag": "\"1460-y8xPZQuVAdSAALDVOfeaPZJpzdM\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 5216,
    "path": "../public/images2/christmas/loading.gif"
  },
  "/images2/christmas/parall.png": {
    "type": "image/png",
    "etag": "\"a085-yU/bF9BFENOORziJp/yfr7dxuis\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 41093,
    "path": "../public/images2/christmas/parall.png"
  },
  "/images2/christmas/santa.png": {
    "type": "image/png",
    "etag": "\"18909-ClaEYDPcQiX596YFcjYpbYPp4uE\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 100617,
    "path": "../public/images2/christmas/santa.png"
  },
  "/images2/christmas/sub-banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"220e5-u8Hxh4U7qsonmnNHneZJ0MKaYdo\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 139493,
    "path": "../public/images2/christmas/sub-banner1.jpg"
  },
  "/images2/christmas/sub-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"21e4b-heNnT4F30byTZzjn36l5G5qsr7E\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 138827,
    "path": "../public/images2/christmas/sub-banner2.jpg"
  },
  "/images2/christmas/tree.png": {
    "type": "image/png",
    "etag": "\"2ad-qMfkBe6g+ZycCAxbzkxLS21wLrw\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 685,
    "path": "../public/images2/christmas/tree.png"
  },
  "/images2/collection/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 5000,
    "path": "../public/images2/collection/1.jpg"
  },
  "/images2/collection/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 5000,
    "path": "../public/images2/collection/11.jpg"
  },
  "/images2/collection/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 5000,
    "path": "../public/images2/collection/3.jpg"
  },
  "/images2/collection/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 5000,
    "path": "../public/images2/collection/5.jpg"
  },
  "/images2/collection/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 5000,
    "path": "../public/images2/collection/6.jpg"
  },
  "/images2/collection/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 5000,
    "path": "../public/images2/collection/7.jpg"
  },
  "/images2/collection/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 5000,
    "path": "../public/images2/collection/8.jpg"
  },
  "/images2/collection/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388-DCMPaIXwAGKex7oOY3D2gf1kJds\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 5000,
    "path": "../public/images2/collection/9.jpg"
  },
  "/images2/dashboard/boy-2.jpeg": {
    "type": "image/jpeg",
    "etag": "\"49e9-UJJTlVSPL1f9cyy9ZjzMILV0X/E\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 18921,
    "path": "../public/images2/dashboard/boy-2.jpeg"
  },
  "/images2/dashboard/boy-2.png": {
    "type": "image/png",
    "etag": "\"2ef-rFilWRhhd8xaMgohGprNcCfnyoM\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 751,
    "path": "../public/images2/dashboard/boy-2.png"
  },
  "/images2/dashboard/designer.jpg": {
    "type": "image/jpeg",
    "etag": "\"44c-Pc3jmJYgLFh2Eg9Wylx6jt1sRoI\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 1100,
    "path": "../public/images2/dashboard/designer.jpg"
  },
  "/images2/dashboard/favicon.png": {
    "type": "image/png",
    "etag": "\"17d-mHHToNcMVOQ0BDbAQDNQbmgwdp4\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 381,
    "path": "../public/images2/dashboard/favicon.png"
  },
  "/images2/dashboard/login-bg.png": {
    "type": "image/png",
    "etag": "\"32b25-0NPMpERVGHJyKYhHagNmfFQDQo8\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 207653,
    "path": "../public/images2/dashboard/login-bg.png"
  },
  "/images2/dashboard/man.jpeg": {
    "type": "image/jpeg",
    "etag": "\"49e9-UJJTlVSPL1f9cyy9ZjzMILV0X/E\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 18921,
    "path": "../public/images2/dashboard/man.jpeg"
  },
  "/images2/dashboard/man.png": {
    "type": "image/png",
    "etag": "\"2ef-rFilWRhhd8xaMgohGprNcCfnyoM\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 751,
    "path": "../public/images2/dashboard/man.png"
  },
  "/images2/dashboard/multikart-logo.png": {
    "type": "image/png",
    "etag": "\"aca-xAv05baNzCsQemMYRpFviPVM3z8\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 2762,
    "path": "../public/images2/dashboard/multikart-logo.png"
  },
  "/images2/dashboard/user.png": {
    "type": "image/png",
    "etag": "\"10f-JAH8xqsVJu2o3uJ+X9MRtlJFrns\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 271,
    "path": "../public/images2/dashboard/user.png"
  },
  "/images2/dashboard/user1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1849-4S4TLCX4eqdqQ7zXlnWb5HQHZnk\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 6217,
    "path": "../public/images2/dashboard/user1.jpg"
  },
  "/images2/dashboard/user2.jpg": {
    "type": "image/jpeg",
    "etag": "\"f16-bYC1c2K72tvJl0NOAGufTWf2Tn0\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 3862,
    "path": "../public/images2/dashboard/user2.jpg"
  },
  "/images2/dashboard/user3.jpg": {
    "type": "image/jpeg",
    "etag": "\"44fe-mZO8liOL+gHHEqsUd7KJv1vqc7A\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 17662,
    "path": "../public/images2/dashboard/user3.jpg"
  },
  "/images2/dashboard/user4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4952-Srs4pgUGNunQ4wpd5lKP5bV2eas\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 18770,
    "path": "../public/images2/dashboard/user4.jpg"
  },
  "/images2/dashboard/user5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1eaf-HM2RBHlkRviedhpHqNvBryIiUHc\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 7855,
    "path": "../public/images2/dashboard/user5.jpg"
  },
  "/images2/demo-img/1.png": {
    "type": "image/png",
    "etag": "\"3d41c-5xv9honh2DjYv/H97V5a+xQCrgk\"",
    "mtime": "2023-04-08T00:16:33.002Z",
    "size": 250908,
    "path": "../public/images2/demo-img/1.png"
  },
  "/images2/demo-img/10.png": {
    "type": "image/png",
    "etag": "\"2cd35-piFKQqYvGMVL+PN99GT2/0vefv4\"",
    "mtime": "2023-04-08T00:16:33.002Z",
    "size": 183605,
    "path": "../public/images2/demo-img/10.png"
  },
  "/images2/demo-img/11.png": {
    "type": "image/png",
    "etag": "\"27a51-YtwXwJSSI9Av9vhvMeVh/VfRiBE\"",
    "mtime": "2023-04-08T00:16:33.002Z",
    "size": 162385,
    "path": "../public/images2/demo-img/11.png"
  },
  "/images2/demo-img/12.png": {
    "type": "image/png",
    "etag": "\"3013d-2jfYdpDIJ4SyYy3tDqz6CNe6tI0\"",
    "mtime": "2023-04-08T00:16:33.002Z",
    "size": 196925,
    "path": "../public/images2/demo-img/12.png"
  },
  "/images2/demo-img/13.png": {
    "type": "image/png",
    "etag": "\"1193c-EVcxCvmiKl0KzEnMoCH7mYBlSs0\"",
    "mtime": "2023-04-08T00:16:33.002Z",
    "size": 71996,
    "path": "../public/images2/demo-img/13.png"
  },
  "/images2/demo-img/14.png": {
    "type": "image/png",
    "etag": "\"11b5b-YPKgEvxG3QkIm1HqEdkdbWHWz5s\"",
    "mtime": "2023-04-08T00:16:32.999Z",
    "size": 72539,
    "path": "../public/images2/demo-img/14.png"
  },
  "/images2/demo-img/15.png": {
    "type": "image/png",
    "etag": "\"f7ce-UwI+NqpWjODKPyC2tzhi5fqZeXk\"",
    "mtime": "2023-04-08T00:16:32.999Z",
    "size": 63438,
    "path": "../public/images2/demo-img/15.png"
  },
  "/images2/demo-img/16.png": {
    "type": "image/png",
    "etag": "\"146f7-yZ4z+BoB5voqB3FufHY5d5ZN0Ro\"",
    "mtime": "2023-04-08T00:16:32.999Z",
    "size": 83703,
    "path": "../public/images2/demo-img/16.png"
  },
  "/images2/demo-img/17.png": {
    "type": "image/png",
    "etag": "\"13822-4ibzsljlVeBUzipPohP16VlhdPU\"",
    "mtime": "2023-04-08T00:16:32.999Z",
    "size": 79906,
    "path": "../public/images2/demo-img/17.png"
  },
  "/images2/demo-img/18.png": {
    "type": "image/png",
    "etag": "\"9282-jX2TAOqlQzmh00SJV4wdIjo9kXE\"",
    "mtime": "2023-04-08T00:16:32.999Z",
    "size": 37506,
    "path": "../public/images2/demo-img/18.png"
  },
  "/images2/demo-img/19.png": {
    "type": "image/png",
    "etag": "\"25967-ZNWDIun3zkx+xwb4UMfX7DKt5Zs\"",
    "mtime": "2023-04-08T00:16:32.999Z",
    "size": 153959,
    "path": "../public/images2/demo-img/19.png"
  },
  "/images2/demo-img/2.png": {
    "type": "image/png",
    "etag": "\"3624d-pcAkfcq7pE7UVBehoqB+xgbCASM\"",
    "mtime": "2023-04-08T00:16:32.999Z",
    "size": 221773,
    "path": "../public/images2/demo-img/2.png"
  },
  "/images2/demo-img/20.png": {
    "type": "image/png",
    "etag": "\"26f2b-UggiCSOW7wQuUrUm4XU5oAGf/ek\"",
    "mtime": "2023-04-08T00:16:32.995Z",
    "size": 159531,
    "path": "../public/images2/demo-img/20.png"
  },
  "/images2/demo-img/21.png": {
    "type": "image/png",
    "etag": "\"25691-AkEFIVie+SVCbCXwvTsx9Jrw7vs\"",
    "mtime": "2023-04-08T00:16:32.995Z",
    "size": 153233,
    "path": "../public/images2/demo-img/21.png"
  },
  "/images2/demo-img/3.png": {
    "type": "image/png",
    "etag": "\"2875b-p9+08YeS4BAKDfCAd52aOBuh2Zg\"",
    "mtime": "2023-04-08T00:16:32.995Z",
    "size": 165723,
    "path": "../public/images2/demo-img/3.png"
  },
  "/images2/demo-img/4.png": {
    "type": "image/png",
    "etag": "\"2a288-ngmn4r4Aj4bIOIypyWZlW1bVQGE\"",
    "mtime": "2023-04-08T00:16:32.992Z",
    "size": 172680,
    "path": "../public/images2/demo-img/4.png"
  },
  "/images2/demo-img/5.png": {
    "type": "image/png",
    "etag": "\"3f186-CO11zGSpsgETp1VjrglPNBKEXs8\"",
    "mtime": "2023-04-08T00:16:32.992Z",
    "size": 258438,
    "path": "../public/images2/demo-img/5.png"
  },
  "/images2/demo-img/6.png": {
    "type": "image/png",
    "etag": "\"2ed35-DXCJ6pOJ3GZbJymVYXlxnZtAh20\"",
    "mtime": "2023-04-08T00:16:32.992Z",
    "size": 191797,
    "path": "../public/images2/demo-img/6.png"
  },
  "/images2/demo-img/7.png": {
    "type": "image/png",
    "etag": "\"2a781-DdiHujwm0PSQbtFph5YXcbKwSs0\"",
    "mtime": "2023-04-08T00:16:32.992Z",
    "size": 173953,
    "path": "../public/images2/demo-img/7.png"
  },
  "/images2/demo-img/8.png": {
    "type": "image/png",
    "etag": "\"38d57-q3s4h/gQ642DNwn0vMeDSWWOqbY\"",
    "mtime": "2023-04-08T00:16:32.992Z",
    "size": 232791,
    "path": "../public/images2/demo-img/8.png"
  },
  "/images2/demo-img/9.png": {
    "type": "image/png",
    "etag": "\"2ba25-Kd0NVHi/Kfdc67oDepcgNUWmymk\"",
    "mtime": "2023-04-08T00:16:32.989Z",
    "size": 178725,
    "path": "../public/images2/demo-img/9.png"
  },
  "/images2/electronics/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3d71-zB/iI5GbyKixG3uz3L3Bt7IITQw\"",
    "mtime": "2023-04-08T00:16:32.989Z",
    "size": 15729,
    "path": "../public/images2/electronics/1.jpg"
  },
  "/images2/electronics/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"14b1-Yo6iNd0R0uxD4dK/yNsmroi/Ty4\"",
    "mtime": "2023-04-08T00:16:32.989Z",
    "size": 5297,
    "path": "../public/images2/electronics/2.jpg"
  },
  "/images2/electronics/2.png": {
    "type": "image/png",
    "etag": "\"73b1c-0RIuw/5P0yMmuYkjWJex5J7b2IA\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 473884,
    "path": "../public/images2/electronics/2.png"
  },
  "/images2/electronics/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"14b1-Yo6iNd0R0uxD4dK/yNsmroi/Ty4\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 5297,
    "path": "../public/images2/electronics/4.jpg"
  },
  "/images2/electronics/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 7688,
    "path": "../public/images2/electronics/5.jpg"
  },
  "/images2/electronics/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 7688,
    "path": "../public/images2/electronics/6.jpg"
  },
  "/images2/electronics/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 7688,
    "path": "../public/images2/electronics/7.jpg"
  },
  "/images2/electronics/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"80be-r3mMnwdT+cOUqPwkRT+PPt14iTw\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 32958,
    "path": "../public/images2/electronics/8.jpg"
  },
  "/images2/electronics/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"df82-Mxm4tyccsKBkdf93AllboI4htM8\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 57218,
    "path": "../public/images2/electronics/bg.jpg"
  },
  "/images2/electronics/sub1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1927-asYiX9X5oIwiBOgIhuzM+mhcuKo\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 6439,
    "path": "../public/images2/electronics/sub1.jpg"
  },
  "/images2/electronics/sub2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1927-asYiX9X5oIwiBOgIhuzM+mhcuKo\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 6439,
    "path": "../public/images2/electronics/sub2.jpg"
  },
  "/images2/electronics/sub3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1927-asYiX9X5oIwiBOgIhuzM+mhcuKo\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 6439,
    "path": "../public/images2/electronics/sub3.jpg"
  },
  "/images2/element/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"14f0-xFKwzlONgCXsscjG4SkUQrILsS0\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 5360,
    "path": "../public/images2/element/1.jpg"
  },
  "/images2/element/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"2531-i7CBlT7I6CkTa4QeSMpBKAzfAz4\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 9521,
    "path": "../public/images2/element/10.jpg"
  },
  "/images2/element/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1718-YICa/LKtl1OSrZno1XiSPjlJ6SA\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 5912,
    "path": "../public/images2/element/11.jpg"
  },
  "/images2/element/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"264c-RupZJhjWPDL7rvXLfvdwUSv4Ywk\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 9804,
    "path": "../public/images2/element/12.jpg"
  },
  "/images2/element/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"245d-16nZ3YCD+XnzGotYpz45TqsnyGM\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 9309,
    "path": "../public/images2/element/13.jpg"
  },
  "/images2/element/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"22fe-W9ZNG6PDEWf6wyO0gG3aqqEycdY\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 8958,
    "path": "../public/images2/element/14.jpg"
  },
  "/images2/element/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d44-E6t2SI4Wk2Eyy90zvvgqEvqeS9I\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 11588,
    "path": "../public/images2/element/15.jpg"
  },
  "/images2/element/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"197a-ikmpQw1lZW2B7XFop4pv2HuCOGU\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 6522,
    "path": "../public/images2/element/2.jpg"
  },
  "/images2/element/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1449-OV0QNKL1q/XyIDIM1EYKpFQ0KlA\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 5193,
    "path": "../public/images2/element/3.jpg"
  },
  "/images2/element/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cfe-DpmMmFFjAwwrKtTP7SdYKeIL2cA\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 7422,
    "path": "../public/images2/element/4.jpg"
  },
  "/images2/element/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2454-FXEdUM+8pnn0YCMAJ40CscWpCTc\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 9300,
    "path": "../public/images2/element/5.jpg"
  },
  "/images2/element/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b71-XSIhbBNYg9xNIL5kuDnIe3n70gI\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 7025,
    "path": "../public/images2/element/6.jpg"
  },
  "/images2/element/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2342-3ZagU68/Oi9vdZLIqHf4bId16Z8\"",
    "mtime": "2023-04-08T00:16:32.945Z",
    "size": 9026,
    "path": "../public/images2/element/7.jpg"
  },
  "/images2/element/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"db7-a0VwRXfYAU98QvlUpJR8xml2ru4\"",
    "mtime": "2023-04-08T00:16:32.942Z",
    "size": 3511,
    "path": "../public/images2/element/8.jpg"
  },
  "/images2/element/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"177a-3/IboAoXdS4rGJUCBYBLjKcxgkI\"",
    "mtime": "2023-04-08T00:16:32.942Z",
    "size": 6010,
    "path": "../public/images2/element/9.jpg"
  },
  "/images2/email-temp/---.jpg": {
    "type": "image/jpeg",
    "etag": "\"894-df6t7PWqG7+L/Ghr2mtyJZSXhBI\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 2196,
    "path": "../public/images2/email-temp/---.jpg"
  },
  "/images2/email-temp/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"188a-vrhiLJDYVXWVkOy0Vaipvi4NrVw\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 6282,
    "path": "../public/images2/email-temp/1.jpg"
  },
  "/images2/email-temp/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"894-df6t7PWqG7+L/Ghr2mtyJZSXhBI\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 2196,
    "path": "../public/images2/email-temp/10.jpg"
  },
  "/images2/email-temp/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"894-df6t7PWqG7+L/Ghr2mtyJZSXhBI\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 2196,
    "path": "../public/images2/email-temp/11.jpg"
  },
  "/images2/email-temp/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"894-df6t7PWqG7+L/Ghr2mtyJZSXhBI\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 2196,
    "path": "../public/images2/email-temp/12.jpg"
  },
  "/images2/email-temp/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1913-V2cDJszhc1rGSWuHe+Ntlr06eZs\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 6419,
    "path": "../public/images2/email-temp/13.jpg"
  },
  "/images2/email-temp/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1913-qh6InDa2VzlQLwV6PMU8OZFi1JE\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 6419,
    "path": "../public/images2/email-temp/14.jpg"
  },
  "/images2/email-temp/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"42e8-OQltyG5JRjiUVavXSXfEwJ9oqXI\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 17128,
    "path": "../public/images2/email-temp/15.jpg"
  },
  "/images2/email-temp/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ea9-uzjW/YG8osyAJ4SYMeuji6PODaE\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 16041,
    "path": "../public/images2/email-temp/16.jpg"
  },
  "/images2/email-temp/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"4699-mjdkOVq7WDvEl+clMMAxigprJak\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 18073,
    "path": "../public/images2/email-temp/17.jpg"
  },
  "/images2/email-temp/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"3dfc-FadE5dCs0NRkj9KMb8ds6gea3iM\"",
    "mtime": "2023-04-08T00:16:32.925Z",
    "size": 15868,
    "path": "../public/images2/email-temp/18.jpg"
  },
  "/images2/email-temp/3.png": {
    "type": "image/png",
    "etag": "\"21b-2/GM18McTpl2H05Ag286+cZL1lM\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 539,
    "path": "../public/images2/email-temp/3.png"
  },
  "/images2/email-temp/4.png": {
    "type": "image/png",
    "etag": "\"3da-6CS3Zu9/Ke6hSWOzRNqeWphMgI8\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 986,
    "path": "../public/images2/email-temp/4.png"
  },
  "/images2/email-temp/5.png": {
    "type": "image/png",
    "etag": "\"3da-6CS3Zu9/Ke6hSWOzRNqeWphMgI8\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 986,
    "path": "../public/images2/email-temp/5.png"
  },
  "/images2/email-temp/6.png": {
    "type": "image/png",
    "etag": "\"3da-6CS3Zu9/Ke6hSWOzRNqeWphMgI8\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 986,
    "path": "../public/images2/email-temp/6.png"
  },
  "/images2/email-temp/banner-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e6a-G9gWrRpXJITTA3t1Lla6+3iTLvs\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 7786,
    "path": "../public/images2/email-temp/banner-2.jpg"
  },
  "/images2/email-temp/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e6a-G9gWrRpXJITTA3t1Lla6+3iTLvs\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 7786,
    "path": "../public/images2/email-temp/banner.jpg"
  },
  "/images2/email-temp/cosmetic.jpg": {
    "type": "image/jpeg",
    "etag": "\"3288-4KgSrodm87GYmZeEa18h+tZU9/w\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 12936,
    "path": "../public/images2/email-temp/cosmetic.jpg"
  },
  "/images2/email-temp/delivery-2.png": {
    "type": "image/png",
    "etag": "\"9691-wpwFTXCFf3GbHLxxULDCQ/YCS6E\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 38545,
    "path": "../public/images2/email-temp/delivery-2.png"
  },
  "/images2/email-temp/delivery.png": {
    "type": "image/png",
    "etag": "\"6d79-P0LuIgPsPo9y5c6dhM+atVwzw5g\"",
    "mtime": "2023-04-08T00:16:32.922Z",
    "size": 28025,
    "path": "../public/images2/email-temp/delivery.png"
  },
  "/images2/email-temp/dfsb.jpg": {
    "type": "image/jpeg",
    "etag": "\"e54-TyVPgsE5SrbJMp30C+nY7LRgJK8\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 3668,
    "path": "../public/images2/email-temp/dfsb.jpg"
  },
  "/images2/email-temp/e-2-slider.jpg": {
    "type": "image/jpeg",
    "etag": "\"1197-hQa9ldzbXLWCeA/IbXKCDThhOQY\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 4503,
    "path": "../public/images2/email-temp/e-2-slider.jpg"
  },
  "/images2/email-temp/facebook.png": {
    "type": "image/png",
    "etag": "\"3b2-IBSfwxW1cu726MfUpSh2AYHYtOg\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 946,
    "path": "../public/images2/email-temp/facebook.png"
  },
  "/images2/email-temp/fs.jpg": {
    "type": "image/jpeg",
    "etag": "\"e54-XXcOjyA2sSi2x0Qt+cD3MPEeDi8\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 3668,
    "path": "../public/images2/email-temp/fs.jpg"
  },
  "/images2/email-temp/gplus.png": {
    "type": "image/png",
    "etag": "\"3ec-08gWzMCIYbsl188THxmDZeFj4Pg\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 1004,
    "path": "../public/images2/email-temp/gplus.png"
  },
  "/images2/email-temp/linkedin.png": {
    "type": "image/png",
    "etag": "\"3f6-hiwxe2h5LcoQou3jua0RD40aPS0\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 1014,
    "path": "../public/images2/email-temp/linkedin.png"
  },
  "/images2/email-temp/logo.png": {
    "type": "image/png",
    "etag": "\"8c9-T1nHqdhobcZ6zquEiltkxSF48Sg\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 2249,
    "path": "../public/images2/email-temp/logo.png"
  },
  "/images2/email-temp/order-success.png": {
    "type": "image/png",
    "etag": "\"107d-l4qPgbM2czEOFQfzgmFy0ZlvWgw\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 4221,
    "path": "../public/images2/email-temp/order-success.png"
  },
  "/images2/email-temp/pinterest.png": {
    "type": "image/png",
    "etag": "\"427-qEUxqwUaTomiVJ4hsAtQ/KLn7L0\"",
    "mtime": "2023-04-08T00:16:32.919Z",
    "size": 1063,
    "path": "../public/images2/email-temp/pinterest.png"
  },
  "/images2/email-temp/pro-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"30d3-VRZmBEML1kLY0G7VQ6L7U7zg9z8\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 12499,
    "path": "../public/images2/email-temp/pro-1.jpg"
  },
  "/images2/email-temp/pro-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"30d3-VRZmBEML1kLY0G7VQ6L7U7zg9z8\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 12499,
    "path": "../public/images2/email-temp/pro-2.jpg"
  },
  "/images2/email-temp/pro-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"30d3-VRZmBEML1kLY0G7VQ6L7U7zg9z8\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 12499,
    "path": "../public/images2/email-temp/pro-3.jpg"
  },
  "/images2/email-temp/space.jpg": {
    "type": "image/jpeg",
    "etag": "\"11b-sELuhouPr5li3fYZtjSG1oIVV0E\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 283,
    "path": "../public/images2/email-temp/space.jpg"
  },
  "/images2/email-temp/success.png": {
    "type": "image/png",
    "etag": "\"5fc-kAUadDN7CwiH4ljsjXdNPYEQ5cI\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 1532,
    "path": "../public/images2/email-temp/success.png"
  },
  "/images2/email-temp/twitter.png": {
    "type": "image/png",
    "etag": "\"3f1-xDLiwkZwHYsJM4NfVYnle/XWQ8Y\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 1009,
    "path": "../public/images2/email-temp/twitter.png"
  },
  "/images2/email-temp/wr-code.png": {
    "type": "image/png",
    "etag": "\"193-tIvsajtJHl6mFPo0lg3zY1QRRUY\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 403,
    "path": "../public/images2/email-temp/wr-code.png"
  },
  "/images2/email-temp/youtube.png": {
    "type": "image/png",
    "etag": "\"3e8-XKNJ8gNSc9wsj4qxeoCqKjGH2H8\"",
    "mtime": "2023-04-08T00:16:32.915Z",
    "size": 1000,
    "path": "../public/images2/email-temp/youtube.png"
  },
  "/images2/fashion/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 7688,
    "path": "../public/images2/fashion/1.jpg"
  },
  "/images2/fashion/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 7688,
    "path": "../public/images2/fashion/2.jpg"
  },
  "/images2/fashion/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 7688,
    "path": "../public/images2/fashion/3.jpg"
  },
  "/images2/fashion/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 7688,
    "path": "../public/images2/fashion/4.jpg"
  },
  "/images2/fashion/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 7688,
    "path": "../public/images2/fashion/5.jpg"
  },
  "/images2/fashion/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 7688,
    "path": "../public/images2/fashion/6.jpg"
  },
  "/images2/fashion/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"42d4-6ajmovmlAPVD+pkJ1albgSZkpu0\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 17108,
    "path": "../public/images2/fashion/banner.jpg"
  },
  "/images2/fashion/bottom-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"4a71-sGqKOXhIutPXYYiUBIHiTyf+Fsc\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 19057,
    "path": "../public/images2/fashion/bottom-banner.jpg"
  },
  "/images2/favicon/1.png": {
    "type": "image/png",
    "etag": "\"4e1-w+FRYRZroq30om1nvk4hGcHkeGU\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 1249,
    "path": "../public/images2/favicon/1.png"
  },
  "/images2/favicon/10.png": {
    "type": "image/png",
    "etag": "\"1c7-xuo4mvftoH9Xd9ancEI57OOnE2k\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 455,
    "path": "../public/images2/favicon/10.png"
  },
  "/images2/favicon/11.png": {
    "type": "image/png",
    "etag": "\"1c6-tdTb1aDtbp8a6em60iFOT7ouEfU\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 454,
    "path": "../public/images2/favicon/11.png"
  },
  "/images2/favicon/12.png": {
    "type": "image/png",
    "etag": "\"4d8-JsCWYMqucen7WMpoYM9hdvvoyY8\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 1240,
    "path": "../public/images2/favicon/12.png"
  },
  "/images2/favicon/13.png": {
    "type": "image/png",
    "etag": "\"4e5-wwdw909uT9QsipTI+A7A0rRzFdk\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 1253,
    "path": "../public/images2/favicon/13.png"
  },
  "/images2/favicon/14.png": {
    "type": "image/png",
    "etag": "\"4d8-Zu4E8AxMv4l8pVvyG8YNWZH3T8I\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 1240,
    "path": "../public/images2/favicon/14.png"
  },
  "/images2/favicon/15.png": {
    "type": "image/png",
    "etag": "\"4d8-9s0hIQ1Jjfup5IG8WQ6/PjsoHic\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 1240,
    "path": "../public/images2/favicon/15.png"
  },
  "/images2/favicon/16.png": {
    "type": "image/png",
    "etag": "\"4d8-/5B81ufL047x8wc3Jk+O6ZbfMrk\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 1240,
    "path": "../public/images2/favicon/16.png"
  },
  "/images2/favicon/17.png": {
    "type": "image/png",
    "etag": "\"4d8-vs0BHQUlCAkKBPn5eFjhlY0Fig4\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 1240,
    "path": "../public/images2/favicon/17.png"
  },
  "/images2/favicon/18.png": {
    "type": "image/png",
    "etag": "\"491-xbfP2eeom1dcCTDf/nfHyFQXJqY\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 1169,
    "path": "../public/images2/favicon/18.png"
  },
  "/images2/favicon/19.png": {
    "type": "image/png",
    "etag": "\"1a5-bwlCU5F++P9dbcL/1oWp/sGU7Ws\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 421,
    "path": "../public/images2/favicon/19.png"
  },
  "/images2/favicon/2.png": {
    "type": "image/png",
    "etag": "\"4d3-VpZCloCxV1zGpGCIwjKDmj0g7Uc\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 1235,
    "path": "../public/images2/favicon/2.png"
  },
  "/images2/favicon/20.png": {
    "type": "image/png",
    "etag": "\"1a5-+kiwwSjMWdKwpgXkoZ5YYt09LD8\"",
    "mtime": "2023-04-08T00:16:32.825Z",
    "size": 421,
    "path": "../public/images2/favicon/20.png"
  },
  "/images2/favicon/21.png": {
    "type": "image/png",
    "etag": "\"1a5-nF/WYruyMvN8E6nxIa7fjsmvZmY\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 421,
    "path": "../public/images2/favicon/21.png"
  },
  "/images2/favicon/22.png": {
    "type": "image/png",
    "etag": "\"1a5-Y+HaZRTB+CVSI8FvmoekkbSCu7w\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 421,
    "path": "../public/images2/favicon/22.png"
  },
  "/images2/favicon/23.png": {
    "type": "image/png",
    "etag": "\"1a5-PiwiHa8sO5wfX4yIeH0yZPANyEU\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 421,
    "path": "../public/images2/favicon/23.png"
  },
  "/images2/favicon/24.png": {
    "type": "image/png",
    "etag": "\"1a5-MRfQgIQ2Mz4xjFrohYptz4X2SPc\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 421,
    "path": "../public/images2/favicon/24.png"
  },
  "/images2/favicon/25.png": {
    "type": "image/png",
    "etag": "\"1a2-N70sEHNRj1032jy/pIbyfyXKiCo\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 418,
    "path": "../public/images2/favicon/25.png"
  },
  "/images2/favicon/3.png": {
    "type": "image/png",
    "etag": "\"4d3-1Zsyj4qMBu5LlUvlWspdQ25253M\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 1235,
    "path": "../public/images2/favicon/3.png"
  },
  "/images2/favicon/4.png": {
    "type": "image/png",
    "etag": "\"4d3-xoZeMMk7r7DoiKpfI9c/Yl4aAR8\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 1235,
    "path": "../public/images2/favicon/4.png"
  },
  "/images2/favicon/5.png": {
    "type": "image/png",
    "etag": "\"1c8-Z75x4sL4j6VYajdNfkuqy/3Kc8Y\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 456,
    "path": "../public/images2/favicon/5.png"
  },
  "/images2/favicon/6.png": {
    "type": "image/png",
    "etag": "\"1c6-bL6eGLDTilRvgz8u/0GQ6MBRpao\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 454,
    "path": "../public/images2/favicon/6.png"
  },
  "/images2/favicon/7.png": {
    "type": "image/png",
    "etag": "\"1c2-xnSlz7IDl4I8wMnhYg465JYqU7w\"",
    "mtime": "2023-04-08T00:16:32.822Z",
    "size": 450,
    "path": "../public/images2/favicon/7.png"
  },
  "/images2/favicon/8.png": {
    "type": "image/png",
    "etag": "\"4d8-wf1YFh4tbItAK2MrNxhZ7+i1gx4\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 1240,
    "path": "../public/images2/favicon/8.png"
  },
  "/images2/favicon/9.png": {
    "type": "image/png",
    "etag": "\"1c6-KkMpavxq9esnp+SyxEPNLGQd6lc\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 454,
    "path": "../public/images2/favicon/9.png"
  },
  "/images2/feature/blog(right-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"1469-qjof4voJOKG9huwYAQHZco/391A\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 5225,
    "path": "../public/images2/feature/blog(right-sidebar).jpg"
  },
  "/images2/feature/blog-detail.jpg": {
    "type": "image/jpeg",
    "etag": "\"e5f-qwsnWR5gzWGZ9b2YbPK/KVVZtDU\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 3679,
    "path": "../public/images2/feature/blog-detail.jpg"
  },
  "/images2/feature/blog-page.jpg": {
    "type": "image/jpeg",
    "etag": "\"151e-/WdhmX2+zq7oxRRBNFgxKRgNHAA\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 5406,
    "path": "../public/images2/feature/blog-page.jpg"
  },
  "/images2/feature/category-page(infinite-scroll).jpg": {
    "type": "image/jpeg",
    "etag": "\"157c-AcL9etFYZFp4Mys74gKcm5ekZ6g\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 5500,
    "path": "../public/images2/feature/category-page(infinite-scroll).jpg"
  },
  "/images2/feature/category-page(no-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"111a-5hIA3iLml8ssJAptMpfx8r1hHm0\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 4378,
    "path": "../public/images2/feature/category-page(no-sidebar).jpg"
  },
  "/images2/feature/category-page(right).jpg": {
    "type": "image/jpeg",
    "etag": "\"15a8-9ELd41wFQ9MDBuv8kSiHI1L+5rI\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 5544,
    "path": "../public/images2/feature/category-page(right).jpg"
  },
  "/images2/feature/category-page(sidebar-popup).jpg": {
    "type": "image/jpeg",
    "etag": "\"40f3-4AMuj9D9RAbkJax/kgSBvUaBVrw\"",
    "mtime": "2023-04-08T00:16:32.819Z",
    "size": 16627,
    "path": "../public/images2/feature/category-page(sidebar-popup).jpg"
  },
  "/images2/feature/category-page.jpg": {
    "type": "image/jpeg",
    "etag": "\"158c-A/mPsMN/nDkq3CSkRaBTRPdD2dU\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 5516,
    "path": "../public/images2/feature/category-page.jpg"
  },
  "/images2/feature/product-page(3-col-left).jpg": {
    "type": "image/jpeg",
    "etag": "\"12d2-JrBOwdP0P8oQNORqgjE01FAU0y4\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 4818,
    "path": "../public/images2/feature/product-page(3-col-left).jpg"
  },
  "/images2/feature/product-page(3-col-right).jpg": {
    "type": "image/jpeg",
    "etag": "\"1292-QHL+2Xxtm/o+4+dFQOSlpHdyDFk\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 4754,
    "path": "../public/images2/feature/product-page(3-col-right).jpg"
  },
  "/images2/feature/product-page(3-column).jpg": {
    "type": "image/jpeg",
    "etag": "\"1258-sKGiw6LvmtwvWHzTBkt5Voehx4s\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 4696,
    "path": "../public/images2/feature/product-page(3-column).jpg"
  },
  "/images2/feature/product-page(accordian).jpg": {
    "type": "image/jpeg",
    "etag": "\"109c-vTbWrAcLywd3NOIIqOnG1dtl9DY\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 4252,
    "path": "../public/images2/feature/product-page(accordian).jpg"
  },
  "/images2/feature/product-page(full-page).jpg": {
    "type": "image/jpeg",
    "etag": "\"1393-sloMTJkXiaezMUeY8wpC31+RhCE\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 5011,
    "path": "../public/images2/feature/product-page(full-page).jpg"
  },
  "/images2/feature/product-page(left-image).jpg": {
    "type": "image/jpeg",
    "etag": "\"f98-urPX94/pc8H4Y17whCXYQEGex1w\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 3992,
    "path": "../public/images2/feature/product-page(left-image).jpg"
  },
  "/images2/feature/product-page(left-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"1048-xZnpU6Fpw28vpPyXo481Np9wsJM\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 4168,
    "path": "../public/images2/feature/product-page(left-sidebar).jpg"
  },
  "/images2/feature/product-page(no-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"fb2-+JCVhzKuo57S5qRiorrFoM8S060\"",
    "mtime": "2023-04-08T00:16:32.815Z",
    "size": 4018,
    "path": "../public/images2/feature/product-page(no-sidebar).jpg"
  },
  "/images2/feature/product-page(right-image).jpg": {
    "type": "image/jpeg",
    "etag": "\"f20-YiYy67wfFGStNCeskpHnQ6OE82Q\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 3872,
    "path": "../public/images2/feature/product-page(right-image).jpg"
  },
  "/images2/feature/product-page(right-sidebar).jpg": {
    "type": "image/jpeg",
    "etag": "\"10d2-ma0ltq1bYddpiDRBdfIVrzY2cNU\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 4306,
    "path": "../public/images2/feature/product-page(right-sidebar).jpg"
  },
  "/images2/feature/product-page(sticky).jpg": {
    "type": "image/jpeg",
    "etag": "\"ce3-euKdGj/Z3UDONEkoNfoJk9KxBcY\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 3299,
    "path": "../public/images2/feature/product-page(sticky).jpg"
  },
  "/images2/feature/product-page(vertical-tab).jpg": {
    "type": "image/jpeg",
    "etag": "\"1254-oHpRXCeEn0FhtoPwicMYqRaiLQg\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 4692,
    "path": "../public/images2/feature/product-page(vertical-tab).jpg"
  },
  "/images2/flower/banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3849-yrKSruMYKGjYeAbEyQHeBCbf3Lw\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 14409,
    "path": "../public/images2/flower/banner1.jpg"
  },
  "/images2/flower/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"b02f-/sFnWHnNZpibA7A2m0HPMEv3VDc\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 45103,
    "path": "../public/images2/flower/bg.jpg"
  },
  "/images2/flower/flower-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 55509,
    "path": "../public/images2/flower/flower-bg.jpg"
  },
  "/images2/flower/sub-banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3849-yrKSruMYKGjYeAbEyQHeBCbf3Lw\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 14409,
    "path": "../public/images2/flower/sub-banner1.jpg"
  },
  "/images2/flower/sub-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"19b4-sLqA//WSFC/0lpgViLopGpopUZ4\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 6580,
    "path": "../public/images2/flower/sub-banner2.jpg"
  },
  "/images2/fragrance/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7dd0-fw23KhQ+cNFqAzJ+f5QXTdLtc0M\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 32208,
    "path": "../public/images2/fragrance/1.jpg"
  },
  "/images2/fragrance/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d4a-PnPCf2Ii4I1VTb3l10xeEYi973o\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 11594,
    "path": "../public/images2/fragrance/banner.jpg"
  },
  "/images2/fragrance/parallax-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"720b-tIHiMjYh0asEZ/K6/joCQz/eUnE\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 29195,
    "path": "../public/images2/fragrance/parallax-banner.jpg"
  },
  "/images2/furniture/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 1863,
    "path": "../public/images2/furniture/1.jpg"
  },
  "/images2/furniture/1.png": {
    "type": "image/png",
    "etag": "\"5302-twDFvDSVsxZF5XPw6l6ETI5wfXg\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 21250,
    "path": "../public/images2/furniture/1.png"
  },
  "/images2/furniture/10.png": {
    "type": "image/png",
    "etag": "\"a1f4-Bdd4JV0FW8Tuq/vmIC8UFqdWyH0\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 41460,
    "path": "../public/images2/furniture/10.png"
  },
  "/images2/furniture/11.png": {
    "type": "image/png",
    "etag": "\"9203-hdEp8xTAF/YtqIqh9m686lJiRW0\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 37379,
    "path": "../public/images2/furniture/11.png"
  },
  "/images2/furniture/12.png": {
    "type": "image/png",
    "etag": "\"6fcd-P+ph3BGT8wRJ0bSJMoAexQIUpqc\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 28621,
    "path": "../public/images2/furniture/12.png"
  },
  "/images2/furniture/13.png": {
    "type": "image/png",
    "etag": "\"798f-v6CwTrd1Ahh2iH7+lsKNk7DAOIg\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 31119,
    "path": "../public/images2/furniture/13.png"
  },
  "/images2/furniture/14.png": {
    "type": "image/png",
    "etag": "\"8ce8-GRznefHfdIsrZ+HUdATl/eKXmbc\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 36072,
    "path": "../public/images2/furniture/14.png"
  },
  "/images2/furniture/15.png": {
    "type": "image/png",
    "etag": "\"69f2-YHiVuifLKOvguBeacl0eSWSbMzM\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 27122,
    "path": "../public/images2/furniture/15.png"
  },
  "/images2/furniture/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 1863,
    "path": "../public/images2/furniture/2.jpg"
  },
  "/images2/furniture/2.png": {
    "type": "image/png",
    "etag": "\"3a07-DLdQQaaAEkIu+m2UWfzWx61GPlM\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 14855,
    "path": "../public/images2/furniture/2.png"
  },
  "/images2/furniture/2banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 7688,
    "path": "../public/images2/furniture/2banner1.jpg"
  },
  "/images2/furniture/2banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.792Z",
    "size": 7688,
    "path": "../public/images2/furniture/2banner2.jpg"
  },
  "/images2/furniture/2banner3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e08-+kTf3BNT7hsPdaKM8aOtjWKSEGQ\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 7688,
    "path": "../public/images2/furniture/2banner3.jpg"
  },
  "/images2/furniture/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"afd-nKCT10b9FZoE/f4tGGX1NddzkmM\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 2813,
    "path": "../public/images2/furniture/3.jpg"
  },
  "/images2/furniture/3.png": {
    "type": "image/png",
    "etag": "\"4672-s+vsAZsDzYrksr3b9h6/856aNSQ\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 18034,
    "path": "../public/images2/furniture/3.png"
  },
  "/images2/furniture/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"146a-X+pJlNG2tUzGPGr/PVzHyaZMfHo\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 5226,
    "path": "../public/images2/furniture/4.jpg"
  },
  "/images2/furniture/4.png": {
    "type": "image/png",
    "etag": "\"39ab-jzQckG3lGQNL1IklIXXVMQv+LoI\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 14763,
    "path": "../public/images2/furniture/4.png"
  },
  "/images2/furniture/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"146a-X+pJlNG2tUzGPGr/PVzHyaZMfHo\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 5226,
    "path": "../public/images2/furniture/5.jpg"
  },
  "/images2/furniture/5.png": {
    "type": "image/png",
    "etag": "\"31f3-O/mIiKkmeYh1XCQnSpA4vwRWCFU\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 12787,
    "path": "../public/images2/furniture/5.png"
  },
  "/images2/furniture/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 1863,
    "path": "../public/images2/furniture/6.jpg"
  },
  "/images2/furniture/6.png": {
    "type": "image/png",
    "etag": "\"32f4-UCFIzSM3KAnAXfYSslmrxFc73iU\"",
    "mtime": "2023-04-08T00:16:32.789Z",
    "size": 13044,
    "path": "../public/images2/furniture/6.png"
  },
  "/images2/furniture/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 1863,
    "path": "../public/images2/furniture/7.jpg"
  },
  "/images2/furniture/7.png": {
    "type": "image/png",
    "etag": "\"a0db-Ipjf5dyJGm6XCYnfgWaQz9HjfEE\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 41179,
    "path": "../public/images2/furniture/7.png"
  },
  "/images2/furniture/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 1863,
    "path": "../public/images2/furniture/8.jpg"
  },
  "/images2/furniture/8.png": {
    "type": "image/png",
    "etag": "\"84ba-7iMo3ba+1ABRj8p6bo/uHpYHkOI\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 33978,
    "path": "../public/images2/furniture/8.png"
  },
  "/images2/furniture/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"747-g7IC5lNKb1TI+WL6gw0T9VGQLwk\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 1863,
    "path": "../public/images2/furniture/9.jpg"
  },
  "/images2/furniture/9.png": {
    "type": "image/png",
    "etag": "\"c525-lSv6zpUJz9QPq8CQhyMdfYFfc8I\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 50469,
    "path": "../public/images2/furniture/9.png"
  },
  "/images2/furniture/banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"9028-cYLqFLsWgCdg3DdOy3kwRPpdxA4\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 36904,
    "path": "../public/images2/furniture/banner1.jpg"
  },
  "/images2/furniture/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"9028-cYLqFLsWgCdg3DdOy3kwRPpdxA4\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 36904,
    "path": "../public/images2/furniture/banner2.jpg"
  },
  "/images2/furniture/banner4.jpg": {
    "type": "image/jpeg",
    "etag": "\"9028-cYLqFLsWgCdg3DdOy3kwRPpdxA4\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 36904,
    "path": "../public/images2/furniture/banner4.jpg"
  },
  "/images2/furniture/blog1.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 55509,
    "path": "../public/images2/furniture/blog1.jpg"
  },
  "/images2/furniture/blog2.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 55509,
    "path": "../public/images2/furniture/blog2.jpg"
  },
  "/images2/furniture/blog3.jpg": {
    "type": "image/jpeg",
    "etag": "\"d8d5-eseFK7f4aNG7nodovtYTgEAVvLw\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 55509,
    "path": "../public/images2/furniture/blog3.jpg"
  },
  "/images2/furniture/selk.jpg": {
    "type": "image/jpeg",
    "etag": "\"d696-vO60XgXHXv51I+8JuU1EURX1SrI\"",
    "mtime": "2023-04-08T00:16:32.762Z",
    "size": 54934,
    "path": "../public/images2/furniture/selk.jpg"
  },
  "/images2/game/assassins_creed_origins_2017_8k-wallpaper-1920x1080.jpg": {
    "type": "image/jpeg",
    "etag": "\"c29c-rr9jpmfp8Ua9DuVs5NG8h9oAEI0\"",
    "mtime": "2023-04-08T00:16:32.762Z",
    "size": 49820,
    "path": "../public/images2/game/assassins_creed_origins_2017_8k-wallpaper-1920x1080.jpg"
  },
  "/images2/game/back.png": {
    "type": "image/png",
    "etag": "\"17af7-94hNQ3Crb9TPB7lYFR6D8xBfMwQ\"",
    "mtime": "2023-04-08T00:16:32.762Z",
    "size": 97015,
    "path": "../public/images2/game/back.png"
  },
  "/images2/game/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"c29c-rr9jpmfp8Ua9DuVs5NG8h9oAEI0\"",
    "mtime": "2023-04-08T00:16:32.759Z",
    "size": 49820,
    "path": "../public/images2/game/bg.jpg"
  },
  "/images2/game/dfh.jpg": {
    "type": "image/jpeg",
    "etag": "\"c29c-rr9jpmfp8Ua9DuVs5NG8h9oAEI0\"",
    "mtime": "2023-04-08T00:16:32.759Z",
    "size": 49820,
    "path": "../public/images2/game/dfh.jpg"
  },
  "/images2/game/dgdj.jpg": {
    "type": "image/jpeg",
    "etag": "\"c29c-rr9jpmfp8Ua9DuVs5NG8h9oAEI0\"",
    "mtime": "2023-04-08T00:16:32.759Z",
    "size": 49820,
    "path": "../public/images2/game/dgdj.jpg"
  },
  "/images2/game/fh.jpg": {
    "type": "image/jpeg",
    "etag": "\"b235-jXjFSJUxJ6HOsh8crA9yxw2HKoU\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 45621,
    "path": "../public/images2/game/fh.jpg"
  },
  "/images2/game/fhmf.jpg": {
    "type": "image/jpeg",
    "etag": "\"13828-abcej+zCFO0GMVj73Qosi/EEYus\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 79912,
    "path": "../public/images2/game/fhmf.jpg"
  },
  "/images2/game/footer.jpg": {
    "type": "image/jpeg",
    "etag": "\"bf25-xLc+Ggj9+u2oYMDh5LKTjq4DDmE\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 48933,
    "path": "../public/images2/game/footer.jpg"
  },
  "/images2/game/star_wars_battlefront_electronic_arts_105865_2560x1440.jpg": {
    "type": "image/jpeg",
    "etag": "\"13828-abcej+zCFO0GMVj73Qosi/EEYus\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 79912,
    "path": "../public/images2/game/star_wars_battlefront_electronic_arts_105865_2560x1440.jpg"
  },
  "/images2/game/top.png": {
    "type": "image/png",
    "etag": "\"edc5-7Ntn57lefGnOGlu2n3jAGh/Ibf4\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 60869,
    "path": "../public/images2/game/top.png"
  },
  "/images2/game/world_of_tanks_wargaming_net_wot_wg_wz_111_99171_2560x1440.jpg": {
    "type": "image/jpeg",
    "etag": "\"13828-abcej+zCFO0GMVj73Qosi/EEYus\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 79912,
    "path": "../public/images2/game/world_of_tanks_wargaming_net_wot_wg_wz_111_99171_2560x1440.jpg"
  },
  "/images2/goggles/sub-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d94-etbXWsn560xKtNF6QviGlacWLWE\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 7572,
    "path": "../public/images2/goggles/sub-banner.jpg"
  },
  "/images2/goggles/sub-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d94-etbXWsn560xKtNF6QviGlacWLWE\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 7572,
    "path": "../public/images2/goggles/sub-banner2.jpg"
  },
  "/images2/goggles/sub-banner3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d94-etbXWsn560xKtNF6QviGlacWLWE\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 7572,
    "path": "../public/images2/goggles/sub-banner3.jpg"
  },
  "/images2/gym/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 13653,
    "path": "../public/images2/gym/1.jpg"
  },
  "/images2/gym/banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f05-3Hwjz4Ql063S9sDGCv1RWb4rS5Y\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 12037,
    "path": "../public/images2/gym/banner2.jpg"
  },
  "/images2/gym/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"c541-0S9BezaDnqzEMGNxP3QBJBksKbs\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 50497,
    "path": "../public/images2/gym/bg.jpg"
  },
  "/images2/gym/logo.png": {
    "type": "image/png",
    "etag": "\"a22-Y2nMmUwicwtEtKSUZH0nfKHwsr0\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 2594,
    "path": "../public/images2/gym/logo.png"
  },
  "/images2/home-banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.712Z",
    "size": 36472,
    "path": "../public/images2/home-banner/1.jpg"
  },
  "/images2/home-banner/1.png": {
    "type": "image/png",
    "etag": "\"1e15-NqGGOARwCT1AIqmjtRBqV+56Ly8\"",
    "mtime": "2023-04-08T00:16:32.712Z",
    "size": 7701,
    "path": "../public/images2/home-banner/1.png"
  },
  "/images2/home-banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"945a-mV2Xj8uprDiD8EgZg0Ktonulm4k\"",
    "mtime": "2023-04-08T00:16:32.712Z",
    "size": 37978,
    "path": "../public/images2/home-banner/10.jpg"
  },
  "/images2/home-banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"945a-mV2Xj8uprDiD8EgZg0Ktonulm4k\"",
    "mtime": "2023-04-08T00:16:32.712Z",
    "size": 37978,
    "path": "../public/images2/home-banner/11.jpg"
  },
  "/images2/home-banner/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"945a-mV2Xj8uprDiD8EgZg0Ktonulm4k\"",
    "mtime": "2023-04-08T00:16:32.712Z",
    "size": 37978,
    "path": "../public/images2/home-banner/12.jpg"
  },
  "/images2/home-banner/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"8adf-61s86/RF7EuZUtrdpscOggZFo2g\"",
    "mtime": "2023-04-08T00:16:32.712Z",
    "size": 35551,
    "path": "../public/images2/home-banner/13.jpg"
  },
  "/images2/home-banner/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.712Z",
    "size": 36472,
    "path": "../public/images2/home-banner/14.jpg"
  },
  "/images2/home-banner/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 36472,
    "path": "../public/images2/home-banner/15.jpg"
  },
  "/images2/home-banner/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 36472,
    "path": "../public/images2/home-banner/16.jpg"
  },
  "/images2/home-banner/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 38037,
    "path": "../public/images2/home-banner/17.jpg"
  },
  "/images2/home-banner/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 38037,
    "path": "../public/images2/home-banner/18.jpg"
  },
  "/images2/home-banner/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 36472,
    "path": "../public/images2/home-banner/19.jpg"
  },
  "/images2/home-banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 36472,
    "path": "../public/images2/home-banner/2.jpg"
  },
  "/images2/home-banner/2.png": {
    "type": "image/png",
    "etag": "\"1e15-NqGGOARwCT1AIqmjtRBqV+56Ly8\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 7701,
    "path": "../public/images2/home-banner/2.png"
  },
  "/images2/home-banner/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.709Z",
    "size": 36472,
    "path": "../public/images2/home-banner/20.jpg"
  },
  "/images2/home-banner/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.705Z",
    "size": 36472,
    "path": "../public/images2/home-banner/21.jpg"
  },
  "/images2/home-banner/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.705Z",
    "size": 36472,
    "path": "../public/images2/home-banner/22.jpg"
  },
  "/images2/home-banner/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.705Z",
    "size": 49386,
    "path": "../public/images2/home-banner/23.jpg"
  },
  "/images2/home-banner/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.705Z",
    "size": 49386,
    "path": "../public/images2/home-banner/24.jpg"
  },
  "/images2/home-banner/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.705Z",
    "size": 49386,
    "path": "../public/images2/home-banner/25.jpg"
  },
  "/images2/home-banner/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"b8ac-MSKv/itjqp02Q9BRNZu0VP5Lt+Q\"",
    "mtime": "2023-04-08T00:16:32.705Z",
    "size": 47276,
    "path": "../public/images2/home-banner/26.jpg"
  },
  "/images2/home-banner/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.705Z",
    "size": 54473,
    "path": "../public/images2/home-banner/27.jpg"
  },
  "/images2/home-banner/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 54473,
    "path": "../public/images2/home-banner/28.jpg"
  },
  "/images2/home-banner/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 54473,
    "path": "../public/images2/home-banner/29.jpg"
  },
  "/images2/home-banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 36472,
    "path": "../public/images2/home-banner/3.jpg"
  },
  "/images2/home-banner/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"a40e-tq1L5Kcc0xUTzAa3eJUqCRf6KN0\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 41998,
    "path": "../public/images2/home-banner/30.jpg"
  },
  "/images2/home-banner/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"9235-daZxpYZN+cI8SrN/kae5vjUPLdU\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 37429,
    "path": "../public/images2/home-banner/31.jpg"
  },
  "/images2/home-banner/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"9826-EU+J+K3eziMpULjKo+0sXCVDek8\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 38950,
    "path": "../public/images2/home-banner/32.jpg"
  },
  "/images2/home-banner/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"9826-EU+J+K3eziMpULjKo+0sXCVDek8\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 38950,
    "path": "../public/images2/home-banner/33.jpg"
  },
  "/images2/home-banner/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:32.702Z",
    "size": 38037,
    "path": "../public/images2/home-banner/34.jpg"
  },
  "/images2/home-banner/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:32.699Z",
    "size": 38037,
    "path": "../public/images2/home-banner/35.jpg"
  },
  "/images2/home-banner/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"9495-On1xyVReIbPAOxyeTj/sTuL4mCs\"",
    "mtime": "2023-04-08T00:16:32.699Z",
    "size": 38037,
    "path": "../public/images2/home-banner/36.jpg"
  },
  "/images2/home-banner/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.699Z",
    "size": 36472,
    "path": "../public/images2/home-banner/37.jpg"
  },
  "/images2/home-banner/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c02-9zn4ZYCI47zfMH01MauoAi15Rto\"",
    "mtime": "2023-04-08T00:16:32.699Z",
    "size": 39938,
    "path": "../public/images2/home-banner/38.jpg"
  },
  "/images2/home-banner/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c02-9zn4ZYCI47zfMH01MauoAi15Rto\"",
    "mtime": "2023-04-08T00:16:32.699Z",
    "size": 39938,
    "path": "../public/images2/home-banner/39.jpg"
  },
  "/images2/home-banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.699Z",
    "size": 36472,
    "path": "../public/images2/home-banner/4.jpg"
  },
  "/images2/home-banner/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"9221-fnMOnl3XwvwnT/dv7mPDv3/coIw\"",
    "mtime": "2023-04-08T00:16:32.699Z",
    "size": 37409,
    "path": "../public/images2/home-banner/40.jpg"
  },
  "/images2/home-banner/41.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.695Z",
    "size": 49386,
    "path": "../public/images2/home-banner/41.jpg"
  },
  "/images2/home-banner/42.jpg": {
    "type": "image/jpeg",
    "etag": "\"6396-W1QWczlbE7dJg5ITk/1EsO5WbCo\"",
    "mtime": "2023-04-08T00:16:32.695Z",
    "size": 25494,
    "path": "../public/images2/home-banner/42.jpg"
  },
  "/images2/home-banner/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.695Z",
    "size": 49386,
    "path": "../public/images2/home-banner/43.jpg"
  },
  "/images2/home-banner/44.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.695Z",
    "size": 49386,
    "path": "../public/images2/home-banner/44.jpg"
  },
  "/images2/home-banner/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"8776-pyZMi9yDm6CpA7JrBAA98hyaOhU\"",
    "mtime": "2023-04-08T00:16:32.695Z",
    "size": 34678,
    "path": "../public/images2/home-banner/45.jpg"
  },
  "/images2/home-banner/46.jpg": {
    "type": "image/jpeg",
    "etag": "\"8776-pyZMi9yDm6CpA7JrBAA98hyaOhU\"",
    "mtime": "2023-04-08T00:16:32.695Z",
    "size": 34678,
    "path": "../public/images2/home-banner/46.jpg"
  },
  "/images2/home-banner/47.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.692Z",
    "size": 49386,
    "path": "../public/images2/home-banner/47.jpg"
  },
  "/images2/home-banner/48.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.692Z",
    "size": 49386,
    "path": "../public/images2/home-banner/48.jpg"
  },
  "/images2/home-banner/49.jpg": {
    "type": "image/jpeg",
    "etag": "\"9056-fwfdhhk+Nd6dBVks43CwmF4Otm4\"",
    "mtime": "2023-04-08T00:16:32.692Z",
    "size": 36950,
    "path": "../public/images2/home-banner/49.jpg"
  },
  "/images2/home-banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.692Z",
    "size": 36472,
    "path": "../public/images2/home-banner/5.jpg"
  },
  "/images2/home-banner/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.692Z",
    "size": 49386,
    "path": "../public/images2/home-banner/50.jpg"
  },
  "/images2/home-banner/51.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 49386,
    "path": "../public/images2/home-banner/51.jpg"
  },
  "/images2/home-banner/52.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 49386,
    "path": "../public/images2/home-banner/52.jpg"
  },
  "/images2/home-banner/53.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 54473,
    "path": "../public/images2/home-banner/53.jpg"
  },
  "/images2/home-banner/54.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 54473,
    "path": "../public/images2/home-banner/54.jpg"
  },
  "/images2/home-banner/55.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 54473,
    "path": "../public/images2/home-banner/55.jpg"
  },
  "/images2/home-banner/56.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 54473,
    "path": "../public/images2/home-banner/56.jpg"
  },
  "/images2/home-banner/57.jpg": {
    "type": "image/jpeg",
    "etag": "\"5380-EmwWX+kCz/uilDN4HDFznjKs0b0\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 21376,
    "path": "../public/images2/home-banner/57.jpg"
  },
  "/images2/home-banner/58.jpg": {
    "type": "image/jpeg",
    "etag": "\"5380-EmwWX+kCz/uilDN4HDFznjKs0b0\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 21376,
    "path": "../public/images2/home-banner/58.jpg"
  },
  "/images2/home-banner/59.jpg": {
    "type": "image/jpeg",
    "etag": "\"6101-VyBUX/Ic4Oi9GcRh2iJutIXr7Ms\"",
    "mtime": "2023-04-08T00:16:32.689Z",
    "size": 24833,
    "path": "../public/images2/home-banner/59.jpg"
  },
  "/images2/home-banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.685Z",
    "size": 36472,
    "path": "../public/images2/home-banner/6.jpg"
  },
  "/images2/home-banner/60.jpg": {
    "type": "image/jpeg",
    "etag": "\"6101-VyBUX/Ic4Oi9GcRh2iJutIXr7Ms\"",
    "mtime": "2023-04-08T00:16:32.685Z",
    "size": 24833,
    "path": "../public/images2/home-banner/60.jpg"
  },
  "/images2/home-banner/61.jpg": {
    "type": "image/jpeg",
    "etag": "\"9bd4-ZavRn4lz9xnqL78gqs3ePzVAZGA\"",
    "mtime": "2023-04-08T00:16:32.685Z",
    "size": 39892,
    "path": "../public/images2/home-banner/61.jpg"
  },
  "/images2/home-banner/62.jpg": {
    "type": "image/jpeg",
    "etag": "\"9bd4-ZavRn4lz9xnqL78gqs3ePzVAZGA\"",
    "mtime": "2023-04-08T00:16:32.685Z",
    "size": 39892,
    "path": "../public/images2/home-banner/62.jpg"
  },
  "/images2/home-banner/63.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.685Z",
    "size": 32147,
    "path": "../public/images2/home-banner/63.jpg"
  },
  "/images2/home-banner/64.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.685Z",
    "size": 32147,
    "path": "../public/images2/home-banner/64.jpg"
  },
  "/images2/home-banner/65.jpg": {
    "type": "image/jpeg",
    "etag": "\"7070-kGynHQwpAhgv7Vw0qal2b43BMHA\"",
    "mtime": "2023-04-08T00:16:32.682Z",
    "size": 28784,
    "path": "../public/images2/home-banner/65.jpg"
  },
  "/images2/home-banner/66.jpg": {
    "type": "image/jpeg",
    "etag": "\"7070-kGynHQwpAhgv7Vw0qal2b43BMHA\"",
    "mtime": "2023-04-08T00:16:32.682Z",
    "size": 28784,
    "path": "../public/images2/home-banner/66.jpg"
  },
  "/images2/home-banner/67.jpg": {
    "type": "image/jpeg",
    "etag": "\"7070-kGynHQwpAhgv7Vw0qal2b43BMHA\"",
    "mtime": "2023-04-08T00:16:32.682Z",
    "size": 28784,
    "path": "../public/images2/home-banner/67.jpg"
  },
  "/images2/home-banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.682Z",
    "size": 36472,
    "path": "../public/images2/home-banner/7.jpg"
  },
  "/images2/home-banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e78-3NNgFTvKVQ8PHR7aG759Z9aPZ20\"",
    "mtime": "2023-04-08T00:16:32.682Z",
    "size": 36472,
    "path": "../public/images2/home-banner/8.jpg"
  },
  "/images2/home-banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"945a-mV2Xj8uprDiD8EgZg0Ktonulm4k\"",
    "mtime": "2023-04-08T00:16:32.679Z",
    "size": 37978,
    "path": "../public/images2/home-banner/9.jpg"
  },
  "/images2/icon/2.png": {
    "type": "image/png",
    "etag": "\"3b3-tWBQuYRLapW54QzGItTTKtuFSzk\"",
    "mtime": "2023-04-08T00:16:32.679Z",
    "size": 947,
    "path": "../public/images2/icon/2.png"
  },
  "/images2/icon/3.png": {
    "type": "image/png",
    "etag": "\"3b7-cdVq5tFC9XlCk1chAPhYq1YTglY\"",
    "mtime": "2023-04-08T00:16:32.679Z",
    "size": 951,
    "path": "../public/images2/icon/3.png"
  },
  "/images2/icon/4.png": {
    "type": "image/png",
    "etag": "\"3b6-rqx2u9gKFSO6goiEeLohGjyu0Wg\"",
    "mtime": "2023-04-08T00:16:32.679Z",
    "size": 950,
    "path": "../public/images2/icon/4.png"
  },
  "/images2/icon/6.png": {
    "type": "image/png",
    "etag": "\"3b9-1nqXNLZ/VBaEiWvRi1YWzmD3WoA\"",
    "mtime": "2023-04-08T00:16:32.679Z",
    "size": 953,
    "path": "../public/images2/icon/6.png"
  },
  "/images2/icon/Add-to-cart.png": {
    "type": "image/png",
    "etag": "\"57b-0LQ1xcPCHTO/abrsg+jkwzVQMcI\"",
    "mtime": "2023-04-08T00:16:32.679Z",
    "size": 1403,
    "path": "../public/images2/icon/Add-to-cart.png"
  },
  "/images2/icon/GooglePlay.png": {
    "type": "image/png",
    "etag": "\"efb-jWw1AXQfVKHgLzSqzlYDRc/n7wc\"",
    "mtime": "2023-04-08T00:16:32.679Z",
    "size": 3835,
    "path": "../public/images2/icon/GooglePlay.png"
  },
  "/images2/icon/american-express.png": {
    "type": "image/png",
    "etag": "\"497-9cklPxJIf8kIie84z3p52G3LY8I\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 1175,
    "path": "../public/images2/icon/american-express.png"
  },
  "/images2/icon/angular.png": {
    "type": "image/png",
    "etag": "\"9c1-G+i0QOnWC3eEi2gUvwqwmwzGBkc\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 2497,
    "path": "../public/images2/icon/angular.png"
  },
  "/images2/icon/appstore.png": {
    "type": "image/png",
    "etag": "\"6b2-CL8wxC8ecym0eJ5d2aPMKtTAbSI\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 1714,
    "path": "../public/images2/icon/appstore.png"
  },
  "/images2/icon/avatar.png": {
    "type": "image/png",
    "etag": "\"2b3-iPZorMpAMrFiFIKdBgkmDuavvtM\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 691,
    "path": "../public/images2/icon/avatar.png"
  },
  "/images2/icon/bar.png": {
    "type": "image/png",
    "etag": "\"424-UqyM+ZOeSdl7U72KNlgxrmlferc\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 1060,
    "path": "../public/images2/icon/bar.png"
  },
  "/images2/icon/cart-1.png": {
    "type": "image/png",
    "etag": "\"541-qj0J93wgdlWJcR1VPmZMyfFOugo\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 1345,
    "path": "../public/images2/icon/cart-1.png"
  },
  "/images2/icon/cart.png": {
    "type": "image/png",
    "etag": "\"58a-aCYaFugDMLoKxRy3SY/qPJEdCnA\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 1418,
    "path": "../public/images2/icon/cart.png"
  },
  "/images2/icon/cat1.png": {
    "type": "image/png",
    "etag": "\"6d4-bQHhj+CMMWu9D8KCpV6oREWyU8I\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 1748,
    "path": "../public/images2/icon/cat1.png"
  },
  "/images2/icon/cat2.png": {
    "type": "image/png",
    "etag": "\"6ac-H6sSfFu/kJps4JgMBPSKAabtt4w\"",
    "mtime": "2023-04-08T00:16:32.675Z",
    "size": 1708,
    "path": "../public/images2/icon/cat2.png"
  },
  "/images2/icon/cat3.png": {
    "type": "image/png",
    "etag": "\"6d8-Cz+3YiXik48ii9OiLnI7RXJXRTk\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1752,
    "path": "../public/images2/icon/cat3.png"
  },
  "/images2/icon/cat4.png": {
    "type": "image/png",
    "etag": "\"6cf-1PINfXD6Gjd1G46LczKAqFR7pbs\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1743,
    "path": "../public/images2/icon/cat4.png"
  },
  "/images2/icon/cat5.png": {
    "type": "image/png",
    "etag": "\"6c0-yApsBrL5KThxMqiGlXlf+ekLdgY\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1728,
    "path": "../public/images2/icon/cat5.png"
  },
  "/images2/icon/cat6.png": {
    "type": "image/png",
    "etag": "\"65d-5dAj2rrLlIEfQoFIBq44lInoRR0\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1629,
    "path": "../public/images2/icon/cat6.png"
  },
  "/images2/icon/discover.png": {
    "type": "image/png",
    "etag": "\"52c-ow0c+IvEeynnhpnfWzthUQqyyeY\"",
    "mtime": "2023-04-08T00:16:32.665Z",
    "size": 1324,
    "path": "../public/images2/icon/discover.png"
  },
  "/images2/icon/email.png": {
    "type": "image/png",
    "etag": "\"549-muQAv1+rAla6JhoQhO9DM4p56Nc\"",
    "mtime": "2023-04-08T00:16:32.665Z",
    "size": 1353,
    "path": "../public/images2/icon/email.png"
  },
  "/images2/icon/footerlogo.png": {
    "type": "image/png",
    "etag": "\"8cc-CXcMCpWjMXvOhyygBaaA4cXGWZA\"",
    "mtime": "2023-04-08T00:16:32.665Z",
    "size": 2252,
    "path": "../public/images2/icon/footerlogo.png"
  },
  "/images2/icon/heart-1.png": {
    "type": "image/png",
    "etag": "\"4f6-RPe8mHpxR2hjtDlq8FZaSL/+2tI\"",
    "mtime": "2023-04-08T00:16:32.665Z",
    "size": 1270,
    "path": "../public/images2/icon/heart-1.png"
  },
  "/images2/icon/heart.png": {
    "type": "image/png",
    "etag": "\"27f-/0Bd8wPXCf55R6Tn9jRpHl2Z7vs\"",
    "mtime": "2023-04-08T00:16:32.665Z",
    "size": 639,
    "path": "../public/images2/icon/heart.png"
  },
  "/images2/icon/instagrma.png": {
    "type": "image/png",
    "etag": "\"a7e-824Sh9cqvRAErzYLVyykg2uzhq8\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 2686,
    "path": "../public/images2/icon/instagrma.png"
  },
  "/images2/icon/like.png": {
    "type": "image/png",
    "etag": "\"29d-qFp+iCTnN+SJtZTVjHEWsUA27To\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 669,
    "path": "../public/images2/icon/like.png"
  },
  "/images2/icon/logo-game.png": {
    "type": "image/png",
    "etag": "\"a22-bTvBXg7yC63eSgRLdMqJOc9newA\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 2594,
    "path": "../public/images2/icon/logo-game.png"
  },
  "/images2/icon/logo.png": {
    "type": "image/png",
    "etag": "\"8c9-T1nHqdhobcZ6zquEiltkxSF48Sg\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 2249,
    "path": "../public/images2/icon/logo.png"
  },
  "/images2/icon/magnifying-glass.png": {
    "type": "image/png",
    "etag": "\"273-dELreXSCXFU7lPetdAZSIn43+3E\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 627,
    "path": "../public/images2/icon/magnifying-glass.png"
  },
  "/images2/icon/mastercard.png": {
    "type": "image/png",
    "etag": "\"5c7-wubdLouvvgDW8F4vOLx4S1InD2g\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 1479,
    "path": "../public/images2/icon/mastercard.png"
  },
  "/images2/icon/paypal.png": {
    "type": "image/png",
    "etag": "\"3fa-RLyUNMYHcM6+06hdoqro03b8c14\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 1018,
    "path": "../public/images2/icon/paypal.png"
  },
  "/images2/icon/phone.png": {
    "type": "image/png",
    "etag": "\"447-mxE+PCr+n323CxZQmcF0pAr5F/0\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 1095,
    "path": "../public/images2/icon/phone.png"
  },
  "/images2/icon/quick-view.png": {
    "type": "image/png",
    "etag": "\"510-/1y85hFxvAj1J0MrbnUQcgGBosc\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 1296,
    "path": "../public/images2/icon/quick-view.png"
  },
  "/images2/icon/react.jpg": {
    "type": "image/jpeg",
    "etag": "\"11233-ARPZWM6n8AajhjEUICi5QH2FOJU\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 70195,
    "path": "../public/images2/icon/react.jpg"
  },
  "/images2/icon/react.png": {
    "type": "image/png",
    "etag": "\"a5c-/kl6iC5BodEYpgPrFT7/GeUV4/k\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 2652,
    "path": "../public/images2/icon/react.png"
  },
  "/images2/icon/rotate.png": {
    "type": "image/png",
    "etag": "\"329-kVFege7EOwBD7G3EOSImKy+AR2U\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 809,
    "path": "../public/images2/icon/rotate.png"
  },
  "/images2/icon/search.png": {
    "type": "image/png",
    "etag": "\"53e-TJpa6Az2xSg1wn7wsbycqTMpKoM\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 1342,
    "path": "../public/images2/icon/search.png"
  },
  "/images2/icon/service1.png": {
    "type": "image/png",
    "etag": "\"7d0-RgMZRTab6tlKFKX9EnHz1ANZ6ec\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 2000,
    "path": "../public/images2/icon/service1.png"
  },
  "/images2/icon/service1.svg": {
    "type": "image/svg+xml",
    "etag": "\"88e-opBj77xhywiwnh6MLl1h7FXeXxE\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 2190,
    "path": "../public/images2/icon/service1.svg"
  },
  "/images2/icon/service2.png": {
    "type": "image/png",
    "etag": "\"924-72Z5q4zjj+5dBV92f+dBjdVCZHE\"",
    "mtime": "2023-04-08T00:16:32.635Z",
    "size": 2340,
    "path": "../public/images2/icon/service2.png"
  },
  "/images2/icon/service2.svg": {
    "type": "image/svg+xml",
    "etag": "\"bbd-o3Ou5U5QTYl3X6cXyG12g0DPKfI\"",
    "mtime": "2023-04-08T00:16:32.632Z",
    "size": 3005,
    "path": "../public/images2/icon/service2.svg"
  },
  "/images2/icon/service3.png": {
    "type": "image/png",
    "etag": "\"961-1bgCaztXE6mGLZVx2PHw8mqsScc\"",
    "mtime": "2023-04-08T00:16:32.632Z",
    "size": 2401,
    "path": "../public/images2/icon/service3.png"
  },
  "/images2/icon/service3.svg": {
    "type": "image/svg+xml",
    "etag": "\"e12-IkyioTpXH1KmwG2zpGdXsHICe+E\"",
    "mtime": "2023-04-08T00:16:32.632Z",
    "size": 3602,
    "path": "../public/images2/icon/service3.svg"
  },
  "/images2/icon/service4.png": {
    "type": "image/png",
    "etag": "\"468-CQfk6js835pCdCbVeANYz8VPzbQ\"",
    "mtime": "2023-04-08T00:16:32.632Z",
    "size": 1128,
    "path": "../public/images2/icon/service4.png"
  },
  "/images2/icon/service4.svg": {
    "type": "image/svg+xml",
    "etag": "\"c80-dUIKCQBTGOMXezPj0FzLgunUp4A\"",
    "mtime": "2023-04-08T00:16:32.632Z",
    "size": 3200,
    "path": "../public/images2/icon/service4.svg"
  },
  "/images2/icon/setting-1.png": {
    "type": "image/png",
    "etag": "\"50e-Et89lBxg35bgb1m9QcA5NWp379I\"",
    "mtime": "2023-04-08T00:16:32.632Z",
    "size": 1294,
    "path": "../public/images2/icon/setting-1.png"
  },
  "/images2/icon/setting.png": {
    "type": "image/png",
    "etag": "\"689-NKrp5i98D+DWAdZKQqlDW6Gq4to\"",
    "mtime": "2023-04-08T00:16:32.632Z",
    "size": 1673,
    "path": "../public/images2/icon/setting.png"
  },
  "/images2/icon/settings.png": {
    "type": "image/png",
    "etag": "\"2af-7KFd3hJ2U/G/5AOHQcrQffK9W8Y\"",
    "mtime": "2023-04-08T00:16:32.629Z",
    "size": 687,
    "path": "../public/images2/icon/settings.png"
  },
  "/images2/icon/shopify.png": {
    "type": "image/png",
    "etag": "\"a07-DTPRvYBf4lNy+UuO7xnvqn2n1dA\"",
    "mtime": "2023-04-08T00:16:32.629Z",
    "size": 2567,
    "path": "../public/images2/icon/shopify.png"
  },
  "/images2/icon/shopping-cart.png": {
    "type": "image/png",
    "etag": "\"264-lhLKkYyxrBsxNOzVZt5UjTgOyc0\"",
    "mtime": "2023-04-08T00:16:32.629Z",
    "size": 612,
    "path": "../public/images2/icon/shopping-cart.png"
  },
  "/images2/icon/truck.png": {
    "type": "image/png",
    "etag": "\"2ce-6fIZDhI/iLJXocsKDIrqwhrrWbk\"",
    "mtime": "2023-04-08T00:16:32.629Z",
    "size": 718,
    "path": "../public/images2/icon/truck.png"
  },
  "/images2/icon/user-1.png": {
    "type": "image/png",
    "etag": "\"53b-nFesAd2kNllCAEgWpzZIH2yp21k\"",
    "mtime": "2023-04-08T00:16:32.629Z",
    "size": 1339,
    "path": "../public/images2/icon/user-1.png"
  },
  "/images2/icon/users.png": {
    "type": "image/png",
    "etag": "\"276-JK5qFMoORu3lXdOO6qQorling34\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 630,
    "path": "../public/images2/icon/users.png"
  },
  "/images2/icon/visa.png": {
    "type": "image/png",
    "etag": "\"63b-NnpCDHTVN/3HB2WVh12y2PRDR9A\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 1595,
    "path": "../public/images2/icon/visa.png"
  },
  "/images2/icon/wishlist.png": {
    "type": "image/png",
    "etag": "\"445-mJ7hBBKS3kHgbdfxz8KFLoZ6/sQ\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 1093,
    "path": "../public/images2/icon/wishlist.png"
  },
  "/images2/img/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"74b9-Ylmo5/WHAlo15/xWcAUjuyrCJNc\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 29881,
    "path": "../public/images2/img/1.jpg"
  },
  "/images2/img/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"74b9-Ylmo5/WHAlo15/xWcAUjuyrCJNc\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 29881,
    "path": "../public/images2/img/2.jpg"
  },
  "/images2/img/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"74b9-Ylmo5/WHAlo15/xWcAUjuyrCJNc\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 29881,
    "path": "../public/images2/img/3.jpg"
  },
  "/images2/img/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"74b9-Ylmo5/WHAlo15/xWcAUjuyrCJNc\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 29881,
    "path": "../public/images2/img/4.jpg"
  },
  "/images2/invoice/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"4796-ZT5xdEAoWNgvgQ8kJQLqp9XUXXc\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 18326,
    "path": "../public/images2/invoice/bg.jpg"
  },
  "/images2/invoice/bg1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4cb2-LG+novLOEKt6A2+q/WVd1a7BXbQ\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 19634,
    "path": "../public/images2/invoice/bg1.jpg"
  },
  "/images2/invoice/bg2.jpg": {
    "type": "image/jpeg",
    "etag": "\"c42-rbfhhiyRTW2P97wqfHgEZVwOQ+A\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 3138,
    "path": "../public/images2/invoice/bg2.jpg"
  },
  "/images2/invoice/bg3.jpg": {
    "type": "image/jpeg",
    "etag": "\"10ee-+zX6B1jzCeSGXBSFgqXeaMmf82U\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 4334,
    "path": "../public/images2/invoice/bg3.jpg"
  },
  "/images2/invoice/bg4.jpg": {
    "type": "image/jpeg",
    "etag": "\"2de2-XaiLhJN3ORZdVHPeFPHTSU0J1Nc\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 11746,
    "path": "../public/images2/invoice/bg4.jpg"
  },
  "/images2/invoice/bgback.jpg": {
    "type": "image/jpeg",
    "etag": "\"218a-AM9QDh4peTjrqdFDsYdtaxGOchQ\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 8586,
    "path": "../public/images2/invoice/bgback.jpg"
  },
  "/images2/invoice/invoice.svg": {
    "type": "image/svg+xml",
    "etag": "\"7f4-3Ja6XDhGSTdpkdrLuaTJAs0J8D0\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 2036,
    "path": "../public/images2/invoice/invoice.svg"
  },
  "/images2/invoice/shape.png": {
    "type": "image/png",
    "etag": "\"2a4-8dKnlFubk7nbTN6upWxK+vCfzoM\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 676,
    "path": "../public/images2/invoice/shape.png"
  },
  "/images2/invoice/sign.png": {
    "type": "image/png",
    "etag": "\"116f-MH3CDzkq1HcMejGi0EAbVs4TTc0\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 4463,
    "path": "../public/images2/invoice/sign.png"
  },
  "/images2/jewellery/parallax-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"727a-sV8XRthf0aSgQFlYDz4Jpd6j83s\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 29306,
    "path": "../public/images2/jewellery/parallax-banner.jpg"
  },
  "/images2/jewellery/parallax-banner1.jpg": {
    "type": "image/jpeg",
    "etag": "\"727a-sV8XRthf0aSgQFlYDz4Jpd6j83s\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 29306,
    "path": "../public/images2/jewellery/parallax-banner1.jpg"
  },
  "/images2/jewellery/timer-baner.jpg": {
    "type": "image/jpeg",
    "etag": "\"1970-9RhC0eicOFUZYp/KtXfsSrvGapQ\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 6512,
    "path": "../public/images2/jewellery/timer-baner.jpg"
  },
  "/images2/jewellery/vertical.jpg": {
    "type": "image/jpeg",
    "etag": "\"1893-drAkcRxDzexB5b6C1wDTDccqXas\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 6291,
    "path": "../public/images2/jewellery/vertical.jpg"
  },
  "/images2/kids/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3287-tVXWlZ/XFhKzvSfmkmTJgwRLQ5A\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 12935,
    "path": "../public/images2/kids/1.jpg"
  },
  "/images2/kids/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3287-tVXWlZ/XFhKzvSfmkmTJgwRLQ5A\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 12935,
    "path": "../public/images2/kids/2.jpg"
  },
  "/images2/landing-page/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"43cf7-B0bVGxHK7xprxHbox3vb1IqyegI\"",
    "mtime": "2023-04-08T00:16:32.572Z",
    "size": 277751,
    "path": "../public/images2/landing-page/1.jpg"
  },
  "/images2/landing-page/1.png": {
    "type": "image/png",
    "etag": "\"187-FQrveRuGxM12q+00NpO7R7Nv+IQ\"",
    "mtime": "2023-04-08T00:16:32.572Z",
    "size": 391,
    "path": "../public/images2/landing-page/1.png"
  },
  "/images2/landing-page/bootstrap.png": {
    "type": "image/png",
    "etag": "\"342-mQzPKf252bv9lVYKAp2PTBqFxX8\"",
    "mtime": "2023-04-08T00:16:32.572Z",
    "size": 834,
    "path": "../public/images2/landing-page/bootstrap.png"
  },
  "/images2/landing-page/email-bg.png": {
    "type": "image/png",
    "etag": "\"3812-IZkwxSwXloeQHksnJEeyKAOEHoA\"",
    "mtime": "2023-04-08T00:16:32.549Z",
    "size": 14354,
    "path": "../public/images2/landing-page/email-bg.png"
  },
  "/images2/landing-page/f-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"5364b-F1nvZNvAJg/ohWkY+PKdA3Jln30\"",
    "mtime": "2023-04-08T00:16:32.545Z",
    "size": 341579,
    "path": "../public/images2/landing-page/f-bg.jpg"
  },
  "/images2/landing-page/feature-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"5c2f6-hd08bSQNrdyKTryXZ5/1lUX/62s\"",
    "mtime": "2023-04-08T00:16:32.542Z",
    "size": 377590,
    "path": "../public/images2/landing-page/feature-bg.jpg"
  },
  "/images2/landing-page/footer.jpg": {
    "type": "image/jpeg",
    "etag": "\"409f3-MedXAr2kt3mnDdFHZaC2wGaFlEM\"",
    "mtime": "2023-04-08T00:16:32.539Z",
    "size": 264691,
    "path": "../public/images2/landing-page/footer.jpg"
  },
  "/images2/landing-page/footer1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4674c-1HcGMpThInisAyzxB4VeH/VTXPM\"",
    "mtime": "2023-04-08T00:16:32.539Z",
    "size": 288588,
    "path": "../public/images2/landing-page/footer1.jpg"
  },
  "/images2/landing-page/gulp.png": {
    "type": "image/png",
    "etag": "\"243-QBLjlYRMPRMdR/fVDTlWonhOVfQ\"",
    "mtime": "2023-04-08T00:16:32.535Z",
    "size": 579,
    "path": "../public/images2/landing-page/gulp.png"
  },
  "/images2/landing-page/home.jpg": {
    "type": "image/jpeg",
    "etag": "\"1fc51-eWb+0TlrY8gJ6qLF6yHs35kXDAk\"",
    "mtime": "2023-04-08T00:16:32.535Z",
    "size": 130129,
    "path": "../public/images2/landing-page/home.jpg"
  },
  "/images2/landing-page/html5.png": {
    "type": "image/png",
    "etag": "\"3d1-UDLbJCusjadDkOJ1LXPnSJkqDns\"",
    "mtime": "2023-04-08T00:16:32.535Z",
    "size": 977,
    "path": "../public/images2/landing-page/html5.png"
  },
  "/images2/landing-page/l-icon.png": {
    "type": "image/png",
    "etag": "\"d18-ksTrY5uqRsrKmsUVoOSLVCebYSA\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 3352,
    "path": "../public/images2/landing-page/l-icon.png"
  },
  "/images2/landing-page/logo.png": {
    "type": "image/png",
    "etag": "\"41a-lizoViMDi3OWjpLc+7+EFPFZnrs\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 1050,
    "path": "../public/images2/landing-page/logo.png"
  },
  "/images2/landing-page/lookbook.jpg": {
    "type": "image/jpeg",
    "etag": "\"1ae40-PQQo2fxb+HFh1QhFEhWIo1l8qdU\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 110144,
    "path": "../public/images2/landing-page/lookbook.jpg"
  },
  "/images2/landing-page/ratting.png": {
    "type": "image/png",
    "etag": "\"551-km/HHaDtACgJvHuRSuksf5bGMq0\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 1361,
    "path": "../public/images2/landing-page/ratting.png"
  },
  "/images2/landing-page/respnsive-img.jpg": {
    "type": "image/jpeg",
    "etag": "\"628a2-65NIj3nq5AhPKlAQ/1/A09UejrI\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 403618,
    "path": "../public/images2/landing-page/respnsive-img.jpg"
  },
  "/images2/landing-page/sass.png": {
    "type": "image/png",
    "etag": "\"299-RTzmcpHukdW8u9acqI58DJZnv2E\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 665,
    "path": "../public/images2/landing-page/sass.png"
  },
  "/images2/landing-page/support-bg.png": {
    "type": "image/png",
    "etag": "\"b9b0c-VT8MvK2t00yyRiQ/voaQFTZRJg0\"",
    "mtime": "2023-04-08T00:16:32.452Z",
    "size": 760588,
    "path": "../public/images2/landing-page/support-bg.png"
  },
  "/images2/landing-page/support.png": {
    "type": "image/png",
    "etag": "\"23d8-KgURTAwVmhuHQ9kdilAjREbpZec\"",
    "mtime": "2023-04-08T00:16:32.452Z",
    "size": 9176,
    "path": "../public/images2/landing-page/support.png"
  },
  "/images2/landing-page/text.png": {
    "type": "image/png",
    "etag": "\"93f-meudJpP7hNMFgnZDqeS8ufzNuL4\"",
    "mtime": "2023-04-08T00:16:32.452Z",
    "size": 2367,
    "path": "../public/images2/landing-page/text.png"
  },
  "/images2/logos/1.png": {
    "type": "image/png",
    "etag": "\"17f2-B1Ej3pRUewscAGS/MlrYjnSXL5o\"",
    "mtime": "2023-04-08T00:16:32.449Z",
    "size": 6130,
    "path": "../public/images2/logos/1.png"
  },
  "/images2/logos/10.png": {
    "type": "image/png",
    "etag": "\"5cd3-dThEEZ7sSlc/YdM0RVbMpJQeFtI\"",
    "mtime": "2023-04-08T00:16:32.449Z",
    "size": 23763,
    "path": "../public/images2/logos/10.png"
  },
  "/images2/logos/11.png": {
    "type": "image/png",
    "etag": "\"58d5-4t50D8Fb0LHeVN4Ky37A0djr0pU\"",
    "mtime": "2023-04-08T00:16:32.449Z",
    "size": 22741,
    "path": "../public/images2/logos/11.png"
  },
  "/images2/logos/12.png": {
    "type": "image/png",
    "etag": "\"4bc9-4x7Fe4i55PHaWq5x8yFZ6BCG4/M\"",
    "mtime": "2023-04-08T00:16:32.449Z",
    "size": 19401,
    "path": "../public/images2/logos/12.png"
  },
  "/images2/logos/13.png": {
    "type": "image/png",
    "etag": "\"4102-E0wdIOr84n1P8CdiukWbSugnLpU\"",
    "mtime": "2023-04-08T00:16:32.445Z",
    "size": 16642,
    "path": "../public/images2/logos/13.png"
  },
  "/images2/logos/14.png": {
    "type": "image/png",
    "etag": "\"4cb3-tQ5m9diq/x7OnsvVFwv0i7FieLo\"",
    "mtime": "2023-04-08T00:16:32.445Z",
    "size": 19635,
    "path": "../public/images2/logos/14.png"
  },
  "/images2/logos/15.png": {
    "type": "image/png",
    "etag": "\"46b9-sQGYZQg02Wm32U9Qyj0KuW+LLzE\"",
    "mtime": "2023-04-08T00:16:32.445Z",
    "size": 18105,
    "path": "../public/images2/logos/15.png"
  },
  "/images2/logos/16.png": {
    "type": "image/png",
    "etag": "\"58e4-1j6fhgGNK7Xsm7zFojjJgW77C+U\"",
    "mtime": "2023-04-08T00:16:32.442Z",
    "size": 22756,
    "path": "../public/images2/logos/16.png"
  },
  "/images2/logos/17.png": {
    "type": "image/png",
    "etag": "\"4d5b-vM+tPONwolDTDJI4kJWiBoAaKcc\"",
    "mtime": "2023-04-08T00:16:32.442Z",
    "size": 19803,
    "path": "../public/images2/logos/17.png"
  },
  "/images2/logos/2.png": {
    "type": "image/png",
    "etag": "\"563c-qi0YdCF3If0RUoGjm9PP1JWS9No\"",
    "mtime": "2023-04-08T00:16:32.442Z",
    "size": 22076,
    "path": "../public/images2/logos/2.png"
  },
  "/images2/logos/3.png": {
    "type": "image/png",
    "etag": "\"176d-2eCibUMRSfj98+9Pdges87NOIr8\"",
    "mtime": "2023-04-08T00:16:32.439Z",
    "size": 5997,
    "path": "../public/images2/logos/3.png"
  },
  "/images2/logos/4.png": {
    "type": "image/png",
    "etag": "\"f45-67E5Sll9ctf4kpkig5WpawHFy0s\"",
    "mtime": "2023-04-08T00:16:32.439Z",
    "size": 3909,
    "path": "../public/images2/logos/4.png"
  },
  "/images2/logos/5.png": {
    "type": "image/png",
    "etag": "\"1b0a-bOTyOMe9/XLXZ1N+iykTH4TQzl4\"",
    "mtime": "2023-04-08T00:16:32.439Z",
    "size": 6922,
    "path": "../public/images2/logos/5.png"
  },
  "/images2/logos/6.png": {
    "type": "image/png",
    "etag": "\"19c6-PKfhV3W0gi2/8cYtO+mNZDIr2pA\"",
    "mtime": "2023-04-08T00:16:32.439Z",
    "size": 6598,
    "path": "../public/images2/logos/6.png"
  },
  "/images2/logos/7.png": {
    "type": "image/png",
    "etag": "\"184b-6WUwPmpGMrRKLUFHPUo609eNh/s\"",
    "mtime": "2023-04-08T00:16:32.439Z",
    "size": 6219,
    "path": "../public/images2/logos/7.png"
  },
  "/images2/logos/8.png": {
    "type": "image/png",
    "etag": "\"1910-bTpYIVlb8fvAF7I+O3QHn1t9j/A\"",
    "mtime": "2023-04-08T00:16:32.439Z",
    "size": 6416,
    "path": "../public/images2/logos/8.png"
  },
  "/images2/logos/9.png": {
    "type": "image/png",
    "etag": "\"5220-n9MWd5q8316g7zQ2uQv2SGMGau0\"",
    "mtime": "2023-04-08T00:16:32.435Z",
    "size": 21024,
    "path": "../public/images2/logos/9.png"
  },
  "/images2/marijuana/leaf-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d92-m+HfIybaMKbKFeiMpMDKXwT8lwY\"",
    "mtime": "2023-04-08T00:16:32.429Z",
    "size": 19858,
    "path": "../public/images2/marijuana/leaf-bg.jpg"
  },
  "/images2/marketplace/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 17960,
    "path": "../public/images2/marketplace/1.jpg"
  },
  "/images2/marketplace/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 17960,
    "path": "../public/images2/marketplace/10.jpg"
  },
  "/images2/marketplace/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 17960,
    "path": "../public/images2/marketplace/11.jpg"
  },
  "/images2/marketplace/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 17960,
    "path": "../public/images2/marketplace/12.jpg"
  },
  "/images2/marketplace/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/13.jpg"
  },
  "/images2/marketplace/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/14.jpg"
  },
  "/images2/marketplace/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/15.jpg"
  },
  "/images2/marketplace/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/16.jpg"
  },
  "/images2/marketplace/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/2.jpg"
  },
  "/images2/marketplace/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/3.jpg"
  },
  "/images2/marketplace/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/4.jpg"
  },
  "/images2/marketplace/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.415Z",
    "size": 17960,
    "path": "../public/images2/marketplace/5.jpg"
  },
  "/images2/marketplace/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.412Z",
    "size": 17960,
    "path": "../public/images2/marketplace/6.jpg"
  },
  "/images2/marketplace/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.412Z",
    "size": 17960,
    "path": "../public/images2/marketplace/7.jpg"
  },
  "/images2/marketplace/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.412Z",
    "size": 17960,
    "path": "../public/images2/marketplace/8.jpg"
  },
  "/images2/marketplace/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.412Z",
    "size": 17960,
    "path": "../public/images2/marketplace/9.jpg"
  },
  "/images2/marketplace/product-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"6819-oWA/bLcyCCwK7rtioMhGdvTNgXQ\"",
    "mtime": "2023-04-08T00:16:32.382Z",
    "size": 26649,
    "path": "../public/images2/marketplace/product-banner.jpg"
  },
  "/images2/marketplace/product-banner2.jpg": {
    "type": "image/jpeg",
    "etag": "\"6819-oWA/bLcyCCwK7rtioMhGdvTNgXQ\"",
    "mtime": "2023-04-08T00:16:32.382Z",
    "size": 26649,
    "path": "../public/images2/marketplace/product-banner2.jpg"
  },
  "/images2/mega-menu/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.365Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/1.jpg"
  },
  "/images2/mega-menu/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.365Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/2.jpg"
  },
  "/images2/mega-menu/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.365Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/3.jpg"
  },
  "/images2/mega-menu/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.365Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/4.jpg"
  },
  "/images2/mega-menu/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.365Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/5.jpg"
  },
  "/images2/mega-menu/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.362Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/6.jpg"
  },
  "/images2/mega-menu/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.362Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/7.jpg"
  },
  "/images2/mega-menu/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.362Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/8.jpg"
  },
  "/images2/mega-menu/bag.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.362Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/bag.jpg"
  },
  "/images2/mega-menu/fashion.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.359Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/fashion.jpg"
  },
  "/images2/mega-menu/shoes.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.349Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/shoes.jpg"
  },
  "/images2/mega-menu/watches.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.349Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/watches.jpg"
  },
  "/images2/menu-icon/1.png": {
    "type": "image/png",
    "etag": "\"147e-4mvNxxtAdxU4pzoY5mcEGcrnZho\"",
    "mtime": "2023-04-08T00:16:32.345Z",
    "size": 5246,
    "path": "../public/images2/menu-icon/1.png"
  },
  "/images2/menu-icon/2.png": {
    "type": "image/png",
    "etag": "\"12c9-kufFGjRXAc8/9UvEaYVCOnHytYk\"",
    "mtime": "2023-04-08T00:16:32.345Z",
    "size": 4809,
    "path": "../public/images2/menu-icon/2.png"
  },
  "/images2/menu-icon/3.png": {
    "type": "image/png",
    "etag": "\"ced-1ngE8BATXXsZdNmcRa1adWoWdF0\"",
    "mtime": "2023-04-08T00:16:32.342Z",
    "size": 3309,
    "path": "../public/images2/menu-icon/3.png"
  },
  "/images2/menu-icon/4.png": {
    "type": "image/png",
    "etag": "\"12eb-0QlLJpmymrNRkwtLun/Oc24Tlis\"",
    "mtime": "2023-04-08T00:16:32.342Z",
    "size": 4843,
    "path": "../public/images2/menu-icon/4.png"
  },
  "/images2/menu-icon/5.png": {
    "type": "image/png",
    "etag": "\"1587-MHD7D46OQZZ4/oQu/eMWUMqEo4E\"",
    "mtime": "2023-04-08T00:16:32.342Z",
    "size": 5511,
    "path": "../public/images2/menu-icon/5.png"
  },
  "/images2/menu-icon/6.png": {
    "type": "image/png",
    "etag": "\"1115-KCw3Mvp8LKlcoqE+qNQ5NOa7EFk\"",
    "mtime": "2023-04-08T00:16:32.342Z",
    "size": 4373,
    "path": "../public/images2/menu-icon/6.png"
  },
  "/images2/modal/blackfriday.jpg": {
    "type": "image/jpeg",
    "etag": "\"340b6-hzL997D9RtPimyLcNsk7O8aOlBo\"",
    "mtime": "2023-04-08T00:16:32.342Z",
    "size": 213174,
    "path": "../public/images2/modal/blackfriday.jpg"
  },
  "/images2/modal/cybermonday.jpg": {
    "type": "image/jpeg",
    "etag": "\"9488-jdRsHRVIfzEkRmmYuIVyvKAVmHM\"",
    "mtime": "2023-04-08T00:16:32.339Z",
    "size": 38024,
    "path": "../public/images2/modal/cybermonday.jpg"
  },
  "/images2/modal-bg/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"a2111-5y+9RHwdvdeJycdan0kpG1hs6ss\"",
    "mtime": "2023-04-08T00:16:32.339Z",
    "size": 663825,
    "path": "../public/images2/modal-bg/1.jpg"
  },
  "/images2/modal-bg/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f955-dUaBfKOx1jLhZ8dbiACyvB0BZ/Q\"",
    "mtime": "2023-04-08T00:16:32.339Z",
    "size": 194901,
    "path": "../public/images2/modal-bg/10.jpg"
  },
  "/images2/modal-bg/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3c2da-Y+d13iF0Ej41p4xyVFjJi/zUD9k\"",
    "mtime": "2023-04-08T00:16:32.339Z",
    "size": 246490,
    "path": "../public/images2/modal-bg/11.jpg"
  },
  "/images2/modal-bg/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"9d5fd-c2pqjF0/D252tn4kOzr8t6Z0LH0\"",
    "mtime": "2023-04-08T00:16:32.335Z",
    "size": 644605,
    "path": "../public/images2/modal-bg/12.jpg"
  },
  "/images2/modal-bg/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"7baf2-I/7pDgNR4f56LpcsWx/1GkOE/+w\"",
    "mtime": "2023-04-08T00:16:32.335Z",
    "size": 506610,
    "path": "../public/images2/modal-bg/2.jpg"
  },
  "/images2/modal-bg/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"97c71-rKwClfiFDxVS9B8Ct/8ltJtiXAk\"",
    "mtime": "2023-04-08T00:16:32.335Z",
    "size": 621681,
    "path": "../public/images2/modal-bg/3.jpg"
  },
  "/images2/modal-bg/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"9d2ec-wVnX/4jkx0d9OfBu+j5OW+xOvcY\"",
    "mtime": "2023-04-08T00:16:32.332Z",
    "size": 643820,
    "path": "../public/images2/modal-bg/4.jpg"
  },
  "/images2/modal-bg/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"38250-UWMHeHW25hi3kC6PT94QZdlt7QU\"",
    "mtime": "2023-04-08T00:16:32.332Z",
    "size": 229968,
    "path": "../public/images2/modal-bg/5.jpg"
  },
  "/images2/modal-bg/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"a03ee-UkKHdqyMLXCEEQbMYk6jIi0/YuE\"",
    "mtime": "2023-04-08T00:16:32.329Z",
    "size": 656366,
    "path": "../public/images2/modal-bg/6.jpg"
  },
  "/images2/modal-bg/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4637d-mQ503FfyoBltqGadkaz/JOgwpls\"",
    "mtime": "2023-04-08T00:16:32.329Z",
    "size": 287613,
    "path": "../public/images2/modal-bg/7.jpg"
  },
  "/images2/modal-bg/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"8afd4-eH9ghNxtnW1Q4uiVtzs6wYKu5tE\"",
    "mtime": "2023-04-08T00:16:32.329Z",
    "size": 569300,
    "path": "../public/images2/modal-bg/8.jpg"
  },
  "/images2/modal-bg/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"2e7c4-iW/Jc5ogkIW3RZWKPK9Rz2VlRbs\"",
    "mtime": "2023-04-08T00:16:32.325Z",
    "size": 190404,
    "path": "../public/images2/modal-bg/9.jpg"
  },
  "/images2/nursery/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"35ab-OfFmHXtBT+uGwMDVj+P3BSDl588\"",
    "mtime": "2023-04-08T00:16:32.325Z",
    "size": 13739,
    "path": "../public/images2/nursery/1.jpg"
  },
  "/images2/nursery/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"35ab-OfFmHXtBT+uGwMDVj+P3BSDl588\"",
    "mtime": "2023-04-08T00:16:32.325Z",
    "size": 13739,
    "path": "../public/images2/nursery/2.jpg"
  },
  "/images2/nursery/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"35ab-OfFmHXtBT+uGwMDVj+P3BSDl588\"",
    "mtime": "2023-04-08T00:16:32.325Z",
    "size": 13739,
    "path": "../public/images2/nursery/3.jpg"
  },
  "/images2/nursery/bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"ab25-hFeIZJ2jBLXjfEG7lB5Fo/XxIgQ\"",
    "mtime": "2023-04-08T00:16:32.325Z",
    "size": 43813,
    "path": "../public/images2/nursery/bg.jpg"
  },
  "/images2/nursery/sub-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1c07-JQlDj6wK+UV6SzCgyXeadMhCvMI\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 7175,
    "path": "../public/images2/nursery/sub-1.jpg"
  },
  "/images2/nursery/sub-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1c07-JQlDj6wK+UV6SzCgyXeadMhCvMI\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 7175,
    "path": "../public/images2/nursery/sub-2.jpg"
  },
  "/images2/parallax/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.319Z",
    "size": 49386,
    "path": "../public/images2/parallax/1.jpg"
  },
  "/images2/parallax/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"80ad-uz8/kBpDVcHPnvfwo+jIQYR1amo\"",
    "mtime": "2023-04-08T00:16:32.319Z",
    "size": 32941,
    "path": "../public/images2/parallax/10.jpg"
  },
  "/images2/parallax/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"7f6a-PotLHk737ad7qt/ARvxK3ZC7lfU\"",
    "mtime": "2023-04-08T00:16:32.319Z",
    "size": 32618,
    "path": "../public/images2/parallax/11.jpg"
  },
  "/images2/parallax/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"83de-eI6uWmDYGhlSWpFANhUBWbKh7ZI\"",
    "mtime": "2023-04-08T00:16:32.319Z",
    "size": 33758,
    "path": "../public/images2/parallax/12.jpg"
  },
  "/images2/parallax/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"83de-eI6uWmDYGhlSWpFANhUBWbKh7ZI\"",
    "mtime": "2023-04-08T00:16:32.319Z",
    "size": 33758,
    "path": "../public/images2/parallax/13.jpg"
  },
  "/images2/parallax/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"970e-88E8J31uW18e7yQe1VDdqRsEYfA\"",
    "mtime": "2023-04-08T00:16:32.319Z",
    "size": 38670,
    "path": "../public/images2/parallax/14.jpg"
  },
  "/images2/parallax/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4c9-Qp80PqggqERz0nwrds/n34+k0XI\"",
    "mtime": "2023-04-08T00:16:32.315Z",
    "size": 54473,
    "path": "../public/images2/parallax/15.jpg"
  },
  "/images2/parallax/16(old).jpg": {
    "type": "image/jpeg",
    "etag": "\"3b233-0GAyJ/bLhD7XM6rkRHKTXLuIPik\"",
    "mtime": "2023-04-08T00:16:32.315Z",
    "size": 242227,
    "path": "../public/images2/parallax/16(old).jpg"
  },
  "/images2/parallax/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.315Z",
    "size": 49386,
    "path": "../public/images2/parallax/16.jpg"
  },
  "/images2/parallax/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.315Z",
    "size": 49386,
    "path": "../public/images2/parallax/17.jpg"
  },
  "/images2/parallax/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"ccbb-t2aQ0hEzY7nns5VcEyOFO/Jg6hI\"",
    "mtime": "2023-04-08T00:16:32.315Z",
    "size": 52411,
    "path": "../public/images2/parallax/18.jpg"
  },
  "/images2/parallax/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"8776-pyZMi9yDm6CpA7JrBAA98hyaOhU\"",
    "mtime": "2023-04-08T00:16:32.315Z",
    "size": 34678,
    "path": "../public/images2/parallax/19.jpg"
  },
  "/images2/parallax/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.312Z",
    "size": 49386,
    "path": "../public/images2/parallax/2.jpg"
  },
  "/images2/parallax/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"c905-oJzixKBKfVMJplWuKBYhMk6MHjk\"",
    "mtime": "2023-04-08T00:16:32.312Z",
    "size": 51461,
    "path": "../public/images2/parallax/20.jpg"
  },
  "/images2/parallax/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.312Z",
    "size": 49386,
    "path": "../public/images2/parallax/21.jpg"
  },
  "/images2/parallax/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"cff2-H500HcKUJr+XHiMjEEzTX3ys4YA\"",
    "mtime": "2023-04-08T00:16:32.312Z",
    "size": 53234,
    "path": "../public/images2/parallax/22.jpg"
  },
  "/images2/parallax/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"e2b5-8j7kysoXdk8OCNYpcj5wf78br0I\"",
    "mtime": "2023-04-08T00:16:32.312Z",
    "size": 58037,
    "path": "../public/images2/parallax/23.jpg"
  },
  "/images2/parallax/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"51ee-LPET+Tp+SQG19JH7wwzK44W10kI\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 20974,
    "path": "../public/images2/parallax/24.jpg"
  },
  "/images2/parallax/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 49386,
    "path": "../public/images2/parallax/25.jpg"
  },
  "/images2/parallax/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 49386,
    "path": "../public/images2/parallax/26.jpg"
  },
  "/images2/parallax/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 49386,
    "path": "../public/images2/parallax/27.jpg"
  },
  "/images2/parallax/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 49386,
    "path": "../public/images2/parallax/28.jpg"
  },
  "/images2/parallax/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"6b71-DCW9do3ZIDbcXZfDYLLpe/3m+2E\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 27505,
    "path": "../public/images2/parallax/29.jpg"
  },
  "/images2/parallax/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0ea-ISGE7guDWMVcnEqsQr0bQpfyRM0\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 49386,
    "path": "../public/images2/parallax/3.jpg"
  },
  "/images2/parallax/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"728f-oKTD/CsHt7aL1JSgmyMnNOMG56g\"",
    "mtime": "2023-04-08T00:16:32.309Z",
    "size": 29327,
    "path": "../public/images2/parallax/30.jpg"
  },
  "/images2/parallax/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"ab9f-fYS55DtEoR7tvugHBqos+6kIKe8\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 43935,
    "path": "../public/images2/parallax/4.jpg"
  },
  "/images2/parallax/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"ab9f-fYS55DtEoR7tvugHBqos+6kIKe8\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 43935,
    "path": "../public/images2/parallax/5.jpg"
  },
  "/images2/parallax/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"ab9f-fYS55DtEoR7tvugHBqos+6kIKe8\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 43935,
    "path": "../public/images2/parallax/6.jpg"
  },
  "/images2/parallax/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"ab9f-fYS55DtEoR7tvugHBqos+6kIKe8\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 43935,
    "path": "../public/images2/parallax/7.jpg"
  },
  "/images2/parallax/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"7f6a-PotLHk737ad7qt/ARvxK3ZC7lfU\"",
    "mtime": "2023-04-08T00:16:32.305Z",
    "size": 32618,
    "path": "../public/images2/parallax/9.jpg"
  },
  "/images2/portfolio/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"10ad-SalNgYYUXKzgn2M9Y/hu9xoilZQ\"",
    "mtime": "2023-04-08T00:16:32.295Z",
    "size": 4269,
    "path": "../public/images2/portfolio/1.jpg"
  },
  "/images2/portfolio/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"20f9-0yuHBPFGaYkoe9LwsYwMe3963bo\"",
    "mtime": "2023-04-08T00:16:32.295Z",
    "size": 8441,
    "path": "../public/images2/portfolio/10.jpg"
  },
  "/images2/portfolio/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"ac6-/HGm8zCLKm8ETosmV+CXTyK0Jec\"",
    "mtime": "2023-04-08T00:16:32.295Z",
    "size": 2758,
    "path": "../public/images2/portfolio/11.jpg"
  },
  "/images2/portfolio/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"1968-41YiaWniKuPHYoX80HFtyn2tCdY\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 6504,
    "path": "../public/images2/portfolio/12.jpg"
  },
  "/images2/portfolio/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a32-kYcWxs4uNXqz+HLFYUi+pWqnChk\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 6706,
    "path": "../public/images2/portfolio/13.jpg"
  },
  "/images2/portfolio/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"aa4-TYbDYcWusUJC6yTj7GRelxcjums\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 2724,
    "path": "../public/images2/portfolio/14.jpg"
  },
  "/images2/portfolio/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"10ad-SalNgYYUXKzgn2M9Y/hu9xoilZQ\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 4269,
    "path": "../public/images2/portfolio/15.jpg"
  },
  "/images2/portfolio/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"e22-OtsvoW/eRm3XpUAurkmqaNIyquE\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 3618,
    "path": "../public/images2/portfolio/16.jpg"
  },
  "/images2/portfolio/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"1546-a4A2svWaZy2MiqqFoxe2HSj6cpA\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 5446,
    "path": "../public/images2/portfolio/17.jpg"
  },
  "/images2/portfolio/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"37b6b-TKQQx23w5X7BAP2/bQCpupjLwzQ\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 228203,
    "path": "../public/images2/portfolio/18.jpg"
  },
  "/images2/portfolio/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"16a4-bo1YZTnxGVcz1XNX2COyjRPFCFk\"",
    "mtime": "2023-04-08T00:16:32.292Z",
    "size": 5796,
    "path": "../public/images2/portfolio/19.jpg"
  },
  "/images2/portfolio/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1968-41YiaWniKuPHYoX80HFtyn2tCdY\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 6504,
    "path": "../public/images2/portfolio/2.jpg"
  },
  "/images2/portfolio/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"14b8-WsareC/gxbbHE+dGV1NhFmu7Lbo\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 5304,
    "path": "../public/images2/portfolio/20.jpg"
  },
  "/images2/portfolio/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"90e-uDwd/Z8BzhPUXIswm8q5tl3cjVg\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 2318,
    "path": "../public/images2/portfolio/21.jpg"
  },
  "/images2/portfolio/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"1ff7-zthvOalaFFJSdpGc3hbcrqjNu2k\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 8183,
    "path": "../public/images2/portfolio/22.jpg"
  },
  "/images2/portfolio/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"1435-nWMYMZqO0GOdJ3BNHRd83XBQq50\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 5173,
    "path": "../public/images2/portfolio/23.jpg"
  },
  "/images2/portfolio/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ad-BWgmoERMlvfXUTR8rWBOkE+i2A8\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 6573,
    "path": "../public/images2/portfolio/24.jpg"
  },
  "/images2/portfolio/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d9d-dAhrBrTPHUOYuzBpiGOatMKVK8U\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 7581,
    "path": "../public/images2/portfolio/25.jpg"
  },
  "/images2/portfolio/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"1df8-iKbyQ3qUmW56XawUeKh2iPnRziI\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 7672,
    "path": "../public/images2/portfolio/26.jpg"
  },
  "/images2/portfolio/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"19c8-fP0VCOk9tsFkgy8Fsi/EEO0Dykk\"",
    "mtime": "2023-04-08T00:16:32.289Z",
    "size": 6600,
    "path": "../public/images2/portfolio/3.jpg"
  },
  "/images2/portfolio/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b11-ssheLEehPUUburGCuidrZ1MHnm4\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 2833,
    "path": "../public/images2/portfolio/4.jpg"
  },
  "/images2/portfolio/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1827-/FfeJRN3P9mfw/X4+kX+LPaTad0\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 6183,
    "path": "../public/images2/portfolio/5.jpg"
  },
  "/images2/portfolio/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1659-6xp+4vfiaaDtS2SQ41Qpj2N9U/w\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 5721,
    "path": "../public/images2/portfolio/6.jpg"
  },
  "/images2/portfolio/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"12fe-x14kQm+CkKJdZMrNqXpQwoGrf7Y\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 4862,
    "path": "../public/images2/portfolio/7.jpg"
  },
  "/images2/portfolio/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1af6-ZZ+uMV8uw6VKu0d/d9ayeR3jZQc\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 6902,
    "path": "../public/images2/portfolio/8.jpg"
  },
  "/images2/portfolio/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"14e5-ORiehJMNqKjIGqOCF9+kUZ5IOB8\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 5349,
    "path": "../public/images2/portfolio/9.jpg"
  },
  "/images2/pro/1-.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-5rnEXwI1/I+jkY9e3fv2ACHBwoc\"",
    "mtime": "2023-04-08T00:16:32.255Z",
    "size": 15591,
    "path": "../public/images2/pro/1-.jpg"
  },
  "/images2/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-cRWelDUxQqBQum8r4YIQURCv0NE\"",
    "mtime": "2023-04-08T00:16:32.255Z",
    "size": 15591,
    "path": "../public/images2/pro/1.jpg"
  },
  "/images2/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-W/g/zwT4/mM74++5cFVqXYhJRZo\"",
    "mtime": "2023-04-08T00:16:32.255Z",
    "size": 15591,
    "path": "../public/images2/pro/10.jpg"
  },
  "/images2/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-1WnC4MIj5dDbeLme5a16XcaRbhE\"",
    "mtime": "2023-04-08T00:16:32.255Z",
    "size": 15591,
    "path": "../public/images2/pro/11.jpg"
  },
  "/images2/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-UFfuRuTLO8qmCeDs+DpcxKGH3S0\"",
    "mtime": "2023-04-08T00:16:32.255Z",
    "size": 15591,
    "path": "../public/images2/pro/12.jpg"
  },
  "/images2/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-1+z3BxQwLGCjaNoCf4iRiNPCRKU\"",
    "mtime": "2023-04-08T00:16:32.255Z",
    "size": 15591,
    "path": "../public/images2/pro/13.jpg"
  },
  "/images2/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-gURF5AzKYQ83Kp0S140zuK2LhCI\"",
    "mtime": "2023-04-08T00:16:32.255Z",
    "size": 15591,
    "path": "../public/images2/pro/14.jpg"
  },
  "/images2/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-SERA8a1qkwW0Z1WpYVEgYRfbMrw\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/16.jpg"
  },
  "/images2/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-Tc3oNL/Bcf4eeIDfTrJTlS04eys\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/17.jpg"
  },
  "/images2/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-EQfJ+mK1sthB8lwqSG34x2Hw3A8\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/18.jpg"
  },
  "/images2/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-5wMpsNV+KJesTkECBvSLwPA3K34\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/19.jpg"
  },
  "/images2/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-qbJIEqEElB5Hryu+vNRfJ+MLDms\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/2.jpg"
  },
  "/images2/pro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-6Vb3rEEYeniUaFEL2vmgiWZTKH8\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/20.jpg"
  },
  "/images2/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-OwMTD0ZcWFYS1jBB+KSIGxtIaNU\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/21.jpg"
  },
  "/images2/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-zlOSotWPJCXLq6xUv0vehXcwJsQ\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/22.jpg"
  },
  "/images2/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-+IUu1myN5SirG3U1etaGcRqWmVM\"",
    "mtime": "2023-04-08T00:16:32.252Z",
    "size": 15591,
    "path": "../public/images2/pro/23.jpg"
  },
  "/images2/pro/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-T6HXw7klRxydfbY8KFFFjnTwNCo\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/24.jpg"
  },
  "/images2/pro/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-HaQKfRICG5dH90Ui5xuGNSVDHjc\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/25.jpg"
  },
  "/images2/pro/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-Nw0wv2Q2gsVEcmUOGDiZOyeKiLk\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/26.jpg"
  },
  "/images2/pro/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-letY9+kVYiS9Aj1YeKvOyaaEPYM\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/27.jpg"
  },
  "/images2/pro/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-OwjHES4KD+ngrZ0OiLvluz8jBZ8\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/28.jpg"
  },
  "/images2/pro/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-kGvB5hxn14D/Zc411xitn8/u0P4\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/29.jpg"
  },
  "/images2/pro/3--.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-TRfv1g9SesM/QJp1BANuu3+5ubI\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/3--.jpg"
  },
  "/images2/pro/3-.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-ZdX3LRN3QxRwSxSlu7Ubfw5JmsU\"",
    "mtime": "2023-04-08T00:16:32.249Z",
    "size": 15591,
    "path": "../public/images2/pro/3-.jpg"
  },
  "/images2/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-uR8JWTTh5fI3Ss48NyUsNafGUIs\"",
    "mtime": "2023-04-08T00:16:32.245Z",
    "size": 15591,
    "path": "../public/images2/pro/3.jpg"
  },
  "/images2/pro/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-1kj7ethtyg60CtwY4SuD/N2fMd8\"",
    "mtime": "2023-04-08T00:16:32.245Z",
    "size": 15591,
    "path": "../public/images2/pro/30.jpg"
  },
  "/images2/pro/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-8ZacWQpyV1MLw/FMYXte5+Ikpuo\"",
    "mtime": "2023-04-08T00:16:32.245Z",
    "size": 15591,
    "path": "../public/images2/pro/31.jpg"
  },
  "/images2/pro/32-.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-vtiuvwCvPwzLUCvLkhtMraSH65w\"",
    "mtime": "2023-04-08T00:16:32.245Z",
    "size": 15591,
    "path": "../public/images2/pro/32-.jpg"
  },
  "/images2/pro/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-ghhKCpk5pK/yv5krhG5quSr5qn4\"",
    "mtime": "2023-04-08T00:16:32.245Z",
    "size": 15591,
    "path": "../public/images2/pro/33.jpg"
  },
  "/images2/pro/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-Uh/k33qJRhahyLVxHZcT5IMUoHY\"",
    "mtime": "2023-04-08T00:16:32.245Z",
    "size": 15591,
    "path": "../public/images2/pro/34.jpg"
  },
  "/images2/pro/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-hfQFob7hb4LuJVcLiQUGsUEm4v8\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/35.jpg"
  },
  "/images2/pro/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-UJ6LAKkmbTPEeuBHHD7AFWi880g\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/36.jpg"
  },
  "/images2/pro/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-PoWpw0EH+Lstrcvyr1PVNHewLjo\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/37.jpg"
  },
  "/images2/pro/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-aH5rYyYZjLN6NXTipmRteulGaB4\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/38.jpg"
  },
  "/images2/pro/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-itvy+zE8SBHubeqMmC8pxrPZVyc\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/39.jpg"
  },
  "/images2/pro/4-.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-0gsGkftgJbMwWmNPK5VqwnaV6tM\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/4-.jpg"
  },
  "/images2/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-t/FJLtB2elVrzWeSvsl/kpvfSqk\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/4.jpg"
  },
  "/images2/pro/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-rzOqkQewhQoz1g2Rhj6a+FrLbrU\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/40.jpg"
  },
  "/images2/pro/5--.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-myUcLU0OSNN8ac+SV/LY/PzRIow\"",
    "mtime": "2023-04-08T00:16:32.242Z",
    "size": 15591,
    "path": "../public/images2/pro/5--.jpg"
  },
  "/images2/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-4IqSn3irmh2ZRYIR/xmCPleg59I\"",
    "mtime": "2023-04-08T00:16:32.239Z",
    "size": 15591,
    "path": "../public/images2/pro/5.jpg"
  },
  "/images2/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-wMWTs4JECSmTV/t7s9xpFMM28S4\"",
    "mtime": "2023-04-08T00:16:32.239Z",
    "size": 15591,
    "path": "../public/images2/pro/6.jpg"
  },
  "/images2/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-ieExfZfWZXsIOSmnDeBjK9Gh5bM\"",
    "mtime": "2023-04-08T00:16:32.239Z",
    "size": 15591,
    "path": "../public/images2/pro/7.jpg"
  },
  "/images2/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-IU9A1jJcwjEVnaO6k77JG5RNBBc\"",
    "mtime": "2023-04-08T00:16:32.239Z",
    "size": 15591,
    "path": "../public/images2/pro/8.jpg"
  },
  "/images2/pro/9-.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ce7-l1+Bg/aB5jFDHXYV8QTY2MyTxrg\"",
    "mtime": "2023-04-08T00:16:32.239Z",
    "size": 15591,
    "path": "../public/images2/pro/9-.jpg"
  },
  "/images2/pro2/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-4z0OLYICVa0Casf0WuaO70Kwgpw\"",
    "mtime": "2023-04-08T00:16:32.239Z",
    "size": 17960,
    "path": "../public/images2/pro2/14.jpg"
  },
  "/images2/pro2/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-v0/EKOfVNLrVB7veFKp2qt00Goc\"",
    "mtime": "2023-04-08T00:16:32.239Z",
    "size": 17960,
    "path": "../public/images2/pro2/21.jpg"
  },
  "/images2/pro2/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-xnPwsf9Ga64bOUkECMlugpz7qmo\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/22.jpg"
  },
  "/images2/pro2/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-erIKLK8ESZRAfU2jGXrud2R+YgM\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/33.jpg"
  },
  "/images2/pro2/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-3jYW1CezyYxBVZK+3BjPXG8yYw0\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/34.jpg"
  },
  "/images2/pro2/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Os5cJt/PzRR6otPnH+EZG0AlOW0\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/43.jpg"
  },
  "/images2/pro2/44.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-jVsX0bSY7jVhduYS7iFVoR/EfGs\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/44.jpg"
  },
  "/images2/pro2/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-xIOlsuWU4J/L+scjmUzM5K1RSe8\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/45.jpg"
  },
  "/images2/pro2/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-/PrnFIUcp4Anp94aSR4bOkM9Uro\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/50.jpg"
  },
  "/images2/pro2/51.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-0K9LYQWh1XltiXMkzxhDTbmOcCU\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/51.jpg"
  },
  "/images2/pro2/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-Z7sqReWDvu2ey1IP5dLj+7vufSU\"",
    "mtime": "2023-04-08T00:16:32.235Z",
    "size": 17960,
    "path": "../public/images2/pro2/6.jpg"
  },
  "/images2/pro2/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4628-exYmw6FptPEqwo1XbBhU4fhW6s4\"",
    "mtime": "2023-04-08T00:16:32.232Z",
    "size": 17960,
    "path": "../public/images2/pro2/7.jpg"
  },
  "/images2/pro3/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-QBh9qmye+o3tRfXuMMvwaHlbMOI\"",
    "mtime": "2023-04-08T00:16:32.232Z",
    "size": 13716,
    "path": "../public/images2/pro3/1.jpg"
  },
  "/images2/pro3/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-jF1JYGDzT1j8fCVo34CTQ1SJOjk\"",
    "mtime": "2023-04-08T00:16:32.232Z",
    "size": 13716,
    "path": "../public/images2/pro3/2.jpg"
  },
  "/images2/pro3/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-4ck3aGzIY14ApJTyojiYl0r6IG0\"",
    "mtime": "2023-04-08T00:16:32.232Z",
    "size": 13716,
    "path": "../public/images2/pro3/27.jpg"
  },
  "/images2/pro3/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-LaUOxdaGvRjGtc157hwzulM/R2c\"",
    "mtime": "2023-04-08T00:16:32.232Z",
    "size": 13716,
    "path": "../public/images2/pro3/28.jpg"
  },
  "/images2/pro3/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-RltpPJJ3gu4Bdu7BaNeUz5Dwoug\"",
    "mtime": "2023-04-08T00:16:32.232Z",
    "size": 13716,
    "path": "../public/images2/pro3/33.jpg"
  },
  "/images2/pro3/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-0SdMjFei1atgswM+EiEdCmbp7gY\"",
    "mtime": "2023-04-08T00:16:32.232Z",
    "size": 13716,
    "path": "../public/images2/pro3/34.jpg"
  },
  "/images2/pro3/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-8KDUcczgT9dkreuyH4HPStrvs48\"",
    "mtime": "2023-04-08T00:16:32.229Z",
    "size": 13716,
    "path": "../public/images2/pro3/35.jpg"
  },
  "/images2/pro3/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-ujmPPMPo6mCV3wDoaIbxeCegojI\"",
    "mtime": "2023-04-08T00:16:32.229Z",
    "size": 13716,
    "path": "../public/images2/pro3/36.jpg"
  },
  "/images2/pro3/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-ujmPPMPo6mCV3wDoaIbxeCegojI\"",
    "mtime": "2023-04-08T00:16:32.229Z",
    "size": 13716,
    "path": "../public/images2/pro3/39.jpg"
  },
  "/images2/pro3/sm.jpg": {
    "type": "image/jpeg",
    "etag": "\"47e-zD45qKlnOA79EIlF4BPo/Cz0tRs\"",
    "mtime": "2023-04-08T00:16:32.229Z",
    "size": 1150,
    "path": "../public/images2/pro3/sm.jpg"
  },
  "/images2/shoes/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.229Z",
    "size": 603,
    "path": "../public/images2/shoes/1.jpg"
  },
  "/images2/shoes/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/10.jpg"
  },
  "/images2/shoes/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/11.jpg"
  },
  "/images2/shoes/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/12.jpg"
  },
  "/images2/shoes/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/2.jpg"
  },
  "/images2/shoes/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/3.jpg"
  },
  "/images2/shoes/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/4.jpg"
  },
  "/images2/shoes/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/5.jpg"
  },
  "/images2/shoes/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/6.jpg"
  },
  "/images2/shoes/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.225Z",
    "size": 603,
    "path": "../public/images2/shoes/7.jpg"
  },
  "/images2/shoes/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 603,
    "path": "../public/images2/shoes/8.jpg"
  },
  "/images2/shoes/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"25b-ymtxT80rkztFBWVBbiSvAKOnOUw\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 603,
    "path": "../public/images2/shoes/9.jpg"
  },
  "/images2/shoes/cat1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1739-ILWGDvPlMBTv8pTp6Triquyo+x4\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 5945,
    "path": "../public/images2/shoes/cat1.jpg"
  },
  "/images2/shoes/cat2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1739-ILWGDvPlMBTv8pTp6Triquyo+x4\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 5945,
    "path": "../public/images2/shoes/cat2.jpg"
  },
  "/images2/shoes/cat3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1739-ILWGDvPlMBTv8pTp6Triquyo+x4\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 5945,
    "path": "../public/images2/shoes/cat3.jpg"
  },
  "/images2/slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 3293,
    "path": "../public/images2/slider/1.jpg"
  },
  "/images2/slider/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.222Z",
    "size": 3293,
    "path": "../public/images2/slider/10.jpg"
  },
  "/images2/slider/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/11.jpg"
  },
  "/images2/slider/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/12.jpg"
  },
  "/images2/slider/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/13.jpg"
  },
  "/images2/slider/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/14.jpg"
  },
  "/images2/slider/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/15.jpg"
  },
  "/images2/slider/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/16.jpg"
  },
  "/images2/slider/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/17.jpg"
  },
  "/images2/slider/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/18.jpg"
  },
  "/images2/slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/2.jpg"
  },
  "/images2/slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.219Z",
    "size": 3293,
    "path": "../public/images2/slider/3.jpg"
  },
  "/images2/slider/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.215Z",
    "size": 3293,
    "path": "../public/images2/slider/4.jpg"
  },
  "/images2/slider/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.215Z",
    "size": 3293,
    "path": "../public/images2/slider/5.jpg"
  },
  "/images2/slider/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.215Z",
    "size": 3293,
    "path": "../public/images2/slider/6.jpg"
  },
  "/images2/slider/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.215Z",
    "size": 3293,
    "path": "../public/images2/slider/7.jpg"
  },
  "/images2/slider/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.215Z",
    "size": 3293,
    "path": "../public/images2/slider/8.jpg"
  },
  "/images2/slider/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.215Z",
    "size": 3293,
    "path": "../public/images2/slider/9.jpg"
  },
  "/images2/slider/slider1.jpg": {
    "type": "image/jpeg",
    "etag": "\"98b8-PPxUjioqF0pbR74PtJVh9NzzEKs\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 39096,
    "path": "../public/images2/slider/slider1.jpg"
  },
  "/images2/slider/slider2.jpg": {
    "type": "image/jpeg",
    "etag": "\"98b8-PPxUjioqF0pbR74PtJVh9NzzEKs\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 39096,
    "path": "../public/images2/slider/slider2.jpg"
  },
  "/images2/slider/slider3.jpg": {
    "type": "image/jpeg",
    "etag": "\"98b8-PPxUjioqF0pbR74PtJVh9NzzEKs\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 39096,
    "path": "../public/images2/slider/slider3.jpg"
  },
  "/images2/team/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:32.162Z",
    "size": 5579,
    "path": "../public/images2/team/1.jpg"
  },
  "/images2/team/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:32.162Z",
    "size": 5579,
    "path": "../public/images2/team/2.jpg"
  },
  "/images2/team/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:32.162Z",
    "size": 5579,
    "path": "../public/images2/team/3.jpg"
  },
  "/images2/team/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"15cb-nTatXMsnAfignVLaglI8M4xycAQ\"",
    "mtime": "2023-04-08T00:16:32.159Z",
    "size": 5579,
    "path": "../public/images2/team/4.jpg"
  },
  "/images2/tools/1.png": {
    "type": "image/png",
    "etag": "\"503-/Dh3iKk0W4lep/n0pxNnBaiaX5Y\"",
    "mtime": "2023-04-08T00:16:32.159Z",
    "size": 1283,
    "path": "../public/images2/tools/1.png"
  },
  "/images2/tools/3.png": {
    "type": "image/png",
    "etag": "\"482-GYv5xMb8Xuj8kECcjAYdHz524RQ\"",
    "mtime": "2023-04-08T00:16:32.159Z",
    "size": 1154,
    "path": "../public/images2/tools/3.png"
  },
  "/images2/tools/4.png": {
    "type": "image/png",
    "etag": "\"482-GYv5xMb8Xuj8kECcjAYdHz524RQ\"",
    "mtime": "2023-04-08T00:16:32.159Z",
    "size": 1154,
    "path": "../public/images2/tools/4.png"
  },
  "/images2/tools/banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"301a-+8I4fbyR4q+UOfv579sRT1lK6JA\"",
    "mtime": "2023-04-08T00:16:32.159Z",
    "size": 12314,
    "path": "../public/images2/tools/banner.jpg"
  },
  "/images2/tools/footer.jpg": {
    "type": "image/jpeg",
    "etag": "\"76fc-PH5X0Q+IiqxtiDTdM1X4IKLu/Bw\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 30460,
    "path": "../public/images2/tools/footer.jpg"
  },
  "/images2/vector-pattern/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"441e-trJ1PGASF/u/5Ck3wxIYjECDGF4\"",
    "mtime": "2023-04-08T00:16:32.142Z",
    "size": 17438,
    "path": "../public/images2/vector-pattern/1.jpg"
  },
  "/images2/vector-pattern/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"6038-U7YpYkVHZjbF4ALR1at5PdIKD28\"",
    "mtime": "2023-04-08T00:16:32.142Z",
    "size": 24632,
    "path": "../public/images2/vector-pattern/2.jpg"
  },
  "/images2/vector-pattern/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"330e-qiJ1dayScbfp99fD0EnX1FpIB08\"",
    "mtime": "2023-04-08T00:16:32.142Z",
    "size": 13070,
    "path": "../public/images2/vector-pattern/3.jpg"
  },
  "/images2/vector-pattern/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"56bb-JrkQnH1qgXsRrXLcAVrLYSb5chY\"",
    "mtime": "2023-04-08T00:16:32.142Z",
    "size": 22203,
    "path": "../public/images2/vector-pattern/4.jpg"
  },
  "/images2/vector-pattern/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2999-z70iU6m1FgefOcAe4FY+VEPkAKI\"",
    "mtime": "2023-04-08T00:16:32.142Z",
    "size": 10649,
    "path": "../public/images2/vector-pattern/5.jpg"
  },
  "/images2/vector-pattern/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"84ed-AnqXh2IlIW5Mk+IAptTjShk3Lts\"",
    "mtime": "2023-04-08T00:16:32.142Z",
    "size": 34029,
    "path": "../public/images2/vector-pattern/6.jpg"
  },
  "/images2/vendor/profile.jpg": {
    "type": "image/jpeg",
    "etag": "\"66a0-TqmtEpT3G9PFHwon0MNFCo6OOV0\"",
    "mtime": "2023-04-08T00:16:32.125Z",
    "size": 26272,
    "path": "../public/images2/vendor/profile.jpg"
  },
  "/images2/vendor/step-arrow.png": {
    "type": "image/png",
    "etag": "\"2248-UH3gPHDY4X8cjgH0VnpF9XfZUXU\"",
    "mtime": "2023-04-08T00:16:32.125Z",
    "size": 8776,
    "path": "../public/images2/vendor/step-arrow.png"
  },
  "/images2/watch/cat1.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:32.125Z",
    "size": 316,
    "path": "../public/images2/watch/cat1.png"
  },
  "/images2/watch/cat2.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:32.125Z",
    "size": 316,
    "path": "../public/images2/watch/cat2.png"
  },
  "/images2/watch/cat3.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:32.125Z",
    "size": 316,
    "path": "../public/images2/watch/cat3.png"
  },
  "/images2/watch/cat4.png": {
    "type": "image/png",
    "etag": "\"13c-BQGKQLgjrdufQg8c97jIzrm670A\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 316,
    "path": "../public/images2/watch/cat4.png"
  },
  "/images2/yoga/main-banner.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 32147,
    "path": "../public/images2/yoga/main-banner.jpg"
  },
  "/images/fashion/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 19906,
    "path": "../public/images/fashion/banner/1.jpg"
  },
  "/images/fashion/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 19906,
    "path": "../public/images/fashion/banner/2.jpg"
  },
  "/images/fashion/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 19906,
    "path": "../public/images/fashion/banner/3.jpg"
  },
  "/images/fashion/banner/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 14089,
    "path": "../public/images/fashion/banner/34.jpg"
  },
  "/images/fashion/banner/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:33.285Z",
    "size": 14089,
    "path": "../public/images/fashion/banner/35.jpg"
  },
  "/images/fashion/banner/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 14089,
    "path": "../public/images/fashion/banner/36.jpg"
  },
  "/images/fashion/banner/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 14089,
    "path": "../public/images/fashion/banner/37.jpg"
  },
  "/images/fashion/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 19906,
    "path": "../public/images/fashion/banner/4.jpg"
  },
  "/images/fashion/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 12069,
    "path": "../public/images/fashion/banner/5.jpg"
  },
  "/images/fashion/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 12069,
    "path": "../public/images/fashion/banner/6.jpg"
  },
  "/images/fashion/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 12069,
    "path": "../public/images/fashion/banner/7.jpg"
  },
  "/images/fashion/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 12069,
    "path": "../public/images/fashion/banner/8.jpg"
  },
  "/images/fashion/lookbook/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a40-xS3yDqg07PpIf/83v2Fh+8LQtBg\"",
    "mtime": "2023-04-08T00:16:33.282Z",
    "size": 27200,
    "path": "../public/images/fashion/lookbook/1.jpg"
  },
  "/images/fashion/lookbook/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 18831,
    "path": "../public/images/fashion/lookbook/10.jpg"
  },
  "/images/fashion/lookbook/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 20167,
    "path": "../public/images/fashion/lookbook/11.jpg"
  },
  "/images/fashion/lookbook/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 20167,
    "path": "../public/images/fashion/lookbook/12.jpg"
  },
  "/images/fashion/lookbook/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 18831,
    "path": "../public/images/fashion/lookbook/13.jpg"
  },
  "/images/fashion/lookbook/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 20167,
    "path": "../public/images/fashion/lookbook/2.jpg"
  },
  "/images/fashion/lookbook/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"6d5e-1Q3c4f4cn15iJGEG0iP7lPUn9g4\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 27998,
    "path": "../public/images/fashion/lookbook/3.jpg"
  },
  "/images/fashion/lookbook/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a40-xS3yDqg07PpIf/83v2Fh+8LQtBg\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 27200,
    "path": "../public/images/fashion/lookbook/4.jpg"
  },
  "/images/fashion/lookbook/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 18831,
    "path": "../public/images/fashion/lookbook/5.jpg"
  },
  "/images/fashion/lookbook/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a40-xS3yDqg07PpIf/83v2Fh+8LQtBg\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 27200,
    "path": "../public/images/fashion/lookbook/6.jpg"
  },
  "/images/fashion/lookbook/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:33.279Z",
    "size": 18831,
    "path": "../public/images/fashion/lookbook/7.jpg"
  },
  "/images/fashion/lookbook/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 18831,
    "path": "../public/images/fashion/lookbook/8.jpg"
  },
  "/images/fashion/lookbook/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 18831,
    "path": "../public/images/fashion/lookbook/9.jpg"
  },
  "/images/fashion/lookbook/men.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 20167,
    "path": "../public/images/fashion/lookbook/men.jpg"
  },
  "/images/fashion/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-5KpGdO9o4z0TDouV8R9fqK1KtAE\"",
    "mtime": "2023-04-08T00:16:33.275Z",
    "size": 16273,
    "path": "../public/images/fashion/pro/1.jpg"
  },
  "/images/gym/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"25c1-K422snicJVxL/AUIRPNp6pDle0E\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 9665,
    "path": "../public/images/gym/banner/1.jpg"
  },
  "/images/gym/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc8-ofpmTBIwV1SXfckUbfql+b7BGL0\"",
    "mtime": "2023-04-08T00:16:33.249Z",
    "size": 19912,
    "path": "../public/images/gym/banner/2.jpg"
  },
  "/images/icon/category/camera.png": {
    "type": "image/png",
    "etag": "\"39c-PUma4GO2YieeuIgVV5Q/auDjHQ8\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 924,
    "path": "../public/images/icon/category/camera.png"
  },
  "/images/icon/category/cat1.png": {
    "type": "image/png",
    "etag": "\"534-SRbX3/flnj0GAQn/iKBdFHPUjB4\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1332,
    "path": "../public/images/icon/category/cat1.png"
  },
  "/images/icon/category/cat2.png": {
    "type": "image/png",
    "etag": "\"59f-cysdkOQf39Bw4QKVldLFBCOD7og\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1439,
    "path": "../public/images/icon/category/cat2.png"
  },
  "/images/icon/category/cat3.png": {
    "type": "image/png",
    "etag": "\"54e-4fpRWeG+BhUkFVKyOXWJSWPhoRs\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1358,
    "path": "../public/images/icon/category/cat3.png"
  },
  "/images/icon/category/cat4.png": {
    "type": "image/png",
    "etag": "\"5f8-SPm4cGommTFNhGK1OrHZO+35k7I\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1528,
    "path": "../public/images/icon/category/cat4.png"
  },
  "/images/icon/category/cat5.png": {
    "type": "image/png",
    "etag": "\"61e-2/dkoM/rUNj/Wa9CmG4BwyW/BfQ\"",
    "mtime": "2023-04-08T00:16:33.229Z",
    "size": 1566,
    "path": "../public/images/icon/category/cat5.png"
  },
  "/images/icon/category/cat6.png": {
    "type": "image/png",
    "etag": "\"58d-t1AlVHwtj79p5LPU4ZWCWU/JR2A\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 1421,
    "path": "../public/images/icon/category/cat6.png"
  },
  "/images/icon/category/cat7.png": {
    "type": "image/png",
    "etag": "\"5e9-pj4o6PiDm1LZhix2LG0k/XJXKis\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 1513,
    "path": "../public/images/icon/category/cat7.png"
  },
  "/images/icon/category/demo1.png": {
    "type": "image/png",
    "etag": "\"468-ZnN60DlPdQ2QeQqwlCmlw+QJ6DM\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 1128,
    "path": "../public/images/icon/category/demo1.png"
  },
  "/images/icon/category/diamond.png": {
    "type": "image/png",
    "etag": "\"3ef-8ZWGgmafLI5AzJcCsY5cgji2+oA\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 1007,
    "path": "../public/images/icon/category/diamond.png"
  },
  "/images/icon/category/gym.png": {
    "type": "image/png",
    "etag": "\"2b3-oR0uRBmnQZx+n6qMH81cS620JG0\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 691,
    "path": "../public/images/icon/category/gym.png"
  },
  "/images/icon/category/joint.png": {
    "type": "image/png",
    "etag": "\"2d6-JLgtHX9oVF0Nqs7NNJdr6PsrP/g\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 726,
    "path": "../public/images/icon/category/joint.png"
  },
  "/images/icon/category/running.png": {
    "type": "image/png",
    "etag": "\"34b-6bjMM3f1XdQg2QtXYeKtyDuSJUU\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 843,
    "path": "../public/images/icon/category/running.png"
  },
  "/images/icon/category/tools.png": {
    "type": "image/png",
    "etag": "\"3da-CpNP2DFJsac8JXRaT5bnofm1eMU\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 986,
    "path": "../public/images/icon/category/tools.png"
  },
  "/images/icon/category/watch.png": {
    "type": "image/png",
    "etag": "\"289-2+T+SQsKQ3Mg9HCGuEfiSXKDnf0\"",
    "mtime": "2023-04-08T00:16:33.225Z",
    "size": 649,
    "path": "../public/images/icon/category/watch.png"
  },
  "/images/icon/layout2/Untitled-1.png": {
    "type": "image/png",
    "etag": "\"426-C0erkxiOb2j1oVD7D6rjHIyBzkE\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 1062,
    "path": "../public/images/icon/layout2/Untitled-1.png"
  },
  "/images/icon/layout2/add-to-cart.png": {
    "type": "image/png",
    "etag": "\"57c-5nhxDUHQW2D/+IPzhfUATip9Jx8\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 1404,
    "path": "../public/images/icon/layout2/add-to-cart.png"
  },
  "/images/icon/layout2/add-to-wishlist.png": {
    "type": "image/png",
    "etag": "\"510-d8a6CqVqXke3EM9W5nkzyTGUXP8\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 1296,
    "path": "../public/images/icon/layout2/add-to-wishlist.png"
  },
  "/images/icon/layout2/bar.jpg": {
    "type": "image/jpeg",
    "etag": "\"55a-9vR0seiJtEZ6lPKpNUV9otDaH4M\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 1370,
    "path": "../public/images/icon/layout2/bar.jpg"
  },
  "/images/icon/layout2/bar.png": {
    "type": "image/png",
    "etag": "\"424-etVbJ8cf9Gd1F8JVin35wY0h/B8\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 1060,
    "path": "../public/images/icon/layout2/bar.png"
  },
  "/images/icon/layout2/call.jpg": {
    "type": "image/jpeg",
    "etag": "\"517-1RitwfVUzlLjCaMUSDoQKegZSkU\"",
    "mtime": "2023-04-08T00:16:33.222Z",
    "size": 1303,
    "path": "../public/images/icon/layout2/call.jpg"
  },
  "/images/icon/layout2/call.png": {
    "type": "image/png",
    "etag": "\"44c-rJP2kIbHJSYZh05gVgaUygU6nHw\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1100,
    "path": "../public/images/icon/layout2/call.png"
  },
  "/images/icon/layout2/cart.png": {
    "type": "image/png",
    "etag": "\"590-PeYSu3mAc6yg5i7JTnZ3K0b/1PA\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1424,
    "path": "../public/images/icon/layout2/cart.png"
  },
  "/images/icon/layout2/favicon.png": {
    "type": "image/png",
    "etag": "\"181-wfRvpnAH1IetyEgVJgU/H40SDOA\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 385,
    "path": "../public/images/icon/layout2/favicon.png"
  },
  "/images/icon/layout2/logo.png": {
    "type": "image/png",
    "etag": "\"8ca-BNJoXDjNpI4MMiwWWIJNGlSUYII\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 2250,
    "path": "../public/images/icon/layout2/logo.png"
  },
  "/images/icon/layout2/search.png": {
    "type": "image/png",
    "etag": "\"53e-bSzFxzyaIrj/UK9KejDToGB9cqM\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1342,
    "path": "../public/images/icon/layout2/search.png"
  },
  "/images/icon/layout2/service1.png": {
    "type": "image/png",
    "etag": "\"442-cs9Ca2y3h5ojrG6QPgSjxhAoQs4\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1090,
    "path": "../public/images/icon/layout2/service1.png"
  },
  "/images/icon/layout2/service2.png": {
    "type": "image/png",
    "etag": "\"5c3-A4cE8JjYjROVjT9evKtGda3KUg4\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1475,
    "path": "../public/images/icon/layout2/service2.png"
  },
  "/images/icon/layout2/service3.png": {
    "type": "image/png",
    "etag": "\"6b2-t2Aax2GDkysMaa1g7T/MuUIwqXk\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1714,
    "path": "../public/images/icon/layout2/service3.png"
  },
  "/images/icon/layout2/setting.png": {
    "type": "image/png",
    "etag": "\"689-Voa2kLagiesyMDhUMmlKwSPw6c0\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1673,
    "path": "../public/images/icon/layout2/setting.png"
  },
  "/images/icon/layout2/user.jpg": {
    "type": "image/jpeg",
    "etag": "\"522-nYRXgIPDGJAc/ylR3ZZ5JuCiim8\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1314,
    "path": "../public/images/icon/layout2/user.jpg"
  },
  "/images/icon/layout2/user.png": {
    "type": "image/png",
    "etag": "\"458-GxS6SNGYg9yBsFE74xStUyGSoOw\"",
    "mtime": "2023-04-08T00:16:33.219Z",
    "size": 1112,
    "path": "../public/images/icon/layout2/user.png"
  },
  "/images/icon/layout2/wishlist.jpg": {
    "type": "image/jpeg",
    "etag": "\"530-fFXMTOJnYl+8ERaQ160tDreL/RE\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 1328,
    "path": "../public/images/icon/layout2/wishlist.jpg"
  },
  "/images/icon/layout2/wishlist.png": {
    "type": "image/png",
    "etag": "\"445-WWAnAof+avJgrnHumi7+LJxzuqE\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 1093,
    "path": "../public/images/icon/layout2/wishlist.png"
  },
  "/images/icon/layout2/zoom.png": {
    "type": "image/png",
    "etag": "\"510-Rl+Ox/NZe2GSI8jeCK3JsFsW524\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 1296,
    "path": "../public/images/icon/layout2/zoom.png"
  },
  "/images/icon/layout3/favicon.png": {
    "type": "image/png",
    "etag": "\"181-BVHQGrJdVasJ7mBxqnAA/+cTGJ0\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 385,
    "path": "../public/images/icon/layout3/favicon.png"
  },
  "/images/icon/layout3/footerlogo.png": {
    "type": "image/png",
    "etag": "\"898-gj1UYDMmLSlB3USsoSH36ZjKsbU\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 2200,
    "path": "../public/images/icon/layout3/footerlogo.png"
  },
  "/images/icon/layout3/logo.png": {
    "type": "image/png",
    "etag": "\"8d3-CV8GAKhhsAhJWiifNXT9YorbWnw\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 2259,
    "path": "../public/images/icon/layout3/logo.png"
  },
  "/images/icon/layout3/service1.png": {
    "type": "image/png",
    "etag": "\"440-ls9ZmkbpN/Ix6NtQ1hBoqw6h9z0\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 1088,
    "path": "../public/images/icon/layout3/service1.png"
  },
  "/images/icon/layout3/service2.png": {
    "type": "image/png",
    "etag": "\"60f-s/wv35J0j2QLaptNZS4uNXyBOoM\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 1551,
    "path": "../public/images/icon/layout3/service2.png"
  },
  "/images/icon/layout3/service3.png": {
    "type": "image/png",
    "etag": "\"6b0-byrqwV1IlgyReXUjzcIs2Ur2pQ8\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 1712,
    "path": "../public/images/icon/layout3/service3.png"
  },
  "/images/icon/layout3/service4.png": {
    "type": "image/png",
    "etag": "\"2ce-wsbfHyZDrdPk0RWTYSt8+YvybaI\"",
    "mtime": "2023-04-08T00:16:33.215Z",
    "size": 718,
    "path": "../public/images/icon/layout3/service4.png"
  },
  "/images/icon/layout4/cart.png": {
    "type": "image/png",
    "etag": "\"58e-ccWQlopECCk3gCl9zRtjMAyDnGE\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 1422,
    "path": "../public/images/icon/layout4/cart.png"
  },
  "/images/icon/layout4/favicon.png": {
    "type": "image/png",
    "etag": "\"181-sZk0+lCWYljaxuCYDDDoTORtXUI\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 385,
    "path": "../public/images/icon/layout4/favicon.png"
  },
  "/images/icon/layout4/footerlogo.png": {
    "type": "image/png",
    "etag": "\"4ad-MiZIhTdaI0qQN7Odj4RSGuzN8/I\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 1197,
    "path": "../public/images/icon/layout4/footerlogo.png"
  },
  "/images/icon/layout4/logo.png": {
    "type": "image/png",
    "etag": "\"8d4-tDV/NeGXXVH3iG1x+5aDL2GMUgY\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 2260,
    "path": "../public/images/icon/layout4/logo.png"
  },
  "/images/icon/layout4/search.png": {
    "type": "image/png",
    "etag": "\"549-6IEqurZ8mk4skx+8ugI5MXhB2JI\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 1353,
    "path": "../public/images/icon/layout4/search.png"
  },
  "/images/icon/layout4/service1.png": {
    "type": "image/png",
    "etag": "\"442-BPBT/RfKA87OlBDNWwL9UFRqLmQ\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 1090,
    "path": "../public/images/icon/layout4/service1.png"
  },
  "/images/icon/layout4/service2.png": {
    "type": "image/png",
    "etag": "\"5c3-UO4Kvl/8p6ZvuxDo2q3Bhp7TYz8\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 1475,
    "path": "../public/images/icon/layout4/service2.png"
  },
  "/images/icon/layout4/service3.png": {
    "type": "image/png",
    "etag": "\"624-9thQeylN36G+ETXlMW8EBC1MCv4\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 1572,
    "path": "../public/images/icon/layout4/service3.png"
  },
  "/images/icon/layout4/service4.png": {
    "type": "image/png",
    "etag": "\"2c9-mvJTcp0CcGZKGxOWpGJWT423krI\"",
    "mtime": "2023-04-08T00:16:33.212Z",
    "size": 713,
    "path": "../public/images/icon/layout4/service4.png"
  },
  "/images/icon/layout4/setting.png": {
    "type": "image/png",
    "etag": "\"689-qkgOVWKcsclPV8Z45U2auZaJ3Lc\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 1673,
    "path": "../public/images/icon/layout4/setting.png"
  },
  "/images/icon/layout5/footer-logo.png": {
    "type": "image/png",
    "etag": "\"64f-qSHz/R5+GCl4Fpc8hxwrq/QEzJA\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 1615,
    "path": "../public/images/icon/layout5/footer-logo.png"
  },
  "/images/icon/layout5/logo.png": {
    "type": "image/png",
    "etag": "\"4d7-g86Ny9uaALuZwpgORgPr3p87xrQ\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 1239,
    "path": "../public/images/icon/layout5/logo.png"
  },
  "/images/icon/logo/1.png": {
    "type": "image/png",
    "etag": "\"8f5-hCOksQWorbjE3M9wdrSrlaVB+Xw\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 2293,
    "path": "../public/images/icon/logo/1.png"
  },
  "/images/icon/logo/10.png": {
    "type": "image/png",
    "etag": "\"572-RMxcktgZte4PcJK45Sij+QDAFdY\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 1394,
    "path": "../public/images/icon/logo/10.png"
  },
  "/images/icon/logo/11.png": {
    "type": "image/png",
    "etag": "\"8d1-LIGVul5rb9ueNM2Z68pTj9isNek\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 2257,
    "path": "../public/images/icon/logo/11.png"
  },
  "/images/icon/logo/12 - Copy.png": {
    "type": "image/png",
    "etag": "\"8b8-l4hOXwoWSOS75V1s59206KSYTMQ\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 2232,
    "path": "../public/images/icon/logo/12 - Copy.png"
  },
  "/images/icon/logo/12.png": {
    "type": "image/png",
    "etag": "\"8b8-l4hOXwoWSOS75V1s59206KSYTMQ\"",
    "mtime": "2023-04-08T00:16:33.209Z",
    "size": 2232,
    "path": "../public/images/icon/logo/12.png"
  },
  "/images/icon/logo/13.png": {
    "type": "image/png",
    "etag": "\"9b4-+K9mQyg5gPIZHRmotzymiG1Fa9A\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2484,
    "path": "../public/images/icon/logo/13.png"
  },
  "/images/icon/logo/14.png": {
    "type": "image/png",
    "etag": "\"97b-8MqNLDFUfoUWA1AUV0L00VyZ6vE\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2427,
    "path": "../public/images/icon/logo/14.png"
  },
  "/images/icon/logo/15.png": {
    "type": "image/png",
    "etag": "\"ccc-tXeROWRxMYZJO7aC8a6g2kwGKWo\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 3276,
    "path": "../public/images/icon/logo/15.png"
  },
  "/images/icon/logo/16.png": {
    "type": "image/png",
    "etag": "\"9bb-Ylw/PngDo4BdBNZ+v231WXNXAB8\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2491,
    "path": "../public/images/icon/logo/16.png"
  },
  "/images/icon/logo/17.png": {
    "type": "image/png",
    "etag": "\"913-gFM28KDiJxMq4lzddpP2D8iTgYY\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2323,
    "path": "../public/images/icon/logo/17.png"
  },
  "/images/icon/logo/2.png": {
    "type": "image/png",
    "etag": "\"8f4-MIebCPgUFpiD4Bouphq1F0PqNX0\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2292,
    "path": "../public/images/icon/logo/2.png"
  },
  "/images/icon/logo/3.png": {
    "type": "image/png",
    "etag": "\"8e4-7ZrQaKH1wBEm7KltURvj3Q+QWcg\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2276,
    "path": "../public/images/icon/logo/3.png"
  },
  "/images/icon/logo/4.png": {
    "type": "image/png",
    "etag": "\"8ed-6oXsD2/gMyVQwZIWgRXScSPvyoE\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2285,
    "path": "../public/images/icon/logo/4.png"
  },
  "/images/icon/logo/5.png": {
    "type": "image/png",
    "etag": "\"8f7-nO+m4m/ZTQFsCRDgxSLMsnwlPQw\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2295,
    "path": "../public/images/icon/logo/5.png"
  },
  "/images/icon/logo/6.png": {
    "type": "image/png",
    "etag": "\"8f3-eOptPDSysQOHmL/n4FdOhxm+jwY\"",
    "mtime": "2023-04-08T00:16:33.205Z",
    "size": 2291,
    "path": "../public/images/icon/logo/6.png"
  },
  "/images/icon/logo/7.png": {
    "type": "image/png",
    "etag": "\"8f1-77VkT+mv/PiuB7u/q6SFYEjU8M8\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2289,
    "path": "../public/images/icon/logo/7.png"
  },
  "/images/icon/logo/8.png": {
    "type": "image/png",
    "etag": "\"8e9-XG73ttqD/KwPmJ5YO7W7tNCCB78\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2281,
    "path": "../public/images/icon/logo/8.png"
  },
  "/images/icon/logo/9.png": {
    "type": "image/png",
    "etag": "\"8da-3BnRDDW3K0/vpYHkyhN/cb+PUt4\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2266,
    "path": "../public/images/icon/logo/9.png"
  },
  "/images/icon/logo/dfh.png": {
    "type": "image/png",
    "etag": "\"8ea-7Mh8vl7ZynrfVg63clFev8koLZQ\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2282,
    "path": "../public/images/icon/logo/dfh.png"
  },
  "/images/icon/logo/f1.png": {
    "type": "image/png",
    "etag": "\"895-kLg3gQuEUrCwZyCqyWesOIahmE8\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2197,
    "path": "../public/images/icon/logo/f1.png"
  },
  "/images/icon/logo/f2.png": {
    "type": "image/png",
    "etag": "\"893-7PdzFW9cSHduXOmmf3r6n9RZHMU\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2195,
    "path": "../public/images/icon/logo/f2.png"
  },
  "/images/icon/logo/f3.png": {
    "type": "image/png",
    "etag": "\"885-TrnEq92zApH/b22VMIs8PHW2EE4\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2181,
    "path": "../public/images/icon/logo/f3.png"
  },
  "/images/icon/logo/f4.png": {
    "type": "image/png",
    "etag": "\"9cd-8gUYb+YxaaJBTyF8juOU3j0/iA0\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2509,
    "path": "../public/images/icon/logo/f4.png"
  },
  "/images/icon/logo/f5.png": {
    "type": "image/png",
    "etag": "\"9d9-uAIsogW0ppasmjBoe79Zj3KYxcw\"",
    "mtime": "2023-04-08T00:16:33.202Z",
    "size": 2521,
    "path": "../public/images/icon/logo/f5.png"
  },
  "/images/jewellery/icon/avatar.png": {
    "type": "image/png",
    "etag": "\"2f8-3s0X2uC7qHcKB19hNh/yRTJssbw\"",
    "mtime": "2023-04-08T00:16:33.182Z",
    "size": 760,
    "path": "../public/images/jewellery/icon/avatar.png"
  },
  "/images/jewellery/icon/cart.png": {
    "type": "image/png",
    "etag": "\"243-GvyN4Mwf8CsnP3yG8+A6pak+W40\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 579,
    "path": "../public/images/jewellery/icon/cart.png"
  },
  "/images/jewellery/icon/cat-1.svg": {
    "type": "image/svg+xml",
    "etag": "\"1657-Z70/zpjaO6qmjQ3O7uzaSKyu2lU\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 5719,
    "path": "../public/images/jewellery/icon/cat-1.svg"
  },
  "/images/jewellery/icon/cat-2.svg": {
    "type": "image/svg+xml",
    "etag": "\"2602-N4c6fc8Mgl8tmOO14wGq/iLQyZM\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 9730,
    "path": "../public/images/jewellery/icon/cat-2.svg"
  },
  "/images/jewellery/icon/cat-3.svg": {
    "type": "image/svg+xml",
    "etag": "\"2897-WwctKYx3a23xdKuJWka0Bj3rYB8\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 10391,
    "path": "../public/images/jewellery/icon/cat-3.svg"
  },
  "/images/jewellery/icon/cat-4.svg": {
    "type": "image/svg+xml",
    "etag": "\"1d2a-0ezT3z1gJsJs1rdQETLqbDd/v8I\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 7466,
    "path": "../public/images/jewellery/icon/cat-4.svg"
  },
  "/images/jewellery/icon/cat-5.svg": {
    "type": "image/svg+xml",
    "etag": "\"200a-RgDL6zgmzgEZzGp1u8q10ay/VbQ\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 8202,
    "path": "../public/images/jewellery/icon/cat-5.svg"
  },
  "/images/jewellery/icon/cat-6.svg": {
    "type": "image/svg+xml",
    "etag": "\"1531-S3DQ2LnvfDGPSUG1jEKfAvFV21w\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 5425,
    "path": "../public/images/jewellery/icon/cat-6.svg"
  },
  "/images/jewellery/icon/cat-7.svg": {
    "type": "image/svg+xml",
    "etag": "\"c13-rKgl4s7JwOj/UNGgqYHB1Yti2IY\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 3091,
    "path": "../public/images/jewellery/icon/cat-7.svg"
  },
  "/images/jewellery/icon/cb.png": {
    "type": "image/png",
    "etag": "\"292-Qxi+Qfir63D34I/tiJRRHJsTb0s\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 658,
    "path": "../public/images/jewellery/icon/cb.png"
  },
  "/images/jewellery/icon/controls.png": {
    "type": "image/png",
    "etag": "\"218-TT5xXPEjTZuF+MxdvQWxLurg/tc\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 536,
    "path": "../public/images/jewellery/icon/controls.png"
  },
  "/images/jewellery/icon/heart.png": {
    "type": "image/png",
    "etag": "\"2c0-G8YG+wu/dKIGPOdy2OMEJor6alk\"",
    "mtime": "2023-04-08T00:16:33.179Z",
    "size": 704,
    "path": "../public/images/jewellery/icon/heart.png"
  },
  "/images/jewellery/icon/search.png": {
    "type": "image/png",
    "etag": "\"27a-17E13g8/JrCcV40SRCpO5girENs\"",
    "mtime": "2023-04-08T00:16:33.175Z",
    "size": 634,
    "path": "../public/images/jewellery/icon/search.png"
  },
  "/images/pets/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 4724,
    "path": "../public/images/pets/banner/1.jpg"
  },
  "/images/pets/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 4724,
    "path": "../public/images/pets/banner/2.jpg"
  },
  "/images/pets/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 4724,
    "path": "../public/images/pets/banner/3.jpg"
  },
  "/images/pets/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 4724,
    "path": "../public/images/pets/banner/4.jpg"
  },
  "/images/pets/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 4724,
    "path": "../public/images/pets/banner/5.jpg"
  },
  "/images/pets/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 4724,
    "path": "../public/images/pets/banner/6.jpg"
  },
  "/images/portfolio/grid/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/1.jpg"
  },
  "/images/portfolio/grid/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/2.jpg"
  },
  "/images/portfolio/grid/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.152Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/3.jpg"
  },
  "/images/portfolio/grid/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/4.jpg"
  },
  "/images/portfolio/grid/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/5.jpg"
  },
  "/images/portfolio/grid/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/6.jpg"
  },
  "/images/portfolio/grid/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/7.jpg"
  },
  "/images/portfolio/grid/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 8422,
    "path": "../public/images/portfolio/grid/8.jpg"
  },
  "/images/portfolio/metro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 4885,
    "path": "../public/images/portfolio/metro/1.jpg"
  },
  "/images/portfolio/metro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"127f-7qpVAIaeI2CVny11XJ4dZNbyx6I\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 4735,
    "path": "../public/images/portfolio/metro/10.jpg"
  },
  "/images/portfolio/metro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"fb9-hateo7X9TjG1dcoaE+SI6aJmwVM\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 4025,
    "path": "../public/images/portfolio/metro/11.jpg"
  },
  "/images/portfolio/metro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"fcb-SivqMC4DIo6FHfW2aiI2MP3NS6o\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 4043,
    "path": "../public/images/portfolio/metro/12.jpg"
  },
  "/images/portfolio/metro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"e22-OtsvoW/eRm3XpUAurkmqaNIyquE\"",
    "mtime": "2023-04-08T00:16:33.149Z",
    "size": 3618,
    "path": "../public/images/portfolio/metro/13.jpg"
  },
  "/images/portfolio/metro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"d9d-DOHB7gd9SoZ9JyjRDWI/O0XPCOk\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 3485,
    "path": "../public/images/portfolio/metro/14.jpg"
  },
  "/images/portfolio/metro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"ffe-97OxdVfdtKY5F76C1DmJZU8gOsw\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 4094,
    "path": "../public/images/portfolio/metro/15.jpg"
  },
  "/images/portfolio/metro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"e9a-PYjcYDvQKPvF4SALJ7avjOKrIUU\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 3738,
    "path": "../public/images/portfolio/metro/16.jpg"
  },
  "/images/portfolio/metro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"1759-YpVAK9ijwiG+cee07SGsZa733IY\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 5977,
    "path": "../public/images/portfolio/metro/17.jpg"
  },
  "/images/portfolio/metro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1759-YpVAK9ijwiG+cee07SGsZa733IY\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 5977,
    "path": "../public/images/portfolio/metro/18.jpg"
  },
  "/images/portfolio/metro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"1759-YpVAK9ijwiG+cee07SGsZa733IY\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 5977,
    "path": "../public/images/portfolio/metro/19.jpg"
  },
  "/images/portfolio/metro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"e94-UGaW6jFt8o78GItszQ7QqM0yGJE\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 3732,
    "path": "../public/images/portfolio/metro/2.jpg"
  },
  "/images/portfolio/metro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"a09-vqychTojorC12DLV08/H0br2Y+Q\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 2569,
    "path": "../public/images/portfolio/metro/20.jpg"
  },
  "/images/portfolio/metro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"df7-SK55aGxG+5bIzrph30VKlPLvS0M\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 3575,
    "path": "../public/images/portfolio/metro/3.jpg"
  },
  "/images/portfolio/metro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"12ad-RsI8QHlHN2eLADs80Qt5vSmNksg\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 4781,
    "path": "../public/images/portfolio/metro/4.jpg"
  },
  "/images/portfolio/metro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"11a4-BJXv97Q8e6er47gKP8Q9YfIMSSI\"",
    "mtime": "2023-04-08T00:16:33.145Z",
    "size": 4516,
    "path": "../public/images/portfolio/metro/5.jpg"
  },
  "/images/portfolio/metro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1206-76uRllCAjPJePFMzk7mMy+7mP8w\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 4614,
    "path": "../public/images/portfolio/metro/6.jpg"
  },
  "/images/portfolio/metro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"12bc-WB7cnBjvoZLJdXql4dcWwBgoLmY\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 4796,
    "path": "../public/images/portfolio/metro/7.jpg"
  },
  "/images/portfolio/metro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"e9a-PYjcYDvQKPvF4SALJ7avjOKrIUU\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 3738,
    "path": "../public/images/portfolio/metro/8.jpg"
  },
  "/images/portfolio/metro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"e22-OtsvoW/eRm3XpUAurkmqaNIyquE\"",
    "mtime": "2023-04-08T00:16:33.142Z",
    "size": 3618,
    "path": "../public/images/portfolio/metro/9.jpg"
  },
  "/images/tools/category/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 50807,
    "path": "../public/images/tools/category/1.jpg"
  },
  "/images/tools/category/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 50807,
    "path": "../public/images/tools/category/2.jpg"
  },
  "/images/tools/category/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 50807,
    "path": "../public/images/tools/category/3.jpg"
  },
  "/images/tools/category/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 50807,
    "path": "../public/images/tools/category/4.jpg"
  },
  "/images/tools/category/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:33.129Z",
    "size": 50807,
    "path": "../public/images/tools/category/5.jpg"
  },
  "/images2/beauty/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.112Z",
    "size": 16688,
    "path": "../public/images2/beauty/blog/1.jpg"
  },
  "/images2/beauty/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 16688,
    "path": "../public/images2/beauty/blog/2.jpg"
  },
  "/images2/beauty/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 16688,
    "path": "../public/images2/beauty/blog/3.jpg"
  },
  "/images2/beauty/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 16688,
    "path": "../public/images2/beauty/blog/4.jpg"
  },
  "/images2/beauty/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-mvIp7jYDy03rjZJiDWBJPm2yI2o\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/1.jpg"
  },
  "/images2/beauty/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-rKPeHwAd4SjopYrYkd0Wa+Q8qXI\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/10.jpg"
  },
  "/images2/beauty/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-TKlYK8OxOwIHFhNvgxXp0tZyjos\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/11.jpg"
  },
  "/images2/beauty/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-iRoDaQ9QRT8WeY2RX3LejvqvbQ4\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/2.jpg"
  },
  "/images2/beauty/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-EzSG4hYX0N0ipwUU66v6yu+EGvs\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/3.jpg"
  },
  "/images2/beauty/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-mZDOGrLdrE+/bp/ERcnKOaQR+wg\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/4.jpg"
  },
  "/images2/beauty/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-GcZKviNpqYxRdoCchvlJfOfJyiQ\"",
    "mtime": "2023-04-08T00:16:33.109Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/5.jpg"
  },
  "/images2/beauty/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-pQoqBURcuJnQH8+5VeplPv9dhZ4\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/6.jpg"
  },
  "/images2/beauty/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-Y9WKhJiFjeBNBOTu6p+a9rn3oK0\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/7.jpg"
  },
  "/images2/beauty/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-THbiaWyJmvYjPb0thuB6tyQLP9M\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/8.jpg"
  },
  "/images2/beauty/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"3594-zLJwepHBCa1h3ZvSguNWlLp0HLo\"",
    "mtime": "2023-04-08T00:16:33.105Z",
    "size": 13716,
    "path": "../public/images2/beauty/pro/9.jpg"
  },
  "/images2/bicycle/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d7d-7q+5lT+uSjSu9MkmLVRt/+3UtzQ\"",
    "mtime": "2023-04-08T00:16:33.102Z",
    "size": 11645,
    "path": "../public/images2/bicycle/banner/1.jpg"
  },
  "/images2/bicycle/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d7d-7q+5lT+uSjSu9MkmLVRt/+3UtzQ\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 11645,
    "path": "../public/images2/bicycle/banner/2.jpg"
  },
  "/images2/bicycle/home-slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7dd0-fw23KhQ+cNFqAzJ+f5QXTdLtc0M\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 32208,
    "path": "../public/images2/bicycle/home-slider/1.jpg"
  },
  "/images2/bicycle/home-slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"7dd0-fw23KhQ+cNFqAzJ+f5QXTdLtc0M\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 32208,
    "path": "../public/images2/bicycle/home-slider/2.jpg"
  },
  "/images2/bicycle/insta/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"c8b-9pIWGz1X8iNALxiAyuFIwh0AY4A\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 3211,
    "path": "../public/images2/bicycle/insta/1.jpg"
  },
  "/images2/bicycle/insta/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"c8b-9pIWGz1X8iNALxiAyuFIwh0AY4A\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 3211,
    "path": "../public/images2/bicycle/insta/2.jpg"
  },
  "/images2/bicycle/insta/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c8b-9pIWGz1X8iNALxiAyuFIwh0AY4A\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 3211,
    "path": "../public/images2/bicycle/insta/3.jpg"
  },
  "/images2/bicycle/insta/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"c8b-9pIWGz1X8iNALxiAyuFIwh0AY4A\"",
    "mtime": "2023-04-08T00:16:33.099Z",
    "size": 3211,
    "path": "../public/images2/bicycle/insta/4.jpg"
  },
  "/images2/bicycle/insta/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"c8b-9pIWGz1X8iNALxiAyuFIwh0AY4A\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 3211,
    "path": "../public/images2/bicycle/insta/5.jpg"
  },
  "/images2/bicycle/insta/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"c8b-9pIWGz1X8iNALxiAyuFIwh0AY4A\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 3211,
    "path": "../public/images2/bicycle/insta/6.jpg"
  },
  "/images2/bicycle/parts/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"214-c7yU11gPinaJ+kQZrT87/asGrv4\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 532,
    "path": "../public/images2/bicycle/parts/1.jpg"
  },
  "/images2/bicycle/parts/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"214-c7yU11gPinaJ+kQZrT87/asGrv4\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 532,
    "path": "../public/images2/bicycle/parts/2.jpg"
  },
  "/images2/bicycle/parts/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"214-c7yU11gPinaJ+kQZrT87/asGrv4\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 532,
    "path": "../public/images2/bicycle/parts/3.jpg"
  },
  "/images2/bicycle/parts/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"214-c7yU11gPinaJ+kQZrT87/asGrv4\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 532,
    "path": "../public/images2/bicycle/parts/4.jpg"
  },
  "/images2/bicycle/parts/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"214-c7yU11gPinaJ+kQZrT87/asGrv4\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 532,
    "path": "../public/images2/bicycle/parts/5.jpg"
  },
  "/images2/bicycle/parts/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"214-c7yU11gPinaJ+kQZrT87/asGrv4\"",
    "mtime": "2023-04-08T00:16:33.095Z",
    "size": 532,
    "path": "../public/images2/bicycle/parts/6.jpg"
  },
  "/images2/blog/fashion/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.092Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/1.jpg"
  },
  "/images2/blog/fashion/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/2.jpg"
  },
  "/images2/blog/fashion/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/3.jpg"
  },
  "/images2/blog/fashion/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/4.jpg"
  },
  "/images2/blog/fashion/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/5.jpg"
  },
  "/images2/blog/fashion/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/6.jpg"
  },
  "/images2/blog/fashion/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/7.jpg"
  },
  "/images2/blog/fashion/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/fashion/8.jpg"
  },
  "/images2/blog/layout2/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/layout2/1.jpg"
  },
  "/images2/blog/layout2/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/layout2/2.jpg"
  },
  "/images2/blog/layout2/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/layout2/3.jpg"
  },
  "/images2/blog/layout2/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/layout2/4.jpg"
  },
  "/images2/blog/layout2/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.089Z",
    "size": 16688,
    "path": "../public/images2/blog/layout2/5.jpg"
  },
  "/images2/blog/layout3/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout3/1.jpg"
  },
  "/images2/blog/layout3/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout3/2.jpg"
  },
  "/images2/blog/layout3/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout3/3.jpg"
  },
  "/images2/blog/layout3/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout3/4.jpg"
  },
  "/images2/blog/layout3/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout3/5.jpg"
  },
  "/images2/blog/layout4/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout4/1.jpg"
  },
  "/images2/blog/layout4/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout4/2.jpg"
  },
  "/images2/blog/layout4/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout4/3.jpg"
  },
  "/images2/blog/layout4/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout4/4.jpg"
  },
  "/images2/blog/layout4/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout4/5.jpg"
  },
  "/images2/blog/layout4/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:33.085Z",
    "size": 16688,
    "path": "../public/images2/blog/layout4/6.jpg"
  },
  "/images2/books/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 7049,
    "path": "../public/images2/books/banner/1.jpg"
  },
  "/images2/books/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 7049,
    "path": "../public/images2/books/banner/2.jpg"
  },
  "/images2/books/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"117b-62R9KSjEsZJTI4AM2iwoJ2MrbY0\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 4475,
    "path": "../public/images2/books/blog/1.jpg"
  },
  "/images2/books/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"117b-62R9KSjEsZJTI4AM2iwoJ2MrbY0\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 4475,
    "path": "../public/images2/books/blog/2.jpg"
  },
  "/images2/books/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"117b-62R9KSjEsZJTI4AM2iwoJ2MrbY0\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 4475,
    "path": "../public/images2/books/blog/3.jpg"
  },
  "/images2/books/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"117b-62R9KSjEsZJTI4AM2iwoJ2MrbY0\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 4475,
    "path": "../public/images2/books/blog/4.jpg"
  },
  "/images2/books/home-slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 32147,
    "path": "../public/images2/books/home-slider/1.jpg"
  },
  "/images2/books/home-slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 32147,
    "path": "../public/images2/books/home-slider/2.jpg"
  },
  "/images2/books/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 1206,
    "path": "../public/images2/books/product/1.jpg"
  },
  "/images2/books/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.082Z",
    "size": 1206,
    "path": "../public/images2/books/product/10.jpg"
  },
  "/images2/books/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/11.jpg"
  },
  "/images2/books/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/12.jpg"
  },
  "/images2/books/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/13.jpg"
  },
  "/images2/books/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/2.jpg"
  },
  "/images2/books/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/3.jpg"
  },
  "/images2/books/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/4.jpg"
  },
  "/images2/books/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/5.jpg"
  },
  "/images2/books/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/6.jpg"
  },
  "/images2/books/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/7.jpg"
  },
  "/images2/books/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/8.jpg"
  },
  "/images2/books/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b6-YmLmeMn2WrSInIPf5uuN3PyomYs\"",
    "mtime": "2023-04-08T00:16:33.079Z",
    "size": 1206,
    "path": "../public/images2/books/product/9.jpg"
  },
  "/images2/books/svg/baking.svg": {
    "type": "image/svg+xml",
    "etag": "\"120c-M7AL2F1B3gNovYMeyoFibkzOgCg\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 4620,
    "path": "../public/images2/books/svg/baking.svg"
  },
  "/images2/books/svg/book.svg": {
    "type": "image/svg+xml",
    "etag": "\"57f-eQ7dlRpKXfRIaFk+8ZGPRlIqW4s\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 1407,
    "path": "../public/images2/books/svg/book.svg"
  },
  "/images2/books/svg/childrens-book.svg": {
    "type": "image/svg+xml",
    "etag": "\"13c7-+ABPcRik7E+uk7AoksCBQNT16QI\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 5063,
    "path": "../public/images2/books/svg/childrens-book.svg"
  },
  "/images2/books/svg/heart.svg": {
    "type": "image/svg+xml",
    "etag": "\"b7f-+mt4wpbny3yqweiFDSf+/6MGPYE\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 2943,
    "path": "../public/images2/books/svg/heart.svg"
  },
  "/images2/books/svg/history.svg": {
    "type": "image/svg+xml",
    "etag": "\"582-rRQqOmFc/MfccpAMhQN4+gYR8JY\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 1410,
    "path": "../public/images2/books/svg/history.svg"
  },
  "/images2/books/svg/journal.svg": {
    "type": "image/svg+xml",
    "etag": "\"ca6-XcxU3YkeuPQ0f8g1SA0FJPAI0RU\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 3238,
    "path": "../public/images2/books/svg/journal.svg"
  },
  "/images2/books/svg/life.svg": {
    "type": "image/svg+xml",
    "etag": "\"a14-jjHEUPlOkBvIelUxfsd+kvF5bqw\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 2580,
    "path": "../public/images2/books/svg/life.svg"
  },
  "/images2/books/svg/money.svg": {
    "type": "image/svg+xml",
    "etag": "\"18e3-HevInpUXxYPIZTsmhZfg0D8vaIM\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 6371,
    "path": "../public/images2/books/svg/money.svg"
  },
  "/images2/books/svg/music.svg": {
    "type": "image/svg+xml",
    "etag": "\"7c8-Pyvhh3cyb/SZmyIaLMUlQEvRT8o\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 1992,
    "path": "../public/images2/books/svg/music.svg"
  },
  "/images2/books/svg/pray.svg": {
    "type": "image/svg+xml",
    "etag": "\"175e-ZWXTwiq8y/TS9uDDfRy0cCWa8Po\"",
    "mtime": "2023-04-08T00:16:33.075Z",
    "size": 5982,
    "path": "../public/images2/books/svg/pray.svg"
  },
  "/images2/books/svg/science-fiction.svg": {
    "type": "image/svg+xml",
    "etag": "\"fd3-DAWzoNF1rqXlF7bLkPxcGhxBsqk\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 4051,
    "path": "../public/images2/books/svg/science-fiction.svg"
  },
  "/images2/books/svg/science.svg": {
    "type": "image/svg+xml",
    "etag": "\"f28-kXndX4BYbG9eKqUOo0hUZUIQtfw\"",
    "mtime": "2023-04-08T00:16:33.072Z",
    "size": 3880,
    "path": "../public/images2/books/svg/science.svg"
  },
  "/images2/christmas/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"90eb-eHupfxW0FriFtdbANrNIPzCDC5s\"",
    "mtime": "2023-04-08T00:16:33.065Z",
    "size": 37099,
    "path": "../public/images2/christmas/blog/1.jpg"
  },
  "/images2/christmas/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"90eb-eHupfxW0FriFtdbANrNIPzCDC5s\"",
    "mtime": "2023-04-08T00:16:33.065Z",
    "size": 37099,
    "path": "../public/images2/christmas/blog/2.jpg"
  },
  "/images2/christmas/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"90eb-eHupfxW0FriFtdbANrNIPzCDC5s\"",
    "mtime": "2023-04-08T00:16:33.065Z",
    "size": 37099,
    "path": "../public/images2/christmas/blog/3.jpg"
  },
  "/images2/christmas/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"90eb-eHupfxW0FriFtdbANrNIPzCDC5s\"",
    "mtime": "2023-04-08T00:16:33.065Z",
    "size": 37099,
    "path": "../public/images2/christmas/blog/4.jpg"
  },
  "/images2/christmas/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"90eb-eHupfxW0FriFtdbANrNIPzCDC5s\"",
    "mtime": "2023-04-08T00:16:33.065Z",
    "size": 37099,
    "path": "../public/images2/christmas/blog/5.jpg"
  },
  "/images2/christmas/blog/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"90eb-eHupfxW0FriFtdbANrNIPzCDC5s\"",
    "mtime": "2023-04-08T00:16:33.065Z",
    "size": 37099,
    "path": "../public/images2/christmas/blog/6.jpg"
  },
  "/images2/christmas/blog/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"90eb-eHupfxW0FriFtdbANrNIPzCDC5s\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 37099,
    "path": "../public/images2/christmas/blog/7.jpg"
  },
  "/images2/christmas/f-p/1.png": {
    "type": "image/png",
    "etag": "\"1244-TMm3jkGimqdyb4pXqpD43X1if/I\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 4676,
    "path": "../public/images2/christmas/f-p/1.png"
  },
  "/images2/christmas/f-p/2.png": {
    "type": "image/png",
    "etag": "\"bbb-wffTO2WgcrQTIzGSWdnHFjDKURw\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 3003,
    "path": "../public/images2/christmas/f-p/2.png"
  },
  "/images2/christmas/f-p/3.png": {
    "type": "image/png",
    "etag": "\"8a1-i2NrHN8XizB9oeGlMkxlbmbHdu4\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 2209,
    "path": "../public/images2/christmas/f-p/3.png"
  },
  "/images2/christmas/f-p/4.png": {
    "type": "image/png",
    "etag": "\"e5c-yGMmopgZr4N0elxeagEJdCEBcPo\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 3676,
    "path": "../public/images2/christmas/f-p/4.png"
  },
  "/images2/christmas/f-p/5.png": {
    "type": "image/png",
    "etag": "\"173b-sHV000U6Xg0m8aU2s02PfBCkOOw\"",
    "mtime": "2023-04-08T00:16:33.062Z",
    "size": 5947,
    "path": "../public/images2/christmas/f-p/5.png"
  },
  "/images2/christmas/f-p/6.png": {
    "type": "image/png",
    "etag": "\"d24-pz9hNKaR3wA6VzTD9NKsV64Hjes\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 3364,
    "path": "../public/images2/christmas/f-p/6.png"
  },
  "/images2/christmas/home-banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b884-inTALQ2uml8PF3gPFLtiFyoHKIc\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 47236,
    "path": "../public/images2/christmas/home-banner/1.jpg"
  },
  "/images2/christmas/home-banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b884-inTALQ2uml8PF3gPFLtiFyoHKIc\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 47236,
    "path": "../public/images2/christmas/home-banner/2.jpg"
  },
  "/images2/christmas/home-banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b884-inTALQ2uml8PF3gPFLtiFyoHKIc\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 47236,
    "path": "../public/images2/christmas/home-banner/3.jpg"
  },
  "/images2/christmas/home-banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b884-inTALQ2uml8PF3gPFLtiFyoHKIc\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 47236,
    "path": "../public/images2/christmas/home-banner/4.jpg"
  },
  "/images2/christmas/parallax/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b06c-yMelK/3l6Bj5MLH1ZwmA5En97SM\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 45164,
    "path": "../public/images2/christmas/parallax/1.jpg"
  },
  "/images2/christmas/parallax/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"8d68-kiqATU78GgSN0fZZgFJJHVELd9g\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 36200,
    "path": "../public/images2/christmas/parallax/2.jpg"
  },
  "/images2/christmas/parallax/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"f39a-K5YVesflZrkPuJYoyFrHa8C+Rv0\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 62362,
    "path": "../public/images2/christmas/parallax/3.jpg"
  },
  "/images2/christmas/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4125-jDD5O5ZqLfPC7qklU0HTalR3YOk\"",
    "mtime": "2023-04-08T00:16:33.049Z",
    "size": 16677,
    "path": "../public/images2/christmas/pro/1.jpg"
  },
  "/images2/christmas/pro3/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-ZH6iWEEoUBB5mZwV85MjT1I11OM\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/1.jpg"
  },
  "/images2/christmas/pro3/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-gr8OzIH6qDAL93nFUZuh+PpC1Pg\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/10.jpg"
  },
  "/images2/christmas/pro3/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-Jd1z779zJpM6cwpphDB8SUmXk6w\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/11.jpg"
  },
  "/images2/christmas/pro3/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-TW6uHuLNTMXMtwkEY/E/u+s5L/o\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/12.jpg"
  },
  "/images2/christmas/pro3/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-7Y/ybhsuIeGQiBy2x6HwNBnv6tE\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/13.jpg"
  },
  "/images2/christmas/pro3/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-aPzg52QsfU7JNMzVqm3+saLYYAs\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/14.jpg"
  },
  "/images2/christmas/pro3/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-dZHcx5EKHusyFd6zGqTOUdcSGJ4\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/15.jpg"
  },
  "/images2/christmas/pro3/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-WdntLNtA2ZMBFiT0fp/Ll5E3bAc\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/16.jpg"
  },
  "/images2/christmas/pro3/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-imbA2uEXriASfcJ4r//WCtW4oN4\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/17.jpg"
  },
  "/images2/christmas/pro3/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-xIsW5S6a68XluvU/IsDTAf2zHX0\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/18.jpg"
  },
  "/images2/christmas/pro3/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-i+7MlHzMdQaEzYGeAnH2X5Fxnl8\"",
    "mtime": "2023-04-08T00:16:33.045Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/19.jpg"
  },
  "/images2/christmas/pro3/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-vK4SwFE+OYpKLGdEuu0/FPKT6tA\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/2.jpg"
  },
  "/images2/christmas/pro3/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-th+0eAbeIKEj9H9WinCukTMcYvc\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/20.jpg"
  },
  "/images2/christmas/pro3/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-amUwp3v2HW0C9i/5qWAXOc+wm44\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/21.jpg"
  },
  "/images2/christmas/pro3/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-x5WQHBs9PfCfl7NDuIgzPQb3+7E\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/23.jpg"
  },
  "/images2/christmas/pro3/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-Gp3Am1QS5ubt/S8WMYG5LSn3NYo\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/24.jpg"
  },
  "/images2/christmas/pro3/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-3vpFNRboMySIs3Au7kQGY0o1m1o\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/25.jpg"
  },
  "/images2/christmas/pro3/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-s9eNYKmuTLFWtX9vJjGbKo0dXsY\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/27.jpg"
  },
  "/images2/christmas/pro3/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-eH7TorVlQLkA7T//Hzoa9+zo8+Q\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/28.jpg"
  },
  "/images2/christmas/pro3/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-0eGpLc6qFoa+P7rL+4WdeAIzlwg\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/3.jpg"
  },
  "/images2/christmas/pro3/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-5klyTeUDIEP5g3wXcbx/9sG3hcc\"",
    "mtime": "2023-04-08T00:16:33.042Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/33.jpg"
  },
  "/images2/christmas/pro3/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-+d9x8W++nSPzhd0r2cQhQnXiYuM\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/34.jpg"
  },
  "/images2/christmas/pro3/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-vBERa4yOi4wM0IQR5GeFB7xSJ+E\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/35.jpg"
  },
  "/images2/christmas/pro3/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-f2Ts/2Kzr8Z+dipeX852b8dcEOg\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/36.jpg"
  },
  "/images2/christmas/pro3/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-V8yXuRdcWZCnHI3Ye7Xrp0vINdM\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/4.jpg"
  },
  "/images2/christmas/pro3/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-Sryhmu8bAAw9hXPEohnNhgkVujI\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/5.jpg"
  },
  "/images2/christmas/pro3/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-e/umUjw6ywceYFj5cHJ5r/1qiT8\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/6.jpg"
  },
  "/images2/christmas/pro3/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-5Cv5MKWSyOuTO85gof9Z4f//6mw\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/7.jpg"
  },
  "/images2/christmas/pro3/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-Qq8/YtZ7/KKUWC0AZklrP3OMuD8\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/8.jpg"
  },
  "/images2/christmas/pro3/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"5142-sBIWuWLHyE48qGYBRrNcnqF6GLo\"",
    "mtime": "2023-04-08T00:16:33.039Z",
    "size": 20802,
    "path": "../public/images2/christmas/pro3/9.jpg"
  },
  "/images2/christmas/slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/1.jpg"
  },
  "/images2/christmas/slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/2.jpg"
  },
  "/images2/christmas/slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/3.jpg"
  },
  "/images2/christmas/slider/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/4.jpg"
  },
  "/images2/christmas/slider/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/5.jpg"
  },
  "/images2/christmas/slider/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/6.jpg"
  },
  "/images2/christmas/slider/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/7.jpg"
  },
  "/images2/christmas/slider/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/8.jpg"
  },
  "/images2/christmas/slider/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:33.035Z",
    "size": 11050,
    "path": "../public/images2/christmas/slider/9.jpg"
  },
  "/images2/christmas/testimonial/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b72-plRMLN23vhx9mqYHZ+vqPWotikg\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 2930,
    "path": "../public/images2/christmas/testimonial/1.jpg"
  },
  "/images2/christmas/testimonial/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b72-plRMLN23vhx9mqYHZ+vqPWotikg\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 2930,
    "path": "../public/images2/christmas/testimonial/2.jpg"
  },
  "/images2/christmas/testimonial/santa.png": {
    "type": "image/png",
    "etag": "\"5410-wxGmfCCrmf5KdkepPQLh75nGxPA\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 21520,
    "path": "../public/images2/christmas/testimonial/santa.png"
  },
  "/images2/christmas/testimonial/testimonial.png": {
    "type": "image/png",
    "etag": "\"549-JF5MaCnrwoUAFS2eFC/du8lmsiQ\"",
    "mtime": "2023-04-08T00:16:33.032Z",
    "size": 1353,
    "path": "../public/images2/christmas/testimonial/testimonial.png"
  },
  "/images2/cookware/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:33.029Z",
    "size": 3762,
    "path": "../public/images2/cookware/banner/1.jpg"
  },
  "/images2/cookware/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 3762,
    "path": "../public/images2/cookware/banner/2.jpg"
  },
  "/images2/cookware/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 3762,
    "path": "../public/images2/cookware/banner/3.jpg"
  },
  "/images2/cookware/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 3762,
    "path": "../public/images2/cookware/banner/4.jpg"
  },
  "/images2/cookware/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 3762,
    "path": "../public/images2/cookware/banner/5.jpg"
  },
  "/images2/cookware/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a35-mFzJl9//HCztkXFfGa4HlTukpoo\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 6709,
    "path": "../public/images2/cookware/blog/1.jpg"
  },
  "/images2/cookware/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a35-mFzJl9//HCztkXFfGa4HlTukpoo\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 6709,
    "path": "../public/images2/cookware/blog/2.jpg"
  },
  "/images2/cookware/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a35-mFzJl9//HCztkXFfGa4HlTukpoo\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 6709,
    "path": "../public/images2/cookware/blog/3.jpg"
  },
  "/images2/cookware/category/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/1.jpg"
  },
  "/images2/cookware/category/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/10.jpg"
  },
  "/images2/cookware/category/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/11.jpg"
  },
  "/images2/cookware/category/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.025Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/2.jpg"
  },
  "/images2/cookware/category/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/3.jpg"
  },
  "/images2/cookware/category/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/4.jpg"
  },
  "/images2/cookware/category/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/5.jpg"
  },
  "/images2/cookware/category/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/6.jpg"
  },
  "/images2/cookware/category/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/7.jpg"
  },
  "/images2/cookware/category/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/8.jpg"
  },
  "/images2/cookware/category/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"463-XdCYWsyn6eNzKIUkDWzt2ldNMjc\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 1123,
    "path": "../public/images2/cookware/category/9.jpg"
  },
  "/images2/cookware/lookbook/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"28a3-N6SNHaePH140kor1WsHD4uIBwCk\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 10403,
    "path": "../public/images2/cookware/lookbook/1.jpg"
  },
  "/images2/cookware/lookbook/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"28a3-N6SNHaePH140kor1WsHD4uIBwCk\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 10403,
    "path": "../public/images2/cookware/lookbook/2.jpg"
  },
  "/images2/cookware/lookbook/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"d54-uiwK9ZATx0DKtDtdXZoRw5OSO6A\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 3412,
    "path": "../public/images2/cookware/lookbook/3.jpg"
  },
  "/images2/cookware/lookbook/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1003-ErEOeD7VXcc+7y0Oas1C7djAZBs\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 4099,
    "path": "../public/images2/cookware/lookbook/4.jpg"
  },
  "/images2/cookware/lookbook/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1068-06Gw22ylnuuG7w6r/yhyYoVXZSw\"",
    "mtime": "2023-04-08T00:16:33.022Z",
    "size": 4200,
    "path": "../public/images2/cookware/lookbook/5.jpg"
  },
  "/images2/cookware/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/1.jpg"
  },
  "/images2/cookware/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/10.jpg"
  },
  "/images2/cookware/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/11.jpg"
  },
  "/images2/cookware/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/12.jpg"
  },
  "/images2/cookware/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/13.jpg"
  },
  "/images2/cookware/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/14.jpg"
  },
  "/images2/cookware/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/15.jpg"
  },
  "/images2/cookware/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/2.jpg"
  },
  "/images2/cookware/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/3.jpg"
  },
  "/images2/cookware/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/4.jpg"
  },
  "/images2/cookware/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/5.jpg"
  },
  "/images2/cookware/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.019Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/6.jpg"
  },
  "/images2/cookware/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/7.jpg"
  },
  "/images2/cookware/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/8.jpg"
  },
  "/images2/cookware/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"439-khBqksD7i8PGimkh3V9dKNX1q3I\"",
    "mtime": "2023-04-08T00:16:33.015Z",
    "size": 1081,
    "path": "../public/images2/cookware/pro/9.jpg"
  },
  "/images2/dashboard/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-xHGvkAMy+7qnjBUrGtrAQG36gdw\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/1.jpg"
  },
  "/images2/dashboard/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-WE1X38wsAX5vRzc1CVl6LSEVUHY\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/10.jpg"
  },
  "/images2/dashboard/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-yPS8SfxR9pc2NLDA3YNCO2NMNjY\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/11.jpg"
  },
  "/images2/dashboard/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-u5W5w8Zr59+qqjpKRlXS9RBDE6c\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/12.jpg"
  },
  "/images2/dashboard/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-rjwq+HA/f+75/Ywc0ojwb401DPw\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/13.jpg"
  },
  "/images2/dashboard/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-VqTL28r3xc0AC3IewdXeP8m2EHQ\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/14.jpg"
  },
  "/images2/dashboard/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-SQGAMxRJctlLuENpXw3VxA6Rx2M\"",
    "mtime": "2023-04-08T00:16:33.012Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/15.jpg"
  },
  "/images2/dashboard/product/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-Xpc6aIxgRPOklJ7nvU1LVZN5JyM\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/16.jpg"
  },
  "/images2/dashboard/product/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-6LJfPEAt87vwQ8sd6/nvewl3HTk\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/17.jpg"
  },
  "/images2/dashboard/product/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-5AcGDbWNnQSb1+TYr+doq8eJ+/k\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/18.jpg"
  },
  "/images2/dashboard/product/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-VdEVv+GujgovUgRCbKpT5fEjiAY\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/19.jpg"
  },
  "/images2/dashboard/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-MtrHydazUGTRHjxHSteJCallYHQ\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/2.jpg"
  },
  "/images2/dashboard/product/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-KrQwvMqu3dRC7uYB3aCIwr7RJ4c\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/20.jpg"
  },
  "/images2/dashboard/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-UDcVIj9QXvBNwRsiyezBEPv+ooM\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/3.jpg"
  },
  "/images2/dashboard/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-cRw1x1MzR/cjJD3753YJWsMPgDA\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/4.jpg"
  },
  "/images2/dashboard/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-DUFxLM+TLbRj8a4jrohRDwMk/M8\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/5.jpg"
  },
  "/images2/dashboard/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-sYvtzuFA0bofBsRt2/8TVyYMknk\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/6.jpg"
  },
  "/images2/dashboard/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-tFSXGDMRiqV1VQwpYN55sydNlns\"",
    "mtime": "2023-04-08T00:16:33.009Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/7.jpg"
  },
  "/images2/dashboard/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-9nnSd6aZMxRd0bzn/OQ7CPNleAA\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/8.jpg"
  },
  "/images2/dashboard/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"577-BUdXO+qe2XleksgWjDcur96Qkgc\"",
    "mtime": "2023-04-08T00:16:33.005Z",
    "size": 1399,
    "path": "../public/images2/dashboard/product/9.jpg"
  },
  "/images2/electronics/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"47f3-Q/PEhrVy1qpWyH3qVVwE5wIKkQg\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 18419,
    "path": "../public/images2/electronics/banner/1.jpg"
  },
  "/images2/electronics/banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.985Z",
    "size": 3762,
    "path": "../public/images2/electronics/banner/10.jpg"
  },
  "/images2/electronics/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 3762,
    "path": "../public/images2/electronics/banner/11.jpg"
  },
  "/images2/electronics/banner/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d84-EZ/MF6zjB9Ykp2Wce9EfPJA0oyk\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 11652,
    "path": "../public/images2/electronics/banner/12.jpg"
  },
  "/images2/electronics/banner/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b69-jYVxFl9pcmEaoVA0th/KICtFmrc\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 7017,
    "path": "../public/images2/electronics/banner/13.jpg"
  },
  "/images2/electronics/banner/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb6-G5/eySASt4pO6WoynNKRfQhWR9I\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 3766,
    "path": "../public/images2/electronics/banner/14.jpg"
  },
  "/images2/electronics/banner/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb6-G5/eySASt4pO6WoynNKRfQhWR9I\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 3766,
    "path": "../public/images2/electronics/banner/15.jpg"
  },
  "/images2/electronics/banner/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"10d0-1dAB/2tE3xJEy+xs9XKH2TEhaqc\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 4304,
    "path": "../public/images2/electronics/banner/16.jpg"
  },
  "/images2/electronics/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"47f3-Q/PEhrVy1qpWyH3qVVwE5wIKkQg\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 18419,
    "path": "../public/images2/electronics/banner/2.jpg"
  },
  "/images2/electronics/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 3762,
    "path": "../public/images2/electronics/banner/3.jpg"
  },
  "/images2/electronics/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 3762,
    "path": "../public/images2/electronics/banner/4.jpg"
  },
  "/images2/electronics/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"10bb-L/SUni4/mTtBtDsAAG55VYw+4wk\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 4283,
    "path": "../public/images2/electronics/banner/5.jpg"
  },
  "/images2/electronics/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"6951-k1nNf88zz8wi2Od6uYsBBR0WdSY\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 26961,
    "path": "../public/images2/electronics/banner/6.jpg"
  },
  "/images2/electronics/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"6951-k1nNf88zz8wi2Od6uYsBBR0WdSY\"",
    "mtime": "2023-04-08T00:16:32.982Z",
    "size": 26961,
    "path": "../public/images2/electronics/banner/7.jpg"
  },
  "/images2/electronics/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"af6b-GThCg+0QBC9Pdh0T1QK1tTzK73s\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 44907,
    "path": "../public/images2/electronics/banner/8.jpg"
  },
  "/images2/electronics/banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 3762,
    "path": "../public/images2/electronics/banner/9.jpg"
  },
  "/images2/electronics/banner/horizontal.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d84-EZ/MF6zjB9Ykp2Wce9EfPJA0oyk\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 11652,
    "path": "../public/images2/electronics/banner/horizontal.jpg"
  },
  "/images2/electronics/banner/vertical.jpg": {
    "type": "image/jpeg",
    "etag": "\"1170-GiTGbgCIU89ENenoknCXzG6u/Ng\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 4464,
    "path": "../public/images2/electronics/banner/vertical.jpg"
  },
  "/images2/electronics/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b40-qcMajYrZDRvcAxbPykiDfUADH3c\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 2880,
    "path": "../public/images2/electronics/blog/1.jpg"
  },
  "/images2/electronics/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b40-qcMajYrZDRvcAxbPykiDfUADH3c\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 2880,
    "path": "../public/images2/electronics/blog/2.jpg"
  },
  "/images2/electronics/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b40-qcMajYrZDRvcAxbPykiDfUADH3c\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 2880,
    "path": "../public/images2/electronics/blog/3.jpg"
  },
  "/images2/electronics/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b40-qcMajYrZDRvcAxbPykiDfUADH3c\"",
    "mtime": "2023-04-08T00:16:32.979Z",
    "size": 2880,
    "path": "../public/images2/electronics/blog/4.jpg"
  },
  "/images2/electronics/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"b40-qcMajYrZDRvcAxbPykiDfUADH3c\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 2880,
    "path": "../public/images2/electronics/blog/5.jpg"
  },
  "/images2/electronics/category/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"477-IvJz6QEUcCaGOHXgrAk9LJcHSjo\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 1143,
    "path": "../public/images2/electronics/category/1.jpg"
  },
  "/images2/electronics/category/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"477-IvJz6QEUcCaGOHXgrAk9LJcHSjo\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 1143,
    "path": "../public/images2/electronics/category/2.jpg"
  },
  "/images2/electronics/category/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"477-IvJz6QEUcCaGOHXgrAk9LJcHSjo\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 1143,
    "path": "../public/images2/electronics/category/3.jpg"
  },
  "/images2/electronics/category/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"477-IvJz6QEUcCaGOHXgrAk9LJcHSjo\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 1143,
    "path": "../public/images2/electronics/category/4.jpg"
  },
  "/images2/electronics/category/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"477-IvJz6QEUcCaGOHXgrAk9LJcHSjo\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 1143,
    "path": "../public/images2/electronics/category/5.jpg"
  },
  "/images2/electronics/home-slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"49c2-WCZkMoUl3Ab/pkI+ZpDhl97tpAA\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 18882,
    "path": "../public/images2/electronics/home-slider/1.jpg"
  },
  "/images2/electronics/home-slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"49c2-WCZkMoUl3Ab/pkI+ZpDhl97tpAA\"",
    "mtime": "2023-04-08T00:16:32.975Z",
    "size": 18882,
    "path": "../public/images2/electronics/home-slider/2.jpg"
  },
  "/images2/electronics/home-slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"49c2-WCZkMoUl3Ab/pkI+ZpDhl97tpAA\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 18882,
    "path": "../public/images2/electronics/home-slider/3.jpg"
  },
  "/images2/electronics/insta/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b43-aajcSwiEfD9uSzuG6zs0zclKQPM\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 2883,
    "path": "../public/images2/electronics/insta/1.jpg"
  },
  "/images2/electronics/insta/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b43-aajcSwiEfD9uSzuG6zs0zclKQPM\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 2883,
    "path": "../public/images2/electronics/insta/2.jpg"
  },
  "/images2/electronics/insta/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b43-aajcSwiEfD9uSzuG6zs0zclKQPM\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 2883,
    "path": "../public/images2/electronics/insta/3.jpg"
  },
  "/images2/electronics/insta/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b43-aajcSwiEfD9uSzuG6zs0zclKQPM\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 2883,
    "path": "../public/images2/electronics/insta/4.jpg"
  },
  "/images2/electronics/insta/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"b43-aajcSwiEfD9uSzuG6zs0zclKQPM\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 2883,
    "path": "../public/images2/electronics/insta/5.jpg"
  },
  "/images2/electronics/insta/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"b43-aajcSwiEfD9uSzuG6zs0zclKQPM\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 2883,
    "path": "../public/images2/electronics/insta/6.jpg"
  },
  "/images2/electronics/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/1.jpg"
  },
  "/images2/electronics/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.972Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/10.jpg"
  },
  "/images2/electronics/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/11.jpg"
  },
  "/images2/electronics/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/12.jpg"
  },
  "/images2/electronics/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/13.jpg"
  },
  "/images2/electronics/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/14.jpg"
  },
  "/images2/electronics/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/15.jpg"
  },
  "/images2/electronics/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/16.jpg"
  },
  "/images2/electronics/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/17.jpg"
  },
  "/images2/electronics/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/18.jpg"
  },
  "/images2/electronics/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/19.jpg"
  },
  "/images2/electronics/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.969Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/2.jpg"
  },
  "/images2/electronics/pro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/20.jpg"
  },
  "/images2/electronics/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/21.jpg"
  },
  "/images2/electronics/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/22.jpg"
  },
  "/images2/electronics/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/23.jpg"
  },
  "/images2/electronics/pro/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/24.jpg"
  },
  "/images2/electronics/pro/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/25.jpg"
  },
  "/images2/electronics/pro/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/26.jpg"
  },
  "/images2/electronics/pro/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/27.jpg"
  },
  "/images2/electronics/pro/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/28.jpg"
  },
  "/images2/electronics/pro/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/29.jpg"
  },
  "/images2/electronics/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.965Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/3.jpg"
  },
  "/images2/electronics/pro/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/30.jpg"
  },
  "/images2/electronics/pro/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/31.jpg"
  },
  "/images2/electronics/pro/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/32.jpg"
  },
  "/images2/electronics/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/4.jpg"
  },
  "/images2/electronics/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/5.jpg"
  },
  "/images2/electronics/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/6.jpg"
  },
  "/images2/electronics/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/7.jpg"
  },
  "/images2/electronics/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/8.jpg"
  },
  "/images2/electronics/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"fab-AQmyDjQCUDEOUQuVN0GrLlDMhho\"",
    "mtime": "2023-04-08T00:16:32.962Z",
    "size": 4011,
    "path": "../public/images2/electronics/pro/9.jpg"
  },
  "/images2/electronics/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/1.jpg"
  },
  "/images2/electronics/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/10.jpg"
  },
  "/images2/electronics/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/11.jpg"
  },
  "/images2/electronics/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/12.jpg"
  },
  "/images2/electronics/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/13.jpg"
  },
  "/images2/electronics/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/14.jpg"
  },
  "/images2/electronics/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/15.jpg"
  },
  "/images2/electronics/product/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/16.jpg"
  },
  "/images2/electronics/product/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/17.jpg"
  },
  "/images2/electronics/product/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.959Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/18.jpg"
  },
  "/images2/electronics/product/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/19.jpg"
  },
  "/images2/electronics/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/2.jpg"
  },
  "/images2/electronics/product/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/20.jpg"
  },
  "/images2/electronics/product/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/21.jpg"
  },
  "/images2/electronics/product/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/22.jpg"
  },
  "/images2/electronics/product/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/23.jpg"
  },
  "/images2/electronics/product/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/24.jpg"
  },
  "/images2/electronics/product/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/25.jpg"
  },
  "/images2/electronics/product/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/26.jpg"
  },
  "/images2/electronics/product/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/27.jpg"
  },
  "/images2/electronics/product/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/28.jpg"
  },
  "/images2/electronics/product/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.955Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/29.jpg"
  },
  "/images2/electronics/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/3.jpg"
  },
  "/images2/electronics/product/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/30.jpg"
  },
  "/images2/electronics/product/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/31.jpg"
  },
  "/images2/electronics/product/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/32.jpg"
  },
  "/images2/electronics/product/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/33.jpg"
  },
  "/images2/electronics/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/4.jpg"
  },
  "/images2/electronics/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/5.jpg"
  },
  "/images2/electronics/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/6.jpg"
  },
  "/images2/electronics/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/7.jpg"
  },
  "/images2/electronics/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/8.jpg"
  },
  "/images2/electronics/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.952Z",
    "size": 6362,
    "path": "../public/images2/electronics/product/9.jpg"
  },
  "/images2/electronics/sm-pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"18da-s8csPVMLQ7RMfFYocY0TAJeKwXo\"",
    "mtime": "2023-04-08T00:16:32.949Z",
    "size": 6362,
    "path": "../public/images2/electronics/sm-pro/1.jpg"
  },
  "/images2/element/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"8b59-HPw9mNTN9cptXeWinPkSmtow9QI\"",
    "mtime": "2023-04-08T00:16:32.942Z",
    "size": 35673,
    "path": "../public/images2/element/banner/1.jpg"
  },
  "/images2/element/banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"b481-XTuc9YHaJrhDYTiDncoSH0goBHQ\"",
    "mtime": "2023-04-08T00:16:32.942Z",
    "size": 46209,
    "path": "../public/images2/element/banner/10.jpg"
  },
  "/images2/element/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"92df-txcCTGNgV/6aLoX9FDPX4/Kgdz8\"",
    "mtime": "2023-04-08T00:16:32.942Z",
    "size": 37599,
    "path": "../public/images2/element/banner/11.jpg"
  },
  "/images2/element/banner/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"889a-5WSdYJKHh+nndwnj6sIqAn5KY1o\"",
    "mtime": "2023-04-08T00:16:32.942Z",
    "size": 34970,
    "path": "../public/images2/element/banner/12.jpg"
  },
  "/images2/element/banner/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"9ebfe-U+u4UTIjrNCoKobkiT+QhsexSJ4\"",
    "mtime": "2023-04-08T00:16:32.942Z",
    "size": 650238,
    "path": "../public/images2/element/banner/13.jpg"
  },
  "/images2/element/banner/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"932c-JZBthbN0v7ADAmzavy7/Uz/hK8A\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 37676,
    "path": "../public/images2/element/banner/14.jpg"
  },
  "/images2/element/banner/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"ae3a-OizF+HiSzOTUchNdDHa4nrbqeRM\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 44602,
    "path": "../public/images2/element/banner/15.jpg"
  },
  "/images2/element/banner/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bbc-SyudrGRjJG7N+Rm4gzkFxLyKUaU\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 15292,
    "path": "../public/images2/element/banner/16.jpg"
  },
  "/images2/element/banner/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"96a1-cxtMGK5K7Fxh/X39J7uKKZ+aKKk\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 38561,
    "path": "../public/images2/element/banner/17.jpg"
  },
  "/images2/element/banner/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"be8e-uFobbrPBOskjWDO5YzKPub+BZbg\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 48782,
    "path": "../public/images2/element/banner/18.jpg"
  },
  "/images2/element/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"988f-QMMYkkrWNbrP8g8Hts8ArRcCZvw\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 39055,
    "path": "../public/images2/element/banner/2.jpg"
  },
  "/images2/element/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"ce14-I6OUBHg5ZTH9jVCXHfPxMd3FfEY\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 52756,
    "path": "../public/images2/element/banner/3.jpg"
  },
  "/images2/element/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"eed1-mkjUNu1EHMIN9ygPNtnHwKFgMAY\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 61137,
    "path": "../public/images2/element/banner/4.jpg"
  },
  "/images2/element/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"13829-4KNqajv7rc2A3ik1lyYuerkRC2E\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 79913,
    "path": "../public/images2/element/banner/5.jpg"
  },
  "/images2/element/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"5809-md3XUxutsncLaI7VF9cVtMp4BhY\"",
    "mtime": "2023-04-08T00:16:32.939Z",
    "size": 22537,
    "path": "../public/images2/element/banner/6.jpg"
  },
  "/images2/element/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"d686-WhJnpqJ+mKEuqWNQF1I+oP2iPTk\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 54918,
    "path": "../public/images2/element/banner/7.jpg"
  },
  "/images2/element/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"10f58-8sanlmc/CzNR0RYikObtoLahayQ\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 69464,
    "path": "../public/images2/element/banner/8.jpg"
  },
  "/images2/element/banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"7763-iy9RKXxMAvOzxm1iGOrX81pIqjA\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 30563,
    "path": "../public/images2/element/banner/9.jpg"
  },
  "/images2/element/category/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"f19f-h/bnCIJRaWfknIjPPdlMnVSlf5A\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 61855,
    "path": "../public/images2/element/category/1.jpg"
  },
  "/images2/element/category/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"45e7-fDpVbGWFCUY7Ki2S2nUn286jFfE\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 17895,
    "path": "../public/images2/element/category/2.jpg"
  },
  "/images2/element/category/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2897-4CBAvXkZ3zmg4ES01EAAERoxTL0\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 10391,
    "path": "../public/images2/element/category/3.jpg"
  },
  "/images2/element/category/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"bcfc-UA2Mf/F4eVhuZ/BqpoH+K/hENBI\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 48380,
    "path": "../public/images2/element/category/4.jpg"
  },
  "/images2/element/category/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2df9-xOryAtHucNPHw7ismlVzapTwE+o\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 11769,
    "path": "../public/images2/element/category/5.jpg"
  },
  "/images2/element/category/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"44ef-608R/acpRq6OobWbiHQ/Rd5mW5w\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 17647,
    "path": "../public/images2/element/category/6.jpg"
  },
  "/images2/element/footer/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"9cb5-VVD51oniR3T3MraZWQz+5fBH+PA\"",
    "mtime": "2023-04-08T00:16:32.935Z",
    "size": 40117,
    "path": "../public/images2/element/footer/1.jpg"
  },
  "/images2/element/footer/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"90f3-q4QUykLCs58fJlBNfi6Aml49/cQ\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 37107,
    "path": "../public/images2/element/footer/2.jpg"
  },
  "/images2/element/footer/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"a25a-SjrKhbCtWX755W6ZFApOKPZf6ac\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 41562,
    "path": "../public/images2/element/footer/3.jpg"
  },
  "/images2/element/footer/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"8736-/W8+nfFXnD6miKo9WNGvurrnOcI\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 34614,
    "path": "../public/images2/element/footer/4.jpg"
  },
  "/images2/element/footer/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"99a2-cFEl0MGJMUzvZm8rJedfYoniVds\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 39330,
    "path": "../public/images2/element/footer/5.jpg"
  },
  "/images2/element/footer/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"13c2e-O+2MN5r2cIuH7mojgaUXbsmXKrI\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 80942,
    "path": "../public/images2/element/footer/6.jpg"
  },
  "/images2/element/footer/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"87a0-itiSie2EAuChKXF0/R5/+JFSgwk\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 34720,
    "path": "../public/images2/element/footer/7.jpg"
  },
  "/images2/element/footer/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"43b8-nLJkI9b/FkINcbU4TUiNvtFQmf4\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 17336,
    "path": "../public/images2/element/footer/8.jpg"
  },
  "/images2/element/slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"ffaa-gARF2Y7GdaIbI4MdJ0wANa3e3mk\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 65450,
    "path": "../public/images2/element/slider/1.jpg"
  },
  "/images2/element/slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"11aca-F+Y/c0r81r6Ie5tw+Qdjl0UAh2I\"",
    "mtime": "2023-04-08T00:16:32.932Z",
    "size": 72394,
    "path": "../public/images2/element/slider/2.jpg"
  },
  "/images2/element/slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"f936-l+PIi9HhspSRDLkPFXoJTWodIL8\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 63798,
    "path": "../public/images2/element/slider/3.jpg"
  },
  "/images2/element/slider/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"10896-IErRymVf2KbQeyiKy9QRGzWopEI\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 67734,
    "path": "../public/images2/element/slider/4.jpg"
  },
  "/images2/element/slider/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"c68d-ckLnt8LC/3gWHNm6NzKYAR2QKNU\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 50829,
    "path": "../public/images2/element/slider/5.jpg"
  },
  "/images2/element/slider/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"118b9-F5zUDVqzHvk8W4944ub1Tk70bl0\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 71865,
    "path": "../public/images2/element/slider/6.jpg"
  },
  "/images2/element/slider/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"16768-/fk+34xRIFRrkbZFTonefnhb4PU\"",
    "mtime": "2023-04-08T00:16:32.929Z",
    "size": 92008,
    "path": "../public/images2/element/slider/7.jpg"
  },
  "/images2/fashion/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 19906,
    "path": "../public/images2/fashion/banner/1.jpg"
  },
  "/images2/fashion/banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 12069,
    "path": "../public/images2/fashion/banner/10.jpg"
  },
  "/images2/fashion/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"466a-2MsbE9FfnBugLWEk20VaP2t+08c\"",
    "mtime": "2023-04-08T00:16:32.912Z",
    "size": 18026,
    "path": "../public/images2/fashion/banner/11.jpg"
  },
  "/images2/fashion/banner/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"466a-2MsbE9FfnBugLWEk20VaP2t+08c\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 18026,
    "path": "../public/images2/fashion/banner/12.jpg"
  },
  "/images2/fashion/banner/13-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1959-qru9sIzXtg1SqjZc1bZ6mxbIKwc\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 6489,
    "path": "../public/images2/fashion/banner/13-1.jpg"
  },
  "/images2/fashion/banner/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1959-qru9sIzXtg1SqjZc1bZ6mxbIKwc\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 6489,
    "path": "../public/images2/fashion/banner/13.jpg"
  },
  "/images2/fashion/banner/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1959-qru9sIzXtg1SqjZc1bZ6mxbIKwc\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 6489,
    "path": "../public/images2/fashion/banner/14.jpg"
  },
  "/images2/fashion/banner/15-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1959-qru9sIzXtg1SqjZc1bZ6mxbIKwc\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 6489,
    "path": "../public/images2/fashion/banner/15-1.jpg"
  },
  "/images2/fashion/banner/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"1959-qru9sIzXtg1SqjZc1bZ6mxbIKwc\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 6489,
    "path": "../public/images2/fashion/banner/15.jpg"
  },
  "/images2/fashion/banner/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3dfd-kc1v4Q/cUF7kRH/3oRLBr0r1aFo\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 15869,
    "path": "../public/images2/fashion/banner/16.jpg"
  },
  "/images2/fashion/banner/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"4296-dnEauM/NSCx8Q6B5RdT8izjE9Rc\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 17046,
    "path": "../public/images2/fashion/banner/17.jpg"
  },
  "/images2/fashion/banner/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"11fd-S5FqJd3BShwGnHsHbUJkWdsAcGg\"",
    "mtime": "2023-04-08T00:16:32.909Z",
    "size": 4605,
    "path": "../public/images2/fashion/banner/18.jpg"
  },
  "/images2/fashion/banner/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"19c2-PqqPRYZTuP7dmH65XutxBPMw9Ls\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 6594,
    "path": "../public/images2/fashion/banner/19.jpg"
  },
  "/images2/fashion/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 19906,
    "path": "../public/images2/fashion/banner/2.jpg"
  },
  "/images2/fashion/banner/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"19c2-PqqPRYZTuP7dmH65XutxBPMw9Ls\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 6594,
    "path": "../public/images2/fashion/banner/20.jpg"
  },
  "/images2/fashion/banner/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"44e2-iHsqoCVuyIC+amCUgNaKapgt6UA\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 17634,
    "path": "../public/images2/fashion/banner/21.jpg"
  },
  "/images2/fashion/banner/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"44e2-iHsqoCVuyIC+amCUgNaKapgt6UA\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 17634,
    "path": "../public/images2/fashion/banner/22.jpg"
  },
  "/images2/fashion/banner/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"44e2-iHsqoCVuyIC+amCUgNaKapgt6UA\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 17634,
    "path": "../public/images2/fashion/banner/23.jpg"
  },
  "/images2/fashion/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 19906,
    "path": "../public/images2/fashion/banner/3.jpg"
  },
  "/images2/fashion/banner/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 14089,
    "path": "../public/images2/fashion/banner/34.jpg"
  },
  "/images2/fashion/banner/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 14089,
    "path": "../public/images2/fashion/banner/35.jpg"
  },
  "/images2/fashion/banner/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:32.905Z",
    "size": 14089,
    "path": "../public/images2/fashion/banner/36.jpg"
  },
  "/images2/fashion/banner/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"3709-Crcwn2X88XyfUYQbxA/1pym8GRw\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 14089,
    "path": "../public/images2/fashion/banner/37.jpg"
  },
  "/images2/fashion/banner/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"1205-VSRuHbI9nELx0gxuUMV+EaSWFAE\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 4613,
    "path": "../public/images2/fashion/banner/38.jpg"
  },
  "/images2/fashion/banner/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"1205-VSRuHbI9nELx0gxuUMV+EaSWFAE\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 4613,
    "path": "../public/images2/fashion/banner/39.jpg"
  },
  "/images2/fashion/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc2-b2M5Sgpq6gn4mr+YK60KFJwZjuk\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 19906,
    "path": "../public/images2/fashion/banner/4.jpg"
  },
  "/images2/fashion/banner/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"1205-VSRuHbI9nELx0gxuUMV+EaSWFAE\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 4613,
    "path": "../public/images2/fashion/banner/40.jpg"
  },
  "/images2/fashion/banner/41.jpg": {
    "type": "image/jpeg",
    "etag": "\"1959-qru9sIzXtg1SqjZc1bZ6mxbIKwc\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 6489,
    "path": "../public/images2/fashion/banner/41.jpg"
  },
  "/images2/fashion/banner/42.jpg": {
    "type": "image/jpeg",
    "etag": "\"1959-qru9sIzXtg1SqjZc1bZ6mxbIKwc\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 6489,
    "path": "../public/images2/fashion/banner/42.jpg"
  },
  "/images2/fashion/banner/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac-cYRQbqm4k8XQErSfQqtgemOa0+w\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 4524,
    "path": "../public/images2/fashion/banner/43.jpg"
  },
  "/images2/fashion/banner/44.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac-cYRQbqm4k8XQErSfQqtgemOa0+w\"",
    "mtime": "2023-04-08T00:16:32.902Z",
    "size": 4524,
    "path": "../public/images2/fashion/banner/44.jpg"
  },
  "/images2/fashion/banner/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac-cYRQbqm4k8XQErSfQqtgemOa0+w\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 4524,
    "path": "../public/images2/fashion/banner/45.jpg"
  },
  "/images2/fashion/banner/46.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac-cYRQbqm4k8XQErSfQqtgemOa0+w\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 4524,
    "path": "../public/images2/fashion/banner/46.jpg"
  },
  "/images2/fashion/banner/47.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac-cYRQbqm4k8XQErSfQqtgemOa0+w\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 4524,
    "path": "../public/images2/fashion/banner/47.jpg"
  },
  "/images2/fashion/banner/48.jpg": {
    "type": "image/jpeg",
    "etag": "\"fcb-POU/1qWHewzDwzRc55JmIRliXuQ\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 4043,
    "path": "../public/images2/fashion/banner/48.jpg"
  },
  "/images2/fashion/banner/49.jpg": {
    "type": "image/jpeg",
    "etag": "\"281e-mhFzQ5HuVQMZtX349WdzhO3CB1Q\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 10270,
    "path": "../public/images2/fashion/banner/49.jpg"
  },
  "/images2/fashion/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 12069,
    "path": "../public/images2/fashion/banner/5.jpg"
  },
  "/images2/fashion/banner/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"13b7-bwuVXEnRHdob51OMVTPIBYXiNWk\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 5047,
    "path": "../public/images2/fashion/banner/50.jpg"
  },
  "/images2/fashion/banner/51.jpg": {
    "type": "image/jpeg",
    "etag": "\"13b7-bwuVXEnRHdob51OMVTPIBYXiNWk\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 5047,
    "path": "../public/images2/fashion/banner/51.jpg"
  },
  "/images2/fashion/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 12069,
    "path": "../public/images2/fashion/banner/6.jpg"
  },
  "/images2/fashion/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:32.899Z",
    "size": 12069,
    "path": "../public/images2/fashion/banner/7.jpg"
  },
  "/images2/fashion/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 12069,
    "path": "../public/images2/fashion/banner/8.jpg"
  },
  "/images2/fashion/banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f25-wwRf1fQeRLpSZJQJRaGKUojkAAQ\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 12069,
    "path": "../public/images2/fashion/banner/9.jpg"
  },
  "/images2/fashion/category/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/1.jpg"
  },
  "/images2/fashion/category/1.png": {
    "type": "image/png",
    "etag": "\"9a96-jWYhHCOVroDuTg7t4e14S9LA/aA\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 39574,
    "path": "../public/images2/fashion/category/1.png"
  },
  "/images2/fashion/category/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/10.jpg"
  },
  "/images2/fashion/category/10.png": {
    "type": "image/png",
    "etag": "\"b485-+2y4Xk4i+2g3Gidr/WvHVh8z3Ak\"",
    "mtime": "2023-04-08T00:16:32.895Z",
    "size": 46213,
    "path": "../public/images2/fashion/category/10.png"
  },
  "/images2/fashion/category/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/11.jpg"
  },
  "/images2/fashion/category/11.png": {
    "type": "image/png",
    "etag": "\"b09d-pWiUD9HyVsqD0QZIcEFQmWmvPvM\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 45213,
    "path": "../public/images2/fashion/category/11.png"
  },
  "/images2/fashion/category/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/12.jpg"
  },
  "/images2/fashion/category/12.png": {
    "type": "image/png",
    "etag": "\"cf9b-PfCABbKWXD2BRxOFUN5H9q5e0Eg\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 53147,
    "path": "../public/images2/fashion/category/12.png"
  },
  "/images2/fashion/category/13.png": {
    "type": "image/png",
    "etag": "\"f54d-RkSEmEKLLdqkXavFobJ8N6qFyEQ\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 62797,
    "path": "../public/images2/fashion/category/13.png"
  },
  "/images2/fashion/category/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/2.jpg"
  },
  "/images2/fashion/category/2.png": {
    "type": "image/png",
    "etag": "\"d5b6-RMqVcWHXg7FCT/mRFO8p8xds3qI\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 54710,
    "path": "../public/images2/fashion/category/2.png"
  },
  "/images2/fashion/category/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/3.jpg"
  },
  "/images2/fashion/category/3.png": {
    "type": "image/png",
    "etag": "\"92b2-DgK74HuHI9QWToGTsq65p177M3A\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 37554,
    "path": "../public/images2/fashion/category/3.png"
  },
  "/images2/fashion/category/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/4.jpg"
  },
  "/images2/fashion/category/4.png": {
    "type": "image/png",
    "etag": "\"b9ce-jdtTxUWuEUrSSHdH3XGIoJ9/r10\"",
    "mtime": "2023-04-08T00:16:32.892Z",
    "size": 47566,
    "path": "../public/images2/fashion/category/4.png"
  },
  "/images2/fashion/category/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/5.jpg"
  },
  "/images2/fashion/category/5.png": {
    "type": "image/png",
    "etag": "\"d477-sTnS1gHkl8e7glpfHOhySR4hoT0\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 54391,
    "path": "../public/images2/fashion/category/5.png"
  },
  "/images2/fashion/category/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/6.jpg"
  },
  "/images2/fashion/category/6.png": {
    "type": "image/png",
    "etag": "\"10016-cjHDLauQ1V9yo/CwSQCz0Z5nOoI\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 65558,
    "path": "../public/images2/fashion/category/6.png"
  },
  "/images2/fashion/category/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/7.jpg"
  },
  "/images2/fashion/category/7.png": {
    "type": "image/png",
    "etag": "\"bf59-fIRPTsiCIMjxXVCSP5h38/e82M0\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 48985,
    "path": "../public/images2/fashion/category/7.png"
  },
  "/images2/fashion/category/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/8.jpg"
  },
  "/images2/fashion/category/8.png": {
    "type": "image/png",
    "etag": "\"e7b2-JlYzieCuoquxaJJWlePoUqD8e+o\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 59314,
    "path": "../public/images2/fashion/category/8.png"
  },
  "/images2/fashion/category/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"606-CBYpZCYz5GPmJ1gvMJflR61ziRA\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 1542,
    "path": "../public/images2/fashion/category/9.jpg"
  },
  "/images2/fashion/category/9.png": {
    "type": "image/png",
    "etag": "\"cc0f-9jcWSQbc49obzHxUFzznmpVOaXI\"",
    "mtime": "2023-04-08T00:16:32.889Z",
    "size": 52239,
    "path": "../public/images2/fashion/category/9.png"
  },
  "/images2/fashion/lookbook/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a40-xS3yDqg07PpIf/83v2Fh+8LQtBg\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 27200,
    "path": "../public/images2/fashion/lookbook/1.jpg"
  },
  "/images2/fashion/lookbook/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 18831,
    "path": "../public/images2/fashion/lookbook/10.jpg"
  },
  "/images2/fashion/lookbook/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 20167,
    "path": "../public/images2/fashion/lookbook/11.jpg"
  },
  "/images2/fashion/lookbook/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 20167,
    "path": "../public/images2/fashion/lookbook/12.jpg"
  },
  "/images2/fashion/lookbook/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 18831,
    "path": "../public/images2/fashion/lookbook/13.jpg"
  },
  "/images2/fashion/lookbook/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 20167,
    "path": "../public/images2/fashion/lookbook/2.jpg"
  },
  "/images2/fashion/lookbook/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"6d5e-1Q3c4f4cn15iJGEG0iP7lPUn9g4\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 27998,
    "path": "../public/images2/fashion/lookbook/3.jpg"
  },
  "/images2/fashion/lookbook/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a40-xS3yDqg07PpIf/83v2Fh+8LQtBg\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 27200,
    "path": "../public/images2/fashion/lookbook/4.jpg"
  },
  "/images2/fashion/lookbook/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 18831,
    "path": "../public/images2/fashion/lookbook/5.jpg"
  },
  "/images2/fashion/lookbook/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a40-xS3yDqg07PpIf/83v2Fh+8LQtBg\"",
    "mtime": "2023-04-08T00:16:32.885Z",
    "size": 27200,
    "path": "../public/images2/fashion/lookbook/6.jpg"
  },
  "/images2/fashion/lookbook/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 18831,
    "path": "../public/images2/fashion/lookbook/7.jpg"
  },
  "/images2/fashion/lookbook/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 18831,
    "path": "../public/images2/fashion/lookbook/8.jpg"
  },
  "/images2/fashion/lookbook/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"498f-0Cn830OxBBad8oBXT/WEufl3m3U\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 18831,
    "path": "../public/images2/fashion/lookbook/9.jpg"
  },
  "/images2/fashion/lookbook/men.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ec7-N7HR9Pa8VN24+j3MePPUnnnHr6s\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 20167,
    "path": "../public/images2/fashion/lookbook/men.jpg"
  },
  "/images2/fashion/pro/001.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-Gatixcswi31rAr5I0XUiND4YFoo\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/001.jpg"
  },
  "/images2/fashion/pro/002.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-RIjE4LUqmCm3+PgeEeMvoMHM6h4\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/002.jpg"
  },
  "/images2/fashion/pro/003.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-S2WG2oFQWm2RKS5HW2UHRqViRM0\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/003.jpg"
  },
  "/images2/fashion/pro/004.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-wFR8NmRhn1dwluTB8BIxixSfFBk\"",
    "mtime": "2023-04-08T00:16:32.882Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/004.jpg"
  },
  "/images2/fashion/pro/01.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-N0n7BT8Vqpd0ZLJgtV+wQFJMde4\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/01.jpg"
  },
  "/images2/fashion/pro/010.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-Pddzw0/u7kq3EI5yl0Wmt13nTBo\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/010.jpg"
  },
  "/images2/fashion/pro/011.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-X2GjkLfCipiKHHsy+V37Jhb68wc\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/011.jpg"
  },
  "/images2/fashion/pro/012.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-A9SzMV1tT1WxpVpbMzHqMYC4pC0\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/012.jpg"
  },
  "/images2/fashion/pro/013.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-Fompg2pmgJEVxQuZ+ubDUt0AQ0c\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/013.jpg"
  },
  "/images2/fashion/pro/014.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-O6Zmf2WBhV/RFqSoaNhbay73ZK4\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/014.jpg"
  },
  "/images2/fashion/pro/015.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-XUkPJnqYj+p3QKhh4qGbhqBPA34\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/015.jpg"
  },
  "/images2/fashion/pro/016.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-2zaT5brukgEp35rDurfcta1OXYs\"",
    "mtime": "2023-04-08T00:16:32.879Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/016.jpg"
  },
  "/images2/fashion/pro/017.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-UHzK0CRZ7Lr9ic+IT+PWBxWbCLc\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/017.jpg"
  },
  "/images2/fashion/pro/018.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-l1OX/UuGPI+Sfztrb+UxUPpeHJk\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/018.jpg"
  },
  "/images2/fashion/pro/019.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-f4LfUjfbGFbaNf2sQsSU9mD5hRY\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/019.jpg"
  },
  "/images2/fashion/pro/02.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-yfcK3M9xT96PDnfu+8xR5IIkM3s\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/02.jpg"
  },
  "/images2/fashion/pro/03.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-rRI0Uki/YQ9Bv5sih3bxEMvcCtc\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/03.jpg"
  },
  "/images2/fashion/pro/04.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-5cprlkClrtPVsjlD2Sw/Be6Cf7w\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/04.jpg"
  },
  "/images2/fashion/pro/05.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-rhpBpovOZUTX1GXw9vUA7f+0fhU\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/05.jpg"
  },
  "/images2/fashion/pro/06.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-sNd/WzRnCP4rIZulrXRr7n9z7rM\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/06.jpg"
  },
  "/images2/fashion/pro/07.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-6ORUDXcRBN9mghe2OfzPCcc+c6g\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/07.jpg"
  },
  "/images2/fashion/pro/08.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-qd2QcsOvLq9tczsZvRArAAGC4RA\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/08.jpg"
  },
  "/images2/fashion/pro/09.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-xxiOrtrFVnPoSj7sJjyOZVe/MF0\"",
    "mtime": "2023-04-08T00:16:32.875Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/09.jpg"
  },
  "/images2/fashion/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-5KpGdO9o4z0TDouV8R9fqK1KtAE\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/1.jpg"
  },
  "/images2/fashion/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-hOPmVPDfQUzfMgmn0vRWgD4AXxc\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/10.jpg"
  },
  "/images2/fashion/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-PvPnQE1VjLf6yiic7G/I1GIqGPk\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/11.jpg"
  },
  "/images2/fashion/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-FpwI31ni1mZ+TQUn7PGb9/afGL0\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/12.jpg"
  },
  "/images2/fashion/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/13.jpg"
  },
  "/images2/fashion/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-blOKhuJ6T92kSg2jUQST8ZN4Mi0\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/14.jpg"
  },
  "/images2/fashion/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-fU9Y9eLqy8awPJ98FLJUmLv7Zws\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/15.jpg"
  },
  "/images2/fashion/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-GTZN9bQyPF86ZmUTB6QZhjzbCjI\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/16.jpg"
  },
  "/images2/fashion/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-MSMo1i6QyEX7PLk0negXt2CuMJY\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/17.jpg"
  },
  "/images2/fashion/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-UGdmffpcGQZ29hTZHZX5jJWSMF8\"",
    "mtime": "2023-04-08T00:16:32.872Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/18.jpg"
  },
  "/images2/fashion/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-XBF06a4KKZ26PVWrv2QGmBSp0aI\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/19.jpg"
  },
  "/images2/fashion/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-Z+OLGBMMr0g6iFYjTJWLbm4/f28\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/2.jpg"
  },
  "/images2/fashion/pro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/20.jpg"
  },
  "/images2/fashion/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/21.jpg"
  },
  "/images2/fashion/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/22.jpg"
  },
  "/images2/fashion/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/23.jpg"
  },
  "/images2/fashion/pro/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/24.jpg"
  },
  "/images2/fashion/pro/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/25.jpg"
  },
  "/images2/fashion/pro/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/26.jpg"
  },
  "/images2/fashion/pro/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/27.jpg"
  },
  "/images2/fashion/pro/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.869Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/28.jpg"
  },
  "/images2/fashion/pro/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/29.jpg"
  },
  "/images2/fashion/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-CWvs6blS+6756CdLyUWs7DaKqd8\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/3.jpg"
  },
  "/images2/fashion/pro/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/30.jpg"
  },
  "/images2/fashion/pro/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/31.jpg"
  },
  "/images2/fashion/pro/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/32.jpg"
  },
  "/images2/fashion/pro/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/33.jpg"
  },
  "/images2/fashion/pro/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/34.jpg"
  },
  "/images2/fashion/pro/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/35.jpg"
  },
  "/images2/fashion/pro/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/36.jpg"
  },
  "/images2/fashion/pro/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/37.jpg"
  },
  "/images2/fashion/pro/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.865Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/38.jpg"
  },
  "/images2/fashion/pro/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/39.jpg"
  },
  "/images2/fashion/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-CDo4DNt+iKlX68t89Xz0GIr+HaU\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/4.jpg"
  },
  "/images2/fashion/pro/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/40.jpg"
  },
  "/images2/fashion/pro/41.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/41.jpg"
  },
  "/images2/fashion/pro/42.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/42.jpg"
  },
  "/images2/fashion/pro/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/43.jpg"
  },
  "/images2/fashion/pro/44.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/44.jpg"
  },
  "/images2/fashion/pro/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/45.jpg"
  },
  "/images2/fashion/pro/46.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/46.jpg"
  },
  "/images2/fashion/pro/47.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/47.jpg"
  },
  "/images2/fashion/pro/48.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.862Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/48.jpg"
  },
  "/images2/fashion/pro/49.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/49.jpg"
  },
  "/images2/fashion/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-sQ1DCakjLkeIqt8jRzScs/YnlLw\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/5.jpg"
  },
  "/images2/fashion/pro/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/50.jpg"
  },
  "/images2/fashion/pro/51.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/51.jpg"
  },
  "/images2/fashion/pro/52.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/52.jpg"
  },
  "/images2/fashion/pro/53.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/53.jpg"
  },
  "/images2/fashion/pro/54.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/54.jpg"
  },
  "/images2/fashion/pro/55.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/55.jpg"
  },
  "/images2/fashion/pro/56.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/56.jpg"
  },
  "/images2/fashion/pro/57.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-9UmXK/69kDwg0p39vvqOF7SipRM\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/57.jpg"
  },
  "/images2/fashion/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-yS78p4hHCWED6m6pUTCWrvp/JG0\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/6.jpg"
  },
  "/images2/fashion/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-Mw2f1w/VDJhv7wA+HtRblQUiJU8\"",
    "mtime": "2023-04-08T00:16:32.859Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/7.jpg"
  },
  "/images2/fashion/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-5solbj8fcsxbGb5MveCHRl18Kno\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/8.jpg"
  },
  "/images2/fashion/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-SDt6uoyjaCo60K5t/A6kHto/DDw\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/9.jpg"
  },
  "/images2/fashion/pro/m-001.jpg": {
    "type": "image/jpeg",
    "etag": "\"f57-TEtRonwDBDMHCJa5MWjMJOrbdlI\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 3927,
    "path": "../public/images2/fashion/pro/m-001.jpg"
  },
  "/images2/fashion/pro/m-002.jpg": {
    "type": "image/jpeg",
    "etag": "\"109b-hKalj8ZAPSitnYeR9+yGJ2RD2os\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 4251,
    "path": "../public/images2/fashion/pro/m-002.jpg"
  },
  "/images2/fashion/pro/m-003.jpg": {
    "type": "image/jpeg",
    "etag": "\"1186-XDbVadzu+0UxDHZ4v1fO2w78HZE\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 4486,
    "path": "../public/images2/fashion/pro/m-003.jpg"
  },
  "/images2/fashion/pro/shoes.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-ivFL97MCpliosBBuGNDlWD/4b4g\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/shoes.jpg"
  },
  "/images2/fashion/pro/skirt.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f91-KWGUPJ7ggcjM+rSNiXSGoMjOJcE\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 16273,
    "path": "../public/images2/fashion/pro/skirt.jpg"
  },
  "/images2/fashion/pro-sm/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/1.jpg"
  },
  "/images2/fashion/pro-sm/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/10.jpg"
  },
  "/images2/fashion/pro-sm/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/11.jpg"
  },
  "/images2/fashion/pro-sm/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.855Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/12.jpg"
  },
  "/images2/fashion/pro-sm/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/13.jpg"
  },
  "/images2/fashion/pro-sm/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/2.jpg"
  },
  "/images2/fashion/pro-sm/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/3.jpg"
  },
  "/images2/fashion/pro-sm/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/4.jpg"
  },
  "/images2/fashion/pro-sm/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/5.jpg"
  },
  "/images2/fashion/pro-sm/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/6.jpg"
  },
  "/images2/fashion/pro-sm/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/7.jpg"
  },
  "/images2/fashion/pro-sm/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/8.jpg"
  },
  "/images2/fashion/pro-sm/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"260-qQCGao2BEeyDK2BiaLkfwPsqc+Q\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 608,
    "path": "../public/images2/fashion/pro-sm/9.jpg"
  },
  "/images2/fashion/product/1-.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-Z5JWadOgSzpnDm92tpOrnlg7BCM\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/1-.jpg"
  },
  "/images2/fashion/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-2R1xi9hZ1M2FCvBNhSih9wZE85A\"",
    "mtime": "2023-04-08T00:16:32.852Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/1.jpg"
  },
  "/images2/fashion/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-qgJ3QcRIQ1Tj2YwXif0p7dLR350\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/10.jpg"
  },
  "/images2/fashion/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-MJdBls4d0P4xuxg0bjzXswNuHmw\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/11.jpg"
  },
  "/images2/fashion/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-VdX/8Os5XVa1QCuru0FvRZ0dkIc\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/12.jpg"
  },
  "/images2/fashion/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-DbohMpyK0EBaK5qt96paiqRvzIE\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/13.jpg"
  },
  "/images2/fashion/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-f29YgNYyyiXGmC3BD8+BnhtNals\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/14.jpg"
  },
  "/images2/fashion/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-3U0uCL6QeY9v3qwuM6zWDHrq/yY\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/15.jpg"
  },
  "/images2/fashion/product/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-e8/xvqYb9nrG7N2/Mg+Id9GCeBg\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/16.jpg"
  },
  "/images2/fashion/product/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-aV+P+zSbe2XHj9o9ujkIcmFlPHM\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/17.jpg"
  },
  "/images2/fashion/product/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-AA8i2Iyc8CMPI5bhlA5h5abYn/8\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/19.jpg"
  },
  "/images2/fashion/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-fE1GAMIceCDJIt0Piq+BUEmjuNc\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/2.jpg"
  },
  "/images2/fashion/product/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-6h+ZM4JcJsvl/dXYB1VvPn2hDyw\"",
    "mtime": "2023-04-08T00:16:32.849Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/21.jpg"
  },
  "/images2/fashion/product/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-fIwxJv0y5lNbq+8Zu2IIrGaFuOk\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/22.jpg"
  },
  "/images2/fashion/product/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-eCJFZ/o/lhKiqFKlcA60bvuTUHc\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/23.jpg"
  },
  "/images2/fashion/product/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-+t5iYwChH4j1l+AejyaKt2DHCmw\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/25.jpg"
  },
  "/images2/fashion/product/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-5dsdv93J4xFz3diAeTohamIkKiA\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/26.jpg"
  },
  "/images2/fashion/product/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-Xvr/iw+Z7OASzCzj/jRNX4iZdfo\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/27.jpg"
  },
  "/images2/fashion/product/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-SEdki9zPDwujikI3b8yEBsh4Vfk\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/28.jpg"
  },
  "/images2/fashion/product/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-9TUOXu4RG87oUkHAQ285LLbLAeA\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/29.jpg"
  },
  "/images2/fashion/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-V8Upxsaf3MrDd5zNrYIUe6EurN0\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/3.jpg"
  },
  "/images2/fashion/product/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-LufaxdIhi1jJtkGadfF2mJp3g8I\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/30.jpg"
  },
  "/images2/fashion/product/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-gdzvxTSkrcsnEFACrcLF9Yws6F8\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/31.jpg"
  },
  "/images2/fashion/product/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-I8724CtQEApLgw2MNXHyumw/q24\"",
    "mtime": "2023-04-08T00:16:32.845Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/32.jpg"
  },
  "/images2/fashion/product/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-TrBx/qPMEowKmnqDOs/uhvKIOSU\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/33.jpg"
  },
  "/images2/fashion/product/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-fvDKDtfH+hMrr7KiAnH2NgVBamM\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/34.jpg"
  },
  "/images2/fashion/product/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"18e5-SRWNMY/2fulbMvjiEogB0rRxKmM\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 6373,
    "path": "../public/images2/fashion/product/35.jpg"
  },
  "/images2/fashion/product/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-6EqaGFqRjaEjFte3qpCOmmJBtZo\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/36.jpg"
  },
  "/images2/fashion/product/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-nK+ha8rpKQfq58SR2c2J3McsHJM\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/37.jpg"
  },
  "/images2/fashion/product/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-uj1ZR3lUTHSEl55Bcj4plbq6Uec\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/38.jpg"
  },
  "/images2/fashion/product/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-pCOLnumfOqV8e29And36qs0dbn8\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/39.jpg"
  },
  "/images2/fashion/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-hNihzNB0hK1ws1zSZSFyQL9jlX8\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/4.jpg"
  },
  "/images2/fashion/product/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-GlvYweCV2dZzjP2G6zvmZCzLDr0\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/40.jpg"
  },
  "/images2/fashion/product/41.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-/Mk9opU3CvpqmcNaiW4m3n3gzLo\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/41.jpg"
  },
  "/images2/fashion/product/42.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-EPETr3s5gabHf7szf/vAOvcU3FU\"",
    "mtime": "2023-04-08T00:16:32.842Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/42.jpg"
  },
  "/images2/fashion/product/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-qnGVtagxwMJ99vQuCSbKc3UBfY0\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/43.jpg"
  },
  "/images2/fashion/product/44.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-kCYiMLD0ecf5W0WSAEEFyQ+CzBE\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/44.jpg"
  },
  "/images2/fashion/product/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-FluZNQVyDhmmYrDzyCGhLBoQFBQ\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/45.jpg"
  },
  "/images2/fashion/product/46.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-PT9QzE5+rVJjR94jcGVAGpHoDUk\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/46.jpg"
  },
  "/images2/fashion/product/48.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-EBMsf5s+/GhiPMYsy5HCbMyCgvM\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/48.jpg"
  },
  "/images2/fashion/product/49.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-nI/xnxjiMduUMhXxGQzeQJCbb34\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/49.jpg"
  },
  "/images2/fashion/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-gViNwHRlwE0dBZqfrU/nNiHCzjw\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/5.jpg"
  },
  "/images2/fashion/product/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-oHOcg7jWvjqanrs/BzmeOoJua6U\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/50.jpg"
  },
  "/images2/fashion/product/51.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-q/PDFfy5gxR2beCyy9ekvIWHpoY\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/51.jpg"
  },
  "/images2/fashion/product/52.jpg": {
    "type": "image/jpeg",
    "etag": "\"18e5-SRWNMY/2fulbMvjiEogB0rRxKmM\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 6373,
    "path": "../public/images2/fashion/product/52.jpg"
  },
  "/images2/fashion/product/53.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-7XhC8FMVYvyJfzd6PsdSEejr83A\"",
    "mtime": "2023-04-08T00:16:32.839Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/53.jpg"
  },
  "/images2/fashion/product/54.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-EVWG5f+4LlzF++LbSQ5r6lMkk6c\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/54.jpg"
  },
  "/images2/fashion/product/55.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-oyC3x11vliQ8vpFDBx28vt53xfk\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/55.jpg"
  },
  "/images2/fashion/product/56.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-NQOq8AHDClr/ptyWSsj70rPZP2M\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/56.jpg"
  },
  "/images2/fashion/product/57.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-lFjc7S3r9CTPy16G8n1UIYHmHgA\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/57.jpg"
  },
  "/images2/fashion/product/58.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-/7hxiYbhq1PnMJuHlW4leIDXUmw\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/58.jpg"
  },
  "/images2/fashion/product/59.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-h1ZBGP4Pzsye6pNSQ7x+sxVRaRo\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/59.jpg"
  },
  "/images2/fashion/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-7AadpDza+mKX00BrxC0IUoPQLII\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/6.jpg"
  },
  "/images2/fashion/product/60.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-85EJl7R9XPndqKDT+IMW2zKGe7o\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/60.jpg"
  },
  "/images2/fashion/product/61.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-MN4tFvj/nAZsgD5atDtfX/zd2yg\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/61.jpg"
  },
  "/images2/fashion/product/62.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-Z4uNbMZRjc6tYS1RdrzXB64W0kI\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/62.jpg"
  },
  "/images2/fashion/product/63.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ufE8xQ7bUu851+ppNJVZzSxPxKs\"",
    "mtime": "2023-04-08T00:16:32.835Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/63.jpg"
  },
  "/images2/fashion/product/64.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ox8MgzdZrz7heS3a++9Uch7g2og\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/64.jpg"
  },
  "/images2/fashion/product/65.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-xSaw5bzW4zICkxVqpqSgKFrpEzo\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/65.jpg"
  },
  "/images2/fashion/product/66.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-4FjFBE0SyXJdX8wr3xuRu4mGBwA\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/66.jpg"
  },
  "/images2/fashion/product/67.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-Uj1jOB/1vMLXXqxm3o76IUwuTRk\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/67.jpg"
  },
  "/images2/fashion/product/68.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-X/+V1/fakqQv9+/h47aPFpH1Ql0\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/68.jpg"
  },
  "/images2/fashion/product/69.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-j+Yh7ZxB/1xl6eNyRyQ52qBbWz4\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/69.jpg"
  },
  "/images2/fashion/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-aCudFNVFzt1VbiniuM76b0DT4hY\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/7.jpg"
  },
  "/images2/fashion/product/70.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/70.jpg"
  },
  "/images2/fashion/product/71.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/71.jpg"
  },
  "/images2/fashion/product/72.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/72.jpg"
  },
  "/images2/fashion/product/73.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/73.jpg"
  },
  "/images2/fashion/product/74.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.832Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/74.jpg"
  },
  "/images2/fashion/product/75.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/75.jpg"
  },
  "/images2/fashion/product/76.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/76.jpg"
  },
  "/images2/fashion/product/77.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/77.jpg"
  },
  "/images2/fashion/product/78.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-ssUu6n1hWjwEu9Tkp6n5ONxBocs\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/78.jpg"
  },
  "/images2/fashion/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-/XW/V2FfVifdLYfHTGHHDkf0aHo\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/8.jpg"
  },
  "/images2/fashion/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f99-rvoDcLmqkJ4YzJCWqnopgZwV86M\"",
    "mtime": "2023-04-08T00:16:32.829Z",
    "size": 16281,
    "path": "../public/images2/fashion/product/9.jpg"
  },
  "/images2/flower/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1760-dX/E0nJk7IKHD504/FmgnASiHhw\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 5984,
    "path": "../public/images2/flower/blog/1.jpg"
  },
  "/images2/flower/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1760-dX/E0nJk7IKHD504/FmgnASiHhw\"",
    "mtime": "2023-04-08T00:16:32.812Z",
    "size": 5984,
    "path": "../public/images2/flower/blog/2.jpg"
  },
  "/images2/flower/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1760-dX/E0nJk7IKHD504/FmgnASiHhw\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 5984,
    "path": "../public/images2/flower/blog/3.jpg"
  },
  "/images2/flower/insta/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/1.jpg"
  },
  "/images2/flower/insta/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/2.jpg"
  },
  "/images2/flower/insta/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/3.jpg"
  },
  "/images2/flower/insta/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/4.jpg"
  },
  "/images2/flower/insta/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/5.jpg"
  },
  "/images2/flower/insta/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/6.jpg"
  },
  "/images2/flower/insta/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/7.jpg"
  },
  "/images2/flower/insta/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 2498,
    "path": "../public/images2/flower/insta/8.jpg"
  },
  "/images2/flower/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-UDJNYYamA73HkLPOS+C7mmgAenU\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 5127,
    "path": "../public/images2/flower/product/1.jpg"
  },
  "/images2/flower/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-+MI6VDOb0c0mlwI5nd7H57Vd7ng\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 5127,
    "path": "../public/images2/flower/product/10.jpg"
  },
  "/images2/flower/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-Lc4vTtRFc/Dalh8NBUJ6lNmrrVg\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 5127,
    "path": "../public/images2/flower/product/11.jpg"
  },
  "/images2/flower/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-5YtqiLGWkkDqyEXmSGw3XGp8yNA\"",
    "mtime": "2023-04-08T00:16:32.805Z",
    "size": 5127,
    "path": "../public/images2/flower/product/12.jpg"
  },
  "/images2/flower/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-FFys9/TyF8f9RFnPBiWhVzk11Gs\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/2.jpg"
  },
  "/images2/flower/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-kcQ6z9atTCOnuPqTH1WqGXHeqRw\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/3.jpg"
  },
  "/images2/flower/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-7MV7n6j1kR9DbOmXJFIIUxA+F3k\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/4.jpg"
  },
  "/images2/flower/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-XRFSbeOyHpn0zbV5n4iz455FaO0\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/5.jpg"
  },
  "/images2/flower/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-1IIfoIl2MOgWiSerdf7XhZcUfKE\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/6.jpg"
  },
  "/images2/flower/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-sf8nQkKZWX4E+YmqLTH5ea6mciA\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/7.jpg"
  },
  "/images2/flower/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-LCnPET9GLWkNtonZAoJZJCiwTt4\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/8.jpg"
  },
  "/images2/flower/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"1407-7VITMr8KsW/pu3fNs0Y0X/JkP6g\"",
    "mtime": "2023-04-08T00:16:32.802Z",
    "size": 5127,
    "path": "../public/images2/flower/product/9.jpg"
  },
  "/images2/fragrance/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"104e-E4NOE0iBWKclUGXx3tNzu0fEHmc\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 4174,
    "path": "../public/images2/fragrance/banner/1.jpg"
  },
  "/images2/fragrance/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"104e-E4NOE0iBWKclUGXx3tNzu0fEHmc\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 4174,
    "path": "../public/images2/fragrance/banner/2.jpg"
  },
  "/images2/fragrance/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"104e-E4NOE0iBWKclUGXx3tNzu0fEHmc\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 4174,
    "path": "../public/images2/fragrance/banner/3.jpg"
  },
  "/images2/fragrance/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"104e-E4NOE0iBWKclUGXx3tNzu0fEHmc\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 4174,
    "path": "../public/images2/fragrance/banner/4.jpg"
  },
  "/images2/fragrance/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/1.jpg"
  },
  "/images2/fragrance/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.799Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/2.jpg"
  },
  "/images2/fragrance/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/3.jpg"
  },
  "/images2/fragrance/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/4.jpg"
  },
  "/images2/fragrance/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/5.jpg"
  },
  "/images2/fragrance/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/6.jpg"
  },
  "/images2/fragrance/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/7.jpg"
  },
  "/images2/fragrance/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ab-i8DXAI7AOdt+ENXak/UgwOAwipk\"",
    "mtime": "2023-04-08T00:16:32.795Z",
    "size": 1707,
    "path": "../public/images2/fragrance/pro/8.jpg"
  },
  "/images2/furniture/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7ff5-MJI00+qhMPG25fr/2Fj3kLJu3Xw\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 32757,
    "path": "../public/images2/furniture/banner/1.jpg"
  },
  "/images2/furniture/banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"a6e5-HnKpkKqWbcNiym4l2SqS+z5I42c\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 42725,
    "path": "../public/images2/furniture/banner/10.jpg"
  },
  "/images2/furniture/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"a6e5-HnKpkKqWbcNiym4l2SqS+z5I42c\"",
    "mtime": "2023-04-08T00:16:32.785Z",
    "size": 42725,
    "path": "../public/images2/furniture/banner/11.jpg"
  },
  "/images2/furniture/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"e58-RH51S772E9aoUblKnvK+M6VWyTc\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 3672,
    "path": "../public/images2/furniture/banner/2.jpg"
  },
  "/images2/furniture/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"10d3-tjU2R8DLhhWU1/gTMyJ+hT7h3xE\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 4307,
    "path": "../public/images2/furniture/banner/3.jpg"
  },
  "/images2/furniture/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"10d3-tjU2R8DLhhWU1/gTMyJ+hT7h3xE\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 4307,
    "path": "../public/images2/furniture/banner/4.jpg"
  },
  "/images2/furniture/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b3f-QNp4biA+iXSNwOf421tt7wmLCO0\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 6975,
    "path": "../public/images2/furniture/banner/5.jpg"
  },
  "/images2/furniture/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b3f-QNp4biA+iXSNwOf421tt7wmLCO0\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 6975,
    "path": "../public/images2/furniture/banner/6.jpg"
  },
  "/images2/furniture/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b3f-QNp4biA+iXSNwOf421tt7wmLCO0\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 6975,
    "path": "../public/images2/furniture/banner/7.jpg"
  },
  "/images2/furniture/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac-cYRQbqm4k8XQErSfQqtgemOa0+w\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 4524,
    "path": "../public/images2/furniture/banner/8.jpg"
  },
  "/images2/furniture/banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ac-cYRQbqm4k8XQErSfQqtgemOa0+w\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 4524,
    "path": "../public/images2/furniture/banner/9.jpg"
  },
  "/images2/furniture/banner/vertical.jpg": {
    "type": "image/jpeg",
    "etag": "\"16bb-u2pfCOwGJEAbqR3KfXhMgpAgsaU\"",
    "mtime": "2023-04-08T00:16:32.782Z",
    "size": 5819,
    "path": "../public/images2/furniture/banner/vertical.jpg"
  },
  "/images2/furniture/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1007-SVbjKPgvgEBuu82rjFNTX1AEQVc\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 4103,
    "path": "../public/images2/furniture/blog/1.jpg"
  },
  "/images2/furniture/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1007-SVbjKPgvgEBuu82rjFNTX1AEQVc\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 4103,
    "path": "../public/images2/furniture/blog/2.jpg"
  },
  "/images2/furniture/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1007-SVbjKPgvgEBuu82rjFNTX1AEQVc\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 4103,
    "path": "../public/images2/furniture/blog/3.jpg"
  },
  "/images2/furniture/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1007-SVbjKPgvgEBuu82rjFNTX1AEQVc\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 4103,
    "path": "../public/images2/furniture/blog/4.jpg"
  },
  "/images2/furniture/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1007-SVbjKPgvgEBuu82rjFNTX1AEQVc\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 4103,
    "path": "../public/images2/furniture/blog/5.jpg"
  },
  "/images2/furniture/blog/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1007-SVbjKPgvgEBuu82rjFNTX1AEQVc\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 4103,
    "path": "../public/images2/furniture/blog/6.jpg"
  },
  "/images2/furniture/blog/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1007-SVbjKPgvgEBuu82rjFNTX1AEQVc\"",
    "mtime": "2023-04-08T00:16:32.779Z",
    "size": 4103,
    "path": "../public/images2/furniture/blog/7.jpg"
  },
  "/images2/furniture/dark/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"77a-VERksCTnF0sC9E1PsmuKkO3zg9o\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 1914,
    "path": "../public/images2/furniture/dark/1.jpg"
  },
  "/images2/furniture/dark/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"77a-VERksCTnF0sC9E1PsmuKkO3zg9o\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 1914,
    "path": "../public/images2/furniture/dark/2.jpg"
  },
  "/images2/furniture/dark/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"77a-VERksCTnF0sC9E1PsmuKkO3zg9o\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 1914,
    "path": "../public/images2/furniture/dark/3.jpg"
  },
  "/images2/furniture/dark/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"77a-VERksCTnF0sC9E1PsmuKkO3zg9o\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 1914,
    "path": "../public/images2/furniture/dark/4.jpg"
  },
  "/images2/furniture/dark/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"77a-VERksCTnF0sC9E1PsmuKkO3zg9o\"",
    "mtime": "2023-04-08T00:16:32.775Z",
    "size": 1914,
    "path": "../public/images2/furniture/dark/5.jpg"
  },
  "/images2/furniture/insta/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/1.jpg"
  },
  "/images2/furniture/insta/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/2.jpg"
  },
  "/images2/furniture/insta/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/3.jpg"
  },
  "/images2/furniture/insta/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/4.jpg"
  },
  "/images2/furniture/insta/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/5.jpg"
  },
  "/images2/furniture/insta/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/6.jpg"
  },
  "/images2/furniture/insta/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/7.jpg"
  },
  "/images2/furniture/insta/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"abe-R0ou9x0RnAtjMPXKfWTYKIqE7so\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 2750,
    "path": "../public/images2/furniture/insta/8.jpg"
  },
  "/images2/furniture/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"530-RzRatnQeQahGIvypiyW4u2ZBQCc\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 1328,
    "path": "../public/images2/furniture/pro/1.jpg"
  },
  "/images2/furniture/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"530-RzRatnQeQahGIvypiyW4u2ZBQCc\"",
    "mtime": "2023-04-08T00:16:32.772Z",
    "size": 1328,
    "path": "../public/images2/furniture/pro/2.jpg"
  },
  "/images2/furniture/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"530-RzRatnQeQahGIvypiyW4u2ZBQCc\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 1328,
    "path": "../public/images2/furniture/pro/3.jpg"
  },
  "/images2/furniture/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"530-RzRatnQeQahGIvypiyW4u2ZBQCc\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 1328,
    "path": "../public/images2/furniture/pro/4.jpg"
  },
  "/images2/furniture/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/1.jpg"
  },
  "/images2/furniture/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/10.jpg"
  },
  "/images2/furniture/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/11.jpg"
  },
  "/images2/furniture/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/12.jpg"
  },
  "/images2/furniture/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/13.jpg"
  },
  "/images2/furniture/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/14.jpg"
  },
  "/images2/furniture/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/15.jpg"
  },
  "/images2/furniture/product/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/16.jpg"
  },
  "/images2/furniture/product/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/17.jpg"
  },
  "/images2/furniture/product/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.769Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/18.jpg"
  },
  "/images2/furniture/product/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/19.jpg"
  },
  "/images2/furniture/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/2.jpg"
  },
  "/images2/furniture/product/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/20.jpg"
  },
  "/images2/furniture/product/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/21.jpg"
  },
  "/images2/furniture/product/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/22.jpg"
  },
  "/images2/furniture/product/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/23.jpg"
  },
  "/images2/furniture/product/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/24.jpg"
  },
  "/images2/furniture/product/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/25.jpg"
  },
  "/images2/furniture/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/3.jpg"
  },
  "/images2/furniture/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/4.jpg"
  },
  "/images2/furniture/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/5.jpg"
  },
  "/images2/furniture/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.765Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/6.jpg"
  },
  "/images2/furniture/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.762Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/7.jpg"
  },
  "/images2/furniture/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.762Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/8.jpg"
  },
  "/images2/furniture/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cb8-pTa5y1vFiDOrO1+8BL8+ha/cw9s\"",
    "mtime": "2023-04-08T00:16:32.762Z",
    "size": 7352,
    "path": "../public/images2/furniture/product/9.jpg"
  },
  "/images2/game/banner/1 (2).jpg": {
    "type": "image/jpeg",
    "etag": "\"a25d-7mcnBcqDgvsqGQ1VuDFNxrVlskY\"",
    "mtime": "2023-04-08T00:16:32.759Z",
    "size": 41565,
    "path": "../public/images2/game/banner/1 (2).jpg"
  },
  "/images2/game/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d30-jTSFbZcP4RhFz1SCGkk57CV5p9U\"",
    "mtime": "2023-04-08T00:16:32.759Z",
    "size": 7472,
    "path": "../public/images2/game/banner/1.jpg"
  },
  "/images2/game/banner/2 (2).jpg": {
    "type": "image/jpeg",
    "etag": "\"f6e8-WalM1P9GV90WflRH2qRuQ/SRlBg\"",
    "mtime": "2023-04-08T00:16:32.759Z",
    "size": 63208,
    "path": "../public/images2/game/banner/2 (2).jpg"
  },
  "/images2/game/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d30-jTSFbZcP4RhFz1SCGkk57CV5p9U\"",
    "mtime": "2023-04-08T00:16:32.759Z",
    "size": 7472,
    "path": "../public/images2/game/banner/2.jpg"
  },
  "/images2/game/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-U5oar5v3eU9aAs7mOy23SzqYNfo\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 5309,
    "path": "../public/images2/game/pro/1.jpg"
  },
  "/images2/game/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-HrZtErJOEcW+TerD8qiKoYPh254\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 5309,
    "path": "../public/images2/game/pro/10.jpg"
  },
  "/images2/game/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-r4jV5NPIO/Szj0VZkuM0VoZZSpI\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 5309,
    "path": "../public/images2/game/pro/11.jpg"
  },
  "/images2/game/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-NCYLJLX7VL9xvsYANwNvhzV8oa4\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 5309,
    "path": "../public/images2/game/pro/12.jpg"
  },
  "/images2/game/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-x+hxzSCDSt4iu3HT9TFBQPKRJLY\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 5309,
    "path": "../public/images2/game/pro/13.jpg"
  },
  "/images2/game/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-1LW6hWI/0R6fi+1ZuyDr1k8PVNg\"",
    "mtime": "2023-04-08T00:16:32.755Z",
    "size": 5309,
    "path": "../public/images2/game/pro/14.jpg"
  },
  "/images2/game/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-evgfYv/24cILNCSUaxdLWqGxVwQ\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/15.jpg"
  },
  "/images2/game/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-7tEGui9udPLzI5wkNVUEEqpSSHY\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/16.jpg"
  },
  "/images2/game/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-acfOl1RoN1qz06uiQ1fDVGBhD60\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/17.jpg"
  },
  "/images2/game/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-YuBIU3ifEgA18uD94C0s2OWSQGM\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/18.jpg"
  },
  "/images2/game/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-SIjZJGsmeNj9MoVkGDrLAwldSNw\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/19.jpg"
  },
  "/images2/game/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-8mgeN4M+cJji6aixWTryTqDP8SE\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/2.jpg"
  },
  "/images2/game/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-K4kX+za2kQ2it8uZvQ91EjmvZjM\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/21.jpg"
  },
  "/images2/game/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-RQK/EwlOOKjZwSY9jrAfa1OdwN0\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/22.jpg"
  },
  "/images2/game/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-D2s+1ZUzJIqiAVneplwcgW3NzLM\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/23.jpg"
  },
  "/images2/game/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-/Ibg+bFhC9NuXD0Ne5NnSGvtXHU\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/3.jpg"
  },
  "/images2/game/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-PVURlf9dPZr/8vuu1/rbEX1prx8\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/4.jpg"
  },
  "/images2/game/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-nO/5wf1q71su6LWR3vHnUxwJKsY\"",
    "mtime": "2023-04-08T00:16:32.752Z",
    "size": 5309,
    "path": "../public/images2/game/pro/5.jpg"
  },
  "/images2/game/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-9p2hwnP5C26g39baz3lDWpfCyns\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 5309,
    "path": "../public/images2/game/pro/6.jpg"
  },
  "/images2/game/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-C11ARHiYKwdl6/DEpD0jLxZyXIc\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 5309,
    "path": "../public/images2/game/pro/7.jpg"
  },
  "/images2/game/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-LdnD3fvnt97TJKhCBVbj+JdqSx8\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 5309,
    "path": "../public/images2/game/pro/8.jpg"
  },
  "/images2/game/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"14bd-3JkhSIr7lixClLmSHINPoUAAsEI\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 5309,
    "path": "../public/images2/game/pro/9.jpg"
  },
  "/images2/game/pro/playerunknown-039-s-battlegrounds-1920x1080-playerunknowns-battlegrounds-pubg-mobile-game-hd-16808.jpg": {
    "type": "image/jpeg",
    "etag": "\"c29c-rr9jpmfp8Ua9DuVs5NG8h9oAEI0\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 49820,
    "path": "../public/images2/game/pro/playerunknown-039-s-battlegrounds-1920x1080-playerunknowns-battlegrounds-pubg-mobile-game-hd-16808.jpg"
  },
  "/images2/game/pro/pubg-1920x1080-playerunknowns-battlegrounds-4k-16970.jpg": {
    "type": "image/jpeg",
    "etag": "\"c29c-rr9jpmfp8Ua9DuVs5NG8h9oAEI0\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 49820,
    "path": "../public/images2/game/pro/pubg-1920x1080-playerunknowns-battlegrounds-4k-16970.jpg"
  },
  "/images2/game/pro/the-amazing-spider-man-2-1920x1080-spider-man-electro-rhino-4k-1828.jpg": {
    "type": "image/jpeg",
    "etag": "\"c29c-rr9jpmfp8Ua9DuVs5NG8h9oAEI0\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 49820,
    "path": "../public/images2/game/pro/the-amazing-spider-man-2-1920x1080-spider-man-electro-rhino-4k-1828.jpg"
  },
  "/images2/game/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1629-J8kPBAevPZA+c8KnP71r2eofkkY\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 5673,
    "path": "../public/images2/game/product/1.jpg"
  },
  "/images2/game/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1629-mNhqKlBpgi0hn1i3ANxPLxUIbr0\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 5673,
    "path": "../public/images2/game/product/2.jpg"
  },
  "/images2/game/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1629-GBe5+rleCj9CRuuCAPzgNI4YWfE\"",
    "mtime": "2023-04-08T00:16:32.749Z",
    "size": 5673,
    "path": "../public/images2/game/product/3.jpg"
  },
  "/images2/game/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1629-ggkvm3pDjNccQuGFXoSaca519q4\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 5673,
    "path": "../public/images2/game/product/4.jpg"
  },
  "/images2/goggles/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-UkIAHa8mzgXWUtrUOl+KcS0PL9w\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/1.jpg"
  },
  "/images2/goggles/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-CO5YfWXDzrTlZs/fr2pTERRGPZY\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/10.jpg"
  },
  "/images2/goggles/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-yOtOcEcTc46pD6laKJafMKY6XEk\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/11.jpg"
  },
  "/images2/goggles/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-ctYmk2WnD4wyHOHFhgYCvTdfDfc\"",
    "mtime": "2023-04-08T00:16:32.745Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/12.jpg"
  },
  "/images2/goggles/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-U654fK4gH3fYfyF4iZK0VKmpUNk\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/13.jpg"
  },
  "/images2/goggles/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-P5ooyJGgZjK5sFYK9ah+c9ipU/A\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/14.jpg"
  },
  "/images2/goggles/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-cgtOUUiBoAYNjktMh2dzY1AzmSY\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/15.jpg"
  },
  "/images2/goggles/product/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-LCbqpcr/wD4dP03dw2fdo8JNe+M\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/16.jpg"
  },
  "/images2/goggles/product/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-4crVcMOiA5r3U7HuWYmUTB4kgDc\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/17.jpg"
  },
  "/images2/goggles/product/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-v/ZDDhntzCxzGhx8mET/bX8JOFQ\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/18.jpg"
  },
  "/images2/goggles/product/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-fEK5fe9WvI47UubnjtaODoQ/O6w\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/19.jpg"
  },
  "/images2/goggles/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-DFKmRmb0aD3hI0ruQ8+J+p3feMk\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/2.jpg"
  },
  "/images2/goggles/product/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-3kIi+iq3ZxK4jbO+ENX8Y4BwQTM\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/20.jpg"
  },
  "/images2/goggles/product/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-8kHC2+ShV+YopIyCuJspgk3zl3U\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/21.jpg"
  },
  "/images2/goggles/product/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-aQMf4zIWERsfN06Cb7oZPfJf0aE\"",
    "mtime": "2023-04-08T00:16:32.742Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/22.jpg"
  },
  "/images2/goggles/product/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-Aqz8RjE2tqdTj4BIzMs2lvNjtUM\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/23.jpg"
  },
  "/images2/goggles/product/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-9C3SMaGmtyLQ6OEM2UmIDlddm20\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/24.jpg"
  },
  "/images2/goggles/product/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-HJZe3JzoqyGvvr8b1WQzqlwGEA8\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/25.jpg"
  },
  "/images2/goggles/product/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-xPDy8jCaIxZhupg54XVTbl/fzr0\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/26.jpg"
  },
  "/images2/goggles/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-H6G02EO41FP7wuwFzrKbx9/zdZU\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/3.jpg"
  },
  "/images2/goggles/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-7xfN7cxybSc8KoFn0kP1lotmN6c\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/4.jpg"
  },
  "/images2/goggles/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-KaCljQyFrt1RIv56zOEq7uGojoE\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/5.jpg"
  },
  "/images2/goggles/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-xcBkD4k76dTVNRBZMfS8+UtDrqA\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/6.jpg"
  },
  "/images2/goggles/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-z7J/shQaVWC5yPiXyXPvN/OwgxY\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/7.jpg"
  },
  "/images2/goggles/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1acc-gHI+Y4zLptiGAPNPNeBGv4sWt/E\"",
    "mtime": "2023-04-08T00:16:32.739Z",
    "size": 6860,
    "path": "../public/images2/goggles/product/8.jpg"
  },
  "/images2/goggles/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"4070-fk4fgZ0uOvNr6vJaNGiBa4rtc2A\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 16496,
    "path": "../public/images2/goggles/product/9.jpg"
  },
  "/images2/gradient/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"122a-Npl4NO956J2ioFhOrEsrggnJJJo\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 4650,
    "path": "../public/images2/gradient/banner/1.jpg"
  },
  "/images2/gradient/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"122a-Npl4NO956J2ioFhOrEsrggnJJJo\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 4650,
    "path": "../public/images2/gradient/banner/2.jpg"
  },
  "/images2/gradient/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"122a-Npl4NO956J2ioFhOrEsrggnJJJo\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 4650,
    "path": "../public/images2/gradient/banner/3.jpg"
  },
  "/images2/gradient/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"122a-Npl4NO956J2ioFhOrEsrggnJJJo\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 4650,
    "path": "../public/images2/gradient/banner/4.jpg"
  },
  "/images2/gradient/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"122a-Npl4NO956J2ioFhOrEsrggnJJJo\"",
    "mtime": "2023-04-08T00:16:32.735Z",
    "size": 4650,
    "path": "../public/images2/gradient/banner/5.jpg"
  },
  "/images2/gradient/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1327-K5/LZYPnRb/LgEcwIifOPHHr1Is\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 4903,
    "path": "../public/images2/gradient/blog/1.jpg"
  },
  "/images2/gradient/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1327-K5/LZYPnRb/LgEcwIifOPHHr1Is\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 4903,
    "path": "../public/images2/gradient/blog/2.jpg"
  },
  "/images2/gradient/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1327-K5/LZYPnRb/LgEcwIifOPHHr1Is\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 4903,
    "path": "../public/images2/gradient/blog/3.jpg"
  },
  "/images2/gradient/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1327-K5/LZYPnRb/LgEcwIifOPHHr1Is\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 4903,
    "path": "../public/images2/gradient/blog/4.jpg"
  },
  "/images2/gradient/deal-bg/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"6fe-NCf9nups8iI/tECUAM11fttKhrc\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 1790,
    "path": "../public/images2/gradient/deal-bg/1.jpg"
  },
  "/images2/gradient/deal-bg/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"739-DuyV+dXGyR37VAzddFsTuZgux6Y\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 1849,
    "path": "../public/images2/gradient/deal-bg/2.jpg"
  },
  "/images2/gradient/deal-bg/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"91d-ICXFigMMePRQwJ13+sjVCV7W4f8\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 2333,
    "path": "../public/images2/gradient/deal-bg/3.jpg"
  },
  "/images2/gradient/deal-bg/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"64a-uXMkteFOzKPlh/IxozqdDK9zBI4\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 1610,
    "path": "../public/images2/gradient/deal-bg/4.jpg"
  },
  "/images2/gradient/deal-bg/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"41e-UGnUr6eCKF3snA5fdvIEy6vcyuo\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 1054,
    "path": "../public/images2/gradient/deal-bg/5.jpg"
  },
  "/images2/gradient/deal-bg/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"51d-/Qu819QfpFjJ8CmF6FXk0bZ9De8\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 1309,
    "path": "../public/images2/gradient/deal-bg/6.jpg"
  },
  "/images2/gradient/instagram/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.732Z",
    "size": 2967,
    "path": "../public/images2/gradient/instagram/1.jpg"
  },
  "/images2/gradient/instagram/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 2967,
    "path": "../public/images2/gradient/instagram/2.jpg"
  },
  "/images2/gradient/instagram/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 2967,
    "path": "../public/images2/gradient/instagram/3.jpg"
  },
  "/images2/gradient/instagram/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 2967,
    "path": "../public/images2/gradient/instagram/4.jpg"
  },
  "/images2/gradient/instagram/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 2967,
    "path": "../public/images2/gradient/instagram/5.jpg"
  },
  "/images2/gradient/instagram/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 2967,
    "path": "../public/images2/gradient/instagram/6.jpg"
  },
  "/images2/gradient/instagram/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 2967,
    "path": "../public/images2/gradient/instagram/7.jpg"
  },
  "/images2/gradient/parallax/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"ade1-2MPP65zK1nhQKhXH22Ul0HFnTJw\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 44513,
    "path": "../public/images2/gradient/parallax/1.jpg"
  },
  "/images2/gradient/parallax/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"ade1-2MPP65zK1nhQKhXH22Ul0HFnTJw\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 44513,
    "path": "../public/images2/gradient/parallax/2.jpg"
  },
  "/images2/gradient/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/1.jpg"
  },
  "/images2/gradient/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.729Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/10.jpg"
  },
  "/images2/gradient/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/2.jpg"
  },
  "/images2/gradient/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/3.jpg"
  },
  "/images2/gradient/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/4.jpg"
  },
  "/images2/gradient/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/5.jpg"
  },
  "/images2/gradient/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/6.jpg"
  },
  "/images2/gradient/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/7.jpg"
  },
  "/images2/gradient/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/8.jpg"
  },
  "/images2/gradient/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e0-UQH5erMSu4MGew1P8RQHg/9kbHo\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 1504,
    "path": "../public/images2/gradient/product/9.jpg"
  },
  "/images2/gradient/slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 32147,
    "path": "../public/images2/gradient/slider/1.jpg"
  },
  "/images2/gradient/slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.725Z",
    "size": 32147,
    "path": "../public/images2/gradient/slider/2.jpg"
  },
  "/images2/gym/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"25c1-K422snicJVxL/AUIRPNp6pDle0E\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 9665,
    "path": "../public/images2/gym/banner/1.jpg"
  },
  "/images2/gym/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4dc8-ofpmTBIwV1SXfckUbfql+b7BGL0\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 19912,
    "path": "../public/images2/gym/banner/2.jpg"
  },
  "/images2/gym/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 16688,
    "path": "../public/images2/gym/blog/1.jpg"
  },
  "/images2/gym/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 16688,
    "path": "../public/images2/gym/blog/2.jpg"
  },
  "/images2/gym/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 16688,
    "path": "../public/images2/gym/blog/3.jpg"
  },
  "/images2/gym/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 16688,
    "path": "../public/images2/gym/blog/4.jpg"
  },
  "/images2/gym/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.722Z",
    "size": 16688,
    "path": "../public/images2/gym/blog/5.jpg"
  },
  "/images2/gym/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/1.jpg"
  },
  "/images2/gym/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/10.jpg"
  },
  "/images2/gym/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/11.jpg"
  },
  "/images2/gym/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/12.jpg"
  },
  "/images2/gym/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/13.jpg"
  },
  "/images2/gym/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/14.jpg"
  },
  "/images2/gym/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/15.jpg"
  },
  "/images2/gym/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/16.jpg"
  },
  "/images2/gym/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.719Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/17.jpg"
  },
  "/images2/gym/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/18.jpg"
  },
  "/images2/gym/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/19.jpg"
  },
  "/images2/gym/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/2.jpg"
  },
  "/images2/gym/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/3.jpg"
  },
  "/images2/gym/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/4.jpg"
  },
  "/images2/gym/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/5.jpg"
  },
  "/images2/gym/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/6.jpg"
  },
  "/images2/gym/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/7.jpg"
  },
  "/images2/gym/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/8.jpg"
  },
  "/images2/gym/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"3555-EasxNfI2+jJH9z2S4gNY1JmfoFY\"",
    "mtime": "2023-04-08T00:16:32.715Z",
    "size": 13653,
    "path": "../public/images2/gym/pro/9.jpg"
  },
  "/images2/icon/category/camera.png": {
    "type": "image/png",
    "etag": "\"39c-PUma4GO2YieeuIgVV5Q/auDjHQ8\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 924,
    "path": "../public/images2/icon/category/camera.png"
  },
  "/images2/icon/category/cat1.png": {
    "type": "image/png",
    "etag": "\"534-SRbX3/flnj0GAQn/iKBdFHPUjB4\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1332,
    "path": "../public/images2/icon/category/cat1.png"
  },
  "/images2/icon/category/cat2.png": {
    "type": "image/png",
    "etag": "\"59f-cysdkOQf39Bw4QKVldLFBCOD7og\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1439,
    "path": "../public/images2/icon/category/cat2.png"
  },
  "/images2/icon/category/cat3.png": {
    "type": "image/png",
    "etag": "\"54e-4fpRWeG+BhUkFVKyOXWJSWPhoRs\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1358,
    "path": "../public/images2/icon/category/cat3.png"
  },
  "/images2/icon/category/cat4.png": {
    "type": "image/png",
    "etag": "\"5f8-SPm4cGommTFNhGK1OrHZO+35k7I\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1528,
    "path": "../public/images2/icon/category/cat4.png"
  },
  "/images2/icon/category/cat5.png": {
    "type": "image/png",
    "etag": "\"61e-2/dkoM/rUNj/Wa9CmG4BwyW/BfQ\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1566,
    "path": "../public/images2/icon/category/cat5.png"
  },
  "/images2/icon/category/cat6.png": {
    "type": "image/png",
    "etag": "\"58d-t1AlVHwtj79p5LPU4ZWCWU/JR2A\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1421,
    "path": "../public/images2/icon/category/cat6.png"
  },
  "/images2/icon/category/cat7.png": {
    "type": "image/png",
    "etag": "\"5e9-pj4o6PiDm1LZhix2LG0k/XJXKis\"",
    "mtime": "2023-04-08T00:16:32.672Z",
    "size": 1513,
    "path": "../public/images2/icon/category/cat7.png"
  },
  "/images2/icon/category/demo1.png": {
    "type": "image/png",
    "etag": "\"468-ZnN60DlPdQ2QeQqwlCmlw+QJ6DM\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 1128,
    "path": "../public/images2/icon/category/demo1.png"
  },
  "/images2/icon/category/diamond.png": {
    "type": "image/png",
    "etag": "\"3ef-8ZWGgmafLI5AzJcCsY5cgji2+oA\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 1007,
    "path": "../public/images2/icon/category/diamond.png"
  },
  "/images2/icon/category/gym.png": {
    "type": "image/png",
    "etag": "\"2b3-oR0uRBmnQZx+n6qMH81cS620JG0\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 691,
    "path": "../public/images2/icon/category/gym.png"
  },
  "/images2/icon/category/joint.png": {
    "type": "image/png",
    "etag": "\"2d6-JLgtHX9oVF0Nqs7NNJdr6PsrP/g\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 726,
    "path": "../public/images2/icon/category/joint.png"
  },
  "/images2/icon/category/running.png": {
    "type": "image/png",
    "etag": "\"34b-6bjMM3f1XdQg2QtXYeKtyDuSJUU\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 843,
    "path": "../public/images2/icon/category/running.png"
  },
  "/images2/icon/category/tools.png": {
    "type": "image/png",
    "etag": "\"3da-CpNP2DFJsac8JXRaT5bnofm1eMU\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 986,
    "path": "../public/images2/icon/category/tools.png"
  },
  "/images2/icon/category/watch.png": {
    "type": "image/png",
    "etag": "\"289-2+T+SQsKQ3Mg9HCGuEfiSXKDnf0\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 649,
    "path": "../public/images2/icon/category/watch.png"
  },
  "/images2/icon/dashboard/homework.png": {
    "type": "image/png",
    "etag": "\"f02-5LKY+5VsasYBQvuOlpibb9EOv18\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 3842,
    "path": "../public/images2/icon/dashboard/homework.png"
  },
  "/images2/icon/dashboard/order.png": {
    "type": "image/png",
    "etag": "\"e13-vI7uL4CLi097iS8VyfB60CdtWjQ\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 3603,
    "path": "../public/images2/icon/dashboard/order.png"
  },
  "/images2/icon/dashboard/sale.png": {
    "type": "image/png",
    "etag": "\"a37-1WQhynGo+dWkCkKJCZXXVb7NK+Y\"",
    "mtime": "2023-04-08T00:16:32.669Z",
    "size": 2615,
    "path": "../public/images2/icon/dashboard/sale.png"
  },
  "/images2/icon/layout2/Untitled-1.png": {
    "type": "image/png",
    "etag": "\"426-C0erkxiOb2j1oVD7D6rjHIyBzkE\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1062,
    "path": "../public/images2/icon/layout2/Untitled-1.png"
  },
  "/images2/icon/layout2/add-to-cart.png": {
    "type": "image/png",
    "etag": "\"57c-5nhxDUHQW2D/+IPzhfUATip9Jx8\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1404,
    "path": "../public/images2/icon/layout2/add-to-cart.png"
  },
  "/images2/icon/layout2/add-to-wishlist.png": {
    "type": "image/png",
    "etag": "\"510-d8a6CqVqXke3EM9W5nkzyTGUXP8\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1296,
    "path": "../public/images2/icon/layout2/add-to-wishlist.png"
  },
  "/images2/icon/layout2/bar.jpg": {
    "type": "image/jpeg",
    "etag": "\"55a-9vR0seiJtEZ6lPKpNUV9otDaH4M\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1370,
    "path": "../public/images2/icon/layout2/bar.jpg"
  },
  "/images2/icon/layout2/bar.png": {
    "type": "image/png",
    "etag": "\"424-etVbJ8cf9Gd1F8JVin35wY0h/B8\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1060,
    "path": "../public/images2/icon/layout2/bar.png"
  },
  "/images2/icon/layout2/call.jpg": {
    "type": "image/jpeg",
    "etag": "\"517-1RitwfVUzlLjCaMUSDoQKegZSkU\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1303,
    "path": "../public/images2/icon/layout2/call.jpg"
  },
  "/images2/icon/layout2/call.png": {
    "type": "image/png",
    "etag": "\"44c-rJP2kIbHJSYZh05gVgaUygU6nHw\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1100,
    "path": "../public/images2/icon/layout2/call.png"
  },
  "/images2/icon/layout2/cart.png": {
    "type": "image/png",
    "etag": "\"590-PeYSu3mAc6yg5i7JTnZ3K0b/1PA\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 1424,
    "path": "../public/images2/icon/layout2/cart.png"
  },
  "/images2/icon/layout2/logo.png": {
    "type": "image/png",
    "etag": "\"8ca-BNJoXDjNpI4MMiwWWIJNGlSUYII\"",
    "mtime": "2023-04-08T00:16:32.662Z",
    "size": 2250,
    "path": "../public/images2/icon/layout2/logo.png"
  },
  "/images2/icon/layout2/search.png": {
    "type": "image/png",
    "etag": "\"53e-bSzFxzyaIrj/UK9KejDToGB9cqM\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1342,
    "path": "../public/images2/icon/layout2/search.png"
  },
  "/images2/icon/layout2/setting.png": {
    "type": "image/png",
    "etag": "\"689-Voa2kLagiesyMDhUMmlKwSPw6c0\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1673,
    "path": "../public/images2/icon/layout2/setting.png"
  },
  "/images2/icon/layout2/user.jpg": {
    "type": "image/jpeg",
    "etag": "\"522-nYRXgIPDGJAc/ylR3ZZ5JuCiim8\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1314,
    "path": "../public/images2/icon/layout2/user.jpg"
  },
  "/images2/icon/layout2/user.png": {
    "type": "image/png",
    "etag": "\"458-GxS6SNGYg9yBsFE74xStUyGSoOw\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1112,
    "path": "../public/images2/icon/layout2/user.png"
  },
  "/images2/icon/layout2/wishlist.jpg": {
    "type": "image/jpeg",
    "etag": "\"530-fFXMTOJnYl+8ERaQ160tDreL/RE\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1328,
    "path": "../public/images2/icon/layout2/wishlist.jpg"
  },
  "/images2/icon/layout2/wishlist.png": {
    "type": "image/png",
    "etag": "\"445-WWAnAof+avJgrnHumi7+LJxzuqE\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1093,
    "path": "../public/images2/icon/layout2/wishlist.png"
  },
  "/images2/icon/layout2/zoom.png": {
    "type": "image/png",
    "etag": "\"510-Rl+Ox/NZe2GSI8jeCK3JsFsW524\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1296,
    "path": "../public/images2/icon/layout2/zoom.png"
  },
  "/images2/icon/layout3/footerlogo.png": {
    "type": "image/png",
    "etag": "\"898-gj1UYDMmLSlB3USsoSH36ZjKsbU\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 2200,
    "path": "../public/images2/icon/layout3/footerlogo.png"
  },
  "/images2/icon/layout3/logo.png": {
    "type": "image/png",
    "etag": "\"8d3-CV8GAKhhsAhJWiifNXT9YorbWnw\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 2259,
    "path": "../public/images2/icon/layout3/logo.png"
  },
  "/images2/icon/layout4/cart.png": {
    "type": "image/png",
    "etag": "\"58e-ccWQlopECCk3gCl9zRtjMAyDnGE\"",
    "mtime": "2023-04-08T00:16:32.659Z",
    "size": 1422,
    "path": "../public/images2/icon/layout4/cart.png"
  },
  "/images2/icon/layout4/footerlogo.png": {
    "type": "image/png",
    "etag": "\"4ad-MiZIhTdaI0qQN7Odj4RSGuzN8/I\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 1197,
    "path": "../public/images2/icon/layout4/footerlogo.png"
  },
  "/images2/icon/layout4/logo.png": {
    "type": "image/png",
    "etag": "\"8d4-tDV/NeGXXVH3iG1x+5aDL2GMUgY\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 2260,
    "path": "../public/images2/icon/layout4/logo.png"
  },
  "/images2/icon/layout4/search.png": {
    "type": "image/png",
    "etag": "\"549-6IEqurZ8mk4skx+8ugI5MXhB2JI\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 1353,
    "path": "../public/images2/icon/layout4/search.png"
  },
  "/images2/icon/layout4/setting.png": {
    "type": "image/png",
    "etag": "\"689-qkgOVWKcsclPV8Z45U2auZaJ3Lc\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 1673,
    "path": "../public/images2/icon/layout4/setting.png"
  },
  "/images2/icon/layout5/footer-logo.png": {
    "type": "image/png",
    "etag": "\"64f-qSHz/R5+GCl4Fpc8hxwrq/QEzJA\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 1615,
    "path": "../public/images2/icon/layout5/footer-logo.png"
  },
  "/images2/icon/layout5/logo.png": {
    "type": "image/png",
    "etag": "\"4d7-g86Ny9uaALuZwpgORgPr3p87xrQ\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 1239,
    "path": "../public/images2/icon/layout5/logo.png"
  },
  "/images2/icon/logo/1.png": {
    "type": "image/png",
    "etag": "\"8f5-hCOksQWorbjE3M9wdrSrlaVB+Xw\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 2293,
    "path": "../public/images2/icon/logo/1.png"
  },
  "/images2/icon/logo/10.png": {
    "type": "image/png",
    "etag": "\"572-RMxcktgZte4PcJK45Sij+QDAFdY\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 1394,
    "path": "../public/images2/icon/logo/10.png"
  },
  "/images2/icon/logo/11.png": {
    "type": "image/png",
    "etag": "\"8d1-LIGVul5rb9ueNM2Z68pTj9isNek\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 2257,
    "path": "../public/images2/icon/logo/11.png"
  },
  "/images2/icon/logo/12 - Copy.png": {
    "type": "image/png",
    "etag": "\"8b8-l4hOXwoWSOS75V1s59206KSYTMQ\"",
    "mtime": "2023-04-08T00:16:32.655Z",
    "size": 2232,
    "path": "../public/images2/icon/logo/12 - Copy.png"
  },
  "/images2/icon/logo/12.png": {
    "type": "image/png",
    "etag": "\"8b8-l4hOXwoWSOS75V1s59206KSYTMQ\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2232,
    "path": "../public/images2/icon/logo/12.png"
  },
  "/images2/icon/logo/13.png": {
    "type": "image/png",
    "etag": "\"9b4-+K9mQyg5gPIZHRmotzymiG1Fa9A\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2484,
    "path": "../public/images2/icon/logo/13.png"
  },
  "/images2/icon/logo/14.png": {
    "type": "image/png",
    "etag": "\"97b-8MqNLDFUfoUWA1AUV0L00VyZ6vE\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2427,
    "path": "../public/images2/icon/logo/14.png"
  },
  "/images2/icon/logo/15.png": {
    "type": "image/png",
    "etag": "\"ccc-tXeROWRxMYZJO7aC8a6g2kwGKWo\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 3276,
    "path": "../public/images2/icon/logo/15.png"
  },
  "/images2/icon/logo/16.png": {
    "type": "image/png",
    "etag": "\"9bb-Ylw/PngDo4BdBNZ+v231WXNXAB8\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2491,
    "path": "../public/images2/icon/logo/16.png"
  },
  "/images2/icon/logo/17.png": {
    "type": "image/png",
    "etag": "\"913-gFM28KDiJxMq4lzddpP2D8iTgYY\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2323,
    "path": "../public/images2/icon/logo/17.png"
  },
  "/images2/icon/logo/18.png": {
    "type": "image/png",
    "etag": "\"48a-Bm780S8TfZ9qewRvSlp10tFaGV0\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 1162,
    "path": "../public/images2/icon/logo/18.png"
  },
  "/images2/icon/logo/19.png": {
    "type": "image/png",
    "etag": "\"a0d-ZVlqdLWV+2p7mszWPMomRvCBHkI\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2573,
    "path": "../public/images2/icon/logo/19.png"
  },
  "/images2/icon/logo/2.png": {
    "type": "image/png",
    "etag": "\"8f4-MIebCPgUFpiD4Bouphq1F0PqNX0\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2292,
    "path": "../public/images2/icon/logo/2.png"
  },
  "/images2/icon/logo/20.png": {
    "type": "image/png",
    "etag": "\"9ee-0bN4pe6eud47Ixrg3ydhJCZV9iA\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2542,
    "path": "../public/images2/icon/logo/20.png"
  },
  "/images2/icon/logo/21.png": {
    "type": "image/png",
    "etag": "\"a0f-z9ioKEyLnjPcxwKQr70JaU9/JHI\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2575,
    "path": "../public/images2/icon/logo/21.png"
  },
  "/images2/icon/logo/22.png": {
    "type": "image/png",
    "etag": "\"3fe-2YWSeTEWz4rHAvNLHt+3hmSeJYA\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 1022,
    "path": "../public/images2/icon/logo/22.png"
  },
  "/images2/icon/logo/23.png": {
    "type": "image/png",
    "etag": "\"9f7-ziiPaAqrFpDw89N4CZL3rb32XTY\"",
    "mtime": "2023-04-08T00:16:32.652Z",
    "size": 2551,
    "path": "../public/images2/icon/logo/23.png"
  },
  "/images2/icon/logo/24.png": {
    "type": "image/png",
    "etag": "\"9dd-yUM7bRyzv2k/pkW09+H93Xk61fE\"",
    "mtime": "2023-04-08T00:16:32.649Z",
    "size": 2525,
    "path": "../public/images2/icon/logo/24.png"
  },
  "/images2/icon/logo/25.png": {
    "type": "image/png",
    "etag": "\"980-d/yI/UCk5W7+NGIAy6PS1xESaDo\"",
    "mtime": "2023-04-08T00:16:32.649Z",
    "size": 2432,
    "path": "../public/images2/icon/logo/25.png"
  },
  "/images2/icon/logo/26.png": {
    "type": "image/png",
    "etag": "\"9c4-95ZRhZHKWhU+DarPL6rkA37MrtU\"",
    "mtime": "2023-04-08T00:16:32.649Z",
    "size": 2500,
    "path": "../public/images2/icon/logo/26.png"
  },
  "/images2/icon/logo/27.png": {
    "type": "image/png",
    "etag": "\"986-4zVzraZmJaXFDjNvBmx6yRHTGCU\"",
    "mtime": "2023-04-08T00:16:32.649Z",
    "size": 2438,
    "path": "../public/images2/icon/logo/27.png"
  },
  "/images2/icon/logo/28.png": {
    "type": "image/png",
    "etag": "\"937-TVeAwMVzt0cGqXafbqkR4+ms0lM\"",
    "mtime": "2023-04-08T00:16:32.649Z",
    "size": 2359,
    "path": "../public/images2/icon/logo/28.png"
  },
  "/images2/icon/logo/29.png": {
    "type": "image/png",
    "etag": "\"977-oUE1lIP1TIzvjRnmSqKk2Skt5W8\"",
    "mtime": "2023-04-08T00:16:32.649Z",
    "size": 2423,
    "path": "../public/images2/icon/logo/29.png"
  },
  "/images2/icon/logo/3.png": {
    "type": "image/png",
    "etag": "\"8e4-7ZrQaKH1wBEm7KltURvj3Q+QWcg\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 2276,
    "path": "../public/images2/icon/logo/3.png"
  },
  "/images2/icon/logo/30.png": {
    "type": "image/png",
    "etag": "\"3d9-/sMQOERzfpmBmCP6adqw0TNYWXw\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 985,
    "path": "../public/images2/icon/logo/30.png"
  },
  "/images2/icon/logo/31.png": {
    "type": "image/png",
    "etag": "\"3d1-VUNasobq+hLEVRvL3S6Sb1dfZqQ\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 977,
    "path": "../public/images2/icon/logo/31.png"
  },
  "/images2/icon/logo/32.png": {
    "type": "image/png",
    "etag": "\"3bb-5tdSgiWRKXB2Ko2w/9ri/FzqWDQ\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 955,
    "path": "../public/images2/icon/logo/32.png"
  },
  "/images2/icon/logo/33.png": {
    "type": "image/png",
    "etag": "\"3c1-34EGlL7558c/yfHXeOBwclpk6XY\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 961,
    "path": "../public/images2/icon/logo/33.png"
  },
  "/images2/icon/logo/34.png": {
    "type": "image/png",
    "etag": "\"3b6-48ZZi2gtL476tiQAKjadCsAfVXc\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 950,
    "path": "../public/images2/icon/logo/34.png"
  },
  "/images2/icon/logo/35.png": {
    "type": "image/png",
    "etag": "\"3b6-vi+qjZc38mi3fsGz4zfX0xQywVQ\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 950,
    "path": "../public/images2/icon/logo/35.png"
  },
  "/images2/icon/logo/36.png": {
    "type": "image/png",
    "etag": "\"44d-Qsr5ZiuPCsGGlWEz+CoYOvw/KGs\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 1101,
    "path": "../public/images2/icon/logo/36.png"
  },
  "/images2/icon/logo/4.png": {
    "type": "image/png",
    "etag": "\"8ed-6oXsD2/gMyVQwZIWgRXScSPvyoE\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 2285,
    "path": "../public/images2/icon/logo/4.png"
  },
  "/images2/icon/logo/5.png": {
    "type": "image/png",
    "etag": "\"8f7-nO+m4m/ZTQFsCRDgxSLMsnwlPQw\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 2295,
    "path": "../public/images2/icon/logo/5.png"
  },
  "/images2/icon/logo/6.png": {
    "type": "image/png",
    "etag": "\"8f3-eOptPDSysQOHmL/n4FdOhxm+jwY\"",
    "mtime": "2023-04-08T00:16:32.645Z",
    "size": 2291,
    "path": "../public/images2/icon/logo/6.png"
  },
  "/images2/icon/logo/7.png": {
    "type": "image/png",
    "etag": "\"8f1-77VkT+mv/PiuB7u/q6SFYEjU8M8\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2289,
    "path": "../public/images2/icon/logo/7.png"
  },
  "/images2/icon/logo/8.png": {
    "type": "image/png",
    "etag": "\"8e9-XG73ttqD/KwPmJ5YO7W7tNCCB78\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2281,
    "path": "../public/images2/icon/logo/8.png"
  },
  "/images2/icon/logo/9.png": {
    "type": "image/png",
    "etag": "\"8da-3BnRDDW3K0/vpYHkyhN/cb+PUt4\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2266,
    "path": "../public/images2/icon/logo/9.png"
  },
  "/images2/icon/logo/dfh.png": {
    "type": "image/png",
    "etag": "\"8ea-7Mh8vl7ZynrfVg63clFev8koLZQ\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2282,
    "path": "../public/images2/icon/logo/dfh.png"
  },
  "/images2/icon/logo/f1.png": {
    "type": "image/png",
    "etag": "\"895-kLg3gQuEUrCwZyCqyWesOIahmE8\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2197,
    "path": "../public/images2/icon/logo/f1.png"
  },
  "/images2/icon/logo/f10.png": {
    "type": "image/png",
    "etag": "\"418-TU3tXpWrJ3jeXth99oXsXJdvwcI\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 1048,
    "path": "../public/images2/icon/logo/f10.png"
  },
  "/images2/icon/logo/f11.png": {
    "type": "image/png",
    "etag": "\"3c9-lYIujjt3Nsupg3GSvN+guzhfw+I\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 969,
    "path": "../public/images2/icon/logo/f11.png"
  },
  "/images2/icon/logo/f12.png": {
    "type": "image/png",
    "etag": "\"3c1-PEcGLU1rsM1jsXIgoxMnL3VHUCs\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 961,
    "path": "../public/images2/icon/logo/f12.png"
  },
  "/images2/icon/logo/f13.png": {
    "type": "image/png",
    "etag": "\"3b6-YTbuGTcGXPdL7OtU/1XNFKT/DIA\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 950,
    "path": "../public/images2/icon/logo/f13.png"
  },
  "/images2/icon/logo/f2.png": {
    "type": "image/png",
    "etag": "\"893-7PdzFW9cSHduXOmmf3r6n9RZHMU\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2195,
    "path": "../public/images2/icon/logo/f2.png"
  },
  "/images2/icon/logo/f3.png": {
    "type": "image/png",
    "etag": "\"885-TrnEq92zApH/b22VMIs8PHW2EE4\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2181,
    "path": "../public/images2/icon/logo/f3.png"
  },
  "/images2/icon/logo/f4.png": {
    "type": "image/png",
    "etag": "\"9cd-8gUYb+YxaaJBTyF8juOU3j0/iA0\"",
    "mtime": "2023-04-08T00:16:32.642Z",
    "size": 2509,
    "path": "../public/images2/icon/logo/f4.png"
  },
  "/images2/icon/logo/f5.png": {
    "type": "image/png",
    "etag": "\"9d9-uAIsogW0ppasmjBoe79Zj3KYxcw\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 2521,
    "path": "../public/images2/icon/logo/f5.png"
  },
  "/images2/icon/logo/f6.png": {
    "type": "image/png",
    "etag": "\"9a3-05NS7FJFm2RhXE+oYjqltQuI/VQ\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 2467,
    "path": "../public/images2/icon/logo/f6.png"
  },
  "/images2/icon/logo/f7.png": {
    "type": "image/png",
    "etag": "\"97c-zuoZk9cldqoGHvFUz9nS/GfpXso\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 2428,
    "path": "../public/images2/icon/logo/f7.png"
  },
  "/images2/icon/logo/f8.png": {
    "type": "image/png",
    "etag": "\"41e-mDeE+Z/hUewMC97g5m/O0qmkLTc\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 1054,
    "path": "../public/images2/icon/logo/f8.png"
  },
  "/images2/icon/logo/f9.png": {
    "type": "image/png",
    "etag": "\"42e-wQ/swLxl56yzu7x+0mXtpN37a+0\"",
    "mtime": "2023-04-08T00:16:32.639Z",
    "size": 1070,
    "path": "../public/images2/icon/logo/f9.png"
  },
  "/images2/icon/vegetables/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7c9-LfTCIZbwG32roLBY3wvi7fWrOB4\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 1993,
    "path": "../public/images2/icon/vegetables/1.jpg"
  },
  "/images2/icon/vegetables/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"7c6-iJ7S6OkYw04lNc8eVml7t2YltJo\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 1990,
    "path": "../public/images2/icon/vegetables/2.jpg"
  },
  "/images2/icon/vegetables/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"851-LICFP5IxCS5kRfVD2JwncsanMkQ\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 2129,
    "path": "../public/images2/icon/vegetables/3.jpg"
  },
  "/images2/icon/vegetables/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"7de-qzfsylNKiQ7CZ91xkitT+lRwf28\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 2014,
    "path": "../public/images2/icon/vegetables/4.jpg"
  },
  "/images2/icon/vegetables/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"821-B70tYfN56w8JMBE/IdRkoPoOtTE\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 2081,
    "path": "../public/images2/icon/vegetables/5.jpg"
  },
  "/images2/icon/vegetables/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"8a8-DBB/shGFgZ26J+LGCiFJEB6VmMw\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 2216,
    "path": "../public/images2/icon/vegetables/6.jpg"
  },
  "/images2/icon/vegetables/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"7e0-qqrATTs4WMO15hHQOHk5lwSfeIs\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 2016,
    "path": "../public/images2/icon/vegetables/7.jpg"
  },
  "/images2/icon/vegetables/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"840-qQOKw9MnmBrBLfzLVKMt/FJCzhE\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 2112,
    "path": "../public/images2/icon/vegetables/8.jpg"
  },
  "/images2/icon/vegetables/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"834-wlBH4d/MPlLRO4iZQqJjouU5MZU\"",
    "mtime": "2023-04-08T00:16:32.625Z",
    "size": 2100,
    "path": "../public/images2/icon/vegetables/9.jpg"
  },
  "/images2/icon/white-icon/cart.png": {
    "type": "image/png",
    "etag": "\"405-67VBNeUsjowCffo7MM2GbPv1Vh0\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 1029,
    "path": "../public/images2/icon/white-icon/cart.png"
  },
  "/images2/icon/white-icon/heart.png": {
    "type": "image/png",
    "etag": "\"390-CBAox1NASDlC9ibnsZRbIzl/7GU\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 912,
    "path": "../public/images2/icon/white-icon/heart.png"
  },
  "/images2/icon/white-icon/loupe.png": {
    "type": "image/png",
    "etag": "\"309-sTazhCE6obbyq5XQ4Z5yaWHr7Zc\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 777,
    "path": "../public/images2/icon/white-icon/loupe.png"
  },
  "/images2/icon/white-icon/settings.png": {
    "type": "image/png",
    "etag": "\"370-vR8vWoOiHSFmeIVqAE1YamO8hVo\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 880,
    "path": "../public/images2/icon/white-icon/settings.png"
  },
  "/images2/icon/white-icon/user.png": {
    "type": "image/png",
    "etag": "\"3f7-rMEM7QI1u+370m0RDkjzzjKDelA\"",
    "mtime": "2023-04-08T00:16:32.622Z",
    "size": 1015,
    "path": "../public/images2/icon/white-icon/user.png"
  },
  "/images2/img/small/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"379-DwWJ7bq5a502IzGsUKhwVVhwx10\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 889,
    "path": "../public/images2/img/small/1.jpg"
  },
  "/images2/img/small/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"379-DwWJ7bq5a502IzGsUKhwVVhwx10\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 889,
    "path": "../public/images2/img/small/2.jpg"
  },
  "/images2/img/small/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"379-DwWJ7bq5a502IzGsUKhwVVhwx10\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 889,
    "path": "../public/images2/img/small/3.jpg"
  },
  "/images2/img/small/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"379-DwWJ7bq5a502IzGsUKhwVVhwx10\"",
    "mtime": "2023-04-08T00:16:32.619Z",
    "size": 889,
    "path": "../public/images2/img/small/4.jpg"
  },
  "/images2/jewellery/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2cef-tQnGddSB2vUaBQbFLBvrMJdsnLc\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 11503,
    "path": "../public/images2/jewellery/banner/1.jpg"
  },
  "/images2/jewellery/banner/1_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"10a8-j67HwbHyHOVsh+RJ3XzPmR/+GDQ\"",
    "mtime": "2023-04-08T00:16:32.615Z",
    "size": 4264,
    "path": "../public/images2/jewellery/banner/1_1.jpg"
  },
  "/images2/jewellery/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"10a8-j67HwbHyHOVsh+RJ3XzPmR/+GDQ\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 4264,
    "path": "../public/images2/jewellery/banner/2.jpg"
  },
  "/images2/jewellery/banner/2_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2cef-tQnGddSB2vUaBQbFLBvrMJdsnLc\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 11503,
    "path": "../public/images2/jewellery/banner/2_2.jpg"
  },
  "/images2/jewellery/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"179a-yqG33MbOq2fzw5DLMnKQegNuqLI\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 6042,
    "path": "../public/images2/jewellery/banner/3.jpg"
  },
  "/images2/jewellery/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"179a-yqG33MbOq2fzw5DLMnKQegNuqLI\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 6042,
    "path": "../public/images2/jewellery/banner/4.jpg"
  },
  "/images2/jewellery/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"179a-yqG33MbOq2fzw5DLMnKQegNuqLI\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 6042,
    "path": "../public/images2/jewellery/banner/5.jpg"
  },
  "/images2/jewellery/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 3762,
    "path": "../public/images2/jewellery/banner/6.jpg"
  },
  "/images2/jewellery/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 3762,
    "path": "../public/images2/jewellery/banner/7.jpg"
  },
  "/images2/jewellery/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.612Z",
    "size": 3762,
    "path": "../public/images2/jewellery/banner/8.jpg"
  },
  "/images2/jewellery/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 16266,
    "path": "../public/images2/jewellery/blog/1.jpg"
  },
  "/images2/jewellery/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 16266,
    "path": "../public/images2/jewellery/blog/2.jpg"
  },
  "/images2/jewellery/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 16266,
    "path": "../public/images2/jewellery/blog/3.jpg"
  },
  "/images2/jewellery/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 16266,
    "path": "../public/images2/jewellery/blog/4.jpg"
  },
  "/images2/jewellery/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"101f-wDOnSbgXmUOJLaenUf9UZE59sPQ\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 4127,
    "path": "../public/images2/jewellery/blog/5.jpg"
  },
  "/images2/jewellery/blog/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"101f-wDOnSbgXmUOJLaenUf9UZE59sPQ\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 4127,
    "path": "../public/images2/jewellery/blog/6.jpg"
  },
  "/images2/jewellery/blog/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"101f-wDOnSbgXmUOJLaenUf9UZE59sPQ\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 4127,
    "path": "../public/images2/jewellery/blog/7.jpg"
  },
  "/images2/jewellery/category/1.png": {
    "type": "image/png",
    "etag": "\"1f76-lC0NYTdKf4U0EQdn14hRIXrlj4o\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 8054,
    "path": "../public/images2/jewellery/category/1.png"
  },
  "/images2/jewellery/category/2.png": {
    "type": "image/png",
    "etag": "\"5910-Yx2/TT3rxzpRt+2CeDQtlMqoals\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 22800,
    "path": "../public/images2/jewellery/category/2.png"
  },
  "/images2/jewellery/category/3.png": {
    "type": "image/png",
    "etag": "\"44d7-3H3hcuqHnGMshDF6t8EPN17P+m8\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 17623,
    "path": "../public/images2/jewellery/category/3.png"
  },
  "/images2/jewellery/category/4.png": {
    "type": "image/png",
    "etag": "\"1dc9-+PC1ddMktEzJFsqheG5qODErOAQ\"",
    "mtime": "2023-04-08T00:16:32.609Z",
    "size": 7625,
    "path": "../public/images2/jewellery/category/4.png"
  },
  "/images2/jewellery/home-slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 32147,
    "path": "../public/images2/jewellery/home-slider/1.jpg"
  },
  "/images2/jewellery/home-slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 32147,
    "path": "../public/images2/jewellery/home-slider/2.jpg"
  },
  "/images2/jewellery/home-slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 32147,
    "path": "../public/images2/jewellery/home-slider/3.jpg"
  },
  "/images2/jewellery/home-slider/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d93-PETxR1yWoTVXJiMCAdiQc259lsA\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 32147,
    "path": "../public/images2/jewellery/home-slider/4.jpg"
  },
  "/images2/jewellery/home-slider/sm-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"489-efZUM40WBvKoWcnHc6oRoI37DxU\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 1161,
    "path": "../public/images2/jewellery/home-slider/sm-1.jpg"
  },
  "/images2/jewellery/home-slider/sm-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"489-efZUM40WBvKoWcnHc6oRoI37DxU\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 1161,
    "path": "../public/images2/jewellery/home-slider/sm-2.jpg"
  },
  "/images2/jewellery/icon/avatar.png": {
    "type": "image/png",
    "etag": "\"2f8-3s0X2uC7qHcKB19hNh/yRTJssbw\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 760,
    "path": "../public/images2/jewellery/icon/avatar.png"
  },
  "/images2/jewellery/icon/cart.png": {
    "type": "image/png",
    "etag": "\"243-GvyN4Mwf8CsnP3yG8+A6pak+W40\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 579,
    "path": "../public/images2/jewellery/icon/cart.png"
  },
  "/images2/jewellery/icon/cb.png": {
    "type": "image/png",
    "etag": "\"292-Qxi+Qfir63D34I/tiJRRHJsTb0s\"",
    "mtime": "2023-04-08T00:16:32.605Z",
    "size": 658,
    "path": "../public/images2/jewellery/icon/cb.png"
  },
  "/images2/jewellery/icon/controls.png": {
    "type": "image/png",
    "etag": "\"218-TT5xXPEjTZuF+MxdvQWxLurg/tc\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 536,
    "path": "../public/images2/jewellery/icon/controls.png"
  },
  "/images2/jewellery/icon/gold.jpg": {
    "type": "image/jpeg",
    "etag": "\"158-PaYRJodJ9xQqbHlEkkezm4mXvp4\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 344,
    "path": "../public/images2/jewellery/icon/gold.jpg"
  },
  "/images2/jewellery/icon/heart.png": {
    "type": "image/png",
    "etag": "\"2c0-G8YG+wu/dKIGPOdy2OMEJor6alk\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 704,
    "path": "../public/images2/jewellery/icon/heart.png"
  },
  "/images2/jewellery/icon/rose-gold.jpg": {
    "type": "image/jpeg",
    "etag": "\"199-nl3G/QXJOxTJTK90XzPS8J3N8SE\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 409,
    "path": "../public/images2/jewellery/icon/rose-gold.jpg"
  },
  "/images2/jewellery/icon/search.png": {
    "type": "image/png",
    "etag": "\"27a-17E13g8/JrCcV40SRCpO5girENs\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 634,
    "path": "../public/images2/jewellery/icon/search.png"
  },
  "/images2/jewellery/icon/silver.jpg": {
    "type": "image/jpeg",
    "etag": "\"151-Kw/aZwoXkc1hZqijdv2sCWuF26E\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 337,
    "path": "../public/images2/jewellery/icon/silver.jpg"
  },
  "/images2/jewellery/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-/pwachP3FbcXrRST7+Bcv71V0uU\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/1.jpg"
  },
  "/images2/jewellery/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-+db1hQg82ZuL1COyT+gFgVt2sM0\"",
    "mtime": "2023-04-08T00:16:32.602Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/10.jpg"
  },
  "/images2/jewellery/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-47YVkZiYz0i1DI16VFFhE7S7D1c\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/11.jpg"
  },
  "/images2/jewellery/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-lePxNZYCC48sb+mn+Bm22Lx5hsA\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/12.jpg"
  },
  "/images2/jewellery/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-Xx/bE+OCXOoRAEH8RbMuRV68j6k\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/13.jpg"
  },
  "/images2/jewellery/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-F3S/Cd7qYfQ2pes4sOk9/OggP4Q\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/14.jpg"
  },
  "/images2/jewellery/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-OnKpinDEk8GwY8gENVCWAI8qvWw\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/15.jpg"
  },
  "/images2/jewellery/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-cgfcc7IU8Xv+iJbcZ/fQ0VpS/zU\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/16.jpg"
  },
  "/images2/jewellery/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-/2+9qwnoqHKUCTNvG/eU9znqpqo\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/17.jpg"
  },
  "/images2/jewellery/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-xs3QFMXKwAVOhujsuDFwKB0OENQ\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/18.jpg"
  },
  "/images2/jewellery/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-8Eoc7PyKW1NfEE+8oZeIPdQM3n0\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/19.jpg"
  },
  "/images2/jewellery/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-uTtLmDh1W1IiJIPz1DCkBCfl6uY\"",
    "mtime": "2023-04-08T00:16:32.599Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/2.jpg"
  },
  "/images2/jewellery/pro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-gD2Pz199BS9wkU8WlFAAWXqgjxQ\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/20.jpg"
  },
  "/images2/jewellery/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-PF6v9+vnORZaGI40etIfAU2aRqo\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/21.jpg"
  },
  "/images2/jewellery/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-keeDaPczEVpeKqQyoX6gtvBRjLQ\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/22.jpg"
  },
  "/images2/jewellery/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-hqlI6Y9k244lm1EenVUOHWsKbZM\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/23.jpg"
  },
  "/images2/jewellery/pro/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-J+NS54RbnUzJ+5fvyNcPlnM5+Lc\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/24.jpg"
  },
  "/images2/jewellery/pro/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-oe2XcWRDjHra34vb3IQZwat5LuE\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/25.jpg"
  },
  "/images2/jewellery/pro/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"2fd0-5S+piOSpRI35vf94eihHI8n3ye0\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12240,
    "path": "../public/images2/jewellery/pro/26.jpg"
  },
  "/images2/jewellery/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-Id8GDl5hZqTFyMxyg8h9DKEcm70\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/3.jpg"
  },
  "/images2/jewellery/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-zLgizzHd8sJ0u33pgj3gItW52+s\"",
    "mtime": "2023-04-08T00:16:32.595Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/4.jpg"
  },
  "/images2/jewellery/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-LDHIg888jWq7OoesxaVEAXqZGGs\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/5.jpg"
  },
  "/images2/jewellery/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-G8IXk/VbMJh8GZestsbWG8GYJV0\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/6.jpg"
  },
  "/images2/jewellery/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-We8nrEkAdowlP/CYqyWvBT9+kQA\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/7.jpg"
  },
  "/images2/jewellery/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-9JEcDAkfz5zt90AbK+npDTXxGyc\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/8.jpg"
  },
  "/images2/jewellery/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f88-64pbQTExJhG6Dchl+rv44/sMSNA\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 12168,
    "path": "../public/images2/jewellery/pro/9.jpg"
  },
  "/images2/jewellery/pro-grey/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/1.jpg"
  },
  "/images2/jewellery/pro-grey/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/10.jpg"
  },
  "/images2/jewellery/pro-grey/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/11.jpg"
  },
  "/images2/jewellery/pro-grey/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/12.jpg"
  },
  "/images2/jewellery/pro-grey/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/13.jpg"
  },
  "/images2/jewellery/pro-grey/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.592Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/14.jpg"
  },
  "/images2/jewellery/pro-grey/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/15.jpg"
  },
  "/images2/jewellery/pro-grey/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/16.jpg"
  },
  "/images2/jewellery/pro-grey/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/17.jpg"
  },
  "/images2/jewellery/pro-grey/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/18.jpg"
  },
  "/images2/jewellery/pro-grey/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/19.jpg"
  },
  "/images2/jewellery/pro-grey/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/2.jpg"
  },
  "/images2/jewellery/pro-grey/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/20.jpg"
  },
  "/images2/jewellery/pro-grey/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/21.jpg"
  },
  "/images2/jewellery/pro-grey/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/22.jpg"
  },
  "/images2/jewellery/pro-grey/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/23.jpg"
  },
  "/images2/jewellery/pro-grey/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/24.jpg"
  },
  "/images2/jewellery/pro-grey/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.589Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/25.jpg"
  },
  "/images2/jewellery/pro-grey/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/3.jpg"
  },
  "/images2/jewellery/pro-grey/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/4.jpg"
  },
  "/images2/jewellery/pro-grey/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/5.jpg"
  },
  "/images2/jewellery/pro-grey/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/6.jpg"
  },
  "/images2/jewellery/pro-grey/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/7.jpg"
  },
  "/images2/jewellery/pro-grey/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/8.jpg"
  },
  "/images2/jewellery/pro-grey/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d48-WGAcECXiK7ctBfjHCIVpzbffip4\"",
    "mtime": "2023-04-08T00:16:32.585Z",
    "size": 7496,
    "path": "../public/images2/jewellery/pro-grey/9.jpg"
  },
  "/images2/kids/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-Hm7CE6Pq1FInRe++XNRK5TCe/a0\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 16208,
    "path": "../public/images2/kids/product/1.jpg"
  },
  "/images2/kids/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-04ZAcu21fGEapVl524/90M8RRHs\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 16208,
    "path": "../public/images2/kids/product/10.jpg"
  },
  "/images2/kids/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-qWGT2q/0nYcmXY4HyiWU8CMiDTM\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 16208,
    "path": "../public/images2/kids/product/11.jpg"
  },
  "/images2/kids/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-V0L3xJrNwAIG8HW2f0b0swK+XJc\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 16208,
    "path": "../public/images2/kids/product/12.jpg"
  },
  "/images2/kids/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-hPdJQvlOR+TNEN+Hpd23mCr527c\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 16208,
    "path": "../public/images2/kids/product/13.jpg"
  },
  "/images2/kids/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-i2aS1HmwVs8lMTWBv8fUPJaWU54\"",
    "mtime": "2023-04-08T00:16:32.582Z",
    "size": 16208,
    "path": "../public/images2/kids/product/14.jpg"
  },
  "/images2/kids/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-mMJew67P+gDCM8MEnki2uMKBSOY\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/15.jpg"
  },
  "/images2/kids/product/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-T8N9SlmZ2wjKrbSsER1fxZ3ZyVQ\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/16.jpg"
  },
  "/images2/kids/product/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-1xZ7WOzEUbKuljyfvOoLcRCVmqA\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/17.jpg"
  },
  "/images2/kids/product/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-Dyn0q+tElCZCUJ1/nVqArFGjkJI\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/18.jpg"
  },
  "/images2/kids/product/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-gi0Y720TEGDZnhcXpYUeKiR5cAM\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/19.jpg"
  },
  "/images2/kids/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-gIUZg8MpW0uFriphEuFFAQ9rnvA\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/2.jpg"
  },
  "/images2/kids/product/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-xFeRrFPfowGJl6iP3o+LSXn+AOE\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/20.jpg"
  },
  "/images2/kids/product/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-S1PIT0LPW3on59ecMgYKF9biDxA\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/21.jpg"
  },
  "/images2/kids/product/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-93CIH/72eNW/V1j9j3fJ7ZOY57k\"",
    "mtime": "2023-04-08T00:16:32.579Z",
    "size": 16208,
    "path": "../public/images2/kids/product/22.jpg"
  },
  "/images2/kids/product/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-+WyScLnqBNhxbMY6F1GijTJcpPU\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/23.jpg"
  },
  "/images2/kids/product/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-bzvW1j5W+RyEse21r/kjr4McTw8\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/24.jpg"
  },
  "/images2/kids/product/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-BVRxK+tqwUZs1oWYq2zSpZQa08M\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/25.jpg"
  },
  "/images2/kids/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-Ub237vDkAFrV8cIG4lJB2Hi3AC4\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/3.jpg"
  },
  "/images2/kids/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-m5uVuxO730PEnyT8B6ePZksjJ9o\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/4.jpg"
  },
  "/images2/kids/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-E7eWyPLUsq3ORpNNxGzH1q6Q+jc\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/5.jpg"
  },
  "/images2/kids/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-6OKd5ZP81eizbsj4kdZpPnzrC/0\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/6.jpg"
  },
  "/images2/kids/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-zDqVOIpZWhYNnig+ZYBJ1zVFydY\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/7.jpg"
  },
  "/images2/kids/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-Bo/2/LpOanc0bPPRnZuBxH0BFdU\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/8.jpg"
  },
  "/images2/kids/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f50-Q2SqgoTub69cPzDp9Ky3NRj0rBU\"",
    "mtime": "2023-04-08T00:16:32.575Z",
    "size": 16208,
    "path": "../public/images2/kids/product/9.jpg"
  },
  "/images2/landing-page/admin/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"606e-e61nV6Sijjx7bFmbJ0R0rVraiiA\"",
    "mtime": "2023-04-08T00:16:32.572Z",
    "size": 24686,
    "path": "../public/images2/landing-page/admin/1.jpg"
  },
  "/images2/landing-page/admin/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"7033-2gVvxA45vbiITeVQeM0S9LdLDkI\"",
    "mtime": "2023-04-08T00:16:32.572Z",
    "size": 28723,
    "path": "../public/images2/landing-page/admin/2.jpg"
  },
  "/images2/landing-page/admin/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"53c5-5/N72ipmMdllPYe8rVEmzQ1PHFE\"",
    "mtime": "2023-04-08T00:16:32.572Z",
    "size": 21445,
    "path": "../public/images2/landing-page/admin/3.jpg"
  },
  "/images2/landing-page/admin/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4be2-mpoGLsmT/YxtVlMa/7yWiNdV0Mc\"",
    "mtime": "2023-04-08T00:16:32.572Z",
    "size": 19426,
    "path": "../public/images2/landing-page/admin/4.jpg"
  },
  "/images2/landing-page/cart/cart.gif": {
    "type": "image/gif",
    "etag": "\"3a53d-eqk0/E0B7QTUhQdGKIIFjTOlGfY\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 238909,
    "path": "../public/images2/landing-page/cart/cart.gif"
  },
  "/images2/landing-page/cart/cart.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f61-Fs6zAXyYqa5bCHsjrJ5Be1o86HA\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 24417,
    "path": "../public/images2/landing-page/cart/cart.jpg"
  },
  "/images2/landing-page/demo/bag.jpg": {
    "type": "image/jpeg",
    "etag": "\"118f-V7BTqrP3aL9hNQ3KCr6p3JnPrfg\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 4495,
    "path": "../public/images2/landing-page/demo/bag.jpg"
  },
  "/images2/landing-page/demo/beauty.jpg": {
    "type": "image/jpeg",
    "etag": "\"ca9-j2hz6FhTkdYeQGYjk+NF7loXDns\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 3241,
    "path": "../public/images2/landing-page/demo/beauty.jpg"
  },
  "/images2/landing-page/demo/bicycle.jpg": {
    "type": "image/jpeg",
    "etag": "\"1151-yXVbnf9FL/d3R32n5WH7pnOwL1M\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 4433,
    "path": "../public/images2/landing-page/demo/bicycle.jpg"
  },
  "/images2/landing-page/demo/books.jpg": {
    "type": "image/jpeg",
    "etag": "\"de9-0ibF28BLkOXvVXaFFwnqNRVfjDU\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 3561,
    "path": "../public/images2/landing-page/demo/books.jpg"
  },
  "/images2/landing-page/demo/christmas.jpg": {
    "type": "image/jpeg",
    "etag": "\"12fa-cKGWn/oiL/C3g0XW42Ys5W32mlM\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 4858,
    "path": "../public/images2/landing-page/demo/christmas.jpg"
  },
  "/images2/landing-page/demo/electronics-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"126b-2+cikLDhKNC2Wi4i8f20o54emwE\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 4715,
    "path": "../public/images2/landing-page/demo/electronics-2.jpg"
  },
  "/images2/landing-page/demo/electronics-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1084-GsZbl7186JX+b7hOFfnPD8Nmgyo\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 4228,
    "path": "../public/images2/landing-page/demo/electronics-3.jpg"
  },
  "/images2/landing-page/demo/electronics.jpg": {
    "type": "image/jpeg",
    "etag": "\"ca0-McA0ak7WuDmAStT2bbkVoczf5c4\"",
    "mtime": "2023-04-08T00:16:32.569Z",
    "size": 3232,
    "path": "../public/images2/landing-page/demo/electronics.jpg"
  },
  "/images2/landing-page/demo/fashion-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1159-qCnCzHlA1SM/5bjVvqmpEWa2Eo8\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 4441,
    "path": "../public/images2/landing-page/demo/fashion-2.jpg"
  },
  "/images2/landing-page/demo/fashion-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"11f6-3HzzeAFkwpLUO7Gby/3w/cr9kDk\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 4598,
    "path": "../public/images2/landing-page/demo/fashion-3.jpg"
  },
  "/images2/landing-page/demo/fashion-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"fce-TqAl6fkTzaEfIeQtxsSFHa2MItk\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 4046,
    "path": "../public/images2/landing-page/demo/fashion-4.jpg"
  },
  "/images2/landing-page/demo/fashion-5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1197-VU8Q9ZoVtEikhh0cylBxOBjYL20\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 4503,
    "path": "../public/images2/landing-page/demo/fashion-5.jpg"
  },
  "/images2/landing-page/demo/fashion-6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1143-R+d0qll6xTk5IgrzX78c3pQhqBI\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 4419,
    "path": "../public/images2/landing-page/demo/fashion-6.jpg"
  },
  "/images2/landing-page/demo/fashion-7.jpg": {
    "type": "image/jpeg",
    "etag": "\"19db-h/Y6W8eNOgtNWYavywuWAY7utaQ\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 6619,
    "path": "../public/images2/landing-page/demo/fashion-7.jpg"
  },
  "/images2/landing-page/demo/fashion.jpg": {
    "type": "image/jpeg",
    "etag": "\"1028-JlluB4bNeghAfaUtXgNOP/HjtLU\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 4136,
    "path": "../public/images2/landing-page/demo/fashion.jpg"
  },
  "/images2/landing-page/demo/flower.jpg": {
    "type": "image/jpeg",
    "etag": "\"f19-zeSb+yx/6GQfyQshylvfK9q5gxo\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 3865,
    "path": "../public/images2/landing-page/demo/flower.jpg"
  },
  "/images2/landing-page/demo/full-page.jpg": {
    "type": "image/jpeg",
    "etag": "\"118c-F4s0fEdP4ylc2SQZm071zN+8zGo\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 4492,
    "path": "../public/images2/landing-page/demo/full-page.jpg"
  },
  "/images2/landing-page/demo/furniture-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"f3e-R/9c2wRn1hYr6vtWXOIU/IDRAgo\"",
    "mtime": "2023-04-08T00:16:32.565Z",
    "size": 3902,
    "path": "../public/images2/landing-page/demo/furniture-2.jpg"
  },
  "/images2/landing-page/demo/furniture-dark.jpg": {
    "type": "image/jpeg",
    "etag": "\"b7a-pB2RVzCme9gR1/menh1K3nB2Qns\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 2938,
    "path": "../public/images2/landing-page/demo/furniture-dark.jpg"
  },
  "/images2/landing-page/demo/furniture.jpg": {
    "type": "image/jpeg",
    "etag": "\"dde-8SUgJLHocJKNBU4cndxMBeesyHQ\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 3550,
    "path": "../public/images2/landing-page/demo/furniture.jpg"
  },
  "/images2/landing-page/demo/game.jpg": {
    "type": "image/jpeg",
    "etag": "\"1854-XzJiequRJzQv30zgRWK7u2uQpig\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 6228,
    "path": "../public/images2/landing-page/demo/game.jpg"
  },
  "/images2/landing-page/demo/goggles.jpg": {
    "type": "image/jpeg",
    "etag": "\"f66-UDH28e5Jigk+ZPa9O/f+Qi8dFLA\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 3942,
    "path": "../public/images2/landing-page/demo/goggles.jpg"
  },
  "/images2/landing-page/demo/googles.jpg": {
    "type": "image/jpeg",
    "etag": "\"1073-TVCVuvIIxuiDJVq9eLnIjTay27Y\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 4211,
    "path": "../public/images2/landing-page/demo/googles.jpg"
  },
  "/images2/landing-page/demo/gradient.jpg": {
    "type": "image/jpeg",
    "etag": "\"10ad-hXp2snBIYx3AGERl1YNHfS10COk\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 4269,
    "path": "../public/images2/landing-page/demo/gradient.jpg"
  },
  "/images2/landing-page/demo/gym.jpg": {
    "type": "image/jpeg",
    "etag": "\"14a6-2nHB82hK5AixA3/6BjBjfNNHu90\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 5286,
    "path": "../public/images2/landing-page/demo/gym.jpg"
  },
  "/images2/landing-page/demo/instagram.jpg": {
    "type": "image/jpeg",
    "etag": "\"1828-8Jiox0E+H8UdCSbu4088cyF7qb4\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 6184,
    "path": "../public/images2/landing-page/demo/instagram.jpg"
  },
  "/images2/landing-page/demo/jewellery-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"10f9-3hYRn9ImtGEC0Oym9uhCaHlIxyQ\"",
    "mtime": "2023-04-08T00:16:32.562Z",
    "size": 4345,
    "path": "../public/images2/landing-page/demo/jewellery-2.jpg"
  },
  "/images2/landing-page/demo/jewellery-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0c-PsQNzGYsbiM5eh+FHkhDc6IeT/c\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 3084,
    "path": "../public/images2/landing-page/demo/jewellery-3.jpg"
  },
  "/images2/landing-page/demo/jewellery.jpg": {
    "type": "image/jpeg",
    "etag": "\"cce-qAWy4ptTVqp342lD3sSM8ANYK9U\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 3278,
    "path": "../public/images2/landing-page/demo/jewellery.jpg"
  },
  "/images2/landing-page/demo/kids.jpg": {
    "type": "image/jpeg",
    "etag": "\"de3-9oJ2Lc49C4CJtlqh5tquIWxP0Z0\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 3555,
    "path": "../public/images2/landing-page/demo/kids.jpg"
  },
  "/images2/landing-page/demo/left-sidebar.jpg": {
    "type": "image/jpeg",
    "etag": "\"10b7-4V/znGWutMmJK77GYB54db/szvQ\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 4279,
    "path": "../public/images2/landing-page/demo/left-sidebar.jpg"
  },
  "/images2/landing-page/demo/light.jpg": {
    "type": "image/jpeg",
    "etag": "\"d6a-VuFEiFUOWMFAFln7fjDfEhvI8Tc\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 3434,
    "path": "../public/images2/landing-page/demo/light.jpg"
  },
  "/images2/landing-page/demo/lookbook.jpg": {
    "type": "image/jpeg",
    "etag": "\"1358-Qn0jy0VbC+mC4N2G02a6cqK46v0\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 4952,
    "path": "../public/images2/landing-page/demo/lookbook.jpg"
  },
  "/images2/landing-page/demo/marijuana.jpg": {
    "type": "image/jpeg",
    "etag": "\"13ee-t5HBkmw3VDNX3T2JHwy+POVSIxQ\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 5102,
    "path": "../public/images2/landing-page/demo/marijuana.jpg"
  },
  "/images2/landing-page/demo/marketplace-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"113d-xusBZDvW6TnnD/MukctBFdGNCsU\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 4413,
    "path": "../public/images2/landing-page/demo/marketplace-2.jpg"
  },
  "/images2/landing-page/demo/marketplace-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"f73-sFSf9NYLOqdTnDlKiLwyrMU7McA\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 3955,
    "path": "../public/images2/landing-page/demo/marketplace-3.jpg"
  },
  "/images2/landing-page/demo/marketplace-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"10dd-EfFMy09qtrT6gq2pENHLF6JYkx0\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 4317,
    "path": "../public/images2/landing-page/demo/marketplace-4.jpg"
  },
  "/images2/landing-page/demo/marketplace.jpg": {
    "type": "image/jpeg",
    "etag": "\"13b8-abAsffVNp/zgqLQUCAqnbTo5HxQ\"",
    "mtime": "2023-04-08T00:16:32.559Z",
    "size": 5048,
    "path": "../public/images2/landing-page/demo/marketplace.jpg"
  },
  "/images2/landing-page/demo/medical.jpg": {
    "type": "image/jpeg",
    "etag": "\"d25-ODHDCQcUqtQAgv09jT+Aq89e60I\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 3365,
    "path": "../public/images2/landing-page/demo/medical.jpg"
  },
  "/images2/landing-page/demo/metro.jpg": {
    "type": "image/jpeg",
    "etag": "\"1177-ipga4oX3XpLKQW02u42SbyEypyg\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 4471,
    "path": "../public/images2/landing-page/demo/metro.jpg"
  },
  "/images2/landing-page/demo/nursery.jpg": {
    "type": "image/jpeg",
    "etag": "\"14dd-Vwhg4r0Fc4zNWUiafSvqkqZwNr4\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 5341,
    "path": "../public/images2/landing-page/demo/nursery.jpg"
  },
  "/images2/landing-page/demo/parallax.jpg": {
    "type": "image/jpeg",
    "etag": "\"c0e-PRWuV+rFbu7vGuFBBCPEthR7LfY\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 3086,
    "path": "../public/images2/landing-page/demo/parallax.jpg"
  },
  "/images2/landing-page/demo/perfume.jpg": {
    "type": "image/jpeg",
    "etag": "\"d68-5esSeCQtqE2iKOteugBYn5HdPCI\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 3432,
    "path": "../public/images2/landing-page/demo/perfume.jpg"
  },
  "/images2/landing-page/demo/pets.jpg": {
    "type": "image/jpeg",
    "etag": "\"102b-LxYjwmZMejNcQQBUamJFM9TzoYg\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 4139,
    "path": "../public/images2/landing-page/demo/pets.jpg"
  },
  "/images2/landing-page/demo/shoes.jpg": {
    "type": "image/jpeg",
    "etag": "\"bd9-SVaK7GpQupgWDKQcQJKKW5L8pVo\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 3033,
    "path": "../public/images2/landing-page/demo/shoes.jpg"
  },
  "/images2/landing-page/demo/tools.jpg": {
    "type": "image/jpeg",
    "etag": "\"1387-IGKiVqO90o3vvcv4FSR28ofL8Vo\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 4999,
    "path": "../public/images2/landing-page/demo/tools.jpg"
  },
  "/images2/landing-page/demo/vegetables-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"fc9-arDOuqZHhVedecuvRZ//k+q0uSM\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 4041,
    "path": "../public/images2/landing-page/demo/vegetables-2.jpg"
  },
  "/images2/landing-page/demo/vegetables-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1107-NGMjhaj0IzLcwIBNfq8gpp5nkAY\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 4359,
    "path": "../public/images2/landing-page/demo/vegetables-3.jpg"
  },
  "/images2/landing-page/demo/vegetables.jpg": {
    "type": "image/jpeg",
    "etag": "\"11d4-QxQTW4lttlVxZGTddjGMxlP1Xng\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 4564,
    "path": "../public/images2/landing-page/demo/vegetables.jpg"
  },
  "/images2/landing-page/demo/video-slider.jpg": {
    "type": "image/jpeg",
    "etag": "\"17cb-VB/iiVSrWl3uVAC55webR4Dj1nM\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 6091,
    "path": "../public/images2/landing-page/demo/video-slider.jpg"
  },
  "/images2/landing-page/demo/video.jpg": {
    "type": "image/jpeg",
    "etag": "\"156c-mAD300uqWZ+YgaNsJm8vi+z7L5A\"",
    "mtime": "2023-04-08T00:16:32.555Z",
    "size": 5484,
    "path": "../public/images2/landing-page/demo/video.jpg"
  },
  "/images2/landing-page/demo/watch.jpg": {
    "type": "image/jpeg",
    "etag": "\"d94-DrNY4tfN7lQpI5jdVPBYJ0rzD+I\"",
    "mtime": "2023-04-08T00:16:32.552Z",
    "size": 3476,
    "path": "../public/images2/landing-page/demo/watch.jpg"
  },
  "/images2/landing-page/demo/yoga.jpg": {
    "type": "image/jpeg",
    "etag": "\"1046-mF+2gb3zYgOj+Tzj0GpO3sLWnbk\"",
    "mtime": "2023-04-08T00:16:32.552Z",
    "size": 4166,
    "path": "../public/images2/landing-page/demo/yoga.jpg"
  },
  "/images2/landing-page/demo slider/demo slider.jpg": {
    "type": "image/jpeg",
    "etag": "\"87dca-TAKlU1uvsemPFuh2Qx7SR9OqbT0\"",
    "mtime": "2023-04-08T00:16:32.552Z",
    "size": 556490,
    "path": "../public/images2/landing-page/demo slider/demo slider.jpg"
  },
  "/images2/landing-page/demo slider/main-image.png": {
    "type": "image/png",
    "etag": "\"6f46c-YaBqUb+A3YbX1Nsa4bE0vO+KFOA\"",
    "mtime": "2023-04-08T00:16:32.552Z",
    "size": 455788,
    "path": "../public/images2/landing-page/demo slider/main-image.png"
  },
  "/images2/landing-page/email template/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"237ec-3qqNn7AQwhshxK4XFNid9YfQbak\"",
    "mtime": "2023-04-08T00:16:32.552Z",
    "size": 145388,
    "path": "../public/images2/landing-page/email template/1.jpg"
  },
  "/images2/landing-page/email template/1.png": {
    "type": "image/png",
    "etag": "\"6bc4-9vUbdRsSFnTJCGI2zGdHITu/Kcc\"",
    "mtime": "2023-04-08T00:16:32.549Z",
    "size": 27588,
    "path": "../public/images2/landing-page/email template/1.png"
  },
  "/images2/landing-page/email template/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"145a1-4+3n5pMEuorjocSZzFC6t8XAg5U\"",
    "mtime": "2023-04-08T00:16:32.549Z",
    "size": 83361,
    "path": "../public/images2/landing-page/email template/2.jpg"
  },
  "/images2/landing-page/email template/2.png": {
    "type": "image/png",
    "etag": "\"3d4f-DVpXwBDt4RX7wSfkKp5dGNtnzKE\"",
    "mtime": "2023-04-08T00:16:32.549Z",
    "size": 15695,
    "path": "../public/images2/landing-page/email template/2.png"
  },
  "/images2/landing-page/email template/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a39d-g+o19bnlehsJ+7nax8eJ2XF2u3U\"",
    "mtime": "2023-04-08T00:16:32.549Z",
    "size": 172957,
    "path": "../public/images2/landing-page/email template/3.jpg"
  },
  "/images2/landing-page/email template/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"a1c6-Lu+s2MWDQHOmDrXs3lrffW5vLCM\"",
    "mtime": "2023-04-08T00:16:32.549Z",
    "size": 41414,
    "path": "../public/images2/landing-page/email template/4.jpg"
  },
  "/images2/landing-page/email template/sticker.png": {
    "type": "image/png",
    "etag": "\"30e9-dOAtmjpMqKKZJm4Y+dA0eSABnC8\"",
    "mtime": "2023-04-08T00:16:32.549Z",
    "size": 12521,
    "path": "../public/images2/landing-page/email template/sticker.png"
  },
  "/images2/landing-page/feature/1.5.gif": {
    "type": "image/gif",
    "etag": "\"1de1e-glsdg/GAGhbM4cyr9dunbMbekao\"",
    "mtime": "2023-04-08T00:16:32.545Z",
    "size": 122398,
    "path": "../public/images2/landing-page/feature/1.5.gif"
  },
  "/images2/landing-page/feature/facbook.jpg": {
    "type": "image/jpeg",
    "etag": "\"3b1a-Th5qT6dMYIbCQJmhHJPZIIRixH0\"",
    "mtime": "2023-04-08T00:16:32.545Z",
    "size": 15130,
    "path": "../public/images2/landing-page/feature/facbook.jpg"
  },
  "/images2/landing-page/feature/s1.png": {
    "type": "image/png",
    "etag": "\"1685a-WK2jlIkDn2h0rNg0WIO7Mwww32I\"",
    "mtime": "2023-04-08T00:16:32.545Z",
    "size": 92250,
    "path": "../public/images2/landing-page/feature/s1.png"
  },
  "/images2/landing-page/feature/s2.png": {
    "type": "image/png",
    "etag": "\"1ca04-4op/p9MJeGZzbnL5a/JsDeVlxLU\"",
    "mtime": "2023-04-08T00:16:32.545Z",
    "size": 117252,
    "path": "../public/images2/landing-page/feature/s2.png"
  },
  "/images2/landing-page/feature/s3.png": {
    "type": "image/png",
    "etag": "\"15af7-uIIJc5DlNBWOQve1GNhUjWqMT0o\"",
    "mtime": "2023-04-08T00:16:32.542Z",
    "size": 88823,
    "path": "../public/images2/landing-page/feature/s3.png"
  },
  "/images2/landing-page/feature/s4.png": {
    "type": "image/png",
    "etag": "\"13102-zpxoUaKUP91fGUBgtAlN36VN084\"",
    "mtime": "2023-04-08T00:16:32.542Z",
    "size": 78082,
    "path": "../public/images2/landing-page/feature/s4.png"
  },
  "/images2/landing-page/feature/s5.png": {
    "type": "image/png",
    "etag": "\"6488-W3aPMPdLRjZTu/79UczAvstS22o\"",
    "mtime": "2023-04-08T00:16:32.542Z",
    "size": 25736,
    "path": "../public/images2/landing-page/feature/s5.png"
  },
  "/images2/landing-page/feature/s6.png": {
    "type": "image/png",
    "etag": "\"411-Vup7gg81IrAubinN5+ZlpLevmME\"",
    "mtime": "2023-04-08T00:16:32.542Z",
    "size": 1041,
    "path": "../public/images2/landing-page/feature/s6.png"
  },
  "/images2/landing-page/feature/s7.png": {
    "type": "image/png",
    "etag": "\"268-0w+uUv80LHFRez/9ozxu7xk9Zkg\"",
    "mtime": "2023-04-08T00:16:32.542Z",
    "size": 616,
    "path": "../public/images2/landing-page/feature/s7.png"
  },
  "/images2/landing-page/feature/s8.png": {
    "type": "image/png",
    "etag": "\"380-IjWH+sBhx8CJTyNivWnc+y88Yqc\"",
    "mtime": "2023-04-08T00:16:32.542Z",
    "size": 896,
    "path": "../public/images2/landing-page/feature/s8.png"
  },
  "/images2/landing-page/footer/background.png": {
    "type": "image/png",
    "etag": "\"80b12-mYR7IUXoBJIczjYtu+eaFWNlxgA\"",
    "mtime": "2023-04-08T00:16:32.539Z",
    "size": 527122,
    "path": "../public/images2/landing-page/footer/background.png"
  },
  "/images2/landing-page/footer/star.png": {
    "type": "image/png",
    "etag": "\"2103-4OgP4Ng/yxchLOcIApJW4gsKgK4\"",
    "mtime": "2023-04-08T00:16:32.539Z",
    "size": 8451,
    "path": "../public/images2/landing-page/footer/star.png"
  },
  "/images2/landing-page/gallery/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"a5e7-yNuxIFi+guEYRa0DTH/Rt29FcuI\"",
    "mtime": "2023-04-08T00:16:32.539Z",
    "size": 42471,
    "path": "../public/images2/landing-page/gallery/1.jpg"
  },
  "/images2/landing-page/gallery/1.png": {
    "type": "image/png",
    "etag": "\"19faa-pRPsOU4Rtcc0lxAtf5wyQ6q0p4Y\"",
    "mtime": "2023-04-08T00:16:32.535Z",
    "size": 106410,
    "path": "../public/images2/landing-page/gallery/1.png"
  },
  "/images2/landing-page/gallery/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b9ec-zIGTzRltMPjNZvyJVD8IhmDkTpk\"",
    "mtime": "2023-04-08T00:16:32.535Z",
    "size": 47596,
    "path": "../public/images2/landing-page/gallery/2.jpg"
  },
  "/images2/landing-page/gallery/2.png": {
    "type": "image/png",
    "etag": "\"1691f-TcztADsrZr1LF9bDtKZGUinu+ZE\"",
    "mtime": "2023-04-08T00:16:32.535Z",
    "size": 92447,
    "path": "../public/images2/landing-page/gallery/2.png"
  },
  "/images2/landing-page/header/logo.png": {
    "type": "image/png",
    "etag": "\"125-hpw3xR6xpPSDE2jMhdAxHrYGh1E\"",
    "mtime": "2023-04-08T00:16:32.535Z",
    "size": 293,
    "path": "../public/images2/landing-page/header/logo.png"
  },
  "/images2/landing-page/icon/1.png": {
    "type": "image/png",
    "etag": "\"734-ud2JdaW6CtL9steaNHXHrddARCs\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 1844,
    "path": "../public/images2/landing-page/icon/1.png"
  },
  "/images2/landing-page/icon/10.png": {
    "type": "image/png",
    "etag": "\"a76-norNjd5lHV4Nbs9ApGw/VzCjba4\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 2678,
    "path": "../public/images2/landing-page/icon/10.png"
  },
  "/images2/landing-page/icon/11.png": {
    "type": "image/png",
    "etag": "\"1444-b/IaM2uSCw+CnQM9dzthDoSk8sA\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 5188,
    "path": "../public/images2/landing-page/icon/11.png"
  },
  "/images2/landing-page/icon/12.png": {
    "type": "image/png",
    "etag": "\"13b9-SyLk/bMgNvd/SwewNoi1JYNCaEA\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 5049,
    "path": "../public/images2/landing-page/icon/12.png"
  },
  "/images2/landing-page/icon/13.png": {
    "type": "image/png",
    "etag": "\"9c5-vPrLMiCzqFuD+3ytGsjV2KR4/R8\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 2501,
    "path": "../public/images2/landing-page/icon/13.png"
  },
  "/images2/landing-page/icon/14.png": {
    "type": "image/png",
    "etag": "\"f23-ytp7jCvskeCpE52I3iY7hcfRqoY\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 3875,
    "path": "../public/images2/landing-page/icon/14.png"
  },
  "/images2/landing-page/icon/15.png": {
    "type": "image/png",
    "etag": "\"d58-roiCWl0ojUyq/ZmtIRRbv9uXw3E\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 3416,
    "path": "../public/images2/landing-page/icon/15.png"
  },
  "/images2/landing-page/icon/16.png": {
    "type": "image/png",
    "etag": "\"89d-kO0ihEmp8PYdY1QN302YK0kHde8\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 2205,
    "path": "../public/images2/landing-page/icon/16.png"
  },
  "/images2/landing-page/icon/17.png": {
    "type": "image/png",
    "etag": "\"9f7-V16xJ9sdd9IUme9Tw7KTnON2tmk\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 2551,
    "path": "../public/images2/landing-page/icon/17.png"
  },
  "/images2/landing-page/icon/18.png": {
    "type": "image/png",
    "etag": "\"a89-VgScRUnX0VkatHFMAvM1fpfdAkM\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 2697,
    "path": "../public/images2/landing-page/icon/18.png"
  },
  "/images2/landing-page/icon/19.png": {
    "type": "image/png",
    "etag": "\"c65-bSiskPSZm2WEzzfqhWeTRiMxIaU\"",
    "mtime": "2023-04-08T00:16:32.532Z",
    "size": 3173,
    "path": "../public/images2/landing-page/icon/19.png"
  },
  "/images2/landing-page/icon/2.png": {
    "type": "image/png",
    "etag": "\"d1b-bjhOZVKcn49NBpUkce09tL/0I+s\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 3355,
    "path": "../public/images2/landing-page/icon/2.png"
  },
  "/images2/landing-page/icon/20.png": {
    "type": "image/png",
    "etag": "\"8f6-F20K/cl0y4+l0PxCf6rALPPlMFY\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 2294,
    "path": "../public/images2/landing-page/icon/20.png"
  },
  "/images2/landing-page/icon/21.png": {
    "type": "image/png",
    "etag": "\"1649-bJbqqHNzsL3nZTVjoU7DLmQnqXg\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 5705,
    "path": "../public/images2/landing-page/icon/21.png"
  },
  "/images2/landing-page/icon/22.png": {
    "type": "image/png",
    "etag": "\"e91-/c6orDtCZ3Dku+aqXICbCdGnb1U\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 3729,
    "path": "../public/images2/landing-page/icon/22.png"
  },
  "/images2/landing-page/icon/23.png": {
    "type": "image/png",
    "etag": "\"cc8-LGKJgCgiBaBXkCkdUKQHUM6dhOQ\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 3272,
    "path": "../public/images2/landing-page/icon/23.png"
  },
  "/images2/landing-page/icon/3.png": {
    "type": "image/png",
    "etag": "\"19a4-Jii/RHhXbkX0ZpOlKGfDYf9WyOc\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 6564,
    "path": "../public/images2/landing-page/icon/3.png"
  },
  "/images2/landing-page/icon/4.png": {
    "type": "image/png",
    "etag": "\"85a-64awv4GHNEnlZ7Px5pEU8cxlGvM\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 2138,
    "path": "../public/images2/landing-page/icon/4.png"
  },
  "/images2/landing-page/icon/5.png": {
    "type": "image/png",
    "etag": "\"71a-3SNw6X64rQiG/ZYmcopx6XAr/Tg\"",
    "mtime": "2023-04-08T00:16:32.529Z",
    "size": 1818,
    "path": "../public/images2/landing-page/icon/5.png"
  },
  "/images2/landing-page/icon/6.png": {
    "type": "image/png",
    "etag": "\"d67-w1XvLc8440usrK02c/jyD2VZiRo\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 3431,
    "path": "../public/images2/landing-page/icon/6.png"
  },
  "/images2/landing-page/icon/7.png": {
    "type": "image/png",
    "etag": "\"1437-uQBjtBqgtrYV5qcnN2NoMMnNkJY\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 5175,
    "path": "../public/images2/landing-page/icon/7.png"
  },
  "/images2/landing-page/icon/8.png": {
    "type": "image/png",
    "etag": "\"dcd-IT4ZuCYgDUQgtMUJGw700vDVYes\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 3533,
    "path": "../public/images2/landing-page/icon/8.png"
  },
  "/images2/landing-page/icon/9.png": {
    "type": "image/png",
    "etag": "\"95e-/TMR3nBp4zqoiYKN6kFp2+mUp+E\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 2398,
    "path": "../public/images2/landing-page/icon/9.png"
  },
  "/images2/landing-page/icon-image/1.png": {
    "type": "image/png",
    "etag": "\"59c-/mRQ5pOIZAHLWO4cWZPLKJrRXZI\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 1436,
    "path": "../public/images2/landing-page/icon-image/1.png"
  },
  "/images2/landing-page/icon-image/10.png": {
    "type": "image/png",
    "etag": "\"565-8rg/Xlg07QKAVmq8aQIl+muM51k\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 1381,
    "path": "../public/images2/landing-page/icon-image/10.png"
  },
  "/images2/landing-page/icon-image/11.png": {
    "type": "image/png",
    "etag": "\"c93-bWiCvZRxdCNIpldvbq0fexascDA\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 3219,
    "path": "../public/images2/landing-page/icon-image/11.png"
  },
  "/images2/landing-page/icon-image/12.png": {
    "type": "image/png",
    "etag": "\"eea-kEWNsKbrY94cwBzo5aRYRTPbfAo\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 3818,
    "path": "../public/images2/landing-page/icon-image/12.png"
  },
  "/images2/landing-page/icon-image/13.png": {
    "type": "image/png",
    "etag": "\"9db-R2Jb/W6BCP6K0V90WRt9Azibnog\"",
    "mtime": "2023-04-08T00:16:32.525Z",
    "size": 2523,
    "path": "../public/images2/landing-page/icon-image/13.png"
  },
  "/images2/landing-page/icon-image/14.png": {
    "type": "image/png",
    "etag": "\"8fd-hSmrTWCMB4L+71FMR7nptSJa4fo\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 2301,
    "path": "../public/images2/landing-page/icon-image/14.png"
  },
  "/images2/landing-page/icon-image/15.png": {
    "type": "image/png",
    "etag": "\"8f4-aQ7KAP+bMpQoN5gVu74DtNa4jgY\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 2292,
    "path": "../public/images2/landing-page/icon-image/15.png"
  },
  "/images2/landing-page/icon-image/16.png": {
    "type": "image/png",
    "etag": "\"10c9-HHR5XbHhwFNHlp+SvKQH7cI4q4k\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 4297,
    "path": "../public/images2/landing-page/icon-image/16.png"
  },
  "/images2/landing-page/icon-image/17.png": {
    "type": "image/png",
    "etag": "\"6c9-uKDfJdu46674xNR/zdH0n78iJ44\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 1737,
    "path": "../public/images2/landing-page/icon-image/17.png"
  },
  "/images2/landing-page/icon-image/18.png": {
    "type": "image/png",
    "etag": "\"de1-kYdZhk8ggtoaLObFMkpujPi69Vo\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 3553,
    "path": "../public/images2/landing-page/icon-image/18.png"
  },
  "/images2/landing-page/icon-image/2.png": {
    "type": "image/png",
    "etag": "\"9f5-qhhcJWSTjCRGMOykCzCAEMMkKAE\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 2549,
    "path": "../public/images2/landing-page/icon-image/2.png"
  },
  "/images2/landing-page/icon-image/3.png": {
    "type": "image/png",
    "etag": "\"19cf-ysk0czsgePoBMB2dAyWC1iGh7pI\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 6607,
    "path": "../public/images2/landing-page/icon-image/3.png"
  },
  "/images2/landing-page/icon-image/4.png": {
    "type": "image/png",
    "etag": "\"88f-PlcQkqBVbRKVL81dORaJJai/VxA\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 2191,
    "path": "../public/images2/landing-page/icon-image/4.png"
  },
  "/images2/landing-page/icon-image/5.png": {
    "type": "image/png",
    "etag": "\"9ce-QHjCCUEhB66V1S50L20jF1vzvHw\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 2510,
    "path": "../public/images2/landing-page/icon-image/5.png"
  },
  "/images2/landing-page/icon-image/6.png": {
    "type": "image/png",
    "etag": "\"888-OuyamnKwGvr9ZWsGMrWPfz9+3FE\"",
    "mtime": "2023-04-08T00:16:32.522Z",
    "size": 2184,
    "path": "../public/images2/landing-page/icon-image/6.png"
  },
  "/images2/landing-page/icon-image/7.png": {
    "type": "image/png",
    "etag": "\"d32-U2gP8CW/Bphg/bWyEjIrEyKxHC0\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 3378,
    "path": "../public/images2/landing-page/icon-image/7.png"
  },
  "/images2/landing-page/icon-image/8.png": {
    "type": "image/png",
    "etag": "\"15dc-DkFVXcgTrxcRxL+lrtLeyrPXdME\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 5596,
    "path": "../public/images2/landing-page/icon-image/8.png"
  },
  "/images2/landing-page/icon-image/9.png": {
    "type": "image/png",
    "etag": "\"1020-qqs+RIUkOozerknW0ORUX+Qfptc\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 4128,
    "path": "../public/images2/landing-page/icon-image/9.png"
  },
  "/images2/landing-page/icon-image/logo.png": {
    "type": "image/png",
    "etag": "\"aee-p2W1Mm71q6QqYsDLiOT4GeDBobQ\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 2798,
    "path": "../public/images2/landing-page/icon-image/logo.png"
  },
  "/images2/landing-page/popup type/popup.png": {
    "type": "image/png",
    "etag": "\"6d988-1E3ceqgIEbIMqdbwmd/LvWBG/gM\"",
    "mtime": "2023-04-08T00:16:32.512Z",
    "size": 448904,
    "path": "../public/images2/landing-page/popup type/popup.png"
  },
  "/images2/landing-page/main-features/Dark-light.png": {
    "type": "image/png",
    "etag": "\"7116-QVH/WBigsKUrZpTqzYsIzLtUD54\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 28950,
    "path": "../public/images2/landing-page/main-features/Dark-light.png"
  },
  "/images2/landing-page/main-features/New Project (1).jpg": {
    "type": "image/jpeg",
    "etag": "\"338b-raNqyoH64qlZOUh16QKWo3GbK+E\"",
    "mtime": "2023-04-08T00:16:32.519Z",
    "size": 13195,
    "path": "../public/images2/landing-page/main-features/New Project (1).jpg"
  },
  "/images2/landing-page/main-features/Unlimited-product-size.png": {
    "type": "image/png",
    "etag": "\"623a-JVRc/YXO1S/4W/SynsRqNLLtSEs\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 25146,
    "path": "../public/images2/landing-page/main-features/Unlimited-product-size.png"
  },
  "/images2/landing-page/main-features/color-picker.jpg": {
    "type": "image/jpeg",
    "etag": "\"34c9-Vm4d85y6tiq3uPCX0PFWKFHIJ6c\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 13513,
    "path": "../public/images2/landing-page/main-features/color-picker.jpg"
  },
  "/images2/landing-page/main-features/dashboard.png": {
    "type": "image/png",
    "etag": "\"47e2-CzzOfEMoWnRtoggvfdLDP1aWh9w\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 18402,
    "path": "../public/images2/landing-page/main-features/dashboard.png"
  },
  "/images2/landing-page/main-features/demo.png": {
    "type": "image/png",
    "etag": "\"864c-RvJnYn3Br045FTYceAe1nBOYMtc\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 34380,
    "path": "../public/images2/landing-page/main-features/demo.png"
  },
  "/images2/landing-page/main-features/dummy.jpg": {
    "type": "image/jpeg",
    "etag": "\"3662-APHbiZ8MoiUe1r5qH1n7U4iVl5Q\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 13922,
    "path": "../public/images2/landing-page/main-features/dummy.jpg"
  },
  "/images2/landing-page/main-features/email.png": {
    "type": "image/png",
    "etag": "\"7967-lOmeMnqkKluxZxyqYkTsqzta/jY\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 31079,
    "path": "../public/images2/landing-page/main-features/email.png"
  },
  "/images2/landing-page/main-features/invoice.jpg": {
    "type": "image/jpeg",
    "etag": "\"3de3-EQwo/YySpI+RHjibiRCFvdiwFkM\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 15843,
    "path": "../public/images2/landing-page/main-features/invoice.jpg"
  },
  "/images2/landing-page/main-features/lazy.png": {
    "type": "image/png",
    "etag": "\"862e-epJEdYjNUVTXi14wigfdFZUFUnY\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 34350,
    "path": "../public/images2/landing-page/main-features/lazy.png"
  },
  "/images2/landing-page/main-features/portfoio.png": {
    "type": "image/png",
    "etag": "\"c36a-nj9lHLm9jRJ3CnnN07etciGWwHQ\"",
    "mtime": "2023-04-08T00:16:32.515Z",
    "size": 50026,
    "path": "../public/images2/landing-page/main-features/portfoio.png"
  },
  "/images2/landing-page/main-features/rtl.png": {
    "type": "image/png",
    "etag": "\"9269-LxJOeGsuaR8inUDsaflIji/nqGc\"",
    "mtime": "2023-04-08T00:16:32.512Z",
    "size": 37481,
    "path": "../public/images2/landing-page/main-features/rtl.png"
  },
  "/images2/landing-page/main-features/skeleton.jpg": {
    "type": "image/jpeg",
    "etag": "\"de3-PVaXr+0zs1lE853bi9h6/QHU+Q4\"",
    "mtime": "2023-04-08T00:16:32.512Z",
    "size": 3555,
    "path": "../public/images2/landing-page/main-features/skeleton.jpg"
  },
  "/images2/landing-page/main-features/vendor.jpg": {
    "type": "image/jpeg",
    "etag": "\"3582-U1kcdOQgWVdvj6jbkcq+3bVSoYY\"",
    "mtime": "2023-04-08T00:16:32.512Z",
    "size": 13698,
    "path": "../public/images2/landing-page/main-features/vendor.jpg"
  },
  "/images2/landing-page/rate/logo.png": {
    "type": "image/png",
    "etag": "\"41a-lizoViMDi3OWjpLc+7+EFPFZnrs\"",
    "mtime": "2023-04-08T00:16:32.512Z",
    "size": 1050,
    "path": "../public/images2/landing-page/rate/logo.png"
  },
  "/images2/landing-page/slider/1.png": {
    "type": "image/png",
    "etag": "\"15f7-5Km/xYLOB+pjH4JQyQjrtbuKCak\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 5623,
    "path": "../public/images2/landing-page/slider/1.png"
  },
  "/images2/landing-page/slider/10.png": {
    "type": "image/png",
    "etag": "\"5fa0-intoAEP5EksGMDX5iaZuEFWpiWA\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 24480,
    "path": "../public/images2/landing-page/slider/10.png"
  },
  "/images2/landing-page/slider/11.png": {
    "type": "image/png",
    "etag": "\"709c-bRLIy+gA4fy6q8FnUwgpR/Q4BDM\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 28828,
    "path": "../public/images2/landing-page/slider/11.png"
  },
  "/images2/landing-page/slider/2.png": {
    "type": "image/png",
    "etag": "\"48f5-303kc0qlClXfHcQzd/l/XYbsJvo\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 18677,
    "path": "../public/images2/landing-page/slider/2.png"
  },
  "/images2/landing-page/slider/3.png": {
    "type": "image/png",
    "etag": "\"76d9-+DTw1m47Ble8yyJ+QYTGpGU8fzU\"",
    "mtime": "2023-04-08T00:16:32.509Z",
    "size": 30425,
    "path": "../public/images2/landing-page/slider/3.png"
  },
  "/images2/landing-page/slider/4.png": {
    "type": "image/png",
    "etag": "\"2427-nxgUC1JCkqRo2onqUZN/96TXMPM\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 9255,
    "path": "../public/images2/landing-page/slider/4.png"
  },
  "/images2/landing-page/slider/5.png": {
    "type": "image/png",
    "etag": "\"2b8f-cnNsy8YU0tt/7e1iP0EMGkk2ku4\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 11151,
    "path": "../public/images2/landing-page/slider/5.png"
  },
  "/images2/landing-page/slider/55.png": {
    "type": "image/png",
    "etag": "\"2b13-i/aZk/Wf4mwge1isk+GXS9viM70\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 11027,
    "path": "../public/images2/landing-page/slider/55.png"
  },
  "/images2/landing-page/slider/6.png": {
    "type": "image/png",
    "etag": "\"1dbe-PDOTn7eZpgGQnNQ2Kon/5uU3ENk\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 7614,
    "path": "../public/images2/landing-page/slider/6.png"
  },
  "/images2/landing-page/slider/7.png": {
    "type": "image/png",
    "etag": "\"3524-tFpAUAzjCt9uQa/fNgklhUpxqRE\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 13604,
    "path": "../public/images2/landing-page/slider/7.png"
  },
  "/images2/landing-page/slider/8.png": {
    "type": "image/png",
    "etag": "\"35dd-Ai3hJ++QQBrpLTuCR0plHuGdHcw\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 13789,
    "path": "../public/images2/landing-page/slider/8.png"
  },
  "/images2/landing-page/slider/9.png": {
    "type": "image/png",
    "etag": "\"21e1-zmsp/VdDZG97SMR7DxA+Bsf5DuI\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 8673,
    "path": "../public/images2/landing-page/slider/9.png"
  },
  "/images2/landing-page/slider/background.jpg": {
    "type": "image/jpeg",
    "etag": "\"88f2-PSuappXuLyrcFHoG+kM6eXNcv3Q\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 35058,
    "path": "../public/images2/landing-page/slider/background.jpg"
  },
  "/images2/landing-page/slider/leaf-1.png": {
    "type": "image/png",
    "etag": "\"23dd-8NV/YmMGj4r4pibxXsUOXvLaMi0\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 9181,
    "path": "../public/images2/landing-page/slider/leaf-1.png"
  },
  "/images2/landing-page/slider/leaf-2.png": {
    "type": "image/png",
    "etag": "\"2bb5-iI8FwtLzxo+UGlo3JjAXRkr0z3w\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 11189,
    "path": "../public/images2/landing-page/slider/leaf-2.png"
  },
  "/images2/landing-page/slider/leaf-3.png": {
    "type": "image/png",
    "etag": "\"8653-LpLPDcUjGbp+5znEPX7F+Xk8KzE\"",
    "mtime": "2023-04-08T00:16:32.505Z",
    "size": 34387,
    "path": "../public/images2/landing-page/slider/leaf-3.png"
  },
  "/images2/landing-page/special_features/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"6223-1xuftsTYkxWX7AVh4iRQDNWEceg\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 25123,
    "path": "../public/images2/landing-page/special_features/1.jpg"
  },
  "/images2/landing-page/special_features/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"8d7b-+KLTKbom17VSxnbt7lD7c2oHiuk\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 36219,
    "path": "../public/images2/landing-page/special_features/10.jpg"
  },
  "/images2/landing-page/special_features/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"6682-hrQdcVuVOU7igZrLaX4LP717yKs\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 26242,
    "path": "../public/images2/landing-page/special_features/11.jpg"
  },
  "/images2/landing-page/special_features/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"7015-RG063BCjfuDUSeBblhu+Qiu/35Q\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 28693,
    "path": "../public/images2/landing-page/special_features/12.jpg"
  },
  "/images2/landing-page/special_features/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"4857-or8ePayNV+Npbk1D4nwYrC7ghY8\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 18519,
    "path": "../public/images2/landing-page/special_features/13.jpg"
  },
  "/images2/landing-page/special_features/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"61ec-+oLKWb6tGqtfvTg/Q5M/P5RcIFo\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 25068,
    "path": "../public/images2/landing-page/special_features/14.jpg"
  },
  "/images2/landing-page/special_features/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b60-enPUFXfPsjUKY/H+f6PvuSEehds\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 19296,
    "path": "../public/images2/landing-page/special_features/15.jpg"
  },
  "/images2/landing-page/special_features/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"67b6-utFox2Ha5ay1XBHLDRHVR4uknZk\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 26550,
    "path": "../public/images2/landing-page/special_features/16.jpg"
  },
  "/images2/landing-page/special_features/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"7802-XR72xhs+GtfcGzkblpo8dKRff+0\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 30722,
    "path": "../public/images2/landing-page/special_features/17.jpg"
  },
  "/images2/landing-page/special_features/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"7dc4-v4Plcbc1NpyR2sBTQFnhs4XWE0A\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 32196,
    "path": "../public/images2/landing-page/special_features/18.jpg"
  },
  "/images2/landing-page/special_features/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"7abd-1hrrbtbyFAWqwg4hFr3NC9Ck54M\"",
    "mtime": "2023-04-08T00:16:32.502Z",
    "size": 31421,
    "path": "../public/images2/landing-page/special_features/19.jpg"
  },
  "/images2/landing-page/special_features/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"a257-pEWXcEz1TI7XXBIY/V2txWnxHLo\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 41559,
    "path": "../public/images2/landing-page/special_features/2.jpg"
  },
  "/images2/landing-page/special_features/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"5237-Ohd+UxAz4h67PNL1d5+p+AL1od0\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 21047,
    "path": "../public/images2/landing-page/special_features/20.jpg"
  },
  "/images2/landing-page/special_features/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"d6f0-Gl1PiUaPo3iTecK8pKAhdNNmCkE\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 55024,
    "path": "../public/images2/landing-page/special_features/21.jpg"
  },
  "/images2/landing-page/special_features/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"99b0-jFQOMeeYuU/8sIRoJemCH1DTl08\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 39344,
    "path": "../public/images2/landing-page/special_features/22.jpg"
  },
  "/images2/landing-page/special_features/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"4113-eoGzerjTsJvgQbnIarUlTmKE5Ws\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 16659,
    "path": "../public/images2/landing-page/special_features/23.jpg"
  },
  "/images2/landing-page/special_features/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"8cf8-Bb1QCLaki5avjIYAR5NNfImJghg\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 36088,
    "path": "../public/images2/landing-page/special_features/24.jpg"
  },
  "/images2/landing-page/special_features/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"3db7-yFpZXEdHQ94ihxhomTNVNmUM1LQ\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 15799,
    "path": "../public/images2/landing-page/special_features/25.jpg"
  },
  "/images2/landing-page/special_features/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f73-5t0jdKGfoGjCcmEcAYOlcYUUgqE\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 24435,
    "path": "../public/images2/landing-page/special_features/26.jpg"
  },
  "/images2/landing-page/special_features/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"7964-DUSuru2B6ubTM5detnjcmGwFHRk\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 31076,
    "path": "../public/images2/landing-page/special_features/27.jpg"
  },
  "/images2/landing-page/special_features/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"5811-ciFgNAPPHS8iTw1Z0MtwNy6x5F0\"",
    "mtime": "2023-04-08T00:16:32.499Z",
    "size": 22545,
    "path": "../public/images2/landing-page/special_features/28.jpg"
  },
  "/images2/landing-page/special_features/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ac0-4b3sihUtvoIe85i3nzMXUMCLXHw\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 19136,
    "path": "../public/images2/landing-page/special_features/29.jpg"
  },
  "/images2/landing-page/special_features/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c43d-b6BbSzyi+PZ1osw6B1nNzrOaOXs\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 50237,
    "path": "../public/images2/landing-page/special_features/3.jpg"
  },
  "/images2/landing-page/special_features/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ace-PBuIR65d5liw86O7y5zgEr5Bw48\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 19150,
    "path": "../public/images2/landing-page/special_features/30.jpg"
  },
  "/images2/landing-page/special_features/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"7d19-hVb1S2gzUHXFX79APYJLe2suKCk\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 32025,
    "path": "../public/images2/landing-page/special_features/31.jpg"
  },
  "/images2/landing-page/special_features/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"820a-bMFCqgDdmF97CkeEAYwNDnom0cQ\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 33290,
    "path": "../public/images2/landing-page/special_features/32.jpg"
  },
  "/images2/landing-page/special_features/360.jpg": {
    "type": "image/jpeg",
    "etag": "\"3ea9-Hvs4+eTUETksv2vcm0sPfck5CtY\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 16041,
    "path": "../public/images2/landing-page/special_features/360.jpg"
  },
  "/images2/landing-page/special_features/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"15d90-Akz3r/py9PpvRAhzTIXXWT1Q678\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 89488,
    "path": "../public/images2/landing-page/special_features/4.jpg"
  },
  "/images2/landing-page/special_features/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"6f3f-XKAFaQbrsVVdLYdU8VJfjAQzSTM\"",
    "mtime": "2023-04-08T00:16:32.495Z",
    "size": 28479,
    "path": "../public/images2/landing-page/special_features/5.jpg"
  },
  "/images2/landing-page/special_features/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"ef5f-7oDMFxGML6am+eyH/y1ig6Y/iTg\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 61279,
    "path": "../public/images2/landing-page/special_features/6.jpg"
  },
  "/images2/landing-page/special_features/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4813-y/4fIaaOmMK25S6dRnc2mCSJ834\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 18451,
    "path": "../public/images2/landing-page/special_features/7.jpg"
  },
  "/images2/landing-page/special_features/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"8e4c-V1c+KVBHkDZF3ViUmZbl1gDPEmM\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 36428,
    "path": "../public/images2/landing-page/special_features/8.jpg"
  },
  "/images2/landing-page/special_features/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"7959-wbRQypqlDp24vzI5yvsLP17iKqs\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 31065,
    "path": "../public/images2/landing-page/special_features/9.jpg"
  },
  "/images2/landing-page/special_features/Fly to cart.png": {
    "type": "image/png",
    "etag": "\"6e17-imMtPn6JPBIcJJe+cjcQC6e7Zn0\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 28183,
    "path": "../public/images2/landing-page/special_features/Fly to cart.png"
  },
  "/images2/landing-page/special_features/Off-canvas.png": {
    "type": "image/png",
    "etag": "\"3ea4-NbYoQx445phLrY4ZOzjg4tVwQx4\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 16036,
    "path": "../public/images2/landing-page/special_features/Off-canvas.png"
  },
  "/images2/landing-page/special_features/Unlimited-product-size.png": {
    "type": "image/png",
    "etag": "\"623a-JVRc/YXO1S/4W/SynsRqNLLtSEs\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 25146,
    "path": "../public/images2/landing-page/special_features/Unlimited-product-size.png"
  },
  "/images2/landing-page/special_features/bicycle.jpg": {
    "type": "image/jpeg",
    "etag": "\"773c-xFRc+HugBgHMLWaxm6T2fnbrqbY\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 30524,
    "path": "../public/images2/landing-page/special_features/bicycle.jpg"
  },
  "/images2/landing-page/special_features/books.jpg": {
    "type": "image/jpeg",
    "etag": "\"673f-2vkwbOx+1l4i23ZqdGl+BkB+i3U\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 26431,
    "path": "../public/images2/landing-page/special_features/books.jpg"
  },
  "/images2/landing-page/special_features/color-option.png": {
    "type": "image/png",
    "etag": "\"6b08-1/ZpINvjMw8ylB/lvrNvWXxaIlA\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 27400,
    "path": "../public/images2/landing-page/special_features/color-option.png"
  },
  "/images2/landing-page/special_features/countdown.png": {
    "type": "image/png",
    "etag": "\"7139-R0F41VGZSP2KkBrULyQbD1PISTE\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 28985,
    "path": "../public/images2/landing-page/special_features/countdown.png"
  },
  "/images2/landing-page/special_features/electronic-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f0d-6cYuvz+F0+W83wo4YCMyhCcAAzY\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 24333,
    "path": "../public/images2/landing-page/special_features/electronic-3.jpg"
  },
  "/images2/landing-page/special_features/facebook-chat.png": {
    "type": "image/png",
    "etag": "\"5171-y6EV/8XrHhbFACStR8enUEl+/HM\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 20849,
    "path": "../public/images2/landing-page/special_features/facebook-chat.png"
  },
  "/images2/landing-page/special_features/fashion-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a05-vzcrDhRwHP+phlz9ge2pURmyobs\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 27141,
    "path": "../public/images2/landing-page/special_features/fashion-4.jpg"
  },
  "/images2/landing-page/special_features/fashion-5.jpg": {
    "type": "image/jpeg",
    "etag": "\"6932-KQX25oJIZv4UncoVEZ91qb6TefI\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 26930,
    "path": "../public/images2/landing-page/special_features/fashion-5.jpg"
  },
  "/images2/landing-page/special_features/fashion-6.jpg": {
    "type": "image/jpeg",
    "etag": "\"68db-H4cHao9NT70suGMh81bbNcKpeiw\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 26843,
    "path": "../public/images2/landing-page/special_features/fashion-6.jpg"
  },
  "/images2/landing-page/special_features/fashion-7.jpg": {
    "type": "image/jpeg",
    "etag": "\"b3d1-UdAcMAgciZkMiVqhjzaOkEs4DrI\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 46033,
    "path": "../public/images2/landing-page/special_features/fashion-7.jpg"
  },
  "/images2/landing-page/special_features/furniture-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"5b7d-FFXy4/EXqVLz4kYO0WQcvlrodpc\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 23421,
    "path": "../public/images2/landing-page/special_features/furniture-2.jpg"
  },
  "/images2/landing-page/special_features/furniture-black.jpg": {
    "type": "image/jpeg",
    "etag": "\"4984-kPGxtzLk8HXtWdmV0vRLrsRQJ94\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 18820,
    "path": "../public/images2/landing-page/special_features/furniture-black.jpg"
  },
  "/images2/landing-page/special_features/gradient.jpg": {
    "type": "image/jpeg",
    "etag": "\"7286-gL0jjG3znwJZ4f5YRR+gWOrhPsA\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 29318,
    "path": "../public/images2/landing-page/special_features/gradient.jpg"
  },
  "/images2/landing-page/special_features/hover.png": {
    "type": "image/png",
    "etag": "\"71bd-7yoaAEg0jv0Jwzxat1Bz8Oz0JMY\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 29117,
    "path": "../public/images2/landing-page/special_features/hover.png"
  },
  "/images2/landing-page/special_features/jewellery-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"6cfa-4b5nooXXUo/GAkejFCE3zvyMOxE\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 27898,
    "path": "../public/images2/landing-page/special_features/jewellery-2.jpg"
  },
  "/images2/landing-page/special_features/jewellery-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5bc9-IGtwePdYyVyRnYSqFIffIejJilY\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 23497,
    "path": "../public/images2/landing-page/special_features/jewellery-3.jpg"
  },
  "/images2/landing-page/special_features/lookbook.png": {
    "type": "image/png",
    "etag": "\"9611-W2u0qzImLrrFwWHEGIPdPKBB0VA\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 38417,
    "path": "../public/images2/landing-page/special_features/lookbook.png"
  },
  "/images2/landing-page/special_features/marketplace-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"73a2-swGwt5r3vcLGi7oc+fqdTfXN0Lg\"",
    "mtime": "2023-04-08T00:16:32.485Z",
    "size": 29602,
    "path": "../public/images2/landing-page/special_features/marketplace-2.jpg"
  },
  "/images2/landing-page/special_features/marketplace-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5ee4-RyGmDctkXuJf/+2Po3c3PYMVufw\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 24292,
    "path": "../public/images2/landing-page/special_features/marketplace-3.jpg"
  },
  "/images2/landing-page/special_features/marketplace-4.jpg": {
    "type": "image/jpeg",
    "etag": "\"7915-P6RjBS/4AoT8JdlZBVRnuDhP9J0\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 30997,
    "path": "../public/images2/landing-page/special_features/marketplace-4.jpg"
  },
  "/images2/landing-page/special_features/medical.jpg": {
    "type": "image/jpeg",
    "etag": "\"5660-ZvFgxuvJ029mYvtidjB+35aiRcc\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 22112,
    "path": "../public/images2/landing-page/special_features/medical.jpg"
  },
  "/images2/landing-page/special_features/mobile-optimize.png": {
    "type": "image/png",
    "etag": "\"71e0-yrK1Q9LO++7PGoi8U2rwiC+y+Ho\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 29152,
    "path": "../public/images2/landing-page/special_features/mobile-optimize.png"
  },
  "/images2/landing-page/special_features/perfume.jpg": {
    "type": "image/jpeg",
    "etag": "\"536d-xGpmMiUtTsw6pdI7TS4KrFVZH1I\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 21357,
    "path": "../public/images2/landing-page/special_features/perfume.jpg"
  },
  "/images2/landing-page/special_features/product-Zoom.png": {
    "type": "image/png",
    "etag": "\"a9a9-ITpuhB7nLvv57SPql3T9oT/pjM0\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 43433,
    "path": "../public/images2/landing-page/special_features/product-Zoom.png"
  },
  "/images2/landing-page/special_features/vegetables-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"6390-BayjEQ3nfXtQzguJ/gkr/5I9JiA\"",
    "mtime": "2023-04-08T00:16:32.459Z",
    "size": 25488,
    "path": "../public/images2/landing-page/special_features/vegetables-2.jpg"
  },
  "/images2/landing-page/special_features/vegetables-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"709e-aekG++1XjPgsD+IyXY/fk5MKMhA\"",
    "mtime": "2023-04-08T00:16:32.459Z",
    "size": 28830,
    "path": "../public/images2/landing-page/special_features/vegetables-3.jpg"
  },
  "/images2/landing-page/special_features/video.jpg": {
    "type": "image/jpeg",
    "etag": "\"5299-Hpl4pMjcB/NISXyu5XnkbbdF5R4\"",
    "mtime": "2023-04-08T00:16:32.459Z",
    "size": 21145,
    "path": "../public/images2/landing-page/special_features/video.jpg"
  },
  "/images2/landing-page/special_features/yoga.jpg": {
    "type": "image/jpeg",
    "etag": "\"6983-6jRQNaArneQ6H7ipi2lF2GX2CGo\"",
    "mtime": "2023-04-08T00:16:32.459Z",
    "size": 27011,
    "path": "../public/images2/landing-page/special_features/yoga.jpg"
  },
  "/images2/landing-page/support/s6.png": {
    "type": "image/png",
    "etag": "\"815-n8mUPn2uTLZU1DimThFjvlezSEc\"",
    "mtime": "2023-04-08T00:16:32.459Z",
    "size": 2069,
    "path": "../public/images2/landing-page/support/s6.png"
  },
  "/images2/landing-page/support/s7.png": {
    "type": "image/png",
    "etag": "\"4a8-ElG935zUkfJoUGMYHwpFDJtO9Tg\"",
    "mtime": "2023-04-08T00:16:32.455Z",
    "size": 1192,
    "path": "../public/images2/landing-page/support/s7.png"
  },
  "/images2/landing-page/support/s8.png": {
    "type": "image/png",
    "etag": "\"6b1-FnhyLS2prX0caNIoyFbvdThjlZ4\"",
    "mtime": "2023-04-08T00:16:32.455Z",
    "size": 1713,
    "path": "../public/images2/landing-page/support/s8.png"
  },
  "/images2/landing-page/support/support-bg.png": {
    "type": "image/png",
    "etag": "\"b9b0c-VT8MvK2t00yyRiQ/voaQFTZRJg0\"",
    "mtime": "2023-04-08T00:16:32.455Z",
    "size": 760588,
    "path": "../public/images2/landing-page/support/support-bg.png"
  },
  "/images2/landing-page/support/support.png": {
    "type": "image/png",
    "etag": "\"23d8-KgURTAwVmhuHQ9kdilAjREbpZec\"",
    "mtime": "2023-04-08T00:16:32.455Z",
    "size": 9176,
    "path": "../public/images2/landing-page/support/support.png"
  },
  "/images2/marijuana/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dd4-bQN0LjmRytXZnMhNOkT3OlIFDBw\"",
    "mtime": "2023-04-08T00:16:32.432Z",
    "size": 7636,
    "path": "../public/images2/marijuana/banner/1.jpg"
  },
  "/images2/marijuana/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dd4-bQN0LjmRytXZnMhNOkT3OlIFDBw\"",
    "mtime": "2023-04-08T00:16:32.432Z",
    "size": 7636,
    "path": "../public/images2/marijuana/banner/2.jpg"
  },
  "/images2/marijuana/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dd4-bQN0LjmRytXZnMhNOkT3OlIFDBw\"",
    "mtime": "2023-04-08T00:16:32.432Z",
    "size": 7636,
    "path": "../public/images2/marijuana/banner/3.jpg"
  },
  "/images2/marijuana/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dd4-bQN0LjmRytXZnMhNOkT3OlIFDBw\"",
    "mtime": "2023-04-08T00:16:32.432Z",
    "size": 7636,
    "path": "../public/images2/marijuana/banner/4.jpg"
  },
  "/images2/marijuana/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.429Z",
    "size": 16688,
    "path": "../public/images2/marijuana/blog/1.jpg"
  },
  "/images2/marijuana/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.429Z",
    "size": 16688,
    "path": "../public/images2/marijuana/blog/2.jpg"
  },
  "/images2/marijuana/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4130-eSXqVYFpFI5HOolfSN8aZ7l+b1s\"",
    "mtime": "2023-04-08T00:16:32.429Z",
    "size": 16688,
    "path": "../public/images2/marijuana/blog/3.jpg"
  },
  "/images2/marijuana/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.429Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/1.jpg"
  },
  "/images2/marijuana/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.429Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/10.jpg"
  },
  "/images2/marijuana/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/11.jpg"
  },
  "/images2/marijuana/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/12.jpg"
  },
  "/images2/marijuana/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/13.jpg"
  },
  "/images2/marijuana/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/14.jpg"
  },
  "/images2/marijuana/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/15.jpg"
  },
  "/images2/marijuana/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/16.jpg"
  },
  "/images2/marijuana/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/17.jpg"
  },
  "/images2/marijuana/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/18.jpg"
  },
  "/images2/marijuana/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.425Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/19.jpg"
  },
  "/images2/marijuana/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/2.jpg"
  },
  "/images2/marijuana/pro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/20.jpg"
  },
  "/images2/marijuana/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/21.jpg"
  },
  "/images2/marijuana/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/22.jpg"
  },
  "/images2/marijuana/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/23.jpg"
  },
  "/images2/marijuana/pro/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/24.jpg"
  },
  "/images2/marijuana/pro/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/25.jpg"
  },
  "/images2/marijuana/pro/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/26.jpg"
  },
  "/images2/marijuana/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/3.jpg"
  },
  "/images2/marijuana/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/4.jpg"
  },
  "/images2/marijuana/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.422Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/5.jpg"
  },
  "/images2/marijuana/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/6.jpg"
  },
  "/images2/marijuana/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/7.jpg"
  },
  "/images2/marijuana/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/8.jpg"
  },
  "/images2/marijuana/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"39ad-fDPPcLLKTk7GrDZ8i7A9tf2NyXE\"",
    "mtime": "2023-04-08T00:16:32.419Z",
    "size": 14765,
    "path": "../public/images2/marijuana/pro/9.jpg"
  },
  "/images2/marketplace/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"36a8-YqprCe34mR+7nLg9yhAhv3SDc00\"",
    "mtime": "2023-04-08T00:16:32.412Z",
    "size": 13992,
    "path": "../public/images2/marketplace/banner/1.jpg"
  },
  "/images2/marketplace/banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"13e3-30mzPHSCwWA99p4H7UrgWDTaOPY\"",
    "mtime": "2023-04-08T00:16:32.412Z",
    "size": 5091,
    "path": "../public/images2/marketplace/banner/10.jpg"
  },
  "/images2/marketplace/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"13e3-30mzPHSCwWA99p4H7UrgWDTaOPY\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 5091,
    "path": "../public/images2/marketplace/banner/11.jpg"
  },
  "/images2/marketplace/banner/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"13e3-30mzPHSCwWA99p4H7UrgWDTaOPY\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 5091,
    "path": "../public/images2/marketplace/banner/12.jpg"
  },
  "/images2/marketplace/banner/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 7049,
    "path": "../public/images2/marketplace/banner/13.jpg"
  },
  "/images2/marketplace/banner/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 7049,
    "path": "../public/images2/marketplace/banner/14.jpg"
  },
  "/images2/marketplace/banner/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 7049,
    "path": "../public/images2/marketplace/banner/15.jpg"
  },
  "/images2/marketplace/banner/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb6-G5/eySASt4pO6WoynNKRfQhWR9I\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 3766,
    "path": "../public/images2/marketplace/banner/16.jpg"
  },
  "/images2/marketplace/banner/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb6-G5/eySASt4pO6WoynNKRfQhWR9I\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 3766,
    "path": "../public/images2/marketplace/banner/17.jpg"
  },
  "/images2/marketplace/banner/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb6-G5/eySASt4pO6WoynNKRfQhWR9I\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 3766,
    "path": "../public/images2/marketplace/banner/18.jpg"
  },
  "/images2/marketplace/banner/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb6-G5/eySASt4pO6WoynNKRfQhWR9I\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 3766,
    "path": "../public/images2/marketplace/banner/19.jpg"
  },
  "/images2/marketplace/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"ff0-YuwmJVd8IvzOBLMmvbF/6fT62Mg\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 4080,
    "path": "../public/images2/marketplace/banner/2.jpg"
  },
  "/images2/marketplace/banner/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb6-G5/eySASt4pO6WoynNKRfQhWR9I\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 3766,
    "path": "../public/images2/marketplace/banner/20.jpg"
  },
  "/images2/marketplace/banner/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"fd2-pu8wB9fQ/K/Pm7SMj4oW5MNUxC8\"",
    "mtime": "2023-04-08T00:16:32.409Z",
    "size": 4050,
    "path": "../public/images2/marketplace/banner/21.jpg"
  },
  "/images2/marketplace/banner/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"fd2-pu8wB9fQ/K/Pm7SMj4oW5MNUxC8\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 4050,
    "path": "../public/images2/marketplace/banner/22.jpg"
  },
  "/images2/marketplace/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 3762,
    "path": "../public/images2/marketplace/banner/3.jpg"
  },
  "/images2/marketplace/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 3762,
    "path": "../public/images2/marketplace/banner/4.jpg"
  },
  "/images2/marketplace/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1617-j9fLnN8zTd1ZCAi82uC483ppM5w\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 5655,
    "path": "../public/images2/marketplace/banner/5.jpg"
  },
  "/images2/marketplace/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1617-j9fLnN8zTd1ZCAi82uC483ppM5w\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 5655,
    "path": "../public/images2/marketplace/banner/6.jpg"
  },
  "/images2/marketplace/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"36a8-YqprCe34mR+7nLg9yhAhv3SDc00\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 13992,
    "path": "../public/images2/marketplace/banner/7.jpg"
  },
  "/images2/marketplace/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"6583-wm2hXBZ6TqzAI5YylCAAD/kUhYY\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 25987,
    "path": "../public/images2/marketplace/banner/8.jpg"
  },
  "/images2/marketplace/banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"13e3-30mzPHSCwWA99p4H7UrgWDTaOPY\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 5091,
    "path": "../public/images2/marketplace/banner/9.jpg"
  },
  "/images2/marketplace/banner/horizontal-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"236a-jog+Crp9w0xqFz9yL+A/RDqUdyg\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 9066,
    "path": "../public/images2/marketplace/banner/horizontal-1.jpg"
  },
  "/images2/marketplace/banner/horizontal.jpg": {
    "type": "image/jpeg",
    "etag": "\"236a-jog+Crp9w0xqFz9yL+A/RDqUdyg\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 9066,
    "path": "../public/images2/marketplace/banner/horizontal.jpg"
  },
  "/images2/marketplace/banner/vertical.jpg": {
    "type": "image/jpeg",
    "etag": "\"16f1-Og4HH2YUfc/nbV5nbdybwgpJ5eo\"",
    "mtime": "2023-04-08T00:16:32.405Z",
    "size": 5873,
    "path": "../public/images2/marketplace/banner/vertical.jpg"
  },
  "/images2/marketplace/banner/vertical1.jpg": {
    "type": "image/jpeg",
    "etag": "\"11f3-NkYyQgxyq0akRhK1zcqMxy8U1y0\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 4595,
    "path": "../public/images2/marketplace/banner/vertical1.jpg"
  },
  "/images2/marketplace/banner/vertical2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1073-+4+Whlf+Qg0AKnRixZOkUSKulDc\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 4211,
    "path": "../public/images2/marketplace/banner/vertical2.jpg"
  },
  "/images2/marketplace/banner/vertical3.jpg": {
    "type": "image/jpeg",
    "etag": "\"109d-1YKkMRjgZQho+pCp3H63TwBPh78\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 4253,
    "path": "../public/images2/marketplace/banner/vertical3.jpg"
  },
  "/images2/marketplace/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"10eb-Ze6x97rsiP5qxgRh4uwiTbopAxo\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 4331,
    "path": "../public/images2/marketplace/blog/1.jpg"
  },
  "/images2/marketplace/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"10eb-Ze6x97rsiP5qxgRh4uwiTbopAxo\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 4331,
    "path": "../public/images2/marketplace/blog/2.jpg"
  },
  "/images2/marketplace/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"10eb-Ze6x97rsiP5qxgRh4uwiTbopAxo\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 4331,
    "path": "../public/images2/marketplace/blog/3.jpg"
  },
  "/images2/marketplace/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"10eb-Ze6x97rsiP5qxgRh4uwiTbopAxo\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 4331,
    "path": "../public/images2/marketplace/blog/4.jpg"
  },
  "/images2/marketplace/home-slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4684-n9Vuhkrg6JzuQjXYBmyl7arJimg\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 18052,
    "path": "../public/images2/marketplace/home-slider/1.jpg"
  },
  "/images2/marketplace/home-slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4684-n9Vuhkrg6JzuQjXYBmyl7arJimg\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 18052,
    "path": "../public/images2/marketplace/home-slider/2.jpg"
  },
  "/images2/marketplace/home-slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4684-n9Vuhkrg6JzuQjXYBmyl7arJimg\"",
    "mtime": "2023-04-08T00:16:32.402Z",
    "size": 18052,
    "path": "../public/images2/marketplace/home-slider/3.jpg"
  },
  "/images2/marketplace/home-slider/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4684-n9Vuhkrg6JzuQjXYBmyl7arJimg\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 18052,
    "path": "../public/images2/marketplace/home-slider/4.jpg"
  },
  "/images2/marketplace/home-slider/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"6f42-xwsmeAIT4I45DcOgB8r6XFv1/tQ\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 28482,
    "path": "../public/images2/marketplace/home-slider/5.jpg"
  },
  "/images2/marketplace/home-slider/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"6f42-xwsmeAIT4I45DcOgB8r6XFv1/tQ\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 28482,
    "path": "../public/images2/marketplace/home-slider/6.jpg"
  },
  "/images2/marketplace/home-slider/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"7924-3q/tXcN0swcQTpMn2nSZar/dNmE\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 31012,
    "path": "../public/images2/marketplace/home-slider/7.jpg"
  },
  "/images2/marketplace/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/1.jpg"
  },
  "/images2/marketplace/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/10.jpg"
  },
  "/images2/marketplace/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/11.jpg"
  },
  "/images2/marketplace/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.399Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/12.jpg"
  },
  "/images2/marketplace/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/13.jpg"
  },
  "/images2/marketplace/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/14.jpg"
  },
  "/images2/marketplace/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/15.jpg"
  },
  "/images2/marketplace/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/16.jpg"
  },
  "/images2/marketplace/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/17.jpg"
  },
  "/images2/marketplace/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/18.jpg"
  },
  "/images2/marketplace/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/19.jpg"
  },
  "/images2/marketplace/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.395Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/2.jpg"
  },
  "/images2/marketplace/pro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/20.jpg"
  },
  "/images2/marketplace/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/21.jpg"
  },
  "/images2/marketplace/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/22.jpg"
  },
  "/images2/marketplace/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/23.jpg"
  },
  "/images2/marketplace/pro/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/24.jpg"
  },
  "/images2/marketplace/pro/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/25.jpg"
  },
  "/images2/marketplace/pro/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/26.jpg"
  },
  "/images2/marketplace/pro/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/27.jpg"
  },
  "/images2/marketplace/pro/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/28.jpg"
  },
  "/images2/marketplace/pro/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/29.jpg"
  },
  "/images2/marketplace/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/3.jpg"
  },
  "/images2/marketplace/pro/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/30.jpg"
  },
  "/images2/marketplace/pro/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.392Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/31.jpg"
  },
  "/images2/marketplace/pro/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/32.jpg"
  },
  "/images2/marketplace/pro/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/33.jpg"
  },
  "/images2/marketplace/pro/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/34.jpg"
  },
  "/images2/marketplace/pro/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/35.jpg"
  },
  "/images2/marketplace/pro/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/36.jpg"
  },
  "/images2/marketplace/pro/37.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/37.jpg"
  },
  "/images2/marketplace/pro/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/38.jpg"
  },
  "/images2/marketplace/pro/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/39.jpg"
  },
  "/images2/marketplace/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/4.jpg"
  },
  "/images2/marketplace/pro/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/40.jpg"
  },
  "/images2/marketplace/pro/41.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/41.jpg"
  },
  "/images2/marketplace/pro/42.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.389Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/42.jpg"
  },
  "/images2/marketplace/pro/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/43.jpg"
  },
  "/images2/marketplace/pro/44.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/44.jpg"
  },
  "/images2/marketplace/pro/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/45.jpg"
  },
  "/images2/marketplace/pro/46.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/46.jpg"
  },
  "/images2/marketplace/pro/47.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/47.jpg"
  },
  "/images2/marketplace/pro/48.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/48.jpg"
  },
  "/images2/marketplace/pro/49.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/49.jpg"
  },
  "/images2/marketplace/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/5.jpg"
  },
  "/images2/marketplace/pro/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/50.jpg"
  },
  "/images2/marketplace/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/6.jpg"
  },
  "/images2/marketplace/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/7.jpg"
  },
  "/images2/marketplace/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/8.jpg"
  },
  "/images2/marketplace/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"39c-A/iLG0RKenFcUBwy9wkloUm00jQ\"",
    "mtime": "2023-04-08T00:16:32.385Z",
    "size": 924,
    "path": "../public/images2/marketplace/pro/9.jpg"
  },
  "/images2/marketplace/pro-sm/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"210-pGa5JVRpdeprvwqv0sUHp0yvoPU\"",
    "mtime": "2023-04-08T00:16:32.382Z",
    "size": 528,
    "path": "../public/images2/marketplace/pro-sm/1.jpg"
  },
  "/images2/marketplace/pro-sm/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"210-pGa5JVRpdeprvwqv0sUHp0yvoPU\"",
    "mtime": "2023-04-08T00:16:32.382Z",
    "size": 528,
    "path": "../public/images2/marketplace/pro-sm/2.jpg"
  },
  "/images2/marketplace/pro-sm/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"210-pGa5JVRpdeprvwqv0sUHp0yvoPU\"",
    "mtime": "2023-04-08T00:16:32.382Z",
    "size": 528,
    "path": "../public/images2/marketplace/pro-sm/3.jpg"
  },
  "/images2/marketplace/pro-sm/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"210-pGa5JVRpdeprvwqv0sUHp0yvoPU\"",
    "mtime": "2023-04-08T00:16:32.382Z",
    "size": 528,
    "path": "../public/images2/marketplace/pro-sm/4.jpg"
  },
  "/images2/marketplace/pro-sm/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"210-pGa5JVRpdeprvwqv0sUHp0yvoPU\"",
    "mtime": "2023-04-08T00:16:32.382Z",
    "size": 528,
    "path": "../public/images2/marketplace/pro-sm/5.jpg"
  },
  "/images2/medicine/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"2720-+lUy6VQWYaJ3ZfmZ9bs3yXk57JU\"",
    "mtime": "2023-04-08T00:16:32.379Z",
    "size": 10016,
    "path": "../public/images2/medicine/banner/11.jpg"
  },
  "/images2/medicine/banner/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"2720-+lUy6VQWYaJ3ZfmZ9bs3yXk57JU\"",
    "mtime": "2023-04-08T00:16:32.379Z",
    "size": 10016,
    "path": "../public/images2/medicine/banner/12.jpg"
  },
  "/images2/medicine/banner/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"182e-p2TyA6ilqozyeiktSM0k10vyCNw\"",
    "mtime": "2023-04-08T00:16:32.379Z",
    "size": 6190,
    "path": "../public/images2/medicine/banner/13.jpg"
  },
  "/images2/medicine/banner/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"182e-p2TyA6ilqozyeiktSM0k10vyCNw\"",
    "mtime": "2023-04-08T00:16:32.379Z",
    "size": 6190,
    "path": "../public/images2/medicine/banner/14.jpg"
  },
  "/images2/medicine/banner/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"182e-p2TyA6ilqozyeiktSM0k10vyCNw\"",
    "mtime": "2023-04-08T00:16:32.379Z",
    "size": 6190,
    "path": "../public/images2/medicine/banner/15.jpg"
  },
  "/images2/medicine/banner/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"1138-OwNxn8krNTiU39marPzym0Xg1yY\"",
    "mtime": "2023-04-08T00:16:32.379Z",
    "size": 4408,
    "path": "../public/images2/medicine/banner/16.jpg"
  },
  "/images2/medicine/banner/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"1138-OwNxn8krNTiU39marPzym0Xg1yY\"",
    "mtime": "2023-04-08T00:16:32.379Z",
    "size": 4408,
    "path": "../public/images2/medicine/banner/17.jpg"
  },
  "/images2/medicine/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/1.jpg"
  },
  "/images2/medicine/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/2.jpg"
  },
  "/images2/medicine/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/3.jpg"
  },
  "/images2/medicine/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/4.jpg"
  },
  "/images2/medicine/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/5.jpg"
  },
  "/images2/medicine/blog/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/6.jpg"
  },
  "/images2/medicine/blog/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/7.jpg"
  },
  "/images2/medicine/blog/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"107c-yMT3YujGb7Ky4PnWKbA2klRjNzA\"",
    "mtime": "2023-04-08T00:16:32.375Z",
    "size": 4220,
    "path": "../public/images2/medicine/blog/8.jpg"
  },
  "/images2/medicine/home-slider/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"8856-KkIeWkTd9YEWS5bbzaFB0clcMZo\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 34902,
    "path": "../public/images2/medicine/home-slider/1.jpg"
  },
  "/images2/medicine/home-slider/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"8856-KkIeWkTd9YEWS5bbzaFB0clcMZo\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 34902,
    "path": "../public/images2/medicine/home-slider/2.jpg"
  },
  "/images2/medicine/home-slider/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"8856-KkIeWkTd9YEWS5bbzaFB0clcMZo\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 34902,
    "path": "../public/images2/medicine/home-slider/3.jpg"
  },
  "/images2/medicine/pro/1-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/1-1.jpg"
  },
  "/images2/medicine/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/1.jpg"
  },
  "/images2/medicine/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/10.jpg"
  },
  "/images2/medicine/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/2.jpg"
  },
  "/images2/medicine/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/3.jpg"
  },
  "/images2/medicine/pro/4-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.372Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/4-1.jpg"
  },
  "/images2/medicine/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/4.jpg"
  },
  "/images2/medicine/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/5.jpg"
  },
  "/images2/medicine/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/6.jpg"
  },
  "/images2/medicine/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/7.jpg"
  },
  "/images2/medicine/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/8.jpg"
  },
  "/images2/medicine/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f5-8wpYskVECC4F5GIPgzXDk+Xj6bs\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1525,
    "path": "../public/images2/medicine/pro/9.jpg"
  },
  "/images2/medicine/thumbnail/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"489-efZUM40WBvKoWcnHc6oRoI37DxU\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1161,
    "path": "../public/images2/medicine/thumbnail/1.jpg"
  },
  "/images2/medicine/thumbnail/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"489-efZUM40WBvKoWcnHc6oRoI37DxU\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1161,
    "path": "../public/images2/medicine/thumbnail/2.jpg"
  },
  "/images2/medicine/thumbnail/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"489-efZUM40WBvKoWcnHc6oRoI37DxU\"",
    "mtime": "2023-04-08T00:16:32.369Z",
    "size": 1161,
    "path": "../public/images2/medicine/thumbnail/3.jpg"
  },
  "/images2/mega-menu/beauty/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.362Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/beauty/1.jpg"
  },
  "/images2/mega-menu/beauty/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.359Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/beauty/2.jpg"
  },
  "/images2/mega-menu/beauty/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.359Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/beauty/3.jpg"
  },
  "/images2/mega-menu/electronic/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.359Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/electronic/1.jpg"
  },
  "/images2/mega-menu/electronic/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.359Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/electronic/2.jpg"
  },
  "/images2/mega-menu/electronic/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.359Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/electronic/3.jpg"
  },
  "/images2/mega-menu/flower/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.359Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/flower/1.jpg"
  },
  "/images2/mega-menu/flower/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/flower/2.jpg"
  },
  "/images2/mega-menu/flower/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/flower/3.jpg"
  },
  "/images2/mega-menu/furniture/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/furniture/1.jpg"
  },
  "/images2/mega-menu/furniture/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/furniture/2.jpg"
  },
  "/images2/mega-menu/furniture/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/furniture/3.jpg"
  },
  "/images2/mega-menu/furniture/mega2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/furniture/mega2.jpg"
  },
  "/images2/mega-menu/furniture/mega3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/furniture/mega3.jpg"
  },
  "/images2/mega-menu/goggles/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.355Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/goggles/1.jpg"
  },
  "/images2/mega-menu/goggles/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/goggles/2.jpg"
  },
  "/images2/mega-menu/goggles/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/goggles/3.jpg"
  },
  "/images2/mega-menu/kids/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/kids/1.jpg"
  },
  "/images2/mega-menu/kids/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/kids/2.jpg"
  },
  "/images2/mega-menu/kids/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/kids/3.jpg"
  },
  "/images2/mega-menu/light/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/light/1.jpg"
  },
  "/images2/mega-menu/light/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/light/2.jpg"
  },
  "/images2/mega-menu/light/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/light/3.jpg"
  },
  "/images2/mega-menu/nursery/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/nursery/1.jpg"
  },
  "/images2/mega-menu/nursery/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.352Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/nursery/2.jpg"
  },
  "/images2/mega-menu/nursery/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.349Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/nursery/3.jpg"
  },
  "/images2/mega-menu/vegetable-fruits/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.349Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/vegetable-fruits/1.jpg"
  },
  "/images2/mega-menu/vegetable-fruits/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"130c-SoVWm4jLx6dWxjucOWE7qJ/GOL8\"",
    "mtime": "2023-04-08T00:16:32.349Z",
    "size": 4876,
    "path": "../public/images2/mega-menu/vegetable-fruits/2.jpg"
  },
  "/images2/mega-menu/vegetable-fruits/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.349Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/vegetable-fruits/3.jpg"
  },
  "/images2/mega-menu/vegetable-fruits/vegetable.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ab3-2Rf5tmUtxuY7VNbV0lN77A/AARM\"",
    "mtime": "2023-04-08T00:16:32.349Z",
    "size": 19123,
    "path": "../public/images2/mega-menu/vegetable-fruits/vegetable.jpg"
  },
  "/images2/nursery/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ae-iWgdz9XtOND0LZUN+pQmB50Mmyc\"",
    "mtime": "2023-04-08T00:16:32.325Z",
    "size": 6574,
    "path": "../public/images2/nursery/pro/1.jpg"
  },
  "/images2/nursery/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ae-PC7+dmLO3/QV7FfPY9jLWRbvz+E\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 6574,
    "path": "../public/images2/nursery/pro/2.jpg"
  },
  "/images2/nursery/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ae-M5kf69EEx2+AzM3+pWXmRMMqdko\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 6574,
    "path": "../public/images2/nursery/pro/3.jpg"
  },
  "/images2/nursery/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ae-sL0chms/6ImZcJLzOQ6ZQcJepRU\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 6574,
    "path": "../public/images2/nursery/pro/4.jpg"
  },
  "/images2/nursery/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ae-BT6CHLIjHuBWIDLRSonqlNWiPfw\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 6574,
    "path": "../public/images2/nursery/pro/5.jpg"
  },
  "/images2/nursery/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ae-C0XXzCV9lyKxxrprTbj4RC2SqX4\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 6574,
    "path": "../public/images2/nursery/pro/6.jpg"
  },
  "/images2/nursery/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"19ae-zKKhsFMKGOGgTPGBVMBLFyRbwtY\"",
    "mtime": "2023-04-08T00:16:32.322Z",
    "size": 6574,
    "path": "../public/images2/nursery/pro/7.jpg"
  },
  "/images2/pets/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 4724,
    "path": "../public/images2/pets/banner/1.jpg"
  },
  "/images2/pets/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 4724,
    "path": "../public/images2/pets/banner/2.jpg"
  },
  "/images2/pets/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 4724,
    "path": "../public/images2/pets/banner/3.jpg"
  },
  "/images2/pets/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 4724,
    "path": "../public/images2/pets/banner/4.jpg"
  },
  "/images2/pets/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 4724,
    "path": "../public/images2/pets/banner/5.jpg"
  },
  "/images2/pets/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1274-Zxzi685IxVmq77bidMSFY9jIuxY\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 4724,
    "path": "../public/images2/pets/banner/6.jpg"
  },
  "/images2/pets/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 16266,
    "path": "../public/images2/pets/blog/1.jpg"
  },
  "/images2/pets/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 16266,
    "path": "../public/images2/pets/blog/2.jpg"
  },
  "/images2/pets/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 16266,
    "path": "../public/images2/pets/blog/3.jpg"
  },
  "/images2/pets/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f8a-8vdZ3ey6X0VtzwC+MMQktedMISU\"",
    "mtime": "2023-04-08T00:16:32.302Z",
    "size": 16266,
    "path": "../public/images2/pets/blog/4.jpg"
  },
  "/images2/pets/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a71-+WuYsz/4v70Xe0w5o4K2v55HdEU\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10865,
    "path": "../public/images2/pets/pro/1.jpg"
  },
  "/images2/pets/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-Q5x34DCnRFor6bsfe46IZmSTjqM\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/10.jpg"
  },
  "/images2/pets/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-O81oXwoM6pOIkenJ7bdmZ9OBZK0\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/11.jpg"
  },
  "/images2/pets/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-LLDfJLXAYYy6Qmt5Bqo8nTrxwNs\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/12.jpg"
  },
  "/images2/pets/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-wVzOUirgDbHw04YmKOZ95FmlpTQ\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/13.jpg"
  },
  "/images2/pets/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-/A0A5p1AvuEKGMfzSPjUlz3A+CY\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/14.jpg"
  },
  "/images2/pets/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-VbpFtkaYaB8m3/Ow3n5HtRApDYM\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/15.jpg"
  },
  "/images2/pets/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-/O4FPx5K1hxHduGiR74bF6fRnhs\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/2.jpg"
  },
  "/images2/pets/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-7aDRZ4tjlN9X6f/eILZxJCOoZX8\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/3.jpg"
  },
  "/images2/pets/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-vj8/08OY/jIQJS+F8QbRBsAgLz0\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/4.jpg"
  },
  "/images2/pets/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-75NeP/f7TID9jEYF2FhyMUFZ/sE\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/5.jpg"
  },
  "/images2/pets/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-HnagUB4oC8ongTh7q/+wH+2VxbM\"",
    "mtime": "2023-04-08T00:16:32.299Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/6.jpg"
  },
  "/images2/pets/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-Ka+nA7SW8a3CvCEdps3kwwrp5Lw\"",
    "mtime": "2023-04-08T00:16:32.295Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/7.jpg"
  },
  "/images2/pets/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-04ubUJJcWvZ0XuqJmhs7LzRvAmE\"",
    "mtime": "2023-04-08T00:16:32.295Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/8.jpg"
  },
  "/images2/pets/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fa-FEjgx4XgsOExCOXAweskoIADkFw\"",
    "mtime": "2023-04-08T00:16:32.295Z",
    "size": 10746,
    "path": "../public/images2/pets/pro/9.jpg"
  },
  "/images2/portfolio/demo/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/1.jpg"
  },
  "/images2/portfolio/demo/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/10.jpg"
  },
  "/images2/portfolio/demo/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"12da-ft9pB+H7R/EEHo8Y5XozB0hrfno\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 4826,
    "path": "../public/images2/portfolio/demo/12.jpg"
  },
  "/images2/portfolio/demo/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a62-LA6NxIm3vARbAoyB5s59tglRKj0\"",
    "mtime": "2023-04-08T00:16:32.285Z",
    "size": 6754,
    "path": "../public/images2/portfolio/demo/14.jpg"
  },
  "/images2/portfolio/demo/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"20f9-0yuHBPFGaYkoe9LwsYwMe3963bo\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 8441,
    "path": "../public/images2/portfolio/demo/15.jpg"
  },
  "/images2/portfolio/demo/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"5d2-Dn/8OXRmINY6T5JpbF4T5dXWO04\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 1490,
    "path": "../public/images2/portfolio/demo/16.jpg"
  },
  "/images2/portfolio/demo/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"fee-1hkxP8e8hXLE5AXqhkvsYkJLB/k\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 4078,
    "path": "../public/images2/portfolio/demo/17.jpg"
  },
  "/images2/portfolio/demo/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"df4-EYMJhaHAOFh3eBHppRyZ219KTgg\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 3572,
    "path": "../public/images2/portfolio/demo/18.jpg"
  },
  "/images2/portfolio/demo/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"fee-1hkxP8e8hXLE5AXqhkvsYkJLB/k\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 4078,
    "path": "../public/images2/portfolio/demo/19.jpg"
  },
  "/images2/portfolio/demo/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/2.jpg"
  },
  "/images2/portfolio/demo/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b4-5YuYaCmlI7qcySm6zQwmz5LoUPc\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 1204,
    "path": "../public/images2/portfolio/demo/20.jpg"
  },
  "/images2/portfolio/demo/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"2227-5AzC+FVMZLgCWxrFKvf/sGHu+Z8\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 8743,
    "path": "../public/images2/portfolio/demo/21.jpg"
  },
  "/images2/portfolio/demo/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"138f-is/FaeF54uM2bTMrlctpghAd7Dw\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 5007,
    "path": "../public/images2/portfolio/demo/22.jpg"
  },
  "/images2/portfolio/demo/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"21b6-lTF791Qtqp/MDMQ2iwuXcOUEVvU\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 8630,
    "path": "../public/images2/portfolio/demo/23.jpg"
  },
  "/images2/portfolio/demo/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"c046-dYMp5CewBctGGH53pCG/JoG3y/w\"",
    "mtime": "2023-04-08T00:16:32.282Z",
    "size": 49222,
    "path": "../public/images2/portfolio/demo/24.jpg"
  },
  "/images2/portfolio/demo/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b39-pV/kz95xzwW+LV7Yx6t1S4FHxdI\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 6969,
    "path": "../public/images2/portfolio/demo/25.jpg"
  },
  "/images2/portfolio/demo/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"494-MwP8p1rvFidm/TbusNMxvkO4KRQ\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 1172,
    "path": "../public/images2/portfolio/demo/26.jpg"
  },
  "/images2/portfolio/demo/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"132c-xmH6elvUscs9HYcy1OVIoctydqY\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 4908,
    "path": "../public/images2/portfolio/demo/27.jpg"
  },
  "/images2/portfolio/demo/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"c02-uuVhw5haSaYokgA0dVKC342K1tQ\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 3074,
    "path": "../public/images2/portfolio/demo/28.jpg"
  },
  "/images2/portfolio/demo/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/3.jpg"
  },
  "/images2/portfolio/demo/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"ce1-xrFCr0rpSmES2fCgkrrI2pIQF5Y\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 3297,
    "path": "../public/images2/portfolio/demo/30.jpg"
  },
  "/images2/portfolio/demo/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f71-3UZ6GsvEPkKmiJamxGD/ylA7fgg\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 8049,
    "path": "../public/images2/portfolio/demo/31.jpg"
  },
  "/images2/portfolio/demo/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f71-3UZ6GsvEPkKmiJamxGD/ylA7fgg\"",
    "mtime": "2023-04-08T00:16:32.279Z",
    "size": 8049,
    "path": "../public/images2/portfolio/demo/32.jpg"
  },
  "/images2/portfolio/demo/33.jpg": {
    "type": "image/jpeg",
    "etag": "\"11cb-QVLNeEt2ePm0JrlREt9cUbgDWTs\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 4555,
    "path": "../public/images2/portfolio/demo/33.jpg"
  },
  "/images2/portfolio/demo/34.jpg": {
    "type": "image/jpeg",
    "etag": "\"5c70-cbkCVZWr/mSlYUkKNduEWRxAEH8\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 23664,
    "path": "../public/images2/portfolio/demo/34.jpg"
  },
  "/images2/portfolio/demo/35.jpg": {
    "type": "image/jpeg",
    "etag": "\"87f-LIlqb3vRnuXYNOYYTSzdoBj/KHg\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 2175,
    "path": "../public/images2/portfolio/demo/35.jpg"
  },
  "/images2/portfolio/demo/36.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b1-EGnI3ZB6dId6jM64hcv+dTuVe2c\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 1201,
    "path": "../public/images2/portfolio/demo/36.jpg"
  },
  "/images2/portfolio/demo/38.jpg": {
    "type": "image/jpeg",
    "etag": "\"8ce-CCmPZ7udbwe+cybfp5QbRByLjVA\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 2254,
    "path": "../public/images2/portfolio/demo/38.jpg"
  },
  "/images2/portfolio/demo/39.jpg": {
    "type": "image/jpeg",
    "etag": "\"97e-lf0sJCqyi4KFFP+6YrthR3qtZ1s\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 2430,
    "path": "../public/images2/portfolio/demo/39.jpg"
  },
  "/images2/portfolio/demo/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/4.jpg"
  },
  "/images2/portfolio/demo/40.jpg": {
    "type": "image/jpeg",
    "etag": "\"952-vL2BgMxcPtCszrE02fJvh9wMyek\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 2386,
    "path": "../public/images2/portfolio/demo/40.jpg"
  },
  "/images2/portfolio/demo/41.jpg": {
    "type": "image/jpeg",
    "etag": "\"97e-lf0sJCqyi4KFFP+6YrthR3qtZ1s\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 2430,
    "path": "../public/images2/portfolio/demo/41.jpg"
  },
  "/images2/portfolio/demo/42.jpg": {
    "type": "image/jpeg",
    "etag": "\"25c6-gHklSpLWMZm6W+hANjS58d/eKMg\"",
    "mtime": "2023-04-08T00:16:32.275Z",
    "size": 9670,
    "path": "../public/images2/portfolio/demo/42.jpg"
  },
  "/images2/portfolio/demo/43.jpg": {
    "type": "image/jpeg",
    "etag": "\"2597-4o2FEiKatim+c81STFsKf/O8sDI\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 9623,
    "path": "../public/images2/portfolio/demo/43.jpg"
  },
  "/images2/portfolio/demo/45.jpg": {
    "type": "image/jpeg",
    "etag": "\"2597-4o2FEiKatim+c81STFsKf/O8sDI\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 9623,
    "path": "../public/images2/portfolio/demo/45.jpg"
  },
  "/images2/portfolio/demo/46.jpg": {
    "type": "image/jpeg",
    "etag": "\"2597-4o2FEiKatim+c81STFsKf/O8sDI\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 9623,
    "path": "../public/images2/portfolio/demo/46.jpg"
  },
  "/images2/portfolio/demo/47.jpg": {
    "type": "image/jpeg",
    "etag": "\"1af6-ZZ+uMV8uw6VKu0d/d9ayeR3jZQc\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 6902,
    "path": "../public/images2/portfolio/demo/47.jpg"
  },
  "/images2/portfolio/demo/48.jpg": {
    "type": "image/jpeg",
    "etag": "\"1af6-ZZ+uMV8uw6VKu0d/d9ayeR3jZQc\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 6902,
    "path": "../public/images2/portfolio/demo/48.jpg"
  },
  "/images2/portfolio/demo/49.jpg": {
    "type": "image/jpeg",
    "etag": "\"1af6-ZZ+uMV8uw6VKu0d/d9ayeR3jZQc\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 6902,
    "path": "../public/images2/portfolio/demo/49.jpg"
  },
  "/images2/portfolio/demo/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/5.jpg"
  },
  "/images2/portfolio/demo/50.jpg": {
    "type": "image/jpeg",
    "etag": "\"1af6-ZZ+uMV8uw6VKu0d/d9ayeR3jZQc\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 6902,
    "path": "../public/images2/portfolio/demo/50.jpg"
  },
  "/images2/portfolio/demo/51.jpg": {
    "type": "image/jpeg",
    "etag": "\"25a6-Xr7z9fKCTsH2g2rGEseydIHd6Cs\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 9638,
    "path": "../public/images2/portfolio/demo/51.jpg"
  },
  "/images2/portfolio/demo/52.jpg": {
    "type": "image/jpeg",
    "etag": "\"97e-lf0sJCqyi4KFFP+6YrthR3qtZ1s\"",
    "mtime": "2023-04-08T00:16:32.272Z",
    "size": 2430,
    "path": "../public/images2/portfolio/demo/52.jpg"
  },
  "/images2/portfolio/demo/53.jpg": {
    "type": "image/jpeg",
    "etag": "\"2597-4o2FEiKatim+c81STFsKf/O8sDI\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 9623,
    "path": "../public/images2/portfolio/demo/53.jpg"
  },
  "/images2/portfolio/demo/54.jpg": {
    "type": "image/jpeg",
    "etag": "\"1949-K2vCYX1eG4tJ5TUdKN8KYMM9tDA\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 6473,
    "path": "../public/images2/portfolio/demo/54.jpg"
  },
  "/images2/portfolio/demo/55.jpg": {
    "type": "image/jpeg",
    "etag": "\"1638-WsHqRD5GQJCUI4e7YIOIf0kzbyI\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 5688,
    "path": "../public/images2/portfolio/demo/55.jpg"
  },
  "/images2/portfolio/demo/56.jpg": {
    "type": "image/jpeg",
    "etag": "\"2597-4o2FEiKatim+c81STFsKf/O8sDI\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 9623,
    "path": "../public/images2/portfolio/demo/56.jpg"
  },
  "/images2/portfolio/demo/57.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b2a-Y5jmhXiY8MpswlkBgJEvo2gxwFs\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 11050,
    "path": "../public/images2/portfolio/demo/57.jpg"
  },
  "/images2/portfolio/demo/58.jpg": {
    "type": "image/jpeg",
    "etag": "\"1ebb-dmDUzLciGCExR3LO41GENzMykZU\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 7867,
    "path": "../public/images2/portfolio/demo/58.jpg"
  },
  "/images2/portfolio/demo/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/6.jpg"
  },
  "/images2/portfolio/demo/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/7.jpg"
  },
  "/images2/portfolio/demo/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/8.jpg"
  },
  "/images2/portfolio/demo/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.269Z",
    "size": 4885,
    "path": "../public/images2/portfolio/demo/9.jpg"
  },
  "/images2/portfolio/grid/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/1.jpg"
  },
  "/images2/portfolio/grid/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/10.jpg"
  },
  "/images2/portfolio/grid/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/11.jpg"
  },
  "/images2/portfolio/grid/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/12.jpg"
  },
  "/images2/portfolio/grid/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"1968-41YiaWniKuPHYoX80HFtyn2tCdY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 6504,
    "path": "../public/images2/portfolio/grid/13.jpg"
  },
  "/images2/portfolio/grid/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/2.jpg"
  },
  "/images2/portfolio/grid/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/3.jpg"
  },
  "/images2/portfolio/grid/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/4.jpg"
  },
  "/images2/portfolio/grid/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/5.jpg"
  },
  "/images2/portfolio/grid/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.265Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/6.jpg"
  },
  "/images2/portfolio/grid/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.262Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/7.jpg"
  },
  "/images2/portfolio/grid/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.262Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/8.jpg"
  },
  "/images2/portfolio/grid/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"20e6-b+T7swPKhIDzlr1tuNNWb1ud7WY\"",
    "mtime": "2023-04-08T00:16:32.262Z",
    "size": 8422,
    "path": "../public/images2/portfolio/grid/9.jpg"
  },
  "/images2/portfolio/metro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1315-S5Sqmu27cHRSgCg1v6y0rdwlfD8\"",
    "mtime": "2023-04-08T00:16:32.262Z",
    "size": 4885,
    "path": "../public/images2/portfolio/metro/1.jpg"
  },
  "/images2/portfolio/metro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"127f-7qpVAIaeI2CVny11XJ4dZNbyx6I\"",
    "mtime": "2023-04-08T00:16:32.262Z",
    "size": 4735,
    "path": "../public/images2/portfolio/metro/10.jpg"
  },
  "/images2/portfolio/metro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"fb9-hateo7X9TjG1dcoaE+SI6aJmwVM\"",
    "mtime": "2023-04-08T00:16:32.262Z",
    "size": 4025,
    "path": "../public/images2/portfolio/metro/11.jpg"
  },
  "/images2/portfolio/metro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"fcb-SivqMC4DIo6FHfW2aiI2MP3NS6o\"",
    "mtime": "2023-04-08T00:16:32.262Z",
    "size": 4043,
    "path": "../public/images2/portfolio/metro/12.jpg"
  },
  "/images2/portfolio/metro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"e22-OtsvoW/eRm3XpUAurkmqaNIyquE\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 3618,
    "path": "../public/images2/portfolio/metro/13.jpg"
  },
  "/images2/portfolio/metro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"d9d-DOHB7gd9SoZ9JyjRDWI/O0XPCOk\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 3485,
    "path": "../public/images2/portfolio/metro/14.jpg"
  },
  "/images2/portfolio/metro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"ffe-97OxdVfdtKY5F76C1DmJZU8gOsw\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 4094,
    "path": "../public/images2/portfolio/metro/15.jpg"
  },
  "/images2/portfolio/metro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"e9a-PYjcYDvQKPvF4SALJ7avjOKrIUU\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 3738,
    "path": "../public/images2/portfolio/metro/16.jpg"
  },
  "/images2/portfolio/metro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"e94-UGaW6jFt8o78GItszQ7QqM0yGJE\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 3732,
    "path": "../public/images2/portfolio/metro/2.jpg"
  },
  "/images2/portfolio/metro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"df7-SK55aGxG+5bIzrph30VKlPLvS0M\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 3575,
    "path": "../public/images2/portfolio/metro/3.jpg"
  },
  "/images2/portfolio/metro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"12ad-RsI8QHlHN2eLADs80Qt5vSmNksg\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 4781,
    "path": "../public/images2/portfolio/metro/4.jpg"
  },
  "/images2/portfolio/metro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"11a4-BJXv97Q8e6er47gKP8Q9YfIMSSI\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 4516,
    "path": "../public/images2/portfolio/metro/5.jpg"
  },
  "/images2/portfolio/metro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1206-76uRllCAjPJePFMzk7mMy+7mP8w\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 4614,
    "path": "../public/images2/portfolio/metro/6.jpg"
  },
  "/images2/portfolio/metro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"12bc-WB7cnBjvoZLJdXql4dcWwBgoLmY\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 4796,
    "path": "../public/images2/portfolio/metro/7.jpg"
  },
  "/images2/portfolio/metro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"e9a-PYjcYDvQKPvF4SALJ7avjOKrIUU\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 3738,
    "path": "../public/images2/portfolio/metro/8.jpg"
  },
  "/images2/portfolio/metro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"e22-OtsvoW/eRm3XpUAurkmqaNIyquE\"",
    "mtime": "2023-04-08T00:16:32.259Z",
    "size": 3618,
    "path": "../public/images2/portfolio/metro/9.jpg"
  },
  "/images2/slider/bags/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.215Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/1.jpg"
  },
  "/images2/slider/bags/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.212Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/2.jpg"
  },
  "/images2/slider/bags/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.212Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/3.jpg"
  },
  "/images2/slider/bags/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.212Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/4.jpg"
  },
  "/images2/slider/bags/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.212Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/5.jpg"
  },
  "/images2/slider/bags/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.212Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/6.jpg"
  },
  "/images2/slider/bags/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.212Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/7.jpg"
  },
  "/images2/slider/bags/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/bags/8.jpg"
  },
  "/images2/slider/beauty/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/beauty/1.jpg"
  },
  "/images2/slider/beauty/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/beauty/2.jpg"
  },
  "/images2/slider/beauty/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/beauty/3.jpg"
  },
  "/images2/slider/beauty/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/beauty/4.jpg"
  },
  "/images2/slider/beauty/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/beauty/5.jpg"
  },
  "/images2/slider/beauty/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/beauty/6.jpg"
  },
  "/images2/slider/beauty/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.209Z",
    "size": 3293,
    "path": "../public/images2/slider/beauty/7.jpg"
  },
  "/images2/slider/fashion/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/1.jpg"
  },
  "/images2/slider/fashion/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/10.jpg"
  },
  "/images2/slider/fashion/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/11.jpg"
  },
  "/images2/slider/fashion/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/2.jpg"
  },
  "/images2/slider/fashion/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/3.jpg"
  },
  "/images2/slider/fashion/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/4.jpg"
  },
  "/images2/slider/fashion/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/5.jpg"
  },
  "/images2/slider/fashion/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.205Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/6.jpg"
  },
  "/images2/slider/fashion/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.202Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/7.jpg"
  },
  "/images2/slider/fashion/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.202Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/8.jpg"
  },
  "/images2/slider/fashion/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.202Z",
    "size": 10803,
    "path": "../public/images2/slider/fashion/9.jpg"
  },
  "/images2/slider/goggles/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.202Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/1.jpg"
  },
  "/images2/slider/goggles/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.202Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/2.jpg"
  },
  "/images2/slider/goggles/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.202Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/3.jpg"
  },
  "/images2/slider/goggles/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.199Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/4.jpg"
  },
  "/images2/slider/goggles/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.199Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/5.jpg"
  },
  "/images2/slider/goggles/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.199Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/6.jpg"
  },
  "/images2/slider/goggles/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.199Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/7.jpg"
  },
  "/images2/slider/goggles/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.199Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/8.jpg"
  },
  "/images2/slider/goggles/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.199Z",
    "size": 2865,
    "path": "../public/images2/slider/goggles/9.jpg"
  },
  "/images2/slider/gym/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.199Z",
    "size": 10803,
    "path": "../public/images2/slider/gym/1.jpg"
  },
  "/images2/slider/gym/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.195Z",
    "size": 10803,
    "path": "../public/images2/slider/gym/2.jpg"
  },
  "/images2/slider/gym/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.195Z",
    "size": 10803,
    "path": "../public/images2/slider/gym/3.jpg"
  },
  "/images2/slider/gym/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.195Z",
    "size": 10803,
    "path": "../public/images2/slider/gym/4.jpg"
  },
  "/images2/slider/gym/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.195Z",
    "size": 10803,
    "path": "../public/images2/slider/gym/5.jpg"
  },
  "/images2/slider/gym/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.192Z",
    "size": 10803,
    "path": "../public/images2/slider/gym/6.jpg"
  },
  "/images2/slider/gym/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a33-G+tb3RC75eHiTnmCHpNgK6xAACY\"",
    "mtime": "2023-04-08T00:16:32.192Z",
    "size": 10803,
    "path": "../public/images2/slider/gym/7.jpg"
  },
  "/images2/slider/jewellery/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.192Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/1.jpg"
  },
  "/images2/slider/jewellery/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.192Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/2.jpg"
  },
  "/images2/slider/jewellery/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.192Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/3.jpg"
  },
  "/images2/slider/jewellery/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.192Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/4.jpg"
  },
  "/images2/slider/jewellery/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.189Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/5.jpg"
  },
  "/images2/slider/jewellery/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.189Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/6.jpg"
  },
  "/images2/slider/jewellery/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.189Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/7.jpg"
  },
  "/images2/slider/jewellery/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.189Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/8.jpg"
  },
  "/images2/slider/jewellery/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.189Z",
    "size": 3293,
    "path": "../public/images2/slider/jewellery/9.jpg"
  },
  "/images2/slider/kids/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.189Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/1.jpg"
  },
  "/images2/slider/kids/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.189Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/2.jpg"
  },
  "/images2/slider/kids/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.185Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/3.jpg"
  },
  "/images2/slider/kids/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.185Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/4.jpg"
  },
  "/images2/slider/kids/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.185Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/5.jpg"
  },
  "/images2/slider/kids/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.185Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/6.jpg"
  },
  "/images2/slider/kids/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.185Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/7.jpg"
  },
  "/images2/slider/kids/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.185Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/8.jpg"
  },
  "/images2/slider/kids/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"b31-Zu/mISDUTmtFjVsDh/+sndoAJcE\"",
    "mtime": "2023-04-08T00:16:32.182Z",
    "size": 2865,
    "path": "../public/images2/slider/kids/9.jpg"
  },
  "/images2/slider/marketplace/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.182Z",
    "size": 2967,
    "path": "../public/images2/slider/marketplace/1.jpg"
  },
  "/images2/slider/marketplace/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.182Z",
    "size": 2967,
    "path": "../public/images2/slider/marketplace/2.jpg"
  },
  "/images2/slider/marketplace/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.182Z",
    "size": 2967,
    "path": "../public/images2/slider/marketplace/3.jpg"
  },
  "/images2/slider/marketplace/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.182Z",
    "size": 2967,
    "path": "../public/images2/slider/marketplace/4.jpg"
  },
  "/images2/slider/marketplace/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.182Z",
    "size": 2967,
    "path": "../public/images2/slider/marketplace/5.jpg"
  },
  "/images2/slider/marketplace/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.182Z",
    "size": 2967,
    "path": "../public/images2/slider/marketplace/6.jpg"
  },
  "/images2/slider/marketplace/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"b97-XjGu9flryqVWynOtOHo3lh8G70s\"",
    "mtime": "2023-04-08T00:16:32.179Z",
    "size": 2967,
    "path": "../public/images2/slider/marketplace/7.jpg"
  },
  "/images2/slider/nursery/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.179Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/1.jpg"
  },
  "/images2/slider/nursery/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.179Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/10.jpg"
  },
  "/images2/slider/nursery/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.179Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/2.jpg"
  },
  "/images2/slider/nursery/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/3.jpg"
  },
  "/images2/slider/nursery/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/4.jpg"
  },
  "/images2/slider/nursery/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/5.jpg"
  },
  "/images2/slider/nursery/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/6.jpg"
  },
  "/images2/slider/nursery/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/7.jpg"
  },
  "/images2/slider/nursery/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/8.jpg"
  },
  "/images2/slider/nursery/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"c71-Qz/vwsMOBygln+hfTogWCWI2LE0\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3185,
    "path": "../public/images2/slider/nursery/9.jpg"
  },
  "/images2/slider/shoes/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.175Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/1.jpg"
  },
  "/images2/slider/shoes/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/10.jpg"
  },
  "/images2/slider/shoes/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/2.jpg"
  },
  "/images2/slider/shoes/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/3.jpg"
  },
  "/images2/slider/shoes/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/4.jpg"
  },
  "/images2/slider/shoes/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/5.jpg"
  },
  "/images2/slider/shoes/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/6.jpg"
  },
  "/images2/slider/shoes/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/7.jpg"
  },
  "/images2/slider/shoes/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/8.jpg"
  },
  "/images2/slider/shoes/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.172Z",
    "size": 3293,
    "path": "../public/images2/slider/shoes/9.jpg"
  },
  "/images2/slider/watches/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/1.jpg"
  },
  "/images2/slider/watches/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/2.jpg"
  },
  "/images2/slider/watches/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/3.jpg"
  },
  "/images2/slider/watches/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/4.jpg"
  },
  "/images2/slider/watches/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/5.jpg"
  },
  "/images2/slider/watches/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/6.jpg"
  },
  "/images2/slider/watches/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.169Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/7.jpg"
  },
  "/images2/slider/watches/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdd-z7x7hQljYzeue8fpKSbFlU3EKQA\"",
    "mtime": "2023-04-08T00:16:32.165Z",
    "size": 3293,
    "path": "../public/images2/slider/watches/8.jpg"
  },
  "/images2/tools/category/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:32.159Z",
    "size": 50807,
    "path": "../public/images2/tools/category/1.jpg"
  },
  "/images2/tools/category/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:32.159Z",
    "size": 50807,
    "path": "../public/images2/tools/category/2.jpg"
  },
  "/images2/tools/category/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 50807,
    "path": "../public/images2/tools/category/3.jpg"
  },
  "/images2/tools/category/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 50807,
    "path": "../public/images2/tools/category/4.jpg"
  },
  "/images2/tools/category/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"c677-1We9PmIKltxVkjNSIO2ICxsOTck\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 50807,
    "path": "../public/images2/tools/category/5.jpg"
  },
  "/images2/tools/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-usWMVW/zE879dMO5vwnkcXIitmU\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/1.jpg"
  },
  "/images2/tools/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-sjxM8fs0PdgarnPKOpiTRhkK8yk\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/10.jpg"
  },
  "/images2/tools/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-Y2XATi6Mn4FsHQ6+HPFpNOXiYGc\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/11.jpg"
  },
  "/images2/tools/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-nSxzXgQIxCsP3O+dVQWf5G4YOSA\"",
    "mtime": "2023-04-08T00:16:32.155Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/12.jpg"
  },
  "/images2/tools/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-m/EMgsUWUfby9fsYTH2Gmmu4YxE\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/13.jpg"
  },
  "/images2/tools/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-y7sbHNt6bgSv2866bgugl5ptTMs\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/14.jpg"
  },
  "/images2/tools/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-mneQhR+0JKOFVzgl6N2M6NoV1Q0\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/15.jpg"
  },
  "/images2/tools/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-uYJpA4zcnAIJ0NSgZ3MwVX95y1w\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/16.jpg"
  },
  "/images2/tools/pro/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-KpbPLIBXR/9aY4ggLKs7Fywsn30\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/17.jpg"
  },
  "/images2/tools/pro/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-8YnhyX3zWst1S77RXUo0HLnZ//U\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/18.jpg"
  },
  "/images2/tools/pro/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-YrGn+cUAauLRfPPyT2IitpLkLfI\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/19.jpg"
  },
  "/images2/tools/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-plhN6XdCZFx7W7LluEPhIr8ja1E\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/2.jpg"
  },
  "/images2/tools/pro/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-v52OowR1VgMR3h5HGNrtHDo/4iM\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/20.jpg"
  },
  "/images2/tools/pro/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-ANIMo6svYogq+7VJXEUKI87aAJI\"",
    "mtime": "2023-04-08T00:16:32.152Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/21.jpg"
  },
  "/images2/tools/pro/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-EaD/8mFw4mLEdJbfYMxCMgLTfLE\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/22.jpg"
  },
  "/images2/tools/pro/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-FAwW1WnvA8M4XXskL9veP5pmThM\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/23.jpg"
  },
  "/images2/tools/pro/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-T2WJ/Obq+UgzgoKtJVN98m07mec\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/24.jpg"
  },
  "/images2/tools/pro/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-E8iDIt+nQt+214XIou2e2VmkTis\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/25.jpg"
  },
  "/images2/tools/pro/26.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-DrSiFoukY9y4WzZ0BCn/ZpR3Zy0\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/26.jpg"
  },
  "/images2/tools/pro/27.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-TFiUtuDv/kBPvCm9QGlZjNtyFi4\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/27.jpg"
  },
  "/images2/tools/pro/28.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-S8F+HDYDclURVwGxOAeiCGBNAB8\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/28.jpg"
  },
  "/images2/tools/pro/29.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-Fhobbyvq9NeZ26rdy6YUejTktbg\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/29.jpg"
  },
  "/images2/tools/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-wAHQJCTb2zWOsnwM8eV5SDGlkTA\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/3.jpg"
  },
  "/images2/tools/pro/30.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-YLIHvgfzrX45gcnV1j7Iw4iAa2Q\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/30.jpg"
  },
  "/images2/tools/pro/31.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-cnlLgW3BeE2tDGmNt3fbYEst8KU\"",
    "mtime": "2023-04-08T00:16:32.149Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/31.jpg"
  },
  "/images2/tools/pro/32.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-IZUalSHXQJ3oG2/PkhOPBrxU7gA\"",
    "mtime": "2023-04-08T00:16:32.145Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/32.jpg"
  },
  "/images2/tools/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-qYWh9z/GXbEyDbgWCZtRpkFnSso\"",
    "mtime": "2023-04-08T00:16:32.145Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/4.jpg"
  },
  "/images2/tools/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-hfuYN0ZuH37Z+DosjiKJo7flrRM\"",
    "mtime": "2023-04-08T00:16:32.145Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/5.jpg"
  },
  "/images2/tools/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-TK6QfA/b7uTsEL4nRSAJYraDYjU\"",
    "mtime": "2023-04-08T00:16:32.145Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/6.jpg"
  },
  "/images2/tools/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-+B5YPSshtjqAYraSTG3Ini8B3go\"",
    "mtime": "2023-04-08T00:16:32.145Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/7.jpg"
  },
  "/images2/tools/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-wMkS5p7Oiqzq6pG/wPWecfroAAk\"",
    "mtime": "2023-04-08T00:16:32.145Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/8.jpg"
  },
  "/images2/tools/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"32c4-0+zqF5W6Hta5NqInITqfBe9YDzE\"",
    "mtime": "2023-04-08T00:16:32.145Z",
    "size": 12996,
    "path": "../public/images2/tools/pro/9.jpg"
  },
  "/images2/vegetables/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3c4a-PU2/uvW0fM2YHqbONLfBnn53WQE\"",
    "mtime": "2023-04-08T00:16:32.142Z",
    "size": 15434,
    "path": "../public/images2/vegetables/banner/1.jpg"
  },
  "/images2/vegetables/banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d84-EZ/MF6zjB9Ykp2Wce9EfPJA0oyk\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 11652,
    "path": "../public/images2/vegetables/banner/10.jpg"
  },
  "/images2/vegetables/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 3762,
    "path": "../public/images2/vegetables/banner/11.jpg"
  },
  "/images2/vegetables/banner/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 3762,
    "path": "../public/images2/vegetables/banner/12.jpg"
  },
  "/images2/vegetables/banner/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"eb2-25F/8PhmOaZyDiau9iE2m53R838\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 3762,
    "path": "../public/images2/vegetables/banner/13.jpg"
  },
  "/images2/vegetables/banner/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"607c-AF1U+wXaNdMG43poRva9BdTob+k\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 24700,
    "path": "../public/images2/vegetables/banner/14.jpg"
  },
  "/images2/vegetables/banner/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"607c-AF1U+wXaNdMG43poRva9BdTob+k\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 24700,
    "path": "../public/images2/vegetables/banner/15.jpg"
  },
  "/images2/vegetables/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3c4a-PU2/uvW0fM2YHqbONLfBnn53WQE\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 15434,
    "path": "../public/images2/vegetables/banner/2.jpg"
  },
  "/images2/vegetables/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dab-iENYYyO/i6fWj+6euueJjoYVj5g\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 7595,
    "path": "../public/images2/vegetables/banner/3.jpg"
  },
  "/images2/vegetables/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dab-iENYYyO/i6fWj+6euueJjoYVj5g\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 7595,
    "path": "../public/images2/vegetables/banner/4.jpg"
  },
  "/images2/vegetables/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dab-iENYYyO/i6fWj+6euueJjoYVj5g\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 7595,
    "path": "../public/images2/vegetables/banner/5.jpg"
  },
  "/images2/vegetables/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dab-iENYYyO/i6fWj+6euueJjoYVj5g\"",
    "mtime": "2023-04-08T00:16:32.139Z",
    "size": 7595,
    "path": "../public/images2/vegetables/banner/6.jpg"
  },
  "/images2/vegetables/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dab-iENYYyO/i6fWj+6euueJjoYVj5g\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 7595,
    "path": "../public/images2/vegetables/banner/7.jpg"
  },
  "/images2/vegetables/banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"366f-z6u7kKHof2hRFILU0zy4G0qdrJ8\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 13935,
    "path": "../public/images2/vegetables/banner/9.jpg"
  },
  "/images2/vegetables/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1900-Q7T7Hm02BeVvtPmCAIb0trXc4uQ\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 6400,
    "path": "../public/images2/vegetables/blog/1.jpg"
  },
  "/images2/vegetables/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1900-Q7T7Hm02BeVvtPmCAIb0trXc4uQ\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 6400,
    "path": "../public/images2/vegetables/blog/2.jpg"
  },
  "/images2/vegetables/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1900-Q7T7Hm02BeVvtPmCAIb0trXc4uQ\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 6400,
    "path": "../public/images2/vegetables/blog/3.jpg"
  },
  "/images2/vegetables/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1900-Q7T7Hm02BeVvtPmCAIb0trXc4uQ\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 6400,
    "path": "../public/images2/vegetables/blog/4.jpg"
  },
  "/images2/vegetables/blog/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"bab-0oDFvVifFKRB8XpiT3scRcbmqM0\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 2987,
    "path": "../public/images2/vegetables/blog/5.jpg"
  },
  "/images2/vegetables/blog/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"bab-0oDFvVifFKRB8XpiT3scRcbmqM0\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 2987,
    "path": "../public/images2/vegetables/blog/6.jpg"
  },
  "/images2/vegetables/blog/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"bab-0oDFvVifFKRB8XpiT3scRcbmqM0\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 2987,
    "path": "../public/images2/vegetables/blog/7.jpg"
  },
  "/images2/vegetables/blog/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"bab-0oDFvVifFKRB8XpiT3scRcbmqM0\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 2987,
    "path": "../public/images2/vegetables/blog/8.jpg"
  },
  "/images2/vegetables/blog/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"bab-0oDFvVifFKRB8XpiT3scRcbmqM0\"",
    "mtime": "2023-04-08T00:16:32.135Z",
    "size": 2987,
    "path": "../public/images2/vegetables/blog/9.jpg"
  },
  "/images2/vegetables/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.132Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/1.jpg"
  },
  "/images2/vegetables/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.132Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/10.jpg"
  },
  "/images2/vegetables/pro/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.132Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/11.jpg"
  },
  "/images2/vegetables/pro/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.132Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/12.jpg"
  },
  "/images2/vegetables/pro/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.132Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/13.jpg"
  },
  "/images2/vegetables/pro/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.132Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/14.jpg"
  },
  "/images2/vegetables/pro/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.132Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/15.jpg"
  },
  "/images2/vegetables/pro/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.129Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/16.jpg"
  },
  "/images2/vegetables/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.129Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/2.jpg"
  },
  "/images2/vegetables/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.129Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/3.jpg"
  },
  "/images2/vegetables/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.129Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/4.jpg"
  },
  "/images2/vegetables/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.129Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/5.jpg"
  },
  "/images2/vegetables/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.129Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/6.jpg"
  },
  "/images2/vegetables/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.129Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/7.jpg"
  },
  "/images2/vegetables/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.125Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/8.jpg"
  },
  "/images2/vegetables/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"19e7-VB7JywzuqjrClwKOjA1ll8K6Ghw\"",
    "mtime": "2023-04-08T00:16:32.125Z",
    "size": 6631,
    "path": "../public/images2/vegetables/pro/9.jpg"
  },
  "/images2/yoga/banner/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2738-Gek1svTEaX3EmKGN4zYkmayvkps\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 10040,
    "path": "../public/images2/yoga/banner/1.jpg"
  },
  "/images2/yoga/banner/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 7049,
    "path": "../public/images2/yoga/banner/10.jpg"
  },
  "/images2/yoga/banner/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 7049,
    "path": "../public/images2/yoga/banner/11.jpg"
  },
  "/images2/yoga/banner/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2738-Gek1svTEaX3EmKGN4zYkmayvkps\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 10040,
    "path": "../public/images2/yoga/banner/2.jpg"
  },
  "/images2/yoga/banner/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2738-Gek1svTEaX3EmKGN4zYkmayvkps\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 10040,
    "path": "../public/images2/yoga/banner/3.jpg"
  },
  "/images2/yoga/banner/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 3817,
    "path": "../public/images2/yoga/banner/4.jpg"
  },
  "/images2/yoga/banner/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 3817,
    "path": "../public/images2/yoga/banner/5.jpg"
  },
  "/images2/yoga/banner/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.122Z",
    "size": 3817,
    "path": "../public/images2/yoga/banner/6.jpg"
  },
  "/images2/yoga/banner/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 3817,
    "path": "../public/images2/yoga/banner/7.jpg"
  },
  "/images2/yoga/banner/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 7049,
    "path": "../public/images2/yoga/banner/8.jpg"
  },
  "/images2/yoga/banner/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b89-GEXd336um//CZFfHkqKHGGCegsE\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 7049,
    "path": "../public/images2/yoga/banner/9.jpg"
  },
  "/images2/yoga/banner/Banner-1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2358-pk1qc5GkIMUZdqZvLxhE2Pktfuw\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 9048,
    "path": "../public/images2/yoga/banner/Banner-1.jpg"
  },
  "/images2/yoga/banner/Banner-2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2358-pk1qc5GkIMUZdqZvLxhE2Pktfuw\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 9048,
    "path": "../public/images2/yoga/banner/Banner-2.jpg"
  },
  "/images2/yoga/banner/Banner-3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2358-pk1qc5GkIMUZdqZvLxhE2Pktfuw\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 9048,
    "path": "../public/images2/yoga/banner/Banner-3.jpg"
  },
  "/images2/yoga/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"dad-lK+VcfAEh3JOYDDGMTzXb6iuCZ8\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 3501,
    "path": "../public/images2/yoga/blog/1.jpg"
  },
  "/images2/yoga/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"dad-lK+VcfAEh3JOYDDGMTzXb6iuCZ8\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 3501,
    "path": "../public/images2/yoga/blog/2.jpg"
  },
  "/images2/yoga/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"dad-lK+VcfAEh3JOYDDGMTzXb6iuCZ8\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 3501,
    "path": "../public/images2/yoga/blog/3.jpg"
  },
  "/images2/yoga/instagram/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"789-PlLNgRZkfuzGpKo1v9Z+O/+00r4\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 1929,
    "path": "../public/images2/yoga/instagram/1.jpg"
  },
  "/images2/yoga/instagram/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"789-PlLNgRZkfuzGpKo1v9Z+O/+00r4\"",
    "mtime": "2023-04-08T00:16:32.119Z",
    "size": 1929,
    "path": "../public/images2/yoga/instagram/2.jpg"
  },
  "/images2/yoga/instagram/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"789-PlLNgRZkfuzGpKo1v9Z+O/+00r4\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 1929,
    "path": "../public/images2/yoga/instagram/3.jpg"
  },
  "/images2/yoga/instagram/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"789-PlLNgRZkfuzGpKo1v9Z+O/+00r4\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 1929,
    "path": "../public/images2/yoga/instagram/4.jpg"
  },
  "/images2/yoga/instagram/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"789-PlLNgRZkfuzGpKo1v9Z+O/+00r4\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 1929,
    "path": "../public/images2/yoga/instagram/5.jpg"
  },
  "/images2/yoga/instagram/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"789-PlLNgRZkfuzGpKo1v9Z+O/+00r4\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 1929,
    "path": "../public/images2/yoga/instagram/6.jpg"
  },
  "/images2/yoga/instagram/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"789-PlLNgRZkfuzGpKo1v9Z+O/+00r4\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 1929,
    "path": "../public/images2/yoga/instagram/7.jpg"
  },
  "/images2/yoga/lookbook/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"28a3-N6SNHaePH140kor1WsHD4uIBwCk\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 10403,
    "path": "../public/images2/yoga/lookbook/1.jpg"
  },
  "/images2/yoga/lookbook/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"28a3-N6SNHaePH140kor1WsHD4uIBwCk\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 10403,
    "path": "../public/images2/yoga/lookbook/2.jpg"
  },
  "/images2/yoga/multistore/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 3817,
    "path": "../public/images2/yoga/multistore/1.jpg"
  },
  "/images2/yoga/multistore/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.115Z",
    "size": 3817,
    "path": "../public/images2/yoga/multistore/2.jpg"
  },
  "/images2/yoga/multistore/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.112Z",
    "size": 3817,
    "path": "../public/images2/yoga/multistore/3.jpg"
  },
  "/images2/yoga/multistore/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"ee9-ux7kpwa5MOMbIaIhCSvn6GHmUOo\"",
    "mtime": "2023-04-08T00:16:32.112Z",
    "size": 3817,
    "path": "../public/images2/yoga/multistore/4.jpg"
  },
  "/images2/yoga/pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.112Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/1.jpg"
  },
  "/images2/yoga/pro/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.112Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/10.jpg"
  },
  "/images2/yoga/pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.112Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/2.jpg"
  },
  "/images2/yoga/pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.112Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/3.jpg"
  },
  "/images2/yoga/pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.112Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/4.jpg"
  },
  "/images2/yoga/pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/5.jpg"
  },
  "/images2/yoga/pro/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/6.jpg"
  },
  "/images2/yoga/pro/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/7.jpg"
  },
  "/images2/yoga/pro/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/8.jpg"
  },
  "/images2/yoga/pro/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/pro/9.jpg"
  },
  "/images2/yoga/white-pro/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/white-pro/1.jpg"
  },
  "/images2/yoga/white-pro/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/white-pro/2.jpg"
  },
  "/images2/yoga/white-pro/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/white-pro/3.jpg"
  },
  "/images2/yoga/white-pro/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/white-pro/4.jpg"
  },
  "/images2/yoga/white-pro/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d4-SFotDPCEuyLpr/bfHrp9399JmYg\"",
    "mtime": "2023-04-08T00:16:32.109Z",
    "size": 1236,
    "path": "../public/images2/yoga/white-pro/5.jpg"
  },
  "/images2/christmas/fashion/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-ZrSvhK6yFgjBF4U/o5RAYHYF6Y8\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/1.jpg"
  },
  "/images2/christmas/fashion/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-5Lk6lLsQxSA3q/dMdrvB++ypf/w\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/10.jpg"
  },
  "/images2/christmas/fashion/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-UOyrI59XcGlNfQe9fB6EkzGntIQ\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/11.jpg"
  },
  "/images2/christmas/fashion/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-yIv8zTW48/mdbbThe/RoCR7OHSw\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/12.jpg"
  },
  "/images2/christmas/fashion/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-8bdjqUmofC+gyRzj7JWKrFvDYLk\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/13.jpg"
  },
  "/images2/christmas/fashion/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-YEFPW/PT1PvMDcNlCoSHCSm95VQ\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/14.jpg"
  },
  "/images2/christmas/fashion/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc1-KNQUTVUBAjeUAzcVxMpdpdYRiGc\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15297,
    "path": "../public/images2/christmas/fashion/product/15.jpg"
  },
  "/images2/christmas/fashion/product/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-j0JZJ4o45rTXyMskwVVQVXElGjg\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/16.jpg"
  },
  "/images2/christmas/fashion/product/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-5Y/jkq/UXyyhm1TMGD438BWlVzs\"",
    "mtime": "2023-04-08T00:16:33.059Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/17.jpg"
  },
  "/images2/christmas/fashion/product/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-iHxbGH64KIj0nleBFmUW2AMJN7Y\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/18.jpg"
  },
  "/images2/christmas/fashion/product/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-F9IUtHsDNZpff75vRVagcNguBC8\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/19.jpg"
  },
  "/images2/christmas/fashion/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-ZrSvhK6yFgjBF4U/o5RAYHYF6Y8\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/2.jpg"
  },
  "/images2/christmas/fashion/product/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-M01n28tuCB8GUq5oDJkWXphfgl8\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/20.jpg"
  },
  "/images2/christmas/fashion/product/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-YB1up+G4CmQhgrP1drsK1H3UZDY\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/21.jpg"
  },
  "/images2/christmas/fashion/product/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-+yMVQ/w0MQHUyfp1KVFkzat5suk\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/22.jpg"
  },
  "/images2/christmas/fashion/product/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-G32aQPZWE/sLKDyuqlChueKvL3E\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/23.jpg"
  },
  "/images2/christmas/fashion/product/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-hKppK35FrRHXHWD0Dyb02IVC8V8\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/24.jpg"
  },
  "/images2/christmas/fashion/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-ZrSvhK6yFgjBF4U/o5RAYHYF6Y8\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/3.jpg"
  },
  "/images2/christmas/fashion/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-LKIYl2OgLPZ3ObsXGB96BydcsbE\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/4.jpg"
  },
  "/images2/christmas/fashion/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-CWEN2EK79CQAaRqc9BzM5DNHZvU\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/5.jpg"
  },
  "/images2/christmas/fashion/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-xoQ+RrMN2+8Q2heCexLM8sZ5wbM\"",
    "mtime": "2023-04-08T00:16:33.055Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/6.jpg"
  },
  "/images2/christmas/fashion/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-Z2sUnf3t6wKgAU3rT6kTP30EXpc\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/7.jpg"
  },
  "/images2/christmas/fashion/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-N4AfutBxRKUcPAccNRGsKOgiMig\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/8.jpg"
  },
  "/images2/christmas/fashion/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bc3-eyOhnOV8EegwwLBX/06UsdFdkVA\"",
    "mtime": "2023-04-08T00:16:33.052Z",
    "size": 15299,
    "path": "../public/images2/christmas/fashion/product/9.jpg"
  },
  "/images2/flower/blog/insta/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/1.jpg"
  },
  "/images2/flower/blog/insta/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/2.jpg"
  },
  "/images2/flower/blog/insta/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/3.jpg"
  },
  "/images2/flower/blog/insta/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/4.jpg"
  },
  "/images2/flower/blog/insta/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/5.jpg"
  },
  "/images2/flower/blog/insta/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/6.jpg"
  },
  "/images2/flower/blog/insta/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/7.jpg"
  },
  "/images2/flower/blog/insta/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"9c2-6gbg/vT3tFOj/GSIPBzJ1GSx7co\"",
    "mtime": "2023-04-08T00:16:32.809Z",
    "size": 2498,
    "path": "../public/images2/flower/blog/insta/8.jpg"
  },
  "/images2/landing-page/special_features/blog/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"201dd-gSLaX/t3riQ0w4tYeaBeRuMkxLE\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 131549,
    "path": "../public/images2/landing-page/special_features/blog/1.jpg"
  },
  "/images2/landing-page/special_features/blog/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"176c9-u6AdZAkRtDXqohZTU0cz847Qat8\"",
    "mtime": "2023-04-08T00:16:32.492Z",
    "size": 95945,
    "path": "../public/images2/landing-page/special_features/blog/2.jpg"
  },
  "/images2/landing-page/special_features/blog/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"17ebc-mOr1siBrOCTe5tEXzr0eNFZwgNU\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 97980,
    "path": "../public/images2/landing-page/special_features/blog/3.jpg"
  },
  "/images2/landing-page/special_features/blog/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cfac-U06YdBYTsQDDn2DV5yRWQK8nOWk\"",
    "mtime": "2023-04-08T00:16:32.489Z",
    "size": 118700,
    "path": "../public/images2/landing-page/special_features/blog/4.jpg"
  },
  "/images2/landing-page/special_features/other/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"fcd4-dmoiQ2nqrfX7T9QO3vD3I4bFoZc\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 64724,
    "path": "../public/images2/landing-page/special_features/other/1.jpg"
  },
  "/images2/landing-page/special_features/other/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1894e-JYcEK9XdcbMrwCL19PStBNc+5+U\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 100686,
    "path": "../public/images2/landing-page/special_features/other/10.jpg"
  },
  "/images2/landing-page/special_features/other/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"181a4-Vk/aWESS/mpovFY0zOZa4Jnarlo\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 98724,
    "path": "../public/images2/landing-page/special_features/other/11.jpg"
  },
  "/images2/landing-page/special_features/other/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"171f0-nr2DgSDAPas4JU9CC2clsO/69ns\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 94704,
    "path": "../public/images2/landing-page/special_features/other/12.jpg"
  },
  "/images2/landing-page/special_features/other/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"14513-NgcR71mEmNdL/3FXoa0sfRHSgvw\"",
    "mtime": "2023-04-08T00:16:32.482Z",
    "size": 83219,
    "path": "../public/images2/landing-page/special_features/other/13.jpg"
  },
  "/images2/landing-page/special_features/other/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"13859-y8CkDhI3oCtN3uh/w8i38BnkNz0\"",
    "mtime": "2023-04-08T00:16:32.479Z",
    "size": 79961,
    "path": "../public/images2/landing-page/special_features/other/14.jpg"
  },
  "/images2/landing-page/special_features/other/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"15e99-uFvp5zOBCiFtsOy7VA0BTjnae4s\"",
    "mtime": "2023-04-08T00:16:32.479Z",
    "size": 89753,
    "path": "../public/images2/landing-page/special_features/other/15.jpg"
  },
  "/images2/landing-page/special_features/other/16.jpg": {
    "type": "image/jpeg",
    "etag": "\"12e25-8KkqdlohUA44Li0xxITRxON6glM\"",
    "mtime": "2023-04-08T00:16:32.479Z",
    "size": 77349,
    "path": "../public/images2/landing-page/special_features/other/16.jpg"
  },
  "/images2/landing-page/special_features/other/17.jpg": {
    "type": "image/jpeg",
    "etag": "\"23ebb-9AVz3U92eNaQmS/DSNIfjSCdspc\"",
    "mtime": "2023-04-08T00:16:32.479Z",
    "size": 147131,
    "path": "../public/images2/landing-page/special_features/other/17.jpg"
  },
  "/images2/landing-page/special_features/other/18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b147-9d+ftgjMQtbosFnSKev1IOyddBM\"",
    "mtime": "2023-04-08T00:16:32.479Z",
    "size": 110919,
    "path": "../public/images2/landing-page/special_features/other/18.jpg"
  },
  "/images2/landing-page/special_features/other/19.jpg": {
    "type": "image/jpeg",
    "etag": "\"12370-vOfcvCPYqunr0uJmIKHtwu13zjE\"",
    "mtime": "2023-04-08T00:16:32.479Z",
    "size": 74608,
    "path": "../public/images2/landing-page/special_features/other/19.jpg"
  },
  "/images2/landing-page/special_features/other/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"10325-ZsoL5+JRttt33z1yynhO1U6tGKY\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 66341,
    "path": "../public/images2/landing-page/special_features/other/2.jpg"
  },
  "/images2/landing-page/special_features/other/20.jpg": {
    "type": "image/jpeg",
    "etag": "\"e192-9X4zoAD61A4JVCPZYPyOiR1NJvU\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 57746,
    "path": "../public/images2/landing-page/special_features/other/20.jpg"
  },
  "/images2/landing-page/special_features/other/21.jpg": {
    "type": "image/jpeg",
    "etag": "\"1647f-H1rlJxJKH6x6jvIEZ3d4R5RNT7U\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 91263,
    "path": "../public/images2/landing-page/special_features/other/21.jpg"
  },
  "/images2/landing-page/special_features/other/22.jpg": {
    "type": "image/jpeg",
    "etag": "\"142f6-AwlzisOLD4IbRhXwaXGv7nGo6D0\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 82678,
    "path": "../public/images2/landing-page/special_features/other/22.jpg"
  },
  "/images2/landing-page/special_features/other/23.jpg": {
    "type": "image/jpeg",
    "etag": "\"4242-enbdLRTvJ4JUpqm6d7SjMbw59HQ\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 16962,
    "path": "../public/images2/landing-page/special_features/other/23.jpg"
  },
  "/images2/landing-page/special_features/other/24.jpg": {
    "type": "image/jpeg",
    "etag": "\"76b9-I2jthTli5oHZtn4x2WKzAb91cGw\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 30393,
    "path": "../public/images2/landing-page/special_features/other/24.jpg"
  },
  "/images2/landing-page/special_features/other/25.jpg": {
    "type": "image/jpeg",
    "etag": "\"4e32-MBi79bfUp2XO9uD/j17ulI2E3Fc\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 20018,
    "path": "../public/images2/landing-page/special_features/other/25.jpg"
  },
  "/images2/landing-page/special_features/other/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"1267c-IPpBYNK6TyP+bK87ojhKxWQ5PJM\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 75388,
    "path": "../public/images2/landing-page/special_features/other/3.jpg"
  },
  "/images2/landing-page/special_features/other/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"10167-DCFqwh8weT3uSn7vI0DESgqF90Y\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 65895,
    "path": "../public/images2/landing-page/special_features/other/4.jpg"
  },
  "/images2/landing-page/special_features/other/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"102b4-1KKjDPJ+G2wfJZHxhEfQAs8gHXY\"",
    "mtime": "2023-04-08T00:16:32.475Z",
    "size": 66228,
    "path": "../public/images2/landing-page/special_features/other/5.jpg"
  },
  "/images2/landing-page/special_features/other/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"ddb8-vU59jxGZiWbjpG/VwDA0dyHa4WA\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 56760,
    "path": "../public/images2/landing-page/special_features/other/6.jpg"
  },
  "/images2/landing-page/special_features/other/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"eafe-HWM+eFYog7wKRw1LVNwgqwfmQew\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 60158,
    "path": "../public/images2/landing-page/special_features/other/7.jpg"
  },
  "/images2/landing-page/special_features/other/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"b190-GSQlhyKQ2FrLd0U/etCkgTbGYN4\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 45456,
    "path": "../public/images2/landing-page/special_features/other/8.jpg"
  },
  "/images2/landing-page/special_features/other/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"f143-eItJdWUcXZ645WYdvUeIW0hJP68\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 61763,
    "path": "../public/images2/landing-page/special_features/other/9.jpg"
  },
  "/images2/landing-page/special_features/other/order-tracking.jpg": {
    "type": "image/jpeg",
    "etag": "\"4e15-NQhf4oycQUbuGiBpcllS6zSfCeU\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 19989,
    "path": "../public/images2/landing-page/special_features/other/order-tracking.jpg"
  },
  "/images2/landing-page/special_features/product/014.jpg": {
    "type": "image/jpeg",
    "etag": "\"4c6b-+PPo791vxZvVTzu8T3JZ1CIObck\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 19563,
    "path": "../public/images2/landing-page/special_features/product/014.jpg"
  },
  "/images2/landing-page/special_features/product/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"4aa1-7/njwFkWeHUad5eMsrWtVzzhy9M\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 19105,
    "path": "../public/images2/landing-page/special_features/product/1.jpg"
  },
  "/images2/landing-page/special_features/product/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"39cd-C8XG2TTWAopaalPQz1u5Ph1G3Y0\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 14797,
    "path": "../public/images2/landing-page/special_features/product/10.jpg"
  },
  "/images2/landing-page/special_features/product/11.jpg": {
    "type": "image/jpeg",
    "etag": "\"3f63-qXkgszY9NcvoCDTRLBRNbwNfR3Q\"",
    "mtime": "2023-04-08T00:16:32.472Z",
    "size": 16227,
    "path": "../public/images2/landing-page/special_features/product/11.jpg"
  },
  "/images2/landing-page/special_features/product/12.jpg": {
    "type": "image/jpeg",
    "etag": "\"5459-YwtbuVmi1rYOhoj5uVXM4QE/dvU\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 21593,
    "path": "../public/images2/landing-page/special_features/product/12.jpg"
  },
  "/images2/landing-page/special_features/product/13.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b63-OdLsgJQ4TK/CLxoqA5JEtWcw7N8\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 19299,
    "path": "../public/images2/landing-page/special_features/product/13.jpg"
  },
  "/images2/landing-page/special_features/product/14.jpg": {
    "type": "image/jpeg",
    "etag": "\"503c-hnTpejT4odD14gvtUX1v8PRT+ns\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 20540,
    "path": "../public/images2/landing-page/special_features/product/14.jpg"
  },
  "/images2/landing-page/special_features/product/15.jpg": {
    "type": "image/jpeg",
    "etag": "\"5623-elFBm3SmLllW65ReiloayFnmyy4\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 22051,
    "path": "../public/images2/landing-page/special_features/product/15.jpg"
  },
  "/images2/landing-page/special_features/product/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"466a-v/EtUjfkyeAamshDJfYoYoUYk2s\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 18026,
    "path": "../public/images2/landing-page/special_features/product/2.jpg"
  },
  "/images2/landing-page/special_features/product/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"3eb0-vR4ipDqAOK93sj4f1XDxA7mIrrY\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 16048,
    "path": "../public/images2/landing-page/special_features/product/3.jpg"
  },
  "/images2/landing-page/special_features/product/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"5422-sImQLBRULndWe+l9SL0RLQvM94M\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 21538,
    "path": "../public/images2/landing-page/special_features/product/4.jpg"
  },
  "/images2/landing-page/special_features/product/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4bd0-lPj4kX3pzLDLHxfZ2+HCG6yPxHU\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 19408,
    "path": "../public/images2/landing-page/special_features/product/5.jpg"
  },
  "/images2/landing-page/special_features/product/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"5409-Mur771f0/uWAjX+4pCjA2/Z1rD0\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 21513,
    "path": "../public/images2/landing-page/special_features/product/6.jpg"
  },
  "/images2/landing-page/special_features/product/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"3406-qwgXSAeExS9yjnU/leFB9FrQUKE\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 13318,
    "path": "../public/images2/landing-page/special_features/product/7.jpg"
  },
  "/images2/landing-page/special_features/product/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4328-xU5RfzbGCuMQ7KhAB+xJbHVpgfE\"",
    "mtime": "2023-04-08T00:16:32.469Z",
    "size": 17192,
    "path": "../public/images2/landing-page/special_features/product/8.jpg"
  },
  "/images2/landing-page/special_features/product/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"4768-uOu5nwt6plBlC7RYaN9O++9eURc\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 18280,
    "path": "../public/images2/landing-page/special_features/product/9.jpg"
  },
  "/images2/landing-page/special_features/shop/1.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e51-zp22uZQf8q+HBjE/b4hX4W8cySY\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 24145,
    "path": "../public/images2/landing-page/special_features/shop/1.jpg"
  },
  "/images2/landing-page/special_features/shop/10.jpg": {
    "type": "image/jpeg",
    "etag": "\"cebe-0SHIn6E073e5eLvB7KJweDZg6H0\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 52926,
    "path": "../public/images2/landing-page/special_features/shop/10.jpg"
  },
  "/images2/landing-page/special_features/shop/2.jpg": {
    "type": "image/jpeg",
    "etag": "\"649c-EyI5WYT/j0VAV+gGE5vivPQ1Npg\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 25756,
    "path": "../public/images2/landing-page/special_features/shop/2.jpg"
  },
  "/images2/landing-page/special_features/shop/3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5fbd-j5CfiZ3Bxz/KEWRuzBoMN+IvL8w\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 24509,
    "path": "../public/images2/landing-page/special_features/shop/3.jpg"
  },
  "/images2/landing-page/special_features/shop/4.jpg": {
    "type": "image/jpeg",
    "etag": "\"561e-kE1eGpB4Wtd0/iOlAI9LIpfaM/Q\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 22046,
    "path": "../public/images2/landing-page/special_features/shop/4.jpg"
  },
  "/images2/landing-page/special_features/shop/5.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f9a-DYtgdDZ7+Ebri1qJ4gxcLllvPgs\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 24474,
    "path": "../public/images2/landing-page/special_features/shop/5.jpg"
  },
  "/images2/landing-page/special_features/shop/6.jpg": {
    "type": "image/jpeg",
    "etag": "\"5de6-NUhljloEFDRlj/zsVahwuuYvJKg\"",
    "mtime": "2023-04-08T00:16:32.465Z",
    "size": 24038,
    "path": "../public/images2/landing-page/special_features/shop/6.jpg"
  },
  "/images2/landing-page/special_features/shop/7.jpg": {
    "type": "image/jpeg",
    "etag": "\"59e4-NCPZj+IrNa5M6aAUs5PemG5lzMA\"",
    "mtime": "2023-04-08T00:16:32.462Z",
    "size": 23012,
    "path": "../public/images2/landing-page/special_features/shop/7.jpg"
  },
  "/images2/landing-page/special_features/shop/8.jpg": {
    "type": "image/jpeg",
    "etag": "\"5685-2zVhePE6qR37QBF5bZcnebknnzQ\"",
    "mtime": "2023-04-08T00:16:32.462Z",
    "size": 22149,
    "path": "../public/images2/landing-page/special_features/shop/8.jpg"
  },
  "/images2/landing-page/special_features/shop/9.jpg": {
    "type": "image/jpeg",
    "etag": "\"3bf8-tOjji0LG79itJnWTToDb0otqq3A\"",
    "mtime": "2023-04-08T00:16:32.462Z",
    "size": 15352,
    "path": "../public/images2/landing-page/special_features/shop/9.jpg"
  },
  "/images2/landing-page/special_features/shop/mordern.jpg": {
    "type": "image/jpeg",
    "etag": "\"494b-eHbXHjXVTbgOA/V0aR8bgyaYe68\"",
    "mtime": "2023-04-08T00:16:32.462Z",
    "size": 18763,
    "path": "../public/images2/landing-page/special_features/shop/mordern.jpg"
  },
  "/images2/landing-page/special_features/shop/top-filter.jpg": {
    "type": "image/jpeg",
    "etag": "\"4d85-frQDtBNSV858bwmyIQWPLYsNNU0\"",
    "mtime": "2023-04-08T00:16:32.459Z",
    "size": 19845,
    "path": "../public/images2/landing-page/special_features/shop/top-filter.jpg"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end();
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end();
      return;
    }
  }
  if (asset.type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.getHeader("ETag")) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.getHeader("Last-Modified")) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.res.getHeader("Content-Encoding")) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size && !event.res.getHeader("Content-Length")) {
    event.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _e60iOv = lazyEventHandler(() => {
  const ipxOptions = {
    ...useRuntimeConfig().ipx || {},
    dir: fileURLToPath(new URL("../public", globalThis._importMeta_.url))
  };
  const ipx = createIPX(ipxOptions);
  const middleware = createIPXMiddleware(ipx);
  return eventHandler(async (event) => {
    event.req.url = withLeadingSlash(event.context.params._);
    await middleware(event.req, event.res);
  });
});

const _lazy_Znar6I = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_Znar6I, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _e60iOv, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_Znar6I, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(h.route.replace(/:\w+|\*\*/g, "_"));
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
