//
// Ultrafunk site interaction
//
// https://ultrafunk.com
//


import * as utils              from './shared/utils.js';
import * as themeLayout        from './site/theme-layout.js';
import { initSettingsUi }      from './settings/settings-ui.js';
import { navMenu }             from './site/nav-menu.js';
import { navSearch }           from './site/nav-search.js';
import { initArtistsChannels } from './site/artists-channels.js';
import { noPlayback }          from './playback/common/shared-gallery-list.js';

import {
  newDebugLogger,
  logStartupExecutionTime,
} from './shared/debuglogger.js';

import {
  response,
  settings,
} from './shared/session-data.js';


/*************************************************************************************************/


const debug = newDebugLogger('index');
const m     = { keyboardShortcuts: null };

const elements = {
  siteHeader:        null,
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

  if (document.getElementById('termlist-container') !== null)
    initArtistsChannels();

  if (document.getElementById('settings-container') !== null)
    initSettingsUi();

  setSiteContentSearchFocus();
  setPreviousPageTitle();
  logStartupExecutionTime();
});

function initIndex()
{
  debug.log('initIndex()');

  m.keyboardShortcuts = utils.keyboardShortcuts(settings.site.keyboardShortcuts);

  elements.siteHeader        = document.getElementById('site-header');
  elements.siteContent       = document.getElementById('site-content');
  elements.siteContentSearch = document.querySelector('#site-content form input.search-field');

  themeLayout.init();
  navSearch.init();
  navMenu.init();

  resize.addEventListener();
  scroll.addEventListener();

  document.addEventListener('fullscreenElement', (event) => (elements.fullscreenTarget = event.fullscreenTarget));
  document.addEventListener('keydown', documentEventKeyDown);

  window.addEventListener('load', () => utils.addListener('aside.widget-area', 'click', utils.linkClickUsePrefPlayer));
}


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
          navMenu.hide();
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
      case 'L':
        if (searchNotFocused() && notSettingsPage())
        {
          themeLayout.galleryLayout.toggle(event);
          resize.trigger();
        }
        break;

      case 'n':
      case 'N':
        if (searchNotFocused())
        {
          event.preventDefault();
          navMenu.toggle();
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
          themeLayout.siteTheme.toggle(event);
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

function setSiteContentSearchFocus()
{
  if (elements.siteContentSearch !== null)
  {
    elements.siteContentSearch.focus();
    elements.siteContentSearch.setSelectionRange(9999, 9999);
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
          pathString += ((index + 1) < pathParts.length) ? (part + ' / ') : part;
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

    // Setting the CSS variable --scrollbar-width only on resize events prevent document
    // reflow / repaint delays when modals are shown (body.scrolling-disabled)
    document.body.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
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
    const currentScrollPos = window.scrollY;

    if (currentScrollPos === 0)
    {
      scrolledTop();
    }
    else if (currentScrollPos > previousScrollPos)
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
    elements.siteHeader.classList.remove('scrolling-down', 'scrolling-up');
    elements.siteHeader.classList.add('hide-nav-menu');
    navSearch.hide();
    navMenu.hide();
  }

  function scrolledDown()
  {
    if (isScrolledDown === false)
    {
      isScrolledDown = true;
      utils.replaceClass(elements.siteHeader, 'scrolling-up', 'scrolling-down');
      navSearch.hide();
      navMenu.hide();
    }
  }

  function scrolledUp()
  {
    if (isScrolledDown === true)
    {
      isScrolledDown = false;
      utils.replaceClass(elements.siteHeader, 'scrolling-down', 'scrolling-up');
    }
  }
})();
