import { B as Breadcrumbs } from "./breadcrumbs.c6638e27.js";
import { T as Timer } from "./timer.ad2b71ed.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
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
    Breadcrumbs,
    Countdown: Timer
  },
  data() {
    return {
      imagepath: "/images/parallax/1.jpg",
      title: "2019",
      subtitle: "fashion trends",
      text: "special offer",
      imagepath2: "/images/offer-banner.jpg",
      offer_text: "Save <span>30% off</span> Digital Watch"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_countdown = resolveComponent("countdown");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Banner Element" }, null, _parent));
  _push(`<section class="pt-0"><div class="full-banner parallax text-center p-left" style="${ssrRenderStyle({ "background-image": `url(${$data.imagepath})` })}"><img${ssrRenderAttr("src", $data.imagepath)} alt class="bg-img d-none"><div class="container"><div class="row"><div class="col"><div class="banner-contain"><h2>${ssrInterpolate($data.title)}</h2><h3>${ssrInterpolate($data.subtitle)}</h3><h4>${ssrInterpolate($data.text)}</h4></div></div></div></div></div></section><section class="section-b-space"><div class="container"><div class="row banner-timer" style="${ssrRenderStyle({ "background-image": "url(" + $data.imagepath2 + ")" })}"><div class="col-md-6"><div class="banner-text"><h2>${$data.offer_text}</h2></div></div><div class="col-md-6"><div class="timer-box">`);
  _push(ssrRenderComponent(_component_countdown, { date: "April 15, 2024" }, null, _parent));
  _push(`</div></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/banner.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const banner = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  banner as default
};
//# sourceMappingURL=banner.e5c66c9a.js.map
