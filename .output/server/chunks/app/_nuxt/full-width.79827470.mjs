import { s as storeToRefs, e as useProductStore, f as useCartStore, c as __nuxt_component_0$1 } from '../server.mjs';
import { ref, unref, withCtx, openBlock, createBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import MasonryWall from '@yeger/vue-masonry-wall';
import { B as Breadcrumbs } from './breadcrumbs.b2644590.mjs';
import { q as quickviewModel, c as compareModel } from './compare-popup.58d95736.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'ufo';
import 'h3';
import '@unhead/vue';
import '@unhead/dom';
import 'vue-router';
import '@intlify/core-base';
import 'cookie-es';
import 'is-https';
import 'defu';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-solid-svg-icons';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'ipx';
import 'swiper/vue';

const _sfc_main = {
  __name: "full-width",
  __ssrInlineRender: true,
  setup(__props) {
    let { productslist, currency } = storeToRefs(useProductStore());
    let products = [], showquickviewmodel = ref(false), showcomparemodal = ref(false), quickviewproduct = {}, comapreproduct = {};
    productsArray();
    function getImgUrl(path) {
      return "/images/" + path;
    }
    function productsArray() {
      productslist.value.map((item) => {
        if (item.type === "metro") {
          products.push(item);
        }
      });
    }
    function showQuickview(productData) {
      showquickviewmodel.value = true;
      quickviewproduct = productData;
    }
    function closeViewModal() {
      showquickviewmodel.value = false;
    }
    function showCoampre(productData) {
      showcomparemodal.value = true;
      comapreproduct = productData;
    }
    function closeCompareModal(item) {
      showcomparemodal.value = false;
    }
    function addToWishlist(product) {
      useProductStore().addToWishlist(product);
    }
    function addToCart(product) {
      useCartStore().addToCart(product);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(Breadcrumbs), { title: "collection" }, null, _parent));
      _push(`<div class="container-fluid"><div class="row"><div class="col-12"><div class="section-t-space portfolio-section portfolio-padding metro-section port-col">`);
      _push(ssrRenderComponent(unref(MasonryWall), {
        items: unref(products),
        padding: 16,
        "column-width": 300,
        gap: 15
      }, {
        default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="col m-0 isotopeSelector item"${_scopeId}><div class="product-box"${_scopeId}><div class="img-wrapper"${_scopeId}><div class="front"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_nuxt_link, {
              to: { path: "/product/sidebar/" + item.id }
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img${ssrRenderAttr("src", getImgUrl(item.images[0].src))}${ssrRenderAttr("id", item.id)} class="img-fluid bg-img"${ssrRenderAttr("alt", item.title)}${_scopeId2}>`);
                } else {
                  return [
                    (openBlock(), createBlock("img", {
                      src: getImgUrl(item.images[0].src),
                      id: item.id,
                      class: "img-fluid bg-img",
                      alt: item.title,
                      key: _ctx.index
                    }, null, 8, ["src", "id", "alt"]))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div><div class="cart-info cart-wrap"${_scopeId}><button data-toggle="modal" data-target="#addtocart" title="Add to cart" variant="primary"${_scopeId}><i class="ti-shopping-cart"${_scopeId}></i></button>`);
            _push2(ssrRenderComponent(_component_nuxt_link, { to: { path: "/page/account/wishlist" } }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="ti-heart" aria-hidden="true"${_scopeId2}></i>`);
                } else {
                  return [
                    createVNode("i", {
                      class: "ti-heart",
                      "aria-hidden": "true",
                      onClick: ($event) => addToWishlist(item)
                    }, null, 8, ["onClick"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<a href="javascript:void(0)" title="Quick View" variant="primary"${_scopeId}><i class="ti-search" aria-hidden="true"${_scopeId}></i></a><a href="javascript:void(0)" title="Comapre" variant="primary"${_scopeId}><i class="ti-reload" aria-hidden="true"${_scopeId}></i></a></div></div><div class="product-detail"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_nuxt_link, {
              to: { path: "/product/sidebar/" + item.id }
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h6${_scopeId2}>${ssrInterpolate(item.title)}</h6>`);
                } else {
                  return [
                    createVNode("h6", null, toDisplayString(item.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<h4${_scopeId}>${ssrInterpolate(unref(currency).symbol)}${ssrInterpolate(item.price * unref(currency).curr)}</h4></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "col m-0 isotopeSelector item" }, [
                createVNode("div", { class: "product-box" }, [
                  createVNode("div", { class: "img-wrapper" }, [
                    createVNode("div", { class: "front" }, [
                      createVNode(_component_nuxt_link, {
                        to: { path: "/product/sidebar/" + item.id }
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("img", {
                            src: getImgUrl(item.images[0].src),
                            id: item.id,
                            class: "img-fluid bg-img",
                            alt: item.title,
                            key: _ctx.index
                          }, null, 8, ["src", "id", "alt"]))
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    createVNode("div", { class: "cart-info cart-wrap" }, [
                      createVNode("button", {
                        "data-toggle": "modal",
                        "data-target": "#addtocart",
                        title: "Add to cart",
                        onClick: ($event) => addToCart(item),
                        variant: "primary"
                      }, [
                        createVNode("i", { class: "ti-shopping-cart" })
                      ], 8, ["onClick"]),
                      createVNode(_component_nuxt_link, { to: { path: "/page/account/wishlist" } }, {
                        default: withCtx(() => [
                          createVNode("i", {
                            class: "ti-heart",
                            "aria-hidden": "true",
                            onClick: ($event) => addToWishlist(item)
                          }, null, 8, ["onClick"])
                        ]),
                        _: 2
                      }, 1024),
                      createVNode("a", {
                        href: "javascript:void(0)",
                        title: "Quick View",
                        onClick: ($event) => showQuickview(item),
                        variant: "primary"
                      }, [
                        createVNode("i", {
                          class: "ti-search",
                          "aria-hidden": "true"
                        })
                      ], 8, ["onClick"]),
                      createVNode("a", {
                        href: "javascript:void(0)",
                        title: "Comapre",
                        onClick: ($event) => showCoampre(item),
                        variant: "primary"
                      }, [
                        createVNode("i", {
                          class: "ti-reload",
                          "aria-hidden": "true"
                        })
                      ], 8, ["onClick"])
                    ])
                  ]),
                  createVNode("div", { class: "product-detail" }, [
                    createVNode(_component_nuxt_link, {
                      to: { path: "/product/sidebar/" + item.id }
                    }, {
                      default: withCtx(() => [
                        createVNode("h6", null, toDisplayString(item.title), 1)
                      ]),
                      _: 2
                    }, 1032, ["to"]),
                    createVNode("h4", null, toDisplayString(unref(currency).symbol) + toDisplayString(item.price * unref(currency).curr), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
      _push(ssrRenderComponent(unref(quickviewModel), {
        openModal: unref(showquickviewmodel),
        productData: unref(quickviewproduct),
        onCloseView: closeViewModal
      }, null, _parent));
      _push(ssrRenderComponent(unref(compareModel), {
        openCompare: unref(showcomparemodal),
        productData: unref(comapreproduct),
        onCloseCompare: closeCompareModal
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collection/full-width.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=full-width.79827470.mjs.map
