/*
  //services/sender.js
  Send invites to contacts
*/

const { MessageMedia } = require("whatsapp-web.js");
const config = require("../config");
const delay = require("../utils/delay");
const { updateContactStatus } = require("./status");

let inviteImage = null;
let invitePdf = null;

if (config.imageFile) {
  inviteImage = MessageMedia.fromFilePath(config.imageFile);
}

if (config.pdfFile) {
  invitePdf = MessageMedia.fromFilePath(config.pdfFile);
}

async function sendInvites(client, contacts) {
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  console.log(`\nLoaded ${contacts.length} contacts`);

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const phone = String(contact.phone).trim();

    const selectedVariant = contact.variant || config.variant;

    const variant = config.variants[selectedVariant];

    if (!variant) {
      failCount++;

      await updateContactStatus(
        contact,
        false,
        `INVALID_VARIANT (${selectedVariant})`,
      );

      console.error(
        `[${i + 1}/${contacts.length}] Invalid variant '${selectedVariant}' for ${contact.name || phone}`,
      );

      continue;
    }

    try {
      const numberId = await client.getNumberId(phone);

      if (!numberId) {
        failCount++;

        await updateContactStatus(contact, false, "NOT_ON_WHATSAPP");

        console.log(
          `[${i + 1}/${contacts.length}] ${contact.name || phone} is not on WhatsApp`,
        );

        continue;
      }

      const chatId = numberId._serialized;

      const imageMedia = variant.sendImage ? inviteImage : null;

      const pdfMedia = variant.sendPdf ? invitePdf : null;

      const caption =
        variant.addName && contact.name
          ? `Hey ${contact.name}, 👋

${variant.message}`
          : variant.message;

      /*
        Image Only:
          Image + Caption

        PDF Only:
          PDF

        PDF + Image:
          PDF
          Image + Caption
      */

      if (pdfMedia && imageMedia) {
        await client.sendMessage(chatId, pdfMedia);

        await delay(1500);

        await client.sendMessage(chatId, imageMedia, {
          caption,
        });
      } else if (imageMedia) {
        await client.sendMessage(chatId, imageMedia, {
          caption,
        });
      } else if (pdfMedia) {
        await client.sendMessage(chatId, pdfMedia);
      } else {
        skippedCount++;

        await updateContactStatus(contact, false, "NO_MEDIA_CONFIGURED");

        continue;
      }

      successCount++;

      await updateContactStatus(contact, true, `SUCCESS (${selectedVariant})`);

      console.log(
        `[${i + 1}/${contacts.length}] ✓ Sent to ${contact.name || phone} [${selectedVariant}] (${new Date().toLocaleTimeString()})`,
      );

      const remainingContacts = contacts.length - i - 1;

      if (remainingContacts > 0) {
        console.log(
          `Waiting ${config.delayMs / 1000}s before next contact... (${remainingContacts} remaining)`,
        );

        await delay(config.delayMs);
      } else {
        await delay(1200);
      }
    } catch (err) {
      failCount++;

      await updateContactStatus(contact, false, err.message);

      console.error(
        `[${i + 1}/${contacts.length}] ✗ Failed ${contact.name || phone}: ${err.message}`,
      );
    }
  }

  console.log("\n=================================");
  console.log("Invite Sending Completed");
  console.log("=================================");

  if (config.source.mode === "google-sheets") {
    console.log(`Sheet   : ${config.source.sheetName}`);
  }
  
  console.log(`Source  : ${config.source.mode}`);
  console.log(`Total   : ${contacts.length}`);
  console.log(`Success : ${successCount}`);
  console.log(`Failed  : ${failCount}`);
  console.log(`Skipped : ${skippedCount}`);

  console.log("=================================\n");
}

module.exports = sendInvites;
