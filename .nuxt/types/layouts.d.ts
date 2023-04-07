import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "custom" | "default"
declare module "/home/sp07/vue/templatian/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}