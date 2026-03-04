import express from 'express';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const router = express.Router();

const WAITERS_FILE_PATH = path.resolve(process.cwd(), 'data', 'waiters.json');

// Admin account (always in memory)
const adminUser = { id: 1, username: 'admin', password: 'admin123', role: 'admin' };

const ensureWaitersFile = async () => {
  if (!existsSync(WAITERS_FILE_PATH)) {
    await writeFile(WAITERS_FILE_PATH, '[]', 'utf-8');
  }
};

const readWaiters = async () => {
  await ensureWaitersFile();
  const raw = await readFile(WAITERS_FILE_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const writeWaiters = async (waiters) => {
  await writeFile(WAITERS_FILE_PATH, `${JSON.stringify(waiters, null, 2)}\n`, 'utf-8');
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check admin first
    if (username === adminUser.username && password === adminUser.password) {
      return res.json({ id: adminUser.id, username: adminUser.username, role: adminUser.role });
    }

    // Check waiters
    const waiters = await readWaiters();
    const waiter = waiters.find((w) => w.username === username && w.password === password);

    if (!waiter) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    return res.json({ id: waiter.id, username: waiter.username, role: waiter.role });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/create-waiter
router.post('/create-waiter', async (req, res) => {
  try {
    const requesterRole = req.header('X-User-Role');

    if (requesterRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create waiters.' });
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const waiters = await readWaiters();

    // Check if username already exists (in waiters or admin)
    if (username === adminUser.username || waiters.find((w) => w.username === username)) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const nextId = waiters.reduce((maxId, waiter) => {
      const currentId = Number(waiter?.id) || 0;
      return currentId > maxId ? currentId : maxId;
    }, 1) + 1;

    const newWaiter = {
      id: nextId,
      username,
      password,
      role: 'waiter'
    };

    waiters.push(newWaiter);
    await writeWaiters(waiters);

    return res.status(201).json({ id: newWaiter.id, username: newWaiter.username, role: newWaiter.role });
  } catch (error) {
    console.error('Create waiter error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/auth/waiters - Get all waiter accounts
router.get('/waiters', async (req, res) => {
  try {
    const requesterRole = req.header('X-User-Role');

    if (requesterRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view waiters.' });
    }

    const waiters = await readWaiters();
    return res.json(waiters);
  } catch (error) {
    console.error('Get waiters error:', error);
    return res.status(500).json({ message: 'Failed to fetch waiters.' });
  }
});

// DELETE /api/auth/waiters/:id - Delete a waiter account
router.delete('/waiters/:id', async (req, res) => {
  try {
    const requesterRole = req.header('X-User-Role');

    if (requesterRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete waiters.' });
    }

    const waiterId = Number(req.params.id);
    if (Number.isNaN(waiterId)) {
      return res.status(400).json({ message: 'Invalid waiter ID.' });
    }

    const waiters = await readWaiters();
    const waiterIndex = waiters.findIndex((w) => Number(w?.id) === waiterId);

    if (waiterIndex === -1) {
      return res.status(404).json({ message: 'Waiter account not found.' });
    }

    const deletedWaiter = waiters.splice(waiterIndex, 1)[0];
    await writeWaiters(waiters);

    return res.json({ message: `Waiter "${deletedWaiter.username}" deleted successfully.` });
  } catch (error) {
    console.error('Delete waiter error:', error);
    return res.status(500).json({ message: 'Failed to delete waiter.' });
  }
});

export default router;

