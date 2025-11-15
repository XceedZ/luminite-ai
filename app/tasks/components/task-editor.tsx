"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Task } from "../data/schema"

interface TaskEditorProps {
  task: Task
  onUpdate: (updates: Partial<Task>) => void
}

export function TaskEditor({ task, onUpdate }: TaskEditorProps) {
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)
  const [description, setDescription] = useState(task.description || "")
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)
  const [comment, setComment] = useState("")

  // MODIFIED: Logic for Save/Cancel buttons is restored
  const handleDescriptionSave = () => {
    onUpdate({ description })
    setIsDescriptionEditing(false)
  }

  const handleDescriptionCancel = () => {
    setDescription(task.description || "")
    setIsDescriptionEditing(false)
  }

  const handleCommentSave = () => {
    if (!comment.trim()) return
    
    console.log("New comment:", comment)
    
    setComment("")
    setIsCommentExpanded(false)
  }

  const handleCommentCancel = () => {
    setComment("")
    setIsCommentExpanded(false)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Description */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Description</Label>
        
        {!isDescriptionEditing ? (
          // MODIFIED: Styling is changed to look like plain text, border is removed.
          <div 
            onClick={() => setIsDescriptionEditing(true)}
            className="min-h-[100px] w-full cursor-text rounded-md p-2 hover:bg-muted/50 transition-colors"
          >
            {description ? (
              <p className="text-sm whitespace-pre-wrap">{description}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Add a description...</p>
            )}
          </div>
        ) : (
          // MODIFIED: Edit mode with Save/Cancel buttons is restored.
          <div className="space-y-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-sm" // Ensure font size is consistent
              placeholder="Add a description..."
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={handleDescriptionSave}
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleDescriptionCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Section */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-sm font-semibold">Activity</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No activity yet. Comments and updates will appear here.
          </p>
        </div>

        {/* Add Comment */}
        <div className="space-y-3">
          {!isCommentExpanded ? (
            <div 
              onClick={() => setIsCommentExpanded(true)}
              className="flex items-start gap-3 cursor-text"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {task.assignee 
                    ? task.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'YO'
                  }
                </AvatarFallback>
              </Avatar>
              <div 
                className="flex-1 p-3 rounded-md border border-input hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm text-muted-foreground">Add a comment...</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {task.assignee 
                    ? task.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'YO'
                  }
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[100px] text-sm"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleCommentSave}
                    disabled={!comment.trim()}
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={handleCommentCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}