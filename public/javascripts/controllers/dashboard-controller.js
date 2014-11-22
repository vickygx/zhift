/**
 * Angular Controller for the dashboard.
 *
 * @author: Lily Seropian
 *
 * TODO: error handling
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('RecordController', function($scope, RecordService, ScheduleService) {

    $scope.init = function(scheduleId) {
        $scope.records = [];

        // is an employee
        if (scheduleId !== undefined) {
            console.log('is emp');
            ScheduleService.getSchedule(scheduleId, function(schedule) {
                console.log('got sched');
                RecordService.getRecordsFor(scheduleId, function(records) {
                    console.log('got records', records);
                    $scope.records.push({
                        role: schedule.role,
                        records: records,
                    });
                    console.log($scope);
                    $scope.$apply();
                });
            });
        }
    }
});