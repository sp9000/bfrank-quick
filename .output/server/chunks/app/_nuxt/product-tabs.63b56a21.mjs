import { _ as __nuxt_component_0 } from './product-box1.3f71f10e.mjs';
import { m as mapState, e as useProductStore, b as _export_sfc } from '../server.mjs';
import { B as Breadcrumbs } from './breadcrumbs.b2644590.mjs';
import { q as quickviewModel, c as compareModel } from './compare-popup.58d95736.mjs';
import { c as cartModel } from './cart-modal-popup.76f2be01.mjs';
import { resolveComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'ufo';
import 'h3';
import '@unhead/vue';
import '@unhead/dom';
import 'vue-router';
import '@intlify/core-base';
import 'cookie-es';
import 'is-https';
import 'defu';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-solid-svg-icons';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'ipx';
import 'swiper/vue';

const _sfc_main = {
  components: {
    Breadcrumbs,
    productBox1: __nuxt_component_0,
    quickviewModel,
    compareModel,
    cartModel
  },
  data() {
    return {
      products: [],
      category: [],
      title: "top collection",
      subtitle: "special offer",
      showquickviewmodel: false,
      showcomparemodal: false,
      showcartmodal: false,
      quickviewproduct: {},
      comapreproduct: {},
      cartproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s."
    };
  },
  computed: {
    ...mapState(useProductStore, {
      productslist: "productslist"
    })
  },
  mounted() {
    this.productsArray();
  },
  methods: {
    productsArray: function() {
      this.productslist.map((item) => {
        if (item.type === "fashion") {
          this.products.push(item);
          item.collection.map((i) => {
            const index = this.category.indexOf(i);
            if (index === -1)
              this.category.push(i);
          });
        }
      });
    },
    getCategoryProduct(collection) {
      return this.products.filter((item) => {
        if (item.collection.find((i) => i === collection)) {
          return item;
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
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_productBox1 = __nuxt_component_0;
  const _component_quickviewModel = resolveComponent("quickviewModel");
  const _component_compareModel = resolveComponent("compareModel");
  const _component_cartModel = resolveComponent("cartModel");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Slider Element" }, null, _parent));
  _push(`<div class="title1 section-t-space"><h4>${ssrInterpolate($data.subtitle)}</h4><h2 class="title-inner1">${ssrInterpolate($data.title)}</h2></div><section class="section-b-space pt-0 ratio_asos"><div class="container"><div class="row"><div class="col"><div class="theme-tab"><div class="tabs"><div class><ul class="nav nav-tabs" id="top-tab" role="tablist"><li class="nav-items"><a class="nav-link" href="#new" data-bs-toggle="tab"> NEW PRODUCT</a></li><li class="nav-items"><a class="nav-link" href="#best" data-bs-toggle="tab"> BEST SELLERS</a></li><li class="nav-items"><a class="nav-link" href="#feature" data-bs-toggle="tab"> FEATURED PRODUCT</a></li><li class="nav-items"><a class="nav-link" href="#sale" data-bs-toggle="tab"> ON SALE</a></li></ul></div><div class="tab-content" id="top-tabContent"><div id="new" class="tab-pane fade active show"><div class="no-slider"><div class="row g-sm-4 g-3"><!--[-->`);
  ssrRenderList($options.getCategoryProduct($data.category[0]), (product, index) => {
    _push(`<div class="col-xxl-3 col-md-4 col-6"><div class="product-box">`);
    _push(ssrRenderComponent(_component_productBox1, {
      onOpencartmodel: $options.showCart,
      onShowCompareModal: $options.showCoampre,
      onOpenquickview: $options.showQuickview,
      onShowalert: $options.alert,
      onAlertseconds: $options.alert,
      product,
      index
    }, null, _parent));
    _push(`</div></div>`);
  });
  _push(`<!--]--></div></div></div><div id="best" class="tab-pane fade"><div class="no-slider"><div class="row g-sm-4 g-3"><!--[-->`);
  ssrRenderList($options.getCategoryProduct($data.category[1]), (product, index) => {
    _push(`<div class="col-xxl-3 col-md-4 col-6"><div class="product-box">`);
    _push(ssrRenderComponent(_component_productBox1, {
      onOpencartmodel: $options.showCart,
      onShowCompareModal: $options.showCoampre,
      onOpenquickview: $options.showQuickview,
      onShowalert: $options.alert,
      onAlertseconds: $options.alert,
      product,
      index
    }, null, _parent));
    _push(`</div></div>`);
  });
  _push(`<!--]--></div></div></div><div id="feature" class="tab-pane fade"><div class="no-slider"><div class="row g-sm-4 g-3"><!--[-->`);
  ssrRenderList($options.getCategoryProduct($data.category[2]), (product, index) => {
    _push(`<div class="col-xxl-3 col-md-4 col-6"><div class="product-box">`);
    _push(ssrRenderComponent(_component_productBox1, {
      onOpencartmodel: $options.showCart,
      onShowCompareModal: $options.showCoampre,
      onOpenquickview: $options.showQuickview,
      onShowalert: $options.alert,
      onAlertseconds: $options.alert,
      product,
      index
    }, null, _parent));
    _push(`</div></div>`);
  });
  _push(`<!--]--></div></div></div><div id="sale" class="tab-pane fade"><div class="no-slider"><div class="row g-sm-4 g-3"><!--[-->`);
  ssrRenderList($options.getCategoryProduct($data.category[3]), (product, index) => {
    _push(`<div class="col-xxl-3 col-md-4 col-6"><div class="product-box">`);
    _push(ssrRenderComponent(_component_productBox1, {
      onOpencartmodel: $options.showCart,
      onShowCompareModal: $options.showCoampre,
      onOpenquickview: $options.showQuickview,
      onShowalert: $options.alert,
      onAlertseconds: $options.alert,
      product,
      index
    }, null, _parent));
    _push(`</div></div>`);
  });
  _push(`<!--]--></div></div></div></div></div></div></div></div></div></section>`);
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
    products: _ctx.productslist
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/product-tabs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const productTabs = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { productTabs as default };
//# sourceMappingURL=product-tabs.63b56a21.mjs.map
