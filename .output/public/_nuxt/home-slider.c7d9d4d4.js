import{q as h,o as t,l as n,s as a,y as e,z as o,v,x as i,F as f,E as g,c as w,I as b,p as x,t as l,A as S,C as B}from"./entry.2451ccf6.js";import{a as k,S as y}from"./swiper.min.fed330f3.js";import{N}from"./navigation.min.bc300a5d.js";import{B as C}from"./breadcrumbs.94e06462.js";const E={components:{Swiper:k,SwiperSlide:y,Breadcrumbs:C},data(){return{swiperOption:{loop:!0,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}},items:[{imagepath:"/images/home-banner/1.jpg",title:"welcome to fashion",subtitle:"women fashion",alignclass:"p-left"},{imagepath:"/images/home-banner/1.jpg",title:"welcome to fashion",subtitle:"men fashion",alignclass:"p-left"}]}},setup(){return{modules:[N]}}},V={class:"slide-1 home-slider"},z={class:"container"},F={class:"row"},j={class:"col"},I={class:"slider-contain"},$=v('<div class="container section-b-space section-t-space"><div class="row"><div class="col"><div class="card"><h5 class="card-header">Classes</h5><div class="card-body"><h5 class="card-title">For Parallax Image - .parallax</h5><h5>contain-align - .text-left, .text-center, .text-end</h5><h5>contain-position - .p-left, .p-center, .p-right</h5></div></div></div></div></div>',1);function q(A,D,L,r,c,O){const d=i("Breadcrumbs"),p=B,m=i("swiper-slide"),_=i("swiper");return t(),n("div",null,[a(d,{title:"Slider Element"}),e("section",null,[e("div",V,[a(_,{loop:"true",navigation:!0,modules:r.modules,class:"swiper-wrapper"},{default:o(()=>[(t(!0),n(f,null,g(c.items,(s,u)=>(t(),w(m,{class:"swiper-slide",key:u},{default:o(()=>[e("div",{class:b(["home text-center",s.alignclass]),style:x({"back  ground-image":"url("+s.imagepath+")"})},[e("div",z,[e("div",F,[e("div",j,[e("div",I,[e("div",null,[e("h4",null,l(s.title),1),e("h1",null,l(s.subtitle),1),a(p,{to:{path:"/c  ollection/left-sidebar"},class:"btn btn-solid"},{default:o(()=>[S("shop now")]),_:1})])])])])])],6)]),_:2},1024))),128))]),_:1},8,["modules"])])]),$])}const J=h(E,[["render",q]]);export{J as default};