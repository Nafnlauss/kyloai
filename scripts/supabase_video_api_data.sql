-- Dados para popular as tabelas do sistema de APIs de vídeo

-- 1. Inserir APIs disponíveis
INSERT INTO video_apis (id, name, provider, model, description, icon, min_duration, max_duration, features, limitations) VALUES
-- Luma Labs
('luma-ray2-flash', 'Luma Ray2-Flash', 'luma', 'ray2-flash', 'Modelo econômico para previews rápidos', 'Zap', 5, 5, 
  '["Geração ultra-rápida (30-60s)", "Ideal para testar ideias", "Menor custo por vídeo"]'::jsonb,
  '["Apenas 540p de resolução", "Máximo 5 segundos", "Qualidade reduzida"]'::jsonb),

('luma-ray2', 'Luma Ray2', 'luma', 'ray2', 'Modelo premium com alta qualidade e múltiplas resoluções', 'Sparkles', 5, 9,
  '["Qualidade cinematográfica", "Suporte até 4K", "Movimentos fluidos e realistas", "Melhor aderência ao prompt"]'::jsonb,
  '["Máximo 9 segundos", "4K disponível apenas para 9s"]'::jsonb),

-- Kling AI
('kling-standard', 'Kling Standard', 'kling', 'standard', 'Qualidade padrão com ótimo custo-benefício', 'Video', 5, 10,
  '["Boa qualidade geral", "Processamento rápido", "Suporta múltiplos idiomas", "Bom para conteúdo comercial"]'::jsonb,
  '["Máximo 10 segundos", "Menos detalhes que Professional"]'::jsonb),

('kling-professional', 'Kling Professional', 'kling', 'professional', 'Qualidade cinematográfica com vídeos longos', 'Crown', 5, 120,
  '["Máxima qualidade disponível", "Vídeos até 2 minutos", "Movimentos complexos", "Ideal para produção profissional", "Melhor física e realismo"]'::jsonb,
  '["Processamento mais demorado", "Custo elevado para vídeos longos"]'::jsonb);

-- 2. Inserir formatos suportados
INSERT INTO video_formats (api_id, format_value, format_label, width, height, aspect_ratio) VALUES
-- Luma Ray2-Flash (apenas 540p)
('luma-ray2-flash', '540p', '540p (960×540)', 960, 540, '16:9'),

-- Luma Ray2 (múltiplas resoluções)
('luma-ray2', '720p', 'HD 720p (1280×720)', 1280, 720, '16:9'),
('luma-ray2', '1080p', 'Full HD 1080p (1920×1080)', 1920, 1080, '16:9'),
('luma-ray2', '4k', '4K Ultra HD (3840×2160)', 3840, 2160, '16:9'),

-- Kling Standard
('kling-standard', '720p', 'HD 720p', 1280, 720, '16:9'),
('kling-standard', '1080p', 'Full HD 1080p', 1920, 1080, '16:9'),

-- Kling Professional
('kling-professional', '1080p', 'Full HD 1080p', 1920, 1080, '16:9'),
('kling-professional', '4k', '4K Ultra HD', 3840, 2160, '16:9');

-- 3. Inserir preços (com margem 100% garantida)
INSERT INTO video_pricing (api_id, format_value, duration, credits, api_cost) VALUES
-- Luma Ray2-Flash
('luma-ray2-flash', '540p', 5, 50, 0.14),

-- Luma Ray2
('luma-ray2', '720p', 5, 253, 0.71),
('luma-ray2', '1080p', 5, 275, 0.77),
('luma-ray2', '1080p', 9, 549, 1.54),
('luma-ray2', '4k', 9, 613, 1.72),

-- Kling Standard
('kling-standard', '720p', 5, 50, 0.14),
('kling-standard', '720p', 10, 100, 0.28),
('kling-standard', '1080p', 5, 50, 0.14),
('kling-standard', '1080p', 10, 100, 0.28),

-- Kling Professional
('kling-professional', '1080p', 5, 125, 0.35),
('kling-professional', '1080p', 10, 250, 0.70),
('kling-professional', '1080p', 30, 750, 2.10),
('kling-professional', '1080p', 60, 1500, 4.20),
('kling-professional', '1080p', 120, 3000, 8.40),
('kling-professional', '4k', 5, 188, 0.525),
('kling-professional', '4k', 10, 375, 1.05),
('kling-professional', '4k', 30, 1125, 3.15),
('kling-professional', '4k', 60, 2250, 6.30),
('kling-professional', '4k', 120, 4500, 12.60);

-- 4. Inserir aspect ratios suportados
INSERT INTO video_aspect_ratios (api_id, ratio, label, is_default) VALUES
-- Todos suportam 16:9 como padrão
('luma-ray2-flash', '16:9', 'Paisagem', true),
('luma-ray2', '16:9', 'Paisagem', true),
('kling-standard', '16:9', 'Paisagem', true),
('kling-professional', '16:9', 'Paisagem', true),

-- Alguns podem suportar outros formatos (adicionar conforme necessário)
('luma-ray2', '1:1', 'Quadrado', false),
('luma-ray2', '9:16', 'Retrato', false),
('kling-professional', '1:1', 'Quadrado', false),
('kling-professional', '9:16', 'Retrato', false);

-- 5. Features especiais (para implementação futura)
INSERT INTO video_features (id, api_id, feature_name, feature_type, credits_per_unit, api_cost_per_unit, unit_type, description) VALUES
('luma-audio', 'luma-ray2', 'Adicionar Áudio', 'audio', 8, 0.02, 'second', 'Adiciona trilha sonora ao vídeo'),
('luma-upscale', 'luma-ray2', 'Upscaling', 'upscale', 40, 0.11, 'operation', 'Melhora a qualidade/resolução'),
('lip-sync', NULL, 'Sincronização Labial', 'lip_sync', 36, 0.10, 'operation', 'Sincroniza fala com movimento labial');