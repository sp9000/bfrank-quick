import { _ as __nuxt_component_0 } from './product-box1.0b51d818.mjs';
import { m as mapState, e as useProductStore, b as _export_sfc } from '../server.mjs';
import { Swiper, SwiperSlide } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { B as Breadcrumbs } from './breadcrumbs.c6638e27.mjs';
import { q as quickviewModel, c as compareModel } from './compare-popup.2ccec425.mjs';
import { c as cartModel } from './cart-modal-popup.584757b0.mjs';
import { resolveComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
  props: ["products"],
  components: {
    Swiper,
    SwiperSlide,
    Breadcrumbs,
    productBox1: __nuxt_component_0,
    quickviewModel,
    compareModel,
    cartModel
  },
  data() {
    return {
      title: "top collection",
      subtitle: "special offer",
      showquickviewmodel: false,
      showcomparemodal: false,
      showcartmodal: false,
      quickviewproduct: {},
      comapreproduct: {},
      cartproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.",
      swiperOption: {
        breakpoints: {
          1199: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          991: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          420: {
            slidesPerView: 1,
            spaceBetween: 20
          }
        }
      }
    };
  },
  computed: {
    ...mapState(useProductStore, {
      productslist: "productslist"
    })
  },
  methods: {
    alert(item) {
      this.dismissCountDown = item;
    },
    showQuickview(item, productData) {
      this.showquickviewmodel = item;
      this.quickviewproduct = productData;
    },
    showCoampre(item, productData) {
      this.showcomparemodal = item;
      this.comapreproduct = productData;
    },
    closeCompareModal(item) {
      this.showcomparemodal = item;
    },
    showCart(item, productData) {
      this.showcartmodal = item;
      this.cartproduct = productData;
    },
    closeCartModal(item) {
      this.showcartmodal = item;
    },
    closeViewModal(item) {
      this.showquickviewmodel = item;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_productBox1 = __nuxt_component_0;
  const _component_quickviewModel = resolveComponent("quickviewModel");
  const _component_compareModel = resolveComponent("compareModel");
  const _component_cartModel = resolveComponent("cartModel");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Slider Element" }, null, _parent));
  _push(`<section class="section-b-space ratio_asos"><div class="container"><div class="row"><div class="col">`);
  _push(ssrRenderComponent(_component_swiper, {
    slidesPerView: 4,
    spaceBetween: 20,
    breakpoints: $data.swiperOption.breakpoints,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList(_ctx.productslist, (product, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: "swiper-slide",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="product-box"${_scopeId2}>`);
                _push3(ssrRenderComponent(_component_productBox1, {
                  onOpencartmodel: $options.showCart,
                  onShowCompareModal: $options.showCoampre,
                  onOpenquickview: $options.showQuickview,
                  onShowalert: $options.alert,
                  onAlertseconds: $options.alert,
                  product,
                  index
                }, null, _parent3, _scopeId2));
                _push3(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "product-box" }, [
                    createVNode(_component_productBox1, {
                      onOpencartmodel: $options.showCart,
                      onShowCompareModal: $options.showCoampre,
                      onOpenquickview: $options.showQuickview,
                      onShowalert: $options.alert,
                      onAlertseconds: $options.alert,
                      product,
                      index
                    }, null, 8, ["onOpencartmodel", "onShowCompareModal", "onOpenquickview", "onShowalert", "onAlertseconds", "product", "index"])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.productslist, (product, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("div", { class: "product-box" }, [
                  createVNode(_component_productBox1, {
                    onOpencartmodel: $options.showCart,
                    onShowCompareModal: $options.showCoampre,
                    onOpenquickview: $options.showQuickview,
                    onShowalert: $options.alert,
                    onAlertseconds: $options.alert,
                    product,
                    index
                  }, null, 8, ["onOpencartmodel", "onShowCompareModal", "onOpenquickview", "onShowalert", "onAlertseconds", "product", "index"])
                ])
              ]),
              _: 2
            }, 1024);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></section>`);
  _push(ssrRenderComponent(_component_quickviewModel, {
    openModal: $data.showquickviewmodel,
    productData: $data.quickviewproduct,
    onCloseView: $options.closeViewModal
  }, null, _parent));
  _push(ssrRenderComponent(_component_compareModel, {
    openCompare: $data.showcomparemodal,
    productData: $data.comapreproduct,
    onCloseCompare: $options.closeCompareModal
  }, null, _parent));
  _push(ssrRenderComponent(_component_cartModel, {
    openCart: $data.showcartmodal,
    productData: $data.cartproduct,
    onCloseCart: $options.closeCartModal,
    products: _ctx.productslist
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/product-slider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const productSlider = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { productSlider as default };
//# sourceMappingURL=product-slider.4268f3b4.mjs.map
