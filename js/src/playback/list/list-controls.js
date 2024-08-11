//
// List-player controls module
//
// https://ultrafunk.com
//


import * as playbackEvents    from '../common/playback-events.js';
import * as utils             from '../../shared/utils.js';
import { newDebugLogger }     from '../../shared/debuglogger.js';
import { ElementClick }       from '../../shared/element-click.js';
import { STATE }              from '../common/element-wrappers.js';
import { loadTracks }         from './list-tracks-rest.js';
import { showSnackbar }       from '../../shared/snackbar.js';
import { response, settings } from '../../shared/session-data.js';
import { updateUpNextModal }  from './up-next-modal.js';

import {
  setCurrentTrack,
  togglePlayPause,
} from './list-playback.js';

import {
  TRACK_TYPE,
  getDataTrackType,
} from '../common/mediaplayer.js';

import {
  showTrackDetails,
  showTrackSharePlay,
} from '../common/track-modals.js';


/*************************************************************************************************/


const debug = newDebugLogger('list-controls');

const m = {
  tracklist:            null,
  tracklistObserver:    null,
  tracklistLoadMore:    null,
  trackElement:         null,
  currentState:         STATE.UNKNOWN,
  prevActionButtons:    null,
  youTubePlayerWrapper: null,
  uiElements:           null,
  localContainer:       null,
  localPlayerTimeoutId: 0,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function init()
{
  debug.log('init()');

  m.tracklist            = document.getElementById('tracklist');
  m.tracklistObserver    = new IntersectionObserver(observerCallback, { root: m.tracklist });
  m.youTubePlayerWrapper = document.querySelector('#list-players-container .youtube-container .wp-block-embed__wrapper');
  m.uiElements           = new UiElements('#tracklist');
  m.localContainer       = document.querySelector('.embedded-container.local-container');
}

export function ready()
{
  m.trackElement.classList.add('current');

  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_LOADING,   ()      => setCurrentTrackState(STATE.LOADING));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PLAYING,   ()      => setCurrentTrackState(STATE.PLAYING));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_PAUSED,    ()      => setCurrentTrackState(STATE.PAUSED));
  playbackEvents.addListener(playbackEvents.EVENT.MEDIA_CUE_TRACK, (event) => setNextTrackState(event.data.trackId, event.data.isPointerClick));

  if (settings.list.showLoadMoreTracks)
    initLoadMoreTracks();

  if (settings.list.enableLocalPlayback)
  {
    utils.addListener('#local-player-image', 'click', (event) =>
    {
      togglePlayPause();
      showLocalPlayerInfoAndControls(event);
    });
  }
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

export function getPrevPlayableId()
{
  let destElement = (m.trackElement !== null)
                      ? m.trackElement.previousElementSibling
                      : null;

  while ((destElement !== null) && (getDataTrackType(destElement) === TRACK_TYPE.NONE))
    destElement = destElement.previousElementSibling;

  return ((destElement !== null) ? destElement.id : null);
}

export function getNextPlayableId(startElement = m.trackElement)
{
  let destElement = (startElement !== null)
                      ? startElement.nextElementSibling
                      : queryTrack('div.track-entry');

  while ((destElement !== null) && (getDataTrackType(destElement) === TRACK_TYPE.NONE))
    destElement = destElement.nextElementSibling;

  return ((destElement !== null) ? destElement.id : null);
}

export function setCuedTrack(trackId)
{
  m.trackElement = queryTrackId(trackId);
  m.tracklistObserver.observe(m.trackElement);
}

export function showTrackTypePlayer(trackType)
{
  debug.log(`showTrackTypePlayer(): ${debug.getKeyForValue(TRACK_TYPE, trackType)}`);

  document.querySelector('.embedded-container.placeholder-container').style.display = 'none';
  document.querySelector('.embedded-container.youtube-container').style.display     = (trackType === TRACK_TYPE.YOUTUBE)    ? 'block' : '';
  document.querySelector('.embedded-container.soundcloud-container').style.display  = (trackType === TRACK_TYPE.SOUNDCLOUD) ? 'block' : '';
  m.localContainer.style.display                                                    = (trackType === TRACK_TYPE.LOCAL)      ? 'block' : '';
}

