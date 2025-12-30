<?php declare(strict_types=1);
/*
 * Settings page template
 *
 */


namespace Ultrafunk\Theme\Templates\Settings;


/**************************************************************************************************************************/
if (!defined('ABSPATH')) exit;
/**************************************************************************************************************************/


?>
<article id="post-<?php the_ID(); ?>" class="">
  <header class="entry-header">
    <?php \Ultrafunk\Theme\Tags\entry_title(); ?>
  </header>
  <div class="entry-content">
    <?php the_content(); ?>
    <noscript><center><h3>Settings requires JavaScript to be enabled!</h3></center></noscript>
    <div id="settings-container"></div>
    <div id="settings-save-reset">
      <button type="button" class="settings-save-button disabled" title="Save all settings"><span class="material-icons">save</span>Save</button>
      <button type="button" class="settings-reset-button" title="Reset all settings"><span class="material-icons">restart_alt</span>Reset</button>
    </div>
  </div>
</article>
