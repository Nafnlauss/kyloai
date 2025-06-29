-- SQL ATUALIZADO - TODOS OS MODELOS DA PIAPI
-- Adicionar aos modelos já existentes

-- ====================================
-- PIAPI - TODOS OS 18 MODELOS
-- ====================================

-- Limpar modelos antigos da PiAPI para adicionar todos
DELETE FROM media_pricing WHERE api_id LIKE 'piapi-%';
DELETE FROM media_formats WHERE api_id LIKE 'piapi-%';
DELETE FROM media_apis WHERE provider = 'piapi';
DELETE FROM media_aspect_ratios WHERE api_id LIKE 'piapi-%';

-- VÍDEO - 7 APIs
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
-- Kling e Luma já temos direto, mas vamos adicionar via PiAPI também
('piapi-kling', 'Kling via PiAPI', 'piapi', 'kling-all', 'All Kling models access', 'Video', 5, 120, true, 
 ARRAY['All Kling models', 'Unified API', 'Queue management', 'Multiple versions'], 
 ARRAY['Third-party API', 'Possible delays']),

('piapi-luma', 'Luma via PiAPI', 'piapi', 'luma-all', 'All Luma models access', 'Video', 5, 10, true, 
 ARRAY['All Luma models', 'Unified API', 'Queue management'], 
 ARRAY['Third-party API', 'Possible delays']),

-- Novos modelos de vídeo
('piapi-hailuo', 'Hailuo Video', 'piapi', 'hailuo-v1', 'Hailuo video generation', 'Video', 5, 30, true, 
 ARRAY['High quality', 'Fast generation', 'Good motion', 'Text to video'], 
 ARRAY['Limited availability', 'Queue times']),

('piapi-hunyuan', 'Hunyuan Video', 'piapi', 'hunyuan-video', 'Tencent Hunyuan model', 'Video', 5, 20, true, 
 ARRAY['Chinese optimized', 'Good quality', 'Fast processing', 'Multi-language'], 
 ARRAY['Limited docs', 'Regional focus']),

('piapi-omnihuman', 'OmniHuman', 'piapi', 'omnihuman-v1', 'Human-focused video generation', 'Users', 5, 30, true, 
 ARRAY['Human motion', 'Realistic avatars', 'Pose control', 'Face animation'], 
 ARRAY['Human-only focus', 'Complex setup']),

('piapi-skyreels', 'Skyreels', 'piapi', 'skyreels-v1', 'Professional video generation', 'Film', 5, 60, true, 
 ARRAY['Cinema quality', 'Advanced effects', 'Scene composition', 'Professional tools'], 
 ARRAY['Higher cost', 'Longer processing']),

('piapi-wan21', 'Wan 2.1', 'piapi', 'wan-2.1', 'Wan video model v2.1', 'Video', 5, 15, true, 
 ARRAY['Good quality', 'Fast generation', 'Stable output', 'Cost effective'], 
 ARRAY['Limited features', 'Basic controls']);

-- IMAGEM - 3 APIs
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-midjourney', 'Midjourney via PiAPI', 'piapi', 'midjourney-v6', 'Unofficial Midjourney API', 'Image', 0, 0, true, 
 ARRAY['Latest Midjourney', 'High quality', 'Artistic style', 'Multiple variations'], 
 ARRAY['Unofficial API', 'Queue delays', 'Premium pricing']),

('piapi-flux', 'FLUX via PiAPI', 'piapi', 'flux-all', 'All FLUX models access', 'Image', 0, 0, true, 
 ARRAY['All FLUX models', 'Unified access', 'Multiple versions'], 
 ARRAY['Third-party API', 'We have BFL direct']),

('piapi-gpt-image', 'GPT-Image-1', 'piapi', 'gpt-image-1', 'GPT-based image generation', 'Brain', 0, 0, true, 
 ARRAY['GPT integration', 'Smart generation', 'Context aware', 'Text understanding'], 
 ARRAY['Experimental', 'Variable quality']);

-- ÁUDIO - 7 APIs
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-suno', 'Suno via PiAPI', 'piapi', 'suno-v3', 'AI music generation', 'Music', 0, 300, true, 
 ARRAY['Music generation', 'Lyrics support', 'Multiple genres', 'Custom styles'], 
 ARRAY['Limited duration', 'Queue times']),

('piapi-diffrhythm', 'Diffrhythm', 'piapi', 'diffrhythm-v1', 'Rhythm generation AI', 'Drum', 0, 180, true, 
 ARRAY['Rhythm patterns', 'Beat generation', 'Multiple genres', 'Loop support'], 
 ARRAY['Rhythm only', 'No melody']),

('piapi-udio', 'Udio', 'piapi', 'udio-v1', 'Advanced music generation', 'Music2', 0, 240, true, 
 ARRAY['Full songs', 'Vocals support', 'Multiple instruments', 'High quality'], 
 ARRAY['Processing time', 'Credit intensive']),

