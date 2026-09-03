/**
 * CandidateProfile × JobOffer.requirements → the five criterion sub-scores
 * that `scoring.js` then weights (blueprint p.09).
 *
 * This is the deterministic baseline. It runs always. When
 * `x_winu_hireme.scoring.use_llm` is on, the LLM is asked to refine these
 * numbers — but the rule-based result is always computed first and is always
 * what gets used if the LLM is unavailable or returns junk.
 *
 * Why bother, when there is an LLM? Because "every AI output is explainable"
 * (p.11) is much easier to honour when there is a reproducible baseline to
 * compare against, and because a scoring pipeline that hard-depends on an
 * external model has no answer when that model is down.
 *
 * Expected `requirements` shape (JobOffer.requirements):
 * {
 *   "skills": [{ "name": "kubernetes", "weight": 3 }, { "name": "go" }],
 *   "min_experience_years": 5,
 *   "min_education_level": 3,          // 0-5, see profile-parser
 *   "soft_skills": ["leadership"],
 *   "location": "Casablanca",
 *   "remote_allowed": true
 * }
 */

function clamp(n, lo, hi) {
    if (typeof n !== 'number' || isNaN(n)) return lo
    return Math.min(hi, Math.max(lo, n))
}

function toArray(v) {
    return Array.isArray(v) ? v : []
}

function lower(s) {
    return String(s == null ? '' : s).toLowerCase().trim()
}

/**
 * Weighted coverage of the required skills.
 * A requirement with no explicit weight counts as 1.
 */
export function scoreSkills(profileSkills, requiredSkills) {
    const required = toArray(requiredSkills)
    // No stated requirements means nothing to miss — neutral, not a free 100.
    if (required.length === 0) return { score: 50, matched: [], missing: [], note: 'no_requirements' }

    const have = {}
    toArray(profileSkills).forEach((s) => {
        have[lower(s)] = true
    })

    let total = 0
    let earned = 0
    const matched = []
    const missing = []

    required.forEach((req) => {
        const name = lower(typeof req === 'string' ? req : req && req.name)
        if (!name) return
        const weight = typeof req === 'object' && req && typeof req.weight === 'number' ? req.weight : 1
        total += weight
        if (have[name]) {
            earned += weight
            matched.push(name)
        } else {
            missing.push(name)
        }
    })

    if (total === 0) return { score: 50, matched: [], missing: [], note: 'no_requirements' }
    return {
        score: Math.round((earned / total) * 100),
        matched: matched,
        missing: missing,
    }
}

/**
 * Experience against the stated minimum.
 * Meeting the bar scores 80; exceeding it climbs toward 100. Being over-
 * qualified is never penalised here — that is a recruiter judgement, not a
 * scoring one.
 */
export function scoreExperience(profileYears, minYears) {
    const years = clamp(profileYears, 0, 50)
    const required = typeof minYears === 'number' && minYears > 0 ? minYears : 0

    if (required === 0) {
        // No stated minimum: reward some evidence of experience, mildly.
        return { score: Math.round(clamp(years * 10, 0, 80)), note: 'no_minimum' }
    }
    if (years >= required) {
        const surplus = clamp((years - required) / required, 0, 1)
        return { score: Math.round(80 + surplus * 20), note: 'meets' }
    }
    // Below the bar: proportional, so 4 of 5 years still scores respectably.
    return { score: Math.round((years / required) * 80), note: 'below' }
}

/** Education level against the stated minimum (levels 0-5). */
export function scoreEducation(profileLevel, minLevel) {
    const level = clamp(profileLevel, 0, 5)
    const required = clamp(minLevel, 0, 5)

    if (required === 0) return { score: Math.round((level / 5) * 100), note: 'no_minimum' }
    if (level >= required) return { score: 100, note: 'meets' }
    if (level === 0) return { score: 0, note: 'unknown' }
    return { score: Math.round((level / required) * 100), note: 'below' }
}

/**
 * Soft-skill signal. When the offer names specific soft skills we measure
 * coverage of those; otherwise we reward general evidence, capped so that a
 * keyword-stuffed CV cannot max this out.
 */
export function scoreSoftSkills(profileSoftSkills, requiredSoftSkills) {
    const have = toArray(profileSoftSkills).map(lower)
    const want = toArray(requiredSoftSkills).map(lower)

    if (want.length === 0) {
        return { score: Math.round(clamp(have.length * 20, 0, 80)), matched: have, note: 'no_requirements' }
    }
    const matched = want.filter((w) => have.indexOf(w) !== -1)
    return {
        score: Math.round((matched.length / want.length) * 100),
        matched: matched,
        missing: want.filter((w) => matched.indexOf(w) === -1),
    }
}

/**
 * Logistics: can this person actually take the job.
 * Remote-allowed roles are location-agnostic, so everyone scores full marks.
 */
export function scoreLogistics(profileLocation, requirements) {
    const req = requirements || {}
    if (req.remote_allowed === true) return { score: 100, note: 'remote_allowed' }

    const want = lower(req.location)
    const have = lower(profileLocation)
    if (!want) return { score: 50, note: 'no_location_requirement' }
    if (!have) return { score: 50, note: 'candidate_location_unknown' }
    if (have.indexOf(want) !== -1 || want.indexOf(have) !== -1) return { score: 100, note: 'match' }
    return { score: 20, note: 'mismatch' }
}

/**
 * Produce all five sub-scores plus the confidence, ready to hand to
 * `computeScore()` in scoring.js.
 *
 * @param {Object} profile      a parsed CandidateProfile
 * @param {Object} requirements JobOffer.requirements
 */
export function evaluate(profile, requirements) {
    const p = profile || {}
    const req = requirements || {}

    const skills = scoreSkills(p.skills, req.skills)
    const experience = scoreExperience(p.experience_years, req.min_experience_years)
    const education = scoreEducation(p.education_level, req.min_education_level)
    const soft = scoreSoftSkills(p.soft_skills, req.soft_skills)
    const logistics = scoreLogistics(p.location, req)

    return {
        criteria: {
            skills_match: skills.score,
            experience_relevance: experience.score,
            education_fit: education.score,
            soft_skills_signal: soft.score,
            logistics_fit: logistics.score,
        },
        data_confidence: clamp(typeof p.data_confidence === 'number' ? p.data_confidence : 0, 0, 1),
        // Kept alongside the numbers so the RH panel can say *why*, not just
        // how much — "missing: kubernetes, terraform" is the useful part.
        evidence: {
            skills: skills,
            experience: experience,
            education: education,
            soft_skills: soft,
            logistics: logistics,
        },
    }
}
