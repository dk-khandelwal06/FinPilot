import { seedDemoUser } from "../src/lib/demo-data";

async function main() {
  console.log("🌱 Seeding FinPilot Alex Morgan Demo Account...");
  const user = await seedDemoUser();
  console.log(`✅ Demo Account successfully seeded! User ID: ${user.id}, Email: ${user.email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
