//
// View / change settings
//
// https://ultrafunk.com
//


import * as debugLogger from '../debuglogger.js?ver=1.40.6';
import { addListener }  from '../utils.js?ver=1.40.6';
import { showSnackbar } from '../snackbar.js?ver=1.40.6';

import {
  KEY,
  deleteCookie,
  readJson,
  writeJson,
} from '../storage.js?ver=1.40.6';

import {
  TYPE_INTEGER,
  TYPE_BOOLEAN,
  TYPE_STRING,
  settingsSchema,
  defaultSettings,
} from './settings.js?ver=1.40.6';


/*************************************************************************************************/


const debug = debugLogger.newInstance('settings-ui');

const m = {
  settings:  null,
  container: null,
};

const config = {
  containerId:  'settings-container',
  saveResetId:  'settings-save-reset',
  updatedEvent: new Event('settingsUpdated'),
};

const settings = [
  { name: 'Playback',       id: 'playback', schema: settingsSchema.playback },
  { name: 'List Player',    id: 'list',     schema: settingsSchema.list     },
  { name: 'Gallery Player', id: 'gallery',  schema: settingsSchema.gallery  },
  { name: 'Mobile',         id: 'mobile',   schema: settingsSchema.mobile   },
  { name: 'Site',           id: 'site',     schema: settingsSchema.site     },
];

const errorTemplate = `<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear"><b>Clear All Settings</b></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;


// ************************************************************************************************
// Document loaded init + settings read error handling
// ************************************************************************************************

document.addEventListener('DOMContentLoaded', () =>
{ 
  debug.log('DOMContentLoaded');

  m.container = document.getElementById(config.containerId);

  if (m.container !== null)
  {
    // For quick access to the Clear All Settings page...
    if (document.URL.includes('?clear=true'))
    {
      readSettingsError();
      return;
    }

    readSettings(false);

    if (m.settings !== null)
    {
      settings.forEach(entry => setCurrentSettings(m.settings[entry.id], entry.schema));

      insertSettingsHtml();
      m.container.style.opacity = 1;
  
      addListener(`#${config.saveResetId} .settings-save`,  'click', settingsSaveClick);
      addListener(`#${config.saveResetId} .settings-reset`, 'click', settingsResetClick);
    }
    else
    {
      readSettingsError();
    }
  }
  else
  {
    debug.error(`Unable to getElementById() for '#${config.containerId}'`);
  }
});

function readSettingsError()
{
  document.getElementById(config.saveResetId).style.display = 'none';

  m.container.insertAdjacentHTML('afterbegin', errorTemplate);
  m.container.style.minHeight = '100%';
  m.container.style.opacity = 1;

  addListener(`#${config.containerId} .settings-clear`, 'click', () =>
  {
    localStorage.removeItem(KEY.UF_SETTINGS);
    localStorage.removeItem(KEY.UF_SITE_THEME);
    localStorage.removeItem(KEY.UF_GALLERY_LAYOUT);
    deleteCookie(KEY.UF_GALLERY_PER_PAGE);
    deleteCookie(KEY.UF_PREFERRED_PLAYER);

    readSettings(true);

    if (m.settings !== null)
      showSnackbar('All settings have been cleared', 5, 'Reload', () => (window.location.href = '/settings/'), () => (window.location.href = '/settings/'));
    else
      showSnackbar('Sorry, unable to clear all settings', 5);
  });
}


// ************************************************************************************************
// Read and write settings JSON data
// ************************************************************************************************

function readSettings(setDefault = false)
{
  m.settings = readJson(KEY.UF_SETTINGS, setDefault ? defaultSettings : null, setDefault);
}

function writeSettings()
{
  writeJson(KEY.UF_SETTINGS, m.settings);
  document.dispatchEvent(config.updatedEvent);
}


// ************************************************************************************************
// Set current (read) and default settings values
// ************************************************************************************************

function setCurrentSettings(settings, schema)
{
  Object.entries(settings).forEach(([key, settingValue]) =>
  {
    if (key in schema)
    {
      schema[key].current = getValueStringsIndex(schema[key], settingValue);

      if (schema[key].current === -1)
        schema[key].current = getValueStringsIndex(schema[key], schema[key].default);
    }
  });
}

