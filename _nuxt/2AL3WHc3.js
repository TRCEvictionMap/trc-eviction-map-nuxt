import{_ as l}from"./BSENFn9g.js";import{u as p}from"./BqfMLsni.js";import{f as d,v as f,o as s,c as i,F as _,Q as g,D as F,I as k,a1 as x}from"./DQQ4zQSj.js";import"./BxPOKksG.js";const y=d({__name:"FootnoteList",props:{items:{}},setup(m){const n=m,a=p(),c=f(()=>{const o=a.ordering.value.concat(n.items.map(e=>e.id).filter(e=>!a.ordering.value.includes(e))),t=Array.from(n.items);return t.sort((e,r)=>o.indexOf(e.id)-o.indexOf(r.id)),t});return(o,t)=>{const e=l;return s(),i("ol",null,[(s(!0),i(_,null,g(F(c),(r,u)=>(s(),k(e,x({key:u},r),null,16))),128))])}}});export{y as default};