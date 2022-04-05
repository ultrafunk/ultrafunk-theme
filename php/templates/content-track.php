<?php declare(strict_types=1);
/*
 * Post / track template
 *
 */


namespace Ultrafunk\Theme\Templates\Track;


use function Ultrafunk\Theme\Functions\get_next_track_id;


/**************************************************************************************************************************/


?>

<single-track id="track-<?php the_ID(); ?>" class=""
  data-track-artist="<?php echo esc_html($post->track_artist); ?>"
  data-track-title="<?php echo esc_html($post->track_title); ?>"
  data-track-source-data="<?php echo esc_html($post->track_source_data); ?>"
  data-next-track-id="<?php echo get_next_track_id(); ?>"
  >
  <header class="entry-header">
    <?php \Ultrafunk\Theme\Tags\entry_title(); ?>
    <div class="entry-meta">
      <div class="entry-meta-artists"><b><a href="/artists/" title="Show All Artists">Artists</a>: </b><?php the_terms(get_the_ID(), 'uf_artist'); ?></div>
      <div class="entry-meta-channels"><b><a href="/channels/" title="Show All Channels">Channels</a>: </b><?php the_terms(get_the_ID(), 'uf_channel'); ?></div>
      <?php \Ultrafunk\Theme\Tags\meta_controls($post); ?>
    </div>
  </header>
  <div class="entry-content">
    <?php the_content(); ?>
  </div>
</single-track>
