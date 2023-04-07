<template>
  <!--  logo section -->
  <section class="section-b-space">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="slide-6 no-arrow">
            <swiper  loop="true" :breakpoints="swiperOption.breakpoints" :slidesPerView="6" :slideSpeed="300"  class="swiper-wrapper">

                <swiper-slide class="swiper-slide" v-for="(item, index) in items" :key="index">
                  <div>
                    <div class="logo-block">
                      <a href="#">
                        <img :src="item.img" alt>
                      </a>
                    </div>
                  </div>
                </swiper-slide>
                </swiper>
              </div>
        </div>
      </div>
    </div>
  </section>
  <!--  logo section end-->
</template>

<script>
import {
    Swiper,
    SwiperSlide
} from "swiper/vue";
import 'swiper/css';
export default {
  data() {
    return {
      items: [
        { img: '/images/logos/1.png' },
        { img: '/images/logos/2.png' },
        { img: '/images/logos/3.png' },
        { img: '/images/logos/4.png' },
        { img: '/images/logos/5.png' },
        { img: '/images/logos/6.png' },
        { img: '/images/logos/7.png' },
        { img: '/images/logos/8.png' }
      ],
      swiperOption: {
        dots: false,
        loop: true,
        slideSpeed: 300,
        slidesPerView: 6,
        breakpoints: {
          1367: {
            slidesPerView: 5,
            loop: true
          },
          1024: {
            slidesPerView: 4,
            loop: true
          },
          767: {
            slidesPerView: 3,
            loop: true
          },
          480: {
            slidesPerView: 2
          },
          0: {
            slidesPerView: 2,
          } 
        }
      }
    }
  },
  components:{Swiper, SwiperSlide}
}
</script>
