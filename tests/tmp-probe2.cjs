const axios = require('axios');
const cheerio = require('cheerio');
const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const get = (url, opts = {}) => axios.get(url, { headers: H, timeout: 30000, maxRedirects: 5, validateStatus: null, responseType: 'text', transformResponse: x => x, ...opts });

(async () => {
  console.log('--- 1tamilblasters ---');
  for (const url of [
    'https://www.1tamilblasters.blog/wp-json/wp/v2/posts?per_page=3',
    'https://www.1tamilblasters.blog/category/tamil-movies-2026/',
    'https://www.1tamilblasters.blog/category/telugu-movies-2026/',
    'https://www.1tamilblasters.blog/page/2/',
  ]) {
    try {
      const r = await get(url);
      const ct = String(r.headers['content-type']);
      console.log(url, r.status, r.headers['cf-mitigated'] || '', ct.slice(0, 40), String(r.data).length);
      if (ct.includes('json')) console.log('  json head', String(r.data).slice(0, 150));
      if (ct.includes('html')) {
        const $ = cheerio.load(r.data);
        console.log('  title:', $('title').text().trim().slice(0, 70), '| articles', $('article').length, '| h2a', $('h2 a').length);
      }
    } catch (e) { console.log(url, 'ERR', e.message); }
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await get('https://www.1tamilblasters.blog/jailer-2-2026-tamil-2/');
      console.log('tb detail attempt', attempt, r.status, String(r.data).length);
      if (r.status === 200) {
        const $ = cheerio.load(r.data);
        console.log('  title:', $('title').text().trim().slice(0, 90));
        console.log('  h1:', $('h1').first().text().trim());
        console.log('  iframes:', $('iframe').map((i, e) => $(e).attr('src')).get());
        console.log('  content anchors:');
        $('.entry-content a, article a, .post-content a').each((i, e) => {
          const href = $(e).attr('href') || '';
          const text = $(e).text().trim().replace(/\s+/g, ' ');
          if (href && !href.startsWith('#') && !href.includes('1tamilblasters.blog/category')) console.log('   ', text.slice(0, 50), '=>', href.slice(0, 160));
        });
        break;
      }
    } catch (e) { console.log('tb detail attempt', attempt, 'ERR', e.message); }
  }

  console.log('--- hdmovies search routes ---');
  for (const url of [
    'https://hdmovies.life/search?q=jailer',
    'https://hdmovies.life/search/jailer',
    'https://hdmovies.life/movies?search=jailer',
    'https://hdmovies.life/?search=jailer',
    'https://hdmovies.life/api/search?q=jailer',
  ]) {
    try {
      const r = await get(url);
      const $ = cheerio.load(String(r.data));
      console.log(url, r.status, String(r.data).length, '| title:', $('title').text().trim().slice(0, 50), '| movie links', $('a[href*="/movie/"]').length);
    } catch (e) { console.log(url, 'ERR', e.message); }
  }

  console.log('--- hdmovies fast drive chain ---');
  try {
    const r = await get('https://links.hdlinks.online/file/0abyxfe6');
    console.log('hdlinks', r.status, r.request?.res?.responseUrl, String(r.data).length);
    const $ = cheerio.load(String(r.data));
    console.log('title:', $('title').text().trim().slice(0, 80));
    console.log('anchors:', $('a[href]').slice(0, 20).map((i, e) => $(e).attr('href')).get());
    console.log('forms:', $('form').map((i, f) => $(f).attr('action')).get());
    console.log('snippet:', String(r.data).slice(0, 300).replace(/\s+/g, ' '));
  } catch (e) { console.log('hdlinks ERR', e.message); }
})();
