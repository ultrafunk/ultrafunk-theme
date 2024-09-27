//
// Snackbar UI module
//
// https://ultrafunk.com
//


import { newDebugLogger }      from './debuglogger.js';
import { showModal }           from './modal.js';
import { settings }            from './session-data.js';
import { KEY }                 from './storage.js';
import { MATCH, matchesMedia } from './utils.js';


/*************************************************************************************************/


const debug = newDebugLogger('snackbar');

const m = {
  snackbarId:    0,
  actionClick:   null,
  afterClose:    null,
  showTimeoutId: -1,
  messageLog:    [],
};

const template = /*html*/ `
  <div id="snackbar">
    <div class="snackbar-container">
      <div class="snackbar-message"></div>
      <button type="button" class="snackbar-action-text"></button>
      <button type="button" class="snackbar-close-icon"><span class="material-icons" title="Dismiss">close</span></button>
    </div>
  </div>
`;

const elements = {
  snackbar:   null,
  actionText: null,
  closeIcon:  null,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function showSnackbar({
  message = 'Snackbar Message',
  duration = 5,
  actionText = null,
  actionClickCallback = () => {},
  afterCloseCallback  = () => {},
  backgroundColorCssVal = 'var(--snackbar-background-color)',
} = {})
{
  debug.log(`showSnackbar(): ${message} (${(duration !== 0) ? `Duration: ${duration} sec.` : 'Duration: infinite'})`);

  initElements();
  resetState(false);

  if (settings.site.snackbarMessageLog)
    writeLog(message);

  elements.snackbar.querySelector('.snackbar-message').innerHTML = message;
  elements.snackbar.querySelector('.snackbar-container').style = `background-color: ${backgroundColorCssVal};`;
  elements.snackbar.classList.add('show');
  elements.actionText.style.display = 'none';
  m.afterClose = afterCloseCallback;

  if (actionText !== null)
  {
    m.actionClick = actionClickCallback;
    elements.actionText.style.display = 'block';
    elements.actionText.textContent   = actionText;
    elements.actionText.addEventListener('click', actionTextClick);
  }
  else
  {
    // Fix edge case when actionText is hidden...
    if (matchesMedia(MATCH.SITE_MAX_WIDTH_MOBILE))
      elements.closeIcon.style.paddingLeft = '10px';
    else
      elements.closeIcon.style.paddingLeft = '20px';
  }

  if (duration !== 0)
    m.showTimeoutId = setTimeout(() => elements.snackbar.classList.add('hide'), (duration * 1000));

  return ++m.snackbarId;
}

export function isShowingSnackbar()
{
  return ((elements.snackbar !== null)               &&
          (elements.snackbar.classList.length === 1) &&
           elements.snackbar.classList.contains('show'));
}

export function dismissSnackbar(dismissId = 0)
{
  if (isShowingSnackbar())
  {
    if ((m.snackbarId === 0) || (m.snackbarId === dismissId))
      elements.snackbar.classList.add('hide');
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

function initElements()
{
  if (elements.snackbar === null)
  {
    document.body.insertAdjacentHTML('beforeend', template);

    elements.snackbar   = document.getElementById('snackbar');
    elements.actionText = elements.snackbar.querySelector('.snackbar-action-text');
    elements.closeIcon  = elements.snackbar.querySelector('.snackbar-close-icon');

    elements.snackbar.addEventListener('animationend', () =>
    {
      if (elements.snackbar.classList.contains('hide'))
      {
        resetState(true);
        m.afterClose();
      }
    });

    elements.closeIcon.addEventListener('click', () =>
    {
      resetState(true);
      m.afterClose();
    });
  }
}

function actionTextClick()
{
  resetState(true);
  m.actionClick();
}

function resetState(hideSnackbar = false)
{
  if (m.showTimeoutId !== -1)
  {
    clearTimeout(m.showTimeoutId);
    m.showTimeoutId = -1;
  }

  if (elements.actionText !== null)
    elements.actionText.removeEventListener('click', actionTextClick);

  if (hideSnackbar)
    elements.snackbar.className = '';
}


// ************************************************************************************************
//
// ************************************************************************************************

function writeLog(message)
{
  readLog();

  if (m.messageLog.length >= 15)
    m.messageLog.shift();

  m.messageLog.push({ timestamp: Date.now(), message: message });

  localStorage.setItem(KEY.UF_MESSAGE_LOGS, JSON.stringify({ snackbarLog: m.messageLog }));
}

function readLog()
{
  if (m.messageLog.length === 0)
  {
    const messageLogs = JSON.parse(localStorage.getItem(KEY.UF_MESSAGE_LOGS));

    if ((messageLogs !== null) && (messageLogs.snackbarLog !== undefined))
      m.messageLog = messageLogs.snackbarLog;
  }
}

const logTableHeaderHtml = /*html*/
  `<table>
    <tr>
      <td><b>Date</b></td>
      <td class="spacer"></td>
      <td><b>Time</b></td>
      <td class="spacer"></td>
      <td><b>Message</b></td>
    </tr>`;

export function showSnackbarLog()
{
  readLog();

  if (m.messageLog.length > 0)
  {
    const matchesMobile = matchesMedia(MATCH.SITE_MAX_WIDTH_MOBILE);
    let htmlTable = logTableHeaderHtml;

    m.messageLog.forEach((entry) =>
    {
      const dateString = matchesMobile
        ? new Date(entry.timestamp).toDateString().slice(4, 10)
        : new Date(entry.timestamp).toDateString().slice(0, 10);

      const tiemString = matchesMobile
        ? new Date(entry.timestamp).toTimeString().slice(0, 5)
        : new Date(entry.timestamp).toTimeString().slice(0, 8);

      htmlTable += /*html*/
        `<tr>
          <td class="normal-text nowrap">${dateString}</td>
          <td class="spacer"></td>
          <td class="normal-text nowrap">${tiemString}</td>
          <td class="spacer"></td>
          <td>${entry.message}</td>
        </tr>`;
    });

    showModal({ modalTitle: 'Snackbar Message Log', modalBody: htmlTable + '</table>' });
  }
  else
  {
    showModal({ modalTitle: 'Snackbar Message Log', modalBody: '<p>The snackbar message log is currently empty...</p>' });
  }
}
