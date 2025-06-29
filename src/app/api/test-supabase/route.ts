import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Supabase credentials not configured',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Tenta fazer uma query simples
    const { data, error } = await supabase
      .from('video_apis')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        error: 'Database query failed',
        details: error.message,
        hint: 'Please run the SQL scripts in Supabase first'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      supabaseUrl
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: 'Server error',
      details: error.message
    }, { status: 500 });
  }
}