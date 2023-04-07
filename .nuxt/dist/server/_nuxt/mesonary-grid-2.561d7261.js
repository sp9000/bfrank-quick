import MasonryWall from "@yeger/vue-masonry-wall";
import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { resolveComponent, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { b as _export_sfc } from "../server.mjs";
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
  const _component_MasonryWall = resolveComponent("MasonryWall");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Mesonary 2 grid" }, null, _parent));
  _push(`<section class="filter-section"><div class="container"><div class="row"><div class="col-12"><div class="title1"><h2 class="title-inner1">portfolio</h2></div><div class="filter-container isotopeFilters"><ul class="list-inline filter"><li class="${ssrRenderClass({ active: $options.isActive("all") })}"><a href="javascript:void(0)">All</a></li><li class="${ssrRenderClass({ active: $options.isActive("fashion") })}"><a href="javascript:void(0)">Fashion</a></li><li class="${ssrRenderClass({ active: $options.isActive("bags") })}"><a href="javascript:void(0)">Bags</a></li><li class="${ssrRenderClass({ active: $options.isActive("shoes") })}"><a href="javascript:void(0)">Shoes</a></li><li class="${ssrRenderClass({ active: $options.isActive("watch") })}"><a href="javascript:void(0)">Watch</a></li></ul></div></div></div></div></section><section class="portfolio-section portfolio-padding pt-0 port-col zoom-gallery"><div class="container"><div class="masonry-container isotopeContainer">`);
  _push(ssrRenderComponent(_component_MasonryWall, {
    items: $options.filteredImages,
    "ssr-columns": 1,
    padding: 16,
    "column-width": 300,
    gap: 15
  }, {
    default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="col m-0 isotopeSelector item"${_scopeId}><div class="overlay"${_scopeId}><div class="border-portfolio"${_scopeId}><a href="javascript:void(0)"${_scopeId}><div class="overlay-background"${_scopeId}></div><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid"${_scopeId}></a></div></div></div>`);
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
  }, _parent));
  _push(`</div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/portfolio/mesonary-grid-2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const mesonaryGrid2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  mesonaryGrid2 as default
};
//# sourceMappingURL=mesonary-grid-2.561d7261.js.map
