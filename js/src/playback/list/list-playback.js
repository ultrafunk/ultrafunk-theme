//
// List playback module
//
// https://ultrafunk.com
//


import * as debugLogger       from '../../shared/debuglogger.js';
import * as eventLogger       from '../eventlogger.js';
import * as playbackControls  from '../playback-controls.js';
import * as listControls      from './list-controls.js';
import * as mediaPlayers      from '../mediaplayers.js';
import * as playbackEvents    from '../playback-events.js';
import * as utils             from '../../shared/utils.js';
import { KEY }                from '../../shared/storage.js';
import { STATE }              from '../element-wrappers.js';
import { showModal }          from '../../shared/modal.js';
import { playbackTimer }      from './list-playback-timer.js';
import { response, settings } from '../../shared/session-data.js';

import {
  playerScrollTo,
  autoplayNavTo,
} from '../shared-gallery-list.js';

import {
  showSnackbar,
  dismissSnackbar,
} from '../../shared/snackbar.js';


/*************************************************************************************************/


const debug    = debugLogger.newInstance('list-playback');
const eventLog = new eventLogger.Playback(10);

const m = {
  player:            null,
  autoplayData:      null,
  playerReady:       false,
  firstStatePlaying: true,
  currentTrackId:    null,
  currentSnackbarId: 0,
};

const noPlayableTracksError = /*html*/ `
  <p>The <b>List Player</b> only supports playing YouTube tracks, SoundCloud tracks will be automatically skipped over.</p>
  <p>SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>
  <p>To toggle between the <b>Gallery</b> and <b>List</b> players, please use the <b>Pref. Player: GALLERY / LIST</b> setting toggle button in the sites footer area.</p>`;


// ************************************************************************************************
//
// ************************************************************************************************

export function init()
{
  debug.log('init()');

  listControls.init(setCurrentTrack);

  if (cueInitialTrack() !== null)
    initYouTubeAPI();
  else
    showSnackbar('No playable YouTube tracks!', 0, 'help', () => showModal('No playable tracks', noPlayableTracksError));
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
      const matchesVideoId = m.autoplayData.trackId.match(mediaPlayers.youTubeVideoIdRegEx);

      if (matchesVideoId !== null)
      {
        const trackElement = listControls.queryTrack(`[data-track-source-uid="${matchesVideoId[0]}"]`);

        if (trackElement !== null)
          m.currentTrackId = trackElement.id;
      }
      else if (m.autoplayData.trackId.match(/^track-(?!0)\d{1,9}$/i) !== null)
      {
        const trackElement = listControls.queryTrack(`[data-track-id="${m.autoplayData.trackId}"]`);

        if (trackElement !== null)
        {
          if (listControls.getTrackType(trackElement) === mediaPlayers.TRACK_TYPE.YOUTUBE)
            m.currentTrackId = trackElement.id;
          else
            showSnackbar('Cannot play SoundCloud track', 5, 'help', () => showModal('Cannot play SoundCloud track', noPlayableTracksError));
        }
        else
        {
          showSnackbar('Unable to cue track (not found)', 5);
        }
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

function setCurrentTrack(nextTrackId, playNextTrack = true, isPointerClick = false)
{
  const nextTrackType = listControls.getTrackType(listControls.queryTrackId(nextTrackId));

  debug.log(`setCurrentTrack() - nextTrackType: ${debug.getKeyForValue(mediaPlayers.TRACK_TYPE, nextTrackType)} - nextTrackId: ${nextTrackId} - playNextTrack: ${playNextTrack} - isPointerClick: ${isPointerClick}`);

  if ((nextTrackType === mediaPlayers.TRACK_TYPE.SOUNDCLOUD) && isPointerClick)
  {
    showSnackbar('Cannot play SoundCloud track', 5, 'help', () => showModal('Cannot play SoundCloud track', noPlayableTracksError));
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
    playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_CUE_NEXT, { nextTrackId: nextTrackId, isPointerClick: isPointerClick });
    cueOrPlayCurrentTrack(playNextTrack);
  }
}

function cueOrPlayCurrentTrack(playTrack)
{
  const sourceUid = listControls.updateTrackDetails();

  if (playTrack)
  {
    m.player.embedded.loadVideoById(sourceUid);
    listControls.setCurrentTrackState(STATE.PLAYING);
    playbackControls.getSetTrackData();
  }
  else
  {
    m.player.embedded.cueVideoById(sourceUid);
    listControls.setCurrentTrackState(STATE.PAUSED);
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

export function togglePlayPause()
{
  if (m.currentTrackId === null)
  {
    setCurrentTrack(listControls.queryTrack('div.track-entry.current').id);
  }
  else
  {
    if (playbackControls.isPlaying())
      m.player.embedded.pauseVideo();
    else
      m.player.play(onYouTubePlayerError);
  }
}

export function toggleMute(setCurrentSetting = false)
{
  if (setCurrentSetting === false)
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
    playbackControls.updatePrevState();
  }
  else if (position !== 0)
  {
    m.player.embedded.seekTo(0);
    playbackControls.updateTimerAndProgress(0, 0, m.player.getDuration());
  }
}

export function nextTrack()
{
  const nextTrackId = listControls.getNextPlayableId();

  if (nextTrackId !== null)
  {
    setCurrentTrack(nextTrackId, playbackControls.isPlaying());
    playbackControls.updateNextState();
  }
}

async function advanceToNextTrack(autoplay = false, isPlaybackError = false)
{
  const repeatMode  = isPlaybackError ? playbackControls.REPEAT.OFF : playbackControls.getRepeatMode();
  const nextTrackId = listControls.getNextPlayableId();

  debug.log(`advanceToNextTrack() autoplay: ${autoplay} - isPlaybackError: ${isPlaybackError} - nextTrackId: ${nextTrackId} - repeatMode: ${debug.getKeyForValue(playbackControls.REPEAT, repeatMode)}`);

  if (autoplay && (repeatMode === playbackControls.REPEAT.ONE))
  {
    m.player.embedded.seekTo(0);
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
  if ((playbackControls.isPlaying() === false) && (m.autoplayData !== null))
  {
    eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.RESUME_AUTOPLAY, null);
    eventLog.add(eventLogger.SOURCE.YOUTUBE, -1, listControls.getNextPlayableId());
  }

  if (playbackControls.isPlaying() === false)
    advanceToNextTrack(true, true);
}

function stopSkipToNextTrack()
{
  m.currentTrackId = null;
  listControls.setCurrentTrackState(STATE.PAUSED);
}

export function getStatus()
{
  const currentTrack = listControls.queryTrack('div.track-entry.current');

  if (currentTrack !== null)
  {
    const allTracksList = listControls.queryTrackAll('div.track-entry');
    const currentIndex  = Array.prototype.indexOf.call(allTracksList, currentTrack);

    return {
      isPlaying:    playbackControls.isPlaying(),
      currentTrack: (currentIndex + 1),
      trackType:    mediaPlayers.TRACK_TYPE.YOUTUBE,
      position:     Math.ceil(m.player.embedded.getCurrentTime()),
      numTracks:    m.player.getNumTracks(),
      trackId:      allTracksList[currentIndex].getAttribute('data-track-id'),
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
        onReady:       onYouTubePlayerReady,
        onStateChange: onYouTubePlayerStateChange,
        onError:       onYouTubePlayerError,
      }
    });

    m.player = new mediaPlayers.Playlist(embeddedPlayer);
    playbackControls.init(m.player, (positionSeconds) => m.player.embedded.seekTo(positionSeconds));
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

  if (m.autoplayData?.autoplay === true)
    eventLog.add(eventLogger.SOURCE.ULTRAFUNK, eventLogger.EVENT.RESUME_AUTOPLAY, null);

  playbackControls.ready(prevTrack, togglePlayPause, nextTrack, toggleMute);
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 66 });
  playbackTimer.ready(m.player);
  listControls.ready(m.player);

  toggleMute(true);
  playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_READY, { resetProgressBar: false });
  cueOrPlayCurrentTrack(m.autoplayData?.autoplay === true);
}

