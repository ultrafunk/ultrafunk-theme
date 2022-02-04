//
// Playback events module
//
// https://ultrafunk.com
//


import * as debugLogger          from '../shared/debuglogger.js';
import * as utils                from '../shared/utils.js';
import { KEY }                   from '../shared/storage.js';
import { playerScrollTo }        from './shared-gallery-list.js';
import { response, settings }    from '../shared/session-data.js';
import { updateProgressPercent } from './playback-controls.js';

import {
  showSnackbar,
  dismissSnackbar,
} from '../shared/snackbar.js';


export {
  EVENT,
  init,
  addListener,
  dispatch,
  autoplayNavTo,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('playback-events');

const m = {
  snackbarId:      0,
  nowPlayingIcons: null,
};

const config = {
  nowPlayingIconsSelector: 'h2.entry-title',
};

const EVENT = {
  LOADING:              'loading',
  READY:                'ready',
  MEDIA_LOADING:        'mediaLoading',
  MEDIA_PLAYING:        'mediaPlaying',
  MEDIA_PAUSED:         'mediaPaused',
  MEDIA_ENDED:          'mediaEnded',
  MEDIA_TIME_REMAINING: 'mediaTimeRemaining',
  MEDIA_SHOW:           'mediaShow',
  MEDIA_UNAVAILABLE:    'mediaUnavailable',
  CONTINUE_AUTOPLAY:    'continueAutoplay',
  RESUME_AUTOPLAY:      'resumeAutoplay',
  AUTOPLAY_BLOCKED:     'autoplayBlocked',
  PLAYBACK_BLOCKED:     'playbackBlocked',
};

const eventListeners = {
  [EVENT.LOADING]:              [ loading ],
  [EVENT.READY]:                [ ready ],
  [EVENT.MEDIA_LOADING]:        [ mediaLoading ],
  [EVENT.MEDIA_PLAYING]:        [ mediaPlaying ],
  [EVENT.MEDIA_PAUSED]:         [ mediaPaused ],
  [EVENT.MEDIA_ENDED]:          [ mediaEnded ],
  [EVENT.MEDIA_TIME_REMAINING]: [ mediaTimeRemaining ],
  [EVENT.MEDIA_SHOW]:           [ mediaShow ],
  [EVENT.CONTINUE_AUTOPLAY]:    [ continueAutoplay ],
  [EVENT.RESUME_AUTOPLAY]:      [ resumeAutoplay ],
  [EVENT.AUTOPLAY_BLOCKED]:     [ autoplayBlocked ],
  [EVENT.PLAYBACK_BLOCKED]:     [ playbackBlocked ],
  [EVENT.MEDIA_UNAVAILABLE]:    [ mediaUnavailable ],
};


// ************************************************************************************************
// 
// ************************************************************************************************

function init()
{
  debug.log('init()');
  m.nowPlayingIcons = document.querySelectorAll(config.nowPlayingIconsSelector);
}


// ************************************************************************************************
// 
// ************************************************************************************************

function addListener(playbackEvent, playbackEventListener)
{
  if (playbackEvent in eventListeners)
    eventListeners[playbackEvent].push(playbackEventListener);
}

function dispatch(playbackEvent, playbackEventData = null, playbackEventCallback = null)
{
  eventListeners[playbackEvent].forEach(eventListener =>
  {
    eventListener({
      event:    playbackEvent,
      data:     playbackEventData,
      callback: playbackEventCallback,
    });
  });
}


// ************************************************************************************************
// Default event listeners
// ************************************************************************************************

function loading(playbackEvent)
{
//debugEvent(playbackEvent);
  updateProgressPercent(playbackEvent.data.loadingPercent);
}

function ready(playbackEvent)
{
  debugEvent(playbackEvent);

  if (playbackEvent?.data.resetProgressBar)
    updateProgressPercent(0);
}

function mediaLoading()
{
//debugEvent(playbackEvent);
}

function mediaPlaying(playbackEvent)
{
  debugEvent(playbackEvent);
  
  // If autoplayBlocked() snackbar is still visible, dismiss it when playback starts
  dismissSnackbar(m.snackbarId);

  if (playbackEvent.data.numTracks > 1)
  {
    const nowPlayingIcon = document.querySelector(`#${playbackEvent.data.trackId} ${config.nowPlayingIconsSelector}`);

    resetNowPlayingIcons(nowPlayingIcon);
    utils.replaceClass(nowPlayingIcon, 'playing-paused', 'now-playing-icon');

    if (settings.gallery.animateNowPlayingIcon)
      nowPlayingIcon.classList.add('playing-animate');
  }

  /*
  if (settings.mobile.keepScreenOn)
    screenWakeLock.enable();
  */
}

function mediaPaused(playbackEvent)
{
  debugEvent(playbackEvent);

  if (playbackEvent.data.numTracks > 1)
    document.querySelector(`#${playbackEvent.data.trackId} ${config.nowPlayingIconsSelector}`).classList.add('playing-paused');

  /*
  if (settings.mobile.keepScreenOn)
    screenWakeLock.disable();
  */
}

function mediaEnded(playbackEvent)
{
  debugEvent(playbackEvent);

  updateProgressPercent(0);

  if ((playbackEvent !== null) && (playbackEvent.data.numTracks > 1))
    resetNowPlayingIcons();
}

function mediaTimeRemaining()
{
//debugEvent(playbackEvent);
}

function mediaShow(playbackEvent)
{
  debugEvent(playbackEvent);

  mediaEnded(null);

  if (playbackEvent.data.scrollToMedia)
    playerScrollTo(playbackEvent.data.trackId);
}

function continueAutoplay(playbackEvent)
{
  debugEvent(playbackEvent);
  autoplayNavTo(response.nextPage, true);
}

function resumeAutoplay(playbackEvent)
{
  const autoplayData = JSON.parse(sessionStorage.getItem(KEY.UF_AUTOPLAY));
  sessionStorage.removeItem(KEY.UF_AUTOPLAY);

  debugEvent(playbackEvent);
  debug.log(`RESUME_AUTOPLAY: ${(autoplayData !== null) ? JSON.stringify(autoplayData) : 'NO'}`);

  if (autoplayData !== null)
  {
    const iframeId = document.getElementById(autoplayData.trackId)?.querySelector('iframe').id;
    playbackEvent.callback.resumeAutoplay(autoplayData, iframeId);
  }
}

function autoplayBlocked(playbackEvent)
{
  debugEvent(playbackEvent);

  m.snackbarId = showSnackbar('Autoplay blocked, Play to continue', 0, 'play', () => playbackEvent.callback.togglePlayPause());
}

function playbackBlocked(playbackEvent)
{
  debugEvent(playbackEvent);
  showSnackbar('Unable to play track, skipping to next', 5, 'Stop', () => {}, () => playbackEventErrorTryNext(playbackEvent));
}

function mediaUnavailable(playbackEvent)
{
  debugEvent(playbackEvent);

  if (isPremiumTrack(playbackEvent.data.trackId))
  {
    showSnackbar('YouTube Premium track, skipping', 5, 'help',  () => (window.location.href = '/channel/premium/'), () => playbackEventErrorTryNext(playbackEvent));
  }
  else
  {
    showSnackbar('Unable to play track, skipping to next', 5, 'Stop', () => {}, () => playbackEventErrorTryNext(playbackEvent));
    debugLogger.logErrorOnServer('EVENT_MEDIA_UNAVAILABLE', playbackEvent.data);
  }
}


// ************************************************************************************************
// Misc. event handler utility functions
// ************************************************************************************************

function debugEvent(playbackEvent = null)
{
  if (debug.isDebug() && (playbackEvent !== null))
    debug.log(playbackEvent);
}

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
    if (response.nextPage !== null)
      autoplayNavTo(response.nextPage, true);
  }
}

function isPremiumTrack(trackId)
{
  const postWithId = document.getElementById(trackId);

  if (postWithId !== null)
    return postWithId.classList.contains('uf_channel-premium');
  
  return false;
}

function autoplayNavTo(destUrl, continueAutoplay = false)
{
  debug.log(`autoplayNavTo(): ${destUrl} - continueAutoplay: ${continueAutoplay}`);
  
  if (destUrl)
  {
    sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify({ autoplay: continueAutoplay, trackId: null, position: 0 }));
    utils.navToUrl(destUrl);
  }
}
