const fs = require("fs");
const path = require("path");

module.exports = function buildList() {
  const tokens = fs
    .readdirSync(path.join(__dirname, "tokens"))
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      const chain = path.basename(file, ".json");
      return require(`./tokens/${file}`).map((token) => ({
        ...token,
        chain,
      }));
    });

  const merged = tokens.reduce((acc, token) => {
    acc[token.symbol] = acc[token.symbol] || [];
    acc[token.symbol].push(token);
    return acc;
  }, {});

  return Object.keys(merged).map((symbol) => {
    return {
      name: merged[symbol][0].name,
      symbol: merged[symbol][0].symbol,
      icon_url: merged[symbol][0].icon_url,
      implementations: merged[symbol].map((token) => {
        return {
          chain: token.chain,
          address: token.address,
          decimals: token.decimals,
        };
      }),
    };
  });
};
