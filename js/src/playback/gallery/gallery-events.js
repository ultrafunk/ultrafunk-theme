//
// Gallery playback events module
//
// https://ultrafunk.com
//


import { newDebugLogger }     from '../../shared/debuglogger.js';
import { KEY }                from '../../shared/storage.js';
import { TRACK_TYPE }         from '../common/mediaplayer.js';
import { replaceClass }       from '../../shared/utils.js';
import { response, settings } from '../../shared/session-data.js';
import { EVENT, addListener } from '../common/playback-events.js';

import {
  SINGLE_TRACK,
  isSingleTrackFetch,
  cueOrPlaySingleTrack,
} from './single-track-fetch.js';

import {
  playerScrollTo,
  autoplayNavTo,
} from '../common/shared-gallery-list.js';

import {
  showSnackbar,
  dismissSnackbar,
} from '../../shared/snackbar.js';


/*************************************************************************************************/


const debug = newDebugLogger('gallery-events');

const m = {
  snackbarId:      0,
  nowPlayingIcons: null,
};

const config = {
  nowPlayingIconsSelector: 'h2.track-artist-title',
};


// ************************************************************************************************
//
// ************************************************************************************************

export function initGalleryEvents()
{
  debug.log('init()');

  m.nowPlayingIcons = document.querySelectorAll(config.nowPlayingIconsSelector);

  addListener(EVENT.MEDIA_PLAYING,     mediaPlaying);
  addListener(EVENT.MEDIA_PAUSED,      mediaPaused);
  addListener(EVENT.MEDIA_ENDED,       mediaEnded);
  addListener(EVENT.MEDIA_CUE_TRACK,   mediaCueTrack);
  addListener(EVENT.CONTINUE_AUTOPLAY, continueAutoplay);
  addListener(EVENT.RESUME_AUTOPLAY,   resumeAutoplay);
  addListener(EVENT.AUTOPLAY_BLOCKED,  autoplayBlocked);
  addListener(EVENT.MEDIA_UNAVAILABLE, mediaUnavailable);
}


// ************************************************************************************************
//
// ************************************************************************************************

function mediaPlaying(playbackEvent)
{
  debug.log(playbackEvent);

  // If autoplayBlocked() snackbar is still visible, dismiss it when playback starts
  dismissSnackbar(m.snackbarId);

  if (playbackEvent.data.numTracks > 1)
  {
    const nowPlayingIcon = document.querySelector(`#${playbackEvent.data.trackId} ${config.nowPlayingIconsSelector}`);

    resetNowPlayingIcons(nowPlayingIcon);
    replaceClass(nowPlayingIcon, 'playing-paused', 'now-playing-icon');

    if (settings.gallery.animateNowPlayingIcon)
      nowPlayingIcon.classList.add('playing-animate');
  }
}

function mediaPaused(playbackEvent)
{
  debug.log(playbackEvent);

  if (playbackEvent.data.numTracks > 1)
    document.querySelector(`#${playbackEvent.data.trackId} ${config.nowPlayingIconsSelector}`).classList.add('playing-paused');
}

function mediaEnded(playbackEvent)
{
  debug.log(playbackEvent);

  if ((playbackEvent !== null) && (playbackEvent.data.numTracks > 1))
    resetNowPlayingIcons();
}

function mediaCueTrack(playbackEvent)
{
  debug.log(playbackEvent);

  if (playbackEvent.data.scrollToMedia)
    playerScrollTo(playbackEvent.data.trackId);
}

function continueAutoplay(playbackEvent)
{
  debug.log(playbackEvent);

  if (isSingleTrackFetch() && (playbackEvent.data.trackType === TRACK_TYPE.YOUTUBE))
    cueOrPlaySingleTrack(SINGLE_TRACK.NEXT, true);
  else
    autoplayNavTo(response.nextPage, true);
}

function resumeAutoplay(playbackEvent)
{
  const autoplayData = JSON.parse(sessionStorage.getItem(KEY.UF_AUTOPLAY));
  sessionStorage.removeItem(KEY.UF_AUTOPLAY);

  debug.log(playbackEvent);
  debug.log(`RESUME_AUTOPLAY: ${(autoplayData !== null) ? JSON.stringify(autoplayData) : 'NO'}`);

  if (autoplayData !== null)
  {
    const iframeId = document.getElementById(autoplayData.trackId)?.querySelector('iframe').id ?? null;

    if ((iframeId === null) && (autoplayData.trackId !== null))
      showSnackbar({ message: 'Unable to cue track (not found)', duration: 5 });
    else
      playbackEvent.callback.resumeAutoplay(autoplayData, iframeId);
  }
  else
  {
    playbackEvent.callback.resumeAutoplay();
  }
}

function autoplayBlocked(playbackEvent)
{
  debug.log(playbackEvent);

  m.snackbarId = showSnackbar({
    message: 'Autoplay blocked, Play to continue',
    duration: 0,
    actionText: 'play',
    actionClickCallback: () => playbackEvent.callback.play(),
  });
}

function mediaUnavailable(playbackEvent)
{
  debug.log(playbackEvent);

  showSnackbar({
    message: 'Error playing track, skipping to next',
    duration: 4,
    actionText: 'Stop',
    afterCloseCallback: () => playbackEventErrorTryNext(playbackEvent),
  });
}


// ************************************************************************************************
//
// ************************************************************************************************

function resetNowPlayingIcons(nowPlayingElement)
{
  m.nowPlayingIcons.forEach(element =>
  {
    if (element !== nowPlayingElement)
      element.classList.remove('now-playing-icon', 'playing-animate', 'playing-paused');
  });
}

function playbackEventErrorTryNext(playbackEvent)
{
  if (playbackEvent.data.currentTrack < playbackEvent.data.numTracks)
  {
    // Only supports skipping FORWARD for now...
    playbackEvent.callback.skipToTrack(playbackEvent.data.currentTrack + 1, true);
  }
  else
  {
    if (isSingleTrackFetch() && (playbackEvent.data.trackType === TRACK_TYPE.YOUTUBE))
    {
      // ToDo: Make below behaviour consistent throughout instead of: cueOrPlaySingleTrack(true) or
      //                                                              cueOrPlaySingleTrack(isPlaying()) ?
      // Meaning settings.playback.autoplay must be TRUE for autoplay triggering on next track played...?
      cueOrPlaySingleTrack(SINGLE_TRACK.NEXT, settings.playback.autoplay);
    }
    else if (response.nextPage !== null)
    {
      autoplayNavTo(response.nextPage, true);
    }
  }
}
