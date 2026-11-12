const axios = require('axios');
const cheerio = require('cheerio');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'Accept-Language':'en-US,en;q=0.9'};
(async () => {
  const r = await axios.get('https://www.1tamilblasters.blog/jailer-2-2026-tamil-2/', {headers:H, responseType:'text', transformResponse:x=>x});
  const $ = cheerio.load(r.data);
  $('.entry-content a').each((i, e) => {
    const href = $(e).attr('href') || '';
    const text = $(e).text().trim().replace(/\s+/g, ' ');
    if (text.includes('⬇')) {
      console.log('TEXT:', text);
      console.log('HREF:', href);
      console.log();
    }
  });
  // WP REST search inspection
  const s = await axios.get('https://www.1tamilblasters.blog/wp-json/wp/v2/posts?search=jailer&per_page=5', {headers:H, responseType:'text', transformResponse:x=>x, validateStatus:null});
  console.log('REST status', s.status, 'type', typeof s.data, 'head', String(s.data).slice(0,300));
})();
