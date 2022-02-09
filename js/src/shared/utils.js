//
// Shared utility functions
//
// https://ultrafunk.com
//


import * as debugLogger     from './debuglogger.js';
import { settings }         from './session-data.js';
import { TRACK_TYPE }       from '../playback/shared-gallery-list.js';
import { PREF_PLAYER }      from './settings/settings.js';
import { showSnackbar }     from './snackbar.js';
import { getYouTubeImgUrl } from '../playback/mediaplayers.js';


export {
  SITE_URL,
  MATCH,
  addListener,
  addListenerAll,
  getCssPropString,
  getCssPropValue,
  matchesMedia,
  replaceClass,
  escHtml,
  escAttribute,
  stripHtml,
  stripAttribute,
  navToUrl,
  getListPlayerUrl,
  getGalleryPlayerUrl,
  getPrefPlayerUrl,
  getThumbnailData,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('utils');

const SITE_URL      = debug.isDebug() ? 'https://wordpress.ultrafunk.com'      : 'https://ultrafunk.com';
const SITE_URL_LIST = debug.isDebug() ? 'https://wordpress.ultrafunk.com/list' : 'https://ultrafunk.com/list';

const validUrlRegEx = debug.isDebug()
                        ? /^https:\/\/wordpress\.ultrafunk\.com[/?=%A-Za-z0-9\-_.~+]*$/
                        : /^https:\/\/ultrafunk\.com[/?=%A-Za-z0-9\-_.~+]*$/;

const DOMParserInstance = new DOMParser();

const MATCH = {
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

function addListener(selectors, type, listener, data = null)
{
  document.querySelector(selectors)?.addEventListener(type, (event) => listener(event, data));
}

// Plain JS function equivalent to jQuery(selectors).eventX();
// Adds event listeners of 'type' to all matching selectors 
function addListenerAll(selectors, type, listener, data = null)
{
  const elementList = document.querySelectorAll(selectors);
  elementList.forEach(element => element.addEventListener(type, (event) => listener(event, data)));
}

function getCssPropString(prop, element = document.documentElement)
{
  let string = getComputedStyle(element).getPropertyValue(prop);

  if (string.length !== 0)
    string = string.replace(/'|"/g, '').trim();
  else
    debug.error(`getCssPropString(${prop}): Returned CSS property string is empty`);

  return string;
}

function getCssPropValue(prop, element = document.documentElement)
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
function matchesMedia(matchMedia)
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

function replaceClass(element, removeClass, addClass)
{
  element.classList.remove(removeClass);
  element.classList.add(addClass);
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

function escHtml(string)
{
  return String(string).replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
}

function escAttribute(element, attribute)
{
  const value = element.getAttribute(attribute);

  if (value !== null)
    return escHtml(value);

  return value;
}

//
// ToDo: Replace with DOMPurify or the HTML Sanitizer API: https://github.com/WICG/sanitizer-api
//
function stripHtml(string)
{
  const firstPass  = DOMParserInstance.parseFromString(string, 'text/html');
  const secondPass = DOMParserInstance.parseFromString(firstPass.body.textContent, 'text/html');

//debug.log(`stripHtml(DOMParser): ${secondPass.body.textContent}`);

  return secondPass.body.textContent;
}

function stripAttribute(element, attribute)
{
  const value = element.getAttribute(attribute);

  if (value !== null)
    return stripHtml(value);
  
  return value;
}


// ************************************************************************************************
// 
// ************************************************************************************************

function navToUrl(destUrl)
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
  
  // ToDo: Goto 404 error page instead of showSnackbar()?
  //window.location.href = '/';
  }
}

function getListPlayerUrl(destUrl)
{
  return destUrl.replace(SITE_URL, SITE_URL_LIST);
}

function getGalleryPlayerUrl(destUrl)
{
  return destUrl.replace(SITE_URL_LIST, SITE_URL);  
}

function getPrefPlayerUrl(destUrl)
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

function getThumbnailData(metaData)
{
  if (metaData.track_source_type === TRACK_TYPE.YOUTUBE)
    return getYouTubeImgUrl(metaData.track_source_data);

  return { src: '/wp-content/themes/ultrafunk/inc/img/sc_thumbnail_placeholder.png', class: 'type-soundcloud', uid: '' };
}
