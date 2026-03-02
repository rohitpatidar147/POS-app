import express from 'express';
import cors from 'cors';
import authRouter from './src/components/auth/auth.backend.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});