('piapi-moshi', 'Moshi', 'piapi', 'moshi-v1', 'Voice and audio AI', 'Mic', 0, 0, true, 
 ARRAY['Voice synthesis', 'Audio effects', 'Real-time processing', 'Low latency'], 
 ARRAY['Limited voices', 'Basic features']),

('piapi-f5-tts', 'F5 TTS', 'piapi', 'f5-tts-v1', 'Fast text-to-speech', 'Speaker', 0, 0, true, 
 ARRAY['Fast generation', 'Multiple voices', 'Good quality', 'Low latency'], 
 ARRAY['Limited languages', 'Basic controls']),

('piapi-mmaudio', 'MMAudio', 'piapi', 'mmaudio-v1', 'Multimodal audio generation', 'Waveform', 0, 120, true, 
 ARRAY['Video to audio', 'Scene understanding', 'Automatic SFX', 'Context aware'], 
 ARRAY['Experimental', 'Processing intensive']),

('piapi-acestep', 'ACE Step AI', 'piapi', 'acestep-v1', 'Step-based audio generation', 'Steps', 0, 300, true, 
 ARRAY['Step sequencer', 'Pattern based', 'Loop generation', 'MIDI support'], 
 ARRAY['Complex interface', 'Learning curve']);

-- ESPECIAL
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-faceswap', 'FaceSwap via PiAPI', 'piapi', 'faceswap-v1', 'AI face swapping', 'Users', 0, 0, true, 
 ARRAY['Face swapping', 'High accuracy', 'Video support', 'Multiple faces'], 
 ARRAY['Privacy concerns', 'Processing time']);

-- ====================================
-- FORMATOS PARA NOVOS MODELOS PIAPI
-- ====================================

-- Formatos para APIs de vídeo PiAPI
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '720p', '720p HD', 1280, 720, '16:9', true 
FROM media_apis WHERE provider = 'piapi' AND model IN ('hailuo-v1', 'hunyuan-video', 'omnihuman-v1', 'skyreels-v1', 'wan-2.1');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '1080p', '1080p Full HD', 1920, 1080, '16:9', true 
FROM media_apis WHERE provider = 'piapi' AND model IN ('hailuo-v1', 'hunyuan-video', 'omnihuman-v1', 'skyreels-v1');

-- Skyreels suporta 4K
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('piapi-skyreels', '4k', '4K Ultra HD', 3840, 2160, '16:9', true);

-- Formatos para imagens PiAPI
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
-- GPT-Image
('piapi-gpt-image', 'standard', 'Standard Quality', 1024, 1024, '1:1', true),
('piapi-gpt-image', 'hd', 'HD Quality', 1920, 1080, '16:9', true);

-- Formatos para áudio
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'mp3', 'MP3 Audio', 0, 0, 'audio', true 
FROM media_apis WHERE provider = 'piapi' AND model IN ('suno-v3', 'diffrhythm-v1', 'udio-v1', 'moshi-v1', 'f5-tts-v1', 'mmaudio-v1', 'acestep-v1');

-- WAV para alguns
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'wav', 'WAV Audio', 0, 0, 'audio', true 
FROM media_apis WHERE provider = 'piapi' AND model IN ('suno-v3', 'udio-v1', 'mmaudio-v1');

-- ====================================
-- PREÇOS PARA NOVOS MODELOS PIAPI
-- ====================================

-- Vídeo
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- Hailuo
('piapi-hailuo', '720p', 5, 60, 0.17),
('piapi-hailuo', '720p', 10, 120, 0.34),
('piapi-hailuo', '720p', 30, 360, 1.01),
('piapi-hailuo', '1080p', 5, 80, 0.22),
('piapi-hailuo', '1080p', 10, 160, 0.45),
('piapi-hailuo', '1080p', 30, 480, 1.35),

-- Hunyuan
('piapi-hunyuan', '720p', 5, 55, 0.15),
('piapi-hunyuan', '720p', 10, 110, 0.31),
('piapi-hunyuan', '720p', 20, 220, 0.62),
('piapi-hunyuan', '1080p', 5, 70, 0.20),
('piapi-hunyuan', '1080p', 10, 140, 0.39),
('piapi-hunyuan', '1080p', 20, 280, 0.79),

-- OmniHuman
('piapi-omnihuman', '720p', 5, 90, 0.25),
('piapi-omnihuman', '720p', 10, 180, 0.51),
('piapi-omnihuman', '720p', 30, 540, 1.52),
('piapi-omnihuman', '1080p', 5, 120, 0.34),
('piapi-omnihuman', '1080p', 10, 240, 0.67),
('piapi-omnihuman', '1080p', 30, 720, 2.02),

