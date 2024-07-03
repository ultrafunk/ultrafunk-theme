//
// List playback module
//
// https://ultrafunk.com
//


import * as playbackControls  from '../common/playback-controls.js';
import * as listControls      from './list-controls.js';
import * as mediaPlayers      from '../common/mediaplayers.js';
import * as playbackEvents    from '../common/playback-events.js';
import * as utils             from '../../shared/utils.js';
import { newDebugLogger }     from '../../shared/debuglogger.js';
import { KEY }                from '../../shared/storage.js';
import { STATE }              from '../common/element-wrappers.js';
import { showModal }          from '../../shared/modal.js';
import { playbackTimer }      from './list-playback-timer.js';
import { response, settings } from '../../shared/session-data.js';
import { initTrackSearch }    from './track-search.js';

import {
  playerScrollTo,
  autoplayNavTo,
} from '../common/shared-gallery-list.js';

import {
  showSnackbar,
  dismissSnackbar,
} from '../../shared/snackbar.js';


/*************************************************************************************************/


const debug = newDebugLogger('list-playback');

const m = {
  player:            null,
  autoplayData:      null,
  playerReady:       false,
  firstStatePlaying: true,
  currentTrackId:    null,
  currentSnackbarId: 0,
};

const noPlayableTracksError = /*html*/ `
  <p>The List Player only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the Gallery Player or by clicking / tapping on the track Artist + Title text link in the List Player.</p>
  <p>To toggle between the Gallery and List players, please use the Pref. Player: GALLERY / LIST setting toggle button in the sites footer area.</p>`;


// ************************************************************************************************
//
// ************************************************************************************************

