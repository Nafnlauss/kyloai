import { Card, CardContent } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Termos de Serviço</h1>
        <p className="text-muted-foreground mb-8">Última atualização: 21 de Dezembro de 2024</p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Card className="mb-8">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground">
                  Ao acessar ou usar os serviços da Kylo ("Serviço"), você concorda em estar vinculado a estes 
                  Termos de Serviço. Se não concordar com estes termos, não use nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
                <p className="text-muted-foreground">
                  A Kylo fornece uma plataforma de geração de vídeos usando inteligência artificial. 
                  Nossos serviços incluem:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Geração de vídeos a partir de prompts de texto</li>
                  <li>Acesso a diferentes modelos de IA (Luma Dream Machine, Kling AI)</li>
                  <li>Sistema de créditos para uso dos serviços</li>
                  <li>Armazenamento temporário de vídeos gerados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Requisitos de Elegibilidade</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Você deve ter pelo menos 18 anos de idade</li>
                  <li>Deve fornecer informações precisas e completas ao criar uma conta</li>
                  <li>É responsável por manter a segurança de sua conta</li>
                  <li>Deve notificar imediatamente sobre uso não autorizado</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Uso Aceitável</h2>
                
                <h3 className="text-xl font-semibold mb-2">4.1 Conteúdo Proibido</h3>
                <p className="text-muted-foreground mb-2">Você não pode usar nossos serviços para gerar:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Conteúdo ilegal ou que promova atividades ilegais</li>
                  <li>Material que infrinja direitos autorais ou propriedade intelectual</li>
                  <li>Conteúdo difamatório, discriminatório ou de ódio</li>
                  <li>Material explícito, pornográfico ou sexualmente sugestivo</li>
                  <li>Deepfakes maliciosos ou conteúdo enganoso</li>
                  <li>Conteúdo que viole a privacidade de terceiros</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Restrições de Uso</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Não fazer engenharia reversa ou tentar extrair código-fonte</li>
                  <li>Não usar bots ou automação não autorizada</li>
                  <li>Não revender ou redistribuir os serviços</li>
                  <li>Não sobrecarregar ou prejudicar a infraestrutura</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Sistema de Créditos e Pagamentos</h2>
                
                <h3 className="text-xl font-semibold mb-2">5.1 Créditos</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Novos usuários recebem 300 créditos gratuitos</li>
                  <li>Créditos são consumidos com base no modelo e duração do vídeo</li>
                  <li>Créditos de assinatura não são cumulativos</li>
                  <li>Créditos comprados não expiram</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Assinaturas</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Renovação automática mensal ou anual</li>
                  <li>Cancelamento pode ser feito a qualquer momento</li>
                  <li>Não há reembolso por períodos parciais</li>
                  <li>Mudanças de preço serão notificadas com 30 dias de antecedência</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Propriedade Intelectual</h2>
                
                <h3 className="text-xl font-semibold mb-2">6.1 Conteúdo Gerado</h3>
                <p className="text-muted-foreground">
                  Você mantém todos os direitos sobre os vídeos que gerar, sujeito às seguintes condições:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Plano Gratuito: Apenas uso pessoal, não comercial</li>
                  <li>Planos Pagos: Uso comercial permitido</li>
                  <li>Você é responsável pelo conteúdo que criar</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Licença para KyloAI</h3>
                <p className="text-muted-foreground">
                  Você concede à Kylo uma licença limitada para armazenar e processar seu conteúdo 
                  exclusivamente para fornecer os serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Isenções de Responsabilidade</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Serviços fornecidos "como estão" sem garantias</li>
                  <li>Não garantimos resultados específicos da IA</li>
                  <li>Não somos responsáveis pelo conteúdo gerado pelos usuários</li>
                  <li>Resultados da IA podem conter imprecisões</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
                <p className="text-muted-foreground">
                  Em nenhuma circunstância a Kylo será responsável por danos indiretos, incidentais, 
                  especiais ou consequenciais. Nossa responsabilidade total está limitada ao valor pago 
                  por você nos últimos 12 meses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Indenização</h2>
                <p className="text-muted-foreground">
                  Você concorda em indenizar e isentar a Kylo de quaisquer reclamações resultantes de:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Seu uso dos serviços</li>
                  <li>Violação destes termos</li>
                  <li>Violação de direitos de terceiros</li>
                  <li>Conteúdo que você gerar</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Rescisão</h2>
                <p className="text-muted-foreground">
                  Podemos suspender ou encerrar sua conta por:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Violação destes termos</li>
                  <li>Atividade fraudulenta ou ilegal</li>
                  <li>Não pagamento de taxas devidas</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Você pode cancelar sua conta a qualquer momento através das configurações.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Modificações dos Termos</h2>
                <p className="text-muted-foreground">
                  Reservamos o direito de modificar estes termos. Mudanças significativas serão 
                  notificadas com 30 dias de antecedência. O uso contínuo constitui aceitação.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Lei Aplicável</h2>
                <p className="text-muted-foreground">
                  Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida 
                  nos tribunais competentes do Brasil.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Contato</h2>
                <p className="text-muted-foreground">
                  Para questões sobre estes termos:
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