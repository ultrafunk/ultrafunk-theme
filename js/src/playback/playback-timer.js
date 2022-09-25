//
// PlaybackTimer base class
//
// https://ultrafunk.com
//


import { settings } from '../shared/session-data.js';
import { EVENT, dispatch } from './playback-events.js';
import { timeRemainingWarningBlink } from './playback-controls.js';


/*************************************************************************************************/


export class PlaybackTimer
{
  #intervalId     = -1;
  #lastPosSeconds = 0;
  isVisible       = true;

  config = {
    updateTimerInterval: 250, // Milliseconds between each timer event
    maxBufferingDelay:   3,   // VERY rough estimate of "max" network buffering delay in seconds
  };

  init()
  {
    document.addEventListener('visibilitychange', () =>
    {
      this.isVisible = (document.visibilityState === 'visible') ? true : false;
    });
  }

  // Abstract method that must be overriden in child class
  updateTimer() {}

  start()
  {
    this.stop();
    this.#intervalId = setInterval(() => this.updateTimer(), this.config.updateTimerInterval);
  }

  stop()
  {
    if (this.#intervalId !== -1)
    {
      clearInterval(this.#intervalId);
      this.#intervalId = -1;
    }

    this.#lastPosSeconds = 0;
    timeRemainingWarningBlink(false);
  }

  updateTimeRemainingWarning(positionSeconds, durationSeconds)
  {
    if ((settings.playback.autoplay === false)  &&
         settings.playback.timeRemainingWarning &&
        (this.#lastPosSeconds !== positionSeconds))
    {
      const remainingSeconds = durationSeconds - positionSeconds;
      this.#lastPosSeconds   = positionSeconds;

      if (remainingSeconds <= settings.playback.timeRemainingSeconds)
      {
        timeRemainingWarningBlink(true);
        dispatch(EVENT.MEDIA_TIME_REMAINING, { timeRemainingSeconds: remainingSeconds });
      }
      else
      {
        timeRemainingWarningBlink(false);
      }
    }
  }
}
