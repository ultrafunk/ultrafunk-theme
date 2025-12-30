<?php declare(strict_types=1);
/*
 * Content cannot be found template
 *
 */


namespace Ultrafunk\Theme\Templates\None;


/**************************************************************************************************************************/
if (!defined('ABSPATH')) exit;
/**************************************************************************************************************************/


?>
<div class="entry-content">
  <?php if (is_search()) { ?>
    <h2 class="entry-header">Sorry, no content matched your search criteria...</h2>
  <?php } else { ?>
    <h2 class="entry-header">Sorry, unable to find the content you were looking for...</h2>
  <?php } ?>
  <?php \Ultrafunk\Theme\Tags\search_form(); ?>
  <p><b>Ultrafunk past projects:</b> ProTracker, Sonitus:fx DX / VST audio plug-ins, Popcorn email client,
  Organic One speaker system, Ultrafunk DSP platform and more can be found here:
  <a href="https://old.ultrafunk.com">https://old.ultrafunk.com</a></p>
</div>

<?php \Ultrafunk\Theme\Tags\content_widgets(); ?>
