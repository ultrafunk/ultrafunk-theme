<?php declare(strict_types=1);
/*
 * Functions which enhance the theme by hooking into WordPress
 *
 */


namespace Ultrafunk\Theme\Functions;


use SimpleXMLElement;
use Ultrafunk\Plugin\Constants\PLAYER_TYPE;

use const Ultrafunk\Plugin\Constants\PLUGIN_ENV;
use const Ultrafunk\Theme\Constants\THEME_ENV;

use function Ultrafunk\Plugin\Shared\ {
//console_log,
  get_shuffle_transient_name,
};

use function Ultrafunk\Plugin\Globals\ {
  is_custom_query,
  is_shuffle,
  is_termlist,
  is_list_player,
  get_request_params,
  get_cached_title,
  set_cached_title,
  get_globals_prop,
};


/**************************************************************************************************************************/


//
// Get prev + next post/posts URLs + other navigation variables
//
function get_session_vars() : array
{
  $params = get_request_params();
  $session_vars = [
    'prevPage' => null,
    'nextPage' => null,
    'shufflePath' => esc_url(PLUGIN_ENV['site_url'] . get_shuffle_path()),
    'listPerPage' => isset($params['items_per_page'])
                       ? $params['items_per_page']
                       : PLUGIN_ENV['list_per_page'],
    'galleryPerPage' => (is_shuffle(PLAYER_TYPE::GALLERY) || is_shuffle(PLAYER_TYPE::LIST))
                          ? get_globals_prop('gallery_per_page')
                          : \intval(get_option('posts_per_page', PLUGIN_ENV['gallery_per_page'])),
  ];

  // Return defaults because get_next_posts_link() returns results even when a 404 happens
  if (is_404())
    return $session_vars;

  if (is_termlist() || is_list_player())
    return \Ultrafunk\Plugin\Shared\set_list_session_vars($session_vars);

  if (is_single())
  {
    $prevPost = get_previous_post();
    $nextPost = get_next_post();
    
    if (!empty($prevPost))
      $prevUrl = get_the_permalink($prevPost->ID);

    if (!empty($nextPost))
      $nextUrl = get_the_permalink($nextPost->ID);
    
    $session_vars['prevPage'] = isset($prevUrl) ? esc_url($prevUrl) : null;
    $session_vars['nextPage'] = isset($nextUrl) ? esc_url($nextUrl) : null;
  }
  else
  {
    $prevLink = get_previous_posts_link('');
    $nextLink = get_next_posts_link('');
    
    if ($prevLink !== null)
      $prevUrl = new SimpleXMLElement($prevLink);
    
    if ($nextLink !== null)
      $nextUrl = new SimpleXMLElement($nextLink);
    
    $session_vars['prevPage'] = isset($prevUrl) ? ((string) esc_url($prevUrl['href'])) : null;
    $session_vars['nextPage'] = isset($nextUrl) ? ((string) esc_url($nextUrl['href'])) : null;
  }

  return $session_vars;
}

//
// Modify posts REST request to return random shuffle query data
//
function modify_rest_uf_track_query($args, $request)
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
add_filter('rest_uf_track_query', '\Ultrafunk\Theme\Functions\modify_rest_uf_track_query', 10, 2);

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
add_action('pre_get_posts', '\Ultrafunk\Theme\Functions\pre_get_posts');

//
// Show custom post type(s) for archive pages
//
function custom_getarchives_where(string $where) : string
{
  $where = str_replace("post_type = 'post'", "post_type IN ('uf_track')", $where);
  return $where;
}
add_filter('getarchives_where', '\Ultrafunk\Theme\Functions\custom_getarchives_where');

//
// Enhance search results by replacing special chars in query string
// This should be done by default in WordPress?
//
function modify_search_query(object $query) : void
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
add_action('parse_query', '\Ultrafunk\Theme\Functions\modify_search_query');

//
// Filter out all list-player search results that are not tracks (uf_track)
//
function filter_posts_results(array $posts, object $query) : array
{
  $filter_results = (is_custom_query() || (\defined('REST_REQUEST') && REST_REQUEST));

  if (!is_admin() && $filter_results && $query->is_search())
    return array_filter($posts, function($entry) { return ($entry->post_type === 'uf_track'); });

  return $posts;
}
add_filter('posts_results', '\Ultrafunk\Theme\Functions\filter_posts_results', 10, 2);

