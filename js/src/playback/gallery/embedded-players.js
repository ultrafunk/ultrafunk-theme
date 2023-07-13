//
// Embedded players
//
// https://ultrafunk.com
//


import * as eventLogger    from '../eventlogger.js';
import * as mediaPlayers   from '../mediaplayers.js';
import * as playbackEvents from '../playback-events.js';
import { newDebugLogger }  from '../../shared/debuglogger.js';
import { settings }        from '../../shared/session-data.js';
import { playbackTimer }   from './gallery-playback-timer.js';


/*************************************************************************************************/


const debug = newDebugLogger('embedded-players');
export const eventLog = new eventLogger.Playback(10);

const m = {
  players:         {},
  playbackState:   null,
  embeddedEvent:   null,
  loadEventsTotal: 0,
  loadEventsCount: 1,
};

const config = {
  maxPlaybackStartDelay: 3, // VERY rough estimate of "max" network buffering delay in seconds (see also: maxBufferingDelay)
};


// ************************************************************************************************
//
// ************************************************************************************************

export function init(players, playbackState, embeddedEventHandler)
{
  m.players       = players;
  m.playbackState = playbackState;
  m.embeddedEvent = embeddedEventHandler;

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
    m.embeddedEvent(playbackEvents.EVENT.PLAYBACK_READY, { resetProgressBar: true });
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
    const trackType = parseInt(element.getAttribute('data-track-type'));
    const iframe    = element.querySelector('iframe');
    let player      = null;

    if (trackType === mediaPlayers.TRACK_TYPE.YOUTUBE)
    {
      if ((elements.length === 1) && (iframe === null))
        player = getYouTubePlayer('youtube-player', element, true);
      else
        player = getYouTubePlayer(iframe.id, element, false);
    }
    else if (trackType === mediaPlayers.TRACK_TYPE.SOUNDCLOUD)
    {
      /* eslint-disable */
      const embeddedPlayer = SC.Widget(iframe.id);
      player = new mediaPlayers.SoundCloud(element.id, iframe.id, embeddedPlayer, iframe.src);

      embeddedPlayer.bind(SC.Widget.Events.READY,  () => onSoundCloudPlayerEventReady(iframe.id, element, player, embeddedPlayer));
      embeddedPlayer.bind(SC.Widget.Events.PLAY,   onSoundCloudPlayerEventPlay);
      embeddedPlayer.bind(SC.Widget.Events.PAUSE,  onSoundCloudPlayerEventPause);
      embeddedPlayer.bind(SC.Widget.Events.FINISH, onSoundCloudPlayerEventFinish);
      embeddedPlayer.bind(SC.Widget.Events.ERROR,  onSoundCloudPlayerEventError);
      /* eslint-enable */
    }

    if (player !== null)
    {
      player.setArtistTitle(element.getAttribute('data-track-artist'), element.getAttribute('data-track-title'));
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
      onReady:       (event) => onYouTubePlayerReady(event, playerId),
      onStateChange: (event) => onYouTubePlayerStateChange(event, playerId),
      onError:       (event) => onYouTubePlayerError(event, playerId),
    },
    playerVars: {
      'disablekb': 1,
    },
    ...isSingleTrackPlayer && { videoId: videoId },
  });

  let player = null;

  if (isSingleTrackPlayer)
    player = new mediaPlayers.SingleTrack(element.id, playerId, embeddedPlayer, videoId);
  else
    player = new mediaPlayers.YouTube(element.id, playerId, embeddedPlayer, videoId);

  player.setDuration(parseInt(element.getAttribute('data-track-duration')));

  return player;
}


// ************************************************************************************************
// Helper functions for the YouTube and SoundCloud MediaPlayer classes
// ************************************************************************************************

