//
// Set and get storage values
// Read, write and parse storage JSON data
//
// https://ultrafunk.com
//


import * as debugLogger   from './debuglogger.js';
import { settingsSchema } from  './settings/settings.js';

import {
  validateSettings as validateSettingsDeep
} from './settings/validate-settings.js';


/*************************************************************************************************/


const debug     = debugLogger.newInstance('storage');
const observers = {};

export const KEY = {
//sessionStorage keys
  UF_AUTOPLAY:         'uf_autoplay',
  UF_TERMLIST_CACHE:   'uf_termlist_cache',
  UF_TERMLIST_STATE:   'uf_termlist_state',
//localStorage keys
  UF_SETTINGS:         'uf_settings',
  UF_PRESET_LIST:      'uf_preset_list',
  UF_SITE_THEME:       'uf_site_theme',
  UF_GALLERY_LAYOUT:   'uf_gallery_layout',
//document.cookie keys
//ToDo: Merge all cookies into one cookie (UF_USER_SETTINGS) as a JSON encoded string?
//UF_USER_SETTINGS:    'uf_user_settings',
  UF_GALLERY_PER_PAGE: 'uf_gallery_per_page',
//UF_LIST_PER_PAGE:    'uf_list_per_page',
  UF_PREFERRED_PLAYER: 'uf_preferred_player',
  UF_SHUFFLE_UID:      'uf_shuffle_uid',
//Temp document.cookie keys
  UF_RESHUFFLE:        'uf_reshuffle',
};

const DEPRECATED_KEYS = {
//localStorage keys
  UF_PLAYBACK_SETTINGS: 'UF_PLAYBACK_SETTINGS',
  UF_SITE_SETTINGS:     'UF_SITE_SETTINGS',
  UF_SITE_THEME:        'UF_SITE_THEME',
  UF_TRACK_LAYOUT:      'UF_TRACK_LAYOUT',
  UF_GALLERY_LAYOUT:    'UF_GALLERY_LAYOUT',
//document.cookie keys
  UF_TRACKS_PER_PAGE:  'UF_TRACKS_PER_PAGE',
  UF_PREFERRED_PLAYER: 'UF_PREFERRED_PLAYER',
  UF_SHUFFLE_UID:      'UF_SHUFFLE_UID',
  UF_RESHUFFLE:        'UF_RESHUFFLE',
  ULTRAFUNK_UID:       'ultrafunk_uid',
};

export const YEAR_IN_SECONDS = (60 * 60 * 24 * 365);


// ************************************************************************************************
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
// ************************************************************************************************

