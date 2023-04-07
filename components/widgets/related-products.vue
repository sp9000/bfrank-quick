<template>
  <div>
    <section class="ratio_asos section-b-space">
      <div class="container">
        <div class="col-12 product-related">
          <h2>{{ title }}</h2>
        </div>

        <div class="row g-sm-4 g-3">
          <div class="col-xl-2 col-md-4 col-6" v-for="(product, index) in productslist.slice(1, 7)" :key="index">
            <div class="product-box">
              <productBox1 @opencartmodel="showCart" @showCompareModal="showCoampre" @openquickview="showQuickview"
                :product="product" :index="index" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <quickviewModel :openModal="showquickviewmodel" :productData="quickviewproduct" @closeView="closeViewModal" />
    <compareModel :openCompare="showcomparemodal" :productData="comapreproduct" @closeCompare="closeCompareModal" />
    <cartModel :openCart="showcartmodal" :productData="cartproduct" @closeCart="closeCartModal" :products="products" />
  </div>
</template>

<script>
import { useProductStore } from '~~/store/products'
import productBox1 from '../product-box/product-box1.vue'
import cartModel from '../cart-modal/cart-modal-popup.vue'
import quickviewModel from './quickview.vue'
import compareModel from './compare-popup.vue'
export default {
  props: ['productTYpe', 'productId'],
  components: {
    productBox1,
    quickviewModel,
    compareModel,
    cartModel
  },
  data() {
    return {
      title: 'Related Products',
      products: [],
      showquickviewmodel: false,
      showcomparemodal: false,
      showcartmodal: false,
      quickviewproduct: {},
      comapreproduct: {},
      cartproduct: {},
      dismissSecs: 5,
      dismissCountDown: 0
    }
  },
  computed: {

    productslist: () => useProductStore().productslist
  },

  methods: {


    productsArray: function () {
      this.productslist.map((item) => {
        if (item.type === this.productTYpe) {
          if (item.id !== this.productId) {
            this.products.push(item)
          }
        }

      })
    },
    alert(item) {
      this.dismissCountDown = item
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
    showCart(item, productData) {
      this.showcartmodal = item
      this.cartproduct = productData
    },
    closeCartModal(item) {
      this.showcartmodal = item
    },
    closeViewModal(item) {
      this.showquickviewmodel = item
    }
  }
}
</script>
