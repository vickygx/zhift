/**
 * Tests for Record routes.
 * @author Lily Seropian
 */

function testRecordRoutes(data) {
    var records = data.Record;
    var schedule = data.Schedule[0];

    QUnit.module('Record');

    QUnit.asyncTest('GET /scheduleId', function(assert) {
        $.ajax({
            url: '/record/schedule/' + schedule._id,
            type: 'GET',
            success: expectedSuccess(assert, 'Existing record', records),
            error: unexpectedError(assert, 'Existing record')
        });
    });

    QUnit.asyncTest('DELETE', function(assert) {
        QUnit.start();
    });
}