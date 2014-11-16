/**
 * Angular Controller for shift mixin. Takes care of the view for the shift mixin.
 *
 * Dependencies: ShiftService, ScheduleService
 * 
 * @author: Lily Seropian, Vicky Gong
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('ShiftController', function($scope, ScheduleService, ShiftService) {
    $scope.init = function(org) {
        $scope.org = org;
        
        ScheduleService.getSchedules($scope.org, function(schedules) {
            $scope.roles = schedules;
            $scope.roles.forEach(function(role) {
                ShiftService.getShifts(role._id, function(shifts) {
                    role.shifts = shifts;
                    $scope.$apply();
                });
            });
        });
    }
});

