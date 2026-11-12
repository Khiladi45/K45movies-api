const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const H = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'};

const targets = [
  ['tb', 'https://www.1tamilblasters.blog/'],
  ['hdm', 'https://hdmovies.life/'],
];

(async () => {
  for (const [name, url] of targets) {
    const r = await axios.get(url, { headers: H, timeout: 30000, responseType: 'text', transformResponse: x => x, maxRedirects: 5 });
    fs.writeFileSync(`tests/tmp-${name}.html`, r.data);
    const $ = cheerio.load(r.data);
    console.log('===', name, url);
    console.log('final url:', r.request?.res?.responseUrl);
    console.log('title:', $('title').text().trim());
    console.log('h1:', $('h1').length, 'h2:', $('h2').length, 'h3:', $('h3').length, 'articles:', $('article').length);
    console.log('h2 texts:', $('h2').slice(0, 8).map((i, e) => $(e).text().trim().slice(0, 70)).get());
    console.log('links:');
    $('a[href]').slice(0, 50).each((i, e) => console.log('  ', $(e).attr('href'), '|', $(e).text().trim().slice(0, 60)));
    console.log();
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
