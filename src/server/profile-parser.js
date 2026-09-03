/**
 * CV text → structured CandidateProfile (blueprint p.06 step 4).
 *
 * "Raw OCR text is normalized into a CandidateProfile — skills, experience
 * years, education, past roles — using rule-based parsing plus an LLM
 * extraction pass for edge cases."
 *
 * This is the rule-based half. It is pure (no Glide, no network) so it can be
 * unit-tested against real CV text offline, and it always runs first — the LLM
 * pass is only asked to fill what this could not find. That keeps cost down and
 * makes the common case deterministic and reproducible.
 *
 * `data_confidence` is the honest output here: it reports how much of the
 * profile was actually found rather than guessed, and feeds the scoring penalty.
 */

/** Degree keywords ranked by level, highest first (order matters). */
const EDUCATION_LEVELS = [
    { level: 5, label: 'Doctorate', patterns: ['ph.d', 'phd', 'doctorate', 'doctoral'] },
    { level: 4, label: 'Master', patterns: ['master', 'msc', 'm.sc', 'mba', 'mtech', 'maîtrise', 'magistere'] },
    { level: 3, label: 'Bachelor', patterns: ['bachelor', 'bsc', 'b.sc', 'btech', 'licence', 'ingénieur', 'ingenieur', 'engineering degree'] },
    { level: 2, label: 'Associate', patterns: ['associate', 'dut', 'bts', 'diploma', 'diplome', 'diplôme'] },
    { level: 1, label: 'Secondary', patterns: ['high school', 'baccalaureat', 'baccalauréat', 'secondary'] },
]

/**
 * Baseline technical vocabulary. The job offer's own required skills are always
 * added on top of this, so a niche requirement is still detected even if it is
 * not listed here.
 */
const BASE_SKILL_VOCABULARY = [
    'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'go', 'rust', 'php', 'ruby', 'scala', 'kotlin', 'swift',
    'react', 'angular', 'vue', 'node.js', 'nodejs', 'express', 'django', 'flask', 'spring', '.net',
    'sql', 'mysql', 'postgresql', 'oracle', 'mongodb', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github actions',
    'servicenow', 'salesforce', 'sap', 'workday',
    'git', 'linux', 'bash', 'ci/cd', 'devops', 'agile', 'scrum', 'kanban', 'jira',
    'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'pandas', 'numpy',
    'rest', 'graphql', 'grpc', 'microservices', 'kafka', 'rabbitmq',
]

const SOFT_SKILL_KEYWORDS = [
    'leadership', 'mentoring', 'communication', 'collaboration', 'teamwork', 'stakeholder',
    'presentation', 'negotiation', 'problem solving', 'analytical', 'autonomous', 'initiative',
    'adaptability', 'coaching', 'facilitation', 'cross-functional', 'ownership',
]

function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ')
}

/** Escape a literal for safe use inside a RegExp. */
function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Whole-token match. Avoids "java" matching inside "javascript" or "go" inside
 * "django", while still handling terms that carry punctuation.
 *
 * A boundary is only required on the side where the term itself starts/ends
 * with an alphanumeric. That is what lets ".net" match inside "ASP.NET" and
 * "c++" match at the end of a line, while "postgresql" still matches when a
 * sentence ends immediately after it.
 */
function containsTerm(haystack, term) {
    const raw = String(term).toLowerCase()
    const t = escapeRegExp(raw)
    const prefix = /^[a-z0-9]/.test(raw) ? '(^|[^a-z0-9])' : ''
    const suffix = /[a-z0-9]$/.test(raw) ? '($|[^a-z0-9])' : ''
    return new RegExp(prefix + t + suffix, 'i').test(haystack)
}

/** Extract skills present in the text, from vocabulary + any extra terms. */
export function extractSkills(text, extraVocabulary) {
    const haystack = normalize(text)
    if (!haystack) return []

    const vocab = BASE_SKILL_VOCABULARY.concat(
        (extraVocabulary || []).map((s) => String(s).toLowerCase())
    )

    const found = []
    const seen = {}
    for (let i = 0; i < vocab.length; i++) {
        const term = vocab[i]
        if (seen[term]) continue
        if (containsTerm(haystack, term)) {
            seen[term] = true
            found.push(term)
        }
    }
    return found
}

/**
 * Years of experience. Prefers an explicit claim ("7+ years of experience"),
 * falling back to the span covered by date ranges found in the text.
 */
