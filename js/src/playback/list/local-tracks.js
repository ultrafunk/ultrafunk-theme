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

function getSelectedFiles(filesList)
{
  if (filesList.length === 0)
  {
    showSnackbar({ message: 'No tracks selected' });
  }
  else
  {
    let index       = 0;
    const tracksUid = [];
    let tracksHtml  = '';

    showSnackbar({ message: `Adding ${filesList.length} local ${(filesList.length === 1) ? 'track' : 'tracks'}...` });

    for (const file of filesList)
    {
      const trackUri = encodeURI(URL.createObjectURL(file));

      tracksUid.push(`track-${(Date.now() + index)}`);

      tracksHtml += getTrackEntryHtml(
      {
        uid: tracksUid[index++],
        id: 0,
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
    setTracksMetadata(filesList, tracksUid);
  }
}

async function setTracksMetadata(filesList, tracksUid)
{
  if (m.id3js === null)
    m.id3js = await import('//unpkg.com/id3js@^2/lib/id3.js');

  let index = 0;

  for (const file of filesList)
  {
    const element = document.getElementById(tracksUid[index++]);

    try
    {
      const metaData = await m.id3js.fromFile(file);
      const artist   = (metaData.artist.length !== 0) ? stripHtml(metaData.artist) : stripHtml(metaData.band);
      const title    = (metaData.title.length  !== 0) ? stripHtml(metaData.title)  : 'N / A';

      element.setAttribute('data-track-artist', artist);
      element.setAttribute('data-track-title',  title);
      element.querySelector('div.artist-title').innerHTML = `<span><b>${artist}</b></span><br><span>${title}</span>`;

      setLocalTrackImage(metaData, element);
    }
    catch
    {
      const fileName = stripHtml(escHtml(file.name));

      element.setAttribute('data-track-artist', fileName);
      element.setAttribute('data-track-title',  fileName);
      element.querySelector('div.artist-title').innerHTML = `<span><b>${fileName}</b></span>`;
    }
  }
}

function setLocalTrackImage(metaData, element)
{
  if ((metaData.images !== undefined) && (metaData.images.length !== 0))
  {
    const imageBlob = new Blob([metaData.images[0].data], { type: metaData.images[0].mime });
    const imageUrl  = URL.createObjectURL(imageBlob);
    element.setAttribute('data-track-image-url', imageUrl);
  }
}

function clearLocalTracks()
{
  queryTrackAll('div.track-entry.type-local')?.forEach(element =>
  {
    const trackBlobUrl      = element.getAttribute('data-track-url');
    const trackImageBlobUrl = element.getAttribute('data-track-image-url');

    if (trackBlobUrl !== null)
      URL.revokeObjectURL(trackBlobUrl);

    if (trackImageBlobUrl !== null)
      URL.revokeObjectURL(trackImageBlobUrl);

    element.remove();
  });

  showSnackbar({ message: 'All local tracks removed'});
}
