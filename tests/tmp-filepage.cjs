const axios = require('axios');
const cheerio = require('cheerio');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'};
const url = 'https://ajshdjqowieurmxnzbvcplakshdjqowieurmxnzbvcplakshdjqowieurmxnz.xyz/files/www.1TamilBlasters.Blog_Jailer_2_2026_Tamil_HQ_HDRip_1080p_x264_AAC_2.0_2.8GB_HC_ESub.mkv';
(async () => {
  const r = await axios.get(url, { headers: { ...H, Referer: 'https://www.1tamilblasters.blog/' }, timeout: 40000, maxRedirects: 5, validateStatus: null, responseType: 'text', transformResponse: x => x });
  const $ = cheerio.load(r.data);
  console.log('title', $('title').text().trim());
  console.log('anchors', $('a[href]').map((i,e)=>$(e).attr('href')).get().slice(0,15));
  console.log('forms', $('form').map((i,e)=>$(e).attr('action')).get());
  console.log('meta refresh', $('meta[http-equiv]').map((i,e)=>$(e).attr('content')).get());
  console.log('scripts with url:', ($('script').map((i,e)=>$(e).html()).get().join('\n').match(/https?:\/\/[^"'\s)]+/g)||[]).slice(0,10));
  console.log(r.data.slice(0, 2500));
})();