export function onPlayerError(player, mediaUrl)
{
  debug.log('onPlayerError()');
  debug.log(player);

  const eventSource = (player.getTrackType() === mediaPlayers.TRACK_TYPE.YOUTUBE)
                        ? eventLogger.SOURCE.YOUTUBE
                        : eventLogger.SOURCE.SOUNDCLOUD;

  // Stop the current track if it is not the one we are going to next
  if (m.players.isCurrent(player.getUid()) === false)
    m.players.stop();

  eventLog.add(eventSource, eventLogger.EVENT.PLAYER_ERROR, player.getUid());
  m.embeddedEvent(playbackEvents.EVENT.MEDIA_UNAVAILABLE, getPlayerErrorData(player, mediaUrl));
}

function getPlayerErrorData(player, mediaUrl)
{
  const artist = player.getArtist() || 'N/A';
  const title  = player.getTitle()  || 'N/A';

  return {
    currentTrack: m.players.trackFromUid(player.getUid()),
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

  window.onYouTubeIframeAPIReady = function()
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
  const player = m.players.playerFromUid(iframeId);

  // YT.PlayerState.UNSTARTED (-1) here means the video is not available or playable anymore,
  // so we set playbable to false for later use...
  // ToDo: This is _NOT_ documented or official behaviour, so it could change at any time!
  if (event.target.getPlayerState() === -1)
  {
    debug.warn(`onYouTubePlayerReady() - MEDIA_UNAVAILABLE: ${iframeId} => ${event.target.getVideoData().video_id} => ${player.getArtist()} - "${player.getTitle()}"`);
    player.setIsPlayable(false);
  }
  else
  {
    debug.log(`onYouTubePlayerReady(): ${iframeId} => ${event.target.getVideoData().video_id} => ${player.getArtist()} - ${player.getTitle()}`);
  }

  updatePlayersReady();
}

function onYouTubePlayerStateChange(event, iframeId)
{
  eventLog.add(eventLogger.SOURCE.YOUTUBE, event.data, iframeId);

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
  debug.log(`onYouTubePlayerStateChange: UNSTARTED (uID: ${iframeId})`);

  if (eventLog.ytAutoplayBlocked(iframeId, 3000) || eventLog.ytSingleTrackAutoplayBlocked(iframeId, 3000))
    m.embeddedEvent(playbackEvents.EVENT.AUTOPLAY_BLOCKED);
}

function onYouTubeStateBuffering(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: BUFFERING (uID: ${iframeId})`);

  if (m.players.crossfade.isFading() === false)
  {
    const player = m.players.playerFromUid(iframeId);
    player.mute(settings.playback.masterMute);
    player.setVolume(settings.playback.masterVolume);
    playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_LOADING);
  }
}

function onYouTubeStatePlaying(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: PLAYING   (uID: ${iframeId})`);

  // Call order is important on play events for state handling: Always sync first!
  m.playbackState.sync(iframeId, m.playbackState.STATE.PLAY);
  playbackTimer.start();
}

function onYouTubeStatePaused(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: PAUSED    (uID: ${iframeId})`);

  if (m.players.isCurrent(iframeId))
  {
    m.playbackState.sync(iframeId, m.playbackState.STATE.PAUSE);
    playbackTimer.stop();
  }
  else
  {
    m.players.crossfade.stop();
  }
}

function onYouTubeStateCued(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: CUED      (uID: ${iframeId})`);
}

function onYouTubeStateEnded(iframeId)
{
  debug.log(`onYouTubePlayerStateChange: ENDED     (uID: ${iframeId})`);

  if (m.players.isCurrent(iframeId))
  {
    playbackTimer.stop();
    m.embeddedEvent(playbackEvents.EVENT.MEDIA_ENDED);
  }
  else
  {
    m.players.crossfade.stop();
  }
}

