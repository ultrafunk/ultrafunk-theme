//
// List-player Up Next modal module
//
// https://ultrafunk.com
//


import { newDebugLogger }    from '../../shared/debuglogger.js';
import { IS_PROD_BUILD }     from '../../config.js';
import { autoplay }          from '../../site/footer-toggles.js';
import { settings }          from '../../shared/session-data.js';
import { isPlaying }         from '../common/playback-controls.js';
import { TRACK_TYPE }        from '../common/mediaplayers.js';
import { showSnackbar }      from '../../shared/snackbar.js';
import { shuffleClickNavTo } from '../common/shared-gallery-list.js';

import {
  escAttribute,
  getTimeString,
} from '../../shared/utils.js';

import {
  queryTrackId,
  getNextPlayableId,
  getCurrentTrackElement,
} from './list-controls.js';

import {
  showModal,
  isShowingModal,
  getModalRootElement,
  getModalEntry,
  updateModalTitle,
  updateModalList,
} from '../../shared/modal.js';


/*************************************************************************************************/


const debug = newDebugLogger('up-next-modal');

const m = {
  setCurrentTrack: null,
  modalDialogId:   null,
  dragStartY:      0,
  dragEntryId:     null,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function init(setCurrentTrackCallback)
{
  m.setCurrentTrack = setCurrentTrackCallback;
}

function loadDragDropTouch()
{
  if (('ontouchstart' in window) && (document.getElementById('drag-drop-touch') === null))
  {
    debug.log('Loading drag-drop-touch.js...');

    const tag = document.createElement('script');
    tag.type  = 'text/javascript';
    tag.id    = 'drag-drop-touch';
    tag.src   = IS_PROD_BUILD
                  ? 'https://ultrafunk.com/wp-content/themes/ultrafunk/inc/js/drag-drop-touch.min.js'
                  : 'https://wordpress.ultrafunk.com/wp-content/themes/ultrafunk/inc/js/drag-drop-touch.js';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}


// ************************************************************************************************
//
// ************************************************************************************************

export function showUpNextModal()
{
  // Only load this dependency IF we actually need it...
  loadDragDropTouch();

  const tracklist = getTracklist(isPlaying());

  if (tracklist.length > 2)
  {
    m.modalDialogId = showModal({
      modalTitle: getTitle(isPlaying()),
      modalList:  tracklist,
      modalType:  'tracklist',
      onClickEntryCallback: (clickedId) => onTrackClick(tracklist, clickedId),
      onClickCloseCallback: (event)     => shouldCloseModal(event),
    });

    addTitleListener();
    addDragDropListeners();
  }
  else
  {
    showSnackbar({
      message: 'No more tracks to play...',
      duration: 5,
      actionText: 'Shuffle',
      actionClickCallback: () => shuffleClickNavTo(),
    });
  }
}

function onTrackClick(tracklist, clickedId)
{
  const nextTrackId = tracklist.find(item => (item.clickId === clickedId)).clickId;

  if ((nextTrackId === getCurrentTrackElement().id) && isPlaying())
    getCurrentTrackElement().scrollIntoView({ behavior: (settings.site.smoothScrolling ? 'smooth' : 'auto'), block: 'center' });
  else
    m.setCurrentTrack(nextTrackId, true, false);
}

function shouldCloseModal(event)
{
  if (event.target.closest('#modal-item-1'))
    return true;
  else if (event.target.classList.contains('modal-track-thumbnail'))
    return true;

  return false;
}

export function updateUpNextModal(isPlayingTrack)
{
  if (isShowingModal(m.modalDialogId))
  {
    updateModalTitle(m.modalDialogId, getTitle(isPlayingTrack));
    addTitleListener();

    const modalEntry = getModalEntry(1);

    if (modalEntry.getAttribute('data-click-id') === getCurrentTrackElement().id)
    {
      modalEntry.classList.remove('playing-track', 'cued-track');
      modalEntry.classList.add(`${isPlayingTrack ? 'playing-track' : 'cued-track'}`);
      modalEntry.title = `${isPlayingTrack ? 'Go To Track' : 'Play Track'}`;
    }
    else
    {
      updateModalList(m.modalDialogId, getTracklist(isPlayingTrack));
      addDragDropListeners();
    }
  }
}

function getTitle(isPlayingTrack)
{
  return /*html*/ `${isPlayingTrack ? 'Playing' : 'Cued'}
            <span class="light-text lowercase-text toggle-element" title="Toggle Autoplay">
            Autoplay is <b>${settings.playback.autoplay ? 'On' : 'Off'}</b></span>`;
}

function getTracklist(isPlayingTrack)
{
  const tracklist  = [];
  let trackElement = getCurrentTrackElement();

  tracklist.push({
    clickId: trackElement.id,
    class:   `tracklist-entry ${isPlayingTrack ? 'playing-track' : 'cued-track'}`,
    title:   `${isPlayingTrack ? 'Go To Track' : 'Play Track'}`,
    content: getUpNextTrackHtml(trackElement, 'data-track-artist', 'data-track-title'),
  });

  tracklist.push({ class: 'header-entry', content: 'Up Next <span class="light-text">(drag to reorder)</span>' });

  for (let i = 0; i < 10; i++)
  {
    trackElement = queryTrackId(getNextPlayableId(trackElement));

    if (trackElement === null)
      break;

    tracklist.push({
      clickId: trackElement.id,
      class:   'tracklist-entry',
      content: getUpNextTrackHtml(trackElement, 'data-track-artist', 'data-track-title', true),
    });
  }

  return tracklist;
}

function addTitleListener()
{
  getModalRootElement().querySelector('.modal-dialog-title span').addEventListener('click', (event) =>
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
      element.addEventListener('mousedown', mouseDown);
      element.addEventListener('dragstart', dragStart);
      element.addEventListener('dragover',  dragOver);
      element.addEventListener('drop',      dragDrop);
    }
  });
}

