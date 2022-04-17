//
// List-player controls module
//
// https://ultrafunk.com
//


import * as debugLogger       from '../../shared/debuglogger.js';
import * as upNextModal       from './up-next-modal.js';
import * as playbackEvents    from '../playback-events.js';
import { STATE }              from '../element-wrappers.js';
import { TRACK_TYPE }         from '../shared-gallery-list.js';
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
  currentElement:    null,
  currentState:      STATE.UNKNOWN,
  prevActionButtons: null,
  playerWrapper:     null,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function init(setCurrentTrackFunc)
{
  debug.log('init()');

  upNextModal.init(setCurrentTrackFunc);

  m.tracklist         = document.getElementById('tracklist');
  m.tracklistObserver = new IntersectionObserver(observerCallback, { root: m.tracklist });
  m.playerWrapper     = document.querySelector('.wp-block-embed__wrapper');

  m.tracklist.addEventListener('click', (event) =>
  {
    const playTrackButton = event.target.closest('div.thumbnail');
    if (playTrackButton !== null) return setCurrentTrackFunc(playTrackButton.closest('div.track-entry').id, true, true);

    const trackActionsToggle = event.target.closest('div.track-actions-toggle');
    if (trackActionsToggle !== null) return trackActionsClick(trackActionsToggle.closest('div.track-entry'));
  
    const playNextButton = event.target.closest('div.play-next-button');
    if (playNextButton !== null) return playNextClick(playNextButton.closest('div.track-entry'));

    const removeButton = event.target.closest('div.remove-button');
    if (removeButton !== null) return removeClick(removeButton.closest('div.track-entry'));

    const arrowUpButton = event.target.closest('span.arrow-up-button');
    if (arrowUpButton !== null) return arrowUpDownClick(arrowUpButton.closest('div.tracklist-page-separator'), true);

    const arrowDownButton = event.target.closest('span.arrow-down-button');
    if (arrowDownButton !== null) return arrowUpDownClick(arrowDownButton.closest('div.tracklist-page-separator'), false);
  });
}

export function ready(player)
{
  m.player = player;
  m.currentElement.classList.add('current');

  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_LOADING, () => setCurrentTrackState(STATE.LOADING));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PLAYING, () => setCurrentTrackState(STATE.PLAYING));

  if (settings.list.showLoadMoreTracks)
    initLoadMoreTracks();
}

function observerCallback(entries)
{
  m.tracklistObserver.unobserve(m.currentElement);

  if ((Math.ceil(entries[0].intersectionRatio * 100) / 100) !== 1)
    m.tracklist.scrollTop = (m.currentElement.offsetTop - m.tracklist.offsetHeight) + m.currentElement.offsetHeight;    
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
  return m.currentElement;
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
  let destElement = (m.currentElement !== null)
                      ? m.currentElement.previousElementSibling
                      : null;

  while ((destElement !== null) && (getTrackType(destElement) !== TRACK_TYPE.YOUTUBE))
    destElement = destElement.previousElementSibling;

  return ((destElement !== null) ? destElement.id : null);
}

export function getNextPlayableId(startElement = m.currentElement)
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
  m.currentElement = queryTrackId(trackId);
  m.tracklistObserver.observe(m.currentElement);
}


// ************************************************************************************************
//
// ************************************************************************************************

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
  if (m.currentElement !== null)
  {
    const nextTrackElement = trackElement.cloneNode(true);
    
    clearTrackState(nextTrackElement);
    nextTrackElement.id = Date.now();

    if (settings.list.moveTrackOnPlayNext && (trackElement !== m.currentElement))
      removeClick(trackElement, false, () => addTrack(nextTrackElement, m.currentElement, 'afterend'));
    else
      addTrack(nextTrackElement, m.currentElement, 'afterend'); 

    showSnackbar('Track will play next', 3);
  }
  else
  {
    showSnackbar('Unable to cue track', 3);
  }
}

function removeClick(trackElement, allowUndo = true, animationEndCallback = () => {})
{
  if (trackElement !== m.currentElement)
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
  if (response.params.all     ||
      response.params.channel ||
      response.params.artist  ||
      response.params.shuffle ||
      response.params.search)
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
      showSnackbar('Load more tracks failed!', 10, 'Retry', () => loadMoreTracks());
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
      m.currentElement.classList.remove(STATE.PAUSED.CLASS, STATE.PLAYING.CLASS);
      m.currentElement.classList.add(STATE.LOADING.CLASS);
    }
    else
    {
      m.currentElement.classList.remove(STATE.LOADING.CLASS);
    
      if (newState.ID === STATE.PLAYING.ID)
        replaceClass(m.currentElement, STATE.PAUSED.CLASS, STATE.PLAYING.CLASS);
      else
        replaceClass(m.currentElement, STATE.PLAYING.CLASS, STATE.PAUSED.CLASS);

      upNextModal.updateUpNextModal((newState.ID === STATE.PLAYING.ID) ? true : false);
    }
  }
}

function setPlayerAspectRatio()
{
  if (m.currentElement.classList.contains('is-video'))
    m.playerWrapper.classList.replace('aspect-ratio-1_1', 'aspect-ratio-16_9');
  else
    m.playerWrapper.classList.replace('aspect-ratio-16_9', 'aspect-ratio-1_1');
}

export function setNextTrackState(nextTrackId, isPointerClick)
{
  clearTrackState(m.currentElement);

  m.currentElement = queryTrackId(nextTrackId);

  if (isPointerClick === false)
    m.tracklistObserver.observe(m.currentElement);

  m.currentElement.classList.add('current');
}

export function setTrackMessage(message)
{
  m.currentElement.querySelector('.track-message').textContent   = message;
  m.currentElement.querySelector('.track-message').style.display = 'block';
}

export function updateTrackDetails()
{
  const sourceUid = m.currentElement.getAttribute('data-track-source-uid');
  
  m.player.setArtist(m.currentElement.getAttribute('data-track-artist'));
  m.player.setTitle(m.currentElement.getAttribute('data-track-title'));
  m.player.setDuration(parseInt(m.currentElement.getAttribute('data-track-duration')));
  m.player.setThumbnail(sourceUid);
  setPlayerAspectRatio();

  return sourceUid;
}
