const { chromium } = require('playwright-core');
(async()=>{
  try{const r=await fetch('https://api.ipify.org?format=json');console.log('node ip',await r.text());}catch(e){console.log('node ip err',e.message)}
  const browser = await chromium.launch({ channel:'msedge', headless:true }).catch(()=>chromium.launch({channel:'chrome',headless:true}));
  const page = await (await browser.newContext()).newPage();
  await page.goto('https://api.ipify.org?format=json',{waitUntil:'domcontentloaded',timeout:30000}).catch(()=>{});
  console.log('browser body', await page.locator('body').innerText().catch(()=>''));
  await browser.close();
})();
