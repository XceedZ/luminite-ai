"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy, // <-- Import the Copy icon
  Loader2,
} from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Folder } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"
import { useAIStore } from "@/app/store/ai-store"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose, // <-- Import DialogClose
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export type ChatHistoryItem = {
  id: string
  title: string
  href: string
}

const MAX_VISIBLE_HISTORY = 5;

function HistorySkeleton() {
    return (
        <SidebarMenu>
            {[...Array(3)].map((_, i) => (
                <SidebarMenuItem key={i}>
                    <div className="flex h-8 w-full items-center rounded-lg px-2">
                        <Skeleton className="h-4 w-full" />
                    </div>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}

export function NavHistory({
  chatHistory,
  isLoading,
  t,
}: {
  chatHistory: ChatHistoryItem[]
  isLoading: boolean
  t: (key: string) => string
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const lang = pathname.split('/')[1] || 'en';
  
  const activeSessionId = pathname.split('/')[3]; 
  const { renameChat, deleteChat } = useAIStore()

  const [visibleCount, setVisibleCount] = useState(MAX_VISIBLE_HISTORY);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCopyLinkDialogOpen, setIsCopyLinkDialogOpen] = useState(false) // <-- New state for the copy link dialog
  const [actionTarget, setActionTarget] = useState<ChatHistoryItem | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)

  const visibleHistory = chatHistory.slice(0, visibleCount);
  const hasMoreHistory = chatHistory.length > visibleCount;

  useEffect(() => {
    if (actionTarget && isRenameDialogOpen) {
      setNewTitle(actionTarget.title);
    }
  }, [actionTarget, isRenameDialogOpen]);

  // This function is no longer needed, its logic will move into the dialog
  // const handleCopyLink = (item: ChatHistoryItem) => { ... };

  const handleOpenInNewTab = (item: ChatHistoryItem) => {
    window.open(item.href, '_blank', 'noopener,noreferrer');
  };

  const handleRenameSubmit = () => {
    if (!actionTarget) return;
    if (newTitle && newTitle.trim() !== "" && newTitle.trim() !== actionTarget.title) {
      renameChat(actionTarget.id, newTitle.trim());
      toast.success(`${t("chatRenamedSuccess")} "${newTitle.trim()}"`);
      setIsRenameDialogOpen(false);
    } else {
        toast.error(t("renameError"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!actionTarget) return;
    const deletedTitle = actionTarget.title;
    const { isActiveChat } = await deleteChat(actionTarget.id);

    toast.success(`Chat "${deletedTitle}" telah dihapus.`);
    
    if (isActiveChat) {
      router.push(`/${lang}/quick-create`);
    }
    setIsDeleteDialogOpen(false);
  };
  
  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + MAX_VISIBLE_HISTORY);
  };

  // Helper function to handle copying inside the new dialog
  const handleCopyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success(t("linkCopied") || "Link copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      toast.error(t("copyLinkFailed") || "Failed to copy link.");
    });
  };

  if (!isLoading && (!chatHistory || chatHistory.length === 0)) {
    return null;
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="inline-flex items-center">
              <SidebarGroupLabel>{t("history")}</SidebarGroupLabel>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent align="start" className="w-56">
            <ContextMenuItem className="text-red-600 focus:text-red-600 dark:focus:text-red-500" onSelect={(e) => { e.preventDefault(); setIsBulkDialogOpen(true); }}>
              <Trash2 className="text-red-600 dark:text-red-500" />
              <span>{t("deleteAllChats") || "Delete all chats"}</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        {isLoading ? <HistorySkeleton /> : (
          <SidebarMenu>
            {visibleHistory.map((item) => {
              const isActive = activeSessionId === item.id;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild className={cn(isActive && "bg-accent text-accent-foreground")}>
                    <Link href={item.href} title={item.title}>
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">{t("more")}</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem onSelect={() => {
                          setActionTarget(item);
                          setIsRenameDialogOpen(true);
                      }}>
                        <Edit className="text-muted-foreground" />
                        <span>{t("rename")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* --- MODIFIED THIS ITEM --- */}
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        setActionTarget(item);
                        setIsCopyLinkDialogOpen(true);
                      }}>
                        <LinkIcon className="text-muted-foreground" />
                        <span>{t("copyLink")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleOpenInNewTab(item)}>
                        <ArrowUpRight className="text-muted-foreground" />
                        <span>{t("openInNewTab")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 dark:focus:text-red-500"
                        onSelect={(event) => {
                            event.preventDefault();
                            setActionTarget(item);
                            setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="text-red-600 dark:text-red-500" />
                        <span>{t("deleteChat")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })}
            
            {hasMoreHistory && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" onClick={handleShowMore}>
                  <MoreHorizontal />
                  <span>{t("more")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        )}
      </SidebarGroup>
      {/* Bulk delete confirm dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={(open) => { if (!isBulkProcessing) setIsBulkDialogOpen(open) }}>
        <DialogContent className="sm:max-w-lg [&>button[aria-label=Close]]:hidden">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {isBulkProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Folder />}
              </EmptyMedia>
              <EmptyTitle>{isBulkProcessing ? (t("processingTitle") || "Processing your request") : (t("confirmDeleteAllTitle") || "Delete all chats?")}</EmptyTitle>
              <EmptyDescription>
                {isBulkProcessing
                  ? (t("processingDesc") || "Processing your request. Please wait while we process your request. Do not refresh the page.")
                  : (t("confirmDeleteAllDesc") || "This will permanently delete all chat history.")}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                {!isBulkProcessing && (
                  <Button className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" onClick={async () => {
                    try {
                      setIsBulkProcessing(true)
                      for (const item of chatHistory) {
                        await deleteChat(item.id)
                      }
                      setIsBulkProcessing(false)
                      setIsBulkDialogOpen(false)
                      toast.success(t("allChatsDeleted") || "All chats deleted")
                      router.push(`/${lang}/quick-create`)
                    } catch (e) {
                      setIsBulkProcessing(false)
                      toast.error("Failed to delete chats")
                    }
                  }}>{t("deleteAll") || "Delete all"}</Button>
                )}
                <Button variant="outline" onClick={() => { if (!isBulkProcessing) setIsBulkDialogOpen(false) }}>{t("cancel")}</Button>
              </div>
            </EmptyContent>
          </Empty>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        {/* ... (existing rename dialog code, no changes needed) ... */}
         <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("renameChat")}</DialogTitle>
            <DialogDescription>
              {t("renameChatDescription")} "{actionTarget?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="name" className="text-left">
              {t("newTitle")}
            </Label>
            <Input
              id="name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" onClick={handleRenameSubmit}>{t("saveChanges")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {/* ... (existing delete dialog code, no changes needed) ... */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteChatConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteChatConfirmDescription")} "{actionTarget?.title}". {t("actionCannotBeUndone")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={handleDeleteConfirm}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- NEW COPY LINK DIALOG --- */}
      <Dialog open={isCopyLinkDialogOpen} onOpenChange={setIsCopyLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("shareLinkTitle")}</DialogTitle>
            <DialogDescription>
              {t("shareLinkDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={actionTarget ? `${window.location.origin}${actionTarget.href}` : ""}
                readOnly
              />
            </div>
            <Button 
                type="button" 
                size="sm" 
                className="px-3"
                onClick={() => handleCopyToClipboard(actionTarget ? `${window.location.origin}${actionTarget.href}` : "")}
            >
              <span className="sr-only">{t("copy")}</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t("close")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}