//
// Termlist UI module
//
// https://ultrafunk.com
//


import * as debugLogger       from '../shared/debuglogger.js';
import * as termlistRest      from './termlist-rest.js';
import * as utils             from '../shared/utils.js';
import { ElementClick }       from '../shared/element-click.js';
import { shareModal }         from './share-modal.js';
import { TRACK_TYPE }         from '../playback/mediaplayers.js';
import { KEY, setCookie }     from '../shared/storage.js';
import { PREF_PLAYER }        from '../shared/settings/settings.js';
import { response, settings } from '../shared/session-data.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('termlist');

const m = {
  listContainer:       null,
  uiElements:          null,
  navTitleFoundItems:  null,
  termlistFilterInput: null,
  termlistEntries:     null,
  transitionTimeoutId: 0,
};

const allowKeyboardShortcutsEvent = new Event('allowKeyboardShortcuts');
const denyKeyboardShortcutsEvent  = new Event('denyKeyboardShortcuts');


// ************************************************************************************************
// Init module
// ************************************************************************************************

export function initTermlist()
{
  debug.log('initTermlist()');

  m.listContainer = document.getElementById('termlist-container');
  m.uiElements    = new UiElements('#termlist-container');

  initTermlistFilter();
  restoreState();
}


// ************************************************************************************************
// Save and restore Termlist state
// ************************************************************************************************

function saveState()
{
  if (termlistRest.hasCache())
  {
    const termlistState = {
      pageUrl:     window.location.href,
      scrollPos:   Math.round(window.pageYOffset),
      openTermIds: [],
    };

    document.querySelectorAll('.termlist-entry').forEach(element =>
    {
      if (element.getAttribute('data-is-expanded') === '1')
        termlistState.openTermIds.push(element.id);
    });

    sessionStorage.setItem(KEY.UF_TERMLIST_STATE, JSON.stringify(termlistState));
    termlistRest.writeCache();
  }
}

function restoreState()
{
  termlistRest.readCache();

  if (performance.getEntriesByType('navigation')[0].type !== 'reload')
  {
    const termlistState = JSON.parse(sessionStorage.getItem(KEY.UF_TERMLIST_STATE));

    if ((termlistState !== null) && (termlistState.pageUrl === window.location.href))
    {
      history.scrollRestoration = 'manual';

      termlistState.openTermIds.forEach(item =>
      {
        document.getElementById(item).querySelector('div.termlist-header').click();
      });

      window.scroll({ top: termlistState.scrollPos, left: 0, behavior: 'auto' });
    }
    else
    {
      history.scrollRestoration = 'auto';
    }
  }

  sessionStorage.removeItem(KEY.UF_TERMLIST_STATE);
  termlistRest.deleteCache();
}


// ************************************************************************************************
// Realtime filtering of termlist items
// ************************************************************************************************

function initTermlistFilter()
{
  if (m.listContainer.getAttribute('data-term-type') === 'artists')
  {
    m.navTitleFoundItems  = document.querySelectorAll('div.navbar-title span.found-items');
    m.termlistFilterInput = document.getElementById('termlist-filter-input');
    m.termlistEntries     = m.listContainer.querySelectorAll('.termlist-entry');

    m.termlistFilterInput.addEventListener('keyup', (event) => filterTermsList(event));
    m.termlistFilterInput.addEventListener('focus', () => document.dispatchEvent(denyKeyboardShortcutsEvent));
    m.termlistFilterInput.addEventListener('blur',  () => document.dispatchEvent(allowKeyboardShortcutsEvent));
  //m.termlistFilterInput.focus();

    // Lowercase all search term names now, optimizing comparison to user input later
    termsListArray.forEach(entry => entry.name = entry.name.toLowerCase()); // eslint-disable-line no-undef

    // Scroll current selection (artist letter) into view if needed...
    document.querySelector('div.artist-letter.current').scrollIntoView(false);
  }
}

function skipKeys(key)
{
  return ((key === 'ArrowLeft')  ||
          (key === 'ArrowRight') ||
          (key === 'Home')       ||
          (key === 'End')        ||
          (key === 'Shift'));
}

