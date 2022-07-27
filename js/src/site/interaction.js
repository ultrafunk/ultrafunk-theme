//
// Ultrafunk site interaction
//
// https://ultrafunk.com
//


import * as debugLogger      from '../shared/debuglogger.js';
import * as utils            from '../shared/utils.js';
import ElementToggle         from '../shared/element-toggle.js';
import ElementClick          from '../shared/element-click.js';
import { settings }          from '../shared/session-data.js';
import { showModal }         from '../shared/modal.js';
import { KEY, setValue }     from '../shared/storage.js';
import { getModalTrackHtml } from '../shared/modal-templates.js';

import {
  shareModal,
  copyTextToClipboard,
} from './share-modal.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('site-interaction');
const htmlClassList = document.documentElement.classList;

const m = {
  metaUiElements: null,
  listUiElements: null,
};

export let siteTheme     = {};
export let galleryLayout = {};


// ************************************************************************************************
//
// ************************************************************************************************

export function init()
{
  debug.log('init()');

  m.metaUiElements = new MetaUiElements('div.track-meta', true);
  m.listUiElements = new ListUiElements('#tracklist');
  siteTheme        = new SiteThemeToggle('footer-site-theme-toggle');
  galleryLayout    = new GalleryLayoutToggle('footer-gallery-layout-toggle');

  window.addEventListener('load', () =>
  {
    document.querySelector('.widget ul.uf_channel')?.addEventListener('click', linkClick);
    document.querySelector('.widget ul.uf_artist')?.addEventListener('click', linkClick);
    document.querySelector('.widget.widget_archive ul')?.addEventListener('click', linkClick);
  });
}

export function settingsUpdated()
{
  siteTheme.setCurrent();
  galleryLayout.setCurrent();
}


// ************************************************************************************************
// UI elements event handling
// ************************************************************************************************

class MetaUiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.track-share-control'))
      return sharePlayClick(this.closest('single-track, gallery-track'));

    if (this.clicked('span.term-links'))
      return linkClick(this.event);
  }
}

class ListUiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.share-play-button'))
      return sharePlayClick(this.closest('div.track-entry'));

    if (this.clicked('div.details-button'))
      return detailsClick(this.closest('div.track-entry'));
  }
}

function linkClick(event)
{
  if (event.target.matches('a'))
  {
    event?.preventDefault();
    utils.navToUrl(utils.getPrefPlayerUrl(event.target.href));
  }
}

function sharePlayClick(element)
{
  const trackArtist = utils.stripAttribute(element, 'data-track-artist');
  const trackTitle  = utils.stripAttribute(element, 'data-track-title');

  const modalId = shareModal.show({
    bodyText:       `${trackArtist} - ${trackTitle}`,
    filterBodyText: true,
    bodyHtml:       getModalTrackHtml(element, trackArtist, trackTitle),
    url:            utils.stripAttribute(element, 'data-track-url'),
    sourceUid:      utils.stripAttribute(element, 'data-track-source-uid'),
  });

  trackThumbnailClick(modalId, `${trackArtist} - ${trackTitle}`);
}

function detailsClick(element)
{
  const trackArtist   = utils.stripAttribute(element, 'data-track-artist');
  const trackTitle    = utils.stripAttribute(element, 'data-track-title');
  const trackDuration = parseInt(element.getAttribute('data-track-duration'));
  const artists       = element.querySelector('.track-artists-links').querySelectorAll('a');
  const channels      = element.querySelector('.track-channels-links').querySelectorAll('a');
  const modalEntries  = [];

  modalEntries.push({
    class:   'track-details-entry',
    content: getModalTrackHtml(element, trackArtist, trackTitle),
  });

  modalEntries.push({ class: 'header-entry', content: 'Artists' });

  artists.forEach(item =>
  {
    modalEntries.push({
      clickId: `entry-${modalEntries.length}`,
      class:   `icon-text ${item.classList[0]}`,
      title:   'Go to Artist',
      content: item.innerText,
      link:    item.href,
      icon:    'link',
    });
  });

  modalEntries.push({ class: 'header-entry', content: 'Channels' });

  channels.forEach(item =>
  {
    modalEntries.push({
      clickId: `entry-${modalEntries.length}`,
      title:   'Go to Channel',
      content: item.innerText,
      link:    item.href,
      icon:    'link'
    });
  });

  const modalId = showModal(
    `Track Details<span class="light-text lowercase-text">${((trackDuration > 0) ? utils.getTimeString(trackDuration) : 'N / A')}</span>`,
    modalEntries,
    'track-details',
    (clickedId) =>
  {
    utils.navToUrl(modalEntries.find(item => (item.clickId === clickedId)).link);
  });

  trackThumbnailClick(modalId, `${trackArtist} - ${trackTitle}`);
}

