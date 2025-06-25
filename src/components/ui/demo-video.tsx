'use client'

import { useState } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  
  // URL do vídeo demo - você pode substituir depois do commit
  const videoUrl = '/demo-video.mp4' // Você pode usar um vídeo temporário ou placeholder
  
  // Posições fixas para as estrelas para evitar erro de hidratação
  const starPositions = [
    { left: '10%', top: '15%', delay: '0s' },
    { left: '25%', top: '80%', delay: '0.5s' },
    { left: '40%', top: '20%', delay: '1s' },
    { left: '60%', top: '70%', delay: '1.5s' },
    { left: '80%', top: '30%', delay: '2s' },
    { left: '15%', top: '50%', delay: '2.5s' },
    { left: '90%', top: '60%', delay: '3s' },
    { left: '35%', top: '40%', delay: '3.5s' },
    { left: '70%', top: '85%', delay: '4s' },
    { left: '50%', top: '10%', delay: '4.5s' },
    { left: '5%', top: '90%', delay: '0.2s' },
    { left: '45%', top: '65%', delay: '0.8s' },
    { left: '85%', top: '25%', delay: '1.3s' },
    { left: '20%', top: '35%', delay: '1.8s' },
    { left: '65%', top: '95%', delay: '2.3s' },
    { left: '30%', top: '5%', delay: '2.8s' },
    { left: '75%', top: '45%', delay: '3.3s' },
    { left: '55%', top: '75%', delay: '3.8s' },
    { left: '95%', top: '55%', delay: '4.3s' },
    { left: '10%', top: '60%', delay: '4.8s' },
  ]
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
      {!isPlaying ? (
        <>
          {/* Placeholder com imagem de preview */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  Veja o Poder da Nossa IA
                </h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  Cenas cinematográficas épicas geradas por IA: batalhas espaciais, 
                  eras glaciais, civilizações antigas e muito mais
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setIsPlaying(true)}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Assistir Demo (30s)
                </Button>
              </div>
            </div>
          </div>
          
          {/* Efeito visual de partículas */}
          <div className="absolute inset-0 opacity-30">
            {starPositions.map((position, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: position.left,
                  top: position.top,
                  animationDelay: position.delay,
                }}
              >
                <div className="h-1 w-1 bg-white rounded-full" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            controls
            onEnded={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta vídeo HTML5.
          </video>
          
          {/* Botão de mute no canto */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
        </>
      )}
    </div>
  )
}

/* 
ROTEIRO DO VÍDEO DEMO (30 segundos):

0-5s: BATALHA ESPACIAL
- Naves futuristas em combate intenso
- Explosões e lasers cortando o espaço
- Cinematografia estilo Star Wars

5-10s: ERA GLACIAL
- Transição abrupta para paisagem congelada
- Mamutes caminhando na neve
- Humanos primitivos com lanças caçando

10-15s: CIVILIZAÇÃO ANTIGA
- Pirâmides sendo construídas
- Faraós e exércitos marchando
- Templos dourados sob o sol do deserto

15-20s: ERA DOS DINOSSAUROS
- T-Rex rugindo em floresta pré-histórica
- Vulcão entrando em erupção ao fundo
- Pterodáctilos voando sobre lava

20-25s: FUTURO CYBERPUNK
- Cidade neon futurista
- Carros voadores entre arranha-céus
- Chuva e reflexos holográficos

25-30s: MONTAGEM RÁPIDA
- Cortes rápidos de todas as cenas
- Logo Kylo aparece com efeito de partículas
- Fade para preto com CTA

Cada cena deve ter:
- Qualidade cinematográfica 4K
- Movimentos de câmera dinâmicos
- Cores vibrantes e contrastantes
- Transições impactantes
*/