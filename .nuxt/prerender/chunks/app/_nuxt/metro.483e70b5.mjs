import { s as storeToRefs, e as useProductStore, f as useCartStore, c as __nuxt_component_0$1 } from '../server.mjs';
import { ref, unref, withCtx, openBlock, createBlock, createVNode, toDisplayString, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { _ as _imports_0 } from './2.25ea6962.mjs';
import MasonryWall from 'file:///home/sp07/vue/templatian/node_modules/@yeger/vue-masonry-wall/dist/index.mjs';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { q as quickviewModel, c as compareModel } from './compare-popup.71c679e4.mjs';
import { c as cartModel } from './cart-modal-popup.eaf7b920.mjs';
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
import 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';

const _sfc_main = {
  __name: "metro",
  __ssrInlineRender: true,
  setup(__props) {
    let { productslist, currency, changeCurrency } = storeToRefs(useProductStore());
    let products = [], showquickviewmodel = ref(false), showcomparemodal = ref(false), showcartmodal = ref(false), quickviewproduct = {}, comapreproduct = {}, cartproduct = {};
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
      _push(`<section class="section-b-space"><div class="collection-wrapper"><div class="container"><div class="row"><div class="collection-content col"><div class="page-main-content"><div class="top-banner-wrapper"><a href="#"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid bg-img" alt></a><div class="top-banner-content small-section pb-0"><h4>fashion</h4><h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></div></div><div class="collection-product-wrapper"><div class="section-t-space portfolio-section metro-section port-col">`);
      _push(ssrRenderComponent(unref(MasonryWall), {
        items: unref(products),
        padding: 16,
        "column-width": 300,
        gap: 15
      }, {
        default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="col isotopeSelector item m-0"${_scopeId}><div class="product-box"${_scopeId}><div class="img-wrapper"${_scopeId}><div class="front"${_scopeId}>`);
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
            _push2(`</div><div class="cart-info cart-wrap"${_scopeId}><button title="Add to cart" variant="primary"${_scopeId}><i class="ti-shopping-cart"${_scopeId}></i></button>`);
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
              createVNode("div", { class: "col isotopeSelector item m-0" }, [
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
      _push(`</div></div></div></div></div></div></div></section>`);
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
      _push(ssrRenderComponent(unref(cartModel), {
        openCart: unref(showcartmodal),
        productData: unref(cartproduct),
        onCloseCart: _ctx.closeCartModal
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collection/metro.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=metro.483e70b5.mjs.map
