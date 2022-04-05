//
// Browser interaction and media playback handler
//
// https://ultrafunk.com
//


import * as debugLogger     from '../shared/debuglogger.js';
import * as eventLogger     from './eventlogger.js';
import * as galleryPlayback from './gallery/gallery-playback.js';
import * as listPlayback    from './list/list-playback.js';
import * as playbackEvents  from './playback-events.js';
import * as screenWakeLock  from './screen-wakelock.js';
import * as utils           from '../shared/utils.js';
import * as footerToggles   from './footer-toggles.js';
import { toggleRepeat }     from './playback-controls.js';
import { showSnackbar }     from '../shared/snackbar.js';

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
} from './shared-gallery-list.js';


/*************************************************************************************************/


const debug    = debugLogger.newInstance('playback-interaction');
const eventLog = new eventLogger.Interaction(10);

const m = {
  player:          null,
  isPlaybackReady: false,
};

const config = {
  doubleClickDelay: 500,
};


// ************************************************************************************************
// Document ready and document / window event listeners
// ************************************************************************************************

document.addEventListener('DOMContentLoaded', () =>
{ 
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

  // Must be done before player.init() since events are used to relay player status updates
  initPlaybackEvents();

  m.player.init();
  fullscreenElement.init();
  keyboardShortcuts.init();

  initListeners();
}

function initPlaybackEvents()
{
  playbackEvents.addListener(playbackEvents.EVENT.READY,                playbackEventReady);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_SHOW,           playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_ENDED,          playbackEventMediaEnded);
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_TIME_REMAINING, playbackEventMediaTimeRemaining);
}

function initListeners()
{
  utils.addListener('.playback-shuffle-control span', 'click', shuffleClickNavTo);

  utils.addListenerAll('span.navbar-arrow-back',            'click', prevNextNavTo, response.prevPage);
  utils.addListenerAll('span.navbar-arrow-fwd',             'click', prevNextNavTo, response.nextPage);
  utils.addListener('nav.track-navigation .nav-previous a', 'click', prevNextNavTo, response.prevPage);
  utils.addListener('nav.track-navigation .nav-next a',     'click', prevNextNavTo, response.nextPage);
  
  document.addEventListener('keydown', documentEventKeyDown);
  window.addEventListener('blur', windowEventBlur);
}


// ************************************************************************************************
// Keyboard events handler and functions
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
        {
          event.preventDefault();
          
          if (event.shiftKey === true)
            prevNextNavTo(null, response.prevPage);
          else
            m.player.prevTrack();
        }
        break;

      case 'ArrowRight':
        {
          event.preventDefault();

          if (event.shiftKey === true)
            prevNextNavTo(null, response.nextPage);
          else
            m.player.nextTrack();
        }
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
// playbackEvent listeners
// ************************************************************************************************

function playbackEventReady()
{
  utils.addListener('.playback-details-control',   'click', playbackDetailsClick);
  utils.addListener('.playback-thumbnail-control', 'click', playbackThumbnailClick);
  utils.addListener('.playback-timer-control',     'click', playbackTimerClick);
  
  document.addEventListener('visibilitychange', () =>
  {
    if ((document.visibilityState === 'visible') && (settings.mobile.keepScreenOn))
      screenWakeLock.stateVisible();
  });

  if (settings.mobile.keepScreenOn)
    screenWakeLock.enable();

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


// ************************************************************************************************
// Fullscreen Element module
// ************************************************************************************************

const fullscreenElement = (() =>
{
  const fseEvent = new Event('fullscreenElement');
  let fseTarget  = null;

  return {
    init,
    enter,
    exit,        
    toggle,
  };

  function init()
  {
    document.addEventListener('fullscreenchange',       fullscreenChange);
    document.addEventListener('webkitfullscreenchange', fullscreenChange);
  }

  function fullscreenChange()
  {
    fseTarget = (document.fullscreenElement !== null)
                  ? document.fullscreenElement.id
                  : null;
    
    fseEvent.fullscreenTarget = fseTarget;
    document.dispatchEvent(fseEvent);
  }

  function enter(element)
  {
    element.requestFullscreen();
  }
  
  function exit()
  {
    if (fseTarget !== null)
    {
      document.exitFullscreen();
      fseTarget = null;
    }
  }

  function toggle(element)
  {
    if (fseTarget === null)
      enter(element);
    else
      exit();
  }
})();


// ************************************************************************************************
// Allow / Deny keyboard shortcuts event handling module
// ************************************************************************************************

const keyboardShortcuts = (() =>
{
  let allow = false;

  return {
    allow() { return allow; },
    init,
  };

  function init()
  {
    allow = settings.playback.keyboardShortcuts;
    document.addEventListener('allowKeyboardShortcuts', () => { if (settings.playback.keyboardShortcuts) allow = true;  });
    document.addEventListener('denyKeyboardShortcuts',  () => { if (settings.playback.keyboardShortcuts) allow = false; });
  }
})();
