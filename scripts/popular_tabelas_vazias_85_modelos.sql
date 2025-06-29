-- ====================================
-- SQL PARA POPULAR APENAS AS TABELAS VAZIAS
-- NÃO RECRIAR media_apis (já tem 85 registros)
-- ====================================

-- Base de cálculo para margem 100%:
-- Plano mais barato: $90/16000 créditos = $0.005625/crédito
-- Custo máximo permitido: $0.0028125 por crédito
-- Fórmula: credits = CEIL(api_cost / 0.0028125)

-- ====================================
-- MEDIA_FORMATS - Formatos disponíveis
-- ====================================

-- Formatos de Vídeo
INSERT INTO media_formats (api_id, format_value, display_name, format_type) VALUES
-- LUMA LABS
('luma-ray2-flash', '540p', '540p', 'video'),
('luma-ray2', '720p', '720p HD', 'video'),
('luma-ray2', '1080p', '1080p Full HD', 'video'),
('luma-ray2', '4K', '4K Ultra HD', 'video'),
('luma-ray1.6', '720p', '720p HD', 'video'),
('luma-ray1.6', '1080p', '1080p Full HD', 'video'),

-- KLING AI
('kling-1.0', '540p', '540p', 'video'),
('kling-1.0', '720p', '720p HD', 'video'),
('kling-1.0', '1080p', '1080p Full HD', 'video'),
('kling-1.1', '540p', '540p', 'video'),
('kling-1.1', '720p', '720p HD', 'video'),
('kling-1.1', '1080p', '1080p Full HD', 'video'),
('kling-1.2', '540p', '540p', 'video'),
('kling-1.2', '720p', '720p HD', 'video'),
('kling-1.2', '1080p', '1080p Full HD', 'video'),
('kling-1.5', '540p', '540p', 'video'),
('kling-1.5', '720p', '720p HD', 'video'),
('kling-1.5', '1080p', '1080p Full HD', 'video'),
('kling-1.6', '540p', '540p', 'video'),
('kling-1.6', '720p', '720p HD', 'video'),
('kling-1.6', '1080p', '1080p Full HD', 'video'),
('kling-2.0', '720p', '720p HD', 'video'),
('kling-2.0', '1080p', '1080p Full HD', 'video'),
('kling-2.0', '4K', '4K Ultra HD', 'video'),
('kling-2.1', '720p', '720p HD', 'video'),
('kling-2.1', '1080p', '1080p Full HD', 'video'),
('kling-2.1', '4K', '4K Ultra HD', 'video'),
('kling-2.1-master', '1080p', '1080p Full HD', 'video'),
('kling-2.1-master', '4K', '4K Ultra HD', 'video'),
('kling-2.1-master', '8K', '8K Ultra HD', 'video'),
('kling-professional', '1080p', '1080p Full HD', 'video'),
('kling-professional', '4K', '4K Ultra HD', 'video'),

-- PIAPI VIDEO
('piapi-hailuo', '720p', '720p HD', 'video'),
('piapi-hailuo', '1080p', '1080p Full HD', 'video'),
('piapi-hunyuan', '720p', '720p HD', 'video'),
('piapi-hunyuan', '1080p', '1080p Full HD', 'video'),
('piapi-omnihuman', '720p', '720p HD', 'video'),
('piapi-omnihuman', '1080p', '1080p Full HD', 'video'),
('piapi-skyreels', '1080p', '1080p Full HD', 'video'),
('piapi-skyreels', '4K', '4K Ultra HD', 'video'),
('piapi-wan21', '720p', '720p HD', 'video'),

-- NEWPORTAI VIDEO
('newport-text-to-video', '512p', '512p', 'video'),
('newport-text-to-video', '720p', '720p HD', 'video'),
('newport-text-to-video', '1080p', '1080p Full HD', 'video'),
('newport-image-to-video', '512p', '512p', 'video'),
('newport-image-to-video', '720p', '720p HD', 'video'),
('newport-image-to-video', '1080p', '1080p Full HD', 'video'),
('newport-character-to-video', '720p', '720p HD', 'video'),
('newport-template-to-video', '720p', '720p HD', 'video'),
('newport-lipsync', '720p', '720p HD', 'video'),
('newport-talking-image', '720p', '720p HD', 'video'),
('newport-video-translate-lipsync', '720p', '720p HD', 'video'),
('newport-video-translate-voice', '720p', '720p HD', 'video'),
('newport-swap-face-video', '720p', '720p HD', 'video'),
('newport-image-to-video-sonic', '720p', '720p HD', 'video'),
('newport-text-to-video-wan2', '720p', '720p HD', 'video'),
('newport-image-to-video-wan2', '720p', '720p HD', 'video'),
('newport-pag-merge', '720p', '720p HD', 'video'),
('newport-live-photo', '720p', '720p HD', 'video'),
('newport-video-matting', '720p', '720p HD', 'video'),
('newport-composite-video', '720p', '720p HD', 'video'),

