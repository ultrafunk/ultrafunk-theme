<?php declare(strict_types=1);
/*
 * Theme setup and customization
 *
 */

//
// Theme setup
//
function ultrafunk_theme_setup() : void
{
  register_nav_menus(['primary-sections' => "Primary Sections Menu"]);
  register_nav_menus(['primary-channels' => "Primary Channels Menu"]);

  add_theme_support('html5', ['search-form', 'script', 'style']);
  add_theme_support('title-tag');
  add_theme_support('custom-logo');

  // Needed to disable: REQUIRED This theme text domain does not match the theme's slug.
  __('', 'ultrafunk');
}
add_action('after_setup_theme', 'ultrafunk_theme_setup');

//
// Add custom footer logo
//
function ultrafunk_customizer_setting(object $wp_customize) : void
{
  $wp_customize->add_setting('ultrafunk_footer_logo', ['sanitize_callback' => 'esc_url_raw']);

  $customize_options = [
    'label'    => 'Footer Logo',
    'section'  => 'title_tagline',
    'settings' => 'ultrafunk_footer_logo',
    'priority' => 8,
  ];

  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'ultrafunk_footer_logo', $customize_options));
}
add_action('customize_register', 'ultrafunk_customizer_setting');

//
// Add theme taxonomy widget
//
function ultrafunk_widgets_init() : void
{
  register_sidebar([
      'name'          => 'Content widgets',
      'id'            => 'content-widgets-1',
      'before_widget' => '<section id="%1$s" class="widget %2$s">',
      'after_widget'  => '</section>',
      'before_title'  => '<h2 class="widget-title">',
      'after_title'   => '</h2>',
    ]
  );
}
add_action('widgets_init', 'ultrafunk_widgets_init');

//
// Limit number of entries shown by the built-in Archive widget
//
function ultrafunk_limit_archives(array $args) : array
{
  $args['limit'] = 15;
  return $args;
}
add_filter('widget_archives_args', 'ultrafunk_limit_archives');

//
// Enqueue styles
//
function ultrafunk_enqueue_styles() : void
{
  $version   = \Ultrafunk\Theme\Config\VERSION;
  $theme_uri = get_theme_file_uri();

  wp_enqueue_style('google-fonts-roboto',         'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;700&display=swap',                                  [], null);
  wp_enqueue_style('google-fonts-material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Sharp&display=block', [], null);

  if (\Ultrafunk\Theme\Config\IS_PROD_BUILD)
  {
    wp_enqueue_style('ultrafunk-style', $theme_uri . '/inc/css/style.min.css',      [], $version);
    wp_enqueue_style('bundle-style',    $theme_uri . '/js/dist/css/bundle.min.css', [], $version);
  }
  else
  {
    wp_enqueue_style('ultrafunk-style',          get_stylesheet_uri(),                                         [], $version);
    wp_enqueue_style('modal-style',              $theme_uri . '/js/src/shared/modal.css',                      [], $version);
    wp_enqueue_style('snackbar-style',           $theme_uri . '/js/src/shared/snackbar.css',                   [], $version);
    wp_enqueue_style('settings-ui-style',        $theme_uri . '/js/src/settings/settings-ui.css',              [], $version);
    wp_enqueue_style('playback-controls-style',  $theme_uri . '/js/src/playback/common/playback-controls.css', [], $version);
    wp_enqueue_style('track-modals-style',       $theme_uri . '/js/src/playback/common/track-modals.css',      [], $version);
    wp_enqueue_style('gallery-controls-style',   $theme_uri . '/js/src/playback/gallery/gallery-controls.css', [], $version);
    wp_enqueue_style('gallery-track-style',      $theme_uri . '/js/src/playback/gallery/gallery-track.css',    [], $version);
    wp_enqueue_style('gallery-player-style',     $theme_uri . '/js/src/playback/gallery/gallery-player.css',   [], $version);
    wp_enqueue_style('single-track-style',       $theme_uri . '/js/src/playback/gallery/single-track.css',     [], $version);
    wp_enqueue_style('list-player-style',        $theme_uri . '/js/src/playback/list/list-player.css',         [], $version);
    wp_enqueue_style('track-controls-style',     $theme_uri . '/js/src/playback/list/track-controls.css',      [], $version);
    wp_enqueue_style('track-search-style',       $theme_uri . '/js/src/playback/list/track-search.css',        [], $version);
    wp_enqueue_style('up-next-modal-style',      $theme_uri . '/js/src/playback/list/up-next-modal.css',       [], $version);
    wp_enqueue_style('artists-channels-style',   $theme_uri . '/js/src/site/artists-channels.css',             [], $version);
  }
}
add_action('wp_enqueue_scripts', 'ultrafunk_enqueue_styles');


/**************************************************************************************************************************/


//
// Load Ultrafunk theme files, skip if (WP_INSTALLING  === true) because plugins are NOT loaded,
// and this theme needs stuff from the Ultrafunk plugin to work!
//
if (defined('WP_INSTALLING') && WP_INSTALLING)
{
  return;
}
else
{
  // Check if the needed (companion) Ultrafunk plugin is installed and active
  if (defined('\Ultrafunk\Plugin\Config\VERSION') === false)
  {
    if (is_admin())
    {
      add_action('admin_notices', function()
      {
        ?>
        <div class="notice notice-warning is-dismissible">
          <p>The <b><a href="https://github.com/ultrafunk/ultrafunk-theme/">Ultrafunk theme</a></b> requires the
          <b><a href="https://github.com/ultrafunk/ultrafunk-plugin/">Ultrafunk plugin</a></b> to function!
          <a href="/wp-admin/plugins.php">Show installed plugins</a></p>
        </div>
        <?php
      });
    }
    else
    {
      add_filter('wp_php_error_message', function(string $message) : string
      {
        return $message . '<p>The <b><a href="https://github.com/ultrafunk/ultrafunk-theme/">Ultrafunk theme</a></b> requires the
                           <b><a href="https://github.com/ultrafunk/ultrafunk-plugin/">Ultrafunk plugin</a></b> to function!';
      }, 10, 1);
    }
  }
  else
  {
    require get_template_directory() . '/php/config.php';
    require get_template_directory() . '/php/theme-widgets.php';

    if (is_admin() === false)
    {
      require get_template_directory() . '/php/theme-functions.php';
      require get_template_directory() . '/php/theme-filters.php';
      require get_template_directory() . '/php/theme-tags.php';
      require get_template_directory() . '/php/templates/template-base.php';
    }
  }
}