function onYouTubePlayerStateChange(event)
{
  debug.log(`onYouTubePlayerStateChange(): ${event.data} - trackId: ${m.currentTrackId}`);
  eventLog.add(eventLogger.SOURCE.YOUTUBE, event.data, m.currentTrackId);

  // Set playback controls state to YouTube state so we have a single source of truth = playbackControls.isPlaying()
  if (event.data !== YT.PlayerState.PLAYING) // eslint-disable-line no-undef
    playbackControls.setPauseState();

  switch(event.data)
  {
    // eslint-disable-next-line no-undef
    case YT.PlayerState.UNSTARTED:
      onYouTubeStateUnstarted();
      break;

    // eslint-disable-next-line no-undef
    case YT.PlayerState.CUED:
      m.player.setPlayerState(event.data); // For internal state when trying to play a track that does not exist
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

function onYouTubeStateUnstarted()
{
  if (eventLog.ytAutoplayBlocked(m.currentTrackId, 3000))
  {
    listControls.setCurrentTrackState(STATE.PAUSED);
    m.currentSnackbarId = showSnackbar('Autoplay blocked, Play to continue', 0, 'play', () => m.player.play(onYouTubePlayerError));
  }

  if (m.playerReady === false)
  {
    m.playerReady = true;
    playbackEvents.dispatch(playbackEvents.EVENT.PLAYBACK_LOADING, { loadingPercent: 0 });
  }
}

function onYouTubeStatePlaying()
{
  dismissSnackbar(m.currentSnackbarId);

  if (m.firstStatePlaying)
  {
    m.firstStatePlaying = false;
    m.autoplayData      = null;

    setTimeout(() =>
    {
      if (settings.playback.autoplay            &&
          playbackControls.isPlaying()          &&
          (Math.round(window.pageYOffset) <= 1) &&
          utils.matchesMedia(utils.MATCH.SITE_MAX_WIDTH_MOBILE))
      {
        playerScrollTo(0);
      }
    },
    6000);
  }
}

function onYouTubePlayerError(event)
{
  debug.log(`onYouTubePlayerError(): ${event.data} - trackId: ${m.currentTrackId}`);

  listControls.setTrackMessage('Error!');
  eventLog.add(eventLogger.SOURCE.YOUTUBE, eventLogger.EVENT.PLAYER_ERROR, m.currentTrackId);
  showSnackbar('Unable to play track, skipping to next', 5, 'Stop', stopSkipToNextTrack, skipToNextTrack);

  debugLogger.logErrorOnServer('EVENT_MEDIA_UNAVAILABLE', {
    mediaUrl:   m.player.embedded.getVideoUrl(),
    mediaTitle: `${m.player.getArtist()} - ${m.player.getTitle()}`,
  });
}
