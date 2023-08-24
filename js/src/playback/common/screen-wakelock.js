//
// Experimental Screen Wake Lock API support: https://web.dev/wakelock/
//
// https://ultrafunk.com
//


import { newDebugLogger } from '../../shared/debuglogger.js';
import { showSnackbar }   from '../../shared/snackbar.js';
import { settings }       from '../../shared/session-data.js';


/*************************************************************************************************/


const debug = newDebugLogger('screen-wakelock');
const m     = { wakeLock: null };


// ************************************************************************************************
//
// ************************************************************************************************

export function initScreenWakeLock()
{
  if (settings.mobile.keepScreenOn)
    document.addEventListener('click', enableScreenWakeLock);
}

function enableScreenWakeLock()
{
  debug.log('enableScreenWakeLock()');

  document.removeEventListener('click', enableScreenWakeLock);

  enableWakeLock();

  document.addEventListener('visibilitychange', () =>
  {
    if ((document.visibilityState === 'visible') && (settings.mobile.keepScreenOn))
      setStateVisible();
  });
}

function setStateVisible()
{
  if (isSupported() && (m.wakeLock === null))
    requestWakeLock();
}


/*************************************************************************************************/


function isSupported()
{
  return (('wakeLock' in navigator) && ('request' in navigator.wakeLock));
}

async function enableWakeLock()
{
  if (isSupported())
  {
    if (document.visibilityState === 'visible')
    {
      if (await requestWakeLock() !== true)
      {
        debug.log('enableWakeLock(): Screen Wake Lock request failed');
        showSnackbar('Keep Screen On failed', 5, 'Disable', () => (settings.mobile.keepScreenOn = false));
      }
    }
  }
  else
  {
    debug.log('enableWakeLock(): Screen Wake Lock is not supported');
    showSnackbar('Keep Screen On is not supported', 5, 'Disable', () => (settings.mobile.keepScreenOn = false));
  }
}

async function requestWakeLock()
{
  try
  {
    m.wakeLock = await navigator.wakeLock.request('screen');
  //debug.log('requestWakeLock(): Screen Wake Lock is Enabled');

    m.wakeLock.addEventListener('release', () =>
    {
    //debug.log('requestWakeLock(): Screen Wake Lock was Released');
      m.wakeLock = null;
    });

    return true;
  }
  catch (exception)
  {
    debug.error(`requestWakeLock(): ${exception.name} - ${exception.message}`);
  }

  return false;
}
