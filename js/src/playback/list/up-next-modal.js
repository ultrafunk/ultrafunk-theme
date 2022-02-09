//
// List-player Up Next modal module
//
// https://ultrafunk.com
//


import * as debugLogger         from '../../shared/debuglogger.js';
import { autoplay }             from '../footer-toggles.js';
import { settings }             from '../../shared/session-data.js';
import { isPlaying }            from '../playback-controls.js';
import { addListener }          from '../../shared/utils.js';
import { showSnackbar }         from '../../shared/snackbar.js';
import { getModalTrackHtmlEsc } from '../../shared/modal-templates.js';

import {
  queryTrackId,
  getNextPlayableId,
  getCurrentTrackElement,
} from './list-controls.js';

import {
  showModal,
  isShowingModal,
  getModalId,
  getModalEntry,
  updateModalTitle,
  updateModalBody,
} from '../../shared/modal.js';


export {
  init,
  showUpNextModal,
  updateUpNextModal,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('up-next-modal');

const m = {
  setCurrentTrack: null,
  modalDialogId:   null,
  upNextModalId:   0,
};


// ************************************************************************************************
//
// ************************************************************************************************

function init(setCurrentTrackFunc)
{
  m.setCurrentTrack = setCurrentTrackFunc;
}

function showUpNextModal()
{
  const modalEntries = getEntries(isPlaying());

  if (modalEntries.length > 2)
  {
    m.modalDialogId = showModal('tracklist', getTitle(isPlaying()), modalEntries, (clickedId) =>
    {
      const nextTrackId = modalEntries.find(item => (item.clickId === clickedId)).clickId;

      if ((nextTrackId === getCurrentTrackElement().id) && isPlaying())
        getCurrentTrackElement().scrollIntoView({ behavior: (settings.site.smoothScrolling ? 'smooth' : 'auto'), block: 'center' });
      else
        m.setCurrentTrack(nextTrackId, true, false);
    });

    m.upNextModalId = getModalId();

    addTitleListener();
  }
  else
  {
    showSnackbar('No more tracks to play!', 5);
  }
}

function updateUpNextModal(isPlaying)
{
  if (isShowingModal(m.upNextModalId))
  {
    updateModalTitle(m.upNextModalId, getTitle(isPlaying));
    addTitleListener();
  
    const modalEntry = getModalEntry(1);
  
    if (modalEntry.getAttribute('data-click-id') === getCurrentTrackElement().id)
    {
      modalEntry.classList.remove('playing-track', 'cued-track');
      modalEntry.classList.add(`${isPlaying ? 'playing-track' : 'cued-track'}`);
      modalEntry.title = `${isPlaying ? 'Go To Track' : 'Play Track'}`;
    }
    else
    {
      updateModalBody(m.upNextModalId, getEntries(isPlaying));
    }
  }
}

function getTitle(isPlaying)
{
  return `${isPlaying ? 'Playing' : 'Cued'}
            <span class="light-text lowercase-text toggle-element" title="Toggle Autoplay">
            Autoplay is <b>${settings.playback.autoplay ? 'On' : 'Off'}</b></span>`;
}

function getEntries(isPlaying)
{
  const modalEntries = [];
  let trackElement   = getCurrentTrackElement();

  modalEntries.push({
    clickId: trackElement.id,
    class:   `tracklist-entry ${isPlaying ? 'playing-track' : 'cued-track'}`,
    title:   `${isPlaying ? 'Go To Track' : 'Play Track'}`,
    content: getModalTrackHtmlEsc(trackElement, 'data-track-artist', 'data-track-title'),
  });

  modalEntries.push({ class: 'header-entry', content: 'Up Next' });

  for (let i = 0; i < 10; i++)
  {
    trackElement = queryTrackId(getNextPlayableId(trackElement));

    if (trackElement === null)
      break;

    modalEntries.push({
      clickId: trackElement.id,
      class:   'tracklist-entry',
      title:   'Play Track',
      content: getModalTrackHtmlEsc(trackElement, 'data-track-artist', 'data-track-title'),
    });
  }

  return modalEntries;
}

function addTitleListener()
{
  addListener(`#${m.modalDialogId} .modal-dialog-title span`, 'click', (event) => 
  {
    autoplay.toggle();
    event.target.closest('span').innerHTML = `Autoplay is <b>${settings.playback.autoplay ? 'On' : 'Off'}</b>`;
  });
}
