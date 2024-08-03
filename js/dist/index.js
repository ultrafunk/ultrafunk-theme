import{A as ft,B as gt,C as $,Ca as wt,D as J,E as z,F as pt,G as v,H as w,I as S,Ia as At,J as N,K as yt,L as bt,M as St,N as X,Na as Pt,O as Et,S as vt,T as Ct,U as Tt,b as H,c as E,e as lt,f as ot,g as T,h as ct,i as D,k as a,l as O,la as kt,m as _,ma as q,n as R,na as Y,o as j,oa as Lt,p as ut,pa as x,q as dt,r as mt,s as k,t as h,v as ht,w as L,y as W,z as b,za as I}from"./chunk-SBLX3HMJ.js";var tt=E("theme-layout"),g=document.documentElement.classList,V={},K={};function _t(){tt.log("init()"),V=new Q("footer-site-theme-toggle"),K=new Z("footer-gallery-layout-toggle"),document.addEventListener("settingsUpdated",()=>{ht(),V.setCurrent(),K.setCurrent()})}function $t(t,e,n){let s=Object.values(t).find(i=>i.id===e);return s!==void 0?s:n}function xt(t,e){let n=Object.values(t).findIndex(i=>i.id===e.id),s=Object.keys(t);return n+1<s.length?t[s[n+1]]:t[s[0]]}var Q=class extends X{constructor(e){super(e,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},black:{id:"black",text:"black",class:"site-theme-black"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=$t(this.themes,h.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=xt(this.themes,this.currentTheme),h.site.theme=this.currentTheme.id}update(){let e=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),j(a.UF_SITE_THEME,e.id),g.contains(e.class)===!1&&(tt.log(`SiteThemeToggle.update() - newSiteTheme: ${e.id}`),g.remove(this.themes.light.class,this.themes.dark.class,this.themes.black.class),g.add(e.class)),this.value=this.currentTheme.text}},Z=class extends X{constructor(e){super(e,!1),this.minWidth=`(max-width: ${gt("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=$t(this.layouts,h.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(e){g.contains("gallery-layout")&&(e.matches?(g.remove(this.currentLayout.class),g.add(this.layouts.oneColumn.class)):(g.remove(this.layouts.oneColumn.class),g.add(this.currentLayout.class)))}toggle(){this.currentLayout=xt(this.layouts,this.currentLayout),h.gallery.layout=this.currentLayout.id}update(e){this.value=this.currentLayout.text,j(a.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(g.contains("gallery-layout")&&g.contains(this.currentLayout.class)===!1&&(tt.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),g.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),g.add(this.currentLayout.class)),e?.type==="click"&&this.element.scrollIntoView())}};var oe=E("settings-ui"),o={settings:null,container:null,updatedEvent:new Event("settingsUpdated")},M={containerId:"settings-container",saveResetId:"settings-save-reset"},p=[{name:"Playback",id:"playback",schema:T.playback},{name:"List Player",id:"list",schema:T.list},{name:"Gallery Player",id:"gallery",schema:T.gallery},{name:"Mobile",id:"mobile",schema:T.mobile},{name:"Site",id:"site",schema:T.site},{name:"Experimental",id:"experimental",schema:T.experimental}],ce=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear-container"><button type="button" class="settings-clear-button"><b>Clear All Settings</b></button></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function Ft(){if(oe.log("initSettingsUi"),o.container=document.getElementById(M.containerId),o.container!==null){if(document.URL.includes("?clear=true")){It();return}Ht(!1),o.settings!==null?(p.forEach(t=>de(o.settings[t.id],t.schema)),he(),o.container.style.opacity=1,o.container.addEventListener("click",t=>Mt(t)),o.container.addEventListener("contextmenu",t=>Mt(t)),b(`#${M.saveResetId} .settings-save-button`,"click",pe),b(`#${M.saveResetId} .settings-reset-button`,"click",ye),ue()):It()}}function It(){document.getElementById(M.saveResetId).style.display="none",o.container.insertAdjacentHTML("afterbegin",ce),o.container.style.minHeight="100%",o.container.style.opacity=1,b(`#${M.containerId} .settings-clear-button`,"click",()=>{localStorage.removeItem(a.UF_SETTINGS),localStorage.removeItem(a.UF_SITE_THEME),localStorage.removeItem(a.UF_GALLERY_LAYOUT),R(a.UF_GALLERY_PER_PAGE),R(a.UF_LIST_PER_PAGE),R(a.UF_PREFERRED_PLAYER),R(a.UF_SHUFFLE_UID),mt(!0),Ht(!0),o.settings!==null?L({message:"All settings have been cleared",duration:5,actionText:"Reload",actionClickCallback:()=>window.location.href="/settings/",afterCloseCallback:()=>window.location.href="/settings/"}):L({message:"Sorry, unable to clear all settings",duration:5})})}function ue(){window.addEventListener("beforeunload",t=>{o.container.querySelectorAll("table tr")?.forEach(e=>{e.classList.contains("value-changed")&&(t.preventDefault(),t.returnValue=!0)})})}function Ht(t=!1){o.settings=ut(a.UF_SETTINGS,t?ct:null,t)}function Dt(){dt(a.UF_SETTINGS,o.settings),_(a.UF_GALLERY_PER_PAGE,o.settings.gallery.tracksPerPage,O*5),_(a.UF_LIST_PER_PAGE,o.settings.list.tracksPerPage,O*5),_(a.UF_PREFERRED_PLAYER,o.settings.playback.preferredPlayer,O*5),document.dispatchEvent(o.updatedEvent)}function de(t,e){Object.entries(t).forEach(([n,s])=>{n in e&&(e[n].current=U(e[n],s),e[n].current===-1&&(e[n].current=U(e[n],e[n].default)))})}function me(t,e){Object.keys(t).forEach(n=>{n in e&&(t[n]=e[n].default,e[n].current=U(e[n],e[n].default))})}function U(t,e){return t.values.findIndex(n=>n===e)}function he(){let t=`
<h3>${p[0].name}</h3>
<table id="${p[0].id}-settings" class="settings">
<tbody>`;Object.entries(p[0].schema).forEach(e=>t+=Rt(p[0].id,e)),p.slice(1).forEach(e=>{t+=`
</tbody>
</table>
<h3>${e.name}</h3>
<table id="${e.id}-settings" class="settings">
<tbody>`,Object.entries(e.schema).forEach(n=>t+=Rt(e.id,n))}),o.container.insertAdjacentHTML("afterbegin",t+`
</tbody>
</table>
`)}function Rt(t,e){let n=e[1].valueStrings[U(e[1],e[1].default)];return`
<tr id="${t}:${e[0]}" class="settings-entry" title="Default: ${n}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${e[1].description}</td>
      <td class="${Ot(e[1])}">${e[1].valueStrings[e[1].current]}</td>
    </tr>`}function Ot(t){switch(t.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${t.values[t.current]===!0?"true":"false"}`}}function fe(t,e,n,s){s.current=s.current+1<s.values.length?s.current+1:s.current=0,o.settings[e][n]=s.values[s.current],o.settings[e][n]!==h[e][n]?t.classList.add("value-changed"):t.classList.remove("value-changed"),Nt(t.querySelector(".value-string"),s)}function Nt(t,e){t.classList=Ot(e),t.textContent=e.valueStrings[e.current]}function ge(t,e,n){Object.keys(t).forEach(s=>{s in e&&Nt(document.getElementById(`${n}:${s}`).querySelector(".value-string"),e[s])})}function Mt(t){let e=t.target.closest("tr");if(e!==null){let n=e.id.split(":")[0],s=e.id.split(":")[1],i=p.findIndex(r=>r.id===n);t.type==="contextmenu"?yt(t)&&(t.preventDefault(),Ut(n,s,i)):t.shiftKey===!0?Ut(n,s,i):fe(e,p[i].id,s,p[i].schema[s])}}function Ut(t,e,n){let s=p[n].schema[e],i=s.description,r="";D[t]!==void 0&&D[t][e]!==void 0&&(i=`<span class="normal-text">${i}: </span>${D[t][e]}`),s.valueStrings.forEach(l=>r+=`${l}, `),Tt({modalTitle:`${p[n].name} setting details`,modalBody:`<p><b>Description</b><br>${i}</p>
                 <p><b>Values</b><br>${r.slice(0,r.length-2)}</p>
                 <p><b>Current Value</b><br>${s.valueStrings[s.current]}</p>
                 <p><b>Default Value</b><br>${s.valueStrings[U(s,s.default)]}</p>`})}function qt(){o.container.querySelectorAll("table  tr")?.forEach(t=>t.classList.remove("value-changed"))}function pe(){Dt(),qt(),L({message:"All settings saved",duration:3})}function ye(){p.forEach(t=>{me(o.settings[t.id],t.schema),ge(o.settings[t.id],t.schema,t.id)}),qt(),L({message:"All settings reset",duration:4,actionText:"Undo",actionClickCallback:()=>location.reload(),afterCloseCallback:()=>Dt()})}var be=()=>{let t=null,e=null,n=null,s=null,i=!1,r=0;return window.addEventListener("load",()=>{b("#menu-primary-sections .menu-item-reshuffle a","click",wt),b("#menu-primary-sections .menu-item-pref-player","click",()=>At.toggle()),document.getElementById("menu-primary-channels")?.addEventListener("click",y)}),{isVisible(){return i},init:l,toggle:d,hide:m};function l(){t=document.getElementById("site-header"),e=document.querySelector("#site-navigation .nav-menu-outer"),n=document.querySelector("#site-navigation .nav-menu-inner"),s=document.getElementById("nav-menu-overlay"),ft("button.nav-menu-toggle","click",d),s.addEventListener("click",m),window.addEventListener("resize",()=>rt())}function d(){r=t.offsetHeight,i?m():C()}function C(){t.classList.contains("scrolling-down")===!1&&(i=!0,t.classList.remove("hide-nav-menu"),e.style.display="flex",s.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(h.site.overlayOpacity/100))/10})`,s.classList.add("show"),J(W.SITE_MAX_WIDTH_MOBILE)&&at("hidden","close","100vh"),rt())}function m(){i=!1,t.classList.add("hide-nav-menu"),e.style.display="",s.className="",at()}function y(P){let F=P.target.closest("li.menu-item.menu-item-object-uf_channel");F!==null&&(Pt()||I())&&(P?.preventDefault(),w(S(F.querySelector("a").href)))}function rt(){if(i&&J(W.SITE_MAX_WIDTH_MOBILE)){let P=$("margin-top",n)+$("margin-bottom",n);n.style=`overflow-y: auto; max-height: ${window.innerHeight-(r+P)}px`}}function at(P="",F="menu",ne=""){document.body.style.overflowY=P,t.querySelectorAll(".nav-menu-toggle span")?.forEach(se=>se.textContent=F),t.style.height=ne,n.style=""}},A=be();function Vt(t,e,n){let s=`<b>${t}</b>`;return n.forEach((i,r)=>{let l=vt(i.meta);s+=`
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
    </div>`}),s}function Kt(t,e){let n=`<b>${t}</b><br>`;return e.forEach(s=>n+=`<a href="${S(s.link)}">${s.name}</a>, `),n.slice(0,n.length-2)}function Gt(t,e,n){let s=`<b>${t}</b><br>`;return e.forEach(i=>{let r=S(`${H.siteUrl}/artist/${i.artist_slug}/?channel=${n}`);s+=`<a href="${r}">${i.artist_name}</a> (${i.track_count})<br>`}),s}var u={termCache:{}};function et(t,e,n){let s=v(t,"data-term-type"),i=parseInt(e.getAttribute("data-term-id")),r=v(e,"data-term-slug"),l=s==="channels";ve(s,i,l?10:50,async d=>{let C=l?"Latest Tracks":"All Tracks",m=n.querySelector(".body-left");d!==null?(m.innerHTML=Vt(C,r,d),e.setAttribute("data-is-fetched",1)):L({message:"Failed to fetch track data!",duration:30,actionText:"retry",actionClickCallback:()=>et(t,e,n)}),!l&&d!==null?Se(d,i,n):d!==null&&Ee(i,n,r)})}function Se(t,e,n){Ce(t,e,50,(s,i)=>{let r=s==="artists"?"Related Artists":"In Channels",l=s==="artists"?n.querySelector(".artists"):n.querySelector(".channels");i!==null?l.innerHTML=Kt(r,i):l.innerHTML=`<b>${r}</b><br>None found`})}async function Ee(t,e,n){if(!("topArtists"in u.termCache[t])){let s=await Y({endpoint:"top-artists",query:`channel_id=${t}`,path:"/wp-json/ultrafunk/v1/"});s.status.code===q.OK&&(u.termCache[t].topArtists=s.data)}e.querySelector(".top-artists").innerHTML=Gt("Top Artists (tracks)",u.termCache[t].topArtists,n)}async function ve(t,e,n,s){if(!(e in u.termCache)){let i=await Y({endpoint:"tracks",query:`${t}=${e}&per_page=${n}&_fields=id,link,artists,channels,meta`});i.status.code===q.OK&&(u.termCache[e]={tracks:i.data})}s(u.termCache[e]!==void 0?u.termCache[e].tracks:null)}function Ce(t,e,n,s){if("channels"in u.termCache[e]&&"artists"in u.termCache[e])s("channels",u.termCache[e].channels),s("artists",u.termCache[e].artists);else{let i=[],r=[];t.forEach(l=>{i.push.apply(i,l.channels),r.push.apply(r,l.artists)}),r=r.filter(l=>l!==e),Bt("channels",e,[...new Set(i)],n,s),Bt("artists",e,[...new Set(r)],n,s)}}async function Bt(t,e,n,s,i){if(n.length>0){let r=await Y({endpoint:t,query:`include=${n}&per_page=${s}&_fields=link,name`});r.status.code===q.OK&&(u.termCache[e][t]=r.data)}else u.termCache[e][t]=null;i(t,u.termCache[e][t]!==void 0?u.termCache[e][t]:null)}function jt(){u.termCache=JSON.parse(sessionStorage.getItem(a.UF_TERMLIST_CACHE)),u.termCache===null&&(u.termCache={})}function Wt(){sessionStorage.setItem(a.UF_TERMLIST_CACHE,JSON.stringify(u.termCache))}function Jt(){sessionStorage.removeItem(a.UF_TERMLIST_CACHE)}function zt(){return Object.keys(u.termCache).length>0}var Xt=E("artists-channels"),c={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},ke=new Event("allowKeyboardShortcuts"),Le=new Event("denyKeyboardShortcuts");function Qt(){Xt.log("initArtistsChannels()"),c.listContainer=document.getElementById("termlist-container"),c.uiElements=new nt("#termlist-container"),Ae(),we()}function Zt(){if(zt()){let t={pageUrl:window.location.href,scrollPos:Math.round(window.scrollY),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(e=>{e.getAttribute("data-is-expanded")==="1"&&t.openTermIds.push(e.id)}),sessionStorage.setItem(a.UF_TERMLIST_STATE,JSON.stringify(t)),Wt()}}function we(){if(jt(),performance.getEntriesByType("navigation")[0].type!=="reload"){let t=JSON.parse(sessionStorage.getItem(a.UF_TERMLIST_STATE));t!==null&&t.pageUrl===window.location.href?(history.scrollRestoration="manual",t.openTermIds.forEach(e=>{document.getElementById(e).querySelector("div.termlist-header").click()}),setTimeout(()=>{window.scroll({top:t.scrollPos,left:0})},0)):history.scrollRestoration="auto"}sessionStorage.removeItem(a.UF_TERMLIST_STATE),Jt()}function Ae(){c.listContainer.getAttribute("data-term-type")==="artists"&&(c.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),c.termlistFilterInput=document.getElementById("termlist-filter-input"),c.termlistEntries=c.listContainer.querySelectorAll(".termlist-entry"),c.termlistFilterInput.addEventListener("keyup",t=>Pe(t)),c.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(Le)),c.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(ke)),termsListArray.forEach(t=>t.name=t.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1),c.termlistFilterInput.focus())}function Pe(t){if(St(t.key))return;let e=performance.now(),n=c.termlistFilterInput.value.toLowerCase(),s=c.termlistEntries.length;if(c.listContainer.classList.add("notransitions"),n.length>=3){let d=termsListArray.filter(m=>m.name.includes(n)),C=1;s=d.length>0?d.length:0,c.termlistEntries.forEach(m=>{d.some(y=>y.id===m.id)===!1?m.className="termlist-entry hidden":m.className=`termlist-entry ${C++%2?"odd":"even"}`})}else c.termlistEntries.forEach(d=>d.className="termlist-entry");let i=s>1||s===0?"matches":"match",r=n.length>=3?` ( ${s} ${i} <b>${pt(n)}</b> )`:` ( ${s} found )`;c.navTitleFoundItems.forEach(d=>d.innerHTML=r),clearTimeout(c.transitionTimeoutId),c.transitionTimeoutId=setTimeout(()=>c.listContainer.classList.remove("notransitions"),250);let l=performance.now();Xt.log(`filterTermsList(): ${Math.round((l-e)*100)/100} ms.`)}var nt=class extends kt{elementClicked(){if(this.clicked("div.play-button"))return G(this.event,S(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return _e(this.event,S(this.querySelector("a").href));if(this.clicked("button.share-find-button"))return $e(this.element);if(this.clicked("div.termlist-header"))return Re(this.event);if(this.clicked("div.thumbnail"))return xe(this.event,this.element);if(this.clicked("a"))return Ie(this.event,this.element)}};function G(t,e,n=null){t?.preventDefault(),Zt(),sessionStorage.setItem(a.UF_AUTOPLAY,JSON.stringify({autoplay:t.shiftKey===!1,trackId:n,position:0})),w(e)}function _e(t,e){_(a.UF_RESHUFFLE,"true"),G(t,e)}function $e(t){let e=v(t,"data-term-name"),n=c.listContainer.getAttribute("data-term-type")==="channels"?"Channel link":"Artist link";Lt.show({title:`Share / Find ${v(t,"data-term-path")}`,bodyText:e,bodyHtml:`<b>${e}</b>`,url:S(t.getAttribute("data-term-url")),urlType:n,verb:"Find",icon:"search"})}function xe(t,e){let n=c.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",s=v(e,"data-term-slug");if(h.playback.preferredPlayer===ot.GALLERY||Ct(e)===Et.SOUNDCLOUD)G(t,e.getAttribute("data-term-url"),null);else{let i=parseInt(e.getAttribute("data-track-num")),r="";i>k.listPerPage&&(r=`page/${Math.ceil(i/k.listPerPage)}/`),G(t,`${H.siteUrl}/list/${n}/${s}/${r}`,v(e,"data-track-id"))}}function Ie(t,e){Zt(),e.closest("div.permalink")!==null&&N(t)}function Re(t){let e=t.target.closest("div.termlist-entry"),n=e.querySelector("button.expand-toggle span"),s=e.querySelector("div.termlist-body"),i=e.getAttribute("data-is-expanded")==="1",r=e.getAttribute("data-is-fetched")==="1";e.setAttribute("data-is-expanded",i?"":"1"),n.textContent=i?"expand_more":"expand_less",s.style.display=i?"":"flex",!i&&!r&&et(c.listContainer,e,s)}var te=E("index"),ee={keyboardShortcuts:null},f={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{te.log("DOMContentLoaded"),Me(),k?.get?.termlist?Qt():st()&&Ft(),He(),De(),lt()});function Me(){te.log("initIndex()"),ee.keyboardShortcuts=bt(h.site.keyboardShortcuts),f.siteHeader=document.getElementById("site-header"),f.siteContent=document.getElementById("site-content"),f.siteContentSearch=document.querySelector("#site-content form input.search-field"),_t(),x.init(),A.init(),it.addEventListener(),Oe.addEventListener(),document.addEventListener("fullscreenElement",t=>f.fullscreenTarget=t.fullscreenTarget),document.addEventListener("keydown",Ue),window.addEventListener("load",()=>b("aside.widget-area","click",N))}function Ue(t){if(t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"Escape":A.isVisible()&&(t.preventDefault(),A.hide());return}if(ee.keyboardShortcuts.allow()&&t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"L":B()&&!st()&&(K.toggle(t),it.trigger());break;case"n":case"N":B()&&(t.preventDefault(),A.toggle());break;case"s":case"S":B()&&Fe()&&(t.preventDefault(),x.toggle());break;case"T":B()&&!st()&&V.toggle(t);break;case"ArrowLeft":t.shiftKey&&I()&&(t.preventDefault(),w(k.prevPage));break;case"ArrowRight":t.shiftKey&&I()&&(t.preventDefault(),w(k.nextPage));break}}function B(){return x.isVisible()===!1&&f.siteContentSearch!==document.activeElement}function st(){return document.body.classList.contains("page-settings")}function Fe(){return f.fullscreenTarget===null}function He(){f.siteContentSearch!==null&&(f.siteContentSearch.focus(),f.siteContentSearch.setSelectionRange(9999,9999))}function De(){if(document.querySelector(".navbar-title .go-back-to")!==null){let t="";if(document.referrer.length===0)t="Previous Page";else{let e=new URL(decodeURIComponent(document.referrer));if(e.search.length!==0)t="Search Results";else if(e.pathname.length>1){let n=e.pathname.slice(-1)==="/"?1:0,s=e.pathname.slice(1,e.pathname.length-n).replace(/-/gi," ").split("/");s.forEach((i,r)=>{t+=r+1<s.length?i+" / ":i})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(e=>{e.querySelector(".go-back-title").textContent=t.length>0?t:"Ultrafunk (home)",e.querySelector(".go-back-to").style.opacity=1})}}var it=(()=>{let t=0;return{getSiteHeaderYOffset(){return t},addEventListener:e,trigger:n};function e(){n(),window.addEventListener("resize",n)}function n(){let s=0;I()?s=$("--site-header-height-no-playback"):s=$("--site-header-height"),t=Math.round(s>150?s/2:s/3),document.body.style.setProperty("--scrollbar-width",`${window.innerWidth-document.documentElement.clientWidth}px`)}})(),Oe=(()=>{let t=0,e=0,n=0,s=!1,i=44;return{addEventListener:r};function r(){l(),window.addEventListener("scroll",l)}function l(){let y=window.scrollY;y===0?d():y>t?(n+=y-t,n>i&&y>it.getSiteHeaderYOffset()&&(e=0,C())):(e+=t-y,e>i&&(n=0,m())),t=y}function d(){f.siteHeader.classList.remove("scrolling-down","scrolling-up"),f.siteHeader.classList.add("hide-nav-menu"),x.hide(),A.hide()}function C(){s===!1&&(s=!0,z(f.siteHeader,"scrolling-up","scrolling-down"),x.hide(),A.hide())}function m(){s===!0&&(s=!1,z(f.siteHeader,"scrolling-down","scrolling-up"))}})();
//# sourceMappingURL=index.js.map
