//
// Playback UI controls
//
// https://ultrafunk.com
//


import { newDebugLogger }      from '../../shared/debuglogger.js';
import { settings }            from '../../shared/session-data.js';
import { EVENT, addListener }  from './playback-events.js';
import { addSettingsObserver } from '../../shared/storage.js';

import {
  playerType as playerTypeToggle
} from '../../site/footer-toggles.js';

import {
  STATE,
  ElementWrapper,
} from './element-wrappers.js';

import {
  MATCH,
  matchesMedia,
  getTimeString,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug      = newDebugLogger('playback-controls');
const isInIframe = (window.frameElement !== null);
const m          = { getTrackData: null };
const ctrl       = {};


// ************************************************************************************************
// Set user settings controlled CSS as early as possible before init() call
// ************************************************************************************************

export function setPlaybackControlsCss()
{
  ctrl.prevTrack = ElementWrapper('.playback-prev-button');
  ctrl.playPause = ElementWrapper('.playback-play-pause-toggle');

  if (matchesMedia(MATCH.SITE_MAX_WIDTH_MOBILE))
  {
    debug.log('setPlaybackControlsCss(): MATCH.SITE_MAX_WIDTH_MOBILE');

    if (settings.mobile.showPrevTrackButton)
      ctrl.prevTrack.addClass('show-on-mobile');

    if (!settings.mobile.showPrevTrackButton && !settings.mobile.showTrackTimes)
      ctrl.playPause.addClass('mobile-margin-10px');
    else if (settings.mobile.showTrackTimes && !settings.mobile.showPrevTrackButton)
      ctrl.playPause.addClass('mobile-margin-6px');
    else if (settings.mobile.showPrevTrackButton && !settings.mobile.showTrackTimes)
      ctrl.prevTrack.addClass('mobile-margin-3px');
  }
}


// ************************************************************************************************
// Init and make ready all controls
// ************************************************************************************************

export function init(getTrackData, seekClickCallback)
{
  debug.log('init()');

  m.getTrackData = getTrackData;
  const playbackControls = document.getElementById('playback-controls');

  ctrl.progressSeek = ElementWrapper('.progress-seek-control', document.getElementById('progress-controls'));
  ctrl.progressSeek.clickCallback = seekClickCallback;
  ctrl.progressBar  = ElementWrapper('.progress-bar-control', document.getElementById('progress-controls'));

  ctrl.thumbnail     = ElementWrapper('.playback-thumbnail-control', playbackControls);
  ctrl.thumbnail.img = ctrl.thumbnail.getElement('img');

  ctrl.details        = ElementWrapper('.playback-details-control', playbackControls);
  ctrl.details.artist = ctrl.details.getElement('.playback-details-artist');
  ctrl.details.title  = ctrl.details.getElement('.playback-details-title');

  ctrl.timer                 = ElementWrapper('.playback-timer-control', playbackControls);
  ctrl.timer.position        = ctrl.timer.getElement('.playback-timer-position');
  ctrl.timer.duration        = ctrl.timer.getElement('.playback-timer-duration');
  ctrl.timer.positionSeconds = -1; // Make sure initial value is set + shown when track plays
  ctrl.timer.durationSeconds = -1; // Make sure initial value is set + shown when track plays

  ctrl.playerType = ElementWrapper('.playback-player-type-toggle', playbackControls);

  ctrl.playPause.icon = ctrl.playPause.getElement('span.material-icons');

  ctrl.nextTrack = ElementWrapper('.playback-next-button', playbackControls);

  ctrl.repeat      = ElementWrapper('.playback-repeat-toggle', playbackControls);
  ctrl.repeat.icon = ctrl.repeat.getElement('span.material-icons');

  ctrl.shuffle = ElementWrapper('.playback-shuffle-button', playbackControls);

  ctrl.mute      = ElementWrapper('.playback-mute-toggle', playbackControls);
  ctrl.mute.icon = ctrl.mute.getElement('span.material-icons');

  ctrl.volume = ElementWrapper('.playback-volume-control', playbackControls);
}

export function ready(prevClickCallback, playPauseClickCallback, nextClickCallback, muteClickCallback)
{
  ctrl.progressSeek.setState(STATE.ENABLED);
  ctrl.progressSeek.addListener('click', progressSeekClick);
  ctrl.progressBar.setState(STATE.ENABLED);

  ctrl.thumbnail.setState(STATE.HIDDEN);
  ctrl.details.setState(STATE.HIDDEN);
  ctrl.timer.setState(STATE.HIDDEN);

  if (settings.mobile.showTrackThumbnail)
    ctrl.thumbnail.addClass('show-on-mobile');

  if (settings.mobile.showTrackTimes)
    ctrl.timer.addClass('show-on-mobile');

  ctrl.playerType.setState(STATE.ENABLED);
  ctrl.playerType.addListener('click', () => playerTypeToggle.toggle());

  ctrl.prevTrack.setState(STATE.ENABLED);
  ctrl.prevTrack.addListener('click', prevClickCallback);

  ctrl.playPause.setState(STATE.PAUSED);
  ctrl.playPause.addListener('click', playPauseClickCallback);

  ctrl.nextTrack.setState(STATE.ENABLED);
  ctrl.nextTrack.addListener('click', () => nextClickCallback());

  ctrl.repeat.setState(STATE.ENABLED);
  ctrl.repeat.addListener('click', toggleRepeat);

  ctrl.shuffle.setState(STATE.ENABLED);

  ctrl.mute.setState(STATE.ENABLED);
  ctrl.mute.addListener('click', () => muteClickCallback());
  ctrl.volume.setState(STATE.ENABLED);
  updateVolumeMuteState();

  addSettingsObserver('autoplay',     updateAutoplayState);
  addSettingsObserver('masterVolume', updateVolumeMuteState);
  addSettingsObserver('masterMute',   updateVolumeMuteState);

  addListener(EVENT.MEDIA_LOADING,     setLoadState);
  addListener(EVENT.MEDIA_PLAYING,     setPlayState);
  addListener(EVENT.MEDIA_PAUSED ,     setPauseState);
  addListener(EVENT.MEDIA_ENDED,       setMediaEndState);
  addListener(EVENT.MEDIA_CUE_TRACK,   () => updateProgressPercent(0));
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
    let progressPercent = ((event.clientX / document.documentElement.clientWidth) * 100);
    let seekPosSeconds  = Math.round((ctrl.timer.durationSeconds * progressPercent) / 100);

    if (!settings.mobile.showPrevTrackButton      &&
        matchesMedia(MATCH.SITE_MAX_WIDTH_MOBILE) &&
        (progressPercent <= 20))
    {
      ctrl.progressSeek.clickCallback(0);
      progressPercent = 0;
      seekPosSeconds  = 0;
    }
    else
    {
      ctrl.progressSeek.clickCallback(seekPosSeconds);
    }

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

export function updateTrackData(initialPositionSeconds = 0)
{
  if (initialPositionSeconds !== 0) debug.log(`updateTrackData() - initialPositionSeconds: ${initialPositionSeconds}`);

  const trackData = m.getTrackData(initialPositionSeconds);

  clearTrackTimer(trackData);
  setTrackDetails(trackData);
}

function setTrackDetails(trackData)
{
  if (ctrl.details.state.ID === STATE.HIDDEN.ID)
  {
    ctrl.details.setState(STATE.ENABLED);
    ctrl.thumbnail.setState(STATE.ENABLED);
    ctrl.timer.setState(STATE.ENABLED);
    clearTrackTimer(trackData);
  }

  ctrl.details.artist.textContent = trackData.artist || ''; // Artist will contain the post title if all else fails
  ctrl.details.title.textContent  = trackData.title  || '';

  setThumbnail(trackData.thumbnail);
  setTimerDisplayHoursMinutes(trackData.duration);
  setTimer((isPlaying() ? ctrl.timer.positionSeconds : trackData.position), trackData.duration);
}

function setThumbnail(thumbnail)
{
  // Don't set thumbnail again if the image source / URL is unchanged
  if (thumbnail.src !== ctrl.thumbnail.img.src)
  {
    ctrl.thumbnail.removeClass('track-type-default', 'track-type-youtube', 'track-type-soundcloud', 'track-type-local');
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

function clearTrackTimer(trackData)
{
  if (trackData.position === 0)
  {
    ctrl.timer.position.textContent = settings.playback.autoplay
      ? (trackData.duration > 3600) ? '00:00:00' : '00:00'
      : getTimeString(trackData.duration, (trackData.duration > 3600));

    ctrl.timer.duration.textContent = (trackData.duration > 3600) ? '00:00:00' : '00:00';
    ctrl.timer.positionSeconds = -1;
    ctrl.timer.durationSeconds = -1;
  }
}


// ************************************************************************************************
// Playback controls (prev, play/pause and next)
// ************************************************************************************************

export function isPlaying()
{
  // ToDo: This might not be the best place to save / check playback state...?
  return (ctrl.playPause.state.ID === STATE.PLAYING.ID);
}

function setLoadState()
{
  if (ctrl.thumbnail.state.ID === STATE.ENABLED.ID)
    ctrl.thumbnail.addClass(STATE.LOADING.CLASS);
}

function setMediaEndState()
{
  updateProgressBar(0);
  setTimer(0, m.getTrackData().duration);
}

function setIsIframePlaying(isIframePlaying)
{
  if (isInIframe)
  {
    isIframePlaying
      ? window.frameElement.classList.add('is-playing')
      : window.frameElement.classList.remove('is-playing');
  }
}

export function setPlayState()
{
  ctrl.thumbnail.removeClass(STATE.LOADING.CLASS);
  ctrl.progressBar.setState(STATE.PLAYING);
  ctrl.playPause.setState(STATE.PLAYING);
  ctrl.playPause.icon.textContent = 'pause_circle_filled';
  ctrl.prevTrack.setState(STATE.ENABLED);

  setIsIframePlaying(true);
  setTrackDetails(m.getTrackData());
}

export function setPauseState()
{
  ctrl.thumbnail.removeClass(STATE.LOADING.CLASS);
  ctrl.progressBar.setState(STATE.PAUSED);
  ctrl.playPause.setState(STATE.PAUSED);
  ctrl.playPause.icon.textContent = 'play_circle_filled';

  setIsIframePlaying(false);
}

export function timeRemainingWarningBlink(toggleBlink)
{
  if (toggleBlink)
  {
    ctrl.progressBar.toggleClass('time-remaining-warning');
    ctrl.playPause.toggleClass('time-remaining-warning');
  }
  else
  {
    ctrl.progressBar.removeClass('time-remaining-warning');
    ctrl.playPause.removeClass('time-remaining-warning');
  }
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
  ctrl.repeat.element.title    = `${repeatModes[index].title} (r)`;
  ctrl.repeat.icon.textContent = repeatModes[index].icon;

  return repeatModes[index];
}


// ************************************************************************************************
// Set Mute control and Autoplay states
// ************************************************************************************************

function updateVolumeMuteState()
{
  ctrl.volume.element.textContent = `${settings.playback.masterVolume}`;

  if (settings.playback.masterMute)
  {
    ctrl.mute.element.title    = 'Muted (m to Unmute)';
    ctrl.mute.icon.textContent = 'volume_off';
    ctrl.volume.setState(STATE.DISABLED);
  }
  else
  {
    ctrl.mute.element.title    = 'Unmuted (m to Mute)';
    ctrl.mute.icon.textContent = (settings.playback.masterVolume > 50) ? 'volume_up' : 'volume_down_alt';
    ctrl.volume.setState(STATE.ENABLED);
  }
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