-- Formatos de Imagem
-- BFL FLUX
('bfl-flux-schnell', 'standard', 'Standard Quality', 'image'),
('bfl-flux-schnell', 'hd', 'HD Quality', 'image'),
('bfl-flux-dev', 'standard', 'Standard Quality', 'image'),
('bfl-flux-dev', 'hd', 'HD Quality', 'image'),
('bfl-flux-1.1-pro', 'standard', 'Standard Quality', 'image'),
('bfl-flux-1.1-pro', 'hd', 'HD Quality', 'image'),
('bfl-flux-1.0-pro', 'standard', 'Standard Quality', 'image'),
('bfl-flux-1.0-pro', 'hd', 'HD Quality', 'image'),
('bfl-flux-ultra', 'hd', 'HD Quality', 'image'),
('bfl-flux-ultra', 'ultra', 'Ultra Quality', 'image'),
('bfl-flux-raw', 'standard', 'Standard Quality', 'image'),
('bfl-flux-raw', 'hd', 'HD Quality', 'image'),
('bfl-flux-fill', 'standard', 'Standard Quality', 'image'),
('bfl-flux-fill', 'hd', 'HD Quality', 'image'),
('bfl-flux-depth', 'standard', 'Standard Quality', 'image'),
('bfl-flux-depth', 'hd', 'HD Quality', 'image'),
('bfl-flux-canny', 'standard', 'Standard Quality', 'image'),
('bfl-flux-canny', 'hd', 'HD Quality', 'image'),
('bfl-flux-redux', 'standard', 'Standard Quality', 'image'),
('bfl-flux-redux', 'hd', 'HD Quality', 'image'),

-- PIAPI IMAGE
('piapi-midjourney', 'standard', 'Standard Quality', 'image'),
('piapi-midjourney', 'hd', 'HD Quality', 'image'),
('piapi-gpt-image', 'standard', 'Standard Quality', 'image'),

-- NEWPORTAI IMAGE
('newport-portrait', 'standard', 'Standard Quality', 'image'),
('newport-clothing-matting', 'standard', 'Standard Quality', 'image'),
('newport-human-matting', 'standard', 'Standard Quality', 'image'),
('newport-ai-model', 'standard', 'Standard Quality', 'image'),
('newport-ai-tryon', 'standard', 'Standard Quality', 'image'),
('newport-remove-bg', 'standard', 'Standard Quality', 'image'),
('newport-replace-bg', 'standard', 'Standard Quality', 'image'),
('newport-enhance', 'standard', 'Standard Quality', 'image'),
('newport-enhance', 'hd', 'HD Quality', 'image'),
('newport-inpainting', 'standard', 'Standard Quality', 'image'),
('newport-outpainting', 'standard', 'Standard Quality', 'image'),
('newport-colorize', 'standard', 'Standard Quality', 'image'),
('newport-erase', 'standard', 'Standard Quality', 'image'),
('newport-doc-recognition', 'standard', 'Standard Quality', 'image'),
('newport-remove-stripe', 'standard', 'Standard Quality', 'image'),
('newport-remove-shadow', 'standard', 'Standard Quality', 'image'),
('newport-swap-face', 'standard', 'Standard Quality', 'image'),
('newport-restore-face', 'standard', 'Standard Quality', 'image'),

-- Formatos de Áudio
-- ELEVENLABS
('elevenlabs-v3', 'mp3', 'MP3 Format', 'audio'),
('elevenlabs-v3', 'wav', 'WAV Format', 'audio'),
('elevenlabs-multilingual-v1', 'mp3', 'MP3 Format', 'audio'),
('elevenlabs-multilingual-v2', 'mp3', 'MP3 Format', 'audio'),
('elevenlabs-english-v1', 'mp3', 'MP3 Format', 'audio'),
('elevenlabs-turbo-v2', 'mp3', 'MP3 Format', 'audio'),
('elevenlabs-turbo-v2.5', 'mp3', 'MP3 Format', 'audio'),
('elevenlabs-flash', 'mp3', 'MP3 Format', 'audio'),
('elevenlabs-flash-v2.5', 'mp3', 'MP3 Format', 'audio'),

-- PIAPI AUDIO
('piapi-suno', 'mp3', 'MP3 Format', 'audio'),
('piapi-diffrhythm', 'mp3', 'MP3 Format', 'audio'),
('piapi-udio', 'mp3', 'MP3 Format', 'audio'),
('piapi-moshi', 'mp3', 'MP3 Format', 'audio'),
('piapi-f5-tts', 'mp3', 'MP3 Format', 'audio'),
('piapi-mmaudio', 'mp3', 'MP3 Format', 'audio'),
('piapi-acestep', 'mp3', 'MP3 Format', 'audio'),

