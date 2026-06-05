const config = require("../config");

async function getContacts() {
  switch (config.source.mode) {
    case "google-sheets":
      const { getContacts: getSheetContacts } = require("./googleSheets");

      return await getSheetContacts(config.source.sheetName);

    case "csv":
      const readCSV = require("../utils/csv");

      return await readCSV(config.source.csvPath);

    case "numbers":
      return config.source.numbers.map((phone) => ({
        name: "",
        phone,
        variant: config.variant,
      }));

    case "named-numbers":
      return config.source.namedNumbers;

    default:
      throw new Error(`Unsupported source mode: ${config.source.mode}`);
  }
}

module.exports = {
  getContacts,
};
