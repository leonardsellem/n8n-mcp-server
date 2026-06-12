/**
 * Integration tests for "Nuki Zugang via Slack (mit Claude Parsing)"
 *
 * Alles läuft über n8n – keine lokalen Nuki-Credentials nötig.
 * Die Helfer-Workflows "CI - Nuki Get Auths" und "CI - Nuki Cleanup Test Auths"
 * müssen in n8n aktiv sein.
 *
 * Benötigte Umgebungsvariable:
 *   N8N_WEBHOOK_BASE_URL  – Basis-URL der n8n-Instanz (z.B. https://n8n.example.com)
 */

import axios from 'axios';
import { describe, it, expect, beforeAll, afterEach, afterAll } from '@jest/globals';

// ─── Konfiguration ────────────────────────────────────────────────────────────

const N8N_BASE = process.env.N8N_WEBHOOK_BASE_URL ?? 'http://localhost:5678';

const URLS = {
  main:    `${N8N_BASE}/webhook/nuki`,
  getAuth: `${N8N_BASE}/webhook/ci-nuki-get-auths`,
  cleanup: `${N8N_BASE}/webhook/ci-nuki-cleanup`,
};

/** Eindeutiger Marker – Claude extrahiert dies als Personenname */
const TEST_NAME = 'CITest';

const DOOR_IDS: Record<string, number> = {
  cafe:             657532604,
  treppenhaus_og:   665028877,
  cobl_office:      685009428,
  treppenhaus_cobl: 18069987820,
  halle51:          18070004860,
  club:             18198330069,
};

// ─── Typen ────────────────────────────────────────────────────────────────────

interface NukiAuth {
  id: number;
  smartlockId: number;
  type: number;
  name: string;
  code: number;
  allowedFromDate?: string;
  allowedUntilDate?: string;
  allowedWeekDays?: number;
  allowedFromTime?: number;
  allowedUntilTime?: number;
}

// ─── Helfer ───────────────────────────────────────────────────────────────────

/** Schickt einen Slack-Slash-Command an den Nuki-Webhook (n8n v2 erwartet Body unter $json.body). */
async function triggerMainWorkflow(text: string): Promise<void> {
  const params = new URLSearchParams({
    text,
    user_name: 'ci_test_runner',
    response_url: 'https://httpbin.org/post',
  });
  await axios.post(URLS.main, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    validateStatus: () => true,
  });
}

/** Fragt alle CITest-Auths für ein Schloss über den Helfer-Workflow ab. */
async function getTestAuths(smartlockId: number): Promise<NukiAuth[]> {
  const resp = await axios.post<{ auths: NukiAuth[]; count: number }>(
    URLS.getAuth,
    { body: { smartlockId, name: TEST_NAME } }
  );
  return resp.data?.auths ?? [];
}

/** Löscht alle CITest-Auths für ein Schloss über den Helfer-Workflow. */
async function cleanupLock(smartlockId: number): Promise<void> {
  await axios.post(URLS.cleanup, { body: { smartlockId, name: TEST_NAME } });
}

/** Räumt alle Türen auf. */
async function cleanupAll(): Promise<void> {
  await Promise.all(Object.values(DOOR_IDS).map(cleanupLock));
}

/**
 * Pollt alle 2 s bis mindestens `minCount` CITest-Auths auf dem Schloss erscheinen
 * oder `timeoutMs` überschritten wird.
 */
async function pollForAuths(
  smartlockId: number,
  minCount = 1,
  timeoutMs = 30_000
): Promise<NukiAuth[]> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const auths = await getTestAuths(smartlockId);
    if (auths.length >= minCount) return auths;
    await new Promise(r => setTimeout(r, 2_000));
  }
  throw new Error(
    `Timeout: ≥${minCount} CITest-Auth(s) auf Lock ${smartlockId} nicht innerhalb ${timeoutMs}ms erschienen`
  );
}

/** Prüft ob ein 6-stelliger Code den Workflow-Regeln entspricht. */
function assertValidCode(code: number): void {
  const s = String(code);
  expect(s).toHaveLength(6);
  expect(s.startsWith('12')).toBe(false);
  expect(new Set(s).size).toBeGreaterThan(1);
}

// ─── Guard ────────────────────────────────────────────────────────────────────

beforeAll(async () => {
  // Erreichbarkeit der Helfer-Workflows prüfen
  for (const [name, url] of [['ci-nuki-get-auths', URLS.getAuth], ['ci-nuki-cleanup', URLS.cleanup]]) {
    try {
      await axios.post(url, { body: { smartlockId: DOOR_IDS.cafe, name: '' } }, {
        validateStatus: s => s < 500,
        timeout: 5_000,
      });
    } catch {
      throw new Error(
        `Helfer-Workflow "${name}" nicht erreichbar unter ${url}.\n` +
        `Bitte in n8n aktivieren und N8N_WEBHOOK_BASE_URL korrekt setzen.`
      );
    }
  }
  await cleanupAll();
});

