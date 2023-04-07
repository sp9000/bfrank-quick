import { Swiper, SwiperSlide } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
      itemsizes: [
        { title: "size 06" },
        { title: "size 07" },
        { title: "size 08" },
        { title: "size 09" },
        { title: "size 10" }
      ],
      swiperOption1: {
        slidesPerView: 4,
        freeMode: true,
        breakpoints: {
          1200: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          991: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          586: {
            slidesPerView: 1,
            spaceBetween: 20
          }
        }
      },
      itemsCat: [
        {
          imagepath: "/images/watch/cat1.png",
          title: "calculator watch",
          description: '<ul class="category-link"><li><a href="#">Watchmaking conglomerates</a></li><li><a href="#">Breitling SA</a></li><li><a href="#">Casio watches</a></li><li><a href="#">Citizen Watch</a></li></ul>',
          button: "view more"
        },
        {
          imagepath: "/images/watch/cat2.png",
          title: "Antimagnetic watch",
          description: '<ul class="category-link"><li><a href="#">Watchmaking conglomerates</a></li><li><a href="#">Breitling SA</a></li><li><a href="#">Casio watches</a></li><li><a href="#">Citizen Watch</a></li></ul>',
          button: "view more"
        },
        {
          imagepath: "/images/watch/cat3.png",
          title: "History of watches",
          description: '<ul class="category-link"><li><a href="#">Watchmaking conglomerates</a></li><li><a href="#">Breitling SA</a></li><li><a href="#">Casio watches</a></li><li><a href="#">Citizen Watch</a></li></ul>',
          button: "view more"
        },
        {
          imagepath: "/images/watch/cat4.png",
          title: "watch models",
          description: '<ul class="category-link"><li><a href="#">Watchmaking conglomerates</a></li><li><a href="#">Breitling SA</a></li><li><a href="#">Casio watches</a></li><li><a href="#">Citizen Watch</a></li></ul>',
          button: "view more"
        },
        {
          imagepath: "/images/watch/cat1.png",
          title: "women watch",
          description: '<ul class="category-link"><li><a href="#">Watchmaking conglomerates</a></li><li><a href="#">Breitling SA</a></li><li><a href="#">Casio watches</a></li><li><a href="#">Citizen Watch</a></li></ul>',
          button: "view more"
        }
      ],
      imagepath_1: "/images/cat1.jpg",
      title_1: "Tacker bag",
      subtitle_1: "on sale",
      offer_1: "save 30% off",
      imagepath_2: "/images/cat2.jpg",
      title_2: "Zipper storage bag",
      subtitle_2: "new products",
      offer_2: "-80% off",
      imagepath_3: "/images/cat3.jpg",
      title_3: "gate check bag",
      subtitle_3: "summer sale",
      offer_3: "minimum 50% off",
      category: [
        { title: "airbag" },
        { title: "burn bag" },
        { title: "briefcase" },
        { title: "carpet bag" },
        { title: "money bag" },
        { title: "tucker bag" }
      ],
      items: [
        {
          img: "/images/icon/cat1.png",
          title: "sport shoes"
        },
        {
          img: "/images/icon/cat2.png",
          title: "casual shoes"
        },
        {
          img: "/images/icon/cat3.png",
          title: "formal shoes"
        },
        {
          img: "/images/icon/cat4.png",
          title: "flat"
        },
        {
          img: "/images/icon/cat5.png",
          title: "heels"
        },
        {
          img: "/images/icon/cat6.png",
          title: "boots"
        },
        {
          img: "/images/icon/cat2.png",
          title: "casual shoes"
        },
        {
          img: "/images/icon/cat3.png",
          title: "casual shoes"
        }
      ],
      items2: [
        {
          imagepath: "/images/cat1.png",
          title: "men"
        },
        {
          imagepath: "/images/cat2.png",
          title: "women"
        },
        {
          imagepath: "/images/cat3.png",
          title: "kids"
        }
      ],
      swiperOption: {
        dots: false,
        loop: true,
        slideSpeed: 300,
        slidesPerView: 7,
        breakpoints: {
          1367: {
            slidesPerView: 5,
            loop: true
          },
          1024: {
            slidesPerView: 4,
            loop: true
          },
          767: {
            slidesPerView: 3,
            loop: true
          },
          480: {
            slidesPerView: 2
          }
        }
      }
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Category Element" }, null, _parent));
  _push(`<div class="container"><section class="section-b-space border-section border-top-0"><div class="row"><div class="col"><div class="slide-6 no-arrow">`);
  _push(ssrRenderComponent(_component_swiper, {
    breakpoints: $data.swiperOption.breakpoints,
    slidesPerView: 7,
    slideSpeed: 300,
    loop: "true",
    dots: "false",
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
                _push3(`<div class="category-block"${_scopeId2}><a href="#"${_scopeId2}><div class="category-image"${_scopeId2}><img${ssrRenderAttr("src", item.img)} alt${_scopeId2}></div></a><div class="category-details"${_scopeId2}><a href="#"${_scopeId2}><h5${_scopeId2}>${ssrInterpolate(item.title)}</h5></a></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "category-block" }, [
                    createVNode("a", { href: "#" }, [
                      createVNode("div", { class: "category-image" }, [
                        createVNode("img", {
                          src: item.img,
                          alt: ""
                        }, null, 8, ["src"])
                      ])
                    ]),
                    createVNode("div", { class: "category-details" }, [
                      createVNode("a", { href: "#" }, [
                        createVNode("h5", null, toDisplayString(item.title), 1)
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
                createVNode("div", { class: "category-block" }, [
                  createVNode("a", { href: "#" }, [
                    createVNode("div", { class: "category-image" }, [
                      createVNode("img", {
                        src: item.img,
                        alt: ""
                      }, null, 8, ["src"])
                    ])
                  ]),
                  createVNode("div", { class: "category-details" }, [
                    createVNode("a", { href: "#" }, [
                      createVNode("h5", null, toDisplayString(item.title), 1)
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
  _push(`</div></div></div></section></div><section class="p-0 ratio2_1"><div class="container-fluid"><div class="row category-border"><!--[-->`);
  ssrRenderList($data.items2, (item, index) => {
    _push(`<div class="col-sm-4 border-padding"><div class="category-banner"><div><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid bg-img" alt=""></div><div class="category-box"><a href="#"><h2>${ssrInterpolate(item.title)}</h2></a></div></div></div>`);
  });
  _push(`<!--]--></div></div></section><div class="container category-button"><section class="section-b-space border-section border-bottom-0"><div class="row partition1"><!--[-->`);
  ssrRenderList($data.category, (cat, index) => {
    _push(`<div class="col"><a href="#" class="btn btn-outline btn-block">${ssrInterpolate(cat.title)}</a></div>`);
  });
  _push(`<!--]--></div></section></div><div class="category-bg ratio_square"><div class="container-fluid p-0"><div class="row order-section"><div class="col-sm-4 p-0"><a href="#" class="image-block"><img alt${ssrRenderAttr("src", $data.imagepath_1)} class="img-fluid bg-img"></a></div><div class="col-sm-4 p-0"><div class="contain-block even"><div><h6>${ssrInterpolate($data.subtitle_1)}</h6><a href="#"><h2>${ssrInterpolate($data.title_1)}</h2></a><a href="#" class="btn btn-solid category-btn">${ssrInterpolate($data.offer_1)}</a><a href="#"><h6><span>shop now</span></h6></a></div></div></div><div class="col-sm-4 p-0"><a href="#" class="image-block"><img alt${ssrRenderAttr("src", $data.imagepath_2)} class="img-fluid bg-img"></a></div><div class="col-sm-4 p-0"><div class="contain-block"><div><h6>${ssrInterpolate($data.subtitle_2)}</h6><a href="#"><h2>${ssrInterpolate($data.title_2)}</h2></a><a href="#" class="btn btn-solid category-btn">${ssrInterpolate($data.offer_2)}</a><a href="#"><h6><span>shop now</span></h6></a></div></div></div><div class="col-sm-4 p-0"><a href="#" class="image-block even"><img alt${ssrRenderAttr("src", $data.imagepath_3)} class="img-fluid bg-img"></a></div><div class="col-sm-4 p-0"><div class="contain-block"><div><h6>${ssrInterpolate($data.subtitle_3)}</h6><a href="#"><h2>${ssrInterpolate($data.title_3)}</h2></a><a href="#" class="btn btn-solid category-btn">${ssrInterpolate($data.offer_3)}</a><a href="#"><h6><span>shop now</span></h6></a></div></div></div></div></div></div><section class="section-b-space ratio_portrait"><div class="container"><div class="row"><div class="col">`);
  _push(ssrRenderComponent(_component_swiper, {
    slidesPerView: 4,
    freeMode: "true",
    breakpoints: $data.swiperOption1.breakpoints,
    class: "swiper-wrapper category-m"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($data.itemsCat, (item, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: "swiper-slide",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="category-wrapper"${_scopeId2}><div${_scopeId2}><div${_scopeId2}><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid bg-img" alt${_scopeId2}></div><h4${_scopeId2}>${ssrInterpolate(item.title)}</h4><div${_scopeId2}>${item.description}</div><a href="#" class="btn btn-outline"${_scopeId2}>${ssrInterpolate(item.button)}</a></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "category-wrapper" }, [
                    createVNode("div", null, [
                      createVNode("div", null, [
                        createVNode("img", {
                          src: item.imagepath,
                          class: "img-fluid bg-img",
                          alt: ""
                        }, null, 8, ["src"])
                      ]),
                      createVNode("h4", null, toDisplayString(item.title), 1),
                      createVNode("div", {
                        innerHTML: item.description
                      }, null, 8, ["innerHTML"]),
                      createVNode("a", {
                        href: "#",
                        class: "btn btn-outline"
                      }, toDisplayString(item.button), 1)
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
          (openBlock(true), createBlock(Fragment, null, renderList($data.itemsCat, (item, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("div", { class: "category-wrapper" }, [
                  createVNode("div", null, [
                    createVNode("div", null, [
                      createVNode("img", {
                        src: item.imagepath,
                        class: "img-fluid bg-img",
                        alt: ""
                      }, null, 8, ["src"])
                    ]),
                    createVNode("h4", null, toDisplayString(item.title), 1),
                    createVNode("div", {
                      innerHTML: item.description
                    }, null, 8, ["innerHTML"]),
                    createVNode("a", {
                      href: "#",
                      class: "btn btn-outline"
                    }, toDisplayString(item.button), 1)
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
  _push(`</div></div></div></section><section class="p-0"><div class="container"><div class="row background"><!--[-->`);
  ssrRenderList($data.itemsizes, (item, index) => {
    _push(`<div class="col"><a href="#"><div class="contain-bg"><h4>${ssrInterpolate(item.title)}</h4></div></a></div>`);
  });
  _push(`<!--]--></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/category.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const category = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { category as default };
//# sourceMappingURL=category.f0430ee0.mjs.map
