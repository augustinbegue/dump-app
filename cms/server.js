import { handler } from './build/handler.js';
import { readFileSync } from 'fs';
import 'dotenv/config';
import express from 'express';
import https from 'https';
import cors from 'cors';

const app = express();

app.get('/healthcheck', (req, res) => {
  res.end('ok');
});

app.use(handler);

app.listen(3000, () => {
  console.log('cms-server: listening on port 3000');
});