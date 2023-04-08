import { f as useCartStore, u as useNuxtApp, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from 'vue';
import { B as Breadcrumbs } from './breadcrumbs.b2644590.mjs';
import UserAuth from './auth.13771b2b.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'ufo';
import 'h3';
import '@unhead/vue';
import '@unhead/dom';
import 'vue-router';
import '@intlify/core-base';
import 'cookie-es';
import 'is-https';
import 'defu';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-solid-svg-icons';
import '../../nitro/node-server.mjs';
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
import './cookie.e01aaf43.mjs';

const _sfc_main = {
  components: {
    Breadcrumbs
  },
  computed: {
    cart() {
      return useCartStore().cartItems;
    }
  },
  data() {
    return {
      result: { email: "", password: "" },
      logintitle: "Login",
      registertitle: "New Customer",
      user: {
        email: {
          value: "test@admin.com",
          errormsg: ""
        },
        password: {
          value: "test@123456",
          errormsg: ""
        }
      }
    };
  },
  methods: {
    onSubmit() {
      if (!this.user.password.value || this.user.password.value.length < 7) {
        this.user.password.errormsg = "min length 7";
      } else {
        this.user.password.errormsg = "";
      }
      if (!this.user.email.value) {
        this.user.email.errormsg = "empty not allowed";
      } else if (!this.validEmail(this.user.email.value)) {
        this.user.email.errormsg = "Valid email required.";
      } else {
        this.user.email.errormsg = "";
      }
      if (!this.user.email.errormsg && !this.user.password.errormsg && this.user.email.value != "test@admin.com" || this.user.password.value != "test@123456") {
        useNuxtApp().$showToast({ msg: "enter valid email and password", type: "info" });
      }
      if (!this.user.email.errormsg && !this.user.password.errormsg && this.user.email.value == "test@admin.com" && this.user.password.value == "test@123456") {
        this.result = { email: this.user.email.value, password: this.user.password.value };
        UserAuth.localLogin(this.result);
        if (this.cart.length > 0) {
          this.$router.replace("/page/account/checkout");
        } else {
          this.$router.replace("/");
        }
      }
    },
    validEmail: function(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Login" }, null, _parent));
  _push(`<section class="login-page section-b-space"><div class="container"><div class="row"><div class="col-lg-6"><h3>${ssrInterpolate($data.logintitle)}</h3><div class="theme-card"><form class="theme-form"><div class="form-group"><label for="email">Email</label><input type="email" class="form-control" id="email"${ssrRenderAttr("value", $data.user.email.value)} placeholder="Email" name="email">`);
  if (!$data.user.email.value || !$options.validEmail($data.user.email.value)) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.email.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group"><label for="password">Password</label><input type="password" class="form-control" id="password"${ssrRenderAttr("value", $data.user.password.value)} placeholder="Enter your password">`);
  if ($data.user.password.value.length < 7) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.password.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><button type="submit" class="btn btn-solid"${ssrIncludeBooleanAttr(_ctx.invalid) ? " disabled" : ""}>Login</button></form></div></div><div class="col-lg-6 right-login"><h3>${ssrInterpolate($data.registertitle)}</h3><div class="theme-card authentication-right"><h6 class="title-font">Create A Account</h6><p>Sign up for a free account at our store. Registration is quick and easy. It allows you to be able to order from our shop. To start shopping click register.</p>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/page/account/register" },
    class: "btn btn-solid"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Create an Account`);
      } else {
        return [
          createTextVNode("Create an Account")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { login as default };
//# sourceMappingURL=login.d0f7b9ab.mjs.map
