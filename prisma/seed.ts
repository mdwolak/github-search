import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("adminpassword", 10);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: password,
      role: "ADMIN",
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
