//
// Gallery playback timer child class
//
// https://ultrafunk.com
//


import { settings }       from '../../shared/session-data.js';
import { PlaybackTimer }  from '../common/playback-timer.js';
import { CROSSFADE_TYPE } from './crossfade.js';
import { updateVolumeMuteSettings } from '../common/shared-gallery-list.js';

import {
  isPlaying,
  updateTimerAndProgress,
} from '../common/playback-controls.js';


/*************************************************************************************************/


class GalleryPlaybackTimer extends PlaybackTimer
{
  #players       = null;
  #crossfadeInit = null;

  #updateCallback(positionMilliseconds, durationSeconds = 0)
  {
    const positionSeconds = Math.round(positionMilliseconds / 1000);

    updateTimerAndProgress(positionMilliseconds, positionSeconds, durationSeconds);

    if ((positionSeconds > 0) && (durationSeconds > 0))
    {
      super.updateOncePerSecond(positionSeconds, durationSeconds);
      this.#updateAutoCrossfade(positionSeconds, durationSeconds);
    }
  }

  #isAutoCrossfade()
  {
    return (settings.playback.autoplay && settings.gallery.autoCrossfade);
  }

  #updateAutoCrossfade(positionSeconds, durationSeconds)
  {
    if ((settings.playback.masterMute === false) && this.#isAutoCrossfade())
    {
      if ((durationSeconds - positionSeconds) === (settings.gallery.autoCrossfadeLength + this.config.maxBufferingDelay))
      {
        if ((this.#players.getCurrentTrackNum() + 1) <= this.#players.getNumTracks())
        {
          this.#crossfadeInit(CROSSFADE_TYPE.AUTO,
          {
            name:   'Auto Crossfade',
            length: settings.gallery.autoCrossfadeLength,
            curve:  settings.gallery.autoCrossfadeCurve
          });
        }
      }
    }
  }

  init(players, crossfadeInit)
  {
    super.init();
    this.#players       = players;
    this.#crossfadeInit = crossfadeInit;
  }

  updateTimer()
  {
    if (this.isVisible || this.#isAutoCrossfade())
      this.#players.current.getPosition((position, duration) => this.#updateCallback(position, duration));
  }

  updateVolumeMute()
  {
    if (isPlaying() && (this.#players.crossfade.isFading() === false))
      this.#players.current.getVolume((volume) => updateVolumeMuteSettings(Math.round(volume), this.#players.current.isMuted()));
  }
}

export const playbackTimer = new GalleryPlaybackTimer();
