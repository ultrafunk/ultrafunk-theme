import{$ as ct,A as ue,B as de,C as B,D as pe,E as k,F as ze,G as z,H as _,I as Qe,J as re,K as $,L as x,M as ye,N as Ze,O as et,P as tt,Q as le,R as at,S as rt,T as Oe,U as lt,V as F,W as ot,X as nt,Y as K,Z as st,_ as it,a as qe,b as T,c as se,ca as ge,da as ut,e as ie,ea as dt,f as X,ga as pt,ha as fe,ia as yt,ja as G,k as I,ka as w,l as n,la as gt,m as He,ma as Ee,na as ft,oa as Et,p as m,pa as Re,q as ce,qa as kt,r as je,ra as Tt,s as Je,t as Ne,ta as mt,u as Xe,ua as W,v as r,va as Ye,w as g,x as y,y as E,ya as bt,z as Ue,za as q}from"../chunk-XHI4UD2Y.js";var Me=T("eventlogger"),u={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},p={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},zt={eventSource:u.UNKNOWN,eventType:p.UNKNOWN,uId:null,timeStamp:0},ke=class{constructor(t=10){this.log=[],this.maxEntries=t,this.lastPos=0,this.matchCount=0}add(t,a,s,c=Date.now()){let f=Object.create(zt);f.eventSource=t,f.eventType=a,f.uId=s,f.timeStamp=c,this.log.length<this.maxEntries?this.log.push(f):(this.log.shift(),this.log.push(f))}clear(){this.log=[]}initMatch(){this.lastPos=this.log.length-1,this.matchCount=0}matchesEvent(t,a,s,c=null){this.log[this.lastPos-t].eventSource===a&&this.log[this.lastPos-t].eventType===s&&this.log[this.lastPos-t].uId===c&&this.matchCount++}matchesDelta(t,a){this.log[this.lastPos].timeStamp-this.log[this.lastPos-t].timeStamp<=a&&this.matchCount++}isPatternMatch(t,a){return this.matchCount===t?(Me.log(`MATCH for: ${a}`),Me.logEventLog(this.log,u,p),!0):!1}},Te=class extends ke{constructor(t){super(t)}doubleClicked(t,a,s){return this.initMatch(),this.lastPos>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,s)),this.isPatternMatch(3,`${Me.getObjectKeyForValue(u,t)} Double Clicked`)}},Q=class extends ke{constructor(t){super(t)}ytAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesEvent(1,u.YOUTUBE,p.STATE_BUFFERING,t),this.matchesEvent(0,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,u.ULTRAFUNK,p.CROSSFADE_START,null),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Fe={};qe(Fe,{getStatus:()=>he,init:()=>Ra,nextTrack:()=>$e,prevTrack:()=>Ot,toggleMute:()=>Rt,togglePlayPause:()=>Ce});var Pt={updateTimerInterval:250,maxBufferingDelay:3},D=(()=>{let e=-1,t=0,a=!0,s=null,c=null,f=null;return{init:O,start:A,stop:J,updateCallback:P};function O(C,L,d){s=C,c=L,f=d,document.addEventListener("visibilitychange",()=>{a=document.visibilityState==="visible"})}function A(){J(!1),e=setInterval(()=>{a&&s.current.getPosition(P)},Pt.updateTimerInterval)}function J(C=!1){e!==-1&&(clearInterval(e),e=-1),C&&(P(0),y(r.MEDIA_ENDED,c())),t=0,_(!1)}function P(C,L=0){let d=Math.round(C/1e3);pe(C,d,L),d>0&&L>0&&(M(d,L),R(d,L))}function M(C,L){if(n.playback.autoplay===!1&&n.playback.timeRemainingWarning&&t!==C){let d=L-C;t=C,d<=n.playback.timeRemainingSeconds?(_(!0),y(r.MEDIA_TIME_REMAINING,{timeRemainingSeconds:d})):_(!1)}}function R(C,L){n.playback.masterMute===!1&&n.playback.autoplay&&n.gallery.autoCrossfade&&L-C===n.gallery.autoCrossfadeLength+Pt.maxBufferingDelay&&s.getCurrentTrack()+1<=s.getNumTracks()&&f(Ee.AUTO,{name:"Auto Crossfade",length:n.gallery.autoCrossfadeLength,curve:n.gallery.autoCrossfadeCurve})}})();var b=T("embedded-players"),Y=new Q(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},we={youTubeIframeIdRegEx:/youtube-uid/i,soundCloudIframeIdRegEx:/soundcloud-uid/i,maxPlaybackStartDelay:3};function St(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),ta(),da()}function be(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function At(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(r.READY,{resetProgressBar:!0}):y(r.LOADING,be())}function Zt(){document.querySelectorAll("single-track").forEach(t=>{let a=t.querySelector("iframe"),s=null;if(we.youTubeIframeIdRegEx.test(a.id)){let c=new YT.Player(a.id,{events:{onReady:aa,onStateChange:ra,onError:ua}});s=new Et(t.id,a.id,c,t.getAttribute("data-track-source-data"))}else if(we.soundCloudIframeIdRegEx.test(a.id)){let c=SC.Widget(a.id);s=new Re(t.id,a.id,c,a.src),c.bind(SC.Widget.Events.READY,()=>{s.setThumbnail(t.querySelector(".track-share-control span")),pa()}),c.bind(SC.Widget.Events.PLAY,ya),c.bind(SC.Widget.Events.PAUSE,ga),c.bind(SC.Widget.Events.FINISH,fa),c.bind(SC.Widget.Events.ERROR,Ea)}s!==null&&(s.setTitle(t.getAttribute("data-track-title")),s.setArtist(t.getAttribute("data-track-artist")),i.players.add(s))})}function Pe(e,t){b.log("onPlayerError()"),b.log(e);let a=e instanceof Re?u.SOUNDCLOUD:u.YOUTUBE;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),Y.add(a,p.PLAYER_ERROR,e.getUid()),i.embeddedEvent(r.MEDIA_UNAVAILABLE,ea(e,t))}function ea(e,t){let a=e.getArtist()||"N/A",s=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),mediaTitle:`${a} - ${s}`,mediaUrl:t}}function ta(){b.log("initYouTubeAPI()"),y(r.LOADING,be()),window.onYouTubeIframeAPIReady=function(){b.log("onYouTubeIframeAPIReady()"),y(r.LOADING,be()),Zt()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function aa(){b.log("onYouTubePlayerReady()"),At()}function ra(e){switch(Y.add(u.YOUTUBE,e.data,e.target.h.id),e.data){case YT.PlayerState.UNSTARTED:la(e);break;case YT.PlayerState.BUFFERING:oa(e);break;case YT.PlayerState.PLAYING:na(e);break;case YT.PlayerState.PAUSED:sa(e);break;case YT.PlayerState.CUED:ia(e);break;case YT.PlayerState.ENDED:ca(e);break}}function la(e){b.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e.target.h.id})`),Y.ytAutoplayBlocked(e.target.h.id,3e3)&&i.embeddedEvent(r.AUTOPLAY_BLOCKED)}function oa(e){if(b.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e.target.h.id})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e.target.h.id);t.mute(n.playback.masterMute),t.setVolume(n.playback.masterVolume),y(r.MEDIA_LOADING)}}function na(e){b.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e.target.h.id})`),i.playbackState.syncAll(e.target.h.id,i.playbackState.STATE.PLAY),i.players.current.setDuration(Math.round(e.target.getDuration())),D.start()}function sa(e){b.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e.target.h.id})`),i.players.isCurrent(e.target.h.id)?(i.playbackState.syncAll(e.target.h.id,i.playbackState.STATE.PAUSE),D.stop(!1)):i.players.crossfade.stop()}function ia(e){b.log(`onYouTubePlayerStateChange: CUED      (uID: ${e.target.h.id})`)}function ca(e){b.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e.target.h.id})`),i.players.isCurrent(e.target.h.id)?(D.stop(!0),i.embeddedEvent(r.MEDIA_ENDED)):i.players.crossfade.stop()}function ua(e){b.log("onYouTubePlayerError: "+e.data);let t=i.players.playerFromUid(e.target.h.id);t.setPlayable(!1),Pe(t,e.target.getVideoUrl())}function da(){b.log("initSoundCloudAPI()"),y(r.LOADING,be())}function pa(){b.log("onSoundCloudPlayerEventReady()"),At()}function ya(e){b.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),Y.add(u.SOUNDCLOUD,p.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?Y.scPlayDoubleTrigger(e.soundId,we.maxPlaybackStartDelay*1e3)&&i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(n.playback.masterMute),i.players.current.setVolume(n.playback.masterVolume)),i.players.current.getEmbeddedPlayer().getDuration(t=>{i.players.current.setDuration(Math.round(t/1e3)),D.start()})}function ga(e){b.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),Y.add(u.SOUNDCLOUD,p.STATE_PAUSED,e.soundId),Y.scAutoplayBlocked(e.soundId,3e3)?(D.stop(!1),i.embeddedEvent(r.AUTOPLAY_BLOCKED)):Y.scWidgetPlayBlocked(e.soundId,3e4)?(D.stop(!1),i.embeddedEvent(r.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PAUSE),D.stop(!1))}):i.players.crossfade.stop()}function fa(e){b.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(D.stop(!0),i.embeddedEvent(r.MEDIA_ENDED)):i.players.crossfade.stop()}function Ea(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);b.log(`onSoundCloudPlayerEvent: ERROR for track: ${i.players.trackFromUid(e.id)}. ${t.getArtist()} - ${t.getTitle()} - [${t.getUid()} / ${t.getIframeId()}]`),t.setPlayable(!1)})}var N=T("gallery-events"),Se={snackbarId:0,nowPlayingIcons:null},Ve={nowPlayingIconsSelector:"h2.entry-title"};function Ct(){N.log("init()"),Se.nowPlayingIcons=document.querySelectorAll(Ve.nowPlayingIconsSelector),g(r.MEDIA_PLAYING,Ta),g(r.MEDIA_PAUSED,ma),g(r.MEDIA_ENDED,ba),g(r.MEDIA_SHOW,Pa),g(r.CONTINUE_AUTOPLAY,Sa),g(r.RESUME_AUTOPLAY,Aa),g(r.AUTOPLAY_BLOCKED,Ca),g(r.PLAYBACK_BLOCKED,ha),g(r.MEDIA_UNAVAILABLE,Ia)}function Ta(e){if(N.log(e),ce(Se.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Ve.nowPlayingIconsSelector}`);ht(t),q(t,"playing-paused","now-playing-icon"),n.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function ma(e){N.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Ve.nowPlayingIconsSelector}`).classList.add("playing-paused")}function ba(e){N.log(e),B(0),e!==null&&e.data.numTracks>1&&ht()}function Pa(e){N.log(e),B(0),e.data.scrollToMedia&&w(e.data.trackId)}function Sa(e){N.log(e),G(I.nextPage,!0)}function Aa(e){let t=JSON.parse(sessionStorage.getItem(X.UF_AUTOPLAY));if(sessionStorage.removeItem(X.UF_AUTOPLAY),N.log(e),N.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function Ca(e){N.log(e),Se.snackbarId=m("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function ha(e){N.log(e),m("Unable to play track, skipping to next",5,"Stop",()=>{},()=>_e(e))}function Ia(e){N.log(e),La(e.data.trackId)?m("YouTube Premium track, skipping",5,"help",()=>window.location.href="/channel/premium/",()=>_e(e)):(m("Unable to play track, skipping to next",5,"Stop",()=>{},()=>_e(e)),se("EVENT_MEDIA_UNAVAILABLE",e.data))}function ht(e){Se.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function _e(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):I.nextPage!==null&&G(I.nextPage,!0)}function La(e){let t=document.getElementById(e);return t!==null?t.classList.contains("uf_channel-premium"):!1}var Be=T("crossfade-controls"),Ae={players:{}},v={},H={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function Lt(e,t){Be.log("init()"),Ae.players=e,v.crossfadePreset=new Ue(H.crossfadePresetSelector),v.crossfadeTo=new Ue(H.crossfadeToSelector),v.crossfadePreset.length>1&&v.crossfadeTo.length>1&&(v.crossfadePreset.forEach(a=>Dt(a,n.gallery.trackCrossfadeDefPreset)),v.crossfadeTo.clickCallback=t),g(r.READY,va)}function va(){Be.log("ready()"),v.crossfadePreset.length>1&&v.crossfadeTo.length>1&&(v.crossfadePreset.forEach(e=>{e.addEventListener("click",Na),q(e,E.DISABLED.CLASS,E.ENABLED.CLASS)}),v.crossfadeTo.forEach(e=>e.addEventListener("click",Ua)),g(r.MEDIA_PLAYING,It),g(r.MEDIA_PAUSED,It))}function Dt(e,t){e.setAttribute(H.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${ie.crossfade[t].name}`}function Na(e){let t=parseInt(e.target.getAttribute(H.crossfadePresetData));Dt(e.target,t+1<ie.crossfade.length?t+1:0)}function Ua(e){if(k()&&Ae.players.crossfade.isFading()===!1){let t=e.target.closest("single-track");if(t!==null){let a=t.querySelector("iframe"),s=parseInt(t.querySelector(H.crossfadePresetSelector).getAttribute(H.crossfadePresetData));q(t.querySelector(`div${H.crossfadeToSelector}`),E.ENABLED.CLASS,E.DISABLED.CLASS),v.crossfadeTo.clickCallback(Ae.players.uIdFromIframeId(a.id),ie.crossfade[s])}}}function It(){let e=k(),t=e?Ae.players.getTrackData().currentTrack:-1;Be.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),v.crossfadeTo.forEach((a,s)=>{t===s+1?q(a,e?E.ENABLED.CLASS:E.DISABLED.CLASS,e?E.DISABLED.CLASS:E.ENABLED.CLASS):q(a,e?E.DISABLED.CLASS:E.ENABLED.CLASS,e?E.ENABLED.CLASS:E.DISABLED.CLASS)})}var vt=T("gallery-players"),Nt=()=>{let e=null,t=null,a=[],s=new Map,c=0;return{indexMap:s,get crossfade(){return t},get current(){return a[c]},get next(){return a[c+1]},getPlayerIndex(){return c},setPlayerIndex(d){c=d},getNumTracks(){return a.length},getCurrentTrack(){return c+1},playerFromUid(d){return a[s.get(d)]},trackFromUid(d){return s.get(d)+1},isCurrent(d){return d===this.current.getUid()},init:f,add:O,uIdFromIframeId:A,stop:J,mute:P,getTrackData:M,prevTrack:R,nextTrack:C,jumpToTrack:L};function f(d){vt.log("init()"),e=d,t=ft(this),g(r.MEDIA_PLAYING,()=>t.start()),g(r.MEDIA_PAUSED,()=>t.stop())}function O(d){vt.log(d),a.push(d),s.set(d.getUid(),a.length-1)}function A(d){return a.find(ve=>ve.iframeId===d).getUid()}function J(){this.current.stop(),t.stop()}function P(){this.current.mute(n.playback.masterMute),t.mute(n.playback.masterMute)}function M(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function R(d){return c>0?(c--,e(d),!0):!1}function C(d){return c++,c<this.getNumTracks()?(e(d),!0):!1}function L(d,ve,Xt=!0){return d>0&&d<=this.getNumTracks()?(c=d-1,e(ve,Xt),!0):!1}};var h=T("gallery-playback"),l={eventLog:null,players:{}},Ut={minCrossfadeToTime:5,maxBufferingDelay:3};function Ra(){h.log("init()"),l.eventLog=Y,Ct(),l.players=Nt(),l.players.init(Yt),ue(l.players,Ma),Lt(l.players,_a),D.init(l.players,he,xt),St(l.players,wt,Va)}function Ce(){k()?(z(),l.players.current.pause()):(ze(),l.players.current.play(Pe))}function Ot(){h.log(`prevTrack() - prevTrack: ${l.players.getCurrentTrack()-1} - numTracks: ${l.players.getNumTracks()}`),l.players.getCurrentTrack()>0&&l.players.current.getPosition(e=>{e>5e3?(l.players.current.seekTo(0),D.updateCallback(0)):(l.players.getCurrentTrack()>1&&l.players.stop(),l.players.prevTrack(k())&&re())})}function $e(e=!1){let t=l.players.getCurrentTrack()+1>l.players.getNumTracks();h.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${n.playback.autoplay}`),!Ya(e,t)&&(t===!1?(l.players.stop(),e&&n.playback.autoplay===!1?z():l.players.nextTrack(k())&&$()):e&&(z(),n.playback.autoplay?y(r.CONTINUE_AUTOPLAY):l.players.stop()))}function Ya(e,t){if(e&&n.playback.autoplay){let a=ye();if(h.log(`repeatPlayback(): ${h.getObjectKeyForValue(x,a)}`),a===x.ONE)return l.players.current.seekTo(0),l.players.current.play(),!0;if(t&&a===x.ALL)return l.players.stop(),l.players.setPlayerIndex(0),Yt(!0),!0}return!1}function Ma(e){l.players.current.seekTo(e)}function Rt(){n.playback.masterMute=n.playback.masterMute!==!0,l.players.mute()}function xa(e,t=!0){h.log(`cueTrack(): ${e}`),l.players.setPlayerIndex(l.players.indexMap.get(e)),y(r.MEDIA_SHOW,{scrollToMedia:t,trackId:l.players.current.getTrackId()}),$()}function Yt(e,t=!0){y(r.MEDIA_SHOW,{scrollToMedia:t,trackId:l.players.current.getTrackId()}),e&&l.players.current.play(Pe)}function Mt(e,t=!0){h.log(`skipToTrack(): ${e} - ${t}`),t===!0&&k()===!1&&(l.eventLog.clear(),l.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),l.players.jumpToTrack(e,t)&&$())}function wa(e,t=null){h.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?Mt(l.players.trackFromUid(t),!0):xa(t):e.autoplay&&(l.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),Ce())}function he(){return{isPlaying:k(),currentTrack:l.players.getCurrentTrack(),position:0,numTracks:l.players.getNumTracks(),trackId:l.players.current.getTrackId(),iframeId:l.players.current.getIframeId()}}function _a(e,t){l.players.isCurrent(e)===!1&&l.players.current.getDuration()>0&&(h.log(`crossfadeToClick():
      fadeOut: ${l.players.current.getArtist()} - "${l.players.current.getTitle()}" (${l.players.current.getUid()})
      fadeIn.: ${l.players.playerFromUid(e).getArtist()} - "${l.players.playerFromUid(e).getTitle()}" (${e})`),n.playback.masterMute===!1&&n.playback.autoplay===!1&&l.players.current.getPosition(a=>{l.players.current.getDuration()-a/1e3>=Ut.minCrossfadeToTime+Ut.maxBufferingDelay&&xt(Ee.TRACK,t,e)}))}function xt(e,t,a=null){l.eventLog.add(u.ULTRAFUNK,p.CROSSFADE_START,null);let s=l.players.crossfade.init(e,t,a);s!==null&&wt.syncControls(s.fadeOutPlayer,s.fadeInPlayer)}function Va(e,t=null){switch(h.log(`embeddedEventHandler() - event: ${h.getObjectKeyForValue(r,e)}`),t!==null&&h.log(t),e){case r.MEDIA_ENDED:$e(!0);break;case r.READY:de(Ot,Ce,$e,Rt),y(r.READY,t),y(r.RESUME_AUTOPLAY,null,{resumeAutoplay:wa});break;case r.AUTOPLAY_BLOCKED:y(r.AUTOPLAY_BLOCKED,null,{togglePlayPause:Ce});break;case r.PLAYBACK_BLOCKED:case r.MEDIA_UNAVAILABLE:y(e,t,{skipToTrack:Mt});break}}var wt=(()=>{let e={PLAY:1,PAUSE:2},t=function s(c,f){if(h.log(`playbackState.syncAll() - previousTrack: ${l.players.getPlayerIndex()+1} - nextTrack: ${l.players.indexMap.get(c)+1} - syncState: ${h.getObjectKeyForValue(e,f)}`),l.players.isCurrent(c))f===e.PLAY?y(r.MEDIA_PLAYING,he()):f===e.PAUSE&&y(r.MEDIA_PAUSED,he());else{let O=l.players.getPlayerIndex(),A=l.players.indexMap.get(c);l.players.stop(),l.players.setPlayerIndex(A),a(O,A),s(c,f)}};function a(s,c){c>s?$():re()}return{STATE:e,syncAll:t,syncControls:a}})();var We={};qe(We,{getStatus:()=>qa,init:()=>Fa,nextTrack:()=>Bt,prevTrack:()=>Vt,toggleMute:()=>Ke,togglePlayPause:()=>Ge});var Ba={updateTimerInterval:250},Ie=(()=>{let e=-1,t=0,a=!0,s=null;return{ready:c,start:f,stop:O,update:A};function c(P){s=P,g(r.MEDIA_PLAYING,()=>f()),document.addEventListener("visibilitychange",()=>{a=document.visibilityState==="visible"})}function f(){O(),e=setInterval(()=>{a&&k()&&A(s.embedded.getCurrentTime(),s.getDuration())},Ba.updateTimerInterval)}function O(P=!1){e!==-1&&(clearInterval(e),e=-1),P&&A(0,0),t=0,_(!1)}function A(P,M){if(P!==void 0){let R=Math.round(P);pe(P*1e3,R,M),R>0&&M>0&&J(R,M)}}function J(P,M){if(n.playback.autoplay===!1&&n.playback.timeRemainingWarning&&t!==P){let R=M-P;t=P,R<=n.playback.timeRemainingSeconds?(_(!0),y(r.MEDIA_TIME_REMAINING,{timeRemainingSeconds:R})):_(!1)}}})();var U=T("list-playback"),ee=new Q(10),o={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0};function Fa(){U.log("init()"),et(j),Ka()!==null?Ha():m("No playable YouTube tracks!",0,"help",()=>window.location.href="/help/#list-player")}function Ka(){if(o.currentTrackId=F(),o.autoplayData=JSON.parse(sessionStorage.getItem(X.UF_AUTOPLAY)),sessionStorage.removeItem(X.UF_AUTOPLAY),o.currentTrackId!==null){if(o.autoplayData!==null&&o.autoplayData.trackId!==null){let e=o.autoplayData.trackId.match(Tt);if(e!==null){let t=le(`[data-track-source-uid="${e[0]}"]`);t!==null&&(o.currentTrackId=t.id)}else if(o.autoplayData.trackId.match(/^track-(?!0)\d{1,9}$/i)!==null){let t=le(`[data-track-id="${o.autoplayData.trackId}"]`);t!==null?Oe(t)===ge.YOUTUBE?o.currentTrackId=t.id:m("Cannot play SoundCloud track",5,"help",()=>window.location.href="/help/#list-player"):m("Unable to cue track (not found)",5)}}ot(o.currentTrackId)}return U.log(`cueInitialTrack() - currentTrackId: ${o.currentTrackId} - autoplayData: ${o.autoplayData!==null?JSON.stringify(o.autoplayData):"N/A"}`),o.currentTrackId}function j(e,t=!0,a=!1){let s=Oe(rt(e));if(U.log(`setCurrentTrack() - nextTrackType: ${U.getObjectKeyForValue(ge,s)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),s===ge.SOUNDCLOUD&&a){m("Cannot play SoundCloud track",5,"help",()=>window.location.href="/help/#list-player");return}e===o.currentTrackId?Ge():(k()&&o.player.embedded.stopVideo(),o.currentTrackId=e,st(e,a),_t(t))}function _t(e){let t=ct();e?(o.player.embedded.loadVideoById(t),K(E.PLAYING),Qe()):(o.player.embedded.cueVideoById(t),K(E.PAUSED))}function Ge(){o.currentTrackId===null?j(le("div.track-entry.current").id):k()?o.player.embedded.pauseVideo():o.player.play(Le)}function Ke(e=!1){e===!1&&(n.playback.masterMute=n.playback.masterMute!==!0),n.playback.masterMute?o.player.embedded.mute():o.player.embedded.unMute()}function Vt(){let e=lt(),t=o.player.embedded.getCurrentTime();e!==null&&t<=5?(j(e,k()),re()):t!==0&&(o.player.embedded.seekTo(0),Ie.update(0,0))}function Bt(){let e=F();e!==null&&(j(e,k()),$())}async function $t(e=!1,t=!1){let a=t?x.OFF:ye(),s=F();if(U.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${s} - repeatMode: ${U.getObjectKeyForValue(x,a)}`),e&&a===x.ONE)o.player.embedded.seekTo(0),o.player.play(Le);else if(e&&s===null&&a===x.ALL)j(F(null)),w(0);else if(s===null)if(n.list.showLoadMoreTracks){let c=await nt();e&&c&&j(F())}else G(I.nextPage,e);else e?j(s):K(E.PAUSED)}function Ga(){k()===!1&&o.autoplayData!==null&&(ee.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),ee.add(u.YOUTUBE,-1,F())),k()===!1&&$t(!0,!0)}function Wa(){o.currentTrackId=null,K(E.PAUSED)}function qa(){let e=le("div.track-entry.current");if(e!==null){let t=at("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:k(),currentTrack:a+1,position:Math.ceil(o.player.embedded.getCurrentTime()),numTracks:o.player.getNumTracks(),trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function Ha(){U.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){U.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:ja,onStateChange:Ja,onError:Le}});o.player=new kt(a),ue(o.player,s=>o.player.embedded.seekTo(s)),B(33)};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ja(){U.log("onYouTubePlayerReady()"),o.autoplayData?.autoplay===!0&&ee.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),de(Vt,Ge,Bt,Ke),B(66),Ie.ready(o.player),tt(o.player),Ke(!0),y(r.READY,{resetProgressBar:!1}),_t(o.autoplayData?.autoplay===!0)}function Ja(e){switch(U.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${o.currentTrackId}`),ee.add(u.YOUTUBE,e.data,o.currentTrackId),e.data!==YT.PlayerState.PLAYING&&z(),e.data){case YT.PlayerState.UNSTARTED:Xa();break;case YT.PlayerState.CUED:o.player.setPlayerState(e.data);break;case YT.PlayerState.BUFFERING:y(r.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:za(e),y(r.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:K(E.PAUSED);break;case YT.PlayerState.ENDED:Ie.stop(!0),y(r.MEDIA_ENDED),$t(n.playback.autoplay);break}}function Xa(){ee.ytAutoplayBlocked(o.currentTrackId,3e3)&&(K(E.PAUSED),o.currentSnackbarId=m("Autoplay blocked, Play to continue",0,"play",()=>o.player.play(Le))),o.playerReady===!1&&(o.playerReady=!0,B(0))}function za(e){ce(o.currentSnackbarId),o.player.setDuration(Math.round(e.target.getDuration())),o.firstStatePlaying&&(o.firstStatePlaying=!1,o.autoplayData=null,setTimeout(()=>{n.playback.autoplay&&k()&&Math.round(window.pageYOffset)<=1&&bt(mt.SITE_MAX_WIDTH_MOBILE)&&w(0)},6e3))}function Le(e){U.log(`onYouTubePlayerError(): ${e.data} - trackId: ${o.currentTrackId}`),it("Error!"),ee.add(u.YOUTUBE,p.PLAYER_ERROR,o.currentTrackId),m("Unable to play track, skipping to next",5,"Stop",Wa,Ga),se("EVENT_MEDIA_UNAVAILABLE",{mediaUrl:o.player.embedded.getVideoUrl(),mediaTitle:`${o.player.getArtist()} - ${o.player.getTitle()}`})}var te=T("screen-wakelock"),De={wakeLock:null};function Ft(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function Kt(){Ft()?document.visibilityState==="visible"&&await Wt()!==!0&&te.log("enable(): Screen Wake Lock request failed"):(te.log("enable(): Screen Wake Lock is not supported"),m("Keep Screen On is not supported",5,"Disable",()=>n.mobile.keepScreenOn=!1))}function Gt(){te.log("stateVisible()"),Ft()&&De.wakeLock===null&&Wt()}async function Wt(){try{return De.wakeLock=await navigator.wakeLock.request("screen"),te.log("request(): Screen Wake Lock is Enabled"),De.wakeLock.addEventListener("release",()=>{te.log("request(): Screen Wake Lock was Released"),De.wakeLock=null}),!0}catch(e){te.error(`request(): ${e.name} - ${e.message}`)}return!1}var jt=T("playback-interaction"),qt=new Te(10),S={player:null,isPlaybackReady:!1},Za={doubleClickDelay:500};document.addEventListener("DOMContentLoaded",()=>{jt.log("DOMContentLoaded"),He(),ut()?S.player=Fe:dt()&&(S.player=We),S.player!==null&&er(),Xe(S.player?.getStatus)});function er(){jt.log("initShared()"),tr(),S.player.init(),ne.init(),Jt.init(),ar()}function tr(){g(r.READY,lr),g(r.MEDIA_SHOW,Ht),g(r.MEDIA_ENDED,Ht),g(r.MEDIA_TIME_REMAINING,or)}function ar(){W(".playback-shuffle-control span","click",yt),Ye("span.navbar-arrow-back","click",ae,I.prevPage),Ye("span.navbar-arrow-fwd","click",ae,I.nextPage),W("nav.track-navigation .nav-previous a","click",ae,I.prevPage),W("nav.track-navigation .nav-next a","click",ae,I.nextPage),document.addEventListener("keydown",rr),window.addEventListener("blur",nr)}function rr(e){if(S.isPlaybackReady&&Jt.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1){switch(e.code){case"Backquote":e.preventDefault(),w(S.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),S.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":gt(e);break;case"ArrowLeft":e.preventDefault(),e.shiftKey===!0?ae(null,I.prevPage):S.player.prevTrack();break;case"ArrowRight":e.preventDefault(),e.shiftKey===!0?ae(null,I.nextPage):S.player.nextTrack();break;case"A":Ne.toggle();break;case"f":case"F":e.preventDefault(),ne.toggle(document.getElementById(S.player.getStatus().iframeId));break;case"m":case"M":e.preventDefault(),S.player.toggleMute(),m(n.playback.masterMute?"Volume is muted (<b>m</b> to unmute)":"Volume is unmuted (<b>m</b> to mute)",3);break;case"p":case"P":je.toggle();break;case"r":case"R":m(`${Ze().title} (<b>r</b> to change)`,3);break;case"x":case"X":Je.toggle();break}}}function lr(){W(".playback-details-control","click",sr),W(".playback-thumbnail-control","click",ir),W(".playback-timer-control","click",cr),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&n.mobile.keepScreenOn&&Gt()}),n.mobile.keepScreenOn&&Kt(),S.isPlaybackReady=!0}function Ht(){n.playback.autoExitFullscreen&&ne.exit()}function or(e){n.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=n.playback.timeRemainingSeconds&&ne.exit()}function nr(){fe()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function sr(){w(S.player.getStatus().trackId),fe()&&n.list.showUpNextModal?oe("showUpNextModalHint","<b>Tip:</b> Click or tap Artist &amp; Title to show Up Next queue"):oe("showTrackDetailsHint","<b>Tip:</b> Click or tap Artist &amp; Title to show current track")}function ir(){pt()?(qt.add(u.MOUSE,p.MOUSE_CLICK,null),oe("showGalleryTrackThumbnailHint","<b>Tip:</b> Double click or tap Track Thumbnail for full screen"),qt.doubleClicked(u.MOUSE,p.MOUSE_CLICK,Za.doubleClickDelay)&&ne.enter(document.getElementById(S.player.getStatus().iframeId))):fe()&&(w(0),oe("showListTrackThumbnailHint","<b>Tip:</b> Click or tap Track Thumbnail to show player"))}function cr(){Ne.toggle(),oe("showTrackTimerHint","<b>Tip:</b> Click or tap Track Timer to toggle Autoplay On / Off")}function oe(e,t,a=0){n.tips[e]&&(m(t,a),n.tips[e]=!1)}function ae(e,t){e?.preventDefault(),G(t,S.player.getStatus().isPlaying)}var ne=(()=>{let e=new Event("fullscreenElement"),t=null;return{init:a,enter:c,exit:f,toggle:O};function a(){document.addEventListener("fullscreenchange",s),document.addEventListener("webkitfullscreenchange",s)}function s(){t=document.fullscreenElement!==null?document.fullscreenElement.id:null,e.fullscreenTarget=t,document.dispatchEvent(e)}function c(A){A.requestFullscreen()}function f(){t!==null&&(document.exitFullscreen(),t=null)}function O(A){t===null?c(A):f()}})(),Jt=(()=>{let e=!1;return{allow(){return e},init:t};function t(){e=n.playback.keyboardShortcuts,document.addEventListener("allowKeyboardShortcuts",()=>{n.playback.keyboardShortcuts&&(e=!0)}),document.addEventListener("denyKeyboardShortcuts",()=>{n.playback.keyboardShortcuts&&(e=!1)})}})();
//# sourceMappingURL=interaction.js.map
