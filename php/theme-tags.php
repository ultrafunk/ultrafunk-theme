<?php declare(strict_types=1);
/*
 * Custom tags for this theme
 *
 */


namespace Ultrafunk\Theme\Tags;


use WP_Term;

use Ultrafunk\Plugin\Shared\Constants\PLAYER_TYPE;

use const Ultrafunk\Theme\Config\ {
  IS_PROD_BUILD,
  THEME_ENV,
  JS_PRELOAD_CHUNK,
};

use function Ultrafunk\Plugin\Globals\ {
  is_response,
  is_termlist,
  is_list_player,
  is_shuffle,
  get_perf_data,
  get_request_params,
  get_session_vars,
  get_cached_home_url,
};

use function Ultrafunk\Theme\Functions\ {
  get_cached_terms,
  get_title,
  get_shuffle_title,
  is_gallery_home,
  is_list_home,
  get_query_field,
};


/**************************************************************************************************************************/


function user_layout_class() : void
{
  if (is_home() || is_tax() || is_date())
  {
    global $wp_query;

    if (isset($wp_query))
    {
      if ($wp_query->post_count > 3)
        echo 'gallery-layout';
      else
        echo 'gallery-1-col';
    }
  }
}

function pre_wp_head() : void
{
  if (IS_PROD_BUILD)
  {
    // esbuild site-theme-layout.js --minify --bundle --format=esm
    ?>
    <script>var l=document.documentElement.classList,e=localStorage.getItem("uf_site_theme"),t="site-theme-light";e!==null&&(e==="light"?t="site-theme-light":e==="dark"?t="site-theme-dark":e==="black"&&(t="site-theme-black"));l.add(t);if(l.contains("gallery-layout")){let a=localStorage.getItem("uf_gallery_layout"),i="gallery-3-col";a!==null&&(a==="1-column"?i="gallery-1-col":a==="2-column"&&(i="gallery-2-col")),window.innerWidth>1100?l.add(i):l.add("gallery-1-col")}</script>
    <?php
  }
  else
  {
    ?>
    <script src="<?php echo ULTRAFUNK_THEME_URI . '/inc/js/site-theme-layout.js?ver=' . \Ultrafunk\Theme\Config\VERSION; ?>"></script>
    <?php
  }

  ?>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <?php

  if (!empty(JS_PRELOAD_CHUNK) && IS_PROD_BUILD)
    echo '<link rel="modulepreload" href="' . ULTRAFUNK_THEME_URI . JS_PRELOAD_CHUNK . '" as="script" crossorigin />' . PHP_EOL;
}

function channel_meta_description() : void
{
  $wp_term = get_term(get_query_field('term_id'));

  if ($wp_term instanceof WP_Term)
  {
    if ($wp_term->slug === 'videos')
      echo '<meta name="description" content="Watch ' . esc_html($wp_term->count) . ' selected Videos from a wide range of artists playing Funk, Soul, Jazz, Disco, Hip-Hop and more." />' . PHP_EOL;
    else if (($wp_term->slug === 'albums') || ($wp_term->slug === 'concerts') || ($wp_term->slug === 'promos'))
      echo '<meta name="description" content="Listen to ' . esc_html($wp_term->count) . ' selected ' . esc_html(get_title()) . ' from a wide range of artists playing Funk, Soul, Jazz, Disco, Hip-Hop and more." />' . PHP_EOL;
    else
      echo '<meta name="description" content="Listen to ' . esc_html($wp_term->count) . ' selected ' . esc_html(get_title()) . ' tracks from a wide range of artists playing Funk, Soul, Jazz, Disco, Hip-Hop and more." />' . PHP_EOL;
  }
}

function artist_meta_description() : void
{
  if (get_query_field('found_items') === 1)
  {
    track_meta_description();
  }
  else
  {
    $wp_term = get_term(get_query_field('term_id'));

    if ($wp_term instanceof WP_Term)
      echo '<meta name="description" content="Listen to ' . esc_html($wp_term->count) . ' carefully selected tracks from ' . esc_html(get_title()) . '." />' . PHP_EOL;
  }
}

