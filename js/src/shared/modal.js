//
// Modal dialog UI module
//
// https://ultrafunk.com
//


import { newDebugLogger } from './debuglogger.js';
import { getOverlayOpacityCssValue } from './utils.js';

import {
  getTemplateHtml,
  getModalListHtml,
} from './modal-templates.js';


/*************************************************************************************************/


const debug = newDebugLogger('modal');

const m = {
  onClickClose:        null,
  onClickEntry:        null,
  onCloseFocusElement: null,
  modalId:             0,
  clickItemsCount:     0,
  isOverflowY:         false,
  ignoreTouchMove:     false,
  isTouchDraggable:    false,
};

const elements = {
  overlay:   null,
  container: null,
  body:      null,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function showModal({
  modalType  = 'default',
  modalTitle = 'Modal Title',
  modalBody  = null,
  modalList  = [],
  onClickCloseCallback = () => true,
  onClickEntryCallback = () => {},
  onCloseFocusElement  = null,
} = {})
{
  const isModalList = ((modalList.length > 0) && (modalBody === null));

  debug.log(`showModal() - modalId: ${m.modalId + 1} - modalType: ${modalType} (${isModalList ? 'list' : 'body'}) - modalTitle: ${modalTitle}`);

  initElements();
  resetState();

  m.onClickClose        = onClickCloseCallback;
  m.onClickEntry        = onClickEntryCallback;
  m.onCloseFocusElement = onCloseFocusElement;
  m.clickItemsCount     = 0;

  if (isModalList)
    setModalList(modalList, modalType);
  else
    elements.body.innerHTML = modalBody;

  elements.container.className = `modal-type-${modalType}`;
  elements.container.classList.add((m.clickItemsCount > 10) ? 'modal-click-items-2-columns' : 'modal-click-items-1-column');
  elements.container.querySelector('.modal-dialog-title').innerHTML = modalTitle;

  elements.overlay.style.backgroundColor = getOverlayOpacityCssValue();
  elements.overlay.classList.add('show');
  elements.overlay.addEventListener('keydown', keyDown);
  elements.overlay.focus();

  disablePageScrolling(true);

  return ++m.modalId;
}

export function isShowingModal(showingModalId = -1)
{
  return ((showingModalId === m.modalId) &&
          (elements.container !== null)  &&
          (elements.overlay.classList.contains('show')));
}

export function getModalRootElement()
{
  return elements.container;
}

export function getModalEntry(entryNum)
{
  return document.getElementById(`modal-item-${entryNum}`);
}

export function updateModalTitle(updateModalId, updateTitle)
{
  if (updateModalId === m.modalId)
    elements.container.querySelector('.modal-dialog-title').innerHTML = updateTitle;
}

export function updateModalList(updateModalId, modalList)
{
  if (updateModalId === m.modalId)
    setModalList(modalList);
}


// ************************************************************************************************
//
// ************************************************************************************************

function initElements()
{
  if (elements.container === null)
  {
    document.body.insertAdjacentHTML('beforeend', getTemplateHtml());

    elements.overlay   = document.getElementById('modal-dialog-overlay');
    elements.container = document.getElementById('modal-dialog-container');
    elements.body      = elements.container.querySelector('.modal-dialog-body');

    elements.overlay.addEventListener('click', (event) =>
    {
      if (event.target === elements.overlay)
        resetState();
    });

    elements.container.querySelector('.modal-dialog-close-icon').addEventListener('click', resetState);
    elements.container.querySelector('.modal-dialog-close-button').addEventListener('click', resetState);
  }
}

function resetState()
{
  if (isShowingModal(m.modalId))
  {
    document.body.removeEventListener('touchmove', touchMove, { passive: false });
    document.body.removeEventListener('touchstart', touchStart);
    elements.overlay.removeEventListener('keydown', keyDown);
    elements.overlay.className = '';
    disablePageScrolling(false);
    m.onCloseFocusElement?.focus();
  }
}

function setModalList(modalList, modalType = 'default')
{
  if (modalType === 'track-details')
    modalList.forEach(item => (item.link && m.clickItemsCount++));

  elements.body.innerHTML = getModalListHtml(modalList, m.clickItemsCount);
  elements.body.addEventListener('click', modalListClick);
}

function modalListClick(event)
{
  const clickedEntryElement = event.target.closest('.modal-click-item');

  if (clickedEntryElement && (m.onClickClose(event) === true))
  {
    const entryClickId = clickedEntryElement?.getAttribute('data-click-id');

    resetState();

    if (entryClickId)
      m.onClickEntry(entryClickId, event);
  }
}

function keyDown(event)
{
  event.stopPropagation();

  if (event.key === 'Escape')
    resetState();
}

function disablePageScrolling(disableScrolling)
{
  if (disableScrolling)
  {
    document.body.classList.add('scrolling-disabled');

    if ('ontouchstart' in window)
    {
      document.body.addEventListener('touchstart', touchStart);
      document.body.addEventListener('touchmove',  touchMove, { passive: false });
    }
  }
  else
  {
    document.body.classList.remove('scrolling-disabled');
  }
}

function touchStart(event)
{
  m.isOverflowY      = (elements.container.scrollHeight > elements.container.clientHeight);
  m.ignoreTouchMove  = (true   === event.target.classList.contains('modal-ignore-touchmove'));
  m.isTouchDraggable = ('true' === event.target.closest('.modal-draggable-entry')?.getAttribute('draggable'));
}

function touchMove(event)
{
  if (m.isOverflowY)
    return;

  if ((m.isTouchDraggable === false) || m.ignoreTouchMove)
    event.preventDefault();
}
