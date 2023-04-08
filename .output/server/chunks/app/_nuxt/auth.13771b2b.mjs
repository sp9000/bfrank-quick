import { u as useCookie } from './cookie.e01aaf43.mjs';
import 'vue';
import 'cookie-es';
import 'h3';
import 'destr';
import 'ohash';
import '../server.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'ufo';
import '@unhead/vue';
import '@unhead/dom';
import 'vue-router';
import '@intlify/core-base';
import 'is-https';
import 'defu';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-solid-svg-icons';
import 'vue/server-renderer';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'ipx';

const loginExpiryKey = "tokenExpiry";
const Userinfo = "userinfo";
class Auth {
  localLogin(authResult) {
    this.tokenExpiry = new Date();
    useCookie(loginExpiryKey).value = this.tokenExpiry;
    useCookie("userlogin").value = true;
    useCookie(Userinfo).value = authResult.email;
  }
  Logout() {
    useCookie(loginExpiryKey).value = void 0;
    useCookie("userlogin").value = void 0;
    useCookie(Userinfo).value = void 0;
  }
  isAuthenticated() {
    return new Date(Date.now()) !== new Date(localStorage.getItem(loginExpiryKey)) && useCookie("userLogin").value === "true";
  }
}
const UserAuth = new Auth();

export { UserAuth as default };
//# sourceMappingURL=auth.13771b2b.mjs.map
