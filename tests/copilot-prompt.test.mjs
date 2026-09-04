import test from 'node:test'
import assert from 'node:assert/strict'
import { buildContext, buildSystemPrompt, buildUserPrompt, parseAssistantReply } from '../src/server/copilot-prompt.js'

test('buildContext only ever surfaces the one application it was given', () => {
    const ctx = buildContext({
        applicationNumber: 'HIRE0001001',
        applicationStatus: 'screened',
        candidateName: 'Amina Benali',
        jobTitle: 'Backend Engineer',
        cvRawText: 'Experienced backend engineer...',
        profileSkills: ['kubernetes', 'typescript'],
        profileExperienceYears: 5,
        score: { value: 78, category: 'strong_fit', breakdown: { skills_match: 90 } },
    })

    assert.equal(ctx.application.number, 'HIRE0001001')
    assert.equal(ctx.candidate.name, 'Amina Benali')
    assert.equal(ctx.job_offer.title, 'Backend Engineer')
    assert.deepEqual(ctx.profile.skills, ['kubernetes', 'typescript'])
    assert.equal(ctx.score.value, 78)
    // No field anywhere for a second application/candidate to leak into.
    assert.equal(Object.keys(ctx).sort().join(','), 'application,candidate,cv,job_offer,profile,score')
})

test('buildContext truncates a very long CV instead of blowing up the prompt', () => {
    const longText = 'x'.repeat(10000)
    const ctx = buildContext({ cvRawText: longText })
    assert.ok(ctx.cv.raw_text.length < 10000)
    assert.ok(ctx.cv.raw_text.endsWith('…(truncated)'))
})

test('buildSystemPrompt instructs single-application grounding and the JSON reply shape', () => {
    const prompt = buildSystemPrompt(buildContext({ applicationNumber: 'HIRE0001001' }))
    assert.match(prompt, /ONE job application/)
    assert.match(prompt, /"answer"/)
    assert.match(prompt, /"citations"/)
})

test('buildUserPrompt trims and coerces non-string input safely', () => {
    assert.equal(buildUserPrompt('  what is their experience?  '), 'what is their experience?')
    assert.equal(buildUserPrompt(null), '')
    assert.equal(buildUserPrompt(undefined), '')
})

test('parseAssistantReply parses the requested JSON shape', () => {
    const reply = parseAssistantReply('{"answer": "5 years experience", "citations": ["profile.experience_years"]}')
    assert.equal(reply.answer, '5 years experience')
    assert.deepEqual(reply.citations, ['profile.experience_years'])
})

test('parseAssistantReply degrades to plain text when the model ignores the JSON instruction', () => {
    const reply = parseAssistantReply('The candidate has 5 years of experience.')
    assert.equal(reply.answer, 'The candidate has 5 years of experience.')
    assert.deepEqual(reply.citations, [])
})

test('parseAssistantReply degrades gracefully on malformed JSON rather than throwing', () => {
    const reply = parseAssistantReply('{"answer": "broken json missing close quote}')
    assert.equal(typeof reply.answer, 'string')
    assert.deepEqual(reply.citations, [])
})

test('parseAssistantReply handles an empty reply without throwing', () => {
    assert.deepEqual(parseAssistantReply(''), { answer: '', citations: [] })
    assert.deepEqual(parseAssistantReply(null), { answer: '', citations: [] })
})

test('parseAssistantReply filters out non-string citations from a malformed model reply', () => {
    const reply = parseAssistantReply('{"answer": "ok", "citations": ["profile.skills", 42, null]}')
    assert.deepEqual(reply.citations, ['profile.skills'])
})
