import{$ as nt,A as Ie,Aa as ft,Ba as mt,Ca as bt,D as et,E as _,Ea as Pt,Fa as pe,Ga as St,Ha as $,Ia as O,Ja as At,N as ne,O as De,P as tt,Q as j,R as at,S as rt,T as ve,U as st,V as lt,W as s,X as g,Y as p,Z as T,_ as Ne,a as qe,aa as oe,b as P,ba as ie,c as ae,ca as ot,da as Y,e as re,ea as f,f as q,fa as it,ga as H,ha as ce,ia as ue,ja as z,k as A,ka as w,l as o,la as U,m as He,ma as de,na as ct,o as m,oa as ut,p as se,pa as dt,q as le,qa as Q,r as Xe,ra as pt,s as h,sa as yt,t as Je,ta as Ue,u as je,ua as gt,v as ze,va as V,w as Qe,wa as Et,xa as kt,y as Ze,ya as B,z as M,za as Tt}from"../chunk-TJWS5JQR.js";var Oe=P("eventlogger"),c={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},d={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},ra={eventSource:c.UNKNOWN,eventType:d.UNKNOWN,uId:null,timeStamp:0},ye=class{constructor(t=10){this.log=[],this.maxEntries=t,this.lastPos=0,this.matchCount=0}add(t,a,l,u=Date.now()){let y=Object.create(ra);y.eventSource=t,y.eventType=a,y.uId=l,y.timeStamp=u,this.log.length<this.maxEntries?this.log.push(y):(this.log.shift(),this.log.push(y))}clear(){this.log=[]}initMatch(){this.lastPos=this.log.length-1,this.matchCount=0}matchesEvent(t,a,l,u=null){this.log[this.lastPos-t].eventSource===a&&this.log[this.lastPos-t].eventType===l&&this.log[this.lastPos-t].uId===u&&this.matchCount++}matchesDelta(t,a){this.log[this.lastPos].timeStamp-this.log[this.lastPos-t].timeStamp<=a&&this.matchCount++}isPatternMatch(t,a){return this.matchCount===t?(Oe.log(`MATCH for: ${a}`),Oe.logEventLog(this.log,c,d),!0):!1}},ge=class extends ye{doubleClicked(t,a,l){return this.initMatch(),this.lastPos>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,l)),this.isPatternMatch(3,`${Oe.getKeyForValue(c,t)} Double Clicked`)}},X=class extends ye{ytAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.YOUTUBE,d.STATE_UNSTARTED,t),this.matchesEvent(1,c.YOUTUBE,d.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,d.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,c.ULTRAFUNK,d.CROSSFADE_START,null),this.matchesEvent(1,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(0,c.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var we={};qe(we,{getStatus:()=>Se,init:()=>$a,nextTrack:()=>_e,prevTrack:()=>Yt,toggleMute:()=>xt,togglePlayPause:()=>Pe});var F=class{constructor(){this.intervalId=-1,this.lastPosSeconds=0,this.isVisible=!0,this.config={updateTimerInterval:250,maxBufferingDelay:3}}init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}start(){this.stop(),this.intervalId=setInterval(()=>{this.isVisible&&this.updateProxy()},this.config.updateTimerInterval)}stop(){this.intervalId!==-1&&(clearInterval(this.intervalId),this.intervalId=-1),this.lastPosSeconds=0,ce(!1)}updateTimeRemainingWarning(t,a){if(o.playback.autoplay===!1&&o.playback.timeRemainingWarning&&this.lastPosSeconds!==t){let l=a-t;this.lastPosSeconds=t,l<=o.playback.timeRemainingSeconds?(ce(!0),p(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:l})):ce(!1)}}};var Re=class extends F{constructor(){super(),this.players=null,this.crossfadeInit=null}init(t,a){super.init(),this.players=t,this.crossfadeInit=a}updateProxy(){this.players.current.getPosition((t,a)=>this.updateCallback(t,a))}updateCallback(t,a=0){let l=Math.round(t/1e3);Y(t,l,a),l>0&&a>0&&(super.updateTimeRemainingWarning(l,a),this.updateAutoCrossfade(l,a))}updateAutoCrossfade(t,a){o.playback.masterMute===!1&&o.playback.autoplay&&o.gallery.autoCrossfade&&a-t===o.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.players.getCurrentTrack()+1<=this.players.getNumTracks()&&this.crossfadeInit(le.AUTO,{name:"Auto Crossfade",length:o.gallery.autoCrossfadeLength,curve:o.gallery.autoCrossfadeCurve})}},I=new Re;var b=P("embedded-players"),N=new X(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},la={maxPlaybackStartDelay:3};function Ct(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),ia(),fa()}function ke(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function ht(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.READY,{resetProgressBar:!0}):p(s.LOADING,ke())}function na(){document.querySelectorAll("single-track").forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),l=t.querySelector("iframe"),u=null;if(a===h.YOUTUBE){let y=new YT.Player(l.id,{events:{onReady:C=>ca(C,l.id),onStateChange:C=>ua(C,l.id),onError:C=>Ta(C,l.id)}});u=new Je(t.id,l.id,y,t.getAttribute("data-track-source-data")),u.setDuration(parseInt(t.getAttribute("data-track-duration")))}else if(a===h.SOUNDCLOUD){let y=SC.Widget(l.id);u=new je(t.id,l.id,y,l.src),y.bind(SC.Widget.Events.READY,()=>{u.setThumbnail(t.querySelector(".track-share-control span")),y.getDuration(C=>u.setDuration(Math.round(C/1e3))),ma(u,l.id)}),y.bind(SC.Widget.Events.PLAY,ba),y.bind(SC.Widget.Events.PAUSE,Pa),y.bind(SC.Widget.Events.FINISH,Sa),y.bind(SC.Widget.Events.ERROR,Aa)}u!==null&&(u.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(u))})}function fe(e,t){b.log("onPlayerError()"),b.log(e);let a=e.getTrackType()===h.YOUTUBE?c.YOUTUBE:c.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),N.add(a,d.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,oa(e,t))}function oa(e,t){let a=e.getArtist()||"N/A",l=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),mediaTitle:`${a} - ${l}`,mediaUrl:t}}function ia(){b.log("initYouTubeAPI()"),p(s.LOADING,ke()),window.onYouTubeIframeAPIReady=function(){b.log("onYouTubeIframeAPIReady()"),p(s.LOADING,ke()),na()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ca(e,t){let a=i.players.playerFromUid(t);b.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),e.target.getPlayerState()===-1&&a.setIsPlayable(!1),ht()}function ua(e,t){switch(N.add(c.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:da(t);break;case YT.PlayerState.BUFFERING:pa(t);break;case YT.PlayerState.PLAYING:ya(t);break;case YT.PlayerState.PAUSED:ga(t);break;case YT.PlayerState.CUED:Ea(t);break;case YT.PlayerState.ENDED:ka(t);break}}function da(e){b.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),N.ytAutoplayBlocked(e,3e3)&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function pa(e){if(b.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(o.playback.masterMute),t.setVolume(o.playback.masterVolume),p(s.MEDIA_LOADING)}}function ya(e){b.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.syncAll(e,i.playbackState.STATE.PLAY),I.start()}function ga(e){b.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.syncAll(e,i.playbackState.STATE.PAUSE),I.stop()):i.players.crossfade.stop()}function Ea(e){b.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`);let t=i.players.playerFromUid(e);"isSingleTrackNextCued"in t&&t.isSingleTrackNextCued&&(delete t.isSingleTrackNextCued,t.embeddedPlayer.getDuration()===0&&t.setIsPlayable(!1),b.log(`onYouTubePlayerStateChange: CUED      Duration: ${t.embeddedPlayer.getDuration()} - isPlayable: ${t.getIsPlayable()}`))}function ka(e){b.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Ta(e,t){b.log("onYouTubePlayerError: "+e.data);let a=i.players.playerFromUid(t);a.setIsPlayable(!1),fe(a,e.target.getVideoUrl())}function fa(){b.log("initSoundCloudAPI()"),p(s.LOADING,ke())}function ma(e,t){b.log(`onSCPlayerEventReady(): ${t} => ${e.getUid()} => ${e.getArtist()} - ${e.getTitle()}`),ht()}function ba(e){b.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),N.add(c.SOUNDCLOUD,d.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?N.scPlayDoubleTrigger(e.soundId,la.maxPlaybackStartDelay*1e3)&&i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(o.playback.masterMute),i.players.current.setVolume(o.playback.masterVolume)),I.start()}function Pa(e){b.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),N.add(c.SOUNDCLOUD,d.STATE_PAUSED,e.soundId),N.scAutoplayBlocked(e.soundId,3e3)?(I.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):N.scWidgetPlayBlocked(e.soundId,3e4)?(I.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PAUSE),I.stop())}):i.players.crossfade.stop()}function Sa(e){b.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Aa(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);b.log(`onSoundCloudPlayerEvent: ERROR for track: ${i.players.trackFromUid(e.id)}. ${t.getArtist()} - ${t.getTitle()} - [${t.getUid()} / ${t.getIframeId()}]`),t.setIsPlayable(!1)})}var D=P("gallery-events"),me={snackbarId:0,nowPlayingIcons:null},xe={nowPlayingIconsSelector:"h2.entry-title"};function Lt(){D.log("init()"),me.nowPlayingIcons=document.querySelectorAll(xe.nowPlayingIconsSelector),g(s.MEDIA_PLAYING,ha),g(s.MEDIA_PAUSED,La),g(s.MEDIA_ENDED,Ia),g(s.MEDIA_CUE_NEXT,Da),g(s.CONTINUE_AUTOPLAY,va),g(s.RESUME_AUTOPLAY,Na),g(s.AUTOPLAY_BLOCKED,Ua),g(s.PLAYBACK_BLOCKED,Oa),g(s.MEDIA_UNAVAILABLE,Ra)}function ha(e){if(D.log(e),se(me.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${xe.nowPlayingIconsSelector}`);It(t),_(t,"playing-paused","now-playing-icon"),o.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function La(e){D.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${xe.nowPlayingIconsSelector}`).classList.add("playing-paused")}function Ia(e){D.log(e),e!==null&&e.data.numTracks>1&&It()}function Da(e){D.log(e),e.data.scrollToMedia&&O(e.data.trackId)}function va(e){D.log(e),De()&&e.data.trackType===h.YOUTUBE?j(!0):$(A.nextPage,!0)}function Na(e){let t=JSON.parse(sessionStorage.getItem(q.UF_AUTOPLAY));if(sessionStorage.removeItem(q.UF_AUTOPLAY),D.log(e),D.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function Ua(e){D.log(e),me.snackbarId=m("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function Oa(e){D.log(e),m("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Ye(e))}function Ra(e){D.log(e),Ya(e.data.trackId)?m("YouTube Premium track, skipping",5,"help",()=>window.location.href="/channel/premium/",()=>Ye(e)):(m("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Ye(e)),ae("EVENT_MEDIA_UNAVAILABLE",e.data))}function It(e){me.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Ye(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):De()?j(o.playback.autoplay):A.nextPage!==null&&$(A.nextPage,!0)}function Ya(e){let t=document.getElementById(e);return t!==null?t.classList.contains("uf_channel-premium"):!1}var Me=P("crossfade-controls"),be={players:{}},L={},K={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function vt(e,t){Me.log("init()"),be.players=e,L.crossfadePreset=new Ne(K.crossfadePresetSelector),L.crossfadeTo=new Ne(K.crossfadeToSelector),L.crossfadePreset.length>1&&L.crossfadeTo.length>1&&(L.crossfadePreset.forEach(a=>Nt(a,o.gallery.trackCrossfadeDefPreset)),L.crossfadeTo.clickCallback=t),g(s.READY,Ma)}function Ma(){Me.log("ready()"),L.crossfadePreset.length>1&&L.crossfadeTo.length>1&&(L.crossfadePreset.forEach(e=>{e.addEventListener("click",_a),_(e,T.DISABLED.CLASS,T.ENABLED.CLASS)}),L.crossfadeTo.forEach(e=>e.addEventListener("click",wa)),g(s.MEDIA_PLAYING,Dt),g(s.MEDIA_PAUSED,Dt))}function Nt(e,t){e.setAttribute(K.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${re.crossfade[t].name}`}function _a(e){let t=parseInt(e.target.getAttribute(K.crossfadePresetData));Nt(e.target,t+1<re.crossfade.length?t+1:0)}function wa(e){if(f()&&be.players.crossfade.isFading()===!1){let t=e.target.closest("single-track");if(t!==null){let a=t.querySelector("iframe"),l=parseInt(t.querySelector(K.crossfadePresetSelector).getAttribute(K.crossfadePresetData));_(t.querySelector(`div${K.crossfadeToSelector}`),T.ENABLED.CLASS,T.DISABLED.CLASS),L.crossfadeTo.clickCallback(be.players.uIdFromIframeId(a.id),re.crossfade[l])}}}function Dt(){let e=f(),t=e?be.players.getTrackData().currentTrack:-1;Me.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),L.crossfadeTo.forEach((a,l)=>{t===l+1?_(a,e?T.ENABLED.CLASS:T.DISABLED.CLASS,e?T.DISABLED.CLASS:T.ENABLED.CLASS):_(a,e?T.DISABLED.CLASS:T.ENABLED.CLASS,e?T.ENABLED.CLASS:T.DISABLED.CLASS)})}var Ut=P("gallery-players"),Ot=()=>{let e=null,t=null,a=[],l=new Map,u=0;return{indexMap:l,get crossfade(){return t},get current(){return a[u]},get next(){return a[u+1]},getPlayerIndex(){return u},setPlayerIndex(E){u=E},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return u+1},playerFromUid(E){return a[l.get(E)]},trackFromUid(E){return l.get(E)+1},isCurrent(E){return E===this.current.getUid()},init:y,add:C,uIdFromIframeId:R,stop:jt,mute:zt,getTrackData:Qt,prevTrack:Zt,nextTrack:ea,jumpToTrack:ta};function y(E){Ut.log("init()"),e=E,t=Xe(this),g(s.MEDIA_PLAYING,()=>t.start()),g(s.MEDIA_PAUSED,()=>t.stop())}function C(E){Ut.log(E),a.push(E),l.set(E.getUid(),a.length-1)}function R(E){return a.find(Le=>Le.iframeId===E).getUid()}function jt(){this.current.stop(),t.stop()}function zt(){this.current.mute(o.playback.masterMute),t.mute(o.playback.masterMute)}function Qt(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function Zt(E){return u>0?(u--,e(E),!0):!1}function ea(E){return u++,u<this.getNumTracks()?(e(E),!0):!1}function ta(E,Le,aa=!0){return E>0&&E<=this.getNumTracks()?(u=E-1,e(Le,aa),!0):!1}};var S=P("gallery-playback"),r={eventLog:null,players:{}},Rt={minCrossfadeToTime:5,maxBufferingDelay:3};function $a(){S.log("init()"),r.eventLog=N,Lt(),r.players=Ot(),r.players.init(Mt),oe(r.players,Ka),vt(r.players,Ha),I.init(r.players,wt),Ct(r.players,Vt,Xa)}function Pe(){f()?(H(),r.players.current.pause()):(it(),r.players.current.play(fe))}function Yt(){S.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),Y(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(f())&&z())})}function _e(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();S.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${o.playback.autoplay}`),!Fa(e,t)&&(t===!1?(r.players.stop(),e&&o.playback.autoplay===!1?H():r.players.nextTrack(f())&&w()):e&&(H(),o.playback.autoplay?p(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Fa(e,t){if(e&&o.playback.autoplay){let a=de();if(S.log(`repeatPlayback(): ${S.getKeyForValue(U,a)}`),a===U.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===U.ALL)return r.players.stop(),r.players.setPlayerIndex(0),Mt(!0),!0}return!1}function Ka(e){r.players.current.seekTo(e)}function xt(){o.playback.masterMute=o.playback.masterMute!==!0,r.players.mute()}function Ga(e,t=!0){S.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),p(s.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),w()}function Mt(e,t=!0){p(s.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(fe)}function _t(e,t=!0){S.log(`skipToTrack(): ${e} - ${t}`),t===!0&&f()===!1&&(r.eventLog.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),r.players.jumpToTrack(e,t)&&w())}function Wa(e,t=null){S.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?_t(r.players.trackFromUid(t),!0):Ga(t):e.autoplay&&(r.eventLog.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),Pe())}function qa(e,t,a=!1){S.log(`cueOrPlaySingleTrackNextById() - playMedia: ${a}`),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),ot(0),ue(),a?(r.eventLog.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),r.players.current.playTrackById(t.uid)):(r.players.current.cueTrackById(t.uid),r.players.current.isSingleTrackNextCued=!0)}function Se(){return{isPlaying:f(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function Ha(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(S.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),o.playback.masterMute===!1&&o.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=Rt.minCrossfadeToTime+Rt.maxBufferingDelay&&wt(le.TRACK,t,e)}))}function wt(e,t,a=null){r.eventLog.add(c.ULTRAFUNK,d.CROSSFADE_START,null);let l=r.players.crossfade.init(e,t,a);l!==null&&Vt.syncControls(l.fadeOutPlayer,l.fadeInPlayer)}function Xa(e,t=null){switch(S.log(`embeddedEventHandler() - event: ${S.getKeyForValue(s,e)}`),t!==null&&S.log(t),e){case s.MEDIA_ENDED:p(s.MEDIA_ENDED,Se()),_e(!0);break;case s.READY:ie(Yt,Pe,_e,xt),tt(qa),p(s.READY,t),p(s.RESUME_AUTOPLAY,null,{resumeAutoplay:Wa});break;case s.AUTOPLAY_BLOCKED:p(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:Pe});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:p(e,t,{skipToTrack:_t});break}}var Vt=(()=>{let e={PLAY:1,PAUSE:2},t=function l(u,y){if(S.log(`playbackState.syncAll() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(u)+1} - syncState: ${S.getKeyForValue(e,y)}`),r.players.isCurrent(u))y===e.PLAY?p(s.MEDIA_PLAYING,Se()):y===e.PAUSE&&p(s.MEDIA_PAUSED,Se());else{let C=r.players.getPlayerIndex(),R=r.players.indexMap.get(u);r.players.stop(),r.players.setPlayerIndex(R),a(C,R),l(u,y)}};function a(l,u){u>l?w():z()}return{STATE:e,syncAll:t,syncControls:a}})();var Ge={};qe(Ge,{getStatus:()=>er,init:()=>ja,nextTrack:()=>Ft,prevTrack:()=>$t,toggleMute:()=>$e,togglePlayPause:()=>Ke});var Ve=class extends F{constructor(){super(),this.player=null}ready(t){super.init(),this.player=t,g(s.MEDIA_PLAYING,()=>super.start())}updateProxy(){f()&&this.update(this.player.embedded.getCurrentTime(),this.player.getDuration())}update(t,a){if(t!==void 0){let l=Math.round(t);Y(t*1e3,l,a),l>0&&a>0&&super.updateTimeRemainingWarning(l,a)}}},Be=new Ve;var v=P("list-playback"),J=new X(10),n={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},Fe=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function ja(){v.log("init()"),ut(G),za()!==null?tr():m("No playable YouTube tracks!",0,"help",()=>ne("No playable tracks",Fe))}function za(){if(n.currentTrackId=V(),n.autoplayData=JSON.parse(sessionStorage.getItem(q.UF_AUTOPLAY)),sessionStorage.removeItem(q.UF_AUTOPLAY),n.currentTrackId!==null){if(n.autoplayData!==null&&n.autoplayData.trackId!==null){let e=n.autoplayData.trackId.match(Qe);if(e!==null){let t=Q(`[data-track-source-uid="${e[0]}"]`);t!==null&&(n.currentTrackId=t.id)}else if(n.autoplayData.trackId.match(/^track-(?!0)\d{1,9}$/i)!==null){let t=Q(`[data-track-id="${n.autoplayData.trackId}"]`);t!==null?Ue(t)===h.YOUTUBE?n.currentTrackId=t.id:m("Cannot play SoundCloud track",5,"help",()=>ne("Cannot play SoundCloud track",Fe)):m("Unable to cue track (not found)",5)}}Et(n.currentTrackId)}return v.log(`cueInitialTrack() - currentTrackId: ${n.currentTrackId} - autoplayData: ${n.autoplayData!==null?JSON.stringify(n.autoplayData):"N/A"}`),n.currentTrackId}function G(e,t=!0,a=!1){let l=Ue(yt(e));if(v.log(`setCurrentTrack() - nextTrackType: ${v.getKeyForValue(h,l)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),l===h.SOUNDCLOUD&&a){m("Cannot play SoundCloud track",5,"help",()=>ne("Cannot play SoundCloud track",Fe));return}e===n.currentTrackId?Ke():(f()&&n.player.embedded.stopVideo(),n.currentTrackId=e,p(s.MEDIA_CUE_NEXT,{nextTrackId:e,isPointerClick:a}),Bt(t))}function Bt(e){let t=ft();e?(n.player.embedded.loadVideoById(t),B(T.PLAYING),ue()):(n.player.embedded.cueVideoById(t),B(T.PAUSED))}function Ke(){n.currentTrackId===null?G(Q("div.track-entry.current").id):f()?n.player.embedded.pauseVideo():n.player.play(Ae)}function $e(e=!1){e===!1&&(o.playback.masterMute=o.playback.masterMute!==!0),o.playback.masterMute?n.player.embedded.mute():n.player.embedded.unMute()}function $t(){let e=gt(),t=n.player.embedded.getCurrentTime();e!==null&&t<=5?(G(e,f()),z()):t!==0&&(n.player.embedded.seekTo(0),Y(0,0,n.player.getDuration()))}function Ft(){let e=V();e!==null&&(G(e,f()),w())}async function Kt(e=!1,t=!1){let a=t?U.OFF:de(),l=V();if(v.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${l} - repeatMode: ${v.getKeyForValue(U,a)}`),e&&a===U.ONE)n.player.embedded.seekTo(0),n.player.play(Ae);else if(e&&l===null&&a===U.ALL)G(V(null)),O(0);else if(l===null)if(o.list.showLoadMoreTracks){let u=await kt();e&&u&&G(V())}else $(A.nextPage,e);else e?G(l):B(T.PAUSED)}function Qa(){f()===!1&&n.autoplayData!==null&&(J.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),J.add(c.YOUTUBE,-1,V())),f()===!1&&Kt(!0,!0)}function Za(){n.currentTrackId=null,B(T.PAUSED)}function er(){let e=Q("div.track-entry.current");if(e!==null){let t=pt("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:f(),currentTrack:a+1,trackType:h.YOUTUBE,position:Math.ceil(n.player.embedded.getCurrentTime()),numTracks:n.player.getNumTracks(),trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function tr(){v.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){v.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:ar,onStateChange:rr,onError:Ae}});n.player=new ze(a),oe(n.player,l=>n.player.embedded.seekTo(l)),p(s.LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ar(){v.log("onYouTubePlayerReady()"),n.autoplayData?.autoplay===!0&&J.add(c.ULTRAFUNK,d.RESUME_AUTOPLAY,null),ie($t,Ke,Ft,$e),p(s.LOADING,{loadingPercent:66}),Be.ready(n.player),dt(n.player),$e(!0),p(s.READY,{resetProgressBar:!1}),Bt(n.autoplayData?.autoplay===!0)}function rr(e){switch(v.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${n.currentTrackId}`),J.add(c.YOUTUBE,e.data,n.currentTrackId),e.data!==YT.PlayerState.PLAYING&&H(),e.data){case YT.PlayerState.UNSTARTED:sr();break;case YT.PlayerState.CUED:n.player.setPlayerState(e.data);break;case YT.PlayerState.BUFFERING:p(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:lr(),p(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:B(T.PAUSED);break;case YT.PlayerState.ENDED:Be.stop(),p(s.MEDIA_ENDED),Kt(o.playback.autoplay);break}}function sr(){J.ytAutoplayBlocked(n.currentTrackId,3e3)&&(B(T.PAUSED),n.currentSnackbarId=m("Autoplay blocked, Play to continue",0,"play",()=>n.player.play(Ae))),n.playerReady===!1&&(n.playerReady=!0,p(s.LOADING,{loadingPercent:0}))}function lr(){se(n.currentSnackbarId),n.firstStatePlaying&&(n.firstStatePlaying=!1,n.autoplayData=null,setTimeout(()=>{o.playback.autoplay&&f()&&Math.round(window.pageYOffset)<=1&&et(Ze.SITE_MAX_WIDTH_MOBILE)&&O(0)},6e3))}function Ae(e){v.log(`onYouTubePlayerError(): ${e.data} - trackId: ${n.currentTrackId}`),Tt("Error!"),J.add(c.YOUTUBE,d.PLAYER_ERROR,n.currentTrackId),m("Unable to play track, skipping to next",5,"Stop",Za,Qa),ae("EVENT_MEDIA_UNAVAILABLE",{mediaUrl:n.player.embedded.getVideoUrl(),mediaTitle:`${n.player.getArtist()} - ${n.player.getTitle()}`})}var he=P("screen-wakelock"),Ce={wakeLock:null};function Gt(){o.mobile.keepScreenOn&&document.addEventListener("click",Wt)}function Wt(){he.log("enableScreenWakeLock()"),document.removeEventListener("click",Wt),or(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&o.mobile.keepScreenOn&&nr()})}function nr(){qt()&&Ce.wakeLock===null&&Ht()}function qt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function or(){qt()?document.visibilityState==="visible"&&await Ht()!==!0&&(he.log("enableWakeLock(): Screen Wake Lock request failed"),m("Keep Screen On failed",5,"Disable",()=>o.mobile.keepScreenOn=!1)):(he.log("enableWakeLock(): Screen Wake Lock is not supported"),m("Keep Screen On is not supported",5,"Disable",()=>o.mobile.keepScreenOn=!1))}async function Ht(){try{return Ce.wakeLock=await navigator.wakeLock.request("screen"),Ce.wakeLock.addEventListener("release",()=>{Ce.wakeLock=null}),!0}catch(e){he.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var Z=P("playback-interaction"),Xt=new ge(10),k={player:null,isPlaybackReady:!1},ir={doubleClickDelay:500};document.addEventListener("DOMContentLoaded",()=>{Z.log("DOMContentLoaded"),He(),mt()?k.player=we:bt()&&(k.player=Ge),k.player!==null&&cr(),st(k.player?.getStatus)});function cr(){Z.log("initShared()"),nt(),ur(),k.player.init(),te.init(),We.init(),dr(),Gt()}function ur(){g(s.READY,gr),g(s.MEDIA_CUE_NEXT,Jt),g(s.MEDIA_ENDED,Jt),g(s.MEDIA_TIME_REMAINING,Er)}function dr(){M(".playback-shuffle-control span","click",St),Ie("span.navbar-arrow-back","click",e=>W(e,A.prevPage)),Ie("span.navbar-arrow-fwd","click",e=>W(e,A.nextPage)),M("nav.track-navigation .nav-previous a","click",e=>W(e,A.prevPage)),M("nav.track-navigation .nav-next a","click",e=>W(e,A.nextPage)),document.addEventListener("keydown",pr),document.addEventListener("keydown",yr),window.addEventListener("blur",kr)}function pr(e){if(k.isPlaybackReady&&We.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1){switch(e.code){case"Backquote":e.preventDefault(),O(k.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),k.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":At(e);break;case"ArrowLeft":e.preventDefault(),e.shiftKey===!0?W(null,A.prevPage):k.player.prevTrack();break;case"ArrowRight":e.preventDefault(),e.shiftKey===!0?W(null,A.nextPage):k.player.nextTrack();break;case"A":ve.toggle();break;case"f":case"F":e.preventDefault(),te.toggle(document.getElementById(k.player.getStatus().iframeId));break;case"m":case"M":e.preventDefault(),k.player.toggleMute(),m(o.playback.masterMute?"Volume is muted (<b>m</b> to unmute)":"Volume is unmuted (<b>m</b> to mute)",3);break;case"n":case"N":o.experimental.singleTrackNextNoReload&&(e.preventDefault(),k.player.getStatus().trackType===h.YOUTUBE?j(k.player.getStatus().isPlaying):W(null,A.nextPage));break;case"p":case"P":at.toggle();break;case"r":case"R":m(`${ct().title} (<b>r</b> to change)`,3);break;case"x":case"X":rt.toggle();break}}}function yr(e){if(k.isPlaybackReady&&We.allow())switch(e.key){case"MediaPlayPause":lt===!1&&(Z.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),k.player.togglePlayPause());break;case"MediaTrackPrevious":Z.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),k.player.prevTrack();break;case"MediaTrackNext":Z.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),k.player.nextTrack();break}}function gr(){M(".playback-details-control","click",Tr),M(".playback-thumbnail-control","click",fr),M(".playback-timer-control","click",mr),k.isPlaybackReady=!0}function Jt(){o.playback.autoExitFullscreen&&te.exit()}function Er(e){o.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=o.playback.timeRemainingSeconds&&te.exit()}function kr(){pe()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function Tr(){O(k.player.getStatus().trackId),pe()&&o.list.showUpNextModal?ee("showUpNextModalHint","<b>Tip:</b> Click or tap Artist &amp; Title to show Up Next queue"):ee("showTrackDetailsHint","<b>Tip:</b> Click or tap Artist &amp; Title to show current track")}function fr(){Pt()?(Xt.add(c.MOUSE,d.MOUSE_CLICK,null),ee("showGalleryTrackThumbnailHint","<b>Tip:</b> Double click or tap Track Thumbnail for full screen"),Xt.doubleClicked(c.MOUSE,d.MOUSE_CLICK,ir.doubleClickDelay)&&te.enter(document.getElementById(k.player.getStatus().iframeId))):pe()&&(O(0),ee("showListTrackThumbnailHint","<b>Tip:</b> Click or tap Track Thumbnail to show player"))}function mr(){ve.toggle(),ee("showTrackTimerHint","<b>Tip:</b> Click or tap Track Timer to toggle Autoplay On / Off")}function ee(e,t,a=0){o.tips[e]&&(m(t,a),o.tips[e]=!1)}function W(e,t){e?.preventDefault(),$(t,k.player.getStatus().isPlaying)}var te=(()=>{let e=new Event("fullscreenElement"),t=null;return{init:a,enter:u,exit:y,toggle:C};function a(){document.addEventListener("fullscreenchange",l),document.addEventListener("webkitfullscreenchange",l)}function l(){t=document.fullscreenElement!==null?document.fullscreenElement.id:null,e.fullscreenTarget=t,document.dispatchEvent(e)}function u(R){R.requestFullscreen()}function y(){t!==null&&(document.exitFullscreen(),t=null)}function C(R){t===null?u(R):y()}})(),We=(()=>{let e=!1;return{allow(){return e},init:t};function t(){e=o.playback.keyboardShortcuts,document.addEventListener("allowKeyboardShortcuts",()=>{o.playback.keyboardShortcuts&&(e=!0)}),document.addEventListener("denyKeyboardShortcuts",()=>{o.playback.keyboardShortcuts&&(e=!1)})}})();
//# sourceMappingURL=interaction.js.map
