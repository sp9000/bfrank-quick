import"./entry.f9c14453.js";import{u as e}from"./cookie.3ac7710e.js";const t="tokenExpiry",n="userinfo";class u{localLogin(o){this.tokenExpiry=new Date,e(t).value=this.tokenExpiry,e("userlogin").value=!0,e(n).value=o.email}Logout(){e(t).value=void 0,e("userlogin").value=void 0,e(n).value=void 0}isAuthenticated(){return new Date(Date.now())!==new Date(localStorage.getItem(t))&&e("userLogin").value==="true"}}const l=new u;export{l as default};