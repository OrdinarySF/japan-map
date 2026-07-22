#!/usr/bin/env node
/**
 * Encrypt itinerary.md → itinerary.enc.json (AES-256-GCM + PBKDF2)
 *
 * Usage:
 *   node tools/encrypt-itinerary.mjs
 *   ITINERARY_PASS='your-pass' node tools/encrypt-itinerary.mjs
 *   node tools/encrypt-itinerary.mjs --pass 'your-pass'
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const inputPath = path.join(root, 'itinerary.md');
const outputPath = path.join(root, 'itinerary.enc.json');
const ITER = 250000;

function parseArgs(argv) {
  let pass = process.env.ITINERARY_PASS || '';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--pass' && argv[i + 1]) {
      pass = argv[++i];
    }
  }
  return { pass };
}

function askHidden(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const stdin = process.stdin;
    if (stdin.isTTY) {
      process.stdout.write(prompt);
      stdin.setRawMode(true);
      let s = '';
      const onData = (buf) => {
        const ch = buf.toString('utf8');
        if (ch === '\n' || ch === '\r' || ch === '\u0004') {
          stdin.setRawMode(false);
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(s);
        } else if (ch === '\u0003') {
          process.exit(1);
        } else if (ch === '\u007f') {
          s = s.slice(0, -1);
        } else {
          s += ch;
        }
      };
      stdin.on('data', onData);
    } else {
      rl.question(prompt, (ans) => {
        rl.close();
        resolve(ans);
      });
    }
  });
}

async function main() {
  let { pass } = parseArgs(process.argv);
  if (!pass) {
    pass = await askHidden('行程口令 (不会回显): ');
  }
  if (!pass || pass.length < 6) {
    console.error('口令至少 6 位');
    process.exit(1);
  }
  if (!fs.existsSync(inputPath)) {
    console.error('找不到 itinerary.md');
    process.exit(1);
  }

  const plaintext = fs.readFileSync(inputPath);
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(pass, salt, ITER, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  const ct = Buffer.concat([encrypted, tag]);

  const payload = {
    v: 1,
    kdf: 'PBKDF2',
    iter: ITER,
    hash: 'SHA-256',
    cipher: 'AES-GCM',
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ct: ct.toString('base64')
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + '\n');
  console.log('已写入', outputPath);
  console.log('请牢记口令；仓库中只应依赖 itinerary.enc.json 给网页解密加载。');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
