import { useCallback, useRef, useState } from 'react';
import { config } from '../config';
import { validateFile } from '../utils/fileValidation';
import { redactContacts } from '../utils/textUtils';
import { extractResume } from '../services/extractResume';
import { analyzeResume } from '../services/ollamaClient';

const EMPTY_EXTRACT = { status: 'idle', text: '', pages: 0, warnings: [], error: '' };
const EMPTY_CONTEXT = { targetRole: '', experienceLevel: '', jobDescription: '', redact: true };

export function useResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [extract, setExtract] = useState(EMPTY_EXTRACT);
  const [context, setContext] = useState(EMPTY_CONTEXT);
  const [run, setRun] = useState({ status: 'idle', chars: 0, thinking: false, error: null });
  const [result, setResult] = useState(null);
  const [resultId, setResultId] = useState(0);
  const abortRef = useRef(null);
  const tokenRef = useRef(0);

  const selectFile = useCallback(async (f) => {
    const token = ++tokenRef.current;
    setResult(null);
    setRun({ status: 'idle', chars: 0, thinking: false, error: null });

    const check = validateFile(f, config.maxFileMb);
    if (!check.ok) {
      setFile(null);
      setExtract({ ...EMPTY_EXTRACT, status: 'error', error: check.message });
      return;
    }
    setFile(f);
    setExtract({ ...EMPTY_EXTRACT, status: 'loading' });
    try {
      const { text, pages, warnings } = await extractResume(f);
      if (token !== tokenRef.current) return;
      setExtract({ status: 'ready', text, pages, warnings, error: '' });
    } catch (err) {
      if (token !== tokenRef.current) return;
      setFile(null);
      setExtract({ ...EMPTY_EXTRACT, status: 'error', error: err.message || 'We could not read this file.' });
    }
  }, []);

  const removeFile = useCallback(() => {
    tokenRef.current++;
    abortRef.current?.abort();
    setFile(null);
    setExtract(EMPTY_EXTRACT);
    setResult(null);
    setRun({ status: 'idle', chars: 0, thinking: false, error: null });
  }, []);

  const setText = useCallback((text) => {
    setExtract((e) => ({ ...e, text }));
  }, []);

  const updateContext = useCallback((patch) => setContext((c) => ({ ...c, ...patch })), []);

  const analyze = useCallback(async () => {
    if (run.status === 'running') return; // no duplicate parallel calls
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setRun({ status: 'running', chars: 0, thinking: false, error: null });
    try {
      const out = await analyzeResume({
        resumeText: context.redact ? redactContacts(extract.text) : extract.text,
        targetRole: context.targetRole,
        experienceLevel: context.experienceLevel,
        jobDescription: context.jobDescription,
        signal: ctrl.signal,
        onProgress: ({ chars, thinking }) => setRun((r) => (r.status === 'running' ? { ...r, chars, thinking } : r)),
      });
      setResult(out);
      setResultId((n) => n + 1);
      setRun({ status: 'done', chars: 0, thinking: false, error: null });
    } catch (err) {
      if (err.code === 'ABORTED') {
        setRun({ status: 'idle', chars: 0, thinking: false, error: null });
      } else {
        setRun({ status: 'error', chars: 0, thinking: false, error: { code: err.code, message: err.message } });
      }
    }
  }, [run.status, context, extract.text]);

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  const startOver = useCallback(() => {
    tokenRef.current++;
    abortRef.current?.abort();
    setFile(null);
    setExtract(EMPTY_EXTRACT);
    setContext(EMPTY_CONTEXT);
    setResult(null);
    setRun({ status: 'idle', chars: 0, thinking: false, error: null });
  }, []);

  return {
    file, extract, context, run, result, resultId,
    selectFile, removeFile, setText, updateContext, analyze, cancel, startOver,
  };
}
