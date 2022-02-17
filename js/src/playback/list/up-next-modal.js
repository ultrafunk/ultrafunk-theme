//
// List-player Up Next modal module
//
// https://ultrafunk.com
//


import * as debugLogger from '../../shared/debuglogger.js';
import { autoplay }     from '../footer-toggles.js';
import { settings }     from '../../shared/session-data.js';
import { isPlaying }    from '../playback-controls.js';
import { TRACK_TYPE }   from '../shared-gallery-list.js';
import { showSnackbar } from '../../shared/snackbar.js';

import {
  addListener,
  escAttribute,
}  from '../../shared/utils.js';

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
  dragStartY:      0,
  dragEntryId:     null,
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
    addDragDropListeners();
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
      addDragDropListeners();
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
    content: getUpNextTrackHtml(trackElement, 'data-track-artist', 'data-track-title'),
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
      title:   'Click: Play Track / Drag: Move Track',
      content: getUpNextTrackHtml(trackElement, 'data-track-artist', 'data-track-title', true),
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


// ************************************************************************************************
//
// ************************************************************************************************

function addDragDropListeners()
{
  document.querySelectorAll('.modal-tracklist-entry')?.forEach((element) =>
  {
    if (element.id !== 'modal-item-1')
    {
      element.addEventListener('dragstart', dragStart);
      element.addEventListener('dragover',  dragOver);
      element.addEventListener('drop',      dragDrop);
    }
  });
}

function dragStart(event)
{
  m.dragStartY  = event.clientY;
  m.dragEntryId = event.target.closest('div.modal-tracklist-entry').id;
  event.dataTransfer.effectAllowed = 'move';
}

function dragOver(event)
{
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  return false;
}

function dragDrop(event)
{
  event.preventDefault();

  const insertPos = (event.clientY  > m.dragStartY) ? 'afterend' : 'beforebegin';
  
  // Modal tracks drag & drop reorder
  const dragModalTrack = document.getElementById(m.dragEntryId);
  const dropModalTrack = event.target.closest('div.modal-tracklist-entry');
  dropModalTrack.insertAdjacentElement(insertPos, dragModalTrack);

  // List player tracks drag & drop reorder = sync track lists
  const dragListTrack = document.getElementById(dragModalTrack.getAttribute('data-click-id'));
  const dropListTrack = document.getElementById(dropModalTrack.getAttribute('data-click-id'));
  dropListTrack.insertAdjacentElement(insertPos, dragListTrack);

  return false;
}


// ************************************************************************************************
//
// ************************************************************************************************

function getUpNextTrackHtml(element, trackArtistAttr, trackTitleAttr, isDraggable = false)
{
  const trackTypeClass = (parseInt(element.getAttribute('data-track-type')) === TRACK_TYPE.YOUTUBE) ? 'type-youtube' : 'type-soundcloud';

  return `
    <div class="modal-track" ${isDraggable ? 'draggable="true"' : ''}>
      <div class="modal-track-thumbnail ${trackTypeClass}">
        <img src="${encodeURI(element.getAttribute('data-track-thumbnail-url'))}">
      </div>
      <div class="modal-track-artist-title text-nowrap-ellipsis">
        <span><b>${escAttribute(element, trackArtistAttr)}</b></span><br>
        <span class="light-text">${escAttribute(element, trackTitleAttr)}</span>
      </div>
      <div class="modal-track-buttons">
        <div class="drag-drop-button" title="Drag to Move Track"><span class="material-icons">drag_handle</span></div>
      </div>
    </div>`;
}
