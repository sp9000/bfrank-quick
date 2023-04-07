import { b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, withCtx, createVNode, toDisplayString, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
          imagepath: "/images/sub-banner1.jpg",
          title: "men",
          subtitle: "save 30%"
        },
        {
          imagepath: "/images/sub-banner2.jpg",
          title: "women",
          subtitle: "save 60%"
        }
      ],
      items2: [
        {
          imagepath: "/images/electronics/5.jpg",
          title: "speaker",
          subtitle: "30% off"
        },
        {
          imagepath: "/images/electronics/6.jpg",
          title: "earplug",
          subtitle: "save 60%"
        },
        {
          imagepath: "/images/electronics/7.jpg",
          title: "best deal",
          subtitle: "save 55%"
        }
      ]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Collection Element" }, null, _parent));
  _push(`<section class="pb-0 ratio2_1"><div class="container"><div class="row partition2"><!--[-->`);
  ssrRenderList($data.items, (item, index) => {
    _push(`<div class="col-md-6">`);
    _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/collection/left-sidebar/all" } }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<div class="collection-banner p-right text-center"${_scopeId}><div class="img-part"${_scopeId}><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid" alt${_scopeId}></div><div class="contain-banner"${_scopeId}><div${_scopeId}><h4${_scopeId}>${ssrInterpolate(item.subtitle)}</h4><h2${_scopeId}>${ssrInterpolate(item.title)}</h2></div></div></div>`);
        } else {
          return [
            createVNode("div", { class: "collection-banner p-right text-center" }, [
              createVNode("div", { class: "img-part" }, [
                createVNode("img", {
                  src: item.imagepath,
                  class: "img-fluid",
                  alt: ""
                }, null, 8, ["src"])
              ]),
              createVNode("div", { class: "contain-banner" }, [
                createVNode("div", null, [
                  createVNode("h4", null, toDisplayString(item.subtitle), 1),
                  createVNode("h2", null, toDisplayString(item.title), 1)
                ])
              ])
            ])
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</div>`);
  });
  _push(`<!--]--></div></div></section><section class="banner-goggles ratio2_3"><div class="container"><div class="row g-sm-4 g-2 partition3"><!--[-->`);
  ssrRenderList($data.items2, (item, index) => {
    _push(`<div class="col-md-4"><a href="#"><div class="collection-banner p-right text-center"><div class="img-part"><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid" alt></div><div class="contain-banner banner-3"><div><h4>${ssrInterpolate(item.subtitle)}</h4><h2>${ssrInterpolate(item.title)}</h2></div></div></div></a></div>`);
  });
  _push(`<!--]--></div></div></section><section class="section-b-space"><div class="container"><div class="row"><div class="col"><div class="card"><h5 class="card-header">Classes</h5><div class="card-body"><h5>Add class with collection-banner</h5><h5>contain-align - .text-left, .text-center, .text-end</h5><h5>contain-position - .p-left, .p-center, .p-right</h5></div></div></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/collection-banner.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const collectionBanner = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { collectionBanner as default };
//# sourceMappingURL=collection-banner.2ba123bd.mjs.map
