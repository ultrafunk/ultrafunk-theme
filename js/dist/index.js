import{Aa as m,Ba as k,Ca as T,Da as ae,aa as z,b as C,ba as R,ca as ne,d as Z,f as u,fa as I,g as Y,h as ee,i as x,ia as ie,j as V,k as $,l as p,n as te,o as j,p as M,sa as re,ta as G,ua as H,va as w,wa as se,xa as B,ya as W,za as _}from"./chunk-4YI64GFX.js";var oe=C("share-modal"),D=(()=>{let e=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,t,n,i,r,s,o,a;return{show:d};function d(h){return{title:t="Share / Play Track",bodyText:n=null,filterBodyText:i=!1,bodyHtml:r=null,url:s=null,sourceUid:o=null,verb:a="Play"}=h,R("share",t,g(),y)}function g(){let h=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"amazonMusicId",icon:"link",content:`<b>${a}</b> on Amazon Music`},{clickId:"appleMusicId",icon:"link",content:`<b>${a}</b> on Apple Music`},{clickId:"spotifyId",icon:"link",content:`<b>${a}</b> on Spotify`},{clickId:"tidalId",icon:"link",content:`<b>${a}</b> on Tidal`},{clickId:"youTubeMusicId",icon:"link",content:`<b>${a}</b> on YouTube Music`}];return r!==null&&h.unshift({class:"track-share-entry",content:r}),h}function y(h){oe.log(`singleChoiceListClick(): ${h} - title: "${t}" - bodyText: "${n}" - filterBodyText: ${i} - url: ${s} - sourceUid: ${o} - verb: ${a}`);let S=encodeURIComponent(i?n.replace(e," "):n);switch(h){case"copyToClipboardId":J(s,"Track link copied to clipboard","Unable to copy Track link to clipboard");break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(n)}&body=${s}%0d%0a`;break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${S}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${S}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${S}`,"_blank");break;case"tidalId":window.open(`https://google.com/search?q=${S}%20site:tidal.com`,"_blank");break;case"youTubeMusicId":o!==null?window.open(`https://music.youtube.com/watch?v=${o}`,"_blank"):window.open(`https://music.youtube.com/search?q=${S}`,"_blank");break}}})();function J(e,t="Text copied to clipboard",n="Unable to copy text to clipboard"){navigator.clipboard.writeText(e).then(()=>{M(t,3)},i=>{oe.error(`copyTextToClipboard() failed because ${i}`),M(n,5)})}var Q=C("site-interaction"),E=document.documentElement.classList,v={siteTheme:null,galleryLayout:null};function le(){Q.log("init()"),v.siteTheme=new fe("footer-site-theme-toggle"),v.galleryLayout=new ge("footer-gallery-layout-toggle"),w(".entry-meta-controls .track-share-control","click",e=>ue(e.target)),document.getElementById("tracklist")?.addEventListener("click",Me),window.addEventListener("load",()=>{document.querySelector(".widget ul.uf_channel")?.addEventListener("click",X),document.querySelector(".widget ul.uf_artist")?.addEventListener("click",X),document.querySelector(".widget.widget_archive ul")?.addEventListener("click",X)})}function ce(){v.siteTheme.setCurrent(),v.galleryLayout.setCurrent()}function Me(e){let t=e.target.closest("div.share-play-button");if(t!==null)return ue(t.closest("div.track-entry"));let n=e.target.closest("div.details-button");if(n!==null)return _e(n.closest("div.track-entry"))}function X(e){e.target.matches("a")&&(e?.preventDefault(),k(T(e.target.href)))}function ue(e){let t=m(e,"data-track-artist"),n=m(e,"data-track-title"),i=D.show({bodyText:`${t} - ${n}`,filterBodyText:!0,bodyHtml:z(e,t,n),url:m(e,"data-track-url"),sourceUid:m(e,"data-track-source-uid")});de(i,`${t} - ${n}`)}function _e(e){let t=m(e,"data-track-artist"),n=m(e,"data-track-title"),i=e.querySelector(".track-artists-links").querySelectorAll("a"),r=e.querySelector(".track-channels-links").querySelectorAll("a"),s=[];s.push({class:"track-details-entry",content:z(e,t,n)}),s.push({class:"header-entry",content:"Artists"}),i.forEach(a=>{s.push({clickId:`entry-${s.length}`,class:`icon-text ${a.classList[0]}`,title:"Go to Artist",content:a.innerText,link:a.href,icon:"link"})}),s.push({class:"header-entry",content:"Channels"}),r.forEach(a=>{s.push({clickId:`entry-${s.length}`,title:"Go to Channel",content:a.innerText,link:a.href,icon:"link"})});let o=R("track-details","Track Details",s,a=>{k(s.find(d=>d.clickId===a).link)});de(o,`${t} - ${n}`)}function de(e,t){document.getElementById(e).querySelector(".modal-track").title="Click thumbnail to Copy Artist & Title",document.getElementById(e)?.querySelector("img")?.addEventListener("click",()=>{J(t,"Artist &amp Title copied to clipboard","Unable to copy Artist &amp Title to clipboard")})}function he(e,t,n){let i=Object.values(e).find(r=>r.id===t);return i!==void 0?i:n}function me(e,t){let n=Object.values(e).findIndex(r=>r.id===t.id),i=Object.keys(e);return n+1<i.length?e[i[n+1]]:e[i[0]]}var fe=class extends j{constructor(t){super(t,!1);this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=he(this.themes,p.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=me(this.themes,this.currentTheme),p.site.theme=this.currentTheme.id}update(){let t=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),V(u.UF_SITE_THEME,t.id),E.contains(t.class)===!1&&(Q.log(`SiteThemeToggle.update() - newSiteTheme: ${t.id}`),E.remove(this.themes.light.class,this.themes.dark.class),E.add(t.class)),this.value=this.currentTheme.text}},ge=class extends j{constructor(t){super(t,!1);this.minWidth=`(max-width: ${se("--site-gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-layout-1-column"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-layout-2-column"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-layout-3-column"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=he(this.layouts,p.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(t){E.contains("user-layout")&&(t.matches?E.remove(this.currentLayout.class):E.add(this.currentLayout.class))}toggle(){this.currentLayout=me(this.layouts,this.currentLayout),p.gallery.layout=this.currentLayout.id}update(t){V(u.UF_GALLERY_LAYOUT,this.currentLayout.id),E.contains("user-layout")&&E.contains(this.currentLayout.class)===!1&&(Q.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),E.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),window.matchMedia(this.minWidth).matches===!1&&E.add(this.currentLayout.class)),this.value=this.currentLayout.text,t?.type==="click"&&this.element.scrollIntoView()}};function pe(e,t,n,i){let r=`<b>${e}</b>`;n.forEach((s,o)=>{let a=ae(s.meta);r+=`
    <div class="track">
      <div class="thumbnail ${a.class}"
        data-term-url="${s.link}"
        data-term-slug="${t}"
        data-track-num="${o+1}"
        data-track-type="${s.meta.track_source_type}"
        data-track-id="track-${s.id}"
        data-track-source-uid="${a.uid}" title="Play Track"
        >
        <img src="${a.src}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${s.link}" title="Go to track"><span><b>${s.meta.track_artist}</b></span><br><span>${s.meta.track_title}</span></a>
      </div>
    </div>`}),i.innerHTML=r}function ye(e,t,n){let i=`<b>${e}</b><br>`;t.forEach(r=>i+=`<a href="${T(r.link)}">${r.name}</a>, `),n.innerHTML=i.slice(0,i.length-2)}var P=C("termlist-rest"),f={termCache:{}};function ke(e,t,n){let i=m(e,"data-term-type"),r=parseInt(t.getAttribute("data-term-id")),s=m(t,"data-term-slug"),o=i==="channels";Re(i,r,o?10:50,a=>{let d=o?"Latest Tracks":"All Tracks",g=n.querySelector(".body-left");a!==null?(pe(d,s,a,g),t.classList.add("data-fetched")):M("Unable to fetch track data, please try again...",10),!o&&a!==null&&He(a,r,50,(y,h)=>{d=y==="artists"?"Related Artists":"In Channels",g=y==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),h!==null?ye(d,h,g):g.innerHTML=`<b>${d}</b><br>None found`})})}function Re(e,t,n,i){t in f.termCache?i(f.termCache[t].tracks):(P.log(`fetchTracks() - termType: ${e} - termId: ${t} - maxItems: ${n}`),fetch(`/wp-json/wp/v2/tracks?${e}=${t}&per_page=${n}&_fields=id,link,artists,channels,meta`).then(r=>r.ok?r.json():(P.error(r),null)).then(r=>{f.termCache[t]={tracks:r},i(r)}).catch(r=>{P.warn(r),i(null)}))}function He(e,t,n,i){if("channels"in f.termCache[t]&&"artists"in f.termCache[t])i("channels",f.termCache[t].channels),i("artists",f.termCache[t].artists);else{let r=[],s=[];e.forEach(o=>{r.push.apply(r,o.channels),s.push.apply(s,o.artists)}),s=s.filter(o=>o!==t),be("channels",t,[...new Set(r)],n,i),be("artists",t,[...new Set(s)],n,i)}}function be(e,t,n,i,r){n.length>0?(P.log(`fetchMeta() - termType: ${e} - termIds: ${n.length>0?n:"Empty"} - maxItems: ${i}`),fetch(`/wp-json/wp/v2/${e}?include=${n}&per_page=${i}&_fields=link,name`).then(s=>s.ok?s.json():(P.error(s),null)).then(s=>{f.termCache[t][e]=s,r(e,s)}).catch(s=>{P.warn(s),r(null)})):(f.termCache[t][e]=null,r(e,null))}function Te(){f.termCache=JSON.parse(sessionStorage.getItem(u.UF_TERMLIST_CACHE)),f.termCache===null&&(f.termCache={})}function Ce(){sessionStorage.setItem(u.UF_TERMLIST_CACHE,JSON.stringify(f.termCache))}function Ee(){sessionStorage.removeItem(u.UF_TERMLIST_CACHE)}function Se(){return Object.keys(f.termCache).length>0}var qe=C("termlist-controls"),F={listContainer:null};function Le(){qe.log("init()"),F.listContainer=document.getElementById("termlist-container"),F.listContainer.addEventListener("click",e=>{let t=e.target.closest("div.play-button");if(t!==null)return K(e,T(t.querySelector("a").href));let n=e.target.closest("div.shuffle-button");if(n!==null)return Oe(e,T(n.querySelector("a").href));let i=e.target.closest("div.share-find-button");if(i!==null)return Fe(i);if(e.target.closest("div.termlist-header")!==null)return Ye(e);let s=e.target.closest("div.thumbnail");if(s!==null)return Ke(e,s);let o=e.target.closest("a");if(o!==null)return Ne(e,o)}),De()}function we(){if(Se()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.classList.contains("open")&&e.openTermIds.push(t.id)}),sessionStorage.setItem(u.UF_TERMLIST_STATE,JSON.stringify(e)),Ce()}}function De(){if(Te(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(u.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),window.scroll({top:e.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(u.UF_TERMLIST_STATE),Ee()}function K(e,t,n=null){e?.preventDefault(),we(),sessionStorage.setItem(u.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:n,position:0})),k(t)}function Oe(e,t){x(u.UF_RESHUFFLE,"true"),K(e,t)}function Fe(e){let t=m(e,"data-term-name");D.show({title:`Share / Find ${m(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:T(e.getAttribute("data-term-url")),verb:"Find"})}function Ke(e,t){let n=F.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=m(t,"data-term-slug"),r=parseInt(t.getAttribute("data-track-type")),s=t.getAttribute("data-track-source-uid");if(p.playback.preferredPlayer===Z.GALLERY||r===ne.SOUNDCLOUD)K(e,t.getAttribute("data-term-url"),null);else{let o=parseInt(t.getAttribute("data-track-num")),a="";o>$.listPerPage&&(a=`page/${Math.ceil(o/$.listPerPage)}/`),K(e,`${re}/list/${n}/${i}/${a}`,s)}}function Ne(e,t){we(),t.closest("div.permalink")!==null&&(e?.preventDefault(),k(T(t.href)))}function Ye(e){let t=e.target.closest("div.termlist-entry"),n=t.querySelector("div.expand-toggle span"),i=t.querySelector("div.termlist-body"),r=i.style.display.length!==0,s=t.classList.contains("data-fetched");_(t,r?"open":"closed",r?"closed":"open"),n.textContent=r?"expand_more":"expand_less",i.style.display=r?"":"flex",!r&&!s&&ke(F.listContainer,t,i)}var L=(()=>{let e=new ResizeObserver(d),t=null,n=null,i=null,r=!1;return window.addEventListener("load",()=>{H("#menu-primary-menu .menu-item-reshuffle a","click",ie),document.getElementById("menu-primary-menu")?.addEventListener("click",o)}),{isVisible(){return r},scrolledTop(){n.style.display=""},init:s,toggle:a};function s(){t=document.getElementById("site-header"),n=document.querySelector("#site-navigation .nav-menu-outer"),i=document.getElementById("nav-menu-modal-overlay"),w(".nav-menu-toggle","click",a),i.addEventListener("click",a),i.addEventListener("transitionend",g),e.observe(n.querySelector(".menu-primary-menu-container"))}function o(y){let h=y.target.closest("li.menu-item.menu-item-object-uf_channel");h!==null&&(document.body.matches(".single.track")||I())&&(y?.preventDefault(),k(T(h.querySelector("a").href)))}function a(){t.classList.contains("sticky-nav-up")?r?n.style.display="none":n.style.display="flex":t.classList.contains("sticky-nav-down")===!1&&t.classList.toggle("hide-nav-menu")}function d(y){r=y[0].contentRect.height!==0,r?(i.className="",i.classList.add("show"),setTimeout(()=>i.classList.add("fadein"),50)):i.classList.add("fadeout")}function g(){r===!1&&(i.className="",n.style.display="")}})();var U=(()=>{let e=new Event("allowKeyboardShortcuts"),t=new Event("denyKeyboardShortcuts"),n=null,i=null,r=null,s=null,o=!1;return{isVisible(){return o},init:a,toggle:d,hide:g};function a(){n=document.getElementById("site-header"),i=document.getElementById("search-container"),r=i.querySelector(".search-field"),s=n.querySelector("div.site-branding-container"),w(".nav-search-toggle","click",d),w(".nav-search-toggle","mousedown",c=>c.preventDefault()),r.addEventListener("blur",g),r.addEventListener("keydown",c=>{c.key==="Escape"&&(c.stopPropagation(),g())})}function d(){y()?h():g()}function g(){o&&S(!1,e,"","search")}function y(){return i.style.display.length===0?!(n.offsetHeight===0||W(G.SITE_MAX_WIDTH_MOBILE)&&n.querySelector(".navbar-container-mobile-top").offsetHeight===0&&n.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function h(){Ie(),S(!0,t,"flex","clear"),r.focus(),r.setSelectionRange(9999,9999)}function S(c,b,Pe,Ae){o=c,document.dispatchEvent(b),i.style.display=Pe,document.querySelectorAll("div.nav-search-toggle span").forEach(xe=>xe.textContent=Ae),o?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function Ie(){let c={};if(W(G.SITE_MAX_WIDTH_MOBILE))s.offsetHeight!==0?c.top=s.offsetTop:c.top=n.querySelector(".navbar-container-mobile-up").offsetTop,c=new DOMRect(63,c.top+3,document.body.clientWidth-60,30);else if(s.offsetHeight!==0){let b=s.getBoundingClientRect();c=new DOMRect(b.left,b.top+7,b.right,b.height-15)}else{let b=n.querySelector(".navbar-container").getBoundingClientRect();c=new DOMRect(b.left+88,b.top,b.right-90,b.height-1)}i.style.left=`${c.left}px`,i.style.top=`${c.top}px`,i.style.width=`${c.width-c.left}px`,i.style.height=`${c.height}px`}})();var $e=C("index"),l={siteHeader:null,introBanner:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{$e.log("DOMContentLoaded"),je(),l.introBanner!==null&&We(),document.getElementById("termlist-container")!==null&&Le(),l.siteContentSearch!==null&&(l.siteContentSearch.focus(),l.siteContentSearch.setSelectionRange(9999,9999)),Je()});function je(){$e.log("initIndex()"),l.siteHeader=document.getElementById("site-header"),l.introBanner=document.getElementById("intro-banner"),l.siteContent=document.getElementById("site-content"),l.siteContentSearch=document.querySelector("#site-content form input.search-field"),le(),U.init(),L.init(),A.addEventListener(),Xe.addEventListener(),document.addEventListener("fullscreenElement",e=>l.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",ze)}document.addEventListener("settingsUpdated",()=>{te(),ce(),x(u.UF_GALLERY_PER_PAGE,p.gallery.tracksPerPage,Y*5),x(u.UF_PREFERRED_PLAYER,p.playback.preferredPlayer,Y*5)});function ze(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":L.isVisible()&&(e.preventDefault(),L.toggle());return}if(p.site.keyboardShortcuts&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"c":case"C":N()&&(e.preventDefault(),L.toggle());break;case"L":N()&&ve()&&(v.galleryLayout.toggle(e),A.trigger());break;case"s":case"S":N()&&Ge()&&(e.preventDefault(),U.toggle());break;case"T":N()&&ve()&&v.siteTheme.toggle(e);break;case"ArrowLeft":e.shiftKey&&I()&&(e.preventDefault(),k($.prevPage));break;case"ArrowRight":e.shiftKey&&I()&&(e.preventDefault(),k($.nextPage));break}}function N(){return U.isVisible()===!1&&l.siteContentSearch!==document.activeElement}function ve(){return document.body.classList.contains("page-settings")===!1}function Ge(){return l.fullscreenTarget===null}function We(){ee("localStorage")&&bannerProperty&&p.banners[bannerProperty]&&(l.introBanner.style.display="block",A.trigger(),H("#intro-banner .intro-banner-close-button","click",()=>{l.introBanner.style.display="",l.siteContent.style.marginTop="",p.banners[bannerProperty]=!1}))}function Je(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let n=t.pathname.slice(-1)==="/"?1:0,i=t.pathname.slice(1,t.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((r,s)=>{e+=s+1<i.length?r+" / ":r})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var A=(()=>{let e=0;return{getHeaderHeight(){return e},addEventListener:t,trigger:n};function t(){n(),window.addEventListener("resize",n)}function n(){I()?e=B("--site-header-height-no-playback"):e=B("--site-header-height"),l.introBanner!==null&&l.introBanner.style.display.length!==0&&(l.introBanner.style.marginTop=`${e}px`,l.siteContent.style.marginTop=`${B("--site-content-margin-top",document.body)}px`)}})(),Xe=(()=>{let e=0,t=!1;return{addEventListener:n};function n(){i(),window.addEventListener("scroll",i)}function i(){let a=window.pageYOffset,d=Math.round(A.getHeaderHeight()>150?A.getHeaderHeight()/2:A.getHeaderHeight()/3);a===0||Math.round(a)<=1?r():a>d&&a>e?s():o(),U.hide(),e=a}function r(){l.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),l.siteHeader.classList.add("hide-nav-menu"),L.scrolledTop()}function s(){t===!1&&(t=!0,_(l.siteHeader,"sticky-nav-up","sticky-nav-down"))}function o(){t===!0&&(t=!1,_(l.siteHeader,"sticky-nav-down","sticky-nav-up")),L.isVisible()&&L.toggle()}})();
//# sourceMappingURL=index.js.map
