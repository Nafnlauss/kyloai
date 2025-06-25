# UiAgent - UI/UX Specialist
**Library:** @radix-ui/react-*@2.1.2, shadcn/ui
**Framework:** Next.js App Router with RSC
**Styling:** Tailwind CSS with dark theme

## Component Patterns
```typescript
// Accessible, composable components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function VideoCard({ video }: { video: Video }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="line-clamp-1">{video.prompt}</CardTitle>
        <CardDescription>{formatRelativeTime(video.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <VideoPlayer src={video.url} thumbnail={video.thumbnailUrl} />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" variant="secondary">
          <Download className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
```

## Dark Theme Variables
- Background: hsl(222.2 84% 4.9%)
- Foreground: hsl(210 40% 98%)
- Primary: hsl(263.4 70% 50.4%) - Hedra purple
- Muted: hsl(217.2 32.6% 17.5%)
- Border: hsl(217.2 32.6% 17.5%)

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader optimized
- WCAG 2.1 AA compliant