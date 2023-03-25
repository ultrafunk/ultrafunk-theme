import{$ as $t,B as Et,C,D as Ct,H as wt,Ma as O,N as z,Na as At,O as R,Oa as xt,P as v,Pa as _t,Q as B,R as Tt,S as H,T as F,U as st,V as Lt,Va as Pt,W as b,X as L,Y as w,Z as It,_ as j,_a as Mt,aa as rt,ba as Y,ca as at,da as x,i as I,l as pt,m as yt,n as P,o as bt,q as c,r as K,s as M,t as N,u as it,v as kt,w as St,x as vt,y as U,z as y}from"./chunk-RPVLGOAL.js";var Rt=I("share-modal"),ye=()=>{let t=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,e,n,i,s,a,r,u,l,d;return{show:g};function g(p){return{title:e="Share / Play Track",bodyText:n=null,filterBodyText:i=!1,bodyHtml:s=null,url:a=null,urlType:r="Link",sourceUid:u=null,verb:l="Play",icon:d="link"}=p,x(e,$(),"share",A)}function $(){let p=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"searchOnGoogleId",icon:"search",content:"<b>Search</b> on Google"},{clickId:"amazonMusicId",icon:d,content:`<b>${l}</b> on Amazon Music`},{clickId:"appleMusicId",icon:d,content:`<b>${l}</b> on Apple Music`},{clickId:"spotifyId",icon:d,content:`<b>${l}</b> on Spotify`},{clickId:"youTubeMusicId",icon:d,content:`<b>${l}</b> on YouTube Music`}];return s!==null&&p.unshift({class:"track-share-entry",content:s}),p}function A(p){Rt.log(`singleChoiceListClick(): ${p} - title: "${e}" - bodyText: "${n}" - filterBodyText: ${i} - url: ${a} - urlType: ${r} - sourceUid: ${u} - verb: ${l}`);let o=encodeURIComponent(i?n.replace(t," "):n);switch(p){case"copyToClipboardId":lt(a,r);break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(`Ultrafunk ${r}: ${n}`)}&body=${encodeURI(a)}%0d%0a`;break;case"searchOnGoogleId":window.open(`https://www.google.com/search?q=${o}`,"_blank");break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${o}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${o}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${o}`,"_blank");break;case"youTubeMusicId":u!==null?window.open(`https://music.youtube.com/watch?v=${u}`,"_blank"):window.open(`https://music.youtube.com/search?q=${o}`,"_blank");break}}},J=ye();function lt(t,e="Content"){navigator.clipboard?navigator.clipboard.writeText(t).then(()=>{C(`${e} copied to clipboard`,3)},n=>{Ut(n,t,e)}):be(t)?C(`${e} copied to clipboard`,3):Ut(`document.execCommand('copy') for "${t}" failed!`,t,e)}function be(t){let e=document.createElement("textarea");document.body.appendChild(e),e.textContent=t,e.select();let n=document.execCommand("copy");return document.body.removeChild(e),n}function Ut(t,e,n){Rt.error(`copyTextToClipboard() error: ${t}`);let i=`
    <style>
      .modal-dialog-body p.modal-clipboard-content {
        padding: 10px 15px;
        border-radius: var(--dialog-border-radius);
        background-color: var(--list-row-odd-color);
      }
    </style>
    <p class="modal-clipboard-error">Failed to write ${n} to the clipboard, please copy the text below:</p>
    <p class="modal-clipboard-content">${e}</p>`;x("Copy to Clipboard error!",i)}var ht=I("site-interaction"),T=document.documentElement.classList,Ht={metaUiElements:null,listUiElements:null},Q={},Z={};function Ft(){ht.log("init()"),Ht.metaUiElements=new ot("div.track-meta",!0),Ht.listUiElements=new ct("#tracklist"),Q=new ut("footer-site-theme-toggle"),Z=new dt("footer-gallery-layout-toggle"),window.addEventListener("load",()=>{v(".widget ul.uf_channel","click",G),v(".widget ul.uf_artist","click",G),v(".widget.widget_archive ul","click",G)})}function Ot(){Q.setCurrent(),Z.setCurrent()}var ot=class extends Y{elementClicked(){if(this.clicked("div.track-share-control"))return qt(this.closest("single-track, gallery-track"));if(this.clicked("div.track-details-control"))return Dt(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return G(this.event);if(this.clicked("span.track-channels-links"))return G(this.event)}},ct=class extends Y{elementClicked(){if(this.clicked("div.share-play-button"))return qt(this.closest("div.track-entry"));if(this.clicked("div.details-button"))return Dt(this.closest("div.track-entry"))}};function G(t){t.target.matches("a")&&(t?.preventDefault(),L(w(t.target.href)))}function qt(t){let e=b(t,"data-track-artist"),n=b(t,"data-track-title"),i=J.show({bodyText:`${e} - ${n}`,filterBodyText:!0,bodyHtml:at(t,e,n),url:b(t,"data-track-url"),urlType:"Track link",sourceUid:b(t,"data-track-source-uid")});Nt(i,`${e} - ${n}`)}function Dt(t){let e=b(t,"data-track-artist"),n=b(t,"data-track-title"),i=parseInt(t.getAttribute("data-track-duration")),s=t.querySelector(".track-artists-links").querySelectorAll("a"),a=t.querySelector(".track-channels-links").querySelectorAll("a"),r=[];r.push({class:"track-details-entry",content:at(t,e,n)}),r.push({class:"header-entry",content:"Artists"}),s.forEach(l=>{r.push({clickId:`entry-${r.length}`,class:`icon-text ${l.classList[0]??""}`,title:"Go to Artist",content:l.innerText,link:l.href,icon:"link"})}),r.push({class:"header-entry",content:"Channels"}),a.forEach(l=>{r.push({clickId:`entry-${r.length}`,title:"Go to Channel",content:l.innerText,link:l.href,icon:"link"})});let u=x(`Track Details<span class="light-text lowercase-text">${i>0?Lt(i):"N / A"}</span>`,r,"track-details",l=>{L(r.find(d=>d.clickId===l).link)});Nt(u,`${e} - ${n}`)}function Nt(t,e){document.getElementById(t).querySelector(".modal-track .modal-track-thumbnail").title="Click / tap to Copy Artist & Title",document.getElementById(t)?.querySelector("img")?.addEventListener("click",()=>lt(e,"Artist &amp Title"))}function Bt(t,e,n){let i=Object.values(t).find(s=>s.id===e);return i!==void 0?i:n}function Yt(t,e){let n=Object.values(t).findIndex(s=>s.id===e.id),i=Object.keys(t);return n+1<i.length?t[i[n+1]]:t[i[0]]}var ut=class extends rt{constructor(e){super(e,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},black:{id:"black",text:"black",class:"site-theme-black"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=Bt(this.themes,y.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=Yt(this.themes,this.currentTheme),y.site.theme=this.currentTheme.id}update(){let e=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),it(c.UF_SITE_THEME,e.id),T.contains(e.class)===!1&&(ht.log(`SiteThemeToggle.update() - newSiteTheme: ${e.id}`),T.remove(this.themes.light.class,this.themes.dark.class,this.themes.black.class),T.add(e.class)),this.value=this.currentTheme.text}},dt=class extends rt{constructor(e){super(e,!1),this.minWidth=`(max-width: ${Tt("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=Bt(this.layouts,y.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(e){T.contains("gallery-layout")&&(e.matches?(T.remove(this.currentLayout.class),T.add(this.layouts.oneColumn.class)):(T.remove(this.layouts.oneColumn.class),T.add(this.currentLayout.class)))}toggle(){this.currentLayout=Yt(this.layouts,this.currentLayout),y.gallery.layout=this.currentLayout.id}update(e){this.value=this.currentLayout.text,it(c.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(T.contains("gallery-layout")&&T.contains(this.currentLayout.class)===!1&&(ht.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),T.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),T.add(this.currentLayout.class)),e?.type==="click"&&this.element.scrollIntoView())}};function Gt(t,e,n){let i=`<b>${t}</b>`;return n.forEach((s,a)=>{let r=It(s.meta);i+=`
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
    </div>`}),i}function Vt(t,e){let n=`<b>${t}</b><br>`;return e.forEach(i=>n+=`<a href="${w(i.link)}">${i.name}</a>, `),n.slice(0,n.length-2)}function Kt(t,e,n){let i=`<b>${t}</b><br>`;return e.forEach(s=>{let a=w(`${z}/artist/${s.artist_slug}/?channel=${n}`);i+=`<a href="${a}">${s.artist_name}</a> (${s.track_count})<br>`}),i}var m={termCache:{}};function ft(t,e,n){let i=b(t,"data-term-type"),s=parseInt(e.getAttribute("data-term-id")),a=b(e,"data-term-slug"),r=i==="channels";Se(i,s,r?10:50,async u=>{let l=r?"Latest Tracks":"All Tracks",d=n.querySelector(".body-left");if(u!==null?(d.innerHTML=Gt(l,a,u),e.setAttribute("data-is-fetched",1)):C("Failed to fetch track data!",30,"retry",()=>ft(t,e,n)),!r&&u!==null)ve(u,s,50,(g,$)=>{l=g==="artists"?"Related Artists":"In Channels",d=g==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),$!==null?d.innerHTML=Vt(l,$):d.innerHTML=`<b>${l}</b><br>None found`});else if(u!==null){if(!("topArtists"in m.termCache[s])){let g=await j({endpoint:"top-artists",query:`channelId=${s}`,returnStatus:!0,path:"/wp-json/ultrafunk/v1/"});g!==null&&g.status.code===200&&(m.termCache[s].topArtists=g.data)}n.querySelector(".top-artists").innerHTML=Kt("Top Artists (tracks)",m.termCache[s].topArtists,a)}})}async function Se(t,e,n,i){if(!(e in m.termCache)){let s=await j({endpoint:"tracks",query:`${t}=${e}&per_page=${n}&_fields=id,link,artists,channels,meta`,returnStatus:!0});s!==null&&s.status.code===200&&(m.termCache[e]={tracks:s.data})}i(m.termCache[e]!==void 0?m.termCache[e].tracks:null)}function ve(t,e,n,i){if("channels"in m.termCache[e]&&"artists"in m.termCache[e])i("channels",m.termCache[e].channels),i("artists",m.termCache[e].artists);else{let s=[],a=[];t.forEach(r=>{s.push.apply(s,r.channels),a.push.apply(a,r.artists)}),a=a.filter(r=>r!==e),zt("channels",e,[...new Set(s)],n,i),zt("artists",e,[...new Set(a)],n,i)}}async function zt(t,e,n,i,s){if(n.length>0){let a=await j({endpoint:t,query:`include=${n}&per_page=${i}&_fields=link,name`,returnStatus:!0});a!==null&&a.status.code===200&&(m.termCache[e][t]=a.data)}else m.termCache[e][t]=null;s(t,m.termCache[e][t]!==void 0?m.termCache[e][t]:null)}function jt(){m.termCache=JSON.parse(sessionStorage.getItem(c.UF_TERMLIST_CACHE)),m.termCache===null&&(m.termCache={})}function Wt(){sessionStorage.setItem(c.UF_TERMLIST_CACHE,JSON.stringify(m.termCache))}function Jt(){sessionStorage.removeItem(c.UF_TERMLIST_CACHE)}function Xt(){return Object.keys(m.termCache).length>0}var Qt=I("termlist"),h={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},Ce=new Event("allowKeyboardShortcuts"),we=new Event("denyKeyboardShortcuts");function Zt(){document.getElementById("termlist-container")!==null&&(Qt.log("initTermlist()"),h.listContainer=document.getElementById("termlist-container"),h.uiElements=new mt("#termlist-container"),Le(),Te())}function te(){if(Xt()){let t={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(e=>{e.getAttribute("data-is-expanded")==="1"&&t.openTermIds.push(e.id)}),sessionStorage.setItem(c.UF_TERMLIST_STATE,JSON.stringify(t)),Wt()}}function Te(){if(jt(),performance.getEntriesByType("navigation")[0].type!=="reload"){let t=JSON.parse(sessionStorage.getItem(c.UF_TERMLIST_STATE));t!==null&&t.pageUrl===window.location.href?(history.scrollRestoration="manual",t.openTermIds.forEach(e=>{document.getElementById(e).querySelector("div.termlist-header").click()}),window.scroll({top:t.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(c.UF_TERMLIST_STATE),Jt()}function Le(){h.listContainer.getAttribute("data-term-type")==="artists"&&(h.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),h.termlistFilterInput=document.getElementById("termlist-filter-input"),h.termlistEntries=h.listContainer.querySelectorAll(".termlist-entry"),h.termlistFilterInput.addEventListener("keyup",t=>$e(t)),h.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(we)),h.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(Ce)),termsListArray.forEach(t=>t.name=t.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1),h.termlistFilterInput.focus())}function Ie(t){return t==="ArrowLeft"||t==="ArrowRight"||t==="Home"||t==="End"||t==="Shift"}function $e(t){if(Ie(t.key))return;let e=performance.now(),n=h.termlistFilterInput.value.toLowerCase(),i=h.termlistEntries.length;if(h.listContainer.classList.add("notransitions"),n.length>=3){let r=termsListArray.filter(l=>l.name.includes(n)),u=1;i=r.length>0?r.length:0,h.termlistEntries.forEach(l=>{r.some(d=>d.id===l.id)===!1?l.className="termlist-entry hidden":l.className=`termlist-entry ${u++%2?"odd":"even"}`})}else h.termlistEntries.forEach(r=>r.className="termlist-entry");let s=n.length>=3?`"${n}" - `:"";h.navTitleFoundItems.forEach(r=>r.textContent=` ( ${s}${i} found )`),clearTimeout(h.transitionTimeoutId),h.transitionTimeoutId=setTimeout(()=>h.listContainer.classList.remove("notransitions"),250);let a=performance.now();Qt.log(`filterTermsList(): ${Math.round((a-e)*100)/100} ms.`)}var mt=class extends Y{elementClicked(){if(this.clicked("div.play-button"))return tt(this.event,w(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return Ae(this.event,w(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return xe(this.element);if(this.clicked("div.termlist-header"))return Me(this.event);if(this.clicked("div.thumbnail"))return _e(this.event,this.element);if(this.clicked("a"))return Pe(this.event,this.element)}};function tt(t,e,n=null){t?.preventDefault(),te(),sessionStorage.setItem(c.UF_AUTOPLAY,JSON.stringify({autoplay:t.shiftKey===!1,trackId:n,position:0})),L(e)}function Ae(t,e){M(c.UF_RESHUFFLE,"true"),tt(t,e)}function xe(t){let e=b(t,"data-term-name"),n=h.listContainer.getAttribute("data-term-type")==="channels"?"Channel link":"Artist link";J.show({title:`Share / Find ${b(t,"data-term-path")}`,bodyText:e,bodyHtml:`<b>${e}</b>`,url:w(t.getAttribute("data-term-url")),urlType:n,verb:"Find",icon:"search"})}function _e(t,e){let n=h.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=b(e,"data-term-slug"),s=parseInt(e.getAttribute("data-track-type")),a=e.getAttribute("data-track-source-uid");if(y.playback.preferredPlayer===yt.GALLERY||s===wt.SOUNDCLOUD)tt(t,e.getAttribute("data-term-url"),null);else{let r=parseInt(e.getAttribute("data-track-num")),u="";r>U.listPerPage&&(u=`page/${Math.ceil(r/U.listPerPage)}/`),tt(t,`${z}/list/${n}/${i}/${u}`,a)}}function Pe(t,e){te(),e.closest("div.permalink")!==null&&(t?.preventDefault(),L(w(e.href)))}function Me(t){let e=t.target.closest("div.termlist-entry"),n=e.querySelector("div.expand-toggle span"),i=e.querySelector("div.termlist-body"),s=e.getAttribute("data-is-expanded")==="1",a=e.getAttribute("data-is-fetched")==="1";e.setAttribute("data-is-expanded",s?"":"1"),n.textContent=s?"expand_more":"expand_less",i.style.display=s?"":"flex",!s&&!a&&ft(h.listContainer,e,i)}var ee=I("settings-ui"),f={settings:null,container:null},_={containerId:"settings-container",saveResetId:"settings-save-reset",updatedEvent:new Event("settingsUpdated")},k=[{name:"Playback",id:"playback",schema:P.playback},{name:"List Player",id:"list",schema:P.list},{name:"Gallery Player",id:"gallery",schema:P.gallery},{name:"Mobile",id:"mobile",schema:P.mobile},{name:"Site",id:"site",schema:P.site}],Fe=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear"><b>Clear All Settings</b></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function ae(){if(document.getElementById("settings-container")!==null)if(ee.log("initSettingsUi"),f.container=document.getElementById(_.containerId),f.container!==null){if(document.URL.includes("?clear=true")){ne();return}le(!1),f.settings!==null?(k.forEach(t=>Oe(f.settings[t.id],t.schema)),De(),f.container.style.opacity=1,f.container.addEventListener("click",t=>se(t)),f.container.addEventListener("contextmenu",t=>se(t)),v(`#${_.saveResetId} .settings-save`,"click",Ye),v(`#${_.saveResetId} .settings-reset`,"click",Ge)):ne()}else ee.error(`Unable to getElementById() for '#${_.containerId}'`)}function ne(){document.getElementById(_.saveResetId).style.display="none",f.container.insertAdjacentHTML("afterbegin",Fe),f.container.style.minHeight="100%",f.container.style.opacity=1,v(`#${_.containerId} .settings-clear`,"click",()=>{localStorage.removeItem(c.UF_SETTINGS),localStorage.removeItem(c.UF_SITE_THEME),localStorage.removeItem(c.UF_GALLERY_LAYOUT),N(c.UF_GALLERY_PER_PAGE),N(c.UF_LIST_PER_PAGE),N(c.UF_PREFERRED_PLAYER),N(c.UF_SHUFFLE_UID),vt(!0),le(!0),f.settings!==null?C("All settings have been cleared",5,"Reload",()=>window.location.href="/settings/",()=>window.location.href="/settings/"):C("Sorry, unable to clear all settings",5)})}function le(t=!1){f.settings=kt(c.UF_SETTINGS,t?bt:null,t)}function oe(){St(c.UF_SETTINGS,f.settings),M(c.UF_GALLERY_PER_PAGE,f.settings.gallery.tracksPerPage,K*5),M(c.UF_LIST_PER_PAGE,f.settings.list.tracksPerPage,K*5),M(c.UF_PREFERRED_PLAYER,f.settings.playback.preferredPlayer,K*5),document.dispatchEvent(_.updatedEvent)}function Oe(t,e){Object.entries(t).forEach(([n,i])=>{n in e&&(e[n].current=V(e[n],i),e[n].current===-1&&(e[n].current=V(e[n],e[n].default)))})}function qe(t,e){Object.keys(t).forEach(n=>{n in e&&(t[n]=e[n].default,e[n].current=V(e[n],e[n].default))})}function V(t,e){return t.values.findIndex(n=>n===e)}function De(){let t=`
<h3>${k[0].name}</h3>
<table id="${k[0].id}-settings" class="settings">
<tbody>`;Object.entries(k[0].schema).forEach(e=>t+=ie(k[0].id,e)),k.slice(1).forEach(e=>{t+=`
</tbody>
</table>
<h3>${e.name}</h3>
<table id="${e.id}-settings" class="settings">
<tbody>`,Object.entries(e.schema).forEach(n=>t+=ie(e.id,n))}),f.container.insertAdjacentHTML("afterbegin",t+`
</tbody>
</table>
`)}function ie(t,e){let n=e[1].valueStrings[V(e[1],e[1].default)];return`
<tr id="${t}:${e[0]}" class="settings-entry" title="Default: ${n}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${e[1].description}</td>
      <td class="${ce(e[1])}">${e[1].valueStrings[e[1].current]}</td>
    </tr>`}function ce(t){switch(t.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${t.values[t.current]===!0?"true":"false"}`}}function Ne(t,e,n,i){i.current=i.current+1<i.values.length?i.current+1:i.current=0,f.settings[e][n]=i.values[i.current],f.settings[e][n]!==y[e][n]?t.classList.add("value-changed"):t.classList.remove("value-changed"),ue(t.querySelector(".value-string"),i)}function ue(t,e){t.classList=ce(e),t.textContent=e.valueStrings[e.current]}function Be(t,e,n){Object.keys(t).forEach(i=>{i in e&&ue(document.getElementById(`${n}:${i}`).querySelector(".value-string"),e[i])})}function se(t){let e=t.target.closest("tr");if(e!==null){let n=e.id.split(":")[0],i=e.id.split(":")[1],s=k.findIndex(a=>a.id===n);t.type==="contextmenu"?(t.pointerType==="touch"||t.mozInputSource===5)&&(t.preventDefault(),re(k[s].name,k[s].schema[i])):t.shiftKey===!0?re(k[s].name,k[s].schema[i]):Ne(e,k[s].id,i,k[s].schema[i])}}function re(t,e){let n="";e.valueStrings.forEach(i=>n+=`${i}, `),x(`${t} setting details`,`<p><b>Description</b><br>${e.description}</p>
     <p><b>Values</b><br>${n.slice(0,n.length-2)}</p>
     <p><b>Current Value</b><br>${e.valueStrings[e.current]}</p>
     <p><b>Default Value</b><br>${e.valueStrings[V(e,e.default)]}</p>`)}function de(){document.querySelectorAll("#settings-container table").forEach(t=>{t.querySelectorAll("tr").forEach(e=>e.classList.remove("value-changed"))})}function Ye(){oe(),de(),C("All settings saved",3)}function Ge(){k.forEach(t=>{qe(f.settings[t.id],t.schema),Be(f.settings[t.id],t.schema,t.id)}),de(),C("All settings reset",4,"Undo",()=>location.reload(),()=>oe())}var Ve=()=>{let t=new ResizeObserver(g),e=null,n=null,i=null,s=null,a=!1,r=0;return window.addEventListener("load",()=>{v("#menu-primary-sections .menu-item-reshuffle a","click",_t),v("#menu-primary-sections .menu-item-pref-player","click",()=>Pt.toggle()),document.getElementById("menu-primary-channels")?.addEventListener("click",d)}),{isVisible(){return a},scrolledTop(){n.style.display=""},init:u,toggle:l};function u(){e=document.getElementById("site-header"),n=document.querySelector("#site-navigation .nav-menu-outer"),i=document.querySelector("#site-navigation .nav-menu-inner"),s=document.getElementById("nav-menu-modal-overlay"),B("div.nav-menu-toggle","click",l),s.addEventListener("click",l),window.addEventListener("resize",()=>$()),t.observe(n)}function l(){r=e.offsetHeight,e.classList.contains("sticky-nav-up")?n.style.display=a?"none":"flex":e.classList.contains("sticky-nav-down")===!1&&e.classList.toggle("hide-nav-menu")}function d(p){let o=p.target.closest("li.menu-item.menu-item-object-uf_channel");o!==null&&(Mt()||O())&&(p?.preventDefault(),L(w(o.querySelector("a").href)))}function g(p){a=p[0].contentRect.height!==0,a?s.className===""&&(s.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(y.site.modalOverlayOpacity/100))/10})`,s.classList.add("show"),F(R.SITE_MAX_WIDTH_MOBILE)&&A("hidden","close","100vh"),$()):(s.className="",n.style.display="",A())}function $(){if(a&&F(R.SITE_MAX_WIDTH_MOBILE)){let p=H("margin-top",i)+H("margin-bottom",i);i.style=`overflow-y: auto; max-height: ${window.innerHeight-(r+p)}px`}}function A(p="",o="menu",S=""){document.documentElement.style.overflowY=p,e.querySelectorAll(".nav-menu-toggle span")?.forEach(nt=>nt.textContent=o),e.style.height=S,i.style=""}},q=Ve();var Ke=()=>{let t=new Event("allowKeyboardShortcuts"),e=new Event("denyKeyboardShortcuts"),n=null,i=null,s=null,a=null,r=!1;return{isVisible(){return r},init:u,toggle:l,hide:d};function u(){n=document.getElementById("site-header"),i=document.getElementById("search-container"),s=i.querySelector(".search-field"),a=n.querySelector("div.site-branding-container"),B(".nav-search-toggle","click",l),B(".nav-search-toggle","mousedown",o=>o.preventDefault()),s.addEventListener("blur",d),s.addEventListener("keydown",o=>{o.key==="Escape"&&r&&(o.stopPropagation(),d())})}function l(){g()?$():d()}function d(){r&&A(!1,t,"","search")}function g(){return i.style.display.length===0?!(n.offsetHeight===0||F(R.SITE_MAX_WIDTH_MOBILE)&&n.querySelector(".navbar-container-mobile-top").offsetHeight===0&&n.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function $(){p(),A(!0,e,"flex","close"),s.focus(),s.setSelectionRange(9999,9999)}function A(o,S,nt,ge){r=o,document.dispatchEvent(S),i.style.display=nt,document.querySelectorAll("div.nav-search-toggle span").forEach(pe=>pe.textContent=ge),r?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function p(){let o={};if(F(R.SITE_MAX_WIDTH_MOBILE))a.offsetHeight!==0?o.top=a.offsetTop:o.top=n.querySelector(".navbar-container-mobile-up").offsetTop,o=new DOMRect(63,o.top+3,document.body.clientWidth-60,30);else if(a.offsetHeight!==0){let S=a.getBoundingClientRect();o=new DOMRect(S.left,S.top+7,S.right,S.height-15)}else{let S=n.querySelector(".navbar-container").getBoundingClientRect();o=new DOMRect(S.left+88,S.top,S.right-90,S.height-1)}i.style.left=`${o.left}px`,i.style.top=`${o.top}px`,i.style.width=`${o.width-o.left}px`,i.style.height=`${o.height}px`}},D=Ke();var fe=I("index"),me={keyboardShortcuts:null},E={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{fe.log("DOMContentLoaded"),ze(),Zt(),ae(),Je(),Xe(),pt()});function ze(){fe.log("initIndex()"),me.keyboardShortcuts=$t(y.site.keyboardShortcuts),E.siteHeader=document.getElementById("site-header"),E.siteContent=document.getElementById("site-content"),E.siteContentSearch=document.querySelector("#site-content form input.search-field"),Ft(),D.init(),q.init(),gt.addEventListener(),Qe.addEventListener(),document.addEventListener("fullscreenElement",t=>E.fullscreenTarget=t.fullscreenTarget),document.addEventListener("keydown",je)}window.addEventListener("load",()=>{if(window.localStorage&&y.internal.showSiteInfoOnLoad&&document.body.classList.contains("home")&&(At()||xt())){let t='Ultrafunk is an interactive playlist with carefully chosen and continually updated tracks rooted in Funk and related genres. <a class="snackbar-message-link" href="/about/">More Details</a>';setTimeout(()=>{Ct()===!1&&(C(t,11,null,null,()=>{y.internal.showSiteInfoOnLoad=!1},"rgb(122, 30, 30)"),v(".snackbar-message-link","click",()=>{y.internal.showSiteInfoOnLoad=!1}))},2e3)}});document.addEventListener("settingsUpdated",()=>{Et(),Ot()});function je(t){if(t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"Escape":q.isVisible()&&(t.preventDefault(),q.toggle());return}if(me.keyboardShortcuts.allow()&&t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"L":et()&&he()&&(Z.toggle(t),gt.trigger());break;case"n":case"N":et()&&(t.preventDefault(),q.toggle());break;case"s":case"S":et()&&We()&&(t.preventDefault(),D.toggle());break;case"T":et()&&he()&&Q.toggle(t);break;case"ArrowLeft":t.shiftKey&&O()&&(t.preventDefault(),L(U.prevPage));break;case"ArrowRight":t.shiftKey&&O()&&(t.preventDefault(),L(U.nextPage));break}}function et(){return D.isVisible()===!1&&E.siteContentSearch!==document.activeElement}function he(){return document.body.classList.contains("page-settings")===!1}function We(){return E.fullscreenTarget===null}function Je(){E.siteContentSearch!==null&&(E.siteContentSearch.focus(),E.siteContentSearch.setSelectionRange(9999,9999))}function Xe(){if(document.querySelector(".navbar-title .go-back-to")!==null){let t="";if(document.referrer.length===0)t="Previous Page";else{let e=new URL(decodeURIComponent(document.referrer));if(e.search.length!==0)t="Search Results";else if(e.pathname.length>1){let n=e.pathname.slice(-1)==="/"?1:0,i=e.pathname.slice(1,e.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((s,a)=>{t+=a+1<i.length?s+" / ":s})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(e=>{e.querySelector(".go-back-title").textContent=t.length>0?t:"Ultrafunk (home)",e.querySelector(".go-back-to").style.opacity=1})}}var gt=(()=>{let t=0;return{getSiteHeaderYOffset(){return t},addEventListener:e,trigger:n};function e(){n(),window.addEventListener("resize",n)}function n(){let i=0;O()?i=H("--site-header-height-no-playback"):i=H("--site-header-height"),t=Math.round(i>150?i/2:i/3)}})(),Qe=(()=>{let t=0,e=0,n=0,i=!1,s=44;return{addEventListener:a};function a(){r(),window.addEventListener("scroll",r)}function r(){let g=window.pageYOffset;g===0?u():g>t?(n+=g-t,n>s&&g>gt.getSiteHeaderYOffset()&&(e=0,l())):(e+=t-g,e>s&&(n=0,d())),t=g}function u(){E.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),E.siteHeader.classList.add("hide-nav-menu"),D.hide(),q.scrolledTop()}function l(){i===!1&&(i=!0,st(E.siteHeader,"sticky-nav-up","sticky-nav-down"),D.hide())}function d(){i===!0&&(i=!1,st(E.siteHeader,"sticky-nav-down","sticky-nav-up"))}})();
//# sourceMappingURL=index.js.map
