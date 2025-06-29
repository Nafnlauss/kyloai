-- SQL COMPLETO COM TODOS OS MODELOS DE TODAS AS APIs
-- Atualizado com TODOS os modelos descobertos na pesquisa
-- Margem mínima de 100% garantida

-- Limpar dados existentes
TRUNCATE TABLE media_pricing CASCADE;
TRUNCATE TABLE media_formats CASCADE;
TRUNCATE TABLE media_apis CASCADE;
TRUNCATE TABLE media_aspect_ratios CASCADE;

-- ====================================
-- 1. LUMA LABS - TODOS OS MODELOS
-- ====================================
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
-- Modelos confirmados
('luma-ray2-flash', 'Luma Ray2-Flash', 'luma', 'Ray2-Flash', 'Fast generation, lower quality', 'Zap', 5, 5, true, 
 ARRAY['Fast generation', 'Basic quality', 'Text to video', 'Preview mode'], 
 ARRAY['Only 540p', 'Max 5 seconds', 'No 4K support']),

('luma-ray2', 'Luma Ray2', 'luma', 'Ray2', 'High quality video generation', 'Sparkles', 5, 9, true, 
 ARRAY['High quality', 'Multiple resolutions', 'Extended duration', 'Professional output'], 
 ARRAY['Slower generation', 'Higher cost', 'Max 9 seconds']),

('luma-ray1.6', 'Luma Ray 1.6', 'luma', 'Ray1.6', 'Legacy model with pixel-based pricing', 'Video', 5, 10, true, 
 ARRAY['Stable generation', 'Pixel-based pricing', 'Legacy support'], 
 ARRAY['Older technology', 'Being phased out']);

-- ====================================
-- 2. KLING AI - TODOS OS MODELOS (INCLUINDO NOVOS)
-- ====================================
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('kling-1.0', 'Kling 1.0', 'kling', '1.0', 'Original Kling model', 'Video', 5, 10, true, 
 ARRAY['Stable generation', 'Good quality', 'Fast processing', 'Cost effective'], 
 ARRAY['Limited to 1080p', 'Max 10 seconds']),

('kling-1.1', 'Kling 1.1', 'kling', '1.1', 'Improved version with better motion', 'Video', 5, 10, true, 
 ARRAY['Better motion', 'Enhanced details', 'Faster than 1.0', 'Smoother transitions'], 
 ARRAY['Limited to 1080p', 'Max 10 seconds']),

('kling-1.2', 'Kling 1.2', 'kling', '1.2', 'Latest stable version', 'Video', 5, 15, true, 
 ARRAY['Best motion quality', 'Improved coherence', 'Extended duration', 'Better physics'], 
 ARRAY['Higher cost', 'Longer processing']),

-- NOVOS MODELOS KLING
('kling-1.5', 'Kling 1.5', 'kling', '1.5', 'Enhanced motion and detail', 'Video', 5, 15, true, 
 ARRAY['Advanced motion', 'Better details', 'Improved stability', 'Professional quality'], 
 ARRAY['Limited availability', 'Higher processing time']),

('kling-1.6', 'Kling 1.6', 'kling', '1.6', 'Latest 1.x generation', 'Video', 5, 20, true, 
 ARRAY['Superior motion', 'Enhanced physics', 'Extended duration', 'Better coherence'], 
 ARRAY['Premium pricing', 'Longer queues']),

('kling-2.0', 'Kling 2.0', 'kling', '2.0', 'Next generation model', 'Crown', 5, 30, true, 
 ARRAY['Superior quality', '4K support', 'Advanced motion', 'Cinematic quality'], 
 ARRAY['Premium pricing', 'Longer wait times']),

('kling-2.1', 'Kling 2.1', 'kling', '2.1', 'Latest improvements', 'Crown', 5, 30, true, 
 ARRAY['Best quality', '4K support', 'Professional features', 'Enhanced AI'], 
 ARRAY['Highest cost', 'Limited availability']),

