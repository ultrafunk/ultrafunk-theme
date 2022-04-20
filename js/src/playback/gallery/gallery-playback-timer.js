//
// Gallery player playback timer module
//
// https://ultrafunk.com
//


import * as playbackControls from '../playback-controls.js';
import * as playbackEvents   from '../playback-events.js';
import { CROSSFADE_TYPE }    from './crossfade.js';
import { settings }          from '../../shared/session-data.js';


/*************************************************************************************************/


const config = {
  updateTimerInterval: 250, // Milliseconds between each timer event
  maxBufferingDelay:   3,   // VERY rough estimate of "max" network buffering delay in seconds
};


// ************************************************************************************************
// Playback timer and event handling module
// ************************************************************************************************

export const playbackTimer = (() =>
{
  let intervalId     = -1;
  let lastPosSeconds = 0;
  let isVisible      = true;
  let players        = null;
  let crossfadeInit  = null;

  return {
    init,
    start,
    stop,
    updateCallback,
  };

  function init(galleryPlayers, galleryCrossfadeInit)
  {
    players       = galleryPlayers;
    crossfadeInit = galleryCrossfadeInit;

    document.addEventListener('visibilitychange', () => { isVisible = (document.visibilityState === 'visible') ? true : false; });
  }
  
  function start()
  {
    stop(false);
    
    intervalId = setInterval(() =>
    {
      if (isVisible)
        players.current.getPosition(updateCallback);
    },
    config.updateTimerInterval);
  }
  
  function stop()
  {
    if (intervalId !== -1)
    {
      clearInterval(intervalId);
      intervalId = -1;
    }
    
    lastPosSeconds = 0;
    playbackControls.blinkPlayPause(false);
  }
  
  function updateCallback(positionMilliseconds, durationSeconds = 0)
  {
    const positionSeconds = Math.round(positionMilliseconds / 1000);

    playbackControls.updateTimerAndProgress(positionMilliseconds, positionSeconds, durationSeconds);

    if ((positionSeconds > 0) && (durationSeconds > 0))
    {
      updateTimeRemainingWarning(positionSeconds, durationSeconds);
      updateAutoCrossfade(positionSeconds, durationSeconds);
    }
  }
  
  function updateTimeRemainingWarning(positionSeconds, durationSeconds)
  {
    if ((settings.playback.autoplay === false)  &&
         settings.playback.timeRemainingWarning &&
        (lastPosSeconds !== positionSeconds))
    {
      const remainingSeconds = durationSeconds - positionSeconds;
      lastPosSeconds         = positionSeconds;

      if (remainingSeconds <= settings.playback.timeRemainingSeconds)
      {
        playbackControls.blinkPlayPause(true);
        playbackEvents.dispatch(playbackEvents.EVENT.MEDIA_TIME_REMAINING, { timeRemainingSeconds: remainingSeconds });
      }
      else
      {
        playbackControls.blinkPlayPause(false);
      }
    }
  }

  function updateAutoCrossfade(positionSeconds, durationSeconds)
  {
    if ((settings.playback.masterMute === false) && settings.playback.autoplay && settings.gallery.autoCrossfade)
    {
      if ((durationSeconds - positionSeconds) === (settings.gallery.autoCrossfadeLength + config.maxBufferingDelay))
      {
        if ((players.getCurrentTrack() + 1) <= players.getNumTracks())
          crossfadeInit(CROSSFADE_TYPE.AUTO, { name: 'Auto Crossfade', length: settings.gallery.autoCrossfadeLength, curve: settings.gallery.autoCrossfadeCurve});
      }
    }
  }
})();
