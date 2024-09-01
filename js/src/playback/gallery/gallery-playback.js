//
// Gallery playback module
//
// https://ultrafunk.com
//


import * as playbackEvents       from '../common/playback-events.js';
import * as playbackControls     from '../common/playback-controls.js';
import { newDebugLogger }        from '../../shared/debuglogger.js';
import { playbackTimer }         from './gallery-playback-timer.js';
import { GalleryPlayers }        from './gallery-players.js';
import { CROSSFADE_TYPE }        from './crossfade.js';
import { settings }              from '../../shared/session-data.js';
import { singleTrackFetchReady } from './single-track-fetch.js';
import { initGalleryEvents }     from './gallery-events.js';
import { initGalleryControls }   from './gallery-controls.js';

import {
  eventLog as embeddedPlayersEventLog,
  initEmbeddedPlayers,
} from './embedded-players.js';


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

  m.eventLog = embeddedPlayersEventLog;

  initGalleryEvents();

  m.players = new GalleryPlayers();

  playbackControls.init((positionSeconds) => m.players.getTrackData(positionSeconds), seekClick);
  initGalleryControls(m.players, crossfadeToClick);
  playbackTimer.init(m.players, crossfadeInit);
  initEmbeddedPlayers(m.players, playbackState);
}


// ************************************************************************************************
// Playback controls click handlers + state
// ************************************************************************************************

export function play()
{
  playbackControls.setPlayState();
  m.players.current.play();
}

export function pause()
{
  playbackControls.setPauseState();
  m.players.current.pause();
}

export function togglePlayPause()
{
  playbackControls.isPlaying() ? pause() : play();
}

export function prevTrack()
{
  debug.log(`prevTrack() - prevTrack: ${m.players.getCurrentTrackNum() - 1} - numTracks: ${m.players.getNumTracks()}`);

  if (m.players.getCurrentTrackNum() > 0)
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
        if (m.players.getCurrentTrackNum() > 1)
          m.players.stop();

        if (m.players.prevTrack())
          playCurrentTrack(playbackControls.isPlaying());
        else
          playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PREV_TRACK);
      }
    });
  }
}

export function nextTrack(isMediaEnded = false)
{
  const isLastTrack = ((m.players.getCurrentTrackNum() + 1) > m.players.getNumTracks());

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
      if (m.players.nextTrack())
        playCurrentTrack(playbackControls.isPlaying());
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
      play();
      return true;
    }
    else if (isLastTrack && (repeatMode === playbackControls.REPEAT.ALL))
    {
      m.players.stop();
      m.players.setPlayerIndex(0);
      playCurrentTrack(true);
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

function cueOrPlayTrackById(iframeId, autoplayData, scrollToMedia = true)
{
  debug.log(`cueOrPlayTrackById() - iframeId: ${iframeId} - autoplay: ${autoplayData.autoplay} - position: ${autoplayData.position}`);

  m.players.setPlayerIndex(m.players.indexMap.get(iframeId));
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_CUE_TRACK, { scrollToMedia: scrollToMedia, trackId: m.players.current.getTrackId() });

  if (autoplayData.autoplay)
  {
    m.players.current.playTrackById(autoplayData.position);
  }
  else
  {
    m.players.current.cueTrackById(autoplayData.position);

    if (autoplayData.position !== 0)
      playbackControls.updateTimerAndProgress((autoplayData.position * 1000), autoplayData.position, m.players.current.getDuration());
  }

  playbackControls.updateTrackData(autoplayData.position);
}

function playCurrentTrack(playMedia, scrollToMedia = true)
{
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_CUE_TRACK, { scrollToMedia: scrollToMedia, trackId: m.players.current.getTrackId() });
  if (playMedia) play();
  playbackControls.updateTrackData();
}

function skipToTrack(trackNum, playMedia = true)
{
  debug.log(`skipToTrack() - trackNum: ${trackNum} - playMedia: ${playMedia}`);

  if ((playMedia === true) && (playbackControls.isPlaying() === false))
  {
    m.eventLog.add(m.eventLog.SOURCE.ULTRAFUNK, m.eventLog.EVENT.RESUME_AUTOPLAY);

    if (m.players.gotoTrackNum(trackNum))
      playCurrentTrack(playMedia);
  }
}

