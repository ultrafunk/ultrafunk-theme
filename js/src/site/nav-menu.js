//
// Ultrafunk site nav-menu
//
// https://ultrafunk.com
//


import * as utils             from '../shared/utils.js';
import { settings }           from '../shared/session-data.js';
import { playerType }         from '../playback/footer-toggles.js';
import { isSingleTrackFetch } from '../playback/gallery/single-track-fetch.js';

import {
  noPlayback,
  shuffleClickNavTo,
} from '../playback/shared-gallery-list.js';


// ************************************************************************************************
// Main navigation menu handling closure
// ************************************************************************************************

const navMenuClosure = (() =>
{
  const observer = new ResizeObserver(observerCallback);
  let siteHeader = null, navMenuOuter = null, navMenuInner = null, modalOverlay = null;
  let isVisible = false;
  let siteHeaderHeight = 0;

  window.addEventListener('load', () =>
  {
    utils.addListener('#menu-primary-sections .menu-item-reshuffle a', 'click', shuffleClickNavTo);
    utils.addListener('#menu-primary-sections .menu-item-pref-player', 'click', () => playerType.toggle());
    document.getElementById('menu-primary-channels')?.addEventListener('click', menuClickUsePrefPlayer);
  });

  return {
    isVisible()   { return isVisible;                },
    scrolledTop() { navMenuOuter.style.display = ''; },
    init,
    toggle,
  };

  function init()
  {
    siteHeader   = document.getElementById('site-header');
    navMenuOuter = document.querySelector('#site-navigation .nav-menu-outer');
    navMenuInner = document.querySelector('#site-navigation .nav-menu-inner');
    modalOverlay = document.getElementById('nav-menu-modal-overlay');

    utils.addListenerAll('div.nav-menu-toggle', 'click', toggle);
    modalOverlay.addEventListener('click', toggle);
    observer.observe(navMenuOuter);
  }

  function toggle()
  {
    siteHeaderHeight = siteHeader.offsetHeight;

    if (siteHeader.classList.contains('sticky-nav-up'))
    {
      navMenuOuter.style.display = isVisible ? 'none' : 'flex';
    }
    else
    {
      if (siteHeader.classList.contains('sticky-nav-down') === false)
        siteHeader.classList.toggle('hide-nav-menu');
    }
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

  function observerCallback(entries)
  {
    isVisible = (entries[0].contentRect.height !== 0) ? true : false;

    if (isVisible)
    {
      if (modalOverlay.className === '')
      {
        setOverflowScroll();
        modalOverlay.style.backgroundColor = `rgba(0, 0, 0, ${Math.round(10 * (settings.site.modalOverlayOpacity / 100)) / 10})`;
        modalOverlay.classList.add('show');
      }
    }
    else
    {
      modalOverlay.className     = '';
      navMenuOuter.style.display = '';
      setOverflowProps();
    }
  }

  function setOverflowScroll()
  {
    if (utils.matchesMedia(utils.MATCH.SITE_MAX_WIDTH_MOBILE))
    {
      const margins = utils.getCssPropValue('margin-top', navMenuInner) + utils.getCssPropValue('margin-bottom', navMenuInner);
      setOverflowProps('hidden', 'close', '100vh', `overflow-y: auto; max-height: ${window.innerHeight - (siteHeaderHeight + margins)}px`);
    }
  }

  function setOverflowProps(overflowY = '', textContent = 'menu', height = '', style = '')
  {
    document.documentElement.style.overflowY = overflowY;
    siteHeader.querySelectorAll('.nav-menu-toggle span')?.forEach(element => element.textContent = textContent);
    siteHeader.style.height = height;
    navMenuInner.style      = style;
  }
});

export const navMenu = navMenuClosure();
