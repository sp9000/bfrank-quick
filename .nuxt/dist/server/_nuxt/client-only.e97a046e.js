import { d as defineStore, m as mapState, b as _export_sfc, c as __nuxt_component_0 } from "../server.mjs";
import { useSSRContext, withCtx, createTextVNode, defineComponent, ref, createElementBlock } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
const config = {
  layout_type: "ltr",
  layout_version: "light",
  color: "#1f80ff"
};
const Config = {
  config
};
const useLayoutStore = defineStore({
  id: "layout-store",
  state: () => {
    return {
      layout: Config,
      layoutType: "ltr"
    };
  },
  actions: {
    set() {
    },
    setLayoutType(payload) {
      if (payload === "rtl") {
        this.layoutType = "rtl", document.body.classList.remove("ltr");
        document.documentElement.setAttribute("dir", "rtl");
        document.body.classList.add("rtl");
      } else {
        this.layoutType = "ltr", document.body.classList.remove("rtl");
        document.documentElement.setAttribute("dir", "ltr");
      }
    },
    setColorScheme(payload) {
      this.layout.config.color = payload;
    },
    setLayoutVersion(payload) {
      if (this.layout.config.layout_version == "dark") {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        this.layout.config.layout_version = "light";
      } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        this.layout.config.layout_version = "dark";
      }
    }
  }
});
const _imports_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBNDZDODVEQTUwODYxMUU5ODY3REFBNDUxNTNFNkQ0NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBNDZDODVEQjUwODYxMUU5ODY3REFBNDUxNTNFNkQ0NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkE0NkM4NUQ4NTA4NjExRTk4NjdEQUE0NTE1M0U2RDQ2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkE0NkM4NUQ5NTA4NjExRTk4NjdEQUE0NTE1M0U2RDQ2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+y8qygwAABjZJREFUeNqMVmlsVFUU/u5926xvOlM6BaWQgFsVF4QiGERlFQEJBHBBKzRqYkxMMP4w/tPEmKCBRAwRY40GQQka2USJkRiW0rLZgIjKKkMptHS6zvZWz70ztMUt3uTOvNfec77vnPOdc4dt2bIFnHP4vo+/LfE32r6uD3MSiaUwAi+FOLdZobDW7+rcxFy39ZoVY0x+e54n/RXNfaj4pyUcK0rCiccXu7FYrdrTc3/i5C/QN2/CFVUFX7BotXbrbauVePwAens2oKtrM1y37RrI4MX6I3A9cspDrhlbSGxrlVxuRvi3X2EeOQTz8EGU7W+Cd0c1GrI55M+dR3D83VBq7oM2fgLU6jvAysr2sN7ejV5nejP3vDSFJCNgW7/6KuCb5iwrWbmM2/ac0Nkzmnn0MMyDTYgca0bgajdciljgG/v24dDx4+h48UVoIlDaPKhCHTMGyoSJUMcJsGooZfHd6Li63k+nd7Bt3353Qsllb4/8fAyxpgOINh9FoKVdGtvlUXihMNzUZUQmT0JwbwMa9u9HetEC8CvtYAkTfjYLP+eUwDSod91JkU2ERtEpw4adUgtDh6ZHvL8ao+o/hSWcxsPI35gUVSsV2ZPGwWXLITLMy8uhzX0M9kf1UESOg0GwEJPx+JQ+u+koCrQDD59AeOW7rZxxfsYNRaRz4dglxv2FJhDvShu0W0Yj+MSTEgjkRJ81C0pFAn5XzyC1FcF4uQmhIZZMgmn6GQ7bTlmVlfAMDkYSu14CDK5N7J9+Bno4Avv4Mbm1cTXQZ8+B5xbPXLdKPvjQoWAKT3HFdS/YZXG4hE5Su/5sOg01WY5Q7TL53vfOSuQ+/IBSEoI+Zw4UMwy/t/cvEi8BDBkCOE6KM6uQcgjAiUZBKho4SNL1MhZCTz4FY+RIFLq7UfhuJ5yGRtiNB6BNngLtkUfhWZQbPhCF77iUKpUEUE4FJQBy2uKYJtyoCeYMAPh9feAhvb+4+S8+h9PeKetgbd8Gphsw5s6TyvH7MgPEbAuM/PF4Al4+1yJqcMkNh7NOLAZuWf3s3c4+BBcuQuCesbAKefSsWgW3pP38Z+thfbMN2tRp0Gc+Qo7cgSgoIk4ZYbGyjPCtUtd1OMHQZTsWG8Xs0mQpFCTr4PI6+epevIjI8mVgNCbCf5yH1dYGj3IvekCfNx/Wju3UCzkwI1AUH7Fn0Wgrctm0Kqru6XqLE0+MYl6RvdPWieDsWTCIoUMWxuibEHjtdWh0NkzS1MWxdAe8iymoY8dCmz4D1q7vpUxR6hV6voRMH1QuZKZpKaEkuRxHfgn2YhLmz51FducOFCJR9FEKs6dOUe0cKJkM1Ak0i6bPJEXNkwAolFJcPgTcMFLiURWpIP2n7HgcHg0Yt/UqjIk1CC5eIvOdXbcOXSvfgeAmSpkVHIQNbb25Geq946A9+BC0KZNh79kn/StDKsSgS3kke+6KxiC9Uopo7mvyQKjuOcne7upC/usvodGLckMFzRZiFo9QEcNQowacQ0dg790LZXgVjPkLBvqz2AMXZLrkB72IPnAyNgI19yD8/AtFaW75Gvapc+CVSVkb2bXXNslUSvbbnVLSBvWLPnUKRBlJQZK0uB9U8aHkcxfzN9wIuyIO8/RZ9LxQB4eazm5sghIN/H0clOaP+J9zkO6culqwSAj24aOy85URVWCiBxSF7oOtWwVbxTdjjWpP9/jk2vdQvuuHYoqiISAh2UAjkAylszmfl8pSBKhCF1UmBydrFWX96EwEXn6F5Grs9rq7p4moeYmPS85rChXJpedXren4vb4enTOnwshkYfxxqThfBkch0kWgXns39YJFkp6O2MYNCK9ac0E1zdk+OXeIjEtFLkZAxmLzknEuWfmqr6pvxX/crQ/btAHxxiNQdI50ZQV+Inla6T4ZoTZpPIzaOmgPPNTLstkV/pXL9Yw6WgjHIQLS7zUAcS/3/zIQvaBphjW86m3q1hUVNORGEBBOnkaDSH/1zQg/W0f3wmyfbN70L7W8QXR9lHwI5v8JIA4oIg2CiW5UWFVVawKXWx8vW/8JOkg9nJxrsdjHbiq1ggZkDzgfdIX8D4DBv23kMxXVCUeq7URiEzVcAVfbl9DsOYdBNv8G8KcAAwDTx9/+WZnwhwAAAABJRU5ErkJggg==";
const _imports_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAw9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjZDMDhDNkI1MDg3MTFFOUIyMzlFNjY3QUNBMkZGODkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjZDMDhDNkE1MDg3MTFFOUIyMzlFNjY3QUNBMkZGODkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iODU4NDA5MDZDRkRGNTg4N0Q3RUVEREY0MkQ3NEY2OEMiIHN0UmVmOmRvY3VtZW50SUQ9Ijg1ODQwOTA2Q0ZERjU4ODdEN0VFRERGNDJENzRGNjhDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wWlJ6gAABuNJREFUeNpkVmuIXVcZXed1zz13HhlnMpnQOHmMzctJsNRaS9T6R1FLsSitBikWC+IDBaFGKWoFH6CoIKUWiSAtSG0SqpT6o/aBNW3ipG06Okkmk5lm0skkM3cyyWTuPfee1z57f659xyrFA4fN3efu77XWXt/nNJvNM0EQ3GCMSVw+Wht4nouqlIDvQSuDwuValvB9HyVXj6vh2hX6QFlA3AriQqESBJ3vtGeKoqhVKpUFJ8/ztlKqRtsoDY3TWK2i0CwrWE1LbO7xQOsojI+81B0nERRQDbAUKySoYFu1ALwAzbZCVA1Bm6Bx0Eni0njseR5EBD6d1EKNp5Y9bDoV4oMzVbxv3MPL7SoPKHT7LiJPgQfw4IyH4ckqPnK2gk9N1xBnObqrHlIa9/mdxm0wsWsj0lrDcexhg5kcuHs2woNDGk/uznBnn8btp318+a0uOFWF06WLPScj/KXh4vFtOQ6PZjibOLjvUhdct0SNZdKsRGBX2kUcx/UkSaTdbovotvzqopLtE0bENEVK7klTjjUS2X5SZP9UIbe8oeWB81qMafAbv3N96moum18VaWSplEksSZIK7UqapnXXeiLAcJkBIFjINEY81tTxkSXCt4J9vQrPvDfFk1MBchLglyNNOIYYNXmE6ybX8KTGlYIECNcifzsDiwEswEaMtY/+wMMqyA5TolojlpHCcurji1MhDu9T2BsZ/PBSN0FV6OMCAt4wDmqOhz6P7MpUh4XWrsXW76CtSEFuwtP4UL/Cw9cDLBQVvNIySBwHv5ivYnIVOLFeYU45eOKijz6/hpqbY19XgBNtB5tqGutrzFyq0GRTEFRIWQWn0YzrPaE35FQ0TrU9HFwM8MgVB7d2exjwNZ4nmOsc4PMbC8xp7rEcJnfwh3qAPe8qsSNw8SJBhmg8vtXgk30FQu61WwLH85YgZVbPirbcP8mCHxO5d6qU4ZNGDlw2UuYtqR0t5dkrzQ6geRpzTTrA7309l2+fSzq/N4+LfOFMKTeSCLv+UcqhJfu/TNpxq45SxfVdJwrpfaWQ46sFP8Ry4EImnzlbyH1TuXz8nzn3WvLNWS03HNey43UtU0kh861YtowV8vB8IjvGS5G8IWmZyg/ezAUvKPntXIsMS+r41nRe3/1qIVnJaEp6LhJZJG2HeDiiwWsqk0cXlOBF3sQxvkdFBseM5DqTn88XgudEHphNGQTfZC3DPy5m4h0rZYbld1+Ofezf5CL0SuSpR2kRbIwEo5GHj/WRVX6OJ+qkV0TCBHzJnGVicPyqwv0beJFC4K4ByknOG65JFNJ8/xBpSzZOZiHc7wwX+Ml5By+sVBF2U2u6HKxkDiYSg783eBGpSXcPEsSUxql/aAPrKoLbBgI8tmwNA8+vWEcBesgkUC7uPBNit2Pw0d7Mgt+s/3g2kZ6XjNw7o2U6bclXZnP50rlcvjebyT2nsw7AXztfytYxLTtfU3IqzeRS0pKbCfSRxZbsnVByvtWUv65ksuU1keGxUqabvOk6qftGV/H9bQVu6Uvx6/kIt05UsUo63j5gMBoWODIX4pmrLTw6UuLKQNkRNKu2t70RoAVmW/Ewn/l4/5kaq+fijvUaj2xqIwgjNFsFnLjVqgeuOxQGvMm+g0MrLr76ZoCbegTzpSDXPi7FgjtYphplm9zGv9qC6czD7l6NXt6Vy7mHLRTKP+3S2EDBQ+mhpTp9Zcm3TUKxSRjlIXL5B0eoJ4K/7bR7GspXGJ2oYSoBnt2Z4mgS4shCiEM3GdzTk8AhmD+9THI1fGzwUpa8SuO2+aw1J9fqtks5EKtFfI41ArwnIKiGGiUOQu6/tCNj+gbPtSL8+ZqP796o8bn+Fo0RZEb6gdDBxczFtbzCi1uwaf1Pi1yrRbbZ2E2WFFdzjYFOuwzIOEFaBHh3l+r0hm+MBbjA0vxsM6lkQjQpPXB99FPDUiO4biMO19T5HWrqMAPbJKyabiSIs4aEFwV2P0Q1hfG2j89ORfg0I68wo4fmumi4QB9xgqOwJC6zdTHIsuj8nWra6Qc2A9vRWAXcNVjgHAXuN4sRTrL1/uiCj5vZwfZ0CZ4eTfC77Rl+v+Dhw+M1PH1dMMkMD1yoYC8BX0e87ABgg7WV6XRK29Hoacg6cVmjalXjsUUPX1+IMEiFtF4Pjjj4RD8BLDyyyOC6+HjoLR8H6WCrE2C4ZnB4pI0+ZtDOTUf6rXG246X/ThU2HdWZGsimoERdBVhOSkZGIImJZtkSjiY+sYmcsnNjLzZLOuNgUMs6mMWtEiExsMR5e6pw/m8uYno+yxVaI6SgFIYqsRZR8J8BweVoA6MRVdzOSCNsr3Fh2yS1TK3NRTZoOxf9W4ABANBlUsf5QW/RAAAAAElFTkSuQmCC";
const _imports_2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpERkNDQ0YzODUwODcxMUU5QjZBQ0UwRjNCNjY5RDVGMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpERkNDQ0YzOTUwODcxMUU5QjZBQ0UwRjNCNjY5RDVGMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkRGQ0NDRjM2NTA4NzExRTlCNkFDRTBGM0I2NjlENUYzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkRGQ0NDRjM3NTA4NzExRTlCNkFDRTBGM0I2NjlENUYzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HLNmugAABnxJREFUeNqEVllsXFcZ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";
const _sfc_main = {
  data() {
    return {
      layoutsidebar: false,
      activeItem: "home",
      layoutType: "ltr",
      modalShow: false
    };
  },
  computed: {
    ...mapState(useLayoutStore, {
      layout: "layout"
    })
  },
  created() {
    useLayoutStore().set();
  },
  methods: {
    openlayoutSidebar() {
      this.layoutsidebar = true;
    },
    closelayoutSidebar() {
      this.layoutsidebar = false;
    },
    isActive: function(menuItem) {
      return this.activeItem === menuItem;
    },
    opensettingcontent: function(menuItem) {
      if (this.activeItem === menuItem) {
        this.activeItem = "";
      } else {
        this.activeItem = menuItem;
      }
    },
    customizeLayoutType(val) {
      useLayoutStore().setLayoutType(val);
      this.layoutType = val;
    },
    selectedColor: function(menuItem) {
      return this.activeColor === menuItem;
    },
    customizeThemeColor(val) {
      useLayoutStore().setColorScheme(val.target.value);
      document.documentElement.style.setProperty("--theme-deafult", event.target.value);
    },
    customizeLayoutVersion() {
      useLayoutStore().setLayoutVersion();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_nuxt_link = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)}><a href="javascript:void(0)"><div class="setting-sidebar" id="setting-icon"><div><i class="fa fa-cog" aria-hidden="true"></i></div></div></a><div id="setting_box" class="${ssrRenderClass([{ opensetting: $data.layoutsidebar }, "setting-box"])}"><a href="javascript:void(0)" class="overlay"></a><div class="setting_box_body"><div><div class="sidebar-back text-left"><i class="fa fa-angle-left pe-2" aria-hidden="true"></i> Back </div></div><div class="setting-body"><div class="setting-title"><h4> layout <span class="according-menu"></span></h4></div><div class="${ssrRenderClass([{ opensubmenu: $options.isActive("layout") }, "setting-contant"])}"><div class="row demo-section"><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo1"></div><div class="demo-text"><h4>Fashion</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/fashion" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo44"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>gym</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/gym" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo45"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>tools</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/tools" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo48"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>pets</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/pets" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo51"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>jewellery</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/jewellery" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo2"></div><div class="demo-text"><h4>Fashion</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/fashion-2" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo3"></div><div class="demo-text"><h4>Fashion</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/fashion-3" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo4"></div><div class="demo-text"><h4>Shoes</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/shoes" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo5"></div><div class="demo-text"><h4>Bags</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/bags" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo6"></div><div class="demo-text"><h4>Watch</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/watch" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo7"></div><div class="demo-text"><h4>Kids</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/kids" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo8"></div><div class="demo-text"><h4>Flower</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/flower" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo10"></div><div class="demo-text"><h4>Vegetables</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/vegetables" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo11"></div><div class="demo-text"><h4>Beauty</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/beauty" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo16"></div><div class="demo-text"><h4>Electronic</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/electronics-1" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects mb-0"><div class="set-position"><div class="layout-container demo21"></div><div class="demo-text"><h4>Furniture</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/shop/furniture" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div></div></div><div class="setting-title"><h4> shop <span class="according-menu"></span></h4></div><div class="${ssrRenderClass([{ opensubmenu: $options.isActive("shop") }, "setting-contant"])}"><div class="row demo-section"><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo22"></div><div class="demo-text"><h4>left sidebar</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/leftsidebar/all" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo24"></div><div class="demo-text"><h4>right sidebar</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/right-sidebar" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo23"></div><div class="demo-text"><h4>no sidebar</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/no-sidebar" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo25"></div><div class="demo-text"><h4>popup</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/sidebar-popup" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo52"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>metro</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/metro" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo53"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>full width</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/full-width" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo54"></div><div class="demo-text"><h4>three grid</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/three-grid" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects mb-0"><div class="set-position"><div class="layout-container demo55"></div><div class="demo-text"><h4>six grid</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/six-grid" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects mb-0"><div class="set-position"><div class="layout-container demo56"></div><div class="demo-text"><h4>list view</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/collection/list-view" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div></div></div><div class="setting-title"><h4> product <span class="according-menu"></span></h4></div><div class="${ssrRenderClass([{ opensubmenu: $options.isActive("product") }, "setting-contant"])}"><div class="row demo-section"><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo40"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>four image</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/four-image" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo33"></div><div class="demo-text"><h4>left sidebar</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/sidebar/1" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo36"></div><div class="demo-text"><h4>right sidebar</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/sidebar/right-sidebar" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo34"></div><div class="demo-text"><h4>no sidebar</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/sidebar/no-sidebar" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo41"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>bundle</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/bundle-product" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo32"></div><div class="demo-text"><h4>left image</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/thumbnail-image/left-image" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo35"></div><div class="demo-text"><h4>right image</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/thumbnail-image/right-image" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo31"><div class="ribbon-1"><span>n</span><span>e</span><span>w</span></div></div><div class="demo-text"><h4>image outside</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/thumbnail-image/image-outside" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo27"></div><div class="demo-text"><h4>3-col left</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/three-column/thumbnail-left" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo28"></div><div class="demo-text"><h4>3-col right</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/three-column/thumbnail-right" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div><div class="col-sm-6 col-12 text-center demo-effects"><div class="set-position"><div class="layout-container demo29"></div><div class="demo-text"><h4>3-col bottom</h4><div class="btn-group demo-btn" role="group" aria-label="Basic example">`);
  _push(ssrRenderComponent(_component_nuxt_link, {
    to: { path: "/product/three-column/thumbnail-bottom" },
    class: "btn new-tab-btn",
    target: "_blank"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Preview`);
      } else {
        return [
          createTextVNode("Preview")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div></div></div></div><div class="setting-title"><h4> color option <span class="according-menu"></span></h4></div><div class="${ssrRenderClass([{ opensubmenu: $options.isActive("color option") }, "setting-contant"])}"><ul class="color-box"><li><input id="colorPicker1" type="color"${ssrRenderAttr("value", _ctx.layout.config.color)} name="Background"><span>theme deafult color</span></li></ul></div><div class="setting-title"><h4> RTL <span class="according-menu"></span></h4></div><div class="${ssrRenderClass([{ opensubmenu: $options.isActive("rtl") }, "setting-contant"])}"><ul class="setting_buttons"><li class="${ssrRenderClass($data.layoutType == "ltr" ? "active" : "")}" id="ltr_btn"><a href="javascript:void(0)" class="btn setting_btn">LTR</a></li><li class="${ssrRenderClass($data.layoutType == "rtl" ? "active" : "")}" id="rtl_btn"><a href="javascript:void(0)" class="btn setting_btn">RTL</a></li></ul></div><div class="buy_btn"><a href="https://themeforest.net/item/multikart-responsive-ecommerce-html-template/22809967?s_rank=1" target="_blank" class="btn btn-block purchase_btn"><i class="fa fa-shopping-cart" aria-hidden="true"></i> purchase Multikart now! </a><a href="https://themeforest.net/item/multikart-responsive-angular-ecommerce-template/22905358?s_rank=3" target="_blank" class="btn btn-block purchase_btn"><img${ssrRenderAttr("src", _imports_0)} alt class="img-fluid"> Multikart Angular </a><a href="https://themeforest.net/item/multikart-responsive-react-ecommerce-template/23067773?s_rank=2" target="_blank" class="btn btn-block purchase_btn"><img${ssrRenderAttr("src", _imports_1)} alt class="img-fluid"> Multikart React </a><a href="https://themeforest.net/item/multikart-multipurpose-shopify-sections-theme/23093831?s_rank=1" target="_blank" class="btn btn-block purchase_btn"><img${ssrRenderAttr("src", _imports_2)} alt class="img-fluid"> Multikart Shopify </a></div></div></div></div><div class="sidebar-btn dark-light-btn"><div class="dark-light"><div class="theme-layout-version">Dark</div></div></div><div class="addcart_btm_popup" id="fixed_cart_icon"><a href="#" class="fixed_cart"><i class="fa fa-clone" aria-hidden="true" title="Configuration" data-bs-toggle="modal" data-bs-target="#bv-modal-example"></i></a></div><div class="modal fade bd-example-modal-lg theme-modal" id="bv-modal-example" aria-hidden="true" tabindex="-1" role="dialog" aria-labelledby="modal-cartLabel"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content quick-view-modal"><div class="modal-body"><div class="bg-white position-relative"><button class="close btn-close" type="button" data-bs-dismiss="modal"><span>\xD7</span></button><div class="modal-header modal-copy-header"><h5 class="headerTitle mb-0">Customizer configuration</h5></div><div class="d-block config-popup"><p>To replace our design with your desired theme. Please do configuration as mention in </p><p><b> Path : data &gt; config.json </b></p><pre><code>${ssrInterpolate(_ctx.layout)}</code></pre></div></div></div></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/widgets/layoutSetting.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
const __nuxt_component_2 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
export {
  __nuxt_component_1 as _,
  __nuxt_component_2 as a
};
//# sourceMappingURL=client-only.e97a046e.js.map
