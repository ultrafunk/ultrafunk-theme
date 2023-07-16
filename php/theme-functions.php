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
               ? ('Artists: ' . strtoupper($params->query['first_letter']))
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

  if (isset($request_params->filter))
    $filter_slug = $request_params->filter['slug'];
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
  'track_type'   => TRACK_TYPE::SOUNDCLOUD,
  'thumnail_src' => \Ultrafunk\Theme\Config\THEME_ENV['default_sc_thumbnail'],
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
