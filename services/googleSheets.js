const { google } = require("googleapis");
const { getISTDateTime } = require("../utils/date");
const auth = new google.auth.GoogleAuth({
  keyFile: "./service-account.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

async function getSheetsClient() {
  const client = await auth.getClient();

  return google.sheets({
    version: "v4",
    auth: client,
  });
}

async function getContacts(sheetName) {
  const sheets = await getSheetsClient();

  const response =
    await sheets.spreadsheets.values.get({
      spreadsheetId:
        process.env.SPREADSHEET_ID,
      range: `${sheetName}!A:H`,
    });

  const rows =
    response.data.values || [];

  if (rows.length <= 1) {
    return [];
  }

  return rows
    .slice(1)
    .map((row, index) => ({
      rowNumber: index + 2,

      name: row[0] || "",
      phone: row[1] || "",
      variant: row[2] || "",

      sent: row[3] || "",
      sentAt: row[4] || "",
      remarks: row[5] || "",

      call: row[6] || "",
      otherInfo: row[7] || "",
    }))
    .filter(
      (r) =>
        String(r.sent).toUpperCase() !==
        "TRUE"
    );
}

async function updateStatus(
  sheetName,
  rowNumber,
  sent,
  remarks
) {
  const sheets =
    await getSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,

    range: `${sheetName}!D${rowNumber}:F${rowNumber}`,

    valueInputOption: "USER_ENTERED",

    requestBody: {
      values: [[sent, getISTDateTime(), remarks]],
    },
  });
}

module.exports = {
  getContacts,
  updateStatus,
};