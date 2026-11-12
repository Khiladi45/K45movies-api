const axios = require('axios');
const cheerio = require('cheerio');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36','Accept-Language':'en-US,en;q=0.9'};
const get = (url) => axios.get(url, { headers: H, timeout: 40000, maxRedirects: 5, validateStatus: null, responseType: 'text', transformResponse: x => x });

(async () => {
  // 1tamilblasters categories from WP REST
  try {
    const cats = await get('https://www.1tamilblasters.blog/wp-json/wp/v2/categories?per_page=100');
    const list = JSON.parse(cats.data);
    console.log('TB CATEGORIES:', list.map(c => `${c.slug}(${c.count})`).join(', '));
  } catch (e) { console.log('cats ERR', e.message); }

  // 1tamilblasters search REST with embed
  try {
    const s = await get('https://www.1tamilblasters.blog/wp-json/wp/v2/posts?search=jailer&per_page=3&_embed=1');
    const list = JSON.parse(s.data);
    console.log('TB SEARCH count', list.length);
    list.forEach(p => console.log('  ', p.title?.rendered, '|', p.link, '| img', p._embedded?.['wp:featuredmedia']?.[0]?.source_url));
  } catch (e) { console.log('search ERR', e.message); }

  // 1tamilblasters series detail
  for (const url of [
    'https://www.1tamilblasters.blog/celebrity-master-chef-2026-s01-ep-01-02-tamil/',
    'https://www.1tamilblasters.blog/bigg-boss-tamil-2026-s010-ep01-day-00/',
  ]) {
    try {
      const r = await get(url);
      const $ = cheerio.load(r.data);
      console.log('\nTB SERIES', url, r.status);
      console.log(' title:', $('title').text().trim().slice(0, 90));
      console.log(' iframes:', $('iframe').map((i, e) => $(e).attr('src')).get());
      console.log(' download anchors:');
      $('.entry-content a').each((i, e) => {
        const href = $(e).attr('href') || '';
        const text = $(e).text().trim().replace(/\s+/g, ' ');
        if (text.includes('⬇') || /\.(mkv|mp4)/i.test(href)) console.log('   ', text.slice(0, 100), '=>', href.slice(0, 120));
      });
      console.log(' content text:', $('.entry-content').text().replace(/\s+/g, ' ').slice(0, 500));
    } catch (e) { console.log('TB SERIES ERR', url, e.message); }
  }

  // luluvido unpack test
  try {
    const r = await get('https://luluvido.com/e/yl7v9df499i0');
    console.log('\nLULU', r.status, String(r.data).length, 'packed', String(r.data).includes('eval(function(p,a,c,k'));
    const m = String(r.data).match(/file\s*:\s*["']([^"']+)["']/i);
    console.log(' file regex:', m ? m[1].slice(0, 120) : 'none');
    const src = String(r.data).match(/<title[^>]*>([^<]*)<\/title>/i);
    console.log(' title:', src ? src[1] : 'none');
  } catch (e) { console.log('LULU ERR', e.message); }

  // hdmovies pagination + series detail
  for (const url of ['https://hdmovies.life/movies', 'https://hdmovies.life/series', 'https://hdmovies.life/series/visionquest-2026', 'https://hdmovies.life/movie/the-odyssey-2026']) {
    try {
      const r = await get(url);
      const $ = cheerio.load(r.data);
      console.log('\nHDM', url, r.status, 'bytes', String(r.data).length);
      console.log(' title:', $('title').text().trim().slice(0, 80));
      console.log(' pagination:', $('a[href*="page"]').map((i, e) => $(e).attr('href')).get().slice(0, 8));
      console.log(' iframes:', $('iframe').map((i, e) => $(e).attr('src')).get().slice(0, 5));
      if (url.includes('/series/')) {
        console.log(' download cards:', $('.blog-dl-card').length);
        console.log(' episode links:', $('a[href*="/series/"]').map((i, e) => `${$(e).text().trim().slice(0, 40)}=>${$(e).attr('href')}`).get().slice(0, 15));
        console.log(' body text:', $('body').text().replace(/\s+/g, ' ').slice(0, 600));
      }
    } catch (e) { console.log('HDM ERR', url, e.message); }
  }
})();
