/*
  //services/sender.js
  Send invites to contacts
*/

const { MessageMedia } = require("whatsapp-web.js");
const config = require("../config");
const delay = require("../utils/delay");
const { updateStatus } = require("./googleSheets");

async function sendInvites(client, contacts, sheetName) {
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  console.log(`\nLoaded ${contacts.length} pending contacts from ${sheetName}`);

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const phone = String(contact.phone).trim();

    const selectedVariant = contact.variant || config.variant;

    const variant = config.variants[selectedVariant];

    if (!variant) {
      failCount++;

      await updateStatus(
        sheetName,
        contact.rowNumber,
        false,
        `INVALID_VARIANT (${selectedVariant})`,
      );

      console.error(
        `[${i + 1}/${contacts.length}] Invalid variant '${selectedVariant}' for ${contact.name}`,
      );

      continue;
    }

    try {
      const numberId = await client.getNumberId(phone);

      if (!numberId) {
        failCount++;

        await updateStatus(
          sheetName,
          contact.rowNumber,
          false,
          "NOT_ON_WHATSAPP",
        );

        console.log(
          `[${i + 1}/${contacts.length}] ${contact.name} is not on WhatsApp`,
        );

        continue;
      }

      const chatId = numberId._serialized;

      const imageMedia = variant.sendImage
        ? MessageMedia.fromFilePath(config.imageFile)
        : null;

      const pdfMedia = variant.sendPdf
        ? MessageMedia.fromFilePath(config.pdfFile)
        : null;

      const caption = variant.addName
        ? `Hey ${contact.name}, 👋

${variant.message}`
        : variant.message;

      /*
        Image only:
          Image + Caption

        PDF only:
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

        await updateStatus(
          sheetName,
          contact.rowNumber,
          false,
          "NO_MEDIA_CONFIGURED",
        );

        continue;
      }

      successCount++;

      await updateStatus(
        sheetName,
        contact.rowNumber,
        true,
        `SUCCESS (${selectedVariant})`,
      );

      console.log(
        `[${i + 1}/${contacts.length}] ✓ Sent to ${contact.name} [${selectedVariant}] (${new Date().toLocaleTimeString()})`,
      );

      await delay(config.delayMs);
    } catch (err) {
      failCount++;

      await updateStatus(sheetName, contact.rowNumber, false, err.message);

      console.error(
        `[${i + 1}/${contacts.length}] ✗ Failed ${contact.name}: ${err.message}`,
      );
    }
  }

  console.log("\n=================================");
  console.log("Invite Sending Completed");
  console.log("=================================");
  console.log(`Sheet   : ${sheetName}`);
  console.log(`Total   : ${contacts.length}`);
  console.log(`Success : ${successCount}`);
  console.log(`Failed  : ${failCount}`);
  console.log(`Skipped : ${skippedCount}`);
  console.log("=================================\n");
}

module.exports = sendInvites;
