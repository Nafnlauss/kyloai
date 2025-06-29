-- Limpar dados existentes
TRUNCATE TABLE video_pricing CASCADE;
TRUNCATE TABLE video_formats CASCADE;
TRUNCATE TABLE video_apis CASCADE;

-- Inserir APIs com todos os modelos
INSERT INTO video_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
-- Luma Labs
('luma-ray2-flash', 'Luma Ray2-Flash', 'luma', 'Ray2-Flash', 'Fast generation, lower quality', 'Zap', 5, 5, true, 
 ARRAY['Fast generation', 'Basic quality', 'Text to video'], 
 ARRAY['Only 540p', 'Max 5 seconds']),

('luma-ray2', 'Luma Ray2', 'luma', 'Ray2', 'High quality video generation', 'Sparkles', 5, 9, true, 
 ARRAY['High quality', 'Multiple resolutions', 'Extended duration'], 
 ARRAY['Slower generation', 'Higher cost']),

-- Kling AI - Todos os modelos
('kling-1.0', 'Kling 1.0', 'kling', '1.0', 'Original Kling model', 'Video', 5, 10, true, 
 ARRAY['Stable generation', 'Good quality', 'Fast processing'], 
 ARRAY['Limited to 1080p', 'Max 10 seconds']),

('kling-1.1', 'Kling 1.1', 'kling', '1.1', 'Improved version with better motion', 'Video', 5, 10, true, 
 ARRAY['Better motion', 'Enhanced details', 'Faster than 1.0'], 
 ARRAY['Limited to 1080p', 'Max 10 seconds']),

('kling-1.2', 'Kling 1.2', 'kling', '1.2', 'Latest stable version', 'Video', 5, 15, true, 
 ARRAY['Best motion quality', 'Improved coherence', 'Extended duration'], 
 ARRAY['Higher cost', 'Longer processing']),

('kling-2.0', 'Kling 2.0', 'kling', '2.0', 'Next generation model', 'Crown', 5, 30, true, 
 ARRAY['Superior quality', '4K support', 'Advanced motion'], 
 ARRAY['Premium pricing', 'Longer wait times']),

('kling-2.1', 'Kling 2.1', 'kling', '2.1', 'Latest improvements', 'Crown', 5, 30, true, 
 ARRAY['Best quality', '4K support', 'Professional features'], 
 ARRAY['Highest cost', 'Limited availability']),

('kling-professional', 'Kling Professional', 'kling', 'Professional', 'Professional grade generation', 'Film', 5, 120, true, 
 ARRAY['Cinema quality', 'Up to 2 minutes', '4K resolution', 'Advanced controls'], 
 ARRAY['Very expensive', 'Long processing time']);

-- Inserir formatos para cada API
-- Luma Ray2-Flash (apenas 540p)
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('luma-ray2-flash', '540p', '540p Standard', 960, 540, '16:9', true);

