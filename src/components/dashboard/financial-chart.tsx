'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { MonthlyFigures } from '@/types'

interface Props {
  figures: MonthlyFigures[]
  currency?: string
}

type Range = '3M' | '6M' | '1Y' | 'All'

const METRICS = [
  { key: 'revenue',            label: 'Revenue',       color: '#059669' },
  { key: 'operating_expenses', label: 'Expenses',      color: '#dc2626' },
  { key: 'net_profit',         label: 'Net Profit',    color: '#0ea5e9' },
  { key: 'cash_position',      label: 'Cash',          color: '#f59e0b' },
] as const

type MetricKey = typeof METRICS[number]['key']

function formatMonth(period: string) {
  const [year, month] = period.split('-')
  const d = new Date(Number(year), Number(month) - 1, 1)
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
}

function formatYAxis(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}k`
  return String(value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'
  return (
    <div className="rounded-lg border bg-background shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold mb-2 text-foreground">{label}</p>
      {payload.map((entry: { color: string; name: string; value: number }) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
          </span>
          <span className="font-medium text-foreground">
            {sym}{entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export function FinancialChart({ figures, currency = 'GBP' }: Props) {
  const [range, setRange] = useState<Range>('1Y')
  const [hidden, setHidden] = useState<Set<MetricKey>>(new Set())

  const sorted = useMemo(
    () => [...figures].sort((a, b) => a.period_month.localeCompare(b.period_month)),
    [figures]
  )

  const filtered = useMemo(() => {
    if (range === 'All') return sorted
    const n = range === '3M' ? 3 : range === '6M' ? 6 : 12
    return sorted.slice(-n)
  }, [sorted, range])

  const data = useMemo(
    () =>
      filtered.map(f => ({
        period: formatMonth(f.period_month),
        revenue: f.revenue,
        operating_expenses: f.operating_expenses,
        net_profit: f.net_profit,
        cash_position: f.cash_position,
      })),
    [filtered]
  )

  function toggleMetric(key: MetricKey) {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  if (figures.length < 2) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Add at least 2 months of figures to see the chart.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">Financial Trends</CardTitle>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(['3M', '6M', '1Y', 'All'] as Range[]).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  range === r
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {/* Metric toggles */}
        <div className="flex flex-wrap gap-2 pt-1">
          {METRICS.map(m => (
            <Button
              key={m.key}
              variant="outline"
              size="sm"
              onClick={() => toggleMetric(m.key)}
              className={`h-7 text-xs gap-1.5 transition-opacity ${
                hidden.has(m.key) ? 'opacity-40' : ''
              }`}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: m.color }}
              />
              {m.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend
              wrapperStyle={{ display: 'none' }}
            />
            {METRICS.map(m => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot={{ r: 3, fill: m.color, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                hide={hidden.has(m.key)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
