"use client"

import * as React from "react"
import { ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AIGeneratedTable } from "@/lib/actions/ai"

// Fungsi bantuan untuk memformat angka dengan pemisah ribuan
const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

export function TableDisplay({ table }: { table: AIGeneratedTable }) {
  const [sortConfig, setSortConfig] = React.useState<{ keyIndex: number; direction: 'ascending' | 'descending' } | null>(null);

  if (!table || !table.headers || !table.rows) {
    return null;
  }
  
  const sortedRows = React.useMemo(() => {
    let sortableRows = [...table.rows];
    if (sortConfig !== null) {
      sortableRows.sort((a, b) => {
        let aValue: string | number = a[sortConfig.keyIndex];
        let bValue: string | number = b[sortConfig.keyIndex];

        // Coba konversi string ke angka untuk sorting yang benar
        const isANumeric = typeof aValue === 'number' || (typeof aValue === 'string' && aValue.trim() !== '' && !isNaN(Number(aValue)));
        const isBNumeric = typeof bValue === 'number' || (typeof bValue === 'string' && bValue.trim() !== '' && !isNaN(Number(bValue)));

        if (isANumeric && isBNumeric) {
          // Gunakan Number() untuk menangani kedua tipe data
          aValue = Number(aValue);
          bValue = Number(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRows;
  }, [table.rows, sortConfig]);

  const requestSort = (keyIndex: number) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.keyIndex === keyIndex && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ keyIndex, direction });
  };

  return (
    <Card className="w-full overflow-hidden my-4">
      <CardHeader>
        <CardTitle>{table.title}</CardTitle>
        {table.description && <CardDescription>{table.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {table.headers.map((header, index) => (
                  <TableHead key={index}>
                    <Button variant="ghost" onClick={() => requestSort(index)} className="px-2">
                      {header}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    // ▼▼▼ INI BAGIAN LOGIKA YANG DIPERBAIKI ▼▼▼
                    // Pengecekan sekarang menangani TIPE NUMBER dan STRING NUMERIK
                    const isActuallyNumeric = typeof cell === 'number' || (typeof cell === 'string' && cell.trim() !== '' && !isNaN(Number(cell)));

                    return (
                      <TableCell 
                        key={cellIndex} 
                        className={cn(
                          "font-medium",
                          isActuallyNumeric && "text-right"
                        )}
                      >
                        {/* Jika numerik, pastikan di-format sebagai number */}
                        {isActuallyNumeric ? formatNumber(Number(cell)) : cell}
                      </TableCell>
                    );
                    // ▲▲▲ AKHIR DARI BAGIAN YANG DIPERBAIKI ▲▲▲
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}