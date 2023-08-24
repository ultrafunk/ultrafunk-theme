//
// Clipboard handling module
//
// https://ultrafunk.com
//


import { newDebugLogger } from './debuglogger.js';
import { showModal }      from './modal.js';
import { showSnackbar }   from './snackbar.js';


/*************************************************************************************************/


const debug = newDebugLogger('clipboard');


// ************************************************************************************************
// Exports
// ************************************************************************************************

export function copyTextToClipboard(clipboardText, contentDescription = 'Content')
{
  if (navigator.clipboard && hasClipboardWritePermission())
  {
    navigator.clipboard.writeText(clipboardText).then(() =>
    {
      debug.log(`copyTextToClipboard() success for: ${clipboardText} - type: ${contentDescription}`);
      showSnackbar(`${contentDescription} copied to clipboard`, 3);
    },
    (reason) =>
    {
      onClipboardWriteError(reason, clipboardText, contentDescription);
    });
  }
  else
  {
    // Handle navigator.clipboard not properly supported on WebKit / Safari yet...
    if (copyTextToClipboardExecCommand(clipboardText))
    {
      debug.log(`copyTextToClipboardExecCommand() success for: ${clipboardText} - type: ${contentDescription}`);
      showSnackbar(`${contentDescription} copied to clipboard`, 3);
    }
    else
    {
      onClipboardWriteError(`document.execCommand('copy') for "${clipboardText}" failed!`, clipboardText, contentDescription);
    }
  }
}


// ************************************************************************************************
// Internals
// ************************************************************************************************

function hasClipboardWritePermission()
{
  try
  {
    if (navigator.permissions.query)
      return true;
  }
  catch(exception)
  {
    debug.log(`hasClipboardWritePermission(): ${exception}`);
  }

  return false;
}

function copyTextToClipboardExecCommand(clipboardText)
{
  const element = document.createElement('textarea');

  document.body.appendChild(element);
  element.textContent = clipboardText;
  element.select();
  const isCopied = document.execCommand('copy');
  document.body.removeChild(element);

  return isCopied;
}

function onClipboardWriteError(logError, clipboardText, contentDescription)
{
  debug.error(`copyTextToClipboard() error: ${logError}`);

  const modalBodyHtml = /*html*/ `
    <style>
      .modal-dialog-body p.modal-clipboard-content {
        padding: 10px 15px;
        border-radius: var(--dialog-border-radius);
        background-color: var(--list-row-odd-color);
      }
    </style>
    <p class="modal-clipboard-error">Failed to write ${contentDescription} to the clipboard, please copy the text below:</p>
    <p class="modal-clipboard-content">${clipboardText}</p>`;

  showModal({ modalTitle: 'Copy to Clipboard error!', modalBody: modalBodyHtml });
}

/*

//const canWriteToClipboard = await hasClipboardWritePermission();

async function hasClipboardWritePermission()
{
  try
  {
    return navigator.permissions.query({ name: 'clipboard-write' })
    .then(async (result) =>
    {
      return (result.state === 'granted');
    })
    .catch((exception) =>
    {
      debug.log(`hasClipboardWritePermission(): ${exception}`);
      return false;
    });
  }
  catch(exception)
  {
    debug.log(`hasClipboardWritePermission(): ${exception}`);
  }

  return false;
}
*/
