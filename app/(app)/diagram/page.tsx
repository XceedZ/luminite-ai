"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus,
    Clock,
    MoreHorizontal,
    Trash2,
    GitBranch,
    Database,
    Search,
    Sparkles,
    CalendarIcon,
    FileCode
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

// Diagram types
type DiagramType = "flowchart" | "erd";

const diagramTypeConfig: Record<DiagramType, {
    label: string;
    color: string;
    bgColor: string;
    hoverBorder: string;
    icon: React.ElementType
}> = {
    flowchart: {
        label: "Flowchart",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
        hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600",
        icon: GitBranch
    },
    erd: {
        label: "ERD",
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
        hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600",
        icon: Database
    },
};

// Demo diagrams
const demoDiagrams = [
    {
        id: "1",
        title: "Login Flow",
        description: "User authentication flowchart with OAuth integration",
        type: "flowchart" as DiagramType,
        updatedAt: "2024-12-06T10:30:00",
        nodeCount: 8,
    },
    {
        id: "2",
        title: "User Database",
        description: "E-commerce database ERD with user relationships",
        type: "erd" as DiagramType,
        updatedAt: "2024-12-05T14:00:00",
        nodeCount: 12,
    },
    {
        id: "3",
        title: "Payment Process",
        description: "Payment processing workflow with validation steps",
        type: "flowchart" as DiagramType,
        updatedAt: "2024-12-04T09:15:00",
        nodeCount: 15,
    },
    {
        id: "4",
        title: "Product Catalog",
        description: "Product and inventory database schema",
        type: "erd" as DiagramType,
        updatedAt: "2024-12-03T16:45:00",
        nodeCount: 10,
    },
];

