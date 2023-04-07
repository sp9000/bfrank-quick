import{_ as f}from"./index.46378ca7.js";import{U as g}from"./index.9d4a2080.js";import{B as h}from"./breadcrumbs.b2a21b81.js";import{q as _,o as v,l as u,s as r,y as t,I as o,z as n,x as l}from"./entry.f9c14453.js";import"./discover.5287eaca.js";const b={components:{MasonryWall:g,Breadcrumbs:h},data(){return{galleryFilter:"all",imagearray:[{id:1,title:"Slim Fit Cotton Shirt",alt:"established",filter:"fashion",imagepath:"/images/portfolio/metro/1.jpg"},{id:2,title:"trim dress",alt:"readable",filter:"shoes",imagepath:"/images/portfolio/metro/2.jpg"},{id:3,title:"trim dress",alt:"readable",filter:"shoes",imagepath:"/images/portfolio/metro/3.jpg"},{id:4,title:"trim dress",alt:"readable",filter:"bags",imagepath:"/images/portfolio/metro/4.jpg"},{id:5,title:"trim dress",alt:"readable",filter:"bags",imagepath:"/images/portfolio/metro/5.jpg"},{id:6,title:"trim dress",alt:"readable",filter:"bags",imagepath:"/images/portfolio/metro/6.jpg"},{id:7,title:"trim dress",alt:"readable",filter:"bags",imagepath:"/images/portfolio/metro/7.jpg"},{id:8,title:"trim dress",alt:"readable",filter:"watch",imagepath:"/images/portfolio/metro/8.jpg"}]}},computed:{filteredImages:function(){return this.galleryFilter==="all"?this.imagearray:this.imagearray.filter(s=>s.filter===this.galleryFilter)}},methods:{isActive:function(s){return this.galleryFilter===s},updateFilter(s){this.galleryFilter=s}}},y={class:"filter-section"},F={class:"container"},j={class:"row"},C={class:"col-12"},k=t("div",{class:"title1"},[t("h2",{class:"title-inner1"},"portfolio")],-1),B={class:"filter-container isotopeFilters"},A={class:"list-inline filter"},w={class:"portfolio-section portfolio-padding pt-0 port-col zoom-gallery"},x={class:"container"},S={class:"masonry-container isotopeContainer"},W={class:"col m-0 isotopeSelector item"},z={class:"overlay"},I={class:"border-portfolio"},M={href:"javascript:void(0)"},N=t("div",{class:"overlay-background"},null,-1),V=["src"];function q(s,i,E,G,U,e){const c=l("Breadcrumbs"),d=l("MasonryWall"),m=l("no-ssr"),p=f;return v(),u("div",null,[r(c,{title:"mesonary 4 grid"}),t("section",y,[t("div",F,[t("div",j,[t("div",C,[k,t("div",B,[t("ul",A,[t("li",{class:o({active:e.isActive("all")})},[t("a",{href:"javascript:void(0)",onClick:i[0]||(i[0]=a=>e.updateFilter("all"))},"All")],2),t("li",{class:o({active:e.isActive("fashion")})},[t("a",{href:"javascript:void(0)",onClick:i[1]||(i[1]=a=>e.updateFilter("fashion"))},"Fashion")],2),t("li",{class:o({active:e.isActive("bags")})},[t("a",{href:"javascript:void(0)",onClick:i[2]||(i[2]=a=>e.updateFilter("bags"))},"Bags")],2),t("li",{class:o({active:e.isActive("shoes")})},[t("a",{href:"javascript:void(0)",onClick:i[3]||(i[3]=a=>e.updateFilter("shoes"))},"Shoes")],2),t("li",{class:o({active:e.isActive("watch")})},[t("a",{href:"javascript:void(0)",onClick:i[4]||(i[4]=a=>e.updateFilter("watch"))},"Watch")],2)])])])])])]),t("section",w,[t("div",x,[r(m,null,{default:n(()=>[t("div",S,[r(d,{items:e.filteredImages,"ssr-columns":1,padding:16,"column-width":300,gap:15},{default:n(({item:a})=>[t("div",W,[t("div",z,[t("div",I,[t("a",M,[N,t("img",{src:a.imagepath,class:"img-fluid"},null,8,V)])])])])]),_:1},8,["items"])])]),_:1})])]),r(p)])}const O=_(b,[["render",q]]);export{O as default};
