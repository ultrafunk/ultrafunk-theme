//
// Playback UI controls
//
// https://ultrafunk.com
//


import * as debugLogger        from '../shared/debuglogger.js';
import { settings }            from '../shared/session-data.js';
import { EVENT, addListener }  from './playback-events.js';
import { addSettingsObserver } from '../shared/storage.js';
import { getTimeString }       from '../shared/utils.js';

import {
  playerType as playerTypeToggle
} from './footer-toggles.js';

import {
  STATE,
  ElementWrapper
} from './element-wrappers.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('playback-controls');
const m     = { players: {} };
const ctrl  = {};


// ************************************************************************************************
// Init and make ready all controls
// ************************************************************************************************

export function init(mediaPlayers, seekClickCallback)
{
  debug.log('init()');

  m.players = mediaPlayers;

  const playbackProgress = document.getElementById('progress-controls');

  if (playbackProgress !== null)
  {
    ctrl.progressSeek = new ElementWrapper('.progress-seek-control', playbackProgress);
    ctrl.progressSeek.clickCallback = seekClickCallback;
    ctrl.progressBar  = new ElementWrapper('.progress-bar-control', playbackProgress);
  }
  else
  {
    debug.error('init(): Unable to getElementById() for #progress-controls');
  }

  const playbackControls = document.getElementById('playback-controls');

  if (playbackControls !== null)
  {
    ctrl.details        = new ElementWrapper('.playback-details-control', playbackControls);
    ctrl.details.artist = ctrl.details.getElement('.playback-details-artist');
    ctrl.details.title  = ctrl.details.getElement('.playback-details-title');
    
    ctrl.thumbnail     = new ElementWrapper('.playback-thumbnail-control', playbackControls);
    ctrl.thumbnail.img = ctrl.thumbnail.getElement('img');
    
    ctrl.timer                 = new ElementWrapper('.playback-timer-control', playbackControls);
    ctrl.timer.position        = ctrl.timer.getElement('.playback-timer-position');
    ctrl.timer.duration        = ctrl.timer.getElement('.playback-timer-duration');
    ctrl.timer.positionSeconds = -1; // Make sure initial value is set + shown when track plays
    ctrl.timer.durationSeconds = -1; // Make sure initial value is set + shown when track plays
      
    ctrl.playerType = new ElementWrapper('.playback-player-type-control', playbackControls);
    ctrl.prevTrack  = new ElementWrapper('.playback-prev-control', playbackControls);
    
    ctrl.playPause      = new ElementWrapper('.playback-play-pause-control', playbackControls);
    ctrl.playPause.icon = ctrl.playPause.getElement('span.material-icons');
    
    ctrl.nextTrack = new ElementWrapper('.playback-next-control', playbackControls);
    
    ctrl.repeat      = new ElementWrapper('.playback-repeat-control', playbackControls);
    ctrl.repeat.icon = ctrl.repeat.getElement('span.material-icons');
    
    ctrl.shuffle = new ElementWrapper('.playback-shuffle-control', playbackControls);
    
    ctrl.mute      = new ElementWrapper('.playback-mute-control', playbackControls);
    ctrl.mute.icon = ctrl.mute.getElement('span.material-icons');
  }
  else
  {
    debug.error('init(): Unable to getElementById() for #playback-controls');
  }
}

