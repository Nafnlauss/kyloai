'use client'

import { useState } from 'react'

export default function TestPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Teste do Seletor</h1>
      
      <div className="space-y-4">
        <p>Estado atual: {isYearly ? 'ANUAL' : 'MENSAL'}</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => {
              console.log('Botão Mensal clicado')
              setIsYearly(false)
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Definir MENSAL
          </button>
          
          <button 
            onClick={() => {
              console.log('Botão Anual clicado')
              setIsYearly(true)
            }}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Definir ANUAL
          </button>
        </div>
        
        <div>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={isYearly}
              onChange={(e) => {
                console.log('Checkbox mudou para:', e.target.checked)
                setIsYearly(e.target.checked)
              }}
            />
            <span>Anual (checkbox)</span>
          </label>
        </div>
      </div>
    </div>
  )
}