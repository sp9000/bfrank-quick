import { b as _export_sfc, m as mapState, e as useProductStore, c as __nuxt_component_0 } from "../server.mjs";
import { Swiper, SwiperSlide } from "swiper/vue";
/* empty css                     *//* empty css                         */import { Navigation } from "swiper";
import { B as Breadcrumbs } from "./breadcrumbs.eec6192c.js";
import { resolveComponent, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
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
const _sfc_main = {
  components: {
    Swiper,
    SwiperSlide,
    Breadcrumbs
  },
  data() {
    return {
      products: [],
      category: []
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
  mounted() {
    this.productsArray();
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
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
    discountedPrice(product) {
      const price = (product.price - product.price * product.discount / 100) * this.curr.curr;
      return price;
    }
  },
  setup() {
    return {
      modules: [Navigation]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Slider Element" }, null, _parent));
  _push(`<section><div class="container"><div class="row multiple-slider"><!--[-->`);
  ssrRenderList($data.category, (collection, index) => {
    _push(`<div class="col-lg-3 col-sm-6"><div class="theme-card"><h5 class="title-border">${ssrInterpolate(collection)}</h5><div class="offer-slider slide-1">`);
    _push(ssrRenderComponent(_component_swiper, {
      loop: "true",
      navigation: true,
      modules: $setup.modules,
      class: "swiper-wrapper"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div${_scopeId2}><!--[-->`);
                ssrRenderList($options.getCategoryProduct(collection).splice(0, 3), (product, index2) => {
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
                  _push3(`<h4${_scopeId2}>${ssrInterpolate(product.price || _ctx.currency)}</h4></div></div>`);
                });
                _push3(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct(collection).splice(0, 3), (product, index2) => {
                      return openBlock(), createBlock("div", {
                        class: "media",
                        key: index2
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
                          createVNode("h4", null, toDisplayString(product.price || _ctx.currency), 1)
                        ])
                      ]);
                    }), 128))
                  ])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
          if ($options.getCategoryProduct(collection).length >= 4) {
            _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><!--[-->`);
                  ssrRenderList($options.getCategoryProduct(collection).splice(3, 3), (product, index2) => {
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
                    _push3(`<h4${_scopeId2}>${ssrInterpolate(product.price || _ctx.currency)}</h4></div></div>`);
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct(collection).splice(3, 3), (product, index2) => {
                        return openBlock(), createBlock("div", {
                          class: "media",
                          key: index2
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
                            createVNode("h4", null, toDisplayString(product.price || _ctx.currency), 1)
                          ])
                        ]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            _push2(`<!---->`);
          }
        } else {
          return [
            createVNode(_component_swiper_slide, { class: "swiper-slide" }, {
              default: withCtx(() => [
                createVNode("div", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct(collection).splice(0, 3), (product, index2) => {
                    return openBlock(), createBlock("div", {
                      class: "media",
                      key: index2
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
                        createVNode("h4", null, toDisplayString(product.price || _ctx.currency), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ]),
              _: 2
            }, 1024),
            $options.getCategoryProduct(collection).length >= 4 ? (openBlock(), createBlock(_component_swiper_slide, {
              key: 0,
              class: "swiper-slide"
            }, {
              default: withCtx(() => [
                createVNode("div", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct(collection).splice(3, 3), (product, index2) => {
                    return openBlock(), createBlock("div", {
                      class: "media",
                      key: index2
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
                        createVNode("h4", null, toDisplayString(product.price || _ctx.currency), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ]),
              _: 2
            }, 1024)) : createCommentVNode("", true)
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</div></div></div>`);
  });
  _push(`<!--]--></div></div></section><section class="ratio_square section-b-space"><div class="container"><div class="row partition3 partition_3"><div class="col-lg-4"><div class="theme-card card-border"><h5 class="title-border">${ssrInterpolate($data.category[0])}</h5><div class="offer-slider slide-1">`);
  _push(ssrRenderComponent(_component_swiper, {
    loop: "true",
    navigation: true,
    modules: $setup.modules,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div${_scopeId2}><!--[-->`);
              ssrRenderList($options.getCategoryProduct($data.category[0]).splice(0, 4), (product, index) => {
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
                  _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del${_scopeId2}>${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</del></h4>`);
                } else {
                  _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4>`);
                }
                _push3(`</div></div>`);
              });
              _push3(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[0]).splice(0, 4), (product, index) => {
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
                          createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
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
        if ($options.getCategoryProduct($data.category[0]).length >= 5) {
          _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div${_scopeId2}><!--[-->`);
                ssrRenderList($options.getCategoryProduct($data.category[0]).splice(4, 4), (product, index) => {
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
                    _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del${_scopeId2}>${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</del></h4>`);
                  } else {
                    _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4>`);
                  }
                  _push3(`</div></div>`);
                });
                _push3(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[0]).splice(4, 4), (product, index) => {
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
                            createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
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
        _push2(`<div class="swiper-button-prev"${_scopeId}><i class="fa fa-angle-left" aria-hidden="true"${_scopeId}></i></div><div class="swiper-button-next"${_scopeId}><i class="fa fa-angle-right" aria-hidden="true"${_scopeId}></i></div>`);
      } else {
        return [
          createVNode(_component_swiper_slide, { class: "swiper-slide" }, {
            default: withCtx(() => [
              createVNode("div", null, [
                (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[0]).splice(0, 4), (product, index) => {
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
                        createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
                      ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString($options.curr.symbol) + toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1))
                    ])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          $options.getCategoryProduct($data.category[0]).length >= 5 ? (openBlock(), createBlock(_component_swiper_slide, {
            key: 0,
            class: "swiper-slide"
          }, {
            default: withCtx(() => [
              createVNode("div", null, [
                (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[0]).splice(4, 4), (product, index) => {
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
                        createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
                      ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString($options.curr.symbol) + toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1))
                    ])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          })) : createCommentVNode("", true),
          createVNode("div", { class: "swiper-button-prev" }, [
            createVNode("i", {
              class: "fa fa-angle-left",
              "aria-hidden": "true"
            })
          ]),
          createVNode("div", { class: "swiper-button-next" }, [
            createVNode("i", {
              class: "fa fa-angle-right",
              "aria-hidden": "true"
            })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div><div class="col-lg-4 center-slider border-0"><div><div class="title2"><h4>on sale</h4><h2 class="title-inner2">${ssrInterpolate($data.category[1])}</h2></div><div class="offer-slider slide-1">`);
  _push(ssrRenderComponent(_component_swiper, {
    loop: "true",
    navigation: true,
    modules: $setup.modules,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($options.getCategoryProduct($data.category[1]).splice(0, 4), (product, index) => {
          _push2(ssrRenderComponent(_component_swiper_slide, {
            class: "swiper-slide",
            key: index
          }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div${_scopeId2}><div class="product-box product-wrap"${_scopeId2}><div class="img-wrapper"${_scopeId2}><div class="lable-block"${_scopeId2}>`);
                if (product.new) {
                  _push3(`<span class="lable3"${_scopeId2}>new</span>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div class="front"${_scopeId2}>`);
                _push3(ssrRenderComponent(_component_nuxt_link, {
                  to: { path: "/product/sidebar/" + product.id }
                }, {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(`<img${ssrRenderAttr("src", $options.getImgUrl(_ctx.imageSrc ? _ctx.imageSrc : product.images[0].src))}${ssrRenderAttr("id", product.id)} class="img-fluid bg-img"${ssrRenderAttr("alt", product.title)}${_scopeId3}>`);
                    } else {
                      return [
                        (openBlock(), createBlock("img", {
                          src: $options.getImgUrl(_ctx.imageSrc ? _ctx.imageSrc : product.images[0].src),
                          id: product.id,
                          class: "img-fluid bg-img",
                          alt: product.title,
                          key: index
                        }, null, 8, ["src", "id", "alt"]))
                      ];
                    }
                  }),
                  _: 2
                }, _parent3, _scopeId2));
                _push3(`</div><ul class="product-thumb-list"${_scopeId2}><!--[-->`);
                ssrRenderList(product.images, (image, index2) => {
                  _push3(`<li class="${ssrRenderClass([{ active: _ctx.imageSrc == image.src }, "grid_thumb_img"])}"${_scopeId2}><a href="javascript:void(0);"${_scopeId2}><img${ssrRenderAttr("src", $options.getImgUrl(image.src))} alt="&#39;image.alt&#39;"${_scopeId2}></a></li>`);
                });
                _push3(`<!--]--></ul><div class="cart-detail"${_scopeId2}><a href="javascript:void(0)" title="Wishlist"${_scopeId2}><i class="ti-heart" aria-hidden="true"${_scopeId2}></i></a><a href="javascript:void(0)" title="Quick View"${_scopeId2}><i class="ti-search" aria-hidden="true"${_scopeId2}></i></a><a href="javascript:void(0)" title="Comapre"${_scopeId2}><i class="ti-reload" aria-hidden="true"${_scopeId2}></i></a></div></div><div class="product-info"${_scopeId2}><div class="rating"${_scopeId2}><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i><i class="fa fa-star"${_scopeId2}></i></div>`);
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
                _push3(`<p${_scopeId2}>${ssrInterpolate(product.description)}</p>`);
                if (product.sale) {
                  _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del${_scopeId2}>${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</del></h4>`);
                } else {
                  _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4>`);
                }
                _push3(`<div class="add-btn"${_scopeId2}><button data-toggle="modal" data-target="#addtocart" title="Add to cart" class="btn btn-outline"${_scopeId2}><i class="ti-shopping-cart"${_scopeId2}></i> add to cart </button></div></div></div></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    createVNode("div", { class: "product-box product-wrap" }, [
                      createVNode("div", { class: "img-wrapper" }, [
                        createVNode("div", { class: "lable-block" }, [
                          product.new ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "lable3"
                          }, "new")) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "front" }, [
                          createVNode(_component_nuxt_link, {
                            to: { path: "/product/sidebar/" + product.id }
                          }, {
                            default: withCtx(() => [
                              (openBlock(), createBlock("img", {
                                src: $options.getImgUrl(_ctx.imageSrc ? _ctx.imageSrc : product.images[0].src),
                                id: product.id,
                                class: "img-fluid bg-img",
                                alt: product.title,
                                key: index
                              }, null, 8, ["src", "id", "alt"]))
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ]),
                        createVNode("ul", { class: "product-thumb-list" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(product.images, (image, index2) => {
                            return openBlock(), createBlock("li", {
                              class: ["grid_thumb_img", { active: _ctx.imageSrc == image.src }],
                              key: index2
                            }, [
                              createVNode("a", { href: "javascript:void(0);" }, [
                                createVNode("img", {
                                  src: $options.getImgUrl(image.src),
                                  alt: "'image.alt'"
                                }, null, 8, ["src"])
                              ])
                            ], 2);
                          }), 128))
                        ]),
                        createVNode("div", { class: "cart-detail" }, [
                          createVNode("a", {
                            href: "javascript:void(0)",
                            title: "Wishlist"
                          }, [
                            createVNode("i", {
                              class: "ti-heart",
                              "aria-hidden": "true"
                            })
                          ]),
                          createVNode("a", {
                            href: "javascript:void(0)",
                            title: "Quick View"
                          }, [
                            createVNode("i", {
                              class: "ti-search",
                              "aria-hidden": "true"
                            })
                          ]),
                          createVNode("a", {
                            href: "javascript:void(0)",
                            title: "Comapre"
                          }, [
                            createVNode("i", {
                              class: "ti-reload",
                              "aria-hidden": "true"
                            })
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "product-info" }, [
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
                        createVNode("p", null, toDisplayString(product.description), 1),
                        product.sale ? (openBlock(), createBlock("h4", { key: 0 }, [
                          createTextVNode(toDisplayString($options.curr.symbol) + toDisplayString($options.discountedPrice(product)) + " ", 1),
                          createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
                        ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString($options.curr.symbol) + toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)),
                        createVNode("div", { class: "add-btn" }, [
                          createVNode("button", {
                            "data-toggle": "modal",
                            "data-target": "#addtocart",
                            title: "Add to cart",
                            class: "btn btn-outline"
                          }, [
                            createVNode("i", { class: "ti-shopping-cart" }),
                            createTextVNode(" add to cart ")
                          ])
                        ])
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[1]).splice(0, 4), (product, index) => {
            return openBlock(), createBlock(_component_swiper_slide, {
              class: "swiper-slide",
              key: index
            }, {
              default: withCtx(() => [
                createVNode("div", null, [
                  createVNode("div", { class: "product-box product-wrap" }, [
                    createVNode("div", { class: "img-wrapper" }, [
                      createVNode("div", { class: "lable-block" }, [
                        product.new ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "lable3"
                        }, "new")) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "front" }, [
                        createVNode(_component_nuxt_link, {
                          to: { path: "/product/sidebar/" + product.id }
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock("img", {
                              src: $options.getImgUrl(_ctx.imageSrc ? _ctx.imageSrc : product.images[0].src),
                              id: product.id,
                              class: "img-fluid bg-img",
                              alt: product.title,
                              key: index
                            }, null, 8, ["src", "id", "alt"]))
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ]),
                      createVNode("ul", { class: "product-thumb-list" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(product.images, (image, index2) => {
                          return openBlock(), createBlock("li", {
                            class: ["grid_thumb_img", { active: _ctx.imageSrc == image.src }],
                            key: index2
                          }, [
                            createVNode("a", { href: "javascript:void(0);" }, [
                              createVNode("img", {
                                src: $options.getImgUrl(image.src),
                                alt: "'image.alt'"
                              }, null, 8, ["src"])
                            ])
                          ], 2);
                        }), 128))
                      ]),
                      createVNode("div", { class: "cart-detail" }, [
                        createVNode("a", {
                          href: "javascript:void(0)",
                          title: "Wishlist"
                        }, [
                          createVNode("i", {
                            class: "ti-heart",
                            "aria-hidden": "true"
                          })
                        ]),
                        createVNode("a", {
                          href: "javascript:void(0)",
                          title: "Quick View"
                        }, [
                          createVNode("i", {
                            class: "ti-search",
                            "aria-hidden": "true"
                          })
                        ]),
                        createVNode("a", {
                          href: "javascript:void(0)",
                          title: "Comapre"
                        }, [
                          createVNode("i", {
                            class: "ti-reload",
                            "aria-hidden": "true"
                          })
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "product-info" }, [
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
                      createVNode("p", null, toDisplayString(product.description), 1),
                      product.sale ? (openBlock(), createBlock("h4", { key: 0 }, [
                        createTextVNode(toDisplayString($options.curr.symbol) + toDisplayString($options.discountedPrice(product)) + " ", 1),
                        createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
                      ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString($options.curr.symbol) + toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)),
                      createVNode("div", { class: "add-btn" }, [
                        createVNode("button", {
                          "data-toggle": "modal",
                          "data-target": "#addtocart",
                          title: "Add to cart",
                          class: "btn btn-outline"
                        }, [
                          createVNode("i", { class: "ti-shopping-cart" }),
                          createTextVNode(" add to cart ")
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              _: 2
            }, 1024);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div><div class="col-lg-4"><div class="theme-card card-border"><h5 class="title-border">${ssrInterpolate($data.category[2])}</h5><div class="offer-slider slide-1">`);
  _push(ssrRenderComponent(_component_swiper, {
    loop: "true",
    navigation: true,
    modules: $setup.modules,
    class: "swiper-wrapper"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div${_scopeId2}><!--[-->`);
              ssrRenderList($options.getCategoryProduct($data.category[2]).splice(0, 4), (product, index) => {
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
                  _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del${_scopeId2}>${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</del></h4>`);
                } else {
                  _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4>`);
                }
                _push3(`</div></div>`);
              });
              _push3(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[2]).splice(0, 4), (product, index) => {
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
                          createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
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
        if ($options.getCategoryProduct($data.category[2]).length >= 5) {
          _push2(ssrRenderComponent(_component_swiper_slide, { class: "swiper-slide" }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div${_scopeId2}><!--[-->`);
                ssrRenderList($options.getCategoryProduct($data.category[2]).splice(4, 5), (product, index) => {
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
                    _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate($options.discountedPrice(product))} <del${_scopeId2}>${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</del></h4>`);
                  } else {
                    _push3(`<h4${_scopeId2}>${ssrInterpolate($options.curr.symbol)}${ssrInterpolate((product.price * $options.curr.curr).toFixed(2))}</h4>`);
                  }
                  _push3(`</div></div>`);
                });
                _push3(`<!--]--></div>`);
              } else {
                return [
                  createVNode("div", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[2]).splice(4, 5), (product, index) => {
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
                            createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
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
                (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[2]).splice(0, 4), (product, index) => {
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
                        createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
                      ])) : (openBlock(), createBlock("h4", { key: 1 }, toDisplayString($options.curr.symbol) + toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1))
                    ])
                  ]);
                }), 128))
              ])
            ]),
            _: 1
          }),
          $options.getCategoryProduct($data.category[2]).length >= 5 ? (openBlock(), createBlock(_component_swiper_slide, {
            key: 0,
            class: "swiper-slide"
          }, {
            default: withCtx(() => [
              createVNode("div", null, [
                (openBlock(true), createBlock(Fragment, null, renderList($options.getCategoryProduct($data.category[2]).splice(4, 5), (product, index) => {
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
                        createVNode("del", null, toDisplayString((product.price * $options.curr.curr).toFixed(2)), 1)
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
  _push(`<div class="swiper-button-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></div><div class="swiper-button-next"><i class="fa fa-angle-right" aria-hidden="true"></i></div></div></div></div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/page/element/multi-slider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const multiSlider = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  multiSlider as default
};
//# sourceMappingURL=multi-slider.645c2a54.js.map
