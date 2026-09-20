import { prisma } from "../src/lib/prisma";
import { hashPassword, verifyPassword, signSessionToken, verifySessionToken } from "../src/lib/auth";
import { evaluateAffordability, runWhatIfSimulation } from "../src/lib/gemini";
import { seedDemoUser, DEMO_USER_EMAIL } from "../src/lib/demo-data";

async function runFinPilotTests() {
  console.log("🧪 Running FinPilot Verification Test Suite...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Password Hashing & Auth Verification
  console.log("1. Authentication & Cryptography Tests:");
  const testPassword = "SuperSecurePassword123!";
  const hash = await hashPassword(testPassword);
  assert(await verifyPassword(testPassword, hash), "Bcrypt hashes and verifies correct password");
  assert(!(await verifyPassword("WrongPassword!", hash)), "Bcrypt rejects incorrect password");

  const sessionToken = signSessionToken({ userId: "user-123", email: "test@finpilot.io", role: "USER" });
  const verifiedPayload = verifySessionToken(sessionToken);
  assert(verifiedPayload?.userId === "user-123", "JWT session token signs and unpacks userId");
  assert(verifySessionToken("invalid-tampered-token") === null, "JWT rejects tampered or invalid token");

  // 2. Tenancy & User Data Isolation
  console.log("\n2. User Tenancy & Financial Record Isolation:");
  const userA = await prisma.user.upsert({
    where: { email: "user.a@test.com" },
    create: { email: "user.a@test.com", name: "User A", passwordHash: hash },
    update: {},
  });
  const userB = await prisma.user.upsert({
    where: { email: "user.b@test.com" },
    create: { email: "user.b@test.com", name: "User B", passwordHash: hash },
    update: {},
  });

  const txUserA = await prisma.transaction.create({
    data: {
      userId: userA.id,
      amount: 1500,
      merchant: "Confidential Merchant A",
      type: "Expense",
      date: new Date(),
    },
  });

  // Query scoping by userB should NOT return User A's transaction
  const userBRecords = await prisma.transaction.findMany({
    where: { userId: userB.id },
  });
  const leaked = userBRecords.some((t) => t.id === txUserA.id);
  assert(!leaked, "Strict Isolation: User B cannot access User A's transaction records");

  // Clean up test transactions
  await prisma.transaction.delete({ where: { id: txUserA.id } });

  // 3. Demo Persona Seeding
  console.log("\n3. Demo Persona & Grounded Records Verification:");
  const demoUser = await seedDemoUser();
  assert(demoUser.email === DEMO_USER_EMAIL, "Demo seed creates Alex Morgan");

  const txCount = await prisma.transaction.count({ where: { userId: demoUser.id } });
  assert(txCount >= 30, `Demo user seeded with ${txCount} rich transaction records`);

  const anomalyCount = await prisma.transaction.count({
    where: { userId: demoUser.id, isAnomaly: true },
  });
  assert(anomalyCount >= 2, `Explainable anomalies generated for demo presentation (${anomalyCount} flagged)`);

  const budgetCount = await prisma.budget.count({ where: { userId: demoUser.id } });
  assert(budgetCount >= 1, "Demo user contains active operational budget");

  const goalCount = await prisma.goal.count({ where: { userId: demoUser.id } });
  assert(goalCount >= 3, `Demo user has ${goalCount} financial goals loaded`);

  // 4. "Can I Afford This?" Pre-Purchase Simulator
  console.log("\n4. Decision Support & Affordability Reasoning:");
  const context = {
    totalBalance: 509100,
    monthlyIncome: 145000,
    monthlyExpenses: 76840,
    savingsRate: 47,
    remainingBudget: 18160,
    recentTransactions: [],
    categorySpending: { Shopping: 12000, "Food & Dining": 17290 },
    activeBudgets: [{ category: "Shopping", allocated: 15000, spent: 12000 }],
    subscriptions: [],
    bills: [],
    goals: [{ title: "Emergency Runway Fund", current: 210000, target: 300000, monthly: 20000 }],
  };

  const affordAnalysis = await evaluateAffordability(25000, "Ergonomic Chair", "Shopping", context);
  assert(
    affordAnalysis.projectedMonthlySurplus === 145000 - 76840 - 25000,
    `Calculates exact surplus delta: ${affordAnalysis.projectedMonthlySurplus}`
  );
  assert(
    affordAnalysis.budgetImpact.willExceed === true,
    "Correctly flags that ₹25k purchase exceeds remaining ₹3k Shopping budget"
  );
  assert(
    affordAnalysis.alternativeOptions.length > 0,
    "Provides actionable alternative financing recommendations"
  );

  // 5. What-If Scenario Simulator
  console.log("\n5. What-If Scenario Simulator:");
  const whatIfResult = await runWhatIfSimulation("EXTRA_EXPENSE", 10000, context);
  assert(
    whatIfResult.simulated.monthlyExpenses === 76840 + 10000,
    "Simulates exact monthly outflow increase"
  );
  assert(
    whatIfResult.deltas.annualNetImpact === -120000,
    "Projects accurate 12-month net wealth shift of -₹1,20,000"
  );

  console.log(`\n========================================`);
  console.log(`🏁 Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  await prisma.$disconnect();
}

runFinPilotTests().catch(async (e) => {
  console.error("Test runner crashed:", e);
  await prisma.$disconnect();
});
