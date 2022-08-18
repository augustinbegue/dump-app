import { handler } from './build/handler.js';
import { readFileSync } from 'fs';
import 'dotenv/config';
import express from 'express';
import https from 'https';

const app = express();

app.get('/healthcheck', (req, res) => {
  res.end('ok');
});

app.use(handler);

if (process.env.NODE_ENV === 'production') {
  let port = process.env.CMS_PORT || 3333;
  https.createServer({
    key: readFileSync(process.env.CERT_PRIVKEY || './certs/privkey.pem'),
    cert: readFileSync(process.env.CERT_FULLCHAIN || './certs/cert.pem'),
  }, app).listen(port);
  console.log('cms-server: listening on port', port);
} else {
    app.listen(3000, () => {
        console.log('cms-server: listening on port 3000');
    });
}