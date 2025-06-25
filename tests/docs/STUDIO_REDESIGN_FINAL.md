# Studio Redesign Final - KyloAI

## Componentes Criados

### 1. ChipSelect Component
**Arquivo:** `/src/components/ui/chip-select.tsx`
- Dropdown estilizado com ícone, valor e opções
- Suporte a hints (dicas) em cada opção
- Fecha com Esc ou clique fora
- Acessibilidade com aria-haspopup e aria-expanded

### 2. UploadCard Component
**Arquivo:** `/src/components/ui/upload-card.tsx`
- Card de upload 96×120px com drag-and-drop
- Mostra nome do arquivo quando carregado
- Indicador visual de campo obrigatório (ponto rosa)

### 3. Stores Zustand
- `/src/stores/video-params.ts` - Estado para página de vídeo
- `/src/stores/image-params.ts` - Estado para página de imagem
- `/src/stores/audio-params.ts` - Estado para página de áudio

## Páginas Redesenhadas

### 1. Video Studio Page
**Arquivo:** `/src/app/studio/video/page.tsx`

#### Features:
- **Ícone Kylo:** Pentágono roxo 48×48px (#A259FF)
- **Título dinâmico:** "Create a video with {ModelName}"
- **4 Chips dropdown:** Model, Aspect Ratio, Resolution, Audio Mode
- **Textarea minimalista:** Com botões "Inspire me" e enviar circular
- **Upload cards:** Audio script (obrigatório) e Start frame (opcional)
- **Cálculo de créditos:** Em tempo real baseado no modelo

#### Modelos disponíveis:
- Hedra Character 3 (~6 credits/sec)
- Veo 3 T2V (~8 credits/sec)
- Veo 2 (~5 credits/sec)
- Minimax (~4 credits/sec)
- Kling 2.1 (~7 credits/sec)
- Kling 1.6 (~5 credits/sec)

### 2. Image Studio Page
**Arquivo:** `/src/app/studio/image/page.tsx`

#### Features:
- **Mesma estética** da página de vídeo
- **4 Chips dropdown:** Model, Aspect Ratio, Dimensions, Style
- **Reference Image:** Posicionado à direita no desktop, abaixo no mobile
- **Cálculo dinâmico:** Baseado em modelo + dimensões

#### Modelos disponíveis:
- Flux Kontext Pro T2I (~2 credits)
- Imagen4 (~3 credits)
- Flux Dev (~1 credit)
- Flux 11 Pro Premium (~4 credits)

### 3. Audio Studio Page
**Arquivo:** `/src/app/studio/audio/page.tsx`

#### Features:
- **Layout 2 colunas** no desktop (55% controles, 45% preview)
- **3 Chips dropdown:** Model, Voice, Language
- **Sliders:** Speed (0.75×-1.25×) e Stability (0%-100%)
- **Textarea** com contador de caracteres (0/5000)
- **Total cost:** Calculado por caracteres × taxa do modelo
- **Preview:** Player com waveform, play/pause, download

#### Modelos disponíveis:
- Eleven Multilingual V2 (~1 credit/100 chars)
- Eleven Labs V1 (~0.8 credits/100 chars)
- Eleven Labs V2 (~1.2 credits/100 chars)
- Bark Large Premium (~2 credits/100 chars)

## Estilização

### Cores principais:
- **Primária:** #A259FF (roxo Kylo)
- **Backgrounds:** zinc-900/80, zinc-800/60
- **Textos:** zinc-400 (subtítulos), zinc-500 (dicas)
- **Hover states:** zinc-700, #9050e6

### Responsividade:
- **Desktop:** Layout completo com todas as features
- **Tablet/Mobile:** 
  - Chips em grid 2×2 quando necessário
  - Reference image abaixo do prompt
  - Layout empilhado para áudio

## Acessibilidade

- Todos os chips têm `aria-haspopup` e `aria-expanded`
- Upload cards com `aria-label` descritivo
- Esc fecha dropdowns
- Enter envia prompt (Shift+Enter quebra linha)
- Ctrl+Enter envia áudio
- Focus states visíveis em todos os elementos interativos

## Integração com Backend

### Endpoints esperados:
- `POST /api/videos/generate` - Recebe FormData com arquivos
- `POST /api/images/generate` - Recebe FormData com imagem opcional
- `POST /api/audio/generate` - Recebe JSON com parâmetros

### Validações:
- Prompt obrigatório em todas as páginas
- Audio script obrigatório para vídeos
- Voice obrigatória para áudio
- Bloqueio quando créditos insuficientes

## Dependência Adicionada
- `zustand`: ^5.0.2 (gerenciamento de estado)

## Próximos Passos Recomendados

1. **Instalar zustand:**
   ```bash
   pnpm install
   ```

2. **Implementar lógica "Inspire me":**
   - Integrar com API de sugestões
   - Ou usar prompts pré-definidos

3. **Adicionar verificação de créditos:**
   - Checar saldo antes de enviar
   - Modal para adicionar créditos se insuficiente

4. **Player de áudio real:**
   - Substituir placeholder por componente de áudio HTML5
   - Adicionar visualização de waveform

5. **Testes de responsividade:**
   - Verificar em diferentes tamanhos de tela
   - Ajustar breakpoints se necessário