import{q as S,L as V,o as r,l as a,s as d,y as t,F as g,E as _,B as f,t as m,I as v,z as F,x as h,C as B,A as w,G as D,H as I,J as L,v as T}from"./entry.c7af61af.js";import{_ as C}from"./product-box1.cc4b4de7.js";import{s as j,u}from"./collection-sidebar.322dc33e.js";import{B as N}from"./breadcrumbs.92de4fe4.js";import{q as O,c as R}from"./compare-popup.999a347b.js";import{c as z}from"./cart-modal-popup.33281dbc.js";import{_ as E}from"./2.25ea6962.js";import{_ as G,a as Q,b as Z,c as H}from"./6.eeb7c80f.js";import"./swiper.min.0fe9c4e7.js";import"./navigation.min.2b5e32e1.js";const J={components:{Breadcrumbs:N,productBox1:C,sidebar:j,quickviewModel:O,compareModel:R,cartModel:z},data(){return{bannerimagepath:"/images/side-banner.png",col2:!1,col3:!1,col4:!1,col6:!0,listview:!1,priceArray:[],allfilters:[],items:[],current:1,paginate:18,paginateRange:3,pages:[],paginates:"",showquickviewmodel:!1,showcomparemodal:!1,showcartmodal:!1,quickviewproduct:{},comapreproduct:{},cartproduct:{},dismissSecs:5,dismissCountDown:0}},computed:{filterProduct(){return u().filterProducts},tags(){return u().setTags},curr(){return V().changeCurrency}},mounted(){this.updatePaginate(1)},methods:{getCategoryProduct(e){return this.productslist.filter(s=>{if(s.collection.find(c=>c===e))return s})},getImgUrl(e){return"/images/"+e},discountedPrice(e){return(e.price-e.price*e.discount/100)*this.curr.curr},onChangeSort(e){u().sortProducts(e.target.value)},gridView(){this.col4=!0,this.col2=!1,this.col3=!1,this.col6=!1,this.listview=!1},listView(){this.listview=!0,this.col4=!1,this.col2=!1,this.col3=!1,this.col6=!1},grid2(){this.col2=!0,this.col3=!1,this.col4=!1,this.col6=!1,this.listview=!1},grid3(){this.col3=!0,this.col2=!1,this.col4=!1,this.col6=!1,this.listview=!1},grid4(){this.col4=!0,this.col2=!1,this.col3=!1,this.col6=!1,this.listview=!1},grid6(){this.col6=!0,this.col2=!1,this.col3=!1,this.col4=!1,this.listview=!1},removeTags(e){this.allfilters.splice(this.allfilters.indexOf(e),1)},removeAllTags(){this.allfilters.splice(0,this.allfilters.length)},getCategoryFilter(){this.updatePaginate(1),u().getCategoryFilter(this.$route.params.id)},allfilter(e){this.allfilters=e,u().setTags(e),this.getPaginate(),this.updatePaginate(1)},pricefilterArray(e){this.getCategoryFilter(),u().priceFilter(e),this.getPaginate(),this.updatePaginate(1)},getPaginate(){this.paginates=Math.round(this.filterProduct.length/this.paginate),this.pages=[];for(let e=0;e<this.paginates;e++)this.pages.push(e+1)},setPaginate(e){return this.current===1?e<this.paginate:e>=this.paginate*(this.current-1)&&e<this.current*this.paginate},updatePaginate(e){this.current=e;let s=0,c=0;this.current<this.paginateRange-1?(s=1,c=s+this.paginateRange-1):(s=this.current-1,c=this.current+1),s<1&&(s=1),c>this.paginates&&(c=this.paginates),this.pages=[];for(let p=s;p<=c;p++)this.pages.push(p);return this.pages},alert(e){this.dismissCountDown=e},showQuickview(e,s){this.showquickviewmodel=e,this.quickviewproduct=s},showCoampre(e,s){this.showcomparemodal=e,this.comapreproduct=s},closeCompareModal(e){this.showcomparemodal=e},showCart(e,s){this.showcartmodal=e,this.cartproduct=s},closeCartModal(e){this.showcartmodal=e},closeViewModal(e){this.showquickviewmodel=e}}},U={class:"section-b-space ratio_asos"},K={class:"collection-wrapper"},W={class:"container"},X={class:"row"},Y={class:"col-lg-3"},$={class:"collection-content col"},tt={class:"page-main-content"},et={class:"row"},st={class:"col-sm-12"},ot=t("div",{class:"top-banner-wrapper"},[t("a",{href:"#"},[t("img",{src:E,class:"img-fluid",alt:""})]),t("div",{class:"top-banner-content small-section"},[t("h4",null,"fashion"),t("h5",null,"Lorem Ipsum is simply dummy text of the printing and typesetting industry."),t("p",null,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")])],-1),it={class:"product-filter-tags"},lt={href:"javascript:void(0)",class:"filter_tag"},rt=["onClick"],at={key:0,class:"clear_filter"},ct={class:"collection-product-wrapper"},nt={class:"product-top-filter"},dt={class:"row"},ut={class:"col-12"},ht={class:"product-filter-content"},pt={class:"search-count"},mt={class:"collection-view"},gt=t("i",{class:"fa fa-th grid-layout-view"},null,-1),_t=[gt],ft=t("i",{class:"fa fa-list-ul list-layout-view"},null,-1),vt=[ft],wt={class:"collection-grid-view"},Ct={class:"product-page-filter"},kt=T('<option value="all">Sorting Items</option><option value="a-z">Alphabetically, A-Z</option><option value="z-a">Alphabetically, Z-A</option><option value="low">price, low to high</option><option value="high">price, high to low</option>',5),yt=[kt],Pt={class:"row"},bt={class:"col-sm-12"},xt={key:0,class:"text-center section-t-space section-b-space"},Mt=["src"],At=t("h3",{class:"mt-3"},"Sorry! Couldn't find the product you were looking For!!!",-1),qt={class:"col-12 mt-3"},St={class:"product-box"},Vt={key:0,class:"product-pagination mb-0"},Ft={class:"theme-paggination-block"},Bt={class:"row"},Dt={class:"col-xl-6 col-md-6 col-sm-12"},It={"aria-label":"Page navigation"},Lt={class:"pagination"},Tt={class:"page-item"},jt=t("span",{"aria-hidden":"true"},[t("i",{class:"fa fa-chevron-left","aria-hidden":"true"})],-1),Nt=[jt],Ot=["onClick"],Rt={class:"page-item"},zt=t("span",{"aria-hidden":"true"},[t("i",{class:"fa fa-chevron-right","aria-hidden":"true"})],-1),Et=[zt],Gt={class:"col-xl-6 col-md-6 col-sm-12"},Qt={class:"product-search-count-bottom"};function Zt(e,s,c,p,l,o){const k=h("Breadcrumbs"),y=h("sidebar"),P=B,b=C,x=h("quickviewModel"),M=h("compareModel"),A=h("cartModel");return r(),a("div",null,[d(k,{title:"collection"}),t("section",U,[t("div",K,[t("div",W,[t("div",X,[t("div",Y,[d(y,{onAllFilters:o.allfilter,onPriceVal:o.pricefilterArray,onCategoryfilter:o.getCategoryFilter},null,8,["onAllFilters","onPriceVal","onCategoryfilter"])]),t("div",$,[t("div",tt,[t("div",et,[t("div",st,[ot,t("ul",it,[(r(!0),a(g,null,_(l.allfilters,(i,n)=>(r(),a("li",{class:"me-1",key:n},[t("a",lt,[w(m(i),1),t("i",{class:"ti-close",onClick:q=>o.removeTags(i)},null,8,rt)])]))),128)),l.allfilters.length>0?(r(),a("li",at,[t("a",{href:"javascript:void(0)",class:"clear_filter",onClick:s[0]||(s[0]=i=>o.removeAllTags())},"Clear all")])):f("",!0)]),t("div",ct,[t("div",nt,[t("div",dt,[t("div",ut,[t("div",ht,[t("div",pt,[t("h5",null,"Showing Products 1-12 of "+m(o.filterProduct.length)+" Result",1)]),t("div",mt,[t("ul",null,[t("li",{onClick:s[1]||(s[1]=i=>o.gridView())},_t),t("li",{onClick:s[2]||(s[2]=i=>o.listView())},vt)])]),t("div",wt,[t("ul",null,[t("li",null,[t("img",{src:G,onClick:s[3]||(s[3]=i=>o.grid2()),class:"product-2-layout-view"})]),t("li",null,[t("img",{src:Q,onClick:s[4]||(s[4]=i=>o.grid3()),class:"product-3-layout-view"})]),t("li",null,[t("img",{src:Z,onClick:s[5]||(s[5]=i=>o.grid4()),class:"product-4-layout-view"})]),t("li",null,[t("img",{src:H,onClick:s[6]||(s[6]=i=>o.grid6()),class:"product-6-layout-view"})])])]),t("div",Ct,[t("select",{onChange:s[7]||(s[7]=i=>o.onChangeSort(i))},yt,32)])])])])]),t("div",{class:v(["product-wrapper-grid",{"list-view":l.listview==!0}])},[t("div",Pt,[t("div",bt,[o.filterProduct.length==0?(r(),a("div",xt,[t("img",{src:"/images/empty-search.jpg",class:"img-fluid",alt:""},null,8,Mt),At,t("div",qt,[d(P,{to:{path:"/"},class:"btn btn-solid"},{default:F(()=>[w("continue shopping")]),_:1})])])):f("",!0)]),(r(!0),a(g,null,_(o.filterProduct,(i,n)=>D((r(),a("div",{class:v(["col-grid-box",{"col-xl-3 col-md-4 col-6":l.col4==!0,"col-md-4 col-6":l.col3==!0,"col-6":l.col2==!0,"col-xxl-2 col-xl-3 col-md-4 col-6":l.col6==!0,"col-12":l.listview==!0}]),key:n},[t("div",St,[d(b,{onOpencartmodel:o.showCart,onShowCompareModal:o.showCoampre,onOpenquickview:o.showQuickview,onAlertseconds:o.alert,product:i,index:n},null,8,["onOpencartmodel","onShowCompareModal","onOpenquickview","onAlertseconds","product","index"])])],2)),[[I,o.setPaginate(n)]])),128))])],2),o.filterProduct.length>l.paginate?(r(),a("div",Vt,[t("div",Ft,[t("div",Bt,[t("div",Dt,[t("nav",It,[t("ul",Lt,[t("li",Tt,[t("a",{class:"page-link",href:"javascript:void(0)",onClick:s[8]||(s[8]=i=>o.updatePaginate(l.current-1))},Nt)]),(r(!0),a(g,null,_(this.pages,(i,n)=>(r(),a("li",{class:v(["page-item",{active:i==l.current}]),key:n},[t("a",{class:"page-link",href:"javascrip:void(0)",onClick:L(q=>o.updatePaginate(i),["prevent"])},m(i),9,Ot)],2))),128)),t("li",Rt,[t("a",{class:"page-link",href:"javascript:void(0)",onClick:s[9]||(s[9]=i=>o.updatePaginate(l.current+1))},Et)])])])]),t("div",Gt,[t("div",Qt,[t("h5",null,"Showing Products 1-12 of "+m(o.filterProduct.length)+" Result",1)])])])])])):f("",!0)])])])])])])])])]),d(x,{openModal:l.showquickviewmodel,productData:l.quickviewproduct,onCloseView:o.closeViewModal},null,8,["openModal","productData","onCloseView"]),d(M,{openCompare:l.showcomparemodal,productData:l.comapreproduct,onCloseCompare:o.closeCompareModal},null,8,["openCompare","productData","onCloseCompare"]),d(A,{openCart:l.showcartmodal,productData:l.cartproduct,onCloseCart:o.closeCartModal,products:o.filterProduct},null,8,["openCart","productData","onCloseCart","products"])])}const se=S(J,[["render",Zt]]);export{se as default};
