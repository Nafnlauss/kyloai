# Matriz Comparativa de APIs

## Análise Detalhada dos Provedores

| Provedor | Tipos de Recurso | Principais Endpoints/Skills | Custos e Limites | Autenticação | Sobreposição c/ Luma/Kling | Valor Único |
|----------|------------------|---------------------------|------------------|--------------|---------------------------|-------------|
| **Luma Labs** (✓ Já integrado) | • Geração de vídeo AI<br>• Text-to-video<br>• Image-to-video | • `/generations`<br>• Polling de status<br>• Download de vídeos | • 5s: ~$0,30<br>• 10s: ~$0,80<br>• Limites por API key | Bearer Token (Header) | N/A (base atual) | Geração rápida de vídeos com qualidade cinematográfica |
| **KlingAI** (✓ Já integrado) | • Geração de vídeo AI<br>• Text-to-video<br>• Image-to-video<br>• Vídeos longos | • `/v1/videos/text2video`<br>• `/v1/videos/image2video`<br>• Skills avançados | • 5s: $0,14 (std) / $0,35 (pro)<br>• 10s: $0,28 (std) / $0,70 (pro)<br>• Vídeos até 2min | Access Key + Secret | N/A (base atual) | Vídeos mais longos, múltiplas skills especializadas |
| **BFL.ai** | • Geração de imagem AI<br>• Edição de imagem<br>• Fine-tuning de modelos | • FLUX.1 Kontext<br>• FLUX1.1 [pro]<br>• FLUX Ultra<br>• FLUX Raw | • FLUX 1.1 Pro: $0,04/img<br>• FLUX 1.0 Pro: $0,05/img<br>• FLUX Dev: $0,025/img<br>• FLUX Schnell: Grátis | API Key (Header) | **Não** | Geração de imagem de última geração com prompts complexos |
| **ElevenLabs TTS** | • Text-to-Speech<br>• Voice cloning<br>• Multi-idiomas | • `/v1/text-to-speech/:voice_id`<br>• WebSocket streaming<br>• Voice management | • Multilingual: $0,18/1k chars<br>• Turbo/Flash: $0,09/1k chars<br>• Free: 10k chars/mês | xi-api-key (Header) | **Não** | TTS ultra-realista com clonagem de voz e 70+ idiomas |
| **PiAPI** (Hub) | • Agregador multi-API<br>• Imagem: Midjourney, Flux<br>• Vídeo: Kling, Luma<br>• Áudio: Suno, TTS<br>• LLM: GPT-4o | • `/task/create`<br>• `/task/retrieve`<br>• Webhooks unificados | • PPU: $0.14/unit (Kling)<br>• BYOA: $5-10/seat/mês<br>• Assinatura + créditos | API Key | **Sim** (Kling + Luma) | APIs unificadas, mas redundante com nossas integrações |
| **NewportAI** | • Avatar digital<br>• Geração de voz<br>• Geração de imagem | • Detalhes não disponíveis<br>• API em desenvolvimento | • Informação limitada<br>• Contato comercial necessário | Não especificado | **Parcial** (voz) | Avatares digitais (diferencial único) |

## Análise de Sobreposições

### ⚠️ Redundâncias Identificadas:
1. **PiAPI**: Oferece Kling e Luma através de agregação, mas já temos integração direta
2. **NewportAI**: Geração de voz compete com ElevenLabs (que é mais maduro)

### ✅ Valores Únicos:
1. **BFL.ai**: Geração de imagem de alta qualidade (não temos isso)
2. **ElevenLabs**: TTS profissional com clonagem de voz (não temos isso)
3. **NewportAI**: Avatares digitais (funcionalidade única, mas API imatura)

## Recomendações Resumidas

### 🟢 Integrar Prioritariamente:
1. **BFL.ai** - Adiciona geração de imagem AI ao portfólio
2. **ElevenLabs** - Adiciona TTS profissional com múltiplos idiomas

### 🟡 Considerar no Futuro:
- **NewportAI** - Apenas quando a API de avatares estiver madura

### 🔴 Não Integrar:
- **PiAPI** - Redundante com nossas integrações diretas (Luma + Kling)