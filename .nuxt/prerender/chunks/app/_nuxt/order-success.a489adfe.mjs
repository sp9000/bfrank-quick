import { b as _export_sfc, e as useProductStore, f as useCartStore, c as __nuxt_component_0$1 } from '../server.mjs';
import { withCtx, createTextVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
  const _component_nuxt_link = __nuxt_component_0$1;
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

export { orderSuccess as default };
//# sourceMappingURL=order-success.a489adfe.mjs.map
