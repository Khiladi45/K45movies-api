const axios = require('axios');
const cheerio = require('cheerio');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'};
const name = 'www.1TamilBlasters.Blog_Jailer_2_2026_Tamil_HQ_HDRip_1080p_x264_AAC_2.0_2.8GB_HC_ESub.mkv';
const url = `https://ajshdjqowieurmxnzbvcplakshdjqowieurmxnzbvcplakshdjqowieurmxnz.xyz/download/files/${name}`;
(async () => {
  const r = await axios.get(url, { headers: { ...H, Referer: `https://ajshdjqowieurmxnzbvcplakshdjqowieurmxnzbvcplakshdjqowieurmxnz.xyz/files/${name}` }, timeout: 60000, maxRedirects: 5, validateStatus: null, responseType: 'text', transformResponse: x => x });
  const $ = cheerio.load(r.data);
  console.log('set-cookie', r.headers['set-cookie']);
  console.log('anchors', $('a[href]').map((i,e)=>$(e).attr('href')).get().slice(0,10));
  console.log('forms', $('form').map((i,e)=>({action:$(e).attr('action'),method:$(e).attr('method'),inputs:$(e).find('input').map((j,x)=>$(x).attr('name')).get()})).get());
  console.log('body text', $('body').text().replace(/\s+/g,' ').slice(0, 600));
  const scripts = $('script').map((i,e)=>$(e).html()).get().join('\n');
  const idx = scripts.indexOf('setTimeout');
  console.log('script around setTimeout:', idx >= 0 ? scripts.slice(Math.max(0,idx-400), idx+600) : 'none');
  console.log('meta refresh', $('meta[http-equiv]').map((i,e)=>`${$(e).attr('http-equiv')}:${$(e).attr('content')}`).get());
})();
