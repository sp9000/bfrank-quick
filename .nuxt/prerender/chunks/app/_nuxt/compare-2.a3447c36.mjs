import { e as useProductStore, f as useCartStore, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { Swiper, SwiperSlide } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, createTextVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
    Swiper,
    SwiperSlide,
    Breadcrumbs
  },
  data() {
    return {
      swiperOption: {
        freeMode: false,
        breakpoints: {
          1199: {
            slidesPerView: 3
          },
          991: {
            slidesPerView: 2
          },
          420: {
            slidesPerView: 1
          }
        }
      }
    };
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
    Color(variants) {
      const uniqColor = [];
      for (let i = 0; i < Object.keys(variants).length; i++) {
        if (uniqColor.indexOf(variants[i].color) === -1) {
          uniqColor.push(variants[i].color);
        }
      }
      return uniqColor;
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
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Comapre" }, null, _parent));
  _push(`<section class="compare-section section-b-space ratio_asos"><div class="container"><div class="row">`);
  if ($options.compare.length) {
    _push(`<div class="col-12">`);
    _push(ssrRenderComponent(_component_swiper, {
      breakpoints: $data.swiperOption.breakpoints,
      slidesPerView: 4,
      class: "swiper-wrapper"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<!--[-->`);
          ssrRenderList($options.compare, (item, index) => {
            _push2(ssrRenderComponent(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="compare-part"${_scopeId2}><button type="button" class="close-btn"${_scopeId2}><span aria-hidden="true"${_scopeId2}>\xD7</span></button><div class="img-secton"${_scopeId2}><div${_scopeId2}><img${ssrRenderAttr("src", $options.getImgUrl(item.images[0].src))} class="img-fluid" alt="image"${_scopeId2}></div><a href="#"${_scopeId2}><h5${_scopeId2}>${ssrInterpolate(item.title)}</h5></a><h5${_scopeId2}>${ssrInterpolate(item.price * $options.curr.curr || _ctx.currency($options.curr.symbol))}</h5></div><div class="detail-part"${_scopeId2}><div class="title-detail"${_scopeId2}><h5${_scopeId2}>discription</h5></div><div class="inner-detail"${_scopeId2}><p${_scopeId2}>${ssrInterpolate(item.description)}</p></div></div><div class="detail-part"${_scopeId2}><div class="title-detail"${_scopeId2}><h5${_scopeId2}>Brand Name</h5></div><div class="inner-detail"${_scopeId2}><p${_scopeId2}>${ssrInterpolate(item.brand)}</p></div></div>`);
                  if (item.variants[0].color) {
                    _push3(`<div class="detail-part"${_scopeId2}><div class="title-detail"${_scopeId2}><h5${_scopeId2}>color</h5></div><div class="inner-detail"${_scopeId2}><p${_scopeId2}><!--[-->`);
                    ssrRenderList($options.Color(item.variants), (variant, variantIndex) => {
                      _push3(`<span${_scopeId2}>${ssrInterpolate(variant)}</span>`);
                    });
                    _push3(`<!--]--></p></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="detail-part"${_scopeId2}><div class="title-detail"${_scopeId2}><h5${_scopeId2}>availability</h5></div><div class="inner-detail"${_scopeId2}><p${_scopeId2}>In stock</p></div></div><div class="btn-part"${_scopeId2}><a href="javascript:void(0)" class="btn btn-solid"${_scopeId2}>add to cart</a></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "compare-part" }, [
                      createVNode("button", {
                        type: "button",
                        class: "close-btn",
                        onClick: ($event) => $options.removeCompareItem(item)
                      }, [
                        createVNode("span", { "aria-hidden": "true" }, "\xD7")
                      ], 8, ["onClick"]),
                      createVNode("div", { class: "img-secton" }, [
                        createVNode("div", null, [
                          createVNode("img", {
                            src: $options.getImgUrl(item.images[0].src),
                            class: "img-fluid",
                            alt: "image"
                          }, null, 8, ["src"])
                        ]),
                        createVNode("a", { href: "#" }, [
                          createVNode("h5", null, toDisplayString(item.title), 1)
                        ]),
                        createVNode("h5", null, toDisplayString(item.price * $options.curr.curr || _ctx.currency($options.curr.symbol)), 1)
                      ]),
                      createVNode("div", { class: "detail-part" }, [
                        createVNode("div", { class: "title-detail" }, [
                          createVNode("h5", null, "discription")
                        ]),
                        createVNode("div", { class: "inner-detail" }, [
                          createVNode("p", null, toDisplayString(item.description), 1)
                        ])
                      ]),
                      createVNode("div", { class: "detail-part" }, [
                        createVNode("div", { class: "title-detail" }, [
                          createVNode("h5", null, "Brand Name")
                        ]),
                        createVNode("div", { class: "inner-detail" }, [
                          createVNode("p", null, toDisplayString(item.brand), 1)
                        ])
                      ]),
                      item.variants[0].color ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "detail-part"
                      }, [
                        createVNode("div", { class: "title-detail" }, [
                          createVNode("h5", null, "color")
                        ]),
                        createVNode("div", { class: "inner-detail" }, [
                          createVNode("p", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList($options.Color(item.variants), (variant, variantIndex) => {
                              return openBlock(), createBlock("span", { key: variantIndex }, toDisplayString(variant), 1);
                            }), 128))
                          ])
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "detail-part" }, [
                        createVNode("div", { class: "title-detail" }, [
                          createVNode("h5", null, "availability")
                        ]),
                        createVNode("div", { class: "inner-detail" }, [
                          createVNode("p", null, "In stock")
                        ])
                      ]),
                      createVNode("div", { class: "btn-part" }, [
                        createVNode("a", {
                          href: "javascript:void(0)",
                          class: "btn btn-solid",
                          onClick: ($event) => $options.addToCart(item)
                        }, "add to cart", 8, ["onClick"])
                      ])
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
            (openBlock(true), createBlock(Fragment, null, renderList($options.compare, (item, index) => {
              return openBlock(), createBlock(_component_swiper_slide, {
                class: "swiper-slide",
                key: index
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "compare-part" }, [
                    createVNode("button", {
                      type: "button",
                      class: "close-btn",
                      onClick: ($event) => $options.removeCompareItem(item)
                    }, [
                      createVNode("span", { "aria-hidden": "true" }, "\xD7")
                    ], 8, ["onClick"]),
                    createVNode("div", { class: "img-secton" }, [
                      createVNode("div", null, [
                        createVNode("img", {
                          src: $options.getImgUrl(item.images[0].src),
                          class: "img-fluid",
                          alt: "image"
                        }, null, 8, ["src"])
                      ]),
                      createVNode("a", { href: "#" }, [
                        createVNode("h5", null, toDisplayString(item.title), 1)
                      ]),
                      createVNode("h5", null, toDisplayString(item.price * $options.curr.curr || _ctx.currency($options.curr.symbol)), 1)
                    ]),
                    createVNode("div", { class: "detail-part" }, [
                      createVNode("div", { class: "title-detail" }, [
                        createVNode("h5", null, "discription")
                      ]),
                      createVNode("div", { class: "inner-detail" }, [
                        createVNode("p", null, toDisplayString(item.description), 1)
                      ])
                    ]),
                    createVNode("div", { class: "detail-part" }, [
                      createVNode("div", { class: "title-detail" }, [
                        createVNode("h5", null, "Brand Name")
                      ]),
                      createVNode("div", { class: "inner-detail" }, [
                        createVNode("p", null, toDisplayString(item.brand), 1)
                      ])
                    ]),
                    item.variants[0].color ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "detail-part"
                    }, [
                      createVNode("div", { class: "title-detail" }, [
                        createVNode("h5", null, "color")
                      ]),
                      createVNode("div", { class: "inner-detail" }, [
                        createVNode("p", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList($options.Color(item.variants), (variant, variantIndex) => {
                            return openBlock(), createBlock("span", { key: variantIndex }, toDisplayString(variant), 1);
                          }), 128))
                        ])
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "detail-part" }, [
                      createVNode("div", { class: "title-detail" }, [
                        createVNode("h5", null, "availability")
                      ]),
                      createVNode("div", { class: "inner-detail" }, [
                        createVNode("p", null, "In stock")
                      ])
                    ]),
                    createVNode("div", { class: "btn-part" }, [
                      createVNode("a", {
                        href: "javascript:void(0)",
                        class: "btn btn-solid",
                        onClick: ($event) => $options.addToCart(item)
                      }, "add to cart", 8, ["onClick"])
                    ])
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
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$options.compare.length) {
    _push(`<div class="col-12 empty-cart-cls text-center"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid" alt="empty cart"><h3 class="mt-3"><strong>Your Compare List is Empty</strong></h3><div class="col-12">`);
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
  _push(`</div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/compare/compare-2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const compare2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { compare2 as default };
//# sourceMappingURL=compare-2.a3447c36.mjs.map
