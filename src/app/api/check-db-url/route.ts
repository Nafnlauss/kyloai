import { NextResponse } from 'next/server'

export async function GET() {
  // Import para garantir que a config seja carregada
  await import('@/lib/database-config');
  
  const dbUrl = process.env.DATABASE_URL || 'NOT SET';
  const directUrl = process.env.DIRECT_URL || 'NOT SET';
  
  // Hide sensitive parts but show structure
  const sanitizeUrl = (url: string) => {
    if (!url || url === 'NOT SET') return url;
    
    try {
      // Check for common issues
      const hasSpaces = url.includes(' ');
      const hasNewlines = url.includes('\n') || url.includes('\r');
      const hasTabs = url.includes('\t');
      
      // Parse URL parts
      const matches = url.match(/^(postgresql:\/\/)([^:]+):([^@]+)@([^\/]+)\/(.+)$/);
      
      if (matches) {
        const [, protocol, user, , host, database] = matches;
        return {
          structure: `${protocol}${user}:***@${host}/${database}`,
          hasSpaces,
          hasNewlines,
          hasTabs,
          length: url.length,
          startsWithPostgresql: url.startsWith('postgresql://'),
          endsWithSslmode: url.includes('sslmode='),
          hasSpecialChars: /[^\x20-\x7E]/.test(url) // non-printable chars
        };
      }
      
      return {
        error: 'Invalid URL format',
        hasSpaces,
        hasNewlines,
        hasTabs,
        length: url.length
      };
    } catch (error) {
      return {
        error: 'Failed to parse URL',
        message: error.message
      };
    }
  };
  
  return NextResponse.json({
    DATABASE_URL: sanitizeUrl(dbUrl),
    DIRECT_URL: sanitizeUrl(directUrl),
    tip: 'Check for spaces, newlines, or special characters in your DATABASE_URL'
  });
}