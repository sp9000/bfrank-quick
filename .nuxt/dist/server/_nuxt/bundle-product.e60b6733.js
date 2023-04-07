import { b as _export_sfc, m as mapState, e as useProductStore, f as useCartStore, c as __nuxt_component_0 } from "../server.mjs";
import { Swiper, SwiperSlide } from "swiper/vue";
/* empty css                     */import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { T as Timer } from "./timer.97b92290.js";
import { r as relatedProduct, _ as _imports_0$1 } from "./size-chart.0683afd0.js";
import { resolveComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from "vue/server-renderer";
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
import "./product-box1.6b64b525.js";
import "./cart-modal-popup.eaf7b920.js";
import "./compare-popup.71c679e4.js";
const _imports_0 = "" + globalThis.__publicAssetsURL("images/fashion/pro/1.jpg");
const _sfc_main = {
  components: {
    Breadcrumbs,
    Timer,
    relatedProduct,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      slideId: 0,
      counter: 1,
      activeColor: "",
      selectedSize: "",
      qty: "",
      size: [],
      productTYpe: "",
      productId: ""
    };
  },
  computed: {
    ...mapState(useProductStore, {
      currency: "currency"
    }),
    curr() {
      return useProductStore().changeCurrency;
    },
    getDetail: function() {
      return useProductStore().getProductById(1);
    }
  },
  mounted() {
    this.uniqColor = this.getDetail.variants[0].color;
    this.sizeVariant(this.getDetail.variants[0].image_id);
    this.activeColor = this.uniqColor;
    this.changeSizeVariant(this.getDetail.variants[0].size);
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    priceCurrency: function() {
      useProductStore().changeCurrency();
    },
    addToWishlist: function(product) {
      useProductStore().addToWishlist(product);
    },
    discountedPrice(product) {
      const price = (product.price - product.price * product.discount / 100) * this.curr.curr;
      return price;
    },
    Color(variants) {
      const uniqColor = [];
      for (let i = 0; i < Object.keys(variants).length; i++) {
        if (uniqColor.indexOf(variants[i].color) === -1) {
          uniqColor.push(variants[i].color);
        }
      }
      this.stock();
      return uniqColor;
    },
    addToCart: function(product, qty) {
      product.quantity = qty || 1;
      useCartStore().addToCart(product);
    },
    buyNow: function(product, qty) {
      product.quantity = qty || 1;
      useCartStore().addToCart(product);
      this.$router.push("/page/account/checkout");
    },
    increment() {
      this.counter++;
    },
    decrement() {
      if (this.counter > 1)
        this.counter--;
    },
    changeSizeVariant(variant) {
      this.selectedSize = variant;
      this.stock();
    },
    getImgUrl(path) {
      return "/images/" + path;
    },
    slideTo(id) {
      this.swiper.slideTo(id);
      this.slideId = id;
    },
    sizeVariant(id, slideId, color) {
      this.swiper.slideTo(slideId);
      this.size = [];
      this.activeColor = color;
      this.getDetail.variants.filter((item) => {
        if (id === item.image_id) {
          this.size.push(item.size);
        }
      });
    },
    stock() {
      this.getDetail.variants.filter((item) => {
        if (this.activeColor === item.color && this.selectedSize === item.size) {
          this.qty = item.qty;
        }
      });
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_nuxt_link = __nuxt_component_0;
  const _component_Timer = resolveComponent("Timer");
  const _component_relatedProduct = resolveComponent("relatedProduct");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, {
    title: $options.getDetail.title
  }, null, _parent));
  _push(`<section><div class="collection-wrapper productdetail"><div class="container"><div class="row"><div class="col-lg-6">`);
  _push(ssrRenderComponent(_component_swiper, {
    onSwiper: $options.onSwiper,
    slidesPerView: 1,
    spaceBetween: 20,
    class: "swiper-wrapper product-swiper h-auto"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($options.getDetail.images, (product, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: "swiper-slide",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<img${ssrRenderAttr("src", $options.getImgUrl(product.src))}${ssrRenderAttr("id", product.image_id)} class="img-fluid bg-img"${ssrRenderAttr("alt", product.alt)}${_scopeId2}>`);
              } else {
                return [
                  createVNode("img", {
                    src: $options.getImgUrl(product.src),
                    id: product.image_id,
                    class: "img-fluid bg-img",
                    alt: product.alt
                  }, null, 8, ["src", "id", "alt"])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($options.getDetail.images, (product, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("img", {
                  src: $options.getImgUrl(product.src),
                  id: product.image_id,
                  class: "img-fluid bg-img",
                  alt: product.alt
                }, null, 8, ["src", "id", "alt"])
              ]),
              _: 2
            }, 1024);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="row"><div class="col-12 slider-nav-images">`);
  _push(ssrRenderComponent(_component_swiper, {
    slidesPerView: 3,
    spaceBetween: 20,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($options.getDetail.images, (product, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: ["swiper-slide", $data.slideId == index ? "product-slider-active" : ""],
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<img${ssrRenderAttr("src", $options.getImgUrl(product.src))}${ssrRenderAttr("id", product.image_id)} class="img-fluid bg-img" alt="product.alt"${_scopeId2}>`);
              } else {
                return [
                  createVNode("img", {
                    src: $options.getImgUrl(product.src),
                    id: product.image_id,
                    class: "img-fluid bg-img",
                    alt: "product.alt",
                    onClick: ($event) => $options.slideTo(index)
                  }, null, 8, ["src", "id", "onClick"])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($options.getDetail.images, (product, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: ["swiper-slide", $data.slideId == index ? "product-slider-active" : ""],
              key: index
            }, {
              default: withCtx(() => [
                createVNode("img", {
                  src: $options.getImgUrl(product.src),
                  id: product.image_id,
                  class: "img-fluid bg-img",
                  alt: "product.alt",
                  onClick: ($event) => $options.slideTo(index)
                }, null, 8, ["src", "id", "onClick"])
              ]),
              _: 2
            }, 1032, ["class"]);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div><div class="col-lg-6 rtl-text"><div class="product-right"><h2>${ssrInterpolate($options.getDetail.title)}</h2>`);
  if ($options.getDetail.sale) {
    _push(`<h4><del>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(($options.getDetail.price * $options.curr.curr).toFixed(2))}</del><span>${ssrInterpolate($options.getDetail.discount)}% off</span></h4>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.getDetail.sale) {
    _push(`<h3>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice($options.getDetail))}</h3>`);
  } else {
    _push(`<h3>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(($options.getDetail.price * $options.curr.curr).toFixed(2))}</h3>`);
  }
  _push(`<ul class="color-variant"><!--[-->`);
  ssrRenderList($options.Color($options.getDetail.variants), (variant, variantIndex) => {
    _push(`<li class="${ssrRenderClass({ active: $data.activeColor == variant })}"><a class="${ssrRenderClass([variant])}" style="${ssrRenderStyle({ "background-color": variant })}"></a></li>`);
  });
  _push(`<!--]--></ul>`);
  if ($options.getDetail.stock < 8) {
    _push(`<div class="pro_inventory"><p class="active"> Hurry! We have only ${ssrInterpolate($options.getDetail.stock)} product in stock. </p><div class="inventory-scroll"><span style="${ssrRenderStyle({ "width": "57%" })}"></span></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="product-description border-product"><h6 class="product-title size-text"> select size <span><a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#modal-1">size chart</a></span></h6><div class="size-box"><ul><!--[-->`);
  ssrRenderList($data.size, (size, index) => {
    _push(`<li class="${ssrRenderClass([{ active: $data.selectedSize == size }, "product-title"])}"><a href="javascript:void(0)">${ssrInterpolate(size)}</a></li>`);
  });
  _push(`<!--]--></ul></div>`);
  if ($data.counter <= $options.getDetail.stock) {
    _push(`<h5 class="avalibility"><span>In Stock</span></h5>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.counter > $options.getDetail.stock) {
    _push(`<h5 class="avalibility"><span>Out of Stock</span></h5>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<h6 class="product-title">quantity</h6><div class="qty-box"><div class="input-group"><span class="input-group-prepend"><button type="button" class="btn quantity-left-minus" data-type="minus" data-field><i class="ti-angle-left"></i></button></span><input type="text" name="quantity" class="form-control input-number"${ssrIncludeBooleanAttr($data.counter > $options.getDetail.stock) ? " disabled" : ""}${ssrRenderAttr("value", $data.counter)}><span class="input-group-prepend"><button type="button" class="btn quantity-right-plus" data-type="plus" data-field><i class="ti-angle-right"></i></button></span></div></div></div><div class="product-buttons">`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/page/account/cart" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<button class="btn btn-solid" title="Add to cart"${ssrIncludeBooleanAttr($data.counter > $options.getDetail.stock) ? " disabled" : ""}${_scopeId}>Add To Cart</button>`);
      } else {
        return [
          createVNode("button", {
            class: "btn btn-solid",
            title: "Add to cart",
            onClick: ($event) => $options.addToCart($options.getDetail, $data.counter),
            disabled: $data.counter > $options.getDetail.stock
          }, "Add To Cart", 8, ["onClick", "disabled"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<button class="btn btn-solid ms-1" title="buy now"${ssrIncludeBooleanAttr($data.counter > $options.getDetail.stock) ? " disabled" : ""}>Buy Now</button></div><div class="border-product"><h6 class="product-title">product details</h6><p>${ssrInterpolate($options.getDetail.description.substring(0, 200) + "....")}</p></div><div class="border-product"><h6 class="product-title">share it</h6><div class="product-icon"><ul class="product-social"><li><a href="#"><i class="fa fa-facebook"></i></a></li><li><a href="#"><i class="fa fa-google-plus"></i></a></li><li><a href="#"><i class="fa fa-twitter"></i></a></li><li><a href="#"><i class="fa fa-instagram"></i></a></li><li><a href="#"><i class="fa fa-rss"></i></a></li></ul><form class="d-inline-block"><button class="wishlist-btn"><i class="fa fa-heart"></i><span class="title-font">Add To WishList</span></button></form></div></div><div class="border-product"><h6 class="product-title">Time Reminder</h6>`);
  _push(ssrRenderComponent(_component_Timer, { date: "April 15, 2024" }, null, _parent));
  _push(`</div><div class="border-product"><h6 class="product-title">Frequently bought together</h6><div class="bundle"><div class="bundle_img"><div class="img-box"><a href="#"><img${ssrRenderAttr("src", _imports_0)} alt="Bundle Product" class="img-fluid"></a></div><span class="plus">+</span><div class="img-box"><a href="#"><img${ssrRenderAttr("src", _imports_0)} alt="Bundle Product" class="img-fluid"></a></div><span class="plus">+</span><div class="img-box"><a href="#"><img${ssrRenderAttr("src", _imports_0)} alt="Bundle Product" class="img-fluid"></a></div></div><div class="bundle_detail"><div class="theme_checkbox"><label>this product: WOMEN PINK SHIRT <span class="price_product">$55</span><input type="checkbox" checked="checked"><span class="checkmark"></span></label><label>black long skirt <span class="price_product">$20</span><input type="checkbox" checked="checked"><span class="checkmark"></span></label><label>women heeled boots <span class="price_product">$15</span><input type="checkbox" checked="checked"><span class="checkmark"></span></label><a href="#" class="btn btn-solid btn-xs">buy this bundle</a></div></div></div></div></div></div></div></div></div></section><section class="tab-product m-0"><div class="container"><div class="row"><div class="col-sm-12 col-lg-12"><ul class="nav nav-tabs nav-material" id="top-tab" role="tablist"><li class="nav-item"><a class="nav-link active" id="top-home-tab" data-bs-toggle="tab" href="#top-home" role="tab" aria-selected="true"><i class="icofont icofont-ui-home"></i>Details</a><div class="material-border"></div></li><li class="nav-item"><a class="nav-link" id="profile-top-tab" data-bs-toggle="tab" href="#top-profile" role="tab" aria-selected="false"><i class="icofont icofont-man-in-glasses"></i>Specification</a><div class="material-border"></div></li><li class="nav-item"><a class="nav-link" id="contact-top-tab" data-bs-toggle="tab" href="#top-contact" role="tab" aria-selected="false"><i class="icofont icofont-contacts"></i>Video</a><div class="material-border"></div></li><li class="nav-item"><a class="nav-link" id="review-top-tab" data-bs-toggle="tab" href="#top-review" role="tab" aria-selected="false"><i class="icofont icofont-contacts"></i>Write Review</a><div class="material-border"></div></li></ul><div class="tab-content tab-material" id="top-tabContent"><div class="tab-pane fade show active" id="top-home" role="tabpanel" aria-labelledby="top-home-tab"><div class="product-tab-discription"><div class="part"><p>The Model is wearing a white blouse from our stylist&#39;s collection, see the image for a mock-up of what the actual blouse would look like.it has text written on it in a black cursive language which looks great on a white color.</p></div><div class="part"><h5 class="inner-title">fabric:</h5><p>Art silk is manufactured by synthetic fibres like rayon. It&#39;s light in weight and is soft on the skin for comfort in summers.Art silk is manufactured by synthetic fibres like rayon. It&#39;s light in weight and is soft on the skin for comfort in summers.</p></div><div class="part"><h5 class="inner-title">size &amp; fit:</h5><p>The model (height 5&#39;8&quot;) is wearing a size S</p></div><div class="part"><h5 class="inner-title">Material &amp; Care:</h5><p>Top fabric: pure cotton</p><p>Bottom fabric: pure cotton</p><p>Hand-wash</p></div></div></div><div class="tab-pane fade" id="top-profile" role="tabpanel" aria-labelledby="profile-top-tab"><p>The Model is wearing a white blouse from our stylist&#39;s collection, see the image for a mock-up of what the actual blouse would look like.it has text written on it in a black cursive language which looks great on a white color.</p><div class="single-product-tables"><table><tbody><tr><td>Sleeve Length</td><td>Sleevless</td></tr><tr><td>Neck</td><td>Round Neck</td></tr><tr><td>Occasion</td><td>Sports</td></tr></tbody></table><table><tbody><tr><td>Fabric</td><td>Polyester</td></tr><tr><td>Fit</td><td>Regular Fit</td></tr></tbody></table></div></div><div class="tab-pane fade" id="top-contact" role="tabpanel" aria-labelledby="contact-top-tab"><div class=""><iframe width="560" height="315" src="https://www.youtube.com/embed/BUWzX78Ye_8" allow="autoplay; encrypted-media" allowfullscreen></iframe></div></div><div class="tab-pane fade" id="top-review" role="tabpanel" aria-labelledby="review-top-tab"><form class="theme-form"><div class="form-row row"><div class="col-md-12"><div class="media mt-0"><label>Rating</label><div class="media-body ms-3"><div class="rating three-star"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></div></div></div></div><div class="col-md-6"><label for="name">Name</label><input type="text" class="form-control" id="name" placeholder="Enter Your name" required></div><div class="col-md-6"><label for="email">Email</label><input type="text" class="form-control" id="email" placeholder="Email" required></div><div class="col-md-12"><label for="review">Review Title</label><input type="text" class="form-control" id="review" placeholder="Enter your Review Subjects" required></div><div class="col-md-12"><label for="review">Review Title</label><textarea class="form-control" placeholder="Wrire Your Testimonial Here" id="exampleFormControlTextarea1" rows="6"></textarea></div><div class="col-md-12"><button class="btn btn-solid" type="submit">Submit YOur Review</button></div></div></form></div></div></div></div></div></section>`);
  _push(ssrRenderComponent(_component_relatedProduct, {
    productTYpe: $data.productTYpe,
    productId: $data.productId
  }, null, _parent));
  _push(`<div class="modal fade bd-example-modal-lg theme-modal" id="modal-1" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="modal-cartLabel"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal1"><div class="modal-body p-0"><div class="bg-white position-relative"><div class="modal-header position-relative"><h5 class="m-0">${ssrInterpolate($options.getDetail.title)}</h5><button class="close btn-close background-none" type="button" data-bs-dismiss="modal"><span>\xD7</span></button></div><div class="p-3"><img${ssrRenderAttr("src", _imports_0$1)} alt="size-chart" class="img-fluid"></div></div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product/bundle-product.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const bundleProduct = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  bundleProduct as default
};
//# sourceMappingURL=bundle-product.e60b6733.js.map
