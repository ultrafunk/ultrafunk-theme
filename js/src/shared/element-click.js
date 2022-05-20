//
// HTML Element clicked parent class
//
// https://ultrafunk.com
//


export default class ElementClick
{
  constructor()
  {
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
    return this.element;
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
