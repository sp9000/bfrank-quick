<template>
  <div>
    <Slider />
    <About />
    <ProductSlider :products="products" :category="category" @openQuickview="showQuickview" @openCompare="showCoampre"
      @openCart="showCart" />
    <VideoTutorial />
    <TopProductslider :products="products" @openQuickview="showQuickview" @openCompare="showCoampre"
      @openCart="showCart" />
      <Blog :blog="blog" />
      <Instagram />
    <quickviewModel :openModal="showquickviewmodel" :productData="quickviewproduct" @closeView="closeViewModal" />
    <compareModal :openCompare="showcomparemodal" :productData="comapreproduct" @closeCompare="closeCompareModal" />
    <cartModelPopup :openCart="showcartmodal" @closeCart="closeCart" />
    <newsletterModel />
  </div>
</template>
<script>
import { mapState } from 'pinia'
import { useProductStore } from '~~/store/products'
import { useBlogStore } from "~~/store/blog";

import quickviewModel from '../../../components/widgets/quickview'
import compareModel from '../../../components/widgets/compare-popup'
import cartModalPopup from '../../../components/cart-modal/cart-modal-popup.vue'
import newsletterModel from '../../../components/widgets/newsletter-popup'
import Slider from '../../../components/shop/beauty/slider.vue'
import About from '../../../components/shop/beauty/about'
import ProductSlider from '../../../components/shop/beauty/product-slider'
import VideoTutorial from '../../../components/shop/beauty/video-tutorial'
import TopProductslider from '../../../components/shop/beauty/top-product-slider'
import Instagram from '../../../components/shop/beauty/instagram'
export default {
  components: {
    Slider,
    About,
    ProductSlider,
    VideoTutorial,
    TopProductslider,
    Instagram,
    quickviewModel,
    compareModel,
    cartModalPopup,
    newsletterModel
  },
  data() {
    return {
      blog:[],

      products: [],
      category: [],
      showquickviewmodel: false,
      showcomparemodal: false,
      showcartmodal: false,
      quickviewproduct: {},
      comapreproduct: {}
    }
  },
  computed: {
    ...mapState(useProductStore, {
      productslist: 'productslist'
    }),
    ...mapState(useBlogStore,{
          bloglist: 'bloglist'
    }),
  },
  mounted() {
    this.productsArray()
    this.blogArray()

  },
  methods: {
    productsArray: function () {
      this.productslist.map((item) => {
        if (item.type === 'beauty') {
          this.products.push(item)
          item.collection.map((i) => {
            const index = this.category.indexOf(i)
            if (index === -1) this.category.push(i)
          })
        }
      })
    },
    blogArray: function () {
      this.bloglist.map((item) => {
        if (item.type === 'beauty') {
          this.blog.push(item)
          
        }
      })
    },
    showQuickview(item, productData) {
      this.showquickviewmodel = item
      this.quickviewproduct = productData
    },
    showCoampre(item, productData) {
      this.showcomparemodal = item
      this.comapreproduct = productData
    },
    closeCompareModal(item) {
      this.showcomparemodal = item
    },
    showCart(item) {
      this.showcartmodal = item
    },
    closeCart(item) {
      this.showcartmodal = item
    },
    closeViewModal(item) {
      this.showquickviewmodel = item
    }
  }
}
</script>
