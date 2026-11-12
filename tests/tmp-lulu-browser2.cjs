const { chromium } = require('playwright-core');
(async()=>{
  const browser = await chromium.launch({ channel:'msedge', headless:true, ignoreDefaultArgs:['--enable-automation'] }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', viewport:{width:412,height:915} });
  const page = await ctx.newPage();
  page.on('response', r=>{ if(/m3u8|tnmr|\.mp4|\.mkv/.test(r.url())) console.log('RESP',r.status(),r.headers()['content-type'],r.url().slice(0,160)); });
  await page.goto('https://luluvid.com/e/x0w6xdqjyeum',{waitUntil:'domcontentloaded',timeout:45000}).catch(e=>console.log('goto',e.message));
  await page.waitForTimeout(8000);
  const info = await page.evaluate(async()=>{
    const v=document.querySelector('video');
    if(!v) return {novideo:true};
    const p = v.play?.(); if(p&&p.catch)p.catch(()=>{});
    return {src:v.src, currentSrc:v.currentSrc, sources:[...v.querySelectorAll('source')].map(s=>s.src), jw:typeof window.jwplayer, html:v.outerHTML.slice(0,300)};
  });
  console.log('video',JSON.stringify(info,null,1));
  await page.waitForTimeout(10000);
  await browser.close();
})();
