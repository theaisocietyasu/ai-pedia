import { spawn } from 'node:child_process';
import { mongoConnection } from './utilities/db_connector.js';

const isDev = process.argv.includes('--dev');

async function startNext() {
  // Ensure DB connection is established before starting Next
  try {
    await mongoConnection;
    console.log('MongoDB connection ready. Starting Next server...');
  } catch (err) {
    console.error('Failed to connect to MongoDB; starting Next anyway.', err);
  }

  const nextCmd = isDev ? ['next', 'dev', '--turbopack'] : ['next', 'start'];

  // Use Next's command via npx so it resolves local binaries.
  const nextProc = spawn('npx', nextCmd, { stdio: 'inherit', shell: true });

  nextProc.on('close', (code) => {
    console.log(`Next process exited with code ${code}`);
    process.exit(code);
  });

  nextProc.on('error', (err) => {
    console.error('Failed to start Next process:', err);
    process.exit(1);
  });
}

startNext();
