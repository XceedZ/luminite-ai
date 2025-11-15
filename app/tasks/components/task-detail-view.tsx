"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TaskDetailHeader } from "./task-detail-header"
import { TaskEditor } from "./task-editor"
import { TaskSidebar } from "./task-sidebar"
import { Task } from "../data/schema"

interface TaskDetailViewProps {
  task: Task
  availableLabels: string[]
  availableAssignees: string[]
}

export function TaskDetailView({ task, availableLabels, availableAssignees }: TaskDetailViewProps) {
  const [currentTask, setCurrentTask] = useState(task)
  const [isSaving, setIsSaving] = useState(false)

  // Handle task updates
  const handleTaskUpdate = async (updates: Partial<Task>) => {
    setIsSaving(true)
    
    // Optimistic update
    setCurrentTask((prev) => ({ ...prev, ...updates }))
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Task updated:", updates)
    } catch (error) {
      console.error("Failed to update task:", error)
      setCurrentTask(task)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <TaskDetailHeader 
        task={currentTask} 
        isSaving={isSaving}
        onUpdate={handleTaskUpdate}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Editor */}
        <div className="flex-1 overflow-y-auto">
          <TaskEditor 
            task={currentTask} 
            onUpdate={handleTaskUpdate}
          />
        </div>

        {/* Right side - Desktop Sidebar */}
        <div className="hidden lg:block w-80 border-l overflow-y-auto bg-muted/20">
          <TaskSidebar 
            task={currentTask} 
            onUpdate={handleTaskUpdate}
            availableLabels={availableLabels}
            availableAssignees={availableAssignees}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80 p-0">
            <div className="overflow-y-auto h-full">
              <TaskSidebar 
                task={currentTask} 
                onUpdate={handleTaskUpdate}
                availableLabels={availableLabels}
                availableAssignees={availableAssignees}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}