-- NEWPORTAI AUDIO
('newport-voice-clone', 'wav', 'WAV Format', 'audio'),
('newport-tts-clone', 'mp3', 'MP3 Format', 'audio'),
('newport-tts-common', 'mp3', 'MP3 Format', 'audio'),
('newport-tts-pro', 'mp3', 'MP3 Format', 'audio'),
('newport-stt', 'text', 'Text Output', 'text'),
('newport-stt-pro', 'text', 'Text Output', 'text'),

-- Especial
('piapi-faceswap', 'image', 'Image Output', 'image'),
('newport-credits', 'json', 'JSON Data', 'data');

-- ====================================
-- MEDIA_PRICING - Preços calculados com margem 100%
-- ====================================

-- LUMA LABS
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- Ray2 Flash (540p, 5s fixo)
('luma-ray2-flash', '540p', 5, 50, 0.14),

-- Ray2 (diferentes formatos e durações)
('luma-ray2', '720p', 5, 253, 0.71),
('luma-ray2', '1080p', 5, 357, 1.00),
('luma-ray2', '4K', 5, 500, 1.40),
('luma-ray2', '720p', 7, 357, 1.00),
('luma-ray2', '1080p', 7, 500, 1.40),
('luma-ray2', '4K', 7, 714, 2.00),
('luma-ray2', '720p', 9, 446, 1.25),
('luma-ray2', '1080p', 9, 613, 1.72),
('luma-ray2', '4K', 9, 893, 2.50),

-- Ray 1.6 Legacy
('luma-ray1.6', '720p', 5, 178, 0.50),
('luma-ray1.6', '1080p', 5, 268, 0.75),
('luma-ray1.6', '720p', 10, 357, 1.00),
('luma-ray1.6', '1080p', 10, 536, 1.50),

-- KLING AI
-- Kling 1.0 (540p-1080p, 10s)
('kling-1.0', '540p', 10, 89, 0.25),
('kling-1.0', '720p', 10, 178, 0.50),
('kling-1.0', '1080p', 10, 357, 1.00),

-- Kling 1.1 (540p-1080p, 10s)
('kling-1.1', '540p', 10, 89, 0.25),
('kling-1.1', '720p', 10, 178, 0.50),
('kling-1.1', '1080p', 10, 357, 1.00),

-- Kling 1.2 (540p-1080p, 15s)
('kling-1.2', '540p', 15, 134, 0.375),
('kling-1.2', '720p', 15, 268, 0.75),
('kling-1.2', '1080p', 15, 536, 1.50),

-- Kling 1.5 (540p-1080p, 15s)
('kling-1.5', '540p', 15, 134, 0.375),
('kling-1.5', '720p', 15, 268, 0.75),
('kling-1.5', '1080p', 15, 536, 1.50),

-- Kling 1.6 (540p-1080p, 20s)
('kling-1.6', '540p', 20, 178, 0.50),
('kling-1.6', '720p', 20, 357, 1.00),
('kling-1.6', '1080p', 20, 714, 2.00),

-- Kling 2.0 (720p-4K, 30s)
('kling-2.0', '720p', 30, 536, 1.50),
('kling-2.0', '1080p', 30, 1072, 3.00),
('kling-2.0', '4K', 30, 2143, 6.00),

-- Kling 2.1 (720p-4K, 30s)
('kling-2.1', '720p', 30, 536, 1.50),
('kling-2.1', '1080p', 30, 1072, 3.00),
('kling-2.1', '4K', 30, 2143, 6.00),

-- Kling 2.1 Master (1080p-8K, 60s)
('kling-2.1-master', '1080p', 60, 2143, 6.00),
('kling-2.1-master', '4K', 60, 4286, 12.00),
('kling-2.1-master', '8K', 60, 6000, 16.80),

-- Kling Professional (1080p-4K, 120s)
('kling-professional', '1080p', 120, 3600, 10.00),
('kling-professional', '4K', 120, 5400, 15.00);

