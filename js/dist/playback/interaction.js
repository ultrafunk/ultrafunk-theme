import{$ as Ie,A as h,Aa as w,B as ze,Ba as yt,C as De,Ca as kt,D as Qe,Da as x,E as Ze,Ea as Et,F as et,Fa as Tt,G as J,Ga as gt,Ha as ft,Ja as Ne,K as tt,Ka as mt,L as B,La as bt,Ma as K,Na as ye,Oa as Y,Pa as At,Q as ve,Qa as W,Ra as Pt,S as at,Sa as St,Ta as Re,Ua as ht,V as le,Va as L,W as rt,Wa as z,X as s,Xa as Ct,Y as k,Ya as Lt,Z as y,Za as Q,_ as g,_a as Dt,a as He,aa as st,ba as oe,c as A,ca as ne,d as Xe,da as lt,ea as O,fa as C,ga as f,ha as ot,i as ae,ia as G,j as F,ja as ie,ka as R,la as ce,ma as nt,na as j,r as P,ra as ue,s as o,sa as de,t as Je,ta as it,ua as ct,v as b,va as pe,wa as ut,x as re,xa as dt,y as se,ya as Ue,z as je,za as pt}from"../chunk-NHZMKPXD.js";var Z=A("eventlogger"),c={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},u={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70,CUE_PLAY_SINGLE_TRACK:80},da={eventSource:c.UNKNOWN,eventType:u.UNKNOWN,uId:null,timeStamp:0},ke=class{#e=[];#t=0;#r=0;#a=0;constructor(t=10){this.#t=t}add(t,a,l=null,d=Date.now()){let T=Object.create(da);T.eventSource=t,T.eventType=a,T.uId=l,T.timeStamp=d,this.#e.length<this.#t?this.#e.push(T):(this.#e.shift(),this.#e.push(T))}clear(){this.#e=[]}getLastPos(){return this.#a}initMatch(){this.#a=this.#e.length-1,this.#r=0}matchesEvent(t,a,l,d=null){this.#e[this.#a-t].eventSource===a&&this.#e[this.#a-t].eventType===l&&this.#e[this.#a-t].uId===d&&this.#r++}matchesDelta(t,a){this.#e[this.#a].timeStamp-this.#e[this.#a-t].timeStamp<=a&&this.#r++}isPatternMatch(t,a){return this.#r===t?(Z.log(`MATCH for: ${a}`),this.logEventMatch(),!0):!1}logEventMatch(){let t=[];for(let a=0;a<this.#e.length;a++){let l={eventSource:Z.getKeyForValue(c,this.#e[a].eventSource),eventType:Z.getKeyForValue(u,this.#e[a].eventType),uId:this.#e[a].uId,timeStamp:this.#e[a].timeStamp};t.push(l)}Z.log(t)}},Ee=class extends ke{doubleClicked(t,a,l){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,l)),this.isPatternMatch(3,`${Z.getKeyForValue(c,t)} Double Clicked`)}},q=class extends ke{ytAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}ytSingleTrackAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK,null),this.matchesEvent(2,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Single Track Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.ULTRAFUNK,u.CROSSFADE_START,null),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Be={};He(Be,{getStatus:()=>Pe,init:()=>Xa,nextTrack:()=>Ve,prevTrack:()=>xt,setVolume:()=>za,toggleMute:()=>Kt,togglePlayPause:()=>Ae});var H=class{#e=-1;#t=0;isVisible=!0;config={updateTimerInterval:250,maxBufferingDelay:3};init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}updateTimer(){}updateVolumeMute(){}start(){this.stop(),this.#e=setInterval(()=>this.updateTimer(),this.config.updateTimerInterval)}stop(){this.#e!==-1&&(clearInterval(this.#e),this.#e=-1),this.#t=0,ie(!1)}updateOncePerSecond(t,a){if(this.#t!==t&&(this.#t=t,this.updateVolumeMute(),o.playback.autoplay===!1&&o.playback.timeRemainingWarning)){let l=a-t;l<=o.playback.timeRemainingSeconds?(ie(!0),y(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:l})):ie(!1)}}};var Ye=class extends H{#e=null;#t=null;#r(t,a=0){let l=Math.round(t/1e3);O(t,l,a),l>0&&a>0&&(super.updateOncePerSecond(l,a),this.#s(l,a))}#a(){return o.playback.autoplay&&o.gallery.autoCrossfade}#s(t,a){o.playback.masterMute===!1&&this.#a()&&a-t===o.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrack()+1<=this.#e.getNumTracks()&&this.#t(se.AUTO,{name:"Auto Crossfade",length:o.gallery.autoCrossfadeLength,curve:o.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>ye(Math.round(t),this.#e.current.isMuted()))}},I=new Ye;var m=A("embedded-players"),U=new q(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},ya={maxPlaybackStartDelay:3};function It(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),Ta(),La()}function ge(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function Ut(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):y(s.PLAYBACK_LOADING,ge())}function ka(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),l=t.querySelector("iframe"),d=null;if(a===h.YOUTUBE)e.length===1&&l===null?d=vt("youtube-player",t,!0):d=vt(l.id,t,!1);else if(a===h.SOUNDCLOUD){let T=SC.Widget(l.id);d=new Qe(t.id,l.id,T,l.src),T.bind(SC.Widget.Events.READY,()=>Da(l.id,t,d,T)),T.bind(SC.Widget.Events.PLAY,va),T.bind(SC.Widget.Events.PAUSE,Ia),T.bind(SC.Widget.Events.FINISH,Ua),T.bind(SC.Widget.Events.ERROR,Na)}d!==null&&(d.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(d))})}function vt(e,t,a=!1){let l=t.getAttribute("data-track-source-uid"),d=new YT.Player(e,{events:{onReady:V=>ga(V,e),onStateChange:V=>fa(V,e),onError:V=>Ca(V,e)},playerVars:{disablekb:1},...a&&{videoId:l}}),T=null;return a?T=new De(t.id,e,d,l):T=new ze(t.id,e,d,l),T.setDuration(parseInt(t.getAttribute("data-track-duration"))),T}function me(e,t){m.log("onPlayerError()"),m.log(e);let a=e.getTrackType()===h.YOUTUBE?c.YOUTUBE:c.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),U.add(a,u.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,Ea(e,t))}function Ea(e,t){let a=e.getArtist()||"N/A",l=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${l}`,mediaUrl:t}}function Ta(){m.log("initYouTubeAPI()"),y(s.PLAYBACK_LOADING,ge()),window.onYouTubeIframeAPIReady=function(){m.log("onYouTubeIframeAPIReady()"),y(s.PLAYBACK_LOADING,ge()),ka()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ga(e,t){let a=i.players.playerFromUid(t);e.target.getPlayerState()===-1?(m.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):m.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),Ut()}function fa(e,t){switch(U.add(c.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:ma(t);break;case YT.PlayerState.BUFFERING:ba(t);break;case YT.PlayerState.PLAYING:Aa(t);break;case YT.PlayerState.PAUSED:Pa(t);break;case YT.PlayerState.CUED:Sa(t);break;case YT.PlayerState.ENDED:ha(t);break}}function ma(e){m.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),(U.ytAutoplayBlocked(e,3e3)||U.ytSingleTrackAutoplayBlocked(e,3e3))&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function ba(e){if(m.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(o.playback.masterMute),t.setVolume(o.playback.masterVolume),y(s.MEDIA_LOADING)}}function Aa(e){m.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.sync(e,i.playbackState.STATE.PLAY),I.start()}function Pa(e){m.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),I.stop()):i.players.crossfade.stop()}function Sa(e){m.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`)}function ha(e){m.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Ca(e,t){let a=i.players.playerFromUid(t);e.data===150&&a instanceof De&&a.isCued()?(m.log("onYouTubePlayerError(150) - SingleTrack.isCued(): true"),a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(m.log("onYouTubePlayerError: "+e.data),a.setIsPlayable(!1),me(a,e.target.getVideoUrl()))}function La(){m.log("initSoundCloudAPI()"),y(s.PLAYBACK_LOADING,ge())}function Da(e,t,a,l){m.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getUid()} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),l.getDuration(d=>{a.setDuration(Math.round(d/1e3)),t.setAttribute("data-track-duration",a.getDuration()),Ut()})}function va(e){m.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?U.scPlayDoubleTrigger(e.soundId,ya.maxPlaybackStartDelay*1e3)&&i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(o.playback.masterMute),i.players.current.setVolume(o.playback.masterVolume)),I.start()}function Ia(e){m.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PAUSED,e.soundId),U.scAutoplayBlocked(e.soundId,3e3)?(I.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):U.scWidgetPlayBlocked(e.soundId,3e4)?(I.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.sync(e.soundId,i.playbackState.STATE.PAUSE),I.stop())}):i.players.crossfade.stop()}function Ua(e){m.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Na(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);m.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${e.id} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)})}var N=A("gallery-events"),be={snackbarId:0,nowPlayingIcons:null},Oe={nowPlayingIconsSelector:"h2.track-artist-title"};function Nt(){N.log("init()"),be.nowPlayingIcons=document.querySelectorAll(Oe.nowPlayingIconsSelector),k(s.MEDIA_PLAYING,Ya),k(s.MEDIA_PAUSED,Oa),k(s.MEDIA_ENDED,_a),k(s.MEDIA_CUE_TRACK,Ma),k(s.CONTINUE_AUTOPLAY,Va),k(s.RESUME_AUTOPLAY,Ba),k(s.AUTOPLAY_BLOCKED,wa),k(s.PLAYBACK_BLOCKED,xa),k(s.MEDIA_UNAVAILABLE,Ka)}function Ya(e){if(N.log(e),re(be.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Oe.nowPlayingIconsSelector}`);Rt(t),B(t,"playing-paused","now-playing-icon"),o.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Oa(e){N.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Oe.nowPlayingIconsSelector}`).classList.add("playing-paused")}function _a(e){N.log(e),e!==null&&e.data.numTracks>1&&Rt()}function Ma(e){N.log(e),e.data.scrollToMedia&&Y(e.data.trackId)}function Va(e){N.log(e),z()&&e.data.trackType===h.YOUTUBE?Q(L.NEXT,!0):K(P.nextPage,!0)}function Ba(e){let t=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY));if(sessionStorage.removeItem(F.UF_AUTOPLAY),N.log(e),N.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id??null;a===null&&t.trackId!==null?b("Unable to cue track (not found)",5):e.callback.resumeAutoplay(t,a)}}function wa(e){N.log(e),be.snackbarId=b("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function xa(e){N.log(e),b("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Yt(e))}function Ka(e){N.log(e),b("Unable to play track, skipping to next",5,"Stop",()=>{},()=>Yt(e))}function Rt(e){be.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Yt(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):z()&&e.data.trackType===h.YOUTUBE?Q(L.NEXT,o.playback.autoplay):P.nextPage!==null&&K(P.nextPage,!0)}var Me=A("gallery-controls"),ee={uiElements:null,players:{}},D={},$={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function _t(e,t){Me.log("init()"),ee.players=e,ee.uiElements=new _e("div.track-meta",!0),D.crossfadePreset=Ie($.crossfadePresetSelector),D.crossfadeTo=Ie($.crossfadeToSelector),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(a=>Mt(a,o.gallery.trackCrossfadeDefPreset)),D.crossfadeTo.clickCallback=t),k(s.PLAYBACK_READY,Fa)}function Fa(){Me.log("playbackReady()"),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(e=>{e.addEventListener("click",Ga),B(e,g.DISABLED.CLASS,g.ENABLED.CLASS)}),D.crossfadeTo.forEach(e=>e.addEventListener("click",Wa)),k(s.MEDIA_PLAYING,Ot),k(s.MEDIA_PAUSED,Ot))}var _e=class extends j{elementClicked(){if(this.clicked("div.track-share-control"))return ue(this.closest("single-track, gallery-track"));if(this.clicked("div.track-details-control"))return de(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return ve(this.event);if(this.clicked("span.track-channels-links"))return ve(this.event)}};function Mt(e,t){e.setAttribute($.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${ae.crossfade[t].name}`}function Ga(e){let t=parseInt(e.target.getAttribute($.crossfadePresetData));Mt(e.target,t+1<ae.crossfade.length?t+1:0)}function Wa(e){if(f()&&ee.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),l=parseInt(t.querySelector($.crossfadePresetSelector).getAttribute($.crossfadePresetData));B(t.querySelector(`div${$.crossfadeToSelector}`),g.ENABLED.CLASS,g.DISABLED.CLASS),D.crossfadeTo.clickCallback(ee.players.uIdFromIframeId(a.id),ae.crossfade[l])}}}function Ot(){let e=f(),t=e?ee.players.getTrackData().currentTrack:-1;Me.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),D.crossfadeTo.forEach((a,l)=>{t===l+1?B(a,e?g.ENABLED.CLASS:g.DISABLED.CLASS,e?g.DISABLED.CLASS:g.ENABLED.CLASS):B(a,e?g.DISABLED.CLASS:g.ENABLED.CLASS,e?g.ENABLED.CLASS:g.DISABLED.CLASS)})}var Vt=A("gallery-players"),Bt=()=>{let e=null,t=null,a=[],l=new Map,d=0;return{indexMap:l,get crossfade(){return t},get current(){return a[d]},get next(){return a[d+1]},getPlayerIndex(){return d},setPlayerIndex(E){d=E},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return d+1},playerFromUid(E){return a[l.get(E)]},trackFromUid(E){return l.get(E)+1},isCurrent(E){return E===this.current.getUid()},init:T,add:V,uIdFromIframeId:ra,stop:sa,mute:la,getTrackData:oa,prevTrack:na,nextTrack:ia,jumpToTrack:ca};function T(E){Vt.log("init()"),e=E,t=je(this),k(s.MEDIA_PLAYING,()=>t.start()),k(s.MEDIA_PAUSED,()=>t.stop())}function V(E){Vt.log(E),a.push(E),l.set(E.getUid(),a.length-1)}function ra(E){return a.find(Le=>Le.getIframeId()===E).getUid()}function sa(){this.current.stop(),t.stop()}function la(){this.current.mute(o.playback.masterMute),t.mute(o.playback.masterMute)}function oa(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function na(E){return d>0?(d--,e(E),!0):!1}function ia(E){return d++,d<this.getNumTracks()?(e(E),!0):!1}function ca(E,Le,ua=!0){return E>0&&E<=this.getNumTracks()?(d=E-1,e(Le,ua),!0):!1}};var S=A("gallery-playback"),r={eventLog:null,players:{}},wt={minCrossfadeToTime:5,maxBufferingDelay:3};function Xa(){S.log("init()"),r.eventLog=U,Nt(),r.players=Bt(),r.players.init($t),oe(r.players,ja),_t(r.players,tr),I.init(r.players,Gt),It(r.players,rr,ar)}function Ae(){f()?(G(),r.players.current.pause()):(ot(),r.players.current.play(me))}function xt(){S.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),O(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(f())?C():y(s.MEDIA_PREV_TRACK))})}function Ve(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();S.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${o.playback.autoplay}`),!Ja(e,t)&&(t===!1?(r.players.stop(),e&&o.playback.autoplay===!1?G():r.players.nextTrack(f())&&C()):t===!0&&e===!1?y(s.MEDIA_NEXT_TRACK):e&&(G(),o.playback.autoplay?y(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Ja(e,t){if(e&&o.playback.autoplay){let a=ce();if(S.log(`repeatPlayback(): ${S.getKeyForValue(R,a)}`),a===R.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===R.ALL)return r.players.stop(),r.players.setPlayerIndex(0),$t(!0),!0}return!1}function ja(e){r.players.current.seekTo(e)}function za(){r.players.current.setVolume(o.playback.masterVolume)}function Kt(){o.playback.masterMute=o.playback.masterMute!==!0,r.players.mute()}function Qa(e,t=!0){S.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),C()}function $t(e,t=!0){y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(me)}function Ft(e,t=!0){S.log(`skipToTrack(): ${e} - ${t}`),t===!0&&f()===!1&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.jumpToTrack(e,t)&&C())}function Za(e,t=null){S.log(`resumeAutoplay(): ${e.autoplay} - iframeId: ${t}`),t!==null?e.autoplay?Ft(r.players.trackFromUid(t),!0):Qa(t):e.autoplay&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),Ae())}function er(e,t,a=!1){S.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.eventLog.add(c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),lt(0),C(),a?(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.current.playTrackById(t.uid)):r.players.current.cueTrackById(t.uid)}function Pe(){return{isPlaying:f(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),elementId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function tr(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(S.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),o.playback.masterMute===!1&&o.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=wt.minCrossfadeToTime+wt.maxBufferingDelay&&Gt(se.TRACK,t,e)}))}function Gt(e,t,a=null){r.eventLog.add(c.ULTRAFUNK,u.CROSSFADE_START),r.players.crossfade.init(e,t,a)!==null&&C()}function ar(e,t=null){switch(S.log(`embeddedEventHandler() - event: ${S.getKeyForValue(s,e)}`),t!==null&&S.log(t),e){case s.MEDIA_ENDED:y(s.MEDIA_ENDED,Pe()),Ve(!0);break;case s.PLAYBACK_READY:ne(xt,Ae,Ve,Kt),Lt(er),y(s.PLAYBACK_READY,t),y(s.RESUME_AUTOPLAY,null,{resumeAutoplay:Za});break;case s.AUTOPLAY_BLOCKED:y(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:Ae});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:y(e,t,{skipToTrack:Ft});break}}var rr=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(l,d){S.log(`playbackState.sync() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(l)+1} - syncState: ${S.getKeyForValue(e,d)}`),r.players.isCurrent(l)?d===e.PLAY?y(s.MEDIA_PLAYING,Pe()):d===e.PAUSE&&y(s.MEDIA_PAUSED,Pe()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(l)),C(),a(l,d))}}})();var Ge={};He(Ge,{getStatus:()=>ur,init:()=>lr,nextTrack:()=>Ht,prevTrack:()=>qt,setVolume:()=>nr,toggleMute:()=>Ke,togglePlayPause:()=>Fe});var we=class extends H{#e=null;#t(t,a){if(t!==void 0){let l=Math.round(t);O(t*1e3,l,a),l>0&&a>0&&super.updateOncePerSecond(l,a)}}ready(t){super.init(),this.#e=t,k(s.MEDIA_PLAYING,()=>super.start())}updateTimer(){this.isVisible&&f()&&this.#t(this.#e.embedded.getCurrentTime(),this.#e.getDuration())}updateVolumeMute(){ye(this.#e.embedded.getVolume(),this.#e.embedded.isMuted())}},xe=new we;var v=A("list-playback"),X=new q(10),n={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},$e=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function lr(){v.log("init()"),it(_),Dt(_),or()!==null?dr():b("No playable YouTube tracks!",0,"help",()=>le({modalTitle:"No playable tracks",modalBody:$e}))}function or(){if(n.currentTrackId=w(),n.autoplayData=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY)),sessionStorage.removeItem(F.UF_AUTOPLAY),n.currentTrackId!==null){if(n.autoplayData!==null&&n.autoplayData.trackId!==null){let e=pe(`[data-track-id="${n.autoplayData.trackId}"]`);e!==null?Ue(e)===h.YOUTUBE?n.currentTrackId=e.id:b("Cannot play SoundCloud track",5,"help",()=>le({modalTitle:"Cannot play SoundCloud track",modalBody:$e})):b("Unable to cue track (not found)",5)}yt(n.currentTrackId)}return v.log(`cueInitialTrack() - currentTrackId: ${n.currentTrackId} - autoplayData: ${n.autoplayData!==null?JSON.stringify(n.autoplayData):"N/A"}`),n.currentTrackId}function _(e,t=!0,a=!1){let l=Ue(dt(e));if(v.log(`setCurrentTrack() - nextTrackType: ${v.getKeyForValue(h,l)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),l===h.SOUNDCLOUD&&a){b("Cannot play SoundCloud track",5,"help",()=>le({modalTitle:"Cannot play SoundCloud track",modalBody:$e}));return}e===n.currentTrackId?Fe():(f()&&n.player.embedded.stopVideo(),n.currentTrackId=e,y(s.MEDIA_CUE_TRACK,{trackId:e,isPointerClick:a}),Wt(t))}function Wt(e){let t=Tt();n.player.resetState(),e?(n.player.playTrackById(t),x(g.PLAYING),C()):(n.player.cueTrackById(t),x(g.PAUSED))}function Fe(){n.currentTrackId===null?_(pe("div.track-entry.current").id):f()?n.player.embedded.pauseVideo():n.player.play(Se)}function nr(){n.player.setVolume(o.playback.masterVolume)}function Ke(e=!0){e&&(o.playback.masterMute=o.playback.masterMute!==!0),o.playback.masterMute?n.player.embedded.mute():n.player.embedded.unMute()}function qt(){let e=pt(),t=n.player.embedded.getCurrentTime();e!==null&&t<=5?(_(e,f()),C()):t!==0&&(n.player.embedded.seekTo(0),O(0,0,n.player.getDuration()))}function Ht(){let e=w();e!==null&&(_(e,f()),C())}async function Xt(e=!1,t=!1){let a=t?R.OFF:ce(),l=w();if(v.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${l} - repeatMode: ${v.getKeyForValue(R,a)}`),e&&a===R.ONE)n.player.embedded.seekTo(0),n.player.play(Se);else if(e&&l===null&&a===R.ALL)_(w(null)),Y(0);else if(l===null)if(o.list.showLoadMoreTracks){let d=await kt();e&&d&&_(w())}else K(P.nextPage,e);else e?_(l):x(g.PAUSED)}function ir(){f()===!1&&n.autoplayData!==null&&(X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),X.add(c.YOUTUBE,-1,w())),f()===!1&&Xt(!0,!0)}function cr(){n.currentTrackId=null,x(g.PAUSED)}function ur(){let e=pe("div.track-entry.current");if(e!==null){let t=ut("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:f(),currentTrack:a+1,trackType:h.YOUTUBE,position:Math.ceil(n.player.embedded.getCurrentTime()),numTracks:1,trackId:t[a].getAttribute("data-track-id"),elementId:t[a].id,iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function dr(){v.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){v.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:pr,onStateChange:yr,onError:Se},playerVars:{disablekb:1}});n.player=new Ze(a),v.log(n.player),oe(n.player,l=>n.player.embedded.seekTo(l)),y(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function pr(){v.log("onYouTubePlayerReady()"),n.autoplayData?.autoplay===!0&&X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),ne(qt,Fe,Ht,Ke),y(s.PLAYBACK_LOADING,{loadingPercent:66}),xe.ready(n.player),ct(n.player),Ke(!1),n.player.setVolume(o.playback.masterVolume),y(s.PLAYBACK_READY,{resetProgressBar:!1}),Wt(n.autoplayData?.autoplay===!0)}function yr(e){switch(v.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${n.currentTrackId}`),X.add(c.YOUTUBE,e.data,n.currentTrackId),e.data!==YT.PlayerState.PLAYING&&G(),e.data){case YT.PlayerState.UNSTARTED:kr();break;case YT.PlayerState.BUFFERING:y(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:Er(),y(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:x(g.PAUSED);break;case YT.PlayerState.ENDED:xe.stop(),y(s.MEDIA_ENDED),Xt(o.playback.autoplay);break}}function kr(){X.ytAutoplayBlocked(n.currentTrackId,3e3)&&(x(g.PAUSED),n.currentSnackbarId=b("Autoplay blocked, Play to continue",0,"play",()=>n.player.play(Se))),n.playerReady===!1&&(n.playerReady=!0,y(s.PLAYBACK_LOADING,{loadingPercent:0}))}function Er(){re(n.currentSnackbarId),n.firstStatePlaying&&(n.firstStatePlaying=!1,n.autoplayData=null,setTimeout(()=>{o.playback.autoplay&&f()&&Math.round(window.scrollY)<=1&&tt(et.SITE_MAX_WIDTH_MOBILE)&&Y(0)},6e3))}function Se(e){v.log(`onYouTubePlayerError(): playerError: ${e.data} - currentTrackId: ${n.currentTrackId} - isTrackCued: ${n.player.isTrackCued()}`),n.player.setPlayerError(e.data),n.player.isTrackCued()===!1&&(Et("Error!"),X.add(c.YOUTUBE,u.PLAYER_ERROR,n.currentTrackId),b("Unable to play track, skipping to next",5,"Stop",cr,ir))}var Ce=A("screen-wakelock"),he={wakeLock:null};function Jt(){o.mobile.keepScreenOn&&document.addEventListener("click",jt)}function jt(){Ce.log("enableScreenWakeLock()"),document.removeEventListener("click",jt),gr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&o.mobile.keepScreenOn&&Tr()})}function Tr(){zt()&&he.wakeLock===null&&Qt()}function zt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function gr(){zt()?document.visibilityState==="visible"&&await Qt()!==!0&&(Ce.log("enableWakeLock(): Screen Wake Lock request failed"),b("Keep Screen On failed",5,"Disable",()=>o.mobile.keepScreenOn=!1)):(Ce.log("enableWakeLock(): Screen Wake Lock is not supported"),b("Keep Screen On is not supported",5,"Disable",()=>o.mobile.keepScreenOn=!1))}async function Qt(){try{return he.wakeLock=await navigator.wakeLock.request("screen"),he.wakeLock.addEventListener("release",()=>{he.wakeLock=null}),!0}catch(e){Ce.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var te=A("playback-interaction"),Zt=new Ee(10),p={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null};document.addEventListener("DOMContentLoaded",()=>{Xe(),te.log("DOMContentLoaded"),Je(),gt()?p.player=Be:ft()&&(p.player=Ge),p.player!==null&&fr(),ht(p.player?.getStatus)});function fr(){te.log("initCommon()"),st(),mr(),p.player.init(),p.siteNavUiElements=new We("#site-navigation"),p.trackNavUiElements=new qe("nav.single-track-nav .nav-links"),W.init(),p.keyboardShortcuts=at(o.playback.keyboardShortcuts),br(),Jt()}function mr(){k(s.PLAYBACK_READY,Cr),k(s.MEDIA_CUE_TRACK,ta),k(s.MEDIA_ENDED,ta),k(s.MEDIA_TIME_REMAINING,Lr),k(s.MEDIA_PREV_TRACK,()=>M(null,L.PREV,P.prevPage)),k(s.MEDIA_NEXT_TRACK,()=>M(null,L.NEXT,P.nextPage))}function br(){J(".playback-shuffle-control span","click",bt),document.addEventListener("keydown",Ar),document.addEventListener("keydown",Pr),window.focus(),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&window.focus()},250)})}function Ar(e){if(p.isPlaybackReady&&p.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":ea(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&ea(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),Y(p.player.getStatus().elementId);break}switch(e.key){case" ":e.preventDefault(),p.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":At(e);break;case"ArrowLeft":Sr(e);break;case"ArrowRight":hr(e);break;case"A":Re.toggle();break;case"f":case"F":e.preventDefault(),W.toggle(document.getElementById(p.player.getStatus().iframeId));break;case"i":e.preventDefault(),de(document.getElementById(p.player.getStatus().elementId));break;case"I":e.preventDefault(),ue(document.getElementById(p.player.getStatus().elementId));break;case"m":case"M":e.preventDefault(),p.player.toggleMute(),b(o.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",3);break;case"p":case"P":Pt.toggle();break;case"r":case"R":b(`${nt().title} (<b>r</b> to change)`,3);break;case"x":case"X":St.toggle();break}}}}function Pr(e){if(p.isPlaybackReady&&p.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":rt===!1&&(te.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),p.player.togglePlayPause());break;case"MediaTrackPrevious":te.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),p.player.prevTrack();break;case"MediaTrackNext":te.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),p.player.nextTrack();break}}function Sr(e){e.preventDefault(),e.shiftKey===!0?M(null,L.PREV,P.prevPage):p.player.prevTrack()}function hr(e){e.preventDefault(),e.shiftKey===!0?M(null,L.NEXT,P.nextPage):p.player.nextTrack()}function M(e,t,a){e?.preventDefault(),z()&&p.player.getStatus().trackType===h.YOUTUBE?Ct()===!1?Q(t,p.player.getStatus().isPlaying):b("Loading track, please wait...",3):aa(null,a)}function ea(e){e.preventDefault(),o.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?o.playback.masterVolume<100?o.playback.masterVolume+5:100:o.playback.masterVolume>5?o.playback.masterVolume-5:5,p.player.setVolume()}function Cr(){J(".playback-details-control","click",Dr),J(".playback-thumbnail-control","click",vr),J(".playback-timer-control","click",Ir),p.isPlaybackReady=!0}function ta(){let e=Ne()&&p.player.getStatus().numTracks>1;(o.playback.autoExitFullscreen||e)&&W.exit()}function Lr(e){let t=e.data.timeRemainingSeconds<=o.playback.timeRemainingSeconds;o.playback.autoExitFsOnWarning&&t&&W.exit()}function Dr(){Y(p.player.getStatus().elementId)}function vr(){Ne()?(Zt.add(c.MOUSE,u.MOUSE_CLICK),Zt.doubleClicked(c.MOUSE,u.MOUSE_CLICK,500)&&W.enter(document.getElementById(p.player.getStatus().iframeId))):mt()&&Y(0)}function Ir(){Re.toggle()}var We=class extends j{elementClicked(){if(this.clicked("a.navbar-prev-link"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("a.navbar-next-link"))return M(this.event,L.NEXT,P.nextPage)}},qe=class extends j{elementClicked(){if(this.clicked("div.nav-previous a"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("div.nav-next a"))return M(this.event,L.NEXT,P.nextPage)}};function aa(e,t){e?.preventDefault(),K(t,p.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
