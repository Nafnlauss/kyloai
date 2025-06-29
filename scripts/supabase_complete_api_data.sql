-- SQL Completo com TODAS as APIs (Vídeo, Imagem, Áudio)
-- Baseado na estratégia de precificação com margem mínima de 100%

-- Limpar dados existentes
TRUNCATE TABLE video_pricing CASCADE;
TRUNCATE TABLE video_formats CASCADE;
TRUNCATE TABLE video_apis CASCADE;
TRUNCATE TABLE video_aspect_ratios CASCADE;

-- Renomear tabela para ser mais genérica (não só vídeo)
ALTER TABLE video_apis RENAME TO media_apis;
ALTER TABLE video_formats RENAME TO media_formats;
ALTER TABLE video_pricing RENAME TO media_pricing;
ALTER TABLE video_aspect_ratios RENAME TO media_aspect_ratios;

-- ====================================
-- 1. APIs DE VÍDEO
-- ====================================

-- Luma Labs - Todos os modelos
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('luma-ray2-flash', 'Luma Ray2-Flash', 'luma', 'Ray2-Flash', 'Fast generation, lower quality', 'Zap', 5, 5, true, 
 ARRAY['Fast generation', 'Basic quality', 'Text to video', 'Preview mode'], 
 ARRAY['Only 540p', 'Max 5 seconds', 'No 4K support']),

('luma-ray2', 'Luma Ray2', 'luma', 'Ray2', 'High quality video generation', 'Sparkles', 5, 9, true, 
 ARRAY['High quality', 'Multiple resolutions', 'Extended duration', 'Professional output'], 
 ARRAY['Slower generation', 'Higher cost', 'Max 9 seconds']),

('luma-ray1.6', 'Luma Ray 1.6', 'luma', 'Ray1.6', 'Legacy model with pixel-based pricing', 'Video', 5, 10, true, 
 ARRAY['Stable generation', 'Pixel-based pricing', 'Legacy support'], 
 ARRAY['Older technology', 'Being phased out']);

-- Kling AI - Todos os modelos (1.0, 1.1, 1.2, 2.0, 2.1, Professional)
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

('kling-2.0', 'Kling 2.0', 'kling', '2.0', 'Next generation model', 'Crown', 5, 30, true, 
 ARRAY['Superior quality', '4K support', 'Advanced motion', 'Cinematic quality'], 
 ARRAY['Premium pricing', 'Longer wait times']),

('kling-2.1', 'Kling 2.1', 'kling', '2.1', 'Latest improvements', 'Crown', 5, 30, true, 
 ARRAY['Best quality', '4K support', 'Professional features', 'Enhanced AI'], 
 ARRAY['Highest cost', 'Limited availability']),

('kling-professional', 'Kling Professional', 'kling', 'Professional', 'Professional grade generation', 'Film', 5, 120, true, 
 ARRAY['Cinema quality', 'Up to 2 minutes', '4K resolution', 'Advanced controls', 'Studio features'], 
 ARRAY['Very expensive', 'Long processing time', 'Queue priority needed']);

-- ====================================
-- 2. APIs DE IMAGEM
-- ====================================

INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
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
 ARRAY['Requires expertise', 'No enhancements']);

-- ====================================
-- 3. APIs DE ÁUDIO (TEXT-TO-SPEECH)
-- ====================================

INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('elevenlabs-multilingual-v2', 'ElevenLabs Multilingual V2', 'elevenlabs', 'eleven_multilingual_v2', 'Premium multilingual voices', 'Globe', 0, 0, true, 
 ARRAY['29 languages', 'Natural voices', 'Emotion control', 'Voice cloning', 'SSML support'], 
 ARRAY['Higher cost', 'Character limits']),

('elevenlabs-turbo-v2.5', 'ElevenLabs Turbo V2.5', 'elevenlabs', 'eleven_turbo_v2_5', 'Fast balanced quality', 'Zap', 0, 0, true, 
 ARRAY['Fast generation', 'Good quality', 'Low latency', '32 languages', 'Streaming'], 
 ARRAY['Less natural', 'Fewer emotions']),

