import { b as _export_sfc, c as __nuxt_component_0 } from "../server.mjs";
import { withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
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
  data() {
    return {
      logoimage: "/images/icon/logo.png",
      title: "Will be Opening Soon!",
      copyright: "\xA9 2018, Powered by Multikart."
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="template-password"><div class="container"><div id="container" class="text-center"><div><div id="login"><div><div class="logo mb-4">`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/shop/fashion" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${ssrRenderAttr("src", $data.logoimage)} alt="Multikart_fashion" class="img-fluid"${_scopeId}>`);
      } else {
        return [
          createVNode("img", {
            src: $data.logoimage,
            alt: "Multikart_fashion",
            class: "img-fluid"
          }, null, 8, ["src"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><h2 class="mb-3">${ssrInterpolate($data.title)}</h2></div><div class="row"><div class="col-12"><form action="#" class="theme-form"><div class="col-md-12 mt-2"><h3>Enter Your Email:</h3></div><div class="form-row"><div class="col-md-12"><input type="password" name="password" id="password" class="form-control" autofocus></div><div class="col-md-12"><div class="actions"><button type="submit" class="btn btn-solid">notify me</button></div></div></div></form></div></div><div id="footer" class="mt-4"><div id="owner"> Are you the store owner? `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/page/account/login" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Log in here`);
      } else {
        return [
          createTextVNode("Log in here")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` or <a href="#">change your password settings</a></div></div></div><div id="powered"><p>${ssrInterpolate($data.copyright)}</p></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/coming-soon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const comingSoon = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  comingSoon as default
};
//# sourceMappingURL=coming-soon.817e6fdd.js.map
