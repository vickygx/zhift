/*  File controller all the routes relating to shifts
    
    @author: Vicky Gong 
*/
var express = require('express');
var router = express.Router();

// Controllers
var ShiftController = require('../controllers/shift');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express through shift for now' });
});

/*  POST request to create shift */
router.post('/', function(req, res){
    // TODO: check user logged in is a manager of schedule given

    // Getting parameters
    day = req.body.day;
    startTime = req.body.startTime;
    endTime = req.body.endTime;
    employee = req.body.employeeId;
    schedule = req.body.scheduleId;
    date = req.body.date;

    // TODO sanitize parameters? / make sure they exist?

    ShiftController.createShift(day, startTime, endTime, employee, schedule, date,
        function(err, shift){
            // TODO: cover all error cases / send proper error
            if (err){
                // we can send custom errors instead
                next(err);
            } else {
                res.send(shift);
            }
        });
});

/*  POST request to put shift up for grabs */
router.put('/putUpForGrabs/:id', function(req, res){
    // TODO: make sure user logged in is owner of shift

    ShiftController.putUpForGrabs(req.param('id'), function(err, shift){
        // TODO : error handling
        if (err){
            next(err);
        } else if (shift){
            res.send(shift);
        } else {
            next(errors.shifts.invalidShiftId);
        }
    });
});

/*  GET request to get all shifts associated with a user*/
router.get('user/:userid', function(req, res){
    //TODO: make sure session user is userid
    //TODO: can change the format if we only doign for session id to using req.session.user

    ShiftController.getAllUserShifts(req.param('userid'),
        function(err, shifts){
            // TODO: erorr handling
            if (err){
                next(err);
            } else if (shifts){
                res.send({'shifts': shifts});
            } else {
                next(errors.users.invalidUserId);
            }
        });
});

/*  GET request to get all shifts associated with a schedule */
router.get('/all/:scheduleid', function(req, res){
    //TODO: make sure user is part of schedule / manager
    
    ShiftController.getAllShiftsOnASchedule(req.param('scheduleid'),
        function(err, shifts){
            // TODO: erorr handling
            if (err){
                next(err);
            } else if (shifts){
                res.send({'shifts': shifts});
            } else {
                next(errors.schedules.invalidScheduleId);
            }
        });
});

/*  GET request to get all shifts being offered associated with a schedule */
router.get('/upForGrabs/:scheduleid', function(req, res){
    // TODO: make sure user is part of same schedule/ manger

    ShiftController.getOfferedShiftsOnASchedule(req.param('scheduleid'),
        function(err, shifts){
            // TODO : error handling
            if (err) {
                next(err);
            }
            else if (shifts){
                res.send({'shifts': shifts});
            }
            else {
                next(errors.schedules.invalidScheduleId);
            }
        });
});

/*  GET request to claim a given shift by user who is logged in */
router.get('/claimShift/:id', function(req, res){
    // Make sure user logged in is in same schedule as shift to claim
    employeeId = 'tempIdOfPersonLoggedIn';

    ShiftController.giveShiftTo(req.param('id'), employeeId,
        function(err, shift){
            // TODO : error handling
            if (err) {
                next(err);
            }
            else if (shifts){
                res.send(shift);
            }
            else {
                next(errors.schedules.invalidShiftId);
            }
        });

});

module.exports = router;