function filterTermsList(event)
{
  // Skip updating on keys that are not relevant
  if (skipKeys(event.key))
    return;

  const filterStart  = performance.now();
  const filterString = m.termlistFilterInput.value.toLowerCase();
  let   foundCount   = m.termlistEntries.length;

  // Disable all CSS transitions when updating the filtered items
  m.listContainer.classList.add('notransitions');

  if (filterString.length >= 3)
  {
    // eslint-disable-next-line no-undef
    const foundEntries = termsListArray.filter(entry => (entry.name.includes(filterString)));
    let filteredOddEvenRow = 1;
    foundCount = (foundEntries.length > 0) ? foundEntries.length : 0;

    m.termlistEntries.forEach(element =>
    {
      if (foundEntries.some(entry => (entry.id === element.id)) === false)
        element.className = 'termlist-entry hidden';
      else
        element.className = `termlist-entry ${(filteredOddEvenRow++ % 2) ? 'odd' : 'even'}`;
    });
  }
  else
  {
    m.termlistEntries.forEach(element => (element.className = 'termlist-entry'));
  }

  const currentFilterInput = (filterString.length >= 3) ? `"${filterString}" - ` : '';
  m.navTitleFoundItems.forEach(element => (element.textContent = ` ( ${currentFilterInput}${foundCount} found )`));

  // Cancel previous timeout if already running to prevent multiple setTimeout()s
  clearTimeout(m.transitionTimeoutId);
  // Restore all CSS transitions when done updating
  m.transitionTimeoutId = setTimeout(() => m.listContainer.classList.remove('notransitions'), 250);

  const filterStop = performance.now();
  debug.log(`filterTermsList(): ${(Math.round((filterStop - filterStart) * 100) / 100)} ms.`);
}


// ************************************************************************************************
// Click event functions
// ************************************************************************************************

class UiElements extends ElementClick
{
  elementClicked()
  {
    if (this.clicked('div.play-button'))
      return playClick(this.event, utils.getPrefPlayerUrl(this.querySelector('a').href));

    if (this.clicked('div.shuffle-button'))
      return shuffleClick(this.event, utils.getPrefPlayerUrl(this.querySelector('a').href));

    if (this.clicked('div.share-find-button'))
      return shareFindClick(this.element);

    if (this.clicked('div.termlist-header'))
      return termlistHeaderClick(this.event);

    if (this.clicked('div.thumbnail'))
      return playTrackClick(this.event, this.element);

    if (this.clicked('a'))
      return linkClicked(this.event, this.element);
  }
}

function playClick(event, destUrl, trackId = null)
{
  event?.preventDefault();
  saveState();

  // ToDo: Create a playbackSetting for this? Or use SHIFT + click to skip autoplay
  sessionStorage.setItem(KEY.UF_AUTOPLAY, JSON.stringify({ autoplay: (event.shiftKey === false), trackId: trackId, position: 0 }));

  utils.navToUrl(destUrl);
}

function shuffleClick(event, destUrl)
{
  setCookie(KEY.UF_RESHUFFLE, 'true');
  playClick(event, destUrl);
}

function shareFindClick(element)
{
  const termName = utils.stripAttribute(element, 'data-term-name');
  const urlType  = (m.listContainer.getAttribute('data-term-type') === 'channels') ? 'Channel link' : 'Artist link';

  shareModal.show({
    title:    `Share / Find ${utils.stripAttribute(element, 'data-term-path')}`,
    bodyText: termName,
    bodyHtml: `<b>${termName}</b>`,
    url:      utils.getPrefPlayerUrl(element.getAttribute('data-term-url')),
    urlType:  urlType,
    verb:     'Find',
    icon:     'search',
  });
}

function playTrackClick(event, element)
{
  const termType       = (m.listContainer.getAttribute('data-term-type') === 'channels') ? 'channel' : 'artist';
  const termSlug       = utils.stripAttribute(element, 'data-term-slug');
  const trackType      = parseInt(element.getAttribute('data-track-type'));
  const trackSourceUid = element.getAttribute('data-track-source-uid');

  if ((settings.playback.preferredPlayer === PREF_PLAYER.GALLERY) || (trackType === TRACK_TYPE.SOUNDCLOUD))
  {
    playClick(event, element.getAttribute('data-term-url'), null);
  }
  else
  {
    const trackNum = parseInt(element.getAttribute('data-track-num'));
    let pagination = '';

    if (trackNum > response.listPerPage)
      pagination = `page/${Math.ceil(trackNum / response.listPerPage)}/`;

    playClick(event, `${utils.SITE_URL}/list/${termType}/${termSlug}/${pagination}`, trackSourceUid);
  }
}

function linkClicked(event, element)
{
  saveState();

  if (element.closest('div.permalink') !== null)
  {
    event?.preventDefault();
    utils.navToUrl(utils.getPrefPlayerUrl(element.href));
  }
}

function termlistHeaderClick(event)
{
  const termlistEntry = event.target.closest('div.termlist-entry');
  const expandToggle  = termlistEntry.querySelector('div.expand-toggle span');
  const termlistBody  = termlistEntry.querySelector('div.termlist-body');
  const isExpanded    = (termlistEntry.getAttribute('data-is-expanded') === '1');
  const isDataFetched = (termlistEntry.getAttribute('data-is-fetched') === '1');

  termlistEntry.setAttribute('data-is-expanded', isExpanded ? '' : '1');

  expandToggle.textContent   = isExpanded ? 'expand_more' : 'expand_less';
  termlistBody.style.display = isExpanded ? ''            : 'flex';

  if (!isExpanded && !isDataFetched)
    termlistRest.loadTermlist(m.listContainer, termlistEntry, termlistBody);
}
