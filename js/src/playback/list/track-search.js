//
// List-player realtime track search module
//
// https://ultrafunk.com
//


import { newDebugLogger, logCss } from '../../shared/debuglogger.js';
import { THEME_ENV }              from '../../config.js';
import { settings }               from '../../shared/session-data.js';
import { navSearch }              from '../../site/nav-search.js';
import { ElementClick }           from '../../shared/element-click.js';
import { TRACK_TYPE }             from '../common/mediaplayers.js';
import { showSnackbar }           from '../../shared/snackbar.js';
import { getTrackEntryHtml }      from './list-track-templates.js';
import { getCurrentTrackElement } from './list-controls.js';

import {
  showTrackDetails,
  showTrackSharePlay,
} from '../common/track-modals.js';

import {
  HTTP_RESPONSE,
  fetchRest,
} from '../../shared/fetch-rest.js';

import {
  isControlKey,
  escHtml,
} from '../../shared/utils.js';

import {
  showModal,
  isShowingModal,
} from '../../shared/modal.js';


/*************************************************************************************************/


const debug = newDebugLogger('track-search');

const m = {
  setCurrentTrack:    null,
  debounceKeyup:      null,
  uiElements:         null,
  searchField:        null,
  trackSearchResults: null,
  resultsTracklist:   null,
  resultsCache:       new Map(),
  prevSearchString:   '',
  modalId:            -1,
};

const minSearchStringLength = 3;

const notPlayableTrack = /*html*/ `
  <p>The <b>List Player</b> only supports YouTube tracks, SoundCloud tracks cannot be played or queued.
  SoundCloud tracks must be played using the <b>Gallery Player</b> or by clicking / tapping on the
  track <b>Artist + Title</b> text link in the <b>List Player</b>.</p>`;


// ************************************************************************************************
//
// ************************************************************************************************

export function initTrackSearch(setCurrentTrackCallback)
{
  debug.log('init()');

  if (settings.list.realtimeTrackSearch)
  {
    m.setCurrentTrack    = setCurrentTrackCallback;
    m.debounceKeyup      = debounceKeyup(showSearchResults, 250);
    m.uiElements         = new uiElements('#track-search-results .results-tracklist');
    m.searchField        = document.querySelector('#site-search-container .search-field');
    m.trackSearchResults = document.getElementById('track-search-results');
    m.resultsTracklist   = m.trackSearchResults.querySelector('.results-tracklist');

    window.addEventListener('load', () =>
    {
      m.searchField.addEventListener('keyup',  (event) => m.debounceKeyup(event, m.searchField.value.toLowerCase()));
      m.searchField.addEventListener('search', () => showSearchResults(m.searchField.value.toLowerCase()));

      // "Preload" track search results if this is a serch results page
      if ((m.searchField.value !== '') && (m.searchField.value.length >= minSearchStringLength))
        showSearchResults(m.searchField.value.toLowerCase());

      // ToDo: This does not work on Firefox...
      window.addEventListener('blur', () =>
      {
        if (isTrackSearchResultsVisible() && (document.activeElement?.id === 'youtube-player'))
          navSearch.hide();
      });
    });
  }
}

export function setTrackSearchResultsVisible(isSearchVisible)
{
  if (m.trackSearchResults === null)
    return;

  if (isSearchVisible)
  {
    m.trackSearchResults.style.display = (m.searchField.value.length >= minSearchStringLength) ? 'block' : 'none';
    document.addEventListener('click', onClickCloseSearch, { capture: true });
  }
  else
  {
    m.trackSearchResults.style.display = 'none';
    document.removeEventListener('click', onClickCloseSearch, { capture: true });
  }
}

function onClickCloseSearch(event)
{
  if ((m.searchField.contains(event.target)       === false) &&
      (m.resultsTracklist.contains(event.target)  === false) &&
      (event.target.closest('.nav-search-toggle') === null)  &&
      (isShowingModal(m.modalId)                  === false))
  {
    navSearch.hide();
  }
}

export function isTrackSearchResultsVisible()
{
  return (m.trackSearchResults?.style.display === 'block');
}

function debounceKeyup(callback, delayMilliseconds)
{
  let delayTimer = 0;

  return function(event, searchString)
  {
    clearTimeout(delayTimer);

    if (isControlKey(event.key))
      return;

    if ((searchString.length >= minSearchStringLength) && (m.resultsCache.get(searchString) === undefined))
    {
      if (m.resultsCache.size === 0)
        m.trackSearchResults.style.display = 'block';

      delayTimer = setTimeout(() => callback(searchString), delayMilliseconds);
    }
    else
    {
      callback(searchString);
    }
  };
}


// ************************************************************************************************
// Handle UI events
// ************************************************************************************************

class uiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.thumbnail'))
      return playTrackClick(this.closest('div.track-entry'));

    if (this.clicked('div.artist-title'))
      return showTrackDetailsTouch(this.event, this.closest('div.track-entry'));

    if (this.clicked('div.play-next-button'))
      return playNextClick(this.closest('div.track-entry'));

    if (this.clicked('div.share-play-button'))
      return m.modalId = showTrackSharePlay(this.closest('div.track-entry'), m.searchField);

    if (this.clicked('div.details-button'))
      return m.modalId = showTrackDetails(this.closest('div.track-entry'), m.searchField);
  }
}