-- BFL FLUX (Imagem, duration=0)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('bfl-flux-schnell', 'standard', 0, 5, 0.014),
('bfl-flux-schnell', 'hd', 0, 5, 0.014),
('bfl-flux-dev', 'standard', 0, 9, 0.025),
('bfl-flux-dev', 'hd', 0, 9, 0.025),
('bfl-flux-1.1-pro', 'standard', 0, 15, 0.042),
('bfl-flux-1.1-pro', 'hd', 0, 15, 0.042),
('bfl-flux-1.0-pro', 'standard', 0, 18, 0.05),
('bfl-flux-1.0-pro', 'hd', 0, 18, 0.05),
('bfl-flux-ultra', 'hd', 0, 36, 0.10),
('bfl-flux-ultra', 'ultra', 0, 43, 0.12),
('bfl-flux-raw', 'standard', 0, 25, 0.07),
('bfl-flux-raw', 'hd', 0, 25, 0.07),
('bfl-flux-fill', 'standard', 0, 25, 0.07),
('bfl-flux-fill', 'hd', 0, 35, 0.098),
('bfl-flux-depth', 'standard', 0, 22, 0.06),
('bfl-flux-depth', 'hd', 0, 28, 0.078),
('bfl-flux-canny', 'standard', 0, 22, 0.06),
('bfl-flux-canny', 'hd', 0, 28, 0.078),
('bfl-flux-redux', 'standard', 0, 20, 0.056),
('bfl-flux-redux', 'hd', 0, 26, 0.073),

-- ELEVENLABS (TTS - cobrado por 1000 caracteres)
('elevenlabs-v3', 'mp3', 1000, 90, 0.25),
('elevenlabs-v3', 'wav', 1000, 90, 0.25),
('elevenlabs-multilingual-v1', 'mp3', 1000, 50, 0.14),
('elevenlabs-multilingual-v2', 'mp3', 1000, 65, 0.18),
('elevenlabs-english-v1', 'mp3', 1000, 25, 0.07),
('elevenlabs-turbo-v2', 'mp3', 1000, 30, 0.084),
('elevenlabs-turbo-v2.5', 'mp3', 1000, 33, 0.092),
('elevenlabs-flash', 'mp3', 1000, 25, 0.07),
('elevenlabs-flash-v2.5', 'mp3', 1000, 33, 0.092),

-- PIAPI VIDEO  
('piapi-hailuo', '720p', 5, 89, 0.25),
('piapi-hailuo', '1080p', 5, 178, 0.50),
('piapi-hailuo', '720p', 15, 268, 0.75),
('piapi-hailuo', '1080p', 15, 536, 1.50),
('piapi-hailuo', '720p', 30, 536, 1.50),
('piapi-hailuo', '1080p', 30, 1072, 3.00),
('piapi-hunyuan', '720p', 5, 71, 0.20),
('piapi-hunyuan', '1080p', 5, 143, 0.40),
('piapi-hunyuan', '720p', 10, 143, 0.40),
('piapi-hunyuan', '1080p', 10, 286, 0.80),
('piapi-hunyuan', '720p', 20, 286, 0.80),
('piapi-hunyuan', '1080p', 20, 572, 1.60),
('piapi-omnihuman', '720p', 0, 178, 0.50),
('piapi-omnihuman', '1080p', 0, 357, 1.00),
('piapi-skyreels', '1080p', 10, 357, 1.00),
('piapi-skyreels', '4K', 10, 714, 2.00),
('piapi-skyreels', '1080p', 30, 1072, 3.00),
('piapi-skyreels', '4K', 30, 2143, 6.00),
('piapi-skyreels', '1080p', 60, 2143, 6.00),
('piapi-skyreels', '4K', 60, 4286, 12.00),
('piapi-wan21', '720p', 5, 54, 0.15),
('piapi-wan21', '720p', 10, 107, 0.30),
('piapi-wan21', '720p', 15, 161, 0.45),

-- PIAPI IMAGEM
('piapi-midjourney', 'standard', 0, 100, 0.28),
('piapi-midjourney', 'hd', 0, 150, 0.42),
('piapi-gpt-image', 'standard', 0, 36, 0.10),

-- PIAPI AUDIO
('piapi-suno', 'mp3', 180, 450, 1.26),
('piapi-suno', 'mp3', 300, 750, 2.10),
('piapi-diffrhythm', 'mp3', 60, 89, 0.25),
('piapi-udio', 'mp3', 120, 357, 1.00),
('piapi-moshi', 'mp3', 0, 25, 0.07),
('piapi-f5-tts', 'mp3', 1000, 18, 0.05),
('piapi-mmaudio', 'mp3', 0, 178, 0.50),
('piapi-acestep', 'mp3', 60, 89, 0.25),

-- PIAPI ESPECIAL
('piapi-faceswap', 'image', 0, 50, 0.14),

-- NEWPORTAI IMAGE (todos duration=0)
('newport-portrait', 'standard', 0, 2, 0.0056),
('newport-clothing-matting', 'standard', 0, 2, 0.0056),
('newport-human-matting', 'standard', 0, 2, 0.0056),
('newport-ai-model', 'standard', 0, 25, 0.07),
('newport-ai-tryon', 'standard', 0, 25, 0.07),
('newport-remove-bg', 'standard', 0, 2, 0.0056),
('newport-replace-bg', 'standard', 0, 2, 0.0056),
('newport-enhance', 'standard', 0, 2, 0.0056),
('newport-enhance', 'hd', 0, 2, 0.0056),
('newport-inpainting', 'standard', 0, 2, 0.0056),
('newport-outpainting', 'standard', 0, 2, 0.0056),
('newport-colorize', 'standard', 0, 2, 0.0056),
('newport-erase', 'standard', 0, 1, 0.0028),
('newport-doc-recognition', 'standard', 0, 0, 0.00),
('newport-remove-stripe', 'standard', 0, 2, 0.0056),
('newport-remove-shadow', 'standard', 0, 2, 0.0056),
('newport-swap-face', 'standard', 0, 3, 0.0084),
('newport-restore-face', 'standard', 0, 3, 0.0084),

