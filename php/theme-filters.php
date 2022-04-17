<?php declare(strict_types=1);
/*
 * Theme filters
 *
 */


namespace Ultrafunk\Theme\Filters;


use Ultrafunk\Plugin\Constants\PLAYER_TYPE;

use const Ultrafunk\Plugin\Constants\PLUGIN_ENV;
use const Ultrafunk\Theme\Constants\THEME_ENV;

use function Ultrafunk\Plugin\Shared\get_shuffle_transient_name;

use function Ultrafunk\Plugin\Globals\ {
  get_globals_prop,
  get_request_params,
  is_custom_query,
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
// Modify uf_track REST request to return random shuffle query data
//
function rest_uf_track_query($args, $request)
{
  if ($request->get_param('shuffle') === 'true')
  {
    $shuffle_path = 'all';
    $shuffle_type = $request->get_param('shuffle_type');
    $shuffle_slug = $request->get_param('shuffle_slug');
    $transient    = get_transient(get_shuffle_transient_name());

    if ($shuffle_slug !== null)
      $shuffle_path = $shuffle_type . '/' . $shuffle_slug;

    if (($transient !== false) && ($shuffle_path === $transient['shuffle_path']))
    {
      $args['orderby']  = 'post__in';
      $args['post__in'] = $transient['post_ids'];
    }
  }

  return $args;
}
add_filter('rest_uf_track_query', '\Ultrafunk\Theme\Filters\rest_uf_track_query', 10, 2);

//
// Set custom post type(s) as default
//
function pre_get_posts(object $query) : void
{
  if (!is_admin() && $query->is_main_query())
  {
    if ($query->is_home() || $query->is_date())
      $query->set('post_type', ['uf_track']);

    if ($query->is_search() || is_shuffle(PLAYER_TYPE::GALLERY))
      $query->set('posts_per_page', get_globals_prop('gallery_per_page'));
  }
}
add_action('pre_get_posts', '\Ultrafunk\Theme\Filters\pre_get_posts');

//
// Show custom post type(s) for archive pages
//
function getarchives_where(string $where) : string
{
  $where = str_replace("post_type = 'post'", "post_type IN ('uf_track')", $where);
  return $where;
}
add_filter('getarchives_where', '\Ultrafunk\Theme\Filters\getarchives_where');

//
// Enhance search results by replacing special chars in query string
// This should be done by default in WordPress?
//
function parse_query(object $query) : void
{
  $modify_query = $query->is_main_query() || is_custom_query();

  if (!is_admin() && $modify_query && $query->is_search())
  {
    // https://www.w3.org/wiki/Common_HTML_entities_used_for_typography
    $search  = ['&ndash;', '&mdash;', '&lsquo;', '&rsquo;', '&prime;', '&Prime;', '&ldquo;', '&rdquo;', '&quot;'];
    $replace = ['-'      , '-'      , "'"      , "'"      , "'"      , '"'      , '"'      , '"'      , '"'     ];

    $new_query_string = htmlentities($query->query['s']);
    $new_query_string = str_replace($search, $replace, $new_query_string);
    $new_query_string = html_entity_decode($new_query_string);

    //Search string "R&B" needs special handling to match "R&amp;B"
    $new_query_string = str_ireplace('r&b', 'r&amp;b', $new_query_string);

    if ($new_query_string !== $query->query['s'])
      $query->set('s', $new_query_string);
  }
}
add_action('parse_query', '\Ultrafunk\Theme\Filters\parse_query');

//
// Filter out all list-player search results that are not tracks (uf_track)
//
function posts_results(array $posts, object $query) : array
{
  $filter_results = (is_custom_query() || (\defined('REST_REQUEST') && REST_REQUEST));

  if (!is_admin() && $filter_results && $query->is_search())
    return array_filter($posts, function($entry) { return ($entry->post_type === 'uf_track'); });

  return $posts;
}
add_filter('posts_results', '\Ultrafunk\Theme\Filters\posts_results', 10, 2);


/**************************************************************************************************************************/

//
// Customize page titles
//
function document_title_parts(array $title) : array
{
  $params = get_request_params();

  if (is_shuffle(PLAYER_TYPE::GALLERY))
  {
    $title['title'] = esc_html('Shuffle: ' . get_title());
  }
  else if (is_termlist())
  {
    if ($params['max_pages'] > 1)
      $title['title'] = esc_html(get_title() . ' - Page ' . $params['current_page']);
    else
      $title['title'] = esc_html(get_title());
  }
  else if (is_list_player())
  {
    $title_parts = is_shuffle(PLAYER_TYPE::LIST)
                     ? ($params['title_parts']['prefix'] . ': ' . get_title())
                     : get_title();

    if ($params['current_page'] > 1)
      $title_parts .= ' - Page ' . $params['current_page'];

    $title['title'] = esc_html($title_parts);
  }
  
  return $title;
}
add_filter('document_title_parts', '\Ultrafunk\Theme\Filters\document_title_parts');

//
// Add uniqid and other custom options for SoundCloud and YouTube iframe embeds
//
function embed_oembed_html(string $cached_html) : string
{
  if (stripos($cached_html, 'youtube.com/') !== false)
  {
    $cached_html = str_ireplace('<iframe', sprintf('<iframe id="youtube-uid-%s"', uniqid()), $cached_html);
    $cached_html = str_ireplace('feature=oembed', sprintf('feature=oembed&enablejsapi=1&origin=%s', PLUGIN_ENV['site_url']), $cached_html);
  }
  else if (stripos($cached_html, 'soundcloud.com/') !== false)
  {
    $cached_html = str_ireplace('<iframe', sprintf('<iframe id="soundcloud-uid-%s" allow="autoplay"', uniqid()), $cached_html);
    $cached_html = str_ireplace('visual=true', 'visual=true&single_active=false', $cached_html);
  }
  
  return $cached_html;
}
add_filter('embed_oembed_html', '\Ultrafunk\Theme\Filters\embed_oembed_html', 10, 1);

//
// Add noindex meta tag to all 404 and shuffle pages
//
function wp_robots(array $robots) : array
{
  if (is_404() || is_shuffle(PLAYER_TYPE::GALLERY) || is_shuffle(PLAYER_TYPE::LIST))
    $robots['noindex'] = true;

  return $robots;
}
add_filter('wp_robots', '\Ultrafunk\Theme\Filters\wp_robots');

//
// Disable iframe lazy loading
//
function wp_lazy_loading_enabled(bool $default, string $tag_name, string $context) : bool
{
  if ('iframe' === $tag_name)
    return false;  

  return $default;
}
add_filter('wp_lazy_loading_enabled', '\Ultrafunk\Theme\Filters\wp_lazy_loading_enabled', 10, 3);


/**************************************************************************************************************************/


//
// Do needed magic to the nav menu items here from context
//
function wp_setup_nav_menu_item(object $menu_item) : object
{
  if (!is_admin())
  {
    $menu_item_all_id     = THEME_ENV['menu_item_all_id'];
    $menu_item_shuffle_id = THEME_ENV['menu_item_shuffle_id'];
  
    if (is_list_player())
    {
      $data = get_request_params()['data'];
  
      if ($menu_item->ID === $menu_item_all_id)
        $menu_item->url = '/list/';
      else
        $menu_item->url = str_replace('ultrafunk.com', 'ultrafunk.com/list', $menu_item->url);
  
      if (($menu_item->ID === $menu_item_all_id) && is_list_player('all'))
        $menu_item->classes[] = 'current-menu-item';
      else if (($menu_item->ID === $menu_item_shuffle_id) && is_shuffle(PLAYER_TYPE::LIST))
        $menu_item->classes[] = 'current-menu-item';
      else if (isset($data['wp_term']) && ($data['wp_term']->term_id === intval($menu_item->object_id)))
        $menu_item->classes[] = 'current-menu-item';
    }
    else
    {
      if (($menu_item->ID === $menu_item_all_id) && is_front_page() && !is_shuffle(PLAYER_TYPE::GALLERY))
        $menu_item->classes[] = 'current-menu-item';    
      else if (($menu_item->ID === $menu_item_shuffle_id) && is_shuffle(PLAYER_TYPE::GALLERY))
        $menu_item->classes[] = 'current-menu-item';
      else if (($menu_item->ID === THEME_ENV['menu_item_all_artists_id']) && (is_termlist()))
        $menu_item->classes[] = 'current-menu-item';
    }
  }

  return $menu_item;
}
add_filter('wp_setup_nav_menu_item', '\Ultrafunk\Theme\Filters\wp_setup_nav_menu_item');

//
// Set data-attribute for shuffle menu item
//
function nav_menu_link_attributes(array $attributes, object $menu_item) : array
{
  if (!is_admin())
  {
    if ($menu_item->ID === THEME_ENV['menu_item_shuffle_id'])
    {
      $attributes['href']  = '#';
      $attributes['title'] = esc_attr(get_shuffle_title());
    }
  }
  
  return $attributes;
}
add_filter('nav_menu_link_attributes', '\Ultrafunk\Theme\Filters\nav_menu_link_attributes', 10, 2);
