const { providerContext } = require('./provider-test-context');
const { getStream } = require('../dist/1tamilmv/stream.js');
const { chromium } = require('playwright-core');
(async()=>{
  const s = await getStream({link:'https://luluvid.com/e/x0w6xdqjyeum',type:'movie',signal:AbortSignal.timeout(20000),providerContext});
  const url = s[0].link; console.log('node url', url);
  const browser = await chromium.launch({ channel:'msedge', headless:true }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const page = await (await browser.newContext()).newPage();
  await page.goto('about:blank');
  const out = await page.evaluate(async (u)=>{
    try{ const r=await fetch(u,{headers:{'Referer':'https://luluvid.com/','Origin':'https://luluvid.com'}}); return {status:r.status, ct:r.headers.get('content-type'), text:(await r.text()).slice(0,40)}; }
    catch(e){ return {err:String(e)}; }
  }, url);
  console.log('browser on node url', out);
  await browser.close();
})();
