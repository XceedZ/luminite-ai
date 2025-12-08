"use client";

import { useState } from "react";
import {
    Plus,
    Clock,
    MoreHorizontal,
    Trash2,
    Mic,
    Upload,
    Search,
    Sparkles,
    CalendarIcon,
    Video,
    AudioLines,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { useLanguage } from "@/components/language-provider";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";

// Note source types
type NoteSource = "recording" | "google-meet" | "zoom" | "upload";

const sourceConfig: Record<NoteSource, {
    label: string;
    labelKey: string;
    color: string;
    bgColor: string;
    hoverBorder: string;
    icon: React.ElementType
}> = {
    recording: {
        label: "Recording",
        labelKey: "recording",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
        icon: Mic
    },
    "google-meet": {
        label: "Google Meet",
        labelKey: "googleMeet",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800",
        hoverBorder: "hover:border-red-400 dark:hover:border-red-600",
        icon: Video
    },
    zoom: {
        label: "Zoom",
        labelKey: "zoom",
        color: "text-sky-600 dark:text-sky-400",
        bgColor: "bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800",
        hoverBorder: "hover:border-sky-400 dark:hover:border-sky-600",
        icon: Video
    },
    upload: {
        label: "Upload",
        labelKey: "upload",
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
        hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
        icon: Upload
    },
};

// Demo notes data
const demoNotes: {
    id: string;
    title: string;
    description: string;
    source: NoteSource;
    updatedAt: string;
    duration: string;
}[] = [];

export default function NotetakerPage() {
    const { t } = useLanguage();
    const [notes, setNotes] = useState(demoNotes);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [noteName, setNoteName] = useState("");

    // Filter states
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedSource, setSelectedSource] = useState<NoteSource | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const templates = [
        {
            id: "recording",
            title: t("startRecording"),
            description: t("recordAudioNow"),
            icon: Mic,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            id: "google-meet",
            title: t("googleMeet"),
            description: t("importMeeting"),
            icon: Video,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
        },
        {
            id: "zoom",
            title: t("zoom"),
            description: t("importRecording"),
            icon: Video,
            color: "text-sky-500",
            bgColor: "bg-sky-500/10",
        },
        {
            id: "upload",
            title: t("uploadAudio"),
            description: t("supportedFormats"),
            icon: Upload,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
    ];

    const handleCreateNote = () => {
        if (!selectedTemplate) return;
        setIsDialogOpen(false);
        setSelectedTemplate(null);
        setNoteName("");
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNotes(n => n.filter(note => note.id !== id));
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !selectedDate ||
            new Date(note.updatedAt).toDateString() === selectedDate.toDateString();

        const matchesSource = selectedSource === "all" || note.source === selectedSource;

        return matchesSearch && matchesDate && matchesSource;
    });

    const handleCardClick = (noteId: string) => {
        console.log("Open note:", noteId);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setSelectedDate(undefined);
        setSelectedSource("all");
        setCurrentPage(1);
    };

    const handleSearch = () => {
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const hasActiveFilters = searchQuery || selectedDate || selectedSource !== "all";

    // Pagination logic
    const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedNotes = filteredNotes.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex flex-1 flex-col">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 border-b">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative px-6 py-12 md:py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800">
                            <Sparkles className="h-4 w-4" />
                            {t("aiPoweredTranscription")}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            {t("notetaker")}
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            {t("notetakerHeroDesc")}
                        </p>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <RainbowButton className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {t("createNewNote")}
                                </RainbowButton>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>{t("createNewNote")}</DialogTitle>
                                    <DialogDescription>
                                        {t("chooseCapture")}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    <div className="space-y-3">
                                        <Label>{t("selectSource")}</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {templates.map((template) => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => setSelectedTemplate(template.id)}
                                                    className={cn(
                                                        "flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left",
                                                        selectedTemplate === template.id
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className={cn("p-2 rounded-lg mb-2", template.bgColor)}>
                                                        <template.icon className={cn("h-5 w-5", template.color)} />
                                                    </div>
                                                    <span className="font-medium">{template.title}</span>
                                                    <span className="text-xs text-muted-foreground mt-1">{template.description}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedTemplate && (
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{t("noteTitleOptional")}</Label>
                                            <Input
                                                id="name"
                                                placeholder="Meeting notes..."
                                                value={noteName}
                                                onChange={(e) => setNoteName(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("cancel")}</Button>
                                    <Button onClick={handleCreateNote} disabled={!selectedTemplate}>
                                        {selectedTemplate === "recording" ? t("startRecording") :
                                            selectedTemplate === "upload" ? t("uploadFile") : t("connect")}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Quick Templates */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">{t("quickStart")}</h2>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <Card
                                className="h-[140px] hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group"
                                onClick={() => { setSelectedTemplate("recording"); setIsDialogOpen(true); }}
                            >
                                <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                        <Mic className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{t("startRecording")}</p>
                                        <p className="text-xs text-muted-foreground">{t("recordAudioNow")}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="h-[140px] hover:shadow-lg hover:border-red-400 dark:hover:border-red-600 transition-all duration-200 cursor-pointer group"
                                onClick={() => { setSelectedTemplate("google-meet"); setIsDialogOpen(true); }}
                            >
                                <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                    <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                        <Video className="h-7 w-7 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{t("googleMeet")}</p>
                                        <p className="text-xs text-muted-foreground">{t("importMeeting")}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="h-[140px] hover:shadow-lg hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-200 cursor-pointer group"
                                onClick={() => { setSelectedTemplate("zoom"); setIsDialogOpen(true); }}
                            >
                                <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                    <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/30 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors">
                                        <Video className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{t("zoom")}</p>
                                        <p className="text-xs text-muted-foreground">{t("importRecording")}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className="h-[140px] hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 cursor-pointer group"
                                onClick={() => { setSelectedTemplate("upload"); setIsDialogOpen(true); }}
                            >
                                <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                        <Upload className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">{t("uploadAudio")}</p>
                                        <p className="text-xs text-muted-foreground">{t("supportedFormats")}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <ButtonGroup className="flex-1 w-full sm:max-w-md">
                            <Input
                                placeholder={t("searchNotes")}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="outline" aria-label="Search" onClick={handleSearch}>
                                <Search />
                            </Button>
                        </ButtonGroup>

                        {/* Date & Source Filters */}
                        <div className="flex items-center gap-2">
                            {/* Date Filter */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn(
                                        "gap-2",
                                        selectedDate && "border-primary text-primary"
                                    )}>
                                        <CalendarIcon className="h-4 w-4" />
                                        {selectedDate ? formatDate(selectedDate.toISOString()) : t("filterByDate")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                    />
                                </PopoverContent>
                            </Popover>

                            {/* Source Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={cn(
                                        "gap-2",
                                        selectedSource !== "all" && "border-primary text-primary"
                                    )}>
                                        <AudioLines className="h-4 w-4" />
                                        {selectedSource === "all" ? t("allSources") : t(sourceConfig[selectedSource].labelKey)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setSelectedSource("all")}>
                                        {t("allSources")}
                                    </DropdownMenuItem>
                                    {Object.entries(sourceConfig).map(([key, config]) => (
                                        <DropdownMenuItem
                                            key={key}
                                            onClick={() => setSelectedSource(key as NoteSource)}
                                            className="gap-2"
                                        >
                                            <config.icon className={cn("h-4 w-4", config.color)} />
                                            {t(config.labelKey)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                {t("clearFilters")}
                            </Button>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                            <AudioLines className="h-4 w-4" />
                            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                        </div>
                    </div>

                    {/* Notes Grid or Empty State */}
                    {filteredNotes.length > 0 ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {paginatedNotes.map((note) => {
                                    const config = sourceConfig[note.source];
                                    const SourceIcon = config.icon;

                                    return (
                                        <Card
                                            key={note.id}
                                            className={cn(
                                                "group cursor-pointer hover:shadow-lg transition-all duration-200",
                                                config.hoverBorder
                                            )}
                                            onClick={() => handleCardClick(note.id)}
                                        >
                                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className={cn(
                                                        "rounded-lg p-2 shrink-0",
                                                        config.bgColor
                                                    )}>
                                                        <SourceIcon className={cn("h-4 w-4", config.color)} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <CardTitle className="text-base font-medium line-clamp-1">
                                                            {note.title}
                                                        </CardTitle>
                                                        <Badge variant="outline" className={cn("text-xs mt-1", config.color)}>
                                                            {t(config.labelKey)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={(e) => handleDelete(e, note.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            {t("delete")}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="line-clamp-2 mb-4 min-h-[40px]">
                                                    {note.description}
                                                </CardDescription>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>{formatDate(note.updatedAt)}</span>
                                                    </div>
                                                    <span>{note.duration}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination className="mt-6">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => goToPage(currentPage - 1)}
                                                className={cn(
                                                    currentPage === 1 && "pointer-events-none opacity-50"
                                                )}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            onClick={() => goToPage(page)}
                                                            isActive={currentPage === page}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => goToPage(currentPage + 1)}
                                                className={cn(
                                                    currentPage === totalPages && "pointer-events-none opacity-50"
                                                )}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    ) : (
                        <Empty className="from-muted/50 to-background bg-gradient-to-b from-30% min-h-[400px]">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <AudioLines />
                                </EmptyMedia>
                                {hasActiveFilters ? (
                                    <>
                                        <EmptyTitle>{t("noNotesFound")}</EmptyTitle>
                                        <EmptyDescription>
                                            {t("noNotesFoundDesc")}
                                        </EmptyDescription>
                                    </>
                                ) : (
                                    <>
                                        <EmptyTitle>{t("noNotesYet")}</EmptyTitle>
                                        <EmptyDescription>
                                            {t("noNotesYetDesc")}
                                        </EmptyDescription>
                                    </>
                                )}
                            </EmptyHeader>
                            <EmptyContent>
                                {hasActiveFilters ? (
                                    <Button variant="outline" size="sm" onClick={clearFilters}>
                                        {t("clearFilters")}
                                    </Button>
                                ) : (
                                    <Button size="sm" onClick={() => setIsDialogOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        {t("createNote")}
                                    </Button>
                                )}
                            </EmptyContent>
                        </Empty>
                    )}
                </div>
            </div>
        </div>
    );
}
