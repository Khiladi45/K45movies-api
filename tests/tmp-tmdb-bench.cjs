const fs = require('fs');
const path = require('path');
const axios = require('axios');
const envPath = path.join(__dirname, '..', '..', 'K45movies', '.env');
const key = fs.readFileSync(envPath, 'utf8').match(/EXPO_PUBLIC_TMDB_KEY=(.+)/)[1].trim();
const bearer = key.startsWith('eyJ');
const titles = ['Yezhu Kadal Yezhu Malai (2026) Tamil','Mookuthi Amman 2 (2026) Tamil','Scene (2026) Tamil','Jailer 2 (2026) Tamil','Ramayana (2026) Tamil','Adaikalam (2026) Tamil','The Good Lawyer (2026)','A History of Violence (2005)','The Dark Heaven (2026)','Possible Love (2026)'];
(async () => {
  for (const round of [6, 3]) {
    const t = Date.now();
    let cursor = 0; let n = 0;
    const worker = async () => {
      while (cursor < titles.length) {
        const title = titles[cursor++];
        const name = title.replace(/\s*\(\d{4}\).*$/, '').trim();
        const qs = bearer ? '' : `&api_key=${key}`;
        const res = await axios.get(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(name)}&language=en-US${qs}`, {
          headers: bearer ? { Authorization: `Bearer ${key}`, accept: 'application/json' } : { accept: 'application/json' },
          timeout: 15000,
        });
        n++;
        void res.data;
      }
    };
    await Promise.all(Array.from({ length: round }, worker));
    console.log(`concurrency ${round}: ${n} searches in ${Date.now() - t}ms`);
  }
})().catch(e => console.log('ERR', e.message));
