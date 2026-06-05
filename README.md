# WhatsApp Invite Sender

A simple Node.js utility to send personalized WhatsApp invitations using WhatsApp Web.

Supports:

* Image invitations
* PDF invitations
* Personalized messages
* Multiple message variants
* Google Sheets integration
* CSV files
* Direct number lists
* Named contacts
* Automatic delivery status tracking
* Resume-safe processing

Built using:

* whatsapp-web.js
* Google Sheets API
* Node.js

---

## Features

✅ Login once using WhatsApp Web

✅ Multiple contact sources

✅ Google Sheets support

✅ CSV support

✅ Direct number support

✅ Named contact support

✅ Multiple invitation variants

✅ Image only

✅ PDF + Image

✅ Personalized messages

✅ Automatic status tracking

✅ IST timestamp updates

✅ Resume-safe processing with Google Sheets

✅ Works with personal WhatsApp account

---

## Contact Sources

The sender supports multiple contact sources.

### Google Sheets

```js
source: {
  mode: "google-sheets",
  sheetName: "Friends"
}
```

### CSV File

```js
source: {
  mode: "csv",
  csvPath: "./contacts.csv"
}
```

Example CSV:

```csv
Name,Phone,Variant
Rahul,919876543210,variant1
Priya,919876543211,variant2
```

### Numbers

```js
source: {
  mode: "numbers",
  numbers: [
    "919876543210",
    "919876543211"
  ]
}
```

Uses the default variant configured in `config.js`.

### Named Numbers

```js
source: {
  mode: "named-numbers",
  namedNumbers: [
    {
      name: "Rahul",
      phone: "919876543210",
      variant: "variant1"
    },
    {
      name: "Uncle Ramesh",
      phone: "919876543211",
      variant: "variant3"
    }
  ]
}
```

---

## Google Sheet Structure

Each sheet/tab acts as a batch.

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
git clone https://github.com/Jayanthbm/whatsapp-invite-sender.git

cd whatsapp-invite-sender
```

Install dependencies:

```bash
npm install
```

Optional (only for Google Sheets mode):

```bash
npm install googleapis dotenv
```

---

## Configuration

Update `config.js`:

```js
source: {
  mode: "google-sheets",
  sheetName: "Friends"
}
```

Available modes:

```js
google-sheets
csv
numbers
named-numbers
```

---

## Google Sheets Setup

Create a Google Cloud Service Account.

Download:

```text
service-account.json
```

Place it in the project root.

Create:

```env
SPREADSHEET_ID=YOUR_SPREADSHEET_ID
```

Share your Google Sheet with the service account email and grant Editor access.

---

## WhatsApp Login

Login once:

```bash
node app.js login
```

Scan the QR code using WhatsApp.

Session is stored locally and reused automatically.

---

## Sending Invites

Send invites using the configured source:

```bash
node app.js send
```

Examples:

### Google Sheets

```js
source: {
  mode: "google-sheets",
  sheetName: "Friends"
}
```

### CSV

```js
source: {
  mode: "csv",
  csvPath: "./friends.csv"
}
```

### Numbers

```js
source: {
  mode: "numbers",
  numbers: [
    "919876543210"
  ]
}
```

### Named Numbers

```js
source: {
  mode: "named-numbers",
  namedNumbers: [
    {
      name: "Rahul",
      phone: "919876543210",
      variant: "variant1"
    }
  ]
}
```

---

## Logout

```bash
node app.js logout
```

---

## Status Tracking

### Google Sheets Mode

The following columns are automatically updated:

| Column  | Description           |
| ------- | --------------------- |
| Sent    | TRUE/FALSE            |
| SentAt  | IST timestamp         |
| Remarks | Success/error details |

Example:

```text
SUCCESS (variant1)
SUCCESS (variant3)
NOT_ON_WHATSAPP
INVALID_VARIANT
FAILED: <error>
```

### CSV / Numbers / Named Numbers Mode

Status is written to:

```js
logfile: "./logs/invites.txt"
```

Example:

```text
2026-06-05T15:20:10Z,Rahul,919876543210,SUCCESS,SUCCESS (variant1)
```

---

## Example Workflow

1. Configure source in `config.js`
2. Login to WhatsApp
3. Run sender
4. Status is automatically updated
5. Re-run anytime to continue pending contacts

---

## Disclaimer

This project is intended for personal use cases such as:

* Wedding invitations
* Family events
* Reunions
* Personal announcements

Please comply with WhatsApp's Terms of Service and avoid sending unsolicited or spam messages.

Use responsibly.
