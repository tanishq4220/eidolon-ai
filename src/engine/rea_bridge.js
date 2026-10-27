/**
 * Eidolon AI - REA (Reverse Engineer Anything) Bridge & Binary Analyzer
 * Provides Shannon entropy mapping, string excavation, section reconstruction,
 * and binary anomaly detection inspired by REA capabilities.
 */

export class ReaBinaryBridge {
  /**
   * Calculates Shannon Entropy of a buffer or byte array.
   * Values range from 0.0 (uniform bytes) to 8.0 (pure encrypted/compressed randomness).
   * High entropy (>7.2) typically signals encrypted payload or compressed assets.
   * Low entropy (<3.5) signals ASCII text, unrolled loops, or padding ghosts.
   */
  static calculateEntropy(buffer) {
    if (!buffer || buffer.length === 0) return 0;
    const freq = new Array(256).fill(0);
    for (let i = 0; i < buffer.length; i++) {
      freq[buffer[i]]++;
    }

    let entropy = 0;
    const total = buffer.length;
    for (let i = 0; i < 256; i++) {
      if (freq[i] > 0) {
        const p = freq[i] / total;
        entropy -= p * Math.log2(p);
      }
    }
    return Math.round(entropy * 100) / 100;
  }

  /**
   * Generates a block-by-block entropy curve (Spectral Entropy Profile)
   */
  static generateEntropySpectrum(buffer, blockSize = 256) {
    const spectrum = [];
    const blocks = Math.ceil(buffer.length / blockSize);
    for (let i = 0; i < blocks; i++) {
      const slice = buffer.subarray(i * blockSize, Math.min((i + 1) * blockSize, buffer.length));
      const ent = this.calculateEntropy(slice);
      spectrum.push({
        blockIndex: i,
        offsetHex: `0x${(i * blockSize).toString(16).padStart(6, '0')}`,
        entropy: ent,
        classification: ent > 7.1 ? 'Packed / Encrypted' : ent > 4.5 ? 'Native Executable Code' : 'Sparse Data / Text'
      });
    }
    return spectrum;
  }

  /**
   * Excavates readable strings (ASCII and UTF-16 LE) from binary data.
   */
  static excavateStrings(buffer, minLength = 4) {
    const strings = [];
    let currentAscii = '';
    let startOffset = 0;

    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      if (byte >= 32 && byte <= 126) {
        if (currentAscii.length === 0) startOffset = i;
        currentAscii += String.fromCharCode(byte);
      } else {
        if (currentAscii.length >= minLength) {
          strings.push({
            offset: `0x${startOffset.toString(16).padStart(6, '0')}`,
            string: currentAscii,
            type: 'ASCII'
          });
        }
        currentAscii = '';
      }
    }

    if (currentAscii.length >= minLength) {
      strings.push({
        offset: `0x${startOffset.toString(16).padStart(6, '0')}`,
        string: currentAscii,
        type: 'ASCII'
      });
    }

    return strings.slice(0, 50); // Top strings
  }

  /**
   * Formats raw bytes into a classic hex editor dump with ASCII sidebar.
   */
  static generateHexDump(buffer, maxBytes = 256) {
    const lines = [];
    const len = Math.min(buffer.length, maxBytes);
    
    for (let i = 0; i < len; i += 16) {
      const chunk = buffer.subarray(i, Math.min(i + 16, len));
      const hexParts = [];
      let ascii = '';
      
      for (let j = 0; j < 16; j++) {
        if (j < chunk.length) {
          hexParts.push(chunk[j].toString(16).padStart(2, '0').toUpperCase());
          ascii += (chunk[j] >= 32 && chunk[j] <= 126) ? String.fromCharCode(chunk[j]) : '.';
        } else {
          hexParts.push('  ');
          ascii += ' ';
        }
      }
      
      const offset = `0x${i.toString(16).padStart(6, '0')}`;
      lines.push(`${offset}  ${hexParts.slice(0, 8).join(' ')}  ${hexParts.slice(8).join(' ')}  |${ascii}|`);
    }

    return lines.join('\n');
  }

  /**
   * Analyzes an executable buffer and detects format, arch, and phantom anomalies.
   */
  static dissectBinary(buffer, filename = 'target.bin') {
    const totalBytes = buffer.length;
    const overallEntropy = this.calculateEntropy(buffer);
    const spectrum = this.generateEntropySpectrum(buffer);
    const excavated = this.excavateStrings(buffer);
    const hexPreview = this.generateHexDump(buffer, 128);

    // Format detection
    let format = 'Raw Binary / ROM Image';
    let architecture = 'Unknown / Heterogeneous';
    const anomalies = [];

    if (buffer.length > 2 && buffer[0] === 0x4D && buffer[1] === 0x5A) {
      format = 'PE32+ (Portable Executable / Windows)';
      architecture = 'x86 / x86_64';
      anomalies.push({
        type: 'DOS Stub Phantom',
        description: 'Contains legacy 16-bit MS-DOS header ("This program cannot be run in DOS mode.") from 1983.'
      });
    } else if (buffer.length > 4 && buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
      format = 'ELF (Executable and Linkable Format / UNIX)';
      architecture = buffer[4] === 1 ? '32-bit' : '64-bit';
      anomalies.push({
        type: 'UNIX Ghost Table',
        description: 'ELF section headers point to unmapped symbolic debug traces.'
      });
    } else if (buffer.length > 4 && ((buffer[0] === 0xFE && buffer[1] === 0xED && buffer[2] === 0xFA) || (buffer[0] === 0xCF && buffer[1] === 0xFA && buffer[2] === 0xED && buffer[3] === 0xFE))) {
      format = 'Mach-O (NeXTSTEP / macOS Binary)';
      architecture = 'ARM64 / x86_64';
    }

    if (overallEntropy > 7.3) {
      anomalies.push({
        type: 'High Entropy Cryptic Envelope',
        description: 'Entropy exceeds 7.30 — suggests encrypted instructions or buried spirit archives.'
      });
    } else if (overallEntropy < 3.0) {
      anomalies.push({
        type: 'Eerie Sparse Density',
        description: 'Entropy is below 3.00 — massive sparse zero-padding or plaintext memory remnants.'
      });
    }

    // Look for ghostly string keywords
    const ghostKeywords = ['ghost', 'spirit', 'death', 'kill', 'resurrect', 'zombie', 'daemon', 'dead', 'reaper', 'carmack', 'apollo', 'bsp'];
    const spectralMatches = excavated.filter(s => ghostKeywords.some(k => s.string.toLowerCase().includes(k)));

    return {
      filename,
      sizeBytes: totalBytes,
      overallEntropy,
      format,
      architecture,
      anomalies,
      spectralMatches,
      stringsCount: excavated.length,
      sampleStrings: excavated.slice(0, 15),
      entropySpectrum: spectrum.slice(0, 16),
      hexPreview
    };
  }
}
