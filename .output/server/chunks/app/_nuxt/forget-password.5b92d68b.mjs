import { B as Breadcrumbs } from './breadcrumbs.b2644590.mjs';
import { resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { b as _export_sfc } from '../server.mjs';
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

const _sfc_main = {
  components: {
    Breadcrumbs
  },
  data() {
    return {
      title: "Forget Your Password",
      errors: [],
      email: null
    };
  },
  methods: {
    checkForm: function(e) {
      this.errors = [];
      if (!this.email) {
        this.errors.push("Email required.");
      } else if (!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");
      }
      if (!this.errors.length)
        return true;
      e.preventDefault();
    },
    validEmail: function(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Forget Password" }, null, _parent));
  _push(`<section class="pwd-page section-b-space"><div class="container"><div class="row"><div class="col-lg-6 offset-lg-3"><h2>${ssrInterpolate($data.title)}</h2><form class="theme-form" method="post">`);
  if ($data.errors.length) {
    _push(`<div><ul class="validation-error mb-3"><!--[-->`);
    ssrRenderList($data.errors, (error, index) => {
      _push(`<li>${ssrInterpolate(error)}</li>`);
    });
    _push(`<!--]--></ul></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="form-row"><div class="col-md-12"><input type="email" class="form-control" id="email"${ssrRenderAttr("value", $data.email)} placeholder="Enter Your Email" name="email" required></div><input type="submit" class="btn btn-solid" value="submit"></div></form></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/forget-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const forgetPassword = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { forgetPassword as default };
//# sourceMappingURL=forget-password.5b92d68b.mjs.map
