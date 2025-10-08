"use client"

import { useLanguage } from "@/components/language-provider"
import { getColumns } from "./columns"
import { DataTable } from "./data-table"
import type { Task } from "../data/schema"

interface DataTableWrapperProps {
  tasks: Task[]
}

export function DataTableWrapper({ tasks }: DataTableWrapperProps) {
  const { t } = useLanguage()
  const columns = getColumns(t)

  return <DataTable data={tasks} columns={columns} />
}

