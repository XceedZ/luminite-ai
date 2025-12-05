"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Clock, MoreHorizontal, Trash2, GitBranch, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Demo diagrams (in production, this would come from database/store)
const demoDiagrams = [
    {
        id: "1",
        title: "Login Flow",
        description: "User authentication flowchart",
        type: "flowchart",
        updatedAt: "2 hours ago",
        nodeCount: 8,
    },
    {
        id: "2",
        title: "User Database",
        description: "E-commerce database ERD",
        type: "erd",
        updatedAt: "1 day ago",
        nodeCount: 12,
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
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [diagramName, setDiagramName] = useState("");
    const [diagramDescription, setDiagramDescription] = useState("");

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

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Diagrams</h1>
                    <p className="text-muted-foreground">
                        Create flowcharts, ERD diagrams, and more with AI assistance.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Diagram
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Diagram</DialogTitle>
                            <DialogDescription>
                                Choose a template to get started.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="space-y-3">
                                <Label>Select Template</Label>
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
                                        <Label htmlFor="name">Diagram Name</Label>
                                        <Input
                                            id="name"
                                            placeholder={`My ${selectedTemplate === 'erd' ? 'ERD' : 'Flowchart'}`}
                                            value={diagramName}
                                            onChange={(e) => setDiagramName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (optional)</Label>
                                        <Input
                                            id="description"
                                            placeholder="Brief description of your diagram"
                                            value={diagramDescription}
                                            onChange={(e) => setDiagramDescription(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateDiagram} disabled={!selectedTemplate}>Create Diagram</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Starter Templates Section */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Start with a template</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/diagram/new?template=flowchart&name=New%20Flowchart">
                        <Card className="h-[160px] hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer group">
                            <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                    <GitBranch className="h-8 w-8 text-blue-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">Blank Flowchart</p>
                                    <p className="text-xs text-muted-foreground">Process & workflow</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/diagram/new?template=erd&name=New%20ERD">
                        <Card className="h-[160px] hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer group">
                            <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                    <Database className="h-8 w-8 text-emerald-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">Blank ERD</p>
                                    <p className="text-xs text-muted-foreground">Database design</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/diagram/new?template=flowchart&name=Login%20Flow">
                        <Card className="h-[160px] hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer group">
                            <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                    <GitBranch className="h-8 w-8 text-blue-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">Login Flow</p>
                                    <p className="text-xs text-muted-foreground">Auth flowchart</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/diagram/new?template=erd&name=User%20Database">
                        <Card className="h-[160px] hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer group">
                            <CardContent className="flex flex-col items-center justify-center h-full gap-3">
                                <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                    <Database className="h-8 w-8 text-emerald-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">User Database</p>
                                    <p className="text-xs text-muted-foreground">User & Auth ERD</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* Recent Diagrams Section */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Recent diagrams</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <button onClick={() => setIsDialogOpen(true)} className="h-[200px]">
                        <Card className="h-full border-dashed hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-center">
                            <CardContent className="flex flex-col items-center gap-2 text-muted-foreground">
                                <div className="rounded-full bg-primary/10 p-4">
                                    <Plus className="h-8 w-8 text-primary" />
                                </div>
                                <span className="font-medium">Create New</span>
                            </CardContent>
                        </Card>
                    </button>

                    {demoDiagrams.map((diagram) => (
                        <Card key={diagram.id} className="h-[200px] hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <div className={cn("rounded-md p-2", diagram.type === 'erd' ? "bg-emerald-500/10" : "bg-blue-500/10")}>
                                        {diagram.type === 'erd' ? (
                                            <Database className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <GitBranch className="h-4 w-4 text-blue-500" />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-medium">
                                            <Link href={`/diagram/new?id=${diagram.id}&template=${diagram.type}`} className="hover:underline">
                                                {diagram.title}
                                            </Link>
                                        </CardTitle>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {diagram.type === 'erd' ? 'ERD' : 'Flowchart'}
                                        </span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />Rename</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="line-clamp-2 mb-4">{diagram.description}</CardDescription>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{diagram.updatedAt}</div>
                                    <div>{diagram.nodeCount} nodes</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
