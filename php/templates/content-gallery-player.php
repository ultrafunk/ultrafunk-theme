<?php declare(strict_types=1);
/*
 * Gallery-player template
 *
 */


namespace Ultrafunk\Theme\Templates\GalleryPlayer;


/**************************************************************************************************************************/


?><gallery-grid><?php

while (have_posts())
{
  the_post();
  get_template_part('php/templates/content', 'gallery-track');
}

?></gallery-grid><?php

\Ultrafunk\Theme\Tags\content_pagination();
