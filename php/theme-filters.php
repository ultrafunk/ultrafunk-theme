<?php declare(strict_types=1);
/*
 * Theme filters
 *
 */


namespace Ultrafunk\Theme\Filters;


/**************************************************************************************************************************/
if (!defined('ABSPATH')) exit;
/**************************************************************************************************************************/


use Ultrafunk\Plugin\Shared\Constants\PLAYER_TYPE;

use const Ultrafunk\Theme\Config\THEME_ENV;

use function Ultrafunk\Plugin\Globals\ {
  get_request_params,
  is_list_player,
  is_shuffle,
  is_termlist,
};

use function Ultrafunk\Theme\Functions\ {
  get_shuffle_title,
  get_title,
};


/**************************************************************************************************************************/


//
// Customize page titles
//
function document_title_parts(array $title) : array
{
  $params = get_request_params();

  if (is_shuffle(PLAYER_TYPE::GALLERY))
  {
    $title['title']   = esc_html('Shuffle: ' . get_title());
    $title['tagline'] = esc_html(get_option('blogname'));
  }
  else if (is_termlist())
  {
    if ($params->max_pages > 1)
      $title['title'] = esc_html(get_title() . ' - Page ' . $params->current_page);
    else
      $title['title'] = esc_html(get_title());
  }
  else if (is_list_player())
  {
    $title_parts = is_shuffle(PLAYER_TYPE::LIST)
                     ? ($params->title_parts['prefix'] . ': ' . get_title())
                     : get_title();

    if ($params->current_page > 1)
      $title_parts .= ' - Page ' . $params->current_page;

    $title['title'] = esc_html($title_parts);
  }
  else if (is_home())
  {
    $title['title']   = 'All Tracks';
    $title['tagline'] = esc_html(get_option('blogname'));
  }

  return $title;
}
add_filter('document_title_parts', '\Ultrafunk\Theme\Filters\document_title_parts');

//
// Do needed magic to the nav menu items here from context
//
function wp_setup_nav_menu_item(object $menu_item) : object
{
  if (!is_admin())
  {
    $menu_item_all_tracks_id = THEME_ENV['menu_item_all_tracks_id'];
    $menu_item_shuffle_id    = THEME_ENV['menu_item_shuffle_id'];

    if (is_list_player())
    {
      $query_vars = get_request_params()->query_vars;

      if ($menu_item->ID === $menu_item_all_tracks_id)
        $menu_item->url = '/list/';
      else
        $menu_item->url = str_replace('ultrafunk.com', 'ultrafunk.com/list', $menu_item->url);

      if (($menu_item->ID === $menu_item_all_tracks_id) && is_list_player('all'))
        $menu_item->classes[] = 'current-menu-item';
      else if (($menu_item->ID === $menu_item_shuffle_id) && is_shuffle(PLAYER_TYPE::LIST))
        $menu_item->classes[] = 'current-menu-item';
      else if (isset($query_vars['term_id']) && ($query_vars['term_id'] === intval($menu_item->object_id)))
        $menu_item->classes[] = 'current-menu-item';
    }
    else
    {
      if (($menu_item->ID === $menu_item_all_tracks_id) && is_front_page() && !is_shuffle(PLAYER_TYPE::GALLERY))
        $menu_item->classes[] = 'current-menu-item';
      else if (($menu_item->ID === $menu_item_shuffle_id) && is_shuffle(PLAYER_TYPE::GALLERY))
        $menu_item->classes[] = 'current-menu-item';
      else if (($menu_item->ID === THEME_ENV['menu_item_artists_id']) && (is_termlist('artists')))
        $menu_item->classes[] = 'current-menu-item';
      else if (($menu_item->ID === THEME_ENV['menu_item_channels_id']) && (is_termlist('channels')))
        $menu_item->classes[] = 'current-menu-item';
    }
  }

  return $menu_item;
}
add_filter('wp_setup_nav_menu_item', '\Ultrafunk\Theme\Filters\wp_setup_nav_menu_item');

//
// Set props for shuffle menu item
//
function nav_menu_link_attributes(array $attributes, object $menu_item) : array
{
  if (!is_admin())
  {
    if ($menu_item->ID === THEME_ENV['menu_item_shuffle_id'])
    {
      $attributes['href'] = '#';

      if (is_shuffle())
      {
        $attributes['title'] = esc_attr(get_shuffle_title('Reshuffle: '));
        $menu_item->title    = 'Reshuffle: <span class="normal-text">' . esc_html(get_shuffle_title('')) . '</span>';
      }
      else
      {
        $attributes['title'] = esc_attr(get_shuffle_title());
        $menu_item->title    = 'Shuffle: <span class="normal-text">' . esc_html(get_shuffle_title('')) . '</span>';
      }
    }
  }

  return $attributes;
}
add_filter('nav_menu_link_attributes', '\Ultrafunk\Theme\Filters\nav_menu_link_attributes', 10, 2);
