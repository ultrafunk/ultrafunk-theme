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


const VERSION = '1.47.5';

define('ULTRAFUNK_THEME_URI', esc_url(get_template_directory_uri()));

const THEME_ENV = [
  'menu_item_all_tracks_id' => IS_PROD_BUILD ? 4430 : 4057,
  'menu_item_artists_id'    => IS_PROD_BUILD ? 4431 : 4058,
  'menu_item_channels_id'   => IS_PROD_BUILD ? 4432 : 4059,
  'menu_item_shuffle_id'    => IS_PROD_BUILD ? 4433 : 4060,
  'page_about_id'           => IS_PROD_BUILD ?  806 :  806,
  'channel_videos_id'       => IS_PROD_BUILD ?  899 :  875,
  'js_path'                 => IS_PROD_BUILD ? '/js/dist/' : '/js/src/',
  'default_yt_thumbnail'    => ULTRAFUNK_THEME_URI . '/inc/img/yt_thumbnail_placeholder.png',
  'default_sc_thumbnail'    => ULTRAFUNK_THEME_URI . '/inc/img/sc_thumbnail_placeholder.png',
  'uf_logo_desktop'         => '/wp-content/uploads/branding/ultrafunk_logo_desktop_12.png',
  'uf_logo_mobile'          => '/wp-content/uploads/branding/ultrafunk_logo_mobile_12.png',
  'uf_pwa_manifest'         => IS_PROD_BUILD
                                 ? ULTRAFUNK_THEME_URI . '/inc/js/manifest_prod.json'
                                 : ULTRAFUNK_THEME_URI . '/inc/js/manifest_dev.json',
  'uf_pwa_startup_image'    => '/wp-content/uploads/branding/ultrafunk_pwa_icon_05-192x192.png',
];

// Automatically updated on 'npm run build-dev' or 'npm run build-prod'
const JS_PRELOAD_CHUNK = '/js/dist/chunk-UBDFGDL4.js';
