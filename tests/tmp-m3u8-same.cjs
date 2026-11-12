const { chromium } = require('playwright-core');
(async()=>{
  const browser = await chromium.launch({ channel:'msedge', headless:true }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const ctx = await browser.newContext({ userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', viewport:{width:412,height:915} });
  const page = await ctx.newPage();
  let captured;
  page.on('request', r=>{ if(!captured && /master\.m3u8/.test(r.url())) captured={url:r.url(), headers:r.headers()}; });
  await page.goto('https://luluvid.com/e/x0w6xdqjyeum',{waitUntil:'domcontentloaded',timeout:45000}).catch(e=>console.log('goto',e.message));
  await page.waitForTimeout(7000);
  await page.evaluate(()=>window.jwplayer().play()).catch(()=>{});
  for(let i=0;i<20 && !captured;i++) await page.waitForTimeout(500);
  console.log('captured', captured?.url?.slice(0,120));
  if(captured){
    for(const [name,headers] of [['none',{}],['ref',{'Referer':'https://luluvid.com/'}],['full',captured.headers]]){
      try{
        const r=await fetch(captured.url,{headers});
        console.log('node same-url',name,'->',r.status,r.headers.get('content-type'));
      }catch(e){console.log('node',name,'ERR',e.message)}
    }
  }
  await browser.close();
})();
