//
// Embedded players
//
// https://ultrafunk.com
//


import * as playbackEvents from '../common/playback-events.js';
import { newDebugLogger }  from '../../shared/debuglogger.js';
import { settings }        from '../../shared/session-data.js';
import { PlaybackLog }     from '../common/eventlogger.js';

import {
  eventHandlerProxy,
  onEmbeddedPlayersReady
} from './gallery-playback.js';

import {
  TRACK_TYPE,
  getDataTrackType
} from '../common/mediaplayer.js';

import {
 YouTubePlayer,
 SoundCloudPlayer,
} from './gallery-players.js';


/*************************************************************************************************/


const debug = newDebugLogger('embedded-players');
export const eventLog = new PlaybackLog(10);

const m = {
  players:         {},
  playbackState:   null,
  loadEventsTotal: 0,
  loadEventsCount: 1,
};

const config = {
  maxPlaybackStartDelay: 3, // VERY rough estimate of "max" network buffering delay in seconds (see also: maxBufferingDelay)
};


// ************************************************************************************************
//
// ************************************************************************************************

export function initEmbeddedPlayers(players, playbackState)
{
  debug.log('init()');

  m.players       = players;
  m.playbackState = playbackState;

  // The total number of loadEvents include 3 stages before embedded players are loaded
  m.loadEventsTotal = 3 + parseInt(document.body.getAttribute('data-gallery-track-count'));

  initYouTubeAPI();
  initSoundCloudAPI();
}

function getLoadingPercent()
{
  return { loadingPercent: (100 * (m.loadEventsCount++ / m.loadEventsTotal)) };
}

function updatePlayersReady()
{
  if (m.loadEventsCount >= m.loadEventsTotal)
    onEmbeddedPlayersReady();
  else
    playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, getLoadingPercent());
}


// ************************************************************************************************
// Get and wrap all embedder players in MediaPlayer YouTube or SoundCloud classes
// ************************************************************************************************

function getAllPlayers()
{
  const elements = document.querySelectorAll('single-track, gallery-track');

  elements.forEach(element =>
  {
    const trackType = getDataTrackType(element);
    const iframe    = element.querySelector('iframe');
    let player      = null;

    if (trackType === TRACK_TYPE.YOUTUBE)
    {
      if ((elements.length === 1) && (iframe === null))
        player = getYouTubePlayer('youtube-player', element, true);
      else
        player = getYouTubePlayer(iframe.id, element, false);

      player.setDuration(parseInt(element.getAttribute('data-track-duration')));
    }
    else if (trackType === TRACK_TYPE.SOUNDCLOUD)
    {
      /* eslint-disable */
      const embeddedPlayer = SC.Widget(iframe.id);
      player = new SoundCloudPlayer(element.id, iframe.id, embeddedPlayer);

      embeddedPlayer.bind(SC.Widget.Events.READY,  () => onSoundCloudPlayerEventReady(iframe.id, element, player, embeddedPlayer));
      embeddedPlayer.bind(SC.Widget.Events.PLAY,   () => onSoundCloudPlayerEventPlay(iframe.id));
      embeddedPlayer.bind(SC.Widget.Events.PAUSE,  () => onSoundCloudPlayerEventPause(iframe.id));
      embeddedPlayer.bind(SC.Widget.Events.FINISH, () => onSoundCloudPlayerEventFinish(iframe.id));
      embeddedPlayer.bind(SC.Widget.Events.ERROR,  () => onSoundCloudPlayerEventError(iframe.id));
      /* eslint-enable */
    }

    if (player !== null)
    {
      player.setArtistAndTitle(element.getAttribute('data-track-artist'), element.getAttribute('data-track-title'));
      m.players.add(player);
    }
  });
}

function getYouTubePlayer(playerId, element, isSingleTrackPlayer = false)
{
  const videoId = element.getAttribute('data-track-source-uid');

  const embeddedPlayer = new YT.Player(playerId, // eslint-disable-line no-undef
  {
    events:
    {
      onReady:           (event) => onYouTubePlayerReady(event, playerId),
      onStateChange:     (event) => onYouTubePlayerStateChange(event, playerId),
      onError:           (event) => onYouTubePlayerError(event, playerId),
      onAutoplayBlocked: ()      => eventHandlerProxy(playbackEvents.EVENT.AUTOPLAY_BLOCKED),
    },
    playerVars: {
      'disablekb': 1,
    },
    ...isSingleTrackPlayer && { videoId: videoId },
  });

  return new YouTubePlayer(element.id, playerId, embeddedPlayer, videoId);
}


