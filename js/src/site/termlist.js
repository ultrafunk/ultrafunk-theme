//
// Termlist UI module
//
// https://ultrafunk.com
//


import * as debugLogger       from '../shared/debuglogger.js';
import * as termlistRest      from './termlist-rest.js';
import * as utils             from '../shared/utils.js';
import ElementClick           from '../shared/element-click.js';
import { shareModal }         from './share-modal.js';
import { TRACK_TYPE }         from '../playback/mediaplayers.js';
import { KEY, setCookie }     from '../shared/storage.js';
import { PREF_PLAYER }        from '../shared/settings/settings.js';
import { response, settings } from '../shared/session-data.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('termlist-controls');

const m = {
  listContainer: null,
  uiElements:    null,
};


// ************************************************************************************************
// Setup module
// ************************************************************************************************

export function init()
{
  debug.log('init()');

  m.listContainer = document.getElementById('termlist-container');
  m.uiElements    = new UiElements('#termlist-container');

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
      if (element.classList.contains('open'))
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
  const isExpanded    = (termlistBody.style.display.length !== 0);
  const isDataFetched = termlistEntry.classList.contains('data-fetched');

  utils.replaceClass(termlistEntry, (isExpanded ? 'open' : 'closed'), (isExpanded ? 'closed' : 'open'));

  expandToggle.textContent   = isExpanded ? 'expand_more' : 'expand_less';
  termlistBody.style.display = isExpanded ? ''            : 'flex';

  if (!isExpanded && !isDataFetched)
    termlistRest.loadTermlist(m.listContainer, termlistEntry, termlistBody);
}
