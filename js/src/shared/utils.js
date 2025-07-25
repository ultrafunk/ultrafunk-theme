//
// Shared utility functions
//
// https://ultrafunk.com
//


import { newDebugLogger } from './debuglogger.js';
import { settings }       from './session-data.js';
import { PREF_PLAYER }    from '../settings/settings.js';
import { showSnackbar }   from './snackbar.js';

import {
  IS_PROD_BUILD,
  THEME_ENV,
} from '../config.js';


/*************************************************************************************************/


const debug = newDebugLogger('utils');

const SITE_URL_LIST = `${THEME_ENV.siteUrl}/list`;

const validUrlRegEx = IS_PROD_BUILD
  ? /^https:\/\/ultrafunk\.com[/?&=%A-Za-z0-9\-_.~+]*$/
  : /^https:\/\/wordpress\.ultrafunk\.com[/?&=%A-Za-z0-9\-_.~+]*$/;

const DOMParserInstance = new DOMParser();

export const MATCH = {
  SITE_MIN_WIDTH_WIDE:   1,
  SITE_MAX_WIDTH:        2,
  SITE_MAX_WIDTH_MOBILE: 3,
};

const siteMinWidthWide   = window.matchMedia(`(min-width: ${getCssPropString('--site-min-width-wide')})`);
const siteMaxWidth       = window.matchMedia(`(max-width: ${getCssPropString('--site-max-width')})`);
const siteMaxWidthMobile = window.matchMedia(`(max-width: ${getCssPropString('--site-max-width-mobile')})`);


// ************************************************************************************************
// Misc. shared DOM utility functions
// ************************************************************************************************

export function addListener(selectors, type, listener)
{
  document.querySelector(selectors)?.addEventListener(type, listener);
}

// Plain JS function equivalent to jQuery(selectors).eventX();
// Adds event listeners of 'type' to all matching selectors
export function addListenerAll(selectors, type, listener)
{
  document.querySelectorAll(selectors)?.forEach(element => element.addEventListener(type, listener));
}

export function getCssPropString(prop, element = document.documentElement)
{
  let string = getComputedStyle(element).getPropertyValue(prop);

  if (string.length !== 0)
    string = string.replace(/'|"/g, '').trim();
  else
    debug.error(`getCssPropString(${prop}): Returned CSS property string is empty`);

  return string;
}

export function getCssPropValue(prop, element = document.documentElement)
{
  const string = getCssPropString(prop, element);
  let value    = NaN;

  if (string.length !== 0)
    value = parseInt(string);

  if (isNaN(value))
    debug.error(`getCssPropValue(${prop}): Returned CSS property value is NaN`);

  return value;
}

// Match against live CSS media queries defined in style.css
export function matchesMedia(matchMedia)
{
  switch (matchMedia)
  {
    case MATCH.SITE_MIN_WIDTH_WIDE:
      return siteMinWidthWide.matches;

    case MATCH.SITE_MAX_WIDTH:
      return siteMaxWidth.matches;

    case MATCH.SITE_MAX_WIDTH_MOBILE:
      return siteMaxWidthMobile.matches;
  }

  return false;
}

export function replaceClass(element, removeClass, addClass)
{
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}

export function getScrollBehavior()
{
  return (settings.site.smoothScrolling ? 'smooth' : 'auto');
}

export function getOverlayOpacityCssValue()
{
  return `rgba(0, 0, 0, ${Math.round(10 * (settings.site.overlayOpacity / 100)) / 10})`;
}


// ************************************************************************************************
// escHtml() based on: https://github.com/janl/mustache.js/blob/master/mustache.js#L59
// ************************************************************************************************

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#x60;',
  '=': '&#x3D;',
  '/': '&#x2F;',
};

