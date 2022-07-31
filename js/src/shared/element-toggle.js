//
// ElementToggle UI / Proxy base class
//
// https://ultrafunk.com
//


import { getCssPropString } from "./utils.js";


/*************************************************************************************************/


export default class ElementToggle
{
  #element      = null;
  #valueElement = null;
  #toggleTarget = null;
  #updateTarget = null;

  constructor(elementId, updateOnConstruct = true)
  {
    this.#element      = document.getElementById(elementId);
    this.#valueElement = this.#element.querySelector('span.value');
    this.#toggleTarget = this.toggle;
    this.toggle        = this.toggleProxy;
    this.#updateTarget = this.update;
    this.update        = this.updateProxy;

    this.#element.addEventListener('click', (event) =>
    {
      event?.preventDefault();
      this.toggle(event);
    });

    if (updateOnConstruct)
      this.update();
  }

  #isEnabled()            { return (this.#element.classList.contains('disabled') === false);       }
  #pointerEventsEnabled() { return (getCssPropString('pointer-events', this.#element) !== 'none'); }

  get element()    { return this.#element;                   }
  get classList()  { return this.#element.classList;         }
  set value(value) { this.#valueElement.textContent = value; }

  // Placeholder method to be overriden in child class if needed
  // eslint-disable-next-line no-unused-vars
  toggle(event) {}

  // Proxy for overridden child class method
  toggleProxy(event)
  {
    if (this.#isEnabled() && this.#pointerEventsEnabled())
    {
      this.#toggleTarget(event);
      this.#updateTarget(event);
    }
  }

  // Placeholder method to be overriden in child class if needed
  // eslint-disable-next-line no-unused-vars
  update(event) {}

  // Proxy for overridden child class method
  updateProxy()
  {
    this.#updateTarget();
  }
}