-- NEWPORTAI VIDEO (vários com duração fixa)
('newport-pag-merge', '720p', 0, 2, 0.0056),
('newport-live-photo', '720p', 0, 6, 0.0168),
('newport-template-to-video', '720p', 4, 20, 0.056),
('newport-text-to-video-wan2', '720p', 4, 30, 0.084),
('newport-image-to-video-wan2', '720p', 4, 30, 0.084),

-- NEWPORTAI VIDEO (por duração)
-- Text to Video (4-8s)
('newport-text-to-video', '512p', 4, 20, 0.056),
('newport-text-to-video', '720p', 4, 40, 0.112),
('newport-text-to-video', '1080p', 4, 60, 0.168),
('newport-text-to-video', '512p', 6, 30, 0.084),
('newport-text-to-video', '720p', 6, 60, 0.168),
('newport-text-to-video', '1080p', 6, 90, 0.252),
('newport-text-to-video', '512p', 8, 40, 0.112),
('newport-text-to-video', '720p', 8, 80, 0.224),
('newport-text-to-video', '1080p', 8, 120, 0.336),

-- Image to Video (4-8s)
('newport-image-to-video', '512p', 4, 20, 0.056),
('newport-image-to-video', '720p', 4, 40, 0.112),
('newport-image-to-video', '1080p', 4, 60, 0.168),
('newport-image-to-video', '512p', 6, 30, 0.084),
('newport-image-to-video', '720p', 6, 60, 0.168),
('newport-image-to-video', '1080p', 6, 90, 0.252),
('newport-image-to-video', '512p', 8, 40, 0.112),
('newport-image-to-video', '720p', 8, 80, 0.224),
('newport-image-to-video', '1080p', 8, 120, 0.336),

-- Character to Video (4-8s)
('newport-character-to-video', '720p', 4, 60, 0.168),
('newport-character-to-video', '720p', 6, 90, 0.252),
('newport-character-to-video', '720p', 8, 120, 0.336),

-- NEWPORTAI PER SECOND (cobrado por segundo)
-- LipSync (1 créd/seg)
('newport-lipsync', '720p', 10, 10, 0.028),
('newport-lipsync', '720p', 30, 30, 0.084),
('newport-lipsync', '720p', 60, 60, 0.168),
('newport-lipsync', '720p', 120, 120, 0.336),
('newport-lipsync', '720p', 300, 300, 0.84),

-- Talking Image (2 créd/seg)
('newport-talking-image', '720p', 10, 20, 0.056),
('newport-talking-image', '720p', 30, 60, 0.168),
('newport-talking-image', '720p', 60, 120, 0.336),

-- Video Translate LipSync (3 créd/seg)
('newport-video-translate-lipsync', '720p', 10, 30, 0.084),
('newport-video-translate-lipsync', '720p', 30, 90, 0.252),
('newport-video-translate-lipsync', '720p', 60, 180, 0.504),
('newport-video-translate-lipsync', '720p', 120, 360, 1.008),
('newport-video-translate-lipsync', '720p', 300, 900, 2.52),

-- Video Translate Voice (2 créd/seg)
('newport-video-translate-voice', '720p', 10, 20, 0.056),
('newport-video-translate-voice', '720p', 30, 60, 0.168),
('newport-video-translate-voice', '720p', 60, 120, 0.336),
('newport-video-translate-voice', '720p', 120, 240, 0.672),
('newport-video-translate-voice', '720p', 300, 600, 1.68),

-- Swap Face Video (1 créd/seg)
('newport-swap-face-video', '720p', 10, 10, 0.028),
('newport-swap-face-video', '720p', 30, 30, 0.084),
('newport-swap-face-video', '720p', 60, 60, 0.168),
('newport-swap-face-video', '720p', 120, 120, 0.336),
('newport-swap-face-video', '720p', 300, 300, 0.84),

-- Image to Video Sonic (4 créd/seg)
('newport-image-to-video-sonic', '720p', 5, 20, 0.056),
('newport-image-to-video-sonic', '720p', 10, 40, 0.112),
('newport-image-to-video-sonic', '720p', 15, 60, 0.168),
('newport-image-to-video-sonic', '720p', 30, 120, 0.336),

