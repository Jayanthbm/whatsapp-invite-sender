require("dotenv").config();

const config = require("./config");
const createClient = require("./services/whatsapp");
const sendInvites = require("./services/sender");
const { getContacts } = require("./services/contacts");

const command = process.argv[2];

async function main() {
  const client = createClient();

  if (command === "login") {
    console.log("Starting WhatsApp login...");

    client.on("qr", () => {
      console.log("Please scan the QR code");
    });

    client.on("authenticated", () => {
      console.log("✓ Authentication successful");
    });

    client.on("ready", async () => {
      console.log("✓ WhatsApp login successful");
      console.log("Session saved locally");

      await client.destroy();
      process.exit(0);
    });

    client.initialize();

    return;
  }

  if (command === "logout") {
    client.on("ready", async () => {
      console.log("Logging out...");

      await client.logout();
      await client.destroy();

      console.log("Logout successful");

      process.exit(0);
    });

    client.initialize();
    return;
  }

  if (command === "send") {
    console.log(`Loading contacts using source mode: ${config.source.mode}`);

    const contacts = await getContacts();

    console.log(`Found ${contacts.length} contacts`);

    if (contacts.length === 0) {
      console.log("No contacts found");
      process.exit(0);
    }

    client.on("ready", async () => {
      try {
        await sendInvites(client, contacts);

        await client.destroy();

        process.exit(0);
      } catch (err) {
        console.error(err);

        await client.destroy();

        process.exit(1);
      }
    });

    client.initialize();

    return;
  }

  console.log(`
Usage:

node app.js login

node app.js send

node app.js logout
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
