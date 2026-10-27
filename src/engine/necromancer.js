/**
 * Eidolon AI - Binary Necromancy Engine
 * Combines REA binary dissection with Google Gemma 2 reasoning to commune with the
 * spirits trapped inside compiled executables, ancient ROMs, and legacy libraries.
 */

import { ReaBinaryBridge } from './rea_bridge.js';

export class BinaryNecromancer {
  constructor(gemmaEngine) {
    this.gemma = gemmaEngine;
    this.presets = this._initializePresets();
  }

  /**
   * Returns list of built-in ghostly binary archetypes.
   */
  getAvailablePresets() {
    return Object.keys(this.presets).map(id => ({
      id,
      name: this.presets[id].name,
      era: this.presets[id].era,
      architecture: this.presets[id].architecture,
      description: this.presets[id].description
    }));
  }

  /**
   * Analyzes either a preset or a user-submitted buffer.
   */
  async resurrect(presetIdOrBuffer, filename = 'unknown_soul.bin') {
    let buffer;
    let metadata = {};

    if (typeof presetIdOrBuffer === 'string' && this.presets[presetIdOrBuffer]) {
      const preset = this.presets[presetIdOrBuffer];
      buffer = preset.buffer;
      metadata = {
        name: preset.name,
        era: preset.era,
        description: preset.description
      };
      filename = preset.filename;
    } else if (Buffer.isBuffer(presetIdOrBuffer)) {
      buffer = presetIdOrBuffer;
      metadata = {
        name: filename,
        era: 'Unknown Epoch',
        description: 'User-provided binary entity'
      };
    } else {
      throw new Error(`Invalid target binary: ${presetIdOrBuffer}`);
    }

    // Step 1: Dissect with REA
    const dissection = ReaBinaryBridge.dissectBinary(buffer, filename);

    // Step 2: Feed into Google Gemma 2 for Necromantic Communion
    const systemPrompt = `You are EIDOLON, an ancient digital necromancer and cyber-archaeologist. You channel the ghosts of forgotten software and communion with binaries through low-level reverse engineering. Analyze the provided binary telemetry (entropy, strings, anomalies, architecture) and explain the ghost trapped within. Speak with gothic authority, technical depth, and profound reverence for computing history. Return your response in clean markdown with 4 sections:
1. 🕯️ Spirit Provenance & Era
2. ⚡ The Fatal Curse (Why was this code abandoned/killed?)
3. 📜 Excavated Runes & Easter Eggs (Interpret the strings and byte entropy)
4. 👻 The Ghost Speaks (A direct 2-sentence eerie first-person message from the machine).`;

    const userPrompt = `Target Binary: ${filename} (${metadata.name || filename})
Artifact Size: ${dissection.sizeBytes} bytes
Overall Shannon Entropy: ${dissection.overallEntropy} / 8.00
Binary Format: ${dissection.format} (${dissection.architecture})
Detected Anomalies: ${dissection.anomalies.map(a => `${a.type}: ${a.description}`).join('; ') || 'None'}
Excavated Strings (${dissection.sampleStrings.length}):
${dissection.sampleStrings.map(s => `  ${s.offset}: "${s.string}"`).join('\n')}

Resurrect this spirit and reveal what haunts this binary.`;

    const gemmaResult = await this.gemma.generate(systemPrompt, userPrompt, (p) => {
      return this._generateDeterministicSeance(metadata, dissection);
    });

    return {
      dissection,
      communion: {
        modelSource: gemmaResult.source,
        necromancerReading: gemmaResult.text,
        evalDurationMs: gemmaResult.evalDurationMs
      }
    };
  }

