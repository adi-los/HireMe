import test from 'node:test'
import assert from 'node:assert/strict'
import {
    evaluate,
    scoreSkills,
    scoreExperience,
    scoreEducation,
    scoreSoftSkills,
    scoreLogistics,
} from '../src/server/matching.js'
import { computeScore } from '../src/server/scoring.js'

test('skills score is weighted by requirement importance', () => {
    const req = [
        { name: 'kubernetes', weight: 3 },
        { name: 'terraform', weight: 1 },
    ]
    // Has the heavily-weighted one only: 3 of 4.
    assert.equal(scoreSkills(['kubernetes'], req).score, 75)
    // Has the light one only: 1 of 4.
    assert.equal(scoreSkills(['terraform'], req).score, 25)
    assert.equal(scoreSkills(['kubernetes', 'terraform'], req).score, 100)
    assert.equal(scoreSkills([], req).score, 0)
})

test('skills score reports what is missing, for explainability', () => {
    const r = scoreSkills(['go'], [{ name: 'go' }, { name: 'kubernetes' }])
    assert.deepEqual(r.matched, ['go'])
    assert.deepEqual(r.missing, ['kubernetes'])
})

test('no stated skill requirements is neutral, not a free 100', () => {
    assert.equal(scoreSkills(['go'], []).score, 50)
    assert.equal(scoreSkills(['go'], undefined).score, 50)
})

test('plain string requirements work alongside weighted objects', () => {
    assert.equal(scoreSkills(['go'], ['go', 'rust']).score, 50)
})

test('experience: meeting the bar scores 80, exceeding climbs to 100', () => {
    assert.equal(scoreExperience(5, 5).score, 80)
    assert.equal(scoreExperience(10, 5).score, 100)
    assert.equal(scoreExperience(4, 5).score, 64)
    assert.equal(scoreExperience(0, 5).score, 0)
})

test('experience: being overqualified is never penalised', () => {
    assert.equal(scoreExperience(30, 5).score, 100)
})

test('education meets or falls short of the required level', () => {
    assert.equal(scoreEducation(4, 3).score, 100)
    assert.equal(scoreEducation(3, 3).score, 100)
    assert.equal(scoreEducation(0, 3).score, 0)
    assert.equal(scoreEducation(0, 3).note, 'unknown')
})

test('soft skills measure coverage when the offer names them', () => {
    assert.equal(scoreSoftSkills(['leadership', 'mentoring'], ['leadership', 'mentoring']).score, 100)
    assert.equal(scoreSoftSkills(['leadership'], ['leadership', 'mentoring']).score, 50)
})

test('keyword stuffing cannot max out the soft-skill signal', () => {
    const many = ['leadership', 'mentoring', 'communication', 'teamwork', 'ownership', 'initiative']
    assert.ok(scoreSoftSkills(many, []).score <= 80)
})

test('remote-allowed roles are location-agnostic', () => {
    assert.equal(scoreLogistics('Anywhere', { remote_allowed: true }).score, 100)
    assert.equal(scoreLogistics('Casablanca', { location: 'Casablanca' }).score, 100)
    assert.equal(scoreLogistics('Berlin', { location: 'Casablanca' }).score, 20)
    // Unknown candidate location is uncertainty, not a rejection.
    assert.equal(scoreLogistics(null, { location: 'Casablanca' }).score, 50)
})

test('evaluate produces all five criteria plus evidence', () => {
    const profile = {
        skills: ['kubernetes', 'aws', 'terraform'],
        experience_years: 8,
        education_level: 4,
        soft_skills: ['leadership'],
        location: 'Casablanca',
        data_confidence: 0.95,
    }
    const requirements = {
        skills: [{ name: 'kubernetes', weight: 3 }, { name: 'aws', weight: 2 }],
        min_experience_years: 5,
        min_education_level: 3,
        soft_skills: ['leadership'],
        location: 'Casablanca',
    }

    const r = evaluate(profile, requirements)
    assert.deepEqual(Object.keys(r.criteria).sort(), [
        'education_fit', 'experience_relevance', 'logistics_fit', 'skills_match', 'soft_skills_signal',
    ])
    assert.equal(r.criteria.skills_match, 100)
    assert.equal(r.criteria.education_fit, 100)
    assert.equal(r.criteria.logistics_fit, 100)
    assert.equal(r.data_confidence, 0.95)
    assert.deepEqual(r.evidence.skills.missing, [])
})

test('evaluate output feeds computeScore end to end', () => {
    const strong = evaluate(
        {
            skills: ['kubernetes', 'aws'], experience_years: 10, education_level: 5,
            soft_skills: ['leadership'], location: 'Remote', data_confidence: 1,
        },
        {
            skills: [{ name: 'kubernetes' }, { name: 'aws' }], min_experience_years: 5,
            min_education_level: 3, soft_skills: ['leadership'], remote_allowed: true,
        }
    )
    const result = computeScore(strong.criteria, strong.data_confidence, { normalize: true })
    assert.equal(result.category, 'top_match')

    const weak = evaluate(
        { skills: [], experience_years: 0, education_level: 0, soft_skills: [], data_confidence: 0.3 },
        { skills: [{ name: 'kubernetes' }], min_experience_years: 5, min_education_level: 3 }
    )
    const weakResult = computeScore(weak.criteria, weak.data_confidence, { normalize: true })
    assert.equal(weakResult.category, 'not_a_fit')
})

test('evaluate tolerates entirely missing input', () => {
    const r = evaluate(null, null)
    assert.equal(r.data_confidence, 0)
    assert.equal(typeof r.criteria.skills_match, 'number')
})
