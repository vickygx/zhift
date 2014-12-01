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
    $scope.init = function(userId, username, org, scheduleId) {
        $scope.currentUserId = userId;
        $scope.username = username;
        $scope.org = org;
        $scope.currentScheduleId = scheduleId;
        $scope.activeShift = {}
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

    $scope.setActiveShiftInfo = function(id, day, startTime, endTime) {
        $scope.activeShift = {
            shiftId: id,
            day: day,
            startTime: hourToHHMM(startTime),
            endTime: hourToHHMM(endTime)
        }
        $scope.$apply();
    }

    /*  Returns the hour of "HH:MM" */
    var getHour = function(string){
        return parseInt(string.split(":")[0]);
    }

    var hourToHHMM = function(hour) {
        // If hour is single digit
        var hourString = String(hour);
        if (hour < 10 && hour >= 0) {
            hourString = '0' + hourString;
        }
        return hourString + ':00';
    };

    $scope.isMyShift = function(shiftOwnerName, shiftId) {
        return (shiftOwnerName == $scope.username);
    };

    $scope.isUpForGrabs = function(shiftId) {
        ShiftService.getShift(shiftId, function(err, shift) {
            if (shift) {
                return shift.upForGrabs;
            }
        })     
    };

    $scope.tradeShift = function(){

    }

    $scope.putUpShift = function(shiftId) {
        ShiftService.putUpForGrabs(shiftId, function(err, shift) {
            if (!err) {
            }
        })
    }

    $scope.claimShift = function(shiftId, employeeId) {
        ShiftService.claim(shiftId, employeeId, function(err, shift) {
            if (!err) {

            }
        })
    }
})

.directive('temp', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                evt.stopPropagation();
            });
        }
    };
})

.directive('setActiveShiftInfo', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                // Store information of clicked shift
                scope.setActiveShiftInfo(
                    evt.currentTarget.dataset.shiftId, 
                    evt.currentTarget.dataset.dayWeek, 
                    evt.currentTarget.dataset.startTime,
                    evt.currentTarget.dataset.endTime
                );
                console.log(
                    evt.currentTarget.dataset.shiftId, 
                    evt.currentTarget.dataset.dayWeek, 
                    evt.currentTarget.dataset.startTime,
                    evt.currentTarget.dataset.endTime
                );
            });
        }
    };
})

.directive('putUpShift', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                scope.putUpShift(
                    scope.activeShift['shiftId']
                );
            });
        }
    };
})

.directive('claimShift', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                scope.claimShift(
                    scope.activeShift['shiftId'],
                    scope.currentUserId
                );
            });
        }
    };
})
