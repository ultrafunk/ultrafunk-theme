//
// Snackbar UI module
//
// https://ultrafunk.com
//


import * as debugLogger        from './debuglogger.js';
import { MATCH, matchesMedia } from './utils.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('snackbar');

const m = {
  snackbarId:    0,
  actionClick:   null,
  afterClose:    null,
  showTimeoutId: -1,
};

const config = { id: 'snackbar' };

const template = /*html*/ `
  <div id="${config.id}">
    <div class="${config.id}-container">
      <div class="${config.id}-message"></div>
      <div class="${config.id}-action-text"></div>
      <div class="${config.id}-close-icon"><span class="material-icons" title="Dismiss">close</span></div>
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

export function showSnackbar(
  message,
  timeout = 5,
  actionText = null,
  actionClickCallback = null,
  afterCloseCallback = null,
  backgroundColor = 'var(--snackbar-background-color)',
)
{
  debug.log(`showSnackbar(): ${message} (${timeout} sec.)`);

  initElements();
  resetState(false);

  elements.snackbar.querySelector(`.${config.id}-message`).innerHTML = message;
  elements.snackbar.querySelector(`.${config.id}-container`).style = `background-color: ${backgroundColor};`;
  elements.snackbar.classList.add('show');
  elements.actionText.style.display = 'none';
  m.afterClose = (afterCloseCallback !== null) ? afterCloseCallback : () => {};

  if ((actionText !== null) && (actionClickCallback !== null))
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

  if (timeout !== 0)
    m.showTimeoutId = setTimeout(() => elements.snackbar.classList.add('hide'), (timeout * 1000));

  return ++m.snackbarId;
}

export function dismissSnackbar(dismissId = 0)
{
  if (isShowing())
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

    elements.snackbar   = document.getElementById(config.id);
    elements.actionText = elements.snackbar.querySelector(`.${config.id}-action-text`);
    elements.closeIcon  = elements.snackbar.querySelector(`.${config.id}-close-icon`);

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

function isShowing()
{
  return ((elements.snackbar !== null)               &&
          (elements.snackbar.classList.length === 1) &&
           elements.snackbar.classList.contains('show'));
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
