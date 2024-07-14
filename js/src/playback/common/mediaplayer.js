//
// MediaPlayer base class
//
// https://ultrafunk.com
//


import {
  IS_PROD_BUILD,
  THEME_ENV,
} from '../../config.js';


/*************************************************************************************************/


export const TRACK_TYPE = {
  NONE:       0,
  YOUTUBE:    1,
  SOUNDCLOUD: 2,
  LOCAL:      3,
};


// ************************************************************************************************
// Class definition
// ************************************************************************************************

export class MediaPlayer
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

  // YouTube and SoundCloud players have the exact same functions for seekTo() and setVolume()
  seekTo(position)  { this.#embeddedPlayer.seekTo(position);  }
  setVolume(volume) { this.#embeddedPlayer.setVolume(volume); }

  setArtistAndTitle(artist, title)
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
// MediaPlayer support functions
// ************************************************************************************************

// Default / fallback track thumbnail object
const defThumbnailObj = { src: THEME_ENV.defaultTrackThumbnail, class: 'type-default', uid: '' };

// https://webapps.stackexchange.com/a/101153
const youTubeVideoIdRegEx = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/;

export function getYouTubeThumbnailUrl(trackSourceUrl)
{
  const youTubeVideoId = trackSourceUrl.match(youTubeVideoIdRegEx);

  if (youTubeVideoId !== null)
    return { src: `https://i.ytimg.com/vi/${youTubeVideoId[0]}/default.jpg`, class: 'type-youtube', uid: youTubeVideoId[0] };

  return defThumbnailObj;
}

export function getSoundCloudThumbnailUrl(soundObject)
{
  const thumbnailSrc = (soundObject.artwork_url !== null)
                         ? soundObject.artwork_url
                         : soundObject.user.avatar_url;

  if (thumbnailSrc)
    return { src: thumbnailSrc, class: 'type-soundcloud', uid: '' };

  return defThumbnailObj;
}

export function getThumbnailData(metaData)
{
  if (metaData.track_source_type === TRACK_TYPE.YOUTUBE)
    return getYouTubeThumbnailUrl(metaData.track_source_data);

  if (metaData.track_source_type === TRACK_TYPE.SOUNDCLOUD)
    return { src: THEME_ENV.defaultSCThumbnail, class: 'type-soundcloud', uid: '' };

  if (metaData.track_source_type === TRACK_TYPE.LOCAL)
    return { src: THEME_ENV.defaultLTThumbnail, class: 'type-local', uid: metaData.track_source_data };
}

export function getTrackTypeData(trackType, thumbnailUrl)
{
  const isPlayableTrack = ((trackType === TRACK_TYPE.YOUTUBE) || (trackType === TRACK_TYPE.LOCAL));

  if (trackType === TRACK_TYPE.YOUTUBE)
    thumbnailUrl = IS_PROD_BUILD ? thumbnailUrl : THEME_ENV.defaultYTThumbnail;

  return { isPlayableTrack: isPlayableTrack, thumbnailUrl: thumbnailUrl };
}

export function getDataTrackType(element)
{
  const trackType = element.getAttribute('data-track-type');

  if (trackType !== null)
    return parseInt(trackType);

  return TRACK_TYPE.NONE;
}

const trackTypeClasses = [
  'type-default',
  'type-youtube',
  'type-soundcloud',
  'type-local',
];

export function getTrackTypeClass(element)
{
  return trackTypeClasses[getDataTrackType(element)];
}
