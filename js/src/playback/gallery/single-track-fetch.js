//
// Fetch & play single (standalone) tracks without page load
//
// https://ultrafunk.com
//


import { newDebugLogger }    from '../../shared/debuglogger.js';
import { KEY }               from '../../shared/storage.js';
import { showSnackbar }      from '../../shared/snackbar.js';
import { shuffleClickNavTo } from '../common/shared-gallery-list.js';

import {
  TRACK_TYPE,
  getThumbnailData,
} from '../common/mediaplayer.js';

import {
  response,
  settings,
} from '../../shared/session-data.js';

import {
  HTTP_RESPONSE,
  fetchRest,
} from '../../shared/fetch-rest.js';


/*************************************************************************************************/


const debug = newDebugLogger('single-track-fetch');

const m = {
  cueOrPlayTrackById: null,
  prevTrackDateTime:  null,
  nextTrackDateTime:  null,
  isTrackLoading:     false,
};

export const SINGLE_TRACK = {
  PREV: 1,
  NEXT: 2,
};


// ************************************************************************************************
// Exports
// ************************************************************************************************

export function isSingleTrackFetch()
{
  return (document.body.matches('.single.track') && settings.gallery.fetchSingleTracks);
}

export function isSingleTrackLoading()
{
  return m.isTrackLoading;
}

export function singleTrackFetchReady(cueOrPlayTrackByIdCallback)
{
  if (isSingleTrackFetch())
  {
    debug.log('singleTrackFetchReady()');

    m.cueOrPlayTrackById = cueOrPlayTrackByIdCallback;
    m.prevTrackDateTime  = document.querySelector('single-track').getAttribute('data-prev-track-date-time');
    m.nextTrackDateTime  = document.querySelector('single-track').getAttribute('data-next-track-date-time');

    window.addEventListener('popstate', (event) => onPopState(event));
  }
}

export async function cueOrPlaySingleTrack(prevNextTrack, playTrack = false)
{
  if (isSingleTrackFetch())
  {
    m.isTrackLoading   = true;
    const restResponse = await fetchTracks(prevNextTrack);

    if ((restResponse.status.code === HTTP_RESPONSE.OK) && (restResponse.data.length > 1))
    {
      cueOrPlayFetchedTrack(prevNextTrack, playTrack, restResponse);
    }
    else
    {
      if (restResponse.status.code !== HTTP_RESPONSE.OK)
      {
        showSnackbar({
          message: 'Failed to fetch track data!',
          duration: 30,
          actionText: 'Retry',
          actionClickCallback: () => cueOrPlaySingleTrack(prevNextTrack, playTrack),
        });
      }
      else if ((restResponse.status.code === HTTP_RESPONSE.OK) && (restResponse.data.length === 1))
      {
        showSnackbar({
          message: 'No more tracks to play...',
          duration: 5,
          actionText: 'Shuffle',
          actionClickCallback: () => shuffleClickNavTo(),
        });
      }
    }
  }

  m.isTrackLoading = false;
}

function cueOrPlayFetchedTrack(prevNextTrack, playTrack, restResponse)
{
  if (prevNextTrack === SINGLE_TRACK.PREV)
  {
    restResponse.data.reverse();

    if (restResponse.data.length === 2)
      restResponse.data.unshift(null);
  }

  m.prevTrackDateTime = (restResponse.data.length === 3) ? restResponse.data[2].date : '';
  m.nextTrackDateTime = (restResponse.data[0] !== null)  ? restResponse.data[0].date : '';
  const currentTrack  = restResponse.data[1];

  debug.log(`cueOrPlayFetchedTrack() - prevNextTrack: ${debug.getKeyForValue(SINGLE_TRACK, prevNextTrack)} - playTrack: ${playTrack} - trackType: ${debug.getKeyForValue(TRACK_TYPE, currentTrack.meta.track_source_type)} => ${getTrackTitle(currentTrack.meta)}`);

  if (currentTrack.meta.track_source_type === TRACK_TYPE.YOUTUBE)
  {
    updatePlayerAndPage(restResponse.data, playTrack, true);
  }
  else
  {
    showSnackbar({
      message: 'SoundCloud track, skipping to next',
      duration: 5,
      actionText: 'Play',
      actionClickCallback: () =>
      {
        sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify({ autoplay: true, trackId: null, position: 0 }));
        window.location.href = currentTrack.link;
      },
      afterCloseCallback: () => cueOrPlaySingleTrack(prevNextTrack, playTrack),
    });
  }
}


// ************************************************************************************************
// Support functions
// ************************************************************************************************

function fetchTracks(prevNextTrack)
{
  if (prevNextTrack === SINGLE_TRACK.NEXT)
  {
    const queryTracksDateTime = (m.nextTrackDateTime !== '') ? m.nextTrackDateTime : '3000-01-01T00:00:01'; // Before the year 3000 should be enough for a while...

    return fetchRest({
      endpoint: 'tracks',
      query:    `before=${queryTracksDateTime}&per_page=3&separator=true&_fields=id,date,link,meta,artists_links,channels_links`,
    });
  }
  else
  {
    const queryTracksDateTime = (m.prevTrackDateTime !== '') ? m.prevTrackDateTime : '1000-01-01T00:00:01'; // After the year 1000 should be enough for a while...

    return fetchRest({
      endpoint: 'tracks',
      query:    `after=${queryTracksDateTime}&order=asc&per_page=3&separator=true&_fields=id,date,link,meta,artists_links,channels_links`,
    });
  }
}

