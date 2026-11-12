const { chromium } = require('playwright-core');
(async()=>{
  const browser = await chromium.launch({ channel:'msedge', headless:true, ignoreDefaultArgs:['--enable-automation'] }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', viewport:{width:412,height:915} });
  const page = await ctx.newPage();
  page.on('request', r=>{ if(/m3u8|tnmr|\.mp4|\.mkv/.test(r.url())) console.log('REQ',r.url().slice(0,180), JSON.stringify(r.headers()).slice(0,400)); });
  page.on('response', r=>{ if(/m3u8|tnmr|\.mp4|\.mkv/.test(r.url())) console.log('RESP',r.status(),r.headers()['content-type'],r.url().slice(0,160)); });
  await page.goto('https://luluvid.com/e/x0w6xdqjyeum',{waitUntil:'domcontentloaded',timeout:45000}).catch(e=>console.log('goto',e.message));
  await page.waitForTimeout(8000);
  const cfg = await page.evaluate(()=>{
    try{
      const p=window.jwplayer(); const c=p.getConfig(); return {file:c.file, sources:c.sources, playlist:c.playlist, image:c.image};
    }catch(e){return {err:String(e)}}
  });
  console.log('CFG',JSON.stringify(cfg,null,1).slice(0,2000));
  try{ await page.evaluate(()=>window.jwplayer().play()); }catch(e){console.log('play err',e.message)}
  await page.waitForTimeout(8000);
  console.log('currentSrc', await page.evaluate(()=>({v:document.querySelector('video')?.currentSrc, s:[...document.querySelectorAll('video source')].map(x=>x.src)})));
  await browser.close();
})();
