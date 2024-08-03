<?php declare(strict_types=1);
/*
 * Theme functions
 *
 */


namespace Ultrafunk\Theme\Functions;


use Ultrafunk\Plugin\Shared\ {
  PLAYER_TYPE,
  TRACK_TYPE,
};

use const Ultrafunk\Plugin\Shared\YOUTUBE_VIDEO_ID_REGEX;

use function Ultrafunk\Plugin\Globals\ {
  is_shuffle,
  is_termlist,
  is_list_player,
  get_request_params,
  get_cached_title,
  set_cached_title,
};


/**************************************************************************************************************************/


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
    $title = isset($params->slug_name) ? $params->slug_name : 'All Tracks';
  }
  else if (is_termlist())
  {
    $title = is_termlist('artists')
               ? ('Artists: ' . strtoupper($params->query_vars['first_letter']))
               : 'All Channels';
  }
  else if (is_list_player())
  {
    if (is_list_player('search'))
      $title = 'Search Results for "' . $params->title_parts['title'] . '"';
    else
      $title = $params->title_parts['title'];
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
function get_filter_result_by(?object $request_params) : string
{
  $filter_slug = isset($_GET['channel']) ? $_GET['channel'] : null;
  $filter_tax  = 'uf_channel';

  if (isset($request_params->query_filter))
    $filter_slug = $request_params->query_filter['slug'];
  else if ($filter_slug !== null)
    $filter_slug = sanitize_title($filter_slug);

  if ($filter_slug !== null)
  {
    $wp_term = get_term_by('slug', $filter_slug, $filter_tax);

    if ($wp_term !== false)
      return ' [ ' . esc_html($wp_term->name) . ' ] ';
  }

  return '';
}

//
// Get shuffle title from current context
//
function get_shuffle_title(string $prefix = 'Shuffle: ') : string
{
  if (is_list_player() && !is_list_player('date') && !is_list_player('search'))
    return ($prefix . get_request_params()->title_parts['title']);

  $title = '';

  if (is_shuffle(PLAYER_TYPE::GALLERY))
    $title = $prefix . get_title();
  else
    $title = single_term_title($prefix, false);

  return (!empty($title) ? $title : ($prefix . 'All Tracks'));
}

//
// Get track details / data for content-template use
//
const DEFAULT_TRACK_DATA = [
  'track_type'   => TRACK_TYPE::NONE,
  'thumnail_src' => \Ultrafunk\Theme\Config\THEME_ENV['default_track_thumbnail'],
  'css_class'    => 'track-type-default',
  'source_uid'   => null,
];

function get_track_data(object $track) : array
{
  $track_type = intval($track->track_source_type);

  if ($track_type === TRACK_TYPE::YOUTUBE)
  {
    if (1 === preg_match(YOUTUBE_VIDEO_ID_REGEX, $track->track_source_data, $source_uid))
    {
      return [
        'track_type'   => TRACK_TYPE::YOUTUBE,
        'thumnail_src' => "https://i.ytimg.com/vi/$source_uid[0]/default.jpg",
        'css_class'    => 'track-type-youtube',
        'source_uid'   => $source_uid[0],
      ];
    }
  }
  else if ($track_type === TRACK_TYPE::SOUNDCLOUD)
  {
    return [
      'track_type'   => TRACK_TYPE::SOUNDCLOUD,
      'thumnail_src' => \Ultrafunk\Theme\Config\THEME_ENV['default_sc_thumbnail'],
      'css_class'    => 'track-type-soundcloud',
      'source_uid'   => $track->track_source_data,
    ];
  }

  return DEFAULT_TRACK_DATA;
}

//
// Conditional for Gallery Player home page
//
function is_gallery_home() : bool
{
  return (is_front_page() && !is_paged() && !is_shuffle(PLAYER_TYPE::GALLERY));
}

//
// Conditional for List Player home page
//
function is_list_home() : bool
{
  return (is_list_player('all') && (get_request_params()->current_page === 1));
}

//
// Get term data from object cache, revert to database fetch if previewing...
//
function get_cached_terms(int $id, string $taxonomy) : mixed
{
  return (is_preview() ? wp_get_post_terms($id, $taxonomy) : get_object_term_cache($id, $taxonomy));
}

//
// Map custom routed query result field to matching $wp_query result field
//
function get_query_field(string $field_id) : mixed
{
  if (is_list_player())
  {
    switch ($field_id)
    {
      case 'query_result': return get_request_params()->query_result;
      case 'found_items':  return get_request_params()->found_items;
      case 'term_id':      return get_request_params()->query_vars['term_id'];
    }
  }
  else
  {
    global $wp_query;

    if (isset($wp_query) && $wp_query->have_posts())
    {
      switch ($field_id)
      {
        case 'query_result': return $wp_query->posts;
        case 'found_items' : return $wp_query->found_posts;
        case 'term_id'     : return get_queried_object()->term_id;
      }
    }
  }

  return null;
}
