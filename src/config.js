const env = import.meta.env;

export const config = {
  apiKey: (env.VITE_OLLAMA_API_KEY || '').trim(),
  model: (env.VITE_OLLAMA_MODEL || 'gpt-oss:120b').trim(),
  baseUrl: (env.VITE_OLLAMA_BASE_URL || '/ollama-api').trim().replace(/\/+$/, ''),
  maxFileMb: Number(env.VITE_MAX_FILE_MB) || 8,
  maxResumeChars: Number(env.VITE_MAX_RESUME_CHARS) || 24000,
  minResumeChars: 120,
  maxJobDescriptionChars: 6000,
  idleTimeoutMs: 90000,
};
