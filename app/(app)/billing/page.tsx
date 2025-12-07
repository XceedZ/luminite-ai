"use client";

import { useState } from "react";
import {
    CreditCard,
    Download,
    Zap,
    CheckCircle2,
    Calendar,
    FileText,
    TrendingUp,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";

// Mock data for billing
const currentPlan = {
    name: "Free",
    price: "$0",
    period: "/month",
    renewalDate: "2024-01-15",
};

const usage = {
    aiGenerations: { used: 3, limit: 5, label: "AI Generations" },
    projects: { used: 1, limit: 1, label: "Active Projects" },
    storage: { used: 45, limit: 100, label: "Storage (MB)" },
};

const invoices = [
    { id: "INV-001", date: "2023-12-01", amount: "$0.00", status: "Paid", plan: "Free" },
    { id: "INV-002", date: "2023-11-01", amount: "$0.00", status: "Paid", plan: "Free" },
    { id: "INV-003", date: "2023-10-01", amount: "$0.00", status: "Paid", plan: "Free" },
];

const proFeatures = [
    "Unlimited AI generations",
    "Unlimited projects",
    "Priority support",
    "Export to PDF/PNG",
    "Team collaboration",
];

export default function BillingPage() {
    const { t } = useLanguage();
    const [isYearly, setIsYearly] = useState(false);

    return (
        <main className="relative flex-1 overflow-y-auto">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold md:text-3xl">{t("billing") || "Billing"}</h1>
                    </div>
                    <p className="text-muted-foreground">
                        {t("billingDescription") || "Manage your subscription and billing information"}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Current Plan */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {t("currentPlan") || "Current Plan"}
                                        <Badge variant="secondary">{currentPlan.name}</Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        {t("billingCycle") || "Your billing cycle renews on"} {currentPlan.renewalDate}
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{currentPlan.price}</div>
                                    <div className="text-sm text-muted-foreground">{currentPlan.period}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Separator className="mb-6" />

                            {/* Usage Stats */}
                            <div className="space-y-6">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    {t("usage") || "Usage This Period"}
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    {Object.entries(usage).map(([key, data]) => (
                                        <div key={key} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{data.label}</span>
                                                <span className="font-medium">{data.used}/{data.limit}</span>
                                            </div>
                                            <Progress value={(data.used / data.limit) * 100} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Upgrade CTA */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary/50 border">
                                <div>
                                    <h4 className="font-semibold">{t("upgradeToUnlock") || "Upgrade to unlock more features"}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {t("getUnlimitedAccess") || "Get unlimited AI generations and more"}
                                    </p>
                                </div>
                                <Link href="/pricing">
                                    <RainbowButton size="sm" className="flex items-center gap-2">
                                        <Zap className="h-4 w-4" />
                                        {t("upgradeToPro") || "Upgrade to Pro"}
                                    </RainbowButton>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pro Plan Highlights */}
                    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" />
                                Pro Plan
                            </CardTitle>
                            <CardDescription>
                                {t("proDescription") || "Everything you need to build amazing things"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">$15</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>

                            <ul className="space-y-3">
                                {proFeatures.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/pricing" className="block mt-6">
                                <Button variant="outline" className="w-full">
                                    {t("viewAllPlans") || "View All Plans"}
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment History */}
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    {t("paymentHistory") || "Payment History"}
                                </CardTitle>
                                <CardDescription>
                                    {t("paymentHistoryDescription") || "View and download your past invoices"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border">
                            <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-muted-foreground border-b bg-muted/50">
                                <div>{t("invoice") || "Invoice"}</div>
                                <div>{t("date") || "Date"}</div>
                                <div>{t("plan") || "Plan"}</div>
                                <div>{t("amount") || "Amount"}</div>
                                <div className="text-right">{t("actions") || "Actions"}</div>
                            </div>

                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="grid grid-cols-5 gap-4 p-4 text-sm items-center border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <div className="font-medium">{invoice.id}</div>
                                    <div className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {invoice.date}
                                    </div>
                                    <div>
                                        <Badge variant="secondary">{invoice.plan}</Badge>
                                    </div>
                                    <div className="font-medium">{invoice.amount}</div>
                                    <div className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {invoices.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                {t("noInvoices") || "No invoices yet"}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            {t("paymentMethod") || "Payment Method"}
                        </CardTitle>
                        <CardDescription>
                            {t("paymentMethodDescription") || "Manage your payment methods"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-16 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                                    VISA
                                </div>
                                <div>
                                    <div className="font-medium">•••• •••• •••• 4242</div>
                                    <div className="text-sm text-muted-foreground">Expires 12/25</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                {t("update") || "Update"}
                            </Button>
                        </div>

                        <Button variant="ghost" className="mt-4 w-full">
                            + {t("addPaymentMethod") || "Add Payment Method"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
