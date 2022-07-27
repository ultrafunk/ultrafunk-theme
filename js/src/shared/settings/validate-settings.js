//
// Validation for playback and site settings
//
// https://ultrafunk.com
//


import * as debugLogger from '../debuglogger.js';

import {
  TYPE_INTEGER,
  TYPE_BOOLEAN,
  TYPE_STRING
} from './settings.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('validate-settings');


// ************************************************************************************************
// Validation
// ************************************************************************************************

export function validateSettings(settings, schema)
{
  let invalidCount = 0;

  validateRecursive(settings, schema);

  return invalidCount;

  function validateRecursive(settingsObject, schemaObject)
  {
    for (const key in settingsObject)
    {
      if (settingsObject && schemaObject && (typeof settingsObject[key] === 'object') && (typeof schemaObject[key] === 'object'))
      {
        validateRecursive(settingsObject[key], schemaObject[key]);
      }
      else
      {
        if (schemaObject[key] !== undefined)
        {
          if (isEntryInvalid(settingsObject, schemaObject[key], settingsObject[key], key))
            invalidCount++;
        }
        else
        {
          throw(`'${key}' ${(typeof settingsObject[key] === 'object') ? 'object' : 'property'} is not in schema`);
        }
      }
    }
  }
}

function isEntryInvalid(settings, schemaEntry, settingValue, entryKey)
{
  switch (schemaEntry.type)
  {
    case TYPE_INTEGER:
      if ((Number.isInteger(settingValue) === false) || (settingValue < schemaEntry.values[0]) || (settingValue > schemaEntry.values[schemaEntry.values.length - 1]))
      {
        debug.warn(`validate() - '${entryKey}' has invalid value: ${settingValue} ('${entryKey}' is type: INTEGER - min: ${schemaEntry.values[0]} - max: ${schemaEntry.values[schemaEntry.values.length - 1]}) -- setting default value: ${schemaEntry.default}`);
        settings[entryKey] = schemaEntry.default;
        return true;
      }
      break;

    case TYPE_BOOLEAN:
      if ((settingValue !== true) && (settingValue !== false))
      {
        debug.warn(`validate() - '${entryKey}' has invalid value: ${settingValue} ('${entryKey}' is type: BOOLEAN) -- setting default value: ${schemaEntry.default}`);
        settings[entryKey] = schemaEntry.default;
        return true;
      }
      break;

    case TYPE_STRING:
      if (typeof settingValue !== 'string')
      {
        debug.warn(`validate() - '${entryKey}' has invalid value: ${settingValue} ('${entryKey}' is type: STRING) -- setting default value: ${schemaEntry.default}`);
        settings[entryKey] = schemaEntry.default;
        return true;
      }
      break;

    default:
      debug.warn(`validate() - '${entryKey}' has unknown type: ${schemaEntry.type}`);
      return true;
  }
}

