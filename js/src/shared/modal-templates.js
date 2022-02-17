//
// Modal dialog template functions
//
// https://ultrafunk.com
//


import { TRACK_TYPE } from '../playback/shared-gallery-list.js';


export {
  config,
  getTemplateHtml,
  insertSingleChoiceListHtml,
  getModalTrackHtml,
};


/*************************************************************************************************/


const config = { id: 'modal-dialog' };


// ************************************************************************************************
//
// ************************************************************************************************

function getTemplateHtml()
{
  return `
    <div id="${config.id}" tabindex="-1">
      <div id="${config.id}-container">
        <div class="${config.id}-header">
          <div class="${config.id}-title"></div>
          <div class="${config.id}-close-icon"><span class="material-icons" title="Dismiss (esc)">close</span></div>
        </div>
        <div class="${config.id}-body"></div>
      </div>
    </div>`;
}

function insertSingleChoiceListHtml(singleChoiceList, insertElement)
{
  let listHtml = '';

  singleChoiceList.forEach((entry, index) =>
  {
    const entryClass   = entry.class ? `modal-${entry.class}`                                       : 'modal-icon-text';
    const entryTitle   = entry.title ? entry.title                                                  : '';
    const entryIcon    = entry.icon  ? `<span class="material-icons">${entry.icon}</span>`          : '';
    const entryContent = entry.icon  ? `<span class="text-nowrap-ellipsis">${entry.content}</span>` : entry.content;
    entry.uid          = `modal-item-${index + 1}`;
  
    if (entry.clickId)
      listHtml += `<div id="${entry.uid}" data-click-id="${entry.clickId}" class="modal-click-item ${entryClass}" title="${entryTitle}">${entryIcon}${entryContent}</div>`;
    else
      listHtml += `<div class="${entryClass}" title="${entryTitle}">${entryIcon}${entryContent}</div>`;
  });
  
  insertElement.innerHTML = listHtml;
}

function getModalTrackHtml(element, trackArtist, trackTitle)
{
  const trackTypeClass = (parseInt(element.getAttribute('data-track-type')) === TRACK_TYPE.YOUTUBE) ? 'type-youtube' : 'type-soundcloud';

  return `
    <div class="modal-track">
      <div class="modal-track-thumbnail ${trackTypeClass}">
        <img src="${encodeURI(element.getAttribute('data-track-thumbnail-url'))}">
      </div>
      <div class="modal-track-artist-title text-nowrap-ellipsis">
        <span><b>${trackArtist}</b></span><br>
        <span class="light-text">${trackTitle}</span>
      </div>
    </div>`;
}
