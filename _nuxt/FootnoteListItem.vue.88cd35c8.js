import{_ as k}from"./nuxt-link.d56855ba.js";import{u as v}from"./use-footnotes.6277b65b.js";import{f as b,k as y,L as N,r as B,m as C,i as F,o as t,c as o,a as p,d as n,t as r,b as f,w as u,x as a,F as h,A as L,v as V,y as w,B as x}from"./entry.fe79d0c7.js";const T=["id"],U={key:0,class:"flex items-center space-x-2"},$={class:"flex !p-0 !m-0 list-none"},I={class:"!m-0"},E=b({__name:"FootnoteListItem",props:{id:{},author:{},pageTitle:{},pageUrl:{},year:{}},setup(_){const g=_,s=v(),l=y(()=>`footnote-bottom_${s.ordering.value.indexOf(g.id)+1}`),d=N(),i=B({});return C(()=>d.hash,e=>{i.value={"bg-trc-orange-100":e.slice(1)===l.value}}),F(()=>{i.value={"bg-trc-orange-100":d.hash.slice(1)===l.value}}),(e,J)=>{const c=k;return t(),o("li",{id:a(l),class:x(["mb-6",a(i)])},[p("cite",null,[n(r(e.author)+', "'+r(e.pageTitle)+'" '+r(e.year?e.year+",":void 0)+" ",1),f(c,{href:e.pageUrl,target:"_blank"},{default:u(()=>[n(r(e.pageUrl),1)]),_:1},8,["href"])]),a(s).references.value[e.id]?(t(),o("div",U,[a(s).references.value[e.id].length>1?(t(),o(h,{key:0},[n(" ^ "),p("ul",$,[(t(!0),o(h,null,L(a(s).references.value[e.id],m=>(t(),o("li",I,[f(c,{title:"Jump up",class:"text-trc-orange-500 no-underline",to:{hash:`#${m.backlink}`}},{default:u(()=>[n(r(m.letter),1)]),_:2},1032,["to"])]))),256))])],64)):(t(),V(c,{key:1,class:"text-trc-orange-500 !no-underline",to:{hash:`#${a(s).references.value[e.id][0].backlink}`},title:"Jump up"},{default:u(()=>[n(" ^ ")]),_:1},8,["to"]))])):w("",!0)],10,T)}}});export{E as _};
