//
// HTMLElement convenience wrapper objects
//
// https://ultrafunk.com
//


export {
  STATE,
  ElementWrapper,
  ElementsWrapper,
};


/*************************************************************************************************/


const STATE = {
  UNKNOWN:  { ID:  0, CLASS: 'state-unknown'  },
  DISABLED: { ID: 10, CLASS: 'state-disabled' },
  ENABLED:  { ID: 20, CLASS: 'state-enabled'  },
  HIDDEN:   { ID: 30, CLASS: 'state-hidden'   },
  PLAYING:  { ID: 40, CLASS: 'state-playing'  },
  PAUSED:   { ID: 50, CLASS: 'state-paused'   },
  LOADING:  { ID: 60, CLASS: 'state-loading'  },
};



// ************************************************************************************************
//
// ************************************************************************************************

const ElementWrapper = function(elmentSelector, parentElement = document, initialState = STATE.DISABLED)
{
  const element   = parentElement.querySelector(elmentSelector);
  let   state     = initialState;
  const classList = element.classList;

  return {
    get state() { return state;         },
    get style() { return element.style; },

    set elementTitle(title) { element.title = title; },

    getElement(selector)         { return element.querySelector(selector);    },
    addListener(event, listener) { element.addEventListener(event, listener); },

    addClass(...cssClass)    { classList.add(...cssClass);    },
    removeClass(...cssClass) { classList.remove(...cssClass); },
    toggleClass(cssClass)    { classList.toggle(cssClass);    },

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
    }
  }
};

const ElementsWrapper = function(elmentsSelector, parentElement = document)
{
  const elements = parentElement.querySelectorAll(elmentsSelector);

  return {
    get length()     { return elements.length;    },
    forEach(...args) { elements.forEach(...args); },
  };
};
