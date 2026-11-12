const { chromium } = require('playwright-core');
(async()=>{
  const browser = await chromium.launch({ channel:'msedge', headless:true, ignoreDefaultArgs:['--enable-automation'] }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', viewport:{width:412,height:915} });
  const page = await ctx.newPage();
  const seen=[];
  page.on('request', r=>{ if(/m3u8|tnmr|\.mp4|\.mkv/.test(r.url())) seen.push({url:r.url(), headers:r.headers()}); });
  page.on('response', async r=>{ if(/m3u8|tnmr/.test(r.url())) console.log('RESP',r.status(),r.url().slice(0,140),r.headers()['content-type']); });
  await page.goto('https://luluvid.com/e/x0w6xdqjyeum',{waitUntil:'domcontentloaded',timeout:45000}).catch(e=>console.log('goto',e.message));
  await page.waitForTimeout(12000);
  console.log('requests',JSON.stringify(seen.slice(0,5),null,1));
  console.log('title',await page.title());
  console.log('body', (await page.locator('body').innerText().catch(()=>'' )).slice(0,300));
  await page.screenshot({path:'tests/tmp-lulu-play.png'}).catch(()=>{});
  await browser.close();
})();
