import{$ as $e,B as Ee,C as E,D as Ce,H as we,Ma as O,N as z,Na as Ae,O as R,Oa as xe,P as A,Pa as _e,Q as B,R as Te,S as H,T as F,U as se,V as Le,Va as Pe,W as b,X as T,Y as C,Z as Ie,_ as j,_a as Me,aa as re,ba as Y,ca as ae,da as x,i as L,l as pe,m as ye,n as P,o as be,q as c,r as K,s as M,t as N,u as ie,v as ke,w as Se,x as ve,y as U,z as y}from"./chunk-VVSTRTKJ.js";var Re=L("share-modal"),yt=()=>{let e=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,t,n,i,s,a,r,u,l,d;return{show:g};function g(p){return{title:t="Share / Play Track",bodyText:n=null,filterBodyText:i=!1,bodyHtml:s=null,url:a=null,urlType:r="Link",sourceUid:u=null,verb:l="Play",icon:d="link"}=p,x(t,I(),"share",$)}function I(){let p=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"searchOnGoogleId",icon:"search",content:"<b>Search</b> on Google"},{clickId:"amazonMusicId",icon:d,content:`<b>${l}</b> on Amazon Music`},{clickId:"appleMusicId",icon:d,content:`<b>${l}</b> on Apple Music`},{clickId:"spotifyId",icon:d,content:`<b>${l}</b> on Spotify`},{clickId:"youTubeMusicId",icon:d,content:`<b>${l}</b> on YouTube Music`}];return s!==null&&p.unshift({class:"track-share-entry",content:s}),p}function $(p){Re.log(`singleChoiceListClick(): ${p} - title: "${t}" - bodyText: "${n}" - filterBodyText: ${i} - url: ${a} - urlType: ${r} - sourceUid: ${u} - verb: ${l}`);let o=encodeURIComponent(i?n.replace(e," "):n);switch(p){case"copyToClipboardId":le(a,r);break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(`Ultrafunk ${r}: ${n}`)}&body=${encodeURI(a)}%0d%0a`;break;case"searchOnGoogleId":window.open(`https://www.google.com/search?q=${o}`,"_blank");break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${o}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${o}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${o}`,"_blank");break;case"youTubeMusicId":u!==null?window.open(`https://music.youtube.com/watch?v=${u}`,"_blank"):window.open(`https://music.youtube.com/search?q=${o}`,"_blank");break}}},J=yt();function le(e,t="Content"){navigator.clipboard?navigator.clipboard.writeText(e).then(()=>{E(`${t} copied to clipboard`,3)},n=>{Ue(n,e,t)}):bt(e)?E(`${t} copied to clipboard`,3):Ue(`document.execCommand('copy') for "${e}" failed!`,e,t)}function bt(e){let t=document.createElement("textarea");document.body.appendChild(t),t.textContent=e,t.select();let n=document.execCommand("copy");return document.body.removeChild(t),n}function Ue(e,t,n){Re.error(`copyTextToClipboard() error: ${e}`);let i=`
    <style>
      .modal-dialog-body p.modal-clipboard-content {
        padding: 10px 15px;
        border-radius: var(--dialog-border-radius);
        background-color: var(--list-row-odd-color);
      }
    </style>
    <p class="modal-clipboard-error">Failed to write ${n} to the clipboard, please copy the text below:</p>
    <p class="modal-clipboard-content">${t}</p>`;x("Copy to Clipboard error!",i)}var he=L("site-interaction"),w=document.documentElement.classList,He={metaUiElements:null,listUiElements:null},Q={},Z={};function Fe(){he.log("init()"),He.metaUiElements=new oe("div.track-meta",!0),He.listUiElements=new ce("#tracklist"),Q=new ue("footer-site-theme-toggle"),Z=new de("footer-gallery-layout-toggle"),window.addEventListener("load",()=>{document.querySelector(".widget ul.uf_channel")?.addEventListener("click",G),document.querySelector(".widget ul.uf_artist")?.addEventListener("click",G),document.querySelector(".widget.widget_archive ul")?.addEventListener("click",G)})}function Oe(){Q.setCurrent(),Z.setCurrent()}var oe=class extends Y{elementClicked(){if(this.clicked("div.track-share-control"))return qe(this.closest("single-track, gallery-track"));if(this.clicked("div.track-details-control"))return De(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return G(this.event);if(this.clicked("span.track-channels-links"))return G(this.event)}},ce=class extends Y{elementClicked(){if(this.clicked("div.share-play-button"))return qe(this.closest("div.track-entry"));if(this.clicked("div.details-button"))return De(this.closest("div.track-entry"))}};function G(e){e.target.matches("a")&&(e?.preventDefault(),T(C(e.target.href)))}function qe(e){let t=b(e,"data-track-artist"),n=b(e,"data-track-title"),i=J.show({bodyText:`${t} - ${n}`,filterBodyText:!0,bodyHtml:ae(e,t,n),url:b(e,"data-track-url"),urlType:"Track link",sourceUid:b(e,"data-track-source-uid")});Ne(i,`${t} - ${n}`)}function De(e){let t=b(e,"data-track-artist"),n=b(e,"data-track-title"),i=parseInt(e.getAttribute("data-track-duration")),s=e.querySelector(".track-artists-links").querySelectorAll("a"),a=e.querySelector(".track-channels-links").querySelectorAll("a"),r=[];r.push({class:"track-details-entry",content:ae(e,t,n)}),r.push({class:"header-entry",content:"Artists"}),s.forEach(l=>{r.push({clickId:`entry-${r.length}`,class:`icon-text ${l.classList[0]??""}`,title:"Go to Artist",content:l.innerText,link:l.href,icon:"link"})}),r.push({class:"header-entry",content:"Channels"}),a.forEach(l=>{r.push({clickId:`entry-${r.length}`,title:"Go to Channel",content:l.innerText,link:l.href,icon:"link"})});let u=x(`Track Details<span class="light-text lowercase-text">${i>0?Le(i):"N / A"}</span>`,r,"track-details",l=>{T(r.find(d=>d.clickId===l).link)});Ne(u,`${t} - ${n}`)}function Ne(e,t){document.getElementById(e).querySelector(".modal-track .modal-track-thumbnail").title="Click / tap to Copy Artist & Title",document.getElementById(e)?.querySelector("img")?.addEventListener("click",()=>le(t,"Artist &amp Title"))}function Be(e,t,n){let i=Object.values(e).find(s=>s.id===t);return i!==void 0?i:n}function Ye(e,t){let n=Object.values(e).findIndex(s=>s.id===t.id),i=Object.keys(e);return n+1<i.length?e[i[n+1]]:e[i[0]]}var ue=class extends re{constructor(t){super(t,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},black:{id:"black",text:"black",class:"site-theme-black"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=Be(this.themes,y.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=Ye(this.themes,this.currentTheme),y.site.theme=this.currentTheme.id}update(){let t=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),ie(c.UF_SITE_THEME,t.id),w.contains(t.class)===!1&&(he.log(`SiteThemeToggle.update() - newSiteTheme: ${t.id}`),w.remove(this.themes.light.class,this.themes.dark.class,this.themes.black.class),w.add(t.class)),this.value=this.currentTheme.text}},de=class extends re{constructor(t){super(t,!1),this.minWidth=`(max-width: ${Te("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=Be(this.layouts,y.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(t){w.contains("gallery-layout")&&(t.matches?(w.remove(this.currentLayout.class),w.add(this.layouts.oneColumn.class)):(w.remove(this.layouts.oneColumn.class),w.add(this.currentLayout.class)))}toggle(){this.currentLayout=Ye(this.layouts,this.currentLayout),y.gallery.layout=this.currentLayout.id}update(t){this.value=this.currentLayout.text,ie(c.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(w.contains("gallery-layout")&&w.contains(this.currentLayout.class)===!1&&(he.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),w.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),w.add(this.currentLayout.class)),t?.type==="click"&&this.element.scrollIntoView())}};function Ge(e,t,n){let i=`<b>${e}</b>`;return n.forEach((s,a)=>{let r=Ie(s.meta);i+=`
    <div class="track">
      <div class="thumbnail ${r.class}"
        data-term-url="${s.link}"
        data-term-slug="${t}"
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
    </div>`}),i}function Ve(e,t){let n=`<b>${e}</b><br>`;return t.forEach(i=>n+=`<a href="${C(i.link)}">${i.name}</a>, `),n.slice(0,n.length-2)}function Ke(e,t,n){let i=`<b>${e}</b><br>`;return t.forEach(s=>{let a=C(`${z}/artist/${s.artist_slug}/?channel=${n}`);i+=`<a href="${a}">${s.artist_name}</a> (${s.track_count})<br>`}),i}var m={termCache:{}};function fe(e,t,n){let i=b(e,"data-term-type"),s=parseInt(t.getAttribute("data-term-id")),a=b(t,"data-term-slug"),r=i==="channels";St(i,s,r?10:50,async u=>{let l=r?"Latest Tracks":"All Tracks",d=n.querySelector(".body-left");if(u!==null?(d.innerHTML=Ge(l,a,u),t.setAttribute("data-is-fetched",1)):E("Failed to fetch track data!",30,"retry",()=>fe(e,t,n)),!r&&u!==null)vt(u,s,50,(g,I)=>{l=g==="artists"?"Related Artists":"In Channels",d=g==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),I!==null?d.innerHTML=Ve(l,I):d.innerHTML=`<b>${l}</b><br>None found`});else if(u!==null){if(!("topArtists"in m.termCache[s])){let g=await j({endpoint:"top-artists",query:`channelId=${s}`,returnStatus:!0,path:"/wp-json/ultrafunk/v1/"});g!==null&&g.status.code===200&&(m.termCache[s].topArtists=g.data)}n.querySelector(".top-artists").innerHTML=Ke("Top Artists (tracks)",m.termCache[s].topArtists,a)}})}async function St(e,t,n,i){if(!(t in m.termCache)){let s=await j({endpoint:"tracks",query:`${e}=${t}&per_page=${n}&_fields=id,link,artists,channels,meta`,returnStatus:!0});s!==null&&s.status.code===200&&(m.termCache[t]={tracks:s.data})}i(m.termCache[t]!==void 0?m.termCache[t].tracks:null)}function vt(e,t,n,i){if("channels"in m.termCache[t]&&"artists"in m.termCache[t])i("channels",m.termCache[t].channels),i("artists",m.termCache[t].artists);else{let s=[],a=[];e.forEach(r=>{s.push.apply(s,r.channels),a.push.apply(a,r.artists)}),a=a.filter(r=>r!==t),ze("channels",t,[...new Set(s)],n,i),ze("artists",t,[...new Set(a)],n,i)}}async function ze(e,t,n,i,s){if(n.length>0){let a=await j({endpoint:e,query:`include=${n}&per_page=${i}&_fields=link,name`,returnStatus:!0});a!==null&&a.status.code===200&&(m.termCache[t][e]=a.data)}else m.termCache[t][e]=null;s(e,m.termCache[t][e]!==void 0?m.termCache[t][e]:null)}function je(){m.termCache=JSON.parse(sessionStorage.getItem(c.UF_TERMLIST_CACHE)),m.termCache===null&&(m.termCache={})}function We(){sessionStorage.setItem(c.UF_TERMLIST_CACHE,JSON.stringify(m.termCache))}function Je(){sessionStorage.removeItem(c.UF_TERMLIST_CACHE)}function Xe(){return Object.keys(m.termCache).length>0}var Qe=L("termlist"),h={listContainer:null,uiElements:null,navTitleFoundItems:null,termlistFilterInput:null,termlistEntries:null,transitionTimeoutId:0},Ct=new Event("allowKeyboardShortcuts"),wt=new Event("denyKeyboardShortcuts");function Ze(){document.getElementById("termlist-container")!==null&&(Qe.log("initTermlist()"),h.listContainer=document.getElementById("termlist-container"),h.uiElements=new me("#termlist-container"),Lt(),Tt())}function et(){if(Xe()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.getAttribute("data-is-expanded")==="1"&&e.openTermIds.push(t.id)}),sessionStorage.setItem(c.UF_TERMLIST_STATE,JSON.stringify(e)),We()}}function Tt(){if(je(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(c.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),window.scroll({top:e.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(c.UF_TERMLIST_STATE),Je()}function Lt(){h.listContainer.getAttribute("data-term-type")==="artists"&&(h.navTitleFoundItems=document.querySelectorAll("div.navbar-title span.found-items"),h.termlistFilterInput=document.getElementById("termlist-filter-input"),h.termlistEntries=h.listContainer.querySelectorAll(".termlist-entry"),h.termlistFilterInput.addEventListener("keyup",e=>$t(e)),h.termlistFilterInput.addEventListener("focus",()=>document.dispatchEvent(wt)),h.termlistFilterInput.addEventListener("blur",()=>document.dispatchEvent(Ct)),termsListArray.forEach(e=>e.name=e.name.toLowerCase()),document.querySelector("div.artist-letter.current").scrollIntoView(!1))}function It(e){return e==="ArrowLeft"||e==="ArrowRight"||e==="Home"||e==="End"||e==="Shift"}function $t(e){if(It(e.key))return;let t=performance.now(),n=h.termlistFilterInput.value.toLowerCase(),i=h.termlistEntries.length;if(h.listContainer.classList.add("notransitions"),n.length>=3){let r=termsListArray.filter(l=>l.name.includes(n)),u=1;i=r.length>0?r.length:0,h.termlistEntries.forEach(l=>{r.some(d=>d.id===l.id)===!1?l.className="termlist-entry hidden":l.className=`termlist-entry ${u++%2?"odd":"even"}`})}else h.termlistEntries.forEach(r=>r.className="termlist-entry");let s=n.length>=3?`"${n}" - `:"";h.navTitleFoundItems.forEach(r=>r.textContent=` ( ${s}${i} found )`),clearTimeout(h.transitionTimeoutId),h.transitionTimeoutId=setTimeout(()=>h.listContainer.classList.remove("notransitions"),250);let a=performance.now();Qe.log(`filterTermsList(): ${Math.round((a-t)*100)/100} ms.`)}var me=class extends Y{elementClicked(){if(this.clicked("div.play-button"))return ee(this.event,C(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return At(this.event,C(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return xt(this.element);if(this.clicked("div.termlist-header"))return Mt(this.event);if(this.clicked("div.thumbnail"))return _t(this.event,this.element);if(this.clicked("a"))return Pt(this.event,this.element)}};function ee(e,t,n=null){e?.preventDefault(),et(),sessionStorage.setItem(c.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:n,position:0})),T(t)}function At(e,t){M(c.UF_RESHUFFLE,"true"),ee(e,t)}function xt(e){let t=b(e,"data-term-name"),n=h.listContainer.getAttribute("data-term-type")==="channels"?"Channel link":"Artist link";J.show({title:`Share / Find ${b(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:C(e.getAttribute("data-term-url")),urlType:n,verb:"Find",icon:"search"})}function _t(e,t){let n=h.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=b(t,"data-term-slug"),s=parseInt(t.getAttribute("data-track-type")),a=t.getAttribute("data-track-source-uid");if(y.playback.preferredPlayer===ye.GALLERY||s===we.SOUNDCLOUD)ee(e,t.getAttribute("data-term-url"),null);else{let r=parseInt(t.getAttribute("data-track-num")),u="";r>U.listPerPage&&(u=`page/${Math.ceil(r/U.listPerPage)}/`),ee(e,`${z}/list/${n}/${i}/${u}`,a)}}function Pt(e,t){et(),t.closest("div.permalink")!==null&&(e?.preventDefault(),T(C(t.href)))}function Mt(e){let t=e.target.closest("div.termlist-entry"),n=t.querySelector("div.expand-toggle span"),i=t.querySelector("div.termlist-body"),s=t.getAttribute("data-is-expanded")==="1",a=t.getAttribute("data-is-fetched")==="1";t.setAttribute("data-is-expanded",s?"":"1"),n.textContent=s?"expand_more":"expand_less",i.style.display=s?"":"flex",!s&&!a&&fe(h.listContainer,t,i)}var tt=L("settings-ui"),f={settings:null,container:null},_={containerId:"settings-container",saveResetId:"settings-save-reset",updatedEvent:new Event("settingsUpdated")},k=[{name:"Playback",id:"playback",schema:P.playback},{name:"List Player",id:"list",schema:P.list},{name:"Gallery Player",id:"gallery",schema:P.gallery},{name:"Mobile",id:"mobile",schema:P.mobile},{name:"Site",id:"site",schema:P.site}],Ft=`<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear"><b>Clear All Settings</b></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;function at(){if(document.getElementById("settings-container")!==null)if(tt.log("initSettingsUi"),f.container=document.getElementById(_.containerId),f.container!==null){if(document.URL.includes("?clear=true")){nt();return}lt(!1),f.settings!==null?(k.forEach(e=>Ot(f.settings[e.id],e.schema)),Dt(),f.container.style.opacity=1,f.container.addEventListener("click",e=>st(e)),f.container.addEventListener("contextmenu",e=>st(e)),A(`#${_.saveResetId} .settings-save`,"click",Yt),A(`#${_.saveResetId} .settings-reset`,"click",Gt)):nt()}else tt.error(`Unable to getElementById() for '#${_.containerId}'`)}function nt(){document.getElementById(_.saveResetId).style.display="none",f.container.insertAdjacentHTML("afterbegin",Ft),f.container.style.minHeight="100%",f.container.style.opacity=1,A(`#${_.containerId} .settings-clear`,"click",()=>{localStorage.removeItem(c.UF_SETTINGS),localStorage.removeItem(c.UF_SITE_THEME),localStorage.removeItem(c.UF_GALLERY_LAYOUT),N(c.UF_GALLERY_PER_PAGE),N(c.UF_LIST_PER_PAGE),N(c.UF_PREFERRED_PLAYER),N(c.UF_SHUFFLE_UID),ve(!0),lt(!0),f.settings!==null?E("All settings have been cleared",5,"Reload",()=>window.location.href="/settings/",()=>window.location.href="/settings/"):E("Sorry, unable to clear all settings",5)})}function lt(e=!1){f.settings=ke(c.UF_SETTINGS,e?be:null,e)}function ot(){Se(c.UF_SETTINGS,f.settings),M(c.UF_GALLERY_PER_PAGE,f.settings.gallery.tracksPerPage,K*5),M(c.UF_LIST_PER_PAGE,f.settings.list.tracksPerPage,K*5),M(c.UF_PREFERRED_PLAYER,f.settings.playback.preferredPlayer,K*5),document.dispatchEvent(_.updatedEvent)}function Ot(e,t){Object.entries(e).forEach(([n,i])=>{n in t&&(t[n].current=V(t[n],i),t[n].current===-1&&(t[n].current=V(t[n],t[n].default)))})}function qt(e,t){Object.keys(e).forEach(n=>{n in t&&(e[n]=t[n].default,t[n].current=V(t[n],t[n].default))})}function V(e,t){return e.values.findIndex(n=>n===t)}function Dt(){let e=`
<h3>${k[0].name}</h3>
<table id="${k[0].id}-settings" class="settings">
<tbody>`;Object.entries(k[0].schema).forEach(t=>e+=it(k[0].id,t)),k.slice(1).forEach(t=>{e+=`
</tbody>
</table>
<h3>${t.name}</h3>
<table id="${t.id}-settings" class="settings">
<tbody>`,Object.entries(t.schema).forEach(n=>e+=it(t.id,n))}),f.container.insertAdjacentHTML("afterbegin",e+`
</tbody>
</table>
`)}function it(e,t){let n=t[1].valueStrings[V(t[1],t[1].default)];return`
<tr id="${e}:${t[0]}" class="settings-entry" title="Default: ${n}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
      <td class="description">${t[1].description}</td>
      <td class="${ct(t[1])}">${t[1].valueStrings[t[1].current]}</td>
    </tr>`}function ct(e){switch(e.type){case 1:return"value-string type-integer";case 3:return"value-string type-string";case 2:return`value-string type-boolean current-value-${e.values[e.current]===!0?"true":"false"}`}}function Nt(e,t,n,i){i.current=i.current+1<i.values.length?i.current+1:i.current=0,f.settings[t][n]=i.values[i.current],f.settings[t][n]!==y[t][n]?e.classList.add("value-changed"):e.classList.remove("value-changed"),ut(e.querySelector(".value-string"),i)}function ut(e,t){e.classList=ct(t),e.textContent=t.valueStrings[t.current]}function Bt(e,t,n){Object.keys(e).forEach(i=>{i in t&&ut(document.getElementById(`${n}:${i}`).querySelector(".value-string"),t[i])})}function st(e){let t=e.target.closest("tr");if(t!==null){let n=t.id.split(":")[0],i=t.id.split(":")[1],s=k.findIndex(a=>a.id===n);e.type==="contextmenu"?(e.pointerType==="touch"||e.mozInputSource===5)&&(e.preventDefault(),rt(k[s].name,k[s].schema[i])):e.shiftKey===!0?rt(k[s].name,k[s].schema[i]):Nt(t,k[s].id,i,k[s].schema[i])}}function rt(e,t){let n="";t.valueStrings.forEach(i=>n+=`${i}, `),x(`${e} setting details`,`<p><b>Description</b><br>${t.description}</p>
     <p><b>Values</b><br>${n.slice(0,n.length-2)}</p>
     <p><b>Current Value</b><br>${t.valueStrings[t.current]}</p>
     <p><b>Default Value</b><br>${t.valueStrings[V(t,t.default)]}</p>`)}function dt(){document.querySelectorAll("#settings-container table").forEach(e=>{e.querySelectorAll("tr").forEach(t=>t.classList.remove("value-changed"))})}function Yt(){ot(),dt(),E("All settings saved",3)}function Gt(){k.forEach(e=>{qt(f.settings[e.id],e.schema),Bt(f.settings[e.id],e.schema,e.id)}),dt(),E("All settings reset",4,"Undo",()=>location.reload(),()=>ot())}var Vt=()=>{let e=new ResizeObserver(g),t=null,n=null,i=null,s=null,a=!1,r=0;return window.addEventListener("load",()=>{A("#menu-primary-sections .menu-item-reshuffle a","click",_e),A("#menu-primary-sections .menu-item-pref-player","click",()=>Pe.toggle()),document.getElementById("menu-primary-channels")?.addEventListener("click",d)}),{isVisible(){return a},scrolledTop(){n.style.display=""},init:u,toggle:l};function u(){t=document.getElementById("site-header"),n=document.querySelector("#site-navigation .nav-menu-outer"),i=document.querySelector("#site-navigation .nav-menu-inner"),s=document.getElementById("nav-menu-modal-overlay"),B("div.nav-menu-toggle","click",l),s.addEventListener("click",l),window.addEventListener("resize",()=>I()),e.observe(n)}function l(){r=t.offsetHeight,t.classList.contains("sticky-nav-up")?n.style.display=a?"none":"flex":t.classList.contains("sticky-nav-down")===!1&&t.classList.toggle("hide-nav-menu")}function d(p){let o=p.target.closest("li.menu-item.menu-item-object-uf_channel");o!==null&&(Me()||O())&&(p?.preventDefault(),T(C(o.querySelector("a").href)))}function g(p){a=p[0].contentRect.height!==0,a?s.className===""&&(s.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(y.site.modalOverlayOpacity/100))/10})`,s.classList.add("show"),F(R.SITE_MAX_WIDTH_MOBILE)&&$("hidden","close","100vh"),I()):(s.className="",n.style.display="",$())}function I(){if(a&&F(R.SITE_MAX_WIDTH_MOBILE)){let p=H("margin-top",i)+H("margin-bottom",i);i.style=`overflow-y: auto; max-height: ${window.innerHeight-(r+p)}px`}}function $(p="",o="menu",S=""){document.documentElement.style.overflowY=p,t.querySelectorAll(".nav-menu-toggle span")?.forEach(ne=>ne.textContent=o),t.style.height=S,i.style=""}},q=Vt();var Kt=()=>{let e=new Event("allowKeyboardShortcuts"),t=new Event("denyKeyboardShortcuts"),n=null,i=null,s=null,a=null,r=!1;return{isVisible(){return r},init:u,toggle:l,hide:d};function u(){n=document.getElementById("site-header"),i=document.getElementById("search-container"),s=i.querySelector(".search-field"),a=n.querySelector("div.site-branding-container"),B(".nav-search-toggle","click",l),B(".nav-search-toggle","mousedown",o=>o.preventDefault()),s.addEventListener("blur",d),s.addEventListener("keydown",o=>{o.key==="Escape"&&r&&(o.stopPropagation(),d())})}function l(){g()?I():d()}function d(){r&&$(!1,e,"","search")}function g(){return i.style.display.length===0?!(n.offsetHeight===0||F(R.SITE_MAX_WIDTH_MOBILE)&&n.querySelector(".navbar-container-mobile-top").offsetHeight===0&&n.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function I(){p(),$(!0,t,"flex","close"),s.focus(),s.setSelectionRange(9999,9999)}function $(o,S,ne,gt){r=o,document.dispatchEvent(S),i.style.display=ne,document.querySelectorAll("div.nav-search-toggle span").forEach(pt=>pt.textContent=gt),r?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function p(){let o={};if(F(R.SITE_MAX_WIDTH_MOBILE))a.offsetHeight!==0?o.top=a.offsetTop:o.top=n.querySelector(".navbar-container-mobile-up").offsetTop,o=new DOMRect(63,o.top+3,document.body.clientWidth-60,30);else if(a.offsetHeight!==0){let S=a.getBoundingClientRect();o=new DOMRect(S.left,S.top+7,S.right,S.height-15)}else{let S=n.querySelector(".navbar-container").getBoundingClientRect();o=new DOMRect(S.left+88,S.top,S.right-90,S.height-1)}i.style.left=`${o.left}px`,i.style.top=`${o.top}px`,i.style.width=`${o.width-o.left}px`,i.style.height=`${o.height}px`}},D=Kt();var ft=L("index"),mt={keyboardShortcuts:null},v={siteHeader:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{ft.log("DOMContentLoaded"),zt(),Ze(),at(),Jt(),Xt(),pe()});function zt(){ft.log("initIndex()"),mt.keyboardShortcuts=$e(y.site.keyboardShortcuts),v.siteHeader=document.getElementById("site-header"),v.siteContent=document.getElementById("site-content"),v.siteContentSearch=document.querySelector("#site-content form input.search-field"),Fe(),D.init(),q.init(),ge.addEventListener(),Qt.addEventListener(),document.addEventListener("fullscreenElement",e=>v.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",jt)}window.addEventListener("load",()=>{if(window.localStorage&&y.internal.showSiteInfoOnLoad&&(Ae()||xe())){let e='Ultrafunk is an interactive playlist with carefully chosen and continually updated tracks rooted in Funk and related genres. <a class="snackbar-message-link" href="/about/">More Details</a>';setTimeout(()=>{Ce()===!1&&(E(e,10,null,null,()=>{y.internal.showSiteInfoOnLoad=!1},"rgb(122, 30, 30)"),document.querySelector(".snackbar-message-link").addEventListener("click",()=>{y.internal.showSiteInfoOnLoad=!1}))},2e3)}});document.addEventListener("settingsUpdated",()=>{Ee(),Oe()});function jt(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":q.isVisible()&&(e.preventDefault(),q.toggle());return}if(mt.keyboardShortcuts.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"L":te()&&ht()&&(Z.toggle(e),ge.trigger());break;case"n":case"N":te()&&(e.preventDefault(),q.toggle());break;case"s":case"S":te()&&Wt()&&(e.preventDefault(),D.toggle());break;case"T":te()&&ht()&&Q.toggle(e);break;case"ArrowLeft":e.shiftKey&&O()&&(e.preventDefault(),T(U.prevPage));break;case"ArrowRight":e.shiftKey&&O()&&(e.preventDefault(),T(U.nextPage));break}}function te(){return D.isVisible()===!1&&v.siteContentSearch!==document.activeElement}function ht(){return document.body.classList.contains("page-settings")===!1}function Wt(){return v.fullscreenTarget===null}function Jt(){v.siteContentSearch!==null&&(v.siteContentSearch.focus(),v.siteContentSearch.setSelectionRange(9999,9999))}function Xt(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let n=t.pathname.slice(-1)==="/"?1:0,i=t.pathname.slice(1,t.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((s,a)=>{e+=a+1<i.length?s+" / ":s})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var ge=(()=>{let e=0;return{getSiteHeaderYOffset(){return e},addEventListener:t,trigger:n};function t(){n(),window.addEventListener("resize",n)}function n(){let i=0;O()?i=H("--site-header-height-no-playback"):i=H("--site-header-height"),e=Math.round(i>150?i/2:i/3)}})(),Qt=(()=>{let e=0,t=0,n=0,i=!1,s=44;return{addEventListener:a};function a(){r(),window.addEventListener("scroll",r)}function r(){let g=window.pageYOffset;g===0?u():g>e?(n+=g-e,n>s&&g>ge.getSiteHeaderYOffset()&&(t=0,l())):(t+=e-g,t>s&&(n=0,d())),e=g}function u(){v.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),v.siteHeader.classList.add("hide-nav-menu"),D.hide(),q.scrolledTop()}function l(){i===!1&&(i=!0,se(v.siteHeader,"sticky-nav-up","sticky-nav-down"),D.hide())}function d(){i===!0&&(i=!1,se(v.siteHeader,"sticky-nav-down","sticky-nav-up"))}})();
//# sourceMappingURL=index.js.map
