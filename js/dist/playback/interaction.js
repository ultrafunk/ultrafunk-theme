import{$ as Oe,Aa as ye,Ba as We,Ca as qe,Da as x,E as N,Ea as Xe,Fa as O,Ga as He,Ha as R,Ia as Je,J as ue,Ja as je,Ka as ge,L as ve,La as ze,Ma as A,Na as K,O as h,Oa as Qe,P as de,Pa as Ze,Q as De,Qa as $,R as Ne,T as Ie,V as Ue,W as s,X as u,Y as g,Z as T,_ as pe,a as Pt,aa as Re,ba as Me,c as k,ca as _e,d as Pe,da as w,ea as U,fa as L,ga as Ye,ha as W,ia as q,j as G,ja as Ve,k as ce,ka as we,la as B,qa as X,ra as H,s as m,sa as Be,t as l,ta as xe,u as Ce,ua as J,va as Ke,w as b,wa as $e,x as Le,xa as Fe,ya as Ge,z as V}from"../chunk-TTPOYNBT.js";var F=k("eventlogger"),c={UNKNOWN:-1e4,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},p={UNKNOWN:-1e4,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70},Ct={eventSource:c.UNKNOWN,eventType:p.UNKNOWN,uId:null,timestamp:0},j=class{#e=[];#t=0;#r=0;#a=0;constructor(t=10){this.#t=t}add(t,a,o=null,d=Date.now()){let y=Object.create(Ct);y.eventSource=t,y.eventType=a,y.uId=o,y.timestamp=d,this.#e.length<this.#t?this.#e.push(y):(this.#e.shift(),this.#e.push(y))}clear(){this.#e=[]}getLastPos(){return this.#a}initMatch(){this.#a=this.#e.length-1,this.#r=0}matchesEvent(t,a,o,d=null){this.#e[this.#a-t].eventSource===a&&this.#e[this.#a-t].eventType===o&&this.#e[this.#a-t].uId===d&&this.#r++}matchesDelta(t,a){this.#e[this.#a].timestamp-this.#e[this.#a-t].timestamp<=a&&this.#r++}isPatternMatch(t,a){return this.#r===t?(F.log(`MATCH for: ${a}`),this.logEventMatch(),!0):!1}logEventMatch(){let t=[];for(let a=0;a<this.#e.length;a++){let o={eventSource:F.getKeyForValue(c,this.#e[a].eventSource),eventType:F.getKeyForValue(p,this.#e[a].eventType),uId:this.#e[a].uId,timestamp:this.#e[a].timestamp};t.push(o)}F.log(t)}},z=class extends j{doubleClicked(t,a,o){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,o)),this.isPatternMatch(3,`${F.getKeyForValue(c,t)} Double Clicked`)}},Q=class extends j{scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,c.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,c.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,c.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,c.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,c.ULTRAFUNK,p.CROSSFADE_START,null),this.matchesEvent(1,c.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(0,c.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var he={};Pt(he,{getStatus:()=>le,init:()=>oa,nextTrack:()=>be,pause:()=>dt,play:()=>_,prevTrack:()=>yt,setVolume:()=>ua,toggleMute:()=>gt,togglePlayPause:()=>pt});var ke=class extends Be{#e=null;#t=null;#r(t,a=0){let o=Math.round(t/1e3);w(t,o,a),o>0&&a>0&&(super.updateOncePerSecond(o,a),this.#s(o,a))}#a(){return l.playback.autoplay&&l.gallery.autoCrossfade}#s(t,a){l.playback.masterMute===!1&&this.#a()&&a-t===l.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&this.#e.getCurrentTrackNum()+1<=this.#e.getNumTracks()&&this.#t(J.AUTO,{name:"Auto Crossfade",length:l.gallery.autoCrossfadeLength,curve:l.gallery.autoCrossfadeCurve})}init(t,a){super.init(),this.#e=t,this.#t=a}updateTimer(){(this.isVisible||this.#a())&&this.#e.current.getPosition((t,a)=>this.#r(t,a))}updateVolumeMute(){this.#e.crossfade.isFading()===!1&&this.#e.current.getVolume(t=>Xe(Math.round(t),this.#e.current.isMuted()))}},P=new ke;var Lt=k("gallery-players"),Z=class extends de{constructor(t,a,o,d){super(h.YOUTUBE,t,a,o),this.setThumbnail(De(d)),this.setSourceUid(d)}pause(){this.embedded.pauseVideo()}stop(){this.embedded.stopVideo()}cueTrackById(t=0){this.embedded.cueVideoById(this.getSourceUid(),t),this.setIsCued(!0)}playTrackById(t=0){this.embedded.loadVideoById(this.getSourceUid(),t)}play(t){this.isPlayable()?this.embedded.playVideo():t(this,this.embedded.getVideoUrl())}getVolume(t){t(this.embedded.getVolume())}mute(t){t?this.embedded.mute():this.embedded.unMute()}isMuted(){return this.embedded.isMuted()}getPosition(t){t(this.embedded.getCurrentTime()*1e3,this.duration)}},ee=class extends de{#e=xe.MAX;#t=!1;constructor(t,a,o){super(h.SOUNDCLOUD,t,a,o)}setThumbnail(t){this.embedded.getCurrentSound(a=>{super.setThumbnail(Ne(a)),t?.setAttribute("data-track-thumbnail-url",this.getThumbnailSrc())})}cueTrackById(t=0){this.seekTo(t),this.setIsCued(!0)}playTrackById(t=0,a=null){this.seekTo(t),this.play(a),this.setIsCued(!1)}pause(){this.embedded.pause()}play(t){this.isPlayable()?this.embedded.getCurrentSound(a=>{a.playable===!0?this.embedded.play():t(this,a.permalink_url)}):t(this,"https://soundcloud.com")}stop(){this.pause(),super.seekTo(0)}seekTo(t){super.seekTo(t*1e3)}getVolume(t){this.#t===!1&&this.embedded.getVolume(a=>t(a))}setVolume(t){t!==0&&(this.#e=t),(this.#t===!1||t===0)&&super.setVolume(t)}mute(t){this.#t=!!t,t?this.setVolume(0):this.setVolume(this.#e)}isMuted(){return this.#t}getPosition(t){this.embedded.getPosition(a=>t(a,this.duration))}},te=class{indexMap=new Map;crossfade=null;#e=[];#t=0;constructor(){this.crossfade=Ke(this),u(s.MEDIA_PLAYING,()=>this.crossfade.start()),u(s.MEDIA_PAUSED,()=>this.crossfade.stop())}get current(){return this.#e[this.#t]}get next(){return this.#e[this.#t+1]}setPlayerIndex(t){this.#t=t}getTrackType(){return this.current.getTrackType()}getNumTracks(){return this.#e.length}getCurrentTrackNum(){return this.#t+1}playerFromIframeId(t){return this.#e[this.indexMap.get(t)]}trackNumFromIframeId(t){return this.indexMap.get(t)+1}isCurrent(t){return t===this.current.getIframeId()}add(t){Lt.log(t),this.#e.push(t),this.indexMap.set(t.getIframeId(),this.#e.length-1)}stop(){this.current.stop(),this.crossfade.stop()}mute(){this.current.mute(l.playback.masterMute),this.crossfade.mute(l.playback.masterMute)}getTrackData(t=0){return{currentTrack:this.getCurrentTrackNum(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),position:t,duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}prevTrack(){return this.#t>0?(this.#t--,!0):!1}nextTrack(){return this.#t++,this.#t<this.getNumTracks()}gotoTrackNum(t){return t>0&&t<=this.getNumTracks()?(this.#t=t-1,!0):!1}};var E=k("embedded-players"),v=new Q(10),n={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},vt={maxPlaybackStartDelay:3};function tt(e,t,a){n.players=e,n.playbackState=t,n.embeddedEvent=a,n.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),It(),xt()}function ae(){return{loadingPercent:100*(n.loadEventsCount++/n.loadEventsTotal)}}function at(){n.loadEventsCount>=n.loadEventsTotal?n.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):g(s.PLAYBACK_LOADING,ae())}function Dt(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=Ie(t),o=t.querySelector("iframe"),d=null;if(a===h.YOUTUBE)e.length===1&&o===null?d=et("youtube-player",t,!0):d=et(o.id,t,!1),d.setDuration(parseInt(t.getAttribute("data-track-duration")));else if(a===h.SOUNDCLOUD){let y=SC.Widget(o.id);d=new ee(t.id,o.id,y),y.bind(SC.Widget.Events.READY,()=>Kt(o.id,t,d,y)),y.bind(SC.Widget.Events.PLAY,()=>$t(o.id)),y.bind(SC.Widget.Events.PAUSE,()=>Ft(o.id)),y.bind(SC.Widget.Events.FINISH,()=>Gt(o.id)),y.bind(SC.Widget.Events.ERROR,()=>Wt(o.id))}d!==null&&(d.setArtistAndTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),n.players.add(d))})}function et(e,t,a=!1){let o=t.getAttribute("data-track-source-uid"),d=new YT.Player(e,{events:{onReady:y=>Ut(y,e),onStateChange:y=>Ot(y,e),onError:y=>Bt(y,e),onAutoplayBlocked:()=>n.embeddedEvent(s.AUTOPLAY_BLOCKED)},playerVars:{disablekb:1},...a&&{videoId:o}});return new Z(t.id,e,d,o)}function re(e,t){E.log("onPlayerError()"),E.log(e);let a=e.getTrackType()===h.YOUTUBE?c.YOUTUBE:c.SOUNDCLOUD;n.players.isCurrent(e.getIframeId())===!1&&n.players.stop(),v.add(a,p.PLAYER_ERROR,e.getIframeId()),n.embeddedEvent(s.MEDIA_UNAVAILABLE,Nt(e,t))}function Nt(e,t){let a=e.getArtist()||"N/A",o=e.getTitle()||"N/A";return{currentTrack:n.players.trackNumFromIframeId(e.getIframeId()),numTracks:n.players.getNumTracks(),trackId:e.getTrackId(),trackType:e.getTrackType(),mediaTitle:`${a} - ${o}`,mediaUrl:t}}function It(){E.log("initYouTubeAPI()"),g(s.PLAYBACK_LOADING,ae()),window.onYouTubeIframeAPIReady=()=>{E.log("onYouTubeIframeAPIReady()"),g(s.PLAYBACK_LOADING,ae()),Dt()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Ut(e,t){let a=n.players.playerFromIframeId(t);e.target.getPlayerState()===-1?(E.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${a.getSourceUid()} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):E.log(`onYouTubePlayerReady(): ${t} => ${a.getSourceUid()} => ${a.getArtist()} - ${a.getTitle()}`),at()}function Ot(e,t){switch(v.add(c.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:Rt(t);break;case YT.PlayerState.BUFFERING:Mt(t);break;case YT.PlayerState.PLAYING:_t(t);break;case YT.PlayerState.PAUSED:Yt(t);break;case YT.PlayerState.CUED:Vt(t);break;case YT.PlayerState.ENDED:wt(t);break}}function Rt(e){E.log(`onYouTubePlayerStateChange: UNSTARTED (iframeId: ${e})`)}function Mt(e){if(E.log(`onYouTubePlayerStateChange: BUFFERING (iframeId: ${e})`),n.players.crossfade.isFading()===!1){let t=n.players.playerFromIframeId(e);t.mute(l.playback.masterMute),t.setVolume(l.playback.masterVolume),g(s.MEDIA_LOADING)}}function _t(e){E.log(`onYouTubePlayerStateChange: PLAYING   (iframeId: ${e})`),n.playbackState.sync(e,n.playbackState.STATE.PLAY),P.start()}function Yt(e){E.log(`onYouTubePlayerStateChange: PAUSED    (iframeId: ${e})`),n.players.isCurrent(e)?(n.playbackState.sync(e,n.playbackState.STATE.PAUSE),P.stop()):n.players.crossfade.stop()}function Vt(e){E.log(`onYouTubePlayerStateChange: CUED      (iframeId: ${e})`)}function wt(e){E.log(`onYouTubePlayerStateChange: ENDED     (iframeId: ${e})`),n.players.isCurrent(e)?(P.stop(),n.embeddedEvent(s.MEDIA_ENDED)):n.players.crossfade.stop()}function Bt(e,t){let a=n.players.playerFromIframeId(t);E.log(`onYouTubePlayerError(${e.data!==null?e.data:"null"}) - iframeId: ${t} - isCued: ${a.isCued()} - isPlayable: ${a.isPlayable()}`),e.data!==null&&a.isCued()?(a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(a.setIsPlayable(!1),re(a,e.target.getVideoUrl()))}function xt(){E.log("initSoundCloudAPI()"),g(s.PLAYBACK_LOADING,ae())}function Kt(e,t,a,o){E.log(`onSoundCloudPlayerEventReady(): ${e} => ${a.getArtist()} - ${a.getTitle()}`),a.setThumbnail(t),o.getDuration(d=>{a.setDuration(Math.round(d/1e3)),t.setAttribute("data-track-duration",a.getDuration()),at()})}function $t(e){E.log(`onSoundCloudPlayerEvent: PLAY   (iframeId: ${e})`),v.add(c.SOUNDCLOUD,p.STATE_PLAYING,e),n.players.crossfade.isFading()&&n.players.isCurrent(e)?v.scPlayDoubleTrigger(e,vt.maxPlaybackStartDelay*1e3)&&n.playbackState.sync(e,n.playbackState.STATE.PLAY):(n.playbackState.sync(e,n.playbackState.STATE.PLAY),n.players.current.mute(l.playback.masterMute),n.players.current.setVolume(l.playback.masterVolume)),P.start()}function Ft(e){E.log(`onSoundCloudPlayerEvent: PAUSE  (iframeId: ${e})`),v.add(c.SOUNDCLOUD,p.STATE_PAUSED,e),v.scAutoplayBlocked(e,3e3)?(P.stop(),n.embeddedEvent(s.AUTOPLAY_BLOCKED)):v.scWidgetPlayBlocked(e,3e4)?(P.stop(),n.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:n.players.trackNumFromIframeId(e),numTracks:n.players.getNumTracks()})):n.players.isCurrent(e)?n.players.current.getPosition(t=>{t>0&&(n.playbackState.sync(e,n.playbackState.STATE.PAUSE),P.stop())}):n.players.crossfade.stop()}function Gt(e){E.log(`onSoundCloudPlayerEvent: FINISH (iframeId: ${e})`),n.players.isCurrent(e)?(P.stop(),n.embeddedEvent(s.MEDIA_ENDED)):n.players.crossfade.stop()}function Wt(e){let t=n.players.playerFromIframeId(e);E.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${t.getIframeId()} => ${t.getArtist()} - "${t.getTitle()}"`),t.setIsPlayable(!1)}var C=k("gallery-events"),se={snackbarId:0,nowPlayingIcons:null},me={nowPlayingIconsSelector:"h2.track-artist-title"};function rt(){C.log("init()"),se.nowPlayingIcons=document.querySelectorAll(me.nowPlayingIconsSelector),u(s.MEDIA_PLAYING,Xt),u(s.MEDIA_PAUSED,Ht),u(s.MEDIA_ENDED,Jt),u(s.MEDIA_CUE_TRACK,jt),u(s.CONTINUE_AUTOPLAY,zt),u(s.RESUME_AUTOPLAY,Qt),u(s.AUTOPLAY_BLOCKED,Zt),u(s.PLAYBACK_BLOCKED,ea),u(s.MEDIA_UNAVAILABLE,ta)}function Xt(e){if(C.log(e),Le(se.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${me.nowPlayingIconsSelector}`);st(t),N(t,"playing-paused","now-playing-icon"),l.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function Ht(e){C.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${me.nowPlayingIconsSelector}`).classList.add("playing-paused")}function Jt(e){C.log(e),e!==null&&e.data.numTracks>1&&st()}function jt(e){C.log(e),e.data.scrollToMedia&&O(e.data.trackId)}function zt(e){C.log(e),K()&&e.data.trackType===h.YOUTUBE?$(A.NEXT,!0):x(m.nextPage,!0)}function Qt(e){let t=JSON.parse(sessionStorage.getItem(ce.UF_AUTOPLAY));if(sessionStorage.removeItem(ce.UF_AUTOPLAY),C.log(e),C.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id??null;a===null&&t.trackId!==null?b({message:"Unable to cue track (not found)",duration:5}):e.callback.resumeAutoplay(t,a)}else e.callback.resumeAutoplay()}function Zt(e){C.log(e),se.snackbarId=b({message:"Autoplay blocked, Play to continue",duration:0,actionText:"play",actionClickCallback:()=>e.callback.play()})}function ea(e){C.log(e),b({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>nt(e)})}function ta(e){C.log(e),b({message:"Unable to play track, skipping to next",duration:5,actionText:"Stop",afterCloseCallback:()=>nt(e)})}function st(e){se.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function nt(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):K()&&e.data.trackType===h.YOUTUBE?$(A.NEXT,l.playback.autoplay):m.nextPage!==null&&x(m.nextPage,!0)}var ot=k("gallery-controls"),ne={uiElements:null,players:{}},S={},I={crossfadePresetSelector:"button.crossfade-preset-toggle",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:"button.crossfade-fadeto-button"};function it(e,t){ot.log("init()"),ne.players=e,ne.uiElements=new Te("div.track-meta",!0),S.crossfadePreset=pe(I.crossfadePresetSelector),S.crossfadeTo=pe(I.crossfadeToSelector),S.crossfadePreset.length>1&&S.crossfadeTo.length>1&&(S.crossfadePreset.forEach(a=>ct(a,l.gallery.trackCrossfadeDefPreset)),S.crossfadeTo.clickCallback=t),u(s.PLAYBACK_READY,ra)}function ra(){S.crossfadePreset.length>1&&S.crossfadeTo.length>1&&(S.crossfadePreset.forEach(e=>{e.addEventListener("click",sa),N(e,T.DISABLED.CLASS,T.ENABLED.CLASS)}),S.crossfadeTo.forEach(e=>e.addEventListener("click",na)),u(s.MEDIA_PLAYING,lt),u(s.MEDIA_PAUSED,lt))}var Te=class extends B{elementClicked(){if(this.clicked("button.track-share-button"))return X(this.closest("single-track, gallery-track"));if(this.clicked("button.track-details-button"))return H(this.closest("single-track, gallery-track"));if(this.clicked("span.track-artists-links"))return ue(this.event);if(this.clicked("span.track-channels-links"))return ue(this.event)}};function ct(e,t){e.setAttribute(I.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${G.crossfade[t].name}`}function sa(e){let t=parseInt(e.target.getAttribute(I.crossfadePresetData));ct(e.target,t+1<G.crossfade.length?t+1:0)}function na(e){if(L()&&ne.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),o=parseInt(t.querySelector(I.crossfadePresetSelector).getAttribute(I.crossfadePresetData));N(t.querySelector(I.crossfadeToSelector),T.ENABLED.CLASS,T.DISABLED.CLASS),S.crossfadeTo.clickCallback(a.id,G.crossfade[o])}}}function lt(){let e=L(),t=e?ne.players.getTrackData().currentTrack:-1;ot.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),S.crossfadeTo.forEach((a,o)=>{t===o+1?N(a,e?T.ENABLED.CLASS:T.DISABLED.CLASS,e?T.DISABLED.CLASS:T.ENABLED.CLASS):N(a,e?T.DISABLED.CLASS:T.ENABLED.CLASS,e?T.ENABLED.CLASS:T.DISABLED.CLASS)})}var f=k("gallery-playback"),r={eventLog:null,players:{}},ut={minCrossfadeToTime:5,maxBufferingDelay:3};function oa(){f.log("init()"),r.eventLog=v,rt(),r.players=new te,Re(e=>r.players.getTrackData(e),ca),it(r.players,Ea),P.init(r.players,Et),tt(r.players,fa,ka)}function _(){Ye(),r.players.current.play(re)}function dt(){W(),r.players.current.pause()}function pt(){L()?dt():_()}function yt(){f.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrackNum()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrackNum()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),w(0,0,r.players.current.getDuration())):(r.players.getCurrentTrackNum()>1&&r.players.stop(),r.players.prevTrack()?M(L()):g(s.MEDIA_PREV_TRACK))})}function be(e=!1){let t=r.players.getCurrentTrackNum()+1>r.players.getNumTracks();f.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${l.playback.autoplay}`),!ia(e,t)&&(t===!1?(r.players.stop(),e&&l.playback.autoplay===!1?W():r.players.nextTrack()&&M(L())):t===!0&&e===!1?g(s.MEDIA_NEXT_TRACK):e&&(W(),l.playback.autoplay?g(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function ia(e,t){if(e&&l.playback.autoplay){let a=Ve();if(f.log(`repeatPlayback(): ${f.getKeyForValue(q,a)}`),a===q.ONE)return r.players.current.seekTo(0),_(),!0;if(t&&a===q.ALL)return r.players.stop(),r.players.setPlayerIndex(0),M(!0),!0}return!1}function ca(e){r.players.current.seekTo(e)}function ua(){r.players.current.setVolume(l.playback.masterVolume)}function gt(){l.playback.masterMute=l.playback.masterMute!==!0,r.players.mute()}function da(e,t,a=!0){f.log(`cueOrPlayTrackById() - iframeId: ${e} - autoplay: ${t.autoplay} - position: ${t.position}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),g(s.MEDIA_CUE_TRACK,{scrollToMedia:a,trackId:r.players.current.getTrackId()}),t.autoplay?r.players.current.playTrackById(t.position,re):(r.players.current.cueTrackById(t.position),t.position!==0&&w(t.position*1e3,t.position,r.players.current.getDuration())),U(t.position)}function M(e,t=!0){g(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&_(),U()}function pa(e,t=!0){f.log(`skipToTrack() - trackNum: ${e} - playMedia: ${t}`),t===!0&&L()===!1&&(r.eventLog.add(c.ULTRAFUNK,p.RESUME_AUTOPLAY),r.players.gotoTrackNum(e)&&M(t))}function ya(e=null,t=null){e!==null&&t!==null?da(t,e):e!==null&&e.autoplay?(f.log("resumeAutoplay(): Play first track"),r.eventLog.add(c.ULTRAFUNK,p.RESUME_AUTOPLAY),_()):(f.log("resumeAutoplay(): Cue first track"),U())}function ga(e,t,a=!1){f.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setSourceUid(t.uid),r.players.current.setArtistAndTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),_e(0),U(),a?r.players.current.playTrackById():r.players.current.cueTrackById()}function le(e=!1){let t={isPlaying:L(),currentTrack:r.players.getCurrentTrackNum(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),trackElementId:r.players.current.getTrackId(),playerId:r.players.current.getIframeId()};return e?new Promise(a=>{r.players.current.getPosition(o=>{t.position=Math.round(o/1e3),a(t)})}):t}function Ea(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(f.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getIframeId()})
      fadeIn.: ${r.players.playerFromIframeId(e).getArtist()} - "${r.players.playerFromIframeId(e).getTitle()}" (${e})`),l.playback.masterMute===!1&&l.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=ut.minCrossfadeToTime+ut.maxBufferingDelay&&Et(J.TRACK,t,e)}))}function Et(e,t,a=null){r.eventLog.add(c.ULTRAFUNK,p.CROSSFADE_START),r.players.crossfade.init(e,t,a)&&(a===null?r.players.nextTrack()&&M(!0):r.players.gotoTrackNum(r.players.trackNumFromIframeId(a))&&M(!0,!1))}function ka(e,t=null){switch(f.log(`embeddedEventHandler() - event: ${f.getKeyForValue(s,e)}`),t!==null&&f.log(t),e){case s.MEDIA_ENDED:g(s.MEDIA_ENDED,le()),be(!0);break;case s.PLAYBACK_READY:Me(yt,pt,be,gt),Ze(ga),g(s.PLAYBACK_READY,t),g(s.RESUME_AUTOPLAY,null,{resumeAutoplay:ya});break;case s.AUTOPLAY_BLOCKED:g(s.AUTOPLAY_BLOCKED,null,{play:_});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:g(e,t,{skipToTrack:pa});break}}var fa=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(o,d){f.log(`playbackState.sync() - previousTrack: ${r.players.getCurrentTrackNum()} - nextTrack: ${r.players.indexMap.get(o)+1} - syncState: ${f.getKeyForValue(e,d)}`),r.players.isCurrent(o)?d===e.PLAY?g(s.MEDIA_PLAYING,le()):d===e.PAUSE&&g(s.MEDIA_PAUSED,le()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(o)),U(),a(o,d))}}})();var ie=k("screen-wakelock"),oe={wakeLock:null};function kt(){l.mobile.keepScreenOn&&document.addEventListener("click",ft)}function ft(){ie.log("enableScreenWakeLock()"),document.removeEventListener("click",ft),Ta(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&l.mobile.keepScreenOn&&ma()})}function ma(){mt()&&oe.wakeLock===null&&Tt()}function mt(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function Ta(){mt()?document.visibilityState==="visible"&&await Tt()!==!0&&(ie.log("enableWakeLock(): Screen Wake Lock request failed"),b({message:"Keep Screen On failed",duration:5,actionText:"Disable",actionClickCallback:()=>l.mobile.keepScreenOn=!1})):(ie.log("enableWakeLock(): Screen Wake Lock is not supported"),b({message:"Keep Screen On is not supported",duration:5,actionText:"Disable",actionClickCallback:()=>l.mobile.keepScreenOn=!1}))}async function Tt(){try{return oe.wakeLock=await navigator.wakeLock.request("screen"),oe.wakeLock.addEventListener("release",()=>{oe.wakeLock=null}),!0}catch(e){ie.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var Y=k("playback-interaction"),bt=new z(10),i={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null,broadcastChannel:null};document.addEventListener("DOMContentLoaded",()=>{Pe(),Y.log("DOMContentLoaded"),Ce(),Fe()?i.player=he:Ge()&&(i.player=$e),i.player!==null&&ba(),ze(i.player?.getStatus)});function ba(){Y.log("initCommon()"),Oe(),ha(),i.player.init(),i.siteNavUiElements=new Ae("#site-navigation"),i.trackNavUiElements=new Se("nav.single-track-nav .nav-links"),R.init(),i.keyboardShortcuts=ve(l.playback.keyboardShortcuts),i.broadcastChannel=new BroadcastChannel("playbackStatus"),Aa(),kt()}function ha(){u(s.PLAYBACK_READY,va),u(s.MEDIA_PLAYING,()=>i.broadcastChannel.postMessage(s.MEDIA_PLAYING)),u(s.MEDIA_CUE_TRACK,At),u(s.MEDIA_ENDED,At),u(s.MEDIA_TIME_REMAINING,Da),u(s.MEDIA_PREV_TRACK,()=>D(null,A.PREV,m.prevPage)),u(s.MEDIA_NEXT_TRACK,()=>D(null,A.NEXT,m.nextPage))}function Aa(){V(".playback-shuffle-button span","click",qe),document.addEventListener("keydown",Sa),document.addEventListener("keydown",Pa),window.focus(),window.addEventListener("blur",()=>{setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&window.focus()},250)}),i.broadcastChannel.addEventListener("message",e=>{Y.log(`broadcastChannel('playbackStatus') message: ${e.data}`),e.data===s.MEDIA_PLAYING&&l.playback.pauseOnPlayerChange&&i.player.pause()})}function Sa(e){if(i.isPlaybackReady&&i.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":ht(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&ht(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),O(i.player.getStatus().trackElementId);break}switch(e.key){case" ":e.preventDefault(),i.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":He(e);break;case"ArrowLeft":Ca(e);break;case"ArrowRight":La(e);break;case"A":ge.toggle();break;case"f":case"F":e.preventDefault(),R.toggle(document.getElementById(i.player.getStatus().playerId));break;case"i":e.preventDefault(),H(document.getElementById(i.player.getStatus().trackElementId));break;case"I":e.preventDefault(),X(document.getElementById(i.player.getStatus().trackElementId));break;case"m":case"M":e.preventDefault(),i.player.toggleMute(),b({message:l.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",duration:3});break;case"O":document.getElementById("select-local-files")?.click();break;case"p":case"P":Je.toggle();break;case"r":case"R":b({message:`${we().title} (<b>r</b> to change)`,duration:3});break;case"x":case"X":je.toggle();break}}}}function Pa(e){if(i.isPlaybackReady&&i.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":Ue===!1&&(Y.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),i.player.togglePlayPause());break;case"MediaTrackPrevious":Y.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),i.player.prevTrack();break;case"MediaTrackNext":Y.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),i.player.nextTrack();break}}function Ca(e){e.preventDefault(),e.shiftKey===!0?D(null,A.PREV,m.prevPage):i.player.prevTrack()}function La(e){e.preventDefault(),e.shiftKey===!0?D(null,A.NEXT,m.nextPage):i.player.nextTrack()}function D(e,t,a){e?.preventDefault(),K()&&i.player.getStatus().trackType===h.YOUTUBE?Qe()===!1?$(t,i.player.getStatus().isPlaying):b({message:"Loading track, please wait...",duration:3}):St(null,a)}function ht(e){e.preventDefault(),l.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?l.playback.masterVolume<100?l.playback.masterVolume+5:100:l.playback.masterVolume>5?l.playback.masterVolume-5:5,i.player.setVolume()}function va(){V(".playback-thumbnail-control","click",Ia),V(".playback-details-control","click",Na),V(".playback-timer-control","click",Ua),i.isPlaybackReady=!0}function At(){let e=ye()&&i.player.getStatus().numTracks>1;(l.playback.autoExitFullscreen||e)&&R.exit()}function Da(e){let t=e.data.timeRemainingSeconds<=l.playback.timeRemainingSeconds;l.playback.autoExitFsOnWarning&&t&&R.exit()}function Na(){O(i.player.getStatus().trackElementId)}function Ia(){ye()?(bt.add(c.MOUSE,p.MOUSE_CLICK),bt.doubleClicked(c.MOUSE,p.MOUSE_CLICK,500)&&R.enter(document.getElementById(i.player.getStatus().playerId))):We()&&O(0)}function Ua(){ge.toggle()}var Ae=class extends B{elementClicked(){if(this.clicked("a.navbar-prev-link"))return D(this.event,A.PREV,m.prevPage);if(this.clicked("a.navbar-next-link"))return D(this.event,A.NEXT,m.nextPage)}},Se=class extends B{elementClicked(){if(this.clicked("div.nav-previous a"))return D(this.event,A.PREV,m.prevPage);if(this.clicked("div.nav-next a"))return D(this.event,A.NEXT,m.nextPage)}};function St(e,t){e?.preventDefault(),x(t,i.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
