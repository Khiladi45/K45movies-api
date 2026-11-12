const { chromium } = require('playwright-core');
(async()=>{
  const browser = await chromium.launch({ channel:'msedge', headless:true }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', viewport:{width:412,height:915} });
  const page = await ctx.newPage();
  let captured;
  page.on('request', r=>{ if(!captured && /master\.m3u8/.test(r.url())) captured={url:r.url(), headers:r.headers()}; });
  await page.goto('https://luluvid.com/e/x0w6xdqjyeum',{waitUntil:'domcontentloaded',timeout:45000}).catch(()=>{});
  await page.waitForTimeout(7000);
  await page.evaluate(()=>window.jwplayer().play()).catch(()=>{});
  for(let i=0;i<20 && !captured;i++) await page.waitForTimeout(500);
  if(!captured){ console.log('no capture'); await browser.close(); return; }
  const u=captured.url;
  const tests={
    base:{},
    range:{Range:'bytes=0-'},
    range0:{Range:'bytes=0-0'},
    ident:{'Accept-Encoding':'identity'},
    all:{...captured.headers, Range:'bytes=0-'},
  };
  for(const [name,h] of Object.entries(tests)){
    try{const r=await fetch(u,{headers:h});console.log(name,'->',r.status,r.headers.get('content-type'),r.headers.get('content-range'));}catch(e){console.log(name,'ERR',e.message)}
  }
  await browser.close();
})();
