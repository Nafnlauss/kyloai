import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const possibleEnvFiles = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.production.local',
    '../.env',
    '../.env.production',
    '../../.env',
    '../../.env.production'
  ];
  
  const results = possibleEnvFiles.map(file => {
    try {
      const fullPath = path.join(process.cwd(), file);
      const exists = fs.existsSync(fullPath);
      
      if (exists) {
        const stats = fs.statSync(fullPath);
        // Não lê o conteúdo por segurança, apenas verifica
        return {
          file,
          exists: true,
          size: stats.size,
          modified: stats.mtime
        };
      }
      
      return { file, exists: false };
    } catch (error) {
      return { file, exists: false, error: 'access denied' };
    }
  });
  
  return NextResponse.json({
    cwd: process.cwd(),
    envFiles: results,
    suggestion: 'Se nenhum arquivo .env foi encontrado, as variáveis devem ser configuradas no sistema ou no serviço de hospedagem'
  });
}