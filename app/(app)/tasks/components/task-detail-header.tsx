"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, MoreHorizontal, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Task } from "../data/schema"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TaskDetailHeaderProps {
  task: Task
  isSaving: boolean
  onUpdate: (updates: Partial<Task>) => void
}

export function TaskDetailHeader({ task, isSaving, onUpdate }: TaskDetailHeaderProps) {
  const router = useRouter()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(task.title)
  const titleTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-save title with debounce
  useEffect(() => {
    if (title === task.title) return

    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current)
    }

    titleTimeoutRef.current = setTimeout(() => {
      onUpdate({ title })
    }, 1000)

    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current)
      }
    }
  }, [title, task.title, onUpdate])

  // Automatically focus the input when entering edit mode
  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleDelete = () => {
    console.log("Delete task:", task.id)
  }
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false)
    } else if (e.key === 'Escape') {
      setTitle(task.title) // Revert changes
      setIsEditingTitle(false)
    }
  }
  
  // MODIFIED: Font size adjusted to text-lg and font-semibold to match the screenshot's visual hierarchy
  const titleStyles = "text-lg font-semibold px-2 py-1 h-auto"

  return (
    // MODIFIED: Reverted to standard background, adjusted padding for a cleaner look.
    <div className="border-b bg-background sticky top-0 z-10 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-3">
        {/* Top Row: Navigation and Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/tasks")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to tasks</span>
          </Button>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="hidden sm:flex items-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(task.id)}
                >
                  Copy task ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom Row: Title and Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={handleInputKeyDown}
                className={cn(
                  titleStyles,
                  "w-full border-0 bg-background focus-visible:ring-1 focus-visible:ring-ring"
                )}
                placeholder="Task title..."
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className={cn(
                  titleStyles,
                  "truncate cursor-text rounded-md hover:bg-muted/50"
                )}
                title={title}
              >
                {title || <span className="text-muted-foreground">Task title...</span>}
              </h1>
            )}
          </div>

          {isSaving && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="hidden sm:inline">Saving...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}