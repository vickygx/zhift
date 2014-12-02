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
            error: unexpectedError(assert, 'Existing record'),
        });

        QUnit.stop();
        $.ajax({
            url: '/record/schedule/000000000000000000000000',
            type: 'GET',
            success: expectedSuccess(assert, 'No records on schedule', []),
            error: unexpectedError(assert, 'No records on schedule'),
        });

        QUnit.stop();
        $.ajax({
            url: '/record/schedule/asdf',
            type: 'GET',
            success: unexpectedSuccess(assert, 'Invalid schedule'),
            error: expectedError(assert, 'Invalid schedule', 403),
        });

        QUnit.stop();
        $.ajax('/record/schedule/', {
            type: 'GET',
            success: unexpectedSuccess(assert, 'Empty schedule'),
            error: expectedError(assert, 'Empty schedule', 404),
        });
    });

    QUnit.asyncTest('DELETE', function(assert) {
        QUnit.start();
    });
}