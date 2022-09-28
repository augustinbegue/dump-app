import { handler } from './build/handler.js';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/healthcheck', (req, res) => {
  res.end('ok');
});

app.use(handler);

app.listen(3000, () => {
  console.log('cms-server: listening on port 3000');
});