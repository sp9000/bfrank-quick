import { ref } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { parse, serialize } from 'file:///home/sp07/vue/templatian/node_modules/cookie-es/dist/index.mjs';
import { appendHeader } from 'file:///home/sp07/vue/templatian/node_modules/h3/dist/index.mjs';
import destr from 'file:///home/sp07/vue/templatian/node_modules/destr/dist/index.mjs';
import { isEqual } from 'file:///home/sp07/vue/templatian/node_modules/ohash/dist/index.mjs';
import { u as useNuxtApp, g as useRequestEvent } from '../server.mjs';

const CookieDefaults = {
  path: "/",
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a, _b;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  const cookie = ref((_b = cookies[name]) != null ? _b : (_a = opts.default) == null ? void 0 : _a.call(opts));
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (!isEqual(cookie.value, cookies[name])) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:redirected", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  var _a;
  {
    return parse(((_a = useRequestEvent()) == null ? void 0 : _a.req.headers.cookie) || "", opts);
  }
}
function serializeCookie(name, value, opts = {}) {
  if (value === null || value === void 0) {
    return serialize(name, value, { ...opts, maxAge: -1 });
  }
  return serialize(name, value, opts);
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    appendHeader(event, "Set-Cookie", serializeCookie(name, value, opts));
  }
}

export { useCookie as u };
//# sourceMappingURL=cookie.d1875fbc.mjs.map
