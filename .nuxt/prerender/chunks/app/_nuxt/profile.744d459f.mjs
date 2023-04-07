import { B as Breadcrumbs } from './breadcrumbs.eec6192c.mjs';
import { resolveComponent, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
      title1: "personal detail",
      title2: "shipping address",
      errors: [],
      fname: null,
      lname: null,
      email: null,
      phone: null,
      message: null
    };
  },
  methods: {
    checkForm1: function(e) {
      this.errors = [];
      if (!this.fname) {
        this.errors.push("First name required.");
      }
      if (!this.lname) {
        this.errors.push("Last name required.");
      }
      if (!this.email) {
        this.errors.push("Email required.");
      } else if (!this.validEmail(this.email)) {
        this.errors.push("Valid email required.");
      }
      if (!this.phone) {
        this.errors.push("Phone Number required.");
      }
      if (!this.message) {
        this.errors.push("Message required.");
      }
      if (!this.errors.length)
        return true;
      e.preventDefault();
    },
    validEmail: function(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Profile" }, null, _parent));
  _push(`<section class="contact-page register-page"><div class="container"><div class="row"><div class="col-12"><h3>${ssrInterpolate($data.title1)}</h3><form class="theme-form" method="post">`);
  if ($data.errors.length) {
    _push(`<div><ul class="validation-error mb-3"><!--[-->`);
    ssrRenderList($data.errors, (error, index) => {
      _push(`<li>${ssrInterpolate(error)}</li>`);
    });
    _push(`<!--]--></ul></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="row"><div class="col-md-6"><label for="fname">First Name</label><input type="text" class="form-control" id="fname"${ssrRenderAttr("value", $data.fname)} placeholder="First Name" name="fname" required></div><div class="col-md-6"><label for="lname">Last Name</label><input type="text" class="form-control" id="lname"${ssrRenderAttr("value", $data.lname)} placeholder="Last Name" name="lname" required></div><div class="col-md-6"><label for="phone">Phone number</label><input type="tel" class="form-control" id="phone"${ssrRenderAttr("value", $data.phone)} placeholder="Enter your number" name="phone" required></div><div class="col-md-6"><label for="email">Email</label><input type="text" class="form-control" id="email"${ssrRenderAttr("value", $data.email)} placeholder="Email" name="email" required></div><div class="col-md-12"><label for="message">Write Your Message</label><textarea class="form-control" placeholder="Write Your Message" id="message" name="message" rows="6">${ssrInterpolate($data.message)}</textarea></div><div class="col-md-12"><input type="submit" class="btn btn-solid" value="Save"></div></div></form></div></div></div></section><section class="contact-page register-page section-b-space"><div class="container"><div class="row"><div class="col-12"><h3>${ssrInterpolate($data.title2)}</h3><form class="theme-form" method="post"><div class="row"><div class="col-md-6"><label for="name">flat / plot</label><input type="text" class="form-control" id="home-ploat" placeholder="company name" required></div><div class="col-md-6"><label for="name">Address *</label><input type="text" class="form-control" id="address-two" placeholder="Address" required></div><div class="col-md-6"><label for="email">Zip Code *</label><input type="text" class="form-control" id="zip-code" placeholder="zip-code" required></div><div class="col-md-6 select_input"><label for="review">Country *</label><select class="form-control" size="1"><option value="India">India</option><option value="UAE">UAE</option><option value="U.K">U.K</option><option value="US">US</option></select></div><div class="col-md-6"><label for="review">City *</label><input type="text" class="form-control" id="city" placeholder="City" required></div><div class="col-md-6"><label for="review">Region/State *</label><input type="text" class="form-control" id="region-state" placeholder="Region/state" required></div><div class="col-md-12"><button class="btn btn-sm btn-solid" type="submit">Save setting</button></div></div></form></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const profile = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { profile as default };
//# sourceMappingURL=profile.744d459f.mjs.map
