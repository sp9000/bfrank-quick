import { getCurrentInstance, toRef, isRef, inject, toRaw, isReactive, defineAsyncComponent, version, defineComponent, h, onUnmounted, computed, unref, Suspense, nextTick, Transition, provide, reactive, ref, resolveComponent, shallowRef, watch, Fragment as Fragment$1, useSSRContext, createApp, effectScope, markRaw, onErrorCaptured, getCurrentScope, onScopeDispose, toRefs, createVNode, Text, withCtx } from 'vue';
import { $fetch } from 'ofetch';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import { hasProtocol, isEqual, encodeParam, joinURL, withLeadingSlash, parseURL, encodePath } from 'ufo';
import { createError as createError$1, sendRedirect } from 'h3';
import { useHead as useHead$1, createHead as createHead$1 } from '@unhead/vue';
import { renderDOMHead, debouncedRenderDOMHead } from '@unhead/dom';
import { useRouter as useRouter$1, useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter } from 'vue-router';
import { CoreWarnCodes, CompileErrorCodes, registerMessageResolver, resolveValue, registerLocaleFallbacker, fallbackWithLocaleChain, setDevToolsHook, createCompileError, DEFAULT_LOCALE as DEFAULT_LOCALE$1, updateFallbackLocale, NUMBER_FORMAT_OPTIONS_KEYS, DATETIME_FORMAT_OPTIONS_KEYS, setFallbackContext, createCoreContext, clearDateTimeFormat, clearNumberFormat, setAdditionalMeta, getFallbackContext, NOT_REOSLVED, parseTranslateArgs, translate, MISSING_RESOLVE_VALUE, parseDateTimeArgs, datetime, parseNumberArgs, number } from '@intlify/core-base';
import { parse, serialize } from 'cookie-es';
import isHTTPS from 'is-https';
import { defu } from 'defu';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ssrRenderSuspense, ssrRenderComponent } from 'vue/server-renderer';
import { a as useRuntimeConfig$1 } from '../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'ipx';

var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea, _Fa, _Ga, _Ha, _Ia, _Ja, _Ka, _La, _Ma, _Na, _Oa, _Pa, _Qa, _Ra, _Sa, _Ta, _Ua, _Va, _Wa, _Xa, _Ya, _Za, __a, _$a, _ab, _bb, _cb, _db, _eb, _fb, _gb, _hb, _ib, _jb, _kb, _lb, _mb, _nb, _ob, _pb, _qb, _rb, _sb, _tb, _ub, _vb, _wb, _xb, _yb, _zb, _Ab, _Bb, _Cb, _Db, _Eb, _Fb, _Gb, _Hb, _Ib, _Jb, _Kb, _Lb, _Mb, _Nb, _Ob, _Pb, _Qb, _Rb, _Sb, _Tb, _Ub, _Vb, _Wb, _Xb, _Yb, _Zb, __b, _$b, _ac, _bc, _cc, _dc, _ec, _fc, _gc, _hc, _ic, _jc, _kc, _lc, _mc, _nc, _oc, _pc, _qc, _rc, _sc, _tc, _uc, _vc;
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter$1(nuxtApp, $name, value);
    defineGetter$1(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter$1(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter$1(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a2;
      if (prop === "public") {
        return target.public;
      }
      return (_a2 = target[prop]) != null ? _a2 : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter$1(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useRouter = () => {
  var _a2;
  return (_a2 = useNuxtApp()) == null ? void 0 : _a2.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const addRouteMiddleware = (name, middleware, options = {}) => {
  const nuxtApp = useNuxtApp();
  if (options.global || typeof name === "function") {
    nuxtApp._middleware.global.push(typeof name === "function" ? name : middleware);
  } else {
    nuxtApp._middleware.named[name] = middleware;
  }
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, true);
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `nagivateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
function useHead(input, options) {
  return useNuxtApp()._useHead(input, options);
}
function useRequestHeaders(include) {
  var _a2, _b2;
  const headers = (_b2 = (_a2 = useNuxtApp().ssrContext) == null ? void 0 : _a2.event.node.req.headers) != null ? _b2 : {};
  if (!include) {
    return headers;
  }
  return Object.fromEntries(include.map((key) => key.toLowerCase()).filter((key) => headers[key]).map((key) => [key, headers[key]]));
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a2;
  return (_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.event;
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  return defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      const prefetched = ref(false);
      const el = void 0;
      return () => {
        var _a2, _b2, _c2;
        if (!isExternal.value) {
          return h(
            resolveComponent("RouterLink"),
            {
              ref: void 0,
              to: to.value,
              ...prefetched.value && !props.custom ? { class: props.prefetchedClass || options.prefetchedClass } : {},
              activeClass: props.activeClass || options.activeClass,
              exactActiveClass: props.exactActiveClass || options.exactActiveClass,
              replace: props.replace,
              ariaCurrentValue: props.ariaCurrentValue,
              custom: props.custom
            },
            slots.default
          );
        }
        const href = typeof to.value === "object" ? (_b2 = (_a2 = router.resolve(to.value)) == null ? void 0 : _a2.href) != null ? _b2 : null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate2 = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate: navigate2,
            route: router.resolve(href),
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_c2 = slots.default) == null ? void 0 : _c2.call(slots));
      };
    }
  });
}
const __nuxt_component_0$1 = defineNuxtLink({ componentName: "NuxtLink" });
function isObject$1(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject$1(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject$1(value) && isObject$1(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defuFn = createDefu((object, key, currentValue) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const inlineConfig = {};
const __appConfig = defuFn(inlineConfig);
const isVue2 = false;
const isVue3 = true;
/*!
  * pinia v2.0.33
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = Symbol();
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p2 = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app2) {
      setActivePinia(pinia);
      {
        pinia._a = app2;
        app2.provide(piniaSymbol, pinia);
        app2.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p2.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p2.push(plugin);
      }
      return this;
    },
    _p: _p2,
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  }
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = Symbol();
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign: assign$2 } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && (!("production" !== "production") )) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign$2(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign$2({ actions: {} }, options);
  const $subscribeOptions = {
    deep: true
  };
  let isListening;
  let isSyncListening;
  let subscriptions = markRaw([]);
  let actionSubscriptions = markRaw([]);
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (!("production" !== "production") )) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign$2($state, newState);
    });
  } : noop;
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const partialStore = {
    _p: pinia,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign$2({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign$2(store, setupStore);
    assign$2(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign$2($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign$2(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const currentInstance = getCurrentInstance();
    pinia = (pinia) || currentInstance && inject(piniaSymbol, null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function mapState(useStore, keysOrMapper) {
  return Array.isArray(keysOrMapper) ? keysOrMapper.reduce((reduced, key) => {
    reduced[key] = function() {
      return useStore(this.$pinia)[key];
    };
    return reduced;
  }, {}) : Object.keys(keysOrMapper).reduce((reduced, key) => {
    reduced[key] = function() {
      const store = useStore(this.$pinia);
      const storeKey = keysOrMapper[key];
      return typeof storeKey === "function" ? storeKey.call(this, store) : store[storeKey];
    };
    return reduced;
  }, {});
}
function storeToRefs(store) {
  {
    store = toRaw(store);
    const refs = {};
    for (const key in store) {
      const value = store[key];
      if (isRef(value) || isReactive(value)) {
        refs[key] = toRef(store, key);
      }
    }
    return refs;
  }
}
const node_modules__64pinia_nuxt_dist_runtime_plugin_vue3_mjs_A0OWXRrUgq = defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
  setActivePinia(pinia);
  {
    nuxtApp.payload.pinia = pinia.state.value;
  }
  return {
    provide: {
      pinia
    }
  };
});
const components = {
  Icon: defineAsyncComponent(() => import(
    /* webpackChunkName: "components/icon" */
    './_nuxt/Icon.46173402.mjs'
  ).then((c) => c.default || c))
};
const _nuxt_components_plugin_mjs_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function createHead(initHeadObject, options) {
  const unhead = createHead$1(options || {});
  const legacyHead = {
    unhead,
    install(app2) {
      if (version.startsWith("3")) {
        app2.config.globalProperties.$head = unhead;
        app2.provide("usehead", unhead);
      }
    },
    use(plugin) {
      unhead.use(plugin);
    },
    resolveTags() {
      return unhead.resolveTags();
    },
    headEntries() {
      return unhead.headEntries();
    },
    headTags() {
      return unhead.resolveTags();
    },
    push(input, options2) {
      return unhead.push(input, options2);
    },
    addEntry(input, options2) {
      return unhead.push(input, options2);
    },
    addHeadObjs(input, options2) {
      return unhead.push(input, options2);
    },
    addReactiveEntry(input, options2) {
      const api = useHead$1(input, options2);
      if (typeof api !== "undefined")
        return api.dispose;
      return () => {
      };
    },
    removeHeadObjs() {
    },
    updateDOM(document2, force) {
      if (force)
        renderDOMHead(unhead, { document: document2 });
      else
        debouncedRenderDOMHead(unhead, { delayFn: (fn) => setTimeout(() => fn(), 50), document: document2 });
    },
    internalHooks: unhead.hooks,
    hooks: {
      "before:dom": [],
      "resolved:tags": [],
      "resolved:entries": []
    }
  };
  unhead.addHeadObjs = legacyHead.addHeadObjs;
  unhead.updateDOM = legacyHead.updateDOM;
  unhead.hooks.hook("dom:beforeRender", (ctx) => {
    for (const hook of legacyHead.hooks["before:dom"]) {
      if (hook() === false)
        ctx.shouldRender = false;
    }
  });
  if (initHeadObject)
    legacyHead.addHeadObjs(initHeadObject);
  return legacyHead;
}
version.startsWith("2.");
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }, { "name": "description", "content": "My amazing site." }], "link": [], "style": [], "script": [{ "src": "https://www.paypal.com/sdk/js?client-id=test&currency=USD" }, { "src": "https://checkout.stripe.com/checkout.js" }], "noscript": [], "charset": "utf-8", "viewport": "width=device-width, initial-scale=1", "title": "Multikart Ecommerce | Vuejs shopping theme" };
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  nuxtApp._useHead = useHead$1;
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const { renderSSRHead } = await import('@unhead/ssr');
      const meta = await renderSSRHead(head.unhead);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        bodyScripts: meta.bodyTags
      };
    };
  }
});
const __nuxt_page_meta$J = {};
const __nuxt_page_meta$I = {};
const __nuxt_page_meta$H = {};
const __nuxt_page_meta$G = {};
const __nuxt_page_meta$F = {};
const __nuxt_page_meta$E = {};
const __nuxt_page_meta$D = {};
const __nuxt_page_meta$C = {};
const __nuxt_page_meta$B = {};
const __nuxt_page_meta$A = {};
const __nuxt_page_meta$z = {};
const __nuxt_page_meta$y = {};
const __nuxt_page_meta$x = {};
const __nuxt_page_meta$w = {};
const __nuxt_page_meta$v = {};
const __nuxt_page_meta$u = {};
const __nuxt_page_meta$t = {};
const __nuxt_page_meta$s = {};
const __nuxt_page_meta$r = {};
const __nuxt_page_meta$q = {};
const __nuxt_page_meta$p = {};
const __nuxt_page_meta$o = {};
const __nuxt_page_meta$n = {};
const __nuxt_page_meta$m = {};
const __nuxt_page_meta$l = {};
const __nuxt_page_meta$k = {
  layout: "custom"
};
const __nuxt_page_meta$j = {};
const __nuxt_page_meta$i = {};
const __nuxt_page_meta$h = {};
const __nuxt_page_meta$g = {};
const __nuxt_page_meta$f = {};
const __nuxt_page_meta$e = {};
const __nuxt_page_meta$d = {};
const __nuxt_page_meta$c = {};
const __nuxt_page_meta$b = {};
const __nuxt_page_meta$a = {};
const __nuxt_page_meta$9 = {};
const __nuxt_page_meta$8 = {};
const __nuxt_page_meta$7 = {};
const __nuxt_page_meta$6 = {};
const __nuxt_page_meta$5 = {};
const __nuxt_page_meta$4 = {};
const __nuxt_page_meta$3 = {};
const __nuxt_page_meta$2 = {};
const __nuxt_page_meta$1 = {};
const __nuxt_page_meta = {};
const _routes = [
  {
    name: (_a = __nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.name) != null ? _a : "blog-blog-detail___en",
    path: (_b = __nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.path) != null ? _b : "/blog/blog-detail",
    file: "/home/sp07/vue/templatian/pages/blog/blog-detail.vue",
    children: [],
    meta: __nuxt_page_meta$J,
    alias: (__nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.alias) || [],
    redirect: (__nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.redirect) || void 0,
    component: () => import('./_nuxt/blog-detail.7d539738.mjs').then((m) => m.default || m)
  },
  {
    name: (_c = __nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.name) != null ? _c : "blog-blog-detail___fr",
    path: (_d = __nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.path) != null ? _d : "/fr/blog/blog-detail",
    file: "/home/sp07/vue/templatian/pages/blog/blog-detail.vue",
    children: [],
    meta: __nuxt_page_meta$J,
    alias: (__nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.alias) || [],
    redirect: (__nuxt_page_meta$J == null ? void 0 : __nuxt_page_meta$J.redirect) || void 0,
    component: () => import('./_nuxt/blog-detail.7d539738.mjs').then((m) => m.default || m)
  },
  {
    name: (_e = __nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.name) != null ? _e : "blog-blog-nosidebar___en",
    path: (_f = __nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.path) != null ? _f : "/blog/blog-nosidebar",
    file: "/home/sp07/vue/templatian/pages/blog/blog-nosidebar.vue",
    children: [],
    meta: __nuxt_page_meta$I,
    alias: (__nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.alias) || [],
    redirect: (__nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.redirect) || void 0,
    component: () => import('./_nuxt/blog-nosidebar.f0eebcf0.mjs').then((m) => m.default || m)
  },
  {
    name: (_g = __nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.name) != null ? _g : "blog-blog-nosidebar___fr",
    path: (_h = __nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.path) != null ? _h : "/fr/blog/blog-nosidebar",
    file: "/home/sp07/vue/templatian/pages/blog/blog-nosidebar.vue",
    children: [],
    meta: __nuxt_page_meta$I,
    alias: (__nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.alias) || [],
    redirect: (__nuxt_page_meta$I == null ? void 0 : __nuxt_page_meta$I.redirect) || void 0,
    component: () => import('./_nuxt/blog-nosidebar.f0eebcf0.mjs').then((m) => m.default || m)
  },
  {
    name: (_i = __nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.name) != null ? _i : "collection-full-width___en",
    path: (_j = __nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.path) != null ? _j : "/collection/full-width",
    file: "/home/sp07/vue/templatian/pages/collection/full-width.vue",
    children: [],
    meta: __nuxt_page_meta$H,
    alias: (__nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.alias) || [],
    redirect: (__nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.redirect) || void 0,
    component: () => import('./_nuxt/full-width.79827470.mjs').then((m) => m.default || m)
  },
  {
    name: (_k = __nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.name) != null ? _k : "collection-full-width___fr",
    path: (_l = __nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.path) != null ? _l : "/fr/collection/full-width",
    file: "/home/sp07/vue/templatian/pages/collection/full-width.vue",
    children: [],
    meta: __nuxt_page_meta$H,
    alias: (__nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.alias) || [],
    redirect: (__nuxt_page_meta$H == null ? void 0 : __nuxt_page_meta$H.redirect) || void 0,
    component: () => import('./_nuxt/full-width.79827470.mjs').then((m) => m.default || m)
  },
  {
    name: (_m = __nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.name) != null ? _m : "collection-leftsidebar-id___en",
    path: (_n = __nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.path) != null ? _n : "/collection/leftsidebar/:id",
    file: "/home/sp07/vue/templatian/pages/collection/leftsidebar/[id].vue",
    children: [],
    meta: __nuxt_page_meta$G,
    alias: (__nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.alias) || [],
    redirect: (__nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.redirect) || void 0,
    component: () => import('./_nuxt/_id_.4851e458.mjs').then((m) => m.default || m)
  },
  {
    name: (_o = __nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.name) != null ? _o : "collection-leftsidebar-id___fr",
    path: (_p = __nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.path) != null ? _p : "/fr/collection/leftsidebar/:id",
    file: "/home/sp07/vue/templatian/pages/collection/leftsidebar/[id].vue",
    children: [],
    meta: __nuxt_page_meta$G,
    alias: (__nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.alias) || [],
    redirect: (__nuxt_page_meta$G == null ? void 0 : __nuxt_page_meta$G.redirect) || void 0,
    component: () => import('./_nuxt/_id_.4851e458.mjs').then((m) => m.default || m)
  },
  {
    name: (_q = __nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.name) != null ? _q : "collection-list-view___en",
    path: (_r = __nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.path) != null ? _r : "/collection/list-view",
    file: "/home/sp07/vue/templatian/pages/collection/list-view.vue",
    children: [],
    meta: __nuxt_page_meta$F,
    alias: (__nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.alias) || [],
    redirect: (__nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.redirect) || void 0,
    component: () => import('./_nuxt/list-view.ff52fef8.mjs').then((m) => m.default || m)
  },
  {
    name: (_s = __nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.name) != null ? _s : "collection-list-view___fr",
    path: (_t = __nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.path) != null ? _t : "/fr/collection/list-view",
    file: "/home/sp07/vue/templatian/pages/collection/list-view.vue",
    children: [],
    meta: __nuxt_page_meta$F,
    alias: (__nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.alias) || [],
    redirect: (__nuxt_page_meta$F == null ? void 0 : __nuxt_page_meta$F.redirect) || void 0,
    component: () => import('./_nuxt/list-view.ff52fef8.mjs').then((m) => m.default || m)
  },
  {
    name: (_u = __nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.name) != null ? _u : "collection-metro___en",
    path: (_v = __nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.path) != null ? _v : "/collection/metro",
    file: "/home/sp07/vue/templatian/pages/collection/metro.vue",
    children: [],
    meta: __nuxt_page_meta$E,
    alias: (__nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.alias) || [],
    redirect: (__nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.redirect) || void 0,
    component: () => import('./_nuxt/metro.49d175b7.mjs').then((m) => m.default || m)
  },
  {
    name: (_w = __nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.name) != null ? _w : "collection-metro___fr",
    path: (_x = __nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.path) != null ? _x : "/fr/collection/metro",
    file: "/home/sp07/vue/templatian/pages/collection/metro.vue",
    children: [],
    meta: __nuxt_page_meta$E,
    alias: (__nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.alias) || [],
    redirect: (__nuxt_page_meta$E == null ? void 0 : __nuxt_page_meta$E.redirect) || void 0,
    component: () => import('./_nuxt/metro.49d175b7.mjs').then((m) => m.default || m)
  },
  {
    name: (_y = __nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.name) != null ? _y : "collection-no-sidebar___en",
    path: (_z = __nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.path) != null ? _z : "/collection/no-sidebar",
    file: "/home/sp07/vue/templatian/pages/collection/no-sidebar.vue",
    children: [],
    meta: __nuxt_page_meta$D,
    alias: (__nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.alias) || [],
    redirect: (__nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.redirect) || void 0,
    component: () => import('./_nuxt/no-sidebar.ab26a4cc.mjs').then((m) => m.default || m)
  },
  {
    name: (_A = __nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.name) != null ? _A : "collection-no-sidebar___fr",
    path: (_B = __nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.path) != null ? _B : "/fr/collection/no-sidebar",
    file: "/home/sp07/vue/templatian/pages/collection/no-sidebar.vue",
    children: [],
    meta: __nuxt_page_meta$D,
    alias: (__nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.alias) || [],
    redirect: (__nuxt_page_meta$D == null ? void 0 : __nuxt_page_meta$D.redirect) || void 0,
    component: () => import('./_nuxt/no-sidebar.ab26a4cc.mjs').then((m) => m.default || m)
  },
  {
    name: (_C = __nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.name) != null ? _C : "collection-right-sidebar___en",
    path: (_D = __nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.path) != null ? _D : "/collection/right-sidebar",
    file: "/home/sp07/vue/templatian/pages/collection/right-sidebar.vue",
    children: [],
    meta: __nuxt_page_meta$C,
    alias: (__nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.alias) || [],
    redirect: (__nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.redirect) || void 0,
    component: () => import('./_nuxt/right-sidebar.3665c202.mjs').then((m) => m.default || m)
  },
  {
    name: (_E = __nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.name) != null ? _E : "collection-right-sidebar___fr",
    path: (_F = __nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.path) != null ? _F : "/fr/collection/right-sidebar",
    file: "/home/sp07/vue/templatian/pages/collection/right-sidebar.vue",
    children: [],
    meta: __nuxt_page_meta$C,
    alias: (__nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.alias) || [],
    redirect: (__nuxt_page_meta$C == null ? void 0 : __nuxt_page_meta$C.redirect) || void 0,
    component: () => import('./_nuxt/right-sidebar.3665c202.mjs').then((m) => m.default || m)
  },
  {
    name: (_G = __nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.name) != null ? _G : "collection-sidebar-popup___en",
    path: (_H = __nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.path) != null ? _H : "/collection/sidebar-popup",
    file: "/home/sp07/vue/templatian/pages/collection/sidebar-popup.vue",
    children: [],
    meta: __nuxt_page_meta$B,
    alias: (__nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.alias) || [],
    redirect: (__nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.redirect) || void 0,
    component: () => import('./_nuxt/sidebar-popup.636d1827.mjs').then((m) => m.default || m)
  },
  {
    name: (_I = __nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.name) != null ? _I : "collection-sidebar-popup___fr",
    path: (_J = __nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.path) != null ? _J : "/fr/collection/sidebar-popup",
    file: "/home/sp07/vue/templatian/pages/collection/sidebar-popup.vue",
    children: [],
    meta: __nuxt_page_meta$B,
    alias: (__nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.alias) || [],
    redirect: (__nuxt_page_meta$B == null ? void 0 : __nuxt_page_meta$B.redirect) || void 0,
    component: () => import('./_nuxt/sidebar-popup.636d1827.mjs').then((m) => m.default || m)
  },
  {
    name: (_K = __nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.name) != null ? _K : "collection-six-grid___en",
    path: (_L = __nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.path) != null ? _L : "/collection/six-grid",
    file: "/home/sp07/vue/templatian/pages/collection/six-grid.vue",
    children: [],
    meta: __nuxt_page_meta$A,
    alias: (__nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.alias) || [],
    redirect: (__nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.redirect) || void 0,
    component: () => import('./_nuxt/six-grid.d3d04644.mjs').then((m) => m.default || m)
  },
  {
    name: (_M = __nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.name) != null ? _M : "collection-six-grid___fr",
    path: (_N = __nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.path) != null ? _N : "/fr/collection/six-grid",
    file: "/home/sp07/vue/templatian/pages/collection/six-grid.vue",
    children: [],
    meta: __nuxt_page_meta$A,
    alias: (__nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.alias) || [],
    redirect: (__nuxt_page_meta$A == null ? void 0 : __nuxt_page_meta$A.redirect) || void 0,
    component: () => import('./_nuxt/six-grid.d3d04644.mjs').then((m) => m.default || m)
  },
  {
    name: (_O = __nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.name) != null ? _O : "collection-three-grid___en",
    path: (_P = __nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.path) != null ? _P : "/collection/three-grid",
    file: "/home/sp07/vue/templatian/pages/collection/three-grid.vue",
    children: [],
    meta: __nuxt_page_meta$z,
    alias: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.alias) || [],
    redirect: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.redirect) || void 0,
    component: () => import('./_nuxt/three-grid.0b9edbf0.mjs').then((m) => m.default || m)
  },
  {
    name: (_Q = __nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.name) != null ? _Q : "collection-three-grid___fr",
    path: (_R = __nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.path) != null ? _R : "/fr/collection/three-grid",
    file: "/home/sp07/vue/templatian/pages/collection/three-grid.vue",
    children: [],
    meta: __nuxt_page_meta$z,
    alias: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.alias) || [],
    redirect: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.redirect) || void 0,
    component: () => import('./_nuxt/three-grid.0b9edbf0.mjs').then((m) => m.default || m)
  },
  {
    name: (_S = __nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.name) != null ? _S : "index___en",
    path: (_T = __nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.path) != null ? _T : "/",
    file: "/home/sp07/vue/templatian/pages/index.vue",
    children: [],
    meta: __nuxt_page_meta$y,
    alias: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.alias) || [],
    redirect: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.redirect) || void 0,
    component: () => import('./_nuxt/index.b922ad64.mjs').then((m) => m.default || m)
  },
  {
    name: (_U = __nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.name) != null ? _U : "index___fr",
    path: (_V = __nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.path) != null ? _V : "/fr",
    file: "/home/sp07/vue/templatian/pages/index.vue",
    children: [],
    meta: __nuxt_page_meta$y,
    alias: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.alias) || [],
    redirect: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.redirect) || void 0,
    component: () => import('./_nuxt/index.b922ad64.mjs').then((m) => m.default || m)
  },
  {
    name: (_W = __nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.name) != null ? _W : "page-404___en",
    path: (_X = __nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.path) != null ? _X : "/page/404",
    file: "/home/sp07/vue/templatian/pages/page/404.vue",
    children: [],
    meta: __nuxt_page_meta$x,
    alias: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.alias) || [],
    redirect: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.redirect) || void 0,
    component: () => import('./_nuxt/404.68b6a7cf.mjs').then((m) => m.default || m)
  },
  {
    name: (_Y = __nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.name) != null ? _Y : "page-404___fr",
    path: (_Z = __nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.path) != null ? _Z : "/fr/page/404",
    file: "/home/sp07/vue/templatian/pages/page/404.vue",
    children: [],
    meta: __nuxt_page_meta$x,
    alias: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.alias) || [],
    redirect: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.redirect) || void 0,
    component: () => import('./_nuxt/404.68b6a7cf.mjs').then((m) => m.default || m)
  },
  {
    name: (__ = __nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.name) != null ? __ : "page-about___en",
    path: (_$ = __nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.path) != null ? _$ : "/page/about",
    file: "/home/sp07/vue/templatian/pages/page/about.vue",
    children: [],
    meta: __nuxt_page_meta$w,
    alias: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.alias) || [],
    redirect: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.redirect) || void 0,
    component: () => import('./_nuxt/about.1ad2c289.mjs').then((m) => m.default || m)
  },
  {
    name: (_aa = __nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.name) != null ? _aa : "page-about___fr",
    path: (_ba = __nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.path) != null ? _ba : "/fr/page/about",
    file: "/home/sp07/vue/templatian/pages/page/about.vue",
    children: [],
    meta: __nuxt_page_meta$w,
    alias: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.alias) || [],
    redirect: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.redirect) || void 0,
    component: () => import('./_nuxt/about.1ad2c289.mjs').then((m) => m.default || m)
  },
  {
    name: (_ca = __nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.name) != null ? _ca : "page-account-cart___en",
    path: (_da = __nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.path) != null ? _da : "/page/account/cart",
    file: "/home/sp07/vue/templatian/pages/page/account/cart.vue",
    children: [],
    meta: __nuxt_page_meta$v,
    alias: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.alias) || [],
    redirect: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.redirect) || void 0,
    component: () => import('./_nuxt/cart.692b24c2.mjs').then((m) => m.default || m)
  },
  {
    name: (_ea = __nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.name) != null ? _ea : "page-account-cart___fr",
    path: (_fa = __nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.path) != null ? _fa : "/fr/page/account/cart",
    file: "/home/sp07/vue/templatian/pages/page/account/cart.vue",
    children: [],
    meta: __nuxt_page_meta$v,
    alias: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.alias) || [],
    redirect: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.redirect) || void 0,
    component: () => import('./_nuxt/cart.692b24c2.mjs').then((m) => m.default || m)
  },
  {
    name: (_ga = __nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.name) != null ? _ga : "page-account-checkout___en",
    path: (_ha = __nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.path) != null ? _ha : "/page/account/checkout",
    file: "/home/sp07/vue/templatian/pages/page/account/checkout.vue",
    children: [],
    meta: __nuxt_page_meta$u,
    alias: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.alias) || [],
    redirect: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.redirect) || void 0,
    component: () => import('./_nuxt/checkout.96a15991.mjs').then((m) => m.default || m)
  },
  {
    name: (_ia = __nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.name) != null ? _ia : "page-account-checkout___fr",
    path: (_ja = __nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.path) != null ? _ja : "/fr/page/account/checkout",
    file: "/home/sp07/vue/templatian/pages/page/account/checkout.vue",
    children: [],
    meta: __nuxt_page_meta$u,
    alias: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.alias) || [],
    redirect: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.redirect) || void 0,
    component: () => import('./_nuxt/checkout.96a15991.mjs').then((m) => m.default || m)
  },
  {
    name: (_ka = __nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.name) != null ? _ka : "page-account-contact___en",
    path: (_la = __nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.path) != null ? _la : "/page/account/contact",
    file: "/home/sp07/vue/templatian/pages/page/account/contact.vue",
    children: [],
    meta: __nuxt_page_meta$t,
    alias: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.alias) || [],
    redirect: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.redirect) || void 0,
    component: () => import('./_nuxt/contact.3ccaa670.mjs').then((m) => m.default || m)
  },
  {
    name: (_ma = __nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.name) != null ? _ma : "page-account-contact___fr",
    path: (_na = __nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.path) != null ? _na : "/fr/page/account/contact",
    file: "/home/sp07/vue/templatian/pages/page/account/contact.vue",
    children: [],
    meta: __nuxt_page_meta$t,
    alias: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.alias) || [],
    redirect: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.redirect) || void 0,
    component: () => import('./_nuxt/contact.3ccaa670.mjs').then((m) => m.default || m)
  },
  {
    name: (_oa = __nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.name) != null ? _oa : "page-account-dashboard___en",
    path: (_pa = __nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.path) != null ? _pa : "/page/account/dashboard",
    file: "/home/sp07/vue/templatian/pages/page/account/dashboard.vue",
    children: [],
    meta: __nuxt_page_meta$s,
    alias: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.alias) || [],
    redirect: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.redirect) || void 0,
    component: () => import('./_nuxt/dashboard.089d4f3b.mjs').then((m) => m.default || m)
  },
  {
    name: (_qa = __nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.name) != null ? _qa : "page-account-dashboard___fr",
    path: (_ra = __nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.path) != null ? _ra : "/fr/page/account/dashboard",
    file: "/home/sp07/vue/templatian/pages/page/account/dashboard.vue",
    children: [],
    meta: __nuxt_page_meta$s,
    alias: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.alias) || [],
    redirect: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.redirect) || void 0,
    component: () => import('./_nuxt/dashboard.089d4f3b.mjs').then((m) => m.default || m)
  },
  {
    name: (_sa = __nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.name) != null ? _sa : "page-account-forget-password___en",
    path: (_ta = __nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.path) != null ? _ta : "/page/account/forget-password",
    file: "/home/sp07/vue/templatian/pages/page/account/forget-password.vue",
    children: [],
    meta: __nuxt_page_meta$r,
    alias: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.alias) || [],
    redirect: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.redirect) || void 0,
    component: () => import('./_nuxt/forget-password.5b92d68b.mjs').then((m) => m.default || m)
  },
  {
    name: (_ua = __nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.name) != null ? _ua : "page-account-forget-password___fr",
    path: (_va = __nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.path) != null ? _va : "/fr/page/account/forget-password",
    file: "/home/sp07/vue/templatian/pages/page/account/forget-password.vue",
    children: [],
    meta: __nuxt_page_meta$r,
    alias: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.alias) || [],
    redirect: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.redirect) || void 0,
    component: () => import('./_nuxt/forget-password.5b92d68b.mjs').then((m) => m.default || m)
  },
  {
    name: (_wa = __nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.name) != null ? _wa : "page-account-login___en",
    path: (_xa = __nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.path) != null ? _xa : "/page/account/login",
    file: "/home/sp07/vue/templatian/pages/page/account/login.vue",
    children: [],
    meta: __nuxt_page_meta$q,
    alias: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.alias) || [],
    redirect: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.redirect) || void 0,
    component: () => import('./_nuxt/login.d0f7b9ab.mjs').then((m) => m.default || m)
  },
  {
    name: (_ya = __nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.name) != null ? _ya : "page-account-login___fr",
    path: (_za = __nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.path) != null ? _za : "/fr/page/account/login",
    file: "/home/sp07/vue/templatian/pages/page/account/login.vue",
    children: [],
    meta: __nuxt_page_meta$q,
    alias: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.alias) || [],
    redirect: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.redirect) || void 0,
    component: () => import('./_nuxt/login.d0f7b9ab.mjs').then((m) => m.default || m)
  },
  {
    name: (_Aa = __nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.name) != null ? _Aa : "page-account-profile___en",
    path: (_Ba = __nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.path) != null ? _Ba : "/page/account/profile",
    file: "/home/sp07/vue/templatian/pages/page/account/profile.vue",
    children: [],
    meta: __nuxt_page_meta$p,
    alias: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.alias) || [],
    redirect: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.redirect) || void 0,
    component: () => import('./_nuxt/profile.52bef816.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ca = __nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.name) != null ? _Ca : "page-account-profile___fr",
    path: (_Da = __nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.path) != null ? _Da : "/fr/page/account/profile",
    file: "/home/sp07/vue/templatian/pages/page/account/profile.vue",
    children: [],
    meta: __nuxt_page_meta$p,
    alias: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.alias) || [],
    redirect: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.redirect) || void 0,
    component: () => import('./_nuxt/profile.52bef816.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ea = __nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.name) != null ? _Ea : "page-account-register___en",
    path: (_Fa = __nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.path) != null ? _Fa : "/page/account/register",
    file: "/home/sp07/vue/templatian/pages/page/account/register.vue",
    children: [],
    meta: __nuxt_page_meta$o,
    alias: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.alias) || [],
    redirect: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.redirect) || void 0,
    component: () => import('./_nuxt/register.07bc5181.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ga = __nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.name) != null ? _Ga : "page-account-register___fr",
    path: (_Ha = __nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.path) != null ? _Ha : "/fr/page/account/register",
    file: "/home/sp07/vue/templatian/pages/page/account/register.vue",
    children: [],
    meta: __nuxt_page_meta$o,
    alias: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.alias) || [],
    redirect: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.redirect) || void 0,
    component: () => import('./_nuxt/register.07bc5181.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ia = __nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.name) != null ? _Ia : "page-account-wishlist___en",
    path: (_Ja = __nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.path) != null ? _Ja : "/page/account/wishlist",
    file: "/home/sp07/vue/templatian/pages/page/account/wishlist.vue",
    children: [],
    meta: __nuxt_page_meta$n,
    alias: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.alias) || [],
    redirect: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.redirect) || void 0,
    component: () => import('./_nuxt/wishlist.789e2f7f.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ka = __nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.name) != null ? _Ka : "page-account-wishlist___fr",
    path: (_La = __nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.path) != null ? _La : "/fr/page/account/wishlist",
    file: "/home/sp07/vue/templatian/pages/page/account/wishlist.vue",
    children: [],
    meta: __nuxt_page_meta$n,
    alias: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.alias) || [],
    redirect: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.redirect) || void 0,
    component: () => import('./_nuxt/wishlist.789e2f7f.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ma = __nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.name) != null ? _Ma : "page-auth-auth___en",
    path: (_Na = __nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.path) != null ? _Na : "/page/auth/auth",
    file: "/home/sp07/vue/templatian/pages/page/auth/auth.js",
    children: [],
    meta: __nuxt_page_meta$m,
    alias: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.alias) || [],
    redirect: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.redirect) || void 0,
    component: () => import('./_nuxt/auth.13771b2b.mjs').then((m) => m.default || m)
  },
  {
    name: (_Oa = __nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.name) != null ? _Oa : "page-auth-auth___fr",
    path: (_Pa = __nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.path) != null ? _Pa : "/fr/page/auth/auth",
    file: "/home/sp07/vue/templatian/pages/page/auth/auth.js",
    children: [],
    meta: __nuxt_page_meta$m,
    alias: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.alias) || [],
    redirect: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.redirect) || void 0,
    component: () => import('./_nuxt/auth.13771b2b.mjs').then((m) => m.default || m)
  },
  {
    name: (_Qa = __nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.name) != null ? _Qa : "page-collection___en",
    path: (_Ra = __nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.path) != null ? _Ra : "/page/collection",
    file: "/home/sp07/vue/templatian/pages/page/collection.vue",
    children: [],
    meta: __nuxt_page_meta$l,
    alias: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.alias) || [],
    redirect: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.redirect) || void 0,
    component: () => import('./_nuxt/collection.0b12363d.mjs').then((m) => m.default || m)
  },
  {
    name: (_Sa = __nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.name) != null ? _Sa : "page-collection___fr",
    path: (_Ta = __nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.path) != null ? _Ta : "/fr/page/collection",
    file: "/home/sp07/vue/templatian/pages/page/collection.vue",
    children: [],
    meta: __nuxt_page_meta$l,
    alias: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.alias) || [],
    redirect: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.redirect) || void 0,
    component: () => import('./_nuxt/collection.0b12363d.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ua = __nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.name) != null ? _Ua : "page-coming-soon___en",
    path: (_Va = __nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.path) != null ? _Va : "/page/coming-soon",
    file: "/home/sp07/vue/templatian/pages/page/coming-soon.vue",
    children: [],
    meta: __nuxt_page_meta$k,
    alias: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.alias) || [],
    redirect: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.redirect) || void 0,
    component: () => import('./_nuxt/coming-soon.8d3304c8.mjs').then((m) => m.default || m)
  },
  {
    name: (_Wa = __nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.name) != null ? _Wa : "page-coming-soon___fr",
    path: (_Xa = __nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.path) != null ? _Xa : "/fr/page/coming-soon",
    file: "/home/sp07/vue/templatian/pages/page/coming-soon.vue",
    children: [],
    meta: __nuxt_page_meta$k,
    alias: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.alias) || [],
    redirect: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.redirect) || void 0,
    component: () => import('./_nuxt/coming-soon.8d3304c8.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ya = __nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.name) != null ? _Ya : "page-compare-compare-1___en",
    path: (_Za = __nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.path) != null ? _Za : "/page/compare/compare-1",
    file: "/home/sp07/vue/templatian/pages/page/compare/compare-1.vue",
    children: [],
    meta: __nuxt_page_meta$j,
    alias: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.alias) || [],
    redirect: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.redirect) || void 0,
    component: () => import('./_nuxt/compare-1.9b159d3c.mjs').then((m) => m.default || m)
  },
  {
    name: (__a = __nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.name) != null ? __a : "page-compare-compare-1___fr",
    path: (_$a = __nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.path) != null ? _$a : "/fr/page/compare/compare-1",
    file: "/home/sp07/vue/templatian/pages/page/compare/compare-1.vue",
    children: [],
    meta: __nuxt_page_meta$j,
    alias: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.alias) || [],
    redirect: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.redirect) || void 0,
    component: () => import('./_nuxt/compare-1.9b159d3c.mjs').then((m) => m.default || m)
  },
  {
    name: (_ab = __nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.name) != null ? _ab : "page-element-banner___en",
    path: (_bb = __nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.path) != null ? _bb : "/page/element/banner",
    file: "/home/sp07/vue/templatian/pages/page/element/banner.vue",
    children: [],
    meta: __nuxt_page_meta$i,
    alias: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.alias) || [],
    redirect: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.redirect) || void 0,
    component: () => import('./_nuxt/banner.87f2d284.mjs').then((m) => m.default || m)
  },
  {
    name: (_cb = __nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.name) != null ? _cb : "page-element-banner___fr",
    path: (_db = __nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.path) != null ? _db : "/fr/page/element/banner",
    file: "/home/sp07/vue/templatian/pages/page/element/banner.vue",
    children: [],
    meta: __nuxt_page_meta$i,
    alias: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.alias) || [],
    redirect: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.redirect) || void 0,
    component: () => import('./_nuxt/banner.87f2d284.mjs').then((m) => m.default || m)
  },
  {
    name: (_eb = __nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.name) != null ? _eb : "page-element-category___en",
    path: (_fb = __nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.path) != null ? _fb : "/page/element/category",
    file: "/home/sp07/vue/templatian/pages/page/element/category.vue",
    children: [],
    meta: __nuxt_page_meta$h,
    alias: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.alias) || [],
    redirect: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.redirect) || void 0,
    component: () => import('./_nuxt/category.675be71e.mjs').then((m) => m.default || m)
  },
  {
    name: (_gb = __nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.name) != null ? _gb : "page-element-category___fr",
    path: (_hb = __nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.path) != null ? _hb : "/fr/page/element/category",
    file: "/home/sp07/vue/templatian/pages/page/element/category.vue",
    children: [],
    meta: __nuxt_page_meta$h,
    alias: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.alias) || [],
    redirect: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.redirect) || void 0,
    component: () => import('./_nuxt/category.675be71e.mjs').then((m) => m.default || m)
  },
  {
    name: (_ib = __nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.name) != null ? _ib : "page-element-collection-banner___en",
    path: (_jb = __nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.path) != null ? _jb : "/page/element/collection-banner",
    file: "/home/sp07/vue/templatian/pages/page/element/collection-banner.vue",
    children: [],
    meta: __nuxt_page_meta$g,
    alias: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.alias) || [],
    redirect: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.redirect) || void 0,
    component: () => import('./_nuxt/collection-banner.c6597163.mjs').then((m) => m.default || m)
  },
  {
    name: (_kb = __nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.name) != null ? _kb : "page-element-collection-banner___fr",
    path: (_lb = __nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.path) != null ? _lb : "/fr/page/element/collection-banner",
    file: "/home/sp07/vue/templatian/pages/page/element/collection-banner.vue",
    children: [],
    meta: __nuxt_page_meta$g,
    alias: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.alias) || [],
    redirect: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.redirect) || void 0,
    component: () => import('./_nuxt/collection-banner.c6597163.mjs').then((m) => m.default || m)
  },
  {
    name: (_mb = __nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.name) != null ? _mb : "page-element-home-slider___en",
    path: (_nb = __nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.path) != null ? _nb : "/page/element/home-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/home-slider.vue",
    children: [],
    meta: __nuxt_page_meta$f,
    alias: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.alias) || [],
    redirect: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.redirect) || void 0,
    component: () => import('./_nuxt/home-slider.41cdbae5.mjs').then((m) => m.default || m)
  },
  {
    name: (_ob = __nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.name) != null ? _ob : "page-element-home-slider___fr",
    path: (_pb = __nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.path) != null ? _pb : "/fr/page/element/home-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/home-slider.vue",
    children: [],
    meta: __nuxt_page_meta$f,
    alias: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.alias) || [],
    redirect: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.redirect) || void 0,
    component: () => import('./_nuxt/home-slider.41cdbae5.mjs').then((m) => m.default || m)
  },
  {
    name: (_qb = __nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.name) != null ? _qb : "page-element-logo-slider___en",
    path: (_rb = __nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.path) != null ? _rb : "/page/element/logo-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/logo-slider.vue",
    children: [],
    meta: __nuxt_page_meta$e,
    alias: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.alias) || [],
    redirect: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.redirect) || void 0,
    component: () => import('./_nuxt/logo-slider.7c7c2ccc.mjs').then((m) => m.default || m)
  },
  {
    name: (_sb = __nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.name) != null ? _sb : "page-element-logo-slider___fr",
    path: (_tb = __nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.path) != null ? _tb : "/fr/page/element/logo-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/logo-slider.vue",
    children: [],
    meta: __nuxt_page_meta$e,
    alias: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.alias) || [],
    redirect: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.redirect) || void 0,
    component: () => import('./_nuxt/logo-slider.7c7c2ccc.mjs').then((m) => m.default || m)
  },
  {
    name: (_ub = __nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.name) != null ? _ub : "page-element-multi-slider___en",
    path: (_vb = __nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.path) != null ? _vb : "/page/element/multi-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/multi-slider.vue",
    children: [],
    meta: __nuxt_page_meta$d,
    alias: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.alias) || [],
    redirect: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.redirect) || void 0,
    component: () => import('./_nuxt/multi-slider.97e246a9.mjs').then((m) => m.default || m)
  },
  {
    name: (_wb = __nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.name) != null ? _wb : "page-element-multi-slider___fr",
    path: (_xb = __nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.path) != null ? _xb : "/fr/page/element/multi-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/multi-slider.vue",
    children: [],
    meta: __nuxt_page_meta$d,
    alias: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.alias) || [],
    redirect: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.redirect) || void 0,
    component: () => import('./_nuxt/multi-slider.97e246a9.mjs').then((m) => m.default || m)
  },
  {
    name: (_yb = __nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.name) != null ? _yb : "page-element-product-slider___en",
    path: (_zb = __nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.path) != null ? _zb : "/page/element/product-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/product-slider.vue",
    children: [],
    meta: __nuxt_page_meta$c,
    alias: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.alias) || [],
    redirect: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.redirect) || void 0,
    component: () => import('./_nuxt/product-slider.845cb548.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ab = __nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.name) != null ? _Ab : "page-element-product-slider___fr",
    path: (_Bb = __nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.path) != null ? _Bb : "/fr/page/element/product-slider",
    file: "/home/sp07/vue/templatian/pages/page/element/product-slider.vue",
    children: [],
    meta: __nuxt_page_meta$c,
    alias: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.alias) || [],
    redirect: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.redirect) || void 0,
    component: () => import('./_nuxt/product-slider.845cb548.mjs').then((m) => m.default || m)
  },
  {
    name: (_Cb = __nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.name) != null ? _Cb : "page-element-product-tabs___en",
    path: (_Db = __nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.path) != null ? _Db : "/page/element/product-tabs",
    file: "/home/sp07/vue/templatian/pages/page/element/product-tabs.vue",
    children: [],
    meta: __nuxt_page_meta$b,
    alias: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.alias) || [],
    redirect: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.redirect) || void 0,
    component: () => import('./_nuxt/product-tabs.63b56a21.mjs').then((m) => m.default || m)
  },
  {
    name: (_Eb = __nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.name) != null ? _Eb : "page-element-product-tabs___fr",
    path: (_Fb = __nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.path) != null ? _Fb : "/fr/page/element/product-tabs",
    file: "/home/sp07/vue/templatian/pages/page/element/product-tabs.vue",
    children: [],
    meta: __nuxt_page_meta$b,
    alias: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.alias) || [],
    redirect: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.redirect) || void 0,
    component: () => import('./_nuxt/product-tabs.63b56a21.mjs').then((m) => m.default || m)
  },
  {
    name: (_Gb = __nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.name) != null ? _Gb : "page-element-service___en",
    path: (_Hb = __nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.path) != null ? _Hb : "/page/element/service",
    file: "/home/sp07/vue/templatian/pages/page/element/service.vue",
    children: [],
    meta: __nuxt_page_meta$a,
    alias: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.alias) || [],
    redirect: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.redirect) || void 0,
    component: () => import('./_nuxt/service.0a30135e.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ib = __nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.name) != null ? _Ib : "page-element-service___fr",
    path: (_Jb = __nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.path) != null ? _Jb : "/fr/page/element/service",
    file: "/home/sp07/vue/templatian/pages/page/element/service.vue",
    children: [],
    meta: __nuxt_page_meta$a,
    alias: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.alias) || [],
    redirect: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.redirect) || void 0,
    component: () => import('./_nuxt/service.0a30135e.mjs').then((m) => m.default || m)
  },
  {
    name: (_Kb = __nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.name) != null ? _Kb : "page-faq___en",
    path: (_Lb = __nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.path) != null ? _Lb : "/page/faq",
    file: "/home/sp07/vue/templatian/pages/page/faq.vue",
    children: [],
    meta: __nuxt_page_meta$9,
    alias: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.alias) || [],
    redirect: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.redirect) || void 0,
    component: () => import('./_nuxt/faq.83c9b3fd.mjs').then((m) => m.default || m)
  },
  {
    name: (_Mb = __nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.name) != null ? _Mb : "page-faq___fr",
    path: (_Nb = __nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.path) != null ? _Nb : "/fr/page/faq",
    file: "/home/sp07/vue/templatian/pages/page/faq.vue",
    children: [],
    meta: __nuxt_page_meta$9,
    alias: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.alias) || [],
    redirect: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.redirect) || void 0,
    component: () => import('./_nuxt/faq.83c9b3fd.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ob = __nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.name) != null ? _Ob : "page-lookbook___en",
    path: (_Pb = __nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.path) != null ? _Pb : "/page/lookbook",
    file: "/home/sp07/vue/templatian/pages/page/lookbook.vue",
    children: [],
    meta: __nuxt_page_meta$8,
    alias: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.alias) || [],
    redirect: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.redirect) || void 0,
    component: () => import('./_nuxt/lookbook.f3100d19.mjs').then((m) => m.default || m)
  },
  {
    name: (_Qb = __nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.name) != null ? _Qb : "page-lookbook___fr",
    path: (_Rb = __nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.path) != null ? _Rb : "/fr/page/lookbook",
    file: "/home/sp07/vue/templatian/pages/page/lookbook.vue",
    children: [],
    meta: __nuxt_page_meta$8,
    alias: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.alias) || [],
    redirect: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.redirect) || void 0,
    component: () => import('./_nuxt/lookbook.f3100d19.mjs').then((m) => m.default || m)
  },
  {
    name: (_Sb = __nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.name) != null ? _Sb : "page-order-success___en",
    path: (_Tb = __nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.path) != null ? _Tb : "/page/order-success",
    file: "/home/sp07/vue/templatian/pages/page/order-success.vue",
    children: [],
    meta: __nuxt_page_meta$7,
    alias: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.alias) || [],
    redirect: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.redirect) || void 0,
    component: () => import('./_nuxt/order-success.86ccfafa.mjs').then((m) => m.default || m)
  },
  {
    name: (_Ub = __nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.name) != null ? _Ub : "page-order-success___fr",
    path: (_Vb = __nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.path) != null ? _Vb : "/fr/page/order-success",
    file: "/home/sp07/vue/templatian/pages/page/order-success.vue",
    children: [],
    meta: __nuxt_page_meta$7,
    alias: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.alias) || [],
    redirect: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.redirect) || void 0,
    component: () => import('./_nuxt/order-success.86ccfafa.mjs').then((m) => m.default || m)
  },
  {
    name: (_Wb = __nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.name) != null ? _Wb : "page-portfolio-masonary-fullwidth___en",
    path: (_Xb = __nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.path) != null ? _Xb : "/page/portfolio/masonary-fullwidth",
    file: "/home/sp07/vue/templatian/pages/page/portfolio/masonary-fullwidth.vue",
    children: [],
    meta: __nuxt_page_meta$6,
    alias: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.alias) || [],
    redirect: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.redirect) || void 0,
    component: () => import('./_nuxt/masonary-fullwidth.51562a6f.mjs').then((m) => m.default || m)
  },
  {
    name: (_Yb = __nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.name) != null ? _Yb : "page-portfolio-masonary-fullwidth___fr",
    path: (_Zb = __nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.path) != null ? _Zb : "/fr/page/portfolio/masonary-fullwidth",
    file: "/home/sp07/vue/templatian/pages/page/portfolio/masonary-fullwidth.vue",
    children: [],
    meta: __nuxt_page_meta$6,
    alias: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.alias) || [],
    redirect: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.redirect) || void 0,
    component: () => import('./_nuxt/masonary-fullwidth.51562a6f.mjs').then((m) => m.default || m)
  },
  {
    name: (__b = __nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.name) != null ? __b : "page-review___en",
    path: (_$b = __nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.path) != null ? _$b : "/page/review",
    file: "/home/sp07/vue/templatian/pages/page/review.vue",
    children: [],
    meta: __nuxt_page_meta$5,
    alias: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.alias) || [],
    redirect: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.redirect) || void 0,
    component: () => import('./_nuxt/review.8dbe1a73.mjs').then((m) => m.default || m)
  },
  {
    name: (_ac = __nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.name) != null ? _ac : "page-review___fr",
    path: (_bc = __nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.path) != null ? _bc : "/fr/page/review",
    file: "/home/sp07/vue/templatian/pages/page/review.vue",
    children: [],
    meta: __nuxt_page_meta$5,
    alias: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.alias) || [],
    redirect: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.redirect) || void 0,
    component: () => import('./_nuxt/review.8dbe1a73.mjs').then((m) => m.default || m)
  },
  {
    name: (_cc = __nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.name) != null ? _cc : "page-search___en",
    path: (_dc = __nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.path) != null ? _dc : "/page/search",
    file: "/home/sp07/vue/templatian/pages/page/search.vue",
    children: [],
    meta: __nuxt_page_meta$4,
    alias: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.alias) || [],
    redirect: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect) || void 0,
    component: () => import('./_nuxt/search.4165e98d.mjs').then((m) => m.default || m)
  },
  {
    name: (_ec = __nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.name) != null ? _ec : "page-search___fr",
    path: (_fc = __nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.path) != null ? _fc : "/fr/page/search",
    file: "/home/sp07/vue/templatian/pages/page/search.vue",
    children: [],
    meta: __nuxt_page_meta$4,
    alias: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.alias) || [],
    redirect: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect) || void 0,
    component: () => import('./_nuxt/search.4165e98d.mjs').then((m) => m.default || m)
  },
  {
    name: (_gc = __nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.name) != null ? _gc : "page-sitemap___en",
    path: (_hc = __nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.path) != null ? _hc : "/page/sitemap",
    file: "/home/sp07/vue/templatian/pages/page/sitemap.vue",
    children: [],
    meta: __nuxt_page_meta$3,
    alias: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.alias) || [],
    redirect: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect) || void 0,
    component: () => import('./_nuxt/sitemap.c9aad6ed.mjs').then((m) => m.default || m)
  },
  {
    name: (_ic = __nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.name) != null ? _ic : "page-sitemap___fr",
    path: (_jc = __nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.path) != null ? _jc : "/fr/page/sitemap",
    file: "/home/sp07/vue/templatian/pages/page/sitemap.vue",
    children: [],
    meta: __nuxt_page_meta$3,
    alias: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.alias) || [],
    redirect: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect) || void 0,
    component: () => import('./_nuxt/sitemap.c9aad6ed.mjs').then((m) => m.default || m)
  },
  {
    name: (_kc = __nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.name) != null ? _kc : "page-typography___en",
    path: (_lc = __nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.path) != null ? _lc : "/page/typography",
    file: "/home/sp07/vue/templatian/pages/page/typography.vue",
    children: [],
    meta: __nuxt_page_meta$2,
    alias: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.alias) || [],
    redirect: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect) || void 0,
    component: () => import('./_nuxt/typography.a9590f50.mjs').then((m) => m.default || m)
  },
  {
    name: (_mc = __nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.name) != null ? _mc : "page-typography___fr",
    path: (_nc = __nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.path) != null ? _nc : "/fr/page/typography",
    file: "/home/sp07/vue/templatian/pages/page/typography.vue",
    children: [],
    meta: __nuxt_page_meta$2,
    alias: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.alias) || [],
    redirect: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect) || void 0,
    component: () => import('./_nuxt/typography.a9590f50.mjs').then((m) => m.default || m)
  },
  {
    name: (_oc = __nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.name) != null ? _oc : "product-bundle-product___en",
    path: (_pc = __nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.path) != null ? _pc : "/product/bundle-product",
    file: "/home/sp07/vue/templatian/pages/product/bundle-product.vue",
    children: [],
    meta: __nuxt_page_meta$1,
    alias: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.alias) || [],
    redirect: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect) || void 0,
    component: () => import('./_nuxt/bundle-product.c1d5d98f.mjs').then((m) => m.default || m)
  },
  {
    name: (_qc = __nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.name) != null ? _qc : "product-bundle-product___fr",
    path: (_rc = __nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.path) != null ? _rc : "/fr/product/bundle-product",
    file: "/home/sp07/vue/templatian/pages/product/bundle-product.vue",
    children: [],
    meta: __nuxt_page_meta$1,
    alias: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.alias) || [],
    redirect: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect) || void 0,
    component: () => import('./_nuxt/bundle-product.c1d5d98f.mjs').then((m) => m.default || m)
  },
  {
    name: (_sc = __nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) != null ? _sc : "shop-beauty___en",
    path: (_tc = __nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) != null ? _tc : "/shop/beauty",
    file: "/home/sp07/vue/templatian/pages/shop/beauty/index.vue",
    children: [],
    meta: __nuxt_page_meta,
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import('./_nuxt/index.210338e8.mjs').then((m) => m.default || m)
  },
  {
    name: (_uc = __nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) != null ? _uc : "shop-beauty___fr",
    path: (_vc = __nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) != null ? _vc : "/fr/shop/beauty",
    file: "/home/sp07/vue/templatian/pages/shop/beauty/index.vue",
    children: [],
    meta: __nuxt_page_meta,
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import('./_nuxt/index.210338e8.mjs').then((m) => m.default || m)
  }
];
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => {
      var _a2;
      return !!((_a2 = route.meta.pageTransition) != null ? _a2 : appPageTransition);
    };
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve2) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve2(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(a, b) {
  const samePageComponent = a.matched[0] === b.matched[0];
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(a.params) !== JSON.stringify(b.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = defineNuxtRouteMiddleware(async (to) => {
  var _a2;
  let __temp, __restore;
  if (!((_a2 = to.meta) == null ? void 0 : _a2.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (typeof result === "boolean") {
    return result;
  }
  return createError(result);
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {
  auth: () => import('./_nuxt/auth.52cf7e4b.mjs')
};
const node_modules_nuxt_dist_pages_runtime_router_mjs_qNv5Ky2ZmB = defineNuxtPlugin(async (nuxtApp) => {
  var _a2, _b2, _c2, _d2;
  let __temp, __restore;
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = (_b2 = (_a2 = routerOptions.history) == null ? void 0 : _a2.call(routerOptions, routerBase)) != null ? _b2 : createMemoryHistory(routerBase);
  const routes = (_d2 = (_c2 = routerOptions.routes) == null ? void 0 : _c2.call(routerOptions, _routes)) != null ? _d2 : _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a3, _b3, _c3, _d3;
    if (((_b3 = (_a3 = to.matched[0]) == null ? void 0 : _a3.components) == null ? void 0 : _b3.default) === ((_d3 = (_c3 = from.matched[0]) == null ? void 0 : _c3.components) == null ? void 0 : _d3.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    callWithNuxt(nuxtApp, showError, [error2]);
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a3, _b3;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating) {
      to.meta.layout = (_a3 = initialLayout.value) != null ? _a3 : to.meta.layout;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b3 = namedMiddleware[entry2]) == null ? void 0 : _b3.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusCode: 404,
            statusMessage: `Page Not Found: ${initialURL}`
          });
          await callWithNuxt(nuxtApp, showError, [error2]);
          return false;
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        force: true
      });
    } catch (error2) {
      callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
const node_modules__64nuxtjs_i18n_dist_runtime_plugins_composition_mjs_sLxaNGmlSL = defineNuxtPlugin(() => {
});
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var shared$1 = { exports: {} };
var shared_prod = {};
/*!
  * shared v9.3.0-beta.16
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
var hasRequiredShared_prod;
function requireShared_prod() {
  if (hasRequiredShared_prod)
    return shared_prod;
  hasRequiredShared_prod = 1;
  Object.defineProperty(shared_prod, "__esModule", { value: true });
  const inBrowser = false;
  let mark;
  let measure;
  const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g;
  function format(message, ...args) {
    if (args.length === 1 && isObject2(args[0])) {
      args = args[0];
    }
    if (!args || !args.hasOwnProperty) {
      args = {};
    }
    return message.replace(RE_ARGS, (match, identifier) => {
      return args.hasOwnProperty(identifier) ? args[identifier] : "";
    });
  }
  const makeSymbol2 = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
  const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
  const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
  const isNumber = (val) => typeof val === "number" && isFinite(val);
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
  const isEmptyObject = (val) => isPlainObject2(val) && Object.keys(val).length === 0;
  function warn2(msg, err) {
    if (typeof console !== "undefined") {
      console.warn(`[intlify] ` + msg);
      if (err) {
        console.warn(err.stack);
      }
    }
  }
  const assign2 = Object.assign;
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
  };
  function escapeHtml(rawText) {
    return rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }
  const isArray2 = Array.isArray;
  const isFunction2 = (val) => typeof val === "function";
  const isString2 = (val) => typeof val === "string";
  const isBoolean = (val) => typeof val === "boolean";
  const isSymbol2 = (val) => typeof val === "symbol";
  const isObject2 = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return isObject2(val) && isFunction2(val.then) && isFunction2(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const isPlainObject2 = (val) => toTypeString(val) === "[object Object]";
  const toDisplayString = (val) => {
    return val == null ? "" : isArray2(val) || isPlainObject2(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
  };
  const RANGE = 2;
  function generateCodeFrame(source, start = 0, end = source.length) {
    const lines = source.split(/\r?\n/);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count >= start) {
        for (let j = i - RANGE; j <= i + RANGE || end > count; j++) {
          if (j < 0 || j >= lines.length)
            continue;
          const line = j + 1;
          res.push(`${line}${" ".repeat(3 - String(line).length)}|  ${lines[j]}`);
          const lineLength = lines[j].length;
          if (j === i) {
            const pad = start - (count - lineLength) + 1;
            const length = Math.max(1, end > count ? lineLength - pad : end - start);
            res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
          } else if (j > i) {
            if (end > count) {
              const length = Math.max(Math.min(end - count, lineLength), 1);
              res.push(`   |  ` + "^".repeat(length));
            }
            count += lineLength + 1;
          }
        }
        break;
      }
    }
    return res.join("\n");
  }
  function createEmitter() {
    const events = /* @__PURE__ */ new Map();
    const emitter = {
      events,
      on(event, handler) {
        const handlers = events.get(event);
        const added = handlers && handlers.push(handler);
        if (!added) {
          events.set(event, [handler]);
        }
      },
      off(event, handler) {
        const handlers = events.get(event);
        if (handlers) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        }
      },
      emit(event, payload) {
        (events.get(event) || []).slice().map((handler) => handler(payload));
        (events.get("*") || []).slice().map((handler) => handler(event, payload));
      }
    };
    return emitter;
  }
  shared_prod.assign = assign2;
  shared_prod.createEmitter = createEmitter;
  shared_prod.escapeHtml = escapeHtml;
  shared_prod.format = format;
  shared_prod.friendlyJSONstringify = friendlyJSONstringify;
  shared_prod.generateCodeFrame = generateCodeFrame;
  shared_prod.generateFormatCacheKey = generateFormatCacheKey;
  shared_prod.getGlobalThis = getGlobalThis;
  shared_prod.hasOwn = hasOwn;
  shared_prod.inBrowser = inBrowser;
  shared_prod.isArray = isArray2;
  shared_prod.isBoolean = isBoolean;
  shared_prod.isDate = isDate;
  shared_prod.isEmptyObject = isEmptyObject;
  shared_prod.isFunction = isFunction2;
  shared_prod.isNumber = isNumber;
  shared_prod.isObject = isObject2;
  shared_prod.isPlainObject = isPlainObject2;
  shared_prod.isPromise = isPromise;
  shared_prod.isRegExp = isRegExp;
  shared_prod.isString = isString2;
  shared_prod.isSymbol = isSymbol2;
  shared_prod.makeSymbol = makeSymbol2;
  shared_prod.mark = mark;
  shared_prod.measure = measure;
  shared_prod.objectToString = objectToString;
  shared_prod.toDisplayString = toDisplayString;
  shared_prod.toTypeString = toTypeString;
  shared_prod.warn = warn2;
  return shared_prod;
}
(function(module) {
  {
    module.exports = requireShared_prod();
  }
})(shared$1);
/*!
  * vue-i18n v9.3.0-beta.16
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
const VERSION = "9.3.0-beta.16";
function initFeatureFlags() {
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    shared$1.exports.getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
CoreWarnCodes.__EXTEND_POINT__;
let code = CompileErrorCodes.__EXTEND_POINT__;
const inc = () => ++code;
const I18nErrorCodes = {
  UNEXPECTED_RETURN_TYPE: code,
  INVALID_ARGUMENT: inc(),
  MUST_BE_CALL_SETUP_TOP: inc(),
  NOT_INSLALLED: inc(),
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(),
  REQUIRED_VALUE: inc(),
  INVALID_VALUE: inc(),
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(),
  NOT_INSLALLED_WITH_PROVIDE: inc(),
  UNEXPECTED_ERROR: inc(),
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(),
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(),
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(),
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(),
  __EXTEND_POINT__: inc()
};
function createI18nError(code2, ...args) {
  return createCompileError(code2, null, void 0);
}
const TranslateVNodeSymbol = /* @__PURE__ */ shared$1.exports.makeSymbol("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ shared$1.exports.makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ shared$1.exports.makeSymbol("__numberParts");
const SetPluralRulesSymbol = shared$1.exports.makeSymbol("__setPluralRules");
shared$1.exports.makeSymbol("__intlifyMeta");
const InejctWithOption = /* @__PURE__ */ shared$1.exports.makeSymbol("__injectWithOption");
function handleFlatJson(obj) {
  if (!shared$1.exports.isObject(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!shared$1.exports.hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (shared$1.exports.isObject(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      for (let i = 0; i < lastIndex; i++) {
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = {};
        }
        currentObj = currentObj[subKeys[i]];
      }
      currentObj[subKeys[lastIndex]] = obj[key];
      delete obj[key];
      if (shared$1.exports.isObject(currentObj[subKeys[lastIndex]])) {
        handleFlatJson(currentObj[subKeys[lastIndex]]);
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = shared$1.exports.isPlainObject(messages) ? messages : shared$1.exports.isArray(__i18n) ? {} : { [locale]: {} };
  if (shared$1.exports.isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || {};
          deepCopy$1(resource, ret[locale2]);
        } else {
          deepCopy$1(resource, ret);
        }
      } else {
        shared$1.exports.isString(custom) && deepCopy$1(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (shared$1.exports.hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
const isNotObjectOrIsArray = (val) => !shared$1.exports.isObject(val) || shared$1.exports.isArray(val);
function deepCopy$1(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
  for (const key in src) {
    if (shared$1.exports.hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        des[key] = src[key];
      } else {
        deepCopy$1(src[key], des[key]);
      }
    }
  }
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(global2, options, componentOptions) {
  let messages = shared$1.exports.isObject(options.messages) ? options.messages : {};
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(globalThis.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      global2.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (shared$1.exports.isObject(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (shared$1.exports.isObject(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  };
}
const getMetaInfo = () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}, VueI18nLegacy) {
  const { __root } = options;
  const _isGlobal = __root === void 0;
  let _inheritLocale = shared$1.exports.isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = ref(
    __root && _inheritLocale ? __root.locale.value : shared$1.exports.isString(options.locale) ? options.locale : DEFAULT_LOCALE$1
  );
  const _fallbackLocale = ref(
    __root && _inheritLocale ? __root.fallbackLocale.value : shared$1.exports.isString(options.fallbackLocale) || shared$1.exports.isArray(options.fallbackLocale) || shared$1.exports.isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref(shared$1.exports.isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref(shared$1.exports.isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : shared$1.exports.isBoolean(options.missingWarn) || shared$1.exports.isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : shared$1.exports.isBoolean(options.fallbackWarn) || shared$1.exports.isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : shared$1.exports.isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = shared$1.exports.isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = shared$1.exports.isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = shared$1.exports.isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : shared$1.exports.isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : shared$1.exports.isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = shared$1.exports.isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = shared$1.exports.isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return shared$1.exports.isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    if (__INTLIFY_PROD_DEVTOOLS__) {
      try {
        setAdditionalMeta(getMetaInfo());
        if (!_isGlobal) {
          _context.fallbackContext = __root ? getFallbackContext() : void 0;
        }
        ret = fn(_context);
      } finally {
        setAdditionalMeta(null);
        if (!_isGlobal) {
          _context.fallbackContext = void 0;
        }
      }
    } else {
      ret = fn(_context);
    }
    if (shared$1.exports.isNumber(ret) && ret === NOT_REOSLVED) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => shared$1.exports.isString(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !shared$1.exports.isObject(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, shared$1.exports.assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => shared$1.exports.isString(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => shared$1.exports.isString(val));
  }
  function normalize(values) {
    return values.map((val) => shared$1.exports.isString(val) || shared$1.exports.isNumber(val) || shared$1.exports.isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps(
      (context) => {
        let ret;
        const _context2 = context;
        try {
          _context2.processor = processor;
          ret = Reflect.apply(translate, null, [_context2, ...args]);
        } finally {
          _context2.processor = null;
        }
        return ret;
      },
      () => parseTranslateArgs(...args),
      "translate",
      (root) => root[TranslateVNodeSymbol](...args),
      (key) => [createTextNode(key)],
      (val) => shared$1.exports.isArray(val)
    );
  }
  function numberParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(number, null, [context, ...args]),
      () => parseNumberArgs(...args),
      "number format",
      (root) => root[NumberPartsSymbol](...args),
      () => [],
      (val) => shared$1.exports.isString(val) || shared$1.exports.isArray(val)
    );
  }
  function datetimeParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(datetime, null, [context, ...args]),
      () => parseDateTimeArgs(...args),
      "datetime format",
      (root) => root[DatetimePartsSymbol](...args),
      () => [],
      (val) => shared$1.exports.isString(val) || shared$1.exports.isArray(val)
    );
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    const targetLocale = shared$1.exports.isString(locale2) ? locale2 : _locale.value;
    const message = getLocaleMessage(targetLocale);
    return _context.messageResolver(message, key) !== null;
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage2(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    deepCopy$1(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format) {
    _datetimeFormats.value[locale2] = format;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format);
  }
  function mergeDateTimeFormat(locale2, format) {
    _datetimeFormats.value[locale2] = shared$1.exports.assign(_datetimeFormats.value[locale2] || {}, format);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format) {
    _numberFormats.value[locale2] = format;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format);
  }
  function mergeNumberFormat(locale2, format) {
    _numberFormats.value[locale2] = shared$1.exports.assign(_numberFormats.value[locale2] || {}, format);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format);
  }
  composerID++;
  if (__root && shared$1.exports.inBrowser) {
    watch(__root.locale, (val) => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, (val) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  }
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage: mergeLocaleMessage2,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOption] = options.__injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return [
        ...slot,
        ...current.type === Fragment$1 ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, {});
  }
}
function getFragmentableTag(tag) {
  return Fragment$1;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  name: "i18n-t",
  props: shared$1.exports.assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      validator: (val) => shared$1.exports.isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter((key) => key !== "_");
      const options = {};
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = shared$1.exports.isString(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n[TranslateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = shared$1.exports.assign({}, attrs);
      const tag = shared$1.exports.isString(props.tag) || shared$1.exports.isObject(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return shared$1.exports.isArray(target) && !shared$1.exports.isString(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = {};
    if (props.locale) {
      options.locale = props.locale;
    }
    if (shared$1.exports.isString(props.format)) {
      options.key = props.format;
    } else if (shared$1.exports.isObject(props.format)) {
      if (shared$1.exports.isString(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? shared$1.exports.assign({}, options2, { [prop]: props.format[prop] }) : options2;
      }, {});
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (shared$1.exports.isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`;
        }
        return node;
      });
    } else if (shared$1.exports.isString(parts)) {
      children = [parts];
    }
    const assignedAttrs = shared$1.exports.assign({}, attrs);
    const tag = shared$1.exports.isString(props.tag) || shared$1.exports.isObject(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  name: "i18n-n",
  props: shared$1.exports.assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: "parent",
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => i18n[NumberPartsSymbol](...args));
  }
});
const NumberFormat = NumberFormatImpl;
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  name: "i18n-d",
  props: shared$1.exports.assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: "parent",
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => i18n[DatetimePartsSymbol](...args));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
function getComposer$2(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, modifiers, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$2(i18n, instance.$);
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    if (shared$1.exports.inBrowser && i18n.global === composer) {
      el.__i18nWatcher = watch(composer.locale, () => {
        binding.instance && binding.instance.$forceUpdate();
      });
    }
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (shared$1.exports.inBrowser && el.__i18nWatcher) {
      el.__i18nWatcher();
      el.__i18nWatcher = void 0;
      delete el.__i18nWatcher;
    }
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (shared$1.exports.isString(value)) {
    return { path: value };
  } else if (shared$1.exports.isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (shared$1.exports.isString(locale)) {
    options.locale = locale;
  }
  if (shared$1.exports.isNumber(choice)) {
    options.plural = choice;
  }
  if (shared$1.exports.isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app2, i18n, ...options) {
  const pluginOptions = shared$1.exports.isPlainObject(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = shared$1.exports.isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    app2.component(!useI18nComponentName ? Translation.name : "i18n", Translation);
    app2.component(NumberFormat.name, NumberFormat);
    app2.component(DatetimeFormat.name, DatetimeFormat);
  }
  {
    app2.directive("t", vTDirective(i18n));
  }
}
const I18nInjectionKey = /* @__PURE__ */ shared$1.exports.makeSymbol("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __globalInjection = shared$1.exports.isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __allowComposition = true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options);
  const symbol = /* @__PURE__ */ shared$1.exports.makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  {
    const i18n = {
      get mode() {
        return "composition";
      },
      get allowComposition() {
        return __allowComposition;
      },
      async install(app2, ...options2) {
        app2.__VUE_I18N_SYMBOL__ = symbol;
        app2.provide(app2.__VUE_I18N_SYMBOL__, i18n);
        if (shared$1.exports.isPlainObject(options2[0])) {
          const opts = options2[0];
          i18n.__composerExtend = opts.__composerExtend;
          i18n.__vueI18nExtend = opts.__vueI18nExtend;
        }
        if (__globalInjection) {
          injectGlobalFields(app2, i18n.global);
        }
        {
          apply(app2, i18n, ...options2);
        }
        const unmountApp = app2.unmount;
        app2.unmount = () => {
          i18n.dispose();
          unmountApp();
        };
      },
      get global() {
        return __global;
      },
      dispose() {
        globalScope.stop();
      },
      __instances,
      __getInstance,
      __setInstance,
      __deleteInstance
    };
    return i18n;
  }
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSLALLED);
  }
  const i18n = getI18nInstance(instance);
  const global2 = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (scope === "global") {
    adjustI18nResources(global2, options, componentOptions);
    return global2;
  }
  if (scope === "parent") {
    let composer2 = getComposer$3(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = global2;
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = shared$1.exports.assign({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (global2) {
      composerOptions.__root = global2;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      i18nInternal.__composerExtend(composer);
    }
    setupLifeCycle(i18nInternal, instance);
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  {
    const obj = scope.run(() => createComposer(options));
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    return [scope, obj];
  }
}
function getI18nInstance(instance) {
  {
    const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    if (!i18n) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE);
    }
    return i18n;
  }
}
function getScope(options, componentOptions) {
  return shared$1.exports.isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer$3(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = target.parent;
  while (current != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function setupLifeCycle(i18n, target, composer) {
  {
    onUnmounted(() => {
      i18n.__deleteInstance(target);
    }, target);
  }
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app2, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app2.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app2.config.globalProperties, `$${method}`, desc);
  });
}
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
{
  initFeatureFlags();
}
if (__INTLIFY_PROD_DEVTOOLS__) {
  const target = shared$1.exports.getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
const STRATEGIES = {
  PREFIX: "prefix",
  PREFIX_EXCEPT_DEFAULT: "prefix_except_default",
  PREFIX_AND_DEFAULT: "prefix_and_default",
  NO_PREFIX: "no_prefix"
};
const DEFAULT_LOCALE = "";
const DEFAULT_STRATEGY = STRATEGIES.PREFIX_EXCEPT_DEFAULT;
const DEFAULT_TRAILING_SLASH = false;
const DEFAULT_ROUTES_NAME_SEPARATOR = "___";
const DEFAULT_LOCALE_ROUTE_NAME_SUFFIX = "default";
const DEFAULT_DETECTION_DIRECTION = "ltr";
const DEFAULT_BASE_URL = "";
const DEFAULT_DYNAMIC_PARAMS_KEY = "";
/*!
  * shared v9.3.0-beta.16
  * (c) 2023 kazuya kawaguchi
  * Released under the MIT License.
  */
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const assign = Object.assign;
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const TRAILING_SLASH_RE = /\/$|\/\?/;
function hasTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return (s0.slice(0, -1) || "/") + (s.length > 0 ? `?${s.join("?")}` : "");
}
function withTrailingSlash(input = "", queryParameters = false) {
  if (!queryParameters) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  const [s0, ...s] = input.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "");
}
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[vue-i18n-routing] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
function getNormalizedLocales(locales) {
  locales = locales || [];
  const normalized = [];
  for (const locale of locales) {
    if (isString(locale)) {
      normalized.push({ code: locale });
    } else {
      normalized.push(locale);
    }
  }
  return normalized;
}
function isI18nInstance(i18n) {
  return i18n != null && "global" in i18n && "mode" in i18n;
}
function isComposer(target) {
  return target != null && !("__composer" in target) && isRef(target.locale);
}
function isVueI18n(target) {
  return target != null && "__composer" in target;
}
function isExportedGlobalComposer(target) {
  return target != null && !("__composer" in target) && !isRef(target.locale);
}
function isLegacyVueI18n$1(target) {
  return target != null && ("__VUE_I18N_BRIDGE__" in target || "_sync" in target);
}
function getComposer(i18n) {
  return isI18nInstance(i18n) ? isComposer(i18n.global) ? i18n.global : i18n.global.__composer : isVueI18n(i18n) ? i18n.__composer : i18n;
}
function getLocale(i18n) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  return isComposer(target) ? target.locale.value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target) ? target.locale : target.locale;
}
function getLocales(i18n) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  return isComposer(target) ? target.locales.value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target) ? target.locales : target.locales;
}
function getLocaleCodes(i18n) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  return isComposer(target) ? target.localeCodes.value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target) ? target.localeCodes : target.localeCodes;
}
function setLocale(i18n, locale) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  if (isComposer(target)) {
    {
      target.locale.value = locale;
    }
  } else if (isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n$1(target)) {
    target.locale = locale;
  } else {
    throw new Error("TODO:");
  }
}
function getRouteName(routeName) {
  return isString(routeName) ? routeName : isSymbol(routeName) ? routeName.toString() : "(null)";
}
function getLocaleRouteName(routeName, locale, {
  defaultLocale,
  strategy,
  routesNameSeparator,
  defaultLocaleRouteNameSuffix
}) {
  let name = getRouteName(routeName) + (strategy === "no_prefix" ? "" : routesNameSeparator + locale);
  if (locale === defaultLocale && strategy === "prefix_and_default") {
    name += routesNameSeparator + defaultLocaleRouteNameSuffix;
  }
  return name;
}
function resolveBaseUrl(baseUrl, context) {
  if (isFunction(baseUrl)) {
    return baseUrl(context);
  }
  return baseUrl;
}
function matchBrowserLocale(locales, browserLocales) {
  const matchedLocales = [];
  for (const [index, browserCode] of browserLocales.entries()) {
    const matchedLocale = locales.find((l) => l.iso.toLowerCase() === browserCode.toLowerCase());
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 1 - index / browserLocales.length });
      break;
    }
  }
  for (const [index, browserCode] of browserLocales.entries()) {
    const languageCode = browserCode.split("-")[0].toLowerCase();
    const matchedLocale = locales.find((l) => l.iso.split("-")[0].toLowerCase() === languageCode);
    if (matchedLocale) {
      matchedLocales.push({ code: matchedLocale.code, score: 0.999 - index / browserLocales.length });
      break;
    }
  }
  return matchedLocales;
}
const DefaultBrowserLocaleMatcher = matchBrowserLocale;
function compareBrowserLocale(a, b) {
  if (a.score === b.score) {
    return b.code.length - a.code.length;
  }
  return b.score - a.score;
}
const DefaultBrowerLocaleComparer = compareBrowserLocale;
function findBrowserLocale(locales, browserLocales, { matcher = DefaultBrowserLocaleMatcher, comparer = DefaultBrowerLocaleComparer } = {}) {
  const normalizedLocales = [];
  for (const l of locales) {
    const { code: code2 } = l;
    const iso = l.iso || code2;
    normalizedLocales.push({ code: code2, iso });
  }
  const matchedLocales = matcher(normalizedLocales, browserLocales);
  if (matchedLocales.length > 1) {
    matchedLocales.sort(comparer);
  }
  return matchedLocales.length ? matchedLocales[0].code : "";
}
function proxyVueInstance(target) {
  return function() {
    return Reflect.apply(
      target,
      {
        getRouteBaseName: this.getRouteBaseName,
        localePath: this.localePath,
        localeRoute: this.localeRoute,
        localeLocation: this.localeLocation,
        resolveRoute: this.resolveRoute,
        switchLocalePath: this.switchLocalePath,
        localeHead: this.localeHead,
        i18n: this.$i18n,
        route: this.$route,
        router: this.$router
      },
      arguments
    );
  };
}
function extendI18n(i18n, {
  locales = [],
  localeCodes: localeCodes2 = [],
  baseUrl = DEFAULT_BASE_URL,
  hooks = {},
  context = {}
} = {}) {
  const scope = effectScope();
  const orgInstall = i18n.install;
  i18n.install = (vue, ...options) => {
    const pluginOptions = isPluginOptions(options[0]) ? assign({}, options[0]) : { inject: true };
    if (pluginOptions.inject == null) {
      pluginOptions.inject = true;
    }
    const orgComposerExtend = pluginOptions.__composerExtend;
    pluginOptions.__composerExtend = (c) => {
      const g = getComposer(i18n);
      c.locales = computed(() => g.locales.value);
      c.localeCodes = computed(() => g.localeCodes.value);
      c.baseUrl = computed(() => g.baseUrl.value);
      if (isFunction(orgComposerExtend)) {
        Reflect.apply(orgComposerExtend, pluginOptions, [c]);
      }
    };
    if (isVueI18n(i18n.global)) {
      const orgVueI18nExtend = pluginOptions.__vueI18nExtend;
      pluginOptions.__vueI18nExtend = (vueI18n) => {
        extendVueI18n(vueI18n, hooks.onExtendVueI18n);
        if (isFunction(orgVueI18nExtend)) {
          Reflect.apply(orgVueI18nExtend, pluginOptions, [vueI18n]);
        }
      };
    }
    options[0] = pluginOptions;
    Reflect.apply(orgInstall, i18n, [vue, ...options]);
    const composer = getComposer(i18n);
    scope.run(() => extendComposer(composer, { locales, localeCodes: localeCodes2, baseUrl, hooks, context }));
    if (isVueI18n(i18n.global)) {
      extendVueI18n(i18n.global, hooks.onExtendVueI18n);
    }
    const app2 = vue;
    const exported = i18n.mode === "composition" ? app2.config.globalProperties.$i18n : null;
    if (exported) {
      extendExportedGlobal(exported, composer, hooks.onExtendExportedGlobal);
    }
    if (pluginOptions.inject) {
      vue.mixin({
        methods: {
          resolveRoute: proxyVueInstance(resolveRoute),
          localePath: proxyVueInstance(localePath),
          localeRoute: proxyVueInstance(localeRoute),
          localeLocation: proxyVueInstance(localeLocation),
          switchLocalePath: proxyVueInstance(switchLocalePath),
          getRouteBaseName: proxyVueInstance(getRouteBaseName),
          localeHead: proxyVueInstance(localeHead)
        }
      });
    }
    if (app2.unmount) {
      const unmountApp = app2.unmount;
      app2.unmount = () => {
        scope.stop();
        unmountApp();
      };
    }
  };
  return scope;
}
function extendComposer(composer, options) {
  const { locales, localeCodes: localeCodes2, baseUrl, context } = options;
  const _locales = ref(locales);
  const _localeCodes = ref(localeCodes2);
  const _baseUrl = ref("");
  composer.locales = computed(() => _locales.value);
  composer.localeCodes = computed(() => _localeCodes.value);
  composer.baseUrl = computed(() => _baseUrl.value);
  {
    _baseUrl.value = resolveBaseUrl(baseUrl, context);
  }
  if (options.hooks && options.hooks.onExtendComposer) {
    options.hooks.onExtendComposer(composer);
  }
}
function extendExportedGlobal(exported, g, hook) {
  const properties = [
    {
      locales: {
        get() {
          return g.locales.value;
        }
      },
      localeCodes: {
        get() {
          return g.localeCodes.value;
        }
      },
      baseUrl: {
        get() {
          return g.baseUrl.value;
        }
      }
    }
  ];
  hook && properties.push(hook(g));
  for (const property of properties) {
    for (const [key, descriptor] of Object.entries(property)) {
      Object.defineProperty(exported, key, descriptor);
    }
  }
}
function extendVueI18n(vueI18n, hook) {
  const composer = getComposer(vueI18n);
  const properties = [
    {
      locales: {
        get() {
          return composer.locales.value;
        }
      },
      localeCodes: {
        get() {
          return composer.localeCodes.value;
        }
      },
      baseUrl: {
        get() {
          return composer.baseUrl.value;
        }
      }
    }
  ];
  hook && properties.push(hook(composer));
  for (const property of properties) {
    for (const [key, descriptor] of Object.entries(property)) {
      Object.defineProperty(vueI18n, key, descriptor);
    }
  }
}
function isPluginOptions(options) {
  return isObject(options) && ("inject" in options || "__composerExtend" in options || "__vueI18nExtend" in options);
}
const GlobalOptionsRegistory = makeSymbol("vue-i18n-routing-gor");
function registerGlobalOptions(router, options) {
  const _options = router[GlobalOptionsRegistory];
  if (_options) {
    warn("already registered global options");
  } else {
    router[GlobalOptionsRegistory] = options;
  }
}
function getGlobalOptions(router) {
  var _a2;
  return (_a2 = router[GlobalOptionsRegistory]) != null ? _a2 : {};
}
function getLocalesRegex(localeCodes2) {
  return new RegExp(`^/(${localeCodes2.join("|")})(?:/|$)`, "i");
}
function createLocaleFromRouteGetter(localeCodes2, routesNameSeparator, defaultLocaleRouteNameSuffix) {
  const localesPattern = `(${localeCodes2.join("|")})`;
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`;
  const regexpName = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, "i");
  const regexpPath = getLocalesRegex(localeCodes2);
  const getLocaleFromRoute = (route) => {
    if (isObject(route)) {
      if (route.name) {
        const name = isString(route.name) ? route.name : route.name.toString();
        const matches = name.match(regexpName);
        if (matches && matches.length > 1) {
          return matches[1];
        }
      } else if (route.path) {
        const matches = route.path.match(regexpPath);
        if (matches && matches.length > 1) {
          return matches[1];
        }
      }
    } else if (isString(route)) {
      const matches = route.match(regexpPath);
      if (matches && matches.length > 1) {
        return matches[1];
      }
    }
    return "";
  };
  return getLocaleFromRoute;
}
function getI18nRoutingOptions(router, proxy, {
  defaultLocale = DEFAULT_LOCALE,
  defaultDirection = DEFAULT_DETECTION_DIRECTION,
  defaultLocaleRouteNameSuffix = DEFAULT_LOCALE_ROUTE_NAME_SUFFIX,
  routesNameSeparator = DEFAULT_ROUTES_NAME_SEPARATOR,
  strategy = DEFAULT_STRATEGY,
  trailingSlash = DEFAULT_TRAILING_SLASH,
  localeCodes: localeCodes2 = [],
  prefixable: prefixable2 = DefaultPrefixable,
  switchLocalePathIntercepter = DefaultSwitchLocalePathIntercepter,
  dynamicRouteParamsKey = DEFAULT_DYNAMIC_PARAMS_KEY
} = {}) {
  const options = getGlobalOptions(router);
  return {
    defaultLocale: proxy.defaultLocale || options.defaultLocale || defaultLocale,
    defaultDirection: proxy.defaultDirection || options.defaultDirection || defaultDirection,
    defaultLocaleRouteNameSuffix: proxy.defaultLocaleRouteNameSuffix || options.defaultLocaleRouteNameSuffix || defaultLocaleRouteNameSuffix,
    routesNameSeparator: proxy.routesNameSeparator || options.routesNameSeparator || routesNameSeparator,
    strategy: proxy.strategy || options.strategy || strategy,
    trailingSlash: proxy.trailingSlash || options.trailingSlash || trailingSlash,
    localeCodes: proxy.localeCodes || options.localeCodes || localeCodes2,
    prefixable: proxy.prefixable || options.prefixable || prefixable2,
    switchLocalePathIntercepter: proxy.switchLocalePathIntercepter || options.switchLocalePathIntercepter || switchLocalePathIntercepter,
    dynamicRouteParamsKey: proxy.dynamicRouteParamsKey || options.dynamicRouteParamsKey || dynamicRouteParamsKey
  };
}
function split(str, index) {
  const result = [str.slice(0, index), str.slice(index)];
  return result;
}
function resolve(router, route, strategy, locale) {
  if (strategy === "prefix") {
    if (isArray(route.matched) && route.matched.length > 0) {
      return route.matched[0];
    }
    const [rootSlash, restPath] = split(route.path, 1);
    const targetPath = `${rootSlash}${locale}${restPath === "" ? restPath : `/${restPath}`}`;
    const _route = router.options.routes.find((r) => r.path === targetPath);
    if (_route == null) {
      return route;
    } else {
      const _resolevableRoute = assign({}, _route);
      _resolevableRoute.path = targetPath;
      return router.resolve(_resolevableRoute);
    }
  } else {
    return router.resolve(route);
  }
}
const RESOLVED_PREFIXED = /* @__PURE__ */ new Set(["prefix_and_default", "prefix_except_default"]);
function prefixable(optons) {
  const { currentLocale, defaultLocale, strategy } = optons;
  const isDefaultLocale = currentLocale === defaultLocale;
  return !(isDefaultLocale && RESOLVED_PREFIXED.has(strategy)) && !(strategy === "no_prefix");
}
const DefaultPrefixable = prefixable;
function getRouteBaseName(givenRoute) {
  const router = this.router;
  const { routesNameSeparator } = getI18nRoutingOptions(router, this);
  const route = givenRoute != null ? isRef(givenRoute) ? unref(givenRoute) : givenRoute : this.route;
  if (route == null || !route.name) {
    return;
  }
  const name = getRouteName(route.name);
  return name.split(routesNameSeparator)[0];
}
function localePath(route, locale) {
  const localizedRoute = resolveRoute.call(this, route, locale);
  return localizedRoute == null ? "" : localizedRoute.redirectedFrom || localizedRoute.fullPath;
}
function localeRoute(route, locale) {
  const resolved = resolveRoute.call(this, route, locale);
  return resolved == null ? void 0 : resolved;
}
function localeLocation(route, locale) {
  const resolved = resolveRoute.call(this, route, locale);
  return resolved == null ? void 0 : resolved;
}
function resolveRoute(route, locale) {
  const router = this.router;
  const i18n = this.i18n;
  const _locale = locale || getLocale(i18n);
  const { routesNameSeparator, defaultLocale, defaultLocaleRouteNameSuffix, strategy, trailingSlash, prefixable: prefixable2 } = getI18nRoutingOptions(router, this);
  let _route = route;
  if (isString(route)) {
    if (_route[0] === "/") {
      _route = { path: route };
    } else {
      _route = { name: route };
    }
  }
  let localizedRoute = assign({}, _route);
  if (localizedRoute.path && !localizedRoute.name) {
    let _resolvedRoute = null;
    try {
      _resolvedRoute = resolve(router, localizedRoute, strategy, _locale);
    } catch {
    }
    const resolvedRoute = _resolvedRoute;
    const resolvedRouteName = getRouteBaseName.call(this, resolvedRoute);
    if (isString(resolvedRouteName)) {
      localizedRoute = {
        name: getLocaleRouteName(resolvedRouteName, _locale, {
          defaultLocale,
          strategy,
          routesNameSeparator,
          defaultLocaleRouteNameSuffix
        }),
        params: resolvedRoute.params,
        query: resolvedRoute.query,
        hash: resolvedRoute.hash
      };
      {
        localizedRoute.state = resolvedRoute.state;
      }
    } else {
      if (prefixable2({ currentLocale: _locale, defaultLocale, strategy })) {
        localizedRoute.path = `/${_locale}${localizedRoute.path}`;
      }
      localizedRoute.path = trailingSlash ? withTrailingSlash(localizedRoute.path, true) : withoutTrailingSlash(localizedRoute.path, true);
    }
  } else {
    if (!localizedRoute.name && !localizedRoute.path) {
      localizedRoute.name = getRouteBaseName.call(this, this.route);
    }
    localizedRoute.name = getLocaleRouteName(localizedRoute.name, _locale, {
      defaultLocale,
      strategy,
      routesNameSeparator,
      defaultLocaleRouteNameSuffix
    });
  }
  try {
    const resolvedRoute = router.resolve(localizedRoute);
    if (isVue3 ? resolvedRoute.name : resolvedRoute.route.name) {
      return resolvedRoute;
    }
    return router.resolve(route);
  } catch (e) {
    if (e.type === 1) {
      return null;
    }
  }
}
const DefaultSwitchLocalePathIntercepter = (path) => path;
function getLocalizableMetaFromDynamicParams(route, key) {
  const metaDefault = {};
  if (key === DEFAULT_DYNAMIC_PARAMS_KEY) {
    return metaDefault;
  }
  const meta = route.meta;
  if (isRef(meta)) {
    return meta.value[key] || metaDefault;
  } else {
    return meta[key] || metaDefault;
  }
}
function switchLocalePath(locale) {
  const route = this.route;
  const name = getRouteBaseName.call(this, route);
  if (!name) {
    return "";
  }
  const { switchLocalePathIntercepter, dynamicRouteParamsKey } = getI18nRoutingOptions(this.router, this);
  const { params, ...routeCopy } = route;
  const langSwitchParams = getLocalizableMetaFromDynamicParams(route, dynamicRouteParamsKey)[locale] || {};
  const _baseRoute = {
    name,
    params: {
      ...params,
      ...langSwitchParams
    }
  };
  const baseRoute = assign({}, routeCopy, _baseRoute);
  let path = localePath.call(this, baseRoute, locale);
  path = switchLocalePathIntercepter(path, locale);
  return path;
}
function localeHead({ addDirAttribute = false, addSeoAttributes = false, identifierAttribute = "hid" } = {}) {
  const router = this.router;
  const i18n = this.i18n;
  const { defaultDirection } = getI18nRoutingOptions(router, this);
  const metaObject = {
    htmlAttrs: {},
    link: [],
    meta: []
  };
  if (i18n.locales == null || i18n.baseUrl == null) {
    return metaObject;
  }
  const locale = getLocale(i18n);
  const locales = getLocales(i18n);
  const currentLocale = getNormalizedLocales(locales).find((l) => l.code === locale) || {
    code: locale
  };
  const currentLocaleIso = currentLocale.iso;
  const currentLocaleDir = currentLocale.dir || defaultDirection;
  if (addDirAttribute) {
    metaObject.htmlAttrs.dir = currentLocaleDir;
  }
  if (addSeoAttributes && locale && i18n.locales) {
    if (currentLocaleIso) {
      metaObject.htmlAttrs.lang = currentLocaleIso;
    }
    addHreflangLinks.call(this, locales, unref(i18n.baseUrl), metaObject.link, identifierAttribute);
    addCanonicalLinks.call(this, unref(i18n.baseUrl), metaObject.link, identifierAttribute, addSeoAttributes);
    addCurrentOgLocale(currentLocale, currentLocaleIso, metaObject.meta, identifierAttribute);
    addAlternateOgLocales(locales, currentLocaleIso, metaObject.meta, identifierAttribute);
  }
  return metaObject;
}
function addHreflangLinks(locales, baseUrl, link, identifierAttribute) {
  const router = this.router;
  const { defaultLocale, strategy } = getI18nRoutingOptions(router, this);
  if (strategy === STRATEGIES.NO_PREFIX) {
    return;
  }
  const localeMap = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    const localeIso = locale.iso;
    if (!localeIso) {
      warn("Locale ISO code is required to generate alternate link");
      continue;
    }
    const [language, region] = localeIso.split("-");
    if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) {
      localeMap.set(language, locale);
    }
    localeMap.set(localeIso, locale);
  }
  for (const [iso, mapLocale] of localeMap.entries()) {
    const localePath2 = switchLocalePath.call(this, mapLocale.code);
    if (localePath2) {
      link.push({
        [identifierAttribute]: `i18n-alt-${iso}`,
        rel: "alternate",
        href: toAbsoluteUrl(localePath2, baseUrl),
        hreflang: iso
      });
    }
  }
  if (defaultLocale) {
    const localePath2 = switchLocalePath.call(this, defaultLocale);
    if (localePath2) {
      link.push({
        [identifierAttribute]: "i18n-xd",
        rel: "alternate",
        href: toAbsoluteUrl(localePath2, baseUrl),
        hreflang: "x-default"
      });
    }
  }
}
function addCanonicalLinks(baseUrl, link, identifierAttribute, seoAttributesOptions) {
  const route = this.route;
  const currentRoute = localeRoute.call(this, {
    ...route,
    name: getRouteBaseName.call(this, route)
  });
  if (currentRoute) {
    let href = toAbsoluteUrl(currentRoute.path, baseUrl);
    const canonicalQueries = isObject(seoAttributesOptions) && seoAttributesOptions.canonicalQueries || [];
    if (canonicalQueries.length) {
      const currentRouteQueryParams = currentRoute.query;
      const params = new URLSearchParams();
      for (const queryParamName of canonicalQueries) {
        if (queryParamName in currentRouteQueryParams) {
          const queryParamValue = currentRouteQueryParams[queryParamName];
          if (isArray(queryParamValue)) {
            queryParamValue.forEach((v) => params.append(queryParamName, v || ""));
          } else {
            params.append(queryParamName, queryParamValue || "");
          }
        }
      }
      const queryString = params.toString();
      if (queryString) {
        href = `${href}?${queryString}`;
      }
    }
    link.push({
      [identifierAttribute]: "i18n-can",
      rel: "canonical",
      href
    });
  }
}
function addCurrentOgLocale(currentLocale, currentLocaleIso, meta, identifierAttribute) {
  const hasCurrentLocaleAndIso = currentLocale && currentLocaleIso;
  if (!hasCurrentLocaleAndIso) {
    return;
  }
  meta.push({
    [identifierAttribute]: "i18n-og",
    property: "og:locale",
    content: hypenToUnderscore(currentLocaleIso)
  });
}
function addAlternateOgLocales(locales, currentLocaleIso, meta, identifierAttribute) {
  const localesWithoutCurrent = locales.filter((locale) => {
    const localeIso = locale.iso;
    return localeIso && localeIso !== currentLocaleIso;
  });
  if (localesWithoutCurrent.length) {
    const alternateLocales = localesWithoutCurrent.map((locale) => ({
      [identifierAttribute]: `i18n-og-alt-${locale.iso}`,
      property: "og:locale:alternate",
      content: hypenToUnderscore(locale.iso)
    }));
    meta.push(...alternateLocales);
  }
}
function hypenToUnderscore(str) {
  return (str || "").replace(/-/g, "_");
}
function toAbsoluteUrl(urlOrPath, baseUrl) {
  if (urlOrPath.match(/^https?:\/\//)) {
    return urlOrPath;
  }
  return baseUrl + urlOrPath;
}
function proxyForComposable(options, target) {
  const {
    router,
    route,
    i18n,
    defaultLocale,
    strategy,
    defaultLocaleRouteNameSuffix,
    trailingSlash,
    routesNameSeparator
  } = options;
  return function(...args) {
    return Reflect.apply(
      target,
      {
        router,
        route,
        i18n,
        defaultLocale,
        strategy,
        defaultLocaleRouteNameSuffix,
        trailingSlash,
        routesNameSeparator
      },
      args
    );
  };
}
function useSwitchLocalePath({
  router = useRouter$1(),
  route = useRoute$1(),
  i18n = useI18n(),
  defaultLocale = void 0,
  defaultLocaleRouteNameSuffix = void 0,
  routesNameSeparator = void 0,
  strategy = void 0,
  trailingSlash = void 0
} = {}) {
  return proxyForComposable(
    {
      router,
      route,
      i18n,
      defaultLocale,
      defaultLocaleRouteNameSuffix,
      routesNameSeparator,
      strategy,
      trailingSlash
    },
    switchLocalePath
  );
}
const localeCodes = ["en", "fr"];
const localeMessages = {};
const additionalMessages = Object({ "fr": [] });
const resolveNuxtI18nOptions = async (context) => {
  const nuxtI18nOptions = Object({});
  const vueI18nOptionsLoader = async (context2) => Object({ "legacy": false, "locale": "en", "messages": Object({ "en": {
    "Home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Home"]);
    },
    "Shop": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Shop"]);
    },
    "Products": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Product"]);
    },
    "Features": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Feature"]);
    },
    "Pages": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Pages"]);
    },
    "Blog": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Blog"]);
    }
  }, "fr": {
    "Home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Domicile"]);
    },
    "Shop": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Magasin"]);
    },
    "PRODUCTS": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Produit"]);
    },
    "FEATURES": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Caract\xE9ristique"]);
    },
    "PAGES": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["pages"]);
    },
    "BLOG": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Blog"]);
    }
  } }) });
  nuxtI18nOptions.vueI18n = await vueI18nOptionsLoader();
  nuxtI18nOptions.locales = [Object({ "code": "en", "name": "English" }), Object({ "code": "fr", "name": "Fran\xE7ais" })];
  nuxtI18nOptions.defaultLocale = "en";
  nuxtI18nOptions.defaultDirection = "ltr";
  nuxtI18nOptions.routesNameSeparator = "___";
  nuxtI18nOptions.trailingSlash = false;
  nuxtI18nOptions.defaultLocaleRouteNameSuffix = "default";
  nuxtI18nOptions.strategy = "prefix_except_default";
  nuxtI18nOptions.lazy = false;
  nuxtI18nOptions.langDir = null;
  nuxtI18nOptions.rootRedirect = null;
  nuxtI18nOptions.detectBrowserLanguage = Object({ "alwaysRedirect": false, "cookieCrossOrigin": false, "cookieDomain": null, "cookieKey": "i18n_redirected", "cookieSecure": false, "fallbackLocale": "", "redirectOn": "root", "useCookie": true });
  nuxtI18nOptions.differentDomains = false;
  nuxtI18nOptions.baseUrl = "";
  nuxtI18nOptions.dynamicRouteParams = false;
  nuxtI18nOptions.customRoutes = "page";
  nuxtI18nOptions.pages = Object({});
  nuxtI18nOptions.skipSettingLocaleOnNavigate = false;
  nuxtI18nOptions.onBeforeLanguageSwitch = () => "";
  nuxtI18nOptions.onLanguageSwitched = () => null;
  nuxtI18nOptions.types = void 0;
  nuxtI18nOptions.debug = false;
  return nuxtI18nOptions;
};
const nuxtI18nOptionsDefault = Object({ vueI18n: void 0, locales: [], defaultLocale: "", defaultDirection: "ltr", routesNameSeparator: "___", trailingSlash: false, defaultLocaleRouteNameSuffix: "default", strategy: "prefix_except_default", lazy: false, langDir: null, rootRedirect: null, detectBrowserLanguage: Object({ "alwaysRedirect": false, "cookieCrossOrigin": false, "cookieDomain": null, "cookieKey": "i18n_redirected", "cookieSecure": false, "fallbackLocale": "", "redirectOn": "root", "useCookie": true }), differentDomains: false, baseUrl: "", dynamicRouteParams: false, customRoutes: "page", pages: Object({}), skipSettingLocaleOnNavigate: false, onBeforeLanguageSwitch: () => "", onLanguageSwitched: () => null, types: void 0, debug: false });
const nuxtI18nInternalOptions = Object({ __normalizedLocales: [Object({ "code": "en", "name": "English" }), Object({ "code": "fr", "name": "Fran\xE7ais" })] });
const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n";
const isSSG = false;
function formatMessage(message) {
  return NUXT_I18N_MODULE_ID + " " + message;
}
function isLegacyVueI18n(target) {
  return target != null && ("__VUE_I18N_BRIDGE__" in target || "_sync" in target);
}
function callVueI18nInterfaces(i18n, name, ...args) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  const [obj, method] = [target, target[name]];
  return Reflect.apply(method, obj, [...args]);
}
function getVueI18nPropertyValue(i18n, name) {
  const target = isI18nInstance(i18n) ? i18n.global : i18n;
  const ret = isComposer(target) ? target[name].value : isExportedGlobalComposer(target) || isVueI18n(target) || isLegacyVueI18n(target) ? target[name] : target[name];
  return ret;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function proxyNuxt(nuxt, target) {
  return function() {
    return Reflect.apply(
      target,
      {
        i18n: nuxt.$i18n,
        getRouteBaseName: nuxt.$getRouteBaseName,
        localePath: nuxt.$localePath,
        localeRoute: nuxt.$localeRoute,
        switchLocalePath: nuxt.$switchLocalePath,
        localeHead: nuxt.$localeHead,
        route: nuxt.$router.currentRoute.value,
        router: nuxt.$router
      },
      arguments
    );
  };
}
function parseAcceptLanguage(input) {
  return input.split(",").map((tag) => tag.split(";")[0]);
}
function deepCopy(src, des) {
  for (const key in src) {
    if (shared$1.exports.isObject(src[key])) {
      if (!shared$1.exports.isObject(des[key]))
        des[key] = {};
      deepCopy(src[key], des[key]);
    } else {
      des[key] = src[key];
    }
  }
}
async function loadMessage(context, loader) {
  let message = null;
  try {
    const getter = await loader().then((r) => r.default || r);
    if (shared$1.exports.isFunction(getter)) {
      console.error(formatMessage("Not support executable file (e.g. js, cjs, mjs)"));
    } else {
      message = getter;
    }
  } catch (e) {
    console.error(formatMessage("Failed locale loading: " + e.message));
  }
  return message;
}
const loadedMessages = /* @__PURE__ */ new Map();
async function loadLocale(context, locale, setter) {
  {
    const loaders = localeMessages[locale];
    if (loaders != null) {
      if (loaders.length === 1) {
        const { key, load } = loaders[0];
        let message = null;
        if (loadedMessages.has(key)) {
          message = loadedMessages.get(key);
        } else {
          message = await loadMessage(context, load);
          if (message != null) {
            loadedMessages.set(key, message);
          }
        }
        if (message != null) {
          setter(locale, message);
        }
      } else if (loaders.length > 1) {
        const targetMessage = {};
        for (const { key, load } of loaders) {
          let message = null;
          if (loadedMessages.has(key)) {
            message = loadedMessages.get(key);
          } else {
            message = await loadMessage(context, load);
            if (message != null) {
              loadedMessages.set(key, message);
            }
          }
          if (message != null) {
            deepCopy(message, targetMessage);
          }
        }
        setter(locale, targetMessage);
      }
    }
  }
}
async function loadAdditionalLocale(context, locale, merger) {
  {
    const additionalLoaders = additionalMessages[locale] || [];
    for (const additionalLoader of additionalLoaders) {
      const message = await loadMessage(context, additionalLoader);
      if (message != null) {
        merger(locale, message);
      }
    }
  }
}
function getBrowserLocale(options, context) {
  let ret;
  {
    const header = useRequestHeaders(["accept-language"]);
    const accept = header["accept-language"];
    if (accept) {
      ret = findBrowserLocale(options.__normalizedLocales, parseAcceptLanguage(accept));
    }
  }
  return ret;
}
function getLocaleCookie(context, {
  useCookie = nuxtI18nOptionsDefault.detectBrowserLanguage.useCookie,
  cookieKey = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieKey,
  localeCodes: localeCodes2 = []
} = {}) {
  if (useCookie) {
    let localeCode;
    {
      const cookie = useRequestHeaders(["cookie"]);
      if ("cookie" in cookie) {
        const parsedCookie = parse(cookie["cookie"]);
        localeCode = parsedCookie[cookieKey];
      }
    }
    if (localeCode && localeCodes2.includes(localeCode)) {
      return localeCode;
    }
  }
}
function setLocaleCookie(locale, context, {
  useCookie = nuxtI18nOptionsDefault.detectBrowserLanguage.useCookie,
  cookieKey = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieKey,
  cookieDomain = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieDomain,
  cookieSecure = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieSecure,
  cookieCrossOrigin = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieCrossOrigin
} = {}) {
  if (!useCookie) {
    return;
  }
  const date = new Date();
  const cookieOptions = {
    expires: new Date(date.setDate(date.getDate() + 365)),
    path: "/",
    sameSite: cookieCrossOrigin ? "none" : "lax",
    secure: cookieCrossOrigin || cookieSecure
  };
  if (cookieDomain) {
    cookieOptions.domain = cookieDomain;
  }
  {
    if (context.res) {
      const { res } = context;
      let headers = res.getHeader("Set-Cookie") || [];
      if (!shared$1.exports.isArray(headers)) {
        headers = [String(headers)];
      }
      const redirectCookie = serialize(cookieKey, locale, cookieOptions);
      headers.push(redirectCookie);
      res.setHeader("Set-Cookie", headers);
    }
  }
}
const DefaultDetectBrowserLanguageFromResult = {
  locale: "",
  stat: false,
  reason: "unknown",
  from: "unknown"
};
function detectBrowserLanguage(route, context, nuxtI18nOptions, nuxtI18nInternalOptions2, localeCodes2 = [], locale = "", mode) {
  const { strategy } = nuxtI18nOptions;
  const { redirectOn, alwaysRedirect, useCookie, fallbackLocale } = nuxtI18nOptions.detectBrowserLanguage;
  const path = shared$1.exports.isString(route) ? route : route.path;
  if (strategy !== "no_prefix") {
    if (redirectOn === "root") {
      if (path !== "/") {
        return { locale: "", stat: false, reason: "not_redirect_on_root" };
      }
    } else if (redirectOn === "no prefix") {
      if (!alwaysRedirect && path.match(getLocalesRegex(localeCodes2))) {
        return { locale: "", stat: false, reason: "not_redirect_on_no_prefix" };
      }
    }
  }
  let localeFrom = "unknown";
  let cookieLocale;
  let matchedLocale;
  if (useCookie) {
    matchedLocale = cookieLocale = getLocaleCookie(context, { ...nuxtI18nOptions.detectBrowserLanguage, localeCodes: localeCodes2 });
    localeFrom = "cookie";
  }
  if (!matchedLocale) {
    matchedLocale = getBrowserLocale(nuxtI18nInternalOptions2);
    localeFrom = "navigator_or_header";
  }
  const finalLocale = matchedLocale || fallbackLocale;
  if (!matchedLocale && fallbackLocale) {
    localeFrom = "fallback";
  }
  const vueI18nLocale = locale || nuxtI18nOptions.vueI18n.locale;
  if (finalLocale && (!useCookie || alwaysRedirect || !cookieLocale)) {
    if (strategy === "no_prefix") {
      return { locale: finalLocale, stat: true, from: localeFrom };
    } else {
      if (finalLocale !== vueI18nLocale) {
        return { locale: finalLocale, stat: true, from: localeFrom };
      } else {
        if (alwaysRedirect && path === "/") {
          return { locale: finalLocale, stat: true, from: localeFrom };
        }
      }
    }
  }
  if (mode === "ssg_setup" && finalLocale) {
    return { locale: finalLocale, stat: true, from: localeFrom };
  }
  return { locale: "", stat: false, reason: "not_found_match" };
}
function getHost() {
  let host;
  {
    const header = useRequestHeaders(["x-forwarded-host", "host"]);
    let detectedHost;
    if ("x-forwarded-host" in header) {
      detectedHost = header["x-forwarded-host"];
    } else if ("host" in header) {
      detectedHost = header["host"];
    }
    host = shared$1.exports.isArray(detectedHost) ? detectedHost[0] : detectedHost;
  }
  return host;
}
function getLocaleDomain(locales) {
  let host = getHost() || "";
  if (host) {
    const matchingLocale = locales.find((locale) => locale.domain === host);
    if (matchingLocale) {
      return matchingLocale.code;
    } else {
      host = "";
    }
  }
  return host;
}
function getDomainFromLocale(localeCode, locales, nuxt) {
  const lang = locales.find((locale) => locale.code === localeCode);
  if (lang && lang.domain) {
    if (hasProtocol(lang.domain)) {
      return lang.domain;
    }
    let protocol;
    {
      const {
        node: { req }
      } = useRequestEvent(nuxt);
      protocol = req && isHTTPS(req) ? "https" : "http";
    }
    return protocol + "://" + lang.domain;
  }
  console.warn(formatMessage("Could not find domain name for locale " + localeCode));
}
function setCookieLocale(i18n, locale) {
  return callVueI18nInterfaces(i18n, "setLocaleCookie", locale);
}
function mergeLocaleMessage(i18n, locale, messages) {
  return callVueI18nInterfaces(i18n, "mergeLocaleMessage", locale, messages);
}
function onBeforeLanguageSwitch(i18n, oldLocale, newLocale, initial, context) {
  return callVueI18nInterfaces(i18n, "onBeforeLanguageSwitch", oldLocale, newLocale, initial, context);
}
function onLanguageSwitched(i18n, oldLocale, newLocale) {
  return callVueI18nInterfaces(i18n, "onLanguageSwitched", oldLocale, newLocale);
}
function makeFallbackLocaleCodes(fallback, locales) {
  let fallbackLocales = [];
  if (shared$1.exports.isArray(fallback)) {
    fallbackLocales = fallback;
  } else if (shared$1.exports.isObject(fallback)) {
    const targets = [...locales, "default"];
    for (const locale of targets) {
      if (fallback[locale]) {
        fallbackLocales = [...fallbackLocales, ...fallback[locale].filter(Boolean)];
      }
    }
  } else if (shared$1.exports.isString(fallback) && locales.every((locale) => locale !== fallback)) {
    fallbackLocales.push(fallback);
  }
  return fallbackLocales;
}
async function loadInitialMessages(context, messages, options) {
  const { defaultLocale, initialLocale, localeCodes: localeCodes2, fallbackLocale, langDir, lazy } = options;
  const setter = (locale, message) => {
    const base = messages[locale] || {};
    messages[locale] = { ...base, ...message };
  };
  if (langDir) {
    if (lazy && fallbackLocale) {
      const fallbackLocales = makeFallbackLocaleCodes(fallbackLocale, [defaultLocale, initialLocale]);
      await Promise.all(fallbackLocales.map((locale) => loadLocale(context, locale, setter)));
    }
    const locales = lazy ? [...(/* @__PURE__ */ new Set()).add(defaultLocale).add(initialLocale)] : localeCodes2;
    await Promise.all(locales.map((locale) => loadLocale(context, locale, setter)));
  }
  return messages;
}
async function mergeAdditionalMessages(context, i18n, locale) {
  await loadAdditionalLocale(
    context,
    locale,
    (locale2, message) => mergeLocaleMessage(i18n, locale2, message)
  );
}
async function loadAndSetLocale(newLocale, context, i18n, {
  useCookie = nuxtI18nOptionsDefault.detectBrowserLanguage.useCookie,
  skipSettingLocaleOnNavigate = nuxtI18nOptionsDefault.skipSettingLocaleOnNavigate,
  differentDomains = nuxtI18nOptionsDefault.differentDomains,
  initial = false,
  lazy = false,
  langDir = null
} = {}) {
  let ret = false;
  const oldLocale = getLocale(i18n);
  if (!newLocale) {
    return [ret, oldLocale];
  }
  if (!initial && differentDomains) {
    return [ret, oldLocale];
  }
  if (oldLocale === newLocale) {
    return [ret, oldLocale];
  }
  const localeOverride = onBeforeLanguageSwitch(i18n, oldLocale, newLocale, initial, context);
  const localeCodes2 = getLocaleCodes(i18n);
  if (localeOverride && localeCodes2 && localeCodes2.includes(localeOverride)) {
    if (localeOverride === oldLocale) {
      return [ret, oldLocale];
    }
    newLocale = localeOverride;
  }
  if (langDir) {
    const i18nFallbackLocales = getVueI18nPropertyValue(i18n, "fallbackLocale");
    if (lazy) {
      const setter = (locale, message) => mergeLocaleMessage(i18n, locale, message);
      if (i18nFallbackLocales) {
        const fallbackLocales = makeFallbackLocaleCodes(i18nFallbackLocales, [newLocale]);
        await Promise.all(fallbackLocales.map((locale) => loadLocale(context, locale, setter)));
      }
      await loadLocale(context, newLocale, setter);
    }
  }
  await mergeAdditionalMessages(context, i18n, newLocale);
  if (skipSettingLocaleOnNavigate) {
    return [ret, oldLocale];
  }
  if (useCookie) {
    setCookieLocale(i18n, newLocale);
  }
  setLocale(i18n, newLocale);
  onLanguageSwitched(i18n, oldLocale, newLocale);
  ret = true;
  return [ret, oldLocale];
}
function detectLocale(route, context, routeLocaleGetter, nuxtI18nOptions, initialLocaleLoader, normalizedLocales, localeCodes2 = [], ssgStatus = "normal") {
  const { strategy, defaultLocale, differentDomains } = nuxtI18nOptions;
  const initialLocale = shared$1.exports.isFunction(initialLocaleLoader) ? initialLocaleLoader() : initialLocaleLoader;
  const { locale: browserLocale, stat, reason, from } = nuxtI18nOptions.detectBrowserLanguage ? detectBrowserLanguage(route, context, nuxtI18nOptions, nuxtI18nInternalOptions, localeCodes2, initialLocale, ssgStatus) : DefaultDetectBrowserLanguageFromResult;
  if (reason === "detect_ignore_on_ssg") {
    return initialLocale;
  }
  let finalLocale = browserLocale;
  if (!finalLocale) {
    if (differentDomains) {
      finalLocale = getLocaleDomain(normalizedLocales);
    } else if (strategy !== "no_prefix") {
      finalLocale = routeLocaleGetter(route);
    } else {
      if (!nuxtI18nOptions.detectBrowserLanguage) {
        finalLocale = initialLocale;
      }
    }
  }
  if (!finalLocale && nuxtI18nOptions.detectBrowserLanguage && nuxtI18nOptions.detectBrowserLanguage.useCookie) {
    finalLocale = getLocaleCookie(context, { ...nuxtI18nOptions.detectBrowserLanguage, localeCodes: localeCodes2 });
  }
  if (!finalLocale) {
    finalLocale = defaultLocale || "";
  }
  return finalLocale;
}
function detectRedirect(route, context, targetLocale, routeLocaleGetter, nuxtI18nOptions) {
  const { strategy, defaultLocale, differentDomains } = nuxtI18nOptions;
  let redirectPath = "";
  if (!differentDomains && strategy !== "no_prefix" && (routeLocaleGetter(route) !== targetLocale || strategy === "prefix_and_default" && targetLocale === defaultLocale)) {
    const { fullPath } = route;
    const decodedRoute = decodeURI(fullPath);
    const routePath = context.$switchLocalePath(targetLocale) || context.$localePath(fullPath, targetLocale);
    if (shared$1.exports.isString(routePath) && routePath && routePath !== fullPath && routePath !== decodedRoute && !routePath.startsWith("//")) {
      redirectPath = routePath;
    }
  }
  if (differentDomains || isSSG) {
    const switchLocalePath2 = useSwitchLocalePath({
      i18n: getComposer(context.$i18n),
      route,
      router: context.$router
    });
    const routePath = switchLocalePath2(targetLocale);
    if (shared$1.exports.isString(routePath)) {
      redirectPath = routePath;
    }
  }
  return redirectPath;
}
function isRootRedirectOptions(rootRedirect) {
  return shared$1.exports.isObject(rootRedirect) && "path" in rootRedirect && "statusCode" in rootRedirect;
}
const useRedirectState = () => useState(NUXT_I18N_MODULE_ID + ":redirect", () => "");
function _navigate(redirectPath, status) {
  {
    return navigateTo(redirectPath, { redirectCode: status });
  }
}
async function navigate(args, {
  status = 301,
  rootRedirect = nuxtI18nOptionsDefault.rootRedirect,
  differentDomains = nuxtI18nOptionsDefault.differentDomains,
  skipSettingLocaleOnNavigate = nuxtI18nOptionsDefault.skipSettingLocaleOnNavigate
} = {}) {
  const { i18n, locale, route } = args;
  let { redirectPath } = args;
  if (route.path === "/" && rootRedirect) {
    if (shared$1.exports.isString(rootRedirect)) {
      redirectPath = "/" + rootRedirect;
    } else if (isRootRedirectOptions(rootRedirect)) {
      redirectPath = "/" + rootRedirect.path;
      status = rootRedirect.statusCode;
    }
    return _navigate(redirectPath, status);
  }
  if (!differentDomains) {
    if (redirectPath) {
      return _navigate(redirectPath, status);
    }
  } else {
    const state = useRedirectState();
    {
      state.value = redirectPath;
    }
  }
}
function inejctNuxtHelpers(nuxt, i18n) {
  defineGetter(nuxt, "$i18n", i18n.global);
  for (const pair of [
    ["getRouteBaseName", getRouteBaseName],
    ["localePath", localePath],
    ["localeRoute", localeRoute],
    ["switchLocalePath", switchLocalePath],
    ["localeHead", localeHead]
  ]) {
    defineGetter(nuxt, "$" + pair[0], proxyNuxt(nuxt, pair[1]));
  }
}
function extendPrefixable(differentDomains) {
  return (opts) => {
    return DefaultPrefixable(opts) && !differentDomains;
  };
}
function extendSwitchLocalePathIntercepter(differentDomains, normalizedLocales, nuxt) {
  return (path, locale) => {
    if (differentDomains) {
      const domain = getDomainFromLocale(locale, normalizedLocales, nuxt);
      if (domain) {
        return joinURL(domain, path);
      } else {
        return path;
      }
    } else {
      return DefaultSwitchLocalePathIntercepter(path);
    }
  };
}
function extendBaseUrl(baseUrl, options) {
  return (context) => {
    if (shared$1.exports.isFunction(baseUrl)) {
      return baseUrl(context);
    }
    const { differentDomains, localeCodeLoader, normalizedLocales } = options;
    const localeCode = shared$1.exports.isFunction(localeCodeLoader) ? localeCodeLoader() : localeCodeLoader;
    if (differentDomains && localeCode) {
      const domain = getDomainFromLocale(localeCode, normalizedLocales, options.nuxt);
      if (domain) {
        return domain;
      }
    }
    return baseUrl;
  };
}
const node_modules__64nuxtjs_i18n_dist_runtime_plugins_i18n_mjs_yfWm7jX06p = defineNuxtPlugin(async (nuxt) => {
  var _a2;
  let __temp, __restore;
  const router = useRouter();
  const route = useRoute();
  const { vueApp: app2 } = nuxt;
  const nuxtContext = nuxt;
  const nuxtI18nOptions = ([__temp, __restore] = executeAsync(() => resolveNuxtI18nOptions()), __temp = await __temp, __restore(), __temp);
  const useCookie = nuxtI18nOptions.detectBrowserLanguage && nuxtI18nOptions.detectBrowserLanguage.useCookie;
  const { __normalizedLocales: normalizedLocales } = nuxtI18nInternalOptions;
  const {
    defaultLocale,
    differentDomains,
    skipSettingLocaleOnNavigate,
    lazy,
    langDir,
    routesNameSeparator,
    defaultLocaleRouteNameSuffix,
    strategy,
    rootRedirect
  } = nuxtI18nOptions;
  nuxtI18nOptions.baseUrl = extendBaseUrl(nuxtI18nOptions.baseUrl, {
    differentDomains,
    nuxt: nuxtContext,
    localeCodeLoader: defaultLocale,
    normalizedLocales
  });
  const getLocaleFromRoute = createLocaleFromRouteGetter(localeCodes, routesNameSeparator, defaultLocaleRouteNameSuffix);
  const vueI18nOptions = nuxtI18nOptions.vueI18n;
  vueI18nOptions.messages = vueI18nOptions.messages || {};
  vueI18nOptions.fallbackLocale = (_a2 = vueI18nOptions.fallbackLocale) != null ? _a2 : false;
  registerGlobalOptions(router, {
    ...nuxtI18nOptions,
    dynamicRouteParamsKey: "nuxtI18n",
    switchLocalePathIntercepter: extendSwitchLocalePathIntercepter(differentDomains, normalizedLocales, nuxtContext),
    prefixable: extendPrefixable(differentDomains)
  });
  const getDefaultLocale = (defaultLocale2) => defaultLocale2 || vueI18nOptions.locale || "en-US";
  let initialLocale = detectLocale(
    route,
    nuxt.ssrContext,
    getLocaleFromRoute,
    nuxtI18nOptions,
    getDefaultLocale(defaultLocale),
    normalizedLocales,
    localeCodes,
    "normal"
  );
  vueI18nOptions.messages = ([__temp, __restore] = executeAsync(() => loadInitialMessages(nuxtContext, vueI18nOptions.messages, {
    ...nuxtI18nOptions,
    initialLocale,
    fallbackLocale: vueI18nOptions.fallbackLocale,
    localeCodes
  })), __temp = await __temp, __restore(), __temp);
  initialLocale = getDefaultLocale(initialLocale);
  const i18n = createI18n({
    ...vueI18nOptions,
    locale: initialLocale
  });
  let notInitialSetup = true;
  const isInitialLocaleSetup = (locale) => initialLocale !== locale && notInitialSetup;
  extendI18n(i18n, {
    locales: nuxtI18nOptions.locales,
    localeCodes,
    baseUrl: nuxtI18nOptions.baseUrl,
    context: nuxtContext,
    hooks: {
      onExtendComposer(composer) {
        composer.strategy = strategy;
        composer.localeProperties = computed(() => {
          return normalizedLocales.find((l) => l.code === composer.locale.value) || {
            code: composer.locale.value
          };
        });
        composer.setLocale = async (locale) => {
          const localeSetup = isInitialLocaleSetup(locale);
          const [modified] = await loadAndSetLocale(locale, nuxtContext, i18n, {
            useCookie,
            differentDomains,
            initial: localeSetup,
            skipSettingLocaleOnNavigate,
            lazy,
            langDir
          });
          if (modified && localeSetup) {
            notInitialSetup = false;
          }
          const redirectPath = detectRedirect(route, nuxtContext, locale, getLocaleFromRoute, nuxtI18nOptions);
          await navigate(
            {
              i18n,
              redirectPath,
              locale,
              route
            },
            {
              differentDomains,
              skipSettingLocaleOnNavigate,
              rootRedirect
            }
          );
        };
        composer.differentDomains = differentDomains;
        composer.getBrowserLocale = () => getBrowserLocale(nuxtI18nInternalOptions, nuxt.ssrContext);
        composer.getLocaleCookie = () => getLocaleCookie(nuxt.ssrContext, { ...nuxtI18nOptions.detectBrowserLanguage, localeCodes });
        composer.setLocaleCookie = (locale) => setLocaleCookie(locale, nuxt.ssrContext, nuxtI18nOptions.detectBrowserLanguage || void 0);
        composer.onBeforeLanguageSwitch = nuxtI18nOptions.onBeforeLanguageSwitch;
        composer.onLanguageSwitched = nuxtI18nOptions.onLanguageSwitched;
        composer.finalizePendingLocaleChange = async () => {
          if (!i18n.__pendingLocale) {
            return;
          }
          setLocale(i18n, i18n.__pendingLocale);
          if (i18n.__resolvePendingLocalePromise) {
            await i18n.__resolvePendingLocalePromise();
          }
          i18n.__pendingLocale = void 0;
        };
        composer.waitForPendingLocaleChange = async () => {
          if (i18n.__pendingLocale && i18n.__pendingLocalePromise) {
            await i18n.__pendingLocalePromise;
          }
        };
      },
      onExtendExportedGlobal(g) {
        return {
          strategy: {
            get() {
              return g.strategy;
            }
          },
          localeProperties: {
            get() {
              return g.localeProperties.value;
            }
          },
          setLocale: {
            get() {
              return async (locale) => Reflect.apply(g.setLocale, g, [locale]);
            }
          },
          differentDomains: {
            get() {
              return g.differentDomains;
            }
          },
          getBrowserLocale: {
            get() {
              return () => Reflect.apply(g.getBrowserLocale, g, []);
            }
          },
          getLocaleCookie: {
            get() {
              return () => Reflect.apply(g.getLocaleCookie, g, []);
            }
          },
          setLocaleCookie: {
            get() {
              return (locale) => Reflect.apply(g.setLocaleCookie, g, [locale]);
            }
          },
          onBeforeLanguageSwitch: {
            get() {
              return (oldLocale, newLocale, initialSetup, context) => Reflect.apply(g.onBeforeLanguageSwitch, g, [oldLocale, newLocale, initialSetup, context]);
            }
          },
          onLanguageSwitched: {
            get() {
              return (oldLocale, newLocale) => Reflect.apply(g.onLanguageSwitched, g, [oldLocale, newLocale]);
            }
          },
          finalizePendingLocaleChange: {
            get() {
              return () => Reflect.apply(g.finalizePendingLocaleChange, g, []);
            }
          },
          waitForPendingLocaleChange: {
            get() {
              return () => Reflect.apply(g.waitForPendingLocaleChange, g, []);
            }
          }
        };
      },
      onExtendVueI18n(composer) {
        return {
          strategy: {
            get() {
              return composer.strategy;
            }
          },
          localeProperties: {
            get() {
              return composer.localeProperties.value;
            }
          },
          setLocale: {
            get() {
              return async (locale) => Reflect.apply(composer.setLocale, composer, [locale]);
            }
          },
          differentDomains: {
            get() {
              return composer.differentDomains;
            }
          },
          getBrowserLocale: {
            get() {
              return () => Reflect.apply(composer.getBrowserLocale, composer, []);
            }
          },
          getLocaleCookie: {
            get() {
              return () => Reflect.apply(composer.getLocaleCookie, composer, []);
            }
          },
          setLocaleCookie: {
            get() {
              return (locale) => Reflect.apply(composer.setLocaleCookie, composer, [locale]);
            }
          },
          onBeforeLanguageSwitch: {
            get() {
              return (oldLocale, newLocale, initialSetup, context) => Reflect.apply(composer.onBeforeLanguageSwitch, composer, [oldLocale, newLocale, initialSetup, context]);
            }
          },
          onLanguageSwitched: {
            get() {
              return (oldLocale, newLocale) => Reflect.apply(composer.onLanguageSwitched, composer, [oldLocale, newLocale]);
            }
          },
          finalizePendingLocaleChange: {
            get() {
              return () => Reflect.apply(composer.finalizePendingLocaleChange, composer, []);
            }
          },
          waitForPendingLocaleChange: {
            get() {
              return () => Reflect.apply(composer.waitForPendingLocaleChange, composer, []);
            }
          }
        };
      }
    }
  });
  const pluginOptions = {
    __composerExtend: (c) => {
      const g = getComposer(i18n);
      c.strategy = g.strategy;
      c.localeProperties = computed(() => g.localeProperties.value);
      c.setLocale = g.setLocale;
      c.differentDomains = g.differentDomains;
      c.getBrowserLocale = g.getBrowserLocale;
      c.getLocaleCookie = g.getLocaleCookie;
      c.setLocaleCookie = g.setLocaleCookie;
      c.onBeforeLanguageSwitch = g.onBeforeLanguageSwitch;
      c.onLanguageSwitched = g.onLanguageSwitched;
      c.finalizePendingLocaleChange = g.finalizePendingLocaleChange;
      c.waitForPendingLocaleChange = g.waitForPendingLocaleChange;
    }
  };
  app2.use(i18n, pluginOptions);
  inejctNuxtHelpers(nuxtContext, i18n);
  [__temp, __restore] = executeAsync(() => mergeAdditionalMessages(nuxtContext, i18n, initialLocale)), await __temp, __restore();
  addRouteMiddleware(
    "locale-changing",
    defineNuxtRouteMiddleware(async (to, from) => {
      let __temp2, __restore2;
      const locale = detectLocale(
        to,
        nuxt.ssrContext,
        getLocaleFromRoute,
        nuxtI18nOptions,
        () => {
          return getLocale(i18n) || getDefaultLocale(defaultLocale);
        },
        normalizedLocales,
        localeCodes,
        "normal"
      );
      const localeSetup = isInitialLocaleSetup(locale);
      const [modified] = ([__temp2, __restore2] = executeAsync(() => loadAndSetLocale(locale, nuxtContext, i18n, {
        useCookie,
        differentDomains,
        initial: localeSetup,
        skipSettingLocaleOnNavigate,
        lazy,
        langDir
      })), __temp2 = await __temp2, __restore2(), __temp2);
      if (modified && localeSetup) {
        notInitialSetup = false;
      }
      const redirectPath = detectRedirect(to, nuxtContext, locale, getLocaleFromRoute, nuxtI18nOptions);
      return navigate(
        {
          i18n,
          redirectPath,
          locale,
          route: to
        },
        {
          differentDomains,
          skipSettingLocaleOnNavigate,
          rootRedirect
        }
      );
    }),
    { global: true }
  );
});
async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data2 = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data2);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return (key) => {
    return key ? map[key] || key : map.missingValue;
  };
}
function createOperationsGenerator({ formatter, keyMap, joinWith = "/", valueMap } = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`;
  }
  if (keyMap && typeof keyMap !== "function") {
    keyMap = createMapper(keyMap);
  }
  const map = valueMap || {};
  Object.keys(map).forEach((valueKey) => {
    if (typeof map[valueKey] !== "function") {
      map[valueKey] = createMapper(map[valueKey]);
    }
  });
  return (modifiers = {}) => {
    const operations = Object.entries(modifiers).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      const mapper = map[key];
      if (typeof mapper === "function") {
        value = mapper(modifiers[key]);
      }
      key = typeof keyMap === "function" ? keyMap(key) : key;
      return formatter(key, value);
    });
    return operations.join(joinWith);
  };
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return parseInt(input, 10);
    }
  }
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage2 = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = (input, modifiers = {}, options = {}) => {
    return getImage2(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {})
    }).url;
  };
  for (const presetName in globalOptions.presets) {
    $img[presetName] = (source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options });
  }
  $img.options = globalOptions;
  $img.getImage = getImage2;
  $img.getMeta = (input, options) => getMeta(ctx, input, options);
  $img.getSizes = (input, options) => getSizes(ctx, input, options);
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  var _a2, _b2;
  if (typeof input !== "string" || input === "") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        input = joinURL(ctx.options.alias[base], input.substr(base.length));
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  _options.modifiers = { ..._options.modifiers };
  const expectedFormat = _options.modifiers.format;
  if ((_a2 = _options.modifiers) == null ? void 0 : _a2.width) {
    _options.modifiers.width = parseSize(_options.modifiers.width);
  }
  if ((_b2 = _options.modifiers) == null ? void 0 : _b2.height) {
    _options.modifiers.height = parseSize(_options.modifiers.height);
  }
  const image = provider.getImage(input, _options, ctx);
  image.format = image.format || expectedFormat || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  var _a2, _b2;
  const width = parseSize((_a2 = opts.modifiers) == null ? void 0 : _a2.width);
  const height = parseSize((_b2 = opts.modifiers) == null ? void 0 : _b2.height);
  const hwRatio = width && height ? height / width : 0;
  const variants = [];
  const sizes = {};
  if (typeof opts.sizes === "string") {
    for (const entry2 of opts.sizes.split(/[\s,]+/).filter((e) => e)) {
      const s = entry2.split(":");
      if (s.length !== 2) {
        continue;
      }
      sizes[s[0].trim()] = s[1].trim();
    }
  } else {
    Object.assign(sizes, opts.sizes);
  }
  for (const key in sizes) {
    const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || parseInt(key);
    let size = String(sizes[key]);
    const isFluid = size.endsWith("vw");
    if (!isFluid && /^\d+$/.test(size)) {
      size = size + "px";
    }
    if (!isFluid && !size.endsWith("px")) {
      continue;
    }
    let _cWidth = parseInt(size);
    if (!screenMaxWidth || !_cWidth) {
      continue;
    }
    if (isFluid) {
      _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
    }
    const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
    variants.push({
      width: _cWidth,
      size,
      screenMaxWidth,
      media: `(max-width: ${screenMaxWidth}px)`,
      src: ctx.$img(input, { ...opts.modifiers, width: _cWidth, height: _cHeight }, opts)
    });
  }
  variants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  const defaultVar = variants[variants.length - 1];
  if (defaultVar) {
    defaultVar.media = "";
  }
  return {
    sizes: variants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", "),
    srcset: variants.map((v) => `${v.src} ${v.width}w`).join(", "),
    src: defaultVar == null ? void 0 : defaultVar.src
  };
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    fit: "fit",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b"
  },
  joinWith: ",",
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val)
});
const getImage = (src, { modifiers = {}, baseURL: baseURL2 } = {}, _ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`;
    delete modifiers.width;
    delete modifiers.height;
  }
  const params = operationsGenerator(modifiers) || "_";
  if (!baseURL2) {
    baseURL2 = joinURL("/", "/_ipx");
  }
  return {
    url: joinURL(baseURL2, params, encodePath(src))
  };
};
const validateDomains = true;
const supportsAlias = true;
const ipxRuntime$s9wR6dSyNk = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getImage,
  validateDomains,
  supportsAlias
}, Symbol.toStringTag, { value: "Module" }));
const imageOptions = {
  "screens": {
    "xs": 320,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "xxl": 1536,
    "2xl": 1536
  },
  "presets": {},
  "provider": "ipx",
  "domains": [],
  "alias": {}
};
imageOptions.providers = {
  ["ipx"]: { provider: ipxRuntime$s9wR6dSyNk, defaults: {} }
};
const node_modules__64nuxt_image_edge_dist_runtime_plugin_mjs_OrkQhMqHci = defineNuxtPlugin(() => {
  const img = createImage(imageOptions);
  return {
    provide: {
      img
    }
  };
});
config.autoAddCss = false;
library.add(fas);
const plugins_fontawesome_js_klhsrycjcK = defineNuxtPlugin((nuxtApp) => {
});
const _plugins = [
  node_modules__64pinia_nuxt_dist_runtime_plugin_vue3_mjs_A0OWXRrUgq,
  _nuxt_components_plugin_mjs_KR1HBZs4kY,
  node_modules_nuxt_dist_head_runtime_lib_vueuse_head_plugin_mjs_D7WGfuP1A0,
  node_modules_nuxt_dist_pages_runtime_router_mjs_qNv5Ky2ZmB,
  node_modules__64nuxtjs_i18n_dist_runtime_plugins_composition_mjs_sLxaNGmlSL,
  node_modules__64nuxtjs_i18n_dist_runtime_plugins_i18n_mjs_yfWm7jX06p,
  node_modules__64nuxt_image_edge_dist_runtime_plugin_mjs_OrkQhMqHci,
  plugins_fontawesome_js_klhsrycjcK
];
const Fragment = defineComponent({
  setup(_props, { slots }) {
    return () => {
      var _a2;
      return (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const layouts = {
  custom: () => import('./_nuxt/custom.9526722f.mjs').then((m) => m.default || m),
  default: () => import('./_nuxt/default.572e8385.mjs').then((m) => m.default || m)
};
const LayoutLoader = defineComponent({
  props: {
    name: String,
    ...{}
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => {
      return h(LayoutComponent, {}, context.slots);
    };
  }
});
const __nuxt_component_0 = defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const injectedRoute = inject("_route");
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      var _a2, _b2;
      return (_b2 = (_a2 = unref(props.name)) != null ? _a2 : route.meta.layout) != null ? _b2 : "default";
    });
    return () => {
      var _a2;
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = (_a2 = route.meta.layoutTransition) != null ? _a2 : appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => _wrapIf(LayoutLoader, hasLayout && { key: layout.value, name: layout.value, hasTransition: void 0 }, context.slots).default()
      }).default();
    };
  }
});
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a2, _b2;
    return renderChild ? (_b2 = (_a2 = ctx.slots).default) == null ? void 0 : _b2.call(_a2) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
defineComponent({
  name: "NoScript",
  inheritAttrs: false,
  props: {
    ...globalProps,
    title: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a2;
    const noscript = { ...props };
    const textContent = (((_a2 = slots.default) == null ? void 0 : _a2.call(slots)) || []).filter(({ children }) => children).map(({ children }) => children).join("");
    if (textContent) {
      noscript.children = textContent;
    }
    return {
      noscript: [noscript]
    };
  })
});
defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup: setupForUseMeta((base) => ({
    base
  }))
});
defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a2, _b2, _c2;
    const title = ((_c2 = (_b2 = (_a2 = slots.default) == null ? void 0 : _a2.call(slots)) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.children) || null;
    return {
      title
    };
  })
});
defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props) => {
    const meta = { ...props };
    if (meta.httpEquiv) {
      meta["http-equiv"] = meta.httpEquiv;
      delete meta.httpEquiv;
    }
    return {
      meta: [meta]
    };
  })
});
defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    },
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a2, _b2, _c2;
    const style = { ...props };
    const textContent = (_c2 = (_b2 = (_a2 = slots.default) == null ? void 0 : _a2.call(slots)) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a2, _b2;
    return (_b2 = (_a2 = ctx.slots).default) == null ? void 0 : _b2.call(_a2);
  }
});
defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: {
    ...globalProps,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a2;
    return ((_a2 = route.params[r.slice(1)]) == null ? void 0 : _a2.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a2;
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a3;
    return ((_a3 = m.components) == null ? void 0 : _a3.default) === routeProps.Component.type;
  });
  const source = (_a2 = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a2 : matchedRoute && interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const __nuxt_component_2 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          var _a2, _b2, _c2, _d2;
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(props.pageKey, routeProps);
          const done = nuxtApp.deferHydration();
          const hasTransition = !!((_b2 = (_a2 = props.transition) != null ? _a2 : routeProps.route.meta.pageTransition) != null ? _b2 : appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          return _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              (_d2 = (_c2 = props.keepalive) != null ? _c2 : routeProps.route.meta.keepalive) != null ? _d2 : appKeepalive,
              h(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, { default: () => h(Component, { key, routeProps, pageKey: key, hasTransition }) })
            )
          ).default();
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const Component = defineComponent({
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h(props.routeProps.Component);
    };
  }
});
const data = [
  {
    id: 1,
    title: "trim dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "nike",
    collection: [
      "new products"
    ],
    category: "Women",
    price: 145,
    sale: true,
    discount: "40",
    stock: 5,
    "new": true,
    tags: [
      "new",
      "s",
      "m",
      "yellow",
      "white",
      "pink",
      "nike"
    ],
    variants: [
      {
        variant_id: 101,
        id: 1,
        sku: "sku1",
        size: "s",
        color: "yellow",
        image_id: 111
      },
      {
        variant_id: 102,
        id: 1,
        sku: "sku2",
        size: "s",
        color: "white",
        image_id: 112
      },
      {
        variant_id: 103,
        id: 1,
        sku: "sku3",
        size: "s",
        color: "pink",
        image_id: 113
      },
      {
        variant_id: 104,
        id: 1,
        sku: "sku4",
        size: "m",
        color: "yellow",
        image_id: 111
      },
      {
        variant_id: 105,
        id: 1,
        sku: "sku5",
        size: "m",
        color: "white",
        image_id: 112
      },
      {
        variant_id: 106,
        id: 1,
        sku: "sku5",
        size: "m",
        color: "pink",
        image_id: 113
      },
      {
        variant_id: 107,
        id: 1,
        sku: "sku1",
        size: "l",
        color: "yellow",
        image_id: 111
      }
    ],
    images: [
      {
        image_id: 111,
        id: 1,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          101,
          104
        ]
      },
      {
        image_id: 112,
        id: 1,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          102,
          105
        ]
      },
      {
        image_id: 113,
        id: 1,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          103,
          106
        ]
      }
    ]
  },
  {
    id: 2,
    title: "belted dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "zara",
    collection: [
      "best sellers"
    ],
    category: "Women",
    price: 185,
    sale: false,
    discount: "40",
    stock: 2,
    "new": false,
    tags: [
      "s",
      "m",
      "l",
      "olive",
      "navy",
      "red",
      "zara"
    ],
    variants: [
      {
        variant_id: 201,
        id: 2,
        sku: "sku1",
        size: "s",
        color: "olive",
        image_id: 211
      },
      {
        variant_id: 202,
        id: 2,
        sku: "sku2",
        size: "s",
        color: "navy",
        image_id: 212
      },
      {
        variant_id: 203,
        id: 2,
        sku: "sku3",
        size: "s",
        color: "red",
        image_id: 213
      },
      {
        variant_id: 204,
        id: 2,
        sku: "sku4",
        size: "m",
        color: "olive",
        image_id: 211
      },
      {
        variant_id: 205,
        id: 2,
        sku: "sku4",
        size: "m",
        color: "navy",
        image_id: 212
      },
      {
        variant_id: 206,
        id: 2,
        sku: "sku4",
        size: "m",
        color: "red",
        image_id: 213
      },
      {
        variant_id: 207,
        id: 2,
        sku: "sku4",
        size: "l",
        color: "olive",
        image_id: 211
      },
      {
        variant_id: 208,
        id: 2,
        sku: "sku4",
        size: "l",
        color: "navy",
        image_id: 212
      },
      {
        variant_id: 209,
        id: 2,
        sku: "sku4",
        size: "l",
        color: "red",
        image_id: 213
      }
    ],
    images: [
      {
        image_id: 211,
        id: 2,
        alt: "olive",
        src: "1.jpg",
        variant_id: [
          201,
          204,
          207
        ]
      },
      {
        image_id: 212,
        id: 2,
        alt: "navy",
        src: "1.jpg",
        variant_id: [
          202,
          205,
          208
        ]
      },
      {
        image_id: 213,
        id: 2,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          203,
          206,
          209
        ]
      },
      {
        image_id: 214,
        id: 2,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          201,
          204
        ]
      }
    ]
  },
  {
    id: 3,
    title: "fitted dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "denim",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 174,
    sale: false,
    discount: "40",
    stock: 0,
    "new": true,
    tags: [
      "denim",
      "l",
      "m",
      "white",
      "black"
    ],
    variants: [
      {
        variant_id: 301,
        id: 3,
        sku: "sku3",
        size: "l",
        color: "white",
        image_id: 311
      },
      {
        variant_id: 302,
        id: 3,
        sku: "skul3",
        size: "m",
        color: "white",
        image_id: 311
      },
      {
        variant_id: 303,
        id: 3,
        sku: "sku3l",
        size: "l",
        color: "black",
        image_id: 312
      },
      {
        variant_id: 304,
        id: 3,
        sku: "sku4m",
        size: "m",
        color: "black",
        image_id: 312
      }
    ],
    images: [
      {
        image_id: 311,
        id: 3,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          301,
          303
        ]
      },
      {
        image_id: 312,
        id: 1,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          302,
          304
        ]
      }
    ]
  },
  {
    id: 4,
    title: "belted top",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "madame",
    collection: [
      "new products",
      "on sale"
    ],
    category: "Women",
    price: 98,
    sale: false,
    discount: "50",
    stock: 10,
    "new": true,
    tags: [
      "s",
      "l",
      "white",
      "skyblue",
      "madame"
    ],
    variants: [
      {
        variant_id: 401,
        id: 4,
        sku: "sku4",
        size: "s",
        color: "white",
        image_id: 411
      },
      {
        variant_id: 402,
        id: 4,
        sku: "skul4",
        size: "l",
        color: "white",
        image_id: 411
      },
      {
        variant_id: 403,
        id: 4,
        sku: "sku4s",
        size: "s",
        color: "skyblue",
        image_id: 412
      },
      {
        variant_id: 404,
        id: 4,
        sku: "sku4l",
        size: "l",
        color: "skyblue",
        image_id: 412
      }
    ],
    images: [
      {
        image_id: 411,
        id: 4,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          401,
          402
        ]
      },
      {
        image_id: 412,
        id: 4,
        alt: "skyblue",
        src: "1.jpg",
        variant_id: [
          403,
          404
        ]
      }
    ]
  },
  {
    id: 5,
    title: "waist dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "biba",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 230,
    sale: true,
    discount: "20",
    stock: 4,
    "new": true,
    tags: [
      "m",
      "l",
      "green",
      "black",
      "biba"
    ],
    variants: [
      {
        variant_id: 501,
        id: 5,
        sku: "sku5",
        size: "m",
        color: "green",
        image_id: 511
      },
      {
        variant_id: 502,
        id: 5,
        sku: "skul5",
        size: "l",
        color: "green",
        image_id: 511
      },
      {
        variant_id: 503,
        id: 5,
        sku: "sku5s",
        size: "m",
        color: "black",
        image_id: 512
      },
      {
        variant_id: 504,
        id: 5,
        sku: "sku5l",
        size: "l",
        color: "black",
        image_id: 512
      }
    ],
    images: [
      {
        image_id: 511,
        id: 5,
        alt: "green",
        src: "1.jpg",
        variant_id: [
          501,
          503
        ]
      },
      {
        image_id: 512,
        id: 5,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          502,
          504
        ]
      }
    ]
  },
  {
    id: 6,
    title: "crop top",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "max",
    collection: [
      "best sellers"
    ],
    category: "Women",
    price: 121,
    sale: false,
    discount: "40",
    stock: 30,
    "new": true,
    tags: [
      "new",
      "s",
      "m",
      "olive",
      "gray",
      "red",
      "max"
    ],
    variants: [
      {
        variant_id: 601,
        id: 6,
        sku: "sku6",
        size: "s",
        color: "olive",
        image_id: 611
      },
      {
        variant_id: 602,
        id: 6,
        sku: "skul6",
        size: "s",
        color: "gray",
        image_id: 612
      },
      {
        variant_id: 603,
        id: 6,
        sku: "sku6s",
        size: "s",
        color: "red",
        image_id: 613
      },
      {
        variant_id: 604,
        id: 6,
        sku: "sku6l",
        size: "m",
        color: "olive",
        image_id: 611
      },
      {
        variant_id: 605,
        id: 6,
        sku: "sku6l",
        size: "m",
        color: "gray",
        image_id: 612
      },
      {
        variant_id: 606,
        id: 6,
        sku: "sku6l",
        size: "m",
        color: "red",
        image_id: 613
      }
    ],
    images: [
      {
        image_id: 611,
        id: 6,
        alt: "olive",
        src: "1.jpg",
        variant_id: [
          601,
          604
        ]
      },
      {
        image_id: 612,
        id: 6,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          602,
          605
        ]
      },
      {
        image_id: 613,
        id: 6,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          603,
          606
        ]
      }
    ]
  },
  {
    id: 7,
    title: "sleeveless dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "biba",
    collection: [
      "best sellers"
    ],
    category: "Women",
    price: 290,
    sale: true,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "s",
      "m",
      "pink",
      "white",
      "black",
      "biba"
    ],
    variants: [
      {
        variant_id: 701,
        id: 7,
        sku: "sku7",
        size: "s",
        color: "pink",
        image_id: 711
      },
      {
        variant_id: 702,
        id: 7,
        sku: "skul7",
        size: "s",
        color: "white",
        image_id: 712
      },
      {
        variant_id: 703,
        id: 7,
        sku: "sku7s",
        size: "s",
        color: "black",
        image_id: 713
      },
      {
        variant_id: 704,
        id: 7,
        sku: "sku7l",
        size: "m",
        color: "pink",
        image_id: 711
      },
      {
        variant_id: 705,
        id: 7,
        sku: "sku7l",
        size: "m",
        color: "white",
        image_id: 712
      },
      {
        variant_id: 706,
        id: 7,
        sku: "sku7l",
        size: "m",
        color: "black",
        image_id: 713
      }
    ],
    images: [
      {
        image_id: 711,
        id: 7,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          701,
          704
        ]
      },
      {
        image_id: 712,
        id: 7,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          702,
          705
        ]
      },
      {
        image_id: 713,
        id: 7,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          703,
          706
        ]
      }
    ]
  },
  {
    id: 8,
    title: "v-neck dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "zara",
    collection: [
      "new products"
    ],
    category: "Women",
    price: 315,
    sale: true,
    discount: "70",
    stock: 15,
    "new": false,
    tags: [
      "s",
      "m",
      "yellow",
      "black",
      "zara"
    ],
    variants: [
      {
        variant_id: 801,
        id: 8,
        sku: "sku8",
        size: "s",
        color: "yellow",
        image_id: 811
      },
      {
        variant_id: 802,
        id: 8,
        sku: "skul8",
        size: "s",
        color: "black",
        image_id: 812
      },
      {
        variant_id: 803,
        id: 8,
        sku: "sku8s",
        size: "m",
        color: "yellow",
        image_id: 811
      },
      {
        variant_id: 804,
        id: 8,
        sku: "sku8l",
        size: "m",
        color: "black",
        image_id: 812
      }
    ],
    images: [
      {
        image_id: 811,
        id: 8,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          801,
          804
        ]
      },
      {
        image_id: 812,
        id: 8,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          802,
          805
        ]
      }
    ]
  },
  {
    id: 9,
    title: "wrap dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "madame",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 115,
    sale: false,
    discount: "40",
    stock: 36,
    "new": false,
    tags: [
      "new",
      "m",
      "l",
      "black",
      "maroon",
      "madame"
    ],
    variants: [
      {
        variant_id: 901,
        id: 9,
        sku: "sku9",
        size: "m",
        color: "black",
        image_id: 911
      },
      {
        variant_id: 902,
        id: 9,
        sku: "skul9",
        size: "l",
        color: "black",
        image_id: 911
      },
      {
        variant_id: 903,
        id: 9,
        sku: "sku9s",
        size: "m",
        color: "maroon",
        image_id: 912
      },
      {
        variant_id: 904,
        id: 9,
        sku: "sku9l",
        size: "l",
        color: "maroon",
        image_id: 912
      }
    ],
    images: [
      {
        image_id: 911,
        id: 9,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          901,
          902
        ]
      },
      {
        image_id: 912,
        id: 9,
        alt: "maroon",
        src: "1.jpg",
        variant_id: [
          903,
          904
        ]
      }
    ]
  },
  {
    id: 10,
    title: "floral dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "nike",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 175,
    sale: false,
    discount: "10",
    stock: 1,
    "new": false,
    tags: [
      "m",
      "l",
      "black",
      "pink",
      "nike"
    ],
    variants: [
      {
        variant_id: 1001,
        id: 10,
        sku: "sku10",
        size: "m",
        color: "black",
        image_id: 1011
      },
      {
        variant_id: 1002,
        id: 10,
        sku: "skul10",
        size: "l",
        color: "black",
        image_id: 1011
      },
      {
        variant_id: 1003,
        id: 10,
        sku: "sku10s",
        size: "m",
        color: "pink",
        image_id: 1012
      },
      {
        variant_id: 1004,
        id: 10,
        sku: "sku10l",
        size: "l",
        color: "pink",
        image_id: 1012
      }
    ],
    images: [
      {
        image_id: 1011,
        id: 10,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          1001,
          1002
        ]
      },
      {
        image_id: 1012,
        id: 10,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          1003,
          1004
        ]
      }
    ]
  },
  {
    id: 11,
    title: "maxi dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "biba",
    collection: [
      "new products"
    ],
    category: "Women",
    price: 266,
    sale: false,
    discount: "40",
    stock: 0,
    "new": true,
    tags: [
      "new",
      "m",
      "l",
      "red",
      "black",
      "biba"
    ],
    variants: [
      {
        variant_id: 1101,
        id: 11,
        sku: "sku11",
        size: "m",
        color: "red",
        image_id: 1111
      },
      {
        variant_id: 1102,
        id: 11,
        sku: "skul11",
        size: "l",
        color: "black",
        image_id: 1112
      },
      {
        variant_id: 1103,
        id: 11,
        sku: "sku11s",
        size: "m",
        color: "red",
        image_id: 1111
      },
      {
        variant_id: 1104,
        id: 11,
        sku: "sku11l",
        size: "l",
        color: "black",
        image_id: 1112
      }
    ],
    images: [
      {
        image_id: 1111,
        id: 11,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          1101,
          1102
        ]
      },
      {
        image_id: 1112,
        id: 11,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          1103,
          1104
        ]
      }
    ]
  },
  {
    id: 12,
    title: "boho tops",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "nike",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "Women",
    price: 129,
    sale: false,
    discount: "40",
    stock: 45,
    "new": false,
    tags: [
      "xs",
      "s",
      "m",
      "red",
      "pink",
      "gray",
      "nike"
    ],
    variants: [
      {
        variant_id: 1201,
        id: 12,
        sku: "sku12",
        size: "xs",
        color: "red",
        image_id: 1211
      },
      {
        variant_id: 1202,
        id: 12,
        sku: "skul12",
        size: "xs",
        color: "pink",
        image_id: 1212
      },
      {
        variant_id: 1203,
        id: 12,
        sku: "sku12s",
        size: "xs",
        color: "gray",
        image_id: 1213
      },
      {
        variant_id: 1204,
        id: 12,
        sku: "sku12l",
        size: "s",
        color: "red",
        image_id: 1211
      },
      {
        variant_id: 1205,
        id: 12,
        sku: "sku12l",
        size: "s",
        color: "pink",
        image_id: 1212
      },
      {
        variant_id: 1206,
        id: 12,
        sku: "sku12l",
        size: "s",
        color: "gray",
        image_id: 1213
      },
      {
        variant_id: 1207,
        id: 12,
        sku: "sku12l",
        size: "m",
        color: "red",
        image_id: 1211
      },
      {
        variant_id: 1208,
        id: 12,
        sku: "sku12l",
        size: "m",
        color: "pink",
        image_id: 1212
      },
      {
        variant_id: 1209,
        id: 12,
        sku: "sku12l",
        size: "m",
        color: "gray",
        image_id: 1213
      }
    ],
    images: [
      {
        image_id: 1211,
        id: 12,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          1201,
          1204,
          1207
        ]
      },
      {
        image_id: 1212,
        id: 12,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          1202,
          1205,
          1208
        ]
      },
      {
        image_id: 1213,
        id: 12,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          1203,
          1206,
          1209
        ]
      }
    ]
  },
  {
    id: 13,
    title: "fit-flare dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "biba",
    collection: [
      "new products"
    ],
    category: "Women",
    price: 148,
    sale: false,
    discount: "10",
    stock: 7,
    "new": false,
    tags: [
      "xs",
      "s",
      "m",
      "gray",
      "black",
      "yellow",
      "biba"
    ],
    variants: [
      {
        variant_id: 1301,
        id: 13,
        sku: "sku13",
        size: "xs",
        color: "gray",
        image_id: 1311
      },
      {
        variant_id: 1302,
        id: 13,
        sku: "skul13",
        size: "xs",
        color: "black",
        image_id: 1312
      },
      {
        variant_id: 1303,
        id: 13,
        sku: "sku13s",
        size: "xs",
        color: "yellow",
        image_id: 1313
      },
      {
        variant_id: 1304,
        id: 13,
        sku: "sku13l",
        size: "s",
        color: "gray",
        image_id: 1311
      },
      {
        variant_id: 1305,
        id: 13,
        sku: "sku13l",
        size: "s",
        color: "black",
        image_id: 1312
      },
      {
        variant_id: 1306,
        id: 13,
        sku: "sku13l",
        size: "s",
        color: "yellow",
        image_id: 1313
      },
      {
        variant_id: 1307,
        id: 13,
        sku: "sku13l",
        size: "m",
        color: "gray",
        image_id: 1311
      },
      {
        variant_id: 1308,
        id: 13,
        sku: "sku13l",
        size: "m",
        color: "black",
        image_id: 1312
      },
      {
        variant_id: 1309,
        id: 13,
        sku: "sku13l",
        size: "m",
        color: "yellow",
        image_id: 1313
      }
    ],
    images: [
      {
        image_id: 1311,
        id: 13,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          1301,
          1304,
          1307
        ]
      },
      {
        image_id: 1312,
        id: 13,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          1302,
          1305,
          1308
        ]
      },
      {
        image_id: 1313,
        id: 13,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          1303,
          1306,
          1309
        ]
      }
    ]
  },
  {
    id: 14,
    title: "mini dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "max",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 285,
    sale: true,
    discount: "30",
    stock: 15,
    "new": true,
    tags: [
      "xs",
      "s",
      "pink",
      "gray",
      "yellow",
      "max"
    ],
    variants: [
      {
        variant_id: 1401,
        id: 14,
        sku: "sku14",
        size: "xs",
        color: "pink",
        image_id: 1411
      },
      {
        variant_id: 1402,
        id: 14,
        sku: "skul14",
        size: "xs",
        color: "gray",
        image_id: 1412
      },
      {
        variant_id: 1403,
        id: 14,
        sku: "sku14s",
        size: "xs",
        color: "yellow",
        image_id: 1413
      },
      {
        variant_id: 1404,
        id: 14,
        sku: "sku14l",
        size: "s",
        color: "pink",
        image_id: 1411
      },
      {
        variant_id: 1405,
        id: 14,
        sku: "sku14l",
        size: "s",
        color: "gray",
        image_id: 1412
      },
      {
        variant_id: 1406,
        id: 14,
        sku: "sku14l",
        size: "s",
        color: "yellow",
        image_id: 1413
      }
    ],
    images: [
      {
        image_id: 1411,
        id: 14,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          1401,
          1404
        ]
      },
      {
        image_id: 1412,
        id: 14,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          1402,
          1405
        ]
      },
      {
        image_id: 1413,
        id: 14,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          1403,
          1406
        ]
      }
    ]
  },
  {
    id: 15,
    title: "jumpsuit",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "zara",
    collection: [
      "best sellers"
    ],
    category: "Women",
    price: 375,
    sale: true,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "xs",
      "l",
      "blue",
      "skyblue",
      "zara"
    ],
    variants: [
      {
        variant_id: 1501,
        id: 15,
        sku: "sku15",
        size: "xs",
        color: "blue",
        image_id: 1511
      },
      {
        variant_id: 1502,
        id: 15,
        sku: "skul15",
        size: "xs",
        color: "skyblue",
        image_id: 1512
      },
      {
        variant_id: 1503,
        id: 15,
        sku: "sku15s",
        size: "l",
        color: "blue",
        image_id: 1511
      },
      {
        variant_id: 1504,
        id: 15,
        sku: "sku15l",
        size: "l",
        color: "skyblue",
        image_id: 1512
      }
    ],
    images: [
      {
        image_id: 1511,
        id: 15,
        alt: "blue",
        src: "1.jpg",
        variant_id: [
          1501,
          1503
        ]
      },
      {
        image_id: 1512,
        id: 15,
        alt: "skyblue",
        src: "1.jpg",
        variant_id: [
          1502,
          1504
        ]
      }
    ]
  },
  {
    id: 16,
    title: "pink tunic dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "nike",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 199,
    sale: false,
    discount: "40",
    stock: 30,
    "new": false,
    tags: [
      "new",
      "xs",
      "m",
      "pink",
      "black",
      "blue",
      "nike"
    ],
    variants: [
      {
        variant_id: 1601,
        id: 16,
        sku: "sku16",
        size: "xs",
        color: "pink",
        image_id: 1611
      },
      {
        variant_id: 1602,
        id: 16,
        sku: "skul16",
        size: "xs",
        color: "black",
        image_id: 1612
      },
      {
        variant_id: 1603,
        id: 16,
        sku: "sku16s",
        size: "xs",
        color: "blue",
        image_id: 1613
      },
      {
        variant_id: 1604,
        id: 16,
        sku: "sku16l",
        size: "m",
        color: "pink",
        image_id: 1611
      },
      {
        variant_id: 1605,
        id: 16,
        sku: "sku16l",
        size: "m",
        color: "black",
        image_id: 1612
      },
      {
        variant_id: 1606,
        id: 16,
        sku: "sku16l",
        size: "m",
        color: "blue",
        image_id: 1613
      }
    ],
    images: [
      {
        image_id: 1611,
        id: 16,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          1601,
          1604
        ]
      },
      {
        image_id: 1612,
        id: 16,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          1602,
          1605
        ]
      },
      {
        image_id: 1613,
        id: 16,
        alt: "blue",
        src: "1.jpg",
        variant_id: [
          1603,
          1606
        ]
      }
    ]
  },
  {
    id: 17,
    title: "midi dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "nike",
    collection: [
      "new products"
    ],
    category: "Women",
    price: 400,
    sale: true,
    discount: "40",
    stock: 0,
    "new": true,
    tags: [
      "m",
      "pink",
      "maroon",
      "red",
      "nike"
    ],
    variants: [
      {
        variant_id: 1701,
        id: 17,
        sku: "sku17",
        size: "m",
        color: "pink",
        image_id: 1711
      },
      {
        variant_id: 1702,
        id: 17,
        sku: "skul17",
        size: "m",
        color: "maroon",
        image_id: 1712
      },
      {
        variant_id: 1703,
        id: 17,
        sku: "sku17s",
        size: "m",
        color: "red",
        image_id: 1713
      }
    ],
    images: [
      {
        image_id: 1711,
        id: 17,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          1701
        ]
      },
      {
        image_id: 1712,
        id: 17,
        alt: "maroon",
        src: "1.jpg",
        variant_id: [
          1702
        ]
      },
      {
        image_id: 1713,
        id: 17,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          1703
        ]
      }
    ]
  },
  {
    id: 18,
    title: "tulip dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "biba",
    collection: [
      "new products"
    ],
    category: "Women",
    price: 145,
    sale: false,
    discount: "10",
    stock: 3,
    "new": false,
    tags: [
      "xs",
      "m",
      "black",
      "orange",
      "biba"
    ],
    variants: [
      {
        variant_id: 1801,
        id: 18,
        sku: "sku18",
        size: "xs",
        color: "black",
        image_id: 1811
      },
      {
        variant_id: 1802,
        id: 18,
        sku: "skul18",
        size: "xs",
        color: "orange",
        image_id: 1812
      },
      {
        variant_id: 1804,
        id: 18,
        sku: "sku18l",
        size: "m",
        color: "black",
        image_id: 1811
      },
      {
        variant_id: 1805,
        id: 18,
        sku: "sku18l",
        size: "m",
        color: "orange",
        image_id: 1812
      }
    ],
    images: [
      {
        image_id: 1811,
        id: 18,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          1801,
          1803
        ]
      },
      {
        image_id: 1812,
        id: 18,
        alt: "orange",
        src: "1.jpg",
        variant_id: [
          1802,
          1804
        ]
      }
    ]
  },
  {
    id: 19,
    title: "skater dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "max",
    collection: [
      "new products"
    ],
    category: "Women",
    price: 210,
    sale: false,
    discount: "40",
    stock: 10,
    "new": true,
    tags: [
      "new",
      "s",
      "m",
      "blue",
      "gray",
      "max"
    ],
    variants: [
      {
        variant_id: 1901,
        id: 19,
        sku: "sku19",
        size: "s",
        color: "blue",
        image_id: 1911
      },
      {
        variant_id: 1902,
        id: 19,
        sku: "skul19",
        size: "s",
        color: "gray",
        image_id: 1912
      },
      {
        variant_id: 1904,
        id: 19,
        sku: "sku19l",
        size: "m",
        color: "blue",
        image_id: 1911
      },
      {
        variant_id: 1905,
        id: 19,
        sku: "sku19l",
        size: "m",
        color: "gray",
        image_id: 1912
      }
    ],
    images: [
      {
        image_id: 1911,
        id: 19,
        alt: "blue",
        src: "1.jpg",
        variant_id: [
          1901,
          1903
        ]
      },
      {
        image_id: 1912,
        id: 19,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          1902,
          1904
        ]
      }
    ]
  },
  {
    id: 20,
    title: "skater top",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "biba",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 140,
    sale: false,
    discount: "40",
    stock: 1,
    "new": false,
    tags: [
      "s",
      "m",
      "yellow",
      "pink",
      "biba"
    ],
    variants: [
      {
        variant_id: 2001,
        id: 20,
        sku: "sku20",
        size: "s",
        color: "yellow",
        image_id: 2011
      },
      {
        variant_id: 2002,
        id: 20,
        sku: "skul20",
        size: "s",
        color: "pink",
        image_id: 2012
      },
      {
        variant_id: 2004,
        id: 20,
        sku: "sku20l",
        size: "m",
        color: "yellow",
        image_id: 2011
      },
      {
        variant_id: 2005,
        id: 20,
        sku: "sku20l",
        size: "m",
        color: "pink",
        image_id: 2012
      }
    ],
    images: [
      {
        image_id: 2011,
        id: 20,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          2001,
          2003
        ]
      },
      {
        image_id: 2012,
        id: 20,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          2002,
          2004
        ]
      }
    ]
  },
  {
    id: 21,
    title: "skater dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "madame",
    collection: [
      "best sellers"
    ],
    category: "Women",
    price: 230,
    sale: true,
    discount: "30",
    stock: 5,
    "new": false,
    tags: [
      "s",
      "m",
      "blue",
      "gray",
      "madame"
    ],
    variants: [
      {
        variant_id: 2101,
        id: 21,
        sku: "sku21",
        size: "s",
        color: "blue",
        image_id: 2111
      },
      {
        variant_id: 2102,
        id: 21,
        sku: "skul21",
        size: "s",
        color: "gray",
        image_id: 2112
      },
      {
        variant_id: 2103,
        id: 21,
        sku: "sku21l",
        size: "m",
        color: "blue",
        image_id: 2111
      },
      {
        variant_id: 2104,
        id: 21,
        sku: "sku21l",
        size: "m",
        color: "gray",
        image_id: 2112
      }
    ],
    images: [
      {
        image_id: 2111,
        id: 21,
        alt: "blue",
        src: "1.jpg",
        variant_id: [
          2101,
          2103
        ]
      },
      {
        image_id: 2112,
        id: 21,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          2102,
          2104
        ]
      }
    ]
  },
  {
    id: 22,
    title: "bodycon dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "max",
    collection: [
      "best sellers"
    ],
    category: "Women",
    price: 180,
    sale: false,
    discount: "15",
    stock: 26,
    "new": false,
    tags: [
      "xs",
      "m",
      "yellow",
      "black",
      "green",
      "max"
    ],
    variants: [
      {
        variant_id: 2201,
        id: 22,
        sku: "sku22",
        size: "xs",
        color: "yellow",
        image_id: 2211
      },
      {
        variant_id: 2202,
        id: 22,
        sku: "skul22",
        size: "xs",
        color: "black",
        image_id: 2212
      },
      {
        variant_id: 2203,
        id: 22,
        sku: "sku22s",
        size: "xs",
        color: "green",
        image_id: 2213
      },
      {
        variant_id: 2204,
        id: 22,
        sku: "sku22l",
        size: "m",
        color: "yellow",
        image_id: 2211
      },
      {
        variant_id: 2205,
        id: 22,
        sku: "sku22l",
        size: "m",
        color: "black",
        image_id: 2212
      },
      {
        variant_id: 2206,
        id: 22,
        sku: "sku22l",
        size: "m",
        color: "green",
        image_id: 2213
      }
    ],
    images: [
      {
        image_id: 2211,
        id: 22,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          2201,
          2204
        ]
      },
      {
        image_id: 2212,
        id: 22,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          2202,
          2205
        ]
      },
      {
        image_id: 2213,
        id: 22,
        alt: "green",
        src: "1.jpg",
        variant_id: [
          2203,
          2206
        ]
      }
    ]
  },
  {
    id: 23,
    title: "off shoulder dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "max",
    collection: [
      "best sellers"
    ],
    category: "Women",
    price: 240,
    sale: false,
    discount: "40",
    stock: 40,
    "new": false,
    tags: [
      "m",
      "pink",
      "black",
      "gray",
      "max"
    ],
    variants: [
      {
        variant_id: 2301,
        id: 23,
        sku: "sku23",
        size: "m",
        color: "pink",
        image_id: 2311
      },
      {
        variant_id: 2302,
        id: 23,
        sku: "skul23",
        size: "m",
        color: "black",
        image_id: 2312
      },
      {
        variant_id: 2303,
        id: 23,
        sku: "sku23s",
        size: "m",
        color: "gray",
        image_id: 2313
      }
    ],
    images: [
      {
        image_id: 2311,
        id: 23,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          2301
        ]
      },
      {
        image_id: 2312,
        id: 23,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          2302
        ]
      },
      {
        image_id: 2313,
        id: 23,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          2303
        ]
      }
    ]
  },
  {
    id: 24,
    title: "black short dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "denim",
    collection: [
      "featured products"
    ],
    category: "Women",
    price: 160,
    sale: false,
    discount: "40",
    stock: 0,
    "new": true,
    tags: [
      "s",
      "black",
      "white",
      "pink",
      "denim"
    ],
    variants: [
      {
        variant_id: 2401,
        id: 24,
        sku: "sku24",
        size: "s",
        color: "black",
        image_id: 2411
      },
      {
        variant_id: 2402,
        id: 24,
        sku: "skul24",
        size: "s",
        color: "white",
        image_id: 2412
      },
      {
        variant_id: 2403,
        id: 24,
        sku: "sku24s",
        size: "s",
        color: "pink",
        image_id: 2413
      }
    ],
    images: [
      {
        image_id: 2411,
        id: 24,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          2401
        ]
      },
      {
        image_id: 2412,
        id: 24,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          2402
        ]
      },
      {
        image_id: 2413,
        id: 24,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          2403
        ]
      }
    ]
  },
  {
    id: 25,
    title: "knee length dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "biba",
    collection: [
      "on sale"
    ],
    category: "Women",
    price: 260,
    sale: true,
    discount: "10",
    stock: 14,
    "new": true,
    tags: [
      "s",
      "m",
      "pink",
      "blue",
      "biba"
    ],
    variants: [
      {
        variant_id: 2501,
        id: 25,
        sku: "sku25",
        size: "s",
        color: "pink",
        image_id: 2511
      },
      {
        variant_id: 2502,
        id: 25,
        sku: "skul25",
        size: "s",
        color: "blue",
        image_id: 2512
      },
      {
        variant_id: 2503,
        id: 25,
        sku: "sku25l",
        size: "m",
        color: "pink",
        image_id: 2511
      },
      {
        variant_id: 2504,
        id: 25,
        sku: "sku25l",
        size: "m",
        color: "blue",
        image_id: 2512
      }
    ],
    images: [
      {
        image_id: 2511,
        id: 25,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          2501,
          2503
        ]
      },
      {
        image_id: 2512,
        id: 25,
        alt: "blue",
        src: "1.jpg",
        variant_id: [
          2502,
          2504
        ]
      }
    ]
  },
  {
    id: 26,
    title: "flutter dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "zara",
    collection: [
      "on sale"
    ],
    category: "Women",
    price: 330,
    sale: true,
    discount: "40",
    stock: 26,
    "new": true,
    tags: [
      "new",
      "xs",
      "m",
      "black",
      "gray",
      "zara"
    ],
    variants: [
      {
        variant_id: 2601,
        id: 26,
        sku: "sku26",
        size: "xs",
        color: "black",
        image_id: 2611
      },
      {
        variant_id: 2602,
        id: 26,
        sku: "skul26",
        size: "xs",
        color: "gray",
        image_id: 2612
      },
      {
        variant_id: 2603,
        id: 26,
        sku: "sku26l",
        size: "m",
        color: "black",
        image_id: 2611
      },
      {
        variant_id: 2604,
        id: 26,
        sku: "sku26l",
        size: "m",
        color: "gray",
        image_id: 2612
      }
    ],
    images: [
      {
        image_id: 2611,
        id: 26,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          2601,
          2603
        ]
      },
      {
        image_id: 2612,
        id: 26,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          2602,
          2604
        ]
      }
    ]
  },
  {
    id: 27,
    title: "choker neck dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "max",
    collection: [
      "on sale"
    ],
    category: "Women",
    price: 410,
    sale: true,
    discount: "30",
    stock: 20,
    "new": true,
    tags: [
      "xs",
      "m",
      "skyblue",
      "yellow",
      "max"
    ],
    variants: [
      {
        variant_id: 2701,
        id: 27,
        sku: "sku27",
        size: "xs",
        color: "skyblue",
        image_id: 2711
      },
      {
        variant_id: 2702,
        id: 27,
        sku: "skul27",
        size: "xs",
        color: "yellow",
        image_id: 2712
      },
      {
        variant_id: 2703,
        id: 27,
        sku: "sku27l",
        size: "m",
        color: "skyblue",
        image_id: 2711
      },
      {
        variant_id: 2704,
        id: 27,
        sku: "sku27l",
        size: "m",
        color: "yellow",
        image_id: 2712
      }
    ],
    images: [
      {
        image_id: 2711,
        id: 27,
        alt: "skyblue",
        src: "1.jpg",
        variant_id: [
          2701,
          2703
        ]
      },
      {
        image_id: 2712,
        id: 27,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          2702,
          2704
        ]
      }
    ]
  },
  {
    id: 28,
    title: "layered dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "zara",
    collection: [
      "on sale"
    ],
    category: "Women",
    price: 75,
    sale: false,
    discount: "40",
    stock: 15,
    "new": false,
    tags: [
      "new",
      "xs",
      "maroon",
      "pink",
      "zara"
    ],
    variants: [
      {
        variant_id: 2801,
        id: 28,
        sku: "sku28",
        size: "xs",
        color: "maroon",
        image_id: 2811
      },
      {
        variant_id: 2802,
        id: 28,
        sku: "skul28",
        size: "xs",
        color: "pink",
        image_id: 2812
      }
    ],
    images: [
      {
        image_id: 2811,
        id: 28,
        alt: "maroon",
        src: "1.jpg",
        variant_id: [
          2801
        ]
      },
      {
        image_id: 2812,
        id: 28,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          2802
        ]
      }
    ]
  },
  {
    id: 29,
    title: "choker neck top",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "denim",
    collection: [
      "on sale"
    ],
    category: "Women",
    price: 155,
    sale: false,
    discount: "40",
    stock: 3,
    "new": false,
    tags: [
      "m",
      "gray",
      "green",
      "denim"
    ],
    variants: [
      {
        variant_id: 2901,
        id: 29,
        sku: "sku29",
        size: "m",
        color: "gray",
        image_id: 2911
      },
      {
        variant_id: 2902,
        id: 29,
        sku: "skul29",
        size: "m",
        color: "green",
        image_id: 2912
      }
    ],
    images: [
      {
        image_id: 2911,
        id: 29,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          2901
        ]
      },
      {
        image_id: 2912,
        id: 29,
        alt: "green",
        src: "1.jpg",
        variant_id: [
          2902
        ]
      }
    ]
  },
  {
    id: 30,
    title: "rolled sleeve top",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "fashion",
    brand: "zara",
    collection: [
      "on sale"
    ],
    category: "Women",
    price: 289,
    sale: true,
    discount: "32",
    stock: 2,
    "new": true,
    tags: [
      "m",
      "pink",
      "red",
      "zara"
    ],
    variants: [
      {
        variant_id: 3001,
        id: 30,
        sku: "sku30",
        size: "m",
        color: "pink",
        image_id: 3011
      },
      {
        variant_id: 3002,
        id: 30,
        sku: "skul30",
        size: "m",
        color: "red",
        image_id: 3012
      }
    ],
    images: [
      {
        image_id: 3011,
        id: 30,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          3001
        ]
      },
      {
        image_id: 3012,
        id: 30,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          3002
        ]
      }
    ]
  },
  {
    id: 31,
    title: "pink babysuit",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "babyhug",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "kids",
    price: 75,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "pink",
      "red",
      "babyhug"
    ],
    variants: [
      {
        variant_id: 3101,
        id: 31,
        sku: "sku31",
        size: "m",
        color: "pink",
        image_id: 3111
      },
      {
        variant_id: 3102,
        id: 31,
        sku: "skul31",
        size: "m",
        color: "red",
        image_id: 3112
      }
    ],
    images: [
      {
        image_id: 3111,
        id: 31,
        alt: "pink",
        src: "3.jpg",
        variant_id: [
          3101
        ]
      },
      {
        image_id: 3112,
        id: 31,
        alt: "red",
        src: "3.jpg",
        variant_id: [
          3102
        ]
      }
    ]
  },
  {
    id: 32,
    title: "Skykidz Phone",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "babyoye",
    collection: [
      "best sellers",
      "featured products"
    ],
    category: "kids",
    price: 145,
    sale: false,
    discount: "40",
    stock: 45,
    "new": true,
    tags: [
      "babyoye",
      "lawngreen",
      "red"
    ],
    variants: [
      {
        variant_id: 3201,
        id: 32,
        sku: "sku32",
        size: "m",
        color: "lawngreen",
        image_id: 3211
      },
      {
        variant_id: 3202,
        id: 32,
        sku: "skul32",
        size: "m",
        color: "red",
        image_id: 3212
      },
      {
        variant_id: 3203,
        id: 32,
        sku: "skul32",
        size: "l",
        color: "lawngreen",
        image_id: 3211
      },
      {
        variant_id: 3204,
        id: 32,
        sku: "skul32",
        size: "l",
        color: "red",
        image_id: 3212
      }
    ],
    images: [
      {
        image_id: 3211,
        id: 32,
        alt: "lawngreen",
        src: "3.jpg",
        variant_id: [
          3201
        ]
      },
      {
        image_id: 3212,
        id: 32,
        alt: "red",
        src: "3.jpg",
        variant_id: [
          3202
        ]
      }
    ]
  },
  {
    id: 33,
    title: "Tomy Cowboy",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "babyoye",
    collection: [
      "on sale",
      "featured products"
    ],
    category: "kids",
    price: 200,
    sale: true,
    discount: "10",
    stock: 0,
    "new": true,
    tags: [
      "new",
      "babyoye",
      "yellow",
      "green",
      "skyblue"
    ],
    variants: [
      {
        variant_id: 3301,
        id: 33,
        sku: "sku33",
        size: "m",
        color: "yellow",
        image_id: 3311
      },
      {
        variant_id: 3302,
        id: 33,
        sku: "skul33",
        size: "m",
        color: "green",
        image_id: 3312
      },
      {
        variant_id: 3303,
        id: 33,
        sku: "skul33",
        size: "m",
        color: "skyblue",
        image_id: 3313
      },
      {
        variant_id: 3304,
        id: 33,
        sku: "skul33",
        size: "l",
        color: "yellow",
        image_id: 3311
      },
      {
        variant_id: 3305,
        id: 33,
        sku: "skul33",
        size: "l",
        color: "green",
        image_id: 3312
      },
      {
        variant_id: 3306,
        id: 33,
        sku: "skul33",
        size: "l",
        color: "skyblue",
        image_id: 3313
      }
    ],
    images: [
      {
        image_id: 3311,
        id: 33,
        alt: "yellow",
        src: "3.jpg",
        variant_id: [
          3301,
          3304
        ]
      },
      {
        image_id: 3312,
        id: 33,
        alt: "green",
        src: "3.jpg",
        variant_id: [
          3302,
          3305
        ]
      },
      {
        image_id: 3313,
        id: 33,
        alt: "skyblue",
        src: "3.jpg",
        variant_id: [
          3303,
          3306
        ]
      }
    ]
  },
  {
    id: 34,
    title: "Dumbo Soft Toy",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "mark&mia",
    collection: [
      "best sellers",
      "new arrival",
      "featured products"
    ],
    category: "kids",
    price: 160,
    sale: true,
    discount: "20",
    stock: 2,
    "new": true,
    tags: [
      "mark&mia",
      "crimson",
      "yellow",
      "skyblue"
    ],
    variants: [
      {
        variant_id: 3401,
        id: 34,
        sku: "sku34",
        size: "m",
        color: "crimson",
        image_id: 3411
      },
      {
        variant_id: 3402,
        id: 34,
        sku: "skul34",
        size: "m",
        color: "yellow",
        image_id: 3412
      },
      {
        variant_id: 3403,
        id: 34,
        sku: "skul34",
        size: "m",
        color: "skyblue",
        image_id: 3413
      },
      {
        variant_id: 3404,
        id: 34,
        sku: "skul34",
        size: "l",
        color: "crimson",
        image_id: 3411
      },
      {
        variant_id: 3405,
        id: 34,
        sku: "skul34",
        size: "l",
        color: "yellow",
        image_id: 3412
      },
      {
        variant_id: 3406,
        id: 34,
        sku: "skul34",
        size: "l",
        color: "skyblue",
        image_id: 3413
      }
    ],
    images: [
      {
        image_id: 3411,
        id: 34,
        alt: "crimson",
        src: "3.jpg",
        variant_id: [
          3401,
          3404
        ]
      },
      {
        image_id: 3412,
        id: 34,
        alt: "yellow",
        src: "3.jpg",
        variant_id: [
          3402,
          3405
        ]
      },
      {
        image_id: 3413,
        id: 34,
        alt: "skyblue",
        src: "3.jpg",
        variant_id: [
          3403,
          3406
        ]
      }
    ]
  },
  {
    id: 35,
    title: "kitty red",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "toffyhouse",
    collection: [
      "on sale",
      "new arrival",
      "featured products"
    ],
    category: "kids",
    price: 300,
    sale: true,
    discount: "40",
    stock: 5,
    "new": true,
    tags: [
      "new",
      "toffyhouse",
      "blue",
      "hotpink"
    ],
    variants: [
      {
        variant_id: 3501,
        id: 35,
        sku: "sku35",
        size: "m",
        color: "blue",
        image_id: 3511
      },
      {
        variant_id: 3502,
        id: 35,
        sku: "skul35",
        size: "m",
        color: "hotpink",
        image_id: 3512
      },
      {
        variant_id: 3503,
        id: 35,
        sku: "skul35",
        size: "l",
        color: "blue",
        image_id: 3511
      },
      {
        variant_id: 3504,
        id: 35,
        sku: "skul35",
        size: "l",
        color: "hotpink",
        image_id: 3512
      }
    ],
    images: [
      {
        image_id: 3511,
        id: 35,
        alt: "blue",
        src: "3.jpg",
        variant_id: [
          3501,
          3503
        ]
      },
      {
        image_id: 3512,
        id: 35,
        alt: "hotpink",
        src: "3.jpg",
        variant_id: [
          3502,
          3504
        ]
      }
    ]
  },
  {
    id: 36,
    title: "musical box",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "cucumber",
    collection: [
      "on sale",
      "featured products",
      "new arrival"
    ],
    category: "kids",
    price: 170,
    sale: false,
    discount: "52",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "cucumber",
      "green",
      "purple"
    ],
    variants: [
      {
        variant_id: 3601,
        id: 36,
        sku: "sku36",
        size: "xs",
        color: "green",
        image_id: 3611
      },
      {
        variant_id: 3602,
        id: 36,
        sku: "skul36",
        size: "xs",
        color: "purple",
        image_id: 3612
      }
    ],
    images: [
      {
        image_id: 3611,
        id: 36,
        alt: "green",
        src: "3.jpg",
        variant_id: [
          3601,
          3603
        ]
      },
      {
        image_id: 3612,
        id: 36,
        alt: "purple",
        src: "3.jpg",
        variant_id: [
          3602,
          3604
        ]
      }
    ]
  },
  {
    id: 37,
    title: "flash drum sticks",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "toffyhouse",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "kids",
    price: 180,
    sale: true,
    discount: "46",
    stock: 5,
    "new": true,
    tags: [
      "toffyhouse",
      "darkturquoise",
      "coral"
    ],
    variants: [
      {
        variant_id: 3701,
        id: 37,
        sku: "sku37",
        size: "m",
        color: "darkturquoise",
        image_id: 3711
      },
      {
        variant_id: 3702,
        id: 37,
        sku: "skul37",
        size: "m",
        color: "coral",
        image_id: 3712
      },
      {
        variant_id: 3703,
        id: 37,
        sku: "skul37",
        size: "l",
        color: "darkturquoise",
        image_id: 3711
      },
      {
        variant_id: 3704,
        id: 37,
        sku: "skul37",
        size: "l",
        color: "coral",
        image_id: 3712
      }
    ],
    images: [
      {
        image_id: 3711,
        id: 37,
        alt: "darkturquoise",
        src: "3.jpg",
        variant_id: [
          3701,
          3703
        ]
      },
      {
        image_id: 3712,
        id: 37,
        alt: "coral",
        src: "3.jpg",
        variant_id: [
          3702,
          3704
        ]
      }
    ]
  },
  {
    id: 38,
    title: "Fidget Spinner",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "Barbie",
    collection: [
      "on sale",
      "new arrival",
      "featured products"
    ],
    category: "kids",
    price: 290,
    sale: true,
    discount: "80",
    stock: 15,
    "new": true,
    tags: [
      "Barbie",
      "coral",
      "yellowgreen"
    ],
    variants: [
      {
        variant_id: 3701,
        id: 37,
        sku: "sku37",
        size: "m",
        color: "coral",
        image_id: 3711
      },
      {
        variant_id: 3702,
        id: 37,
        sku: "skul37",
        size: "m",
        color: "yellowgreen",
        image_id: 3712
      },
      {
        variant_id: 3703,
        id: 37,
        sku: "skul37",
        size: "l",
        color: "coral",
        image_id: 3711
      },
      {
        variant_id: 3704,
        id: 37,
        sku: "skul37",
        size: "l",
        color: "yellowgreen",
        image_id: 3712
      }
    ],
    images: [
      {
        image_id: 3711,
        id: 37,
        alt: "coral",
        src: "3.jpg",
        variant_id: [
          3701,
          3703
        ]
      },
      {
        image_id: 3712,
        id: 37,
        alt: "yellowgreen",
        src: "3.jpg",
        variant_id: [
          3702,
          3704
        ]
      }
    ]
  },
  {
    id: 39,
    title: "motor bike",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "toffyhouse",
    collection: [
      "best sellers"
    ],
    category: "kids",
    price: 300,
    sale: true,
    discount: "60",
    stock: 9,
    "new": true,
    tags: [
      "toffyhouse",
      "new",
      "pink",
      "green",
      "skyblue"
    ],
    variants: [
      {
        variant_id: 3901,
        id: 39,
        sku: "sku39",
        size: "m",
        color: "pink",
        image_id: 3911
      },
      {
        variant_id: 3902,
        id: 39,
        sku: "skumg39",
        size: "m",
        color: "green",
        image_id: 3912
      },
      {
        variant_id: 3903,
        id: 39,
        sku: "skums39",
        size: "m",
        color: "skyblue",
        image_id: 3913
      },
      {
        variant_id: 3904,
        id: 39,
        sku: "skusp39",
        size: "s",
        color: "pink",
        image_id: 3911
      },
      {
        variant_id: 3905,
        id: 39,
        sku: "skusg39",
        size: "s",
        color: "green",
        image_id: 3912
      },
      {
        variant_id: 3906,
        id: 39,
        sku: "skusb39",
        size: "s",
        color: "skyblue",
        image_id: 3913
      }
    ],
    images: [
      {
        image_id: 3911,
        id: 39,
        alt: "pink",
        src: "3.jpg",
        variant_id: [
          3901,
          3904
        ]
      },
      {
        image_id: 3912,
        id: 39,
        alt: "green",
        src: "3.jpg",
        variant_id: [
          3902,
          3905
        ]
      },
      {
        image_id: 3913,
        id: 39,
        alt: "skyblue",
        src: "3.jpg",
        variant_id: [
          3903,
          3906
        ]
      }
    ]
  },
  {
    id: 40,
    title: "Truck Wind Toy",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "babyoye",
    collection: [
      "on sale"
    ],
    category: "kids",
    price: 155,
    sale: false,
    discount: "40",
    stock: 60,
    "new": true,
    tags: [
      "babyoye",
      "hotpink",
      "skyblue"
    ],
    variants: [
      {
        variant_id: 4001,
        id: 40,
        sku: "sku40",
        size: "m",
        color: "hotpink",
        image_id: 4011
      },
      {
        variant_id: 4002,
        id: 40,
        sku: "skumg40",
        size: "m",
        color: "skyblue",
        image_id: 4012
      },
      {
        variant_id: 4003,
        id: 40,
        sku: "skums40",
        size: "s",
        color: "hotpink",
        image_id: 4011
      },
      {
        variant_id: 4004,
        id: 40,
        sku: "skusp40",
        size: "s",
        color: "skyblue",
        image_id: 4012
      }
    ],
    images: [
      {
        image_id: 4011,
        id: 40,
        alt: "hotpink",
        src: "3.jpg",
        variant_id: [
          4001,
          4003
        ]
      },
      {
        image_id: 4012,
        id: 40,
        alt: "skyblue",
        src: "3.jpg",
        variant_id: [
          4002,
          4004
        ]
      }
    ]
  },
  {
    id: 41,
    title: "Stacking Ring",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "Barbie",
    collection: [
      "best sellers"
    ],
    category: "kids",
    price: 70,
    sale: true,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "Barbie",
      "new",
      "coral",
      "purple",
      "yellow"
    ],
    variants: [
      {
        variant_id: 4101,
        id: 41,
        sku: "sku41",
        size: "m",
        color: "coral",
        image_id: 4111
      },
      {
        variant_id: 4102,
        id: 41,
        sku: "skumg41",
        size: "m",
        color: "purple",
        image_id: 4112
      },
      {
        variant_id: 4103,
        id: 41,
        sku: "skums41",
        size: "m",
        color: "yellow",
        image_id: 4113
      },
      {
        variant_id: 4104,
        id: 41,
        sku: "skusp41",
        size: "s",
        color: "coral",
        image_id: 4111
      },
      {
        variant_id: 4105,
        id: 41,
        sku: "skusg41",
        size: "s",
        color: "purple",
        image_id: 4112
      },
      {
        variant_id: 4106,
        id: 41,
        sku: "skusb41",
        size: "s",
        color: "yellow",
        image_id: 4113
      }
    ],
    images: [
      {
        image_id: 4111,
        id: 41,
        alt: "coral",
        src: "3.jpg",
        variant_id: [
          4101,
          4104
        ]
      },
      {
        image_id: 4112,
        id: 41,
        alt: "purple",
        src: "3.jpg",
        variant_id: [
          4102,
          4105
        ]
      },
      {
        image_id: 4113,
        id: 41,
        alt: "yellow",
        src: "3.jpg",
        variant_id: [
          4103,
          4106
        ]
      }
    ]
  },
  {
    id: 42,
    title: "Stacking Ring",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "kids",
    brand: "cucumber",
    collection: [
      "best sellers"
    ],
    category: "kids",
    price: 275,
    sale: false,
    discount: "40",
    stock: 1,
    "new": true,
    tags: [
      "new",
      "cucumber",
      "hotpink",
      "lawngreen",
      "maroon"
    ],
    variants: [
      {
        variant_id: 4201,
        id: 42,
        sku: "sku42",
        size: "m",
        color: "hotpink",
        image_id: 4211
      },
      {
        variant_id: 4202,
        id: 42,
        sku: "skumg42",
        size: "m",
        color: "lawngreen",
        image_id: 4212
      },
      {
        variant_id: 4203,
        id: 42,
        sku: "skums42",
        size: "m",
        color: "maroon",
        image_id: 4213
      },
      {
        variant_id: 4204,
        id: 42,
        sku: "skusp42",
        size: "s",
        color: "hotpink",
        image_id: 4211
      },
      {
        variant_id: 4205,
        id: 42,
        sku: "skusg42",
        size: "s",
        color: "lawngreen",
        image_id: 4212
      },
      {
        variant_id: 4206,
        id: 42,
        sku: "skusb42",
        size: "s",
        color: "maroon",
        image_id: 4213
      }
    ],
    images: [
      {
        image_id: 4211,
        id: 42,
        alt: "hotpink",
        src: "3.jpg",
        variant_id: [
          4201,
          4204
        ]
      },
      {
        image_id: 4212,
        id: 42,
        alt: "lawngreen",
        src: "3.jpg",
        variant_id: [
          4202,
          4205
        ]
      },
      {
        image_id: 4213,
        id: 42,
        alt: "maroon",
        src: "3.jpg",
        variant_id: [
          4203,
          4206
        ]
      }
    ]
  },
  {
    id: 43,
    title: "shoes 1",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "decathlon",
    collection: [
      "best sellers"
    ],
    category: "shoes",
    price: 150,
    sale: false,
    discount: "60",
    stock: 4,
    "new": true,
    tags: [
      "new",
      "brown",
      "black",
      "decathlon"
    ],
    variants: [
      {
        variant_id: 4301,
        id: 43,
        sku: "sku43",
        size: "35",
        color: "brown",
        image_id: 4311
      },
      {
        variant_id: 4302,
        id: 43,
        sku: "skumg43",
        size: "35",
        color: "black",
        image_id: 4312
      },
      {
        variant_id: 4303,
        id: 43,
        sku: "skums43",
        size: "36",
        color: "brown",
        image_id: 4311
      },
      {
        variant_id: 4304,
        id: 43,
        sku: "skusp43",
        size: "36",
        color: "black",
        image_id: 4312
      },
      {
        variant_id: 4305,
        id: 43,
        sku: "skusg43",
        size: "37",
        color: "brown",
        image_id: 4311
      },
      {
        variant_id: 4306,
        id: 43,
        sku: "skusb43",
        size: "37",
        color: "black",
        image_id: 4312
      }
    ],
    images: [
      {
        image_id: 4311,
        id: 43,
        alt: "brown",
        src: "1.jpg",
        variant_id: [
          4301,
          4303,
          4305
        ]
      },
      {
        image_id: 4312,
        id: 43,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          4302,
          4304,
          4306
        ]
      }
    ]
  },
  {
    id: 44,
    title: "shoes 2",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "nike",
    collection: [
      "best sellers"
    ],
    category: "shoes",
    price: 299,
    sale: false,
    discount: "40",
    stock: 50,
    "new": true,
    tags: [
      "nike",
      "antiquewhite",
      "rosybrown",
      "36",
      "37",
      "38"
    ],
    variants: [
      {
        variant_id: 4401,
        id: 44,
        sku: "sku44",
        size: "36",
        color: "antiquewhite",
        image_id: 4411
      },
      {
        variant_id: 4402,
        id: 44,
        sku: "skumg44",
        size: "36",
        color: "rosybrown",
        image_id: 4412
      },
      {
        variant_id: 4403,
        id: 44,
        sku: "skums44",
        size: "37",
        color: "antiquewhite",
        image_id: 4411
      },
      {
        variant_id: 4404,
        id: 44,
        sku: "skusp44",
        size: "37",
        color: "rosybrown",
        image_id: 4412
      },
      {
        variant_id: 4405,
        id: 44,
        sku: "skusg44",
        size: "38",
        color: "antiquewhite",
        image_id: 4411
      },
      {
        variant_id: 4406,
        id: 44,
        sku: "skusb44",
        size: "38",
        color: "rosybrown",
        image_id: 4412
      }
    ],
    images: [
      {
        image_id: 4411,
        id: 44,
        alt: "antiquewhite",
        src: "1.jpg",
        variant_id: [
          4401,
          4403,
          4405
        ]
      },
      {
        image_id: 4412,
        id: 44,
        alt: "rosybrown",
        src: "1.jpg",
        variant_id: [
          4402,
          4404,
          4406
        ]
      }
    ]
  },
  {
    id: 45,
    title: "shoes 3",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "puma",
    collection: [
      "best sellers"
    ],
    category: "shoes",
    price: 260,
    sale: true,
    discount: "10",
    stock: 60,
    "new": true,
    tags: [
      "black",
      "red",
      "gray",
      "36",
      "37",
      "puma"
    ],
    variants: [
      {
        variant_id: 4501,
        id: 45,
        sku: "sku45",
        size: "36",
        color: "black",
        image_id: 4511
      },
      {
        variant_id: 4502,
        id: 45,
        sku: "skumg45",
        size: "36",
        color: "red",
        image_id: 4512
      },
      {
        variant_id: 4503,
        id: 45,
        sku: "skums45",
        size: "36",
        color: "gray",
        image_id: 4513
      },
      {
        variant_id: 4504,
        id: 45,
        sku: "skusp45",
        size: "37",
        color: "black",
        image_id: 4511
      },
      {
        variant_id: 4505,
        id: 45,
        sku: "skusg45",
        size: "37",
        color: "red",
        image_id: 4512
      },
      {
        variant_id: 4506,
        id: 45,
        sku: "skusb45",
        size: "37",
        color: "gray",
        image_id: 4513
      }
    ],
    images: [
      {
        image_id: 4511,
        id: 45,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          4501,
          4504
        ]
      },
      {
        image_id: 4512,
        id: 45,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          4502,
          4505
        ]
      },
      {
        image_id: 4512,
        id: 45,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          4503,
          4506
        ]
      }
    ]
  },
  {
    id: 46,
    title: "shoes 4",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "adidas",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "shoes",
    price: 450,
    sale: true,
    discount: "20",
    stock: 2,
    "new": true,
    tags: [
      "navy",
      "chocolate",
      "black",
      "36",
      "37",
      "adidas"
    ],
    variants: [
      {
        variant_id: 4601,
        id: 46,
        sku: "sku46",
        size: "36",
        color: "navy",
        image_id: 4611
      },
      {
        variant_id: 4602,
        id: 46,
        sku: "skumg46",
        size: "36",
        color: "chocolate",
        image_id: 4612
      },
      {
        variant_id: 4603,
        id: 46,
        sku: "skums46",
        size: "36",
        color: "black",
        image_id: 4613
      },
      {
        variant_id: 4604,
        id: 46,
        sku: "skusp46",
        size: "37",
        color: "navy",
        image_id: 4611
      },
      {
        variant_id: 4605,
        id: 46,
        sku: "skusg46",
        size: "37",
        color: "chocolate",
        image_id: 4612
      },
      {
        variant_id: 4606,
        id: 46,
        sku: "skusb46",
        size: "37",
        color: "black",
        image_id: 4613
      }
    ],
    images: [
      {
        image_id: 4611,
        id: 46,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          4601,
          4604
        ]
      },
      {
        image_id: 4612,
        id: 46,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          4602,
          4605
        ]
      },
      {
        image_id: 4612,
        id: 46,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          4603,
          4606
        ]
      }
    ]
  },
  {
    id: 47,
    title: "shoes 5",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "nike",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "shoes",
    price: 400,
    sale: true,
    discount: "60",
    stock: 54,
    "new": true,
    tags: [
      "rosybrown",
      "darkred",
      "new",
      "nike",
      "36"
    ],
    variants: [
      {
        variant_id: 4701,
        id: 47,
        sku: "sku47",
        size: "36",
        color: "rosybrown",
        image_id: 4711
      },
      {
        variant_id: 4702,
        id: 47,
        sku: "skumg47",
        size: "36",
        color: "darkred",
        image_id: 4712
      },
      {
        variant_id: 4703,
        id: 47,
        sku: "skums47",
        size: "37",
        color: "rosybrown",
        image_id: 4711
      },
      {
        variant_id: 4704,
        id: 47,
        sku: "skusp47",
        size: "37",
        color: "darkred",
        image_id: 4712
      },
      {
        variant_id: 4705,
        id: 47,
        sku: "skusg47",
        size: "38",
        color: "rosybrown",
        image_id: 4711
      },
      {
        variant_id: 4706,
        id: 47,
        sku: "skusb47",
        size: "38",
        color: "darkred",
        image_id: 4712
      }
    ],
    images: [
      {
        image_id: 4711,
        id: 47,
        alt: "rosybrown",
        src: "1.jpg",
        variant_id: [
          4701,
          4703,
          4705
        ]
      },
      {
        image_id: 4712,
        id: 47,
        alt: "darkred",
        src: "1.jpg",
        variant_id: [
          4702,
          4704,
          4706
        ]
      }
    ]
  },
  {
    id: 48,
    title: "shoes 6",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "decathlon",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "shoes",
    price: 180,
    sale: false,
    discount: "40",
    stock: 0,
    "new": true,
    tags: [
      "new",
      "navy",
      "white",
      "decathlon",
      "36",
      "37"
    ],
    variants: [
      {
        variant_id: 4801,
        id: 48,
        sku: "sku48",
        size: "36",
        color: "white",
        image_id: 4811
      },
      {
        variant_id: 4802,
        id: 48,
        sku: "skumg48",
        size: "36",
        color: "navy",
        image_id: 4812
      },
      {
        variant_id: 4803,
        id: 48,
        sku: "skums48",
        size: "37",
        color: "white",
        image_id: 4811
      },
      {
        variant_id: 4804,
        id: 48,
        sku: "skusp48",
        size: "37",
        color: "navy",
        image_id: 4812
      }
    ],
    images: [
      {
        image_id: 4811,
        id: 48,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          4801,
          4803
        ]
      },
      {
        image_id: 4812,
        id: 48,
        alt: "navy",
        src: "1.jpg",
        variant_id: [
          4802,
          4804
        ]
      }
    ]
  },
  {
    id: 49,
    title: "shoes 7",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "puma",
    collection: [
      "featured products"
    ],
    category: "shoes",
    price: 230,
    sale: true,
    discount: "15",
    stock: 5,
    "new": true,
    tags: [
      "skyblue",
      "black",
      "puma",
      "36",
      "37"
    ],
    variants: [
      {
        variant_id: 4901,
        id: 49,
        sku: "sku49",
        size: "36",
        color: "skyblue",
        image_id: 4911
      },
      {
        variant_id: 4902,
        id: 49,
        sku: "skumg49",
        size: "36",
        color: "black",
        image_id: 4912
      },
      {
        variant_id: 4903,
        id: 49,
        sku: "skums49",
        size: "37",
        color: "skyblue",
        image_id: 4911
      },
      {
        variant_id: 4904,
        id: 49,
        sku: "skusp49",
        size: "37",
        color: "black",
        image_id: 4912
      }
    ],
    images: [
      {
        image_id: 4911,
        id: 49,
        alt: "skyblue",
        src: "1.jpg",
        variant_id: [
          4901,
          4903
        ]
      },
      {
        image_id: 4912,
        id: 49,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          4902,
          4904
        ]
      }
    ]
  },
  {
    id: 50,
    title: "shoes 8",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "adidas",
    collection: [
      "featured products"
    ],
    category: "shoes",
    price: 380,
    sale: true,
    discount: "12",
    stock: 95,
    "new": true,
    tags: [
      "dimgray",
      "chocolate",
      "black",
      "adidas",
      "36",
      "37"
    ],
    variants: [
      {
        variant_id: 5001,
        id: 50,
        sku: "sku50",
        size: "36",
        color: "dimgray",
        image_id: 5011
      },
      {
        variant_id: 5002,
        id: 50,
        sku: "skumg50",
        size: "36",
        color: "chocolate",
        image_id: 5012
      },
      {
        variant_id: 5003,
        id: 50,
        sku: "skums50",
        size: "36",
        color: "black",
        image_id: 5011
      },
      {
        variant_id: 5004,
        id: 50,
        sku: "skusp50",
        size: "37",
        color: "dimgray",
        image_id: 5012
      },
      {
        variant_id: 5005,
        id: 50,
        sku: "skusp50",
        size: "37",
        color: "chocolate",
        image_id: 5012
      },
      {
        variant_id: 5006,
        id: 50,
        sku: "skusp50",
        size: "37",
        color: "black",
        image_id: 5012
      }
    ],
    images: [
      {
        image_id: 5011,
        id: 50,
        alt: "dimgray",
        src: "1.jpg",
        variant_id: [
          5001,
          5003
        ]
      },
      {
        image_id: 5012,
        id: 50,
        alt: "chocolate",
        src: "1.jpg",
        variant_id: [
          5002,
          5004
        ]
      },
      {
        image_id: 5012,
        id: 50,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          5002,
          5004
        ]
      }
    ]
  },
  {
    id: 51,
    title: "shoes 9",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "nike",
    collection: [
      "featured products",
      "new arrival"
    ],
    category: "shoes",
    price: 255,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "orange",
      "darkgoldenrod",
      "nike",
      "34"
    ],
    variants: [
      {
        variant_id: 5101,
        id: 51,
        sku: "sku51",
        size: "34",
        color: "orange",
        image_id: 5111
      },
      {
        variant_id: 5102,
        id: 51,
        sku: "skumg51",
        size: "34",
        color: "darkgoldenrod",
        image_id: 5112
      }
    ],
    images: [
      {
        image_id: 5111,
        id: 51,
        alt: "orange",
        src: "1.jpg",
        variant_id: [
          5101
        ]
      },
      {
        image_id: 5112,
        id: 51,
        alt: "darkgoldenrod",
        src: "1.jpg",
        variant_id: [
          5102
        ]
      }
    ]
  },
  {
    id: 52,
    title: "shoes 10",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "adidas",
    collection: [
      "featured products",
      "new arrival"
    ],
    category: "shoes",
    price: 355,
    sale: false,
    discount: "40",
    stock: 3,
    "new": true,
    tags: [
      "new",
      "chocolate",
      "black",
      "adidas",
      "37"
    ],
    variants: [
      {
        variant_id: 5201,
        id: 52,
        sku: "sku52",
        size: "36",
        color: "chocolate",
        image_id: 5211
      },
      {
        variant_id: 5202,
        id: 52,
        sku: "skumg52",
        size: "36",
        color: "black",
        image_id: 5212
      },
      {
        variant_id: 5203,
        id: 52,
        sku: "skums52",
        size: "36",
        color: "chocolate",
        image_id: 5211
      },
      {
        variant_id: 5204,
        id: 52,
        sku: "skusp52",
        size: "37",
        color: "black",
        image_id: 5212
      }
    ],
    images: [
      {
        image_id: 5211,
        id: 52,
        alt: "chocolate",
        src: "1.jpg",
        variant_id: [
          5201,
          5203
        ]
      },
      {
        image_id: 5212,
        id: 52,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          5202,
          5204
        ]
      }
    ]
  },
  {
    id: 53,
    title: "shoes 11",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "nike",
    collection: [
      "featured products"
    ],
    category: "shoes",
    price: 150,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "gray",
      "black",
      "nike",
      "35"
    ],
    variants: [
      {
        variant_id: 5301,
        id: 53,
        sku: "sku53",
        size: "35",
        color: "black",
        image_id: 5311
      },
      {
        variant_id: 5302,
        id: 53,
        sku: "skumg53",
        size: "35",
        color: "gray",
        image_id: 5312
      },
      {
        variant_id: 5303,
        id: 53,
        sku: "skums53",
        size: "37",
        color: "black",
        image_id: 5311
      },
      {
        variant_id: 5304,
        id: 53,
        sku: "skusp53",
        size: "37",
        color: "gray",
        image_id: 5312
      }
    ],
    images: [
      {
        image_id: 5311,
        id: 53,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          5301,
          5303
        ]
      },
      {
        image_id: 5312,
        id: 53,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          5302,
          5304
        ]
      }
    ]
  },
  {
    id: 54,
    title: "shoes 12",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "nike",
    collection: [
      "featured products"
    ],
    category: "shoes",
    price: 245,
    sale: true,
    discount: "21",
    stock: 1,
    "new": true,
    tags: [
      "antiquewhite",
      "maroon",
      "nike",
      "new"
    ],
    variants: [
      {
        variant_id: 5401,
        id: 54,
        sku: "sku54",
        size: "36",
        color: "antiquewhite",
        image_id: 5411
      },
      {
        variant_id: 5402,
        id: 54,
        sku: "skumg54",
        size: "36",
        color: "maroon",
        image_id: 5412
      },
      {
        variant_id: 5403,
        id: 54,
        sku: "skums54",
        size: "36",
        color: "antiquewhite",
        image_id: 5411
      },
      {
        variant_id: 5404,
        id: 54,
        sku: "skusp54",
        size: "37",
        color: "maroon",
        image_id: 5412
      }
    ],
    images: [
      {
        image_id: 5411,
        id: 54,
        alt: "antiquewhite",
        src: "1.jpg",
        variant_id: [
          5401,
          5403
        ]
      },
      {
        image_id: 5412,
        id: 54,
        alt: "maroon",
        src: "1.jpg",
        variant_id: [
          5402,
          5404
        ]
      }
    ]
  },
  {
    id: 55,
    title: "shoes 13",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "puma",
    collection: [
      "on sale"
    ],
    category: "shoes",
    price: 400,
    sale: true,
    discount: "20",
    stock: 5,
    "new": true,
    tags: [
      "peru",
      "rosybrown",
      "puma",
      "37"
    ],
    variants: [
      {
        variant_id: 5501,
        id: 55,
        sku: "sku55",
        size: "36",
        color: "peru",
        image_id: 5511
      },
      {
        variant_id: 5502,
        id: 55,
        sku: "skumg55",
        size: "36",
        color: "rosybrown",
        image_id: 5512
      },
      {
        variant_id: 5503,
        id: 55,
        sku: "skums55",
        size: "36",
        color: "peru",
        image_id: 5511
      },
      {
        variant_id: 5504,
        id: 55,
        sku: "skusp55",
        size: "37",
        color: "rosybrown",
        image_id: 5512
      }
    ],
    images: [
      {
        image_id: 5511,
        id: 55,
        alt: "peru",
        src: "1.jpg",
        variant_id: [
          5501,
          5503
        ]
      },
      {
        image_id: 5512,
        id: 55,
        alt: "rosybrown",
        src: "1.jpg",
        variant_id: [
          5502,
          5504
        ]
      }
    ]
  },
  {
    id: 56,
    title: "shoes 14",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "nike",
    collection: [
      "on sale"
    ],
    category: "shoes",
    price: 482,
    sale: true,
    discount: "35",
    stock: 4,
    "new": true,
    tags: [
      "black",
      "tan",
      "nike",
      "new",
      "38"
    ],
    variants: [
      {
        variant_id: 5601,
        id: 56,
        sku: "sku56",
        size: "38",
        color: "black",
        image_id: 5611
      },
      {
        variant_id: 5602,
        id: 56,
        sku: "skumg56",
        size: "38",
        color: "tan",
        image_id: 5612
      },
      {
        variant_id: 5603,
        id: 56,
        sku: "skums56",
        size: "40",
        color: "black",
        image_id: 5611
      },
      {
        variant_id: 5604,
        id: 56,
        sku: "skusp56",
        size: "40",
        color: "tan",
        image_id: 5612
      }
    ],
    images: [
      {
        image_id: 5611,
        id: 56,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          5601,
          5603
        ]
      },
      {
        image_id: 5612,
        id: 56,
        alt: "tan",
        src: "1.jpg",
        variant_id: [
          5602,
          5604
        ]
      }
    ]
  },
  {
    id: 57,
    title: "shoes 15",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "adidas",
    collection: [
      "on sale"
    ],
    category: "shoes",
    price: 375,
    sale: true,
    discount: "26",
    stock: 8,
    "new": true,
    tags: [
      "brown",
      "black",
      "adidas",
      "new"
    ],
    variants: [
      {
        variant_id: 5701,
        id: 57,
        sku: "sku57",
        size: "38",
        color: "brown",
        image_id: 5711
      },
      {
        variant_id: 5702,
        id: 57,
        sku: "skumg57",
        size: "38",
        color: "black",
        image_id: 5712
      },
      {
        variant_id: 5703,
        id: 57,
        sku: "skums57",
        size: "39",
        color: "brown",
        image_id: 5711
      },
      {
        variant_id: 5704,
        id: 57,
        sku: "skusp57",
        size: "39",
        color: "black",
        image_id: 5712
      }
    ],
    images: [
      {
        image_id: 5711,
        id: 57,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          5701,
          5703
        ]
      },
      {
        image_id: 5712,
        id: 57,
        alt: "tan",
        src: "1.jpg",
        variant_id: [
          5702,
          5704
        ]
      }
    ]
  },
  {
    id: 58,
    title: "shoes 16",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "puma",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "shoes",
    price: 190,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "rosybrown",
      "black",
      "puma"
    ],
    variants: [
      {
        variant_id: 5801,
        id: 58,
        sku: "sku58",
        size: "38",
        color: "rosybrown",
        image_id: 5811
      },
      {
        variant_id: 5802,
        id: 58,
        sku: "skumg58",
        size: "38",
        color: "black",
        image_id: 5812
      },
      {
        variant_id: 5803,
        id: 58,
        sku: "skums58",
        size: "39",
        color: "rosybrown",
        image_id: 5811
      },
      {
        variant_id: 5804,
        id: 58,
        sku: "skusp58",
        size: "39",
        color: "black",
        image_id: 5812
      }
    ],
    images: [
      {
        image_id: 5811,
        id: 58,
        alt: "rosybrown",
        src: "1.jpg",
        variant_id: [
          5801,
          5803
        ]
      },
      {
        image_id: 5812,
        id: 58,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          5802,
          5804
        ]
      }
    ]
  },
  {
    id: 59,
    title: "shoes 17",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "puma",
    collection: [
      "on sale"
    ],
    category: "shoes",
    price: 399,
    sale: false,
    discount: "40",
    stock: 10,
    "new": true,
    tags: [
      "new",
      "lightsteelblue",
      "gray",
      "puma"
    ],
    variants: [
      {
        variant_id: 5901,
        id: 59,
        sku: "sku59",
        size: "38",
        color: "lightsteelblue",
        image_id: 5911
      },
      {
        variant_id: 5902,
        id: 59,
        sku: "skumg59",
        size: "38",
        color: "gray",
        image_id: 5912
      },
      {
        variant_id: 5903,
        id: 59,
        sku: "skums59",
        size: "39",
        color: "lightsteelblue",
        image_id: 5911
      },
      {
        variant_id: 5904,
        id: 59,
        sku: "skusp59",
        size: "39",
        color: "gray",
        image_id: 5912
      }
    ],
    images: [
      {
        image_id: 5911,
        id: 59,
        alt: "lightsteelblue",
        src: "1.jpg",
        variant_id: [
          5901,
          5903
        ]
      },
      {
        image_id: 5912,
        id: 59,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          5902,
          5904
        ]
      }
    ]
  },
  {
    id: 60,
    title: "shoes 18",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "shoes",
    brand: "decathlon",
    collection: [
      "on sale"
    ],
    category: "shoes",
    price: 270,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "rosybrown",
      "gray",
      "black",
      "decathlon",
      "38"
    ],
    variants: [
      {
        variant_id: 6001,
        id: 60,
        sku: "sku60",
        size: "38",
        color: "rosybrown",
        image_id: 6011
      },
      {
        variant_id: 6002,
        id: 60,
        sku: "skumg60",
        size: "38",
        color: "gray",
        image_id: 6012
      },
      {
        variant_id: 6003,
        id: 60,
        sku: "skums60",
        size: "39",
        color: "black",
        image_id: 6011
      }
    ],
    images: [
      {
        image_id: 6011,
        id: 60,
        alt: "rosybrown",
        src: "1.jpg",
        variant_id: [
          6001,
          6003
        ]
      },
      {
        image_id: 6012,
        id: 60,
        alt: "gray",
        src: "1.jpg",
        variant_id: [
          6002,
          6004
        ]
      },
      {
        image_id: 6012,
        id: 60,
        alt: "black",
        src: "1.jpg",
        variant_id: [
          6002,
          6004
        ]
      }
    ]
  },
  {
    id: 61,
    title: "bag 1",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "ck",
    collection: [
      "new arrival"
    ],
    category: "bags",
    price: 360,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "black",
      "cadetblue",
      "ck"
    ],
    variants: [
      {
        variant_id: 6101,
        id: 61,
        sku: "sku61",
        color: "black",
        image_id: 6111
      },
      {
        variant_id: 6102,
        id: 61,
        sku: "skumg61",
        color: "cadetblue",
        image_id: 6112
      }
    ],
    images: [
      {
        image_id: 6111,
        id: 61,
        alt: "black",
        src: "4.jpg",
        variant_id: [
          6101
        ]
      },
      {
        image_id: 6112,
        id: 61,
        alt: "cadetblue",
        src: "4.jpg",
        variant_id: [
          6102
        ]
      }
    ]
  },
  {
    id: 62,
    title: "bag 2",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "caprese",
    collection: [
      "trending product",
      "best sellers"
    ],
    category: "bags",
    price: 445,
    sale: true,
    discount: "24",
    stock: 15,
    "new": true,
    tags: [
      "gainsboro",
      "cadetblue",
      "darksalmon",
      "caprese"
    ],
    variants: [
      {
        variant_id: 6201,
        id: 62,
        sku: "sku62",
        color: "gainsboro",
        image_id: 6211
      },
      {
        variant_id: 6202,
        id: 62,
        sku: "skumg62",
        color: "cadetblue",
        image_id: 6212
      },
      {
        variant_id: 6202,
        id: 62,
        sku: "skumg62",
        color: "darksalmon",
        image_id: 6213
      }
    ],
    images: [
      {
        image_id: 6211,
        id: 62,
        alt: "gainsboro",
        src: "4.jpg",
        variant_id: [
          6201
        ]
      },
      {
        image_id: 6212,
        id: 62,
        alt: "cadetblue",
        src: "4.jpg",
        variant_id: [
          6202
        ]
      },
      {
        image_id: 6213,
        id: 62,
        alt: "darksalmon",
        src: "4.jpg",
        variant_id: [
          6203
        ]
      }
    ]
  },
  {
    id: 63,
    title: "bag 3",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "caprese",
    collection: [
      "new arrival"
    ],
    category: "bags",
    price: 360,
    sale: true,
    discount: "10",
    stock: 0,
    "new": true,
    tags: [
      "darkslategrey",
      "lightpink",
      "caprese",
      "new"
    ],
    variants: [
      {
        variant_id: 6301,
        id: 63,
        sku: "sku63",
        color: "darkslategrey",
        image_id: 6311
      },
      {
        variant_id: 6302,
        id: 63,
        sku: "skumg63",
        color: "lightpink",
        image_id: 6312
      }
    ],
    images: [
      {
        image_id: 6311,
        id: 63,
        alt: "darkslategrey",
        src: "4.jpg",
        variant_id: [
          6301
        ]
      },
      {
        image_id: 6312,
        id: 63,
        alt: "lightpink",
        src: "4.jpg",
        variant_id: [
          6302
        ]
      }
    ]
  },
  {
    id: 64,
    title: "bag 4",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "zara",
    collection: [
      "new arrival"
    ],
    category: "bags",
    price: 410,
    sale: true,
    discount: "16",
    stock: 5,
    "new": true,
    tags: [
      "cadetblue",
      "black",
      "chocolate",
      "zara"
    ],
    variants: [
      {
        variant_id: 6401,
        id: 64,
        sku: "sku64",
        color: "cadetblue",
        image_id: 6411
      },
      {
        variant_id: 6402,
        id: 64,
        sku: "skumg64",
        color: "black",
        image_id: 6412
      },
      {
        variant_id: 6403,
        id: 64,
        sku: "skumg64",
        color: "chocolate",
        image_id: 6413
      }
    ],
    images: [
      {
        image_id: 6411,
        id: 64,
        alt: "cadetblue",
        src: "4.jpg",
        variant_id: [
          6401
        ]
      },
      {
        image_id: 6412,
        id: 64,
        alt: "black",
        src: "4.jpg",
        variant_id: [
          6402
        ]
      },
      {
        image_id: 6413,
        id: 64,
        alt: "chocolate",
        src: "4.jpg",
        variant_id: [
          6403
        ]
      }
    ]
  },
  {
    id: 65,
    title: "bag 5",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "zara",
    collection: [
      "new arrival"
    ],
    category: "bags",
    price: 412,
    sale: true,
    discount: "48",
    stock: 15,
    "new": true,
    tags: [
      "lightpink",
      "beige",
      "crimson",
      "zara",
      "new"
    ],
    variants: [
      {
        variant_id: 6501,
        id: 65,
        sku: "sku65",
        color: "lightpink",
        image_id: 6511
      },
      {
        variant_id: 6502,
        id: 65,
        sku: "skumg65",
        color: "beige",
        image_id: 6512
      },
      {
        variant_id: 6503,
        id: 65,
        sku: "skumg65",
        color: "crimson",
        image_id: 6513
      }
    ],
    images: [
      {
        image_id: 6511,
        id: 65,
        alt: "lightpink",
        src: "4.jpg",
        variant_id: [
          6501
        ]
      },
      {
        image_id: 6512,
        id: 65,
        alt: "beige",
        src: "4.jpg",
        variant_id: [
          6502
        ]
      },
      {
        image_id: 6513,
        id: 65,
        alt: "crimson",
        src: "4.jpg",
        variant_id: [
          6503
        ]
      }
    ]
  },
  {
    id: 66,
    title: "bag 6",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "ck",
    collection: [
      "new arrival"
    ],
    category: "bags",
    price: 150,
    sale: true,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "sienna",
      "black",
      "ck"
    ],
    variants: [
      {
        variant_id: 6601,
        id: 66,
        sku: "sku66",
        color: "sienna",
        image_id: 6611
      },
      {
        variant_id: 6602,
        id: 66,
        sku: "skumg66",
        color: "black",
        image_id: 6612
      }
    ],
    images: [
      {
        image_id: 6611,
        id: 66,
        alt: "sienna",
        src: "4.jpg",
        variant_id: [
          6601
        ]
      },
      {
        image_id: 6612,
        id: 66,
        alt: "black",
        src: "4.jpg",
        variant_id: [
          6602
        ]
      }
    ]
  },
  {
    id: 67,
    title: "bag 7",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "ck",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "bags",
    price: 340,
    sale: true,
    discount: "60",
    stock: 62,
    "new": true,
    tags: [
      "gainsboro",
      "darksalmon",
      "ck"
    ],
    variants: [
      {
        variant_id: 6701,
        id: 67,
        sku: "sku67",
        color: "gainsboro",
        image_id: 6711
      },
      {
        variant_id: 6702,
        id: 67,
        sku: "skumg67",
        color: "darksalmon",
        image_id: 6712
      }
    ],
    images: [
      {
        image_id: 6711,
        id: 67,
        alt: "gainsboro",
        src: "4.jpg",
        variant_id: [
          6701
        ]
      },
      {
        image_id: 6712,
        id: 67,
        alt: "darksalmon",
        src: "4.jpg",
        variant_id: [
          6702
        ]
      }
    ]
  },
  {
    id: 68,
    title: "bag 8",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "caprese",
    collection: [
      "best sellers"
    ],
    category: "bags",
    price: 185,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "chocolate",
      "caprese"
    ],
    variants: [
      {
        variant_id: 6801,
        id: 68,
        sku: "sku68",
        color: "chocolate",
        image_id: 6811
      }
    ],
    images: [
      {
        image_id: 6811,
        id: 68,
        alt: "chocolate",
        src: "4.jpg",
        variant_id: [
          6801
        ]
      }
    ]
  },
  {
    id: 69,
    title: "bag 9",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "ck",
    collection: [
      "best sellers"
    ],
    category: "bags",
    price: 340,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "crimson",
      "saddlebrown",
      "ck"
    ],
    variants: [
      {
        variant_id: 6901,
        id: 69,
        sku: "sku69",
        color: "crimson",
        image_id: 6911
      },
      {
        variant_id: 6902,
        id: 69,
        sku: "skumg69",
        color: "saddlebrown",
        image_id: 6912
      }
    ],
    images: [
      {
        image_id: 6911,
        id: 69,
        alt: "crimson",
        src: "4.jpg",
        variant_id: [
          6901
        ]
      },
      {
        image_id: 6912,
        id: 69,
        alt: "saddlebrown",
        src: "4.jpg",
        variant_id: [
          6902
        ]
      }
    ]
  },
  {
    id: 70,
    title: "bag 10",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "caprese",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "bags",
    price: 260,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "beige",
      "chocolate",
      "caprese"
    ],
    variants: [
      {
        variant_id: 7001,
        id: 70,
        sku: "sku70",
        color: "beige",
        image_id: 7011
      },
      {
        variant_id: 7002,
        id: 70,
        sku: "skumg70",
        color: "chocolate",
        image_id: 7012
      }
    ],
    images: [
      {
        image_id: 7011,
        id: 70,
        alt: "beige",
        src: "4.jpg",
        variant_id: [
          7001
        ]
      },
      {
        image_id: 7012,
        id: 70,
        alt: "chocolate",
        src: "4.jpg",
        variant_id: [
          7002
        ]
      }
    ]
  },
  {
    id: 71,
    title: "bag 11",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "caprese",
    collection: [
      "best sellers"
    ],
    category: "bags",
    price: 230,
    sale: true,
    discount: "30",
    stock: 15,
    "new": true,
    tags: [
      "maroon",
      "beige",
      "caprese"
    ],
    variants: [
      {
        variant_id: 7101,
        id: 71,
        sku: "sku71",
        color: "maroon",
        image_id: 7111
      },
      {
        variant_id: 7102,
        id: 71,
        sku: "skumg71",
        color: "beige",
        image_id: 7112
      }
    ],
    images: [
      {
        image_id: 7111,
        id: 71,
        alt: "maroon",
        src: "4.jpg",
        variant_id: [
          7101
        ]
      },
      {
        image_id: 7112,
        id: 71,
        alt: "beige",
        src: "4.jpg",
        variant_id: [
          7102
        ]
      }
    ]
  },
  {
    id: 72,
    title: "bag 12",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "caprese",
    collection: [
      "best sellers"
    ],
    category: "bags",
    price: 350,
    sale: true,
    discount: "40",
    stock: 35,
    "new": true,
    tags: [
      "black",
      "saddlebrown",
      "caprese"
    ],
    variants: [
      {
        variant_id: 7201,
        id: 72,
        sku: "sku72",
        color: "black",
        image_id: 7211
      },
      {
        variant_id: 7202,
        id: 72,
        sku: "skumg72",
        color: "saddlebrown",
        image_id: 7212
      }
    ],
    images: [
      {
        image_id: 7211,
        id: 72,
        alt: "black",
        src: "4.jpg",
        variant_id: [
          7201
        ]
      },
      {
        image_id: 7212,
        id: 72,
        alt: "saddlebrown",
        src: "4.jpg",
        variant_id: [
          7202
        ]
      }
    ]
  },
  {
    id: 73,
    title: "bag 13",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "zara",
    collection: [
      "trending product",
      "best sellers"
    ],
    category: "bags",
    price: 180,
    sale: true,
    discount: "20",
    stock: 15,
    "new": true,
    tags: [
      "beige",
      "crimson",
      "zara"
    ],
    variants: [
      {
        variant_id: 7301,
        id: 73,
        sku: "sku73",
        color: "beige",
        image_id: 7311
      },
      {
        variant_id: 7302,
        id: 73,
        sku: "skumg73",
        color: "crimson",
        image_id: 7312
      }
    ],
    images: [
      {
        image_id: 7311,
        id: 73,
        alt: "beige",
        src: "4.jpg",
        variant_id: [
          7301
        ]
      },
      {
        image_id: 7312,
        id: 73,
        alt: "crimson",
        src: "4.jpg",
        variant_id: [
          7302
        ]
      }
    ]
  },
  {
    id: 74,
    title: "bag 14",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "caprese",
    collection: [
      "trending product"
    ],
    category: "bags",
    price: 140,
    sale: false,
    discount: "40",
    stock: 20,
    "new": true,
    tags: [
      "new",
      "saddlebrown",
      "caprese"
    ],
    variants: [
      {
        variant_id: 7401,
        id: 74,
        sku: "sku74",
        color: "saddlebrown",
        image_id: 7411
      }
    ],
    images: [
      {
        image_id: 7411,
        id: 74,
        alt: "saddlebrown",
        src: "4.jpg",
        variant_id: [
          7401
        ]
      }
    ]
  },
  {
    id: 75,
    title: "bag 15",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "ck",
    collection: [
      "trending product"
    ],
    category: "bags",
    price: 290,
    sale: true,
    discount: "15",
    stock: 6,
    "new": true,
    tags: [
      "black",
      "chocolate",
      "ck"
    ],
    variants: [
      {
        variant_id: 7501,
        id: 75,
        sku: "sku75",
        color: "black",
        image_id: 7511
      },
      {
        variant_id: 7502,
        id: 75,
        sku: "skumg75",
        color: "chocolate",
        image_id: 7512
      }
    ],
    images: [
      {
        image_id: 7511,
        id: 75,
        alt: "black",
        src: "4.jpg",
        variant_id: [
          7501
        ]
      },
      {
        image_id: 7512,
        id: 75,
        alt: "chocolate",
        src: "4.jpg",
        variant_id: [
          7502
        ]
      }
    ]
  },
  {
    id: 76,
    title: "bag 16",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "zara",
    collection: [
      "trending product"
    ],
    category: "bags",
    price: 360,
    sale: true,
    discount: "56",
    stock: 15,
    "new": true,
    tags: [
      "maroon",
      "beige",
      "zara"
    ],
    variants: [
      {
        variant_id: 7601,
        id: 76,
        sku: "sku76",
        color: "maroon",
        image_id: 7611
      },
      {
        variant_id: 7602,
        id: 76,
        sku: "skumg76",
        color: "beige",
        image_id: 7612
      }
    ],
    images: [
      {
        image_id: 7611,
        id: 76,
        alt: "maroon",
        src: "4.jpg",
        variant_id: [
          7601
        ]
      },
      {
        image_id: 7612,
        id: 76,
        alt: "beige",
        src: "4.jpg",
        variant_id: [
          7602
        ]
      }
    ]
  },
  {
    id: 77,
    title: "bag 17",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "zara",
    collection: [
      "trending product"
    ],
    category: "bags",
    price: 199,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "brown",
      "lightpink",
      "zara"
    ],
    variants: [
      {
        variant_id: 7701,
        id: 77,
        sku: "sku77",
        color: "brown",
        image_id: 7711
      },
      {
        variant_id: 7702,
        id: 77,
        sku: "skumg77",
        color: "lightpink",
        image_id: 7712
      }
    ],
    images: [
      {
        image_id: 7711,
        id: 77,
        alt: "brown",
        src: "4.jpg",
        variant_id: [
          7701
        ]
      },
      {
        image_id: 7712,
        id: 77,
        alt: "lightpink",
        src: "4.jpg",
        variant_id: [
          7702
        ]
      }
    ]
  },
  {
    id: 78,
    title: "bag 18",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "bags",
    brand: "zara",
    collection: [
      "new arrival"
    ],
    category: "bags",
    price: 260,
    sale: false,
    discount: "22",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "darksalmon",
      "black",
      "beige",
      "zara"
    ],
    variants: [
      {
        variant_id: 7801,
        id: 78,
        sku: "sku78",
        color: "darksalmon",
        image_id: 7811
      },
      {
        variant_id: 7802,
        id: 78,
        sku: "skumg78",
        color: "black",
        image_id: 7812
      },
      {
        variant_id: 7803,
        id: 78,
        sku: "skumg78",
        color: "beige",
        image_id: 7813
      }
    ],
    images: [
      {
        image_id: 7811,
        id: 78,
        alt: "darksalmon",
        src: "4.jpg",
        variant_id: [
          7801
        ]
      },
      {
        image_id: 7812,
        id: 78,
        alt: "black",
        src: "4.jpg",
        variant_id: [
          7802
        ]
      },
      {
        image_id: 7813,
        id: 78,
        alt: "beige",
        src: "4.jpg",
        variant_id: [
          7803
        ]
      }
    ]
  },
  {
    id: 79,
    title: "watch 1",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "titan",
    collection: [
      "new arrival"
    ],
    category: "watch",
    price: 260,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "silver",
      "titan"
    ],
    variants: [
      {
        variant_id: 7901,
        id: 79,
        sku: "sku79",
        color: "silver",
        image_id: 7911
      }
    ],
    images: [
      {
        image_id: 7911,
        id: 79,
        alt: "silver",
        src: "5.jpg",
        variant_id: [
          7901
        ]
      },
      {
        image_id: 7912,
        id: 79,
        alt: "silver",
        src: "5.jpg",
        variant_id: [
          7902
        ]
      }
    ]
  },
  {
    id: 80,
    title: "watch 2",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "new arrival"
    ],
    category: "watch",
    price: 345,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "sienna",
      "silver",
      "fossil"
    ],
    variants: [
      {
        variant_id: 8001,
        id: 80,
        sku: "sku80",
        color: "sienna",
        image_id: 8011
      },
      {
        variant_id: 8002,
        id: 80,
        sku: "sku80",
        color: "silver",
        image_id: 8012
      }
    ],
    images: [
      {
        image_id: 8011,
        id: 80,
        alt: "sienna",
        src: "5.jpg",
        variant_id: [
          8001
        ]
      },
      {
        image_id: 8012,
        id: 80,
        alt: "silver",
        src: "5.jpg",
        variant_id: [
          8002
        ]
      }
    ]
  },
  {
    id: 81,
    title: "watch 3",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "new arrival"
    ],
    category: "watch",
    price: 445,
    sale: true,
    discount: "20",
    stock: 15,
    "new": true,
    tags: [
      "navy",
      "fossil",
      "new"
    ],
    variants: [
      {
        variant_id: 8101,
        id: 81,
        sku: "sku81",
        color: "navy",
        image_id: 8111
      }
    ],
    images: [
      {
        image_id: 8111,
        id: 81,
        alt: "navy",
        src: "5.jpg",
        variant_id: [
          8101
        ]
      },
      {
        image_id: 8112,
        id: 81,
        alt: "navy",
        src: "5.jpg",
        variant_id: [
          8102
        ]
      }
    ]
  },
  {
    id: 82,
    title: "watch 4",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "casio",
    collection: [
      "new arrival"
    ],
    category: "watch",
    price: 530,
    sale: true,
    discount: "12",
    stock: 15,
    "new": true,
    tags: [
      "bisque",
      "casio"
    ],
    variants: [
      {
        variant_id: 8201,
        id: 82,
        sku: "sku82",
        color: "bisque",
        image_id: 8211
      }
    ],
    images: [
      {
        image_id: 8211,
        id: 82,
        alt: "bisque",
        src: "5.jpg",
        variant_id: [
          8201
        ]
      }
    ]
  },
  {
    id: 83,
    title: "watch 5",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "casio",
    collection: [
      "new arrival",
      "on sale"
    ],
    category: "watch",
    price: 420,
    sale: true,
    discount: "48",
    stock: 30,
    "new": true,
    tags: [
      "chocolate",
      "navy",
      "casio"
    ],
    variants: [
      {
        variant_id: 8301,
        id: 83,
        sku: "sku83",
        color: "chocolate",
        image_id: 8311
      },
      {
        variant_id: 8302,
        id: 83,
        sku: "sku832",
        color: "navy",
        image_id: 8312
      }
    ],
    images: [
      {
        image_id: 8311,
        id: 83,
        alt: "chocolate",
        src: "5.jpg",
        variant_id: [
          8301
        ]
      },
      {
        image_id: 8312,
        id: 83,
        alt: "navy",
        src: "5.jpg",
        variant_id: [
          8302
        ]
      }
    ]
  },
  {
    id: 84,
    title: "watch 6",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "titan",
    collection: [
      "new arrival",
      "on sale"
    ],
    category: "watch",
    price: 225,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "steelblue",
      "bisque",
      "titan"
    ],
    variants: [
      {
        variant_id: 8401,
        id: 84,
        sku: "sku84",
        color: "steelblue",
        image_id: 8411
      },
      {
        variant_id: 8402,
        id: 84,
        sku: "sku842",
        color: "bisque",
        image_id: 8412
      }
    ],
    images: [
      {
        image_id: 8411,
        id: 84,
        alt: "steelblue",
        src: "5.jpg",
        variant_id: [
          8401
        ]
      },
      {
        image_id: 8412,
        id: 84,
        alt: "bisque",
        src: "5.jpg",
        variant_id: [
          8402
        ]
      }
    ]
  },
  {
    id: 85,
    title: "watch 7",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "best sellers"
    ],
    category: "watch",
    price: 174,
    sale: false,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "fossil",
      "wheat",
      "silver"
    ],
    variants: [
      {
        variant_id: 8501,
        id: 85,
        sku: "sku85",
        color: "wheat",
        image_id: 8511
      },
      {
        variant_id: 8502,
        id: 85,
        sku: "sku852",
        color: "silver",
        image_id: 8512
      }
    ],
    images: [
      {
        image_id: 8511,
        id: 85,
        alt: "wheat",
        src: "5.jpg",
        variant_id: [
          8501
        ]
      },
      {
        image_id: 8512,
        id: 85,
        alt: "silver",
        src: "5.jpg",
        variant_id: [
          8502
        ]
      }
    ]
  },
  {
    id: 86,
    title: "watch 8",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "watch",
    price: 189,
    sale: false,
    discount: "30",
    stock: 2,
    "new": true,
    tags: [
      "new",
      "dimgrey",
      "sienna",
      "fossil"
    ],
    variants: [
      {
        variant_id: 8601,
        id: 86,
        sku: "sku86",
        color: "dimgrey",
        image_id: 8611
      },
      {
        variant_id: 8602,
        id: 86,
        sku: "sku862",
        color: "sienna",
        image_id: 8612
      }
    ],
    images: [
      {
        image_id: 8611,
        id: 86,
        alt: "dimgrey",
        src: "5.jpg",
        variant_id: [
          8601
        ]
      },
      {
        image_id: 8612,
        id: 86,
        alt: "sienna",
        src: "5.jpg",
        variant_id: [
          8602
        ]
      }
    ]
  },
  {
    id: 87,
    title: "watch 9",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "best sellers"
    ],
    category: "watch",
    price: 99,
    sale: false,
    discount: "5",
    stock: 15,
    "new": true,
    tags: [
      "fossil",
      "black",
      "sienna"
    ],
    variants: [
      {
        variant_id: 8701,
        id: 87,
        sku: "sku87",
        color: "black",
        image_id: 8711
      },
      {
        variant_id: 8702,
        id: 87,
        sku: "sku872",
        color: "sienna",
        image_id: 8712
      }
    ],
    images: [
      {
        image_id: 8711,
        id: 87,
        alt: "black",
        src: "5.jpg",
        variant_id: [
          8701
        ]
      },
      {
        image_id: 8712,
        id: 87,
        alt: "sienna",
        src: "5.jpg",
        variant_id: [
          8702
        ]
      }
    ]
  },
  {
    id: 88,
    title: "watch 10",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "watch",
    price: 495,
    sale: true,
    discount: "30",
    stock: 15,
    "new": true,
    tags: [
      "silver",
      "palegoldenrod",
      "fossil"
    ],
    variants: [
      {
        variant_id: 8801,
        id: 88,
        sku: "sku88",
        color: "silver",
        image_id: 8811
      },
      {
        variant_id: 8802,
        id: 88,
        sku: "sku882",
        color: "palegoldenrod",
        image_id: 8812
      }
    ],
    images: [
      {
        image_id: 8811,
        id: 88,
        alt: "silver",
        src: "5.jpg",
        variant_id: [
          8801
        ]
      },
      {
        image_id: 8812,
        id: 88,
        alt: "palegoldenrod",
        src: "5.jpg",
        variant_id: [
          8802
        ]
      }
    ]
  },
  {
    id: 89,
    title: "watch 11",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "casio",
    collection: [
      "best sellers"
    ],
    category: "watch",
    price: 215,
    sale: false,
    discount: "60",
    stock: 0,
    "new": true,
    tags: [
      "new",
      "dimgray",
      "chocolate",
      "casio"
    ],
    variants: [
      {
        variant_id: 8901,
        id: 89,
        sku: "sku89",
        color: "dimgray",
        image_id: 8911
      },
      {
        variant_id: 8902,
        id: 89,
        sku: "sku892",
        color: "chocolate",
        image_id: 8912
      }
    ],
    images: [
      {
        image_id: 8911,
        id: 89,
        alt: "dimgray",
        src: "5.jpg",
        variant_id: [
          8901
        ]
      },
      {
        image_id: 8912,
        id: 89,
        alt: "chocolate",
        src: "5.jpg",
        variant_id: [
          8902
        ]
      }
    ]
  },
  {
    id: 90,
    title: "watch 12",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "best sellers"
    ],
    category: "watch",
    price: 150,
    sale: true,
    discount: "10",
    stock: 2,
    "new": true,
    tags: [
      "palegoldenrod",
      "bisque",
      "fossil"
    ],
    variants: [
      {
        variant_id: 9001,
        id: 90,
        sku: "sku90",
        color: "palegoldenrod",
        image_id: 9011
      },
      {
        variant_id: 9002,
        id: 90,
        sku: "sku902",
        color: "bisque",
        image_id: 9012
      }
    ],
    images: [
      {
        image_id: 9011,
        id: 90,
        alt: "palegoldenrod",
        src: "5.jpg",
        variant_id: [
          9001
        ]
      },
      {
        image_id: 9012,
        id: 90,
        alt: "bisque",
        src: "5.jpg",
        variant_id: [
          9002
        ]
      }
    ]
  },
  {
    id: 91,
    title: "watch 13",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "watch",
    price: 360,
    sale: true,
    discount: "60",
    stock: 51,
    "new": true,
    tags: [
      "black",
      "chocolate",
      "fossil"
    ],
    variants: [
      {
        variant_id: 9101,
        id: 91,
        sku: "sku91",
        color: "black",
        image_id: 9111
      },
      {
        variant_id: 9102,
        id: 91,
        sku: "sku912",
        color: "chocolate",
        image_id: 9112
      }
    ],
    images: [
      {
        image_id: 9111,
        id: 91,
        alt: "black",
        src: "5.jpg",
        variant_id: [
          9101
        ]
      },
      {
        image_id: 9112,
        id: 91,
        alt: "chocolate",
        src: "5.jpg",
        variant_id: [
          9102
        ]
      }
    ]
  },
  {
    id: 92,
    title: "watch 14",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "titan",
    collection: [
      "best sellers"
    ],
    category: "watch",
    price: 285,
    sale: true,
    discount: "7",
    stock: 1,
    "new": true,
    tags: [
      "steelblue",
      "black",
      "titan"
    ],
    variants: [
      {
        variant_id: 9201,
        id: 92,
        sku: "sku92",
        color: "steelblue",
        image_id: 9211
      },
      {
        variant_id: 9202,
        id: 92,
        sku: "sku922",
        color: "black",
        image_id: 9212
      }
    ],
    images: [
      {
        image_id: 9211,
        id: 92,
        alt: "steelblue",
        src: "5.jpg",
        variant_id: [
          9201
        ]
      },
      {
        image_id: 9212,
        id: 92,
        alt: "black",
        src: "5.jpg",
        variant_id: [
          9202
        ]
      }
    ]
  },
  {
    id: 92,
    title: "watch 14",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "watch",
    price: 130,
    sale: false,
    discount: "6",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "silver",
      "wheat",
      "fossil"
    ],
    variants: [
      {
        variant_id: 9201,
        id: 92,
        sku: "sku92",
        color: "silver",
        image_id: 9211
      },
      {
        variant_id: 9202,
        id: 92,
        sku: "sku922",
        color: "wheat",
        image_id: 9212
      }
    ],
    images: [
      {
        image_id: 9211,
        id: 92,
        alt: "silver",
        src: "5.jpg",
        variant_id: [
          9201
        ]
      },
      {
        image_id: 9212,
        id: 92,
        alt: "wheat",
        src: "5.jpg",
        variant_id: [
          9202
        ]
      }
    ]
  },
  {
    id: 93,
    title: "watch 15",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "on sale"
    ],
    category: "watch",
    price: 249,
    sale: true,
    discount: "4",
    stock: 15,
    "new": true,
    tags: [
      "sienna",
      "navy",
      "fossil"
    ],
    variants: [
      {
        variant_id: 9301,
        id: 93,
        sku: "sku93",
        color: "sienna",
        image_id: 9311
      },
      {
        variant_id: 9302,
        id: 93,
        sku: "sku932",
        color: "navy",
        image_id: 9312
      }
    ],
    images: [
      {
        image_id: 9311,
        id: 93,
        alt: "sienna",
        src: "5.jpg",
        variant_id: [
          9301
        ]
      },
      {
        image_id: 9312,
        id: 93,
        alt: "navy",
        src: "5.jpg",
        variant_id: [
          9302
        ]
      }
    ]
  },
  {
    id: 94,
    title: "watch 16",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "watch",
    brand: "fossil",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "watch",
    price: 160,
    sale: false,
    discount: "50",
    stock: 15,
    "new": true,
    tags: [
      "fossil",
      "bisque",
      "palegoldenrod",
      "silver"
    ],
    variants: [
      {
        variant_id: 9401,
        id: 94,
        sku: "989",
        color: "bisque",
        image_id: 9411
      },
      {
        variant_id: 9402,
        id: 94,
        sku: "sku942",
        color: "palegoldenrod",
        image_id: 9412
      },
      {
        variant_id: 9403,
        id: 94,
        sku: "sku942",
        color: "silver",
        image_id: 9413
      }
    ],
    images: [
      {
        image_id: 9411,
        id: 94,
        alt: "bisque",
        src: "5.jpg",
        variant_id: [
          9401
        ]
      },
      {
        image_id: 9412,
        id: 94,
        alt: "palegoldenrod",
        src: "5.jpg",
        variant_id: [
          9402
        ]
      },
      {
        image_id: 9412,
        id: 94,
        alt: "silver",
        src: "5.jpg",
        variant_id: [
          9403
        ]
      }
    ]
  },
  {
    id: 95,
    title: "Dreamy Love",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "rose",
    collection: [
      "best sellers"
    ],
    category: "flower",
    price: 190,
    sale: true,
    discount: "16",
    stock: 2,
    "new": true,
    tags: [
      "red",
      "white",
      "rose"
    ],
    variants: [
      {
        variant_id: 9501,
        id: 95,
        sku: "989",
        color: "red",
        image_id: 9511
      },
      {
        variant_id: 9502,
        id: 95,
        sku: "sku952",
        color: "white",
        image_id: 9512
      }
    ],
    images: [
      {
        image_id: 9511,
        id: 95,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          9501
        ]
      },
      {
        image_id: 9512,
        id: 95,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          9502
        ]
      }
    ]
  },
  {
    id: 96,
    title: "Perky Blooms",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "orchids",
    collection: [
      "best sellers",
      "featured products"
    ],
    category: "flower",
    price: 90,
    sale: true,
    discount: "50",
    stock: 15,
    "new": true,
    tags: [
      "darkorange",
      "firebrick",
      "orchids"
    ],
    variants: [
      {
        variant_id: 9601,
        id: 96,
        sku: "989",
        color: "darkorange",
        image_id: 9611
      },
      {
        variant_id: 9602,
        id: 96,
        sku: "sku962",
        color: "firebrick",
        image_id: 9612
      }
    ],
    images: [
      {
        image_id: 9611,
        id: 96,
        alt: "darkorange",
        src: "1.jpg",
        variant_id: [
          9601
        ]
      },
      {
        image_id: 9612,
        id: 96,
        alt: "firebrick",
        src: "1.jpg",
        variant_id: [
          9602
        ]
      }
    ]
  },
  {
    id: 97,
    title: "Divine Love",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "orchids",
    collection: [
      "best sellers"
    ],
    category: "flower",
    price: 65,
    sale: false,
    discount: "20",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "white",
      "red",
      "orchids"
    ],
    variants: [
      {
        variant_id: 9701,
        id: 97,
        sku: "989",
        color: "white",
        image_id: 9711
      },
      {
        variant_id: 9702,
        id: 97,
        sku: "sku972",
        color: "red",
        image_id: 9712
      }
    ],
    images: [
      {
        image_id: 9711,
        id: 97,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          9701
        ]
      },
      {
        image_id: 9712,
        id: 97,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          9702
        ]
      }
    ]
  },
  {
    id: 98,
    title: "Charismatic Elanor",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "flower",
    price: 45,
    sale: true,
    discount: "5",
    stock: 15,
    "new": true,
    tags: [
      "firebrick",
      "yellow",
      "lilies"
    ],
    variants: [
      {
        variant_id: 9801,
        id: 98,
        sku: "989",
        color: "firebrick",
        image_id: 9811
      },
      {
        variant_id: 9802,
        id: 98,
        sku: "sku982",
        color: "yellow",
        image_id: 9812
      }
    ],
    images: [
      {
        image_id: 9811,
        id: 98,
        alt: "firebrick",
        src: "1.jpg",
        variant_id: [
          9801
        ]
      },
      {
        image_id: 9812,
        id: 98,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          9802
        ]
      }
    ]
  },
  {
    id: 99,
    title: "Orchid N Roses",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "best sellers"
    ],
    category: "flower",
    price: 105,
    sale: true,
    discount: "9",
    stock: 15,
    "new": true,
    tags: [
      "mediumpurple",
      "yellow",
      "lilies"
    ],
    variants: [
      {
        variant_id: 9901,
        id: 99,
        sku: "flow9",
        color: "mediumpurple",
        image_id: 9911
      },
      {
        variant_id: 9902,
        id: 99,
        sku: "sku92",
        color: "yellow",
        image_id: 9912
      }
    ],
    images: [
      {
        image_id: 9911,
        id: 99,
        alt: "mediumpurple",
        src: "1.jpg",
        variant_id: [
          9901
        ]
      },
      {
        image_id: 9912,
        id: 99,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          9902
        ]
      }
    ]
  },
  {
    id: 100,
    title: "Mix Rose Garden",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "flower",
    price: 170,
    sale: true,
    discount: "20",
    stock: 6,
    "new": true,
    tags: [
      "yellow",
      "darkorange",
      "lilies"
    ],
    variants: [
      {
        variant_id: 10001,
        id: 100,
        sku: "flow9",
        color: "yellow",
        image_id: 10011
      },
      {
        variant_id: 10002,
        id: 100,
        sku: "sku92",
        color: "darkorange",
        image_id: 10012
      }
    ],
    images: [
      {
        image_id: 10011,
        id: 100,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          10001
        ]
      },
      {
        image_id: 10012,
        id: 100,
        alt: "darkorange",
        src: "1.jpg",
        variant_id: [
          10002
        ]
      }
    ]
  },
  {
    id: 101,
    title: "Beauty Quotient",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "featured products"
    ],
    category: "flower",
    price: 199,
    sale: false,
    discount: "60",
    stock: 7,
    "new": true,
    tags: [
      "new",
      "hotpink",
      "darkorange",
      "lilies"
    ],
    variants: [
      {
        variant_id: 10101,
        id: 101,
        sku: "flow9",
        color: "hotpink",
        image_id: 10111
      },
      {
        variant_id: 10102,
        id: 101,
        sku: "sku92",
        color: "darkorange",
        image_id: 10112
      }
    ],
    images: [
      {
        image_id: 10111,
        id: 101,
        alt: "hotpink",
        src: "1.jpg",
        variant_id: [
          10101
        ]
      },
      {
        image_id: 10112,
        id: 101,
        alt: "darkorange",
        src: "1.jpg",
        variant_id: [
          10102
        ]
      }
    ]
  },
  {
    id: 102,
    title: "Rosy Radiance",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "featured products"
    ],
    category: "flower",
    price: 75,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "darkorange",
      "white",
      "lilies"
    ],
    variants: [
      {
        variant_id: 10201,
        id: 102,
        sku: "flow9",
        color: "darkorange",
        image_id: 10211
      },
      {
        variant_id: 10202,
        id: 102,
        sku: "sku92",
        color: "white",
        image_id: 10212
      }
    ],
    images: [
      {
        image_id: 10211,
        id: 102,
        alt: "darkorange",
        src: "1.jpg",
        variant_id: [
          10201
        ]
      },
      {
        image_id: 10212,
        id: 102,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          10202
        ]
      }
    ]
  },
  {
    id: 103,
    title: "Pink Horizons",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "featured products"
    ],
    category: "flower",
    price: 130,
    sale: true,
    discount: "18",
    stock: 9,
    "new": true,
    tags: [
      "hotpink",
      "yellow",
      "lilies"
    ],
    variants: [
      {
        variant_id: 10301,
        id: 103,
        sku: "flow9",
        color: "hotpink",
        image_id: 10311
      },
      {
        variant_id: 10302,
        id: 103,
        sku: "sku92",
        color: "yellow",
        image_id: 10312
      }
    ],
    images: [
      {
        image_id: 10311,
        id: 103,
        alt: "hotpink",
        src: "1.jpg",
        variant_id: [
          10301
        ]
      },
      {
        image_id: 10312,
        id: 103,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          10302
        ]
      }
    ]
  },
  {
    id: 104,
    title: "Charismatic Elanor",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "rose",
    collection: [
      "featured products",
      "on sale"
    ],
    category: "flower",
    price: 95,
    sale: true,
    discount: "32",
    stock: 35,
    "new": true,
    tags: [
      "coral",
      "pink",
      "rose"
    ],
    variants: [
      {
        variant_id: 10401,
        id: 104,
        sku: "flow9",
        color: "coral",
        image_id: 10411
      },
      {
        variant_id: 10402,
        id: 104,
        sku: "sku92",
        color: "pink",
        image_id: 10412
      }
    ],
    images: [
      {
        image_id: 10411,
        id: 104,
        alt: "coral",
        src: "1.jpg",
        variant_id: [
          10401
        ]
      },
      {
        image_id: 10412,
        id: 104,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          10402
        ]
      }
    ]
  },
  {
    id: 105,
    title: "Oozing Love",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "rose",
    collection: [
      "featured products",
      "on sale"
    ],
    category: "flower",
    price: 39,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "yellow",
      "red",
      "new",
      "rose"
    ],
    variants: [
      {
        variant_id: 10501,
        id: 105,
        sku: "flow9",
        color: "yellow",
        image_id: 10511
      },
      {
        variant_id: 10502,
        id: 105,
        sku: "sku92",
        color: "red",
        image_id: 10512
      }
    ],
    images: [
      {
        image_id: 10511,
        id: 105,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          10501
        ]
      },
      {
        image_id: 10512,
        id: 105,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          10502
        ]
      }
    ]
  },
  {
    id: 106,
    title: "Vivid Memories",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "orchids",
    collection: [
      "featured products",
      "best sellers"
    ],
    category: "flower",
    price: 29,
    sale: false,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "pink",
      "darkorange",
      "orchids"
    ],
    variants: [
      {
        variant_id: 10601,
        id: 106,
        sku: "flow9",
        color: "pink",
        image_id: 10611
      },
      {
        variant_id: 10602,
        id: 106,
        sku: "sku92",
        color: "darkorange",
        image_id: 10612
      }
    ],
    images: [
      {
        image_id: 10611,
        id: 106,
        alt: "pink",
        src: "1.jpg",
        variant_id: [
          10601
        ]
      },
      {
        image_id: 10612,
        id: 106,
        alt: "darkorange",
        src: "1.jpg",
        variant_id: [
          10602
        ]
      }
    ]
  },
  {
    id: 107,
    title: "Spectral bonanza",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "on sale",
      "best sellers"
    ],
    category: "flower",
    price: 50,
    sale: true,
    discount: "15",
    stock: 9,
    "new": true,
    tags: [
      "red",
      "yellow",
      "lilies"
    ],
    variants: [
      {
        variant_id: 10701,
        id: 107,
        sku: "flow9",
        color: "red",
        image_id: 10711
      },
      {
        variant_id: 10702,
        id: 107,
        sku: "sku92",
        color: "yellow",
        image_id: 10712
      }
    ],
    images: [
      {
        image_id: 10711,
        id: 107,
        alt: "red",
        src: "1.jpg",
        variant_id: [
          10701
        ]
      },
      {
        image_id: 10712,
        id: 107,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          10702
        ]
      }
    ]
  },
  {
    id: 108,
    title: "Lady Charmers",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "rose",
    collection: [
      "on sale"
    ],
    category: "flower",
    price: 35,
    sale: false,
    discount: "40",
    stock: 11,
    "new": true,
    tags: [
      "new",
      "deeppink",
      "coral",
      "rose"
    ],
    variants: [
      {
        variant_id: 10801,
        id: 108,
        sku: "flow9",
        color: "deeppink",
        image_id: 10811
      },
      {
        variant_id: 10802,
        id: 108,
        sku: "sku92",
        color: "coral",
        image_id: 10812
      }
    ],
    images: [
      {
        image_id: 10811,
        id: 108,
        alt: "deeppink",
        src: "1.jpg",
        variant_id: [
          10801
        ]
      },
      {
        image_id: 10812,
        id: 108,
        alt: "coral",
        src: "1.jpg",
        variant_id: [
          10802
        ]
      }
    ]
  },
  {
    id: 109,
    title: "Joyful Flowers",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "orchids",
    collection: [
      "on sale"
    ],
    category: "flower",
    price: 25,
    sale: false,
    discount: "50",
    stock: 30,
    "new": true,
    tags: [
      "new",
      "white",
      "yellow",
      "orchids"
    ],
    variants: [
      {
        variant_id: 10901,
        id: 109,
        sku: "flow9",
        color: "white",
        image_id: 10911
      },
      {
        variant_id: 10902,
        id: 109,
        sku: "sku92",
        color: "yellow",
        image_id: 10912
      }
    ],
    images: [
      {
        image_id: 10911,
        id: 109,
        alt: "white",
        src: "1.jpg",
        variant_id: [
          10901
        ]
      },
      {
        image_id: 10912,
        id: 109,
        alt: "yellow",
        src: "1.jpg",
        variant_id: [
          10902
        ]
      }
    ]
  },
  {
    id: 110,
    title: "Joyful Flowers",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "flower",
    brand: "lilies",
    collection: [
      "on sale",
      "featured products"
    ],
    category: "flower",
    price: 85,
    sale: true,
    discount: "12",
    stock: 1,
    "new": true,
    tags: [
      "darkorange",
      "mediumpurple",
      "lilies"
    ],
    variants: [
      {
        variant_id: 11001,
        id: 110,
        sku: "flow9",
        color: "darkorange",
        image_id: 11011
      },
      {
        variant_id: 11002,
        id: 110,
        sku: "sku92",
        color: "mediumpurple",
        image_id: 11012
      }
    ],
    images: [
      {
        image_id: 11011,
        id: 110,
        alt: "darkorange",
        src: "1.jpg",
        variant_id: [
          11001
        ]
      },
      {
        image_id: 11012,
        id: 110,
        alt: "mediumpurple",
        src: "1.jpg",
        variant_id: [
          11002
        ]
      }
    ]
  },
  {
    id: 111,
    title: "Steel Bowl Puppy",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "beneful",
    collection: [
      "on sale"
    ],
    category: "pets",
    price: 120,
    sale: false,
    discount: "5",
    stock: 0,
    "new": true,
    tags: [
      "new",
      "beneful"
    ],
    variants: [
      {
        variant_id: 11101,
        id: 111,
        sku: "flow9",
        image_id: 11111
      }
    ],
    images: [
      {
        image_id: 11111,
        id: 111,
        alt: "bowl",
        src: "6.jpg",
        variant_id: [
          11101
        ]
      }
    ]
  },
  {
    id: 112,
    title: "Calcium Milk Bone",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "hello-pet",
    collection: [
      "on sale"
    ],
    category: "pets",
    price: 140,
    sale: true,
    discount: "5",
    stock: 15,
    "new": false,
    tags: [
      "hello-pet"
    ],
    variants: [
      {
        variant_id: 11201,
        id: 112,
        sku: "bone9",
        image_id: 11211
      }
    ],
    images: [
      {
        image_id: 11211,
        id: 112,
        alt: "bone",
        src: "6.jpg",
        variant_id: [
          11201
        ]
      }
    ]
  },
  {
    id: 113,
    title: "Dog Sleep Mat",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "beneful",
    collection: [
      "best sellers"
    ],
    category: "pets",
    price: 136,
    sale: false,
    discount: "10",
    stock: 1,
    "new": false,
    tags: [
      "new",
      "beneful",
      "pink"
    ],
    variants: [
      {
        variant_id: 11301,
        id: 113,
        sku: "mat9",
        image_id: 11311
      }
    ],
    images: [
      {
        image_id: 11311,
        id: 113,
        alt: "mat",
        src: "6.jpg",
        variant_id: [
          11301
        ]
      }
    ]
  },
  {
    id: 114,
    title: "Dog Super Bone toy",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "buddy",
    collection: [
      "best sellers"
    ],
    category: "pets",
    price: 149,
    sale: true,
    discount: "14",
    stock: 15,
    "new": true,
    tags: [
      "buddy"
    ],
    variants: [
      {
        variant_id: 11401,
        id: 114,
        sku: "toy9",
        image_id: 11411
      }
    ],
    images: [
      {
        image_id: 11411,
        id: 114,
        alt: "toy",
        src: "6.jpg",
        variant_id: [
          11401
        ]
      }
    ]
  },
  {
    id: 115,
    title: "Pet Cooling Bed",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "sleeky",
    collection: [
      "best sellers"
    ],
    category: "pets",
    price: 102,
    sale: false,
    discount: "6",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "sleeky"
    ],
    variants: [
      {
        variant_id: 11501,
        id: 115,
        sku: "bed9",
        image_id: 11511
      }
    ],
    images: [
      {
        image_id: 11511,
        id: 115,
        alt: "bed",
        src: "6.jpg",
        variant_id: [
          11501
        ]
      }
    ]
  },
  {
    id: 116,
    title: "Premium Steel Bowl",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "hello-pet",
    collection: [
      "best sellers"
    ],
    category: "pets",
    price: 176,
    sale: true,
    discount: "26",
    stock: 15,
    "new": false,
    tags: [
      "hello-pet"
    ],
    variants: [
      {
        variant_id: 11601,
        id: 116,
        sku: "bowl9",
        image_id: 11611
      }
    ],
    images: [
      {
        image_id: 11611,
        id: 116,
        alt: "bowl",
        src: "6.jpg",
        variant_id: [
          11601
        ]
      }
    ]
  },
  {
    id: 117,
    title: "Calcium Bone snack",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "buddy",
    collection: [
      "on sale"
    ],
    category: "pets",
    price: 196,
    sale: true,
    discount: "35",
    stock: 45,
    "new": true,
    tags: [
      "new",
      "buddy"
    ],
    variants: [
      {
        variant_id: 11701,
        id: 117,
        sku: "snack9",
        image_id: 11711
      }
    ],
    images: [
      {
        image_id: 11711,
        id: 117,
        alt: "snack",
        src: "6.jpg",
        variant_id: [
          11701
        ]
      }
    ]
  },
  {
    id: 118,
    title: "Snack Milk Stix",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "hello-pet",
    collection: [
      "on sale"
    ],
    category: "pets",
    price: 180,
    sale: false,
    discount: "40",
    stock: 15,
    "new": false,
    tags: [
      "new",
      "hello-pet"
    ],
    variants: [
      {
        variant_id: 11801,
        id: 118,
        sku: "milk9",
        image_id: 11811
      }
    ],
    images: [
      {
        image_id: 11811,
        id: 118,
        alt: "milk",
        src: "6.jpg",
        variant_id: [
          11801
        ]
      }
    ]
  },
  {
    id: 119,
    title: "Steel Bowl cats",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "sleeky",
    collection: [
      "on sale"
    ],
    category: "pets",
    price: 125,
    sale: false,
    discount: "40",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "sleeky"
    ],
    variants: [
      {
        variant_id: 11901,
        id: 119,
        sku: "cats9",
        image_id: 11911
      }
    ],
    images: [
      {
        image_id: 11911,
        id: 119,
        alt: "cats",
        src: "6.jpg",
        variant_id: [
          11901
        ]
      }
    ]
  },
  {
    id: 120,
    title: "Steel Bowl Puppy ",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "pets",
    brand: "beneful",
    collection: [
      "best sellers"
    ],
    category: "pets",
    price: 225,
    sale: true,
    discount: "10",
    stock: 0,
    "new": false,
    tags: [
      "beneful"
    ],
    variants: [
      {
        variant_id: 12001,
        id: 120,
        sku: "flow9",
        image_id: 12011
      }
    ],
    images: [
      {
        image_id: 12011,
        id: 120,
        alt: "bowl",
        src: "6.jpg",
        variant_id: [
          12001
        ]
      }
    ]
  },
  {
    id: 121,
    title: "electonics 1",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "sony",
    collection: [
      "best sellers"
    ],
    category: "electronics",
    price: 335,
    sale: false,
    discount: "10",
    stock: 20,
    "new": false,
    tags: [
      "sony"
    ],
    variants: [
      {
        variant_id: 12101,
        id: 121,
        sku: "sony19",
        image_id: 12111
      }
    ],
    images: [
      {
        image_id: 12111,
        id: 121,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12101
        ]
      }
    ]
  },
  {
    id: 122,
    title: "electonics 2",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "panasonic",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "electronics",
    price: 285,
    sale: true,
    discount: "24",
    stock: 15,
    "new": true,
    tags: [
      "panasonic",
      "new"
    ],
    variants: [
      {
        variant_id: 12201,
        id: 122,
        sku: "sony19",
        image_id: 12211
      }
    ],
    images: [
      {
        image_id: 12211,
        id: 122,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12201
        ]
      }
    ]
  },
  {
    id: 123,
    title: "electonics 3",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "philips",
    collection: [
      "best sellers",
      "featured products"
    ],
    category: "electronics",
    price: 425,
    sale: false,
    discount: "60",
    stock: 15,
    "new": false,
    tags: [
      "philips"
    ],
    variants: [
      {
        variant_id: 12301,
        id: 123,
        sku: "philp19",
        image_id: 12311
      }
    ],
    images: [
      {
        image_id: 12311,
        id: 123,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12301
        ]
      }
    ]
  },
  {
    id: 124,
    title: "electonics 4",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "lenovo",
    collection: [
      "best sellers",
      "featured products"
    ],
    category: "electronics",
    price: 495,
    sale: false,
    discount: "30",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "lenovo"
    ],
    variants: [
      {
        variant_id: 12401,
        id: 124,
        sku: "philp19",
        image_id: 12411
      }
    ],
    images: [
      {
        image_id: 12411,
        id: 124,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12401
        ]
      }
    ]
  },
  {
    id: 125,
    title: "electonics 5",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "sony",
    collection: [
      "best sellers",
      "featured products"
    ],
    category: "electronics",
    price: 260,
    sale: false,
    discount: "90",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "sony"
    ],
    variants: [
      {
        variant_id: 12501,
        id: 125,
        sku: "philp19",
        image_id: 12511
      }
    ],
    images: [
      {
        image_id: 12511,
        id: 125,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12501
        ]
      }
    ]
  },
  {
    id: 126,
    title: "electonics 6",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "panasonic",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "electronics",
    price: 185,
    sale: false,
    discount: "40",
    stock: 2,
    "new": false,
    tags: [
      "panasonic"
    ],
    variants: [
      {
        variant_id: 12601,
        id: 126,
        sku: "new19",
        image_id: 12611
      }
    ],
    images: [
      {
        image_id: 12611,
        id: 126,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12601
        ]
      }
    ]
  },
  {
    id: 127,
    title: "electonics 7",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "samsung",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "electronics",
    price: 650,
    sale: true,
    discount: "20",
    stock: 5,
    "new": false,
    tags: [
      "samsung"
    ],
    variants: [
      {
        variant_id: 12701,
        id: 127,
        sku: "samsung19",
        image_id: 12711
      }
    ],
    images: [
      {
        image_id: 12711,
        id: 127,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12701
        ]
      }
    ]
  },
  {
    id: 128,
    title: "electonics 8",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "apple",
    collection: [
      "best sellers",
      "on sale"
    ],
    category: "electronics",
    price: 265,
    sale: false,
    discount: "20",
    stock: 2,
    "new": true,
    tags: [
      "apple"
    ],
    variants: [
      {
        variant_id: 12801,
        id: 128,
        sku: "apple19",
        image_id: 12811
      }
    ],
    images: [
      {
        image_id: 12811,
        id: 128,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12801
        ]
      }
    ]
  },
  {
    id: 129,
    title: "electonics 9",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "samsung",
    collection: [
      "best sellers",
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 375,
    sale: false,
    discount: "10",
    stock: 8,
    "new": false,
    tags: [
      "samsung"
    ],
    variants: [
      {
        variant_id: 12901,
        id: 129,
        sku: "samsung19",
        image_id: 12911
      }
    ],
    images: [
      {
        image_id: 12911,
        id: 129,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          12901
        ]
      }
    ]
  },
  {
    id: 130,
    title: "electonics 10",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "samsung",
    collection: [
      "best sellers",
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 560,
    sale: true,
    discount: "25",
    stock: 4,
    "new": true,
    tags: [
      "samsung"
    ],
    variants: [
      {
        variant_id: 13001,
        id: 130,
        sku: "samsung19",
        image_id: 13011
      }
    ],
    images: [
      {
        image_id: 13011,
        id: 130,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13001
        ]
      }
    ]
  },
  {
    id: 131,
    title: "electonics 11",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "apple",
    collection: [
      "best sellers",
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 489,
    sale: true,
    discount: "40",
    stock: 2,
    "new": true,
    tags: [
      "apple"
    ],
    variants: [
      {
        variant_id: 13101,
        id: 131,
        sku: "apple19",
        image_id: 13111
      }
    ],
    images: [
      {
        image_id: 13111,
        id: 131,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13101
        ]
      }
    ]
  },
  {
    id: 132,
    title: "electonics 12",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "lenovo",
    collection: [
      "best sellers",
      "featured products"
    ],
    category: "electronics",
    price: 349,
    sale: false,
    discount: "30",
    stock: 30,
    "new": false,
    tags: [
      "lenovo"
    ],
    variants: [
      {
        variant_id: 13201,
        id: 132,
        sku: "apple19",
        image_id: 13211
      }
    ],
    images: [
      {
        image_id: 13211,
        id: 132,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13201
        ]
      }
    ]
  },
  {
    id: 133,
    title: "electonics 13",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "phillips",
    collection: [
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 295,
    sale: false,
    discount: "60",
    stock: 10,
    "new": true,
    tags: [
      "phillips",
      "new"
    ],
    variants: [
      {
        variant_id: 13301,
        id: 133,
        sku: "apple19",
        image_id: 13311
      }
    ],
    images: [
      {
        image_id: 13311,
        id: 133,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13301
        ]
      }
    ]
  },
  {
    id: 134,
    title: "electonics 14",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "phillips",
    collection: [
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 510,
    sale: false,
    discount: "40",
    stock: 48,
    "new": true,
    tags: [
      "new",
      "phillips"
    ],
    variants: [
      {
        variant_id: 13401,
        id: 134,
        sku: "apple19",
        image_id: 13411
      }
    ],
    images: [
      {
        image_id: 13411,
        id: 134,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13401
        ]
      }
    ]
  },
  {
    id: 135,
    title: "electonics 15",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "panasonic",
    collection: [
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 630,
    sale: true,
    discount: "30",
    stock: 10,
    "new": false,
    tags: [
      "panasonic"
    ],
    variants: [
      {
        variant_id: 13501,
        id: 135,
        sku: "apple19",
        image_id: 13511
      }
    ],
    images: [
      {
        image_id: 13511,
        id: 135,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13501
        ]
      }
    ]
  },
  {
    id: 136,
    title: "electonics 16",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "phillips",
    collection: [
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 680,
    sale: true,
    discount: "80",
    stock: 3,
    "new": false,
    tags: [
      "phillips"
    ],
    variants: [
      {
        variant_id: 13601,
        id: 136,
        sku: "apple19",
        image_id: 13611
      }
    ],
    images: [
      {
        image_id: 13611,
        id: 136,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13601
        ]
      }
    ]
  },
  {
    id: 137,
    title: "electonics 17",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "electronics",
    brand: "apple",
    collection: [
      "on sale",
      "featured products"
    ],
    category: "electronics",
    price: 480,
    sale: true,
    discount: "50",
    stock: 4,
    "new": true,
    tags: [
      "apple",
      "new"
    ],
    variants: [
      {
        variant_id: 13701,
        id: 137,
        sku: "apple19",
        image_id: 13711
      }
    ],
    images: [
      {
        image_id: 13711,
        id: 137,
        alt: "electronics",
        src: "7.jpg",
        variant_id: [
          13701
        ]
      }
    ]
  },
  {
    id: 138,
    title: "beetroot",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 35,
    sale: true,
    discount: "10",
    stock: 50,
    "new": true,
    tags: [
      "new",
      "vegetable"
    ],
    variants: [
      {
        variant_id: 13801,
        id: 138,
        sku: "beet123",
        image_id: 13811
      }
    ],
    images: [
      {
        image_id: 13811,
        id: 138,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          13801
        ]
      }
    ]
  },
  {
    id: 139,
    title: "cabbage",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 25,
    sale: false,
    discount: "20",
    stock: 15,
    "new": false,
    tags: [
      "vegetable"
    ],
    variants: [
      {
        variant_id: 13901,
        id: 139,
        sku: "apple19",
        image_id: 13911
      }
    ],
    images: [
      {
        image_id: 13911,
        id: 139,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          13901
        ]
      }
    ]
  },
  {
    id: 140,
    title: "Onion",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 29,
    sale: false,
    discount: "5",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14001,
        id: 140,
        sku: "vege19",
        image_id: 14011
      }
    ],
    images: [
      {
        image_id: 14011,
        id: 140,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14001
        ]
      }
    ]
  },
  {
    id: 141,
    title: "brinjal",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 20,
    sale: false,
    discount: "2",
    stock: 30,
    "new": false,
    tags: [
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14101,
        id: 141,
        sku: "vege14",
        image_id: 14111
      }
    ],
    images: [
      {
        image_id: 14111,
        id: 141,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14101
        ]
      }
    ]
  },
  {
    id: 142,
    title: "cucumber",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 44,
    sale: true,
    discount: "20",
    stock: 20,
    "new": false,
    tags: [
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14201,
        id: 142,
        sku: "vege56",
        image_id: 14211
      }
    ],
    images: [
      {
        image_id: 14211,
        id: 142,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14201
        ]
      }
    ]
  },
  {
    id: 143,
    title: "Tomato",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 40,
    sale: false,
    discount: "10",
    stock: 40,
    "new": true,
    tags: [
      "new",
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14301,
        id: 143,
        sku: "vege654",
        image_id: 14311
      }
    ],
    images: [
      {
        image_id: 14311,
        id: 143,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14301
        ]
      }
    ]
  },
  {
    id: 144,
    title: "garlic",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 55,
    sale: false,
    discount: "40",
    stock: 15,
    "new": false,
    tags: [
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14401,
        id: 144,
        sku: "vege19",
        image_id: 14411
      }
    ],
    images: [
      {
        image_id: 14411,
        id: 144,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14401
        ]
      }
    ]
  },
  {
    id: 145,
    title: "cauliflower",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 70,
    sale: false,
    discount: "20",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14501,
        id: 145,
        sku: "vege94",
        image_id: 14511
      }
    ],
    images: [
      {
        image_id: 14511,
        id: 145,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14501
        ]
      }
    ]
  },
  {
    id: 146,
    title: "capsicum",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 80,
    sale: true,
    discount: "50",
    stock: 38,
    "new": false,
    tags: [
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14601,
        id: 146,
        sku: "vege134",
        image_id: 14611
      }
    ],
    images: [
      {
        image_id: 14611,
        id: 146,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14601
        ]
      }
    ]
  },
  {
    id: 147,
    title: "carrot",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "vegetable",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 56,
    sale: true,
    discount: "10",
    stock: 25,
    "new": true,
    tags: [
      "new",
      "vegetable"
    ],
    variants: [
      {
        variant_id: 14701,
        id: 147,
        sku: "vege414",
        image_id: 14711
      }
    ],
    images: [
      {
        image_id: 14711,
        id: 147,
        alt: "vegetables",
        src: "8.jpg",
        variant_id: [
          14701
        ]
      }
    ]
  },
  {
    id: 148,
    title: "apple",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "fruits",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 72,
    sale: false,
    discount: "10",
    stock: 50,
    "new": true,
    tags: [
      "new",
      "fruits"
    ],
    variants: [
      {
        variant_id: 14801,
        id: 148,
        sku: "fruits9",
        image_id: 14811
      }
    ],
    images: [
      {
        image_id: 14811,
        id: 148,
        alt: "fruits",
        src: "8.jpg",
        variant_id: [
          14801
        ]
      }
    ]
  },
  {
    id: 149,
    title: "kiwi",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "fruits",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 95,
    sale: true,
    discount: "10",
    stock: 30,
    "new": false,
    tags: [
      "fruits"
    ],
    variants: [
      {
        variant_id: 14901,
        id: 149,
        sku: "fruits4",
        image_id: 14911
      }
    ],
    images: [
      {
        image_id: 14911,
        id: 149,
        alt: "fruits",
        src: "8.jpg",
        variant_id: [
          14901
        ]
      }
    ]
  },
  {
    id: 150,
    title: "banana",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "vegetables",
    brand: "fruits",
    collection: [
      "on sale"
    ],
    category: "vegetables",
    price: 60,
    sale: true,
    discount: "25",
    stock: 25,
    "new": true,
    tags: [
      "new",
      "fruits"
    ],
    variants: [
      {
        variant_id: 15001,
        id: 150,
        sku: "fruits4",
        image_id: 15011
      }
    ],
    images: [
      {
        image_id: 15011,
        id: 150,
        alt: "fruits",
        src: "8.jpg",
        variant_id: [
          15001
        ]
      }
    ]
  },
  {
    id: 151,
    title: "arm chair",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "casacraft",
    collection: [
      "on sale"
    ],
    category: "furniture",
    price: 250,
    sale: false,
    discount: "20",
    stock: 6,
    "new": true,
    tags: [
      "casacraft",
      "saddlebrown",
      "darkolivegreen"
    ],
    variants: [
      {
        variant_id: 15101,
        id: 151,
        sku: "chair15",
        color: "saddlebrown",
        image_id: 15111
      },
      {
        variant_id: 15102,
        id: 151,
        sku: "chair15",
        color: "darkolivegreen",
        image_id: 15112
      }
    ],
    images: [
      {
        image_id: 15111,
        id: 151,
        alt: "saddlebrown",
        src: "3.jpg",
        variant_id: [
          15101
        ]
      },
      {
        image_id: 15112,
        id: 151,
        alt: "darkolivegreen",
        src: "3.jpg",
        variant_id: [
          15102
        ]
      }
    ]
  },
  {
    id: 152,
    title: "oak Finish chair",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "woodsworth",
    collection: [
      "on sale"
    ],
    category: "furniture",
    price: 290,
    sale: false,
    discount: "5",
    stock: 1,
    "new": false,
    tags: [
      "woodsworth",
      "bisque",
      "saddlebrown"
    ],
    variants: [
      {
        variant_id: 15201,
        id: 152,
        sku: "chair15",
        color: "bisque",
        image_id: 15211
      },
      {
        variant_id: 15202,
        id: 152,
        sku: "chair15",
        color: "saddlebrown",
        image_id: 15212
      }
    ],
    images: [
      {
        image_id: 15211,
        id: 152,
        alt: "bisque",
        src: "3.jpg",
        variant_id: [
          15201
        ]
      },
      {
        image_id: 15212,
        id: 152,
        alt: "saddlebrown",
        src: "3.jpg",
        variant_id: [
          15202
        ]
      }
    ]
  },
  {
    id: 153,
    title: "wooden chair",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "casacraft",
    collection: [
      "on sale"
    ],
    category: "furniture",
    price: 400,
    sale: false,
    discount: "60",
    stock: 0,
    "new": true,
    tags: [
      "casacraft",
      "antiquewhite",
      "chocolate"
    ],
    variants: [
      {
        variant_id: 15301,
        id: 153,
        sku: "chair15",
        color: "antiquewhite",
        image_id: 15311
      },
      {
        variant_id: 15302,
        id: 153,
        sku: "chair15",
        color: "chocolate",
        image_id: 15312
      }
    ],
    images: [
      {
        image_id: 15311,
        id: 153,
        alt: "antiquewhite",
        src: "3.jpg",
        variant_id: [
          15301
        ]
      },
      {
        image_id: 15312,
        id: 153,
        alt: "chocolate",
        src: "3.jpg",
        variant_id: [
          15302
        ]
      }
    ]
  },
  {
    id: 154,
    title: "Metal Table Lamp",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "woodsworth",
    collection: [
      "on sale"
    ],
    category: "furniture",
    price: 300,
    sale: false,
    discount: "20",
    stock: 15,
    "new": true,
    tags: [
      "woodsworth",
      "coral",
      "burlywood"
    ],
    variants: [
      {
        variant_id: 15401,
        id: 154,
        sku: "chair15",
        color: "coral",
        image_id: 15411
      },
      {
        variant_id: 15402,
        id: 154,
        sku: "chair15",
        color: "burlywood",
        image_id: 15412
      }
    ],
    images: [
      {
        image_id: 15411,
        id: 154,
        alt: "coral",
        src: "3.jpg",
        variant_id: [
          15401
        ]
      },
      {
        image_id: 15412,
        id: 154,
        alt: "burlywood",
        src: "3.jpg",
        variant_id: [
          15402
        ]
      }
    ]
  },
  {
    id: 155,
    title: "Wood End Table",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "hometown",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "furniture",
    price: 500,
    sale: false,
    discount: "20",
    stock: 0,
    "new": true,
    tags: [
      "new",
      "hometown",
      "coral",
      "burlywood"
    ],
    variants: [
      {
        variant_id: 15501,
        id: 155,
        sku: "chair15",
        color: "coral",
        image_id: 15511
      },
      {
        variant_id: 15502,
        id: 155,
        sku: "chair15",
        color: "burlywood",
        image_id: 15512
      }
    ],
    images: [
      {
        image_id: 15511,
        id: 155,
        alt: "coral",
        src: "3.jpg",
        variant_id: [
          15501
        ]
      },
      {
        image_id: 15512,
        id: 155,
        alt: "burlywood",
        src: "3.jpg",
        variant_id: [
          15502
        ]
      }
    ]
  },
  {
    id: 156,
    title: "Lounge Chair",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "casacraft",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "furniture",
    price: 420,
    sale: true,
    discount: "10",
    stock: 25,
    "new": false,
    tags: [
      "casacraft",
      "yellow",
      "burlywood"
    ],
    variants: [
      {
        variant_id: 15601,
        id: 156,
        sku: "chair15",
        color: "yellow",
        image_id: 15611
      },
      {
        variant_id: 15602,
        id: 156,
        sku: "chair15",
        color: "burlywood",
        image_id: 15612
      }
    ],
    images: [
      {
        image_id: 15611,
        id: 156,
        alt: "yellow",
        src: "3.jpg",
        variant_id: [
          15601
        ]
      },
      {
        image_id: 15612,
        id: 156,
        alt: "burlywood",
        src: "3.jpg",
        variant_id: [
          15602
        ]
      }
    ]
  },
  {
    id: 157,
    title: "Rocking Chair",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "casacraft",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "furniture",
    price: 560,
    sale: true,
    discount: "20",
    stock: 2,
    "new": false,
    tags: [
      "casacraft",
      "white",
      "bisque"
    ],
    variants: [
      {
        variant_id: 15701,
        id: 157,
        sku: "chair15",
        color: "white",
        image_id: 15711
      },
      {
        variant_id: 15702,
        id: 157,
        sku: "chair15",
        color: "bisque",
        image_id: 15712
      }
    ],
    images: [
      {
        image_id: 15711,
        id: 157,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          15701
        ]
      },
      {
        image_id: 15712,
        id: 157,
        alt: "bisque",
        src: "3.jpg",
        variant_id: [
          15702
        ]
      }
    ]
  },
  {
    id: 158,
    title: "Barrel Chair",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "woodsworth",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "furniture",
    price: 610,
    sale: true,
    discount: "25",
    stock: 25,
    "new": false,
    tags: [
      "woodsworth",
      "darkslategrey",
      "chocolate"
    ],
    variants: [
      {
        variant_id: 15801,
        id: 158,
        sku: "chair15",
        color: "darkslategrey",
        image_id: 15811
      },
      {
        variant_id: 15802,
        id: 158,
        sku: "chair15",
        color: "chocolate",
        image_id: 15812
      }
    ],
    images: [
      {
        image_id: 15811,
        id: 158,
        alt: "darkslategrey",
        src: "3.jpg",
        variant_id: [
          15801
        ]
      },
      {
        image_id: 15812,
        id: 158,
        alt: "chocolate",
        src: "3.jpg",
        variant_id: [
          15802
        ]
      }
    ]
  },
  {
    id: 159,
    title: "folding Chairs",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "woodsworth",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "furniture",
    price: 330,
    sale: false,
    discount: "20",
    stock: 20,
    "new": true,
    tags: [
      "woodsworth",
      "white",
      "chocolate"
    ],
    variants: [
      {
        variant_id: 15901,
        id: 159,
        sku: "chair15",
        color: "white",
        image_id: 15911
      },
      {
        variant_id: 15902,
        id: 159,
        sku: "chair15",
        color: "chocolate",
        image_id: 15912
      }
    ],
    images: [
      {
        image_id: 15911,
        id: 159,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          15901
        ]
      },
      {
        image_id: 15912,
        id: 159,
        alt: "bisque",
        src: "3.jpg",
        variant_id: [
          15902
        ]
      }
    ]
  },
  {
    id: 160,
    title: "Hanging ligths",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "hometown",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "furniture",
    price: 195,
    sale: false,
    discount: "10",
    stock: 2,
    "new": false,
    tags: [
      "hometown",
      "darkred"
    ],
    variants: [
      {
        variant_id: 16001,
        id: 160,
        sku: "chair15",
        color: "darkred",
        image_id: 16011
      }
    ],
    images: [
      {
        image_id: 16011,
        id: 160,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          16001
        ]
      }
    ]
  },
  {
    id: 161,
    title: "Console tables",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "woodsworth",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "furniture",
    price: 450,
    sale: true,
    discount: "22",
    stock: 2,
    "new": false,
    tags: [
      "woodsworth",
      "darkgoldenrod",
      "coral"
    ],
    variants: [
      {
        variant_id: 16101,
        id: 161,
        sku: "chair15",
        color: "darkgoldenrod",
        image_id: 16111
      },
      {
        variant_id: 16102,
        id: 161,
        sku: "chair15",
        color: "coral",
        image_id: 16112
      }
    ],
    images: [
      {
        image_id: 16111,
        id: 161,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          16101
        ]
      },
      {
        image_id: 16112,
        id: 161,
        alt: "bisque",
        src: "3.jpg",
        variant_id: [
          16102
        ]
      }
    ]
  },
  {
    id: 162,
    title: "sofa sets",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "woodsworth",
    collection: [
      "best sellers",
      "new arrival"
    ],
    category: "furniture",
    price: 574,
    sale: true,
    discount: "30",
    stock: 6,
    "new": false,
    tags: [
      "woodsworth",
      "dodgerblue",
      "yellowgreen"
    ],
    variants: [
      {
        variant_id: 16201,
        id: 162,
        sku: "chair15",
        color: "dodgerblue",
        image_id: 16211
      },
      {
        variant_id: 16202,
        id: 162,
        sku: "chair15",
        color: "yellowgreen",
        image_id: 16212
      }
    ],
    images: [
      {
        image_id: 16211,
        id: 162,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          16201
        ]
      },
      {
        image_id: 16212,
        id: 162,
        alt: "bisque",
        src: "3.jpg",
        variant_id: [
          16202
        ]
      }
    ]
  },
  {
    id: 163,
    title: "Wardrobes",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "hometown",
    collection: [
      "best sellers"
    ],
    category: "furniture",
    price: 630,
    sale: true,
    discount: "50",
    stock: 6,
    "new": false,
    tags: [
      "hometown",
      "burlywood",
      "brown"
    ],
    variants: [
      {
        variant_id: 16301,
        id: 163,
        sku: "chair15",
        color: "burlywood",
        image_id: 16311
      },
      {
        variant_id: 16302,
        id: 163,
        sku: "chair15",
        color: "brown",
        image_id: 16312
      }
    ],
    images: [
      {
        image_id: 16311,
        id: 163,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          16301
        ]
      },
      {
        image_id: 16312,
        id: 163,
        alt: "bisque",
        src: "3.jpg",
        variant_id: [
          16302
        ]
      }
    ]
  },
  {
    id: 164,
    title: "Recliner in gray",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "casacraft",
    collection: [
      "best sellers"
    ],
    category: "furniture",
    price: 410,
    sale: false,
    discount: "12",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "dimgray",
      "casacraft"
    ],
    variants: [
      {
        variant_id: 16401,
        id: 164,
        sku: "chair15",
        color: "white",
        image_id: 16411
      }
    ],
    images: [
      {
        image_id: 16411,
        id: 164,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          16401
        ]
      }
    ]
  },
  {
    id: 165,
    title: "coffee tables",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "hometown",
    collection: [
      "best sellers"
    ],
    category: "furniture",
    price: 500,
    sale: false,
    discount: "20",
    stock: 20,
    "new": false,
    tags: [
      "hometown",
      "firebrick",
      "bisque"
    ],
    variants: [
      {
        variant_id: 16501,
        id: 165,
        sku: "chair15",
        color: "firebrick",
        image_id: 16511
      },
      {
        variant_id: 16502,
        id: 165,
        sku: "chair15",
        color: "bisque",
        image_id: 16512
      }
    ],
    images: [
      {
        image_id: 16511,
        id: 165,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          16501
        ]
      },
      {
        image_id: 16512,
        id: 165,
        alt: "bisque",
        src: "3.jpg",
        variant_id: [
          16502
        ]
      }
    ]
  },
  {
    id: 166,
    title: "Filament Bulbs",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "furniture",
    brand: "woodsworth",
    collection: [
      "best sellers"
    ],
    category: "furniture",
    price: 315,
    sale: true,
    discount: "5",
    stock: 10,
    "new": true,
    tags: [
      "woodsworth",
      "bisque"
    ],
    variants: [
      {
        variant_id: 16602,
        id: 166,
        sku: "chair15",
        color: "bisque",
        image_id: 16612
      }
    ],
    images: [
      {
        image_id: 16611,
        id: 166,
        alt: "white",
        src: "3.jpg",
        variant_id: [
          16601
        ]
      }
    ]
  },
  {
    id: 167,
    title: "Foundation",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "lakme",
    collection: [
      "best sellers"
    ],
    category: "beauty",
    price: 225,
    sale: false,
    discount: "10",
    stock: 0,
    "new": false,
    tags: [
      "lakme"
    ],
    variants: [
      {
        variant_id: 16701,
        id: 167,
        sku: "lakme5",
        image_id: 16711
      }
    ],
    images: [
      {
        image_id: 16711,
        id: 167,
        alt: "foundation",
        src: "1.jpg",
        variant_id: [
          16701
        ]
      },
      {
        image_id: 16712,
        id: 167,
        alt: "foundation",
        src: "1.jpg",
        variant_id: [
          16701
        ]
      }
    ]
  },
  {
    id: 168,
    title: "Bronzer",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "Maybelline",
    collection: [
      "best sellers"
    ],
    category: "beauty",
    price: 150,
    sale: false,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "new",
      "Maybelline"
    ],
    variants: [
      {
        variant_id: 16801,
        id: 168,
        sku: "lakme5",
        image_id: 16811
      }
    ],
    images: [
      {
        image_id: 16811,
        id: 168,
        alt: "Bronzer",
        src: "1.jpg",
        variant_id: [
          16801
        ]
      },
      {
        image_id: 16812,
        id: 168,
        alt: "Bronzer",
        src: "1.jpg",
        variant_id: [
          16801
        ]
      }
    ]
  },
  {
    id: 169,
    title: "Face Primer",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "Nykaa",
    collection: [
      "best sellers"
    ],
    category: "beauty",
    price: 312,
    sale: true,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "Nykaa"
    ],
    variants: [
      {
        variant_id: 16901,
        id: 169,
        sku: "lakme5",
        image_id: 16911
      }
    ],
    images: [
      {
        image_id: 16911,
        id: 169,
        alt: "Primer",
        src: "1.jpg",
        variant_id: [
          16901
        ]
      },
      {
        image_id: 16912,
        id: 169,
        alt: "Primer",
        src: "1.jpg",
        variant_id: [
          16901
        ]
      }
    ]
  },
  {
    id: 170,
    title: "Concealer",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "mac",
    collection: [
      "best sellers"
    ],
    category: "beauty",
    price: 130,
    sale: false,
    discount: "20",
    stock: 15,
    "new": false,
    tags: [
      "mac"
    ],
    variants: [
      {
        variant_id: 17001,
        id: 170,
        sku: "lakme5",
        image_id: 17011
      }
    ],
    images: [
      {
        image_id: 17011,
        id: 170,
        alt: "Concealer",
        src: "1.jpg",
        variant_id: [
          17001
        ]
      },
      {
        image_id: 17012,
        id: 170,
        alt: "Concealer",
        src: "1.jpg",
        variant_id: [
          17001
        ]
      }
    ]
  },
  {
    id: 171,
    title: "Mascara",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "Kiko",
    collection: [
      "best sellers"
    ],
    category: "beauty",
    price: 225,
    sale: false,
    discount: "50",
    stock: 15,
    "new": true,
    tags: [
      "Kiko"
    ],
    variants: [
      {
        variant_id: 17101,
        id: 171,
        sku: "lakme5",
        image_id: 17111
      }
    ],
    images: [
      {
        image_id: 17111,
        id: 171,
        alt: "Mascara",
        src: "1.jpg",
        variant_id: [
          17101
        ]
      },
      {
        image_id: 17112,
        id: 171,
        alt: "Mascara",
        src: "1.jpg",
        variant_id: [
          17101
        ]
      }
    ]
  },
  {
    id: 172,
    title: "Highlighter",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "mac",
    collection: [
      "on sale"
    ],
    category: "beauty",
    price: 300,
    sale: false,
    discount: "40",
    stock: 15,
    "new": false,
    tags: [
      "mac"
    ],
    variants: [
      {
        variant_id: 17201,
        id: 172,
        sku: "lakme5",
        image_id: 17211
      }
    ],
    images: [
      {
        image_id: 17211,
        id: 172,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17201
        ]
      },
      {
        image_id: 17212,
        id: 172,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17201
        ]
      }
    ]
  },
  {
    id: 173,
    title: "Lip Crayon",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "nyka",
    collection: [
      "on sale"
    ],
    category: "beauty",
    price: 265,
    sale: true,
    discount: "15",
    stock: 2,
    "new": true,
    tags: [
      "nyka"
    ],
    variants: [
      {
        variant_id: 17301,
        id: 173,
        sku: "lakme5",
        image_id: 17311
      }
    ],
    images: [
      {
        image_id: 17311,
        id: 173,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17301
        ]
      },
      {
        image_id: 17312,
        id: 173,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17301
        ]
      }
    ]
  },
  {
    id: 174,
    title: "Lipstick",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "Maybelline",
    collection: [
      "on sale"
    ],
    category: "beauty",
    price: 148,
    sale: false,
    discount: "10",
    stock: 25,
    "new": false,
    tags: [
      "Lipstick"
    ],
    variants: [
      {
        variant_id: 17401,
        id: 174,
        sku: "lakme5",
        image_id: 17411
      }
    ],
    images: [
      {
        image_id: 17411,
        id: 174,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17401
        ]
      },
      {
        image_id: 17412,
        id: 174,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17401
        ]
      }
    ]
  },
  {
    id: 175,
    title: "Compact",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "lakme",
    collection: [
      "on sale"
    ],
    category: "beauty",
    price: 160,
    sale: false,
    discount: "10",
    stock: 15,
    "new": true,
    tags: [
      "lakme"
    ],
    variants: [
      {
        variant_id: 17501,
        id: 175,
        sku: "lakme5",
        image_id: 17511
      }
    ],
    images: [
      {
        image_id: 17511,
        id: 175,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17501
        ]
      },
      {
        image_id: 17512,
        id: 175,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17501
        ]
      }
    ]
  },
  {
    id: 176,
    title: "Loose Powder",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "beauty",
    brand: "kiko",
    collection: [
      "on sale"
    ],
    category: "beauty",
    price: 290,
    sale: false,
    discount: "10",
    stock: 5,
    "new": false,
    tags: [
      "kiko"
    ],
    variants: [
      {
        variant_id: 17601,
        id: 176,
        sku: "lakme5",
        image_id: 17611
      }
    ],
    images: [
      {
        image_id: 17611,
        id: 176,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17601
        ]
      },
      {
        image_id: 17612,
        id: 176,
        alt: "Highlighter",
        src: "1.jpg",
        variant_id: [
          17601
        ]
      }
    ]
  },
  {
    id: 177,
    title: "Wheel Bearing",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "Hyundai",
    collection: [
      "on sale"
    ],
    category: "tools",
    price: 500,
    sale: true,
    discount: "10",
    stock: 20,
    "new": true,
    tags: [
      "Hyundai"
    ],
    variants: [
      {
        variant_id: 17701,
        id: 177,
        sku: "tools5",
        image_id: 17711
      }
    ],
    images: [
      {
        image_id: 17711,
        id: 177,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          17701
        ]
      }
    ]
  },
  {
    id: 178,
    title: "cable clutch",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "chevrolet",
    collection: [
      "on sale"
    ],
    category: "tools",
    price: 600,
    sale: false,
    discount: "30",
    stock: 15,
    "new": false,
    tags: [
      "chevrolet"
    ],
    variants: [
      {
        variant_id: 17801,
        id: 178,
        sku: "tools5",
        image_id: 17811
      }
    ],
    images: [
      {
        image_id: 17811,
        id: 178,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          17801
        ]
      }
    ]
  },
  {
    id: 179,
    title: "cap wheel",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "Hyundai",
    collection: [
      "on sale"
    ],
    category: "tools",
    price: 666,
    sale: false,
    discount: "20",
    stock: 20,
    "new": false,
    tags: [
      "Hyundai"
    ],
    variants: [
      {
        variant_id: 17901,
        id: 179,
        sku: "tools5",
        image_id: 17911
      }
    ],
    images: [
      {
        image_id: 17911,
        id: 179,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          17901
        ]
      }
    ]
  },
  {
    id: 180,
    title: "suspensons",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "fiat",
    collection: [
      "on sale"
    ],
    category: "tools",
    price: 480,
    sale: true,
    discount: "15",
    stock: 5,
    "new": true,
    tags: [
      "fiat"
    ],
    variants: [
      {
        variant_id: 18001,
        id: 180,
        sku: "tools56",
        image_id: 18011
      }
    ],
    images: [
      {
        image_id: 18011,
        id: 180,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18001
        ]
      }
    ]
  },
  {
    id: 181,
    title: "Lubricants",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "nissan",
    collection: [
      "on sale"
    ],
    category: "tools",
    price: 720,
    sale: true,
    discount: "15",
    stock: 30,
    "new": false,
    tags: [
      "nissan"
    ],
    variants: [
      {
        variant_id: 18101,
        id: 181,
        sku: "tools56",
        image_id: 18111
      }
    ],
    images: [
      {
        image_id: 18111,
        id: 181,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18101
        ]
      }
    ]
  },
  {
    id: 182,
    title: "Vacuum Pump, Brake",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "nissan",
    collection: [
      "on sale"
    ],
    category: "tools",
    price: 490,
    sale: true,
    discount: "5",
    stock: 2,
    "new": true,
    tags: [
      "nissan"
    ],
    variants: [
      {
        variant_id: 18201,
        id: 182,
        sku: "tools56",
        image_id: 18211
      }
    ],
    images: [
      {
        image_id: 18211,
        id: 182,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18201
        ]
      }
    ]
  },
  {
    id: 183,
    title: "oil filter",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "skoda",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 740,
    sale: true,
    discount: "20",
    stock: 3,
    "new": true,
    tags: [
      "skoda"
    ],
    variants: [
      {
        variant_id: 18301,
        id: 183,
        sku: "tools56",
        image_id: 18311
      }
    ],
    images: [
      {
        image_id: 18311,
        id: 183,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18301
        ]
      }
    ]
  },
  {
    id: 184,
    title: "air cleaner",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "skoda",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 670,
    sale: false,
    discount: "24",
    stock: 0,
    "new": false,
    tags: [
      "skoda"
    ],
    variants: [
      {
        variant_id: 18401,
        id: 184,
        sku: "tools46",
        image_id: 18411
      }
    ],
    images: [
      {
        image_id: 18411,
        id: 184,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18401
        ]
      }
    ]
  },
  {
    id: 185,
    title: "coil ignition",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "chevrolet",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 800,
    sale: false,
    discount: "10",
    stock: 30,
    "new": false,
    tags: [
      "chevrolet"
    ],
    variants: [
      {
        variant_id: 18501,
        id: 185,
        sku: "tools46",
        image_id: 18511
      }
    ],
    images: [
      {
        image_id: 18511,
        id: 185,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18501
        ]
      }
    ]
  },
  {
    id: 186,
    title: "glowplug",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "fiat",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 840,
    sale: false,
    discount: "20",
    stock: 6,
    "new": false,
    tags: [
      "fiat"
    ],
    variants: [
      {
        variant_id: 18601,
        id: 186,
        sku: "tools46",
        image_id: 18611
      }
    ],
    images: [
      {
        image_id: 18611,
        id: 186,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18601
        ]
      }
    ]
  },
  {
    id: 187,
    title: "shock absorber",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "fiat",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 700,
    sale: false,
    discount: "33",
    stock: 3,
    "new": true,
    tags: [
      "fiat"
    ],
    variants: [
      {
        variant_id: 18701,
        id: 187,
        sku: "tools46",
        image_id: 18711
      }
    ],
    images: [
      {
        image_id: 18711,
        id: 187,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18701
        ]
      }
    ]
  },
  {
    id: 188,
    title: "external engines",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "skoda",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 650,
    sale: true,
    discount: "15",
    stock: 5,
    "new": false,
    tags: [
      "skoda"
    ],
    variants: [
      {
        variant_id: 18801,
        id: 188,
        sku: "tools46",
        image_id: 18811
      }
    ],
    images: [
      {
        image_id: 18811,
        id: 188,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18801
        ]
      }
    ]
  },
  {
    id: 189,
    title: "tires and Wheel",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "chevrolet",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 735,
    sale: true,
    discount: "20",
    stock: 4,
    "new": false,
    tags: [
      "chevrolet"
    ],
    variants: [
      {
        variant_id: 18901,
        id: 189,
        sku: "tools46",
        image_id: 18911
      }
    ],
    images: [
      {
        image_id: 18911,
        id: 189,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          18901
        ]
      }
    ]
  },
  {
    id: 190,
    title: "gaskets",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "tools",
    brand: "fiat",
    collection: [
      "new products"
    ],
    category: "tools",
    price: 600,
    sale: true,
    discount: "5",
    stock: 565,
    "new": true,
    tags: [
      "fiat"
    ],
    variants: [
      {
        variant_id: 19001,
        id: 190,
        sku: "tools46",
        image_id: 19011
      }
    ],
    images: [
      {
        image_id: 19011,
        id: 190,
        alt: "tools",
        src: "9.jpg",
        variant_id: [
          19001
        ]
      }
    ]
  },
  {
    id: 191,
    title: "diamond ring",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Cartier",
    collection: [
      "on sale"
    ],
    category: "jewellery",
    price: 500,
    sale: true,
    discount: "10",
    stock: 25,
    "new": true,
    tags: [
      "sale"
    ],
    variants: [
      {
        variant_id: 19101,
        id: 191,
        sku: "jewellery46",
        image_id: 19111
      }
    ],
    images: [
      {
        image_id: 19111,
        id: 191,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19101
        ]
      }
    ]
  },
  {
    id: 192,
    title: "round pendant",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Malabar",
    collection: [
      "new arrival"
    ],
    category: "jewellery",
    price: 450,
    sale: true,
    discount: "15",
    stock: 5,
    "new": false,
    tags: [
      "Malabar"
    ],
    variants: [
      {
        variant_id: 19201,
        id: 192,
        sku: "jewellery46",
        image_id: 19211
      }
    ],
    images: [
      {
        image_id: 19211,
        id: 192,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19201
        ]
      }
    ]
  },
  {
    id: 193,
    title: "new bangles",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Tanishq",
    collection: [
      "on sale"
    ],
    category: "jewellery",
    price: 850,
    sale: false,
    discount: "60",
    stock: 5,
    "new": true,
    tags: [
      "Tanishq"
    ],
    variants: [
      {
        variant_id: 19301,
        id: 193,
        sku: "jewellery46",
        image_id: 19311
      }
    ],
    images: [
      {
        image_id: 19311,
        id: 193,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19301
        ]
      }
    ]
  },
  {
    id: 194,
    title: "new earings",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Tanishq",
    collection: [
      "new arrival"
    ],
    category: "jewellery",
    price: 600,
    sale: true,
    discount: "12",
    stock: 2,
    "new": true,
    tags: [
      "Tanishq"
    ],
    variants: [
      {
        variant_id: 19401,
        id: 194,
        sku: "jewellery46",
        image_id: 19411
      }
    ],
    images: [
      {
        image_id: 19411,
        id: 194,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19401
        ]
      }
    ]
  },
  {
    id: 195,
    title: "diamond necklace",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Cartier",
    collection: [
      "new arrival"
    ],
    category: "jewellery",
    price: 900,
    sale: true,
    discount: "15",
    stock: 10,
    "new": false,
    tags: [
      "Cartier"
    ],
    variants: [
      {
        variant_id: 19501,
        id: 195,
        sku: "jewellery46",
        image_id: 19511
      }
    ],
    images: [
      {
        image_id: 19511,
        id: 195,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19501
        ]
      }
    ]
  },
  {
    id: 196,
    title: "heart ring",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Tanishq",
    collection: [
      "new arrival"
    ],
    category: "jewellery",
    price: 200,
    sale: false,
    discount: "50",
    stock: 0,
    "new": true,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 19601,
        id: 196,
        sku: "jewellery46",
        image_id: 19611
      }
    ],
    images: [
      {
        image_id: 19611,
        id: 196,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19601
        ]
      }
    ]
  },
  {
    id: 197,
    title: "diamond brecelet",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Tanishq",
    collection: [
      "on sale",
      "new arrival"
    ],
    category: "jewellery",
    price: 399,
    sale: false,
    discount: "5",
    stock: 3,
    "new": true,
    tags: [
      "Tanishq"
    ],
    variants: [
      {
        variant_id: 19701,
        id: 197,
        sku: "jewellery46",
        image_id: 19711
      }
    ],
    images: [
      {
        image_id: 19711,
        id: 197,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19701
        ]
      }
    ]
  },
  {
    id: 198,
    title: "bangles set",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Malabar",
    collection: [
      "on sale"
    ],
    category: "jewellery",
    price: 849,
    sale: true,
    discount: "5",
    stock: 8,
    "new": false,
    tags: [
      "Malabar"
    ],
    variants: [
      {
        variant_id: 19801,
        id: 198,
        sku: "jewellery46",
        image_id: 19811
      }
    ],
    images: [
      {
        image_id: 19811,
        id: 198,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19801
        ]
      }
    ]
  },
  {
    id: 199,
    title: "choker necklace",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Cartier",
    collection: [
      "on sale"
    ],
    category: "jewellery",
    price: 719,
    sale: false,
    discount: "20",
    stock: 9,
    "new": false,
    tags: [
      "Cartier"
    ],
    variants: [
      {
        variant_id: 19901,
        id: 199,
        sku: "jewellery46",
        image_id: 19911
      }
    ],
    images: [
      {
        image_id: 19911,
        id: 199,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          19901
        ]
      }
    ]
  },
  {
    id: 200,
    title: "drop earings",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Tanishq",
    collection: [
      "new arrival"
    ],
    category: "jewellery",
    price: 250,
    sale: false,
    discount: "40",
    stock: 15,
    "new": false,
    tags: [
      "Tanishq"
    ],
    variants: [
      {
        variant_id: 20001,
        id: 200,
        sku: "jewellery46",
        image_id: 20011
      }
    ],
    images: [
      {
        image_id: 20011,
        id: 200,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          20001
        ]
      }
    ]
  },
  {
    id: 201,
    title: "cuff bracelet",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Tanishq",
    collection: [
      "new arrival"
    ],
    category: "jewellery",
    price: 449,
    sale: true,
    discount: "5",
    stock: 12,
    "new": false,
    tags: [
      "Tanishq"
    ],
    variants: [
      {
        variant_id: 20101,
        id: 201,
        sku: "jewellery46",
        image_id: 20111
      }
    ],
    images: [
      {
        image_id: 20111,
        id: 201,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          20101
        ]
      }
    ]
  },
  {
    id: 202,
    title: "couple rings",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Malabar",
    collection: [
      "new arrival"
    ],
    category: "jewellery",
    price: 749,
    sale: false,
    discount: "5",
    stock: 20,
    "new": true,
    tags: [
      "Malabar"
    ],
    variants: [
      {
        variant_id: 20201,
        id: 202,
        sku: "jewellery46",
        image_id: 20211
      }
    ],
    images: [
      {
        image_id: 20211,
        id: 202,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          20201
        ]
      }
    ]
  },
  {
    id: 203,
    title: "stud earings",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Cartier",
    collection: [
      "on sale"
    ],
    category: "jewellery",
    price: 300,
    sale: false,
    discount: "15",
    stock: 5,
    "new": true,
    tags: [
      "Cartier"
    ],
    variants: [
      {
        variant_id: 20301,
        id: 203,
        sku: "jewellery46",
        image_id: 20311
      }
    ],
    images: [
      {
        image_id: 20311,
        id: 203,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          20301
        ]
      }
    ]
  },
  {
    id: 204,
    title: "beaded necklace",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Malabar",
    collection: [
      "on sale"
    ],
    category: "jewellery",
    price: 650,
    sale: true,
    discount: "12",
    stock: 0,
    "new": false,
    tags: [
      "Malabar"
    ],
    variants: [
      {
        variant_id: 20401,
        id: 204,
        sku: "jewellery46",
        image_id: 20411
      }
    ],
    images: [
      {
        image_id: 20411,
        id: 204,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          20401
        ]
      }
    ]
  },
  {
    id: 205,
    title: "pendant necklace",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "jewellery",
    brand: "Tanishq",
    collection: [
      "on sale"
    ],
    category: "jewellery",
    price: 499,
    sale: false,
    discount: "50",
    stock: 12,
    "new": true,
    tags: [
      "Tanishq"
    ],
    variants: [
      {
        variant_id: 20501,
        id: 205,
        sku: "jewellery46",
        image_id: 20511
      }
    ],
    images: [
      {
        image_id: 20511,
        id: 205,
        alt: "jewellery",
        src: "6.jpg",
        variant_id: [
          20501
        ]
      }
    ]
  },
  {
    id: 206,
    title: "whey protein",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "whey protein",
    collection: [
      "on sale"
    ],
    category: "gym",
    price: 150,
    sale: true,
    discount: "10",
    stock: 25,
    "new": true,
    tags: [
      "sale"
    ],
    variants: [
      {
        variant_id: 20601,
        id: 206,
        sku: "gym46",
        image_id: 20611
      }
    ],
    images: [
      {
        image_id: 20611,
        id: 206,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          20601
        ]
      }
    ]
  },
  {
    id: 207,
    title: "Micellar Casein",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "whey protein",
    collection: [
      "on sale"
    ],
    category: "gym",
    price: 220,
    sale: false,
    discount: "30",
    stock: 2,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 20701,
        id: 207,
        sku: "gym46",
        image_id: 20711
      }
    ],
    images: [
      {
        image_id: 20711,
        id: 207,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          20701
        ]
      }
    ]
  },
  {
    id: 208,
    title: "impact isolate",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "Vegan protein",
    collection: [
      "best sellers"
    ],
    category: "gym",
    price: 99,
    sale: false,
    discount: "5",
    stock: 1,
    "new": true,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 20801,
        id: 208,
        sku: "gym46",
        image_id: 20811
      }
    ],
    images: [
      {
        image_id: 20811,
        id: 208,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          20801
        ]
      }
    ]
  },
  {
    id: 209,
    title: "diet whey",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "whey protein",
    collection: [
      "on sale"
    ],
    category: "gym",
    price: 260,
    sale: true,
    discount: "10",
    stock: 10,
    "new": false,
    tags: [
      "sale"
    ],
    variants: [
      {
        variant_id: 20901,
        id: 209,
        sku: "gym46",
        image_id: 20911
      }
    ],
    images: [
      {
        image_id: 20911,
        id: 209,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          20901
        ]
      }
    ]
  },
  {
    id: 210,
    title: "Peanut Butter",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "whey protein",
    collection: [
      "on sale"
    ],
    category: "gym",
    price: 195,
    sale: false,
    discount: "15",
    stock: 3,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21001,
        id: 210,
        sku: "gym46",
        image_id: 21011
      }
    ],
    images: [
      {
        image_id: 21011,
        id: 210,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          21001
        ]
      }
    ]
  },
  {
    id: 211,
    title: "Impact Diet Whey",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "Vegan protein",
    collection: [
      "on sale"
    ],
    category: "gym",
    price: 90,
    sale: false,
    discount: "3",
    stock: 2,
    "new": true,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21101,
        id: 211,
        sku: "gym46",
        image_id: 21111
      }
    ],
    images: [
      {
        image_id: 21111,
        id: 211,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          21101
        ]
      }
    ]
  },
  {
    id: 212,
    title: "MuscleBlaze gainer",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "whey protein",
    collection: [
      "on sale"
    ],
    category: "gym",
    price: 160,
    sale: true,
    discount: "5",
    stock: 0,
    "new": false,
    tags: [
      "sale"
    ],
    variants: [
      {
        variant_id: 21201,
        id: 212,
        sku: "gym46",
        image_id: 21211
      }
    ],
    images: [
      {
        image_id: 21211,
        id: 212,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          21201
        ]
      }
    ]
  },
  {
    id: 213,
    title: "protein powder",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "whey protein",
    collection: [
      "on sale",
      "best sellers"
    ],
    category: "gym",
    price: 215,
    sale: false,
    discount: "15",
    stock: 0,
    "new": true,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21301,
        id: 213,
        sku: "gym46",
        image_id: 21311
      }
    ],
    images: [
      {
        image_id: 21311,
        id: 213,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          21301
        ]
      }
    ]
  },
  {
    id: 214,
    title: "Nutriley powder",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "whey protein",
    collection: [
      "on sale",
      "best sellers"
    ],
    category: "gym",
    price: 235,
    sale: true,
    discount: "30",
    stock: 2,
    "new": true,
    tags: [
      "sale"
    ],
    variants: [
      {
        variant_id: 21401,
        id: 214,
        sku: "gym46",
        image_id: 21411
      }
    ],
    images: [
      {
        image_id: 21411,
        id: 214,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          21401
        ]
      }
    ]
  },
  {
    id: 215,
    title: "Isolate Vegan powder",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "gym",
    brand: "Vegan protein",
    collection: [
      "on sale",
      "best sellers"
    ],
    category: "gym",
    price: 180,
    sale: false,
    discount: "50",
    stock: 2,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21501,
        id: 215,
        sku: "gym46",
        image_id: 21511
      }
    ],
    images: [
      {
        image_id: 21511,
        id: 215,
        alt: "gym",
        src: "6.jpg",
        variant_id: [
          21501
        ]
      }
    ]
  },
  {
    id: 216,
    title: "black denim jeans",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 199,
    sale: false,
    discount: "50",
    stock: 2,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21601,
        id: 216,
        sku: "metro46",
        image_id: 21611
      }
    ],
    images: [
      {
        image_id: 21611,
        id: 216,
        alt: "metro",
        src: "portfolio/metro/1.jpg",
        variant_id: [
          21601
        ]
      }
    ]
  },
  {
    id: 217,
    title: "women sunglasses",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 95,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21701,
        id: 217,
        sku: "metro46",
        image_id: 21711
      }
    ],
    images: [
      {
        image_id: 21711,
        id: 217,
        alt: "metro",
        src: "portfolio/metro/2.jpg",
        variant_id: [
          21701
        ]
      }
    ]
  },
  {
    id: 218,
    title: "women watch",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 230,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21801,
        id: 218,
        sku: "metro46",
        image_id: 21811
      }
    ],
    images: [
      {
        image_id: 21811,
        id: 218,
        alt: "metro",
        src: "portfolio/metro/3.jpg",
        variant_id: [
          21801
        ]
      }
    ]
  },
  {
    id: 219,
    title: "new handbag",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 140,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 21901,
        id: 219,
        sku: "metro46",
        image_id: 21911
      }
    ],
    images: [
      {
        image_id: 21911,
        id: 219,
        alt: "metro",
        src: "portfolio/metro/4.jpg",
        variant_id: [
          21901
        ]
      }
    ]
  },
  {
    id: 220,
    title: "new trim dress",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 110,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22001,
        id: 220,
        sku: "metro46",
        image_id: 22011
      }
    ],
    images: [
      {
        image_id: 22011,
        id: 220,
        alt: "metro",
        src: "portfolio/metro/5.jpg",
        variant_id: [
          22001
        ]
      }
    ]
  },
  {
    id: 221,
    title: "maroon women bag",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 75,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22101,
        id: 221,
        sku: "metro46",
        image_id: 22111
      }
    ],
    images: [
      {
        image_id: 22111,
        id: 221,
        alt: "metro",
        src: "portfolio/metro/6.jpg",
        variant_id: [
          22101
        ]
      }
    ]
  },
  {
    id: 222,
    title: "sweat t-shirt",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 180,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22201,
        id: 222,
        sku: "metro46",
        image_id: 22211
      }
    ],
    images: [
      {
        image_id: 22211,
        id: 222,
        alt: "metro",
        src: "portfolio/metro/7.jpg",
        variant_id: [
          22201
        ]
      }
    ]
  },
  {
    id: 223,
    title: "men shoes",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 300,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22301,
        id: 223,
        sku: "metro46",
        image_id: 22311
      }
    ],
    images: [
      {
        image_id: 22311,
        id: 223,
        alt: "metro",
        src: "portfolio/metro/8.jpg",
        variant_id: [
          22301
        ]
      }
    ]
  },
  {
    id: 224,
    title: "red boho top",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 150,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22401,
        id: 224,
        sku: "metro46",
        image_id: 22411
      }
    ],
    images: [
      {
        image_id: 22411,
        id: 224,
        alt: "metro",
        src: "portfolio/metro/9.jpg",
        variant_id: [
          22401
        ]
      }
    ]
  },
  {
    id: 225,
    title: "men black t-shirt",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 125,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22501,
        id: 225,
        sku: "metro46",
        image_id: 22511
      }
    ],
    images: [
      {
        image_id: 22511,
        id: 225,
        alt: "metro",
        src: "portfolio/metro/10.jpg",
        variant_id: [
          22501
        ]
      }
    ]
  },
  {
    id: 226,
    title: "black slipper",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 70,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22601,
        id: 226,
        sku: "metro46",
        image_id: 22611
      }
    ],
    images: [
      {
        image_id: 22611,
        id: 226,
        alt: "metro",
        src: "portfolio/metro/11.jpg",
        variant_id: [
          22601
        ]
      }
    ]
  },
  {
    id: 227,
    title: "full sleeve t-shirt",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 70,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22701,
        id: 227,
        sku: "metro46",
        image_id: 22711
      }
    ],
    images: [
      {
        image_id: 22711,
        id: 227,
        alt: "metro",
        src: "portfolio/metro/12.jpg",
        variant_id: [
          22701
        ]
      }
    ]
  },
  {
    id: 228,
    title: "gray sling bag",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 190,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22801,
        id: 228,
        sku: "metro46",
        image_id: 22811
      }
    ],
    images: [
      {
        image_id: 22811,
        id: 228,
        alt: "metro",
        src: "portfolio/metro/13.jpg",
        variant_id: [
          22801
        ]
      }
    ]
  },
  {
    id: 229,
    title: "gray sneaker",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 320,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 22901,
        id: 229,
        sku: "metro46",
        image_id: 22911
      }
    ],
    images: [
      {
        image_id: 22911,
        id: 229,
        alt: "metro",
        src: "portfolio/metro/14.jpg",
        variant_id: [
          22901
        ]
      }
    ]
  },
  {
    id: 230,
    title: "men sling bag",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 320,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 23001,
        id: 230,
        sku: "metro46",
        image_id: 23011
      }
    ],
    images: [
      {
        image_id: 23011,
        id: 230,
        alt: "metro",
        src: "portfolio/metro/15.jpg",
        variant_id: [
          23001
        ]
      }
    ]
  },
  {
    id: 231,
    title: "women shirts",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 400,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 23101,
        id: 231,
        sku: "metro46",
        image_id: 23111
      }
    ],
    images: [
      {
        image_id: 23111,
        id: 231,
        alt: "metro",
        src: "portfolio/metro/16.jpg",
        variant_id: [
          23101
        ]
      }
    ]
  },
  {
    id: 232,
    title: "men white shirts",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 189,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 23201,
        id: 232,
        sku: "metro46",
        image_id: 23211
      }
    ],
    images: [
      {
        image_id: 23211,
        id: 232,
        alt: "metro",
        src: "portfolio/metro/17.jpg",
        variant_id: [
          23201
        ]
      }
    ]
  },
  {
    id: 233,
    title: "trending watch",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 379,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 23301,
        id: 233,
        sku: "metro46",
        image_id: 23311
      }
    ],
    images: [
      {
        image_id: 23311,
        id: 233,
        alt: "metro",
        src: "portfolio/metro/18.jpg",
        variant_id: [
          23301
        ]
      }
    ]
  },
  {
    id: 234,
    title: "brown handbag",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 279,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 23401,
        id: 234,
        sku: "metro46",
        image_id: 23411
      }
    ],
    images: [
      {
        image_id: 23411,
        id: 234,
        alt: "metro",
        src: "portfolio/metro/19.jpg",
        variant_id: [
          23401
        ]
      }
    ]
  },
  {
    id: 235,
    title: "fashion accessories",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters,It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    type: "metro",
    brand: "fashion",
    collection: [
      "on sale"
    ],
    category: "metro",
    price: 250,
    sale: false,
    discount: "50",
    stock: 12,
    "new": false,
    tags: [
      "new"
    ],
    variants: [
      {
        variant_id: 23501,
        id: 235,
        sku: "metro46",
        image_id: 23511
      }
    ],
    images: [
      {
        image_id: 23511,
        id: 235,
        alt: "metro",
        src: "portfolio/metro/20.jpg",
        variant_id: [
          23501
        ]
      }
    ]
  }
];
const products = {
  data
};
const useCartStore = defineStore({
  id: "cart-store",
  state: () => {
    return {
      products: products.data,
      cart: [],
      abc: {}
    };
  },
  actions: {
    addToCart(payload) {
      const product = this.products.find((item) => item.id === payload.id);
      const cartItems = this.cart.find((item) => item.id === payload.id);
      const qty = payload.quantity ? payload.quantity : 1;
      if (cartItems) {
        cartItems.quantity = qty;
      } else {
        this.cart.push({
          ...product,
          quantity: qty
        });
      }
      product.stock--;
    },
    updateCartQuantity(payload) {
      function calculateStockCounts(product, quantity) {
        const qty = product.quantity + quantity;
        const stock = product.stock;
        if (stock < qty) {
          return false;
        }
        return true;
      }
      this.cart.find((items, index) => {
        if (items.id === payload.product.id) {
          const qty = this.cart[index].quantity + payload.qty;
          const stock = calculateStockCounts(this.cart[index], payload.qty);
          if (qty !== 0 && stock) {
            this.cart[index].quantity = qty;
          }
          return true;
        }
      });
    },
    removeCartItem(payload) {
      this.cart = this.cart.filter((item) => item.id != payload.id);
    },
    setInitialCart(payload) {
      this.cart = payload;
    }
  },
  getters: {
    cartItems: (state) => {
      return state.cart;
    },
    cartTotalAmount: (state) => {
      return state.cart.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    }
  }
});
const useProductStore = defineStore({
  id: "product-store",
  state: () => {
    return {
      productslist: products.data,
      products: products.data,
      wishlist: [],
      compare: [],
      currency: {
        value: "usd",
        curr: 1,
        symbol: "$"
      },
      order: [],
      locale: "en",
      searchProducts: []
    };
  },
  actions: {
    changeCurrency2(payload) {
      this.currency = payload;
      if (this.currency.value === "eur") {
        this.currency.curr = 0.9;
      } else if (this.currency.value === "inr") {
        this.currency.curr = 70.93;
      } else if (this.currency.value === "gbp") {
        this.currency.curr = 0.78;
      } else if (this.currency.value === "usd") {
        this.currency.curr = 1;
      }
    },
    addToWishlist(payload) {
      const product = this.products.find((item) => item.id === payload.id);
      const wishlistItems = this.wishlist.find((item) => item.id === payload.id);
      if (wishlistItems)
        ;
      else {
        this.wishlist.push({
          ...product
        });
      }
    },
    setInitialWhishlist(payload) {
      this.wishlist = payload;
    },
    removeWishlistItem(payload) {
      const index = this.wishlist.indexOf(payload);
      this.wishlist.splice(index, 1);
    },
    addToCompare(payload) {
      const product = this.products.find((item) => item.id === payload.id);
      const compareItems = this.compare.find((item) => item.id === payload.id);
      if (compareItems)
        ;
      else {
        this.compare.push({
          ...product
        });
      }
    },
    setInitialCompare(payload) {
      this.compare = payload;
    },
    removeCompareItem(payload) {
      const index = this.compare.indexOf(payload);
      this.compare.splice(index, 1);
    },
    searchProduct(payload) {
      payload = payload.toLowerCase();
      this.searchProducts = [];
      if (payload.length) {
        this.products.filter((product) => {
          if (product.title.toLowerCase().includes(payload)) {
            this.searchProducts.push(product);
          }
        });
      }
    },
    createOrder(payload) {
      this.order = payload;
    }
  },
  getters: {
    price: (state) => {
      return state.products.map((product) => {
        if (product.price) {
          return product.price;
        }
      });
    },
    getcollectionProduct: (state) => {
      return (collection) => state.products.filter((product) => {
        return collection === product.collection;
      });
    },
    getProductById: (state) => {
      return (id) => state.products.find((product) => {
        return product.id === +id;
      });
    },
    compareItems: (state) => {
      return state.compare;
    },
    wishlistItems: (state) => {
      return state.wishlist;
    },
    changeCurrency: (state) => {
      return state.currency;
    },
    getOrder: (state) => {
      return state.order;
    }
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {
  mounted() {
    let localstorageCompare = JSON.parse(localStorage.getItem("compare"));
    if (localstorageCompare == null ? void 0 : localstorageCompare.length) {
      useProductStore().setInitialCompare(localstorageCompare);
    }
    let localstorageWhishlist = JSON.parse(localStorage.getItem("whish"));
    if (localstorageWhishlist == null ? void 0 : localstorageWhishlist.length) {
      useProductStore().setInitialWhishlist(localstorageWhishlist);
    }
    let localStorageProducts = JSON.parse(localStorage.getItem("product"));
    if (localStorageProducts == null ? void 0 : localStorageProducts.length) {
      useCartStore().setInitialCart(localStorageProducts);
    }
    window.addEventListener("beforeunload", (event) => {
      localStorage.setItem("product", JSON.stringify(useCartStore().cart));
      localStorage.setItem("whish", JSON.stringify(useProductStore().wishlist));
      localStorage.setItem("compare", JSON.stringify(useProductStore().compare));
    });
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_Head = Head;
  const _component_NuxtPage = __nuxt_component_2;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_Head, null, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_Head),
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = defineAsyncComponent(() => import('./_nuxt/error-component.4a7d6206.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, showError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { __appConfig as _, useState as a, _export_sfc as b, __nuxt_component_0$1 as c, defineStore as d, entry$1 as default, useProductStore as e, useCartStore as f, useRequestEvent as g, useSwitchLocalePath as h, useRouter as i, useRoute as j, getComposer as k, useI18n as l, mapState as m, useHead as n, products as p, storeToRefs as s, useNuxtApp as u };
//# sourceMappingURL=server.mjs.map
