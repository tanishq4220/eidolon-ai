/**
 * Eidolon AI - Frontend Application Controller
 * Handles user interactions, API orchestrations, and visual feedback across all 4 modules.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAtmosphereControls();
  initNecromancerModule();
  initTerminalModule();
  initSeanceModule();
  initOfrendaModule();
});

/* ========================================================================= */
/* 1. ATMOSPHERE & CONTROLS (CRT, AUDIO)                                      */
/* ========================================================================= */
function initAtmosphereControls() {
  const crtBtn = document.getElementById('toggleCrtBtn');
  const crtOverlay = document.getElementById('crtOverlay');
  if (crtBtn && crtOverlay) {
    crtBtn.addEventListener('click', () => {
      crtOverlay.classList.toggle('disabled');
      crtBtn.classList.toggle('bg-spectral/20');
      crtBtn.classList.toggle('border-spectral');
    });
  }

  const audioBtn = document.getElementById('toggleAudioBtn');
  const audioText = document.getElementById('audioStatusText');
  const audioIcon = document.getElementById('audioIcon');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = window.OccultAudio.toggle();
      if (active) {
        audioText.textContent = 'SYNTH: ACTIVE';
        audioBtn.classList.add('bg-ectoplasm/25', 'border-ectoplasm');
        audioBtn.classList.remove('bg-ectoplasm/10');
      } else {
        audioText.textContent = 'SYNTH: OFF';
        audioBtn.classList.remove('bg-ectoplasm/25', 'border-ectoplasm');
        audioBtn.classList.add('bg-ectoplasm/10');
      }
    });
  }
}

/* ========================================================================= */
/* 2. TAB NAVIGATION                                                         */
/* ========================================================================= */
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.add('hidden'));

      tab.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.remove('hidden');
      }

      window.OccultAudio?.playGlitch();
    });
  });
}

/* ========================================================================= */
/* 3. THE BINARY CRYPT (REA + GEMMA 2 NECROMANCY)                            */
/* ========================================================================= */
let activePresetId = 'apollo11';

async function initNecromancerModule() {
  const presetContainer = document.getElementById('presetButtonsContainer');
  const dissectBtn = document.getElementById('invokeResurrectBtn');
  const customBtn = document.getElementById('resurrectCustomBtn');
  const copyHexBtn = document.getElementById('copyHexBtn');

  // Load Presets
  try {
    const res = await fetch('/api/necromancer/presets');
    const data = await res.json();
    if (data.presets && presetContainer) {
      presetContainer.innerHTML = data.presets.map((p, idx) => `
        <button class="preset-btn text-left p-3 rounded-lg border ${idx === 0 ? 'border-ectoplasm bg-ectoplasm/10' : 'border-border bg-surface/60'} hover:border-ectoplasm/80 hover:bg-card transition flex items-center justify-between group" data-preset="${p.id}">
          <div>
            <div class="text-xs font-mono font-bold text-white group-hover:text-ectoplasm transition">${p.name}</div>
            <div class="text-[11px] text-gray-400 font-mono">${p.architecture} &bull; ${p.era}</div>
          </div>
          <span class="text-xs text-gray-500 group-hover:text-ectoplasm">→</span>
        </button>
      `).join('');

      // Bind Preset clicks
      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.preset-btn').forEach(b => {
            b.classList.remove('border-ectoplasm', 'bg-ectoplasm/10');
            b.classList.add('border-border', 'bg-surface/60');
          });
          btn.classList.add('border-ectoplasm', 'bg-ectoplasm/10');
          btn.classList.remove('border-border', 'bg-surface/60');
          activePresetId = btn.getAttribute('data-preset');
          executeDissection(activePresetId);
        });
      });
    }
  } catch (err) {
    console.error('Failed to load presets:', err);
  }

  // Initial Run with Default Preset
  executeDissection('apollo11');

  if (dissectBtn) {
    dissectBtn.addEventListener('click', () => {
      executeDissection(activePresetId);
    });
  }

  if (customBtn) {
    customBtn.addEventListener('click', () => {
      const hex = document.getElementById('customHexInput').value.trim();
      if (!hex) {
        alert('Please paste valid hexadecimal bytes first.');
        return;
      }
      executeDissection(null, hex);
    });
  }

  if (copyHexBtn) {
    copyHexBtn.addEventListener('click', () => {
      const text = document.getElementById('hexDumpContainer').textContent;
      navigator.clipboard.writeText(text);
      copyHexBtn.innerHTML = `<span>✓ Copied</span>`;
      setTimeout(() => {
        copyHexBtn.innerHTML = `<i data-lucide="copy" class="w-3 h-3"></i><span>Copy Dump</span>`;
        lucide.createIcons();
      }, 2000);
    });
  }
}