-- Video Matting (1 créd/seg)
('newport-video-matting', '720p', 10, 10, 0.028),
('newport-video-matting', '720p', 30, 30, 0.084),
('newport-video-matting', '720p', 60, 60, 0.168),
('newport-video-matting', '720p', 120, 120, 0.336),
('newport-video-matting', '720p', 300, 300, 0.84),

-- Composite Video (1 créd/10 seg)
('newport-composite-video', '720p', 10, 1, 0.0028),
('newport-composite-video', '720p', 30, 3, 0.0084),
('newport-composite-video', '720p', 60, 6, 0.0168),
('newport-composite-video', '720p', 120, 12, 0.0336),
('newport-composite-video', '720p', 300, 30, 0.084),

-- NEWPORTAI TTS (por caracteres)
('newport-voice-clone', 'wav', 0, 0, 0.00),
('newport-tts-clone', 'mp3', 250, 1, 0.0028),
('newport-tts-clone', 'mp3', 1000, 4, 0.0112),
('newport-tts-clone', 'mp3', 5000, 20, 0.056),
('newport-tts-common', 'mp3', 250, 1, 0.0028),
('newport-tts-common', 'mp3', 1000, 4, 0.0112),
('newport-tts-common', 'mp3', 5000, 20, 0.056),
('newport-tts-pro', 'mp3', 200, 1, 0.0028),
('newport-tts-pro', 'mp3', 1000, 5, 0.014),
('newport-tts-pro', 'mp3', 5000, 25, 0.07),

-- NEWPORTAI STT (por minuto)
('newport-stt', 'text', 60, 1, 0.0028),
('newport-stt', 'text', 300, 5, 0.014),
('newport-stt-pro', 'text', 60, 2, 0.0056),
('newport-stt-pro', 'text', 300, 10, 0.028),

-- NEWPORTAI CREDITS
('newport-credits', 'json', 0, 0, 0.00);

-- ====================================
-- MEDIA_ASPECT_RATIOS - Proporções disponíveis
-- ====================================

INSERT INTO media_aspect_ratios (api_id, ratio, display_name) VALUES
-- LUMA LABS (padrão para vídeo)
('luma-ray2-flash', '16:9', '16:9 Landscape'),
('luma-ray2-flash', '9:16', '9:16 Portrait'),
('luma-ray2-flash', '1:1', '1:1 Square'),
('luma-ray2', '16:9', '16:9 Landscape'),
('luma-ray2', '9:16', '9:16 Portrait'),
('luma-ray2', '1:1', '1:1 Square'),
('luma-ray2', '4:3', '4:3 Classic'),
('luma-ray2', '21:9', '21:9 Cinematic'),
('luma-ray1.6', '16:9', '16:9 Landscape'),
('luma-ray1.6', '9:16', '9:16 Portrait'),
('luma-ray1.6', '1:1', '1:1 Square'),

-- KLING AI (padrão para vídeo)
('kling-1.0', '16:9', '16:9 Landscape'),
('kling-1.0', '9:16', '9:16 Portrait'),
('kling-1.0', '1:1', '1:1 Square'),
('kling-1.1', '16:9', '16:9 Landscape'),
('kling-1.1', '9:16', '9:16 Portrait'),
('kling-1.1', '1:1', '1:1 Square'),
('kling-1.2', '16:9', '16:9 Landscape'),
('kling-1.2', '9:16', '9:16 Portrait'),
('kling-1.2', '1:1', '1:1 Square'),
('kling-1.5', '16:9', '16:9 Landscape'),
('kling-1.5', '9:16', '9:16 Portrait'),
('kling-1.5', '1:1', '1:1 Square'),
('kling-1.6', '16:9', '16:9 Landscape'),
('kling-1.6', '9:16', '9:16 Portrait'),
('kling-1.6', '1:1', '1:1 Square'),
('kling-2.0', '16:9', '16:9 Landscape'),
('kling-2.0', '9:16', '9:16 Portrait'),
('kling-2.0', '1:1', '1:1 Square'),
('kling-2.0', '4:3', '4:3 Classic'),
('kling-2.0', '21:9', '21:9 Cinematic'),
('kling-2.1', '16:9', '16:9 Landscape'),
('kling-2.1', '9:16', '9:16 Portrait'),
('kling-2.1', '1:1', '1:1 Square'),
('kling-2.1', '4:3', '4:3 Classic'),
('kling-2.1', '21:9', '21:9 Cinematic'),
('kling-2.1-master', '16:9', '16:9 Landscape'),
('kling-2.1-master', '9:16', '9:16 Portrait'),
('kling-2.1-master', '1:1', '1:1 Square'),
('kling-2.1-master', '4:3', '4:3 Classic'),
('kling-2.1-master', '21:9', '21:9 Cinematic'),
('kling-2.1-master', '32:9', '32:9 Ultra Wide'),
('kling-professional', '16:9', '16:9 Landscape'),
('kling-professional', '9:16', '9:16 Portrait'),
('kling-professional', '21:9', '21:9 Cinematic'),
('kling-professional', '2.39:1', '2.39:1 Cinema'),

