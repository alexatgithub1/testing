# File Upload Feature - Quick Guide

## What I Added

A drag-and-drop file upload system that analyzes Excel, PDF, and PNG files and integrates the data into your dashboard.

## How to Use

### 1. Install New Dependencies

```bash
cd "/Users/alexwang/GitHub Test/ember-dashboard"
npm install
```

### 2. Start the Dashboard

```bash
npm run dev
```

### 3. Upload Files

1. Click the **"Upload Data"** button in the top-right corner
2. Drag & drop or click to upload:
   - **Excel files** (.xlsx, .xls, .csv)
   - **PDF files** (.pdf) - coming soon
   - **Images** (.png, .jpg) - coming soon

## What Gets Analyzed

### Excel Files (Fully Implemented)

The system automatically detects and analyzes:

**Columns it looks for:**
- Dates (any column with "date", "time", "day" in name)
- Revenue (columns with "revenue", "sales", "income")
- DAU (Daily Active Users)
- MAU (Monthly Active Users)
- Any other numeric data

**What you get back:**
- Total revenue
- Average metrics
- Latest values for DAU/MAU
- Sparkline data for charts
- Row count and column summary

### PDF Files (Placeholder)

Currently returns a message to convert to Excel. To fully implement, you'd need to add the `pdf-parse` library logic.

### Images (Placeholder)

Currently returns a message about needing Claude Vision API. To implement:
1. Add your Anthropic API key
2. Send image to Claude Vision API
3. Extract data from charts/screenshots

## File Structure

```
src/
├── components/
│   └── FileUpload.tsx          # Drag-and-drop component
├── app/api/
│   └── analyze-file/
│       └── route.ts            # File processing logic
├── lib/
│   ├── dataStore.ts            # State management (Zustand)
│   └── mockData.ts             # Original mock data
└── app/
    └── page.tsx                # Updated dashboard with upload button
```

## Example Excel Format

Your Excel should look like this:

| Date       | DAU    | MAU     | Revenue |
|------------|--------|---------|---------|
| 2024-01-01 | 50000  | 800000  | 25000   |
| 2024-01-02 | 52000  | 810000  | 26500   |
| 2024-01-03 | 54000  | 815000  | 27200   |

The system will:
1. Auto-detect these columns
2. Calculate totals and averages
3. Extract sparkline data
4. Update the dashboard metrics

## Advanced: Adding Claude Vision for Images

To analyze screenshots or charts:

1. **Get an API key** from https://console.anthropic.com
2. **Add to `.env.local`**:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
3. **Update `route.ts`** analyzeImage function:
   ```typescript
   import Anthropic from '@anthropic-ai/sdk'

   const anthropic = new Anthropic({
     apiKey: process.env.ANTHROPIC_API_KEY,
   })

   const message = await anthropic.messages.create({
     model: 'claude-3-5-sonnet-20241022',
     max_tokens: 1024,
     messages: [{
       role: 'user',
       content: [
         {
           type: 'image',
           source: {
             type: 'base64',
             media_type: mimeType,
             data: buffer.toString('base64'),
           },
         },
         {
           type: 'text',
           text: 'Extract all metrics from this image and return as JSON...'
         }
       ],
     }],
   })
   ```

## Troubleshooting

**"Cannot find module 'react-dropzone'"**
```bash
npm install
```

**File upload fails**
- Check file size (<10MB recommended)
- Ensure it's .xlsx, .xls, or .csv format
- Check browser console for errors

**Data not updating**
- Refresh the page
- Check Network tab in DevTools for API errors
- Console log the analyzed data

## Next Steps

- [ ] Add real-time chart updates
- [ ] Persist uploaded data in localStorage
- [ ] Add multiple file uploads
- [ ] Implement PDF parsing
- [ ] Implement image analysis with Claude Vision
- [ ] Add export functionality
- [ ] Add data validation & error handling

## API Response Format

When a file is analyzed successfully:

```json
{
  "success": true,
  "fileName": "january_metrics.xlsx",
  "fileType": "xlsx",
  "data": {
    "totalRows": 31,
    "columnsDetected": ["Date", "DAU", "MAU", "Revenue"],
    "metrics": {
      "revenue": {
        "values": [25000, 26500, ...],
        "total": 775000,
        "average": 25000
      },
      "dau": {
        "values": [50000, 52000, ...],
        "latest": 54000,
        "average": 51500
      }
    },
    "dates": ["2024-01-01", "2024-01-02", ...],
    "rawData": [...first 10 rows...]
  }
}
```

This data then gets transformed to match your dashboard's data structure.