// Disable drag & drop for track play button (modal-track-thumbnail)
function mouseDown(event)
{
  if (event.target.classList.contains('modal-track-thumbnail'))
    event.preventDefault();
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
  const modalDragSource = document.getElementById(m.dragEntryId);
  const modalDropTarget = event.target.closest('div.modal-tracklist-entry');
  modalDropTarget.insertAdjacentElement(insertPos, modalDragSource);

  // List player tracks drag & drop reorder = sync track lists
  const listTrackSource = document.getElementById(modalDragSource.getAttribute('data-click-id'));
  const listTrackTarget = document.getElementById(modalDropTarget.getAttribute('data-click-id'));
  listTrackTarget.insertAdjacentElement(insertPos, listTrackSource);

  return false;
}


// ************************************************************************************************
//
// ************************************************************************************************

function getUpNextTrackHtml(element, trackArtistAttr, trackTitleAttr, isDraggable = false)
{
  const trackTypeClass = (parseInt(element.getAttribute('data-track-type')) === TRACK_TYPE.YOUTUBE) ? 'type-youtube' : 'type-soundcloud';

  return /*html*/ `
    <div class="modal-track ${isDraggable ? 'modal-draggable-entry' : ''}" ${isDraggable ? 'draggable="true"' : ''}>
      <div class="modal-track-thumbnail modal-ignore-touchmove ${trackTypeClass}" ${isDraggable ? 'title="Click to Play Track"' : ''}>
        <img src="${encodeURI(element.getAttribute('data-track-thumbnail-url'))}">
      </div>
      <div class="modal-track-artist-title text-nowrap-ellipsis" ${isDraggable ? 'title="Drag to Move Track"' : ''}>
        <span><b>${escAttribute(element, trackArtistAttr)}</b></span><br>
        <span class="light-text">${escAttribute(element, trackTitleAttr)}</span>
      </div>
      <div class="modal-track-duration text-nowrap-ellipsis" ${isDraggable ? 'title="Drag to Move Track"' : ''}>
        ${getTimeString(parseInt(element.getAttribute('data-track-duration')))}
      </div>
      ${isDraggable ? getModalTrackButtons() : ''}
    </div>`;
}

function getModalTrackButtons()
{
  return /*html*/ `
    <div class="modal-track-buttons">
      <div class="drag-drop-button" title="Drag to Move Track"><span class="material-icons">drag_handle</span></div>
    </div>`;
}