export function extractExperienceYears(text) {
    const haystack = normalize(text)
    if (!haystack) return { years: 0, source: 'none' }

    // "7 years", "7+ years", "7 ans"
    let best = 0
    const explicit = haystack.match(/(\d{1,2})\s*\+?\s*(?:years?|yrs?|ans)\b/g) || []
    for (let i = 0; i < explicit.length; i++) {
        const n = parseInt(explicit[i], 10)
        if (!isNaN(n) && n > best && n <= 50) best = n
    }
    if (best > 0) return { years: best, source: 'explicit' }

    // Fall back to date ranges: "2019 - 2023", "2019 to present"
    const ranges = haystack.match(/(19|20)\d{2}\s*(?:-|–|—|to|au?)\s*((19|20)\d{2}|present|current|aujourd'hui)/g) || []
    if (ranges.length === 0) return { years: 0, source: 'none' }

    const thisYear = new Date().getUTCFullYear()
    let earliest = thisYear
    let latest = 0
    for (let i = 0; i < ranges.length; i++) {
        const years = ranges[i].match(/(19|20)\d{2}/g) || []
        const start = parseInt(years[0], 10)
        const end = years.length > 1 ? parseInt(years[1], 10) : thisYear
        if (!isNaN(start) && start < earliest) earliest = start
        if (!isNaN(end) && end > latest) latest = end
    }
    const span = Math.max(0, latest - earliest)
    return { years: Math.min(span, 50), source: span > 0 ? 'date_range' : 'none' }
}

/** Highest education level detected. */
export function extractEducation(text) {
    const haystack = normalize(text)
    for (let i = 0; i < EDUCATION_LEVELS.length; i++) {
        const entry = EDUCATION_LEVELS[i]
        for (let j = 0; j < entry.patterns.length; j++) {
            if (haystack.indexOf(entry.patterns[j]) !== -1) {
                return { level: entry.level, label: entry.label }
            }
        }
    }
    return { level: 0, label: 'Unknown' }
}

/** Soft-skill keywords present — the raw signal behind `soft_skills_signal`. */
export function extractSoftSkills(text) {
    const haystack = normalize(text)
    const found = []
    for (let i = 0; i < SOFT_SKILL_KEYWORDS.length; i++) {
        if (haystack.indexOf(SOFT_SKILL_KEYWORDS[i]) !== -1) found.push(SOFT_SKILL_KEYWORDS[i])
    }
    return found
}

/** Contact details, used to reconcile a CV with its Candidate record. */
export function extractContact(text) {
    const raw = String(text || '')
    const email = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const phone = raw.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,4}\d{2,4}/)
    return {
        email: email ? email[0] : null,
        phone: phone && phone[0].replace(/\D/g, '').length >= 8 ? phone[0].trim() : null,
    }
}

/**
 * Parse raw OCR text into the CandidateProfile shape.
 *
 * @param {string} rawText            OCR output
 * @param {string[]} [requiredSkills] skills named by the job offer, added to the vocabulary
 * @returns profile object ready to write to x_winu_hireme_candidate_profile
 */
export function parseProfile(rawText, requiredSkills) {
    const text = String(rawText || '')
    const skills = extractSkills(text, requiredSkills)
    const experience = extractExperienceYears(text)
    const education = extractEducation(text)
    const softSkills = extractSoftSkills(text)
    const contact = extractContact(text)

    // Confidence = how many of the five signals we actually found, with a
    // penalty for suspiciously short text (a failed or partial OCR pass).
    const signals = [
        skills.length > 0,
        experience.source !== 'none',
        education.level > 0,
        softSkills.length > 0,
        !!(contact.email || contact.phone),
    ]
    let hits = 0
    for (let i = 0; i < signals.length; i++) if (signals[i]) hits++
    let confidence = hits / signals.length

    // An explicit years claim is stronger evidence than an inferred span.
    if (experience.source === 'date_range') confidence -= 0.05
    if (text.trim().length < 200) confidence = Math.min(confidence, 0.4)
    if (text.trim().length === 0) confidence = 0

    return {
        skills: skills,
        experience_years: experience.years,
        experience_source: experience.source,
        education: education.label,
        education_level: education.level,
        soft_skills: softSkills,
        contact: contact,
        data_confidence: Math.round(Math.max(0, Math.min(1, confidence)) * 100) / 100,
        parser_version: 'rules-v1',
    }
}

export const _internals = { BASE_SKILL_VOCABULARY, SOFT_SKILL_KEYWORDS, EDUCATION_LEVELS }
