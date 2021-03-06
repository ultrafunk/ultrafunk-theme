//
// List player tracks REST data fetch and caching
//
// https://ultrafunk.com
//


import * as debugLogger from '../../shared/debuglogger.js';
import { fetchRest }    from '../../shared/utils.js';

import {
  response as responseData
} from '../../shared/session-data.js';

import {
  getPageSeparatorHtml,
  getTrackEntryHtml,
  setTrackMeta,
} from './list-track-templates.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('list-tracks-rest');

const m = {
  artistsCache:  new Map(),
  channelsCache: new Map(),
};


// ************************************************************************************************
//
// ************************************************************************************************

export async function loadTracks(termType, termId)
{
  const loadingPage = parseInt(responseData.currentPage + 1);
  const trackData   = await fetchTracks(termType, termId, loadingPage, parseInt(responseData.listPerPage));

  if (trackData !== null)
  {
    const artistIds  = new Set();
    const channelIds = new Set();
    let tracksHtml   = getPageSeparatorHtml(responseData, loadingPage);

    trackData.forEach((track, index) =>
    {
      track.artists.forEach(key => (m.artistsCache.has(key) === false) && artistIds.add(key));
      track.channels.forEach(key => (m.channelsCache.has(key) === false) && channelIds.add(key));
      track.uid = (Date.now() + index);
      tracksHtml += getTrackEntryHtml(track);
    });

    document.getElementById('tracklist-load-more').insertAdjacentHTML('beforebegin', tracksHtml);

    debug.log(`Fetching: ${artistIds.size} artists (cached: ${m.artistsCache.size}) - Fetching: ${channelIds.size} channels (cached: ${m.channelsCache.size})`);

    let artistsPromise  = null;
    let channelsPromise = null;

    if (artistIds.size > 0)
      artistsPromise = fetchTerms('artists',  [...artistIds], 100);

    if (channelIds.size > 0)
      channelsPromise = fetchTerms('channels', [...channelIds], 100);

    const [artistsData, channelsData] = await Promise.all([artistsPromise, channelsPromise]);

    if (artistsData !== null)
      artistsData.forEach(entry => m.artistsCache.set(entry.id, { name: entry.name, link: entry.link }));

    if (channelsData !== null)
      channelsData.forEach(entry => m.channelsCache.set(entry.id, { name: entry.name, link: entry.link }));

    setTrackMeta(trackData, '.track-artists-links',  'data-track-artist-ids',  m.artistsCache,  false);
    setTrackMeta(trackData, '.track-channels-links', 'data-track-channel-ids', m.channelsCache, true);

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

  if (responseData.params.channel || responseData.params.artist)
    params = getTermQueryParams(termType, termId);
  else if (responseData.params.shuffle)
    params = getShuffleQueryParams();
  else if (responseData.params.search)
    params = getSearchQueryParams();

  return fetchRest('tracks', `${params}${pagination}${fields}`);
}

function fetchTerms(termType, termIds, maxItems = 50)
{
  return fetchRest(termType, `include=${termIds}&per_page=${maxItems}&_fields=id,link,name`);
}

function getTermQueryParams(termType, termId)
{
  if ((termType.length !== 0) && (termId.length !== 0))
    return `${termType}=${parseInt(termId)}&`;

  return '';
}

function getShuffleQueryParams()
{
  let shuffleParams = `shuffle=true&shuffle_type=${responseData.params.shuffle_type}&`;

  if (responseData.params.shuffle_slug !== null)
    shuffleParams += `shuffle_slug=${responseData.params.shuffle_slug}&`;

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
    searchString = encodeURIComponent(searchParams.get('s'));
  //Search string "R&B" needs special handling to match "R&amp;B"
    searchString = searchString.replace(/r%26b/i, 'r%26amp;b');
  }

  return `search=${searchString}&orderby=relevance&wpessid=true&`;
}
