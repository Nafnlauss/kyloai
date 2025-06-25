'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileVideo, 
  Image as ImageIcon, 
  AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Generation History</h1>
          <p className="text-zinc-400 mt-2">
            View all your creations in one place
          </p>
        </div>

        {/* Empty State */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No generations yet
            </h3>
            <p className="text-zinc-400 text-center max-w-md mb-8">
              You haven't created any content yet. Start now and see your creations appear here!
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/studio/video')}
                className="bg-[#A259FF] hover:bg-[#9148e0]"
              >
                <FileVideo className="w-4 h-4 mr-2" />
                Create Video
              </Button>
              <Button
                onClick={() => router.push('/studio/image')}
                variant="outline"
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Create Image
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}