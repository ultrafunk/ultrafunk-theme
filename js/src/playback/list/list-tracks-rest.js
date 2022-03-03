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
// Fetch tracks + terms
// ************************************************************************************************

function getShuffleParams()
{
  let shuffleParams = '';

  if (responseData.requestType.shuffle)
  {
    shuffleParams = `&shuffle=true&shuffle_type=${responseData.requestType.shuffle_type}`;

    if (responseData.requestType.shuffle_slug !== null)
      shuffleParams += `&shuffle_slug=${responseData.requestType.shuffle_slug}`;

    debug.log(`getShuffleParams(): ${shuffleParams}`);
  }

  return shuffleParams;
}

function fetchTracks(termType = '', termId = '', page = 1, tracksPerPage = 25)
{
  debug.log(`fetchTracks() - termType: ${(termType.length === 0) ? 'N/A' : termType} - termId: ${(termId.length === 0) ? 'N/A' : termId} - page: ${page} - tracksPerPage: ${tracksPerPage}`);

  let termQueryArgs = '';

  if ((termType.length !== 0) && (termId.length !== 0))
    termQueryArgs = `${termType}=${parseInt(termId)}&`;

  return fetch(`/wp-json/wp/v2/tracks?${termQueryArgs}page=${page}&per_page=${tracksPerPage}&_fields=id,link,artists,channels,meta${getShuffleParams()}`)
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
