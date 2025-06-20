'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Sparkles, Wand2, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CreateVideoPage() {
  const [prompt, setPrompt] = useState('')
  const [provider, setProvider] = useState('LUMA')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState('5')
  const [enhancePrompt, setEnhancePrompt] = useState(true)

  const characterCount = prompt.length
  const estimatedCredits = provider === 'LUMA' ? 5 : 7

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Video</h1>
        <p className="text-muted-foreground mt-2">
          Describe your vision and let AI bring it to life
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle>Video Description</CardTitle>
              <CardDescription>
                Describe what you want to see in your video. Be specific and creative!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="A serene beach at sunset with gentle waves, golden sand, and seagulls flying overhead..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex justify-between text-sm">
                  <span className={characterCount < 10 ? 'text-destructive' : 'text-muted-foreground'}>
                    {characterCount}/500 characters
                  </span>
                  {characterCount < 10 && (
                    <span className="text-destructive">Minimum 10 characters required</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enhance"
                  checked={enhancePrompt}
                  onCheckedChange={setEnhancePrompt}
                />
                <Label htmlFor="enhance" className="flex items-center gap-2 cursor-pointer">
                  <Wand2 className="h-4 w-4" />
                  Enhance prompt with AI
                  <span className="text-xs text-muted-foreground">(Recommended)</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Video Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Video Settings</CardTitle>
              <CardDescription>
                Customize your video output
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Model Selection */}
              <div className="space-y-3">
                <Label>AI Model</Label>
                <RadioGroup value={provider} onValueChange={setProvider}>
                  <div className="space-y-3">
                    {/* Luma Options */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Luma Dream Machine</div>
                      <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="LUMA_V1" id="luma-v1" className="mt-1" />
                        <Label htmlFor="luma-v1" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Luma V1</span>
                            <Badge variant="secondary" className="text-xs">PRO</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Fast generation, great for most use cases
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-medium text-primary">3 credits</span>
                            <span className="text-xs text-muted-foreground">~2-3 min generation</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="LUMA_V2" id="luma-v2" className="mt-1" />
                        <Label htmlFor="luma-v2" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Luma V2</span>
                            <Badge className="text-xs">BEST</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Enhanced quality, ultra-realistic results
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-medium text-primary">5 credits</span>
                            <span className="text-xs text-muted-foreground">~3-4 min generation</span>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Kling Options */}
                    <div className="space-y-2 pt-3">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Kling AI</div>
                      <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="KLING_V1" id="kling-v1" className="mt-1" />
                        <Label htmlFor="kling-v1" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Kling V1 (STD)</span>
                            <Badge variant="secondary" className="text-xs">PRO</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Creative and artistic, standard quality
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-medium text-primary">5 credits</span>
                            <span className="text-xs text-muted-foreground">~2-3 min generation</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="KLING_V2" id="kling-v2" className="mt-1" />
                        <Label htmlFor="kling-v2" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Kling V2.1 (PRO)</span>
                            <Badge className="text-xs">BEST</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Latest model, cinematic quality, advanced features
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-medium text-primary">10 credits</span>
                            <span className="text-xs text-muted-foreground">~4-5 min generation</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger id="aspect-ratio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="7">7 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Generation Summary */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI Model</span>
                  <span className="font-medium">{provider}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aspect Ratio</span>
                  <span className="font-medium">{aspectRatio}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{duration} seconds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Enhance Prompt</span>
                  <span className="font-medium">{enhancePrompt ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Credits Required</span>
                  <span className="text-2xl font-bold text-primary">{estimatedCredits}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  You have 10 credits available
                </div>
              </div>

              <Button 
                className="w-full glow-effect" 
                size="lg"
                disabled={characterCount < 10}
              >
                Generate Video
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tips:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Be specific about colors, lighting, and mood</li>
                <li>• Mention camera movements for dynamic shots</li>
                <li>• Include details about the environment</li>
                <li>• Avoid copyrighted characters or brands</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}