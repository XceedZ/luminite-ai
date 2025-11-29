"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  CircleDashed,
  Timer,
  CircleCheckBig,
  XCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  FileText,
  Rocket
} from "lucide-react"

import { Task, statuses } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { useLanguage } from "@/components/language-provider"
import { useState } from "react"

// AssigneeSelect component with search functionality
function AssigneeSelect({ 
  defaultValue, 
  onValueChange, 
  t, 
  getInitials 
}: { 
  defaultValue: string
  onValueChange: (value: string) => void
  t: (key: string) => string
  getInitials: (name: string) => string
}) {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredAssignees = assignees.filter(person => 
    person.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[180px] h-8 border-none hover:bg-accent">
        <SelectValue>
          {defaultValue !== "unassigned" ? (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(defaultValue)}
              </div>
              <span className="truncate">{defaultValue}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{t("unassigned")}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1.5">
          <Input
            placeholder={t("searchAssignee")}
            className="h-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <SelectItem value="unassigned">
          <span className="text-muted-foreground">{t("unassigned")}</span>
        </SelectItem>
        {filteredAssignees.map((person) => (
          <SelectItem key={person} value={person}>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(person)}
              </div>
              <span>{person}</span>
            </div>
          </SelectItem>
        ))}
        {filteredAssignees.length === 0 && searchTerm && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            {t("noResults")}
          </div>
        )}
      </SelectContent>
    </Select>
  )
}

// Icon mapping untuk status - menggunakan lucide-react
const statusIcons = {
  todo: CircleDashed,
  "in-progress": Timer,
  done: CircleCheckBig,
  canceled: XCircle
}

// Icon mapping untuk priority
const priorityIcons = {
  low: ArrowDown,
  medium: ArrowRight,
  high: ArrowUp
}

// Icon mapping untuk label
const labelIcons = {
  bug: Bug,
  feature: Rocket,
  documentation: FileText
}

// Color mapping untuk status
const statusColors = {
  todo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  canceled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
}

// Color mapping untuk priority
const priorityColors = {
  low: "text-slate-600 dark:text-slate-400",
  medium: "text-orange-600 dark:text-orange-400",
  high: "text-red-600 dark:text-red-400"
}

// List assignees untuk select
const assignees = [
  "Budi Santoso",
  "Siti Nurhaliza",
  "Ahmad Yani",
  "Dewi Lestari",
  "Rudi Hartono",
  "Rina Wijaya",
  "Agus Pratama",
  "Maya Sari",
  "Bambang Suryanto",
  "Lina Marlina",
  "Andi Wijaya",
  "Doni Setiawan",
  "Sari Indah",
  "Hendra Gunawan",
  "Fitri Handayani"
]

type TranslationFunction = (key: string) => string

export const getColumns = (t: TranslationFunction): ColumnDef<Task>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("task")} />
    ),
    cell: ({ row }) => <div className="w-[80px] font-mono text-xs">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("title")} />
    ),
    cell: ({ row }) => {
      const label = row.original.label
      const LabelIcon = labelIcons[label]
      
      return (
        <div className="flex space-x-2">
          <LabelIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span className="max-w-[500px] truncate font-medium hover:underline cursor-pointer transition-all duration-200">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("status")} />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusIcons
      const StatusIcon = statusIcons[status]

      return (
        <Select
          defaultValue={status}
          onValueChange={(value) => {
            // Handle status change here
            console.log(`Status changed to: ${value}`)
          }}
        >
          <SelectTrigger className="w-[145px] h-8 border-none hover:bg-accent">
            <SelectValue>
              <div className="flex items-center">
                <StatusIcon className="mr-2 h-4 w-4" />
                <span className="capitalize">{status.replace("-", " ")}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statuses.map((item) => {
              const Icon = statusIcons[item.value as keyof typeof statusIcons]
              return (
                <SelectItem key={item.value} value={item.value}>
                  <div className="flex items-center">
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("priority")} />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as keyof typeof priorityIcons
      const PriorityIcon = priorityIcons[priority]

      return (
        <div className="flex items-center">
          <PriorityIcon className={`mr-2 h-4 w-4 ${priorityColors[priority]}`} />
          <span className="capitalize">{priority}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("assignee")} />
    ),
    cell: ({ row }) => {
      const assignee = row.getValue("assignee") as string | undefined
      
      // Generate initials from name
      const getInitials = (name: string) => {
        return name
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      }

      return (
        <AssigneeSelect
          defaultValue={assignee || "unassigned"}
          onValueChange={(value) => {
            // Handle assignee change here
            console.log(`Assignee changed to: ${value}`)
          }}
          t={t}
          getInitials={getInitials}
        />
      )
    },
    filterFn: (row, id, value) => {
      const assignee = row.getValue(id) as string | undefined
      if (!assignee) return value.includes("unassigned")
      return value.some((v: string) => assignee.toLowerCase().includes(v.toLowerCase()))
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("dueDate")} />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string | undefined
      
      if (!dueDate) {
        return <span className="text-muted-foreground">{t("noDueDate")}</span>
      }

      const date = new Date(dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDateOnly = new Date(date)
      dueDateOnly.setHours(0, 0, 0, 0)
      
      const isOverdue = dueDateOnly < today
      const isToday = dueDateOnly.getTime() === today.getTime()
      
      const formatted = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })

      return (
        <div className={`flex items-center ${isOverdue ? "text-red-600 dark:text-red-400 font-medium" : isToday ? "text-orange-600 dark:text-orange-400 font-medium" : ""}`}>
          {formatted}
          {isOverdue && <span className="ml-1 text-xs">({t("overdue")})</span>}
          {isToday && <span className="ml-1 text-xs">({t("today")})</span>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

