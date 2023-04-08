import { m as mapState, e as useProductStore, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';

const _imports_0 = "" + globalThis.__publicAssetsURL("images/payment_cart.png");
const _sfc_main = {
  props: ["openCart", "productData", "products", "category"],
  computed: {
    ...mapState(useProductStore, {
      currency: "currency"
    }),
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    closeCart(val) {
      val = false;
      this.$emit("closeCart", val);
    },
    cartRelatedProducts(collection, id) {
      return this.products.filter((item) => {
        if (item.collection.find((i) => i === collection)) {
          if (item.id !== id) {
            return item;
          }
        }
      });
    },
    discountedPrice(product) {
      const price = (product.price - product.price * product.discount / 100) * this.curr.curr;
      return price;
    }
  },
  watch: {
    openCart: {
      handler(newValue, oldValue) {
      },
      deep: true
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<!--[--><div></div><div>`);
  if ($props.openCart) {
    _push(`<div class="modal-backdrop fade show"></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.openCart) {
    _push(`<div class="modal fade show d-block bd-example-modal-lg theme-modal cart-modal" id="modal-cart" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="modal-cartLabel"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-body modal1"><div class="container-fluid p-0"><div class="row cart-modal"><div class="col-lg-12 position-relative"><div class="modal-bg addtocart"><button class="close btn-close" type="button"><span>x</span></button><div class="media"><a href="#"><img${ssrRenderAttr("src", $options.getImgUrl($props.productData.images[0].src))} class="img-fluid"${ssrRenderAttr("alt", $props.productData.images[0].alt)}></a><div class="media-body align-self-center text-center"><a href="#"><h6><i class="fa fa-check"></i>Item <span>${ssrInterpolate($props.productData.title)}</span><span> successfully added to your Cart.</span></h6></a><div class="buttons d-flex justify-content-center">`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/page/account/cart" },
      class: "btn-sm btn-solid mr-2"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`View Cart`);
        } else {
          return [
            createTextVNode("View Cart")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/page/account/checkout" },
      class: "btn-sm btn-solid mr-2"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Checkout`);
        } else {
          return [
            createTextVNode("Checkout")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/" },
      class: "btn-sm btn-solid"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Continue Shopping`);
        } else {
          return [
            createTextVNode("Continue Shopping")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div><div class="upsell_payment"><img alt="" class="img-fluid w-auto mt-3"${ssrRenderAttr("src", _imports_0)}></div></div></div><div class="product-section"><div class="col-12 product-upsell text-center"><h4>Customers who bought this item also.</h4></div><div class="row upsell_product"><!--[-->`);
    ssrRenderList($options.cartRelatedProducts($props.productData.collection[0], $props.productData.id).slice(0, 4), (product, index) => {
      _push(`<div class="product-box col-sm-3 col-6"><div class="img-wrapper"><div class="front">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: { path: "/product/sidebar/" + product.id }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", $options.getImgUrl(product.images[0].src))} class="img-fluid"${ssrRenderAttr("alt", product.title)}${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: $options.getImgUrl(product.images[0].src),
                class: "img-fluid",
                alt: product.title
              }, null, 8, ["src", "alt"])
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</div><div class="product-detail"><h6>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: { path: "/product/sidebar/" + product.id }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>${ssrInterpolate(product.title)}</span>`);
          } else {
            return [
              createVNode("span", null, toDisplayString(product.title), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</h6>`);
      if (product.sale) {
        _push(`<h4>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del>${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</del></h4>`);
      } else {
        _push(`<h4>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4>`);
      }
      _push(`</div></div></div>`);
    });
    _push(`<!--]--></div></div></div></div></div></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart-modal/cart-modal-popup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cartModel = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { cartModel as c };
//# sourceMappingURL=cart-modal-popup.76f2be01.mjs.map
