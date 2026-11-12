const { providerContext } = require('./provider-test-context');
const { getStream } = require('../dist/1tamilmv/stream.js');
const { chromium } = require('playwright-core');
(async()=>{
  const s = await getStream({link:'https://luluvid.com/e/x0w6xdqjyeum',type:'movie',signal:AbortSignal.timeout(20000),providerContext});
  const url = s[0].link; console.log('node url', url.slice(0,100));
  const browser = await chromium.launch({ channel:'msedge', headless:true }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' });
  const res = await ctx.request.get(url, { headers: { Referer:'https://luluvid.com/', Origin:'https://luluvid.com' } }).catch(e=>({err:String(e)}));
  console.log('playwright request', res.status?.(), res.headers?.()?.['content-type'], res.err);
  if(res.text) console.log((await res.text()).slice(0,60).replace(/\n/g,' '));
  await browser.close();
})();
