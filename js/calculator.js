const data = window.WCP_MODEL_DATA;

const inputs = {
  startingCash: document.getElementById("startingCash"),
  fixedCosts: document.getElementById("fixedCosts"),
  roas: document.getElementById("roas"),
  wdRatio: document.getElementById("wdRatio"),
  spendMultiplier: document.getElementById("spendMultiplier"),
  pvxShare: document.getElementById("pvxShare"),
  ccShare: document.getElementById("ccShare"),
  ccLimit: document.getElementById("ccLimit"),
  startingCCRepay: document.getElementById("startingCCRepay"),
  pvxInterest: document.getElementById("pvxInterest"),
  wagerPerNet: document.getElementById("wagerPerNet"),
  houseEdge: document.getElementById("houseEdge"),
  thirdPartyShare: document.getElementById("thirdPartyShare"),
  thirdPartyCost: document.getElementById("thirdPartyCost"),
  agencyFeeRate: document.getElementById("agencyFeeRate"),
  agencySpendShare: document.getElementById("agencySpendShare"),
};

const ranges = {
  spendMultiplierValue: document.getElementById("spendMultiplierValue"),
  pvxShareValue: document.getElementById("pvxShareValue"),
  ccShareValue: document.getElementById("ccShareValue"),
};

const outputs = {
  endingCash: document.getElementById("endingCash"),
  minCash: document.getElementById("minCash"),
  endingCashMeta: document.getElementById("endingCashMeta"),
  minCashMeta: document.getElementById("minCashMeta"),
  portfolioRoas: document.getElementById("portfolioRoas"),
  payback: document.getElementById("payback"),
  cashChart: document.getElementById("cashChart"),
  chartTooltip: document.getElementById("chartTooltip"),
  cashTableBody: document.querySelector("#cashTable tbody"),
};

