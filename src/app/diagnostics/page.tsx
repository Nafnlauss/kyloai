export default function DiagnosticsPage() {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Diagnostics</h1>
      <h2>Environment Variables:</h2>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
      <h2>Current Time:</h2>
      <p>{new Date().toISOString()}</p>
    </div>
  );
}