function onYouTubePlayerError(event, iframeId)
{
  const player = m.players.playerFromUid(iframeId);

  // Handle single track fetched cueOrPlaySingleTrackById() errors for unplayable tracks (= 150)
  if ((event.data === 150) && (player instanceof mediaPlayers.SingleTrack) && player.isCued())
  {
    debug.log(`onYouTubePlayerError(150) - SingleTrack.isCued(): true`);
    player.setIsCued(false);
    player.setIsPlayable(false);
  }
  else if ((event.data !== null) && player.isPlayable())
  {
    debug.log('onYouTubePlayerError: ' + event.data);
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
  debug.log(`onSoundCloudPlayerEventReady(): ${iframeId} => ${player.getUid()} => ${player.getArtist()} - ${player.getTitle()}`);

  player.setThumbnail(element);

  embeddedPlayer.getDuration(durationMilliseconds =>
  {
    player.setDuration(Math.round(durationMilliseconds / 1000));
    element.setAttribute('data-track-duration', player.getDuration());
    updatePlayersReady();
  });
}

function onSoundCloudPlayerEventPlay(event)
{
  debug.log(`onSoundCloudPlayerEvent: PLAY   (uID: ${event.soundId})`);
  eventLog.add(eventLogger.SOURCE.SOUNDCLOUD, eventLogger.EVENT.STATE_PLAYING, event.soundId);

  if (m.players.crossfade.isFading() && m.players.isCurrent(event.soundId))
  {
    // Call order is important on play events for state handling: Always sync first!
    if (eventLog.scPlayDoubleTrigger(event.soundId, (config.maxPlaybackStartDelay * 1000)))
      m.playbackState.sync(event.soundId, m.playbackState.STATE.PLAY);
  }
  else
  {
    // Call order is important on play events for state handling: Always sync first!
    m.playbackState.sync(event.soundId, m.playbackState.STATE.PLAY);
    m.players.current.mute(settings.playback.masterMute);
    m.players.current.setVolume(settings.playback.masterVolume);
  }

  playbackTimer.start();
}

function onSoundCloudPlayerEventPause(event)
{
  debug.log(`onSoundCloudPlayerEvent: PAUSE  (uID: ${event.soundId})`);
  eventLog.add(eventLogger.SOURCE.SOUNDCLOUD, eventLogger.EVENT.STATE_PAUSED, event.soundId);

  if (eventLog.scAutoplayBlocked(event.soundId, 3000))
  {
    playbackTimer.stop();
    m.embeddedEvent(playbackEvents.EVENT.AUTOPLAY_BLOCKED);
  }
  else if (eventLog.scWidgetPlayBlocked(event.soundId, 30000))
  {
    playbackTimer.stop();
    m.embeddedEvent(playbackEvents.EVENT.PLAYBACK_BLOCKED, { currentTrack: m.players.trackFromUid(event.soundId), numTracks: m.players.getNumTracks() });
  }
  else
  {
    // Only sync state if we get pause events on the same (current) player
    if (m.players.isCurrent(event.soundId))
    {
      m.players.current.getPosition(positionMilliseconds =>
      {
        if (positionMilliseconds > 0)
        {
          m.playbackState.sync(event.soundId, m.playbackState.STATE.PAUSE);
          playbackTimer.stop();
        }
      });
    }
    else
    {
      m.players.crossfade.stop();
    }
  }
}

function onSoundCloudPlayerEventFinish(event)
{
  debug.log(`onSoundCloudPlayerEvent: FINISH (uID: ${event.soundId})`);

  if (m.players.isCurrent(event.soundId))
  {
    playbackTimer.stop();
    m.embeddedEvent(playbackEvents.EVENT.MEDIA_ENDED);
  }
  else
  {
    m.players.crossfade.stop();
  }
}

function onSoundCloudPlayerEventError()
{
  this.getCurrentSound(soundObject =>
  {
    const player = m.players.playerFromUid(soundObject.id);
    debug.warn(`onSoundCloudPlayerEventError() - MEDIA_UNAVAILABLE: ${player.getIframeId()} => ${soundObject.id} => ${player.getArtist()} - "${player.getTitle()}"`);
    player.setIsPlayable(false);
  });
}
