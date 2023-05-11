//
// List-player controls module
//
// https://ultrafunk.com
//


import * as debugLogger       from '../../shared/debuglogger.js';
import * as upNextModal       from './up-next-modal.js';
import * as playbackEvents    from '../playback-events.js';
import { ElementClick }       from '../../shared/element-click.js';
import { STATE }              from '../element-wrappers.js';
import { TRACK_TYPE }         from '../mediaplayers.js';
import { loadTracks }         from './list-tracks-rest.js';
import { showSnackbar }       from '../../shared/snackbar.js';
import { response, settings } from '../../shared/session-data.js';

import {
  replaceClass,
  stripAttribute,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('list-controls');

const m = {
  tracklist:         null,
  tracklistObserver: null,
  tracklistLoadMore: null,
  player:            null,
  trackElement:      null,
  currentState:      STATE.UNKNOWN,
  prevActionButtons: null,
  playerWrapper:     null,
  uiElements:        null,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function init(setCurrentTrackCallback)
{
  debug.log('init()');

  upNextModal.init(setCurrentTrackCallback);

  m.tracklist         = document.getElementById('tracklist');
  m.tracklistObserver = new IntersectionObserver(observerCallback, { root: m.tracklist });
  m.playerWrapper     = document.querySelector('.wp-block-embed__wrapper');
  m.uiElements        = new UiElements('#tracklist', setCurrentTrackCallback);
}

export function ready(player)
{
  m.player = player;
  m.trackElement.classList.add('current');

  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_LOADING,   () => setCurrentTrackState(STATE.LOADING));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PLAYING,   () => setCurrentTrackState(STATE.PLAYING));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_CUE_TRACK, (event) => setNextTrackState(event.data.trackId, event.data.isPointerClick));

  if (settings.list.showLoadMoreTracks)
    initLoadMoreTracks();
}

function observerCallback(entries)
{
  m.tracklistObserver.unobserve(m.trackElement);

  if ((Math.ceil(entries[0].intersectionRatio * 100) / 100) !== 1)
    m.tracklist.scrollTop = (m.trackElement.offsetTop - m.tracklist.offsetHeight) + m.trackElement.offsetHeight;
}


// ************************************************************************************************
//
// ************************************************************************************************

export function queryTrack(selectors)
{
  return m.tracklist.querySelector(selectors);
}

export function queryTrackAll(selectors)
{
  return m.tracklist.querySelectorAll(selectors);
}

export function queryTrackId(id)
{
  return document.getElementById(id);
}

export function getCurrentTrackElement()
{
  return m.trackElement;
}

export function getTrackType(element)
{
  const trackType = element.getAttribute('data-track-type');

  if (trackType !== null)
    return parseInt(trackType);

  return TRACK_TYPE.NONE;
}

export function getPrevPlayableId()
{
  let destElement = (m.trackElement !== null)
                      ? m.trackElement.previousElementSibling
                      : null;

  while ((destElement !== null) && (getTrackType(destElement) !== TRACK_TYPE.YOUTUBE))
    destElement = destElement.previousElementSibling;

  return ((destElement !== null) ? destElement.id : null);
}

export function getNextPlayableId(startElement = m.trackElement)
{
  let destElement = (startElement !== null)
                      ? startElement.nextElementSibling
                      : queryTrack('div.track-entry');

  while ((destElement !== null) && (getTrackType(destElement) !== TRACK_TYPE.YOUTUBE))
    destElement = destElement.nextElementSibling;

  return ((destElement !== null) ? destElement.id : null);
}

export function setCuedTrack(trackId)
{
  m.trackElement = queryTrackId(trackId);
  m.tracklistObserver.observe(m.trackElement);
}


// ************************************************************************************************
//
// ************************************************************************************************

class UiElements extends ElementClick
{
  constructor(selectors, setCurrentTrackCallback)
  {
    super(selectors);
    this.setCurrentTrack = setCurrentTrackCallback;
  }

