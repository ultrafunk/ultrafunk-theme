import{$ as E,Aa as Ke,B as Le,Ba as Fe,Ca as Ge,D as S,E as Ie,Ea as ce,Fa as We,Ga as qe,H as Y,Ha as x,Ia as Xe,Ja as ue,Ka as He,La as N,M as L,Ma as Je,Na as D,Oa as ze,Pa as Qe,Qa as de,Ra as Ze,S as le,Sa as b,Ta as _,U as ve,Ua as je,Va as et,Wa as B,X as Ne,Y as s,Z as c,_ as p,a as ht,aa as ie,ba as De,c as f,ca as Ue,d as Se,da as Me,ea as Re,fa as O,ga as v,ha as h,ia as we,j as K,ja as F,k as oe,ka as G,la as Ye,ma as Oe,na as V,s as m,sa as W,t as o,ta as q,u as he,ua as Ve,va as xe,w as T,wa as X,x as ne,xa as _e,y as Ae,ya as Be,z as Ce,za as $e}from"../chunk-4T7234YU.js";var Te={};ht(Te,{getStatus:()=>ae,init:()=>aa,nextTrack:()=>Ee,onAutoplayBlocked:()=>Z,onEmbeddedPlayersReady:()=>ke,onMediaEnded:()=>Q,onMediaUnavailable:()=>fe,pause:()=>pt,play:()=>M,prevTrack:()=>kt,setVolume:()=>oa,toggleMute:()=>ft,togglePlayPause:()=>yt});var pe=class extends Ve{#e=null;#t=null;#r(t,a=0){let l=Math.round(t/1e3);O(t,l,a),l>0&&a>0&&(super.updateOncePerSecond(l,a),this.#s(l,a))}#a(){return o.playback.autoplay&&o.gallery.autoCrossfade}#s(t,a){o.playback.masterMute===!1&&this.#a()&&a-t===o.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrackNum()+1<=this.#e.getNumTracks()&&this.#t(X.AUTO,{name:"Auto Crossfade",length:o.gallery.autoCrossfadeLength,curve:o.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){h()&&this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>Xe(Math.round(t),this.#e.current.isMuted()))}},tt=new pe;var d=f("embedded-players"),k=new Be(10),n={players:{},playbackState:null,loadEventsTotal:0,loadEventsCount:1},At={maxPlaybackStartDelay:3};function rt(e,t){d.log("init()"),n.players=e,n.playbackState=t,n.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),It(),Vt()}function H(){return{loadingPercent:100*(n.loadEventsCount++/n.loadEventsTotal)}}function st(){n.loadEventsCount>=n.loadEventsTotal?ke():p(s.PLAYBACK_LOADING,H())}function Ct(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=Le(t),l=t.querySelector("iframe"),u=null;if(a===T.YOUTUBE)e.length===1&&l===null?u=at("youtube-player",t,!0):u=at(l.id,t,!1),u.setDuration(parseInt(t.getAttribute("data-track-duration")));else if(a===T.SOUNDCLOUD){let g=SC.Widget(l.id);u=new z(t.id,l.id,g),g.bind(SC.Widget.Events.READY,()=>xt(l.id,t,u,g)),g.bind(SC.Widget.Events.PLAY,()=>_t(l.id)),g.bind(SC.Widget.Events.PAUSE,()=>Bt(l.id)),g.bind(SC.Widget.Events.FINISH,()=>$t(l.id)),g.bind(SC.Widget.Events.ERROR,()=>Kt(l.id))}u!==null&&(u.setArtistAndTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),n.players.add(u))})}function at(e,t,a=!1){let l=t.getAttribute("data-track-source-uid"),u=new YT.Player(e,{events:{onReady:g=>vt(g,e),onStateChange:g=>Nt(g,e),onError:g=>Ot(g,e),onAutoplayBlocked:()=>Z()},playerVars:{disablekb:1},...a&&{videoId:l}});return new J(t.id,e,u,l)}function $(e,t){d.log("onPlayerError()"),d.log(e);let a=e.getTrackType()===T.YOUTUBE?k.SOURCE.YOUTUBE:k.SOURCE.SOUNDCLOUD;n.players.isCurrent(e.getIframeId())===!1&&n.players.stop(),k.add(a,k.EVENT.PLAYER_ERROR,e.getIframeId()),fe(Lt(e,t))}function Lt(e,t){let a=e.getArtist()||"N/A",l=e.getTitle()||"N/A";return{currentTrack:n.players.trackNumFromIframeId(e.getIframeId()),numTracks:n.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${l}`,mediaUrl:t}}function It(){d.log("initYouTubeAPI()"),p(s.PLAYBACK_LOADING,H()),window.onYouTubeIframeAPIReady=()=>{d.log("onYouTubeIframeAPIReady()"),p(s.PLAYBACK_LOADING,H()),Ct()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function vt(e,t){let a=n.players.playerFromIframeId(t);e.target.getPlayerState()===-1?(d.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${a.getSourceUid()} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):d.log(`onYouTubePlayerReady(): ${t} => ${a.getSourceUid()} => ${a.getArtist()} - ${a.getTitle()}`),st()}function Nt(e,t){switch(k.add(k.SOURCE.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:Dt(t);break;case YT.PlayerState.BUFFERING:Ut(t);break;case YT.PlayerState.PLAYING:Mt(t);break;case YT.PlayerState.PAUSED:Rt(t);break;case YT.PlayerState.CUED:wt(t);break;case YT.PlayerState.ENDED:Yt(t);break}}function Dt(e){d.log(`onYouTubePlayerStateChange: UNSTARTED (iframeId: ${e})`)}function Ut(e){if(d.log(`onYouTubePlayerStateChange: BUFFERING (iframeId: ${e})`),n.players.crossfade.isFading()===!1){let t=n.players.playerFromIframeId(e);t.mute(o.playback.masterMute),t.setVolume(o.playback.masterVolume),p(s.MEDIA_LOADING)}}function Mt(e){d.log(`onYouTubePlayerStateChange: PLAYING   (iframeId: ${e})`),n.playbackState.sync(e,n.playbackState.STATE.PLAY)}function Rt(e){d.log(`onYouTubePlayerStateChange: PAUSED    (iframeId: ${e})`),n.players.isCurrent(e)?n.playbackState.sync(e,n.playbackState.STATE.PAUSE):n.players.crossfade.stop()}function wt(e){d.log(`onYouTubePlayerStateChange: CUED      (iframeId: ${e})`)}function Yt(e){d.log(`onYouTubePlayerStateChange: ENDED     (iframeId: ${e})`),n.players.isCurrent(e)?Q():n.players.crossfade.stop()}function Ot(e,t){let a=n.players.playerFromIframeId(t);d.log(`onYouTubePlayerError(${e.data!==null?e.data:"null"}) - iframeId: ${t} - isCued: ${a.isCued()} - isPlayable: ${a.isPlayable()}`),e.data!==null&&a.isCued()?(a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(a.setIsPlayable(!1),$(a,e.target.getVideoUrl()))}function Vt(){d.log("initSoundCloudAPI()"),p(s.PLAYBACK_LOADING,H())}function xt(e,t,a,l){d.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),l.getDuration(u=>{a.setDuration(Math.round(u/1e3)),t.setAttribute("data-track-duration",a.getDuration()),st()})}function _t(e){d.log(`onSoundCloudPlayerEvent: PLAY   (iframeId: ${e})`),k.add(k.SOURCE.SOUNDCLOUD,k.EVENT.STATE_PLAYING,e),n.players.crossfade.isFading()&&n.players.isCurrent(e)?k.scPlayDoubleTrigger(e,At.maxPlaybackStartDelay*1e3)&&n.playbackState.sync(e,n.playbackState.STATE.PLAY):(n.playbackState.sync(e,n.playbackState.STATE.PLAY),n.players.current.mute(o.playback.masterMute),n.players.current.setVolume(o.playback.masterVolume))}function Bt(e){d.log(`onSoundCloudPlayerEvent: PAUSE  (iframeId: ${e})`),k.add(k.SOURCE.SOUNDCLOUD,k.EVENT.STATE_PAUSED,e),k.scAutoplayBlocked(e,3e3)?Z():n.players.isCurrent(e)?n.players.current.getPosition(t=>{t>0&&n.playbackState.sync(e,n.playbackState.STATE.PAUSE)}):n.players.crossfade.stop()}function $t(e){d.log(`onSoundCloudPlayerEvent: FINISH (iframeId: ${e})`),n.players.isCurrent(e)?Q():n.players.crossfade.stop()}function Kt(e){let t=n.players.playerFromIframeId(e);d.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)}var Ft=f("gallery-players"),J=class extends ne{constructor(t,a,l,u){super(T.YOUTUBE,t,a,l),this.setThumbnail(Ae(u)),this.setSourceUid(u)}pause(){this.embedded.pauseVideo()}stop(){this.embedded.stopVideo()}cueTrackById(t=0){this.embedded.cueVideoById(this.getSourceUid(),t),this.setIsCued(!0)}playTrackById(t=0){this.embedded.loadVideoById(this.getSourceUid(),t)}play(){this.isPlayable()?this.embedded.playVideo():$(this,this.embedded.getVideoUrl())}getVolume(t){t(this.embedded.getVolume())}mute(t){t?this.embedded.mute():this.embedded.unMute()}isMuted(){return this.embedded.isMuted()}getPosition(t){t(this.embedded.getCurrentTime()*1e3,this.duration)}},z=class extends ne{#e=xe.MAX;#t=!1;constructor(t,a,l){super(T.SOUNDCLOUD,t,a,l)}setThumbnail(t){this.embedded.getCurrentSound(a=>{super.setThumbnail(Ce(a)),t?.setAttribute("data-track-thumbnail-url",this.getThumbnailSrc())})}cueTrackById(t=0){this.seekTo(t),this.setIsCued(!0)}playTrackById(t=0){this.seekTo(t),this.play(),this.setIsCued(!1)}pause(){this.embedded.pause()}play(){this.isPlayable()?this.embedded.getCurrentSound(t=>{t.playable===!0?this.embedded.play():$(this,t.permalink_url)}):$(this,"https://soundcloud.com")}stop(){this.pause(),super.seekTo(0)}seekTo(t){super.seekTo(t*1e3)}getVolume(t){this.#t===!1&&this.embedded.getVolume(a=>t(a))}setVolume(t){t!==0&&(this.#e=t),(this.#t===!1||t===0)&&super.setVolume(t)}mute(t){this.#t=!!t,t?this.setVolume(0):this.setVolume(this.#e)}isMuted(){return this.#t}getPosition(t){this.embedded.getPosition(a=>t(a,this.duration))}},j=class{indexMap=new Map;crossfade=null;#e=[];#t=0;constructor(){this.crossfade=_e(this),c(s.MEDIA_PLAYING,()=>this.crossfade.start()),c(s.MEDIA_PAUSED,()=>this.crossfade.stop())}get current(){return this.#e[this.#t]}get next(){return this.#e[this.#t+1]}setPlayerIndex(t){this.#t=t}getTrackType(){return this.current.getTrackType()}getNumTracks(){return this.#e.length}getCurrentTrackNum(){return this.#t+1}playerFromIframeId(t){return this.#e[this.indexMap.get(t)]}trackNumFromIframeId(t){return this.indexMap.get(t)+1}isCurrent(t){return t===this.current.getIframeId()}add(t){Ft.log(t),this.#e.push(t),this.indexMap.set(t.getIframeId(),this.#e.length-1)}stop(){this.current.stop(),this.crossfade.stop()}mute(){this.current.mute(o.playback.masterMute),this.crossfade.mute(o.playback.masterMute)}getTrackData(t=0){return{currentTrack:this.getCurrentTrackNum(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),position:t,duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}prevTrack(){return this.#t>0?(this.#t--,!0):!1}nextTrack(){return this.#t++,this.#t<this.getNumTracks()}gotoTrackNum(t){return t>0&&t<=this.getNumTracks()?(this.#t=t-1,!0):!1}};var A=f("gallery-events"),ee={snackbarId:0,nowPlayingIcons:null},ge={nowPlayingIconsSelector:"h2.track-artist-title"};function ot(){A.log("init()"),ee.nowPlayingIcons=document.querySelectorAll(ge.nowPlayingIconsSelector),c(s.MEDIA_PLAYING,Gt),c(s.MEDIA_PAUSED,Wt),c(s.MEDIA_ENDED,qt),c(s.MEDIA_CUE_TRACK,Xt),c(s.CONTINUE_AUTOPLAY,Ht),c(s.RESUME_AUTOPLAY,Jt),c(s.AUTOPLAY_BLOCKED,zt),c(s.MEDIA_UNAVAILABLE,Qt)}function Gt(e){if(A.log(e),Ie(ee.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${ge.nowPlayingIconsSelector}`);nt(t),L(t,"playing-paused","now-playing-icon"),o.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Wt(e){A.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${ge.nowPlayingIconsSelector}`).classList.add("playing-paused")}function qt(e){A.log(e),e!==null&&e.data.numTracks>1&&nt()}function Xt(e){A.log(e),e.data.scrollToMedia&&N(e.data.trackId)}function Ht(e){A.log(e),_()&&e.data.trackType===T.YOUTUBE?B(b.NEXT,!0):x(m.nextPage,!0)}function Jt(e){let t=JSON.parse(sessionStorage.getItem(oe.UF_AUTOPLAY));if(sessionStorage.removeItem(oe.UF_AUTOPLAY),A.log(e),A.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id??null;a===null&&t.trackId!==null?S({message:"Unable to cue track (not found)",duration:5}):e.callback.resumeAutoplay(t,a)}else e.callback.resumeAutoplay()}function zt(e){A.log(e),ee.snackbarId=S({message:"Autoplay blocked, Play to continue",duration:0,actionText:"play",actionClickCallback:()=>e.callback.play()})}function Qt(e){A.log(e),S({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>Zt(e)})}function nt(e){ee.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function Zt(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):_()&&e.data.trackType===T.YOUTUBE?B(b.NEXT,o.playback.autoplay):m.nextPage!==null&&x(m.nextPage,!0)}var it=f("gallery-controls"),te={uiElements:null,players:{}},P={},I={crossfadePresetSelector:"button.crossfade-preset-toggle",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:"button.crossfade-fadeto-button"};function ct(e,t){it.log("init()"),te.players=e,te.uiElements=new me("div.track-meta",!0),P.crossfadePreset=ie(I.crossfadePresetSelector),P.crossfadeTo=ie(I.crossfadeToSelector),P.crossfadePreset.length>1&&P.crossfadeTo.length>1&&(P.crossfadePreset.forEach(a=>ut(a,o.gallery.trackCrossfadeDefPreset)),P.crossfadeTo.clickCallback=t),c(s.PLAYBACK_READY,jt)}function jt(){P.crossfadePreset.length>1&&P.crossfadeTo.length>1&&(P.crossfadePreset.forEach(e=>{e.addEventListener("click",ea),L(e,E.DISABLED.CLASS,E.ENABLED.CLASS)}),P.crossfadeTo.forEach(e=>e.addEventListener("click",ta)),c(s.MEDIA_PLAYING,lt),c(s.MEDIA_PAUSED,lt))}var me=class extends V{elementClicked(){if(this.clicked("button.track-share-button"))return W(this.closest("single-track, gallery-track"));if(this.clicked("button.track-details-button"))return q(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return le(this.event);if(this.clicked("span.track-channels-links"))return le(this.event)}};function ut(e,t){e.setAttribute(I.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${K.crossfade[t].name}`}function ea(e){let t=parseInt(e.target.getAttribute(I.crossfadePresetData));ut(e.target,t+1<K.crossfade.length?t+1:0)}function ta(e){if(h()&&te.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),l=parseInt(t.querySelector(I.crossfadePresetSelector).getAttribute(I.crossfadePresetData));L(t.querySelector(I.crossfadeToSelector),E.ENABLED.CLASS,E.DISABLED.CLASS),P.crossfadeTo.clickCallback(a.id,K.crossfade[l])}}}function lt(){let e=h(),t=e?te.players.getTrackData().currentTrack:-1;it.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),P.crossfadeTo.forEach((a,l)=>{t===l+1?L(a,e?E.ENABLED.CLASS:E.DISABLED.CLASS,e?E.DISABLED.CLASS:E.ENABLED.CLASS):L(a,e?E.DISABLED.CLASS:E.ENABLED.CLASS,e?E.ENABLED.CLASS:E.DISABLED.CLASS)})}var y=f("gallery-playback"),r={eventLog:null,players:{}},dt={minCrossfadeToTime:5,maxBufferingDelay:3};function aa(){y.log("init()"),r.eventLog=k,ot(),r.players=new j,Ue(e=>r.players.getTrackData(e),sa),ct(r.players,ua),tt.init(r.players,gt),rt(r.players,da)}function M(){we(),r.players.current.play()}function pt(){F(),r.players.current.pause()}function yt(){h()?pt():M()}function kt(){y.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrackNum()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrackNum()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),O(0,0,r.players.current.getDuration())):(r.players.getCurrentTrackNum()>1&&r.players.stop(),r.players.prevTrack()?U(h()):p(s.MEDIA_PREV_TRACK))})}function Ee(e=!1){let t=r.players.getCurrentTrackNum()+1>r.players.getNumTracks();y.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${o.playback.autoplay}`),!ra(e,t)&&(t===!1?(r.players.stop(),e&&o.playback.autoplay===!1?F():r.players.nextTrack()&&U(h())):t===!0&&e===!1?p(s.MEDIA_NEXT_TRACK):e&&(F(),o.playback.autoplay?p(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function ra(e,t){if(e&&o.playback.autoplay){let a=Ye();if(y.log(`repeatPlayback(): ${y.getKeyForValue(G,a)}`),a===G.ONE)return r.players.current.seekTo(0),M(),!0;if(t&&a===G.ALL)return r.players.stop(),r.players.setPlayerIndex(0),U(!0),!0}return!1}function sa(e){r.players.current.seekTo(e)}function oa(){r.players.current.setVolume(o.playback.masterVolume)}function ft(){o.playback.masterMute=o.playback.masterMute!==!0,r.players.mute()}function na(e,t,a=!0){y.log(`cueOrPlayTrackById() - iframeId: ${e} - autoplay: ${t.autoplay} - position: ${t.position}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),p(s.MEDIA_CUE_TRACK,{scrollToMedia:a,trackId:r.players.current.getTrackId()}),t.autoplay?r.players.current.playTrackById(t.position):(r.players.current.cueTrackById(t.position),t.position!==0&&O(t.position*1e3,t.position,r.players.current.getDuration())),v(t.position)}function U(e,t=!0){p(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&M(),v()}function la(e,t=!0){y.log(`skipToTrack() - trackNum: ${e} - playMedia: ${t}`),t===!0&&h()===!1&&(r.eventLog.add(r.eventLog.SOURCE.ULTRAFUNK,r.eventLog.EVENT.RESUME_AUTOPLAY),r.players.gotoTrackNum(e)&&U(t))}function ia(e=null,t=null){e!==null&&t!==null?(e.autoplay&&r.eventLog.add(r.eventLog.SOURCE.ULTRAFUNK,r.eventLog.EVENT.RESUME_AUTOPLAY),na(t,e)):e!==null&&e.autoplay?(y.log("resumeAutoplay(): Play first track"),r.eventLog.add(r.eventLog.SOURCE.ULTRAFUNK,r.eventLog.EVENT.RESUME_AUTOPLAY),M()):(y.log("resumeAutoplay(): Cue first track"),v())}function ca(e,t,a=!1){y.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setSourceUid(t.uid),r.players.current.setArtistAndTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),Re(0),v(),a?r.players.current.playTrackById():r.players.current.cueTrackById()}function ae(e=!1){let t={isPlaying:h(),currentTrack:r.players.getCurrentTrackNum(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),trackElementId:r.players.current.getTrackId(),playerId:r.players.current.getIframeId()};return e?new Promise(a=>{r.players.current.getPosition(l=>{t.position=Math.round(l/1e3),a(t)})}):t}function ua(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(y.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getIframeId()})
      fadeIn.: ${r.players.playerFromIframeId(e).getArtist()} - "${r.players.playerFromIframeId(e).getTitle()}" (${e})`),o.playback.masterMute===!1&&o.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=dt.minCrossfadeToTime+dt.maxBufferingDelay&&gt(X.TRACK,t,e)}))}function gt(e,t,a=null){r.eventLog.add(r.eventLog.SOURCE.ULTRAFUNK,r.eventLog.EVENT.CROSSFADE_START),r.players.crossfade.init(e,t,a)&&(a===null?r.players.nextTrack()&&U(!0):r.players.gotoTrackNum(r.players.trackNumFromIframeId(a))&&U(!0,!1))}function ke(){y.log("onEmbeddedPlayersReady()"),Me(kt,yt,Ee,ft),et(ca),p(s.PLAYBACK_READY,{resetProgressBar:!0}),p(s.RESUME_AUTOPLAY,null,{resumeAutoplay:ia})}function Q(){y.log("onMediaEnded()"),p(s.MEDIA_ENDED,ae()),Ee(!0)}function Z(){y.log("onAutoplayBlocked()"),p(s.AUTOPLAY_BLOCKED,null,{play:M})}function fe(e){y.log("onMediaUnavailable()"),y.log(e),p(s.MEDIA_UNAVAILABLE,e,{skipToTrack:la})}var da=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(l,u){y.log(`playbackState.sync() - previousTrack: ${r.players.getCurrentTrackNum()} - nextTrack: ${r.players.indexMap.get(l)+1} - syncState: ${y.getKeyForValue(e,u)}`),r.players.isCurrent(l)?u===e.PLAY?p(s.MEDIA_PLAYING,ae()):u===e.PAUSE&&p(s.MEDIA_PAUSED,ae()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(l)),v(),a(l,u))}}})();var se=f("screen-wakelock"),re={wakeLock:null};function mt(){o.mobile.keepScreenOn&&document.addEventListener("click",Et)}function Et(){se.log("enableScreenWakeLock()"),document.removeEventListener("click",Et),ya(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&o.mobile.keepScreenOn&&pa()})}function pa(){Tt()&&re.wakeLock===null&&bt()}function Tt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function ya(){Tt()?document.visibilityState==="visible"&&await bt()!==!0&&(se.log("enableWakeLock(): Screen Wake Lock request failed"),S({message:"Keep Screen On failed",duration:5,actionText:"Disable",actionClickCallback:()=>o.mobile.keepScreenOn=!1})):(se.log("enableWakeLock(): Screen Wake Lock is not supported"),S({message:"Keep Screen On is not supported",duration:5,actionText:"Disable",actionClickCallback:()=>o.mobile.keepScreenOn=!1}))}async function bt(){try{return re.wakeLock=await navigator.wakeLock.request("screen"),re.wakeLock.addEventListener("release",()=>{re.wakeLock=null}),!0}catch(e){se.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var w=f("playback-interaction"),R=new $e(10),i={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null,broadcastChannel:null};document.addEventListener("DOMContentLoaded",()=>{Se(),w.log("DOMContentLoaded"),he(),Fe()?i.player=Te:Ge()&&(i.player=Ke),i.player!==null&&ka(),Ze(i.player)});function ka(){w.log("init()"),De(),fa(),i.player.init(),i.siteNavUiElements=new be("#site-navigation"),i.trackNavUiElements=new Pe("nav.single-track-nav .nav-links"),D.init(),i.keyboardShortcuts=ve(o.playback.keyboardShortcuts),i.broadcastChannel=new BroadcastChannel("playbackStatus"),ga(),mt()}function fa(){c(s.PLAYBACK_READY,Pa),c(s.MEDIA_PLAYING,()=>i.broadcastChannel.postMessage(s.MEDIA_PLAYING)),c(s.MEDIA_CUE_TRACK,Pt),c(s.MEDIA_ENDED,Pt),c(s.MEDIA_TIME_REMAINING,Sa),c(s.MEDIA_PREV_TRACK,()=>C(null,b.PREV,m.prevPage)),c(s.MEDIA_NEXT_TRACK,()=>C(null,b.NEXT,m.nextPage))}function ga(){Y(".playback-shuffle-button span","click",qe),document.addEventListener("keydown",ma),document.addEventListener("keydown",Ea),window.focus(),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&window.focus()},250)}),i.broadcastChannel.addEventListener("message",e=>{w.log(`broadcastChannel('playbackStatus') message: ${e.data}`),e.data===s.MEDIA_PLAYING&&o.playback.pauseOnPlayerChange&&i.player.pause()})}function ma(e){if(i.isPlaybackReady&&i.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":ue(e,i.player);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&ue(e,i.player);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),N(i.player.getStatus().trackElementId);break}switch(e.key){case" ":e.preventDefault(),i.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":Je(e);break;case"ArrowLeft":Ta(e);break;case"ArrowRight":ba(e);break;case"A":de.toggle();break;case"f":case"F":e.preventDefault(),D.toggle(document.getElementById(i.player.getStatus().playerId));break;case"i":e.preventDefault(),q(document.getElementById(i.player.getStatus().trackElementId));break;case"I":e.preventDefault(),W(document.getElementById(i.player.getStatus().trackElementId));break;case"m":case"M":e.preventDefault(),i.player.toggleMute(),S({message:o.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",duration:3});break;case"O":document.getElementById("select-local-files")?.click();break;case"p":case"P":ze.toggle();break;case"r":case"R":S({message:`${Oe().title} (<b>r</b> to change)`,duration:3});break;case"V":He(i.player);break;case"x":case"X":Qe.toggle();break}}}}function Ea(e){if(i.isPlaybackReady&&i.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":Ne===!1&&(w.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),i.player.togglePlayPause());break;case"MediaTrackPrevious":w.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),i.player.prevTrack();break;case"MediaTrackNext":w.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),i.player.nextTrack();break}}function Ta(e){e.preventDefault(),e.shiftKey===!0?C(null,b.PREV,m.prevPage):i.player.prevTrack()}function ba(e){e.preventDefault(),e.shiftKey===!0?C(null,b.NEXT,m.nextPage):i.player.nextTrack()}function C(e,t,a){e?.preventDefault(),_()&&i.player.getStatus().trackType===T.YOUTUBE?je()===!1?B(t,i.player.getStatus().isPlaying):S({message:"Loading track, please wait...",duration:3}):St(null,a)}function Pa(){Y(".playback-thumbnail-control","click",Aa),Y(".playback-details-control","click",ha),Y(".playback-timer-control","click",Ca),i.isPlaybackReady=!0}function Pt(){let e=ce()&&i.player.getStatus().numTracks>1;(o.playback.autoExitFullscreen||e)&&D.exit()}function Sa(e){let t=e.data.timeRemainingSeconds<=o.playback.timeRemainingSeconds;o.playback.autoExitFsOnWarning&&t&&D.exit()}function ha(){N(i.player.getStatus().trackElementId)}function Aa(){ce()?(R.add(R.SOURCE.MOUSE,R.EVENT.MOUSE_CLICK),R.doubleClicked(R.SOURCE.MOUSE,R.EVENT.MOUSE_CLICK,500)&&D.enter(document.getElementById(i.player.getStatus().playerId))):We()&&N(0)}function Ca(){de.toggle()}var be=class extends V{elementClicked(){if(this.clicked("a.navbar-prev-link"))return C(this.event,b.PREV,m.prevPage);if(this.clicked("a.navbar-next-link"))return C(this.event,b.NEXT,m.nextPage)}},Pe=class extends V{elementClicked(){if(this.clicked("div.nav-previous a"))return C(this.event,b.PREV,m.prevPage);if(this.clicked("div.nav-next a"))return C(this.event,b.NEXT,m.nextPage)}};function St(e,t){e?.preventDefault(),x(t,i.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
