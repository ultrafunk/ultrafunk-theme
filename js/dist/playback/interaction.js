import{$ as St,$a as ie,A as Tt,Aa as Ce,Ba as Nt,C as P,Ca as Rt,Da as Xe,E as ke,Ea as Yt,F as fe,Fa as X,G as kt,Ga as Ot,H as D,Ha as _t,I as ft,Ia as J,J as We,Ja as Mt,K as mt,Ka as Vt,L as bt,La as Bt,Ma as wt,N as At,O as le,Oa as xt,Pa as Je,Qa as Kt,Ra as j,S as Pt,Sa as Le,T as H,Ta as x,Ua as $t,Va as ae,Wa as Ft,Xa as Gt,Ya as je,Za as Wt,_a as U,a as gt,ab as qt,b as Fe,bb as Ht,c as d,ca as qe,cb as ce,d as S,db as Xt,e as C,ea as me,f as Ge,fa as Ct,g as q,ga as s,h as ge,ha as E,i as A,ia as y,j as Ee,ja as f,k as Et,ka as He,la as Lt,ma as be,na as Ae,oa as ht,p as Te,pa as K,q as ee,qa as I,ra as m,sa as vt,ta as te,ua as Pe,va as w,wa as Se,xa as Dt,y as L,ya as It,z as l,za as Ut}from"../chunk-CYQR7GTC.js";var ze=A("eventlogger"),u={UNKNOWN:1e3,KEYBOARD:100,MOUSE:110,YOUTUBE:1,SOUNDCLOUD:2,ULTRAFUNK:50},p={UNKNOWN:-2e3,KEY_ARROW_LEFT:180,KEY_ARROW_RIGHT:181,MOUSE_CLICK:182,STATE_ERROR:-5,STATE_UNSTARTED:-1,STATE_ENDED:0,STATE_PLAYING:1,STATE_PAUSED:2,STATE_BUFFERING:3,STATE_CUED:5,RESUME_AUTOPLAY:50,PLAYER_ERROR:60,CROSSFADE_START:70,CUE_PLAY_SINGLE_TRACK:80},_a={eventSource:u.UNKNOWN,eventType:p.UNKNOWN,uId:null,timeStamp:0},h,ue,z,M,he=class{constructor(t=10){S(this,h,[]);S(this,ue,0);S(this,z,0);S(this,M,0);C(this,ue,t)}add(t,a,o=null,c=Date.now()){let k=Object.create(_a);k.eventSource=t,k.eventType=a,k.uId=o,k.timeStamp=c,d(this,h).length<d(this,ue)?d(this,h).push(k):(d(this,h).shift(),d(this,h).push(k))}clear(){C(this,h,[])}getLastPos(){return d(this,M)}initMatch(){C(this,M,d(this,h).length-1),C(this,z,0)}matchesEvent(t,a,o,c=null){d(this,h)[d(this,M)-t].eventSource===a&&d(this,h)[d(this,M)-t].eventType===o&&d(this,h)[d(this,M)-t].uId===c&&Ge(this,z)._++}matchesDelta(t,a){d(this,h)[d(this,M)].timeStamp-d(this,h)[d(this,M)-t].timeStamp<=a&&Ge(this,z)._++}isPatternMatch(t,a){return d(this,z)===t?(ze.log(`MATCH for: ${a}`),ze.logEventLog(d(this,h),u,p),!0):!1}};h=new WeakMap,ue=new WeakMap,z=new WeakMap,M=new WeakMap;var ve=class extends he{doubleClicked(t,a,o){return this.initMatch(),this.getLastPos()>=1&&(this.matchesEvent(1,t,a),this.matchesEvent(0,t,a),this.matchesDelta(1,o)),this.isPatternMatch(3,`${ze.getKeyForValue(u,t)} Double Clicked`)}},re=class extends he{ytAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesEvent(1,u.YOUTUBE,p.STATE_BUFFERING,t),this.matchesEvent(0,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Autoplay Blocked")}ytSingleTrackAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.CUE_PLAY_SINGLE_TRACK,null),this.matchesEvent(2,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(1,u.YOUTUBE,p.STATE_BUFFERING,t),this.matchesEvent(0,u.YOUTUBE,p.STATE_UNSTARTED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"YouTube Single Track Autoplay Blocked")}scAutoplayBlocked(t,a){return this.initMatch(),this.getLastPos()>=3&&(this.matchesEvent(3,u.ULTRAFUNK,p.RESUME_AUTOPLAY,null),this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(3,a)),this.isPatternMatch(5,"SoundCloud Autoplay Blocked")}scWidgetPlayBlocked(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PAUSED,t),this.matchesDelta(2,a)),this.isPatternMatch(4,"SoundCloud WidgetPlay Blocked")}scPlayDoubleTrigger(t,a){return this.initMatch(),this.getLastPos()>=2&&(this.matchesEvent(2,u.ULTRAFUNK,p.CROSSFADE_START,null),this.matchesEvent(1,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesEvent(0,u.SOUNDCLOUD,p.STATE_PLAYING,t),this.matchesDelta(1,a)),this.isPatternMatch(4,"SoundCloud Play Double Trigger")}};var st={};gt(st,{getStatus:()=>Ve,init:()=>fr,nextTrack:()=>rt,prevTrack:()=>ca,setVolume:()=>Ar,toggleMute:()=>ua,togglePlayPause:()=>Me});var Q,se,oe=class{constructor(){S(this,Q,-1);S(this,se,0);Fe(this,"isVisible",!0);Fe(this,"config",{updateTimerInterval:250,maxBufferingDelay:3})}init(){document.addEventListener("visibilitychange",()=>{this.isVisible=document.visibilityState==="visible"})}updateTimer(){}updateVolumeMute(){}start(){this.stop(),C(this,Q,setInterval(()=>this.updateTimer(),this.config.updateTimerInterval))}stop(){d(this,Q)!==-1&&(clearInterval(d(this,Q)),C(this,Q,-1)),C(this,se,0),Pe(!1)}updateOncePerSecond(t,a){if(d(this,se)!==t&&(C(this,se,t),this.updateVolumeMute(),l.playback.autoplay===!1&&l.playback.timeRemainingWarning)){let o=a-t;o<=l.playback.timeRemainingSeconds?(Pe(!0),y(s.MEDIA_TIME_REMAINING,{timeRemainingSeconds:o})):Pe(!1)}}};Q=new WeakMap,se=new WeakMap;var V,de,Ie,Jt,pe,Ze,Ue,jt,et=class extends oe{constructor(){super(...arguments);S(this,Ie);S(this,pe);S(this,Ue);S(this,V,null);S(this,de,null)}init(a,o){super.init(),C(this,V,a),C(this,de,o)}updateTimer(){(this.isVisible||q(this,pe,Ze).call(this))&&d(this,V).current.getPosition((a,o)=>q(this,Ie,Jt).call(this,a,o))}updateVolumeMute(){d(this,V).crossfade.isFading()===!1&&d(this,V).current.getVolume(a=>Le(Math.round(a),d(this,V).current.isMuted()))}},Qe=et;V=new WeakMap,de=new WeakMap,Ie=new WeakSet,Jt=function(a,o=0){let c=Math.round(a/1e3);K(a,c,o),c>0&&o>0&&(ge(et.prototype,this,"updateOncePerSecond").call(this,c,o),q(this,Ue,jt).call(this,c,o))},pe=new WeakSet,Ze=function(){return l.playback.autoplay&&l.gallery.autoCrossfade},Ue=new WeakSet,jt=function(a,o){l.playback.masterMute===!1&&q(this,pe,Ze).call(this)&&o-a===l.gallery.autoCrossfadeLength+this.config.maxBufferingDelay&&d(this,V).getCurrentTrack()+1<=d(this,V).getNumTracks()&&d(this,de).call(this,fe.AUTO,{name:"Auto Crossfade",length:l.gallery.autoCrossfadeLength,curve:l.gallery.autoCrossfadeCurve})};var Y=new Qe;var b=A("embedded-players"),O=new re(10),i={players:{},playbackState:null,embeddedEvent:null,loadEventsTotal:0,loadEventsCount:1},Va={maxPlaybackStartDelay:3};function Qt(e,t,a){i.players=e,i.playbackState=t,i.embeddedEvent=a,i.loadEventsTotal=3+parseInt(document.body.getAttribute("data-gallery-track-count")),xa(),ja()}function Ne(){return{loadingPercent:100*(i.loadEventsCount++/i.loadEventsTotal)}}function Zt(){i.loadEventsCount>=i.loadEventsTotal?i.embeddedEvent(s.PLAYBACK_READY,{resetProgressBar:!0}):y(s.PLAYBACK_LOADING,Ne())}function Ba(){let e=document.querySelectorAll("single-track, gallery-track");e.forEach(t=>{let a=parseInt(t.getAttribute("data-track-type")),o=t.querySelector("iframe"),c=null;if(a===D.YOUTUBE)e.length===1&&o===null?c=zt("youtube-player",t,!0):c=zt(o.id,t,!1);else if(a===D.SOUNDCLOUD){let k=SC.Widget(o.id);c=new mt(t.id,o.id,k,o.src),k.bind(SC.Widget.Events.READY,()=>{c.setThumbnail(t),k.getDuration(B=>{c.setDuration(Math.round(B/1e3)),t.setAttribute("data-track-duration",c.getDuration())}),za(c,o.id)}),k.bind(SC.Widget.Events.PLAY,Qa),k.bind(SC.Widget.Events.PAUSE,Za),k.bind(SC.Widget.Events.FINISH,er),k.bind(SC.Widget.Events.ERROR,tr)}c!==null&&(c.setArtistTitle(t.getAttribute("data-track-artist"),t.getAttribute("data-track-title")),i.players.add(c))})}function zt(e,t,a=!1){let o=t.getAttribute("data-track-source-uid"),c=new YT.Player(e,{events:{onReady:B=>Ka(B,e),onStateChange:B=>$a(B,e),onError:B=>Ja(B,e)},...a&&{videoId:o}}),k=null;return a?k=new We(t.id,e,c,o):k=new ft(t.id,e,c,o),k.setDuration(parseInt(t.getAttribute("data-track-duration"))),k}function Ye(e,t){b.log("onPlayerError()"),b.log(e);let a=e.getTrackType()===D.YOUTUBE?u.YOUTUBE:u.SOUNDCLOUD;i.players.isCurrent(e.getUid())===!1&&i.players.stop(),O.add(a,p.PLAYER_ERROR,e.getUid()),i.embeddedEvent(s.MEDIA_UNAVAILABLE,wa(e,t))}function wa(e,t){let a=e.getArtist()||"N/A",o=e.getTitle()||"N/A";return{currentTrack:i.players.trackFromUid(e.getUid()),numTracks:i.players.getNumTracks(),trackId:e.getTrackId(),mediaTitle:`${a} - ${o}`,mediaUrl:t}}function xa(){b.log("initYouTubeAPI()"),y(s.PLAYBACK_LOADING,Ne()),window.onYouTubeIframeAPIReady=function(){b.log("onYouTubeIframeAPIReady()"),y(s.PLAYBACK_LOADING,Ne()),Ba()};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Ka(e,t){let a=i.players.playerFromUid(t);e.target.getPlayerState()===-1?(b.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - "${a.getTitle()}"`),a.setIsPlayable(!1)):b.log(`onYouTubePlayerReady(): ${t} => ${e.target.getVideoData().video_id} => ${a.getArtist()} - ${a.getTitle()}`),Zt()}function $a(e,t){switch(O.add(u.YOUTUBE,e.data,t),e.data){case YT.PlayerState.UNSTARTED:Fa(t);break;case YT.PlayerState.BUFFERING:Ga(t);break;case YT.PlayerState.PLAYING:Wa(t);break;case YT.PlayerState.PAUSED:qa(t);break;case YT.PlayerState.CUED:Ha(t);break;case YT.PlayerState.ENDED:Xa(t);break}}function Fa(e){b.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${e})`),(O.ytAutoplayBlocked(e,3e3)||O.ytSingleTrackAutoplayBlocked(e,3e3))&&i.embeddedEvent(s.AUTOPLAY_BLOCKED)}function Ga(e){if(b.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${e})`),i.players.crossfade.isFading()===!1){let t=i.players.playerFromUid(e);t.mute(l.playback.masterMute),t.setVolume(l.playback.masterVolume),y(s.MEDIA_LOADING)}}function Wa(e){b.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${e})`),i.playbackState.sync(e,i.playbackState.STATE.PLAY),Y.start()}function qa(e){b.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${e})`),i.players.isCurrent(e)?(i.playbackState.sync(e,i.playbackState.STATE.PAUSE),Y.stop()):i.players.crossfade.stop()}function Ha(e){b.log(`onYouTubePlayerStateChange: CUED      (uID: ${e})`)}function Xa(e){b.log(`onYouTubePlayerStateChange: ENDED     (uID: ${e})`),i.players.isCurrent(e)?(Y.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function Ja(e,t){let a=i.players.playerFromUid(t);e.data===150&&a instanceof We&&a.isCued()?(b.log("onYouTubePlayerError(150) - SingleTrack.isCued(): true"),a.setIsCued(!1),a.setIsPlayable(!1)):e.data!==null&&a.isPlayable()&&(b.log("onYouTubePlayerError: "+e.data),a.setIsPlayable(!1),Ye(a,e.target.getVideoUrl()))}function ja(){b.log("initSoundCloudAPI()"),y(s.PLAYBACK_LOADING,Ne())}function za(e,t){b.log(`onSCPlayerEventReady(): ${t} => ${e.getUid()} => ${e.getArtist()} - ${e.getTitle()}`),Zt()}function Qa(e){b.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${e.soundId})`),O.add(u.SOUNDCLOUD,p.STATE_PLAYING,e.soundId),i.players.crossfade.isFading()&&i.players.isCurrent(e.soundId)?O.scPlayDoubleTrigger(e.soundId,Va.maxPlaybackStartDelay*1e3)&&i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY):(i.playbackState.sync(e.soundId,i.playbackState.STATE.PLAY),i.players.current.mute(l.playback.masterMute),i.players.current.setVolume(l.playback.masterVolume)),Y.start()}function Za(e){b.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${e.soundId})`),O.add(u.SOUNDCLOUD,p.STATE_PAUSED,e.soundId),O.scAutoplayBlocked(e.soundId,3e3)?(Y.stop(),i.embeddedEvent(s.AUTOPLAY_BLOCKED)):O.scWidgetPlayBlocked(e.soundId,3e4)?(Y.stop(),i.embeddedEvent(s.PLAYBACK_BLOCKED,{currentTrack:i.players.trackFromUid(e.soundId),numTracks:i.players.getNumTracks()})):i.players.isCurrent(e.soundId)?i.players.current.getPosition(t=>{t>0&&(i.playbackState.sync(e.soundId,i.playbackState.STATE.PAUSE),Y.stop())}):i.players.crossfade.stop()}function er(e){b.log(`onSoundCloudPlayerEvent: FINISH (uID: ${e.soundId})`),i.players.isCurrent(e.soundId)?(Y.stop(),i.embeddedEvent(s.MEDIA_ENDED)):i.players.crossfade.stop()}function tr(){this.getCurrentSound(e=>{let t=i.players.playerFromUid(e.id);b.log(`onSoundCloudPlayerEvent: ERROR for track: ${i.players.trackFromUid(e.id)}. ${t.getArtist()} - ${t.getTitle()} - [${t.getUid()} / ${t.getIframeId()}]`),t.setIsPlayable(!1)})}var _=A("gallery-events"),Oe={snackbarId:0,nowPlayingIcons:null},tt={nowPlayingIconsSelector:"h2.track-artist-title"};function ea(){_.log("init()"),Oe.nowPlayingIcons=document.querySelectorAll(tt.nowPlayingIconsSelector),E(s.MEDIA_PLAYING,rr),E(s.MEDIA_PAUSED,sr),E(s.MEDIA_ENDED,or),E(s.MEDIA_CUE_TRACK,nr),E(s.CONTINUE_AUTOPLAY,lr),E(s.RESUME_AUTOPLAY,ir),E(s.AUTOPLAY_BLOCKED,cr),E(s.PLAYBACK_BLOCKED,ur),E(s.MEDIA_UNAVAILABLE,dr)}function rr(e){if(_.log(e),ke(Oe.snackbarId),e.data.numTracks>1){let t=document.querySelector(`#${e.data.trackId} ${tt.nowPlayingIconsSelector}`);ta(t),H(t,"playing-paused","now-playing-icon"),l.gallery.animateNowPlayingIcon&&t.classList.add("playing-animate")}}function sr(e){_.log(e),e.data.numTracks>1&&document.querySelector(`#${e.data.trackId} ${tt.nowPlayingIconsSelector}`).classList.add("playing-paused")}function or(e){_.log(e),e!==null&&e.data.numTracks>1&&ta()}function nr(e){_.log(e),e.data.scrollToMedia&&x(e.data.trackId)}function lr(e){_.log(e),ie()&&e.data.trackType===D.YOUTUBE?ce(U.NEXT,!0):j(L.nextPage,!0)}function ir(e){let t=JSON.parse(sessionStorage.getItem(ee.UF_AUTOPLAY));if(sessionStorage.removeItem(ee.UF_AUTOPLAY),_.log(e),_.log(`RESUME_AUTOPLAY: ${t!==null?JSON.stringify(t):"NO"}`),t!==null){let a=document.getElementById(t.trackId)?.querySelector("iframe").id;e.callback.resumeAutoplay(t,a)}}function cr(e){_.log(e),Oe.snackbarId=P("Autoplay blocked, Play to continue",0,"play",()=>e.callback.togglePlayPause())}function ur(e){_.log(e),P("Unable to play track, skipping to next",5,"Stop",()=>{},()=>aa(e))}function dr(e){_.log(e),P("Unable to play track, skipping to next",5,"Stop",()=>{},()=>aa(e)),Ee("media_unavailable",e.data)}function ta(e){Oe.nowPlayingIcons.forEach(t=>{t!==e&&t.classList.remove("now-playing-icon","playing-animate","playing-paused")})}function aa(e){e.data.currentTrack<e.data.numTracks?e.callback.skipToTrack(e.data.currentTrack+1,!0):ie()?ce(U.NEXT,l.playback.autoplay):L.nextPage!==null&&j(L.nextPage,!0)}var at=A("crossfade-controls"),_e={players:{}},N={},Z={crossfadePresetSelector:".crossfade-preset-control",crossfadePresetData:"data-crossfade-preset",crossfadeToSelector:".crossfade-fadeto-control"};function sa(e,t){at.log("init()"),_e.players=e,N.crossfadePreset=He(Z.crossfadePresetSelector),N.crossfadeTo=He(Z.crossfadeToSelector),N.crossfadePreset.length>1&&N.crossfadeTo.length>1&&(N.crossfadePreset.forEach(a=>oa(a,l.gallery.trackCrossfadeDefPreset)),N.crossfadeTo.clickCallback=t),E(s.PLAYBACK_READY,yr)}function yr(){at.log("playbackReady()"),N.crossfadePreset.length>1&&N.crossfadeTo.length>1&&(N.crossfadePreset.forEach(e=>{e.addEventListener("click",gr),H(e,f.DISABLED.CLASS,f.ENABLED.CLASS)}),N.crossfadeTo.forEach(e=>e.addEventListener("click",Er)),E(s.MEDIA_PLAYING,ra),E(s.MEDIA_PAUSED,ra))}function oa(e,t){e.setAttribute(Z.crossfadePresetData,t),e.textContent=`${t+1}`,e.title=`Preset: ${Te.crossfade[t].name}`}function gr(e){let t=parseInt(e.target.getAttribute(Z.crossfadePresetData));oa(e.target,t+1<Te.crossfade.length?t+1:0)}function Er(e){if(m()&&_e.players.crossfade.isFading()===!1){let t=e.target.closest("gallery-track");if(t!==null){let a=t.querySelector("iframe"),o=parseInt(t.querySelector(Z.crossfadePresetSelector).getAttribute(Z.crossfadePresetData));H(t.querySelector(`div${Z.crossfadeToSelector}`),f.ENABLED.CLASS,f.DISABLED.CLASS),N.crossfadeTo.clickCallback(_e.players.uIdFromIframeId(a.id),Te.crossfade[o])}}}function ra(){let e=m(),t=e?_e.players.getTrackData().currentTrack:-1;at.log(`updateCrossfadeToState() - playingState: ${e} - currentTrack: ${t}`),N.crossfadeTo.forEach((a,o)=>{t===o+1?H(a,e?f.ENABLED.CLASS:f.DISABLED.CLASS,e?f.DISABLED.CLASS:f.ENABLED.CLASS):H(a,e?f.DISABLED.CLASS:f.ENABLED.CLASS,e?f.ENABLED.CLASS:f.DISABLED.CLASS)})}var na=A("gallery-players"),la=()=>{let e=null,t=null,a=[],o=new Map,c=0;return{indexMap:o,get crossfade(){return t},get current(){return a[c]},get next(){return a[c+1]},getPlayerIndex(){return c},setPlayerIndex(T){c=T},getTrackType(){return this.current.getTrackType()},getNumTracks(){return a.length},getCurrentTrack(){return c+1},playerFromUid(T){return a[o.get(T)]},trackFromUid(T){return o.get(T)+1},isCurrent(T){return T===this.current.getUid()},init:k,add:B,uIdFromIframeId:va,stop:Da,mute:Ia,getTrackData:Ua,prevTrack:Na,nextTrack:Ra,jumpToTrack:Ya};function k(T){na.log("init()"),e=T,t=kt(this),E(s.MEDIA_PLAYING,()=>t.start()),E(s.MEDIA_PAUSED,()=>t.stop())}function B(T){na.log(T),a.push(T),o.set(T.getUid(),a.length-1)}function va(T){return a.find($e=>$e.getIframeId()===T).getUid()}function Da(){this.current.stop(),t.stop()}function Ia(){this.current.mute(l.playback.masterMute),t.mute(l.playback.masterMute)}function Ua(){return{currentTrack:this.getCurrentTrack(),numTracks:this.getNumTracks(),artist:this.current.getArtist(),title:this.current.getTitle(),duration:this.current.getDuration(),thumbnail:{src:this.current.getThumbnailSrc(),class:this.current.getThumbnailClass()}}}function Na(T){return c>0?(c--,e(T),!0):!1}function Ra(T){return c++,c<this.getNumTracks()?(e(T),!0):!1}function Ya(T,$e,Oa=!0){return T>0&&T<=this.getNumTracks()?(c=T-1,e($e,Oa),!0):!1}};var v=A("gallery-playback"),r={eventLog:null,players:{}},ia={minCrossfadeToTime:5,maxBufferingDelay:3};function fr(){v.log("init()"),r.eventLog=O,ea(),r.players=la(),r.players.init(da),be(r.players,br),sa(r.players,Lr),Y.init(r.players,ya),Qt(r.players,vr,hr)}function Me(){m()?(te(),r.players.current.pause()):(vt(),r.players.current.play(Ye))}function ca(){v.log(`prevTrack() - prevTrack: ${r.players.getCurrentTrack()-1} - numTracks: ${r.players.getNumTracks()}`),r.players.getCurrentTrack()>0&&r.players.current.getPosition(e=>{e>5e3?(r.players.current.seekTo(0),K(0,0,r.players.current.getDuration())):(r.players.getCurrentTrack()>1&&r.players.stop(),r.players.prevTrack(m())?I():y(s.MEDIA_PREV_TRACK))})}function rt(e=!1){let t=r.players.getCurrentTrack()+1>r.players.getNumTracks();v.log(`nextTrack() - isMediaEnded: ${e} - isLastTrack: ${t} - autoplay: ${l.playback.autoplay}`),!mr(e,t)&&(t===!1?(r.players.stop(),e&&l.playback.autoplay===!1?te():r.players.nextTrack(m())&&I()):t===!0&&e===!1?y(s.MEDIA_NEXT_TRACK):e&&(te(),l.playback.autoplay?y(s.CONTINUE_AUTOPLAY,{trackType:r.players.current.getTrackType()}):r.players.stop()))}function mr(e,t){if(e&&l.playback.autoplay){let a=Se();if(v.log(`repeatPlayback(): ${v.getKeyForValue(w,a)}`),a===w.ONE)return r.players.current.seekTo(0),r.players.current.play(),!0;if(t&&a===w.ALL)return r.players.stop(),r.players.setPlayerIndex(0),da(!0),!0}return!1}function br(e){r.players.current.seekTo(e)}function Ar(){r.players.current.setVolume(l.playback.masterVolume)}function ua(){l.playback.masterMute=l.playback.masterMute!==!0,r.players.mute()}function Pr(e,t=!0){v.log(`cueTrack(): ${e}`),r.players.setPlayerIndex(r.players.indexMap.get(e)),y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),I()}function da(e,t=!0){y(s.MEDIA_CUE_TRACK,{scrollToMedia:t,trackId:r.players.current.getTrackId()}),e&&r.players.current.play(Ye)}function pa(e,t=!0){v.log(`skipToTrack(): ${e} - ${t}`),t===!0&&m()===!1&&(r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY),r.players.jumpToTrack(e,t)&&I())}function Sr(e,t=null){v.log(`resumeAutoplay(): ${e.autoplay}${t!==null?" - "+t:""}`),t!==null?e.autoplay?pa(r.players.trackFromUid(t),!0):Pr(t):e.autoplay&&(r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY),Me())}function Cr(e,t,a=!1){v.log(`cueOrPlaySingleTrackById() - playMedia: ${a}`),r.eventLog.add(u.ULTRAFUNK,p.CUE_PLAY_SINGLE_TRACK),r.players.current.setIsCued(!1),r.players.current.setIsPlayable(!0),r.players.current.setArtistTitle(e.track_artist,e.track_title),r.players.current.setDuration(parseInt(e.track_duration)),r.players.current.setThumbnail(t),ht(0),I(),a?(r.eventLog.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY),r.players.current.playTrackById(t.uid)):r.players.current.cueTrackById(t.uid)}function Ve(){return{isPlaying:m(),currentTrack:r.players.getCurrentTrack(),trackType:r.players.current.getTrackType(),position:0,numTracks:r.players.getNumTracks(),trackId:r.players.current.getTrackId(),iframeId:r.players.current.getIframeId()}}function Lr(e,t){r.players.isCurrent(e)===!1&&r.players.current.getDuration()>0&&(v.log(`crossfadeToClick():
      fadeOut: ${r.players.current.getArtist()} - "${r.players.current.getTitle()}" (${r.players.current.getUid()})
      fadeIn.: ${r.players.playerFromUid(e).getArtist()} - "${r.players.playerFromUid(e).getTitle()}" (${e})`),l.playback.masterMute===!1&&l.playback.autoplay===!1&&r.players.current.getPosition(a=>{r.players.current.getDuration()-a/1e3>=ia.minCrossfadeToTime+ia.maxBufferingDelay&&ya(fe.TRACK,t,e)}))}function ya(e,t,a=null){r.eventLog.add(u.ULTRAFUNK,p.CROSSFADE_START),r.players.crossfade.init(e,t,a)!==null&&I()}function hr(e,t=null){switch(v.log(`embeddedEventHandler() - event: ${v.getKeyForValue(s,e)}`),t!==null&&v.log(t),e){case s.MEDIA_ENDED:y(s.MEDIA_ENDED,Ve()),rt(!0);break;case s.PLAYBACK_READY:Ae(ca,Me,rt,ua),Ht(Cr),y(s.PLAYBACK_READY,t),y(s.RESUME_AUTOPLAY,null,{resumeAutoplay:Sr});break;case s.AUTOPLAY_BLOCKED:y(s.AUTOPLAY_BLOCKED,null,{togglePlayPause:Me});break;case s.PLAYBACK_BLOCKED:case s.MEDIA_UNAVAILABLE:y(e,t,{skipToTrack:pa});break}}var vr=(()=>{let e={PLAY:1,PAUSE:2};return{STATE:e,sync:function a(o,c){v.log(`playbackState.sync() - previousTrack: ${r.players.getPlayerIndex()+1} - nextTrack: ${r.players.indexMap.get(o)+1} - syncState: ${v.getKeyForValue(e,c)}`),r.players.isCurrent(o)?c===e.PLAY?y(s.MEDIA_PLAYING,Ve()):c===e.PAUSE&&y(s.MEDIA_PAUSED,Ve()):(r.players.stop(),r.players.setPlayerIndex(r.players.indexMap.get(o)),I(),a(o,c))}}})();var dt={};gt(dt,{getStatus:()=>Or,init:()=>Ir,nextTrack:()=>ka,prevTrack:()=>Ta,setVolume:()=>Nr,toggleMute:()=>it,togglePlayPause:()=>ut});var F,Be,ga,lt=class extends oe{constructor(){super(...arguments);S(this,Be);S(this,F,null)}ready(a){super.init(),C(this,F,a),E(s.MEDIA_PLAYING,()=>super.start())}updateTimer(){this.isVisible&&m()&&q(this,Be,ga).call(this,d(this,F).embedded.getCurrentTime(),d(this,F).getDuration())}updateVolumeMute(){Le(d(this,F).embedded.getVolume(),d(this,F).embedded.isMuted())}},ot=lt;F=new WeakMap,Be=new WeakSet,ga=function(a,o){if(a!==void 0){let c=Math.round(a);K(a*1e3,c,o),c>0&&o>0&&ge(lt.prototype,this,"updateOncePerSecond").call(this,c,o)}};var nt=new ot;var R=A("list-playback"),ne=new re(10),n={player:null,autoplayData:null,playerReady:!1,firstStatePlaying:!0,currentTrackId:null,currentSnackbarId:0},ct=`
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;function Ir(){R.log("init()"),It(G),Xt(G),Ur()!==null?_r():P("No playable YouTube tracks!",0,"help",()=>me("No playable tracks",ct))}function Ur(){if(n.currentTrackId=X(),n.autoplayData=JSON.parse(sessionStorage.getItem(ee.UF_AUTOPLAY)),sessionStorage.removeItem(ee.UF_AUTOPLAY),n.currentTrackId!==null){if(n.autoplayData!==null&&n.autoplayData.trackId!==null){let e=Ce(`[data-track-id="${n.autoplayData.trackId}"]`);e!==null?Xe(e)===D.YOUTUBE?n.currentTrackId=e.id:P("Cannot play SoundCloud track",5,"help",()=>me("Cannot play SoundCloud track",ct)):P("Unable to cue track (not found)",5)}Ot(n.currentTrackId)}return R.log(`cueInitialTrack() - currentTrackId: ${n.currentTrackId} - autoplayData: ${n.autoplayData!==null?JSON.stringify(n.autoplayData):"N/A"}`),n.currentTrackId}function G(e,t=!0,a=!1){let o=Xe(Rt(e));if(R.log(`setCurrentTrack() - nextTrackType: ${R.getKeyForValue(D,o)} - nextTrackId: ${e} - playNextTrack: ${t} - isPointerClick: ${a}`),o===D.SOUNDCLOUD&&a){P("Cannot play SoundCloud track",5,"help",()=>me("Cannot play SoundCloud track",ct));return}e===n.currentTrackId?ut():(m()&&n.player.embedded.stopVideo(),n.currentTrackId=e,y(s.MEDIA_CUE_TRACK,{trackId:e,isPointerClick:a}),Ea(t))}function Ea(e){let t=Vt();n.player.resetState(),e?(n.player.playTrackById(t),J(f.PLAYING),I()):(n.player.cueTrackById(t),J(f.PAUSED))}function ut(){n.currentTrackId===null?G(Ce("div.track-entry.current").id):m()?n.player.embedded.pauseVideo():n.player.play(we)}function Nr(){n.player.setVolume(l.playback.masterVolume)}function it(e=!0){e&&(l.playback.masterMute=l.playback.masterMute!==!0),l.playback.masterMute?n.player.embedded.mute():n.player.embedded.unMute()}function Ta(){let e=Yt(),t=n.player.embedded.getCurrentTime();e!==null&&t<=5?(G(e,m()),I()):t!==0&&(n.player.embedded.seekTo(0),K(0,0,n.player.getDuration()))}function ka(){let e=X();e!==null&&(G(e,m()),I())}async function fa(e=!1,t=!1){let a=t?w.OFF:Se(),o=X();if(R.log(`advanceToNextTrack() autoplay: ${e} - isPlaybackError: ${t} - nextTrackId: ${o} - repeatMode: ${R.getKeyForValue(w,a)}`),e&&a===w.ONE)n.player.embedded.seekTo(0),n.player.play(we);else if(e&&o===null&&a===w.ALL)G(X(null)),x(0);else if(o===null)if(l.list.showLoadMoreTracks){let c=await _t();e&&c&&G(X())}else j(L.nextPage,e);else e?G(o):J(f.PAUSED)}function Rr(){m()===!1&&n.autoplayData!==null&&(ne.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY),ne.add(u.YOUTUBE,-1,X())),m()===!1&&fa(!0,!0)}function Yr(){n.currentTrackId=null,J(f.PAUSED)}function Or(){let e=Ce("div.track-entry.current");if(e!==null){let t=Nt("div.track-entry"),a=Array.prototype.indexOf.call(t,e);return{isPlaying:m(),currentTrack:a+1,trackType:D.YOUTUBE,position:Math.ceil(n.player.embedded.getCurrentTime()),numTracks:1,trackId:t[a].getAttribute("data-track-id"),iframeId:"youtube-player"}}return{isPlaying:!1,currentTrack:1,position:0,trackId:0}}function _r(){R.log("initYouTubeAPI()"),window.onYouTubeIframeAPIReady=function(){R.log("onYouTubeIframeAPIReady()");let a=new YT.Player("youtube-player",{events:{onReady:Mr,onStateChange:Vr,onError:we}});n.player=new bt(a),R.log(n.player),be(n.player,o=>n.player.embedded.seekTo(o)),y(s.PLAYBACK_LOADING,{loadingPercent:33})};let e=document.createElement("script");e.id="youtube-iframe-api",e.src="https://www.youtube.com/iframe_api";let t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}function Mr(){R.log("onYouTubePlayerReady()"),n.autoplayData?.autoplay===!0&&ne.add(u.ULTRAFUNK,p.RESUME_AUTOPLAY),Ae(Ta,ut,ka,it),y(s.PLAYBACK_LOADING,{loadingPercent:66}),nt.ready(n.player),Ut(n.player),it(!1),n.player.setVolume(l.playback.masterVolume),y(s.PLAYBACK_READY,{resetProgressBar:!1}),Ea(n.autoplayData?.autoplay===!0)}function Vr(e){switch(R.log(`onYouTubePlayerStateChange(): ${e.data} - trackId: ${n.currentTrackId}`),ne.add(u.YOUTUBE,e.data,n.currentTrackId),e.data!==YT.PlayerState.PLAYING&&te(),e.data){case YT.PlayerState.UNSTARTED:Br();break;case YT.PlayerState.BUFFERING:y(s.MEDIA_LOADING);break;case YT.PlayerState.PLAYING:wr(),y(s.MEDIA_PLAYING);break;case YT.PlayerState.PAUSED:J(f.PAUSED);break;case YT.PlayerState.ENDED:nt.stop(),y(s.MEDIA_ENDED),fa(l.playback.autoplay);break}}function Br(){ne.ytAutoplayBlocked(n.currentTrackId,3e3)&&(J(f.PAUSED),n.currentSnackbarId=P("Autoplay blocked, Play to continue",0,"play",()=>n.player.play(we))),n.playerReady===!1&&(n.playerReady=!0,y(s.PLAYBACK_LOADING,{loadingPercent:0}))}function wr(){ke(n.currentSnackbarId),n.firstStatePlaying&&(n.firstStatePlaying=!1,n.autoplayData=null,setTimeout(()=>{l.playback.autoplay&&m()&&Math.round(window.pageYOffset)<=1&&Pt(At.SITE_MAX_WIDTH_MOBILE)&&x(0)},6e3))}function we(e){R.log(`onYouTubePlayerError(): playerError: ${e.data} - currentTrackId: ${n.currentTrackId} - isTrackCued: ${n.player.isTrackCued()}`),n.player.setPlayerError(e.data),n.player.isTrackCued()===!1&&(Mt("Error!"),ne.add(u.YOUTUBE,p.PLAYER_ERROR,n.currentTrackId),P("Unable to play track, skipping to next",5,"Stop",Yr,Rr),Ee("media_unavailable",{mediaUrl:n.player.embedded.getVideoUrl(),mediaTitle:`${n.player.getArtist()} - ${n.player.getTitle()}`}))}var Ke=A("screen-wakelock"),xe={wakeLock:null};function ma(){l.mobile.keepScreenOn&&document.addEventListener("click",ba)}function ba(){Ke.log("enableScreenWakeLock()"),document.removeEventListener("click",ba),Kr(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&l.mobile.keepScreenOn&&xr()})}function xr(){Aa()&&xe.wakeLock===null&&Pa()}function Aa(){return"wakeLock"in navigator&&"request"in navigator.wakeLock}async function Kr(){Aa()?document.visibilityState==="visible"&&await Pa()!==!0&&(Ke.log("enableWakeLock(): Screen Wake Lock request failed"),P("Keep Screen On failed",5,"Disable",()=>l.mobile.keepScreenOn=!1)):(Ke.log("enableWakeLock(): Screen Wake Lock is not supported"),P("Keep Screen On is not supported",5,"Disable",()=>l.mobile.keepScreenOn=!1))}async function Pa(){try{return xe.wakeLock=await navigator.wakeLock.request("screen"),xe.wakeLock.addEventListener("release",()=>{xe.wakeLock=null}),!0}catch(e){Ke.error(`requestWakeLock(): ${e.name} - ${e.message}`)}return!1}var ye=A("playback-interaction"),Sa=new ve(10),g={player:null,isPlaybackReady:!1,siteNavUiElements:null,trackNavUiElements:null,keyboardShortcuts:null};document.addEventListener("DOMContentLoaded",()=>{Et(),ye.log("DOMContentLoaded"),Tt(),Bt()?g.player=st:wt()&&(g.player=dt),g.player!==null&&$r(),Wt(g.player?.getStatus)});function $r(){ye.log("initCommon()"),Lt(),Fr(),g.player.init(),g.siteNavUiElements=new pt("#site-navigation"),g.trackNavUiElements=new yt("nav.single-track-nav .nav-links"),ae.init(),g.keyboardShortcuts=St(l.playback.keyboardShortcuts),Gr(),ma()}function Fr(){E(s.PLAYBACK_READY,Jr),E(s.MEDIA_CUE_TRACK,La),E(s.MEDIA_ENDED,La),E(s.MEDIA_TIME_REMAINING,jr),E(s.MEDIA_PREV_TRACK,()=>W(null,U.PREV,L.prevPage)),E(s.MEDIA_NEXT_TRACK,()=>W(null,U.NEXT,L.nextPage))}function Gr(){le(".playback-shuffle-control span","click",Kt),document.addEventListener("keydown",Wr),document.addEventListener("keydown",qr),window.addEventListener("blur",zr)}function Wr(e){if(g.isPlaybackReady&&g.keyboardShortcuts.allow()&&e.ctrlKey===!1&&e.altKey===!1){switch(e.key){case"+":case"-":Ca(e);break;case"ArrowUp":case"ArrowDown":e.shiftKey&&Ca(e);break}if(e.repeat===!1){switch(e.code){case"Backquote":e.preventDefault(),x(g.player.getStatus().trackId);break}switch(e.key){case" ":e.preventDefault(),g.player.togglePlayPause();break;case"Home":case"End":case"PageUp":case"PageDown":$t(e);break;case"ArrowLeft":Hr(e);break;case"ArrowRight":Xr(e);break;case"A":je.toggle();break;case"f":case"F":e.preventDefault(),ae.toggle(document.getElementById(g.player.getStatus().iframeId));break;case"m":case"M":e.preventDefault(),g.player.toggleMute(),P(l.playback.masterMute?"<b>Muted</b> (<b>m</b> to Unmute)":"<b>Unmuted</b> (<b>m</b> to Mute)",3);break;case"p":case"P":Ft.toggle();break;case"r":case"R":P(`${Dt().title} (<b>r</b> to change)`,3);break;case"x":case"X":Gt.toggle();break}}}}function qr(e){if(g.isPlaybackReady&&g.keyboardShortcuts.allow())switch(e.key){case"MediaPlayPause":Ct===!1&&(ye.log("documentEventMediaKeyDown(): MediaPlayPause"),e.preventDefault(),g.player.togglePlayPause());break;case"MediaTrackPrevious":ye.log("documentEventMediaKeyDown(): MediaTrackPrevious"),e.preventDefault(),g.player.prevTrack();break;case"MediaTrackNext":ye.log("documentEventMediaKeyDown(): MediaTrackNext"),e.preventDefault(),g.player.nextTrack();break}}function Hr(e){e.preventDefault(),e.shiftKey===!0?W(null,U.PREV,L.prevPage):g.player.prevTrack()}function Xr(e){e.preventDefault(),e.shiftKey===!0?W(null,U.NEXT,L.nextPage):g.player.nextTrack()}function W(e,t,a){e?.preventDefault(),ie()&&g.player.getStatus().trackType===D.YOUTUBE?qt()===!1?ce(t,g.player.getStatus().isPlaying):P("Loading track, please wait...",3):ha(null,a)}function Ca(e){e.preventDefault(),l.playback.masterVolume=e.key==="+"||e.key==="ArrowUp"?l.playback.masterVolume<100?l.playback.masterVolume+5:100:l.playback.masterVolume>5?l.playback.masterVolume-5:5,g.player.setVolume()}function Jr(){le(".playback-details-control","click",Qr),le(".playback-thumbnail-control","click",Zr),le(".playback-timer-control","click",es),g.isPlaybackReady=!0}function La(){l.playback.autoExitFullscreen&&ae.exit()}function jr(e){l.playback.autoExitFsOnWarning&&e.data.timeRemainingSeconds<=l.playback.timeRemainingSeconds&&ae.exit()}function zr(){Je()||setTimeout(()=>{document.activeElement instanceof HTMLIFrameElement&&setTimeout(()=>{document.activeElement.blur(),document.activeElement instanceof HTMLIFrameElement&&document.activeElement.blur()},250)},0)}function Qr(){x(g.player.getStatus().trackId)}function Zr(){xt()?(Sa.add(u.MOUSE,p.MOUSE_CLICK),Sa.doubleClicked(u.MOUSE,p.MOUSE_CLICK,500)&&ae.enter(document.getElementById(g.player.getStatus().iframeId))):Je()&&x(0)}function es(){je.toggle()}var pt=class extends qe{elementClicked(){if(this.clicked("a.navbar-prev-link"))return W(this.event,U.PREV,L.prevPage);if(this.clicked("a.navbar-next-link"))return W(this.event,U.NEXT,L.nextPage)}},yt=class extends qe{elementClicked(){if(this.clicked("div.nav-previous a"))return W(this.event,U.PREV,L.prevPage);if(this.clicked("div.nav-next a"))return W(this.event,U.NEXT,L.nextPage)}};function ha(e,t){e?.preventDefault(),j(t,g.player.getStatus().isPlaying)}
//# sourceMappingURL=interaction.js.map
