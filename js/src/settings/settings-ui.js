//
// View / change settings UI
//
// https://ultrafunk.com
//


import { newDebugLogger } from '../shared/debuglogger.js';
import { showModal }      from '../shared/modal.js';

import {
  showSnackbar,
  showSnackbarLog,
} from '../shared/snackbar.js';

import {
  addListener,
  isPointerTypeTouch,
} from '../shared/utils.js';

import {
  settings as storedSettings
} from '../shared/session-data.js';

import {
  KEY,
  YEAR_IN_SECONDS,
  setCookie,
  deleteCookie,
  readJson,
  writeJson,
  cleanupOldData,
} from '../shared/storage.js';

import {
  TYPE_INTEGER,
  TYPE_BOOLEAN,
  TYPE_STRING,
  settingsSchema,
  defaultSettings,
  settingsDescriptions,
} from './settings.js';


/*************************************************************************************************/


const debug = newDebugLogger('settings-ui');

const m = {
  settings:     null,
  container:    null,
  updatedEvent: new Event('settingsUpdated'),
};

const config = {
  containerId:  'settings-container',
  saveResetId:  'settings-save-reset',
};

const settingsSections = [
  { name: 'Playback',       id: 'playback',     schema: settingsSchema.playback     },
  { name: 'List Player',    id: 'list',         schema: settingsSchema.list         },
  { name: 'Gallery Player', id: 'gallery',      schema: settingsSchema.gallery      },
  { name: 'Mobile',         id: 'mobile',       schema: settingsSchema.mobile       },
  { name: 'Site',           id: 'site',         schema: settingsSchema.site         },
  { name: 'Experimental',   id: 'experimental', schema: settingsSchema.experimental },
];


// ************************************************************************************************
// Init + settings read error handling
// ************************************************************************************************

export function initSettingsUi()
{
  debug.log('init()');

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
      settingsSections.forEach(entry => setCurrentSettings(m.settings[entry.id], entry.schema));

      insertSettingsHtml();
      m.container.style.opacity = 1;
      m.container.addEventListener('click',       (event) => settingClicked(event));
      m.container.addEventListener('contextmenu', (event) => settingClicked(event));

      addListener(`#${config.saveResetId} .settings-save-button`,  'click', settingsSaveClick);
      addListener(`#${config.saveResetId} .settings-reset-button`, 'click', settingsResetClick);

      initSaveChangesPrompt();
      initViewSnackbarLog();
    }
    else
    {
      readSettingsError();
    }
  }
}

function initSaveChangesPrompt()
{
  window.addEventListener('beforeunload', (event) =>
  {
    m.container.querySelectorAll('table tr')?.forEach(tableRow =>
    {
      if (tableRow.classList.contains('value-changed'))
      {
        event.preventDefault();
        event.returnValue = true;
      }
    });
  });
}

function initViewSnackbarLog()
{
  if (m.settings.site.snackbarMessageLog)
  {
    const html = ' <span title="Click / tap to view log" class="show-snackbar-log">View Snackbar Message Log</span>.';
    document.querySelector('.entry-content p').insertAdjacentHTML('beforeend', html);
    document.querySelector('.entry-content .show-snackbar-log').addEventListener('click', () => showSnackbarLog());
  }
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

  setCookie(KEY.UF_GALLERY_PER_PAGE, m.settings.gallery.tracksPerPage,    (YEAR_IN_SECONDS * 5));
  setCookie(KEY.UF_LIST_PER_PAGE,    m.settings.list.tracksPerPage,       (YEAR_IN_SECONDS * 5));
  setCookie(KEY.UF_PREFERRED_PLAYER, m.settings.playback.preferredPlayer, (YEAR_IN_SECONDS * 5));

  document.dispatchEvent(m.updatedEvent);
}

const errorTemplate = /*html*/ `<h3>An error occurred while reading Playback and Site settings</h3>
  <p>This can be caused by several issues, but most likely it happened because of corrupt or malformed JSON data in the browsers Local Storage.</p>
  <p>Clearing all settings stored locally in the browser will probably fix the problem, click on the button below to do that.
  <b>Note:</b> All Playback and Site settings will be reset to default values.</p>
  <div class="settings-clear-container"><button type="button" class="settings-clear-button"><b>Clear All Settings</b></button></div>
  <p>If that does not work, another possible fix is to clear all cached data stored in the browser, the following links contain more information about how to do that for
  <a href="https://support.google.com/accounts/answer/32050">Chrome</a> and
  <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox">Firefox</a>.</p>`;

