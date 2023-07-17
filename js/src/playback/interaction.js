//
// Browser interaction and media playback handler
//
// https://ultrafunk.com
//


import * as eventLogger       from './eventlogger.js';
import * as galleryPlayback   from './gallery/gallery-playback.js';
import * as listPlayback      from './list/list-playback.js';
import * as playbackEvents    from './playback-events.js';
import * as utils             from '../shared/utils.js';
import * as footerToggles     from './footer-toggles.js';
import * as shared            from './shared-gallery-list.js';
import { ElementClick }       from '../shared/element-click.js';
import { showSnackbar }       from '../shared/snackbar.js';
import { initScreenWakeLock } from './screen-wakelock.js';
import { TRACK_TYPE }         from './mediaplayers.js';

import {
  sharePlayClick,
  detailsClick,
} from '../site/interaction.js';

import {
  newDebugLogger,
  measureStartupExecutionTime,
} from '../shared/debuglogger.js';

import {
  SINGLE_TRACK_PLAY,
  isSingleTrackFetch,
  isSingleTrackLoading,
  playSingleTrack,
} from './gallery/single-track-fetch.js';

import {
  setPlaybackControlsCss,
  toggleRepeat,
} from './playback-controls.js';

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

  initListeners();
  initScreenWakeLock();
}

function initPlaybackEvents()
{
  playbackEvents.addListener(playbackEvents.EVENT.PLAYBACK_READY,       playbackEventPlaybackReady);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_CUE_TRACK,      playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_ENDED,          playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_TIME_REMAINING, playbackEventMediaTimeRemaining);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PREV_TRACK,     () => playPrevNextTrack(null, SINGLE_TRACK_PLAY.PREV, response.prevPage));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_NEXT_TRACK,     () => playPrevNextTrack(null, SINGLE_TRACK_PLAY.NEXT, response.nextPage));
}

function initListeners()
{
  utils.addListener('.playback-shuffle-control span', 'click', shared.shuffleClickNavTo);
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
          detailsClick(document.getElementById(m.player.getStatus().elementId));
          break;

        case 'I':
          event.preventDefault();
          sharePlayClick(document.getElementById(m.player.getStatus().elementId));
          break;

        case 'm':
        case 'M':
          event.preventDefault();
          m.player.toggleMute();
          showSnackbar(settings.playback.masterMute ? '<b>Muted</b> (<b>m</b> to Unmute)' : '<b>Unmuted</b> (<b>m</b> to Mute)', 3);
          break;

        case 'p':
        case 'P':
          footerToggles.playerType.toggle();
          break;

        case 'r':
        case 'R':
          showSnackbar(`${toggleRepeat().title} (<b>r</b> to change)`, 3);
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
    playPrevNextTrack(null, SINGLE_TRACK_PLAY.PREV, response.prevPage);
  else
    m.player.prevTrack();
}

function onKeyArrowRight(event)
{
  event.preventDefault();

  if (event.shiftKey === true)
    playPrevNextTrack(null, SINGLE_TRACK_PLAY.NEXT, response.nextPage);
  else
    m.player.nextTrack();
}

function playPrevNextTrack(event, playPrevNext, prevNextPage)
{
  event?.preventDefault();

  if (isSingleTrackFetch())
  {
    if (m.player.getStatus().trackType === TRACK_TYPE.YOUTUBE)
    {
      if (isSingleTrackLoading() === false)
        playSingleTrack(playPrevNext, m.player.getStatus().isPlaying);
      else
        showSnackbar('Loading track, please wait...', 3);
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
  utils.addListener('.playback-details-control',   'click', playbackDetailsClick);
  utils.addListener('.playback-thumbnail-control', 'click', playbackThumbnailClick);
  utils.addListener('.playback-timer-control',     'click', playbackTimerClick);
  m.isPlaybackReady = true;
}

function playbackEventMediaEnded()
{
  if (settings.playback.autoExitFullscreen)
    shared.fullscreenElement.exit();
}

function playbackEventMediaTimeRemaining(playbackEvent)
{
  if (settings.playback.autoExitFsOnWarning && (playbackEvent.data.timeRemainingSeconds <= settings.playback.timeRemainingSeconds))
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
      return playPrevNextTrack(this.event, SINGLE_TRACK_PLAY.PREV, response.prevPage);

    if (this.clicked('a.navbar-next-link'))
      return playPrevNextTrack(this.event, SINGLE_TRACK_PLAY.NEXT, response.nextPage);
  }
}

class trackNavUiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.nav-previous a'))
      return playPrevNextTrack(this.event, SINGLE_TRACK_PLAY.PREV, response.prevPage);

    if (this.clicked('div.nav-next a'))
      return playPrevNextTrack(this.event, SINGLE_TRACK_PLAY.NEXT, response.nextPage);
  }
}

function prevNextNavTo(event, destUrl)
{
  event?.preventDefault();
  shared.autoplayNavTo(destUrl, m.player.getStatus().isPlaying);
}
