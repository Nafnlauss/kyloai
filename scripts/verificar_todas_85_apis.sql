-- ====================================
-- VERIFICAÇÃO COMPLETA DAS 85 APIS
-- ====================================

-- 1. Verificar total de APIs por provider
SELECT 
    provider,
    COUNT(*) as total_models
FROM media_apis
WHERE is_active = true
GROUP BY provider
ORDER BY total_models DESC;

-- 2. Verificar se temos exatamente 85 modelos
SELECT 
    COUNT(*) as total_apis,
    COUNT(DISTINCT provider) as total_providers
FROM media_apis
WHERE is_active = true;

-- 3. Verificar se todas as tabelas foram populadas
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

-- 4. Verificar distribuição por tipo de mídia
SELECT 
    CASE 
        WHEN provider IN ('luma', 'kling') OR name LIKE '%Video%' OR name LIKE '%video%' THEN 'Vídeo'
        WHEN provider = 'bfl' OR name LIKE '%Image%' OR name LIKE '%Portrait%' THEN 'Imagem'
        WHEN provider = 'elevenlabs' OR name LIKE '%TTS%' OR name LIKE '%STT%' OR name LIKE '%Speech%' THEN 'Áudio/TTS'
        WHEN name LIKE '%FaceSwap%' OR name LIKE '%Credits%' THEN 'Especial'
        ELSE 'Outros'
    END as media_type,
    COUNT(*) as total
FROM media_apis
WHERE is_active = true
GROUP BY media_type
ORDER BY total DESC;

-- 5. Verificar modelos gratuitos
SELECT 
    provider,
    name,
    model
FROM media_apis
WHERE id IN (
    SELECT DISTINCT api_id 
    FROM media_pricing 
    WHERE credits = 0
)
ORDER BY provider, name;

-- 6. Verificar NewportAI (deve ter 40 modelos)
SELECT 
    COUNT(*) as newport_total,
    STRING_AGG(name, ', ' ORDER BY name) as newport_models
FROM media_apis
WHERE provider = 'newportai'
AND is_active = true;