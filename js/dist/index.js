import{A as ge,C as pe,D as w,Ea as I,F as N,G as J,H as b,Ha as we,I as ye,J as be,K as $,L as z,M as X,N as Se,O as Ee,P as C,Pa as Ae,Q as A,R as S,S as V,T as ve,U as Ce,Ua as Pe,V as ke,W as Q,b as O,c as v,e as oe,f as ce,g as L,h as ue,i as D,k as a,l as q,m as _,n as M,na as Le,o as W,oa as Y,p as de,pa as K,q as me,qa as Te,r as he,ra as x,s as T,t as f,v as fe}from"./chunk-IMTS2DQ2.js";var te=v("theme-layout"),g=document.documentElement.classList,G={},B={};function _e(){te.log("init()"),G=new Z("footer-site-theme-toggle"),B=new ee("footer-gallery-layout-toggle"),document.addEventListener("settingsUpdated",()=>{fe(),G.setCurrent(),B.setCurrent()})}function $e(e,t,n){let s=Object.values(e).find(i=>i.id===t);return s!==void 0?s:n}function xe(e,t){let n=Object.values(e).findIndex(i=>i.id===t.id),s=Object.keys(e);return n+1<s.length?e[s[n+1]]:e[s[0]]}var Z=class extends Q{constructor(t){super(t,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},black:{id:"black",text:"black",class:"site-theme-black"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=$e(this.themes,f.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=xe(this.themes,this.currentTheme),f.site.theme=this.currentTheme.id}update(){let t=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),W(a.UF_SITE_THEME,t.id),g.contains(t.class)===!1&&(te.log(`SiteThemeToggle.update() - newSiteTheme: ${t.id}`),g.remove(this.themes.light.class,this.themes.dark.class,this.themes.black.class),g.add(t.class)),this.value=this.currentTheme.text}},ee=class extends Q{constructor(t){super(t,!1),this.minWidth=`(max-width: ${be("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=$e(this.layouts,f.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(t){g.contains("gallery-layout")&&(t.matches?(g.remove(this.currentLayout.class),g.add(this.layouts.oneColumn.class)):(g.remove(this.layouts.oneColumn.class),g.add(this.currentLayout.class)))}toggle(){this.currentLayout=xe(this.layouts,this.currentLayout),f.gallery.layout=this.currentLayout.id}update(t){this.value=this.currentLayout.text,W(a.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(g.contains("gallery-layout")&&g.contains(this.currentLayout.class)===!1&&(te.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),g.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),g.add(this.currentLayout.class)),t?.type==="click"&&this.element.scrollIntoView())}};var lt=v("settings-ui"),l={settings:null,container:null,updatedEvent:new Event("settingsUpdated")},R={containerId:"settings-container",saveResetId:"settings-save-reset"},p=[{name:"Playback",id:"playback",schema:L.playback},{name:"List Player",id:"list",schema:L.list},{name:"Gallery Player",id:"gallery",schema:L.gallery},{name:"Mobile",id:"mobile",schema:L.mobile},{name:"Site",id:"site",schema:L.site},{name:"Experimental",id:"experimental",schema:L.experimental}];function Fe(){if(lt.log("init()"),l.container=document.getElementById(R.containerId),l.container!==null){if(document.URL.includes("?clear=true")){Ie();return}He(!1),l.settings!==null?(p.forEach(e=>dt(l.settings[e.id],e.schema)),ht(),l.container.style.opacity=1,l.container.addEventListener("click",e=>Re(e)),l.container.addEventListener("contextmenu",e=>Re(e)),b(`#${R.saveResetId} .settings-save-button`,"click",pt),b(`#${R.saveResetId} .settings-reset-button`,"click",yt),ot(),ct()):Ie()}}function ot(){window.addEventListener("beforeunload",e=>{l.container.querySelectorAll("table tr")?.forEach(t=>{t.classList.contains("value-changed")&&(e.preventDefault(),e.returnValue=!0)})})}function ct(){l.settings.site.snackbarMessageLog&&(document.querySelector(".entry-content p").insertAdjacentHTML("beforeend",' <span title="Click / tap to view log" class="show-snackbar-log">View Snackbar Message Log</span>.'),document.querySelector(".entry-content .show-snackbar-log").addEventListener("click",()=>N()))}function He(e=!1){l.settings=de(a.UF_SETTINGS,e?ue:null,e)}function Oe(){me(a.UF_SETTINGS,l.settings),_(a.UF_GALLERY_PER_PAGE,l.settings.gallery.tracksPerPage,q*5),_(a.UF_LIST_PER_PAGE,l.settings.list.tracksPerPage,q*5),_(a.UF_PREFERRED_PLAYER,l.settings.playback.preferredPlayer,q*5),document.dispatchEvent(l.updatedEvent)}var ut=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear-container"><button type="button" class="settings-clear-button"><b>Clear All Settings</b></button></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function Ie(){document.getElementById(R.saveResetId).style.display="none",l.container.insertAdjacentHTML("afterbegin",ut),l.container.style.minHeight="100%",l.container.style.opacity=1,b(`#${R.containerId} .settings-clear-button`,"click",()=>{localStorage.removeItem(a.UF_SETTINGS),localStorage.removeItem(a.UF_SITE_THEME),localStorage.removeItem(a.UF_GALLERY_LAYOUT),M(a.UF_GALLERY_PER_PAGE),M(a.UF_LIST_PER_PAGE),M(a.UF_PREFERRED_PLAYER),M(a.UF_SHUFFLE_UID),he(!0),He(!0),l.settings!==null?w({message:"All settings have been cleared",duration:5,actionText:"Reload",actionClickCallback:()=>window.location.href="/settings/",afterCloseCallback:()=>window.location.href="/settings/"}):w({message:"Sorry, unable to clear all settings",duration:5})})}function dt(e,t){Object.entries(e).forEach(([n,s])=>{n in t&&(t[n].current=U(t[n],s),t[n].current===-1&&(t[n].current=U(t[n],t[n].default)))})}function mt(e,t){Object.keys(e).forEach(n=>{n in t&&(e[n]=t[n].default,t[n].current=U(t[n],t[n].default))})}function U(e,t){return e.values.findIndex(n=>n===t)}function ht(){let e=`
<h3>${p[0].name}</h3>
<table id="${p[0].id}-settings" class="settings">
<tbody>`;Object.entries(p[0].schema).forEach(t=>e+=Me(p[0].id,t)),p.slice(1).forEach(t=>{Object.keys(t.schema).length>0&&(e+=`
</tbody>
</table>
<h3>${t.name}</h3>
<table id="${t.id}-settings" class="settings">
<tbody>`,Object.entries(t.schema).forEach(n=>e+=Me(t.id,n)))}),l.container.insertAdjacentHTML("afterbegin",e+`
</tbody>
</table>
`)}function Me(e,t){let n=t[1].valueStrings[U(t[1],t[1].default)];return`
<tr id="${e}:${t[0]}" class="settings-entry" title="Default: ${n}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${t[1].description}</td>
      <td class="${De(t[1])}">${t[1].valueStrings[t[1].current]}</td>
    </tr>`}function De(e){switch(e.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${e.values[e.current]===!0?"true":"false"}`}}function ft(e,t,n,s){s.current=s.current+1<s.values.length?s.current+1:s.current=0,l.settings[t][n]=s.values[s.current],l.settings[t][n]!==f[t][n]?e.classList.add("value-changed"):e.classList.remove("value-changed"),qe(e.querySelector(".value-string"),s)}function qe(e,t){e.classList=De(t),e.textContent=t.valueStrings[t.current]}function gt(e,t,n){Object.keys(e).forEach(s=>{s in t&&qe(document.getElementById(`${n}:${s}`).querySelector(".value-string"),t[s])})}function Re(e){let t=e.target.closest("tr");if(t!==null){let n=t.id.split(":")[0],s=t.id.split(":")[1],i=p.findIndex(r=>r.id===n);e.type==="contextmenu"?ve(e)&&(e.preventDefault(),Ue(n,s,i)):e.shiftKey===!0?Ue(n,s,i):ft(t,p[i].id,s,p[i].schema[s])}}function Ue(e,t,n){let s=p[n].schema[t],i=s.description,r="";D[e]!==void 0&&D[e][t]!==void 0&&(i=`<span class="normal-text">${i}: </span>${D[e][t]}`),s.valueStrings.forEach(o=>r+=`${o}, `),pe({modalTitle:`${p[n].name} setting details`,modalBody:`<p><b>Description</b><br>${i}</p>
                 <p><b>Values</b><br>${r.slice(0,r.length-2)}</p>
                 <p><b>Current Value</b><br>${s.valueStrings[s.current]}</p>
                 <p><b>Default Value</b><br>${s.valueStrings[U(s,s.default)]}</p>`})}function Ne(){l.container.querySelectorAll("table  tr")?.forEach(e=>e.classList.remove("value-changed"))}function pt(){Oe(),Ne(),w({message:"All settings saved",duration:3})}function yt(){p.forEach(e=>{mt(l.settings[e.id],e.schema),gt(l.settings[e.id],e.schema,e.id)}),Ne(),w({message:"All settings reset",duration:4,actionText:"Undo",actionClickCallback:()=>location.reload(),afterCloseCallback:()=>Oe()})}var bt=()=>{let e=null,t=null,n=null,s=null,i=!1,r=0;return window.addEventListener("load",()=>{b("#menu-primary-sections .menu-item-reshuffle a","click",we),b("#menu-primary-sections .menu-item-pref-player","click",E=>{E.preventDefault(),Ae.toggle()}),document.getElementById("menu-primary-channels")?.addEventListener("click",y)}),{isVisible(){return i},init:o,toggle:d,hide:m};function o(){e=document.getElementById("site-header"),t=document.querySelector("#site-navigation .nav-menu-outer"),n=document.querySelector("#site-navigation .nav-menu-inner"),s=document.getElementById("nav-menu-overlay"),ye("button.nav-menu-toggle","click",d),s.addEventListener("click",m),window.addEventListener("resize",()=>ae())}function d(){r=e.offsetHeight,i?m():k()}function k(){e.classList.contains("scrolling-down")===!1&&(i=!0,e.classList.remove("hide-nav-menu"),t.style.display="flex",s.style.backgroundColor=Se(),s.classList.add("show"),z(J.SITE_MAX_WIDTH_MOBILE)&&le("hidden","close","100vh"),ae())}function m(){i=!1,e.classList.add("hide-nav-menu"),t.style.display="",s.className="",le()}function y(E){let H=E.target.closest("li.menu-item.menu-item-object-uf_channel");H!==null&&(Pe()||I())&&(E?.preventDefault(),A(S(H.querySelector("a").href)))}function ae(){if(i&&z(J.SITE_MAX_WIDTH_MOBILE)){let E=$("margin-top",n)+$("margin-bottom",n);n.style=`overflow-y: auto; max-height: ${window.innerHeight-(r+E)}px`}}function le(E="",H="menu",tt=""){document.body.style.overflowY=E,e.querySelectorAll(".nav-menu-toggle span")?.forEach(nt=>nt.textContent=H),e.style.height=tt,n.style=""}},P=bt();function Ye(e,t,n){let s=`<b>${e}</b>`;return n.forEach((i,r)=>{let o=ge(i.meta);s+=`
    <div class="track">
      <div class="thumbnail ${o.class}"
        data-term-url="${i.link}"
        data-term-slug="${t}"
        data-track-num="${r+1}"
        data-track-type="${i.meta.track_source_type}"
        data-track-id="track-${i.id}"
        data-track-source-uid="${o.uid}" title="Play Track"
        >
        <img src="${o.src}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${i.link}" title="Go to track"><span><b>${i.meta.track_artist}</b></span><br><span>${i.meta.track_title}</span></a>
      </div>
    </div>`}),s}function Ke(e,t){let n=`<b>${e}</b><br>`;return t.forEach(s=>n+=`<a href="${S(s.link)}">${s.name}</a>, `),n.slice(0,n.length-2)}function Ge(e,t,n){let s=`<b>${e}</b><br>`;return t.forEach(i=>{let r=S(`${O.siteUrl}/artist/${i.artist_slug}/?channel=${n}`);s+=`<a href="${r}">${i.artist_name}</a> (${i.track_count})<br>`}),s}var u={termCache:{}};function ne(e,t,n){let s=C(e,"data-term-type"),i=parseInt(t.getAttribute("data-term-id")),r=C(t,"data-term-slug"),o=s==="channels";vt(s,i,o?10:50,d=>{let k=o?"Latest Tracks":"All Tracks",m=n.querySelector(".body-left");d!==null?(m.innerHTML=Ye(k,r,d),t.setAttribute("data-is-fetched",1)):w({message:"Failed to fetch track data!",duration:30,actionText:"retry",actionClickCallback:()=>ne(e,t,n)}),!o&&d!==null?St(d,i,n):d!==null&&Et(i,n,r)})}function St(e,t,n){Ct(e,t,50,(s,i)=>{let r=s==="artists"?"Related Artists":"In Channels",o=s==="artists"?n.querySelector(".artists"):n.querySelector(".channels");i!==null?o.innerHTML=Ke(r,i):o.innerHTML=`<b>${r}</b><br>None found`})}async function Et(e,t,n){if(!("topArtists"in u.termCache[e])){let s=await K({endpoint:"top-artists",query:`channel_id=${e}`,path:"/wp-json/ultrafunk/v1/"});s.status.code===Y.OK&&(u.termCache[e].topArtists=s.data)}t.querySelector(".top-artists").innerHTML=Ge("Top Artists (tracks)",u.termCache[e].topArtists,n)}async function vt(e,t,n,s){if(!(t in u.termCache)){let i=await K({endpoint:"tracks",query:`${e}=${t}&per_page=${n}&_fields=id,link,artists,channels,meta`});i.status.code===Y.OK&&(u.termCache[t]={tracks:i.data})}s(u.termCache[t]!==void 0?u.termCache[t].tracks:null)}function Ct(e,t,n,s){if("channels"in u.termCache[t]&&"artists"in u.termCache[t])s("channels",u.termCache[t].channels),s("artists",u.termCache[t].artists);else{let i=[],r=[];e.forEach(o=>{i.push.apply(i,o.channels),r.push.apply(r,o.artists)}),r=r.filter(o=>o!==t),Be("channels",t,[...new Set(i)],n,s),Be("artists",t,[...new Set(r)],n,s)}}async function Be(e,t,n,s,i){if(n.length>0){let r=await K({endpoint:e,query:`include=${n}&per_page=${s}&_fields=link,name`});r.status.code===Y.OK&&(u.termCache[t][e]=r.data)}else u.termCache[t][e]=null;i(e,u.termCache[t][e]!==void 0?u.termCache[t][e]:null)}function je(){u.termCache=JSON.parse(sessionStorage.getItem(a.UF_TERMLIST_CACHE)),u.termCache===null&&(u.termCache={})}function We(){sessionStorage.setItem(a.UF_TERMLIST_CACHE,JSON.stringify(u.termCache))}function Je(){sessionStorage.removeItem(a.UF_TERMLIST_CACHE)}function ze(){return Object.keys(u.termCache).length>0}var Xe=v("artists-channels"),c={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},Lt=new Event("allowKeyboardShortcuts"),Tt=new Event("denyKeyboardShortcuts");function Qe(){Xe.log("init()"),c.listContainer=document.getElementById("termlist-container"),c.uiElements=new se("#termlist-container"),At(),wt()}function Ze(){if(ze()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.scrollY),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.getAttribute("data-is-expanded")==="1"&&e.openTermIds.push(t.id)}),sessionStorage.setItem(a.UF_TERMLIST_STATE,JSON.stringify(e)),We()}}function wt(){if(je(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(a.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),setTimeout(()=>{window.scroll({top:e.scrollPos,left:0})},0)):history.scrollRestoration="auto"}sessionStorage.removeItem(a.UF_TERMLIST_STATE),Je()}function At(){c.listContainer.getAttribute("data-term-type")==="artists"&&(c.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),c.termlistFilterInput=document.getElementById("termlist-filter-input"),c.termlistEntries=c.listContainer.querySelectorAll(".termlist-entry"),c.termlistFilterInput.addEventListener("keyup",e=>Pt(e)),c.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(Tt)),c.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(Lt)),termsListArray.forEach(e=>e.name=e.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1),c.termlistFilterInput.focus())}function Pt(e){if(ke(e.key))return;let t=performance.now(),n=c.termlistFilterInput.value.toLowerCase(),s=c.termlistEntries.length;if(c.listContainer.classList.add("notransitions"),n.length>=3){let d=termsListArray.filter(m=>m.name.includes(n)),k=1;s=d.length>0?d.length:0,c.termlistEntries.forEach(m=>{d.some(y=>y.id===m.id)===!1?m.className="termlist-entry hidden":m.className=`termlist-entry ${k++%2?"odd":"even"}`})}else c.termlistEntries.forEach(d=>d.className="termlist-entry");let i=s>1||s===0?"matches":"match",r=n.length>=3?` ( ${s} ${i} <b>${Ee(n)}</b> )`:` ( ${s} found )`;c.navTitleFoundItems.forEach(d=>d.innerHTML=r),clearTimeout(c.transitionTimeoutId),c.transitionTimeoutId=setTimeout(()=>c.listContainer.classList.remove("notransitions"),250);let o=performance.now();Xe.log(`filterTermsList(): ${Math.round((o-t)*100)/100} ms.`)}var se=class extends Le{elementClicked(){if(this.clicked("button.play-button"))return j(this.event,S(this.querySelector("a").href));if(this.clicked("button.shuffle-button"))return _t(this.event,S(this.querySelector("a").href));if(this.clicked("button.share-find-button"))return $t(this.element);if(this.clicked("div.termlist-header"))return Mt(this.event);if(this.clicked("div.thumbnail"))return xt(this.event,this.element);if(this.clicked("a"))return It(this.event,this.element)}};function j(e,t,n=null){e?.preventDefault(),Ze(),sessionStorage.setItem(a.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:n,position:0})),A(t)}function _t(e,t){_(a.UF_RESHUFFLE,"true"),j(e,t)}function $t(e){let t=C(e,"data-term-name"),n=c.listContainer.getAttribute("data-term-type")==="channels"?"Channel Link":"Artist Link";Te.show({title:`Share / Find ${C(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:S(e.getAttribute("data-term-url")),urlType:n,verb:"Find",icon:"search"})}function xt(e,t){let n=c.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",s=C(t,"data-term-slug");if(f.playback.preferredPlayer===ce.GALLERY)j(e,t.getAttribute("data-term-url"),null);else{let i=parseInt(t.getAttribute("data-track-num")),r="";i>T.listPerPage&&(r=`page/${Math.ceil(i/T.listPerPage)}/`),j(e,`${O.siteUrl}/list/${n}/${s}/${r}`,C(t,"data-track-id"))}}function It(e,t){Ze(),t.closest("div.permalink")!==null&&V(e)}function Mt(e){let t=e.target.closest("div.termlist-entry"),n=t.querySelector("button.expand-toggle span"),s=t.querySelector("div.termlist-body"),i=t.getAttribute("data-is-expanded")==="1",r=t.getAttribute("data-is-fetched")==="1";t.setAttribute("data-is-expanded",i?"":"1"),n.textContent=i?"expand_more":"expand_less",s.style.display=i?"":"flex",!i&&!r&&ne(c.listContainer,t,s)}var Rt=v("index"),et={keyboardShortcuts:null},h={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{Rt.log("DOMContentLoaded"),Ut(),T?.get?.termlist?Qe():ie()&&Fe(),Ot(),Dt(),oe()});function Ut(){et.keyboardShortcuts=Ce(f.site.keyboardShortcuts),h.siteHeader=document.getElementById("site-header"),h.siteContent=document.getElementById("site-content"),h.siteContentSearch=document.querySelector("#site-content form input.search-field"),_e(),x.init(),P.init(),re.addEventListener(),qt.addEventListener(),document.addEventListener("fullscreenElement",e=>h.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",Ft),window.addEventListener("load",()=>b("aside.widget-area","click",V))}function Ft(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":P.isVisible()&&(e.preventDefault(),P.hide());return}if(et.keyboardShortcuts.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"L":F()&&!ie()&&(B.toggle(e),re.trigger());break;case"n":case"N":F()&&(e.preventDefault(),P.toggle());break;case"s":case"S":F()&&Ht()&&(e.preventDefault(),x.toggle());break;case"T":F()&&!ie()&&G.toggle(e);break;case"v":f.site.snackbarMessageLog&&F()&&(e.preventDefault(),N());break;case"ArrowLeft":e.shiftKey&&I()&&(e.preventDefault(),A(T.prevPage));break;case"ArrowRight":e.shiftKey&&I()&&(e.preventDefault(),A(T.nextPage));break}}function F(){return x.isVisible()===!1&&h.siteContentSearch!==document.activeElement}function ie(){return document.body.classList.contains("page-settings")}function Ht(){return h.fullscreenTarget===null}function Ot(){h.siteContentSearch!==null&&(h.siteContentSearch.focus(),h.siteContentSearch.setSelectionRange(9999,9999))}function Dt(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let n=t.pathname.slice(-1)==="/"?1:0,s=t.pathname.slice(1,t.pathname.length-n).replace(/-/gi," ").split("/");s.forEach((i,r)=>{e+=r+1<s.length?i+" / ":i})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var re=(()=>{let e=0;return{getSiteHeaderYOffset(){return e},addEventListener:t,trigger:n};function t(){n(),window.addEventListener("resize",n)}function n(){let s=0;I()?s=$("--site-header-height-no-playback"):s=$("--site-header-height"),e=Math.round(s>150?s/2:s/3),document.body.style.setProperty("--scrollbar-width",`${window.innerWidth-document.documentElement.clientWidth}px`)}})(),qt=(()=>{let e=0,t=0,n=0,s=!1,i=44;return{addEventListener:r};function r(){o(),window.addEventListener("scroll",o)}function o(){let y=window.scrollY;y===0?d():y>e?(n+=y-e,n>i&&y>re.getSiteHeaderYOffset()&&(t=0,k())):(t+=e-y,t>i&&(n=0,m())),e=y}function d(){h.siteHeader.classList.remove("scrolling-down","scrolling-up"),h.siteHeader.classList.add("hide-nav-menu"),x.hide(),P.hide()}function k(){s===!1&&(s=!0,X(h.siteHeader,"scrolling-up","scrolling-down"),x.hide(),P.hide())}function m(){s===!0&&(s=!1,X(h.siteHeader,"scrolling-down","scrolling-up"))}})();
//# sourceMappingURL=index.js.map
