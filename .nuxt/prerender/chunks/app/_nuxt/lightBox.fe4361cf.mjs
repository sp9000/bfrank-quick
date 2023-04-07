import { _ as __nuxt_component_2 } from './client-only.3da4daca.mjs';
import Lightbox from 'file:///home/sp07/vue/templatian/node_modules/vue-easy-lightbox/dist/vue-easy-lightbox.esm.min.js';
import { useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { ssrRenderComponent } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { b as _export_sfc } from '../server.mjs';

const _sfc_main = {
  props: ["index", "image", "visible"],
  components: {
    Lightbox
  },
  methods: {
    handleHide() {
      this.$emit("close");
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_client_only = __nuxt_component_2;
  _push(ssrRenderComponent(_component_client_only, _attrs, null, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/lightBox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=lightBox.fe4361cf.mjs.map
