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
  constructor(trackId, iframeId, embeddedPlayer)
  {
    this.trackType      = TRACK_TYPE.NONE;
    this.trackId        = trackId;
    this.iframeId       = iframeId;
    this.embeddedPlayer = embeddedPlayer;
    this.isPlayable     = true;

    this.duration = 0;
    this.artist   = null;
    this.title    = null;

    this.thumbnailSrc       = null;
    this.thumbnailClass     = 'type-default';
    this.thumbnail          = new Image();
    this.thumbnail.decoding = 'async';
  }

  // Abstract methods to be overriden in child class if needed
  cueTrackById()  {}
  playTrackById() {}

  getTrackType()        { return this.trackType;      }
  getTrackId()          { return this.trackId;        }
  getIframeId()         { return this.iframeId;       }
  getUid()              { return this.iframeId;       }
  getEmbeddedPlayer()   { return this.embeddedPlayer; }

  getIsPlayable()           { return this.isPlayable;       }
  setIsPlayable(isPlayable) { this.isPlayable = isPlayable; }

  getDuration()         { return this.duration;     }
  setDuration(duration) { this.duration = duration; }

  getArtist()           { return this.artist;   }
  setArtist(artist)     { this.artist = artist; }

  getTitle()            { return this.title;  }
  setTitle(title)       { this.title = title; }

  getThumbnailSrc()     { return this.thumbnailSrc;   }
  getThumbnailClass()   { return this.thumbnailClass; }

  seekTo(position)      { this.embeddedPlayer.seekTo(position);  }
  setVolume(volume)     { this.embeddedPlayer.setVolume(volume); }

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
    super(trackId, iframeId, embeddedPlayer);
    this.trackType = TRACK_TYPE.YOUTUBE;
    super.setThumbnail(getYouTubeImgUrl(videoId));
  }

  cueTrackById(id)  { this.embeddedPlayer.cueVideoById(id);  }
  playTrackById(id) { this.embeddedPlayer.loadVideoById(id); }
  pause()           { this.embeddedPlayer.pauseVideo();      }
  stop()            { this.embeddedPlayer.stopVideo();       }

  play(onErrorCallback)
  {
    if (this.isPlayable === true)
      this.embeddedPlayer.playVideo();
    else
      onErrorCallback(this, this.embeddedPlayer.getVideoUrl());
  }

  getVolume(callback)
  {
    callback(this.embeddedPlayer.getVolume());
  }

  mute(setMute)
  {
    if (setMute)
      this.embeddedPlayer.mute();
    else
      this.embeddedPlayer.unMute();
  }

  getPosition(callback)
  {
    callback((this.embeddedPlayer.getCurrentTime() * 1000), this.duration);
  }
}


// ************************************************************************************************
// SoundCloud child class
// ************************************************************************************************

export class SoundCloud extends MediaPlayer
{
  constructor(trackId, iframeId, embeddedPlayer, iframeSrc)
  {
    super(trackId, iframeId, embeddedPlayer);
    this.trackType = TRACK_TYPE.SOUNDCLOUD;
    this.soundId   = this.getSoundId(iframeSrc);
    this.volume    = VOLUME.MAX;
    this.muted     = false;
  }

  getSoundId(iframeSrc)
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

    debug.error(`MediaPlayer.SoundCloud.getSoundId() failed for: ${this.iframeId}`);

    return null;
  }

  setThumbnail(trackThumbnailUrlElement)
  {
    this.embeddedPlayer.getCurrentSound(soundObject =>
    {
      super.setThumbnail(getSoundCloudImgUrl(soundObject));
      trackThumbnailUrlElement?.setAttribute('data-track-thumbnail-url', this.getThumbnailSrc());
    });
  }

  // Override parent getUid() because SoundCloud provides its own UID
  getUid() { return this.soundId;         }
  pause()  { this.embeddedPlayer.pause(); }

  play(onErrorCallback)
  {
    // playable is set to FALSE if the widget fires SC.Widget.Events.ERROR (track does not exist)
    if (this.isPlayable === true)
    {
      this.embeddedPlayer.getCurrentSound(soundObject =>
      {
        if (soundObject.playable === true)
          this.embeddedPlayer.play();
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
    this.embeddedPlayer.getVolume(volume => callback(volume));
  }

  // Override parent setVolume() because we use it for mute() as well
  setVolume(volume)
  {
    if (volume !== 0)
      this.volume = volume;

    if ((this.muted === false) || (volume === 0))
      super.setVolume(volume);
  }

  mute(setMute)
  {
    this.muted = setMute ? true : false;

    if (setMute)
      this.setVolume(0);
    else
      this.setVolume(this.volume);
  }

  getPosition(callback)
  {
    this.embeddedPlayer.getPosition(positionMilliseconds => callback(positionMilliseconds, this.duration));
  }
}


// ************************************************************************************************
// Playlist child class
// ************************************************************************************************

export class Playlist extends MediaPlayer
{
  constructor(embeddedPlayer)
  {
    super(null, null, embeddedPlayer);
    this.trackType    = TRACK_TYPE.YOUTUBE;
    this.numTracks    = 3;
    this.currentTrack = 2;
    this.playerState  = -1; // YT.PlayerState.UNSTARTED
  }

  get embedded()        { return this.embeddedPlayer; }
  getNumTracks()        { return this.numTracks;      }
  getCurrentTrack()     { return this.currentTrack;   }
  setPlayerState(state) { this.playerState = state;   }

  play(onErrorCallback)
  {
    //YT.PlayerState.CUED === 5
    if ((this.playerState === 5) && (this.embeddedPlayer.getDuration() === 0))
    {
      onErrorCallback({ data: 'Unable to play track -- No YouTube API error given!' });
      this.playerState = -1; // YT.PlayerState.UNSTARTED
    }
    else
    {
      this.embeddedPlayer.playVideo();
    }
  }

  setThumbnail(videoId)
  {
    super.setThumbnail(getYouTubeImgUrl(videoId));
  }

  getTrackData()
  {
    return {
      currentTrack: this.getCurrentTrack(),
      numTracks:    this.getNumTracks(),
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
