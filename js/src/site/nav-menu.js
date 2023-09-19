//
// Ultrafunk site nav-menu
//
// https://ultrafunk.com
//


import * as utils             from '../shared/utils.js';
import { settings }           from '../shared/session-data.js';
import { playerType }         from './footer-toggles.js';
import { isSingleTrackFetch } from '../playback/gallery/single-track-fetch.js';

import {
  noPlayback,
  shuffleClickNavTo,
} from '../playback/common/shared-gallery-list.js';


// ************************************************************************************************
// Main navigation menu handling closure
// ************************************************************************************************

const navMenuClosure = (() =>
{
  let siteHeader = null, navMenuOuter = null, navMenuInner = null, navMenuOverlay = null;
  let isVisible = false;
  let siteHeaderHeight = 0;

  window.addEventListener('load', () =>
  {
    utils.addListener('#menu-primary-sections .menu-item-reshuffle a', 'click', shuffleClickNavTo);
    utils.addListener('#menu-primary-sections .menu-item-pref-player', 'click', () => playerType.toggle());
    document.getElementById('menu-primary-channels')?.addEventListener('click', menuClickUsePrefPlayer);
  });

  return {
    isVisible() { return isVisible; },
    init,
    toggle,
    hide,
  };

  function init()
  {
    siteHeader     = document.getElementById('site-header');
    navMenuOuter   = document.querySelector('#site-navigation .nav-menu-outer');
    navMenuInner   = document.querySelector('#site-navigation .nav-menu-inner');
    navMenuOverlay = document.getElementById('nav-menu-overlay');

    utils.addListenerAll('div.nav-menu-toggle', 'click', toggle);
    navMenuOverlay.addEventListener('click', hide);
    window.addEventListener('resize', () => setNavMenuInnerSize());
  }

  function toggle()
  {
    siteHeaderHeight = siteHeader.offsetHeight;
    isVisible ? hide() : show();
  }

  function show()
  {
    if (siteHeader.classList.contains('scrolling-down') === false)
    {
      isVisible = true;

      siteHeader.classList.remove('hide-nav-menu');
      navMenuOuter.style.display = 'flex';
      navMenuOverlay.style.backgroundColor = `rgba(0, 0, 0, ${Math.round(10 * (settings.site.overlayOpacity / 100)) / 10})`;
      navMenuOverlay.classList.add('show');

      if (utils.matchesMedia(utils.MATCH.SITE_MAX_WIDTH_MOBILE))
        setNavMenuProps('hidden', 'close', '100vh');

      setNavMenuInnerSize();
    }
  }

  function hide()
  {
    isVisible = false;

    siteHeader.classList.add('hide-nav-menu');
    navMenuOuter.style.display = '';
    navMenuOverlay.className = '';

    setNavMenuProps();
  }

  function menuClickUsePrefPlayer(event)
  {
    const menuElement = event.target.closest('li.menu-item.menu-item-object-uf_channel');

    if (menuElement !== null)
    {
      if (isSingleTrackFetch() || noPlayback())
      {
        event?.preventDefault();
        utils.navToUrl(utils.getPrefPlayerUrl(menuElement.querySelector('a').href));
      }
    }
  }

  function setNavMenuInnerSize()
  {
    if (isVisible && utils.matchesMedia(utils.MATCH.SITE_MAX_WIDTH_MOBILE))
    {
      const margins = utils.getCssPropValue('margin-top', navMenuInner) + utils.getCssPropValue('margin-bottom', navMenuInner);
      navMenuInner.style = `overflow-y: auto; max-height: ${window.innerHeight - (siteHeaderHeight + margins)}px`;
    }
  }

  function setNavMenuProps(overflowY = '', textContent = 'menu', height = '')
  {
    document.body.style.overflowY = overflowY;
    siteHeader.querySelectorAll('.nav-menu-toggle span')?.forEach(element => element.textContent = textContent);
    siteHeader.style.height = height;
    navMenuInner.style = '';
  }
});

export const navMenu = navMenuClosure();
