(function () {
    // Public, unauthenticated widget (blueprint p.13 job board) — lists open
    // requisitions only. No candidate PII is ever read or returned here.
    data.jobs = [];

    var gr = new GlideRecord('x_winu_hireme_job_offer');
    gr.addQuery('status', 'open');
    gr.orderBy('title');
    gr.setLimit(50);
    gr.query();
    while (gr.next()) {
        data.jobs.push({
            sys_id: gr.getUniqueValue() + '',
            title: gr.getValue('title'),
            department: gr.getValue('department'),
            location: gr.getValue('location'),
            description: gr.getValue('description'),
        });
    }
})();
