//
// Ultrafunk theme JavaScript configuration
//
// https://ultrafunk.com
//



// Automatically updated on 'npm run build-dev' or 'npm run build-prod'
export const IS_PROD_BUILD = true;
export const IS_DEBUG      = false;



/**************************************************************************************************************************/


export const VERSION = '1.45.23';

export const THEME_ENV = {
  'siteUrl':                    IS_PROD_BUILD ? 'https://ultrafunk.com' : 'https://wordpress.ultrafunk.com',
  'channelVideosId':            IS_PROD_BUILD ?  899 :  875,
  'searchArtistTitleId':        IS_PROD_BUILD ? 4751 : 4122,
  'searchArtistTitleArtistsId': IS_PROD_BUILD ? 4764 : 4134,
  'defaultTrackThumbnail':      '/wp-content/themes/ultrafunk/inc/img/photo_filled_grey.png',
  'defaultYTThumbnail':         '/wp-content/themes/ultrafunk/inc/img/yt_thumbnail_placeholder.png',
  'defaultSCThumbnail':         '/wp-content/themes/ultrafunk/inc/img/sc_thumbnail_placeholder.png',
};
