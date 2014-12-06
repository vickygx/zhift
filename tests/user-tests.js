/**
 * Tests for User routes.
 * @author Dylan Joss
 */
QUnit.config.reorder = false; // Prevent QUnit from running test not in order.

function testUserRoutes(data) {
    var schedules = data.Schedule;
    var crocheterScheduleId;
    var tuftedTitmouseCoalitionMemberYOLOSwag420HashtagPumpkinSpiceLatteBasicBetchScheduleId;

    if (schedules[0].role === 'Crocheter') {
        crocheterScheduleId = schedules[0]._id;
        tuftedTitmouseCoalitionMemberYOLOSwag420HashtagPumpkinSpiceLatteBasicBetchScheduleId = schedules[1]._id;
    }
    else {
        tuftedTitmouseCoalitionMemberYOLOSwag420HashtagPumpkinSpiceLatteBasicBetchScheduleId = schedules[0]._id;
        crocheterScheduleId = schedules[1]._id;
    }

    QUnit.module('User');


    // GET all of ZhiftTest managers
    // GET all of ZhiftTest employees
    // GET all employees associated with crocheter 
    // PUT change pw of E Lily Seropian 
    // DELETE a ZhiftTest manager
    // DELETE a ZhiftTest employee
    
    // POST 
    QUnit.asyncTest('POST', function(assert) {
        // POST manager Bob for  Organization: ZhiftTest
        $.ajax({
            url: '/user/manager',
            type: 'POST',
            data: {
                username: 'Bob',
                email: 'bob@titmouse.gov',
                org: 'ZhiftTest'
            },
            success: expectedSuccess(assert, 'Create manager', {
                name: 'Bob',
                email: 'bob@titmouse.gov',
                org: 'ZhiftTest'
            }),
            error: unexpectedError(assert, 'Create manager')
        });

        QUnit.stop();

        // POST employee Alice for Organization: ZhiftTest
        // Role/Schedule: TuftedTitmouseCoalitionMemberYOLOSwag420HashtagPumpkinSpiceLatteBasicBetch
        $.ajax({
            url: '/user/employee',
            type: 'POST',
            data: {
                username: 'Alice',
                email: 'alice@titmouse.gov',
                org: 'ZhiftTest',
                role: 'TuftedTitmouseCoalitionMemberYOLOSwag420HashtagPumpkinSpiceLatteBasicBetch'
            },
            success: expectedSuccess(assert, 'Create employee', {
                name: 'Alice',
                email: 'alice@titmouse.gov',
                org: 'ZhiftTest',
                schedule: tuftedTitmouseCoalitionMemberYOLOSwag420HashtagPumpkinSpiceLatteBasicBetchScheduleId
            }),
            error: unexpectedError(assert, 'Create employee')
        });
    });

    // GET
    // QUnit.asyncTest('GET', function(assert) {
        // GET existing manager, test
        // GET existing employee, E Lily Seropian
    // });

    // // PUT
    // QUnit.asyncTest('PUT', function(assert) {

    // });

    // // DELETE
    // QUnit.asyncTest('DELETE', function(assert) {

    // });
}