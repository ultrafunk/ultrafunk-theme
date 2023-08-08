//
// Modal dialog template functions
//
// https://ultrafunk.com
//


import { TRACK_TYPE } from '../playback/mediaplayers.js';


/*************************************************************************************************/


export const config = { id: 'modal-dialog' };


// ************************************************************************************************
//
// ************************************************************************************************

export function getTemplateHtml()
{
  return /*html*/ `
    <div id="${config.id}-overlay" tabindex="-1">
      <div id="${config.id}-container">
        <div class="${config.id}-header">
          <div class="${config.id}-title"></div>
          <div class="${config.id}-close-icon"><span class="material-icons" title="Dismiss (esc)">close</span></div>
        </div>
        <div class="${config.id}-body"></div>
        <div class="${config.id}-footer"><div class="modal-dialog-close-button" title="Dismiss (esc)">Close</div></div>
      </div>
    </div>`;
}

export function getSingleChoiceListHtml(singleChoiceList, clickItemsCount = 0)
{
  let html = '';
  const entryColumnsClass = (clickItemsCount >= 10) ? 'modal-2-columns' : '';

  singleChoiceList.forEach((entry, index) =>
  {
    const entryClass      = entry.class      ? `modal-${entry.class}`                                       : 'modal-icon-text';
    const entryTitle      = entry.title      ? entry.title                                                  : '';
    const entryIcon       = entry.icon       ? `<span class="material-icons">${entry.icon}</span>`          : '';
    const entryContent    = entry.icon       ? `<span class="text-nowrap-ellipsis">${entry.content}</span>` : entry.content;
    const entryLinkTarget = entry.linkTarget ? `target="${entry.linkTarget}"`                               : '';
    entry.uid             = `modal-item-${index + 1}`;

    if (entry.link)
    {
      html += `<a id="${entry.uid}" href="${entry.link}" ${entryLinkTarget} class="modal-click-item ${entryClass} ${entryColumnsClass}" title="${entryTitle}">${entryIcon}${entryContent}</a>`;
    }
    else if (entry.clickId)
    {
      html += `<div id="${entry.uid}" data-click-id="${entry.clickId}" class="modal-click-item ${entryClass} ${entryColumnsClass}" title="${entryTitle}">${entryIcon}${entryContent}</div>`;
    }
    else
    {
      html += `<div class="${entryClass}" title="${entryTitle}">${entryIcon}${entryContent}</div>`;
    }
  });

  return html;
}

export function getModalTrackHtml(element, trackArtist, trackTitle)
{
  const trackTypeClass = (parseInt(element.getAttribute('data-track-type')) === TRACK_TYPE.YOUTUBE) ? 'type-youtube' : 'type-soundcloud';

  return /*html*/ `
    <div class="modal-track">
      <div class="modal-track-thumbnail ${trackTypeClass}">
        <img src="${encodeURI(element.getAttribute('data-track-thumbnail-url'))}">
      </div>
      <div class="modal-track-artist-title">
        <span><b>${trackArtist}</b></span><br>
        <span class="light-text">${trackTitle}</span>
      </div>
    </div>`;
}
