import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { b as _export_sfc } from "../server.mjs";
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
const _sfc_main = {
  components: {
    Breadcrumbs
  },
  data() {
    return {
      title: "create account",
      fname: null,
      lname: null,
      email: null,
      password: null
    };
  },
  methods: {
    onSubmit() {
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Register" }, null, _parent));
  _push(`<section class="register-page section-b-space"><div class="container"><div class="row"><div class="col-lg-12"><h3>${ssrInterpolate($data.title)}</h3><div class="theme-card"><form class="theme-form"><div class="row"><div class="col-md-6"><label for="First name">First Name</label><input type="text" class="form-control" id="First name"${ssrRenderAttr("value", $data.fname)} placeholder="First Name" name="First name" required></div><div class="col-md-6"><label for="lname">Last Name</label><input type="text" class="form-control" id="lname"${ssrRenderAttr("value", $data.lname)} placeholder="Last Name" name="lname" required></div></div><div class="row"><div class="col-md-6"><label for="email">Email</label><input type="email" class="form-control" id="email"${ssrRenderAttr("value", $data.email)} placeholder="Email" name="email" required></div><div class="col-md-6"><label for="password">Password</label><input type="password" class="form-control" id="password"${ssrRenderAttr("value", $data.password)} placeholder="Enter your password" name="password" required></div><div class="col-6"><button type="submit" class="btn btn-solid mt-2"${ssrIncludeBooleanAttr(_ctx.invalid) ? " disabled" : ""}>create account</button></div></div></form></div></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  register as default
};
//# sourceMappingURL=register.deab58a2.js.map
