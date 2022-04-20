<?php declare(strict_types=1);
/*
 * Ultrafunk theme constants
 *
 */


namespace Ultrafunk\Theme\Constants;


/**************************************************************************************************************************/


const VERSION = '1.42.2';

const THEME_ENV = [
  'menu_item_all_id'         => WP_DEBUG ?  115 :  115,
  'menu_item_shuffle_id'     => WP_DEBUG ? 2251 : 2251,
  'menu_item_all_artists_id' => WP_DEBUG ? 3927 : 3908,
  'block_gallery_intro_id'   => WP_DEBUG ?  808 :  808,
  'block_list_intro_id'      => WP_DEBUG ? 3887 : 3889,
  'block_premium_intro_id'   => WP_DEBUG ? 1500 : 1500,
  'block_promo_intro_id'     => WP_DEBUG ? 2717 : 2717,
  'page_about_id'            => WP_DEBUG ?  806 :  806,
  'uploads_branding'         => WP_DEBUG ? '/wp-content/uploads/branding/' : '/wp-content/uploads/branding/',
];
