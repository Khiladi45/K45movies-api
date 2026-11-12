const axios = require('axios');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'};
const url = 'https://ajshdjqowieurmxnzbvcplakshdjqowieurmxnzbvcplakshdjqowieurmxnz.xyz/files/www.1TamilBlasters.Blog_Jailer_2_2026_Tamil_HQ_HDRip_1080p_x264_AAC_2.0_2.8GB_HC_ESub.mkv';
(async () => {
  try {
    const r = await axios.get(url, { headers: { ...H, Range: 'bytes=0-1023', Referer: 'https://www.1tamilblasters.blog/' }, timeout: 40000, maxRedirects: 5, validateStatus: null, responseType: 'arraybuffer' });
    console.log('status', r.status, 'final', r.request?.res?.responseUrl);
    console.log('ct', r.headers['content-type'], 'len', r.headers['content-length'], 'range', r.headers['content-range'], 'got', r.data.byteLength);
    console.log('head ascii', Buffer.from(r.data).slice(0, 64).toString('latin1'));
  } catch (e) { console.log('ERR', e.message); }
})();
