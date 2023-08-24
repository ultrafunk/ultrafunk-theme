//
// Gallery playback module
//
// https://ultrafunk.com
//


import * as eventLogger          from '../common/eventlogger.js';
import * as embeddedPlayers      from './embedded-players.js';
import * as playbackEvents       from '../common/playback-events.js';
import * as galleryEvents        from './gallery-events.js';
import * as playbackControls     from '../common/playback-controls.js';
import * as galleryControls      from './gallery-controls.js';
import { newDebugLogger }        from '../../shared/debuglogger.js';
import { playbackTimer }         from './gallery-playback-timer.js';
import { galleryPlayers }        from './gallery-players.js';
import { CROSSFADE_TYPE }        from './crossfade.js';
import { settings }              from '../../shared/session-data.js';
import { singleTrackFetchReady } from './single-track-fetch.js';


/*************************************************************************************************/


const debug = newDebugLogger('gallery-playback');

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

export function init()
{
  debug.log('init()');

  m.eventLog = embeddedPlayers.eventLog;

  galleryEvents.init();

  m.players = galleryPlayers();
  m.players.init(playTrack);

  playbackControls.init(m.players, seekClick);
  galleryControls.init(m.players, crossfadeToClick);
  playbackTimer.init(m.players, crossfadeInit);
  embeddedPlayers.init(m.players, playbackState, embeddedEventHandler);
}


// ************************************************************************************************
// Playback controls click handlers + state
// ************************************************************************************************

export function togglePlayPause()
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

export function prevTrack()
{
  debug.log(`prevTrack() - prevTrack: ${m.players.getCurrentTrack() - 1} - numTracks: ${m.players.getNumTracks()}`);

  if (m.players.getCurrentTrack() > 0)
  {
    m.players.current.getPosition((positionMilliseconds) =>
    {
      if (positionMilliseconds > 5000)
      {
        m.players.current.seekTo(0);
        playbackControls.updateTimerAndProgress(0, 0, m.players.current.getDuration());
      }
      else
      {
        if (m.players.getCurrentTrack() > 1)
          m.players.stop();

        if (m.players.prevTrack(playbackControls.isPlaying()))
          playbackControls.updateTrackData();
        else
          playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PREV_TRACK);
      }
    });
  }
}

export function nextTrack(isMediaEnded = false)
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
        playbackControls.updateTrackData();
    }
  }
  else if ((isLastTrack === true) && (isMediaEnded === false))
  {
    playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_NEXT_TRACK);
  }
  else if (isMediaEnded)
  {
    playbackControls.setPauseState();

    if (settings.playback.autoplay)
      playbackEvents.dispatch(playbackEvents.EVENT.CONTINUE_AUTOPLAY, { trackType: m.players.current.getTrackType() });
    else
      m.players.stop();
  }
}

function repeatPlayback(isMediaEnded, isLastTrack)
{
  if (isMediaEnded && settings.playback.autoplay)
  {
    const repeatMode = playbackControls.getRepeatMode();

    debug.log(`repeatPlayback(): ${debug.getKeyForValue(playbackControls.REPEAT, repeatMode)}`);

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

export function setVolume()
{
  m.players.current.setVolume(settings.playback.masterVolume);
}

export function toggleMute()
{
  settings.playback.masterMute = (settings.playback.masterMute === true) ? false : true;
  m.players.mute();
}

function cueTrack(iframeId, scrollToMedia = true)
{
  debug.log(`cueTrack(): ${iframeId}`);

  m.players.setPlayerIndex(m.players.indexMap.get(iframeId));
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_CUE_TRACK, { scrollToMedia: scrollToMedia, trackId: m.players.current.getTrackId() });
  playbackControls.updateTrackData();
}

function playTrack(playMedia, scrollToMedia = true)
{
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_CUE_TRACK, { scrollToMedia: scrollToMedia, trackId: m.players.current.getTrackId() });

  if (playMedia)
    m.players.current.play(embeddedPlayers.onPlayerError);
}

function skipToTrack(trackNum, playMedia = true)
{
  debug.log(`skipToTrack(): ${trackNum} - ${playMedia}`);

  if ((playMedia === true) && (playbackControls.isPlaying() === false))
  {
    m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.RESUME_AUTOPLAY);

    if (m.players.jumpToTrack(trackNum, playMedia))
      playbackControls.updateTrackData();
  }
}

