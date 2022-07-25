<?php declare(strict_types=1);
/*
 * Theme template base class
 *
 */


namespace Ultrafunk\Theme\Templates;


/**************************************************************************************************************************/


abstract class Base
{
  protected ?object $request  = null;
  protected ?string $home_url = null;

  public function __construct(object $request_handler)
  {
    $this->request  = $request_handler;
    $this->home_url = \Ultrafunk\Plugin\Globals\get_cached_home_url();
  }

  public function render() : void
  {
    if (!empty($this->request->query_result))
      $this->render_response();
  }

  abstract function render_response() : void;

  protected function content_pagination() : void
  {
    if (isset($this->request->max_pages) && ($this->request->max_pages > 1))
    {
      $args = [
        'base'      => "/{$this->request->route_path}/%_%",
        'format'    => 'page/%#%/',
        'total'     => $this->request->max_pages,
        'current'   => $this->request->current_page,
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
