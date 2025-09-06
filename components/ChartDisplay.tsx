"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Definisikan tipe untuk prop 'chart'
interface AIGeneratedChart {
  type: 'bar' | 'area' | 'line' | 'pie';
  title: string;
  description?: string;
  data: any[];
  config: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
}

// Fungsi untuk memformat angka menjadi mata uang Rupiah
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

// Fungsi untuk memformat angka besar menjadi format ringkas
const formatCompactNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

export function ChartDisplay({ chart }: { chart: AIGeneratedChart }) {
    if (!chart || !chart.data || chart.data.length === 0 || !chart.config) {
        return <div className="text-center text-muted-foreground p-4">Konfigurasi chart tidak valid atau tidak ada data.</div>;
    }

    const renderChart = () => {
        switch (chart.type) {
            case 'bar': {
                // [PERBAIKAN] Logika untuk Agregasi Data Transaksi Mentah
                // Kita akan mengubah data dari daftar transaksi menjadi ringkasan per kategori.
                const summary: { [key: string]: { name: string; value: number } } = {};

                chart.data.forEach(transaction => {
                    // Abaikan entri "Kas" karena itu hanya penyeimbang, bukan kategori pengeluaran/pendapatan.
                    if (transaction.keterangan && transaction.keterangan !== "Kas") {
                        const key = transaction.keterangan;
                        // Ambil nilai transaksi, baik dari debit maupun kredit
                        const value = transaction.debit > 0 ? transaction.debit : transaction.kredit;

                        if (!summary[key]) {
                            summary[key] = { name: key, value: 0 };
                        }
                        summary[key].value += value;
                    }
                });
                
                // Ubah objek summary menjadi array yang bisa digunakan oleh chart
                const processedData = Object.values(summary);

                const xAxisKey = 'name';
                const yAxisKey = 'value';

                return (
                  <BarChart
                    // [PERBAIKAN] Gunakan data yang sudah diproses
                    data={processedData}
                    layout="vertical" // Layout vertikal lebih cocok untuk label kategori yang panjang
                    margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => formatCompactNumber(Number(value))}
                    />
                    <YAxis
                      type="category"
                      dataKey={xAxisKey}
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={150} // Beri ruang lebih untuk label
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatCurrency(Number(value))}
                          labelClassName="font-bold"
                          indicator="dot"
                        />
                      }
                    />
                    <Bar dataKey={yAxisKey} radius={4}>
                      {/* [PERBAIKAN] Gunakan data yang sudah diproses */}
                      {processedData.map((entry) => {
                          const colorKey = entry[xAxisKey];
                          return (
                            <Cell
                              key={`cell-${colorKey}`}
                              fill={chart.config[colorKey]?.color || `hsl(var(--chart-1))`}
                            />
                          )
                        })}
                    </Bar>
                  </BarChart>
                );
            }
            case 'area':
            case 'line': {
                const ChartComponent = chart.type === 'area' ? AreaChart : LineChart;
                const DataComponent = chart.type === 'area' ? Area : Line;
                
                // Ambil kunci untuk sumbu Y (seri data) langsung dari config
                const yAxisKeys = Object.keys(chart.config);

                // Tentukan kunci sumbu X dengan mencari kunci di data yang bukan merupakan seri data
                const potentialXAxisKeys = Object.keys(chart.data[0] || {});
                const xAxisKey = potentialXAxisKeys.find(key => !yAxisKeys.includes(key) && key !== 'keterangan') || 'tanggal';

                return (
                  <ChartComponent
                    data={chart.data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      {yAxisKeys.map((key) => (
                        <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={chart.config[key]?.color}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={chart.config[key]?.color}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey={xAxisKey}
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => formatCompactNumber(Number(value))}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatCurrency(Number(value))}
                          labelClassName="font-bold"
                          indicator="dot"
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    
                    {yAxisKeys.map((key) => (
                      <DataComponent
                        key={key}
                        dataKey={key}
                        type="natural"
                        fill={chart.type === 'area' ? `url(#fill-${key})` : 'transparent'}
                        stroke={chart.config[key]?.color}
                        strokeWidth={2}
                        dot={true}
                      />
                    ))}
                  </ChartComponent>
                );
            }
            case 'pie': {
                // [PERBAIKAN] Tambahkan logika agregasi data untuk Pie Chart
                const summary: { [key: string]: { name: string; value: number } } = {};

                chart.data.forEach(transaction => {
                    // Untuk Pie Chart, kita hanya ingin melihat alokasi dana (pengeluaran dan pendapatan),
                    // jadi kita abaikan entri akuntansi seperti "Kas" dan "Modal".
                    const ignoredKeys = ["Kas", "Modal"];
                    if (transaction.keterangan && !ignoredKeys.includes(transaction.keterangan)) {
                        const key = transaction.keterangan;
                        const value = transaction.debit > 0 ? transaction.debit : transaction.kredit;

                        if (!summary[key]) {
                            summary[key] = { name: key, value: 0 };
                        }
                        summary[key].value += value;
                    }
                });

                const processedData = Object.values(summary);

                const nameKey = 'name';
                const valueKey = 'value';
                
                return (
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    formatter={(value) => formatCurrency(Number(value))}
                                    indicator="dot"
                                />
                            }
                        />
                        <Pie
                            // [PERBAIKAN] Gunakan data yang sudah diproses
                            data={processedData}
                            dataKey={valueKey}
                            nameKey={nameKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            labelLine={false}
                            label={({ name, percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {/* [PERBAIKAN] Gunakan data yang sudah diproses dan config untuk warna */}
                            {processedData.map((entry) => (
                                <Cell
                                    key={`cell-${entry.name}`}
                                    fill={chart.config[entry.name]?.color || `hsl(var(--chart-1))`}
                                />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                );
            }
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
    )
}