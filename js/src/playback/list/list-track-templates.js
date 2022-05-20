//
// List player track template functions
//
// https://ultrafunk.com
//


import * as debugLogger from '../../shared/debuglogger.js';
import { TRACK_TYPE }   from '../shared-gallery-list.js';

import {
  getTimeString,
  getListPlayerUrl,
  getThumbnailData,
  escHtml,
} from '../../shared/utils.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('list-track-templates');


// ************************************************************************************************
// 
// ************************************************************************************************

export function getPageSeparatorHtml(responseData, loadingPage)
{
  const pageUrl = responseData.nextPage.replace(/\/page\/(?!0)\d{1,6}\//i, `/page/${loadingPage}/`);

  return /*html*/ `
    <div id="tracklist-page-${loadingPage}" class="tracklist-page-separator" data-page-number="${loadingPage}">
      <span class="material-icons arrow-down-button" title="Scroll to next page">arrow_downward</span>
      <a href="${pageUrl}" title="Go to page ${loadingPage}">Page ${loadingPage} &#9660;</a>
      <span class="material-icons arrow-up-button" title="Scroll to previous page">arrow_upward</span>
    </div>`;
}

export function getTrackEntryHtml(track)
{
  const isYouTubeTrack = (track.meta.track_source_type === TRACK_TYPE.YOUTUBE);
  const thumbnailData  = getThumbnailData(track.meta);
  const trackArtist    = escHtml(track.meta.track_artist);
  const trackTitle     = escHtml(track.meta.track_title);
  const trackDuration  = parseInt(track.meta.track_duration);

  const youTubeTrackThumbnailUrl = debug.isDebug()
                                     ? "/wp-content/themes/ultrafunk/inc/img/yt_thumbnail_placeholder.png"
                                     : thumbnailData.src;

  const trackThumbnailUrl = isYouTubeTrack
                              ? youTubeTrackThumbnailUrl
                              : '/wp-content/themes/ultrafunk/inc/img/sc_thumbnail_placeholder.png';

  const trackArtistTitle = isYouTubeTrack
                             ? `<span><b>${trackArtist}</b></span><br><span>${trackTitle}</span>`
                             : `<a href="${track.link}"><span><b>${trackArtist}</b></span><br><span>${trackTitle}</span></a>`;
  
  const trackPlayNext = isYouTubeTrack
                          ? `<div class="play-next-button" title="Play Next"><span class="material-icons">playlist_play</span></div>`
                          : '';

  return /*html*/ `
    <div id="${track.uid}" class="track-entry ${thumbnailData.class}"
      data-track-id="track-${track.id}"
      data-track-artist="${trackArtist}"
      data-track-title="${trackTitle}"
      data-track-duration="${trackDuration}"
      data-track-url="${track.link}"
      data-track-type="${track.meta.track_source_type}"
      data-track-thumbnail-url="${trackThumbnailUrl}"
      data-track-source-uid ="${thumbnailData.uid}"
      >
      <div class="track-artists-links" data-track-artist-ids="${track.artists.toString()}"></div>
      <div class="track-channels-links" data-track-channel-ids="${track.channels.toString()}"></div>
      <div class="track-details">
        <div class="thumbnail" ${isYouTubeTrack ? 'title="Play Track"' : 'title="SoundCloud Track"'}>
          <div class="thumbnail-overlay"><div class="spinner"></div></div>
          <img src="${trackThumbnailUrl}" alt="">
        </div>
        <div class="artist-title text-nowrap-ellipsis" ${(isYouTubeTrack === false) ? 'title="Link: Play SoundCloud track"' : ''}>
          ${trackArtistTitle}
        </div>
      </div>
      <div class="track-actions">
        <div class="track-message"></div>
        <div class="track-action-buttons">
          <div class="remove-button" title="Remove Track from List"><span class="material-icons">clear</span></div>
          ${trackPlayNext}
          <div class="share-play-button" title="Share Track / Play On"><span class="material-icons">share</span></div>
          <div class="details-button" title="Track Details"><span class="material-icons-outlined">info</span></div>
        </div>
        <div class="track-actions-toggle" title="Show / Hide track actions"><span class="material-icons">more_horiz</span></div>
      </div>
      <div class="track-duration text-nowrap-ellipsis">${(isYouTubeTrack ? getTimeString(trackDuration) : 'N / A')}</div>
    </div>`;
}

export function setTrackMeta(
  trackData,
  trackLinksSelector,
  linkIdsAttribute,
  linksMap,
  isChannels = false
)
{
  trackData.forEach(track =>
  {
    const linksElement = document.getElementById(track.uid).querySelector(trackLinksSelector);
    const linkIds      = linksElement.getAttribute(linkIdsAttribute)?.split(',');
    let   linksHtml    = '';
    let   isVideo      = false;

    linkIds?.forEach(linkId =>
    {
      const mapKey    = parseInt(linkId);
      const linkClass = (track.meta.track_artist_id === mapKey) ? 'primary' : 'secondary';
      linksHtml      +=`<a class="${linkClass}" href="${getListPlayerUrl(linksMap.get(mapKey).link)}">${linksMap.get(mapKey).name}</a>`;

      if (isChannels && (linksMap.get(mapKey).name === 'Video'))
        isVideo = true;
    });

    document.getElementById(track.uid).classList.add(isVideo ? 'is-video' : 'is-audio');
    linksElement.insertAdjacentHTML('afterbegin', linksHtml);
  });
}
