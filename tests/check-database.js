const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

async function checkDatabase() {
  console.log(`${colors.blue}🔍 Checking Supabase database connection...${colors.reset}\n`)
  
  try {
    // 1. Test connection
    await prisma.$connect()
    console.log(`${colors.green}✅ Successfully connected to database!${colors.reset}`)
    
    // 2. List all tables
    console.log(`\n${colors.blue}📊 Tables found in database:${colors.reset}`)
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `
    
    const tableNames = tables.map(t => t.tablename)
    tableNames.forEach(table => {
      console.log(`  ${colors.green}✓${colors.reset} ${table}`)
    })
    
    // 3. Check User-specific tables
    console.log(`\n${colors.blue}🔗 Checking User table relations:${colors.reset}`)
    
    const userRelatedTables = [
      'Account',
      'Session',
      'Video',
      'Transaction',
      'Subscription',
      'AuditLog',
      'ApiKey',
      'CreditHistory',
      'UserPreferences',
      'TwoFactorBackupCode',
      'Payment'
    ]
    
    for (const table of userRelatedTables) {
      const exists = tableNames.includes(table)
      if (exists) {
        console.log(`  ${colors.green}✓${colors.reset} ${table} - Exists`)
      } else {
        console.log(`  ${colors.red}✗${colors.reset} ${table} - NOT exists`)
      }
    }
    
    // 4. Check tables that DON'T exist (problematic)
    console.log(`\n${colors.yellow}⚠️  Tables that DON'T exist (don't use in endpoints):${colors.reset}`)
    const problematicTables = [
      'verificationToken',
      'apiLog',
      'twoFactorConfirmation',
      'securitySettings'
    ]
    
    problematicTables.forEach(table => {
      console.log(`  ${colors.red}✗${colors.reset} ${table}`)
    })
    
    // 5. Database statistics
    console.log(`\n${colors.blue}📈 Database statistics:${colors.reset}`)
    
    try {
      const stats = await Promise.all([
        prisma.user.count(),
        prisma.video.count(),
        prisma.transaction.count(),
        prisma.subscription.count()
      ])
      
      console.log(`  👥 Users: ${stats[0]}`)
      console.log(`  🎬 Videos: ${stats[1]}`)
      console.log(`  💰 Transactions: ${stats[2]}`)
      console.log(`  📅 Subscriptions: ${stats[3]}`)
    } catch (error) {
      console.log(`  ${colors.yellow}Error getting statistics: ${error.message}${colors.reset}`)
    }
    
    // 6. Check User table structure
    console.log(`\n${colors.blue}👤 User table structure:${colors.reset}`)
    const userColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'User'
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `
    
    console.log('  Columns:')
    userColumns.forEach(col => {
      console.log(`    - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`)
    })
    
    // 7. Test basic operations
    console.log(`\n${colors.blue}🧪 Testing basic operations:${colors.reset}`)
    
    // Test SELECT
    try {
      const firstUser = await prisma.user.findFirst()
      console.log(`  ${colors.green}✓${colors.reset} SELECT working`)
    } catch (error) {
      console.log(`  ${colors.red}✗${colors.reset} SELECT error: ${error.message}`)
    }
    
    console.log(`\n${colors.green}✅ Check complete!${colors.reset}`)
    console.log(`\n${colors.yellow}💡 Tip: Only use tables marked with ✓ in your endpoints${colors.reset}`)
    
  } catch (error) {
    console.error(`${colors.red}❌ Database connection error:${colors.reset}`)
    console.error(error.message)
    console.error(`\n${colors.yellow}Please check:${colors.reset}`)
    console.error('  1. DATABASE_URL is correct in .env.local')
    console.error('  2. Database is active on Supabase')
    console.error('  3. Credentials are correct')
  } finally {
    await prisma.$disconnect()
  }
}

// Execute the script
console.log(`${colors.yellow}═══════════════════════════════════════════${colors.reset}`)
console.log(`${colors.yellow}   KYLO AI DATABASE CHECKER   ${colors.reset}`)
console.log(`${colors.yellow}═══════════════════════════════════════════${colors.reset}\n`)

checkDatabase().catch(console.error)