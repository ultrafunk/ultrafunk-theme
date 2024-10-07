//
// List playback module
//
// https://ultrafunk.com
//


import * as playbackControls  from '../common/playback-controls.js';
import * as listControls      from './list-controls.js';
import * as playbackEvents    from '../common/playback-events.js';
import { newDebugLogger }     from '../../shared/debuglogger.js';
import { KEY }                from '../../shared/storage.js';
import { STATE }              from '../common/element-wrappers.js';
import { response, settings } from '../../shared/session-data.js';
import { initTrackSearch }    from './track-search.js';
import { playbackTimer }      from './list-playback-timer.js';

import {
  eventLog as embeddedPlayersEventLog,
  initEmbeddedPlayers,
} from './embedded-players.js';

import {
  MATCH,
  matchesMedia,
} from '../../shared/utils.js';

import {
  showSnackbar,
  dismissSnackbar,
} from '../../shared/snackbar.js';

import {
  TRACK_TYPE,
  getAttrTrackTypeById,
} from '../common/mediaplayer.js';

import {
  playerScrollTo,
  autoplayNavTo,
} from '../common/shared-gallery-list.js';


/*************************************************************************************************/


const debug = newDebugLogger('list-playback');

const m = {
  eventLog:          null,
  players:           null,
  autoplayData:      null,
  currentTrackId:    null,
  firstStatePlaying: true,
  currentSnackbarId: 0,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function init()
{
  debug.log('init()');

  m.eventLog = embeddedPlayersEventLog;

  listControls.init();
  initTrackSearch();
  setInitialTrack();
  initEmbeddedPlayers(m.autoplayData, m.currentTrackId);
}

function setInitialTrack()
{
  m.currentTrackId = listControls.getNextPlayableId();
  m.autoplayData   = JSON.parse(sessionStorage.getItem(KEY.UF_AUTOPLAY));
  sessionStorage.removeItem(KEY.UF_AUTOPLAY);

  if ((m.autoplayData !== null) && (m.autoplayData.trackId !== null))
  {
    const trackElement = listControls.queryTrack(`[data-track-id="${m.autoplayData.trackId}"]`);

    if (trackElement !== null)
      m.currentTrackId = trackElement.id;
    else
      showSnackbar({ message: 'Unable to cue track (not found)', duration: 5 });
  }

  listControls.setInitialTrack(m.currentTrackId);

  const trackType = debug.getKeyForValue(TRACK_TYPE, getAttrTrackTypeById(m.currentTrackId));
  debug.log(`setInitialTrack() - trackType: ${trackType} - currentTrackId: ${m.currentTrackId} - autoplayData: ${(m.autoplayData !== null) ? JSON.stringify(m.autoplayData) : 'N/A'}`);
}


// ************************************************************************************************
//
// ************************************************************************************************

export function setCurrentTrack(nextTrackId, playTrack = true, isPointerClick = false)
{
  const nextTrackType = getAttrTrackTypeById(nextTrackId);

  debug.log(`setCurrentTrack() - nextTrackType: ${debug.getKeyForValue(TRACK_TYPE, nextTrackType)} - nextTrackId: ${nextTrackId} - playTrack: ${playTrack} - isPointerClick: ${isPointerClick}`);

  if (nextTrackId === m.currentTrackId)
  {
    togglePlayPause();
  }
  else
  {
    if (playbackControls.isPlaying() && (m.players.current.getTrackType() !== nextTrackType))
      m.players.current.stop();

    m.currentTrackId = nextTrackId;

    if (m.players.current.getTrackType() !== nextTrackType)
    {
      m.players.setCurrentPlayer(nextTrackType);
      listControls.showTrackTypePlayer(nextTrackType);
    }

    playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_CUE_TRACK, { trackId: nextTrackId, isPointerClick: isPointerClick });
    cueOrPlayCurrentTrack(playTrack);
  }
}