function onPopState(event)
{
  if (event.state === null)
  {
    location.reload();
  }
  else
  {
    // Set prev next track DateTime to the right values for this page
    m.prevTrackDateTime = (event.state.length === 3) ? event.state[2].date : '';
    m.nextTrackDateTime = (event.state[0] !== null)  ? event.state[0].date : '';

    updatePlayerAndPage(event.state, false, false);
  }
}

function getTrackTitle(titleData)
{
  return `${titleData.track_artist} - ${titleData.track_title}`;
}

function updatePlayerAndPage(trackData, playTrack = false, pushState = true)
{
  const thumbnailData = getThumbnailData(trackData[1].meta);

  m.cueOrPlayTrackById(trackData[1].meta, thumbnailData, playTrack);
  updatePage(trackData, thumbnailData, pushState);
}

function getTrackNavHtml(isNavPrev, navUrl, trackMeta)
{
  const trackArtistTitle  = `<b>${trackMeta.track_artist}</b><br>${trackMeta.track_title}`;
  const prevNextThumbnail = getThumbnailData(trackMeta);
  const prevNextThumbHtml = /*html*/ `
    <div class="${isNavPrev ? 'prev' : 'next'}-track-nav-thumbnail ${prevNextThumbnail.class}">
      <img src="${prevNextThumbnail.src}" alt="${isNavPrev ? 'Previous' : 'Next'} Track Thumbnail">
    </div>`;

  return /*html*/ `
    <div class="${isNavPrev ? 'nav-previous' : 'nav-next'}">
      <a href="${navUrl}" rel="${isNavPrev ? 'prev' : 'next'}" title="${isNavPrev ? 'Go to Previous track' : 'Go to Next track'}">
        ${isNavPrev ? '<div class="prev-track-arrow">&#10094;</div>' : ''}
        ${isNavPrev ? prevNextThumbHtml : ''}
        <div class="${isNavPrev ? 'prev-track-artist-title' : 'next-track-artist-title'}">${trackArtistTitle}</div>
        ${!isNavPrev ? prevNextThumbHtml : ''}
        ${!isNavPrev ? '<div class="next-track-arrow">&#10095;</div>' : ''}
      </a>
    </div>`;
}


// ************************************************************************************************
// Update DOM functions
// ************************************************************************************************

function updatePage(trackData, thumbnailData, pushState = true)
{
  response.prevPage = (trackData[0] !== null)  ? trackData[0].link : null;
  response.nextPage = (trackData.length === 3) ? trackData[2].link : null;

  updateSiteNavLinks(document.querySelectorAll('span.navbar-arrow-prev'), response.prevPage);
  updateSiteNavLinks(document.querySelectorAll('span.navbar-arrow-next'), response.nextPage);
  updateTrackNavLinks(document.querySelector('div.nav-links'), trackData);
  updateTrackHeader(document.querySelector('header.track-header'), trackData[1]);
  updateTrackAttributes(document.querySelector('single-track'), trackData[1], thumbnailData);

  if (pushState)
    history.pushState(trackData, '', trackData[1].link);

  document.title = getTrackTitle(trackData[1].meta);
}

function updateSiteNavLinks(elements, url)
{
  elements?.forEach(element => { element.closest('a').href = (url !== null) ? url : '#'; });
}

function updateTrackNavLinks(element, trackData)
{
  let trackNavHtml = '';

  if (trackData[0] !== null)
    trackNavHtml += getTrackNavHtml(true, response.prevPage, trackData[0].meta);

  if (trackData.length === 3)
    trackNavHtml += getTrackNavHtml(false, response.nextPage, trackData[2].meta);

  element.innerHTML = trackNavHtml;
}

function updateTrackHeader(element, trackData)
{
  element.querySelector('h2.track-artist-title').innerHTML            = `${trackData.meta.track_artist}<span class="normal-text"> &nbsp;&#8212;&nbsp; ${trackData.meta.track_title}</span>`;
  element.querySelector('h2.track-artist-title.type-split').innerHTML = `${trackData.meta.track_artist}<br><span class="track-title-part">${trackData.meta.track_title}</span>`;
  element.querySelector('div.track-meta-artists  .track-artists-links').innerHTML  = trackData.artists_links;
  element.querySelector('div.track-meta-channels .track-channels-links').innerHTML = trackData.channels_links;
}

function updateTrackAttributes(element, trackData, thumbnailData)
{
  const attributes = {
    'track-type':          trackData.meta.track_source_type,
    'track-artist':        trackData.meta.track_artist,
    'track-title':         trackData.meta.track_title,
    'track-duration':      trackData.meta.track_duration,
    'track-url':           trackData.link,
    'track-thumbnail-url': thumbnailData.src,
    'track-source-uid':    thumbnailData.uid,
  };

  Object.keys(attributes).forEach(key => element.setAttribute(`data-${key}`, attributes[key]));
}
