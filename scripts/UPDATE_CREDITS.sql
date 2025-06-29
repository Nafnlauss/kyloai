-- ============================================
-- ATUALIZAR CRÉDITOS DOS PLANOS
-- Execute este script no Supabase SQL Editor
-- ============================================

-- Atualizar os créditos para os valores corretos
UPDATE "Plan" 
SET credits = 300,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE name = 'free';

UPDATE "Plan" 
SET credits = 1000,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE name = 'lite';

UPDATE "Plan" 
SET credits = 4000,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE name = 'creator';

UPDATE "Plan" 
SET credits = 12000,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE name = 'professional';

-- Verificar se foi atualizado corretamente
SELECT 
    name,
    "displayName",
    credits,
    "priceMonthly",
    "priceYearly"
FROM "Plan"
ORDER BY 
    CASE name
        WHEN 'free' THEN 1
        WHEN 'lite' THEN 2
        WHEN 'creator' THEN 3
        WHEN 'professional' THEN 4
    END;

-- ============================================
-- RESULTADO ESPERADO:
-- free         | Free         | 300    | 0  | 0
-- lite         | Lite         | 1000   | 12 | 120
-- creator      | Creator      | 4000   | 29 | 290
-- professional | Professional | 12000  | 79 | 790
-- ============================================