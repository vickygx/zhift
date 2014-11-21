/**
 * Angular Controller for the manager template shift schedule
 *  portion of the site.
 *
 * Managers can:
 *     See all template shifts for a schedule
 *
 * @author: Vicky Gong, Anji Ren
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('ManagerScheduleController', function($scope, ScheduleService, TemplateShiftService, UserService) {
    
    // $scope.templateShiftsByDay = {
    //     'Monday': {
    //         1: [{}, {}], 
    //         2: [] // shift object
    //     }
        
    //     'Tuesday': {

    //     }
    // }



    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     */
    $scope.init = function(org) {
        $scope.currentSchedule = 1;
        $scope.scheduleIds = [];
        $scope.employeesBySchedule = {};
        $scope.templateShiftsByDay = 
            {'Monday': {},
            'Tuesday': {},
            'Wednesday': {},
            'Thursday': {},
            'Friday': {},
            'Saturday': {},
            'Sunday': {}};
        getAllSchedules();
        setCurrentSchedule($scope.schedules[0]);
        //getAllEmployees

    };

    var getTemplateShifts = function(scheduleId){
        TemplateShiftService.getTemplateShifts(scheduleId, function(err, templateShifts){
            if (!err){
                // Go through template shifts
                for (var i; i < templateShifts.length; i++){
                    var templateDay = templateShifts[i].dayOfWeek;
                    var templateHour = getHour(templateShifts[i].start);

                    var scopeDayHour = $scope.templateShiftsByDay[templateDay];
                    
                    // Append templateshift to proper day and hour
                    if (!scopeDayHour[templateHour]){
                        scopeDayHour[templateHour] = [];
                    }

                    scopeDayHour[templateHour].append(templateShifts[i]);
                }
            }
        });
    }

    /*  Turns "HH:MM" into hour */
    var getHour = function(string){
        return 1;
    }

    $scope.getAllSchedules = function(orgId) {

    }

    $scope.setCurrentSchedule = function(scheduleId) {
        $scope.currentSchedule = scheduleId;
        getTemplateShifts(scheduleId);
        $scope.apply();
    }

    $scope.createTemplateShift = function(day, startTime, endTime, employeeId, scheduleId){
        TemplateShiftService.createTemplateShift(day, startTime, endTime, employeeId, scheduleId, 
            function(err, newTemplateShift){
                if (!err){

                }
            });
    }
    /**
     * Create a new schedule, save it to the database, and display it in the frontend.
     */
    $scope.createSchedule = function(scheduleName) {
        ScheduleService.createSchedule($scope.org, scheduleName, function(err, newSchedule) {
            // TODO: if err, do something
            if (!err){
                newSchedule.shifts = [];
                newSchedule.templateShifts = [];
                $scope.schedules[newSchedule._id] = newSchedule;
                $scope.$apply();
            }
        });
    };

    /**
     * Create a new template shift, save it to the database, and display it in the frontend.
     */
    $scope.createTemplateShift = function(day, startTime, endTime, scheduleId, employeeId) {
        TemplateShiftService.createTemplateShift(day, startTime, endTime, employeeId, scheduleId, function(templateShift) {
            $scope.schedules[scheduleId].templateShifts.push(templateShift);
            $scope.$apply();
        });
    };
});