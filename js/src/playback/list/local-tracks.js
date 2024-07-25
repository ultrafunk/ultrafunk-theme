//
// Local (device) tracks loading and controls
//
// https://ultrafunk.com
//


import { showSnackbar }      from '../../shared/snackbar.js';
import { TRACK_TYPE }        from '../common/mediaplayer.js';
import { getTrackEntryHtml } from './list-track-templates.js';
import { queryTrackAll }     from './list-controls.js';

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


/*************************************************************************************************/


const debug = newDebugLogger('local-tracks');

const m = {
  jsmediatags: null,
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

  addListener('#select-local-files', 'change', (event) => getSelectedFiles(event.target.files));
  addListener('#select-local-files', 'cancel', (event) => getSelectedFiles(event.target.files));
  addListener('#clear-local-tracks', 'click',  clearLocalTracks);
}


// ************************************************************************************************
//
// ************************************************************************************************

function getSelectedFiles(filesList)
{
  if (filesList.length === 0)
  {
    showSnackbar({ message: 'No tracks selected', duration: 3 });
  }
  else
  {
    showSnackbar({ message: `Adding ${filesList.length} local ${(filesList.length === 1) ? 'track' : 'tracks'}...`, duration: 4 });

    m.addTracksStartTime = performance.now();

    if (m.jsmediatags === null)
      loadJsMediaTagsScript(() => setTracksMetadata(filesList, inserLocalTracksHtml(filesList)));
    else
      setTracksMetadata(filesList, inserLocalTracksHtml(filesList));
  }
}

function loadJsMediaTagsScript(onLoadedCallback)
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
    onLoadedCallback();
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

  showSnackbar({ message: 'Local tracks removed', duration: 3 });
}

function logPerfTime(filesCount)
{
  const addTracksStop = performance.now();
  console.log(`%cAdded ${filesCount} local track(s) in ${Math.ceil(addTracksStop - m.addTracksStartTime)} ms. (insert HTML: ${Math.ceil(m.addTracksHtmlTime - m.addTracksStartTime)} ms.) for ${THEME_ENV.siteUrl}`, logCss);
}


// ************************************************************************************************
//
// ************************************************************************************************

function inserLocalTracksHtml(filesList)
{
  const tracksUid = [];
  let index       = 0;
  let tracksHtml  = '';

  for (const file of filesList)
  {
    const trackUri = encodeURI(URL.createObjectURL(file));

    tracksUid.push(`track-${(Date.now() + index)}`);

    tracksHtml += getTrackEntryHtml(
    {
      uid: tracksUid[index++],
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
  }

  document.getElementById('tracklist').insertAdjacentHTML("beforeend", tracksHtml);
  m.addTracksHtmlTime = performance.now();

  return tracksUid;
}

function setTracksMetadata(filesList, tracksUid)
{
  let index = 0;
  let processedTracks = 0;

  for (const file of filesList)
  {
    const trackElement  = document.getElementById(tracksUid[index++]);
    const fileName      = stripHtml(escHtml(file.name));
    const fileExtIndex  = fileName.lastIndexOf('.');
    const fileNameNoExt = (fileExtIndex !== -1) ? fileName.slice(0, fileExtIndex) : fileName;
    const fileType      = (fileExtIndex !== -1) ? fileName.slice(fileExtIndex + 1).toUpperCase() : file.type;

    trackElement.setAttribute('data-track-image-url', THEME_ENV.defaultLTImagePlaceholder);
    trackElement.setAttribute('data-track-file-name', fileName);
    trackElement.setAttribute('data-track-file-type', fileType);
    trackElement.setAttribute('data-track-file-size', file.size);

    m.jsmediatags.read(file,
    {
      onSuccess: (mediaTags) =>
      {
        if (Object.keys(mediaTags.tags).length !== 0)
          setTrackArtistTitle(mediaTags.tags, trackElement, fileNameNoExt);
        else
          setFallbackTrackArtistTitle(trackElement, fileNameNoExt);

        if (++processedTracks === filesList.length)
          logPerfTime(filesList.length);
      },
      onError: () =>
      {
        setFallbackTrackArtistTitle(trackElement, fileNameNoExt);

        if (++processedTracks === filesList.length)
          logPerfTime(filesList.length);
      }
    });
  }
}

function setTrackArtistTitle(tags, trackElement, fileNameNoExt)
{
  if ((tags.artist === undefined) && (tags.title === undefined))
  {
    setFallbackTrackArtistTitle(trackElement, fileNameNoExt);
  }
  else
  {
    let artist = fileNameNoExt;
    let title  = fileNameNoExt;

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

function setFallbackTrackArtistTitle(trackElement, fileNameNoExt)
{
  trackElement.setAttribute('data-track-artist', fileNameNoExt);
  trackElement.querySelector('div.artist-title').innerHTML = `<span><b>${fileNameNoExt}</b></span>`;
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
