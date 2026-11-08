import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client.js";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "khalid.test.20261031175148@example.com";

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("User not found.");
    return;
  }

  const passwordIsValid = await bcrypt.compare(
    "TestPassword123!",
    user.password
  );

  console.log({
    userFound: true,
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHashStartsWithBcrypt: user.password.startsWith("$2b$"),
    passwordHashLength: user.password.length,
    originalPasswordMatchesHash: passwordIsValid,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });