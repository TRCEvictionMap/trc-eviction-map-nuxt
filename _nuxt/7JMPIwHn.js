import{r as o,g as w,G as F,P as p,l as g,D as _}from"./81OePqHc.js";const m=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];function x(){const e=o(!1),t=o([]);function i(){let c=0;for(let r=0;r<t.value.length;r++)if(t.value[r]===m[c]?c+=1:c=0,c===m.length)return!0;return!1}function s(c){t.value.push(c.code)}function u(){e.value=!1}let n;return w(()=>{i()&&e.value===!1&&(e.value=!0),clearTimeout(n),n=setTimeout(()=>{t.value.length>0&&(t.value=[])},1e3)}),F({didKonami:e,reset:u,recordKeyPress:s})}const T=p("map-meta",()=>{const e=o(),t=o();return{lngLat:e,zoom:t}}),O=["n_filings","filing_rate","none"],A=["renter_count","renter_rate","poverty_rate","none"];function H(e){return O.includes(e)}function K(e){return A.includes(e)}const L=p("map-controls",()=>{const e=o([]),t=o([{text:"Block Group",value:"block-group",description:"A statistical geographic unit used by the U.S. Census to organize data it publishes"}]),i=o([{text:"None",value:"none"},{text:"Eviction Filings",value:"n_filings"},{text:"Eviction Filing Rate",value:"filing_rate"}]),s=o([{text:"None",value:"none"},{text:"Renter-Occupied Households",value:"renter_count"},{text:"Percent Renter-Occupied",value:"renter_rate"},{text:"Poverty Rate",value:"poverty_rate"}]),u=o("2023"),n=o("block-group"),c=o("n_filings"),r=o("renter_rate"),l=g(()=>{var a;return(a=t.value.find(f=>f.value===n.value))==null?void 0:a.text}),d=g(()=>{var a;return(a=t.value.find(f=>f.value===n.value))==null?void 0:a.description});return{yearOptions:e,sourceOptions:t,evictionMetricOptions:i,demographicMetricOptions:s,currentSource:n,currentSourceHumanReadable:l,currentSourceDesicription:d,currentYear:u,currentEvictionMetric:c,currentDemographicMetric:r}}),b=["#ff7f00","#4daf4a","#984ea3"],C=3;function D(){const e=o([]),t=o({}),i=g(()=>Object.fromEntries(Object.entries(t.value).map(([r,l])=>[r,l]))),s=g({get(){return e.value},set(r){e.value=r.length>C?r.slice(r.length-C):r}});_(s,r=>{const{featureColors:l,availableColors:d}=Object.entries(t.value).reduce((a,[f,v])=>(r.includes(f)&&(a.featureColors[f]=v,a.availableColors=a.availableColors.filter(h=>h!==v)),a),{featureColors:{},availableColors:Array.from(b)});r.forEach(a=>{l[a]||(l[a]=d.pop())}),t.value=l},{immediate:!0});function u(r){e.value=r}function n(){e.value=[]}function c(r,l){l?s.value=s.value.concat(r):s.value=s.value.filter(d=>d!==r)}return{selectedFeatures:s,initSelectedFeatures:u,clearSelectedFeatures:n,setIsFeatureSelected:c,_features:e,selectedFeatureColors:i}}function M(){const e=o(),t=o(!1);function i(u,n){e.value=n?u:void 0,t.value=n}function s(){e.value=void 0,t.value=!1}return{setIsFeatureHovered:i,clearHoveredFeature:s,hoveredFeature:e,hoveredFeatureKind:t}}const I=p("feature-state",()=>{const{selectedFeatures:e,setIsFeatureSelected:t,clearSelectedFeatures:i,initSelectedFeatures:s,_features:u,selectedFeatureColors:n}=D(),{hoveredFeature:c,hoveredFeatureKind:r,setIsFeatureHovered:l,clearHoveredFeature:d}=M();function a(f,v,h){v==="isSelected"&&t(f,h),v==="isHovered"&&l(f,h)}return{selectedFeatures:e,hoveredFeature:c,hoveredFeatureKind:r,setFeatureState:a,clearSelectedFeatures:i,clearHoveredFeature:d,initSelectedFeatures:s,_features:u,selectedFeatureColors:n}}),E="trcmap-settings",S={verticalDetailCards:!0,showAlderDistricts:!1,detailCardListUnderlineItems:!1,showDataTable:!1,showBottomPanel:!1,showLeftPanel:!0};function R(e){localStorage.setItem(E,JSON.stringify(e))}const N=p("settings",()=>{const e=o(!1),t=F(S);function i(){if(typeof localStorage<"u"){const s=localStorage.getItem(E);if(s){const u=JSON.parse(s);Object.keys(S).forEach(n=>{t[n]=u[n]??S[n]})}}}return _(t,R),{showDialog:e,options:t,loadOptions:i}}),P=p("disclosures",()=>{const e=o(!1),t=o(!1),i=o(!1),s=o(!1);return{showSearch:e,showMobileNav:t,showDetails:s,showWelcomeModal:i}});export{T as a,I as b,N as c,P as d,x as e,H as f,K as i,L as u};