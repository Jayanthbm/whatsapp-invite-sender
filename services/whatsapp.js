const { Client, LocalAuth } = require('whatsapp-web.js');

function createClient() {
  return new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });
}

module.exports = createClient;