async function executeDissection(presetId, customHex = null) {
  const targetLabel = document.getElementById('dissectionTargetName');
  const formatLabel = document.getElementById('dissectionFormat');
  const sizeLabel = document.getElementById('dissectionSize');
  const entropyVal = document.getElementById('entropyValueText');
  const entropyBar = document.getElementById('entropyBar');
  const entropyDiag = document.getElementById('entropyDiagnosis');
  const hexContainer = document.getElementById('hexDumpContainer');
  const readingContent = document.getElementById('necromancerReadingContent');
  const readingModel = document.getElementById('readingModelTag');
  const histogram = document.getElementById('entropyHistogram');

  if (targetLabel) targetLabel.textContent = presetId ? `${presetId}.bin [Analyzing...]` : 'custom_artifact.bin [Analyzing...]';
  if (readingContent) readingContent.innerHTML = `<div class="text-ectoplasm font-mono text-xs flex items-center gap-2"><div class="w-3 h-3 border-2 border-ectoplasm border-t-transparent rounded-full animate-spin"></div> Communicating with REA bridge and channeling Gemma 2...</div>`;

  window.OccultAudio?.playGlitch();

  try {
    const res = await fetch('/api/necromancer/resurrect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presetId, customHex })
    });
    const data = await res.json();

    if (data.error) {
      readingContent.innerHTML = `<span class="text-blood font-mono text-xs">Error: ${data.error}</span>`;
      return;
    }

    const { dissection, communion } = data;

    // Update Telemetry
    targetLabel.textContent = dissection.filename;
    formatLabel.textContent = dissection.format;
    sizeLabel.textContent = `${dissection.sizeBytes.toLocaleString()} B`;

    // Entropy
    entropyVal.textContent = `${dissection.overallEntropy.toFixed(2)} / 8.00`;
    const pct = Math.min(100, (dissection.overallEntropy / 8.0) * 100);
    entropyBar.style.width = `${pct}%`;

    if (dissection.overallEntropy > 7.1) {
      entropyDiag.textContent = '• High Entropy: Cryptic density signals packed code, encrypted payloads, or compressed spirit archives.';
      entropyBar.className = 'h-full bg-gradient-to-r from-spectral to-blood transition-all duration-700';
    } else if (dissection.overallEntropy < 3.5) {
      entropyDiag.textContent = '• Low Entropy: Sparse plain text, unrolled jump tables, or uninitialized ghost memory padding.';
      entropyBar.className = 'h-full bg-gradient-to-r from-blue-500 to-spiritCyan transition-all duration-700';
    } else {
      entropyDiag.textContent = '• Balanced Entropy: Executable native machine code and interleaved mathematical matrices.';
      entropyBar.className = 'h-full bg-gradient-to-r from-ectoplasm via-spiritCyan to-spectral transition-all duration-700';
    }

    // Entropy Histogram
    if (histogram && dissection.entropySpectrum) {
      histogram.innerHTML = dissection.entropySpectrum.map(block => {
        const heightPct = Math.max(10, (block.entropy / 8.0) * 100);
        const col = block.entropy > 7.1 ? 'bg-blood' : block.entropy > 4.5 ? 'bg-ectoplasm' : 'bg-spiritCyan';
        return `<div class="flex-1 ${col} rounded-t transition-all hover:opacity-80" style="height: ${heightPct}%;" title="${block.offsetHex}: ${block.entropy} (${block.classification})"></div>`;
      }).join('');
    }

    // Hex Preview
    hexContainer.textContent = dissection.hexPreview;

    // Necromancer Reading (convert markdown headers into styled blocks)
    readingModel.textContent = communion.modelSource;
    readingContent.innerHTML = formatMarkdown(communion.necromancerReading);

    window.OccultAudio?.playChime(380);

  } catch (err) {
    readingContent.innerHTML = `<span class="text-blood font-mono text-xs">Communion failed: ${err.message}</span>`;
  }
}

