//
// Ultrafunk site nav-menu
//
// https://ultrafunk.com
//


import * as utils from '../shared/utils.js';

import {
  noPlayback,
  shuffleClickNavTo,
} from '../playback/shared-gallery-list.js';


export { navMenu };


// ************************************************************************************************
// Main navigation menu handling
// ************************************************************************************************

const navMenu = (() =>
{
  const observer = new ResizeObserver(observerCallback);
  let siteHeader = null, navMenu = null, modalOverlay = null;
  let isVisible = false;

  window.addEventListener('load', () =>
  {
    utils.addListener('#menu-primary-menu .menu-item-reshuffle a', 'click', shuffleClickNavTo);
    document.getElementById('menu-primary-menu')?.addEventListener('click', menuClickUsePrefPlayer);
  });

  return {
    isVisible()   { return isVisible;           },
    scrolledTop() { navMenu.style.display = ''; },
    init,
    toggle,
  };

  function init()
  {
    siteHeader   = document.getElementById('site-header');
    navMenu      = document.querySelector('#site-navigation .nav-menu-outer');
    modalOverlay = document.getElementById('nav-menu-modal-overlay');

    utils.addListenerAll('.nav-menu-toggle', 'click', toggle);
    modalOverlay.addEventListener('click', toggle);
    modalOverlay.addEventListener('transitionend', transitionEnd);
    observer.observe(navMenu.querySelector('.menu-primary-menu-container'));
  }

  function menuClickUsePrefPlayer(event)
  {
    const menuElement = event.target.closest('li.menu-item.menu-item-object-uf_channel');

    if ((menuElement !== null) && noPlayback())
    {
      event?.preventDefault();
      utils.navToUrl(utils.getPrefPlayerUrl(menuElement.querySelector('a').href));
    }
  }

  function toggle()
  {
    if (siteHeader.classList.contains('sticky-nav-up'))
    {
      if (isVisible)
        navMenu.style.display = 'none';
      else
        navMenu.style.display = 'flex';
    }
    else
    {
      if (siteHeader.classList.contains('sticky-nav-down') === false)
        siteHeader.classList.toggle('hide-nav-menu');
    }
  }

  function observerCallback(entries)
  {
    isVisible = (entries[0].contentRect.height !== 0) ? true : false;

    if (isVisible)
    {
      modalOverlay.className = '';
      modalOverlay.classList.add('show');
      /*
      siteHeader.classList.add('no-backdrop-blur');
      */
      setTimeout(() => modalOverlay.classList.add('fadein'), 50);
    }
    else
    {
      /*
      siteHeader.classList.remove('no-backdrop-blur');
      */
      modalOverlay.classList.add('fadeout');
    }
  }

  function transitionEnd()
  {
    if (isVisible === false)
    {
      modalOverlay.className = '';
      navMenu.style.display  = '';
      /*
      //ToDo: This is probably not needed...?
      siteHeader.classList.remove('no-backdrop-blur');
      */
    }
  }
})();
