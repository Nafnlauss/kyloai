-- ====================================
-- TESTE COMPLETO - 100% CERTEZA DOS 85 MODELOS
-- ====================================

-- 1. CONTAGEM TOTAL E POR PROVIDER
WITH provider_counts AS (
    SELECT 
        provider,
        COUNT(*) as total_models
    FROM media_apis
    WHERE is_active = true
    GROUP BY provider
    
    UNION ALL
    
    SELECT 
        'TOTAL GERAL' as provider,
        COUNT(*) as total_models
    FROM media_apis
    WHERE is_active = true
)
SELECT * FROM provider_counts
ORDER BY 
    CASE WHEN provider = 'TOTAL GERAL' THEN 0 ELSE 1 END,
    total_models DESC;

-- 2. VERIFICAR SE EXISTEM EXATAMENTE ESTES TOTAIS:
-- newportai: 40
-- piapi: 15  
-- bfl: 10
-- kling: 9
-- elevenlabs: 8
-- luma: 3
-- TOTAL: 85

-- 3. LISTAR TODOS OS 85 MODELOS POR PROVIDER
SELECT 
    ROW_NUMBER() OVER (ORDER BY provider, name) as numero,
    provider,
    id,
    name,
    model
FROM media_apis
WHERE is_active = true
ORDER BY 
    CASE 
        WHEN provider = 'luma' THEN 1
        WHEN provider = 'kling' THEN 2
        WHEN provider = 'bfl' THEN 3
        WHEN provider = 'elevenlabs' THEN 4
        WHEN provider = 'piapi' THEN 5
        WHEN provider = 'newportai' THEN 6
    END,
    name;

-- 4. VERIFICAR SE TODOS OS MODELOS ESPERADOS EXISTEM
WITH expected_models AS (
    -- LUMA (3)
    SELECT 'luma-ray2-flash' as id UNION ALL
    SELECT 'luma-ray2' UNION ALL
    SELECT 'luma-ray1.6' UNION ALL
    
    -- KLING (9)
    SELECT 'kling-1.0' UNION ALL
    SELECT 'kling-1.1' UNION ALL
    SELECT 'kling-1.2' UNION ALL
    SELECT 'kling-1.5' UNION ALL
    SELECT 'kling-1.6' UNION ALL
    SELECT 'kling-2.0' UNION ALL
    SELECT 'kling-2.1' UNION ALL
    SELECT 'kling-2.1-master' UNION ALL
    SELECT 'kling-professional' UNION ALL
    
    -- BFL (10)
    SELECT 'bfl-flux-schnell' UNION ALL
    SELECT 'bfl-flux-dev' UNION ALL
    SELECT 'bfl-flux-1.1-pro' UNION ALL
    SELECT 'bfl-flux-1.0-pro' UNION ALL
    SELECT 'bfl-flux-ultra' UNION ALL
    SELECT 'bfl-flux-raw' UNION ALL
    SELECT 'bfl-flux-fill' UNION ALL
    SELECT 'bfl-flux-depth' UNION ALL
    SELECT 'bfl-flux-canny' UNION ALL
    SELECT 'bfl-flux-redux' UNION ALL
    
    -- ELEVENLABS (8)
    SELECT 'elevenlabs-v3' UNION ALL
    SELECT 'elevenlabs-multilingual-v1' UNION ALL
    SELECT 'elevenlabs-multilingual-v2' UNION ALL
    SELECT 'elevenlabs-english-v1' UNION ALL
    SELECT 'elevenlabs-turbo-v2' UNION ALL
    SELECT 'elevenlabs-turbo-v2.5' UNION ALL
    SELECT 'elevenlabs-flash' UNION ALL
    SELECT 'elevenlabs-flash-v2.5' UNION ALL
    
    -- PIAPI (15)
    SELECT 'piapi-hailuo' UNION ALL
    SELECT 'piapi-hunyuan' UNION ALL
    SELECT 'piapi-omnihuman' UNION ALL
    SELECT 'piapi-skyreels' UNION ALL
    SELECT 'piapi-wan21' UNION ALL
    SELECT 'piapi-midjourney' UNION ALL
    SELECT 'piapi-gpt-image' UNION ALL
    SELECT 'piapi-suno' UNION ALL
    SELECT 'piapi-diffrhythm' UNION ALL
    SELECT 'piapi-udio' UNION ALL
    SELECT 'piapi-moshi' UNION ALL
    SELECT 'piapi-f5-tts' UNION ALL
    SELECT 'piapi-mmaudio' UNION ALL
    SELECT 'piapi-acestep' UNION ALL
    SELECT 'piapi-faceswap' UNION ALL
    
    -- NEWPORTAI (40)
    SELECT 'newport-portrait' UNION ALL
    SELECT 'newport-clothing-matting' UNION ALL
    SELECT 'newport-human-matting' UNION ALL
    SELECT 'newport-ai-model' UNION ALL
    SELECT 'newport-ai-tryon' UNION ALL
    SELECT 'newport-remove-bg' UNION ALL
    SELECT 'newport-replace-bg' UNION ALL
    SELECT 'newport-enhance' UNION ALL
    SELECT 'newport-inpainting' UNION ALL
    SELECT 'newport-outpainting' UNION ALL
    SELECT 'newport-colorize' UNION ALL
    SELECT 'newport-erase' UNION ALL
    SELECT 'newport-doc-recognition' UNION ALL
    SELECT 'newport-remove-stripe' UNION ALL
    SELECT 'newport-remove-shadow' UNION ALL
    SELECT 'newport-swap-face' UNION ALL
    SELECT 'newport-restore-face' UNION ALL
    SELECT 'newport-pag-merge' UNION ALL
    SELECT 'newport-live-photo' UNION ALL
    SELECT 'newport-lipsync' UNION ALL
    SELECT 'newport-talking-image' UNION ALL
    SELECT 'newport-text-to-video' UNION ALL
    SELECT 'newport-image-to-video' UNION ALL
    SELECT 'newport-character-to-video' UNION ALL
    SELECT 'newport-template-to-video' UNION ALL
    SELECT 'newport-video-translate-lipsync' UNION ALL
    SELECT 'newport-video-translate-voice' UNION ALL
    SELECT 'newport-swap-face-video' UNION ALL
    SELECT 'newport-image-to-video-sonic' UNION ALL
    SELECT 'newport-text-to-video-wan2' UNION ALL
    SELECT 'newport-image-to-video-wan2' UNION ALL
    SELECT 'newport-voice-clone' UNION ALL
    SELECT 'newport-tts-clone' UNION ALL
    SELECT 'newport-tts-common' UNION ALL
    SELECT 'newport-tts-pro' UNION ALL
    SELECT 'newport-stt' UNION ALL
    SELECT 'newport-stt-pro' UNION ALL
    SELECT 'newport-video-matting' UNION ALL
    SELECT 'newport-composite-video' UNION ALL
    SELECT 'newport-credits'
)
SELECT 
    'TESTE DE VERIFICAÇÃO' as resultado,
    COUNT(DISTINCT em.id) as total_esperado,
    COUNT(DISTINCT ma.id) as total_encontrado,
    CASE 
        WHEN COUNT(DISTINCT em.id) = COUNT(DISTINCT ma.id) 
        THEN '✅ TODOS OS 85 MODELOS ESTÃO PRESENTES!' 
        ELSE '❌ FALTAM MODELOS!' 
    END as status
