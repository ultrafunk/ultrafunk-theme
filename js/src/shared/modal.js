//
// Modal dialog UI module
//
// https://ultrafunk.com
//


import * as debugLogger from './debuglogger.js';

import {
  config,
  getTemplateHtml,
  insertSingleChoiceListHtml,
} from './modal-templates.js';


export {
  showModal,
  isShowingModal,
  closeModal,
  getModalId,
  getModalEntry,
  updateModalTitle,
  updateModalBody,
};


/*************************************************************************************************/


const debug = debugLogger.newInstance('modal');

const m = {
  selectedClick: null,
  modalId:       0,
};

const elements = {
  overlay:   null,
  container: null,
  body:      null,
};


// ************************************************************************************************
//
// ************************************************************************************************

function showModal(typeString, title, singleChoiceList, selectedClickCallback)
{
  init();
  
  m.selectedClick = selectedClickCallback;
  setSingleChoiceList(singleChoiceList);

  elements.container.classList = `modal-type-${typeString}`;
  elements.container.querySelector(`.${config.id}-title`).innerHTML = title;
  elements.overlay.classList.add('show');
  elements.overlay.addEventListener('keydown', keyDown);
  elements.overlay.focus();
  disablePageScrolling(true);

  m.modalId++;

  debug.log(`showModal() - modalId: ${m.modalId} - typeString: ${typeString} - title: ${title}`);

  return config.id;
}

function isShowingModal(showingModalId = -1)
{
  return ((showingModalId === m.modalId) && (elements.container !== null) && (elements.overlay.classList.contains('show')));
}

function closeModal()
{
  elements.overlay.removeEventListener('keydown', keyDown);
  elements.overlay.classList.replace('show', 'hide');
}

function getModalId()
{
  return m.modalId;
}

function getModalEntry(entryNum)
{
  return document.getElementById(`modal-item-${entryNum}`);
}

function updateModalTitle(updateModalId, updateTitle)
{
  if (updateModalId === m.modalId)
    elements.container.querySelector(`.${config.id}-title`).innerHTML = updateTitle;
}

function updateModalBody(updateModalId, updateSingleChoiceList)
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
    
    elements.overlay   = document.getElementById(config.id);
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
  }
}

function setSingleChoiceList(singleChoiceList)
{
  insertSingleChoiceListHtml(singleChoiceList, elements.body);
  
  singleChoiceList.forEach(entry =>
  {
    if (entry.clickId)
      elements.body.querySelector(`#${entry.uid}`).addEventListener('click', singleChoiceListClick);
  });
}

function singleChoiceListClick()
{
  closeModal();
  setTimeout(() => m.selectedClick(this.getAttribute('data-click-id')), 150);
}

function keyDown(event)
{
  event.stopPropagation();

  if (event.key === 'Escape')
    closeModal();
}

function disablePageScrolling(disable)
{
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
//document.documentElement.style.touchAction  = disable ? 'none'   : '';
  document.documentElement.style.overflowY    = disable ? 'hidden' : '';
  document.documentElement.style.paddingRight = disable ? `${scrollbarWidth}px` : '';
  document.getElementById('site-header').style.paddingRight = disable ? `${scrollbarWidth}px` : '';
}
