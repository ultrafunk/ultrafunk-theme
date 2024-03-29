//
// Track to track crossfade module
//
// https://ultrafunk.com
//


import { newDebugLogger } from '../../shared/debuglogger.js';
import { settings }       from '../../shared/session-data.js';


/*************************************************************************************************/


const debug = newDebugLogger('crossfade');

export const VOLUME = {
  MIN:   0,
  MAX: 100,
};

const TYPE = {
  NONE:  0,
  AUTO:  1,
  TRACK: 2,
};

export { TYPE as CROSSFADE_TYPE };

const CURVE = {
  NONE:        0,
  EQUAL_POWER: 1,
  LINEAR:      2,
};

const STATE = {
  NONE:   0,
  INIT:   1,
  FADING: 2,
};

const stoppedIntervalId = -1;

const config = {
  intervalEqPow:   33, // Milliseconds between each crossfade update event
  intervalLinear: 100,
};


// ************************************************************************************************
// Crossfade closure
// ************************************************************************************************

export const crossfadeClosure = ((galleryPlayers) =>
{
  const players       = galleryPlayers;
  let fadeState       = STATE.NONE;
  let intervalId      = stoppedIntervalId;
  let fadeOutPlayer   = null;
  let fadeInPlayer    = null;
  let fadeLength      = 0;
  let fadeStartVolume = 0;
  let fadeType        = TYPE.NONE;
  let fadePreset      = null;
  let fadeStartTime   = 0;

  return {
    isFading() { return (fadeState !== STATE.NONE); },
    init,
    start,
    stop,
    mute,
  };

  function init(crossfadeType, crossfadePreset, fadeInUid = null)
  {
    if ((fadeState === STATE.NONE) && (setFadeOutInPlayers(fadeInUid) === true))
    {
      debug.log(`init() - type: ${debug.getKeyForValue(TYPE, crossfadeType)} - fadeInUid: ${fadeInUid} - preset: ${crossfadePreset.length} sec ${debug.getKeyForValue(CURVE, crossfadePreset.curve)} (Name: ${crossfadePreset.name})`);

      fadeState       = STATE.INIT;
      fadeStartVolume = settings.playback.masterVolume;
      fadeType        = crossfadeType;
      fadePreset      = crossfadePreset;

      fadeInPlayer.setVolume(0);

      return true;
    }

    return false;
  }

  function start()
  {
    if (fadeState === STATE.INIT)
    {
      fadeState = STATE.FADING;

      fadeOutPlayer.getPosition((positionMilliseconds) =>
      {
        const updateInterval = (fadePreset.curve === CURVE.EQUAL_POWER) ? config.intervalEqPow : config.intervalLinear;
        fadeStartTime        = ((positionMilliseconds + updateInterval) / 1000);
        const timeRemaining  = fadeOutPlayer.getDuration() - fadeStartTime;
        const fadeRemaining  = timeRemaining - (updateInterval / 100);

        if (fadeType === TYPE.AUTO)
          fadeLength = fadeRemaining;
        else if (fadeType === TYPE.TRACK)
          fadeLength = (timeRemaining > fadePreset.length) ? fadePreset.length : fadeRemaining;

        debug.log(`start() - fadeStartTime: ${fadeStartTime.toFixed(2)} sec - timeRemaining: ${timeRemaining.toFixed(2)} sec - fadeLength: ${fadeLength.toFixed(2)} sec - updateInterval: ${updateInterval} ms`);

        intervalId = setInterval((fadePreset.curve === CURVE.EQUAL_POWER) ? equalPowerFade : linearFade, updateInterval);
      });
    }
  }

  function stop()
  {
    debug.log(`stop() - fadeState: ${debug.getKeyForValue(STATE, fadeState)}`);

    if (fadeState !== STATE.NONE)
    {
      if (intervalId !== stoppedIntervalId)
      {
        clearInterval(intervalId);
        intervalId = stoppedIntervalId;
      }

      if (fadeOutPlayer !== null)
      {
        fadeOutPlayer.pause();
        fadeOutPlayer.seekTo(0);

        // ToDo: Temp fix for: This might POP on fade out end, check if there is a safer way to reset the volume
        setTimeout(() =>
        {
          fadeOutPlayer.setVolume(settings.playback.masterVolume); // ToDo: fadeStartVolume is 0 because of setTimeout()
          fadeOutPlayer = null;
        },
        250);
      }

      if (fadeInPlayer !== null)
      {
        // If crossfade is stopped before completion, set fade-in player volume to its crossfade completion value
        fadeInPlayer.setVolume(fadeStartVolume);
        fadeInPlayer = null;
      }

      fadeState       = STATE.NONE;
      fadeLength      = 0;
      fadeStartVolume = 0;
      fadeType        = TYPE.NONE;
      fadePreset      = null;
      fadeStartTime   = 0;
    }
  }

  function mute(setMute)
  {
    if (fadeOutPlayer !== null)
      fadeOutPlayer.mute(setMute);
  }

  function setFadeOutInPlayers(fadeInUid)
  {
    fadeOutPlayer = players.current;
    fadeInPlayer  = (fadeInUid === null) ? players.next : players.playerFromIframeId(fadeInUid);

    if (fadeOutPlayer.isPlayable() && fadeInPlayer.isPlayable())
      return true;

    return false;
  }

  //
  // https://dsp.stackexchange.com/questions/14754/equal-power-crossfade
  //
  function equalPowerFade()
  {
    fadeOutPlayer.getPosition((positionMilliseconds) =>
    {
      // SoundCloud getPosition() is async so the interval timer can be stopped before this is called, if so, just bail out...
      if (intervalId === stoppedIntervalId)
        return;

      // Clamp negative position values
      const position     = ((positionMilliseconds / 1000) - fadeStartTime);
      const fadePosition = (position >= 0) ? position : 0;

      // Clamp negative volume values
      const volume     = fadeStartVolume - (fadeStartVolume * (fadePosition / fadeLength));
      const fadeVolume = (volume >= VOLUME.MIN) ? volume : VOLUME.MIN;

      const fadeOutVolume = Math.round(Math.sqrt(fadeStartVolume * fadeVolume));
      const fadeInVolume  = Math.round(Math.sqrt(fadeStartVolume * (fadeStartVolume - fadeVolume)));

      if ((fadePosition >= fadeLength) && (fadeVolume <= VOLUME.MIN) && (fadeInVolume >= fadeStartVolume))
      {
        fadeOutPlayer.setVolume(VOLUME.MIN);
        fadeInPlayer.setVolume(fadeStartVolume);
        stop();
      }
      else
      {
        fadeOutPlayer.setVolume(fadeOutVolume);
        fadeInPlayer.setVolume(fadeInVolume);
      }
    });
  }

  function linearFade()
  {
    fadeOutPlayer.getPosition((positionMilliseconds) =>
    {
      // SoundCloud getPosition() is async so the interval timer can be stopped before this is called, if so, just bail out...
      if (intervalId === stoppedIntervalId)
        return;

      const fadePosition  = ((positionMilliseconds / 1000) - fadeStartTime);
      const fadeInVolume  = Math.round(fadeStartVolume * (fadePosition / fadeLength));
      const fadeOutVolume = fadeStartVolume - fadeInVolume;

      if ((fadePosition > fadeLength) && (fadeOutVolume < VOLUME.MIN) && (fadeInVolume > fadeStartVolume))
      {
        fadeOutPlayer.setVolume(VOLUME.MIN);
        fadeInPlayer.setVolume(fadeStartVolume);
        stop();
      }
      else
      {
        fadeOutPlayer.setVolume(fadeOutVolume);
        fadeInPlayer.setVolume(fadeInVolume);
      }
    });
  }
});