function trackThumbnailClick(modalId, artistTitle)
{
  document.getElementById(modalId).querySelector('.modal-track').title = 'Click / tap to Copy Artist & Title';

  document.getElementById(modalId)?.querySelector('img')?.addEventListener('click', () =>
  {
    copyTextToClipboard(artistTitle, 'Artist &amp Title copied to clipboard', 'Unable to copy Artist &amp Title to clipboard');
  });
}


// ************************************************************************************************
// Site theme and layout settings helpers
// ************************************************************************************************

function getCurrentSetting(settingsObject, currentId, defaultSetting)
{
  const setting = Object.values(settingsObject).find(value => (value.id === currentId));
  return ((setting !== undefined) ? setting : defaultSetting);
}

function getNextSetting(settingsObject, currentSetting)
{
  const index = Object.values(settingsObject).findIndex(value => (value.id === currentSetting.id));
  const keys  = Object.keys(settingsObject);

  return (((index + 1) < keys.length)
           ? settingsObject[keys[index + 1]]
           : settingsObject[keys[0]]);
}


// ************************************************************************************************
// Site theme handling
// ************************************************************************************************

class SiteThemeToggle extends ElementToggle
{
  constructor(elementId)
  {
    super(elementId, false);

    this.themes = {
      light: { id: 'light', text: 'light', class: 'site-theme-light' },
      dark:  { id: 'dark',  text: 'dark',  class: 'site-theme-dark'  },
      auto:  { id: 'auto',  text: 'auto'                             }, // This has no CSS class since auto is always light or dark
    };

    this.setCurrent();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.matchMediaPrefColorScheme());
  }

  setCurrent()
  {
    this.currentTheme = getCurrentSetting(this.themes, settings.site.theme, this.themes.auto);
    this.update();
  }

  matchMediaPrefColorScheme()
  {
    if (this.currentTheme.id === this.themes.auto.id)
      this.update();
  }

  toggle()
  {
    this.currentTheme   = getNextSetting(this.themes, this.currentTheme);
    settings.site.theme = this.currentTheme.id;
  }

  update()
  {
    let newTheme = this.currentTheme;

    if (this.currentTheme.id === this.themes.auto.id)
    {
      newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                   ? this.themes.dark
                   : this.themes.light;
    }

    setValue(KEY.UF_SITE_THEME, newTheme.id);

    // Only update DOM if something has actually changed...
    if (htmlClassList.contains(newTheme.class) === false)
    {
      debug.log(`SiteThemeToggle.update() - newSiteTheme: ${newTheme.id}`);

      htmlClassList.remove(this.themes.light.class, this.themes.dark.class);
      htmlClassList.add(newTheme.class);
    }

    // Always update this because AUTO is not a separate class (only DARK + LIGHT are classes)
    this.value = this.currentTheme.text;
  }
}


// ************************************************************************************************
// Gallery layout handling
// ************************************************************************************************

class GalleryLayoutToggle extends ElementToggle
{
  constructor(elementId)
  {
    super(elementId, false);

    this.minWidth = `(max-width: ${utils.getCssPropString('--gallery-layout-min-width')})`;

    this.layouts = {
      oneColumn:   { id: '1-column', text: '1 column',     class: 'gallery-1-col' },
      twoColumn:   { id: '2-column', text: '2 column',     class: 'gallery-2-col' },
      threeColumn: { id: '3-column', text: '3 / 4 column', class: 'gallery-3-col' },
    };

    this.setCurrent();

    window.matchMedia(this.minWidth).addEventListener('change', (event) => this.matchMediaMinWidth(event));
  }

  setCurrent()
  {
    this.currentLayout = getCurrentSetting(this.layouts, settings.gallery.layout, this.layouts.threeColumn);
    this.update();
  }

  matchMediaMinWidth(event)
  {
    if (htmlClassList.contains('gallery-layout'))
    {
      if (event.matches)
      {
        htmlClassList.remove(this.currentLayout.class);
        htmlClassList.add(this.layouts.oneColumn.class);
      }
      else
      {
        htmlClassList.remove(this.layouts.oneColumn.class);
        htmlClassList.add(this.currentLayout.class);
      }
    }
  }

  toggle()
  {
    this.currentLayout      = getNextSetting(this.layouts, this.currentLayout);
    settings.gallery.layout = this.currentLayout.id;
  }

  update(event)
  {
    this.value = this.currentLayout.text;
    setValue(KEY.UF_GALLERY_LAYOUT, this.currentLayout.id);

    if (window.matchMedia(this.minWidth).matches)
      return;

    // Only update DOM if needed and when something has actually changed
    if ((htmlClassList.contains('gallery-layout')) && (htmlClassList.contains(this.currentLayout.class) === false))
    {
      debug.log(`GalleryLayoutToggle.update() - newGalleryLayout: ${this.currentLayout.id}`);

      htmlClassList.remove(this.layouts.oneColumn.class, this.layouts.twoColumn.class, this.layouts.threeColumn.class);
      htmlClassList.add(this.currentLayout.class);
    }

    if (event?.type === 'click')
      this.element.scrollIntoView();
  }
}
