import{A as ht,E as W,F as b,G as ft,H as gt,I as $,J,K as z,L as pt,La as x,M as v,N as k,O as S,Oa as Lt,P as N,Q as yt,R as bt,S as St,T as Et,U as vt,Ua as wt,V as X,W as Ct,Za as At,b as H,c as E,e as at,f as lt,g as A,h as ot,i as D,k as l,l as O,m as P,n as R,o as j,oa as Tt,p as ct,pa as q,q as ut,qa as Y,r as dt,ra as kt,s as _,t as h,ta as I,v as mt,w as T}from"./chunk-HU2HVJ7Q.js";var tt=E("theme-layout"),g=document.documentElement.classList,V={},K={};function Pt(){tt.log("init()"),V=new Q("footer-site-theme-toggle"),K=new Z("footer-gallery-layout-toggle"),document.addEventListener("settingsUpdated",()=>{mt(),V.setCurrent(),K.setCurrent()})}function _t(t,e,n){let s=Object.values(t).find(i=>i.id===e);return s!==void 0?s:n}function $t(t,e){let n=Object.values(t).findIndex(i=>i.id===e.id),s=Object.keys(t);return n+1<s.length?t[s[n+1]]:t[s[0]]}var Q=class extends X{constructor(e){super(e,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},black:{id:"black",text:"black",class:"site-theme-black"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=_t(this.themes,h.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=$t(this.themes,this.currentTheme),h.site.theme=this.currentTheme.id}update(){let e=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),j(l.UF_SITE_THEME,e.id),g.contains(e.class)===!1&&(tt.log(`SiteThemeToggle.update() - newSiteTheme: ${e.id}`),g.remove(this.themes.light.class,this.themes.dark.class,this.themes.black.class),g.add(e.class)),this.value=this.currentTheme.text}},Z=class extends X{constructor(e){super(e,!1),this.minWidth=`(max-width: ${gt("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=_t(this.layouts,h.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(e){g.contains("gallery-layout")&&(e.matches?(g.remove(this.currentLayout.class),g.add(this.layouts.oneColumn.class)):(g.remove(this.layouts.oneColumn.class),g.add(this.currentLayout.class)))}toggle(){this.currentLayout=$t(this.layouts,this.currentLayout),h.gallery.layout=this.currentLayout.id}update(e){this.value=this.currentLayout.text,j(l.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(g.contains("gallery-layout")&&g.contains(this.currentLayout.class)===!1&&(tt.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),g.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),g.add(this.currentLayout.class)),e?.type==="click"&&this.element.scrollIntoView())}};var oe=E("settings-ui"),o={settings:null,container:null,updatedEvent:new Event("settingsUpdated")},U={containerId:"settings-container",saveResetId:"settings-save-reset"},p=[{name:"Playback",id:"playback",schema:A.playback},{name:"List Player",id:"list",schema:A.list},{name:"Gallery Player",id:"gallery",schema:A.gallery},{name:"Mobile",id:"mobile",schema:A.mobile},{name:"Site",id:"site",schema:A.site}],ce=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear-container"><button type="button" class="settings-clear-button"><b>Clear All Settings</b></button></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function Mt(){if(oe.log("initSettingsUi"),o.container=document.getElementById(U.containerId),o.container!==null){if(document.URL.includes("?clear=true")){It();return}Ft(!1),o.settings!==null?(p.forEach(t=>de(o.settings[t.id],t.schema)),he(),o.container.style.opacity=1,o.container.addEventListener("click",t=>Rt(t)),o.container.addEventListener("contextmenu",t=>Rt(t)),b(`#${U.saveResetId} .settings-save-button`,"click",pe),b(`#${U.saveResetId} .settings-reset-button`,"click",ye),ue()):It()}}function It(){document.getElementById(U.saveResetId).style.display="none",o.container.insertAdjacentHTML("afterbegin",ce),o.container.style.minHeight="100%",o.container.style.opacity=1,b(`#${U.containerId} .settings-clear-button`,"click",()=>{localStorage.removeItem(l.UF_SETTINGS),localStorage.removeItem(l.UF_SITE_THEME),localStorage.removeItem(l.UF_GALLERY_LAYOUT),R(l.UF_GALLERY_PER_PAGE),R(l.UF_LIST_PER_PAGE),R(l.UF_PREFERRED_PLAYER),R(l.UF_SHUFFLE_UID),dt(!0),Ft(!0),o.settings!==null?T({message:"All settings have been cleared",duration:5,actionText:"Reload",actionClickCallback:()=>window.location.href="/settings/",afterCloseCallback:()=>window.location.href="/settings/"}):T({message:"Sorry, unable to clear all settings",duration:5})})}function ue(){window.addEventListener("beforeunload",t=>{o.container.querySelectorAll("table tr")?.forEach(e=>{e.classList.contains("value-changed")&&(t.preventDefault(),t.returnValue=!0)})})}function Ft(t=!1){o.settings=ct(l.UF_SETTINGS,t?ot:null,t)}function Ht(){ut(l.UF_SETTINGS,o.settings),P(l.UF_GALLERY_PER_PAGE,o.settings.gallery.tracksPerPage,O*5),P(l.UF_LIST_PER_PAGE,o.settings.list.tracksPerPage,O*5),P(l.UF_PREFERRED_PLAYER,o.settings.playback.preferredPlayer,O*5),document.dispatchEvent(o.updatedEvent)}function de(t,e){Object.entries(t).forEach(([n,s])=>{n in e&&(e[n].current=M(e[n],s),e[n].current===-1&&(e[n].current=M(e[n],e[n].default)))})}function me(t,e){Object.keys(t).forEach(n=>{n in e&&(t[n]=e[n].default,e[n].current=M(e[n],e[n].default))})}function M(t,e){return t.values.findIndex(n=>n===e)}function he(){let t=`
<h3>${p[0].name}</h3>
<table id="${p[0].id}-settings" class="settings">
<tbody>`;Object.entries(p[0].schema).forEach(e=>t+=xt(p[0].id,e)),p.slice(1).forEach(e=>{t+=`
</tbody>
</table>
<h3>${e.name}</h3>
<table id="${e.id}-settings" class="settings">
<tbody>`,Object.entries(e.schema).forEach(n=>t+=xt(e.id,n))}),o.container.insertAdjacentHTML("afterbegin",t+`
</tbody>
</table>
`)}function xt(t,e){let n=e[1].valueStrings[M(e[1],e[1].default)];return`
<tr id="${t}:${e[0]}" class="settings-entry" title="Default: ${n}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${e[1].description}</td>
      <td class="${Dt(e[1])}">${e[1].valueStrings[e[1].current]}</td>
    </tr>`}function Dt(t){switch(t.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${t.values[t.current]===!0?"true":"false"}`}}function fe(t,e,n,s){s.current=s.current+1<s.values.length?s.current+1:s.current=0,o.settings[e][n]=s.values[s.current],o.settings[e][n]!==h[e][n]?t.classList.add("value-changed"):t.classList.remove("value-changed"),Ot(t.querySelector(".value-string"),s)}function Ot(t,e){t.classList=Dt(e),t.textContent=e.valueStrings[e.current]}function ge(t,e,n){Object.keys(t).forEach(s=>{s in e&&Ot(document.getElementById(`${n}:${s}`).querySelector(".value-string"),e[s])})}function Rt(t){let e=t.target.closest("tr");if(e!==null){let n=e.id.split(":")[0],s=e.id.split(":")[1],i=p.findIndex(r=>r.id===n);t.type==="contextmenu"?St(t)&&(t.preventDefault(),Ut(n,s,i)):t.shiftKey===!0?Ut(n,s,i):fe(e,p[i].id,s,p[i].schema[s])}}function Ut(t,e,n){let s=p[n].schema[e],i=s.description,r="";D[t]!==void 0&&D[t][e]!==void 0&&(i=`<span class="normal-text">${i}: </span>${D[t][e]}`),s.valueStrings.forEach(a=>r+=`${a}, `),Ct({modalTitle:`${p[n].name} setting details`,modalBody:`<p><b>Description</b><br>${i}</p>
                 <p><b>Values</b><br>${r.slice(0,r.length-2)}</p>
                 <p><b>Current Value</b><br>${s.valueStrings[s.current]}</p>
                 <p><b>Default Value</b><br>${s.valueStrings[M(s,s.default)]}</p>`})}function Nt(){o.container.querySelectorAll("table  tr")?.forEach(t=>t.classList.remove("value-changed"))}function pe(){Ht(),Nt(),T({message:"All settings saved",duration:3})}function ye(){p.forEach(t=>{me(o.settings[t.id],t.schema),ge(o.settings[t.id],t.schema,t.id)}),Nt(),T({message:"All settings reset",duration:4,actionText:"Undo",actionClickCallback:()=>location.reload(),afterCloseCallback:()=>Ht()})}var be=()=>{let t=null,e=null,n=null,s=null,i=!1,r=0;return window.addEventListener("load",()=>{b("#menu-primary-sections .menu-item-reshuffle a","click",Lt),b("#menu-primary-sections .menu-item-pref-player","click",()=>wt.toggle()),document.getElementById("menu-primary-channels")?.addEventListener("click",y)}),{isVisible(){return i},init:a,toggle:d,hide:m};function a(){t=document.getElementById("site-header"),e=document.querySelector("#site-navigation .nav-menu-outer"),n=document.querySelector("#site-navigation .nav-menu-inner"),s=document.getElementById("nav-menu-overlay"),ft("button.nav-menu-toggle","click",d),s.addEventListener("click",m),window.addEventListener("resize",()=>it())}function d(){r=t.offsetHeight,i?m():C()}function C(){t.classList.contains("scrolling-down")===!1&&(i=!0,t.classList.remove("hide-nav-menu"),e.style.display="flex",s.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(h.site.overlayOpacity/100))/10})`,s.classList.add("show"),J(W.SITE_MAX_WIDTH_MOBILE)&&rt("hidden","close","100vh"),it())}function m(){i=!1,t.classList.add("hide-nav-menu"),e.style.display="",s.className="",rt()}function y(w){let F=w.target.closest("li.menu-item.menu-item-object-uf_channel");F!==null&&(At()||x())&&(w?.preventDefault(),k(S(F.querySelector("a").href)))}function it(){if(i&&J(W.SITE_MAX_WIDTH_MOBILE)){let w=$("margin-top",n)+$("margin-bottom",n);n.style=`overflow-y: auto; max-height: ${window.innerHeight-(r+w)}px`}}function rt(w="",F="menu",ne=""){document.body.style.overflowY=w,t.querySelectorAll(".nav-menu-toggle span")?.forEach(se=>se.textContent=F),t.style.height=ne,n.style=""}},L=be();function Yt(t,e,n){let s=`<b>${t}</b>`;return n.forEach((i,r)=>{let a=yt(i.meta);s+=`
    <div class="track">
      <div class="thumbnail ${a.class}"
        data-term-url="${i.link}"
        data-term-slug="${e}"
        data-track-num="${r+1}"
        data-track-type="${i.meta.track_source_type}"
        data-track-id="track-${i.id}"
        data-track-source-uid="${a.uid}" title="Play Track"
        >
        <img src="${bt(i.meta.track_source_type,a.src).thumbnailUrl}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${i.link}" title="Go to track"><span><b>${i.meta.track_artist}</b></span><br><span>${i.meta.track_title}</span></a>
      </div>
    </div>`}),s}function Vt(t,e){let n=`<b>${t}</b><br>`;return e.forEach(s=>n+=`<a href="${S(s.link)}">${s.name}</a>, `),n.slice(0,n.length-2)}function Kt(t,e,n){let s=`<b>${t}</b><br>`;return e.forEach(i=>{let r=S(`${H.siteUrl}/artist/${i.artist_slug}/?channel=${n}`);s+=`<a href="${r}">${i.artist_name}</a> (${i.track_count})<br>`}),s}var u={termCache:{}};function et(t,e,n){let s=v(t,"data-term-type"),i=parseInt(e.getAttribute("data-term-id")),r=v(e,"data-term-slug"),a=s==="channels";ve(s,i,a?10:50,async d=>{let C=a?"Latest Tracks":"All Tracks",m=n.querySelector(".body-left");d!==null?(m.innerHTML=Yt(C,r,d),e.setAttribute("data-is-fetched",1)):T({message:"Failed to fetch track data!",duration:30,actionText:"retry",actionClickCallback:()=>et(t,e,n)}),!a&&d!==null?Se(d,i,n):d!==null&&Ee(i,n,r)})}function Se(t,e,n){Ce(t,e,50,(s,i)=>{let r=s==="artists"?"Related Artists":"In Channels",a=s==="artists"?n.querySelector(".artists"):n.querySelector(".channels");i!==null?a.innerHTML=Vt(r,i):a.innerHTML=`<b>${r}</b><br>None found`})}async function Ee(t,e,n){if(!("topArtists"in u.termCache[t])){let s=await Y({endpoint:"top-artists",query:`channel_id=${t}`,path:"/wp-json/ultrafunk/v1/"});s.status.code===q.OK&&(u.termCache[t].topArtists=s.data)}e.querySelector(".top-artists").innerHTML=Kt("Top Artists (tracks)",u.termCache[t].topArtists,n)}async function ve(t,e,n,s){if(!(e in u.termCache)){let i=await Y({endpoint:"tracks",query:`${t}=${e}&per_page=${n}&_fields=id,link,artists,channels,meta`});i.status.code===q.OK&&(u.termCache[e]={tracks:i.data})}s(u.termCache[e]!==void 0?u.termCache[e].tracks:null)}function Ce(t,e,n,s){if("channels"in u.termCache[e]&&"artists"in u.termCache[e])s("channels",u.termCache[e].channels),s("artists",u.termCache[e].artists);else{let i=[],r=[];t.forEach(a=>{i.push.apply(i,a.channels),r.push.apply(r,a.artists)}),r=r.filter(a=>a!==e),Gt("channels",e,[...new Set(i)],n,s),Gt("artists",e,[...new Set(r)],n,s)}}async function Gt(t,e,n,s,i){if(n.length>0){let r=await Y({endpoint:t,query:`include=${n}&per_page=${s}&_fields=link,name`});r.status.code===q.OK&&(u.termCache[e][t]=r.data)}else u.termCache[e][t]=null;i(t,u.termCache[e][t]!==void 0?u.termCache[e][t]:null)}function Bt(){u.termCache=JSON.parse(sessionStorage.getItem(l.UF_TERMLIST_CACHE)),u.termCache===null&&(u.termCache={})}function jt(){sessionStorage.setItem(l.UF_TERMLIST_CACHE,JSON.stringify(u.termCache))}function Wt(){sessionStorage.removeItem(l.UF_TERMLIST_CACHE)}function Jt(){return Object.keys(u.termCache).length>0}var zt=E("artists-channels"),c={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},ke=new Event("allowKeyboardShortcuts"),Le=new Event("denyKeyboardShortcuts");function Xt(){zt.log("initArtistsChannels()"),c.listContainer=document.getElementById("termlist-container"),c.uiElements=new nt("#termlist-container"),Ae(),we()}function Qt(){if(Jt()){let t={pageUrl:window.location.href,scrollPos:Math.round(window.scrollY),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(e=>{e.getAttribute("data-is-expanded")==="1"&&t.openTermIds.push(e.id)}),sessionStorage.setItem(l.UF_TERMLIST_STATE,JSON.stringify(t)),jt()}}function we(){if(Bt(),performance.getEntriesByType("navigation")[0].type!=="reload"){let t=JSON.parse(sessionStorage.getItem(l.UF_TERMLIST_STATE));t!==null&&t.pageUrl===window.location.href?(history.scrollRestoration="manual",t.openTermIds.forEach(e=>{document.getElementById(e).querySelector("div.termlist-header").click()}),setTimeout(()=>{window.scroll({top:t.scrollPos,left:0})},0)):history.scrollRestoration="auto"}sessionStorage.removeItem(l.UF_TERMLIST_STATE),Wt()}function Ae(){c.listContainer.getAttribute("data-term-type")==="artists"&&(c.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),c.termlistFilterInput=document.getElementById("termlist-filter-input"),c.termlistEntries=c.listContainer.querySelectorAll(".termlist-entry"),c.termlistFilterInput.addEventListener("keyup",t=>Pe(t)),c.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(Le)),c.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(ke)),termsListArray.forEach(t=>t.name=t.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1),c.termlistFilterInput.focus())}function Pe(t){if(vt(t.key))return;let e=performance.now(),n=c.termlistFilterInput.value.toLowerCase(),s=c.termlistEntries.length;if(c.listContainer.classList.add("notransitions"),n.length>=3){let d=termsListArray.filter(m=>m.name.includes(n)),C=1;s=d.length>0?d.length:0,c.termlistEntries.forEach(m=>{d.some(y=>y.id===m.id)===!1?m.className="termlist-entry hidden":m.className=`termlist-entry ${C++%2?"odd":"even"}`})}else c.termlistEntries.forEach(d=>d.className="termlist-entry");let i=s>1||s===0?"matches":"match",r=n.length>=3?` ( ${s} ${i} <b>${pt(n)}</b> )`:` ( ${s} found )`;c.navTitleFoundItems.forEach(d=>d.innerHTML=r),clearTimeout(c.transitionTimeoutId),c.transitionTimeoutId=setTimeout(()=>c.listContainer.classList.remove("notransitions"),250);let a=performance.now();zt.log(`filterTermsList(): ${Math.round((a-e)*100)/100} ms.`)}var nt=class extends Tt{elementClicked(){if(this.clicked("div.play-button"))return G(this.event,S(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return _e(this.event,S(this.querySelector("a").href));if(this.clicked("button.share-find-button"))return $e(this.element);if(this.clicked("div.termlist-header"))return Re(this.event);if(this.clicked("div.thumbnail"))return Ie(this.event,this.element);if(this.clicked("a"))return xe(this.event,this.element)}};function G(t,e,n=null){t?.preventDefault(),Qt(),sessionStorage.setItem(l.UF_AUTOPLAY,JSON.stringify({autoplay:t.shiftKey===!1,trackId:n,position:0})),k(e)}function _e(t,e){P(l.UF_RESHUFFLE,"true"),G(t,e)}function $e(t){let e=v(t,"data-term-name"),n=c.listContainer.getAttribute("data-term-type")==="channels"?"Channel link":"Artist link";kt.show({title:`Share / Find ${v(t,"data-term-path")}`,bodyText:e,bodyHtml:`<b>${e}</b>`,url:S(t.getAttribute("data-term-url")),urlType:n,verb:"Find",icon:"search"})}function Ie(t,e){let n=c.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",s=v(e,"data-term-slug"),i=parseInt(e.getAttribute("data-track-type"));if(h.playback.preferredPlayer===lt.GALLERY||i===ht.SOUNDCLOUD)G(t,e.getAttribute("data-term-url"),null);else{let r=parseInt(e.getAttribute("data-track-num")),a="";r>_.listPerPage&&(a=`page/${Math.ceil(r/_.listPerPage)}/`),G(t,`${H.siteUrl}/list/${n}/${s}/${a}`,v(e,"data-track-id"))}}function xe(t,e){Qt(),e.closest("div.permalink")!==null&&N(t)}function Re(t){let e=t.target.closest("div.termlist-entry"),n=e.querySelector("button.expand-toggle span"),s=e.querySelector("div.termlist-body"),i=e.getAttribute("data-is-expanded")==="1",r=e.getAttribute("data-is-fetched")==="1";e.setAttribute("data-is-expanded",i?"":"1"),n.textContent=i?"expand_more":"expand_less",s.style.display=i?"":"flex",!i&&!r&&et(c.listContainer,e,s)}var te=E("index"),ee={keyboardShortcuts:null},f={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{te.log("DOMContentLoaded"),Ue(),document.getElementById("termlist-container")!==null&&Xt(),document.getElementById("settings-container")!==null&&Mt(),He(),De(),at()});function Ue(){te.log("initIndex()"),ee.keyboardShortcuts=Et(h.site.keyboardShortcuts),f.siteHeader=document.getElementById("site-header"),f.siteContent=document.getElementById("site-content"),f.siteContentSearch=document.querySelector("#site-content form input.search-field"),Pt(),I.init(),L.init(),st.addEventListener(),Oe.addEventListener(),document.addEventListener("fullscreenElement",t=>f.fullscreenTarget=t.fullscreenTarget),document.addEventListener("keydown",Me),window.addEventListener("load",()=>b("aside.widget-area","click",N))}function Me(t){if(t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"Escape":L.isVisible()&&(t.preventDefault(),L.hide());return}if(ee.keyboardShortcuts.allow()&&t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"L":B()&&Zt()&&(K.toggle(t),st.trigger());break;case"n":case"N":B()&&(t.preventDefault(),L.toggle());break;case"s":case"S":B()&&Fe()&&(t.preventDefault(),I.toggle());break;case"T":B()&&Zt()&&V.toggle(t);break;case"ArrowLeft":t.shiftKey&&x()&&(t.preventDefault(),k(_.prevPage));break;case"ArrowRight":t.shiftKey&&x()&&(t.preventDefault(),k(_.nextPage));break}}function B(){return I.isVisible()===!1&&f.siteContentSearch!==document.activeElement}function Zt(){return document.body.classList.contains("page-settings")===!1}function Fe(){return f.fullscreenTarget===null}function He(){f.siteContentSearch!==null&&(f.siteContentSearch.focus(),f.siteContentSearch.setSelectionRange(9999,9999))}function De(){if(document.querySelector(".navbar-title .go-back-to")!==null){let t="";if(document.referrer.length===0)t="Previous Page";else{let e=new URL(decodeURIComponent(document.referrer));if(e.search.length!==0)t="Search Results";else if(e.pathname.length>1){let n=e.pathname.slice(-1)==="/"?1:0,s=e.pathname.slice(1,e.pathname.length-n).replace(/-/gi," ").split("/");s.forEach((i,r)=>{t+=r+1<s.length?i+" / ":i})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(e=>{e.querySelector(".go-back-title").textContent=t.length>0?t:"Ultrafunk (home)",e.querySelector(".go-back-to").style.opacity=1})}}var st=(()=>{let t=0;return{getSiteHeaderYOffset(){return t},addEventListener:e,trigger:n};function e(){n(),window.addEventListener("resize",n)}function n(){let s=0;x()?s=$("--site-header-height-no-playback"):s=$("--site-header-height"),t=Math.round(s>150?s/2:s/3),document.body.style.setProperty("--scrollbar-width",`${window.innerWidth-document.documentElement.clientWidth}px`)}})(),Oe=(()=>{let t=0,e=0,n=0,s=!1,i=44;return{addEventListener:r};function r(){a(),window.addEventListener("scroll",a)}function a(){let y=window.scrollY;y===0?d():y>t?(n+=y-t,n>i&&y>st.getSiteHeaderYOffset()&&(e=0,C())):(e+=t-y,e>i&&(n=0,m())),t=y}function d(){f.siteHeader.classList.remove("scrolling-down","scrolling-up"),f.siteHeader.classList.add("hide-nav-menu"),I.hide(),L.hide()}function C(){s===!1&&(s=!0,z(f.siteHeader,"scrolling-up","scrolling-down"),I.hide(),L.hide())}function m(){s===!0&&(s=!1,z(f.siteHeader,"scrolling-down","scrolling-up"))}})();
//# sourceMappingURL=index.js.map
