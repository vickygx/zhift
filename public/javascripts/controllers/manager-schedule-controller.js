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
    
    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     */
    $scope.init = function(org) {
        $scope.org = org;
        $scope.schedules = {};
        $scope.employees = {};
        $scope.employeeId = {};

        ScheduleService.getSchedules($scope.org, function(schedules) {
            $scope.scheduleId = schedules[0]._id;

            schedules.forEach(function(schedule) {
                $scope.schedules[schedule._id] = schedule;

                ShiftService.getShifts(schedule._id, function(shifts) {
                    schedule.shifts = shifts;
                    $scope.$apply();
                });

                TemplateShiftService.getTemplateShifts(schedule._id, function(templateShifts) {
                    schedule.templateShifts = templateShifts;
                    $scope.$apply();
                });


                UserService.getEmployeesForSchedule(schedule._id, function(employees) {
                    $scope.employees[schedule._id] = employees;
                    if (employees.length === 0) {
                        $scope.employees[schedule._id] = [{name: 'None', _id: 'None'}];   
                    }
                    $scope.employeeId[schedule._id] = $scope.employees[schedule._id][0]._id;
                });
            });
        });
    };

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