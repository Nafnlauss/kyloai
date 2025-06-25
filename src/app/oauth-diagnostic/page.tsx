'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSession, signIn, signOut } from 'next-auth/react'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'warning' | 'pending'
  message: string
  details?: any
}

export default function OAuthDiagnosticPage() {
  const { data: session, status } = useSession()
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)
  const [rawLogs, setRawLogs] = useState<string[]>([])

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result])
  }

  const addLog = (log: string) => {
    setRawLogs(prev => [...prev, `[${new Date().toISOString()}] ${log}`])
  }

  // Teste 1: Verificar variáveis de ambiente
  const checkEnvVariables = async () => {
    addLog('Iniciando verificação de variáveis de ambiente...')
    try {
      const res = await fetch('/api/oauth-diagnostic/env-check')
      const data = await res.json()
      
      addResult({
        test: 'Variáveis de Ambiente',
        status: data.allSet ? 'success' : 'error',
        message: data.allSet ? 'Todas as variáveis estão configuradas' : 'Variáveis faltando',
        details: data
      })
    } catch (error) {
      addResult({
        test: 'Variáveis de Ambiente',
        status: 'error',
        message: 'Erro ao verificar variáveis',
        details: error
      })
    }
  }

  // Teste 2: Verificar conexão com banco
  const checkDatabase = async () => {
    addLog('Verificando conexão com banco de dados...')
    try {
      const res = await fetch('/api/oauth-diagnostic/db-check')
      const data = await res.json()
      
      addResult({
        test: 'Conexão com Banco',
        status: data.connected ? 'success' : 'error',
        message: data.message,
        details: data
      })
    } catch (error) {
      addResult({
        test: 'Conexão com Banco',
        status: 'error',
        message: 'Erro ao conectar com banco',
        details: error
      })
    }
  }

  // Teste 3: Verificar configuração NextAuth
  const checkNextAuthConfig = async () => {
    addLog('Verificando configuração NextAuth...')
    try {
      const res = await fetch('/api/oauth-diagnostic/nextauth-check')
      const data = await res.json()
      
      addResult({
        test: 'Configuração NextAuth',
        status: data.valid ? 'success' : 'error',
        message: data.message,
        details: data
      })
    } catch (error) {
      addResult({
        test: 'Configuração NextAuth',
        status: 'error',
        message: 'Erro ao verificar NextAuth',
        details: error
      })
    }
  }

  // Teste 4: Verificar sessão atual
  const checkSession = async () => {
    addLog('Verificando sessão atual...')
    try {
      const res = await fetch('/api/oauth-diagnostic/session-check')
      const data = await res.json()
      
      addResult({
        test: 'Sessão Atual',
        status: data.authenticated ? 'success' : 'warning',
        message: data.authenticated ? 'Usuário autenticado' : 'Nenhuma sessão ativa',
        details: data
      })
    } catch (error) {
      addResult({
        test: 'Sessão Atual',
        status: 'error',
        message: 'Erro ao verificar sessão',
        details: error
      })
    }
  }

  // Teste 5: Verificar contas vinculadas
  const checkLinkedAccounts = async () => {
    addLog('Verificando contas vinculadas...')
    try {
      const res = await fetch('/api/oauth-diagnostic/accounts-check')
      const data = await res.json()
      
      addResult({
        test: 'Contas Vinculadas',
        status: data.hasIssues ? 'warning' : 'success',
        message: data.message,
        details: data
      })
    } catch (error) {
      addResult({
        test: 'Contas Vinculadas',
        status: 'error',
        message: 'Erro ao verificar contas',
        details: error
      })
    }
  }

  // Teste 6: Teste de login simulado
  const testOAuthFlow = async () => {
    addLog('Iniciando teste de fluxo OAuth...')
    try {
      const res = await fetch('/api/oauth-diagnostic/flow-test')
      const data = await res.json()
      
      addResult({
        test: 'Fluxo OAuth',
        status: data.success ? 'success' : 'error',
        message: data.message,
        details: data
      })
    } catch (error) {
      addResult({
        test: 'Fluxo OAuth',
        status: 'error',
        message: 'Erro ao testar fluxo',
        details: error
      })
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    setResults([])
    setRawLogs([])
    
    addLog('=== INICIANDO DIAGNÓSTICO COMPLETO ===')
    
    await checkEnvVariables()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await checkDatabase()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await checkNextAuthConfig()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await checkSession()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await checkLinkedAccounts()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testOAuthFlow()
    
    addLog('=== DIAGNÓSTICO COMPLETO ===')
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      default: return '⏳'
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Diagnóstico OAuth Google</h1>
      
      {/* Status da Sessão */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status da Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Autenticado:</strong> {session ? 'Sim' : 'Não'}</p>
            {session && (
              <>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Nome:</strong> {session.user?.name}</p>
                <p><strong>ID:</strong> {session.user?.id}</p>
              </>
            )}
          </div>
          
          <div className="mt-4 space-x-2">
            {!session ? (
              <Button 
                onClick={() => {
                  addLog('Iniciando login com Google...')
                  signIn('google')
                }}
              >
                Login com Google
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  addLog('Fazendo logout...')
                  signOut()
                }} 
                variant="destructive"
              >
                Logout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controles de Teste */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Testes de Diagnóstico</CardTitle>
          <CardDescription>
            Execute todos os testes para identificar problemas com OAuth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runAllTests} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Executando testes...' : 'Executar Todos os Testes'}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados dos Testes */}
      {results.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resultados dos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span>{getStatusIcon(result.status)}</span>
                      {result.test}
                    </h3>
                    <span className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                  {result.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:underline">
                        Ver detalhes
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs Brutos */}
      {rawLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logs de Execução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-auto max-h-96">
              {rawLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Alert className="mt-6">
        <AlertDescription>
          <strong>Como usar:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Execute todos os testes para identificar problemas</li>
            <li>Verifique os resultados e detalhes de cada teste</li>
            <li>Tente fazer login com Google após corrigir problemas identificados</li>
            <li>Os logs mostram exatamente o que está acontecendo em cada etapa</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  )
}