//
// Ultrafunk site interaction
//
// https://ultrafunk.com
//


import * as debugLogger   from './shared/debuglogger.js';
import * as storage       from './shared/storage.js';
import * as utils         from './shared/utils.js';
import * as interaction   from './site/interaction.js';
import { initTermlist }   from './site/termlist.js';
import { initSettingsUi } from './shared/settings/settings-ui.js';
import { navMenu }        from './site/nav-menu.js';
import { navSearch }      from './site/nav-search.js';
import { noPlayback }     from './playback/shared-gallery-list.js';

import {
  response,
  settings,
  readSettings,
} from './shared/session-data.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('index');
const m     = { keyboardShortcuts: null };

const elements = {
  siteHeader:        null,
  introBanner:       null,
  siteContent:       null,
  siteContentSearch: null,
  fullscreenTarget:  null,
};


// ************************************************************************************************
// Document ready and document / window event listeners
// ************************************************************************************************

document.addEventListener('DOMContentLoaded', () =>
{
  debug.log('DOMContentLoaded');

  initIndex();

  if (elements.introBanner !== null)
    showIntroBanner();

  if (document.getElementById('termlist-container') !== null)
    initTermlist();

  if (document.getElementById('settings-container') !== null)
    initSettingsUi();

  if (elements.siteContentSearch !== null)
  {
    elements.siteContentSearch.focus();
    elements.siteContentSearch.setSelectionRange(9999, 9999);
  }

  setPreviousPageTitle();

  debugLogger.logStartupExecutionTime();
});

function initIndex()
{
  debug.log('initIndex()');

  m.keyboardShortcuts = utils.keyboardShortcuts(settings.site.keyboardShortcuts);

  elements.siteHeader        = document.getElementById('site-header');
  elements.introBanner       = document.getElementById('intro-banner');
  elements.siteContent       = document.getElementById('site-content');
  elements.siteContentSearch = document.querySelector('#site-content form input.search-field');

  interaction.init();
  navSearch.init();
  navMenu.init();

  resize.addEventListener();
  scroll.addEventListener();

  document.addEventListener('fullscreenElement', (event) => (elements.fullscreenTarget = event.fullscreenTarget));
  document.addEventListener('keydown', documentEventKeyDown);
}

document.addEventListener('settingsUpdated', () =>
{
  readSettings();
  interaction.settingsUpdated();
  storage.setCookie(storage.KEY.UF_GALLERY_PER_PAGE, settings.gallery.tracksPerPage,    (storage.YEAR_IN_SECONDS * 5));
//storage.setCookie(storage.KEY.UF_LIST_PER_PAGE,    settings.list.tracksPerPage,       (storage.YEAR_IN_SECONDS * 5));
  storage.setCookie(storage.KEY.UF_PREFERRED_PLAYER, settings.playback.preferredPlayer, (storage.YEAR_IN_SECONDS * 5));
});


// ************************************************************************************************
// Keyboard events handling
// ************************************************************************************************

function documentEventKeyDown(event)
{
  // UI keyboard events (cannot be disable by the user)
  if ((event.repeat  === false) &&
      (event.ctrlKey === false) &&
      (event.altKey  === false))
  {
    switch (event.key)
    {
      case 'Escape':
        if (navMenu.isVisible())
        {
          event.preventDefault();
          navMenu.toggle();
        }
        return;
    }
  }

  // User enabled keyboard shortcuts (on by default)
  if (m.keyboardShortcuts.allow() &&
      (event.repeat  === false)   &&
      (event.ctrlKey === false)   &&
      (event.altKey  === false))
  {
    switch (event.key)
    {
      case 'c':
      case 'C':
        if (searchNotFocused())
        {
          event.preventDefault();
          navMenu.toggle();
        }
        break;

      case 'L':
        if (searchNotFocused() && notSettingsPage())
        {
          interaction.galleryLayout.toggle(event);
          resize.trigger();
        }
        break;

      case 's':
      case 'S':
        if (searchNotFocused() && notFullscreenElement())
        {
          event.preventDefault();
          navSearch.toggle();
        }
        break;

      case 'T':
        if (searchNotFocused() && notSettingsPage())
        {
          interaction.siteTheme.toggle(event);
        }
        break;

      case 'ArrowLeft':
        if (event.shiftKey && noPlayback())
        {
          event.preventDefault();
          utils.navToUrl(response.prevPage);
        }
        break;

      case 'ArrowRight':
        if (event.shiftKey && noPlayback())
        {
          event.preventDefault();
          utils.navToUrl(response.nextPage);
        }
        break;
    }
  }
}

function searchNotFocused()
{
  return ((navSearch.isVisible() === false) && (elements.siteContentSearch !== document.activeElement));
}

function notSettingsPage()
{
  return (document.body.classList.contains('page-settings') === false);
}

function notFullscreenElement()
{
  return ((elements.fullscreenTarget === null) ? true : false);
}


// ************************************************************************************************
// Misc. support functions
// ************************************************************************************************

