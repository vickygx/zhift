/**
* Tests for Template Shift routes.
* @author Anji Ren
*/
QUnit.config.reorder = false; // Prevent QUnit from running test not in order.

function testTemplateShiftRoutes() {
    QUnit.module('TemplateShift');

    var employeeId = null; 
    var scheduleId = null;
    var templateShiftId = null;

    var assignEmployeeId = function(employee) {
        employeeId = employee._id;
    }

    var assignScheduleId = function(schedule) {
        scheduleId = schedule._id;
    };

    var assignTemplateShiftId = function(templateShift) {
        templateShiftId = templateShift._id;
    };

    // POST
    QUnit.asyncTest('POST', function(assert) {
        // POST Create new Schedule/Role: 'Kung Fu Fighter 2' for Organization 'ZhiftTest'
        $.ajax({
            url: '/schedule',
            type: 'POST',
            data: {
                orgName: 'ZhiftTest',
                role: 'Kung Fu Fighter 2'
            },
            success: function(resObj, textStatus, jqXHR) {
                expectedSuccess(assert, 'Valid schedule', {role: 'Kung Fu Fighter 2'})(resObj, textStatus, jqXHR);
                assignScheduleId(resObj);

                // POST Create new Employee 'Bobby Dylan' for Organization 'ZhiftTest' and Role 'Kung Fu Fighter 2'
                QUnit.stop();
                $.ajax({
                    url: 'user/employee',
                    type: 'POST',
                    data: {
                        username: 'Bobby Dylan',
                        email: 'renalele@gmail.com',
                        org: 'ZhiftTest',
                        role: 'Kung Fu Fighter 2'
                    },
                    success: function(resObj, textStatus, jqXHR) {
                        expectedSuccess(assert, 'Valid employee', {
                            name: 'Bobby Dylan', 
                            email: 'renalele@gmail.com',
                            org: 'ZhiftTest', 
                            role: 'Kung Fu Fighter 2'
                        })(resObj, textStatus, jqXHR);
                        assignEmployeeId(resObj);

                        // POST Create new Template Shift: Thursday 10:00 - 11:00
                        QUnit.stop();
                        $.ajax({
                            url: '/template',
                            type: 'POST',
                            data: {
                                day: 'Thursday',
                                startTime: '10:00',
                                endTime: '11:00',
                                employeeId: employeeId,
                                scheduleId: scheduleId,
                            },
                            success: function(resObj, textStatus, jqXHR) {
                                expectedSuccess(assert, 'Valid template shift', {role: 'Kung Fu Fighter 2'})(resObj, textStatus, jqXHR);
                                assignTemplateShiftId(resObj);
                                // REASSIGN TEMPLATE SHIFT
                            },
                            error: unexpectedError(assert, 'Valid template shift')
                        });
                    },
                    error: unexpectedError(assert, 'Valid employee')
                });
            },
            error: unexpectedError(assert, 'Valid schedule')
        });
    });
}