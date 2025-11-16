// Modern Dashboard Template
// This is a reference template for AI to generate high-quality dashboard interfaces

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { BarChart, LineChart, AreaChart, ChartCardStat } from "@/components/ui/chart"
import { 
  DollarSign, Users, ShoppingCart, Activity, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, MoreVertical, Bell, Search, Package, CreditCard,
  Truck, CheckCircle, Clock, AlertCircle, Calendar, Filter, Download,
  Plus, Eye, Edit, Trash, BarChart2
} from "lucide-react"

export default function ModernDashboard() {
  // Sample data for charts
  const revenueData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 }
  ]

  const ordersData = [
    { name: "Mon", value: 120 },
    { name: "Tue", value: 150 },
    { name: "Wed", value: 180 },
    { name: "Thu", value: 160 },
    { name: "Fri", value: 200 },
    { name: "Sat", value: 170 },
    { name: "Sun", value: 140 }
  ]

  const trafficData = [
    { name: "12 AM", value: 150 },
    { name: "4 AM", value: 80 },
    { name: "8 AM", value: 250 },
    { name: "12 PM", value: 400 },
    { name: "4 PM", value: 450 },
    { name: "8 PM", value: 350 },
    { name: "11 PM", value: 200 }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar
        logoText="Dashboard"
        navItems={[
          { label: "Overview", href: "#overview" },
          { label: "Analytics", href: "#analytics" },
          { label: "Reports", href: "#reports" },
          { label: "Settings", href: "#settings" }
        ]}
        rightContent={
          <>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </>
        }
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, Admin! Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <ChartCardStat
                title="Total Revenue"
                value="$45,231.89"
                description="+20.1% from last month"
                trend="up"
                icon={DollarSign}
              />
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <ChartCardStat
                title="Active Users"
                value="2,350"
                description="+12.5% from last month"
                trend="up"
                icon={Users}
              />
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <ChartCardStat
                title="Total Orders"
                value="1,234"
                description="-2.4% from last month"
                trend="down"
                icon={ShoppingCart}
              />
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <ChartCardStat
                title="Conversion Rate"
                value="3.24%"
                description="+0.5% from last month"
                trend="up"
                icon={Activity}
              />
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7 mb-8">
          {/* Revenue Chart - Takes 4 columns */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for the past 6 months</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Last 6 months
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart data={revenueData} dataKey="value" nameKey="name" />
            </CardContent>
          </Card>

          {/* Quick Stats Card - Takes 3 columns */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Sales</span>
                  <span className="font-semibold">$89,342</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New Customers</span>
                  <span className="font-semibold">423</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending Orders</span>
                  <span className="font-semibold">89</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Products</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overall Performance</span>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +18.2%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Orders</CardTitle>
                  <CardDescription>Orders received this week</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <LineChart data={ordersData} dataKey="value" nameKey="name" />
            </CardContent>
          </Card>

          {/* Traffic Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Website Traffic</CardTitle>
                  <CardDescription>Visitors throughout the day</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AreaChart data={trafficData} dataKey="value" nameKey="name" />
            </CardContent>
          </Card>
        </div>

        {/* Activity and Projects */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 mb-8">
          {/* Recent Activity - Takes 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    user: "John Doe", 
                    action: "Created new project", 
                    time: "2 hours ago",
                    avatar: "JD",
                    type: "create"
                  },
                  { 
                    user: "Jane Smith", 
                    action: "Updated dashboard settings", 
                    time: "4 hours ago",
                    avatar: "JS",
                    type: "update"
                  },
                  { 
                    user: "Mike Johnson", 
                    action: "Completed task #1234", 
                    time: "6 hours ago",
                    avatar: "MJ",
                    type: "complete"
                  },
                  { 
                    user: "Sarah Williams", 
                    action: "Added new feature", 
                    time: "8 hours ago",
                    avatar: "SW",
                    type: "create"
                  },
                  { 
                    user: "David Lee", 
                    action: "Reviewed pull request", 
                    time: "10 hours ago",
                    avatar: "DL",
                    type: "update"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects Progress - Takes 3 columns */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Projects Progress</CardTitle>
                  <CardDescription>Track your ongoing projects</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { 
                    name: "Website Redesign", 
                    progress: 75, 
                    status: "In Progress", 
                    team: 5,
                    deadline: "Mar 30, 2024",
                    color: "bg-blue-500"
                  },
                  { 
                    name: "Mobile App Development", 
                    progress: 45, 
                    status: "In Progress", 
                    team: 3,
                    deadline: "Apr 15, 2024",
                    color: "bg-purple-500"
                  },
                  { 
                    name: "API Integration", 
                    progress: 90, 
                    status: "Almost Done", 
                    team: 2,
                    deadline: "Mar 25, 2024",
                    color: "bg-green-500"
                  },
                  { 
                    name: "Documentation Update", 
                    progress: 30, 
                    status: "In Progress", 
                    team: 4,
                    deadline: "Apr 10, 2024",
                    color: "bg-orange-500"
                  }
                ].map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`h-2 w-2 rounded-full ${project.color}`}></div>
                          <p className="font-semibold text-sm">{project.name}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.team} members
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.deadline}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{project.progress}%</Badge>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Search orders..." className="w-64" />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { 
                    id: "#ORD-001", 
                    customer: "John Doe", 
                    product: "Premium Plan", 
                    status: "Completed", 
                    amount: "$299", 
                    date: "Mar 15, 2024",
                    icon: CheckCircle,
                    statusColor: "default"
                  },
                  { 
                    id: "#ORD-002", 
                    customer: "Jane Smith", 
                    product: "Basic Plan", 
                    status: "Pending", 
                    amount: "$99", 
                    date: "Mar 14, 2024",
                    icon: Clock,
                    statusColor: "secondary"
                  },
                  { 
                    id: "#ORD-003", 
                    customer: "Mike Johnson", 
                    product: "Enterprise Plan", 
                    status: "Completed", 
                    amount: "$999", 
                    date: "Mar 14, 2024",
                    icon: CheckCircle,
                    statusColor: "default"
                  },
                  { 
                    id: "#ORD-004", 
                    customer: "Sarah Williams", 
                    product: "Premium Plan", 
                    status: "Processing", 
                    amount: "$299", 
                    date: "Mar 13, 2024",
                    icon: Package,
                    statusColor: "secondary"
                  },
                  { 
                    id: "#ORD-005", 
                    customer: "David Lee", 
                    product: "Basic Plan", 
                    status: "Completed", 
                    amount: "$99", 
                    date: "Mar 13, 2024",
                    icon: CheckCircle,
                    statusColor: "default"
                  }
                ].map((order, index) => {
                  const StatusIcon = order.icon
                  return (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">
                              {order.customer.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {order.customer}
                        </div>
                      </TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>
                        <Badge variant={order.statusColor as any} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{order.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
