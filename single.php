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
  }
}

get_footer();
