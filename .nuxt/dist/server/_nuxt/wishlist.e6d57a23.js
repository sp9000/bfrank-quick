import { b as _export_sfc, e as useProductStore, f as useCartStore, c as __nuxt_component_0 } from "../server.mjs";
import { B as Breadcrumbs } from "./breadcrumbs.c6638e27.js";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
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
  const _component_nuxt_link = __nuxt_component_0;
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
export {
  wishlist as default
};
//# sourceMappingURL=wishlist.e6d57a23.js.map
