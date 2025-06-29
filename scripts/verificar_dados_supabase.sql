-- QUERIES PARA VERIFICAR OS DADOS INSERIDOS

-- 1. Ver quantos modelos por API
SELECT 
    provider,
    COUNT(*) as total_models
FROM media_apis
WHERE is_active = true
GROUP BY provider
ORDER BY total_models DESC;

-- 2. Ver todos os modelos de cada API
SELECT 
    provider,
    name,
    model,
    description
FROM media_apis
WHERE is_active = true
ORDER BY provider, name;

-- 3. Ver estatísticas por tipo de mídia
SELECT 
    CASE 
        WHEN provider IN ('luma', 'kling') OR model LIKE '%video%' OR name LIKE '%Video%' THEN 'Vídeo'
        WHEN provider = 'bfl' OR model LIKE '%image%' OR name LIKE '%Image%' OR name LIKE '%Portrait%' THEN 'Imagem'
        WHEN provider = 'elevenlabs' OR model LIKE '%tts%' OR model LIKE '%stt%' OR name LIKE '%TTS%' OR name LIKE '%Speech%' THEN 'Áudio/TTS'
        WHEN name LIKE '%FaceSwap%' THEN 'Especial'
        ELSE 'Outros'
    END as tipo_midia,
    COUNT(*) as total
FROM media_apis
WHERE is_active = true
GROUP BY tipo_midia
ORDER BY total DESC;

-- 4. Ver modelos gratuitos
SELECT 
    provider,
    name,
    description
FROM media_apis
WHERE id IN (
    SELECT DISTINCT api_id 
    FROM media_pricing 
    WHERE credits = 0
)
ORDER BY provider, name;

-- 5. Ver os 10 modelos mais caros
SELECT 
    ma.provider,
    ma.name,
    mp.format_value,
    mp.duration,
    mp.credits,
    mp.api_cost
FROM media_apis ma
JOIN media_pricing mp ON ma.id = mp.api_id
WHERE mp.credits > 0
ORDER BY mp.credits DESC
LIMIT 10;

-- 6. Verificar se todas as tabelas foram criadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM media_apis) as total_apis,
    (SELECT COUNT(*) FROM media_formats) as total_formats,
    (SELECT COUNT(*) FROM media_pricing) as total_pricing,
    (SELECT COUNT(*) FROM media_aspect_ratios) as total_aspect_ratios
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name LIKE 'media_%'
LIMIT 1;