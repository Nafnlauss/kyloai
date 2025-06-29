import * as Sentry from '@sentry/nextjs'

// Sentry API configuration
const SENTRY_API_BASE = 'https://sentry.io/api/0'
const SENTRY_ORG = process.env.SENTRY_ORG_SLUG || 'kyloai'
const SENTRY_PROJECT = process.env.SENTRY_PROJECT_SLUG || 'javascript-nextjs'
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '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'

export interface SentryIssue {
  id: string
  title: string
  culprit: string
  permalink: string
  level: string
  status: string
  isPublic: boolean
  platform: string
  project: {
    id: string
    name: string
    slug: string
  }
  type: string
  metadata: {
    value?: string
    type?: string
    filename?: string
    function?: string
  }
  numEvents: number
  userCount: number
  firstSeen: string
  lastSeen: string
  count: string
  stats: {
    '24h': Array<[number, number]>
  }
}

export interface SentryEvent {
  id: string
  message: string
  level: string
  platform: string
  datetime: string
  tags: Array<{ key: string; value: string }>
  user: {
    id?: string
    email?: string
    username?: string
    ip_address?: string
  }
  context: Record<string, any>
  entries: Array<{
    type: string
    data: any
  }>
}

export class SentryClient {
  private headers: HeadersInit

  constructor() {
    this.headers = {
      'Authorization': `Bearer ${SENTRY_AUTH_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Get recent issues from Sentry
   */
  async getIssues(options: {
    statsPeriod?: string
    query?: string
    limit?: number
    sort?: string
  } = {}): Promise<SentryIssue[]> {
    const {
      statsPeriod = '24h',
      query = 'is:unresolved',
      limit = 25,
      sort = 'priority'
    } = options

    try {
      const params = new URLSearchParams({
        statsPeriod,
        query,
        limit: limit.toString(),
        sort
      })

      const response = await fetch(
        `${SENTRY_API_BASE}/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?${params}`,
        { headers: this.headers }
      )

      if (!response.ok) {
        console.error('Sentry API error:', response.status, response.statusText)
        return []
      }

      const issues = await response.json()
      return issues
    } catch (error) {
      console.error('Failed to fetch Sentry issues:', error)
      return []
    }
  }

  /**
   * Get issue details
   */
  async getIssueDetails(issueId: string): Promise<SentryIssue | null> {
    try {
      const response = await fetch(
        `${SENTRY_API_BASE}/issues/${issueId}/`,
        { headers: this.headers }
      )

      if (!response.ok) {
        console.error('Sentry API error:', response.status)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch issue details:', error)
      return null
    }
  }

  /**
   * Get events for an issue
   */
  async getIssueEvents(issueId: string, limit = 10): Promise<SentryEvent[]> {
    try {
      const response = await fetch(
        `${SENTRY_API_BASE}/issues/${issueId}/events/?limit=${limit}`,
        { headers: this.headers }
      )

      if (!response.ok) {
        console.error('Sentry API error:', response.status)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch issue events:', error)
      return []
    }
  }

  /**
   * Update issue status
   */
  async updateIssueStatus(issueId: string, status: 'resolved' | 'ignored' | 'unresolved'): Promise<boolean> {
    try {
      const response = await fetch(
        `${SENTRY_API_BASE}/issues/${issueId}/`,
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify({ status })
        }
      )

      return response.ok
    } catch (error) {
      console.error('Failed to update issue status:', error)
      return false
    }
  }

  /**
   * Get project stats
   */
  async getProjectStats(statsPeriod = '24h'): Promise<{
    totalIssues: number
    unresolvedIssues: number
    usersAffected: number
    eventsCount: number
  } | null> {
    try {
      const response = await fetch(
        `${SENTRY_API_BASE}/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/stats/?statsPeriod=${statsPeriod}`,
        { headers: this.headers }
      )

      if (!response.ok) {
        console.error('Sentry API error:', response.status)
        return null
      }

      const stats = await response.json()
      
      // Calculate totals from the stats
      return {
        totalIssues: stats.length,
        unresolvedIssues: stats.filter((s: any) => s.status === 'unresolved').length,
        usersAffected: stats.reduce((sum: number, s: any) => sum + (s.userCount || 0), 0),
        eventsCount: stats.reduce((sum: number, s: any) => sum + parseInt(s.count || '0'), 0)
      }
    } catch (error) {
      console.error('Failed to fetch project stats:', error)
      return null
    }
  }

  /**
   * Convert Sentry issue to alert format
   */
  static issueToAlert(issue: SentryIssue) {
    // Determine priority based on level and impact
    let priority: 'critical' | 'high' | 'medium' | 'low' = 'low'
    
    if (issue.level === 'fatal' || issue.level === 'error') {
      if (issue.userCount > 50 || parseInt(issue.count) > 100) {
        priority = 'critical'
      } else if (issue.userCount > 10 || parseInt(issue.count) > 50) {
        priority = 'high'
      } else {
        priority = 'medium'
      }
    } else if (issue.level === 'warning') {
      priority = issue.userCount > 20 ? 'medium' : 'low'
    }

    // Determine alert type
    const type = issue.level === 'fatal' || issue.level === 'error' ? 'error' : 
                 issue.level === 'warning' ? 'warning' : 'info'

    return {
      id: `sentry-${issue.id}`,
      type,
      title: issue.title || issue.metadata.value || 'Unknown Error',
      message: `${issue.culprit || 'Unknown location'} - ${issue.numEvents} events affecting ${issue.userCount} users`,
      timestamp: new Date(issue.lastSeen),
      read: false,
      priority,
      actionUrl: issue.permalink,
      source: 'sentry' as const,
      metadata: {
        issueId: issue.id,
        project: issue.project.slug,
        platform: issue.platform,
        firstSeen: issue.firstSeen,
        lastSeen: issue.lastSeen,
        count: issue.count,
        userCount: issue.userCount
      }
    }
  }
}

// Export singleton instance
export const sentryClient = new SentryClient()