//
// Get current title from context
//
function get_title() : string
{
  $title = get_cached_title();

  // This functions gets called many times per request, check if we have cached result first
  if ($title !== null)
    return $title;

  $params = get_request_params();

  if (is_shuffle(PLAYER_TYPE::GALLERY))
  {
    $title = isset($params['slug_name']) ? $params['slug_name'] : 'All Tracks';
  }
  else if (is_termlist())
  {
    $title = is_termlist('artists')
               ? ('Artists: ' . strtoupper($params['data']['first_letter']))
               : 'All Channels';
  }
  else if (is_list_player())
  {
    if (is_list_player('search'))
      $title = 'Search Results for "' . $params['title_parts']['title'] . '"';
    else
      $title = $params['title_parts']['title'];
  }
  else if (is_tax())
  {
    $title = single_term_title('', false);
  }
  else if (is_date())
  {
    $title = get_the_date('F Y');
  }
  else
  {
    $title = 'All Tracks';
  }

  set_cached_title($title);
  
  return $title;
}

//
// Customize page titles
//
function customize_title(array $title) : array
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
add_filter('document_title_parts', '\Ultrafunk\Theme\Functions\customize_title');

//
// Add uniqid and other custom options for SoundCloud and YouTube iframe embeds
//
function embed_iframe_setparams(string $cached_html) : string
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
add_filter('embed_oembed_html', '\Ultrafunk\Theme\Functions\embed_iframe_setparams', 10, 1);

//
// Add noindex meta tag to all 404 and shuffle pages
//
function wp_robots_noindex(array $robots) : array
{
  if (is_404() || is_shuffle(PLAYER_TYPE::GALLERY) || is_shuffle(PLAYER_TYPE::LIST))
    $robots['noindex'] = true;

  return $robots;
}
add_filter('wp_robots', '\Ultrafunk\Theme\Functions\wp_robots_noindex');

//
// Disable iframe lazy loading
//
function disable_iframe_lazy_loading(bool $default, string $tag_name, string $context) : bool
{
  if ('iframe' === $tag_name)
    return false;  

  return $default;
}
add_filter('wp_lazy_loading_enabled', '\Ultrafunk\Theme\Functions\disable_iframe_lazy_loading', 10, 3);

//
// Get shuffle menu item URL from current context
//
function get_shuffle_path() : string
{
  $params = get_request_params();

  if (is_list_player())
  {
    $request_path = '/list/shuffle/all/';

    if (is_shuffle(PLAYER_TYPE::LIST))
      $request_path = '/' . $params['route_path'] . '/';
    else if (is_list_player('channel') || is_list_player('artist'))
      $request_path = '/' . str_ireplace('list/', 'list/shuffle/', $params['route_path']) . '/';
    
    return $request_path;
  }

  $request_path = '/shuffle/all/';

  if (is_shuffle(PLAYER_TYPE::GALLERY))
  {
    $request_path = '/shuffle/' . $params['path'] . '/';
  }
  else
  {
    $queried_object = get_queried_object();

    if (isset($queried_object) && isset($queried_object->taxonomy) && isset($queried_object->slug))
    {
      if ($queried_object->taxonomy === 'uf_channel')
        $request_path = '/shuffle/channel/' . $queried_object->slug . '/';
      else if ($queried_object->taxonomy === 'uf_artist')
        $request_path = '/shuffle/artist/' . $queried_object->slug . '/';
    }
  }

  return $request_path;
}

//
// Get shuffle menu item title from current context
//
function get_shuffle_title() : string
{
  if (is_list_player() && !is_list_player('date') && !is_list_player('search'))
    return ('Shuffle: ' . get_request_params()['title_parts']['title']);

  $title = '';

  if (is_shuffle(PLAYER_TYPE::GALLERY))
    $title = 'Shuffle: ' . get_title();
  else
    $title = single_term_title('Shuffle: ', false);

  return (!empty($title) ? $title : 'Shuffle: All Tracks');
}

//
// Do needed magic to the nav menu items here from context
//
function setup_nav_menu_item(object $menu_item) : object
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
      else if (isset($data['wp_term']) && ($data['wp_term']->term_id === \intval($menu_item->object_id)))
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
add_filter('wp_setup_nav_menu_item', '\Ultrafunk\Theme\Functions\setup_nav_menu_item');

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
add_filter('nav_menu_link_attributes', '\Ultrafunk\Theme\Functions\nav_menu_link_attributes', 10, 2);
