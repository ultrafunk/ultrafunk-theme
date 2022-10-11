//
// Embedded media player classes + playlist
//
// https://ultrafunk.com
//


import * as debugLogger from '../shared/debuglogger.js';
import { VOLUME }       from './gallery/crossfade.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('mediaplayers');

export const TRACK_TYPE = {
  NONE:       0,
  YOUTUBE:    1,
  SOUNDCLOUD: 2,
};


// ************************************************************************************************
// MediaPlayer parent class
// ************************************************************************************************

class MediaPlayer
{
  #trackType;
  #trackId        = null;
  #iframeId       = null;
  #embeddedPlayer = null;
  #isPlayable     = true;

  duration       = 0;
  artist         = null;
  title          = null;
  thumbnailSrc   = null;
  thumbnailClass = 'type-default';

  constructor(trackType, trackId, iframeId, embeddedPlayer)
  {
    this.#trackType      = trackType;
    this.#trackId        = trackId;
    this.#iframeId       = iframeId;
    this.#embeddedPlayer = embeddedPlayer;

    this.thumbnail          = new Image();
    this.thumbnail.decoding = 'async';
  }

  getTrackType() { return this.#trackType;      }
  getTrackId()   { return this.#trackId;        }
  getIframeId()  { return this.#iframeId;       }
  getUid()       { return this.#iframeId;       }
  get embedded() { return this.#embeddedPlayer; }

  isPlayable()              { return this.#isPlayable;       }
  setIsPlayable(isPlayable) { this.#isPlayable = isPlayable; }

  getDuration()         { return this.duration;     }
  setDuration(duration) { this.duration = duration; }

  getArtist()       { return this.artist;   }
  setArtist(artist) { this.artist = artist; }

  getTitle()      { return this.title;  }
  setTitle(title) { this.title = title; }

  getThumbnailSrc()   { return this.thumbnailSrc;   }
  getThumbnailClass() { return this.thumbnailClass; }

  seekTo(position)  { this.#embeddedPlayer.seekTo(position);  }
  setVolume(volume) { this.#embeddedPlayer.setVolume(volume); }

  setArtistTitle(artist, title)
  {
    this.artist = artist;
    this.title  = title;
  }

  setThumbnail(thumbnail)
  {
    this.thumbnailSrc   = thumbnail.src;
    this.thumbnailClass = thumbnail.class;
    this.thumbnail.src  = thumbnail.src;
  }
}


// ************************************************************************************************
// YouTube child class
// ************************************************************************************************

export class YouTube extends MediaPlayer
{
  constructor(trackId, iframeId, embeddedPlayer, videoId)
  {
    super(TRACK_TYPE.YOUTUBE, trackId, iframeId, embeddedPlayer);
    super.setThumbnail(getYouTubeImgUrl(videoId));
  }

  pause() { this.embedded.pauseVideo(); }
  stop()  { this.embedded.stopVideo();  }

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

export class SingleTrack extends YouTube
{
  #isCued = false;

  isCued()          { return this.#isCued;   }
  setIsCued(isCued) { this.#isCued = isCued; }
  playTrackById(id) { this.embedded.loadVideoById(id); }

  cueTrackById(id)
  {
    this.embedded.cueVideoById(id);
    this.#isCued = true;
  }
}


// ************************************************************************************************
// SoundCloud child class
// ************************************************************************************************

export class SoundCloud extends MediaPlayer
{
  #soundId = null;
  #volume  = VOLUME.MAX;
  #isMuted = false;

  constructor(trackId, iframeId, embeddedPlayer, iframeSrc)
  {
    super(TRACK_TYPE.SOUNDCLOUD, trackId, iframeId, embeddedPlayer);
    this.#soundId = this.#getSoundId(iframeSrc);
  }

  #getSoundId(iframeSrc)
  {
    if (iframeSrc)
    {
      const iframeSrcParts = new URL(decodeURIComponent(iframeSrc));
      const trackUrl       = iframeSrcParts.searchParams.get('url');

      if (trackUrl !== null)
      {
        const trackUrlParts = trackUrl.split('/');
        const tracksString  = 'tracks'.toUpperCase();

        for (let i = 0; i < trackUrlParts.length; i++)
        {
          if (trackUrlParts[i].toUpperCase() === tracksString)
            return parseInt(trackUrlParts[i + 1]);
        }
      }
    }

    debug.error(`MediaPlayer.SoundCloud.getSoundId() failed for: ${this.getIframeId()}`);

    return null;
  }

  setThumbnail(trackThumbnailUrlElement)
  {
    this.embedded.getCurrentSound(soundObject =>
    {
      super.setThumbnail(getSoundCloudImgUrl(soundObject));
      trackThumbnailUrlElement?.setAttribute('data-track-thumbnail-url', this.getThumbnailSrc());
    });
  }

  // Override parent getUid() because SoundCloud provides its own UID
  getUid() { return this.#soundId;  }
  pause()  { this.embedded.pause(); }

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
// Playlist child class
// ************************************************************************************************

export class Playlist extends MediaPlayer
{
  #playerError = -1;
  #isTrackCued = false;

  constructor(embeddedPlayer)
  {
    super(TRACK_TYPE.YOUTUBE, null, null, embeddedPlayer);
  }

  isTrackCued()         { return this.#isTrackCued;  }
  setPlayerError(error) { this.#playerError = error; }

  resetState()
  {
    this.#playerError = -1;
    this.#isTrackCued = false;
  }

  cueTrackById(sourceUid)
  {
    this.embedded.cueVideoById(sourceUid);
    this.#isTrackCued = true;
  }

  playTrackById(sourceUid)
  {
    this.embedded.loadVideoById(sourceUid);
    this.#isTrackCued = false;
  }

  play(onErrorCallback)
  {
    this.#isTrackCued = false;

    if (this.#playerError !== -1)
    {
      onErrorCallback({ data: this.#playerError });
      this.#playerError = -1;
    }
    else
    {
      this.embedded.playVideo();
    }
  }

  setThumbnail(videoId)
  {
    super.setThumbnail(getYouTubeImgUrl(videoId));
  }

  getTrackData()
  {
    return {
      currentTrack: 1,
      numTracks:    1,
      artist:       this.getArtist(),
      title:        this.getTitle(),
      duration:     this.getDuration(),
      thumbnail:    { src: this.getThumbnailSrc(), class: this.getThumbnailClass() },
    };
  }
}


// ************************************************************************************************
// MediaPlayer class support functions
// ************************************************************************************************

// Default / fallback track thumbnail object
const defThumbnailObj = { src: '/wp-content/themes/ultrafunk/inc/img/photo_filled_grey.png', class: 'type-default', uid: '' };

// https://webapps.stackexchange.com/a/101153
export const youTubeVideoIdRegEx = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/;

export function getYouTubeImgUrl(trackSourceUrl)
{
  const youTubeVideoId = trackSourceUrl.match(youTubeVideoIdRegEx);

  if (youTubeVideoId !== null)
    return { src: `https://img.youtube.com/vi/${youTubeVideoId[0]}/default.jpg`, class: 'type-youtube', uid: youTubeVideoId[0] };

  return defThumbnailObj;
}

function getSoundCloudImgUrl(soundObject)
{
  const thumbnailSrc = (soundObject.artwork_url !== null)
                         ? soundObject.artwork_url
                         : soundObject.user.avatar_url;

  if (thumbnailSrc)
    return { src: thumbnailSrc, class: 'type-soundcloud', uid: '' };

  return defThumbnailObj;
}
