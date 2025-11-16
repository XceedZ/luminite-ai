"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { Payload } from "recharts/types/component/DefaultTooltipContent"
import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload, // Pastikan `payload` ada di sini
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    payload?: Payload<string | number, string | number>[]
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    label?: string
    labelClassName?: string
    formatter?: (
      value: number,
      name: string,
      item: unknown,
      index: number,
      payload: unknown
    ) => React.ReactNode
    labelFormatter?: (
      label: string,
      payload: Payload<string | number, string | number>[]
    ) => React.ReactNode
  }) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload.fill || item.color

          return (
            <div
            key={item.name} // ✅ Gunakan item.name sebagai key
            className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  // ✅ Hapus `Pick` dan definisikan props secara manual
  payload?: Payload<string | number, string | number>[]
  verticalAlign?: "top" | "middle" | "bottom"
  hideIcon?: boolean
  nameKey?: string
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
          key={item.value || item.name}
          className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}

// Simple Chart Components for Templates (matching react-to-html.ts)
// These are lightweight chart components that don't require Recharts

interface SimpleChartProps {
  data?: Array<{ [key: string]: string | number }>
  dataKey?: string
  nameKey?: string
  className?: string
}

export function BarChart({ data = [], dataKey = 'value', nameKey = 'name', className = '', ...props }: SimpleChartProps & React.HTMLAttributes<HTMLDivElement>) {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full h-64 flex items-center justify-center text-muted-foreground ${className}`} {...props}>
        No data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => Number(item[dataKey]) || 0))
  const minValue = Math.min(...data.map(item => Number(item[dataKey]) || 0))
  const range = maxValue - minValue

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="w-full h-64 flex items-end justify-around gap-2 p-4">
        {data.map((item, idx) => {
          const value = Number(item[dataKey]) || 0
          const heightPercent = range > 0 ? ((value - minValue) / range) * 100 : 0

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                style={{
                  height: `${Math.max(heightPercent, 5)}%`,
                  minHeight: '8px'
                }}
                title={`${item[nameKey] || 'Item'}: ${value}`}
              />
              <div className="text-xs text-muted-foreground text-center truncate w-full">
                {String(item[nameKey] || idx)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LineChart({ data = [], dataKey = 'value', nameKey = 'name', className = '', ...props }: SimpleChartProps & React.HTMLAttributes<HTMLDivElement>) {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full h-64 flex items-center justify-center text-muted-foreground ${className}`} {...props}>
        No data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => Number(item[dataKey]) || 0))
  const minValue = Math.min(...data.map(item => Number(item[dataKey]) || 0))
  const range = maxValue - minValue

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="w-full h-64 relative p-4">
        {/* Grid lines */}
        <div className="absolute inset-4 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="w-full border-t border-border/30" />
          ))}
        </div>
        {/* Line path */}
        <div className="relative h-full flex items-end justify-around">
          {data.map((item, idx) => {
            const value = Number(item[dataKey]) || 0
            const heightPercent = range > 0 ? ((value - minValue) / range) * 100 : 50

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative w-full flex items-end" style={{ height: '100%' }}>
                  <div
                    className="w-3 h-3 bg-primary rounded-full mx-auto border-2 border-background shadow-md"
                    style={{
                      marginBottom: `${heightPercent}%`,
                      transform: 'translateY(50%)'
                    }}
                    title={`${item[nameKey] || 'Item'}: ${value}`}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center truncate w-full mt-2">
                  {String(item[nameKey] || idx)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function AreaChart({ data = [], dataKey = 'value', nameKey = 'name', className = '', ...props }: SimpleChartProps & React.HTMLAttributes<HTMLDivElement>) {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full h-64 flex items-center justify-center text-muted-foreground ${className}`} {...props}>
        No data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => Number(item[dataKey]) || 0))
  const minValue = Math.min(...data.map(item => Number(item[dataKey]) || 0))
  const range = maxValue - minValue

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="w-full h-64 relative p-4">
        {/* Grid background */}
        <div className="absolute inset-4 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="w-full border-t border-border/30" />
          ))}
        </div>
        {/* Area bars */}
        <div className="relative h-full flex items-end justify-around gap-1">
          {data.map((item, idx) => {
            const value = Number(item[dataKey]) || 0
            const heightPercent = range > 0 ? ((value - minValue) / range) * 100 : 0

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-primary/40 to-primary/10 rounded-t"
                  style={{
                    height: `${Math.max(heightPercent, 5)}%`,
                    minHeight: '4px'
                  }}
                  title={`${item[nameKey] || 'Item'}: ${value}`}
                />
                <div className="text-xs text-muted-foreground text-center truncate w-full">
                  {String(item[nameKey] || idx)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface ChartCardStatProps {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down'
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function ChartCardStat({ title, value, description, trend, icon: Icon, className = '', ...props }: ChartCardStatProps & React.HTMLAttributes<HTMLDivElement>) {
  const TrendIcon = trend === 'up' 
    ? (props: { className?: string }) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
    : trend === 'down'
    ? (props: { className?: string }) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" /></svg>
    : null
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'

  return (
    <div className={`flex flex-col gap-2 ${className}`} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          {TrendIcon && <TrendIcon className="h-3 w-3" />}
          <span>{description}</span>
        </div>
      )}
    </div>
  )
}
