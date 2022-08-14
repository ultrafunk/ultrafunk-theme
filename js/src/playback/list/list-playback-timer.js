//
// List playback timer child class
//
// https://ultrafunk.com
//


import PlaybackTimer          from '../playback-timer.js';
import { EVENT, addListener } from '../playback-events.js';

import {
  isPlaying,
  updateTimerAndProgress
} from '../playback-controls.js';


/*************************************************************************************************/


class ListPlaybackTimer extends PlaybackTimer
{
  #player = null;

  #update(positionSecondsDecimal, durationSeconds)
  {
    if (positionSecondsDecimal !== undefined)
    {
      const positionSeconds = Math.round(positionSecondsDecimal);

      updateTimerAndProgress((positionSecondsDecimal * 1000), positionSeconds, durationSeconds);

      if ((positionSeconds > 0) && (durationSeconds > 0))
        super.updateTimeRemainingWarning(positionSeconds, durationSeconds);
    }
  }

  ready(player)
  {
    super.init();
    this.#player = player;
    addListener(EVENT.MEDIA_PLAYING, () => super.start());
  }

  updateProxy()
  {
    if (this.isVisible && isPlaying())
      this.#update(this.#player.embedded.getCurrentTime(), this.#player.getDuration());
  }
}

export const playbackTimer = new ListPlaybackTimer();
