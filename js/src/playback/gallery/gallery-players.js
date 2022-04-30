//
// Gallery players module
//
// https://ultrafunk.com
//


import * as debugLogger       from '../../shared/debuglogger.js';
import { crossfadeClosure }   from './crossfade.js';
import { settings }           from '../../shared/session-data.js';
import { EVENT, addListener } from '../playback-events.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('gallery-players');


// ************************************************************************************************
// Gallery players closure
// ************************************************************************************************

export const galleryPlayers = (() =>
{
  let playTrack      = null;
  let crossfade      = null;
  const mediaPlayers = [];
  const indexMap     = new Map();
  let playerIndex    = 0;

  return {
    indexMap,
    get crossfade()                 { return crossfade;                       },
    get current()                   { return mediaPlayers[playerIndex];       },
    get next()                      { return mediaPlayers[playerIndex + 1];   },
    getPlayerIndex()                { return playerIndex;                     },
    setPlayerIndex(nextPlayerIndex) { playerIndex = nextPlayerIndex;          },
    getNumTracks()                  { return mediaPlayers.length;             },
    getCurrentTrack()               { return playerIndex + 1;                 },
    playerFromUid(uId)              { return mediaPlayers[indexMap.get(uId)]; },
    trackFromUid(uId)               { return (indexMap.get(uId) + 1);         },
    isCurrent(uId)                  { return (uId === this.current.getUid()); },
    init,
    add,
    uIdFromIframeId,
    stop,
    mute,
    getTrackData,
    prevTrack,
    nextTrack,
    jumpToTrack,
  };

  function init(playTrackCallback)
  {
    debug.log('init()');

    playTrack = playTrackCallback;
    crossfade = crossfadeClosure(this);

    addListener(EVENT.MEDIA_PLAYING, () => crossfade.start());
    addListener(EVENT.MEDIA_PAUSED,  () => crossfade.stop());
  }

  function add(player)
  {
    debug.log(player);
    
    mediaPlayers.push(player);
    indexMap.set(player.getUid(), mediaPlayers.length - 1);
  }

  function uIdFromIframeId(iframeId)
  {
    return mediaPlayers.find(player => (player.iframeId === iframeId)).getUid();
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

  function prevTrack(playMedia)
  {
    if (playerIndex > 0)
    {
      playerIndex--;
      playTrack(playMedia);
      return true;
    }
    
    return false;
  }
  
  function nextTrack(playMedia)
  {
    playerIndex++;
    
    if (playerIndex < this.getNumTracks())
    {
      playTrack(playMedia);
      return true;
    }
    
    return false;
  }
  
  function jumpToTrack(track, playMedia, scrollToMedia = true)
  {
    if ((track > 0) && (track <= this.getNumTracks()))
    {
      playerIndex = track - 1;
      playTrack(playMedia, scrollToMedia);
      return true;
    }
  
    return false;
  }
});