-- Skyreels
('piapi-skyreels', '720p', 5, 100, 0.28),
('piapi-skyreels', '720p', 30, 600, 1.69),
('piapi-skyreels', '720p', 60, 1200, 3.37),
('piapi-skyreels', '1080p', 5, 130, 0.37),
('piapi-skyreels', '1080p', 30, 780, 2.19),
('piapi-skyreels', '1080p', 60, 1560, 4.39),
('piapi-skyreels', '4k', 5, 200, 0.56),
('piapi-skyreels', '4k', 30, 1200, 3.37),
('piapi-skyreels', '4k', 60, 2400, 6.75),

-- Wan 2.1
('piapi-wan21', '720p', 5, 45, 0.13),
('piapi-wan21', '720p', 10, 90, 0.25),
('piapi-wan21', '720p', 15, 135, 0.38),

-- Imagem
('piapi-gpt-image', 'standard', 0, 30, 0.08),
('piapi-gpt-image', 'hd', 0, 45, 0.13),

-- Áudio (por duração ou caracteres)
-- Diffrhythm (por 30s)
('piapi-diffrhythm', 'mp3', 30, 80, 0.22),
('piapi-diffrhythm', 'mp3', 60, 160, 0.45),
('piapi-diffrhythm', 'mp3', 180, 480, 1.35),

-- Udio (por música)
('piapi-udio', 'mp3', 30, 150, 0.42),
('piapi-udio', 'mp3', 60, 300, 0.84),
('piapi-udio', 'mp3', 120, 600, 1.69),
('piapi-udio', 'mp3', 240, 1200, 3.37),
('piapi-udio', 'wav', 30, 150, 0.42),
('piapi-udio', 'wav', 60, 300, 0.84),

-- Moshi (por 1000 chars)
('piapi-moshi', 'mp3', 1000, 40, 0.11),

-- F5 TTS (por 1000 chars)
('piapi-f5-tts', 'mp3', 1000, 35, 0.10),

-- MMAudio (por vídeo de entrada)
('piapi-mmaudio', 'mp3', 30, 120, 0.34),
('piapi-mmaudio', 'mp3', 60, 240, 0.67),
('piapi-mmaudio', 'mp3', 120, 480, 1.35),
('piapi-mmaudio', 'wav', 30, 120, 0.34),

-- ACE Step (por projeto)
('piapi-acestep', 'mp3', 60, 200, 0.56),
('piapi-acestep', 'mp3', 180, 600, 1.69),
('piapi-acestep', 'mp3', 300, 1000, 2.81);

-- ====================================
-- ASPECT RATIOS PARA NOVOS MODELOS
-- ====================================

-- Vídeo PiAPI
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '16:9', 'Widescreen', true 
FROM media_apis WHERE provider = 'piapi' AND model IN ('hailuo-v1', 'hunyuan-video', 'omnihuman-v1', 'skyreels-v1', 'wan-2.1');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '1:1', 'Square', false 
FROM media_apis WHERE provider = 'piapi' AND model IN ('hailuo-v1', 'hunyuan-video', 'omnihuman-v1', 'skyreels-v1', 'wan-2.1');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '9:16', 'Portrait', false 
FROM media_apis WHERE provider = 'piapi' AND model IN ('hailuo-v1', 'hunyuan-video', 'omnihuman-v1', 'skyreels-v1');

-- Skyreels suporta mais formatos
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) VALUES
('piapi-skyreels', '21:9', 'Cinematic', false),
('piapi-skyreels', '4:3', 'Standard', false);

-- Imagem
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) VALUES
('piapi-gpt-image', '1:1', 'Square', true),
('piapi-gpt-image', '16:9', 'Landscape', false),
('piapi-gpt-image', '9:16', 'Portrait', false);

-- Estatísticas finais atualizadas
SELECT 
    'Total de modelos PiAPI:' as info,
    COUNT(*) as total
FROM media_apis
WHERE provider = 'piapi' AND is_active = true

UNION ALL

SELECT 
    'Por tipo:' as info,
    COUNT(*) as total
FROM media_apis
WHERE provider = 'piapi' AND is_active = true
GROUP BY 
    CASE 
        WHEN model LIKE '%video%' OR model IN ('kling-all', 'luma-all', 'hailuo-v1', 'hunyuan-video', 'omnihuman-v1', 'skyreels-v1', 'wan-2.1') THEN 'Vídeo'
        WHEN model LIKE '%image%' OR model IN ('midjourney-v6', 'flux-all', 'gpt-image-1') THEN 'Imagem'
        WHEN model IN ('suno-v3', 'diffrhythm-v1', 'udio-v1', 'moshi-v1', 'f5-tts-v1', 'mmaudio-v1', 'acestep-v1') THEN 'Áudio'
        ELSE 'Especial'
    END;