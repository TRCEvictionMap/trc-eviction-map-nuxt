import{_ as k}from"./BvNc_L7r.js";import{u as v}from"./79fCPpod.js";import{f as b,j as y,L as N,r as w,n as x,h as B,o as t,c as o,a as u,d as r,t as n,b as h,w as d,v as a,F as f,z as C,u as F,x as L,A as V}from"./i1HMiD4-.js";const T=["id"],U={key:0,class:"flex items-center space-x-2"},$={class:"flex !p-0 !m-0 list-none"},z={class:"!m-0"},D=b({__name:"FootnoteListItem",props:{id:{},author:{},pageTitle:{},pageUrl:{},year:{}},setup(_){const g=_,s=v(),l=y(()=>`footnote-bottom_${s.ordering.value.indexOf(g.id)+1}`),p=N(),i=w({});return x(()=>p.hash,e=>{i.value={"bg-trc-orange-100":e.slice(1)===l.value}}),B(()=>{i.value={"bg-trc-orange-100":p.hash.slice(1)===l.value}}),(e,I)=>{const c=k;return t(),o("li",{id:a(l),class:"break-words !-mt-3 !pt-3"},[u("div",{class:V([a(i),"py-1 px-2"])},[u("cite",null,[r(n(e.author)+', "'+n(e.pageTitle)+'" '+n(e.year?e.year+",":void 0)+" ",1),h(c,{href:e.pageUrl,target:"_blank"},{default:d(()=>[r(n(e.pageUrl),1)]),_:1},8,["href"])]),a(s).references.value[e.id]?(t(),o("div",U,[a(s).references.value[e.id].length>1?(t(),o(f,{key:0},[r(" ^ "),u("ul",$,[(t(!0),o(f,null,C(a(s).references.value[e.id],m=>(t(),o("li",z,[h(c,{title:"Jump up",class:"text-trc-orange-500 no-underline",to:{hash:`#${m.backlink}`}},{default:d(()=>[r(n(m.letter),1)]),_:2},1032,["to"])]))),256))])],64)):(t(),F(c,{key:1,class:"text-trc-orange-500 !no-underline",to:{hash:`#${a(s).references.value[e.id][0].backlink}`},title:"Jump up"},{default:d(()=>[r(" ^ ")]),_:1},8,["to"]))])):L("",!0)],2)],8,T)}}});export{D as _};
