//
// Termlist REST data fetch and caching
//
// https://ultrafunk.com
//


import * as debugLogger from '../shared/debuglogger.js';
import { KEY }          from '../shared/storage.js';
import { showSnackbar } from '../shared/snackbar.js';

import {
  fetchRest,
  stripAttribute,
} from '../shared/utils.js';

import {
  getTermlistHtml,
  getTermLinksHtml,
  getTopArtistsLinksHtml,
} from './termlist-templates.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('termlist-rest');
const m     = { termCache: {} };


// ************************************************************************************************
// Fetch data via REST API and update DOM with results
// ************************************************************************************************

export function loadTermlist(termlistContainer, termlistEntry, termlistBody)
{
  const termType      = stripAttribute(termlistContainer, 'data-term-type');
  const termId        = parseInt(termlistEntry.getAttribute('data-term-id'));
  const termSlug      = stripAttribute(termlistEntry, 'data-term-slug');
  const isAllChannels = (termType === 'channels');

  fetchTracks(termType, termId, (isAllChannels ? 10 : 50), async (termData) => 
  {
    let header  = isAllChannels ? 'Latest Tracks' : 'All Tracks';
    let element = termlistBody.querySelector('.body-left');

    if (termData !== null)
    {
      element.innerHTML = getTermlistHtml(header, termSlug, termData);
      termlistEntry.classList.add('data-fetched');
    }
    else
    {
      showSnackbar('Unable to fetch track data, please try again...', 10);
    }

    if (!isAllChannels && (termData !== null))
    {
      fetchTermMeta(termData, termId, 50, (metaType, metadata) =>
      {
        header  = (metaType === 'artists') ? 'Related Artists' : 'In Channels';
        element = (metaType === 'artists')
                    ? termlistBody.querySelector('.artists')
                    : termlistBody.querySelector('.channels');

        if (metadata !== null)
          element.innerHTML = getTermLinksHtml(header, metadata);
        else
          element.innerHTML = `<b>${header}</b><br>None found`;
      });
    }
    else if (termData !== null)
    {
      if (('topArtists' in m.termCache[termId]) === false)
      {
        const restResponse = await fetchRest('top-artists', `channelId=${termId}`, true, '/wp-json/ultrafunk/v1/');

        if ((restResponse !== null) && (restResponse.status.code === 200))
          m.termCache[termId]['topArtists'] = restResponse.data;
      }

      termlistBody.querySelector('.top-artists').innerHTML = getTopArtistsLinksHtml('Top Artists (tracks)', m.termCache[termId]['topArtists'], termSlug);
    }
  });
}


// ************************************************************************************************
// Fetch tracks for a given termType with termId (taxonomy: channel or artist)
// ************************************************************************************************

function fetchTracks(termType, termId, maxItems, callback)
{ 
  if (termId in m.termCache)
  {
    callback(m.termCache[termId].tracks);
  }
  else
  {
    debug.log(`fetchTracks() - termType: ${termType} - termId: ${termId} - maxItems: ${maxItems}`);

    fetch(`/wp-json/wp/v2/tracks?${termType}=${termId}&per_page=${maxItems}&_fields=id,link,artists,channels,meta`)
    .then(response => 
    {
      if (!response.ok)
      {
        debug.error(response);
        return null;
      }
      
      return response.json();
    })
    .then(data =>
    {
      m.termCache[termId] = { tracks: data };
      callback(data);
    })
    .catch(reason =>
    {
      debug.warn(reason);
      callback(null);
    });
  }
}


// ************************************************************************************************
// Merge then fetch metadata for a given termType with termIds (taxonomy: category or tag)
// ************************************************************************************************

function fetchTermMeta(termData, termId, maxItems, callback)
{
  if (('channels' in m.termCache[termId]) && ('artists' in m.termCache[termId]))
  {
    callback('channels', m.termCache[termId].channels);
    callback('artists',  m.termCache[termId].artists);
  }
  else
  {
    const channels = [];
    let   artists  = [];
  
    termData.forEach(item =>
    {
      channels.push.apply(channels, item.channels);
      artists.push.apply(artists, item.artists);
    });
  
    artists = artists.filter(item => (item !== termId));
  
    fetchMeta('channels', termId, [...new Set(channels)], maxItems, callback);
    fetchMeta('artists',  termId, [...new Set(artists)],  maxItems, callback);
  }
}

function fetchMeta(
  termType,
  termId,
  termIds,
  maxItems,
  callback
)
{
  /*
  if ((termId in termCache) === false)
    termCache[termId] = {};
  */

  if (termIds.length > 0)
  {
    debug.log(`fetchMeta() - termType: ${termType} - termIds: ${(termIds.length > 0) ? termIds : 'Empty'} - maxItems: ${maxItems}`);

    fetch(`/wp-json/wp/v2/${termType}?include=${termIds}&per_page=${maxItems}&_fields=link,name`)
    .then(response => 
    {
      if (!response.ok)
      {
        debug.error(response);
        return null;
      }
      
      return response.json();
    })
    .then(data =>
    {
      m.termCache[termId][termType] = data;
      callback(termType, data);
    })
    .catch(reason =>
    {
      debug.warn(reason);
      callback(null);
    });
  }
  else
  {
    m.termCache[termId][termType] = null;
    callback(termType, null);
  }
}


// ************************************************************************************************
// Term cache functions
// ************************************************************************************************

export function readCache()
{
  m.termCache = JSON.parse(sessionStorage.getItem(KEY.UF_TERMLIST_CACHE));
  
  if (m.termCache === null)
    m.termCache = {};
}

export function writeCache()
{
  sessionStorage.setItem(KEY.UF_TERMLIST_CACHE, JSON.stringify(m.termCache));
}

export function deleteCache()
{
  sessionStorage.removeItem(KEY.UF_TERMLIST_CACHE);
}

export function hasCache()
{
  return (Object.keys(m.termCache).length > 0);
}
