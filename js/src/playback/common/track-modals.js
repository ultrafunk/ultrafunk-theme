//
// Track modals module
//
// https://ultrafunk.com
//

import { getModalTrackHtml }   from '../../shared/modal-templates.js';
import { shareModal }          from '../../shared/share-modal.js';
import { copyTextToClipboard } from '../../shared/clipboard.js';
import { navSearch }           from '../../site/nav-search.js';
import { showSearchResults }   from '../list/track-search.js';
import { isListPlayer }        from './shared-gallery-list.js';

import {
  TRACK_TYPE,
  getDataTrackType,
} from './mediaplayer.js';

import {
  showModal,
  getModalRootElement,
} from '../../shared/modal.js';

import {
  stripAttribute,
  getPrefPlayerUrl,
  getTimeString,
  getReadableBytesSize,
} from '../../shared/utils.js';


// ************************************************************************************************
//
// ************************************************************************************************

export function showTrackSharePlay(element, onCloseFocusElement = null)
{
  const trackArtist = stripAttribute(element, 'data-track-artist');
  const trackTitle  = stripAttribute(element, 'data-track-title');
  const sourceUid   = (getDataTrackType(element) === TRACK_TYPE.YOUTUBE) ? stripAttribute(element, 'data-track-source-uid') : null;

  const modalId = shareModal.show({
    bodyText:       `${trackArtist} - ${trackTitle}`,
    filterBodyText: true,
    bodyHtml:       getModalTrackHtml(element, trackArtist, trackTitle),
    url:            stripAttribute(element, 'data-track-url'),
    urlType:        'Track link',
    sourceUid:      sourceUid,
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
  const modalEntries  = [];

  modalEntries.push({
    class:   'track-details-entry',
    content: getModalTrackHtml(element, trackArtist, trackTitle),
  });

  const modalTitle = `Track Details<span class="light-text lowercase-text">${((trackDuration > 0) ? getTimeString(trackDuration) : 'duration N/A')}</span>`;

  if (getDataTrackType(element) === TRACK_TYPE.LOCAL)
    getLocalTrackDetails(element, modalEntries);
  else
    getTrackDetails(element, modalEntries);

  const modalId = showModal({
    modalTitle: modalTitle,
    modalList:  modalEntries,
    modalType:  'track-details',
    onCloseFocusElement: onCloseFocusElement,
    onClickEntryCallback: (entryClickId, event) => onIconClickTrackSearch(event),
  });

  setTrackThumbnailClick(`${trackArtist} - ${trackTitle}`);

  return modalId;
}

function getLocalTrackDetails(element, modalEntries)
{
  modalEntries.push({ class: 'header-entry', content: 'Filename' });
  modalEntries.push({ class: 'default-text', content: `${stripAttribute(element, 'data-track-file-name')}` });
  modalEntries.push({ class: 'header-entry', content: 'Type' });
  modalEntries.push({ class: 'default-text', content: `On device ${stripAttribute(element, 'data-track-file-type')} audio file` });
  modalEntries.push({ class: 'header-entry', content: 'Size' });
  modalEntries.push({ class: 'default-text', content: getReadableBytesSize(parseInt(element.getAttribute('data-track-file-size'))) });
}

function getTrackDetails(element, modalEntries)
{
  const artists  = element.querySelector('.track-artists-links').querySelectorAll('a');
  const channels = element.querySelector('.track-channels-links').querySelectorAll('a');

  modalEntries.push({ class: 'header-entry', content: 'Artists' });

  artists.forEach(item =>
  {
    modalEntries.push({
      class:     `hover-icon-text ${item.classList[0] ?? ''}`,
      title:     'Go to Artist',
      content:   item.innerText,
      link:      getPrefPlayerUrl(item.href),
      icon:      'link',
      hoverIcon: 'search',
      hoverTitle: `Search for ${item.innerText}`,
      clickId:   element.id,
    });
  });

  modalEntries.push({ class: 'header-entry', content: 'Channels' });

  channels.forEach(item =>
  {
    modalEntries.push({
      class:     `hover-icon-text`,
      title:     'Go to Channel',
      content:   item.innerText,
      link:      getPrefPlayerUrl(item.href),
      icon:      'link',
      hoverIcon: 'search',
      hoverTitle: `Search for ${item.innerText}`,
      clickId:   element.id,
    });
  });

  const trackType = (getDataTrackType(element) === TRACK_TYPE.YOUTUBE) ? 'YouTube' : 'SoundCloud';
  const trackLink = (getDataTrackType(element) === TRACK_TYPE.YOUTUBE)
    ? encodeURI(`https://music.youtube.com/watch?v=${element.getAttribute('data-track-source-uid')}`)
    : encodeURI(`https://${element.getAttribute('data-track-source-uid')}`);

  modalEntries.push({ class: 'header-entry', content: 'Type / Source Link' });
  modalEntries.push({ content: `${trackType} track`, link: trackLink, icon: 'link', linkTarget: '_blank', title: `Link to ${trackType} track` });
}

function onIconClickTrackSearch(event)
{
  if (event.target.closest('div.modal-item-icons'))
  {
    event.preventDefault();
    const searchString = event.target.closest('a')?.querySelector('span.text-nowrap-ellipsis').textContent;
    navSearch.show(searchString);

    if (isListPlayer())
      showSearchResults(searchString.toLowerCase());
  }
}

function setTrackThumbnailClick(artistTitle)
{
  getModalRootElement().querySelector('.modal-track .modal-track-thumbnail').title = 'Click / tap to Copy Artist & Title';
  getModalRootElement().querySelector('img')?.addEventListener('click', () => copyTextToClipboard(artistTitle, 'Artist &amp Title'));
}
