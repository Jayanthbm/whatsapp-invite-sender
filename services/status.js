const fs = require("fs");
const path = require("path");

const config = require("../config");
const { updateStatus } = require("./googleSheets");

async function updateContactStatus(contact, sent, remarks) {
  try {
    if (config.source.mode === "google-sheets") {
      return await updateStatus(
        config.source.sheetName,
        contact.rowNumber,
        sent,
        remarks,
      );
    }

    if (!config.logfile) {
      console.warn(
        "⚠️  logfile is not configured in config.js. Status will not be persisted.",
      );

      return;
    }

    const logDir = path.dirname(config.logfile);

    if (!fs.existsSync(logDir)) {
      console.warn(
        `⚠️  Log directory '${logDir}' does not exist. Creating it...`,
      );

      fs.mkdirSync(logDir, {
        recursive: true,
      });
    }

    const line =
      `${new Date().toISOString()},` +
      `${contact.name || ""},` +
      `${contact.phone || ""},` +
      `${sent ? "SUCCESS" : "FAILED"},` +
      `${remarks}\n`;

    fs.appendFileSync(config.logfile, line, "utf8");
  } catch (err) {
    console.error(
      `❌ Failed to update status for ${contact.name || contact.phone}:`,
      err.message,
    );
  }
}

module.exports = {
  updateContactStatus,
};
