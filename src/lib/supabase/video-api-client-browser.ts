// Cliente TypeScript para interagir com as tabelas de APIs de vídeo no Supabase (versão browser)

import { createClient } from '@supabase/supabase-js';

// Types (reutilizando do arquivo principal)
export type { VideoAPI, VideoFormat, VideoPricing, VideoAPIOption } from './video-api-client';

// Cliente Supabase para browser (usa apenas anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Classe para gerenciar APIs de vídeo (versão browser)
export class VideoAPIClient {
  // Buscar todas as opções de uma vez (para carregar a interface)
  static async getAllVideoOptions() {
    const { data: apis, error: apisError } = await supabase
      .from('video_apis')
      .select(`
        id,
        name,
        provider,
        model,
        description,
        icon,
        features,
        limitations,
        video_formats!inner(
          format_value,
          format_label,
          width,
          height,
          aspect_ratio
        )
      `)
      .eq('is_active', true)
      .eq('video_formats.is_active', true);

    if (apisError) throw apisError;
    if (!apis) return [];

    // Para cada API, buscar os preços
    const options: any[] = [];
    
    for (const api of apis) {
      const formats: any[] = [];
      
      // Agrupar formatos únicos
      const uniqueFormats = new Map();
      for (const format of (api as any).video_formats) {
        if (!uniqueFormats.has(format.format_value)) {
          uniqueFormats.set(format.format_value, format);
        }
      }

      // Para cada formato, buscar durações e preços
      for (const [formatValue, format] of uniqueFormats) {
        const { data: pricingData } = await supabase
          .from('video_pricing')
          .select('duration, credits, api_cost')
          .eq('api_id', api.id)
          .eq('format_value', formatValue)
          .eq('is_active', true)
          .order('duration');

        formats.push({
          ...format,
          durations: pricingData || []
        });
      }

      options.push({
        api_id: api.id,
        api_name: api.name,
        provider: api.provider,
        model: api.model,
        description: api.description,
        icon: api.icon,
        features: api.features || [],
        limitations: api.limitations || [],
        formats
      });
    }

    return options;
  }

  // Validar se uma combinação é válida
  static async isValidCombination(
    apiId: string,
    formatValue: string,
    duration: number
  ): Promise<boolean> {
    const { count, error } = await supabase
      .from('video_pricing')
      .select('*', { count: 'exact', head: true })
      .eq('api_id', apiId)
      .eq('format_value', formatValue)
      .eq('duration', duration)
      .eq('is_active', true);

    if (error) return false;
    return (count || 0) > 0;
  }
}