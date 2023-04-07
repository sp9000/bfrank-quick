<template>
  <div>
    <nuxt id="body-content" />
    <WidgetsLayoutSetting />
    <ClientOnly>
      <div class="tap-top top-cls" v-scroll-to="'#body-content'">
        <div>
          <i class="fa fa-angle-double-up"></i>
        </div>
      </div>
    </ClientOnly>
    <slot />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'MultiKart Ecommerce | Vuejs Shopping Theme'
    }
  },
  components: {
  },
}
</script>