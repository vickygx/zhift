/**
 * All routes relating to users.
 *
 * TODO: error handling, permissions, implement routes
 * 
 * @author: Dylan Joss
 */

var express = require('express');
var router = express.Router();

// Controllers
var OrgController = require('../controllers/organization');
var UserController = require('../controllers/user');
var ScheduleController = require('../controllers/schedule');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/**
 * POST to create a new manager.
 * Request body should contain:
 *     {String} username The username for the new manager.
 *     {String} email    The email for the new manager.
 *     {String} password The password for the new manager.
 *     {String} org      The organization the new manager belongs to.
 * Response body contains:
 *     {ManagerUser} The created manager.
 */
router.post('/manager', function(req, res) {
    UserController.createUser(req.body.username, req.body.email, req.body.password, req.body.org, null, function(err, manager) {
        if (err) {
            return res.send(err);
        }
        res.send(manager);
    });
});

/**
 * POST to create a new employee.
 * Request body should contain:
 *     {String} username The username for the new employee.
 *     {String} email    The email for the new employee.
 *     {String} password The password for the new employee.
 *     {String} org      The organization the new employee belongs to.
 *     {String} role     The name of the role for the new employee.
 * Response body contains:
 *     {EmployeeUser} The created employee.
 */
router.post('/employee', function(req, res) {
    // need to get the scheduleID in order to create employee
    ScheduleController.retrieveScheduleByOrgAndRole(req.body.org, req.body.role, function(err, schedule) {
        if (err) {
            return res.send(err);
        }
        UserController.createUser(req.body.username, req.body.email, req.body.password, req.body.org, schedule._id, function(err, employee) {
            if (err) {
                return res.send(err);
            }
            res.send(employee);
        });  
    });
});

/**
 * GET a manager by id.
 * No request body parameters required.
 * Response body contains:
 *     {ManagerUser} The retrieved manager.
 */
router.get('/manager/:id', function(req, res) {
    UserController.retrieveManagerById(req.param('id'), function(err, manager) {
        if (err) {
            return res.send(err);
        }
        res.send(manager);
    });
});

/**
 * GET an employee by id.
 * No request body parameters required.
 * Response body contains:
 *     {EmployeeUser} The retrieved employee.
 */
router.get('/employee/:id', function(req, res) {
    UserController.retrieveEmployeeById(req.param('id'), function(err, employee) {
        if (err) {
            return res.send(err);
        }
        res.send(employee);
    });
});

/**
 * PUT to change the password of a manager.
 */
router.put('/manager/:id', function(req, res) {
    // TODO: not for MVP
    throw new Error('PUT /manager/:id not implemented');
});

/**
 * PUT to change the password of an employee.
 */
router.put('/employee/:id', function(req, res) {
    // TODO: not for MVP
    throw new Error('PUT /employee/:id not implemented');
    
});

/**
 * GET all managers associated with an organization.
 * No request body parameters required.
 * Response body contains:
 *     {ManagerUser[]} The retrieved managers.
 */
router.get('/org/:id/manager', function(req, res) {
    UserController.retrieveManagersByOrgId(req.param('id'), function(err, managers) {
        if (err) {
            return res.send(err);
        }
        res.send(managers);
    });
});

/**
 * GET all employees associated with an organization.
 * No request body parameters required.
 * Response body contains:
 *     {EmployeeUser[]} The retrieved employees.
 */
router.get('/org/:id/employee', function(req, res) {
    UserController.retrieveEmployeesByOrgId(req.param('id'), function(err, employees) {
        if (err) {
            return res.send(err);
        }
        res.send(employees);
    });
});

/**
 * DELETE a user by id.
 */
router.delete('/:id', function(req, res) {
    // TODO: not for MVP
    // will need to delete from both user DB and manager/employee DB
    throw new Error('DELETE /:id not implemented');
});

/**
 * GET all employees associated with a schedule.
 * No request body parameters required.
 * Response body contains:
 *     {EmployeeUser[]} The retrieved employees.
 */
router.get('/sched/:id', function(req, res) {
    UserController.retrieveEmployeesByScheduleId(req.param('id'), function(err, employees) {
        if (err) {
            return res.send(err);
        } 
        res.send(employees);
    });
});

module.exports = router;