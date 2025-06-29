-- SQL FINAL SEM REDUNDÂNCIAS - APENAS MODELOS ÚNICOS
-- Total: 45 modelos (30 diretos + 15 únicos da PiAPI)

-- Primeiro, limpar modelos redundantes da PiAPI
DELETE FROM media_pricing WHERE api_id IN ('piapi-kling', 'piapi-luma', 'piapi-flux');
DELETE FROM media_formats WHERE api_id IN ('piapi-kling', 'piapi-luma', 'piapi-flux');
DELETE FROM media_aspect_ratios WHERE api_id IN ('piapi-kling', 'piapi-luma', 'piapi-flux');
DELETE FROM media_apis WHERE id IN ('piapi-kling', 'piapi-luma', 'piapi-flux');

-- ====================================
-- PIAPI - APENAS MODELOS ÚNICOS (15)
-- ====================================

-- VÍDEO - 5 APIs únicas
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

-- IMAGEM - 2 APIs únicas
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-midjourney', 'Midjourney v6', 'piapi', 'midjourney-v6', 'Unofficial Midjourney API', 'Image', 0, 0, true, 
 ARRAY['Latest Midjourney', 'High quality', 'Artistic style', 'Multiple variations'], 
 ARRAY['Unofficial API', 'Queue delays', 'Premium pricing']),

('piapi-gpt-image', 'GPT-Image-1', 'piapi', 'gpt-image-1', 'GPT-based image generation', 'Brain', 0, 0, true, 
 ARRAY['GPT integration', 'Smart generation', 'Context aware', 'Text understanding'], 
 ARRAY['Experimental', 'Variable quality']);

-- ÁUDIO - 7 APIs únicas
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

-- ESPECIAL - 1 API única
INSERT INTO media_apis (id, name, provider, model, description, icon, min_duration, max_duration, is_active, features, limitations) VALUES
('piapi-faceswap', 'FaceSwap', 'piapi', 'faceswap-v1', 'AI face swapping', 'Users', 0, 0, true, 
 ARRAY['Face swapping', 'High accuracy', 'Video support', 'Multiple faces'], 
 ARRAY['Privacy concerns', 'Processing time']);

-- ====================================
-- ESTATÍSTICAS FINAIS
-- ====================================

-- Contagem total sem redundâncias
SELECT 
    'TOTAL DE MODELOS ÚNICOS' as categoria,
    COUNT(*) as total
FROM media_apis
WHERE is_active = true

UNION ALL

SELECT 
    'Acesso Direto' as categoria,
    COUNT(*) as total
FROM media_apis
WHERE provider IN ('luma', 'kling', 'bfl', 'elevenlabs')
AND is_active = true

UNION ALL

SELECT 
    'Via PiAPI (únicos)' as categoria,
    COUNT(*) as total
FROM media_apis
WHERE provider = 'piapi'
AND is_active = true

UNION ALL

-- Por tipo
SELECT 
    CASE 
        WHEN id LIKE '%video%' OR model IN ('hailuo-v1', 'hunyuan-video', 'omnihuman-v1', 'skyreels-v1', 'wan-2.1') OR provider IN ('luma', 'kling') THEN 'Vídeo'
        WHEN id LIKE '%image%' OR model IN ('midjourney-v6', 'gpt-image-1') OR provider = 'bfl' THEN 'Imagem'
        WHEN id LIKE '%audio%' OR id LIKE '%tts%' OR model IN ('suno-v3', 'diffrhythm-v1', 'udio-v1', 'moshi-v1', 'f5-tts-v1', 'mmaudio-v1', 'acestep-v1') OR provider = 'elevenlabs' THEN 'Áudio/TTS'
        ELSE 'Especial'
    END as categoria,
    COUNT(*) as total
FROM media_apis
WHERE is_active = true
GROUP BY 1
ORDER BY 2 DESC;