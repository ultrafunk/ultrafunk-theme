//
// List playback timer child class
//
// https://ultrafunk.com
//


import { PlaybackTimer }            from '../common/playback-timer.js';
import { EVENT, addListener }       from '../common/playback-events.js';
import { updateVolumeMuteSettings } from '../common/shared-gallery-list.js';

import {
  isPlaying,
  updateTimerAndProgress
} from '../common/playback-controls.js';


/*************************************************************************************************/


class ListPlaybackTimer extends PlaybackTimer
{
  #players = null;

  #updateCallback(positionSecondsDecimal, durationSeconds)
  {
    if (positionSecondsDecimal !== undefined)
    {
      const positionSeconds = Math.round(positionSecondsDecimal);

      updateTimerAndProgress((positionSecondsDecimal * 1000), positionSeconds, durationSeconds);

      if ((positionSeconds > 0) && (durationSeconds > 0))
        super.updateOncePerSecond(positionSeconds, durationSeconds);
    }
  }

  ready(players)
  {
    super.init();
    this.#players = players;
    addListener(EVENT.MEDIA_PLAYING, () => super.start());
  }

  updateTimer()
  {
    if (this.isVisible && isPlaying())
      this.#players.current.getPosition((position, duration) => this.#updateCallback(position, duration));
  }

  updateVolumeMute()
  {
    if (isPlaying())
      this.#players.current.getVolume((volume) => updateVolumeMuteSettings(volume, this.#players.current.isMuted()));
  }
}

export const playbackTimer = new ListPlaybackTimer();
