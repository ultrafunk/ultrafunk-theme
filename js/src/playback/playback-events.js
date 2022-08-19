//
// Playback events module
//
// https://ultrafunk.com
//


import * as debugLogger          from '../shared/debuglogger.js';
import { updateProgressPercent } from './playback-controls.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('playback-events');
export let hasPlaybackStarted = false;

export const EVENT = {
  PLAYBACK_LOADING:     'playbackLoading',
  PLAYBACK_READY:       'playbackReady',
  MEDIA_LOADING:        'mediaLoading',
  MEDIA_PLAYING:        'mediaPlaying',
  MEDIA_PAUSED:         'mediaPaused',
  MEDIA_ENDED:          'mediaEnded',
  MEDIA_CUE_NEXT:       'mediaCueNext',
//MEDIA_CUED:           'mediaCued',
  MEDIA_TIME_REMAINING: 'mediaTimeRemaining',
  MEDIA_UNAVAILABLE:    'mediaUnavailable',
  CONTINUE_AUTOPLAY:    'continueAutoplay',
  RESUME_AUTOPLAY:      'resumeAutoplay',
  AUTOPLAY_BLOCKED:     'autoplayBlocked',
  PLAYBACK_BLOCKED:     'playbackBlocked',
  CLICKED_PREV_TRACK:   'clickedPrevTrack',
  CLICKED_NEXT_TRACK:   'clickedNextTrack',
};

const eventListeners = {
  [EVENT.PLAYBACK_LOADING]:     [ (playbackEvent) => updateProgressPercent(playbackEvent.data.loadingPercent) ],
  [EVENT.PLAYBACK_READY]:       [ playbackReady ],
  [EVENT.MEDIA_LOADING]:        [],
  [EVENT.MEDIA_PLAYING]:        [ () => (hasPlaybackStarted = true) ],
  [EVENT.MEDIA_PAUSED]:         [],
  [EVENT.MEDIA_ENDED]:          [],
  [EVENT.MEDIA_CUE_NEXT]:       [ () => (hasPlaybackStarted = false) ],
//[EVENT.MEDIA_CUED]:           [],
  [EVENT.MEDIA_TIME_REMAINING]: [],
  [EVENT.MEDIA_UNAVAILABLE]:    [],
  [EVENT.CONTINUE_AUTOPLAY]:    [],
  [EVENT.RESUME_AUTOPLAY]:      [],
  [EVENT.AUTOPLAY_BLOCKED]:     [],
  [EVENT.PLAYBACK_BLOCKED]:     [],
  [EVENT.CLICKED_PREV_TRACK]:   [ (playbackEvent) => debug.log(playbackEvent) ],
  [EVENT.CLICKED_NEXT_TRACK]:   [ (playbackEvent) => debug.log(playbackEvent) ],
};


// ************************************************************************************************
//
// ************************************************************************************************

export function addListener(playbackEvent, playbackEventListener)
{
  if (playbackEvent in eventListeners)
    eventListeners[playbackEvent].push(playbackEventListener);
}

export function dispatch(playbackEvent, playbackEventData = null, playbackEventCallback = null)
{
  eventListeners[playbackEvent].forEach(eventListener =>
  {
    eventListener({
      event:    playbackEvent,
      data:     playbackEventData,
      callback: playbackEventCallback,
    });
  });
}


// ************************************************************************************************
// Default event listeners
// ************************************************************************************************

function playbackReady(playbackEvent)
{
  debug.log(playbackEvent);

  if (playbackEvent?.data.resetProgressBar)
    updateProgressPercent(0);
}
