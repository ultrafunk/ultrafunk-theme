//
// Event logging and matching
//
// https://ultrafunk.com
//


import * as debugLogger from '../shared/debuglogger.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('eventlogger');

export const SOURCE = {
// Default source
  UNKNOWN: 1000,
// interaction.js event sources
  KEYBOARD: 100,
  MOUSE:    110,
// Playback event sources
  YOUTUBE:    1,
  SOUNDCLOUD: 2,
  ULTRAFUNK:  50,
};

export const EVENT = {
// Default event
  UNKNOWN:         -2000,
// interaction.js event types
  KEY_ARROW_LEFT:  180,
  KEY_ARROW_RIGHT: 181,
  MOUSE_CLICK:     182,
// Playback event types
  STATE_ERROR:     -5,
  STATE_UNSTARTED: -1, // YT.PlayerState.UNSTARTED
  STATE_ENDED:     0,  // YT.PlayerState.ENDED
  STATE_PLAYING:   1,  // YT.PlayerState.PLAYING
  STATE_PAUSED:    2,  // YT.PlayerState.PAUSED
  STATE_BUFFERING: 3,  // YT.PlayerState.BUFFERING
  STATE_CUED:      5,  // YT.PlayerState.CUED
  RESUME_AUTOPLAY: 50,
  PLAYER_ERROR:    60,
  CROSSFADE_START: 70,
};

const entry = {
  eventSource: SOURCE.UNKNOWN,
  eventType:   EVENT.UNKNOWN,
  uId:         null,
  timeStamp:   0,
};


// ************************************************************************************************
// EventLog parent class
// ************************************************************************************************

class EventLog
{
  constructor(maxEntries = 10)
  {
    this.log        = [];
    this.maxEntries = maxEntries;
    this.lastPos    = 0;
    this.matchCount = 0;
  }

  add(eventSource, eventType, uId, timeStamp = Date.now())
  {
    const logEntry = Object.create(entry);

    logEntry.eventSource = eventSource;
    logEntry.eventType   = eventType;
    logEntry.uId         = uId;
    logEntry.timeStamp   = timeStamp;

    // Simple and inefficient, but good enough...
    if (this.log.length < this.maxEntries)
    {
      this.log.push(logEntry);
    }
    else
    {
      this.log.shift();
      this.log.push(logEntry);
    }
  }

  clear()
  {
    this.log = [];
  }

  initMatch()
  {
    this.lastPos    = this.log.length - 1;
    this.matchCount = 0;
  }

  matchesEvent(index, eventSource, eventType, uId = null)
  {
    if ((this.log[this.lastPos - index].eventSource === eventSource) &&
        (this.log[this.lastPos - index].eventType   === eventType)   &&
        (this.log[this.lastPos - index].uId         === uId))
    {
      this.matchCount++;
    }
  }

  matchesDelta(elements, delta)
  {
    if ((this.log[this.lastPos].timeStamp - this.log[this.lastPos - elements].timeStamp) <= delta)
      this.matchCount++;
  }

  isPatternMatch(matchCount, event)
  {
    if (this.matchCount === matchCount)
    {
      debug.log(`MATCH for: ${event}`);
      debug.logEventLog(this.log, SOURCE, EVENT);

      return true;
    }

    return false;
  }
}


// ************************************************************************************************
// Interaction child class
// ************************************************************************************************

export class Interaction extends EventLog
{
  doubleClicked(eventSource, eventType, deltaTime)
  {
    this.initMatch();

    if (this.lastPos >= 1)
    {
      this.matchesEvent(1, eventSource, eventType);
      this.matchesEvent(0, eventSource, eventType);
      this.matchesDelta(1, deltaTime);
    }

    return this.isPatternMatch(3, `${debug.getKeyForValue(SOURCE, eventSource)} Double Clicked`);
  }
}


// ************************************************************************************************
// Playback child class
// ************************************************************************************************

export class Playback extends EventLog
{
  ytAutoplayBlocked(uId, deltaTime)
  {
    this.initMatch();

    if (this.lastPos >= 3)
    {
      this.matchesEvent(3, SOURCE.ULTRAFUNK, EVENT.RESUME_AUTOPLAY, null);
      this.matchesEvent(2, SOURCE.YOUTUBE,   EVENT.STATE_UNSTARTED, uId);
      this.matchesEvent(1, SOURCE.YOUTUBE,   EVENT.STATE_BUFFERING, uId);
      this.matchesEvent(0, SOURCE.YOUTUBE,   EVENT.STATE_UNSTARTED, uId);
      this.matchesDelta(3, deltaTime);
    }

    return this.isPatternMatch(5, 'YouTube Autoplay Blocked');
  }

  scAutoplayBlocked(uId, deltaTime)
  {
    this.initMatch();

    if (this.lastPos >= 3)
    {
      this.matchesEvent(3, SOURCE.ULTRAFUNK,  EVENT.RESUME_AUTOPLAY, null);
      this.matchesEvent(2, SOURCE.SOUNDCLOUD, EVENT.STATE_PLAYING,   uId);
      this.matchesEvent(1, SOURCE.SOUNDCLOUD, EVENT.STATE_PAUSED,    uId);
      this.matchesEvent(0, SOURCE.SOUNDCLOUD, EVENT.STATE_PAUSED,    uId);
      this.matchesDelta(3, deltaTime);
    }

    return this.isPatternMatch(5, 'SoundCloud Autoplay Blocked');
  }

  scWidgetPlayBlocked(uId, deltaTime)
  {
    this.initMatch();

    if (this.lastPos >= 2)
    {
      this.matchesEvent(2, SOURCE.SOUNDCLOUD, EVENT.STATE_PLAYING, uId);
      this.matchesEvent(1, SOURCE.SOUNDCLOUD, EVENT.STATE_PAUSED,  uId);
      this.matchesEvent(0, SOURCE.SOUNDCLOUD, EVENT.STATE_PAUSED,  uId);
      this.matchesDelta(2, deltaTime);
    }

    return this.isPatternMatch(4, 'SoundCloud WidgetPlay Blocked');
  }

  scPlayDoubleTrigger(uId, deltaTime)
  {
    this.initMatch();

    if (this.lastPos >= 2)
    {
      this.matchesEvent(2, SOURCE.ULTRAFUNK,  EVENT.CROSSFADE_START, null);
      this.matchesEvent(1, SOURCE.SOUNDCLOUD, EVENT.STATE_PLAYING,   uId);
      this.matchesEvent(0, SOURCE.SOUNDCLOUD, EVENT.STATE_PLAYING,   uId);
      this.matchesDelta(1, deltaTime);
    }

    return this.isPatternMatch(4, 'SoundCloud Play Double Trigger');
  }
}