function showIntroBanner()
{
  // Only show intro banners if they can be permanently dismissed
  if (storage.isAvailable('localStorage') && UF_BannerProperty) // eslint-disable-line no-undef
  {
    if (settings.banners[UF_BannerProperty]) // eslint-disable-line no-undef
    {
      elements.introBanner.style.display = 'block';
      resize.trigger();

      utils.addListener('#intro-banner .intro-banner-close-button', 'click', () =>
      {
        elements.introBanner.style.display   = '';
        elements.siteContent.style.marginTop = '';
        settings.banners[UF_BannerProperty]  = false; // eslint-disable-line no-undef
      });
    }
  }
}

function setPreviousPageTitle()
{
  if (document.querySelector('.navbar-title .go-back-to') !== null)
  {
    let pathString = '';

    if (document.referrer.length === 0)
    {
      pathString = 'Previous Page';
    }
    else
    {
      const referrerUrlParts = new URL(decodeURIComponent(document.referrer));

      if (referrerUrlParts.search.length !== 0)
      {
        pathString = 'Search Results';
      }
      else if (referrerUrlParts.pathname.length > 1)
      {
        const endSlash  = (referrerUrlParts.pathname.slice(-1) === '/') ? 1 : 0;
        const pathParts = referrerUrlParts.pathname.slice(1, referrerUrlParts.pathname.length - endSlash).replace(/-/gi, ' ').split('/');

        pathParts.forEach((part, index) =>
        {
          pathString += ((index + 1) < pathParts.length)
                          ? part + ' / '
                          : part;
        });
      }
    }

    document.querySelectorAll('#site-navigation .navbar-title').forEach(element =>
    {
      element.querySelector('.go-back-title').textContent = (pathString.length > 0) ? pathString : 'Ultrafunk (home)';
      element.querySelector('.go-back-to').style.opacity  = 1;
    });
  }
}


// ************************************************************************************************
// window.addEventListener('resize') handling
// ************************************************************************************************

const resize = (() =>
{
  let siteHeaderYOffset = 0;

  return {
    getSiteHeaderYOffset() { return siteHeaderYOffset; },
    addEventListener,
    trigger: resizeEvent,
  };

  function addEventListener()
  {
    resizeEvent();
    window.addEventListener('resize', resizeEvent);
  }

  function resizeEvent()
  {
    let headerHeight = 0;

    if (noPlayback())
      headerHeight = utils.getCssPropValue('--site-header-height-no-playback');
    else
      headerHeight = utils.getCssPropValue('--site-header-height');

    siteHeaderYOffset = Math.round((headerHeight > 150) ? (headerHeight / 2) : (headerHeight / 3));

    if ((elements.introBanner !== null) && (elements.introBanner.style.display.length !== 0))
    {
      elements.introBanner.style.marginTop = `${headerHeight}px`;
      elements.siteContent.style.marginTop = `${utils.getCssPropValue('--site-content-margin-top', document.body)}px`;
    }
  }
})();


// ************************************************************************************************
// window.addEventListener('scroll') handling
// ************************************************************************************************

const scroll = (() =>
{
  let previousScrollPos = 0;
  let scrollDeltaUp     = 0;
  let scrollDeltaDown   = 0;
  let isScrolledDown    = false;
  const scrollThreshold = 44; // px minimum amount of scrolling for direction change

  return {
    addEventListener,
  };

  function addEventListener()
  {
    scrollEvent();
    window.addEventListener('scroll', scrollEvent);
  }

  function scrollEvent()
  {
    const currentScrollPos = window.pageYOffset;

    if (currentScrollPos === 0)
    {
      scrolledTop();
    }
    if (currentScrollPos > previousScrollPos)
    {
      scrollDeltaDown += (currentScrollPos - previousScrollPos);

      if ((scrollDeltaDown > scrollThreshold) && (currentScrollPos > resize.getSiteHeaderYOffset()))
      {
        scrollDeltaUp = 0;
        scrolledDown();
      }
    }
    else
    {
      scrollDeltaUp += (previousScrollPos - currentScrollPos);

      if (scrollDeltaUp > scrollThreshold)
      {
        scrollDeltaDown = 0;
        scrolledUp();
      }
    }

    previousScrollPos = currentScrollPos;
  }

  function scrolledTop()
  {
    elements.siteHeader.classList.remove('sticky-nav-down', 'sticky-nav-up');
    elements.siteHeader.classList.add('hide-nav-menu');
    navSearch.hide();
    navMenu.scrolledTop();
  }

  function scrolledDown()
  {
    if (isScrolledDown === false)
    {
      isScrolledDown = true;
      utils.replaceClass(elements.siteHeader, 'sticky-nav-up', 'sticky-nav-down');
      navSearch.hide();
    }
  }

  function scrolledUp()
  {
    if (isScrolledDown === true)
    {
      isScrolledDown = false;
      utils.replaceClass(elements.siteHeader, 'sticky-nav-down', 'sticky-nav-up');
    }
  }
})();
