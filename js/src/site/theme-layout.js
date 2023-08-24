//
// Ultrafunk site theme and layout module
//
// https://ultrafunk.com
//


import { newDebugLogger }   from '../shared/debuglogger.js';
import { ElementToggle }    from '../shared/element-toggle.js';
import { KEY, setValue }    from '../shared/storage.js';
import { getCssPropString } from '../shared/utils.js';

import {
  settings,
  readSettings,
} from '../shared/session-data.js';


/*************************************************************************************************/


const debug = newDebugLogger('theme-layout');
const htmlClassList = document.documentElement.classList;

export let siteTheme     = {};
export let galleryLayout = {};


// ************************************************************************************************
//
// ************************************************************************************************

export function init()
{
  debug.log('init()');

  siteTheme     = new SiteThemeToggle('footer-site-theme-toggle');
  galleryLayout = new GalleryLayoutToggle('footer-gallery-layout-toggle');

  document.addEventListener('settingsUpdated', () =>
  {
    readSettings();
    siteTheme.setCurrent();
    galleryLayout.setCurrent();
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
      black: { id: 'black', text: 'black', class: 'site-theme-black' },
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

      htmlClassList.remove(this.themes.light.class, this.themes.dark.class, this.themes.black.class);
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

    this.minWidth = `(max-width: ${getCssPropString('--gallery-layout-min-width')})`;

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
