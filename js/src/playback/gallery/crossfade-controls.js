//
// Crossfade UI controls
//
// https://ultrafunk.com
//


import * as debugLogger    from '../../shared/debuglogger.js';
import * as playbackEvents from '../playback-events.js';
import { isPlaying }       from '../playback-controls.js';
import { presetList }      from '../../shared/settings/settings.js';
import { replaceClass }    from '../../shared/utils.js';
import { settings }        from '../../shared/session-data.js';

import {
  STATE,
  ElementsWrapper
} from '../element-wrappers.js';


export {
  init,
  ready,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('crossfade-controls');
const m     = { players: {} };
const ctrl  = {};

const config = {
  crossfadePresetSelector: '.crossfade-preset-control',
  crossfadePresetData:     'data-crossfade-preset',
  crossfadeToSelector:     '.crossfade-fadeto-control',
};


// ************************************************************************************************
// Init and make ready all controls
// ************************************************************************************************

function init(mediaPlayers, crossfadeClickCallback)
{
  debug.log('init()');

  m.players = mediaPlayers;

  ctrl.crossfadePreset = new ElementsWrapper(config.crossfadePresetSelector);
  ctrl.crossfadeTo     = new ElementsWrapper(config.crossfadeToSelector);

  if ((ctrl.crossfadePreset.length > 1) && (ctrl.crossfadeTo.length > 1))
  {
    ctrl.crossfadePreset.forEach(element => setCrossfadePreset(element, settings.gallery.trackCrossfadeDefPreset));
    ctrl.crossfadeTo.clickCallback = crossfadeClickCallback;
  }

  playbackEvents.addListener(playbackEvents.EVENT.READY, ready);
}

function ready()
{
  debug.log('ready()');

  if ((ctrl.crossfadePreset.length > 1) && (ctrl.crossfadeTo.length > 1))
  {
    ctrl.crossfadePreset.forEach(element =>
    {
      element.addEventListener('click', crossfadePresetClick);
      replaceClass(element, STATE.DISABLED.CLASS, STATE.ENABLED.CLASS);
    });

    ctrl.crossfadeTo.forEach(element => element.addEventListener('click', crossfadeToClick));

    playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PLAYING, updateCrossfadeToState);
    playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PAUSED,  updateCrossfadeToState);
  }
}


// ************************************************************************************************
// Crossfade controls (preset and fadeTo)
// ************************************************************************************************

function setCrossfadePreset(element, index)
{
  element.setAttribute(config.crossfadePresetData, index);
  element.textContent = `${index + 1}`;
  element.title       = `Preset: ${presetList.crossfade[index].name}`;
}

function crossfadePresetClick(event)
{
  const index = parseInt(event.target.getAttribute(config.crossfadePresetData));
  setCrossfadePreset(event.target, ((index + 1) < presetList.crossfade.length) ? (index + 1) : 0);
}

function crossfadeToClick(event)
{
  if (isPlaying() && (m.players.crossfade.isFading() === false))
  {
    const element = event.target.closest('single-track');

    if (element !== null)
    {
      const iframe = element.querySelector('iframe');
      const index  = parseInt(element.querySelector(config.crossfadePresetSelector).getAttribute(config.crossfadePresetData));

      replaceClass(element.querySelector(`div${config.crossfadeToSelector}`), STATE.ENABLED.CLASS, STATE.DISABLED.CLASS);
      ctrl.crossfadeTo.clickCallback(m.players.uIdFromIframeId(iframe.id), presetList.crossfade[index]);
    }
  }
}

function updateCrossfadeToState()
{
  const isPlayingState = isPlaying();
  const currentTrack   = isPlayingState ? m.players.getTrackData().currentTrack : -1;

  debug.log(`updateCrossfadeToState() - playingState: ${isPlayingState} - currentTrack: ${currentTrack}`);

  ctrl.crossfadeTo.forEach((element, index) =>
  {
    if (currentTrack === (index + 1))
      replaceClass(element, (isPlayingState ? STATE.ENABLED.CLASS : STATE.DISABLED.CLASS), (isPlayingState ? STATE.DISABLED.CLASS : STATE.ENABLED.CLASS));
    else
      replaceClass(element, (isPlayingState ? STATE.DISABLED.CLASS : STATE.ENABLED.CLASS), (isPlayingState ? STATE.ENABLED.CLASS : STATE.DISABLED.CLASS));
  });
}
