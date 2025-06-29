const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const readline = require('readline')

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
}

// Interface de linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ask = (question) => new Promise(resolve => rl.question(question, resolve))

// Funções auxiliares
async function listUsers() {
  console.log(`\n${colors.blue}👥 Lista de Usuários:${colors.reset}`)
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            videos: true,
            transactions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (users.length === 0) {
      console.log(`${colors.yellow}Nenhum usuário encontrado.${colors.reset}`)
      return
    }
    
    console.log(`\nTotal: ${users.length} usuários\n`)
    
    users.forEach((user, index) => {
      const roleColor = user.role === 'ADMIN' ? colors.red : 
                       user.role === 'MODERATOR' ? colors.yellow : 
                       colors.green
      
      console.log(`${colors.cyan}#${index + 1}${colors.reset}`)
      console.log(`  ID: ${user.id}`)
      console.log(`  Email: ${user.email}`)
      console.log(`  Name: ${user.name || 'N/A'}`)
      console.log(`  Role: ${roleColor}${user.role}${colors.reset}`)
      console.log(`  Credits: ${user.credits}`)
      console.log(`  Active: ${user.isActive ? '✅' : '❌'}`)
      console.log(`  Videos: ${user._count.videos}`)
      console.log(`  Transactions: ${user._count.transactions}`)
      console.log(`  Registered: ${user.createdAt.toLocaleDateString('en-US')}`)
      console.log('')
    })
    
    return users
  } catch (error) {
    console.error(`${colors.red}Erro ao listar usuários: ${error.message}${colors.reset}`)
  }
}

async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        isActive: true
      }
    })
    
    if (!user) {
      console.log(`${colors.red}Usuário não encontrado com email: ${email}${colors.reset}`)
      return null
    }
    
    return user
  } catch (error) {
    console.error(`${colors.red}Erro ao buscar usuário: ${error.message}${colors.reset}`)
    return null
  }
}

async function changeUserRole(email, newRole) {
  try {
    const validRoles = ['USER', 'ADMIN', 'MODERATOR']
    if (!validRoles.includes(newRole)) {
      console.log(`${colors.red}Role inválida. Use: USER, ADMIN ou MODERATOR${colors.reset}`)
      return
    }
    
    const user = await findUserByEmail(email)
    if (!user) return
    
    if (user.role === newRole) {
      console.log(`${colors.yellow}Usuário já possui a role ${newRole}${colors.reset}`)
      return
    }
    
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: newRole }
    })
    
    console.log(`${colors.green}✅ Role alterada com sucesso!${colors.reset}`)
    console.log(`  Email: ${updatedUser.email}`)
    console.log(`  Role anterior: ${user.role}`)
    console.log(`  Nova role: ${colors.magenta}${updatedUser.role}${colors.reset}`)
    
    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_ROLE_CHANGED',
        resource: 'User',
        resourceId: user.id,
        metadata: JSON.stringify({
          oldRole: user.role,
          newRole: newRole,
          changedBy: 'admin-script'
        })
      }
    })
    
  } catch (error) {
    console.error(`${colors.red}Erro ao alterar role: ${error.message}${colors.reset}`)
  }
}

