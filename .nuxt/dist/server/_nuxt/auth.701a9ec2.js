import "../server.mjs";
import "vue";
import { u as useCookie } from "./cookie.d1875fbc.js";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "destr";
import "ufo";
import "h3";
import "@vue/devtools-api";
import "@unhead/vue";
import "@unhead/dom";
import "vue-router";
import "@intlify/core-base";
import "@intlify/vue-devtools";
import "cookie-es";
import "js-cookie";
import "is-https";
import "defu";
import "@fortawesome/fontawesome-svg-core";
import "@fortawesome/free-solid-svg-icons";
import "vue/server-renderer";
import "ohash";
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
export {
  UserAuth as default
};
//# sourceMappingURL=auth.701a9ec2.js.map
