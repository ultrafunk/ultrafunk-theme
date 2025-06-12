//
// Local (device) tracks loading and controls
//
// https://ultrafunk.com
//


import { showSnackbar }      from '../../shared/snackbar.js';
import { TRACK_TYPE }        from '../common/mediaplayer.js';
import { getTrackEntryHtml } from './list-track-templates.js';
import { settings }          from '../../shared/session-data.js';

import {
  newDebugLogger,
  logCss,
} from '../../shared/debuglogger.js';

import {
  VERSION,
  ULTRAFUNK_THEME_URI,
  THEME_ENV,
} from '../../config.js';

import {
  addListener,
  escHtml,
  stripHtml,
} from '../../shared/utils.js';

import {
  queryTrack,
  queryTrackAll,
} from './list-controls.js';


/*************************************************************************************************/


const debug = newDebugLogger('local-tracks');

const m = {
  jsmediatags: null,
  filesArray: [],
  addTracksStartTime: 0,
  addTracksHtmlTime:  0,
};

const tracklistLocalHtml = /*html*/ `
  <div id="tracklist-local">
    <label for="select-local-files">Add local tracks:</label>
    <input id="select-local-files" type="file" accept="audio/*" multiple />
    <button id="clear-local-tracks" type="button">Clear Tracks</button>
  </div>`;


// ************************************************************************************************
//
// ************************************************************************************************

export function initLocalTracks()
{
  debug.log('init()');

  document.getElementById('tracklist').insertAdjacentHTML("beforeend", tracklistLocalHtml);

  addListener('#select-local-files', 'change', (event) => getSelectedFiles('change', event.target.files));
  addListener('#select-local-files', 'cancel', ()      => getSelectedFiles('cancel'));
  addListener('#clear-local-tracks', 'click',  clearLocalTracks);
}

export function hasLoadedLocalTracks()
{
  return (queryTrack('div.track-entry.track-type-local') !== null);
}


// ************************************************************************************************
//
// ************************************************************************************************

function getSelectedFiles(eventType, filesList)
{
  if ((eventType === 'cancel') || (filesList.length === 0))
  {
    showSnackbar({ message: 'No local tracks selected', duration: 3 });
  }
  else
  {
    showSnackbar({
      message: `Adding ${filesList.length} local ${(filesList.length === 1) ? 'track' : 'tracks'}...`,
      showImmediate: true,
      duration: 5,
    });

    m.addTracksStartTime = performance.now();
    m.filesArray = Array.from(filesList);

    if (settings.list.sortLocalTracks)
      m.filesArray.sort((a, b) => a.name.localeCompare(b.name));

    if (m.jsmediatags === null)
      loadJsMediaTagsScript();
    else
      inserLocalTracksHtml();
  }
}

function loadJsMediaTagsScript()
{
  debug.log(`loadJsMediaTagsScript(): ${ULTRAFUNK_THEME_URI}/inc/js/jsmediatags.min.js?ver=${VERSION}`);

  const scriptTag      = document.createElement('script');
  const firstScriptTag = document.getElementsByTagName('script')[0];

  scriptTag.type = 'text/javascript';
  scriptTag.id   = 'js-media-tags';
  scriptTag.src  = `${ULTRAFUNK_THEME_URI}/inc/js/jsmediatags.min.js?ver=${VERSION}`;

  firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

  scriptTag.onload = () =>
  {
    m.jsmediatags = window.jsmediatags;
    inserLocalTracksHtml();
  };
}

function clearLocalTracks()
{
  queryTrackAll('div.track-entry.track-type-local')?.forEach(trackElement =>
  {
    if (trackElement.classList.contains('current') === false)
    {
      const trackBlobUrl      = trackElement.getAttribute('data-track-url');
      const trackImageBlobUrl = trackElement.getAttribute('data-track-image-url');

      if (trackBlobUrl !== null)
        URL.revokeObjectURL(trackBlobUrl);

      if ((trackImageBlobUrl !== null) && (trackImageBlobUrl.startsWith('blob:')))
        URL.revokeObjectURL(trackImageBlobUrl);

      trackElement.remove();
    }
  });

  // Clear previously selected files from the form value
  document.getElementById('select-local-files').value = '';

  showSnackbar({ message: 'Local tracks removed', duration: 3 });
}

function logPerfTime(filesCount)
{
  const totalTime      = Math.ceil(performance.now() - m.addTracksStartTime);
  const insertHtmlTime = Math.ceil(m.addTracksHtmlTime - m.addTracksStartTime);

  console.log(`%cAdded ${filesCount} local track(s) in ${totalTime} ms. (insert HTML: ${insertHtmlTime} ms.) for ${THEME_ENV.siteUrl}`, logCss);
}


