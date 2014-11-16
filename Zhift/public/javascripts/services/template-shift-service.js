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
                callback(res);
            }).error(function(res) {
                // TODO: error handling
                console.log(res.responseText);
                callback(res.responseText);
            });
        },
    };
  
    return service;
}]);