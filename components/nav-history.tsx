"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAIStore } from "@/app/store/ai-store"

// Shadcn UI Imports
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


// Tipe untuk setiap item dalam daftar riwayat
export type ChatHistoryItem = {
  id: string
  title: string
  href: string
}

// Batas jumlah riwayat yang ditampilkan sebelum tombol "More" muncul
const MAX_VISIBLE_HISTORY = 5;

// Komponen kerangka untuk ditampilkan saat data sedang dimuat
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
  const { sessionId, renameChat, deleteChat } = useAIStore()

  // State baru untuk melacak jumlah item yang terlihat
  const [visibleCount, setVisibleCount] = useState(MAX_VISIBLE_HISTORY);

  // State untuk mengelola dialog
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [actionTarget, setActionTarget] = useState<ChatHistoryItem | null>(null)
  const [newTitle, setNewTitle] = useState("")

  const visibleHistory = chatHistory.slice(0, visibleCount);
  const hasMoreHistory = chatHistory.length > visibleCount;

  // Efek untuk mengisi input rename dengan judul saat ini ketika dialog terbuka
  useEffect(() => {
    if (actionTarget && isRenameDialogOpen) {
      setNewTitle(actionTarget.title);
    }
  }, [actionTarget, isRenameDialogOpen]);

  // Handler untuk aksi-aksi dari dropdown menu
  const handleCopyLink = (item: ChatHistoryItem) => {
    const url = `${window.location.origin}${item.href}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success(t("linkCopied") || "Link copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      toast.error(t("copyLinkFailed") || "Failed to copy link.");
    });
  };

  const handleOpenInNewTab = (item: ChatHistoryItem) => {
    window.open(item.href, '_blank', 'noopener,noreferrer');
  };

  // Handler untuk submit dari dalam dialog
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
    toast.success(`Chat "${deletedTitle}" has been deleted.`);
    if (isActiveChat) {
      router.push('/quick-create');
    }
    setIsDeleteDialogOpen(false);
  };
  
  // Handler untuk menampilkan lebih banyak riwayat
  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + MAX_VISIBLE_HISTORY);
  };

  if (!isLoading && (!chatHistory || chatHistory.length === 0)) {
    return null;
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>{t("history")}</SidebarGroupLabel>
        {isLoading ? <HistorySkeleton /> : (
          <SidebarMenu>
            {visibleHistory.map((item) => {
              const isActive = sessionId === item.id;
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
                      <DropdownMenuItem onSelect={() => handleCopyLink(item)}>
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
                        onSelect={() => {
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

      {/* Dialog untuk Rename */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
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

      {/* Alert Dialog untuk Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
    </>
  )
}