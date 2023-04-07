<template>
  <div>
    <Breadcrumbs title="Checkout" />
   <paymenPage/>
  </div>
</template>
<script>
import Breadcrumbs from '../../../components/widgets/breadcrumbs'
import paymenPage from '../../../components/paymentPage.vue'
export default{
components:{
  Breadcrumbs,
  paymenPage
}
}
</script>
