import { b as _export_sfc, e as useProductStore, f as useCartStore, c as __nuxt_component_0$1 } from '../server.mjs';
import { SwiperSlide, Swiper } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { resolveComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createTextVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';

const _sfc_main$1 = {
  props: ["openModal", "productData"],
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 20,
        freeMode: true
      }
    };
  },
  components: {
    SwiperSlide,
    Swiper
  },
  computed: {
    curr() {
      return useProductStore().currency;
    }
  },
  methods: {
    Color(variants) {
      const uniqColor = [];
      for (let i = 0; i < Object.keys(variants).length; i++) {
        if (uniqColor.indexOf(variants[i].color) === -1) {
          uniqColor.push(variants[i].color);
        }
      }
      return uniqColor;
    },
    closeCompare(val) {
      this.$emit("closeView", val);
    },
    Size(variants) {
      const uniqSize = [];
      for (let i = 0; i < Object.keys(variants).length; i++) {
        if (uniqSize.indexOf(variants[i].size) === -1) {
          uniqSize.push(variants[i].size);
        }
      }
      return uniqSize;
    },
    addToCart: function(product) {
      useCartStore().addToCart(product);
    },
    getImgUrl(path) {
      return "/images/" + path;
    },
    discountedPrice(product) {
      const price = (product.price - product.price * product.discount / 100) * this.curr.curr;
      return price;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  if ($props.openModal) {
    _push(`<div class="modal-backdrop fade show"></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.openModal) {
    _push(`<div class="modal fade show d-block bd-example-modal-lg theme-modal" id="quick-view" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="modal-cartLabel"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content quick-view-modal"><div class="modal-body"><button class="close btn-close" type="button"><span>\xD7</span></button><div class="row quickview-modal"><div class="col-lg-6 col-12"><div class="quick-view-img">`);
    _push(ssrRenderComponent(_component_swiper, {
      slidesPerView: _ctx.auto,
      class: "swiper-wrapper"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<!--[-->`);
          ssrRenderList($props.productData.images, (imag, index) => {
            _push2(ssrRenderComponent(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img${ssrRenderAttr("src", $options.getImgUrl(imag.src))}${ssrRenderAttr("id", imag.image_id)} class="img-fluid bg-img" alt="imag.alt"${_scopeId2}>`);
                } else {
                  return [
                    createVNode("img", {
                      src: $options.getImgUrl(imag.src),
                      id: imag.image_id,
                      class: "img-fluid bg-img",
                      alt: "imag.alt"
                    }, null, 8, ["src", "id"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          });
          _push2(`<!--]-->`);
        } else {
          return [
            (openBlock(true), createBlock(Fragment, null, renderList($props.productData.images, (imag, index) => {
              return openBlock(), createBlock(_component_swiper_slide, {
                class: "swiper-slide",
                key: index
              }, {
                default: withCtx(() => [
                  createVNode("img", {
                    src: $options.getImgUrl(imag.src),
                    id: imag.image_id,
                    class: "img-fluid bg-img",
                    alt: "imag.alt"
                  }, null, 8, ["src", "id"])
                ]),
                _: 2
              }, 1024);
            }), 128))
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div><div class="col-lg-6 rtl-text"><div class="product-right"><h2>${ssrInterpolate($props.productData.title)}</h2>`);
    if ($props.productData.sale) {
      _push(`<h3>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice($props.productData))} <del>${ssrInterpolate(($props.productData.price * $options.curr.curr).toFixed(2))}</del></h3>`);
    } else {
      _push(`<h3>${ssrInterpolate(($props.productData.price * $options.curr.curr).toFixed(2))}</h3>`);
    }
    if ($props.productData.variants[0].color) {
      _push(`<ul class="color-variant"><!--[-->`);
      ssrRenderList($options.Color($props.productData.variants), (variant, variantIndex) => {
        _push(`<li><a class="${ssrRenderClass([variant])}" style="${ssrRenderStyle({ "background-color": variant })}"></a></li>`);
      });
      _push(`<!--]--></ul>`);
    } else {
      _push(`<!---->`);
    }
    if ($props.productData.variants[0].size) {
      _push(`<div class="product-description border-product"><h6 class="product-title">select size</h6><div class="size-box"><ul><!--[-->`);
      ssrRenderList($options.Size($props.productData.variants), (variant, variantIndex) => {
        _push(`<li><a href="javascript:void(0)">${ssrInterpolate(variant)}</a></li>`);
      });
      _push(`<!--]--></ul></div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="border-product"><h6 class="product-title">product details</h6><p>${ssrInterpolate($props.productData.description.substring(0, 250) + "....")}</p></div><div class="product-buttons"><a href="javascript:void(0)" class="btn btn-solid">add to cart</a>`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/product/sidebar/" + $props.productData.id },
      class: "btn btn-solid"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`view detail`);
        } else {
          return [
            createTextVNode("view detail")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div></div></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/quickview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const quickviewModel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  props: ["openCompare", "productData"],
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    closeCompare(val) {
      val = false;
      this.$emit("closeCompare", val);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  if ($props.openCompare) {
    _push(`<div class="modal-backdrop fade show"></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.openCompare) {
    _push(`<div class="modal fade show d-block bd-example-modal-lg theme-modal" id="modal-compare" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="modal-cartLabel"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal1"><div class="modal-body"><div class="bg-white p-3"><div class="row compare-modal"><div class="col-lg-12"><button class="close btn-close" type="button"><span>\xD7</span></button><div class="media"><img${ssrRenderAttr("src", $options.getImgUrl($props.productData.images[0].src))} class="img-fluid"${ssrRenderAttr("alt", $props.productData.images[0].alt)}><div class="media-body align-self-center text-center"><h5><i class="fa fa-check"></i>Item <span>${ssrInterpolate($props.productData.title)}</span><span>successfully added to your Compare list</span></h5><div class="buttons d-flex justify-content-center">`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/page/compare/compare-1" },
      class: "btn-sm btn-solid"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`View Compare list`);
        } else {
          return [
            createTextVNode("View Compare list")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div></div></div></div></div></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/compare-popup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const compareModel = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { compareModel as c, quickviewModel as q };
//# sourceMappingURL=compare-popup.71c679e4.mjs.map