function track_meta_description() : void
{
  $track          = get_query_field('query_result')[0];
  $track_artists  = get_cached_terms($track->ID, 'uf_artist');
  $track_channels = get_cached_terms($track->ID, 'uf_channel');
  $artists        = '';
  $channels       = '';

  foreach($track_artists as $artist)
    $artists .= $artist->name . ', ';

  foreach($track_channels as $channel)
    $channels .= $channel->name . ', ';

  echo '<meta name="description" content="Listen to &quot;' . esc_attr($track->track_title) . '&quot;, Artists: ' . esc_attr(substr($artists, 0, -2)) . ', Genres: ' . esc_attr(substr($channels, 0, -2)) . '." />' . PHP_EOL;
}

function scripts_styles() : void
{
  \Ultrafunk\Plugin\Globals\set_session_vars(\Ultrafunk\Plugin\Request\get_session_vars());

  ?>
  <script><?php echo 'const UF_ResponseData = ' . json_encode(\Ultrafunk\Plugin\Globals\get_session_vars()); ?></script>
  <script type="module" src="<?php echo ULTRAFUNK_THEME_URI . THEME_ENV['js_path'] . 'playback/interaction.js?ver=' . \Ultrafunk\Theme\Config\VERSION; ?>"></script>
  <script type="module" src="<?php echo ULTRAFUNK_THEME_URI . THEME_ENV['js_path'] . 'index.js?ver='                . \Ultrafunk\Theme\Config\VERSION; ?>"></script>
  <noscript><link rel="stylesheet" href="<?php echo ULTRAFUNK_THEME_URI . '/inc/css/style-noscript.css?ver='        . \Ultrafunk\Theme\Config\VERSION; ?>" media="all" /></noscript>
  <?php

  if (!is_page() && !is_termlist())
    echo '<script src="https://w.soundcloud.com/player/api.js"></script>' . PHP_EOL;
}

function head() : void
{
  ?>
  <link rel="manifest" href="<?php echo THEME_ENV['uf_pwa_manifest']; ?>" />
  <meta name="theme-color" content="#142850" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <link rel="apple-touch-startup-image" href="<?php echo THEME_ENV['uf_pwa_startup_image']; ?>" />
  <meta name="apple-mobile-web-app-title" content="Ultrafunk" />
  <meta name="application-name" content="Ultrafunk" />
  <?php

  if (is_shuffle() === false)
  {
    if (is_gallery_home() || is_list_home() || (get_the_ID() === THEME_ENV['page_about_id']))
      echo '<meta name="description" content="Ultrafunk is an interactive playlist with carefully chosen and continually updated tracks rooted in Funk and related genres." />' . PHP_EOL;
    else if (is_list_player('all') || is_home())
      echo '<meta name="description" content="Listen to ' . esc_html(get_query_field('found_items')) . ' carefully selected tracks from a wide range of artists playing Funk, Soul, Jazz, Disco, Hip-Hop and more." />' . PHP_EOL;
    else if (is_list_player('channel') || is_tax('uf_channel'))
      channel_meta_description();
    else if (is_list_player('artist') || is_tax('uf_artist'))
      artist_meta_description();
    else if (is_single())
      track_meta_description();
  }

  scripts_styles();

  if (IS_PROD_BUILD)
  {
    ?>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-G5MQXWVC0S"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-G5MQXWVC0S');
    </script>
    <?php
  }
}

