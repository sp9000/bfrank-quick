import { m as mapState, e as useProductStore, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { u as useBlogStore } from './blog.6f995c75.mjs';
import { q as quickviewModel, c as compareModel } from './compare-popup.2ccec425.mjs';
import { c as cartModel } from './cart-modal-popup.584757b0.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { useSSRContext, resolveComponent, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, mergeProps } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { Swiper, SwiperSlide } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { Navigation } from 'file:///home/sp07/vue/templatian/node_modules/swiper/swiper.esm.js';
import { _ as __nuxt_component_0 } from './product-box1.0b51d818.mjs';
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

const _sfc_main$7 = {
  data() {
    return {
      imagepath: "../../images/Offer-banner.png",
      showModal: false
    };
  },
  mounted() {
    if (localStorage.getItem("showModel") !== "newsletter") {
      this.showModal = true;
      localStorage.setItem("showModel", "newsletter");
    }
  },
  methods: {
    closeCart() {
      this.showModal = false;
    }
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  if ($data.showModal) {
    _push(`<div class="modal-backdrop fade show"></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.showModal) {
    _push(`<div class="modal fade show d-block bd-example-modal-lg theme-modal" id="modal-newsletter" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="modal-cartLabel"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-body modal1"><div class="container-fluid p-0"><div class="row"><div class="col-12"><div class="modal-bg"><button class="close btn-close" type="button"><span>\xD7</span></button><div class="offer-content"><img${ssrRenderAttr("src", $data.imagepath)} class="img-fluid" alt="offer"><h2>newsletter</h2><form class="auth-form needs-validation" target="_blank"><div class="form-group mx-sm-3"><input type="email" class="form-control" name="EMAIL" placeholder="Enter your email" required="required"><button type="submit" class="btn btn-solid" id="mc-submit">subscribe</button></div></form></div></div></div></div></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/newsletter-popup.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const newsletterModel = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7]]);
const _sfc_main$6 = {
  data() {
    return {
      items: [
        {
          imagepath: "/images/home-banner/34.jpg",
          title: "Beauty Products",
          subtitle: "welcome to cosmetics",
          alignclass: "p-left"
        },
        {
          imagepath: "/images/home-banner/35.jpg",
          title: "On all cosmetics",
          subtitle: "save 30% off",
          alignclass: "p-left"
        }
      ]
    };
  },
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    return {
      modules: [Navigation]
    };
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}><section class="p-0"><div class="slide-1 home-slider">`);
  _push(ssrRenderComponent(_component_swiper, {
    loop: "true",
    navigation: true,
    modules: $setup.modules,
    slidesPerView: _ctx.auto,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($data.items, (item, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: "swiper-slide",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="${ssrRenderClass([item.alignclass, "home text-center"])}" style="${ssrRenderStyle({ "background-image": "url(" + item.imagepath + ")" })}"${_scopeId2}><div class="container"${_scopeId2}><div class="row"${_scopeId2}><div class="col"${_scopeId2}><div class="slider-contain"${_scopeId2}><div${_scopeId2}><h4${_scopeId2}>${ssrInterpolate(item.title)}</h4><h1${_scopeId2}>${ssrInterpolate(item.subtitle)}</h1>`);
                _push3(ssrRenderComponent(_component_nuxt_link, {
                  to: { path: "/collection/leftsidebar/all" },
                  class: "btn btn-solid"
                }, {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(`shop now`);
                    } else {
                      return [
                        createTextVNode("shop now")
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                _push3(`</div></div></div></div></div></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["home text-center", item.alignclass],
                    style: { "background-image": "url(" + item.imagepath + ")" }
                  }, [
                    createVNode("div", { class: "container" }, [
                      createVNode("div", { class: "row" }, [
                        createVNode("div", { class: "col" }, [
                          createVNode("div", { class: "slider-contain" }, [
                            createVNode("div", null, [
                              createVNode("h4", null, toDisplayString(item.title), 1),
                              createVNode("h1", null, toDisplayString(item.subtitle), 1),
                              createVNode(_component_nuxt_link, {
                                to: { path: "/collection/leftsidebar/all" },
                                class: "btn btn-solid"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("shop now")
                                ]),
                                _: 1
                              })
                            ])
                          ])
                        ])
                      ])
                    ])
                  ], 6)
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($data.items, (item, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("div", {
                  class: ["home text-center", item.alignclass],
                  style: { "background-image": "url(" + item.imagepath + ")" }
                }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "row" }, [
                      createVNode("div", { class: "col" }, [
                        createVNode("div", { class: "slider-contain" }, [
                          createVNode("div", null, [
                            createVNode("h4", null, toDisplayString(item.title), 1),
                            createVNode("h1", null, toDisplayString(item.subtitle), 1),
                            createVNode(_component_nuxt_link, {
                              to: { path: "/collection/leftsidebar/all" },
                              class: "btn btn-solid"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("shop now")
                              ]),
                              _: 1
                            })
                          ])
                        ])
                      ])
                    ])
                  ])
                ], 6)
              ]),
              _: 2
            }, 1024);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></section></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/beauty/slider.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const Slider = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6]]);
const _sfc_main$5 = {
  data() {
    return {
      imagepath: "/images/beauty/about-us.jpg",
      title: "about us",
      desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.sit voluptatem accusantium doloremque laudantium,totam rem aperiam.",
      service_1: "free shipping",
      service_2: "24 X 7 service",
      service_3: "festival offer"
    };
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><section class="section-b-space beauty-about"><div class="container"><div class="row"><div class="col-xl-5 col-lg-6 col-md-12 offset-xl-1 text-center"><img${ssrRenderAttr("src", $data.imagepath)} alt class="img-fluid"></div><div class="col-xl-5 col-lg-6 col-md-12"><div class="about-section"><div><h2>${ssrInterpolate($data.title)}</h2><div class="about-text"><p>${ssrInterpolate($data.desc)}</p></div><div class="service small-section pb-0"><div class="row"><div class="col-sm-4 service-block1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -117 679.99892 679"><path d="m12.347656 378.382812h37.390625c4.371094 37.714844 36.316407 66.164063 74.277344 66.164063 37.96875 0 69.90625-28.449219 74.28125-66.164063h241.789063c4.382812 37.714844 36.316406 66.164063 74.277343 66.164063 37.96875 0 69.902344-28.449219 74.285157-66.164063h78.890624c6.882813 0 12.460938-5.578124 12.460938-12.460937v-352.957031c0-6.882813-5.578125-12.464844-12.460938-12.464844h-432.476562c-6.875 0-12.457031 5.582031-12.457031 12.464844v69.914062h-105.570313c-4.074218.011719-7.890625 2.007813-10.21875 5.363282l-68.171875 97.582031-26.667969 37.390625-9.722656 13.835937c-1.457031 2.082031-2.2421872 4.558594-2.24999975 7.101563v121.398437c-.09765625 3.34375 1.15624975 6.589844 3.47656275 9.003907 2.320312 2.417968 5.519531 3.796874 8.867187 3.828124zm111.417969 37.386719c-27.527344 0-49.851563-22.320312-49.851563-49.847656 0-27.535156 22.324219-49.855469 49.851563-49.855469 27.535156 0 49.855469 22.320313 49.855469 49.855469 0 27.632813-22.21875 50.132813-49.855469 50.472656zm390.347656 0c-27.53125 0-49.855469-22.320312-49.855469-49.847656 0-27.535156 22.324219-49.855469 49.855469-49.855469 27.539063 0 49.855469 22.320313 49.855469 49.855469.003906 27.632813-22.21875 50.132813-49.855469 50.472656zm140.710938-390.34375v223.34375h-338.375c-6.882813 0-12.464844 5.578125-12.464844 12.460938 0 6.882812 5.582031 12.464843 12.464844 12.464843h338.375v79.761719h-66.421875c-4.382813-37.710937-36.320313-66.15625-74.289063-66.15625-37.960937 0-69.898437 28.445313-74.277343 66.15625h-192.308594v-271.324219h89.980468c6.882813 0 12.464844-5.582031 12.464844-12.464843 0-6.882813-5.582031-12.464844-12.464844-12.464844h-89.980468v-31.777344zm-531.304688 82.382813h99.703125v245.648437h-24.925781c-4.375-37.710937-36.3125-66.15625-74.28125-66.15625-37.960937 0-69.90625 28.445313-74.277344 66.15625h-24.929687v-105.316406l3.738281-5.359375h152.054687c6.882813 0 12.460938-5.574219 12.460938-12.457031v-92.226563c0-6.882812-5.578125-12.464844-12.460938-12.464844h-69.796874zm-30.160156 43h74.777344v67.296875h-122.265625zm0 0" fill="#ff4c3b"></path></svg><h5>${ssrInterpolate($data.service_1)}</h5></div><div class="col-sm-4 service-block1"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 480 480" style="${ssrRenderStyle({ "enable-background": "new 0 0 480 480" })}" xml:space="preserve" width="512px" height="512px"><g><g><g><path d="M472,432h-24V280c-0.003-4.418-3.588-7.997-8.006-7.994c-2.607,0.002-5.05,1.274-6.546,3.41l-112,160     c-2.532,3.621-1.649,8.609,1.972,11.14c1.343,0.939,2.941,1.443,4.58,1.444h104v24c0,4.418,3.582,8,8,8s8-3.582,8-8v-24h24     c4.418,0,8-3.582,8-8S476.418,432,472,432z M432,432h-88.64L432,305.376V432z" fill="#ff4c3b"></path><path d="M328,464h-94.712l88.056-103.688c0.2-0.238,0.387-0.486,0.56-0.744c16.566-24.518,11.048-57.713-12.56-75.552     c-28.705-20.625-68.695-14.074-89.319,14.631C212.204,309.532,207.998,322.597,208,336c0,4.418,3.582,8,8,8s8-3.582,8-8     c-0.003-26.51,21.486-48.002,47.995-48.005c10.048-0.001,19.843,3.151,28.005,9.013c16.537,12.671,20.388,36.007,8.8,53.32     l-98.896,116.496c-2.859,3.369-2.445,8.417,0.924,11.276c1.445,1.226,3.277,1.899,5.172,1.9h112c4.418,0,8-3.582,8-8     S332.418,464,328,464z" fill="#ff4c3b"></path><path d="M216.176,424.152c0.167-4.415-3.278-8.129-7.693-8.296c-0.001,0-0.002,0-0.003,0     C104.11,411.982,20.341,328.363,16.28,224H48c4.418,0,8-3.582,8-8s-3.582-8-8-8H16.28C20.283,103.821,103.82,20.287,208,16.288     V40c0,4.418,3.582,8,8,8s8-3.582,8-8V16.288c102.754,3.974,185.686,85.34,191.616,188l-31.2-31.2     c-3.178-3.07-8.242-2.982-11.312,0.196c-2.994,3.1-2.994,8.015,0,11.116l44.656,44.656c0.841,1.018,1.925,1.807,3.152,2.296     c0.313,0.094,0.631,0.172,0.952,0.232c0.549,0.198,1.117,0.335,1.696,0.408c0.08,0,0.152,0,0.232,0c0.08,0,0.152,0,0.224,0     c0.609-0.046,1.211-0.164,1.792-0.352c0.329-0.04,0.655-0.101,0.976-0.184c1.083-0.385,2.069-1.002,2.888-1.808l45.264-45.248     c3.069-3.178,2.982-8.242-0.196-11.312c-3.1-2.994-8.015-2.994-11.116,0l-31.976,31.952     C425.933,90.37,331.38,0.281,216.568,0.112C216.368,0.104,216.2,0,216,0s-0.368,0.104-0.568,0.112     C96.582,0.275,0.275,96.582,0.112,215.432C0.112,215.632,0,215.8,0,216s0.104,0.368,0.112,0.568     c0.199,115.917,91.939,210.97,207.776,215.28h0.296C212.483,431.847,216.013,428.448,216.176,424.152z" fill="#ff4c3b"></path><path d="M323.48,108.52c-3.124-3.123-8.188-3.123-11.312,0L226.2,194.48c-6.495-2.896-13.914-2.896-20.408,0l-40.704-40.704     c-3.178-3.069-8.243-2.981-11.312,0.197c-2.994,3.1-2.994,8.015,0,11.115l40.624,40.624c-5.704,11.94-0.648,26.244,11.293,31.947     c9.165,4.378,20.095,2.501,27.275-4.683c7.219-7.158,9.078-18.118,4.624-27.256l85.888-85.888     C326.603,116.708,326.603,111.644,323.48,108.52z M221.658,221.654c-0.001,0.001-0.001,0.001-0.002,0.002     c-3.164,3.025-8.148,3.025-11.312,0c-3.125-3.124-3.125-8.189-0.002-11.314c3.124-3.125,8.189-3.125,11.314-0.002     C224.781,213.464,224.781,218.53,221.658,221.654z" fill="#ff4c3b"></path></g></g></g></svg><h5>${ssrInterpolate($data.service_2)}</h5></div><div class="col-sm-4 service-block1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -14 512.00001 512"><path d="m136.964844 308.234375c4.78125-2.757813 6.417968-8.878906 3.660156-13.660156-2.761719-4.777344-8.878906-6.417969-13.660156-3.660157-4.78125 2.761719-6.421875 8.882813-3.660156 13.660157 2.757812 4.78125 8.878906 6.421875 13.660156 3.660156zm0 0" fill="#ff4c3b"></path><path d="m95.984375 377.253906 50.359375 87.230469c10.867188 18.84375 35.3125 25.820313 54.644531 14.644531 19.128907-11.054687 25.703125-35.496094 14.636719-54.640625l-30-51.96875 25.980469-15c4.78125-2.765625 6.421875-8.878906 3.660156-13.660156l-13.003906-22.523437c1.550781-.300782 11.746093-2.300782 191.539062-37.570313 22.226563-1.207031 35.542969-25.515625 24.316407-44.949219l-33.234376-57.5625 21.238282-32.167968c2.085937-3.164063 2.210937-7.230469.316406-10.511719l-20-34.640625c-1.894531-3.28125-5.492188-5.203125-9.261719-4.980469l-38.472656 2.308594-36.894531-63.90625c-5.34375-9.257813-14.917969-14.863281-25.605469-14.996094-.128906-.003906-.253906-.003906-.382813-.003906-10.328124 0-19.703124 5.140625-25.257812 13.832031l-130.632812 166.414062-84.925782 49.03125c-33.402344 19.277344-44.972656 62.128907-25.621094 95.621094 17.679688 30.625 54.953126 42.671875 86.601563 30zm102.324219 57.238282c5.523437 9.554687 2.253906 21.78125-7.328125 27.316406-9.613281 5.558594-21.855469 2.144531-27.316407-7.320313l-50-86.613281 34.640626-20c57.867187 100.242188 49.074218 85.011719 50.003906 86.617188zm-22.683594-79.296876-10-17.320312 17.320312-10 10 17.320312zm196.582031-235.910156 13.820313 23.9375-12.324219 18.664063-23.820313-41.261719zm-104.917969-72.132812c2.683594-4.390625 6.941407-4.84375 8.667969-4.796875 1.707031.019531 5.960938.550781 8.527344 4.996093l116.3125 201.464844c3.789063 6.558594-.816406 14.804688-8.414063 14.992188-1.363281.03125-1.992187.277344-5.484374.929687l-123.035157-213.105469c2.582031-3.320312 2.914063-3.640624 3.425781-4.480468zm-16.734374 21.433594 115.597656 200.222656-174.460938 34.21875-53.046875-91.878906zm-223.851563 268.667968c-4.390625-7.597656-6.710937-16.222656-6.710937-24.949218 0-17.835938 9.585937-34.445313 25.011718-43.351563l77.941406-45 50 86.601563-77.941406 45.003906c-23.878906 13.78125-54.515625 5.570312-68.300781-18.304688zm0 0" fill="#ff4c3b"></path><path d="m105.984375 314.574219c-2.761719-4.78125-8.878906-6.421875-13.660156-3.660157l-17.320313 10c-4.773437 2.757813-10.902344 1.113282-13.660156-3.660156-2.761719-4.78125-8.878906-6.421875-13.660156-3.660156s-6.421875 8.878906-3.660156 13.660156c8.230468 14.257813 26.589843 19.285156 40.980468 10.980469l17.320313-10c4.78125-2.761719 6.421875-8.875 3.660156-13.660156zm0 0" fill="#ff4c3b"></path><path d="m497.136719 43.746094-55.722657 31.007812c-4.824218 2.6875-6.5625 8.777344-3.875 13.601563 2.679688 4.820312 8.765626 6.566406 13.601563 3.875l55.71875-31.007813c4.828125-2.6875 6.5625-8.777344 3.875-13.601562-2.683594-4.828125-8.773437-6.5625-13.597656-3.875zm0 0" fill="#ff4c3b"></path><path d="m491.292969 147.316406-38.636719-10.351562c-5.335938-1.429688-10.820312 1.734375-12.25 7.070312-1.429688 5.335938 1.738281 10.816406 7.074219 12.246094l38.640625 10.351562c5.367187 1.441407 10.824218-1.773437 12.246094-7.070312 1.429687-5.335938-1.738282-10.820312-7.074219-12.246094zm0 0" fill="#ff4c3b"></path><path d="m394.199219 7.414062-10.363281 38.640626c-1.429688 5.335937 1.734374 10.816406 7.070312 12.25 5.332031 1.425781 10.816406-1.730469 12.25-7.070313l10.359375-38.640625c1.429687-5.335938-1.734375-10.820312-7.070313-12.25-5.332031-1.429688-10.816406 1.734375-12.246093 7.070312zm0 0" fill="#ff4c3b"></path></svg><h5>${ssrInterpolate($data.service_3)}</h5></div></div></div></div></div></div></div></div></section></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/beauty/about.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const About = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$4 = {
  props: ["products", "category"],
  components: {
    productBox1: __nuxt_component_0,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      title: "new products",
      subtitle: "special offer",
      showCart: false,
      showquickviewmodel: false,
      showcomapreModal: false,
      quickviewproduct: {},
      comapreproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
      swiperOption: {
        breakpoints: {
          1367: {
            slidesPerView: 5,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          0: {
            slidesPerView: 2
          }
        }
      }
    };
  },
  methods: {
    getCategoryProduct(collection) {
      return this.products.filter((item) => {
        if (item.collection.find((i) => i === collection)) {
          return item;
        }
      });
    },
    alert(item) {
      this.dismissCountDown = item;
    },
    showCartModal(item) {
      this.showCart = item;
      this.$emit("openCart", this.showCart);
    },
    showquickview(item, productData) {
      this.showquickviewmodel = item;
      this.quickviewproduct = productData;
      this.$emit("openQuickview", this.showquickviewmodel, this.quickviewproduct);
    },
    showcomparemodal(item, productData) {
      this.showcomapreModal = item;
      this.comapreproduct = productData;
      this.$emit("openCompare", this.showcomapreModal, this.comapreproduct);
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_productBox1 = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="title1"><h4>${ssrInterpolate($data.subtitle)}</h4><h2 class="title-inner1">${ssrInterpolate($data.title)}</h2></div><section class="pt-0 ratio_asos"><div class="container"><div class="row"><div class="col">`);
  _push(ssrRenderComponent(_component_swiper, {
    breakpoints: $data.swiperOption.breakpoints,
    slidesPerView: 2,
    spaceBetween: 20,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($options.getCategoryProduct($props.category[1]), (product, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: "swiper-slide",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="product-box"${_scopeId2}>`);
                _push3(ssrRenderComponent(_component_productBox1, {
                  onOpencartmodel: $options.showCartModal,
                  onShowCompareModal: $options.showcomparemodal,
                  onOpenquickview: $options.showquickview,
                  onAlertseconds: $options.alert,
                  product,
                  index
                }, null, _parent3, _scopeId2));
                _push3(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "product-box" }, [
                    createVNode(_component_productBox1, {
                      onOpencartmodel: $options.showCartModal,
                      onShowCompareModal: $options.showcomparemodal,
                      onOpenquickview: $options.showquickview,
                      onAlertseconds: $options.alert,
                      product,
                      index
                    }, null, 8, ["onOpencartmodel", "onShowCompareModal", "onOpenquickview", "onAlertseconds", "product", "index"])
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
          (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($props.category[1]), (product, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("div", { class: "product-box" }, [
                  createVNode(_component_productBox1, {
                    onOpencartmodel: $options.showCartModal,
                    onShowCompareModal: $options.showcomparemodal,
                    onOpenquickview: $options.showquickview,
                    onAlertseconds: $options.alert,
                    product,
                    index
                  }, null, 8, ["onOpencartmodel", "onShowCompareModal", "onOpenquickview", "onAlertseconds", "product", "index"])
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
  _push(`</div></div></div></section></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/beauty/product-slider.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ProductSlider = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$3 = {
  data() {
    return {
      title: "Product tutorial",
      subtitle: "special offer",
      imagepath: "/images/beauty/video_1.jpg",
      videolink: "https://www.youtube.com/embed/FRIDLxM8Roc"
    };
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><section class="video-section section-b-space"><div class="title1"><h4>${ssrInterpolate($data.subtitle)}</h4><h2 class="title-inner1">${ssrInterpolate($data.title)}</h2></div><div class="container"><div class="row"><div class="col-md-8 offset-md-2"><div class="video-img"><img${ssrRenderAttr("src", $data.imagepath)} alt class="img-fluid"><div class="play-btn" data-bs-toggle="modal" data-bs-target="#modal-1"><span><i class="fa fa-play" aria-hidden="true"></i></span></div><div class="modal fade" id="modal-1" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="modal-cartLabel"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><iframe src="https://www.youtube.com/embed/FRIDLxM8Roc" allowfullscreen width="100%" height="400"></iframe></div></div></div></div></div></div></div></section></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/beauty/video-tutorial.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const VideoTutorial = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  props: ["products"],
  components: {
    productBox1: __nuxt_component_0,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      title: "new products",
      subtitle: "special offer",
      showCart: false,
      showquickviewmodel: false,
      showcomapreModal: false,
      quickviewproduct: {},
      comapreproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
      swiperOption: {
        breakpoints: {
          1367: {
            slidesPerView: 5,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          0: {
            slidesPerView: 2
          }
        }
      }
    };
  },
  methods: {
    alert(item) {
      this.dismissCountDown = item;
    },
    showCartModal(item) {
      this.showCart = item;
      this.$emit("openCart", this.showCart);
    },
    showquickview(item, productData) {
      this.showquickviewmodel = item;
      this.quickviewproduct = productData;
      this.$emit("openQuickview", this.showquickviewmodel, this.quickviewproduct);
    },
    showcomparemodal(item, productData) {
      this.showcomapreModal = item;
      this.comapreproduct = productData;
      this.$emit("openCompare", this.showcomapreModal, this.comapreproduct);
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_productBox1 = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="title1"><h4>${ssrInterpolate($data.subtitle)}</h4><h2 class="title-inner1">${ssrInterpolate($data.title)}</h2></div><section class="pt-0 ratio_asos"><div class="container"><div class="row">`);
  _push(ssrRenderComponent(_component_swiper, {
    breakpoints: $data.swiperOption.breakpoints,
    slidesPerView: 3,
    spaceBetween: 20,
    class: "swiper-wrapper col"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($props.products, (product, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: "swiper-slide",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="product-box"${_scopeId2}>`);
                _push3(ssrRenderComponent(_component_productBox1, {
                  onOpencartmodel: $options.showCartModal,
                  onShowCompareModal: $options.showcomparemodal,
                  onOpenquickview: $options.showquickview,
                  onAlertseconds: $options.alert,
                  product,
                  index
                }, null, _parent3, _scopeId2));
                _push3(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "product-box" }, [
                    createVNode(_component_productBox1, {
                      onOpencartmodel: $options.showCartModal,
                      onShowCompareModal: $options.showcomparemodal,
                      onOpenquickview: $options.showquickview,
                      onAlertseconds: $options.alert,
                      product,
                      index
                    }, null, 8, ["onOpencartmodel", "onShowCompareModal", "onOpenquickview", "onAlertseconds", "product", "index"])
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
          (openBlock(true), createBlock(Fragment, null, renderList($props.products, (product, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("div", { class: "product-box" }, [
                  createVNode(_component_productBox1, {
                    onOpencartmodel: $options.showCartModal,
                    onShowCompareModal: $options.showcomparemodal,
                    onOpenquickview: $options.showquickview,
                    onAlertseconds: $options.alert,
                    product,
                    index
                  }, null, 8, ["onOpencartmodel", "onShowCompareModal", "onOpenquickview", "onAlertseconds", "product", "index"])
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
  _push(`</div></div></section></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/beauty/top-product-slider.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TopProductslider = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const beauty = [
  {
    img: "beauty/2.jpg"
  },
  {
    img: "beauty/3.jpg"
  },
  {
    img: "beauty/4.jpg"
  },
  {
    img: "beauty/2.jpg"
  },
  {
    img: "beauty/6.jpg"
  },
  {
    img: "beauty/7.jpg"
  },
  {
    img: "beauty/4.jpg"
  },
  {
    img: "beauty/1.jpg"
  },
  {
    img: "beauty/2.jpg"
  }
];
const bags = [
  {
    img: "bags/1.jpg"
  },
  {
    img: "bags/2.jpg"
  },
  {
    img: "bags/3.jpg"
  },
  {
    img: "bags/4.jpg"
  },
  {
    img: "bags/5.jpg"
  },
  {
    img: "bags/6.jpg"
  },
  {
    img: "bags/7.jpg"
  },
  {
    img: "bags/8.jpg"
  },
  {
    img: "bags/2.jpg"
  }
];
const fashion = [
  {
    img: "2.jpg"
  },
  {
    img: "3.jpg"
  },
  {
    img: "4.jpg"
  },
  {
    img: "9.jpg"
  },
  {
    img: "6.jpg"
  },
  {
    img: "7.jpg"
  },
  {
    img: "8.jpg"
  },
  {
    img: "9.jpg"
  },
  {
    img: "2.jpg"
  }
];
const flower = [
  {
    img: "flower/insta/2.jpg"
  },
  {
    img: "flower/insta/3.jpg"
  },
  {
    img: "flower/insta/4.jpg"
  },
  {
    img: "flower/insta/5.jpg"
  },
  {
    img: "flower/insta/6.jpg"
  },
  {
    img: "flower/insta/7.jpg"
  },
  {
    img: "flower/insta/8.jpg"
  },
  {
    img: "flower/insta/2.jpg"
  },
  {
    img: "flower/insta/2.jpg"
  }
];
const gym = [
  {
    img: "gym/1.jpg"
  },
  {
    img: "gym/2.jpg"
  },
  {
    img: "gym/3.jpg"
  },
  {
    img: "gym/4.jpg"
  },
  {
    img: "gym/5.jpg"
  },
  {
    img: "gym/6.jpg"
  },
  {
    img: "gym/7.jpg"
  },
  {
    img: "gym/5.jpg"
  },
  {
    img: "gym/6.jpg"
  }
];
const jewellery = [
  {
    img: "jewellery/1.jpg"
  },
  {
    img: "jewellery/2.jpg"
  },
  {
    img: "jewellery/4.jpg"
  },
  {
    img: "jewellery/5.jpg"
  },
  {
    img: "jewellery/6.jpg"
  },
  {
    img: "jewellery/9.jpg"
  },
  {
    img: "jewellery/8.jpg"
  },
  {
    img: "jewellery/4.jpg"
  },
  {
    img: "jewellery/2.jpg"
  }
];
const kids = [
  {
    img: "kids/2.jpg"
  },
  {
    img: "kids/3.jpg"
  },
  {
    img: "kids/4.jpg"
  },
  {
    img: "kids/9.jpg"
  },
  {
    img: "kids/6.jpg"
  },
  {
    img: "kids/7.jpg"
  },
  {
    img: "kids/8.jpg"
  },
  {
    img: "kids/9.jpg"
  },
  {
    img: "kids/2.jpg"
  }
];
const shoes = [
  {
    img: "shoes/2.jpg"
  },
  {
    img: "shoes/3.jpg"
  },
  {
    img: "shoes/4.jpg"
  },
  {
    img: "shoes/9.jpg"
  },
  {
    img: "shoes/6.jpg"
  },
  {
    img: "shoes/7.jpg"
  },
  {
    img: "shoes/8.jpg"
  },
  {
    img: "shoes/10.jpg"
  },
  {
    img: "shoes/1.jpg"
  }
];
const watches = [
  {
    img: "watches/1.jpg"
  },
  {
    img: "watches/2.jpg"
  },
  {
    img: "watches/3.jpg"
  },
  {
    img: "watches/4.jpg"
  },
  {
    img: "watches/5.jpg"
  },
  {
    img: "watches/6.jpg"
  },
  {
    img: "watches/7.jpg"
  },
  {
    img: "watches/8.jpg"
  },
  {
    img: "watches/2.jpg"
  }
];
const images = {
  beauty,
  bags,
  fashion,
  flower,
  gym,
  jewellery,
  kids,
  shoes,
  watches
};
const _sfc_main$1 = {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      image: images.fashion,
      swiperOption: {
        breakpoints: {
          1367: {
            slidesPerView: 7
          },
          1024: {
            slidesPerView: 5
          },
          600: {
            slidesPerView: 4
          },
          0: {
            slidesPerView: 3
          }
        }
      },
      instagram: []
    };
  },
  methods: {
    getImgUrl(path) {
      return "/images/slider/" + path;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "instagram section-b-space ratio_square" }, _attrs))}><div class="container-fluid"><div class="row"><div class="col-md-12"><h2 class="title-borderless"># instagram</h2><div class="slide-7 no-arrow slick-instagram">`);
  _push(ssrRenderComponent(_component_swiper, {
    breakpoints: $data.swiperOption.breakpoints,
    spaceBetween: 0,
    loop: "true",
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($data.image, (item, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, { key: index }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<a href="#"${_scopeId2}><div class="instagram-box"${_scopeId2}><img${ssrRenderAttr("src", $options.getImgUrl(item.img))} alt="Avatar" class="bg-img" style="${ssrRenderStyle({ "width": "100%" })}"${_scopeId2}><div class="overlay"${_scopeId2}><i class="fa fa-instagram"${_scopeId2}></i></div></div></a>`);
              } else {
                return [
                  createVNode("a", { href: "#" }, [
                    createVNode("div", { class: "instagram-box" }, [
                      createVNode("img", {
                        src: $options.getImgUrl(item.img),
                        alt: "Avatar",
                        class: "bg-img",
                        style: { "width": "100%" }
                      }, null, 8, ["src"]),
                      createVNode("div", { class: "overlay" }, [
                        createVNode("i", { class: "fa fa-instagram" })
                      ])
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
          (openBlock(true), createBlock(Fragment, null, renderList($data.image, (item, index) => {
            return openBlock(), createBlock(_component_swiper_slide, { key: index }, {
              default: withCtx(() => [
                createVNode("a", { href: "#" }, [
                  createVNode("div", { class: "instagram-box" }, [
                    createVNode("img", {
                      src: $options.getImgUrl(item.img),
                      alt: "Avatar",
                      class: "bg-img",
                      style: { "width": "100%" }
                    }, null, 8, ["src"]),
                    createVNode("div", { class: "overlay" }, [
                      createVNode("i", { class: "fa fa-instagram" })
                    ])
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
  _push(`</div></div></div></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shop/beauty/instagram.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Instagram = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  components: {
    Slider,
    About,
    ProductSlider,
    VideoTutorial,
    TopProductslider,
    Instagram,
    quickviewModel,
    compareModel,
    cartModalPopup: cartModel,
    newsletterModel
  },
  data() {
    return {
      blog: [],
      products: [],
      category: [],
      showquickviewmodel: false,
      showcomparemodal: false,
      showcartmodal: false,
      quickviewproduct: {},
      comapreproduct: {}
    };
  },
  computed: {
    ...mapState(useProductStore, {
      productslist: "productslist"
    }),
    ...mapState(useBlogStore, {
      bloglist: "bloglist"
    })
  },
  mounted() {
    this.productsArray();
    this.blogArray();
  },
  methods: {
    productsArray: function() {
      this.productslist.map((item) => {
        if (item.type === "beauty") {
          this.products.push(item);
          item.collection.map((i) => {
            const index = this.category.indexOf(i);
            if (index === -1)
              this.category.push(i);
          });
        }
      });
    },
    blogArray: function() {
      this.bloglist.map((item) => {
        if (item.type === "beauty") {
          this.blog.push(item);
        }
      });
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
    showCart(item) {
      this.showcartmodal = item;
    },
    closeCart(item) {
      this.showcartmodal = item;
    },
    closeViewModal(item) {
      this.showquickviewmodel = item;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Slider = resolveComponent("Slider");
  const _component_About = resolveComponent("About");
  const _component_ProductSlider = resolveComponent("ProductSlider");
  const _component_VideoTutorial = resolveComponent("VideoTutorial");
  const _component_TopProductslider = resolveComponent("TopProductslider");
  const _component_Blog = resolveComponent("Blog");
  const _component_Instagram = resolveComponent("Instagram");
  const _component_quickviewModel = resolveComponent("quickviewModel");
  const _component_compareModal = resolveComponent("compareModal");
  const _component_cartModelPopup = resolveComponent("cartModelPopup");
  const _component_newsletterModel = resolveComponent("newsletterModel");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Slider, null, null, _parent));
  _push(ssrRenderComponent(_component_About, null, null, _parent));
  _push(ssrRenderComponent(_component_ProductSlider, {
    products: $data.products,
    category: $data.category,
    onOpenQuickview: $options.showQuickview,
    onOpenCompare: $options.showCoampre,
    onOpenCart: $options.showCart
  }, null, _parent));
  _push(ssrRenderComponent(_component_VideoTutorial, null, null, _parent));
  _push(ssrRenderComponent(_component_TopProductslider, {
    products: $data.products,
    onOpenQuickview: $options.showQuickview,
    onOpenCompare: $options.showCoampre,
    onOpenCart: $options.showCart
  }, null, _parent));
  _push(ssrRenderComponent(_component_Blog, { blog: $data.blog }, null, _parent));
  _push(ssrRenderComponent(_component_Instagram, null, null, _parent));
  _push(ssrRenderComponent(_component_quickviewModel, {
    openModal: $data.showquickviewmodel,
    productData: $data.quickviewproduct,
    onCloseView: $options.closeViewModal
  }, null, _parent));
  _push(ssrRenderComponent(_component_compareModal, {
    openCompare: $data.showcomparemodal,
    productData: $data.comapreproduct,
    onCloseCompare: $options.closeCompareModal
  }, null, _parent));
  _push(ssrRenderComponent(_component_cartModelPopup, {
    openCart: $data.showcartmodal,
    onCloseCart: $options.closeCart
  }, null, _parent));
  _push(ssrRenderComponent(_component_newsletterModel, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shop/beauty/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Beauty = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { Beauty as default };
//# sourceMappingURL=index.137b99ca.mjs.map
