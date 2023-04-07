import { m as mapState, e as useProductStore, f as useCartStore, u as useNuxtApp, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { withCtx, openBlock, createBlock, createVNode, toDisplayString, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';

const _sfc_main = {
  props: ["product", "index"],
  data() {
    return {
      symbol: "$",
      imageSrc: "",
      quickviewProduct: {},
      compareProduct: {},
      cartProduct: {},
      showquickview: false,
      showCompareModal: false,
      cartval: false,
      variants: {
        productId: "",
        image: ""
      },
      dismissSecs: 5,
      dismissCountDown: 0
    };
  },
  computed: {
    ...mapState(useProductStore, {
      productslist: "productslist"
    }),
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    addToCart: function(product) {
      this.cartval = true;
      this.cartProduct = product;
      this.$emit("opencartmodel", this.cartval, this.cartProduct);
      useCartStore().addToCart(product);
    },
    addToWishlist: function(product) {
      this.dismissCountDown = this.dismissSecs;
      useNuxtApp().$showToast({ msg: "Product Is successfully added to your wishlist.", type: "info" });
      useProductStore().addToWishlist(product);
    },
    showQuickview: function(productData) {
      this.showquickview = true;
      this.quickviewProduct = productData;
      this.$emit("openquickview", this.showquickview, this.quickviewProduct);
    },
    addToCompare: function(product) {
      this.showCompareModal = true;
      this.compareProduct = product;
      this.$emit("showCompareModal", this.showCompareModal, this.compareProduct);
      useProductStore().addToCompare(product);
    },
    Color(variants) {
      const uniqColor = [];
      for (let i = 0; i < Object.keys(variants).length; i++) {
        if (uniqColor.indexOf(variants[i].color) === -1) {
          uniqColor.push(variants[i].color);
        }
      }
      return uniqColor;
    },
    productColorchange(color, product) {
      product.variants.map((item) => {
        if (item.color === color) {
          product.images.map((img) => {
            if (img.image_id === item.image_id) {
              this.imageSrc = img.src;
            }
          });
        }
      });
    },
    productVariantChange(imgsrc) {
      this.imageSrc = imgsrc;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
      this.$emit("alertseconds", this.dismissCountDown);
    },
    discountedPrice(product) {
      const price = (product.price - product.price * product.discount / 100) * this.curr.curr;
      return price;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="img-wrapper"><div class="lable-block">`);
  if ($props.product.new) {
    _push(`<span class="lable3">new</span>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.product.sale) {
    _push(`<span class="lable4">on sale</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="front">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/sidebar/" + $props.product.id }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<img${ssrRenderAttr("src", $options.getImgUrl($data.imageSrc ? $data.imageSrc : $props.product.images[0].src))}${ssrRenderAttr("id", $props.product.id)} class="img-fluid bg-img media"${ssrRenderAttr("alt", $props.product.title)}${_scopeId}>`);
      } else {
        return [
          (openBlock(), createBlock("img", {
            src: $options.getImgUrl($data.imageSrc ? $data.imageSrc : $props.product.images[0].src),
            id: $props.product.id,
            class: "img-fluid bg-img media",
            alt: $props.product.title,
            key: $props.index
          }, null, 8, ["src", "id", "alt"]))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
  if ($props.product.images.length > 1) {
    _push(`<div class="back">`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/product/sidebar/" + $props.product.id }
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<img${ssrRenderAttr("src", $options.getImgUrl($data.imageSrc ? $data.imageSrc : $props.product.images[1].src))}${ssrRenderAttr("id", $props.product.id)} alt="" class="img-fluid m-auto media"${_scopeId}>`);
        } else {
          return [
            (openBlock(), createBlock("img", {
              src: $options.getImgUrl($data.imageSrc ? $data.imageSrc : $props.product.images[1].src),
              key: $props.index,
              id: $props.product.id,
              alt: "",
              class: "img-fluid m-auto media"
            }, null, 8, ["src", "id"]))
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<ul class="product-thumb-list"><!--[-->`);
  ssrRenderList($props.product.images, (image, index) => {
    _push(`<li class="${ssrRenderClass([{ active: $data.imageSrc === image.src }, "grid_thumb_img"])}"><a href="javascript:void(0);"><img${ssrRenderAttr("src", $options.getImgUrl(image.src))}></a></li>`);
  });
  _push(`<!--]--></ul><div class="cart-info cart-wrap"><button data-toggle="modal" data-target="#modal-cart" title="Add to cart" variant="primary"><i class="ti-shopping-cart"></i></button><a href="javascript:void(0)" title="Wishlist"><i class="ti-heart" aria-hidden="true"></i></a><a href="javascript:void(0)" title="Quick View" variant="primary"><i class="ti-search" aria-hidden="true"></i></a><a href="javascript:void(0)" title="Comapre" variant="primary"><i class="ti-reload" aria-hidden="true"></i></a></div></div><div class="product-detail"><div class="rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></div>`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/sidebar/" + $props.product.id }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h6${_scopeId}>${ssrInterpolate($props.product.title)}</h6>`);
      } else {
        return [
          createVNode("h6", null, toDisplayString($props.product.title), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<p>${ssrInterpolate($props.product.description)}</p>`);
  if ($props.product.sale) {
    _push(`<h4>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice($props.product))} <del>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(($props.product.price * $options.curr.curr).toFixed(2))}</del></h4>`);
  } else {
    _push(`<h4>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(($props.product.price * $options.curr.curr).toFixed(2))}</h4>`);
  }
  if ($props.product.variants[0].color) {
    _push(`<ul class="color-variant"><!--[-->`);
    ssrRenderList($options.Color($props.product.variants), (variant, variantIndex) => {
      _push(`<li><a class="${ssrRenderClass([variant])}" style="${ssrRenderStyle({ "background-color": variant })}"></a></li>`);
    });
    _push(`<!--]--></ul>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product-box/product-box1.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=product-box1.0b51d818.mjs.map
