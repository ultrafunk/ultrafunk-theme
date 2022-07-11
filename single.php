<?php declare(strict_types=1);
/*
 * Single track template
 *
 */

get_header();

if (have_posts())
{
  while (have_posts())
  {
    the_post();
    get_template_part('php/templates/content', 'single-track');

    ?>
    <nav class="navigation track-navigation" aria-label="Tracks">
      <h2 class="screen-reader-text">Track navigation</h2>
      <div class="nav-links">
        <?php
        \Ultrafunk\Theme\Tags\single_track_nav_link(true,  get_next_post());
        \Ultrafunk\Theme\Tags\single_track_nav_link(false, get_previous_post());
        ?>
      </div>
    </nav>
    <?php
  }
}

get_footer(); 
