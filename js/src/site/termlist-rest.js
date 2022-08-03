//
// Termlist REST data fetch and caching
//
// https://ultrafunk.com
//


//import * as debugLogger from '../shared/debuglogger.js';
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


//const debug = debugLogger.newInstance('termlist-rest');
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
      showSnackbar('Failed to fetch track data!', 30, 'retry', () => loadTermlist(termlistContainer, termlistEntry, termlistBody));
    }

    if (!isAllChannels && (termData !== null))
    {
      fetchArtistMeta(termData, termId, 50, (metaType, metadata) =>
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
// Fetch tracks for a given termType with termId (channel or artist)
// ************************************************************************************************

async function fetchTracks(termType, termId, maxItems, callback)
{
  if ((termId in m.termCache) === false)
  {
    const restResponse = await fetchRest('tracks', `${termType}=${termId}&per_page=${maxItems}&_fields=id,link,artists,channels,meta`, true);

    if ((restResponse !== null) && (restResponse.status.code === 200))
      m.termCache[termId] = { tracks: restResponse.data };
  }

  callback((m.termCache[termId] !== undefined) ? m.termCache[termId].tracks : null);
}


// ************************************************************************************************
// Merge then fetch channels and artists for a given artist (termId)
// ************************************************************************************************

function fetchArtistMeta(termData, termId, maxItems, callback)
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

async function fetchMeta(
  termType,
  termId,
  termIds,
  maxItems,
  callback
)
{
  if (termIds.length > 0)
  {
    const restResponse = await fetchRest(termType, `include=${termIds}&per_page=${maxItems}&_fields=link,name`, true);

    if ((restResponse !== null) && (restResponse.status.code === 200))
      m.termCache[termId][termType] = restResponse.data;
  }

  callback(termType, (m.termCache[termId][termType] !== undefined) ? m.termCache[termId][termType] : null);
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
