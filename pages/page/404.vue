<template>
  <div>
    <Breadcrumbs title="404" />
    <section class="p-0">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="error-section">
              <h1>404</h1>
              <h2>page not found</h2>
              <nuxt-link :to="{ path: '/shop/fashion'}" class="btn btn-solid">back to home</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>

import Breadcrumbs from '../../components/widgets/breadcrumbs'
export default {
  components: {
   
    Breadcrumbs
  }
}
</script>
