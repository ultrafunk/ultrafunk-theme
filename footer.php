<?php declare(strict_types=1);
/*
 * Footer template
 *
 */

?>

</main>

<footer id="site-footer">
  <div class="site-footer-container">
    <div class="footer-settings">
      <a href="/settings/" id="footer-settings-button" title="Playback and Site Settings">
        <span class="label">Settings</span><span class="material-icons">settings</span>
      </a>
      <a href="<?php echo (\Ultrafunk\Plugin\Globals\is_list_player() ? '/' : '/list/'); ?>" id="footer-player-type-toggle" title="Gallery or List Player (p)">
        <span class="label">Pref. Player</span><span class="value">...</span>
      </a>
      <div id="footer-autoplay-toggle" title="Toggle Autoplay On / Off (shift + a)">
        <span class="label">Autoplay</span><span class="value">...</span>
      </div>
      <div id="footer-crossfade-toggle" title="Toggle Auto Crossfade On / Off (x)">
        <span class="label">Auto Crossfade</span><span class="value">...</span>
      </div>
      <div id="footer-site-theme-toggle" title="Light, Dark or Automatic theme (shift + t)">
        <span class="label">Theme</span><span class="value">...</span>
      </div>
      <div id="footer-gallery-layout-toggle" title="Gallery Player: 1, 2 or 3 / 4 column layout (shift + l)">
        <span class="label">Gallery</span><span class="value">...</span>
      </div>
    </div>
    <div class="footer-site-info">
      <a href="/channels/"><b>View Channels</b></a><br>
      <a href="/artists/"><b>View Artists</b></a>
      <div class="footer-site-info-block">
        <a href="/about/">About</a><br>
        <a href="/help/">Help</a><br>
        <a href="/privacy-policy/">Privacy Policy</a><br>
        <a href="mailto:contact@ultrafunk.com">Contact</a><br>
        <a href="https://github.com/ultrafunk/">GitHub</a>
      </div>
    </div>
    <div class="footer-logo">
      <a href="<?php echo \Ultrafunk\Plugin\Globals\get_cached_home_url('/'); ?>" aria-label="Home"><img src="<?php echo esc_url(get_theme_mod('ultrafunk_footer_logo')); ?>" loading="lazy" alt=""></a>
    </div>
  </div>
</footer>

<div id="nav-menu-modal-overlay"></div>

<?php wp_footer(); ?>

</body>
</html>

<?php \Ultrafunk\Theme\Tags\perf_results(); ?>
