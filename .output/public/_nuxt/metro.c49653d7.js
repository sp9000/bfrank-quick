import{D as T,L as f,i as d,o as v,l as g,s as a,u as e,y as t,z as i,t as p,N as V,C as q}from"./entry.c7af61af.js";import{_ as S}from"./2.25ea6962.js";import{U as $}from"./index.158c3c42.js";import{B as A}from"./breadcrumbs.92de4fe4.js";import{q as N,c as j}from"./compare-popup.999a347b.js";import{c as P}from"./cart-modal-popup.33281dbc.js";import"./swiper.min.0fe9c4e7.js";const Q={class:"section-b-space"},U={class:"collection-wrapper"},W={class:"container"},z={class:"row"},E={class:"collection-content col"},R={class:"page-main-content"},F=t("div",{class:"top-banner-wrapper"},[t("a",{href:"#"},[t("img",{src:S,class:"img-fluid bg-img",alt:""})]),t("div",{class:"top-banner-content small-section pb-0"},[t("h4",null,"fashion"),t("h5",null,"Lorem Ipsum is simply dummy text of the printing and typesetting industry."),t("p",null,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")])],-1),G={class:"collection-product-wrapper"},H={class:"section-t-space portfolio-section metro-section port-col"},J={class:"col isotopeSelector item m-0"},K={class:"product-box"},O={class:"img-wrapper"},X={class:"front"},Y=["src","id","alt"],Z={class:"cart-info cart-wrap"},tt=["onClick"],ot=t("i",{class:"ti-shopping-cart"},null,-1),et=[ot],st=["onClick"],at=["onClick"],it=t("i",{class:"ti-search","aria-hidden":"true"},null,-1),nt=[it],ct=["onClick"],rt=t("i",{class:"ti-reload","aria-hidden":"true"},null,-1),lt=[rt],dt={class:"product-detail"},wt={__name:"metro",setup(pt){let{productslist:C,currency:u,changeCurrency:ut}=T(f()),_=[],n=d(!1),c=d(!1),y=d(!1),h={},m={},w={};b();function k(o){return"/images/"+o}function b(){C.value.map(o=>{o.type==="metro"&&_.push(o)})}function M(o){n.value=!0,h=o}function x(){n.value=!1}function D(o){c.value=!0,m=o}function I(o){c.value=!1}function L(o){f().addToWishlist(o)}function B(o){V().addToCart(o)}return(o,_t)=>{const r=q;return v(),g("div",null,[a(e(A),{title:"collection"}),t("section",Q,[t("div",U,[t("div",W,[t("div",z,[t("div",E,[t("div",R,[F,t("div",G,[t("div",H,[a(e($),{items:e(_),padding:16,"column-width":300,gap:15},{default:i(({item:s})=>[t("div",J,[t("div",K,[t("div",O,[t("div",X,[a(r,{to:{path:"/product/sidebar/"+s.id}},{default:i(()=>[(v(),g("img",{src:k(s.images[0].src),id:s.id,class:"img-fluid bg-img",alt:s.title,key:o.index},null,8,Y))]),_:2},1032,["to"])]),t("div",Z,[t("button",{title:"Add to cart",onClick:l=>B(s),variant:"primary"},et,8,tt),a(r,{to:{path:"/page/account/wishlist"}},{default:i(()=>[t("i",{class:"ti-heart","aria-hidden":"true",onClick:l=>L(s)},null,8,st)]),_:2},1024),t("a",{href:"javascript:void(0)",title:"Quick View",onClick:l=>M(s),variant:"primary"},nt,8,at),t("a",{href:"javascript:void(0)",title:"Comapre",onClick:l=>D(s),variant:"primary"},lt,8,ct)])]),t("div",dt,[a(r,{to:{path:"/product/sidebar/"+s.id}},{default:i(()=>[t("h6",null,p(s.title),1)]),_:2},1032,["to"]),t("h4",null,p(e(u).symbol)+p(s.price*e(u).curr),1)])])])]),_:1},8,["items"])])])])])])])])]),a(e(N),{openModal:e(n),productData:e(h),onCloseView:x},null,8,["openModal","productData"]),a(e(j),{openCompare:e(c),productData:e(m),onCloseCompare:I},null,8,["openCompare","productData"]),a(e(P),{openCart:e(y),productData:e(w),onCloseCart:o.closeCartModal},null,8,["openCart","productData","onCloseCart"])])}}};export{wt as default};