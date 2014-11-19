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

ZhiftApp.controller('ManagerController', function($scope, ScheduleService, ShiftService, TemplateShiftService) {
    $scope.currentPage = 'Home';
    
    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     */
    $scope.init = function(org) {
        $scope.org = org;
        $scope.roles = [];

        ScheduleService.getSchedules($scope.org, function(schedules) {
            $scope.roles = schedules;

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
            });
        });
    };

    /**
     * Create a new schedule, save it to the database, and display it in the frontend.
     */
    $scope.createSchedule = function(roleName) {
        ScheduleService.createSchedule($scope.org, roleName, function(err,newSchedule) {
            // TODO: if err, do something
            if (!err){
                newSchedule.shifts = [];
                newSchedule.templateShifts = [];
                $scope.roles.push(newSchedule);
                $scope.$apply();
            }
        });
    };
});