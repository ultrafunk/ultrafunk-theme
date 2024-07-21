//
// Local (device) tracks loading and controls
//
// https://ultrafunk.com
//


import { newDebugLogger }    from '../../shared/debuglogger.js';
import { showSnackbar }      from '../../shared/snackbar.js';
import { TRACK_TYPE }        from '../common/mediaplayer.js';
import { getTrackEntryHtml } from './list-track-templates.js';
import { queryTrackAll }     from './list-controls.js';
import { THEME_ENV }         from '../../config.js';

import {
  addListener,
  escHtml,
  stripHtml,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = newDebugLogger('local-tracks');
const m     = { id3js: null };

const tracklistLocalHtml = /*html*/ `
  <div id="tracklist-local">
    Add local tracks:&nbsp;&nbsp;<input id="select-local-files" type="file" accept="audio/*" multiple />
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

async function getSelectedFiles(filesList)
{
  if (filesList.length === 0)
  {
    showSnackbar({ message: 'No tracks selected', duration: 3 });
  }
  else
  {
    showSnackbar({ message: `Adding ${filesList.length} local ${(filesList.length === 1) ? 'track' : 'tracks'}...`, duration: 4 });

    try
    {
      if (m.id3js === null)
        m.id3js = await import('//unpkg.com/id3js@^2/lib/id3.js');
    }
    catch (error)
    {
      debug.error(error);
      showSnackbar({ message: 'Failed to load ID3 tag parser!', duration: 30 });
      return;
    }

    const tracksUid = inserLocalTracksHtml(filesList);
    setTracksMetadata(filesList, tracksUid);
  }
}

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

  return tracksUid;
}

async function setTracksMetadata(filesList, tracksUid)
{
  let index = 0;

  for (const file of filesList)
  {
    const trackElement = document.getElementById(tracksUid[index++]);
    const fileName     = stripHtml(escHtml(file.name));
    const fileExtIndex = fileName.lastIndexOf('.');
    const fileType     = (fileExtIndex !== -1) ? fileName.slice(fileExtIndex + 1).toUpperCase() : file.type;

    trackElement.setAttribute('data-track-image-url', THEME_ENV.defaultLTImagePlaceholder);
    trackElement.setAttribute('data-track-file-name', fileName);
    trackElement.setAttribute('data-track-file-type', fileType);
    trackElement.setAttribute('data-track-file-size', file.size);

    try
    {
      const metaData = await m.id3js.fromFile(file);
      const artist   = (metaData.artist.length !== 0) ? stripHtml(metaData.artist) : stripHtml(metaData.band);
      const title    = (metaData.title.length  !== 0) ? stripHtml(metaData.title)  : 'N / A';

      trackElement.setAttribute('data-track-artist', artist);
      trackElement.setAttribute('data-track-title',  title);
      trackElement.querySelector('div.artist-title').innerHTML = `<span><b>${artist}</b></span><br><span>${title}</span>`;

      setLocalTrackImages(metaData, trackElement);
    }
    catch
    {
      const fileNameNoExt = (fileExtIndex !== -1) ? fileName.slice(0, fileExtIndex) : fileName;

      trackElement.setAttribute('data-track-artist', fileNameNoExt);
    //trackElement.setAttribute('data-track-title',  fileNameNoExt);
      trackElement.querySelector('div.artist-title').innerHTML = `<span><b>${fileNameNoExt}</b></span>`;
    }
  }
}

function setLocalTrackImages(metaData, trackElement)
{
  if ((metaData.images !== undefined) && (metaData.images.length !== 0) && (metaData.images[0] !== null))
  {
    const trackImage = new Image();
    const imageBlob  = new Blob([metaData.images[0].data], { type: metaData.images[0].mime });
    const imageUrl   = encodeURI(URL.createObjectURL(imageBlob));

    trackImage.src = imageUrl;
    trackImage.decode().then(() =>
    {
      trackElement.querySelector('button.thumbnail img').src = imageUrl;
      trackElement.setAttribute('data-track-thumbnail-url', imageUrl);
      trackElement.setAttribute('data-track-image-url', imageUrl);
    })
    .catch((error) =>
    {
      debug.log(error);
      trackElement.querySelector('button.thumbnail img').src = THEME_ENV.defaultLTThumbnail;
    });
  }
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
