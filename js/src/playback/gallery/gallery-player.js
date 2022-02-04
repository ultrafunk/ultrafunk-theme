//
// Gallery player module
//
// https://ultrafunk.com
//


import * as debugLogger       from '../../shared/debuglogger.js';
import * as eventLogger       from '../eventlogger.js';
import * as mediaPlayers      from '../mediaplayers.js';
import * as embeddedPlayers   from './embedded-players.js';
import * as playbackEvents    from '../playback-events.js';
import * as playbackControls  from '../playback-controls.js';
import * as crossfadeControls from './crossfade-controls.js';
import { playbackTimer }      from './gallery-playback-timer.js';
import { CROSSFADE_TYPE }     from './crossfade.js';
import { settings }           from '../../shared/session-data.js';


export {
  init,
  togglePlayPause,
  prevTrack,
  nextTrack,
  toggleMute,
  getStatus,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('gallery-player');

const m = {
  eventLog: null,
  players:  {},
};

const config = {
  minCrossfadeToTime: 5,   // Shortest allowed track to track fade time
  maxBufferingDelay:  3,   // VERY rough estimate of "max" network buffering delay in seconds
};


// ************************************************************************************************
// Init
// ************************************************************************************************

function init()
{
  debug.log('init()');

  m.eventLog = embeddedPlayers.eventLog;

  playbackEvents.init();
  
  m.players = mediaPlayers.getInstance();
  m.players.init(playTrack);

  playbackControls.init(m.players, seekClick);
  crossfadeControls.init(m.players, crossfadeToClick);
  playbackTimer.init(m.players, getStatus, crossfadeInit);
  embeddedPlayers.init(m.players, playbackState, embeddedEventHandler);
}


// ************************************************************************************************
// Playback controls click handlers + state
// ************************************************************************************************

function togglePlayPause()
{
  if (playbackControls.isPlaying())
  {
    playbackControls.setPauseState();
    m.players.current.pause();
  }
  else
  {
    playbackControls.setPlayState();
    m.players.current.play(embeddedPlayers.onPlayerError);
  }
}

function prevTrack()
{
  debug.log(`prevTrack() - prevTrack: ${m.players.getCurrentTrack() - 1} - numTracks: ${m.players.getNumTracks()}`);

  if (m.players.getCurrentTrack() > 0)
  {
    m.players.current.getPosition((positionMilliseconds) =>
    {
      if (positionMilliseconds > 5000)
      {
        m.players.current.seekTo(0);
        playbackTimer.updateCallback(0);
      }
      else
      {
        if (m.players.getCurrentTrack() > 1)
          m.players.stop();
        
        if (m.players.prevTrack(playbackControls.isPlaying()))
          playbackControls.updatePrevState();
      }
    });
  }
}

function nextTrack(isMediaEnded = false)
{
  const isLastTrack = ((m.players.getCurrentTrack() + 1) > m.players.getNumTracks());

  debug.log(`nextTrack() - isMediaEnded: ${isMediaEnded} - isLastTrack: ${isLastTrack} - autoplay: ${settings.playback.autoplay}`);

  if (repeatPlayback(isMediaEnded, isLastTrack))
    return;

  if (isLastTrack === false)
  {
    m.players.stop();
    
    if (isMediaEnded && (settings.playback.autoplay === false))
    {
      playbackControls.setPauseState();
    }
    else
    {
      if (m.players.nextTrack(playbackControls.isPlaying()))
        playbackControls.updateNextState();
    }
  }
  else if (isMediaEnded)
  {
    playbackControls.setPauseState();
    
    if (settings.playback.autoplay)
      playbackEvents.dispatch(playbackEvents.EVENT.CONTINUE_AUTOPLAY);
    else
      m.players.stop();
  }
}

function repeatPlayback(isMediaEnded, isLastTrack)
{
  if (isMediaEnded && settings.playback.autoplay)
  {
    const repeatMode = playbackControls.getRepeatMode();

    debug.log(`repeatPlayback(): ${debug.getObjectKeyForValue(playbackControls.REPEAT, repeatMode)}`);

    if (repeatMode === playbackControls.REPEAT.ONE)
    {
      m.players.current.seekTo(0);
      m.players.current.play();
      return true;
    }
    else if (isLastTrack && (repeatMode === playbackControls.REPEAT.ALL))
    {
      m.players.stop();
      m.players.setPlayerIndex(0);
      playTrack(true);
      return true;
    }
  }

  return false;
}

function seekClick(positionSeconds)
{
  m.players.current.seekTo(positionSeconds);
}

function toggleMute()
{
  settings.playback.masterMute = (settings.playback.masterMute === true) ? false : true;
  m.players.mute();
}
  
function cueTrack(iframeId, scrollToMedia = true)
{
  debug.log(`cueTrack(): ${iframeId}`);

  m.players.setPlayerIndex(m.players.indexMap.get(iframeId));
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_SHOW, { scrollToMedia: scrollToMedia, trackId: m.players.current.getTrackId() });
  playbackControls.updateNextState();
}