FROM expected_models em
LEFT JOIN media_apis ma ON em.id = ma.id AND ma.is_active = true;

-- 5. MOSTRAR QUAIS MODELOS ESTÃO FALTANDO (SE HOUVER)
WITH expected_models AS (
    -- LUMA (3)
    SELECT 'luma-ray2-flash' as id UNION ALL
    SELECT 'luma-ray2' UNION ALL
    SELECT 'luma-ray1.6' UNION ALL
    
    -- KLING (9)
    SELECT 'kling-1.0' UNION ALL
    SELECT 'kling-1.1' UNION ALL
    SELECT 'kling-1.2' UNION ALL
    SELECT 'kling-1.5' UNION ALL
    SELECT 'kling-1.6' UNION ALL
    SELECT 'kling-2.0' UNION ALL
    SELECT 'kling-2.1' UNION ALL
    SELECT 'kling-2.1-master' UNION ALL
    SELECT 'kling-professional' UNION ALL
    
    -- BFL (10)
    SELECT 'bfl-flux-schnell' UNION ALL
    SELECT 'bfl-flux-dev' UNION ALL
    SELECT 'bfl-flux-1.1-pro' UNION ALL
    SELECT 'bfl-flux-1.0-pro' UNION ALL
    SELECT 'bfl-flux-ultra' UNION ALL
    SELECT 'bfl-flux-raw' UNION ALL
    SELECT 'bfl-flux-fill' UNION ALL
    SELECT 'bfl-flux-depth' UNION ALL
    SELECT 'bfl-flux-canny' UNION ALL
    SELECT 'bfl-flux-redux' UNION ALL
    
    -- ELEVENLABS (8)
    SELECT 'elevenlabs-v3' UNION ALL
    SELECT 'elevenlabs-multilingual-v1' UNION ALL
    SELECT 'elevenlabs-multilingual-v2' UNION ALL
    SELECT 'elevenlabs-english-v1' UNION ALL
    SELECT 'elevenlabs-turbo-v2' UNION ALL
    SELECT 'elevenlabs-turbo-v2.5' UNION ALL
    SELECT 'elevenlabs-flash' UNION ALL
    SELECT 'elevenlabs-flash-v2.5' UNION ALL
    
    -- PIAPI (15)
    SELECT 'piapi-hailuo' UNION ALL
    SELECT 'piapi-hunyuan' UNION ALL
    SELECT 'piapi-omnihuman' UNION ALL
    SELECT 'piapi-skyreels' UNION ALL
    SELECT 'piapi-wan21' UNION ALL
    SELECT 'piapi-midjourney' UNION ALL
    SELECT 'piapi-gpt-image' UNION ALL
    SELECT 'piapi-suno' UNION ALL
    SELECT 'piapi-diffrhythm' UNION ALL
    SELECT 'piapi-udio' UNION ALL
    SELECT 'piapi-moshi' UNION ALL
    SELECT 'piapi-f5-tts' UNION ALL
    SELECT 'piapi-mmaudio' UNION ALL
    SELECT 'piapi-acestep' UNION ALL
    SELECT 'piapi-faceswap' UNION ALL
    
    -- NEWPORTAI (40)
    SELECT 'newport-portrait' UNION ALL
    SELECT 'newport-clothing-matting' UNION ALL
    SELECT 'newport-human-matting' UNION ALL
    SELECT 'newport-ai-model' UNION ALL
    SELECT 'newport-ai-tryon' UNION ALL
    SELECT 'newport-remove-bg' UNION ALL
    SELECT 'newport-replace-bg' UNION ALL
    SELECT 'newport-enhance' UNION ALL
    SELECT 'newport-inpainting' UNION ALL
    SELECT 'newport-outpainting' UNION ALL
    SELECT 'newport-colorize' UNION ALL
    SELECT 'newport-erase' UNION ALL
    SELECT 'newport-doc-recognition' UNION ALL
    SELECT 'newport-remove-stripe' UNION ALL
    SELECT 'newport-remove-shadow' UNION ALL
    SELECT 'newport-swap-face' UNION ALL
    SELECT 'newport-restore-face' UNION ALL
    SELECT 'newport-pag-merge' UNION ALL
    SELECT 'newport-live-photo' UNION ALL
    SELECT 'newport-lipsync' UNION ALL
    SELECT 'newport-talking-image' UNION ALL
    SELECT 'newport-text-to-video' UNION ALL
    SELECT 'newport-image-to-video' UNION ALL
    SELECT 'newport-character-to-video' UNION ALL
    SELECT 'newport-template-to-video' UNION ALL
    SELECT 'newport-video-translate-lipsync' UNION ALL
    SELECT 'newport-video-translate-voice' UNION ALL
    SELECT 'newport-swap-face-video' UNION ALL
    SELECT 'newport-image-to-video-sonic' UNION ALL
    SELECT 'newport-text-to-video-wan2' UNION ALL
    SELECT 'newport-image-to-video-wan2' UNION ALL
    SELECT 'newport-voice-clone' UNION ALL
    SELECT 'newport-tts-clone' UNION ALL
    SELECT 'newport-tts-common' UNION ALL
    SELECT 'newport-tts-pro' UNION ALL
    SELECT 'newport-stt' UNION ALL
    SELECT 'newport-stt-pro' UNION ALL
    SELECT 'newport-video-matting' UNION ALL
    SELECT 'newport-composite-video' UNION ALL
    SELECT 'newport-credits'
)
SELECT 
    'MODELO FALTANDO:' as status,
    em.id as modelo_esperado
