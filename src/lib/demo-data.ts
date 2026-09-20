import { prisma } from "./prisma";
import { hashPassword } from "./auth";

export const DEMO_USER_EMAIL = "alex.morgan@finpilot.io";
export const DEMO_USER_PASSWORD = "demoPassword123!";
export const DEMO_USER_NAME = "Alex Morgan";

export async function seedDemoUser() {
  // Check if demo user already exists
  let user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
  });

  const passwordHash = await hashPassword(DEMO_USER_PASSWORD);

  if (user) {
    // Clean existing financial records to ensure fresh demo state
    await prisma.transaction.deleteMany({ where: { userId: user.id } });
    await prisma.budgetItem.deleteMany({ where: { budget: { userId: user.id } } });
    await prisma.budget.deleteMany({ where: { userId: user.id } });
    await prisma.subscription.deleteMany({ where: { userId: user.id } });
    await prisma.bill.deleteMany({ where: { userId: user.id } });
    await prisma.goal.deleteMany({ where: { userId: user.id } });
    await prisma.account.deleteMany({ where: { userId: user.id } });
    await prisma.category.deleteMany({ where: { userId: user.id } });
    await prisma.financialInsight.deleteMany({ where: { userId: user.id } });
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.income.deleteMany({ where: { userId: user.id } });
  } else {
    user = await prisma.user.create({
      data: {
        email: DEMO_USER_EMAIL,
        name: DEMO_USER_NAME,
        passwordHash,
        role: "DEMO",
      },
    });
  }

  // 1. Profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      currency: "INR",
      country: "India",
      ageRange: "26-35",
      monthlyIncome: 145000,
      incomeFrequency: "Monthly",
      employmentType: "Senior Software Engineer",
      monthlySavingsTarget: 45000,
      existingDebt: 12500,
      emergencyFundStatus: 210000,
      theme: "dark",
      onboardingComplete: true,
    },
    update: {
      monthlyIncome: 145000,
      onboardingComplete: true,
    },
  });

  // 2. Accounts
  const hdfc = await prisma.account.create({
    data: {
      userId: user.id,
      name: "HDFC Salary Checking",
      type: "Checking",
      balance: 142500,
      currency: "INR",
      institution: "HDFC Bank",
      accountNumber: "•••• 4829",
      color: "#06B6D4",
      isDefault: true,
    },
  });

  const icici = await prisma.account.create({
    data: {
      userId: user.id,
      name: "ICICI High-Yield Savings",
      type: "Savings",
      balance: 380000,
      currency: "INR",
      institution: "ICICI Bank",
      accountNumber: "•••• 9102",
      color: "#10B981",
    },
  });

  const creditCard = await prisma.account.create({
    data: {
      userId: user.id,
      name: "Axis Atlas Credit Card",
      type: "CreditCard",
      balance: -28400,
      currency: "INR",
      institution: "Axis Bank",
      accountNumber: "•••• 1145",
      color: "#8B5CF6",
    },
  });

  const upi = await prisma.account.create({
    data: {
      userId: user.id,
      name: "UPI Wallet & Cash",
      type: "UPI",
      balance: 15000,
      currency: "INR",
      institution: "Google Pay / Cash",
      accountNumber: "alex@okhdfc",
      color: "#F59E0B",
    },
  });

  // 3. Categories
  const catNames = [
    { name: "Housing", type: "Expense", color: "#6366F1", icon: "Home" },
    { name: "Food & Dining", type: "Expense", color: "#F59E0B", icon: "Utensils" },
    { name: "Groceries", type: "Expense", color: "#10B981", icon: "ShoppingCart" },
    { name: "Cloud & Tech", type: "Expense", color: "#06B6D4", icon: "Cpu" },
    { name: "Utilities", type: "Expense", color: "#3B82F6", icon: "Zap" },
    { name: "Health & Fitness", type: "Expense", color: "#EC4899", icon: "Activity" },
    { name: "Travel & Commute", type: "Expense", color: "#8B5CF6", icon: "Compass" },
    { name: "Entertainment", type: "Expense", color: "#EF4444", icon: "Film" },
    { name: "Shopping", type: "Expense", color: "#F97316", icon: "ShoppingBag" },
    { name: "Salary", type: "Income", color: "#10B981", icon: "Briefcase" },
    { name: "Consulting", type: "Income", color: "#06B6D4", icon: "Laptop" },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of catNames) {
    const created = await prisma.category.create({
      data: {
        userId: user.id,
        name: cat.name,
        type: cat.type,
        color: cat.color,
        icon: cat.icon,
        isDefault: true,
      },
    });
    categoryMap[cat.name] = created.id;
  }

  // 4. Incomes
  await prisma.income.create({
    data: {
      userId: user.id,
      source: "TechCorp Global Salary",
      amount: 125000,
      frequency: "Monthly",
      date: new Date(2026, 2, 1),
      isRecurring: true,
      category: "Salary",
    },
  });

  await prisma.income.create({
    data: {
      userId: user.id,
      source: "AI Architecture Consulting",
      amount: 20000,
      frequency: "Monthly",
      date: new Date(2026, 2, 10),
      isRecurring: true,
      category: "Consulting",
    },
  });

  // 5. Transactions (50+ transactions across the last 45 days)
  const now = new Date();
  const txList = [
    // Income
    { amount: 125000, type: "Income", merchant: "TechCorp Salary Deposit", cat: "Salary", acc: hdfc.id, daysAgo: 19, recurring: true, method: "Net Banking" },
    { amount: 20000, type: "Income", merchant: "Client Retainer (Agentic AI)", cat: "Consulting", acc: hdfc.id, daysAgo: 10, recurring: true, method: "UPI" },
    
    // Anomalies
    { amount: 18400, type: "Expense", merchant: "Croma Electronics", cat: "Cloud & Tech", acc: creditCard.id, daysAgo: 8, recurring: false, anomaly: true, reason: "340% higher than your typical monthly tech gear spending", method: "Credit Card" },
    { amount: 4200, type: "Expense", merchant: "The Table Colaba", cat: "Food & Dining", acc: creditCard.id, daysAgo: 6, recurring: false, anomaly: true, reason: "Duplicate charge detected within 12 minutes of an identical ₹4,200 transaction", method: "Credit Card" },
    { amount: 9850, type: "Expense", merchant: "DigitalOcean Infrastructure", cat: "Cloud & Tech", acc: creditCard.id, daysAgo: 14, recurring: false, anomaly: true, reason: "Cloud hosting bill spiked 4.2x above historical average", method: "Credit Card" },

    // Housing & Utilities
    { amount: 35000, type: "Expense", merchant: "Apartment Rent (Hiranandani)", cat: "Housing", acc: hdfc.id, daysAgo: 19, recurring: true, method: "Net Banking" },
    { amount: 2840, type: "Expense", merchant: "Tata Power Mumbai", cat: "Utilities", acc: hdfc.id, daysAgo: 15, recurring: true, method: "UPI" },
    { amount: 1179, type: "Expense", merchant: "Airtel Xstream Fiber 300Mbps", cat: "Utilities", acc: hdfc.id, daysAgo: 12, recurring: true, method: "UPI" },
    { amount: 699, type: "Expense", merchant: "Jio 5G Postpaid", cat: "Utilities", acc: upi.id, daysAgo: 9, recurring: true, method: "UPI" },

    // Subscriptions
    { amount: 649, type: "Expense", merchant: "Netflix Premium Ultra 4K", cat: "Entertainment", acc: creditCard.id, daysAgo: 18, recurring: true, method: "Credit Card" },
    { amount: 179, type: "Expense", merchant: "Spotify Family", cat: "Entertainment", acc: creditCard.id, daysAgo: 17, recurring: true, method: "Credit Card" },
    { amount: 1999, type: "Expense", merchant: "OpenAI ChatGPT Plus", cat: "Cloud & Tech", acc: creditCard.id, daysAgo: 16, recurring: true, method: "Credit Card" },
    { amount: 3250, type: "Expense", merchant: "Amazon Web Services (AWS)", cat: "Cloud & Tech", acc: creditCard.id, daysAgo: 15, recurring: true, method: "Credit Card" },
    { amount: 1499, type: "Expense", merchant: "Cult.fit Elite Pass", cat: "Health & Fitness", acc: creditCard.id, daysAgo: 13, recurring: true, method: "Credit Card" },

    // Food & Dining
    { amount: 680, type: "Expense", merchant: "Swiggy - Blue Tokai Coffee", cat: "Food & Dining", acc: upi.id, daysAgo: 1, recurring: false, method: "UPI" },
    { amount: 1420, type: "Expense", merchant: "Zomato - Bastian Bandra", cat: "Food & Dining", acc: creditCard.id, daysAgo: 2, recurring: false, method: "Credit Card" },
    { amount: 450, type: "Expense", merchant: "Starbucks Reserve", cat: "Food & Dining", acc: upi.id, daysAgo: 3, recurring: false, method: "UPI" },
    { amount: 890, type: "Expense", merchant: "Swiggy Gourmet Dinner", cat: "Food & Dining", acc: upi.id, daysAgo: 4, recurring: false, method: "UPI" },
    { amount: 4200, type: "Expense", merchant: "The Table Colaba", cat: "Food & Dining", acc: creditCard.id, daysAgo: 6, recurring: false, method: "Credit Card" },
    { amount: 560, type: "Expense", merchant: "Subway Express", cat: "Food & Dining", acc: upi.id, daysAgo: 7, recurring: false, method: "UPI" },
    { amount: 1850, type: "Expense", merchant: "Social Cyber Hub", cat: "Food & Dining", acc: creditCard.id, daysAgo: 11, recurring: false, method: "Credit Card" },
    { amount: 380, type: "Expense", merchant: "Chai Point", cat: "Food & Dining", acc: upi.id, daysAgo: 13, recurring: false, method: "UPI" },
    { amount: 1200, type: "Expense", merchant: "Pizza Express", cat: "Food & Dining", acc: creditCard.id, daysAgo: 17, recurring: false, method: "Credit Card" },
    { amount: 740, type: "Expense", merchant: "McDonalds Gourmet", cat: "Food & Dining", acc: upi.id, daysAgo: 21, recurring: false, method: "UPI" },

    // Groceries
    { amount: 2450, type: "Expense", merchant: "Blinkit Instant Groceries", cat: "Groceries", acc: upi.id, daysAgo: 2, recurring: false, method: "UPI" },
    { amount: 4120, type: "Expense", merchant: "Nature's Basket Organic", cat: "Groceries", acc: creditCard.id, daysAgo: 5, recurring: false, method: "Credit Card" },
    { amount: 1890, type: "Expense", merchant: "Zepto Express Delivery", cat: "Groceries", acc: upi.id, daysAgo: 9, recurring: false, method: "UPI" },
    { amount: 3200, type: "Expense", merchant: "FreshToHome Meats & Fish", cat: "Groceries", acc: upi.id, daysAgo: 14, recurring: false, method: "UPI" },
    { amount: 1560, type: "Expense", merchant: "Blinkit Weekend Essentials", cat: "Groceries", acc: upi.id, daysAgo: 18, recurring: false, method: "UPI" },

    // Travel & Commute
    { amount: 480, type: "Expense", merchant: "Uber Premier", cat: "Travel & Commute", acc: upi.id, daysAgo: 1, recurring: false, method: "UPI" },
    { amount: 350, type: "Expense", merchant: "Uber Auto", cat: "Travel & Commute", acc: upi.id, daysAgo: 3, recurring: false, method: "UPI" },
    { amount: 2800, type: "Expense", merchant: "HP Petrol Pump Fuel", cat: "Travel & Commute", acc: creditCard.id, daysAgo: 7, recurring: false, method: "Credit Card" },
    { amount: 620, type: "Expense", merchant: "Uber to Airport Terminal 2", cat: "Travel & Commute", acc: upi.id, daysAgo: 16, recurring: false, method: "UPI" },
    { amount: 450, type: "Expense", merchant: "Fastag Toll Auto-Recharge", cat: "Travel & Commute", acc: upi.id, daysAgo: 20, recurring: true, method: "UPI" },

    // Health & Fitness
    { amount: 2200, type: "Expense", merchant: "Apollo Pharmacy Wellness", cat: "Health & Fitness", acc: creditCard.id, daysAgo: 4, recurring: false, method: "Credit Card" },
    { amount: 3500, type: "Expense", merchant: "Optimal Health Diagnostic Lab", cat: "Health & Fitness", acc: creditCard.id, daysAgo: 22, recurring: false, method: "Credit Card" },

    // Shopping
    { amount: 4299, type: "Expense", merchant: "Uniqlo Winter Jacket", cat: "Shopping", acc: creditCard.id, daysAgo: 11, recurring: false, method: "Credit Card" },
    { amount: 1899, type: "Expense", merchant: "Amazon India Essentials", cat: "Shopping", acc: creditCard.id, daysAgo: 14, recurring: false, method: "Credit Card" },
    { amount: 850, type: "Expense", merchant: "Crossword Bookstore", cat: "Shopping", acc: upi.id, daysAgo: 19, recurring: false, method: "UPI" },
  ];

  for (const tx of txList) {
    const txDate = new Date(now.getTime() - tx.daysAgo * 86400000);
    await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId: tx.acc,
        categoryId: categoryMap[tx.cat],
        amount: tx.amount,
        type: tx.type,
        date: txDate,
        merchant: tx.merchant,
        isRecurring: tx.recurring || false,
        isAnomaly: tx.anomaly || false,
        anomalyReason: tx.reason || null,
        paymentMethod: tx.method,
      },
    });
  }

  // 6. Subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        userId: user.id,
        name: "Netflix Premium Ultra HD",
        provider: "Netflix",
        amount: 649,
        billingCycle: "Monthly",
        startDate: new Date(2025, 0, 1),
        nextBillingDate: new Date(2026, 2, 28),
        category: "Entertainment",
        paymentMethod: "Axis Atlas Credit Card",
        status: "ACTIVE",
        hasPriceIncrease: false,
      },
      {
        userId: user.id,
        name: "Spotify Family Audio",
        provider: "Spotify",
        amount: 179,
        billingCycle: "Monthly",
        startDate: new Date(2024, 5, 15),
        nextBillingDate: new Date(2026, 2, 27),
        category: "Entertainment",
        paymentMethod: "Axis Atlas Credit Card",
        status: "ACTIVE",
        hasPriceIncrease: false,
      },
      {
        userId: user.id,
        name: "ChatGPT Plus & Team AI",
        provider: "OpenAI",
        amount: 1999,
        billingCycle: "Monthly",
        startDate: new Date(2024, 2, 10),
        nextBillingDate: new Date(2026, 2, 26),
        category: "Cloud & Tech",
        paymentMethod: "Axis Atlas Credit Card",
        status: "ACTIVE",
        hasPriceIncrease: true,
        previousAmount: 1650,
      },
      {
        userId: user.id,
        name: "Amazon Web Services (AWS)",
        provider: "Amazon",
        amount: 3250,
        billingCycle: "Monthly",
        startDate: new Date(2024, 8, 1),
        nextBillingDate: new Date(2026, 2, 25),
        category: "Cloud & Tech",
        paymentMethod: "Axis Atlas Credit Card",
        status: "ACTIVE",
        hasPriceIncrease: false,
      },
      {
        userId: user.id,
        name: "Cult.fit Elite Fitness",
        provider: "Cult",
        amount: 1499,
        billingCycle: "Monthly",
        startDate: new Date(2025, 6, 1),
        nextBillingDate: new Date(2026, 2, 23),
        category: "Health & Fitness",
        paymentMethod: "Axis Atlas Credit Card",
        status: "ACTIVE",
        hasPriceIncrease: false,
      },
    ],
  });

  // 7. Bills
  await prisma.bill.createMany({
    data: [
      {
        userId: user.id,
        title: "Apartment Rent",
        biller: "Hiranandani Heritage",
        category: "Housing",
        amount: 35000,
        dueDate: new Date(2026, 3, 1),
        frequency: "Monthly",
        status: "UNPAID",
        isRecurring: true,
        autoPay: false,
      },
      {
        userId: user.id,
        title: "Tata Power Electricity",
        biller: "Tata Power Mumbai",
        category: "Utilities",
        amount: 2840,
        dueDate: new Date(2026, 2, 25),
        frequency: "Monthly",
        status: "UNPAID",
        isRecurring: true,
        autoPay: true,
      },
      {
        userId: user.id,
        title: "Airtel Xstream Fiber Broadband",
        biller: "Bharti Airtel",
        category: "Utilities",
        amount: 1179,
        dueDate: new Date(2026, 2, 24),
        frequency: "Monthly",
        status: "UNPAID",
        isRecurring: true,
        autoPay: true,
      },
      {
        userId: user.id,
        title: "Star Health Comprehensive Insurance",
        biller: "Star Health Allied",
        category: "Insurance",
        amount: 3400,
        dueDate: new Date(2026, 3, 5),
        frequency: "Monthly",
        status: "UNPAID",
        isRecurring: true,
        autoPay: true,
      },
    ],
  });

  // 8. Budgets
  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      name: "March 2026 Operational Flight Plan",
      period: "Monthly",
      startDate: new Date(2026, 2, 1),
      endDate: new Date(2026, 2, 31),
      totalAmount: 95000,
      spentAmount: 76840,
    },
  });

  await prisma.budgetItem.createMany({
    data: [
      {
        budgetId: budget.id,
        categoryId: categoryMap["Housing"],
        allocated: 35000,
        spent: 35000,
      },
      {
        budgetId: budget.id,
        categoryId: categoryMap["Food & Dining"],
        allocated: 20000,
        spent: 17290,
      },
      {
        budgetId: budget.id,
        categoryId: categoryMap["Cloud & Tech"],
        allocated: 15000,
        spent: 18400, // OVERBUDGET FLAG!
      },
      {
        budgetId: budget.id,
        categoryId: categoryMap["Groceries"],
        allocated: 15000,
        spent: 13220,
      },
      {
        budgetId: budget.id,
        categoryId: categoryMap["Entertainment"],
        allocated: 10000,
        spent: 4327,
      },
    ],
  });

  // 9. Goals
  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        title: "Emergency Runway Fund (6 Mo)",
        targetAmount: 300000,
        currentAmount: 210000,
        targetDate: new Date(2026, 7, 31),
        monthlyContribution: 20000,
        category: "Emergency",
        status: "IN_PROGRESS",
      },
      {
        userId: user.id,
        title: "MacBook Pro M3 Max Studio",
        targetAmount: 240000,
        currentAmount: 160000,
        targetDate: new Date(2026, 5, 30),
        monthlyContribution: 15000,
        category: "Tech Hardware",
        status: "IN_PROGRESS",
      },
      {
        userId: user.id,
        title: "Tokyo Autumn Expedition 2026",
        targetAmount: 180000,
        currentAmount: 65000,
        targetDate: new Date(2026, 9, 15),
        monthlyContribution: 10000,
        category: "Travel",
        status: "IN_PROGRESS",
      },
    ],
  });

  // 10. Financial Insights
  await prisma.financialInsight.createMany({
    data: [
      {
        userId: user.id,
        title: "Discretionary Tech Spending Alert",
        explanation: "Your Cloud & Tech expenses exceeded the allocated monthly flight budget by ₹3,400 (+22.6%) due to the Croma purchase.",
        type: "BUDGET_WARNING",
        severity: "WARNING",
        dataBasis: "Croma Electronics transaction (₹18,400) on March 12",
        actionLabel: "View Tech Budget",
        actionUrl: "/budgets",
        period: "THIS_MONTH",
      },
      {
        userId: user.id,
        title: "Subscription Price Increase Detected",
        explanation: "OpenAI ChatGPT Plus renewed at ₹1,999 vs historical ₹1,650 (+21.1% currency fluctuation).",
        type: "SUBSCRIPTION_ALERT",
        severity: "INFO",
        dataBasis: "Comparison of last 2 billing cycles for OpenAI",
        actionLabel: "Audit Subscriptions",
        actionUrl: "/subscriptions",
        period: "THIS_WEEK",
      },
      {
        userId: user.id,
        title: "High Liquidity Surplus Opportunity",
        explanation: "Maintaining a 47% savings rate this month allows you to allocate an extra ₹15,000 toward reaching your Emergency Runway goal 45 days early.",
        type: "SAVINGS_OPPORTUNITY",
        severity: "SUCCESS",
        dataBasis: "Monthly net surplus of ₹68,160 across active accounts",
        actionLabel: "Accelerate Goal",
        actionUrl: "/goals",
        period: "TODAY",
      },
    ],
  });

  // 11. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "Upcoming Bill: Tata Power Electricity",
        message: "₹2,840 due in 5 days (March 25). AutoPay enabled on HDFC Checking.",
        type: "BILL",
        severity: "INFO",
        link: "/bills",
      },
      {
        userId: user.id,
        title: "Budget Exceeded: Cloud & Tech",
        message: "Spent ₹18,400 against ₹15,000 limit (122.6% utilized).",
        type: "BUDGET",
        severity: "WARNING",
        link: "/budgets",
      },
      {
        userId: user.id,
        title: "Unusual Anomaly Detected",
        message: "Potential duplicate charge flagged: The Table Colaba (₹4,200).",
        type: "ANOMALY",
        severity: "DANGER",
        link: "/anomalies",
      },
    ],
  });

  return user;
}
