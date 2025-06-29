-- ====================================
-- CORREÇÃO DA MARGEM DE LUCRO
-- ====================================

-- O problema: a margem está sendo calculada incorretamente
-- Atualmente: 0.45% quando deveria ser 100%+

-- Análise do problema:
-- Custo da API: $16.80 (para Kling 2.1 Master 8K)
-- Créditos cobrados: 6000
-- Receita: 6000 * $0.005625 = $33.75
-- Lucro: $33.75 - $16.80 = $16.95
-- Margem correta: ($16.95 / $16.80) * 100 = 100.89%

-- Mas no cálculo atual está usando $0.0028125 (metade do valor correto)
-- Isso porque $0.0028125 é o CUSTO MÁXIMO, não o PREÇO DE VENDA

-- CORREÇÃO: Usar o preço de venda correto
-- Preço por crédito = $90 / 16000 = $0.005625

-- Query corrigida para verificar margem:
SELECT 
    ma.name,
    ma.provider,
    mp.format_value,
    mp.duration,
    mp.credits,
    mp.api_cost,
    ROUND(mp.credits * 0.005625, 4) as revenue_per_use,
    ROUND(((mp.credits * 0.005625 - mp.api_cost) / mp.api_cost) * 100, 2) as margin_percent
FROM media_apis ma
JOIN media_pricing mp ON ma.id = mp.api_id
WHERE mp.credits > 1000
ORDER BY mp.credits DESC
LIMIT 10;

-- ====================================
-- ATUALIZAR TODOS OS CRÉDITOS
-- ====================================

-- Como a margem está muito baixa, precisamos dobrar os créditos
-- Fórmula correta: credits = CEIL(api_cost / 0.0028125)

UPDATE media_pricing
SET credits = CEIL(api_cost / 0.0028125)
WHERE api_cost > 0;

-- Verificar novamente após correção:
SELECT 
    ma.name,
    ma.provider,
    mp.format_value,
    mp.duration,
    mp.credits,
    mp.api_cost,
    ROUND(mp.credits * 0.005625, 4) as revenue_per_use,
    ROUND(((mp.credits * 0.005625 - mp.api_cost) / mp.api_cost) * 100, 2) as margin_percent
FROM media_apis ma
JOIN media_pricing mp ON ma.id = mp.api_id
WHERE mp.credits > 1000
ORDER BY mp.credits DESC
LIMIT 10;