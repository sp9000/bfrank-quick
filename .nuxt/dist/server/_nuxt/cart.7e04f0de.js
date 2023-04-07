import { b as _export_sfc, f as useCartStore, e as useProductStore, c as __nuxt_component_0 } from "../server.mjs";
import { B as Breadcrumbs } from "./breadcrumbs.c6638e27.js";
import { resolveComponent, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
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
const _imports_0 = "" + globalThis.__publicAssetsURL("images/icon-empty-cart.png");
const _sfc_main = {
  data() {
    return {
      counter: 1
    };
  },
  components: {
    Breadcrumbs
  },
  computed: {
    cart() {
      return useCartStore().cartItems;
    },
    cartTotal() {
      return useCartStore().cartTotalAmount;
    },
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    removeCartItem(product) {
      useCartStore().removeCartItem(product);
    },
    increment(product, qty = 1) {
      useCartStore().updateCartQuantity({
        product,
        qty
      });
    },
    decrement(product, qty = -1) {
      useCartStore().updateCartQuantity({
        product,
        qty
      });
    }
  },
  mounted() {
    this.cartItem = JSON.parse(localStorage.getItem("product"));
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Cart" }, null, _parent));
  _push(`<section class="cart-section section-b-space"><div class="container"><div class="row"><div class="col-sm-12">`);
  if ($options.cart.length) {
    _push(`<table class="table cart-table table-responsive-xs"><thead><tr class="table-head"><th scope="col">image</th><th scope="col">product name</th><th scope="col">price</th><th scope="col">quantity</th><th scope="col">action</th><th scope="col">total</th></tr></thead><!--[-->`);
    ssrRenderList($options.cart, (item, index) => {
      _push(`<tbody><tr><td>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: { path: "/product/sidebar/" + item.id }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", $options.getImgUrl(item.images[0].src))} alt${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: $options.getImgUrl(item.images[0].src),
                alt: ""
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</td><td>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: { path: "/product/sidebar/" + item.id }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(item.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(item.title), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`<div class="mobile-cart-content row"><div class="col-xs-3"><div class="qty-box"><div class="input-group"><span class="input-group-prepend"><button type="button" class="btn quantity-left-minus" data-type="minus" data-field><i class="ti-angle-left"></i></button></span><input type="text" name="quantity" class="form-control input-number"${ssrRenderAttr("value", $data.counter)}><span class="input-group-prepend"><button type="button" class="btn quantity-right-plus" data-type="plus" data-field><i class="ti-angle-right"></i></button></span></div></div></div><div class="col-xs-3"><h2 class="td-color">${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(item.price * $options.curr.curr)}</h2></div><div class="col-xs-3"><h2 class="td-color"><a href="#" class="icon"><i class="ti-close"></i></a></h2></div></div></td><td><h2>${ssrInterpolate(item.price * $options.curr.curr)}</h2></td><td><div class="qty-box"><div class="input-group"><span class="input-group-prepend"><button type="button" class="btn quantity-left-minus" data-type="minus" data-field><i class="ti-angle-left"></i></button></span><input type="text" name="quantity" class="form-control input-number"${ssrIncludeBooleanAttr(item.quantity > item.stock) ? " disabled" : ""}${ssrRenderAttr("value", item.quantity)}><span class="input-group-prepend"><button type="button" class="btn quantity-right-plus" data-type="plus" data-field><i class="ti-angle-right"></i></button></span></div></div></td><td><a class="icon" href="#"><i class="ti-close"></i></a></td><td><h2 class="td-color">${ssrInterpolate($options.curr.symbol)} ${ssrInterpolate(item.price * $options.curr.curr * item.quantity)}</h2></td></tr></tbody>`);
    });
    _push(`<!--]--></table>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.cart.length) {
    _push(`<table class="table cart-table table-responsive-md"><tfoot><tr><td>total price :</td><td><h2>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.cartTotal * $options.curr.curr)}</h2></td></tr></tfoot></table>`);
  } else {
    _push(`<!---->`);
  }
  if (!$options.cart.length) {
    _push(`<div class="col-sm-12 empty-cart-cls text-center"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid" alt="empty cart"><h3 class="mt-3"><strong>Your Cart is Empty</strong></h3><h4 class="mb-3">Add something to make me happy :)</h4><div class="col-12">`);
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
  _push(`</div></div>`);
  if ($options.cart.length) {
    _push(`<div class="row cart-buttons"><div class="col-6">`);
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
    _push(`</div><div class="col-6">`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/page/account/checkout" },
      class: "btn btn-solid"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`check out`);
        } else {
          return [
            createTextVNode("check out")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cart = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  cart as default
};
//# sourceMappingURL=cart.7e04f0de.js.map