-- Luma Ray2 (múltiplas resoluções)
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('luma-ray2', '720p', '720p HD', 1280, 720, '16:9', true),
('luma-ray2', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('luma-ray2', '4k', '4K Ultra HD', 3840, 2160, '16:9', true);

-- Kling 1.0
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('kling-1.0', '540p', '540p Standard', 960, 540, '16:9', true),
('kling-1.0', '720p', '720p HD', 1280, 720, '16:9', true),
('kling-1.0', '1080p', '1080p Full HD', 1920, 1080, '16:9', true);

-- Kling 1.1
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('kling-1.1', '540p', '540p Standard', 960, 540, '16:9', true),
('kling-1.1', '720p', '720p HD', 1280, 720, '16:9', true),
('kling-1.1', '1080p', '1080p Full HD', 1920, 1080, '16:9', true);

-- Kling 1.2
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('kling-1.2', '540p', '540p Standard', 960, 540, '16:9', true),
('kling-1.2', '720p', '720p HD', 1280, 720, '16:9', true),
('kling-1.2', '1080p', '1080p Full HD', 1920, 1080, '16:9', true);

-- Kling 2.0
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('kling-2.0', '720p', '720p HD', 1280, 720, '16:9', true),
('kling-2.0', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('kling-2.0', '4k', '4K Ultra HD', 3840, 2160, '16:9', true);

-- Kling 2.1
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('kling-2.1', '720p', '720p HD', 1280, 720, '16:9', true),
('kling-2.1', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('kling-2.1', '4k', '4K Ultra HD', 3840, 2160, '16:9', true);

-- Kling Professional
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio, is_active) VALUES
('kling-professional', '1080p', '1080p Full HD', 1920, 1080, '16:9', true),
('kling-professional', '4k', '4K Ultra HD', 3840, 2160, '16:9', true);

-- Inserir preços (com margem 100%)
-- Luma Ray2-Flash
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('luma-ray2-flash', '540p', 5, 50, 0.14);

-- Luma Ray2
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('luma-ray2', '720p', 5, 253, 0.71),
('luma-ray2', '720p', 7, 355, 1.00),
('luma-ray2', '720p', 9, 458, 1.29),
('luma-ray2', '1080p', 5, 355, 1.00),
('luma-ray2', '1080p', 7, 458, 1.29),
('luma-ray2', '1080p', 9, 560, 1.58),
('luma-ray2', '4k', 5, 458, 1.29),
('luma-ray2', '4k', 7, 560, 1.58),
('luma-ray2', '4k', 9, 613, 1.72);

-- Kling 1.0
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-1.0', '540p', 5, 30, 0.08),
('kling-1.0', '540p', 10, 60, 0.16),
('kling-1.0', '720p', 5, 40, 0.11),
('kling-1.0', '720p', 10, 80, 0.22),
('kling-1.0', '1080p', 5, 50, 0.14),
('kling-1.0', '1080p', 10, 100, 0.28);

-- Kling 1.1
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
('kling-1.1', '540p', 5, 35, 0.10),
('kling-1.1', '540p', 10, 70, 0.20),
('kling-1.1', '720p', 5, 45, 0.13),
('kling-1.1', '720p', 10, 90, 0.25),
('kling-1.1', '1080p', 5, 60, 0.17),
('kling-1.1', '1080p', 10, 120, 0.34);

-- Kling 1.2
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
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
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
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
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
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
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
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

-- Adicionar aspect ratios para todas as APIs
INSERT INTO video_aspect_ratios (api_id, ratio, label, is_default) VALUES
-- Luma
('luma-ray2-flash', '16:9', 'Widescreen', true),
('luma-ray2-flash', '1:1', 'Square', false),
('luma-ray2-flash', '9:16', 'Portrait', false),
('luma-ray2', '16:9', 'Widescreen', true),
('luma-ray2', '1:1', 'Square', false),
('luma-ray2', '9:16', 'Portrait', false),
('luma-ray2', '4:3', 'Standard', false),
('luma-ray2', '3:4', 'Vertical', false),
-- Kling (todos os modelos)
('kling-1.0', '16:9', 'Widescreen', true),
('kling-1.0', '1:1', 'Square', false),
('kling-1.0', '9:16', 'Portrait', false),
('kling-1.1', '16:9', 'Widescreen', true),
('kling-1.1', '1:1', 'Square', false),
('kling-1.1', '9:16', 'Portrait', false),
('kling-1.2', '16:9', 'Widescreen', true),
('kling-1.2', '1:1', 'Square', false),
('kling-1.2', '9:16', 'Portrait', false),
('kling-2.0', '16:9', 'Widescreen', true),
('kling-2.0', '1:1', 'Square', false),
('kling-2.0', '9:16', 'Portrait', false),
('kling-2.0', '4:3', 'Standard', false),
('kling-2.1', '16:9', 'Widescreen', true),
('kling-2.1', '1:1', 'Square', false),
('kling-2.1', '9:16', 'Portrait', false),
('kling-2.1', '4:3', 'Standard', false),
('kling-professional', '16:9', 'Widescreen', true),
('kling-professional', '1:1', 'Square', false),
('kling-professional', '9:16', 'Portrait', false),
('kling-professional', '4:3', 'Standard', false),
('kling-professional', '3:4', 'Vertical', false),
('kling-professional', '21:9', 'Cinematic', false);