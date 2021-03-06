<?php declare(strict_types=1);
/*
 * Track template for gallery tracks
 *
 */


namespace Ultrafunk\Theme\Templates\GalleryTrack;


use Ultrafunk\Plugin\Constants\TRACK_TYPE;


/**************************************************************************************************************************/


$track_data       = \Ultrafunk\Theme\Functions\get_track_data($post);
$is_youtube_track = ($track_data['track_type'] === TRACK_TYPE::YOUTUBE);


?>
<gallery-track id="track-<?php the_ID(); ?>" class=""
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
  <header class="track-header">
    <?php \Ultrafunk\Theme\Tags\entry_title('track'); ?>
    <div class="track-meta">
      <div class="track-meta-artists">
        <b><a href="/artists/" title="Show All Artists">Artists</a>: </b><span class="term-links"><?php the_terms(get_the_ID(), 'uf_artist'); ?></span>
      </div>
      <div class="track-meta-channels">
        <b><a href="/channels/" title="Show All Channels">Channels</a>: </b><span class="term-links"><?php the_terms(get_the_ID(), 'uf_channel'); ?></span>
      </div>
      <?php \Ultrafunk\Theme\Tags\track_meta_controls(); ?>
    </div>
  </header>
  <div class="track-content">
    <?php the_content(); ?>
  </div>
</gallery-track>
