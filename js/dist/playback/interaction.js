import{$ as T,$a as Ct,A as He,Aa as it,B as h,Ba as F,C as Xe,Ca as ct,D as Je,Da as ut,E as je,Ea as x,F as ze,Fa as pt,G as J,Ga as yt,Ha as dt,Ia as kt,K as Qe,Ka as Ie,L as V,La as gt,Ma as Tt,Na as w,Oa as pe,Pa as Y,Q as Ce,Qa as Et,Ra as G,Sa as ft,T as Ze,Ta as mt,Ua as ve,Va as bt,W as re,Wa as L,X as et,Xa as z,Y as s,Ya as Pt,Z as p,Za as At,_ as u,_a as Q,a as Ge,aa as Se,ba as tt,c as b,ca as se,d as We,da as le,ea as at,fa as N,ga as O,ha as f,ia as rt,j as ee,ja as K,k as $,ka as ne,la as U,ma as oe,na as st,oa as j,s as C,sa as ie,t as n,ta as ce,u as qe,ua as lt,va as nt,w as E,wa as ue,xa as ot,y as te,ya as he,z as ae,za as Le}from"../chunk-VIAYMLVQ.js";var Z=b("eventlogger"),y={UNKNOWN:-1e4,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},k={UNKNOWN:-1e4,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},ia={eventSource:y.UNKNOWN,eventType:k.UNKNOWN,uId:null,timestamp:0},ye=class{#e=[];#t=0;#r=0;#a=0;constructor(t=10){this.#t=t}add(t,a,l=null,d=Date.now()){let g=Object.create(ia);g.eventSource=t,g.eventType=a,g.uId=l,g.timestamp=d,this.#e.length<this.#t?this.#e.push(g):(this.#e.shift(),this.#e.push(g))}clear(){this.#e=[]}getLastPos(){return this.#a}initMatch(){this.#a=this.#e.length-1,this.#r=0}matchesEvent(t,a,l,d=null){this.#e[this.#a-t].eventSource===a&&this.#e[this.#a-t].eventType===l&&this.#e[this.#a-t].uId===d&&this.#r++}matchesDelta(t,a){this.#e[this.#a].timestamp-this.#e[this.#a-t].timestamp<=a&&this.#r++}isPatternMatch(t,a){return this.#r===t?(Z.log(`MATCH for: ${a}`),this.logEventMatch(),!0):!1}logEventMatch(){let t=[];for(let a=0;a<this.#e.length;a++){let l={eventSource:Z.getKeyForValue(y,this.#e[a].eventSource),eventType:Z.getKeyForValue(k,this.#e[a].eventType),uId:this.#e[a].uId,timestamp:this.#e[a].timestamp};t.push(l)}Z.log(t)}},de=class extends ye{doubleClicked(t,a,l){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,l)),this.isPatternMatch(3,`${Z.getKeyForValue(y,t)} Double Clicked`)}},ke=class extends ye{scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,y.ULTRAFUNK,k.RESUME_AUTOPLAY,null),this.matchesEvent(2,y.SOUNDCLOUD,k.STATE_PLAYING,t),this.matchesEvent(1,y.SOUNDCLOUD,k.STATE_PAUSED,t),this.matchesEvent(0,y.SOUNDCLOUD,k.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,y.SOUNDCLOUD,k.STATE_PLAYING,t),this.matchesEvent(1,y.SOUNDCLOUD,k.STATE_PAUSED,t),this.matchesEvent(0,y.SOUNDCLOUD,k.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,y.ULTRAFUNK,k.CROSSFADE_START,null),this.matchesEvent(1,y.SOUNDCLOUD,k.STATE_PLAYING,t),this.matchesEvent(0,y.SOUNDCLOUD,k.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Me={};Ge(Me,{getStatus:()=>me,init:()=>Wa,nextTrack:()=>Oe,pause:()=>Vt,play:()=>H,prevTrack:()=>wt,setVolume:()=>Xa,toggleMute:()=>Bt,togglePlayPause:()=>xt});var W=class{#e=-1;#t=0;isVisible=!0;config={updateTimerInterval:250,maxBufferingDelay:3};init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}updateTimer(){}updateVolumeMute(){}start(){this.stop(),this.#e=setInterval(()=>this.updateTimer(),this.config.updateTimerInterval)}stop(){this.#e!==-1&&(clearInterval(this.#e),this.#e=-1),this.#t=0,ne(!1)}updateOncePerSecond(t,a){if(this.#t!==t&&(this.#t=t,this.updateVolumeMute(),n.playback.autoplay===!1&&n.playback.timeRemainingWarning)){let l=a-t;l<=n.playback.timeRemainingSeconds?(ne(!0),u(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:l})):ne(!1)}}};var Ne=class extends W{#e=null;#t=null;#r(t,a=0){let l=Math.round(t/1e3);N(t,l,a),l>0&&a>0&&(super.updateOncePerSecond(l,a),this.#s(l,a))}#a(){return n.playback.autoplay&&n.gallery.autoCrossfade}#s(t,a){n.playback.masterMute===!1&&this.#a()&&a-t===n.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrackNum()+1<=this.#e.getNumTracks()&&this.#t(ae.AUTO,{name:"Auto Crossfade",length:n.gallery.autoCrossfadeLength,curve:n.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>pe(Math.round(t),this.#e.current.isMuted()))}},v=new Ne;var m=b("embedded-players"),R=new ke(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},ua={maxPlaybackStartDelay:3};function ht(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),da(),Ca()}function ge(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function Lt(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):u(s.PLAYBACK_LOADING,ge())}function pa(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),l=t.querySelector("iframe"),d=null;if(a===h.YOUTUBE)e.length===1&&l===null?d=St("youtube-player",t,!0):d=St(l.id,t,!1),d.setDuration(parseInt(t.getAttribute("data-track-duration")));else if(a===h.SOUNDCLOUD){let g=SC.Widget(l.id);d=new Je(t.id,l.id,g),g.bind(SC.Widget.Events.READY,()=>Sa(l.id,t,d,g)),g.bind(SC.Widget.Events.PLAY,()=>ha(l.id)),g.bind(SC.Widget.Events.PAUSE,()=>La(l.id)),g.bind(SC.Widget.Events.FINISH,()=>Ia(l.id)),g.bind(SC.Widget.Events.ERROR,()=>va(l.id))}d!==null&&(d.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(d))})}function St(e,t,a=!1){let l=t.getAttribute("data-track-source-uid"),d=new YT.Player(e,{events:{onReady:g=>ka(g,e),onStateChange:g=>ga(g,e),onError:g=>Aa(g,e),onAutoplayBlocked:()=>i.embeddedEvent(s.AUTOPLAY_BLOCKED)},playerVars:{disablekb:1},...a&&{videoId:l}});return new Xe(t.id,e,d,l)}function Ue(e,t){m.log("onPlayerError()"),m.log(e);let a=e.getTrackType()===h.YOUTUBE?y.YOUTUBE:y.SOUNDCLOUD;i.players.isCurrent(e.getIframeId())===!1&&i.players.stop(),R.add(a,k.PLAYER_ERROR,e.getIframeId()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,ya(e,t))}function ya(e,t){let a=e.getArtist()||"N/A",l=e.getTitle()||"N/A";return{currentTrack:i.players.trackNumFromIframeId(e.getIframeId()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${l}`,mediaUrl:t}}function da(){m.log("initYouTubeAPI()"),u(s.PLAYBACK_LOADING,ge()),window.onYouTubeIframeAPIReady=function(){m.log("onYouTubeIframeAPIReady()"),u(s.PLAYBACK_LOADING,ge()),pa()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ka(e,t){let a=i.players.playerFromIframeId(t);e.target.getPlayerState()===-1?(m.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${a.getSourceUid()} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):m.log(`onYouTubePlayerReady(): ${t} => ${a.getSourceUid()} => ${a.getArtist()} - ${a.getTitle()}`),Lt()}function ga(e,t){switch(R.add(y.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:Ta(t);break;case YT.PlayerState.BUFFERING:Ea(t);break;case YT.PlayerState.PLAYING:fa(t);break;case YT.PlayerState.PAUSED:ma(t);break;case YT.PlayerState.CUED:ba(t);break;case YT.PlayerState.ENDED:Pa(t);break}}function Ta(e){m.log(`onYouTubePlayerStateChange: UNSTARTED (iframeId: ${e})`)}function Ea(e){if(m.log(`onYouTubePlayerStateChange: BUFFERING (iframeId: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromIframeId(e);t.mute(n.playback.masterMute),t.setVolume(n.playback.masterVolume),u(s.MEDIA_LOADING)}}function fa(e){m.log(`onYouTubePlayerStateChange: PLAYING   (iframeId: ${e})`),i.playbackState.sync(e,i.playbackState.STATE.PLAY),v.start()}function ma(e){m.log(`onYouTubePlayerStateChange: PAUSED    (iframeId: ${e})`),i.players.isCurrent(e)?(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),v.stop()):i.players.crossfade.stop()}function ba(e){m.log(`onYouTubePlayerStateChange: CUED      (iframeId: ${e})`)}function Pa(e){m.log(`onYouTubePlayerStateChange: ENDED     (iframeId: ${e})`),i.players.isCurrent(e)?(v.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Aa(e,t){let a=i.players.playerFromIframeId(t);m.log(`onYouTubePlayerError(${e.data!==null?e.data:"null"}) - iframeId: ${t} - isCued: ${a.isCued()} - isPlayable: ${a.isPlayable()}`),e.data!==null&&a.isCued()?(a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(a.setIsPlayable(!1),Ue(a,e.target.getVideoUrl()))}function Ca(){m.log("initSoundCloudAPI()"),u(s.PLAYBACK_LOADING,ge())}function Sa(e,t,a,l){m.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),l.getDuration(d=>{a.setDuration(Math.round(d/1e3)),t.setAttribute("data-track-duration",a.getDuration()),Lt()})}function ha(e){m.log(`onSoundCloudPlayerEvent: PLAY   (iframeId: ${e})`),R.add(y.SOUNDCLOUD,k.STATE_PLAYING,e),i.players.crossfade.isFading()&&i.players.isCurrent(e)?R.scPlayDoubleTrigger(e,ua.maxPlaybackStartDelay*1e3)&&i.playbackState.sync(e,i.playbackState.STATE.PLAY):(i.playbackState.sync(e,i.playbackState.STATE.PLAY),i.players.current.mute(n.playback.masterMute),i.players.current.setVolume(n.playback.masterVolume)),v.start()}function La(e){m.log(`onSoundCloudPlayerEvent: PAUSE  (iframeId: ${e})`),R.add(y.SOUNDCLOUD,k.STATE_PAUSED,e),R.scAutoplayBlocked(e,3e3)?(v.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):R.scWidgetPlayBlocked(e,3e4)?(v.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackNumFromIframeId(e),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),v.stop())}):i.players.crossfade.stop()}function Ia(e){m.log(`onSoundCloudPlayerEvent: FINISH (iframeId: ${e})`),i.players.isCurrent(e)?(v.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function va(e){let t=i.players.playerFromIframeId(e);m.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)}var D=b("gallery-events"),Ee={snackbarId:0,nowPlayingIcons:null},Ye={nowPlayingIconsSelector:"h2.track-artist-title"};function It(){D.log("init()"),Ee.nowPlayingIcons=document.querySelectorAll(Ye.nowPlayingIconsSelector),p(s.MEDIA_PLAYING,Na),p(s.MEDIA_PAUSED,Ua),p(s.MEDIA_ENDED,Ya),p(s.MEDIA_CUE_TRACK,Ra),p(s.CONTINUE_AUTOPLAY,Oa),p(s.RESUME_AUTOPLAY,Ma),p(s.AUTOPLAY_BLOCKED,_a),p(s.PLAYBACK_BLOCKED,Va),p(s.MEDIA_UNAVAILABLE,xa)}function Na(e){if(D.log(e),te(Ee.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Ye.nowPlayingIconsSelector}`);vt(t),V(t,"playing-paused","now-playing-icon"),n.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Ua(e){D.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Ye.nowPlayingIconsSelector}`).classList.add("playing-paused")}function Ya(e){D.log(e),e!==null&&e.data.numTracks>1&&vt()}function Ra(e){D.log(e),e.data.scrollToMedia&&Y(e.data.trackId)}function Oa(e){D.log(e),z()&&e.data.trackType===h.YOUTUBE?Q(L.NEXT,!0):w(C.nextPage,!0)}function Ma(e){let t=JSON.parse(sessionStorage.getItem($.UF_AUTOPLAY));if(sessionStorage.removeItem($.UF_AUTOPLAY),D.log(e),D.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id??null;a===null&&t.trackId!==null?E({message:"Unable to cue track (not found)",duration:5}):e.callback.resumeAutoplay(t,a)}else e.callback.resumeAutoplay()}function _a(e){D.log(e),Ee.snackbarId=E({message:"Autoplay blocked, Play to continue",duration:0,actionText:"play",actionClickCallback:()=>e.callback.play()})}function Va(e){D.log(e),E({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>Dt(e)})}function xa(e){D.log(e),E({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>Dt(e)})}function vt(e){Ee.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Dt(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):z()&&e.data.trackType===h.YOUTUBE?Q(L.NEXT,n.playback.autoplay):C.nextPage!==null&&w(C.nextPage,!0)}var Ut=b("gallery-controls"),fe={uiElements:null,players:{}},I={},B={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function Yt(e,t){Ut.log("init()"),fe.players=e,fe.uiElements=new Re("div.track-meta",!0),I.crossfadePreset=Se(B.crossfadePresetSelector),I.crossfadeTo=Se(B.crossfadeToSelector),I.crossfadePreset.length>1&&I.crossfadeTo.length>1&&(I.crossfadePreset.forEach(a=>Rt(a,n.gallery.trackCrossfadeDefPreset)),I.crossfadeTo.clickCallback=t),p(s.PLAYBACK_READY,Ba)}function Ba(){I.crossfadePreset.length>1&&I.crossfadeTo.length>1&&(I.crossfadePreset.forEach(e=>{e.addEventListener("click",$a),V(e,T.DISABLED.CLASS,T.ENABLED.CLASS)}),I.crossfadeTo.forEach(e=>e.addEventListener("click",Ka)),p(s.MEDIA_PLAYING,Nt),p(s.MEDIA_PAUSED,Nt))}var Re=class extends j{elementClicked(){if(this.clicked("div.track-share-control"))return ie(this.closest("single-track, gallery-track"));if(this.clicked("div.track-details-control"))return ce(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return Ce(this.event);if(this.clicked("span.track-channels-links"))return Ce(this.event)}};function Rt(e,t){e.setAttribute(B.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${ee.crossfade[t].name}`}function $a(e){let t=parseInt(e.target.getAttribute(B.crossfadePresetData));Rt(e.target,t+1<ee.crossfade.length?t+1:0)}function Ka(e){if(f()&&fe.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),l=parseInt(t.querySelector(B.crossfadePresetSelector).getAttribute(B.crossfadePresetData));V(t.querySelector(`div${B.crossfadeToSelector}`),T.ENABLED.CLASS,T.DISABLED.CLASS),I.crossfadeTo.clickCallback(a.id,ee.crossfade[l])}}}function Nt(){let e=f(),t=e?fe.players.getTrackData().currentTrack:-1;Ut.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),I.crossfadeTo.forEach((a,l)=>{t===l+1?V(a,e?T.ENABLED.CLASS:T.DISABLED.CLASS,e?T.DISABLED.CLASS:T.ENABLED.CLASS):V(a,e?T.DISABLED.CLASS:T.ENABLED.CLASS,e?T.ENABLED.CLASS:T.DISABLED.CLASS)})}var Ot=b("gallery-players"),Mt=()=>{let e=null,t=[],a=new Map,l=0;return{indexMap:a,get crossfade(){return e},get current(){return t[l]},get next(){return t[l+1]},setPlayerIndex(P){l=P},getTrackType(){return this.current.getTrackType()},getNumTracks(){return t.length},getCurrentTrackNum(){return l+1},playerFromIframeId(P){return t[a.get(P)]},trackNumFromIframeId(P){return a.get(P)+1},isCurrent(P){return P===this.current.getIframeId()},init:d,add:g,stop:aa,mute:ra,getTrackData:sa,prevTrack:la,nextTrack:na,gotoTrackNum:oa};function d(){Ot.log("init()"),e=He(this),p(s.MEDIA_PLAYING,()=>e.start()),p(s.MEDIA_PAUSED,()=>e.stop())}function g(P){Ot.log(P),t.push(P),a.set(P.getIframeId(),t.length-1)}function aa(){this.current.stop(),e.stop()}function ra(){this.current.mute(n.playback.masterMute),e.mute(n.playback.masterMute)}function sa(P=0){return{currentTrack:this.getCurrentTrackNum(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),position:P,duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function la(){return l>0?(l--,!0):!1}function na(){return l++,l<this.getNumTracks()}function oa(P){return P>0&&P<=this.getNumTracks()?(l=P-1,!0):!1}};var A=b("gallery-playback"),r={eventLog:null,players:{}},_t={minCrossfadeToTime:5,maxBufferingDelay:3};function Wa(){A.log("init()"),r.eventLog=R,It(),r.players=Mt(),r.players.init(),se(e=>r.players.getTrackData(e),Ha),Yt(r.players,Za),v.init(r.players,$t),ht(r.players,tr,er)}function H(){rt(),r.players.current.play(Ue)}function Vt(){K(),r.players.current.pause()}function xt(){f()?Vt():H()}function wt(){A.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrackNum()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrackNum()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),N(0,0,r.players.current.getDuration())):(r.players.getCurrentTrackNum()>1&&r.players.stop(),r.players.prevTrack()?q(f()):u(s.MEDIA_PREV_TRACK))})}function Oe(e=!1){let t=r.players.getCurrentTrackNum()+1>r.players.getNumTracks();A.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${n.playback.autoplay}`),!qa(e,t)&&(t===!1?(r.players.stop(),e&&n.playback.autoplay===!1?K():r.players.nextTrack()&&q(f())):t===!0&&e===!1?u(s.MEDIA_NEXT_TRACK):e&&(K(),n.playback.autoplay?u(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function qa(e,t){if(e&&n.playback.autoplay){let a=oe();if(A.log(`repeatPlayback(): ${A.getKeyForValue(U,a)}`),a===U.ONE)return r.players.current.seekTo(0),H(),!0;if(t&&a===U.ALL)return r.players.stop(),r.players.setPlayerIndex(0),q(!0),!0}return!1}function Ha(e){r.players.current.seekTo(e)}function Xa(){r.players.current.setVolume(n.playback.masterVolume)}function Bt(){n.playback.masterMute=n.playback.masterMute!==!0,r.players.mute()}function Ja(e,t,a=!0){A.log(`cueOrPlayTrackById() - iframeId: ${e} - autoplay: ${t.autoplay} - position: ${t.position}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),u(s.MEDIA_CUE_TRACK,{scrollToMedia:a,trackId:r.players.current.getTrackId()}),t.autoplay?r.players.current.playTrackById(t.position):(r.players.current.cueTrackById(t.position),t.position!==0&&N(t.position*1e3,t.position,r.players.current.getDuration())),O(t.position)}function q(e,t=!0){u(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&H(),O()}function ja(e,t=!0){A.log(`skipToTrack() - trackNum: ${e} - playMedia: ${t}`),t===!0&&f()===!1&&(r.eventLog.add(y.ULTRAFUNK,k.RESUME_AUTOPLAY),r.players.gotoTrackNum(e)&&q(t))}function za(e=null,t=null){e!==null&&t!==null?Ja(t,e):e!==null&&e.autoplay?(A.log("resumeAutoplay(): Play first track"),r.eventLog.add(y.ULTRAFUNK,k.RESUME_AUTOPLAY),H()):(A.log("resumeAutoplay(): Cue first track"),O())}function Qa(e,t,a=!1){A.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setSourceUid(t.uid),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),at(0),O(),a?r.players.current.playTrackById():r.players.current.cueTrackById()}function me(e=!1){let t={isPlaying:f(),currentTrack:r.players.getCurrentTrackNum(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),elementId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()};return e&&r.players.current.getPosition(a=>(t.position=Math.round(a/1e3),t)),t}function Za(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(A.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getIframeId()})
      fadeIn.: ${r.players.playerFromIframeId(e).getArtist()} - "${r.players.playerFromIframeId(e).getTitle()}" (${e})`),n.playback.masterMute===!1&&n.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=_t.minCrossfadeToTime+_t.maxBufferingDelay&&$t(ae.TRACK,t,e)}))}function $t(e,t,a=null){r.eventLog.add(y.ULTRAFUNK,k.CROSSFADE_START),r.players.crossfade.init(e,t,a)&&(a===null?r.players.nextTrack()&&q(!0):r.players.gotoTrackNum(r.players.trackNumFromIframeId(a))&&q(!0,!1))}function er(e,t=null){switch(A.log(`embeddedEventHandler() - event: ${A.getKeyForValue(s,e)}`),t!==null&&A.log(t),e){case s.MEDIA_ENDED:u(s.MEDIA_ENDED,me()),Oe(!0);break;case s.PLAYBACK_READY:le(wt,xt,Oe,Bt),At(Qa),u(s.PLAYBACK_READY,t),u(s.RESUME_AUTOPLAY,null,{resumeAutoplay:za});break;case s.AUTOPLAY_BLOCKED:u(s.AUTOPLAY_BLOCKED,null,{play:H});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:u(e,t,{skipToTrack:ja});break}}var tr=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(l,d){A.log(`playbackState.sync() - previousTrack: ${r.players.getCurrentTrackNum()} - nextTrack: ${r.players.indexMap.get(l)+1} - syncState: ${A.getKeyForValue(e,d)}`),r.players.isCurrent(l)?d===e.PLAY?u(s.MEDIA_PLAYING,me()):d===e.PAUSE&&u(s.MEDIA_PAUSED,me()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(l)),O(),a(l,d))}}})();var $e={};Ge($e,{getStatus:()=>ir,init:()=>rr,nextTrack:()=>qt,pause:()=>Gt,play:()=>Ft,prevTrack:()=>Wt,setVolume:()=>lr,toggleMute:()=>xe,togglePlayPause:()=>Be});var _e=class extends W{#e=null;#t(t,a){if(t!==void 0){let l=Math.round(t);N(t*1e3,l,a),l>0&&a>0&&super.updateOncePerSecond(l,a)}}ready(t){super.init(),this.#e=t,p(s.MEDIA_PLAYING,()=>super.start())}updateTimer(){this.isVisible&&f()&&this.#t(this.#e.embedded.getCurrentTime(),this.#e.getDuration())}updateVolumeMute(){pe(this.#e.embedded.getVolume(),this.#e.embedded.isMuted())}},Ve=new _e;var S=b("list-playback"),o={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},we=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function rr(){S.log("init()"),lt(M),Ct(M),sr()!==null?cr():E({message:"No playable YouTube tracks!",duration:0,actionText:"help",actionClickCallback:()=>re({modalTitle:"No playable tracks",modalBody:we})})}function sr(){if(o.currentTrackId=F(),o.autoplayData=JSON.parse(sessionStorage.getItem($.UF_AUTOPLAY)),sessionStorage.removeItem($.UF_AUTOPLAY),o.currentTrackId!==null){if(o.autoplayData!==null&&o.autoplayData.trackId!==null){let e=ue(`[data-track-id="${o.autoplayData.trackId}"]`);e!==null?Le(e)===h.YOUTUBE?o.currentTrackId=e.id:E({message:"Cannot play SoundCloud track",duration:5,actionText:"help",actionClickCallback:()=>re({modalTitle:"Cannot play SoundCloud track",modalBody:we})}):E({message:"Unable to cue track (not found)",duration:5})}ct(o.currentTrackId)}return S.log(`cueInitialTrack() - currentTrackId: ${o.currentTrackId} - autoplayData: ${o.autoplayData!==null?JSON.stringify(o.autoplayData):"N/A"}`),o.currentTrackId}function M(e,t=!0,a=!1){let l=Le(he(e));if(S.log(`setCurrentTrack() - nextTrackType: ${S.getKeyForValue(h,l)} - nextTrackId: ${e} - playTrack: ${t} - isPointerClick: ${a}`),l===h.SOUNDCLOUD&&a){E({message:"Cannot play SoundCloud track",duration:5,actionText:"help",actionClickCallback:()=>re({modalTitle:"Cannot play SoundCloud track",modalBody:we})});return}e===o.currentTrackId?Be():(f()&&o.player.embedded.stopVideo(),o.currentTrackId=e,u(s.MEDIA_CUE_TRACK,{trackId:e,isPointerClick:a}),Kt(t))}function Kt(e,t=0){let a=yt();S.log(`cueOrPlayCurrentTrack(): trackId: ${o.currentTrackId} (${a}) - playTrack: ${e} - position: ${t}`),o.player.resetState(),e?(o.player.playTrackById(a,t),x(T.PLAYING)):(o.player.cueTrackById(a,t),x(T.PAUSED),t!==0&&N(t*1e3,t,o.player.getDuration())),O(t)}function Ft(){o.player.play(be)}function Gt(){o.player.embedded.pauseVideo()}function Be(){o.currentTrackId===null?M(ue("div.track-entry.current").id):f()?Gt():Ft()}function lr(){o.player.setVolume(n.playback.masterVolume)}function xe(e=!0){e&&(n.playback.masterMute=n.playback.masterMute!==!0),n.playback.masterMute?o.player.embedded.mute():o.player.embedded.unMute()}function Wt(){let e=it(),t=o.player.embedded.getCurrentTime();e!==null&&t<=5?M(e,f()):t!==0&&(o.player.seekTo(0),N(0,0,o.player.getDuration()))}function qt(){let e=F();e!==null&&M(e,f())}async function Ht(e=!1,t=!1){let a=t?U.OFF:oe(),l=F();if(S.log(`advanceToNextTrack() - autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${l} - repeatMode: ${S.getKeyForValue(U,a)}`),e&&a===U.ONE)o.player.seekTo(0),o.player.play(be);else if(e&&l===null&&a===U.ALL)M(F(null)),Y(0);else if(l===null)if(n.list.showLoadMoreTracks){let d=await ut();e&&d&&M(F())}else w(C.nextPage,e);else e?M(l):x(T.PAUSED)}function nr(){f()===!1&&Ht(!0,!0)}function or(){o.currentTrackId=null,x(T.PAUSED)}function ir(e=!1){let t=null;if(o.currentTrackId!==null?t=he(o.currentTrackId):t=ue("div.track-entry.current"),t!==null){let a=0;if(e){let l=ot("div.track-entry");a=Array.prototype.indexOf.call(l,t),S.log(`getStatus() - currentTrackNum: ${a+1} - trackId: ${t.getAttribute("data-track-id")}`)}return{isPlaying:f(),currentTrack:a+1,trackType:h.YOUTUBE,position:Math.ceil(o.player.embedded.getCurrentTime()),numTracks:1,trackId:t.getAttribute("data-track-id"),elementId:t.id,iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function cr(){S.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){S.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:ur,onStateChange:pr,onError:be,onAutoplayBlocked:dr},playerVars:{disablekb:1}});o.player=new je(a),S.log(o.player),se(l=>o.player.getTrackData(l),l=>o.player.seekTo(l)),u(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ur(){S.log("onYouTubePlayerReady()"),le(Wt,Be,qt,xe),u(s.PLAYBACK_LOADING,{loadingPercent:66}),Ve.ready(o.player),nt(o.player),xe(!1),o.player.setVolume(n.playback.masterVolume),u(s.PLAYBACK_READY,{resetProgressBar:!1}),Kt(o.autoplayData?.autoplay===!0,o.autoplayData?.position??0)}function pr(e){switch(S.log(`onYouTubePlayerStateChange: ${S.getKeyForValue(YT.PlayerState,e.data)} (trackId: ${o.currentTrackId})`),e.data!==YT.PlayerState.PLAYING&&K(),e.data){case YT.PlayerState.UNSTARTED:o.playerReady===!1&&(o.playerReady=!0,(o.autoplayData?.position??0)===0&&u(s.PLAYBACK_LOADING,{loadingPercent:0}),o.autoplayData=null);break;case YT.PlayerState.BUFFERING:u(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:yr(),u(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:x(T.PAUSED);break;case YT.PlayerState.ENDED:Ve.stop(),u(s.MEDIA_ENDED),Ht(n.playback.autoplay);break}}function yr(){te(o.currentSnackbarId),o.firstStatePlaying&&(o.firstStatePlaying=!1,setTimeout(()=>{n.playback.autoplay&&f()&&Math.round(window.scrollY)<=1&&Qe(ze.SITE_MAX_WIDTH_MOBILE)&&Y(0)},6e3))}function dr(){x(T.PAUSED),o.currentSnackbarId=E({message:"Autoplay blocked, Play to continue",duration:0,actionText:"play",actionClickCallback:()=>o.player.play(be)})}function be(e){S.log(`onYouTubePlayerError(${e.data}) - trackId: ${o.currentTrackId} - isCued: ${o.player.isCued()}`),o.player.setPlayerError(e.data),o.player.isCued()===!1&&(pt("Error!"),E({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",actionClickCallback:or,afterCloseCallback:nr}))}var Ae=b("screen-wakelock"),Pe={wakeLock:null};function Xt(){n.mobile.keepScreenOn&&document.addEventListener("click",Jt)}function Jt(){Ae.log("enableScreenWakeLock()"),document.removeEventListener("click",Jt),gr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&n.mobile.keepScreenOn&&kr()})}function kr(){jt()&&Pe.wakeLock===null&&zt()}function jt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function gr(){jt()?document.visibilityState==="visible"&&await zt()!==!0&&(Ae.log("enableWakeLock(): Screen Wake Lock request failed"),E({message:"Keep Screen On failed",duration:5,actionText:"Disable",actionClickCallback:()=>n.mobile.keepScreenOn=!1})):(Ae.log("enableWakeLock(): Screen Wake Lock is not supported"),E({message:"Keep Screen On is not supported",duration:5,actionText:"Disable",actionClickCallback:()=>n.mobile.keepScreenOn=!1}))}async function zt(){try{return Pe.wakeLock=await navigator.wakeLock.request("screen"),Pe.wakeLock.addEventListener("release",()=>{Pe.wakeLock=null}),!0}catch(e){Ae.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var X=b("playback-interaction"),Qt=new de(10),c={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null,broadcastChannel:null};document.addEventListener("DOMContentLoaded",()=>{We(),X.log("DOMContentLoaded"),qe(),dt()?c.player=Me:kt()&&(c.player=$e),c.player!==null&&Tr(),bt(c.player?.getStatus)});function Tr(){X.log("initCommon()"),tt(),Er(),c.player.init(),c.siteNavUiElements=new Ke("#site-navigation"),c.trackNavUiElements=new Fe("nav.single-track-nav .nav-links"),G.init(),c.keyboardShortcuts=Ze(n.playback.keyboardShortcuts),c.broadcastChannel=new BroadcastChannel("playbackStatus"),fr(),Xt()}function Er(){p(s.PLAYBACK_READY,Cr),p(s.MEDIA_PLAYING,()=>c.broadcastChannel.postMessage(s.MEDIA_PLAYING)),p(s.MEDIA_CUE_TRACK,ea),p(s.MEDIA_ENDED,ea),p(s.MEDIA_TIME_REMAINING,Sr),p(s.MEDIA_PREV_TRACK,()=>_(null,L.PREV,C.prevPage)),p(s.MEDIA_NEXT_TRACK,()=>_(null,L.NEXT,C.nextPage))}function fr(){J(".playback-shuffle-control span","click",Tt),document.addEventListener("keydown",mr),document.addEventListener("keydown",br),window.focus(),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&window.focus()},250)}),c.broadcastChannel.addEventListener("message",e=>{X.log(`broadcastChannel('playbackStatus') message: ${e.data}`),e.data===s.MEDIA_PLAYING&&n.playback.pauseOnPlayerChange&&c.player.pause()})}function mr(e){if(c.isPlaybackReady&&c.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":Zt(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&Zt(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),Y(c.player.getStatus().elementId);break}switch(e.key){case" ":e.preventDefault(),c.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":Et(e);break;case"ArrowLeft":Pr(e);break;case"ArrowRight":Ar(e);break;case"A":ve.toggle();break;case"f":case"F":e.preventDefault(),G.toggle(document.getElementById(c.player.getStatus().iframeId));break;case"i":e.preventDefault(),ce(document.getElementById(c.player.getStatus().elementId));break;case"I":e.preventDefault(),ie(document.getElementById(c.player.getStatus().elementId));break;case"m":case"M":e.preventDefault(),c.player.toggleMute(),E({message:n.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",duration:3});break;case"p":case"P":ft.toggle();break;case"r":case"R":E({message:`${st().title} (<b>r</b> to change)`,duration:3});break;case"x":case"X":mt.toggle();break}}}}function br(e){if(c.isPlaybackReady&&c.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":et===!1&&(X.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),c.player.togglePlayPause());break;case"MediaTrackPrevious":X.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),c.player.prevTrack();break;case"MediaTrackNext":X.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),c.player.nextTrack();break}}function Pr(e){e.preventDefault(),e.shiftKey===!0?_(null,L.PREV,C.prevPage):c.player.prevTrack()}function Ar(e){e.preventDefault(),e.shiftKey===!0?_(null,L.NEXT,C.nextPage):c.player.nextTrack()}function _(e,t,a){e?.preventDefault(),z()&&c.player.getStatus().trackType===h.YOUTUBE?Pt()===!1?Q(t,c.player.getStatus().isPlaying):E({message:"Loading track, please wait...",duration:3}):ta(null,a)}function Zt(e){e.preventDefault(),n.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?n.playback.masterVolume<100?n.playback.masterVolume+5:100:n.playback.masterVolume>5?n.playback.masterVolume-5:5,c.player.setVolume()}function Cr(){J(".playback-details-control","click",hr),J(".playback-thumbnail-control","click",Lr),J(".playback-timer-control","click",Ir),c.isPlaybackReady=!0}function ea(){let e=Ie()&&c.player.getStatus().numTracks>1;(n.playback.autoExitFullscreen||e)&&G.exit()}function Sr(e){let t=e.data.timeRemainingSeconds<=n.playback.timeRemainingSeconds;n.playback.autoExitFsOnWarning&&t&&G.exit()}function hr(){Y(c.player.getStatus().elementId)}function Lr(){Ie()?(Qt.add(y.MOUSE,k.MOUSE_CLICK),Qt.doubleClicked(y.MOUSE,k.MOUSE_CLICK,500)&&G.enter(document.getElementById(c.player.getStatus().iframeId))):gt()&&Y(0)}function Ir(){ve.toggle()}var Ke=class extends j{elementClicked(){if(this.clicked("a.navbar-prev-link"))return _(this.event,L.PREV,C.prevPage);if(this.clicked("a.navbar-next-link"))return _(this.event,L.NEXT,C.nextPage)}},Fe=class extends j{elementClicked(){if(this.clicked("div.nav-previous a"))return _(this.event,L.PREV,C.prevPage);if(this.clicked("div.nav-next a"))return _(this.event,L.NEXT,C.nextPage)}};function ta(e,t){e?.preventDefault(),w(t,c.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
