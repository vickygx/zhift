/**
 * Angular Controller for editing an organization.
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EditOrgController', function($scope, ScheduleService) {
    // TODO: don't hardcode
    ScheduleService.getSchedules('test', function(schedules) {
        $scope.roles = schedules;
        $scope.$apply();
    });

    $scope.roleName = '';

    $scope.createSchedule = function(orgName) {
        ScheduleService.createSchedule(orgName, $scope.roleName, function(newSchedule) {
            $scope.roles.push(newSchedule);
            $scope.roleName = '';
            $scope.$apply();
        });
    };
});