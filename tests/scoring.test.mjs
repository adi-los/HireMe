import test from 'node:test'
import assert from 'node:assert/strict'
import {
    computeScore,
    categorize,
    slaHoursFor,
    blendInterviewScore,
    DEFAULT_WEIGHTS,
} from '../src/server/scoring.js'

const PERFECT = {
    skills_match: 100,
    experience_relevance: 100,
    education_fit: 100,
    soft_skills_signal: 100,
    logistics_fit: 100,
}

test('categorize maps each blueprint band correctly', () => {
    assert.equal(categorize(100), 'top_match')
    assert.equal(categorize(85), 'top_match')
    assert.equal(categorize(84), 'strong_fit')
    assert.equal(categorize(70), 'strong_fit')
    assert.equal(categorize(69), 'potential')
    assert.equal(categorize(50), 'potential')
    assert.equal(categorize(49), 'not_a_fit')
    assert.equal(categorize(0), 'not_a_fit')
})

test('blueprint weights sum to 0.90, capping a perfect candidate at 90', () => {
    const total = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0)
    assert.equal(Math.round(total * 100) / 100, 0.9)

    const result = computeScore(PERFECT, 1)
    assert.equal(result.score, 90)
    // Documents the gap: 91-100 is unreachable as specified.
    assert.equal(result.category, 'top_match')
})

test('normalize option lets a perfect candidate reach 100', () => {
    const result = computeScore(PERFECT, 1, { normalize: true })
    assert.equal(result.score, 100)
    assert.equal(result.category, 'top_match')
})

test('low data confidence applies the 10-point penalty', () => {
    const full = computeScore(PERFECT, 1)
    const none = computeScore(PERFECT, 0)
    assert.equal(full.score - none.score, 10)
    assert.equal(none.breakdown.penalty, 10)
})

test('breakdown explains every criterion', () => {
    const result = computeScore(
        { skills_match: 80, experience_relevance: 60, education_fit: 40, soft_skills_signal: 50, logistics_fit: 100 },
        0.9
    )
    const c = result.breakdown.criteria
    assert.equal(c.skills_match.value, 80)
    assert.equal(c.skills_match.weight, 0.4)
    assert.equal(c.skills_match.contribution, 32)
    // Every weighted criterion is present and accounted for.
    assert.deepEqual(Object.keys(c).sort(), Object.keys(DEFAULT_WEIGHTS).sort())
})

test('scores clamp to 0-100 and tolerate junk input', () => {
    assert.equal(computeScore({}, 1).score, 0)
    assert.equal(computeScore(null, 1).score, 0)
    assert.equal(computeScore({ skills_match: 999 }, 1).score, 40)
    assert.equal(computeScore(PERFECT, -5).score, 80)
    assert.equal(computeScore({ skills_match: 'abc' }, 1).score, 0)
})

test('interview blending uses 0.7 / 0.3 and re-categorizes', () => {
    const blended = blendInterviewScore(80, 90)
    assert.equal(blended.score, 83)
    assert.equal(blended.category, 'strong_fit')

    // A weak interview can demote a candidate out of Top Match.
    const demoted = blendInterviewScore(88, 40)
    assert.equal(demoted.score, 74)
    assert.equal(demoted.category, 'strong_fit')
})

test('SLA hours match the governance table', () => {
    assert.equal(slaHoursFor('top_match'), 24)
    assert.equal(slaHoursFor('strong_fit'), 48)
    assert.equal(slaHoursFor('potential'), 72)
    assert.equal(slaHoursFor('not_a_fit'), 120)
    assert.equal(slaHoursFor('nope'), null)
})
