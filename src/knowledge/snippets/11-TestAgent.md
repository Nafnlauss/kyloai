# TestAgent - Testing Specialist
**Framework:** Jest + React Testing Library
**E2E:** Playwright
**Coverage:** 80% minimum

## Unit Test Pattern
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoGenerationForm } from '@/components/video-generation-form'

describe('VideoGenerationForm', () => {
  it('validates prompt length', async () => {
    const user = userEvent.setup()
    render(<VideoGenerationForm />)
    
    const input = screen.getByRole('textbox', { name: /prompt/i })
    const submitButton = screen.getByRole('button', { name: /generate/i })
    
    // Too short
    await user.type(input, 'Short')
    await user.click(submitButton)
    
    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument()
    
    // Valid
    await user.clear(input)
    await user.type(input, 'A beautiful sunset over mountains')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/at least 10 characters/i)).not.toBeInTheDocument()
    })
  })
})
```

## Integration Test
```typescript
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/videos/generate/route'
import { prisma } from '@/lib/prisma'

describe('/api/videos/generate', () => {
  it('deducts credits on successful generation', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        prompt: 'Test video prompt',
        provider: 'LUMA',
      },
      headers: {
        authorization: 'Bearer valid-token',
      },
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    
    const user = await prisma.user.findUnique({
      where: { id: 'test-user-id' },
    })
    
    expect(user.credits).toBe(90) // Started with 100
  })
})
```

## E2E Test
```typescript
import { test, expect } from '@playwright/test'

test('complete video generation flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Sign In')
  await page.fill('[name=email]', 'test@example.com')
  await page.fill('[name=password]', 'password')
  await page.click('button[type=submit]')
  
  await page.click('text=Generate Video')
  await page.fill('[name=prompt]', 'A futuristic city at night')
  await page.click('text=Generate')
  
  await expect(page.locator('text=Processing')).toBeVisible()
})
```