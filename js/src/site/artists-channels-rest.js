//
// Artists & Channels REST data fetch and caching
//
// https://ultrafunk.com
//


import { KEY }            from '../shared/storage.js';
import { showSnackbar }   from '../shared/snackbar.js';
import { stripAttribute } from '../shared/utils.js';

import {
  HTTP_RESPONSE,
  fetchRest,
} from '../shared/fetch-rest.js';

import {
  getTermlistHtml,
  getTermLinksHtml,
  getTopArtistsLinksHtml,
} from './artists-channels-templates.js';


/*************************************************************************************************/


const m = { termCache: {} };


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
    const header  = isAllChannels ? 'Latest Tracks' : 'All Tracks';
    const element = termlistBody.querySelector('.body-left');

    if (termData !== null)
    {
      element.innerHTML = getTermlistHtml(header, termSlug, termData);
      termlistEntry.setAttribute('data-is-fetched', 1);
    }
    else
    {
      showSnackbar({
        message: 'Failed to fetch track data!',
        duration: 30,
        actionText: 'retry',
        actionClickCallback: () => loadTermlist(termlistContainer, termlistEntry, termlistBody),
      });
    }

    if (!isAllChannels && (termData !== null))
      setArtistsMeta(termData, termId, termlistBody);
    else if (termData !== null)
      setTopArtists(termId, termlistBody, termSlug);
  });
}

function setArtistsMeta(termData, termId, termlistBody)
{
  fetchArtistMeta(termData, termId, 50, (metaType, metadata) =>
  {
    const header  = (metaType === 'artists') ? 'Related Artists' : 'In Channels';
    const element = (metaType === 'artists')
                      ? termlistBody.querySelector('.artists')
                      : termlistBody.querySelector('.channels');

    if (metadata !== null)
      element.innerHTML = getTermLinksHtml(header, metadata);
    else
      element.innerHTML = `<b>${header}</b><br>None found`;
  });
}

async function setTopArtists(termId, termlistBody, termSlug)
{
  if (('topArtists' in m.termCache[termId]) === false)
  {
    const restResponse = await fetchRest({
      endpoint: 'top-artists',
      query:    `channel_id=${termId}`,
      path:     '/wp-json/ultrafunk/v1/',
    });

    if (restResponse.status.code === HTTP_RESPONSE.OK)
      m.termCache[termId]['topArtists'] = restResponse.data;
  }

  termlistBody.querySelector('.top-artists').innerHTML = getTopArtistsLinksHtml('Top Artists (tracks)', m.termCache[termId]['topArtists'], termSlug);
}


// ************************************************************************************************
// Fetch tracks for a given termType with termId (channel or artist)
// ************************************************************************************************

async function fetchTracks(termType, termId, maxItems, callback)
{
  if ((termId in m.termCache) === false)
  {
    const restResponse = await fetchRest({
      endpoint: 'tracks',
      query:    `${termType}=${termId}&per_page=${maxItems}&_fields=id,link,artists,channels,meta`,
    });

    if (restResponse.status.code === HTTP_RESPONSE.OK)
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

// eslint-disable-next-line max-params
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
    const restResponse = await fetchRest({
      endpoint: termType,
      query:    `include=${termIds}&per_page=${maxItems}&_fields=link,name`,
    });

    if (restResponse.status.code === HTTP_RESPONSE.OK)
      m.termCache[termId][termType] = restResponse.data;
  }
  else
  {
    m.termCache[termId][termType] = null;
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
