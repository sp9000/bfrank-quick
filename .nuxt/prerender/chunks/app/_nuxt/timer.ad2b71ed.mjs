import { ssrRenderAttrs, ssrInterpolate } from 'file:///home/sp07/vue/templatian/node_modules/vue/server-renderer/index.mjs';
import { useSSRContext } from 'file:///home/sp07/vue/templatian/node_modules/vue/index.mjs';
import { b as _export_sfc } from '../server.mjs';

const _sfc_main = {
  mounted() {
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1e3);
    }, 1e3);
  },
  props: ["date"],
  data() {
    return {
      timerdate: Math.trunc(new Date(this.date).getTime() / 1e3),
      now: Math.trunc(new Date().getTime() / 1e3)
    };
  },
  computed: {
    seconds() {
      return (this.timerdate - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.timerdate - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.timerdate - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.timerdate - this.now) / 60 / 60 / 24);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="timer"><p id="demo"><span><span class="timer-num">${ssrInterpolate($options.days)}</span><span class="padding-l">:</span><span class="timer-cal">Days</span></span><span><span class="timer-num">${ssrInterpolate($options.hours)}</span><span class="padding-l">:</span><span class="timer-cal">Hrs</span></span><span><span class="timer-num">${ssrInterpolate($options.minutes)}</span><span class="padding-l">:</span><span class="timer-cal">Min</span></span><span><span class="timer-num">${ssrInterpolate($options.seconds)}</span><span class="timer-cal">Sec</span></span></p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/timer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Timer = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { Timer as T };
//# sourceMappingURL=timer.ad2b71ed.mjs.map