('elevenlabs-flash-v2.5', 'ElevenLabs Flash V2.5', 'elevenlabs', 'eleven_flash_v2_5', 'Ultra-fast generation', 'Lightning', 0, 0, true, 
 ARRAY['Fastest speed', 'Real-time', 'Low latency', 'Streaming ready', 'API optimized'], 
 ARRAY['Basic quality', 'Limited languages']);

-- ====================================
-- 4. FORMATOS SUPORTADOS
-- ====================================

-- Formatos para Luma Ray2-Flash (apenas 540p)
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('luma-ray2-flash', '540p', '540p Standard', 960, 540, '16:9', true);

-- Formatos para Luma Ray2 (múltiplas resoluções)
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('luma-ray2', '720p', '720p HD', 1280, 720, '16:9', true),
('luma-ray2', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('luma-ray2', '4k', '4K Ultra HD', 3840, 2160, '16:9', true);

-- Formatos para todos os modelos Kling
-- Kling 1.0, 1.1, 1.2
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '540p', '540p Standard', 960, 540, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('1.0', '1.1', '1.2');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '720p', '720p HD', 1280, 720, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('1.0', '1.1', '1.2');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '1080p', '1080p Full HD', 1920, 1080, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('1.0', '1.1', '1.2');

-- Kling 2.0, 2.1, Professional (suportam 4K)
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '720p', '720p HD', 1280, 720, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('2.0', '2.1', 'Professional');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '1080p', '1080p Full HD', 1920, 1080, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('2.0', '2.1', 'Professional');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, '4k', '4K Ultra HD', 3840, 2160, '16:9', true 
FROM media_apis WHERE provider = 'kling' AND model IN ('2.0', '2.1', 'Professional');

-- Formatos para APIs de Imagem (BFL)
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'standard', 'Standard Quality', 1024, 1024, '1:1', true 
FROM media_apis WHERE provider = 'bfl';

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'hd', 'HD Quality', 1920, 1080, '16:9', true 
FROM media_apis WHERE provider = 'bfl' AND model IN ('FLUX1.1-Pro', 'FLUX1.0-Pro', 'FLUX-Ultra');

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'portrait', 'Portrait', 1080, 1920, '9:16', true 
FROM media_apis WHERE provider = 'bfl';

-- Formatos para APIs de Áudio (caracteres, não pixels)
INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'mp3', 'MP3 Audio', 0, 0, 'audio', true 
FROM media_apis WHERE provider = 'elevenlabs';

INSERT INTO media_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) 
SELECT api_id, 'wav', 'WAV Audio', 0, 0, 'audio', true 
FROM media_apis WHERE provider = 'elevenlabs' AND model = 'eleven_multilingual_v2';

-- ====================================
-- 5. PREÇOS COM MARGEM 100% GARANTIDA
-- ====================================

-- VÍDEOS - Luma
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- Ray2-Flash
('luma-ray2-flash', '540p', 5, 50, 0.14),
-- Ray2
('luma-ray2', '720p', 5, 253, 0.71),
('luma-ray2', '720p', 7, 355, 1.00),
('luma-ray2', '720p', 9, 458, 1.29),
('luma-ray2', '1080p', 5, 355, 1.00),
('luma-ray2', '1080p', 7, 458, 1.29),
('luma-ray2', '1080p', 9, 560, 1.58),
('luma-ray2', '4k', 5, 458, 1.29),
('luma-ray2', '4k', 7, 560, 1.58),
('luma-ray2', '4k', 9, 613, 1.72);

-- VÍDEOS - Kling (todos os modelos)
-- Kling 1.0
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-1.0', '540p', 5, 30, 0.08),
('kling-1.0', '540p', 10, 60, 0.16),
('kling-1.0', '720p', 5, 40, 0.11),
('kling-1.0', '720p', 10, 80, 0.22),
('kling-1.0', '1080p', 5, 50, 0.14),
('kling-1.0', '1080p', 10, 100, 0.28);

