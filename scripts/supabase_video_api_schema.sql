-- Schema para Sistema de APIs de Vídeo
-- Este arquivo cria todas as tabelas necessárias para o sistema dinâmico

-- 1. Tabela de APIs disponíveis
CREATE TABLE IF NOT EXISTS video_apis (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('luma', 'kling')),
  model TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  min_duration INTEGER NOT NULL,
  max_duration INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  limitations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de formatos/resoluções
CREATE TABLE IF NOT EXISTS video_formats (
  id SERIAL PRIMARY KEY,
  api_id TEXT NOT NULL REFERENCES video_apis(id) ON DELETE CASCADE,
  format_value TEXT NOT NULL, -- '540p', '720p', '1080p', '4k'
  format_label TEXT NOT NULL, -- 'HD 720p (1280×720)'
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de preços por combinação
CREATE TABLE IF NOT EXISTS video_pricing (
  id SERIAL PRIMARY KEY,
  api_id TEXT NOT NULL REFERENCES video_apis(id) ON DELETE CASCADE,
  format_value TEXT NOT NULL,
  duration INTEGER NOT NULL, -- em segundos
  credits INTEGER NOT NULL,
  api_cost DECIMAL(10, 4) NOT NULL,
  margin_percent DECIMAL(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN api_cost > 0 THEN ((credits * 0.005625 - api_cost) / api_cost * 100)
      ELSE 0 
    END
  ) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(api_id, format_value, duration)
);

-- 4. Tabela de aspect ratios suportados
CREATE TABLE IF NOT EXISTS video_aspect_ratios (
  id SERIAL PRIMARY KEY,
  api_id TEXT NOT NULL REFERENCES video_apis(id) ON DELETE CASCADE,
  ratio TEXT NOT NULL, -- '16:9', '1:1', '9:16'
  label TEXT NOT NULL, -- 'Paisagem', 'Quadrado', 'Retrato'
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de features especiais (futuro)
CREATE TABLE IF NOT EXISTS video_features (
  id TEXT PRIMARY KEY,
  api_id TEXT REFERENCES video_apis(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  feature_type TEXT NOT NULL, -- 'audio', 'upscale', 'lip_sync'
  credits_per_unit INTEGER NOT NULL,
  api_cost_per_unit DECIMAL(10, 4) NOT NULL,
  unit_type TEXT NOT NULL, -- 'second', 'operation'
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_video_formats_api_id ON video_formats(api_id);
CREATE INDEX idx_video_pricing_api_format ON video_pricing(api_id, format_value);
CREATE INDEX idx_video_pricing_active ON video_pricing(is_active) WHERE is_active = true;
CREATE INDEX idx_video_apis_active ON video_apis(is_active) WHERE is_active = true;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_apis_updated_at BEFORE UPDATE ON video_apis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_pricing_updated_at BEFORE UPDATE ON video_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE video_apis IS 'APIs de geração de vídeo disponíveis (Luma, Kling, etc)';
COMMENT ON TABLE video_formats IS 'Formatos/resoluções suportados por cada API';
COMMENT ON TABLE video_pricing IS 'Preços em créditos por combinação de API, formato e duração';
COMMENT ON TABLE video_aspect_ratios IS 'Proporções de tela suportadas por cada API';
COMMENT ON TABLE video_features IS 'Features adicionais como áudio, upscaling, lip sync';

-- Função para validar margem mínima
CREATE OR REPLACE FUNCTION validate_minimum_margin()
RETURNS TRIGGER AS $$
DECLARE
  min_credit_value DECIMAL := 0.005625; -- $90/16000
  revenue DECIMAL;
  margin DECIMAL;
BEGIN
  revenue := NEW.credits * min_credit_value;
  margin := ((revenue - NEW.api_cost) / NEW.api_cost) * 100;
  
  IF margin < 100 THEN
    RAISE EXCEPTION 'Margem insuficiente: %. Mínimo necessário: 100%%', margin;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_minimum_margin 
BEFORE INSERT OR UPDATE ON video_pricing
FOR EACH ROW EXECUTE FUNCTION validate_minimum_margin();