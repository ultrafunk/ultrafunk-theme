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
  return (document.body.matches('.single.track') && settings.gallery.fetchNextSingleTrack);
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

    window.addEventListener('popstate', (event) => onPopState(event));
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

function onPopState(event)
{
  if (event.state === null)
  {
    location.reload();
  }
  else
  {
    // Set load next track DateTime to the right value for this page
    m.loadTracksDateTime = event.state[0].date;
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
  const trackArtistTitle = `<b>${trackMeta.track_artist}</b><br>${trackMeta.track_title}`;
  
  return /*html*/ `
    <div class="${isNavPrev ? 'nav-previous' : 'nav-next'}">
      <a href="${navUrl}" rel="${isNavPrev ? 'prev' : 'next'}">
        ${isNavPrev ? '<div class="prev-track-arrow">&#10094</div>' : ''}
        <div class="${isNavPrev ? 'prev-track-artist-title' : 'next-track-artist-title'}">${trackArtistTitle}</div>
        ${!isNavPrev ? '<div class="next-track-arrow">&#10095</div>' : ''}
      </a>
    </div>`;
}


// ************************************************************************************************
// Update DOM functions
// ************************************************************************************************

function updatePage(trackData, thumbnailData, pushState = true)
{
  response.prevPage = trackData[0].link;
  response.nextPage = (trackData.length === 3) ? trackData[2].link : null;

  updateSiteNavLinks(document.querySelectorAll('span.navbar-arrow-back'), response.prevPage);
  updateSiteNavLinks(document.querySelectorAll('span.navbar-arrow-fwd'), response.nextPage);
  updateTrackNavLinks(document.querySelector('div.nav-links'), trackData);
  updateTrackHeader(document.querySelector('header.entry-header'), trackData[1]);
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
  let trackNavHtml = getTrackNavHtml(true, response.prevPage, trackData[0].meta);
  
  if (trackData.length === 3)
    trackNavHtml += getTrackNavHtml(false, response.nextPage, trackData[2].meta);

  element.innerHTML = trackNavHtml;
}

function updateTrackHeader(element, trackData)
{
  element.querySelector('h2.entry-title').textContent          = getTrackTitle(trackData.meta);
  element.querySelector('h2.entry-title.type-split').innerHTML = `${trackData.meta.track_artist}<br><span class="light-text">${trackData.meta.track_title}</span>`;
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