-- Kling 1.1
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-1.1', '540p', 5, 35, 0.10),
('kling-1.1', '540p', 10, 70, 0.20),
('kling-1.1', '720p', 5, 45, 0.13),
('kling-1.1', '720p', 10, 90, 0.25),
('kling-1.1', '1080p', 5, 60, 0.17),
('kling-1.1', '1080p', 10, 120, 0.34);

-- Kling 1.2
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-1.2', '540p', 5, 40, 0.11),
('kling-1.2', '540p', 10, 80, 0.22),
('kling-1.2', '540p', 15, 120, 0.34),
('kling-1.2', '720p', 5, 50, 0.14),
('kling-1.2', '720p', 10, 100, 0.28),
('kling-1.2', '720p', 15, 150, 0.42),
('kling-1.2', '1080p', 5, 70, 0.20),
('kling-1.2', '1080p', 10, 140, 0.39),
('kling-1.2', '1080p', 15, 210, 0.59);

-- Kling 2.0
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-2.0', '720p', 5, 80, 0.22),
('kling-2.0', '720p', 10, 160, 0.45),
('kling-2.0', '720p', 15, 240, 0.67),
('kling-2.0', '720p', 30, 480, 1.35),
('kling-2.0', '1080p', 5, 100, 0.28),
('kling-2.0', '1080p', 10, 200, 0.56),
('kling-2.0', '1080p', 15, 300, 0.84),
('kling-2.0', '1080p', 30, 600, 1.69),
('kling-2.0', '4k', 5, 150, 0.42),
('kling-2.0', '4k', 10, 300, 0.84),
('kling-2.0', '4k', 15, 450, 1.27),
('kling-2.0', '4k', 30, 900, 2.53);

-- Kling 2.1
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-2.1', '720p', 5, 90, 0.25),
('kling-2.1', '720p', 10, 180, 0.51),
('kling-2.1', '720p', 15, 270, 0.76),
('kling-2.1', '720p', 30, 540, 1.52),
('kling-2.1', '1080p', 5, 110, 0.31),
('kling-2.1', '1080p', 10, 220, 0.62),
('kling-2.1', '1080p', 15, 330, 0.93),
('kling-2.1', '1080p', 30, 660, 1.86),
('kling-2.1', '4k', 5, 170, 0.48),
('kling-2.1', '4k', 10, 340, 0.96),
('kling-2.1', '4k', 15, 510, 1.43),
('kling-2.1', '4k', 30, 1020, 2.87);

-- Kling Professional
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-professional', '1080p', 5, 125, 0.35),
('kling-professional', '1080p', 10, 250, 0.70),
('kling-professional', '1080p', 30, 750, 2.11),
('kling-professional', '1080p', 60, 1500, 4.22),
('kling-professional', '1080p', 120, 3000, 8.44),
('kling-professional', '4k', 5, 225, 0.63),
('kling-professional', '4k', 10, 450, 1.27),
('kling-professional', '4k', 30, 1350, 3.80),
('kling-professional', '4k', 60, 2700, 7.59),
('kling-professional', '4k', 120, 5400, 15.19);

-- IMAGENS - BFL (duração = 0 para imagens)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- FLUX Schnell (grátis, cobramos taxa de serviço)
('bfl-flux-schnell', 'standard', 0, 5, 0.00),
('bfl-flux-schnell', 'hd', 0, 5, 0.00),
('bfl-flux-schnell', 'portrait', 0, 5, 0.00),
-- FLUX Dev
('bfl-flux-dev', 'standard', 0, 9, 0.025),
('bfl-flux-dev', 'hd', 0, 9, 0.025),
('bfl-flux-dev', 'portrait', 0, 9, 0.025),
-- FLUX 1.1 Pro
('bfl-flux-1.1-pro', 'standard', 0, 15, 0.04),
('bfl-flux-1.1-pro', 'hd', 0, 15, 0.04),
('bfl-flux-1.1-pro', 'portrait', 0, 15, 0.04),
-- FLUX 1.0 Pro
('bfl-flux-1.0-pro', 'standard', 0, 18, 0.05),
('bfl-flux-1.0-pro', 'hd', 0, 18, 0.05),
('bfl-flux-1.0-pro', 'portrait', 0, 18, 0.05),
-- FLUX Ultra
('bfl-flux-ultra', 'standard', 0, 36, 0.10),
('bfl-flux-ultra', 'hd', 0, 43, 0.12),
('bfl-flux-ultra', 'portrait', 0, 43, 0.12),
-- FLUX Raw
('bfl-flux-raw', 'standard', 0, 25, 0.07),
('bfl-flux-raw', 'hd', 0, 25, 0.07),
('bfl-flux-raw', 'portrait', 0, 25, 0.07);

