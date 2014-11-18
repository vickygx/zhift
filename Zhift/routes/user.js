/*  All routes relating to users 
    
    @author: Dylan Joss
*/

var express = require('express');
var router = express.Router();

// Controllers
var OrgController = require('../controllers/organization');
var UserController = require('../controllers/user');
var ScheduleController = require('../controllers/schedule');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* POST request to create new manager */
router.post('/manager', function(req, res) {
    UserController.createUser(req.body.username, req.body.email, req.body.password, req.body.org, null, function(err, manager) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(manager);
        }
    });
});

/* POST request to create new employee */
router.post('/employee', function(req, res) {
    // need to get the scheduleID in order to create employee
    ScheduleController.retrieveScheduleByOrgAndRole(req.body.org, req.body.role, function(err, schedule) {
        console.log(schedule);
        if (err) {
            res.send(err);
        }
        else {
            UserController.createUser(req.body.username, req.body.email, req.body.password, req.body.org, schedule._id, function(err, employee) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(employee);
                }
            });  
        }
    });    
});

/* GET the manager associated with the id */
router.get('/manager/:id', function(req, res) {
    UserController.retrieveManagerById(req.param('id'), function(err, manager) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(manager);
        }
    });
});

/* GET the employee associated with the id */
router.get('/employee/:id', function(req, res) {
    UserController.retrieveEmployeeById(req.param('id'), function(err, employee) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(employee);
        }
    });
});

/* PUT to change the password of the given manager */
router.put('/manager/:id', function(req, res) {
    // TODO: not for MVP
});

/* PUT to change the password of the given employee */
router.put('/employee/:id', function(req, res) {
    // TODO: not for MVP
});

/* GET all managers associated with the org with the id */
router.get('/org/:id/manager', function(req, res) {
    UserController.retrieveManagersByOrgId(req.param('id'), function(err, managers) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(managers);
        }
    });
});

/* GET all employees associated with the org with the id */
router.get('/org/:id/employee', function(req, res) {
    UserController.retrieveEmployeesByOrgId(req.param('id'), function(err, employees) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(employees);
        }
    });
});

/* DELETE the user with the id */
router.delete('/:id', function(req, res) {
    // TODO: not for MVP
    // will need to delete from both user DB and manager/employee DB
});

/* GET all employees associated with the schedule with the id */
router.get('/sched/:id', function(req, res) {
    UserController.retrieveEmployeesByScheduleId(req.param('id'), function(err, employees) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(employees);
        }
    });
});

module.exports = router;
