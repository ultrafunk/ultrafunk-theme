import{$ as T,$a as Dt,A as je,Aa as pt,B as C,Ba as w,C as ze,Ca as yt,D as De,Da as kt,E as Qe,Ea as x,F as Ze,Fa as Et,G as et,Ga as gt,H as j,Ha as Tt,Ia as ft,Ka as Ne,L as tt,La as mt,M as B,Ma as bt,Na as K,Oa as ye,Pa as Y,Qa as At,R as ve,Ra as W,Sa as Pt,T as at,Ta as St,Ua as Re,Va as Ct,W as le,Wa as L,X as rt,Xa as Q,Y as s,Ya as ht,Z as k,Za as Lt,_ as y,_a as Z,a as He,aa as Ie,ba as st,c as A,ca as ne,d as Xe,da as oe,ea as lt,fa as O,ga as h,ha as f,ia as nt,j as ae,ja as G,k as F,ka as ie,la as R,ma as ce,na as ot,oa as z,s as P,sa as ue,t as n,ta as de,u as Je,ua as it,va as ct,w as b,wa as pe,xa as ut,y as re,ya as dt,z as se,za as Ue}from"../chunk-4MEYM5WR.js";var ee=A("eventlogger"),c={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},u={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70,CUE_PLAY_SINGLE_TRACK:80},da={eventSource:c.UNKNOWN,eventType:u.UNKNOWN,uId:null,timeStamp:0},ke=class{#e=[];#t=0;#r=0;#a=0;constructor(t=10){this.#t=t}add(t,a,l=null,p=Date.now()){let g=Object.create(da);g.eventSource=t,g.eventType=a,g.uId=l,g.timeStamp=p,this.#e.length<this.#t?this.#e.push(g):(this.#e.shift(),this.#e.push(g))}clear(){this.#e=[]}getLastPos(){return this.#a}initMatch(){this.#a=this.#e.length-1,this.#r=0}matchesEvent(t,a,l,p=null){this.#e[this.#a-t].eventSource===a&&this.#e[this.#a-t].eventType===l&&this.#e[this.#a-t].uId===p&&this.#r++}matchesDelta(t,a){this.#e[this.#a].timeStamp-this.#e[this.#a-t].timeStamp<=a&&this.#r++}isPatternMatch(t,a){return this.#r===t?(ee.log(`MATCH for: ${a}`),this.logEventMatch(),!0):!1}logEventMatch(){let t=[];for(let a=0;a<this.#e.length;a++){let l={eventSource:ee.getKeyForValue(c,this.#e[a].eventSource),eventType:ee.getKeyForValue(u,this.#e[a].eventType),uId:this.#e[a].uId,timeStamp:this.#e[a].timeStamp};t.push(l)}ee.log(t)}},Ee=class extends ke{doubleClicked(t,a,l){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,l)),this.isPatternMatch(3,`${ee.getKeyForValue(c,t)} Double Clicked`)}},q=class extends ke{ytAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}ytSingleTrackAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK,null),this.matchesEvent(2,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(1,c.YOUTUBE,u.STATE_BUFFERING,t),this.matchesEvent(0,c.YOUTUBE,u.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Single Track Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,u.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.ULTRAFUNK,u.CROSSFADE_START,null),this.matchesEvent(1,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesEvent(0,c.SOUNDCLOUD,u.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Be={};He(Be,{getStatus:()=>Pe,init:()=>Xa,nextTrack:()=>Ve,prevTrack:()=>xt,setVolume:()=>za,toggleMute:()=>Kt,togglePlayPause:()=>Ae});var H=class{#e=-1;#t=0;isVisible=!0;config={updateTimerInterval:250,maxBufferingDelay:3};init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}updateTimer(){}updateVolumeMute(){}start(){this.stop(),this.#e=setInterval(()=>this.updateTimer(),this.config.updateTimerInterval)}stop(){this.#e!==-1&&(clearInterval(this.#e),this.#e=-1),this.#t=0,ie(!1)}updateOncePerSecond(t,a){if(this.#t!==t&&(this.#t=t,this.updateVolumeMute(),n.playback.autoplay===!1&&n.playback.timeRemainingWarning)){let l=a-t;l<=n.playback.timeRemainingSeconds?(ie(!0),y(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:l})):ie(!1)}}};var Ye=class extends H{#e=null;#t=null;#r(t,a=0){let l=Math.round(t/1e3);O(t,l,a),l>0&&a>0&&(super.updateOncePerSecond(l,a),this.#s(l,a))}#a(){return n.playback.autoplay&&n.gallery.autoCrossfade}#s(t,a){n.playback.masterMute===!1&&this.#a()&&a-t===n.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrack()+1<=this.#e.getNumTracks()&&this.#t(se.AUTO,{name:"Auto Crossfade",length:n.gallery.autoCrossfadeLength,curve:n.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>ye(Math.round(t),this.#e.current.isMuted()))}},I=new Ye;var m=A("embedded-players"),U=new q(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},ya={maxPlaybackStartDelay:3};function It(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),ga(),La()}function Te(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function Ut(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):y(s.PLAYBACK_LOADING,Te())}function ka(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),l=t.querySelector("iframe"),p=null;if(a===C.YOUTUBE)e.length===1&&l===null?p=vt("youtube-player",t,!0):p=vt(l.id,t,!1);else if(a===C.SOUNDCLOUD){let g=SC.Widget(l.id);p=new Qe(t.id,l.id,g,l.src),g.bind(SC.Widget.Events.READY,()=>Da(l.id,t,p,g)),g.bind(SC.Widget.Events.PLAY,va),g.bind(SC.Widget.Events.PAUSE,Ia),g.bind(SC.Widget.Events.FINISH,Ua),g.bind(SC.Widget.Events.ERROR,Na)}p!==null&&(p.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(p))})}function vt(e,t,a=!1){let l=t.getAttribute("data-track-source-uid"),p=new YT.Player(e,{events:{onReady:V=>Ta(V,e),onStateChange:V=>fa(V,e),onError:V=>ha(V,e)},playerVars:{disablekb:1},...a&&{videoId:l}}),g=null;return a?g=new De(t.id,e,p,l):g=new ze(t.id,e,p,l),g.setDuration(parseInt(t.getAttribute("data-track-duration"))),g}function me(e,t){m.log("onPlayerError()"),m.log(e);let a=e.getTrackType()===C.YOUTUBE?c.YOUTUBE:c.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),U.add(a,u.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,Ea(e,t))}function Ea(e,t){let a=e.getArtist()||"N/A",l=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${l}`,mediaUrl:t}}function ga(){m.log("initYouTubeAPI()"),y(s.PLAYBACK_LOADING,Te()),window.onYouTubeIframeAPIReady=function(){m.log("onYouTubeIframeAPIReady()"),y(s.PLAYBACK_LOADING,Te()),ka()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Ta(e,t){let a=i.players.playerFromUid(t);e.target.getPlayerState()===-1?(m.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):m.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),Ut()}function fa(e,t){switch(U.add(c.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:ma(t);break;case YT.PlayerState.BUFFERING:ba(t);break;case YT.PlayerState.PLAYING:Aa(t);break;case YT.PlayerState.PAUSED:Pa(t);break;case YT.PlayerState.CUED:Sa(t);break;case YT.PlayerState.ENDED:Ca(t);break}}function ma(e){m.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),(U.ytAutoplayBlocked(e,3e3)||U.ytSingleTrackAutoplayBlocked(e,3e3))&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function ba(e){if(m.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(n.playback.masterMute),t.setVolume(n.playback.masterVolume),y(s.MEDIA_LOADING)}}function Aa(e){m.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.sync(e,i.playbackState.STATE.PLAY),I.start()}function Pa(e){m.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),I.stop()):i.players.crossfade.stop()}function Sa(e){m.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`)}function Ca(e){m.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function ha(e,t){let a=i.players.playerFromUid(t);e.data===150&&a instanceof De&&a.isCued()?(m.log("onYouTubePlayerError(150) - SingleTrack.isCued(): true"),a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(m.log("onYouTubePlayerError: "+e.data),a.setIsPlayable(!1),me(a,e.target.getVideoUrl()))}function La(){m.log("initSoundCloudAPI()"),y(s.PLAYBACK_LOADING,Te())}function Da(e,t,a,l){m.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getUid()} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),l.getDuration(p=>{a.setDuration(Math.round(p/1e3)),t.setAttribute("data-track-duration",a.getDuration()),Ut()})}function va(e){m.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?U.scPlayDoubleTrigger(e.soundId,ya.maxPlaybackStartDelay*1e3)&&i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(n.playback.masterMute),i.players.current.setVolume(n.playback.masterVolume)),I.start()}function Ia(e){m.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),U.add(c.SOUNDCLOUD,u.STATE_PAUSED,e.soundId),U.scAutoplayBlocked(e.soundId,3e3)?(I.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):U.scWidgetPlayBlocked(e.soundId,3e4)?(I.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.sync(e.soundId,i.playbackState.STATE.PAUSE),I.stop())}):i.players.crossfade.stop()}function Ua(e){m.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(I.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Na(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);m.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${e.id} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)})}var N=A("gallery-events"),be={snackbarId:0,nowPlayingIcons:null},Oe={nowPlayingIconsSelector:"h2.track-artist-title"};function Nt(){N.log("init()"),be.nowPlayingIcons=document.querySelectorAll(Oe.nowPlayingIconsSelector),k(s.MEDIA_PLAYING,Ya),k(s.MEDIA_PAUSED,Oa),k(s.MEDIA_ENDED,_a),k(s.MEDIA_CUE_TRACK,Ma),k(s.CONTINUE_AUTOPLAY,Va),k(s.RESUME_AUTOPLAY,Ba),k(s.AUTOPLAY_BLOCKED,wa),k(s.PLAYBACK_BLOCKED,xa),k(s.MEDIA_UNAVAILABLE,Ka)}function Ya(e){if(N.log(e),re(be.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Oe.nowPlayingIconsSelector}`);Rt(t),B(t,"playing-paused","now-playing-icon"),n.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Oa(e){N.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Oe.nowPlayingIconsSelector}`).classList.add("playing-paused")}function _a(e){N.log(e),e!==null&&e.data.numTracks>1&&Rt()}function Ma(e){N.log(e),e.data.scrollToMedia&&Y(e.data.trackId)}function Va(e){N.log(e),Q()&&e.data.trackType===C.YOUTUBE?Z(L.NEXT,!0):K(P.nextPage,!0)}function Ba(e){let t=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY));if(sessionStorage.removeItem(F.UF_AUTOPLAY),N.log(e),N.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id??null;a===null&&t.trackId!==null?b({message:"Unable to cue track (not found)",duration:5}):e.callback.resumeAutoplay(t,a)}}function wa(e){N.log(e),be.snackbarId=b({message:"Autoplay blocked, Play to continue",duration:0,actionText:"play",actionClickCallback:()=>e.callback.togglePlayPause()})}function xa(e){N.log(e),b({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>Yt(e)})}function Ka(e){N.log(e),b({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>Yt(e)})}function Rt(e){be.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Yt(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):Q()&&e.data.trackType===C.YOUTUBE?Z(L.NEXT,n.playback.autoplay):P.nextPage!==null&&K(P.nextPage,!0)}var Me=A("gallery-controls"),te={uiElements:null,players:{}},D={},$={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function _t(e,t){Me.log("init()"),te.players=e,te.uiElements=new _e("div.track-meta",!0),D.crossfadePreset=Ie($.crossfadePresetSelector),D.crossfadeTo=Ie($.crossfadeToSelector),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(a=>Mt(a,n.gallery.trackCrossfadeDefPreset)),D.crossfadeTo.clickCallback=t),k(s.PLAYBACK_READY,Fa)}function Fa(){Me.log("playbackReady()"),D.crossfadePreset.length>1&&D.crossfadeTo.length>1&&(D.crossfadePreset.forEach(e=>{e.addEventListener("click",Ga),B(e,T.DISABLED.CLASS,T.ENABLED.CLASS)}),D.crossfadeTo.forEach(e=>e.addEventListener("click",Wa)),k(s.MEDIA_PLAYING,Ot),k(s.MEDIA_PAUSED,Ot))}var _e=class extends z{elementClicked(){if(this.clicked("div.track-share-control"))return ue(this.closest("single-track, gallery-track"));if(this.clicked("div.track-details-control"))return de(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return ve(this.event);if(this.clicked("span.track-channels-links"))return ve(this.event)}};function Mt(e,t){e.setAttribute($.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${ae.crossfade[t].name}`}function Ga(e){let t=parseInt(e.target.getAttribute($.crossfadePresetData));Mt(e.target,t+1<ae.crossfade.length?t+1:0)}function Wa(e){if(f()&&te.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),l=parseInt(t.querySelector($.crossfadePresetSelector).getAttribute($.crossfadePresetData));B(t.querySelector(`div${$.crossfadeToSelector}`),T.ENABLED.CLASS,T.DISABLED.CLASS),D.crossfadeTo.clickCallback(te.players.uIdFromIframeId(a.id),ae.crossfade[l])}}}function Ot(){let e=f(),t=e?te.players.getTrackData().currentTrack:-1;Me.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),D.crossfadeTo.forEach((a,l)=>{t===l+1?B(a,e?T.ENABLED.CLASS:T.DISABLED.CLASS,e?T.DISABLED.CLASS:T.ENABLED.CLASS):B(a,e?T.DISABLED.CLASS:T.ENABLED.CLASS,e?T.ENABLED.CLASS:T.DISABLED.CLASS)})}var Vt=A("gallery-players"),Bt=()=>{let e=null,t=null,a=[],l=new Map,p=0;return{indexMap:l,get crossfade(){return t},get current(){return a[p]},get next(){return a[p+1]},getPlayerIndex(){return p},setPlayerIndex(E){p=E},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return p+1},playerFromUid(E){return a[l.get(E)]},trackFromUid(E){return l.get(E)+1},isCurrent(E){return E===this.current.getUid()},init:g,add:V,uIdFromIframeId:ra,stop:sa,mute:la,getTrackData:na,prevTrack:oa,nextTrack:ia,jumpToTrack:ca};function g(E){Vt.log("init()"),e=E,t=je(this),k(s.MEDIA_PLAYING,()=>t.start()),k(s.MEDIA_PAUSED,()=>t.stop())}function V(E){Vt.log(E),a.push(E),l.set(E.getUid(),a.length-1)}function ra(E){return a.find(Le=>Le.getIframeId()===E).getUid()}function sa(){this.current.stop(),t.stop()}function la(){this.current.mute(n.playback.masterMute),t.mute(n.playback.masterMute)}function na(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function oa(E){return p>0?(p--,e(E),!0):!1}function ia(E){return p++,p<this.getNumTracks()?(e(E),!0):!1}function ca(E,Le,ua=!0){return E>0&&E<=this.getNumTracks()?(p=E-1,e(Le,ua),!0):!1}};var S=A("gallery-playback"),r={eventLog:null,players:{}},wt={minCrossfadeToTime:5,maxBufferingDelay:3};function Xa(){S.log("init()"),r.eventLog=U,Nt(),r.players=Bt(),r.players.init($t),ne(r.players,ja),_t(r.players,tr),I.init(r.players,Gt),It(r.players,rr,ar)}function Ae(){f()?(G(),r.players.current.pause()):(nt(),r.players.current.play(me))}function xt(){S.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),O(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(f())?h():y(s.MEDIA_PREV_TRACK))})}function Ve(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();S.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${n.playback.autoplay}`),!Ja(e,t)&&(t===!1?(r.players.stop(),e&&n.playback.autoplay===!1?G():r.players.nextTrack(f())&&h()):t===!0&&e===!1?y(s.MEDIA_NEXT_TRACK):e&&(G(),n.playback.autoplay?y(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Ja(e,t){if(e&&n.playback.autoplay){let a=ce();if(S.log(`repeatPlayback(): ${S.getKeyForValue(R,a)}`),a===R.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===R.ALL)return r.players.stop(),r.players.setPlayerIndex(0),$t(!0),!0}return!1}function ja(e){r.players.current.seekTo(e)}function za(){r.players.current.setVolume(n.playback.masterVolume)}function Kt(){n.playback.masterMute=n.playback.masterMute!==!0,r.players.mute()}function Qa(e,t=!0){S.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),h()}function $t(e,t=!0){y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(me)}function Ft(e,t=!0){S.log(`skipToTrack(): ${e} - ${t}`),t===!0&&f()===!1&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.jumpToTrack(e,t)&&h())}function Za(e,t=null){S.log(`resumeAutoplay(): ${e.autoplay} - iframeId: ${t}`),t!==null?e.autoplay?Ft(r.players.trackFromUid(t),!0):Qa(t):e.autoplay&&(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),Ae())}function er(e,t,a=!1){S.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.eventLog.add(c.ULTRAFUNK,u.CUE_PLAY_SINGLE_TRACK),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),lt(0),h(),a?(r.eventLog.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),r.players.current.playTrackById(t.uid)):r.players.current.cueTrackById(t.uid)}function Pe(){return{isPlaying:f(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),elementId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function tr(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(S.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),n.playback.masterMute===!1&&n.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=wt.minCrossfadeToTime+wt.maxBufferingDelay&&Gt(se.TRACK,t,e)}))}function Gt(e,t,a=null){r.eventLog.add(c.ULTRAFUNK,u.CROSSFADE_START),r.players.crossfade.init(e,t,a)!==null&&h()}function ar(e,t=null){switch(S.log(`embeddedEventHandler() - event: ${S.getKeyForValue(s,e)}`),t!==null&&S.log(t),e){case s.MEDIA_ENDED:y(s.MEDIA_ENDED,Pe()),Ve(!0);break;case s.PLAYBACK_READY:oe(xt,Ae,Ve,Kt),Lt(er),y(s.PLAYBACK_READY,t),y(s.RESUME_AUTOPLAY,null,{resumeAutoplay:Za});break;case s.AUTOPLAY_BLOCKED:y(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:Ae});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:y(e,t,{skipToTrack:Ft});break}}var rr=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(l,p){S.log(`playbackState.sync() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(l)+1} - syncState: ${S.getKeyForValue(e,p)}`),r.players.isCurrent(l)?p===e.PLAY?y(s.MEDIA_PLAYING,Pe()):p===e.PAUSE&&y(s.MEDIA_PAUSED,Pe()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(l)),h(),a(l,p))}}})();var Ge={};He(Ge,{getStatus:()=>ur,init:()=>lr,nextTrack:()=>Ht,prevTrack:()=>qt,setVolume:()=>or,toggleMute:()=>Ke,togglePlayPause:()=>Fe});var we=class extends H{#e=null;#t(t,a){if(t!==void 0){let l=Math.round(t);O(t*1e3,l,a),l>0&&a>0&&super.updateOncePerSecond(l,a)}}ready(t){super.init(),this.#e=t,k(s.MEDIA_PLAYING,()=>super.start())}updateTimer(){this.isVisible&&f()&&this.#t(this.#e.embedded.getCurrentTime(),this.#e.getDuration())}updateVolumeMute(){ye(this.#e.embedded.getVolume(),this.#e.embedded.isMuted())}},xe=new we;var v=A("list-playback"),X=new q(10),o={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},$e=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function lr(){v.log("init()"),it(_),Dt(_),nr()!==null?dr():b({message:"No playable YouTube tracks!",duration:0,actionText:"help",actionClickCallback:()=>le({modalTitle:"No playable tracks",modalBody:$e})})}function nr(){if(o.currentTrackId=w(),o.autoplayData=JSON.parse(sessionStorage.getItem(F.UF_AUTOPLAY)),sessionStorage.removeItem(F.UF_AUTOPLAY),o.currentTrackId!==null){if(o.autoplayData!==null&&o.autoplayData.trackId!==null){let e=pe(`[data-track-id="${o.autoplayData.trackId}"]`);e!==null?Ue(e)===C.YOUTUBE?o.currentTrackId=e.id:b({message:"Cannot play SoundCloud track",duration:5,actionText:"help",actionClickCallback:()=>le({modalTitle:"Cannot play SoundCloud track",modalBody:$e})}):b({message:"Unable to cue track (not found)",duration:5})}yt(o.currentTrackId)}return v.log(`cueInitialTrack() - currentTrackId: ${o.currentTrackId} - autoplayData: ${o.autoplayData!==null?JSON.stringify(o.autoplayData):"N/A"}`),o.currentTrackId}function _(e,t=!0,a=!1){let l=Ue(dt(e));if(v.log(`setCurrentTrack() - nextTrackType: ${v.getKeyForValue(C,l)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),l===C.SOUNDCLOUD&&a){b({message:"Cannot play SoundCloud track",duration:5,actionText:"help",actionClickCallback:()=>le({modalTitle:"Cannot play SoundCloud track",modalBody:$e})});return}e===o.currentTrackId?Fe():(f()&&o.player.embedded.stopVideo(),o.currentTrackId=e,y(s.MEDIA_CUE_TRACK,{trackId:e,isPointerClick:a}),Wt(t))}function Wt(e){let t=gt();o.player.resetState(),e?(o.player.playTrackById(t),x(T.PLAYING),h()):(o.player.cueTrackById(t),x(T.PAUSED))}function Fe(){o.currentTrackId===null?_(pe("div.track-entry.current").id):f()?o.player.embedded.pauseVideo():o.player.play(Se)}function or(){o.player.setVolume(n.playback.masterVolume)}function Ke(e=!0){e&&(n.playback.masterMute=n.playback.masterMute!==!0),n.playback.masterMute?o.player.embedded.mute():o.player.embedded.unMute()}function qt(){let e=pt(),t=o.player.embedded.getCurrentTime();e!==null&&t<=5?(_(e,f()),h()):t!==0&&(o.player.embedded.seekTo(0),O(0,0,o.player.getDuration()))}function Ht(){let e=w();e!==null&&(_(e,f()),h())}async function Xt(e=!1,t=!1){let a=t?R.OFF:ce(),l=w();if(v.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${l} - repeatMode: ${v.getKeyForValue(R,a)}`),e&&a===R.ONE)o.player.embedded.seekTo(0),o.player.play(Se);else if(e&&l===null&&a===R.ALL)_(w(null)),Y(0);else if(l===null)if(n.list.showLoadMoreTracks){let p=await kt();e&&p&&_(w())}else K(P.nextPage,e);else e?_(l):x(T.PAUSED)}function ir(){f()===!1&&o.autoplayData!==null&&(X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),X.add(c.YOUTUBE,-1,w())),f()===!1&&Xt(!0,!0)}function cr(){o.currentTrackId=null,x(T.PAUSED)}function ur(){let e=pe("div.track-entry.current");if(e!==null){let t=ut("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:f(),currentTrack:a+1,trackType:C.YOUTUBE,position:Math.ceil(o.player.embedded.getCurrentTime()),numTracks:1,trackId:t[a].getAttribute("data-track-id"),elementId:t[a].id,iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function dr(){v.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){v.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:pr,onStateChange:yr,onError:Se},playerVars:{disablekb:1}});o.player=new Ze(a),v.log(o.player),ne(o.player,l=>o.player.embedded.seekTo(l)),y(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function pr(){v.log("onYouTubePlayerReady()"),o.autoplayData?.autoplay===!0&&X.add(c.ULTRAFUNK,u.RESUME_AUTOPLAY),oe(qt,Fe,Ht,Ke),y(s.PLAYBACK_LOADING,{loadingPercent:66}),xe.ready(o.player),ct(o.player),Ke(!1),o.player.setVolume(n.playback.masterVolume),y(s.PLAYBACK_READY,{resetProgressBar:!1}),Wt(o.autoplayData?.autoplay===!0)}function yr(e){switch(v.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${o.currentTrackId}`),X.add(c.YOUTUBE,e.data,o.currentTrackId),e.data!==YT.PlayerState.PLAYING&&G(),e.data){case YT.PlayerState.UNSTARTED:kr();break;case YT.PlayerState.BUFFERING:y(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:Er(),y(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:x(T.PAUSED);break;case YT.PlayerState.ENDED:xe.stop(),y(s.MEDIA_ENDED),Xt(n.playback.autoplay);break}}function kr(){X.ytAutoplayBlocked(o.currentTrackId,3e3)&&(x(T.PAUSED),o.currentSnackbarId=b({message:"Autoplay blocked, Play to continue",duration:0,actionText:"play",actionClickCallback:()=>o.player.play(Se)})),o.playerReady===!1&&(o.playerReady=!0,y(s.PLAYBACK_LOADING,{loadingPercent:0}))}function Er(){re(o.currentSnackbarId),o.firstStatePlaying&&(o.firstStatePlaying=!1,o.autoplayData=null,setTimeout(()=>{n.playback.autoplay&&f()&&Math.round(window.scrollY)<=1&&tt(et.SITE_MAX_WIDTH_MOBILE)&&Y(0)},6e3))}function Se(e){v.log(`onYouTubePlayerError(): playerError: ${e.data} - currentTrackId: ${o.currentTrackId} - isTrackCued: ${o.player.isTrackCued()}`),o.player.setPlayerError(e.data),o.player.isTrackCued()===!1&&(Et("Error!"),X.add(c.YOUTUBE,u.PLAYER_ERROR,o.currentTrackId),b({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",actionClickCallback:cr,afterCloseCallback:ir}))}var he=A("screen-wakelock"),Ce={wakeLock:null};function Jt(){n.mobile.keepScreenOn&&document.addEventListener("click",jt)}function jt(){he.log("enableScreenWakeLock()"),document.removeEventListener("click",jt),Tr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&n.mobile.keepScreenOn&&gr()})}function gr(){zt()&&Ce.wakeLock===null&&Qt()}function zt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function Tr(){zt()?document.visibilityState==="visible"&&await Qt()!==!0&&(he.log("enableWakeLock(): Screen Wake Lock request failed"),b({message:"Keep Screen On failed",duration:5,actionText:"Disable",actionClickCallback:()=>n.mobile.keepScreenOn=!1})):(he.log("enableWakeLock(): Screen Wake Lock is not supported"),b({message:"Keep Screen On is not supported",duration:5,actionText:"Disable",actionClickCallback:()=>n.mobile.keepScreenOn=!1}))}async function Qt(){try{return Ce.wakeLock=await navigator.wakeLock.request("screen"),Ce.wakeLock.addEventListener("release",()=>{Ce.wakeLock=null}),!0}catch(e){he.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var J=A("playback-interaction"),Zt=new Ee(10),d={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null,broadcastChannel:null};document.addEventListener("DOMContentLoaded",()=>{Xe(),J.log("DOMContentLoaded"),Je(),Tt()?d.player=Be:ft()&&(d.player=Ge),d.player!==null&&fr(),Ct(d.player?.getStatus)});function fr(){J.log("initCommon()"),st(),mr(),d.player.init(),d.siteNavUiElements=new We("#site-navigation"),d.trackNavUiElements=new qe("nav.single-track-nav .nav-links"),W.init(),d.keyboardShortcuts=at(n.playback.keyboardShortcuts),d.broadcastChannel=new BroadcastChannel("playbackStatus"),br(),Jt()}function mr(){k(s.PLAYBACK_READY,hr),k(s.MEDIA_PLAYING,()=>d.broadcastChannel.postMessage(s.MEDIA_PLAYING)),k(s.MEDIA_CUE_TRACK,ta),k(s.MEDIA_ENDED,ta),k(s.MEDIA_TIME_REMAINING,Lr),k(s.MEDIA_PREV_TRACK,()=>M(null,L.PREV,P.prevPage)),k(s.MEDIA_NEXT_TRACK,()=>M(null,L.NEXT,P.nextPage))}function br(){j(".playback-shuffle-control span","click",bt),document.addEventListener("keydown",Ar),document.addEventListener("keydown",Pr),window.focus(),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&window.focus()},250)}),d.broadcastChannel.onmessage=e=>{J.log(`broadcastChannel('playbackStatus') message: ${e.data}`),e.data===s.MEDIA_PLAYING&&n.playback.pauseOnPlayerChange&&d.player.getStatus().isPlaying&&d.player.togglePlayPause()}}function Ar(e){if(d.isPlaybackReady&&d.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":ea(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&ea(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),Y(d.player.getStatus().elementId);break}switch(e.key){case" ":e.preventDefault(),d.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":At(e);break;case"ArrowLeft":Sr(e);break;case"ArrowRight":Cr(e);break;case"A":Re.toggle();break;case"f":case"F":e.preventDefault(),W.toggle(document.getElementById(d.player.getStatus().iframeId));break;case"i":e.preventDefault(),de(document.getElementById(d.player.getStatus().elementId));break;case"I":e.preventDefault(),ue(document.getElementById(d.player.getStatus().elementId));break;case"m":case"M":e.preventDefault(),d.player.toggleMute(),b({message:n.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",duration:3});break;case"p":case"P":Pt.toggle();break;case"r":case"R":b({message:`${ot().title} (<b>r</b> to change)`,duration:3});break;case"x":case"X":St.toggle();break}}}}function Pr(e){if(d.isPlaybackReady&&d.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":rt===!1&&(J.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),d.player.togglePlayPause());break;case"MediaTrackPrevious":J.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),d.player.prevTrack();break;case"MediaTrackNext":J.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),d.player.nextTrack();break}}function Sr(e){e.preventDefault(),e.shiftKey===!0?M(null,L.PREV,P.prevPage):d.player.prevTrack()}function Cr(e){e.preventDefault(),e.shiftKey===!0?M(null,L.NEXT,P.nextPage):d.player.nextTrack()}function M(e,t,a){e?.preventDefault(),Q()&&d.player.getStatus().trackType===C.YOUTUBE?ht()===!1?Z(t,d.player.getStatus().isPlaying):b({message:"Loading track, please wait...",duration:3}):aa(null,a)}function ea(e){e.preventDefault(),n.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?n.playback.masterVolume<100?n.playback.masterVolume+5:100:n.playback.masterVolume>5?n.playback.masterVolume-5:5,d.player.setVolume()}function hr(){j(".playback-details-control","click",Dr),j(".playback-thumbnail-control","click",vr),j(".playback-timer-control","click",Ir),d.isPlaybackReady=!0}function ta(){let e=Ne()&&d.player.getStatus().numTracks>1;(n.playback.autoExitFullscreen||e)&&W.exit()}function Lr(e){let t=e.data.timeRemainingSeconds<=n.playback.timeRemainingSeconds;n.playback.autoExitFsOnWarning&&t&&W.exit()}function Dr(){Y(d.player.getStatus().elementId)}function vr(){Ne()?(Zt.add(c.MOUSE,u.MOUSE_CLICK),Zt.doubleClicked(c.MOUSE,u.MOUSE_CLICK,500)&&W.enter(document.getElementById(d.player.getStatus().iframeId))):mt()&&Y(0)}function Ir(){Re.toggle()}var We=class extends z{elementClicked(){if(this.clicked("a.navbar-prev-link"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("a.navbar-next-link"))return M(this.event,L.NEXT,P.nextPage)}},qe=class extends z{elementClicked(){if(this.clicked("div.nav-previous a"))return M(this.event,L.PREV,P.prevPage);if(this.clicked("div.nav-next a"))return M(this.event,L.NEXT,P.nextPage)}};function aa(e,t){e?.preventDefault(),K(t,d.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
