<?php declare(strict_types=1);
/*
 * Theme template base class
 *
 */


namespace Ultrafunk\Theme\Templates;


/**************************************************************************************************************************/


abstract class TemplateBase
{
  protected object $params;
  protected mixed  $query_result;
  protected string $home_url;

  public function __construct(object $request_params, mixed $query_result)
  {
    $this->params       = $request_params;
    $this->query_result = $query_result;
    $this->home_url     = \Ultrafunk\Plugin\Globals\get_cached_home_url();
  }

  public function render() : void
  {
    if (!empty($this->query_result))
      $this->render_response();
  }

  abstract protected function render_response() : void;

  protected function content_pagination() : void
  {
    if ($this->params->max_pages > 1)
    {
      $args = [
        'base'      => "/{$this->params->route_path}/%_%",
        'format'    => 'page/%#%/',
        'total'     => $this->params->max_pages,
        'current'   => $this->params->current_page,
        'type'      => 'list',
        'mid_size'  => 4,
        'prev_text' => '&#10094;&#10094; Prev.',
        'next_text' => 'Next &#10095;&#10095;',
      ];

      ?>
      <nav class="navigation pagination" aria-label="Pagination">
        <h2 class="screen-reader-text">Pagination</h2>
        <div class="nav-links">
          <?php echo paginate_links($args); ?>
        </div>
      </nav>
      <?php
    }
  }
}
