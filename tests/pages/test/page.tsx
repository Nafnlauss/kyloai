export default function TestPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Teste de CSS</h1>
      
      <div className="space-y-4">
        <div className="bg-red-500 text-white p-4 rounded">
          Box vermelho com Tailwind
        </div>
        
        <div className="bg-green-500 text-white p-4 rounded">
          Box verde com Tailwind
        </div>
        
        <div className="border-2 border-blue-500 p-4 rounded">
          Box com borda azul
        </div>
        
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Botão Tailwind
        </button>
        
        <div style={{ backgroundColor: 'purple', color: 'white', padding: '16px', borderRadius: '8px' }}>
          Box roxo com estilo inline (sem Tailwind)
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Informações de Debug:</h2>
        <ul className="list-disc list-inside">
          <li>Se você vê cores apenas no box roxo = Tailwind não está funcionando</li>
          <li>Se você vê todas as cores = Tailwind está funcionando</li>
          <li>Se não vê nenhuma formatação = CSS não está carregando</li>
        </ul>
      </div>
    </div>
  )
}