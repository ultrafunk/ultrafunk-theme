import{$ as He,Aa as z,Ba as ot,Ca as F,Da as it,E as w,Ea as G,Fa as ct,Ga as ut,Ha as ve,Ia as dt,J as Se,Ja as L,Ka as Z,L as Ge,La as pt,Ma as yt,Na as ee,O as C,P as Ce,Q as We,R as qe,V as Xe,W as s,X as p,Y as g,Z as P,_ as Le,a as Xt,aa as Qe,ba as Je,c as f,ca as je,d as Ke,da as J,ea as $,fa as D,ga as ze,ha as ne,ia as le,j as se,ja as Ze,k as Pe,ka as et,la as j,qa as oe,ra as ie,s as A,sa as tt,t as l,ta as at,u as $e,ua as rt,va as st,w as S,x as Fe,xa as Ne,ya as nt,z as Q,za as lt}from"../chunk-EVXWXOWH.js";var te=f("eventlogger"),d={UNKNOWN:-1e4,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},y={UNKNOWN:-1e4,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},Ht={eventSource:d.UNKNOWN,eventType:y.UNKNOWN,uId:null,timestamp:0},ce=class{#e=[];#t=0;#r=0;#a=0;constructor(t=10){this.#t=t}add(t,a,n=null,i=Date.now()){let u=Object.create(Ht);u.eventSource=t,u.eventType=a,u.uId=n,u.timestamp=i,this.#e.length<this.#t?this.#e.push(u):(this.#e.shift(),this.#e.push(u))}clear(){this.#e=[]}getLastPos(){return this.#a}initMatch(){this.#a=this.#e.length-1,this.#r=0}matchesEvent(t,a,n,i=null){this.#e[this.#a-t].eventSource===a&&this.#e[this.#a-t].eventType===n&&this.#e[this.#a-t].uId===i&&this.#r++}matchesDelta(t,a){this.#e[this.#a].timestamp-this.#e[this.#a-t].timestamp<=a&&this.#r++}isPatternMatch(t,a){return this.#r===t?(te.log(`MATCH for: ${a}`),this.logEventMatch(),!0):!1}logEventMatch(){let t=[];for(let a=0;a<this.#e.length;a++){let n={eventSource:te.getKeyForValue(d,this.#e[a].eventSource),eventType:te.getKeyForValue(y,this.#e[a].eventType),uId:this.#e[a].uId,timestamp:this.#e[a].timestamp};t.push(n)}te.log(t)}},ue=class extends ce{doubleClicked(t,a,n){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,n)),this.isPatternMatch(3,`${te.getKeyForValue(d,t)} Double Clicked`)}},de=class extends ce{scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,d.ULTRAFUNK,y.RESUME_AUTOPLAY,null),this.matchesEvent(2,d.SOUNDCLOUD,y.STATE_PLAYING,t),this.matchesEvent(1,d.SOUNDCLOUD,y.STATE_PAUSED,t),this.matchesEvent(0,d.SOUNDCLOUD,y.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,d.SOUNDCLOUD,y.STATE_PLAYING,t),this.matchesEvent(1,d.SOUNDCLOUD,y.STATE_PAUSED,t),this.matchesEvent(0,d.SOUNDCLOUD,y.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,d.ULTRAFUNK,y.CROSSFADE_START,null),this.matchesEvent(1,d.SOUNDCLOUD,y.STATE_PLAYING,t),this.matchesEvent(0,d.SOUNDCLOUD,y.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var Ye={};Xt(Ye,{getStatus:()=>ke,init:()=>Da,nextTrack:()=>_e,pause:()=>Nt,play:()=>X,prevTrack:()=>It,setVolume:()=>Va,toggleMute:()=>Dt,togglePlayPause:()=>vt});var W=f("crossfade"),_={MIN:0,MAX:100},O={NONE:0,AUTO:1,TRACK:2};var De={NONE:0,EQUAL_POWER:1,LINEAR:2},U={NONE:0,INIT:1,FADING:2},ae=-1,gt={intervalEqPow:33,intervalLinear:100},Et=e=>{let t=e,a=U.NONE,n=ae,i=null,u=null,R=0,T=0,re=O.NONE,B=null,K=0;return{isFading(){return a!==U.NONE},init:Bt,start:Kt,stop:he,mute:$t};function Bt(b,k,h=null){return a===U.NONE&&Ft(h)===!0?(W.log(`init() - type: ${W.getKeyForValue(O,b)} - fadeInUid: ${h} - preset: ${k.length} sec ${W.getKeyForValue(De,k.curve)} (Name: ${k.name})`),a=U.INIT,T=l.playback.masterVolume,re=b,B=k,u.setVolume(0),!0):!1}function Kt(){a===U.INIT&&(a=U.FADING,i.getPosition(b=>{let k=B.curve===De.EQUAL_POWER?gt.intervalEqPow:gt.intervalLinear;K=(b+k)/1e3;let h=i.getDuration()-K,M=h-k/100;re===O.AUTO?R=M:re===O.TRACK&&(R=h>B.length?B.length:M),W.log(`start() - fadeStartTime: ${K.toFixed(2)} sec - timeRemaining: ${h.toFixed(2)} sec - fadeLength: ${R.toFixed(2)} sec - updateInterval: ${k} ms`),n=setInterval(B.curve===De.EQUAL_POWER?Gt:Wt,k)}))}function he(){W.log(`stop() - fadeState: ${W.getKeyForValue(U,a)}`),a!==U.NONE&&(n!==ae&&(clearInterval(n),n=ae),i!==null&&(i.pause(),i.seekTo(0),setTimeout(()=>{i.setVolume(l.playback.masterVolume),i=null},250)),u!==null&&(u.setVolume(T),u=null),a=U.NONE,R=0,T=0,re=O.NONE,B=null,K=0)}function $t(b){i!==null&&i.mute(b)}function Ft(b){return i=t.current,u=b===null?t.next:t.playerFromIframeId(b),!!(i.isPlayable()&&u.isPlayable())}function Gt(){i.getPosition(b=>{if(n===ae)return;let k=b/1e3-K,h=k>=0?k:0,M=T-T*(h/R),Ae=M>=_.MIN?M:_.MIN,qt=Math.round(Math.sqrt(T*Ae)),Be=Math.round(Math.sqrt(T*(T-Ae)));h>=R&&Ae<=_.MIN&&Be>=T?(i.setVolume(_.MIN),u.setVolume(T),he()):(i.setVolume(qt),u.setVolume(Be))})}function Wt(){i.getPosition(b=>{if(n===ae)return;let k=b/1e3-K,h=Math.round(T*(k/R)),M=T-h;k>R&&M<_.MIN&&h>T?(i.setVolume(_.MIN),u.setVolume(T),he()):(i.setVolume(M),u.setVolume(h))})}};var Ue=class extends tt{#e=null;#t=null;#r(t,a=0){let n=Math.round(t/1e3);J(t,n,a),n>0&&a>0&&(super.updateOncePerSecond(n,a),this.#s(n,a))}#a(){return l.playback.autoplay&&l.gallery.autoCrossfade}#s(t,a){l.playback.masterMute===!1&&this.#a()&&a-t===l.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrackNum()+1<=this.#e.getNumTracks()&&this.#t(O.AUTO,{name:"Auto Crossfade",length:l.gallery.autoCrossfadeLength,curve:l.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>ot(Math.round(t),this.#e.current.isMuted()))}},v=new Ue;var Qt=f("gallery-players"),pe=class extends Ce{constructor(t,a,n,i){super(C.YOUTUBE,t,a,n),this.setThumbnail(We(i)),this.setSourceUid(i)}pause(){this.embedded.pauseVideo()}stop(){this.embedded.stopVideo()}cueTrackById(t=0){this.embedded.cueVideoById(this.getSourceUid(),t),this.setIsCued(!0)}playTrackById(t=0){this.embedded.loadVideoById(this.getSourceUid(),t)}play(t){this.isPlayable()?this.embedded.playVideo():t(this,this.embedded.getVideoUrl())}getVolume(t){t(this.embedded.getVolume())}mute(t){t?this.embedded.mute():this.embedded.unMute()}isMuted(){return this.embedded.isMuted()}getPosition(t){t(this.embedded.getCurrentTime()*1e3,this.duration)}},ye=class extends Ce{#e=_.MAX;#t=!1;constructor(t,a,n){super(C.SOUNDCLOUD,t,a,n)}setThumbnail(t){this.embedded.getCurrentSound(a=>{super.setThumbnail(qe(a)),t?.setAttribute("data-track-thumbnail-url",this.getThumbnailSrc())})}pause(){this.embedded.pause()}play(t){this.isPlayable()?this.embedded.getCurrentSound(a=>{a.playable===!0?this.embedded.play():t(this,a.permalink_url)}):t(this,"https://soundcloud.com")}stop(){this.pause(),super.seekTo(0)}seekTo(t){super.seekTo(t*1e3)}getVolume(t){this.#t===!1&&this.embedded.getVolume(a=>t(a))}setVolume(t){t!==0&&(this.#e=t),(this.#t===!1||t===0)&&super.setVolume(t)}mute(t){this.#t=!!t,t?this.setVolume(0):this.setVolume(this.#e)}isMuted(){return this.#t}getPosition(t){this.embedded.getPosition(a=>t(a,this.duration))}},ge=class{indexMap=new Map;crossfade=null;#e=[];#t=0;constructor(){this.crossfade=Et(this),p(s.MEDIA_PLAYING,()=>this.crossfade.start()),p(s.MEDIA_PAUSED,()=>this.crossfade.stop())}get current(){return this.#e[this.#t]}get next(){return this.#e[this.#t+1]}setPlayerIndex(t){this.#t=t}getTrackType(){return this.current.getTrackType()}getNumTracks(){return this.#e.length}getCurrentTrackNum(){return this.#t+1}playerFromIframeId(t){return this.#e[this.indexMap.get(t)]}trackNumFromIframeId(t){return this.indexMap.get(t)+1}isCurrent(t){return t===this.current.getIframeId()}add(t){Qt.log(t),this.#e.push(t),this.indexMap.set(t.getIframeId(),this.#e.length-1)}stop(){this.current.stop(),this.crossfade.stop()}mute(){this.current.mute(l.playback.masterMute),this.crossfade.mute(l.playback.masterMute)}getTrackData(t=0){return{currentTrack:this.getCurrentTrackNum(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),position:t,duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}prevTrack(){return this.#t>0?(this.#t--,!0):!1}nextTrack(){return this.#t++,this.#t<this.getNumTracks()}gotoTrackNum(t){return t>0&&t<=this.getNumTracks()?(this.#t=t-1,!0):!1}};var E=f("embedded-players"),V=new de(10),o={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},Jt={maxPlaybackStartDelay:3};function mt(e,t,a){o.players=e,o.playbackState=t,o.embeddedEvent=a,o.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),Zt(),ca()}function Ee(){return{loadingPercent:100*(o.loadEventsCount++/o.loadEventsTotal)}}function kt(){o.loadEventsCount>=o.loadEventsTotal?o.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):g(s.PLAYBACK_LOADING,Ee())}function jt(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),n=t.querySelector("iframe"),i=null;if(a===C.YOUTUBE)e.length===1&&n===null?i=ft("youtube-player",t,!0):i=ft(n.id,t,!1),i.setDuration(parseInt(t.getAttribute("data-track-duration")));else if(a===C.SOUNDCLOUD){let u=SC.Widget(n.id);i=new ye(t.id,n.id,u),u.bind(SC.Widget.Events.READY,()=>ua(n.id,t,i,u)),u.bind(SC.Widget.Events.PLAY,()=>da(n.id)),u.bind(SC.Widget.Events.PAUSE,()=>pa(n.id)),u.bind(SC.Widget.Events.FINISH,()=>ya(n.id)),u.bind(SC.Widget.Events.ERROR,()=>ga(n.id))}i!==null&&(i.setArtistAndTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),o.players.add(i))})}function ft(e,t,a=!1){let n=t.getAttribute("data-track-source-uid"),i=new YT.Player(e,{events:{onReady:u=>ea(u,e),onStateChange:u=>ta(u,e),onError:u=>ia(u,e),onAutoplayBlocked:()=>o.embeddedEvent(s.AUTOPLAY_BLOCKED)},playerVars:{disablekb:1},...a&&{videoId:n}});return new pe(t.id,e,i,n)}function Ve(e,t){E.log("onPlayerError()"),E.log(e);let a=e.getTrackType()===C.YOUTUBE?d.YOUTUBE:d.SOUNDCLOUD;o.players.isCurrent(e.getIframeId())===!1&&o.players.stop(),V.add(a,y.PLAYER_ERROR,e.getIframeId()),o.embeddedEvent(s.MEDIA_UNAVAILABLE,zt(e,t))}function zt(e,t){let a=e.getArtist()||"N/A",n=e.getTitle()||"N/A";return{currentTrack:o.players.trackNumFromIframeId(e.getIframeId()),numTracks:o.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${n}`,mediaUrl:t}}function Zt(){E.log("initYouTubeAPI()"),g(s.PLAYBACK_LOADING,Ee()),window.onYouTubeIframeAPIReady=function(){E.log("onYouTubeIframeAPIReady()"),g(s.PLAYBACK_LOADING,Ee()),jt()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function ea(e,t){let a=o.players.playerFromIframeId(t);e.target.getPlayerState()===-1?(E.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${a.getSourceUid()} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):E.log(`onYouTubePlayerReady(): ${t} => ${a.getSourceUid()} => ${a.getArtist()} - ${a.getTitle()}`),kt()}function ta(e,t){switch(V.add(d.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:aa(t);break;case YT.PlayerState.BUFFERING:ra(t);break;case YT.PlayerState.PLAYING:sa(t);break;case YT.PlayerState.PAUSED:na(t);break;case YT.PlayerState.CUED:la(t);break;case YT.PlayerState.ENDED:oa(t);break}}function aa(e){E.log(`onYouTubePlayerStateChange: UNSTARTED (iframeId: ${e})`)}function ra(e){if(E.log(`onYouTubePlayerStateChange: BUFFERING (iframeId: ${e})`),o.players.crossfade.isFading()===!1){let t=o.players.playerFromIframeId(e);t.mute(l.playback.masterMute),t.setVolume(l.playback.masterVolume),g(s.MEDIA_LOADING)}}function sa(e){E.log(`onYouTubePlayerStateChange: PLAYING   (iframeId: ${e})`),o.playbackState.sync(e,o.playbackState.STATE.PLAY),v.start()}function na(e){E.log(`onYouTubePlayerStateChange: PAUSED    (iframeId: ${e})`),o.players.isCurrent(e)?(o.playbackState.sync(e,o.playbackState.STATE.PAUSE),v.stop()):o.players.crossfade.stop()}function la(e){E.log(`onYouTubePlayerStateChange: CUED      (iframeId: ${e})`)}function oa(e){E.log(`onYouTubePlayerStateChange: ENDED     (iframeId: ${e})`),o.players.isCurrent(e)?(v.stop(),o.embeddedEvent(s.MEDIA_ENDED)):o.players.crossfade.stop()}function ia(e,t){let a=o.players.playerFromIframeId(t);E.log(`onYouTubePlayerError(${e.data!==null?e.data:"null"}) - iframeId: ${t} - isCued: ${a.isCued()} - isPlayable: ${a.isPlayable()}`),e.data!==null&&a.isCued()?(a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(a.setIsPlayable(!1),Ve(a,e.target.getVideoUrl()))}function ca(){E.log("initSoundCloudAPI()"),g(s.PLAYBACK_LOADING,Ee())}function ua(e,t,a,n){E.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),n.getDuration(i=>{a.setDuration(Math.round(i/1e3)),t.setAttribute("data-track-duration",a.getDuration()),kt()})}function da(e){E.log(`onSoundCloudPlayerEvent: PLAY   (iframeId: ${e})`),V.add(d.SOUNDCLOUD,y.STATE_PLAYING,e),o.players.crossfade.isFading()&&o.players.isCurrent(e)?V.scPlayDoubleTrigger(e,Jt.maxPlaybackStartDelay*1e3)&&o.playbackState.sync(e,o.playbackState.STATE.PLAY):(o.playbackState.sync(e,o.playbackState.STATE.PLAY),o.players.current.mute(l.playback.masterMute),o.players.current.setVolume(l.playback.masterVolume)),v.start()}function pa(e){E.log(`onSoundCloudPlayerEvent: PAUSE  (iframeId: ${e})`),V.add(d.SOUNDCLOUD,y.STATE_PAUSED,e),V.scAutoplayBlocked(e,3e3)?(v.stop(),o.embeddedEvent(s.AUTOPLAY_BLOCKED)):V.scWidgetPlayBlocked(e,3e4)?(v.stop(),o.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:o.players.trackNumFromIframeId(e),numTracks:o.players.getNumTracks()})):o.players.isCurrent(e)?o.players.current.getPosition(t=>{t>0&&(o.playbackState.sync(e,o.playbackState.STATE.PAUSE),v.stop())}):o.players.crossfade.stop()}function ya(e){E.log(`onSoundCloudPlayerEvent: FINISH (iframeId: ${e})`),o.players.isCurrent(e)?(v.stop(),o.embeddedEvent(s.MEDIA_ENDED)):o.players.crossfade.stop()}function ga(e){let t=o.players.playerFromIframeId(e);E.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)}var I=f("gallery-events"),fe={snackbarId:0,nowPlayingIcons:null},Re={nowPlayingIconsSelector:"h2.track-artist-title"};function Tt(){I.log("init()"),fe.nowPlayingIcons=document.querySelectorAll(Re.nowPlayingIconsSelector),p(s.MEDIA_PLAYING,fa),p(s.MEDIA_PAUSED,ma),p(s.MEDIA_ENDED,ka),p(s.MEDIA_CUE_TRACK,Ta),p(s.CONTINUE_AUTOPLAY,ba),p(s.RESUME_AUTOPLAY,ha),p(s.AUTOPLAY_BLOCKED,Aa),p(s.PLAYBACK_BLOCKED,Pa),p(s.MEDIA_UNAVAILABLE,Sa)}function fa(e){if(I.log(e),Fe(fe.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${Re.nowPlayingIconsSelector}`);bt(t),w(t,"playing-paused","now-playing-icon"),l.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function ma(e){I.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${Re.nowPlayingIconsSelector}`).classList.add("playing-paused")}function ka(e){I.log(e),e!==null&&e.data.numTracks>1&&bt()}function Ta(e){I.log(e),e.data.scrollToMedia&&F(e.data.trackId)}function ba(e){I.log(e),Z()&&e.data.trackType===C.YOUTUBE?ee(L.NEXT,!0):z(A.nextPage,!0)}function ha(e){let t=JSON.parse(sessionStorage.getItem(Pe.UF_AUTOPLAY));if(sessionStorage.removeItem(Pe.UF_AUTOPLAY),I.log(e),I.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id??null;a===null&&t.trackId!==null?S({message:"Unable to cue track (not found)",duration:5}):e.callback.resumeAutoplay(t,a)}else e.callback.resumeAutoplay()}function Aa(e){I.log(e),fe.snackbarId=S({message:"Autoplay blocked, Play to continue",duration:0,actionText:"play",actionClickCallback:()=>e.callback.play()})}function Pa(e){I.log(e),S({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>ht(e)})}function Sa(e){I.log(e),S({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>ht(e)})}function bt(e){fe.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function ht(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):Z()&&e.data.trackType===C.YOUTUBE?ee(L.NEXT,l.playback.autoplay):A.nextPage!==null&&z(A.nextPage,!0)}var Pt=f("gallery-controls"),me={uiElements:null,players:{}},N={},x={crossfadePresetSelector:"button.crossfade-preset-toggle",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:"button.crossfade-fadeto-button"};function St(e,t){Pt.log("init()"),me.players=e,me.uiElements=new Me("div.track-meta",!0),N.crossfadePreset=Le(x.crossfadePresetSelector),N.crossfadeTo=Le(x.crossfadeToSelector),N.crossfadePreset.length>1&&N.crossfadeTo.length>1&&(N.crossfadePreset.forEach(a=>Ct(a,l.gallery.trackCrossfadeDefPreset)),N.crossfadeTo.clickCallback=t),p(s.PLAYBACK_READY,La)}function La(){N.crossfadePreset.length>1&&N.crossfadeTo.length>1&&(N.crossfadePreset.forEach(e=>{e.addEventListener("click",Na),w(e,P.DISABLED.CLASS,P.ENABLED.CLASS)}),N.crossfadeTo.forEach(e=>e.addEventListener("click",va)),p(s.MEDIA_PLAYING,At),p(s.MEDIA_PAUSED,At))}var Me=class extends j{elementClicked(){if(this.clicked("button.track-share-button"))return oe(this.closest("single-track, gallery-track"));if(this.clicked("button.track-details-button"))return ie(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return Se(this.event);if(this.clicked("span.track-channels-links"))return Se(this.event)}};function Ct(e,t){e.setAttribute(x.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${se.crossfade[t].name}`}function Na(e){let t=parseInt(e.target.getAttribute(x.crossfadePresetData));Ct(e.target,t+1<se.crossfade.length?t+1:0)}function va(e){if(D()&&me.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),n=parseInt(t.querySelector(x.crossfadePresetSelector).getAttribute(x.crossfadePresetData));w(t.querySelector(x.crossfadeToSelector),P.ENABLED.CLASS,P.DISABLED.CLASS),N.crossfadeTo.clickCallback(a.id,se.crossfade[n])}}}function At(){let e=D(),t=e?me.players.getTrackData().currentTrack:-1;Pt.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),N.crossfadeTo.forEach((a,n)=>{t===n+1?w(a,e?P.ENABLED.CLASS:P.DISABLED.CLASS,e?P.DISABLED.CLASS:P.ENABLED.CLASS):w(a,e?P.DISABLED.CLASS:P.ENABLED.CLASS,e?P.ENABLED.CLASS:P.DISABLED.CLASS)})}var m=f("gallery-playback"),r={eventLog:null,players:{}},Lt={minCrossfadeToTime:5,maxBufferingDelay:3};function Da(){m.log("init()"),r.eventLog=V,Tt(),r.players=new ge,Qe(e=>r.players.getTrackData(e),Oa),St(r.players,wa),v.init(r.players,Ut),mt(r.players,Ba,xa)}function X(){ze(),r.players.current.play(Ve)}function Nt(){ne(),r.players.current.pause()}function vt(){D()?Nt():X()}function It(){m.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrackNum()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrackNum()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),J(0,0,r.players.current.getDuration())):(r.players.getCurrentTrackNum()>1&&r.players.stop(),r.players.prevTrack()?q(D()):g(s.MEDIA_PREV_TRACK))})}function _e(e=!1){let t=r.players.getCurrentTrackNum()+1>r.players.getNumTracks();m.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${l.playback.autoplay}`),!Ua(e,t)&&(t===!1?(r.players.stop(),e&&l.playback.autoplay===!1?ne():r.players.nextTrack()&&q(D())):t===!0&&e===!1?g(s.MEDIA_NEXT_TRACK):e&&(ne(),l.playback.autoplay?g(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function Ua(e,t){if(e&&l.playback.autoplay){let a=Ze();if(m.log(`repeatPlayback(): ${m.getKeyForValue(le,a)}`),a===le.ONE)return r.players.current.seekTo(0),X(),!0;if(t&&a===le.ALL)return r.players.stop(),r.players.setPlayerIndex(0),q(!0),!0}return!1}function Oa(e){r.players.current.seekTo(e)}function Va(){r.players.current.setVolume(l.playback.masterVolume)}function Dt(){l.playback.masterMute=l.playback.masterMute!==!0,r.players.mute()}function Ra(e,t,a=!0){m.log(`cueOrPlayTrackById() - iframeId: ${e} - autoplay: ${t.autoplay} - position: ${t.position}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),g(s.MEDIA_CUE_TRACK,{scrollToMedia:a,trackId:r.players.current.getTrackId()}),t.autoplay?r.players.current.playTrackById(t.position):(r.players.current.cueTrackById(t.position),t.position!==0&&J(t.position*1e3,t.position,r.players.current.getDuration())),$(t.position)}function q(e,t=!0){g(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&X(),$()}function Ma(e,t=!0){m.log(`skipToTrack() - trackNum: ${e} - playMedia: ${t}`),t===!0&&D()===!1&&(r.eventLog.add(d.ULTRAFUNK,y.RESUME_AUTOPLAY),r.players.gotoTrackNum(e)&&q(t))}function _a(e=null,t=null){e!==null&&t!==null?Ra(t,e):e!==null&&e.autoplay?(m.log("resumeAutoplay(): Play first track"),r.eventLog.add(d.ULTRAFUNK,y.RESUME_AUTOPLAY),X()):(m.log("resumeAutoplay(): Cue first track"),$())}function Ya(e,t,a=!1){m.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setSourceUid(t.uid),r.players.current.setArtistAndTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),je(0),$(),a?r.players.current.playTrackById():r.players.current.cueTrackById()}function ke(e=!1){let t={isPlaying:D(),currentTrack:r.players.getCurrentTrackNum(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),elementId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()};return e&&r.players.current.getPosition(a=>(t.position=Math.round(a/1e3),t)),t}function wa(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(m.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getIframeId()})
      fadeIn.: ${r.players.playerFromIframeId(e).getArtist()} - "${r.players.playerFromIframeId(e).getTitle()}" (${e})`),l.playback.masterMute===!1&&l.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=Lt.minCrossfadeToTime+Lt.maxBufferingDelay&&Ut(O.TRACK,t,e)}))}function Ut(e,t,a=null){r.eventLog.add(d.ULTRAFUNK,y.CROSSFADE_START),r.players.crossfade.init(e,t,a)&&(a===null?r.players.nextTrack()&&q(!0):r.players.gotoTrackNum(r.players.trackNumFromIframeId(a))&&q(!0,!1))}function xa(e,t=null){switch(m.log(`embeddedEventHandler() - event: ${m.getKeyForValue(s,e)}`),t!==null&&m.log(t),e){case s.MEDIA_ENDED:g(s.MEDIA_ENDED,ke()),_e(!0);break;case s.PLAYBACK_READY:Je(It,vt,_e,Dt),yt(Ya),g(s.PLAYBACK_READY,t),g(s.RESUME_AUTOPLAY,null,{resumeAutoplay:_a});break;case s.AUTOPLAY_BLOCKED:g(s.AUTOPLAY_BLOCKED,null,{play:X});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:g(e,t,{skipToTrack:Ma});break}}var Ba=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(n,i){m.log(`playbackState.sync() - previousTrack: ${r.players.getCurrentTrackNum()} - nextTrack: ${r.players.indexMap.get(n)+1} - syncState: ${m.getKeyForValue(e,i)}`),r.players.isCurrent(n)?i===e.PLAY?g(s.MEDIA_PLAYING,ke()):i===e.PAUSE&&g(s.MEDIA_PAUSED,ke()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(n)),$(),a(n,i))}}})();var be=f("screen-wakelock"),Te={wakeLock:null};function Ot(){l.mobile.keepScreenOn&&document.addEventListener("click",Vt)}function Vt(){be.log("enableScreenWakeLock()"),document.removeEventListener("click",Vt),$a(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&l.mobile.keepScreenOn&&Ka()})}function Ka(){Rt()&&Te.wakeLock===null&&Mt()}function Rt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function $a(){Rt()?document.visibilityState==="visible"&&await Mt()!==!0&&(be.log("enableWakeLock(): Screen Wake Lock request failed"),S({message:"Keep Screen On failed",duration:5,actionText:"Disable",actionClickCallback:()=>l.mobile.keepScreenOn=!1})):(be.log("enableWakeLock(): Screen Wake Lock is not supported"),S({message:"Keep Screen On is not supported",duration:5,actionText:"Disable",actionClickCallback:()=>l.mobile.keepScreenOn=!1}))}async function Mt(){try{return Te.wakeLock=await navigator.wakeLock.request("screen"),Te.wakeLock.addEventListener("release",()=>{Te.wakeLock=null}),!0}catch(e){be.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var H=f("playback-interaction"),_t=new ue(10),c={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null,broadcastChannel:null};document.addEventListener("DOMContentLoaded",()=>{Ke(),H.log("DOMContentLoaded"),$e(),rt()?c.player=Ye:st()&&(c.player=at),c.player!==null&&Fa(),dt(c.player?.getStatus)});function Fa(){H.log("initCommon()"),He(),Ga(),c.player.init(),c.siteNavUiElements=new we("#site-navigation"),c.trackNavUiElements=new xe("nav.single-track-nav .nav-links"),G.init(),c.keyboardShortcuts=Ge(l.playback.keyboardShortcuts),c.broadcastChannel=new BroadcastChannel("playbackStatus"),Wa(),Ot()}function Ga(){p(s.PLAYBACK_READY,Ja),p(s.MEDIA_PLAYING,()=>c.broadcastChannel.postMessage(s.MEDIA_PLAYING)),p(s.MEDIA_CUE_TRACK,wt),p(s.MEDIA_ENDED,wt),p(s.MEDIA_TIME_REMAINING,ja),p(s.MEDIA_PREV_TRACK,()=>Y(null,L.PREV,A.prevPage)),p(s.MEDIA_NEXT_TRACK,()=>Y(null,L.NEXT,A.nextPage))}function Wa(){Q(".playback-shuffle-button span","click",lt),document.addEventListener("keydown",qa),document.addEventListener("keydown",Xa),window.focus(),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&window.focus()},250)}),c.broadcastChannel.addEventListener("message",e=>{H.log(`broadcastChannel('playbackStatus') message: ${e.data}`),e.data===s.MEDIA_PLAYING&&l.playback.pauseOnPlayerChange&&c.player.pause()})}function qa(e){if(c.isPlaybackReady&&c.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":Yt(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&Yt(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),F(c.player.getStatus().elementId);break}switch(e.key){case" ":e.preventDefault(),c.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":it(e);break;case"ArrowLeft":Ha(e);break;case"ArrowRight":Qa(e);break;case"A":ve.toggle();break;case"f":case"F":e.preventDefault(),G.toggle(document.getElementById(c.player.getStatus().iframeId));break;case"i":e.preventDefault(),ie(document.getElementById(c.player.getStatus().elementId));break;case"I":e.preventDefault(),oe(document.getElementById(c.player.getStatus().elementId));break;case"m":case"M":e.preventDefault(),c.player.toggleMute(),S({message:l.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",duration:3});break;case"p":case"P":ct.toggle();break;case"r":case"R":S({message:`${et().title} (<b>r</b> to change)`,duration:3});break;case"x":case"X":ut.toggle();break}}}}function Xa(e){if(c.isPlaybackReady&&c.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":Xe===!1&&(H.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),c.player.togglePlayPause());break;case"MediaTrackPrevious":H.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),c.player.prevTrack();break;case"MediaTrackNext":H.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),c.player.nextTrack();break}}function Ha(e){e.preventDefault(),e.shiftKey===!0?Y(null,L.PREV,A.prevPage):c.player.prevTrack()}function Qa(e){e.preventDefault(),e.shiftKey===!0?Y(null,L.NEXT,A.nextPage):c.player.nextTrack()}function Y(e,t,a){e?.preventDefault(),Z()&&c.player.getStatus().trackType===C.YOUTUBE?pt()===!1?ee(t,c.player.getStatus().isPlaying):S({message:"Loading track, please wait...",duration:3}):xt(null,a)}function Yt(e){e.preventDefault(),l.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?l.playback.masterVolume<100?l.playback.masterVolume+5:100:l.playback.masterVolume>5?l.playback.masterVolume-5:5,c.player.setVolume()}function Ja(){Q(".playback-thumbnail-control","click",Za),Q(".playback-details-control","click",za),Q(".playback-timer-control","click",er),c.isPlaybackReady=!0}function wt(){let e=Ne()&&c.player.getStatus().numTracks>1;(l.playback.autoExitFullscreen||e)&&G.exit()}function ja(e){let t=e.data.timeRemainingSeconds<=l.playback.timeRemainingSeconds;l.playback.autoExitFsOnWarning&&t&&G.exit()}function za(){F(c.player.getStatus().elementId)}function Za(){Ne()?(_t.add(d.MOUSE,y.MOUSE_CLICK),_t.doubleClicked(d.MOUSE,y.MOUSE_CLICK,500)&&G.enter(document.getElementById(c.player.getStatus().iframeId))):nt()&&F(0)}function er(){ve.toggle()}var we=class extends j{elementClicked(){if(this.clicked("a.navbar-prev-link"))return Y(this.event,L.PREV,A.prevPage);if(this.clicked("a.navbar-next-link"))return Y(this.event,L.NEXT,A.nextPage)}},xe=class extends j{elementClicked(){if(this.clicked("div.nav-previous a"))return Y(this.event,L.PREV,A.prevPage);if(this.clicked("div.nav-next a"))return Y(this.event,L.NEXT,A.nextPage)}};function xt(e,t){e?.preventDefault(),z(t,c.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
