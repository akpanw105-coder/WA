'use client'

import { useEffect, useState } from 'react'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ContributionData {
  total: {
    [year: string]: number
    lastYear: number
  }
  contributions: ContributionDay[]
}

export default function GithubCalendar() {
  const [data, setData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function fetchContributions() {
      try {
        const res = await fetch(
          'https://github-contributions-api.jogruber.de/v4/akpanw105-coder?y=last'
        )
        if (!res.ok) throw new Error('Failed to fetch contributions')
        const json = await res.json()
        if (isMounted) {
          setData(json)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchContributions()
    return () => {
      isMounted = false
    }
  }, [])

  // Group contributions by weeks (each column has 7 days)
  const weeks: ContributionDay[][] = []
  if (data && data.contributions) {
    let currentWeek: ContributionDay[] = []
    data.contributions.forEach((day, index) => {
      currentWeek.push(day)
      if (currentWeek.length === 7 || index === data.contributions.length - 1) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })
  }

  // Level color palette in line with minimal design
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-300 dark:bg-emerald-900/60'
      case 2:
        return 'bg-emerald-400 dark:bg-emerald-700'
      case 3:
        return 'bg-emerald-500 dark:bg-emerald-600'
      case 4:
        return 'bg-emerald-600 dark:bg-emerald-500'
      default:
        return 'bg-foreground/[0.06] border border-border/40'
    }
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            GitHub Contributions
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real activity from{' '}
            <a
              href="https://github.com/akpanw105-coder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:opacity-80"
            >
              @akpanw105-coder
            </a>{' '}
            over the last 12 months
          </p>
        </div>

        {data && (
          <div className="text-sm font-mono text-muted-foreground">
            <span className="font-semibold text-foreground">
              {data.total.lastYear}
            </span>{' '}
            contributions in the last year
          </div>
        )}
      </div>

      {loading && (
        <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
            <span>Loading contributions from GitHub...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <p>Unable to load GitHub contributions at this time.</p>
          <a
            href="https://github.com/akpanw105-coder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-medium text-foreground underline underline-offset-4"
          >
            View profile directly on GitHub →
          </a>
        </div>
      )}

      {data && !loading && !error && (
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="inline-flex flex-col gap-1 min-w-[680px]">
            {/* Days grid rendered week-by-week */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} contributions`}
                      className={`h-2.5 w-2.5 rounded-xs transition-colors ${getLevelColor(
                        day.level
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40 mt-3">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-xs bg-foreground/[0.06] border border-border/40" />
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-300 dark:bg-emerald-900/60" />
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500 dark:bg-emerald-600" />
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