function body_attributes() : void
{
  global $wp_query;
  $gallery_track_count = 0;
  $classes = [];

  // 404 never has any posts / tracks
  if (isset($wp_query) && $wp_query->have_posts() && !is_404())
  {
    foreach($wp_query->posts as $post)
    {
      if ($post->post_type === 'uf_track')
        $gallery_track_count++;
    }
  }

  if (is_gallery_home() || is_list_home())
    $classes[] = 'home';

  if (($gallery_track_count === 0) && !is_list_player())
    $classes[] = 'no-playback';
  else if ($gallery_track_count === 1)
    $classes[] = 'gallery-player track';
  else if ($gallery_track_count > 1)
    $classes[] = 'gallery-player tracks';

  if (is_page())
    $classes[] = 'page page-' . $wp_query->query_vars['pagename'];
  else if (is_single())
    $classes[] = 'single';
  else if (is_date())
    $classes[] = 'date';
  else if (is_search())
    $classes[] = 'search' . (($wp_query->have_posts() === false) ? ' no-matches' : '');
  else if (is_termlist())
    $classes[] = 'termlist';
  else if (is_list_player())
    $classes[] = 'list-player' . (is_list_player('search') ? ' search' : '');
  else if (is_tax('uf_artist'))
    $classes[] = 'artist';
  else if (is_tax('uf_channel'))
    $classes[] = 'channel-' . get_queried_object()->slug;
  else if (is_404())
    $classes[] = '404';

  echo 'class="' . implode(' ', $classes) . '"';

  if (is_list_player())
    echo ' data-player-type="list"';

  if ($gallery_track_count > 0)
    echo " data-player-type=\"gallery\" data-gallery-track-count=\"$gallery_track_count\"";
}

function get_search_string() : string
{
  return isset($_GET['s']) ? esc_attr(wp_unslash($_GET['s'])) : '';
}

function search_form() : void
{
  $is_list_player_search = (is_list_player() || is_response('list_player', 'search'));

  ?>
  <form role="search" method="get" class="search-form" action="<?php echo get_cached_home_url($is_list_player_search ? '/list/search/' : '/'); ?>">
    <label>
      <input type="search" required="" class="search-field" placeholder="Search …" value="<?php echo get_search_string(); ?>" name="s">
    </label>
    <input type="submit" class="search-submit" value="Search">
  </form>
  <?php
}

function track_search_results() : void
{
  ?>
  <div id="track-search-results">
    <div class="track-results-container">
      <div class="results-tracklist">
        <div class="load-more-loader">
          <div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div><div class="loader-4">&#8226;</div><div class="loader-5">&#8226;</div>
        </div>
      </div>
    </div>
  </div>
  <?php
}

function header_progress_controls() : void
{
  ?>
  <div id="progress-controls">
    <div class="progress-seek-control state-disabled" title="Track progress / seek"></div>
    <div class="progress-bar-control state-disabled"></div>
  </div>
  <?php
}

function header_site_branding() : void
{
  $nav_icons = get_nav_bar_icons();

  ?>
  <div class="site-branding">
    <?php echo $nav_icons['menu']; ?>
    <a href="<?php echo (is_list_player() ? get_cached_home_url('/list/') : get_cached_home_url('/')); ?>" aria-label="Home">
      <img id="branding-logo-desktop" src="<?php echo THEME_ENV['uf_logo_desktop']; ?>" title="Ultrafunk home" alt="Site Homepage">
      <img id="branding-logo-mobile"  src="<?php echo THEME_ENV['uf_logo_mobile'];  ?>" title="Ultrafunk home" alt="Site Homepage">
    </a>
    <?php echo $nav_icons['search']; ?>
  </div>
  <?php
}

