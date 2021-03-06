<?php declare(strict_types=1);
/*
 * Page template
 *
 */

get_header();

if (have_posts())
{
  while (have_posts())
  {
    the_post();
    get_template_part('php/templates/content', ($post->post_name === 'settings') ? 'settings' : 'page');
  }
}

get_footer();
