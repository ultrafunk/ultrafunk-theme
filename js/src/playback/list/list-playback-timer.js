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
  constructor()
  {
    super();
    this.player = null;
  }

  ready(player)
  {
    super.init();
    this.player = player;
    addListener(EVENT.MEDIA_PLAYING, () => super.start());
  }

  updateProxy()
  {
    if (isPlaying())
      this.update(this.player.embedded.getCurrentTime(), this.player.getDuration());
  }

  update(positionSecondsDecimal, durationSeconds)
  {
    if (positionSecondsDecimal !== undefined)
    {
      const positionSeconds = Math.round(positionSecondsDecimal);

      updateTimerAndProgress((positionSecondsDecimal * 1000), positionSeconds, durationSeconds);

      if ((positionSeconds > 0) && (durationSeconds > 0))
        super.updateTimeRemainingWarning(positionSeconds, durationSeconds);
    }
  }
}

export const playbackTimer = new ListPlaybackTimer();
