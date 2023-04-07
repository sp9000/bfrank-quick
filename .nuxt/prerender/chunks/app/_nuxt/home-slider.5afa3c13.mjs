import { b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { Swiper, SwiperSlide } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { Navigation } from 'file:///home/sp07/vue/templatian/node_modules/swiper/swiper.esm.js';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      items: [
        {
          imagepath: "/images/home-banner/1.jpg",
          title: "welcome to fashion",
          subtitle: "women fashion",
          alignclass: "p-left"
        },
        {
          imagepath: "/images/home-banner/1.jpg",
          title: "welcome to fashion",
          subtitle: "men fashion",
          alignclass: "p-left"
        }
      ]
    };
  },
  setup() {
    return {
      modules: [Navigation]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Slider Element" }, null, _parent));
  _push(`<section><div class="slide-1 home-slider">`);
  _push(ssrRenderComponent(_component_swiper, {
    loop: "true",
    navigation: true,
    modules: $setup.modules,
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
                _push3(`<div class="${ssrRenderClass([item.alignclass, "home text-center"])}" style="${ssrRenderStyle({ "back  ground-image": "url(" + item.imagepath + ")" })}"${_scopeId2}><div class="container"${_scopeId2}><div class="row"${_scopeId2}><div class="col"${_scopeId2}><div class="slider-contain"${_scopeId2}><div${_scopeId2}><h4${_scopeId2}>${ssrInterpolate(item.title)}</h4><h1${_scopeId2}>${ssrInterpolate(item.subtitle)}</h1>`);
                _push3(ssrRenderComponent(_component_nuxt_link, {
                  to: { path: "/c  ollection/left-sidebar" },
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
                    style: { "back  ground-image": "url(" + item.imagepath + ")" }
                  }, [
                    createVNode("div", { class: "container" }, [
                      createVNode("div", { class: "row" }, [
                        createVNode("div", { class: "col" }, [
                          createVNode("div", { class: "slider-contain" }, [
                            createVNode("div", null, [
                              createVNode("h4", null, toDisplayString(item.title), 1),
                              createVNode("h1", null, toDisplayString(item.subtitle), 1),
                              createVNode(_component_nuxt_link, {
                                to: { path: "/c  ollection/left-sidebar" },
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
                  style: { "back  ground-image": "url(" + item.imagepath + ")" }
                }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "row" }, [
                      createVNode("div", { class: "col" }, [
                        createVNode("div", { class: "slider-contain" }, [
                          createVNode("div", null, [
                            createVNode("h4", null, toDisplayString(item.title), 1),
                            createVNode("h1", null, toDisplayString(item.subtitle), 1),
                            createVNode(_component_nuxt_link, {
                              to: { path: "/c  ollection/left-sidebar" },
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
  _push(`</div></section><div class="container section-b-space section-t-space"><div class="row"><div class="col"><div class="card"><h5 class="card-header">Classes</h5><div class="card-body"><h5 class="card-title">For Parallax Image - .parallax</h5><h5>contain-align - .text-left, .text-center, .text-end</h5><h5>contain-position - .p-left, .p-center, .p-right</h5></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/home-slider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const homeSlider = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { homeSlider as default };
//# sourceMappingURL=home-slider.5afa3c13.mjs.map
