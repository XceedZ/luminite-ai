"use client"

import { useMemo, ReactNode } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, Pie, PieChart, Cell, Line, LineChart,
} from "recharts"

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer, ChartLegend, ChartLegendContent,
} from "@/components/ui/chart"

// --- Tipe Data ---
interface AIGeneratedChart {
  type: 'bar' | 'area' | 'line' | 'pie';
  title: string;
  description?: string;
  data: any[];
  config: { [key: string]: { label: string; color: string; }; };
}

// --- Fungsi Format Angka ---
const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

// --- Komponen Utama ---
export function ChartDisplay({ chart }: { chart: AIGeneratedChart }) {
    
    const chartData = useMemo(() => {
        if (!chart || !chart.data || chart.data.length === 0) return [];
        if (chart.type === 'pie') {
            const totals: { [key: string]: number } = {};
            const configKeys = Object.keys(chart.config);
            configKeys.forEach(key => { totals[key] = 0; });
            chart.data.forEach(item => {
                configKeys.forEach(key => {
                    if (typeof item[key] === 'number') totals[key] += item[key];
                });
            });
            return configKeys.map(key => ({
                name: chart.config[key].label,
                value: totals[key],
                originalKey: key 
            }));
        }
        return chart.data;
    }, [chart]);

    if (!chart || chartData.length === 0) {
        return <div className="text-center text-muted-foreground p-4">Data tidak dapat ditampilkan atau format tidak dikenali.</div>;
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // [STYLE] Font tooltip diperkecil dan diberi sedikit penyesuaian margin
            return (
                <div className="p-2 text-xs border rounded-lg shadow-sm bg-background">
                    <p className="mb-1 text-sm">{label}</p>
                    <div className="space-y-1">
                        {payload.map((pld: any) => (
                            <div key={pld.dataKey || pld.name} className="flex items-center gap-2">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: pld.color || pld.payload.fill }}
                                />
                                <div className="flex flex-1 justify-between">
                                    <p className="text-muted-foreground">{pld.name}:</p>
                                    <p className="ml-2">{formatNumber(pld.value)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };
    
    const renderChart = () => {
        const configKeys = Object.keys(chart.config);
        const xAxisKey = Object.keys(chartData[0] || {}).find(key => !configKeys.includes(key) && key !== 'name' && key !== 'value') || 'month';

        switch (chart.type) {
            case 'bar':
                return (
                  <BarChart data={chartData} margin={{ left: 10, right: 10 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={xAxisKey} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatNumber(value as number)}/>
                    {/* [HOVER EFFECT] Menambahkan cursor sorot */}
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} content={<CustomTooltip />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {configKeys.map((key) => (
                      <Bar key={key} dataKey={key} name={chart.config[key].label} fill={chart.config[key]?.color} radius={[4, 4, 0, 0]}/>
                    ))}
                  </BarChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent = 0 }) => `${(percent * 100).toFixed(0)}%`}>
                            {chartData.map((entry: any) => (
                                <Cell key={`cell-${entry.name}`} fill={chart.config[entry.originalKey]?.color || `hsl(var(--chart-1))`} />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                );

            case 'area':
            case 'line':
                const ChartComponent = chart.type === 'area' ? AreaChart : LineChart;
                const DataComponent = chart.type === 'area' ? Area : Line;
                return (
                  <ChartComponent data={chartData} margin={{ left: 10, right: 10 }}>
                    <defs>
                      {configKeys.map((key) => (
                        <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chart.config[key]?.color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={chart.config[key]?.color} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={xAxisKey} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatNumber(value as number)}/>
                    {/* [HOVER EFFECT] Menambahkan cursor sorot */}
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} content={<CustomTooltip />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {configKeys.map((key) => (
                      <DataComponent 
                        key={key} 
                        dataKey={key} 
                        name={chart.config[key].label} 
                        type="natural" 
                        fill={chart.type === 'area' ? `url(#fill-${key})` : 'transparent'} 
                        stroke={chart.config[key]?.color} 
                        strokeWidth={2} 
                        dot={true}
                        // [HOVER EFFECT] Menambahkan titik aktif yang lebih besar
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </ChartComponent>
                );

            default:
                return <div>Jenis chart '{chart.type}' tidak didukung.</div>;
        }
    }

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
                {chart.description && <CardDescription>{chart.description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chart.config} className="min-h-[400px] h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}