FROM expected_models em
LEFT JOIN media_apis ma ON em.id = ma.id AND ma.is_active = true
WHERE ma.id IS NULL;

-- 6. VERIFICAR INTEGRIDADE DAS TABELAS RELACIONADAS
SELECT 
    'INTEGRIDADE DOS DADOS' as verificacao,
    (SELECT COUNT(*) FROM media_apis WHERE is_active = true) as apis,
    (SELECT COUNT(DISTINCT api_id) FROM media_formats) as apis_com_formats,
    (SELECT COUNT(DISTINCT api_id) FROM media_pricing) as apis_com_pricing,
    (SELECT COUNT(DISTINCT api_id) FROM media_aspect_ratios) as apis_com_ratios,
    CASE 
        WHEN (SELECT COUNT(*) FROM media_apis WHERE is_active = true) = 
             (SELECT COUNT(DISTINCT api_id) FROM media_pricing)
        THEN '✅ Todas APIs têm preços'
        ELSE '❌ Faltam preços para algumas APIs'
    END as status_pricing;

-- 7. TESTE SIMPLES E DIRETO - CONTA CADA PROVIDER
SELECT 
    'CONTAGEM POR PROVIDER' as teste,
    SUM(CASE WHEN provider = 'luma' THEN 1 ELSE 0 END) as luma_deve_ser_3,
    SUM(CASE WHEN provider = 'kling' THEN 1 ELSE 0 END) as kling_deve_ser_9,
    SUM(CASE WHEN provider = 'bfl' THEN 1 ELSE 0 END) as bfl_deve_ser_10,
    SUM(CASE WHEN provider = 'elevenlabs' THEN 1 ELSE 0 END) as elevenlabs_deve_ser_8,
    SUM(CASE WHEN provider = 'piapi' THEN 1 ELSE 0 END) as piapi_deve_ser_15,
    SUM(CASE WHEN provider = 'newportai' THEN 1 ELSE 0 END) as newportai_deve_ser_40,
    COUNT(*) as total_deve_ser_85
FROM media_apis
WHERE is_active = true;