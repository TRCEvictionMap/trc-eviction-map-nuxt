import{_ as p}from"./nuxt-link.a4544412.js";import{u as l}from"./use-footnotes.6475b313.js";import{f as d,j as c,o as _,u as m,w as x,a as g,t as h,v as e}from"./entry.5a3ab7d6.js";const C=d({__name:"FootnoteRef",props:{footnoteId:{}},setup(i){const t=i,o=l();o.content.value[t.footnoteId];const f=c(()=>{const n=o.content.value[t.footnoteId];if(n){const{author:a,pageTitle:s}=n;return`${a}, "${s}"`}return""}),u=o.registerFootnoteRef(t.footnoteId),r=c(()=>o.ordering.value.indexOf(t.footnoteId)+1);return(n,a)=>{const s=p;return _(),m(s,{class:"text-trc-orange-500 inline-block !no-underline !-mt-2 !pt-2",id:e(u),to:{hash:`#footnote-bottom_${e(r)}`},title:e(f)},{default:x(()=>[g("sup",null," ["+h(e(r))+"] ",1)]),_:1},8,["id","to","title"])}}});export{C as _};
