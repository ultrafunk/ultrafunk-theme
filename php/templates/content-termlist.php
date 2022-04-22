<?php declare(strict_types=1);
/*
 * Termlist template
 *
 */


namespace Ultrafunk\Theme\Templates\Termlist;


use function Ultrafunk\Plugin\Globals\ {
  is_termlist,
  get_cached_home_url,
};


/**************************************************************************************************************************/


function render_template(object $request_handler) : void
{
  if (is_termlist('artists'))
  {
    ?><div class="artist-letters-container"><?php

    foreach($request_handler->letters_range as $letter)
    {
      ?>
      <div class="entry-content artist-letter <?php echo ($request_handler->first_letter === $letter) ? 'current' : ''; ?>">
        <a href="/artists/<?php echo $letter; ?>/"><?php echo $letter; ?></a>
      </div>
      <?php
    }    

    ?></div><?php
  }

  if (!empty($request_handler->query_result))
  {
    ?>
    <term-list id="termlist-container" class="entry-content <?php echo "term-$request_handler->term_type"; ?>" data-term-type="<?php echo $request_handler->term_type; ?>">
      <?php if (is_termlist('channels')) { ?>
        <div class="termlist-title"><b>All Channels</b> (tracks)</div>
      <?php } ?>
      <?php termlist_entries($request_handler); ?>
    </term-list>
    <?php
  //\Ultrafunk\Plugin\Shared\request_pagination($request_handler);
  }
}

function termlist_entries(object $request_handler) : void
{
  $odd_even  = is_termlist('artists') ? 1 : 0;
  $home_url  = get_cached_home_url();
  $term_path = $request_handler->term_path;

  foreach($request_handler->query_result as $term)
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
            data-term-url="<?php echo "$home_url/$term_path/$term_slug/"; ?>">
            <span class="material-icons">share</span>
          </div>
          <div class="expand-toggle" title="Show more or less"><span class="material-icons">expand_more</span></div>
        </div>
      </div>
      <div class="termlist-body <?php echo $row_class; ?>">
        <div class="body-left">
          <?php echo (is_termlist('artists') ? '<b>All Tracks</b>' : '<b>Latest Tracks</b>'); ?>
          <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
        </div>
        <div class="body-right">
          <div class="permalink"><b>Permalink</b><br><a href="<?php echo "/$term_path/$term_slug/"; ?>"><?php echo $term_name?></a></div>
          <?php if (is_termlist('artists')) { ?>
            <div class="artists"><b>Related Artists</b>
              <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
            </div>
            <div class="channels"><b>In Channels</b>
              <div class="loader-container"><div class="loader-1">&#8226;</div><div class="loader-2">&#8226;</div><div class="loader-3">&#8226;</div></div>
            </div>
          <?php } ?>
        </div>
      </div>
    </div>
    <?php
  }
}
