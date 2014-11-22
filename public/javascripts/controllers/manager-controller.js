/**
 * Angular Controller for the manager portion of the site.
 *
 * Managers can:
 *     See all roles
 *     Add roles
 *     See all template shifts
 *     See all shifts
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('ManagerController', function($scope, ScheduleService, ShiftService, TemplateShiftService, UserService) {
    $scope.currentPage = 'Home';
    
    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     */
    $scope.init = function(org) {
        $scope.org = org;
        $scope.schedules = {};
        $scope.employees = {};
        $scope.employeeId = {};
        $scope.templateShifts = {};
        $scope.templateShiftId = {};

        ScheduleService.getSchedules($scope.org, function(schedules) {
            $scope.scheduleId = schedules[0]._id;

            schedules.forEach(function(schedule) {
                $scope.schedules[schedule._id] = schedule;

                ShiftService.getShifts(schedule._id, function(err,shifts) {
                    schedule.shifts = shifts;
                    $scope.$apply();
                });

                TemplateShiftService.getTemplateShifts(schedule._id, function(err, templateShifts) {
                    schedule.templateShifts = templateShifts;
                    $scope.templateShifts[schedule._id] = templateShifts.map(function(s) { return s._id; });
                    if (templateShifts.length === 0) {
                        $scope.templateShifts[schedule._id] = ['None'];
                    }
                    $scope.templateShiftId[schedule._id] = $scope.templateShifts[schedule._id][0];
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

    /**
     * Create a new shift, save it to the database, and display it in the frontend.
     */
    $scope.createShift = function(day, startTime, endTime, scheduleId, employeeId, date, templateShiftId) {
        ShiftService.createShift(day, startTime, endTime, employeeId, scheduleId, date, templateShiftId, function(shift) {
            $scope.schedules[scheduleId].shifts.push(shift);
            $scope.$apply();
        });
    };
});