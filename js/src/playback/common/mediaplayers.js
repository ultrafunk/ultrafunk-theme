//
// Embedded media player classes + playlist
//
// https://ultrafunk.com
//


//import { newDebugLogger } from '../../shared/debuglogger.js';
import { VOLUME }         from '../gallery/crossfade.js';
import { THEME_ENV }      from '../../config.js';


/*************************************************************************************************/


//const debug = newDebugLogger('mediaplayers');

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
  #sourceUid      = null;
  #isPlayable     = true;
  #isCued         = false;

  duration       = 0;
  artist         = null;
  title          = null;
  thumbnailSrc   = THEME_ENV.defaultTrackThumbnail;
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

  getTrackType()    { return this.#trackType;      }
  getTrackId()      { return this.#trackId;        }
  getIframeId()     { return this.#iframeId;       }
  get embedded()    { return this.#embeddedPlayer; }
  getSourceUid()    { return this.#sourceUid;      }
  setSourceUid(uid) { this.#sourceUid = uid;       }

  isPlayable()              { return this.#isPlayable;       }
  setIsPlayable(isPlayable) { this.#isPlayable = isPlayable; }

  isCued()          { return this.#isCued;   }
  setIsCued(isCued) { this.#isCued = isCued; }

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
    this.setThumbnail(getYouTubeImgUrl(videoId));
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
// SoundCloud child class
// ************************************************************************************************

export class SoundCloud extends MediaPlayer
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
      super.setThumbnail(getSoundCloudImgUrl(soundObject));
      trackThumbnailUrlElement?.setAttribute('data-track-thumbnail-url', this.getThumbnailSrc());
    });
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
// Playlist child class
// ************************************************************************************************

export class Playlist extends MediaPlayer
{
  #playerError = -1;

  constructor(embeddedPlayer)
  {
    super(TRACK_TYPE.YOUTUBE, null, null, embeddedPlayer);
  }

  setPlayerError(error) { this.#playerError = error; }

  resetState()
  {
    this.#playerError = -1;
    this.setIsCued(false);
  }

  cueTrackById(sourceUid, positionSeconds = 0)
  {
    this.embedded.cueVideoById(sourceUid, positionSeconds);
    this.setIsCued(true);
  }

  playTrackById(sourceUid, positionSeconds = 0)
  {
    this.embedded.loadVideoById(sourceUid, positionSeconds);
    this.setIsCued(false);
  }

  play(onErrorCallback)
  {
    this.setIsCued(false);

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

  getTrackData(positionSeconds = 0)
  {
    return {
      currentTrack: 1,
      numTracks:    1,
      artist:       this.getArtist(),
      title:        this.getTitle(),
      position:     positionSeconds,
      duration:     this.getDuration(),
      thumbnail:    { src: this.getThumbnailSrc(), class: this.getThumbnailClass() },
    };
  }
}


// ************************************************************************************************
// MediaPlayer class support functions
// ************************************************************************************************

// Default / fallback track thumbnail object
const defThumbnailObj = { src: THEME_ENV.defaultTrackThumbnail, class: 'type-default', uid: '' };

// https://webapps.stackexchange.com/a/101153
const youTubeVideoIdRegEx = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/;

export function getYouTubeImgUrl(trackSourceUrl)
{
  const youTubeVideoId = trackSourceUrl.match(youTubeVideoIdRegEx);

  if (youTubeVideoId !== null)
    return { src: `https://i.ytimg.com/vi/${youTubeVideoId[0]}/default.jpg`, class: 'type-youtube', uid: youTubeVideoId[0] };

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