// ************************************************************************************************
// Helper functions for the YouTube and SoundCloud MediaPlayer classes
// ************************************************************************************************

export function onPlayerError(player, mediaUrl)
{
  debug.log('onPlayerError()');
  debug.log(player);

  const eventSource = (player.getTrackType() === TRACK_TYPE.YOUTUBE)
                        ? eventLog.SOURCE.YOUTUBE
                        : eventLog.SOURCE.SOUNDCLOUD;

  // Stop the current track if it is not the one we are going to next
  if (m.players.isCurrent(player.getIframeId()) === false)
    m.players.stop();

  eventLog.add(eventSource, eventLog.EVENT.PLAYER_ERROR, player.getIframeId());
  eventHandlerProxy(playbackEvents.EVENT.MEDIA_UNAVAILABLE, getPlayerErrorData(player, mediaUrl));
}

function getPlayerErrorData(player, mediaUrl)
{
  const artist = player.getArtist() || 'N/A';
  const title  = player.getTitle()  || 'N/A';

  return {
    currentTrack: m.players.trackNumFromIframeId(player.getIframeId()),
    numTracks:    m.players.getNumTracks(),
    trackId:      player.getTrackId(),
    trackType:    player.getTrackType(),
    mediaTitle:   `${artist} - ${title}`,
    mediaUrl:     mediaUrl,
  };
}


// ************************************************************************************************
// YouTube init and event functions
// https://developers.google.com/youtube/iframe_api_reference
// ************************************************************************************************

function initYouTubeAPI()
{
  debug.log('initYouTubeAPI()');
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, getLoadingPercent());

  window.onYouTubeIframeAPIReady = () =>
  {
    debug.log('onYouTubeIframeAPIReady()');
    playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, getLoadingPercent());

    // ToDo: THIS SHOULD NOT BE TRIGGERED HERE ONLY?
    getAllPlayers();
  };

  const tag = document.createElement('script');
  tag.id    = 'youtube-iframe-api';
  tag.src   = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubePlayerReady(event, iframeId)
{
  const player = m.players.playerFromIframeId(iframeId);

  // YT.PlayerState.UNSTARTED (-1) here means the video is not available or playable anymore,
  // so we set playbable to false for later use...
  // ToDo: This is _NOT_ documented or official behaviour, so it could change at any time!
  if (event.target.getPlayerState() === -1)
  {
    debug.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${iframeId} => ${player.getSourceUid()} => ${player.getArtist()} - "${player.getTitle()}"`);
    player.setIsPlayable(false);
  }
  else
  {
    debug.log(`onYouTubePlayerReady(): ${iframeId} => ${player.getSourceUid()} => ${player.getArtist()} - ${player.getTitle()}`);
  }

  updatePlayersReady();
}

function onYouTubePlayerStateChange(event, iframeId)
{
  eventLog.add(eventLog.SOURCE.YOUTUBE, event.data, iframeId);

  switch (event.data)
  {
    /* eslint-disable */
    case YT.PlayerState.UNSTARTED: onYouTubeStateUnstarted(iframeId); break;
    case YT.PlayerState.BUFFERING: onYouTubeStateBuffering(iframeId); break;
    case YT.PlayerState.PLAYING:   onYouTubeStatePlaying(iframeId);   break;
    case YT.PlayerState.PAUSED:    onYouTubeStatePaused(iframeId);    break;
    case YT.PlayerState.CUED:      onYouTubeStateCued(iframeId);      break;
    case YT.PlayerState.ENDED:     onYouTubeStateEnded(iframeId);     break;
    /* eslint-enable */
  }
}

function onYouTubeStateUnstarted(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: UNSTARTED (iframeId: ${iframeId})`);
}

function onYouTubeStateBuffering(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: BUFFERING (iframeId: ${iframeId})`);

  if (m.players.crossfade.isFading() === false)
  {
    const player = m.players.playerFromIframeId(iframeId);
    player.mute(settings.playback.masterMute);
    player.setVolume(settings.playback.masterVolume);
    playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_LOADING);
  }
}

function onYouTubeStatePlaying(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: PLAYING   (iframeId: ${iframeId})`);

  // Call order is important on play events for state handling: Always sync first!
  m.playbackState.sync(iframeId, m.playbackState.STATE.PLAY);
}