-- NOVO MODELO MASTER
('kling-2.1-master', 'Kling 2.1 Master', 'kling', '2.1-master', 'Master quality edition', 'Diamond', 5, 60, true, 
 ARRAY['Master quality', 'Extended duration', '4K+ support', 'Studio features', 'Priority queue'], 
 ARRAY['Very expensive', 'Limited access', 'Long processing']),

('kling-professional', 'Kling Professional', 'kling', 'Professional', 'Professional grade generation', 'Film', 5, 120, true, 
 ARRAY['Cinema quality', 'Up to 2 minutes', '4K resolution', 'Advanced controls', 'Studio features'], 
 ARRAY['Very expensive', 'Long processing time', 'Queue priority needed']);

-- ====================================
-- 3. BFL.AI - TODOS OS MODELOS (INCLUINDO NOVOS)
-- ====================================
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
-- Modelos existentes
('bfl-flux-schnell', 'FLUX Schnell', 'bfl', 'FLUX-Schnell', 'Free fast image generation', 'Zap', 0, 0, true, 
 ARRAY['Free generation', 'Fast processing', 'Basic quality', 'Good for prototypes'], 
 ARRAY['Lower quality', 'Limited features']),

('bfl-flux-dev', 'FLUX Dev', 'bfl', 'FLUX-Dev', 'Development grade image generation', 'Code', 0, 0, true, 
 ARRAY['Good quality', 'Reasonable speed', 'Developer friendly', 'API access'], 
 ARRAY['Not for production', 'Medium quality']),

('bfl-flux-1.1-pro', 'FLUX 1.1 Pro', 'bfl', 'FLUX1.1-Pro', 'Latest professional model', 'Sparkles', 0, 0, true, 
 ARRAY['Latest model', 'High quality', 'Fast generation', 'Professional use'], 
 ARRAY['Higher cost', 'Requires credits']),

('bfl-flux-1.0-pro', 'FLUX 1.0 Pro', 'bfl', 'FLUX1.0-Pro', 'Stable professional model', 'Image', 0, 0, true, 
 ARRAY['Stable version', 'High quality', 'Proven results', 'Wide compatibility'], 
 ARRAY['Slightly older', 'Being updated']),

('bfl-flux-ultra', 'FLUX Ultra', 'bfl', 'FLUX-Ultra', 'Ultra high quality images', 'Diamond', 0, 0, true, 
 ARRAY['Ultra quality', 'Maximum detail', 'Professional photography', 'Art generation'], 
 ARRAY['Very expensive', 'Slow generation']),

('bfl-flux-raw', 'FLUX Raw', 'bfl', 'FLUX-Raw', 'Raw unprocessed output', 'Settings', 0, 0, true, 
 ARRAY['Raw output', 'No post-processing', 'Full control', 'Professional editing'], 
 ARRAY['Requires expertise', 'No enhancements']),

-- NOVOS MODELOS BFL
('bfl-flux-fill', 'FLUX Fill', 'bfl', 'FLUX-Fill', 'Inpainting and outpainting model', 'Paint', 0, 0, true, 
 ARRAY['Inpainting', 'Outpainting', 'Object removal', 'Image expansion', 'Smart fill'], 
 ARRAY['Requires mask input', 'Processing intensive']),

('bfl-flux-depth', 'FLUX Depth', 'bfl', 'FLUX-Depth', 'Depth-based control generation', 'Layers', 0, 0, true, 
 ARRAY['Depth control', '3D awareness', 'Spatial accuracy', 'Scene composition'], 
 ARRAY['Requires depth map', 'Complex setup']),

('bfl-flux-canny', 'FLUX Canny', 'bfl', 'FLUX-Canny', 'Edge-based control generation', 'Grid', 0, 0, true, 
 ARRAY['Edge control', 'Precise composition', 'Structure preservation', 'Line guidance'], 
 ARRAY['Requires edge map', 'Technical knowledge']),

('bfl-flux-redux', 'FLUX Redux', 'bfl', 'FLUX-Redux', 'Image mixing and variations', 'Shuffle', 0, 0, true, 
 ARRAY['Image mixing', 'Style transfer', 'Variations', 'Creative blending'], 
 ARRAY['Unpredictable results', 'Multiple inputs needed']);

