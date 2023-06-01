<?php declare(strict_types=1);
/*
 * Ultrafunk theme PHP configuration
 *
 */


namespace Ultrafunk\Theme\Config;


/**************************************************************************************************************************/



// Automatically updated on 'npm run build-dev' or 'npm run build-prod'
const IS_PROD_BUILD = true;
const IS_DEBUG      = false;



/**************************************************************************************************************************/


const VERSION = '1.45.13';

const THEME_ENV = [
  'menu_item_all_tracks_id' => IS_PROD_BUILD ? 4430 : 4057,
  'menu_item_artists_id'    => IS_PROD_BUILD ? 4431 : 4058,
  'menu_item_channels_id'   => IS_PROD_BUILD ? 4432 : 4059,
  'menu_item_shuffle_id'    => IS_PROD_BUILD ? 4433 : 4060,
  'page_about_id'           => IS_PROD_BUILD ?  806 :  806,
  'channel_videos_id'       => IS_PROD_BUILD ?  899 :  875,
  'js_path'                 => IS_PROD_BUILD ? '/js/dist/' : '/js/src/',
];

// Automatically updated on 'npm run build-dev' or 'npm run build-prod'
const JS_PRELOAD_CHUNK = '/js/dist/chunk-3KCZMWDH.js';
