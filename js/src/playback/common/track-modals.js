//
// Track modals module
//
// https://ultrafunk.com
//

import { getModalTrackHtml }   from '../../shared/modal-templates.js';
import { shareModal }          from '../../shared/share-modal.js';
import { copyTextToClipboard } from '../../shared/clipboard.js';

import {
  showModal,
  getModalRootElement,
} from '../../shared/modal.js';

import {
  stripAttribute,
  getPrefPlayerUrl,
  getTimeString,
} from '../../shared/utils.js';


// ************************************************************************************************
//
// ************************************************************************************************

export function showTrackSharePlay(element, onCloseFocusElement = null)
{
  const trackArtist = stripAttribute(element, 'data-track-artist');
  const trackTitle  = stripAttribute(element, 'data-track-title');

  const modalId = shareModal.show({
    bodyText:       `${trackArtist} - ${trackTitle}`,
    filterBodyText: true,
    bodyHtml:       getModalTrackHtml(element, trackArtist, trackTitle),
    url:            stripAttribute(element, 'data-track-url'),
    urlType:        'Track link',
    sourceUid:      stripAttribute(element, 'data-track-source-uid'),
    onCloseFocusElement: onCloseFocusElement,
  });

  setTrackThumbnailClick(`${trackArtist} - ${trackTitle}`);

  return modalId;
}

export function showTrackDetails(element, onCloseFocusElement = null)
{
  const trackArtist   = stripAttribute(element, 'data-track-artist');
  const trackTitle    = stripAttribute(element, 'data-track-title');
  const trackDuration = parseInt(element.getAttribute('data-track-duration'));
  const artists       = element.querySelector('.track-artists-links').querySelectorAll('a');
  const channels      = element.querySelector('.track-channels-links').querySelectorAll('a');
  const modalEntries  = [];

  modalEntries.push({
    class:   'track-details-entry',
    content: getModalTrackHtml(element, trackArtist, trackTitle),
  });

  modalEntries.push({ class: 'header-entry', content: 'Artists' });

  artists.forEach(item =>
  {
    modalEntries.push({
      class:   `icon-text ${item.classList[0] ?? ''}`,
      title:   'Go to Artist',
      content: item.innerText,
      link:    getPrefPlayerUrl(item.href),
      icon:    'link',
    });
  });

  modalEntries.push({ class: 'header-entry', content: 'Channels' });

  channels.forEach(item =>
  {
    modalEntries.push({
      title:   'Go to Channel',
      content: item.innerText,
      link:    getPrefPlayerUrl(item.href),
      icon:    'link'
    });
  });

  const modalTitle = `Track Details<span class="light-text lowercase-text">${((trackDuration > 0) ? getTimeString(trackDuration) : 'duration N/A')}</span>`;

  const modalId = showModal({
    modalTitle: modalTitle,
    modalBody:  modalEntries,
    modalType:  'track-details',
    onCloseFocusElement: onCloseFocusElement,
  });

  setTrackThumbnailClick(`${trackArtist} - ${trackTitle}`);

  return modalId;
}

function setTrackThumbnailClick(artistTitle)
{
  getModalRootElement().querySelector('.modal-track .modal-track-thumbnail').title = 'Click / tap to Copy Artist & Title';
  getModalRootElement().querySelector('img')?.addEventListener('click', () => copyTextToClipboard(artistTitle, 'Artist &amp Title'));
}
