<template>
  <div>
   
    <Breadcrumbs title="Blog" />
    <section class="section-b-space blog-page ratio2_3">
      <div class="container">
        <div class="row">
          <!--Blog List start-->
          <div class="col-12">
          <BlogList />
          </div>
          <!--Blog List start-->
        </div>
      </div>
    </section>

  </div>
</template>
<script>
import Breadcrumbs from '../../components/widgets/breadcrumbs'
import BlogList from '../../components/blog/blog-list.vue'

export default {
  components: {
   
    Breadcrumbs,
    BlogList,
   
  }
}
</script>