export function isAvailable(storageType)
{
  let storage;

  try
  {
    storage = window[storageType];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  }
  catch(exception)
  {
    return exception instanceof DOMException && (
      // everything except Firefox
      exception.code === 22 ||
      // Firefox
      exception.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      exception.name === 'QuotaExceededError' ||
      // Firefox
      exception.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  }
}


// ************************************************************************************************
// Set and delete cookie key => value pairs
// ************************************************************************************************

export function setCookie(keyName, keyValue = '', maxAge = YEAR_IN_SECONDS, path = '/')
{
  document.cookie = `${keyName}=${keyValue}; Max-Age=${maxAge}; Path=${path}; Secure; SameSite=Strict`;
}

export function deleteCookie(keyName, path = '/')
{
  document.cookie = `${keyName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}


// ************************************************************************************************
// get / set local storage key => value pairs
// ************************************************************************************************

export function getValue(keyName, defaultValue = null, setDefault = false)
{
  const keyValue = localStorage.getItem(keyName);

  if (keyValue === null)
  {
    if (setDefault && (defaultValue !== null))
      setValue(keyName, defaultValue);

    return defaultValue;
  }

  return keyValue;
}

export function setValue(keyName, keyValue)
{
  try
  {
    localStorage.setItem(keyName, keyValue);
  }
  catch(exception)
  {
    debug.error(exception);
  }
}


// ************************************************************************************************
// Read (parse) and write (stringify) JSON data from local storage
// ************************************************************************************************

export function readJson(keyName, defaultValue = null, setDefault = false)
{
  debug.log(`readJson(): ${keyName} - ${defaultValue} - ${setDefault}`);

  const keyValue     = localStorage.getItem(keyName);
  let parsedKeyValue = null;

  if (keyValue === null)
  {
    if (setDefault && (defaultValue !== null))
      writeJson(keyName, defaultValue);

    return defaultValue;
  }
  else
  {
    try
    {
      parsedKeyValue = JSON.parse(keyValue);
    }
    catch(exception)
    {
      debug.error(exception);

      // ToDo: Return error state to specify (for the user) that default settings are used??
      if (defaultValue !== null)
        parsedKeyValue = defaultValue;
    }
  }

  return parsedKeyValue;
}

export function writeJson(keyName, keyData)
{
  debug.log(`writeJson(): ${keyName} - ${keyData}`);

  try
  {
    localStorage.setItem(keyName, JSON.stringify(keyData));
  }
  catch(exception)
  {
    debug.error(exception);
  }
}


// ************************************************************************************************
// Recursive merge and cleanup for settings objects on new version
// ************************************************************************************************

function mergeSettings(oldSettings, newSettings, settingsKey)
{
  debug.log(`mergeSettings(): Merging ${settingsKey} from version ${oldSettings.version} to version ${newSettings.version}`);

  const mergedSettings = { version: newSettings.version };

  mergeDeep(oldSettings, newSettings, mergedSettings);
  cleanDeep(mergedSettings, newSettings);

  return mergedSettings;
}

function mergeDeep(oldSettings, newSettings, destination)
{
  for (const key in newSettings)
  {
    if (typeof newSettings[key] === 'object')
    {
      if (oldSettings && (typeof oldSettings[key] === 'object'))
      {
        debug.log(`mergeDeep() - Merging: ${key}`);
        destination[key] = { ...newSettings[key], ...oldSettings[key] };
        mergeDeep(oldSettings[key], newSettings[key], destination[key]);
      }
      else
      {
        debug.log(`mergeDeep() - Copying: ${key}`);
        destination[key] = { ...newSettings[key] };
        mergeDeep({}, newSettings[key], destination[key]);
      }
    }
  }
}

//
// Delete all orphaned Settings properties / objects that are no longer in use after merge
//
function cleanDeep(mergedSettings, newSettings)
{
  for (const key in mergedSettings)
  {
    if ((key in newSettings) === false)
    {
      debug.log(`cleanDeep() - Deleting: ${key} (${(typeof mergedSettings[key] === 'object') ? 'object' : 'property'})`);
      delete mergedSettings[key];
    }

    if (typeof mergedSettings[key] === 'object')
      cleanDeep(mergedSettings[key], newSettings[key]);
  }
}

//
// Clean up (delete) any localStorage or cookie-data that is no longer in use...
//
function cleanupOldData(skipOldDataCheck = false)
{
  debug.log(`cleanupOldData(): ${skipOldDataCheck ? 'Skipping' : 'Performing quick'} old data cleanup check...`);

  if (skipOldDataCheck || (localStorage.getItem(DEPRECATED_KEYS.UF_SITE_THEME) !== null))
  {
    debug.log(`cleanupOldData(): Running cleanup...`);

    localStorage.removeItem(DEPRECATED_KEYS.UF_PLAYBACK_SETTINGS);
    localStorage.removeItem(DEPRECATED_KEYS.UF_SITE_SETTINGS);
    localStorage.removeItem(DEPRECATED_KEYS.UF_SITE_THEME);
    localStorage.removeItem(DEPRECATED_KEYS.UF_TRACK_LAYOUT);
    localStorage.removeItem(DEPRECATED_KEYS.UF_GALLERY_LAYOUT);
    deleteCookie(DEPRECATED_KEYS.UF_TRACKS_PER_PAGE);
    deleteCookie(DEPRECATED_KEYS.UF_PREFERRED_PLAYER);
    deleteCookie(DEPRECATED_KEYS.UF_SHUFFLE_UID);
    deleteCookie(DEPRECATED_KEYS.UF_RESHUFFLE);
    deleteCookie(DEPRECATED_KEYS.ULTRAFUNK_UID);
  }
}

function validateSettings(settingsKey, settingsObject, defaultSettings)
{
  try
  {
    const invalidSettingsCount = validateSettingsDeep(settingsObject, settingsSchema);

    if (invalidSettingsCount > 0)
      writeJson(settingsKey, settingsObject);
  }
  catch(exception)
  {
    debug.error(`validateSettings() exception: ${exception} -- using default settings`);

    writeJson(settingsKey, defaultSettings);

    return defaultSettings;
  }

  return settingsObject;
}


// ************************************************************************************************
// Read and write settings proxy
// ************************************************************************************************

export function readWriteSettingsProxy(settingsKey, defaultSettings = null, setDefault = false)
{
  const parsedJson = readJson(settingsKey, defaultSettings, setDefault);

  if ((parsedJson !== null) && (defaultSettings !== null) && (parsedJson.version !== undefined))
  {
    let settingsObject = parsedJson;

    // If version is new, perform settings merge, cleanup and deletion of deprecated settings
    if (parsedJson.version < defaultSettings.version)
    {
      debug.log(parsedJson);

      settingsObject = mergeSettings(parsedJson, defaultSettings, settingsKey);
      writeJson(settingsKey, settingsObject);

      // Always run cleanup on version update
      cleanupOldData(true);

      debug.log(settingsObject);
    }
    else
    {
      // Only run cleanup if old data is detected (much quicker)
      cleanupOldData(false);
    }

    return onSettingsChange(settingsKey, validateSettings(settingsKey, settingsObject, defaultSettings));
  }

  if (defaultSettings !== null)
  {
    debug.warn(`readWriteSettingsProxy() - Failed for: ${settingsKey} -- using default settings`);

    writeJson(settingsKey, defaultSettings);

    return onSettingsChange(settingsKey, defaultSettings);
  }

  debug.error(`readWriteSettingsProxy() - Fatal error for: ${settingsKey} -- unable to read settings!`);

  return null;
}


// ************************************************************************************************
// Proxy traps (handlers) for settings get and set
// ************************************************************************************************

const onSettingsChange = (settingsKey, settingsObject) =>
{
  const handler =
  {
    get(target, property, receiver)
    {
    //debug.log(`onSettingsChange(): Get property: ${property}`);

      if (property in target)
      {
        const value = Reflect.get(target, property, receiver);

        if (typeof value === 'object')
          return new Proxy(value, handler);

        return value;
      }

      debug.error(`onSettingsChange(): Get unknown property: ${property}`);
    },

    set(target, property, newValue, receiver)
    {
    //debug.log(`onSettingsChange(): Set property: ${property}`);

      if (property in target)
      {
        const oldValue = Reflect.get(target, property, receiver);

        // Only update and write data if it has changed
        if (newValue !== oldValue)
        {
          Reflect.set(target, property, newValue);
          writeJson(settingsKey, settingsObject);
          callSettingsObservers(property, oldValue, newValue);
        }

        return true;
      }

      debug.error(`onSettingsChange(): Set unknown property: ${property}`);
      return true;
    },
  };

  return new Proxy(settingsObject, handler);
};


// ************************************************************************************************
// Add and call settings observers on property changes
// ************************************************************************************************

export function addSettingsObserver(property, observer)
{
  debug.log(`addSettingsObserver() for property: ${property}`);

  if ((property in observers) === false)
    observers[property] = [];

  observers[property].push(observer);
}

function callSettingsObservers(property, oldValue, newValue)
{
  if (property in observers)
  {
    debug.log(`callSettingsObserver() for property: ${property} - oldValue: ${oldValue} - newValue: ${newValue}`);
    observers[property].forEach(observer => observer(oldValue, newValue));
  }
}
