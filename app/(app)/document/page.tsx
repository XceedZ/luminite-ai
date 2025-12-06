"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, MoreHorizontal, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/language-provider";

// Mock data for documents list
const mockDocuments = [
    {
        id: "1",
        title: "Project Specification",
        description: "Technical requirements and architecture overview",
        updatedAt: "2024-12-06T10:30:00",
    },
    {
        id: "2",
        title: "Meeting Notes - Sprint Planning",
        description: "Notes from the latest sprint planning session",
        updatedAt: "2024-12-05T14:00:00",
    },
    {
        id: "3",
        title: "API Documentation",
        description: "REST API endpoints and usage examples",
        updatedAt: "2024-12-04T09:15:00",
    },
];

export default function DocumentPage() {
    const { t } = useLanguage();
    const [documents, setDocuments] = useState(mockDocuments);

    const handleDelete = (id: string) => {
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

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground">
                        Create and manage your documents
                    </p>
                </div>
                <Button asChild>
                    <Link href="/document/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Document
                    </Link>
                </Button>
            </div>

            {/* Documents Grid */}
            {documents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc) => (
                        <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle className="text-base font-medium line-clamp-1">
                                        {doc.title}
                                    </CardTitle>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/document/${doc.id}`}>
                                    <CardDescription className="line-clamp-2 mb-3 cursor-pointer hover:text-foreground transition-colors">
                                        {doc.description}
                                    </CardDescription>
                                </Link>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(doc.updatedAt)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-1">No documents yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Create your first document to get started
                        </p>
                        <Button asChild>
                            <Link href="/document/new">
                                <Plus className="h-4 w-4 mr-2" />
                                New Document
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
