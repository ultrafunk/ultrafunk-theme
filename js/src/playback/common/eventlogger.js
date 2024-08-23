//
// Event logging and matching classes
//
// https://ultrafunk.com
//


import { newDebugLogger } from '../../shared/debuglogger.js';


/*************************************************************************************************/


const debug = newDebugLogger('eventlogger');


// ************************************************************************************************
// EventLog base class
// ************************************************************************************************

class EventLog
{
  SOURCE = {
  // Default source
    UNKNOWN: -10000,
  // Playback event sources
    YOUTUBE:    1,
    SOUNDCLOUD: 2,
    LOCAL:      3,
    ULTRAFUNK:  50,
  // Interaction event sources
  //KEYBOARD: 1010,
    MOUSE:    1020,
  };

  EVENT = {
  // Default event
    UNKNOWN:         -10000,
  // Playback event types
    STATE_ERROR:     -5,
    STATE_UNSTARTED: -1,  // YT.PlayerState.UNSTARTED
    STATE_ENDED:      0,  // YT.PlayerState.ENDED
    STATE_PLAYING:    1,  // YT.PlayerState.PLAYING
    STATE_PAUSED:     2,  // YT.PlayerState.PAUSED
    STATE_BUFFERING:  3,  // YT.PlayerState.BUFFERING
    STATE_CUED:       5,  // YT.PlayerState.CUED
    RESUME_AUTOPLAY: 50,
    PLAYER_ERROR:    60,
    CROSSFADE_START: 70,
  // Interaction event types
  //KEY_ARROW_LEFT:  1010,
  //KEY_ARROW_RIGHT: 1020,
    MOUSE_CLICK:     1030,
  };

  #log        = [];
  #maxEntries = 0;
  #matchCount = 0;
  #lastPos    = 0;

  constructor(maxEntries = 10)
  {
    this.#maxEntries = maxEntries;
  }

  add(eventSource = this.SOURCE.UNKNOWN, eventType = this.EVENT.UNKNOWN, uId = null, timestamp = Date.now())
  {
    if (this.#log.length >= this.#maxEntries)
      this.#log.shift();

    this.#log.push({
      eventSource: eventSource,
      eventType:   eventType,
      uId:         uId,
      timestamp:   timestamp,
    });
  }

  clear()      { this.#log = [];       }
  getLastPos() { return this.#lastPos; }

  initMatch()
  {
    this.#lastPos    = this.#log.length - 1;
    this.#matchCount = 0;
  }

  matchesEvent(index, eventSource, eventType, uId = null)
  {
    if ((this.#log[this.#lastPos - index].eventSource === eventSource) &&
        (this.#log[this.#lastPos - index].eventType   === eventType)   &&
        (this.#log[this.#lastPos - index].uId         === uId))
    {
      this.#matchCount++;
    }
  }

  matchesDelta(elements, delta)
  {
    if ((this.#log[this.#lastPos].timestamp - this.#log[this.#lastPos - elements].timestamp) <= delta)
      this.#matchCount++;
  }

  isPatternMatch(matchCount, event)
  {
    if (this.#matchCount === matchCount)
    {
      debug.log(`MATCH for: ${event}`);
      this.logEventMatch();

      return true;
    }

    return false;
  }

  logEventMatch()
  {
    const entries = [];

    this.#log.forEach((entry) =>
    {
      entries.push({
        eventSource: debug.getKeyForValue(this.SOURCE, entry.eventSource),
        eventType:   debug.getKeyForValue(this.EVENT,  entry.eventType),
        uId:         entry.uId,
        timestamp:   entry.timestamp,
      });
    });

    debug.log(entries);
  }
}


// ************************************************************************************************
// Child classes
// ************************************************************************************************

export class PlaybackLog extends EventLog
{
  scAutoplayBlocked(uId, deltaTime)
  {
    this.initMatch();

    if (this.getLastPos() >= 3)
    {
      this.matchesEvent(3, this.SOURCE.ULTRAFUNK,  this.EVENT.RESUME_AUTOPLAY, null);
      this.matchesEvent(2, this.SOURCE.SOUNDCLOUD, this.EVENT.STATE_PLAYING,   uId);
      this.matchesEvent(1, this.SOURCE.SOUNDCLOUD, this.EVENT.STATE_PAUSED,    uId);
      this.matchesEvent(0, this.SOURCE.SOUNDCLOUD, this.EVENT.STATE_PAUSED,    uId);
      this.matchesDelta(3, deltaTime);
    }

    return this.isPatternMatch(5, 'SoundCloud Autoplay Blocked');
  }

  scPlayDoubleTrigger(uId, deltaTime)
  {
    this.initMatch();

    if (this.getLastPos() >= 2)
    {
      this.matchesEvent(2, this.SOURCE.ULTRAFUNK,  this.EVENT.CROSSFADE_START, null);
      this.matchesEvent(1, this.SOURCE.SOUNDCLOUD, this.EVENT.STATE_PLAYING,   uId);
      this.matchesEvent(0, this.SOURCE.SOUNDCLOUD, this.EVENT.STATE_PLAYING,   uId);
      this.matchesDelta(1, deltaTime);
    }

    return this.isPatternMatch(4, 'SoundCloud Play Double Trigger');
  }
}

export class InteractionLog extends EventLog
{
  doubleClicked(eventSource, eventType, deltaTime)
  {
    this.initMatch();

    if (this.getLastPos() >= 1)
    {
      this.matchesEvent(1, eventSource, eventType);
      this.matchesEvent(0, eventSource, eventType);
      this.matchesDelta(1, deltaTime);
    }

    return this.isPatternMatch(3, `${debug.getKeyForValue(this.SOURCE, eventSource)} Double Clicked`);
  }
}