export function escHtml(string)
{
  return String(string).replace(/[&<>"'`=/]/g, (charToEncode, charOffset) =>
  {
    //
    // The WordPress esc_html() function attempts to avoid double-encoding, so no trouble in PHP templates,
    // but this creates problems in client-side JavaScript when getting REST results that allready contains
    // HTML entity encoded text (as stored in the database), specifically the &amp; entity for some reason...
    //
    if ((charToEncode === '&') && (string.startsWith('&amp;', charOffset)))
      return charToEncode;

    return entityMap[charToEncode];
  });
}

export function escAttribute(element, attribute)
{
  const value = element.getAttribute(attribute);

  if (value !== null)
    return escHtml(value);

  return value;
}

//
// ToDo: escHtml() + stripHtml()
// Replace with DOMPurify or the HTML Sanitizer API: https://github.com/WICG/sanitizer-api
// Enhance / fix with: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
//                     https://github.com/w3c/webappsec-trusted-types
//
export function stripHtml(string)
{
  const firstPass  = DOMParserInstance.parseFromString(string, 'text/html');
  const secondPass = DOMParserInstance.parseFromString(firstPass.body.textContent, 'text/html');

//debug.log(`stripHtml(DOMParser): ${secondPass.body.textContent}`);

  return secondPass.body.textContent;
}

export function stripAttribute(element, attribute)
{
  const value = element.getAttribute(attribute);

  if (value !== null)
    return stripHtml(value);

  return value;
}


// ************************************************************************************************
//
// ************************************************************************************************

export function navToUrl(destUrl)
{
  if (destUrl && isValidUrl(destUrl))
  {
    debug.log(`navToUrl() - Valid destUrl: ${destUrl}`);
    window.location.href = destUrl;
  }
  else if (destUrl !== null)
  {
    debug.error(`navToUrl() - Invalid destUrl: ${destUrl}`);

    showSnackbar({
      message: 'Error navigating to URL!',
      duration: 0,
      actionText: 'Reload',
      actionClickCallback: () => location.reload(),
    });
  }
}

function isValidUrl(destUrl)
{
  // URL.parse() static method requires Chrome & Firefox v126, Safari v18.0
  // https://caniuse.com/mdn-api_url_parse_static

  if (URL.parse !== undefined)
    return ((destUrl.startsWith(THEME_ENV.siteUrl)) && (URL.parse(destUrl) !== null));
  else
    return (destUrl.match(validUrlRegEx) !== null);
}

export function getListPlayerUrl(destUrl)
{
  return destUrl.replace(THEME_ENV.siteUrl, SITE_URL_LIST);
}

export function getGalleryPlayerUrl(destUrl)
{
  return destUrl.replace(SITE_URL_LIST, THEME_ENV.siteUrl);
}

export function getPrefPlayerUrl(destUrl)
{
  if (destUrl)
  {
    if (settings.playback.preferredPlayer === PREF_PLAYER.LIST)
    {
      if (destUrl.startsWith(SITE_URL_LIST) === false)
        return getListPlayerUrl(destUrl);
    }
    else if (settings.playback.preferredPlayer === PREF_PLAYER.GALLERY)
    {
      if (destUrl.startsWith(SITE_URL_LIST) === true)
        return getGalleryPlayerUrl(destUrl);
    }
  }

  return destUrl;
}

export function linkClickUsePrefPlayer(event)
{
  if (event.target.matches('a'))
  {
    event.preventDefault();
    navToUrl(getPrefPlayerUrl(event.target.href));
  }
}

export function getTimeString(seconds, includeHours = false)
{
  if (Number.isInteger(seconds))
  {
    const timeString = new Date(seconds * 1000).toISOString();

    return ((seconds > 3600) || includeHours)
      ? timeString.slice(11, 19)
      : timeString.slice(14, 19);
  }
  else
  {
    return includeHours ? '00:00:00' : '00:00';
  }
}

// ************************************************************************************************
// https://stackoverflow.com/a/18650828
// ************************************************************************************************

export function getReadableBytesSize(bytes, decimals = 2)
{
  if (!+bytes)
    return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function isPointerTypeTouch(event)
{
  // (event.mozInputSource === 5) is MOZ_SOURCE_TOUCH
  return ((event.pointerType === 'touch') || (event.mozInputSource === 5));
}


// ************************************************************************************************
// Allow / Deny keyboard shortcuts event handling closure
// ************************************************************************************************

export const keyboardShortcuts = ((keyboardShortcutsSetting) =>
{
  let allow = keyboardShortcutsSetting;

  document.addEventListener('allowKeyboardShortcuts', () =>
  {
    if (keyboardShortcutsSetting)
      allow = true;
  });

  document.addEventListener('denyKeyboardShortcuts', () =>
  {
    if (keyboardShortcutsSetting)
      allow = false;
  });

  return {
    allow() { return allow; },
  };
});

export function isControlKey(key)
{
  return ((key === 'ArrowLeft')  ||
          (key === 'ArrowRight') ||
          (key === 'Home')       ||
          (key === 'End')        ||
          (key === 'Shift'));
}
