const axios = require('axios');
const cheerio = require('cheerio');
const headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'};
const urls = {
  home: 'https://www.1tamilmv.io/',
  webhd: 'https://www.1tamilmv.io/index.php?/forums/forum/11-web-hd-itunes-hd-bluray/',
  predvd: 'https://www.1tamilmv.io/index.php?/forums/forum/10-predvd-dvdscr-cam-tc/',
  hdrips: 'https://www.1tamilmv.io/index.php?/forums/forum/12-hd-rips-dvd-rips-br-rips/',
};
(async () => {
  for (const [name, url] of Object.entries(urls)) {
    const t0 = Date.now();
    const res = await axios.get(url, {headers, timeout: 30000, responseType: 'text', transformResponse: x=>x});
    const t1 = Date.now();
    const html = String(res.data);
    const $ = cheerio.load(html);
    const anchors = $('a[href*="/topic/"]').length;
    console.log(name, 'status', res.status, 'bytes', html.length, 'fetch', t1-t0, 'ms', 'parse', Date.now()-t1, 'ms', 'topicLinks', anchors);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
