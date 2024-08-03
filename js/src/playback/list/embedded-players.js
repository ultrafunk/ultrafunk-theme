//
// Embedded players (YouTube, SoundCloud, Local HTML Audio)
//
// https://ultrafunk.com
//


import { newDebugLogger }    from '../../shared/debuglogger.js';
import * as playbackEvents   from '../common/playback-events.js';
import * as listControls     from './list-controls.js';
import * as playbackControls from '../common/playback-controls.js';
import { TRACK_TYPE }        from '../common/mediaplayer.js';
import { initLocalTracks }   from './local-tracks.js';
import { playbackTimer }     from './list-playback-timer.js';
import { ListPlayers }       from './list-players.js';
import { settings }          from '../../shared/session-data.js';
import { STATE }             from '../common/element-wrappers.js';
import { playerScrollTo }    from '../common/shared-gallery-list.js';

import {
  MATCH,
  getTimeString,
  matchesMedia,
} from '../../shared/utils.js';

import {
  showSnackbar,
  dismissSnackbar,
} from '../../shared/snackbar.js';

import {
  onPlaybackReady,
  advanceToNextTrack,
  skipToNextTrack,
  stopSkipToNextTrack,
} from './list-playback.js';


/*************************************************************************************************/


const debug = newDebugLogger('embedded-players');

const m = {
  players:           null,
  autoplayData:      null,
  currentTrackId:    null,
  playerReady:       false,
  firstStatePlaying: true,
  currentSnackbarId: 0,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function init(autoplayData, currentTrackId)
{
  debug.log('init()');

  m.autoplayData   = autoplayData;
  m.currentTrackId = currentTrackId;

  window.onYouTubeIframeAPIReady = () =>
  {
    debug.log('onYouTubeIframeAPIReady()');

    m.players = new ListPlayers(initYouTubePlayer(), initSoundCloudPlayer(), initLocalPlayer());
    debug.log(m.players);

    playbackControls.init((positionSeconds) => m.players.getTrackData(positionSeconds), (positionSeconds) => m.players.current.seekTo(positionSeconds));
    playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 33 });
  };

  const tag = document.createElement('script');
  tag.id    = 'youtube-iframe-api';
  tag.src   = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


// ************************************************************************************************
// Shared functions for all player types
// ************************************************************************************************

function onFirstPlayerReady()
{
  if (m.playerReady === false)
  {
    m.playerReady = true;

    if ((m.autoplayData?.position ?? 0) === 0)
      playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 0 });

    m.autoplayData = null;
  }
}

export function onPlayerError(trackType, errorNum = 0)
{
  debug.log(`onPlayerError(${(errorNum !== 0) ? errorNum : ''}) - trackType: ${debug.getKeyForValue(TRACK_TYPE, trackType)} - trackId: ${m.currentTrackId} - isCued: ${m.players.current.isCued()}`);

  if (trackType === TRACK_TYPE.YOUTUBE)
  {
    m.players.current.setPlayerError(errorNum);
  }
  else if (trackType === TRACK_TYPE.SOUNDCLOUD)
  {
    m.players.current.setIsPlayable(false);
    listControls.setCurrentTrackState(STATE.PAUSED);
  }

  if (m.players.current.isCued() === false)
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


// ************************************************************************************************
// YouTube player init and state change handling
// ************************************************************************************************

function initYouTubePlayer()
{
  // eslint-disable-next-line no-undef
  const player = new YT.Player('youtube-player',
  {
    events:
    {
      onReady:           () => onPlaybackReady(m.players),
      onStateChange:     onYouTubePlayerStateChange,
      onError:           (event) => onPlayerError(TRACK_TYPE.YOUTUBE, event.data),
      onAutoplayBlocked: onYouTubePlayerAutoplayBlocked,
    },
    playerVars: {
      'disablekb': 1,
    },
  });

  return player;
}

function onYouTubePlayerStateChange(event)
{
  if (m.players.current.getTrackType() !== TRACK_TYPE.YOUTUBE)
    return;

  // eslint-disable-next-line no-undef
  debug.log(`onYouTubePlayerStateChange: ${debug.getKeyForValue(YT.PlayerState, event.data)} (trackId: ${m.currentTrackId})`);

  // Set playback controls state to current YouTube Player state so we have a single source of truth:
  // playbackControls.isPlaying()
  if (event.data !== YT.PlayerState.PLAYING) // eslint-disable-line no-undef
    playbackControls.setPauseState();

  switch (event.data)
  {
    // eslint-disable-next-line no-undef
    case YT.PlayerState.UNSTARTED:
      onFirstPlayerReady();
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
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PAUSED);
      break;

    // eslint-disable-next-line no-undef
    case YT.PlayerState.ENDED:
      playbackTimer.stop();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_ENDED);
      advanceToNextTrack(settings.playback.autoplay);
      break;
  }
}

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
          matchesMedia(MATCH.SITE_MAX_WIDTH_MOBILE))
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
    actionClickCallback: () => m.players.current.play(onPlayerError),
  });
}


