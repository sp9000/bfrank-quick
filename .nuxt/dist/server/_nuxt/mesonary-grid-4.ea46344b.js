import { _ as __nuxt_component_3 } from "./index.a867be51.js";
import MasonryWall from "@yeger/vue-masonry-wall";
import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { resolveComponent, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { b as _export_sfc } from "../server.mjs";
import "./discover.5287eaca.js";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "destr";
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
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "mesonary 4 grid" }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/portfolio/mesonary-grid-4.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const mesonaryGrid4 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  mesonaryGrid4 as default
};
//# sourceMappingURL=mesonary-grid-4.ea46344b.js.map
