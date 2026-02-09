//
// Local (device) tracks loading and controls
//
// https://ultrafunk.com
//


import { showSnackbar } from '../../shared/snackbar.js';
import { TRACK_TYPE }   from '../common/mediaplayer.js';
import { settings }     from '../../shared/session-data.js';

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

import {
  getTrackEntryHtml,
  getTracksTitleHtml,
} from './list-track-templates.js';

import {
//closeModal,
  showModal,
  updateModalBody,
} from '../../shared/modal.js';


/*************************************************************************************************/


const debug = newDebugLogger('local-tracks');

const m = {
  jsmediatags: null,
  audioFilesArray: [],
  addTracksStartTime: 0,
  addTracksHtmlTime:  0,
  modalId: 0,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function initLocalTracks()
{
  debug.log('init()');

  document.getElementById('tracklist').insertAdjacentHTML("beforeend", getTracklistLocalHtml());

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

function getTracklistLocalHtml()
{
  return /*html*/ `
    <div id="tracklist-local">
      <label for="select-local-files">Add local tracks:</label>
      <input id="select-local-files" type="file" accept="audio/*" ${settings.list.addTracksFromFolders ? 'webkitdirectory' : ''} multiple />
      <button id="clear-local-tracks" type="button">Clear Tracks</button>
    </div>`;
}

function getSelectedFiles(eventType, audioFilesList)
{
  if ((eventType === 'cancel') || (audioFilesList.length === 0))
  {
    showSnackbar({ message: 'No local tracks selected', duration: 3 });
    return;
  }

  m.addTracksStartTime = performance.now();

  populateAudioFilesArray(audioFilesList);

  if (m.audioFilesArray.length === 0)
  {
    showModal({ modalTitle: 'Error!', modalBody: `<p>No valid audio files were selected.</p>`});
  }
  else
  {
    showTracksLoadingUi();

    if (m.jsmediatags === null)
      loadJsMediaTagsScript();
    else
      setTimeout(() => inserLocalTracksHtml(), 0); // Yield here so loading UI displays immediately
  }
}

function populateAudioFilesArray(audioFilesList)
{
  if (settings.list.addTracksFromFolders)
  {
    m.audioFilesArray = [];

    for (const audioFile of audioFilesList)
    {
      if (isAudioFile(audioFile.name))
      {
        audioFile.trackPath = audioFile.webkitRelativePath.slice(0, audioFile.webkitRelativePath.lastIndexOf('/'));
        m.audioFilesArray.push(audioFile);
      }
    }

    m.audioFilesArray.sort((a, b) => a.trackPath.localeCompare(b.trackPath));
  }
  else
  {
    m.audioFilesArray = Array.from(audioFilesList);

    if (settings.list.sortLocalTracks)
      m.audioFilesArray.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function isAudioFile(fileName)
{
  const audioFormatExtensions = ['.opus',  '.flac', '.webm', '.weba', '.wav', '.ogg', '.m4a', '.oga', '.mid', '.mp3', '.aiff', '.wma', '.au'];

  for (const extension of audioFormatExtensions)
  {
    if (fileName.endsWith(extension))
      return true;

    if (fileName.toUpperCase().endsWith(extension.toUpperCase()))
      return true;
  }

  return false;
}

function showTracksLoadingUi()
{
  if (m.audioFilesArray.length > 25)
  {
    m.modalId = showModal({ modalTitle: 'Adding local traks', modalBody: `<p>Loading track 1 of ${m.audioFilesArray.length}...<br>Time used: ... sec.</p>`});
  }
  else
  {
    showSnackbar({
      message: `Adding ${m.audioFilesArray.length} local ${(m.audioFilesArray.length === 1) ? 'track' : 'tracks'}...`,
      showImmediate: true,
      duration: 5,
    });
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
    setTimeout(() => inserLocalTracksHtml(), 0); // Yield here so loading UI displays immediately
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

  queryTrackAll('div.tracklist-page-separator.local-tracks-title')?.forEach(trackElement => trackElement.remove());

  // Clear previously selected files from the form value
  document.getElementById('select-local-files').value = '';

  showSnackbar({ message: 'Local tracks removed', duration: 3 });
}

function updateLoadingModal(modalBody)
{
  if (m.modalId > 0)
    updateModalBody(m.modalId, modalBody);
}

function getTracksLoadTime()
{
  return `Time used: ${Math.round((performance.now() - m.addTracksStartTime) / 1000)} sec.`;
}

function logPerfTime(filesCount)
{
  const totalTime      = Math.ceil(performance.now() - m.addTracksStartTime);
  const insertHtmlTime = Math.ceil(m.addTracksHtmlTime - m.addTracksStartTime);

  console.log(`%cAdded ${filesCount} local track(s) in ${totalTime} ms. (insert HTML: ${insertHtmlTime} ms.) for ${THEME_ENV.siteUrl}`, logCss);
  updateLoadingModal(`<p>Loading track ${filesCount} of ${filesCount}... <b>Done!</b><br>Time used: ${Math.round(totalTime / 1000)} sec.</p>`);
//setTimeout(() => closeModal(m.modalId), 5000);
}


// ************************************************************************************************
//
// ************************************************************************************************

function inserLocalTracksHtml()
{
  let tracksPath = '';
  let tracksHtml = '';

  m.audioFilesArray.forEach((file, index) =>
  {
    if ((settings.list.addTracksFromFolders) && (tracksPath !== file.trackPath))
    {
      tracksPath = file.trackPath;
      tracksHtml += getTracksTitleHtml(tracksPath.slice(tracksPath.lastIndexOf('/') + 1));
    }

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

  m.audioFilesArray.forEach((file) =>
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

        if (++processedTracks === m.audioFilesArray.length)
          logPerfTime(m.audioFilesArray.length);
        else
          updateLoadingModal(`<p>Loading track ${processedTracks} of ${m.audioFilesArray.length}...<br>${getTracksLoadTime()}</p>`);
      },
      onError: () =>
      {
        setFallbackTrackArtistTitle(trackElement, filenameNoExt);

        if (++processedTracks === m.audioFilesArray.length)
          logPerfTime(m.audioFilesArray.length);
        else
          updateLoadingModal(`<p>Loading track ${processedTracks} of ${m.audioFilesArray.length}...<br>${getTracksLoadTime()}</p>`);
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

    if ((tags.artist !== undefined) && (tags.artist.trim().length !== 0))
      artist = stripHtml(tags.artist);

    if ((tags.title !== undefined) && (tags.title.trim().length !== 0))
      title = stripHtml(tags.title);

    trackElement.setAttribute('data-track-artist', artist);
    trackElement.setAttribute('data-track-title',  title);
    trackElement.querySelector('div.artist-title').innerHTML = `<span><b>${artist}</b></span><br><span>${title}</span>`;
  }

  setTrackImages(tags, trackElement);
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

function setTrackImages(tags, trackElement)
{
  if ((tags.picture !== undefined) && (tags.picture.data.length > 0))
  {
    const trackImage = new Image();
    const imageBlob  = new Blob([new Uint8Array(tags.picture.data).buffer], { type: tags.picture.format });
    const imageUrl   = encodeURI(URL.createObjectURL(imageBlob));

    trackImage.src = imageUrl;

    trackImage.onload = () =>
    {
      trackElement.querySelector('button.thumbnail img').src = imageUrl;
      trackElement.setAttribute('data-track-thumbnail-url', imageUrl);
      trackElement.setAttribute('data-track-image-url', imageUrl);
    };

    trackImage.onerror = () =>
    {
      debug.warn(`setTrackImages() failed for: ${trackElement.getAttribute('data-track-artist')} - "${trackElement.getAttribute('data-track-title')}"`);
    };
  }
}
