export const localeCodes = ["en","fr"]

export const localeMessages = {
}

export const additionalMessages = Object({"fr":[],})

export const resolveNuxtI18nOptions = async (context) => {
  const nuxtI18nOptions = Object({})
  const vueI18nOptionsLoader = async (context) => Object({"legacy":false,"locale":"en","messages": Object({"en":{
  "Home": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Home"])};fn.source="Home";return fn;})(),
  "Shop": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Shop"])};fn.source="Shop";return fn;})(),
  "Products": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Product"])};fn.source="Product";return fn;})(),
  "Features": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Feature"])};fn.source="Feature";return fn;})(),
  "Pages": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Pages"])};fn.source="Pages";return fn;})(),
  "Blog": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Blog"])};fn.source="Blog";return fn;})()
},"fr":{
  "Home": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Domicile"])};fn.source="Domicile";return fn;})(),
  "Shop": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Magasin"])};fn.source="Magasin";return fn;})(),
  "PRODUCTS": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Produit"])};fn.source="Produit";return fn;})(),
  "FEATURES": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Caractéristique"])};fn.source="Caractéristique";return fn;})(),
  "PAGES": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["pages"])};fn.source="pages";return fn;})(),
  "BLOG": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Blog"])};fn.source="Blog";return fn;})()
},}),})
  nuxtI18nOptions.vueI18n = await vueI18nOptionsLoader(context)
  nuxtI18nOptions.locales = [Object({"code":"en","name":"English"}),Object({"code":"fr","name":"Français"})]
  nuxtI18nOptions.defaultLocale = "en"
  nuxtI18nOptions.defaultDirection = "ltr"
  nuxtI18nOptions.routesNameSeparator = "___"
  nuxtI18nOptions.trailingSlash = false
  nuxtI18nOptions.defaultLocaleRouteNameSuffix = "default"
  nuxtI18nOptions.strategy = "prefix_except_default"
  nuxtI18nOptions.lazy = false
  nuxtI18nOptions.langDir = null
  nuxtI18nOptions.rootRedirect = null
  nuxtI18nOptions.detectBrowserLanguage = Object({"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"","redirectOn":"root","useCookie":true})
  nuxtI18nOptions.differentDomains = false
  nuxtI18nOptions.baseUrl = ""
  nuxtI18nOptions.dynamicRouteParams = false
  nuxtI18nOptions.customRoutes = "page"
  nuxtI18nOptions.pages = Object({})
  nuxtI18nOptions.skipSettingLocaleOnNavigate = false
  nuxtI18nOptions.onBeforeLanguageSwitch = (() => "")
  nuxtI18nOptions.onLanguageSwitched = (() => null)
  nuxtI18nOptions.types = undefined
  nuxtI18nOptions.debug = false
  return nuxtI18nOptions
}

export const nuxtI18nOptionsDefault = Object({vueI18n: undefined,locales: [],defaultLocale: "",defaultDirection: "ltr",routesNameSeparator: "___",trailingSlash: false,defaultLocaleRouteNameSuffix: "default",strategy: "prefix_except_default",lazy: false,langDir: null,rootRedirect: null,detectBrowserLanguage: Object({"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"","redirectOn":"root","useCookie":true}),differentDomains: false,baseUrl: "",dynamicRouteParams: false,customRoutes: "page",pages: Object({}),skipSettingLocaleOnNavigate: false,onBeforeLanguageSwitch: (() => ""),onLanguageSwitched: (() => null),types: undefined,debug: false})

export const nuxtI18nInternalOptions = Object({__normalizedLocales: [Object({"code":"en","name":"English"}),Object({"code":"fr","name":"Français"})]})
export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const isSSG = false
export const isSSR = true