export function ready(prevClickCallback, playPauseClickCallback, nextClickCallback, muteClickCallback)
{
  debug.log('ready()');

  ctrl.progressSeek.setState(STATE.ENABLED);
  ctrl.progressSeek.addListener('click', progressSeekClick);
  ctrl.progressBar.setState(STATE.ENABLED);
  
  ctrl.details.setState(STATE.HIDDEN);
  ctrl.thumbnail.setState(STATE.HIDDEN);
  ctrl.timer.setState(STATE.HIDDEN);

  if (settings.mobile.showTrackThumbnail)
    ctrl.thumbnail.addClass('show-on-mobile');

  if (settings.mobile.showTrackTimes)
    ctrl.timer.addClass('show-on-mobile');

  ctrl.playerType.setState(STATE.ENABLED);
  ctrl.playerType.addListener('click', () => playerTypeToggle.toggle());

  ctrl.prevTrack.setState((m.players.getCurrentTrack() > 1) ? STATE.ENABLED : STATE.DISABLED);
  ctrl.prevTrack.addListener('click', prevClickCallback);

  ctrl.playPause.setState(STATE.PAUSED);
  ctrl.playPause.addListener('click', playPauseClickCallback);

  ctrl.nextTrack.setState((m.players.getNumTracks() > 1) ? STATE.ENABLED : STATE.DISABLED);
  ctrl.nextTrack.addListener('click', () => nextClickCallback());

  ctrl.repeat.setState(STATE.ENABLED);
  ctrl.repeat.addListener('click', toggleRepeat);

  ctrl.shuffle.setState(STATE.ENABLED);

  ctrl.mute.setState(STATE.ENABLED);
  ctrl.mute.addListener('click', () => muteClickCallback());
  updateMuteState();

  addSettingsObserver('autoplay',   updateAutoplayState);
  addSettingsObserver('masterMute', updateMuteState);

  addListener(EVENT.MEDIA_LOADING,     setLoadState);
  addListener(EVENT.MEDIA_PLAYING,     setPlayState);
  addListener(EVENT.MEDIA_PAUSED ,     setPauseState);
  addListener(EVENT.MEDIA_ENDED,       setMediaEndState);
  addListener(EVENT.AUTOPLAY_BLOCKED,  setPauseState);
  addListener(EVENT.PLAYBACK_BLOCKED,  setPauseState);
  addListener(EVENT.MEDIA_UNAVAILABLE, setPauseState);
}


// ************************************************************************************************
// Progress bar and position seek
// ************************************************************************************************

export function updateProgressPercent(progressPercent)
{
  updateProgressBar(progressPercent / 100);
}

function updateProgressBar(scaleX)
{
  ctrl.progressBar.style.transform = `scaleX(${scaleX})`;
}

export function updateTimerAndProgress(positionMilliseconds, positionSeconds, durationSeconds)
{
  setTimer(positionSeconds, durationSeconds);

  // Prevent division by zero
  if (durationSeconds === 0)
    updateProgressBar(0);
  else
    updateProgressBar(positionMilliseconds / (durationSeconds * 1000));
}

function progressSeekClick(event)
{
  if (ctrl.timer.durationSeconds > 0)
  {
    const progressPercent = ((event.clientX / document.documentElement.clientWidth) * 100);
    const seekPosSeconds  = Math.round((ctrl.timer.durationSeconds * progressPercent) / 100);
    ctrl.progressSeek.clickCallback(seekPosSeconds);

    if (isPlaying() === false)
    {
      updateProgressPercent(progressPercent);
      setTimer(seekPosSeconds, ctrl.timer.durationSeconds);
    }
  }
}


// ************************************************************************************************
// Details (Artist + Title) and track timer
// ************************************************************************************************

function setDetails(trackData)
{
  if (ctrl.details.state.ID === STATE.HIDDEN.ID)
  {
    ctrl.details.setState(STATE.ENABLED);
    ctrl.thumbnail.setState(STATE.ENABLED);
    ctrl.timer.setState(STATE.ENABLED);
    clearTimer(trackData);
  }

  ctrl.details.artist.textContent = trackData.artist || ''; // Artist will contain the post title if all else fails
  ctrl.details.title.textContent  = trackData.title  || '';
  
  setThumbnail(trackData.thumbnail);
  setTimerDisplayHoursMinutes(trackData.duration);
  setTimer((isPlaying() ? ctrl.timer.positionSeconds : 0), trackData.duration);
}

function setThumbnail(thumbnail)
{
  // Don't set thumbnail again if the image source / URL is unchanged
  if (thumbnail.src !== ctrl.thumbnail.img.src)
  {
    ctrl.thumbnail.removeClass('type-default', 'type-youtube', 'type-soundcloud');
    ctrl.thumbnail.addClass('loading', thumbnail.class);
    ctrl.thumbnail.img.src = thumbnail.src;
    ctrl.thumbnail.img.decode().then(() => ctrl.thumbnail.removeClass('loading'));
  }
}

function setTimerDisplayHoursMinutes(durationSeconds)
{
  (durationSeconds > 3600)
    ? ctrl.timer.replaceClass('display-minutes', 'display-hours')
    : ctrl.timer.replaceClass('display-hours', 'display-minutes');
}

function setTimer(positionSeconds, durationSeconds)
{
  if (ctrl.timer.positionSeconds !== positionSeconds)
  {
    ctrl.timer.positionSeconds = positionSeconds;

    if (settings.playback.autoplay === false)
      positionSeconds = (durationSeconds - positionSeconds);
    
    ctrl.timer.position.textContent = getTimeString(positionSeconds, (durationSeconds > 3600));
  }

  if (ctrl.timer.durationSeconds !== durationSeconds)
  {
    ctrl.timer.durationSeconds      = durationSeconds;
    ctrl.timer.duration.textContent = getTimeString(durationSeconds, (durationSeconds > 3600));
  }
}