function setDefaultSettings(settings, schema)
{
  Object.keys(settings).forEach(key =>
  {
    if (key in schema)
    {
      settings[key]       = schema[key].default;
      schema[key].current = getValueStringsIndex(schema[key], schema[key].default);
    }
  });
}

function getValueStringsIndex(schemaEntry, findValue)
{
  return schemaEntry.values.findIndex(value => (value === findValue));
}


// ************************************************************************************************
// Create HTML table content for settings
// ************************************************************************************************

function insertSettingsHtml()
{
  let html = `\n<h3>${settings[0].name}</h3>\n<table id="${settings[0].id}-settings" class="settings">\n<tbody>`;
  Object.entries(settings[0].schema).forEach(row => (html += addTableRow(settings[0].id, row)));

  settings.slice(1).forEach(entry =>
  {
    html += `\n</tbody>\n</table>\n<h3>${entry.name}</h3>\n<table id="${entry.id}-settings" class="settings">\n<tbody>`;
    Object.entries(entry.schema).forEach(row => (html += addTableRow(entry.id, row)));
  });

  m.container.insertAdjacentHTML('afterbegin', html + '\n</tbody>\n</table>\n');
  m.container.addEventListener('click', (event) => settingClicked(event));
}

function addTableRow(idPrefix, entry)
{
  const defaultValueString = entry[1].valueStrings[getValueStringsIndex(entry[1], entry[1].default)];

  const html =
    `\n<tr id="${idPrefix}:${entry[0]}" class="settings-entry" title="Default: ${defaultValueString}">
      <td class="description">${entry[1].description}</td>
      <td class="${getTypeValueClasses(entry[1])}">${entry[1].valueStrings[entry[1].current]}</td>
    </tr>`;

  return html;
}

function getTypeValueClasses(entry)
{
  switch (entry.type)
  {
    case TYPE_INTEGER: return 'value-string type-integer';
    case TYPE_STRING:  return 'value-string type-string';
  
    case TYPE_BOOLEAN:
      {
        const currentValue = (entry.values[entry.current] === true) ? 'true' : 'false';
        return `value-string type-boolean current-value-${currentValue}`;
      }
  }
}


// ************************************************************************************************
// Update row data and DOM
// ************************************************************************************************

function updateRowData(element, settings, schema)
{
  const settingsKey   = element.id.split(':')[1];
  const schemaEntry   = schema[settingsKey];
  schemaEntry.current = ((schemaEntry.current + 1) < schemaEntry.values.length)
                          ? schemaEntry.current + 1
                          : schemaEntry.current = 0;
  settings[settingsKey] = schemaEntry.values[schemaEntry.current];

  updateRowDOM(element.querySelector('.value-string'), schemaEntry);
}

function updateRowDOM(element, schemaEntry)
{
  element.classList   = getTypeValueClasses(schemaEntry);
  element.textContent = schemaEntry.valueStrings[schemaEntry.current];
}

function updateSettingsDOM(settings, schema, idPrefix)
{
  Object.keys(settings).forEach(key =>
  {
    if (key in schema)
      updateRowDOM(document.getElementById(`${idPrefix}:${key}`).querySelector('.value-string'), schema[key]);
  });
}


// ************************************************************************************************
// Update data and DOM on UI-events (click)
// ************************************************************************************************

function settingClicked(event)
{
  const clickedSetting = event.target.closest('tr');

  if (clickedSetting !== null)
  {
    const settingsId = clickedSetting.id.split(':')[0];
    const index      = settings.findIndex(entry => (entry.id === settingsId));
    updateRowData(clickedSetting, m.settings[settings[index].id], settings[index].schema);
  }
}

function settingsSaveClick()
{
  writeSettings();
  showSnackbar('All settings saved', 3);
}

function settingsResetClick()
{
  settings.forEach(entry =>
  {
    setDefaultSettings(m.settings[entry.id], entry.schema);
    updateSettingsDOM(m.settings[entry.id], entry.schema, entry.id);
  });

  showSnackbar('All settings reset', 4, 'Undo', () => location.reload(), () => writeSettings());
}