afterEach(cleanupAll);
afterAll(cleanupAll);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Nuki Zugang via Slack – Integration', () => {

  // ── 1. Einmalzugang einzelne Tür ────────────────────────────────────────────

  describe('Einmalzugang einzelne Tür', () => {
    it('legt einen Keypad-Code im Café an', async () => {
      await triggerMainWorkflow(`${TEST_NAME} übermorgen für 1 Tag Zugang zum Cafe`);

      const [auth] = await pollForAuths(DOOR_IDS.cafe);
      expect(auth.type).toBe(13);
      assertValidCode(auth.code);
      expect(new Date(auth.allowedUntilDate!).getTime()).toBeGreaterThan(Date.now());
    }, 40_000);

    it('legt einen Keypad-Code in Halle51 an', async () => {
      await triggerMainWorkflow(`${TEST_NAME} übermorgen für 2 Tage Zugang zur Halle51`);

      const [auth] = await pollForAuths(DOOR_IDS.halle51);
      expect(auth.type).toBe(13);
      assertValidCode(auth.code);
    }, 40_000);
  });

  // ── 2. Datumsvalidierung ─────────────────────────────────────────────────────

  describe('Datumsvalidierung', () => {
    it('speichert allowedFromDate und allowedUntilDate korrekt in Nuki', async () => {
      await triggerMainWorkflow(`${TEST_NAME} übermorgen für 2 Tage Zugang zum Cafe`);

      const [auth] = await pollForAuths(DOOR_IDS.cafe);

      expect(auth.allowedFromDate).toBeTruthy();
      expect(auth.allowedUntilDate).toBeTruthy();

      const from = new Date(auth.allowedFromDate!);
      const until = new Date(auth.allowedUntilDate!);

      expect(isNaN(from.getTime())).toBe(false);
      expect(isNaN(until.getTime())).toBe(false);
      expect(from.getTime()).toBeGreaterThan(Date.now());
      expect(until.getTime()).toBeGreaterThan(from.getTime());

      const diffDays = (until.getTime() - from.getTime()) / 86_400_000;
      expect(diffDays).toBeGreaterThanOrEqual(1);
      expect(diffDays).toBeLessThanOrEqual(5);
    }, 40_000);
  });

  // ── 3. Automatische EG-Erweiterung ──────────────────────────────────────────

  describe('Automatische EG-Erweiterung (treppenhaus_cobl)', () => {
    it('fügt treppenhaus_cobl automatisch bei Club-Zugang hinzu', async () => {
      await triggerMainWorkflow(`${TEST_NAME} übermorgen für 2 Tage Zugang zum Club`);

      const [clubAuths, egAuths] = await Promise.all([
        pollForAuths(DOOR_IDS.club),
        pollForAuths(DOOR_IDS.treppenhaus_cobl),
      ]);

      expect(clubAuths).toHaveLength(1);
      expect(egAuths).toHaveLength(1);
      expect(clubAuths[0].code).toBe(egAuths[0].code);
    }, 40_000);

    it('fügt treppenhaus_cobl automatisch bei Office-Zugang hinzu', async () => {
      await triggerMainWorkflow(`${TEST_NAME} übermorgen für 2 Tage Zugang zum Office`);

      const [officeAuths, egAuths] = await Promise.all([
        pollForAuths(DOOR_IDS.cobl_office),
        pollForAuths(DOOR_IDS.treppenhaus_cobl),
      ]);

      expect(officeAuths).toHaveLength(1);
      expect(egAuths).toHaveLength(1);
      expect(officeAuths[0].code).toBe(egAuths[0].code);
    }, 40_000);

    it('verwendet denselben Code für alle Türen einer Anfrage', async () => {
      await triggerMainWorkflow(`${TEST_NAME} übermorgen für 2 Tage Zugang zu Cafe und Club`);

      const [cafeAuths, clubAuths, egAuths] = await Promise.all([
        pollForAuths(DOOR_IDS.cafe),
        pollForAuths(DOOR_IDS.club),
        pollForAuths(DOOR_IDS.treppenhaus_cobl),
      ]);

      const code = cafeAuths[0].code;
      expect(clubAuths[0].code).toBe(code);
      expect(egAuths[0].code).toBe(code);
    }, 40_000);
  });

  // ── 4. Exclusive-Modus ────────────────────────────────────────────────────

  describe('Exclusive-Modus ("ausschliesslich")', () => {
    it('legt NUR den Club-Code an, KEIN treppenhaus_cobl', async () => {
      await triggerMainWorkflow(
        `${TEST_NAME} übermorgen für 2 Tage ausschliesslich Zugang zum Club`
      );

      await pollForAuths(DOOR_IDS.club);

      // 5 s warten ob EG-Auth doch noch auftaucht
      await new Promise(r => setTimeout(r, 5_000));
      const egAuths = await getTestAuths(DOOR_IDS.treppenhaus_cobl);
      expect(egAuths).toHaveLength(0);
    }, 45_000);
  });

  // ── 5. Wiederkehrender Zugang ─────────────────────────────────────────────

  describe('Wiederkehrender Zugang', () => {
    it('setzt Wochentag-Maske und Zeitfenster korrekt (jeden Montag 9–17 Uhr)', async () => {
      await triggerMainWorkflow(
        `${TEST_NAME} jeden Montag von 9 bis 17 Uhr bis 31. Dezember Zugang zum Cafe`
      );

      const [auth] = await pollForAuths(DOOR_IDS.cafe);

      // Mo=1 → Maske 64; fromTime=540 min, untilTime=1020 min
      expect(auth.allowedWeekDays).toBe(64);
      expect(auth.allowedFromTime).toBe(9 * 60);
      expect(auth.allowedUntilTime).toBe(17 * 60);
    }, 40_000);
  });

  // ── 6. Code-Qualität ──────────────────────────────────────────────────────

  describe('Code-Qualität', () => {
    it('generiert einen gültigen 6-stelligen Code', async () => {
      await triggerMainWorkflow(`${TEST_NAME} übermorgen für 1 Tag Zugang zum Cafe`);
      const [auth] = await pollForAuths(DOOR_IDS.cafe);
      assertValidCode(auth.code);
    }, 40_000);
  });
});
