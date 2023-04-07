import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
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
    Breadcrumbs
  },
  data() {
    return {
      phoneimage: "/images/icon/phone.png",
      emailimage: "/images/icon/email.png",
      phone1: "+91 123 - 456 - 7890",
      phone2: "+86 163 - 451 - 7894",
      address: "ABC Complex,Near xyz, New York <br /> USA 123456",
      email1: "Support@Shopcart.com",
      email2: "info@shopcart.com",
      errors: [],
      fname: null,
      lname: null,
      email: null,
      phone: null,
      message: null
    };
  },
  methods: {
    checkForm: function(e) {
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
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Contact" }, null, _parent));
  _push(`<section class="contact-page section-b-space"><div class="container"><div class="row section-b-space"><div class="col-lg-7 map"><iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1605.811957341231!2d25.45976406005396!3d36.3940974010114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1550912388321" allowfullscreen></iframe></div><div class="col-lg-5"><div class="contact-right"><ul><li><div class="contact-icon"><img${ssrRenderAttr("src", $data.phoneimage)} alt="Generic placeholder image"><h6>Contact Us</h6></div><div class="media-body"><p>${ssrInterpolate($data.phone1)}</p><p>${ssrInterpolate($data.phone2)}</p></div></li><li><div class="contact-icon"><i class="fa fa-map-marker" aria-hidden="true"></i><h6>Address</h6></div><div class="media-body"><p>${$data.address}</p></div></li><li><div class="contact-icon"><img${ssrRenderAttr("src", $data.emailimage)} alt="Generic placeholder image"><h6>Email</h6></div><div class="media-body"><p>${ssrInterpolate($data.email1)}</p><p>${ssrInterpolate($data.email2)}</p></div></li><li><div class="contact-icon"><i class="fa fa-fax" aria-hidden="true"></i><h6>Fax</h6></div><div class="media-body"><p>${ssrInterpolate($data.email1)}</p><p>${ssrInterpolate($data.email2)}</p></div></li></ul></div></div></div><div class="row"><div class="col-12"><form class="theme-form" method="post">`);
  if ($data.errors.length) {
    _push(`<div><ul class="validation-error mb-3"><!--[-->`);
    ssrRenderList($data.errors, (error, index) => {
      _push(`<li>${ssrInterpolate(error)}</li>`);
    });
    _push(`<!--]--></ul></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="row"><div class="col-md-6"><label for="fname">First Name</label><input type="text" class="form-control" id="fname"${ssrRenderAttr("value", $data.fname)} placeholder="First Name" name="fname" required></div><div class="col-md-6"><label for="lname">Last Name</label><input type="text" class="form-control" id="lname"${ssrRenderAttr("value", $data.lname)} placeholder="Last Name" name="lname" required></div><div class="col-md-6"><label for="phone">Phone number</label><input type="tel" class="form-control" id="phone"${ssrRenderAttr("value", $data.phone)} placeholder="Enter your number" name="phone" required></div><div class="col-md-6"><label for="email">Email</label><input type="text" class="form-control" id="email"${ssrRenderAttr("value", $data.email)} placeholder="Email" name="email" required></div><div class="col-md-12"><label for="message">Write Your Message</label><textarea class="form-control" placeholder="Write Your Message" id="message" name="message" rows="6">${ssrInterpolate($data.message)}</textarea></div><div class="col-md-12"><input type="submit" class="btn btn-solid m-0" value="Send Your Message"></div></div></form></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  contact as default
};
//# sourceMappingURL=contact.85012910.js.map
