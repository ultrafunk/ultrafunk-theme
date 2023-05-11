//
// Ultrafunk site nav-search
//
// https://ultrafunk.com
//


import * as utils from '../shared/utils.js';

import {
  isTrackSearchResultsVisible,
  setTrackSearchResultsVisible,
} from '../playback/list/track-search.js';


// ************************************************************************************************
// Main navigation search handling closure
// ************************************************************************************************

const navSearchClosure = (() =>
{
  const allowKeyboardShortcutsEvent = new Event('allowKeyboardShortcuts');
  const denyKeyboardShortcutsEvent  = new Event('denyKeyboardShortcuts');
  let siteHeader = null, searchContainer = null, searchField = null;
  let isVisible = false;

  return {
    isVisible() { return isVisible; },
    init,
    toggle,
    hide,
  };

  function init()
  {
    siteHeader      = document.getElementById('site-header');
    searchContainer = document.getElementById('site-search-container');
    searchField     = searchContainer.querySelector('.search-field');

    utils.addListenerAll('.nav-search-toggle', 'click', toggle);

    // To prevent extra 'blur' event before 'click' event
    utils.addListenerAll('.nav-search-toggle', 'mousedown', (event) => event.preventDefault());

    // Hide nav search bar on focus loss
    searchField.addEventListener('blur', () =>
    {
      if (isTrackSearchResultsVisible() === false)
        hide();
    });

    // Hide nav search bar on ESC
    searchField.addEventListener('keydown', (event) =>
    {
      if ((event.key === 'Escape') && isVisible)
      {
        event.stopPropagation();
        hide();
      }
    });
  }

  function toggle()
  {
    hasVisibleSearchContainer() ? show() : hide();
  }

  function show()
  {
    setNavSearchProps(true);
    searchField.focus();
    searchField.setSelectionRange(9999, 9999);
  }

  function hide()
  {
    if (isVisible)
      setNavSearchProps(false);
  }

  function hasVisibleSearchContainer()
  {
    if (searchContainer.style.display.length === 0)
    {
      // Has no visible site header at all, bail out...
      if (siteHeader.offsetHeight === 0)
        return false;

      // Is mobile with no visible navbar, bail out...
      if (utils.matchesMedia(utils.MATCH.SITE_MAX_WIDTH_MOBILE))
      {
        if ((siteHeader.querySelector('.navbar-container-mobile-top').offsetHeight === 0) &&
            (siteHeader.querySelector('.navbar-container-mobile-up').offsetHeight  === 0))
        {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  function setNavSearchProps(showHide)
  {
    isVisible = showHide;

    isVisible ? document.dispatchEvent(denyKeyboardShortcutsEvent)
              : document.dispatchEvent(allowKeyboardShortcutsEvent);

    isVisible ? document.getElementById('playback-controls').classList.add('hide')
              : document.getElementById('playback-controls').classList.remove('hide');

    searchContainer.style.display = isVisible ? 'flex' : '';
    setTrackSearchResultsVisible(isVisible);

    document.querySelectorAll('div.nav-search-toggle span').forEach((element) =>
    {
      element.textContent = isVisible ? 'close' : 'search';
    });
  }
});

export const navSearch = navSearchClosure();
