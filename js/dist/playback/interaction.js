import{$ as g,A as rt,Aa as bt,B as X,Ba as Pt,Ca as w,Da as At,Ea as St,F as st,Fa as Ct,G as _,Ga as ht,Ia as Lt,Ja as ye,Ka as It,La as B,Ma as Y,Na as vt,O as Ne,Oa as W,Pa as ge,Q as le,R as J,S as nt,T as ot,U as j,V as lt,W as it,X as De,Y as ct,Z as ut,_ as s,a as Je,aa as p,b as P,ba as f,c as re,ca as Ue,d as je,da as dt,ea as ie,fa as ce,g as se,ga as pt,h as F,ha as O,ia as m,ja as yt,ka as G,la as ue,m as C,ma as de,n as l,na as z,o as ze,oa as x,pa as U,q as T,qa as pe,r as ne,ra as gt,s as oe,sa as Et,t as Qe,ta as kt,u as S,ua as Q,v as Ze,va as Tt,w as et,wa as ft,x as tt,xa as Ye,y as at,ya as mt,za as M}from"../chunk-JUOLIVB4.js";var Oe=P("eventlogger"),c={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},d={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},ca={eventSource:c.UNKNOWN,eventType:d.UNKNOWN,uId:null,timeStamp:0},Ee=class{constructor(t=10){this.log=[],this.maxEntries=t,this.lastPos=0,this.matchCount=0}add(t,a,o,u=Date.now()){let y=Object.create(ca);y.eventSource=t,y.eventType=a,y.uId=o,y.timeStamp=u,this.log.length<this.maxEntries?this.log.push(y):(this.log.shift(),this.log.push(y))}clear(){this.log=[]}initMatch(){this.lastPos=this.log.length-1,this.matchCount=0}matchesEvent(t,a,o,u=null){this.log[this.lastPos-t].eventSource===a&&this.log[this.lastPos-t].eventType===o&&this.log[this.lastPos-t].uId===u&&this.matchCount++}matchesDelta(t,a){this.log[this.lastPos].timeStamp-this.log[this.lastPos-t].timeStamp<=a&&this.matchCount++}isPatternMatch(t,a){return this.matchCount===t?(Oe.log(`MATCH for: ${a}`),Oe.logEventLog(this.log,c,d),!0):!1}},ke=class extends Ee{doubleClicked(t,a,o){return this.initMatch(),this.lastPos>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,o)),this.isPatternMatch(3,`${Oe.getKeyForValue(c,t)} Double Clicked`)}},q=class extends Ee{ytAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.YOUTUBE,d.STATE_UNSTARTED,t),this.matchesEvent(1,c.YOUTUBE,d.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,d.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,c.ULTRAFUNK,d.CROSSFADE_START,null),this.matchesEvent(1,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(0,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Be={};Je(Be,{getStatus:()=>Ce,init:()=>Ha,nextTrack:()=>we,prevTrack:()=>Vt,toggleMute:()=>$t,togglePlayPause:()=>Se});var V=class{constructor(){this.intervalId=-1,this.lastPosSeconds=0,this.isVisible=!0,this.config={updateTimerInterval:250,maxBufferingDelay:3}}init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}start(){this.stop(),this.intervalId=setInterval(()=>{this.isVisible&&this.updateProxy()},this.config.updateTimerInterval)}stop(){this.intervalId!==-1&&(clearInterval(this.intervalId),this.intervalId=-1),this.lastPosSeconds=0,ue(!1)}updateTimeRemainingWarning(t,a){if(l.playback.autoplay===!1&&l.playback.timeRemainingWarning&&this.lastPosSeconds!==t){let o=a-t;this.lastPosSeconds=t,o<=l.playback.timeRemainingSeconds?(ue(!0),p(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:o})):ue(!1)}}};var Re=class extends V{constructor(){super(),this.players=null,this.crossfadeInit=null}init(t,a){super.init(),this.players=t,this.crossfadeInit=a}updateProxy(){this.players.current.getPosition((t,a)=>this.updateCallback(t,a))}updateCallback(t,a=0){let o=Math.round(t/1e3);O(t,o,a),o>0&&a>0&&(super.updateTimeRemainingWarning(o,a),this.updateAutoCrossfade(o,a))}updateAutoCrossfade(t,a){l.playback.masterMute===!1&&l.playback.autoplay&&l.gallery.autoCrossfade&&a-t===l.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.players.getCurrentTrack()+1<=this.players.getNumTracks()&&this.crossfadeInit(oe.AUTO,{name:"Auto Crossfade",length:l.gallery.autoCrossfadeLength,curve:l.gallery.autoCrossfadeCurve})}},I=new Re;var b=P("embedded-players"),D=new q(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},da={maxPlaybackStartDelay:3};function Dt(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),ga(),Ca()}function fe(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function Ut(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):p(s.PLAYBACK_LOADING,fe())}function pa(){let e=document.querySelectorAll("single-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),o=t.querySelector("iframe"),u=null;if(a===S.YOUTUBE)e.length===1&&o===null?u=Nt("youtube-player",t,!0):u=Nt(o.id,t,!1);else if(a===S.SOUNDCLOUD){let y=SC.Widget(o.id);u=new et(t.id,o.id,y,o.src),y.bind(SC.Widget.Events.READY,()=>{u.setThumbnail(t),y.getDuration(L=>u.setDuration(Math.round(L/1e3))),ha(u,o.id)}),y.bind(SC.Widget.Events.PLAY,La),y.bind(SC.Widget.Events.PAUSE,Ia),y.bind(SC.Widget.Events.FINISH,va),y.bind(SC.Widget.Events.ERROR,Na)}u!==null&&(u.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(u))})}function Nt(e,t,a=!1){let o=t.getAttribute("data-track-source-uid"),u=new YT.Player(e,{events:{onReady:L=>Ea(L,e),onStateChange:L=>ka(L,e),onError:L=>Sa(L,e)},...a&&{videoId:o}}),y=new Ze(t.id,e,u,o);return y.setDuration(parseInt(t.getAttribute("data-track-duration"))),y}function be(e,t){b.log("onPlayerError()"),b.log(e);let a=e.getTrackType()===S.YOUTUBE?c.YOUTUBE:c.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),D.add(a,d.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,ya(e,t))}function ya(e,t){let a=e.getArtist()||"N/A",o=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),mediaTitle:`${a} - ${o}`,mediaUrl:t}}function ga(){b.log("initYouTubeAPI()"),p(s.PLAYBACK_LOADING,fe()),window.onYouTubeIframeAPIReady=function(){b.log("onYouTubeIframeAPIReady()"),p(s.PLAYBACK_LOADING,fe()),pa()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Ea(e,t){let a=i.players.playerFromUid(t);b.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),e.target.getPlayerState()===-1&&a.setIsPlayable(!1),Ut()}function ka(e,t){switch(D.add(c.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:Ta(t);break;case YT.PlayerState.BUFFERING:fa(t);break;case YT.PlayerState.PLAYING:ma(t);break;case YT.PlayerState.PAUSED:ba(t);break;case YT.PlayerState.CUED:Pa(t);break;case YT.PlayerState.ENDED:Aa(t);break}}function Ta(e){b.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),D.ytAutoplayBlocked(e,3e3)&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function fa(e){if(b.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(l.playback.masterMute),t.setVolume(l.playback.masterVolume),p(s.MEDIA_LOADING)}}function ma(e){b.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.syncAll(e,i.playbackState.STATE.PLAY),I.start()}function ba(e){b.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.syncAll(e,i.playbackState.STATE.PAUSE),I.stop()):i.players.crossfade.stop()}function Pa(e){b.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`);let t=i.players.playerFromUid(e);"isSingleTrackNextCued"in t&&t.isSingleTrackNextCued&&(delete t.isSingleTrackNextCued,t.embeddedPlayer.getDuration()===0&&t.setIsPlayable(!1),b.log(`onYouTubePlayerStateChange: CUED      Duration: ${t.embeddedPlayer.getDuration()} - isPlayable: ${t.getIsPlayable()}`))}function Aa(e){b.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Sa(e,t){b.log("onYouTubePlayerError: "+e.data);let a=i.players.playerFromUid(t);a.setIsPlayable(!1),be(a,e.target.getVideoUrl())}function Ca(){b.log("initSoundCloudAPI()"),p(s.PLAYBACK_LOADING,fe())}function ha(e,t){b.log(`onSCPlayerEventReady(): ${t} => ${e.getUid()} => ${e.getArtist()} - ${e.getTitle()}`),Ut()}function La(e){b.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),D.add(c.SOUNDCLOUD,d.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?D.scPlayDoubleTrigger(e.soundId,da.maxPlaybackStartDelay*1e3)&&i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(l.playback.masterMute),i.players.current.setVolume(l.playback.masterVolume)),I.start()}function Ia(e){b.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),D.add(c.SOUNDCLOUD,d.STATE_PAUSED,e.soundId),D.scAutoplayBlocked(e.soundId,3e3)?(I.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):D.scWidgetPlayBlocked(e.soundId,3e4)?(I.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PAUSE),I.stop())}):i.players.crossfade.stop()}function va(e){b.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Na(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);b.log(`onSoundCloudPlayerEvent: ERROR for track: ${i.players.trackFromUid(e.id)}. ${t.getArtist()} - ${t.getTitle()} - [${t.getUid()} / ${t.getIframeId()}]`),t.setIsPlayable(!1)})}var v=P("gallery-events"),Pe={snackbarId:0,nowPlayingIcons:null},xe={nowPlayingIconsSelector:"h2.entry-title"};function Yt(){v.log("init()"),Pe.nowPlayingIcons=document.querySelectorAll(xe.nowPlayingIconsSelector),g(s.MEDIA_PLAYING,Ua),g(s.MEDIA_PAUSED,Ya),g(s.MEDIA_ENDED,Oa),g(s.MEDIA_CUE_NEXT,Ra),g(s.CONTINUE_AUTOPLAY,_a),g(s.RESUME_AUTOPLAY,xa),g(s.AUTOPLAY_BLOCKED,Ma),g(s.PLAYBACK_BLOCKED,wa),g(s.MEDIA_UNAVAILABLE,Ba)}function Ua(e){if(v.log(e),ne(Pe.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${xe.nowPlayingIconsSelector}`);Ot(t),_(t,"playing-paused","now-playing-icon"),l.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Ya(e){v.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${xe.nowPlayingIconsSelector}`).classList.add("playing-paused")}function Oa(e){v.log(e),e!==null&&e.data.numTracks>1&&Ot()}function Ra(e){v.log(e),e.data.scrollToMedia&&Y(e.data.trackId)}function _a(e){v.log(e),J()&&e.data.trackType===S.YOUTUBE?j(!0):B(C.nextPage,!0)}function xa(e){let t=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY));if(sessionStorage.removeItem(F.UF_AUTOPLAY),v.log(e),v.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function Ma(e){v.log(e),Pe.snackbarId=T("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function wa(e){v.log(e),T("Unable to play track, skipping to next",5,"Stop",()=>{},()=>_e(e))}function Ba(e){v.log(e),Va(e.data.trackId)?T("YouTube Premium track, skipping",5,"help",()=>window.location.href="/channel/premium/",()=>_e(e)):(T("Unable to play track, skipping to next",5,"Stop",()=>{},()=>_e(e)),re("EVENT_MEDIA_UNAVAILABLE",e.data))}function Ot(e){Pe.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function _e(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):J()?j(l.playback.autoplay):C.nextPage!==null&&B(C.nextPage,!0)}function Va(e){let t=document.getElementById(e);return t!==null?t.classList.contains("uf_channel-premium"):!1}var Me=P("crossfade-controls"),Ae={players:{}},h={},$={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function _t(e,t){Me.log("init()"),Ae.players=e,h.crossfadePreset=new Ue($.crossfadePresetSelector),h.crossfadeTo=new Ue($.crossfadeToSelector),h.crossfadePreset.length>1&&h.crossfadeTo.length>1&&(h.crossfadePreset.forEach(a=>xt(a,l.gallery.trackCrossfadeDefPreset)),h.crossfadeTo.clickCallback=t),g(s.PLAYBACK_READY,Ka)}function Ka(){Me.log("playbackReady()"),h.crossfadePreset.length>1&&h.crossfadeTo.length>1&&(h.crossfadePreset.forEach(e=>{e.addEventListener("click",Fa),_(e,f.DISABLED.CLASS,f.ENABLED.CLASS)}),h.crossfadeTo.forEach(e=>e.addEventListener("click",Ga)),g(s.MEDIA_PLAYING,Rt),g(s.MEDIA_PAUSED,Rt))}function xt(e,t){e.setAttribute($.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${se.crossfade[t].name}`}function Fa(e){let t=parseInt(e.target.getAttribute($.crossfadePresetData));xt(e.target,t+1<se.crossfade.length?t+1:0)}function Ga(e){if(m()&&Ae.players.crossfade.isFading()===!1){let t=e.target.closest("single-track");if(t!==null){let a=t.querySelector("iframe"),o=parseInt(t.querySelector($.crossfadePresetSelector).getAttribute($.crossfadePresetData));_(t.querySelector(`div${$.crossfadeToSelector}`),f.ENABLED.CLASS,f.DISABLED.CLASS),h.crossfadeTo.clickCallback(Ae.players.uIdFromIframeId(a.id),se.crossfade[o])}}}function Rt(){let e=m(),t=e?Ae.players.getTrackData().currentTrack:-1;Me.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),h.crossfadeTo.forEach((a,o)=>{t===o+1?_(a,e?f.ENABLED.CLASS:f.DISABLED.CLASS,e?f.DISABLED.CLASS:f.ENABLED.CLASS):_(a,e?f.DISABLED.CLASS:f.ENABLED.CLASS,e?f.ENABLED.CLASS:f.DISABLED.CLASS)})}var Mt=P("gallery-players"),wt=()=>{let e=null,t=null,a=[],o=new Map,u=0;return{indexMap:o,get crossfade(){return t},get current(){return a[u]},get next(){return a[u+1]},getPlayerIndex(){return u},setPlayerIndex(k){u=k},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return u+1},playerFromUid(k){return a[o.get(k)]},trackFromUid(k){return o.get(k)+1},isCurrent(k){return k===this.current.getUid()},init:y,add:L,uIdFromIframeId:ae,stop:aa,mute:ra,getTrackData:sa,prevTrack:na,nextTrack:oa,jumpToTrack:la};function y(k){Mt.log("init()"),e=k,t=Qe(this),g(s.MEDIA_PLAYING,()=>t.start()),g(s.MEDIA_PAUSED,()=>t.stop())}function L(k){Mt.log(k),a.push(k),o.set(k.getUid(),a.length-1)}function ae(k){return a.find(ve=>ve.iframeId===k).getUid()}function aa(){this.current.stop(),t.stop()}function ra(){this.current.mute(l.playback.masterMute),t.mute(l.playback.masterMute)}function sa(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function na(k){return u>0?(u--,e(k),!0):!1}function oa(k){return u++,u<this.getNumTracks()?(e(k),!0):!1}function la(k,ve,ia=!0){return k>0&&k<=this.getNumTracks()?(u=k-1,e(ve,ia),!0):!1}};var A=P("gallery-playback"),r={eventLog:null,players:{}},Bt={minCrossfadeToTime:5,maxBufferingDelay:3};function Ha(){A.log("init()"),r.eventLog=D,Yt(),r.players=wt(),r.players.init(Kt),ie(r.players,Ja),_t(r.players,Za),I.init(r.players,Gt),Dt(r.players,Wt,er)}function Se(){m()?(G(),r.players.current.pause()):(yt(),r.players.current.play(be))}function Vt(){A.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),O(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(m())&&z())})}function we(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();A.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${l.playback.autoplay}`),!Xa(e,t)&&(t===!1?(r.players.stop(),e&&l.playback.autoplay===!1?G():r.players.nextTrack(m())&&x()):e&&(G(),l.playback.autoplay?p(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Xa(e,t){if(e&&l.playback.autoplay){let a=pe();if(A.log(`repeatPlayback(): ${A.getKeyForValue(U,a)}`),a===U.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===U.ALL)return r.players.stop(),r.players.setPlayerIndex(0),Kt(!0),!0}return!1}function Ja(e){r.players.current.seekTo(e)}function $t(){l.playback.masterMute=l.playback.masterMute!==!0,r.players.mute()}function ja(e,t=!0){A.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),p(s.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),x()}function Kt(e,t=!0){p(s.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(be)}function Ft(e,t=!0){A.log(`skipToTrack(): ${e} - ${t}`),t===!0&&m()===!1&&(r.eventLog.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),r.players.jumpToTrack(e,t)&&x())}function za(e,t=null){A.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?Ft(r.players.trackFromUid(t),!0):ja(t):e.autoplay&&(r.eventLog.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),Se())}function Qa(e,t,a=!1){A.log(`cueOrPlaySingleTrackNextById() - playMedia: ${a}`),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),pt(0),de(),a?(r.eventLog.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),r.players.current.playTrackById(t.uid)):(r.players.current.cueTrackById(t.uid),r.players.current.isSingleTrackNextCued=!0)}function Ce(){return{isPlaying:m(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function Za(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(A.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),l.playback.masterMute===!1&&l.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=Bt.minCrossfadeToTime+Bt.maxBufferingDelay&&Gt(oe.TRACK,t,e)}))}function Gt(e,t,a=null){r.eventLog.add(c.ULTRAFUNK,d.CROSSFADE_START,null);let o=r.players.crossfade.init(e,t,a);o!==null&&Wt.syncControls(o.fadeOutPlayer,o.fadeInPlayer)}function er(e,t=null){switch(A.log(`embeddedEventHandler() - event: ${A.getKeyForValue(s,e)}`),t!==null&&A.log(t),e){case s.MEDIA_ENDED:p(s.MEDIA_ENDED,Ce()),we(!0);break;case s.PLAYBACK_READY:ce(Vt,Se,we,$t),ot(Qa),p(s.PLAYBACK_READY,t),p(s.RESUME_AUTOPLAY,null,{resumeAutoplay:za});break;case s.AUTOPLAY_BLOCKED:p(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:Se});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:p(e,t,{skipToTrack:Ft});break}}var Wt=(()=>{let e={PLAY:1,PAUSE:2},t=function o(u,y){if(A.log(`playbackState.syncAll() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(u)+1} - syncState: ${A.getKeyForValue(e,y)}`),r.players.isCurrent(u))y===e.PLAY?p(s.MEDIA_PLAYING,Ce()):y===e.PAUSE&&p(s.MEDIA_PAUSED,Ce());else{let L=r.players.getPlayerIndex(),ae=r.players.indexMap.get(u);r.players.stop(),r.players.setPlayerIndex(ae),a(L,ae),o(u,y)}};function a(o,u){u>o?x():z()}return{STATE:e,syncAll:t,syncControls:a}})();var We={};Je(We,{getStatus:()=>or,init:()=>ar,nextTrack:()=>Xt,prevTrack:()=>Ht,toggleMute:()=>Ke,togglePlayPause:()=>Ge});var Ve=class extends V{constructor(){super(),this.player=null}ready(t){super.init(),this.player=t,g(s.MEDIA_PLAYING,()=>super.start())}updateProxy(){m()&&this.update(this.player.embedded.getCurrentTime(),this.player.getDuration())}update(t,a){if(t!==void 0){let o=Math.round(t);O(t*1e3,o,a),o>0&&a>0&&super.updateTimeRemainingWarning(o,a)}}},$e=new Ve;var N=P("list-playback"),H=new q(10),n={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},Fe=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function ar(){N.log("init()"),Et(K),rr()!==null?lr():T("No playable YouTube tracks!",0,"help",()=>le("No playable tracks",Fe))}function rr(){if(n.currentTrackId=M(),n.autoplayData=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY)),sessionStorage.removeItem(F.UF_AUTOPLAY),n.currentTrackId!==null){if(n.autoplayData!==null&&n.autoplayData.trackId!==null){let e=n.autoplayData.trackId.match(at);if(e!==null){let t=Q(`[data-track-source-uid="${e[0]}"]`);t!==null&&(n.currentTrackId=t.id)}else if(n.autoplayData.trackId.match(/^track-(?!0)\d{1,9}$/i)!==null){let t=Q(`[data-track-id="${n.autoplayData.trackId}"]`);t!==null?Ye(t)===S.YOUTUBE?n.currentTrackId=t.id:T("Cannot play SoundCloud track",5,"help",()=>le("Cannot play SoundCloud track",Fe)):T("Unable to cue track (not found)",5)}}bt(n.currentTrackId)}return N.log(`cueInitialTrack() - currentTrackId: ${n.currentTrackId} - autoplayData: ${n.autoplayData!==null?JSON.stringify(n.autoplayData):"N/A"}`),n.currentTrackId}function K(e,t=!0,a=!1){let o=Ye(ft(e));if(N.log(`setCurrentTrack() - nextTrackType: ${N.getKeyForValue(S,o)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),o===S.SOUNDCLOUD&&a){T("Cannot play SoundCloud track",5,"help",()=>le("Cannot play SoundCloud track",Fe));return}e===n.currentTrackId?Ge():(m()&&n.player.embedded.stopVideo(),n.currentTrackId=e,p(s.MEDIA_CUE_NEXT,{nextTrackId:e,isPointerClick:a}),qt(t))}function qt(e){let t=St();e?(n.player.embedded.loadVideoById(t),w(f.PLAYING),de()):(n.player.embedded.cueVideoById(t),w(f.PAUSED))}function Ge(){n.currentTrackId===null?K(Q("div.track-entry.current").id):m()?n.player.embedded.pauseVideo():n.player.play(he)}function Ke(e=!1){e===!1&&(l.playback.masterMute=l.playback.masterMute!==!0),l.playback.masterMute?n.player.embedded.mute():n.player.embedded.unMute()}function Ht(){let e=mt(),t=n.player.embedded.getCurrentTime();e!==null&&t<=5?(K(e,m()),z()):t!==0&&(n.player.embedded.seekTo(0),O(0,0,n.player.getDuration()))}function Xt(){let e=M();e!==null&&(K(e,m()),x())}async function Jt(e=!1,t=!1){let a=t?U.OFF:pe(),o=M();if(N.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${o} - repeatMode: ${N.getKeyForValue(U,a)}`),e&&a===U.ONE)n.player.embedded.seekTo(0),n.player.play(he);else if(e&&o===null&&a===U.ALL)K(M(null)),Y(0);else if(o===null)if(l.list.showLoadMoreTracks){let u=await Pt();e&&u&&K(M())}else B(C.nextPage,e);else e?K(o):w(f.PAUSED)}function sr(){m()===!1&&n.autoplayData!==null&&(H.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),H.add(c.YOUTUBE,-1,M())),m()===!1&&Jt(!0,!0)}function nr(){n.currentTrackId=null,w(f.PAUSED)}function or(){let e=Q("div.track-entry.current");if(e!==null){let t=Tt("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:m(),currentTrack:a+1,trackType:S.YOUTUBE,position:Math.ceil(n.player.embedded.getCurrentTime()),numTracks:n.player.getNumTracks(),trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function lr(){N.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){N.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:ir,onStateChange:cr,onError:he}});n.player=new tt(a),ie(n.player,o=>n.player.embedded.seekTo(o)),p(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ir(){N.log("onYouTubePlayerReady()"),n.autoplayData?.autoplay===!0&&H.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),ce(Ht,Ge,Xt,Ke),p(s.PLAYBACK_LOADING,{loadingPercent:66}),$e.ready(n.player),kt(n.player),Ke(!0),p(s.PLAYBACK_READY,{resetProgressBar:!1}),qt(n.autoplayData?.autoplay===!0)}function cr(e){switch(N.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${n.currentTrackId}`),H.add(c.YOUTUBE,e.data,n.currentTrackId),e.data!==YT.PlayerState.PLAYING&&G(),e.data){case YT.PlayerState.UNSTARTED:ur();break;case YT.PlayerState.CUED:n.player.setPlayerState(e.data);break;case YT.PlayerState.BUFFERING:p(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:dr(),p(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:w(f.PAUSED);break;case YT.PlayerState.ENDED:$e.stop(),p(s.MEDIA_ENDED),Jt(l.playback.autoplay);break}}function ur(){H.ytAutoplayBlocked(n.currentTrackId,3e3)&&(w(f.PAUSED),n.currentSnackbarId=T("Autoplay blocked, Play to continue",0,"play",()=>n.player.play(he))),n.playerReady===!1&&(n.playerReady=!0,p(s.PLAYBACK_LOADING,{loadingPercent:0}))}function dr(){ne(n.currentSnackbarId),n.firstStatePlaying&&(n.firstStatePlaying=!1,n.autoplayData=null,setTimeout(()=>{l.playback.autoplay&&m()&&Math.round(window.pageYOffset)<=1&&st(rt.SITE_MAX_WIDTH_MOBILE)&&Y(0)},6e3))}function he(e){N.log(`onYouTubePlayerError(): ${e.data} - trackId: ${n.currentTrackId}`),At("Error!"),H.add(c.YOUTUBE,d.PLAYER_ERROR,n.currentTrackId),T("Unable to play track, skipping to next",5,"Stop",nr,sr),re("EVENT_MEDIA_UNAVAILABLE",{mediaUrl:n.player.embedded.getVideoUrl(),mediaTitle:`${n.player.getArtist()} - ${n.player.getTitle()}`})}var Ie=P("screen-wakelock"),Le={wakeLock:null};function jt(){l.mobile.keepScreenOn&&document.addEventListener("click",zt)}function zt(){Ie.log("enableScreenWakeLock()"),document.removeEventListener("click",zt),yr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&l.mobile.keepScreenOn&&pr()})}function pr(){Qt()&&Le.wakeLock===null&&Zt()}function Qt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function yr(){Qt()?document.visibilityState==="visible"&&await Zt()!==!0&&(Ie.log("enableWakeLock(): Screen Wake Lock request failed"),T("Keep Screen On failed",5,"Disable",()=>l.mobile.keepScreenOn=!1)):(Ie.log("enableWakeLock(): Screen Wake Lock is not supported"),T("Keep Screen On is not supported",5,"Disable",()=>l.mobile.keepScreenOn=!1))}async function Zt(){try{return Le.wakeLock=await navigator.wakeLock.request("screen"),Le.wakeLock.addEventListener("release",()=>{Le.wakeLock=null}),!0}catch(e){Ie.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var Z=P("playback-interaction"),ea=new ke(10),E={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null},gr={doubleClickDelay:500};document.addEventListener("DOMContentLoaded",()=>{je(),Z.log("DOMContentLoaded"),ze(),Ct()?E.player=Be:ht()&&(E.player=We),E.player!==null&&Er(),ct(E.player?.getStatus)});function Er(){Z.log("initShared()"),dt(),kr(),E.player.init(),E.siteNavUiElements=new qe("#site-navigation"),E.trackNavUiElements=new He("nav.track-navigation .nav-links"),W.init(),ge.init(),Tr(),jt()}function kr(){g(s.PLAYBACK_READY,Ar),g(s.MEDIA_CUE_NEXT,ta),g(s.MEDIA_ENDED,ta),g(s.MEDIA_TIME_REMAINING,Sr)}function Tr(){X(".playback-shuffle-control span","click",It),document.addEventListener("keydown",fr),document.addEventListener("keydown",mr),window.addEventListener("blur",Cr)}function fr(e){if(E.isPlaybackReady&&ge.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1){switch(e.code){case"Backquote":e.preventDefault(),Y(E.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),E.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":vt(e);break;case"ArrowLeft":br(e);break;case"ArrowRight":Pr(e);break;case"A":De.toggle();break;case"f":case"F":e.preventDefault(),W.toggle(document.getElementById(E.player.getStatus().iframeId));break;case"m":case"M":e.preventDefault(),E.player.toggleMute(),T(l.playback.masterMute?"Volume is muted (<b>m</b> to unmute)":"Volume is unmuted (<b>m</b> to mute)",3);break;case"p":case"P":lt.toggle();break;case"r":case"R":T(`${gt().title} (<b>r</b> to change)`,3);break;case"x":case"X":it.toggle();break}}}function mr(e){if(E.isPlaybackReady&&ge.allow())switch(e.key){case"MediaPlayPause":ut===!1&&(Z.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),E.player.togglePlayPause());break;case"MediaTrackPrevious":Z.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),E.player.prevTrack();break;case"MediaTrackNext":Z.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),E.player.nextTrack();break}}function br(e){e.preventDefault(),e.shiftKey===!0?te(null,C.prevPage):E.player.prevTrack()}function Pr(e){e.preventDefault(),e.shiftKey===!0?Xe(null):E.player.nextTrack()}function Xe(e){e?.preventDefault(),J()?E.player.getStatus().trackType===S.YOUTUBE?nt()===!1?j(E.player.getStatus().isPlaying):T("Loading next track, please wait...",3):te(null,C.nextPage):te(null,C.nextPage)}function Ar(){X(".playback-details-control","click",hr),X(".playback-thumbnail-control","click",Lr),X(".playback-timer-control","click",Ir),E.isPlaybackReady=!0}function ta(){l.playback.autoExitFullscreen&&W.exit()}function Sr(e){l.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=l.playback.timeRemainingSeconds&&W.exit()}function Cr(){ye()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function hr(){Y(E.player.getStatus().trackId),ye()&&l.list.showUpNextModal?ee("showUpNextModalHint","<b>Tip:</b> Click or tap Artist &amp; Title to show Up Next queue"):ee("showTrackDetailsHint","<b>Tip:</b> Click or tap Artist &amp; Title to show current track")}function Lr(){Lt()?(ea.add(c.MOUSE,d.MOUSE_CLICK,null),ee("showGalleryTrackThumbnailHint","<b>Tip:</b> Double click or tap Track Thumbnail for full screen"),ea.doubleClicked(c.MOUSE,d.MOUSE_CLICK,gr.doubleClickDelay)&&W.enter(document.getElementById(E.player.getStatus().iframeId))):ye()&&(Y(0),ee("showListTrackThumbnailHint","<b>Tip:</b> Click or tap Track Thumbnail to show player"))}function Ir(){De.toggle(),ee("showTrackTimerHint","<b>Tip:</b> Click or tap Track Timer to toggle Autoplay On / Off")}var qe=class extends Ne{elementClicked(){if(this.clicked("span.navbar-arrow-back"))return te(this.event,C.prevPage);if(this.clicked("span.navbar-arrow-fwd"))return Xe(this.event)}},He=class extends Ne{elementClicked(){if(this.clicked("div.nav-previous a"))return te(this.event,C.prevPage);if(this.clicked("div.nav-next a"))return Xe(this.event)}};function ee(e,t,a=0){l.tips[e]&&(T(t,a),l.tips[e]=!1)}function te(e,t){e?.preventDefault(),B(t,E.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
