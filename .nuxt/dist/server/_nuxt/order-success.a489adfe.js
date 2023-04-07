import { b as _export_sfc, e as useProductStore, f as useCartStore, c as __nuxt_component_0 } from "../server.mjs";
import { withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
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
  components: {},
  computed: {
    order() {
      return useProductStore().getOrder;
    },
    cartTotal() {
      return useCartStore().cartTotalAmount;
    },
    cur() {
      return useProductStore().changeCurrency;
    }
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  if ($options.order == "") {
    _push(`<section class="p-0"><div class="container"><div class="row"><div class="col-12"><div class="error-section"><h1>404</h1><h2>page not found</h2>`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/" },
      class: "btn btn-solid"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` back to home`);
        } else {
          return [
            createTextVNode(" back to home")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div></div></div></section>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.order != "") {
    _push(`<section class="section-b-space light-layout"><div class="container"><div class="row"><div class="col-md-12"><div class="success-text"><i class="fa fa-check-circle" aria-hidden="true"></i><h2>thank you</h2><p>Payment is successfully processsed and your order is on the way</p><p>Transaction ID:${ssrInterpolate($options.order.token)}</p></div></div></div></div></section>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.order != "") {
    _push(`<section class="section-b-space"><div class="container"><div class="row"><div class="col-lg-6"><div class="product-order"><h3>your order details</h3><!--[-->`);
    ssrRenderList($options.order.product, (item, index) => {
      _push(`<div class="row product-order-detail"><div class="col-3"><img${ssrRenderAttr("src", $options.getImgUrl(item.images[0].src))} alt class="img-fluid"></div><div class="col-3 order_detail"><div><h4>product name</h4><h5>${ssrInterpolate(item.title)}</h5></div></div><div class="col-3 order_detail"><div><h4>quantity</h4><h5>${ssrInterpolate(item.quantity)}</h5></div></div><div class="col-3 order_detail"><div><h4>price</h4><h5>${ssrInterpolate(item.price * _ctx.curr.curr * item.quantity || _ctx.currency(_ctx.curr.symbol))}</h5></div></div></div>`);
    });
    _push(`<!--]--><div class="total-sec"><ul><li> Total <span>${ssrInterpolate($options.cartTotal * _ctx.curr.curr || _ctx.currency(_ctx.curr.symbol))}</span></li></ul></div></div></div><div class="col-lg-6"><div class="row order-success-sec"><div class="col-sm-6"><h4>summery</h4><ul class="order-detail"><li>order ID: ${ssrInterpolate($options.order.token)}</li><li>Order Date: October 18, 2020</li><li>Order Total: ${ssrInterpolate($options.cartTotal * _ctx.curr.curr || _ctx.currency(_ctx.curr.symbol))}</li></ul></div><div class="col-sm-6"><h4>shipping address</h4><ul class="order-detail"><li>gerg harvell</li><li>568, suite ave.</li><li>Austrlia, 235153</li><li>Contact No. 987456321</li></ul></div><div class="col-sm-12 payment-mode"><h4>payment method</h4><p>Pay on Delivery (Cash/Card). Cash on delivery (COD) available. Card/Net banking acceptance subject to device availability.</p></div><div class="col-md-12"><div class="delivery-sec"><h3>expected date of delivery</h3><h2>october 22, 2020</h2></div></div></div></div></div></div></section>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/order-success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orderSuccess = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  orderSuccess as default
};
//# sourceMappingURL=order-success.a489adfe.js.map
