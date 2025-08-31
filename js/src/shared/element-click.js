//
// HTML Element click abstract base class
//
// https://ultrafunk.com
//


import {
  addListener,
  addListenerAll,
} from './utils.js';


/*************************************************************************************************/


export class ElementClick
{
  #event   = null;
  #element = null;

  constructor(selectors, addToAllMatching = false)
  {
    if (addToAllMatching)
      addListenerAll(selectors, 'click', (event) => this.#clickHandler(event));
    else
      addListener(selectors, 'click', (event) => this.#clickHandler(event));
  }

  #clickHandler(event)
  {
    this.#element = this.#getClickedElement(event.target);

    if (this.#element !== null)
    {
      const clickId = this.#element.getAttribute('data-click-id');

      if (clickId.length !== 0)
      {
        this.#event = event;
        this.#event.stopImmediatePropagation();
        this.elementClicked(clickId);
      }
      else
      {
        console.error('ElementClick.clickHandler(): data-click-id attribute is missing identifier string!');
      }
    }
  }

  #getClickedElement(element)
  {
    if (element.hasAttribute('data-click-id'))
      return element;

    if (element.parentElement?.hasAttribute('data-click-id'))
      return element.parentElement;

    if (element.parentElement?.parentElement?.hasAttribute('data-click-id'))
      return element.parentElement.parentElement;

    return null;
  }

  elementClicked()
  {
    console.error('ElementClick.elementClicked() method must be implemented in child class!');
  }

  get element() { return this.#element; }
  get event()   { return this.#event;   }

  closest(selector)       { return this.#element.closest(selector);            }
  querySelector(selector) { return this.#element.querySelector(selector);      }
  hasClass(cssClass)      { return this.#element.classList.contains(cssClass); }
}