-- ÁUDIO - ElevenLabs (duração = 1000 para representar 1000 caracteres)
INSERT INTO media_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- Multilingual V2
('elevenlabs-multilingual-v2', 'mp3', 1000, 65, 0.18),
('elevenlabs-multilingual-v2', 'wav', 1000, 65, 0.18),
-- Turbo V2.5
('elevenlabs-turbo-v2.5', 'mp3', 1000, 33, 0.09),
-- Flash V2.5
('elevenlabs-flash-v2.5', 'mp3', 1000, 33, 0.09);

-- ====================================
-- 6. ASPECT RATIOS SUPORTADOS
-- ====================================

-- Aspect ratios para vídeos
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '16:9', 'Widescreen', true FROM media_apis WHERE provider IN ('luma', 'kling');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '1:1', 'Square', false FROM media_apis WHERE provider IN ('luma', 'kling');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '9:16', 'Portrait', false FROM media_apis WHERE provider IN ('luma', 'kling');

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '4:3', 'Standard', false FROM media_apis WHERE provider IN ('luma', 'kling') AND model NOT LIKE '1.0%' AND model NOT LIKE '1.1%';

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '21:9', 'Cinematic', false FROM media_apis WHERE model = 'Professional';

-- Aspect ratios para imagens
INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '1:1', 'Square', true FROM media_apis WHERE provider = 'bfl';

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '16:9', 'Landscape', false FROM media_apis WHERE provider = 'bfl';

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '9:16', 'Portrait', false FROM media_apis WHERE provider = 'bfl';

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '4:5', 'Instagram', false FROM media_apis WHERE provider = 'bfl';

INSERT INTO media_aspect_ratios (api_id, ratio, label, is_default) 
SELECT api_id, '3:2', 'Photo', false FROM media_apis WHERE provider = 'bfl' AND model LIKE '%Pro%' OR model LIKE '%Ultra%';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_media_apis_provider ON media_apis(provider);
CREATE INDEX IF NOT EXISTS idx_media_apis_active ON media_apis(is_active);
CREATE INDEX IF NOT EXISTS idx_media_formats_api ON media_formats(api_id);
CREATE INDEX IF NOT EXISTS idx_media_pricing_lookup ON media_pricing(api_id, format_value, duration);
CREATE INDEX IF NOT EXISTS idx_media_aspect_ratios_api ON media_aspect_ratios(api_id);

-- Adicionar comentários nas tabelas
COMMENT ON TABLE media_apis IS 'Todas as APIs de geração de mídia (vídeo, imagem, áudio)';
COMMENT ON TABLE media_formats IS 'Formatos suportados por cada API';
COMMENT ON TABLE media_pricing IS 'Preços com margem 100% garantida baseado no plano mais barato';
COMMENT ON TABLE media_aspect_ratios IS 'Proporções suportadas por cada API';

COMMENT ON COLUMN media_pricing.duration IS 'Para vídeo: segundos, Para áudio: caracteres/1000, Para imagem: 0';
COMMENT ON COLUMN media_pricing.credits IS 'Créditos calculados com margem mínima de 100%';
COMMENT ON COLUMN media_pricing.api_cost IS 'Custo real da API em USD';