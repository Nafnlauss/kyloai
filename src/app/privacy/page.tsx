import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-8">Última atualização: 21 de Dezembro de 2024</p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Card className="mb-8">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
                <p className="text-muted-foreground">
                  A Kylo ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. 
                  Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos 
                  suas informações quando você usa nosso serviço de geração de vídeos com IA.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
                
                <h3 className="text-xl font-semibold mb-2">2.1 Informações Fornecidas por Você</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Nome e endereço de email ao criar uma conta</li>
                  <li>Informações de pagamento (processadas com segurança via Stripe/PayPal)</li>
                  <li>Prompts de texto e preferências de geração de vídeo</li>
                  <li>Comunicações de suporte ao cliente</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Informações Coletadas Automaticamente</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Endereço IP e informações do dispositivo</li>
                  <li>Dados de uso da plataforma e análises</li>
                  <li>Cookies e tecnologias similares</li>
                  <li>Registros de servidor e informações técnicas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Suas Informações</h2>
                <p className="text-muted-foreground mb-2">Utilizamos suas informações para:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Fornecer e melhorar nossos serviços de geração de vídeo</li>
                  <li>Processar pagamentos e gerenciar assinaturas</li>
                  <li>Comunicar sobre sua conta e novidades do serviço</li>
                  <li>Detectar e prevenir fraudes e abusos</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Analisar uso e melhorar a experiência do usuário</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
                <p className="text-muted-foreground mb-2">Compartilhamos informações apenas com:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Provedores de Serviço:</strong> Stripe, PayPal (pagamentos), Luma AI, Kling AI (geração de vídeos)</li>
                  <li><strong>Conformidade Legal:</strong> Quando exigido por lei ou ordem judicial</li>
                  <li><strong>Proteção de Direitos:</strong> Para proteger direitos, propriedade ou segurança</li>
                  <li><strong>Com Seu Consentimento:</strong> Com sua autorização explícita</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
                <p className="text-muted-foreground">
                  Implementamos medidas de segurança apropriadas, incluindo:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos</li>
                  <li>Monitoramento regular de segurança</li>
                  <li>Auditorias de segurança periódicas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos (LGPD)</h2>
                <p className="text-muted-foreground mb-2">Sob a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou desatualizados</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Portabilidade dos dados</li>
                  <li>Revogar consentimento</li>
                  <li>Opor-se ao processamento</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Para exercer seus direitos, contate: support@kyloai.xyz
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground">
                  Usamos cookies essenciais para funcionalidade e cookies analíticos para melhorar nossos serviços. 
                  Você pode gerenciar suas preferências de cookies nas configurações do navegador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
                <p className="text-muted-foreground">
                  Mantemos seus dados pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. 
                  Vídeos gerados são armazenados por 30 dias após a criação, a menos que você os exclua antes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Menores de Idade</h2>
                <p className="text-muted-foreground">
                  Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente 
                  informações de menores sem consentimento dos pais.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Alterações nesta Política</h2>
                <p className="text-muted-foreground">
                  Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                  por email ou aviso em nosso site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contato</h2>
                <p className="text-muted-foreground">
                  Para questões sobre privacidade, contate-nos:
                </p>
                <ul className="list-none space-y-1 text-muted-foreground mt-2">
                  <li>Email: support@kyloai.xyz</li>
                  <li>Website: kylo.video</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}