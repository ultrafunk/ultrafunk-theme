//
// Shared gallery and list-player functionality
//
// https://ultrafunk.com
//


import * as debugLogger       from '../shared/debuglogger.js';
import { KEY, setCookie }     from '../shared/storage.js';
import { showUpNextModal }    from './list/up-next-modal.js';
import { response, settings } from '../shared/session-data.js';

import {
  getCssPropValue,
  getPrefPlayerUrl,
  navToUrl,
} from '../shared/utils.js';


export {
  PLAYER_TYPE,
  TRACK_TYPE,
  hasGalleryPlayer,
  hasListPlayer,
  noPlayback,
  isGalleryPlayer,
  isListPlayer,
  shuffleClickNavTo,
  autoplayNavTo,
  playerScrollTo,
  playerOnKeyScroll,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('shared-gallery-list');

const PLAYER_TYPE = {
  NONE:    0,
  GALLERY: 1,
  LIST:    2,
};

const TRACK_TYPE = {
  NONE:       0,
  YOUTUBE:    1,
  SOUNDCLOUD: 2,
};

const isPlayer = {
  gallery: false,
  list:    false,
};


// ************************************************************************************************
//
// ************************************************************************************************

function hasGalleryPlayer()
{
  isPlayer.gallery = (document.body.getAttribute('data-player-type') === 'gallery');
  return isPlayer.gallery;
}

function hasListPlayer()
{
  isPlayer.list = (document.body.getAttribute('data-player-type') === 'list');
  return isPlayer.list;
}

function noPlayback()
{
  return ((isPlayer.gallery === false) && (isPlayer.list === false));
}

function isGalleryPlayer() { return isPlayer.gallery; }
function isListPlayer()    { return isPlayer.list;    }

function shuffleClickNavTo(event)
{
  event?.preventDefault();
  setCookie(KEY.UF_RESHUFFLE, 'true');
  navToUrl(getPrefPlayerUrl(response.shufflePath));
}

function autoplayNavTo(destUrl, continueAutoplay = false)
{
  debug.log(`autoplayNavTo(): ${destUrl} - continueAutoplay: ${continueAutoplay}`);
  
  if (destUrl)
  {
    sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify({ autoplay: continueAutoplay, trackId: null, position: 0 }));
    navToUrl(destUrl);
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

function playerScrollTo(trackId = 0)
{
  isListPlayer() ? listPlayerScrollTo(trackId) : galleryPlayerScrollTo(trackId);
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


// ************************************************************************************************
//
// ************************************************************************************************

function listPlayerScrollTo(trackId = 0)
{
  if (trackId === 0)
  {
    let scrollDestPos = 0;

    if ((window.pageYOffset === 0) || (Math.round(window.pageYOffset) <= 1))
      scrollDestPos = getCssPropValue('--site-header-height') - getCssPropValue('--site-header-height-down');
  
    scrollToYPos(window, scrollDestPos);
  }
  else
  {
    if (settings.list.showUpNextModal)
    {
      showUpNextModal();
    }
    else
    {
      const trackElement = document.getElementById('tracklist').querySelector(`[data-track-id="${trackId}"]`);
      trackElement.scrollIntoView({ behavior: (settings.site.smoothScrolling ? 'smooth' : 'auto'), block: 'center' });
    }
  }
}

function galleryPlayerScrollTo(trackId)
{
  if (settings.gallery.autoScroll)
  {
    // Actual functional 'offsetTop' calculation: https://stackoverflow.com/a/52477551
    const offsetTop    = Math.round(window.scrollY + document.getElementById(trackId).getBoundingClientRect().top);
    const scrollTop    = Math.round(window.pageYOffset); // Don't want float results that can cause jitter
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


// ************************************************************************************************
//
// ************************************************************************************************

function playerOnKeyScroll(event)
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