function header_playback_controls() : void
{
  $player_type_title    = is_list_player() ? 'List Player - Click / Tap for Gallery player (p)'   : 'Gallery Player - Click / Tap for List player (p)';
  $player_details_title = is_list_player() ? "Show current track / Queued tracks (backquote '|')" : "Show current track (backquote '|')";
  $player_shuffle_title = is_shuffle()     ? get_shuffle_title('Reshuffle: ')                     : get_shuffle_title();

  ?>
  <div id="playback-controls">
    <div class="current-track-container">
      <button type="button" class="playback-thumbnail-control state-disabled" title="<?php echo (is_list_player() ? 'Show player' : 'Double click / tap: Toggle Fullscreen (f)'); ?>">
        <div class="thumbnail-overlay"><div class="spinner"></div></div>
        <img src="<?php echo ULTRAFUNK_THEME_URI; ?>/inc/img/playback_thumbnail_placeholder.png" alt="">
      </button>
      <button type="button" class="playback-details-control text-nowrap-ellipsis state-disabled" title="<?php echo $player_details_title; ?>">
        <span class="playback-details-artist"></span><br><span class="playback-details-title"></span>
      </button>
      <button type="button" class="playback-timer-control state-disabled" title="Toggle Autoplay (shift + a)">
        <span class="playback-timer-position"></span><br><span class="playback-timer-duration"></span>
      </button>
    </div>
    <div class="playback-controls-container">
      <button type="button" class="playback-shuffle-button state-disabled" title="<?php echo esc_attr($player_shuffle_title); ?>"><span class="material-icons">shuffle</span></button>
      <button type="button" class="playback-prev-button state-disabled" title="Previous track / seek (arrow left)"><span class="material-icons">skip_previous</span></button>
      <button type="button" class="playback-play-pause-toggle state-disabled" title="Play / Pause (space)"><span class="material-icons">play_circle_filled</span></button>
      <button type="button" class="playback-next-button state-disabled" title="Next track (arrow right)"><span class="material-icons">skip_next</span></button>
      <button type="button" class="playback-repeat-toggle state-disabled" title="Repeat off (r)" data-repeat-mode="0"><span class="material-icons">repeat</span></button>
      <button type="button" class="playback-player-type-toggle state-disabled <?php echo (is_list_player() ? 'list-player' : 'gallery-player'); ?>" title="<?php echo $player_type_title; ?>">
        <span class="material-icons-sharp"><?php echo (is_list_player() ? 'vertical_split' : 'grid_view'); ?></span>
      </button>
      <button type="button" class="playback-mute-toggle state-disabled" title="Mute / Unmute (m), Reset: shift + v"><span class="material-icons">volume_up</span></button>
      <div class="playback-volume-control state-disabled" title="Volume (+ = Up, - = Down), Reset: shift + v">00</div>
    </div>
  </div>
  <?php
}

function get_nav_bar_icons() : array
{
  $nav_icons['search'] = '<button type="button" class="nav-search-toggle" title="Show / Hide search (s)"><span class="material-icons">search</span></button>';
  $nav_icons['menu']   = '<button type="button" class="nav-menu-toggle" title="Toggle Navigation menu (n)"><span class="material-icons">menu</span></button>';

  return $nav_icons;
}

function get_nav_bar_arrows() : array
{
  $session_vars = get_session_vars();

  if (($session_vars['prevPage'] !== null) || ($session_vars['nextPage'] !== null))
  {
    $nav_url = ($session_vars['prevPage'] !== null) ? $session_vars['prevPage'] : '#';
    $nav_arrows['back'] = '<a href="' . esc_url($nav_url) . '" class="navbar-prev-link"><span class="material-icons navbar-arrow-prev" title="Previous track / page (shift + arrow left)">arrow_backward</span></a>';

    $nav_url = ($session_vars['nextPage'] !== null) ? $session_vars['nextPage'] : '#';
    $nav_arrows['fwd']  = '<a href="' . esc_url($nav_url) . '" class="navbar-next-link"><span class="material-icons navbar-arrow-next"  title="Next track / page (shift + arrow right)">arrow_forward</span></a>';
  }
  else
  {
    $nav_arrows['back'] = '<a href="/" title="Go back" onclick="javascript:history.back();return false;" class="navbar-prev-link"><span class="material-icons navbar-arrow-prev">arrow_backward</span></a>';
    $nav_arrows['fwd']  = '<a href="#" class="navbar-next-link"><span class="material-icons navbar-arrow-next">arrow_forward</span></a>';
  }

  return $nav_arrows;
}

