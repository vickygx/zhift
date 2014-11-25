/**
 * SwapService
 *
 * Angular Service for swaps.
 * TODO: error handling
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
                callback(res);
            });
        },

        proposeSwap: function(swapId, shiftId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'PUT',
                url: '/swap/' + swapId,
                data: {
                    shiftId: shiftId,
                }
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                callback(res);
            });
        },

        getSwapForShift: function(shiftId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'GET',
                url: '/swap/shift/' + shiftId,
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                callback(res);
            });
        },

        acceptSwap: function(swapId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'PUT',
                url: '/swap/' + swapId,
                data: {
                    acceptSwap: true,
                }
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                callback(res);
            });
        },

        rejectSwap: function(swapId, callback) {
            $.ajax({
                datatype: 'json',
                type: 'PUT',
                url: '/swap/' + swapId,
                data: {
                    acceptSwap: false,
                }
            }).success(function(res) {
                callback(res);
            }).error(function(res){
                callback(res);
            });
        }
    };

    return service;
}]);