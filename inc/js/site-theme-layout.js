//
// Inline <head> set <html> site theme and layout classes to prevent FOUC:
// * <html class="site-theme-black">
// * <html class="gallery-layout site-theme-black gallery-3-col">
//
// https://ultrafunk.com
//


setThemeAndLayout();


/*************************************************************************************************/


function setThemeAndLayout()
{
  const classList      = document.documentElement.classList;
  const siteTheme      = localStorage.getItem('uf_site_theme');
  let   siteThemeClass = 'site-theme-light';

  if (siteTheme !== null)
  {
    if (siteTheme === 'light')
      siteThemeClass = 'site-theme-light';
    else if (siteTheme === 'dark')
      siteThemeClass = 'site-theme-dark'
    else if (siteTheme === 'black')
      siteThemeClass = 'site-theme-black'
  }

  classList.add(siteThemeClass);

  if (classList.contains('gallery-layout'))
  {
    const galleryLayout      = localStorage.getItem('uf_gallery_layout');
    let   galleryLayoutClass = 'gallery-3-col';

    if (galleryLayout !== null)
    {
      if (galleryLayout === '1-column')
        galleryLayoutClass = 'gallery-1-col';
      else if (galleryLayout === '2-column')
        galleryLayoutClass = 'gallery-2-col';
    }

    if (window.innerWidth > 1100)
      classList.add(galleryLayoutClass);
    else
      classList.add('gallery-1-col');
  }
}
