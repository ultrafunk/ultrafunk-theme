import{Aa as _,Ba as fe,Ca as f,Da as b,Ea as C,Fa as pe,P as U,b as E,ba as X,ca as H,d as le,da as ue,f as d,g as W,ga as I,h as oe,i as P,j,ja as de,k as L,l as g,n as ce,o as J,p as M,ta as he,ua as Q,va as q,wa as w,xa as me,ya as B,za as Z}from"./chunk-YHTBNYHP.js";var ge=E("share-modal"),De=()=>{let e=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,t,n,i,r,s,a,l;return{show:o};function o(m){return{title:t="Share / Play Track",bodyText:n=null,filterBodyText:i=!1,bodyHtml:r=null,url:s=null,sourceUid:a=null,verb:l="Play"}=m,H(t,h(),"share",y)}function h(){let m=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"amazonMusicId",icon:"link",content:`<b>${l}</b> on Amazon Music`},{clickId:"appleMusicId",icon:"link",content:`<b>${l}</b> on Apple Music`},{clickId:"spotifyId",icon:"link",content:`<b>${l}</b> on Spotify`},{clickId:"tidalId",icon:"link",content:`<b>${l}</b> on Tidal`},{clickId:"youTubeMusicId",icon:"link",content:`<b>${l}</b> on YouTube Music`}];return r!==null&&m.unshift({class:"track-share-entry",content:r}),m}function y(m){ge.log(`singleChoiceListClick(): ${m} - title: "${t}" - bodyText: "${n}" - filterBodyText: ${i} - url: ${s} - sourceUid: ${a} - verb: ${l}`);let T=encodeURIComponent(i?n.replace(e," "):n);switch(m){case"copyToClipboardId":ee(s,"Track link copied to clipboard","Unable to copy Track link to clipboard");break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(n)}&body=${encodeURI(s)}%0d%0a`;break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${T}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${T}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${T}`,"_blank");break;case"tidalId":window.open(`https://google.com/search?q=${T}%20site:tidal.com`,"_blank");break;case"youTubeMusicId":a!==null?window.open(`https://music.youtube.com/watch?v=${a}`,"_blank"):window.open(`https://music.youtube.com/search?q=${T}`,"_blank");break}}},O=De();function ee(e,t="Text copied to clipboard",n="Unable to copy text to clipboard"){navigator.clipboard.writeText(e).then(()=>{M(t,3)},i=>{ge.error(`copyTextToClipboard() failed because ${i}`),M(n,5)})}var se=E("site-interaction"),v=document.documentElement.classList,F={metaUiElements:null,listUiElements:null},Y={},V={};function ye(){se.log("init()"),F.metaUiElements=new te,F.listUiElements=new ne,Y=new ie("footer-site-theme-toggle"),V=new re("footer-gallery-layout-toggle"),w(".entry-meta","click",e=>F.metaUiElements.clickHandler(e)),document.getElementById("tracklist")?.addEventListener("click",e=>F.listUiElements.clickHandler(e)),window.addEventListener("load",()=>{document.querySelector(".widget ul.uf_channel")?.addEventListener("click",N),document.querySelector(".widget ul.uf_artist")?.addEventListener("click",N),document.querySelector(".widget.widget_archive ul")?.addEventListener("click",N)})}function ke(){Y.setCurrent(),V.setCurrent()}var te=class extends U{elementClicked(){if(this.clicked("div.track-share-control"))return be(this.event.target);if(this.clicked("span.term-links"))return N(this.event)}},ne=class extends U{elementClicked(){if(this.clicked("div.share-play-button"))return be(this.closest("div.track-entry"));if(this.clicked("div.details-button"))return Oe(this.closest("div.track-entry"))}};function N(e){e.target.matches("a")&&(e?.preventDefault(),b(C(e.target.href)))}function be(e){let t=f(e,"data-track-artist"),n=f(e,"data-track-title"),i=O.show({bodyText:`${t} - ${n}`,filterBodyText:!0,bodyHtml:X(e,t,n),url:f(e,"data-track-url"),sourceUid:f(e,"data-track-source-uid")});Ce(i,`${t} - ${n}`)}function Oe(e){let t=f(e,"data-track-artist"),n=f(e,"data-track-title"),i=parseInt(e.getAttribute("data-track-duration")),r=e.querySelector(".track-artists-links").querySelectorAll("a"),s=e.querySelector(".track-channels-links").querySelectorAll("a"),a=[];a.push({class:"track-details-entry",content:X(e,t,n)}),a.push({class:"header-entry",content:"Artists"}),r.forEach(o=>{a.push({clickId:`entry-${a.length}`,class:`icon-text ${o.classList[0]}`,title:"Go to Artist",content:o.innerText,link:o.href,icon:"link"})}),a.push({class:"header-entry",content:"Channels"}),s.forEach(o=>{a.push({clickId:`entry-${a.length}`,title:"Go to Channel",content:o.innerText,link:o.href,icon:"link"})});let l=H(`Track Details<span class="light-text lowercase-text">${i>0?fe(i):"N / A"}</span>`,a,"track-details",o=>{b(a.find(h=>h.clickId===o).link)});Ce(l,`${t} - ${n}`)}function Ce(e,t){document.getElementById(e).querySelector(".modal-track").title="Click thumbnail to Copy Artist & Title",document.getElementById(e)?.querySelector("img")?.addEventListener("click",()=>{ee(t,"Artist &amp Title copied to clipboard","Unable to copy Artist &amp Title to clipboard")})}function Ee(e,t,n){let i=Object.values(e).find(r=>r.id===t);return i!==void 0?i:n}function ve(e,t){let n=Object.values(e).findIndex(r=>r.id===t.id),i=Object.keys(e);return n+1<i.length?e[i[n+1]]:e[i[0]]}var ie=class extends J{constructor(t){super(t,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=Ee(this.themes,g.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=ve(this.themes,this.currentTheme),g.site.theme=this.currentTheme.id}update(){let t=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),j(d.UF_SITE_THEME,t.id),v.contains(t.class)===!1&&(se.log(`SiteThemeToggle.update() - newSiteTheme: ${t.id}`),v.remove(this.themes.light.class,this.themes.dark.class),v.add(t.class)),this.value=this.currentTheme.text}},re=class extends J{constructor(t){super(t,!1),this.minWidth=`(max-width: ${me("--site-gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-layout-1-column"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-layout-2-column"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-layout-3-column"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=Ee(this.layouts,g.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(t){v.contains("user-layout")&&(t.matches?v.remove(this.currentLayout.class):v.add(this.currentLayout.class))}toggle(){this.currentLayout=ve(this.layouts,this.currentLayout),g.gallery.layout=this.currentLayout.id}update(t){j(d.UF_GALLERY_LAYOUT,this.currentLayout.id),v.contains("user-layout")&&v.contains(this.currentLayout.class)===!1&&(se.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),v.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),window.matchMedia(this.minWidth).matches===!1&&v.add(this.currentLayout.class)),this.value=this.currentLayout.text,t?.type==="click"&&this.element.scrollIntoView()}};function Te(e,t,n){let i=`<b>${e}</b>`;return n.forEach((r,s)=>{let a=pe(r.meta);i+=`
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
    </div>`}),i}function Se(e,t){let n=`<b>${e}</b><br>`;return t.forEach(i=>n+=`<a href="${C(i.link)}">${i.name}</a>, `),n.slice(0,n.length-2)}var $=E("termlist-rest"),p={termCache:{}};function Le(e,t,n){let i=f(e,"data-term-type"),r=parseInt(t.getAttribute("data-term-id")),s=f(t,"data-term-slug"),a=i==="channels";Ne(i,r,a?10:50,l=>{let o=a?"Latest Tracks":"All Tracks",h=n.querySelector(".body-left");l!==null?(h.innerHTML=Te(o,s,l),t.classList.add("data-fetched")):M("Unable to fetch track data, please try again...",10),!a&&l!==null&&Ke(l,r,50,(y,m)=>{o=y==="artists"?"Related Artists":"In Channels",h=y==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),m!==null?h.innerHTML=Se(o,m):h.innerHTML=`<b>${o}</b><br>None found`})})}function Ne(e,t,n,i){t in p.termCache?i(p.termCache[t].tracks):($.log(`fetchTracks() - termType: ${e} - termId: ${t} - maxItems: ${n}`),fetch(`/wp-json/wp/v2/tracks?${e}=${t}&per_page=${n}&_fields=id,link,artists,channels,meta`).then(r=>r.ok?r.json():($.error(r),null)).then(r=>{p.termCache[t]={tracks:r},i(r)}).catch(r=>{$.warn(r),i(null)}))}function Ke(e,t,n,i){if("channels"in p.termCache[t]&&"artists"in p.termCache[t])i("channels",p.termCache[t].channels),i("artists",p.termCache[t].artists);else{let r=[],s=[];e.forEach(a=>{r.push.apply(r,a.channels),s.push.apply(s,a.artists)}),s=s.filter(a=>a!==t),we("channels",t,[...new Set(r)],n,i),we("artists",t,[...new Set(s)],n,i)}}function we(e,t,n,i,r){n.length>0?($.log(`fetchMeta() - termType: ${e} - termIds: ${n.length>0?n:"Empty"} - maxItems: ${i}`),fetch(`/wp-json/wp/v2/${e}?include=${n}&per_page=${i}&_fields=link,name`).then(s=>s.ok?s.json():($.error(s),null)).then(s=>{p.termCache[t][e]=s,r(e,s)}).catch(s=>{$.warn(s),r(null)})):(p.termCache[t][e]=null,r(e,null))}function Ie(){p.termCache=JSON.parse(sessionStorage.getItem(d.UF_TERMLIST_CACHE)),p.termCache===null&&(p.termCache={})}function $e(){sessionStorage.setItem(d.UF_TERMLIST_CACHE,JSON.stringify(p.termCache))}function xe(){sessionStorage.removeItem(d.UF_TERMLIST_CACHE)}function Ae(){return Object.keys(p.termCache).length>0}var Ve=E("termlist-controls"),x={listContainer:null,uiElements:null};function Pe(){Ve.log("init()"),x.listContainer=document.getElementById("termlist-container"),x.uiElements=new ae,x.listContainer.addEventListener("click",e=>x.uiElements.clickHandler(e)),ze()}function Me(){if(Ae()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.classList.contains("open")&&e.openTermIds.push(t.id)}),sessionStorage.setItem(d.UF_TERMLIST_STATE,JSON.stringify(e)),$e()}}function ze(){if(Ie(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(d.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),window.scroll({top:e.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(d.UF_TERMLIST_STATE),xe()}var ae=class extends U{elementClicked(){if(this.clicked("div.play-button"))return z(this.event,C(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return Ge(this.event,C(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return We(this.element);if(this.clicked("div.termlist-header"))return Xe(this.event);if(this.clicked("div.thumbnail"))return je(this.event,this.element);if(this.clicked("a"))return Je(this.event,this.element)}};function z(e,t,n=null){e?.preventDefault(),Me(),sessionStorage.setItem(d.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:n,position:0})),b(t)}function Ge(e,t){P(d.UF_RESHUFFLE,"true"),z(e,t)}function We(e){let t=f(e,"data-term-name");O.show({title:`Share / Find ${f(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:C(e.getAttribute("data-term-url")),verb:"Find"})}function je(e,t){let n=x.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=f(t,"data-term-slug"),r=parseInt(t.getAttribute("data-track-type")),s=t.getAttribute("data-track-source-uid");if(g.playback.preferredPlayer===le.GALLERY||r===ue.SOUNDCLOUD)z(e,t.getAttribute("data-term-url"),null);else{let a=parseInt(t.getAttribute("data-track-num")),l="";a>L.listPerPage&&(l=`page/${Math.ceil(a/L.listPerPage)}/`),z(e,`${he}/list/${n}/${i}/${l}`,s)}}function Je(e,t){Me(),t.closest("div.permalink")!==null&&(e?.preventDefault(),b(C(t.href)))}function Xe(e){let t=e.target.closest("div.termlist-entry"),n=t.querySelector("div.expand-toggle span"),i=t.querySelector("div.termlist-body"),r=i.style.display.length!==0,s=t.classList.contains("data-fetched");_(t,r?"open":"closed",r?"closed":"open"),n.textContent=r?"expand_more":"expand_less",i.style.display=r?"":"flex",!r&&!s&&Le(x.listContainer,t,i)}var Ze=()=>{let e=new ResizeObserver(o),t=null,n=null,i=null,r=!1;return window.addEventListener("load",()=>{q("#menu-primary-menu .menu-item-reshuffle a","click",de),document.getElementById("menu-primary-menu")?.addEventListener("click",a)}),{isVisible(){return r},scrolledTop(){n.style.display=""},init:s,toggle:l};function s(){t=document.getElementById("site-header"),n=document.querySelector("#site-navigation .nav-menu-outer"),i=document.getElementById("nav-menu-modal-overlay"),w(".nav-menu-toggle","click",l),i.addEventListener("click",l),i.addEventListener("transitionend",h),e.observe(n.querySelector(".menu-primary-menu-container"))}function a(y){let m=y.target.closest("li.menu-item.menu-item-object-uf_channel");m!==null&&(document.body.matches(".single.track")||I())&&(y?.preventDefault(),b(C(m.querySelector("a").href)))}function l(){t.classList.contains("sticky-nav-up")?r?n.style.display="none":n.style.display="flex":t.classList.contains("sticky-nav-down")===!1&&t.classList.toggle("hide-nav-menu")}function o(y){r=y[0].contentRect.height!==0,r?(i.className="",i.classList.add("show"),setTimeout(()=>i.classList.add("fadein"),50)):i.classList.add("fadeout")}function h(){r===!1&&(i.className="",n.style.display="")}},S=Ze();var et=()=>{let e=new Event("allowKeyboardShortcuts"),t=new Event("denyKeyboardShortcuts"),n=null,i=null,r=null,s=null,a=!1;return{isVisible(){return a},init:l,toggle:o,hide:h};function l(){n=document.getElementById("site-header"),i=document.getElementById("search-container"),r=i.querySelector(".search-field"),s=n.querySelector("div.site-branding-container"),w(".nav-search-toggle","click",o),w(".nav-search-toggle","mousedown",u=>u.preventDefault()),r.addEventListener("blur",h),r.addEventListener("keydown",u=>{u.key==="Escape"&&(u.stopPropagation(),h())})}function o(){y()?m():h()}function h(){a&&T(!1,e,"","search")}function y(){return i.style.display.length===0?!(n.offsetHeight===0||Z(Q.SITE_MAX_WIDTH_MOBILE)&&n.querySelector(".navbar-container-mobile-top").offsetHeight===0&&n.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function m(){Re(),T(!0,t,"flex","clear"),r.focus(),r.setSelectionRange(9999,9999)}function T(u,k,He,qe){a=u,document.dispatchEvent(k),i.style.display=He,document.querySelectorAll("div.nav-search-toggle span").forEach(Be=>Be.textContent=qe),a?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function Re(){let u={};if(Z(Q.SITE_MAX_WIDTH_MOBILE))s.offsetHeight!==0?u.top=s.offsetTop:u.top=n.querySelector(".navbar-container-mobile-up").offsetTop,u=new DOMRect(63,u.top+3,document.body.clientWidth-60,30);else if(s.offsetHeight!==0){let k=s.getBoundingClientRect();u=new DOMRect(k.left,k.top+7,k.right,k.height-15)}else{let k=n.querySelector(".navbar-container").getBoundingClientRect();u=new DOMRect(k.left+88,k.top,k.right-90,k.height-1)}i.style.left=`${u.left}px`,i.style.top=`${u.top}px`,i.style.width=`${u.width-u.left}px`,i.style.height=`${u.height}px`}},R=et();var _e=E("index"),c={siteHeader:null,introBanner:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{_e.log("DOMContentLoaded"),tt(),c.introBanner!==null&&rt(),document.getElementById("termlist-container")!==null&&Pe(),c.siteContentSearch!==null&&(c.siteContentSearch.focus(),c.siteContentSearch.setSelectionRange(9999,9999)),st()});function tt(){_e.log("initIndex()"),c.siteHeader=document.getElementById("site-header"),c.introBanner=document.getElementById("intro-banner"),c.siteContent=document.getElementById("site-content"),c.siteContentSearch=document.querySelector("#site-content form input.search-field"),ye(),R.init(),S.init(),A.addEventListener(),at.addEventListener(),document.addEventListener("fullscreenElement",e=>c.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",nt)}document.addEventListener("settingsUpdated",()=>{ce(),ke(),P(d.UF_GALLERY_PER_PAGE,g.gallery.tracksPerPage,W*5),P(d.UF_PREFERRED_PLAYER,g.playback.preferredPlayer,W*5)});function nt(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":S.isVisible()&&(e.preventDefault(),S.toggle());return}if(g.site.keyboardShortcuts&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"c":case"C":G()&&(e.preventDefault(),S.toggle());break;case"L":G()&&Ue()&&(V.toggle(e),A.trigger());break;case"s":case"S":G()&&it()&&(e.preventDefault(),R.toggle());break;case"T":G()&&Ue()&&Y.toggle(e);break;case"ArrowLeft":e.shiftKey&&I()&&(e.preventDefault(),b(L.prevPage));break;case"ArrowRight":e.shiftKey&&I()&&(e.preventDefault(),b(L.nextPage));break}}function G(){return R.isVisible()===!1&&c.siteContentSearch!==document.activeElement}function Ue(){return document.body.classList.contains("page-settings")===!1}function it(){return c.fullscreenTarget===null}function rt(){oe("localStorage")&&bannerProperty&&g.banners[bannerProperty]&&(c.introBanner.style.display="block",A.trigger(),q("#intro-banner .intro-banner-close-button","click",()=>{c.introBanner.style.display="",c.siteContent.style.marginTop="",g.banners[bannerProperty]=!1}))}function st(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let n=t.pathname.slice(-1)==="/"?1:0,i=t.pathname.slice(1,t.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((r,s)=>{e+=s+1<i.length?r+" / ":r})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var A=(()=>{let e=0;return{getHeaderHeight(){return e},addEventListener:t,trigger:n};function t(){n(),window.addEventListener("resize",n)}function n(){I()?e=B("--site-header-height-no-playback"):e=B("--site-header-height"),c.introBanner!==null&&c.introBanner.style.display.length!==0&&(c.introBanner.style.marginTop=`${e}px`,c.siteContent.style.marginTop=`${B("--site-content-margin-top",document.body)}px`)}})(),at=(()=>{let e=0,t=!1;return{addEventListener:n};function n(){i(),window.addEventListener("scroll",i)}function i(){let l=window.pageYOffset,o=Math.round(A.getHeaderHeight()>150?A.getHeaderHeight()/2:A.getHeaderHeight()/3);l===0||Math.round(l)<=1?r():l>o&&l>e?s():a(),R.hide(),e=l}function r(){c.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),c.siteHeader.classList.add("hide-nav-menu"),S.scrolledTop()}function s(){t===!1&&(t=!0,_(c.siteHeader,"sticky-nav-up","sticky-nav-down"))}function a(){t===!0&&(t=!1,_(c.siteHeader,"sticky-nav-down","sticky-nav-up")),S.isVisible()&&S.toggle()}})();
//# sourceMappingURL=index.js.map
