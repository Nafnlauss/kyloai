// Script para configurar variáveis no Railway via API
// Você precisa do token da API do Railway

const RAILWAY_API_TOKEN = 'SEU_TOKEN_AQUI'; // Pegue em: https://railway.app/account/tokens
const PROJECT_ID = 'SEU_PROJECT_ID'; // Veja na URL do seu projeto
const ENVIRONMENT_ID = 'production'; // ou o ID do seu ambiente

const DATABASE_URL = 'postgresql://postgres.snfxczgjpnydysccigps:Lk6289asqwa@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

async function setRailwayVariable() {
  const response = await fetch(`https://backboard.railway.app/graphql/v2`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RAILWAY_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation SetVariable($projectId: String!, $environmentId: String!, $name: String!, $value: String!) {
          variableUpsert(
            projectId: $projectId
            environmentId: $environmentId
            name: $name
            value: $value
          )
        }
      `,
      variables: {
        projectId: PROJECT_ID,
        environmentId: ENVIRONMENT_ID,
        name: 'DATABASE_URL',
        value: DATABASE_URL
      }
    })
  });

  const result = await response.json();
  console.log('Result:', result);
}

console.log('Para usar este script:');
console.log('1. Vá em https://railway.app/account/tokens');
console.log('2. Crie um token de API');
console.log('3. Substitua SEU_TOKEN_AQUI pelo token');
console.log('4. Substitua SEU_PROJECT_ID pelo ID do projeto (está na URL)');
console.log('5. Execute: node scripts/fix-railway-env.js');

// Descomente para executar:
// setRailwayVariable();