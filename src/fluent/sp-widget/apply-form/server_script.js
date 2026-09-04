(function () {
    // Public, unauthenticated widget (blueprint p.13 apply flow).
    //
    // This duplicates a small slice of src/server/glide/intake.js
    // (findOrCreateCandidate + the Application/CVDocument creation shape)
    // rather than importing it. Service Portal widget scripts are inlined
    // via Now.include() as raw text into a classic (non-ES-module) script
    // field — they cannot `import` from other files the way a RestApi
    // route's `script:` (an actual bundled function reference) can. Keep
    // this in sync with intake.js by hand if the Application/CVDocument
    // creation shape ever changes.
    data.jobTitle = null;
    data.jobDepartment = null;
    data.jobLocation = null;
    data.jobOpen = false;
    data.errors = [];
    data.submitResult = null;

    if (input && input.action === 'load_job') {
        loadJob(input.job_offer_id);
        return;
    }

    if (input && input.action === 'submit') {
        data.submitResult = submitApplication(input);
        return;
    }

    function loadJob(jobOfferId) {
        if (!jobOfferId) {
            data.errors.push('No position selected.');
            return;
        }
        var offer = new GlideRecord('x_winu_hireme_job_offer');
        if (offer.get(jobOfferId) && offer.getValue('status') === 'open') {
            data.jobTitle = offer.getValue('title');
            data.jobDepartment = offer.getValue('department');
            data.jobLocation = offer.getValue('location');
            data.jobOpen = true;
        } else {
            data.errors.push('This position is no longer open for applications.');
        }
    }

    function submitApplication(input) {
        var errors = validate(input);
        if (errors.length > 0) {
            return { success: false, errors: errors };
        }

        var offer = new GlideRecord('x_winu_hireme_job_offer');
        if (!offer.get(input.job_offer_id) || offer.getValue('status') !== 'open') {
            return { success: false, errors: ['This position is no longer open for applications.'] };
        }

        var candidateResult = findOrCreateCandidate(input);
        if (candidateResult.error) {
            return { success: false, errors: [candidateResult.error] };
        }

        var token = gs.generateGUID().replace(/-/g, '');
        var app = new GlideRecord('x_winu_hireme_application');
        app.initialize();
        app.setValue('candidate_ref', candidateResult.id);
        app.setValue('joboffer_ref', input.job_offer_id);
        app.setValue('access_token', token);
        var applicationId = app.insert();
        if (!applicationId) {
            return { success: false, errors: ['Could not submit the application. Try again in a moment.'] };
        }

        var cv = new GlideRecord('x_winu_hireme_cv_document');
        cv.initialize();
        cv.setValue('application_ref', applicationId);
        cv.setValue('file_name', String(input.file_name || '').substring(0, 255));
        cv.setValue('mime_type', String(input.mime_type || '').substring(0, 100));
        var cvDocumentId = cv.insert();

        // Attach the actual bytes. GlideSysAttachment.writeBase64 needs a
        // GlideRecord positioned on the (now-inserted, real) row, not the
        // just-initialized one — re-fetch to be safe.
        if (cvDocumentId && input.file_base64) {
            var cvRecord = new GlideRecord('x_winu_hireme_cv_document');
            if (cvRecord.get(cvDocumentId)) {
                var sysAttachment = new GlideSysAttachment();
                sysAttachment.writeBase64(cvRecord, String(input.file_name || 'cv').substring(0, 255), input.mime_type || 'application/octet-stream', input.file_base64);
            }
        }

        writeAudit(applicationId, candidateResult.hadConsent, input.job_offer_id);

        return { success: true, application_number_pending: true, access_token: token };
    }

    function validate(input) {
        var errors = [];
        if (!input.job_offer_id) errors.push('No position selected.');
        if (!input.full_name || !String(input.full_name).trim()) errors.push('Full name is required.');
        if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email).trim())) {
            errors.push('A valid email address is required.');
        }
        if (input.consent !== true) errors.push('You must consent to data processing to apply.');
        return errors;
    }

    function findOrCreateCandidate(input) {
        var email = String(input.email || '').trim().toLowerCase();
        var existing = new GlideRecord('x_winu_hireme_candidate');
        existing.addQuery('email', email);
        existing.setLimit(1);
        existing.query();

        if (existing.next()) {
            var hadConsent = !!existing.getValue('consent_given_at');
            if (input.consent === true && !hadConsent) {
                existing.setValue('consent_given_at', new GlideDateTime().getValue());
                existing.update();
            }
            return { id: existing.getUniqueValue(), hadConsent: hadConsent || input.consent === true };
        }

        var candidate = new GlideRecord('x_winu_hireme_candidate');
        candidate.initialize();
        candidate.setValue('email', email);
        candidate.setValue('full_name', String(input.full_name || '').substring(0, 100));
        candidate.setValue('phone', String(input.phone || '').substring(0, 40));
        candidate.setValue('source', 'portal');
        if (input.consent === true) {
            candidate.setValue('consent_given_at', new GlideDateTime().getValue());
        }
        var id = candidate.insert();
        if (!id) return { error: 'Could not save your details. Try again in a moment.' };
        return { id: id, hadConsent: false };
    }

    function writeAudit(applicationId, candidateHadPriorConsent, jobOfferId) {
        try {
            var log = new GlideRecord('x_winu_hireme_audit_log');
            log.initialize();
            log.setValue('action', 'application.created');
            log.setValue('actor_type', 'user');
            log.setValue('application_ref', applicationId);
            log.setValue('reason', 'Application submitted via public portal');
            log.setValue('details', JSON.stringify({ candidate_had_prior_consent: candidateHadPriorConsent, job_offer: jobOfferId }));
            log.setValue('timestamp', new GlideDateTime().getValue());
            log.insert();
        } catch (e) {
            gs.error('[HireMe] apply-form widget: failed to write audit row: ' + e);
        }
    }
})();
