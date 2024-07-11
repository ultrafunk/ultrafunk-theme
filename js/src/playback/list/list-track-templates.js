//
// List player track template functions
//
// https://ultrafunk.com
//


import { THEME_ENV } from '../../config.js';

import {
  getThumbnailData,
  getTrackTypeData,
  TRACK_TYPE,
} from '../common/mediaplayer.js';

import {
  getTimeString,
  getListPlayerUrl,
  escHtml,
} from '../../shared/utils.js';


// ************************************************************************************************
//
// ************************************************************************************************

export function getPageSeparatorHtml(responseData, loadingPage)
{
  const pageUrl = responseData.nextPage.replace(/\/page\/(?!0)\d{1,6}\//i, `/page/${loadingPage}/`);

  return /*html*/ `
    <div id="tracklist-page-${loadingPage}" class="tracklist-page-separator" data-page-number="${loadingPage}">
      <button type="button" class="material-icons arrow-down-button" title="Scroll to next page">arrow_downward</button>
      <button type="button" class="material-icons arrow-last-button" title="Scroll to Last Track">vertical_align_bottom</button>
      <a href="${pageUrl}" title="Go to page ${loadingPage}">Page ${loadingPage} &#9660;</a>
      <button type="button" class="material-icons arrow-first-button" title="Scroll to First Track">vertical_align_top</button>
      <button type="button" class="material-icons arrow-up-button" title="Scroll to previous page">arrow_upward</button>
    </div>`;
}

export function getTrackEntryHtml(track, density = 'default')
{
  const thumbnailData     = getThumbnailData(track.meta);
  const trackTypeData     = getTrackTypeData(track.meta.track_source_type, thumbnailData.src);
  const trackArtist       = escHtml(track.meta.track_artist);
  const trackTitle        = escHtml(track.meta.track_title);
  const trackDuration     = parseInt(track.meta.track_duration);
  const isAudioVideoClass = track.channels.includes(THEME_ENV.channelVideosId) ? 'is-video' : 'is-audio';

  const trackArtistTitle = trackTypeData.isPlayableTrack
                             ? `<span><b>${trackArtist}</b></span><br><span>${trackTitle}</span>`
                             : `<a href="${track.link}"><span><b>${trackArtist}</b></span><br><span>${trackTitle}</span></a>`;

  const trackPlayNext = trackTypeData.isPlayableTrack
                          ? `<button type="button" class="play-next-button" title="Play Next"><span class="material-icons">playlist_play</span></button>`
                          : '';

  return /*html*/ `
    <div id="${track.uid}" class="track-entry ${density}-density ${thumbnailData.class} ${isAudioVideoClass}"
      data-track-type="${track.meta.track_source_type}"
      data-track-id="track-${track.id}"
      data-track-artist="${trackArtist}"
      data-track-title="${trackTitle}"
      data-track-duration="${trackDuration}"
      data-track-url="${track.link}"
      data-track-thumbnail-url="${trackTypeData.thumbnailUrl}"
      data-track-source-uid ="${thumbnailData.uid}"
      >
      <div class="track-artists-links" data-track-artist-ids="${track.artists.toString()}">${track.artists_links  ?? ''}</div>
      <div class="track-channels-links" data-track-channel-ids="${track.channels.toString()}">${track.channels_links ?? ''}</div>
      <div class="track-details">
        <button type="button" class="thumbnail" ${trackTypeData.isPlayableTrack ? 'title="Play Track"' : 'title="SoundCloud Track"'}>
          <div class="thumbnail-overlay"><div class="spinner"></div></div>
          <img src="${trackTypeData.thumbnailUrl}" alt="">
        </button>
        <div class="artist-title text-nowrap-ellipsis" ${(trackTypeData.isPlayableTrack === false) ? 'title="Link: Play SoundCloud track"' : ''}>
          ${trackArtistTitle}
        </div>
      </div>
      <div class="track-actions">
        <div class="track-message"></div>
        <div class="track-action-buttons">
          <button type="button" class="remove-button" title="Remove Track from List"><span class="material-icons">close</span></button>
          ${trackPlayNext}
          <button type="button" class="share-play-button" title="Share Track / Play On"><span class="material-icons">share</span></button>
          <button type="button" class="details-button" title="Track Details"><span class="material-icons-outlined">info</span></button>
        </div>
        <button type="button" class="track-actions-toggle" title="Show / Hide track actions"><span class="material-icons">more_horiz</span></button>
      </div>
      <div class="track-duration text-nowrap-ellipsis" title="Track duration">${((track.meta.track_source_type === TRACK_TYPE.YOUTUBE) ? getTimeString(trackDuration) : 'N / A')}</div>
    </div>`;
}

export function setTrackMeta(
  trackData,
  trackLinksSelector,
  linkIdsAttribute,
  linksMap,
)
{
  trackData.forEach(track =>
  {
    const linksElement = document.getElementById(track.uid).querySelector(trackLinksSelector);
    const linkIds      = linksElement.getAttribute(linkIdsAttribute)?.split(',');
    let   linksHtml    = '';

    linkIds?.forEach(linkId =>
    {
      const mapKey    = parseInt(linkId);
      const linkClass = (track.meta.track_artist_id === mapKey) ? 'primary' : 'secondary';
      linksHtml      +=`<a class="${linkClass}" href="${getListPlayerUrl(linksMap.get(mapKey).link)}">${linksMap.get(mapKey).name}</a>`;
    });

    linksElement.insertAdjacentHTML('afterbegin', linksHtml);
  });
}
