<?php declare(strict_types=1);
/*
 * Single (standalone) track template
 *
 */


namespace Ultrafunk\Theme\Templates\SingleTrack;


use Ultrafunk\Plugin\Constants\TRACK_TYPE;


/**************************************************************************************************************************/


function get_track_date_time() : string
{
  $next_post = get_next_post();
  
  if (!empty($next_post))
    return str_replace(' ', 'T', $next_post->post_date);

  return '';
}

function entry_content(object $post) : void
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


/**************************************************************************************************************************/


$track_data        = \Ultrafunk\Theme\Functions\get_track_data($post);
$is_youtube_track  = ($track_data['track_type'] === TRACK_TYPE::YOUTUBE);
$entry_title_split = '<h2 class="entry-title type-split">' . $post->track_artist . '<br><span class="light-text">' . $post->track_title . '</span></h2>';


?>
<single-track id="track-<?php the_ID(); ?>" class=""
  data-track-type="<?php echo intval($post->track_source_type); ?>"
  data-track-artist="<?php echo esc_html($post->track_artist); ?>"
  data-track-title="<?php echo esc_html($post->track_title); ?>"
  data-track-duration="<?php echo intval($post->track_duration); ?>"
  data-track-url="<?php echo esc_url(get_permalink()); ?>"
  data-track-thumbnail-url="<?php echo $track_data['thumnail_src']; ?>"
  <?php if ($is_youtube_track) { ?>
    data-track-source-uid="<?php echo $track_data['source_uid']; ?>"
  <?php } ?>
  data-track-date-time="<?php echo esc_html(get_track_date_time()); ?>"
  >
  <header class="entry-header">
    <?php
    \Ultrafunk\Theme\Tags\entry_title();
    echo $entry_title_split;
    ?>
    <div class="entry-meta">
      <div class="entry-meta-artists">
        <b><a href="/artists/" title="Show All Artists">Artists</a>: </b><span class="term-links"><?php the_terms(get_the_ID(), 'uf_artist'); ?></span>
      </div>
      <div class="entry-meta-channels">
        <b><a href="/channels/" title="Show All Channels">Channels</a>: </b><span class="term-links"><?php the_terms(get_the_ID(), 'uf_channel'); ?></span>
      </div>
      <?php \Ultrafunk\Theme\Tags\meta_controls(); ?>
    </div>
  </header>
  <div class="entry-content">
    <?php entry_content($post); ?>
  </div>
</single-track>
