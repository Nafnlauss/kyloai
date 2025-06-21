const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = true;
const hostname = '0.0.0.0';
const port = 3001;

// Configurar variáveis de ambiente
process.env.NEXTAUTH_URL = `http://localhost:${port}`;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`🚀 Servidor rodando em:`);
    console.log(`   http://localhost:${port}`);
    console.log(`   http://127.0.0.1:${port}`);
    
    // Get local network IP if available
    const networkInterfaces = require('os').networkInterfaces();
    const localIPs = [];
    for (const iface of Object.values(networkInterfaces)) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal && alias.address.startsWith('192.168.')) {
          localIPs.push(alias.address);
        }
      }
    }
    if (localIPs.length > 0) {
      localIPs.forEach(ip => {
        console.log(`   http://${ip}:${port}`);
      });
    }
  });
});