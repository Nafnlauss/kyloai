'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface EditUserCreditsDialogProps {
  user: {
    id: string
    email: string
    name: string | null
    credits: number
  }
  open: boolean
  onClose: () => void
}

export function EditUserCreditsDialog({
  user,
  open,
  onClose
}: EditUserCreditsDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [operation, setOperation] = useState<'set' | 'add' | 'subtract'>('set')
  const [amount, setAmount] = useState(user.credits.toString())

  const handleSubmit = async () => {
    const credits = parseInt(amount)
    if (isNaN(credits) || credits < 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid number',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, amount: credits }),
      })

      if (!response.ok) throw new Error('Failed to update credits')

      toast({
        title: 'Success',
        description: 'Credits updated successfully',
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update credits',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getNewCredits = () => {
    const credits = parseInt(amount) || 0
    switch (operation) {
      case 'set':
        return credits
      case 'add':
        return user.credits + credits
      case 'subtract':
        return Math.max(0, user.credits - credits)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Credits</DialogTitle>
          <DialogDescription>
            Update credits for {user.name || user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Current Credits</Label>
            <div className="text-2xl font-bold">{user.credits}</div>
          </div>

          <div className="space-y-2">
            <Label>Operation</Label>
            <RadioGroup value={operation} onValueChange={(v: any) => setOperation(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="set" id="set" />
                <Label htmlFor="set">Set to specific amount</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add">Add credits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subtract" id="subtract" />
                <Label htmlFor="subtract">Subtract credits</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="text-sm text-muted-foreground">New Balance</div>
            <div className="text-2xl font-bold">{getNewCredits()}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}