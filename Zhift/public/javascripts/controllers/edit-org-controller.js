/**
 * Angular Controller for editing an organization.
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EditOrgController', function($scope, ScheduleService) {
    $scope.init = function(org) {
        $scope.org = org;

        ScheduleService.getSchedules($scope.org, function(schedules) {
            $scope.roles = schedules;
            $scope.$apply();
        });
    }

    $scope.roleName = '';

    $scope.createSchedule = function() {
        ScheduleService.createSchedule($scope.org, $scope.roleName, function(newSchedule) {
            $scope.roles.push(newSchedule);
            $scope.roleName = '';
            $scope.$apply();
        });
    };
});