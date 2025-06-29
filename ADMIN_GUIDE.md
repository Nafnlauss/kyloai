# 📚 Administrator Guide - Kylo AI

This guide was created to facilitate Kylo AI system administration, especially for users with limited technical knowledge.

## 🎯 Quick Index

1. [Administrative Scripts](#administrative-scripts)
2. [User Management](#user-management)
3. [Database Verification](#database-verification)
4. [Essential Commands](#essential-commands)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Administrative Scripts

### 1. **admin-tasks.js** - Complete User Management

This is the main script for managing users. It offers an interactive and easy-to-use menu.

**How to run:**
```bash
cd ai-video-hub
node tests/admin-tasks.js
```

**Available features:**
- 📋 List all users
- 🔍 Search user by email
- 🎭 Change role (USER, ADMIN, MODERATOR)
- 🗑️ Delete user (with confirmation)
- 💰 Add credits
- 📊 View complete user details
- 📜 View recent audit logs

**Usage example:**
```bash
# 1. Run the script
node tests/admin-tasks.js

# 2. Choose an option from the menu (type the number)
# 3. Follow the on-screen instructions
```

### 2. **check-database.js** - Check Database

This script checks the database connection and structure.

**How to run:**
```bash
cd ai-video-hub
node tests/check-database.js
```

**What it shows:**
- ✅ Connection status
- 📊 List of existing tables
- 🔗 User table relationships
- ⚠️ Non-existent tables
- 📈 General statistics

---

## 👥 User Management

### Available Roles

1. **USER** - Regular user
   - Can create videos
   - Limited dashboard access
   - No administrative access

2. **MODERATOR** - Moderator
   - All USER permissions
   - Admin panel access
   - Can view logs
   - CANNOT delete users or change roles

3. **ADMIN** - Administrator
   - Full system access
   - Can delete users
   - Can change roles
   - Can add credits

### How to Promote a User to Admin

1. Run the admin-tasks script:
   ```bash
   node tests/admin-tasks.js
   ```

2. Choose option `3` (Change user role)

3. Enter the user's email

4. Choose `2` for ADMIN

5. Done! The user is now an administrator

### How to Delete a User

⚠️ **WARNING: This action is IRREVERSIBLE!**

1. Run the admin-tasks script:
   ```bash
   node tests/admin-tasks.js
   ```

2. Choose option `4` (Delete user)

3. Enter the user's email

4. Type `CONFIRM` when prompted

5. The user and ALL related data will be deleted

---

## 🗄️ Database Verification

### When to Check the Database

Run the verification script when:
- There are strange errors in the system
- After code updates
- To check general statistics

### How to Interpret Results

**Symbols:**
- ✅ = Working/Exists
- ❌ = Not working/Doesn't exist
- ⚠️ = Attention needed

**Example output:**
```
📊 Tables found in database:
  ✓ User
  ✓ Video
  ✓ Transaction
  ✗ Payment - does NOT exist

📈 Database statistics:
  👥 Users: 150
  🎬 Videos: 1,234
  💰 Transactions: 89
```

---

## 💻 Essential Commands

### Basic Navigation

```bash
# Enter project directory
cd ai-video-hub

# Check if you're in the correct directory
pwd
# Should show: .../ai-video-hub
```

### Run Scripts

```bash
# User management
node tests/admin-tasks.js

# Check database
node tests/check-database.js

# View system logs (if any)
cat logs/error.log
```

### Project Commands

```bash
# Start development server
pnpm dev

# Stop server
Ctrl + C (press Control and C together)

# View database status
pnpm prisma studio
```

---

## 🔥 Troubleshooting

### Error: "Cannot connect to database"

**Cause:** Database offline or incorrect credentials

**Solution:**
1. Check if Supabase is online
2. Check `.env.local` file
3. Test with `node tests/check-database.js`

### Error: "Table does not exist"

**Cause:** Table was removed or never existed

**Solution:**
1. Run `node tests/check-database.js`
2. See which tables exist
3. Contact support if necessary

### Error Deleting User

**Possible causes:**
- Trying to delete yourself
- Trying to delete another admin
- User doesn't exist

**Solution:**
1. Check the typed email
2. Confirm it's not your own email
3. Use the search user option first

### Script Not Working

**Checks:**
1. Are you in the correct directory? (`cd ai-video-hub`)
2. Dependencies installed? (`pnpm install`)
3. Does `.env.local` file exist?
4. Is the database online?

---

## 📱 Quick Support

### Need Help?

1. **First:** Try the verification script
   ```bash
   node tests/check-database.js
   ```

2. **Second:** Consult this guide

3. **Third:** Contact technical support

### Information for Support

When asking for help, provide:
- 📸 Screenshot of the error
- 📝 What you were trying to do
- 🔍 Result from check-database.js script

---

## 🎯 Important Tips

1. **ALWAYS** backup before deleting users
2. **NEVER** share your admin credentials
3. **TEST** first with test users
4. **DOCUMENT** important changes
5. **CHECK** twice before deleting

---

## 🚀 Quick Commands (Copy and Paste)

```bash
# Enter project and manage users
cd ai-video-hub && node tests/admin-tasks.js

# Check database
cd ai-video-hub && node tests/check-database.js

# View all users quickly
cd ai-video-hub && node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.user.findMany({select:{email:true,role:true}}).then(u => {console.table(u); p.$disconnect()})"
```

---

*Guide created to facilitate Kylo AI administration. Keep this document always updated!*