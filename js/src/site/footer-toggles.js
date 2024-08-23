//
// Interaction footer toggle controls
//
// https://ultrafunk.com
//


import { ElementToggle }      from '../shared/element-toggle.js';
import { showSnackbar }       from '../shared/snackbar.js';
import { response, settings } from '../shared/session-data.js';
import { TRACK_TYPE }         from '../playback/common/mediaplayer.js';

import {
  replaceClass,
  getPrefPlayerUrl,
  navToUrl,
} from '../shared/utils.js';

import {
  PLAYER_TYPE,
  isListPlayer,
  onKeysVolumeChange,
  resetVolumeMute,
} from '../playback/common/shared-gallery-list.js';

import {
  KEY,
  YEAR_IN_SECONDS,
  setCookie,
  addSettingsObserver,
} from '../shared/storage.js';


/*************************************************************************************************/


const m = { player: null };

export let playerType = null;
export let crossfade  = null;
export let autoplay   = null;


// ************************************************************************************************
//
// ************************************************************************************************

export function init(player)
{
  m.player = player;

  new MuteToggle('footer-mute-toggle');
  new VolumeToggle('footer-volume-toggle');

  playerType = new PlayerTypeToggle('footer-player-type-toggle');

  // Init crossfade before autoplay because autoplay can disable crossfade in update()
  crossfade = new CrossfadeToggle('footer-crossfade-toggle');
  autoplay  = new AutoplayToggle('footer-autoplay-toggle');
}


// ************************************************************************************************
// Footer mute and volume toggles
// ************************************************************************************************

class MuteToggle extends ElementToggle
{
  constructor(elementId)
  {
    super(elementId);
    addSettingsObserver('masterMute', () => this.update());
  }

  toggle() { m.player.toggleMute(); }
  update() { this.value = settings.playback.masterMute ? 'Yes' : 'No'; }
}

class VolumeToggle extends ElementToggle
{
  constructor(elementId)
  {
    super(elementId);
    addSettingsObserver('masterVolume', () => this.update());
  }

  toggle(event)
  {
    if (event.target.classList.contains('volume-up'))
    {
      event.key = '+';
      onKeysVolumeChange(event, m.player);
    }
    else if (event.target.classList.contains('volume-down'))
    {
      event.key = '-';
      onKeysVolumeChange(event, m.player);
    }
    else
    {
      resetVolumeMute(m.player);
    }
  }

  update() { this.value = settings.playback.masterVolume; }
}


// ************************************************************************************************
// Footer player type toggle: Gallery or List
// ************************************************************************************************

class PlayerTypeToggle extends ElementToggle
{
  async toggle()
  {
    if (m.player.getStatus().trackType === TRACK_TYPE.LOCAL)
    {
      showSnackbar({ message: `Can't change Pref. Player for Local Tracks!` });
      return;
    }

    const destData = await this.getDestData();

    settings.playback.preferredPlayer = isListPlayer() ? PLAYER_TYPE.GALLERY : PLAYER_TYPE.LIST;
    setCookie(KEY.UF_PREFERRED_PLAYER, `${isListPlayer() ? PLAYER_TYPE.GALLERY : PLAYER_TYPE.LIST}`, (YEAR_IN_SECONDS * 5));
    sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify(destData.trackData));

    navToUrl(getPrefPlayerUrl(this.getDestUrl(destData)));
  }

  update()
  {
    this.value = (settings.playback.preferredPlayer === PLAYER_TYPE.LIST) ? 'List' : 'Gallery';
  }

  getDestUrl(destData)
  {
    const isPagedRegEx = /\/page\/(?!0)\d{1,6}/;
    const sourceUrl    = window.location.href;
    let destUrl        = null;

    // Add destination pagination or remove pagination if needed
    if ((destData.pageNum > 1) && (sourceUrl.match(isPagedRegEx) !== null))
    {
      destUrl = sourceUrl.replace(isPagedRegEx, `/page/${destData.pageNum}`);
    }
    else if (destData.pageNum > 1)
    {
      const url = new URL(decodeURIComponent(sourceUrl));
      destUrl   = `${url.origin}${url.pathname}page/${destData.pageNum}/${url.search}`;
    }
    else
    {
      destUrl = sourceUrl.replace(isPagedRegEx, '');
    }

    return destUrl;
  }

  async getDestData()
  {
    const urlParts          = window.location.href.split('/');
    const pageIndex         = urlParts.findIndex(part => (part.toLowerCase() === 'page'));
    const currentPage       = (pageIndex !== -1)
                                ? parseInt(urlParts[pageIndex + 1])
                                : 1;
    const trackData         = await m.player.getStatus(true);
    const tracksPerPageFrom = isListPlayer() ? response.listPerPage    : response.galleryPerPage;
    const tracksPerPageTo   = isListPlayer() ? response.galleryPerPage : response.listPerPage;
    const trackOffset       = trackData.currentTrack + ((currentPage - 1) * tracksPerPageFrom);

    return {
      pageNum: Math.ceil(trackOffset / tracksPerPageTo),
      trackData: {
        autoplay: trackData.isPlaying ?? false,
        trackId:  trackData.trackId   ?? null,
        position: trackData.position  ?? 0,
      }
    };
  }
}


// ************************************************************************************************
// Footer autoplay and crossfade toggles
// ************************************************************************************************

class AutoplayToggle extends ElementToggle
{
  toggle()
  {
    settings.playback.autoplay = (settings.playback.autoplay === true) ? false : true;

    showSnackbar({
      duration: 5,
      message: settings.playback.autoplay
                 ? 'Autoplay enabled (<b>Shift</b> + <b>A</b> to Disable)'
                 : 'Autoplay disabled (<b>Shift</b> + <b>A</b> to Enable)',
    });
  }

  update()
  {
    this.value = settings.playback.autoplay ? 'ON' : 'OFF';

    settings.playback.autoplay
      ? replaceClass(document.body, 'autoplay-off', 'autoplay-on')
      : replaceClass(document.body, 'autoplay-on', 'autoplay-off');

    settings.playback.autoplay
      ? crossfade?.classList.remove('disabled')
      : crossfade?.classList.add('disabled');
  }
}

class CrossfadeToggle extends ElementToggle
{
  toggle()
  {
    settings.gallery.autoCrossfade = (settings.gallery.autoCrossfade === true) ? false : true;

    showSnackbar({
      duration: 5,
      message: settings.gallery.autoCrossfade
                 ? 'Auto Crossfade enabled (<b>x</b> to Disable)'
                 : 'Auto Crossfade disabled (<b>x</b> to Enable)',
    });
  }

  update()
  {
    this.value = settings.gallery.autoCrossfade ? 'ON' : 'OFF';
  }
}