const formatCurrency = (value) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const formatNumber = (value) => value.toLocaleString("en-US", { maximumFractionDigits: 2 });
const formatMonthOffset = (months) => `${months} month${months === 1 ? "" : "s"} from start`;
const formatDayOffset = (days) => `${days} day${days === 1 ? "" : "s"}`;
const toDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const diffDays = (start, end) => {
  if (!start || !end) return null;
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function loadDefaults() {
  inputs.startingCash.value = data.inputs.startingCash ?? 0;
  inputs.fixedCosts.value = data.inputs.fixedCosts ?? 0;
  inputs.roas.value = data.inputs.projectedROAS ?? 2.5;
  inputs.wdRatio.value = data.inputs.wdRatio ?? 0.3;
  inputs.spendMultiplier.value = 1.0;
  inputs.pvxShare.value = averageShare("pvxSpend");
  inputs.ccShare.value = averageShare("ccSpend");
  inputs.ccLimit.value = data.inputs.ccLimit ?? 0;
  inputs.startingCCRepay.value = data.acquisitionPlan?.[0]?.ccSpend ?? 0;
  inputs.pvxInterest.value = data.inputs.pvxInterestRate ?? 0.05;
  inputs.wagerPerNet.value = data.inputs.wagerPerNet ?? 25;
  inputs.houseEdge.value = data.inputs.houseEdge ?? 0.03;
  inputs.thirdPartyShare.value = data.inputs.thirdPartyShare ?? 0.3;
  inputs.thirdPartyCost.value = data.inputs.thirdPartyCost ?? 0.08;
  inputs.agencyFeeRate.value = data.inputs.agencyFeeRate ?? 0.08;
  inputs.agencySpendShare.value = data.inputs.agencySpendShare ?? 0.7;
}

function averageShare(key) {
  const plan = data.acquisitionPlan || [];
  const totalSpend = plan.reduce((sum, row) => sum + row.totalSpend, 0) || 1;
  const totalKey = plan.reduce((sum, row) => sum + (row[key] || 0), 0);
  return Number((totalKey / totalSpend).toFixed(2));
}

function updateRangeLabels() {
  ranges.spendMultiplierValue.textContent = `${Number(inputs.spendMultiplier.value).toFixed(2)}x`;
  ranges.pvxShareValue.textContent = `${Math.round(Number(inputs.pvxShare.value) * 100)}%`;
  ranges.ccShareValue.textContent = `${Math.round(Number(inputs.ccShare.value) * 100)}%`;
}

function computeModel() {
  const months = data.acquisitionPlan.map((row) => row.date);
  const n = months.length;

  const startingCash = Number(inputs.startingCash.value) || 0;
  const fixedCosts = Number(inputs.fixedCosts.value) || 0;
  const roas = Number(inputs.roas.value) || 0;
  const wdRatio = Number(inputs.wdRatio.value) || 0;
  const spendMultiplier = Number(inputs.spendMultiplier.value) || 1;
  const pvxShare = clamp(Number(inputs.pvxShare.value) || 0, 0, 0.95);
  const ccShare = clamp(Number(inputs.ccShare.value) || 0, 0, 0.95);
  const ccLimit = Number(inputs.ccLimit.value) || 0;
  const startingCCRepay = Number(inputs.startingCCRepay.value) || 0;
  const pvxInterest = Number(inputs.pvxInterest.value) || 0;
  const wagerPerNet = Number(inputs.wagerPerNet.value) || 0;
  const houseEdge = Number(inputs.houseEdge.value) || 0;
  const thirdPartyShare = Number(inputs.thirdPartyShare.value) || 0;
  const thirdPartyCost = Number(inputs.thirdPartyCost.value) || 0;
  const agencyFeeRate = Number(inputs.agencyFeeRate.value) || 0;
  const agencySpendShare = Number(inputs.agencySpendShare.value) || 0;

  const spendTotal = [];
  const pvxSpend = [];
  const ccSpend = [];
  const cashSpend = [];

  for (let i = 0; i < n; i += 1) {
    const baseSpend = data.acquisitionPlan[i].totalSpend * spendMultiplier;
    let pvx = baseSpend * pvxShare;
    let cc = baseSpend * ccShare;
    if (ccLimit > 0) {
      cc = Math.min(cc, ccLimit);
    }
    const cash = Math.max(0, baseSpend - pvx - cc);
    spendTotal.push(baseSpend);
    pvxSpend.push(pvx);
    ccSpend.push(cc);
    cashSpend.push(cash);
  }

  const incRev = data.curves.incRev;
  const incWd = data.curves.incWd;
  const maxAge = incRev.length - 1;

  const baseReceipts = [];
  const baseWd = [];
  for (let i = 0; i < n; i += 1) {
    const baselineRow = data.baseline[i] || { receipts: 0, withdrawals: 0 };
    baseReceipts.push(baselineRow.receipts || 0);
    baseWd.push(baselineRow.withdrawals || 0);
  }

  const newReceipts = Array(n).fill(0);
  const newWd = Array(n).fill(0);

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      const age = i - j;
      if (age > maxAge) continue;
      const spend = spendTotal[j];
      newReceipts[i] += spend * roas * incRev[age];
      newWd[i] += spend * roas * wdRatio * incWd[age];
    }
  }

  const pvxPaid = Array(n).fill(0);
  const pvxCompanyNet = Array(n).fill(0);

  for (let j = 0; j < n; j += 1) {
    const draw = pvxSpend[j];
    if (draw <= 0) continue;
    const cap = draw * (1 + pvxInterest);
    let cumPaid = 0;
    let paybackReached = false;

    for (let i = j; i < n; i += 1) {
      const age = i - j;
      if (age > maxAge) continue;
      const thisNet = draw * roas * incRev[age] * (1 - wdRatio);
      if (thisNet <= 0) continue;

      const capRemaining = cap - cumPaid;
      if (capRemaining <= 0) break;

      let payment = 0;
      if (!paybackReached) {
        payment = Math.min(thisNet, capRemaining);
      } else {
        const interest = draw * pvxInterest / 12;
        payment = Math.min(thisNet * 0.5 + interest, capRemaining);
      }

      cumPaid += payment;
      if (!paybackReached && cumPaid >= draw) {
        paybackReached = true;
      }

      pvxPaid[i] += payment;
      pvxCompanyNet[i] += Math.max(0, thisNet - payment);
    }
  }

  const results = [];
  let cash = startingCash;
  let minCash = cash;
  let minCashIndex = 0;

  const totalReceipts = [];
  const totalOut = [];
  const netChange = [];
  const endCash = [];

  for (let i = 0; i < n; i += 1) {
    const totalRcpts = baseReceipts[i] + newReceipts[i] + pvxCompanyNet[i];
    const wagerVol = totalRcpts * wagerPerNet;
    const thirdPartyGameCost = wagerVol * houseEdge * thirdPartyShare * thirdPartyCost;
    const agencyFee = spendTotal[i] * agencySpendShare * agencyFeeRate;
    const ccRepay = i === 0 ? startingCCRepay : ccSpend[i - 1];

    const out = baseWd[i] + newWd[i] + pvxPaid[i] + thirdPartyGameCost + agencyFee + fixedCosts + cashSpend[i] + ccRepay;
    const change = totalRcpts - out;

    totalReceipts.push(totalRcpts);
    totalOut.push(out);
    netChange.push(change);

    const startCash = cash;
    cash += change;
    endCash.push(cash);
    if (cash < minCash) {
      minCash = cash;
      minCashIndex = i;
    }

    results.push({
      month: months[i],
      startCash,
      totalReceipts: totalRcpts,
      totalOut: out,
      netChange: change,
      endCash: cash,
    });
  }

  const totalSpend = spendTotal.reduce((sum, v) => sum + v, 0);
  const totalNewReceipts = newReceipts.reduce((sum, v) => sum + v, 0);
  const portfolioRoas = totalSpend > 0 ? totalNewReceipts / totalSpend : 0;

  const startDate = toDate(months[0]);
  let paybackLabel = "No payback";
  let cumulativeSpend = 0;
  let cumulativeNet = 0;
  for (let i = 0; i < n; i += 1) {
    cumulativeSpend += spendTotal[i];
    cumulativeNet += newReceipts[i] - newWd[i];
    if (cumulativeNet >= cumulativeSpend) {
      const endDate = toDate(months[i]);
      const days = diffDays(startDate, endDate);
      paybackLabel = days !== null ? formatDayOffset(days) : `${i + 1} months`;
      break;
    }
  }

  return {
    results,
    endCash: endCash[endCash.length - 1] || 0,
    minCash,
    minCashIndex,
    portfolioRoas,
    paybackLabel,
    startDate,
    endDate: toDate(months[months.length - 1]),
  };
}

