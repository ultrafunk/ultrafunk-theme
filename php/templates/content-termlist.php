<?php declare(strict_types=1);
/*
 * Termlist template class
 *
 */


namespace Ultrafunk\Theme\Templates;


use function Ultrafunk\Plugin\Shared\Utils\get_channels_top_artists_info;


/**************************************************************************************************************************/


final class Termlist extends \Ultrafunk\Theme\Templates\TemplateBase
{
  private bool  $is_artists = false;
  private array $terms_list = [];

  protected function render_response() : void
  {
    $this->is_artists = \Ultrafunk\Plugin\Globals\is_termlist('artists');

    if ($this->is_artists)
      $this->artist_letters();

    ?>
    <term-list id="termlist-container"
      class="<?php echo "term-{$this->params->query_vars['term_type']}"; ?>"
      data-term-type="<?php echo $this->params->query_vars['term_type']; ?>"
      >
      <?php if ($this->is_artists === false) { ?>
        <div class="termlist-title"><b>All Channels</b> (<?php echo get_channels_top_artists_info()['all_tracks_count']; ?> tracks)</div>
      <?php } ?>
      <?php $this->termlist_entries(); ?>
    </term-list>
    <?php

    if ($this->is_artists)
      echo '<script> const termsListArray = ' . \json_encode($this->terms_list) . '</script>';
  }


  /**************************************************************************************************************************/


  private function termlist_entries() : void
  {
    $term_path = $this->params->query_vars['term_path'];

    foreach($this->query_result as $term)
    {
      $term_name = esc_html($term->name);
      $term_slug = esc_html($term->slug);
      $this->terms_list[] = ['name' => $term->name, 'id' => "term-$term->term_id"];

      ?>
      <div id="<?php echo "term-$term->term_id"; ?>" class="termlist-entry" data-term-id="<?php echo $term->term_id; ?>" data-term-slug="<?php echo $term_slug; ?>">
        <div class="termlist-header" data-click-id="termlist-header-toggle" title="Show more or less">
          <div class="termlist-name text-nowrap-ellipsis"><?php echo "$term_name <span class='light-text'>($term->count)</span>"; ?></div>
          <div class="termlist-buttons">
            <button type="button" data-click-id="play-tracks" class="play-button" title="Play All - <?php echo $term_name; ?>">
              <a href="<?php echo "/$term_path/$term_slug/"; ?>" target="_blank"><span class="material-icons">play_arrow</span></a>
            </button>
            <button type="button" data-click-id="shuffle-tracks" class="shuffle-button" title="Shuffle &amp; Play All - <?php echo $term_name; ?>">
              <a href="<?php echo "/shuffle/$term_path/$term_slug/"; ?>" target="_blank"><span class="material-icons">shuffle</span></a>
            </button>
            <button type="button" data-click-id="share-find" class="share-find-button" title="Share <?php echo $term_name; ?> / Find On"
              data-term-path="<?php echo $term_path; ?>"
              data-term-name="<?php echo $term_name; ?>"
              data-term-url="<?php echo "$this->home_url/$term_path/$term_slug/"; ?>">
              <span class="material-icons">share</span>
            </button>
            <button type="button" data-click-id="termlist-header-toggle" class="expand-toggle" title="Show more or less"><span class="material-icons">expand_more</span></button>
          </div>
        </div>
        <div class="termlist-body">
          <div class="body-left">
            <?php echo ($this->is_artists ? '<b>All Tracks</b>' : '<b>Latest Tracks</b>'); ?>
            <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
          </div>
          <div class="body-right">
            <div class="permalink"><b><?php echo ($this->is_artists ? 'Artist' : 'Channel'); ?> Link</b><br><a href="<?php echo "/$term_path/$term_slug/"; ?>" data-click-id="permalink"><?php echo $term_name; ?></a></div>
            <?php if ($this->is_artists) { ?>
              <div class="artists"><b>Related Artists</b>
                <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
              </div>
              <div class="channels"><b>In Channels</b>
                <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
              </div>
            <?php } else { ?>
              <div class="top-artists text-nowrap-ellipsis"><b>Top Artists (tracks)</b>
                <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
              </div>
            <?php } ?>
          </div>
        </div>
      </div>
      <?php
    }
  }


  /**************************************************************************************************************************/


  private function artist_letters() : void
  {
    ?><div class="artist-letters-container"><?php

    foreach($this->params->query_vars['letters_range'] as $letter)
    {
      ?>
      <div class="artist-letter <?php echo ($this->params->query_vars['first_letter'] === $letter) ? 'current' : ''; ?>">
        <a href="/artists/<?php echo $letter; ?>/"><?php echo $letter; ?></a>
      </div>
      <?php
    }

    ?>
    </div>
    <div class="termlist-filter-container">
      <input type="text" id="termlist-filter-input" minlength="3" placeholder="Filter Artists (min. 3 letters) …" value="">
    </div>
    <?php
  }
}
