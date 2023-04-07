import { _ as __nuxt_component_0 } from './product-box1.0b51d818.mjs';
import { m as mapState, e as useProductStore, b as _export_sfc } from '../server.mjs';
import { B as Breadcrumbs } from './breadcrumbs.c6638e27.mjs';
import { q as quickviewModel, c as compareModel } from './compare-popup.2ccec425.mjs';
import { c as cartModel } from './cart-modal-popup.584757b0.mjs';
import { resolveComponent, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
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
import 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';

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
//# sourceMappingURL=product-tabs.a72be20f.mjs.map
