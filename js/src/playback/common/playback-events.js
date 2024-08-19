//
// Playback events module
//
// https://ultrafunk.com
//


import { newDebugLogger }        from '../../shared/debuglogger.js';
import { updateProgressPercent } from './playback-controls.js';


/*************************************************************************************************/


const debug = newDebugLogger('playback-events');
export let hasPlaybackStarted = false;

export const EVENT = {
  PLAYBACK_LOADING:     'playbackLoading',
  PLAYBACK_READY:       'playbackReady',
  MEDIA_LOADING:        'mediaLoading',
  MEDIA_PLAYING:        'mediaPlaying',
  MEDIA_PAUSED:         'mediaPaused',
  MEDIA_ENDED:          'mediaEnded',
  MEDIA_CUE_TRACK:      'mediaCueTrack',
  MEDIA_PREV_TRACK:     'mediaPrevTrack',
  MEDIA_NEXT_TRACK:     'mediaNextTrack',
  MEDIA_TIME_REMAINING: 'mediaTimeRemaining',
  MEDIA_UNAVAILABLE:    'mediaUnavailable',
  CONTINUE_AUTOPLAY:    'continueAutoplay',
  RESUME_AUTOPLAY:      'resumeAutoplay',
  AUTOPLAY_BLOCKED:     'autoplayBlocked',
};

const eventListeners = {
  [EVENT.PLAYBACK_LOADING]:     [ (playbackEvent) => updateProgressPercent(playbackEvent.data.loadingPercent) ],
  [EVENT.PLAYBACK_READY]:       [ playbackReady ],
  [EVENT.MEDIA_LOADING]:        [],
  [EVENT.MEDIA_PLAYING]:        [ () => (hasPlaybackStarted = true) ],
  [EVENT.MEDIA_PAUSED]:         [],
  [EVENT.MEDIA_ENDED]:          [],
  [EVENT.MEDIA_CUE_TRACK]:      [ () => (hasPlaybackStarted = false) ],
  [EVENT.MEDIA_PREV_TRACK]:     [ (playbackEvent) => debug.log(playbackEvent) ],
  [EVENT.MEDIA_NEXT_TRACK]:     [ (playbackEvent) => debug.log(playbackEvent) ],
  [EVENT.MEDIA_TIME_REMAINING]: [],
  [EVENT.MEDIA_UNAVAILABLE]:    [],
  [EVENT.CONTINUE_AUTOPLAY]:    [],
  [EVENT.RESUME_AUTOPLAY]:      [],
  [EVENT.AUTOPLAY_BLOCKED]:     [],
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

  // Prevents fractional pixel "extra" 1px bottom border
  document.querySelector('.wp-block-embed__wrapper').style = 'background-color: var(--body-background-color)';

  if (playbackEvent?.data.resetProgressBar)
    updateProgressPercent(0);
}
