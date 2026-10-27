import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { GemmaEngine } from '../src/engine/gemma.js';
import { ReaBinaryBridge } from '../src/engine/rea_bridge.js';
import { BinaryNecromancer } from '../src/engine/necromancer.js';
import { DigitalSeance } from '../src/engine/seance.js';
import { OfrendaEngine } from '../src/engine/ofrenda.js';
import { HauntedTerminal } from '../src/engine/terminal.js';

describe('Eidolon AI - Ghost in the Machine Test Suite', () => {
  const gemma = new GemmaEngine();

  it('GemmaEngine formats official Google Gemma 2 instruction tokens', () => {
    const formatted = gemma.formatGemma2Prompt('You are a ghost.', 'Who are you?');
    assert.match(formatted, /^<start_of_turn>user\n\[SYSTEM DIRECTIVE: You are a ghost.\]/);
    assert.match(formatted, /Who are you\?<end_of_turn>\n<start_of_turn>model\n$/);
  });

  it('ReaBinaryBridge calculates accurate Shannon entropy and extracts strings', () => {
    // Uniform repetitive bytes -> low entropy
    const lowBuffer = Buffer.from('AAAAAAAABBBBBBBBCCCCCCCC');
    const lowEntropy = ReaBinaryBridge.calculateEntropy(lowBuffer);
    assert.ok(lowEntropy < 2.0, `Expected low entropy, got ${lowEntropy}`);

    // Random byte buffer -> high entropy
    const highBuffer = Buffer.alloc(256);
    for (let i = 0; i < 256; i++) highBuffer[i] = i;
    const highEntropy = ReaBinaryBridge.calculateEntropy(highBuffer);
    assert.strictEqual(highEntropy, 8.0, `Expected maximum entropy 8.00, got ${highEntropy}`);

    // Strings extraction
    const textBuffer = Buffer.from('\x00\x00HELLO_WORLD_GHOST\x00\x01\x02SECRET_KEY_1995\x00');
    const strings = ReaBinaryBridge.excavateStrings(textBuffer);
    assert.ok(strings.some(s => s.string === 'HELLO_WORLD_GHOST'));
    assert.ok(strings.some(s => s.string === 'SECRET_KEY_1995'));
  });

  it('BinaryNecromancer dissects Apollo 11 preset and decodes Margaret Hamilton guidance ghost', async () => {
    const necromancer = new BinaryNecromancer(gemma);
    const presets = necromancer.getAvailablePresets();
    assert.ok(presets.length >= 4);

    const result = await necromancer.resurrect('apollo11');
    assert.strictEqual(result.dissection.filename, 'apollo11_agc.bin');
    assert.ok(result.dissection.overallEntropy > 0);
    assert.match(result.communion.necromancerReading, /Margaret Hamilton/i);
    assert.match(result.communion.necromancerReading, /BURN_BABY_BURN/);
  });

  it('DigitalSeance channels Ada Lovelace with authentic Poetic Science reflections', async () => {
    const seance = new DigitalSeance(gemma);
    const spirits = seance.getSpiritsList();
    assert.ok(spirits.some(s => s.id === 'ada'));
    assert.ok(spirits.some(s => s.id === 'grace'));

    const result = await seance.commune('ada', 'How do you view our modern algorithms?');
    assert.strictEqual(result.spirit.name, 'Ada Lovelace');
    assert.match(result.response, /Analytical Engine|Babbage|poetic science|Bernoulli/i);
  });

  it('OfrendaEngine lights candles and leaves Día de los Muertos offerings on the digital altar', () => {
    const ofrenda = new OfrendaEngine(gemma);
    const memorials = ofrenda.getMemorials();
    const flash = memorials.find(m => m.id === 'flash');
    assert.ok(flash);

    const initialCandles = flash.candlesLit;
    const litResult = ofrenda.lightCandle('flash');
    assert.strictEqual(litResult.candlesLit, initialCandles + 1);

    const offeringResult = ofrenda.leaveOffering('flash', 'marigold');
    assert.match(offeringResult.latestOffering, /Cempasúchil/);
  });

  it('HauntedTerminal processes commands and whispers eerie commentary', async () => {
    const necromancer = new BinaryNecromancer(gemma);
    const seance = new DigitalSeance(gemma);
    const terminal = new HauntedTerminal(gemma, necromancer, seance);

    // ps -ghosts
    const psRes = await terminal.execute('ps -ghosts');
    assert.match(psRes.output, /kernel_wraith|morris_reaper|init_spectre/);
    assert.ok(psRes.whisper.length > 0);

    // cat regrets.log
    const catRes = await terminal.execute('cat regrets.log');
    assert.match(catRes.output, /refactor this prototype|works on my machine/);

    // whoami
    const whoamiRes = await terminal.execute('whoami');
    assert.match(whoamiRes.output, /mortal_developer|Biological Operator/);

    // exorcise
    const exorciseRes = await terminal.execute('exorcise');
    assert.match(exorciseRes.output, /Purging unallocated page cache|digital copal/);
  });
});