// ************************************************************************************************
// SoundCloud player init and state change handling
// ************************************************************************************************

export function initSoundCloudPlayer()
{
  const player = SC.Widget('soundcloud-player');                        // eslint-disable-line no-undef
  player.bind(SC.Widget.Events.READY, () => onSoundCloudPlayerReady(player)); // eslint-disable-line no-undef
  return player;
}

function onSoundCloudPlayerReady(player)
{
  debug.log('onSoundCloudPlayerReady()');

  m.players.setOnPlayerStateChange(onSoundCloudPlayerStateChange);

  /* eslint-disable */
  player.bind(SC.Widget.Events.PLAY,   (event) => onSoundCloudPlayerStateChange('playing', event));
  player.bind(SC.Widget.Events.PAUSE,  (event) => onSoundCloudPlayerStateChange('paused',  event));
  player.bind(SC.Widget.Events.FINISH, (event) => onSoundCloudPlayerStateChange('ended',   event));
  player.bind(SC.Widget.Events.ERROR,  ()      => onPlayerError(TRACK_TYPE.SOUNDCLOUD));
  /* eslint-enable */
}

async function onSoundCloudPlayerStateChange(playerState)
{
  if (m.players.current.getTrackType() !== TRACK_TYPE.SOUNDCLOUD)
    return;

  debug.log(`onSoundCloudPlayerStateChange: ${playerState.toUpperCase()} (trackId: ${m.currentTrackId})`);

  // Set playback controls state to current SoundCloud Player state so we have a single source of truth:
  // playbackControls.isPlaying()
  if (playerState !== 'playing')
    playbackControls.setPauseState();

  switch (playerState)
  {
    case 'loading':
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_LOADING);
      break;

    case 'ready':
      {
        onFirstPlayerReady();

        const trackElement = listControls.getCurrentTrackElement();

        trackElement.setAttribute('data-track-duration', m.players.current.getDuration());
        trackElement.querySelector('div.track-duration').textContent = getTimeString(m.players.current.getDuration());
        trackElement.setAttribute('data-track-thumbnail-url', m.players.current.getThumbnailSrc());
        trackElement.querySelector('button.thumbnail img').src = m.players.current.getThumbnailSrc();

        playbackControls.updateTrackData(0);
      }
      break;

    case 'playing':
      onYouTubeStatePlaying();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PLAYING);
      break;

    case 'paused':
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PAUSED);
      break;

    case 'ended':
      playbackTimer.stop();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_ENDED);
      advanceToNextTrack(settings.playback.autoplay);
      break;
  }
}


// ************************************************************************************************
// Local player init and state change handling
// ************************************************************************************************

export function initLocalPlayer()
{
  if (settings.experimental.enableLocalPlayback)
  {
    initLocalTracks();

    const player = document.getElementById('local-audio-player');

    player.addEventListener('play',           onLocalPlayerStateChange);
    player.addEventListener('pause',          onLocalPlayerStateChange);
    player.addEventListener('ended',          onLocalPlayerStateChange);
    player.addEventListener('durationchange', onLocalPlayerStateChange);

    return player;
  }
}

function onLocalPlayerStateChange(event)
{
  if (m.players.current.getTrackType() !== TRACK_TYPE.LOCAL)
    return;

  debug.log(`onLocalPlayerStateChange: ${event.type.toUpperCase()} (trackId: ${m.currentTrackId})`);

  switch (event.type)
  {
    case 'play':
      onYouTubeStatePlaying();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PLAYING);
      break;

    case 'pause':
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PAUSED);
      break;

    case 'ended':
      playbackTimer.stop();
      playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_ENDED);
      advanceToNextTrack(settings.playback.autoplay);
      break;

    case 'durationchange':
      {
        const duration = Math.round(m.players.current.getDuration());

        m.players.current.setDuration(duration);
        listControls.getCurrentTrackElement().setAttribute('data-track-duration', duration);
        listControls.getCurrentTrackElement().querySelector('div.track-duration').textContent = getTimeString(duration);
        playbackControls.updateTrackData(0);
      }
      break;
  }
}