-- BFL FLUX (imagem - proporções customizáveis)
('bfl-flux-schnell', '1:1', '1:1 Square'),
('bfl-flux-schnell', '16:9', '16:9 Landscape'),
('bfl-flux-schnell', '9:16', '9:16 Portrait'),
('bfl-flux-schnell', '4:3', '4:3 Classic'),
('bfl-flux-schnell', '3:4', '3:4 Portrait'),
('bfl-flux-schnell', 'custom', 'Custom Ratio'),
('bfl-flux-dev', '1:1', '1:1 Square'),
('bfl-flux-dev', '16:9', '16:9 Landscape'),
('bfl-flux-dev', '9:16', '9:16 Portrait'),
('bfl-flux-dev', '4:3', '4:3 Classic'),
('bfl-flux-dev', '3:4', '3:4 Portrait'),
('bfl-flux-dev', 'custom', 'Custom Ratio'),
('bfl-flux-1.1-pro', '1:1', '1:1 Square'),
('bfl-flux-1.1-pro', '16:9', '16:9 Landscape'),
('bfl-flux-1.1-pro', '9:16', '9:16 Portrait'),
('bfl-flux-1.1-pro', '4:3', '4:3 Classic'),
('bfl-flux-1.1-pro', '3:4', '3:4 Portrait'),
('bfl-flux-1.1-pro', 'custom', 'Custom Ratio'),
('bfl-flux-1.0-pro', '1:1', '1:1 Square'),
('bfl-flux-1.0-pro', '16:9', '16:9 Landscape'),
('bfl-flux-1.0-pro', '9:16', '9:16 Portrait'),
('bfl-flux-1.0-pro', '4:3', '4:3 Classic'),
('bfl-flux-1.0-pro', '3:4', '3:4 Portrait'),
('bfl-flux-1.0-pro', 'custom', 'Custom Ratio'),
('bfl-flux-ultra', '1:1', '1:1 Square'),
('bfl-flux-ultra', '16:9', '16:9 Landscape'),
('bfl-flux-ultra', '9:16', '9:16 Portrait'),
('bfl-flux-ultra', '21:9', '21:9 Cinematic'),
('bfl-flux-ultra', 'custom', 'Custom Ratio'),
('bfl-flux-raw', '1:1', '1:1 Square'),
('bfl-flux-raw', '16:9', '16:9 Landscape'),
('bfl-flux-raw', '9:16', '9:16 Portrait'),
('bfl-flux-raw', 'custom', 'Custom Ratio'),
('bfl-flux-fill', 'original', 'Keep Original'),
('bfl-flux-fill', 'custom', 'Custom Ratio'),
('bfl-flux-depth', 'original', 'Keep Original'),
('bfl-flux-depth', 'custom', 'Custom Ratio'),
('bfl-flux-canny', 'original', 'Keep Original'),
('bfl-flux-canny', 'custom', 'Custom Ratio'),
('bfl-flux-redux', 'original', 'Keep Original'),
('bfl-flux-redux', 'custom', 'Custom Ratio'),

-- PIAPI VIDEO
('piapi-hailuo', '16:9', '16:9 Landscape'),
('piapi-hailuo', '9:16', '9:16 Portrait'),
('piapi-hailuo', '1:1', '1:1 Square'),
('piapi-hunyuan', '16:9', '16:9 Landscape'),
('piapi-hunyuan', '9:16', '9:16 Portrait'),
('piapi-hunyuan', '1:1', '1:1 Square'),
('piapi-omnihuman', '9:16', '9:16 Portrait'),
('piapi-omnihuman', '1:1', '1:1 Square'),
('piapi-skyreels', '16:9', '16:9 Landscape'),
('piapi-skyreels', '9:16', '9:16 Portrait'),
('piapi-skyreels', '1:1', '1:1 Square'),
('piapi-skyreels', '21:9', '21:9 Cinematic'),
('piapi-wan21', '16:9', '16:9 Landscape'),
('piapi-wan21', '9:16', '9:16 Portrait'),
('piapi-wan21', '1:1', '1:1 Square'),

-- PIAPI IMAGEM
('piapi-midjourney', '1:1', '1:1 Square'),
('piapi-midjourney', '16:9', '16:9 Landscape'),
('piapi-midjourney', '9:16', '9:16 Portrait'),
('piapi-midjourney', '4:3', '4:3 Classic'),
('piapi-midjourney', '3:2', '3:2 Photo'),
('piapi-gpt-image', '1:1', '1:1 Square'),
('piapi-gpt-image', '16:9', '16:9 Landscape'),
('piapi-gpt-image', '9:16', '9:16 Portrait'),

