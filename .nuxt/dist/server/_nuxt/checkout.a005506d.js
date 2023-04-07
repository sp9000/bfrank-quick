import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { b as _export_sfc, f as useCartStore, e as useProductStore, u as useNuxtApp, c as __nuxt_component_0 } from "../server.mjs";
import { mergeProps, withCtx, createTextVNode, useSSRContext, resolveComponent } from "vue";
import { u as useCookie } from "./cookie.6763568a.js";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderClass } from "vue/server-renderer";
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
import "ohash";
const _sfc_main$1 = {
  computed: {
    cart() {
      return useCartStore().cartItems;
    },
    cartTotal() {
      return useCartStore().cartTotalAmount;
    },
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  data() {
    return {
      items: [{
        stripePriceId: "1",
        quantity: 5
      }],
      selectedPayment: "paypal",
      errors: [],
      user: {
        firstName: { value: "", errormsg: "" },
        lastName: { value: "", errormsg: "" },
        phone: { value: "", errormsg: "" },
        email: { value: "", errormsg: "" },
        address: { value: "", errormsg: "" },
        city: { value: "", errormsg: "" },
        state: { value: "", errormsg: "" },
        pincode: { value: "", errormsg: "" }
      },
      isLogin: false,
      paypal: {
        sandbox: "Your_Sendbox_Key"
      },
      payment: false,
      environment: "sandbox",
      button_style: {
        label: "checkout",
        size: "medium",
        shape: "pill",
        color: "blue"
      },
      amtchar: ""
    };
  },
  mounted() {
    window.paypal.Buttons({}).render("#paypal-button-container");
    this.isLogin = useCookie("userlogin").value;
    if (!this.isLogin) {
      this.$router.replace("/page/account/login");
    } else if (this.isLogin && this.cart.length == 0) {
      useNuxtApp().$showToast({ msg: "Cart is Empty.", type: "error" });
      this.$router.replace("/page/account/cart");
    }
  },
  methods: {
    payWithStripe() {
      this.onSubmit();
      this.isLogin = useCookie("userlogin").value;
      if (!this.isLogin) {
        this.$router.replace("/page/account/login");
      } else if (this.user.firstName.errormsg != "" && this.user.lastName.errormsg != "" && this.user.city.errormsg != "" && this.user.pincode.errormsg != "" && this.user.state.errormsg != "" && this.user.phone.errormsg != "" && this.user.address.errormsg != "" && this.user.email.errormsg != "") {
        this.onSubmit();
      } else if (this.isLogin) {
        this.payment = false;
        var handler = window.StripeCheckout.configure({
          key: "PUBLISHBLE_KEY",
          locale: "auto",
          closed: function() {
            handler.close();
          },
          token: (token) => {
            this.$store.dispatch("products/createOrder", {
              product: this.cart,
              userDetail: this.user,
              token: token.id,
              amt: this.cartTotal
            });
            this.$router.push("/page/order-success");
          }
        });
        handler.open({
          name: "Multikart ",
          description: "Your Choice Theme",
          amount: this.cartTotal * 100
        });
      }
    },
    onSubmit() {
      if (this.user.firstName.value.length <= 1 || this.user.firstName.value.length > 10) {
        this.user.firstName.errormsg = "empty not allowed";
      } else {
        this.user.firstName.errormsg = "";
      }
      if (this.user.lastName.value.length <= 1 || this.user.lastName.value.length > 10) {
        this.user.lastName.errormsg = "empty not allowed";
      } else {
        this.user.lastName.errormsg = "";
      }
      if (this.user.city.value.length < 3 || this.user.city.value.length > 10) {
        this.user.city.errormsg = "empty not allowed";
      } else {
        this.user.city.errormsg = "";
      }
      if (this.user.pincode.value.length < 4) {
        this.user.pincode.errormsg = "empty not  allowed";
      } else {
        this.user.pincode.errormsg = "";
      }
      if (!this.user.state.value) {
        this.user.state.errormsg = "empty not allowed";
      } else {
        this.user.state.errormsg = "";
      }
      if (!this.user.phone.value) {
        this.user.phone.errormsg = "empty not allowed";
      } else {
        this.user.phone.errormsg = "";
      }
      if (!this.user.address.value) {
        this.user.address.errormsg = "empty not allowed";
      } else {
        this.user.address.errormsg = "";
      }
      if (!this.user.email.value) {
        this.user.email.errormsg = "empty not allowed";
      } else if (!this.validEmail(this.user.email.value)) {
        this.user.email.errormsg = "Valid email required.";
      } else {
        this.user.email.errormsg = "";
      }
    },
    validEmail: function(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  },
  watch: {
    cart: {
      handler(value) {
        if (value.length == 0) {
          useNuxtApp().$showToast({ msg: "Cart is Empty.", type: "error" });
          this.$router.replace("/page/account/cart");
        }
      },
      deep: true
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "section-b-space" }, _attrs))}><div class="container"><div class="checkout-page"><div class="checkout-form"><form><div class="row"><div class="col-lg-6 col-sm-12"><div class="checkout-title"><h3>Billing Details</h3></div><div class="row check-out"><div class="form-group col-md-6 col-sm-6"><div class="field-label">First Name</div><input type="text"${ssrRenderAttr("value", $data.user.firstName.value)} name="First name">`);
  if ($data.user.firstName.value.length === 0) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.firstName.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-md-6 col-sm-6"><div class="field-label">Last Name</div><input type="text"${ssrRenderAttr("value", $data.user.lastName.value)} name="Last name">`);
  if ($data.user.lastName.value.length === 0) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.lastName.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-md-6 col-sm-6"><div class="field-label">Phone</div><input type="tel"${ssrRenderAttr("value", $data.user.phone.value)} name="Phone">`);
  if ($data.user.phone.value.length === 0) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.phone.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-md-6 col-sm-6"><div class="field-label">Email Address</div><input type="email"${ssrRenderAttr("value", $data.user.email.value)} name="Email Address">`);
  if (!$data.user.email.value || !$options.validEmail($data.user.email.value)) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.email.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-md-12 col-sm-12"><div class="field-label">Country</div><select required><option>India</option><option selected>South Africa</option><option>United State</option><option>Australia</option></select></div><div class="form-group col-md-12 col-sm-12"><div class="field-label">Address</div><input type="text"${ssrRenderAttr("value", $data.user.address.value)} name="Address">`);
  if ($data.user.address.value.length === 0) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.address.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-md-12 col-sm-12"><div class="field-label">Town/City</div><input type="text"${ssrRenderAttr("value", $data.user.city.value)} name="City">`);
  if ($data.user.city.value.length === 0) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.city.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-md-12 col-sm-6"><div class="field-label">State / County</div><input type="text"${ssrRenderAttr("value", $data.user.state.value)} name="State">`);
  if ($data.user.state.value.length === 0) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.state.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-md-12 col-sm-6"><div class="field-label">Postal Code</div><input type="text"${ssrRenderAttr("value", $data.user.pincode.value)} name="Postal Code">`);
  if ($data.user.pincode.value.length === 0) {
    _push(`<span class="validate-error">${ssrInterpolate($data.user.pincode.errormsg)}</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="form-group col-lg-12 col-md-12 col-sm-12">`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/page/account/register" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Create an Account?`);
      } else {
        return [
          createTextVNode("Create an Account?")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div><div class="col-lg-6 col-sm-12"><div class="checkout-details"><div class="order-box"><div class="title-box"><div> Product <span>Total</span></div></div>`);
  if ($options.cart.length) {
    _push(`<ul class="qty"><!--[-->`);
    ssrRenderList($options.cart, (item, index) => {
      _push(`<li>${ssrInterpolate(item.title || _ctx.uppercase)} X ${ssrInterpolate(item.quantity)} <span>${ssrInterpolate(item.price * $options.curr.curr * item.quantity)}</span></li>`);
    });
    _push(`<!--]--></ul>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<ul class="sub-total"><li> Subtotal <span class="count">${ssrInterpolate($options.cartTotal * $options.curr.curr)}</span></li><li>Shipping <div class="shipping"><div class="shopping-option"><input type="checkbox" name="free-shipping" id="free-shipping"><label for="free-shipping">Free Shipping</label></div><div class="shopping-option"><input type="checkbox" name="local-pickup" id="local-pickup"><label for="local-pickup">Local Pickup</label></div></div></li></ul><ul class="sub-total"><li> Total <span class="count">${ssrInterpolate($options.cartTotal * $options.curr.curr)}</span></li></ul></div><div class="payment-box"><div class="upper-box"><div class="payment-options"><ul><li><label class="d-block" for="edo-ani1"><input class="radio_animated" id="edo-ani1" value="stripe"${ssrIncludeBooleanAttr(ssrLooseEqual($data.selectedPayment, "stripe")) ? " checked" : ""} type="radio" name="rdo-ani" data-original-title="">Stripe </label></li><li><label class="d-block" for="edo-ani2"><input class="radio_anima ted" id="edo-ani2" value="paypal"${ssrIncludeBooleanAttr(ssrLooseEqual($data.selectedPayment, "paypal")) ? " checked" : ""} type="radio" name="rdo-ani" data-original-title="" title="">PayPal </label></li></ul></div></div><div class="text-end"><div id="paypal-button-container" class="${ssrRenderClass([{ "d-none": $data.selectedPayment != "paypal" }])}"></div>`);
  if ($data.selectedPayment === "stripe" && $options.cart.length) {
    _push(`<div class="order-place"><button class="btn btn-primary">Place Order </button></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div></div></div></form></div></div></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/paymentPage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const paymenPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  components: {
    Breadcrumbs,
    paymenPage
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_paymenPage = resolveComponent("paymenPage");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Checkout" }, null, _parent));
  _push(ssrRenderComponent(_component_paymenPage, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/account/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const checkout = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  checkout as default
};
//# sourceMappingURL=checkout.a005506d.js.map
