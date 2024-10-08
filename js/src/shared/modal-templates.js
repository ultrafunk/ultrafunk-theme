//
// Modal dialog template functions
//
// https://ultrafunk.com
//


import { getTrackTypeClass } from '../playback/common/mediaplayer.js';


// ************************************************************************************************
//
// ************************************************************************************************

export function getTemplateHtml()
{
  return /*html*/ `
    <div id="modal-dialog-overlay" tabindex="-1">
      <div id="modal-dialog-container">
        <div class="modal-dialog-header">
          <div class="modal-dialog-title"></div>
          <button type="button" class="modal-dialog-close-icon"><span class="material-icons" title="Dismiss (esc)">close</span></button>
        </div>
        <div class="modal-dialog-body"></div>
        <div class="modal-dialog-footer"><button type="button" class="modal-dialog-close-button" title="Dismiss (esc)">Close</button></div>
      </div>
    </div>`;
}

export function getModalListHtml(modalList, modalItemsCount = 0)
{
  let html = '';
  const entryColumnsClass = (modalItemsCount >= 10) ? 'modal-2-columns' : '';

  modalList.forEach((entry, index) =>
  {
    let   entryClass      = entry.class      ? `modal-${entry.class}`                                                            : 'modal-icon-text';
          entryClass      = entry.state      ? `${entryClass} state-${entry.state}`                                              : entryClass;
    const entryTitle      = entry.title      ? entry.title                                                                       : '';
    const entryIcon       = entry.icon       ? `<span class="material-icons default-icon">${entry.icon}</span>`                  : '';
    const hoverTitle      = entry.hoverTitle ?  `title="${entry.hoverTitle}"`                                                    : '';
    const entryHoverIcon  = entry.hoverIcon  ? `<span class="material-icons hover-icon" ${hoverTitle}>${entry.hoverIcon}</span>` : '';
    const modalItemIcons  = entry.hoverIcon  ? `<div class="modal-item-icons">${entryIcon}${entryHoverIcon}</div>`               : entryIcon;
    const entryContent    = entry.icon       ? `<span class="text-nowrap-ellipsis">${entry.content}</span>`                      : entry.content;
    const entryLinkTarget = entry.linkTarget ? `target="${entry.linkTarget}"`                                                    : '';
    entry.uid             = `modal-item-${index + 1}`;

    if (entry.link)
    {
      const clickId = entry?.clickId ? `data-click-id="${entry.clickId}"` : '';
      html += `<a id="${entry.uid}" ${clickId} href="${entry.link}" ${entryLinkTarget} class="modal-click-item ${entryClass} ${entryColumnsClass}" title="${entryTitle}">${modalItemIcons}${entryContent}</a>`;
    }
    else if (entry.clickId)
    {
      html += `<div id="${entry.uid}" data-click-id="${entry.clickId}" class="modal-click-item ${entryClass} ${entryColumnsClass}" title="${entryTitle}">${modalItemIcons}${entryContent}</div>`;
    }
    else
    {
      html += `<div class="${entryClass}" title="${entryTitle}">${modalItemIcons}${entryContent}</div>`;
    }
  });

  return html;
}

export function getModalTrackHtml(element, trackArtist, trackTitle)
{
  return /*html*/ `
    <div class="modal-track">
      <div class="modal-track-thumbnail ${getTrackTypeClass(element)}">
        <img src="${encodeURI(element.getAttribute('data-track-thumbnail-url'))}">
      </div>
      <div class="modal-track-artist-title">
        <span><b>${trackArtist}</b></span><br>
        <span class="light-text">${trackTitle}</span>
      </div>
    </div>`;
}
