import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import { z } from "zod"

import { TasksHeader } from "./components/tasks-header"
import { DataTableWrapper } from "./components/data-table-wrapper"
import { taskSchema } from "./data/schema"

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage your tasks and assignments.",
}

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/tasks/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function TasksPage() {
  const tasks = await getTasks()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <TasksHeader />
      <DataTableWrapper tasks={tasks} />
    </div>
  )
}

