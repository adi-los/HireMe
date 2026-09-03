import test from 'node:test'
import assert from 'node:assert/strict'
import {
    parseProfile,
    extractSkills,
    extractExperienceYears,
    extractEducation,
    extractSoftSkills,
    extractContact,
} from '../src/server/profile-parser.js'

const CV = `
Amina Benali
amina.benali@example.com  |  +212 6 12 34 56 78  |  Casablanca

SUMMARY
Senior platform engineer with 8+ years of experience building and running
distributed systems. Strong leadership and mentoring background, comfortable
with cross-functional stakeholder work.

EXPERIENCE
Lead Platform Engineer, Atlas Cloud            2019 - present
  Ran Kubernetes clusters on AWS, wrote Terraform modules, built CI/CD in
  GitLab. Introduced Go services replacing a legacy PHP monolith.

Backend Developer, Medina Systems              2016 - 2019
  Python and PostgreSQL. Some React on the side.

EDUCATION
Master of Science, Computer Science - ENSIAS   2016
`

test('extracts skills without false positives from substrings', () => {
    const skills = extractSkills(CV)
    for (const s of ['kubernetes', 'aws', 'terraform', 'go', 'python', 'postgresql', 'react', 'php', 'ci/cd', 'gitlab']) {
        assert.ok(skills.includes(s), `expected to find ${s}`)
    }
    // "java" must not be matched out of "javascript" — and neither appears here.
    assert.ok(!skills.includes('java'))
    assert.ok(!skills.includes('javascript'))
})

test('job-specific vocabulary is detected even when not in the base list', () => {
    const text = 'Built integrations against Mulesoft and Snowflake.'
    assert.deepEqual(extractSkills(text), [])
    const withVocab = extractSkills(text, ['mulesoft', 'snowflake'])
    assert.ok(withVocab.includes('mulesoft'))
    assert.ok(withVocab.includes('snowflake'))
})

test('prefers an explicit years claim over inferred date ranges', () => {
    const r = extractExperienceYears(CV)
    assert.equal(r.years, 8)
    assert.equal(r.source, 'explicit')
})

test('falls back to date-range span when no explicit claim exists', () => {
    const r = extractExperienceYears('Engineer, Acme 2015 - 2021. Dev, Beta 2021 to present.')
    assert.equal(r.source, 'date_range')
    assert.ok(r.years >= 6, `expected >= 6, got ${r.years}`)
})

test('reports no experience signal for text that has none', () => {
    assert.deepEqual(extractExperienceYears('I enjoy building things.'), { years: 0, source: 'none' })
})

test('picks the highest education level present', () => {
    assert.equal(extractEducation(CV).level, 4)
    assert.equal(extractEducation(CV).label, 'Master')
    // A CV listing both should report the higher one.
    assert.equal(extractEducation('Bachelor 2014, PhD 2020').label, 'Doctorate')
    assert.equal(extractEducation('no schooling mentioned').level, 0)
})

test('extracts contact details', () => {
    const c = extractContact(CV)
    assert.equal(c.email, 'amina.benali@example.com')
    assert.ok(c.phone && c.phone.replace(/\D/g, '').length >= 8)
})

test('finds soft skills', () => {
    const s = extractSoftSkills(CV)
    assert.ok(s.includes('leadership'))
    assert.ok(s.includes('mentoring'))
    assert.ok(s.includes('cross-functional'))
})

test('a rich CV parses with high confidence', () => {
    const p = parseProfile(CV)
    assert.equal(p.experience_years, 8)
    assert.equal(p.education, 'Master')
    assert.equal(p.education_level, 4)
    assert.ok(p.data_confidence >= 0.9, `confidence was ${p.data_confidence}`)
    assert.equal(p.parser_version, 'rules-v1')
})

test('confidence degrades honestly on thin or empty input', () => {
    // Short text is capped even if it happens to hit signals.
    const thin = parseProfile('Jane. 5 years. PhD. leadership. j@x.com')
    assert.ok(thin.data_confidence <= 0.4, `expected <= 0.4, got ${thin.data_confidence}`)

    const empty = parseProfile('')
    assert.equal(empty.data_confidence, 0)
    assert.deepEqual(empty.skills, [])
    assert.equal(empty.experience_years, 0)

    // A failed OCR pass must never look like a confident profile.
    assert.equal(parseProfile(null).data_confidence, 0)
})
