/**
 * TemplateShiftService
 * 
 * Angular Service for template shifts
 * 
 * @author: Lily Seropian, Anji Ren
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('TemplateShiftService', ['$rootScope', function($rootScope) {
    var service = {
        getTemplateShifts: function(scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/template/all/' + scheduleId,
            }).success(function(res) {
                callback(null, res);
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
                url: '/template/',
                data: {
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                    employeeId: employeeId,
                    scheduleId: scheduleId,
                },
            }).done(function(res) {
                callback(null, res);
            }).fail(function(res) {
                // TODO: error handling
                callback(res.responseText);
            });
        },

        reassignTemplateShift: function(id, day, startTime, endTime, reassignToEmployeeId, scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'DELETE',
                url: '/template/' + id,
            }).success(function(res) {
                console.log('delete success!')
                $.ajax({
                    datatype: 'json',
                    type: 'POST',
                    url: '/template/',
                    data: {
                        day: day,
                        startTime: startTime,
                        endTime: endTime,
                        employeeId: employeeId,
                        scheduleId: scheduleId,
                    },
                }).success(function(res) {
                    console.log('recreate success!');
                    callback(res);
                }).error(function(res) {
                    // TODO: error handling
                    console.log('recreate fail');
                    console.log(res.responseText);
                    callback(res.responseText);
                });
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText);
            })
        }
    };
  
    return service;
}]);