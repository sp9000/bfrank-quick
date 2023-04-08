import { d as defineStore, m as mapState, e as useProductStore, f as useCartStore, l as useI18n, b as _export_sfc, h as useSwitchLocalePath$1, i as useRouter, j as useRoute, k as getComposer, u as useNuxtApp, c as __nuxt_component_0$1 } from '../server.mjs';
import { computed, useSSRContext, resolveComponent, resolveDirective, withCtx, mergeProps, withDirectives, openBlock, createBlock, createVNode, createTextVNode, toDisplayString } from 'vue';
import UserAuth from './auth.13771b2b.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrGetDirectiveProps, ssrRenderSlot, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_1, a as __nuxt_component_2 } from './client-only.881b10b3.mjs';
import { _ as __nuxt_component_3 } from './index.a7fc1bab.mjs';
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
import './cookie.e01aaf43.mjs';

const _sfc_main$5 = {
  data() {
    return {
      isLogin: false
    };
  },
  mounted() {
  },
  created() {
  },
  methods: {
    logout: function() {
      UserAuth.Logout();
      this.$router.replace("/page/account/login");
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "top-header" }, _attrs))}><div class="container"><div class="row"><div class="col-lg-6"><div class="header-contact"><ul><li>Welcome to Our store Multikart</li><li><i class="fa fa-phone" aria-hidden="true"></i>Call Us: 123 - 456 - 7890 </li></ul></div></div><div class="col-lg-6 text-end"><ul class="header-dropdown"><li class="mobile-wishlist">`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/page/account/wishlist" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="fa fa-heart" aria-hidden="true"${_scopeId}></i>`);
      } else {
        return [
          createVNode("i", {
            class: "fa fa-heart",
            "aria-hidden": "true"
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="onhover-dropdown mobile-account"><i class="fa fa-user" aria-hidden="true"></i> My Account <ul class="onhover-show-div"><li>`);
  if ($data.isLogin) {
    _push(`<a> Logout </a>`);
  } else {
    _push(`<!---->`);
  }
  if (!$data.isLogin) {
    _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/page/account/login" } }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Login`);
        } else {
          return [
            createTextVNode("Login")
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/page/account/dashboard" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Dashboard`);
      } else {
        return [
          createTextVNode("Dashboard")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></li></ul></div></div></div></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/topbar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const TopBar = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5]]);
const _imports_0$2 = "" + globalThis.__publicAssetsURL("images/mega-menu/fashion.jpg");
const _sfc_main$4 = {
  props: ["leftSidebarVal"],
  data() {
    return {
      activeItem: "clothing"
    };
  },
  methods: {
    closeLeftBar(val) {
      val = false;
      this.$emit("closeVal", val);
    },
    isActive: function(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive: function(menuItem) {
      if (this.activeItem === menuItem) {
        this.activeItem = "";
      } else {
        this.activeItem = menuItem;
      }
    }
  },
  watch: {
    leftSidebarVal: {
      handler(newValue, oldValue) {
      },
      deep: true
    }
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "mySidenav",
    class: ["sidenav", $props.leftSidebarVal ? "openSide" : ""]
  }, _attrs))}><a class="sidebar-overlay"></a><nav><a><div class="sidebar-back text-left"><i class="fa fa-angle-left pe-2" aria-hidden="true"></i> Back </div></a><ul id="sub-menu" class="sidebar-menu"><li><a href="javascript:void(0)">clothing <span class="sub-arrow"></span></a><ul class="${ssrRenderClass([{ opensidesubmenu: $options.isActive("clothing") }, "mega-menu clothing-menu"])}"><li><div class="row g-sm-4 g-3"><div class="col-xl-4"><div class="link-section"><h5>women&#39;s fashion</h5><ul><li><a href="#">dresses</a></li><li><a href="#">skirts</a></li><li><a href="#">westarn wear</a></li><li><a href="#">ethic wear</a></li><li><a href="#">sport wear</a></li></ul></div></div><div class="col-xl-4"><div class="link-section"><h5>men&#39;s fashion</h5><ul><li><a href="#">sports wear</a></li><li><a href="#">western wear</a></li><li><a href="#">ethic wear</a></li></ul></div></div><div class="col-xl-4"><div class="link-section"><h5>accessories</h5><ul><li><a href="#">fashion jewellery</a></li><li><a href="#">caps and hats</a></li><li><a href="#">precious jewellery</a></li><li><a href="#">necklaces</a></li><li><a href="#">earrings</a></li><li><a href="#">wrist wear</a></li><li><a href="#">ties</a></li><li><a href="#">cufflinks</a></li><li><a href="#">pockets squares</a></li></ul></div></div><div class="col-xl-4"><a href="#" class="mega-menu-banner"><img${ssrRenderAttr("src", _imports_0$2)} alt class="img-fluid"></a></div></div></li></ul></li><li><a href="javascript:void(0)">bags <span class="sub-arrow"></span></a><ul class="${ssrRenderClass({ opensub1: $options.isActive("bags") })}"><li><a href="#">shopper bags</a></li><li><a href="#">laptop bags</a></li><li><a href="#">clutches</a></li></ul></li><li><a href="javascript:void(0)">footwear <span class="sub-arrow"></span></a><ul class="${ssrRenderClass({ opensub1: $options.isActive("footwear") })}"><li><a href="#">sport shoes</a></li><li><a href="#">formal shoes</a></li><li><a href="#">casual shoes</a></li></ul></li><li><a href="#">watches</a></li><li><a href="javascript:void(0)">Accessories <span class="sub-arrow"></span></a><ul class="${ssrRenderClass({ opensub1: $options.isActive("accessories") })}"><li><a href="#">fashion jewellery</a></li><li><a href="#">caps and hats</a></li><li><a href="#">precious jewellery</a></li></ul></li><li><a href="javascript:void(0)">house of design</a></li><li><a href="javascript:void(0)">beauty &amp; personal care <span class="sub-arrow"></span></a><ul class="${ssrRenderClass({ opensub1: $options.isActive("beauty") })}"><li><a href="#">makeup</a></li><li><a href="#">skincare</a></li><li><a href="#">premium beaty</a></li></ul></li><li><a href="#">home &amp; decor</a></li><li><a href="#">kitchen</a></li></ul></nav></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/left-sidebar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const LeftSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);
const data = [
  {
    title: "Home",
    type: "sub",
    badgeValue: "new",
    active: false,
    children: [
      {
        title: "clothing",
        type: "sub",
        active: false,
        children: [
          {
            path: "/shop/fashion",
            title: "Fashion 1",
            type: "link"
          },
          {
            path: "/shop/fashion-2",
            title: "Fashion 2",
            type: "link"
          },
          {
            path: "/shop/fashion-3",
            title: "Fashion 3",
            type: "link"
          },
          {
            path: "/shop/kids",
            title: "kids",
            type: "link"
          }
        ]
      },
      {
        path: "/shop/watch",
        title: "Watch",
        type: "link"
      },
      {
        path: "/shop/shoes",
        title: "Shoes",
        type: "link"
      },
      {
        path: "/shop/bags",
        title: "Bags",
        type: "link"
      },
      {
        path: "/shop/pets",
        title: "pets",
        type: "link"
      },
      {
        path: "/shop/furniture",
        title: "Furniture",
        type: "link"
      },
      {
        path: "/shop/flower",
        title: "Flower",
        type: "link"
      },
      {
        path: "/shop/electronics-1",
        title: "Electronics",
        type: "link"
      },
      {
        path: "/shop/vegetables",
        title: "Vegetables",
        type: "link"
      },
      {
        path: "/shop/beauty",
        title: "Beauty",
        type: "link"
      },
      {
        path: "/shop/tools",
        title: "Tools",
        type: "link"
      },
      {
        path: "/shop/jewellery",
        title: "Jewellery",
        type: "link"
      },
      {
        path: "/shop/gym",
        title: "gym",
        type: "link"
      }
    ]
  },
  {
    title: "Shop",
    type: "sub",
    active: false,
    children: [
      {
        path: "/collection/leftsidebar/all",
        title: "Left Sidebar",
        type: "link"
      },
      {
        path: "/collection/right-sidebar",
        title: "Right Sidebar",
        type: "link"
      },
      {
        path: "/collection/no-sidebar",
        title: "No Sidebar",
        type: "link"
      },
      {
        path: "/collection/sidebar-popup",
        title: "Sidebar Popup",
        type: "link"
      },
      {
        path: "/collection/metro",
        title: "Metro",
        type: "link"
      },
      {
        path: "/collection/full-width",
        title: "Full width",
        type: "link"
      },
      {
        path: "/collection/three-grid",
        title: "Three Grid",
        type: "link"
      },
      {
        path: "/collection/six-grid",
        title: "six Grid",
        type: "link"
      },
      {
        path: "/collection/list-view",
        title: "List View",
        type: "link"
      }
    ]
  },
  {
    title: "Products",
    type: "sub",
    active: false,
    children: [
      {
        title: "Sidebar",
        type: "sub",
        active: false,
        children: [
          {
            path: "/product/sidebar/1",
            title: "left sidebar",
            type: "link"
          },
          {
            path: "/product/sidebar/right-sidebar",
            title: "Right sidebar",
            type: "link"
          },
          {
            path: "/product/sidebar/no-sidebar",
            title: "No sidebar",
            type: "link"
          }
        ]
      },
      {
        title: "Thumbnail Image",
        type: "sub",
        active: false,
        children: [
          {
            path: "/product/thumbnail-image/left-image",
            title: "left Image",
            type: "link"
          },
          {
            path: "/product/thumbnail-image/right-image",
            title: "Right image",
            type: "link"
          },
          {
            path: "/product/thumbnail-image/image-outside",
            title: "Image Outside",
            type: "link"
          }
        ]
      },
      {
        title: "3 column",
        type: "sub",
        active: false,
        children: [
          {
            path: "/product/three-column/thumbnail-left",
            title: "Thumbnail left",
            type: "link"
          },
          {
            path: "/product/three-column/thumbnail-right",
            title: "Thumbnail Right",
            type: "link"
          },
          {
            path: "/product/three-column/thumbnail-bottom",
            title: "Thumbnail bottom",
            type: "link"
          }
        ]
      },
      {
        path: "/product/four-image",
        title: "4 Image",
        type: "link"
      },
      {
        path: "/product/bundle-product",
        title: "Bundle Product",
        type: "link"
      }
    ]
  },
  {
    title: "Features",
    type: "sub",
    megamenu: true,
    active: false,
    children: [
      {
        title: "portfolio",
        type: "megasub",
        active: false,
        children: [
          {
            path: "/page/portfolio/portfolio-2-col",
            title: "portfolio grid 2",
            type: "link"
          },
          {
            path: "/page/portfolio/portfolio-3-col",
            title: "portfolio grid 3",
            type: "link"
          },
          {
            path: "/page/portfolio/portfolio-4-col",
            title: "portfolio grid 4",
            type: "link"
          },
          {
            path: "/page/portfolio/mesonary-grid-2",
            title: "mesonary grid 2",
            type: "link"
          },
          {
            path: "/page/portfolio/mesonary-grid-3",
            title: "mesonary grid 3",
            type: "link"
          },
          {
            path: "/page/portfolio/mesonary-grid-4",
            title: "mesonary grid 4",
            type: "link"
          },
          {
            path: "/page/portfolio/masonary-fullwidth",
            title: "mesonary Full Width",
            type: "link"
          }
        ]
      },
      {
        title: "Add to cart",
        type: "megasub",
        active: false,
        children: [
          {
            path: "/shop/shoes",
            title: "Cart top",
            type: "link"
          },
          {
            path: "/shop/watch",
            title: "Cart bottom",
            type: "link"
          },
          {
            path: "/shop/bags",
            title: "Cart left",
            type: "link"
          },
          {
            path: "/shop/pets",
            title: "Cart right",
            type: "link"
          },
          {
            path: "/shop/furniture",
            title: "Cart Model Popup",
            type: "link"
          }
        ]
      },
      {
        title: "theme elements",
        type: "megasub",
        active: false,
        children: [
          {
            path: "/page/element/collection-banner",
            title: "collection banner",
            type: "link"
          },
          {
            path: "/page/element/home-slider",
            title: "Home slider",
            type: "link"
          },
          {
            path: "/page/element/category",
            title: "category",
            type: "link"
          },
          {
            path: "/page/element/logo-slider",
            title: "Logo Slider",
            type: "link"
          },
          {
            path: "/page/element/service",
            title: "service",
            type: "link"
          }
        ]
      },
      {
        title: "Product elements",
        type: "megasub",
        active: false,
        children: [
          {
            path: "/page/element/product-slider",
            title: "Product slider",
            type: "link"
          },
          {
            path: "/page/element/banner",
            title: "Banners",
            type: "link"
          },
          {
            path: "/page/element/product-tabs",
            title: "product tabs",
            type: "link"
          },
          {
            path: "/page/element/multi-slider",
            title: "Multi slider",
            type: "link"
          }
        ]
      }
    ]
  },
  {
    title: "Pages",
    type: "sub",
    active: false,
    children: [
      {
        title: "Account",
        type: "sub",
        active: false,
        children: [
          {
            path: "/page/account/wishlist",
            title: "Wishlist",
            type: "link"
          },
          {
            path: "/page/account/cart",
            title: "Cart",
            type: "link"
          },
          {
            path: "/page/account/dashboard",
            title: "Dashboard",
            type: "link"
          },
          {
            path: "/page/account/login",
            title: "Login",
            type: "link"
          },
          {
            path: "/page/account/register",
            title: "Register",
            type: "link"
          },
          {
            path: "/page/account/contact",
            title: "Contact",
            type: "link"
          },
          {
            path: "/page/account/forget-password",
            title: "Forget password",
            type: "link"
          },
          {
            path: "/page/account/profile",
            title: "Profile",
            type: "link"
          },
          {
            path: "/page/account/checkout",
            title: "Checkout",
            type: "link"
          }
        ]
      },
      {
        path: "/page/about",
        title: "About us",
        type: "link"
      },
      {
        path: "/page/search",
        title: "Search",
        type: "link"
      },
      {
        path: "/page/typography",
        title: "Typography",
        type: "link"
      },
      {
        path: "/page/review",
        title: "Review",
        type: "link"
      },
      {
        path: "/page/order-success",
        title: "Order success",
        type: "link"
      },
      {
        title: "Compare",
        type: "sub",
        active: false,
        children: [
          {
            path: "/page/compare/compare-1",
            title: "Compare-1",
            type: "link"
          },
          {
            path: "/page/compare/compare-2",
            title: "Compare-2",
            type: "link"
          }
        ]
      },
      {
        path: "/page/collection",
        title: "Collection",
        type: "link"
      },
      {
        path: "/page/lookbook",
        title: "lookbook",
        type: "link"
      },
      {
        path: "/page/sitemap",
        title: "Sitemap",
        type: "link"
      },
      {
        path: "/page/404",
        title: "404",
        type: "link"
      },
      {
        path: "/page/coming-soon",
        title: "Coming soon",
        type: "link"
      },
      {
        path: "/page/faq",
        title: "faq",
        type: "link"
      }
    ]
  },
  {
    title: "Blog",
    type: "sub",
    active: false,
    children: [
      {
        path: "/blog/blog-leftsidebar",
        title: "Left Sidebar",
        type: "link"
      },
      {
        path: "/blog/blog-rightsidebar",
        title: "Right Sidebar",
        type: "link"
      },
      {
        path: "/blog/blog-nosidebar",
        title: "No Sidebar",
        type: "link"
      },
      {
        path: "/blog/blog-detail",
        title: "Blog details",
        type: "link"
      }
    ]
  }
];
const Menu = {
  data
};
const useMenuStore = defineStore({
  id: "menu-store",
  state: () => {
    return {
      data: Menu.data
    };
  }
});
const _sfc_main$3 = {
  props: ["leftSidebarVal"],
  data() {
    return {
      openmobilenav: false,
      subnav: false,
      activeItem: "home",
      activeChildItem: "fashion 1",
      activemegaChild: "portfolio"
    };
  },
  computed: {
    ...mapState(useMenuStore, {
      menulist: "data"
    })
  },
  methods: {
    mobilenav: function() {
      this.openmobilenav = !this.openmobilenav;
    },
    isActive: function(menuItem) {
      return this.activeItem === menuItem;
    },
    setActive: function(menuItem) {
      if (this.activeItem === menuItem) {
        this.activeItem = "";
      } else {
        this.activeItem = menuItem;
      }
    },
    isActiveChild: function(menuChildItem) {
      return this.activeChildItem === menuChildItem;
    },
    setActiveChild: function(menuChildItem) {
      if (this.activeChildItem === menuChildItem) {
        this.activeChildItem = "";
      } else {
        this.activeChildItem = menuChildItem;
      }
    },
    isActivesubmega: function(megaChildItem) {
      return this.activemegaChild === megaChildItem;
    },
    setActivesubmega: function(megaChildItem) {
      if (this.activemegaChild === megaChildItem) {
        this.activemegaChild = "";
      } else {
        this.activemegaChild = megaChildItem;
      }
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-80652d74><div class="main-navbar" data-v-80652d74><div id="mainnav" data-v-80652d74><div class="${ssrRenderClass([$props.leftSidebarVal ? "toggle-button" : "", "toggle-nav"])}" data-v-80652d74><i class="fa fa-bars sidebar-bar" data-v-80652d74></i></div><ul class="${ssrRenderClass([{ opennav: $data.openmobilenav }, "nav-menu"])}" data-v-80652d74><li class="back-btn" data-v-80652d74><div class="mobile-back text-end" data-v-80652d74><span data-v-80652d74>Back</span><i class="fa fa-angle-right ps-2" aria-hidden="true" data-v-80652d74></i></div></li><!--[-->`);
  ssrRenderList(_ctx.menulist, (menuItem, index) => {
    _push(`<li class="${ssrRenderClass(menuItem.megamenu ? "mega-menu" : "dropdown")}" data-v-80652d74><a href="#" class="nav-link" data-v-80652d74>${ssrInterpolate(_ctx.$t(menuItem.title))} `);
    if (menuItem.children || menuItem.megamenu) {
      _push(`<span class="sub-arrow" data-v-80652d74></span>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</a>`);
    if (menuItem.children) {
      _push(`<ul class="${ssrRenderClass([{ opensubmenu: $options.isActive(menuItem.title) }, "nav-submenu"])}" data-v-80652d74><!--[-->`);
      ssrRenderList(menuItem.children, (childrenItem, index2) => {
        _push(`<li data-v-80652d74>`);
        if (childrenItem.children) {
          _push(`<a href="javascript:void(0)" data-v-80652d74>${ssrInterpolate(childrenItem.title)} `);
          if (childrenItem.children) {
            _push(`<span class="sub-arrow" data-v-80652d74></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</a>`);
        } else {
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: { path: childrenItem.path },
            onClick: ($event) => $options.setActiveChild(childrenItem.title)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(childrenItem.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(childrenItem.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        if (childrenItem.children) {
          _push(`<ul class="${ssrRenderClass([{ opensubchild: $options.isActiveChild(childrenItem.title) }, "nav-sub-childmenu"])}" data-v-80652d74><!--[-->`);
          ssrRenderList(childrenItem.children, (childrenSubItem, index3) => {
            _push(`<li data-v-80652d74>`);
            _push(ssrRenderComponent(_component_nuxt_link, {
              to: { path: childrenSubItem.path }
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(childrenSubItem.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(childrenSubItem.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    } else {
      _push(`<!---->`);
    }
    if (menuItem.megamenu) {
      _push(`<div class="${ssrRenderClass([{ opensubmenu: $options.isActive("portfolio") }, "mega-menu-container"])}" data-v-80652d74><div class="container" data-v-80652d74><div class="row" data-v-80652d74><!--[-->`);
      ssrRenderList(menuItem.children, (childrenItem, index2) => {
        _push(`<div class="col mega-box" data-v-80652d74><div class="link-section" data-v-80652d74><div class="menu-title" data-v-80652d74><h5 data-v-80652d74>${ssrInterpolate(childrenItem.title)} <span class="sub-arrow" data-v-80652d74></span></h5></div><div class="${ssrRenderClass([{ opensubmegamenu: $options.isActivesubmega("portfolio") }, "menu-content"])}" data-v-80652d74><ul data-v-80652d74><!--[-->`);
        ssrRenderList(childrenItem.children, (childrenSubItem, index3) => {
          _push(`<li data-v-80652d74>`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: { path: childrenSubItem.path }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(childrenSubItem.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(childrenSubItem.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div></div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</li>`);
  });
  _push(`<!--]--></ul></div></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/navbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Nav = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-80652d74"]]);
function useSwitchLocalePath() {
  return useSwitchLocalePath$1({
    router: useRouter(),
    route: useRoute(),
    i18n: getComposer(useNuxtApp().$i18n)
  });
}
const _imports_0$1 = "" + globalThis.__publicAssetsURL("images/icon/layout4/search.png");
const _imports_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Mjg4QjRFNjczODExMUU4QTE0OEE3RkM0QUQ3Q0IwOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Mjg4QjRFNzczODExMUU4QTE0OEE3RkM0QUQ3Q0IwOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjcyODhCNEU0NzM4MTExRThBMTQ4QTdGQzRBRDdDQjA5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjcyODhCNEU1NzM4MTExRThBMTQ4QTdGQzRBRDdDQjA5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+T/8TKQAAAv5JREFUeNqclWtojmEYx9/NCkNDlENTFotvmDBnJVnEGO0DFovUWE5vyynTtpw1JlOKpckh53LYcsghJA1fkA/EsDGHreVQxPyu+r91ezzP6+WuX3fP9d73/b+v67qv641LHzQgFMPoCmegC7RAHDTD1Fs191//bXN8KLYxC3rBGBiruSPMj2Wzn8hIeAjrHJvd/BHUOzyGn5EFw9MGhuERTPibyES4AVWwCiplfydP3JEMTRLYw7QRzkI13zOCRDLgAsyBFZACU+AqlMIhj8hBKOLAy8xzoR/5KWCeBsdcIVfkPGzT5pBC0gmeyV7kETHbeqi1dQg8NSPzaaaVJhRZmOBsKoZlsBUaZLOY50bJ6U4O/c2ABx2YzKPtfiKW6O7wBPrAh9A/DgTaa/8lxMNBiV8g9yt8zhgCJ+AKnILRPmvK4SsC2a7RPGmrZLdRoaXoEHfkQxkcBkt0KlyD1XpVkfEAsvAoX8/+GxyJo+LvSKxZC6thkxsFuKkivObYB8Nde/bcvNoJ2VKmTF24nUXLRJr0iloCQm3hqYPZAeFJQ2RolDzVWk7eQuco+UyC6wG/mWetowgkMr2PV9OL9pI+w7CA39Lhe9BGPPxiUbJcvITbkRahotzlrC1UyHZDjWPvB0usE3tuby90uj6tZj61Su7e7ahcrtPztSr+oWTbeK7b2rqe0Bty4IC9LG5b7gjkOS2oVk01bJ40utWpW4yDzY5tA9grXA797XYwGc55IjTKIoNwSbQuXKpD5vmE2Opjkg7K8BGwschyjEf7gkSstS+USH3oPwYefNT+mQiV+IlYSHbAC89es+UFnJvLYWUeoQbldY2fSJa8ydS3FegbGKo2X+ARWKxcpiHUCD2U/PGy5/iJnDQ31bcK9aruqBbCPi3f/t+LufkI5ecpAmuZL9pa7JVBiT+upFrD3OvUQJLqyR2vIFEhspazRf+QWXxXeLuwd1Tp/8S7LtXpcdZh+8I9JxeFisAfIyHGh2MtPluVHxGxlrE/ls2/BBgAIbThtUgbLMIAAAAASUVORK5CYII=";
const _imports_2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NUQ3OUUyQzczODExMUU4ODc2NDk1QURDMEQwNUVBRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NUQ3OUUyRDczODExMUU4ODc2NDk1QURDMEQwNUVBRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc1RDc5RTJBNzM4MTExRTg4NzY0OTVBREMwRDA1RUFEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc1RDc5RTJCNzM4MTExRTg4NzY0OTVBREMwRDA1RUFEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Nz2VDAAAAgNJREFUeNqklU9IFVEUh+flK9FaWEJKJoaYthE0RTQISVy0DEo3QagIgotsJ5a6Sald4caVRhBBbtxIIISKCyMkRfyDBBKBYFghGpaJOn0HzoXLbd745vWDjzv3zMzvzj33njuxmqtlXojOQB80QC7EwIdNGIVHMx/ntxK9HAsxv6UGf+AlTMI3yIZaaIJMuMsAr6OYN8MwDEBHyMyeQie0M8BgMuaFsAa98Ng7Xg/gGZQywJJ940TAw2/hS5LGHobPaVZh3L3nmudACdzzoqkRLlyrKC8MM78OezAdxZmvX6T5CXVBOZec3YQrGl+AUxH8DyTner2qO+u+mE9wcQOGYAO+a2qi6hOclfRAK3yIq/EbDUQWKfknRu4PadrE/IXu69+QD6ejmGNkd2W9PqvfiJi36JSeyFRg3Utd59W4jxn12EUko17UnKeUFmYhm2BHziTiB2Yr5uuhdNn7P5WoT1GiCjW6DbNWX3bBHBRbsfd8bcKCCzPPg0rn+JXVy7Ji1VCQivmuVp1dKL9g34r9cJ5J2tzT/EXpJ22epakwOgkZkG7FzunPI1Bxq/W1kIzkWHho9b9CtxaJURdMOUXkG9+4ld90ZybzitE29Lt/Iqf8j9Rn1/0TLesOuaOL5Afk1Q/om2fk2HglC86Al+wvF1XBOxiDwxQKKA1WoN4E/gowAIrggmV55jzWAAAAAElFTkSuQmCC";
const _sfc_main$2 = {
  data() {
    return {
      currencyChange: {},
      search: false,
      searchString: ""
    };
  },
  computed: {
    ...mapState(useProductStore, {
      searchItems: "searchProducts"
    }),
    ...mapState(useCartStore, {
      cartTotal: (store) => store.cartTotalAmount
    }),
    cart() {
      return useCartStore().cartItems;
    },
    curr() {
      return useProductStore().changeCurrency;
    }
  },
  watch: {
    searchString() {
      useProductStore().searchProduct(this.searchString);
    },
    cart() {
      useCartStore().cartItems;
    }
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    openSearch() {
      this.search = true;
    },
    closeSearch() {
      this.search = false;
    },
    searchProduct() {
    },
    removeCartItem: function(product) {
      useCartStore().removeCartItem(product);
      if (this.cart.length == 0 && this.$route.name === "page-account-checkout") {
        this.$router.replace("/page/account/cart");
      }
    },
    updateCurrency: function(currency, currSymbol) {
      this.currencyChange = { value: currency, symbol: currSymbol };
      useProductStore().changeCurrency2(this.currencyChange);
    }
  },
  setup() {
    const { locale, locales } = useI18n();
    const switchLocalePath = useSwitchLocalePath();
    const availableLocales = computed(() => {
      return locales.value.filter((i) => i.code !== locale.value);
    });
    return {
      switchLocalePath,
      availableLocales
    };
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_Nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="icon-nav"><ul><li class="onhover-div mobile-search"><div><img alt${ssrRenderAttr("src", _imports_0$1)} class="img-fluid"><i class="ti-search"></i></div><div id="search-overlay" class="${ssrRenderClass([{ opensearch: $data.search }, "search-overlay"])}"><div><span class="closebtn" title="Close Overlay">x</span><div class="overlay-content"><div class="container"><div class="row"><div class="col-xl-12"><form><div class="form-group mb-0"><input type="text" class="form-control"${ssrRenderAttr("value", $data.searchString)} placeholder="Search a Product"></div><button type="submit" class="btn btn-primary"><i class="fa fa-search"></i></button></form>`);
  if (_ctx.searchItems.length) {
    _push(`<ul class="search-results"><!--[-->`);
    ssrRenderList(_ctx.searchItems, (product, index) => {
      _push(`<li class="product-box"><div class="img-wrapper"><img${ssrRenderAttr("src", $options.getImgUrl(product.images[0].src))} class="img-fluid bg-img"></div><div class="product-detail">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: { path: "/product/sidebar/" + product.id }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h6${_scopeId}>${ssrInterpolate(product.title)}</h6>`);
          } else {
            return [
              createVNode("h6", null, toDisplayString(product.title), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`<h4>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4></div></li>`);
    });
    _push(`<!--]--></ul>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div></div></div></div></div></li><li class="onhover-div mobile-setting"><div><img alt${ssrRenderAttr("src", _imports_1)} class="img-fluid"><i class="ti-settings"></i></div><div class="show-div setting"><h6>Language</h6><ul class="list-inline"><li><!--[-->`);
  ssrRenderList($setup.availableLocales, (locale) => {
    _push(ssrRenderComponent(_component_Nuxt_link, {
      key: locale.code,
      to: $setup.switchLocalePath(locale.code)
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate(locale.name)}`);
        } else {
          return [
            createTextVNode(toDisplayString(locale.name), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></li></ul><h6>currency</h6><ul class="list-inline"><li><a href="javascript:void(0)">eur</a></li><li><a href="javascript:void(0)">inr</a></li><li><a href="javascript:void(0)">gbp</a></li><li><a href="javascript:void(0)">usd</a></li></ul></div></li><li class="onhover-div mobile-cart"><div><img alt${ssrRenderAttr("src", _imports_2)} class="img-fluid"><i class="ti-shopping-cart"></i><span class="cart_qty_cls">${ssrInterpolate($options.cart.length)}</span></div>`);
  if (!$options.cart.length) {
    _push(`<ul class="show-div shopping-cart"><li>Your cart is currently empty.</li></ul>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.cart.length) {
    _push(`<ul class="show-div shopping-cart"><!--[-->`);
    ssrRenderList($options.cart, (item, index) => {
      _push(`<li><div class="media">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: { path: "/product/sidebar/" + item.id }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img alt class="mr-3"${ssrRenderAttr("src", $options.getImgUrl(item.images[0].src))}${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                alt: "",
                class: "mr-3",
                src: $options.getImgUrl(item.images[0].src)
              }, null, 8, ["src"])
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`<div class="media-body">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: { path: "/product/sidebar/" + item.id }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h4${_scopeId}>${ssrInterpolate(item.title)}</h4>`);
          } else {
            return [
              createVNode("h4", null, toDisplayString(item.title), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`<h4><span>${ssrInterpolate(item.quantity)} x ${ssrInterpolate(item.price || _ctx.currency)}</span></h4></div></div><div class="close-circle"><a href="#"><i class="fa fa-times" aria-hidden="true"></i></a></div></li>`);
    });
    _push(`<!--]--><li><div class="total"><h5> subtotal : <span>${ssrInterpolate(_ctx.cartTotal || _ctx.currency)}</span></h5></div></li><li><div class="buttons">`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/page/account/cart" },
      class: "view-cart"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` view cart `);
        } else {
          return [
            createTextVNode(" view cart ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/page/account/checkout" },
      class: "checkout"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` checkout `);
        } else {
          return [
            createTextVNode(" checkout ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></li></ul>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</li></ul></div></div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/header-widgets.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const HeaderWidgets = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _imports_0 = "" + globalThis.__publicAssetsURL("images/icon/layout4/logo.png");
const _sfc_main$1 = {
  data() {
    return {
      leftSidebarVal: false
    };
  },
  components: {
    TopBar,
    LeftSidebar,
    Nav,
    HeaderWidgets
  },
  methods: {
    left_sidebar() {
      this.leftSidebarVal = true;
    },
    closeBarValFromChild(val) {
      this.leftSidebarVal = val;
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TopBar = resolveComponent("TopBar");
  const _component_LeftSidebar = resolveComponent("LeftSidebar");
  const _component_Nav = resolveComponent("Nav");
  const _component_HeaderWidgets = resolveComponent("HeaderWidgets");
  _push(`<div${ssrRenderAttrs(_attrs)}><header><div class="mobile-fix-option"></div>`);
  _push(ssrRenderComponent(_component_TopBar, null, null, _parent));
  _push(`<div class="container"><div class="row"><div class="col-12"><div class="main-menu"><div class="menu-left category-nav-right"><div class="brand-logo"><a href="#"><img${ssrRenderAttr("src", _imports_0)} class="img-fluid" alt></a></div><div class="navbar"><a><div class="bar-style"><i class="fa fa-bars sidebar-bar" aria-hidden="true"></i></div></a>`);
  _push(ssrRenderComponent(_component_LeftSidebar, {
    leftSidebarVal: $data.leftSidebarVal,
    onCloseVal: $options.closeBarValFromChild
  }, null, _parent));
  _push(`</div></div><div class="menu-right pull-right">`);
  _push(ssrRenderComponent(_component_Nav, null, null, _parent));
  _push(ssrRenderComponent(_component_HeaderWidgets, null, null, _parent));
  _push(`</div></div></div></div></div></header></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/header/index.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {
  head() {
    return {
      title: "MultiKart Ecommerce | Vuejs Shopping Theme"
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt = resolveComponent("nuxt");
  const _component_Header = __nuxt_component_0;
  const _component_WidgetsLayoutSetting = __nuxt_component_1;
  const _component_ClientOnly = __nuxt_component_2;
  const _component_Footer = __nuxt_component_3;
  const _directive_scroll_to = resolveDirective("scroll-to");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_nuxt, { id: "body-content" }, null, _parent));
  _push(ssrRenderComponent(_component_Header, null, null, _parent));
  _push(ssrRenderComponent(_component_WidgetsLayoutSetting, null, null, _parent));
  _push(ssrRenderComponent(_component_ClientOnly, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div${ssrRenderAttrs(mergeProps({ class: "tap-top top-cls" }, ssrGetDirectiveProps(_ctx, _directive_scroll_to, "#body-content")))}${_scopeId}><div${_scopeId}><i class="fa fa-angle-double-up"${_scopeId}></i></div></div>`);
      } else {
        return [
          withDirectives((openBlock(), createBlock("div", { class: "tap-top top-cls" }, [
            createVNode("div", null, [
              createVNode("i", { class: "fa fa-angle-double-up" })
            ])
          ])), [
            [_directive_scroll_to, "#body-content"]
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default.572e8385.mjs.map
