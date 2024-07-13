//
// List player classes
//
// https://ultrafunk.com
//


import {
  TRACK_TYPE,
  MediaPlayer,
  getYouTubeThumbnailUrl,
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

  pause()       { this.embedded.pauseVideo();            }
  stop()        { this.embedded.stopVideo();             }
  mute()        { this.embedded.mute();                  }
  unMute()      { this.embedded.unMute();                }
  isMuted()     { return this.embedded.isMuted();        }
  getPosition() { return this.embedded.getCurrentTime(); }
  getVolume()   { return this.embedded.getVolume();      }

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
  constructor(embeddedPlayer)
  {
    super(TRACK_TYPE.SOUNDCLOUD, null, null, embeddedPlayer);
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
    this.embedded.src         = sourceUid;
    this.embedded.currentTime = positionSeconds;
    this.setIsCued(true);
  }

  playTrackById(sourceUid, positionSeconds = 0)
  {
    this.embedded.src         = sourceUid;
    this.embedded.currentTime = positionSeconds;
    this.play();
    this.setIsCued(false);
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

  getPosition()
  {
    return Math.floor(this.embedded.currentTime);
  }

  getDuration()
  {
    return Math.floor(this.embedded.duration);
  }

  seekTo(positionSeconds)
  {
    this.embedded.currentTime = positionSeconds;
  }

  getVolume()
  {
    // Player volume is min 0.0 => 1.0 max, we use 0 => 100
    return Math.round(this.embedded.volume * 100);
  }

  setVolume(volume)
  {
    // Our volume is 0 => 100, player uses min 0.0 => 1.0 max
    this.embedded.volume = (volume / 100);
  }

  setThumbnail(trackElement)
  {
    super.setThumbnail({ src: encodeURI(trackElement.getAttribute('data-track-thumbnail-url')), class: 'type-local' });
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

  constructor(youTubePlayer, soundCloudPlayer = null, localPlayer = null)
  {
    this.#youTubePlayer    = new YouTubePlayer(youTubePlayer);
    this.#soundCloudPlayer = new SoundCloudPlayer(soundCloudPlayer);
    this.#localPlayer      = new LocalPlayer(localPlayer);
    this.#currentPlayer    = this.#youTubePlayer;
  }

  get current()     { return this.#currentPlayer;        }
  get localPlayer() { return this.#localPlayer.embedded; }

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
