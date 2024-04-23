//
// Browser interaction and media playback handler
//
// https://ultrafunk.com
//


import * as eventLogger       from './common/eventlogger.js';
import * as galleryPlayback   from './gallery/gallery-playback.js';
import * as listPlayback      from './list/list-playback.js';
import * as playbackEvents    from './common/playback-events.js';
import * as utils             from '../shared/utils.js';
import * as footerToggles     from '../site/footer-toggles.js';
import * as shared            from './common/shared-gallery-list.js';
import { ElementClick }       from '../shared/element-click.js';
import { showSnackbar }       from '../shared/snackbar.js';
import { initScreenWakeLock } from './common/screen-wakelock.js';
import { TRACK_TYPE }         from './common/mediaplayers.js';

import {
  showTrackSharePlay,
  showTrackDetails,
} from './common/track-modals.js';

import {
  newDebugLogger,
  measureStartupExecutionTime,
} from '../shared/debuglogger.js';

import {
  SINGLE_TRACK,
  isSingleTrackFetch,
  isSingleTrackLoading,
  cueOrPlaySingleTrack,
} from './gallery/single-track-fetch.js';

import {
  setPlaybackControlsCss,
  toggleRepeat,
} from './common/playback-controls.js';

import {
  response,
  settings,
  getSessionData,
} from '../shared/session-data.js';


/*************************************************************************************************/


const debug    = newDebugLogger('playback-interaction');
const eventLog = new eventLogger.Interaction(10);

const m = {
  player:             null,
  isPlaybackReady:    false,
  siteNavUiElements:  null,
  trackNavUiElements: null,
  keyboardShortcuts:  null,
  broadcastChannel:   null,
};


// ************************************************************************************************
// Document ready and document / window event listeners
// ************************************************************************************************

document.addEventListener('DOMContentLoaded', () =>
{
  measureStartupExecutionTime();

  debug.log('DOMContentLoaded');

  getSessionData();

  if (shared.hasGalleryPlayer())
    m.player = galleryPlayback;
  else if (shared.hasListPlayer())
    m.player = listPlayback;

  if (m.player !== null)
    initCommon();

  footerToggles.init(m.player?.getStatus);
});


// ************************************************************************************************
// Read settings and interaction init
// ************************************************************************************************

function initCommon()
{
  debug.log('initCommon()');

  // Set user settings CSS with JS as early as possible...
  setPlaybackControlsCss();

  // Must be done before player.init() since events are used to relay player status updates
  initPlaybackEvents();

  m.player.init();
  m.siteNavUiElements  = new siteNavUiElements('#site-navigation');
  m.trackNavUiElements = new trackNavUiElements('nav.single-track-nav .nav-links');

  shared.fullscreenElement.init();
  m.keyboardShortcuts = utils.keyboardShortcuts(settings.playback.keyboardShortcuts);
  m.broadcastChannel  = new BroadcastChannel('playbackStatus');

  initListeners();
  initScreenWakeLock();
}

function initPlaybackEvents()
{
  playbackEvents.addListener(playbackEvents.EVENT.PLAYBACK_READY,       playbackEventPlaybackReady);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PLAYING,        () => m.broadcastChannel.postMessage(playbackEvents.EVENT.MEDIA_PLAYING));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_CUE_TRACK,      playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_ENDED,          playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_TIME_REMAINING, playbackEventMediaTimeRemaining);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PREV_TRACK,     () => cueOrPlayPrevNextTrack(null, SINGLE_TRACK.PREV, response.prevPage));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_NEXT_TRACK,     () => cueOrPlayPrevNextTrack(null, SINGLE_TRACK.NEXT, response.nextPage));
}