async function cueOrPlayCurrentTrack(playTrack, positionSeconds = 0)
{
  const trackUid = listControls.getCurrentTrackElement().getAttribute('data-track-source-uid');

  debug.log(`cueOrPlayCurrentTrack() - trackId: ${m.currentTrackId} (trackUid = "${trackUid}") - playTrack: ${playTrack} - position: ${positionSeconds}`);

  listControls.updateTrackDetails(m.players.current);
  playbackControls.updateTrackData(positionSeconds);

  m.players.current.resetState();

  if (playTrack)
  {
    if (await m.players.current.playTrackById(trackUid, positionSeconds))
      listControls.setCurrentTrackState(STATE.PLAYING, true);
  }
  else
  {
    if (await m.players.current.cueTrackById(trackUid, positionSeconds))
      listControls.setCurrentTrackState(STATE.PAUSED, true);

    if (positionSeconds !== 0)
      playbackControls.updateTimerAndProgress((positionSeconds * 1000), positionSeconds, m.players.current.getDuration());
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

export function play()
{
  m.players.current.play();
}

export function pause()
{
  m.players.current.pause();
}

export function togglePlayPause()
{
  if (m.currentTrackId === null)
    setCurrentTrack(listControls.queryTrack('div.track-entry.current').id);
  else
    playbackControls.isPlaying() ? pause() : play();
}

export function setVolume()
{
  m.players.current.setVolume(settings.playback.masterVolume);
}

export function toggleMute()
{
  settings.playback.masterMute = (settings.playback.masterMute === true) ? false : true;
  settings.playback.masterMute ? m.players.current.mute() : m.players.current.unMute();
}

export function prevTrack()
{
  const prevTrackId = listControls.getPrevPlayableId();

  m.players.current.getPosition((position) =>
  {
    if ((prevTrackId !== null) && (position <= 5))
    {
      setCurrentTrack(prevTrackId, playbackControls.isPlaying());
    }
    else if (position !== 0)
    {
      m.players.current.seekTo(0);
      playbackControls.updateTimerAndProgress(0, 0, m.players.current.getDuration());
    }
  });
}

export function nextTrack()
{
  const nextTrackId = listControls.getNextPlayableId();

  if (nextTrackId !== null)
    setCurrentTrack(nextTrackId, playbackControls.isPlaying());
}

export async function advanceToNextTrack(autoplay = false, isPlaybackError = false)
{
  const repeatMode  = isPlaybackError ? playbackControls.REPEAT.OFF : playbackControls.getRepeatMode();
  const nextTrackId = listControls.getNextPlayableId();

  debug.log(`advanceToNextTrack() - autoplay: ${autoplay} - isPlaybackError: ${isPlaybackError} - nextTrackId: ${nextTrackId} - repeatMode: ${debug.getKeyForValue(playbackControls.REPEAT, repeatMode)}`);

  if (autoplay && (repeatMode === playbackControls.REPEAT.ONE))
  {
    m.players.current.seekTo(0);
    m.players.current.play();
  }
  else if (autoplay && (nextTrackId === null) && (repeatMode === playbackControls.REPEAT.ALL))
  {
    setCurrentTrack(listControls.getNextPlayableId(null)); // getNextPlayableId(null) means the nextTrackId will come from the top of the playlist
    playerScrollTo(0);
  }
  else
  {
    if (nextTrackId === null)
    {
      if (settings.list.showLoadMoreTracks)
      {
        const tracksLoaded = await listControls.loadMoreTracks();

        if (autoplay && tracksLoaded)
          setCurrentTrack(listControls.getNextPlayableId());
      }
      else
      {
        autoplayNavTo(response.nextPage, autoplay);
      }
    }
    else
    {
      autoplay ? setCurrentTrack(nextTrackId) : listControls.setCurrentTrackState(STATE.PAUSED);
    }
  }
}

export function skipToNextTrack()
{
  if (playbackControls.isPlaying() === false)
  {
    m.eventLog.add(m.eventLog.SOURCE.ULTRAFUNK, m.eventLog.EVENT.RESUME_AUTOPLAY);
    advanceToNextTrack(true, true);
  }
}

export function stopSkipToNextTrack()
{
  m.currentTrackId = null;
  listControls.setCurrentTrackState(STATE.PAUSED);
}

export function getStatus(getCurrentTrackNum = false)
{
  let currentTrackElement = null;

  (m.currentTrackId !== null)
    ? currentTrackElement = listControls.queryTrackId(m.currentTrackId)
    : currentTrackElement = listControls.queryTrack('div.track-entry.current');

  if (currentTrackElement !== null)
  {
    let currentTrackIndex = 0;

    if (getCurrentTrackNum)
    {
      const allTracksList = listControls.queryTrackAll('div.track-entry');
      currentTrackIndex = Array.prototype.indexOf.call(allTracksList, currentTrackElement);
      debug.log(`getStatus() - currentTrackNum: ${currentTrackIndex + 1} - trackId: ${currentTrackElement.getAttribute('data-track-id')}`);
    }

    const playerElementIds = [ '', 'youtube-player', 'soundcloud-player', 'local-player' ];

    const status = {
      isPlaying:      playbackControls.isPlaying(),
      currentTrack:   (currentTrackIndex + 1),
      trackType:      m.players.current.getTrackType(),
      position:       0,
      numTracks:      1,
      trackId:        currentTrackElement.getAttribute('data-track-id'),
      trackElementId: currentTrackElement.id,
      playerId:       playerElementIds[m.players.current.getTrackType()],
    };

    if (getCurrentTrackNum)
    {
      return new Promise((resolve) =>
      {
        m.players.current.getPosition((positionSeconds) =>
        {
          status.position = Math.round(positionSeconds);
          resolve(status);
        });
      });
    }

    return status;
  }

  return { isPlaying: false, currentTrack: 1, position: 0, trackId: 0 };
}


// ************************************************************************************************
//
// ************************************************************************************************

export function onEmbeddedPlayersReady(players, initialTrackType)
{
  debug.log(`onEmbeddedPlayersReady(): ${debug.getKeyForValue(TRACK_TYPE, initialTrackType)}`);

  m.players = players;

  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PLAYING,     onMediaPlaying);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_ENDED,       () => advanceToNextTrack(settings.playback.autoplay));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_UNAVAILABLE, onMediaUnavailable);
  playbackEvents.addListener(playbackEvents.EVENT.AUTOPLAY_BLOCKED,  onAutoplayBlocked);

  playbackControls.ready(prevTrack, togglePlayPause, nextTrack, toggleMute);
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 66 });

  playbackTimer.ready(m.players);
  listControls.ready();

  m.players.setCurrentPlayer(initialTrackType);
  listControls.showTrackTypePlayer(initialTrackType);

  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_READY, { resetProgressBar: false });
  cueOrPlayCurrentTrack((m.autoplayData?.autoplay === true), (m.autoplayData?.position ?? 0));
}

function onMediaPlaying()
{
  dismissSnackbar(m.currentSnackbarId);

  if (m.firstStatePlaying)
  {
    m.firstStatePlaying = false;

    setTimeout(() =>
    {
      if (settings.playback.autoplay        &&
          playbackControls.isPlaying()      &&
          (Math.round(window.scrollY) <= 1) &&
          matchesMedia(MATCH.SITE_MAX_WIDTH_MOBILE))
      {
        playerScrollTo(0);
      }
    },
    6000);
  }
}

function onMediaUnavailable()
{
  if (m.players.current.isCued() === false)
  {
    playbackControls.updateProgressPercent(0);
    listControls.setTrackMessage('Error!');

    showSnackbar({
      message: 'Unable to play track, skipping to next',
      duration: 5,
      actionText: 'Stop',
      actionClickCallback: stopSkipToNextTrack,
      afterCloseCallback:  skipToNextTrack,
    });
  }
}

function onAutoplayBlocked()
{
  listControls.setCurrentTrackState(STATE.PAUSED);

  m.currentSnackbarId = showSnackbar({
    message: 'Autoplay blocked, Play to continue',
    duration: 0,
    actionText: 'play',
    actionClickCallback: () => play(),
  });
}
