<?php declare(strict_types=1);
/*
 * Main / index template
 *
 */

if (!defined('ABSPATH')) exit;

get_header();

if (have_posts())
  get_template_part('php/templates/content', 'gallery-player');
else
  get_template_part('php/templates/content', 'none');

get_footer();