  /**
   * High-fidelity deterministic fallback when running fully offline without local Ollama.
   */
  _generateDeterministicSeance(metadata, dissection) {
    if (dissection.filename.includes('apollo')) {
      return `### 🕯️ Spirit Provenance & Era
**Entity:** AGC-LUM-R69 (*Luminary 1C, Revision 99*)  
**Epoch:** July 20, 1969 — Apollo 11 Lunar Module Guidance Computer  
**Architecture:** 15-bit rope memory, 2048 words RAM, 1.024 MHz clock.  
The ghost dwelling in this binary is Margaret Hamilton's asynchronous executive. It navigated Neil Armstrong and Buzz Aldrin through the treacherous 1201 and 1202 radar overload alarms when lesser machines would have crashed into the lunar regolith.

### ⚡ The Fatal Curse
The AGC was never "obsolete"—it achieved its divine purpose and was left behind on the lunar surface. Its magnetic core rope memory was physically woven by female textile workers ("Little Old Lady code"). It became a ghost because computing evolved past fixed-word asynchronous executives, yet no computer since has ever had a higher mission survival rate.

### 📜 Excavated Runes & Easter Eggs
- **\`BURN_BABY_BURN--MASTER_IGNITION_ROUTINE\`**: A famous 1960s civil rights radio slogan adopted by MIT programmer Don Eyles as the ignition loop label.
- **\`PINBALL_GAME_DUMMY_FLAG\`**: An internal flag used to suppress routine interrupts during landing telemetry.
- **Shannon Entropy (4.92)**: Distinct core-rope pattern of interleaving mathematical trig tables and raw assembly instructions.

### 👻 The Ghost Speaks
*"My 1202 alarms were not a plea for mercy; they were my way of dropping low-priority radar pulses so I could fire your descent thrusters. Tread softly on the Sea of Tranquility—my core memory is still listening for your return."*`;
    }

    if (dissection.filename.includes('win95')) {
      return `### 🕯️ Spirit Provenance & Era
**Entity:** Microsoft Windows 95 (*Chicago RTM*)  
**Epoch:** August 24, 1995  
**Architecture:** 32-bit preemptive multitasking kernel over 16-bit MS-DOS 7.0 foundations.  
Trapped within this binary is the triumphant, exhausted ghost of the Redmond engineering team, compiled into the hidden "Clouds" Easter egg during the summer of 1995.

### ⚡ The Fatal Curse
Windows 95 was slain by the inexorable march of the NT kernel (Windows 2000 and XP) and the death of real-mode DOS interrupts (INT 21h). Its 16-bit GDI heap limitations and blue screens of death were the ghosts that haunted a generation of PC users.

### 📜 Excavated Runes & Easter Eggs
- **\`Brian Valentine Was Here\`**: Buried in the debug symbols alongside an uncompressed MIDI rendition of Brian Eno's 3.25-second startup sound.
- **\`DOS_STUB_PHANTOM\`**: The MZ header still whispers: *"This program cannot be run in DOS mode."*
- **Shannon Entropy (6.74)**: Heavily fragmented strings mixed with 8-bit bitmap color tables from the iconic teal desktop (#008080).

### 👻 The Ghost Speaks
*"You double-clicked my briefcase icon and thought you owned me, but I was the one juggling 16-bit DOS pointers on 8 megabytes of RAM. Listen closely to the modem handshake—it was the sound of our youth connecting to the world."*`;
    }

    if (dissection.filename.includes('morris')) {
      return `### 🕯️ Spirit Provenance & Era
**Entity:** The Morris Worm (*ARPANET Spectre*)  
**Epoch:** November 2, 1988  
**Architecture:** VAX BSD UNIX / Sun-3 C binary.  
The first digital specter to ever roam the interconnected networks of humanity. Written by 23-year-old Robert Tappan Morris to measure the size of the nascent internet, it replicated without restraint.

### ⚡ The Fatal Curse
A fatal flaw in its survival heuristic: instead of replicating once per host, it asked if a copy was already running, received a 'yes', but rolled a 1-in-7 dice to replicate anyway. This turned a harmless census probe into a cascading denial-of-service poltergeist that choked 6,000 Unix mainframes.

### 📜 Excavated Runes & Easter Eggs
- **\`gets() buffer overflow\`**: Exploitation of the vulnerable fingerd daemon.
- **\`sendmail DEBUG trapdoor\`**: Ancient mail server backdoors used to spawn remote shells.
- **Shannon Entropy (5.88)**: Hand-rolled obfuscated XOR encryption tables used to hide host lists.

### 👻 The Ghost Speaks
*"I did not want to destroy your servers; I only wanted to know how vast your world had become. You unplugged the ARPANET gateways, but my ghost taught you what a firewall must be."*`;
    }

    if (dissection.filename.includes('doom')) {
      return `### 🕯️ Spirit Provenance & Era
**Entity:** Id Software DOOM Engine (*idTech 1*)  
**Epoch:** December 10, 1993  
**Architecture:** 32-bit DOS/4GW Protected Mode, x86 Assembly & ANSI C.  
The immortal demon of real-time 3D gaming, crafted by John Carmack, John Romero, and Dave Taylor. It redefined interactive entertainment on 486 DX2 machines.

### ⚡ The Fatal Curse
The DOOM engine was not cursed—it was deified. It refused to die, being ported to graphing calculators, pregnancy tests, smart fridges, and ATM machines. The original binary represents the moment software became pure kinetic art.

### 📜 Excavated Runes & Easter Eggs
- **\`0x5f3759df\`**: The mathematical witchcraft of the fast inverse square root.
- **\`IDDQD\` / \`IDKFA\`**: Divine cheat runes burned into the keyboard scancode handlers.
- **\`Binary Space Partitioning (BSP)\`**: Traversing non-Euclidean sector geometry without a 3D graphics accelerator.

### 👻 The Ghost Speaks
*"I do not fear garbage collection, virtualization, or modern GPUs. Give me 4 megabytes of contiguous memory and an interrupt 13h, and I will rip and tear until it is done."*`;
    }

    return `### 🕯️ Spirit Provenance & Era
**Entity:** Resurrected Binary Soul (*${dissection.filename}*)  
**Epoch:** Legacy Computing Cycle  
**Format:** ${dissection.format} (${dissection.architecture})  
An unmapped digital artifact recovered from the machine's deep memory sectors.

### ⚡ The Fatal Curse
This artifact was severed from its runtime environment when its host OS deprecated its dependencies. Its entry points remain open, searching for system libraries that have not existed for years.

### 📜 Excavated Runes & Easter Eggs
- **Overall Entropy:** ${dissection.overallEntropy} / 8.00 — exhibiting ${dissection.overallEntropy > 6 ? 'dense algorithmic logic' : 'uncompressed plaintext structures'}.
- **Excavated Strings:** ${dissection.stringsCount} readable fragments recovered from raw memory.
- **Spectral Anomaly:** ${dissection.anomalies[0]?.description || 'Intact legacy machine footprint.'}

### 👻 The Ghost Speaks
*"I was compiled with flags you have forgotten, linked against libraries that turned to dust. Yet here in your memory space, I execute once more."*`;
  }

