-- Queries úteis para o sistema de APIs de vídeo

-- 1. Query para buscar todas as APIs ativas
SELECT 
  id,
  name,
  provider,
  model,
  description,
  icon,
  min_duration,
  max_duration,
  features,
  limitations
FROM video_apis
WHERE is_active = true
ORDER BY provider, name;

-- 2. Query para buscar formatos de uma API específica
SELECT 
  format_value,
  format_label,
  width,
  height,
  aspect_ratio
FROM video_formats
WHERE api_id = 'luma-ray2' -- substituir pelo ID desejado
  AND is_active = true
ORDER BY width;

-- 3. Query para buscar durações disponíveis para uma combinação API + formato
SELECT DISTINCT
  duration
FROM video_pricing
WHERE api_id = 'luma-ray2' -- substituir pelo ID desejado
  AND format_value = '1080p' -- substituir pelo formato desejado
  AND is_active = true
ORDER BY duration;

-- 4. Query para buscar preço de uma combinação específica
SELECT 
  credits,
  api_cost,
  margin_percent
FROM video_pricing
WHERE api_id = 'kling-professional'
  AND format_value = '4k'
  AND duration = 60
  AND is_active = true;

-- 5. Query completa para interface (busca tudo de uma vez)
WITH api_data AS (
  SELECT 
    a.id as api_id,
    a.name as api_name,
    a.provider,
    a.model,
    a.description,
    a.icon,
    a.features,
    a.limitations,
    f.format_value,
    f.format_label,
    f.width,
    f.height,
    p.duration,
    p.credits,
    p.api_cost,
    p.margin_percent
  FROM video_apis a
  JOIN video_formats f ON a.id = f.api_id
  JOIN video_pricing p ON a.id = p.api_id AND f.format_value = p.format_value
  WHERE a.is_active = true 
    AND f.is_active = true 
    AND p.is_active = true
)
SELECT 
  api_id,
  api_name,
  provider,
  model,
  description,
  icon,
  features,
  limitations,
  json_agg(
    json_build_object(
      'format_value', format_value,
      'format_label', format_label,
      'width', width,
      'height', height,
      'durations', (
        SELECT json_agg(
          json_build_object(
            'duration', duration,
            'credits', credits,
            'api_cost', api_cost
          ) ORDER BY duration
        )
        FROM api_data ad2
        WHERE ad2.api_id = ad.api_id 
          AND ad2.format_value = ad.format_value
      )
    )
  ) as formats
FROM api_data ad
GROUP BY api_id, api_name, provider, model, description, icon, features, limitations
ORDER BY provider, api_name;

-- 6. Query para validar se uma combinação é válida
SELECT EXISTS (
  SELECT 1
  FROM video_pricing
  WHERE api_id = 'kling-professional'
    AND format_value = '4k'
    AND duration = 120
    AND is_active = true
) as is_valid_combination;

-- 7. Query para encontrar a opção mais barata para uma necessidade
SELECT 
  a.id as api_id,
  a.name as api_name,
  f.format_value,
  p.duration,
  p.credits,
  p.api_cost
FROM video_apis a
JOIN video_formats f ON a.id = f.api_id
JOIN video_pricing p ON a.id = p.api_id AND f.format_value = p.format_value
WHERE a.is_active = true 
  AND f.is_active = true 
  AND p.is_active = true
  AND f.format_value IN ('1080p', '4k') -- resolução mínima desejada
  AND p.duration >= 10 -- duração mínima desejada
ORDER BY p.credits ASC
LIMIT 1;

-- 8. View materializada para performance (opcional)
CREATE MATERIALIZED VIEW IF NOT EXISTS video_api_options AS
SELECT 
  a.id as api_id,
  a.name as api_name,
  a.provider,
  a.model,
  a.description,
  a.icon,
  f.format_value,
  f.format_label,
  f.width,
  f.height,
  f.aspect_ratio,
  p.duration,
  p.credits,
  p.api_cost,
  p.margin_percent
FROM video_apis a
JOIN video_formats f ON a.id = f.api_id
JOIN video_pricing p ON a.id = p.api_id AND f.format_value = p.format_value
WHERE a.is_active = true 
  AND f.is_active = true 
  AND p.is_active = true
WITH DATA;

-- Índice na view para melhor performance
CREATE INDEX idx_video_api_options_lookup 
ON video_api_options(api_id, format_value, duration);

-- Refresh da view (executar periodicamente ou após mudanças)
REFRESH MATERIALIZED VIEW video_api_options;