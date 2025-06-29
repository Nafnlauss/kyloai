'use client';

export default function TestVideoPage() {
  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-3xl font-bold mb-6">Teste - Geração de Vídeo</h1>
      
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">⚠️ Atenção:</p>
        <p>Para funcionar, você precisa primeiro executar os SQLs no Supabase Dashboard.</p>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={() => window.location.href = '/videos'}
          className="w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir para Interface de Geração
        </button>
        
        <button 
          onClick={() => fetch('/api/test-supabase').then(r => r.json()).then(console.log)}
          className="w-full p-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Testar Conexão Supabase (ver console)
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Status:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>✅ Arquivos TypeScript criados</li>
          <li>✅ Componente React criado</li>
          <li>✅ Credenciais Supabase configuradas</li>
          <li>⏳ Aguardando execução dos SQLs no Supabase</li>
        </ul>
      </div>
    </div>
  );
}