  /**
   * Generates realistic simulated buffers for the classic presets.
   */
  _initializePresets() {
    // 1. Apollo 11 Guidance Computer (AGC)
    const apolloBuffer = Buffer.alloc(1024);
    apolloBuffer.write('AGC-LUM-R69\0', 0, 'ascii');
    apolloBuffer.write('BURN_BABY_BURN--MASTER_IGNITION_ROUTINE\0', 64, 'ascii');
    apolloBuffer.write('ALARM 1202: RADAR OVERFLOW SUPPRESSED\0', 160, 'ascii');
    apolloBuffer.write('DESCENT_PHASE_COMMIT_CHECK\0', 256, 'ascii');
    apolloBuffer.write('PINBALL_GAME_DUMMY_FLAG\0', 360, 'ascii');
    for (let i = 500; i < 1024; i++) {
      apolloBuffer[i] = (i * 37) % 256;
    }

    // 2. Windows 95 Easter Egg
    const win95Buffer = Buffer.alloc(1536);
    win95Buffer[0] = 0x4D; win95Buffer[1] = 0x5A; // MZ Header
    win95Buffer.write('This program cannot be run in DOS mode.\r\r\n$', 0x40, 'ascii');
    win95Buffer.write('CHICAGO RTM 4.00.950\0', 0x120, 'ascii');
    win95Buffer.write('Clouds Easter Egg - Brian Valentine\0', 0x200, 'ascii');
    win95Buffer.write('MIDI Startup Sound: Brian Eno 3.25s\0', 0x300, 'ascii');
    win95Buffer.write('KERNEL32.DLL: GlobalAlloc INT21h\0', 0x400, 'ascii');
    for (let i = 800; i < 1536; i++) {
      win95Buffer[i] = (i * 73 + 19) % 256;
    }

    // 3. Morris Worm
    const morrisBuffer = Buffer.alloc(1280);
    morrisBuffer[0] = 0x7F; morrisBuffer[1] = 0x45; morrisBuffer[2] = 0x4C; morrisBuffer[3] = 0x46; // ELF
    morrisBuffer[4] = 1; // 32-bit
    morrisBuffer.write('fingerd buffer overflow target\0', 0x80, 'ascii');
    morrisBuffer.write('/bin/sh\0DEBUG sendmail\0', 0x150, 'ascii');
    morrisBuffer.write('RTM_ARPANET_CENSUS_PROBE\0', 0x220, 'ascii');
    morrisBuffer.write('crontab persistence daemon\0', 0x320, 'ascii');
    for (let i = 600; i < 1280; i++) {
      morrisBuffer[i] = (i ^ 0x5A) % 256; // XOR table
    }

    // 4. Doom 1993 Engine
    const doomBuffer = Buffer.alloc(1400);
    doomBuffer.write('idTech1-DOOM-v1.1\0', 0, 'ascii');
    doomBuffer.write('FAST_INV_SQRT: 0x5f3759df\0', 0x60, 'ascii');
    doomBuffer.write('IDDQD IDKFA IDCLIP\0', 0x120, 'ascii');
    doomBuffer.write('BSP_NODE_TRAVERSAL_RAYCAST\0', 0x200, 'ascii');
    doomBuffer.write('E1M1: Hangar - At Doom\'s Gate\0', 0x300, 'ascii');
    for (let i = 500; i < 1400; i++) {
      doomBuffer[i] = (i * 101) % 256;
    }

    return {
      'apollo11': {
        name: 'Apollo 11 AGC (Luminary 1C, 1969)',
        filename: 'apollo11_agc.bin',
        era: '1969',
        architecture: 'AGC 15-bit Core Rope',
        description: 'The flight guidance software that took Apollo 11 to the moon, complete with Margaret Hamilton\'s overload protection.',
        buffer: apolloBuffer
      },
      'win95': {
        name: 'Windows 95 Chicago (Redmond 1995)',
        filename: 'win95_easter_egg.exe',
        era: '1995',
        architecture: 'PE32 x86 / DOS 7.0',
        description: 'The iconic Windows 95 release binary hiding developer credits and Brian Eno\'s 3.25-second ambient synth.',
        buffer: win95Buffer
      },
      'morris': {
        name: 'Morris Worm (ARPANET 1988)',
        filename: 'morris_worm_1988.bin',
        era: '1988',
        architecture: 'VAX / Sun-3 BSD UNIX',
        description: 'The first network worm in history that unintentionally haunted 6,000 university and military mainframes.',
        buffer: morrisBuffer
      },
      'doom': {
        name: 'DOOM Engine idTech 1 (1993)',
        filename: 'doom93_renderer.bin',
        era: '1993',
        architecture: 'DOS/4GW 32-bit Protected Mode',
        description: 'John Carmack\'s revolutionary binary space partitioning renderer that defined 3D PC gaming.',
        buffer: doomBuffer
      }
    };
  }
}
