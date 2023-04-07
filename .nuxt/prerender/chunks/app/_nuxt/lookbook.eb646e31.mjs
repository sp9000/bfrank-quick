import { B as Breadcrumbs } from './breadcrumbs.c6638e27.mjs';
import { resolveComponent, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
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
    Breadcrumbs
  },
  data() {
    return {
      items: [
        {
          imagepath: "/images/lookbook.jpg",
          pro1image: "/images/pro3/2.jpg",
          pro1title: "Trim dress",
          pro1price: "$220.00",
          pro1link: "/home",
          pro2image: "/images/pro3/1.jpg",
          pro2title: "crop top",
          pro2price: "$695.00",
          pro2link: "/home"
        },
        {
          imagepath: "/images/lookbook2.jpg",
          pro1image: "/images/pro3/10.jpg",
          pro1title: "boho tops",
          pro1price: "$446.00",
          pro1link: "/home",
          pro2image: "/images/pro3/28.jpg",
          pro2title: "fitted dress",
          pro2price: "$235.00",
          pro2link: "/home"
        }
      ]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "lookbook" }, null, _parent));
  _push(`<section class="lookbook section-b-space ratio_square"><div class="container"><div class="row"><!--[-->`);
  ssrRenderList($data.items, (item, index) => {
    _push(`<div class="col-md-6"><div class="lookbook-block"><div><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid" alt></div><div class="lookbook-dot"><span>1</span><a href="#"><div class="dot-showbox"><img${ssrRenderAttr("src", item.pro1image)} class="img-fluid" alt><div class="dot-info"><h5 class="title">${ssrInterpolate(item.pro1title)}</h5><h5>${ssrInterpolate(item.pro1price)}</h5></div></div></a></div><div class="lookbook-dot dot2"><span>2</span><a href="#"><div class="dot-showbox"><img${ssrRenderAttr("src", item.pro2image)} class="img-fluid" alt><div class="dot-info"><h5 class="title">${ssrInterpolate(item.pro2title)}</h5><h5>${ssrInterpolate(item.pro2price)}</h5></div></div></a></div></div></div>`);
  });
  _push(`<!--]--></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/lookbook.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const lookbook = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { lookbook as default };
//# sourceMappingURL=lookbook.eb646e31.mjs.map
