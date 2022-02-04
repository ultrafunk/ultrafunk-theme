<?php declare(strict_types=1);
/*
 * Header template
 *
 */


use \Ultrafunk\Theme\Tags as ultrafunk;


?>
<!doctype html>
<html <?php language_attributes(); ?> class="<?php echo ultrafunk\get_user_layout_class(); ?>">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php
  ultrafunk\pre_wp_head();
  wp_head();
  ultrafunk\head();
  ?>
</head>

<body <?php ultrafunk\body_attributes(); ?>>
<?php wp_body_open(); ?>
<header id="site-header" class="hide-nav-menu">
  <?php ultrafunk\header_progress_controls(); ?>
  <div class="site-header-container">
    <div id="search-container"><?php get_search_form(); ?></div>
    <div class="site-branding-container">
      <?php
      ultrafunk\header_site_branding();
      ultrafunk\header_playback_controls();
      ?>
    </div>
    <nav id="site-navigation" class="main-navigation">
      <?php ultrafunk\header_nav_bars() ?>
      <div class="nav-menu-outer">
        <div class="nav-menu-inner">
          <?php wp_nav_menu([
              'theme_location' => 'primary-menu',
              'item_spacing'   => 'discard',
              'link_before'    => '<span class="menu-item-text">',
              'link_after'     => '</span><span class="menu-item-icon"></span>',
            ]);
          ?>
        </div>
      </div>
    </nav>
  </div>
</header>

<?php ultrafunk\intro_banner(); ?>

<main id="site-content">