function readSettingsError()
{
  document.getElementById(config.saveResetId).style.display = 'none';

  m.container.insertAdjacentHTML('afterbegin', errorTemplate);
  m.container.style.minHeight = '100%';
  m.container.style.opacity = 1;

  addListener(`#${config.containerId} .settings-clear-button`, 'click', () =>
  {
    localStorage.removeItem(KEY.UF_SETTINGS);
    localStorage.removeItem(KEY.UF_SITE_THEME);
    localStorage.removeItem(KEY.UF_GALLERY_LAYOUT);
    deleteCookie(KEY.UF_GALLERY_PER_PAGE);
    deleteCookie(KEY.UF_LIST_PER_PAGE);
    deleteCookie(KEY.UF_PREFERRED_PLAYER);
    deleteCookie(KEY.UF_SHUFFLE_UID);

    cleanupOldData(true);
    readSettings(true);

    if (m.settings !== null)
    {
      showSnackbar({
        message: 'All settings have been cleared',
        duration: 5,
        actionText: 'Reload',
        actionClickCallback: () => (window.location.href = '/settings/'),
        afterCloseCallback:  () => (window.location.href = '/settings/'),
      });
    }
    else
    {
      showSnackbar({ message: 'Sorry, unable to clear all settings', duration: 5 });
    }
  });
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
  let html = `\n<h3>${settingsSections[0].name}</h3>\n<table id="${settingsSections[0].id}-settings" class="settings">\n<tbody>`;
  Object.entries(settingsSections[0].schema).forEach(row => (html += addTableRow(settingsSections[0].id, row)));

  settingsSections.slice(1).forEach(entry =>
  {
    if (Object.keys(entry.schema).length > 0)
    {
      html += `\n</tbody>\n</table>\n<h3>${entry.name}</h3>\n<table id="${entry.id}-settings" class="settings">\n<tbody>`;
      Object.entries(entry.schema).forEach(row => (html += addTableRow(entry.id, row)));
    }
  });

  m.container.insertAdjacentHTML('afterbegin', html + '\n</tbody>\n</table>\n');
}

function addTableRow(idPrefix, entry)
{
  const defaultValueString = entry[1].valueStrings[getValueStringsIndex(entry[1], entry[1].default)];

  const html = /*html*/
    `\n<tr id="${idPrefix}:${entry[0]}" class="settings-entry" title="Default: ${defaultValueString}">
      <td class="changed-indicator"></td>
      <td class="spacer"></td>
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

function updateRowData(element, settingsSection, settingsKey, schemaEntry)
{
  schemaEntry.current = ((schemaEntry.current + 1) < schemaEntry.values.length)
                          ? schemaEntry.current + 1
                          : schemaEntry.current = 0;
  m.settings[settingsSection][settingsKey] = schemaEntry.values[schemaEntry.current];

  if (m.settings[settingsSection][settingsKey] !== storedSettings[settingsSection][settingsKey])
    element.classList.add('value-changed');
  else
    element.classList.remove('value-changed');

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
    const settingsId   = clickedSetting.id.split(':')[0];
    const settingsKey  = clickedSetting.id.split(':')[1];
    const sectionIndex = settingsSections.findIndex(entry => (entry.id === settingsId));

    if (event.type === 'contextmenu')
    {
      if (isPointerTypeTouch(event))
      {
        event.preventDefault();
        showSettingDetailsModal(settingsId, settingsKey, sectionIndex);
      }
    }
    else
    {
      if (event.shiftKey === true)
        showSettingDetailsModal(settingsId, settingsKey, sectionIndex);
      else
        updateRowData(clickedSetting, settingsSections[sectionIndex].id, settingsKey, settingsSections[sectionIndex].schema[settingsKey]);
    }
  }
}

function showSettingDetailsModal(settingsId, settingsKey, sectionIndex)
{
  const schemaEntry = settingsSections[sectionIndex].schema[settingsKey];
  let description   = schemaEntry.description;
  let valueStrings  = '';

  if ((settingsDescriptions[settingsId] !== undefined) && (settingsDescriptions[settingsId][settingsKey] !== undefined))
    description = `<span class="normal-text">${description}: </span>${settingsDescriptions[settingsId][settingsKey]}`;

  schemaEntry.valueStrings.forEach(entry => (valueStrings += `${entry}, `));

  showModal({
    modalTitle: `${settingsSections[sectionIndex].name} setting details`,
    modalBody:  `<p><b>Description</b><br>${description}</p>
                 <p><b>Values</b><br>${valueStrings.slice(0, (valueStrings.length - 2))}</p>
                 <p><b>Current Value</b><br>${schemaEntry.valueStrings[schemaEntry.current]}</p>
                 <p><b>Default Value</b><br>${schemaEntry.valueStrings[getValueStringsIndex(schemaEntry, schemaEntry.default)]}</p>`,
  });
}

function clearValueChanged()
{
  m.container.querySelectorAll('table  tr')?.forEach((tableRow) => tableRow.classList.remove('value-changed'));
}

function settingsSaveClick()
{
  writeSettings();
  clearValueChanged();
  showSnackbar({ message: 'All settings saved', duration: 3 });
}

function settingsResetClick()
{
  settingsSections.forEach(entry =>
  {
    setDefaultSettings(m.settings[entry.id], entry.schema);
    updateSettingsDOM(m.settings[entry.id], entry.schema, entry.id);
  });

  clearValueChanged();

  showSnackbar({
    message: 'All settings reset',
    duration: 4,
    actionText: 'Undo',
    actionClickCallback: () => location.reload(),
    afterCloseCallback:  () => writeSettings(),
  });
}
