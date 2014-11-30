/**
 * Angular Controller for an employee.
 *
 * @author: Lily Seropian
 *
 * TODO: error handling
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('UserController', function($scope, UserService) {
    $scope.init = function(userId) {
        console.log('init');
        $scope.userId = userId;
    }

    /**
     * Put up a shift for swap.
     * @param {ObjectId} shiftId The id of the shift to put up for swap.
     */
    $scope.changePassword = function(newPassword) {
        console.log('changing password');
        UserService.changePassword($scope.userId, newPassword, function(err, user) {
            if (err) {
                $('.message-container').text(err);
            }
        });
    };
});