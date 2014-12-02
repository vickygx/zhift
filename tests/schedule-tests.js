/**
 * Tests for Schedule routes.
 * @author Anji Ren
 */

function testTemplateShiftRoutes() {
    QUnit.module('TemplateShift');

    var scheduleId = null; 

    assignScheduleId = function(schedule) {
        scheduleId = schedule._id;
    };

    // POST
    QUnit.asyncTest('POST', function(assert) {
    // POST Create new Schedule/Role: 'Kung Fu Fighter' for Organization 'CC'
        $.ajax({
            url: '/schedule',
            type: 'POST',
            data: {
                orgName: 'CC',
                role: 'Kung Fu Fighter'
            },
            success: function(resObj, textStatus, jqXHR) {
                expectedSuccess(assert, 'Valid schedule', {role: 'Kung Fu Fighter'})(resObj, textStatus, jqXHR);
                assignScheduleId(resObj);
                QUnit.stop();
    // POST Create duplicate Schedule/Role: 'Kung Fu Fighter' for Organization 'CC'
                $.ajax('/schedule', {
                    type: 'POST',
                    data: {
                        name: 'Kung Fu Figther',
                    },
                    success: unexpectedSuccess(assert, 'Duplicate schedule'),
                    error: expectedError(assert, 'Duplicate schedule', 403)
                });
            },
            error: unexpectedError(assert, 'Valid schedule')
        });

        QUnit.stop();
    // POST Create new Schedule/Role with empty parameters
        $.ajax('/schedule', {
            type: 'POST',
            data: {},
            success: unexpectedSuccess(assert, 'Invalid schedule'),
            error: expectedError(assert, 'Invalid schedule', 403)
        });
    })

    // GET
    QUnit.asyncTest('GET', function(assert) {
    // GET Retrieve existing Schedule/Role: 'Kung Fu Fighter' for Organization 'CC'
        $.ajax({
            url: '/schedule/' + scheduleId,
            type: 'GET',
            success: expectedSuccess(assert, 'Existing schedule', {_id: scheduleId, org: 'CC', role: 'Kung Fu Fighter'}),
            error: unexpectedError(assert, 'Existing schedule')
        });
        QUnit.stop();
    // GET Retrieve non-existing Schedule/Role for Organization 'CC'
        $.ajax('/schedule/ffff', {
            type: 'GET',
            success: unexpectedSuccess(assert, 'Nonexistent schedule'),
            error: expectedError(assert, 'Nonexistent schedule', 404)
        });
        QUnit.stop();
    // GET Retrieve Schedule with empty id parameter
        $.ajax('/schedule/', {
            type: 'GET',
            success: unexpectedSuccess(assert, 'Empty schedule'),
            error: expectedError(assert, 'Empty schedule', 404)
        });
    });

    // DELETE
    
    // GET ALL

}