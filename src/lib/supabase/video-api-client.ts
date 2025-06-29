// Cliente TypeScript para interagir com as tabelas de APIs de vídeo no Supabase

import { createClient } from '@supabase/supabase-js';

// Types
export interface VideoAPI {
  id: string;
  name: string;
  provider: 'luma' | 'kling';
  model: string;
  description: string;
  icon?: string;
  min_duration: number;
  max_duration: number;
  features: string[];
  limitations: string[];
}

export interface VideoFormat {
  format_value: string;
  format_label: string;
  width: number;
  height: number;
  aspect_ratio: string;
}

export interface VideoPricing {
  duration: number;
  credits: number;
  api_cost: number;
  margin_percent?: number;
}

export interface VideoAPIOption {
  api_id: string;
  api_name: string;
  provider: string;
  model: string;
  description: string;
  icon?: string;
  features: string[];
  limitations: string[];
  formats: {
    format_value: string;
    format_label: string;
    width: number;
    height: number;
    durations: VideoPricing[];
  }[];
}

// Cliente Supabase - criado sob demanda para evitar erros no cliente
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseAdmin;
}

// Classe para gerenciar APIs de vídeo
export class VideoAPIClient {
  // Buscar todas as APIs ativas
  static async getActiveAPIs(): Promise<VideoAPI[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('video_apis')
      .select('*')
      .eq('is_active', true)
      .order('provider')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Buscar formatos de uma API específica
  static async getFormatsForAPI(apiId: string): Promise<VideoFormat[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('video_formats')
      .select('format_value, format_label, width, height, aspect_ratio')
      .eq('api_id', apiId)
      .eq('is_active', true)
      .order('width');

    if (error) throw error;
    return data || [];
  }

  // Buscar durações disponíveis para uma combinação
  static async getAvailableDurations(
    apiId: string, 
    formatValue: string
  ): Promise<number[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('video_pricing')
      .select('duration')
      .eq('api_id', apiId)
      .eq('format_value', formatValue)
      .eq('is_active', true)
      .order('duration');

    if (error) throw error;
    return data?.map(item => item.duration) || [];
  }

  // Buscar preço de uma combinação específica
  static async getPricing(
    apiId: string,
    formatValue: string,
    duration: number
  ): Promise<VideoPricing | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('video_pricing')
      .select('credits, api_cost, margin_percent')
      .eq('api_id', apiId)
      .eq('format_value', formatValue)
      .eq('duration', duration)
      .eq('is_active', true)
      .single();

    if (error) return null;
    
    return {
      duration,
      credits: data.credits,
      api_cost: data.api_cost,
      margin_percent: data.margin_percent
    };
  }

  // Buscar todas as opções de uma vez (para carregar a interface)
  static async getAllVideoOptions(): Promise<VideoAPIOption[]> {
    const { data: apis, error: apisError } = await getSupabaseAdmin()
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
    const options: VideoAPIOption[] = [];
    
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
        const { data: pricingData } = await getSupabaseAdmin()
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
    const { count, error } = await getSupabaseAdmin()
      .from('video_pricing')
      .select('*', { count: 'exact', head: true })
      .eq('api_id', apiId)
      .eq('format_value', formatValue)
      .eq('duration', duration)
      .eq('is_active', true);

    if (error) return false;
    return (count || 0) > 0;
  }

  // Encontrar opção mais barata para uma necessidade
  static async findCheapestOption(
    minResolution: string,
    minDuration: number,
    preferredProvider?: 'luma' | 'kling'
  ): Promise<{
    api_id: string;
    api_name: string;
    format_value: string;
    duration: number;
    credits: number;
    api_cost: number;
  } | null> {
    // Determinar resoluções que atendem o mínimo
    const resolutionHierarchy = ['540p', '720p', '1080p', '4k'];
    const minIndex = resolutionHierarchy.indexOf(minResolution);
    const acceptableResolutions = resolutionHierarchy.slice(minIndex);

    let query = supabaseAdmin
      .from('video_pricing')
      .select(`
        api_id,
        format_value,
        duration,
        credits,
        api_cost,
        video_apis!inner(name, provider)
      `)
      .in('format_value', acceptableResolutions)
      .gte('duration', minDuration)
      .eq('is_active', true)
      .eq('video_apis.is_active', true)
      .order('credits', { ascending: true })
      .limit(1);

    if (preferredProvider) {
      query = query.eq('video_apis.provider', preferredProvider);
    }

    const { data, error } = await query.single();

    if (error || !data) return null;

    return {
      api_id: data.api_id,
      api_name: (data.video_apis as any).name,
      format_value: data.format_value,
      duration: data.duration,
      credits: data.credits,
      api_cost: data.api_cost
    };
  }

  // Buscar aspect ratios suportados
  static async getAspectRatios(apiId: string): Promise<{
    ratio: string;
    label: string;
    is_default: boolean;
  }[]> {
    const { data, error } = await getSupabaseAdmin()
      .from('video_aspect_ratios')
      .select('ratio, label, is_default')
      .eq('api_id', apiId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}