'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Sparkles, TrendingUp, Video } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">
          Ready to create amazing AI videos? Start with a new project or continue where you left off.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Credits Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">10</div>
            <p className="text-sm text-muted-foreground mt-1">
              Enough for 2 videos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5" />
              Videos Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground mt-1">
              Start creating now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">~3m</div>
            <p className="text-sm text-muted-foreground mt-1">
              Average per video
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99.5%</div>
            <p className="text-sm text-muted-foreground mt-1">
              Reliability guaranteed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Video CTA */}
      <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your First AI Video</CardTitle>
          <CardDescription className="text-base">
            Transform your ideas into stunning videos with our advanced AI models.
            Choose between Luma Dream Machine and Kling AI for different styles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="glow-effect" asChild>
            <Link href="/dashboard/create">
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Start creating your first AI video and it will appear here
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/create">Create First Video</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}