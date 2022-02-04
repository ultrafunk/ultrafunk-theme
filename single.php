<?php declare(strict_types=1);
/*
 * Single post template
 *
 */

get_header();

if (have_posts())
{
  while (have_posts())
  {
    the_post();
    get_template_part('php/templates/content', 'track');
    the_post_navigation([
      'prev_text' => '<b>&#10094;&#10094; PREVIOUS TRACK</b><br><span class="prev-track-artist-title">%title</span>',
      'next_text' => '<b>NEXT TRACK &#10095;&#10095;</b><br><span class="next-track-artist-title">%title</span>',
    ]);
  }
}

get_footer(); 
