//
// Artists & Channels template functions
//
// https://ultrafunk.com
//


import { THEME_ENV }        from '../config.js';
import { getPrefPlayerUrl } from '../shared/utils.js';
import { getThumbnailData } from '../playback/common/mediaplayer.js';


// ************************************************************************************************
// Render fetched track and meta-data as HTML
// ************************************************************************************************

export function getTermlistHtml(header, termSlug, termData)
{
  let html = `<b>${header}</b>`;

  termData.forEach((track, index) =>
  {
    const thumbnailData = getThumbnailData(track.meta);

    html += /*html*/ `
    <div class="track">
      <div class="thumbnail ${thumbnailData.class}"
        data-term-url="${track.link}"
        data-term-slug="${termSlug}"
        data-track-num="${index + 1}"
        data-track-type="${track.meta.track_source_type}"
        data-track-id="track-${track.id}"
        data-track-source-uid="${thumbnailData.uid}" title="Play Track"
        >
        <img src="${thumbnailData.src}">
      </div>
      <div class="artist-title text-nowrap-ellipsis">
        <a href="${track.link}" title="Go to track"><span><b>${track.meta.track_artist}</b></span><br><span>${track.meta.track_title}</span></a>
      </div>
    </div>`;
  });

  return html;
}

export function getTermLinksHtml(header, termData)
{
  let html = `<b>${header}</b><br>`;

  termData.forEach(item => (html += `<a href="${getPrefPlayerUrl(item.link)}">${item.name}</a>, `));

  return html.slice(0, (html.length - 2));
}

export function getTopArtistsLinksHtml(header, artistsData, channelSlug)
{
  let html = `<b>${header}</b><br>`;

  artistsData.forEach((item) =>
  {
    const artistLink = getPrefPlayerUrl(`${THEME_ENV.siteUrl}/artist/${item.artist_slug}/?channel=${channelSlug}`);
    html += `<a href="${artistLink}">${item.artist_name}</a> (${item.track_count})<br>`;
  });

  return html;
}
