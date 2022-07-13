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
  constructor(selectors, addToAllMatching = false)
  {
    if (addToAllMatching)
      addListenerAll(selectors, 'click', (event) => this.clickHandler(event));
    else
      addListener(selectors, 'click', (event) => this.clickHandler(event));
    
    this.event   = null;
    this.element = null;
  }

  clickHandler(event)
  {
    this.event = event;
    this.elementClicked();
  }

  clicked(selector)
  {
    this.element = this.event.target.closest(selector);

    if (this.element !== null)
    {
      this.event.stopImmediatePropagation();
      return true;
    }
    
    return false;
  }

  closest(selector)
  {
    return this.element.closest(selector);
  }

  querySelector(selector)
  {
    return this.element.querySelector(selector);
  }
}
