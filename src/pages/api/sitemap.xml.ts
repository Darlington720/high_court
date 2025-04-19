import generateSitemap from "../../utils/generateSitemap";


export default async function handler(req: any, res: any) {
  try {
    const sitemap = await generateSitemap();
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}