function initListeners()
{
  utils.addListener('.playback-shuffle-button span', 'click', shared.shuffleClickNavTo);
  document.addEventListener('keydown', documentEventKeyDown);
  document.addEventListener('keydown', documentEventMediaKeyDown);

  // Ensures that blur event is triggered on first iframe click / focus
  window.focus();

  // If an iframe is clicked / focused, set focus back to parent document to handle all input events etc.
  window.addEventListener('blur', () =>
  {
    // setTimeout(250) = Yield, needed for Firefox to update document.activeElement
    setTimeout(() =>
    {
      if (document.activeElement instanceof HTMLIFrameElement) {
        window.focus();
      }
    }, 250);
  });

  m.broadcastChannel.addEventListener('message', (event) =>
  {
    debug.log(`broadcastChannel('playbackStatus') message: ${event.data}`);

    if ((event.data === playbackEvents.EVENT.MEDIA_PLAYING) && settings.playback.pauseOnPlayerChange)
      m.player.pause();
  });
}


// ************************************************************************************************
// Regular keyboard events handler
// ************************************************************************************************

function documentEventKeyDown(event)
{
  if (m.isPlaybackReady           &&
      m.keyboardShortcuts.allow() &&
      (event.ctrlKey === false)   &&
      (event.altKey  === false))
  {
    // Events that need event.repeat goes here
    switch (event.key)
    {
      case '+':
      case '-':
        onKeysVolumeChange(event);
        break;

      case 'ArrowUp':
      case 'ArrowDown':
        if (event.shiftKey)
        {
          onKeysVolumeChange(event);
        }
        break;
    }

    if (event.repeat === false)
    {
      switch (event.code)
      {
        case 'Backquote':
          event.preventDefault();
          shared.playerScrollTo(m.player.getStatus().elementId);
          break;
      }

      switch (event.key)
      {
        case ' ':
          event.preventDefault();
          m.player.togglePlayPause();
          break;

        case 'Home':
        case 'End':
        case 'PageUp':
        case 'PageDown':
          shared.playerOnKeysScroll(event);
          break;

        case 'ArrowLeft':
          onKeyArrowLeft(event);
          break;

        case 'ArrowRight':
          onKeyArrowRight(event);
          break;

        case 'A':
          footerToggles.autoplay.toggle();
          break;

        case 'f':
        case 'F':
          event.preventDefault();
          shared.fullscreenElement.toggle(document.getElementById(m.player.getStatus().iframeId));
          break;

        case 'i':
          event.preventDefault();
          showTrackDetails(document.getElementById(m.player.getStatus().elementId));
          break;

        case 'I':
          event.preventDefault();
          showTrackSharePlay(document.getElementById(m.player.getStatus().elementId));
          break;

        case 'm':
        case 'M':
          event.preventDefault();
          m.player.toggleMute();
          showSnackbar({ message: (settings.playback.masterMute ? '<b>Muted</b> (<b>m</b> to Unmute)' : '<b>Unmuted</b> (<b>m</b> to Mute)'), duration: 3 });
          break;

        case 'p':
        case 'P':
          footerToggles.playerType.toggle();
          break;

        case 'r':
        case 'R':
          showSnackbar({ message: `${toggleRepeat().title} (<b>r</b> to change)`, duration: 3 });
          break;

        case 'x':
        case 'X':
          footerToggles.crossfade.toggle();
          break;
      }
    }
  }
}


// ************************************************************************************************
// Keyboard media keys event handler
// ************************************************************************************************

function documentEventMediaKeyDown(event)
{
  if (m.isPlaybackReady && m.keyboardShortcuts.allow()) // && (event.repeat  === false)) does not function as expected on Firefox
  {
    switch (event.key)
    {
      case 'MediaPlayPause':
        if (playbackEvents.hasPlaybackStarted === false)
        {
          debug.log('documentEventMediaKeyDown(): MediaPlayPause');
          event.preventDefault();
          m.player.togglePlayPause();
        }
        break;

      case 'MediaTrackPrevious':
        debug.log('documentEventMediaKeyDown(): MediaTrackPrevious');
        event.preventDefault();
        m.player.prevTrack();
        break;

      case 'MediaTrackNext':
        debug.log('documentEventMediaKeyDown(): MediaTrackNext');
        event.preventDefault();
        m.player.nextTrack();
        break;
    }
  }
}


// ************************************************************************************************
// Keyboard event handlers
// ************************************************************************************************

function onKeyArrowLeft(event)
{
  event.preventDefault();

  if (event.shiftKey === true)
    cueOrPlayPrevNextTrack(null, SINGLE_TRACK.PREV, response.prevPage);
  else
    m.player.prevTrack();
}

