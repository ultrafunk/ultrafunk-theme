//
// Embedded players (YouTube, SoundCloud & Local HTML Audio)
//
// https://ultrafunk.com
//


import * as playbackEvents   from '../common/playback-events.js';
import * as listControls     from './list-controls.js';
import * as playbackControls from '../common/playback-controls.js';
import { newDebugLogger }    from '../../shared/debuglogger.js';
import { TRACK_TYPE }        from '../common/mediaplayer.js';
import { initLocalTracks }   from './local-tracks.js';
import { playbackTimer }     from './list-playback-timer.js';
import { ListPlayers }       from './list-players.js';
import { settings }          from '../../shared/session-data.js';
import { STATE }             from '../common/element-wrappers.js';
import { getTimeString }     from '../../shared/utils.js';

import {
  onPlaybackReady,
  onPlaybackPlaying,
  onPlaybackError,
  onPlaybackAutoplayBlocked,
  advanceToNextTrack,
} from './list-playback.js';


/*************************************************************************************************/


const debug = newDebugLogger('embedded-players');

const m = {
  players:        null,
  autoplayData:   null,
  currentTrackId: null,
  playerReady:    false,
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

export function onPlayerError(trackType, errorNum = 0)
{
  if (trackType === TRACK_TYPE.YOUTUBE)
  {
    m.players.current.setPlayerError(errorNum);
  }
  else if (trackType === TRACK_TYPE.SOUNDCLOUD)
  {
    // SoundCloud player can trigger this too early because the initial widget load results in 404,
    // so we skip error handling until the players are actually ready for playback...
    if (m.playerReady === false)
      return;

    m.players.current.setIsPlayable(false);
    listControls.setCurrentTrackState(STATE.PAUSED);
  }

  debug.log(`onPlayerError(${(errorNum !== 0) ? errorNum : ''}) - trackType: ${debug.getKeyForValue(TRACK_TYPE, trackType)} - trackId: ${m.currentTrackId} - isCued: ${m.players.current.isCued()}`);

  onPlaybackError();
}

function onFirstPlayerReady()
{
  if (m.playerReady === false)
  {
    m.playerReady = true;

    if ((m.autoplayData?.position ?? 0) === 0)
    {
      playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 100 });

      setTimeout(() =>
      {
        if (playbackControls.isPlaying() === false)
          playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 0 });
      },
      100);
    }

    m.autoplayData = null;
  }
}

function onLoadingState()
{
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_LOADING);
}

function onPlayingState()
{
  onPlaybackPlaying();
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PLAYING);
}

function onPausedState()
{
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_PAUSED);
}

function onEndedState()
{
  playbackTimer.stop();
  playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_ENDED);
  advanceToNextTrack(settings.playback.autoplay);
}

function setPlayerVolumeMute()
{
  debug.log(`setPlayerVolumeMute(${debug.getKeyForValue(TRACK_TYPE, m.players.current.getTrackType())}) - masterVolume: ${settings.playback.masterVolume} - masterMute: ${settings.playback.masterMute}`);

  settings.playback.masterMute ? m.players.current.mute() : m.players.current.unMute();
  m.players.current.setVolume(settings.playback.masterVolume);
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
      onAutoplayBlocked: onPlaybackAutoplayBlocked,
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
      onLoadingState();
      setPlayerVolumeMute();
      break;

    case YT.PlayerState.PLAYING: onPlayingState(); break; // eslint-disable-line no-undef
    case YT.PlayerState.PAUSED:  onPausedState();  break; // eslint-disable-line no-undef
    case YT.PlayerState.ENDED:   onEndedState();   break; // eslint-disable-line no-undef
  }
}


// ************************************************************************************************
// SoundCloud player init and state change handling
// ************************************************************************************************

function initSoundCloudPlayer()
{
  const player = SC.Widget('soundcloud-player');                              // eslint-disable-line no-undef
  player.bind(SC.Widget.Events.READY, () => onSoundCloudPlayerReady(player)); // eslint-disable-line no-undef
  return player;
}

function onSoundCloudPlayerReady(player)
{
  debug.log('onSoundCloudPlayerReady()');

  /* eslint-disable */
  player.bind(SC.Widget.Events.PLAY,   () => onSoundCloudPlayerStateChange('playing'));
  player.bind(SC.Widget.Events.PAUSE,  () => onSoundCloudPlayerStateChange('paused'));
  player.bind(SC.Widget.Events.FINISH, () => onSoundCloudPlayerStateChange('ended'));
  player.bind(SC.Widget.Events.ERROR,  () => onPlayerError(TRACK_TYPE.SOUNDCLOUD));
  /* eslint-enable */
}

export function onSoundCloudPlayerStateChange(playerState)
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
    case 'ready':
      {
        onFirstPlayerReady();
        setPlayerVolumeMute();

        const trackElement = listControls.getCurrentTrackElement();

        trackElement.setAttribute('data-track-duration', m.players.current.getDuration());
        trackElement.querySelector('div.track-duration').textContent = getTimeString(m.players.current.getDuration());
        trackElement.setAttribute('data-track-thumbnail-url', m.players.current.getThumbnailSrc());
        trackElement.querySelector('button.thumbnail img').src = m.players.current.getThumbnailSrc();

        playbackControls.updateTrackData(0);
      }
      break;

    case 'loading': onLoadingState(); break;
    case 'playing': onPlayingState(); break;
    case 'paused':  onPausedState();  break;
    case 'ended':   onEndedState();   break;
  }
}


// ************************************************************************************************
// Local HTML <audio> player init and state change handling
// ************************************************************************************************

function initLocalPlayer()
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

export function onLocalPlayerStateChange(event)
{
  if (m.players.current.getTrackType() !== TRACK_TYPE.LOCAL)
    return;

  debug.log(`onLocalPlayerStateChange: ${event.type.toUpperCase()} (trackId: ${m.currentTrackId})`);

  switch (event.type)
  {
    case 'durationchange':
      {
        const duration = Math.round(m.players.current.getDuration());

        m.players.current.setDuration(duration);
        listControls.getCurrentTrackElement().setAttribute('data-track-duration', duration);
        listControls.getCurrentTrackElement().querySelector('div.track-duration').textContent = getTimeString(duration);
        playbackControls.updateTrackData(0);
      }
      break;

    case 'cued':  setPlayerVolumeMute(); break;
    case 'play':  onPlayingState();      break;
    case 'pause': onPausedState();       break;
    case 'ended': onEndedState();        break;
  }
}