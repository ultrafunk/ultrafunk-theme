//
// HTMLElement convenience wrapper objects
//
// https://ultrafunk.com
//


import { replaceClass } from '../shared/utils.js';


/*************************************************************************************************/


export const STATE = {
  UNKNOWN:  { ID:  0, CLASS: 'state-unknown'  },
  HIDDEN:   { ID: 10, CLASS: 'state-hidden'   },
  DISABLED: { ID: 20, CLASS: 'state-disabled' },
  ENABLED:  { ID: 30, CLASS: 'state-enabled'  },
  PLAYING:  { ID: 40, CLASS: 'state-playing'  },
  PAUSED:   { ID: 50, CLASS: 'state-paused'   },
  LOADING:  { ID: 60, CLASS: 'state-loading'  },
};


// ************************************************************************************************
//
// ************************************************************************************************

export const ElementWrapper = function(elmentSelector, parentElement = document, initialState = STATE.DISABLED)
{
  const element   = parentElement.querySelector(elmentSelector);
  let   state     = initialState;
  const classList = element.classList;

  return {
    get element() { return element;       },
    get state()   { return state;         },
    get style()   { return element.style; },

    getElement(selector)         { return element.querySelector(selector);    },
    addListener(event, listener) { element.addEventListener(event, listener); },

    addClass(...cssClass)     { classList.add(...cssClass);         },
    removeClass(...cssClass)  { classList.remove(...cssClass);      },
    replaceClass(remove, add) { replaceClass(element, remove, add); },
    toggleClass(cssClass)     { classList.toggle(cssClass);         },

    getAttribute(attribute)        { return element.getAttribute(attribute); },
    setAttribute(attribute, value) { element.setAttribute(attribute, value); },

    setState,
  };

  function setState(newState = STATE.DISABLED)
  {
    // Only update classList and state if they have actually changed...
    if (state.ID !== newState.ID)
    {
      classList.remove(state.CLASS);
      classList.add(newState.CLASS);
      state = newState;

      return true;
    }

    return false;
  }
};

export const ElementsWrapper = function(elmentsSelector, parentElement = document)
{
  const elements = parentElement.querySelectorAll(elmentsSelector);

  return {
    get length()      { return elements.length;     },
    forEach(callback) { elements.forEach(callback); },
  };
};
