import{$ as qe,A as kt,Aa as Xe,Ba as _t,C as T,Ca as F,D as fe,Da as Mt,E as me,Ea as xt,F as Tt,Fa as G,G as I,Ga as wt,H as ft,Ha as Vt,I as mt,Ia as Bt,J as bt,Ja as $t,K as Pt,La as Kt,M as At,Ma as Le,N as oe,Na as Ft,Oa as W,Pa as w,Qa as Gt,R as St,Ra as Z,S as K,Sa as Wt,T as Ct,Ta as qt,Ua as Je,Va as Ht,Wa as ie,Xa as Xt,Ya as Jt,Z as Lt,Za as ce,a as gt,b as Ge,ba as be,c as d,ca as ht,d as S,da as s,e as C,ea as E,f as We,fa as y,g as $,ga as f,h as Ee,ha as He,i as A,ia as Dt,j as ke,ja as Pe,k as Et,ka as Ae,la as It,ma as V,na as v,oa as m,p as Te,pa as vt,q as z,qa as Q,ra as Se,sa as x,ta as Ce,ua as Nt,va as Ut,wa as Yt,xa as le,y as D,ya as Rt,z as l,za as Ot}from"../chunk-PWADS3TO.js";var je=A("eventlogger"),u={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},p={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},Ra={eventSource:u.UNKNOWN,eventType:p.UNKNOWN,uId:null,timeStamp:0},L,ue,q,O,he=class{constructor(t=10){S(this,L,[]);S(this,ue,0);S(this,q,0);S(this,O,0);C(this,ue,t)}add(t,a,n,c=Date.now()){let P=Object.create(Ra);P.eventSource=t,P.eventType=a,P.uId=n,P.timeStamp=c,d(this,L).length<d(this,ue)?d(this,L).push(P):(d(this,L).shift(),d(this,L).push(P))}clear(){C(this,L,[])}getLastPos(){return d(this,O)}initMatch(){C(this,O,d(this,L).length-1),C(this,q,0)}matchesEvent(t,a,n,c=null){d(this,L)[d(this,O)-t].eventSource===a&&d(this,L)[d(this,O)-t].eventType===n&&d(this,L)[d(this,O)-t].uId===c&&We(this,q)._++}matchesDelta(t,a){d(this,L)[d(this,O)].timeStamp-d(this,L)[d(this,O)-t].timeStamp<=a&&We(this,q)._++}isPatternMatch(t,a){return d(this,q)===t?(je.log(`MATCH for: ${a}`),je.logEventLog(d(this,L),u,p),!0):!1}};L=new WeakMap,ue=new WeakMap,q=new WeakMap,O=new WeakMap;var De=class extends he{doubleClicked(t,a,n){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,n)),this.isPatternMatch(3,`${je.getKeyForValue(u,t)} Double Clicked`)}},ee=class extends he{ytAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesEvent(1,u.YOUTUBE,p.STATE_BUFFERING,t),this.matchesEvent(0,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,u.ULTRAFUNK,p.CROSSFADE_START,null),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var st={};gt(st,{getStatus:()=>xe,init:()=>Tr,nextTrack:()=>rt,prevTrack:()=>ca,toggleMute:()=>ua,togglePlayPause:()=>Me});var H,te,ae=class{constructor(){S(this,H,-1);S(this,te,0);Ge(this,"isVisible",!0);Ge(this,"config",{updateTimerInterval:250,maxBufferingDelay:3})}init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}updateTimer(){}start(){this.stop(),C(this,H,setInterval(()=>this.updateTimer(),this.config.updateTimerInterval))}stop(){d(this,H)!==-1&&(clearInterval(d(this,H)),C(this,H,-1)),C(this,te,0),Se(!1)}updateTimeRemainingWarning(t,a){if(l.playback.autoplay===!1&&l.playback.timeRemainingWarning&&d(this,te)!==t){let n=a-t;C(this,te,t),n<=l.playback.timeRemainingSeconds?(Se(!0),y(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:n})):Se(!1)}}};H=new WeakMap,te=new WeakMap;var X,de,ve,jt,pe,Qe,Ne,zt,Ze=class extends ae{constructor(){super(...arguments);S(this,ve);S(this,pe);S(this,Ne);S(this,X,null);S(this,de,null)}init(a,n){super.init(),C(this,X,a),C(this,de,n)}updateTimer(){(this.isVisible||$(this,pe,Qe).call(this))&&d(this,X).current.getPosition((a,n)=>$(this,ve,jt).call(this,a,n))}},ze=Ze;X=new WeakMap,de=new WeakMap,ve=new WeakSet,jt=function(a,n=0){let c=Math.round(a/1e3);V(a,c,n),c>0&&n>0&&(Ee(Ze.prototype,this,"updateTimeRemainingWarning").call(this,c,n),$(this,Ne,zt).call(this,c,n))},pe=new WeakSet,Qe=function(){return l.playback.autoplay&&l.gallery.autoCrossfade},Ne=new WeakSet,zt=function(a,n){l.playback.masterMute===!1&&$(this,pe,Qe).call(this)&&n-a===l.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&d(this,X).getCurrentTrack()+1<=d(this,X).getNumTracks()&&d(this,de).call(this,me.AUTO,{name:"Auto Crossfade",length:l.gallery.autoCrossfadeLength,curve:l.gallery.autoCrossfadeCurve})};var Y=new ze;var b=A("embedded-players"),_=new ee(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},_a={maxPlaybackStartDelay:3};function Zt(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),wa(),Xa()}function Ue(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function ea(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):y(s.PLAYBACK_LOADING,Ue())}function Ma(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),n=t.querySelector("iframe"),c=null;if(a===I.YOUTUBE)e.length===1&&n===null?c=Qt("youtube-player",t,!0):c=Qt(n.id,t,!1);else if(a===I.SOUNDCLOUD){let P=SC.Widget(n.id);c=new mt(t.id,n.id,P,n.src),P.bind(SC.Widget.Events.READY,()=>{c.setThumbnail(t),P.getDuration(M=>c.setDuration(Math.round(M/1e3))),Ja(c,n.id)}),P.bind(SC.Widget.Events.PLAY,ja),P.bind(SC.Widget.Events.PAUSE,za),P.bind(SC.Widget.Events.FINISH,Qa),P.bind(SC.Widget.Events.ERROR,Za)}c!==null&&(c.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(c))})}function Qt(e,t,a=!1){let n=t.getAttribute("data-track-source-uid"),c=new YT.Player(e,{events:{onReady:M=>Va(M,e),onStateChange:M=>Ba(M,e),onError:M=>Ha(M,e)},...a&&{videoId:n}}),P=new ft(t.id,e,c,n);return P.setDuration(parseInt(t.getAttribute("data-track-duration"))),P}function Re(e,t){b.log("onPlayerError()"),b.log(e);let a=e.getTrackType()===I.YOUTUBE?u.YOUTUBE:u.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),_.add(a,p.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,xa(e,t))}function xa(e,t){let a=e.getArtist()||"N/A",n=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),mediaTitle:`${a} - ${n}`,mediaUrl:t}}function wa(){b.log("initYouTubeAPI()"),y(s.PLAYBACK_LOADING,Ue()),window.onYouTubeIframeAPIReady=function(){b.log("onYouTubeIframeAPIReady()"),y(s.PLAYBACK_LOADING,Ue()),Ma()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Va(e,t){let a=i.players.playerFromUid(t);b.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),e.target.getPlayerState()===-1&&a.setIsPlayable(!1),ea()}function Ba(e,t){switch(_.add(u.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:$a(t);break;case YT.PlayerState.BUFFERING:Ka(t);break;case YT.PlayerState.PLAYING:Fa(t);break;case YT.PlayerState.PAUSED:Ga(t);break;case YT.PlayerState.CUED:Wa(t);break;case YT.PlayerState.ENDED:qa(t);break}}function $a(e){b.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),_.ytAutoplayBlocked(e,3e3)&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function Ka(e){if(b.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(l.playback.masterMute),t.setVolume(l.playback.masterVolume),y(s.MEDIA_LOADING)}}function Fa(e){b.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.sync(e,i.playbackState.STATE.PLAY),Y.start()}function Ga(e){b.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),Y.stop()):i.players.crossfade.stop()}function Wa(e){b.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`);let t=i.players.playerFromUid(e);"isNextSingleTrackCued"in t&&t.isNextSingleTrackCued&&(delete t.isNextSingleTrackCued,t.embedded.getDuration()===0&&t.setIsPlayable(!1),b.log(`onYouTubePlayerStateChange: CUED      Duration: ${Ct(t.embedded.getDuration())} - isPlayable: ${t.isPlayable()}`))}function qa(e){b.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(Y.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Ha(e,t){let a=i.players.playerFromUid(t);e.data!==null&&a.isPlayable()?(b.log("onYouTubePlayerError: "+e.data),a.setIsPlayable(!1),Re(a,e.target.getVideoUrl())):b.warn(`onYouTubePlayerError(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - "${a.getTitle()}"
No YouTube API error given! ((event.data === null) && (isPlayable === false))`)}function Xa(){b.log("initSoundCloudAPI()"),y(s.PLAYBACK_LOADING,Ue())}function Ja(e,t){b.log(`onSCPlayerEventReady(): ${t} => ${e.getUid()} => ${e.getArtist()} - ${e.getTitle()}`),ea()}function ja(e){b.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),_.add(u.SOUNDCLOUD,p.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?_.scPlayDoubleTrigger(e.soundId,_a.maxPlaybackStartDelay*1e3)&&i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(l.playback.masterMute),i.players.current.setVolume(l.playback.masterVolume)),Y.start()}function za(e){b.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),_.add(u.SOUNDCLOUD,p.STATE_PAUSED,e.soundId),_.scAutoplayBlocked(e.soundId,3e3)?(Y.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):_.scWidgetPlayBlocked(e.soundId,3e4)?(Y.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.sync(e.soundId,i.playbackState.STATE.PAUSE),Y.stop())}):i.players.crossfade.stop()}function Qa(e){b.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(Y.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Za(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);b.log(`onSoundCloudPlayerEvent: ERROR for track: ${i.players.trackFromUid(e.id)}. ${t.getArtist()} - ${t.getTitle()} - [${t.getUid()} / ${t.getIframeId()}]`),t.setIsPlayable(!1)})}var R=A("gallery-events"),Oe={snackbarId:0,nowPlayingIcons:null},tt={nowPlayingIconsSelector:"h2.track-title"};function ta(){R.log("init()"),Oe.nowPlayingIcons=document.querySelectorAll(tt.nowPlayingIconsSelector),E(s.MEDIA_PLAYING,tr),E(s.MEDIA_PAUSED,ar),E(s.MEDIA_ENDED,rr),E(s.MEDIA_CUE_NEXT,sr),E(s.CONTINUE_AUTOPLAY,nr),E(s.RESUME_AUTOPLAY,or),E(s.AUTOPLAY_BLOCKED,lr),E(s.PLAYBACK_BLOCKED,ir),E(s.MEDIA_UNAVAILABLE,cr)}function tr(e){if(R.log(e),fe(Oe.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${tt.nowPlayingIconsSelector}`);aa(t),K(t,"playing-paused","now-playing-icon"),l.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function ar(e){R.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${tt.nowPlayingIconsSelector}`).classList.add("playing-paused")}function rr(e){R.log(e),e!==null&&e.data.numTracks>1&&aa()}function sr(e){R.log(e),e.data.scrollToMedia&&w(e.data.trackId)}function nr(e){R.log(e),ie()&&e.data.trackType===I.YOUTUBE?ce(!0):W(D.nextPage,!0)}function or(e){let t=JSON.parse(sessionStorage.getItem(z.UF_AUTOPLAY));if(sessionStorage.removeItem(z.UF_AUTOPLAY),R.log(e),R.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function lr(e){R.log(e),Oe.snackbarId=T("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function ir(e){R.log(e),T("Unable to play track, skipping to next",5,"Stop",()=>{},()=>et(e))}function cr(e){R.log(e),ur(e.data.trackId)?T("YouTube Premium track, skipping",5,"help",()=>window.location.href="/channel/premium/",()=>et(e)):(T("Unable to play track, skipping to next",5,"Stop",()=>{},()=>et(e)),ke("EVENT_MEDIA_UNAVAILABLE",e.data))}function aa(e){Oe.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function et(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):ie()?ce(l.playback.autoplay):D.nextPage!==null&&W(D.nextPage,!0)}function ur(e){let t=document.getElementById(e);return t!==null?t.classList.contains("uf_channel-premium"):!1}var at=A("crossfade-controls"),_e={players:{}},N={},J={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function sa(e,t){at.log("init()"),_e.players=e,N.crossfadePreset=He(J.crossfadePresetSelector),N.crossfadeTo=He(J.crossfadeToSelector),N.crossfadePreset.length>1&&N.crossfadeTo.length>1&&(N.crossfadePreset.forEach(a=>na(a,l.gallery.trackCrossfadeDefPreset)),N.crossfadeTo.clickCallback=t),E(s.PLAYBACK_READY,pr)}function pr(){at.log("playbackReady()"),N.crossfadePreset.length>1&&N.crossfadeTo.length>1&&(N.crossfadePreset.forEach(e=>{e.addEventListener("click",yr),K(e,f.DISABLED.CLASS,f.ENABLED.CLASS)}),N.crossfadeTo.forEach(e=>e.addEventListener("click",gr)),E(s.MEDIA_PLAYING,ra),E(s.MEDIA_PAUSED,ra))}function na(e,t){e.setAttribute(J.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${Te.crossfade[t].name}`}function yr(e){let t=parseInt(e.target.getAttribute(J.crossfadePresetData));na(e.target,t+1<Te.crossfade.length?t+1:0)}function gr(e){if(m()&&_e.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),n=parseInt(t.querySelector(J.crossfadePresetSelector).getAttribute(J.crossfadePresetData));K(t.querySelector(`div${J.crossfadeToSelector}`),f.ENABLED.CLASS,f.DISABLED.CLASS),N.crossfadeTo.clickCallback(_e.players.uIdFromIframeId(a.id),Te.crossfade[n])}}}function ra(){let e=m(),t=e?_e.players.getTrackData().currentTrack:-1;at.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),N.crossfadeTo.forEach((a,n)=>{t===n+1?K(a,e?f.ENABLED.CLASS:f.DISABLED.CLASS,e?f.DISABLED.CLASS:f.ENABLED.CLASS):K(a,e?f.DISABLED.CLASS:f.ENABLED.CLASS,e?f.ENABLED.CLASS:f.DISABLED.CLASS)})}var oa=A("gallery-players"),la=()=>{let e=null,t=null,a=[],n=new Map,c=0;return{indexMap:n,get crossfade(){return t},get current(){return a[c]},get next(){return a[c+1]},getPlayerIndex(){return c},setPlayerIndex(k){c=k},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return c+1},playerFromUid(k){return a[n.get(k)]},trackFromUid(k){return n.get(k)+1},isCurrent(k){return k===this.current.getUid()},init:P,add:M,uIdFromIframeId:La,stop:ha,mute:Da,getTrackData:Ia,prevTrack:va,nextTrack:Na,jumpToTrack:Ua};function P(k){oa.log("init()"),e=k,t=Tt(this),E(s.MEDIA_PLAYING,()=>t.start()),E(s.MEDIA_PAUSED,()=>t.stop())}function M(k){oa.log(k),a.push(k),n.set(k.getUid(),a.length-1)}function La(k){return a.find(Fe=>Fe.getIframeId()===k).getUid()}function ha(){this.current.stop(),t.stop()}function Da(){this.current.mute(l.playback.masterMute),t.mute(l.playback.masterMute)}function Ia(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function va(k){return c>0?(c--,e(k),!0):!1}function Na(k){return c++,c<this.getNumTracks()?(e(k),!0):!1}function Ua(k,Fe,Ya=!0){return k>0&&k<=this.getNumTracks()?(c=k-1,e(Fe,Ya),!0):!1}};var h=A("gallery-playback"),r={eventLog:null,players:{}},ia={minCrossfadeToTime:5,maxBufferingDelay:3};function Tr(){h.log("init()"),r.eventLog=_,ta(),r.players=la(),r.players.init(da),Pe(r.players,mr),sa(r.players,Sr),Y.init(r.players,ya),Zt(r.players,Lr,Cr)}function Me(){m()?(Q(),r.players.current.pause()):(vt(),r.players.current.play(Re))}function ca(){h.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),V(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(m())?v():y(s.MEDIA_PREV_TRACK))})}function rt(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();h.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${l.playback.autoplay}`),!fr(e,t)&&(t===!1?(r.players.stop(),e&&l.playback.autoplay===!1?Q():r.players.nextTrack(m())&&v()):t===!0&&e===!1?y(s.MEDIA_NEXT_TRACK):e&&(Q(),l.playback.autoplay?y(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function fr(e,t){if(e&&l.playback.autoplay){let a=Ce();if(h.log(`repeatPlayback(): ${h.getKeyForValue(x,a)}`),a===x.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===x.ALL)return r.players.stop(),r.players.setPlayerIndex(0),da(!0),!0}return!1}function mr(e){r.players.current.seekTo(e)}function ua(){l.playback.masterMute=l.playback.masterMute!==!0,r.players.mute()}function br(e,t=!0){h.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),y(s.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),v()}function da(e,t=!0){y(s.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(Re)}function pa(e,t=!0){h.log(`skipToTrack(): ${e} - ${t}`),t===!0&&m()===!1&&(r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),r.players.jumpToTrack(e,t)&&v())}function Pr(e,t=null){h.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?pa(r.players.trackFromUid(t),!0):br(t):e.autoplay&&(r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),Me())}function Ar(e,t,a=!1){h.log(`cueOrPlayNextSingleTrackById() - playMedia: ${a}`),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),It(0),v(),a?(r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),r.players.current.playTrackById(t.uid)):(r.players.current.cueTrackById(t.uid),r.players.current.isNextSingleTrackCued=!0)}function xe(){return{isPlaying:m(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function Sr(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(h.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),l.playback.masterMute===!1&&l.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=ia.minCrossfadeToTime+ia.maxBufferingDelay&&ya(me.TRACK,t,e)}))}function ya(e,t,a=null){r.eventLog.add(u.ULTRAFUNK,p.CROSSFADE_START,null),r.players.crossfade.init(e,t,a)!==null&&v()}function Cr(e,t=null){switch(h.log(`embeddedEventHandler() - event: ${h.getKeyForValue(s,e)}`),t!==null&&h.log(t),e){case s.MEDIA_ENDED:y(s.MEDIA_ENDED,xe()),rt(!0);break;case s.PLAYBACK_READY:Ae(ca,Me,rt,ua),Jt(Ar),y(s.PLAYBACK_READY,t),y(s.RESUME_AUTOPLAY,null,{resumeAutoplay:Pr});break;case s.AUTOPLAY_BLOCKED:y(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:Me});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:y(e,t,{skipToTrack:pa});break}}var Lr=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(n,c){h.log(`playbackState.sync() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(n)+1} - syncState: ${h.getKeyForValue(e,c)}`),r.players.isCurrent(n)?c===e.PLAY?y(s.MEDIA_PLAYING,xe()):c===e.PAUSE&&y(s.MEDIA_PAUSED,xe()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(n)),v(),a(n,c))}}})();var dt={};gt(dt,{getStatus:()=>Ur,init:()=>Dr,nextTrack:()=>Ta,prevTrack:()=>ka,toggleMute:()=>it,togglePlayPause:()=>ut});var re,we,ga,lt=class extends ae{constructor(){super(...arguments);S(this,we);S(this,re,null)}ready(a){super.init(),C(this,re,a),E(s.MEDIA_PLAYING,()=>super.start())}updateTimer(){this.isVisible&&m()&&$(this,we,ga).call(this,d(this,re).embedded.getCurrentTime(),d(this,re).getDuration())}},nt=lt;re=new WeakMap,we=new WeakSet,ga=function(a,n){if(a!==void 0){let c=Math.round(a);V(a*1e3,c,n),c>0&&n>0&&Ee(lt.prototype,this,"updateTimeRemainingWarning").call(this,c,n)}};var ot=new nt;var U=A("list-playback"),se=new ee(10),o={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},ct=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function Dr(){U.log("init()"),Ut(j),Ir()!==null?Yr():T("No playable YouTube tracks!",0,"help",()=>be("No playable tracks",ct))}function Ir(){if(o.currentTrackId=F(),o.autoplayData=JSON.parse(sessionStorage.getItem(z.UF_AUTOPLAY)),sessionStorage.removeItem(z.UF_AUTOPLAY),o.currentTrackId!==null){if(o.autoplayData!==null&&o.autoplayData.trackId!==null){let e=o.autoplayData.trackId.match(Pt);if(e!==null){let t=le(`[data-track-source-uid="${e[0]}"]`);t!==null&&(o.currentTrackId=t.id)}else if(o.autoplayData.trackId.match(/^track-(?!0)\d{1,9}$/i)!==null){let t=le(`[data-track-id="${o.autoplayData.trackId}"]`);t!==null?Xe(t)===I.YOUTUBE?o.currentTrackId=t.id:T("Cannot play SoundCloud track",5,"help",()=>be("Cannot play SoundCloud track",ct)):T("Unable to cue track (not found)",5)}}Mt(o.currentTrackId)}return U.log(`cueInitialTrack() - currentTrackId: ${o.currentTrackId} - autoplayData: ${o.autoplayData!==null?JSON.stringify(o.autoplayData):"N/A"}`),o.currentTrackId}function j(e,t=!0,a=!1){let n=Xe(Ot(e));if(U.log(`setCurrentTrack() - nextTrackType: ${U.getKeyForValue(I,n)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),n===I.SOUNDCLOUD&&a){T("Cannot play SoundCloud track",5,"help",()=>be("Cannot play SoundCloud track",ct));return}e===o.currentTrackId?ut():(m()&&o.player.embedded.stopVideo(),o.currentTrackId=e,y(s.MEDIA_CUE_NEXT,{nextTrackId:e,isPointerClick:a}),Ea(t))}function Ea(e){let t=Vt();e?(o.player.embedded.loadVideoById(t),G(f.PLAYING),v()):(o.player.embedded.cueVideoById(t),G(f.PAUSED))}function ut(){o.currentTrackId===null?j(le("div.track-entry.current").id):m()?o.player.embedded.pauseVideo():o.player.play(Ve)}function it(e=!1){e===!1&&(l.playback.masterMute=l.playback.masterMute!==!0),l.playback.masterMute?o.player.embedded.mute():o.player.embedded.unMute()}function ka(){let e=_t(),t=o.player.embedded.getCurrentTime();e!==null&&t<=5?(j(e,m()),v()):t!==0&&(o.player.embedded.seekTo(0),V(0,0,o.player.getDuration()))}function Ta(){let e=F();e!==null&&(j(e,m()),v())}async function fa(e=!1,t=!1){let a=t?x.OFF:Ce(),n=F();if(U.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${n} - repeatMode: ${U.getKeyForValue(x,a)}`),e&&a===x.ONE)o.player.embedded.seekTo(0),o.player.play(Ve);else if(e&&n===null&&a===x.ALL)j(F(null)),w(0);else if(n===null)if(l.list.showLoadMoreTracks){let c=await xt();e&&c&&j(F())}else W(D.nextPage,e);else e?j(n):G(f.PAUSED)}function vr(){m()===!1&&o.autoplayData!==null&&(se.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),se.add(u.YOUTUBE,-1,F())),m()===!1&&fa(!0,!0)}function Nr(){o.currentTrackId=null,G(f.PAUSED)}function Ur(){let e=le("div.track-entry.current");if(e!==null){let t=Rt("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:m(),currentTrack:a+1,trackType:I.YOUTUBE,position:Math.ceil(o.player.embedded.getCurrentTime()),numTracks:1,trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function Yr(){U.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){U.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:Rr,onStateChange:Or,onError:Ve}});o.player=new bt(a),U.log(o.player),Pe(o.player,n=>o.player.embedded.seekTo(n)),y(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Rr(){U.log("onYouTubePlayerReady()"),o.autoplayData?.autoplay===!0&&se.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),Ae(ka,ut,Ta,it),y(s.PLAYBACK_LOADING,{loadingPercent:66}),ot.ready(o.player),Yt(o.player),it(!0),y(s.PLAYBACK_READY,{resetProgressBar:!1}),Ea(o.autoplayData?.autoplay===!0)}function Or(e){switch(U.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${o.currentTrackId}`),se.add(u.YOUTUBE,e.data,o.currentTrackId),e.data!==YT.PlayerState.PLAYING&&Q(),e.data){case YT.PlayerState.UNSTARTED:_r();break;case YT.PlayerState.CUED:o.player.setPlayerState(e.data);break;case YT.PlayerState.BUFFERING:y(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:Mr(),y(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:G(f.PAUSED);break;case YT.PlayerState.ENDED:ot.stop(),y(s.MEDIA_ENDED),fa(l.playback.autoplay);break}}function _r(){se.ytAutoplayBlocked(o.currentTrackId,3e3)&&(G(f.PAUSED),o.currentSnackbarId=T("Autoplay blocked, Play to continue",0,"play",()=>o.player.play(Ve))),o.playerReady===!1&&(o.playerReady=!0,y(s.PLAYBACK_LOADING,{loadingPercent:0}))}function Mr(){fe(o.currentSnackbarId),o.firstStatePlaying&&(o.firstStatePlaying=!1,o.autoplayData=null,setTimeout(()=>{l.playback.autoplay&&m()&&Math.round(window.pageYOffset)<=1&&St(At.SITE_MAX_WIDTH_MOBILE)&&w(0)},6e3))}function Ve(e){U.log(`onYouTubePlayerError(): ${e.data} - trackId: ${o.currentTrackId}`),wt("Error!"),se.add(u.YOUTUBE,p.PLAYER_ERROR,o.currentTrackId),T("Unable to play track, skipping to next",5,"Stop",Nr,vr),ke("EVENT_MEDIA_UNAVAILABLE",{mediaUrl:o.player.embedded.getVideoUrl(),mediaTitle:`${o.player.getArtist()} - ${o.player.getTitle()}`})}var $e=A("screen-wakelock"),Be={wakeLock:null};function ma(){l.mobile.keepScreenOn&&document.addEventListener("click",ba)}function ba(){$e.log("enableScreenWakeLock()"),document.removeEventListener("click",ba),wr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&l.mobile.keepScreenOn&&xr()})}function xr(){Pa()&&Be.wakeLock===null&&Aa()}function Pa(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function wr(){Pa()?document.visibilityState==="visible"&&await Aa()!==!0&&($e.log("enableWakeLock(): Screen Wake Lock request failed"),T("Keep Screen On failed",5,"Disable",()=>l.mobile.keepScreenOn=!1)):($e.log("enableWakeLock(): Screen Wake Lock is not supported"),T("Keep Screen On is not supported",5,"Disable",()=>l.mobile.keepScreenOn=!1))}async function Aa(){try{return Be.wakeLock=await navigator.wakeLock.request("screen"),Be.wakeLock.addEventListener("release",()=>{Be.wakeLock=null}),!0}catch(e){$e.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var ye=A("playback-interaction"),Sa=new De(10),g={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null},Vr={doubleClickDelay:500};document.addEventListener("DOMContentLoaded",()=>{Et(),ye.log("DOMContentLoaded"),kt(),Bt()?g.player=st:$t()&&(g.player=dt),g.player!==null&&Br(),Ht(g.player?.getStatus)});function Br(){ye.log("initShared()"),Dt(),$r(),g.player.init(),g.siteNavUiElements=new pt("#site-navigation"),g.trackNavUiElements=new yt("nav.single-track-nav .nav-links"),Z.init(),g.keyboardShortcuts=Lt(l.playback.keyboardShortcuts),Kr(),ma()}function $r(){E(s.PLAYBACK_READY,Hr),E(s.MEDIA_CUE_NEXT,Ca),E(s.MEDIA_ENDED,Ca),E(s.MEDIA_TIME_REMAINING,Xr),E(s.MEDIA_PREV_TRACK,()=>ne(null,D.prevPage)),E(s.MEDIA_NEXT_TRACK,()=>Ke(null))}function Kr(){oe(".playback-shuffle-control span","click",Ft),document.addEventListener("keydown",Fr),document.addEventListener("keydown",Gr),window.addEventListener("blur",Jr)}function Fr(e){if(g.isPlaybackReady&&g.keyboardShortcuts.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1){switch(e.code){case"Backquote":e.preventDefault(),w(g.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),g.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":Gt(e);break;case"ArrowLeft":Wr(e);break;case"ArrowRight":qr(e);break;case"A":Je.toggle();break;case"f":case"F":e.preventDefault(),Z.toggle(document.getElementById(g.player.getStatus().iframeId));break;case"m":case"M":e.preventDefault(),g.player.toggleMute(),T(l.playback.masterMute?"Volume is muted (<b>m</b> to unmute)":"Volume is unmuted (<b>m</b> to mute)",3);break;case"p":case"P":Wt.toggle();break;case"r":case"R":T(`${Nt().title} (<b>r</b> to change)`,3);break;case"x":case"X":qt.toggle();break}}}function Gr(e){if(g.isPlaybackReady&&g.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":ht===!1&&(ye.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),g.player.togglePlayPause());break;case"MediaTrackPrevious":ye.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),g.player.prevTrack();break;case"MediaTrackNext":ye.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),g.player.nextTrack();break}}function Wr(e){e.preventDefault(),e.shiftKey===!0?ne(null,D.prevPage):g.player.prevTrack()}function qr(e){e.preventDefault(),e.shiftKey===!0?Ke(null):g.player.nextTrack()}function Ke(e){e?.preventDefault(),ie()?g.player.getStatus().trackType===I.YOUTUBE?Xt()===!1?ce(g.player.getStatus().isPlaying):T("Loading next track, please wait...",3):ne(null,D.nextPage):ne(null,D.nextPage)}function Hr(){oe(".playback-details-control","click",jr),oe(".playback-thumbnail-control","click",zr),oe(".playback-timer-control","click",Qr),g.isPlaybackReady=!0}function Ca(){l.playback.autoExitFullscreen&&Z.exit()}function Xr(e){l.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=l.playback.timeRemainingSeconds&&Z.exit()}function Jr(){Le()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function jr(){w(g.player.getStatus().trackId),Le()&&l.list.showUpNextModal?ge("showUpNextModalHint","<b>Tip:</b> Click or tap Artist &amp; Title to show Up Next queue"):ge("showTrackDetailsHint","<b>Tip:</b> Click or tap Artist &amp; Title to show current track")}function zr(){Kt()?(Sa.add(u.MOUSE,p.MOUSE_CLICK,null),ge("showGalleryTrackThumbnailHint","<b>Tip:</b> Double click or tap Track Thumbnail for full screen"),Sa.doubleClicked(u.MOUSE,p.MOUSE_CLICK,Vr.doubleClickDelay)&&Z.enter(document.getElementById(g.player.getStatus().iframeId))):Le()&&(w(0),ge("showListTrackThumbnailHint","<b>Tip:</b> Click or tap Track Thumbnail to show player"))}function Qr(){Je.toggle(),ge("showTrackTimerHint","<b>Tip:</b> Click or tap Track Timer to toggle Autoplay On / Off")}var pt=class extends qe{elementClicked(){if(this.clicked("a.navbar-prev-link"))return ne(this.event,D.prevPage);if(this.clicked("a.navbar-next-link"))return Ke(this.event)}},yt=class extends qe{elementClicked(){if(this.clicked("div.nav-previous a"))return ne(this.event,D.prevPage);if(this.clicked("div.nav-next a"))return Ke(this.event)}};function ge(e,t,a=0){l.tips[e]&&(T(t,a),l.tips[e]=!1)}function ne(e,t){e?.preventDefault(),W(t,g.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
