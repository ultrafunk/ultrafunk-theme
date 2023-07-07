import{$ as at,A as Xe,Aa as dt,B as Ce,Ba as yt,C as Je,Ca as x,D as je,Da as Et,E as ze,Ea as Tt,F as J,Fa as kt,Ga as gt,I as Qe,Ia as ft,J as B,Ja as ve,Ka as Ie,La as mt,Ma as K,Na as ce,O as Ze,Oa as Y,Pa as bt,Q as he,Qa as W,R as re,Ra as At,Sa as Pt,Ta as Ue,Ua as St,Va as L,Wa as j,X as et,Xa as Ct,Y as tt,Ya as ht,Za as z,_a as Lt,a as Ge,aa as s,ba as E,c as b,ca as d,d as We,da as g,ea as Le,fa as rt,ga as se,ha as le,i as ee,ia as st,j as F,ja as O,ka as h,la as f,ma as lt,na as G,oa as oe,pa as R,q as P,qa as ne,r as o,ra as ot,s as qe,sa as nt,ta as it,u as A,ua as ie,va as ct,w as te,wa as ut,x as ae,xa as De,y as He,ya as pt,z as C,za as w}from"../chunk-KRNXMRDE.js";var Q=b("eventlogger"),c={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},u={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70,CUE_PLAY_SINGLE_TRACK:80},ua={eventSource:c.UNKNOWN,eventType:u.UNKNOWN,uId:null,timeStamp:0},ue=class{#e=[];#t=0;#r=0;#a=0;constructor(t=10){this.#t=t}add(t,a,l=null,p=Date.now()){let k=Object.create(ua);k.eventSource=t,k.eventType=a,k.uId=l,k.timeStamp=p,this.#e.length<this.#t?this.#e.push(k):(this.#e.shift(),this.#e.push(k))}clear(){this.#e=[]}getLastPos(){return this.#a}initMatch(){this.#a=this.#e.length-1,this.#r=0}matchesEvent(t,a,l,p=null){this.#e[this.#a-t].eventSource===a&&this.#e[this.#a-t].eventType===l&&this.#e[this.#a-t].uId===p&&this.#r++}matchesDelta(t,a){this.#e[this.#a].timeStamp-this.#e[this.#a-t].timeStamp<=a&&this.#r++}isPatternMatch(t,a){return this.#r===t?(Q.log(`MATCH for: ${a}`),this.logEventMatch(),!0):!1}logEventMatch(){let t=[];for(let a=0;a<this.#e.length;a++){let l={eventSource:Q.getKeyForValue(c,this.#e[a].eventSource),eventType:Q.getKeyForValue(u,this.#e[a].eventType),uId:this.#e[a].uId,timeStamp:this.#e[a].timeStamp};t.push(l)}Q.log(t)}},pe=class extends ue{doubleClicked(t,a,l){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,l)),this.isPatternMatch(3,`${Q.getKeyForValue(c,t)} Double Clicked`)}},q=class extends ue{ytAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}ytSingleTrackAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK,null),this.matchesEvent(2,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Single Track Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.ULTRAFUNK,u.CROSSFADE_START,null),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var _e={};Ge(_e,{getStatus:()=>me,init:()=>Ha,nextTrack:()=>Oe,prevTrack:()=>wt,setVolume:()=>ja,toggleMute:()=>xt,togglePlayPause:()=>fe});var H=class{#e=-1;#t=0;isVisible=!0;config={updateTimerInterval:250,maxBufferingDelay:3};init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}updateTimer(){}updateVolumeMute(){}start(){this.stop(),this.#e=setInterval(()=>this.updateTimer(),this.config.updateTimerInterval)}stop(){this.#e!==-1&&(clearInterval(this.#e),this.#e=-1),this.#t=0,oe(!1)}updateOncePerSecond(t,a){if(this.#t!==t&&(this.#t=t,this.updateVolumeMute(),o.playback.autoplay===!1&&o.playback.timeRemainingWarning)){let l=a-t;l<=o.playback.timeRemainingSeconds?(oe(!0),d(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:l})):oe(!1)}}};var Ne=class extends H{#e=null;#t=null;#r(t,a=0){let l=Math.round(t/1e3);O(t,l,a),l>0&&a>0&&(super.updateOncePerSecond(l,a),this.#s(l,a))}#a(){return o.playback.autoplay&&o.gallery.autoCrossfade}#s(t,a){o.playback.masterMute===!1&&this.#a()&&a-t===o.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrack()+1<=this.#e.getNumTracks()&&this.#t(ae.AUTO,{name:"Auto Crossfade",length:o.gallery.autoCrossfadeLength,curve:o.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>ce(Math.round(t),this.#e.current.isMuted()))}},I=new Ne;var m=b("embedded-players"),U=new q(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},da={maxPlaybackStartDelay:3};function vt(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),Ta(),ha()}function ye(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function It(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):d(s.PLAYBACK_LOADING,ye())}function ya(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),l=t.querySelector("iframe"),p=null;if(a===C.YOUTUBE)e.length===1&&l===null?p=Dt("youtube-player",t,!0):p=Dt(l.id,t,!1);else if(a===C.SOUNDCLOUD){let k=SC.Widget(l.id);p=new Je(t.id,l.id,k,l.src),k.bind(SC.Widget.Events.READY,()=>La(l.id,t,p,k)),k.bind(SC.Widget.Events.PLAY,Da),k.bind(SC.Widget.Events.PAUSE,va),k.bind(SC.Widget.Events.FINISH,Ia),k.bind(SC.Widget.Events.ERROR,Ua)}p!==null&&(p.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(p))})}function Dt(e,t,a=!1){let l=t.getAttribute("data-track-source-uid"),p=new YT.Player(e,{events:{onReady:V=>ka(V,e),onStateChange:V=>ga(V,e),onError:V=>Ca(V,e)},...a&&{videoId:l}}),k=null;return a?k=new Ce(t.id,e,p,l):k=new Xe(t.id,e,p,l),k.setDuration(parseInt(t.getAttribute("data-track-duration"))),k}function Te(e,t){m.log("onPlayerError()"),m.log(e);let a=e.getTrackType()===C.YOUTUBE?c.YOUTUBE:c.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),U.add(a,u.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,Ea(e,t))}function Ea(e,t){let a=e.getArtist()||"N/A",l=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${l}`,mediaUrl:t}}function Ta(){m.log("initYouTubeAPI()"),d(s.PLAYBACK_LOADING,ye()),window.onYouTubeIframeAPIReady=function(){m.log("onYouTubeIframeAPIReady()"),d(s.PLAYBACK_LOADING,ye()),ya()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ka(e,t){let a=i.players.playerFromUid(t);e.target.getPlayerState()===-1?(m.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):m.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),It()}function ga(e,t){switch(U.add(c.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:fa(t);break;case YT.PlayerState.BUFFERING:ma(t);break;case YT.PlayerState.PLAYING:ba(t);break;case YT.PlayerState.PAUSED:Aa(t);break;case YT.PlayerState.CUED:Pa(t);break;case YT.PlayerState.ENDED:Sa(t);break}}function fa(e){m.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),(U.ytAutoplayBlocked(e,3e3)||U.ytSingleTrackAutoplayBlocked(e,3e3))&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function ma(e){if(m.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(o.playback.masterMute),t.setVolume(o.playback.masterVolume),d(s.MEDIA_LOADING)}}function ba(e){m.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.sync(e,i.playbackState.STATE.PLAY),I.start()}function Aa(e){m.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),I.stop()):i.players.crossfade.stop()}function Pa(e){m.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`)}function Sa(e){m.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Ca(e,t){let a=i.players.playerFromUid(t);e.data===150&&a instanceof Ce&&a.isCued()?(m.log("onYouTubePlayerError(150) - SingleTrack.isCued(): true"),a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(m.log("onYouTubePlayerError: "+e.data),a.setIsPlayable(!1),Te(a,e.target.getVideoUrl()))}function ha(){m.log("initSoundCloudAPI()"),d(s.PLAYBACK_LOADING,ye())}function La(e,t,a,l){m.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getUid()} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),l.getDuration(p=>{a.setDuration(Math.round(p/1e3)),t.setAttribute("data-track-duration",a.getDuration()),It()})}function Da(e){m.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?U.scPlayDoubleTrigger(e.soundId,da.maxPlaybackStartDelay*1e3)&&i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(o.playback.masterMute),i.players.current.setVolume(o.playback.masterVolume)),I.start()}function va(e){m.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PAUSED,e.soundId),U.scAutoplayBlocked(e.soundId,3e3)?(I.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):U.scWidgetPlayBlocked(e.soundId,3e4)?(I.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.sync(e.soundId,i.playbackState.STATE.PAUSE),I.stop())}):i.players.crossfade.stop()}function Ia(e){m.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Ua(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);m.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${e.id} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)})}var N=b("gallery-events"),ke={snackbarId:0,nowPlayingIcons:null},Re={nowPlayingIconsSelector:"h2.track-artist-title"};function Ut(){N.log("init()"),ke.nowPlayingIcons=document.querySelectorAll(Re.nowPlayingIconsSelector),E(s.MEDIA_PLAYING,Ra),E(s.MEDIA_PAUSED,Ya),E(s.MEDIA_ENDED,Oa),E(s.MEDIA_CUE_TRACK,_a),E(s.CONTINUE_AUTOPLAY,Ma),E(s.RESUME_AUTOPLAY,Va),E(s.AUTOPLAY_BLOCKED,Ba),E(s.PLAYBACK_BLOCKED,wa),E(s.MEDIA_UNAVAILABLE,xa)}function Ra(e){if(N.log(e),te(ke.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Re.nowPlayingIconsSelector}`);Nt(t),B(t,"playing-paused","now-playing-icon"),o.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Ya(e){N.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Re.nowPlayingIconsSelector}`).classList.add("playing-paused")}function Oa(e){N.log(e),e!==null&&e.data.numTracks>1&&Nt()}function _a(e){N.log(e),e.data.scrollToMedia&&Y(e.data.trackId)}function Ma(e){N.log(e),j()&&e.data.trackType===C.YOUTUBE?z(L.NEXT,!0):K(P.nextPage,!0)}function Va(e){let t=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY));if(sessionStorage.removeItem(F.UF_AUTOPLAY),N.log(e),N.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function Ba(e){N.log(e),ke.snackbarId=A("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function wa(e){N.log(e),A("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Rt(e))}function xa(e){N.log(e),A("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Rt(e))}function Nt(e){ke.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Rt(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):j()&&e.data.trackType===C.YOUTUBE?z(L.NEXT,o.playback.autoplay):P.nextPage!==null&&K(P.nextPage,!0)}var Ye=b("crossfade-controls"),ge={players:{}},D={},$={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function Ot(e,t){Ye.log("init()"),ge.players=e,D.crossfadePreset=Le($.crossfadePresetSelector),D.crossfadeTo=Le($.crossfadeToSelector),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(a=>_t(a,o.gallery.trackCrossfadeDefPreset)),D.crossfadeTo.clickCallback=t),E(s.PLAYBACK_READY,$a)}function $a(){Ye.log("playbackReady()"),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(e=>{e.addEventListener("click",Fa),B(e,g.DISABLED.CLASS,g.ENABLED.CLASS)}),D.crossfadeTo.forEach(e=>e.addEventListener("click",Ga)),E(s.MEDIA_PLAYING,Yt),E(s.MEDIA_PAUSED,Yt))}function _t(e,t){e.setAttribute($.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${ee.crossfade[t].name}`}function Fa(e){let t=parseInt(e.target.getAttribute($.crossfadePresetData));_t(e.target,t+1<ee.crossfade.length?t+1:0)}function Ga(e){if(f()&&ge.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),l=parseInt(t.querySelector($.crossfadePresetSelector).getAttribute($.crossfadePresetData));B(t.querySelector(`div${$.crossfadeToSelector}`),g.ENABLED.CLASS,g.DISABLED.CLASS),D.crossfadeTo.clickCallback(ge.players.uIdFromIframeId(a.id),ee.crossfade[l])}}}function Yt(){let e=f(),t=e?ge.players.getTrackData().currentTrack:-1;Ye.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),D.crossfadeTo.forEach((a,l)=>{t===l+1?B(a,e?g.ENABLED.CLASS:g.DISABLED.CLASS,e?g.DISABLED.CLASS:g.ENABLED.CLASS):B(a,e?g.DISABLED.CLASS:g.ENABLED.CLASS,e?g.ENABLED.CLASS:g.DISABLED.CLASS)})}var Mt=b("gallery-players"),Vt=()=>{let e=null,t=null,a=[],l=new Map,p=0;return{indexMap:l,get crossfade(){return t},get current(){return a[p]},get next(){return a[p+1]},getPlayerIndex(){return p},setPlayerIndex(T){p=T},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return p+1},playerFromUid(T){return a[l.get(T)]},trackFromUid(T){return l.get(T)+1},isCurrent(T){return T===this.current.getUid()},init:k,add:V,uIdFromIframeId:aa,stop:ra,mute:sa,getTrackData:la,prevTrack:oa,nextTrack:na,jumpToTrack:ia};function k(T){Mt.log("init()"),e=T,t=He(this),E(s.MEDIA_PLAYING,()=>t.start()),E(s.MEDIA_PAUSED,()=>t.stop())}function V(T){Mt.log(T),a.push(T),l.set(T.getUid(),a.length-1)}function aa(T){return a.find(Se=>Se.getIframeId()===T).getUid()}function ra(){this.current.stop(),t.stop()}function sa(){this.current.mute(o.playback.masterMute),t.mute(o.playback.masterMute)}function la(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function oa(T){return p>0?(p--,e(T),!0):!1}function na(T){return p++,p<this.getNumTracks()?(e(T),!0):!1}function ia(T,Se,ca=!0){return T>0&&T<=this.getNumTracks()?(p=T-1,e(Se,ca),!0):!1}};var S=b("gallery-playback"),r={eventLog:null,players:{}},Bt={minCrossfadeToTime:5,maxBufferingDelay:3};function Ha(){S.log("init()"),r.eventLog=U,Ut(),r.players=Vt(),r.players.init(Kt),se(r.players,Ja),Ot(r.players,er),I.init(r.players,Ft),vt(r.players,ar,tr)}function fe(){f()?(G(),r.players.current.pause()):(lt(),r.players.current.play(Te))}function wt(){S.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),O(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(f())?h():d(s.MEDIA_PREV_TRACK))})}function Oe(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();S.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${o.playback.autoplay}`),!Xa(e,t)&&(t===!1?(r.players.stop(),e&&o.playback.autoplay===!1?G():r.players.nextTrack(f())&&h()):t===!0&&e===!1?d(s.MEDIA_NEXT_TRACK):e&&(G(),o.playback.autoplay?d(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Xa(e,t){if(e&&o.playback.autoplay){let a=ne();if(S.log(`repeatPlayback(): ${S.getKeyForValue(R,a)}`),a===R.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===R.ALL)return r.players.stop(),r.players.setPlayerIndex(0),Kt(!0),!0}return!1}function Ja(e){r.players.current.seekTo(e)}function ja(){r.players.current.setVolume(o.playback.masterVolume)}function xt(){o.playback.masterMute=o.playback.masterMute!==!0,r.players.mute()}function za(e,t=!0){S.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),d(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),h()}function Kt(e,t=!0){d(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(Te)}function $t(e,t=!0){S.log(`skipToTrack(): ${e} - ${t}`),t===!0&&f()===!1&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.jumpToTrack(e,t)&&h())}function Qa(e,t=null){S.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?$t(r.players.trackFromUid(t),!0):za(t):e.autoplay&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),fe())}function Za(e,t,a=!1){S.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.eventLog.add(c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),st(0),h(),a?(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.current.playTrackById(t.uid)):r.players.current.cueTrackById(t.uid)}function me(){return{isPlaying:f(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function er(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(S.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),o.playback.masterMute===!1&&o.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=Bt.minCrossfadeToTime+Bt.maxBufferingDelay&&Ft(ae.TRACK,t,e)}))}function Ft(e,t,a=null){r.eventLog.add(c.ULTRAFUNK,u.CROSSFADE_START),r.players.crossfade.init(e,t,a)!==null&&h()}function tr(e,t=null){switch(S.log(`embeddedEventHandler() - event: ${S.getKeyForValue(s,e)}`),t!==null&&S.log(t),e){case s.MEDIA_ENDED:d(s.MEDIA_ENDED,me()),Oe(!0);break;case s.PLAYBACK_READY:le(wt,fe,Oe,xt),ht(Za),d(s.PLAYBACK_READY,t),d(s.RESUME_AUTOPLAY,null,{resumeAutoplay:Qa});break;case s.AUTOPLAY_BLOCKED:d(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:fe});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:d(e,t,{skipToTrack:$t});break}}var ar=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(l,p){S.log(`playbackState.sync() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(l)+1} - syncState: ${S.getKeyForValue(e,p)}`),r.players.isCurrent(l)?p===e.PLAY?d(s.MEDIA_PLAYING,me()):p===e.PAUSE&&d(s.MEDIA_PAUSED,me()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(l)),h(),a(l,p))}}})();var Ke={};Ge(Ke,{getStatus:()=>cr,init:()=>sr,nextTrack:()=>qt,prevTrack:()=>Wt,setVolume:()=>or,toggleMute:()=>Be,togglePlayPause:()=>xe});var Me=class extends H{#e=null;#t(t,a){if(t!==void 0){let l=Math.round(t);O(t*1e3,l,a),l>0&&a>0&&super.updateOncePerSecond(l,a)}}ready(t){super.init(),this.#e=t,E(s.MEDIA_PLAYING,()=>super.start())}updateTimer(){this.isVisible&&f()&&this.#t(this.#e.embedded.getCurrentTime(),this.#e.getDuration())}updateVolumeMute(){ce(this.#e.embedded.getVolume(),this.#e.embedded.isMuted())}},Ve=new Me;var v=b("list-playback"),X=new q(10),n={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},we=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function sr(){v.log("init()"),nt(_),Lt(_),lr()!==null?ur():A("No playable YouTube tracks!",0,"help",()=>re("No playable tracks",we))}function lr(){if(n.currentTrackId=w(),n.autoplayData=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY)),sessionStorage.removeItem(F.UF_AUTOPLAY),n.currentTrackId!==null){if(n.autoplayData!==null&&n.autoplayData.trackId!==null){let e=ie(`[data-track-id="${n.autoplayData.trackId}"]`);e!==null?De(e)===C.YOUTUBE?n.currentTrackId=e.id:A("Cannot play SoundCloud track",5,"help",()=>re("Cannot play SoundCloud track",we)):A("Unable to cue track (not found)",5)}dt(n.currentTrackId)}return v.log(`cueInitialTrack() - currentTrackId: ${n.currentTrackId} - autoplayData: ${n.autoplayData!==null?JSON.stringify(n.autoplayData):"N/A"}`),n.currentTrackId}function _(e,t=!0,a=!1){let l=De(ut(e));if(v.log(`setCurrentTrack() - nextTrackType: ${v.getKeyForValue(C,l)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),l===C.SOUNDCLOUD&&a){A("Cannot play SoundCloud track",5,"help",()=>re("Cannot play SoundCloud track",we));return}e===n.currentTrackId?xe():(f()&&n.player.embedded.stopVideo(),n.currentTrackId=e,d(s.MEDIA_CUE_TRACK,{trackId:e,isPointerClick:a}),Gt(t))}function Gt(e){let t=Tt();n.player.resetState(),e?(n.player.playTrackById(t),x(g.PLAYING),h()):(n.player.cueTrackById(t),x(g.PAUSED))}function xe(){n.currentTrackId===null?_(ie("div.track-entry.current").id):f()?n.player.embedded.pauseVideo():n.player.play(be)}function or(){n.player.setVolume(o.playback.masterVolume)}function Be(e=!0){e&&(o.playback.masterMute=o.playback.masterMute!==!0),o.playback.masterMute?n.player.embedded.mute():n.player.embedded.unMute()}function Wt(){let e=pt(),t=n.player.embedded.getCurrentTime();e!==null&&t<=5?(_(e,f()),h()):t!==0&&(n.player.embedded.seekTo(0),O(0,0,n.player.getDuration()))}function qt(){let e=w();e!==null&&(_(e,f()),h())}async function Ht(e=!1,t=!1){let a=t?R.OFF:ne(),l=w();if(v.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${l} - repeatMode: ${v.getKeyForValue(R,a)}`),e&&a===R.ONE)n.player.embedded.seekTo(0),n.player.play(be);else if(e&&l===null&&a===R.ALL)_(w(null)),Y(0);else if(l===null)if(o.list.showLoadMoreTracks){let p=await yt();e&&p&&_(w())}else K(P.nextPage,e);else e?_(l):x(g.PAUSED)}function nr(){f()===!1&&n.autoplayData!==null&&(X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),X.add(c.YOUTUBE,-1,w())),f()===!1&&Ht(!0,!0)}function ir(){n.currentTrackId=null,x(g.PAUSED)}function cr(){let e=ie("div.track-entry.current");if(e!==null){let t=ct("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:f(),currentTrack:a+1,trackType:C.YOUTUBE,position:Math.ceil(n.player.embedded.getCurrentTime()),numTracks:1,trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function ur(){v.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){v.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:pr,onStateChange:dr,onError:be}});n.player=new je(a),v.log(n.player),se(n.player,l=>n.player.embedded.seekTo(l)),d(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function pr(){v.log("onYouTubePlayerReady()"),n.autoplayData?.autoplay===!0&&X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),le(Wt,xe,qt,Be),d(s.PLAYBACK_LOADING,{loadingPercent:66}),Ve.ready(n.player),it(n.player),Be(!1),n.player.setVolume(o.playback.masterVolume),d(s.PLAYBACK_READY,{resetProgressBar:!1}),Gt(n.autoplayData?.autoplay===!0)}function dr(e){switch(v.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${n.currentTrackId}`),X.add(c.YOUTUBE,e.data,n.currentTrackId),e.data!==YT.PlayerState.PLAYING&&G(),e.data){case YT.PlayerState.UNSTARTED:yr();break;case YT.PlayerState.BUFFERING:d(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:Er(),d(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:x(g.PAUSED);break;case YT.PlayerState.ENDED:Ve.stop(),d(s.MEDIA_ENDED),Ht(o.playback.autoplay);break}}function yr(){X.ytAutoplayBlocked(n.currentTrackId,3e3)&&(x(g.PAUSED),n.currentSnackbarId=A("Autoplay blocked, Play to continue",0,"play",()=>n.player.play(be))),n.playerReady===!1&&(n.playerReady=!0,d(s.PLAYBACK_LOADING,{loadingPercent:0}))}function Er(){te(n.currentSnackbarId),n.firstStatePlaying&&(n.firstStatePlaying=!1,n.autoplayData=null,setTimeout(()=>{o.playback.autoplay&&f()&&Math.round(window.pageYOffset)<=1&&Qe(ze.SITE_MAX_WIDTH_MOBILE)&&Y(0)},6e3))}function be(e){v.log(`onYouTubePlayerError(): playerError: ${e.data} - currentTrackId: ${n.currentTrackId} - isTrackCued: ${n.player.isTrackCued()}`),n.player.setPlayerError(e.data),n.player.isTrackCued()===!1&&(Et("Error!"),X.add(c.YOUTUBE,u.PLAYER_ERROR,n.currentTrackId),A("Unable to play track, skipping to next",5,"Stop",ir,nr))}var Pe=b("screen-wakelock"),Ae={wakeLock:null};function Xt(){o.mobile.keepScreenOn&&document.addEventListener("click",Jt)}function Jt(){Pe.log("enableScreenWakeLock()"),document.removeEventListener("click",Jt),kr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&o.mobile.keepScreenOn&&Tr()})}function Tr(){jt()&&Ae.wakeLock===null&&zt()}function jt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function kr(){jt()?document.visibilityState==="visible"&&await zt()!==!0&&(Pe.log("enableWakeLock(): Screen Wake Lock request failed"),A("Keep Screen On failed",5,"Disable",()=>o.mobile.keepScreenOn=!1)):(Pe.log("enableWakeLock(): Screen Wake Lock is not supported"),A("Keep Screen On is not supported",5,"Disable",()=>o.mobile.keepScreenOn=!1))}async function zt(){try{return Ae.wakeLock=await navigator.wakeLock.request("screen"),Ae.wakeLock.addEventListener("release",()=>{Ae.wakeLock=null}),!0}catch(e){Pe.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var Z=b("playback-interaction"),Qt=new pe(10),y={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null};document.addEventListener("DOMContentLoaded",()=>{We(),Z.log("DOMContentLoaded"),qe(),kt()?y.player=_e:gt()&&(y.player=Ke),y.player!==null&&gr(),St(y.player?.getStatus)});function gr(){Z.log("initCommon()"),rt(),fr(),y.player.init(),y.siteNavUiElements=new $e("#site-navigation"),y.trackNavUiElements=new Fe("nav.single-track-nav .nav-links"),W.init(),y.keyboardShortcuts=Ze(o.playback.keyboardShortcuts),mr(),Xt()}function fr(){E(s.PLAYBACK_READY,Cr),E(s.MEDIA_CUE_TRACK,ea),E(s.MEDIA_ENDED,ea),E(s.MEDIA_TIME_REMAINING,hr),E(s.MEDIA_PREV_TRACK,()=>M(null,L.PREV,P.prevPage)),E(s.MEDIA_NEXT_TRACK,()=>M(null,L.NEXT,P.nextPage))}function mr(){J(".playback-shuffle-control span","click",mt),document.addEventListener("keydown",br),document.addEventListener("keydown",Ar),window.addEventListener("blur",Lr)}function br(e){if(y.isPlaybackReady&&y.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":Zt(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&Zt(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),Y(y.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),y.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":bt(e);break;case"ArrowLeft":Pr(e);break;case"ArrowRight":Sr(e);break;case"A":Ue.toggle();break;case"f":case"F":e.preventDefault(),W.toggle(document.getElementById(y.player.getStatus().iframeId));break;case"i":e.preventDefault(),tt(Ie(y.player.getStatus().trackId));break;case"I":e.preventDefault(),et(Ie(y.player.getStatus().trackId));break;case"m":case"M":e.preventDefault(),y.player.toggleMute(),A(o.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",3);break;case"p":case"P":At.toggle();break;case"r":case"R":A(`${ot().title} (<b>r</b> to change)`,3);break;case"x":case"X":Pt.toggle();break}}}}function Ar(e){if(y.isPlaybackReady&&y.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":at===!1&&(Z.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),y.player.togglePlayPause());break;case"MediaTrackPrevious":Z.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),y.player.prevTrack();break;case"MediaTrackNext":Z.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),y.player.nextTrack();break}}function Pr(e){e.preventDefault(),e.shiftKey===!0?M(null,L.PREV,P.prevPage):y.player.prevTrack()}function Sr(e){e.preventDefault(),e.shiftKey===!0?M(null,L.NEXT,P.nextPage):y.player.nextTrack()}function M(e,t,a){e?.preventDefault(),j()&&y.player.getStatus().trackType===C.YOUTUBE?Ct()===!1?z(t,y.player.getStatus().isPlaying):A("Loading track, please wait...",3):ta(null,a)}function Zt(e){e.preventDefault(),o.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?o.playback.masterVolume<100?o.playback.masterVolume+5:100:o.playback.masterVolume>5?o.playback.masterVolume-5:5,y.player.setVolume()}function Cr(){J(".playback-details-control","click",Dr),J(".playback-thumbnail-control","click",vr),J(".playback-timer-control","click",Ir),y.isPlaybackReady=!0}function ea(){o.playback.autoExitFullscreen&&W.exit()}function hr(e){o.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=o.playback.timeRemainingSeconds&&W.exit()}function Lr(){ve()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function Dr(){Y(y.player.getStatus().trackId)}function vr(){ft()?(Qt.add(c.MOUSE,u.MOUSE_CLICK),Qt.doubleClicked(c.MOUSE,u.MOUSE_CLICK,500)&&W.enter(document.getElementById(y.player.getStatus().iframeId))):ve()&&Y(0)}function Ir(){Ue.toggle()}var $e=class extends he{elementClicked(){if(this.clicked("a.navbar-prev-link"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("a.navbar-next-link"))return M(this.event,L.NEXT,P.nextPage)}},Fe=class extends he{elementClicked(){if(this.clicked("div.nav-previous a"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("div.nav-next a"))return M(this.event,L.NEXT,P.nextPage)}};function ta(e,t){e?.preventDefault(),K(t,y.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
