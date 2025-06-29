const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedInitialData() {
  console.log('\n🌱 INICIANDO SEED DE DADOS ESSENCIAIS...\n');

  try {
    // 1. Verificar se já existem planos
    const existingPlans = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM plans
    `;
    
    if (existingPlans[0].count > 0) {
      console.log('✅ Planos já existem no banco');
    } else {
      console.log('📋 Inserindo planos de assinatura...');
      
      await prisma.$executeRaw`
        INSERT INTO plans (id, name, price, interval, credits, features, created_at, updated_at)
        VALUES 
          ('plan_lite', 'Lite', 19.90, 'month', 500, '{"videos": 10, "priority": "normal", "support": "email"}', NOW(), NOW()),
          ('plan_creator', 'Creator', 49.90, 'month', 2000, '{"videos": 50, "priority": "high", "support": "priority"}', NOW(), NOW()),
          ('plan_professional', 'Professional', 99.90, 'month', 5000, '{"videos": 200, "priority": "highest", "support": "dedicated"}', NOW(), NOW()),
          ('plan_lite_yearly', 'Lite Anual', 199.00, 'year', 6000, '{"videos": 120, "priority": "normal", "support": "email"}', NOW(), NOW()),
          ('plan_creator_yearly', 'Creator Anual', 499.00, 'year', 24000, '{"videos": 600, "priority": "high", "support": "priority"}', NOW(), NOW()),
          ('plan_professional_yearly', 'Professional Anual', 999.00, 'year', 60000, '{"videos": 2400, "priority": "highest", "support": "dedicated"}', NOW(), NOW())
      `;
      
      console.log('✅ Planos inseridos com sucesso!');
    }

    // 2. Verificar se já existem pacotes de créditos
    const existingPacks = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM credit_packages
    `;
    
    if (existingPacks[0].count > 0) {
      console.log('✅ Pacotes de créditos já existem no banco');
    } else {
      console.log('💳 Inserindo pacotes de créditos...');
      
      await prisma.$executeRaw`
        INSERT INTO credit_packages (id, name, credits, price, bonus_credits, created_at, updated_at)
        VALUES 
          ('pack_1000', '1.000 Créditos', 1000, 29.90, 0, NOW(), NOW()),
          ('pack_2500', '2.500 Créditos', 2500, 59.90, 250, NOW(), NOW()),
          ('pack_5000', '5.000 Créditos', 5000, 99.90, 1000, NOW(), NOW()),
          ('pack_10000', '10.000 Créditos', 10000, 179.90, 3000, NOW(), NOW())
      `;
      
      console.log('✅ Pacotes de créditos inseridos com sucesso!');
    }

    // 3. Verificar APIs de vídeo
    const existingVideoApis = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM video_apis
    `;
    
    if (existingVideoApis[0].count > 0) {
      console.log('✅ APIs de vídeo já configuradas');
    } else {
      console.log('🎬 Configurando APIs de vídeo...');
      
      await prisma.$executeRaw`
        INSERT INTO video_apis (id, name, base_url, enabled, created_at, updated_at)
        VALUES 
          ('luma_v1', 'Luma Dream Machine V1', 'https://api.lumalabs.ai/v1', true, NOW(), NOW()),
          ('luma_v2', 'Luma Dream Machine V2', 'https://api.lumalabs.ai/v2', true, NOW(), NOW()),
          ('kling_v1', 'Kling AI V1', 'https://api.klingai.com/v1', true, NOW(), NOW()),
          ('kling_v2', 'Kling AI V2', 'https://api.klingai.com/v2', true, NOW(), NOW())
      `;
      
      console.log('✅ APIs de vídeo configuradas!');
    }

    // 4. Configurar preços das APIs
    const existingPricing = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM video_pricing
    `;
    
    if (existingPricing[0].count > 0) {
      console.log('✅ Preços das APIs já configurados');
    } else {
      console.log('💰 Configurando preços das APIs...');
      
      await prisma.$executeRaw`
        INSERT INTO video_pricing (id, api_id, credits_cost, processing_time, created_at, updated_at)
        VALUES 
          ('price_luma_v1', 'luma_v1', 1, 120, NOW(), NOW()),
          ('price_luma_v2', 'luma_v2', 2, 90, NOW(), NOW()),
          ('price_kling_v1', 'kling_v1', 3, 180, NOW(), NOW()),
          ('price_kling_v2', 'kling_v2', 4, 150, NOW(), NOW())
      `;
      
      console.log('✅ Preços configurados!');
    }

    console.log('\n🎉 SEED CONCLUÍDO COM SUCESSO!\n');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute o seed
seedInitialData()
  .catch(console.error)
  .finally(() => process.exit());