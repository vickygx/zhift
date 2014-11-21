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
        $scope.roles = [];

        $scope.day = 'Monday';
        $scope.startTime = '00:00';
        $scope.endTime = '00:00';
        $scope.employees = {};
        $scope.employeeId = {};

        ScheduleService.getSchedules($scope.org, function(schedules) {
            $scope.roles = schedules;
            $scope.scheduleId = $scope.roles[0]._id;

            // For each role, get template shifts and shifts
            $scope.roles.forEach(function(role) {
                ShiftService.getShifts(role._id, function(shifts) {
                    role.shifts = shifts;
                    $scope.$apply();
                });

                TemplateShiftService.getTemplateShifts(role._id, function(templateShifts) {
                    role.templateShifts = templateShifts;
                    $scope.$apply();
                });

                UserService.getEmployeesForSchedule(role._id, function(employees) {
                    $scope.employees[role._id] = employees;
                    if (employees.length === 0) {
                        $scope.employees[role._id] = [{name: 'None', _id: 'None'}];   
                    }
                    $scope.employeeId[role._id] = $scope.employees[role._id][0]._id;
                });
            });
        });
    };

    /**
     * Create a new schedule, save it to the database, and display it in the frontend.
     */
    $scope.createSchedule = function(roleName) {
        ScheduleService.createSchedule($scope.org, roleName, function(err, newSchedule) {
            // TODO: if err, do something
            if (!err){
                newSchedule.shifts = [];
                newSchedule.templateShifts = [];
                $scope.roles.push(newSchedule);
                $scope.$apply();
            }
        });
    };

    /**
     * Create a new template shift, save it to the database, and display it in the frontend.
     */
    $scope.createTemplateShift = function(day, startTime, endTime, scheduleId, employeeId) {
        console.log($scope);
        TemplateShiftService.createTemplateShift(day, startTime, endTime, 
            employeeId, scheduleId, function(templateShift) {
            console.log(templateShift);
        });
    };
});