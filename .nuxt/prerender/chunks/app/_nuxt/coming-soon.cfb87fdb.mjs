import { b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { withCtx, createVNode, createTextVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
  data() {
    return {
      logoimage: "/images/icon/logo.png",
      title: "Will be Opening Soon!",
      copyright: "\xA9 2018, Powered by Multikart."
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="template-password"><div class="container"><div id="container" class="text-center"><div><div id="login"><div><div class="logo mb-4">`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/shop/fashion" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${ssrRenderAttr("src", $data.logoimage)} alt="Multikart_fashion" class="img-fluid"${_scopeId}>`);
      } else {
        return [
          createVNode("img", {
            src: $data.logoimage,
            alt: "Multikart_fashion",
            class: "img-fluid"
          }, null, 8, ["src"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><h2 class="mb-3">${ssrInterpolate($data.title)}</h2></div><div class="row"><div class="col-12"><form action="#" class="theme-form"><div class="col-md-12 mt-2"><h3>Enter Your Email:</h3></div><div class="form-row"><div class="col-md-12"><input type="password" name="password" id="password" class="form-control" autofocus></div><div class="col-md-12"><div class="actions"><button type="submit" class="btn btn-solid">notify me</button></div></div></div></form></div></div><div id="footer" class="mt-4"><div id="owner"> Are you the store owner? `);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/page/account/login" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Log in here`);
      } else {
        return [
          createTextVNode("Log in here")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` or <a href="#">change your password settings</a></div></div></div><div id="powered"><p>${ssrInterpolate($data.copyright)}</p></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/coming-soon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const comingSoon = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { comingSoon as default };
//# sourceMappingURL=coming-soon.cfb87fdb.mjs.map
