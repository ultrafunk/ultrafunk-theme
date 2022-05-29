//
// Share modal
//
// https://ultrafunk.com
//


import * as debugLogger from '../shared/debuglogger.js';
import { showModal }    from '../shared/modal.js';
import { showSnackbar } from '../shared/snackbar.js';


/*************************************************************************************************/


const debug = debugLogger.newInstance('share-modal');


// ************************************************************************************************
// Share Modal Dialog closure
// ************************************************************************************************

const shareModalClosure = (() =>
{
  const filterBodyTextRegEx = /\s{1,}[\u002D\u00B7\u2013]\s{1,}/i;
  let title, bodyText, filterBodyText, bodyHtml, url, sourceUid, verb;

  return {
    show,
  };
  
  function show(args)
  {
    ({
      title          = 'Share / Play Track',
      bodyText       = null,
      filterBodyText = false,
      bodyHtml       = null,
      url            = null,
      sourceUid      = null,
      verb           = 'Play'
    } = args);

    return showModal(title, getSingleChoiceList(), 'share', singleChoiceListClick);
  }

  function getSingleChoiceList()
  {
    const singleChoiceList = [
      { clickId: 'copyToClipboardId', icon: 'content_copy', content: '<b>Copy Link</b> to Clipboard'   },
      { clickId: 'shareOnEmailId',    icon: 'share',        content: '<b>Share</b> on Email'           },
      { clickId: 'amazonMusicId',     icon: 'link',         content: `<b>${verb}</b> on Amazon Music`  },
      { clickId: 'appleMusicId',      icon: 'link',         content: `<b>${verb}</b> on Apple Music`   },
      { clickId: 'spotifyId',         icon: 'link',         content: `<b>${verb}</b> on Spotify`       },
      { clickId: 'tidalId',           icon: 'link',         content: `<b>${verb}</b> on Tidal`         },
      { clickId: 'youTubeMusicId',    icon: 'link',         content: `<b>${verb}</b> on YouTube Music` },
    ];

    if (bodyHtml !== null)
      singleChoiceList.unshift({ class: 'track-share-entry', content: bodyHtml });

    return singleChoiceList;
  }

  function singleChoiceListClick(clickedId)
  {
    debug.log(`singleChoiceListClick(): ${clickedId} - title: "${title}" - bodyText: "${bodyText}" - filterBodyText: ${filterBodyText} - url: ${url} - sourceUid: ${sourceUid} - verb: ${verb}`);

    const searchString = filterBodyText
                           ? encodeURIComponent(bodyText.replace(filterBodyTextRegEx, ' '))
                           : encodeURIComponent(bodyText);

    switch (clickedId)
    {
      case 'copyToClipboardId':
        copyTextToClipboard(url, 'Track link copied to clipboard', 'Unable to copy Track link to clipboard');
        break;

      case 'shareOnEmailId':
        window.location.href = `mailto:?subject=${encodeURIComponent(bodyText)}&body=${encodeURI(url)}%0d%0a`;
        break;

      case 'amazonMusicId':
        window.open(`https://music.amazon.com/search/${searchString}`, "_blank");
        break;

      case 'appleMusicId':
        window.open(`https://music.apple.com/ca/search?term=${searchString}`, "_blank");
        break;

      case 'spotifyId':
        window.open(`https://open.spotify.com/search/${searchString}`, "_blank");
        break;

      case 'tidalId':
        window.open(`https://google.com/search?q=${searchString}%20site:tidal.com`, "_blank");
        break;

      case 'youTubeMusicId':
        {
          if (sourceUid !== null)
            window.open(`https://music.youtube.com/watch?v=${sourceUid}`, "_blank");
          else
            window.open(`https://music.youtube.com/search?q=${searchString}`, "_blank");
        }
        break;
    }
  }
});

export const shareModal = shareModalClosure();


// ************************************************************************************************
//
// ************************************************************************************************

export function copyTextToClipboard(clipboardText, successMessage = 'Text copied to clipboard', errorMessage = 'Unable to copy text to clipboard')
{
  navigator.clipboard.writeText(clipboardText).then(() =>
  {
    showSnackbar(successMessage, 3);
  },
  (reason) =>
  {
    debug.error(`copyTextToClipboard() failed because ${reason}`);
    showSnackbar(errorMessage, 5);
  });
}
