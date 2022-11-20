<?php declare(strict_types=1);
/*
 * List-player template class
 *
 */


namespace Ultrafunk\Theme\Templates;


use function Ultrafunk\Plugin\Shared\get_term_links;


/**************************************************************************************************************************/


class ListPlayer extends \Ultrafunk\Theme\Templates\TemplateBase
{
  protected function render_response() : void
  {
    $is_first_video = $this->is_video(get_object_term_cache($this->query_result[0]->ID, 'uf_channel'));

    ?>
    <div id="list-player-container" class="player-container">
      <div class="embedded-container">
        <div class="wp-block-embed__wrapper <?php echo ($is_first_video ? 'aspect-ratio-16_9' : 'aspect-ratio-1_1'); ?>">
          <div id="youtube-player"></div>
        </div>
      </div>
      <div id="tracklist"
        data-term-type="<?php echo $this->params['query']['term_type'] ?? ''; ?>"
        data-term-id="<?php   echo $this->params['query']['term_id']   ?? ''; ?>"
        >
        <?php $this->tracklist_entries(); ?>
        <div id="tracklist-load-more">
          <div class="load-more-title">Load more tracks...<span class="light-text"></span></div>
          <div class="load-more-loader">
            <div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div><div class="loader-4">&#8226;</div><div class="loader-5">&#8226;</div>
          </div>
        </div>
      </div>
    </div>
    <?php

    $this->content_pagination();
  }


  /**************************************************************************************************************************/


  private function tracklist_entries() : void
  {
    foreach($this->query_result as $track)
    {
      $track_artist     = esc_html($track->track_artist);
      $track_title      = esc_html($track->track_title);
      $track_duration   = intval($track->track_duration);
      $track_url        = esc_url("$this->home_url/track/$track->post_name/");
      $track_data       = \Ultrafunk\Theme\Functions\get_track_data($track);
      $is_youtube_track = ($track_data['track_type'] === \Ultrafunk\Plugin\Constants\TRACK_TYPE::YOUTUBE);
      $artists          = get_object_term_cache($track->ID, 'uf_artist');
      $channels         = get_object_term_cache($track->ID, 'uf_channel');
      $is_video_class   = $this->is_video($channels) ? ' is-video' : ' is-audio';

      ?>
      <div id="<?php echo uniqid(); ?>" class="track-entry <?php echo $track_data['css_class'] . $is_video_class; ?>"
        data-track-type="<?php echo $track_data['track_type']; ?>"
        data-track-id="track-<?php echo $track->ID; ?>"
        data-track-artist="<?php echo $track_artist; ?>"
        data-track-title="<?php echo $track_title; ?>"
        data-track-duration="<?php echo $track_duration; ?>"
        data-track-url="<?php echo $track_url; ?>"
        data-track-thumbnail-url="<?php echo $track_data['thumnail_src']; ?>"
        <?php if ($is_youtube_track) { ?>
          data-track-source-uid="<?php echo $track_data['source_uid']; ?>"
        <?php } ?>
        >
        <div class="track-artists-links"><?php echo get_term_links($artists, '/list/artist/', '', (int)$track->track_artist_id); ?></div>
        <div class="track-channels-links"><?php echo get_term_links($channels, '/list/channel/'); ?></div>
        <div class="track-details">
          <div class="thumbnail" <?php echo ($is_youtube_track ? 'title="Play Track"' : 'title="SoundCloud Track"'); ?>>
            <?php if (\Ultrafunk\Theme\Constants\IS_PROD_BUILD) { ?>
              <div class="thumbnail-overlay"><div class="spinner"></div></div>
              <img src="<?php echo $track_data['thumnail_src']; ?>" alt="">
            <?php } else { ?>
              <div class="thumbnail-overlay"><div class="spinner"></div></div>
              <?php if ($is_youtube_track) { ?>
                <img src="/wp-content/themes/ultrafunk/inc/img/yt_thumbnail_placeholder.png" alt="">
              <?php } else { ?>
                <img src="/wp-content/themes/ultrafunk/inc/img/sc_thumbnail_placeholder.png" alt="">
              <?php } ?>
            <?php } ?>
          </div>
          <?php if ($is_youtube_track) { ?>
            <div class="artist-title text-nowrap-ellipsis"><span><b><?php echo $track_artist; ?></b></span><br><span><?php echo $track_title; ?></span></div>
          <?php } else { ?>
            <div class="artist-title text-nowrap-ellipsis" title="Link: Play SoundCloud track">
              <a href="<?php echo $track_url; ?>"><span><b><?php echo $track_artist; ?></b></span><br><span><?php echo $track_title; ?></span></a>
            </div>
          <?php } ?>
        </div>
        <div class="track-actions">
          <div class="track-message"></div>
          <div class="track-action-buttons">
            <div class="remove-button" title="Remove Track from List"><span class="material-icons">close</span></div>
            <?php if ($is_youtube_track) { ?>
              <div class="play-next-button" title="Play Next"><span class="material-icons">playlist_play</span></div>
            <?php } ?>
            <div class="share-play-button" title="Share Track / Play On"><span class="material-icons">share</span></div>
            <div class="details-button" title="Track Details"><span class="material-icons-outlined">info</span></div>
          </div>
          <div class="track-actions-toggle" title="Show / Hide track actions"><span class="material-icons">more_horiz</span></div>
        </div>
        <div class="track-duration text-nowrap-ellipsis"><?php echo ($is_youtube_track ? $this->getTimeString($track_duration) : 'N / A'); ?></div>
      </div>
      <?php
    }
  }


  /**************************************************************************************************************************/


  private function is_video(array $channels) : bool
  {
    foreach ($channels as $channel)
    {
      if ($channel->term_id === \Ultrafunk\Theme\Constants\THEME_ENV['channel_videos_id'])
        return true;
    }

    return false;
  }

  private function getTimeString(int $seconds) : string
  {
    return (($seconds > 3600) ? gmdate("H:i:s", $seconds) : gmdate("i:s", $seconds));
  }
}
