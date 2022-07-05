//
// Play next single gallery track without page reload SPA style...
//
// https://ultrafunk.com
//


import * as debugLogger from '../../shared/debuglogger.js';
import { KEY }          from '../../shared/storage.js';
import { TRACK_TYPE }   from '../mediaplayers.js';
import { showSnackbar } from '../../shared/snackbar.js';

import {
  response,
  settings,
} from '../../shared/session-data.js';

import {
  fetchRest,
  getThumbnailData,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('single-track-next');

const m = {
  cueOrPlayTrackById: null,
  startTrackDateTime: null,
  loadTracksDateTime: null,
  isNextTrackLoading: false,
};


// ************************************************************************************************
// Exports
// ************************************************************************************************

export function isSingleTrackNext()
{
  return (document.body.matches('.single.track') && settings.gallery.singleTrackNextNoReload);
}

export function isNextTrackLoading()
{
  return m.isNextTrackLoading;
}

export function singleTrackNextReady(cueOrPlayTrackByIdCallback)
{
  if (isSingleTrackNext())
  {
    debug.log('ready()');

    m.cueOrPlayTrackById = cueOrPlayTrackByIdCallback;
    m.startTrackDateTime = document.querySelector('single-track').getAttribute('data-track-date-time');

    window.addEventListener('popstate', (event) =>
    {
      (event.state === null) ? location.reload() : updatePlayerAndPage(event.state, false, false);
    });
  }
}

export async function playNextSingleTrack(playTrack = false)
{
  if (isSingleTrackNext())
  {
    m.isNextTrackLoading = true;
    const restResponse   = await fetchTracks(m.loadTracksDateTime);

    if ((restResponse !== null) && (restResponse.status.code === 200) && (restResponse.data.length > 1))
    {
      m.loadTracksDateTime = restResponse.data[0].date;
      const currentTrack   = restResponse.data[1];
  
      debug.log(`playNextSingleTrack() - playTrack: ${playTrack} - trackType: ${debug.getKeyForValue(TRACK_TYPE, currentTrack.meta.track_source_type)} => ${getTrackTitle(currentTrack.meta)}`);
  
      if (currentTrack.meta.track_source_type === TRACK_TYPE.YOUTUBE)
      {
        updatePlayerAndPage(restResponse.data, playTrack, true);
      }
      else
      {
        showSnackbar('SoundCloud track, skipping to next', 5, 'Play', () => 
        {
          sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify({ autoplay: true, trackId: null, position: 0 }));
          window.location.href = currentTrack.link;
        },
        () => playNextSingleTrack(playTrack));
      }
    }
    else
    {
      if (restResponse.status.code !== 200)
        showSnackbar('Failed to fetch track data!', 10, 'Retry', () => playNextSingleTrack(playTrack));
    }
  }

  m.isNextTrackLoading = false;
}


// ************************************************************************************************
// Support functions
// ************************************************************************************************

function fetchTracks(tracksDateTime)
{
  let beforeTrackDateTime = tracksDateTime;

  if (tracksDateTime === null)
    beforeTrackDateTime = (m.startTrackDateTime !== '') ? m.startTrackDateTime : '3000-01-01T00:00:01'; // Before the year 3000 should be enough for a while...

  if (beforeTrackDateTime !== null)
    return fetchRest('tracks', `before=${beforeTrackDateTime}&per_page=3&_fields=id,date,link,meta,artists_links,channels_links`, true);

  return null;
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

function getTrackNavHtml(isNavPrev, navUrl, navTitle)
{
  return /*html*/ `
    <div class="${isNavPrev ? 'nav-previous' : 'nav-next'}">
      <a href="${navUrl}" rel="${isNavPrev ? 'prev' : 'next'}">
        <b>${isNavPrev ? '&#10094;&#10094; Previous Track' : 'Next Track &#10095;&#10095;'}</b><br>
        <span class="${isNavPrev ? 'prev-track-artist-title' : 'next-track-artist-title'}">${navTitle}</span>
      </a>
    </div>`;
}


// ************************************************************************************************
// Update DOM functions
// ************************************************************************************************

function updatePage(trackData, thumbnailData, pushState = true)
{
  updateNavLinks(document.querySelector('div.nav-links'), trackData);
  updateTrackHeader(document.querySelector('header.entry-header'), trackData[1]);
  updateTrackAttributes(document.querySelector('single-track'), trackData[1], thumbnailData);

  if (pushState)
    history.pushState(trackData, '', trackData[1].link);

  document.title = getTrackTitle(trackData[1].meta);
}

function updateNavLinks(element, trackData)
{
  let trackNavHtml = getTrackNavHtml(true, trackData[0].link, getTrackTitle(trackData[0].meta));
  
  response.prevPage = trackData[0].link;
  response.nextPage = null;
  
  if (trackData.length === 3)
  {
    trackNavHtml     += getTrackNavHtml(false, trackData[2].link, getTrackTitle(trackData[2].meta));
    response.nextPage = trackData[2].link;
  }

  element.innerHTML = trackNavHtml;
}

function updateTrackHeader(element, trackData)
{
  element.querySelector('h2.entry-title').textContent = getTrackTitle(trackData.meta);
  element.querySelector('div.entry-meta-artists  .term-links').innerHTML = trackData.artists_links;
  element.querySelector('div.entry-meta-channels .term-links').innerHTML = trackData.channels_links;
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