-- NEWPORTAI (maioria usa proporções padrão)
-- Video
('newport-text-to-video', '16:9', '16:9 Landscape'),
('newport-text-to-video', '9:16', '9:16 Portrait'),
('newport-text-to-video', '1:1', '1:1 Square'),
('newport-image-to-video', '16:9', '16:9 Landscape'),
('newport-image-to-video', '9:16', '9:16 Portrait'),
('newport-image-to-video', '1:1', '1:1 Square'),
('newport-character-to-video', '16:9', '16:9 Landscape'),
('newport-character-to-video', '9:16', '9:16 Portrait'),
('newport-template-to-video', '16:9', '16:9 Landscape'),
('newport-lipsync', 'original', 'Keep Original'),
('newport-talking-image', 'original', 'Keep Original'),
('newport-video-translate-lipsync', 'original', 'Keep Original'),
('newport-video-translate-voice', 'original', 'Keep Original'),
('newport-swap-face-video', 'original', 'Keep Original'),
('newport-image-to-video-sonic', '16:9', '16:9 Landscape'),
('newport-image-to-video-sonic', '9:16', '9:16 Portrait'),
('newport-text-to-video-wan2', '16:9', '16:9 Landscape'),
('newport-text-to-video-wan2', '9:16', '9:16 Portrait'),
('newport-image-to-video-wan2', '16:9', '16:9 Landscape'),
('newport-image-to-video-wan2', '9:16', '9:16 Portrait'),
('newport-pag-merge', 'original', 'Keep Original'),
('newport-live-photo', 'original', 'Keep Original'),
('newport-video-matting', 'original', 'Keep Original'),
('newport-composite-video', 'original', 'Keep Original'),

-- Image
('newport-portrait', '3:4', '3:4 Portrait'),
('newport-portrait', '1:1', '1:1 Square'),
('newport-clothing-matting', 'original', 'Keep Original'),
('newport-human-matting', 'original', 'Keep Original'),
('newport-ai-model', '9:16', '9:16 Portrait'),
('newport-ai-model', '3:4', '3:4 Portrait'),
('newport-ai-tryon', 'original', 'Keep Original'),
('newport-remove-bg', 'original', 'Keep Original'),
('newport-replace-bg', 'original', 'Keep Original'),
('newport-enhance', 'original', 'Keep Original'),
('newport-inpainting', 'original', 'Keep Original'),
('newport-outpainting', 'custom', 'Custom Extension'),
('newport-colorize', 'original', 'Keep Original'),
('newport-erase', 'original', 'Keep Original'),
('newport-doc-recognition', 'original', 'Keep Original'),
('newport-remove-stripe', 'original', 'Keep Original'),
('newport-remove-shadow', 'original', 'Keep Original'),
('newport-swap-face', 'original', 'Keep Original'),
('newport-restore-face', 'original', 'Keep Original'),

-- PIAPI ESPECIAL
('piapi-faceswap', 'original', 'Keep Original');

-- ====================================
-- ÍNDICES PARA PERFORMANCE
-- ====================================

CREATE INDEX IF NOT EXISTS idx_media_formats_api ON media_formats(api_id);
CREATE INDEX IF NOT EXISTS idx_media_pricing_lookup ON media_pricing(api_id, format_value, duration);
CREATE INDEX IF NOT EXISTS idx_media_aspect_ratios_api ON media_aspect_ratios(api_id);

-- ====================================
-- VERIFICAÇÃO FINAL
-- ====================================

-- Ver totais inseridos
SELECT 
    'media_apis' as table_name,
    COUNT(*) as total_records
FROM media_apis
WHERE is_active = true

UNION ALL

SELECT 
    'media_formats' as table_name,
    COUNT(*) as total_records
FROM media_formats

UNION ALL

SELECT 
    'media_pricing' as table_name,
    COUNT(*) as total_records
FROM media_pricing

UNION ALL

SELECT 
    'media_aspect_ratios' as table_name,
    COUNT(*) as total_records
FROM media_aspect_ratios;

-- Verificar alguns exemplos de preços
SELECT 
    ma.name,
    ma.provider,
    mp.format_value,
    mp.duration,
    mp.credits,
    mp.api_cost,
    ROUND(mp.credits * 0.0028125, 4) as revenue_per_use,
    ROUND((mp.credits * 0.0028125 - mp.api_cost) / mp.api_cost * 100, 2) as margin_percent
FROM media_apis ma
JOIN media_pricing mp ON ma.id = mp.api_id
WHERE mp.credits > 1000
ORDER BY mp.credits DESC
LIMIT 10;