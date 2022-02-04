//
// Get session data
//
// https://ultrafunk.com
//


import * as debugLogger    from './debuglogger.js';
import { defaultSettings } from './settings/settings.js';

import {
  KEY,
  readWriteSettingsProxy,
} from './storage.js';


export {
  response,
  settings,
  getSessionData,
  readSettings,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('session-data');

let response = {};
let settings = {};


// ************************************************************************************************
//
// ************************************************************************************************

function getSessionData()
{
  debug.log('UF_RESPONSE_DATA');
  response = UF_RESPONSE_DATA; // eslint-disable-line no-undef
  debug.log(response);

  readSettings();
}

function readSettings()
{
  settings = readWriteSettingsProxy(KEY.UF_SETTINGS, defaultSettings, true);
  debug.log(settings);
}