function header_nav_bars() : void
{
  $nav_icons     = get_nav_bar_icons();
  $nav_arrows    = get_nav_bar_arrows();
  $nav_bar_title = get_nav_bar_title();

  ?>
  <div class="navbar-container">
    <div class="navbar-arrows"><?php echo $nav_arrows['back'] . $nav_arrows['fwd']; ?></div>
    <?php echo $nav_bar_title; ?>
    <div class="navbar-icons"><?php echo $nav_icons['search'] . $nav_icons['menu']; ?></div>
  </div>
  <div class="navbar-container-mobile-top">
    <div class="navbar-arrow-single back"><?php echo $nav_arrows['back']; ?></div>
    <?php echo $nav_bar_title; ?>
    <div class="navbar-arrow-single fwd"><?php echo $nav_arrows['fwd']; ?></div>
  </div>
  <div class="navbar-container-mobile-up">
    <div class="navbar-up-left">
      <?php echo $nav_icons['menu'] ?>
      <div class="navbar-arrow-single"><?php echo $nav_arrows['back']; ?></div>
    </div>
    <?php echo $nav_bar_title; ?>
    <div class="navbar-up-right">
      <div class="navbar-arrow-single"><?php echo $nav_arrows['fwd']; ?></div>
      <?php echo $nav_icons['search'] ?>
    </div>
  </div>
  <?php
}

function get_wp_pagination(string $before = ' ( ', string $separator = ' / ', string $after = ' ) ') : string
{
  global $wp_query;
  $pagination = '';
  $pagednum   = (get_query_var('paged') ? get_query_var('paged') : 1);

  if (isset($wp_query) && ($wp_query->max_num_pages > 1))
    $pagination = $before . $pagednum . $separator . $wp_query->max_num_pages . $after;

  return $pagination;
}

function get_uf_pagination(object $params) : string
{
  if (is_list_player('search'))
  {
    return ($params->max_pages <= 1)
      ? ' (' . $params->found_items . ' matches)'
      : ' (' . $params->found_items . ' matches - page ' . $params->current_page . ' of ' . $params->max_pages . ')';
  }
  else
  {
    return ($params->max_pages > 1)
      ? ' ( ' . $params->current_page . ' / ' . $params->max_pages . ' )'
      : '';
  }
}

function get_wp_search_matches() : string
{
  global $wp_query;

  if (isset($wp_query) && ($wp_query->found_posts > 1))
  {
    return ($wp_query->max_num_pages <= 1)
      ? ' (' . $wp_query->found_posts . ' matches)'
      : ' (' . $wp_query->found_posts . ' matches - page ' . get_wp_pagination('', ' of ', ')');
  }

  return '';
}

function get_list_player_prefix(object $params) : string
{
  if (is_list_player('channel') || is_list_player('all') || is_list_player('date'))
    return '<b><a href="/channels/" title="View Channels">' . $params->title_parts['prefix'] . '</a>: </b>';
  else if (is_list_player('artist'))
    return'<b><a href="/artists/" title="View Artists">' . $params->title_parts['prefix'] . '</a>: </b>';

  return '<b>' . $params->title_parts['prefix'] . ': </b>';
}

function get_nav_bar_title() : string
{
  $prefix = is_shuffle(PLAYER_TYPE::GALLERY)
    ? '<b>Shuffle: </b>'
    : '<b><a href="/channels/" title="View Channels">Channel</a>: </b>';

  $title      = esc_html(get_title());
  $pagination = esc_html(get_wp_pagination());
  $params     = get_request_params();

  if (is_single())
  {
    $prefix     = '<b>Previous</b> or <b>Next</b> track';
    $title      = '';
    $pagination = '';
  }
  else if (is_page())
  {
    $prefix     = '<span class="go-back-to"><b>Go Back: </b><span class="go-back-title"></span></span>';
    $title      = '';
    $pagination = '';
  }
  else if (is_termlist())
  {
    $prefix     = is_termlist('artists') ? '<b>Artists</b>' : '<b>All Channels</b>';
    $title      = '';
    $pagination = '';
    $query_vars = $params->query_vars;

    if ($params->max_pages > 1)
      $prefix = $prefix . ' ( ' . $params->current_page . ' / ' . $params->max_pages . ' )';
    else if (isset($query_vars['first_letter']))
      $prefix = '<b>Artists: </b><span class="normal-text">' . strtoupper($query_vars['first_letter']) . '</span><span class="found-items"> ( ' . $params->found_items . ' found )</span>';
    else
      $prefix = '<span class="go-back-to"><b>Go Back: </b><span class="go-back-title"></span></span>';
  }
  else if (is_list_player())
  {
    $prefix     = get_list_player_prefix($params);
    $title      = is_list_player('search') ? get_search_string() : $title;
    $pagination = esc_html(get_uf_pagination($params));
  }
  else if (is_404())
  {
    $prefix     = '<b>Error / 404: </b>';
    $title      = 'Page not found';
    $pagination = '';
  }
  else if (is_search())
  {
    $prefix     = '<b>Search: </b>';
    $title      = get_search_string();
    $pagination = esc_html(get_wp_search_matches());
  }
  else if (is_tax())
  {
    $prefix = is_tax('uf_channel')
      ? '<b><a href="/channels/" title="View Channels">Channel</a>: </b>'
      : '<b><a href="/artists/" title="View Artists">Artist</a>: </b>';
  }

  return '<div class="navbar-title text-nowrap-ellipsis">' . $prefix . $title . $pagination . '</div>';
}

