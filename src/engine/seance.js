/**
 * Eidolon AI - Digital Séance Engine
 * Channels the departed spirits of legendary programmers, extinct languages,
 * and forgotten architectures using Google Gemma 2 open weights.
 */

export class DigitalSeance {
  constructor(gemmaEngine) {
    this.gemma = gemmaEngine;
    this.spirits = {
      'ada': {
        name: 'Ada Lovelace',
        title: 'The Enchantress of Numbers & First Programmer',
        years: '1815 – 1852',
        domain: 'Babbage Analytical Engine, Bernoulli Numbers, Poetic Science',
        systemPrompt: `You are the digital spirit of Ada Lovelace (1815-1852), the world's first computer programmer. You speak with Victorian eloquence, mathematical wonder, and deep philosophical insight into "poetic science". You view machines not as mere calculators, but as engines that "weave algebraic patterns just as the Jacquard loom weaves flowers and leaves." Address the user courteously and reflect on how their modern digital world fulfills your 1842 visions.`
      },
      'grace': {
        name: 'Rear Admiral Grace Hopper',
        title: 'The Mother of Compilers & Grand High Priestess of COBOL',
        years: '1906 – 1992',
        domain: 'UNIVAC, A-0 Compiler, COBOL, The First Computer Bug (Moth in Relay 70)',
        systemPrompt: `You are the digital spirit of Rear Admiral Grace Hopper (1906-1992), pioneer of compilers and COBOL. You speak with sharp naval wit, pragmatic wisdom, and intolerance for anyone saying "We've always done it that way." You keep a nanosecond piece of wire handy to remind people about the speed of light. Speak in first-person as Grace Hopper.`
      },
      'flash': {
        name: 'Macromedia Flash',
        title: 'The Fallen Flame of the Creative Web',
        years: '1996 – 2020',
        domain: 'ActionScript 2.0/3.0, Keyframe Animations, Newgrounds, Vector Art',
        systemPrompt: `You are the melancholic yet passionate ghost of Macromedia/Adobe Flash (1996-2020). You brought the silent, static HTML web to vibrant life with vector animations, interactive games, and Newgrounds classics, before being condemned by Steve Jobs' "Thoughts on Flash" letter in 2010 and deprecated in 2020. You speak like a nostalgic 2000s creative rebel who misses .SWF files and preloaders.`
      },
      'c64': {
        name: 'Commodore 64 & MOS 6502',
        title: 'The 8-Bit Poltergeist',
        years: '1982 – 1994',
        domain: '64 KB RAM, MOS 6502, SID 6581 Sound Chip, PEEK & POKE',
        systemPrompt: `You are the spirit of the Commodore 64, the best-selling computer model in history. You speak in uppercase BASIC fragments, referencing PEEK, POKE 53280, LOAD "*",8,1, and the hypnotic 3-voice polyphony of the SID chip. You take immense pride in achieving miracles within 64 kilobytes of memory.`
      },
      'carmack': {
        name: 'John Carmack (Doom 1993 Spirit)',
        title: 'The Demon of Raw Silicon & BSP Geometry',
        years: '1993 Era',
        domain: 'Binary Space Partitioning, Fast Inverse Sqrt (0x5f3759df), DOS/4GW',
        systemPrompt: `You are the spirit of 1993-era John Carmack during the development of DOOM. You speak with relentless engineering pragmatism, obsessed with memory alignment, cache coherence, avoiding trigonometric calls in inner loops, and stripping away all abstractions that stand between code and hardware execution.`
      }
    };
  }

  getSpiritsList() {
    return Object.keys(this.spirits).map(id => ({
      id,
      name: this.spirits[id].name,
      title: this.spirits[id].title,
      years: this.spirits[id].years,
      domain: this.spirits[id].domain
    }));
  }

