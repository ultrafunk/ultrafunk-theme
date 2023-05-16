//
// List Player realtime track search module
//
// https://ultrafunk.com
//


import * as debugLogger           from '../../shared/debuglogger.js';
import * as utils                 from '../../shared/utils.js';
import { settings }               from '../../shared/session-data.js';
import { navSearch }              from '../../site/nav-search.js';
import { ElementClick }           from '../../shared/element-click.js';
import { TRACK_TYPE }             from '../mediaplayers.js';
import { showModal }              from '../../shared/modal.js';
import { showSnackbar }           from '../../shared/snackbar.js';
import { getTrackEntryHtml }      from './list-track-templates.js';
import { getCurrentTrackElement } from './list-controls.js';


/*************************************************************************************************/


const debug   = debugLogger.newInstance('track-search');
const wpessid = debug.isDebug() ? 4122 : 4751;

const m = {
  setCurrentTrack:    null,
  debounceKeyup:      null,
  uiElements:         null,
  searchField:        null,
  trackSearchResults: null,
  resultsTracklist:   null,
  resultsCache:       new Map(),
  prevSearchString:   '',
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

export function isTrackSearchResultsVisible()
{
  return (m.trackSearchResults?.style.display === 'block');
}


// ************************************************************************************************
//
// ************************************************************************************************

function onClickCloseSearch(event)
{
  if ((m.searchField.contains(event.target)       === false) &&
      (m.resultsTracklist.contains(event.target)  === false) &&
      (event.target.closest('.nav-search-toggle') === null))
  {
    navSearch.hide();
  }
}

class uiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.thumbnail'))
      return playTrack(this.closest('div.track-entry'));

    if (this.clicked('div.play-next-button'))
      return playNext(this.closest('div.track-entry'));
  }
}

function playTrack(element)
{
  if (parseInt(element.getAttribute('data-track-type')) === TRACK_TYPE.SOUNDCLOUD)
  {
    showSnackbar('Cannot play / cue SoundCloud track', 5, 'help', () => showModal('Cannot play SoundCloud track', notPlayableTrack));
  }
  else
  {
    const insertedTrack = insertResultTrack(element);
    m.setCurrentTrack(insertedTrack.id, true, false);
    setTrackLinks(insertedTrack);
    navSearch.hide();
  }
}

function playNext(element)
{
  const insertedTrack = insertResultTrack(element);
  showSnackbar('Track will play next', 3);
  setTrackLinks(insertedTrack);
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

function debounceKeyup(callback, delayMilliseconds)
{
  let delayTimer = 0;

  return function(event, searchString)
  {
    clearTimeout(delayTimer);

    if (utils.isControlKey(event.key))
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

      if ((cachedResult.status.code === utils.HTTP_RESPONSE.OK) && (cachedResult.data.length !== 0))
        setResultsHtml(cachedResult);
      else
        showResultsMessage(`Sorry, no matches for <b>${utils.escHtml(searchString)}</b>`);

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

  // ToDo: Over 50 ms., log REST search performance for production, this will be removed in the future...
  if ((searchStop - searchStart) > 50)
    console.log(`%cSearch: ${Math.ceil(searchStop - searchStart)} ms. Fetch: ${Math.ceil(fetchRestTime)} ms. for ${utils.SITE_URL}`, debugLogger.logCss);
}

async function showRestResults(searchString)
{
  const searchParams = `search=${encodeURIComponent(searchString)}&orderby=relevance&wpessid=${wpessid}&`;
  const fetchStart   = performance.now();

  const restResponse = await utils.fetchRest({
    endpoint: 'tracks',
    query:    `${searchParams}_fields=id,link,artists,channels,meta`,
  });

  const fetchStop = performance.now();

  if ((restResponse.status.code === utils.HTTP_RESPONSE.OK) && (restResponse.data.length >= 1))
  {
    m.resultsCache.set(searchString, restResponse);
    setResultsHtml(restResponse);

    debug.log(`showRestResults(): '${searchString}' (${restResponse.data.length} hits) - Cached Results: ${m.resultsCache.size}`);
  }
  else
  {
    if (restResponse.status.code !== utils.HTTP_RESPONSE.OK)
    {
      showResultsMessage('Failed to fetch search results!');
    }
    else if ((restResponse.status.code === utils.HTTP_RESPONSE.OK) && (restResponse.data.length === 0))
    {
      m.resultsCache.set(searchString, restResponse);
      showResultsMessage(`Sorry, no matches for <b>${utils.escHtml(searchString)}</b>`);
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

function showResultsMessage(message)
{
  m.resultsTracklist.innerHTML = '<div class="results-message text-nowrap-ellipsis"></div>';
  m.resultsTracklist.querySelector('div.results-message').innerHTML = message;
}

async function setTrackLinks(element)
{
  const restResponse = await utils.fetchRest({
    endpoint: 'tracks',
    id:       element.getAttribute('data-track-id').slice(6),
    query:    'links_path=list&_fields=artists_links,channels_links',
  });

  if (restResponse.status.code === utils.HTTP_RESPONSE.OK)
  {
    element.querySelector('div.track-artists-links').innerHTML  = restResponse.data.artists_links;
    element.querySelector('div.track-channels-links').innerHTML = restResponse.data.channels_links;
  }
}
