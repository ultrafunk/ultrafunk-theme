//
// Local (device) files playback module
//
// https://ultrafunk.com
//


import { newDebugLogger }    from '../../shared/debuglogger.js';
import { showSnackbar }      from '../../shared/snackbar.js';
import { TRACK_TYPE }        from '../common/mediaplayers.js';
import { getTrackEntryHtml } from '../list/list-track-templates.js';
import { queryTrackAll }     from '../list/list-controls.js';
import { stop as stopYouTubeTrack } from '../list/list-playback.js';

import {
  EVENT,
  addListener,
} from '../common/playback-events.js';

import {
  escHtml,
  stripAttribute,
  stripHtml,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = newDebugLogger('local-playback');

const m = {
  audioPlayer: null,
  id3js:       null,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function initLocalPlayback()
{
  debug.log('init()');

  const tracklistLocalHtml = /*html*/ `
    <div id="tracklist-local">
      Add local tracks:&nbsp;&nbsp;<input id="select-local-files" type="file" accept="audio/*" multiple />
      <button id="clear-local-tracks" type="button">Clear Tracks</button>
    </div>`;

  document.getElementById('tracklist').insertAdjacentHTML("beforeend", tracklistLocalHtml);

  document.getElementById('select-local-files').addEventListener('change', (event) => getSelectedFiles(event.target.files));
  document.getElementById('select-local-files').addEventListener('cancel', (event) => getSelectedFiles(event.target.files));
  document.getElementById('clear-local-tracks').addEventListener('click',  clearLocalTracks);

  addListener(EVENT.MEDIA_PLAYING, () => stop());

  m.audioPlayer = document.getElementById('local-audio-player');
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

    for (const file of filesList)
    {
      tracksUid.push(`track-${(Date.now() + index)}`);

      tracksHtml += getTrackEntryHtml(
      {
        uid: tracksUid[index++],
        id: 0,
        link: encodeURI(URL.createObjectURL(file)),
        artists: [],
        channels: [],
        meta: {
          track_source_type: TRACK_TYPE.LOCAL,
          track_artist: 'Loading...',
          track_title: '',
          track_duration: 0,
        }
      });
    }

    document.getElementById('tracklist').insertAdjacentHTML("beforeend", tracksHtml);
    setTracksMetadata(filesList, tracksUid);

    showSnackbar({ message: `Added ${index} local ${(index === 1) ? 'track' : 'tracks'}` });
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

function clearLocalTracks()
{
  queryTrackAll('div.track-entry.type-local')?.forEach(element =>
  {
    URL.revokeObjectURL(element.getAttribute('data-track-url'));
    element.remove();
  });

  showSnackbar({ message: 'All local tracks removed'});
}


// ************************************************************************************************
//
// ************************************************************************************************

export function cueOrPlayTrack(trackElement, playTrack = false)
{
  const trackArtist = stripAttribute(trackElement, 'data-track-artist');
  const trackTitle  = stripAttribute(trackElement, 'data-track-title');

  debug.log(`cueOrPlayTrack(${playTrack ? 'play' : 'cue'}): ${trackArtist} - "${trackTitle}"`);

  m.audioPlayer.src = trackElement.getAttribute('data-track-url');

  if (playTrack)
  {
    showTrackTypePlayer(TRACK_TYPE.LOCAL);
    stopYouTubeTrack();
    m.audioPlayer.play();
  }
}

function stop()
{
  if ((m.audioPlayer.paused === false) || (m.audioPlayer.currentTime > 0))
  {
    debug.log(`stop() - paused: ${m.audioPlayer.paused} - currentTime: ${m.audioPlayer.currentTime}`);

    showTrackTypePlayer(TRACK_TYPE.YOUTUBE);
    m.audioPlayer.pause();
    m.audioPlayer.currentTime = 0;
  }
}

function showTrackTypePlayer(trackType)
{
  debug.log(`showTrackPlayer(): ${debug.getKeyForValue(TRACK_TYPE, trackType)}`);

  document.querySelector('.embedded-container.youtube-container').style.display = (trackType === TRACK_TYPE.YOUTUBE) ? ''      : 'none';
  document.querySelector('.embedded-container.local-container').style.display   = (trackType === TRACK_TYPE.LOCAL)   ? 'block' : '';
}
