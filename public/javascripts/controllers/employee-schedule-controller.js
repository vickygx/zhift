/**
 * Angular Controller for the employee template shift schedule
 *  portion of the site.
 *
 * Managers can:
 *     See all template shifts for a schedule
 *
 * @author: Vicky Gong
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EmployeeScheduleController', function($scope, ShiftService) {

    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     *         {String} username The name of the user currently logged in
     */        
    $scope.init = function(username, org, scheduleId) {
        $scope.username = username;
        $scope.org = org;
        $scope.currentScheduleId = scheduleId;
        resetShifts();

        // Populating templates based on current schedule
        getShifts($scope.currentScheduleId, function(err) {
            $scope.$apply();
        });
       

    };

    /*  Gets template shifts associated with the scheduleId and 
    *   populates $scope.shiftsByDay such that it has the following format:
    *   
    *   $scope.shiftsByDay = {
    *       'Monday': {
    *           8: [], // list of template shifts starting at 8am on Monday
    *           9: [],
    *           etc.
    *        }
    *       'Tuesday':
    *       etc.
    *   }
    *
    *   @param {ObjectId} scheduleId        id of the schedule to get template shfits for
    *   @param {function} callback          callback function that takes err if there is an error, or null 
    *
    */
    var getShifts = function(scheduleId, callback){
        //TODO: make sure it's organized by DATE also
        ShiftService.getShifts(scheduleId, function(err, shifts){
            if (!err){
                resetShifts();
                // Go through template shifts
                for (var i = 0; i < shifts.length; i++){
                    var templateDay = shifts[i].dayOfWeek;
                    var templateHour = getHour(shifts[i].start);

                    var scopeDayHour = $scope.shiftsByDay[templateDay];
                    
                    // Append templateshift to proper day and hour
                    if (!scopeDayHour[templateHour]){
                        scopeDayHour[templateHour] = [];
                    }

                    scopeDayHour[templateHour].push(shifts[i]);
                }
                callback();
            }
            else {
                callback(err);
            }
        });
    }

    var resetShifts = function(){
        $scope.shiftsByDay = 
            {'Monday': {},
            'Tuesday': {},
            'Wednesday': {},
            'Thursday': {},
            'Friday': {},
            'Saturday': {},
            'Sunday': {}};
    }
    /*  Returns the hour of "HH:MM" */
    var getHour = function(string){
        return parseInt(string.split(":")[0]);
    }

    $scope.isMyShift = function(shiftOwnerName) {
        return shiftOwnerName == $scope.username;
    }

    $scope.isUpForGrabs = function(shiftOwnerName, shiftId) {
        if (!$scope.isMyShift(shiftOwnerName)) {
            ShiftService.getShift(shiftId, function(err, shift) {
                if (!err) {
                    return shfit.upForGrabs;
                }
            })
        }
    }

    $scope.tradeShift = function(){

    }

    $scope.putUpShift = function(){

    }

    $scope.grabShift = function(){

    }
   
})
.directive('temp', function(){
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                evt.stopPropagation();
            });
        }
    };
});
