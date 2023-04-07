import { m as mapState, e as useProductStore, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { _ as __nuxt_component_0 } from './product-box1.0b51d818.mjs';
import { _ as __nuxt_component_3 } from './index.cdece796.mjs';
import { s as sidebar, u as useFilterStore } from './collection-sidebar.14fa616c.mjs';
import { B as Breadcrumbs } from './breadcrumbs.c6638e27.mjs';
import { q as quickviewModel, c as compareModel } from './compare-popup.2ccec425.mjs';
import { c as cartModel } from './cart-modal-popup.584757b0.mjs';
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { _ as _imports_0 } from './2.25ea6962.mjs';
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
import 'file:///home/sp07/vue/templatian/node_modules/swiper/swiper.esm.js';

const _imports_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAYAAABGbhwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RTVFMDIwQzZFRDMxMUU4OEUwRkJGODM0QzlEOEMyQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RTVFMDIwRDZFRDMxMUU4OEUwRkJGODM0QzlEOEMyQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdFNUUwMjBBNkVEMzExRTg4RTBGQkY4MzRDOUQ4QzJCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdFNUUwMjBCNkVEMzExRTg4RTBGQkY4MzRDOUQ4QzJCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aawbRwAAAChJREFUeNpi/O9jzUAMYIHS/5HEGLGJMTEQCUYVEhXgjFjkUMQAAgwA1dUDot3XPXwAAAAASUVORK5CYII=";
const _imports_2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAALCAYAAACgR9dcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MTdCQTc3MTZFRDMxMUU4ODY2RUQxNEE4NTg2RDU3RiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MTdCQTc3MjZFRDMxMUU4ODY2RUQxNEE4NTg2RDU3RiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgxN0JBNzZGNkVEMzExRTg4NjZFRDE0QTg1ODZENTdGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgxN0JBNzcwNkVEMzExRTg4NjZFRDE0QTg1ODZENTdGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+GjdbGgAAACxJREFUeNpi/O9jzUAuYIHS/5HEGIkVY2KgAIxqHjKaWdASAQOWhIFTDCDAAPN5BKPQTV51AAAAAElFTkSuQmCC";
const _imports_3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NkZEMTg5MzZFRDMxMUU4OTY5QUE1QjA4NDk4NzIzMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4NkZEMTg5NDZFRDMxMUU4OTY5QUE1QjA4NDk4NzIzMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg2RkQxODkxNkVEMzExRTg5NjlBQTVCMDg0OTg3MjMwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg2RkQxODkyNkVEMzExRTg5NjlBQTVCMDg0OTg3MjMwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9SdPNAAAACtJREFUeNpi/O9jzUBNwAKl/yOJMVIixsRAZTBq4KiBFCRsRixyZIkBBBgAjU8FpEqHnOUAAAAASUVORK5CYII=";
const _imports_4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAALCAYAAABoKz2KAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QTgwN0MxMTZFRDMxMUU4QUZCNUZCQ0YyNTU5NDAyMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QTgwN0MxMjZFRDMxMUU4QUZCNUZCQ0YyNTU5NDAyMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhBODA3QzBGNkVEMzExRThBRkI1RkJDRjI1NTk0MDIxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhBODA3QzEwNkVEMzExRThBRkI1RkJDRjI1NTk0MDIxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+z4uoxgAAAC5JREFUeNpi/O9jzTAQgAVK/0cSY6SHGBPDAIFRi0ctHrWY6gUIIxY5mooBBBgANXMHprRYLDsAAAAASUVORK5CYII=";
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
      col3: true,
      col4: false,
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
      dismissCountDown: 0
    };
  },
  computed: {
    ...mapState(useProductStore, {
      productslist: "productslist",
      currency: "currency"
    }),
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
    getCategoryProduct(collection) {
      return this.productslist.filter((item) => {
        if (item.collection.find((i) => i === collection)) {
          return item;
        }
      });
    },
    getImgUrl(path) {
      return "/images/" + path;
    },
    discountedPrice(product) {
      const price = product.price - product.price * product.discount / 100;
      return price;
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
  const _component_Footer = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "collection" }, null, _parent));
  _push(`<section class="section-b-space ratio_asos"><div class="collection-wrapper"><div class="container"><div class="row"><div class="col-lg-3">`);
  _push(ssrRenderComponent(_component_sidebar, {
    onAllFilters: $options.allfilter,
    onPriceVal: $options.pricefilterArray,
    onCategoryfilter: $options.getCategoryFilter
  }, null, _parent));
  _push(`</div><div class="collection-content col"><div class="page-main-content"><div class="row"><div class="col-12"><div class="top-banner-wrapper"><a href="#"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid" alt></a><div class="top-banner-content small-section"><h4>fashion</h4><h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</h5><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></div></div><ul class="product-filter-tags"><!--[-->`);
  ssrRenderList($data.allfilters, (tag, index) => {
    _push(`<li class="me-1"><a href="javascript:void(0)" class="filter_tag">${ssrInterpolate(tag)}<i class="ti-close"></i></a></li>`);
  });
  _push(`<!--]-->`);
  if ($data.allfilters.length > 0) {
    _push(`<li class="clear_filter"><a href="javascript:void(0)" class="clear_filter">Clear all</a></li>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</ul><div class="collection-product-wrapper"><div class="product-top-filter"><div class="row"><div class="col-12"><div class="product-filter-content"><div class="search-count"><h5>Showing Products 1-12 of ${ssrInterpolate($options.filterProduct.length)} Result</h5></div><div class="collection-view"><ul><li><i class="fa fa-th grid-layout-view"></i></li><li><i class="fa fa-list-ul list-layout-view"></i></li></ul></div><div class="collection-grid-view"><ul><li><img${ssrRenderAttr("src", _imports_1)} class="product-2-layout-view"></li><li><img${ssrRenderAttr("src", _imports_2)} class="product-3-layout-view"></li><li><img${ssrRenderAttr("src", _imports_3)} class="product-4-layout-view"></li><li><img${ssrRenderAttr("src", _imports_4)} class="product-6-layout-view"></li></ul></div><div class="product-page-filter"><select><option value="all">Sorting Items</option><option value="a-z">Alphabetically, A-Z</option><option value="z-a">Alphabetically, Z-A</option><option value="low">price, low to high</option><option value="high">price, high to low</option></select></div></div></div></div></div><div class="${ssrRenderClass([{ "list-view": $data.listview == true }, "product-wrapper-grid"])}"><div class="row"><div class="col-12">`);
  if ($options.filterProduct.length == 0) {
    _push(`<div class="text-center section-t-space section-b-space"><img${ssrRenderAttr("src", "/images/empty-search.jpg")} class="img-fluid" alt><h3 class="mt-3">Sorry! Couldn&#39;t find the product you were looking For!!!</h3><div class="col-12 mt-3">`);
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
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collection/three-grid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const threeGrid = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { threeGrid as default };
//# sourceMappingURL=three-grid.437fbbc5.mjs.map