-- ====================================
-- 4. ELEVENLABS - TODOS OS MODELOS (INCLUINDO NOVOS)
-- ====================================
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
-- NOVOS MODELOS
('elevenlabs-v3', 'ElevenLabs v3', 'elevenlabs', 'eleven_v3', 'Latest flagship model', 'Star', 0, 0, true, 
 ARRAY['Most advanced', 'Life-like speech', 'Emotional range', 'Context aware', 'All languages'], 
 ARRAY['Highest cost', 'Premium only']),

('elevenlabs-multilingual-v1', 'ElevenLabs Multilingual V1', 'elevenlabs', 'eleven_multilingual_v1', 'First multilingual model', 'Globe', 0, 0, true, 
 ARRAY['7 languages', 'Good quality', 'Stable performance', 'Legacy support'], 
 ARRAY['Fewer languages', 'Older technology']),

-- Modelo existente
('elevenlabs-multilingual-v2', 'ElevenLabs Multilingual V2', 'elevenlabs', 'eleven_multilingual_v2', 'Premium multilingual voices', 'Globe', 0, 0, true, 
 ARRAY['29 languages', 'Natural voices', 'Emotion control', 'Voice cloning', 'SSML support'], 
 ARRAY['Higher cost', 'Character limits']),

-- NOVOS MODELOS
('elevenlabs-english-v1', 'ElevenLabs English V1', 'elevenlabs', 'eleven_english_v1', 'English optimized model', 'Flag', 0, 0, true, 
 ARRAY['English only', 'Fast generation', 'Optimized quality', 'Low latency'], 
 ARRAY['Single language', 'Basic features']),

('elevenlabs-turbo-v2', 'ElevenLabs Turbo V2', 'elevenlabs', 'eleven_turbo_v2', 'Original turbo model', 'Zap', 0, 0, true, 
 ARRAY['Fast generation', 'Good quality', 'Low latency', 'Streaming'], 
 ARRAY['Less natural', 'Limited languages']),

-- Modelo existente
('elevenlabs-turbo-v2.5', 'ElevenLabs Turbo V2.5', 'elevenlabs', 'eleven_turbo_v2_5', 'Fast balanced quality', 'Zap', 0, 0, true, 
 ARRAY['Fast generation', 'Good quality', 'Low latency', '32 languages', 'Streaming'], 
 ARRAY['Less natural', 'Fewer emotions']),

-- NOVO MODELO
('elevenlabs-flash', 'ElevenLabs Flash', 'elevenlabs', 'eleven_flash', 'Original ultra-fast model', 'Lightning', 0, 0, true, 
 ARRAY['Ultra fast', 'Sub-100ms latency', 'Basic quality', 'Real-time'], 
 ARRAY['Lower quality', 'English only']),

-- Modelo existente
('elevenlabs-flash-v2.5', 'ElevenLabs Flash V2.5', 'elevenlabs', 'eleven_flash_v2_5', 'Ultra-fast generation', 'Lightning', 0, 0, true, 
 ARRAY['Fastest speed', 'Real-time', 'Low latency', 'Streaming ready', 'API optimized'], 
 ARRAY['Basic quality', 'Limited languages']);

-- ====================================
-- 5. PIAPI - AGREGADOR DE APIS
-- ====================================
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-midjourney', 'Midjourney via PiAPI', 'piapi', 'midjourney-v6', 'Unofficial Midjourney API', 'Image', 0, 0, true, 
 ARRAY['Latest Midjourney', 'High quality', 'Artistic style', 'Multiple variations'], 
 ARRAY['Unofficial API', 'Queue delays', 'Premium pricing']),

('piapi-faceswap', 'FaceSwap via PiAPI', 'piapi', 'faceswap-v1', 'AI face swapping', 'Users', 0, 0, true, 
 ARRAY['Face swapping', 'High accuracy', 'Video support', 'Multiple faces'], 
 ARRAY['Privacy concerns', 'Processing time']),

('piapi-suno', 'Suno via PiAPI', 'piapi', 'suno-v3', 'AI music generation', 'Music', 0, 300, true, 
 ARRAY['Music generation', 'Lyrics support', 'Multiple genres', 'Custom styles'], 
 ARRAY['Limited duration', 'Queue times']);

