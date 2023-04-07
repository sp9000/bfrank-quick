import { s as storeToRefs, c as __nuxt_component_0, b as _export_sfc } from "../server.mjs";
import { useSSRContext, ref, unref, withCtx, createVNode, toDisplayString, resolveComponent } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { u as useBlogStore } from "./blog.6f995c75.js";
import { B as Breadcrumbs } from "./breadcrumbs.c6638e27.js";
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
const _sfc_main$1 = {
  __name: "blog-list",
  __ssrInlineRender: true,
  setup(__props) {
    let current = ref(1), paginate = ref(6), paginateRange = ref(3), pages = ref([]), paginates = ref("");
    let { bloglist } = storeToRefs(useBlogStore());
    getPaginate();
    updatePaginate(1);
    function getImgUrl(path) {
      return path;
    }
    function getPaginate() {
      paginates.value = Math.round(bloglist.value.length / paginate.value);
      pages.value = [];
      for (let i = 0; i < paginates.value; i++) {
        pages.value.push(i + 1);
      }
    }
    function setPaginate(i) {
      if (current.value === 1) {
        return i < paginate.value;
      } else {
        return i >= paginate.value * (current.value - 1) && i < current.value * paginate.value;
      }
    }
    function updatePaginate(i) {
      current.value = i;
      let start = ref(0);
      let end = ref(0);
      if (current.value < paginateRange.value - 1) {
        start.value = 1;
        end.value = start.value + paginateRange.value - 1;
      } else {
        start.value = current.value - 1;
        end.value = current.value + 1;
      }
      if (start.value < 1) {
        start.value = 1;
      }
      if (end.value > paginates.value) {
        end.value = paginates.value;
      }
      pages.value = [];
      for (let i2 = start.value; i2 <= end.value; i2++) {
        pages.value.push(i2);
      }
      return pages.value;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(unref(bloglist), (blog, index) => {
        _push(`<div class="row blog-media" style="${ssrRenderStyle(setPaginate(index) ? null : { display: "none" })}"><div class="col-xl-6"><div class="blog-left">`);
        _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/blog/blog-detail" } }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", getImgUrl(blog.img))} class="img-fluid" alt${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: getImgUrl(blog.img),
                  class: "img-fluid",
                  alt: ""
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div><div class="col-xl-6"><div class="blog-right"><div><h6>${ssrInterpolate(blog.date)}</h6>`);
        _push(ssrRenderComponent(_component_nuxt_link, { to: { path: "/blog/blog-detail" } }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h4${_scopeId}>${ssrInterpolate(blog.title)}</h4>`);
            } else {
              return [
                createVNode("h4", null, toDisplayString(blog.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<ul class="post-social"><li>Posted By : ${ssrInterpolate(blog.author)}</li><li><i class="fa fa-heart"></i> 5 Hits </li><li><i class="fa fa-comments"></i> 10 Comment </li></ul><p>${ssrInterpolate(blog.description)}</p></div></div></div></div>`);
      });
      _push(`<!--]-->`);
      if (unref(bloglist).length > unref(paginate)) {
        _push(`<div class="product-pagination border-cls-blog mb-0"><div class="theme-paggination-block"><div class="row"><div class="col-12"><nav aria-label="Page navigation"><ul class="pagination"><li class="page-item"><a class="page-link" href="javascript:void(0)"><span aria-hidden="true"><i class="fa fa-chevron-left" aria-hidden="true"></i></span></a></li><!--[-->`);
        ssrRenderList(unref(pages), (page_index, index) => {
          _push(`<li class="${ssrRenderClass([{ "active": page_index == unref(current) }, "page-item"])}"><a class="page-link" href="javascrip:void(0)">${ssrInterpolate(page_index)}</a></li>`);
        });
        _push(`<!--]--><li class="page-item"><a class="page-link" href="javascript:void(0)"><span aria-hidden="true"><i class="fa fa-chevron-right" aria-hidden="true"></i></span></a></li></ul></nav></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blog/blog-list.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  components: {
    Breadcrumbs,
    BlogList: _sfc_main$1
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Breadcrumbs = resolveComponent("Breadcrumbs");
  const _component_BlogList = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Breadcrumbs, { title: "Blog" }, null, _parent));
  _push(`<section class="section-b-space blog-page ratio2_3"><div class="container"><div class="row"><div class="col-12">`);
  _push(ssrRenderComponent(_component_BlogList, null, null, _parent));
  _push(`</div></div></div></section></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/blog-nosidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const blogNosidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  blogNosidebar as default
};
//# sourceMappingURL=blog-nosidebar.2a0aa2ea.js.map
