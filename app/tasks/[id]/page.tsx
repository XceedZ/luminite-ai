import { promises as fs } from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { z } from "zod"
import { TaskDetailView } from "../components/task-detail-view"
import { taskSchema, labels } from "../data/schema"

async function getTask(id: string) {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/tasks/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())
  const parsedTasks = z.array(taskSchema).parse(tasks)
  
  const task = parsedTasks.find((t) => t.id === id)
  
  if (!task) {
    notFound()
  }
  
  return task
}

async function getAllTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/tasks/data/tasks.json")
  )

  const tasks = JSON.parse(data.toString())
  return z.array(taskSchema).parse(tasks)
}

interface TaskDetailPageProps {
  params: {
    id: string
  }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const task = await getTask(params.id)
  const allTasks = await getAllTasks()
  
  // Get available labels and assignees
  const availableLabels = labels.map(l => l.value)
  const availableAssignees = Array.from(
    new Set(allTasks.map(t => t.assignee).filter(Boolean))
  ) as string[]

  return (
    <div className="flex flex-1 flex-col">
      <TaskDetailView 
        task={task} 
        availableLabels={availableLabels}
        availableAssignees={availableAssignees}
      />
    </div>
  )
}

export async function generateMetadata({ params }: TaskDetailPageProps) {
  const task = await getTask(params.id)
  
  return {
    title: `${task.id}: ${task.title}`,
    description: task.description || task.title,
  }
}