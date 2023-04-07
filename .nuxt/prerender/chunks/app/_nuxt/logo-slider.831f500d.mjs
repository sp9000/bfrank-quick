import { Swiper, SwiperSlide } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { B as Breadcrumbs } from './breadcrumbs.c6638e27.mjs';
import { resolveComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { b as _export_sfc } from '../server.mjs';
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
        slidesPerView: 6,
        freeMode: true,
        breakpoints: {
          1199: {
            slidesPerView: 4
          },
          768: {
            slidesPerView: 4
          },
          420: {
            slidesPerView: 3
          },
          0: {
            slidesPerView: 2
          }
        }
      },
      items: [
        {
          imagepath: "/images/logos/1.png"
        },
        {
          imagepath: "/images/logos/2.png"
        },
        {
          imagepath: "/images/logos/3.png"
        },
        {
          imagepath: "/images/logos/4.png"
        },
        {
          imagepath: "/images/logos/5.png"
        },
        {
          imagepath: "/images/logos/6.png"
        },
        {
          imagepath: "/images/logos/7.png"
        },
        {
          imagepath: "/images/logos/8.png"
        }
      ]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Slider Element" }, null, _parent));
  _push(`<section class="section-b-space"><div class="container"><div class="row"><div class="col-md-12"><div class="slide-6 no-arrow">`);
  _push(ssrRenderComponent(_component_swiper, {
    slidesPerView: 6,
    breakpoints: $data.swiperOption.breakpoints
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
                _push3(`<div${_scopeId2}><div class="logo-block text-center"${_scopeId2}><a href="#"${_scopeId2}><img${ssrRenderAttr("src", item.imagepath)} alt${_scopeId2}></a></div></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    createVNode("div", { class: "logo-block text-center" }, [
                      createVNode("a", { href: "#" }, [
                        createVNode("img", {
                          src: item.imagepath,
                          alt: ""
                        }, null, 8, ["src"])
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
          (openBlock(true), createBlock(Fragment, null, renderList($data.items, (item, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("div", null, [
                  createVNode("div", { class: "logo-block text-center" }, [
                    createVNode("a", { href: "#" }, [
                      createVNode("img", {
                        src: item.imagepath,
                        alt: ""
                      }, null, 8, ["src"])
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
  _push(`</div></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/logo-slider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const logoSlider = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { logoSlider as default };
//# sourceMappingURL=logo-slider.831f500d.mjs.map