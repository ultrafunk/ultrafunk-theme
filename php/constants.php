<?php declare(strict_types=1);
/*
 * Ultrafunk theme constants
 *
 */


namespace Ultrafunk\Theme\Constants;


/**************************************************************************************************************************/


const VERSION = '1.44.45';

const THEME_ENV = [
  'menu_item_all_tracks_id' => WP_DEBUG ? 4057 : 4430,
  'menu_item_artists_id'    => WP_DEBUG ? 4058 : 4431,
  'menu_item_channels_id'   => WP_DEBUG ? 4059 : 4432,
  'menu_item_shuffle_id'    => WP_DEBUG ? 4060 : 4433,
  'block_gallery_intro_id'  => WP_DEBUG ?  808 :  808,
  'block_list_intro_id'     => WP_DEBUG ? 3887 : 3889,
  'block_premium_intro_id'  => WP_DEBUG ? 1500 : 1500,
  'block_promo_intro_id'    => WP_DEBUG ? 2717 : 2717,
  'page_about_id'           => WP_DEBUG ?  806 :  806,
  'uploads_branding'        => WP_DEBUG ? '/wp-content/uploads/branding/' : '/wp-content/uploads/branding/',
];
