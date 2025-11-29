"use client"

import { useLanguage } from "@/components/language-provider"

export function TasksHeader() {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-primary">
          {t("tasksTitle")}
        </h2>
        <p className="text-muted-foreground">
          {t("tasksDescription")}
        </p>
      </div>
    </div>
  )
}

