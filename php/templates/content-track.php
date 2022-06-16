<?php declare(strict_types=1);
/*
 * Post / track template
 *
 */


namespace Ultrafunk\Theme\Templates\Track;


?>

<single-track id="track-<?php the_ID(); ?>" class=""
  data-track-type="<?php echo intval($post->track_source_type); ?>"
  data-track-artist="<?php echo esc_html($post->track_artist); ?>"
  data-track-title="<?php echo esc_html($post->track_title); ?>"
  data-track-duration="<?php echo intval($post->track_duration); ?>"
  data-track-source-data="<?php echo esc_html($post->track_source_data); ?>"
  data-track-date-time="<?php echo esc_html(str_replace(' ', 'T', $post->post_date)); ?>"
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
      <?php \Ultrafunk\Theme\Tags\meta_controls($post); ?>
    </div>
  </header>
  <div class="entry-content">
    <?php the_content(); ?>
  </div>
</single-track>
