import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { Spinner } from '@/components/ui/spinner'
import {
  SkeletonCard,
  SkeletonHeading,
  SkeletonText,
  SkeletonLines,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonTableRow,
  SkeletonListItem,
} from '@/components/ui/skeleton'

function getSkeletonDelay(pathname: string): number {
  if (pathname === '/') return 1500
  if (pathname.startsWith('/components/')) return 500
  return 1000
}

function getRouteName(pathname: string): string {
  if (pathname === '/') return 'Home'
  const match = pathname.match(/^\/components\/(.+)$/)
  if (match) {
    const componentName = match[1]
    return componentName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return 'page'
}

function getSkeletonType(pathname: string): 'component' | 'overview' | 'generic' {
  if (pathname === '/') return 'overview'
  if (pathname.startsWith('/components/')) return 'component'
  return 'generic'
}

function ComponentPageSkeleton() {
  return (
    <div className="space-y-10 p-8 max-w-6xl mx-auto">
      <div className="space-y-4">
        <SkeletonHeading className="h-8 w-1/2" />
        <SkeletonLines count={2} lastLineWidth="3/4" />
        <SkeletonAvatar size="sm" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <SkeletonButton key={i} />
          ))}
        </div>
        <div className="p-6 border border-border rounded-lg space-y-3">
          <SkeletonImage />
          <SkeletonHeading />
          <SkeletonLines count={2} />
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonHeading className="h-6 w-1/3" />
        <SkeletonText className="w-1/2" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonHeading className="h-6 w-1/3" />
        <SkeletonText className="w-1/2" />
        <SkeletonLines count={6} />
      </div>

      <div className="space-y-4">
        <SkeletonHeading className="h-6 w-1/3" />
        <SkeletonTableRow columns={4} />
        <SkeletonTableRow columns={4} />
        <SkeletonTableRow columns={4} />
      </div>
    </div>
  )
}

function OverviewPageSkeleton() {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <SkeletonHeading className="h-9 w-1/3" />
      <SkeletonLines count={3} />

      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

function GenericPageSkeleton() {
  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <SkeletonHeading className="h-9 w-1/2" />
      <SkeletonLines count={2} />

      <div className="space-y-4">
        <SkeletonHeading className="h-6 w-1/3" />
        <div className="p-6 border border-border rounded-lg space-y-3">
          <SkeletonImage />
          <SkeletonHeading />
          <SkeletonLines count={2} />
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonHeading className="h-6 w-1/3" />
        <div className="p-6 border border-border rounded-lg space-y-3">
          <SkeletonImage />
          <SkeletonHeading />
          <SkeletonLines count={2} />
        </div>
      </div>
    </div>
  )
}

function SkeletonImage() {
  return (
    <div className="w-full aspect-video rounded-md bg-muted motion-safe:animate-pulse motion-reduce:opacity-70" />
  )
}

export function RoutePending() {
  const location = useLocation()
  const [showSkeleton, setShowSkeleton] = useState(false)

  const delay = getSkeletonDelay(location.pathname)

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), delay)
    return () => clearTimeout(timer)
  }, [location.pathname, delay])

  const routeName = getRouteName(location.pathname)
  const skeletonType = getSkeletonType(location.pathname)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${routeName}`}
    >
      <div className="w-full max-w-4xl p-8 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" variant="default" />
          <p className="text-sm text-muted-foreground">Loading {routeName}...</p>
        </div>

        {showSkeleton && (
          <div className="w-full">
            {skeletonType === 'component' && <ComponentPageSkeleton />}
            {skeletonType === 'overview' && <OverviewPageSkeleton />}
            {skeletonType === 'generic' && <GenericPageSkeleton />}
          </div>
        )}
      </div>
    </div>
  )
}
