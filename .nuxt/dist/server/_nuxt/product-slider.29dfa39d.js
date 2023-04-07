import { _ as __nuxt_component_0 } from "./product-box1.6b64b525.js";
import { b as _export_sfc, m as mapState, e as useProductStore } from "../server.mjs";
import { Swiper, SwiperSlide } from "swiper/vue";
/* empty css                     */import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { q as quickviewModel, c as compareModel } from "./compare-popup.71c679e4.js";
import { c as cartModel } from "./cart-modal-popup.eaf7b920.js";
import { resolveComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import "destr";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
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
export {
  productSlider as default
};
//# sourceMappingURL=product-slider.29dfa39d.js.map
