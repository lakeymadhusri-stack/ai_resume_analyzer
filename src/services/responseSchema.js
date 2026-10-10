const str = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());
const arr = (v) =>
  Array.isArray(v) ? v.map(str).filter(Boolean) : typeof v === 'string' && v.trim() ? [v.trim()] : [];
const list = (v, fn) => (Array.isArray(v) ? v.map(fn).filter(Boolean) : []);
const oneOf = (v, allowed, fallback) => {
  const s = str(v).toLowerCase();
  return allowed.includes(s) ? s : fallback;
};

/** Pull a JSON object out of model output (tolerates code fences and stray prose). */
export function parseModelJson(text = '') {
  let t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  try {
    return JSON.parse(t);
  } catch {
    const a = t.indexOf('{');
    const b = t.lastIndexOf('}');
    if (a !== -1 && b > a) return JSON.parse(t.slice(a, b + 1));
    throw new Error('No JSON object found');
  }
}

/** Coerce the parsed response into the exact shape the UI renders. Text only, never HTML. */
export function normalizeResult(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Response is not an object');

  const profile = raw.profile && typeof raw.profile === 'object' ? raw.profile : {};
  const gap = raw.skills_gap && typeof raw.skills_gap === 'object' ? raw.skills_gap : {};
  const plan = raw.action_plan && typeof raw.action_plan === 'object' ? raw.action_plan : {};

  const result = {
    summary: str(raw.summary),
    profile: {
      experience_level: str(profile.experience_level),
      education: arr(profile.education),
      skills_found: arr(profile.skills_found),
      roles_found: arr(profile.roles_found),
    },
    strengths: list(raw.strengths, (s) =>
      s && (s.title || s.evidence) ? { title: str(s.title), evidence: str(s.evidence), impact: str(s.impact) } : null
    ),
    issues: list(raw.issues, (i) =>
      i && (i.issue || i.recommendation)
        ? {
            priority: oneOf(i.priority, ['high', 'medium', 'low'], 'medium'),
            issue: str(i.issue),
            why_it_matters: str(i.why_it_matters),
            recommendation: str(i.recommendation),
          }
        : null
    ),
    suggested_edits: list(raw.suggested_edits, (e) =>
      e && e.rewrite
        ? { section: str(e.section), original: str(e.original), rewrite: str(e.rewrite), reason: str(e.reason) }
        : null
    ),
    career_matches: list(raw.career_matches, (m) =>
      m && m.role
        ? {
            role: str(m.role),
            fit: oneOf(m.fit, ['strong', 'possible', 'stretch'], 'possible'),
            reason: str(m.reason),
            gaps: arr(m.gaps),
          }
        : null
    ),
    skills_gap: {
      evidenced: arr(gap.evidenced),
      to_strengthen: arr(gap.to_strengthen),
      not_evidenced: arr(gap.not_evidenced),
    },
    action_plan: { days_30: arr(plan.days_30), days_60: arr(plan.days_60), days_90: arr(plan.days_90) },
    follow_up_questions: arr(raw.follow_up_questions),
    disclaimer: str(raw.disclaimer) || 'AI-generated feedback. Verify facts and review every suggestion before using it.',
  };

  const hasContent =
    result.summary || result.strengths.length || result.issues.length || result.suggested_edits.length;
  if (!hasContent) throw new Error('Response had no usable content');
  return result;
}
