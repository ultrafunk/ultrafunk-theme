//
// Ultrafunk site nav-search
//
// https://ultrafunk.com
//


import * as utils from '../shared/utils.js';


export { navSearch };


// ************************************************************************************************
// Main navigation search handling
// ************************************************************************************************

const navSearch = (() =>
{
  const allowKeyboardShortcutsEvent = new Event('allowKeyboardShortcuts');
  const denyKeyboardShortcutsEvent  = new Event('denyKeyboardShortcuts');
  let siteHeader = null, searchContainer = null, searchField = null, brandingContainer = null;
  let isVisible = false;

  return {
    isVisible() { return isVisible; },
    init,
    toggle,
    hide,
  };

  function init()
  {
    siteHeader        = document.getElementById('site-header');
    searchContainer   = document.getElementById('search-container');
    searchField       = searchContainer.querySelector('.search-field');
    brandingContainer = siteHeader.querySelector('div.site-branding-container');

    utils.addListenerAll('.nav-search-toggle', 'click', toggle);
    // To prevent extra 'blur' event before 'click' event
    utils.addListenerAll('.nav-search-toggle', 'mousedown', (event) => event.preventDefault());
    // Hide nav search bar on focus loss
    searchField.addEventListener('blur', hide);
    
    // Hide nav search bar on ESC
    searchField.addEventListener('keydown', (event) =>
    {
      if (event.key === 'Escape')
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
  
  function hide()
  {
    if (isVisible)
      setProps(false, allowKeyboardShortcutsEvent, '', 'search');
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

  function show()
  {
    setPosSize();
    setProps(true, denyKeyboardShortcutsEvent, 'flex', 'clear');
    searchField.focus();
    searchField.setSelectionRange(9999, 9999);    
  }
  
  function setProps(visible, keyboardShortcutsEvent, display, icon)
  {
    isVisible = visible;
    document.dispatchEvent(keyboardShortcutsEvent);
    searchContainer.style.display = display;
    document.querySelectorAll('div.nav-search-toggle span').forEach(element => (element.textContent = icon));
    
    if (isVisible)
      document.getElementById('playback-controls').classList.add('hide');
    else
      document.getElementById('playback-controls').classList.remove('hide');
  }

  function setPosSize()
  {
    let position = {};

    if (utils.matchesMedia(utils.MATCH.SITE_MAX_WIDTH_MOBILE))
    {
      if (brandingContainer.offsetHeight !== 0)
        position.top = brandingContainer.offsetTop;
      else
        position.top = siteHeader.querySelector('.navbar-container-mobile-up').offsetTop;

      position = new DOMRect(63, (position.top + 3), (document.body.clientWidth - 60), 30);
    }
    else
    {
      if (brandingContainer.offsetHeight !== 0)
      {
        const rect = brandingContainer.getBoundingClientRect();
        position   = new DOMRect(rect.left, (rect.top + 7), rect.right, (rect.height - 15));
      }
      else
      {
        const rect = siteHeader.querySelector('.navbar-container').getBoundingClientRect();
        position   = new DOMRect((rect.left + 88), rect.top, (rect.right - 90), (rect.height - 1));
      }
    }
  
    searchContainer.style.left   = `${position.left}px`;
    searchContainer.style.top    = `${position.top}px`;
    searchContainer.style.width  = `${position.width - position.left}px`;
    searchContainer.style.height = `${position.height}px`;
  }
})();
