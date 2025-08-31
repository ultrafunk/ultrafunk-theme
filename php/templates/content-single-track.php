<?php declare(strict_types=1);
/*
 * Single (standalone) track template
 *
 */


namespace Ultrafunk\Theme\Templates\SingleTrack;


use Ultrafunk\Plugin\Shared\Constants\TRACK_TYPE;

use function Ultrafunk\Plugin\Shared\Utils\get_term_links;

use function Ultrafunk\Theme\Functions\ {
  get_track_data,
  get_cached_terms,
};


/**************************************************************************************************************************/


$track_data        = get_track_data($post);
$artists           = get_cached_terms($post->ID, 'uf_artist');
$channels          = get_cached_terms($post->ID, 'uf_channel');
$track_title_split = '<h2 class="track-artist-title type-split">' . $post->track_artist . '<br><span class="track-title-part">' . $post->track_title . '</span></h2>';


?>
<single-track id="track-<?php the_ID(); ?>" class=""
  data-track-type="<?php echo intval($post->track_source_type); ?>"
  data-track-artist="<?php echo esc_html($post->track_artist); ?>"
  data-track-title="<?php echo esc_html($post->track_title); ?>"
  data-track-duration="<?php echo intval($post->track_duration); ?>"
  data-track-url="<?php echo esc_url(get_permalink()); ?>"
  data-track-thumbnail-url="<?php echo $track_data['thumnail_src']; ?>"
  data-track-source-uid="<?php echo $track_data['source_uid']; ?>"
  data-prev-track-date-time="<?php echo esc_html(get_prev_next_track_date_time(true)); ?>"
  data-next-track-date-time="<?php echo esc_html(get_prev_next_track_date_time(false)); ?>"
  >
  <header class="track-header">
    <?php
    \Ultrafunk\Theme\Tags\track_title($post);
    echo $track_title_split;
    ?>
    <div class="track-meta">
      <div class="track-meta-artists">
        <b><a href="/artists/" title="View Artists">Artists</a>: </b>
        <span data-click-id="track-artist-link" class="track-artists-links"><?php echo get_term_links($artists, '/artist/', ', ', (int)$post->track_artist_id); ?></span>
      </div>
      <div class="track-meta-channels">
        <b><a href="/channels/" title="View Channels">Channels</a>: </b>
        <span data-click-id="track-channel-link" class="track-channels-links"><?php echo get_term_links($channels, '/channel/', ', '); ?></span>
      </div>
      <?php \Ultrafunk\Theme\Tags\track_meta_controls(); ?>
    </div>
  </header>
  <div class="track-content">
    <?php track_content($post); ?>
  </div>
</single-track>
<nav class="navigation single-track-nav" aria-label="Single Track Navigation">
  <h2 class="screen-reader-text">Track navigation</h2>
  <div class="nav-links">
    <?php
    track_nav_link(true,  get_next_post());
    track_nav_link(false, get_previous_post());
    ?>
  </div>
</nav>
<?php


/**************************************************************************************************************************/


function get_prev_next_track_date_time(bool $get_prev_track) : string
{
  $post_data = $get_prev_track ? get_previous_post() : get_next_post();

  if (!empty($post_data))
    return str_replace(' ', 'T', $post_data->post_date);

  return '';
}

function track_content(object $post) : void
{
  if (intval($post->track_source_type) === TRACK_TYPE::SOUNDCLOUD)
  {
    the_content();
  }
  else
  {
    ?>
    <figure class="wp-block-embed">
      <div class="wp-block-embed__wrapper">
        <div id="youtube-player"></div>
      </div>
    </figure>
    <?php
  }
}

function track_nav_link(bool $is_nav_prev, mixed $post) : void
{
  if (($post !== null) && ($post !== ''))
  {
    $track_artist_title = '<b>' . esc_html($post->track_artist) . '</b><br>' . esc_html($post->track_title);
    $data_click_id      = $is_nav_prev ? 'data-click-id="nav-prev-track"' : 'data-click-id="nav-next-track"';
    $prev_next_title    = $is_nav_prev ? 'title="Go to Previous track"' : 'title="Go to Next track"';
    $prev_next_post     = $is_nav_prev ? get_next_post() : get_previous_post();
    $track_data         = ($prev_next_post !== null) ? get_track_data($prev_next_post) : null;

    ?>
    <div class="<?php echo ($is_nav_prev ? 'nav-previous' : 'nav-next'); ?>">
      <a href="<?php echo esc_url(get_the_permalink($post)); ?>" <?php echo ($is_nav_prev ? 'rel="prev"' : 'rel="next"') . ' ' . $data_click_id . ' ' . $prev_next_title; ?>>
        <?php if ($is_nav_prev) { ?>
          <div class="prev-track-arrow">&#10094;</div>
          <div class="prev-track-nav-thumbnail <?php echo $track_data['css_class']; ?>"><img src="<?php echo $track_data['thumnail_src']; ?>" alt="Previous Track Thumbnail"></div>
        <?php } ?>
        <div class="<?php echo ($is_nav_prev ? 'prev-track-artist-title' : 'next-track-artist-title'); ?>"><?php echo $track_artist_title; ?></div>
        <?php if (!$is_nav_prev) { ?>
          <div class="next-track-nav-thumbnail <?php echo $track_data['css_class']; ?>"><img src="<?php echo $track_data['thumnail_src']; ?>" alt="Next Track Thumbnail"></div>
          <div class="next-track-arrow">&#10095;</div>
        <?php } ?>
      </a>
    </div>
    <?php
  }
}
