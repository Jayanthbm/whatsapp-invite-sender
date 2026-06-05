/*
  //config.js
  CONFIG: Allows you to configure the script

*/

const messageVariant1 = `✨ Save the Date! ✨

💍 Join Our Forever

We're taking the plunge! We'd love for you to join us as we begin this new chapter together. Your presence means a lot to us.

❤️ Jayanth & Swarna ❤️

🗓️ Reception: Wed, Jul 1 • 6:30 PM onwards
⏰ Muhurtham: Thu, Jul 2 • 9:00 AM – 9:30 AM

📍 Venue:
Chandra Sagara Kalyana Mantapa, Jayanagar

📍 Map:
https://maps.app.goo.gl/J4ofwreM35V1YQhk7

Looking forward to celebrating with you 😊
`;

const messageVariant2 = `🙏 Wedding Invitation 🙏

Please join us for the wedding ceremony of our children, Jayanth & Swarna. Your esteemed presence and blessings will make this sacred occasion truly special.

🗓️ Reception: Wed, Jul 1 • 6:30 PM onwards
⏰ Muhurtham: Thu, Jul 2 • 9:00 AM – 9:30 AM

📍 Venue:
Chandra Sagara Kalyana Mantapa, Jayanagar

📍 Map:
https://maps.app.goo.gl/J4ofwreM35V1YQhk7


Looking forward to celebrating with you!`;

module.exports = {
  delayMs: 30000,
  imageFile: "./assets/invite.jpg",
  pdfFile: "./assets/Jayanth-Swarna-Wedding-Reception-Invitation.pdf",
  logfile: "./logs/invites.txt",
  variant: "variant1",
  source: {
    mode: "csv", //google-sheets | csv | numbers | named-numbers
    sheetName: "test",
    csvPath: "./contacts.csv",
    numbers: [""],
    namedNumbers: [
      {
        name: "",
        phone: "",
        variant: "variant1",
      },
    ],
  },

  variants: {
    variant1: {
      sendImage: true,
      sendPdf: false,
      addName: true,
      message: messageVariant1,
    },

    variant2: {
      sendImage: true,
      sendPdf: true,
      addName: true,
      message: messageVariant1,
    },

    variant3: {
      sendImage: true,
      sendPdf: true,
      addName: false,
      message: messageVariant2,
    },
  },
};
