<?php declare(strict_types=1);
/*
 * Custom tags for this theme
 *
 */


namespace Ultrafunk\Theme\Tags;


use Ultrafunk\Plugin\Constants\PLAYER_TYPE;

use const Ultrafunk\Theme\Constants\THEME_ENV;

use function Ultrafunk\Plugin\Globals\ {
  is_request,
  is_termlist,
  is_list_player,
  is_shuffle,
  get_perf_data,
  get_request_params,
  get_session_vars,
  get_cached_home_url,
};

use function Ultrafunk\Theme\Functions\ {
  get_title,
  get_shuffle_title,
};


/**************************************************************************************************************************/


function user_layout_class() : void
{
  if (!is_singular() && !is_search() && !is_404())
  {
    global $wp_query;

    if (isset($wp_query) && ($wp_query->post_count >= 3))
      echo 'user-layout';
  }
}

function pre_wp_head() : void
{
  ?>
  <script>
    const siteTheme      = localStorage.getItem('uf_site_theme');
    let   siteThemeClass = 'site-theme-light';

    if (siteTheme !== null)
      siteThemeClass = (siteTheme === 'dark') ? 'site-theme-dark' : 'site-theme-light';

    document.documentElement.classList.add(siteThemeClass);

    if ((window.innerWidth > 1100) && (document.documentElement.classList.contains('user-layout')))
    {
      const galleryLayout      = localStorage.getItem('uf_gallery_layout');
      let   galleryLayoutClass = 'gallery-layout-3-column';

      if (galleryLayout !== null)
      {
        if (galleryLayout === '1-column')
          galleryLayoutClass = 'gallery-layout-1-column';
        else if (galleryLayout === '2-column')
          galleryLayoutClass = 'gallery-layout-2-column';
      }

      document.documentElement.classList.add(galleryLayoutClass);
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
  <?php

  global $ultrafunk_is_prod_build, $ultrafunk_js_preload_chunk;

  if (!empty($ultrafunk_js_preload_chunk) && $ultrafunk_is_prod_build)
    echo '<link rel="modulepreload" href="' . esc_url(get_template_directory_uri()) . $ultrafunk_js_preload_chunk . '" as="script" crossorigin>' . PHP_EOL;
}

function meta_description() : void
{
  $meta_description = '<meta name="description" content="Ultrafunk is an interactive playlist with carefully chosen and continually updated tracks rooted in Funk and related genres." />' . PHP_EOL;

  if (is_front_page() && !is_paged() && !is_shuffle(PLAYER_TYPE::GALLERY))
    echo $meta_description;
  else if (is_list_player_frontpage())
    echo $meta_description;
  else if (get_the_ID() === THEME_ENV['page_about_id'])
    echo $meta_description;
}

function scripts_styles() : void
{
  global $ultrafunk_is_prod_build;
  $template_uri = esc_url(get_template_directory_uri());
  $js_path      = $ultrafunk_is_prod_build ? '/js/dist/' : '/js/src/';

  \Ultrafunk\Plugin\Globals\set_session_vars(\Ultrafunk\Theme\Functions\get_session_vars());

  ?>
  <script><?php echo 'const UF_RESPONSE_DATA = ' . json_encode(\Ultrafunk\Plugin\Globals\get_session_vars()); ?></script>
  <script type="module" src="<?php echo $template_uri . $js_path  . 'playback/interaction.js?ver='     . \Ultrafunk\Theme\Constants\VERSION; ?>"></script>
  <script type="module" src="<?php echo $template_uri . $js_path  . 'index.js?ver='                    . \Ultrafunk\Theme\Constants\VERSION; ?>"></script>
  <noscript><link rel="stylesheet" href="<?php echo $template_uri . '/inc/css/style-noscript.css?ver=' . \Ultrafunk\Theme\Constants\VERSION; ?>" media="all" /></noscript>
  <?php

  if (!is_page() && !is_list_player() && !is_termlist())
    echo '<script defer src="https://w.soundcloud.com/player/api.js"></script>' . PHP_EOL;
}

function head() : void
{
  meta_description();
  scripts_styles();

  if (WP_DEBUG)
  {
    ?>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-116878-17"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-116878-17');
    </script>
    <?php
  }
  else
  {
    ?>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-116878-16"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-116878-16');
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
  $is_list_player_search = (is_list_player() || is_request('response', 'list_player', 'search'));
  
  ?>
  <form role="search" method="get" class="search-form" action="<?php echo get_cached_home_url($is_list_player_search ? '/list/search/' : '/'); ?>">
    <label>
      <span class="screen-reader-text">Search for:</span>
      <input type="search" required="" class="search-field" placeholder="Search …" value="<?php echo get_search_string(); ?>" name="s">
    </label>
    <input type="submit" class="search-submit" value="Search">
  </form>
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
      <img id="branding-logo-mobile"  src="<?php echo THEME_ENV['uploads_branding']; ?>ultrafunk_logo_mobile_12.png"  title="Ultrafunk home" alt="">
      <img id="branding-logo-desktop" src="<?php echo THEME_ENV['uploads_branding']; ?>ultrafunk_logo_desktop_12.png" title="Ultrafunk home" alt="">
    </a>
    <?php echo $nav_icons['search']; ?>
  </div>
  <?php
}

function header_playback_controls() : void
{
  $player_type_title    = is_list_player() ? 'List Player - Click / Tap for Gallery player (p)'   : 'Gallery Player - Click / Tap for List player (p)';
  $player_details_title = is_list_player() ? "Show current track / Queued tracks (backquote '|')" : "Show current track (backquote '|')";
  
  ?>
  <div id="playback-controls">
    <div class="playback-details-control state-disabled" title="<?php echo $player_details_title; ?>">
      <span class="playback-details-artist"></span><br><span class="playback-details-title"></span>
    </div>
    <div class="playback-thumbnail-control state-disabled" title="<?php echo (is_list_player() ? 'Show player' : 'Double click / tap: Toggle Fullscreen (f)'); ?>">
      <div class="thumbnail-overlay"><div class="spinner"></div></div>
      <img src="<?php echo esc_url(get_template_directory_uri()); ?>/inc/img/playback_thumbnail_placeholder.png" alt="">
    </div>
    <div class="playback-timer-control state-disabled" title="Toggle Autoplay (shift + a)">
      <span class="playback-timer-position"></span><br><span class="playback-timer-duration"></span>
    </div>
    <div class="playback-player-type-control state-disabled <?php echo (is_list_player() ? 'list-player' : 'gallery-player'); ?>" title="<?php echo $player_type_title; ?>">
      <span class="material-icons-sharp"><?php echo (is_list_player() ? 'vertical_split' : 'grid_view'); ?></span>
    </div>
    <div class="playback-prev-control state-disabled" title="Previous track / seek (arrow left)"><span class="material-icons">skip_previous</span></div>
    <div class="playback-play-pause-control state-disabled" title="Play / Pause (space)"><span class="material-icons">play_circle_filled</span></div>
    <div class="playback-next-control state-disabled" title="Next track (arrow right)"><span class="material-icons">skip_next</span></div>
    <div class="playback-repeat-control state-disabled" title="Repeat off (r)" data-repeat-mode="0"><span class="material-icons">repeat</span></div>
    <div class="playback-shuffle-control state-disabled" title="<?php echo esc_attr(get_shuffle_title()); ?>"><span class="material-icons">shuffle</span></div>
    <div class="playback-mute-control state-disabled" title="Mute / Unmute (m)"><span class="material-icons">volume_up</span></div>
  </div>
  <?php
}

function get_nav_bar_icons() : array
{
  $nav_icons['search'] = '<div class="nav-search-toggle" title="Show / Hide search (s)"><span class="material-icons">search</span></div>';
  $nav_icons['menu']   = '<div class="nav-menu-toggle" title="Toggle Channel menu (c)"><span class="material-icons">menu</span></div>';

  return $nav_icons;
}

function get_nav_bar_arrows() : array
{
  $session_vars = get_session_vars();
  
  if (($session_vars['prevPage'] !== null) || ($session_vars['nextPage'] !== null))
  {
    if ($session_vars['prevPage'] !== null)
      $nav_arrows['back'] = '<a href="' . esc_url($session_vars['prevPage']) . '" class="navbar-prev-link"><span class="material-icons navbar-arrow-back" title="Previous track / page (shift + arrow left)">arrow_backward</span></a>';
    else
      $nav_arrows['back'] = '<span class="material-icons navbar-arrow-back disbled">arrow_backward</span>';

    if ($session_vars['nextPage'] !== null)
      $nav_arrows['fwd'] = '<a href="' . esc_url($session_vars['nextPage']) . '" class="navbar-next-link"><span class="material-icons navbar-arrow-fwd" title="Next track / page (shift + arrow right)">arrow_forward</span></a>';
    else
      $nav_arrows['fwd'] = '<span class="material-icons navbar-arrow-fwd disbled">arrow_forward</span>';
  }
  else
  {
    $nav_arrows['back'] = '<a href="" title="Go back" onclick="javascript:history.back();return false;" class="navbar-prev-link"><span class="material-icons navbar-arrow-back">arrow_backward</span></a>';
    $nav_arrows['fwd']  = '<span class="material-icons navbar-arrow-fwd disbled">arrow_forward</span>';
  }

  return $nav_arrows;
}

function header_nav_bars() : void
{
  $nav_icons  = get_nav_bar_icons();
  $nav_arrows = get_nav_bar_arrows();

  ?>
  <div class="navbar-container">
    <div class="navbar-arrows"><?php echo $nav_arrows['back'] . $nav_arrows['fwd']; ?></div>
    <?php nav_bar_title(); ?>
    <div class="navbar-icons"><?php echo $nav_icons['search'] . $nav_icons['menu']; ?></div>
  </div>
  <div class="navbar-container-mobile-top">
    <div class="navbar-arrow-single back"><?php echo $nav_arrows['back']; ?></div>
    <?php nav_bar_title(); ?>
    <div class="navbar-arrow-single fwd"><?php echo $nav_arrows['fwd']; ?></div>
  </div>
  <div class="navbar-container-mobile-up">
    <div class="navbar-up-left">
      <?php echo $nav_icons['menu'] ?>
      <div class="navbar-arrow-single"><?php echo $nav_arrows['back']; ?></div>
    </div>
    <?php nav_bar_title(); ?>
    <div class="navbar-up-right">
      <div class="navbar-arrow-single"><?php echo $nav_arrows['fwd']; ?></div>
      <?php echo $nav_icons['search'] ?>
    </div>
  </div>
  <?php
}

function get_pagination(string $before = ' ( ', string $separator = ' / ', string $after = ' ) ') : string
{
  global $wp_query;
  $pagination = '';
  $pagednum   = (get_query_var('paged') ? get_query_var('paged') : 1);
  
  if (isset($wp_query) && ($wp_query->max_num_pages > 1))
    $pagination = $before . $pagednum . $separator . $wp_query->max_num_pages . $after;
  
  return $pagination;
}

function get_search_hits() : string
{
  global $wp_query;
    
  if (isset($wp_query) && ($wp_query->found_posts > 1))
  {
    if ($wp_query->max_num_pages <= 1)
      return ' (' . $wp_query->found_posts . ' hits)';
    else
      return ' (' . $wp_query->found_posts . ' hits - page ' . get_pagination('', ' of ', ')');
  }

  return '';
}

function nav_bar_title() : void
{
  $prefix     = is_shuffle(PLAYER_TYPE::GALLERY) ? '<b>Shuffle: </b>' : '<b>Channel: </b>';
  $title      = esc_html(get_title());
  $pagination = esc_html(get_pagination());
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
    $prefix     = is_termlist('artists') ? '<b>All Artists</b>' : '<b>All Channels</b>';
    $title      = '';
    $pagination = '';
    $data       = $params['data'];
  
    if ($params['max_pages'] > 1)
      $prefix = $prefix . ' ( ' . $params['current_page'] . ' / ' . $params['max_pages'] . ' )';
    else if (isset($data['first_letter']))
      $prefix = '<b>Artists: </b><span class="normal-text">' . strtoupper($data['first_letter']) . '</span> ( ' . $data['item_count'] . ' found )';
    else
      $prefix = '<span class="go-back-to"><b>Go Back: </b><span class="go-back-title"></span></span>';
  }
  else if (is_list_player())
  {
    $prefix     = '<b>' . $params['title_parts']['prefix'] . ': </b>';
    $title      = is_list_player('search') ? get_search_string() : $title;
    $pagination = ($params['max_pages'] > 1)
                    ? ' ( ' . $params['current_page'] . ' / ' . $params['max_pages'] . ' )'
                    : '';
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
    $pagination = esc_html(get_search_hits());
  }
  else if (is_tax())
  {
    $prefix = is_tax('uf_channel') ? '<b>Channel: </b>' : '<b>Artist: </b>';
  }

  echo '<div class="navbar-title">' . $prefix . $title . $pagination . '</div>';
}

function single_track_nav_link(bool $is_prev, mixed $post) : void
{
  if (($post !== null) && ($post !== ''))
  {
    $track_artist_title = '<b>' . esc_html($post->track_artist) . '</b><br>' . esc_html($post->track_title);
    
    ?>
    <div class="<?php echo ($is_prev ? 'nav-previous' : 'nav-next'); ?>">
      <a href="<?php echo esc_url(get_the_permalink($post)); ?>" rel="<?php echo ($is_prev ? 'prev' : 'next'); ?>">
        <?php if ($is_prev) { ?>
          <div class="prev-track-arrow">&#10094</div>
        <?php } ?>
        <div class="<?php echo ($is_prev ? 'prev-track-artist-title' : 'next-track-artist-title'); ?>"><?php echo $track_artist_title; ?></div>
        <?php if (!$is_prev) { ?>
          <div class="next-track-arrow">&#10095</div>
        <?php } ?>
      </a>
    </div>
    <?php
  }
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

function meta_controls() : void
{
  ?>
  <div class="entry-meta-controls">
    <div class="track-share-control">
      <span class="material-icons" title="Share track / Play On">share</span>
    </div>
    <div class="crossfade-controls">
      <div class="crossfade-preset-control state-disabled"></div>
      <div class="crossfade-fadeto-control state-disabled">
        <img src="<?php echo esc_url(get_template_directory_uri()); ?>/inc/img/crossfade_icon.png" alt="" title="Crossfade to this track">
      </div>
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

function is_list_player_frontpage() : bool
{
  return (is_list_player('all') && (get_request_params()['current_page'] === 1));
}

function intro_banner() : void
{
  // Exit early since banners are not shown on paginated content
  if (is_paged())
    return;

  if (is_front_page() && !is_shuffle(PLAYER_TYPE::GALLERY))
  {
    intro_banner_html('block_gallery_intro_id', 'showFrontpageIntro');
  }
  else if (is_list_player_frontpage())
  {
    intro_banner_html('block_list_intro_id', 'showFrontpageIntro');
  }
  else if (is_tax('uf_channel', 'premium') && have_posts())
  {
    intro_banner_html('block_premium_intro_id', 'showPremiumIntro');
  }
  else if (is_tax('uf_channel', 'promo') && have_posts())
  {
    intro_banner_html('block_promo_intro_id', 'showPromoIntro');
  }
}

function intro_banner_html(string $theme_env_key, string $property) : void
{
  $post    = get_post(THEME_ENV[$theme_env_key]);
  $content = apply_filters('the_content', wp_kses_post($post->post_content));

  ?>
  <script>const bannerProperty = '<?php echo $property; ?>';</script>
  <div id="intro-banner">
    <div class="intro-banner-container">
      <?php echo $content; ?>
      <div class="intro-banner-close-button">
        Close <span class="light-text">(and don't show again)</span>
      </div>
    </div>
  </div>
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
  global $ultrafunk_is_prod_build;
  $perf_data = get_perf_data();

  if ($perf_data['display_perf_results'])
  {
    $results = ($ultrafunk_is_prod_build ? 'PROD - ' : 'DEV - ') . get_num_queries() . ' queries in ' . timer_stop(0) . ' seconds';

    if (($perf_data['create_rnd_transient'] !== 0) || ($perf_data['get_rnd_transient'] !== 0))
      $results .= ' - cRnd: ' . $perf_data['create_rnd_transient'] . ' ms - gRnd: ' . $perf_data['get_rnd_transient'] . ' ms';

    if ($perf_data['route_request'] !== 0)
      $results .= ' - RouteRequest: ' . $perf_data['route_request'] . ' ms';

    echo '<!-- ' . esc_html($results) . ' -->';
  }
}