function onYouTubeStatePaused(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: PAUSED    (iframeId: ${iframeId})`);

  if (m.players.isCurrent(iframeId))
    m.playbackState.sync(iframeId, m.playbackState.STATE.PAUSE);
  else
    m.players.crossfade.stop();
}

function onYouTubeStateCued(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: CUED      (iframeId: ${iframeId})`);
}

function onYouTubeStateEnded(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: ENDED     (iframeId: ${iframeId})`);

  if (m.players.isCurrent(iframeId))
    eventHandlerProxy(playbackEvents.EVENT.MEDIA_ENDED);
  else
    m.players.crossfade.stop();
}

function onYouTubePlayerError(event, iframeId)
{
  const player = m.players.playerFromIframeId(iframeId);

  debug.log(`onYouTubePlayerError(${(event.data !== null) ? event.data : 'null'}) - iframeId: ${iframeId} - isCued: ${player.isCued()} - isPlayable: ${player.isPlayable()}`);

  if ((event.data !== null) && player.isCued())
  {
    player.setIsCued(false);
    player.setIsPlayable(false);
  }
  else if ((event.data !== null) && player.isPlayable())
  {
    player.setIsPlayable(false);
    onPlayerError(player, event.target.getVideoUrl());
  }
}


// ************************************************************************************************
// SoundCloud init and event functions
// https://developers.soundcloud.com/docs/api/html5-widget
// ************************************************************************************************

function initSoundCloudAPI()
{
  debug.log('initSoundCloudAPI()');
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, getLoadingPercent());
}

function onSoundCloudPlayerEventReady(iframeId, element, player, embeddedPlayer)
{
  debug.log(`onSoundCloudPlayerEventReady(): ${iframeId} => ${player.getArtist()} - ${player.getTitle()}`);

  player.setThumbnail(element);

  embeddedPlayer.getDuration(durationMilliseconds =>
  {
    player.setDuration(Math.round(durationMilliseconds / 1000));
    element.setAttribute('data-track-duration', player.getDuration());
    updatePlayersReady();
  });
}

function onSoundCloudPlayerEventPlay(iframeId)
{
  debug.log(`onSoundCloudPlayerEvent: PLAY   (iframeId: ${iframeId})`);
  eventLog.add(eventLog.SOURCE.SOUNDCLOUD, eventLog.EVENT.STATE_PLAYING, iframeId);

  if (m.players.crossfade.isFading() && m.players.isCurrent(iframeId))
  {
    // Call order is important on play events for state handling: Always sync first!
    if (eventLog.scPlayDoubleTrigger(iframeId, (config.maxPlaybackStartDelay * 1000)))
      m.playbackState.sync(iframeId, m.playbackState.STATE.PLAY);
  }
  else
  {
    // Call order is important on play events for state handling: Always sync first!
    m.playbackState.sync(iframeId, m.playbackState.STATE.PLAY);
    m.players.current.mute(settings.playback.masterMute);
    m.players.current.setVolume(settings.playback.masterVolume);
  }
}

function onSoundCloudPlayerEventPause(iframeId)
{
  debug.log(`onSoundCloudPlayerEvent: PAUSE  (iframeId: ${iframeId})`);
  eventLog.add(eventLog.SOURCE.SOUNDCLOUD, eventLog.EVENT.STATE_PAUSED, iframeId);

  if (eventLog.scAutoplayBlocked(iframeId, 3000))
  {
    eventHandlerProxy(playbackEvents.EVENT.AUTOPLAY_BLOCKED);
  }
  else
  {
    // Only sync state if we get pause events on the same (current) player
    if (m.players.isCurrent(iframeId))
    {
      m.players.current.getPosition(positionMilliseconds =>
      {
        if (positionMilliseconds > 0)
          m.playbackState.sync(iframeId, m.playbackState.STATE.PAUSE);
      });
    }
    else
    {
      m.players.crossfade.stop();
    }
  }
}

function onSoundCloudPlayerEventFinish(iframeId)
{
  debug.log(`onSoundCloudPlayerEvent: FINISH (iframeId: ${iframeId})`);

  if (m.players.isCurrent(iframeId))
    eventHandlerProxy(playbackEvents.EVENT.MEDIA_ENDED);
  else
    m.players.crossfade.stop();
}

function onSoundCloudPlayerEventError(iframeId)
{
  const player = m.players.playerFromIframeId(iframeId);

  debug.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${player.getIframeId()} => ${player.getArtist()} - "${player.getTitle()}"`);
  player.setIsPlayable(false);
}
