import { b as _export_sfc, c as __nuxt_component_0 } from "../server.mjs";
import { withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main = {
  props: ["title"]
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="breadcrumb-section"><div class="container"><div class="row"><div class="col-sm-6"><div class="page-title"><h2>${ssrInterpolate($props.title)}</h2></div></div><div class="col-sm-6"><nav aria-label="breadcrumb" class="theme-breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item">`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Home`);
      } else {
        return [
          createTextVNode("Home")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li>`);
  if ($props.title) {
    _push(`<li class="breadcrumb-item active">${ssrInterpolate($props.title)}</li>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</ol></nav></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/breadcrumbs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Breadcrumbs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  Breadcrumbs as B
};
//# sourceMappingURL=breadcrumbs.eec6192c.js.map
