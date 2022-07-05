<?php declare(strict_types=1);
/*
 * Termlist template class
 *
 */


namespace Ultrafunk\Theme\Templates;


/**************************************************************************************************************************/


class Termlist extends \Ultrafunk\Theme\Templates\Base
{
  private $is_artists = false;

  public function render_response() : void
  {
    $this->is_artists = \Ultrafunk\Plugin\Globals\is_termlist('artists');

    if ($this->is_artists)
      $this->artist_letters('header');

    ?>
    <term-list id="termlist-container"
      class="entry-content <?php echo "term-{$this->request->term_type}"; ?>"
      data-term-type="<?php echo $this->request->term_type; ?>"
      >
      <?php if ($this->is_artists === false) { ?>
        <div class="termlist-title"><b>All Channels</b> (tracks)</div>
      <?php } ?>
      <?php $this->termlist_entries(); ?>
    </term-list>
    <?php

    if ($this->is_artists && (count($this->request->query_result) > 30))
      $this->artist_letters('footer');
  }
  

  /**************************************************************************************************************************/


  private function termlist_entries() : void
  {
    $odd_even  = $this->is_artists ? 1 : 0;
    $term_path = $this->request->term_path;
  
    foreach($this->request->query_result as $term)
    {
      $row_class = (($odd_even++ % 2) === 1) ? 'odd' : 'even';
      $term_name = esc_html($term->name);
      $term_slug = esc_html($term->slug);
  
      ?>
      <div id="<?php echo "term-$term->term_id"; ?>" class="termlist-entry" data-term-id="<?php echo $term->term_id; ?>" data-term-slug="<?php echo $term_slug; ?>">
        <div class="termlist-header <?php echo $row_class; ?>" title="Show more or less">
          <div class="termlist-name"><?php echo "$term_name <span class='light-text'>($term->count)</span>"; ?></div>
          <div class="termlist-icons">
            <div class="play-button" title="Play All - <?php echo $term_name; ?>">
              <a href="<?php echo "/$term_path/$term_slug/"; ?>" target="_blank"><span class="material-icons">play_arrow</span></a>
            </div>
            <div class="shuffle-button" title="Shuffle &amp; Play All - <?php echo $term_name; ?>">
              <a href="<?php echo "/shuffle/$term_path/$term_slug/"; ?>" target="_blank"><span class="material-icons">shuffle</span></a>
            </div>
            <div class="share-find-button" title="Share <?php echo $term_name; ?> / Find On"
              data-term-path="<?php echo $term_path; ?>"
              data-term-name="<?php echo $term_name; ?>"
              data-term-url="<?php echo "$this->home_url/$term_path/$term_slug/"; ?>">
              <span class="material-icons">share</span>
            </div>
            <div class="expand-toggle" title="Show more or less"><span class="material-icons">expand_more</span></div>
          </div>
        </div>
        <div class="termlist-body <?php echo $row_class; ?>">
          <div class="body-left">
            <?php echo ($this->is_artists ? '<b>All Tracks</b>' : '<b>Latest Tracks</b>'); ?>
            <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
          </div>
          <div class="body-right">
            <div class="permalink"><b><?php echo ($this->is_artists ? 'Artist' : 'Channel'); ?> Link</b><br><a href="<?php echo "/$term_path/$term_slug/"; ?>"><?php echo $term_name; ?></a></div>
            <?php if ($this->is_artists) { ?>
              <div class="artists"><b>Related Artists</b>
                <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
              </div>
              <div class="channels"><b>In Channels</b>
                <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
              </div>
            <?php } else { ?>
              <div class="top-artists"><b>Top Artists (tracks)</b>
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
  
  
  private function artist_letters(string $letters_class = '') : void
  {
    ?><div class="artist-letters-container <?php echo 'artist-letters-' . $letters_class; ?>"><?php
  
    foreach($this->request->letters_range as $letter)
    {
      ?>
      <div class="entry-content artist-letter <?php echo ($this->request->first_letter === $letter) ? 'current' : ''; ?>">
        <a href="/artists/<?php echo $letter; ?>/"><?php echo $letter; ?></a>
      </div>
      <?php
    }    
  
    ?></div><?php
  }
}
