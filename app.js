require("dotenv").config();

const createClient = require("./services/whatsapp");
const sendInvites = require("./services/sender");
const { getContacts } = require("./services/googleSheets");

const command = process.argv[2];
const sheetName = process.argv[3];

async function main() {
  const client = createClient();

  if (command === "login") {
    console.log("Starting WhatsApp login...");
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
    if (!sheetName) {
      console.error(`
Usage:

node app.js send Friends
node app.js send Relatives
node app.js send Elders
      `);

      process.exit(1);
    }

    console.log(`Loading contacts from sheet '${sheetName}'...`);

    const contacts = await getContacts(sheetName);

    console.log(`Found ${contacts.length} pending contacts`);

    if (contacts.length === 0) {
      console.log("No pending contacts found");

      process.exit(0);
    }

    client.on("ready", async () => {
      try {
        await sendInvites(client, contacts, sheetName);

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

node app.js send Friends

node app.js send Relatives

node app.js send Elders

node app.js logout
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
