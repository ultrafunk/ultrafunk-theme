<?php declare(strict_types=1);
/*
 * Search template
 *
 */

get_header();

if (have_posts())
{
  while (have_posts())
  {
    the_post();
    get_template_part('php/templates/content', (get_post_type() === 'uf_track') ? 'gallery-track' : 'page');
  }
  
  \Ultrafunk\Theme\Tags\content_pagination();
}
else
{
  get_template_part('php/templates/content', 'none');
}

get_footer(); 
