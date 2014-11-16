/**
 * Angular Controller for the home page.
 *
 * @author: Lily Seropian
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('HomeController', function($scope, ShiftService) {

    /*======================== Scope Variables ========================*/
    $scope.page = 'home';

    $scope.goToPage = function(page) {
        $scope.page = page;
    };
});