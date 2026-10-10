const PRIORITY_LABEL = { high: 'High priority', medium: 'Medium priority', low: 'Low priority' };
const FIT_LABEL = { strong: 'Strong fit', possible: 'Possible fit', stretch: 'Stretch' };

const bullets = (items) => (items.length ? items.map((i) => `- ${i}`).join('\n') : '- Nothing reported');

export function buildReportText(r, editState = []) {
  const out = [];
  out.push('RESUME REVIEW', '', r.summary, '');

  out.push('PROFILE');
  if (r.profile.experience_level) out.push(`Experience level: ${r.profile.experience_level}`);
  if (r.profile.education.length) out.push(`Education:\n${bullets(r.profile.education)}`);
  if (r.profile.roles_found.length) out.push(`Roles found:\n${bullets(r.profile.roles_found)}`);
  if (r.profile.skills_found.length) out.push(`Skills found: ${r.profile.skills_found.join(', ')}`);
  out.push('');

  out.push('STRENGTHS');
  out.push(
    r.strengths.length
      ? r.strengths.map((s) => `- ${s.title}${s.evidence ? `\n  Evidence: ${s.evidence}` : ''}${s.impact ? `\n  Why it helps: ${s.impact}` : ''}`).join('\n')
      : '- Nothing reported'
  );
  out.push('');

  out.push('IMPROVEMENTS');
  out.push(
    r.issues.length
      ? r.issues
          .map((i) => `- [${PRIORITY_LABEL[i.priority]}] ${i.issue}\n  Why it matters: ${i.why_it_matters}\n  Fix: ${i.recommendation}`)
          .join('\n')
      : '- Nothing reported'
  );
  out.push('');

  out.push('SUGGESTED EDITS');
  out.push(
    r.suggested_edits.length
      ? r.suggested_edits
          .map((e, idx) => {
            const text = editState[idx]?.text ?? e.rewrite;
            return `- ${e.section || 'Resume'}\n  Original: ${e.original || 'n/a'}\n  Rewrite: ${text}\n  Reason: ${e.reason}`;
          })
          .join('\n')
      : '- Nothing reported'
  );
  out.push('');

  out.push('CAREER MATCHES');
  out.push(
    r.career_matches.length
      ? r.career_matches
          .map((m) => `- ${m.role} (${FIT_LABEL[m.fit]})\n  ${m.reason}${m.gaps.length ? `\n  Gaps: ${m.gaps.join('; ')}` : ''}`)
          .join('\n')
      : '- Nothing reported'
  );
  out.push('');

  out.push('SKILLS GAP');
  out.push(`Shown in the resume:\n${bullets(r.skills_gap.evidenced)}`);
  out.push(`Worth strengthening:\n${bullets(r.skills_gap.to_strengthen)}`);
  out.push(`Not shown in the resume (this does not mean the candidate lacks them):\n${bullets(r.skills_gap.not_evidenced)}`);
  out.push('');

  out.push('30 / 60 / 90-DAY PLAN');
  out.push(`First 30 days:\n${bullets(r.action_plan.days_30)}`);
  out.push(`Days 31 to 60:\n${bullets(r.action_plan.days_60)}`);
  out.push(`Days 61 to 90:\n${bullets(r.action_plan.days_90)}`);
  out.push('');

  if (r.follow_up_questions.length) out.push('QUESTIONS TO ANSWER', bullets(r.follow_up_questions), '');
  out.push(r.disclaimer);
  return out.join('\n');
}

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ul = (items) => (items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '<p class="m">Nothing reported</p>');

