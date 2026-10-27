/**
 * Eidolon AI - Virtual Ofrenda Engine (Día de los Muertos Digital Altar)
 * Honors fallen open-source projects, deprecated frameworks, and extinct platforms.
 * Generates poetic bilingual eulogies and manages ritual offerings (candles, marigolds, copal).
 */

export class OfrendaEngine {
  constructor(gemmaEngine) {
    this.gemma = gemmaEngine;
    this.altarItems = this._initializeAltar();
  }

  getMemorials() {
    return this.altarItems.map(item => ({
      id: item.id,
      name: item.name,
      years: item.years,
      epitaph: item.epitaph,
      candlesLit: item.candlesLit,
      offerings: item.offerings,
      cempasuchilPetals: item.cempasuchilPetals
    }));
  }

  /**
   * Lights a candle on a memorial altar.
   */
  lightCandle(memorialId) {
    const item = this.altarItems.find(m => m.id === memorialId);
    if (!item) throw new Error(`Memorial ${memorialId} not found`);
    item.candlesLit += 1;
    item.cempasuchilPetals += 12;
    return {
      memorialId,
      name: item.name,
      candlesLit: item.candlesLit,
      cempasuchilPetals: item.cempasuchilPetals,
      message: `🕯️ A candle has been ignited on the altar for ${item.name}. Its memory burns bright.`
    };
  }

  /**
   * Leaves a symbolic offering (cempasuchil, pan_de_muerto, floppy_disk, pull_request, copal).
   */
  leaveOffering(memorialId, offeringType) {
    const item = this.altarItems.find(m => m.id === memorialId);
    if (!item) throw new Error(`Memorial ${memorialId} not found`);

    const validOfferings = {
      'marigold': '🌼 Golden Cempasúchil (Guide the spirit back)',
      'floppy': '💾 3.5" Verbatim Floppy Disk (Rest in read-only peace)',
      'pull_request': '🔀 Final Merged Pull Request (Honoring their commits)',
      'coffee': '☕ Steaming Midnight Cafecito (For late-night debugging)',
      'pan_de_muerto': '🍞 Pan de Muerto (Sweet bread of remembrance)'
    };

    const label = validOfferings[offeringType] || validOfferings['marigold'];
    item.offerings.push({
      type: offeringType,
      label,
      timestamp: new Date().toISOString()
    });

    return {
      memorialId,
      name: item.name,
      totalOfferings: item.offerings.length,
      latestOffering: label
    };
  }

  /**
   * Crafts a new personalized memorial with Gemma 2.
   */
  async createCustomMemorial(name, years, obituaryNotes) {
    const systemPrompt = `You are the Poet of the Digital Ofrenda for Día de los Muertos. You write moving, respectful, and slightly nostalgic eulogies celebrating deprecated technologies, abandoned codebases, and extinct software. Blend reverence for software history with the warmth and poetry of Día de los Muertos (marigolds, flickering candles, enduring memories). Return a structured markdown tribute with:
1. 🌼 Epitaph Title (English + Spanish)
2. 🕯️ The Journey & Contribution (What did this code give to the world?)
3. 🍞 The Offering of Gratitude (Why its spirit still lives in our current architectures)
4. 🌟 Final Blessing ("Que en paz descanse en el gran repositorio celestial").`;

    const userPrompt = `Entity Name: ${name}
Active Years: ${years}
Notes from Creator/Dev: ${obituaryNotes}`;

    const gemmaResult = await this.gemma.generate(systemPrompt, userPrompt, () => {
      return `### 🌼 Epitaph: ${name} (${years})
*Recuerdo Eterno en Silicon y Luz*

### 🕯️ The Journey & Contribution
${name} was born in an era of rapid digital exploration. For years, its loops and functions powered dreams, served users, and solved real-world problems. It carried the burden of early architectural experiments so that the modern web could run faster and soar higher.

### 🍞 The Offering of Gratitude
Though its repository now rests in read-only archive status and its dependencies are deprecated, no line of code was written in vain. The lessons learned, the muscle memory built by its developers, and the design patterns it pioneered live on inside every modern compiler.

### 🌟 Final Blessing
*Que sus commits descansen en paz en el gran repositorio celestial.* We place yellow cempasúchil petals and light this candle so its digital soul will always find its way home. 🌼🕯️`;
    });

    const newId = `custom-${Date.now()}`;
    const newMemorial = {
      id: newId,
      name,
      years,
      epitaph: gemmaResult.text,
      candlesLit: 1,
      offerings: [{ type: 'marigold', label: '🌼 Golden Cempasúchil', timestamp: new Date().toISOString() }],
      cempasuchilPetals: 24
    };

    this.altarItems.unshift(newMemorial);

    return {
      memorial: newMemorial,
      modelSource: gemmaResult.source
    };
  }

  _initializeAltar() {
    return [
      {
        id: 'flash',
        name: 'Macromedia / Adobe Flash',
        years: '1996 – 2020',
        candlesLit: 1024,
        cempasuchilPetals: 4096,
        epitaph: `*El Fuego Creativo de la Web Temprana*\n\nFlash gave us interactive web games, Homestar Runner, Alien Hominid, and vector animations long before modern canvas existed. We leave a 🌼 Cempasúchil flower and an ActionScript 2.0 reference guide on its altar. Your keyframes will never be forgotten.`,
        offerings: [
          { type: 'floppy', label: '💾 Flash 5 Install CD-ROM', timestamp: '2026-10-27T00:00:00Z' },
          { type: 'marigold', label: '🌼 Golden Marigolds', timestamp: '2026-10-27T00:00:00Z' }
        ]
      },
      {
        id: 'angularjs',
        name: 'AngularJS 1.x',
        years: '2010 – 2021',
        candlesLit: 512,
        cempasuchilPetals: 2048,
        epitaph: `*El Pionero del Two-Way Data Binding*\n\nAngularJS taught a whole generation of developers how to build Single Page Applications with \`$scope\` and directives. Though replaced by modern component models, its legacy paved the highway we travel today. *Descansa en paz, $scope.*`,
        offerings: [
          { type: 'coffee', label: '☕ Late Night Debugging Coffee', timestamp: '2026-10-27T00:00:00Z' }
        ]
      },
      {
        id: 'windowsphone',
        name: 'Windows Phone & Metro UI',
        years: '2010 – 2017',
        candlesLit: 768,
        cempasuchilPetals: 1536,
        epitaph: `*La Belleza Olvidada de las Live Tiles*\n\nWith typography-driven design, fluid 60fps animations, and beautiful live tiles, Windows Phone proved that mobile interfaces didn't have to be grids of static icons. We light this candle for the most elegant mobile UI ever created.`,
        offerings: [
          { type: 'pan_de_muerto', label: '🍞 Pan de Muerto Tradicional', timestamp: '2026-10-27T00:00:00Z' }
        ]
      },
      {
        id: 'netscape',
        name: 'Netscape Navigator',
        years: '1994 – 2008',
        candlesLit: 1994,
        cempasuchilPetals: 8192,
        epitaph: `*El Timón que Navegó la Primera Red*\n\nNetscape gave birth to JavaScript in 10 sleepless days in May 1995 thanks to Brendan Eich. Every browser running today carries the DNA of the ship that brought humanity onto the web.`,
        offerings: [
          { type: 'floppy', label: '💾 Netscape Navigator 3.0 Gold Disk', timestamp: '2026-10-27T00:00:00Z' },
          { type: 'marigold', label: '🌼 Cempasúchil Altar Petals', timestamp: '2026-10-27T00:00:00Z' }
        ]
      }
    ];
  }
}
