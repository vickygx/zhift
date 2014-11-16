/**
 * Angular Controller for template shift viewing.
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('TemplateShiftController', function($scope, ScheduleService, TemplateShiftService) {
    // TODO: don't hardcode
    ScheduleService.getSchedules('test', function(schedules) {
        $scope.roles = schedules;
        $scope.roles.forEach(function(role) {
            TemplateShiftService.getTemplateShifts(role._id, function(templateShifts) {
                role.templateShifts = templateShifts;
                $scope.$apply();
            });
        });
    });
});