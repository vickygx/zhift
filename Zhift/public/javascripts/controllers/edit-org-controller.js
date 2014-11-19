/**
 * Angular Controller for editing an organization.
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EditOrgController', function($scope, ScheduleService) {
    $scope.init = function(org) {
        $scope.org = org;
        $scope.roleName = '';

        ScheduleService.getSchedules($scope.org, function(schedules) {
            $scope.roles = schedules;
            $scope.$apply();
        });
    }


    $scope.createSchedule = function() {
        ScheduleService.createSchedule($scope.org, $scope.roleName, function(newSchedule) {
            $scope.roles.push(newSchedule);
            $scope.roleName = '';
            $scope.$apply();
        });
    };
});