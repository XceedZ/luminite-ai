import { z } from "zod"

// Schema untuk task status
export const taskStatusSchema = z.enum([
  "todo",
  "in-progress",
  "done",
  "canceled"
])

// Schema untuk task priority
export const taskPrioritySchema = z.enum([
  "low",
  "medium",
  "high"
])

// Schema untuk task label
export const taskLabelSchema = z.enum([
  "bug",
  "feature",
  "documentation"
])

// Schema utama untuk task
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: taskStatusSchema,
  label: taskLabelSchema,
  priority: taskPrioritySchema,
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  description: z.string().optional()
})

export type Task = z.infer<typeof taskSchema>
export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskPriority = z.infer<typeof taskPrioritySchema>
export type TaskLabel = z.infer<typeof taskLabelSchema>

// Data untuk filter options
export const statuses = [
  {
    value: "todo",
    label: "Todo",
    icon: "CircleDashed"
  },
  {
    value: "in-progress",
    label: "In Progress",
    icon: "Timer"
  },
  {
    value: "done",
    label: "Done",
    icon: "CircleCheckBig"
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: "XCircle"
  }
]

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: "ArrowDown"
  },
  {
    value: "medium",
    label: "Medium",
    icon: "ArrowRight"
  },
  {
    value: "high",
    label: "High",
    icon: "ArrowUp"
  }
]

export const labels = [
  {
    value: "bug",
    label: "Bug",
    icon: "Bug"
  },
  {
    value: "feature",
    label: "Feature",
    icon: "Rocket"
  },
  {
    value: "documentation",
    label: "Documentation",
    icon: "FileText"
  }
]

