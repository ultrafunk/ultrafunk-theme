//
// Modal dialog UI module
//
// https://ultrafunk.com
//


import * as debugLogger from './debuglogger.js';
import { settings }     from './session-data.js';

import {
  config,
  getTemplateHtml,
  getSingleChoiceListHtml,
} from './modal-templates.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('modal');

const m = {
  onEntryClicked:   null,
  onClickClose:     null,
  modalId:          0,
  isOverflowY:      false,
  ignoreTouchMove:  false,
  isTouchDraggable: false,
};

const elements = {
  overlay:   null,
  container: null,
  body:      null,
};


// ************************************************************************************************
//
// ************************************************************************************************

export function showModal(
  modalTitle = 'Modal Title',
  modalBody  = 'Modal Body',
  modalType  = null,
  onEntryClickedCallback = () => {},
  onClickCloseCallback = () => true
)
{
  init();

  if (Array.isArray(modalBody) && (modalBody.length > 0))
    setSingleChoiceList(modalBody);
  else
    elements.body.innerHTML = modalBody;

  m.onEntryClicked = onEntryClickedCallback;
  m.onClickClose   = onClickCloseCallback;

  elements.container.classList = `modal-type-${(modalType !== null) ? modalType : 'default'}`;
  elements.container.querySelector(`.${config.id}-title`).innerHTML = modalTitle;

  elements.overlay.style.backgroundColor = `rgba(0, 0, 0, ${Math.round(10 * (settings.site.modalOverlayOpacity / 100)) / 10})`;
  elements.overlay.classList.add('show');
  elements.overlay.addEventListener('keydown', keyDown);
  elements.overlay.focus();

  disablePageScrolling(true);

  m.modalId++;

  debug.log(`showModal() - modalId: ${m.modalId} - modalType: ${(modalType !== null) ? modalType : 'default'} - modalTitle: ${modalTitle}`);

  return `${config.id}-container`;
}

export function isShowingModal(showingModalId = -1)
{
  return ((showingModalId === m.modalId) && (elements.container !== null) && (elements.overlay.classList.contains('show')));
}

export function closeModal()
{
  document.body.removeEventListener('touchmove', touchMove, { passive: false });
  document.body.removeEventListener('touchstart', touchStart);
  elements.overlay.removeEventListener('keydown', keyDown);
  elements.overlay.classList.replace('show', 'hide');
}

export function getModalId()
{
  return m.modalId;
}

export function getModalEntry(entryNum)
{
  return document.getElementById(`modal-item-${entryNum}`);
}

export function updateModalTitle(updateModalId, updateTitle)
{
  if (updateModalId === m.modalId)
    elements.container.querySelector(`.${config.id}-title`).innerHTML = updateTitle;
}

export function updateModalBody(updateModalId, updateSingleChoiceList)
{
  if (updateModalId === m.modalId)
    setSingleChoiceList(updateSingleChoiceList);
}


// ************************************************************************************************
//
// ************************************************************************************************

function init()
{
  if (elements.container === null)
  {
    document.body.insertAdjacentHTML('beforeend', getTemplateHtml());

    elements.overlay   = document.getElementById(`${config.id}-overlay`);
    elements.container = document.getElementById(`${config.id}-container`);
    elements.body      = elements.overlay.querySelector(`.${config.id}-body`);

    elements.overlay.addEventListener('click', (event) =>
    {
      if (event.target === elements.overlay)
        closeModal();
    });

    elements.overlay.addEventListener('animationend', () =>
    {
      if (elements.overlay.classList.contains('hide'))
      {
        elements.overlay.className = '';
        disablePageScrolling(false);
      }
    });

    elements.overlay.querySelector(`.${config.id}-close-icon`).addEventListener('click', closeModal);
    elements.overlay.querySelector(`.${config.id}-close-button`).addEventListener('click', closeModal);
  }
}

function setSingleChoiceList(singleChoiceList)
{
  elements.body.innerHTML = getSingleChoiceListHtml(singleChoiceList);

  singleChoiceList.forEach(entry =>
  {
    if (entry.clickId)
      elements.body.querySelector(`#${entry.uid}`).addEventListener('click', singleChoiceListClick);
  });
}

function singleChoiceListClick(event)
{
  if (m.onClickClose(event) === true)
  {
    closeModal();
    setTimeout(() => m.onEntryClicked(this.getAttribute('data-click-id'), event), 150);
  }
}

function keyDown(event)
{
  event.stopPropagation();

  if (event.key === 'Escape')
    closeModal();
}

function disablePageScrolling(disableScrolling)
{
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.documentElement.style.overflowY                  = disableScrolling ? 'hidden'              : '';
  document.documentElement.style.paddingRight               = disableScrolling ? `${scrollbarWidth}px` : '';
  document.getElementById('site-header').style.paddingRight = disableScrolling ? `${scrollbarWidth}px` : '';

  if (disableScrolling && ('ontouchstart' in window))
  {
    document.body.addEventListener('touchstart', touchStart);
    document.body.addEventListener('touchmove',  touchMove, { passive: false });
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
