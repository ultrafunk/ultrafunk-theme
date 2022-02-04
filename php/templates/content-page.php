<?php declare(strict_types=1);
/*
 * Page template
 *
 */


namespace Ultrafunk\Theme\Templates\Page;


?>

<article id="post-<?php the_ID(); ?>" class="">
  <header class="entry-header">
    <?php \Ultrafunk\Theme\Tags\entry_title(); ?>
    <div class="entry-meta">
    </div>
  </header>
  <div class="entry-content">
    <?php
    if (is_search() && ($wp_query->post_count > 1))
      \Ultrafunk\Theme\Tags\content_excerpt();
    else
      the_content();
    ?>
  </div>
</article>