/* ========================================================================= */
/* 4. POSSESSED SHELL (HAUNTED TERMINAL)                                     */
/* ========================================================================= */
function initTerminalModule() {
  const terminalStream = document.getElementById('terminalStream');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSendBtn = document.getElementById('terminalSendBtn');
  const clearBtn = document.getElementById('clearTerminalBtn');
  const chips = document.querySelectorAll('.terminal-chip');

  const history = [];
  let historyIdx = -1;

  async function handleCommand(cmdText) {
    if (!cmdText.trim()) return;
    history.push(cmdText);
    historyIdx = history.length;

    // Append user input
    appendTerminalLine(`ghost@eidolon:~$ ${cmdText}`, 'text-white font-bold');
    terminalInput.value = '';

    window.OccultAudio?.playGlitch();

    // Call API
    try {
      const res = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdText })
      });
      const data = await res.json();

      if (data.output) {
        appendTerminalLine(data.output, 'text-ectoplasm/90');
      }
      if (data.whisper) {
        appendTerminalLine(`⚡ [whisper]: ${data.whisper}`, 'text-spectral/80 italic');
      }
    } catch (err) {
      appendTerminalLine(`[!] Shell Error: ${err.message}`, 'text-blood');
    }

    terminalStream.scrollTop = terminalStream.scrollHeight;
  }

  function appendTerminalLine(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    line.style.whiteSpace = 'pre-wrap';
    line.textContent = text;
    terminalStream.appendChild(line);
  }

  if (terminalSendBtn && terminalInput) {
    terminalSendBtn.addEventListener('click', () => handleCommand(terminalInput.value));
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleCommand(terminalInput.value);
      } else if (e.key === 'ArrowUp') {
        if (historyIdx > 0) {
          historyIdx--;
          terminalInput.value = history[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < history.length - 1) {
          historyIdx++;
          terminalInput.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          terminalInput.value = '';
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalStream.innerHTML = `<div class="text-gray-500 font-mono text-xs">Terminal cleared. The void remains.</div>`;
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      handleCommand(cmd);
    });
  });
}

/* ========================================================================= */
/* 5. DIGITAL SÉANCE MODULE                                                  */
/* ========================================================================= */
let activeSpiritId = 'ada';

async function initSeanceModule() {
  const container = document.getElementById('spiritsCardsContainer');
  const activeLabel = document.getElementById('activeSpiritName');
  const communeBtn = document.getElementById('communeBtn');
  const questionInput = document.getElementById('seanceQuestionInput');
  const responseBox = document.getElementById('seanceResponseBox');
  const responseText = document.getElementById('seanceResponseText');
  const responseLabel = document.getElementById('responseSpiritLabel');
  const promptChips = document.querySelectorAll('.seance-prompt-chip');

  try {
    const res = await fetch('/api/seance/spirits');
    const data = await res.json();
    if (data.spirits && container) {
      container.innerHTML = data.spirits.map((s, idx) => `
        <div class="spirit-card bg-card/80 border ${idx === 0 ? 'border-spectral bg-spectral/10' : 'border-border'} hover:border-spectral/80 rounded-2xl p-5 space-y-3 cursor-pointer transition group shadow-lg" data-spirit="${s.id}">
          <div class="flex items-center justify-between">
            <span class="text-2xl">${getSpiritEmoji(s.id)}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-spectral/15 text-spectral border border-spectral/30">${s.years}</span>
          </div>
          <div>
            <h4 class="font-display font-bold text-base text-white group-hover:text-spectral transition">${s.name}</h4>
            <p class="text-xs text-gray-400 font-medium">${s.title}</p>
          </div>
          <p class="text-[11px] text-gray-300 font-mono border-t border-border/80 pt-2">${s.domain}</p>
          <button class="w-full py-1.5 rounded-lg border border-spectral/40 text-spectral text-xs font-mono group-hover:bg-spectral group-hover:text-white transition">Channel Spirit</button>
        </div>
      `).join('');

      document.querySelectorAll('.spirit-card').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.spirit-card').forEach(c => {
            c.classList.remove('border-spectral', 'bg-spectral/10');
            c.classList.add('border-border');
          });
          card.classList.add('border-spectral', 'bg-spectral/10');
          card.classList.remove('border-border');
          activeSpiritId = card.getAttribute('data-spirit');
          const nameElem = card.querySelector('h4');
          if (nameElem && activeLabel) activeLabel.textContent = nameElem.textContent;
          window.OccultAudio?.playGlitch();
        });
      });
    }
  } catch (err) {
    console.error('Failed to load spirits:', err);
  }

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      questionInput.value = chip.textContent;
    });
  });

  if (communeBtn) {
    communeBtn.addEventListener('click', async () => {
      const q = questionInput.value.trim();
      if (!q) {
        alert('Please ask a question to commune with the spirit.');
        return;
      }

      responseBox.classList.remove('hidden');
      responseText.textContent = 'Holding the spectral frequency... Communing with Google Gemma 2...';
      window.OccultAudio?.playChime(432);

      try {
        const res = await fetch('/api/seance/commune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spiritId: activeSpiritId, question: q })
        });
        const data = await res.json();

        if (data.error) {
          responseText.textContent = `Channel Error: ${data.error}`;
          return;
        }

        responseLabel.textContent = `${data.spirit.name} (${data.spirit.title})`;
        typewriterEffect(responseText, data.response);
        window.OccultAudio?.playChime(528);

      } catch (err) {
        responseText.textContent = `Séance disrupted: ${err.message}`;
      }
    });
  }
}

