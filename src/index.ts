import { PrismaClient } from "@prisma/client"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import * as yup from "yup"
import { InferType, ValidationError } from "yup"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const prisma = new PrismaClient()

const taskSchema = yup.object({
  id: yup.string(),
  title: yup.string().required(),
  completed: yup.boolean().default(false),
  dueDate: yup.date().default(() => new Date()),
})

type Task = InferType<typeof taskSchema>

app.use(bodyParser.json())
app.use(cors())

app.get("/tasks", async (req: Request<Task>, res: Response) => {
  try {
    const tasks = await prisma.task.findMany()

    return res.send(tasks)
  } catch (error) {
    console.error(error)
    return res.status(500)
  }
})

app.post("/tasks", async (req: Request<Task>, res: Response) => {
  try {
    await taskSchema.validate(req.body)

    const { title, completed, dueDate } = req.body

    const taskCreated = await prisma.task.create({
      data: {
        title,
        completed,
        dueDate,
      },
    })

    return res.send(taskCreated)
  } catch (error) {
    console.error(error)

    if (error instanceof ValidationError)
      return res.status(422).send(error.errors)

    return res.status(500)
  }
})

app.patch("/tasks/:id", async (req: Request<Task>, res: Response) => {
  try {
    await taskSchema.validate(req.body)

    const { id } = req.params
    const { title, completed, dueDate } = req.body

    const taskUpdated = await prisma.task.update({
      where: { id },
      data: {
        title,
        completed,
        dueDate,
      },
    })

    return res.send(taskUpdated)
  } catch (error) {
    console.error(error)

    if (error instanceof ValidationError)
      return res.status(422).send(error.errors)

    return res.status(500)
  }
})

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
  })
})

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
  })
})
