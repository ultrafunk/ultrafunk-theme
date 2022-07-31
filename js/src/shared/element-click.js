//
// HTML Element clicked parent class
//
// https://ultrafunk.com
//


import {
  addListener,
  addListenerAll,
} from "./utils.js";


/*************************************************************************************************/


export default class ElementClick
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
    this.#event = event;
    this.elementClicked();
  }

  get element() { return this.#element; }
  get event()   { return this.#event;   }

  // Placeholder method to be overriden in child class if needed
  elementClicked() {}

  clicked(selector)
  {
    this.#element = this.#event.target.closest(selector);

    if (this.#element !== null)
    {
      this.#event.stopImmediatePropagation();
      return true;
    }

    return false;
  }

  closest(selector)
  {
    return this.#element.closest(selector);
  }

  querySelector(selector)
  {
    return this.#element.querySelector(selector);
  }
}