function resumeAutoplay(autoplayData = null, iframeId = null)
{
  if ((autoplayData !== null) && (iframeId !== null))
  {
    if (autoplayData.autoplay)
      m.eventLog.add(m.eventLog.SOURCE.ULTRAFUNK, m.eventLog.EVENT.RESUME_AUTOPLAY);

    cueOrPlayTrackById(iframeId, autoplayData);
  }
  else if ((autoplayData !== null) && (autoplayData.autoplay))
  {
    debug.log(`resumeAutoplay(): Play first track`);
    m.eventLog.add(m.eventLog.SOURCE.ULTRAFUNK, m.eventLog.EVENT.RESUME_AUTOPLAY);
    play();
  }
  else
  {
    debug.log(`resumeAutoplay(): Cue first track`);
    playbackControls.updateTrackData();
  }
}

function cueOrPlaySingleTrackById(trackData, thumbnailData, playMedia = false)
{
  debug.log(`cueOrPlaySingleTrackById() - playMedia: ${playMedia}`);

  m.players.current.setIsCued(false);
  m.players.current.setIsPlayable(true);
  m.players.current.setSourceUid(thumbnailData.uid);
  m.players.current.setArtistAndTitle(trackData.track_artist, trackData.track_title);
  m.players.current.setDuration(parseInt(trackData.track_duration));
  m.players.current.setThumbnail(thumbnailData);

  playbackControls.updateProgressPercent(0);
  playbackControls.updateTrackData();

  if (playMedia)
    m.players.current.playTrackById();
  else
    m.players.current.cueTrackById();
}

export function getStatus(getCurrentPosition = false)
{
  const status = {
    isPlaying:      playbackControls.isPlaying(),
    currentTrack:   m.players.getCurrentTrackNum(),
    trackType:      m.players.current.getTrackType(),
    position:       0,
    numTracks:      m.players.getNumTracks(),
    trackId:        m.players.current.getTrackId(),
    trackElementId: m.players.current.getTrackId(),
    playerId:       m.players.current.getIframeId(),
  };

  if (getCurrentPosition)
  {
    return new Promise((resolve) =>
    {
      m.players.current.getPosition((positionMilliseconds) =>
      {
        status.position = Math.round(positionMilliseconds / 1000);
        resolve(status);
      });
    });
  }

  return status;
}


// ************************************************************************************************
// Track to Track crossfade click handler + crossfade init helper functions
// ************************************************************************************************

function crossfadeToClick(fadeInUid, crossfadePreset)
{
  if ((m.players.isCurrent(fadeInUid) === false) && (m.players.current.getDuration() > 0))
  {
    debug.log(`crossfadeToClick():
      fadeOut: ${m.players.current.getArtist()} - "${m.players.current.getTitle()}" (${m.players.current.getIframeId()})
      fadeIn.: ${m.players.playerFromIframeId(fadeInUid).getArtist()} - "${m.players.playerFromIframeId(fadeInUid).getTitle()}" (${fadeInUid})`);

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
  m.eventLog.add(m.eventLog.SOURCE.ULTRAFUNK, m.eventLog.EVENT.CROSSFADE_START);

  if (m.players.crossfade.init(crossfadeType, crossfadePreset, crossfadeInUid))
  {
    if (crossfadeInUid === null)
    {
      if (m.players.nextTrack())
        playCurrentTrack(true);
    }
    else
    {
      if (m.players.gotoTrackNum(m.players.trackNumFromIframeId(crossfadeInUid)))
        playCurrentTrack(true, false);
    }
  }
}


// ************************************************************************************************
// Proxy functions for embedded-players playbackEvents.dispatch()
// ************************************************************************************************

export function onEmbeddedPlayersReady()
{
  debug.log('onEmbeddedPlayersReady()');
  playbackControls.ready(prevTrack, togglePlayPause, nextTrack, toggleMute);
  singleTrackFetchReady(cueOrPlaySingleTrackById);
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_READY, { resetProgressBar: true });
  playbackEvents.dispatch(playbackEvents.EVENT.RESUME_AUTOPLAY, null, { 'resumeAutoplay': resumeAutoplay });
}

export function onMediaEnded()
{
  debug.log('onMediaEnded()');
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_ENDED, getStatus());
  nextTrack(true);
}

export function onAutoplayBlocked()
{
  debug.log('onAutoplayBlocked()');
  playbackEvents.dispatch(playbackEvents.EVENT.AUTOPLAY_BLOCKED, null, { 'play': play });
}

export function onMediaUnavailable(errorData)
{
  debug.log('onMediaUnavailable()');
  debug.log(errorData);
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_UNAVAILABLE, errorData, { 'skipToTrack': skipToTrack });
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
    debug.log(`playbackState.sync() - previousTrack: ${m.players.getCurrentTrackNum()} - nextTrack: ${m.players.indexMap.get(nextPlayerUid) + 1} - syncState: ${debug.getKeyForValue(STATE, syncState)}`);

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
