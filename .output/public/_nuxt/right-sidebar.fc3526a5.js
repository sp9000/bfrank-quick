import{q as V,L as F,o as a,l as r,s as c,y as t,F as _,E as g,B as f,t as m,I as v,z as B,x as h,C as D,A as w,G as I,H as L,J as T,v as j}from"./entry.f9c14453.js";import{_ as C}from"./product-box1.32c56939.js";import{_ as N}from"./index.46378ca7.js";import{u}from"./filter.d7aa44d2.js";import{B as O}from"./breadcrumbs.b2a21b81.js";import{s as R}from"./collection-sidebar.ef7f8d82.js";import{q as z,c as E}from"./compare-popup.37a12edd.js";import{c as Q}from"./cart-modal-popup.9a6ad0e5.js";import{_ as Z}from"./2.25ea6962.js";import{_ as G,a as H,b as J,c as K}from"./6.eeb7c80f.js";import{_ as U}from"./empty-search.1c1cc13c.js";import"./discover.5287eaca.js";import"./swiper.min.1c5b84fa.js";import"./navigation.min.8f805591.js";const W={components:{Breadcrumbs:O,productBox1:C,sidebar:R,quickviewModel:z,compareModel:E,cartModel:Q},data(){return{bannerimagepath:"/images/side-banner.png",col2:!1,col3:!1,col4:!0,col6:!1,listview:!1,priceArray:[],allfilters:[],items:[],current:1,paginate:12,paginateRange:3,pages:[],paginates:"",showquickviewmodel:!1,showcomparemodal:!1,showcartmodal:!1,quickviewproduct:{},comapreproduct:{},cartproduct:{},dismissSecs:5,dismissCountDown:0}},computed:{filterProduct(){return u().filterProducts},tags(){return u().setTags},curr(){return F().changeCurrency}},mounted(){this.updatePaginate(1)},methods:{onChangeSort(e){u().sortProducts(e.target.value)},gridView(){this.col4=!0,this.col2=!1,this.col3=!1,this.col6=!1,this.listview=!1},listView(){this.listview=!0,this.col4=!1,this.col2=!1,this.col3=!1,this.col6=!1},grid2(){this.col2=!0,this.col3=!1,this.col4=!1,this.col6=!1,this.listview=!1},grid3(){this.col3=!0,this.col2=!1,this.col4=!1,this.col6=!1,this.listview=!1},grid4(){this.col4=!0,this.col2=!1,this.col3=!1,this.col6=!1,this.listview=!1},grid6(){this.col6=!0,this.col2=!1,this.col3=!1,this.col4=!1,this.listview=!1},removeTags(e){this.allfilters.splice(this.allfilters.indexOf(e),1)},removeAllTags(){this.allfilters.splice(0,this.allfilters.length)},getCategoryFilter(){this.updatePaginate(1),u().getCategoryFilter(this.$route.params.id)},allfilter(e){this.allfilters=e,u().setTags(e),this.getPaginate(),this.updatePaginate(1)},pricefilterArray(e){this.getCategoryFilter(),u().priceFilter(e),this.getPaginate(),this.updatePaginate(1)},getPaginate(){this.paginates=Math.round(this.filterProduct.length/this.paginate),this.pages=[];for(let e=0;e<this.paginates;e++)this.pages.push(e+1)},setPaginate(e){return this.current===1?e<this.paginate:e>=this.paginate*(this.current-1)&&e<this.current*this.paginate},updatePaginate(e){this.current=e;let s=0,d=0;this.current<this.paginateRange-1?(s=1,d=s+this.paginateRange-1):(s=this.current-1,d=this.current+1),s<1&&(s=1),d>this.paginates&&(d=this.paginates),this.pages=[];for(let p=s;p<=d;p++)this.pages.push(p);return this.pages},alert(e){this.dismissCountDown=e},showQuickview(e,s){this.showquickviewmodel=e,this.quickviewproduct=s},showCoampre(e,s){this.showcomparemodal=e,this.comapreproduct=s},closeCompareModal(e){this.showcomparemodal=e},showCart(e,s){this.showcartmodal=e,this.cartproduct=s},closeCartModal(e){this.showcartmodal=e},closeViewModal(e){this.showquickviewmodel=e}}},X={class:"section-b-space ratio_asos"},Y={class:"collection-wrapper rightSidebar"},$={class:"container"},tt={class:"row"},et={class:"collection-content col"},st={class:"page-main-content"},ot={class:"row"},it={class:"col-12"},lt=t("div",{class:"top-banner-wrapper"},[t("a",{href:"#"},[t("img",{src:Z,class:"img-fluid",alt:""})]),t("div",{class:"top-banner-content small-section"},[t("h4",null,"fashion"),t("h5",null,"Lorem Ipsum is simply dummy text of the printing and typesetting industry."),t("p",null,"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")])],-1),at={class:"product-filter-tags"},rt={href:"javascript:void(0)",class:"filter_tag"},ct=["onClick"],nt={key:0,class:"clear_filter"},dt={class:"collection-product-wrapper"},ut={class:"product-top-filter"},ht={class:"row"},pt={class:"col-12"},mt={class:"product-filter-content"},_t={class:"search-count"},gt={class:"collection-view"},ft=t("i",{class:"fa fa-th grid-layout-view"},null,-1),vt=[ft],wt=t("i",{class:"fa fa-list-ul list-layout-view"},null,-1),Ct=[wt],kt={class:"collection-grid-view"},yt={class:"product-page-filter"},bt=j('<option value="all">Sorting Items</option><option value="a-z">Alphabetically, A-Z</option><option value="z-a">Alphabetically, Z-A</option><option value="low">price, low to high</option><option value="high">price, high to low</option>',5),Pt=[bt],xt={class:"row"},Mt={class:"col-12"},St={key:0,class:"text-center section-t-space section-b-space"},At=t("img",{src:U,class:"img-fluid",alt:""},null,-1),qt=t("h3",{class:"mt-3"},"Sorry! Couldn't find the product you were looking For!!!",-1),Vt={class:"col-12 mt-3"},Ft={class:"product-box"},Bt={key:0,class:"product-pagination mb-0"},Dt={class:"theme-paggination-block"},It={class:"row"},Lt={class:"col-xl-6 col-md-6 col-sm-12"},Tt={"aria-label":"Page navigation"},jt={class:"pagination"},Nt={class:"page-item"},Ot=t("span",{"aria-hidden":"true"},[t("i",{class:"fa fa-chevron-left","aria-hidden":"true"})],-1),Rt=[Ot],zt=["onClick"],Et={class:"page-item"},Qt=t("span",{"aria-hidden":"true"},[t("i",{class:"fa fa-chevron-right","aria-hidden":"true"})],-1),Zt=[Qt],Gt={class:"col-xl-6 col-md-6 col-sm-12"},Ht={class:"product-search-count-bottom"},Jt={class:"col-lg-3"};function Kt(e,s,d,p,l,o){const k=h("Breadcrumbs"),y=D,b=C,P=h("sidebar"),x=h("quickviewModel"),M=h("compareModel"),S=h("cartModel"),A=N;return a(),r("div",null,[c(k,{title:"collection"}),t("section",X,[t("div",Y,[t("div",$,[t("div",tt,[t("div",et,[t("div",st,[t("div",ot,[t("div",it,[lt,t("ul",at,[(a(!0),r(_,null,g(l.allfilters,(i,n)=>(a(),r("li",{class:"me-1",key:n},[t("a",rt,[w(m(i),1),t("i",{class:"ti-close",onClick:q=>o.removeTags(i)},null,8,ct)])]))),128)),l.allfilters.length>0?(a(),r("li",nt,[t("a",{href:"javascript:void(0)",class:"clear_filter",onClick:s[0]||(s[0]=i=>o.removeAllTags())},"Clear all")])):f("",!0)]),t("div",dt,[t("div",ut,[t("div",ht,[t("div",pt,[t("div",mt,[t("div",_t,[t("h5",null,"Showing Products 1-12 of "+m(o.filterProduct.length)+" Result",1)]),t("div",gt,[t("ul",null,[t("li",{onClick:s[1]||(s[1]=i=>o.gridView())},vt),t("li",{onClick:s[2]||(s[2]=i=>o.listView())},Ct)])]),t("div",kt,[t("ul",null,[t("li",null,[t("img",{src:G,onClick:s[3]||(s[3]=i=>o.grid2()),class:"product-2-layout-view"})]),t("li",null,[t("img",{src:H,onClick:s[4]||(s[4]=i=>o.grid3()),class:"product-3-layout-view"})]),t("li",null,[t("img",{src:J,onClick:s[5]||(s[5]=i=>o.grid4()),class:"product-4-layout-view"})]),t("li",null,[t("img",{src:K,onClick:s[6]||(s[6]=i=>o.grid6()),class:"product-6-layout-view"})])])]),t("div",yt,[t("select",{onChange:s[7]||(s[7]=i=>o.onChangeSort(i))},Pt,32)])])])])]),t("div",{class:v(["product-wrapper-grid",{"list-view":l.listview==!0}])},[t("div",xt,[t("div",Mt,[o.filterProduct.length==0?(a(),r("div",St,[At,qt,t("div",Vt,[c(y,{to:{path:"/"},class:"btn btn-solid"},{default:B(()=>[w("continue shopping")]),_:1})])])):f("",!0)]),(a(!0),r(_,null,g(o.filterProduct,(i,n)=>I((a(),r("div",{class:v(["col-grid-box",{"col-xl-3 col-md-4 col-6":l.col4==!0,"col-md-4 col-6":l.col3==!0,"col-6":l.col2==!0,"col-xxl-2 col-xl-3 col-md-4 col-6":l.col6==!0,"col-12":l.listview==!0}]),key:n},[t("div",Ft,[c(b,{onOpencartmodel:o.showCart,onShowCompareModal:o.showCoampre,onOpenquickview:o.showQuickview,onAlertseconds:o.alert,product:i,index:n},null,8,["onOpencartmodel","onShowCompareModal","onOpenquickview","onAlertseconds","product","index"])])],2)),[[L,o.setPaginate(n)]])),128))])],2),o.filterProduct.length>l.paginate?(a(),r("div",Bt,[t("div",Dt,[t("div",It,[t("div",Lt,[t("nav",Tt,[t("ul",jt,[t("li",Nt,[t("a",{class:"page-link",href:"javascript:void(0)",onClick:s[8]||(s[8]=i=>o.updatePaginate(l.current-1))},Rt)]),(a(!0),r(_,null,g(this.pages,(i,n)=>(a(),r("li",{class:v(["page-item",{active:i==l.current}]),key:n},[t("a",{class:"page-link",href:"javascrip:void(0)",onClick:T(q=>o.updatePaginate(i),["prevent"])},m(i),9,zt)],2))),128)),t("li",Et,[t("a",{class:"page-link",href:"javascript:void(0)",onClick:s[9]||(s[9]=i=>o.updatePaginate(l.current+1))},Zt)])])])]),t("div",Gt,[t("div",Ht,[t("h5",null,"Showing Products 1-12 of "+m(o.filterProduct.length)+" Result",1)])])])])])):f("",!0)])])])])]),t("div",Jt,[c(P,{onAllFilters:o.allfilter,onPriceVal:o.pricefilterArray,onCategoryfilter:o.getCategoryFilter},null,8,["onAllFilters","onPriceVal","onCategoryfilter"])])])])])]),c(x,{openModal:l.showquickviewmodel,productData:l.quickviewproduct,onCloseView:o.closeViewModal},null,8,["openModal","productData","onCloseView"]),c(M,{openCompare:l.showcomparemodal,productData:l.comapreproduct,onCloseCompare:o.closeCompareModal},null,8,["openCompare","productData","onCloseCompare"]),c(S,{openCart:l.showcartmodal,productData:l.cartproduct,onCloseCart:o.closeCartModal,products:o.filterProduct},null,8,["openCart","productData","onCloseCart","products"]),c(A)])}const ne=V(W,[["render",Kt]]);export{ne as default};
