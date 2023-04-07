<template>
<div>
    <Breadcrumbs title="search" />
    <searched />
    <section class="section-b-space ratio_asos pt-0" v-if="searchItems.length">
        <div class="container">
            <div class="row search-product">
                <div class="col-xl-2 col-md-4 col-sm-6" v-for="(product, index) in searchItems" :key="index">
                    <div class="product-box">
                        {{product.title}}
                        <productBox1 :product="product" :index="index" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script>
import {
    mapState
} from 'pinia'
import {
    useProductStore
} from '~~/store/products'
import Breadcrumbs from '../../components/widgets/breadcrumbs'
import searched from '../../components/searched.vue'
import productBox1 from '../../components/product-box/product-box1'

export default {
    components: {
        Breadcrumbs,
        productBox1,
        searched
    },
    computed: {
        ...mapState(useProductStore, {
            searchItems: 'searchProducts'
        })
    },
}
</script>
