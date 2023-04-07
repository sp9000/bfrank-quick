import { e as useProductStore, f as useCartStore, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { _ as _imports_0 } from './empty-compare.bed2ff03.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/ofetch/dist/node.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/hookable/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/unctx/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/ufo/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/h3/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/vue-devtools-stub/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/@unhead/vue/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/@unhead/dom/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/@intlify/core-base/dist/core-base.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/@intlify/vue-devtools/dist/vue-devtools.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/cookie-es/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/is-https/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/defu/dist/defu.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/@fortawesome/fontawesome-svg-core/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/@fortawesome/free-solid-svg-icons/index.mjs';
import '../../nitro/nitro-prerenderer.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/destr/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/scule/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/ohash/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/unstorage/dist/index.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/radix3/dist/index.mjs';
import 'node:url';
import 'file:///home/sp07/vue/templatian/node_modules/ipx/dist/index.mjs';

const _sfc_main = {
  components: {
    Breadcrumbs
  },
  computed: {
    compare() {
      return useProductStore().compareItems;
    },
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    removeCompareItem: function(product) {
      useProductStore().removeCompareItem(product);
    },
    addToCart: function(product) {
      useCartStore().addToCart(product);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Comapre" }, null, _parent));
  _push(`<section class="compare-padding"><div class="container"><div class="row"><div class="col-12">`);
  if ($options.compare.length) {
    _push(`<div class="compare-page"><div class="table-wrapper table-responsive"><table class="table"><thead><tr class="th-compare"><td>Action</td><!--[-->`);
    ssrRenderList($options.compare, (item, index) => {
      _push(`<th class="item-row"><button type="button" class="remove-compare bg-danger text-white px-3 py-2 rounded-1 lh-1 fw-bold">Remove</button></th>`);
    });
    _push(`<!--]--></tr></thead><tbody id="table-compare"><tr><th class="product-name">Product Name</th><!--[-->`);
    ssrRenderList($options.compare, (item, index) => {
      _push(`<td class="grid-link__title">${ssrInterpolate(item.title)}</td>`);
    });
    _push(`<!--]--></tr><tr><th class="product-name">Product Image</th><!--[-->`);
    ssrRenderList($options.compare, (item, index) => {
      _push(`<td class="item-row"><img${ssrRenderAttr("src", $options.getImgUrl(item.images[0].src))} alt="" class="featured-image"><div class="product-price product_price">`);
      if (item.sale) {
        _push(`<strong>On Sale:</strong>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(item.price * $options.curr.curr || _ctx.currency($options.curr.symbol))}</span></div><form class="variants clearfix"><button title="Add to Cart" class="add-to-cart btn btn-solid">Add to Cart</button></form><h4 class="grid-link__title hidden pt-2">${ssrInterpolate(item.title)}</h4></td>`);
    });
    _push(`<!--]--></tr><tr><th class="product-name">Product Description</th><!--[-->`);
    ssrRenderList($options.compare, (item, index) => {
      _push(`<td class="item-row"><p class="description-compare">${ssrInterpolate(item.description)}</p></td>`);
    });
    _push(`<!--]--></tr><tr><th class="product-name">Availability</th><!--[-->`);
    ssrRenderList($options.compare, (item, index) => {
      _push(`<td class="available-stock"><p>Available In stock</p></td>`);
    });
    _push(`<!--]--></tr></tbody></table></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$options.compare.length) {
    _push(`<div class="empty-cart-cls text-center"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid" alt="empty cart"><h3 class="mt-3"><strong>Your Compare List is Empty</strong></h3><div class="col-12">`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/" },
      class: "btn btn-solid"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`continue shopping`);
        } else {
          return [
            createTextVNode("continue shopping")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/compare/compare-1.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const compare1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { compare1 as default };
//# sourceMappingURL=compare-1.a09b729a.mjs.map
