import { b as _export_sfc, e as useProductStore, c as __nuxt_component_0$1 } from "../server.mjs";
import { _ as __nuxt_component_0 } from "./product-box1.6b64b525.js";
import { u as useFilterStore } from "./filter.dd288d63.js";
import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { s as sidebar } from "./collection-sidebar.267e6da6.js";
import { q as quickviewModel, c as compareModel } from "./compare-popup.71c679e4.js";
import { c as cartModel } from "./cart-modal-popup.eaf7b920.js";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { _ as _imports_0 } from "./2.25ea6962.js";
import { _ as _imports_1, a as _imports_2, b as _imports_3, c as _imports_4 } from "./6.eeb7c80f.js";
import { _ as _imports_5 } from "./empty-search.1c1cc13c.js";
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
import "swiper/vue";
/* empty css                     *//* empty css                         */import "swiper";
const _sfc_main = {
  components: {
    Breadcrumbs,
    productBox1: __nuxt_component_0,
    sidebar,
    quickviewModel,
    compareModel,
    cartModel
  },
  data() {
    return {
      bannerimagepath: "/images/side-banner.png",
      col2: false,
      col3: false,
      col4: true,
      col6: false,
      listview: false,
      priceArray: [],
      allfilters: [],
      items: [],
      current: 1,
      paginate: 12,
      paginateRange: 3,
      pages: [],
      paginates: "",
      showquickviewmodel: false,
      showcomparemodal: false,
      showcartmodal: false,
      quickviewproduct: {},
      comapreproduct: {},
      cartproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0,
      sidebarPopup: false
    };
  },
  computed: {
    filterProduct() {
      return useFilterStore().filterProducts;
    },
    tags() {
      return useFilterStore().setTags;
    },
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  mounted() {
    this.updatePaginate(1);
  },
  methods: {
    sidebar_popup() {
      this.sidebarPopup = !this.sidebarPopup;
    },
    onChangeSort(event) {
      useFilterStore().sortProducts(event.target.value);
    },
    gridView() {
      this.col4 = true;
      this.col2 = false;
      this.col3 = false;
      this.col6 = false;
      this.listview = false;
    },
    listView() {
      this.listview = true;
      this.col4 = false;
      this.col2 = false;
      this.col3 = false;
      this.col6 = false;
    },
    grid2() {
      this.col2 = true;
      this.col3 = false;
      this.col4 = false;
      this.col6 = false;
      this.listview = false;
    },
    grid3() {
      this.col3 = true;
      this.col2 = false;
      this.col4 = false;
      this.col6 = false;
      this.listview = false;
    },
    grid4() {
      this.col4 = true;
      this.col2 = false;
      this.col3 = false;
      this.col6 = false;
      this.listview = false;
    },
    grid6() {
      this.col6 = true;
      this.col2 = false;
      this.col3 = false;
      this.col4 = false;
      this.listview = false;
    },
    removeTags(val) {
      this.allfilters.splice(this.allfilters.indexOf(val), 1);
    },
    removeAllTags() {
      this.allfilters.splice(0, this.allfilters.length);
    },
    getCategoryFilter() {
      this.updatePaginate(1);
      useFilterStore().getCategoryFilter(this.$route.params.id);
    },
    allfilter(selectedVal) {
      this.allfilters = selectedVal;
      useFilterStore().setTags(selectedVal);
      this.getPaginate();
      this.updatePaginate(1);
    },
    pricefilterArray(item) {
      this.getCategoryFilter();
      useFilterStore().priceFilter(item);
      this.getPaginate();
      this.updatePaginate(1);
    },
    getPaginate() {
      this.paginates = Math.round(this.filterProduct.length / this.paginate);
      this.pages = [];
      for (let i = 0; i < this.paginates; i++) {
        this.pages.push(i + 1);
      }
    },
    setPaginate(i) {
      if (this.current === 1) {
        return i < this.paginate;
      } else {
        return i >= this.paginate * (this.current - 1) && i < this.current * this.paginate;
      }
    },
    updatePaginate(i) {
      this.current = i;
      let start = 0;
      let end = 0;
      if (this.current < this.paginateRange - 1) {
        start = 1;
        end = start + this.paginateRange - 1;
      } else {
        start = this.current - 1;
        end = this.current + 1;
      }
      if (start < 1) {
        start = 1;
      }
      if (end > this.paginates) {
        end = this.paginates;
      }
      this.pages = [];
      for (let i2 = start; i2 <= end; i2++) {
        this.pages.push(i2);
      }
      return this.pages;
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
  const _component_sidebar = resolveComponent("sidebar");
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_productBox1 = __nuxt_component_0;
  const _component_quickviewModel = resolveComponent("quickviewModel");
  const _component_compareModel = resolveComponent("compareModel");
  const _component_cartModel = resolveComponent("cartModel");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "collection" }, null, _parent));
  _push(`<section class="section-b-space ratio_asos"><div class="collection-wrapper"><div class="container"><div class="row"><div class="collection-content col"><div class="page-main-content"><div class="row"><div class="col-12"><div class="top-banner-wrapper"><a href="#"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid" alt></a><div class="top-banner-content small-section"><h4>fashion</h4><h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></div></div><ul class="product-filter-tags"><!--[-->`);
  ssrRenderList($data.allfilters, (tag, index) => {
    _push(`<li class="me-1"><a href="javascript:void(0)" class="filter_tag">${ssrInterpolate(tag)}<i class="ti-close"></i></a></li>`);
  });
  _push(`<!--]-->`);
  if ($data.allfilters.length > 0) {
    _push(`<li class="clear_filter"><a href="javascript:void(0)" class="clear_filter">Clear all</a></li>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</ul><div class="collection-product-wrapper"><div class="product-top-filter"><div class="row"><div class="col-12"><div class="popup-filter"><div class="sidebar-popup"><a class="popup-btn">filter products</a></div><div class="${ssrRenderClass([{ open: $data.sidebarPopup }, "open-popup"])}"><div class="collection-filter">`);
  _push(ssrRenderComponent(_component_sidebar, {
    onAllFilters: $options.allfilter,
    onPriceVal: $options.pricefilterArray,
    onCategoryfilter: $options.getCategoryFilter
  }, null, _parent));
  _push(`</div></div><div class="collection-view"><ul><li><i class="fa fa-th grid-layout-view"></i></li><li><i class="fa fa-list-ul list-layout-view"></i></li></ul></div><div class="collection-grid-view"><ul><li><img${ssrRenderAttr("src", _imports_1)} class="product-2-layout-view"></li><li><img${ssrRenderAttr("src", _imports_2)} class="product-3-layout-view"></li><li><img${ssrRenderAttr("src", _imports_3)} class="product-4-layout-view"></li><li><img${ssrRenderAttr("src", _imports_4)} class="product-6-layout-view"></li></ul></div><div class="product-page-filter"><select><option value="all">Sorting Items</option><option value="a-z">Alphabetically, A-Z</option><option value="z-a">Alphabetically, Z-A</option><option value="low">price, low to high</option><option value="high">price, high to low</option></select></div></div></div></div></div><div class="product-wrapper-grid"><div class="row"><div class="col-12">`);
  if ($options.filterProduct.length == 0) {
    _push(`<div class="text-center section-t-space section-b-space"><img${ssrRenderAttr("src", _imports_5)} class="img-fluid" alt><h3 class="mt-3">Sorry! Couldn&#39;t find the product you were looking For!!!</h3><div class="col-12 mt-3">`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/" },
      class: "btn btn-solid"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`continue shopping`);
        } else {
          return [
            createTextVNode("continue shopping")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><!--[-->`);
  ssrRenderList($options.filterProduct, (product, index) => {
    _push(`<div class="${ssrRenderClass([{ "col-xl-3 col-md-4 col-6": $data.col4 == true, "col-md-4 col-6": $data.col3 == true, "col-6": $data.col2 == true, "col-xxl-2 col-xl-3 col-md-4 col-6": $data.col6 == true, "col-12": $data.listview == true }, "col-grid-box"])}" style="${ssrRenderStyle($options.setPaginate(index) ? null : { display: "none" })}"><div class="product-box">`);
    _push(ssrRenderComponent(_component_productBox1, {
      onOpencartmodel: $options.showCart,
      onShowCompareModal: $options.showCoampre,
      onOpenquickview: $options.showQuickview,
      onAlertseconds: $options.alert,
      product,
      index
    }, null, _parent));
    _push(`</div></div>`);
  });
  _push(`<!--]--></div></div>`);
  if ($options.filterProduct.length > $data.paginate) {
    _push(`<div class="product-pagination mb-0"><div class="theme-paggination-block"><div class="row"><div class="col-xl-6 col-md-6 col-sm-12"><nav aria-label="Page navigation"><ul class="pagination"><li class="page-item"><a class="page-link" href="javascript:void(0)"><span aria-hidden="true"><i class="fa fa-chevron-left" aria-hidden="true"></i></span></a></li><!--[-->`);
    ssrRenderList(this.pages, (page_index, index) => {
      _push(`<li class="${ssrRenderClass([{ "active": page_index == $data.current }, "page-item"])}"><a class="page-link" href="javascrip:void(0)">${ssrInterpolate(page_index)}</a></li>`);
    });
    _push(`<!--]--><li class="page-item"><a class="page-link" href="javascript:void(0)"><span aria-hidden="true"><i class="fa fa-chevron-right" aria-hidden="true"></i></span></a></li></ul></nav></div><div class="col-xl-6 col-md-6 col-sm-12"><div class="product-search-count-bottom"><h5>Showing Products 1-12 of ${ssrInterpolate($options.filterProduct.length)} Result</h5></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div></div></div></div></div></div></section>`);
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
    products: $options.filterProduct
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collection/sidebar-popup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sidebarPopup = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  sidebarPopup as default
};
//# sourceMappingURL=sidebar-popup.ab58aa9f.js.map
