// Spike server for AS-WEBSDK-001: serves the test page at localhost, signs the
// Meeting SDK JWT, and holds the technician's Zoom OAuth tokens to fetch a ZAK.
// No dependencies; Node 18+.  Run: node server.mjs
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(DIR, 'config.local.json');
const TOKENS_FILE = path.join(DIR, 'tokens.local.json');
const LOG_FILE = path.join(DIR, 'spike-log.local.jsonl');

if (!fs.existsSync(CONFIG_FILE)) {
  console.error(`Missing ${CONFIG_FILE}. Copy config.example.json to config.local.json and fill it in.`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const PORT = config.port || 8787;
const REDIRECT_URI = `http://localhost:${PORT}/oauth/callback`;
const AUTH_MODE = ['obf', 'zak'].includes(config.authMode) ? config.authMode : 'none';

// ---------- helpers ----------
const b64url = (buf) => Buffer.from(buf).toString('base64url');

function sdkSignature(meetingNumber) {
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    appKey: config.clientId,
    sdkKey: config.clientId,
    mn: String(meetingNumber),
    role: 0, // participant
    iat,
    exp,
    tokenExp: exp,
  };
  const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = crypto.createHmac('sha256', config.clientSecret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function readTokens() {
  try { return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8')); } catch { return null; }
}
function writeTokens(t) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(t, null, 2));
}

async function tokenRequest(params) {
  const basic = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OAuth token request failed (${res.status}): ${JSON.stringify(body)}`);
  const t = { ...body, obtained_at: Date.now() };
  writeTokens(t);
  return t;
}

async function accessToken() {
  let t = readTokens();
  if (!t) throw new Error('Not signed in');
  const expiresAt = t.obtained_at + (t.expires_in - 60) * 1000;
  if (Date.now() > expiresAt) {
    t = await tokenRequest({ grant_type: 'refresh_token', refresh_token: t.refresh_token });
  }
  return t.access_token;
}

async function zoomApi(pathname) {
  const res = await fetch(`https://api.zoom.us/v2${pathname}`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

async function getZak() {
  // Newer granular endpoint first, then the classic one.
  const a = await zoomApi('/users/me/zak');
  if (a.ok && a.body.token) return { zak: a.body.token, via: '/users/me/zak' };
  const b = await zoomApi('/users/me/token?type=zak');
  if (b.ok && b.body.token) return { zak: b.body.token, via: '/users/me/token?type=zak' };
  throw new Error(`Could not get ZAK: ${JSON.stringify({ first: a, second: b })}`);
}

async function getObf(meetingNumber) {
  // On Behalf Of token: the signed-in user must already be in the meeting on another client.
  const r = await zoomApi(`/users/me/token?type=onbehalf&meeting_id=${encodeURIComponent(meetingNumber)}`);
  if (r.ok && r.body.token) return r.body.token;
  throw new Error(`Could not get OBF token: ${JSON.stringify(r)}`);
}

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

function log(entry) {
  fs.appendFileSync(LOG_FILE, JSON.stringify({ t: new Date().toISOString(), ...entry }) + '\n');
}

// ---------- routes ----------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (req.method === 'GET' && url.pathname === '/') {
      return send(res, 200, fs.readFileSync(path.join(DIR, 'index.html')), 'text/html; charset=utf-8');
    }

    if (req.method === 'GET' && url.pathname === '/oauth/start') {
      const q = new URLSearchParams({ response_type: 'code', client_id: config.clientId, redirect_uri: REDIRECT_URI });
      res.writeHead(302, { Location: `https://zoom.us/oauth/authorize?${q}` });
      return res.end();
    }

    if (req.method === 'GET' && url.pathname === '/oauth/callback') {
      const code = url.searchParams.get('code');
      if (!code) return send(res, 400, `OAuth error: ${url.searchParams.get('error') || 'no code'}`, 'text/plain');
      await tokenRequest({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI });
      log({ kind: 'server', msg: 'signed in' });
      res.writeHead(302, { Location: '/' });
      return res.end();
    }

    if (req.method === 'GET' && url.pathname === '/api/status') {
      let signedInAs = '';
      if (readTokens()) {
        const me = await zoomApi('/users/me').catch(() => ({ ok: false }));
        if (me.ok) signedInAs = me.body.display_name || `${me.body.first_name || ''} ${me.body.last_name || ''}`.trim();
      }
      return send(res, 200, {
        signedIn: !!readTokens(),
        signedInAs,
        authMode: AUTH_MODE,
        meetingNumber: config.meetingNumber || '',
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/join-params') {
      const params = {
        signature: sdkSignature(config.meetingNumber),
        meetingNumber: String(config.meetingNumber),
        password: config.passcode || '',
      };
      if (AUTH_MODE === 'none') {
        // Same-account meeting: no user token at all, only the SDK signature.
        params.userName = config.userName || 'Hand signal';
        log({ kind: 'server', msg: 'join params issued', authMode: 'none' });
      } else if (AUTH_MODE === 'obf') {
        params.obfToken = await getObf(config.meetingNumber);
        params.userName = config.userName || 'Hand signal';
        log({ kind: 'server', msg: 'join params issued', authMode: 'obf' });
      } else {
        const { zak, via } = await getZak();
        const me = await zoomApi('/users/me');
        params.zak = zak;
        params.userName = config.userName
          || (me.ok && (me.body.display_name || `${me.body.first_name || ''} ${me.body.last_name || ''}`.trim()))
          || 'Technician console (test)';
        log({ kind: 'server', msg: 'join params issued', authMode: 'zak', zakVia: via, meOk: me.ok });
      }
      return send(res, 200, params);
    }

    if (req.method === 'POST' && url.pathname === '/api/sign-out') {
      fs.rmSync(TOKENS_FILE, { force: true });
      log({ kind: 'server', msg: 'signed out' });
      return send(res, 200, { ok: true });
    }

    if (req.method === 'POST' && url.pathname === '/api/log') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      log({ kind: 'page', ...JSON.parse(raw || '{}') });
      return send(res, 204, '', 'text/plain');
    }

    send(res, 404, 'Not found', 'text/plain');
  } catch (err) {
    log({ kind: 'server-error', msg: String(err.message || err) });
    send(res, 500, { error: String(err.message || err) });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Spike running at http://localhost:${PORT}  (log: ${LOG_FILE})`);
});
