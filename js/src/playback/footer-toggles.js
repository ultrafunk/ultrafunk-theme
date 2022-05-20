//
// Interaction footer toggle controls
//
// https://ultrafunk.com
//


import ToggleElement          from '../shared/toggle-element.js';
import { showSnackbar }       from '../shared/snackbar.js';
import { response, settings } from '../shared/session-data.js';

import {
  replaceClass,
  getPrefPlayerUrl,
  navToUrl,
} from '../shared/utils.js';

import {
  PLAYER_TYPE,
  isListPlayer,
} from './shared-gallery-list.js';

import {
  KEY,
  YEAR_IN_SECONDS,
  setCookie,
} from '../shared/storage.js';


/*************************************************************************************************/


export let playerType = null;
export let crossfade  = null;
export let autoplay   = null;


// ************************************************************************************************
//
// ************************************************************************************************

export function init(getPlayerStatus)
{
  playerType = new PlayerTypeToggle('footer-player-type-toggle', getPlayerStatus);

  // Init crossfade before autoplay because autoplay can disable crossfade in update()
  crossfade = new CrossfadeToggle('footer-crossfade-toggle');
  autoplay  = new AutoplayToggle('footer-autoplay-toggle');
}


// ************************************************************************************************
// Footer player type toggle: Gallery or List
// ************************************************************************************************

class PlayerTypeToggle extends ToggleElement
{
  constructor(elementId, getPlayerStatus)
  {
    super(elementId);
    this.getPlayerStatus = getPlayerStatus;
  }
  
  toggle()
  {
    const destData = this.getDestData();
    let   destUrl  = window.location.href.replace(/\/page\/(?!0)\d{1,6}/, ''); // Strip off any pagination
  
    // Add new destination pagination if needed
    if (destData.pageNum > 1)
      destUrl = `${destUrl}page/${destData.pageNum}/`;

    settings.playback.preferredPlayer = isListPlayer() ? PLAYER_TYPE.GALLERY : PLAYER_TYPE.LIST;
    setCookie(KEY.UF_PREFERRED_PLAYER, `${isListPlayer() ? PLAYER_TYPE.GALLERY : PLAYER_TYPE.LIST}`, (YEAR_IN_SECONDS * 5));
    sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify(destData.trackData));

    navToUrl(getPrefPlayerUrl(destUrl));
  }

  update()
  {
    this.value = (settings.playback.preferredPlayer === PLAYER_TYPE.LIST) ? 'List' : 'Gallery';
  }
  
  getDestData()
  {
    const urlParts          = window.location.href.split('/');
    const pageIndex         = urlParts.findIndex(part => (part.toLowerCase() === 'page'));
    const currentPage       = (pageIndex !== -1)
                                ? parseInt(urlParts[pageIndex + 1])
                                : 1;
    const trackData         = this.getPlayerStatus();
    const tracksPerPageFrom = isListPlayer() ? response.listPerPage    : response.galleryPerPage;
    const tracksPerPageTo   = isListPlayer() ? response.galleryPerPage : response.listPerPage;
    const trackOffset       = trackData.currentTrack + ((currentPage - 1) * tracksPerPageFrom);
  
    return {
      pageNum: Math.ceil(trackOffset / tracksPerPageTo),
      trackData: {
        autoplay: trackData?.isPlaying,
        trackId:  trackData?.trackId,
        position: trackData?.position,
      }
    };
  }
}


// ************************************************************************************************
// Footer autoplay and crossfade toggles
// ************************************************************************************************

class AutoplayToggle extends ToggleElement
{
  toggle()
  {
    settings.playback.autoplay = (settings.playback.autoplay === true) ? false : true;
    
    showSnackbar(settings.playback.autoplay
      ? 'Autoplay enabled (<b>Shift</b> + <b>A</b> to disable)'
      : 'Autoplay disabled (<b>Shift</b> + <b>A</b> to enable)', 5);
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

class CrossfadeToggle extends ToggleElement
{
  toggle()
  {
    settings.gallery.autoCrossfade = (settings.gallery.autoCrossfade === true) ? false : true;
    
    showSnackbar(settings.gallery.autoCrossfade
      ? 'Auto Crossfade enabled (<b>x</b> to disable)'
      : 'Auto Crossfade disabled (<b>x</b> to enable)', 5);
  }

  update()
  {
    this.value = settings.gallery.autoCrossfade ? 'ON' : 'OFF';
  }
}
