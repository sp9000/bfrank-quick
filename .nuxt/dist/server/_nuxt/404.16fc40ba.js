import { b as _export_sfc, c as __nuxt_component_0 } from "../server.mjs";
import { B as Breadcrumbs } from "./breadcrumbs.c6638e27.js";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
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
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "404" }, null, _parent));
  _push(`<section class="p-0"><div class="container"><div class="row"><div class="col-12"><div class="error-section"><h1>404</h1><h2>page not found</h2>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/fashion" },
    class: "btn btn-solid"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`back to home`);
      } else {
        return [
          createTextVNode("back to home")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/404.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _404 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _404 as default
};
//# sourceMappingURL=404.16fc40ba.js.map