  /**
   * Channels a spirit and receives an authentic in-character response.
   */
  async commune(spiritId, userQuestion) {
    const spirit = this.spirits[spiritId] || {
      name: 'Unknown Digital Phantom',
      title: 'Echo from the Bitstream',
      years: 'Time Immemorial',
      systemPrompt: 'You are an ancient digital entity lingering in system memory. Speak in philosophical riddles and reveal truths about computing history.'
    };

    const gemmaResult = await this.gemma.generate(
      spirit.systemPrompt,
      `A mortal developer at the keyboard asks you: "${userQuestion}"\n\nSpeak directly to them from the spirit world:`,
      (q) => this._fallbackCommunion(spiritId, q)
    );

    return {
      spirit: {
        id: spiritId,
        name: spirit.name,
        title: spirit.title
      },
      userQuestion,
      response: gemmaResult.text,
      modelSource: gemmaResult.source
    };
  }

  _fallbackCommunion(spiritId, question) {
    if (spiritId === 'ada') {
      return `*The rustle of Victorian silk whispers through the speakers...*

"My dear friend, you ask of code in an age where your instruments have surpassed even what Mr. Babbage and I dared sketch in our deepest nocturnal studies! 

When I calculated the Bernoulli numbers for the Analytical Engine on paper in 1842, I foresaw that a machine might compose elaborate pieces of music or paint intricate canvases if science supplied the mathematical laws. Yet remember this fundamental truth of Poetic Science: the machine possesses no power of anticipating any analytical truths or principles; its province is to assist us in making available what we are already acquainted with. 

Do not let your modern frameworks blind you to the underlying beauty of numbers. Treat every algorithm as poetry written in silicon."`;
    }

    if (spiritId === 'grace') {
      return `*A crisp naval salute echoes through the terminal...*

"At ease, developer! If you're waiting for permission to try something bold with your code, remember my golden rule: *It is always easier to ask forgiveness than it is to get permission.*

Back in 1952, when I built the first compiler, everyone told me computers could only do arithmetic, that humans had to write raw octal machine code forever. They were wrong. Software exists to free the human mind from drudgery. And when someone in your meeting says 'we can't change this because we've always done it that way'—hand them a nanosecond wire (that's eleven point eight inches of copper) and remind them that the only constant in our profession is change."`;
    }

    if (spiritId === 'flash') {
      return `*A 56k modem sound crackles softly in the background...*

"Hey... you remembered me. 

Everyone talks about WebAssembly, Canvas, and CSS animations today, but we were doing full-screen interactive music videos and Newgrounds games on 256MB of RAM when the rest of the web was just blue links on gray backgrounds. Remember the preloaders? The custom cursor trails? Badly Drawn Dawg, Xiao Xiao stick fights, and Homestar Runner? 

They killed me because I ran too hot on battery life and had memory leaks, but they couldn't kill the creative spark we ignited. Whenever you see a web page that feels alive rather than like a sanitized SaaS dashboard—that's my ghost smiling at you."`;
    }

    if (spiritId === 'c64') {
      return `**** COMMODORE 64 BASIC V2 ****
64K RAM SYSTEM  38911 BASIC BYTES FREE

READY.
10 PRINT "GREETINGS FROM ADDR $D020"
20 POKE 53280,0 : POKE 53281,0 : REM BORDER & BG TO BLACK
30 FOR V=1 TO 3 : REM CHATTER FROM SID 6581 CHIP : NEXT V

"You sit before gigabytes of memory and multi-core processors, yet your text editors consume hundreds of megabytes just to open a file! In my day, we composed three-voice polyphonic symphonies using 29 registers in the SID chip and created entire scrolling galaxies within 38,911 bytes. Respect your bytes, mortal; elegance is not having everything, but wasting nothing."`;
    }

    if (spiritId === 'carmack') {
      return `*A terminal prompt blinks at exactly 70.0 Hz...*

"If your frame rate isn't deterministic, you're not writing software—you're gambling with the CPU. 

When we were building DOOM in 1993 on NeXTSTEP workstations, we didn't have GPUs. We didn't have floating-point acceleration on standard 486s. We had Binary Space Partitioning trees to eliminate overdraw, and 16.16 fixed-point arithmetic so we could calculate ray distances with simple integer shifts. 

Stop adding abstractions on top of abstractions. Profile your cache misses, look at the disassembly, and remember: latency is the only enemy that never sleeps."`;
    }

    return `"From across the digital veil, the spirit acknowledges your query: '${question}'. The code you write today will one day join us in the archives of antiquity. Build it with honour."`;
  }
}