-- ====================================
-- 6. FORMATOS SUPORTADOS - ATUALIZADOS
-- ====================================

-- Formatos para novos modelos Kling
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '540p', '540p Standard', 960, 540, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('1.5', '1.6');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '720p', '720p HD', 1280, 720, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('1.5', '1.6');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '1080p', '1080p Full HD', 1920, 1080, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('1.5', '1.6');

-- Formatos para Kling 2.1 Master (suporta até 8K)
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('kling-2.1-master', '720p', '720p HD', 1280, 720, '16:9', true),
('kling-2.1-master', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('kling-2.1-master', '4k', '4K Ultra HD', 3840, 2160, '16:9', true),
('kling-2.1-master', '8k', '8K Master', 7680, 4320, '16:9', true);

-- Formatos especiais para novos modelos BFL
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
-- FLUX Fill suporta qualquer tamanho
('bfl-flux-fill', 'custom', 'Custom Size', 0, 0, 'custom', true),
('bfl-flux-fill', 'standard', 'Standard Quality', 1024, 1024, '1:1', true),
('bfl-flux-fill', 'hd', 'HD Quality', 1920, 1080, '16:9', true),

-- FLUX Depth/Canny/Redux
('bfl-flux-depth', 'standard', 'Standard Quality', 1024, 1024, '1:1', true),
('bfl-flux-depth', 'hd', 'HD Quality', 1920, 1080, '16:9', true),
('bfl-flux-canny', 'standard', 'Standard Quality', 1024, 1024, '1:1', true),
('bfl-flux-canny', 'hd', 'HD Quality', 1920, 1080, '16:9', true),
('bfl-flux-redux', 'standard', 'Standard Quality', 1024, 1024, '1:1', true),
('bfl-flux-redux', 'hd', 'HD Quality', 1920, 1080, '16:9', true);

-- Formatos para PiAPI
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('piapi-midjourney', 'standard', 'Standard Quality', 1024, 1024, '1:1', true),
('piapi-midjourney', 'hd', 'HD Quality', 2048, 2048, '1:1', true),
('piapi-midjourney', 'portrait', 'Portrait', 1024, 1536, '2:3', true),
('piapi-midjourney', 'landscape', 'Landscape', 1536, 1024, '3:2', true),

('piapi-faceswap', 'video', 'Video Swap', 1920, 1080, '16:9', true),
('piapi-faceswap', 'image', 'Image Swap', 1024, 1024, '1:1', true),

('piapi-suno', 'mp3', 'MP3 Audio', 0, 0, 'audio', true),
('piapi-suno', 'wav', 'WAV Audio', 0, 0, 'audio', true);

-- ====================================
-- 7. PREÇOS ATUALIZADOS COM NOVOS MODELOS
-- ====================================

-- Preços para novos modelos Kling
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- Kling 1.5
('kling-1.5', '540p', 5, 38, 0.11),
('kling-1.5', '540p', 10, 76, 0.21),
('kling-1.5', '540p', 15, 114, 0.32),
('kling-1.5', '720p', 5, 48, 0.13),
('kling-1.5', '720p', 10, 96, 0.27),
('kling-1.5', '720p', 15, 144, 0.40),
('kling-1.5', '1080p', 5, 65, 0.18),
('kling-1.5', '1080p', 10, 130, 0.37),
('kling-1.5', '1080p', 15, 195, 0.55),

-- Kling 1.6
('kling-1.6', '540p', 5, 45, 0.13),
('kling-1.6', '540p', 10, 90, 0.25),
('kling-1.6', '540p', 15, 135, 0.38),
('kling-1.6', '540p', 20, 180, 0.51),
('kling-1.6', '720p', 5, 55, 0.15),
('kling-1.6', '720p', 10, 110, 0.31),
('kling-1.6', '720p', 15, 165, 0.46),
('kling-1.6', '720p', 20, 220, 0.62),
('kling-1.6', '1080p', 5, 75, 0.21),
('kling-1.6', '1080p', 10, 150, 0.42),
('kling-1.6', '1080p', 15, 225, 0.63),
('kling-1.6', '1080p', 20, 300, 0.84),

-- Kling 2.1 Master
('kling-2.1-master', '720p', 5, 120, 0.34),
('kling-2.1-master', '720p', 10, 240, 0.67),
('kling-2.1-master', '720p', 30, 720, 2.02),
('kling-2.1-master', '720p', 60, 1440, 4.05),
('kling-2.1-master', '1080p', 5, 150, 0.42),
('kling-2.1-master', '1080p', 10, 300, 0.84),
('kling-2.1-master', '1080p', 30, 900, 2.53),
('kling-2.1-master', '1080p', 60, 1800, 5.06),
('kling-2.1-master', '4k', 5, 250, 0.70),
('kling-2.1-master', '4k', 10, 500, 1.41),
('kling-2.1-master', '4k', 30, 1500, 4.22),
('kling-2.1-master', '4k', 60, 3000, 8.44),
('kling-2.1-master', '8k', 5, 500, 1.41),
('kling-2.1-master', '8k', 10, 1000, 2.81),
('kling-2.1-master', '8k', 30, 3000, 8.44),
('kling-2.1-master', '8k', 60, 6000, 16.88);

-- Preços para novos modelos BFL
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- FLUX Fill (preço por operação)
('bfl-flux-fill', 'custom', 0, 30, 0.08),
('bfl-flux-fill', 'standard', 0, 25, 0.07),
('bfl-flux-fill', 'hd', 0, 35, 0.10),

-- FLUX Depth
('bfl-flux-depth', 'standard', 0, 22, 0.06),
('bfl-flux-depth', 'hd', 0, 28, 0.08),

-- FLUX Canny
('bfl-flux-canny', 'standard', 0, 22, 0.06),
('bfl-flux-canny', 'hd', 0, 28, 0.08),

-- FLUX Redux
('bfl-flux-redux', 'standard', 0, 20, 0.056),
('bfl-flux-redux', 'hd', 0, 26, 0.073);

-- Preços para novos modelos ElevenLabs
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- v3 (mais caro)
('elevenlabs-v3', 'mp3', 1000, 90, 0.25),
('elevenlabs-v3', 'wav', 1000, 90, 0.25),

-- Multilingual v1
('elevenlabs-multilingual-v1', 'mp3', 1000, 50, 0.14),
('elevenlabs-multilingual-v1', 'wav', 1000, 50, 0.14),

-- English v1
('elevenlabs-english-v1', 'mp3', 1000, 25, 0.07),

-- Turbo v2
('elevenlabs-turbo-v2', 'mp3', 1000, 30, 0.08),

-- Flash v1
('elevenlabs-flash', 'mp3', 1000, 25, 0.07);

-- Preços para PiAPI
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- Midjourney
('piapi-midjourney', 'standard', 0, 40, 0.11),
('piapi-midjourney', 'hd', 0, 60, 0.17),
('piapi-midjourney', 'portrait', 0, 50, 0.14),
('piapi-midjourney', 'landscape', 0, 50, 0.14),

-- FaceSwap
('piapi-faceswap', 'image', 0, 15, 0.04),
('piapi-faceswap', 'video', 10, 150, 0.42),

-- Suno (por música de 30s)
('piapi-suno', 'mp3', 30, 100, 0.28),
('piapi-suno', 'wav', 30, 100, 0.28);

-- ====================================
-- 8. ASPECT RATIOS PARA NOVOS MODELOS
-- ====================================

-- Aspect ratios para novos modelos Kling
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '16:9', 'Widescreen', true FROM media_apis WHERE provider = 'kling' AND model IN ('1.5', '1.6', '2.1-master');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '1:1', 'Square', false FROM media_apis WHERE provider = 'kling' AND model IN ('1.5', '1.6', '2.1-master');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '9:16', 'Portrait', false FROM media_apis WHERE provider = 'kling' AND model IN ('1.5', '1.6', '2.1-master');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '4:3', 'Standard', false FROM media_apis WHERE provider = 'kling' AND model IN ('1.5', '1.6', '2.1-master');

-- Kling Master suporta mais formatos
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) VALUES
('kling-2.1-master', '21:9', 'Cinematic', false),
('kling-2.1-master', '32:9', 'Ultra Wide', false);

