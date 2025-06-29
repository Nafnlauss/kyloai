-- SQL COMPLETO - CRIAR TABELAS E INSERIR TODOS OS 85 MODELOS
-- Execute este arquivo no Supabase SQL Editor

-- ====================================
-- 1. CRIAR TABELAS (SE NÃO EXISTIREM)
-- ====================================

-- Tabela principal de APIs
CREATE TABLE IF NOT EXISTS media_apis (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    min_duration INTEGER DEFAULT 0,
    max_duration INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    features TEXT[],
    limitations TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de formatos suportados
CREATE TABLE IF NOT EXISTS media_formats (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(100) REFERENCES media_apis(id) ON DELETE CASCADE,
    format_value VARCHAR(50) NOT NULL,
    format_label VARCHAR(100) NOT NULL,
    width INTEGER DEFAULT 0,
    height INTEGER DEFAULT 0,
    aspect_ratio VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de preços
CREATE TABLE IF NOT EXISTS media_pricing (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(100) REFERENCES media_apis(id) ON DELETE CASCADE,
    format_value VARCHAR(50),
    duration INTEGER DEFAULT 0, -- segundos para vídeo, caracteres para TTS, 0 para imagem
    credits INTEGER NOT NULL,
    api_cost DECIMAL(10, 6), -- custo real em USD
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(api_id, format_value, duration)
);

-- Tabela de aspect ratios
CREATE TABLE IF NOT EXISTS media_aspect_ratios (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(100) REFERENCES media_apis(id) ON DELETE CASCADE,
    ratio VARCHAR(20) NOT NULL,
    label VARCHAR(50),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de features especiais
CREATE TABLE IF NOT EXISTS media_features (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(100) REFERENCES media_apis(id) ON DELETE CASCADE,
    feature_name VARCHAR(100),
    feature_type VARCHAR(50), -- 'input', 'output', 'control', 'style'
    description TEXT,
    additional_credits INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Limpar dados existentes para evitar duplicados
TRUNCATE TABLE media_pricing CASCADE;
TRUNCATE TABLE media_formats CASCADE;
TRUNCATE TABLE media_aspect_ratios CASCADE;
TRUNCATE TABLE media_features CASCADE;
TRUNCATE TABLE media_apis CASCADE;

-- ====================================
-- 2. INSERIR DADOS - LUMA LABS (3 modelos)
-- ====================================

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

-- ====================================
-- 3. INSERIR DADOS - KLING AI (9 modelos)
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

('kling-2.1-master', 'Kling 2.1 Master', 'kling', '2.1-master', 'Master quality edition', 'Diamond', 5, 60, true, 
 ARRAY['Master quality', 'Extended duration', '4K+ support', 'Studio features', 'Priority queue'], 
 ARRAY['Very expensive', 'Limited access', 'Long processing']),

('kling-professional', 'Kling Professional', 'kling', 'Professional', 'Professional grade generation', 'Film', 5, 120, true, 
 ARRAY['Cinema quality', 'Up to 2 minutes', '4K resolution', 'Advanced controls', 'Studio features'], 
 ARRAY['Very expensive', 'Long processing time', 'Queue priority needed']);

-- ====================================
-- 4. INSERIR DADOS - BFL.AI (10 modelos)
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
 ARRAY['Requires expertise', 'No enhancements']),

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
-- 5. INSERIR DADOS - ELEVENLABS (8 modelos)
-- ====================================

INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('elevenlabs-v3', 'ElevenLabs v3', 'elevenlabs', 'eleven_v3', 'Latest flagship model', 'Star', 0, 0, true, 
 ARRAY['Most advanced', 'Life-like speech', 'Emotional range', 'Context aware', 'All languages'], 
 ARRAY['Highest cost', 'Premium only']),

('elevenlabs-multilingual-v1', 'ElevenLabs Multilingual V1', 'elevenlabs', 'eleven_multilingual_v1', 'First multilingual model', 'Globe', 0, 0, true, 
 ARRAY['7 languages', 'Good quality', 'Stable performance', 'Legacy support'], 
 ARRAY['Fewer languages', 'Older technology']),

('elevenlabs-multilingual-v2', 'ElevenLabs Multilingual V2', 'elevenlabs', 'eleven_multilingual_v2', 'Premium multilingual voices', 'Globe', 0, 0, true, 
 ARRAY['29 languages', 'Natural voices', 'Emotion control', 'Voice cloning', 'SSML support'], 
 ARRAY['Higher cost', 'Character limits']),

('elevenlabs-english-v1', 'ElevenLabs English V1', 'elevenlabs', 'eleven_english_v1', 'English optimized model', 'Flag', 0, 0, true, 
 ARRAY['English only', 'Fast generation', 'Optimized quality', 'Low latency'], 
 ARRAY['Single language', 'Basic features']),

('elevenlabs-turbo-v2', 'ElevenLabs Turbo V2', 'elevenlabs', 'eleven_turbo_v2', 'Original turbo model', 'Zap', 0, 0, true, 
 ARRAY['Fast generation', 'Good quality', 'Low latency', 'Streaming'], 
 ARRAY['Less natural', 'Limited languages']),

('elevenlabs-turbo-v2.5', 'ElevenLabs Turbo V2.5', 'elevenlabs', 'eleven_turbo_v2_5', 'Fast balanced quality', 'Zap', 0, 0, true, 
 ARRAY['Fast generation', 'Good quality', 'Low latency', '32 languages', 'Streaming'], 
 ARRAY['Less natural', 'Fewer emotions']),

('elevenlabs-flash', 'ElevenLabs Flash', 'elevenlabs', 'eleven_flash', 'Original ultra-fast model', 'Lightning', 0, 0, true, 
 ARRAY['Ultra fast', 'Sub-100ms latency', 'Basic quality', 'Real-time'], 
 ARRAY['Lower quality', 'English only']),

('elevenlabs-flash-v2.5', 'ElevenLabs Flash V2.5', 'elevenlabs', 'eleven_flash_v2_5', 'Ultra-fast generation', 'Lightning', 0, 0, true, 
 ARRAY['Fastest speed', 'Real-time', 'Low latency', 'Streaming ready', 'API optimized'], 
 ARRAY['Basic quality', 'Limited languages']);

-- ====================================
-- 6. INSERIR DADOS - PIAPI (15 modelos únicos)
-- ====================================

-- Vídeo (5)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
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

-- Imagem (2)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-midjourney', 'Midjourney v6', 'piapi', 'midjourney-v6', 'Unofficial Midjourney API', 'Image', 0, 0, true, 
 ARRAY['Latest Midjourney', 'High quality', 'Artistic style', 'Multiple variations'], 
 ARRAY['Unofficial API', 'Queue delays', 'Premium pricing']),

('piapi-gpt-image', 'GPT-Image-1', 'piapi', 'gpt-image-1', 'GPT-based image generation', 'Brain', 0, 0, true, 
 ARRAY['GPT integration', 'Smart generation', 'Context aware', 'Text understanding'], 
 ARRAY['Experimental', 'Variable quality']);

-- Áudio (7)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-suno', 'Suno v3', 'piapi', 'suno-v3', 'AI music generation', 'Music', 0, 300, true, 
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

-- Especial (1)
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-faceswap', 'FaceSwap', 'piapi', 'faceswap-v1', 'AI face swapping', 'Users', 0, 0, true, 
 ARRAY['Face swapping', 'High accuracy', 'Video support', 'Multiple faces'], 
 ARRAY['Privacy concerns', 'Processing time']);

-- ====================================
-- 7. INSERIR DADOS - NEWPORTAI (40 modelos)
-- ====================================

-- Continua no próximo arquivo devido ao tamanho...