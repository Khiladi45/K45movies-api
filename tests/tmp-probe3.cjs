const axios = require('axios');
const cheerio = require('cheerio');
const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

const get = (url, opts = {}) => axios.get(url, { headers: H, timeout: 30000, maxRedirects: 5, validateStatus: null, responseType: 'text', transformResponse: x => x, ...opts });

(async () => {
  // 1. 1tamilblasters direct file host range test
  const fileUrl = 'https://ajshdjqowieurmxnzbvcplakshdjqowieurmxnzbvcplakshdjqowieurmxnz.xyz/files/www.1TamilBlasters.Blog_Jailer_2_2026_Tamil_HQ_HDRip_1080p_x264_AAC_2.0_2.8GB_HC';
  try {
    const r = await axios.get(fileUrl, { headers: { ...H, Range: 'bytes=0-1023' }, timeout: 30000, maxRedirects: 5, validateStatus: null, responseType: 'arraybuffer' });
    console.log('TB FILE', r.status, r.request?.res?.responseUrl, r.headers['content-type'], r.headers['content-length'], 'got', r.data.byteLength);
  } catch (e) { console.log('TB FILE ERR', e.message); }

  // 2. 1tamilblasters category article markup
  const cat = await get('https://www.1tamilblasters.blog/category/tamil-movies-2026/');
  const $c = cheerio.load(cat.data);
  console.log('\nTB CATEGORY first article HTML:');
  console.log($c('article').first().html().replace(/\s+/g, ' ').slice(0, 1200));

  // 3. 1tamilblasters REST search
  const s = await get('https://www.1tamilblasters.blog/wp-json/wp/v2/posts?search=jailer&per_page=5');
  console.log('\nTB REST search status', s.status, 'count', Array.isArray(s.data) ? s.data.length : 'n/a');
  if (Array.isArray(s.data)) s.data.slice(0, 3).forEach(p => console.log('  ', p.title?.rendered, p.link));

  // 4. hdmovies list article markup
  const movies = await get('https://hdmovies.life/movies');
  const $m = cheerio.load(movies.data);
  console.log('\nHDM article:', $m('article').first().html().replace(/\s+/g, ' ').slice(0, 1500));

  // 5. hdmovies detail form summary (all cards)
  const d = await get('https://hdmovies.life/movie/jailer-2-2026');
  const $d = cheerio.load(d.data);
  console.log('\nHDM cards:');
  $d('.blog-dl-card').each((i, card) => {
    const header = $d(card).find('.blog-dl-header').text().trim().replace(/\s+/g, ' ');
    const btns = $d(card).find('form.dl-post-form').map((j, f) => {
      const fields = {};
      $d(f).find('input[name]').each((k, inp) => { fields[$d(inp).attr('name')] = $d(inp).val(); });
      return { label: fields.label, url: fields.url, quality: fields.quality, size: fields.size };
    }).get();
    console.log(' ', header);
    btns.forEach(b => console.log('    ', b.label, b.quality, b.size, '=>', String(b.url).slice(0, 80)));
  });

  // 6. hdmovies FXShare token chain (first token anchor)
  const hdlinks = await get('https://links.hdlinks.online/file/0abyxfe6');
  const $h = cheerio.load(hdlinks.data);
  const tokenHref = $h('a[href^="?token="]').first().attr('href');
  console.log('\nFXSHARE token href len', tokenHref?.length, 'base', hdlinks.request?.res?.responseUrl);
  if (tokenHref) {
    const base = hdlinks.request?.res?.responseUrl || 'https://alpha.fxdl.site/file/x';
    const abs = new URL(tokenHref, base).href;
    try {
      const r = await axios.get(abs, { headers: { ...H, Referer: base }, timeout: 30000, maxRedirects: 0, validateStatus: null, responseType: 'text', transformResponse: x => x });
      console.log('FX chain', r.status, 'location', String(r.headers.location || '').slice(0, 200), 'ct', r.headers['content-type'], 'len', String(r.data || '').length);
    } catch (e) { console.log('FX chain ERR', e.message); }
  }
})();