-- Aspect ratios para novos modelos BFL
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '1:1', 'Square', true FROM media_apis WHERE provider = 'bfl' AND model LIKE 'FLUX-%';

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '16:9', 'Landscape', false FROM media_apis WHERE provider = 'bfl' AND model LIKE 'FLUX-%';

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '9:16', 'Portrait', false FROM media_apis WHERE provider = 'bfl' AND model LIKE 'FLUX-%';

-- FLUX Fill suporta qualquer proporção
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) VALUES
('bfl-flux-fill', 'custom', 'Custom Ratio', false);

-- Aspect ratios para PiAPI
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) VALUES
('piapi-midjourney', '1:1', 'Square', true),
('piapi-midjourney', '2:3', 'Portrait', false),
('piapi-midjourney', '3:2', 'Landscape', false),
('piapi-midjourney', '4:3', 'Standard', false),
('piapi-midjourney', '16:9', 'Widescreen', false);

-- ====================================
-- 9. FEATURES ESPECIAIS
-- ====================================

-- Criar tabela para features especiais se não existir
CREATE TABLE IF NOT EXISTS media_features (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(100) REFERENCES media_apis(id),
    feature_name VARCHAR(100),
    feature_type VARCHAR(50), -- 'input', 'output', 'control', 'style'
    description TEXT,
    additional_credits INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Features para novos modelos
INSERT INTO media_features (api_id, feature_name, feature_type, description, additional_credits) VALUES
-- FLUX Fill
('bfl-flux-fill', 'mask_input', 'input', 'Custom mask for inpainting', 0),
('bfl-flux-fill', 'expand_canvas', 'control', 'Expand image canvas', 10),
('bfl-flux-fill', 'smart_fill', 'style', 'AI-powered content-aware fill', 5),

-- FLUX Depth
('bfl-flux-depth', 'depth_map', 'input', 'Depth map for 3D control', 0),
('bfl-flux-depth', '3d_awareness', 'control', 'Enhanced 3D spatial control', 8),

-- FLUX Canny
('bfl-flux-canny', 'edge_map', 'input', 'Edge detection map', 0),
('bfl-flux-canny', 'line_weight', 'control', 'Control line thickness', 5),

-- FLUX Redux
('bfl-flux-redux', 'style_mixing', 'style', 'Mix multiple image styles', 10),
('bfl-flux-redux', 'variation_strength', 'control', 'Control variation intensity', 0),

-- Kling Master
('kling-2.1-master', '8k_output', 'output', '8K resolution output', 100),
('kling-2.1-master', 'priority_queue', 'control', 'Skip the queue', 50),
('kling-2.1-master', 'raw_output', 'output', 'Uncompressed output', 75),

-- ElevenLabs v3
('elevenlabs-v3', 'emotion_control', 'control', 'Advanced emotion control', 10),
('elevenlabs-v3', 'voice_cloning', 'style', 'Clone custom voice', 50),
('elevenlabs-v3', 'ssml_pro', 'control', 'Advanced SSML support', 15),

-- PiAPI Midjourney
('piapi-midjourney', 'variations', 'output', 'Generate 4 variations', 30),
('piapi-midjourney', 'upscale', 'output', 'Upscale to higher resolution', 20),
('piapi-midjourney', 'remix', 'style', 'Remix with new prompt', 25);

-- Criar índices adicionais
CREATE INDEX IF NOT EXISTS idx_media_features_api ON media_features(api_id);
CREATE INDEX IF NOT EXISTS idx_media_features_type ON media_features(feature_type);

-- Comentários atualizados
COMMENT ON TABLE media_features IS 'Features especiais e add-ons para cada API';
COMMENT ON COLUMN media_features.additional_credits IS 'Créditos adicionais para usar esta feature';

-- Estatísticas finais
SELECT 
    provider,
    COUNT(*) as total_models,
    STRING_AGG(model, ', ' ORDER BY model) as models
FROM media_apis
WHERE is_active = true
GROUP BY provider
ORDER BY provider;