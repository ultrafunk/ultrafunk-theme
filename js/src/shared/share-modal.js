//
// Share modal
//
// https://ultrafunk.com
//


import { showModal }           from './modal.js';
import { copyTextToClipboard } from './clipboard.js';


// ************************************************************************************************
// Share Modal Dialog closure
// ************************************************************************************************

const shareModalClosure = (() =>
{
  const filterBodyTextRegEx = /\s{1,}[\u002D\u00B7\u2013]\s{1,}/i;
  let title, bodyText, filterBodyText, bodyHtml, url, urlType, sourceUid, verb, icon, onCloseFocusElement;

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
      onCloseFocusElement = null,
    } = args);

    return showModal({
      modalTitle: title,
      modalList:  getModalList(),
      modalType:  'share',
      onClickEntryCallback: () => copyTextToClipboard(url, urlType),
      onCloseFocusElement: onCloseFocusElement,
    });
  }

  function getModalList()
  {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(`Ultrafunk ${urlType}: ${bodyText}`)}&body=${encodeURI(url)}%0d%0a`;

    const searchString = filterBodyText
      ? encodeURIComponent(bodyText.replace(filterBodyTextRegEx, ' '))
      : encodeURIComponent(bodyText);

    const youTubeLink = (sourceUid !== null)
      ? `https://music.youtube.com/watch?v=${sourceUid}`
      : `https://music.youtube.com/search?q=${searchString}`;

    const modalList = [
      { icon: 'content_copy', content: '<b>Copy Link</b> to Clipboard',   clickId: 'copyToClipboardId' },
      { icon: 'share',        content: '<b>Share</b> on Email',           link: mailtoLink             },
      { icon: 'search',       content: '<b>Search</b> on Google',         link: `https://www.google.com/search?q=${searchString}`,        linkTarget: '_blank' },
      { icon: icon,           content: `<b>${verb}</b> on Amazon Music`,  link: `https://music.amazon.com/search/${searchString}`,        linkTarget: '_blank' },
      { icon: icon,           content: `<b>${verb}</b> on Apple Music`,   link: `https://music.apple.com/ca/search?term=${searchString}`, linkTarget: '_blank' },
      { icon: icon,           content: `<b>${verb}</b> on Spotify`,       link: `https://open.spotify.com/search/${searchString}`,        linkTarget: '_blank' },
      { icon: icon,           content: `<b>${verb}</b> on YouTube Music`, link: youTubeLink,                                              linkTarget: '_blank' },
    ];

    // If input device is touch, Spotify needs a different search link
    if (window.matchMedia('(pointer: coarse)').matches)
      modalList[5].link = `https://open.spotify.com/search/results/${searchString}`;

    if (bodyHtml !== null)
      modalList.unshift({ class: 'track-share-entry', content: bodyHtml });

    return modalList;
  }
});

export const shareModal = shareModalClosure();
