# Ember CEO Dashboard

An executive decision cockpit for Ember - a consumer Web3/sweepstakes gaming company.

![Dashboard Preview](https://via.placeholder.com/1200x600/0A0A0A/10B981?text=Ember+CEO+Dashboard)

## Features

- **Executive Snapshot**: DAU, MAU, Stickiness, Revenue, Gross Margin, Cash Position
- **Growth Quality**: User acquisition breakdown, retention curves, K-factor, activation funnel
- **Monetization & Economics**: Revenue composition, ARPDAU/ARPU, unit economics, house edge, reward payout
- **Risk & Leakage**: Churn, whale dependency, reward abuse, promo dependency, platform risk
- **CEO Focus Panel**: AI-generated insights highlighting top priority, biggest lever, and early warnings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start — See a Demo

### Prerequisites

- **Node.js 18+** and **npm** (or yarn)

### Run the CEO dashboard (important: use this app’s folder)

The CEO dashboard is the **ember-dashboard** app. Run everything from inside that folder so you don’t start the wrong project (e.g. macro-tracker).

1. **Open a terminal and go to the folder that contains `ember-dashboard`** (e.g. your repo root):
   ```bash
   cd "/Users/alexwang/GitHub Test"
   cd ember-dashboard
   ```
   If you’re already in the repo root, `cd ember-dashboard` is enough.

2. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```
   This app is set to use **port 3010**, so you should see:
   `Local: http://localhost:3010`

4. **Open http://localhost:3010** in your browser. The CEO dashboard loads with mock data — no API or env vars required.

To stop the server: press `Ctrl+C` in the terminal.

**If you see 404 or “missing required error components”:** You may be running a different app (e.g. macro-tracker). Stop that server (Ctrl+C), then from this folder run `npm run dev` and open **http://localhost:3010** (this app uses port 3010 on purpose so it doesn’t get mixed up with other Next apps).

### Production build (optional)

From **ember-dashboard**:
```bash
npm run build
npm start
```
Then open the URL shown (e.g. [http://localhost:3000](http://localhost:3000)).

## Project Structure

```
ember-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main dashboard page
│   ├── components/
│   │   ├── CEOFocus.tsx      # CEO insights panel
│   │   ├── ExecutiveSnapshot.tsx
│   │   ├── GrowthQuality.tsx
│   │   ├── KPITile.tsx       # Reusable KPI component
│   │   ├── MonetizationEconomics.tsx
│   │   └── RiskLeakage.tsx
│   └── lib/
│       └── mockData.ts       # Mock data for development
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Design System

### Color Palette

- **Background**: `#0A0A0A` (pure black)
- **Card BG**: `#121212` (slightly lighter)
- **Accent Green**: `#10B981` (emerald-500)
- **Warning Yellow**: `#F59E0B` (amber-500)
- **Danger Red**: `#EF4444` (red-500)

### Typography

- **Metric Values**: 48px, Bold
- **Section Headers**: 24px, Semibold
- **Body Text**: 16px, Regular

## Data Integration

Currently uses **mock data** from `src/lib/mockData.ts`.

To integrate with real data:

1. Create an API endpoint in `src/app/api/metrics/route.ts`
2. Replace mock imports with API calls
3. Add loading states and error handling

Example API integration:

```typescript
// src/app/page.tsx
const fetchMetrics = async () => {
  const response = await fetch('/api/metrics')
  return response.json()
}
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

Create a `.env.local` file:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.ember.com
API_KEY=your_api_key_here

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_TIME=true
```

## Customization

### Update Metrics

Edit `src/lib/mockData.ts` to change metric values and thresholds.

### Add New Charts

Use Recharts components:

```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts'

<LineChart data={yourData}>
  <XAxis dataKey="name" />
  <YAxis />
  <Line type="monotone" dataKey="value" stroke="#10B981" />
</LineChart>
```

### Modify Thresholds

Risk indicators use conditional logic:

```typescript
status={value > 60 ? 'danger' : value > 40 ? 'warning' : 'good'}
```

## Performance Optimization

- All components use React Server Components by default
- Charts are client-side (`'use client'` directive)
- Mock data is statically imported (no fetch overhead)
- Tailwind CSS is purged in production

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Historical data comparison (WoW, MoM, YoY)
- [ ] Export to PDF/PowerPoint
- [ ] Custom date range selector
- [ ] Mobile-optimized view
- [ ] Dark/Light mode toggle (currently dark only)
- [ ] User authentication & role-based access

## Troubleshooting

**Port already in use**:
```bash
npm run dev -- -p 3001
```

**Type errors**:
```bash
npm run build
```

**Charts not rendering**:
- Ensure Recharts is installed: `npm install recharts`
- Check browser console for errors

## License

Proprietary - Ember Internal Use Only

## Support

For questions or issues, contact the engineering team.

---

**Remember**: This is a decision instrument, not a reporting tool. It should answer "Are we winning?" at a glance.
