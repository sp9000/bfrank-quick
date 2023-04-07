import { _ as __nuxt_component_0 } from "./lightBox.fe4361cf.js";
import { _ as __nuxt_component_3 } from "./index.a867be51.js";
import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { b as _export_sfc } from "../server.mjs";
import "./client-only.3da4daca.js";
import "vue-easy-lightbox";
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
    Breadcrumbs,
    lightBox: __nuxt_component_0
  },
  data() {
    return {
      galleryFilter: "all",
      visible: false,
      index: "",
      images: [
        {
          id: 1,
          title: "Slim Fit Cotton Shirt",
          alt: "established",
          filter: "fashion",
          thumb: "/images/portfolio/grid/1.jpg",
          src: "/images/portfolio/grid/1.jpg"
        },
        {
          id: 2,
          title: "trim dress",
          alt: "readable",
          filter: "shoes",
          thumb: "/images/portfolio/grid/2.jpg",
          src: "/images/portfolio/grid/2.jpg"
        },
        {
          id: 3,
          title: "trim dress",
          alt: "readable",
          filter: "shoes",
          thumb: "/images/portfolio/grid/3.jpg",
          src: "/images/portfolio/grid/3.jpg"
        },
        {
          id: 4,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          thumb: "/images/portfolio/grid/4.jpg",
          src: "/images/portfolio/grid/4.jpg"
        },
        {
          id: 5,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          thumb: "/images/portfolio/grid/5.jpg",
          src: "/images/portfolio/grid/5.jpg"
        },
        {
          id: 6,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          thumb: "/images/portfolio/grid/6.jpg",
          src: "/images/portfolio/grid/6.jpg"
        },
        {
          id: 7,
          title: "trim dress",
          alt: "readable",
          filter: "bags",
          thumb: "/images/portfolio/grid/7.jpg",
          src: "/images/portfolio/grid/7.jpg"
        },
        {
          id: 8,
          title: "trim dress",
          alt: "readable",
          filter: "watch",
          thumb: "/images/portfolio/grid/8.jpg",
          src: "/images/portfolio/grid/8.jpg"
        }
      ]
    };
  },
  computed: {
    filteredImages: function() {
      if (this.galleryFilter === "all") {
        return this.images;
      } else {
        return this.images.filter((data) => data.filter === this.galleryFilter);
      }
    }
  },
  methods: {
    isActive: function(menuItem) {
      return this.galleryFilter === menuItem;
    },
    updateFilter(filterName) {
      this.galleryFilter = filterName;
    },
    openGallery(index) {
      this.index = index;
      this.visible = true;
    },
    close() {
      this.visible = false;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_lightBox = __nuxt_component_0;
  const _component_Footer = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Portfolio gallery" }, null, _parent));
  _push(`<section class="portfolio-section grid-portfolio ratio2_3 portfolio-padding"><div class="container"><div align="center" id="form1"><button class="${ssrRenderClass([{ active: $options.isActive("all") }, "filter-button project_button"])}" data-filter="all">All</button><button class="${ssrRenderClass([{ active: $options.isActive("fashion") }, "filter-button project_button"])}" data-filter="fashion">Fashion</button><button class="${ssrRenderClass([{ active: $options.isActive("bags") }, "filter-button project_button"])}" data-filter="bags">Bags</button><button class="${ssrRenderClass([{ active: $options.isActive("shoes") }, "filter-button project_button"])}" data-filter="shoes">Shoes</button><button class="${ssrRenderClass([{ active: $options.isActive("watch") }, "filter-button project_button"])}" data-filter="watch">Watch</button></div><div class="row zoom-gallery"><!--[-->`);
  ssrRenderList($options.filteredImages, (item, index) => {
    _push(`<div class="isotopeSelector filter fashion col-lg-3 col-sm-6"><div class="overlay"><div class="border-portfolio"><a href="javascript:void(0)"><div class="overlay-background"><i class="fa fa-plus" aria-hidden="true"></i></div><img${ssrRenderAttr("src", item.src)} class="img-fluid"></a></div></div></div>`);
  });
  _push(`<!--]-->`);
  _push(ssrRenderComponent(_component_lightBox, {
    index: $data.index,
    visible: $data.visible,
    image: $options.filteredImages,
    onCloseView: $options.close
  }, null, _parent));
  _push(`</div></div></section>`);
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/portfolio/portfolio-4-col.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const portfolio4Col = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  portfolio4Col as default
};
//# sourceMappingURL=portfolio-4-col.6cab346b.js.map
