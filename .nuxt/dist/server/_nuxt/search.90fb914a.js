import { e as useProductStore, m as mapState, b as _export_sfc } from "../server.mjs";
import { mergeProps, useSSRContext, resolveComponent } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as __nuxt_component_0$1 } from "./product-box1.0b51d818.js";
import { B as Breadcrumbs } from "./breadcrumbs.c6638e27.js";
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
const _sfc_main$1 = {
  data() {
    return {
      searchString: ""
    };
  },
  watch: {
    searchString() {
      useProductStore().searchProduct(this.searchString);
    }
  },
  computed: {
    ...mapState(useProductStore, {
      searchItems: "searchProducts"
    })
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "authentication-page section-b-space" }, _attrs))}><div class="container"><section class="search-block"><div class="container"><div class="row"><div class="col-lg-6 offset-lg-3"><form class="form-header"><div class="input-group"><input type="text" class="form-control"${ssrRenderAttr("value", $data.searchString)} placeholder="Search Products....."></div></form></div></div></div></section></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/searched.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  components: {
    Breadcrumbs,
    productBox1: __nuxt_component_0$1,
    searched: __nuxt_component_0
  },
  computed: {
    ...mapState(useProductStore, {
      searchItems: "searchProducts"
    })
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_searched = __nuxt_component_0;
  const _component_productBox1 = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "search" }, null, _parent));
  _push(ssrRenderComponent(_component_searched, null, null, _parent));
  if (_ctx.searchItems.length) {
    _push(`<section class="section-b-space ratio_asos pt-0"><div class="container"><div class="row search-product"><!--[-->`);
    ssrRenderList(_ctx.searchItems, (product, index) => {
      _push(`<div class="col-xl-2 col-md-4 col-sm-6"><div class="product-box">${ssrInterpolate(product.title)} `);
      _push(ssrRenderComponent(_component_productBox1, {
        product,
        index
      }, null, _parent));
      _push(`</div></div>`);
    });
    _push(`<!--]--></div></div></section>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const search = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  search as default
};
//# sourceMappingURL=search.90fb914a.js.map
