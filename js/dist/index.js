import{B as de,G as R,H as J,I as H,J as P,K as he,Ka as L,L as q,M as X,N as M,Na as ge,O as me,P as y,Q as T,R as k,S as fe,T as pe,Ta as ye,U as Q,V as _,W as Z,X as B,i as v,l as oe,m as le,o as h,p as G,q as ce,r as I,s as W,t as w,u as g,w as ue,x as A}from"./chunk-VYXAYTDJ.js";var ke=v("share-modal"),Ke=()=>{let e=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,t,n,i,r,s,a,o;return{show:l};function l(p){return{title:t="Share / Play Track",bodyText:n=null,filterBodyText:i=!1,bodyHtml:r=null,url:s=null,sourceUid:a=null,verb:o="Play"}=p,B(t,m(),"share",f)}function m(){let p=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"amazonMusicId",icon:"link",content:`<b>${o}</b> on Amazon Music`},{clickId:"appleMusicId",icon:"link",content:`<b>${o}</b> on Apple Music`},{clickId:"spotifyId",icon:"link",content:`<b>${o}</b> on Spotify`},{clickId:"tidalId",icon:"link",content:`<b>${o}</b> on Tidal`},{clickId:"youTubeMusicId",icon:"link",content:`<b>${o}</b> on YouTube Music`}];return r!==null&&p.unshift({class:"track-share-entry",content:r}),p}function f(p){ke.log(`singleChoiceListClick(): ${p} - title: "${t}" - bodyText: "${n}" - filterBodyText: ${i} - url: ${s} - sourceUid: ${a} - verb: ${o}`);let E=encodeURIComponent(i?n.replace(e," "):n);switch(p){case"copyToClipboardId":ee(s,"Track link copied to clipboard","Unable to copy Track link to clipboard");break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(n)}&body=${encodeURI(s)}%0d%0a`;break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${E}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${E}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${E}`,"_blank");break;case"tidalId":window.open(`https://google.com/search?q=${E}%20site:tidal.com`,"_blank");break;case"youTubeMusicId":a!==null?window.open(`https://music.youtube.com/watch?v=${a}`,"_blank"):window.open(`https://music.youtube.com/search?q=${E}`,"_blank");break}}},O=Ke();function ee(e,t="Text copied to clipboard",n="Unable to copy text to clipboard"){navigator.clipboard.writeText(e).then(()=>{A(t,3)},i=>{ke.error(`copyTextToClipboard() failed because ${i}`),A(n,5)})}var se=v("site-interaction"),b=document.documentElement.classList,be={metaUiElements:null,listUiElements:null},K={},Y={};function Ce(){se.log("init()"),be.metaUiElements=new te("div.track-meta",!0),be.listUiElements=new ne("#tracklist"),K=new ie("footer-site-theme-toggle"),Y=new re("footer-gallery-layout-toggle"),window.addEventListener("load",()=>{document.querySelector(".widget ul.uf_channel")?.addEventListener("click",F),document.querySelector(".widget ul.uf_artist")?.addEventListener("click",F),document.querySelector(".widget.widget_archive ul")?.addEventListener("click",F)})}function Te(){K.setCurrent(),Y.setCurrent()}var te=class extends _{elementClicked(){if(this.clicked("div.track-share-control"))return ve(this.closest("single-track, gallery-track"));if(this.clicked("span.term-links"))return F(this.event)}},ne=class extends _{elementClicked(){if(this.clicked("div.share-play-button"))return ve(this.closest("div.track-entry"));if(this.clicked("div.details-button"))return Ye(this.closest("div.track-entry"))}};function F(e){e.target.matches("a")&&(e?.preventDefault(),T(k(e.target.href)))}function ve(e){let t=y(e,"data-track-artist"),n=y(e,"data-track-title"),i=O.show({bodyText:`${t} - ${n}`,filterBodyText:!0,bodyHtml:Z(e,t,n),url:y(e,"data-track-url"),sourceUid:y(e,"data-track-source-uid")});Ee(i,`${t} - ${n}`)}function Ye(e){let t=y(e,"data-track-artist"),n=y(e,"data-track-title"),i=parseInt(e.getAttribute("data-track-duration")),r=e.querySelector(".track-artists-links").querySelectorAll("a"),s=e.querySelector(".track-channels-links").querySelectorAll("a"),a=[];a.push({class:"track-details-entry",content:Z(e,t,n)}),a.push({class:"header-entry",content:"Artists"}),r.forEach(l=>{a.push({clickId:`entry-${a.length}`,class:`icon-text ${l.classList[0]}`,title:"Go to Artist",content:l.innerText,link:l.href,icon:"link"})}),a.push({class:"header-entry",content:"Channels"}),s.forEach(l=>{a.push({clickId:`entry-${a.length}`,title:"Go to Channel",content:l.innerText,link:l.href,icon:"link"})});let o=B(`Track Details<span class="light-text lowercase-text">${i>0?me(i):"N / A"}</span>`,a,"track-details",l=>{T(a.find(m=>m.clickId===l).link)});Ee(o,`${t} - ${n}`)}function Ee(e,t){document.getElementById(e).querySelector(".modal-track").title="Click / tap to Copy Artist & Title",document.getElementById(e)?.querySelector("img")?.addEventListener("click",()=>{ee(t,"Artist &amp Title copied to clipboard","Unable to copy Artist &amp Title to clipboard")})}function Se(e,t,n){let i=Object.values(e).find(r=>r.id===t);return i!==void 0?i:n}function we(e,t){let n=Object.values(e).findIndex(r=>r.id===t.id),i=Object.keys(e);return n+1<i.length?e[i[n+1]]:e[i[0]]}var ie=class extends Q{constructor(t){super(t,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=Se(this.themes,g.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=we(this.themes,this.currentTheme),g.site.theme=this.currentTheme.id}update(){let t=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),W(h.UF_SITE_THEME,t.id),b.contains(t.class)===!1&&(se.log(`SiteThemeToggle.update() - newSiteTheme: ${t.id}`),b.remove(this.themes.light.class,this.themes.dark.class),b.add(t.class)),this.value=this.currentTheme.text}},re=class extends Q{constructor(t){super(t,!1),this.minWidth=`(max-width: ${he("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=Se(this.layouts,g.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(t){b.contains("gallery-layout")&&(t.matches?(b.remove(this.currentLayout.class),b.add(this.layouts.oneColumn.class)):(b.remove(this.layouts.oneColumn.class),b.add(this.currentLayout.class)))}toggle(){this.currentLayout=we(this.layouts,this.currentLayout),g.gallery.layout=this.currentLayout.id}update(t){this.value=this.currentLayout.text,W(h.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(b.contains("gallery-layout")&&b.contains(this.currentLayout.class)===!1&&(se.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),b.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),b.add(this.currentLayout.class)),t?.type==="click"&&this.element.scrollIntoView())}};function Le(e,t,n){let i=`<b>${e}</b>`;return n.forEach((r,s)=>{let a=fe(r.meta);i+=`
    <div class="track">
      <div class="thumbnail ${a.class}"
        data-term-url="${r.link}"
        data-term-slug="${t}"
        data-track-num="${s+1}"
        data-track-type="${r.meta.track_source_type}"
        data-track-id="track-${r.id}"
        data-track-source-uid="${a.uid}" title="Play Track"
        >
        <img src="${a.src}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${r.link}" title="Go to track"><span><b>${r.meta.track_artist}</b></span><br><span>${r.meta.track_title}</span></a>
      </div>
    </div>`}),i}function $e(e,t){let n=`<b>${e}</b><br>`;return t.forEach(i=>n+=`<a href="${k(i.link)}">${i.name}</a>, `),n.slice(0,n.length-2)}function xe(e,t,n){let i=`<b>${e}</b><br>`;return t.forEach(r=>{i+=`<a href="${k(`${R}/artist/${r.artist_slug}/?channel=${n}`)}">${r.artist_name}</a> (${r.track_count})<br>`}),i}var $=v("termlist-rest"),d={termCache:{}};function Ae(e,t,n){let i=y(e,"data-term-type"),r=parseInt(t.getAttribute("data-term-id")),s=y(t,"data-term-slug"),a=i==="channels";ze(i,r,a?10:50,async o=>{let l=a?"Latest Tracks":"All Tracks",m=n.querySelector(".body-left");if(o!==null?(m.innerHTML=Le(l,s,o),t.classList.add("data-fetched")):A("Unable to fetch track data, please try again...",10),!a&&o!==null)je(o,r,50,(f,p)=>{l=f==="artists"?"Related Artists":"In Channels",m=f==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),p!==null?m.innerHTML=$e(l,p):m.innerHTML=`<b>${l}</b><br>None found`});else if(o!==null){if(!("topArtists"in d.termCache[r])){let f=await pe("top-artists",`channelId=${r}`,!0,"/wp-json/ultrafunk/v1/");f!==null&&f.status.code===200&&(d.termCache[r].topArtists=f.data)}n.querySelector(".top-artists").innerHTML=xe("Top Artists (tracks)",d.termCache[r].topArtists,s)}})}function ze(e,t,n,i){t in d.termCache?i(d.termCache[t].tracks):($.log(`fetchTracks() - termType: ${e} - termId: ${t} - maxItems: ${n}`),fetch(`/wp-json/wp/v2/tracks?${e}=${t}&per_page=${n}&_fields=id,link,artists,channels,meta`).then(r=>r.ok?r.json():($.error(r),null)).then(r=>{d.termCache[t]={tracks:r},i(r)}).catch(r=>{$.warn(r),i(null)}))}function je(e,t,n,i){if("channels"in d.termCache[t]&&"artists"in d.termCache[t])i("channels",d.termCache[t].channels),i("artists",d.termCache[t].artists);else{let r=[],s=[];e.forEach(a=>{r.push.apply(r,a.channels),s.push.apply(s,a.artists)}),s=s.filter(a=>a!==t),Ie("channels",t,[...new Set(r)],n,i),Ie("artists",t,[...new Set(s)],n,i)}}function Ie(e,t,n,i,r){n.length>0?($.log(`fetchMeta() - termType: ${e} - termIds: ${n.length>0?n:"Empty"} - maxItems: ${i}`),fetch(`/wp-json/wp/v2/${e}?include=${n}&per_page=${i}&_fields=link,name`).then(s=>s.ok?s.json():($.error(s),null)).then(s=>{d.termCache[t][e]=s,r(e,s)}).catch(s=>{$.warn(s),r(null)})):(d.termCache[t][e]=null,r(e,null))}function Pe(){d.termCache=JSON.parse(sessionStorage.getItem(h.UF_TERMLIST_CACHE)),d.termCache===null&&(d.termCache={})}function Me(){sessionStorage.setItem(h.UF_TERMLIST_CACHE,JSON.stringify(d.termCache))}function _e(){sessionStorage.removeItem(h.UF_TERMLIST_CACHE)}function Ue(){return Object.keys(d.termCache).length>0}var We=v("termlist-controls"),V={listContainer:null,uiElements:null};function Re(){We.log("init()"),V.listContainer=document.getElementById("termlist-container"),V.uiElements=new ae("#termlist-container"),Je()}function He(){if(Ue()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.classList.contains("open")&&e.openTermIds.push(t.id)}),sessionStorage.setItem(h.UF_TERMLIST_STATE,JSON.stringify(e)),Me()}}function Je(){if(Pe(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(h.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),window.scroll({top:e.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(h.UF_TERMLIST_STATE),_e()}var ae=class extends _{elementClicked(){if(this.clicked("div.play-button"))return z(this.event,k(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return Xe(this.event,k(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return Qe(this.element);if(this.clicked("div.termlist-header"))return tt(this.event);if(this.clicked("div.thumbnail"))return Ze(this.event,this.element);if(this.clicked("a"))return et(this.event,this.element)}};function z(e,t,n=null){e?.preventDefault(),He(),sessionStorage.setItem(h.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:n,position:0})),T(t)}function Xe(e,t){I(h.UF_RESHUFFLE,"true"),z(e,t)}function Qe(e){let t=y(e,"data-term-name");O.show({title:`Share / Find ${y(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:k(e.getAttribute("data-term-url")),verb:"Find"})}function Ze(e,t){let n=V.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=y(t,"data-term-slug"),r=parseInt(t.getAttribute("data-track-type")),s=t.getAttribute("data-track-source-uid");if(g.playback.preferredPlayer===le.GALLERY||r===de.SOUNDCLOUD)z(e,t.getAttribute("data-term-url"),null);else{let a=parseInt(t.getAttribute("data-track-num")),o="";a>w.listPerPage&&(o=`page/${Math.ceil(a/w.listPerPage)}/`),z(e,`${R}/list/${n}/${i}/${o}`,s)}}function et(e,t){He(),t.closest("div.permalink")!==null&&(e?.preventDefault(),T(k(t.href)))}function tt(e){let t=e.target.closest("div.termlist-entry"),n=t.querySelector("div.expand-toggle span"),i=t.querySelector("div.termlist-body"),r=i.style.display.length!==0,s=t.classList.contains("data-fetched");M(t,r?"open":"closed",r?"closed":"open"),n.textContent=r?"expand_more":"expand_less",i.style.display=r?"":"flex",!r&&!s&&Ae(V.listContainer,t,i)}var it=()=>{let e=new ResizeObserver(l),t=null,n=null,i=null,r=!1;return window.addEventListener("load",()=>{H("#menu-primary-menu .menu-item-reshuffle a","click",ge),document.getElementById("menu-primary-menu")?.addEventListener("click",a)}),{isVisible(){return r},scrolledTop(){n.style.display=""},init:s,toggle:o};function s(){t=document.getElementById("site-header"),n=document.querySelector("#site-navigation .nav-menu-outer"),i=document.getElementById("nav-menu-modal-overlay"),P(".nav-menu-toggle","click",o),i.addEventListener("click",o),i.addEventListener("transitionend",m),e.observe(n.querySelector(".menu-primary-menu-container"))}function a(f){let p=f.target.closest("li.menu-item.menu-item-object-uf_channel");p!==null&&(ye()||L())&&(f?.preventDefault(),T(k(p.querySelector("a").href)))}function o(){t.classList.contains("sticky-nav-up")?r?n.style.display="none":n.style.display="flex":t.classList.contains("sticky-nav-down")===!1&&t.classList.toggle("hide-nav-menu")}function l(f){r=f[0].contentRect.height!==0,r?(i.className="",i.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(g.site.modalOverlayOpacity/100))/10})`,i.classList.add("show"),setTimeout(()=>i.classList.add("fadein"),50)):i.classList.add("fadeout")}function m(){r===!1&&(i.className="",n.style.display="")}},S=it();var rt=()=>{let e=new Event("allowKeyboardShortcuts"),t=new Event("denyKeyboardShortcuts"),n=null,i=null,r=null,s=null,a=!1;return{isVisible(){return a},init:o,toggle:l,hide:m};function o(){n=document.getElementById("site-header"),i=document.getElementById("search-container"),r=i.querySelector(".search-field"),s=n.querySelector("div.site-branding-container"),P(".nav-search-toggle","click",l),P(".nav-search-toggle","mousedown",u=>u.preventDefault()),r.addEventListener("blur",m),r.addEventListener("keydown",u=>{u.key==="Escape"&&(u.stopPropagation(),m())})}function l(){f()?p():m()}function m(){a&&E(!1,e,"","search")}function f(){return i.style.display.length===0?!(n.offsetHeight===0||X(J.SITE_MAX_WIDTH_MOBILE)&&n.querySelector(".navbar-container-mobile-top").offsetHeight===0&&n.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function p(){De(),E(!0,t,"flex","clear"),r.focus(),r.setSelectionRange(9999,9999)}function E(u,C,Oe,Fe){a=u,document.dispatchEvent(C),i.style.display=Oe,document.querySelectorAll("div.nav-search-toggle span").forEach(Ne=>Ne.textContent=Fe),a?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function De(){let u={};if(X(J.SITE_MAX_WIDTH_MOBILE))s.offsetHeight!==0?u.top=s.offsetTop:u.top=n.querySelector(".navbar-container-mobile-up").offsetTop,u=new DOMRect(63,u.top+3,document.body.clientWidth-60,30);else if(s.offsetHeight!==0){let C=s.getBoundingClientRect();u=new DOMRect(C.left,C.top+7,C.right,C.height-15)}else{let C=n.querySelector(".navbar-container").getBoundingClientRect();u=new DOMRect(C.left+88,C.top,C.right-90,C.height-1)}i.style.left=`${u.left}px`,i.style.top=`${u.top}px`,i.style.width=`${u.width-u.left}px`,i.style.height=`${u.height}px`}},U=rt();var Be=v("index"),c={siteHeader:null,introBanner:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{Be.log("DOMContentLoaded"),st(),c.introBanner!==null&&lt(),document.getElementById("termlist-container")!==null&&Re(),c.siteContentSearch!==null&&(c.siteContentSearch.focus(),c.siteContentSearch.setSelectionRange(9999,9999)),ct(),oe()});function st(){Be.log("initIndex()"),c.siteHeader=document.getElementById("site-header"),c.introBanner=document.getElementById("intro-banner"),c.siteContent=document.getElementById("site-content"),c.siteContentSearch=document.querySelector("#site-content form input.search-field"),Ce(),U.init(),S.init(),x.addEventListener(),ut.addEventListener(),document.addEventListener("fullscreenElement",e=>c.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",at)}document.addEventListener("settingsUpdated",()=>{ue(),Te(),I(h.UF_GALLERY_PER_PAGE,g.gallery.tracksPerPage,G*5),I(h.UF_PREFERRED_PLAYER,g.playback.preferredPlayer,G*5)});function at(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":S.isVisible()&&(e.preventDefault(),S.toggle());return}if(g.site.keyboardShortcuts&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"c":case"C":j()&&(e.preventDefault(),S.toggle());break;case"L":j()&&qe()&&(Y.toggle(e),x.trigger());break;case"s":case"S":j()&&ot()&&(e.preventDefault(),U.toggle());break;case"T":j()&&qe()&&K.toggle(e);break;case"ArrowLeft":e.shiftKey&&L()&&(e.preventDefault(),T(w.prevPage));break;case"ArrowRight":e.shiftKey&&L()&&(e.preventDefault(),T(w.nextPage));break}}function j(){return U.isVisible()===!1&&c.siteContentSearch!==document.activeElement}function qe(){return document.body.classList.contains("page-settings")===!1}function ot(){return c.fullscreenTarget===null}function lt(){ce("localStorage")&&bannerProperty&&g.banners[bannerProperty]&&(c.introBanner.style.display="block",x.trigger(),H("#intro-banner .intro-banner-close-button","click",()=>{c.introBanner.style.display="",c.siteContent.style.marginTop="",g.banners[bannerProperty]=!1}))}function ct(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let n=t.pathname.slice(-1)==="/"?1:0,i=t.pathname.slice(1,t.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((r,s)=>{e+=s+1<i.length?r+" / ":r})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var x=(()=>{let e=0;return{getHeaderHeight(){return e},addEventListener:t,trigger:n};function t(){n(),window.addEventListener("resize",n)}function n(){L()?e=q("--site-header-height-no-playback"):e=q("--site-header-height"),c.introBanner!==null&&c.introBanner.style.display.length!==0&&(c.introBanner.style.marginTop=`${e}px`,c.siteContent.style.marginTop=`${q("--site-content-margin-top",document.body)}px`)}})(),ut=(()=>{let e=0,t=!1;return{addEventListener:n};function n(){i(),window.addEventListener("scroll",i)}function i(){let o=window.pageYOffset,l=Math.round(x.getHeaderHeight()>150?x.getHeaderHeight()/2:x.getHeaderHeight()/3);o===0||Math.round(o)<=1?r():o>l&&o>e?s():a(),U.hide(),e=o}function r(){c.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),c.siteHeader.classList.add("hide-nav-menu"),S.scrolledTop()}function s(){t===!1&&(t=!0,M(c.siteHeader,"sticky-nav-up","sticky-nav-down"))}function a(){t===!0&&(t=!1,M(c.siteHeader,"sticky-nav-down","sticky-nav-up")),S.isVisible()&&S.toggle()}})();
//# sourceMappingURL=index.js.map
