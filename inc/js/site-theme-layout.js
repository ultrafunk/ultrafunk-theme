//
// Inline <head> set <html> site theme and layout classes to prevent FOUC:
// * <html class="site-theme-black">
// * <html class="gallery-layout site-theme-black gallery-3-col">
//
// https://ultrafunk.com
//

const classList         = document.documentElement.classList;
const UF_SiteTheme      = localStorage.getItem('uf_site_theme');
let   UF_SiteThemeClass = 'site-theme-light';

if (UF_SiteTheme !== null)
{
  if (UF_SiteTheme === 'light')
    UF_SiteThemeClass = 'site-theme-light';
  else if (UF_SiteTheme === 'dark')
    UF_SiteThemeClass = 'site-theme-dark'
  else if (UF_SiteTheme === 'black')
    UF_SiteThemeClass = 'site-theme-black'
}

classList.add(UF_SiteThemeClass);

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
