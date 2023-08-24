//
// Get session data
//
// https://ultrafunk.com
//


import { newDebugLogger }  from './debuglogger.js';
import { defaultSettings } from '../settings/settings.js';

import {
  KEY,
  readWriteSettingsProxy,
} from './storage.js';


/*************************************************************************************************/


const debug = newDebugLogger('session-data');

export let response = {};
export let settings = {};


// ************************************************************************************************
//
// ************************************************************************************************

export function getSessionData()
{
  debug.log('UF_ResponseData');
  response = UF_ResponseData; // eslint-disable-line no-undef
  debug.log(response);

  readSettings();
}

export function readSettings()
{
  settings = readWriteSettingsProxy(KEY.UF_SETTINGS, defaultSettings, true);
  debug.log(settings);
}
