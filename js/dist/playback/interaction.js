import{$ as ct,A as ue,B as de,C as B,D as pe,E as k,F as ze,G as z,H as _,I as Qe,J as ae,K as $,L as M,M as ye,N as Ze,O as et,P as tt,Q as re,R as at,S as rt,T as Ne,U as lt,V as F,W as nt,X as ot,Y as K,Z as st,_ as it,a as qe,b as T,c as se,ca as ge,da as ut,e as ie,ea as dt,f as X,ga as pt,ha as fe,ia as yt,ja as G,k as L,ka as w,l as o,la as gt,m as He,ma as Ee,na as ft,oa as Et,p as m,pa as Ue,q as ce,qa as kt,r as je,ra as Tt,s as Je,t as De,ta as mt,u as Xe,ua as W,v as l,va as Oe,w as y,x as g,y as E,ya as bt,z as ve,za as q}from"../chunk-4YI64GFX.js";var Re=T("eventlogger"),u={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},p={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},zt={eventSource:u.UNKNOWN,eventType:p.UNKNOWN,uId:null,timeStamp:0},Ye=class{constructor(t=10){this.log=[],this.maxEntries=t,this.lastPos=0,this.matchCount=0}add(t,a,s,c=Date.now()){let f=Object.create(zt);f.eventSource=t,f.eventType=a,f.uId=s,f.timeStamp=c,this.log.length<this.maxEntries?this.log.push(f):(this.log.shift(),this.log.push(f))}clear(){this.log=[]}initMatch(){this.lastPos=this.log.length-1,this.matchCount=0}matchesEvent(t,a,s,c=null){this.log[this.lastPos-t].eventSource===a&&this.log[this.lastPos-t].eventType===s&&this.log[this.lastPos-t].uId===c&&this.matchCount++}matchesDelta(t,a){this.log[this.lastPos].timeStamp-this.log[this.lastPos-t].timeStamp<=a&&this.matchCount++}isPatternMatch(t,a){return this.matchCount===t?(Re.log(`MATCH for: ${a}`),Re.logEventLog(this.log,u,p),!0):!1}},Me=class extends Ye{constructor(t){super(t)}doubleClicked(t,a,s){return this.initMatch(),this.lastPos>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,s)),this.isPatternMatch(3,`${Re.getObjectKeyForValue(u,t)} Double Clicked`)}},le=class extends Ye{constructor(t){super(t)}ytAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesEvent(1,u.YOUTUBE,p.STATE_BUFFERING,t),this.matchesEvent(0,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,u.ULTRAFUNK,p.CROSSFADE_START,null),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Fe={};qe(Fe,{getStatus:()=>Ae,init:()=>Ra,nextTrack:()=>$e,prevTrack:()=>Ot,toggleMute:()=>Rt,togglePlayPause:()=>Se});var Pt={updateTimerInterval:250,maxBufferingDelay:3},D=(()=>{let e=-1,t=0,a=!0,s=null,c=null,f=null;return{init:O,start:A,stop:J,updateCallback:P};function O(C,I,d){s=C,c=I,f=d,document.addEventListener("visibilitychange",()=>{a=document.visibilityState==="visible"})}function A(){J(!1),e=setInterval(()=>{a&&s.current.getPosition(P)},Pt.updateTimerInterval)}function J(C=!1){e!==-1&&(clearInterval(e),e=-1),C&&(P(0),g(l.MEDIA_ENDED,c())),t=0,_(!1)}function P(C,I=0){let d=Math.round(C/1e3);pe(C,d,I),d>0&&I>0&&(Y(d,I),V(d,I))}function Y(C,I){if(o.playback.autoplay===!1&&o.playback.timeRemainingWarning&&t!==C){let d=I-C;t=C,d<=o.playback.timeRemainingSeconds?(_(!0),g(l.MEDIA_TIME_REMAINING,{timeRemainingSeconds:d})):_(!1)}}function V(C,I){o.playback.masterMute===!1&&o.playback.autoplay&&o.gallery.autoCrossfade&&I-C===o.gallery.autoCrossfadeLength+Pt.maxBufferingDelay&&s.getCurrentTrack()+1<=s.getNumTracks()&&f(Ee.AUTO,{name:"Auto Crossfade",length:o.gallery.autoCrossfadeLength,curve:o.gallery.autoCrossfadeCurve})}})();var b=T("embedded-players"),R=new le(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},_e={youTubeIframeIdRegEx:/youtube-uid/i,soundCloudIframeIdRegEx:/soundcloud-uid/i,maxPlaybackStartDelay:3};function St(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),ta(),da()}function Te(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function At(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(l.READY,{resetProgressBar:!0}):g(l.LOADING,Te())}function Zt(){document.querySelectorAll("single-track").forEach(t=>{let a=t.querySelector("iframe"),s=null;if(_e.youTubeIframeIdRegEx.test(a.id)){let c=new YT.Player(a.id,{events:{onReady:aa,onStateChange:ra,onError:ua}});s=new Et(t.id,a.id,c,t.getAttribute("data-track-source-data"))}else if(_e.soundCloudIframeIdRegEx.test(a.id)){let c=SC.Widget(a.id);s=new Ue(t.id,a.id,c,a.src),c.bind(SC.Widget.Events.READY,()=>{s.setThumbnail(t.querySelector(".track-share-control span")),pa()}),c.bind(SC.Widget.Events.PLAY,ya),c.bind(SC.Widget.Events.PAUSE,ga),c.bind(SC.Widget.Events.FINISH,fa),c.bind(SC.Widget.Events.ERROR,Ea)}s!==null&&(s.setTitle(t.getAttribute("data-track-title")),s.setArtist(t.getAttribute("data-track-artist")),i.players.add(s))})}function me(e,t){b.log("onPlayerError()"),b.log(e);let a=e instanceof Ue?u.SOUNDCLOUD:u.YOUTUBE;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),R.add(a,p.PLAYER_ERROR,e.getUid()),i.embeddedEvent(l.MEDIA_UNAVAILABLE,ea(e,t))}function ea(e,t){let a=e.getArtist()||"N/A",s=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),mediaTitle:`${a} - ${s}`,mediaUrl:t}}function ta(){b.log("initYouTubeAPI()"),g(l.LOADING,Te()),window.onYouTubeIframeAPIReady=function(){b.log("onYouTubeIframeAPIReady()"),g(l.LOADING,Te()),Zt()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function aa(){b.log("onYouTubePlayerReady()"),At()}function ra(e){switch(R.add(u.YOUTUBE,e.data,e.target.h.id),e.data){case YT.PlayerState.UNSTARTED:la(e);break;case YT.PlayerState.BUFFERING:na(e);break;case YT.PlayerState.PLAYING:oa(e);break;case YT.PlayerState.PAUSED:sa(e);break;case YT.PlayerState.CUED:ia(e);break;case YT.PlayerState.ENDED:ca(e);break}}function la(e){b.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e.target.h.id})`),R.ytAutoplayBlocked(e.target.h.id,3e3)&&i.embeddedEvent(l.AUTOPLAY_BLOCKED)}function na(e){if(b.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e.target.h.id})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e.target.h.id);t.mute(o.playback.masterMute),t.setVolume(o.playback.masterVolume),g(l.MEDIA_LOADING)}}function oa(e){b.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e.target.h.id})`),i.playbackState.syncAll(e.target.h.id,i.playbackState.STATE.PLAY),i.players.current.setDuration(Math.round(e.target.getDuration())),D.start()}function sa(e){b.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e.target.h.id})`),i.players.isCurrent(e.target.h.id)?(i.playbackState.syncAll(e.target.h.id,i.playbackState.STATE.PAUSE),D.stop(!1)):i.players.crossfade.stop()}function ia(e){b.log(`onYouTubePlayerStateChange: CUED      (uID: ${e.target.h.id})`)}function ca(e){b.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e.target.h.id})`),i.players.isCurrent(e.target.h.id)?(D.stop(!0),i.embeddedEvent(l.MEDIA_ENDED)):i.players.crossfade.stop()}function ua(e){b.log("onYouTubePlayerError: "+e.data);let t=i.players.playerFromUid(e.target.h.id);t.setPlayable(!1),me(t,e.target.getVideoUrl())}function da(){b.log("initSoundCloudAPI()"),g(l.LOADING,Te())}function pa(){b.log("onSoundCloudPlayerEventReady()"),At()}function ya(e){b.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),R.add(u.SOUNDCLOUD,p.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?R.scPlayDoubleTrigger(e.soundId,_e.maxPlaybackStartDelay*1e3)&&i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(o.playback.masterMute),i.players.current.setVolume(o.playback.masterVolume)),i.players.current.getEmbeddedPlayer().getDuration(t=>{i.players.current.setDuration(Math.round(t/1e3)),D.start()})}function ga(e){b.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),R.add(u.SOUNDCLOUD,p.STATE_PAUSED,e.soundId),R.scAutoplayBlocked(e.soundId,3e3)?(D.stop(!1),i.embeddedEvent(l.AUTOPLAY_BLOCKED)):R.scWidgetPlayBlocked(e.soundId,3e4)?(D.stop(!1),i.embeddedEvent(l.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PAUSE),D.stop(!1))}):i.players.crossfade.stop()}function fa(e){b.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(D.stop(!0),i.embeddedEvent(l.MEDIA_ENDED)):i.players.crossfade.stop()}function Ea(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);b.log(`onSoundCloudPlayerEvent: ERROR for track: ${i.players.trackFromUid(e.id)}. ${t.getArtist()} - ${t.getTitle()} - [${t.getUid()} / ${t.getIframeId()}]`),t.setPlayable(!1)})}var N=T("gallery-events"),be={snackbarId:0,nowPlayingIcons:null},Ve={nowPlayingIconsSelector:"h2.entry-title"};function Ct(){N.log("init()"),be.nowPlayingIcons=document.querySelectorAll(Ve.nowPlayingIconsSelector),y(l.MEDIA_PLAYING,Ta),y(l.MEDIA_PAUSED,ma),y(l.MEDIA_ENDED,ba),y(l.MEDIA_SHOW,Pa),y(l.CONTINUE_AUTOPLAY,Sa),y(l.RESUME_AUTOPLAY,Aa),y(l.AUTOPLAY_BLOCKED,Ca),y(l.PLAYBACK_BLOCKED,ha),y(l.MEDIA_UNAVAILABLE,La)}function Ta(e){if(N.log(e),ce(be.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Ve.nowPlayingIconsSelector}`);ht(t),q(t,"playing-paused","now-playing-icon"),o.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function ma(e){N.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Ve.nowPlayingIconsSelector}`).classList.add("playing-paused")}function ba(e){N.log(e),B(0),e!==null&&e.data.numTracks>1&&ht()}function Pa(e){N.log(e),B(0),e.data.scrollToMedia&&w(e.data.trackId)}function Sa(e){N.log(e),G(L.nextPage,!0)}function Aa(e){let t=JSON.parse(sessionStorage.getItem(X.UF_AUTOPLAY));if(sessionStorage.removeItem(X.UF_AUTOPLAY),N.log(e),N.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function Ca(e){N.log(e),be.snackbarId=m("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function ha(e){N.log(e),m("Unable to play track, skipping to next",5,"Stop",()=>{},()=>xe(e))}function La(e){N.log(e),Ia(e.data.trackId)?m("YouTube Premium track, skipping",5,"help",()=>window.location.href="/channel/premium/",()=>xe(e)):(m("Unable to play track, skipping to next",5,"Stop",()=>{},()=>xe(e)),se("EVENT_MEDIA_UNAVAILABLE",e.data))}function ht(e){be.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function xe(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):L.nextPage!==null&&G(L.nextPage,!0)}function Ia(e){let t=document.getElementById(e);return t!==null?t.classList.contains("uf_channel-premium"):!1}var Be=T("crossfade-controls"),Pe={players:{}},v={},H={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function It(e,t){Be.log("init()"),Pe.players=e,v.crossfadePreset=new ve(H.crossfadePresetSelector),v.crossfadeTo=new ve(H.crossfadeToSelector),v.crossfadePreset.length>1&&v.crossfadeTo.length>1&&(v.crossfadePreset.forEach(a=>Dt(a,o.gallery.trackCrossfadeDefPreset)),v.crossfadeTo.clickCallback=t),y(l.READY,va)}function va(){Be.log("ready()"),v.crossfadePreset.length>1&&v.crossfadeTo.length>1&&(v.crossfadePreset.forEach(e=>{e.addEventListener("click",Na),q(e,E.DISABLED.CLASS,E.ENABLED.CLASS)}),v.crossfadeTo.forEach(e=>e.addEventListener("click",Ua)),y(l.MEDIA_PLAYING,Lt),y(l.MEDIA_PAUSED,Lt))}function Dt(e,t){e.setAttribute(H.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${ie.crossfade[t].name}`}function Na(e){let t=parseInt(e.target.getAttribute(H.crossfadePresetData));Dt(e.target,t+1<ie.crossfade.length?t+1:0)}function Ua(e){if(k()&&Pe.players.crossfade.isFading()===!1){let t=e.target.closest("single-track");if(t!==null){let a=t.querySelector("iframe"),s=parseInt(t.querySelector(H.crossfadePresetSelector).getAttribute(H.crossfadePresetData));q(t.querySelector(`div${H.crossfadeToSelector}`),E.ENABLED.CLASS,E.DISABLED.CLASS),v.crossfadeTo.clickCallback(Pe.players.uIdFromIframeId(a.id),ie.crossfade[s])}}}function Lt(){let e=k(),t=e?Pe.players.getTrackData().currentTrack:-1;Be.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),v.crossfadeTo.forEach((a,s)=>{t===s+1?q(a,e?E.ENABLED.CLASS:E.DISABLED.CLASS,e?E.DISABLED.CLASS:E.ENABLED.CLASS):q(a,e?E.DISABLED.CLASS:E.ENABLED.CLASS,e?E.ENABLED.CLASS:E.DISABLED.CLASS)})}var vt=T("gallery-players"),Nt=()=>{let e=null,t=null,a=[],s=new Map,c=0;return{indexMap:s,get crossfade(){return t},get current(){return a[c]},get next(){return a[c+1]},getPlayerIndex(){return c},setPlayerIndex(d){c=d},getNumTracks(){return a.length},getCurrentTrack(){return c+1},playerFromUid(d){return a[s.get(d)]},trackFromUid(d){return s.get(d)+1},isCurrent(d){return d===this.current.getUid()},init:f,add:O,uIdFromIframeId:A,stop:J,mute:P,getTrackData:Y,prevTrack:V,nextTrack:C,jumpToTrack:I};function f(d){vt.log("init()"),e=d,t=ft(this),y(l.MEDIA_PLAYING,()=>t.start()),y(l.MEDIA_PAUSED,()=>t.stop())}function O(d){vt.log(d),a.push(d),s.set(d.getUid(),a.length-1)}function A(d){return a.find(Ie=>Ie.iframeId===d).getUid()}function J(){this.current.stop(),t.stop()}function P(){this.current.mute(o.playback.masterMute),t.mute(o.playback.masterMute)}function Y(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function V(d){return c>0?(c--,e(d),!0):!1}function C(d){return c++,c<this.getNumTracks()?(e(d),!0):!1}function I(d,Ie,Xt=!0){return d>0&&d<=this.getNumTracks()?(c=d-1,e(Ie,Xt),!0):!1}};var h=T("gallery-playback"),r={eventLog:null,players:{}},Ut={minCrossfadeToTime:5,maxBufferingDelay:3};function Ra(){h.log("init()"),r.eventLog=R,Ct(),r.players=Nt(),r.players.init(Yt),ue(r.players,Ma),It(r.players,xa),D.init(r.players,Ae,wt),St(r.players,_t,Va)}function Se(){k()?(z(),r.players.current.pause()):(ze(),r.players.current.play(me))}function Ot(){h.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),D.updateCallback(0)):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(k())&&ae())})}function $e(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();h.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${o.playback.autoplay}`),!Ya(e,t)&&(t===!1?(r.players.stop(),e&&o.playback.autoplay===!1?z():r.players.nextTrack(k())&&$()):e&&(z(),o.playback.autoplay?g(l.CONTINUE_AUTOPLAY):r.players.stop()))}function Ya(e,t){if(e&&o.playback.autoplay){let a=ye();if(h.log(`repeatPlayback(): ${h.getObjectKeyForValue(M,a)}`),a===M.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===M.ALL)return r.players.stop(),r.players.setPlayerIndex(0),Yt(!0),!0}return!1}function Ma(e){r.players.current.seekTo(e)}function Rt(){o.playback.masterMute=o.playback.masterMute!==!0,r.players.mute()}function wa(e,t=!0){h.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),g(l.MEDIA_SHOW,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),$()}function Yt(e,t=!0){g(l.MEDIA_SHOW,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(me)}function Mt(e,t=!0){h.log(`skipToTrack(): ${e} - ${t}`),t===!0&&k()===!1&&(r.eventLog.clear(),r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),r.players.jumpToTrack(e,t)&&$())}function _a(e,t=null){h.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?Mt(r.players.trackFromUid(t),!0):wa(t):e.autoplay&&(r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),Se())}function Ae(){return{isPlaying:k(),currentTrack:r.players.getCurrentTrack(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function xa(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(h.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),o.playback.masterMute===!1&&o.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=Ut.minCrossfadeToTime+Ut.maxBufferingDelay&&wt(Ee.TRACK,t,e)}))}function wt(e,t,a=null){r.eventLog.add(u.ULTRAFUNK,p.CROSSFADE_START,null);let s=r.players.crossfade.init(e,t,a);s!==null&&_t.syncControls(s.fadeOutPlayer,s.fadeInPlayer)}function Va(e,t=null){switch(h.log(`embeddedEventHandler() - event: ${h.getObjectKeyForValue(l,e)}`),t!==null&&h.log(t),e){case l.MEDIA_ENDED:$e(!0);break;case l.READY:de(Ot,Se,$e,Rt),g(l.READY,t),g(l.RESUME_AUTOPLAY,null,{resumeAutoplay:_a});break;case l.AUTOPLAY_BLOCKED:g(l.AUTOPLAY_BLOCKED,null,{togglePlayPause:Se});break;case l.PLAYBACK_BLOCKED:case l.MEDIA_UNAVAILABLE:g(e,t,{skipToTrack:Mt});break}}var _t=(()=>{let e={PLAY:1,PAUSE:2},t=function s(c,f){if(h.log(`playbackState.syncAll() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(c)+1} - syncState: ${h.getObjectKeyForValue(e,f)}`),r.players.isCurrent(c))f===e.PLAY?g(l.MEDIA_PLAYING,Ae()):f===e.PAUSE&&g(l.MEDIA_PAUSED,Ae());else{let O=r.players.getPlayerIndex(),A=r.players.indexMap.get(c);r.players.stop(),r.players.setPlayerIndex(A),a(O,A),s(c,f)}};function a(s,c){c>s?$():ae()}return{STATE:e,syncAll:t,syncControls:a}})();var We={};qe(We,{getStatus:()=>qa,init:()=>Fa,nextTrack:()=>Bt,prevTrack:()=>Vt,toggleMute:()=>Ke,togglePlayPause:()=>Ge});var Ba={updateTimerInterval:250},Ce=(()=>{let e=-1,t=0,a=!0,s=null;return{ready:c,start:f,stop:O,update:A};function c(P){s=P,y(l.MEDIA_PLAYING,()=>f()),document.addEventListener("visibilitychange",()=>{a=document.visibilityState==="visible"})}function f(){O(),e=setInterval(()=>{a&&k()&&A(s.embedded.getCurrentTime(),s.getDuration())},Ba.updateTimerInterval)}function O(P=!1){e!==-1&&(clearInterval(e),e=-1),P&&A(0,0),t=0,_(!1)}function A(P,Y){if(P!==void 0){let V=Math.round(P);pe(P*1e3,V,Y),V>0&&Y>0&&J(V,Y)}}function J(P,Y){o.playback.autoplay===!1&&o.playback.timeRemainingWarning&&t!==P&&(t=P,Y-P<=o.playback.timeRemainingSeconds?_(!0):_(!1))}})();var U=T("list-playback"),Z=new le(10),n={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0};function Fa(){U.log("init()"),et(j),Ka()!==null?Ha():m("No playable YouTube tracks!",0,"help",()=>window.location.href="/help/#list-player")}function Ka(){if(n.currentTrackId=F(),n.autoplayData=JSON.parse(sessionStorage.getItem(X.UF_AUTOPLAY)),sessionStorage.removeItem(X.UF_AUTOPLAY),n.currentTrackId!==null){if(n.autoplayData!==null&&n.autoplayData.trackId!==null){let e=n.autoplayData.trackId.match(Tt);if(e!==null){let t=re(`[data-track-source-uid="${e[0]}"]`);t!==null&&(n.currentTrackId=t.id)}else if(n.autoplayData.trackId.match(/^track-(?!0)\d{1,9}$/i)!==null){let t=re(`[data-track-id="${n.autoplayData.trackId}"]`);t!==null?Ne(t)===ge.YOUTUBE?n.currentTrackId=t.id:m("Cannot play SoundCloud track",5,"help",()=>window.location.href="/help/#list-player"):m("Unable to cue track (not found)",5)}}nt(n.currentTrackId)}return U.log(`cueInitialTrack() - currentTrackId: ${n.currentTrackId} - autoplayData: ${n.autoplayData!==null?JSON.stringify(n.autoplayData):"N/A"}`),n.currentTrackId}function j(e,t=!0,a=!1){let s=Ne(rt(e));if(U.log(`setCurrentTrack() - nextTrackType: ${U.getObjectKeyForValue(ge,s)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),s===ge.SOUNDCLOUD&&a){m("Cannot play SoundCloud track",5,"help",()=>window.location.href="/help/#list-player");return}e===n.currentTrackId?Ge():(k()&&n.player.embedded.stopVideo(),n.currentTrackId=e,st(e,a),xt(t))}function xt(e){let t=ct();e?(n.player.embedded.loadVideoById(t),K(E.PLAYING),Qe()):(n.player.embedded.cueVideoById(t),K(E.PAUSED))}function Ge(){n.currentTrackId===null?j(re("div.track-entry.current").id):k()?n.player.embedded.pauseVideo():n.player.play(he)}function Ke(e=!1){e===!1&&(o.playback.masterMute=o.playback.masterMute!==!0),o.playback.masterMute?n.player.embedded.mute():n.player.embedded.unMute()}function Vt(){let e=lt(),t=n.player.embedded.getCurrentTime();e!==null&&t<=5?(j(e,k()),ae()):t!==0&&(n.player.embedded.seekTo(0),Ce.update(0,0))}function Bt(){let e=F();e!==null&&(j(e,k()),$())}async function $t(e=!1,t=!1){let a=t?M.OFF:ye(),s=F();if(U.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${s} - repeatMode: ${U.getObjectKeyForValue(M,a)}`),e&&a===M.ONE)n.player.embedded.seekTo(0),n.player.play(he);else if(e&&s===null&&a===M.ALL)j(F(null)),w(0);else if(s===null)if(o.list.showLoadMoreTracks){let c=await ot();e&&c&&j(F())}else G(L.nextPage,e);else e?j(s):K(E.PAUSED)}function Ga(){k()===!1&&n.autoplayData!==null&&(Z.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),Z.add(u.YOUTUBE,-1,F())),k()===!1&&$t(!0,!0)}function Wa(){n.currentTrackId=null,K(E.PAUSED)}function qa(){let e=re("div.track-entry.current");if(e!==null){let t=at("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:k(),currentTrack:a+1,position:Math.ceil(n.player.embedded.getCurrentTime()),numTracks:n.player.getNumTracks(),trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function Ha(){U.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){U.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:ja,onStateChange:Ja,onError:he}});n.player=new kt(a),ue(n.player,s=>n.player.embedded.seekTo(s)),B(33)};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ja(){U.log("onYouTubePlayerReady()"),n.autoplayData?.autoplay===!0&&Z.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),de(Vt,Ge,Bt,Ke),B(66),Ce.ready(n.player),tt(n.player),Ke(!0),g(l.READY,{resetProgressBar:!1}),xt(n.autoplayData?.autoplay===!0)}function Ja(e){switch(U.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${n.currentTrackId}`),Z.add(u.YOUTUBE,e.data,n.currentTrackId),e.data!==YT.PlayerState.PLAYING&&z(),e.data){case YT.PlayerState.UNSTARTED:Xa();break;case YT.PlayerState.CUED:n.player.setPlayerState(e.data);break;case YT.PlayerState.BUFFERING:g(l.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:za(e),g(l.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:K(E.PAUSED);break;case YT.PlayerState.ENDED:Ce.stop(!0),$t(o.playback.autoplay);break}}function Xa(){Z.ytAutoplayBlocked(n.currentTrackId,3e3)&&(K(E.PAUSED),n.currentSnackbarId=m("Autoplay blocked, Play to continue",0,"play",()=>n.player.play(he))),n.playerReady===!1&&(n.playerReady=!0,B(0))}function za(e){ce(n.currentSnackbarId),n.player.setDuration(Math.round(e.target.getDuration())),n.firstStatePlaying&&(n.firstStatePlaying=!1,n.autoplayData=null,setTimeout(()=>{o.playback.autoplay&&k()&&Math.round(window.pageYOffset)<=1&&bt(mt.SITE_MAX_WIDTH_MOBILE)&&w(0)},6e3))}function he(e){U.log(`onYouTubePlayerError(): ${e.data} - trackId: ${n.currentTrackId}`),it("Error!"),Z.add(u.YOUTUBE,p.PLAYER_ERROR,n.currentTrackId),m("Unable to play track, skipping to next",5,"Stop",Wa,Ga),se("EVENT_MEDIA_UNAVAILABLE",{mediaUrl:n.player.embedded.getVideoUrl(),mediaTitle:`${n.player.getArtist()} - ${n.player.getTitle()}`})}var ee=T("screen-wakelock"),Le={wakeLock:null};function Ft(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function Kt(){Ft()?document.visibilityState==="visible"&&await Wt()!==!0&&ee.log("enable(): Screen Wake Lock request failed"):(ee.log("enable(): Screen Wake Lock is not supported"),m("Keep Screen On is not supported",5,"Disable",()=>o.mobile.keepScreenOn=!1))}function Gt(){ee.log("stateVisible()"),Ft()&&Le.wakeLock===null&&Wt()}async function Wt(){try{return Le.wakeLock=await navigator.wakeLock.request("screen"),ee.log("request(): Screen Wake Lock is Enabled"),Le.wakeLock.addEventListener("release",()=>{ee.log("request(): Screen Wake Lock was Released"),Le.wakeLock=null}),!0}catch(e){ee.error(`request(): ${e.name} - ${e.message}`)}return!1}var jt=T("playback-interaction"),qt=new Me(10),S={player:null,isPlaybackReady:!1},Za={doubleClickDelay:500};document.addEventListener("DOMContentLoaded",()=>{jt.log("DOMContentLoaded"),He(),ut()?S.player=Fe:dt()&&(S.player=We),S.player!==null&&er(),Xe(S.player?.getStatus)});function er(){jt.log("initShared()"),tr(),S.player.init(),oe.init(),Jt.init(),ar()}function tr(){y(l.READY,lr),y(l.MEDIA_SHOW,Ht),y(l.MEDIA_ENDED,Ht),y(l.MEDIA_TIME_REMAINING,nr)}function ar(){W(".playback-shuffle-control span","click",yt),Oe("span.navbar-arrow-back","click",te,L.prevPage),Oe("span.navbar-arrow-fwd","click",te,L.nextPage),W("nav.post-navigation .nav-previous a","click",te,L.prevPage),W("nav.post-navigation .nav-next a","click",te,L.nextPage),document.addEventListener("keydown",rr),window.addEventListener("blur",or)}function rr(e){if(S.isPlaybackReady&&Jt.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1){switch(e.code){case"Backquote":e.preventDefault(),w(S.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),S.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":gt(e);break;case"ArrowLeft":e.preventDefault(),e.shiftKey===!0?te(null,L.prevPage):S.player.prevTrack();break;case"ArrowRight":e.preventDefault(),e.shiftKey===!0?te(null,L.nextPage):S.player.nextTrack();break;case"A":De.toggle();break;case"f":case"F":e.preventDefault(),oe.toggle(document.getElementById(S.player.getStatus().iframeId));break;case"m":case"M":e.preventDefault(),S.player.toggleMute(),m(o.playback.masterMute?"Volume is muted (<b>m</b> to unmute)":"Volume is unmuted (<b>m</b> to mute)",3);break;case"p":case"P":je.toggle();break;case"r":case"R":m(`${Ze().title} (<b>r</b> to change)`,3);break;case"x":case"X":Je.toggle();break}}}function lr(){W(".playback-details-control","click",sr),W(".playback-thumbnail-control","click",ir),W(".playback-timer-control","click",cr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&o.mobile.keepScreenOn&&Gt()}),o.mobile.keepScreenOn&&Kt(),S.isPlaybackReady=!0}function Ht(){o.playback.autoExitFullscreen&&oe.exit()}function nr(e){o.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=o.playback.timeRemainingSeconds&&oe.exit()}function or(){fe()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function sr(){w(S.player.getStatus().trackId),fe()&&o.list.showUpNextModal?ne("showUpNextModalHint","<b>Tip:</b> Click or tap Artist &amp; Title to show Up Next queue"):ne("showTrackDetailsHint","<b>Tip:</b> Click or tap Artist &amp; Title to show current track")}function ir(){pt()?(qt.add(u.MOUSE,p.MOUSE_CLICK,null),ne("showGalleryTrackThumbnailHint","<b>Tip:</b> Double click or tap Track Thumbnail for full screen"),qt.doubleClicked(u.MOUSE,p.MOUSE_CLICK,Za.doubleClickDelay)&&oe.enter(document.getElementById(S.player.getStatus().iframeId))):fe()&&(w(0),ne("showListTrackThumbnailHint","<b>Tip:</b> Click or tap Track Thumbnail to show player"))}function cr(){De.toggle(),ne("showTrackTimerHint","<b>Tip:</b> Click or tap Track Timer to toggle Autoplay On / Off")}function ne(e,t,a=0){o.tips[e]&&(m(t,a),o.tips[e]=!1)}function te(e,t){e?.preventDefault(),G(t,S.player.getStatus().isPlaying)}var oe=(()=>{let e=new Event("fullscreenElement"),t=null;return{init:a,enter:c,exit:f,toggle:O};function a(){document.addEventListener("fullscreenchange",s),document.addEventListener("webkitfullscreenchange",s)}function s(){t=document.fullscreenElement!==null?document.fullscreenElement.id:null,e.fullscreenTarget=t,document.dispatchEvent(e)}function c(A){A.requestFullscreen()}function f(){t!==null&&(document.exitFullscreen(),t=null)}function O(A){t===null?c(A):f()}})(),Jt=(()=>{let e=!1;return{allow(){return e},init:t};function t(){e=o.playback.keyboardShortcuts,document.addEventListener("allowKeyboardShortcuts",()=>{o.playback.keyboardShortcuts&&(e=!0)}),document.addEventListener("denyKeyboardShortcuts",()=>{o.playback.keyboardShortcuts&&(e=!1)})}})();
//# sourceMappingURL=interaction.js.map
