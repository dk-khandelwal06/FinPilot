export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  currency: string;
  avatarUrl?: string | null;
  country: string;
  ageRange?: string | null;
  monthlyIncome: number;
  incomeFrequency: string;
  employmentType: string;
  monthlySavingsTarget: number;
  existingDebt: number;
  emergencyFundStatus: number;
  theme: string;
  onboardingComplete: boolean;
}

export interface FinancialMetricSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  remainingBudget: number;
  totalBudget: number;
  budgetUtilization: number;
  cashFlowNet: number;
}

export interface TransactionItem {
  id: string;
  userId: string;
  accountId?: string | null;
  accountName?: string;
  categoryId?: string | null;
  categoryName?: string;
  categoryColor?: string;
  amount: number;
  type: 'Expense' | 'Income' | 'Transfer';
  date: string;
  merchant: string;
  notes?: string | null;
  tags?: string | null;
  paymentMethod?: string | null;
  isRecurring: boolean;
  isAnomaly: boolean;
  anomalyReason?: string | null;
  receiptUrl?: string | null;
}

export interface BudgetItemSummary {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization: number;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  provider?: string | null;
  amount: number;
  currency: string;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string;
  category: string;
  paymentMethod?: string | null;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  hasPriceIncrease: boolean;
  previousAmount?: number | null;
  notes?: string | null;
}

export interface BillItem {
  id: string;
  title: string;
  biller: string;
  category: string;
  amount: number;
  dueDate: string;
  frequency: string;
  status: 'UNPAID' | 'PAID' | 'OVERDUE';
  isRecurring: boolean;
  autoPay: boolean;
  notes?: string | null;
}

export interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  progressPercentage: number;
  estimatedCompletionMonths: number;
  notes?: string | null;
}

export interface AccountItem {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  institution?: string | null;
  accountNumber?: string | null;
  color?: string | null;
  isDefault: boolean;
}

export interface FlightHealthScore {
  overallScore: number;
  statusTier: 'OPTIMAL' | 'STABLE' | 'NEEDS_ATTENTION' | 'CRITICAL';
  dimensions: {
    savings: { score: number; max: 15; label: string; status: string; detail: string };
    spending: { score: number; max: 20; label: string; status: string; detail: string };
    budget: { score: number; max: 15; label: string; status: string; detail: string };
    debt: { score: number; max: 15; label: string; status: string; detail: string };
    emergencyFund: { score: number; max: 15; label: string; status: string; detail: string };
    cashFlow: { score: number; max: 10; label: string; status: string; detail: string };
    goals: { score: number; max: 10; label: string; status: string; detail: string };
  };
  keyTakeaway: string;
  actionRecommendations: string[];
}

export interface AIInsightItem {
  id: string;
  title: string;
  explanation: string;
  type: string;
  severity: 'INFO' | 'WARNING' | 'SUCCESS' | 'DANGER';
  dataBasis?: string | null;
  actionLabel?: string | null;
  actionUrl?: string | null;
  isDismissed: boolean;
  isSaved: boolean;
  period: string;
}

export interface AffordabilityAnalysis {
  purchaseAmount: number;
  purchaseName: string;
  canAfford: 'YES_COMFORTABLE' | 'FEASIBLE_WITH_ADJUSTMENTS' | 'NOT_RECOMMENDED';
  impactSummary: string;
  currentMonthlySurplus: number;
  projectedMonthlySurplus: number;
  budgetImpact: {
    category: string;
    currentAllocated: number;
    currentSpent: number;
    newTotal: number;
    willExceed: boolean;
    overageAmount: number;
  };
  goalImpact: {
    affectedGoalName: string;
    delayMonths: number;
    message: string;
  };
  cashFlowImpact: {
    lowBalanceWarning: boolean;
    lowestProjectedBalance: number;
    projectedDate: string;
  };
  alternativeOptions: string[];
  calculationsExplanation: string[];
}

export interface WhatIfSimulationResult {
  scenarioName: string;
  baseline: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySurplus: number;
    savingsRate: number;
    projectedYearEndBalance: number;
  };
  simulated: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySurplus: number;
    savingsRate: number;
    projectedYearEndBalance: number;
  };
  deltas: {
    surplusChange: number;
    savingsRateChange: number;
    annualNetImpact: number;
  };
  keyObservations: string[];
  recommendedAdjustments: string[];
}
