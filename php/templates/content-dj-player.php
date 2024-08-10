<?php declare(strict_types=1);
/*
 * DJ-player template class
 *
 */


namespace Ultrafunk\Theme\Templates;


/**************************************************************************************************************************/


class DJPlayer extends \Ultrafunk\Theme\Templates\TemplateBase
{
  protected function render_response() : void
  {
    $stylesheet_href = get_theme_file_uri('/php/templates/content-dj-player.css?ver=') . \Ultrafunk\Theme\Config\VERSION;
    $iframe_src      = \Ultrafunk\Plugin\Config\PLUGIN_ENV['site_url'] . '/list/'

    ?>
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name='robots' content='noindex, nofollow' />
      <title>Ultrafunk DJ Player</title>
      <link rel='stylesheet' id='content-dj-player-style' href='<?php echo $stylesheet_href; ?>' media='all' />
    </head>
    <body>
      <div id="dj-players-container">
        <div id="player-left-container"> <iframe id="player-left"  src="<?php echo $iframe_src; ?>" title="DJ player left"></iframe></div>
        <div id="player-right-container"><iframe id="player-right" src="<?php echo $iframe_src; ?>" title="DJ player right"></iframe></div>
      </div>
    </body>
    </html>
    <?php
  }
}
