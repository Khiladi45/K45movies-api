const axios = require('axios');
const cheerio = require('cheerio');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'Accept-Language':'en-US,en;q=0.9'};
const get = (url, opts = {}) => axios.get(url, { headers: H, timeout: 40000, maxRedirects: 0, validateStatus: null, responseType: 'text', transformResponse: x => x, ...opts });
(async () => {
  let url = 'https://links.hdlinks.online/file/0abyxfe6';
  let referer = '';
  for (let hop = 0; hop < 8; hop++) {
    const r = await get(url, referer ? { headers: { ...H, Referer: referer } } : {});
    const loc = r.headers.location;
    console.log(`hop ${hop}`, r.status, String(url).slice(0, 110));
    console.log('   loc', String(loc || '').slice(0, 160), '| ct', r.headers['content-type'], '| len', String(r.data||'').length);
    if (loc) { referer = url; url = new URL(loc, url).href; continue; }
    if (r.status !== 200) break;
    const $ = cheerio.load(String(r.data));
    console.log('   title', $('title').text().trim().slice(0, 90));
    const anchors = $('a[href]').map((i,e)=>$(e).attr('href')).get().filter(h => h && !h.startsWith('#'));
    console.log('   anchors', anchors.slice(0,8).map(a=>String(a).slice(0,130)));
    const next = anchors.find(a => /download|token|drive|\.mkv|\.mp4/i.test(a));
    if (!next) break;
    referer = url; url = new URL(next, url).href;
  }
})().catch(e => console.log('ERR', e.message));