function resumeAutoplay(autoplayData, iframeId = null)
{
  debug.log(`resumeAutoplay(): ${autoplayData.autoplay} - iframeId: ${iframeId}`);

  if (iframeId !== null)
  {
    if (autoplayData.autoplay)
      skipToTrack(m.players.trackFromUid(iframeId), true);
    else
      cueTrack(iframeId);
  }
  else if (autoplayData.autoplay)
  {
    m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.RESUME_AUTOPLAY);
    togglePlayPause();
  }
}

function cueOrPlaySingleTrackById(trackData, thumbnailData, playMedia = false)
{
  debug.log(`cueOrPlaySingleTrackById() - playMedia: ${playMedia}`);
  m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.CUE_PLAY_SINGLE_TRACK);

  m.players.current.setIsCued(false);
  m.players.current.setIsPlayable(true);
  m.players.current.setArtistTitle(trackData.track_artist, trackData.track_title);
  m.players.current.setDuration(parseInt(trackData.track_duration));
  m.players.current.setThumbnail(thumbnailData);

  playbackControls.updateProgressPercent(0);
  playbackControls.updateTrackData();

  if (playMedia)
  {
    m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.RESUME_AUTOPLAY);
    m.players.current.playTrackById(thumbnailData.uid);
  }
  else
  {
    m.players.current.cueTrackById(thumbnailData.uid);
  }
}

export function getStatus()
{
  return {
    isPlaying:    playbackControls.isPlaying(),
    currentTrack: m.players.getCurrentTrack(),
    trackType:    m.players.current.getTrackType(),
    position:     0,
    numTracks:    m.players.getNumTracks(),
    trackId:      m.players.current.getTrackId(),
    elementId:    m.players.current.getTrackId(),
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
  m.eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.CROSSFADE_START);

  const playersIndex = m.players.crossfade.init(crossfadeType, crossfadePreset, crossfadeInUid);

  if (playersIndex !== null)
    playbackControls.updateTrackData();
}


// ************************************************************************************************
// Embedded players event handler proxy for playbackEvents.dispatch()
// ************************************************************************************************

function embeddedEventHandler(embeddedEvent, embeddedEventData = null)
{
  debug.log(`embeddedEventHandler() - event: ${debug.getKeyForValue(playbackEvents.EVENT, embeddedEvent)}`);
  if (embeddedEventData !== null) debug.log(embeddedEventData);

  switch (embeddedEvent)
  {
    case playbackEvents.EVENT.MEDIA_ENDED:
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_ENDED, getStatus());
      nextTrack(true);
      break;

    case playbackEvents.EVENT.PLAYBACK_READY:
      playbackControls.ready(prevTrack, togglePlayPause, nextTrack, toggleMute);
      singleTrackFetchReady(cueOrPlaySingleTrackById);
      playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_READY, embeddedEventData);
      playbackEvents.dispatch(playbackEvents.EVENT.RESUME_AUTOPLAY, null, { 'resumeAutoplay': resumeAutoplay });
      break;

    case playbackEvents.EVENT.AUTOPLAY_BLOCKED:
      playbackEvents.dispatch(playbackEvents.EVENT.AUTOPLAY_BLOCKED, null, { 'togglePlayPause': togglePlayPause });
      break;

    case playbackEvents.EVENT.PLAYBACK_BLOCKED:
    case playbackEvents.EVENT.MEDIA_UNAVAILABLE:
      playbackEvents.dispatch(embeddedEvent, embeddedEventData, { 'skipToTrack': skipToTrack });
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

  const sync = function syncRecursive(nextPlayerUid, syncState)
  {
    debug.log(`playbackState.sync() - previousTrack: ${m.players.getPlayerIndex() + 1} - nextTrack: ${m.players.indexMap.get(nextPlayerUid) + 1} - syncState: ${debug.getKeyForValue(STATE, syncState)}`);

    if (m.players.isCurrent(nextPlayerUid))
    {
      if (syncState === STATE.PLAY)
      {
        playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PLAYING, getStatus());
      }
      else if (syncState === STATE.PAUSE)
      {
        playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PAUSED, getStatus());
      }
    }
    else
    {
      m.players.stop();
      m.players.setPlayerIndex(m.players.indexMap.get(nextPlayerUid));
      playbackControls.updateTrackData();
      syncRecursive(nextPlayerUid, syncState);
    }
  };

  return {
    STATE,
    sync,
  };
})();
