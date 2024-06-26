//
// List player tracks REST data fetch and caching
//
// https://ultrafunk.com
//


import { newDebugLogger } from '../../shared/debuglogger.js';

import {
  HTTP_RESPONSE,
  fetchRest,
} from '../../shared/fetch-rest.js';

import {
  response as responseData
} from '../../shared/session-data.js';

import {
  getPageSeparatorHtml,
  getTrackEntryHtml,
  setTrackMeta,
} from './list-track-templates.js';


/*************************************************************************************************/


const debug = newDebugLogger('list-tracks-rest');

const m = {
  artistsCache:  new Map(),
  channelsCache: new Map(),
};


// ************************************************************************************************
//
// ************************************************************************************************

export async function loadTracks(termType, termId)
{
  const loadingPage  = parseInt(responseData.currentPage + 1);
  const restResponse = await fetchTracks(termType, termId, loadingPage, parseInt(responseData.listPerPage));

  if (restResponse.status.code === HTTP_RESPONSE.OK)
  {
    const trackData  = restResponse.data;
    const artistIds  = new Set();
    const channelIds = new Set();
    let tracksHtml   = getPageSeparatorHtml(responseData, loadingPage);

    trackData.forEach((track, index) =>
    {
      track.artists.forEach(key => (m.artistsCache.has(key) === false) && artistIds.add(key));
      track.channels.forEach(key => (m.channelsCache.has(key) === false) && channelIds.add(key));
      track.uid = `track-${(Date.now() + index)}`;
      tracksHtml += getTrackEntryHtml(track);
    });

    document.getElementById('tracklist-load-more-button').insertAdjacentHTML('beforebegin', tracksHtml);

    debug.log(`Fetching: ${artistIds.size} artists (${m.artistsCache.size} cached) - Fetching: ${channelIds.size} channels (${m.channelsCache.size} cached)`);

    let artistsPromise  = null;
    let channelsPromise = null;

    if (artistIds.size > 0)
      artistsPromise = fetchTerms('artists',  [...artistIds], 100);

    if (channelIds.size > 0)
      channelsPromise = fetchTerms('channels', [...channelIds], 100);

    const [artistsRestResponse, channelsRestResponse] = await Promise.all([artistsPromise, channelsPromise]);

    if ((artistsRestResponse !== null) && (artistsRestResponse.status.code === HTTP_RESPONSE.OK))
      artistsRestResponse.data.forEach(entry => m.artistsCache.set(entry.id, { name: entry.name, link: entry.link }));

    if ((channelsRestResponse !== null) && (channelsRestResponse.status.code === HTTP_RESPONSE.OK))
      channelsRestResponse.data.forEach(entry => m.channelsCache.set(entry.id, { name: entry.name, link: entry.link }));

    setTrackMeta(trackData, '.track-artists-links',  'data-track-artist-ids',  m.artistsCache);
    setTrackMeta(trackData, '.track-channels-links', 'data-track-channel-ids', m.channelsCache);

    return true;
  }

  return false;
}


// ************************************************************************************************
// Fetch tracks + terms
// ************************************************************************************************

function fetchTracks(termType = '', termId = '', page = 1, tracksPerPage = 25)
{
  debug.log(`fetchTracks() - termType: ${(termType.length === 0) ? 'N/A' : termType} - termId: ${(termId.length === 0) ? 'N/A' : termId} - page: ${page} - tracksPerPage: ${tracksPerPage}`);

  let params       = '';
  const pagination = `page=${page}&per_page=${tracksPerPage}`;
  const fields     = '&_fields=id,link,artists,channels,meta';

  if ((responseData.get.list_player === 'channel') || (responseData.get.list_player === 'artist'))
    params = getTermQueryParams(termType, termId);
  else if (responseData.get.list_player === 'shuffle')
    params = getShuffleQueryParams();
  else if (responseData.get.list_player === 'search')
    params = getSearchQueryParams();

  return fetchRest({
    endpoint: 'tracks',
    query:    `${params}${pagination}${fields}`
  });
}

function fetchTerms(termType, termIds, maxItems = 50)
{
  return fetchRest({
    endpoint: termType,
    query:    `include=${termIds}&per_page=${maxItems}&_fields=id,link,name`
  });
}

function getTermQueryParams(termType, termId)
{
  if ((termType.length !== 0) && (termId.length !== 0))
  {
    let termParams = `${termType}=${parseInt(termId)}&`;

    if (responseData.filter?.taxonomy && responseData.filter?.taxonomy_id)
      termParams += `tax_relation=AND&${responseData.filter.taxonomy}=${responseData.filter.taxonomy_id}&`;

    return termParams;
  }

  return '';
}

function getShuffleQueryParams()
{
  let shuffleParams = `shuffle=true&shuffle_type=${responseData.get.shuffle_type}&`;

  if (responseData.get.shuffle_slug !== null)
    shuffleParams += `shuffle_slug=${responseData.get.shuffle_slug}&`;

  return shuffleParams;
}

//
// ToDo: wpessid=4021;
//
function getSearchQueryParams()
{
  let searchString   = '';
  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.has('s'))
  {
    searchString = searchParams.get('s').replaceAll("'", " ");                                    // Replace ' with space for better term search results...
    searchString = encodeURIComponent(searchString).replaceAll(/(?<!%20)%26(?!%20)/g, '%26amp;'); // Encode %26 (&) without any spaces (%20) as %26amp; for better term search results...
  }

  return `search=${searchString}&orderby=relevance&wpessid=true&`;
}
