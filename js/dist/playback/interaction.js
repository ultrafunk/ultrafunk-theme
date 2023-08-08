import{A as He,Aa as w,B as Ce,Ba as pt,C as Xe,Ca as dt,D as Je,Da as x,E as je,Ea as yt,F as J,Fa as Et,Ga as Tt,Ha as kt,I as ze,J as B,Ja as Ie,Ka as gt,La as ft,Ma as K,Na as ce,Oa as Y,P as Qe,Pa as mt,Qa as W,R as he,Ra as bt,S as re,Sa as At,Ta as ve,Ua as Pt,Va as L,Wa as j,Xa as St,Y as Ze,Ya as Ct,Z as et,Za as z,_a as ht,a as Fe,aa as tt,ba as s,c as A,ca as E,d as Ge,da as y,ea as g,fa as Le,ga as at,ha as se,i as ee,ia as le,j as F,ja as rt,ka as O,la as h,ma as f,na as st,oa as G,pa as oe,q as P,qa as R,r as o,ra as ne,s as We,sa as lt,ta as ot,u as b,ua as nt,va as ie,w as te,wa as it,x as ae,xa as ct,y as qe,ya as De,z as C,za as ut}from"../chunk-SKHEIJLW.js";var Q=A("eventlogger"),c={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},u={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70,CUE_PLAY_SINGLE_TRACK:80},ca={eventSource:c.UNKNOWN,eventType:u.UNKNOWN,uId:null,timeStamp:0},ue=class{#e=[];#t=0;#r=0;#a=0;constructor(t=10){this.#t=t}add(t,a,l=null,p=Date.now()){let k=Object.create(ca);k.eventSource=t,k.eventType=a,k.uId=l,k.timeStamp=p,this.#e.length<this.#t?this.#e.push(k):(this.#e.shift(),this.#e.push(k))}clear(){this.#e=[]}getLastPos(){return this.#a}initMatch(){this.#a=this.#e.length-1,this.#r=0}matchesEvent(t,a,l,p=null){this.#e[this.#a-t].eventSource===a&&this.#e[this.#a-t].eventType===l&&this.#e[this.#a-t].uId===p&&this.#r++}matchesDelta(t,a){this.#e[this.#a].timeStamp-this.#e[this.#a-t].timeStamp<=a&&this.#r++}isPatternMatch(t,a){return this.#r===t?(Q.log(`MATCH for: ${a}`),this.logEventMatch(),!0):!1}logEventMatch(){let t=[];for(let a=0;a<this.#e.length;a++){let l={eventSource:Q.getKeyForValue(c,this.#e[a].eventSource),eventType:Q.getKeyForValue(u,this.#e[a].eventType),uId:this.#e[a].uId,timeStamp:this.#e[a].timeStamp};t.push(l)}Q.log(t)}},pe=class extends ue{doubleClicked(t,a,l){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,l)),this.isPatternMatch(3,`${Q.getKeyForValue(c,t)} Double Clicked`)}},q=class extends ue{ytAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}ytSingleTrackAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK,null),this.matchesEvent(2,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Single Track Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.ULTRAFUNK,u.CROSSFADE_START,null),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Oe={};Fe(Oe,{getStatus:()=>me,init:()=>qa,nextTrack:()=>Ye,prevTrack:()=>Bt,setVolume:()=>Ja,toggleMute:()=>wt,togglePlayPause:()=>fe});var H=class{#e=-1;#t=0;isVisible=!0;config={updateTimerInterval:250,maxBufferingDelay:3};init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}updateTimer(){}updateVolumeMute(){}start(){this.stop(),this.#e=setInterval(()=>this.updateTimer(),this.config.updateTimerInterval)}stop(){this.#e!==-1&&(clearInterval(this.#e),this.#e=-1),this.#t=0,oe(!1)}updateOncePerSecond(t,a){if(this.#t!==t&&(this.#t=t,this.updateVolumeMute(),o.playback.autoplay===!1&&o.playback.timeRemainingWarning)){let l=a-t;l<=o.playback.timeRemainingSeconds?(oe(!0),y(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:l})):oe(!1)}}};var Ue=class extends H{#e=null;#t=null;#r(t,a=0){let l=Math.round(t/1e3);O(t,l,a),l>0&&a>0&&(super.updateOncePerSecond(l,a),this.#s(l,a))}#a(){return o.playback.autoplay&&o.gallery.autoCrossfade}#s(t,a){o.playback.masterMute===!1&&this.#a()&&a-t===o.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrack()+1<=this.#e.getNumTracks()&&this.#t(ae.AUTO,{name:"Auto Crossfade",length:o.gallery.autoCrossfadeLength,curve:o.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>ce(Math.round(t),this.#e.current.isMuted()))}},v=new Ue;var m=A("embedded-players"),U=new q(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},pa={maxPlaybackStartDelay:3};function Dt(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),Ea(),Ca()}function ye(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function It(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):y(s.PLAYBACK_LOADING,ye())}function da(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),l=t.querySelector("iframe"),p=null;if(a===C.YOUTUBE)e.length===1&&l===null?p=Lt("youtube-player",t,!0):p=Lt(l.id,t,!1);else if(a===C.SOUNDCLOUD){let k=SC.Widget(l.id);p=new Xe(t.id,l.id,k,l.src),k.bind(SC.Widget.Events.READY,()=>ha(l.id,t,p,k)),k.bind(SC.Widget.Events.PLAY,La),k.bind(SC.Widget.Events.PAUSE,Da),k.bind(SC.Widget.Events.FINISH,Ia),k.bind(SC.Widget.Events.ERROR,va)}p!==null&&(p.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(p))})}function Lt(e,t,a=!1){let l=t.getAttribute("data-track-source-uid"),p=new YT.Player(e,{events:{onReady:V=>Ta(V,e),onStateChange:V=>ka(V,e),onError:V=>Sa(V,e)},playerVars:{disablekb:1},...a&&{videoId:l}}),k=null;return a?k=new Ce(t.id,e,p,l):k=new He(t.id,e,p,l),k.setDuration(parseInt(t.getAttribute("data-track-duration"))),k}function Te(e,t){m.log("onPlayerError()"),m.log(e);let a=e.getTrackType()===C.YOUTUBE?c.YOUTUBE:c.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),U.add(a,u.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,ya(e,t))}function ya(e,t){let a=e.getArtist()||"N/A",l=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${l}`,mediaUrl:t}}function Ea(){m.log("initYouTubeAPI()"),y(s.PLAYBACK_LOADING,ye()),window.onYouTubeIframeAPIReady=function(){m.log("onYouTubeIframeAPIReady()"),y(s.PLAYBACK_LOADING,ye()),da()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Ta(e,t){let a=i.players.playerFromUid(t);e.target.getPlayerState()===-1?(m.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):m.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),It()}function ka(e,t){switch(U.add(c.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:ga(t);break;case YT.PlayerState.BUFFERING:fa(t);break;case YT.PlayerState.PLAYING:ma(t);break;case YT.PlayerState.PAUSED:ba(t);break;case YT.PlayerState.CUED:Aa(t);break;case YT.PlayerState.ENDED:Pa(t);break}}function ga(e){m.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),(U.ytAutoplayBlocked(e,3e3)||U.ytSingleTrackAutoplayBlocked(e,3e3))&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function fa(e){if(m.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(o.playback.masterMute),t.setVolume(o.playback.masterVolume),y(s.MEDIA_LOADING)}}function ma(e){m.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.sync(e,i.playbackState.STATE.PLAY),v.start()}function ba(e){m.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),v.stop()):i.players.crossfade.stop()}function Aa(e){m.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`)}function Pa(e){m.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(v.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Sa(e,t){let a=i.players.playerFromUid(t);e.data===150&&a instanceof Ce&&a.isCued()?(m.log("onYouTubePlayerError(150) - SingleTrack.isCued(): true"),a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(m.log("onYouTubePlayerError: "+e.data),a.setIsPlayable(!1),Te(a,e.target.getVideoUrl()))}function Ca(){m.log("initSoundCloudAPI()"),y(s.PLAYBACK_LOADING,ye())}function ha(e,t,a,l){m.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getUid()} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),l.getDuration(p=>{a.setDuration(Math.round(p/1e3)),t.setAttribute("data-track-duration",a.getDuration()),It()})}function La(e){m.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?U.scPlayDoubleTrigger(e.soundId,pa.maxPlaybackStartDelay*1e3)&&i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(o.playback.masterMute),i.players.current.setVolume(o.playback.masterVolume)),v.start()}function Da(e){m.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PAUSED,e.soundId),U.scAutoplayBlocked(e.soundId,3e3)?(v.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):U.scWidgetPlayBlocked(e.soundId,3e4)?(v.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.sync(e.soundId,i.playbackState.STATE.PAUSE),v.stop())}):i.players.crossfade.stop()}function Ia(e){m.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(v.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function va(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);m.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${e.id} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)})}var N=A("gallery-events"),ke={snackbarId:0,nowPlayingIcons:null},Ne={nowPlayingIconsSelector:"h2.track-artist-title"};function vt(){N.log("init()"),ke.nowPlayingIcons=document.querySelectorAll(Ne.nowPlayingIconsSelector),E(s.MEDIA_PLAYING,Na),E(s.MEDIA_PAUSED,Ra),E(s.MEDIA_ENDED,Ya),E(s.MEDIA_CUE_TRACK,Oa),E(s.CONTINUE_AUTOPLAY,_a),E(s.RESUME_AUTOPLAY,Ma),E(s.AUTOPLAY_BLOCKED,Va),E(s.PLAYBACK_BLOCKED,Ba),E(s.MEDIA_UNAVAILABLE,wa)}function Na(e){if(N.log(e),te(ke.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Ne.nowPlayingIconsSelector}`);Ut(t),B(t,"playing-paused","now-playing-icon"),o.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Ra(e){N.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Ne.nowPlayingIconsSelector}`).classList.add("playing-paused")}function Ya(e){N.log(e),e!==null&&e.data.numTracks>1&&Ut()}function Oa(e){N.log(e),e.data.scrollToMedia&&Y(e.data.trackId)}function _a(e){N.log(e),j()&&e.data.trackType===C.YOUTUBE?z(L.NEXT,!0):K(P.nextPage,!0)}function Ma(e){let t=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY));if(sessionStorage.removeItem(F.UF_AUTOPLAY),N.log(e),N.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id??null;a===null&&t.trackId!==null?b("Unable to cue track (not found)",5):e.callback.resumeAutoplay(t,a)}}function Va(e){N.log(e),ke.snackbarId=b("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function Ba(e){N.log(e),b("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Nt(e))}function wa(e){N.log(e),b("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Nt(e))}function Ut(e){ke.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Nt(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):j()&&e.data.trackType===C.YOUTUBE?z(L.NEXT,o.playback.autoplay):P.nextPage!==null&&K(P.nextPage,!0)}var Re=A("crossfade-controls"),ge={players:{}},D={},$={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function Yt(e,t){Re.log("init()"),ge.players=e,D.crossfadePreset=Le($.crossfadePresetSelector),D.crossfadeTo=Le($.crossfadeToSelector),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(a=>Ot(a,o.gallery.trackCrossfadeDefPreset)),D.crossfadeTo.clickCallback=t),E(s.PLAYBACK_READY,Ka)}function Ka(){Re.log("playbackReady()"),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(e=>{e.addEventListener("click",$a),B(e,g.DISABLED.CLASS,g.ENABLED.CLASS)}),D.crossfadeTo.forEach(e=>e.addEventListener("click",Fa)),E(s.MEDIA_PLAYING,Rt),E(s.MEDIA_PAUSED,Rt))}function Ot(e,t){e.setAttribute($.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${ee.crossfade[t].name}`}function $a(e){let t=parseInt(e.target.getAttribute($.crossfadePresetData));Ot(e.target,t+1<ee.crossfade.length?t+1:0)}function Fa(e){if(f()&&ge.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),l=parseInt(t.querySelector($.crossfadePresetSelector).getAttribute($.crossfadePresetData));B(t.querySelector(`div${$.crossfadeToSelector}`),g.ENABLED.CLASS,g.DISABLED.CLASS),D.crossfadeTo.clickCallback(ge.players.uIdFromIframeId(a.id),ee.crossfade[l])}}}function Rt(){let e=f(),t=e?ge.players.getTrackData().currentTrack:-1;Re.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),D.crossfadeTo.forEach((a,l)=>{t===l+1?B(a,e?g.ENABLED.CLASS:g.DISABLED.CLASS,e?g.DISABLED.CLASS:g.ENABLED.CLASS):B(a,e?g.DISABLED.CLASS:g.ENABLED.CLASS,e?g.ENABLED.CLASS:g.DISABLED.CLASS)})}var _t=A("gallery-players"),Mt=()=>{let e=null,t=null,a=[],l=new Map,p=0;return{indexMap:l,get crossfade(){return t},get current(){return a[p]},get next(){return a[p+1]},getPlayerIndex(){return p},setPlayerIndex(T){p=T},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return p+1},playerFromUid(T){return a[l.get(T)]},trackFromUid(T){return l.get(T)+1},isCurrent(T){return T===this.current.getUid()},init:k,add:V,uIdFromIframeId:ta,stop:aa,mute:ra,getTrackData:sa,prevTrack:la,nextTrack:oa,jumpToTrack:na};function k(T){_t.log("init()"),e=T,t=qe(this),E(s.MEDIA_PLAYING,()=>t.start()),E(s.MEDIA_PAUSED,()=>t.stop())}function V(T){_t.log(T),a.push(T),l.set(T.getUid(),a.length-1)}function ta(T){return a.find(Se=>Se.getIframeId()===T).getUid()}function aa(){this.current.stop(),t.stop()}function ra(){this.current.mute(o.playback.masterMute),t.mute(o.playback.masterMute)}function sa(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function la(T){return p>0?(p--,e(T),!0):!1}function oa(T){return p++,p<this.getNumTracks()?(e(T),!0):!1}function na(T,Se,ia=!0){return T>0&&T<=this.getNumTracks()?(p=T-1,e(Se,ia),!0):!1}};var S=A("gallery-playback"),r={eventLog:null,players:{}},Vt={minCrossfadeToTime:5,maxBufferingDelay:3};function qa(){S.log("init()"),r.eventLog=U,vt(),r.players=Mt(),r.players.init(xt),se(r.players,Xa),Yt(r.players,Za),v.init(r.players,$t),Dt(r.players,tr,er)}function fe(){f()?(G(),r.players.current.pause()):(st(),r.players.current.play(Te))}function Bt(){S.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),O(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(f())?h():y(s.MEDIA_PREV_TRACK))})}function Ye(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();S.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${o.playback.autoplay}`),!Ha(e,t)&&(t===!1?(r.players.stop(),e&&o.playback.autoplay===!1?G():r.players.nextTrack(f())&&h()):t===!0&&e===!1?y(s.MEDIA_NEXT_TRACK):e&&(G(),o.playback.autoplay?y(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Ha(e,t){if(e&&o.playback.autoplay){let a=ne();if(S.log(`repeatPlayback(): ${S.getKeyForValue(R,a)}`),a===R.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===R.ALL)return r.players.stop(),r.players.setPlayerIndex(0),xt(!0),!0}return!1}function Xa(e){r.players.current.seekTo(e)}function Ja(){r.players.current.setVolume(o.playback.masterVolume)}function wt(){o.playback.masterMute=o.playback.masterMute!==!0,r.players.mute()}function ja(e,t=!0){S.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),h()}function xt(e,t=!0){y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(Te)}function Kt(e,t=!0){S.log(`skipToTrack(): ${e} - ${t}`),t===!0&&f()===!1&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.jumpToTrack(e,t)&&h())}function za(e,t=null){S.log(`resumeAutoplay(): ${e.autoplay} - iframeId: ${t}`),t!==null?e.autoplay?Kt(r.players.trackFromUid(t),!0):ja(t):e.autoplay&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),fe())}function Qa(e,t,a=!1){S.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.eventLog.add(c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),rt(0),h(),a?(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.current.playTrackById(t.uid)):r.players.current.cueTrackById(t.uid)}function me(){return{isPlaying:f(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),elementId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function Za(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(S.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),o.playback.masterMute===!1&&o.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=Vt.minCrossfadeToTime+Vt.maxBufferingDelay&&$t(ae.TRACK,t,e)}))}function $t(e,t,a=null){r.eventLog.add(c.ULTRAFUNK,u.CROSSFADE_START),r.players.crossfade.init(e,t,a)!==null&&h()}function er(e,t=null){switch(S.log(`embeddedEventHandler() - event: ${S.getKeyForValue(s,e)}`),t!==null&&S.log(t),e){case s.MEDIA_ENDED:y(s.MEDIA_ENDED,me()),Ye(!0);break;case s.PLAYBACK_READY:le(Bt,fe,Ye,wt),Ct(Qa),y(s.PLAYBACK_READY,t),y(s.RESUME_AUTOPLAY,null,{resumeAutoplay:za});break;case s.AUTOPLAY_BLOCKED:y(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:fe});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:y(e,t,{skipToTrack:Kt});break}}var tr=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(l,p){S.log(`playbackState.sync() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(l)+1} - syncState: ${S.getKeyForValue(e,p)}`),r.players.isCurrent(l)?p===e.PLAY?y(s.MEDIA_PLAYING,me()):p===e.PAUSE&&y(s.MEDIA_PAUSED,me()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(l)),h(),a(l,p))}}})();var xe={};Fe(xe,{getStatus:()=>ir,init:()=>rr,nextTrack:()=>Wt,prevTrack:()=>Gt,setVolume:()=>lr,toggleMute:()=>Ve,togglePlayPause:()=>we});var _e=class extends H{#e=null;#t(t,a){if(t!==void 0){let l=Math.round(t);O(t*1e3,l,a),l>0&&a>0&&super.updateOncePerSecond(l,a)}}ready(t){super.init(),this.#e=t,E(s.MEDIA_PLAYING,()=>super.start())}updateTimer(){this.isVisible&&f()&&this.#t(this.#e.embedded.getCurrentTime(),this.#e.getDuration())}updateVolumeMute(){ce(this.#e.embedded.getVolume(),this.#e.embedded.isMuted())}},Me=new _e;var I=A("list-playback"),X=new q(10),n={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},Be=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function rr(){I.log("init()"),ot(_),ht(_),sr()!==null?cr():b("No playable YouTube tracks!",0,"help",()=>re("No playable tracks",Be))}function sr(){if(n.currentTrackId=w(),n.autoplayData=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY)),sessionStorage.removeItem(F.UF_AUTOPLAY),n.currentTrackId!==null){if(n.autoplayData!==null&&n.autoplayData.trackId!==null){let e=ie(`[data-track-id="${n.autoplayData.trackId}"]`);e!==null?De(e)===C.YOUTUBE?n.currentTrackId=e.id:b("Cannot play SoundCloud track",5,"help",()=>re("Cannot play SoundCloud track",Be)):b("Unable to cue track (not found)",5)}pt(n.currentTrackId)}return I.log(`cueInitialTrack() - currentTrackId: ${n.currentTrackId} - autoplayData: ${n.autoplayData!==null?JSON.stringify(n.autoplayData):"N/A"}`),n.currentTrackId}function _(e,t=!0,a=!1){let l=De(ct(e));if(I.log(`setCurrentTrack() - nextTrackType: ${I.getKeyForValue(C,l)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),l===C.SOUNDCLOUD&&a){b("Cannot play SoundCloud track",5,"help",()=>re("Cannot play SoundCloud track",Be));return}e===n.currentTrackId?we():(f()&&n.player.embedded.stopVideo(),n.currentTrackId=e,y(s.MEDIA_CUE_TRACK,{trackId:e,isPointerClick:a}),Ft(t))}function Ft(e){let t=Et();n.player.resetState(),e?(n.player.playTrackById(t),x(g.PLAYING),h()):(n.player.cueTrackById(t),x(g.PAUSED))}function we(){n.currentTrackId===null?_(ie("div.track-entry.current").id):f()?n.player.embedded.pauseVideo():n.player.play(be)}function lr(){n.player.setVolume(o.playback.masterVolume)}function Ve(e=!0){e&&(o.playback.masterMute=o.playback.masterMute!==!0),o.playback.masterMute?n.player.embedded.mute():n.player.embedded.unMute()}function Gt(){let e=ut(),t=n.player.embedded.getCurrentTime();e!==null&&t<=5?(_(e,f()),h()):t!==0&&(n.player.embedded.seekTo(0),O(0,0,n.player.getDuration()))}function Wt(){let e=w();e!==null&&(_(e,f()),h())}async function qt(e=!1,t=!1){let a=t?R.OFF:ne(),l=w();if(I.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${l} - repeatMode: ${I.getKeyForValue(R,a)}`),e&&a===R.ONE)n.player.embedded.seekTo(0),n.player.play(be);else if(e&&l===null&&a===R.ALL)_(w(null)),Y(0);else if(l===null)if(o.list.showLoadMoreTracks){let p=await dt();e&&p&&_(w())}else K(P.nextPage,e);else e?_(l):x(g.PAUSED)}function or(){f()===!1&&n.autoplayData!==null&&(X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),X.add(c.YOUTUBE,-1,w())),f()===!1&&qt(!0,!0)}function nr(){n.currentTrackId=null,x(g.PAUSED)}function ir(){let e=ie("div.track-entry.current");if(e!==null){let t=it("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:f(),currentTrack:a+1,trackType:C.YOUTUBE,position:Math.ceil(n.player.embedded.getCurrentTime()),numTracks:1,trackId:t[a].getAttribute("data-track-id"),elementId:t[a].id,iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function cr(){I.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){I.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:ur,onStateChange:pr,onError:be},playerVars:{disablekb:1}});n.player=new Je(a),I.log(n.player),se(n.player,l=>n.player.embedded.seekTo(l)),y(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ur(){I.log("onYouTubePlayerReady()"),n.autoplayData?.autoplay===!0&&X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),le(Gt,we,Wt,Ve),y(s.PLAYBACK_LOADING,{loadingPercent:66}),Me.ready(n.player),nt(n.player),Ve(!1),n.player.setVolume(o.playback.masterVolume),y(s.PLAYBACK_READY,{resetProgressBar:!1}),Ft(n.autoplayData?.autoplay===!0)}function pr(e){switch(I.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${n.currentTrackId}`),X.add(c.YOUTUBE,e.data,n.currentTrackId),e.data!==YT.PlayerState.PLAYING&&G(),e.data){case YT.PlayerState.UNSTARTED:dr();break;case YT.PlayerState.BUFFERING:y(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:yr(),y(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:x(g.PAUSED);break;case YT.PlayerState.ENDED:Me.stop(),y(s.MEDIA_ENDED),qt(o.playback.autoplay);break}}function dr(){X.ytAutoplayBlocked(n.currentTrackId,3e3)&&(x(g.PAUSED),n.currentSnackbarId=b("Autoplay blocked, Play to continue",0,"play",()=>n.player.play(be))),n.playerReady===!1&&(n.playerReady=!0,y(s.PLAYBACK_LOADING,{loadingPercent:0}))}function yr(){te(n.currentSnackbarId),n.firstStatePlaying&&(n.firstStatePlaying=!1,n.autoplayData=null,setTimeout(()=>{o.playback.autoplay&&f()&&Math.round(window.scrollY)<=1&&ze(je.SITE_MAX_WIDTH_MOBILE)&&Y(0)},6e3))}function be(e){I.log(`onYouTubePlayerError(): playerError: ${e.data} - currentTrackId: ${n.currentTrackId} - isTrackCued: ${n.player.isTrackCued()}`),n.player.setPlayerError(e.data),n.player.isTrackCued()===!1&&(yt("Error!"),X.add(c.YOUTUBE,u.PLAYER_ERROR,n.currentTrackId),b("Unable to play track, skipping to next",5,"Stop",nr,or))}var Pe=A("screen-wakelock"),Ae={wakeLock:null};function Ht(){o.mobile.keepScreenOn&&document.addEventListener("click",Xt)}function Xt(){Pe.log("enableScreenWakeLock()"),document.removeEventListener("click",Xt),Tr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&o.mobile.keepScreenOn&&Er()})}function Er(){Jt()&&Ae.wakeLock===null&&jt()}function Jt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function Tr(){Jt()?document.visibilityState==="visible"&&await jt()!==!0&&(Pe.log("enableWakeLock(): Screen Wake Lock request failed"),b("Keep Screen On failed",5,"Disable",()=>o.mobile.keepScreenOn=!1)):(Pe.log("enableWakeLock(): Screen Wake Lock is not supported"),b("Keep Screen On is not supported",5,"Disable",()=>o.mobile.keepScreenOn=!1))}async function jt(){try{return Ae.wakeLock=await navigator.wakeLock.request("screen"),Ae.wakeLock.addEventListener("release",()=>{Ae.wakeLock=null}),!0}catch(e){Pe.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var Z=A("playback-interaction"),zt=new pe(10),d={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null};document.addEventListener("DOMContentLoaded",()=>{Ge(),Z.log("DOMContentLoaded"),We(),Tt()?d.player=Oe:kt()&&(d.player=xe),d.player!==null&&kr(),Pt(d.player?.getStatus)});function kr(){Z.log("initCommon()"),at(),gr(),d.player.init(),d.siteNavUiElements=new Ke("#site-navigation"),d.trackNavUiElements=new $e("nav.single-track-nav .nav-links"),W.init(),d.keyboardShortcuts=Qe(o.playback.keyboardShortcuts),fr(),Ht()}function gr(){E(s.PLAYBACK_READY,Sr),E(s.MEDIA_CUE_TRACK,Zt),E(s.MEDIA_ENDED,Zt),E(s.MEDIA_TIME_REMAINING,Cr),E(s.MEDIA_PREV_TRACK,()=>M(null,L.PREV,P.prevPage)),E(s.MEDIA_NEXT_TRACK,()=>M(null,L.NEXT,P.nextPage))}function fr(){J(".playback-shuffle-control span","click",ft),document.addEventListener("keydown",mr),document.addEventListener("keydown",br),window.focus(),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&window.focus()},250)})}function mr(e){if(d.isPlaybackReady&&d.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":Qt(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&Qt(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),Y(d.player.getStatus().elementId);break}switch(e.key){case" ":e.preventDefault(),d.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":mt(e);break;case"ArrowLeft":Ar(e);break;case"ArrowRight":Pr(e);break;case"A":ve.toggle();break;case"f":case"F":e.preventDefault(),W.toggle(document.getElementById(d.player.getStatus().iframeId));break;case"i":e.preventDefault(),et(document.getElementById(d.player.getStatus().elementId));break;case"I":e.preventDefault(),Ze(document.getElementById(d.player.getStatus().elementId));break;case"m":case"M":e.preventDefault(),d.player.toggleMute(),b(o.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",3);break;case"p":case"P":bt.toggle();break;case"r":case"R":b(`${lt().title} (<b>r</b> to change)`,3);break;case"x":case"X":At.toggle();break}}}}function br(e){if(d.isPlaybackReady&&d.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":tt===!1&&(Z.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),d.player.togglePlayPause());break;case"MediaTrackPrevious":Z.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),d.player.prevTrack();break;case"MediaTrackNext":Z.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),d.player.nextTrack();break}}function Ar(e){e.preventDefault(),e.shiftKey===!0?M(null,L.PREV,P.prevPage):d.player.prevTrack()}function Pr(e){e.preventDefault(),e.shiftKey===!0?M(null,L.NEXT,P.nextPage):d.player.nextTrack()}function M(e,t,a){e?.preventDefault(),j()&&d.player.getStatus().trackType===C.YOUTUBE?St()===!1?z(t,d.player.getStatus().isPlaying):b("Loading track, please wait...",3):ea(null,a)}function Qt(e){e.preventDefault(),o.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?o.playback.masterVolume<100?o.playback.masterVolume+5:100:o.playback.masterVolume>5?o.playback.masterVolume-5:5,d.player.setVolume()}function Sr(){J(".playback-details-control","click",hr),J(".playback-thumbnail-control","click",Lr),J(".playback-timer-control","click",Dr),d.isPlaybackReady=!0}function Zt(){let e=Ie()&&d.player.getStatus().numTracks>1;(o.playback.autoExitFullscreen||e)&&W.exit()}function Cr(e){let t=e.data.timeRemainingSeconds<=o.playback.timeRemainingSeconds;o.playback.autoExitFsOnWarning&&t&&W.exit()}function hr(){Y(d.player.getStatus().elementId)}function Lr(){Ie()?(zt.add(c.MOUSE,u.MOUSE_CLICK),zt.doubleClicked(c.MOUSE,u.MOUSE_CLICK,500)&&W.enter(document.getElementById(d.player.getStatus().iframeId))):gt()&&Y(0)}function Dr(){ve.toggle()}var Ke=class extends he{elementClicked(){if(this.clicked("a.navbar-prev-link"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("a.navbar-next-link"))return M(this.event,L.NEXT,P.nextPage)}},$e=class extends he{elementClicked(){if(this.clicked("div.nav-previous a"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("div.nav-next a"))return M(this.event,L.NEXT,P.nextPage)}};function ea(e,t){e?.preventDefault(),K(t,d.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
