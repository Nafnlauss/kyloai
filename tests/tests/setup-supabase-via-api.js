const fetch = require('node-fetch');

const SUPABASE_URL = 'https://snfxczgjpnydysccigps.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM3NjY2OSwiZXhwIjoyMDY1OTUyNjY5fQ.LTFYGslmETIOeaIzfR4NV9cWQyXfkvesLNEeJEdvsHw';

async function executeSql(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/sql`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    const result = await response.text();
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Teste simples
executeSql('SELECT current_database()').then(console.log);