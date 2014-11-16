/*  gridController
*
*   Angular Controller for shift mixin
*     Takes care of the view for the shift mixin while getting updates from ShiftService
*     for data updates.
*
*   Dependencies: ShiftService
* 
*   @author: Vicky Gong
*/

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('ShiftController', function($scope, ShiftService) {

    /*======================== Scope Variables ========================*/
    $scope.viewModel = {
        shifts: ShiftService.shifts,
        test: 'Controller test succeded!'
    };

    /* Updator function for shifts variables changing */
    $scope.$on('shifts.update', function(event) {
        $scope.viewModel.shifts = ShiftService.shifts;
    });

    /* Updator function for error variable changing */
    $scope.$on('images.error', function(event) {
        helpers.updateError();
    });

    /*============================== Helpers ============================*/
    var helpers = (function() { 

        /* Updates the error box */
        var updateError = function() {
            $('.grid .error').html(ShiftService.error);
        };

        /* Displays all shifts */
        var displayAllShifts = function() {
            ShiftService.displayAllShifts();
        };

        return {
            displayAllShifts: displayAllShifts,
            updateError : updateError
        };
    })();

    /* Initializer function 
    */
    var init = (function() {
        // helpers.displayAllShifts();
        ShiftService.test();
    })();

});