function renderTable(rows) {
  outputs.cashTableBody.innerHTML = "";
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.month}</td>
      <td>${formatCurrency(row.startCash)}</td>
      <td>${formatCurrency(row.totalReceipts)}</td>
      <td>${formatCurrency(row.totalOut)}</td>
      <td>${formatCurrency(row.netChange)}</td>
      <td>${formatCurrency(row.endCash)}</td>
    `;
    outputs.cashTableBody.appendChild(tr);
  });
}

function renderChart(rows, baselineRows) {
  const svg = outputs.cashChart;
  const width = 800;
  const height = 280;

  const values = rows.map((row) => row.endCash);
  const baselineValues = baselineRows ? baselineRows.map((row) => row.endCash) : [];
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const padding = 20;

  const scaleX = (index) => (index / (values.length - 1 || 1)) * (width - padding * 2) + padding;
  const scaleY = (value) => {
    if (max === min) return height / 2;
    return height - padding - ((value - min) / (max - min)) * (height - padding * 2);
  };

  let path = "";
  values.forEach((value, index) => {
    const x = scaleX(index);
    const y = scaleY(value);
    path += `${index === 0 ? "M" : "L"}${x},${y} `;
  });

  const areaPath = `${path} L ${scaleX(values.length - 1)},${height - padding} L ${scaleX(0)},${height - padding} Z`;

  let baselinePath = "";
  baselineValues.forEach((value, index) => {
    const x = scaleX(index);
    const y = scaleY(value);
    baselinePath += `${index === 0 ? "M" : "L"}${x},${y} `;
  });

  const points = values
    .map((value, index) => {
      const x = scaleX(index);
      const y = scaleY(value);
      const label = rows[index].month;
      return `<circle class="chart-point" cx="${x}" cy="${y}" r="4" data-index="${index}" data-label="${label}" data-value="${value}" />`;
    })
    .join("");

  const xTicks = [0, Math.floor((values.length - 1) / 2), values.length - 1];
  const yTicks = 4;
  let gridLines = "";
  let yLabels = "";
  for (let i = 0; i <= yTicks; i += 1) {
    const yValue = min + ((max - min) * i) / yTicks;
    const y = scaleY(yValue);
    gridLines += `<line class="chart-grid" x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" />`;
    yLabels += `<text class="chart-axis" x="${padding - 6}" y="${y + 4}" text-anchor="end">${Math.round(yValue / 1000)}k</text>`;
  }

  let xLabels = "";
  xTicks.forEach((tick) => {
    const x = scaleX(tick);
    xLabels += `<text class="chart-axis" x="${x}" y="${height - 4}" text-anchor="middle">M${tick + 1}</text>`;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0, 222, 62, 0.5)" />
        <stop offset="100%" stop-color="rgba(0, 222, 62, 0.05)" />
      </linearGradient>
    </defs>
    ${gridLines}
    ${yLabels}
    ${xLabels}
    <text class="chart-axis" x="${padding}" y="${padding - 6}">Cash balance ($)</text>
    <text class="chart-axis" x="${width - padding}" y="${height - 6}" text-anchor="end">Months</text>
    <path d="${areaPath}" fill="url(#cashGradient)" />
    ${baselinePath ? `<path d="${baselinePath}" class="chart-baseline" />` : ""}
    <path d="${path}" fill="none" stroke="#00de3e" stroke-width="3" />
    ${points}
  `;

  const tooltip = outputs.chartTooltip;
  const chartContainer = svg.parentElement;
  const pointNodes = svg.querySelectorAll(".chart-point");
  pointNodes.forEach((point) => {
    point.addEventListener("mouseenter", (event) => {
      const value = Number(event.target.dataset.value || 0);
      const label = event.target.dataset.label || "";
      tooltip.textContent = `${label} · ${formatCurrency(value)}`;
      tooltip.style.opacity = "1";
    });
    point.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
    point.addEventListener("mousemove", (event) => {
      const rect = chartContainer.getBoundingClientRect();
      tooltip.style.left = `${event.clientX - rect.left}px`;
      tooltip.style.top = `${event.clientY - rect.top - 10}px`;
    });
  });
}

function update() {
  updateRangeLabels();
  const model = computeModel();
  const endOffset = formatMonthOffset(model.results.length - 1);
  outputs.endingCash.textContent = formatCurrency(model.endCash);
  outputs.endingCashMeta.textContent = endOffset;

  const minOffset = formatMonthOffset(model.minCashIndex);
  outputs.minCash.textContent = formatCurrency(model.minCash);
  outputs.minCashMeta.textContent = minOffset;
  outputs.portfolioRoas.textContent = `${formatNumber(model.portfolioRoas)}x`;
  outputs.payback.textContent = model.paybackLabel;
  renderTable(model.results);
  renderChart(model.results, baselineModel?.results);
}

function bindInputs() {
  Object.values(inputs).forEach((input) => {
    input.addEventListener("input", update);
  });
}

loadDefaults();
const baselineModel = computeModel();
bindInputs();
update();
