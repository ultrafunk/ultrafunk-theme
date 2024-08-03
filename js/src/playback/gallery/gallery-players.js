//
// Gallery player classes
//
// https://ultrafunk.com
//


import { newDebugLogger }     from '../../shared/debuglogger.js';
import { settings }           from '../../shared/session-data.js';
import { EVENT, addListener } from '../common/playback-events.js';

import {
  VOLUME,
  crossfadeClosure,
} from './crossfade.js';

import {
  TRACK_TYPE,
  MediaPlayer,
  getYouTubeThumbnailUrl,
  getSoundCloudThumbnailUrl,
} from '../common/mediaplayer.js';


/*************************************************************************************************/


const debug = newDebugLogger('gallery-players');


// ************************************************************************************************
// YouTube Gallery Player child class
// ************************************************************************************************

export class YouTubePlayer extends MediaPlayer
{
  constructor(trackId, iframeId, embeddedPlayer, videoId)
  {
    super(TRACK_TYPE.YOUTUBE, trackId, iframeId, embeddedPlayer);
    this.setThumbnail(getYouTubeThumbnailUrl(videoId));
    this.setSourceUid(videoId);
  }

  pause() { this.embedded.pauseVideo(); }
  stop()  { this.embedded.stopVideo();  }

  cueTrackById(positionSeconds = 0)
  {
    this.embedded.cueVideoById(this.getSourceUid(), positionSeconds);
    this.setIsCued(true);
  }

  playTrackById(positionSeconds = 0)
  {
    this.embedded.loadVideoById(this.getSourceUid(), positionSeconds);
  }

  play(onErrorCallback)
  {
    if (this.isPlayable())
      this.embedded.playVideo();
    else
      onErrorCallback(this, this.embedded.getVideoUrl());
  }

  getVolume(callback)
  {
    callback(this.embedded.getVolume());
  }

  mute(setMute)
  {
    if (setMute)
      this.embedded.mute();
    else
      this.embedded.unMute();
  }

  isMuted()
  {
    return this.embedded.isMuted();
  }

  getPosition(callback)
  {
    callback((this.embedded.getCurrentTime() * 1000), this.duration);
  }
}


// ************************************************************************************************
// SoundCloud Gallery Player child class
// ************************************************************************************************

export class SoundCloudPlayer extends MediaPlayer
{
  #volume  = VOLUME.MAX;
  #isMuted = false;

  constructor(trackId, iframeId, embeddedPlayer)
  {
    super(TRACK_TYPE.SOUNDCLOUD, trackId, iframeId, embeddedPlayer);
  }

  setThumbnail(trackThumbnailUrlElement)
  {
    this.embedded.getCurrentSound(soundObject =>
    {
      super.setThumbnail(getSoundCloudThumbnailUrl(soundObject));
      trackThumbnailUrlElement?.setAttribute('data-track-thumbnail-url', this.getThumbnailSrc());
    });
  }

  cueTrackById(positionSeconds = 0)
  {
    this.seekTo(positionSeconds);
    this.setIsCued(true);
  }

  playTrackById(positionSeconds = 0, onErrorCallback = null)
  {
    this.seekTo(positionSeconds);
    this.play(onErrorCallback);
    this.setIsCued(false);
  }

  pause() { this.embedded.pause(); }

  play(onErrorCallback)
  {
    // playable is set to FALSE if the widget fires SC.Widget.Events.ERROR (track does not exist)
    if (this.isPlayable())
    {
      this.embedded.getCurrentSound(soundObject =>
      {
        if (soundObject.playable === true)
          this.embedded.play();
        else
          onErrorCallback(this, soundObject.permalink_url);
      });
    }
    else
    {
      onErrorCallback(this, 'https://soundcloud.com');
    }
  }

  stop()
  {
    this.pause();
    super.seekTo(0);
  }

  // Override parent because SoundCloud seekTo() needs milliseconds instead of just seconds
  seekTo(positionSeconds)
  {
    super.seekTo(positionSeconds * 1000);
  }

  getVolume(callback)
  {
    if (this.#isMuted === false)
      this.embedded.getVolume(volume => callback(volume));
  }

  // Override parent setVolume() because we use it for mute() as well
  setVolume(volume)
  {
    if (volume !== 0)
      this.#volume = volume;

    if ((this.#isMuted === false) || (volume === 0))
      super.setVolume(volume);
  }

  mute(setMute)
  {
    this.#isMuted = setMute ? true : false;

    if (setMute)
      this.setVolume(0);
    else
      this.setVolume(this.#volume);
  }

  isMuted()
  {
    return this.#isMuted;
  }

  getPosition(callback)
  {
    this.embedded.getPosition(positionMilliseconds => callback(positionMilliseconds, this.duration));
  }
}


// ************************************************************************************************
// Gallery Players proxy class
// ************************************************************************************************

export class GalleryPlayers
{
  indexMap      = new Map();
  crossfade     = null;
  #mediaPlayers = [];
  #playerIndex  = 0;

  constructor()
  {
    this.crossfade = crossfadeClosure(this);

    addListener(EVENT.MEDIA_PLAYING, () => this.crossfade.start());
    addListener(EVENT.MEDIA_PAUSED,  () => this.crossfade.stop());
  }

  get current()                   { return this.#mediaPlayers[this.#playerIndex];           };
  get next()                      { return this.#mediaPlayers[this.#playerIndex + 1];       };
  setPlayerIndex(nextPlayerIndex) { this.#playerIndex = nextPlayerIndex;                    };
  getTrackType()                  { return this.current.getTrackType();                     };
  getNumTracks()                  { return this.#mediaPlayers.length;                       };
  getCurrentTrackNum()            { return this.#playerIndex + 1;                           };
  playerFromIframeId(iframeId)    { return this.#mediaPlayers[this.indexMap.get(iframeId)]; };
  trackNumFromIframeId(iframeId)  { return (this.indexMap.get(iframeId) + 1);               };
  isCurrent(iframeId)             { return (iframeId === this.current.getIframeId());       };

  add(player)
  {
    debug.log(player);

    this.#mediaPlayers.push(player);
    this.indexMap.set(player.getIframeId(), this.#mediaPlayers.length - 1);
  }

  stop()
  {
    this.current.stop();
    this.crossfade.stop();
  }

  mute()
  {
    this.current.mute(settings.playback.masterMute);
    this.crossfade.mute(settings.playback.masterMute);
  }

  getTrackData(positionSeconds = 0)
  {
    return {
      currentTrack: this.getCurrentTrackNum(),
      numTracks:    this.getNumTracks(),
      artist:       this.current.getArtist(),
      title:        this.current.getTitle(),
      position:     positionSeconds,
      duration:     this.current.getDuration(),
      thumbnail:    { src: this.current.getThumbnailSrc(), class: this.current.getThumbnailClass() },
    };
  }

  prevTrack()
  {
    if (this.#playerIndex > 0)
    {
      this.#playerIndex--;
      return true;
    }

    return false;
  }

  nextTrack()
  {
    this.#playerIndex++;

    if (this.#playerIndex < this.getNumTracks())
      return true;

    return false;
  }

  gotoTrackNum(trackNum)
  {
    if ((trackNum > 0) && (trackNum <= this.getNumTracks()))
    {
      this.#playerIndex = trackNum - 1;
      return true;
    }

    return false;
  }
}
