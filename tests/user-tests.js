/**
 * Tests for User routes.
 * @author Dylan Joss
 */
QUnit.config.reorder = false; // Prevent QUnit from running test not in order.

function testUserRoutes(data) {
    var org = data.Organization[0];

    QUnit.module('User');

    // POST manager Bob (TuftedTitmouseCoalition)
    // POST employee Alice (existing org, existing schedule)
    // GET existing manager, test
    // GET existing employee, E Lily Seropian
    // PUT change pw of E Lily Seropian 
    // GET all of ZhiftTest managers
    // GET all of ZhiftTest employees
    // DELETE a ZhiftTest manager
    // DELETE a ZhiftTest employee
    // GET all employees associated with crocheter  

}