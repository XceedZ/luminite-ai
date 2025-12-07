"use client";

import { useState } from "react";
import {
    Settings,
    User,
    Lock,
    Camera,
    Save,
    Shield,
    Bell,
    Trash2,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock user data
const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    plan: "Free",
    joinDate: "December 2023",
};

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("profile");
    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

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
                            <Settings className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold md:text-3xl">{t("settings") || "Settings"}</h1>
                    </div>
                    <p className="text-muted-foreground">
                        {t("settingsDescription") || "Manage your account settings and preferences"}
                    </p>
                </div>

                {/* Custom Tabs */}
                <div className="mb-8">
                    <div className="flex gap-1 border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative",
                                    activeTab === tab.id
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {t(tab.id) || tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <>
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        {t("profile") || "Profile"}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("profileDescription") || "Your personal information"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={userData.avatar} />
                                                <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                                                    {getInitials(name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                                            >
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{name}</h3>
                                            <p className="text-sm text-muted-foreground">{email}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary">{userData.plan}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {t("memberSince") || "Member since"} {userData.joinDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Name & Email */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{t("fullName") || "Full Name"}</Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t("emailAddress") || "Email Address"}</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="gap-2">
                                        <Save className="h-4 w-4" />
                                        {t("saveChanges") || "Save Changes"}
                                    </Button>
                                </CardFooter>
                            </Card>

                            {/* Password Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5" />
                                        {t("password") || "Password"}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("passwordDescription") || "Change your password"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">{t("currentPassword") || "Current Password"}</Label>
                                        <Input
                                            id="current-password"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">{t("newPassword") || "New Password"}</Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">{t("confirmPassword") || "Confirm"}</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full gap-2">
                                        <Lock className="h-4 w-4" />
                                        {t("updatePassword") || "Update Password"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <>
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        {t("security") || "Security"}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("securityDescription") || "Manage your security settings"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>{t("twoFactorAuth") || "Two-Factor Authentication"}</Label>
                                            <p className="text-sm text-muted-foreground">
                                                {t("twoFactorAuthDescription") || "Add an extra layer of security to your account"}
                                            </p>
                                        </div>
                                        <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        <Label>{t("activeSessions") || "Active Sessions"}</Label>
                                        <div className="rounded-lg border p-4 bg-muted/30">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    <div>
                                                        <p className="font-medium text-sm">{t("currentSession") || "Current Session"}</p>
                                                        <p className="text-xs text-muted-foreground">Chrome on macOS • Last active now</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">Active</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Danger Zone */}
                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-destructive">
                                        <Trash2 className="h-5 w-5" />
                                        {t("dangerZone") || "Danger Zone"}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("dangerZoneDescription") || "Irreversible actions"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                                        <p className="font-medium">{t("deleteAccount") || "Delete Account"}</p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {t("deleteAccountDescription") || "Permanently delete your account and all data"}
                                        </p>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    {t("delete") || "Delete"}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t("areYouSure") || "Are you absolutely sure?"}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t("deleteAccountWarning") || "This action cannot be undone."}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t("cancel") || "Cancel"}</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        {t("deleteAccount") || "Delete Account"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    {t("notifications") || "Notifications"}
                                </CardTitle>
                                <CardDescription>
                                    {t("notificationsDescription") || "Manage your notification preferences"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>{t("emailNotifications") || "Email Notifications"}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t("emailNotificationsDescription") || "Receive emails about your account activity"}
                                        </p>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>{t("marketingEmails") || "Marketing Emails"}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t("marketingEmailsDescription") || "Receive emails about new features and offers"}
                                        </p>
                                    </div>
                                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {t("saveChanges") || "Save Changes"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </main>
    );
}
