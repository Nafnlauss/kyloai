# FormAgent - Form Handling Specialist
**Library:** react-hook-form@7.54.2, zod@3.24.1
**Validation:** Client + Server with zod schemas
**UI:** shadcn/ui form components

## Form Pattern with Validation
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const videoGenerationSchema = z.object({
  prompt: z.string()
    .min(10, "Prompt must be at least 10 characters")
    .max(500, "Prompt must be less than 500 characters")
    .refine(
      (val) => !containsProfanity(val),
      "Prompt contains inappropriate content"
    ),
  provider: z.enum(["LUMA", "KLING"]),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
  duration: z.number().min(3).max(10).default(5),
  enhancePrompt: z.boolean().default(true),
})

export function VideoGenerationForm() {
  const form = useForm<z.infer<typeof videoGenerationSchema>>({
    resolver: zodResolver(videoGenerationSchema),
    defaultValues: {
      prompt: "",
      provider: "LUMA",
      aspectRatio: "16:9",
      duration: 5,
      enhancePrompt: true,
    },
  })

  const onSubmit = async (data: z.infer<typeof videoGenerationSchema>) => {
    try {
      const result = await generateVideo(data)
      toast.success("Video generation started!")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
}
```

## Security Features
- CSRF token validation
- Rate limiting per user
- Input sanitization
- File upload validation