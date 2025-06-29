import { VideoGenerationDynamic } from '@/components/video/video-generation-dynamic';

export default function GenerateVideoPage() {
  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-3xl font-bold mb-6">Gerar Novo Vídeo</h1>
      <VideoGenerationDynamic />
    </div>
  );
}