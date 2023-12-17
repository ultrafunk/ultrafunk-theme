//
// Gallery players module
//
// https://ultrafunk.com
//


import { newDebugLogger }     from '../../shared/debuglogger.js';
import { crossfadeClosure }   from './crossfade.js';
import { settings }           from '../../shared/session-data.js';
import { EVENT, addListener } from '../common/playback-events.js';


/*************************************************************************************************/


const debug = newDebugLogger('gallery-players');


// ************************************************************************************************
// Gallery players closure
// ************************************************************************************************

export const galleryPlayers = (() =>
{
  let crossfade      = null;
  const mediaPlayers = [];
  const indexMap     = new Map();
  let playerIndex    = 0;

  return {
    indexMap,
    get crossfade()                 { return crossfade;                            },
    get current()                   { return mediaPlayers[playerIndex];            },
    get next()                      { return mediaPlayers[playerIndex + 1];        },
    getPlayerIndex()                { return playerIndex;                          },
    setPlayerIndex(nextPlayerIndex) { playerIndex = nextPlayerIndex;               },
    getTrackType()                  { return this.current.getTrackType();          },
    getNumTracks()                  { return mediaPlayers.length;                  },
    getCurrentTrack()               { return playerIndex + 1;                      },
    playerFromIframeId(iframeId)    { return mediaPlayers[indexMap.get(iframeId)]; },
    trackNumFromIframeId(iframeId)  { return (indexMap.get(iframeId) + 1);         },
    isCurrent(iframeId)             { return (iframeId === this.current.getIframeId()); },
    init,
    add,
    stop,
    mute,
    getTrackData,
    prevTrack,
    nextTrack,
    gotoTrackNum,
  };

  function init()
  {
    debug.log('init()');

    crossfade = crossfadeClosure(this);

    addListener(EVENT.MEDIA_PLAYING, () => crossfade.start());
    addListener(EVENT.MEDIA_PAUSED,  () => crossfade.stop());
  }

  function add(player)
  {
    debug.log(player);

    mediaPlayers.push(player);
    indexMap.set(player.getIframeId(), mediaPlayers.length - 1);
  }

  function stop()
  {
    this.current.stop();
    crossfade.stop();
  }

  function mute()
  {
    this.current.mute(settings.playback.masterMute);
    crossfade.mute(settings.playback.masterMute);
  }

  function getTrackData()
  {
    return {
      currentTrack: this.getCurrentTrack(),
      numTracks:    this.getNumTracks(),
      artist:       this.current.getArtist(),
      title:        this.current.getTitle(),
      duration:     this.current.getDuration(),
      thumbnail:    { src: this.current.getThumbnailSrc(), class: this.current.getThumbnailClass() },
    };
  }

  function prevTrack()
  {
    if (playerIndex > 0)
    {
      playerIndex--;
      return true;
    }

    return false;
  }

  function nextTrack()
  {
    playerIndex++;

    if (playerIndex < this.getNumTracks())
      return true;

    return false;
  }

  function gotoTrackNum(trackNum)
  {
    if ((trackNum > 0) && (trackNum <= this.getNumTracks()))
    {
      playerIndex = trackNum - 1;
      return true;
    }

    return false;
  }
});
