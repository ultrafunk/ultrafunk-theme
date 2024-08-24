import{A as ft,C as gt,D as L,Da as I,F as pt,G as W,Ga as wt,H as b,I as yt,J as bt,K as $,L as J,M as z,N as St,O as Et,Oa as At,P as C,Q as w,R as S,S as q,T as vt,Ta as Pt,U as Ct,V as kt,W as X,b as D,c as v,e as lt,f as ot,g as P,h as ct,i as O,k as a,l as N,m as _,n as R,na as Tt,o as j,oa as Y,p as ut,pa as V,q as dt,qa as Lt,r as mt,ra as x,s as T,t as p,v as ht}from"./chunk-66ANW7IW.js";var tt=v("theme-layout"),f=document.documentElement.classList,K={},G={};function _t(){tt.log("init()"),K=new Q("footer-site-theme-toggle"),G=new Z("footer-gallery-layout-toggle"),document.addEventListener("settingsUpdated",()=>{ht(),K.setCurrent(),G.setCurrent()})}function $t(t,e,s){let n=Object.values(t).find(i=>i.id===e);return n!==void 0?n:s}function xt(t,e){let s=Object.values(t).findIndex(i=>i.id===e.id),n=Object.keys(t);return s+1<n.length?t[n[s+1]]:t[n[0]]}var Q=class extends X{constructor(e){super(e,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},black:{id:"black",text:"black",class:"site-theme-black"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=$t(this.themes,p.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=xt(this.themes,this.currentTheme),p.site.theme=this.currentTheme.id}update(){let e=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),j(a.UF_SITE_THEME,e.id),f.contains(e.class)===!1&&(tt.log(`SiteThemeToggle.update() - newSiteTheme: ${e.id}`),f.remove(this.themes.light.class,this.themes.dark.class,this.themes.black.class),f.add(e.class)),this.value=this.currentTheme.text}},Z=class extends X{constructor(e){super(e,!1),this.minWidth=`(max-width: ${bt("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",s=>this.matchMediaMinWidth(s))}setCurrent(){this.currentLayout=$t(this.layouts,p.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(e){f.contains("gallery-layout")&&(e.matches?(f.remove(this.currentLayout.class),f.add(this.layouts.oneColumn.class)):(f.remove(this.layouts.oneColumn.class),f.add(this.currentLayout.class)))}toggle(){this.currentLayout=xt(this.layouts,this.currentLayout),p.gallery.layout=this.currentLayout.id}update(e){this.value=this.currentLayout.text,j(a.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(f.contains("gallery-layout")&&f.contains(this.currentLayout.class)===!1&&(tt.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),f.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),f.add(this.currentLayout.class)),e?.type==="click"&&this.element.scrollIntoView())}};var le=v("settings-ui"),o={settings:null,container:null,updatedEvent:new Event("settingsUpdated")},M={containerId:"settings-container",saveResetId:"settings-save-reset"},g=[{name:"Playback",id:"playback",schema:P.playback},{name:"List Player",id:"list",schema:P.list},{name:"Gallery Player",id:"gallery",schema:P.gallery},{name:"Mobile",id:"mobile",schema:P.mobile},{name:"Site",id:"site",schema:P.site}],oe=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear-container"><button type="button" class="settings-clear-button"><b>Clear All Settings</b></button></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function Ft(){if(le.log("initSettingsUi"),o.container=document.getElementById(M.containerId),o.container!==null){if(document.URL.includes("?clear=true")){It();return}Ht(!1),o.settings!==null?(g.forEach(t=>ue(o.settings[t.id],t.schema)),me(),o.container.style.opacity=1,o.container.addEventListener("click",t=>Mt(t)),o.container.addEventListener("contextmenu",t=>Mt(t)),b(`#${M.saveResetId} .settings-save-button`,"click",ge),b(`#${M.saveResetId} .settings-reset-button`,"click",pe),ce()):It()}}function It(){document.getElementById(M.saveResetId).style.display="none",o.container.insertAdjacentHTML("afterbegin",oe),o.container.style.minHeight="100%",o.container.style.opacity=1,b(`#${M.containerId} .settings-clear-button`,"click",()=>{localStorage.removeItem(a.UF_SETTINGS),localStorage.removeItem(a.UF_SITE_THEME),localStorage.removeItem(a.UF_GALLERY_LAYOUT),R(a.UF_GALLERY_PER_PAGE),R(a.UF_LIST_PER_PAGE),R(a.UF_PREFERRED_PLAYER),R(a.UF_SHUFFLE_UID),mt(!0),Ht(!0),o.settings!==null?L({message:"All settings have been cleared",duration:5,actionText:"Reload",actionClickCallback:()=>window.location.href="/settings/",afterCloseCallback:()=>window.location.href="/settings/"}):L({message:"Sorry, unable to clear all settings",duration:5})})}function ce(){window.addEventListener("beforeunload",t=>{o.container.querySelectorAll("table tr")?.forEach(e=>{e.classList.contains("value-changed")&&(t.preventDefault(),t.returnValue=!0)})})}function Ht(t=!1){o.settings=ut(a.UF_SETTINGS,t?ct:null,t)}function Dt(){dt(a.UF_SETTINGS,o.settings),_(a.UF_GALLERY_PER_PAGE,o.settings.gallery.tracksPerPage,N*5),_(a.UF_LIST_PER_PAGE,o.settings.list.tracksPerPage,N*5),_(a.UF_PREFERRED_PLAYER,o.settings.playback.preferredPlayer,N*5),document.dispatchEvent(o.updatedEvent)}function ue(t,e){Object.entries(t).forEach(([s,n])=>{s in e&&(e[s].current=U(e[s],n),e[s].current===-1&&(e[s].current=U(e[s],e[s].default)))})}function de(t,e){Object.keys(t).forEach(s=>{s in e&&(t[s]=e[s].default,e[s].current=U(e[s],e[s].default))})}function U(t,e){return t.values.findIndex(s=>s===e)}function me(){let t=`
<h3>${g[0].name}</h3>
<table id="${g[0].id}-settings" class="settings">
<tbody>`;Object.entries(g[0].schema).forEach(e=>t+=Rt(g[0].id,e)),g.slice(1).forEach(e=>{t+=`
</tbody>
</table>
<h3>${e.name}</h3>
<table id="${e.id}-settings" class="settings">
<tbody>`,Object.entries(e.schema).forEach(s=>t+=Rt(e.id,s))}),o.container.insertAdjacentHTML("afterbegin",t+`
</tbody>
</table>
`)}function Rt(t,e){let s=e[1].valueStrings[U(e[1],e[1].default)];return`
<tr id="${t}:${e[0]}" class="settings-entry" title="Default: ${s}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${e[1].description}</td>
      <td class="${Ot(e[1])}">${e[1].valueStrings[e[1].current]}</td>
    </tr>`}function Ot(t){switch(t.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${t.values[t.current]===!0?"true":"false"}`}}function he(t,e,s,n){n.current=n.current+1<n.values.length?n.current+1:n.current=0,o.settings[e][s]=n.values[n.current],o.settings[e][s]!==p[e][s]?t.classList.add("value-changed"):t.classList.remove("value-changed"),Nt(t.querySelector(".value-string"),n)}function Nt(t,e){t.classList=Ot(e),t.textContent=e.valueStrings[e.current]}function fe(t,e,s){Object.keys(t).forEach(n=>{n in e&&Nt(document.getElementById(`${s}:${n}`).querySelector(".value-string"),e[n])})}function Mt(t){let e=t.target.closest("tr");if(e!==null){let s=e.id.split(":")[0],n=e.id.split(":")[1],i=g.findIndex(r=>r.id===s);t.type==="contextmenu"?vt(t)&&(t.preventDefault(),Ut(s,n,i)):t.shiftKey===!0?Ut(s,n,i):he(e,g[i].id,n,g[i].schema[n])}}function Ut(t,e,s){let n=g[s].schema[e],i=n.description,r="";O[t]!==void 0&&O[t][e]!==void 0&&(i=`<span class="normal-text">${i}: </span>${O[t][e]}`),n.valueStrings.forEach(l=>r+=`${l}, `),gt({modalTitle:`${g[s].name} setting details`,modalBody:`<p><b>Description</b><br>${i}</p>
                 <p><b>Values</b><br>${r.slice(0,r.length-2)}</p>
                 <p><b>Current Value</b><br>${n.valueStrings[n.current]}</p>
                 <p><b>Default Value</b><br>${n.valueStrings[U(n,n.default)]}</p>`})}function qt(){o.container.querySelectorAll("table  tr")?.forEach(t=>t.classList.remove("value-changed"))}function ge(){Dt(),qt(),L({message:"All settings saved",duration:3})}function pe(){g.forEach(t=>{de(o.settings[t.id],t.schema),fe(o.settings[t.id],t.schema,t.id)}),qt(),L({message:"All settings reset",duration:4,actionText:"Undo",actionClickCallback:()=>location.reload(),afterCloseCallback:()=>Dt()})}var ye=()=>{let t=null,e=null,s=null,n=null,i=!1,r=0;return window.addEventListener("load",()=>{b("#menu-primary-sections .menu-item-reshuffle a","click",wt),b("#menu-primary-sections .menu-item-pref-player","click",E=>{E.preventDefault(),At.toggle()}),document.getElementById("menu-primary-channels")?.addEventListener("click",y)}),{isVisible(){return i},init:l,toggle:d,hide:m};function l(){t=document.getElementById("site-header"),e=document.querySelector("#site-navigation .nav-menu-outer"),s=document.querySelector("#site-navigation .nav-menu-inner"),n=document.getElementById("nav-menu-overlay"),yt("button.nav-menu-toggle","click",d),n.addEventListener("click",m),window.addEventListener("resize",()=>rt())}function d(){r=t.offsetHeight,i?m():k()}function k(){t.classList.contains("scrolling-down")===!1&&(i=!0,t.classList.remove("hide-nav-menu"),e.style.display="flex",n.style.backgroundColor=St(),n.classList.add("show"),J(W.SITE_MAX_WIDTH_MOBILE)&&at("hidden","close","100vh"),rt())}function m(){i=!1,t.classList.add("hide-nav-menu"),e.style.display="",n.className="",at()}function y(E){let H=E.target.closest("li.menu-item.menu-item-object-uf_channel");H!==null&&(Pt()||I())&&(E?.preventDefault(),w(S(H.querySelector("a").href)))}function rt(){if(i&&J(W.SITE_MAX_WIDTH_MOBILE)){let E=$("margin-top",s)+$("margin-bottom",s);s.style=`overflow-y: auto; max-height: ${window.innerHeight-(r+E)}px`}}function at(E="",H="menu",ee=""){document.body.style.overflowY=E,t.querySelectorAll(".nav-menu-toggle span")?.forEach(se=>se.textContent=H),t.style.height=ee,s.style=""}},A=ye();function Vt(t,e,s){let n=`<b>${t}</b>`;return s.forEach((i,r)=>{let l=ft(i.meta);n+=`
    <div class="track">
      <div class="thumbnail ${l.class}"
        data-term-url="${i.link}"
        data-term-slug="${e}"
        data-track-num="${r+1}"
        data-track-type="${i.meta.track_source_type}"
        data-track-id="track-${i.id}"
        data-track-source-uid="${l.uid}" title="Play Track"
        >
        <img src="${l.src}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${i.link}" title="Go to track"><span><b>${i.meta.track_artist}</b></span><br><span>${i.meta.track_title}</span></a>
      </div>
    </div>`}),n}function Kt(t,e){let s=`<b>${t}</b><br>`;return e.forEach(n=>s+=`<a href="${S(n.link)}">${n.name}</a>, `),s.slice(0,s.length-2)}function Gt(t,e,s){let n=`<b>${t}</b><br>`;return e.forEach(i=>{let r=S(`${D.siteUrl}/artist/${i.artist_slug}/?channel=${s}`);n+=`<a href="${r}">${i.artist_name}</a> (${i.track_count})<br>`}),n}var u={termCache:{}};function et(t,e,s){let n=C(t,"data-term-type"),i=parseInt(e.getAttribute("data-term-id")),r=C(e,"data-term-slug"),l=n==="channels";Ee(n,i,l?10:50,d=>{let k=l?"Latest Tracks":"All Tracks",m=s.querySelector(".body-left");d!==null?(m.innerHTML=Vt(k,r,d),e.setAttribute("data-is-fetched",1)):L({message:"Failed to fetch track data!",duration:30,actionText:"retry",actionClickCallback:()=>et(t,e,s)}),!l&&d!==null?be(d,i,s):d!==null&&Se(i,s,r)})}function be(t,e,s){ve(t,e,50,(n,i)=>{let r=n==="artists"?"Related Artists":"In Channels",l=n==="artists"?s.querySelector(".artists"):s.querySelector(".channels");i!==null?l.innerHTML=Kt(r,i):l.innerHTML=`<b>${r}</b><br>None found`})}async function Se(t,e,s){if(!("topArtists"in u.termCache[t])){let n=await V({endpoint:"top-artists",query:`channel_id=${t}`,path:"/wp-json/ultrafunk/v1/"});n.status.code===Y.OK&&(u.termCache[t].topArtists=n.data)}e.querySelector(".top-artists").innerHTML=Gt("Top Artists (tracks)",u.termCache[t].topArtists,s)}async function Ee(t,e,s,n){if(!(e in u.termCache)){let i=await V({endpoint:"tracks",query:`${t}=${e}&per_page=${s}&_fields=id,link,artists,channels,meta`});i.status.code===Y.OK&&(u.termCache[e]={tracks:i.data})}n(u.termCache[e]!==void 0?u.termCache[e].tracks:null)}function ve(t,e,s,n){if("channels"in u.termCache[e]&&"artists"in u.termCache[e])n("channels",u.termCache[e].channels),n("artists",u.termCache[e].artists);else{let i=[],r=[];t.forEach(l=>{i.push.apply(i,l.channels),r.push.apply(r,l.artists)}),r=r.filter(l=>l!==e),Bt("channels",e,[...new Set(i)],s,n),Bt("artists",e,[...new Set(r)],s,n)}}async function Bt(t,e,s,n,i){if(s.length>0){let r=await V({endpoint:t,query:`include=${s}&per_page=${n}&_fields=link,name`});r.status.code===Y.OK&&(u.termCache[e][t]=r.data)}else u.termCache[e][t]=null;i(t,u.termCache[e][t]!==void 0?u.termCache[e][t]:null)}function jt(){u.termCache=JSON.parse(sessionStorage.getItem(a.UF_TERMLIST_CACHE)),u.termCache===null&&(u.termCache={})}function Wt(){sessionStorage.setItem(a.UF_TERMLIST_CACHE,JSON.stringify(u.termCache))}function Jt(){sessionStorage.removeItem(a.UF_TERMLIST_CACHE)}function zt(){return Object.keys(u.termCache).length>0}var Xt=v("artists-channels"),c={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},ke=new Event("allowKeyboardShortcuts"),Te=new Event("denyKeyboardShortcuts");function Qt(){Xt.log("initArtistsChannels()"),c.listContainer=document.getElementById("termlist-container"),c.uiElements=new st("#termlist-container"),we(),Le()}function Zt(){if(zt()){let t={pageUrl:window.location.href,scrollPos:Math.round(window.scrollY),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(e=>{e.getAttribute("data-is-expanded")==="1"&&t.openTermIds.push(e.id)}),sessionStorage.setItem(a.UF_TERMLIST_STATE,JSON.stringify(t)),Wt()}}function Le(){if(jt(),performance.getEntriesByType("navigation")[0].type!=="reload"){let t=JSON.parse(sessionStorage.getItem(a.UF_TERMLIST_STATE));t!==null&&t.pageUrl===window.location.href?(history.scrollRestoration="manual",t.openTermIds.forEach(e=>{document.getElementById(e).querySelector("div.termlist-header").click()}),setTimeout(()=>{window.scroll({top:t.scrollPos,left:0})},0)):history.scrollRestoration="auto"}sessionStorage.removeItem(a.UF_TERMLIST_STATE),Jt()}function we(){c.listContainer.getAttribute("data-term-type")==="artists"&&(c.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),c.termlistFilterInput=document.getElementById("termlist-filter-input"),c.termlistEntries=c.listContainer.querySelectorAll(".termlist-entry"),c.termlistFilterInput.addEventListener("keyup",t=>Ae(t)),c.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(Te)),c.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(ke)),termsListArray.forEach(t=>t.name=t.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1),c.termlistFilterInput.focus())}function Ae(t){if(kt(t.key))return;let e=performance.now(),s=c.termlistFilterInput.value.toLowerCase(),n=c.termlistEntries.length;if(c.listContainer.classList.add("notransitions"),s.length>=3){let d=termsListArray.filter(m=>m.name.includes(s)),k=1;n=d.length>0?d.length:0,c.termlistEntries.forEach(m=>{d.some(y=>y.id===m.id)===!1?m.className="termlist-entry hidden":m.className=`termlist-entry ${k++%2?"odd":"even"}`})}else c.termlistEntries.forEach(d=>d.className="termlist-entry");let i=n>1||n===0?"matches":"match",r=s.length>=3?` ( ${n} ${i} <b>${Et(s)}</b> )`:` ( ${n} found )`;c.navTitleFoundItems.forEach(d=>d.innerHTML=r),clearTimeout(c.transitionTimeoutId),c.transitionTimeoutId=setTimeout(()=>c.listContainer.classList.remove("notransitions"),250);let l=performance.now();Xt.log(`filterTermsList(): ${Math.round((l-e)*100)/100} ms.`)}var st=class extends Tt{elementClicked(){if(this.clicked("div.play-button"))return B(this.event,S(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return Pe(this.event,S(this.querySelector("a").href));if(this.clicked("button.share-find-button"))return _e(this.element);if(this.clicked("div.termlist-header"))return Ie(this.event);if(this.clicked("div.thumbnail"))return $e(this.event,this.element);if(this.clicked("a"))return xe(this.event,this.element)}};function B(t,e,s=null){t?.preventDefault(),Zt(),sessionStorage.setItem(a.UF_AUTOPLAY,JSON.stringify({autoplay:t.shiftKey===!1,trackId:s,position:0})),w(e)}function Pe(t,e){_(a.UF_RESHUFFLE,"true"),B(t,e)}function _e(t){let e=C(t,"data-term-name"),s=c.listContainer.getAttribute("data-term-type")==="channels"?"Channel link":"Artist link";Lt.show({title:`Share / Find ${C(t,"data-term-path")}`,bodyText:e,bodyHtml:`<b>${e}</b>`,url:S(t.getAttribute("data-term-url")),urlType:s,verb:"Find",icon:"search"})}function $e(t,e){let s=c.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",n=C(e,"data-term-slug");if(p.playback.preferredPlayer===ot.GALLERY)B(t,e.getAttribute("data-term-url"),null);else{let i=parseInt(e.getAttribute("data-track-num")),r="";i>T.listPerPage&&(r=`page/${Math.ceil(i/T.listPerPage)}/`),B(t,`${D.siteUrl}/list/${s}/${n}/${r}`,C(e,"data-track-id"))}}function xe(t,e){Zt(),e.closest("div.permalink")!==null&&q(t)}function Ie(t){let e=t.target.closest("div.termlist-entry"),s=e.querySelector("button.expand-toggle span"),n=e.querySelector("div.termlist-body"),i=e.getAttribute("data-is-expanded")==="1",r=e.getAttribute("data-is-fetched")==="1";e.setAttribute("data-is-expanded",i?"":"1"),s.textContent=i?"expand_more":"expand_less",n.style.display=i?"":"flex",!i&&!r&&et(c.listContainer,e,n)}var Re=v("index"),te={keyboardShortcuts:null},h={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{Re.log("DOMContentLoaded"),Me(),T?.get?.termlist?Qt():nt()&&Ft(),He(),De(),lt()});function Me(){te.keyboardShortcuts=Ct(p.site.keyboardShortcuts),h.siteHeader=document.getElementById("site-header"),h.siteContent=document.getElementById("site-content"),h.siteContentSearch=document.querySelector("#site-content form input.search-field"),_t(),x.init(),A.init(),it.addEventListener(),Oe.addEventListener(),document.addEventListener("fullscreenElement",t=>h.fullscreenTarget=t.fullscreenTarget),document.addEventListener("keydown",Ue),window.addEventListener("load",()=>b("aside.widget-area","click",q))}function Ue(t){if(t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"Escape":A.isVisible()&&(t.preventDefault(),A.hide());return}if(te.keyboardShortcuts.allow()&&t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"L":F()&&!nt()&&(G.toggle(t),it.trigger());break;case"n":case"N":F()&&(t.preventDefault(),A.toggle());break;case"s":case"S":F()&&Fe()&&(t.preventDefault(),x.toggle());break;case"T":F()&&!nt()&&K.toggle(t);break;case"v":F()&&(t.preventDefault(),pt());break;case"ArrowLeft":t.shiftKey&&I()&&(t.preventDefault(),w(T.prevPage));break;case"ArrowRight":t.shiftKey&&I()&&(t.preventDefault(),w(T.nextPage));break}}function F(){return x.isVisible()===!1&&h.siteContentSearch!==document.activeElement}function nt(){return document.body.classList.contains("page-settings")}function Fe(){return h.fullscreenTarget===null}function He(){h.siteContentSearch!==null&&(h.siteContentSearch.focus(),h.siteContentSearch.setSelectionRange(9999,9999))}function De(){if(document.querySelector(".navbar-title .go-back-to")!==null){let t="";if(document.referrer.length===0)t="Previous Page";else{let e=new URL(decodeURIComponent(document.referrer));if(e.search.length!==0)t="Search Results";else if(e.pathname.length>1){let s=e.pathname.slice(-1)==="/"?1:0,n=e.pathname.slice(1,e.pathname.length-s).replace(/-/gi," ").split("/");n.forEach((i,r)=>{t+=r+1<n.length?i+" / ":i})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(e=>{e.querySelector(".go-back-title").textContent=t.length>0?t:"Ultrafunk (home)",e.querySelector(".go-back-to").style.opacity=1})}}var it=(()=>{let t=0;return{getSiteHeaderYOffset(){return t},addEventListener:e,trigger:s};function e(){s(),window.addEventListener("resize",s)}function s(){let n=0;I()?n=$("--site-header-height-no-playback"):n=$("--site-header-height"),t=Math.round(n>150?n/2:n/3),document.body.style.setProperty("--scrollbar-width",`${window.innerWidth-document.documentElement.clientWidth}px`)}})(),Oe=(()=>{let t=0,e=0,s=0,n=!1,i=44;return{addEventListener:r};function r(){l(),window.addEventListener("scroll",l)}function l(){let y=window.scrollY;y===0?d():y>t?(s+=y-t,s>i&&y>it.getSiteHeaderYOffset()&&(e=0,k())):(e+=t-y,e>i&&(s=0,m())),t=y}function d(){h.siteHeader.classList.remove("scrolling-down","scrolling-up"),h.siteHeader.classList.add("hide-nav-menu"),x.hide(),A.hide()}function k(){n===!1&&(n=!0,z(h.siteHeader,"scrolling-up","scrolling-down"),x.hide(),A.hide())}function m(){n===!0&&(n=!1,z(h.siteHeader,"scrolling-down","scrolling-up"))}})();
//# sourceMappingURL=index.js.map
