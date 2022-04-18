<?php declare(strict_types=1);
/*
 * List-player template
 *
 */


namespace Ultrafunk\Theme\Templates\ListPlayer;


use Ultrafunk\Plugin\Constants\TRACK_TYPE;

use function Ultrafunk\Plugin\Globals\get_cached_home_url;

use function Ultrafunk\Plugin\Shared\ {
  request_pagination,
  get_track_data,
};


/**************************************************************************************************************************/


function render_template(object $request_handler) : void
{
  if (!empty($request_handler->query_data))
  {
    $is_first_video = is_video(get_object_term_cache($request_handler->query_data[0]->ID, 'uf_channel'));

    ?>
    <div id="list-player-container" class="player-container">
      <div class="embedded-container">
        <div class="wp-block-embed__wrapper <?php echo ($is_first_video ? 'aspect-ratio-16_9' : 'aspect-ratio-1_1'); ?>">
          <div id="youtube-player"></div>
        </div>
      </div>
      <div id="tracklist"
        data-term-type="<?php echo $request_handler->term_type       ?? ''; ?>"
        data-term-id="<?php  echo $request_handler->wp_term->term_id ?? ''; ?>"
        >
        <?php tracklist_entries($request_handler); ?>
        <div id="tracklist-load-more">
          <div class="load-more-title">Load more tracks...<span class="light-text"></span></div>
          <div class="load-more-loader">
            <div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div><div class="loader-4">&#8226;</div><div class="loader-5">&#8226;</div>
          </div>
        </div>
      </div>
    </div>
    <?php
    request_pagination($request_handler);
  }
}

function term_links(array $tags, string $path, int $track_artist_id = -1) : void
{
  foreach ($tags as $tag)
  {
    $class = (($track_artist_id !== -1) && ($tag->term_id === $track_artist_id)) ? 'primary' : 'secondary';    
    echo "<a class='$class' href='/list/$path/$tag->slug/'>$tag->name</a>";
  }
}

function is_video(array $channels) : bool
{
  foreach ($channels as $channel)
  {
    if ($channel->slug === 'video')
      return true;
  }

  return false;
}

function getTimeString(int $seconds) : string
{
  return (($seconds > (60 * 60)) ? gmdate("H:i:s", $seconds) : gmdate("i:s", $seconds));
}

function tracklist_entries(object $request_handler) : void
{
  global $ultrafunk_is_prod_build;
  $home_url = get_cached_home_url();

  foreach($request_handler->query_data as $track)
  {
    $track_artist     = esc_html($track->track_artist);
    $track_title      = esc_html($track->track_title);
    $track_duration   = intval($track->track_duration);
    $track_url        = esc_url("$home_url/track/$track->post_name/");
    $track_data       = get_track_data($track);
    $is_youtube_track = ($track_data['track_type'] === TRACK_TYPE::YOUTUBE);
    $artists          = get_object_term_cache($track->ID, 'uf_artist');
    $channels         = get_object_term_cache($track->ID, 'uf_channel');
    $is_video_class   = is_video($channels) ? ' is-video' : ' is-audio';

    ?>
    <div id="<?php echo uniqid(); ?>" class="track-entry <?php echo $track_data['css_class'] . $is_video_class; ?>"
      data-track-id="track-<?php echo $track->ID; ?>"
      data-track-artist="<?php echo $track_artist; ?>"
      data-track-title="<?php echo $track_title; ?>"
      data-track-duration="<?php echo $track_duration; ?>"
      data-track-url="<?php echo $track_url; ?>"
      data-track-type="<?php echo $track_data['track_type']; ?>"
      data-track-thumbnail-url="<?php echo $track_data['thumnail_src']; ?>"
      <?php if ($is_youtube_track) { ?>
        data-track-source-uid="<?php echo $track_data['source_uid']; ?>"
      <?php } ?>
      >
      <div class="track-artists-links"><?php term_links($artists, 'artist', (int)$track->track_artist_id); ?></div>
      <div class="track-channels-links"><?php term_links($channels, 'channel'); ?></div>
      <div class="track-details">
        <div class="thumbnail" <?php echo ($is_youtube_track ? 'title="Play Track"' : 'title="SoundCloud Track"'); ?>>
          <?php if ($ultrafunk_is_prod_build) { ?>
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
          <div class="remove-button" title="Remove Track from List"><span class="material-icons">clear</span></div>
          <?php if ($is_youtube_track) { ?>
            <div class="play-next-button" title="Play Next"><span class="material-icons">playlist_play</span></div>
          <?php } ?>
          <div class="share-play-button" title="Share Track / Play On"><span class="material-icons">share</span></div>
          <div class="details-button" title="Track Details"><span class="material-icons-outlined">info</span></div>
        </div>
        <div class="track-actions-toggle" title="Show / Hide track actions"><span class="material-icons">more_horiz</span></div>
      </div>
      <div class="track-duration text-nowrap-ellipsis"><?php echo ($is_youtube_track ? getTimeString($track_duration) : 'N / A'); ?></div>
    </div>
    <?php
  }
}