function getSpiritEmoji(id) {
  const map = {
    'ada': '👑',
    'grace': '⚓',
    'flash': '⚡',
    'c64': '🕹️',
    'carmack': '🧠'
  };
  return map[id] || '👻';
}

/* ========================================================================= */
/* 6. VIRTUAL OFRENDA (DÍA DE LOS MUERTOS ALTAR)                            */
/* ========================================================================= */
async function initOfrendaModule() {
  const container = document.getElementById('ofrendaCardsContainer');
  const headerCandleCount = document.getElementById('headerCandleCount');
  const modal = document.getElementById('newMemorialModal');
  const openModalBtn = document.getElementById('openNewMemorialModalBtn');
  const closeModalBtn = document.getElementById('closeMemorialModalBtn');
  const cancelBtn = document.getElementById('cancelMemorialBtn');
  const submitBtn = document.getElementById('submitMemorialBtn');

  async function loadMemorials() {
    try {
      const res = await fetch('/api/ofrenda/memorials');
      const data = await res.json();
      if (data.memorials && container) {
        let totalCandles = 0;
        container.innerHTML = data.memorials.map(m => {
          totalCandles += m.candlesLit;
          return `
            <div class="ofrenda-card bg-card/85 border border-cempasuchil/30 rounded-2xl p-6 space-y-4 shadow-[0_0_25px_rgba(255,153,0,0.08)] relative overflow-hidden">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center space-x-2">
                    <h4 class="font-display font-bold text-lg text-white">${m.name}</h4>
                    <span class="text-xs font-mono text-cempasuchil">${m.years}</span>
                  </div>
                  <div class="text-[11px] font-mono text-gray-400 mt-1 flex items-center gap-3">
                    <span class="flex items-center gap-1 text-cempasuchil font-semibold"><span class="candle-flame inline-block"></span> <span class="candle-counter" id="candle-count-${m.id}">${m.candlesLit.toLocaleString()}</span> Flames Burning</span>
                    <span>&bull;</span>
                    <span class="text-amber-400">🌼 ${m.cempasuchilPetals.toLocaleString()} Petals</span>
                  </div>
                </div>

                <button class="light-candle-btn px-3 py-1.5 rounded-xl bg-cempasuchil/15 border border-cempasuchil/50 hover:bg-cempasuchil/30 text-cempasuchil text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(255,153,0,0.2)]" data-id="${m.id}">
                  <span>🕯️</span>
                  <span>Light Candle</span>
                </button>
              </div>

              <div class="p-4 rounded-xl bg-void/80 border border-border/80 text-xs font-body text-gray-300 leading-relaxed italic whitespace-pre-line">
                ${m.epitaph}
              </div>

              <!-- Offerings Tray -->
              <div class="pt-2 border-t border-border/80 space-y-2">
                <span class="text-[11px] font-mono text-gray-400">Leave an Offering on the Altar:</span>
                <div class="flex flex-wrap gap-1.5">
                  <button class="offering-btn px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-cempasuchil text-xs text-gray-300 hover:text-white transition" data-id="${m.id}" data-type="marigold">🌼 Cempasúchil</button>
                  <button class="offering-btn px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-cempasuchil text-xs text-gray-300 hover:text-white transition" data-id="${m.id}" data-type="floppy">💾 3.5" Disk</button>
                  <button class="offering-btn px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-cempasuchil text-xs text-gray-300 hover:text-white transition" data-id="${m.id}" data-type="pull_request">🔀 Final PR</button>
                  <button class="offering-btn px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-cempasuchil text-xs text-gray-300 hover:text-white transition" data-id="${m.id}" data-type="coffee">☕ Cafecito</button>
                  <button class="offering-btn px-2.5 py-1 rounded-lg bg-surface border border-border hover:border-cempasuchil text-xs text-gray-300 hover:text-white transition" data-id="${m.id}" data-type="pan_de_muerto">🍞 Pan de Muerto</button>
                </div>
              </div>

              <!-- Recent Offerings -->
              <div class="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 overflow-x-auto">
                <span class="text-gray-500">Offerings:</span>
                ${m.offerings && m.offerings.length ? m.offerings.slice(-3).map(o => `<span class="bg-surface/80 px-2 py-0.5 rounded border border-border/60 text-gray-300">${o.label}</span>`).join('') : '<span class="text-gray-600">Altar newly consecrated</span>'}
              </div>
            </div>
          `;
        }).join('');

        if (headerCandleCount) headerCandleCount.textContent = totalCandles.toLocaleString();

        // Bind Candle clicks
        document.querySelectorAll('.light-candle-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            window.OccultAudio?.playChime(660);
            try {
              const res = await fetch('/api/ofrenda/light-candle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memorialId: id })
              });
              const d = await res.json();
              if (d.candlesLit) {
                const countElem = document.getElementById(`candle-count-${id}`);
                if (countElem) countElem.textContent = d.candlesLit.toLocaleString();
                totalCandles++;
                if (headerCandleCount) headerCandleCount.textContent = totalCandles.toLocaleString();
                btn.classList.add('scale-110');
                setTimeout(() => btn.classList.remove('scale-110'), 300);
              }
            } catch (err) {
              console.error(err);
            }
          });
        });

        // Bind Offering clicks
        document.querySelectorAll('.offering-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const type = btn.getAttribute('data-type');
            window.OccultAudio?.playChime(528);
            try {
              await fetch('/api/ofrenda/leave-offering', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memorialId: id, offeringType: type })
              });
              loadMemorials();
            } catch (err) {
              console.error(err);
            }
          });
        });
      }
    } catch (err) {
      console.error('Failed to load memorials:', err);
    }
  }

  loadMemorials();

  // Modal Handlers
  if (openModalBtn) openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('memorialNameInput').value.trim();
      const years = document.getElementById('memorialYearsInput').value.trim();
      const notes = document.getElementById('memorialNotesInput').value.trim();

      if (!name) {
        alert('Please provide a project name.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Generating Eulogy with Gemma 2...';

      try {
        const res = await fetch('/api/ofrenda/create-memorial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, years, notes })
        });
        const d = await res.json();

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="flame" class="w-3.5 h-3.5"></i><span>Light the Altar (Generate Eulogy)</span>`;
        modal.classList.add('hidden');
        lucide.createIcons();

        document.getElementById('memorialNameInput').value = '';
        document.getElementById('memorialYearsInput').value = '';
        document.getElementById('memorialNotesInput').value = '';

        loadMemorials();
        window.OccultAudio?.playChime(432);

      } catch (err) {
        alert(`Error: ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Light the Altar (Generate Eulogy)';
      }
    });
  }
}

/* ========================================================================= */
/* HELPERS                                                                   */
/* ========================================================================= */
function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h4 class="text-sm font-bold text-white mt-4 mb-1 font-display border-b border-border/60 pb-1">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="text-base font-bold text-ectoplasm mt-4 mb-2 font-display">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="text-gray-300 italic">$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-void px-1.5 py-0.5 rounded text-spiritCyan font-mono text-[11px]">$1</code>')
    .replace(/\n\n/gim, '<br><br>');
}

function typewriterEffect(element, fullText, speed = 12) {
  element.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < fullText.length) {
      element.textContent += fullText.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}
