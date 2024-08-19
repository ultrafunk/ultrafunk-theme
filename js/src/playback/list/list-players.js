//
// List player classes
//
// https://ultrafunk.com
//


import { VOLUME }    from "../gallery/crossfade.js";
import { THEME_ENV } from "../../config.js";

import {
  onSoundCloudPlayerStateChange,
  onLocalPlayerStateChange,
  onPlayerError,
} from "./embedded-players.js";

import {
  TRACK_TYPE,
  MediaPlayer,
  getYouTubeThumbnailUrl,
  getSoundCloudThumbnailUrl,
} from "../common/mediaplayer.js";


// ************************************************************************************************
// YouTube player class
// ************************************************************************************************

class YouTubePlayer extends MediaPlayer
{
  #playerError = -1;

  constructor(embeddedPlayer)
  {
    super(TRACK_TYPE.YOUTUBE, null, null, embeddedPlayer);
  }

  setPlayerError(errorNum) { this.#playerError = errorNum; }

  resetState()
  {
    this.#playerError = -1;
    this.setIsCued(false);
  }

  cueTrackById(sourceUid, positionSeconds = 0)
  {
    this.embedded.cueVideoById(sourceUid, positionSeconds);
    this.setIsCued(true);

    return true;
  }

  playTrackById(sourceUid, positionSeconds = 0)
  {
    this.embedded.loadVideoById(sourceUid, positionSeconds);
    this.setIsCued(false);

    return true;
  }

  play()
  {
    this.setIsCued(false);

    if (this.#playerError !== -1)
    {
      onPlayerError(TRACK_TYPE.YOUTUBE, this.#playerError);
      this.#playerError = -1;
    }
    else
    {
      this.embedded.playVideo();
    }
  }

  pause()       { this.embedded.pauseVideo();     }
  stop()        { this.embedded.stopVideo();      }
  mute()        { this.embedded.mute();           }
  unMute()      { this.embedded.unMute();         }
  isMuted()     { return this.embedded.isMuted(); }

  getVolume(callback)
  {
    callback(this.embedded.getVolume());
  }

  getPosition(callback)
  {
    callback(this.embedded.getCurrentTime(), this.duration);
  }

  setThumbnail(trackElement)
  {
    super.setThumbnail(getYouTubeThumbnailUrl(trackElement.getAttribute('data-track-source-uid')));
  }
}


// ************************************************************************************************
// SoundCloud player class
// ************************************************************************************************

class SoundCloudPlayer extends MediaPlayer
{
  #volume  = VOLUME.MAX;
  #isMuted = false;

  #playerOptions = {
    visual:        true,
    single_active: true,
    show_artwork:  true,
  };

  constructor(embeddedPlayer)
  {
    super(TRACK_TYPE.SOUNDCLOUD, null, null, embeddedPlayer);
  }

  resetState()
  {
    this.setIsPlayable(true);
    this.setIsCued(false);
  }

  cueTrackById(sourceUid, positionSeconds = 0)
  {
    onSoundCloudPlayerStateChange('loading');
    this.setIsCued(true);

    return new Promise((resolve) => this.embedded.load(`https://${sourceUid}`, {...this.#playerOptions, callback: () => this.#cueOrPlayTrackById(positionSeconds, false, resolve) }));
  }

  playTrackById(sourceUid, positionSeconds = 0)
  {
    onSoundCloudPlayerStateChange('loading');
    this.setIsCued(false);

    return new Promise((resolve) => this.embedded.load(`https://${sourceUid}`, {...this.#playerOptions, callback: () => this.#cueOrPlayTrackById(positionSeconds, true, resolve) }));
  }

  #cueOrPlayTrackById(positionSeconds, playTrack, resolve)
  {
    this.embedded.getDuration(durationMilliseconds =>
    {
      this.setDuration(Math.round(durationMilliseconds / 1000));
      this.seekTo(positionSeconds);

      this.embedded.getCurrentSound((soundObject) =>
      {
        this.setThumbnail(null, soundObject);
        onSoundCloudPlayerStateChange('ready');

        if (playTrack)
          this.#playSoundObject(soundObject);

        resolve(this.isPlayable());
      });
    });
  }

  #playSoundObject(soundObject)
  {
    if ((this.isPlayable() === false) || (soundObject === null))
    {
      onPlayerError(TRACK_TYPE.SOUNDCLOUD);
      this.setIsPlayable(true);
    }
    else
    {
      this.embedded.play();
    }
  }

  play()
  {
    this.setIsCued(false);
    this.embedded.getCurrentSound((soundObject) => this.#playSoundObject(soundObject));
  }

  pause() { this.embedded.pause(); }

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

  mute()
  {
    this.#isMuted = true;
    this.setVolume(0);
  }

  unMute()
  {
    this.#isMuted = false;
    this.setVolume(this.#volume);
  }

  isMuted()
  {
    return this.#isMuted;
  }

  getPosition(callback)
  {
    this.embedded.getPosition(positionMilliseconds => callback((positionMilliseconds / 1000), this.duration));
  }

  setThumbnail(trackElement, soundObject = null)
  {
    if (soundObject === null)
    {
      if (trackElement === null)
        super.setThumbnail({ src: THEME_ENV.defaultSCThumbnail, class: 'track-type-soundcloud' });
      else
        super.setThumbnail({ src: encodeURI(trackElement.getAttribute('data-track-thumbnail-url')), class: 'track-type-soundcloud' });
    }
    else
    {
      super.setThumbnail(getSoundCloudThumbnailUrl(soundObject));
    }
  }
}


// ************************************************************************************************
// Local (HTML audio) player class
// ************************************************************************************************

class LocalPlayer extends MediaPlayer
{
  constructor(embeddedPlayer)
  {
    super(TRACK_TYPE.LOCAL, null, null, embeddedPlayer);
  }

  resetState()
  {
  }

  cueTrackById(sourceUid, positionSeconds = 0)
  {
    onLocalPlayerStateChange({ type: 'cued' });
    this.embedded.src         = sourceUid;
    this.embedded.currentTime = positionSeconds;
    this.setIsCued(true);

    return true;
  }

  playTrackById(sourceUid, positionSeconds = 0)
  {
    onLocalPlayerStateChange({ type: 'cued' });
    this.embedded.src         = sourceUid;
    this.embedded.currentTime = positionSeconds;
    this.play();
    this.setIsCued(false);

    return true;
  }

  play()
  {
    this.embedded.play();
  }

  stop()
  {
    this.embedded.pause();
    this.embedded.currentTime = 0;
  }

  pause()   { this.embedded.pause();       }
  mute()    { this.embedded.muted = true;  }
  unMute()  { this.embedded.muted = false; }
  isMuted() { return this.embedded.muted;  }

  getPosition(callback)
  {
    callback(Math.floor(this.embedded.currentTime), this.duration);
  }

  getDuration()
  {
    return Math.floor(this.embedded.duration);
  }

  seekTo(positionSeconds)
  {
    this.embedded.currentTime = positionSeconds;
  }

  getVolume(callback)
  {
    // Player volume is min 0.0 => 1.0 max, we use 0 => 100
    callback(Math.round(this.embedded.volume * 100));
  }

  setVolume(volume)
  {
    // Our volume is 0 => 100, player uses min 0.0 => 1.0 max
    this.embedded.volume = (volume / 100);
  }

  setThumbnail(trackElement)
  {
    super.setThumbnail({ src: encodeURI(trackElement.getAttribute('data-track-thumbnail-url')), class: 'track-type-local' });
  }
}


// ************************************************************************************************
// List Players proxy class
// ************************************************************************************************

export class ListPlayers
{
  #youTubePlayer    = null;
  #soundCloudPlayer = null;
  #localPlayer      = null;
  #currentPlayer    = null;

  constructor(youTubePlayer, soundCloudPlayer, localPlayer)
  {
    this.#youTubePlayer    = new YouTubePlayer(youTubePlayer);
    this.#soundCloudPlayer = new SoundCloudPlayer(soundCloudPlayer);
    this.#localPlayer      = new LocalPlayer(localPlayer);
  }

  get current() { return this.#currentPlayer; }

  setCurrentPlayer(trackType)
  {
    switch (trackType)
    {
      case TRACK_TYPE.YOUTUBE:    this.#currentPlayer = this.#youTubePlayer;    break;
      case TRACK_TYPE.SOUNDCLOUD: this.#currentPlayer = this.#soundCloudPlayer; break;
      case TRACK_TYPE.LOCAL:      this.#currentPlayer = this.#localPlayer;      break;
    }
  }

  getTrackData(positionSeconds = 0)
  {
    return {
      currentTrack: 1,
      numTracks:    1,
      artist:       this.#currentPlayer.getArtist(),
      title:        this.#currentPlayer.getTitle(),
      position:     positionSeconds,
      duration:     this.#currentPlayer.getDuration(),
      thumbnail:    { src: this.#currentPlayer.getThumbnailSrc(), class: this.#currentPlayer.getThumbnailClass() },
    };
  }
}
