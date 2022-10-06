<?php declare(strict_types=1);
/*
 * Theme functions
 *
 */


namespace Ultrafunk\Theme\Functions;


use SimpleXMLElement;

use Ultrafunk\Plugin\Constants\ {
  PLAYER_TYPE,
  TRACK_TYPE,
};

use const Ultrafunk\Plugin\Constants\ {
  PLUGIN_ENV,
  YOUTUBE_VIDEO_ID_REGEX,
};

use function Ultrafunk\Plugin\Globals\ {
  is_shuffle,
  is_termlist,
  is_list_player,
  get_request_params,
  get_cached_title,
  set_cached_title,
  get_globals_prop,
  get_settings_value,
};


/**************************************************************************************************************************/


//
// Set request session variables for client side use (JavaScript)
//
function set_request_session_vars(array $session_vars) : array
{
  $params = \Ultrafunk\Plugin\Globals\get_request_params();
  $data   = $params['data'];
  $query  = $params['query'];
  $path   = isset($params['route_path']) ? $params['route_path'] : '';

  $session_vars['params']      = $params['get'];
  $session_vars['currentPage'] = $params['current_page'];
  $session_vars['maxPages']    = $params['max_pages'];

  if (isset($params['max_pages']) && ($params['max_pages'] > 1))
  {
    if ($params['current_page'] === 1)
    {
      $session_vars['nextPage'] = '/' . $path . '/page/' . ($params['current_page'] + 1) . '/';
    }
    else if ($params['current_page'] < $params['max_pages'])
    {
      $session_vars['prevPage'] = '/' . $path . '/page/' . ($params['current_page'] - 1) . '/';
      $session_vars['nextPage'] = '/' . $path . '/page/' . ($params['current_page'] + 1) . '/';
    }
    else
    {
      $session_vars['prevPage'] = '/' . $path . '/page/' . ($params['current_page'] - 1) . '/';
    }

    if ($params['current_page'] === 2)
      $session_vars['prevPage'] = '/' . $path . '/';
  }
  else if (isset($data['first_letter']))
  {
    $letters = $data['letters_range'];
    $index   = array_search($data['first_letter'], $letters);

    if ($index === 0)
    {
      $session_vars['nextPage'] = '/' . $path . '/b/';
    }
    else if (($index + 1) < count($letters))
    {
      $session_vars['prevPage'] = '/' . $path . '/' . $letters[$index - 1] . '/';
      $session_vars['nextPage'] = '/' . $path . '/' . $letters[$index + 1] . '/';
    }
    else
    {
      $session_vars['prevPage'] = '/' . $path . '/' . $letters[$index - 1] . '/';
    }
  }

  // Prepend full site url for better client side validation + append parameters if present
  if ($session_vars['prevPage'] !== null)
  {
    $session_vars['prevPage']  = PLUGIN_ENV['site_url'] . $session_vars['prevPage'];
    $session_vars['prevPage'] .= ($query['string'] !== null) ? "?{$query['string']}" : '';
  }

  if ($session_vars['nextPage'] !== null)
  {
    $session_vars['nextPage']  = PLUGIN_ENV['site_url'] . $session_vars['nextPage'];
    $session_vars['nextPage'] .= ($query['string'] !== null) ? "?{$query['string']}" : '';
  }

  return $session_vars;
}

//
// Get prev + next post/posts URLs + other navigation variables
//
function get_session_vars() : array
{
  $is_user_per_page = (is_shuffle(PLAYER_TYPE::GALLERY) || is_shuffle(PLAYER_TYPE::LIST) || is_search() || is_list_player('search'));

  $session_vars = [
    'prevPage'       => null,
    'nextPage'       => null,
    'shufflePath'    => esc_url(PLUGIN_ENV['site_url'] . get_shuffle_path()),
    'listPerPage'    => $is_user_per_page ? get_globals_prop('list_per_page')    : get_settings_value('list_tracks_per_page'),
    'galleryPerPage' => $is_user_per_page ? get_globals_prop('gallery_per_page') : get_settings_value('gallery_tracks_per_page'),
  ];

  // Return defaults because get_next_posts_link() returns results even when a 404 happens
  if (is_404())
    return $session_vars;

  if (is_termlist() || is_list_player())
    return set_request_session_vars($session_vars);

  if (is_single())
  {
    // Reverse order for: prev = left direction and next = right direction (orderby: from New to Old)
    $prevPost = get_next_post();
    $nextPost = get_previous_post();

    if (!empty($prevPost))
      $prevUrl = get_the_permalink($prevPost->ID);

    if (!empty($nextPost))
      $nextUrl = get_the_permalink($nextPost->ID);

    $session_vars['prevPage'] = isset($prevUrl) ? $prevUrl : null;
    $session_vars['nextPage'] = isset($nextUrl) ? $nextUrl : null;
  }
  else
  {
    $prevLink = get_previous_posts_link('');
    $nextLink = get_next_posts_link('');

    if ($prevLink !== null)
      $prevUrl = new SimpleXMLElement($prevLink);

    if ($nextLink !== null)
      $nextUrl = new SimpleXMLElement($nextLink);

    $session_vars['prevPage'] = isset($prevUrl) ? ((string) $prevUrl['href']) : null;
    $session_vars['nextPage'] = isset($nextUrl) ? ((string) $nextUrl['href']) : null;
  }

  return $session_vars;
}

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

  $title .= get_filter_result_by($params);

  set_cached_title($title);

  return $title;
}

//
// Get title string for results filtering
//
function get_filter_result_by(array $params) : string
{
  $filter_slug = isset($_GET['channel']) ? $_GET['channel'] : null;
  $filter_tax  = 'uf_channel';

  if (isset($params['filter']))
    $filter_slug = $params['filter']['slug'];
  else if ($filter_slug !== null)
    $filter_slug = sanitize_title($filter_slug);

  if ($filter_slug !== null)
  {
    $term = get_term_by('slug', $filter_slug, $filter_tax);

    if ($term !== false)
      return ' [ ' . esc_html($term->name) . ' ] ';
  }

  return '';
}

//
// Get shuffle URL from current context
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
// Get shuffle title from current context
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
// Get track details / data for content-template use
//
const DEFAULT_TRACK_DATA = [
  'track_type'   => TRACK_TYPE::SOUNDCLOUD,
  'thumnail_src' => '/wp-content/themes/ultrafunk/inc/img/sc_thumbnail_placeholder.png',
  'css_class'    => 'type-soundcloud',
  'source_uid'   => null,
];

function get_track_data(object $track) : array
{
  if (intval($track->track_source_type) === TRACK_TYPE::YOUTUBE)
  {
    if (1 === preg_match(YOUTUBE_VIDEO_ID_REGEX, $track->track_source_data, $source_uid))
    {
      return [
        'track_type'   => TRACK_TYPE::YOUTUBE,
        'thumnail_src' => "https://img.youtube.com/vi/$source_uid[0]/default.jpg",
        'css_class'    => 'type-youtube',
        'source_uid'   => $source_uid[0],
      ];
    }
  }

  return DEFAULT_TRACK_DATA;
}
