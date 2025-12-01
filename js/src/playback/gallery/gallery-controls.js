//
// Gallery-player controls module
//
// https://ultrafunk.com
//


import * as playbackEvents from '../common/playback-events.js';
import { newDebugLogger }  from '../../shared/debuglogger.js';
import { ElementClick }    from '../../shared/element-click.js';
import { isPlaying }       from '../common/playback-controls.js';
import { presetList }      from '../../settings/settings.js';
import { settings }        from '../../shared/session-data.js';

import {
  STATE,
  ElementsWrapper,
} from '../common/element-wrappers.js';

import {
  linkClickUsePrefPlayer,
  replaceClass,
} from '../../shared/utils.js';

import {
  showTrackSharePlay,
  showTrackDetails,
} from '../common/track-modals.js';


/*************************************************************************************************/


const debug = newDebugLogger('gallery-controls');
const m     = { uiElements: null, players: {} };
const ctrl  = {};

const config = {
  crossfadePresetSelector: 'button.crossfade-preset-toggle',
  crossfadePresetData:     'data-crossfade-preset',
  crossfadeToSelector:     'button.crossfade-fadeto-button',
};


// ************************************************************************************************
//
// ************************************************************************************************

export function initGalleryControls(mediaPlayers, crossfadeClickCallback)
{
  debug.log('init()');

  m.players    = mediaPlayers;
  m.uiElements = new UiElements('div.track-meta', true);

  ctrl.crossfadePreset = ElementsWrapper(config.crossfadePresetSelector);
  ctrl.crossfadeTo     = ElementsWrapper(config.crossfadeToSelector);

  if ((ctrl.crossfadePreset.length > 1) && (ctrl.crossfadeTo.length > 1))
  {
    ctrl.crossfadePreset.forEach(element => setCrossfadePreset(element, settings.gallery.trackCrossfadeDefPreset));
    ctrl.crossfadeTo.clickCallback = crossfadeClickCallback;
  }

  playbackEvents.addListener(playbackEvents.EVENT.PLAYBACK_READY, playbackReady);
}

function playbackReady()
{
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
//
// ************************************************************************************************

class UiElements extends ElementClick
{
  elementClicked(clickId)
  {
    switch (clickId)
    {
      case 'track-share-play':
        showTrackSharePlay(this.closest('single-track, gallery-track'));
        break;

      case 'track-details':
        showTrackDetails(this.closest('single-track, gallery-track'));
        break;

      case 'track-artist-link':
      case 'track-channel-link':
        linkClickUsePrefPlayer(this.event);
        break;
    }
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
    const element = event.target.closest('gallery-track');

    if (element !== null)
    {
      const iframe = element.querySelector('iframe');
      const index  = parseInt(element.querySelector(config.crossfadePresetSelector).getAttribute(config.crossfadePresetData));

      replaceClass(element.querySelector(config.crossfadeToSelector), STATE.ENABLED.CLASS, STATE.DISABLED.CLASS);
      ctrl.crossfadeTo.clickCallback(iframe.id, presetList.crossfade[index]);
    }
  }
}

function updateCrossfadeToState()
{
  const currentTrack = isPlaying() ? m.players.getTrackData().currentTrack : -1;

  debug.log(`updateCrossfadeToState() - playingState: ${isPlaying()} - currentTrack: ${currentTrack}`);

  ctrl.crossfadeTo.forEach((element, index) =>
  {
    if (currentTrack === (index + 1))
    {
      replaceClass(element,
        (isPlaying() ? STATE.ENABLED.CLASS  : STATE.DISABLED.CLASS),
        (isPlaying() ? STATE.DISABLED.CLASS : STATE.ENABLED.CLASS)
      );
    }
    else
    {
      replaceClass(element,
        (isPlaying() ? STATE.DISABLED.CLASS : STATE.ENABLED.CLASS),
        (isPlaying() ? STATE.ENABLED.CLASS  : STATE.DISABLED.CLASS)
      );
    }
  });
}
