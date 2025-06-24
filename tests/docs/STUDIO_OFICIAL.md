# STUDIO OFICIAL - KYLO

## ⚠️ AVISO IMPORTANTE ⚠️

**ESTA É A INTERFACE OFICIAL DO STUDIO DO PROJETO KYLO**

### 🚫 NÃO ALTERAR SEM AUTORIZAÇÃO

Este arquivo documenta a versão oficial da interface do Studio (pós-login) do Kylo.

**REGRAS:**
1. ❌ **NÃO MODIFICAR** esta estrutura sem autorização expressa do proprietário
2. ❌ **NÃO SOBRESCREVER** com outras versões
3. ❌ **NÃO REMOVER** elementos sem permissão
4. ✅ **APENAS ALTERAÇÕES AUTORIZADAS** pelo proprietário do projeto

---

## 📍 Localização

Os arquivos do Studio oficial estão em:
```
/src/app/studio/layout.tsx      - Layout com sidebar minimalista
/src/app/studio/video/page.tsx  - Página principal de criação de vídeos
```

## 🎯 Estrutura do Studio (Pós-Login)

### Layout Geral
- Fundo escuro (#0a0a0a) - Estilo Hedra
- Interface minimalista e limpa

### Sidebar Esquerda (Ultra Minimalista)
- Largura: 48px (w-12)
- Apenas ícones, sem texto
- Ícones em cinza escuro (text-gray-600)
- Hover: cinza claro (text-gray-400)
- Ícones disponíveis:
  - ⚙️ Settings
  - 🎬 Video
  - 🖼️ Image
  - 🔊 Audio
  - 📜 History

### Área Central - Criação de Vídeo
- Ícone de estrela (✦) no topo
- Título: "Create a video with Character-3"
- Subtítulo: "Add an audio script and a character reference image below."
- Área de prompt minimalista
- Botões quadrados com ícone "+"
  - Audio script
  - Start frame

### Rodapé - Controles
- Informações em fonte pequena e cinza:
  - Hedra Character-3
  - 16:9
  - 720p
  - Auto

### Canto Inferior Esquerdo - Créditos
- Logo Kylo (◐) em rosa/pink
- Número de créditos grande (ex: 300)
- Letra "L" pequena abaixo

### Canto Inferior Central - Help
- Ícone de ajuda (?) discreto

## 📋 Fluxo de Navegação do Studio

1. **Login** → Redireciona para `/studio/video`
2. **Video** → Página principal de criação (atual)
3. **Image** → `/studio/image` (a implementar)
4. **Audio** → `/studio/audio` (a implementar)
5. **Settings** → `/settings` (implementado)
6. **History** → `/dashboard` (implementado)

## 🎨 Estilo Visual
- Inspirado no Hedra.com
- Cores principais:
  - Fundo: #0a0a0a (preto)
  - Texto: white
  - Ícones inativos: gray-600
  - Ícones ativos: white
  - Acentos: pink-500 (logo)
  - Bordas: gray-800

## 🔒 Controle de Versão

- **Versão**: 1.0.0
- **Data**: 22 de dezembro de 2025
- **Autor**: Sistema preservado
- **Status**: OFICIAL - NÃO MODIFICAR

## 📝 Histórico de Alterações

| Data | Alteração | Autorizado por |
|------|-----------|----------------|
| 22/12/2025 | Criação da versão oficial | Sistema |

---

**LEMBRETE FINAL**: Esta estrutura só pode ser alterada com autorização expressa. Para qualquer modificação, consulte o proprietário do projeto.