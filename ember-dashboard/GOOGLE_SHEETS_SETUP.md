# Google Sheets Backend Setup

## 1. Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename the first sheet tab to **Priorities** (bottom of the page)
3. No need to add headers — the script handles it automatically

## 2. Add the Apps Script

1. In the spreadsheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste the script below
3. Click the **Save** icon (or Ctrl+S)

```javascript
const SHEET_NAME = 'Priorities';

function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        const val = row[i];
        if (val === true || val === false) obj[h] = val;
        else if (val === 'TRUE') obj[h] = true;
        else if (val === 'FALSE') obj[h] = false;
        else obj[h] = val;
      });
      return obj;
    });
    return ContentService.createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const items = JSON.parse(e.postData.contents);

    if (!Array.isArray(items) || items.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ success: true, count: 0 }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const headers = ['id','initiative','difficulty','impact','status','revenueGrowth','marginExpansion','operations','compliance','aiStrategic','notes','owner'];

    sheet.clear();
    sheet.appendRow(headers);

    items.forEach(item => {
      sheet.appendRow(headers.map(h => {
        const v = item[h];
        if (v === undefined || v === null) return '';
        return v;
      }));
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true, count: items.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Deploy as a Web App

1. Click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set:
   - **Description**: Priorities API
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Authorize the app when prompted (click through the "unsafe" warning — it's your own script)
6. Copy the **Web app URL** — it looks like: `https://script.google.com/macros/s/ABC.../exec`

## 4. Connect to the Dashboard

1. Open the Priorities page in your browser
2. Click the **Connect Sheet** button in the header
3. Paste the Web app URL
4. Click Save — data will sync automatically

## Updating the Script

If you change the script, you must create a **New deployment** (not just save) for the changes to take effect. Go to Deploy > Manage deployments > Edit > New version.
