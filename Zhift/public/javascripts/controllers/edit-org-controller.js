/**
 * Angular Controller for editing an organization.
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EditOrgController', function($scope, EditOrgService) {
    $scope.roleName = '';

    $scope.createSchedule = function() {
        // TODO: don't hardcode org
        EditOrgService.createSchedule('test', $scope.roleName);
    };
});