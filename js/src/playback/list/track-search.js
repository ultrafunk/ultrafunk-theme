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
import { showSnackbar }           from '../../shared/snackbar.js';
import { getTrackEntryHtml }      from './list-track-templates.js';
import { setCurrentTrack }        from './list-playback.js';
import { isShowingModal }         from '../../shared/modal.js';

import {
  getCurrentTrackElement,
  trackActionsClick,
} from './list-controls.js';

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
  isPointerTypeTouch,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = newDebugLogger('track-search');

const m = {
  debounceKeyup:      null,
  uiElements:         null,
  searchField:        null,
  trackSearchResults: null,
  localSearchResults: [],
  resultsTracklist:   null,
  resultsCache:       new Map(),
  prevSearchString:   '',
  modalId:            -1,
  prevActionButtons:  null,
};

const minSearchStringLength = 3;


// ************************************************************************************************
//
// ************************************************************************************************

export function initTrackSearch()
{
  debug.log('init()');

  if (settings.list.realtimeTrackSearch)
  {
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
  let delayTimerId = 0;

  return function(event, searchString)
  {
    clearTimeout(delayTimerId);

    if (isControlKey(event.key))
      return;

    if ((searchString.length >= minSearchStringLength) && (m.resultsCache.get(searchString) === undefined))
    {
      if (m.resultsCache.size === 0)
        m.trackSearchResults.style.display = 'block';

      delayTimerId = setTimeout(() => callback(searchString), delayMilliseconds);
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
    if (this.clicked('button.thumbnail'))
      return playTrackClick(this.closest('div.track-entry'));

    if (this.clicked('div.artist-title'))
      return showTrackDetailsTouch(this.event, this.closest('div.track-entry'));

    if (this.clicked('button.track-actions-toggle'))
      return trackActionsClick(this.closest('div.track-entry'), m);

    if (this.clicked('button.play-next-button'))
      return playNextClick(this.closest('div.track-entry'));

    if (this.clicked('button.share-play-button'))
      return m.modalId = showTrackSharePlay(this.closest('div.track-entry'), m.searchField);

    if (this.clicked('button.details-button'))
      return m.modalId = showTrackDetails(this.closest('div.track-entry'), m.searchField);
  }
}

function playTrackClick(element)
{
  setCurrentTrack(insertResultTrack(element).id, true, false);
  navSearch.hide();
}

function showTrackDetailsTouch(event, element)
{
  if (isPointerTypeTouch(event))
    m.modalId = showTrackDetails(element, m.searchField);
}

function playNextClick(element)
{
  insertResultTrack(element);
  showSnackbar({ message: 'Track will play next', duration: 5, actionText: 'details', actionClickCallback: () =>  showTrackDetails(element) });
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

export async function showSearchResults(searchString)
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
    if (settings.list.enableLocalPlayback &&
        settings.list.searchLocalTracks   &&
       (searchString !== m.prevSearchString))
    {
      searchLocalTracks(searchString);
    }

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

      if ((cachedResult.status.code === HTTP_RESPONSE.OK) && (cachedResult.data.length !== 0) || (m.localSearchResults.length > 0))
        setResultsHtml(cachedResult);
      else
        showResultsMessage(getNoMatchesMessage(searchString));

      debug.log(`showSearchResults() from cache for: '${searchString}' - Cached Results: ${m.resultsCache.size}`);
    }

    if ((m.trackSearchResults.style.display === 'none') && navSearch.isVisible())
      m.trackSearchResults.style.display = 'block';
  }

  // Free up some memory... (1000 entries is about 10 MB)
  if (m.resultsCache.size > 1000)
    m.resultsCache.clear();

  const searchStop = performance.now();

  // ToDo: Over 500 ms., log REST search performance for production, this will be removed in the future...
  if ((searchStop - searchStart) > 500)
    console.log(`%cTrack search for ${searchTypeString[getSearchTypeId()]}: ${Math.ceil(searchStop - searchStart)} ms. (fetch: ${Math.ceil(fetchRestTime)} ms.) for ${THEME_ENV.siteUrl}`, logCss);
}

