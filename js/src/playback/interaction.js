//
// Browser interaction and media playback handler
//
// https://ultrafunk.com
//


import * as debugLogger       from '../shared/debuglogger.js';
import * as eventLogger       from './eventlogger.js';
import * as galleryPlayback   from './gallery/gallery-playback.js';
import * as listPlayback      from './list/list-playback.js';
import * as playbackEvents    from './playback-events.js';
import * as utils             from '../shared/utils.js';
import * as footerToggles     from './footer-toggles.js';
import ElementClick           from '../shared/element-click.js';
import { showSnackbar }       from '../shared/snackbar.js';
import { initScreenWakeLock } from './screen-wakelock.js';
import { TRACK_TYPE }         from './mediaplayers.js';

import {
  isSingleTrackNext,
  isNextTrackLoading,
  playNextSingleTrack,
} from './gallery/single-track-next.js';

import {
  setPlaybackControlsCss,
  toggleRepeat,
} from './playback-controls.js';

import {
  response,
  settings,
  getSessionData,
} from '../shared/session-data.js';

import {
  hasGalleryPlayer,
  hasListPlayer,
  isGalleryPlayer,
  isListPlayer,
  playerScrollTo,
  playerOnKeyScroll,
  shuffleClickNavTo,
  autoplayNavTo,
  fullscreenElement,
  keyboardShortcuts,
} from './shared-gallery-list.js';


/*************************************************************************************************/


const debug    = debugLogger.newInstance('playback-interaction');
const eventLog = new eventLogger.Interaction(10);

const m = {
  player:             null,
  isPlaybackReady:    false,
  siteNavUiElements:  null,
  trackNavUiElements: null,
};

const config = {
  doubleClickDelay: 500,
};


// ************************************************************************************************
// Document ready and document / window event listeners
// ************************************************************************************************

document.addEventListener('DOMContentLoaded', () =>
{
  debugLogger.measureStartupExecutionTime();
  
  debug.log('DOMContentLoaded');

  getSessionData();

  if (hasGalleryPlayer())
    m.player = galleryPlayback;
  else if (hasListPlayer())
    m.player = listPlayback;

  if (m.player !== null)
    initShared();

  footerToggles.init(m.player?.getStatus);
});


// ************************************************************************************************
// Read settings and interaction init
// ************************************************************************************************

function initShared()
{
  debug.log('initShared()');

  // Set user settings CSS with JS as early as possible...
  setPlaybackControlsCss();

  // Must be done before player.init() since events are used to relay player status updates
  initPlaybackEvents();

  m.player.init();
  m.siteNavUiElements  = new siteNavUiElements('#site-navigation');
  m.trackNavUiElements = new trackNavUiElements('nav.track-navigation .nav-links');

  fullscreenElement.init();
  keyboardShortcuts.init();

  initListeners();
  initScreenWakeLock();
}

function initPlaybackEvents()
{
  playbackEvents.addListener(playbackEvents.EVENT.PLAYBACK_READY,       playbackEventPlaybackReady);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_CUE_NEXT,       playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_ENDED,          playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_TIME_REMAINING, playbackEventMediaTimeRemaining);
}

function initListeners()
{
  utils.addListener('.playback-shuffle-control span', 'click', shuffleClickNavTo);
  document.addEventListener('keydown', documentEventKeyDown);
  document.addEventListener('keydown', documentEventMediaKeyDown);
  window.addEventListener('blur', windowEventBlur);
}


// ************************************************************************************************
// Regular keyboard events handler
// ************************************************************************************************

