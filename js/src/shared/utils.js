//
// Shared utility functions
//
// https://ultrafunk.com
//


import * as debugLogger from './debuglogger.js';
import { settings }     from './session-data.js';
import { PREF_PLAYER }  from './settings/settings.js';
import { showSnackbar } from './snackbar.js';

import {
  TRACK_TYPE,
  getYouTubeImgUrl,
} from '../playback/mediaplayers.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('utils');

export const SITE_URL = debug.isDebug() ? 'https://wordpress.ultrafunk.com'      : 'https://ultrafunk.com';
const SITE_URL_LIST   = debug.isDebug() ? 'https://wordpress.ultrafunk.com/list' : 'https://ultrafunk.com/list';

const validUrlRegEx = debug.isDebug()
                        ? /^https:\/\/wordpress\.ultrafunk\.com[/?&=%A-Za-z0-9\-_.~+]*$/
                        : /^https:\/\/ultrafunk\.com[/?&=%A-Za-z0-9\-_.~+]*$/;

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
// Misc. shared utility functions
// ************************************************************************************************

export function addListener(selectors, type, listener)
{
  document.querySelector(selectors)?.addEventListener(type, listener);
}

// Plain JS function equivalent to jQuery(selectors).eventX();
// Adds event listeners of 'type' to all matching selectors
export function addListenerAll(selectors, type, listener)
{
  const elementList = document.querySelectorAll(selectors);
  elementList.forEach(element => element.addEventListener(type, listener));
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
// https://github.com/janl/mustache.js/blob/master/mustache.js#L59
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
  return String(string).replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
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
  if (destUrl && (destUrl.match(validUrlRegEx) !== null))
  {
    debug.log(`navToUrl() - Valid destUrl: ${destUrl}`);
    window.location.href = destUrl;
  }
  else if (destUrl !== null)
  {
    debug.error(`navToUrl() - Invalid destUrl: ${destUrl}`);
    showSnackbar('Error navigating to URL!', 0, 'Reload', () => location.reload());
  }
}

export function getListPlayerUrl(destUrl)
{
  return destUrl.replace(SITE_URL, SITE_URL_LIST);
}

export function getGalleryPlayerUrl(destUrl)
{
  return destUrl.replace(SITE_URL_LIST, SITE_URL);
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

export function getThumbnailData(metaData)
{
  if (metaData.track_source_type === TRACK_TYPE.YOUTUBE)
    return getYouTubeImgUrl(metaData.track_source_data);

  return { src: '/wp-content/themes/ultrafunk/inc/img/sc_thumbnail_placeholder.png', class: 'type-soundcloud', uid: '' };
}


// ************************************************************************************************
//
// ************************************************************************************************

export const FETCH_ERROR_TYPE = {
  UNKNOWN: 0,
  NETWORK: 1,
};

export async function fetchRest(endpoint, query, returnStatus = false, path = '/wp-json/wp/v2/')
{
  debug.log(`fetchRest(): ${path}${endpoint}?${query}`);

  return fetch(`${path}${endpoint}?${query}`)
  .then(async (response) =>
  {
    if (!response.ok)
    {
      debug.warn(response);

      if (returnStatus)
        return { status: { code: response.status, details: await response.json() }};

      return null;
    }

    if (returnStatus)
      return { status: { code: response.status }, data: await response.json() };

    return response.json();
  })
  .catch(reason =>
  {
    debug.error(reason);

    if (returnStatus)
    {
      const errorType = (reason instanceof TypeError) ? FETCH_ERROR_TYPE.NETWORK : FETCH_ERROR_TYPE.UNKNOWN;
      return { status: { code: 0, type: errorType, message: reason.message }};
    }

    return null;
  });
}
