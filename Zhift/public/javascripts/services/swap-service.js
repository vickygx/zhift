/**
 * SwapService
 *
 * Angular Service for swaps.
 * 
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.service('SwapService', ['$rootScope', function($rootScope) {
    var service = {
        putUpForSwap: function(shiftId, scheduleId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'POST',
                url: '/swap/',
                data: {
                    shiftId: shiftId,
                    scheduleId: scheduleId,
                }
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                // TODO: error handling
                callback(res);
            });
        },
    };

    return service;
}]);