function playTrack(playMedia, scrollToMedia = true)
{
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_SHOW, { scrollToMedia: scrollToMedia, trackId: m.players.current.getTrackId() });
  
  if (playMedia)
    m.players.current.play(embeddedPlayers.onPlayerError);
}

function skipToTrack(trackNum, playMedia = true)
{
  debug.log(`skipToTrack(): ${trackNum} - ${playMedia}`);

  if ((playMedia === true) && (playbackControls.isPlaying() === false))
  {
    // Reset eventlog to enable check for autoplay block
    m.eventLog.clear();
    m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.RESUME_AUTOPLAY, null);
    
    if (m.players.jumpToTrack(trackNum, playMedia))
      playbackControls.updateNextState();
  }
}

function resumeAutoplay(autoplayData, iframeId = null)
{
  debug.log(`resumeAutoplay(): ${autoplayData.autoplay}${(iframeId !== null) ? (' - ' + iframeId) : '' }`);

  if (iframeId !== null)
  {
    if (autoplayData.autoplay)
      skipToTrack(m.players.trackFromUid(iframeId), true);
    else
      cueTrack(iframeId);
  }
  else if (autoplayData.autoplay)
  {
    m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.RESUME_AUTOPLAY, null);
    togglePlayPause();
  }
}

function getStatus()
{
  return {
    isPlaying:    playbackControls.isPlaying(),
    currentTrack: m.players.getCurrentTrack(),
    position:     0,
    numTracks:    m.players.getNumTracks(),
    trackId:      m.players.current.getTrackId(),
    iframeId:     m.players.current.getIframeId(),
  };
}


// ************************************************************************************************
// Track to Track crossfade click handler + crossfade init helper functions
// ************************************************************************************************

function crossfadeToClick(fadeInUid, crossfadePreset)
{
  if ((m.players.isCurrent(fadeInUid) === false) && (m.players.current.getDuration() > 0))
  {
    debug.log(`crossfadeToClick():
      fadeOut: ${m.players.current.getArtist()} - "${m.players.current.getTitle()}" (${m.players.current.getUid()})
      fadeIn.: ${m.players.playerFromUid(fadeInUid).getArtist()} - "${m.players.playerFromUid(fadeInUid).getTitle()}" (${fadeInUid})`);

    if ((settings.playback.masterMute === false) && (settings.playback.autoplay === false))
    {
      m.players.current.getPosition((positionMilliseconds) =>
      {
        const timeRemaining = m.players.current.getDuration() - (positionMilliseconds / 1000);

        if (timeRemaining >= (config.minCrossfadeToTime + config.maxBufferingDelay))
          crossfadeInit(CROSSFADE_TYPE.TRACK, crossfadePreset, fadeInUid);
      });
    }
  }
}

function crossfadeInit(crossfadeType, crossfadePreset, crossfadeInUid = null)
{
  m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.CROSSFADE_START, null);

  const playersIndex = m.players.crossfade.init(crossfadeType, crossfadePreset, crossfadeInUid);

  if (playersIndex !== null)
    playbackState.syncControls(playersIndex.fadeOutPlayer, playersIndex.fadeInPlayer);
}


