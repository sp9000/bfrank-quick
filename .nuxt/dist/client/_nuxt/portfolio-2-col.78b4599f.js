import{_ as f}from"./lightBox.5a5ae6a2.js";import{B as p}from"./breadcrumbs.b2a21b81.js";import{q as u,o,l as a,s as d,y as t,I as s,F as b,E as h,x as v}from"./entry.f9c14453.js";import"./client-only.0965c2e8.js";const _={components:{Breadcrumbs:p,lightBox:f},data(){return{visible:!1,index:"",galleryFilter:"all",images:[{id:1,title:"Slim Fit Cotton Shirt",alt:"established",filter:"fashion",thumb:"/images/portfolio/grid/1.jpg",src:"/images/portfolio/grid/1.jpg"},{id:2,title:"trim dress",alt:"readable",filter:"shoes",thumb:"/images/portfolio/grid/2.jpg",src:"/images/portfolio/grid/2.jpg"},{id:3,title:"trim dress",alt:"readable",filter:"shoes",thumb:"/images/portfolio/grid/3.jpg",src:"/images/portfolio/grid/3.jpg"},{id:4,title:"trim dress",alt:"readable",filter:"bags",thumb:"/images/portfolio/grid/4.jpg",src:"/images/portfolio/grid/4.jpg"},{id:5,title:"trim dress",alt:"readable",filter:"bags",thumb:"/images/portfolio/grid/5.jpg",src:"/images/portfolio/grid/5.jpg"},{id:6,title:"trim dress",alt:"readable",filter:"bags",thumb:"/images/portfolio/grid/6.jpg",src:"/images/portfolio/grid/6.jpg"},{id:7,title:"trim dress",alt:"readable",filter:"bags",thumb:"/images/portfolio/grid/7.jpg",src:"/images/portfolio/grid/7.jpg"},{id:8,title:"trim dress",alt:"readable",filter:"watch",thumb:"/images/portfolio/grid/8.jpg",src:"/images/portfolio/grid/8.jpg"}]}},computed:{filteredImages:function(){return this.galleryFilter==="all"?this.images:this.images.filter(r=>r.filter===this.galleryFilter)}},methods:{isActive:function(r){return this.galleryFilter===r},updateFilter(r){this.galleryFilter=r},openGallery(r){this.index=r,this.visible=!0},close(){this.visible=!1}}},j={class:"portfolio-section grid-portfolio ratio2_3 portfolio-padding"},F={class:"container"},y={align:"center",id:"form1"},C={class:"row zoom-gallery"},k={class:"overlay"},x={class:"border-portfolio"},B=["onClick"],w=t("div",{class:"overlay-background"},[t("i",{class:"fa fa-plus","aria-hidden":"true"})],-1),A=["src"];function I(r,i,S,V,n,e){const m=v("Breadcrumbs"),g=f;return o(),a("div",null,[d(m,{title:"Portfolio gallery"}),t("section",j,[t("div",F,[t("div",y,[t("button",{class:s(["filter-button project_button",{active:e.isActive("all")}]),"data-filter":"all",onClick:i[0]||(i[0]=l=>e.updateFilter("all"))},"All",2),t("button",{class:s(["filter-button project_button",{active:e.isActive("fashion")}]),"data-filter":"fashion",onClick:i[1]||(i[1]=l=>e.updateFilter("fashion"))},"Fashion",2),t("button",{class:s(["filter-button project_button",{active:e.isActive("bags")}]),"data-filter":"bags",onClick:i[2]||(i[2]=l=>e.updateFilter("bags"))},"Bags",2),t("button",{class:s(["filter-button project_button",{active:e.isActive("shoes")}]),"data-filter":"shoes",onClick:i[3]||(i[3]=l=>e.updateFilter("shoes"))},"Shoes",2),t("button",{class:s(["filter-button project_button",{active:e.isActive("watch")}]),"data-filter":"watch",onClick:i[4]||(i[4]=l=>e.updateFilter("watch"))},"Watch",2)]),d(g),t("div",C,[(o(!0),a(b,null,h(e.filteredImages,(l,c)=>(o(),a("div",{class:"isotopeSelector filter fashion col-sm-6",key:c},[t("div",k,[t("div",x,[t("a",{href:"javascript:void(0)",onClick:z=>e.openGallery(c)},[w,t("img",{src:l.src,class:"img-fluid"},null,8,A)],8,B)])])]))),128)),d(g,{index:n.index,visible:n.visible,image:e.filteredImages,onCloseView:e.close},null,8,["index","visible","image","onCloseView"])])])])])}const L=u(_,[["render",I]]);export{L as default};