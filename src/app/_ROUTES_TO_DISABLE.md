# Rotas para Desativar (Comentar)

## ✅ Rotas que DEVEM permanecer ATIVAS:
- `/` - Landing page principal
- `/studio/*` - Área principal após login (vídeo, áudio, imagem, create, history)
- `/demo-video` - Demo oficial de vídeo
- `/demo-audio` - Demo oficial de áudio  
- `/demo-image` - Demo oficial de imagem
- `/(auth)/*` - Login, registro, reset
- `/(dashboard)/*` - Dashboard, billing, settings
- `/admin/*` - Área administrativa
- `/api/*` - Todas as APIs
- `/pricing` - Página de preços
- `/about` - Sobre
- `/contact` - Contato
- `/terms` - Termos
- `/privacy` - Privacidade
- `/credits/packs` - Pacotes de créditos

## ❌ Rotas para COMENTAR/DESATIVAR:
- `/demo` - Demo antiga
- `/demo85` - Demo com 85 modelos
- `/demos` - Lista de demos
- `/test-video` - Teste de vídeo
- `/generate` - Página antiga de geração (dentro de dashboard)
- `/gallery` - Galeria (dentro de dashboard)
- `/videos` - Página de vídeos
- `/hello` - Página de teste
- `/landing` - Landing alternativa
- `/landing-complete` - Landing completa
- `/page-original.tsx` - Página original backup
- `/membership` - Membership
- `/pricing-new` - Pricing novo
- `/pricing/test` - Teste de pricing
- `/diagnostics` - Diagnósticos
- `/oauth-diagnostic` - Diagnóstico OAuth
- `/health` - Health check (manter apenas API)
- `/plans` - Plans (vazio)

## 📝 Como comentar:
1. Renomear pastas adicionando prefixo `_disabled_`
2. Ou mover para pasta `_archived/`
3. Ou adicionar arquivo `.disabled` dentro da pasta