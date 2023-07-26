//
// Share modal
//
// https://ultrafunk.com
//


import { newDebugLogger }      from '../shared/debuglogger.js';
import { showModal }           from '../shared/modal.js';
import { copyTextToClipboard } from '../shared/clipboard.js';


/*************************************************************************************************/


const debug = newDebugLogger('share-modal');


// ************************************************************************************************
// Share Modal Dialog closure
// ************************************************************************************************

const shareModalClosure = (() =>
{
  const filterBodyTextRegEx = /\s{1,}[\u002D\u00B7\u2013]\s{1,}/i;
  let title, bodyText, filterBodyText, bodyHtml, url, urlType, sourceUid, verb, icon;

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
      urlType        = 'Link',
      sourceUid      = null,
      verb           = 'Play',
      icon           = 'link',
    } = args);

    return showModal(title, getSingleChoiceList(), 'share', singleChoiceListClick);
  }

  function getSingleChoiceList()
  {
    const singleChoiceList = [
      { clickId: 'copyToClipboardId', icon: 'content_copy', content: '<b>Copy Link</b> to Clipboard'   },
      { clickId: 'shareOnEmailId',    icon: 'share',        content: '<b>Share</b> on Email'           },
      { clickId: 'searchOnGoogleId',  icon: 'search',       content: '<b>Search</b> on Google'         },
      { clickId: 'amazonMusicId',     icon: icon,           content: `<b>${verb}</b> on Amazon Music`  },
      { clickId: 'appleMusicId',      icon: icon,           content: `<b>${verb}</b> on Apple Music`   },
      { clickId: 'spotifyId',         icon: icon,           content: `<b>${verb}</b> on Spotify`       },
      { clickId: 'youTubeMusicId',    icon: icon,           content: `<b>${verb}</b> on YouTube Music` },
    ];

    if (bodyHtml !== null)
      singleChoiceList.unshift({ class: 'track-share-entry', content: bodyHtml });

    return singleChoiceList;
  }

  function singleChoiceListClick(clickedId)
  {
    debug.log(`singleChoiceListClick(): ${clickedId} - title: "${title}" - bodyText: "${bodyText}" - filterBodyText: ${filterBodyText} - url: ${url} - urlType: ${urlType} - sourceUid: ${sourceUid} - verb: ${verb}`);

    const searchString = filterBodyText
                           ? encodeURIComponent(bodyText.replace(filterBodyTextRegEx, ' '))
                           : encodeURIComponent(bodyText);

    switch (clickedId)
    {
      case 'copyToClipboardId':
        copyTextToClipboard(url, urlType);
        break;

      case 'shareOnEmailId':
        window.location.href = `mailto:?subject=${encodeURIComponent(`Ultrafunk ${urlType}: ${bodyText}`)}&body=${encodeURI(url)}%0d%0a`;
        break;

      case 'searchOnGoogleId':
        window.open(`https://www.google.com/search?q=${searchString}`, "_blank");
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
