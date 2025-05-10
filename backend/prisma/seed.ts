import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  await prisma.country.createMany({
    data: [
      { name: "Argentina" },
      { name: "Chile" },
      { name: "Colombia" },
    ],
  })
  console.log("Countries seeded")
}

main().finally(() => prisma.$disconnect())