export function init()
{
  debug.log('init()');

  listControls.init();
  initTrackSearch();

  if (cueInitialTrack() !== null)
  {
    initYouTubeAPI();
  }
  else
  {
    showSnackbar({
      message: 'No playable YouTube tracks!',
      duration: 0,
      actionText: 'help',
      actionClickCallback: () => showModal({ modalTitle: 'No playable tracks', modalBody: noPlayableTracksError }),
    });
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

function cueInitialTrack()
{
  m.currentTrackId = listControls.getNextPlayableId();
  m.autoplayData   = JSON.parse(sessionStorage.getItem(KEY.UF_AUTOPLAY));
  sessionStorage.removeItem(KEY.UF_AUTOPLAY);

  if (m.currentTrackId !== null)
  {
    if ((m.autoplayData !== null) && (m.autoplayData.trackId !== null))
    {
      const trackElement = listControls.queryTrack(`[data-track-id="${m.autoplayData.trackId}"]`);

      if (trackElement !== null)
      {
        if (listControls.getTrackType(trackElement) === mediaPlayers.TRACK_TYPE.YOUTUBE)
        {
          m.currentTrackId = trackElement.id;
        }
        else
        {
          showSnackbar({
            message: 'Cannot play SoundCloud track',
            duration: 5,
            actionText: 'help',
            actionClickCallback: () => showModal({ modalTitle: 'Cannot play SoundCloud track', modalBody: noPlayableTracksError }),
          });
        }
      }
      else
      {
        showSnackbar({ message: 'Unable to cue track (not found)', duration: 5 });
      }
    }

    listControls.setCuedTrack(m.currentTrackId);
  }

  debug.log(`cueInitialTrack() - currentTrackId: ${m.currentTrackId} - autoplayData: ${(m.autoplayData !== null) ? JSON.stringify(m.autoplayData) : 'N/A'}`);

  return m.currentTrackId;
}


// ************************************************************************************************
//
// ************************************************************************************************

export function setCurrentTrack(nextTrackId, playTrack = true, isPointerClick = false)
{
  const nextTrackType = listControls.getTrackType(listControls.queryTrackId(nextTrackId));

  debug.log(`setCurrentTrack() - nextTrackType: ${debug.getKeyForValue(mediaPlayers.TRACK_TYPE, nextTrackType)} - nextTrackId: ${nextTrackId} - playTrack: ${playTrack} - isPointerClick: ${isPointerClick}`);

  if ((nextTrackType === mediaPlayers.TRACK_TYPE.SOUNDCLOUD) && isPointerClick)
  {
    showSnackbar({
      message: 'Cannot play SoundCloud track',
      duration: 5,
      actionText: 'help',
      actionClickCallback: () => showModal({ modalTitle: 'Cannot play SoundCloud track', modalBody: noPlayableTracksError }),
    });

    return;
  }

  if (nextTrackId === m.currentTrackId)
  {
    togglePlayPause();
  }
  else
  {
    if (playbackControls.isPlaying())
      m.player.embedded.stopVideo();

    m.currentTrackId = nextTrackId;
    playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_CUE_TRACK, { trackId: nextTrackId, isPointerClick: isPointerClick });
    cueOrPlayCurrentTrack(playTrack);
  }
}

function cueOrPlayCurrentTrack(playTrack, positionSeconds = 0)
{
  const sourceUid = listControls.updateTrackDetails();

  debug.log(`cueOrPlayCurrentTrack(): trackId: ${m.currentTrackId} (${sourceUid}) - playTrack: ${playTrack} - position: ${positionSeconds}`);

  m.player.resetState();

  if (playTrack)
  {
    m.player.playTrackById(sourceUid, positionSeconds);
    listControls.setCurrentTrackState(STATE.PLAYING);
  }
  else
  {
    m.player.cueTrackById(sourceUid, positionSeconds);
    listControls.setCurrentTrackState(STATE.PAUSED);

    if (positionSeconds !== 0)
      playbackControls.updateTimerAndProgress((positionSeconds * 1000), positionSeconds, m.player.getDuration());
  }

  playbackControls.updateTrackData(positionSeconds);
}


// ************************************************************************************************
//
// ************************************************************************************************

export function play()
{
  m.player.play(onYouTubePlayerError);
}

export function stop()
{
  if (m.player.embedded.getCurrentTime() > 0)
    m.player.embedded.stopVideo();

  playbackControls.updateTimerAndProgress(0, 0, m.player.getDuration());
}

export function pause()
{
  m.player.embedded.pauseVideo();
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
  m.player.setVolume(settings.playback.masterVolume);
}

export function toggleMute(setMuteSetting = true)
{
  if (setMuteSetting)
    settings.playback.masterMute = (settings.playback.masterMute === true) ? false : true;

  if (settings.playback.masterMute)
    m.player.embedded.mute();
  else
    m.player.embedded.unMute();
}

export function prevTrack()
{
  const prevTrackId = listControls.getPrevPlayableId();
  const position    = m.player.embedded.getCurrentTime();

  if ((prevTrackId !== null) && (position <= 5))
  {
    setCurrentTrack(prevTrackId, playbackControls.isPlaying());
  }
  else if (position !== 0)
  {
    m.player.seekTo(0);
    playbackControls.updateTimerAndProgress(0, 0, m.player.getDuration());
  }
}

export function nextTrack()
{
  const nextTrackId = listControls.getNextPlayableId();

  if (nextTrackId !== null)
    setCurrentTrack(nextTrackId, playbackControls.isPlaying());
}

async function advanceToNextTrack(autoplay = false, isPlaybackError = false)
{
  const repeatMode  = isPlaybackError ? playbackControls.REPEAT.OFF : playbackControls.getRepeatMode();
  const nextTrackId = listControls.getNextPlayableId();

  debug.log(`advanceToNextTrack() - autoplay: ${autoplay} - isPlaybackError: ${isPlaybackError} - nextTrackId: ${nextTrackId} - repeatMode: ${debug.getKeyForValue(playbackControls.REPEAT, repeatMode)}`);

  if (autoplay && (repeatMode === playbackControls.REPEAT.ONE))
  {
    m.player.seekTo(0);
    m.player.play(onYouTubePlayerError);
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

function skipToNextTrack()
{
  if (playbackControls.isPlaying() === false)
    advanceToNextTrack(true, true);
}

function stopSkipToNextTrack()
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

    return {
      isPlaying:    playbackControls.isPlaying(),
      currentTrack: (currentTrackIndex + 1),
      trackType:    mediaPlayers.TRACK_TYPE.YOUTUBE,
      position:     Math.ceil(m.player.embedded.getCurrentTime()),
      numTracks:    1,
      trackId:      currentTrackElement.getAttribute('data-track-id'),
      elementId:    currentTrackElement.id,
      iframeId:     'youtube-player',
    };
  }

  return { isPlaying: false, currentTrack: 1, position: 0, trackId: 0 };
}


// ************************************************************************************************
//
// ************************************************************************************************

function initYouTubeAPI()
{
  debug.log('initYouTubeAPI()');

  window.onYouTubeIframeAPIReady = function()
  {
    debug.log('onYouTubeIframeAPIReady()');

    // eslint-disable-next-line no-undef
    const embeddedPlayer = new YT.Player('youtube-player',
    {
      events:
      {
        onReady:           onYouTubePlayerReady,
        onStateChange:     onYouTubePlayerStateChange,
        onError:           onYouTubePlayerError,
        onAutoplayBlocked: onYouTubePlayerAutoplayBlocked,
      },
      playerVars: {
        'disablekb': 1,
      },
    });

    m.player = new mediaPlayers.Playlist(embeddedPlayer);
    debug.log(m.player);

    playbackControls.init((positionSeconds) => m.player.getTrackData(positionSeconds), (positionSeconds) => m.player.seekTo(positionSeconds));
    playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 33 });
  };

  const tag = document.createElement('script');
  tag.id    = 'youtube-iframe-api';
  tag.src   = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubePlayerReady()
{
  debug.log('onYouTubePlayerReady()');

  playbackControls.ready(prevTrack, togglePlayPause, nextTrack, toggleMute);
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 66 });
  playbackTimer.ready(m.player);
  listControls.ready(m.player);

  toggleMute(false);
  m.player.setVolume(settings.playback.masterVolume);
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_READY, { resetProgressBar: false });
  cueOrPlayCurrentTrack((m.autoplayData?.autoplay === true), (m.autoplayData?.position ?? 0));
}

