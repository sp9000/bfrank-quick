import { _ as __nuxt_component_0 } from "./product-box1.6b64b525.js";
import { b as _export_sfc, e as useProductStore } from "../server.mjs";
import { c as cartModel } from "./cart-modal-popup.eaf7b920.js";
import { q as quickviewModel, c as compareModel } from "./compare-popup.71c679e4.js";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
const _sfc_main = {
  props: ["productTYpe", "productId"],
  components: {
    productBox1: __nuxt_component_0,
    quickviewModel,
    compareModel,
    cartModel
  },
  data() {
    return {
      title: "Related Products",
      products: [],
      showquickviewmodel: false,
      showcomparemodal: false,
      showcartmodal: false,
      quickviewproduct: {},
      comapreproduct: {},
      cartproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0
    };
  },
  computed: {
    productslist: () => useProductStore().productslist
  },
  methods: {
    productsArray: function() {
      this.productslist.map((item) => {
        if (item.type === this.productTYpe) {
          if (item.id !== this.productId) {
            this.products.push(item);
          }
        }
      });
    },
    alert(item) {
      this.dismissCountDown = item;
    },
    showQuickview(item, productData) {
      this.showquickviewmodel = item;
      this.quickviewproduct = productData;
    },
    showCoampre(item, productData) {
      this.showcomparemodal = item;
      this.comapreproduct = productData;
    },
    closeCompareModal(item) {
      this.showcomparemodal = item;
    },
    showCart(item, productData) {
      this.showcartmodal = item;
      this.cartproduct = productData;
    },
    closeCartModal(item) {
      this.showcartmodal = item;
    },
    closeViewModal(item) {
      this.showquickviewmodel = item;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_productBox1 = __nuxt_component_0;
  const _component_quickviewModel = resolveComponent("quickviewModel");
  const _component_compareModel = resolveComponent("compareModel");
  const _component_cartModel = resolveComponent("cartModel");
  _push(`<div${ssrRenderAttrs(_attrs)}><section class="ratio_asos section-b-space"><div class="container"><div class="col-12 product-related"><h2>${ssrInterpolate($data.title)}</h2></div><div class="row g-sm-4 g-3"><!--[-->`);
  ssrRenderList($options.productslist.slice(1, 7), (product, index) => {
    _push(`<div class="col-xl-2 col-md-4 col-6"><div class="product-box">`);
    _push(ssrRenderComponent(_component_productBox1, {
      onOpencartmodel: $options.showCart,
      onShowCompareModal: $options.showCoampre,
      onOpenquickview: $options.showQuickview,
      product,
      index
    }, null, _parent));
    _push(`</div></div>`);
  });
  _push(`<!--]--></div></div></section>`);
  _push(ssrRenderComponent(_component_quickviewModel, {
    openModal: $data.showquickviewmodel,
    productData: $data.quickviewproduct,
    onCloseView: $options.closeViewModal
  }, null, _parent));
  _push(ssrRenderComponent(_component_compareModel, {
    openCompare: $data.showcomparemodal,
    productData: $data.comapreproduct,
    onCloseCompare: $options.closeCompareModal
  }, null, _parent));
  _push(ssrRenderComponent(_component_cartModel, {
    openCart: $data.showcartmodal,
    productData: $data.cartproduct,
    onCloseCart: $options.closeCartModal,
    products: $data.products
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/related-products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const relatedProduct = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
const _imports_0 = "" + globalThis.__publicAssetsURL("images/size-chart.jpg");
export {
  _imports_0 as _,
  relatedProduct as r
};
//# sourceMappingURL=size-chart.0683afd0.js.map
