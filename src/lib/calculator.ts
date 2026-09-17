// Pure math for the calculator. Do not round during math — only when formatting for display.

export type ResidualOption = 'buyout10' | 'residualPercent' | 'residualDollar';
export type AdvancePayments = 0 | 1 | 2;

export type ScheduleRowType = 'LEASE' | 'ADVANCE' | 'REGULAR' | 'BUYOUT';

export type ScheduleRow = {
  index: number;
  type: ScheduleRowType;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export function monthlyRate(aprPercent: number): number {
  return aprPercent / 12 / 100;
}

export function downPaymentAmount(price: number, downPercent: number): number {
  return price * (downPercent / 100);
}

export function downPaymentPercent(price: number, downAmount: number): number {
  if (price <= 0) return 0;
  return (downAmount / price) * 100;
}

export function residualValue(
  price: number,
  option: ResidualOption,
  residualPercent: number,
  residualDollar: number
): number {
  if (option === 'buyout10') return 10;
  if (option === 'residualPercent') return price * (residualPercent / 100);
  return residualDollar;
}

export type LeaseInput = {
  price: number;
  down: number;
  aprPercent: number;
  termMonths: number;
  advancePayments: AdvancePayments;
  residual: number;
};

export type LeaseResult = {
  r: number;
  capCost: number;
  m: number;
  f: number;
  payment: number;
  advanceDue: number;
  dueAtSigning: number;
  totalDepreciation: number;
  totalInterest: number;
  totalLeaseCost: number;
  allInCost: number;
  schedule: ScheduleRow[];
};

export function calculateLease(input: LeaseInput): LeaseResult {
  const { price, down, aprPercent, termMonths, advancePayments: a, residual } = input;
  const r = monthlyRate(aprPercent);
  const capCost = price - down;
  const n = termMonths;
  const m = n - a;
  const f = Math.pow(1 + r, m);

  let X: number;
  if (r === 0) {
    X = (capCost - residual) / n;
  } else {
    X = (capCost * f - residual) / ((f - 1) / r + a * f);
  }

  const advanceDue = a * X;
  const dueAtSigning = down + advanceDue;
  const totalDepreciation = capCost - residual;

  const schedule: ScheduleRow[] = [];
  let balance = capCost;
  schedule.push({ index: 0, type: 'LEASE', payment: 0, interest: 0, principal: 0, balance });

  for (let i = 1; i <= a; i++) {
    balance -= X;
    schedule.push({ index: i, type: 'ADVANCE', payment: X, interest: 0, principal: X, balance });
  }

  let totalInterest = 0;
  for (let i = 1; i <= m; i++) {
    const interest = balance * r;
    const principal = X - interest;
    balance -= principal;
    totalInterest += interest;
    schedule.push({ index: a + i, type: 'REGULAR', payment: X, interest, principal, balance });
  }

  schedule.push({ index: n + 1, type: 'BUYOUT', payment: residual, interest: 0, principal: residual, balance: 0 });

  const totalLeaseCost = down + totalDepreciation + totalInterest;
  const allInCost = totalLeaseCost + residual;

  return {
    r,
    capCost,
    m,
    f,
    payment: X,
    advanceDue,
    dueAtSigning,
    totalDepreciation,
    totalInterest,
    totalLeaseCost,
    allInCost,
    schedule,
  };
}

export type LoanInput = {
  price: number;
  down: number;
  aprPercent: number;
  termMonths: number;
};

export type LoanResult = {
  r: number;
  loanAmount: number;
  payment: number;
  totalInterest: number;
  totalLoanCost: number;
  totalPaid: number;
};

export function calculateLoan(input: LoanInput): LoanResult {
  const { price, down, aprPercent, termMonths: n } = input;
  const r = monthlyRate(aprPercent);
  const loanAmount = price - down;

  let payment: number;
  if (r === 0) {
    payment = loanAmount / n;
  } else {
    payment = (loanAmount * r) / (1 - Math.pow(1 + r, -n));
  }

  const totalInterest = payment * n - loanAmount;
  const totalLoanCost = loanAmount + totalInterest;
  const totalPaid = totalLoanCost + down;

  return { r, loanAmount, payment, totalInterest, totalLoanCost, totalPaid };
}

export type AffordInput = {
  payment: number;
  down: number;
  aprPercent: number;
  termMonths: number;
};

export type AffordResult = {
  r: number;
  maxFinanced: number;
  totalBudget: number;
};

export function calculateAfford(input: AffordInput): AffordResult {
  const { payment, down, aprPercent, termMonths: n } = input;
  const r = monthlyRate(aprPercent);

  let maxFinanced: number;
  if (r === 0) {
    maxFinanced = payment * n;
  } else {
    maxFinanced = (payment * (1 - Math.pow(1 + r, -n))) / r;
  }

  const totalBudget = maxFinanced + down;

  return { r, maxFinanced, totalBudget };
}

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

export function roundPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 10) / 10;
}
