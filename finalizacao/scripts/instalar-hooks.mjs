#!/usr/bin/env node
// Roda sozinho no `npm install` (script "prepare"). Aponta o git para a pasta versionada .githooks.
import { execSync } from 'node:child_process';

try {
  execSync('git config core.hooksPath .githooks', { stdio: 'ignore' });
  console.log('Git hooks ativos (.githooks).');
} catch {
  console.log('Git hooks não instalados: esta pasta ainda não é um repositório git.');
}
