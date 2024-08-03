<?php declare(strict_types=1);
/*
 * List-player template class
 *
 */


namespace Ultrafunk\Theme\Templates;


use const Ultrafunk\Theme\Config\IS_PROD_BUILD;

use function Ultrafunk\Plugin\Shared\get_term_links;


/**************************************************************************************************************************/


class ListPlayer extends \Ultrafunk\Theme\Templates\TemplateBase
{
  protected function render_response() : void
  {
    $is_first_video = $this->is_video(get_object_term_cache($this->query_result[0]->ID, 'uf_channel'));

    ?>
    <div id="list-player-container" class="player-container">
      <div class="embedded-container youtube-container">
        <div class="wp-block-embed__wrapper <?php echo ($is_first_video ? 'aspect-ratio-16_9' : 'aspect-ratio-1_1'); ?>">
          <div id="youtube-player"></div>
        </div>
      </div>
      <div class="embedded-container soundcloud-container">
        <div class="wp-block-embed__wrapper">
          <iframe id="soundcloud-player" allow="autoplay" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&single_active=true&show_artwork=true"></iframe>
        </div>
      </div>
      <div class="embedded-container local-container">
        <div class="wp-block-embed__wrapper aspect-ratio-1_1">
          <div id="local-player">
            <div class="artist-title-container">
              <div class="artist-title text-nowrap-ellipsis"></div>
            </div>
            <img id="local-player-image" src="" title="Toggle Play / Pause" />
            <audio id="local-audio-player" controls ></audio>
          </div>
        </div>
      </div>
      <div id="tracklist"
        data-term-type="<?php echo $this->params->query_vars['term_type'] ?? ''; ?>"
        data-term-id="<?php   echo $this->params->query_vars['term_id']   ?? ''; ?>"
        >
        <?php $this->tracklist_entries(); ?>
        <button type="button" id="tracklist-load-more-button">
          <div class="load-more-title">Load more tracks...<span class="light-text"></span></div>
          <div class="load-more-loader">
            <div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div><div class="loader-4">&#8226;</div><div class="loader-5">&#8226;</div>
          </div>
        </button>
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
      $track_artist        = esc_html($track->track_artist);
      $track_title         = esc_html($track->track_title);
      $track_duration      = intval($track->track_duration);
      $track_data          = \Ultrafunk\Theme\Functions\get_track_data($track);
      $is_youtube_track    = ($track_data['track_type'] === \Ultrafunk\Plugin\Shared\TRACK_TYPE::YOUTUBE);
      $artists             = get_object_term_cache($track->ID, 'uf_artist');
      $channels            = get_object_term_cache($track->ID, 'uf_channel');
      $is_video_class      = $this->is_video($channels) ? ' is-video' : ' is-audio';
      $yt_thumbnail_url    = IS_PROD_BUILD     ? $track_data['thumnail_src'] : \Ultrafunk\Theme\Config\THEME_ENV['default_yt_thumbnail'];
      $track_thumbnail_url = $is_youtube_track ? $yt_thumbnail_url           : \Ultrafunk\Theme\Config\THEME_ENV['default_sc_thumbnail'];

      ?>
      <div id="track-<?php echo uniqid(); ?>" class="track-entry default-density <?php echo $track_data['css_class'] . $is_video_class; ?>"
        data-track-type="<?php echo $track_data['track_type']; ?>"
        data-track-id="track-<?php echo $track->ID; ?>"
        data-track-artist="<?php echo $track_artist; ?>"
        data-track-title="<?php echo $track_title; ?>"
        data-track-duration="<?php echo $track_duration; ?>"
        data-track-url="<?php echo esc_url("$this->home_url/track/$track->post_name/"); ?>"
        data-track-thumbnail-url="<?php echo $track_thumbnail_url; ?>"
        data-track-source-uid="<?php echo $track_data['source_uid']; ?>"
        >
        <div class="track-artists-links"><?php echo get_term_links($artists, '/list/artist/', '', (int)$track->track_artist_id); ?></div>
        <div class="track-channels-links"><?php echo get_term_links($channels, '/list/channel/'); ?></div>
        <div class="track-details">
          <button type="button" class="thumbnail" title="Play Track">
            <div class="thumbnail-overlay"><div class="spinner"></div></div>
            <img src="<?php echo $track_thumbnail_url; ?>" alt="">
          </button>
          <div class="artist-title text-nowrap-ellipsis"><span><b><?php echo $track_artist; ?></b></span><br><span><?php echo $track_title; ?></span></div>
        </div>
        <div class="track-actions">
          <div class="track-message"></div>
          <div class="track-action-buttons">
            <button type="button" class="remove-button" title="Remove Track from List"><span class="material-icons">close</span></button>
            <button type="button" class="play-next-button" title="Play Next"><span class="material-icons">playlist_play</span></button>
            <button type="button" class="share-play-button" title="Share Track / Play On"><span class="material-icons">share</span></button>
            <button type="button" class="details-button" title="Track Details"><span class="material-icons-outlined">info</span></button>
          </div>
          <button type="button" class="track-actions-toggle" title="Show / Hide track actions"><span class="material-icons">more_horiz</span></button>
        </div>
        <div class="track-duration text-nowrap-ellipsis" title="Track duration"><?php echo ($is_youtube_track ? $this->getTimeString($track_duration) : 'N / A'); ?></div>
      </div>
      <?php
    }
  }


  /**************************************************************************************************************************/


  private function is_video(array $channels) : bool
  {
    foreach ($channels as $channel)
    {
      if ($channel->term_id === \Ultrafunk\Theme\Config\THEME_ENV['channel_videos_id'])
        return true;
    }

    return false;
  }

  private function getTimeString(int $seconds) : string
  {
    return (($seconds > 3600) ? gmdate("H:i:s", $seconds) : gmdate("i:s", $seconds));
  }
}