function clearTimer(trackData)
{
  ctrl.timer.position.textContent = settings.playback.autoplay
    ? (trackData.duration > 3600) ? '00:00:00' : '00:00'
    : getTimeString(trackData.duration, (trackData.duration > 3600));

  ctrl.timer.duration.textContent = (trackData.duration > 3600) ? '00:00:00' : '00:00';
  ctrl.timer.positionSeconds = -1;
  ctrl.timer.durationSeconds = -1;
}


// ************************************************************************************************
// Playback controls (prev, play/pause and next)
// ************************************************************************************************

export function isPlaying()
{
  // ToDo: This might not be the best place to save / check playback state...?
  return ((ctrl.playPause.state.ID === STATE.PLAYING.ID) ? true : false);    
}

function setLoadState()
{
  if (ctrl.thumbnail.state.ID === STATE.ENABLED.ID)
    ctrl.thumbnail.addClass(STATE.LOADING.CLASS);
}

function setMediaEndState()
{
  updateProgressBar(0);
  setTimer(0, m.players.getTrackData().duration);
}

export function setPlayState()
{
  ctrl.thumbnail.removeClass(STATE.LOADING.CLASS);
  ctrl.playPause.setState(STATE.PLAYING);
  ctrl.playPause.icon.textContent = 'pause_circle_filled';
  ctrl.prevTrack.setState(STATE.ENABLED);
  
  setDetails(m.players.getTrackData());
}

export function setPauseState()
{
  ctrl.thumbnail.removeClass(STATE.LOADING.CLASS);
  ctrl.playPause.setState(STATE.PAUSED);
  ctrl.playPause.icon.textContent = 'play_circle_filled';
}

export function blinkPlayPause(toggleBlink)
{
  if (toggleBlink)
    ctrl.playPause.toggleClass('time-remaining-warning');
  else
    ctrl.playPause.removeClass('time-remaining-warning');
}

export function getSetTrackData()
{
  const trackData = m.players.getTrackData();

  clearTimer(trackData);
  setDetails(trackData);

  return trackData;
}

export function updatePrevState()
{
  const trackData = getSetTrackData();
  
  if ((isPlaying() === false) && (trackData.currentTrack <= 1))
    ctrl.prevTrack.setState(STATE.DISABLED);
  
  if (trackData.currentTrack < trackData.numTracks)
    ctrl.nextTrack.setState(STATE.ENABLED);
}

export function updateNextState()
{
  const trackData = getSetTrackData();

  ctrl.prevTrack.setState(STATE.ENABLED);
  
  if (trackData.currentTrack >= trackData.numTracks)
    ctrl.nextTrack.setState(STATE.DISABLED);
}


// ************************************************************************************************
// Repeat control
// ************************************************************************************************

export const REPEAT = { OFF: 0, ALL: 1, ONE: 2 };

const repeatModes = [
  { title: 'Repeat Off', icon: 'repeat'     },
  { title: 'Repeat All', icon: 'repeat'     },
  { title: 'Repeat One', icon: 'repeat_one' },
];

export function getRepeatMode()
{
  return parseInt(ctrl.repeat.getAttribute('data-repeat-mode'));
}

export function toggleRepeat()
{
  const index = ((getRepeatMode() + 1) < repeatModes.length)
                  ? (getRepeatMode() + 1)
                  : 0;

  ctrl.repeat.setAttribute('data-repeat-mode', index);
  ctrl.repeat.elementTitle     = `${repeatModes[index].title} (r)`;
  ctrl.repeat.icon.textContent = repeatModes[index].icon;

  return repeatModes[index];
}


// ************************************************************************************************
// Set Mute control and Autoplay states
// ************************************************************************************************

function updateMuteState()
{
  ctrl.mute.icon.textContent = settings.playback.masterMute ? 'volume_off' : 'volume_up';
}

function updateAutoplayState()
{
  const position = ctrl.timer.positionSeconds;
  const duration = ctrl.timer.durationSeconds;

  if ((isPlaying() === false) && (position !== -1) && ((duration !== -1)))
  {
    ctrl.timer.position.textContent = settings.playback.autoplay
      ? getTimeString(position, (duration > 3600))
      : getTimeString((duration - position), (duration > 3600));

    ctrl.timer.duration.textContent = getTimeString(duration, (duration > 3600));
  }
}