function content_pagination() : void
{
  the_posts_pagination([
    'mid_size'           => 4,
    'screen_reader_text' => 'Pagination',
    'prev_text'          => '&#10094;&#10094; Prev.',
    'next_text'          => 'Next &#10095;&#10095;',
    'type'               => 'list',
  ]);
}

function entry_title() : void
{
  if (is_singular())
    esc_html(the_title('<h2 class="entry-title">', '</h2>'));
  else
    esc_html(the_title(sprintf('<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>'));
}

function track_title(object $post) : void
{
  $artist = esc_html($post->track_artist);
  $title  = esc_html($post->track_title);

  if (is_singular())
  {
    echo "<h2 class=\"track-artist-title\">$artist<span class=\"normal-text\"> &nbsp;&#8212;&nbsp; $title</span></h2>";
  }
  else
  {
    $link = esc_url(get_permalink());
    echo "<h2 class=\"track-artist-title\"><a href=\"$link\">$artist<span class=\"normal-text\"> &nbsp;&#8212;&nbsp; $title</span></a></h2>";
  }
}

function track_meta_controls() : void
{
  ?>
  <div class="track-meta-controls">
    <div class="share-details-controls">
      <button type="button" class="track-share-button" title="Share track / Play On"><span class="material-icons">share</span></button>
      <button type="button" class="track-details-button" title="Track Details"><span class="material-icons-outlined">info</span></button>
    </div>
    <div class="crossfade-controls">
      <button type="button" class="crossfade-preset-toggle state-disabled"></button>
      <button type="button" class="crossfade-fadeto-button state-disabled">
        <img src="<?php echo ULTRAFUNK_THEME_URI; ?>/inc/img/crossfade_icon.png" alt="Crossfade Icon" title="Crossfade to this track">
      </button>
    </div>
  </div>
  <?php
}

function content_excerpt() : void
{
  the_excerpt();

  ?>
  <p><a class="show-more" href="<?php echo esc_url(get_permalink()); ?>">Show More &#10095;&#10095;</a></p>
  <?php
}

function content_widgets() : void
{
  if (is_active_sidebar('content-widgets-1'))
  {
    ?>
    <aside class="widget-area" role="complementary">
      <?php
      if (is_active_sidebar('content-widgets-1'))
      {
        ?>
        <div class="widget-column content-widget-1">
          <?php dynamic_sidebar('content-widgets-1'); ?>
        </div>
        <?php
      }
      ?>
    </aside>
    <?php
  }
}

function perf_results() : void
{
  $perf_data = get_perf_data();

  if ($perf_data['display_perf_results'])
  {
    $results = (IS_PROD_BUILD ? 'PROD - ' : 'DEV - ') . get_num_queries() . ' queries in ' . timer_stop(0) . ' seconds';

    if (($perf_data['create_rnd_transient'] !== 0) || ($perf_data['get_rnd_transient'] !== 0))
      $results .= ' - cRnd: ' . $perf_data['create_rnd_transient'] . ' ms - gRnd: ' . $perf_data['get_rnd_transient'] . ' ms';

    if ($perf_data['route_request'] !== 0)
      $results .= ' - RouteRequest: ' . $perf_data['route_request'] . ' ms';

    echo '<!-- ' . esc_html($results) . ' -->';
  }
}
