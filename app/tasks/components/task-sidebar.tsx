"use client"

import * as React from "react"
import { cn } from "@/lib/utils" 
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Task, statuses, priorities, labels } from "../data/schema"
import { 
  CalendarIcon,
  CircleDashed,
  Timer,
  CircleCheckBig,
  XCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  Rocket,
  FileText,
  type LucideIcon,
  Check,            
  ChevronsUpDown,   
} from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"

interface TaskSidebarProps {
  task: Task
  onUpdate: (updates: Partial<Task>) => void
  availableLabels: string[]
  availableAssignees: string[]
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  CircleDashed,
  Timer,
  CircleCheckBig,
  XCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  Rocket,
  FileText,
}

// Color mapping for statuses
const statusColorMap: Record<string, string> = {
  "todo": "text-slate-500",
  "in-progress": "text-blue-500",
  "done": "text-green-500",
  "canceled": "text-red-500",
}

// Color mapping for priorities
const priorityColorMap: Record<string, string> = {
  "low": "text-slate-500",
  "medium": "text-yellow-500",
  "high": "text-red-500",
}

export function TaskSidebar({ task, onUpdate, availableLabels, availableAssignees }: TaskSidebarProps) {
  const [openAssignee, setOpenAssignee] = React.useState(false)

  // Get current configs
  const currentStatus = statuses.find(s => s.value === task.status)
  const currentPriority = priorities.find(p => p.value === task.priority)
  const currentLabel = labels.find(l => l.value === task.label)

  const StatusIcon = currentStatus ? iconMap[currentStatus.icon] : CircleDashed
  const statusColor = statusColorMap[task.status] || "text-slate-500"

  const PriorityIcon = currentPriority ? iconMap[currentPriority.icon] : ArrowRight
  const priorityColor = priorityColorMap[task.priority] || "text-slate-500"
  
  const LabelIcon = currentLabel ? iconMap[currentLabel.icon] : FileText

  // Format due date
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let indicator = ""
    let indicatorColor = "text-muted-foreground"
    
    if (diffDays < 0) {
      indicator = `${Math.abs(diffDays)} hari terlambat`
      indicatorColor = "text-red-500"
    } else if (diffDays === 0) {
      indicator = "Hari ini"
      indicatorColor = "text-orange-500"
    } else if (diffDays <= 3) {
      indicator = `${diffDays} hari lagi`
      indicatorColor = "text-yellow-500"
    }
    
    return { indicator, indicatorColor }
  }

  const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null

  return (
    <div className="p-6 space-y-4">
      {/* Status */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select
          value={task.status}
          onValueChange={(value) => 
            onUpdate({ status: value as Task["status"] })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                <span>{currentStatus?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => {
              const Icon = iconMap[status.icon]
              const color = statusColorMap[status.value]
              return (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span>{status.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Assignee Combobox */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Assignee</Label>
        <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openAssignee}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">
                    {task.assignee 
                      ? task.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : 'UN'
                    }
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.assignee || "Unassigned"}</span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search assignee..." />
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="unassigned"
                  value="unassigned"
                  onSelect={() => {
                    onUpdate({ assignee: undefined })
                    setOpenAssignee(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">UN</AvatarFallback>
                    </Avatar>
                    <span>Unassigned</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      !task.assignee ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
                {availableAssignees.map((assignee) => (
                  <CommandItem
                    key={assignee}
                    value={assignee}
                    onSelect={(currentValue) => {
                      onUpdate({ assignee: currentValue === task.assignee ? undefined : currentValue })
                      setOpenAssignee(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{assignee}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        task.assignee === assignee ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* MODIFIED: Labels without tag styling */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Labels</Label>
        <Select
          value={task.label}
          onValueChange={(value) => onUpdate({ label: value as Task["label"] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <LabelIcon className="h-4 w-4 text-muted-foreground" />
                <span>{currentLabel?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {labels.map((label) => {
              const Icon = iconMap[label.icon]
              return (
                <SelectItem key={label.value} value={label.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span>{label.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Priority</Label>
        <Select
          value={task.priority}
          onValueChange={(value) => 
            onUpdate({ priority: value as Task["priority"] })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <PriorityIcon className={`h-4 w-4 ${priorityColor}`} />
                <span className={priorityColor}>{currentPriority?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => {
              const Icon = iconMap[priority.icon]
              const color = priorityColorMap[priority.value]
              return (
                <SelectItem key={priority.value} value={priority.value}>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className={color}>{priority.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {task.dueDate ? (
                <span>{format(new Date(task.dueDate), "PPP", { locale: idLocale })}</span>
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={task.dueDate ? new Date(task.dueDate) : undefined}
              onSelect={(date) => onUpdate({ dueDate: date?.toISOString().split('T')[0] })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {dueDateInfo && dueDateInfo.indicator && (
          <p className={`text-xs ${dueDateInfo.indicatorColor}`}>
            {dueDateInfo.indicator}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="pt-4 border-t space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Created</span>
          <span>Just now</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Updated</span>
          <span>Just now</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-muted-foreground">Reporter</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {task.assignee 
                  ? task.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'YO'
                }
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{task.assignee || "You"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}