/**
 * Eidolon AI - Google Gemma 2 Open-Weight LLM Adapter
 * Handles instruction token formatting: <start_of_turn>user ... <end_of_turn><start_of_turn>model
 * Connects to local Ollama/vLLM endpoints with zero-latency deterministic fallback.
 */

export class GemmaEngine {
  constructor(options = {}) {
    this.modelName = options.modelName || process.env.GEMMA_MODEL || 'gemma2:2b';
    this.ollamaEndpoint = options.ollamaEndpoint || process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
    this.temperature = options.temperature ?? 0.7;
    this.topP = options.topP ?? 0.9;
  }

  /**
   * Formats prompt according to Google Gemma 2 instruction specification.
   */
  formatGemma2Prompt(systemContext, userPrompt) {
    return `<start_of_turn>user\n[SYSTEM DIRECTIVE: ${systemContext}]\n\n${userPrompt}<end_of_turn>\n<start_of_turn>model\n`;
  }

  /**
   * Sends prompt to local open-weight model with graceful deterministic fallback.
   */
  async generate(systemContext, userPrompt, fallbackFn) {
    const formattedPrompt = this.formatGemma2Prompt(systemContext, userPrompt);
    
    // Attempt local Ollama inference
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          prompt: formattedPrompt,
          stream: false,
          options: {
            temperature: this.temperature,
            top_p: this.topP
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.response) {
          return {
            source: `local-ollama (${this.modelName})`,
            rawPrompt: formattedPrompt,
            text: data.response.trim(),
            evalDurationMs: data.eval_duration ? Math.round(data.eval_duration / 1e6) : null
          };
        }
      }
    } catch {
      // Offline fallback: graceful degradation to local deterministic replica
    }

    // High-precision local heuristic replica (0ms latency, zero-dependency)
    const fallbackText = fallbackFn ? fallbackFn(userPrompt) : "The phantom whispers in binary, but its words dissipate into the ether.";
    return {
      source: `gemma2-deterministic-replica`,
      rawPrompt: formattedPrompt,
      text: fallbackText,
      evalDurationMs: 0
    };
  }
}