export function showLocalPlayerInfoAndControls(event)
{
  if (utils.isPointerTypeTouch(event))
  {
    const artistTitle = m.localContainer.querySelector('.artist-title-container');
    const audioPlayer = m.localContainer.querySelector('audio');

    artistTitle.style.display = 'unset';
    audioPlayer.style.display = 'unset';

    if (m.localPlayerTimeoutId !== 0)
      clearTimeout(m.localPlayerTimeoutId);

    m.localPlayerTimeoutId = setTimeout(() =>
    {
      artistTitle.style.display = '';
      audioPlayer.style.display = '';
      m.localPlayerTimeoutId    = 0;
    },
    5000);
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

class UiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('button.thumbnail'))
      return setCurrentTrack(this.closest('div.track-entry').id, true, true);

    if (this.clicked('button.track-actions-toggle'))
      return trackActionsClick(this.closest('div.track-entry'));

    if (this.clicked('button.remove-button'))
      return removeClick(this.closest('div.track-entry'));

    if (this.clicked('button.play-next-button'))
      return playNextClick(this.closest('div.track-entry'));

    if (this.clicked('button.share-play-button'))
      return showTrackSharePlay(this.closest('div.track-entry'));

    if (this.clicked('button.details-button'))
      return showTrackDetails(this.closest('div.track-entry'));

    if (this.clicked('button.arrow-up-button') || this.clicked('button.arrow-down-button'))
      return arrowUpDownClick(this.closest('div.tracklist-page-separator'), this.clicked('button.arrow-up-button'));

    if (this.clicked('button.arrow-first-button') || this.clicked('button.arrow-last-button'))
      return arrowFirstLastClick(this.clicked('button.arrow-first-button'));
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

    showSnackbar({ message: 'Track will play next', duration: 5, actionText: 'details', actionClickCallback: () =>  showTrackDetails(nextTrackElement) });
  }
  else
  {
    showSnackbar({message: 'Unable to cue track', duration: 3 });
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
      showSnackbar({
        message: 'Track removed',
        duration: 4,
        actionText: 'undo',
        actionClickCallback: () =>
        {
          addTrack(undoRemoveElement,
                  ((undoPrevElement === null) ? m.tracklist  : undoPrevElement),
                  ((undoPrevElement === null) ? 'afterbegin' : 'afterend'));
        },
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
    gotoElement = isArrowUpClick ? m.tracklist.firstElementChild : document.getElementById('tracklist-load-more-button');
    blockOption = isArrowUpClick ? 'end' : ((window.innerWidth > 1350) ? 'nearest' : 'center');

    if ((isArrowUpClick === false) && (gotoPageNum > response.maxPages))
      gotoElement = gotoElement?.previousElementSibling;
  }

  gotoElement?.scrollIntoView({ behavior: utils.getScrollBehavior(), block: blockOption });
}

function arrowFirstLastClick(isArrowFirstClick)
{
  if (isArrowFirstClick)
  {
    if (window.innerWidth > 1350)
      m.tracklist.firstElementChild.scrollIntoView({ behavior: utils.getScrollBehavior(), block: 'center' });
    else
      window.scroll({ top: 0, left: 0, behavior: utils.getScrollBehavior() });
  }
  else
  {
    m.tracklist.lastElementChild.scrollIntoView({ behavior: utils.getScrollBehavior(), block: 'center' });
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

function initLoadMoreTracks()
{
  if (response.get.list_player === 'all'     ||
      response.get.list_player === 'channel' ||
      response.get.list_player === 'artist'  ||
      response.get.list_player === 'shuffle' ||
      response.get.list_player === 'search')
  {
    if ((response.nextPage !== null) && (response.currentPage < response.maxPages))
    {
      m.tracklistLoadMore = document.getElementById('tracklist-load-more-button');
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
    tracksLoaded = await loadTracks(utils.stripAttribute(m.tracklist, 'data-term-type'), utils.stripAttribute(m.tracklist, 'data-term-id'));
    setIsLoadingTracks(false);

    if (tracksLoaded)
    {
      response.currentPage++;
      m.tracklistLoadMore.querySelector('.load-more-title span').textContent = ` ( ${response.currentPage + 1} / ${response.maxPages} )`;
    }
    else
    {
      showSnackbar({
        message: 'Load more tracks failed!',
        duration: 30,
        actionText: 'Retry',
        actionClickCallback: () => loadMoreTracks(),
      });
    }
  }

  if ((response.currentPage >= response.maxPages) && (tracksLoaded === true))
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

export function setCurrentTrackState(newState, isTrackChange = false)
{
  if ((m.currentState.ID !== newState.ID) || isTrackChange)
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
        utils.replaceClass(m.trackElement, STATE.PAUSED.CLASS, STATE.PLAYING.CLASS);
      else
        utils.replaceClass(m.trackElement, STATE.PLAYING.CLASS, STATE.PAUSED.CLASS);

      updateUpNextModal(newState.ID === STATE.PLAYING.ID);
    }
  }
}

//
// ToDo: This only works for YouTube tracks since they are the only track type that can change aspect ration for now...
//
function setPlayerAspectRatio()
{
  if (m.trackElement.classList.contains('is-video'))
    m.youTubePlayerWrapper.classList.replace('aspect-ratio-1_1', 'aspect-ratio-16_9');
  else
    m.youTubePlayerWrapper.classList.replace('aspect-ratio-16_9', 'aspect-ratio-1_1');
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

function setLocalPlayerDetails(player)
{
  if (settings.list.enableLocalPlayback)
  {
    if (player.getTrackType() === TRACK_TYPE.LOCAL)
    {
      const artistTitle = (player.getTitle().length !== 0)
        ? `<b>${utils.escHtml(player.getArtist())}</b> - ${utils.escHtml(player.getTitle())}`
        : utils.escHtml(player.getArtist());

      m.localContainer.querySelector('.artist-title').innerHTML = artistTitle;
      document.getElementById('local-player-image').src = encodeURI(m.trackElement.getAttribute('data-track-image-url'));
    }
  }
}

export function updateTrackDetails(player)
{
  player.setArtistAndTitle(m.trackElement.getAttribute('data-track-artist'), m.trackElement.getAttribute('data-track-title'));
  player.setDuration(parseInt(m.trackElement.getAttribute('data-track-duration')));
  player.setThumbnail(m.trackElement);
  setLocalPlayerDetails(player);
  setPlayerAspectRatio();
}
