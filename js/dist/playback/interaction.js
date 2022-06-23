import{$ as De,A as Ie,Aa as ft,Ba as mt,Ca as bt,D as et,Da as Pt,E as M,Fa as At,Ga as pe,Ha as St,Ia as $,Ja as Y,Ka as Ct,N as le,O as ve,P as tt,Q as at,R as j,S as rt,T as nt,U as Ne,V as st,W as lt,X as n,Y as g,Z as p,_ as f,a as qe,aa as ot,b as P,ba as oe,c as ae,ca as ie,da as it,e as re,ea as R,f as q,fa as m,ga as ct,ha as H,ia as ce,ja as ue,k as S,ka as z,l as o,la as w,m as He,ma as U,na as de,o as T,oa as ut,p as ne,pa as dt,q as se,qa as pt,r as Xe,ra as Q,s as L,sa as yt,t as Je,ta as gt,u as je,ua as Ue,v as ze,va as Et,w as Qe,wa as B,xa as kt,y as Ze,ya as Tt,z as x,za as V}from"../chunk-KVFI4JZN.js";var Ye=P("eventlogger"),u={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},d={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},sa={eventSource:u.UNKNOWN,eventType:d.UNKNOWN,uId:null,timeStamp:0},ye=class{constructor(t=10){this.log=[],this.maxEntries=t,this.lastPos=0,this.matchCount=0}add(t,a,s,c=Date.now()){let y=Object.create(sa);y.eventSource=t,y.eventType=a,y.uId=s,y.timeStamp=c,this.log.length<this.maxEntries?this.log.push(y):(this.log.shift(),this.log.push(y))}clear(){this.log=[]}initMatch(){this.lastPos=this.log.length-1,this.matchCount=0}matchesEvent(t,a,s,c=null){this.log[this.lastPos-t].eventSource===a&&this.log[this.lastPos-t].eventType===s&&this.log[this.lastPos-t].uId===c&&this.matchCount++}matchesDelta(t,a){this.log[this.lastPos].timeStamp-this.log[this.lastPos-t].timeStamp<=a&&this.matchCount++}isPatternMatch(t,a){return this.matchCount===t?(Ye.log(`MATCH for: ${a}`),Ye.logEventLog(this.log,u,d),!0):!1}},ge=class extends ye{doubleClicked(t,a,s){return this.initMatch(),this.lastPos>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,s)),this.isPatternMatch(3,`${Ye.getKeyForValue(u,t)} Double Clicked`)}},X=class extends ye{ytAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,u.ULTRAFUNK,d.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.YOUTUBE,d.STATE_UNSTARTED,t),this.matchesEvent(1,u.YOUTUBE,d.STATE_BUFFERING,t),this.matchesEvent(0,u.YOUTUBE,d.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.lastPos>=3&&(this.matchesEvent(3,u.ULTRAFUNK,d.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,u.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,d.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.lastPos>=2&&(this.matchesEvent(2,u.ULTRAFUNK,d.CROSSFADE_START,null),this.matchesEvent(1,u.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesEvent(0,u.SOUNDCLOUD,d.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var we={};qe(we,{getStatus:()=>Ae,init:()=>Fa,nextTrack:()=>Me,prevTrack:()=>xt,toggleMute:()=>Mt,togglePlayPause:()=>Pe});var K=class{constructor(){this.intervalId=-1,this.lastPosSeconds=0,this.isVisible=!0,this.config={updateTimerInterval:250,maxBufferingDelay:3}}init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}start(){this.stop(),this.intervalId=setInterval(()=>{this.isVisible&&this.updateProxy()},this.config.updateTimerInterval)}stop(){this.intervalId!==-1&&(clearInterval(this.intervalId),this.intervalId=-1),this.lastPosSeconds=0,ce(!1)}updateTimeRemainingWarning(t,a){if(o.playback.autoplay===!1&&o.playback.timeRemainingWarning&&this.lastPosSeconds!==t){let s=a-t;this.lastPosSeconds=t,s<=o.playback.timeRemainingSeconds?(ce(!0),p(n.MEDIA_TIME_REMAINING,{timeRemainingSeconds:s})):ce(!1)}}};var Oe=class extends K{constructor(){super(),this.players=null,this.crossfadeInit=null}init(t,a){super.init(),this.players=t,this.crossfadeInit=a}updateProxy(){this.players.current.getPosition((t,a)=>this.updateCallback(t,a))}updateCallback(t,a=0){let s=Math.round(t/1e3);R(t,s,a),s>0&&a>0&&(super.updateTimeRemainingWarning(s,a),this.updateAutoCrossfade(s,a))}updateAutoCrossfade(t,a){o.playback.masterMute===!1&&o.playback.autoplay&&o.gallery.autoCrossfade&&a-t===o.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.players.getCurrentTrack()+1<=this.players.getNumTracks()&&this.crossfadeInit(se.AUTO,{name:"Auto Crossfade",length:o.gallery.autoCrossfadeLength,curve:o.gallery.autoCrossfadeCurve})}},I=new Oe;var b=P("embedded-players"),D=new X(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},oa={maxPlaybackStartDelay:3};function ht(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),ua(),ba()}function ke(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function It(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(n.PLAYBACK_READY,{resetProgressBar:!0}):p(n.PLAYBACK_LOADING,ke())}function ia(){let e=document.querySelectorAll("single-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),s=t.querySelector("iframe"),c=null;if(a===L.YOUTUBE)e.length===1&&s===null?c=Lt("youtube-player",t,!0):c=Lt(s.id,t,!1);else if(a===L.SOUNDCLOUD){let y=SC.Widget(s.id);c=new je(t.id,s.id,y,s.src),y.bind(SC.Widget.Events.READY,()=>{c.setThumbnail(t),y.getDuration(C=>c.setDuration(Math.round(C/1e3))),Pa(c,s.id)}),y.bind(SC.Widget.Events.PLAY,Aa),y.bind(SC.Widget.Events.PAUSE,Sa),y.bind(SC.Widget.Events.FINISH,Ca),y.bind(SC.Widget.Events.ERROR,La)}c!==null&&(c.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(c))})}function Lt(e,t,a=!1){let s=t.getAttribute("data-track-source-uid"),c=new YT.Player(e,{events:{onReady:C=>da(C,e),onStateChange:C=>pa(C,e),onError:C=>ma(C,e)},...a&&{videoId:s}}),y=new Je(t.id,e,c,s);return y.setDuration(parseInt(t.getAttribute("data-track-duration"))),y}function fe(e,t){b.log("onPlayerError()"),b.log(e);let a=e.getTrackType()===L.YOUTUBE?u.YOUTUBE:u.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),D.add(a,d.PLAYER_ERROR,e.getUid()),i.embeddedEvent(n.MEDIA_UNAVAILABLE,ca(e,t))}function ca(e,t){let a=e.getArtist()||"N/A",s=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),mediaTitle:`${a} - ${s}`,mediaUrl:t}}function ua(){b.log("initYouTubeAPI()"),p(n.PLAYBACK_LOADING,ke()),window.onYouTubeIframeAPIReady=function(){b.log("onYouTubeIframeAPIReady()"),p(n.PLAYBACK_LOADING,ke()),ia()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function da(e,t){let a=i.players.playerFromUid(t);b.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),e.target.getPlayerState()===-1&&a.setIsPlayable(!1),It()}function pa(e,t){switch(D.add(u.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:ya(t);break;case YT.PlayerState.BUFFERING:ga(t);break;case YT.PlayerState.PLAYING:Ea(t);break;case YT.PlayerState.PAUSED:ka(t);break;case YT.PlayerState.CUED:Ta(t);break;case YT.PlayerState.ENDED:fa(t);break}}function ya(e){b.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),D.ytAutoplayBlocked(e,3e3)&&i.embeddedEvent(n.AUTOPLAY_BLOCKED)}function ga(e){if(b.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(o.playback.masterMute),t.setVolume(o.playback.masterVolume),p(n.MEDIA_LOADING)}}function Ea(e){b.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.syncAll(e,i.playbackState.STATE.PLAY),I.start()}function ka(e){b.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.syncAll(e,i.playbackState.STATE.PAUSE),I.stop()):i.players.crossfade.stop()}function Ta(e){b.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`);let t=i.players.playerFromUid(e);"isSingleTrackNextCued"in t&&t.isSingleTrackNextCued&&(delete t.isSingleTrackNextCued,t.embeddedPlayer.getDuration()===0&&t.setIsPlayable(!1),b.log(`onYouTubePlayerStateChange: CUED      Duration: ${t.embeddedPlayer.getDuration()} - isPlayable: ${t.getIsPlayable()}`))}function fa(e){b.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(I.stop(),i.embeddedEvent(n.MEDIA_ENDED)):i.players.crossfade.stop()}function ma(e,t){b.log("onYouTubePlayerError: "+e.data);let a=i.players.playerFromUid(t);a.setIsPlayable(!1),fe(a,e.target.getVideoUrl())}function ba(){b.log("initSoundCloudAPI()"),p(n.PLAYBACK_LOADING,ke())}function Pa(e,t){b.log(`onSCPlayerEventReady(): ${t} => ${e.getUid()} => ${e.getArtist()} - ${e.getTitle()}`),It()}function Aa(e){b.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),D.add(u.SOUNDCLOUD,d.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?D.scPlayDoubleTrigger(e.soundId,oa.maxPlaybackStartDelay*1e3)&&i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(o.playback.masterMute),i.players.current.setVolume(o.playback.masterVolume)),I.start()}function Sa(e){b.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),D.add(u.SOUNDCLOUD,d.STATE_PAUSED,e.soundId),D.scAutoplayBlocked(e.soundId,3e3)?(I.stop(),i.embeddedEvent(n.AUTOPLAY_BLOCKED)):D.scWidgetPlayBlocked(e.soundId,3e4)?(I.stop(),i.embeddedEvent(n.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.syncAll(e.soundId,i.playbackState.STATE.PAUSE),I.stop())}):i.players.crossfade.stop()}function Ca(e){b.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(I.stop(),i.embeddedEvent(n.MEDIA_ENDED)):i.players.crossfade.stop()}function La(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);b.log(`onSoundCloudPlayerEvent: ERROR for track: ${i.players.trackFromUid(e.id)}. ${t.getArtist()} - ${t.getTitle()} - [${t.getUid()} / ${t.getIframeId()}]`),t.setIsPlayable(!1)})}var v=P("gallery-events"),me={snackbarId:0,nowPlayingIcons:null},_e={nowPlayingIconsSelector:"h2.entry-title"};function vt(){v.log("init()"),me.nowPlayingIcons=document.querySelectorAll(_e.nowPlayingIconsSelector),g(n.MEDIA_PLAYING,Ia),g(n.MEDIA_PAUSED,va),g(n.MEDIA_ENDED,Na),g(n.MEDIA_CUE_NEXT,Da),g(n.CONTINUE_AUTOPLAY,Ua),g(n.RESUME_AUTOPLAY,Ya),g(n.AUTOPLAY_BLOCKED,Oa),g(n.PLAYBACK_BLOCKED,Ra),g(n.MEDIA_UNAVAILABLE,_a)}function Ia(e){if(v.log(e),ne(me.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${_e.nowPlayingIconsSelector}`);Nt(t),M(t,"playing-paused","now-playing-icon"),o.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function va(e){v.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${_e.nowPlayingIconsSelector}`).classList.add("playing-paused")}function Na(e){v.log(e),e!==null&&e.data.numTracks>1&&Nt()}function Da(e){v.log(e),e.data.scrollToMedia&&Y(e.data.trackId)}function Ua(e){v.log(e),ve()&&e.data.trackType===L.YOUTUBE?j(!0):$(S.nextPage,!0)}function Ya(e){let t=JSON.parse(sessionStorage.getItem(q.UF_AUTOPLAY));if(sessionStorage.removeItem(q.UF_AUTOPLAY),v.log(e),v.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function Oa(e){v.log(e),me.snackbarId=T("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function Ra(e){v.log(e),T("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Re(e))}function _a(e){v.log(e),xa(e.data.trackId)?T("YouTube Premium track, skipping",5,"help",()=>window.location.href="/channel/premium/",()=>Re(e)):(T("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Re(e)),ae("EVENT_MEDIA_UNAVAILABLE",e.data))}function Nt(e){me.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Re(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):ve()?j(o.playback.autoplay):S.nextPage!==null&&$(S.nextPage,!0)}function xa(e){let t=document.getElementById(e);return t!==null?t.classList.contains("uf_channel-premium"):!1}var xe=P("crossfade-controls"),be={players:{}},h={},F={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function Ut(e,t){xe.log("init()"),be.players=e,h.crossfadePreset=new De(F.crossfadePresetSelector),h.crossfadeTo=new De(F.crossfadeToSelector),h.crossfadePreset.length>1&&h.crossfadeTo.length>1&&(h.crossfadePreset.forEach(a=>Yt(a,o.gallery.trackCrossfadeDefPreset)),h.crossfadeTo.clickCallback=t),g(n.PLAYBACK_READY,wa)}function wa(){xe.log("playbackReady()"),h.crossfadePreset.length>1&&h.crossfadeTo.length>1&&(h.crossfadePreset.forEach(e=>{e.addEventListener("click",Ba),M(e,f.DISABLED.CLASS,f.ENABLED.CLASS)}),h.crossfadeTo.forEach(e=>e.addEventListener("click",Va)),g(n.MEDIA_PLAYING,Dt),g(n.MEDIA_PAUSED,Dt))}function Yt(e,t){e.setAttribute(F.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${re.crossfade[t].name}`}function Ba(e){let t=parseInt(e.target.getAttribute(F.crossfadePresetData));Yt(e.target,t+1<re.crossfade.length?t+1:0)}function Va(e){if(m()&&be.players.crossfade.isFading()===!1){let t=e.target.closest("single-track");if(t!==null){let a=t.querySelector("iframe"),s=parseInt(t.querySelector(F.crossfadePresetSelector).getAttribute(F.crossfadePresetData));M(t.querySelector(`div${F.crossfadeToSelector}`),f.ENABLED.CLASS,f.DISABLED.CLASS),h.crossfadeTo.clickCallback(be.players.uIdFromIframeId(a.id),re.crossfade[s])}}}function Dt(){let e=m(),t=e?be.players.getTrackData().currentTrack:-1;xe.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),h.crossfadeTo.forEach((a,s)=>{t===s+1?M(a,e?f.ENABLED.CLASS:f.DISABLED.CLASS,e?f.DISABLED.CLASS:f.ENABLED.CLASS):M(a,e?f.DISABLED.CLASS:f.ENABLED.CLASS,e?f.ENABLED.CLASS:f.DISABLED.CLASS)})}var Ot=P("gallery-players"),Rt=()=>{let e=null,t=null,a=[],s=new Map,c=0;return{indexMap:s,get crossfade(){return t},get current(){return a[c]},get next(){return a[c+1]},getPlayerIndex(){return c},setPlayerIndex(E){c=E},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return c+1},playerFromUid(E){return a[s.get(E)]},trackFromUid(E){return s.get(E)+1},isCurrent(E){return E===this.current.getUid()},init:y,add:C,uIdFromIframeId:O,stop:Qt,mute:Zt,getTrackData:ea,prevTrack:ta,nextTrack:aa,jumpToTrack:ra};function y(E){Ot.log("init()"),e=E,t=Xe(this),g(n.MEDIA_PLAYING,()=>t.start()),g(n.MEDIA_PAUSED,()=>t.stop())}function C(E){Ot.log(E),a.push(E),s.set(E.getUid(),a.length-1)}function O(E){return a.find(he=>he.iframeId===E).getUid()}function Qt(){this.current.stop(),t.stop()}function Zt(){this.current.mute(o.playback.masterMute),t.mute(o.playback.masterMute)}function ea(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function ta(E){return c>0?(c--,e(E),!0):!1}function aa(E){return c++,c<this.getNumTracks()?(e(E),!0):!1}function ra(E,he,na=!0){return E>0&&E<=this.getNumTracks()?(c=E-1,e(he,na),!0):!1}};var A=P("gallery-playback"),r={eventLog:null,players:{}},_t={minCrossfadeToTime:5,maxBufferingDelay:3};function Fa(){A.log("init()"),r.eventLog=D,vt(),r.players=Rt(),r.players.init(wt),oe(r.players,Wa),Ut(r.players,Ja),I.init(r.players,Vt),ht(r.players,$t,ja)}function Pe(){m()?(H(),r.players.current.pause()):(ct(),r.players.current.play(fe))}function xt(){A.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),R(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(m())&&z())})}function Me(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();A.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${o.playback.autoplay}`),!Ga(e,t)&&(t===!1?(r.players.stop(),e&&o.playback.autoplay===!1?H():r.players.nextTrack(m())&&w()):e&&(H(),o.playback.autoplay?p(n.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Ga(e,t){if(e&&o.playback.autoplay){let a=de();if(A.log(`repeatPlayback(): ${A.getKeyForValue(U,a)}`),a===U.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===U.ALL)return r.players.stop(),r.players.setPlayerIndex(0),wt(!0),!0}return!1}function Wa(e){r.players.current.seekTo(e)}function Mt(){o.playback.masterMute=o.playback.masterMute!==!0,r.players.mute()}function qa(e,t=!0){A.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),p(n.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),w()}function wt(e,t=!0){p(n.MEDIA_CUE_NEXT,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(fe)}function Bt(e,t=!0){A.log(`skipToTrack(): ${e} - ${t}`),t===!0&&m()===!1&&(r.eventLog.add(u.ULTRAFUNK,d.RESUME_AUTOPLAY,null),r.players.jumpToTrack(e,t)&&w())}function Ha(e,t=null){A.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?Bt(r.players.trackFromUid(t),!0):qa(t):e.autoplay&&(r.eventLog.add(u.ULTRAFUNK,d.RESUME_AUTOPLAY,null),Pe())}function Xa(e,t,a=!1){A.log(`cueOrPlaySingleTrackNextById() - playMedia: ${a}`),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),it(0),ue(),a?(r.eventLog.add(u.ULTRAFUNK,d.RESUME_AUTOPLAY,null),r.players.current.playTrackById(t.uid)):(r.players.current.cueTrackById(t.uid),r.players.current.isSingleTrackNextCued=!0)}function Ae(){return{isPlaying:m(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function Ja(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(A.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),o.playback.masterMute===!1&&o.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=_t.minCrossfadeToTime+_t.maxBufferingDelay&&Vt(se.TRACK,t,e)}))}function Vt(e,t,a=null){r.eventLog.add(u.ULTRAFUNK,d.CROSSFADE_START,null);let s=r.players.crossfade.init(e,t,a);s!==null&&$t.syncControls(s.fadeOutPlayer,s.fadeInPlayer)}function ja(e,t=null){switch(A.log(`embeddedEventHandler() - event: ${A.getKeyForValue(n,e)}`),t!==null&&A.log(t),e){case n.MEDIA_ENDED:p(n.MEDIA_ENDED,Ae()),Me(!0);break;case n.PLAYBACK_READY:ie(xt,Pe,Me,Mt),at(Xa),p(n.PLAYBACK_READY,t),p(n.RESUME_AUTOPLAY,null,{resumeAutoplay:Ha});break;case n.AUTOPLAY_BLOCKED:p(n.AUTOPLAY_BLOCKED,null,{togglePlayPause:Pe});break;case n.PLAYBACK_BLOCKED:case n.MEDIA_UNAVAILABLE:p(e,t,{skipToTrack:Bt});break}}var $t=(()=>{let e={PLAY:1,PAUSE:2},t=function s(c,y){if(A.log(`playbackState.syncAll() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(c)+1} - syncState: ${A.getKeyForValue(e,y)}`),r.players.isCurrent(c))y===e.PLAY?p(n.MEDIA_PLAYING,Ae()):y===e.PAUSE&&p(n.MEDIA_PAUSED,Ae());else{let C=r.players.getPlayerIndex(),O=r.players.indexMap.get(c);r.players.stop(),r.players.setPlayerIndex(O),a(C,O),s(c,y)}};function a(s,c){c>s?w():z()}return{STATE:e,syncAll:t,syncControls:a}})();var Ge={};qe(Ge,{getStatus:()=>ar,init:()=>Qa,nextTrack:()=>Gt,prevTrack:()=>Ft,toggleMute:()=>$e,togglePlayPause:()=>Fe});var Be=class extends K{constructor(){super(),this.player=null}ready(t){super.init(),this.player=t,g(n.MEDIA_PLAYING,()=>super.start())}updateProxy(){m()&&this.update(this.player.embedded.getCurrentTime(),this.player.getDuration())}update(t,a){if(t!==void 0){let s=Math.round(t);R(t*1e3,s,a),s>0&&a>0&&super.updateTimeRemainingWarning(s,a)}}},Ve=new Be;var N=P("list-playback"),J=new X(10),l={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},Ke=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function Qa(){N.log("init()"),dt(G),Za()!==null?rr():T("No playable YouTube tracks!",0,"help",()=>le("No playable tracks",Ke))}function Za(){if(l.currentTrackId=B(),l.autoplayData=JSON.parse(sessionStorage.getItem(q.UF_AUTOPLAY)),sessionStorage.removeItem(q.UF_AUTOPLAY),l.currentTrackId!==null){if(l.autoplayData!==null&&l.autoplayData.trackId!==null){let e=l.autoplayData.trackId.match(Qe);if(e!==null){let t=Q(`[data-track-source-uid="${e[0]}"]`);t!==null&&(l.currentTrackId=t.id)}else if(l.autoplayData.trackId.match(/^track-(?!0)\d{1,9}$/i)!==null){let t=Q(`[data-track-id="${l.autoplayData.trackId}"]`);t!==null?Ue(t)===L.YOUTUBE?l.currentTrackId=t.id:T("Cannot play SoundCloud track",5,"help",()=>le("Cannot play SoundCloud track",Ke)):T("Unable to cue track (not found)",5)}}kt(l.currentTrackId)}return N.log(`cueInitialTrack() - currentTrackId: ${l.currentTrackId} - autoplayData: ${l.autoplayData!==null?JSON.stringify(l.autoplayData):"N/A"}`),l.currentTrackId}function G(e,t=!0,a=!1){let s=Ue(gt(e));if(N.log(`setCurrentTrack() - nextTrackType: ${N.getKeyForValue(L,s)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),s===L.SOUNDCLOUD&&a){T("Cannot play SoundCloud track",5,"help",()=>le("Cannot play SoundCloud track",Ke));return}e===l.currentTrackId?Fe():(m()&&l.player.embedded.stopVideo(),l.currentTrackId=e,p(n.MEDIA_CUE_NEXT,{nextTrackId:e,isPointerClick:a}),Kt(t))}function Kt(e){let t=mt();e?(l.player.embedded.loadVideoById(t),V(f.PLAYING),ue()):(l.player.embedded.cueVideoById(t),V(f.PAUSED))}function Fe(){l.currentTrackId===null?G(Q("div.track-entry.current").id):m()?l.player.embedded.pauseVideo():l.player.play(Se)}function $e(e=!1){e===!1&&(o.playback.masterMute=o.playback.masterMute!==!0),o.playback.masterMute?l.player.embedded.mute():l.player.embedded.unMute()}function Ft(){let e=Et(),t=l.player.embedded.getCurrentTime();e!==null&&t<=5?(G(e,m()),z()):t!==0&&(l.player.embedded.seekTo(0),R(0,0,l.player.getDuration()))}function Gt(){let e=B();e!==null&&(G(e,m()),w())}async function Wt(e=!1,t=!1){let a=t?U.OFF:de(),s=B();if(N.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${s} - repeatMode: ${N.getKeyForValue(U,a)}`),e&&a===U.ONE)l.player.embedded.seekTo(0),l.player.play(Se);else if(e&&s===null&&a===U.ALL)G(B(null)),Y(0);else if(s===null)if(o.list.showLoadMoreTracks){let c=await Tt();e&&c&&G(B())}else $(S.nextPage,e);else e?G(s):V(f.PAUSED)}function er(){m()===!1&&l.autoplayData!==null&&(J.add(u.ULTRAFUNK,d.RESUME_AUTOPLAY,null),J.add(u.YOUTUBE,-1,B())),m()===!1&&Wt(!0,!0)}function tr(){l.currentTrackId=null,V(f.PAUSED)}function ar(){let e=Q("div.track-entry.current");if(e!==null){let t=yt("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:m(),currentTrack:a+1,trackType:L.YOUTUBE,position:Math.ceil(l.player.embedded.getCurrentTime()),numTracks:l.player.getNumTracks(),trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function rr(){N.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){N.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:nr,onStateChange:sr,onError:Se}});l.player=new ze(a),oe(l.player,s=>l.player.embedded.seekTo(s)),p(n.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function nr(){N.log("onYouTubePlayerReady()"),l.autoplayData?.autoplay===!0&&J.add(u.ULTRAFUNK,d.RESUME_AUTOPLAY,null),ie(Ft,Fe,Gt,$e),p(n.PLAYBACK_LOADING,{loadingPercent:66}),Ve.ready(l.player),pt(l.player),$e(!0),p(n.PLAYBACK_READY,{resetProgressBar:!1}),Kt(l.autoplayData?.autoplay===!0)}function sr(e){switch(N.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${l.currentTrackId}`),J.add(u.YOUTUBE,e.data,l.currentTrackId),e.data!==YT.PlayerState.PLAYING&&H(),e.data){case YT.PlayerState.UNSTARTED:lr();break;case YT.PlayerState.CUED:l.player.setPlayerState(e.data);break;case YT.PlayerState.BUFFERING:p(n.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:or(),p(n.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:V(f.PAUSED);break;case YT.PlayerState.ENDED:Ve.stop(),p(n.MEDIA_ENDED),Wt(o.playback.autoplay);break}}function lr(){J.ytAutoplayBlocked(l.currentTrackId,3e3)&&(V(f.PAUSED),l.currentSnackbarId=T("Autoplay blocked, Play to continue",0,"play",()=>l.player.play(Se))),l.playerReady===!1&&(l.playerReady=!0,p(n.PLAYBACK_LOADING,{loadingPercent:0}))}function or(){ne(l.currentSnackbarId),l.firstStatePlaying&&(l.firstStatePlaying=!1,l.autoplayData=null,setTimeout(()=>{o.playback.autoplay&&m()&&Math.round(window.pageYOffset)<=1&&et(Ze.SITE_MAX_WIDTH_MOBILE)&&Y(0)},6e3))}function Se(e){N.log(`onYouTubePlayerError(): ${e.data} - trackId: ${l.currentTrackId}`),ft("Error!"),J.add(u.YOUTUBE,d.PLAYER_ERROR,l.currentTrackId),T("Unable to play track, skipping to next",5,"Stop",tr,er),ae("EVENT_MEDIA_UNAVAILABLE",{mediaUrl:l.player.embedded.getVideoUrl(),mediaTitle:`${l.player.getArtist()} - ${l.player.getTitle()}`})}var Le=P("screen-wakelock"),Ce={wakeLock:null};function qt(){o.mobile.keepScreenOn&&document.addEventListener("click",Ht)}function Ht(){Le.log("enableScreenWakeLock()"),document.removeEventListener("click",Ht),cr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&o.mobile.keepScreenOn&&ir()})}function ir(){Xt()&&Ce.wakeLock===null&&Jt()}function Xt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function cr(){Xt()?document.visibilityState==="visible"&&await Jt()!==!0&&(Le.log("enableWakeLock(): Screen Wake Lock request failed"),T("Keep Screen On failed",5,"Disable",()=>o.mobile.keepScreenOn=!1)):(Le.log("enableWakeLock(): Screen Wake Lock is not supported"),T("Keep Screen On is not supported",5,"Disable",()=>o.mobile.keepScreenOn=!1))}async function Jt(){try{return Ce.wakeLock=await navigator.wakeLock.request("screen"),Ce.wakeLock.addEventListener("release",()=>{Ce.wakeLock=null}),!0}catch(e){Le.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var Z=P("playback-interaction"),jt=new ge(10),k={player:null,isPlaybackReady:!1},ur={doubleClickDelay:500};document.addEventListener("DOMContentLoaded",()=>{Z.log("DOMContentLoaded"),He(),bt()?k.player=we:Pt()&&(k.player=Ge),k.player!==null&&dr(),st(k.player?.getStatus)});function dr(){Z.log("initShared()"),ot(),pr(),k.player.init(),te.init(),We.init(),yr(),qt()}function pr(){g(n.PLAYBACK_READY,mr),g(n.MEDIA_CUE_NEXT,zt),g(n.MEDIA_ENDED,zt),g(n.MEDIA_TIME_REMAINING,br)}function yr(){x(".playback-shuffle-control span","click",St),Ie("span.navbar-arrow-back","click",e=>W(e,S.prevPage)),Ie("span.navbar-arrow-fwd","click",e=>W(e,S.nextPage)),x("nav.track-navigation .nav-previous a","click",e=>W(e,S.prevPage)),x("nav.track-navigation .nav-next a","click",e=>W(e,S.nextPage)),document.addEventListener("keydown",gr),document.addEventListener("keydown",Er),window.addEventListener("blur",Pr)}function gr(e){if(k.isPlaybackReady&&We.allow()&&e.repeat===!1&&e.ctrlKey===!1&&e.altKey===!1){switch(e.code){case"Backquote":e.preventDefault(),Y(k.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),k.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":Ct(e);break;case"ArrowLeft":kr(e);break;case"ArrowRight":Tr(e);break;case"A":Ne.toggle();break;case"f":case"F":e.preventDefault(),te.toggle(document.getElementById(k.player.getStatus().iframeId));break;case"m":case"M":e.preventDefault(),k.player.toggleMute(),T(o.playback.masterMute?"Volume is muted (<b>m</b> to unmute)":"Volume is unmuted (<b>m</b> to mute)",3);break;case"n":case"N":fr(e);break;case"p":case"P":rt.toggle();break;case"r":case"R":T(`${ut().title} (<b>r</b> to change)`,3);break;case"x":case"X":nt.toggle();break}}}function Er(e){if(k.isPlaybackReady&&We.allow())switch(e.key){case"MediaPlayPause":lt===!1&&(Z.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),k.player.togglePlayPause());break;case"MediaTrackPrevious":Z.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),k.player.prevTrack();break;case"MediaTrackNext":Z.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),k.player.nextTrack();break}}function kr(e){e.preventDefault(),e.shiftKey===!0?W(null,S.prevPage):k.player.prevTrack()}function Tr(e){e.preventDefault(),e.shiftKey===!0?W(null,S.nextPage):k.player.nextTrack()}function fr(e){o.gallery.singleTrackNextNoReload&&(e.preventDefault(),k.player.getStatus().trackType===L.YOUTUBE?tt()===!1?j(k.player.getStatus().isPlaying):T("Loading next track, please wait...",3):W(null,S.nextPage))}function mr(){x(".playback-details-control","click",Ar),x(".playback-thumbnail-control","click",Sr),x(".playback-timer-control","click",Cr),k.isPlaybackReady=!0}function zt(){o.playback.autoExitFullscreen&&te.exit()}function br(e){o.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=o.playback.timeRemainingSeconds&&te.exit()}function Pr(){pe()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function Ar(){Y(k.player.getStatus().trackId),pe()&&o.list.showUpNextModal?ee("showUpNextModalHint","<b>Tip:</b> Click or tap Artist &amp; Title to show Up Next queue"):ee("showTrackDetailsHint","<b>Tip:</b> Click or tap Artist &amp; Title to show current track")}function Sr(){At()?(jt.add(u.MOUSE,d.MOUSE_CLICK,null),ee("showGalleryTrackThumbnailHint","<b>Tip:</b> Double click or tap Track Thumbnail for full screen"),jt.doubleClicked(u.MOUSE,d.MOUSE_CLICK,ur.doubleClickDelay)&&te.enter(document.getElementById(k.player.getStatus().iframeId))):pe()&&(Y(0),ee("showListTrackThumbnailHint","<b>Tip:</b> Click or tap Track Thumbnail to show player"))}function Cr(){Ne.toggle(),ee("showTrackTimerHint","<b>Tip:</b> Click or tap Track Timer to toggle Autoplay On / Off")}function ee(e,t,a=0){o.tips[e]&&(T(t,a),o.tips[e]=!1)}function W(e,t){e?.preventDefault(),$(t,k.player.getStatus().isPlaying)}var te=(()=>{let e=new Event("fullscreenElement"),t=null;return{init:a,enter:c,exit:y,toggle:C};function a(){document.addEventListener("fullscreenchange",s),document.addEventListener("webkitfullscreenchange",s)}function s(){t=document.fullscreenElement!==null?document.fullscreenElement.id:null,e.fullscreenTarget=t,document.dispatchEvent(e)}function c(O){O.requestFullscreen()}function y(){t!==null&&(document.exitFullscreen(),t=null)}function C(O){t===null?c(O):y()}})(),We=(()=>{let e=!1;return{allow(){return e},init:t};function t(){e=o.playback.keyboardShortcuts,document.addEventListener("allowKeyboardShortcuts",()=>{o.playback.keyboardShortcuts&&(e=!0)}),document.addEventListener("denyKeyboardShortcuts",()=>{o.playback.keyboardShortcuts&&(e=!1)})}})();
//# sourceMappingURL=interaction.js.map