export function buildReportHtml(r, editState = []) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Resume review</title>
<style>
body{font:15px/1.55 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0F1B2D;max-width:780px;margin:32px auto;padding:0 24px}
h1{font-size:28px;margin:0 0 6px}h2{font-size:17px;margin:28px 0 8px;padding-bottom:6px;border-bottom:2px solid #0F8B8D}
h3{font-size:15px;margin:14px 0 2px}p{margin:4px 0}.m{color:#5B6B80}
.o{background:#FDE8EA;padding:6px 10px;border-radius:6px;text-decoration:line-through}.n{background:#D9F1F0;padding:6px 10px;border-radius:6px}
li{margin:3px 0}.card{break-inside:avoid;margin:10px 0}
</style></head><body>
<h1>Resume review</h1><p>${esc(r.summary)}</p>
<h2>Profile</h2>
<p><strong>Experience level:</strong> ${esc(r.profile.experience_level) || 'Not stated'}</p>
<h3>Education</h3>${ul(r.profile.education)}
<h3>Roles found</h3>${ul(r.profile.roles_found)}
<h3>Skills found</h3><p>${esc(r.profile.skills_found.join(', ')) || 'Not stated'}</p>
<h2>Strengths</h2>${r.strengths.map((s) => `<div class="card"><h3>${esc(s.title)}</h3><p class="m">Evidence: ${esc(s.evidence)}</p><p>${esc(s.impact)}</p></div>`).join('') || '<p class="m">Nothing reported</p>'}
<h2>Improvements</h2>${r.issues.map((i) => `<div class="card"><h3>${esc(PRIORITY_LABEL[i.priority])}: ${esc(i.issue)}</h3><p class="m">${esc(i.why_it_matters)}</p><p><strong>Fix:</strong> ${esc(i.recommendation)}</p></div>`).join('') || '<p class="m">Nothing reported</p>'}
<h2>Suggested edits</h2>${r.suggested_edits.map((e, idx) => `<div class="card"><h3>${esc(e.section || 'Resume')}</h3>${e.original ? `<p class="o">${esc(e.original)}</p>` : ''}<p class="n">${esc(editState[idx]?.text ?? e.rewrite)}</p><p class="m">${esc(e.reason)}</p></div>`).join('') || '<p class="m">Nothing reported</p>'}
<h2>Career matches</h2>${r.career_matches.map((m) => `<div class="card"><h3>${esc(m.role)} (${esc(FIT_LABEL[m.fit])})</h3><p>${esc(m.reason)}</p>${m.gaps.length ? `<p class="m">Gaps: ${esc(m.gaps.join('; '))}</p>` : ''}</div>`).join('') || '<p class="m">Nothing reported</p>'}
<h2>Skills gap</h2><h3>Shown in the resume</h3>${ul(r.skills_gap.evidenced)}<h3>Worth strengthening</h3>${ul(r.skills_gap.to_strengthen)}<h3>Not shown in the resume</h3>${ul(r.skills_gap.not_evidenced)}
<h2>30 / 60 / 90-day plan</h2><h3>First 30 days</h3>${ul(r.action_plan.days_30)}<h3>Days 31 to 60</h3>${ul(r.action_plan.days_60)}<h3>Days 61 to 90</h3>${ul(r.action_plan.days_90)}
${r.follow_up_questions.length ? `<h2>Questions to answer</h2>${ul(r.follow_up_questions)}` : ''}
<p class="m" style="margin-top:28px">${esc(r.disclaimer)}</p>
</body></html>`;
}

/** Opens a clean printable report. Returns false if the pop-up was blocked. */
export function printReport(r, editState = []) {
  const w = window.open('', '_blank');
  if (!w) return false;
  w.document.open();
  w.document.write(buildReportHtml(r, editState));
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 350);
  return true;
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Applies only the edits the user accepted to a copy of the original text.
 * The uploaded file is never touched.
 */
export function buildRevisedDraft(originalText, edits, editState) {
  let text = originalText;
  let applied = 0;
  const missed = [];
  edits.forEach((e, i) => {
    const st = editState[i];
    if (!st || st.status !== 'accepted' || !e.original) return;
    const needle = e.original.trim();
    if (text.includes(needle)) {
      text = text.replace(needle, () => st.text);
      applied += 1;
      return;
    }
    const loose = new RegExp(escapeRegExp(needle).replace(/\s+/g, '\\s+'));
    if (loose.test(text)) {
      text = text.replace(loose, () => st.text);
      applied += 1;
    } else {
      missed.push(e.original);
    }
  });
  const placeholders = (text.match(/\[[^\]\n]{3,}\]/g) || []).filter((p) => /add|verified|your|result|metric|purpose|tools/i.test(p)).length;
  return { text, applied, missed, placeholders };
}
