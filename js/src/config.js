//
// Ultrafunk theme JavaScript configuration
//
// https://ultrafunk.com
//



// Automatically updated on 'npm run build-dev' or 'npm run build-prod'
export const IS_PROD_BUILD = true;
export const IS_DEBUG      = false;



/**************************************************************************************************************************/


export const VERSION = '1.47.8';

export const ULTRAFUNK_THEME_URI = IS_PROD_BUILD
                                     ? 'https://ultrafunk.com/wp-content/themes/ultrafunk'
                                     : 'https://wordpress.ultrafunk.com/wp-content/themes/ultrafunk';

export const THEME_ENV = {
  'siteUrl':                            IS_PROD_BUILD ? 'https://ultrafunk.com' : 'https://wordpress.ultrafunk.com',
  'channelVideosId':                    IS_PROD_BUILD ?  899 :  875,
  'searchArtistTitleId':                IS_PROD_BUILD ? 4751 : 4122,
  'searchArtistTitleArtistsId':         IS_PROD_BUILD ? 4764 : 4134,
  'searchArtistTitleChannelsId':        IS_PROD_BUILD ? 5127 : 4185,
  'searchArtistTitleArtistsChannelsId': IS_PROD_BUILD ? 5128 : 4186,
  'defaultTrackThumbnail':              ULTRAFUNK_THEME_URI + '/inc/img/photo_filled_grey.png',
  'defaultYTThumbnail':                 ULTRAFUNK_THEME_URI + '/inc/img/yt_thumbnail_placeholder.png',
  'defaultSCThumbnail':                 ULTRAFUNK_THEME_URI + '/inc/img/sc_thumbnail_placeholder.png',
  'defaultLTThumbnail':                 ULTRAFUNK_THEME_URI + '/inc/img/lt_thumbnail_placeholder.png',
  'defaultLTImagePlaceholder':          ULTRAFUNK_THEME_URI + '/inc/img/lt_image_placeholder.png',
};
