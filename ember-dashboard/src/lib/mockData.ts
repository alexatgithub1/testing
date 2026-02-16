export const mockData = {
  // Executive Snapshot
  dau: {
    value: 247842,
    change: 3.2,
    sparkline: [234000, 238000, 241000, 243000, 245000, 247000, 247842],
  },
  mau: {
    value: 1840000,
    change: 8.1,
    sparkline: Array.from({ length: 30 }, (_, i) => 1700000 + i * 4667),
  },
  stickiness: {
    value: 13.5,
    change: -0.8,
    target: 15,
  },
  revenue: {
    mtd: 847000,
    change: 12.3,
    projected: 1260000,
  },
  grossMargin: {
    value: 68.4,
    change: 2.1,
    cogs: 267000,
  },
  cash: {
    runway: 4.2,
    weeklyBurn: -89000,
    breakEven: 'Q3 2026',
  },
  wagerVolume: {
    value: 8.42, // $M wagered (MTD or LW)
    change: 5.8,
    sparkline: [7.2, 7.5, 7.8, 8.0, 8.1, 8.2, 8.42],
    label: 'MTD',
  },
  ggr: {
    value: 412000, // Gross Gaming Revenue $
    change: 8.2,
    sparkline: [360000, 372000, 385000, 395000, 402000, 408000, 412000],
  },

  // Growth Quality
  newUsers: {
    total: 42384,
    breakdown: [
      { week: 'W1', organic: 8000, paidBranded: 12000, paidUAC: 10000, referral: 5000 },
      { week: 'W2', organic: 9000, paidBranded: 11000, paidUAC: 11000, referral: 6000 },
      { week: 'W3', organic: 10000, paidBranded: 10000, paidUAC: 12000, referral: 7000 },
      { week: 'W4', organic: 11000, paidBranded: 9000, paidUAC: 13000, referral: 7500 },
      { week: 'W5', organic: 12000, paidBranded: 8000, paidUAC: 14000, referral: 7000 },
      { week: 'W6', organic: 11500, paidBranded: 9000, paidUAC: 13500, referral: 7200 },
      { week: 'W7', organic: 12500, paidBranded: 8500, paidUAC: 13000, referral: 7300 },
      { week: 'W8', organic: 13148, paidBranded: 8236, paidUAC: 13800, referral: 7200 },
    ],
    organicPct: 31,
    organicChange: 4,
    paidPct: 52,
    referralPct: 17,
  },

  retention: {
    d7: 28.3,
    d7Change: 1.2,
    d30: 12.1,
    d30Change: -0.6,
    unboundedD7: 32.4,
    curves: [
      { day: 'D0', current: 100, prior: 100, fourWeeksAgo: 100 },
      { day: 'D1', current: 68, prior: 65, fourWeeksAgo: 62 },
      { day: 'D3', current: 45, prior: 42, fourWeeksAgo: 38 },
      { day: 'D7', current: 28, prior: 27, fourWeeksAgo: 25 },
      { day: 'D14', current: 18, prior: 17, fourWeeksAgo: 15 },
      { day: 'D30', current: 12, prior: 13, fourWeeksAgo: 11 },
    ],
  },

  kFactor: {
    value: 0.34,
    trend: [0.28, 0.31, 0.33, 0.34],
    target: 0.50,
  },

  activation: {
    install: { value: 42384, pct: 100 },
    signUp: { value: 36874, pct: 87 },
    firstDeposit: { value: 9324, pct: 22 },
    firstWithdrawal: { value: 7629, pct: 18 },
  },

  // Monetization
  revenueComposition: [
    { week: 'W1', ad: 320000, game: 210000, tournament: 150000 },
    { week: 'W2', ad: 340000, game: 220000, tournament: 145000 },
    { week: 'W3', ad: 360000, game: 230000, tournament: 155000 },
    { week: 'W4', ad: 380000, game: 240000, tournament: 160000 },
    { week: 'W5', ad: 390000, game: 250000, tournament: 158000 },
    { week: 'W6', ad: 395000, game: 255000, tournament: 162000 },
    { week: 'W7', ad: 400000, game: 260000, tournament: 165000 },
    { week: 'W8', ad: 405000, game: 262000, tournament: 166000 },
    { week: 'W9', ad: 408000, game: 264000, tournament: 167000 },
    { week: 'W10', ad: 410000, game: 266000, tournament: 167500 },
    { week: 'W11', ad: 411000, game: 267000, tournament: 168000 },
    { week: 'W12', ad: 412000, game: 267000, tournament: 168000 },
  ],

  arpdau: {
    current: 0.42,
    change: 0.03,
    trend: [0.35, 0.37, 0.38, 0.39, 0.40, 0.41, 0.42, 0.42],
  },

  arpu30: {
    current: 12.60,
    change: -0.80,
    trend: [13.20, 13.40, 13.30, 13.10, 12.90, 12.80, 12.70, 12.60],
  },

  unitEconomics: {
    ltv: { value: 47.20, trend: [42, 44, 46, 47.20] },
    cac: { value: 18.30, trend: [22, 20, 19, 18.30] },
    ltvCacRatio: { value: 2.58, trend: [1.9, 2.2, 2.4, 2.58] },
    payback: { value: 42, trend: [58, 52, 46, 42] },
  },

  houseEdge: {
    current: 10.2,
    trend: [8.5, 9.2, 9.8, 10.1, 10.2, 10.3, 10.2, 10.2],
    targetMin: 8,
    targetMax: 12,
  },

  rewardPayout: {
    current: 73,
    targetMin: 65,
    targetMax: 75,
  },

  // Risk & Leakage
  churn: {
    value: 28.4,
    change: 3.2,
    topReason: 'Low balance',
    status: 'warning',
  },

  whaleDependency: {
    value: 47,
    change: 2,
    status: 'warning',
  },

  rewardAbuse: {
    value: 4.2,
    change: -0.8,
    incidents: 127,
    status: 'good',
  },

  promoDependency: {
    value: 64,
    change: 8,
    organicDau: 89224,
    status: 'danger',
  },

  platformRisk: {
    appStoreStatus: 'Review pending',
    highRiskGeoRevenue: 18,
    status: 'warning',
  },

  // CEO Focus
  ceoInsights: [
    {
      type: 'priority',
      title: 'TOP PRIORITY',
      message: 'ARPDAU down 6.2% WoW, driven by lower tournament entry from mid-tier users ($10-50 depositors).',
      action: '→ Action: Review tournament pricing & entry fees',
    },
    {
      type: 'upside',
      title: 'BIGGEST UPSIDE LEVER',
      message: 'D7 retention improved to 28.3% (+1.2pp). If we can push this to 32%, LTV increases by ~$8-10.',
      action: '→ Action: Double down on D3-D7 engagement features',
    },
    {
      type: 'warning',
      title: 'EARLY WARNING',
      message: 'Organic % declining for 3 consecutive weeks. Paid efficiency (CPM) up 22% MoM.',
      action: '→ Action: Audit referral program & viral loops',
    },
  ],
}