  elementClicked()
  {
    if (this.clicked('div.thumbnail'))
      return this.setCurrentTrack(this.closest('div.track-entry').id, true, true);

    if (this.clicked('div.track-actions-toggle'))
      return trackActionsClick(this.closest('div.track-entry'));

    if (this.clicked('div.remove-button'))
      return removeClick(this.closest('div.track-entry'));

    if (this.clicked('div.play-next-button'))
      return playNextClick(this.closest('div.track-entry'));

    if (this.clicked('span.arrow-up-button'))
      return arrowUpDownClick(this.closest('div.tracklist-page-separator'), true);

    if (this.clicked('span.arrow-down-button'))
      return arrowUpDownClick(this.closest('div.tracklist-page-separator'), false);
  }
}

function trackActionsClick(element)
{
  const trackActionButtons = element.querySelector('.track-action-buttons');

  if ((m.prevActionButtons !== null) && (m.prevActionButtons !== trackActionButtons))
    m.prevActionButtons.style.display = '';

  if (trackActionButtons.style.display === '')
    trackActionButtons.style.display = 'flex';
  else
    trackActionButtons.style.display = '';

  m.prevActionButtons = trackActionButtons;
}

function playNextClick(trackElement)
{
  if (m.trackElement !== null)
  {
    const nextTrackElement = trackElement.cloneNode(true);

    clearTrackState(nextTrackElement);
    nextTrackElement.id = `track-${Date.now()}`;

    if (settings.list.moveTrackOnPlayNext && (trackElement !== m.trackElement))
      removeClick(trackElement, false, () => addTrack(nextTrackElement, m.trackElement, 'afterend'));
    else
      addTrack(nextTrackElement, m.trackElement, 'afterend');

    showSnackbar('Track will play next', 3);
  }
  else
  {
    showSnackbar('Unable to cue track', 3);
  }
}

function removeClick(trackElement, allowUndo = true, animationEndCallback = () => {})
{
  if (trackElement !== m.trackElement)
  {
    const undoRemoveElement = trackElement.cloneNode(true);
    const undoPrevElement   = trackElement.previousElementSibling;

    trackElement.addEventListener('animationend', () =>
    {
      trackElement.remove();
      animationEndCallback();
    });

    trackElement.classList.add('removing');

    if (allowUndo)
    {
      showSnackbar('Track removed', 4, 'undo', () =>
      {
        addTrack(undoRemoveElement,
                ((undoPrevElement === null) ? m.tracklist  : undoPrevElement),
                ((undoPrevElement === null) ? 'afterbegin' : 'afterend'));
      });
    }
  }
}

function addTrack(trackElement, targetElement, insertPosition)
{
  trackElement.classList.add('adding');
  trackElement.querySelector('.track-action-buttons').style.display = '';
  trackElement.addEventListener('animationend', () => trackElement.classList.remove('adding'));
  targetElement.insertAdjacentElement(insertPosition, trackElement);
}

function arrowUpDownClick(targetElement, isArrowUpClick)
{
  const pageNumber  = parseInt(targetElement.getAttribute('data-page-number'));
  const gotoPageNum = isArrowUpClick ? (pageNumber - 1) : (pageNumber + 1);
  let gotoElement   = document.getElementById(`tracklist-page-${gotoPageNum}`);
  let blockOption   = 'center';

  if (gotoElement === null)
  {
    gotoElement = isArrowUpClick ? m.tracklist.firstElementChild : m.tracklist.lastElementChild;
    blockOption = isArrowUpClick ? 'end' : ((window.innerWidth > 1350) ? 'nearest' : 'center');

    if ((isArrowUpClick === false) && (gotoPageNum > response.maxPages))
      gotoElement = gotoElement?.previousElementSibling;
  }

  gotoElement?.scrollIntoView({ behavior: (settings.site.smoothScrolling ? 'smooth' : 'auto'), block: blockOption });
}


// ************************************************************************************************
//
// ************************************************************************************************

