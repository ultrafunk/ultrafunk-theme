<?php declare(strict_types=1);
/*
 * Settings page template
 *
 */


namespace Ultrafunk\Theme\Templates\Settings;


/**************************************************************************************************************************/


$version      = \Ultrafunk\Theme\Constants\VERSION;
$template_uri = esc_url(get_template_directory_uri());

?>
<script type="module"   src='<?php echo $template_uri . '/js/src/shared/settings/settings-ui.js?ver='  . $version; ?>'></script>
<link rel="stylesheet" href='<?php echo $template_uri . '/js/src/shared/settings/settings-ui.css?ver=' . $version; ?>' media='all' />

<article id="post-<?php the_ID(); ?>" class="">
  <header class="entry-header">
    <?php \Ultrafunk\Theme\Tags\entry_title(); ?>
  </header>
  <div class="entry-content">
    <?php the_content(); ?>
    <div id="settings-container"></div>
    <div id="settings-save-reset">
      <div class="settings-save">Save Settings</div>
      <div class="settings-reset">Reset Settings</div>
    </div>
  </div>
</article>
