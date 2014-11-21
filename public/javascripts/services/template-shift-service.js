/**
 * TemplateShiftService
 * 
 * Angular Service for template shifts
 * 
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('TemplateShiftService', ['$rootScope', function($rootScope) {
    var service = {
        getTemplateShifts: function(scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/shift/template/all/' + scheduleId,
            }).success(function(res) {
                callback(res.shifts);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText);
            });
        },

        createTemplateShift: function(day, startTime, endTime, employeeId, scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'POST',
                url: '/shift/template/',
                data: {
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                    employeeId: employeeId,
                    scheduleId: scheduleId,
                },
            }).success(function(res) {
                callback(res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText);
            });
        }
    };
  
    return service;
}]);