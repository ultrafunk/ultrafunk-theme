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
  escHtml,
  fetchRest,
  getThumbnailData,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('single-track-next');

const m = {
  cueOrPlayTrackById: null,
  trackDateTime:      null,
  nextTrack:          null,
  isNextTrackLoading: false,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function isSingleTrackNext()
{
  return (document.body.matches('.single.track') && settings.experimental.singleTrackNextNoReload);
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
    m.trackDateTime      = document.querySelector('single-track').getAttribute('data-track-date-time');

    addEventListener('popstate', () => location.reload());
  }
}

export async function playNextSingleTrack(playTrack = false)
{
  m.isNextTrackLoading = true;

  if (isSingleTrackNext())
  {
    const restResponse = await fetchNextTrack(m.nextTrack);

    if ((restResponse !== null) && (restResponse.status.code === 200) && (restResponse.data.length !== 0))
    {
      m.nextTrack = restResponse.data[0];
  
      debug.log(`playNextSingleTrack() - playTrack: ${playTrack} - trackType: ${debug.getKeyForValue(TRACK_TYPE, m.nextTrack.meta.track_source_type)} => ${getTrackTitle(m.nextTrack.meta)}`);
  
      if (m.nextTrack.meta.track_source_type === TRACK_TYPE.YOUTUBE)
      {
        const thumbnailData = getThumbnailData(m.nextTrack.meta);
        m.cueOrPlayTrackById(m.nextTrack.meta, thumbnailData, playTrack);
        updatePage(restResponse.data, thumbnailData);
      }
      else
      {
        showSnackbar('SoundCloud track, skipping to next', 5, 'Play', () => 
        {
          sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify({ autoplay: true, trackId: null, position: 0 }));
          window.location.href = m.nextTrack.link;
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
//
// ************************************************************************************************

async function fetchNextTrack(currentTrack)
{
  let beforeTrackDate = null;

  if (currentTrack === null)
    beforeTrackDate = (m.trackDateTime !== '') ? m.trackDateTime : null;
  else
    beforeTrackDate = (currentTrack?.date !== undefined) ? currentTrack.date : null;

  if (beforeTrackDate !== null)
    return await fetchRest('tracks', `before=${beforeTrackDate}&per_page=2&_fields=id,date,link,meta,artists_links,channels_links`, true);

  return null;
}

function getTrackTitle(titleData)
{
  return `${titleData.track_artist} - ${titleData.track_title}`;
}


// ************************************************************************************************
//
// ************************************************************************************************

function updatePage(trackData, thumbnailData)
{
  updateNavLinks(document.querySelector('div.nav-links'), trackData);
  updateTrackHeader(document.querySelector('header.entry-header'), trackData[0]);
  updateTrackAttributes(trackData[0], thumbnailData);

  history.pushState({}, '', trackData[0].link);
  document.title = getTrackTitle(trackData[0].meta);
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

function updateNavLinks(element, trackData)
{
  let trackNavHtml = getTrackNavHtml(true, 
    encodeURIComponent(window.location.href),
    escHtml(document.querySelector('h2.entry-title').textContent)
  );
  
  response.prevPage = window.location.href;
  response.nextPage = null;
  
  if (trackData.length === 2)
  {
    trackNavHtml     += getTrackNavHtml(false, trackData[1].link, getTrackTitle(trackData[1].meta));
    response.nextPage = trackData[1].link;
  }

  element.innerHTML = trackNavHtml;
}

function updateTrackHeader(element, trackData)
{
  element.querySelector('h2.entry-title').textContent = getTrackTitle(trackData.meta);
  element.querySelector('div.entry-meta-artists  .term-links').innerHTML = trackData.artists_links;
  element.querySelector('div.entry-meta-channels .term-links').innerHTML = trackData.channels_links;
}

function setElementAttributes(element, attributes)
{
  Object.keys(attributes).forEach(key => element.setAttribute(`data-${key}`, attributes[key]));
}

function updateTrackAttributes(trackData, thumbnailData)
{
  setElementAttributes(document.querySelector('single-track'), {
    'track-type':        trackData.meta.track_source_type,
    'track-artist':      trackData.meta.track_artist,
    'track-title':       trackData.meta.track_title,
    'track-duration':    trackData.meta.track_duration,
    'track-source-data': trackData.meta.track_source_data,
  });

  setElementAttributes(document.querySelector('div.track-share-control span'), {
    'track-type':          trackData.meta.track_source_type,
    'track-artist':        trackData.meta.track_artist,
    'track-title':         trackData.meta.track_title,
    'track-url':           trackData.link,
    'track-thumbnail-url': thumbnailData.src,
    'track-source-uid':    thumbnailData.uid,
  });
}
