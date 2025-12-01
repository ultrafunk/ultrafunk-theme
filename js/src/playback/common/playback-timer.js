//
// PlaybackTimer abstract base class
//
// https://ultrafunk.com
//


import { settings } from '../../shared/session-data.js';
import { timeRemainingWarningBlink } from './playback-controls.js';

import {
  EVENT,
  dispatch,
  addListener,
} from './playback-events.js';


/*************************************************************************************************/


export class PlaybackTimer
{
  #intervalId     = -1;
  #lastPosSeconds = 0;
  playedSeconds   = 0;
  isVisible       = true;

  config = {
    updateTimerInterval: 250, // Milliseconds between each timer event
    maxBufferingDelay:   3,   // VERY rough estimate of "max" network buffering delay in seconds
    minPlayedSeconds:    3,   //
  };

  init()
  {
    document.addEventListener('visibilitychange', () =>
    {
      this.isVisible = (document.visibilityState === 'visible');
    });

    addListener(EVENT.MEDIA_PLAYING,     () => this.start());
    addListener(EVENT.MEDIA_PAUSED,      () => this.stop());
    addListener(EVENT.MEDIA_ENDED,       () => this.stop());
    addListener(EVENT.MEDIA_CUE_TRACK,   () => this.stop());
    addListener(EVENT.MEDIA_UNAVAILABLE, () => this.stop());
    addListener(EVENT.AUTOPLAY_BLOCKED,  () => this.stop());
  }

  // Methods to implement in child classes
  updateTimer() {}
  updateVolumeMute() {}

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
    this.playedSeconds   = 0;

    timeRemainingWarningBlink(false);
  }

  updateOncePerSecond(positionSeconds, durationSeconds)
  {
    if (this.#lastPosSeconds !== positionSeconds)
    {
      this.#lastPosSeconds = positionSeconds;
      this.playedSeconds++;
      this.updateVolumeMute();

      if ((settings.playback.autoplay === false) && settings.playback.timeRemainingWarning)
      {
        const remainingSeconds = durationSeconds - positionSeconds;

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
}
