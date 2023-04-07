import { ssrRenderAttrs, ssrRenderAttr } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { b as _export_sfc } from "../server.mjs";
const _imports_0 = "" + globalThis.__publicAssetsURL("images/icon/logo.png");
const _imports_1 = "" + globalThis.__publicAssetsURL("images/icon/visa.png");
const _imports_2 = "" + globalThis.__publicAssetsURL("images/icon/mastercard.png");
const _imports_3 = "" + globalThis.__publicAssetsURL("images/icon/paypal.png");
const _imports_4 = "" + globalThis.__publicAssetsURL("images/icon/american-express.png");
const _imports_5 = "" + globalThis.__publicAssetsURL("images/icon/discover.png");
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><footer class="footer-light"><div class="light-layout"><div class="container"><section class="small-section border-section border-top-0"><div class="row"><div class="col-lg-6"><div class="subscribe"><div><h4>KNOW IT ALL FIRST!</h4><p>Never Miss Anything From Multikart By Signing Up To Our Newsletter.</p></div></div></div><div class="col-lg-6"><form class="form-inline subscribe-form auth-form needs-validation" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" target="_blank"><div class="form-group mx-sm-3"><input type="text" class="form-control" name="EMAIL" id="mce-EMAIL" placeholder="Enter your email" required="required"></div><button type="submit" class="btn btn-solid" id="mc-submit">subscribe</button></form></div></div></section></div></div><section class="section-b-space light-layout"><div class="container"><div class="row footer-theme partition-f"><div class="col-lg-4 col-md-6"><div class="footer-title footer-mobile-title"><h4>about</h4></div><div class="footer-contant"><div class="footer-logo"><img${ssrRenderAttr("src", _imports_0)} alt="logo"></div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p><div class="footer-social"><ul><li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-google-plus" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-instagram" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-rss" aria-hidden="true"></i></a></li></ul></div></div></div><div class="col offset-xl-1"><div class="sub-title"><div class="footer-title"><h4>my account</h4></div><div class="footer-contant"><ul><li><a href="#">mens</a></li><li><a href="#">womens</a></li><li><a href="#">clothing</a></li><li><a href="#">accessories</a></li><li><a href="#">featured</a></li></ul></div></div></div><div class="col"><div class="sub-title"><div class="footer-title"><h4>why we choose</h4></div><div class="footer-contant"><ul><li><a href="#">shipping &amp; return</a></li><li><a href="#">secure shopping</a></li><li><a href="#">gallary</a></li><li><a href="#">affiliates</a></li><li><a href="#">contacts</a></li></ul></div></div></div><div class="col"><div class="sub-title"><div class="footer-title"><h4>store information</h4></div><div class="footer-contant"><ul class="contact-list"><li><i class="fa fa-map-marker"></i>Multikart Demo Store, Demo store India 345-659 </li><li><i class="fa fa-phone"></i>Call Us: 123-456-7898 </li><li><i class="fa fa-envelope-o"></i>Email Us: <a href="#">Support@Fiot.com</a></li><li><i class="fa fa-fax"></i>Fax: 123456 </li></ul></div></div></div></div></div></section><div class="sub-footer"><div class="container"><div class="row"><div class="col-xl-6 col-md-6 col-sm-12"><div class="footer-end"><p><i class="fa fa-copyright" aria-hidden="true"></i> 2017-18 themeforest powered by pixelstrap </p></div></div><div class="col-xl-6 col-md-6 col-sm-12"><div class="payment-card-bottom"><ul><li><a href="#"><img${ssrRenderAttr("src", _imports_1)} alt></a></li><li><a href="#"><img${ssrRenderAttr("src", _imports_2)} alt></a></li><li><a href="#"><img${ssrRenderAttr("src", _imports_3)} alt></a></li><li><a href="#"><img${ssrRenderAttr("src", _imports_4)} alt></a></li><li><a href="#"><img${ssrRenderAttr("src", _imports_5)} alt></a></li></ul></div></div></div></div></div></footer></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/footer/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __nuxt_component_3 as _
};
//# sourceMappingURL=index.cdece796.js.map
