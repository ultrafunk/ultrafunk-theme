//
// Gallery playback timer child class
//
// https://ultrafunk.com
//


import PlaybackTimer              from '../playback-timer.js';
import { settings }               from '../../shared/session-data.js';
import { CROSSFADE_TYPE }         from './crossfade.js';
import { updateTimerAndProgress } from '../playback-controls.js';


/*************************************************************************************************/


class GalleryPlaybackTimer extends PlaybackTimer
{
  constructor()
  {
    super();    
    this.players       = null;
    this.crossfadeInit = null;
  }

  init(players, crossfadeInit)
  {
    super.init();
    this.players       = players;
    this.crossfadeInit = crossfadeInit;
  }

  updateProxy()
  {
    this.players.current.getPosition((position, duration) => this.updateCallback(position, duration));
  }

  updateCallback(positionMilliseconds, durationSeconds = 0)
  {
    const positionSeconds = Math.round(positionMilliseconds / 1000);

    updateTimerAndProgress(positionMilliseconds, positionSeconds, durationSeconds);

    if ((positionSeconds > 0) && (durationSeconds > 0))
    {
      super.updateTimeRemainingWarning(positionSeconds, durationSeconds);
      this.updateAutoCrossfade(positionSeconds, durationSeconds);
    }
  }

  updateAutoCrossfade(positionSeconds, durationSeconds)
  {
    if ((settings.playback.masterMute === false) && settings.playback.autoplay && settings.gallery.autoCrossfade)
    {
      if ((durationSeconds - positionSeconds) === (settings.gallery.autoCrossfadeLength + this.config.maxBufferingDelay))
      {
        if ((this.players.getCurrentTrack() + 1) <= this.players.getNumTracks())
        {
          this.crossfadeInit(CROSSFADE_TYPE.AUTO,
            {
              name:   'Auto Crossfade',
              length: settings.gallery.autoCrossfadeLength,
              curve:  settings.gallery.autoCrossfadeCurve
            }
          );
        }
      }
    }
  }
}

export const playbackTimer = new GalleryPlaybackTimer();
