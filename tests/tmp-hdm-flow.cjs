const axios = require('axios');
const cheerio = require('cheerio');
const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

(async () => {
  // 1. hdmovies search form
  const home = await axios.get('https://hdmovies.life/', { headers: H, responseType: 'text', transformResponse: x => x });
  const $ = cheerio.load(home.data);
  console.log('forms:');
  $('form').each((i, f) => console.log(' ', $(f).attr('action'), '|', $(f).attr('method'), '|', $(f).find('input').map((j, e) => $(e).attr('name')).get().join(',')));
  console.log('search anchors:', $('a[href*="search"]').map((i, e) => $(e).attr('href')).get());

  // 2. POST download form for Jailer 480p Quick Download
  const detail = await axios.get('https://hdmovies.life/movie/jailer-2-2026', { headers: H, responseType: 'text', transformResponse: x => x });
  const $d = cheerio.load(detail.data);
  const form = $d('form.dl-post-form').first();
  const payload = {};
  form.find('input[name]').each((i, e) => { payload[$(e).attr('name')] = $(e).val(); });
  console.log('POST payload keys:', Object.keys(payload), 'label', payload.label);
  try {
    const post = await axios.post('https://hdmovies.life/jailer-2-2026/download', new URLSearchParams(payload).toString(), {
      headers: { ...H, 'Content-Type': 'application/x-www-form-urlencoded', Referer: 'https://hdmovies.life/movie/jailer-2-2026' },
      maxRedirects: 0, validateStatus: null, responseType: 'text', transformResponse: x => x,
    });
    console.log('POST status', post.status, 'location', post.headers.location);
    console.log('body snippet:', String(post.data).slice(0, 400).replace(/\s+/g, ' '));
  } catch (e) { console.log('POST ERR', e.message); }
})();
