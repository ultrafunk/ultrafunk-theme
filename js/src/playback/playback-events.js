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
  LOADING:              'loading',
  READY:                'ready',
  MEDIA_LOADING:        'mediaLoading',
  MEDIA_PLAYING:        'mediaPlaying',
  MEDIA_PAUSED:         'mediaPaused',
  MEDIA_ENDED:          'mediaEnded',
  MEDIA_CUE_NEXT:       'mediaCueNext',
  MEDIA_TIME_REMAINING: 'mediaTimeRemaining',
  CONTINUE_AUTOPLAY:    'continueAutoplay',
  RESUME_AUTOPLAY:      'resumeAutoplay',
  AUTOPLAY_BLOCKED:     'autoplayBlocked',
  PLAYBACK_BLOCKED:     'playbackBlocked',
  MEDIA_UNAVAILABLE:    'mediaUnavailable',
};

const eventListeners = {
  [EVENT.LOADING]:              [ (event) => updateProgressPercent(event.data.loadingPercent) ],
  [EVENT.READY]:                [ ready ],
  [EVENT.MEDIA_LOADING]:        [],
  [EVENT.MEDIA_PLAYING]:        [ () => (hasPlaybackStarted = true) ],
  [EVENT.MEDIA_PAUSED]:         [],
  [EVENT.MEDIA_ENDED]:          [],
  [EVENT.MEDIA_CUE_NEXT]:       [ () => (hasPlaybackStarted = false) ],
  [EVENT.MEDIA_TIME_REMAINING]: [],
  [EVENT.CONTINUE_AUTOPLAY]:    [],
  [EVENT.RESUME_AUTOPLAY]:      [],
  [EVENT.AUTOPLAY_BLOCKED]:     [],
  [EVENT.PLAYBACK_BLOCKED]:     [],
  [EVENT.MEDIA_UNAVAILABLE]:    [],
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

function ready(playbackEvent)
{
  debug.log(playbackEvent);

  if (playbackEvent?.data.resetProgressBar)
    updateProgressPercent(0);
}
