//
// Shared gallery and list-player functionality
//
// https://ultrafunk.com
//


import { newDebugLogger }     from '../../shared/debuglogger.js';
import { showSnackbar }       from '../../shared/snackbar.js';
import { KEY, setCookie }     from '../../shared/storage.js';
import { showUpNextModal }    from '../list/up-next-modal.js';
import { response, settings } from '../../shared/session-data.js';

import {
  getCssPropValue,
  getPrefPlayerUrl,
  navToUrl,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = newDebugLogger('shared-gallery-list');

export const PLAYER_TYPE = {
  NONE:    0,
  GALLERY: 1,
  LIST:    2,
};

const isPlayer = {
  gallery: false,
  list:    false,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function hasGalleryPlayer()
{
  isPlayer.gallery = (document.body.getAttribute('data-player-type') === 'gallery');
  return isPlayer.gallery;
}

export function hasListPlayer()
{
  isPlayer.list = (document.body.getAttribute('data-player-type') === 'list');
  return isPlayer.list;
}

export function noPlayback()
{
  return ((isPlayer.gallery === false) && (isPlayer.list === false));
}

export function isGalleryPlayer() { return isPlayer.gallery; }
export function isListPlayer()    { return isPlayer.list;    }

export function shuffleClickNavTo(event = null)
{
  event?.preventDefault();
  setCookie(KEY.UF_RESHUFFLE, 'true');
  navToUrl(getPrefPlayerUrl(response.shufflePath));
}

export function autoplayNavTo(destUrl, continueAutoplay = false)
{
  debug.log(`autoplayNavTo(): ${destUrl} - continueAutoplay: ${continueAutoplay}`);

  if (destUrl)
  {
    sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify({ autoplay: continueAutoplay, trackId: null, position: 0 }));
    navToUrl(destUrl);
  }
}

export function updateVolumeMuteSettings(currentVolume, isMuted)
{
  // settings.playback.masterVolume has a range of 5 => 100% in multiples of 5 (5, 10, 15, 20 etc...)
  let multipleOf5Volume = (Math.round(currentVolume / 5) * 5);

  if (currentVolume < 5)
  {
    multipleOf5Volume = 5;
    isMuted = true;
  }

  if (multipleOf5Volume !== settings.playback.masterVolume)
    settings.playback.masterVolume = multipleOf5Volume;

  if (isMuted !== settings.playback.masterMute)
    settings.playback.masterMute = isMuted;
}


// ************************************************************************************************
//
// ************************************************************************************************

export function playerScrollTo(elementId = 0)
{
  isListPlayer() ? listPlayerScrollTo(elementId) : galleryPlayerScrollTo(elementId);
}

function scrollToYPos(element, destYPos)
{
  element.scroll(
  {
    top:      destYPos,
    left:     0,
    behavior: (settings.site.smoothScrolling ? 'smooth' : 'auto'),
  });
}

function listPlayerScrollTo(elementId = 0)
{
  if (elementId === 0)
  {
    let scrollDestPos = 0;

    if ((window.scrollY === 0) || (Math.round(window.scrollY) <= 1))
      scrollDestPos = getCssPropValue('--site-header-height') - getCssPropValue('--site-header-height-down');

    scrollToYPos(window, scrollDestPos);
  }
  else
  {
    if (settings.list.showUpNextModal)
      showUpNextModal();
    else
      document.getElementById(elementId)?.scrollIntoView({ behavior: (settings.site.smoothScrolling ? 'smooth' : 'auto'), block: 'center' });
  }
}

function galleryPlayerScrollTo(elementId)
{
  if (settings.gallery.autoScroll)
  {
    // Actual functional 'offsetTop' calculation: https://stackoverflow.com/a/52477551
    const offsetTop    = Math.round(window.scrollY + document.getElementById(elementId).getBoundingClientRect().top);
    const scrollTop    = Math.round(window.scrollY); // Don't want float results that can cause jitter
    let   headerHeight = getScrollHeaderHeight(offsetTop > scrollTop);

    // If we get obscured by the sticky header menu, recalculate headerHeight to account for that
    if ((scrollTop + headerHeight + getContentMarginTop()) > offsetTop)
      headerHeight = getScrollHeaderHeight(false);

    scrollToYPos(window, (offsetTop - (headerHeight + getContentMarginTop())));
  }

  function getScrollHeaderHeight(isScrollDown)
  {
    return (isScrollDown
             ? getCssPropValue('--site-header-height-down')
             : getCssPropValue('--site-header-height-up'));
  }

  function getContentMarginTop()
  {
    // -1 because of fractional pixels on HiDPI displays (iframe bottom 1 px would show on top)
    return (getCssPropValue('--site-content-margin-top', document.body) - 1);
  }
}

export function playerOnKeysScroll(event)
{
  if (isListPlayer() && (event.shiftKey === true) && (window.innerWidth > 1350))
  {
    const tracklist = document.getElementById('tracklist');

    event.preventDefault();

    if ((event.key === 'PageUp') || (event.key === 'PageDown'))
    {
      const scrollByPx = tracklist.offsetHeight - ((tracklist.offsetHeight * 10)  / 100);

      tracklist.scrollBy(
      {
        top:      (event.key === 'PageUp') ? -scrollByPx : scrollByPx,
        left:     0,
        behavior: (settings.site.smoothScrolling ? 'smooth' : 'auto'),
      });
    }
    else if ((event.key === 'Home') || (event.key === 'End'))
    {
      scrollToYPos(tracklist, ((event.key === 'Home') ? 0 : tracklist.scrollHeight));
    }
  }
}


// ************************************************************************************************
// Fullscreen Element enter / exit / toggle closure
// ************************************************************************************************

const fullscreenElementClosure = (() =>
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
    if (element.requestFullscreen)
      element.requestFullscreen();
    else
      showSnackbar('Unable to enter fullscreen mode!', 3);
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
});

export const fullscreenElement = fullscreenElementClosure();
