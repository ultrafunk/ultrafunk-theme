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


export { showModal };


/*************************************************************************************************/


const debug = debugLogger.newInstance('modal');
const m     = { selectedClick: null };

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
  debug.log(`showModal(): ${typeString} - ${title}`);

  init();
  
  m.selectedClick = selectedClickCallback;
  setSingleChoiceList(singleChoiceList);

  elements.container.classList = `modal-type-${typeString}`;
  elements.container.querySelector(`.${config.id}-title`).innerHTML = title;
  elements.overlay.classList.add('show');
  elements.overlay.addEventListener('keydown', keyDown);
  elements.overlay.focus();
  disablePageScrolling(true);

  return config.id;
}

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
        close();
    });

    elements.overlay.addEventListener('animationend', () =>
    {
      if (elements.overlay.classList.contains('hide'))
      {
        elements.overlay.className = '';
        disablePageScrolling(false);
      }
    });

    elements.overlay.querySelector(`.${config.id}-close-icon`).addEventListener('click', close);
  }
}

function setSingleChoiceList(singleChoiceList)
{
  insertSingleChoiceListHtml(singleChoiceList, elements);
  
  singleChoiceList.forEach(entry =>
  {
    if (entry.clickId)
      elements.body.querySelector(`#${entry.uid}`).addEventListener('click', singleChoiceListClick);
  });
}

function singleChoiceListClick()
{
  close();
  setTimeout(() => m.selectedClick(this.getAttribute('data-click-id')), 150);
}

function keyDown(event)
{
  event.stopPropagation();

  if (event.key === 'Escape')
    close();
}

function close()
{
  elements.overlay.removeEventListener('keydown', keyDown);
  elements.overlay.classList.replace('show', 'hide');
}

function disablePageScrolling(disable)
{
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
//document.documentElement.style.touchAction  = disable ? 'none'   : '';
  document.documentElement.style.overflowY    = disable ? 'hidden' : '';
  document.documentElement.style.paddingRight = disable ? `${scrollbarWidth}px` : '';
  document.getElementById('site-header').style.paddingRight = disable ? `${scrollbarWidth}px` : '';
}
