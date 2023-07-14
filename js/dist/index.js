import{$a as R,E as K,F as E,G as re,H as _,Ha as $,I as V,Ia as pe,J as G,Ja as be,K as v,L as T,La as Se,M as S,N as ae,O as le,P as oe,Q as ce,R as ue,Ra as ye,S as de,T as fe,U as me,V as ge,W as he,Wa as Ee,Z as D,_ as N,b as H,c as w,e as W,f as X,g as I,h as Q,j as l,k as O,l as A,m as F,n as Z,o as ee,p as te,q as P,r as b,t as ne,u as y,v as ie,z as se}from"./chunk-A7H6NK7C.js";function ve(e,t,n){let i=`<b>${e}</b>`;return n.forEach((s,r)=>{let a=ae(s.meta);i+=`
    <div class="track">
      <div class="thumbnail ${a.class}"
        data-term-url="${s.link}"
        data-term-slug="${t}"
        data-track-num="${r+1}"
        data-track-type="${s.meta.track_source_type}"
        data-track-id="track-${s.id}"
        data-track-source-uid="${a.uid}" title="Play Track"
        >
        <img src="${a.src}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${s.link}" title="Go to track"><span><b>${s.meta.track_artist}</b></span><br><span>${s.meta.track_title}</span></a>
      </div>
    </div>`}),i}function Te(e,t){let n=`<b>${e}</b><br>`;return t.forEach(i=>n+=`<a href="${S(i.link)}">${i.name}</a>, `),n.slice(0,n.length-2)}function ke(e,t,n){let i=`<b>${e}</b><br>`;return t.forEach(s=>{let r=S(`${H.siteUrl}/artist/${s.artist_slug}/?channel=${n}`);i+=`<a href="${r}">${s.artist_name}</a> (${s.track_count})<br>`}),i}var u={termCache:{}};function B(e,t,n){let i=v(e,"data-term-type"),s=parseInt(t.getAttribute("data-term-id")),r=v(t,"data-term-slug"),a=i==="channels";ze(i,s,a?10:50,async h=>{let d=a?"Latest Tracks":"All Tracks",p=n.querySelector(".body-left");if(h!==null?(p.innerHTML=ve(d,r,h),t.setAttribute("data-is-fetched",1)):y("Failed to fetch track data!",30,"retry",()=>B(e,t,n)),!a&&h!==null)We(h,s,50,(f,U)=>{d=f==="artists"?"Related Artists":"In Channels",p=f==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),U!==null?p.innerHTML=Te(d,U):p.innerHTML=`<b>${d}</b><br>None found`});else if(h!==null){if(!("topArtists"in u.termCache[s])){let f=await N({endpoint:"top-artists",query:`channel_id=${s}`,path:"/wp-json/ultrafunk/v1/"});f.status.code===D.OK&&(u.termCache[s].topArtists=f.data)}n.querySelector(".top-artists").innerHTML=ke("Top Artists (tracks)",u.termCache[s].topArtists,r)}})}async function ze(e,t,n,i){if(!(t in u.termCache)){let s=await N({endpoint:"tracks",query:`${e}=${t}&per_page=${n}&_fields=id,link,artists,channels,meta`});s.status.code===D.OK&&(u.termCache[t]={tracks:s.data})}i(u.termCache[t]!==void 0?u.termCache[t].tracks:null)}function We(e,t,n,i){if("channels"in u.termCache[t]&&"artists"in u.termCache[t])i("channels",u.termCache[t].channels),i("artists",u.termCache[t].artists);else{let s=[],r=[];e.forEach(a=>{s.push.apply(s,a.channels),r.push.apply(r,a.artists)}),r=r.filter(a=>a!==t),Ce("channels",t,[...new Set(s)],n,i),Ce("artists",t,[...new Set(r)],n,i)}}async function Ce(e,t,n,i,s){if(n.length>0){let r=await N({endpoint:e,query:`include=${n}&per_page=${i}&_fields=link,name`});r.status.code===D.OK&&(u.termCache[t][e]=r.data)}else u.termCache[t][e]=null;s(e,u.termCache[t][e]!==void 0?u.termCache[t][e]:null)}function Le(){u.termCache=JSON.parse(sessionStorage.getItem(l.UF_TERMLIST_CACHE)),u.termCache===null&&(u.termCache={})}function we(){sessionStorage.setItem(l.UF_TERMLIST_CACHE,JSON.stringify(u.termCache))}function Ie(){sessionStorage.removeItem(l.UF_TERMLIST_CACHE)}function Ae(){return Object.keys(u.termCache).length>0}var _e=w("termlist"),o={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},Qe=new Event("allowKeyboardShortcuts"),Ze=new Event("denyKeyboardShortcuts");function $e(){document.getElementById("termlist-container")!==null&&(_e.log("initTermlist()"),o.listContainer=document.getElementById("termlist-container"),o.uiElements=new j("#termlist-container"),tt(),et())}function Re(){if(Ae()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.getAttribute("data-is-expanded")==="1"&&e.openTermIds.push(t.id)}),sessionStorage.setItem(l.UF_TERMLIST_STATE,JSON.stringify(e)),we()}}function et(){if(Le(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(l.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),window.scroll({top:e.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(l.UF_TERMLIST_STATE),Ie()}function tt(){o.listContainer.getAttribute("data-term-type")==="artists"&&(o.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),o.termlistFilterInput=document.getElementById("termlist-filter-input"),o.termlistEntries=o.listContainer.querySelectorAll(".termlist-entry"),o.termlistFilterInput.addEventListener("keyup",e=>nt(e)),o.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(Ze)),o.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(Qe)),termsListArray.forEach(e=>e.name=e.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1),o.termlistFilterInput.focus())}function nt(e){if(oe(e.key))return;let t=performance.now(),n=o.termlistFilterInput.value.toLowerCase(),i=o.termlistEntries.length;if(o.listContainer.classList.add("notransitions"),n.length>=3){let a=termsListArray.filter(d=>d.name.includes(n)),h=1;i=a.length>0?a.length:0,o.termlistEntries.forEach(d=>{a.some(p=>p.id===d.id)===!1?d.className="termlist-entry hidden":d.className=`termlist-entry ${h++%2?"odd":"even"}`})}else o.termlistEntries.forEach(a=>a.className="termlist-entry");let s=n.length>=3?`"${n}" - `:"";o.navTitleFoundItems.forEach(a=>a.textContent=` ( ${s}${i} found )`),clearTimeout(o.transitionTimeoutId),o.transitionTimeoutId=setTimeout(()=>o.listContainer.classList.remove("notransitions"),250);let r=performance.now();_e.log(`filterTermsList(): ${Math.round((r-t)*100)/100} ms.`)}var j=class extends ce{elementClicked(){if(this.clicked("div.play-button"))return q(this.event,S(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return it(this.event,S(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return st(this.element);if(this.clicked("div.termlist-header"))return lt(this.event);if(this.clicked("div.thumbnail"))return rt(this.event,this.element);if(this.clicked("a"))return at(this.event,this.element)}};function q(e,t,n=null){e?.preventDefault(),Re(),sessionStorage.setItem(l.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:n,position:0})),T(t)}function it(e,t){A(l.UF_RESHUFFLE,"true"),q(e,t)}function st(e){let t=v(e,"data-term-name"),n=o.listContainer.getAttribute("data-term-type")==="channels"?"Channel link":"Artist link";de.show({title:`Share / Find ${v(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:S(e.getAttribute("data-term-url")),urlType:n,verb:"Find",icon:"search"})}function rt(e,t){let n=o.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=v(t,"data-term-slug"),s=parseInt(t.getAttribute("data-track-type"));if(b.playback.preferredPlayer===X.GALLERY||s===se.SOUNDCLOUD)q(e,t.getAttribute("data-term-url"),null);else{let r=parseInt(t.getAttribute("data-track-num")),a="";r>P.listPerPage&&(a=`page/${Math.ceil(r/P.listPerPage)}/`),q(e,`${H.siteUrl}/list/${n}/${i}/${a}`,v(t,"data-track-id"))}}function at(e,t){Re(),t.closest("div.permalink")!==null&&(e?.preventDefault(),T(S(t.href)))}function lt(e){let t=e.target.closest("div.termlist-entry"),n=t.querySelector("div.expand-toggle span"),i=t.querySelector("div.termlist-body"),s=t.getAttribute("data-is-expanded")==="1",r=t.getAttribute("data-is-fetched")==="1";t.setAttribute("data-is-expanded",s?"":"1"),n.textContent=s?"expand_more":"expand_less",i.style.display=s?"":"flex",!s&&!r&&B(o.listContainer,t,i)}var Ue=w("settings-ui"),c={settings:null,container:null},k={containerId:"settings-container",saveResetId:"settings-save-reset",updatedEvent:new Event("settingsUpdated")},m=[{name:"Playback",id:"playback",schema:I.playback},{name:"List Player",id:"list",schema:I.list},{name:"Gallery Player",id:"gallery",schema:I.gallery},{name:"Mobile",id:"mobile",schema:I.mobile},{name:"Site",id:"site",schema:I.site}],dt=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear"><b>Clear All Settings</b></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function Oe(){if(document.getElementById("settings-container")!==null)if(Ue.log("initSettingsUi"),c.container=document.getElementById(k.containerId),c.container!==null){if(document.URL.includes("?clear=true")){Fe();return}De(!1),c.settings!==null?(m.forEach(e=>ft(c.settings[e.id],e.schema)),gt(),c.container.style.opacity=1,c.container.addEventListener("click",e=>xe(e)),c.container.addEventListener("contextmenu",e=>xe(e)),E(`#${k.saveResetId} .settings-save`,"click",bt),E(`#${k.saveResetId} .settings-reset`,"click",St)):Fe()}else Ue.error(`Unable to getElementById() for '#${k.containerId}'`)}function Fe(){document.getElementById(k.saveResetId).style.display="none",c.container.insertAdjacentHTML("afterbegin",dt),c.container.style.minHeight="100%",c.container.style.opacity=1,E(`#${k.containerId} .settings-clear`,"click",()=>{localStorage.removeItem(l.UF_SETTINGS),localStorage.removeItem(l.UF_SITE_THEME),localStorage.removeItem(l.UF_GALLERY_LAYOUT),F(l.UF_GALLERY_PER_PAGE),F(l.UF_LIST_PER_PAGE),F(l.UF_PREFERRED_PLAYER),F(l.UF_SHUFFLE_UID),te(!0),De(!0),c.settings!==null?y("All settings have been cleared",5,"Reload",()=>window.location.href="/settings/",()=>window.location.href="/settings/"):y("Sorry, unable to clear all settings",5)})}function De(e=!1){c.settings=Z(l.UF_SETTINGS,e?Q:null,e)}function Ne(){ee(l.UF_SETTINGS,c.settings),A(l.UF_GALLERY_PER_PAGE,c.settings.gallery.tracksPerPage,O*5),A(l.UF_LIST_PER_PAGE,c.settings.list.tracksPerPage,O*5),A(l.UF_PREFERRED_PLAYER,c.settings.playback.preferredPlayer,O*5),document.dispatchEvent(k.updatedEvent)}function ft(e,t){Object.entries(e).forEach(([n,i])=>{n in t&&(t[n].current=M(t[n],i),t[n].current===-1&&(t[n].current=M(t[n],t[n].default)))})}function mt(e,t){Object.keys(e).forEach(n=>{n in t&&(e[n]=t[n].default,t[n].current=M(t[n],t[n].default))})}function M(e,t){return e.values.findIndex(n=>n===t)}function gt(){let e=`
<h3>${m[0].name}</h3>
<table id="${m[0].id}-settings" class="settings">
<tbody>`;Object.entries(m[0].schema).forEach(t=>e+=Me(m[0].id,t)),m.slice(1).forEach(t=>{e+=`
</tbody>
</table>
<h3>${t.name}</h3>
<table id="${t.id}-settings" class="settings">
<tbody>`,Object.entries(t.schema).forEach(n=>e+=Me(t.id,n))}),c.container.insertAdjacentHTML("afterbegin",e+`
</tbody>
</table>
`)}function Me(e,t){let n=t[1].valueStrings[M(t[1],t[1].default)];return`
<tr id="${e}:${t[0]}" class="settings-entry" title="Default: ${n}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${t[1].description}</td>
      <td class="${qe(t[1])}">${t[1].valueStrings[t[1].current]}</td>
    </tr>`}function qe(e){switch(e.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${e.values[e.current]===!0?"true":"false"}`}}function ht(e,t,n,i){i.current=i.current+1<i.values.length?i.current+1:i.current=0,c.settings[t][n]=i.values[i.current],c.settings[t][n]!==b[t][n]?e.classList.add("value-changed"):e.classList.remove("value-changed"),Ye(e.querySelector(".value-string"),i)}function Ye(e,t){e.classList=qe(t),e.textContent=t.valueStrings[t.current]}function pt(e,t,n){Object.keys(e).forEach(i=>{i in t&&Ye(document.getElementById(`${n}:${i}`).querySelector(".value-string"),t[i])})}function xe(e){let t=e.target.closest("tr");if(t!==null){let n=t.id.split(":")[0],i=t.id.split(":")[1],s=m.findIndex(r=>r.id===n);e.type==="contextmenu"?(e.pointerType==="touch"||e.mozInputSource===5)&&(e.preventDefault(),He(m[s].name,m[s].schema[i])):e.shiftKey===!0?He(m[s].name,m[s].schema[i]):ht(t,m[s].id,i,m[s].schema[i])}}function He(e,t){let n="";t.valueStrings.forEach(i=>n+=`${i}, `),ue(`${e} setting details`,`<p><b>Description</b><br>${t.description}</p>
     <p><b>Values</b><br>${n.slice(0,n.length-2)}</p>
     <p><b>Current Value</b><br>${t.valueStrings[t.current]}</p>
     <p><b>Default Value</b><br>${t.valueStrings[M(t,t.default)]}</p>`)}function Ke(){document.querySelectorAll("#settings-container table").forEach(e=>{e.querySelectorAll("tr").forEach(t=>t.classList.remove("value-changed"))})}function bt(){Ne(),Ke(),y("All settings saved",3)}function St(){m.forEach(e=>{mt(c.settings[e.id],e.schema),pt(c.settings[e.id],e.schema,e.id)}),Ke(),y("All settings reset",4,"Undo",()=>location.reload(),()=>Ne())}var yt=()=>{let e=null,t=null,n=null,i=null,s=!1,r=0;return window.addEventListener("load",()=>{E("#menu-primary-sections .menu-item-reshuffle a","click",Se),E("#menu-primary-sections .menu-item-pref-player","click",()=>ye.toggle()),document.getElementById("menu-primary-channels")?.addEventListener("click",f)}),{isVisible(){return s},init:a,toggle:h,hide:p};function a(){e=document.getElementById("site-header"),t=document.querySelector("#site-navigation .nav-menu-outer"),n=document.querySelector("#site-navigation .nav-menu-inner"),i=document.getElementById("nav-menu-overlay"),re("div.nav-menu-toggle","click",h),i.addEventListener("click",p),window.addEventListener("resize",()=>U())}function h(){r=e.offsetHeight,s?p():d()}function d(){e.classList.contains("scrolling-down")===!1&&(s=!0,e.classList.remove("hide-nav-menu"),t.style.display="flex",i.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(b.site.modalOverlayOpacity/100))/10})`,i.classList.add("show"),V(K.SITE_MAX_WIDTH_MOBILE)&&z("hidden","close","100vh"),U())}function p(){s=!1,e.classList.add("hide-nav-menu"),t.style.display="",i.className="",z()}function f(L){let x=L.target.closest("li.menu-item.menu-item-object-uf_channel");x!==null&&(Ee()||$())&&(L?.preventDefault(),T(S(x.querySelector("a").href)))}function U(){if(s&&V(K.SITE_MAX_WIDTH_MOBILE)){let L=_("margin-top",n)+_("margin-bottom",n);n.style=`overflow-y: auto; max-height: ${window.innerHeight-(r+L)}px`}}function z(L="",x="menu",je=""){document.documentElement.style.overflowY=L,e.querySelectorAll(".nav-menu-toggle span")?.forEach(Je=>Je.textContent=x),e.style.height=je,n.style=""}},C=yt();var Ge=w("index"),Be={keyboardShortcuts:null},g={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{Ge.log("DOMContentLoaded"),Et(),$e(),Oe(),kt(),Ct(),W()});function Et(){Ge.log("initIndex()"),Be.keyboardShortcuts=le(b.site.keyboardShortcuts),g.siteHeader=document.getElementById("site-header"),g.siteContent=document.getElementById("site-content"),g.siteContentSearch=document.querySelector("#site-content form input.search-field"),ge(),R.init(),C.init(),J.addEventListener(),Lt.addEventListener(),document.addEventListener("fullscreenElement",e=>g.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",vt)}window.addEventListener("load",()=>{if(window.localStorage&&b.internal.showSiteInfoOnLoad&&document.body.classList.contains("home")&&(pe()||be())){let e='Ultrafunk is an interactive playlist with carefully chosen and continually updated tracks rooted in Funk and related genres. <a class="snackbar-message-link" href="/about/">More Details</a>';setTimeout(()=>{ie()===!1&&(y(e,7.5,null,null,()=>{b.internal.showSiteInfoOnLoad=!1},"rgb(100, 20, 20)"),E(".snackbar-message-link","click",()=>{b.internal.showSiteInfoOnLoad=!1}))},2e3)}});document.addEventListener("settingsUpdated",()=>{ne(),he()});function vt(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":C.isVisible()&&(e.preventDefault(),C.hide());return}if(Be.keyboardShortcuts.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"L":Y()&&Ve()&&(me.toggle(e),J.trigger());break;case"n":case"N":Y()&&(e.preventDefault(),C.toggle());break;case"s":case"S":Y()&&Tt()&&(e.preventDefault(),R.toggle());break;case"T":Y()&&Ve()&&fe.toggle(e);break;case"ArrowLeft":e.shiftKey&&$()&&(e.preventDefault(),T(P.prevPage));break;case"ArrowRight":e.shiftKey&&$()&&(e.preventDefault(),T(P.nextPage));break}}function Y(){return R.isVisible()===!1&&g.siteContentSearch!==document.activeElement}function Ve(){return document.body.classList.contains("page-settings")===!1}function Tt(){return g.fullscreenTarget===null}function kt(){g.siteContentSearch!==null&&(g.siteContentSearch.focus(),g.siteContentSearch.setSelectionRange(9999,9999))}function Ct(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let n=t.pathname.slice(-1)==="/"?1:0,i=t.pathname.slice(1,t.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((s,r)=>{e+=r+1<i.length?s+" / ":s})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var J=(()=>{let e=0;return{getSiteHeaderYOffset(){return e},addEventListener:t,trigger:n};function t(){n(),window.addEventListener("resize",n)}function n(){let i=0;$()?i=_("--site-header-height-no-playback"):i=_("--site-header-height"),e=Math.round(i>150?i/2:i/3)}})(),Lt=(()=>{let e=0,t=0,n=0,i=!1,s=44;return{addEventListener:r};function r(){a(),window.addEventListener("scroll",a)}function a(){let f=window.pageYOffset;f===0?h():f>e?(n+=f-e,n>s&&f>J.getSiteHeaderYOffset()&&(t=0,d())):(t+=e-f,t>s&&(n=0,p())),e=f}function h(){g.siteHeader.classList.remove("scrolling-down","scrolling-up"),g.siteHeader.classList.add("hide-nav-menu"),R.hide(),C.hide()}function d(){i===!1&&(i=!0,G(g.siteHeader,"scrolling-up","scrolling-down"),R.hide(),C.hide())}function p(){i===!0&&(i=!1,G(g.siteHeader,"scrolling-down","scrolling-up"))}})();
//# sourceMappingURL=index.js.map
