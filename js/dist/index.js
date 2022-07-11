import{A as w,B as he,C as B,D as Q,E as _,F as me,Fa as $,G as y,H as C,I as k,Ia as ye,J as fe,K as pe,L as Z,M as U,N as ee,O as D,P as ge,b as T,d as oe,f as h,g as W,h as ce,i as P,j as J,k as L,l as g,n as ue,o as M,s as de,x as H,y as X,z as q}from"./chunk-GAN3HQRC.js";var ke=T("share-modal"),Ne=()=>{let e=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,t,n,i,r,s,a,l;return{show:o};function o(p){return{title:t="Share / Play Track",bodyText:n=null,filterBodyText:i=!1,bodyHtml:r=null,url:s=null,sourceUid:a=null,verb:l="Play"}=p,D(t,m(),"share",f)}function m(){let p=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"amazonMusicId",icon:"link",content:`<b>${l}</b> on Amazon Music`},{clickId:"appleMusicId",icon:"link",content:`<b>${l}</b> on Apple Music`},{clickId:"spotifyId",icon:"link",content:`<b>${l}</b> on Spotify`},{clickId:"tidalId",icon:"link",content:`<b>${l}</b> on Tidal`},{clickId:"youTubeMusicId",icon:"link",content:`<b>${l}</b> on YouTube Music`}];return r!==null&&p.unshift({class:"track-share-entry",content:r}),p}function f(p){ke.log(`singleChoiceListClick(): ${p} - title: "${t}" - bodyText: "${n}" - filterBodyText: ${i} - url: ${s} - sourceUid: ${a} - verb: ${l}`);let v=encodeURIComponent(i?n.replace(e," "):n);switch(p){case"copyToClipboardId":te(s,"Track link copied to clipboard","Unable to copy Track link to clipboard");break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(n)}&body=${encodeURI(s)}%0d%0a`;break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${v}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${v}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${v}`,"_blank");break;case"tidalId":window.open(`https://google.com/search?q=${v}%20site:tidal.com`,"_blank");break;case"youTubeMusicId":a!==null?window.open(`https://music.youtube.com/watch?v=${a}`,"_blank"):window.open(`https://music.youtube.com/search?q=${v}`,"_blank");break}}},F=Ne();function te(e,t="Text copied to clipboard",n="Unable to copy text to clipboard"){navigator.clipboard.writeText(e).then(()=>{M(t,3)},i=>{ke.error(`copyTextToClipboard() failed because ${i}`),M(n,5)})}var ae=T("site-interaction"),E=document.documentElement.classList,N={metaUiElements:null,listUiElements:null},V={},z={};function be(){ae.log("init()"),N.metaUiElements=new ne,N.listUiElements=new ie,V=new re("footer-site-theme-toggle"),z=new se("footer-gallery-layout-toggle"),w(".entry-meta","click",e=>N.metaUiElements.clickHandler(e)),document.getElementById("tracklist")?.addEventListener("click",e=>N.listUiElements.clickHandler(e)),window.addEventListener("load",()=>{document.querySelector(".widget ul.uf_channel")?.addEventListener("click",K),document.querySelector(".widget ul.uf_artist")?.addEventListener("click",K),document.querySelector(".widget.widget_archive ul")?.addEventListener("click",K)})}function Ce(){V.setCurrent(),z.setCurrent()}var ne=class extends U{elementClicked(){if(this.clicked("div.track-share-control"))return Te(this.closest("single-track"));if(this.clicked("span.term-links"))return K(this.event)}},ie=class extends U{elementClicked(){if(this.clicked("div.share-play-button"))return Te(this.closest("div.track-entry"));if(this.clicked("div.details-button"))return Ke(this.closest("div.track-entry"))}};function K(e){e.target.matches("a")&&(e?.preventDefault(),C(k(e.target.href)))}function Te(e){let t=y(e,"data-track-artist"),n=y(e,"data-track-title"),i=F.show({bodyText:`${t} - ${n}`,filterBodyText:!0,bodyHtml:ee(e,t,n),url:y(e,"data-track-url"),sourceUid:y(e,"data-track-source-uid")});Ee(i,`${t} - ${n}`)}function Ke(e){let t=y(e,"data-track-artist"),n=y(e,"data-track-title"),i=parseInt(e.getAttribute("data-track-duration")),r=e.querySelector(".track-artists-links").querySelectorAll("a"),s=e.querySelector(".track-channels-links").querySelectorAll("a"),a=[];a.push({class:"track-details-entry",content:ee(e,t,n)}),a.push({class:"header-entry",content:"Artists"}),r.forEach(o=>{a.push({clickId:`entry-${a.length}`,class:`icon-text ${o.classList[0]}`,title:"Go to Artist",content:o.innerText,link:o.href,icon:"link"})}),a.push({class:"header-entry",content:"Channels"}),s.forEach(o=>{a.push({clickId:`entry-${a.length}`,title:"Go to Channel",content:o.innerText,link:o.href,icon:"link"})});let l=D(`Track Details<span class="light-text lowercase-text">${i>0?me(i):"N / A"}</span>`,a,"track-details",o=>{C(a.find(m=>m.clickId===o).link)});Ee(l,`${t} - ${n}`)}function Ee(e,t){document.getElementById(e).querySelector(".modal-track").title="Click / tap to Copy Artist & Title",document.getElementById(e)?.querySelector("img")?.addEventListener("click",()=>{te(t,"Artist &amp Title copied to clipboard","Unable to copy Artist &amp Title to clipboard")})}function ve(e,t,n){let i=Object.values(e).find(r=>r.id===t);return i!==void 0?i:n}function Se(e,t){let n=Object.values(e).findIndex(r=>r.id===t.id),i=Object.keys(e);return n+1<i.length?e[i[n+1]]:e[i[0]]}var re=class extends Z{constructor(t){super(t,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=ve(this.themes,g.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=Se(this.themes,this.currentTheme),g.site.theme=this.currentTheme.id}update(){let t=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),J(h.UF_SITE_THEME,t.id),E.contains(t.class)===!1&&(ae.log(`SiteThemeToggle.update() - newSiteTheme: ${t.id}`),E.remove(this.themes.light.class,this.themes.dark.class),E.add(t.class)),this.value=this.currentTheme.text}},se=class extends Z{constructor(t){super(t,!1),this.minWidth=`(max-width: ${he("--site-gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-layout-1-column"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-layout-2-column"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-layout-3-column"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=ve(this.layouts,g.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(t){E.contains("user-layout")&&(t.matches?E.remove(this.currentLayout.class):E.add(this.currentLayout.class))}toggle(){this.currentLayout=Se(this.layouts,this.currentLayout),g.gallery.layout=this.currentLayout.id}update(t){J(h.UF_GALLERY_LAYOUT,this.currentLayout.id),E.contains("user-layout")&&E.contains(this.currentLayout.class)===!1&&(ae.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),E.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),window.matchMedia(this.minWidth).matches===!1&&E.add(this.currentLayout.class)),this.value=this.currentLayout.text,t?.type==="click"&&this.element.scrollIntoView()}};function we(e,t,n){let i=`<b>${e}</b>`;return n.forEach((r,s)=>{let a=fe(r.meta);i+=`
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
    </div>`}),i}function Le(e,t){let n=`<b>${e}</b><br>`;return t.forEach(i=>n+=`<a href="${k(i.link)}">${i.name}</a>, `),n.slice(0,n.length-2)}function $e(e,t,n){let i=`<b>${e}</b><br>`;return t.forEach(r=>{i+=`<a href="${k(`${H}/artist/${r.artist_slug}/?channel=${n}`)}">${r.artist_name}</a> (${r.track_count})<br>`}),i}var I=T("termlist-rest"),d={termCache:{}};function xe(e,t,n){let i=y(e,"data-term-type"),r=parseInt(t.getAttribute("data-term-id")),s=y(t,"data-term-slug"),a=i==="channels";Ve(i,r,a?10:50,async l=>{let o=a?"Latest Tracks":"All Tracks",m=n.querySelector(".body-left");if(l!==null?(m.innerHTML=we(o,s,l),t.classList.add("data-fetched")):M("Unable to fetch track data, please try again...",10),!a&&l!==null)ze(l,r,50,(f,p)=>{o=f==="artists"?"Related Artists":"In Channels",m=f==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),p!==null?m.innerHTML=Le(o,p):m.innerHTML=`<b>${o}</b><br>None found`});else if(l!==null){if(!("topArtists"in d.termCache[r])){let f=await pe("top-artists",`channelId=${r}`,!0,"/wp-json/ultrafunk/v1/");f!==null&&f.status.code===200&&(d.termCache[r].topArtists=f.data)}n.querySelector(".top-artists").innerHTML=$e("Top Artists (tracks)",d.termCache[r].topArtists,s)}})}function Ve(e,t,n,i){t in d.termCache?i(d.termCache[t].tracks):(I.log(`fetchTracks() - termType: ${e} - termId: ${t} - maxItems: ${n}`),fetch(`/wp-json/wp/v2/tracks?${e}=${t}&per_page=${n}&_fields=id,link,artists,channels,meta`).then(r=>r.ok?r.json():(I.error(r),null)).then(r=>{d.termCache[t]={tracks:r},i(r)}).catch(r=>{I.warn(r),i(null)}))}function ze(e,t,n,i){if("channels"in d.termCache[t]&&"artists"in d.termCache[t])i("channels",d.termCache[t].channels),i("artists",d.termCache[t].artists);else{let r=[],s=[];e.forEach(a=>{r.push.apply(r,a.channels),s.push.apply(s,a.artists)}),s=s.filter(a=>a!==t),Ie("channels",t,[...new Set(r)],n,i),Ie("artists",t,[...new Set(s)],n,i)}}function Ie(e,t,n,i,r){n.length>0?(I.log(`fetchMeta() - termType: ${e} - termIds: ${n.length>0?n:"Empty"} - maxItems: ${i}`),fetch(`/wp-json/wp/v2/${e}?include=${n}&per_page=${i}&_fields=link,name`).then(s=>s.ok?s.json():(I.error(s),null)).then(s=>{d.termCache[t][e]=s,r(e,s)}).catch(s=>{I.warn(s),r(null)})):(d.termCache[t][e]=null,r(e,null))}function Ae(){d.termCache=JSON.parse(sessionStorage.getItem(h.UF_TERMLIST_CACHE)),d.termCache===null&&(d.termCache={})}function Pe(){sessionStorage.setItem(h.UF_TERMLIST_CACHE,JSON.stringify(d.termCache))}function Me(){sessionStorage.removeItem(h.UF_TERMLIST_CACHE)}function _e(){return Object.keys(d.termCache).length>0}var Ge=T("termlist-controls"),x={listContainer:null,uiElements:null};function Ue(){Ge.log("init()"),x.listContainer=document.getElementById("termlist-container"),x.uiElements=new le,x.listContainer.addEventListener("click",e=>x.uiElements.clickHandler(e)),We()}function Re(){if(_e()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.classList.contains("open")&&e.openTermIds.push(t.id)}),sessionStorage.setItem(h.UF_TERMLIST_STATE,JSON.stringify(e)),Pe()}}function We(){if(Ae(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(h.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),window.scroll({top:e.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(h.UF_TERMLIST_STATE),Me()}var le=class extends U{elementClicked(){if(this.clicked("div.play-button"))return j(this.event,k(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return Je(this.event,k(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return Xe(this.element);if(this.clicked("div.termlist-header"))return et(this.event);if(this.clicked("div.thumbnail"))return Qe(this.event,this.element);if(this.clicked("a"))return Ze(this.event,this.element)}};function j(e,t,n=null){e?.preventDefault(),Re(),sessionStorage.setItem(h.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:n,position:0})),C(t)}function Je(e,t){P(h.UF_RESHUFFLE,"true"),j(e,t)}function Xe(e){let t=y(e,"data-term-name");F.show({title:`Share / Find ${y(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:k(e.getAttribute("data-term-url")),verb:"Find"})}function Qe(e,t){let n=x.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=y(t,"data-term-slug"),r=parseInt(t.getAttribute("data-track-type")),s=t.getAttribute("data-track-source-uid");if(g.playback.preferredPlayer===oe.GALLERY||r===de.SOUNDCLOUD)j(e,t.getAttribute("data-term-url"),null);else{let a=parseInt(t.getAttribute("data-track-num")),l="";a>L.listPerPage&&(l=`page/${Math.ceil(a/L.listPerPage)}/`),j(e,`${H}/list/${n}/${i}/${l}`,s)}}function Ze(e,t){Re(),t.closest("div.permalink")!==null&&(e?.preventDefault(),C(k(t.href)))}function et(e){let t=e.target.closest("div.termlist-entry"),n=t.querySelector("div.expand-toggle span"),i=t.querySelector("div.termlist-body"),r=i.style.display.length!==0,s=t.classList.contains("data-fetched");_(t,r?"open":"closed",r?"closed":"open"),n.textContent=r?"expand_more":"expand_less",i.style.display=r?"":"flex",!r&&!s&&xe(x.listContainer,t,i)}var nt=()=>{let e=new ResizeObserver(o),t=null,n=null,i=null,r=!1;return window.addEventListener("load",()=>{q("#menu-primary-menu .menu-item-reshuffle a","click",ye),document.getElementById("menu-primary-menu")?.addEventListener("click",a)}),{isVisible(){return r},scrolledTop(){n.style.display=""},init:s,toggle:l};function s(){t=document.getElementById("site-header"),n=document.querySelector("#site-navigation .nav-menu-outer"),i=document.getElementById("nav-menu-modal-overlay"),w(".nav-menu-toggle","click",l),i.addEventListener("click",l),i.addEventListener("transitionend",m),e.observe(n.querySelector(".menu-primary-menu-container"))}function a(f){let p=f.target.closest("li.menu-item.menu-item-object-uf_channel");p!==null&&(ge()||$())&&(f?.preventDefault(),C(k(p.querySelector("a").href)))}function l(){t.classList.contains("sticky-nav-up")?r?n.style.display="none":n.style.display="flex":t.classList.contains("sticky-nav-down")===!1&&t.classList.toggle("hide-nav-menu")}function o(f){r=f[0].contentRect.height!==0,r?(i.className="",i.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(g.site.modalOverlayOpacity/100))/10})`,i.classList.add("show"),setTimeout(()=>i.classList.add("fadein"),50)):i.classList.add("fadeout")}function m(){r===!1&&(i.className="",n.style.display="")}},S=nt();var it=()=>{let e=new Event("allowKeyboardShortcuts"),t=new Event("denyKeyboardShortcuts"),n=null,i=null,r=null,s=null,a=!1;return{isVisible(){return a},init:l,toggle:o,hide:m};function l(){n=document.getElementById("site-header"),i=document.getElementById("search-container"),r=i.querySelector(".search-field"),s=n.querySelector("div.site-branding-container"),w(".nav-search-toggle","click",o),w(".nav-search-toggle","mousedown",u=>u.preventDefault()),r.addEventListener("blur",m),r.addEventListener("keydown",u=>{u.key==="Escape"&&(u.stopPropagation(),m())})}function o(){f()?p():m()}function m(){a&&v(!1,e,"","search")}function f(){return i.style.display.length===0?!(n.offsetHeight===0||Q(X.SITE_MAX_WIDTH_MOBILE)&&n.querySelector(".navbar-container-mobile-top").offsetHeight===0&&n.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function p(){Be(),v(!0,t,"flex","clear"),r.focus(),r.setSelectionRange(9999,9999)}function v(u,b,De,Oe){a=u,document.dispatchEvent(b),i.style.display=De,document.querySelectorAll("div.nav-search-toggle span").forEach(Fe=>Fe.textContent=Oe),a?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function Be(){let u={};if(Q(X.SITE_MAX_WIDTH_MOBILE))s.offsetHeight!==0?u.top=s.offsetTop:u.top=n.querySelector(".navbar-container-mobile-up").offsetTop,u=new DOMRect(63,u.top+3,document.body.clientWidth-60,30);else if(s.offsetHeight!==0){let b=s.getBoundingClientRect();u=new DOMRect(b.left,b.top+7,b.right,b.height-15)}else{let b=n.querySelector(".navbar-container").getBoundingClientRect();u=new DOMRect(b.left+88,b.top,b.right-90,b.height-1)}i.style.left=`${u.left}px`,i.style.top=`${u.top}px`,i.style.width=`${u.width-u.left}px`,i.style.height=`${u.height}px`}},R=it();var qe=T("index"),c={siteHeader:null,introBanner:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{qe.log("DOMContentLoaded"),rt(),c.introBanner!==null&&lt(),document.getElementById("termlist-container")!==null&&Ue(),c.siteContentSearch!==null&&(c.siteContentSearch.focus(),c.siteContentSearch.setSelectionRange(9999,9999)),ot()});function rt(){qe.log("initIndex()"),c.siteHeader=document.getElementById("site-header"),c.introBanner=document.getElementById("intro-banner"),c.siteContent=document.getElementById("site-content"),c.siteContentSearch=document.querySelector("#site-content form input.search-field"),be(),R.init(),S.init(),A.addEventListener(),ct.addEventListener(),document.addEventListener("fullscreenElement",e=>c.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",st)}document.addEventListener("settingsUpdated",()=>{ue(),Ce(),P(h.UF_GALLERY_PER_PAGE,g.gallery.tracksPerPage,W*5),P(h.UF_PREFERRED_PLAYER,g.playback.preferredPlayer,W*5)});function st(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":S.isVisible()&&(e.preventDefault(),S.toggle());return}if(g.site.keyboardShortcuts&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"c":case"C":G()&&(e.preventDefault(),S.toggle());break;case"L":G()&&He()&&(z.toggle(e),A.trigger());break;case"s":case"S":G()&&at()&&(e.preventDefault(),R.toggle());break;case"T":G()&&He()&&V.toggle(e);break;case"ArrowLeft":e.shiftKey&&$()&&(e.preventDefault(),C(L.prevPage));break;case"ArrowRight":e.shiftKey&&$()&&(e.preventDefault(),C(L.nextPage));break}}function G(){return R.isVisible()===!1&&c.siteContentSearch!==document.activeElement}function He(){return document.body.classList.contains("page-settings")===!1}function at(){return c.fullscreenTarget===null}function lt(){ce("localStorage")&&bannerProperty&&g.banners[bannerProperty]&&(c.introBanner.style.display="block",A.trigger(),q("#intro-banner .intro-banner-close-button","click",()=>{c.introBanner.style.display="",c.siteContent.style.marginTop="",g.banners[bannerProperty]=!1}))}function ot(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let n=t.pathname.slice(-1)==="/"?1:0,i=t.pathname.slice(1,t.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((r,s)=>{e+=s+1<i.length?r+" / ":r})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var A=(()=>{let e=0;return{getHeaderHeight(){return e},addEventListener:t,trigger:n};function t(){n(),window.addEventListener("resize",n)}function n(){$()?e=B("--site-header-height-no-playback"):e=B("--site-header-height"),c.introBanner!==null&&c.introBanner.style.display.length!==0&&(c.introBanner.style.marginTop=`${e}px`,c.siteContent.style.marginTop=`${B("--site-content-margin-top",document.body)}px`)}})(),ct=(()=>{let e=0,t=!1;return{addEventListener:n};function n(){i(),window.addEventListener("scroll",i)}function i(){let l=window.pageYOffset,o=Math.round(A.getHeaderHeight()>150?A.getHeaderHeight()/2:A.getHeaderHeight()/3);l===0||Math.round(l)<=1?r():l>o&&l>e?s():a(),R.hide(),e=l}function r(){c.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),c.siteHeader.classList.add("hide-nav-menu"),S.scrolledTop()}function s(){t===!1&&(t=!0,_(c.siteHeader,"sticky-nav-up","sticky-nav-down"))}function a(){t===!0&&(t=!1,_(c.siteHeader,"sticky-nav-down","sticky-nav-up")),S.isVisible()&&S.toggle()}})();
//# sourceMappingURL=index.js.map
