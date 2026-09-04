api.controller = function ($location, $scope) {
    var c = this;

    var MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB — generous for a CV, small enough for one c.server.update() call

    c.view = 'loading'; // loading | form | success | closed
    c.submitting = false;
    c.serverErrors = [];
    c.fileName = null;
    c.fileTooLarge = false;

    c.form = {
        full_name: '',
        email: '',
        phone: '',
        consent: false,
    };

    var jobOfferId = ($location.search() || {}).job || '';

    c.data.action = 'load_job';
    c.data.job_offer_id = jobOfferId;
    c.server.update().then(function () {
        c.data.action = null;
        if (c.data.jobOpen) {
            c.view = 'form';
        } else {
            c.view = 'closed';
            c.serverErrors = c.data.errors || ['This position is not available.'];
        }
    });

    // Bound from the file input's inline onchange (see template.html) — a
    // plain File object, converted to base64 here so it can travel inside
    // c.data on the next c.server.update() call, the only documented way
    // widget client scripts send data to the server.
    c.onFileChange = function (file) {
        c.fileTooLarge = false;
        c.fileName = null;
        c.form.file_base64 = null;
        c.form.file_name = null;
        c.form.mime_type = null;

        if (!file) {
            $scope.$apply();
            return;
        }
        if (file.size > MAX_FILE_BYTES) {
            c.fileTooLarge = true;
            $scope.$apply();
            return;
        }

        var reader = new FileReader();
        reader.onload = function () {
            // reader.result is "data:<mime>;base64,<data>" — strip the prefix
            var raw = reader.result || '';
            var commaIndex = raw.indexOf(',');
            c.form.file_base64 = commaIndex >= 0 ? raw.substring(commaIndex + 1) : raw;
            c.form.file_name = file.name;
            c.form.mime_type = file.type;
            c.fileName = file.name;
            $scope.$apply();
        };
        reader.onerror = function () {
            c.fileTooLarge = false;
            c.fileName = null;
            $scope.$apply();
        };
        reader.readAsDataURL(file);
    };

    c.submit = function () {
        c.serverErrors = [];
        if (!c.form.full_name || !c.form.email || !c.form.consent) {
            return;
        }

        c.submitting = true;
        c.data.action = 'submit';
        c.data.job_offer_id = jobOfferId;
        c.data.full_name = c.form.full_name;
        c.data.email = c.form.email;
        c.data.phone = c.form.phone;
        c.data.consent = c.form.consent;
        c.data.file_base64 = c.form.file_base64 || null;
        c.data.file_name = c.form.file_name || null;
        c.data.mime_type = c.form.mime_type || null;

        c.server.update().then(function () {
            c.submitting = false;
            c.data.action = null;
            var result = c.data.submitResult;
            if (result && result.success) {
                c.view = 'success';
            } else {
                c.serverErrors = (result && result.errors) || ['Something went wrong. Please try again.'];
            }
        });
    };
};
