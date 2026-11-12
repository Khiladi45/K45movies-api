const path = require("path");
const { providerContext } = require("./provider-test-context");
const dist = (p, m) => require(path.join(__dirname, "..", "dist", p, `${m}.js`));

// Simulate the app's XHR adapter: it ignores maxRedirects and follows
// redirects itself, exposing only the landing URL via responseURL.
const realAxios = providerContext.axios;
const followAxios = {
  get: async (url, config = {}) => {
    const res = await realAxios.get(url, { ...config, maxRedirects: 10 });
    return {
      ...res,
      request: {
        responseURL: res.request?.res?.responseUrl || url,
      },
      headers: {
        ...res.headers,
        location: undefined,
      },
    };
  },
};

(async () => {
  const stream = dist("hdmovieslife", "stream");
  const link = process.argv[2] || "https://links.hdlinks.online/file/IV5teAvt";
  const result = await stream.getStream({
    link,
    type: "movie",
    signal: new AbortController().signal,
    providerContext: { ...providerContext, axios: followAxios },
  });
  console.log(JSON.stringify(result, null, 2));
})();
