//
// List player tracks REST data fetch and caching
//
// https://ultrafunk.com
//


import * as debugLogger from '../../shared/debuglogger.js';

import {
  response as responseData
} from '../../shared/session-data.js';

import {
  getPageSeparatorHtml,
  getTrackEntryHtml,
  insertTrackLinksHtml,
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

    insertTrackLinksHtml(trackData, '.track-artists-links',  'data-track-artist-ids',  m.artistsCache);
    insertTrackLinksHtml(trackData, '.track-channels-links', 'data-track-channel-ids', m.channelsCache);

    return true;
  }

  return false;
}


// ************************************************************************************************
// Fetch tracks
// ************************************************************************************************

function fetchTracks(termType = '', termId = '', page = 1, tracksPerPage = 25)
{
  debug.log(`fetchTracks() - termType: ${(termType.length === 0) ? 'N/A' : termType} - termId: ${(termId.length === 0) ? 'N/A' : termId} - page: ${page} - tracksPerPage: ${tracksPerPage}`);

  let queryParams       = '';
  const queryPagination = `page=${page}&per_page=${tracksPerPage}`;
  const queryFields     = '&_fields=id,link,artists,channels,meta';
  
  if (responseData.params.channel || responseData.params.artist)
    queryParams = getTermQueryParams(termType, termId);
  else if (responseData.params.shuffle)
    queryParams = getShuffleQueryParams();
  else if (responseData.params.search)
    queryParams = getSearchQueryParams();

  debug.log(`fetchTracks(): /wp-json/wp/v2/tracks?${queryParams}${queryPagination}${queryFields}`);

  return fetch(`/wp-json/wp/v2/tracks?${queryParams}${queryPagination}${queryFields}`)
  .then(response => 
  {
    if (!response.ok)
    {
      debug.error(response);
      return null;
    }
    
    return response.json();
  })
  .catch(reason =>
  {
    debug.warn(reason);
    return null;
  });
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


// ************************************************************************************************
// Fetch terms
// ************************************************************************************************

function fetchTerms(termType, termIds, maxItems = 50)
{
  debug.log(`fetchTerms() - termType: ${termType} - termIds: ${(termIds.length > 0) ? termIds : 'Empty'} - maxItems: ${maxItems}`);

  return fetch(`/wp-json/wp/v2/${termType}?include=${termIds}&per_page=${maxItems}&_fields=id,link,name`)
  .then(response => 
  {
    if (!response.ok)
    {
      debug.error(response);
      return null;
    }
    
    return response.json();
  })
  .catch(reason =>
  {
    debug.warn(reason);
    return null;
  });
}
