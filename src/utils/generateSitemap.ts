import { supabase } from '../lib/supabase';

async function generateSitemap() {
  const baseUrl = 'https://educitevl.edu.ug';
  
  // Get all public documents
  const { data: documents } = await supabase
    .from('documents')
    .select('id, title, created_at, category, subcategory')
    .eq('status', 'active')
    .is('is_private', false);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      <!-- Static Routes -->
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      
      <!-- Dynamic Document Routes -->
      ${documents?.map(doc => `
        <url>
          <loc>${baseUrl}/${doc.category.toLowerCase()}/${doc.id}</loc>
          <lastmod>${new Date(doc.created_at).toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`;

  return sitemap;
}

export default generateSitemap;