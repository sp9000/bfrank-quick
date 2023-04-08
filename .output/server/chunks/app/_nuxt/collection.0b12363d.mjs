import { B as Breadcrumbs } from './breadcrumbs.b2644590.mjs';
import { resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { b as _export_sfc } from '../server.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'ufo';
import 'h3';
import '@unhead/vue';
import '@unhead/dom';
import 'vue-router';
import '@intlify/core-base';
import 'cookie-es';
import 'is-https';
import 'defu';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-solid-svg-icons';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'ipx';

const _sfc_main = {
  components: {
    Breadcrumbs
  },
  data() {
    return {
      items: [
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(30 Products)",
          title: "Fashion",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        },
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(12 Products)",
          title: "kids",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        },
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(18 Products)",
          title: "Shoes",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        },
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(24 Products)",
          title: "Bags",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        },
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(24 Products)",
          title: "Watch",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        },
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(24 Products)",
          title: "Flower",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        },
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(12 Products)",
          title: "Beauty",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        },
        {
          imagepath: "/images/collection/1.jpg",
          procount: "(12 Products)",
          title: "Jewellery",
          desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy."
        }
      ]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "category" }, null, _parent));
  _push(`<section class="collection section-b-space pt-0 ratio_square"><div class="container"><div class="row partition-collection"><!--[-->`);
  ssrRenderList($data.items, (item, index) => {
    _push(`<div class="col-lg-3 col-md-6"><div class="collection-block"><div><img${ssrRenderAttr("src", item.imagepath)} class="img-fluid" alt="item.title"></div><div class="collection-content"><h4>${ssrInterpolate(item.procount)}</h4><h3>${ssrInterpolate(item.title)}</h3><p>${ssrInterpolate(item.desc)}</p><a href="javascript:void(0)" class="btn btn-outline">shop now !</a></div></div></div>`);
  });
  _push(`<!--]--></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/collection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const collection = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { collection as default };
//# sourceMappingURL=collection.0b12363d.mjs.map
