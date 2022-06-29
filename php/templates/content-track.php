<?php declare(strict_types=1);
/*
 * Single track template for pages with multiple tracks
 *
 */


namespace Ultrafunk\Theme\Templates\Track;


use Ultrafunk\Plugin\Constants\TRACK_TYPE;


/**************************************************************************************************************************/


$track_data       = \Ultrafunk\Theme\Functions\get_track_data($post);
$is_youtube_track = ($track_data['track_type'] === TRACK_TYPE::YOUTUBE);


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
  >
  <header class="entry-header">
    <?php \Ultrafunk\Theme\Tags\entry_title(); ?>
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
    <?php the_content(); ?>
  </div>
</single-track>