async function showRestResults(searchString)
{
  const replacedSearchString = searchString.replaceAll("'", " ");                                                     // Replace ' with space for better term search results...
  const encodedSearchString  = encodeURIComponent(replacedSearchString).replaceAll(/(?<!%20)%26(?!%20)/g, '%26amp;'); // Encode %26 (&) without any spaces (%20) as %26amp; for better term search results...
  const searchParams = `search=${encodedSearchString}&orderby=relevance&per_page=${settings.list.maxTrackSearchResults + 1}&wpessid=${getSearchTypeId()}&`;
  const fetchStart   = performance.now();

  const restResponse = await fetchRest({
    endpoint: 'tracks',
    query:    `${searchParams}_fields=id,link,artists,channels,meta,artists_links,channels_links`,
  });

  const fetchStop = performance.now();

  if ((restResponse.status.code === HTTP_RESPONSE.OK) && (restResponse.data.length >= 1) || (m.localSearchResults.length > 0))
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

function searchLocalTracks(searchString)
{
  const searchStart = performance.now();
  let   numOfTracks = 0, matches = 0;
  const resultIds   = [];
  searchString      = searchString.trim();

  document.getElementById('tracklist')?.querySelectorAll('.track-entry.track-type-local')?.forEach((element) =>
  {
    const trackArtist = element.getAttribute('data-track-artist').toLowerCase();
    const trackTitle  = element.getAttribute('data-track-title').toLowerCase();

    if (trackArtist.includes(searchString) || trackTitle.includes(searchString))
    {
      resultIds.push(element.id);
      matches++;
    }

    numOfTracks++;
  });

  m.localSearchResults = resultIds;

  const searchStop = performance.now();

  // ToDo: Over 25 ms., log local search performance for production, this will be removed in the future...
  if ((searchStop - searchStart) > 25)
    console.log(`%cLocal track search for '${searchString}' - Found ${matches} matches in ${Math.ceil(searchStop - searchStart)} ms. from ${numOfTracks} tracks`, logCss);
}

const searchTypeString = {
  [THEME_ENV.searchArtistTitleId]:                'Artist - Title',
  [THEME_ENV.searchArtistTitleArtistsId]:         'Artist - Title + Artists',
  [THEME_ENV.searchArtistTitleChannelsId]:        'Artist - Title + Channels',
  [THEME_ENV.searchArtistTitleArtistsChannelsId]: 'Artist - Title + Artists + Channels',
};

function getSearchTypeId()
{
  if (settings.list.queryAllTrackArtists && settings.list.queryAllTrackChannels)
    return THEME_ENV.searchArtistTitleArtistsChannelsId;
  else if (settings.list.queryAllTrackArtists)
    return THEME_ENV.searchArtistTitleArtistsId;
  else if (settings.list.queryAllTrackChannels)
    return THEME_ENV.searchArtistTitleChannelsId;

  return THEME_ENV.searchArtistTitleId;
}

function setResultsHtml(restResponse)
{
  let tracksHtml  = '';
  let tracksAdded = 0;
  const moreThanMaxResults = ((restResponse.data.length + m.localSearchResults.length) > settings.list.maxTrackSearchResults);

  restResponse.data.forEach((track, index) =>
  {
    if (index < settings.list.maxTrackSearchResults)
    {
      track.uid   = `track-${(Date.now() + index)}`;
      tracksHtml += getTrackEntryHtml(track, 'compact');
      tracksAdded++;
    }
  });

  m.resultsTracklist.innerHTML = tracksHtml;

  if ((moreThanMaxResults === false) || (tracksAdded < settings.list.maxTrackSearchResults))
  {
    m.localSearchResults.forEach((elementId, index) =>
    {
      if ((index + tracksAdded) < settings.list.maxTrackSearchResults)
      {
        const trackElement     = document.getElementById(elementId).cloneNode(true);
        trackElement.id        = `track-${Date.now() + index + tracksAdded}`;
        trackElement.className = 'track-entry compact-density track-type-local aspect-ratio-1_1';

        m.resultsTracklist.append(trackElement);
      }
    });
  }

  if (moreThanMaxResults)
  {
    m.resultsTracklist.insertAdjacentHTML("beforeend", `
      <div class="max-results text-nowrap-ellipsis">
        More than ${settings.list.maxTrackSearchResults} hits, refine query or&nbsp;<a href="/list/search/?s=${encodeURIComponent(m.searchField.value)}"><b>show all results</b></a>
      </div>`
    );
  }

  // Sometimes yield (setTimeout(0)) is needed for scrolling to actually happen... But why?
  setTimeout(() => { m.trackSearchResults.querySelector('.track-results-container').scrollTop = 0; }, 0);
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
