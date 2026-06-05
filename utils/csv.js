const csv = require("csv-parser");
const fs = require("fs");

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const contacts = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        contacts.push({
          name: row.Name || row.name || "",
          phone: String(row.Phone || row.phone || "").trim(),
          variant: row.Variant || row.variant || null,
        });
      })
      .on("end", () => {
        resolve(contacts);
      })
      .on("error", reject);
  });
}

module.exports = readCSV;
