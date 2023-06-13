import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const tasks = [
  {
    title: "Estudar React",
    completed: false,
    dueDate: new Date(),
  },
  {
    title: "Estudar Node.js",
    completed: false,
    dueDate: new Date(),
  },
  {
    title: "Estudar Tailwind CSS",
    completed: false,
    dueDate: new Date(),
  },
]

async function main() {
  await prisma.task.createMany({
    data: tasks,
    skipDuplicates: true,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
