const STORAGE_KEY = "ld_demo_wallet";
const BONUS_KEY = "ld_daily_bonus";
const STARTING_BALANCE = 1000;
const SPIN_COST = 25;
const DAILY_BONUS = 200;

const symbols = [
  { label: "Seven", icon: "7", multiplier: 10 },
  { label: "Star", icon: "★", multiplier: 5 },
  { label: "Bell", icon: "🔔", multiplier: 3 },
  { label: "Cherry", icon: "🍒", multiplier: 2 },
  { label: "Lemon", icon: "🍋", multiplier: 1 },
];

function readBalance() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    localStorage.setItem(STORAGE_KEY, String(STARTING_BALANCE));
    return STARTING_BALANCE;
  }
  return Number(stored);
}

function writeBalance(value) {
  localStorage.setItem(STORAGE_KEY, String(value));
}

function formatNumber(value) {
  return Number(value).toLocaleString();
}

function updateBalanceUI() {
  const balance = readBalance();
  document.querySelectorAll("#balance").forEach((node) => {
    node.textContent = formatNumber(balance);
  });
}

function randomSymbol() {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

function spinOnce() {
  const message = document.getElementById("message");
  const symbolNode = document.getElementById("slotSymbol");
  let balance = readBalance();

  if (balance < SPIN_COST) {
    if (message) {
      message.textContent = "Not enough coins. Claim a bonus in Account.";
    }
    return;
  }

  balance -= SPIN_COST;
  const result = randomSymbol();
  const payout = SPIN_COST * result.multiplier;
  balance += payout;
  writeBalance(balance);

  if (symbolNode) {
    symbolNode.textContent = result.icon;
  }
  if (message) {
    message.textContent = `Hit ${result.label} — payout ${payout} coins.`;
  }
  updateBalanceUI();
}

function autoSpin(times = 5) {
  let spins = 0;
  const interval = setInterval(() => {
    spins += 1;
    spinOnce();
    if (spins >= times) {
      clearInterval(interval);
    }
  }, 400);
}

function canClaimBonus() {
  const lastClaim = localStorage.getItem(BONUS_KEY);
  if (!lastClaim) return true;
  const last = new Date(lastClaim);
  const now = new Date();
  return now.toDateString() !== last.toDateString();
}

function claimBonus() {
  const message = document.getElementById("bonusMessage");
  if (!canClaimBonus()) {
    if (message) {
      message.textContent = "Bonus already claimed today. Come back tomorrow.";
    }
    return;
  }

  const balance = readBalance() + DAILY_BONUS;
  writeBalance(balance);
  localStorage.setItem(BONUS_KEY, new Date().toISOString());
  updateBalanceUI();

  if (message) {
    message.textContent = `Daily bonus claimed! +${DAILY_BONUS} coins.`;
  }
}

function resetWallet() {
  writeBalance(STARTING_BALANCE);
  localStorage.removeItem(BONUS_KEY);
  updateBalanceUI();
  const message = document.getElementById("bonusMessage");
  if (message) {
    message.textContent = "Wallet reset. Daily bonus available.";
  }
  const status = document.getElementById("message");
  if (status) {
    status.textContent = "Wallet reset. Ready to spin.";
  }
}

function bindGameControls() {
  const spinBtn = document.getElementById("spinBtn");
  const autoBtn = document.getElementById("autoBtn");
  if (spinBtn) {
    spinBtn.addEventListener("click", spinOnce);
  }
  if (autoBtn) {
    autoBtn.addEventListener("click", () => autoSpin(5));
  }
}

function bindAccountControls() {
  const bonusBtn = document.getElementById("bonusBtn");
  const resetBtn = document.getElementById("resetBtn");
  if (bonusBtn) {
    bonusBtn.addEventListener("click", claimBonus);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", resetWallet);
  }
}

function init() {
  updateBalanceUI();
  bindGameControls();
  bindAccountControls();
}

document.addEventListener("DOMContentLoaded", init);
