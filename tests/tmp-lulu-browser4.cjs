const { chromium } = require('playwright-core');
(async()=>{
  const browser = await chromium.launch({ channel:'msedge', headless:true, ignoreDefaultArgs:['--enable-automation'] }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', viewport:{width:412,height:915} });
  const page = await ctx.newPage();
  let done=false;
  page.on('request', async r=>{ if(!done && /master\.m3u8/.test(r.url())){ done=true; console.log('URL',r.url()); console.log('HEADERS',JSON.stringify(await r.allHeaders(),null,1)); console.log('COOKIES',JSON.stringify(await ctx.cookies(),null,1)); } });
  await page.goto('https://luluvid.com/e/x0w6xdqjyeum',{waitUntil:'domcontentloaded',timeout:45000}).catch(e=>console.log('goto',e.message));
  await page.waitForTimeout(7000);
  await page.evaluate(()=>window.jwplayer().play()).catch(()=>{});
  await page.waitForTimeout(6000);
  await browser.close();
})();