async function deleteUser(email) {
  try {
    const user = await findUserByEmail(email)
    if (!user) return
    
    // Confirm deletion
    console.log(`\n${colors.yellow}⚠️  WARNING: This action is IRREVERSIBLE!${colors.reset}`)
    console.log(`You are about to delete:`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.name || 'N/A'}`)
    console.log(`  Role: ${user.role}`)
    
    const confirm = await ask(`\nType "${colors.red}CONFIRM${colors.reset}" to proceed: `)
    
    if (confirm !== 'CONFIRM') {
      console.log(`${colors.yellow}Operation cancelled.${colors.reset}`)
      return
    }
    
    console.log(`\n${colors.yellow}Deleting user and all related data...${colors.reset}`)
    
    // Execute deletion in transaction
    await prisma.$transaction(async (tx) => {
      // Delete in correct order
      await tx.video.deleteMany({ where: { userId: user.id } })
      await tx.transaction.deleteMany({ where: { userId: user.id } })
      
      // Optional tables (may not exist)
      try { await tx.payment.deleteMany({ where: { userId: user.id } }) } catch (e) {}
      try { await tx.creditHistory.deleteMany({ where: { userId: user.id } }) } catch (e) {}
      try { await tx.apiKey.deleteMany({ where: { userId: user.id } }) } catch (e) {}
      try { await tx.userPreferences.deleteMany({ where: { userId: user.id } }) } catch (e) {}
      try { await tx.twoFactorBackupCode.deleteMany({ where: { userId: user.id } }) } catch (e) {}
      
      await tx.subscription.deleteMany({ where: { userId: user.id } })
      await tx.session.deleteMany({ where: { userId: user.id } })
      await tx.account.deleteMany({ where: { userId: user.id } })
      await tx.auditLog.deleteMany({ where: { userId: user.id } })
      
      // Delete user
      await tx.user.delete({ where: { id: user.id } })
    })
    
    console.log(`${colors.green}✅ User deleted successfully!${colors.reset}`)
    
  } catch (error) {
    console.error(`${colors.red}Error deleting user: ${error.message}${colors.reset}`)
  }
}

async function addCredits(email, amount) {
  try {
    const user = await findUserByEmail(email)
    if (!user) return
    
    const credits = parseInt(amount)
    if (isNaN(credits) || credits <= 0) {
      console.log(`${colors.red}Invalid credit amount${colors.reset}`)
      return
    }
    
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        credits: {
          increment: credits
        }
      }
    })
    
    // Create credit history
    await prisma.creditHistory.create({
      data: {
        userId: user.id,
        amount: credits,
        type: 'BONUS',
        description: `Credits added via admin-tasks`,
        balance: updatedUser.credits
      }
    })
    
    console.log(`${colors.green}✅ Credits added successfully!${colors.reset}`)
    console.log(`  Email: ${updatedUser.email}`)
    console.log(`  Previous credits: ${user.credits}`)
    console.log(`  Credits added: +${credits}`)
    console.log(`  Current balance: ${colors.cyan}${updatedUser.credits}${colors.reset}`)
    
  } catch (error) {
    console.error(`${colors.red}Error adding credits: ${error.message}${colors.reset}`)
  }
}

async function viewUserDetails(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: {
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            videos: true,
            transactions: true,
            sessions: true,
            auditLogs: true
          }
        }
      }
    })
    
    if (!user) {
      console.log(`${colors.red}User not found${colors.reset}`)
      return
    }
    
    console.log(`\n${colors.blue}📋 User Details:${colors.reset}`)
    console.log(`\n${colors.cyan}Basic Information:${colors.reset}`)
    console.log(`  ID: ${user.id}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.name || 'N/A'}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  Active: ${user.isActive ? '✅' : '❌'}`)
    console.log(`  Credits: ${user.credits}`)
    console.log(`  Registered: ${user.createdAt.toLocaleDateString('en-US')}`)
    
    console.log(`\n${colors.cyan}Security:${colors.reset}`)
    console.log(`  2FA: ${user.twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}`)
    console.log(`  Last login: ${user.lastLoginAt ? user.lastLoginAt.toLocaleDateString('en-US') : 'Never'}`)
    console.log(`  Failed attempts: ${user.failedLoginAttempts}`)
    console.log(`  Locked until: ${user.lockedUntil ? user.lockedUntil.toLocaleDateString('en-US') : 'Not locked'}`)
    
    if (user.subscription) {
      console.log(`\n${colors.cyan}Subscription:${colors.reset}`)
      console.log(`  Plan: ${user.subscription.plan.displayName}`)
      console.log(`  Status: ${user.subscription.status}`)
      console.log(`  Period: ${user.subscription.interval}`)
      console.log(`  Valid until: ${user.subscription.currentPeriodEnd.toLocaleDateString('en-US')}`)
    } else {
      console.log(`\n${colors.cyan}Subscription:${colors.reset} None (Free Plan)`)
    }
    
    console.log(`\n${colors.cyan}Statistics:${colors.reset}`)
    console.log(`  Videos created: ${user._count.videos}`)
    console.log(`  Transactions: ${user._count.transactions}`)
    console.log(`  Sessions: ${user._count.sessions}`)
    console.log(`  Audit logs: ${user._count.auditLogs}`)
    
  } catch (error) {
    console.error(`${colors.red}Error fetching details: ${error.message}${colors.reset}`)
  }
}

async function viewRecentLogs() {
  try {
    console.log(`\n${colors.blue}📜 Recent Audit Logs:${colors.reset}`)
    
    const logs = await prisma.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })
    
    if (logs.length === 0) {
      console.log(`${colors.yellow}No logs found.${colors.reset}`)
      return
    }
    
    logs.forEach(log => {
      const actionColor = log.action.includes('DELETE') ? colors.red :
                         log.action.includes('CREATE') ? colors.green :
                         log.action.includes('UPDATE') ? colors.yellow :
                         colors.cyan
      
      console.log(`\n${log.createdAt.toLocaleString('en-US')}`)
      console.log(`  Action: ${actionColor}${log.action}${colors.reset}`)
      console.log(`  User: ${log.user?.email || 'System'}`)
      console.log(`  Resource: ${log.resource}`)
      if (log.metadata) {
        try {
          const meta = JSON.parse(log.metadata)
          console.log(`  Details: ${JSON.stringify(meta, null, 2)}`)
        } catch (e) {
          console.log(`  Details: ${log.metadata}`)
        }
      }
    })
    
  } catch (error) {
    console.error(`${colors.red}Error fetching logs: ${error.message}${colors.reset}`)
  }
}

// Main menu
async function showMenu() {
  console.log(`\n${colors.magenta}═══════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.magenta}     KYLO AI - ADMINISTRATIVE TASKS     ${colors.reset}`)
  console.log(`${colors.magenta}═══════════════════════════════════════════${colors.reset}`)
  
  console.log(`\n${colors.cyan}Choose an option:${colors.reset}`)
  console.log(`  ${colors.green}1${colors.reset} - List all users`)
  console.log(`  ${colors.green}2${colors.reset} - Find user by email`)
  console.log(`  ${colors.green}3${colors.reset} - Change user role`)
  console.log(`  ${colors.green}4${colors.reset} - Delete user`)
  console.log(`  ${colors.green}5${colors.reset} - Add credits`)
  console.log(`  ${colors.green}6${colors.reset} - View user details`)
  console.log(`  ${colors.green}7${colors.reset} - View recent logs`)
  console.log(`  ${colors.green}0${colors.reset} - Exit`)
  
  const choice = await ask(`\nOption: `)
  
  switch (choice) {
    case '1':
      await listUsers()
      break
      
    case '2':
      const searchEmail = await ask('\nEnter email: ')
      const foundUser = await findUserByEmail(searchEmail)
      if (foundUser) {
        console.log(`\n${colors.green}User found:${colors.reset}`)
        console.log(`  ID: ${foundUser.id}`)
        console.log(`  Email: ${foundUser.email}`)
        console.log(`  Name: ${foundUser.name || 'N/A'}`)
        console.log(`  Role: ${foundUser.role}`)
        console.log(`  Credits: ${foundUser.credits}`)
      }
      break
      
    case '3':
      const roleEmail = await ask('\nEnter user email: ')
      console.log('\nChoose new role:')
      console.log('  1 - USER (regular user)')
      console.log('  2 - ADMIN (administrator)')
      console.log('  3 - MODERATOR (moderator)')
      const roleChoice = await ask('\nOption: ')
      const roles = { '1': 'USER', '2': 'ADMIN', '3': 'MODERATOR' }
      if (roles[roleChoice]) {
        await changeUserRole(roleEmail, roles[roleChoice])
      } else {
        console.log(`${colors.red}Invalid option${colors.reset}`)
      }
      break
      
    case '4':
      const deleteEmail = await ask('\nEnter email of user to delete: ')
      await deleteUser(deleteEmail)
      break
      
    case '5':
      const creditsEmail = await ask('\nEnter user email: ')
      const creditsAmount = await ask('Amount of credits to add: ')
      await addCredits(creditsEmail, creditsAmount)
      break
      
    case '6':
      const detailsEmail = await ask('\nEnter user email: ')
      await viewUserDetails(detailsEmail)
      break
      
    case '7':
      await viewRecentLogs()
      break
      
    case '0':
      console.log(`\n${colors.green}Exiting...${colors.reset}`)
      await prisma.$disconnect()
      rl.close()
      process.exit(0)
      
    default:
      console.log(`${colors.red}Opção inválida${colors.reset}`)
  }
  
  // Continue showing menu
  await showMenu()
}

// Start application
async function main() {
  try {
    // Test connection
    await prisma.$connect()
    console.log(`${colors.green}✅ Connected to database!${colors.reset}`)
    
    // Show menu
    await showMenu()
    
  } catch (error) {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`)
    process.exit(1)
  }
}

// Handle interruption
process.on('SIGINT', async () => {
  console.log(`\n${colors.yellow}Shutting down...${colors.reset}`)
  await prisma.$disconnect()
  rl.close()
  process.exit(0)
})

// Execute
main()