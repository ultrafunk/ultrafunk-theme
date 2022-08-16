import{B as fe,G as O,Ga as $,H as I,I as U,J as R,Ja as ke,K as pe,L as w,M as x,N as H,O as ge,P as y,Pa as be,Q as T,R as C,S as ye,T as B,Ta as Ce,U as Z,V as q,W as ee,X as D,i as E,l as ue,m as de,o as p,p as X,q as he,r as _,s as Q,t as L,u as g,w as me,x as P}from"./chunk-F6GD45XB.js";var ve=E("share-modal"),Ye=()=>{let e=/\s{1,}[\u002D\u00B7\u2013]\s{1,}/i,t,i,n,s,r,a,l,o;return{show:m};function m(k){return{title:t="Share / Play Track",bodyText:i=null,filterBodyText:n=!1,bodyHtml:s=null,url:r=null,sourceUid:a=null,verb:l="Play",icon:o="link"}=k,D(t,d(),"share",S)}function d(){let k=[{clickId:"copyToClipboardId",icon:"content_copy",content:"<b>Copy Link</b> to Clipboard"},{clickId:"shareOnEmailId",icon:"share",content:"<b>Share</b> on Email"},{clickId:"searchOnGoogleId",icon:"search",content:"<b>Search</b> on Google"},{clickId:"amazonMusicId",icon:o,content:`<b>${l}</b> on Amazon Music`},{clickId:"appleMusicId",icon:o,content:`<b>${l}</b> on Apple Music`},{clickId:"spotifyId",icon:o,content:`<b>${l}</b> on Spotify`},{clickId:"youTubeMusicId",icon:o,content:`<b>${l}</b> on YouTube Music`}];return s!==null&&k.unshift({class:"track-share-entry",content:s}),k}function S(k){ve.log(`singleChoiceListClick(): ${k} - title: "${t}" - bodyText: "${i}" - filterBodyText: ${n} - url: ${r} - sourceUid: ${a} - verb: ${l}`);let f=encodeURIComponent(n?i.replace(e," "):i);switch(k){case"copyToClipboardId":ne(r,"Track link copied to clipboard","Unable to copy Track link to clipboard");break;case"shareOnEmailId":window.location.href=`mailto:?subject=${encodeURIComponent(i)}&body=${encodeURI(r)}%0d%0a`;break;case"searchOnGoogleId":window.open(`https://www.google.com/search?q=${f}`,"_blank");break;case"amazonMusicId":window.open(`https://music.amazon.com/search/${f}`,"_blank");break;case"appleMusicId":window.open(`https://music.apple.com/ca/search?term=${f}`,"_blank");break;case"spotifyId":window.open(`https://open.spotify.com/search/${f}`,"_blank");break;case"youTubeMusicId":a!==null?window.open(`https://music.youtube.com/watch?v=${a}`,"_blank"):window.open(`https://music.youtube.com/search?q=${f}`,"_blank");break}}},F=Ye();function ne(e,t="Text copied to clipboard",i="Unable to copy text to clipboard"){navigator.clipboard.writeText(e).then(()=>{P(t,3)},n=>{ve.error(`copyTextToClipboard() failed because ${n}`),P(i,5)})}var oe=E("site-interaction"),v=document.documentElement.classList,Te={metaUiElements:null,listUiElements:null},K={},V={};function Se(){oe.log("init()"),Te.metaUiElements=new ie("div.track-meta",!0),Te.listUiElements=new se("#tracklist"),K=new re("footer-site-theme-toggle"),V=new ae("footer-gallery-layout-toggle"),window.addEventListener("load",()=>{document.querySelector(".widget ul.uf_channel")?.addEventListener("click",N),document.querySelector(".widget ul.uf_artist")?.addEventListener("click",N),document.querySelector(".widget.widget_archive ul")?.addEventListener("click",N)})}function Ee(){K.setCurrent(),V.setCurrent()}var ie=class extends q{elementClicked(){if(this.clicked("div.track-share-control"))return we(this.closest("single-track, gallery-track"));if(this.clicked("span.term-links"))return N(this.event)}},se=class extends q{elementClicked(){if(this.clicked("div.share-play-button"))return we(this.closest("div.track-entry"));if(this.clicked("div.details-button"))return Ke(this.closest("div.track-entry"))}};function N(e){e.target.matches("a")&&(e?.preventDefault(),T(C(e.target.href)))}function we(e){let t=y(e,"data-track-artist"),i=y(e,"data-track-title"),n=F.show({bodyText:`${t} - ${i}`,filterBodyText:!0,bodyHtml:ee(e,t,i),url:y(e,"data-track-url"),sourceUid:y(e,"data-track-source-uid")});Le(n,`${t} - ${i}`)}function Ke(e){let t=y(e,"data-track-artist"),i=y(e,"data-track-title"),n=parseInt(e.getAttribute("data-track-duration")),s=e.querySelector(".track-artists-links").querySelectorAll("a"),r=e.querySelector(".track-channels-links").querySelectorAll("a"),a=[];a.push({class:"track-details-entry",content:ee(e,t,i)}),a.push({class:"header-entry",content:"Artists"}),s.forEach(o=>{a.push({clickId:`entry-${a.length}`,class:`icon-text ${o.classList[0]}`,title:"Go to Artist",content:o.innerText,link:o.href,icon:"link"})}),a.push({class:"header-entry",content:"Channels"}),r.forEach(o=>{a.push({clickId:`entry-${a.length}`,title:"Go to Channel",content:o.innerText,link:o.href,icon:"link"})});let l=D(`Track Details<span class="light-text lowercase-text">${n>0?ge(n):"N / A"}</span>`,a,"track-details",o=>{T(a.find(m=>m.clickId===o).link)});Le(l,`${t} - ${i}`)}function Le(e,t){document.getElementById(e).querySelector(".modal-track .modal-track-thumbnail").title="Click / tap to Copy Artist & Title",document.getElementById(e)?.querySelector("img")?.addEventListener("click",()=>{ne(t,"Artist &amp Title copied to clipboard","Unable to copy Artist &amp Title to clipboard")})}function Ie(e,t,i){let n=Object.values(e).find(s=>s.id===t);return n!==void 0?n:i}function xe(e,t){let i=Object.values(e).findIndex(s=>s.id===t.id),n=Object.keys(e);return i+1<n.length?e[n[i+1]]:e[n[0]]}var re=class extends Z{constructor(t){super(t,!1),this.themes={light:{id:"light",text:"light",class:"site-theme-light"},dark:{id:"dark",text:"dark",class:"site-theme-dark"},auto:{id:"auto",text:"auto"}},this.setCurrent(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>this.matchMediaPrefColorScheme())}setCurrent(){this.currentTheme=Ie(this.themes,g.site.theme,this.themes.auto),this.update()}matchMediaPrefColorScheme(){this.currentTheme.id===this.themes.auto.id&&this.update()}toggle(){this.currentTheme=xe(this.themes,this.currentTheme),g.site.theme=this.currentTheme.id}update(){let t=this.currentTheme;this.currentTheme.id===this.themes.auto.id&&(t=window.matchMedia("(prefers-color-scheme: dark)").matches?this.themes.dark:this.themes.light),Q(p.UF_SITE_THEME,t.id),v.contains(t.class)===!1&&(oe.log(`SiteThemeToggle.update() - newSiteTheme: ${t.id}`),v.remove(this.themes.light.class,this.themes.dark.class),v.add(t.class)),this.value=this.currentTheme.text}},ae=class extends Z{constructor(t){super(t,!1),this.minWidth=`(max-width: ${pe("--gallery-layout-min-width")})`,this.layouts={oneColumn:{id:"1-column",text:"1 column",class:"gallery-1-col"},twoColumn:{id:"2-column",text:"2 column",class:"gallery-2-col"},threeColumn:{id:"3-column",text:"3 / 4 column",class:"gallery-3-col"}},this.setCurrent(),window.matchMedia(this.minWidth).addEventListener("change",i=>this.matchMediaMinWidth(i))}setCurrent(){this.currentLayout=Ie(this.layouts,g.gallery.layout,this.layouts.threeColumn),this.update()}matchMediaMinWidth(t){v.contains("gallery-layout")&&(t.matches?(v.remove(this.currentLayout.class),v.add(this.layouts.oneColumn.class)):(v.remove(this.layouts.oneColumn.class),v.add(this.currentLayout.class)))}toggle(){this.currentLayout=xe(this.layouts,this.currentLayout),g.gallery.layout=this.currentLayout.id}update(t){this.value=this.currentLayout.text,Q(p.UF_GALLERY_LAYOUT,this.currentLayout.id),!window.matchMedia(this.minWidth).matches&&(v.contains("gallery-layout")&&v.contains(this.currentLayout.class)===!1&&(oe.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`),v.remove(this.layouts.oneColumn.class,this.layouts.twoColumn.class,this.layouts.threeColumn.class),v.add(this.currentLayout.class)),t?.type==="click"&&this.element.scrollIntoView())}};function $e(e,t,i){let n=`<b>${e}</b>`;return i.forEach((s,r)=>{let a=ye(s.meta);n+=`
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
    </div>`}),n}function Ae(e,t){let i=`<b>${e}</b><br>`;return t.forEach(n=>i+=`<a href="${C(n.link)}">${n.name}</a>, `),i.slice(0,i.length-2)}function Me(e,t,i){let n=`<b>${e}</b><br>`;return t.forEach(s=>{n+=`<a href="${C(`${O}/artist/${s.artist_slug}/?channel=${i}`)}">${s.artist_name}</a> (${s.track_count})<br>`}),n}var h={termCache:{}};function le(e,t,i){let n=y(e,"data-term-type"),s=parseInt(t.getAttribute("data-term-id")),r=y(t,"data-term-slug"),a=n==="channels";ze(n,s,a?10:50,async l=>{let o=a?"Latest Tracks":"All Tracks",m=i.querySelector(".body-left");if(l!==null?(m.innerHTML=$e(o,r,l),t.classList.add("data-fetched")):P("Failed to fetch track data!",30,"retry",()=>le(e,t,i)),!a&&l!==null)Ge(l,s,50,(d,S)=>{o=d==="artists"?"Related Artists":"In Channels",m=d==="artists"?i.querySelector(".artists"):i.querySelector(".channels"),S!==null?m.innerHTML=Ae(o,S):m.innerHTML=`<b>${o}</b><br>None found`});else if(l!==null){if(!("topArtists"in h.termCache[s])){let d=await B("top-artists",`channelId=${s}`,!0,"/wp-json/ultrafunk/v1/");d!==null&&d.status.code===200&&(h.termCache[s].topArtists=d.data)}i.querySelector(".top-artists").innerHTML=Me("Top Artists (tracks)",h.termCache[s].topArtists,r)}})}async function ze(e,t,i,n){if(!(t in h.termCache)){let s=await B("tracks",`${e}=${t}&per_page=${i}&_fields=id,link,artists,channels,meta`,!0);s!==null&&s.status.code===200&&(h.termCache[t]={tracks:s.data})}n(h.termCache[t]!==void 0?h.termCache[t].tracks:null)}function Ge(e,t,i,n){if("channels"in h.termCache[t]&&"artists"in h.termCache[t])n("channels",h.termCache[t].channels),n("artists",h.termCache[t].artists);else{let s=[],r=[];e.forEach(a=>{s.push.apply(s,a.channels),r.push.apply(r,a.artists)}),r=r.filter(a=>a!==t),_e("channels",t,[...new Set(s)],i,n),_e("artists",t,[...new Set(r)],i,n)}}async function _e(e,t,i,n,s){if(i.length>0){let r=await B(e,`include=${i}&per_page=${n}&_fields=link,name`,!0);r!==null&&r.status.code===200&&(h.termCache[t][e]=r.data)}s(e,h.termCache[t][e]!==void 0?h.termCache[t][e]:null)}function Pe(){h.termCache=JSON.parse(sessionStorage.getItem(p.UF_TERMLIST_CACHE)),h.termCache===null&&(h.termCache={})}function Ue(){sessionStorage.setItem(p.UF_TERMLIST_CACHE,JSON.stringify(h.termCache))}function Re(){sessionStorage.removeItem(p.UF_TERMLIST_CACHE)}function He(){return Object.keys(h.termCache).length>0}var Je=E("termlist-controls"),z={listContainer:null,uiElements:null};function qe(){Je.log("init()"),z.listContainer=document.getElementById("termlist-container"),z.uiElements=new ce("#termlist-container"),je()}function Oe(){if(He()){let e={pageUrl:window.location.href,scrollPos:Math.round(window.pageYOffset),openTermIds:[]};document.querySelectorAll(".termlist-entry").forEach(t=>{t.classList.contains("open")&&e.openTermIds.push(t.id)}),sessionStorage.setItem(p.UF_TERMLIST_STATE,JSON.stringify(e)),Ue()}}function je(){if(Pe(),performance.getEntriesByType("navigation")[0].type!=="reload"){let e=JSON.parse(sessionStorage.getItem(p.UF_TERMLIST_STATE));e!==null&&e.pageUrl===window.location.href?(history.scrollRestoration="manual",e.openTermIds.forEach(t=>{document.getElementById(t).querySelector("div.termlist-header").click()}),window.scroll({top:e.scrollPos,left:0,behavior:"auto"})):history.scrollRestoration="auto"}sessionStorage.removeItem(p.UF_TERMLIST_STATE),Re()}var ce=class extends q{elementClicked(){if(this.clicked("div.play-button"))return G(this.event,C(this.querySelector("a").href));if(this.clicked("div.shuffle-button"))return Xe(this.event,C(this.querySelector("a").href));if(this.clicked("div.share-find-button"))return Qe(this.element);if(this.clicked("div.termlist-header"))return tt(this.event);if(this.clicked("div.thumbnail"))return Ze(this.event,this.element);if(this.clicked("a"))return et(this.event,this.element)}};function G(e,t,i=null){e?.preventDefault(),Oe(),sessionStorage.setItem(p.UF_AUTOPLAY,JSON.stringify({autoplay:e.shiftKey===!1,trackId:i,position:0})),T(t)}function Xe(e,t){_(p.UF_RESHUFFLE,"true"),G(e,t)}function Qe(e){let t=y(e,"data-term-name");F.show({title:`Share / Find ${y(e,"data-term-path")}`,bodyText:t,bodyHtml:`<b>${t}</b>`,url:C(e.getAttribute("data-term-url")),verb:"Find",icon:"search"})}function Ze(e,t){let i=z.listContainer.getAttribute("data-term-type")==="channels"?"channel":"artist",n=y(t,"data-term-slug"),s=parseInt(t.getAttribute("data-track-type")),r=t.getAttribute("data-track-source-uid");if(g.playback.preferredPlayer===de.GALLERY||s===fe.SOUNDCLOUD)G(e,t.getAttribute("data-term-url"),null);else{let a=parseInt(t.getAttribute("data-track-num")),l="";a>L.listPerPage&&(l=`page/${Math.ceil(a/L.listPerPage)}/`),G(e,`${O}/list/${i}/${n}/${l}`,r)}}function et(e,t){Oe(),t.closest("div.permalink")!==null&&(e?.preventDefault(),T(C(t.href)))}function tt(e){let t=e.target.closest("div.termlist-entry"),i=t.querySelector("div.expand-toggle span"),n=t.querySelector("div.termlist-body"),s=n.style.display.length!==0,r=t.classList.contains("data-fetched");H(t,s?"open":"closed",s?"closed":"open"),i.textContent=s?"expand_more":"expand_less",n.style.display=s?"":"flex",!s&&!r&&le(z.listContainer,t,n)}var it=()=>{let e=new ResizeObserver(d),t=null,i=null,n=null,s=null,r=!1,a=0;return window.addEventListener("load",()=>{U("#menu-primary-sections .menu-item-reshuffle a","click",ke),U("#menu-primary-sections .menu-item-pref-player","click",()=>be.toggle()),document.getElementById("menu-primary-channels")?.addEventListener("click",m)}),{isVisible(){return r},scrolledTop(){i.style.display=""},init:l,toggle:o};function l(){t=document.getElementById("site-header"),i=document.querySelector("#site-navigation .nav-menu-outer"),n=document.querySelector("#site-navigation .nav-menu-inner"),s=document.getElementById("nav-menu-modal-overlay"),R("div.nav-menu-toggle","click",o),s.addEventListener("click",o),window.addEventListener("resize",()=>S()),e.observe(i)}function o(){a=t.offsetHeight,t.classList.contains("sticky-nav-up")?i.style.display=r?"none":"flex":t.classList.contains("sticky-nav-down")===!1&&t.classList.toggle("hide-nav-menu")}function m(f){let c=f.target.closest("li.menu-item.menu-item-object-uf_channel");c!==null&&(Ce()||$())&&(f?.preventDefault(),T(C(c.querySelector("a").href)))}function d(f){r=f[0].contentRect.height!==0,r?s.className===""&&(s.style.backgroundColor=`rgba(0, 0, 0, ${Math.round(10*(g.site.modalOverlayOpacity/100))/10})`,s.classList.add("show"),x(I.SITE_MAX_WIDTH_MOBILE)&&k("hidden","close","100vh"),S()):(s.className="",i.style.display="",k())}function S(){if(r&&x(I.SITE_MAX_WIDTH_MOBILE)){let f=w("margin-top",n)+w("margin-bottom",n);n.style=`overflow-y: auto; max-height: ${window.innerHeight-(a+f)}px`}}function k(f="",c="menu",b=""){document.documentElement.style.overflowY=f,t.querySelectorAll(".nav-menu-toggle span")?.forEach(j=>j.textContent=c),t.style.height=b,n.style=""}},A=it();var st=()=>{let e=new Event("allowKeyboardShortcuts"),t=new Event("denyKeyboardShortcuts"),i=null,n=null,s=null,r=null,a=!1;return{isVisible(){return a},init:l,toggle:o,hide:m};function l(){i=document.getElementById("site-header"),n=document.getElementById("search-container"),s=n.querySelector(".search-field"),r=i.querySelector("div.site-branding-container"),R(".nav-search-toggle","click",o),R(".nav-search-toggle","mousedown",c=>c.preventDefault()),s.addEventListener("blur",m),s.addEventListener("keydown",c=>{c.key==="Escape"&&(c.stopPropagation(),m())})}function o(){d()?S():m()}function m(){a&&k(!1,e,"","search")}function d(){return n.style.display.length===0?!(i.offsetHeight===0||x(I.SITE_MAX_WIDTH_MOBILE)&&i.querySelector(".navbar-container-mobile-top").offsetHeight===0&&i.querySelector(".navbar-container-mobile-up").offsetHeight===0):!1}function S(){f(),k(!0,t,"flex","close"),s.focus(),s.setSelectionRange(9999,9999)}function k(c,b,j,Fe){a=c,document.dispatchEvent(b),n.style.display=j,document.querySelectorAll("div.nav-search-toggle span").forEach(Ne=>Ne.textContent=Fe),a?document.getElementById("playback-controls").classList.add("hide"):document.getElementById("playback-controls").classList.remove("hide")}function f(){let c={};if(x(I.SITE_MAX_WIDTH_MOBILE))r.offsetHeight!==0?c.top=r.offsetTop:c.top=i.querySelector(".navbar-container-mobile-up").offsetTop,c=new DOMRect(63,c.top+3,document.body.clientWidth-60,30);else if(r.offsetHeight!==0){let b=r.getBoundingClientRect();c=new DOMRect(b.left,b.top+7,b.right,b.height-15)}else{let b=i.querySelector(".navbar-container").getBoundingClientRect();c=new DOMRect(b.left+88,b.top,b.right-90,b.height-1)}n.style.left=`${c.left}px`,n.style.top=`${c.top}px`,n.style.width=`${c.width-c.left}px`,n.style.height=`${c.height}px`}},M=st();var De=E("index"),u={siteHeader:null,introBanner:null,siteContent:null,siteContentSearch:null,fullscreenTarget:null};document.addEventListener("DOMContentLoaded",()=>{De.log("DOMContentLoaded"),rt(),u.introBanner!==null&&lt(),document.getElementById("termlist-container")!==null&&qe(),u.siteContentSearch!==null&&(u.siteContentSearch.focus(),u.siteContentSearch.setSelectionRange(9999,9999)),ct(),ue()});function rt(){De.log("initIndex()"),u.siteHeader=document.getElementById("site-header"),u.introBanner=document.getElementById("intro-banner"),u.siteContent=document.getElementById("site-content"),u.siteContentSearch=document.querySelector("#site-content form input.search-field"),Se(),M.init(),A.init(),J.addEventListener(),ut.addEventListener(),document.addEventListener("fullscreenElement",e=>u.fullscreenTarget=e.fullscreenTarget),document.addEventListener("keydown",at)}document.addEventListener("settingsUpdated",()=>{me(),Ee(),_(p.UF_GALLERY_PER_PAGE,g.gallery.tracksPerPage,X*5),_(p.UF_PREFERRED_PLAYER,g.playback.preferredPlayer,X*5)});function at(e){if(e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"Escape":A.isVisible()&&(e.preventDefault(),A.toggle());return}if(g.site.keyboardShortcuts&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1)switch(e.key){case"c":case"C":W()&&(e.preventDefault(),A.toggle());break;case"L":W()&&Be()&&(V.toggle(e),J.trigger());break;case"s":case"S":W()&&ot()&&(e.preventDefault(),M.toggle());break;case"T":W()&&Be()&&K.toggle(e);break;case"ArrowLeft":e.shiftKey&&$()&&(e.preventDefault(),T(L.prevPage));break;case"ArrowRight":e.shiftKey&&$()&&(e.preventDefault(),T(L.nextPage));break}}function W(){return M.isVisible()===!1&&u.siteContentSearch!==document.activeElement}function Be(){return document.body.classList.contains("page-settings")===!1}function ot(){return u.fullscreenTarget===null}function lt(){he("localStorage")&&bannerProperty&&g.banners[bannerProperty]&&(u.introBanner.style.display="block",J.trigger(),U("#intro-banner .intro-banner-close-button","click",()=>{u.introBanner.style.display="",u.siteContent.style.marginTop="",g.banners[bannerProperty]=!1}))}function ct(){if(document.querySelector(".navbar-title .go-back-to")!==null){let e="";if(document.referrer.length===0)e="Previous Page";else{let t=new URL(decodeURIComponent(document.referrer));if(t.search.length!==0)e="Search Results";else if(t.pathname.length>1){let i=t.pathname.slice(-1)==="/"?1:0,n=t.pathname.slice(1,t.pathname.length-i).replace(/-/gi," ").split("/");n.forEach((s,r)=>{e+=r+1<n.length?s+" / ":s})}}document.querySelectorAll("#site-navigation .navbar-title").forEach(t=>{t.querySelector(".go-back-title").textContent=e.length>0?e:"Ultrafunk (home)",t.querySelector(".go-back-to").style.opacity=1})}}var J=(()=>{let e=0;return{getSiteHeaderYOffset(){return e},addEventListener:t,trigger:i};function t(){i(),window.addEventListener("resize",i)}function i(){let n=0;$()?n=w("--site-header-height-no-playback"):n=w("--site-header-height"),e=Math.round(n>150?n/2:n/3),u.introBanner!==null&&u.introBanner.style.display.length!==0&&(u.introBanner.style.marginTop=`${n}px`,u.siteContent.style.marginTop=`${w("--site-content-margin-top",document.body)}px`)}})(),ut=(()=>{let e=0,t=0,i=0,n=!1,s=44;return{addEventListener:r};function r(){a(),window.addEventListener("scroll",a)}function a(){let d=window.pageYOffset;d===0&&l(),d>e?(i+=d-e,i>s&&d>J.getSiteHeaderYOffset()&&(t=0,o())):(t+=e-d,t>s&&(i=0,m())),e=d}function l(){u.siteHeader.classList.remove("sticky-nav-down","sticky-nav-up"),u.siteHeader.classList.add("hide-nav-menu"),M.hide(),A.scrolledTop()}function o(){n===!1&&(n=!0,H(u.siteHeader,"sticky-nav-up","sticky-nav-down"),M.hide())}function m(){n===!0&&(n=!1,H(u.siteHeader,"sticky-nav-down","sticky-nav-up"))}})();
//# sourceMappingURL=index.js.map