function playTrackClick(element)
{
  if (parseInt(element.getAttribute('data-track-type')) === TRACK_TYPE.SOUNDCLOUD)
  {
    showSnackbar('Cannot play / cue SoundCloud track', 5, 'help', () => showModal({ modalTitle: 'Cannot play SoundCloud track', modalBody: notPlayableTrack }));
  }
  else
  {
    m.setCurrentTrack(insertResultTrack(element).id, true, false);
    navSearch.hide();
  }
}

function showTrackDetailsTouch(event, element)
{
  if ((event.pointerType === 'touch') && (parseInt(element.getAttribute('data-track-type')) === TRACK_TYPE.YOUTUBE))
    m.modalId = showTrackDetails(element, m.searchField);
}

function playNextClick(element)
{
  insertResultTrack(element);
  showSnackbar('Track will play next', 3);
  navSearch.hide();
}

function insertResultTrack(element)
{
  const insertElement = element.cloneNode(true);

  insertElement.id = `track-${Date.now()}`;
  insertElement.classList.replace('compact-density', 'default-density');
  insertElement.classList.add('adding');
  insertElement.addEventListener('animationend', () => insertElement.classList.remove('adding'));

  getCurrentTrackElement()?.insertAdjacentElement('afterend', insertElement);

  return insertElement;
}


// ************************************************************************************************
//
// ************************************************************************************************

async function showSearchResults(searchString)
{
  const searchStart = performance.now();
  let fetchRestTime = 0;

  if (searchString.length < minSearchStringLength)
  {
    m.searchField.autocomplete = 'on';
    m.trackSearchResults.style.display = 'none';
    m.prevSearchString = '';
  }
  else
  {
    if ((searchString !== m.prevSearchString) && (m.resultsCache.get(searchString) === undefined))
    {
      m.searchField.autocomplete = 'off';
      m.prevSearchString = searchString;

      fetchRestTime = await showRestResults(searchString);
    }
    else if (searchString !== m.prevSearchString)
    {
      const cachedResult = m.resultsCache.get(searchString);

      m.searchField.autocomplete = 'off';
      m.prevSearchString = searchString;

      if ((cachedResult.status.code === HTTP_RESPONSE.OK) && (cachedResult.data.length !== 0))
        setResultsHtml(cachedResult);
      else
        showResultsMessage(getNoMatchesMessage(searchString));

      debug.log(`showSearchResults() from cache for: '${searchString}' - Cached Results: ${m.resultsCache.size}`);
    }

    if ((m.trackSearchResults.style.display === 'none') && navSearch.isVisible())
      m.trackSearchResults.style.display = 'block';
    else
      m.trackSearchResults.querySelector('.track-results-container').scrollTop = 0;
  }

  // Free up some memory... (1000 entries is about 10 MB)
  if (m.resultsCache.size > 1000)
    m.resultsCache.clear();

  const searchStop = performance.now();

  // ToDo: Over 200 ms., log REST search performance for production, this will be removed in the future...
  if ((searchStop - searchStart) > 200)
  {
    const searchType = settings.list.queryAllTrackArtists ? 'Artist - Title + Artists' : 'Artist - Title';
    console.log(`%cSearch ${searchType}: ${Math.ceil(searchStop - searchStart)} ms. (fetch: ${Math.ceil(fetchRestTime)} ms.) for ${THEME_ENV.siteUrl}`, logCss);
  }
}

async function showRestResults(searchString)
{
  const searchTypeId = settings.list.queryAllTrackArtists ? THEME_ENV.searchArtistTitleArtistsId : THEME_ENV.searchArtistTitleId;
  const searchParams = `search=${encodeURIComponent(searchString)}&orderby=relevance&wpessid=${searchTypeId}&`;
  const fetchStart   = performance.now();

  const restResponse = await fetchRest({
    endpoint: 'tracks',
    query:    `${searchParams}_fields=id,link,artists,channels,meta,artists_links,channels_links`,
  });

  const fetchStop = performance.now();

  if ((restResponse.status.code === HTTP_RESPONSE.OK) && (restResponse.data.length >= 1))
  {
    m.resultsCache.set(searchString, restResponse);
    setResultsHtml(restResponse);

    debug.log(`showRestResults(): '${searchString}' (${restResponse.data.length} matches) - Cached Results: ${m.resultsCache.size}`);
  }
  else
  {
    if (restResponse.status.code !== HTTP_RESPONSE.OK)
    {
      showResultsMessage('Failed to fetch search results!');
    }
    else if ((restResponse.status.code === HTTP_RESPONSE.OK) && (restResponse.data.length === 0))
    {
      m.resultsCache.set(searchString, restResponse);
      showResultsMessage(getNoMatchesMessage(searchString));
    }
  }

  return (fetchStop - fetchStart);
}

function setResultsHtml(restResponse)
{
  let tracksHtml = '';

  restResponse.data.forEach((track, index) =>
  {
    track.uid   = `track-${(Date.now() + index)}`;
    tracksHtml += getTrackEntryHtml(track, 'compact');
  });

  m.resultsTracklist.innerHTML = tracksHtml;
}

function getNoMatchesMessage(searchString)
{
  const separator = '&nbsp;&nbsp;&nbsp;&#10095;&#10095;&nbsp;&nbsp;&nbsp;';
  return `0 tracks match <b>${escHtml(searchString)}</b>${separator}<a href="/?s=${encodeURIComponent(searchString)}">Search Site</a>`;
}

function showResultsMessage(message)
{
  m.resultsTracklist.innerHTML = '<div class="results-message text-nowrap-ellipsis"></div>';
  m.resultsTracklist.querySelector('div.results-message').innerHTML = message;
}
