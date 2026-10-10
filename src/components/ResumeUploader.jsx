import { useRef, useState } from 'react';
import { formatBytes } from '../utils/fileValidation';
import { UploadIcon, FileIcon, CloseIcon, AlertIcon } from './Icons';

export default function ResumeUploader({ file, extract, onSelect, onRemove, onTextChange, maxMb, maxChars }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [showText, setShowText] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  const over = extract.text.length > maxChars;

  return (
    <div className="panel">
      <div className="panel__head">
        <h3>1. Your resume</h3>
        <p>PDF or DOCX, up to {maxMb} MB. Text is read in your browser.</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-label="Upload resume file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = '';
        }}
      />

      {!file && (
        <div
          className={`dropzone ${drag ? 'is-drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          <span className="dropzone__icon"><UploadIcon width={30} height={30} /></span>
          <p className="dropzone__title">Drop your resume here</p>
          <p className="muted">or choose a file from your device</p>
          <button type="button" className="btn btn--ink" onClick={() => inputRef.current?.click()}>
            Browse files
          </button>
        </div>
      )}

      {extract.status === 'error' && (
        <p className="alert alert--error" role="alert">
          <AlertIcon width={20} height={20} /> <span>{extract.error}</span>
        </p>
      )}

      {file && (
        <div className="filechip">
          <span className="filechip__icon"><FileIcon width={22} height={22} /></span>
          <div className="filechip__meta">
            <strong title={file.name}>{file.name}</strong>
            <span>
              {formatBytes(file.size)}
              {extract.status === 'loading' && ' · Reading text…'}
              {extract.status === 'ready' &&
                ` · ${extract.text.length.toLocaleString()} characters${extract.pages ? ` · ${extract.pages} page${extract.pages > 1 ? 's' : ''}` : ''}`}
            </span>
          </div>
          <button type="button" className="iconbtn" onClick={onRemove} aria-label={`Remove ${file.name}`}>
            <CloseIcon width={20} height={20} />
          </button>
        </div>
      )}

      {extract.status === 'loading' && <div className="skeleton" aria-hidden="true" />}

      {extract.status === 'ready' && (
        <>
          {extract.warnings.map((w) => (
            <p key={w} className="alert alert--warn" role="status">
              <AlertIcon width={20} height={20} /> <span>{w}</span>
            </p>
          ))}
          <button
            type="button"
            className="linkbtn"
            aria-expanded={showText}
            onClick={() => setShowText((s) => !s)}
          >
            {showText ? 'Hide extracted text' : 'Review extracted text'}
          </button>
          {showText && (
            <div className="textreview">
              <textarea
                value={extract.text}
                onChange={(e) => onTextChange(e.target.value)}
                rows={12}
                aria-label="Extracted resume text"
                spellCheck="false"
              />
              <p className={`counter ${over ? 'is-over' : ''}`}>
                {extract.text.length.toLocaleString()} / {maxChars.toLocaleString()} characters. You can edit this text before analyzing.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
