/**
 * All routes relating to users.
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
    UserController.createManager(req.body.username, req.body.email, req.body.password, req.body.org, function(err, manager) {
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
    UserController.isManagerOfOrganization(req.user.email, req.body.org, function(err, isManager) {
        if (err) {
            return res.send(err);
        }
        if (!isManager) {
            return res.status(403).send('Unauthorized, you are not a manager of the appropriate organization.');
        }
        UserController.createEmployee(req.body.username, req.body.email, req.body.org, req.body.role, function(err, employee) {
            if (err) {
                return res.status(403).send(err);
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
 * PUT to change the password of a user.
 */
router.put('/:id', function(req, res) {
    var id = req.param('id');

    if (req.user._id.toString() !== id) {
        return res.status(403).send('Unauthorized, you cannot change the password of another user account.');
    }

    UserController.changePassword(id, req.body.password, function(err, user) {
        if (err) {
            return res.status(403).send(err);
        }
        res.send(user);
    });
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
 * DELETE a manager by id.
 */
router.delete('/manager/:id', function(req, res) {
    UserController.deleteManager(req.param('id'), function(err, user) {
        if (err) {
            return res.send(err);
        }
        res.status(200).end();
    });
});


/**
 * DELETE an employee by id.
 */
router.delete('/employee/:id', function(req, res) {
    UserController.deleteEmployee(req.param('id'), function(err, user) {
        if (err) {
            return res.send(err);
        }
        res.status(200).end();
    });
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