const templates = [
    {
        id: "flowchart",
        title: "Flowchart",
        description: "Process flows, workflows, and decision trees",
        icon: GitBranch,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        id: "erd",
        title: "ERD (Entity Relationship)",
        description: "Database design and entity relationships",
        icon: Database,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
];

export default function DiagramPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [diagrams, setDiagrams] = useState(demoDiagrams);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [diagramName, setDiagramName] = useState("");
    const [diagramDescription, setDiagramDescription] = useState("");

    // Filter states
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<DiagramType | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleCreateDiagram = () => {
        if (!selectedTemplate) return;
        const params = new URLSearchParams({
            template: selectedTemplate,
            name: diagramName || `Untitled ${selectedTemplate === 'erd' ? 'ERD' : 'Flowchart'}`,
        });
        if (diagramDescription) {
            params.append('desc', diagramDescription);
        }
        router.push(`/diagram/new?${params.toString()}`);
        setIsDialogOpen(false);
        setSelectedTemplate(null);
        setDiagramName("");
        setDiagramDescription("");
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDiagrams(d => d.filter(diagram => diagram.id !== id));
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const filteredDiagrams = diagrams.filter(diagram => {
        const matchesSearch = diagram.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            diagram.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !selectedDate ||
            new Date(diagram.updatedAt).toDateString() === selectedDate.toDateString();

        const matchesType = selectedType === "all" || diagram.type === selectedType;

        return matchesSearch && matchesDate && matchesType;
    });

    const handleCardClick = (diagramId: string, type: string) => {
        router.push(`/diagram/new?id=${diagramId}&template=${type}`);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setSelectedDate(undefined);
        setSelectedType("all");
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

    const hasActiveFilters = searchQuery || selectedDate || selectedType !== "all";

    // Pagination logic
    const totalPages = Math.ceil(filteredDiagrams.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDiagrams = filteredDiagrams.slice(startIndex, startIndex + itemsPerPage);

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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4 border border-emerald-200 dark:border-emerald-800">
                            <Sparkles className="h-4 w-4" />
                            {t("aiPoweredDiagrams")}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            {t("diagram")}
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            {t("diagramHeroDesc")}
                        </p>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <RainbowButton className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {t("createNewDiagram")}
                                </RainbowButton>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>{t("createNewDiagram")}</DialogTitle>
                                    <DialogDescription>
                                        {t("chooseTemplate")}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    <div className="space-y-3">
                                        <Label>{t("selectTemplate")}</Label>
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
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">{t("diagramName")}</Label>
                                                <Input
                                                    id="name"
                                                    placeholder={`My ${selectedTemplate === 'erd' ? 'ERD' : 'Flowchart'}`}
                                                    value={diagramName}
                                                    onChange={(e) => setDiagramName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="description">{t("descriptionOptional")}</Label>
                                                <Input
                                                    id="description"
                                                    placeholder={t("briefDescription")}
                                                    value={diagramDescription}
                                                    onChange={(e) => setDiagramDescription(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t("cancel")}</Button>
                                    <Button onClick={handleCreateDiagram} disabled={!selectedTemplate}>{t("createDiagram")}</Button>
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
                        <h2 className="text-lg font-semibold mb-4">{t("startWithTemplate")}</h2>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <Link href="/diagram/new?template=flowchart&name=New%20Flowchart">
                                <Card className="h-[140px] hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group">
                                    <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                            <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">{t("blankFlowchart")}</p>
                                            <p className="text-xs text-muted-foreground">{t("processWorkflow")}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/diagram/new?template=erd&name=New%20ERD">
                                <Card className="h-[140px] hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 cursor-pointer group">
                                    <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                            <Database className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">{t("blankERD")}</p>
                                            <p className="text-xs text-muted-foreground">{t("databaseDesign")}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/diagram/new?template=flowchart&name=Login%20Flow">
                                <Card className="h-[140px] hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group">
                                    <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                            <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">{t("loginFlow")}</p>
                                            <p className="text-xs text-muted-foreground">{t("authFlowchart")}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/diagram/new?template=erd&name=User%20Database">
                                <Card className="h-[140px] hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-200 cursor-pointer group">
                                    <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                                            <Database className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">{t("userDatabase")}</p>
                                            <p className="text-xs text-muted-foreground">{t("userAuthERD")}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <ButtonGroup className="flex-1 w-full sm:max-w-md">
                            <Input
                                placeholder={t("searchDiagrams")}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="outline" aria-label="Search" onClick={handleSearch}>
                                <Search />
                            </Button>
                        </ButtonGroup>

                        {/* Date & Type Filters - same row on mobile */}
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

                            {/* Type Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={cn(
                                        "gap-2",
                                        selectedType !== "all" && "border-primary text-primary"
                                    )}>
                                        <FileCode className="h-4 w-4" />
                                        {selectedType === "all" ? t("allTypes") : diagramTypeConfig[selectedType].label}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setSelectedType("all")}>
                                        {t("allTypes")}
                                    </DropdownMenuItem>
                                    {Object.entries(diagramTypeConfig).map(([key, config]) => (
                                        <DropdownMenuItem
                                            key={key}
                                            onClick={() => setSelectedType(key as DiagramType)}
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
                            <GitBranch className="h-4 w-4" />
                            {filteredDiagrams.length} {filteredDiagrams.length === 1 ? 'diagram' : 'diagrams'}
                        </div>
                    </div>

                    {/* Diagrams Grid */}
                    {filteredDiagrams.length > 0 ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {paginatedDiagrams.map((diagram) => {
                                    const typeConfig = diagramTypeConfig[diagram.type];
                                    const TypeIcon = typeConfig.icon;

                                    return (
                                        <Card
                                            key={diagram.id}
                                            className={cn(
                                                "group cursor-pointer hover:shadow-lg transition-all duration-200",
                                                typeConfig.hoverBorder
                                            )}
                                            onClick={() => handleCardClick(diagram.id, diagram.type)}
                                        >
                                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className={cn(
                                                        "rounded-lg p-2 shrink-0",
                                                        typeConfig.bgColor
                                                    )}>
                                                        <TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <CardTitle className="text-base font-medium line-clamp-1">
                                                            {diagram.title}
                                                        </CardTitle>
                                                        <Badge variant="outline" className={cn("text-xs mt-1", typeConfig.color)}>
                                                            {typeConfig.label}
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
                                                            onClick={(e) => handleDelete(e, diagram.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="line-clamp-2 mb-4 min-h-[40px]">
                                                    {diagram.description}
                                                </CardDescription>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>{t("updated")} {formatDate(diagram.updatedAt)}</span>
                                                    </div>
                                                    <span>{diagram.nodeCount} nodes</span>
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
                                    <GitBranch />
                                </EmptyMedia>
                                {hasActiveFilters ? (
                                    <>
                                        <EmptyTitle>{t("noDiagramsFound")}</EmptyTitle>
                                        <EmptyDescription>
                                            {t("noDiagramsFoundDesc")}
                                        </EmptyDescription>
                                    </>
                                ) : (
                                    <>
                                        <EmptyTitle>{t("noDiagramsYet")}</EmptyTitle>
                                        <EmptyDescription>
                                            {t("noDiagramsYetDesc")}
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
                                    <RainbowButton size="sm" onClick={() => setIsDialogOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        {t("createDiagram")}
                                    </RainbowButton>
                                )}
                            </EmptyContent>
                        </Empty>
                    )}
                </div>
            </div>
        </div >
    );
}
