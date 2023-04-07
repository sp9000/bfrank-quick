import { _ as __nuxt_component_3 } from './index.a867be51.mjs';
import MasonryWall from 'file:///home/sp07/vue/templatian/node_modules/@yeger/vue-masonry-wall/dist/index.mjs';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, withCtx, createVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { b as _export_sfc } from '../server.mjs';
import './discover.5287eaca.mjs';
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
    MasonryWall,
    Breadcrumbs
  },
  data() {
    return {
      galleryFilter: "all",
      imagearray: [
        {
          id: 1,
          title: "Slim Fit Cotton Shirt",
          alt: "established",
          filter: "fashion",
          imagepath: "/images/portfolio/metro/1.jpg"
        },
        {
          id: 2,
          title: "trim dress",
          alt: "readable",
          filter: "shoes",
          imagepath: "/images/portfolio/metro/2.jpg"
        },
        {
          id: 3,
          title: "trim dress",
          alt: "readable",
          filter: "shoes",
          imagepath: "/images/portfolio/metro/3.jpg"
        },
        {
          id: 4,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          imagepath: "/images/portfolio/metro/4.jpg"
        },
        {
          id: 5,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          imagepath: "/images/portfolio/metro/5.jpg"
        },
        {
          id: 6,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          imagepath: "/images/portfolio/metro/6.jpg"
        },
        {
          id: 7,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          imagepath: "/images/portfolio/metro/7.jpg"
        },
        {
          id: 8,
          title: "trim dress",
          alt: "readable",
          filter: "watch",
          imagepath: "/images/portfolio/metro/8.jpg"
        }
      ]
    };
  },
  computed: {
    filteredImages: function() {
      if (this.galleryFilter === "all") {
        return this.imagearray;
      } else {
        return this.imagearray.filter(
          (data) => data.filter === this.galleryFilter
        );
      }
    }
  },
  methods: {
    isActive: function(menuItem) {
      return this.galleryFilter === menuItem;
    },
    updateFilter(filterName) {
      this.galleryFilter = filterName;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_no_ssr = resolveComponent("no-ssr");
  const _component_MasonryWall = resolveComponent("MasonryWall");
  const _component_Footer = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Mesonary 3 grid" }, null, _parent));
  _push(`<section class="filter-section"><div class="container"><div class="row"><div class="col-12"><div class="title1"><h2 class="title-inner1">portfolio</h2></div><div class="filter-container isotopeFilters"><ul class="list-inline filter"><li class="${ssrRenderClass({ active: $options.isActive("all") })}"><a href="javascript:void(0)">All</a></li><li class="${ssrRenderClass({ active: $options.isActive("fashion") })}"><a href="javascript:void(0)">Fashion</a></li><li class="${ssrRenderClass({ active: $options.isActive("bags") })}"><a href="javascript:void(0)">Bags</a></li><li class="${ssrRenderClass({ active: $options.isActive("shoes") })}"><a href="javascript:void(0)">Shoes</a></li><li class="${ssrRenderClass({ active: $options.isActive("watch") })}"><a href="javascript:void(0)">Watch</a></li></ul></div></div></div></div></section><section class="portfolio-section portfolio-padding pt-0 port-col zoom-gallery"><div class="container">`);
  _push(ssrRenderComponent(_component_no_ssr, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="masonry-container isotopeContainer"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_MasonryWall, {
          items: $options.filteredImages,
          "ssr-columns": 1,
          padding: 16,
          "column-width": 300,
          gap: 15
        }, {
          default: withCtx(({ item }, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="col m-0 isotopeSelector item"${_scopeId2}><div class="overlay"${_scopeId2}><div class="border-portfolio"${_scopeId2}><a href="javascript:void(0)"${_scopeId2}><div class="overlay-background"${_scopeId2}></div><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid"${_scopeId2}></a></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "col m-0 isotopeSelector item" }, [
                  createVNode("div", { class: "overlay" }, [
                    createVNode("div", { class: "border-portfolio" }, [
                      createVNode("a", { href: "javascript:void(0)" }, [
                        createVNode("div", { class: "overlay-background" }),
                        createVNode("img", {
                          src: item.imagepath,
                          class: "img-fluid"
                        }, null, 8, ["src"])
                      ])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "masonry-container isotopeContainer" }, [
            createVNode(_component_MasonryWall, {
              items: $options.filteredImages,
              "ssr-columns": 1,
              padding: 16,
              "column-width": 300,
              gap: 15
            }, {
              default: withCtx(({ item }) => [
                createVNode("div", { class: "col m-0 isotopeSelector item" }, [
                  createVNode("div", { class: "overlay" }, [
                    createVNode("div", { class: "border-portfolio" }, [
                      createVNode("a", { href: "javascript:void(0)" }, [
                        createVNode("div", { class: "overlay-background" }),
                        createVNode("img", {
                          src: item.imagepath,
                          class: "img-fluid"
                        }, null, 8, ["src"])
                      ])
                    ])
                  ])
                ])
              ]),
              _: 1
            }, 8, ["items"])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></section>`);
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/portfolio/mesonary-grid-3.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const mesonaryGrid3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { mesonaryGrid3 as default };
//# sourceMappingURL=mesonary-grid-3.2d368bfd.mjs.map
