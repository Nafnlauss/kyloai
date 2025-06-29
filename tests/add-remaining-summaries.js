// Script para adicionar summaries aos modelos que ainda não têm
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

console.log('🔧 Adicionando summaries aos modelos restantes...');

// Lista de modelos e suas summaries
const summaries = {
  // KlingAI
  'kling-1.0': 'Affordable video generation with good quality and natural motion',
  'kling-1.1': 'Enhanced version with improved motion and quality',
  'kling-1.2': 'Advanced model with extended duration support',
  'kling-1.5': 'Professional grade with better resolution and duration options',
  'kling-1.6': 'Refined model with optimized performance',
  'kling-2.0': 'Next-gen video model with native lip-sync and 4K support',
  'kling-2.1': 'Latest version with enhanced features and quality',
  'kling-2.1-master': 'Ultimate quality with 8K resolution and extended durations',
  'kling-professional': 'Enterprise-grade with up to 120s duration and premium features',
  
  // BFL FLUX
  'bfl-flux-schnell': 'Ultra-fast image generation for quick prototyping',
  'bfl-flux-dev': 'Development-friendly image generation for rapid prototyping',
  'bfl-flux-1.1-pro': 'Professional image generation with enhanced quality',
  'bfl-flux-1.0-pro': 'Stable professional model with reliable results',
  'bfl-flux-ultra': 'Ultra-high quality images up to 4K resolution',
  'bfl-flux-raw': 'Raw photographic style for realistic images',
  'bfl-flux-fill': 'Specialized for image inpainting and filling',
  'bfl-flux-depth': 'Depth-aware image generation for 3D effects',
  'bfl-flux-canny': 'Edge-guided image generation for precise control',
  'bfl-flux-redux': 'Lightweight model for fast image generation',
  
  // ElevenLabs
  'elevenlabs-v3': 'Standard text-to-speech with natural voices',
  'elevenlabs-multilingual-v2': 'Advanced multilingual TTS with 27+ languages and natural voices',
  'elevenlabs-multilingual-v1': 'Multilingual TTS supporting 18 languages',
  'elevenlabs-english-v1': 'English-only TTS with optimized performance',
  'elevenlabs-turbo-v2': 'Fast TTS with 8 language support',
  'elevenlabs-turbo-v2.5': 'Enhanced turbo model with Arabic support',
  'elevenlabs-flash': 'Ultra-fast English-only TTS',
  'elevenlabs-flash-v2.5': 'Latest flash model with improved quality',
  
  // PiAPI
  'piapi-hailuo': 'Versatile video generation with balanced quality and speed',
  'piapi-hunyuan': 'Tencent advanced video model with excellent motion understanding',
  'piapi-omnihuman': 'Specialized in human video generation with native lip-sync',
  'piapi-skyreels': 'Cinematic video generation with up to 4K resolution',
  'piapi-wan-2.1': 'Efficient video model for quick generation',
  'piapi-midjourney-v6': 'Premium artistic image generation',
  'piapi-gpt-image-1': 'AI-powered image generation with good quality',
  'piapi-suno-v3': 'Generate complete songs with vocals and instrumentals',
  'piapi-diffrhythm': 'Instrumental music generation for background tracks',
  'piapi-udio': 'Advanced music generation with multiple vocal styles',
  'piapi-moshi': 'Simple and efficient text-to-speech',
  'piapi-f5-tts': 'Fast text-to-speech with Chinese support',
  'piapi-mmaudio': 'Generate sound effects and ambient audio',
  'piapi-ace-step-ai': 'AI-powered music composition',
  
  // NewportAI
  'newport-ai-portrait': 'Generate professional AI portraits',
  'newport-clothing-matting': 'Extract clothing from images precisely',
  'newport-human-matting': 'Remove backgrounds from human subjects',
  'newport-ai-model': 'Create AI fashion model images',
  'newport-remove-background': 'Fast and accurate background removal',
  'newport-replace-background': 'Replace image backgrounds seamlessly',
  'newport-enhance': 'Upscale and enhance image quality up to 4x',
  'newport-colorize': 'Add natural colors to black and white images',
  'newport-restore-face': 'Restore and enhance facial details',
  'newport-pag-merge': 'Merge multiple images into video',
  'newport-talking-image': 'Animate portraits with synchronized speech',
  'newport-text-to-video': 'Convert text descriptions into engaging videos',
  'newport-image-to-video': 'Animate static images into dynamic videos',
  'newport-character-to-video': 'Create character-driven video content',
  'newport-image-to-video-sonic': 'Fast image animation with basic quality',
  'newport-text-to-video-wan2': 'Efficient text-to-video generation',
  'newport-image-to-video-wan2': 'Quick image-to-video conversion',
  'newport-do-tts-common': 'Standard TTS with Portuguese focus and 16 voices',
  'newport-do-tts-pro': 'Professional TTS with 22 voices and 11 languages',
  'newport-composite-after-matting': 'Composite videos after background removal'
};

let updatedCount = 0;

// Para cada modelo, adicionar summary se não existir
for (const [modelId, summary] of Object.entries(summaries)) {
  // Procurar o modelo pelo ID
  const modelRegex = new RegExp(
    `id:\\s*['"]${modelId}['"][^}]*?credits:\\s*\\{[^}]+\\}(?!\\s*,\\s*summary:)`,
    'gs'
  );
  
  if (content.match(modelRegex)) {
    content = content.replace(modelRegex, (match) => {
      updatedCount++;
      return match + `,\n      summary: '${summary}'`;
    });
  }
}

// Salvar
fs.writeFileSync(configPath, content);

console.log(`✅ Adicionadas ${updatedCount} summaries aos modelos`);