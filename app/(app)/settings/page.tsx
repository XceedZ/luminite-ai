"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, CreditCard, User as UserIcon, Zap, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const invoices = [
    { id: "INV-001", date: "Mar 1, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-002", date: "Feb 1, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-003", date: "Jan 1, 2024", amount: "$29.00", status: "Paid" },
  ] as const
  const apiUsed = 8543
  const apiLimit = 10000
  const syncUsed = 143
  const syncLimit = 200

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="p-1">
          <TabsTrigger value="profile" className="px-2.5 sm:px-3">
            <code className="flex items-center gap-1 text-[13px] [&>svg]:h-4 [&>svg]:w-4">
              <UserIcon /> Profile
            </code>
          </TabsTrigger>
          <TabsTrigger value="account" className="px-2.5 sm:px-3">
            <code className="flex items-center gap-1 text-[13px] [&>svg]:h-4 [&>svg]:w-4">
              <CreditCard /> Account
            </code>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="sm:col-span-2">
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <div>
                <CardTitle>Pro Plan</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">$29/month • Renews on April 1, 2024</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="secondary">
                  <a href="/pricing">Change Plan</a>
                </Button>
                <Button variant="destructive">Cancel Plan</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4" />
                  <span>API Requests</span>
                  <span className="ml-auto text-muted-foreground">{apiUsed.toLocaleString()} / {apiLimit.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(apiUsed / apiLimit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4" />
                  <span>Monthly Syncs</span>
                  <span className="ml-auto text-muted-foreground">{syncUsed} / {syncLimit}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(syncUsed / syncLimit) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle>Payment Method</CardTitle>
              <Button variant="secondary">Update Payment Method</Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Visa ending in 4242</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle>Billing History</CardTitle>
              <Button variant="secondary" className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download All
              </Button>
            </CardHeader>
            <CardContent className="divide-y">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md border flex items-center justify-center"><FileText className="h-4 w-4" /></div>
                    <div>
                      <div className="font-medium">{inv.id}</div>
                      <div className="text-xs text-muted-foreground">{inv.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{inv.status}</Badge>
                    <div className="font-medium">{inv.amount}</div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}



