const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'};

const targets = [
  ['tb-detail', 'https://www.1tamilblasters.blog/jailer-2-2026-tamil-2/'],
  ['tb-search', 'https://www.1tamilblasters.blog/?s=jailer+2'],
  ['tb-cat', 'https://www.1tamilblasters.blog/category/tamil-hd-movies/'],
  ['hdm-movies', 'https://hdmovies.life/movies'],
  ['hdm-detail', 'https://hdmovies.life/movie/jailer-2-2026'],
  ['hdm-search', 'https://hdmovies.life/?s=jailer'],
  ['hdm-series', 'https://hdmovies.life/series'],
];

(async () => {
  for (const [name, url] of targets) {
    try {
      const r = await axios.get(url, { headers: H, timeout: 30000, responseType: 'text', transformResponse: x => x, maxRedirects: 5, validateStatus: null });
      const body = String(r.data || '');
      fs.writeFileSync(`tests/tmp-${name}.html`, body);
      const $ = cheerio.load(body);
      console.log('===', name, url, 'status', r.status, 'final', r.request?.res?.responseUrl, 'bytes', body.length);
      console.log('title:', $('title').text().trim().slice(0, 100));
      if (name === 'tb-detail' || name === 'hdm-detail') {
        console.log('iframes:', $('iframe').map((i, e) => $(e).attr('src')).get());
        console.log('entry-content anchors:');
        $('.entry-content a, article a').each((i, e) => {
          const href = $(e).attr('href') || '';
          const text = $(e).text().trim().replace(/\s+/g, ' ');
          if (href && !href.startsWith('#')) console.log('  ', text.slice(0, 60), '=>', href.slice(0, 140));
        });
      } else {
        console.log('posts:', $('article').length, $('h2 a').length, 'movie links:', $('a[href*="/movie/"]').length);
        $('h2 a, h3 a').slice(0, 10).each((i, e) => console.log('  ', $(e).text().trim().slice(0, 60), '=>', $(e).attr('href')));
      }
      console.log();
    } catch (e) {
      console.log('ERR', name, e.message);
    }
  }
})();
