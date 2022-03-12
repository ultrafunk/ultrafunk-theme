import{Aa as m,Ba as k,Ca as T,Da as ot,aa as W,b as C,ba as U,ca as it,d as tt,f as u,fa as $,g as V,h as et,i as P,ia as rt,j as z,k as v,l as p,n as nt,o as G,p as A,sa as st,ta as j,ua as R,va as w,wa as at,xa as H,ya as J,za as M}from"./chunk-YHQAJM56.js";var lt=C("share-modal"),q=(()=>{let t=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,e,n,i,r,s,o,a;return{show:d};function d(h){return{title:e="Share / Play Track",bodyText:n=null,filterBodyText:i=!1,bodyHtml:r=null,url:s=null,sourceUid:o=null,verb:a="Play"}=h,U("share",e,g(),y)}function g(){let h=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"amazonMusicId",icon:"link",content:`<b>${a}</b> on Amazon Music`},{clickId:"appleMusicId",icon:"link",content:`<b>${a}</b> on Apple Music`},{clickId:"spotifyId",icon:"link",content:`<b>${a}</b> on Spotify`},{clickId:"tidalId",icon:"link",content:`<b>${a}</b> on Tidal`},{clickId:"youTubeMusicId",icon:"link",content:`<b>${a}</b> on YouTube Music`}];return r!==null&&h.unshift({class:"track-share-entry",content:r}),h}function y(h){lt.log(`singleChoiceListClick(): ${h} - title: "${e}" - bodyText: "${n}" - filterBodyText: ${i} - url: ${s} - sourceUid: ${o} - verb: ${a}`);let S=encodeURIComponent(i?n.replace(t," "):n);switch(h){case"copyToClipboardId":X(s,"Track link copied to clipboard","Unable to copy Track link to clipboard");break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(n)}&body=${s}%0d%0a`;break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${S}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${S}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${S}`,"_blank");break;case"tidalId":window.open(`https://google.com/search?q=${S}%20site:tidal.com`,"_blank");break;case"youTubeMusicId":o!==null?window.open(`https://music.youtube.com/watch?v=${o}`,"_blank"):window.open(`https://music.youtube.com/search?q=${S}`,"_blank");break}}})();function X(t,e="Text copied to clipboard",n="Unable to copy text to clipboard"){navigator.clipboard.writeText(t).then(()=>{A(e,3)},i=>{lt.error(`copyTextToClipboard() failed because ${i}`),A(n,5)})}var Z=C("site-interaction"),E=document.documentElement.classList,O={},F={};function ct(){Z.log("init()"),O=new gt("footer-site-theme-toggle"),F=new pt("footer-gallery-layout-toggle"),w(".entry-meta-controls .track-share-control","click",t=>dt(t.target)),document.getElementById("tracklist")?.addEventListener("click",_t),window.addEventListener("load",()=>{document.querySelector(".widget ul.uf_channel")?.addEventListener("click",Q),document.querySelector(".widget ul.uf_artist")?.addEventListener("click",Q),document.querySelector(".widget.widget_archive ul")?.addEventListener("click",Q)})}function ut(){O.setCurrent(),F.setCurrent()}function _t(t){let e=t.target.closest("div.share-play-button");if(e!==null)return dt(e.closest("div.track-entry"));let n=t.target.closest("div.details-button");if(n!==null)return Ut(n.closest("div.track-entry"))}function Q(t){t.target.matches("a")&&(t?.preventDefault(),k(T(t.target.href)))}function dt(t){let e=m(t,"data-track-artist"),n=m(t,"data-track-title"),i=q.show({bodyText:`${e} - ${n}`,filterBodyText:!0,bodyHtml:W(t,e,n),url:m(t,"data-track-url"),sourceUid:m(t,"data-track-source-uid")});ht(i,`${e} - ${n}`)}function Ut(t){let e=m(t,"data-track-artist"),n=m(t,"data-track-title"),i=t.querySelector(".track-artists-links").querySelectorAll("a"),r=t.querySelector(".track-channels-links").querySelectorAll("a"),s=[];s.push({class:"track-details-entry",content:W(t,e,n)}),s.push({class:"header-entry",content:"Artists"}),i.forEach(a=>{s.push({clickId:`entry-${s.length}`,class:`icon-text ${a.classList[0]}`,title:"Go to Artist",content:a.innerText,link:a.href,icon:"link"})}),s.push({class:"header-entry",content:"Channels"}),r.forEach(a=>{s.push({clickId:`entry-${s.length}`,title:"Go to Channel",content:a.innerText,link:a.href,icon:"link"})});let o=U("track-details","Track Details",s,a=>{k(s.find(d=>d.clickId===a).link)});ht(o,`${e} - ${n}`)}function ht(t,e){document.getElementById(t).querySelector(".modal-track").title="Click thumbnail to Copy Artist & Title",document.getElementById(t)?.querySelector("img")?.addEventListener("click",()=>{X(e,"Artist &amp Title copied to clipboard","Unable to copy Artist &amp Title to clipboard")})}function mt(t,e,n){let i=Object.values(t).find(r=>r.id===e);return i!==void 0?i:n}function ft(t,e){let n=Object.values(t).findIndex(r=>r.id===e.id),i=Object.keys(t);return n+1<i.length?t[i[n+1]]:t[i[0]]}var gt=class extends G{constructor(e){super(e,!1);this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=mt(this.themes,p.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=ft(this.themes,this.currentTheme),p.site.theme=this.currentTheme.id}update(){let e=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),z(u.UF_SITE_THEME,e.id),E.contains(e.class)===!1&&(Z.log(`SiteThemeToggle.update() - newSiteTheme: ${e.id}`),E.remove(this.themes.light.class,this.themes.dark.class),E.add(e.class)),this.value=this.currentTheme.text}},pt=class extends G{constructor(e){super(e,!1);this.minWidth=`(max-width: ${at("--site-gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-layout-1-column"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-layout-2-column"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-layout-3-column"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",n=>this.matchMediaMinWidth(n))}setCurrent(){this.currentLayout=mt(this.layouts,p.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(e){E.contains("user-layout")&&(e.matches?E.remove(this.currentLayout.class):E.add(this.currentLayout.class))}toggle(){this.currentLayout=ft(this.layouts,this.currentLayout),p.gallery.layout=this.currentLayout.id}update(e){z(u.UF_GALLERY_LAYOUT,this.currentLayout.id),E.contains("user-layout")&&E.contains(this.currentLayout.class)===!1&&(Z.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),E.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),window.matchMedia(this.minWidth).matches===!1&&E.add(this.currentLayout.class)),this.value=this.currentLayout.text,e?.type==="click"&&this.element.scrollIntoView()}};function yt(t,e,n,i){let r=`<b>${t}</b>`;n.forEach((s,o)=>{let a=ot(s.meta);r+=`
    <div class="track">
      <div class="thumbnail ${a.class}"
        data-term-url="${s.link}"
        data-term-slug="${e}"
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
    </div>`}),i.innerHTML=r}function bt(t,e,n){let i=`<b>${t}</b><br>`;e.forEach(r=>i+=`<a href="${T(r.link)}">${r.name}</a>, `),n.innerHTML=i.slice(0,i.length-2)}var I=C("termlist-rest"),f={termCache:{}};function Tt(t,e,n){let i=m(t,"data-term-type"),r=parseInt(e.getAttribute("data-term-id")),s=m(e,"data-term-slug"),o=i==="channels";Ht(i,r,o?10:50,a=>{let d=o?"Latest Tracks":"All Tracks",g=n.querySelector(".body-left");a!==null?(yt(d,s,a,g),e.classList.add("data-fetched")):A("Unable to fetch track data, please try again...",10),!o&&a!==null&&Bt(a,r,50,(y,h)=>{d=y==="artists"?"Related Artists":"In Channels",g=y==="artists"?n.querySelector(".artists"):n.querySelector(".channels"),h!==null?bt(d,h,g):g.innerHTML=`<b>${d}</b><br>None found`})})}function Ht(t,e,n,i){e in f.termCache?i(f.termCache[e].tracks):(I.log(`fetchTracks() - termType: ${t} - termId: ${e} - maxItems: ${n}`),fetch(`/wp-json/wp/v2/tracks?${t}=${e}&per_page=${n}&_fields=id,link,artists,channels,meta`).then(r=>r.ok?r.json():(I.error(r),null)).then(r=>{f.termCache[e]={tracks:r},i(r)}).catch(r=>{I.warn(r),i(null)}))}function Bt(t,e,n,i){if("channels"in f.termCache[e]&&"artists"in f.termCache[e])i("channels",f.termCache[e].channels),i("artists",f.termCache[e].artists);else{let r=[],s=[];t.forEach(o=>{r.push.apply(r,o.channels),s.push.apply(s,o.artists)}),s=s.filter(o=>o!==e),kt("channels",e,[...new Set(r)],n,i),kt("artists",e,[...new Set(s)],n,i)}}function kt(t,e,n,i,r){n.length>0?(I.log(`fetchMeta() - termType: ${t} - termIds: ${n.length>0?n:"Empty"} - maxItems: ${i}`),fetch(`/wp-json/wp/v2/${t}?include=${n}&per_page=${i}&_fields=link,name`).then(s=>s.ok?s.json():(I.error(s),null)).then(s=>{f.termCache[e][t]=s,r(t,s)}).catch(s=>{I.warn(s),r(null)})):(f.termCache[e][t]=null,r(t,null))}function Ct(){f.termCache=JSON.parse(sessionStorage.getItem(u.UF_TERMLIST_CACHE)),f.termCache===null&&(f.termCache={})}function Et(){sessionStorage.setItem(u.UF_TERMLIST_CACHE,JSON.stringify(f.termCache))}function St(){sessionStorage.removeItem(u.UF_TERMLIST_CACHE)}function Lt(){return Object.keys(f.termCache).length>0}var Dt=C("termlist-controls"),K={listContainer:null};function wt(){Dt.log("init()"),K.listContainer=document.getElementById("termlist-container"),K.listContainer.addEventListener("click",t=>{let e=t.target.closest("div.play-button");if(e!==null)return N(t,T(e.querySelector("a").href));let n=t.target.closest("div.shuffle-button");if(n!==null)return Ft(t,T(n.querySelector("a").href));let i=t.target.closest("div.share-find-button");if(i!==null)return Kt(i);if(t.target.closest("div.termlist-header")!==null)return Vt(t);let s=t.target.closest("div.thumbnail");if(s!==null)return Nt(t,s);let o=t.target.closest("a");if(o!==null)return Yt(t,o)}),Ot()}function vt(){if(Lt()){let t={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(e=>{e.classList.contains("open")&&t.openTermIds.push(e.id)}),sessionStorage.setItem(u.UF_TERMLIST_STATE,JSON.stringify(t)),Et()}}function Ot(){if(Ct(),performance.getEntriesByType("navigation")[0].type!=="reload"){let t=JSON.parse(sessionStorage.getItem(u.UF_TERMLIST_STATE));t!==null&&t.pageUrl===window.location.href?(history.scrollRestoration="manual",t.openTermIds.forEach(e=>{document.getElementById(e).querySelector("div.termlist-header").click()}),window.scroll({top:t.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(u.UF_TERMLIST_STATE),St()}function N(t,e,n=null){t?.preventDefault(),vt(),sessionStorage.setItem(u.UF_AUTOPLAY,JSON.stringify({autoplay:t.shiftKey===!1,trackId:n,position:0})),k(e)}function Ft(t,e){P(u.UF_RESHUFFLE,"true"),N(t,e)}function Kt(t){let e=m(t,"data-term-name");q.show({title:`Share / Find ${m(t,"data-term-path")}`,bodyText:e,bodyHtml:`<b>${e}</b>`,url:T(t.getAttribute("data-term-url")),verb:"Find"})}function Nt(t,e){let n=K.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",i=m(e,"data-term-slug"),r=parseInt(e.getAttribute("data-track-type")),s=e.getAttribute("data-track-source-uid");if(p.playback.preferredPlayer===tt.GALLERY||r===it.SOUNDCLOUD)N(t,e.getAttribute("data-term-url"),null);else{let o=parseInt(e.getAttribute("data-track-num")),a="";o>v.listPerPage&&(a=`page/${Math.ceil(o/v.listPerPage)}/`),N(t,`${st}/list/${n}/${i}/${a}`,s)}}function Yt(t,e){vt(),e.closest("div.permalink")!==null&&(t?.preventDefault(),k(T(e.href)))}function Vt(t){let e=t.target.closest("div.termlist-entry"),n=e.querySelector("div.expand-toggle span"),i=e.querySelector("div.termlist-body"),r=i.style.display.length!==0,s=e.classList.contains("data-fetched");M(e,r?"open":"closed",r?"closed":"open"),n.textContent=r?"expand_more":"expand_less",i.style.display=r?"":"flex",!r&&!s&&Tt(K.listContainer,e,i)}var L=(()=>{let t=new ResizeObserver(d),e=null,n=null,i=null,r=!1;return window.addEventListener("load",()=>{R("#menu-primary-menu .menu-item-reshuffle a","click",rt),document.getElementById("menu-primary-menu")?.addEventListener("click",o)}),{isVisible(){return r},scrolledTop(){n.style.display=""},init:s,toggle:a};function s(){e=document.getElementById("site-header"),n=document.querySelector("#site-navigation .nav-menu-outer"),i=document.getElementById("nav-menu-modal-overlay"),w(".nav-menu-toggle","click",a),i.addEventListener("click",a),i.addEventListener("transitionend",g),t.observe(n.querySelector(".menu-primary-menu-container"))}function o(y){let h=y.target.closest("li.menu-item.menu-item-object-uf_channel");h!==null&&(document.body.matches(".single.track")||$())&&(y?.preventDefault(),k(T(h.querySelector("a").href)))}function a(){e.classList.contains("sticky-nav-up")?r?n.style.display="none":n.style.display="flex":e.classList.contains("sticky-nav-down")===!1&&e.classList.toggle("hide-nav-menu")}function d(y){r=y[0].contentRect.height!==0,r?(i.className="",i.classList.add("show"),setTimeout(()=>i.classList.add("fadein"),50)):i.classList.add("fadeout")}function g(){r===!1&&(i.className="",n.style.display="")}})();var _=(()=>{let t=new Event("allowKeyboardShortcuts"),e=new Event("denyKeyboardShortcuts"),n=null,i=null,r=null,s=null,o=!1;return{isVisible(){return o},init:a,toggle:d,hide:g};function a(){n=document.getElementById("site-header"),i=document.getElementById("search-container"),r=i.querySelector(".search-field"),s=n.querySelector("div.site-branding-container"),w(".nav-search-toggle","click",d),w(".nav-search-toggle","mousedown",c=>c.preventDefault()),r.addEventListener("blur",g),r.addEventListener("keydown",c=>{c.key==="Escape"&&(c.stopPropagation(),g())})}function d(){y()?h():g()}function g(){o&&S(!1,t,"","search")}function y(){return i.style.display.length===0?!(n.offsetHeight===0||J(j.SITE_MAX_WIDTH_MOBILE)&&n.querySelector(".navbar-container-mobile-top").offsetHeight===0&&n.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function h(){xt(),S(!0,e,"flex","clear"),r.focus(),r.setSelectionRange(9999,9999)}function S(c,b,Pt,At){o=c,document.dispatchEvent(b),i.style.display=Pt,document.querySelectorAll("div.nav-search-toggle span").forEach(Mt=>Mt.textContent=At),o?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function xt(){let c={};if(J(j.SITE_MAX_WIDTH_MOBILE))s.offsetHeight!==0?c.top=s.offsetTop:c.top=n.querySelector(".navbar-container-mobile-up").offsetTop,c=new DOMRect(63,c.top+3,document.body.clientWidth-60,30);else if(s.offsetHeight!==0){let b=s.getBoundingClientRect();c=new DOMRect(b.left,b.top+7,b.right,b.height-15)}else{let b=n.querySelector(".navbar-container").getBoundingClientRect();c=new DOMRect(b.left+88,b.top,b.right-90,b.height-1)}i.style.left=`${c.left}px`,i.style.top=`${c.top}px`,i.style.width=`${c.width-c.left}px`,i.style.height=`${c.height}px`}})();var It=C("index"),l={siteHeader:null,introBanner:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{It.log("DOMContentLoaded"),Gt(),l.introBanner!==null&&Jt(),document.getElementById("termlist-container")!==null&&wt(),l.siteContentSearch!==null&&(l.siteContentSearch.focus(),l.siteContentSearch.setSelectionRange(9999,9999)),Xt()});function Gt(){It.log("initIndex()"),l.siteHeader=document.getElementById("site-header"),l.introBanner=document.getElementById("intro-banner"),l.siteContent=document.getElementById("site-content"),l.siteContentSearch=document.querySelector("#site-content form input.search-field"),ct(),_.init(),L.init(),x.addEventListener(),Qt.addEventListener(),document.addEventListener("fullscreenElement",t=>l.fullscreenTarget=t.fullscreenTarget),document.addEventListener("keydown",Wt)}document.addEventListener("settingsUpdated",()=>{nt(),ut(),P(u.UF_GALLERY_PER_PAGE,p.gallery.tracksPerPage,V*5),P(u.UF_PREFERRED_PLAYER,p.playback.preferredPlayer,V*5)});function Wt(t){if(t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"Escape":L.isVisible()&&(t.preventDefault(),L.toggle());return}if(p.site.keyboardShortcuts&&t.repeat===!1&&t.ctrlKey===!1&&t.altKey===!1)switch(t.key){case"c":case"C":Y()&&(t.preventDefault(),L.toggle());break;case"L":Y()&&$t()&&(F.toggle(t),x.trigger());break;case"s":case"S":Y()&&jt()&&(t.preventDefault(),_.toggle());break;case"T":Y()&&$t()&&O.toggle(t);break;case"ArrowLeft":t.shiftKey&&$()&&(t.preventDefault(),k(v.prevPage));break;case"ArrowRight":t.shiftKey&&$()&&(t.preventDefault(),k(v.nextPage));break}}function Y(){return _.isVisible()===!1&&l.siteContentSearch!==document.activeElement}function $t(){return document.body.classList.contains("page-settings")===!1}function jt(){return l.fullscreenTarget===null}function Jt(){et("localStorage")&&bannerProperty&&p.banners[bannerProperty]&&(l.introBanner.style.display="block",x.trigger(),R("#intro-banner .intro-banner-close-button","click",()=>{l.introBanner.style.display="",l.siteContent.style.marginTop="",p.banners[bannerProperty]=!1}))}function Xt(){if(document.querySelector(".navbar-title .go-back-to")!==null){let t="";if(document.referrer.length===0)t="Previous Page";else{let e=new URL(decodeURIComponent(document.referrer));if(e.search.length!==0)t="Search Results";else if(e.pathname.length>1){let n=e.pathname.slice(-1)==="/"?1:0,i=e.pathname.slice(1,e.pathname.length-n).replace(/-/gi," ").split("/");i.forEach((r,s)=>{t+=s+1<i.length?r+" / ":r})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(e=>{e.querySelector(".go-back-title").textContent=t.length>0?t:"Ultrafunk (home)",e.querySelector(".go-back-to").style.opacity=1})}}var x=(()=>{let t=0;return{getHeaderHeight(){return t},addEventListener:e,trigger:n};function e(){n(),window.addEventListener("resize",n)}function n(){$()?t=H("--site-header-height-no-playback"):t=H("--site-header-height"),l.introBanner!==null&&l.introBanner.style.display.length!==0&&(l.introBanner.style.marginTop=`${t}px`,l.siteContent.style.marginTop=`${H("--site-content-margin-top",document.body)}px`)}})(),Qt=(()=>{let t=0,e=!1;return{addEventListener:n};function n(){i(),window.addEventListener("scroll",i)}function i(){let a=window.pageYOffset,d=Math.round(x.getHeaderHeight()>150?x.getHeaderHeight()/2:x.getHeaderHeight()/3);a===0||Math.round(a)<=1?r():a>d&&a>t?s():o(),_.hide(),t=a}function r(){l.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),l.siteHeader.classList.add("hide-nav-menu"),L.scrolledTop()}function s(){e===!1&&(e=!0,M(l.siteHeader,"sticky-nav-up","sticky-nav-down"))}function o(){e===!0&&(e=!1,M(l.siteHeader,"sticky-nav-down","sticky-nav-up")),L.isVisible()&&L.toggle()}})();
//# sourceMappingURL=index.js.map
