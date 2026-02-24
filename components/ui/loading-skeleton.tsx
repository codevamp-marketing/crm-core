import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from "framer-motion"

export function ChartSkeleton({ height = 320 }: { height?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-lg bg-gray-900/60 border border-gray-700"
      style={{ height }}
      aria-label="Loading chart"
    >
      <div className="absolute inset-0 p-4 min-w-0">
        <Skeleton className="h-6 w-40 bg-gray-800 mb-3" />
        <Skeleton className="h-4 w-72 bg-gray-800" />
        <div className="mt-6 grid grid-cols-12 gap-2 h-[calc(100%-56px)] items-end min-w-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="bg-gray-800" style={{ height: `${20 + (i % 6) * 10}%` }} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/30 to-transparent animate-[shimmer_1.6s_infinite]" />
      <style>{"@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}"}</style>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full min-w-0">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-12 gap-3 min-w-0">
            {Array.from({ length: columns }).map((__, c) => (
              <Skeleton key={c} className="h-5 bg-gray-800 col-span-2 min-w-0" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton({
  headerLines = 2,
  bodyHeight = 150,
}: {
  headerLines?: number
  bodyHeight?: number
}) {
  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden min-w-0">
      <div className="p-6 space-y-3">
        {Array.from({ length: headerLines }).map((_, i) => (
          <Skeleton key={i} className={i === 0 ? "h-6 w-40 bg-gray-800 min-w-0" : "h-4 w-60 bg-gray-800 min-w-0"} />
        ))}
        <div className="pt-4">
          <Skeleton className="w-full bg-gray-800 min-w-0" style={{ height: bodyHeight }} />
        </div>
      </div>
    </div>
  )
}

export function LoadingFade({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {children}
        </motion.div>
      ) : (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
