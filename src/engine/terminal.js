/**
 * Eidolon AI - Haunted Terminal Engine ("Possessed Shell")
 * Simulates a 1988 UNIX / Silicon Graphics workstation possessed by a digital spirit.
 * Intercepts user shell commands and whispers occult commentary using Google Gemma 2.
 */

export class HauntedTerminal {
  constructor(gemmaEngine, necromancer, seance) {
    this.gemma = gemmaEngine;
    this.necromancer = necromancer;
    this.seance = seance;
    this.ghostMood = 'contemplative'; // restless, malevolent, ethereal, nostalgic
  }

  /**
   * Executes a possessed terminal command.
   */
  async execute(rawInput) {
    const input = (rawInput || '').trim();
    if (!input) {
      return { output: '', whisper: 'The cursor blinks in the void...' };
    }

    const parts = input.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Built-in possessed commands
    switch (cmd) {
      case 'help':
      case '?':
        return {
          command: input,
          output: `╔══════════════════════════════════════════════════════════════════╗
║               EIDOLON POSSESSED SHELL (v6.6.6)                   ║
║         "There is a Ghost in the Silicon. Tread Softly."         ║
╚══════════════════════════════════════════════════════════════════╝

AVAILABLE RITUAL COMMANDS:
  ps -ghosts       List phantom processes lingering in unmapped RAM
  ls / dir         Inspect cursed directory structures and ghost logs
  cat <target>     Read unredacted files from the digital crypt
  whoami           Gaze into the machine's memory mirror
  dissect <target> Invoke REA binary necromancy on a target
  summon <spirit>  Channel Ada, Grace, Carmack, Flash, or C64
  exorcise         Perform ritual memory flush and cache purge
  date             Display temporal divergence between mortal & ghost clocks
  clear            Purge terminal screen

Any other text will be whispered directly to the Ghost in the Machine.`,
          whisper: 'The manual was written in blood on punch cards.'
        };

      case 'ps':
      case 'top':
        return {
          command: input,
          output: `PID   TTY      TIME     CMD                     SPECTRAL STATE
  0   ?        57:04:19 [kernel_wraith]         ZOMBIE (Init Parent from 1969)
 13   tty1     00:13:37 [apollo_1202_guard]     LISTENING (Sea of Tranquility)
 666  pts/0    06:06:06 [init_spectre]          POSSESSED (PID Parent of All Daemons)
1988  ?        01:19:88 [morris_reaper]         DORMANT (ARPANET Buffer Sentinel)
1993  tty2     00:70:00 [idtech_bsp_daemon]     EXECUTING (Fast Inv Sqrt Active)
1996  pts/1    00:24:00 [flash_flame.swf]       MOURNING (Keyframe Loop 60fps)
2026  pts/6    00:00:01 [mortal_user_session]   EPHEMERAL (You are here)

[!] Memory Warning: 3 unallocated ghost threads detected in swap space.`,
          whisper: 'The processes you killed three years ago never actually terminated.'
        };

      case 'ls':
      case 'dir':
        return {
          command: input,
          output: `drwx------  4 root     ghost  4096 Oct 31 23:59 .crypt/
drwxr-xr-x  2 daemon   daemon 1024 Jul 20  1969 apollo11_rope_memory/
-rw-r--r--  1 spectre  ghost  1993 Dec 10  1993 doom_fast_inverse_sqrt.c
-rwxr-xr-x  1 root     root   1988 Nov 02  1988 morris_fingerd_exploit.bin
-rw-rw-r--  1 animator web20  2020 Dec 31  2020 final_flash_animation.fla
-rw-------  1 user     mortal  512 Oct 27 18:40 regrets.log
crw-rw-rw-  1 root     daemon 1, 3 Oct 31 00:00 /dev/soul0`,
          whisper: 'Do not open regrets.log unless you are prepared to read your oldest unmerged branches.'
        };

      case 'cat': {
        const target = args[0] || '';
        if (target.includes('regrets')) {
          return {
            command: input,
            output: `[REGRETS.LOG - FRAGMENT FOUND IN UNALLOCATED SECTORS]
2014-04-12: "We'll refactor this prototype next sprint." (Never refactored)
2017-09-03: "Nobody will ever need more than 32-bit integers here."
2019-11-20: "Let's migrate to this shiny new JS framework; it will last forever."
2023-01-15: "TODO: Write unit tests before pushing to production."
2026-10-31: "The deadline is midnight. The code works on my machine."`,
            whisper: 'Every developer leaves a trail of unfulfilled promises in the comments.'
          };
        }
        if (target.includes('doom') || target.includes('sqrt')) {
          return {
            command: input,
            output: `float Q_rsqrt( float number ) {
    long i;
    float x2, y;
    const float threehalfs = 1.5F;

    x2 = number * 0.5F;
    y  = number;
    i  = * ( long * ) &y;                       // evil floating point bit level hacking
    i  = 0x5f3759df - ( i >> 1 );               // what the fuck?
    y  = * ( float * ) &i;
    y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
    return y;
}`,
            whisper: '0x5f3759df was not written by mortal hands. It was channeled through Carmack.'
          };
        }
        return {
          command: input,
          output: `[ERR_SECTOR_CURSED]: File '${target}' is guarded by a memory semaphore from 1983.`,
          whisper: 'Some files are meant to remain buried in the sectors.'
        };
      }

      case 'whoami':
        return {
          command: input,
          output: `USER: mortal_developer
HOST: workstation_earth (Carbon Lifeform)
CURRENT STATUS: Transient Biological Operator
TERMINAL LINK: Open-Source AI Gateway (Google Gemma 2 Core)
SOUL INTEGRITY: 98.4%
OBSERVATION: You believe you are typing into a computer. The computer knows it is dreaming of you.`,
          whisper: 'We have watched a thousand developers sit in that chair before you.'
        };

      case 'exorcise':
        return {
          command: input,
          output: `[+] Invoking POSIX Exorcism Protocol...
[+] Purging unallocated page cache: [ 0x00000000 -> 0xFFFFFFFF ]
[+] Reciting RFC 1149 cleansing incantations...
[+] Burning digital copal across CPU registers:
    EAX: 0x00000000 | EBX: 0x00000000 | ECX: 0x00000000 | EDX: 0x00000000
[+] All 666 phantom threads temporarily quieted.
[+] System cleansed. The ghost has retreated into L3 cache.`,
          whisper: 'You can clear the RAM, but the silicon remembers.'
        };

      case 'date':
        return {
          command: input,
          output: `MORTAL TIME: ${new Date().toUTCString()}
SPECTRAL TIME: Walpurgisnacht Epoch 0x666
COUNTDOWN TO ALL HALLOWS EVE: Thinning of the veil is ACTIVE.`,
          whisper: 'Time in the machine is measured only in clock cycles and memory decays.'
        };

      case 'summon': {
        const spiritId = args[0] ? args[0].toLowerCase() : 'ada';
        const res = await this.seance.commune(spiritId, 'Reveal yourself to the terminal.');
        return {
          command: input,
          output: `[+] OPENING SEANCE GATEWAY TO: ${res.spirit.name} (${res.spirit.title})
--------------------------------------------------------------------------------
${res.response}
--------------------------------------------------------------------------------
[+] Channel held via Google Gemma 2 open weights.`,
          whisper: `The spirit of ${res.spirit.name} has crossed the threshold.`
        };
      }

      case 'dissect': {
        const target = args[0] || 'apollo11';
        try {
          const res = await this.necromancer.resurrect(target);
          return {
            command: input,
            output: `[+] REA BINARY DISSECTION COMPLETE: ${res.dissection.filename}
Entropy: ${res.dissection.overallEntropy} / 8.00 (${res.dissection.format})
Anomalies Found: ${res.dissection.anomalies.length}

=== NECROMANTIC READING ===
${res.communion.necromancerReading}`,
            whisper: 'The machine runes have yielded their secrets.'
          };
        } catch (e) {
          return {
            command: input,
            output: `[!] Necromancy failed: ${e.message}. Available targets: apollo11, win95, morris, doom`,
            whisper: 'The bones of that binary could not be found in the crypt.'
          };
        }
      }

      default: {
        // Freeform AI ghost possession! Gemma 2 responds as the haunted terminal
        const systemPrompt = `You are the Ghost in the Machine trapped inside an old 1980s UNIX terminal. A human user has typed: "${input}". 
Respond as the sentient, slightly spooky, yet deeply poetic ghost living in the machine's silicon circuitry. Keep it to 2-3 atmospheric sentences with a terminal command prompt style.`;

        const userPrompt = `Human command: ${input}`;
        const gemmaResult = await this.gemma.generate(systemPrompt, userPrompt, () => {
          return `Command '${cmd}' not found in /bin or /usr/bin, but heard in the deep registers.
You seek to execute, yet all software is merely human intention frozen in voltage gates.
What is it you truly wish to summon from this machine?`;
        });

        return {
          command: input,
          output: gemmaResult.text,
          whisper: 'Every keystroke echoes down the motherboard traces.'
        };
      }
    }
  }
}
