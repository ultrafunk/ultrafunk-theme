import{A as Et,F as Z,Fa as R,G as k,Ga as At,H as Ct,Ha as xt,I as Tt,Ia as _t,J as M,K as tt,L as et,M as wt,N as p,O as T,Oa as Pt,P as E,Q as Lt,R as G,S as V,T as It,Ta as Ut,U as $t,V as it,W as O,X as nt,Y as $,Ya as F,b as Y,c as L,e as ft,f as gt,g as _,h as pt,j as o,k as B,l as P,m as H,n as Q,o as bt,p as yt,q as kt,r as U,s as g,u as St,v,w as vt}from"./chunk-3KUIY7ZX.js";var Rt=L("share-modal"),be=()=>{let t=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,e,i,n,s,a,r,h,l,d;return{show:f};function f(b){return{title:e="Share / Play Track",bodyText:i=null,filterBodyText:n=!1,bodyHtml:s=null,url:a=null,urlType:r="Link",sourceUid:h=null,verb:l="Play",icon:d="link"}=b,$(e,I(),"share",N)}function I(){let b=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"searchOnGoogleId",icon:"search",content:"<b>Search</b> on Google"},{clickId:"amazonMusicId",icon:d,content:`<b>${l}</b> on Amazon Music`},{clickId:"appleMusicId",icon:d,content:`<b>${l}</b> on Apple Music`},{clickId:"spotifyId",icon:d,content:`<b>${l}</b> on Spotify`},{clickId:"youTubeMusicId",icon:d,content:`<b>${l}</b> on YouTube Music`}];return s!==null&&b.unshift({class:"track-share-entry",content:s}),b}function N(b){Rt.log(`singleChoiceListClick(): ${b} - title: "${e}" - bodyText: "${i}" - filterBodyText: ${n} - url: ${a} - urlType: ${r} - sourceUid: ${h} - verb: ${l}`);let w=encodeURIComponent(n?i.replace(t," "):i);switch(b){case"copyToClipboardId":st(a,r);break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(`Ultrafunk ${r}: ${i}`)}&body=${encodeURI(a)}%0d%0a`;break;case"searchOnGoogleId":window.open(`https://www.google.com/search?q=${w}`,"_blank");break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${w}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${w}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${w}`,"_blank");break;case"youTubeMusicId":h!==null?window.open(`https://music.youtube.com/watch?v=${h}`,"_blank"):window.open(`https://music.youtube.com/search?q=${w}`,"_blank");break}}},j=be();function st(t,e="Content"){navigator.clipboard?navigator.clipboard.writeText(t).then(()=>{v(`${e} copied to clipboard`,3)},i=>{Mt(i,t,e)}):ye(t)?v(`${e} copied to clipboard`,3):Mt(`document.execCommand('copy') for "${t}" failed!`,t,e)}function ye(t){let e=document.createElement("textarea");document.body.appendChild(e),e.textContent=t,e.select();let i=document.execCommand("copy");return document.body.removeChild(e),i}function Mt(t,e,i){Rt.error(`copyTextToClipboard() error: ${t}`);let n=`
    <style>
      .modal-dialog-body p.modal-clipboard-content {
        padding: 10px 15px;
        border-radius: var(--dialog-border-radius);
        background-color: var(--list-row-odd-color);
      }
    </style>
    <p class="modal-clipboard-error">Failed to write ${i} to the clipboard, please copy the text below:</p>
    <p class="modal-clipboard-content">${e}</p>`;$("Copy to Clipboard error!",n)}var ut=L("site-interaction"),C=document.documentElement.classList,Ft={metaUiElements:null,listUiElements:null},z={},J={};function Ht(){ut.log("init()"),Ft.metaUiElements=new rt("div.track-meta",!0),Ft.listUiElements=new at("#tracklist"),z=new lt("footer-site-theme-toggle"),J=new ot("footer-gallery-layout-toggle"),window.addEventListener("load",()=>{k(".widget ul.uf_channel","click",q),k(".widget ul.uf_artist","click",q),k(".widget.widget_archive ul","click",q)})}function Ot(){z.setCurrent(),J.setCurrent()}var rt=class extends O{elementClicked(){if(this.clicked("div.track-share-control"))return qt(this.closest("single-track, gallery-track"));if(this.clicked("div.track-details-control"))return Dt(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return q(this.event);if(this.clicked("span.track-channels-links"))return q(this.event)}},at=class extends O{elementClicked(){if(this.clicked("div.share-play-button"))return qt(this.closest("div.track-entry"));if(this.clicked("div.details-button"))return Dt(this.closest("div.track-entry"))}};function q(t){t.target.matches("a")&&(t?.preventDefault(),T(E(t.target.href)))}function qt(t){let e=p(t,"data-track-artist"),i=p(t,"data-track-title"),n=j.show({bodyText:`${e} - ${i}`,filterBodyText:!0,bodyHtml:nt(t,e,i),url:p(t,"data-track-url"),urlType:"Track link",sourceUid:p(t,"data-track-source-uid")});Nt(n,`${e} - ${i}`)}function Dt(t){let e=p(t,"data-track-artist"),i=p(t,"data-track-title"),n=parseInt(t.getAttribute("data-track-duration")),s=t.querySelector(".track-artists-links").querySelectorAll("a"),a=t.querySelector(".track-channels-links").querySelectorAll("a"),r=[];r.push({class:"track-details-entry",content:nt(t,e,i)}),r.push({class:"header-entry",content:"Artists"}),s.forEach(l=>{r.push({clickId:`entry-${r.length}`,class:`icon-text ${l.classList[0]??""}`,title:"Go to Artist",content:l.innerText,link:l.href,icon:"link"})}),r.push({class:"header-entry",content:"Channels"}),a.forEach(l=>{r.push({clickId:`entry-${r.length}`,title:"Go to Channel",content:l.innerText,link:l.href,icon:"link"})});let h=$(`Track Details<span class="light-text lowercase-text">${n>0?wt(n):"N / A"}</span>`,r,"track-details",l=>{T(r.find(d=>d.clickId===l).link)});Nt(h,`${e} - ${i}`)}function Nt(t,e){document.getElementById(t).querySelector(".modal-track .modal-track-thumbnail").title="Click / tap to Copy Artist & Title",document.getElementById(t)?.querySelector("img")?.addEventListener("click",()=>st(e,"Artist &amp Title"))}function Yt(t,e,i){let n=Object.values(t).find(s=>s.id===e);return n!==void 0?n:i}function Bt(t,e){let i=Object.values(t).findIndex(s=>s.id===e.id),n=Object.keys(t);return i+1<n.length?t[n[i+1]]:t[n[0]]}var lt=class extends it{constructor(e){super(e,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},black:{id:"black",text:"black",class:"site-theme-black"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=Yt(this.themes,g.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=Bt(this.themes,this.currentTheme),g.site.theme=this.currentTheme.id}update(){let e=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),Q(o.UF_SITE_THEME,e.id),C.contains(e.class)===!1&&(ut.log(`SiteThemeToggle.update() - newSiteTheme: ${e.id}`),C.remove(this.themes.light.class,this.themes.dark.class,this.themes.black.class),C.add(e.class)),this.value=this.currentTheme.text}},ot=class extends it{constructor(e){super(e,!1),this.minWidth=`(max-width: ${Tt("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",i=>this.matchMediaMinWidth(i))}setCurrent(){this.currentLayout=Yt(this.layouts,g.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(e){C.contains("gallery-layout")&&(e.matches?(C.remove(this.currentLayout.class),C.add(this.layouts.oneColumn.class)):(C.remove(this.layouts.oneColumn.class),C.add(this.currentLayout.class)))}toggle(){this.currentLayout=Bt(this.layouts,this.currentLayout),g.gallery.layout=this.currentLayout.id}update(e){this.value=this.currentLayout.text,Q(o.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(C.contains("gallery-layout")&&C.contains(this.currentLayout.class)===!1&&(ut.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),C.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),C.add(this.currentLayout.class)),e?.type==="click"&&this.element.scrollIntoView())}};function Gt(t,e,i){let n=`<b>${t}</b>`;return i.forEach((s,a)=>{let r=Lt(s.meta);n+=`
    <div class="track">
      <div class="thumbnail ${r.class}"
        data-term-url="${s.link}"
        data-term-slug="${e}"
        data-track-num="${a+1}"
        data-track-type="${s.meta.track_source_type}"
        data-track-id="track-${s.id}"
        data-track-source-uid="${r.uid}" title="Play Track"
        >
        <img src="${r.src}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${s.link}" title="Go to track"><span><b>${s.meta.track_artist}</b></span><br><span>${s.meta.track_title}</span></a>
      </div>
    </div>`}),n}function Vt(t,e){let i=`<b>${t}</b><br>`;return e.forEach(n=>i+=`<a href="${E(n.link)}">${n.name}</a>, `),i.slice(0,i.length-2)}function Kt(t,e,i){let n=`<b>${t}</b><br>`;return e.forEach(s=>{let a=E(`${Y.siteUrl}/artist/${s.artist_slug}/?channel=${i}`);n+=`<a href="${a}">${s.artist_name}</a> (${s.track_count})<br>`}),n}var m={termCache:{}};function dt(t,e,i){let n=p(t,"data-term-type"),s=parseInt(e.getAttribute("data-term-id")),a=p(e,"data-term-slug"),r=n==="channels";Se(n,s,r?10:50,async h=>{let l=r?"Latest Tracks":"All Tracks",d=i.querySelector(".body-left");if(h!==null?(d.innerHTML=Gt(l,a,h),e.setAttribute("data-is-fetched",1)):v("Failed to fetch track data!",30,"retry",()=>dt(t,e,i)),!r&&h!==null)ve(h,s,50,(f,I)=>{l=f==="artists"?"Related Artists":"In Channels",d=f==="artists"?i.querySelector(".artists"):i.querySelector(".channels"),I!==null?d.innerHTML=Vt(l,I):d.innerHTML=`<b>${l}</b><br>None found`});else if(h!==null){if(!("topArtists"in m.termCache[s])){let f=await V({endpoint:"top-artists",query:`channel_id=${s}`,path:"/wp-json/ultrafunk/v1/"});f.status.code===G.OK&&(m.termCache[s].topArtists=f.data)}i.querySelector(".top-artists").innerHTML=Kt("Top Artists (tracks)",m.termCache[s].topArtists,a)}})}async function Se(t,e,i,n){if(!(e in m.termCache)){let s=await V({endpoint:"tracks",query:`${t}=${e}&per_page=${i}&_fields=id,link,artists,channels,meta`});s.status.code===G.OK&&(m.termCache[e]={tracks:s.data})}n(m.termCache[e]!==void 0?m.termCache[e].tracks:null)}function ve(t,e,i,n){if("channels"in m.termCache[e]&&"artists"in m.termCache[e])n("channels",m.termCache[e].channels),n("artists",m.termCache[e].artists);else{let s=[],a=[];t.forEach(r=>{s.push.apply(s,r.channels),a.push.apply(a,r.artists)}),a=a.filter(r=>r!==e),jt("channels",e,[...new Set(s)],i,n),jt("artists",e,[...new Set(a)],i,n)}}async function jt(t,e,i,n,s){if(i.length>0){let a=await V({endpoint:t,query:`include=${i}&per_page=${n}&_fields=link,name`});a.status.code===G.OK&&(m.termCache[e][t]=a.data)}else m.termCache[e][t]=null;s(t,m.termCache[e][t]!==void 0?m.termCache[e][t]:null)}function zt(){m.termCache=JSON.parse(sessionStorage.getItem(o.UF_TERMLIST_CACHE)),m.termCache===null&&(m.termCache={})}function Jt(){sessionStorage.setItem(o.UF_TERMLIST_CACHE,JSON.stringify(m.termCache))}function Wt(){sessionStorage.removeItem(o.UF_TERMLIST_CACHE)}function Xt(){return Object.keys(m.termCache).length>0}var Qt=L("termlist"),c={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},Ce=new Event("allowKeyboardShortcuts"),Te=new Event("denyKeyboardShortcuts");function Zt(){document.getElementById("termlist-container")!==null&&(Qt.log("initTermlist()"),c.listContainer=document.getElementById("termlist-container"),c.uiElements=new mt("#termlist-container"),Le(),we())}function te(){if(Xt()){let t={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(e=>{e.getAttribute("data-is-expanded")==="1"&&t.openTermIds.push(e.id)}),sessionStorage.setItem(o.UF_TERMLIST_STATE,JSON.stringify(t)),Jt()}}function we(){if(zt(),performance.getEntriesByType("navigation")[0].type!=="reload"){let t=JSON.parse(sessionStorage.getItem(o.UF_TERMLIST_STATE));t!==null&&t.pageUrl===window.location.href?(history.scrollRestoration="manual",t.openTermIds.forEach(e=>{document.getElementById(e).querySelector("div.termlist-header").click()}),window.scroll({top:t.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(o.UF_TERMLIST_STATE),Wt()}function Le(){c.listContainer.getAttribute("data-term-type")==="artists"&&(c.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),c.termlistFilterInput=document.getElementById("termlist-filter-input"),c.termlistEntries=c.listContainer.querySelectorAll(".termlist-entry"),c.termlistFilterInput.addEventListener("keyup",t=>Ie(t)),c.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(Te)),c.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(Ce)),termsListArray.forEach(t=>t.name=t.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1),c.termlistFilterInput.focus())}function Ie(t){if($t(t.key))return;let e=performance.now(),i=c.termlistFilterInput.value.toLowerCase(),n=c.termlistEntries.length;if(c.listContainer.classList.add("notransitions"),i.length>=3){let r=termsListArray.filter(l=>l.name.includes(i)),h=1;n=r.length>0?r.length:0,c.termlistEntries.forEach(l=>{r.some(d=>d.id===l.id)===!1?l.className="termlist-entry hidden":l.className=`termlist-entry ${h++%2?"odd":"even"}`})}else c.termlistEntries.forEach(r=>r.className="termlist-entry");let s=i.length>=3?`"${i}" - `:"";c.navTitleFoundItems.forEach(r=>r.textContent=` ( ${s}${n} found )`),clearTimeout(c.transitionTimeoutId),c.transitionTimeoutId=setTimeout(()=>c.listContainer.classList.remove("notransitions"),250);let a=performance.now();Qt.log(`filterTermsList(): ${Math.round((a-e)*100)/100} ms.`)}var mt=class extends O{elementClicked(){if(this.clicked("div.play-button"))return W(this.event,E(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return $e(this.event,E(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return Ae(this.element);if(this.clicked("div.termlist-header"))return Pe(this.event);if(this.clicked("div.thumbnail"))return xe(this.event,this.element);if(this.clicked("a"))return _e(this.event,this.element)}};function W(t,e,i=null){t?.preventDefault(),te(),sessionStorage.setItem(o.UF_AUTOPLAY,JSON.stringify({autoplay:t.shiftKey===!1,trackId:i,position:0})),T(e)}function $e(t,e){P(o.UF_RESHUFFLE,"true"),W(t,e)}function Ae(t){let e=p(t,"data-term-name"),i=c.listContainer.getAttribute("data-term-type")==="channels"?"Channel link":"Artist link";j.show({title:`Share / Find ${p(t,"data-term-path")}`,bodyText:e,bodyHtml:`<b>${e}</b>`,url:E(t.getAttribute("data-term-url")),urlType:i,verb:"Find",icon:"search"})}function xe(t,e){let i=c.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",n=p(e,"data-term-slug"),s=parseInt(e.getAttribute("data-track-type"));if(g.playback.preferredPlayer===gt.GALLERY||s===Et.SOUNDCLOUD)W(t,e.getAttribute("data-term-url"),null);else{let a=parseInt(e.getAttribute("data-track-num")),r="";a>U.listPerPage&&(r=`page/${Math.ceil(a/U.listPerPage)}/`),W(t,`${Y.siteUrl}/list/${i}/${n}/${r}`,p(e,"data-track-id"))}}function _e(t,e){te(),e.closest("div.permalink")!==null&&(t?.preventDefault(),T(E(e.href)))}function Pe(t){let e=t.target.closest("div.termlist-entry"),i=e.querySelector("div.expand-toggle span"),n=e.querySelector("div.termlist-body"),s=e.getAttribute("data-is-expanded")==="1",a=e.getAttribute("data-is-fetched")==="1";e.setAttribute("data-is-expanded",s?"":"1"),i.textContent=s?"expand_more":"expand_less",n.style.display=s?"":"flex",!s&&!a&&dt(c.listContainer,e,n)}var ee=L("settings-ui"),u={settings:null,container:null},A={containerId:"settings-container",saveResetId:"settings-save-reset",updatedEvent:new Event("settingsUpdated")},y=[{name:"Playback",id:"playback",schema:_.playback},{name:"List Player",id:"list",schema:_.list},{name:"Gallery Player",id:"gallery",schema:_.gallery},{name:"Mobile",id:"mobile",schema:_.mobile},{name:"Site",id:"site",schema:_.site}],Fe=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear"><b>Clear All Settings</b></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function ae(){if(document.getElementById("settings-container")!==null)if(ee.log("initSettingsUi"),u.container=document.getElementById(A.containerId),u.container!==null){if(document.URL.includes("?clear=true")){ie();return}le(!1),u.settings!==null?(y.forEach(t=>He(u.settings[t.id],t.schema)),qe(),u.container.style.opacity=1,u.container.addEventListener("click",t=>se(t)),u.container.addEventListener("contextmenu",t=>se(t)),k(`#${A.saveResetId} .settings-save`,"click",Ye),k(`#${A.saveResetId} .settings-reset`,"click",Be)):ie()}else ee.error(`Unable to getElementById() for '#${A.containerId}'`)}function ie(){document.getElementById(A.saveResetId).style.display="none",u.container.insertAdjacentHTML("afterbegin",Fe),u.container.style.minHeight="100%",u.container.style.opacity=1,k(`#${A.containerId} .settings-clear`,"click",()=>{localStorage.removeItem(o.UF_SETTINGS),localStorage.removeItem(o.UF_SITE_THEME),localStorage.removeItem(o.UF_GALLERY_LAYOUT),H(o.UF_GALLERY_PER_PAGE),H(o.UF_LIST_PER_PAGE),H(o.UF_PREFERRED_PLAYER),H(o.UF_SHUFFLE_UID),kt(!0),le(!0),u.settings!==null?v("All settings have been cleared",5,"Reload",()=>window.location.href="/settings/",()=>window.location.href="/settings/"):v("Sorry, unable to clear all settings",5)})}function le(t=!1){u.settings=bt(o.UF_SETTINGS,t?pt:null,t)}function oe(){yt(o.UF_SETTINGS,u.settings),P(o.UF_GALLERY_PER_PAGE,u.settings.gallery.tracksPerPage,B*5),P(o.UF_LIST_PER_PAGE,u.settings.list.tracksPerPage,B*5),P(o.UF_PREFERRED_PLAYER,u.settings.playback.preferredPlayer,B*5),document.dispatchEvent(A.updatedEvent)}function He(t,e){Object.entries(t).forEach(([i,n])=>{i in e&&(e[i].current=D(e[i],n),e[i].current===-1&&(e[i].current=D(e[i],e[i].default)))})}function Oe(t,e){Object.keys(t).forEach(i=>{i in e&&(t[i]=e[i].default,e[i].current=D(e[i],e[i].default))})}function D(t,e){return t.values.findIndex(i=>i===e)}function qe(){let t=`
<h3>${y[0].name}</h3>
<table id="${y[0].id}-settings" class="settings">
<tbody>`;Object.entries(y[0].schema).forEach(e=>t+=ne(y[0].id,e)),y.slice(1).forEach(e=>{t+=`
</tbody>
</table>
<h3>${e.name}</h3>
<table id="${e.id}-settings" class="settings">
<tbody>`,Object.entries(e.schema).forEach(i=>t+=ne(e.id,i))}),u.container.insertAdjacentHTML("afterbegin",t+`
</tbody>
</table>
`)}function ne(t,e){let i=e[1].valueStrings[D(e[1],e[1].default)];return`
<tr id="${t}:${e[0]}" class="settings-entry" title="Default: ${i}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${e[1].description}</td>
      <td class="${ce(e[1])}">${e[1].valueStrings[e[1].current]}</td>
    </tr>`}function ce(t){switch(t.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${t.values[t.current]===!0?"true":"false"}`}}function De(t,e,i,n){n.current=n.current+1<n.values.length?n.current+1:n.current=0,u.settings[e][i]=n.values[n.current],u.settings[e][i]!==g[e][i]?t.classList.add("value-changed"):t.classList.remove("value-changed"),ue(t.querySelector(".value-string"),n)}function ue(t,e){t.classList=ce(e),t.textContent=e.valueStrings[e.current]}function Ne(t,e,i){Object.keys(t).forEach(n=>{n in e&&ue(document.getElementById(`${i}:${n}`).querySelector(".value-string"),e[n])})}function se(t){let e=t.target.closest("tr");if(e!==null){let i=e.id.split(":")[0],n=e.id.split(":")[1],s=y.findIndex(a=>a.id===i);t.type==="contextmenu"?(t.pointerType==="touch"||t.mozInputSource===5)&&(t.preventDefault(),re(y[s].name,y[s].schema[n])):t.shiftKey===!0?re(y[s].name,y[s].schema[n]):De(e,y[s].id,n,y[s].schema[n])}}function re(t,e){let i="";e.valueStrings.forEach(n=>i+=`${n}, `),$(`${t} setting details`,`<p><b>Description</b><br>${e.description}</p>
     <p><b>Values</b><br>${i.slice(0,i.length-2)}</p>
     <p><b>Current Value</b><br>${e.valueStrings[e.current]}</p>
     <p><b>Default Value</b><br>${e.valueStrings[D(e,e.default)]}</p>`)}function de(){document.querySelectorAll("#settings-container table").forEach(t=>{t.querySelectorAll("tr").forEach(e=>e.classList.remove("value-changed"))})}function Ye(){oe(),de(),v("All settings saved",3)}function Be(){y.forEach(t=>{Oe(u.settings[t.id],t.schema),Ne(u.settings[t.id],t.schema,t.id)}),de(),v("All settings reset",4,"Undo",()=>location.reload(),()=>oe())}var Ge=()=>{let t=null,e=null,i=null,n=null,s=!1,a=0;return window.addEventListener("load",()=>{k("#menu-primary-sections .menu-item-reshuffle a","click",_t),k("#menu-primary-sections .menu-item-pref-player","click",()=>Pt.toggle()),document.getElementById("menu-primary-channels")?.addEventListener("click",f)}),{isVisible(){return s},init:r,toggle:h,hide:d};function r(){t=document.getElementById("site-header"),e=document.querySelector("#site-navigation .nav-menu-outer"),i=document.querySelector("#site-navigation .nav-menu-inner"),n=document.getElementById("nav-menu-overlay"),Ct("div.nav-menu-toggle","click",h),n.addEventListener("click",d),window.addEventListener("resize",()=>I())}function h(){a=t.offsetHeight,s?d():l()}function l(){t.classList.contains("scrolling-down")===!1&&(s=!0,t.classList.remove("hide-nav-menu"),e.style.display="flex",n.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(g.site.modalOverlayOpacity/100))/10})`,n.classList.add("show"),tt(Z.SITE_MAX_WIDTH_MOBILE)&&N("hidden","close","100vh"),I())}function d(){s=!1,t.classList.add("hide-nav-menu"),e.style.display="",n.className="",N()}function f(b){let w=b.target.closest("li.menu-item.menu-item-object-uf_channel");w!==null&&(Ut()||R())&&(b?.preventDefault(),T(E(w.querySelector("a").href)))}function I(){if(s&&tt(Z.SITE_MAX_WIDTH_MOBILE)){let b=M("margin-top",i)+M("margin-bottom",i);i.style=`overflow-y: auto; max-height: ${window.innerHeight-(a+b)}px`}}function N(b="",w="menu",ge=""){document.documentElement.style.overflowY=b,t.querySelectorAll(".nav-menu-toggle span")?.forEach(pe=>pe.textContent=w),t.style.height=ge,i.style=""}},x=Ge();var he=L("index"),fe={keyboardShortcuts:null},S={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{he.log("DOMContentLoaded"),Ve(),Zt(),ae(),ze(),Je(),ft()});function Ve(){he.log("initIndex()"),fe.keyboardShortcuts=It(g.site.keyboardShortcuts),S.siteHeader=document.getElementById("site-header"),S.siteContent=document.getElementById("site-content"),S.siteContentSearch=document.querySelector("#site-content form input.search-field"),Ht(),F.init(),x.init(),ht.addEventListener(),We.addEventListener(),document.addEventListener("fullscreenElement",t=>S.fullscreenTarget=t.fullscreenTarget),document.addEventListener("keydown",Ke)}window.addEventListener("load",()=>{if(window.localStorage&&g.internal.showSiteInfoOnLoad&&document.body.classList.contains("home")&&(At()||xt())){let t='Ultrafunk is an interactive playlist with carefully chosen and continually updated tracks rooted in Funk and related genres. <a class="snackbar-message-link" href="/about/">More Details</a>';setTimeout(()=>{vt()===!1&&(v(t,10,null,null,()=>{g.internal.showSiteInfoOnLoad=!1},"rgb(122, 30, 30)"),k(".snackbar-message-link","click",()=>{g.internal.showSiteInfoOnLoad=!1}))},2e3)}});document.addEventListener("settingsUpdated",()=>{St(),Ot()});function Ke(t){if(t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"Escape":x.isVisible()&&(t.preventDefault(),x.hide());return}if(fe.keyboardShortcuts.allow()&&t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"L":X()&&me()&&(J.toggle(t),ht.trigger());break;case"n":case"N":X()&&(t.preventDefault(),x.toggle());break;case"s":case"S":X()&&je()&&(t.preventDefault(),F.toggle());break;case"T":X()&&me()&&z.toggle(t);break;case"ArrowLeft":t.shiftKey&&R()&&(t.preventDefault(),T(U.prevPage));break;case"ArrowRight":t.shiftKey&&R()&&(t.preventDefault(),T(U.nextPage));break}}function X(){return F.isVisible()===!1&&S.siteContentSearch!==document.activeElement}function me(){return document.body.classList.contains("page-settings")===!1}function je(){return S.fullscreenTarget===null}function ze(){S.siteContentSearch!==null&&(S.siteContentSearch.focus(),S.siteContentSearch.setSelectionRange(9999,9999))}function Je(){if(document.querySelector(".navbar-title .go-back-to")!==null){let t="";if(document.referrer.length===0)t="Previous Page";else{let e=new URL(decodeURIComponent(document.referrer));if(e.search.length!==0)t="Search Results";else if(e.pathname.length>1){let i=e.pathname.slice(-1)==="/"?1:0,n=e.pathname.slice(1,e.pathname.length-i).replace(/-/gi," ").split("/");n.forEach((s,a)=>{t+=a+1<n.length?s+" / ":s})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(e=>{e.querySelector(".go-back-title").textContent=t.length>0?t:"Ultrafunk (home)",e.querySelector(".go-back-to").style.opacity=1})}}var ht=(()=>{let t=0;return{getSiteHeaderYOffset(){return t},addEventListener:e,trigger:i};function e(){i(),window.addEventListener("resize",i)}function i(){let n=0;R()?n=M("--site-header-height-no-playback"):n=M("--site-header-height"),t=Math.round(n>150?n/2:n/3)}})(),We=(()=>{let t=0,e=0,i=0,n=!1,s=44;return{addEventListener:a};function a(){r(),window.addEventListener("scroll",r)}function r(){let f=window.pageYOffset;f===0?h():f>t?(i+=f-t,i>s&&f>ht.getSiteHeaderYOffset()&&(e=0,l())):(e+=t-f,e>s&&(i=0,d())),t=f}function h(){S.siteHeader.classList.remove("scrolling-down","scrolling-up"),S.siteHeader.classList.add("hide-nav-menu"),F.hide(),x.hide()}function l(){n===!1&&(n=!0,et(S.siteHeader,"scrolling-up","scrolling-down"),F.hide(),x.hide())}function d(){n===!0&&(n=!1,et(S.siteHeader,"scrolling-down","scrolling-up"))}})();
//# sourceMappingURL=index.js.map