function onYouTubePlayerStateChange(event)
{
  // eslint-disable-next-line no-undef
  debug.log(`onYouTubePlayerStateChange: ${debug.getKeyForValue(YT.PlayerState, event.data)} (trackId: ${m.currentTrackId})`);

  // Set playback controls state to YouTube state so we have a single source of truth = playbackControls.isPlaying()
  if (event.data !== YT.PlayerState.PLAYING) // eslint-disable-line no-undef
    playbackControls.setPauseState();

  switch (event.data)
  {
    // eslint-disable-next-line no-undef
    case YT.PlayerState.UNSTARTED:
      if (m.playerReady === false)
      {
        m.playerReady = true;

        if ((m.autoplayData?.position ?? 0) === 0)
          playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 0 });

        m.autoplayData = null;
      }
      break;

    // eslint-disable-next-line no-undef
    case YT.PlayerState.BUFFERING:
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_LOADING);
      break;

    // eslint-disable-next-line no-undef
    case YT.PlayerState.PLAYING:
      onYouTubeStatePlaying();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PLAYING);
      break;

    // eslint-disable-next-line no-undef
    case YT.PlayerState.PAUSED:
      listControls.setCurrentTrackState(STATE.PAUSED);
      break;

    // eslint-disable-next-line no-undef
    case YT.PlayerState.ENDED:
      playbackTimer.stop();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_ENDED);
      advanceToNextTrack(settings.playback.autoplay);
      break;
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

function onYouTubeStatePlaying()
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
          utils.matchesMedia(utils.MATCH.SITE_MAX_WIDTH_MOBILE))
      {
        playerScrollTo(0);
      }
    },
    6000);
  }
}

function onYouTubePlayerAutoplayBlocked()
{
  listControls.setCurrentTrackState(STATE.PAUSED);

  m.currentSnackbarId = showSnackbar({
    message: 'Autoplay blocked, Play to continue',
    duration: 0,
    actionText: 'play',
    actionClickCallback: () => m.player.play(onYouTubePlayerError),
  });
}

function onYouTubePlayerError(event)
{
  debug.log(`onYouTubePlayerError(${event.data}) - trackId: ${m.currentTrackId} - isCued: ${m.player.isCued()}`);

  m.player.setPlayerError(event.data);

  if (m.player.isCued() === false)
  {
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
