import{_ as c}from"./nuxt-link.f7e3f604.js";import{u as i}from"./use-footnotes.1db83718.js";import{f,j as p,o as _,u,w as d,a as m,t as l,v as o}from"./entry.de3baa93.js";const F=f({__name:"FootnoteRef",props:{footnoteId:{}},setup(s){const t=s,e=i(),r=e.registerFootnoteRef(t.footnoteId),n=p(()=>e.ordering.value.indexOf(t.footnoteId)+1);return(x,g)=>{const a=c;return _(),u(a,{class:"text-trc-orange-500 !no-underline",id:o(r),to:{hash:`#footnote-bottom_${o(n)}`}},{default:d(()=>[m("sup",null," ["+l(o(n))+"] ",1)]),_:1},8,["id","to"])}}});export{F as _};
