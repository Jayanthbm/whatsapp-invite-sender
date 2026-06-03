# WhatsApp Wedding Invite Sender

A simple Node.js utility to send personalized WhatsApp wedding invitations using WhatsApp Web.

Supports:

* Image invitations
* PDF invitations
* Personalized messages
* Multiple message variants
* Google Sheets integration
* Automatic delivery status updates
* Resume-safe processing using Google Sheets

Built using:

* whatsapp-web.js
* Google Sheets API
* Node.js

---

## Features

✅ Login once using WhatsApp Web

✅ Send invitations from Google Sheets

✅ Multiple invitation variants

✅ Image only

✅ PDF + Image

✅ Personalized messages

✅ Automatic status tracking

✅ IST timestamp updates

✅ Skip already-sent contacts

✅ Works with personal WhatsApp account

---

## Google Sheet Structure

Each sheet/tab acts as a batch.

Example:

| Name         | Phone        | Variant  | Sent  | SentAt | Remarks | Call | Other Info |
| ------------ | ------------ | -------- | ----- | ------ | ------- | ---- | ---------- |
| Rahul        | 919876543210 | variant1 | FALSE |        |         |      |            |
| Priya        | 919876543211 | variant2 | FALSE |        |         |      |            |
| Uncle Ramesh | 919876543212 | variant3 | FALSE |        |         |      |            |

### Columns used by the script

| Column  | Description                            |
| ------- | -------------------------------------- |
| Name    | Recipient name                         |
| Phone   | WhatsApp number including country code |
| Variant | Message template to use                |
| Sent    | TRUE/FALSE                             |
| SentAt  | Auto updated                           |
| Remarks | Success/error status                   |

### Optional columns

| Column     | Description       |
| ---------- | ----------------- |
| Call       | Personal tracking |
| Other Info | Personal notes    |

---

## Variants

### variant1

Image + Message

### variant2

PDF + Image + Message

### variant3

PDF + Image + Traditional Invitation Message

---

## Installation

Clone repository:

```bash
git clone https://github.com/your-username/whatsapp-wedding-invite-sender.git

cd whatsapp-wedding-invite-sender
```

Install dependencies:

```bash
npm install
```

Install Google APIs:

```bash
npm install googleapis dotenv
```

---

## Project Structure

```text
.
├── app.js
├── config.js
├── service-account.json
├── .env
│
├── assets
│   ├── invite.jpg
│   └── invitation.pdf
│
├── services
│   ├── whatsapp.js
│   ├── sender.js
│   └── googleSheets.js
│
└── utils
    ├── delay.js
    └── date.js
```

---

## Configuration

### .env

```env
SPREADSHEET_ID=YOUR_GOOGLE_SHEET_ID
```

### Service Account

Create a Google Cloud Service Account and download:

```text
service-account.json
```

Place it in project root.

Share your Google Sheet with:

```text
service-account@project-id.iam.gserviceaccount.com
```

Editor access is required.

---

## WhatsApp Login

Login once:

```bash
node app.js login
```

Scan the QR code using WhatsApp.

Session is stored locally.

---

## Sending Invites

Send a batch:

```bash
node app.js send Friends
```

Send another sheet:

```bash
node app.js send Relatives
```

Send elders batch:

```bash
node app.js send Elders
```

The sheet name must match the tab name in Google Sheets.

---

## Logout

```bash
node app.js logout
```

---

## Status Updates

Successful delivery:

| Sent | Remarks            |
| ---- | ------------------ |
| TRUE | SUCCESS (variant2) |

Failed delivery:

| Sent  | Remarks         |
| ----- | --------------- |
| FALSE | NOT_ON_WHATSAPP |

or

| Sent  | Remarks                 |
| ----- | ----------------------- |
| FALSE | FAILED: <error message> |

Timestamp is automatically stored in IST:

```text
2026-06-03 18:45:32
```

---

## Example Workflow

1. Add contacts to Google Sheet
2. Select desired variant per contact
3. Login to WhatsApp
4. Run sender
5. Script updates status automatically
6. Re-run anytime to process remaining contacts

---

## Disclaimer

This project is intended for personal use cases such as:

* Wedding invitations
* Family events
* Reunions
* Personal announcements

Please comply with WhatsApp's Terms of Service and avoid sending unsolicited or spam messages.

Use responsibly.
