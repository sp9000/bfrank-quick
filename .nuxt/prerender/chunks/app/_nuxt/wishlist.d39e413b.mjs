import { e as useProductStore, f as useCartStore, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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

const _imports_0 = "" + globalThis.__publicAssetsURL("images/empty-wishlist.png");
const _sfc_main = {
  data() {
    return {
      whishItem: []
    };
  },
  components: {
    Breadcrumbs
  },
  computed: {
    wishlist() {
      if (!useProductStore().wishlistItems.length) {
        this.whishItem.forEach((item) => {
          useProductStore().addToWishlist(item);
        });
        return useProductStore().wishlistItems;
      } else {
        return useProductStore().wishlistItems;
      }
    },
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    removeWishlistItem: function(product) {
      useProductStore().removeWishlistItem(product);
    },
    addToCart: function(product) {
      this.$store.dispatch("cart/addToCart", product);
      useCartStore().addToCart(product);
    }
  },
  mounted() {
    this.whishItem = JSON.parse(localStorage.getItem("whish"));
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "wishlist" }, null, _parent));
  _push(`<section class="wishlist-section section-b-space"><div class="container"><div class="row"><div class="col-12"><div class="table-responsive">`);
  if ($options.wishlist.length) {
    _push(`<table class="table cart-table table-responsive"><thead><tr class="table-head"><th scope="col">image</th><th scope="col">product name</th><th scope="col">price</th><th scope="col">availability</th><th scope="col">action</th></tr></thead><!--[-->`);
    ssrRenderList($options.wishlist, (item, index) => {
      _push(`<tbody><tr><td><a href="#"><img${ssrRenderAttr("src", $options.getImgUrl(item.images[0].src))} alt=""></a></td><td><a href="#">${ssrInterpolate(item.title)}</a><div class="mobile-cart-content"><ul><li><p>in stock</p></li><li><h2 class="td-color">${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(item.price * $options.curr.curr)}</h2></li><li><h2 class="td-color"><a href="#" class="icon mr-1"><i class="ti-close"></i></a><a href="#" class="cart"><i class="ti-shopping-cart"></i></a></h2></li></ul></div></td><td><h2>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(item.price * $options.curr.curr)}</h2></td><td><p>in stock</p></td><td><a href="javascript:void(0)" class="icon me-3"><i class="ti-close"></i></a><a href="javascript:void(0)" class="cart"><i class="ti-shopping-cart"></i></a></td></tr></tbody>`);
    });
    _push(`<!--]--></table>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div>`);
  if ($options.wishlist.length) {
    _push(`<div class="row wishlist-buttons"><div class="col-12">`);
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
  if (!$options.wishlist.length) {
    _push(`<div class="col-sm-12 empty-cart-cls text-center"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid" alt="empty cart"><h3 class="mt-3 empty-text"><strong>Your Wishlist is Empty</strong></h3><div class="col-12">`);
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
  _push(`</div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/wishlist.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const wishlist = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { wishlist as default };
//# sourceMappingURL=wishlist.d39e413b.mjs.map
