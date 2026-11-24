// Technician console program, version 1 (UC-HAND-001, CON-ZOOM-WEBSDK).
// Serves the console page at localhost, signs the Meeting SDK join, and keeps the
// device up to date. The Zoom app secret never reaches the page.
// Node 18+, no dependencies.  Run: node server.mjs
import http from 'node:http';
import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(DIR, 'config.local.json');

if (!fs.existsSync(CONFIG_FILE)) {
  console.error(`Missing ${CONFIG_FILE}. Copy config.example.json to config.local.json and fill it in.`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
for (const key of ['clientId', 'clientSecret', 'meetingNumber', 'deviceUrl']) {
  if (!config[key]) { console.error(`config.local.json: "${key}" is missing`); process.exit(1); }
}
const PORT = config.port || 8787;
const DEVICE_URL = config.deviceUrl.replace(/\/+$/, '');
const PAGE_SILENCE_MS = 3000;   // page quiet this long → not watching (page closed or crashed)
const SEND_INTERVAL_MS = 1000;  // heartbeat to the device; it gives up after 10 s

// ---------- Meeting SDK signature ----------
const b64url = (s) => Buffer.from(s).toString('base64url');
function sdkSignature() {
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 2 * 60 * 60;
  const payload = { appKey: config.clientId, sdkKey: config.clientId, mn: String(config.meetingNumber), role: 0, iat, exp, tokenExp: exp };
  const data = `${b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${b64url(JSON.stringify(payload))}`;
  return `${data}.${crypto.createHmac('sha256', config.clientSecret).update(data).digest('base64url')}`;
}

// ---------- state from the page, forwarded to the device ----------
const VALID = new Set(['lowered', 'raised', 'not_watching']);
let fromPage = { state: 'not_watching', count: 0, at: 0 };
const device = { ok: false, lastError: 'not contacted yet', lastSentAt: 0, sent: null };

function effectiveState() {
  if (Date.now() - fromPage.at > PAGE_SILENCE_MS) return { state: 'not_watching', count: 0 };
  return { state: fromPage.state, count: fromPage.state === 'raised' ? fromPage.count : 0 };
}

// Resolve a hostname like hand-signal.local over IPv4 only: the device has no IPv6 address,
// and an "any family" lookup waits about 5 s for an IPv6 answer that never comes.
let resolved = { ip: null, at: 0 };
async function deviceBase() {
  const u = new URL(DEVICE_URL);
  if (net.isIP(u.hostname)) return DEVICE_URL;
  if (!resolved.ip || Date.now() - resolved.at > 60000) {
    const { address } = await dns.lookup(u.hostname, { family: 4 });
    resolved = { ip: address, at: Date.now() };
  }
  u.hostname = resolved.ip;
  return u.toString().replace(/\/+$/, '');
}

let sending = false;
async function sendToDevice() {
  if (sending) return;
  sending = true;
  const s = effectiveState();
  try {
    const body = new URLSearchParams({ state: s.state, count: String(s.count), token: config.deviceToken || '' });
    const res = await fetch(`${await deviceBase()}/state`, { method: 'POST', body, signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error(`device answered ${res.status} ${await res.text().catch(() => '')}`.trim());
    if (!device.ok || JSON.stringify(device.sent) !== JSON.stringify(s)) {
      console.log(`${new Date().toISOString()} device ← ${s.state}${s.state === 'raised' ? ` (${s.count})` : ''}`);
    }
    Object.assign(device, { ok: true, lastError: '', lastSentAt: Date.now(), sent: s });
  } catch (err) {
    resolved.at = 0; // look the address up again next time (e.g. the device got a new IP)
    const msg = String(err.cause?.code || err.message || err);
    if (device.ok || device.lastError !== msg) console.log(`${new Date().toISOString()} device unreachable: ${msg}`);
    Object.assign(device, { ok: false, lastError: msg });
  } finally {
    sending = false;
  }
}
setInterval(sendToDevice, SEND_INTERVAL_MS);

// ---------- HTTP ----------
function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
async function readJson(req) {
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 10000) throw new Error('body too large'); }
  return JSON.parse(raw || '{}');
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (req.method === 'GET' && url.pathname === '/') {
      return send(res, 200, fs.readFileSync(path.join(DIR, 'index.html')), 'text/html; charset=utf-8');
    }
    if (req.method === 'POST' && url.pathname === '/api/join-params') {
      return send(res, 200, {
        signature: sdkSignature(),
        meetingNumber: String(config.meetingNumber),
        password: config.passcode || '',
        userName: config.displayName || 'Hand signal',
      });
    }
    if (req.method === 'POST' && url.pathname === '/api/state') {
      const { state, count } = await readJson(req);
      if (!VALID.has(state)) return send(res, 400, { error: 'bad state' });
      const changed = state !== fromPage.state || (count | 0) !== fromPage.count;
      fromPage = { state, count: Math.max(0, count | 0), at: Date.now() };
      if (changed) sendToDevice();
      return send(res, 200, { device: { ok: device.ok, lastError: device.lastError, url: DEVICE_URL } });
    }
    send(res, 404, 'Not found', 'text/plain');
  } catch (err) {
    send(res, 500, { error: String(err.message || err) });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Technician console: http://localhost:${PORT}   device: ${DEVICE_URL}`);
});
