import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TaskNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Task Not Found</h2>
          <p className="text-muted-foreground max-w-sm">
            The task youre looking for doesnt exist or has been deleted.
          </p>
        </div>
        <Button asChild>
          <Link href="/tasks">
            Back to Tasks
          </Link>
        </Button>
      </div>
    </div>
  )
}