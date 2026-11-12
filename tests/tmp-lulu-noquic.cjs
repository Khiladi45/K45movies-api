const { chromium } = require('playwright-core');
(async()=>{
  const browser = await chromium.launch({ channel:'msedge', headless:true, args:['--disable-quic'] }).catch(()=>chromium.launch({channel:'chrome',headless:true,args:['--disable-quic']}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', viewport:{width:412,height:915} });
  const page = await ctx.newPage();
  page.on('response', r=>{ if(/master\.m3u8|tnmr/.test(r.url())) console.log('RESP',r.status(),r.headers()['content-type'],r.url().slice(0,90)); });
  await page.goto('https://luluvid.com/e/x0w6xdqjyeum',{waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{});
  await page.waitForTimeout(7000);
  await page.evaluate(()=>window.jwplayer().play()).catch(()=>{});
  await page.waitForTimeout(6000);
  console.log('current time', await page.evaluate(()=>document.querySelector('video')?.currentTime).catch(()=>''));
  await browser.close();
})();