function documentEventKeyDown(event)
{
  if (m.isPlaybackReady         &&
      keyboardShortcuts.allow() &&
      (event.repeat  === false) &&
      (event.ctrlKey === false) &&
      (event.altKey  === false))
  {
    switch(event.code)
    {
      case 'Backquote':
        event.preventDefault();
        playerScrollTo(m.player.getStatus().trackId);
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
        playerOnKeyScroll(event);
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
        fullscreenElement.toggle(document.getElementById(m.player.getStatus().iframeId));
        break;

      case 'm':
      case 'M':
        event.preventDefault();
        m.player.toggleMute();
        showSnackbar(settings.playback.masterMute ? 'Volume is muted (<b>m</b> to unmute)' : 'Volume is unmuted (<b>m</b> to mute)', 3);
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


// ************************************************************************************************
// Keyboard media keys event handler
// ************************************************************************************************

function documentEventMediaKeyDown(event)
{
  if (m.isPlaybackReady && keyboardShortcuts.allow()) // && (event.repeat  === false)) does not function as expected on Firefox
  {
    switch(event.key)
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
    prevNextNavTo(null, response.prevPage);
  else
    m.player.prevTrack();
}

function onKeyArrowRight(event)
{
  event.preventDefault();

  if (event.shiftKey === true)
    onSingleTrackNext(null);
  else
    m.player.nextTrack();
}

function onSingleTrackNext(event)
{
  event?.preventDefault();

  if (isSingleTrackNext())
  {
    if (m.player.getStatus().trackType === TRACK_TYPE.YOUTUBE)
    {
      if (isNextTrackLoading() === false)
        playNextSingleTrack(m.player.getStatus().isPlaying);
      else
        showSnackbar('Loading next track, please wait...', 3);
    }
    else
    {
      prevNextNavTo(null, response.nextPage);
    }
  }
  else
  {
    prevNextNavTo(null, response.nextPage);
  }
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
    fullscreenElement.exit();
}

function playbackEventMediaTimeRemaining(playbackEvent)
{
  if (settings.playback.autoExitFsOnWarning && (playbackEvent.data.timeRemainingSeconds <= settings.playback.timeRemainingSeconds))
    fullscreenElement.exit();
}


// ************************************************************************************************
// Window and document event handlers
// ************************************************************************************************

function windowEventBlur()
{
  // ToDo: This is only for gallery players for now...?
  if (isListPlayer())
    return;

  // setTimeout(0) = Yield
  setTimeout(() =>
  {
    // document (page) iframe was focused
    if (document.activeElement instanceof HTMLIFrameElement)
    {
      setTimeout(() =>
      {
        document.activeElement.blur();
        
        // Needed to get Firefox to behave like Chrome
        if (document.activeElement instanceof HTMLIFrameElement)
          document.activeElement.blur();
      }, 250);
    }
  }, 0);
}


// ************************************************************************************************
// Click event handlers
// ************************************************************************************************

function playbackDetailsClick()
{
  playerScrollTo(m.player.getStatus().trackId);

  if (isListPlayer() && settings.list.showUpNextModal)
    showSnackbarHint('showUpNextModalHint', '<b>Tip:</b> Click or tap Artist &amp; Title to show Up Next queue');
  else
    showSnackbarHint('showTrackDetailsHint', '<b>Tip:</b> Click or tap Artist &amp; Title to show current track');
}

function playbackThumbnailClick()
{
  if (isGalleryPlayer())
  {
    eventLog.add(eventLogger.SOURCE.MOUSE, eventLogger.EVENT.MOUSE_CLICK, null);
    showSnackbarHint('showGalleryTrackThumbnailHint', '<b>Tip:</b> Double click or tap Track Thumbnail for full screen');
  
    if (eventLog.doubleClicked(eventLogger.SOURCE.MOUSE, eventLogger.EVENT.MOUSE_CLICK, config.doubleClickDelay))
      fullscreenElement.enter(document.getElementById(m.player.getStatus().iframeId));
  }
  else if (isListPlayer())
  {
    playerScrollTo(0);
    showSnackbarHint('showListTrackThumbnailHint', '<b>Tip:</b> Click or tap Track Thumbnail to show player');
  }
}

function playbackTimerClick()
{
  footerToggles.autoplay.toggle();
  showSnackbarHint('showTrackTimerHint', '<b>Tip:</b> Click or tap Track Timer to toggle Autoplay On / Off');
}

class siteNavUiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('span.navbar-arrow-back'))
      return prevNextNavTo(this.event, response.prevPage);

    if (this.clicked('span.navbar-arrow-fwd'))
      return onSingleTrackNext(this.event);
  }
}

class trackNavUiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.nav-previous a'))
      return prevNextNavTo(this.event, response.prevPage);

    if (this.clicked('div.nav-next a'))
      return onSingleTrackNext(this.event);
  }
}

function showSnackbarHint(hintKey, hintText, snackbarTimeout = 0)
{
  if (settings.tips[hintKey])
  {
    showSnackbar(hintText, snackbarTimeout);
    settings.tips[hintKey] = false;
  }
}

function prevNextNavTo(event, destUrl)
{
  event?.preventDefault();
  autoplayNavTo(destUrl, m.player.getStatus().isPlaying);
}