// ************************************************************************************************
// Embedded players event handler (proxy for playbackEvents.dispatch())
// ************************************************************************************************

function embeddedEventHandler(embeddedEvent, embeddedEventData = null)
{
  if (debug.isDebug() && (embeddedEvent !== playbackEvents.EVENT.LOADING) && (embeddedEvent !== playbackEvents.EVENT.MEDIA_LOADING))
  {
    debug.log(`embeddedEventHandler(): ${embeddedEvent}`);
    if (embeddedEventData !== null) debug.log(embeddedEventData);
  }

  switch(embeddedEvent)
  {
    case playbackEvents.EVENT.LOADING:
      playbackEvents.dispatch(playbackEvents.EVENT.LOADING, embeddedEventData);
      break;

    case playbackEvents.EVENT.MEDIA_LOADING:
      playbackControls.setLoadState();
      break;
    
    case playbackEvents.EVENT.READY:
      playbackControls.ready(prevTrack, togglePlayPause, nextTrack, toggleMute);
      crossfadeControls.ready();
      playbackEvents.dispatch(playbackEvents.EVENT.READY, embeddedEventData);
      playbackEvents.dispatch(playbackEvents.EVENT.RESUME_AUTOPLAY, null, { 'resumeAutoplay': resumeAutoplay });
      break;

    case playbackEvents.EVENT.MEDIA_ENDED:
      nextTrack(true);
      break;

    case playbackEvents.EVENT.AUTOPLAY_BLOCKED:
      playbackControls.setPauseState();
      playbackEvents.dispatch(playbackEvents.EVENT.AUTOPLAY_BLOCKED, null, { 'togglePlayPause': togglePlayPause });
      break;

    case playbackEvents.EVENT.PLAYBACK_BLOCKED:
      playbackControls.setPauseState();
      playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_BLOCKED, embeddedEventData, { 'skipToTrack': skipToTrack });
      break;

    case playbackEvents.EVENT.MEDIA_UNAVAILABLE:
      playbackControls.setPauseState();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_UNAVAILABLE, embeddedEventData, { 'skipToTrack': skipToTrack });
      break;
    }
}


// ************************************************************************************************
// Playback controls and embedded players state sync module
// ************************************************************************************************

const playbackState = (() =>
{
  const STATE = {
    PLAY:  1,
    PAUSE: 2,
  };
  
  const syncAll = function syncAllRecursive(nextPlayerUid, syncState)
  {
    debug.log(`playbackState.syncAll() - previousTrack: ${m.players.getPlayerIndex() + 1} - nextTrack: ${m.players.indexMap.get(nextPlayerUid) + 1} - syncState: ${debug.getObjectKeyForValue(STATE, syncState)}`);
    
    if (m.players.isCurrent(nextPlayerUid))
    {
      if (syncState === STATE.PLAY)
      {
        m.players.crossfade.start();
        playbackControls.setPlayState();
        playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PLAYING, getStatus());
      }
      else if (syncState === STATE.PAUSE)
      {
        m.players.crossfade.stop();
        playbackControls.setPauseState();
        playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PAUSED, getStatus());
      }
    }
    else
    {
      const prevPlayerIndex = m.players.getPlayerIndex();
      const nextPlayerIndex = m.players.indexMap.get(nextPlayerUid);
      
      m.players.stop();
      m.players.setPlayerIndex(nextPlayerIndex);
      
      syncControls(prevPlayerIndex, nextPlayerIndex);
      syncAllRecursive(nextPlayerUid, syncState);
    }
  };

  function syncControls(prevPlayerIndex, nextPlayerIndex)
  {
    if (nextPlayerIndex > prevPlayerIndex)
      playbackControls.updateNextState();
    else
      playbackControls.updatePrevState();
  }

  return {
    STATE,
    syncAll,
    syncControls,
  };
})();
