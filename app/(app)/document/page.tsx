"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus,
    FileText,
    MoreHorizontal,
    Trash2,
    Clock,
    Search,
    Sparkles,
    CalendarIcon,
    BookOpen,
    Code,
    Lightbulb,
    FileCode,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { useLanguage } from "@/components/language-provider";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// Category types and colors
type Category = "documentation" | "notes" | "technical" | "ideas" | "project";

const categoryConfig: Record<Category, { label: string; color: string; bgColor: string; hoverBorder: string; icon: React.ElementType }> = {
    documentation: {
        label: "Documentation",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
        icon: BookOpen
    },
    notes: {
        label: "Notes",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
        hoverBorder: "hover:border-green-400 dark:hover:border-green-600",
        icon: FileText
    },
    technical: {
        label: "Technical",
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
        hoverBorder: "hover:border-purple-400 dark:hover:border-purple-600",
        icon: Code
    },
    ideas: {
        label: "Ideas",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
        hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600",
        icon: Lightbulb
    },
    project: {
        label: "Project",
        color: "text-rose-600 dark:text-rose-400",
        bgColor: "bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800",
        hoverBorder: "hover:border-rose-400 dark:hover:border-rose-600",
        icon: Briefcase
    },
};

// Mock data for documents list
const mockDocuments = [
    {
        id: "1",
        title: "Project Specification",
        description: "Technical requirements and architecture overview for the new feature implementation",
        updatedAt: "2024-12-06T10:30:00",
        category: "project" as Category,
    },
    {
        id: "2",
        title: "Meeting Notes - Sprint Planning",
        description: "Notes from the latest sprint planning session with the development team",
        updatedAt: "2024-12-05T14:00:00",
        category: "notes" as Category,
    },
    {
        id: "3",
        title: "API Documentation",
        description: "REST API endpoints and usage examples for external integrations",
        updatedAt: "2024-12-04T09:15:00",
        category: "documentation" as Category,
    },
    {
        id: "4",
        title: "Architecture Decisions",
        description: "Technical decisions and rationale for the system architecture",
        updatedAt: "2024-12-03T16:45:00",
        category: "technical" as Category,
    },
    {
        id: "5",
        title: "Feature Brainstorm",
        description: "Ideas and concepts for upcoming product features and improvements",
        updatedAt: "2024-12-02T11:20:00",
        category: "ideas" as Category,
    },
];

export default function DocumentPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [documents, setDocuments] = useState(mockDocuments);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDocuments(docs => docs.filter(doc => doc.id !== id));
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !selectedDate ||
            new Date(doc.updatedAt).toDateString() === selectedDate.toDateString();

        const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;

        return matchesSearch && matchesDate && matchesCategory;
    });

    const handleCardClick = (docId: string) => {
        router.push(`/document/${docId}`);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setSelectedDate(undefined);
        setSelectedCategory("all");
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

    const hasActiveFilters = searchQuery || selectedDate || selectedCategory !== "all";

    // Pagination logic
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4 border border-violet-200 dark:border-violet-800">
                            <Sparkles className="h-4 w-4" />
                            {t("aiPoweredWriting")}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            {t("document")}
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            {t("documentHeroDesc")}
                        </p>
                        <RainbowButton asChild>
                            <Link href="/document/new" className="gap-2">
                                <Plus className="h-4 w-4" />
                                {t("createNewDocument")}
                            </Link>
                        </RainbowButton>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <ButtonGroup className="flex-1 w-full sm:max-w-md">
                            <Input
                                placeholder={t("searchDocuments")}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="outline" aria-label="Search" onClick={handleSearch}>
                                <Search />
                            </Button>
                        </ButtonGroup>

                        {/* Date & Category Filters - same row on mobile */}
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

                            {/* Category Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={cn(
                                        "gap-2",
                                        selectedCategory !== "all" && "border-primary text-primary"
                                    )}>
                                        <FileCode className="h-4 w-4" />
                                        {selectedCategory === "all" ? t("allCategories") : categoryConfig[selectedCategory].label}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                                        {t("allCategories")}
                                    </DropdownMenuItem>
                                    {Object.entries(categoryConfig).map(([key, config]) => (
                                        <DropdownMenuItem
                                            key={key}
                                            onClick={() => setSelectedCategory(key as Category)}
                                            className="gap-2"
                                        >
                                            <config.icon className={cn("h-4 w-4", config.color)} />
                                            {config.label}
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
                            <FileText className="h-4 w-4" />
                            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
                        </div>
                    </div>

                    {/* Documents Grid */}
                    {filteredDocuments.length > 0 ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {paginatedDocuments.map((doc) => {
                                    const catConfig = categoryConfig[doc.category];
                                    const CategoryIcon = catConfig.icon;

                                    return (
                                        <Card
                                            key={doc.id}
                                            className={cn(
                                                "group cursor-pointer hover:shadow-lg transition-all duration-200",
                                                catConfig.hoverBorder
                                            )}
                                            onClick={() => handleCardClick(doc.id)}
                                        >
                                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className={cn(
                                                        "rounded-lg p-2 shrink-0",
                                                        catConfig.bgColor
                                                    )}>
                                                        <CategoryIcon className={cn("h-4 w-4", catConfig.color)} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <CardTitle className="text-base font-medium line-clamp-1">
                                                            {doc.title}
                                                        </CardTitle>
                                                        <Badge variant="outline" className={cn("text-xs mt-1", catConfig.color)}>
                                                            {catConfig.label}
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
                                                            onClick={(e) => handleDelete(e, doc.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="line-clamp-2 mb-4 min-h-[40px]">
                                                    {doc.description}
                                                </CardDescription>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{t("updated")} {formatDate(doc.updatedAt)}</span>
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
                                    <FileText />
                                </EmptyMedia>
                                {hasActiveFilters ? (
                                    <>
                                        <EmptyTitle>{t("noDocumentsFound")}</EmptyTitle>
                                        <EmptyDescription>
                                            {t("noDocumentsFoundDesc")}
                                        </EmptyDescription>
                                    </>
                                ) : (
                                    <>
                                        <EmptyTitle>{t("noDocumentsYet")}</EmptyTitle>
                                        <EmptyDescription>
                                            {t("noDocumentsYetDesc")}
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
                                    <RainbowButton asChild size="sm">
                                        <Link href="/document/new" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            {t("createDocument")}
                                        </Link>
                                    </RainbowButton>
                                )}
                            </EmptyContent>
                        </Empty>
                    )}
                </div>
            </div>
        </div>
    );
}