function onKeyArrowRight(event)
{
  event.preventDefault();

  if (event.shiftKey === true)
    cueOrPlayPrevNextTrack(null, SINGLE_TRACK.NEXT, response.nextPage);
  else
    m.player.nextTrack();
}

function cueOrPlayPrevNextTrack(event, prevNextTrack, prevNextPage)
{
  event?.preventDefault();

  if (isSingleTrackFetch())
  {
    if (m.player.getStatus().trackType === TRACK_TYPE.YOUTUBE)
    {
      if (isSingleTrackLoading() === false)
        cueOrPlaySingleTrack(prevNextTrack, m.player.getStatus().isPlaying);
      else
        showSnackbar({ message: 'Loading track, please wait...', duration: 3 });
    }
    else
    {
      prevNextNavTo(null, prevNextPage);
    }
  }
  else
  {
    prevNextNavTo(null, prevNextPage);
  }
}

function onKeysVolumeChange(event)
{
  event.preventDefault();

  settings.playback.masterVolume = ((event.key === '+') || (event.key === 'ArrowUp'))
    ? (settings.playback.masterVolume < 100) ? (settings.playback.masterVolume + 5) : 100
    : (settings.playback.masterVolume > 5  ) ? (settings.playback.masterVolume - 5) : 5;

  m.player.setVolume();
}


// ************************************************************************************************
// playbackEvent listeners
// ************************************************************************************************

function playbackEventPlaybackReady()
{
  utils.addListener('.playback-thumbnail-control', 'click', playbackThumbnailClick);
  utils.addListener('.playback-details-control',   'click', playbackDetailsClick);
  utils.addListener('.playback-timer-control',     'click', playbackTimerClick);
  m.isPlaybackReady = true;
}

function playbackEventMediaEnded()
{
  const isGalleryPlayerMultipleTracks = (shared.isGalleryPlayer() && (m.player.getStatus().numTracks > 1));

  if (settings.playback.autoExitFullscreen || isGalleryPlayerMultipleTracks)
    shared.fullscreenElement.exit();
}

function playbackEventMediaTimeRemaining(playbackEvent)
{
  const isTimeRemainingBelowThreshold = (playbackEvent.data.timeRemainingSeconds <= settings.playback.timeRemainingSeconds);

  if (settings.playback.autoExitFsOnWarning && isTimeRemainingBelowThreshold)
    shared.fullscreenElement.exit();
}


// ************************************************************************************************
// Click event handlers
// ************************************************************************************************

function playbackDetailsClick()
{
  shared.playerScrollTo(m.player.getStatus().elementId);
}

function playbackThumbnailClick()
{
  if (shared.isGalleryPlayer())
  {
    eventLog.add(eventLogger.SOURCE.MOUSE, eventLogger.EVENT.MOUSE_CLICK);

    if (eventLog.doubleClicked(eventLogger.SOURCE.MOUSE, eventLogger.EVENT.MOUSE_CLICK, 500))
      shared.fullscreenElement.enter(document.getElementById(m.player.getStatus().iframeId));
  }
  else if (shared.isListPlayer())
  {
    shared.playerScrollTo(0);
  }
}

function playbackTimerClick()
{
  footerToggles.autoplay.toggle();
}

class siteNavUiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('a.navbar-prev-link'))
      return cueOrPlayPrevNextTrack(this.event, SINGLE_TRACK.PREV, response.prevPage);

    if (this.clicked('a.navbar-next-link'))
      return cueOrPlayPrevNextTrack(this.event, SINGLE_TRACK.NEXT, response.nextPage);
  }
}

class trackNavUiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.nav-previous a'))
      return cueOrPlayPrevNextTrack(this.event, SINGLE_TRACK.PREV, response.prevPage);

    if (this.clicked('div.nav-next a'))
      return cueOrPlayPrevNextTrack(this.event, SINGLE_TRACK.NEXT, response.nextPage);
  }
}

function prevNextNavTo(event, destUrl)
{
  event?.preventDefault();
  shared.autoplayNavTo(destUrl, m.player.getStatus().isPlaying);
}
