//
// List-player playback timer module
//
// https://ultrafunk.com
//


import * as playbackControls from '../playback-controls.js';
import * as playbackEvents   from '../playback-events.js';
import { settings }          from '../../shared/session-data.js';


export { playbackTimer };


/*************************************************************************************************/


const config = { updateTimerInterval: 250 }; // Milliseconds between each timer event


// ************************************************************************************************
// Playback timer and event handling module
// ************************************************************************************************

const playbackTimer = (() =>
{
  let intervalId     = -1;
  let lastPosSeconds = 0;
  let isVisible      = true;
  let player         = null;

  return {
    ready,
    start,
    stop,
    update,
  };

  function ready(listPlayer)
  {
    player = listPlayer;
    
    playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PLAYING, () => start());
    document.addEventListener('visibilitychange', () => { isVisible = (document.visibilityState === 'visible') ? true : false; });
  }
  
  function start()
  {
    stop();

    intervalId = setInterval(() =>
    {
      if (isVisible && playbackControls.isPlaying())
        update(player.embedded.getCurrentTime(), player.getDuration());
    },
    config.updateTimerInterval);
  }
  
  function stop(resetState = false)
  {
    if (intervalId !== -1)
    {
      clearInterval(intervalId);
      intervalId = -1;
    }

    if (resetState)
      update(0, 0);

    lastPosSeconds = 0;
    playbackControls.blinkPlayPause(false);
  }
  
  function update(positionSecondsDecimal, durationSeconds)
  {
    if (positionSecondsDecimal !== undefined)
    {
      const positionSeconds = Math.round(positionSecondsDecimal);

      playbackControls.updateTimerAndProgress((positionSecondsDecimal * 1000), positionSeconds, durationSeconds);

      if ((positionSeconds > 0) && (durationSeconds > 0))
        updateTimeRemainingWarning(positionSeconds, durationSeconds);
    }
  }

  function updateTimeRemainingWarning(positionSeconds, durationSeconds)
  {
    if ((settings.playback.autoplay === false)  &&
         settings.playback.timeRemainingWarning &&
        (lastPosSeconds !== positionSeconds))
    {
      lastPosSeconds = positionSeconds;

      if ((durationSeconds - positionSeconds) <= settings.playback.timeRemainingSeconds)
        playbackControls.blinkPlayPause(true);
      else
        playbackControls.blinkPlayPause(false);
    }
  }
})();