function initLoadMoreTracks()
{
  if (response.params.list_player === 'all'     ||
      response.params.list_player === 'channel' ||
      response.params.list_player === 'artist'  ||
      response.params.list_player === 'shuffle' ||
      response.params.list_player === 'search')
  {
    if ((response.nextPage !== null) && (response.currentPage < response.maxPages))
    {
      m.tracklistLoadMore = document.getElementById('tracklist-load-more');
      m.tracklistLoadMore.querySelector('.load-more-title span').textContent = ` ( ${response.currentPage + 1} / ${response.maxPages} )`;
      m.tracklistLoadMore.style.display = 'block';
      m.tracklistLoadMore.addEventListener('click', loadMoreTracks);
    }
  }
}

export async function loadMoreTracks()
{
  let tracksLoaded = false;

  if ((response.currentPage + 1) <= response.maxPages)
  {
    setIsLoadingTracks(true);
    tracksLoaded = await loadTracks(stripAttribute(m.tracklist, 'data-term-type'), stripAttribute(m.tracklist, 'data-term-id'));
    setIsLoadingTracks(false);

    if (tracksLoaded)
    {
      response.currentPage++;
      m.tracklistLoadMore.querySelector('.load-more-title span').textContent = ` ( ${response.currentPage + 1} / ${response.maxPages} )`;
    }
    else
    {
      showSnackbar('Load more tracks failed!', 30, 'Retry', () => loadMoreTracks());
    }
  }

  if (response.currentPage >= response.maxPages)
    m.tracklistLoadMore.style.display = 'none';

  return tracksLoaded;
}

function setIsLoadingTracks(isLoadingTracks)
{
  m.tracklistLoadMore.style.pointerEvents                              = isLoadingTracks ? 'none'  : 'unset';
  m.tracklistLoadMore.querySelector('.load-more-title').style.display  = isLoadingTracks ? 'none'  : 'block';
  m.tracklistLoadMore.querySelector('.load-more-loader').style.display = isLoadingTracks ? 'block' : 'none';
}


// ************************************************************************************************
//
// ************************************************************************************************

function clearTrackState(element)
{
  element.classList.remove('current', STATE.LOADING.CLASS, STATE.PLAYING.CLASS, STATE.PAUSED.CLASS);
}

export function setCurrentTrackState(newState)
{
  if (m.currentState.ID !== newState.ID)
  {
    m.currentState = newState;

    if (newState.ID === STATE.LOADING.ID)
    {
      m.trackElement.classList.remove(STATE.PAUSED.CLASS, STATE.PLAYING.CLASS);
      m.trackElement.classList.add(STATE.LOADING.CLASS);
    }
    else
    {
      m.trackElement.classList.remove(STATE.LOADING.CLASS);

      if (newState.ID === STATE.PLAYING.ID)
        replaceClass(m.trackElement, STATE.PAUSED.CLASS, STATE.PLAYING.CLASS);
      else
        replaceClass(m.trackElement, STATE.PLAYING.CLASS, STATE.PAUSED.CLASS);

      upNextModal.updateUpNextModal((newState.ID === STATE.PLAYING.ID) ? true : false);
    }
  }
}

function setPlayerAspectRatio()
{
  if (m.trackElement.classList.contains('is-video'))
    m.playerWrapper.classList.replace('aspect-ratio-1_1', 'aspect-ratio-16_9');
  else
    m.playerWrapper.classList.replace('aspect-ratio-16_9', 'aspect-ratio-1_1');
}

export function setNextTrackState(nextTrackId, isPointerClick)
{
  clearTrackState(m.trackElement);

  m.trackElement = queryTrackId(nextTrackId);

  if (isPointerClick === false)
    m.tracklistObserver.observe(m.trackElement);

  m.trackElement.classList.add('current');
}

export function setTrackMessage(message)
{
  m.trackElement.querySelector('.track-message').textContent   = message;
  m.trackElement.querySelector('.track-message').style.display = 'block';
}

export function updateTrackDetails()
{
  const sourceUid = m.trackElement.getAttribute('data-track-source-uid');

  m.player.setArtistTitle(m.trackElement.getAttribute('data-track-artist'), m.trackElement.getAttribute('data-track-title'));
  m.player.setDuration(parseInt(m.trackElement.getAttribute('data-track-duration')));
  m.player.setThumbnail(sourceUid);
  setPlayerAspectRatio();

  return sourceUid;
}
