import { _ as __nuxt_component_0 } from './lightBox.fe4361cf.mjs';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { b as _export_sfc } from '../server.mjs';
import './client-only.3da4daca.mjs';
import 'file:///home/sp07/vue/templatian/node_modules/vue-easy-lightbox/dist/vue-easy-lightbox.esm.min.js';
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
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Portfolio gallery" }, null, _parent));
  _push(`<section class="portfolio-section grid-portfolio ratio2_3 portfolio-padding"><div class="container"><div align="center" id="form1"><button class="${ssrRenderClass([{ active: $options.isActive("all") }, "filter-button project_button"])}" data-filter="all">All</button><button class="${ssrRenderClass([{ active: $options.isActive("fashion") }, "filter-button project_button"])}" data-filter="fashion">Fashion</button><button class="${ssrRenderClass([{ active: $options.isActive("bags") }, "filter-button project_button"])}" data-filter="bags">Bags</button><button class="${ssrRenderClass([{ active: $options.isActive("shoes") }, "filter-button project_button"])}" data-filter="shoes">Shoes</button><button class="${ssrRenderClass([{ active: $options.isActive("watch") }, "filter-button project_button"])}" data-filter="watch">Watch</button></div><div class="row zoom-gallery"><!--[-->`);
  ssrRenderList($options.filteredImages, (item, index) => {
    _push(`<div class="isotopeSelector filter fashion col-lg-4 col-sm-6"><div class="overlay"><div class="border-portfolio"><a href="javascript:void(0)"><div class="overlay-background"><i class="fa fa-plus" aria-hidden="true"></i></div><img${ssrRenderAttr("src", item.src)} class="img-fluid"></a></div></div></div>`);
  });
  _push(`<!--]-->`);
  _push(ssrRenderComponent(_component_lightBox, {
    index: $data.index,
    visible: $data.visible,
    image: $options.filteredImages,
    onCloseView: $options.close
  }, null, _parent));
  _push(`</div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/portfolio/portfolio-3-col.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const portfolio3Col = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { portfolio3Col as default };
//# sourceMappingURL=portfolio-3-col.a5f7ddf1.mjs.map