// ************************************************************************************************
//
// ************************************************************************************************

function inserLocalTracksHtml()
{
  let tracksHtml = '';

  m.filesArray.forEach((file, index) =>
  {
    const trackUri = encodeURI(URL.createObjectURL(file));
    file.trackUid  = `track-${(Date.now() + index)}`;

    tracksHtml += getTrackEntryHtml(
    {
      uid: file.trackUid,
      id: 'local',
      link: trackUri,
      artists: [],
      channels: [],
      meta: {
        track_source_type: TRACK_TYPE.LOCAL,
        track_source_data: trackUri,
        track_artist: 'Loading...',
        track_title: '',
        track_duration: 0,
      }
    });
  });

  document.getElementById('tracklist').insertAdjacentHTML("beforeend", tracksHtml);
  m.addTracksHtmlTime = performance.now();

  setTracksMetadata();
}

function setTracksMetadata()
{
  let processedTracks = 0;

  m.filesArray.forEach((file) =>
  {
    const trackElement  = document.getElementById(file.trackUid);
    const filename      = stripHtml(escHtml(file.name));
    const fileExtIndex  = filename.lastIndexOf('.');
    const filenameNoExt = (fileExtIndex !== -1) ? filename.slice(0, fileExtIndex) : filename;
    const fileType      = (fileExtIndex !== -1) ? filename.slice(fileExtIndex + 1).toUpperCase() : file.type;

    trackElement.setAttribute('data-track-image-url', THEME_ENV.defaultLTImagePlaceholder);
    trackElement.setAttribute('data-track-filename',  filename);
    trackElement.setAttribute('data-track-file-type', fileType);
    trackElement.setAttribute('data-track-file-size', file.size);

    m.jsmediatags.read(file,
    {
      onSuccess: (mediaTags) =>
      {
        if (Object.keys(mediaTags.tags).length !== 0)
          setTrackArtistTitle(mediaTags.tags, trackElement, filenameNoExt);
        else
          setFallbackTrackArtistTitle(trackElement, filenameNoExt);

        if (++processedTracks === m.filesArray.length)
          logPerfTime(m.filesArray.length);
      },
      onError: () =>
      {
        setFallbackTrackArtistTitle(trackElement, filenameNoExt);

        if (++processedTracks === m.filesArray.length)
          logPerfTime(m.filesArray.length);
      }
    });
  });
}

function setTrackArtistTitle(tags, trackElement, filenameNoExt)
{
  if ((tags.artist === undefined) && (tags.title === undefined))
  {
    setFallbackTrackArtistTitle(trackElement, filenameNoExt);
  }
  else
  {
    let artist = filenameNoExt;
    let title  = filenameNoExt;

    if ((tags.artist !== undefined) && (tags.artist.length !== 0))
      artist = stripHtml(tags.artist);

    if ((tags.title !== undefined) && (tags.title.length !== 0))
      title = stripHtml(tags.title);

    trackElement.setAttribute('data-track-artist', artist);
    trackElement.setAttribute('data-track-title',  title);
    trackElement.querySelector('div.artist-title').innerHTML = `<span><b>${artist}</b></span><br><span>${title}</span>`;

    setTrackImages(tags, trackElement);
  }
}

function setFallbackTrackArtistTitle(trackElement, filenameNoExt)
{
  const trackArtistTitle = filenameNoExt.split(/\s{1,}[\u002D\u00B7\u2013]\s{1,}/, 2);

  if (trackArtistTitle.length === 2)
  {
    const trackArtist = trackArtistTitle[0];
    const trackTitle  = filenameNoExt.slice(filenameNoExt.indexOf(trackArtistTitle[1]));

    trackElement.setAttribute('data-track-artist', trackArtist);
    trackElement.setAttribute('data-track-title',  trackTitle);
    trackElement.querySelector('div.artist-title').innerHTML = `<span><b>${trackArtist}</b></span><br><span>${trackTitle}</span>`;
  }
  else
  {
    trackElement.setAttribute('data-track-artist', filenameNoExt);
    trackElement.querySelector('div.artist-title').innerHTML = `<span><b>${filenameNoExt}</b></span>`;
  }
}

async function setTrackImages(tags, trackElement)
{
  if (tags.picture !== undefined)
  {
    const trackImage = new Image();
    const imageBlob  = new Blob([new Uint8Array(tags.picture.data).buffer], { type: tags.picture.format });
    const imageUrl   = encodeURI(URL.createObjectURL(imageBlob));

    trackImage.src = imageUrl;
    await trackImage.decode();

    trackElement.querySelector('button.thumbnail img').src = imageUrl;
    trackElement.setAttribute('data-track-thumbnail-url', imageUrl);
    trackElement.setAttribute('data-track-image-url', imageUrl);
  }
}
