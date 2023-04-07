import { d as defineStore, p as products, m as mapState, e as useProductStore, b as _export_sfc, c as __nuxt_component_0$1 } from '../server.mjs';
import { Swiper, SwiperSlide } from 'file:///home/sp07/vue/templatian/node_modules/swiper/vue/swiper-vue.js';
import { Navigation } from 'file:///home/sp07/vue/templatian/node_modules/swiper/swiper.esm.js';
import { resolveComponent, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';

const useFilterStore = defineStore({
  id: "filter-store",
  state: () => {
    return {
      productslist: products.data,
      products: products.data,
      tagItems: [],
      filteredProduct: [],
      paginate: 12,
      pages: [],
      priceArray: []
    };
  },
  getters: {
    filterbyCategory: (state) => {
      const category = [...new Set(state.products.map((product) => product.type))];
      return category;
    },
    filterbyBrand: (state) => {
      const brands = [...new Set(state.filteredProduct.map((product) => product.brand))];
      return brands;
    },
    filterbycolor: (state) => {
      const uniqueColors = [];
      state.filteredProduct.filter((product) => {
        product.variants.filter((variant) => {
          if (variant.color) {
            const index = uniqueColors.indexOf(variant.color);
            if (index === -1)
              uniqueColors.push(variant.color);
          }
        });
      });
      return uniqueColors;
    },
    filterbysize: (state) => {
      const uniqueSize = [];
      state.filteredProduct.filter((product) => {
        product.variants.filter((variant) => {
          if (variant.size) {
            const index = uniqueSize.indexOf(variant.size);
            if (index === -1)
              uniqueSize.push(variant.size);
          }
        });
      });
      return uniqueSize;
    },
    filterProducts: (state) => {
      return state.filteredProduct.filter((product) => {
        if (!state.tagItems.length)
          return true;
        const Tags = state.tagItems.some((prev) => {
          if (product.tags) {
            if (product.tags.includes(prev)) {
              return prev;
            }
          }
        });
        return Tags;
      });
    }
  },
  actions: {
    getCategoryFilter(payload) {
      this.filteredProduct = [];
      this.tagItems = [];
      this.products.filter((product) => {
        if (payload === product.type) {
          this.filteredProduct.push(product);
          this.priceArray = this.filteredProduct;
        }
        if (payload === "all" || payload === void 0) {
          this.filteredProduct.push(product);
          this.priceArray = this.filteredProduct;
        }
      });
    },
    priceFilter(payload) {
      this.filteredProduct = [];
      this.priceArray.find((product) => {
        if (product.price >= payload[0] && product.price <= payload[1]) {
          this.filteredProduct.push(product);
        }
      });
    },
    setTags(payload) {
      this.tagItems = payload;
    },
    sortProducts(payload) {
      if (payload === "a-z") {
        this.filteredProduct.sort(function(a, b) {
          if (a.title < b.title) {
            return -1;
          } else if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
      } else if (payload === "z-a") {
        this.filteredProduct.sort(function(a, b) {
          if (a.title > b.title) {
            return -1;
          } else if (a.title < b.title) {
            return 1;
          }
          return 0;
        });
      } else if (payload === "low") {
        this.filteredProduct.sort(function(a, b) {
          if (a.price < b.price) {
            return -1;
          } else if (a.price > b.price) {
            return 1;
          }
          return 0;
        });
      } else if (payload === "high") {
        this.filteredProduct.sort(function(a, b) {
          if (a.price > b.price) {
            return -1;
          } else if (a.price < b.price) {
            return 1;
          }
          return 0;
        });
      }
    }
  }
});
const _sfc_main = {
  data() {
    return {
      min: 0,
      max: 0,
      start: 0,
      bannerimagepath: "/images/side-banner.png",
      selectedcolor: [],
      selectedbrand: [],
      selectedsize: [],
      applyFilter: [],
      activeItem: "category",
      filter: false,
      active: "category",
      live: false,
      live1: false,
      live2: false,
      live3: false,
      live4: false
    };
  },
  components: {
    Swiper,
    SwiperSlide
  },
  computed: {
    ...mapState(useProductStore, {
      currency: "currency",
      productslist: "productslist"
    }),
    curr() {
      return useProductStore().changeCurrency;
    },
    filterbyCategory() {
      return useFilterStore().filterbyCategory;
    },
    filterbyBrand() {
      return useFilterStore().filterbyBrand;
    },
    filterbycolor() {
      return useFilterStore().filterbycolor;
    },
    filterbysize() {
      return useFilterStore().filterbysize;
    },
    price() {
      return useProductStore().price;
    }
  },
  mounted() {
    var vm = this, max = Math.max(...this.price), min = Math.min(...this.price);
    vm.start = max;
    vm.min = min, vm.max = max;
    vm.value = [this.min, this.max];
    this.$emit("priceVal", this.value);
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    handleSlideTo() {
      this.swiper.slideNext();
    },
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
      const price = (product.price - product.price * product.discount / 100) * this.curr.curr;
      return price;
    },
    isActive(filterItem) {
      return this.applyFilter.indexOf(filterItem) > -1;
    },
    appliedFilter(val) {
      this.$emit("allFilters", this.applyFilter);
    },
    sliderChange(event) {
      this.$emit("priceVal", event);
    },
    toggleSidebarBlock() {
      this.openBlock = !this.openBlock;
    },
    getCategoryFilter(category) {
      useFilterStore().getCategoryFilter(category);
    }
  },
  setup() {
    return {
      modules: [Navigation]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0$1;
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="row"><div class="col-xl-12"><div class="filter-main-btn"><button class="filter-btn btn btn-theme"><i class="fa fa-filter" aria-hidden="true"></i> Filter </button></div></div></div><div class="${ssrRenderClass([$data.filter ? "openFilterbar" : "", "collection-filter"])}"><div class="collection-filter-block"><div class="collection-mobile-back"><span class="filter-back"><i class="fa fa-angle-left" aria-hidden="true"></i> back </span></div><div class="collection-collapse-block open"><h3 class="collapse-block-title">Category</h3><div class="collection-collapse-block-content" style="${ssrRenderStyle({ display: $data.live ? "block" : "none" })}"><div class="collection-brand-filter"><ul class="category-list"><li>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/collection/leftsidebar/all" } }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`All products`);
      } else {
        return [
          createTextVNode("All products")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><!--[-->`);
  ssrRenderList($options.filterbyCategory, (category, index) => {
    _push(`<li>`);
    _push(ssrRenderComponent(_component_nuxt_link, {
      to: { path: "/collection/leftsidebar/" + category },
      onClick: ($event) => $options.getCategoryFilter(category)
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate(category)}`);
        } else {
          return [
            createTextVNode(toDisplayString(category), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</li>`);
  });
  _push(`<!--]--></ul></div></div></div></div><div class="collection-filter-block">`);
  if ($options.filterbyBrand.length) {
    _push(`<div class="collection-collapse-block open"><h3 class="collapse-block-title">brand</h3><div class="collection-collapse-block-content" style="${ssrRenderStyle({ display: $data.live1 ? "block" : "none" })}"><div class="collection-brand-filter"><!--[-->`);
    ssrRenderList($options.filterbyBrand, (brand, index) => {
      _push(`<div class="form-check collection-filter-checkbox"><input type="checkbox" class="form-check-input"${ssrRenderAttr("value", brand)}${ssrRenderAttr("id", brand)}${ssrIncludeBooleanAttr(Array.isArray($data.applyFilter) ? ssrLooseContain($data.applyFilter, brand) : $data.applyFilter) ? " checked" : ""}><label class="form-check-label"${ssrRenderAttr("for", brand)}>${ssrInterpolate(brand)}</label></div>`);
    });
    _push(`<!--]--></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.filterbycolor.length) {
    _push(`<div class="collection-collapse-block open"><h3 class="collapse-block-title">colors</h3><div class="collection-collapse-block-content" style="${ssrRenderStyle({ display: $data.live2 ? "block" : "none" })}"><div class="collection-brand-filter color-filter"><!--[-->`);
    ssrRenderList($options.filterbycolor, (color, index) => {
      _push(`<div class="custom-control custom-checkbox collection-filter-checkbox p-0"><input type="checkbox" class="custom-control-input form-check-input"${ssrRenderAttr("value", color)}${ssrRenderAttr("id", color)}${ssrIncludeBooleanAttr(Array.isArray($data.applyFilter) ? ssrLooseContain($data.applyFilter, color) : $data.applyFilter) ? " checked" : ""}><span class="${ssrRenderClass(color)}" style="${ssrRenderStyle({ "background-color": color })}"></span><label class="${ssrRenderClass([{ selected: $options.isActive(color) }, "custom-control-label p-0"])}"${ssrRenderAttr("for", color)}>${ssrInterpolate(color)}</label></div>`);
    });
    _push(`<!--]--></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.filterbysize.length) {
    _push(`<div class="collection-collapse-block border-0 open"><h3 class="collapse-block-title">size</h3><div class="collection-collapse-block-content" style="${ssrRenderStyle({ display: $data.live3 ? "block" : "none" })}"><div class="color-selector"><div class="collection-brand-filter"><!--[-->`);
    ssrRenderList($options.filterbysize, (size, index) => {
      _push(`<div class="custom-control p-0 custom-checkbox collection-filter-checkbox"><input type="checkbox" class="custom-control-input form-check-input"${ssrRenderAttr("value", size)}${ssrRenderAttr("id", size)}${ssrIncludeBooleanAttr(Array.isArray($data.applyFilter) ? ssrLooseContain($data.applyFilter, size) : $data.applyFilter) ? " checked" : ""}><label class="custom-control-label"${ssrRenderAttr("for", size)}>${ssrInterpolate(size)}</label></div>`);
    });
    _push(`<!--]--></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="collection-collapse-block border-0 open"><h3 class="collapse-block-title">price</h3><div class="collection-collapse-block-content" style="${ssrRenderStyle({ display: $data.live4 ? "block" : "none" })}"><div class="collection-brand-filter price-rangee-picker m-0 mt-3"><input type="range"${ssrRenderAttr("min", $data.min)}${ssrRenderAttr("max", $data.max)}${ssrRenderAttr("value", $data.start)} class="w-100"></div></div></div></div><div class="theme-card"><h5 class="title-border">new products </h5><div class="offer-slider slide-1">`);
  _push(ssrRenderComponent(_component_swiper, {
    loop: "false",
    navigation: true,
    modules: $setup.modules,
    slidesPerView: 1,
    spaceBetween: 20,
    onSwiper: $options.onSwiper,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div${_scopeId2}><!--[-->`);
              ssrRenderList($options.getCategoryProduct("new products").splice(0, 3), (product, index) => {
                _push3(`<div class="media"${_scopeId2}>`);
                _push3(ssrRenderComponent(_component_nuxt_link, {
                  to: { path: "/product/sidebar/" + product.id }
                }, {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(`<img class="img-fluid"${ssrRenderAttr("src", $options.getImgUrl(product.images[0].src))} alt${_scopeId3}>`);
                    } else {
                      return [
                        createVNode("img", {
                          class: "img-fluid",
                          src: $options.getImgUrl(product.images[0].src),
                          alt: ""
                        }, null, 8, ["src"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                _push3(`<div class="media-body align-self-center"${_scopeId2}><div class="rating"${_scopeId2}><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i></div>`);
                _push3(ssrRenderComponent(_component_nuxt_link, {
                  to: { path: "/product/sidebar/" + product.id }
                }, {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(`<h6${_scopeId3}>${ssrInterpolate(product.title)}</h6>`);
                    } else {
                      return [
                        createVNode("h6", null, toDisplayString(product.title), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                if (product.sale) {
                  _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol))}</del></h4>`);
                } else {
                  _push3(`<h4${_scopeId2}>${ssrInterpolate(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol))}</h4>`);
                }
                _push3(`</div></div>`);
              });
              _push3(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct("new products").splice(0, 3), (product, index) => {
                    return openBlock(), createBlock("div", {
                      class: "media",
                      key: index
                    }, [
                      createVNode(_component_nuxt_link, {
                        to: { path: "/product/sidebar/" + product.id }
                      }, {
                        default: withCtx(() => [
                          createVNode("img", {
                            class: "img-fluid",
                            src: $options.getImgUrl(product.images[0].src),
                            alt: ""
                          }, null, 8, ["src"])
                        ]),
                        _: 2
                      }, 1032, ["to"]),
                      createVNode("div", { class: "media-body align-self-center" }, [
                        createVNode("div", { class: "rating" }, [
                          createVNode("i", { class: "fa fa-star" }),
                          createVNode("i", { class: "fa fa-star" }),
                          createVNode("i", { class: "fa fa-star" }),
                          createVNode("i", { class: "fa fa-star" }),
                          createVNode("i", { class: "fa fa-star" })
                        ]),
                        createVNode(_component_nuxt_link, {
                          to: { path: "/product/sidebar/" + product.id }
                        }, {
                          default: withCtx(() => [
                            createVNode("h6", null, toDisplayString(product.title), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        product.sale ? (openBlock(), createBlock("h4", { key: 0 }, [
                          createTextVNode(toDisplayString($options.curr.symbol) + toDisplayString($options.discountedPrice(product)) + " ", 1),
                          createVNode("del", null, toDisplayString($options.curr.symbol) + toDisplayString(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol)), 1)
                        ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol)), 1))
                      ])
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        if ($options.getCategoryProduct("new products").length >= 4) {
          _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div${_scopeId2}><!--[-->`);
                ssrRenderList($options.getCategoryProduct("new products").splice(3, 3), (product, index) => {
                  _push3(`<div class="media"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_nuxt_link, {
                    to: { path: "/product/sidebar/" + product.id }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<img class="img-fluid"${ssrRenderAttr("src", $options.getImgUrl(product.images[0].src))} alt${_scopeId3}>`);
                      } else {
                        return [
                          createVNode("img", {
                            class: "img-fluid",
                            src: $options.getImgUrl(product.images[0].src),
                            alt: ""
                          }, null, 8, ["src"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`<div class="media-body align-self-center"${_scopeId2}><div class="rating"${_scopeId2}><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i></div>`);
                  _push3(ssrRenderComponent(_component_nuxt_link, {
                    to: { path: "/product/sidebar/" + product.id }
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<h6${_scopeId3}>${ssrInterpolate(product.title)}</h6>`);
                      } else {
                        return [
                          createVNode("h6", null, toDisplayString(product.title), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  if (product.sale) {
                    _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del${_scopeId2}>${ssrInterpolate(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol))}</del></h4>`);
                  } else {
                    _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4>`);
                  }
                  _push3(`</div></div>`);
                });
                _push3(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct("new products").splice(3, 3), (product, index) => {
                      return openBlock(), createBlock("div", {
                        class: "media",
                        key: index
                      }, [
                        createVNode(_component_nuxt_link, {
                          to: { path: "/product/sidebar/" + product.id }
                        }, {
                          default: withCtx(() => [
                            createVNode("img", {
                              class: "img-fluid",
                              src: $options.getImgUrl(product.images[0].src),
                              alt: ""
                            }, null, 8, ["src"])
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        createVNode("div", { class: "media-body align-self-center" }, [
                          createVNode("div", { class: "rating" }, [
                            createVNode("i", { class: "fa fa-star" }),
                            createVNode("i", { class: "fa fa-star" }),
                            createVNode("i", { class: "fa fa-star" }),
                            createVNode("i", { class: "fa fa-star" }),
                            createVNode("i", { class: "fa fa-star" })
                          ]),
                          createVNode(_component_nuxt_link, {
                            to: { path: "/product/sidebar/" + product.id }
                          }, {
                            default: withCtx(() => [
                              createVNode("h6", null, toDisplayString(product.title), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"]),
                          product.sale ? (openBlock(), createBlock("h4", { key: 0 }, [
                            createTextVNode(toDisplayString($options.curr.symbol) + toDisplayString($options.discountedPrice(product)) + " ", 1),
                            createVNode("del", null, toDisplayString(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol)), 1)
                          ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString($options.curr.symbol) + toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1))
                        ])
                      ]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode(_component_swiper_slide, { class: "swiper-slide" }, {
            default: withCtx(() => [
              createVNode("div", null, [
                (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct("new products").splice(0, 3), (product, index) => {
                  return openBlock(), createBlock("div", {
                    class: "media",
                    key: index
                  }, [
                    createVNode(_component_nuxt_link, {
                      to: { path: "/product/sidebar/" + product.id }
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          class: "img-fluid",
                          src: $options.getImgUrl(product.images[0].src),
                          alt: ""
                        }, null, 8, ["src"])
                      ]),
                      _: 2
                    }, 1032, ["to"]),
                    createVNode("div", { class: "media-body align-self-center" }, [
                      createVNode("div", { class: "rating" }, [
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" })
                      ]),
                      createVNode(_component_nuxt_link, {
                        to: { path: "/product/sidebar/" + product.id }
                      }, {
                        default: withCtx(() => [
                          createVNode("h6", null, toDisplayString(product.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"]),
                      product.sale ? (openBlock(), createBlock("h4", { key: 0 }, [
                        createTextVNode(toDisplayString($options.curr.symbol) + toDisplayString($options.discountedPrice(product)) + " ", 1),
                        createVNode("del", null, toDisplayString($options.curr.symbol) + toDisplayString(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol)), 1)
                      ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol)), 1))
                    ])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          $options.getCategoryProduct("new products").length >= 4 ? (openBlock(), createBlock(_component_swiper_slide, {
            key: 0,
            class: "swiper-slide"
          }, {
            default: withCtx(() => [
              createVNode("div", null, [
                (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct("new products").splice(3, 3), (product, index) => {
                  return openBlock(), createBlock("div", {
                    class: "media",
                    key: index
                  }, [
                    createVNode(_component_nuxt_link, {
                      to: { path: "/product/sidebar/" + product.id }
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          class: "img-fluid",
                          src: $options.getImgUrl(product.images[0].src),
                          alt: ""
                        }, null, 8, ["src"])
                      ]),
                      _: 2
                    }, 1032, ["to"]),
                    createVNode("div", { class: "media-body align-self-center" }, [
                      createVNode("div", { class: "rating" }, [
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" }),
                        createVNode("i", { class: "fa fa-star" })
                      ]),
                      createVNode(_component_nuxt_link, {
                        to: { path: "/product/sidebar/" + product.id }
                      }, {
                        default: withCtx(() => [
                          createVNode("h6", null, toDisplayString(product.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"]),
                      product.sale ? (openBlock(), createBlock("h4", { key: 0 }, [
                        createTextVNode(toDisplayString($options.curr.symbol) + toDisplayString($options.discountedPrice(product)) + " ", 1),
                        createVNode("del", null, toDisplayString(product.price * _ctx.currency.curr || _ctx.currency(_ctx.currency.symbol)), 1)
                      ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString($options.curr.symbol) + toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1))
                    ])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><div class="collection-sidebar-banner"><a href="#"><img${ssrRenderAttr("src", $data.bannerimagepath)} class="img-fluid"></a></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/collection-sidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { sidebar as s, useFilterStore as u };
//# sourceMappingURL=collection-sidebar.14fa616c.mjs.map
