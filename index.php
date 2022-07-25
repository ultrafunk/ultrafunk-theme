<?php declare(strict_types=1);
/*
 * Main / index template
 *
 */

if (!defined('ABSPATH')) exit;

get_header();

if (have_posts())
{
  ?><gallery-grid><?php

  while (have_posts())
  {
    the_post();
    get_template_part('php/templates/content', 'gallery-track');
  }

  ?></gallery-grid><?php
  
  \Ultrafunk\Theme\Tags\content_pagination();
}
else
{
  get_template_part('php/templates/content', 'none');
}

get_footer(); 
